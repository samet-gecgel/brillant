import Symbol from '../symbol';
import { IPosition } from './types';

export default class Position implements IPosition {
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

    constructor(data: IPosition) {
        this.Action = data.Action;
        this.Digits = data.Digits;
        this.DigitsCurrency = data.DigitsCurrency;
        this.Login = data.Login;
        this.Position = data.Position;
        this.PriceCurrent = data.PriceCurrent;
        this.PriceOpen = data.PriceOpen;
        this.PriceSL = data.PriceSL;
        this.PriceTP = data.PriceTP;
        this.Profit = data.Profit;
        this.Storage = data.Storage;
        this.Symbol = data.Symbol;
        this.TimeCreate = data.TimeCreate;
        this.Volume = data.Volume;
    }

    setPosition(data: IPosition) {
        this.Action = data.Action;
        this.Digits = data.Digits;
        this.DigitsCurrency = data.DigitsCurrency;
        this.Login = data.Login;
        this.Position = data.Position;
        this.PriceCurrent = data.PriceCurrent;
        this.PriceOpen = data.PriceOpen;
        this.PriceSL = data.PriceSL;
        this.PriceTP = data.PriceTP;
        this.Profit = data.Profit;
        this.Storage = data.Storage;
        this.Symbol = data.Symbol;
        this.TimeCreate = data.TimeCreate;
        this.Volume = data.Volume;
    }

    toJSON() {
        return {
            Action: this.Action,
            Digits: this.Digits,
            DigitsCurrency: this.DigitsCurrency,
            // Login: this.Login,
            Position: this.Position,
            PriceCurrent: this.PriceCurrent,
            PriceOpen: this.PriceOpen,
            PriceSL: this.PriceSL,
            PriceTP: this.PriceTP,
            Profit: this.Profit,
            Storage: this.Storage,
            Symbol: this.Symbol.Symbol,
            TimeCreate: this.TimeCreate,
            Volume: this.Volume,
        }
    }
}