import { OrderType, Side } from "../../Enums";
import IOrder from "../../interfaces/IOrder";

class StopLimitOrder implements IOrder {
    type: OrderType = 'STOP';

    constructor(
        public side: Side,
        public quantity: number,
        public price: number,
        public stopPrice: number
    ) {}
}

export default StopLimitOrder;