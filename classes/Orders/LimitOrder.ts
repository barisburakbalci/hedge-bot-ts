import { OrderType, Side } from "../../Enums";
import IOrder from "../../interfaces/IOrder";

class LimitOrder implements IOrder {
    type: OrderType = 'LIMIT';

    constructor(
        public side: Side,
        public quantity: number,
        public price: number
    ) {}
}

export default LimitOrder;