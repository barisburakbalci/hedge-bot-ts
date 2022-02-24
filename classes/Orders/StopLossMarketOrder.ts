import { OrderType, Side } from "../../Enums";
import Order from "../Order";

class StopLossMarketOrder extends Order {
    side: Side;
    type: OrderType = 'STOP_MARKET';
    stopPrice: number;
    closePosition: boolean = true;

    constructor(side: Side, stopPrice: number) {
        super(side, 'STOP_MARKET');

        this.side = side;
        this.stopPrice = stopPrice;
    }
}

export default StopLossMarketOrder;