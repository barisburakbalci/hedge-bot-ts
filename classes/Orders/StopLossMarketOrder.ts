import { OrderType, Side } from "../../Enums";
import IOrder from "../../interfaces/IOrder";

class StopLossMarketOrder implements IOrder {
    side: Side;
    type: OrderType = 'STOP_MARKET';
    stopPrice: number;
    closePosition: boolean = true;

    constructor(side: Side, stopPrice: number) {
        this.side = side;
        this.stopPrice = stopPrice;
    }
}

export default StopLossMarketOrder;