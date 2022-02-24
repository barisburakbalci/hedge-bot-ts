import { OrderType, Side } from "../../Enums";
import Order from "../Order";

class StopLimitOrder extends Order {
    side: Side;
    type: OrderType = 'STOP';
    quantity: number;
    price: number;
    stopPrice: number;

    constructor(side: Side, quantity: number, price: number, stopPrice: number) {
        super(side, 'STOP', quantity);

        this.side = side;
        this.quantity = quantity;
        this.price = price;
        this.stopPrice = stopPrice;
    }
}

export default StopLimitOrder;