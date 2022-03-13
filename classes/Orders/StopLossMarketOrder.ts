import { OrderType, Side } from "../../Enums";
import IOrder from "../../interfaces/IOrder";

class StopLossMarketOrder implements IOrder {
    type: OrderType = 'STOP_MARKET';
    closePosition: boolean = true;

    constructor(
        public side: Side,
        public stopPrice: number
    ) {}
}

export default StopLossMarketOrder;