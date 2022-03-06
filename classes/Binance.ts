import axios, { AxiosError, HeadersDefaults } from 'axios';
import * as crypto from 'crypto';
import IExchangeApi from '../interfaces/IExchange';
import { HttpMethod, ApiVersion, Side } from '../Enums';
import IOrder from '../interfaces/IOrder';
import IPosition from '../interfaces/IPosition';
import IBalance from '../interfaces/IBalance';
import Utilities from './Utilities';
import StopMarketOrder from './Orders/StopMarketOrder';
import TakeProfitMarketOrder from './Orders/TakeProfitMarketOrder';
import StopLossMarketOrder from './Orders/StopLossMarketOrder';
import StopLimitOrder from './Orders/StopLimitOrder';
import RequestService from './RequestService';
import MarketOrder from './Orders/MarketOrder';

class Binance implements IExchangeApi {
    baseURL = 'https://fapi.binance.com/fapi';

    constructor(
        public apiKey: string,
        public apiSecret: string,
        public symbol: string,
        public precision: number
    ) {
        axios.defaults.headers.common['Content-Type'] = 'application/x-www-form-urlencoded';
        axios.defaults.headers.common['X-MBX-APIKEY'] = apiKey;
    }

    async _getDataFrom(httpMethod: HttpMethod, apiEndpoint: string, version: ApiVersion, params: Record<string, string> = {}): Promise<Object> {
        const URL = `${this.baseURL}/${version}/${apiEndpoint}`;

        params.symbol = this.symbol;
        params.timestamp = new Date().getTime().toString();
        
        const queryString = new URLSearchParams(params).toString();
        const signature = crypto.createHmac('sha256', this.apiSecret).update(queryString).digest('hex');

        const { data } = await RequestService.Send(httpMethod, URL + '?' + queryString + '&signature=' + signature);
        return data;
    }
    async getBalance(): Promise<IBalance> {
        const balances = await this._getDataFrom('GET', 'balance', 'v2') as IBalance[];
        return balances.find(balance => balance.asset == 'USDT') as IBalance;
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
        const order = new StopLimitOrder(side, quantity, price, price);
        return await this._getDataFrom('POST', 'order', 'v1', Utilities.toRecord(order)) as IOrder;
    }
    async openStopMarketOrder(side: Side, quantity: number, stopPrice: number): Promise<IOrder> {
        const order = new StopMarketOrder(side, stopPrice, quantity);
        return await this._getDataFrom('POST', 'order', 'v1', Utilities.toRecord(order)) as IOrder;
    }
    async openMarketOrder(side: Side, quantity: number): Promise<IOrder> {
        const order = new MarketOrder(side, quantity);
        return await this._getDataFrom('POST', 'order', 'v1', Utilities.toRecord(order)) as IOrder;
    }
    async setTPSL(side: Side, TP: number, SL: number): Promise<void> {
        const orders = [
            new StopLossMarketOrder(side, SL),
            new TakeProfitMarketOrder(side, TP),
        ];

        for (const order of orders) {
            await this._getDataFrom('POST', 'order', 'v1', Utilities.toRecord(order));
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
