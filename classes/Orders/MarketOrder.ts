import { OrderType, Side } from "../../Enums";
import IOrder from "../../interfaces/IOrder";

class MarketOrder implements IOrder {
    side: Side;
    type: OrderType = 'MARKET';
    quantity: number;

    constructor(side: Side, quantity: number) {
        this.side = side;
        this.quantity = quantity;
    }
}

export default MarketOrder;