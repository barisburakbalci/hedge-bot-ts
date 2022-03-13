import { OrderType, Side } from "../../Enums";
import IOrder from "../../interfaces/IOrder";

class StopMarketOrder implements IOrder {
    type: OrderType = 'STOP_MARKET';

    constructor(
        public side: Side,
        public stopPrice: number,
        public quantity: number
    ) {}
}

export default StopMarketOrder;