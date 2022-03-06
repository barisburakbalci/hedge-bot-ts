import TelegramBot from './TelegramBot';
import IExchangeApi from '../interfaces/IExchange';
import Logger from './Logger';
import IOrder from '../interfaces/IOrder';
import IPosition from '../interfaces/IPosition';
import { Side } from '../Enums';
import LimitOrder from './Orders/LimitOrder';

class PositionService {
    longActionPrice: number = 0;
    shortActionPrice: number = 0;
    maxPrice: number = 0;
    minPrice: number = 0;
    isInitialState = false;
    isStarted= false;
    openOrders: IOrder[] = [];
    position: IPosition = {} as IPosition;
    orderIteration = 1;
    lastSide: Side = 'SELL';
    balance: number = 0;
    protectLoss: boolean = false;
    preserveNewPositions: boolean = true;
    quantity: number = 0;

    constructor(
        private Exchange: IExchangeApi,
        private NotificationService: TelegramBot,
        private tradeRange: number,
        private initialQuantity: number,
        private actionRatio: number,
        private leverage: number
    ) {}

    async run(): Promise<void> {  
        if (this.isStarted) {
            this.position = await this.Exchange.getPosition();
            const positionSize = Math.abs(this.position.positionAmt);

            if (!this.isInitialState && positionSize == 0) {
                this.isStarted = false;

                const balanceInfo = await this.Exchange.getBalance();
                const profit = balanceInfo.balance - this.balance;
                this.balance = balanceInfo.balance;

                this.NotificationService.sendMessage('Realized profit: $' + profit + '\nBalance: $' + this.balance);
                Logger.LogInfo('Realized profit: $' + profit);
                Logger.LogInfo('Balance: ' + this.balance);
                Logger.LogInfo('HEDGEBOT RESTARTED');
                return;
            } else if (this.isInitialState && positionSize > 0) {
                this.isInitialState = false;
                await this.Exchange.setTPSL('BUY', this.minPrice, this.maxPrice);
                await this.Exchange.setTPSL('SELL', this.maxPrice, this.minPrice);
                const balanceInfo = await this.Exchange.getBalance();
                this.balance = balanceInfo.balance;
            }

            if (this.protectLoss) {
                return;
            }

            const nextSide = this.getNextPositionSide();
            const positionUSDTSize = this.position.notional / this.leverage;

            if (positionUSDTSize > this.balance / 2.5 || positionUSDTSize > this.position.maxNotionalValue / 2.5) {
                await this.Exchange.cancelAllOrders();
                const stopLosePrice = Math.floor((this.maxPrice + this.minPrice) / 2);
                if (nextSide == 'BUY') {
                    const takeLongProfit = Math.floor((this.maxPrice + this.longActionPrice) / 2);
                    await this.Exchange.setTPSL('SELL', takeLongProfit, stopLosePrice);
                } else {
                    const takeShortProfit = Math.floor((this.minPrice + this.shortActionPrice) / 2);
                    await this.Exchange.setTPSL('BUY', takeShortProfit, stopLosePrice);
                }
                
                this.protectLoss = true;
                return;
            }

            const openOrders = await this.Exchange.getOpenOrders();
            const protectionSignalOrder = openOrders.find(order => order.type === 'LIMIT') as LimitOrder;
            const openMarketOrders = openOrders.filter(o => o.type === 'STOP_MARKET');

            if (protectionSignalOrder?.price < this.minPrice) {
                this.preserveNewPositions = false;
            }

            if (!openMarketOrders.length) {
                await this.createNextOrder(nextSide);
            }
        } else {
            await this.setPositionRange();
        }
    }

    async setPositionRange(): Promise<void> {
        if (!this.preserveNewPositions) {
            process.exit(1);
        }
        
        const price = await this.Exchange.getMarkPrice();

        this.longActionPrice    = Math.floor(price * (1 + this.tradeRange / this.actionRatio));
        this.shortActionPrice   = Math.floor(price * (1 - this.tradeRange / this.actionRatio));
        this.maxPrice           = Math.floor(price * (1 + this.tradeRange));
        this.minPrice           = Math.floor(price * (1 - this.tradeRange));

        Logger.LogInfo(`Initial orders were set with amount: ${this.initialQuantity / 2} ${this.Exchange.symbol}`);
        let message = `${this.Exchange.symbol} <b>${price}</b>`;
        message += '\nInitail orders set for:';
        message += `\n<i>BuyAt:</i> ${this.longActionPrice}`;
        message += `\n<i>SellAt:</i> ${this.shortActionPrice}`;
        message += `\n<i>UpLimit:</i> ${this.maxPrice}`;
        message += `\n<i>DownLimit:</i> ${this.minPrice}`;
        message += `\n<i>Range:</i> %${this.tradeRange * 200}`;
        message = message;

        this.NotificationService.sendMessage(message);

        await this.Exchange.cancelAllOrders();
        this.quantity = this.initialQuantity;

        const initialStartOrder = await this.Exchange.openMarketOrder(this.lastSide, this.quantity / 2);

        if (initialStartOrder) {
            this.isInitialState = true;
            this.isStarted = true;
            this.orderIteration = 1;
            this.protectLoss = false;
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
        this.NotificationService.sendMessage(message);
        Logger.LogInfo('Order ' + this.orderIteration + ' set for ' + this.quantity + ' ' + this.Exchange.symbol);
    }
}

export default PositionService;