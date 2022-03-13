import { OrderType, Side } from "../../Enums";
import IOrder from "../../interfaces/IOrder";

class MarketOrder implements IOrder {
    type: OrderType = 'MARKET';

    constructor(
        public side: Side,
        public quantity: number
    ) {}
}

export default MarketOrder;