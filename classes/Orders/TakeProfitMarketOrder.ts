import { OrderType, Side } from "../../Enums";
import IOrder from "../../interfaces/IOrder";

class TakeProfitMarketOrder implements IOrder {
    type: OrderType = 'TAKE_PROFIT_MARKET';
    closePosition = true;

    constructor(
        public side: Side,
        public stopPrice: number
    ) {}
}

export default TakeProfitMarketOrder;