import Position from "../position";
import { IOrder } from "../order/types";
import { IPosition } from "../position/types";
import Order from "../order";


export type IUser = {
    ID: string;
    Login: number;
    Password: string;
    Leverage: number;
    LimitPositionsValue: number;
    LimitOrders: number;
    Balance: number;
    Credit: number;
    BalancePrevDay: number;
    MarginFree: number;
    Margin: number;
    IsInvestor: boolean;
    Name: string;
    Phone: string;
    EMail: string;
    Group: string;
    Positions: Map<number, Position>;
    setPositions: (positions: Position[]) => void;
    Orders: Map<number, Order>;
    setOrders: (orders: Order[]) => void;
}
