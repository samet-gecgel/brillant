import Request from "./request"
import * as net from "net";
import { SocketConnectOpts } from "../types/connection";
import { IResponse } from "../types/response";
import { returnCodes } from "../constants/codes";
import Group from "./group"
import Symbol from "./symbol";
import GroupSymbol from "./group-symbol";
import 'dotenv/config'
import { IGroup } from "./group/types";
import { IGroupSymbol } from "./group-symbol/types";
import { IServerTime } from "../types/socketTypes";


class DataSource {
  socket: net.Socket;
  connectOptions: SocketConnectOpts;
  events: Map<string, (data: any) => void> = new Map();
  requests: Map<number, (response: IResponse) => void> = new Map();
  symbols: Map<string, Symbol> = new Map();
  groups: Map<string, Group> = new Map();
  timeouts: Map<number, NodeJS.Timeout> = new Map();
  isReady: boolean;
  isInitialized: boolean;
  responseChunk: string = '';
  serverTimeDiff: number = 0; //TODO bu bilginin diğer serverdan bi şekilde alınması lazım
  isSymbolDataSet: boolean = false
  isGroupDataSet: boolean = false
  groupInterval: ReturnType<typeof setInterval> | undefined;
  symbolInterval: ReturnType<typeof setInterval> | undefined;

  constructor(connectOptions: SocketConnectOpts) {
    this.socket = new net.Socket;
    this.isReady = false;
    this.isInitialized = false;
    this.connectOptions = connectOptions;

    this.setGroupAndSymbolsWhenInitialization();
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
          console.log(response);
          const parsedResponse: IResponse = JSON.parse(response);
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
          }
        } catch (err) {
          console.error('RESPONSE \n %s \nPARSING ERROR %s', response, err);
        }
      });
    } catch (err) {
      console.error(data.toString());
    }
  }

  async setGroupAndSymbolsWhenInitialization() {
    try {
      if (!this.isGroupDataSet) {
        this.groupInterval = setInterval(async () => {
          fetch(String(process.env.SYMBOL_AND_GROUP_REQUEST_SERVER_URL) + '/groups', {
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
                    console.log(groupSymbol)
                    if (groupSymbol.Symbol) {
                      const symbol = new Symbol(groupSymbol.Symbol);
                      groupSymbolObj.setSymbol(symbol);
                    }
                    groupObj.Symbols.set(groupSymbolObj.Path, groupSymbolObj);
                  });
                  this.groups.set(groupObj.Group, groupObj);
                })
              this.isGroupDataSet = true
              clearInterval(this.groupInterval)
              this.groupInterval = undefined
            })
            .catch((err) => {
              console.log(err)
            });
        }, 5000)
      }
      if (!this.isSymbolDataSet) {
        this.symbolInterval = setInterval(async () => {
          fetch(String(process.env.SYMBOL_AND_GROUP_REQUEST_SERVER_URL) + '/symbols', {
            method: 'GET'
          })
            .then((data) => {
              return data.json()
            })
            .then((symbolsData: any) => {
              Object.values(symbolsData).forEach((symbol: any) => {
                const symbolObj = new Symbol(symbol);
                this.symbols.set(symbol.Symbol, symbolObj);
              });
              this.isSymbolDataSet = true
              clearInterval(this.symbolInterval)
              this.symbolInterval = undefined
            })
            .catch((err) => {
              console.log(err)
            });
        }, 5000)
      }
    }
    catch (error) {
      console.error("group and symbols could not fetch " + error);
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

  findSymbolByPath = (symbolPath: string) => {
    for (let [key, symbol] of this.symbols) {
      if (symbol.Path === symbolPath) {
        return symbol;
      }
    }
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
      console.log('INCOMING DATA: ', data);
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