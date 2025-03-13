import type { ISymbol, ISession } from "./types";

export default class Symbol implements ISymbol {
    Category;
    CurrencyBase;
    CurrencyMargin;
    CurrencyProfit;
    Description;
    Digits;
    Exchange;
    FaceValue;
    International;
    MarginInitial;
    MarginLimit;
    MarginLong;
    MarginRateCurrency;
    MarginShort;
    MarginStop;
    MarginStopLimit;
    Path;
    PriceLimitMax;
    PriceLimitMin;
    QuotesTimeout;
    Sessions;
    Spread;
    SpreadBalance;
    StopsLevel;
    SwapLong;
    SwapMode;
    SwapShort;
    Symbol;
    TickValue;
    TimeExpiration;
    TimeStart;
    TradeMode;
    VolumeLimit;
    VolumeMax;
    VolumeMin;
    VolumeStep;

    SwapRateMonday;
    SwapRateTuesday;
    SwapRateWednesday;
    SwapRateThursday;
    SwapRateFriday;
    SwapRateSaturday;
    SwapRateSunday;
    ContractSize;

    constructor(symbol: ISymbol) {
        this.Category = symbol.Category;
        this.CurrencyBase = symbol.CurrencyBase;
        this.CurrencyMargin = symbol.CurrencyMargin;
        this.CurrencyProfit = symbol.CurrencyProfit;
        this.Description = symbol.Description;
        this.Digits = symbol.Digits;
        this.Exchange = symbol.Exchange;
        this.FaceValue = symbol.FaceValue;
        this.International = symbol.International;
        this.MarginInitial = symbol.MarginInitial;
        this.MarginLimit = symbol.MarginLimit;
        this.MarginLong = symbol.MarginLong;
        this.MarginRateCurrency = symbol.MarginRateCurrency;
        this.MarginShort = symbol.MarginShort;
        this.MarginStop = symbol.MarginStop;
        this.MarginStopLimit = symbol.MarginStopLimit;
        this.Path = symbol.Path;
        this.PriceLimitMax = symbol.PriceLimitMax;
        this.PriceLimitMin = symbol.PriceLimitMin;
        this.QuotesTimeout = symbol.QuotesTimeout;
        this.Sessions = symbol.Sessions;
        this.Spread = symbol.Spread === 2147483647 ? 0 : symbol.Spread;
        this.SpreadBalance = symbol.SpreadBalance;
        this.StopsLevel = symbol.StopsLevel;
        this.SwapLong = symbol.SwapLong;
        this.SwapMode = symbol.SwapMode;
        this.SwapShort = symbol.SwapShort;
        this.Symbol = symbol.Symbol;
        this.TickValue = symbol.TickValue;
        this.TimeExpiration = symbol.TimeExpiration;
        this.TimeStart = symbol.TimeStart;
        this.TradeMode = symbol.TradeMode === 4294967295 ? 4 : symbol.TradeMode;
        this.VolumeLimit = symbol.VolumeLimit;
        this.VolumeMax = symbol.VolumeMax;
        this.VolumeMin = symbol.VolumeMin;
        this.VolumeStep = symbol.VolumeStep;

        this.SwapRateMonday = symbol.SwapRateMonday;
        this.SwapRateTuesday = symbol.SwapRateTuesday;
        this.SwapRateWednesday = symbol.SwapRateWednesday;
        this.SwapRateThursday = symbol.SwapRateThursday;
        this.SwapRateFriday = symbol.SwapRateFriday;
        this.SwapRateSaturday = symbol.SwapRateSaturday;
        this.SwapRateSunday = symbol.SwapRateSunday;
        this.ContractSize = symbol.ContractSize;
    }

    setSymbol(symbol: ISymbol) {
        this.Category = symbol.Category;
        // this.CurrencyBase = symbol.CurrencyBase;
        // this.CurrencyMargin = symbol.CurrencyMargin;
        // this.CurrencyProfit = symbol.CurrencyProfit;
        this.Description = symbol.Description;
        this.Digits = symbol.Digits;
        this.Exchange = symbol.Exchange;
        this.FaceValue = symbol.FaceValue;
        // this.International = symbol.International;
        this.MarginInitial = symbol.MarginInitial;
        this.MarginLimit = symbol.MarginLimit;
        this.MarginLong = symbol.MarginLong;
        this.MarginRateCurrency = symbol.MarginRateCurrency;
        this.MarginShort = symbol.MarginShort;
        this.MarginStop = symbol.MarginStop;
        this.MarginStopLimit = symbol.MarginStopLimit;
        // this.Path = symbol.Path;
        this.PriceLimitMax = symbol.PriceLimitMax;
        this.PriceLimitMin = symbol.PriceLimitMin;
        this.QuotesTimeout = symbol.QuotesTimeout;
        this.Sessions = symbol.Sessions;
        this.Spread = symbol.Spread === 2147483647 ? 0 : symbol.Spread;
        this.SpreadBalance = symbol.SpreadBalance;
        this.StopsLevel = symbol.StopsLevel;
        this.SwapLong = symbol.SwapLong;
        this.SwapMode = symbol.SwapMode;
        this.SwapShort = symbol.SwapShort;
        this.Symbol = symbol.Symbol;
        this.TickValue = symbol.TickValue;
        this.TimeExpiration = symbol.TimeExpiration;
        this.TimeStart = symbol.TimeStart;
        this.TradeMode = symbol.TradeMode === 4294967295 ? 4 : symbol.TradeMode;
        this.VolumeLimit = symbol.VolumeLimit;
        this.VolumeMax = symbol.VolumeMax;
        this.VolumeMin = symbol.VolumeMin;
        this.VolumeStep = symbol.VolumeStep;

        this.SwapRateMonday = symbol.SwapRateMonday;
        this.SwapRateTuesday = symbol.SwapRateTuesday;
        this.SwapRateWednesday = symbol.SwapRateWednesday;
        this.SwapRateThursday = symbol.SwapRateThursday;
        this.SwapRateFriday = symbol.SwapRateFriday;
        this.SwapRateSaturday = symbol.SwapRateSaturday;
        this.SwapRateSunday = symbol.SwapRateSunday;
        this.ContractSize = symbol.ContractSize;
    }

    toJSON() {
        return {
            Category: this.Category,
            CurrencyBase: this.CurrencyBase,
            CurrencyMargin: this.CurrencyMargin,
            CurrencyProfit: this.CurrencyProfit,
            Description: this.Description,
            Digits: this.Digits,
            Exchange: this.Exchange,
            FaceValue: this.FaceValue,
            International: this.International,
            MarginInitial: this.MarginInitial,
            MarginLimit: this.MarginLimit,
            MarginLong: this.MarginLong,
            MarginRateCurrency: this.MarginRateCurrency,
            MarginShort: this.MarginShort,
            MarginStop: this.MarginStop,
            MarginStopLimit: this.MarginStopLimit,
            Path: this.Path,
            PriceLimitMax: this.PriceLimitMax,
            PriceLimitMin: this.PriceLimitMin,
            QuotesTimeout: this.QuotesTimeout,
            Sessions: this.Sessions.map((session: ISession[]) => {
                return session.map((s: ISession) => {
                    return {
                        Open: s.Open,
                        Close: s.Close,
                    }
                })
            }),
            Spread: this.Spread,
            SpreadBalance: this.SpreadBalance,
            StopsLevel: this.StopsLevel,
            SwapLong: this.SwapLong,
            SwapMode: this.SwapMode,
            SwapShort: this.SwapShort,
            Symbol: this.Symbol,
            TickValue: this.TickValue,
            TimeExpiration: this.TimeExpiration,
            TimeStart: this.TimeStart,
            TradeMode: this.TradeMode,
            VolumeLimit: this.VolumeLimit,
            VolumeMax: this.VolumeMax,
            VolumeMin: this.VolumeMin,
            VolumeStep: this.VolumeStep,

            SwapRateMonday: this.SwapRateMonday,
            SwapRateTuesday: this.SwapRateTuesday,
            SwapRateWednesday: this.SwapRateWednesday,
            SwapRateThursday: this.SwapRateThursday,
            SwapRateFriday: this.SwapRateFriday,
            SwapRateSaturday: this.SwapRateSaturday,
            SwapRateSunday: this.SwapRateSunday,
            ContractSize: this.ContractSize
        }
    }
}