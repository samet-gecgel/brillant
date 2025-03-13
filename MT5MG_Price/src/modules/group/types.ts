import GroupSymbol from "../group-symbol";

export type IGroup = {
    Company: string;
    Currency: string;
    CurrencyDigits: number;
    Group: string;
    LimitHistory: number;
    LimitOrders: number;
    LimitPositions: number;
    LimitSymbols: number;
    MarginCall: number;
    MarginFlags: number;
    MarginFreeMode: number;
    MarginFreeProfitMode: number;
    MarginMode: number;
    MarginStopOut: number;
    Symbols: Map<string, GroupSymbol>;
};
