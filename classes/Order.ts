import Recordable from "../abstract_classes/Recordable";
import { Side, OrderType, WorkingType } from "../Enums";
import IOrder from "../interfaces/IOrder";

class Order extends Recordable implements IOrder {
    side: Side;
    type: OrderType;
    quantity?: number;
    price?: number;
    stopPrice?: number;
    callbackRate?: number;
    workingType: WorkingType;
    closePosition: boolean;

    constructor(side: Side, type: OrderType, quantity?: number, price?: number, stopPrice?: number, closePosition = false, callbackRate?: number, workingType: WorkingType = 'MARK_PRICE') {
        super();

        this.side = side;
        this.type = type;
        this.quantity = quantity ?? undefined;
        this.price = price ?? undefined;
        this.stopPrice = stopPrice ?? undefined;
        this.callbackRate = callbackRate ?? undefined;
        this.workingType = workingType;
        this.closePosition = closePosition;
    }
}

export default Order;
