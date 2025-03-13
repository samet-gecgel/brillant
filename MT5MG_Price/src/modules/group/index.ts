import type { IGroup } from "./types";
import GroupSymbol from "../group-symbol";

export default class Group implements IGroup {
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
    Symbols: Map<string, GroupSymbol> = new Map();

    constructor(group: IGroup) {
        this.Company = group.Company;
        this.Currency = group.Currency;
        this.CurrencyDigits = group.CurrencyDigits;
        this.Group = group.Group;
        this.LimitHistory = group.LimitHistory;
        this.LimitOrders = group.LimitOrders;
        this.LimitPositions = group.LimitPositions;
        this.LimitSymbols = group.LimitSymbols;
        this.MarginCall = group.MarginCall;
        this.MarginFlags = group.MarginFlags;
        this.MarginFreeMode = group.MarginFreeMode;
        this.MarginFreeProfitMode = group.MarginFreeProfitMode;
        this.MarginMode = group.MarginMode;
        this.MarginStopOut = group.MarginStopOut;
        // this.Symbols = group.Symbols;
    }

    setGroup(group: IGroup) {
        this.Company = group.Company;
        this.Currency = group.Currency;
        this.CurrencyDigits = group.CurrencyDigits;
        // this.Group = group.Group;
        this.LimitHistory = group.LimitHistory;
        this.LimitOrders = group.LimitOrders;
        this.LimitPositions = group.LimitPositions;
        this.LimitSymbols = group.LimitSymbols;
        this.MarginCall = group.MarginCall;
        this.MarginFlags = group.MarginFlags;
        this.MarginFreeMode = group.MarginFreeMode;
        this.MarginFreeProfitMode = group.MarginFreeProfitMode;
        this.MarginMode = group.MarginMode;
        this.MarginStopOut = group.MarginStopOut;
        this.Symbols = group.Symbols;
    }

    findSymbolByName(symbolName: string) {
        for (let [key, symbol] of this.Symbols) {
            console.log(symbol);
            if (symbol.Symbol && symbol.Symbol.Symbol === symbolName) {
                return symbol;
            }
        }
    }

    toJSON() {
        return {
            Company: this.Company,
            Currency: this.Currency,
            CurrencyDigits: this.CurrencyDigits,
            Group: this.Group,
            LimitHistory: this.LimitHistory,
            LimitOrders: this.LimitOrders,
            LimitPositions: this.LimitPositions,
            LimitSymbols: this.LimitSymbols,
            MarginCall: this.MarginCall,
            MarginFlags: this.MarginFlags,
            MarginFreeMode: this.MarginFreeMode,
            MarginFreeProfitMode: this.MarginFreeProfitMode,
            MarginMode: this.MarginMode,
            MarginStopOut: this.MarginStopOut,
            Symbols: Array.from(this.Symbols.values()).map((groupSymbol: GroupSymbol) => groupSymbol.toJSON()),
        }
    }
}
