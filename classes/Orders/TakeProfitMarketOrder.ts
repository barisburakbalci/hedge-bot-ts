import { OrderType, Side } from "../../Enums";
import Order from "../Order";

class TakeProfitMarketOrder extends Order {
    side: Side;
    type: OrderType = 'TAKE_PROFIT_MARKET';
    stopPrice: number;
    closePosition = true;

    constructor(side: Side, stopPrice: number) {
        super(side, 'TAKE_PROFIT_MARKET');

        this.side = side;
        this.stopPrice = stopPrice;
    }
}

export default TakeProfitMarketOrder;