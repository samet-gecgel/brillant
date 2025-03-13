import Symbol from "../symbol";

export interface IPosition {
    Action: number;
    Digits: number;
    DigitsCurrency: number;
    Login: number;
    Position: number;
    PriceCurrent: number;
    PriceOpen: number;
    PriceSL: number;
    PriceTP: number;
    Profit: number;
    Storage: number;
    Symbol: Symbol;
    TimeCreate: number;
    Volume: number;
}
