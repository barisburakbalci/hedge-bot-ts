import axios from 'axios';
import * as crypto from 'crypto';
import IExchangeApi from '../interfaces/IExchange';
import { HttpMethod, ApiVersion, Side } from '../Enums';
import IOrder from '../interfaces/IOrder';
import IPosition from '../interfaces/IPosition';
import Order from './Order';
import Logger from './Logger';
import IBalance from '../interfaces/IBalance';

class Binance implements IExchangeApi {
    baseURL = 'https://fapi.binance.com/fapi';
    apiKey: string;
    apiSecret: string;
    symbol: string;
    precision: number;

    constructor(apiKey: string, apiSecret: string, symbol: string, precision: number) {
        this.apiKey = apiKey;
        this.apiSecret = apiSecret;
        this.symbol = symbol;
        this.precision = precision;
        axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded';
        axios.defaults.headers['X-MBX-APIKEY'] = apiKey;
    }

    async _getDataFrom(httpMethod: HttpMethod, apiEndpoint: string, version: ApiVersion, params: Record<string, string> = {}): Promise<Object> {
        const URL = `${this.baseURL}/${version}/${apiEndpoint}`;

        params.symbol = this.symbol;
        params.timestamp = new Date().getTime().toString();
        
        const queryString = new URLSearchParams(params).toString();
        const signature = crypto.createHmac('sha256', this.apiSecret).update(queryString).digest('hex');

        try {
            const { data } = await axios[httpMethod.toLowerCase()](URL + '?' + queryString + '&signature=' + signature);
            return data;
        } catch (error) {
            Logger.LogError(error?.response?.data?.msg, error);
            return;
        }
    }
    async getBalance(): Promise<IBalance> {
        const balances = await this._getDataFrom('GET', 'balance', 'v2') as IBalance[];
        return balances.find(balance => balance.asset == 'USDT');
    }
    async getMarkPrice(): Promise<number> {
        interface MarkPriceResponse {
            markPrice: string;
        }

        const data = await this._getDataFrom('GET', 'premiumIndex', 'v1') as MarkPriceResponse;
        return Number(parseFloat(data.markPrice).toFixed(this.precision));
    }
    async getOpenOrders(): Promise<IOrder[]> {
        const orders = await this._getDataFrom('GET', 'openOrders', 'v1') as IOrder[];
        return orders.filter(o => !o.closePosition);
    }
    async getPosition(): Promise<IPosition> {
        const positions = await this._getDataFrom('GET', 'positionRisk', 'v2') as IPosition[];
        return positions[0];
    }
    async openStopOrder(side: Side, quantity: number, price: number): Promise<IOrder> {
        const order = new Order(side, 'STOP', quantity, price, price);
        return await this._getDataFrom('POST', 'order', 'v1', order.toRecord()) as IOrder;
    }
    async openStopMarketOrder(side: Side, quantity: number, stopPrice: number): Promise<IOrder> {
        const order = new Order(side, 'STOP_MARKET', quantity, null, stopPrice);
        return await this._getDataFrom('POST', 'order', 'v1', order.toRecord()) as IOrder;
    }
    async openMarketOrder(side: Side, quantity: number): Promise<IOrder> {
        const order = new Order(side, 'MARKET', quantity);
        return await this._getDataFrom('POST', 'order', 'v1', order.toRecord()) as IOrder;
    }
    async setTPSL(side: Side, TP: number, SL: number): Promise<void> {
        const orders = [
            new Order(side, 'STOP_MARKET', null, null, SL, true),
            new Order(side, 'TAKE_PROFIT_MARKET', null, null, TP, true),
        ];

        for (const order of orders) {
            await this._getDataFrom('POST', 'order', 'v1', order.toRecord());
        }
    }
    async cancelAllOrders(): Promise<boolean> {
        return (await this._getDataFrom('DELETE', 'allOpenOrders', 'v1') ? true : false);
    }
    async cancelOrder(orderId: string, side: Side): Promise<boolean> {
        const params: Record<string, string> = { orderId, side };
        return (await this._getDataFrom('DELETE', 'order', 'v1', params) ? true : false);
    }
}

export default Binance;
