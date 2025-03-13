import { ITick } from "../tick/types";
import { ISymbol } from "./types";

export default class Symbol implements ISymbol {
  Idx: number;
  Symbol: string;
  Path: string;
  Description: string;
  International: string;
  CalcMode: number;
  Category: string;
  ContractSize: number;
  Exchange: string;
  CurrencyBase: string;
  CurrencyMargin: string;
  CurrencyProfit: string;
  Digits: number;
  Spread: number;
  SpreadBalance: number;
  TickValue: number;
  StopsLevel: number;
  VolumeMin: number;
  VolumeMax: number;
  VolumeStep: number;
  VolumeLimit: number;
  MarginInitial: number;
  MarginLong: number;
  MarginShort: number;
  MarginLimit: number;
  MarginStop: number;
  MarginStopLimit: number;
  MarginRateCurrency: number;
  SwapMode: number;
  SwapLong: number;
  SwapShort: number;
  TimeStart: number;
  TimeExpiration: number;
  PriceLimitMax: number;
  PriceLimitMin: number;
  TradeMode: number;
  QuotesTimeout: number;
  SwapRateMonday: number;
  SwapRateTuesday: number;
  SwapRateWednesday: number;
  SwapRateThursday: number;
  SwapRateFriday: number;
  SwapRateSaturday: number;
  SwapRateSunday: number;
  FaceValue: number;
  Tick: ITick;
  Sessions: [];

  listeners = new Map<number, () => void>();

  constructor(symbol: ISymbol) {
    this.Idx = symbol.Idx;
    this.Symbol = symbol.Symbol;
    this.Path = symbol.Path;
    this.Description = symbol.Description;
    this.International = symbol.International;
    this.CalcMode = symbol.CalcMode;
    this.Category = symbol.Category;
    this.ContractSize = symbol.ContractSize;
    this.Exchange = symbol.Exchange;
    this.CurrencyBase = symbol.CurrencyBase;
    this.CurrencyMargin = symbol.CurrencyMargin;
    this.CurrencyProfit = symbol.CurrencyProfit;
    this.Digits = symbol.Digits;
    this.Spread = symbol.Spread;
    this.SpreadBalance = symbol.SpreadBalance;
    this.TickValue = symbol.TickValue;
    this.StopsLevel = symbol.StopsLevel;
    this.VolumeMin = symbol.VolumeMin;
    this.VolumeMax = symbol.VolumeMax;
    this.VolumeStep = symbol.VolumeStep;
    this.VolumeLimit = symbol.VolumeLimit;
    this.MarginInitial = symbol.MarginInitial;
    this.MarginLong = symbol.MarginLong;
    this.MarginShort = symbol.MarginShort;
    this.MarginLimit = symbol.MarginLimit;
    this.MarginStop = symbol.MarginStop;
    this.MarginStopLimit = symbol.MarginStopLimit;
    this.MarginRateCurrency = symbol.MarginRateCurrency;
    this.SwapMode = symbol.SwapMode;
    this.SwapLong = symbol.SwapLong;
    this.SwapShort = symbol.SwapShort;
    this.TimeStart = symbol.TimeStart;
    this.TimeExpiration = symbol.TimeExpiration;
    this.PriceLimitMax = symbol.PriceLimitMax;
    this.PriceLimitMin = symbol.PriceLimitMin;
    this.TradeMode = symbol.TradeMode;
    this.QuotesTimeout = symbol.QuotesTimeout;
    this.SwapRateMonday = symbol.SwapRateMonday;
    this.SwapRateTuesday = symbol.SwapRateTuesday;
    this.SwapRateWednesday = symbol.SwapRateWednesday;
    this.SwapRateThursday = symbol.SwapRateThursday;
    this.SwapRateFriday = symbol.SwapRateFriday;
    this.SwapRateSaturday = symbol.SwapRateSaturday;
    this.SwapRateSunday = symbol.SwapRateSunday;
    this.FaceValue = symbol.FaceValue;
    this.Tick = symbol.Tick;
    this.Sessions = symbol.Sessions;
  }

  setSymbol(symbol: ISymbol) {
    this.Idx = symbol.Idx;
    this.Symbol = symbol.Symbol;
    this.Path = symbol.Path;
    this.Description = symbol.Description;
    this.International = symbol.International;
    this.CalcMode = symbol.CalcMode;
    this.Category = symbol.Category;
    this.ContractSize = symbol.ContractSize;
    this.Exchange = symbol.Exchange;
    this.CurrencyBase = symbol.CurrencyBase;
    this.CurrencyMargin = symbol.CurrencyMargin;
    this.CurrencyProfit = symbol.CurrencyProfit;
    this.Digits = symbol.Digits;
    this.Spread = symbol.Spread;
    this.SpreadBalance = symbol.SpreadBalance;
    this.TickValue = symbol.TickValue;
    this.StopsLevel = symbol.StopsLevel;
    this.VolumeMin = symbol.VolumeMin;
    this.VolumeMax = symbol.VolumeMax;
    this.VolumeStep = symbol.VolumeStep;
    this.VolumeLimit = symbol.VolumeLimit;
    this.MarginInitial = symbol.MarginInitial;
    this.MarginLong = symbol.MarginLong;
    this.MarginShort = symbol.MarginShort;
    this.MarginLimit = symbol.MarginLimit;
    this.MarginStop = symbol.MarginStop;
    this.MarginStopLimit = symbol.MarginStopLimit;
    this.MarginRateCurrency = symbol.MarginRateCurrency;
    this.SwapMode = symbol.SwapMode;
    this.SwapLong = symbol.SwapLong;
    this.SwapShort = symbol.SwapShort;
    this.TimeStart = symbol.TimeStart;
    this.TimeExpiration = symbol.TimeExpiration;
    this.PriceLimitMax = symbol.PriceLimitMax;
    this.PriceLimitMin = symbol.PriceLimitMin;
    this.TradeMode = symbol.TradeMode;
    this.QuotesTimeout = symbol.QuotesTimeout;
    this.SwapRateMonday = symbol.SwapRateMonday;
    this.SwapRateTuesday = symbol.SwapRateTuesday;
    this.SwapRateWednesday = symbol.SwapRateWednesday;
    this.SwapRateThursday = symbol.SwapRateThursday;
    this.SwapRateFriday = symbol.SwapRateFriday;
    this.SwapRateSaturday = symbol.SwapRateSaturday;
    this.SwapRateSunday = symbol.SwapRateSunday;
    this.FaceValue = symbol.FaceValue;
    this.Tick = this.Tick;
    this.Sessions = symbol.Sessions;
  }

  toJSON() {
    return {
      Idx: this.Idx,
      Symbol: this.Symbol,
      Path: this.Path,
      Description: this.Description,
      International: this.International,
      CalcMode: this.CalcMode,
      Category: this.Category,
      ContractSize: this.ContractSize,
      Exchange: this.Exchange,
      CurrencyBase: this.CurrencyBase,
      CurrencyMargin: this.CurrencyMargin,
      CurrencyProfit: this.CurrencyProfit,
      Digits: this.Digits,
      Spread: this.Spread,
      SpreadBalance: this.SpreadBalance,
      TickValue: this.TickValue,
      StopsLevel: this.StopsLevel,
      VolumeMin: this.VolumeMin,
      VolumeMax: this.VolumeMax,
      VolumeStep: this.VolumeStep,
      VolumeLimit: this.VolumeLimit,
      MarginInitial: this.MarginInitial,
      MarginLong: this.MarginLong,
      MarginShort: this.MarginShort,
      MarginLimit: this.MarginLimit,
      MarginStop: this.MarginStop,
      MarginStopLimit: this.MarginStopLimit,
      MarginRateCurrency: this.MarginRateCurrency,
      SwapMode: this.SwapMode,
      SwapLong: this.SwapLong,
      SwapShort: this.SwapShort,
      TimeStart: this.TimeStart,
      TimeExpiration: this.TimeExpiration,
      PriceLimitMax: this.PriceLimitMax,
      PriceLimitMin: this.PriceLimitMin,
      TradeMode: this.TradeMode,
      QuotesTimeout: this.QuotesTimeout,
      SwapRateMonday: this.SwapRateMonday,
      SwapRateTuesday: this.SwapRateTuesday,
      SwapRateWednesday: this.SwapRateWednesday,
      SwapRateThursday: this.SwapRateThursday,
      SwapRateFriday: this.SwapRateFriday,
      SwapRateSaturday: this.SwapRateSaturday,
      SwapRateSunday: this.SwapRateSunday,
      FaceValue: this.FaceValue,
      Tick: this.Tick,
      Sessions: this.Sessions,
    };
  }
}
