import { OrderType, Side } from "../../Enums";
import Order from "../Order";

class LimitOrder extends Order {
    side: Side;
    type: OrderType = 'LIMIT';
    quantity: number;
    price: number;

    constructor(side: Side, quantity: number, price: number) {
        super(side, 'LIMIT', quantity);

        this.side = side;
        this.quantity = quantity;
        this.price = price;
    }
}

export default LimitOrder;