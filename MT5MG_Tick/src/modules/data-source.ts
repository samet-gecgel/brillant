import Request from "./request"
import * as net from "net";
import { SocketConnectOpts } from "../types/connection";
import { IResponse } from "../types/response";
import { returnCodes } from "../constants/codes";
import Group from "./group"
import Symbol from "./symbol";
import User from "./user";
import GroupSymbol from "./group-symbol";
import { IGroup } from "./group/types";
import { IGroupSymbol } from "./group-symbol/types";
import { exchangeSymbols } from "../constants/constants";

class DataSource {
  socket: net.Socket;
  connectOptions: SocketConnectOpts;
  events: Map<string, (data: any) => void> = new Map();
  requests: Map<number, (response: IResponse) => void> = new Map();
  symbols: Map<string, Symbol> = new Map();
  groups: Map<string, Group> = new Map();
  users: Map<number, User> = new Map();
  timeouts: Map<number, NodeJS.Timeout> = new Map();
  isReady: boolean;
  isInitialized: boolean;
  responseChunk: string = '';
  groupInterval: ReturnType<typeof setInterval> | undefined;
  symbolInterval: ReturnType<typeof setInterval> | undefined;

  constructor(connectOptions: SocketConnectOpts) {
    this.socket = new net.Socket;
    this.isReady = false;
    this.isInitialized = false;
    this.connectOptions = connectOptions;

    this.setGroupsAndSymbols();
    this.connect();
    this.attachEvents();
    this.events.forEach((callback, eventName) => {
      console.log('SUBSCRIBED EVENT: ', eventName, callback)
      this.socket.on(eventName, callback);
    });
  }

  get eventsSize() {
    return this.events.size;
  }

  addEvent(eventName: string, callback: (data: any) => void) {
    this.events.set(eventName, callback);
  }

  deleteEvent(eventName: string) {
    this.events.delete(eventName);
  }

  sendRequest(command: string, userName: string, data: object, callback: (response: IResponse) => void) {
    let request = new Request({
      RequestId: Date.now(),
      User: userName,
      Command: command,
      Data: data
    })

    let timeout = setTimeout(() => {
      this.timeouts.delete(request.requestId);
      this.requests.delete(request.requestId);
      callback({
        RequestId: request.requestId,
        ReqUser: request.User,
        RetCode: 9,
        RetCodeMessage: returnCodes.get(9) ?? "",
        Data: {}
      });
    }, 5000);

    this.requests.set(request.requestId, callback);
    this.timeouts.set(request.requestId, timeout)
    this.socket.write(JSON.stringify(request), (err) => {
      if (err) {
        console.error('request error ', err.message);
      }
    });
  }

  setGroupsAndSymbols() {
    this.symbolInterval = setInterval(() => {
      fetch(String(process.env.SYMBOL_AND_GROUP_REQUEST_SERVER_URL) + '/symbols', {
        method: 'GET'
      })
        .then((data) => {
          return data.json()
        })
        .then((symbolsData: any) => {
          Object.values(symbolsData).forEach((symbol: any) => {
            const symbolObj = new Symbol(symbol);
            symbolObj.Tick.setTick(symbol.Tick.Ask, symbol.Tick.Bid, symbol.Tick.DateTime);
            this.symbols.set(symbol.Symbol, symbolObj);
          });
          clearInterval(this.symbolInterval);
          this.setExchanges();
          this.setGroups();
        })
        .catch((err) => {
          console.log(err);
        });
    }, 5000)
  }

  setGroups() {
    this.groupInterval = setInterval(async () => {
      await fetch(String(process.env.SYMBOL_AND_GROUP_REQUEST_SERVER_URL) + '/groups', {
        method: 'GET'
      })
        .then((data) => {
          return data.json()
        })
        .then((groupsData: any) => {
          Object.values(groupsData)
            .forEach((groupData: any) => {
              const groupObj = new Group(groupData);
              groupData.Symbols.forEach((groupSymbol: IGroupSymbol) => {
                const groupSymbolObj = new GroupSymbol(groupSymbol);
                const symbolObj = this.findSymbolByPath(groupSymbol.Path);
                if (symbolObj) {
                  groupSymbolObj.setSymbol(symbolObj);
                  groupObj.Symbols.set(symbolObj.Path, groupSymbolObj);
                }
                groupObj.Symbols.set(groupSymbolObj.Path, groupSymbolObj);
              });
              this.groups.set(groupObj.Group, groupObj);
            })
          clearInterval(this.groupInterval);
        })
        .catch((err) => {
          console.log(err);
        });
    }, 5000);
  }

  setExchanges() {
    this.symbols.forEach((symbol: Symbol) => {
      const exchangeSymbol = exchangeSymbols.get(symbol.CurrencyProfit);
      if (exchangeSymbol) {
        const exchangeObj = this.symbols.get(exchangeSymbol.symbol);
        if (exchangeObj) {
          symbol.Tick.setExchange(exchangeObj.Tick, exchangeSymbol.reverse);
        }
      }
    });
  }

  findSymbolByPath(symbolPath: string) {
    for (let [key, symbol] of this.symbols) {
      if (symbol.Path === symbolPath) {
        return symbol;
      }
    }
  }

  handleResponse(data: Buffer) {
    try {
      const regex = new RegExp(/é({.+?})é/g);
      this.responseChunk = this.responseChunk.concat(data.toString());
      const responses = Array.from(this.responseChunk.matchAll(regex)).map(item => item[1]);

      if (this.responseChunk.charAt(-1) === 'é') {
        this.responseChunk = '';
      } else {
        this.responseChunk = this.responseChunk.replace(/.*(?=é)/, '');
      }

      responses.forEach(response => {
        try {
          const parsedResponse = JSON.parse(response);
          const requestId = parsedResponse.RequestId;
          if (requestId) {
            const callback = this.requests.get(requestId);
            const timeout = this.timeouts.get(requestId);
            if (timeout) {
              this.timeouts.delete(requestId);
              clearTimeout(timeout);
            }
            if (callback) {
              this.requests.delete(requestId);
              callback(parsedResponse);
            }
          } else if (parsedResponse.Symbol) {
            const symbolObj = this.symbols.get(parsedResponse.Symbol);
            const { Ask, Bid, Datetime } = parsedResponse;
            if (symbolObj && Ask && Bid && Datetime) {
              symbolObj.Tick.setTick(Ask, Bid, Datetime);
            }
          }
        } catch (err) {
          console.error('RESPONSE \n %s \nPARSING ERROR %s', response, err);
        }
      });
    } catch (err) {
      console.error(data.toString());
    }
  }

  connect() {
    this.socket.connect(
      this.connectOptions
    );
  }

  reConnect() {
    console.log('RECONNECTING')
    this.isReady = false;
    if (!this.socket.closed) {
      this.socket.destroySoon();
    }
    this.connect();
  }

  attachEvents() {
    this.addEvent('close', (hadError: boolean) => {
      console.log('DATA SOURCE CONNECTION CLOSED hadError: ', hadError);
      this.isReady = false;
      this.reConnect();
    });

    this.addEvent('error', (err: Error) => {
      console.log('DATA SOURCE CONNECTION ERROR error: ', err.message);
      this.isReady = false;
    });

    this.addEvent('data', (data: Buffer) => {
      this.handleResponse(data);
    });

    this.addEvent('connect', () => {
      console.log("DATA SOURCE INITIALIZING");
      this.isInitialized = true;
      this.isReady = true;
    });
  }
}

export default DataSource;
