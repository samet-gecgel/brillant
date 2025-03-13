import Symbol from "../symbol";
import { IOrder } from "./types";

export default class Order implements IOrder {
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

    constructor(data: IOrder) {
        this.Digits = data.Digits;
        this.DigitsCurrency = data.DigitsCurrency;
        this.Login = data.Login;
        this.Order = data.Order;
        this.PriceOrder = data.PriceOrder;
        this.PriceSL = data.PriceSL;
        this.PriceTP = data.PriceTP;
        this.RateMargin = data.RateMargin;
        this.Reason = data.Reason;
        this.Symbol = data.Symbol;
        this.TimeExpiration = data.TimeExpiration;
        this.TimeSetup = data.TimeSetup;
        this.Type = data.Type;
        this.TypeFill = data.TypeFill;
        this.TypeTime = data.TypeTime;
        this.VolumeCurrent = data.VolumeCurrent;
    }

    setOrder(data: IOrder) {
        this.Digits = data.Digits;
        this.DigitsCurrency = data.DigitsCurrency;
        this.Login = data.Login;
        this.Order = data.Order;
        this.PriceOrder = data.PriceOrder;
        this.PriceSL = data.PriceSL;
        this.PriceTP = data.PriceTP;
        this.RateMargin = data.RateMargin;
        this.Reason = data.Reason;
        this.Symbol = data.Symbol;
        this.TimeExpiration = data.TimeExpiration;
        this.TimeSetup = data.TimeSetup;
        this.Type = data.Type;
        this.TypeFill = data.TypeFill;
        this.TypeTime = data.TypeTime;
        this.VolumeCurrent = data.VolumeCurrent;
    }

    toJSON() {
        return {
            Digits: this.Digits,
            DigitsCurrency: this.DigitsCurrency,
            // Login: this.Login,
            Order: this.Order,
            PriceOrder: this.PriceOrder,
            PriceSL: this.PriceSL,
            PriceTP: this.PriceTP,
            RateMargin: this.RateMargin,
            Reason: this.Reason,
            Symbol: this.Symbol.Symbol,
            TimeExpiration: this.TimeExpiration,
            TimeSetup: this.TimeSetup,
            Type: this.Type,
            TypeFill: this.TypeFill,
            TypeTime: this.TypeTime,
            VolumeCurrent: this.VolumeCurrent,
        }
    }
}