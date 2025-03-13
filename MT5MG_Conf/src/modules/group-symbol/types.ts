import Symbol from "../symbol";

export type IGroupSymbol = {
    Path: string;
    SpreadDiff: number;
    SpreadDiffDefault: number;
    SpreadDiffBalance: number;
    SpreadDiffBalanceDefault: number;
    Symbol?: Symbol;
    TradeMode?: number;
    TradeModeDefault?: number;

    toJSON: () => any;
}