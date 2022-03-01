import { OrderType, Side } from "../../Enums";
import IOrder from "../../interfaces/IOrder";

class StopMarketOrder implements IOrder {
    side: Side;
    type: OrderType = 'STOP_MARKET';
    quantity: number;
    stopPrice: number;

    constructor(side: Side, stopPrice: number, quantity: number) {
        this.side = side;
        this.quantity = quantity;
        this.stopPrice = stopPrice;
    }
}

export default StopMarketOrder;