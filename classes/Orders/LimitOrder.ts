import { OrderType, Side } from "../../Enums";
import IOrder from "../../interfaces/IOrder";

class LimitOrder implements IOrder {
    side: Side;
    type: OrderType = 'LIMIT';
    quantity: number;
    price: number;

    constructor(side: Side, quantity: number, price: number) {
        this.side = side;
        this.quantity = quantity;
        this.price = price;
    }
}

export default LimitOrder;