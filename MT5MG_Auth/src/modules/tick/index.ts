import { ITick } from "./types";

export default class Tick implements ITick {
  Symbol = "";
  Ask = 0;
  Bid = 0;
  DateTime = 0;
  reverseExchange = false;
  digits = 5;
  Exchange: Tick = { Bid: 1, Ask: 1, Symbol: "", DateTime: 0, digits: 5 } as Tick;
  onTick = () => { };

  constructor(symbol: string) {
    this.Symbol = symbol;
  }

  setTick(ask: number, bid: number, datetime: number) {
    this.Ask = ask;
    this.Bid = bid;
    this.DateTime = datetime
    this.onTick();
  }

  setExchange(tick: Tick, reverseExchange: boolean) {
    this.Exchange = tick;
    this.reverseExchange = reverseExchange;
  }

  toJSON() {
    return {
      Ask: this.Ask,
      Bid: this.Bid,
      Datetime: this.DateTime,
      Exchange: {
        Ask: this.reverseExchange ? 1 / this.Exchange.Ask : this.Exchange.Ask,
        Bid: this.reverseExchange ? 1 / this.Exchange.Bid : this.Exchange.Bid,
        digits: this.Exchange.digits,
      }
    }
  }
}
