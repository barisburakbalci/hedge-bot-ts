import { OrderType, Side } from "../../Enums";
import Order from "../Order";

class MarketOrder extends Order {
    side: Side;
    type: OrderType = 'MARKET';
    quantity: number;

    constructor(side: Side, quantity: number) {
        super(side, 'STOP_MARKET', quantity);

        this.side = side;
        this.quantity = quantity;
    }
}

export default MarketOrder;