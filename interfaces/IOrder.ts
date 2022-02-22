import { Side, OrderType, WorkingType } from '../Enums';

interface IOrder {
    side: Side;
    type: OrderType;
    workingType: WorkingType;
    quantity?: number;
    price?: number;
    stopPrice?: number;
    callbackRate?: number;
    closePosition?: boolean;
}

export default IOrder;