import GroupSymbol from "../group-symbol";

export type IGroup = {
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
  Symbols: Map<string, GroupSymbol>;
  Commissions: [];
};
