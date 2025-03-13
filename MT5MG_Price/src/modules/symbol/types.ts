export type ISession = {
    "Open": number;
    "Close": number;
}

export type ISymbol = {
    Category: string;
    CurrencyBase: string;
    CurrencyMargin: string;
    CurrencyProfit: string;
    Description: string;
    Digits: number;
    Exchange: string;
    FaceValue: number;
    International: string;
    MarginInitial: number;
    MarginLimit: number;
    MarginLong: number;
    MarginRateCurrency: number;
    MarginShort: number;
    MarginStop: number;
    MarginStopLimit: number;
    Path: string;
    PriceLimitMax: number;
    PriceLimitMin: number;
    QuotesTimeout: number;
    Sessions: ISession[][];
    Spread: number;
    SpreadBalance: number;
    StopsLevel: number;
    SwapLong: number;
    SwapMode: number;
    SwapShort: number;
    Symbol: string;
    TickValue: number;
    TimeExpiration: number;
    TimeStart: number;
    VolumeLimit: number;
    VolumeMax: number;
    VolumeMin: number;
    VolumeStep: number;
    TradeMode: number;

    SwapRateMonday: number;
    SwapRateTuesday: number;
    SwapRateWednesday: number;
    SwapRateThursday: number;
    SwapRateFriday: number;
    SwapRateSaturday: number;
    SwapRateSunday: number;
    ContractSize: number;

    toJSON: () => any;
}