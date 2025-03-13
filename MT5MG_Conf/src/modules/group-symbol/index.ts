import Symbol from "../symbol";
import type { IGroupSymbol } from "./types";

export default class GroupSymbol implements IGroupSymbol {
    Path: string = '';
    SpreadDiff: number = 0;
    SpreadDiffDefault: number = 0;
    SpreadDiffBalance: number = 0;
    SpreadDiffBalanceDefault: number = 0;
    Symbol?: Symbol;
    TradeMode?: number = 0;
    TradeModeDefault?: number = 0;

    constructor(data: IGroupSymbol) {
        this.Path = data.Path;
        this.SpreadDiff = data.SpreadDiff === 2147483647 ? 0 : data.SpreadDiff;
        this.SpreadDiffDefault = data.SpreadDiffDefault === 2147483647 ? 0 : data.SpreadDiffDefault;

        this.SpreadDiffBalance = data.SpreadDiffBalance === 2147483647 ? 0 : data.SpreadDiffBalance;
        this.SpreadDiffBalanceDefault = data.SpreadDiffBalanceDefault === 2147483647 ? 0 : data.SpreadDiffBalanceDefault;

        this.TradeMode = data.TradeMode === 4294967295 ? undefined : data.TradeMode;
        this.TradeModeDefault = data.TradeModeDefault === 4294967295 ? undefined : data.TradeModeDefault;
    }

    setGroupSymbol(data: IGroupSymbol) {
        this.Path = data.Path;
        this.SpreadDiff = data.SpreadDiff === 2147483647 ? 0 : data.SpreadDiff;
        this.SpreadDiffDefault = data.SpreadDiffDefault === 2147483647 ? 0 : data.SpreadDiffDefault;

        this.SpreadDiffBalance = data.SpreadDiffBalance === 2147483647 ? 0 : data.SpreadDiffBalance;
        this.SpreadDiffBalanceDefault = data.SpreadDiffBalanceDefault === 2147483647 ? 0 : data.SpreadDiffBalanceDefault;

        this.TradeMode = data.TradeMode === 4294967295 ? undefined : data.TradeMode;
        this.TradeModeDefault = data.TradeModeDefault === 4294967295 ? undefined : data.TradeModeDefault;
    }

    setSymbol(symbol: Symbol) {
        this.Symbol = symbol;
    }

    toJSON() {
        return {
            Path: this.Path,
            SpreadDiff: this.SpreadDiff,
            SpreadDiffDefault: this.SpreadDiffDefault,
            SpreadDiffBalance: this.SpreadDiffBalance,
            SpreadDiffBalanceDefault: this.SpreadDiffBalanceDefault,
            Symbol: this.Symbol ? this.Symbol.toJSON() : null,
            TradeMode: this.TradeMode,
            TradeModeDefault: this.TradeModeDefault,
        }
    }
}