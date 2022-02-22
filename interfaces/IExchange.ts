import IOrder from './IOrder';
import IPosition from './IPosition';
import { HttpMethod, ApiVersion, Side } from '../Enums';
import IBalance from './IBalance';

interface IExchangeApi {
    baseURL: string;
    symbol: string;
    _getDataFrom(httpMethod: HttpMethod, apiEndpoint: string, version: ApiVersion, params: Record<string, string>): Object;
    getBalance(): Promise<IBalance>;
    getMarkPrice(): Promise<number>;
    getOpenOrders(): Promise<Array<IOrder>>;
    getPosition(): Promise<IPosition>;
    openStopOrder(side: Side, quantity: number, price: number): Promise<IOrder>;
    openStopMarketOrder(side: Side, quantity: number, stopPrice: number): Promise<IOrder>;
    openMarketOrder(side: Side, quantity: number): Promise<IOrder>
    setTPSL(side: Side, TP: number, SL: number): Promise<void>;
    cancelAllOrders(): Promise<boolean>;
    cancelOrder(orderId: string, side: Side): Promise<boolean>;
}

export default IExchangeApi;
