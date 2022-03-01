import { OrderType, Side } from "../../Enums";
import IOrder from "../../interfaces/IOrder";

class StopLimitOrder implements IOrder {
    side: Side;
    type: OrderType = 'STOP';
    quantity: number;
    price: number;
    stopPrice: number;

    constructor(side: Side, quantity: number, price: number, stopPrice: number) {
        this.side = side;
        this.quantity = quantity;
        this.price = price;
        this.stopPrice = stopPrice;
    }
}

export default StopLimitOrder;