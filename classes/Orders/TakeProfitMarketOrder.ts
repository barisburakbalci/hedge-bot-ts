import { OrderType, Side } from "../../Enums";
import IOrder from "../../interfaces/IOrder";

class TakeProfitMarketOrder implements IOrder {
    side: Side;
    type: OrderType = 'TAKE_PROFIT_MARKET';
    stopPrice: number;
    closePosition = true;

    constructor(side: Side, stopPrice: number) {
        this.side = side;
        this.stopPrice = stopPrice;
    }
}

export default TakeProfitMarketOrder;