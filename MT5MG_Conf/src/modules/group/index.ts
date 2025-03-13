import GroupSymbol from "../group-symbol";
import { IGroup } from "./types";

export default class Group implements IGroup {
  Idx: number;
  Group: string;
  Server: number;
  Company: string;
  Currency: string;
  CurrencyDigits: number;
  MarginFreeMode: number;
  MarginCall: number;
  MarginStopOut: number;
  MarginFreeProfitMode: number;
  MarginMode: number;
  MarginFlags: number;
  LimitHistory: number;
  LimitOrders: number;
  LimitSymbols: number;
  LimitPositions: number;
  Symbols: Map<string, GroupSymbol> = new Map();
  Commissions: [];

  constructor(group: IGroup) {
    this.Idx = group.Idx;
    this.Group = group.Group;
    this.Server = group.Server;
    this.Company = group.Company;
    this.Currency = group.Currency;
    this.CurrencyDigits = group.CurrencyDigits;
    this.MarginFreeMode = group.MarginFreeMode;
    this.MarginCall = group.MarginCall;
    this.MarginStopOut = group.MarginStopOut;
    this.MarginFreeProfitMode = group.MarginFreeProfitMode;
    this.MarginMode = group.MarginMode;
    this.MarginFlags = group.MarginFlags;
    this.LimitHistory = group.LimitHistory;
    this.LimitOrders = group.LimitOrders;
    this.LimitSymbols = group.LimitSymbols;
    this.LimitPositions = group.LimitPositions;
    this.Commissions = group.Commissions;
  }

  setGroup(group: IGroup) {
    this.Idx = group.Idx;
    this.Group = group.Group;
    this.Server = group.Server;
    this.Company = group.Company;
    this.Currency = group.Currency;
    this.CurrencyDigits = group.CurrencyDigits;
    this.MarginFreeMode = group.MarginFreeMode;
    this.MarginCall = group.MarginCall;
    this.MarginStopOut = group.MarginStopOut;
    this.MarginFreeProfitMode = group.MarginFreeProfitMode;
    this.MarginMode = group.MarginMode;
    this.MarginFlags = group.MarginFlags;
    this.LimitHistory = group.LimitHistory;
    this.LimitOrders = group.LimitOrders;
    this.LimitSymbols = group.LimitSymbols;
    this.LimitPositions = group.LimitPositions;
    this.Commissions = group.Commissions;
    
  }

  findSymbolByName(symbolName: string) {
    for (let [key, symbol] of this.Symbols) {
      
      if (symbol.Symbol && symbol.Symbol.Symbol === symbolName) {
        return symbol;
      }
    }
  }

  toJSON() {
    return {
      Idx: this.Idx,
      Group: this.Group,
      Server: this.Server,
      Company: this.Company,
      Currency: this.Currency,
      CurrencyDigits: this.CurrencyDigits,
      MarginFreeMode: this.MarginFreeMode,
      MarginCall: this.MarginCall,
      MarginStopOut: this.MarginStopOut,
      MarginFreeProfitMode: this.MarginFreeProfitMode,
      MarginMode: this.MarginMode,
      MarginFlags: this.MarginFlags,
      LimitHistory: this.LimitHistory,
      LimitOrders: this.LimitOrders,
      LimitPositions: this.LimitPositions,
      LimitSymbols: this.LimitSymbols,
      Symbols: Array.from(this.Symbols.values()).map(
        (groupSymbol: GroupSymbol) => groupSymbol.toJSON()
      ),
      Commissions: this.Commissions,
    };
  }
}
