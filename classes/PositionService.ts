import TelegramBot from './TelegramBot';
import IExchangeApi from '../interfaces/IExchange';
import Logger from './Logger';
import IOrder from '../interfaces/IOrder';
import IPosition from '../interfaces/IPosition';
import { Side } from '../Enums';

class PositionService {
    Exchange: IExchangeApi;
    NofiticationService: TelegramBot;
    longActionPrice: number;
    shortActionPrice: number;
    maxPrice: number;
    minPrice: number;
    isInitialState = false;
    isStarted= false;
    openOrders: IOrder[];
    position: IPosition;
    volatility: number;
    initialQuantity: number;
    quantity: number;
    orderIteration = 1;
    lastSide: Side = 'SELL';

    constructor(Exchange: IExchangeApi, NotificationService: TelegramBot, volatility: number, initialQuantity: number) {
        this.Exchange = Exchange;
        this.volatility = volatility;
        this.initialQuantity = initialQuantity;
        this.quantity = initialQuantity;
        this.NofiticationService = NotificationService;
    }

    async run(): Promise<void> {  
        if (this.isStarted) {
            this.position = await this.Exchange.getPosition();
            const positionSize = Math.abs(this.position.positionAmt);

            if (!this.isInitialState && positionSize == 0) {
                this.isStarted = false;
                console.log('-'.repeat(10), 'HedgeBot is restarted', '-'.repeat(10));
                return;
            } else if (this.isInitialState && positionSize > 0) {
                this.isInitialState = false;
            }

            const openOrderCount = (await this.Exchange.getOpenOrders()).length;
            if (!openOrderCount) {
                const nextSide = this.getNextPositionSide();
                await this.createNextOrder(nextSide);
                await this.Exchange.setTPSL(nextSide, this.minPrice, this.maxPrice);
            }
        } else {
            await this.setPositionRange();
        }
    }

    async setPositionRange(): Promise<void> {
        const price = await this.Exchange.getMarkPrice();

        this.longActionPrice    = Math.floor(price * (1 + this.volatility / 6));
        this.shortActionPrice   = Math.floor(price * (1 - this.volatility / 6));
        this.maxPrice           = Math.floor(price * (1 + this.volatility));
        this.minPrice           = Math.floor(price * (1 - this.volatility));

        Logger.LogInfo(`Initial orders were set with amount: ${this.initialQuantity / 2} ${this.Exchange.symbol}`);
        let message = `${this.Exchange.symbol} <b>${price}</b>`;
        message += '\nInitail orders set for:';
        message += `\n<i>BuyAt:</i> ${this.longActionPrice}`;
        message += `\n<i>SellAt:</i> ${this.shortActionPrice}`;
        message += `\n<i>UpLimit:</i> ${this.maxPrice}`;
        message += `\n<i>DownLimit:</i> ${this.minPrice}`;
        message += `\n<i>Range:</i> %${this.volatility * 200}`;
        message = message;

        this.NofiticationService.sendMessage(message);

        await this.Exchange.cancelAllOrders();
        this.quantity = this.initialQuantity;

        //const initialBuyOrder = await this.Exchange.openStopOrder('BUY', this.quantity, this.longActionPrice);
        //const initialSellOrder = await this.Exchange.openStopOrder('SELL', this.quantity, this.shortActionPrice);
        const initialStartOrder = await this.Exchange.openMarketOrder(this.lastSide, this.quantity / 2);

        if (initialStartOrder) {
            this.isInitialState = true;
            this.isStarted = true;
            this.orderIteration = 1;
        }
    }

    getNextPositionSide(): Side {
        if (Number(this.position.positionAmt) > 0) {
            this.lastSide = 'SELL';
        } else {
            this.lastSide = 'BUY';
        }

        return this.lastSide;
    }

    async createNextOrder(side: Side): Promise<IOrder> {
        const actionPrice = side === 'BUY' ? this.longActionPrice : this.shortActionPrice;
        const order = await this.Exchange.openStopMarketOrder(side, this.quantity * 2, actionPrice);
        
        if (order) {
            this.quantity *= 2;
            this.orderIteration++;
            
            this.notifyOrderCreation();
        }

        return order;
    }

    notifyOrderCreation(): void {
        const side = this.orderIteration > 1 ? this.getNextPositionSide() : 'BOTH'
        const message = `<b>Order ${this.orderIteration}:</b> ${side} ${this.quantity} ${this.Exchange.symbol} <i>created</i>`;
        this.NofiticationService.sendMessage(message);
        Logger.LogInfo('Order ' + this.orderIteration + ' set for ' + this.quantity + ' ' + this.Exchange.symbol);
    }
}

export default PositionService;