import Symbol from "../symbol";

export type IOrder = {
    Digits: number;
    DigitsCurrency: number;
    Login: number;
    Order: number;
    PriceOrder: number;
    PriceSL: number;
    PriceTP: number;
    RateMargin: number;
    Reason: number;
    Symbol: Symbol;
    TimeExpiration: number;
    TimeSetup: number;
    Type: number;
    TypeFill: number;
    TypeTime: number;
    VolumeCurrent: number;
}
