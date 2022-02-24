import { OrderType, Side } from "../../Enums";
import Order from "../Order";

class StopMarketOrder extends Order {
    side: Side;
    type: OrderType = 'STOP_MARKET';
    quantity: number;
    stopPrice: number;

    constructor(side: Side, stopPrice: number, quantity: number) {
        super(side, 'STOP_MARKET');

        this.side = side;
        this.quantity = quantity;
        this.stopPrice = stopPrice;
    }
}

export default StopMarketOrder;