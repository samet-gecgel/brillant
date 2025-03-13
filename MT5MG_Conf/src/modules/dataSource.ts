import * as net from "net";
import { SocketConnectOpts } from "../types/connection";
import { IResponse } from "../types/response";
import Group from "./group";
import Symbol from "./symbol";
import { getGroups, getSymbols } from "./redis/operations";
import GroupSymbol from "./group-symbol";
import { ISymbol } from "./symbol/types";
import { IGroup } from "./group/types";
import { IGroupSymbol } from "./group-symbol/types";
import { connectRedis } from "./redis";
var DataObject = require("./redis/operations");

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

  URIS = [
    String(process.env.TICK_SERVER_URL),
    String(process.env.PRICE_SERVER_URL),
    String(process.env.AUTH_SERVER_URL)
  ];

  endPoints = {
    groupAdded: '/group-added',
    groupDeleted: '/group-deleted',
    groupUpdated: '/group-updated',
    symbolAdded: '/symbol-added',
    symbolUpdated: '/symbol-updated',
    symbolDeleted: '/symbol-deleted'
  }

  constructor(connectOptions: SocketConnectOpts) {
    this.socket = new net.Socket();
    this.isReady = false;
    this.isInitialized = false;
    this.connectOptions = connectOptions;
    this.connect();
    this.attachEvents();
    this.events.forEach((callback, eventName) => {
      console.log('SUBSCRIBED EVENT: ', eventName, callback);
      this.socket.on(eventName, callback);
    });
    this.initializeData();
  }

  async initializeData() {
    try {
      await connectRedis();
      const symbols = await getSymbols();
      const groups = await getGroups();
      DataObject = { symbols, groups };
      symbols.forEach((symbol: any) => {
        const symbolObj = new Symbol(symbol);
        this.symbols.set(symbol.Symbol, symbolObj);
      });
      groups.forEach((groupData: IGroup) => {
        const groupObj = new Group(groupData);
        groupData.Symbols.forEach((groupSymbol: IGroupSymbol) => {
          const groupSymbolObj = new GroupSymbol(groupSymbol);
          if (groupSymbol.Symbol) {
            const symbol = new Symbol(groupSymbol.Symbol);
            groupSymbolObj.setSymbol(symbol);
          }
          groupObj.Symbols.set(groupSymbolObj.Path, groupSymbolObj);
        });
        this.groups.set(groupObj.Group, groupObj);
      })
      const symbolObject = Object.fromEntries(this.symbols);
      const groupObject = Object.fromEntries(this.groups);
      await this.sendLastGroupAndSymbolToServices(groupObject, symbolObject)
    } catch (err) {
      console.error('Failed to initialize data', err);
    }
  }

  async postData(url: string, data: any, endPoint: string) {
    try {
      const response = await fetch(url + endPoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error posting data:', error);
    }
  }

  async postToAllUrls(data: any, endPoint: string) {
    for (const url of this.URIS) {
      this.postData(url, data, endPoint);
    }
  }

  async sendLastGroupAndSymbolToServices(groupData: any, symbolData: any) {
    try {
      await this.postToAllUrls(groupData, '/get-all-group')
      await this.postToAllUrls(symbolData, '/get-all-symbol')
    } catch (error) {
      console.log(error)
    }
  }

  async handleUpdate(parsedResponse: IResponse) {
    const { RetCodeMessage } = parsedResponse;

    if (RetCodeMessage) {
      if (RetCodeMessage.includes('Symbol Added')) {
        const Data: ISymbol = parsedResponse.Data;
        const symbol = new Symbol(Data);
        this.symbols.set(Data.Symbol, symbol);
        await this.postToAllUrls(Data, this.endPoints.symbolAdded);
      }
      else if (RetCodeMessage.includes('Symbol Updated')) {
        const Data: ISymbol = parsedResponse.Data;
        const symbol = this.symbols.get(Data.Symbol);
        if (symbol) {
          symbol.setSymbol(Data);
        }
        await this.postToAllUrls(DataObject.symbols, this.endPoints.symbolUpdated);
      }
      else if (RetCodeMessage.includes('Symbol Deleted')) {
        const Data: ISymbol = parsedResponse.Data;
        this.symbols.delete(Data.Symbol);
        await this.postToAllUrls(DataObject.symbols, this.endPoints.symbolDeleted);
      }
      else if (RetCodeMessage.includes('Group Added')) {
        const Data: IGroup = parsedResponse.Data;
        const group = new Group(Data);
        this.groups.set(group.Group, group);
        await this.postToAllUrls(Data, this.endPoints.groupAdded);
      }
      else if (RetCodeMessage.includes('Group Updated')) {
        console.log("SSSSSSSSSSSSS")
        const Data: IGroup = parsedResponse.Data;
        const oldGroup = this.groups.get(Data.Group);
        if (oldGroup) {
          Data.Symbols.forEach((groupSymbol: any) => {
            const oldGroupSymbol = oldGroup.Symbols.get(groupSymbol.Path);
            if (oldGroupSymbol) {
              oldGroupSymbol.setGroupSymbol(groupSymbol);

              const symbolObj = this.findSymbolByPath(groupSymbol.Path);
              if (symbolObj) {
                oldGroupSymbol.setSymbol(symbolObj);
              }
            }
            else {
              const groupSymbolObj = new GroupSymbol(groupSymbol);
              const symbolObj = this.findSymbolByPath(groupSymbol.Path);
              if (symbolObj) {
                groupSymbolObj.setSymbol(symbolObj);
                oldGroup.Symbols.set(symbolObj.Path, groupSymbolObj);
              }
            }
          });
        }
        await this.postToAllUrls(Data, this.endPoints.groupUpdated);
      }
      else if (RetCodeMessage.includes('Group Deleted')) {
        const Data: IGroup = parsedResponse.Data;
        this.groups.delete(Data.Group);
        await this.postToAllUrls(Data, this.endPoints.groupDeleted);
      }
    } else {
      console.error('RetCodeMessage is null');
    }
  }

  handleResponse(data: Buffer) {
    try {
      const dataStr = data.toString('utf-8');
      console.log('Received Data:', dataStr);

      this.responseChunk = this.responseChunk.concat(dataStr);

      if (this.responseChunk.charAt(this.responseChunk.length - 1) === 'é') {
        const regex = new RegExp(/é({.+?})é/g);
        const responses = Array.from(this.responseChunk.matchAll(regex)).map(item => item[1]);

        console.log('Parsed Responses:', responses);

        this.responseChunk = '';

        responses.forEach(response => {
          try {
            console.log('Individual Response:', response);
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
            } else {
              this.handleUpdate(parsedResponse);
            }
          } catch (err) {
            console.error('Error parsing response:', response, err);
          }
        });
      } else {
        console.log('Incomplete data chunk, awaiting more data');
      }
    } catch (err) {
      console.error('Error handling data:', err);
    }
  }

  connect() {
    this.socket.connect(this.connectOptions);
  }

  reConnect() {
    console.log('RECONNECTING');
    this.isReady = false;
    if (!this.socket.closed) {
      this.socket.destroy();
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
      console.log('INCOMING DATA: ', data);
      this.handleResponse(data);
    });

    this.addEvent('connect', () => {
      console.log("DATA SOURCE INITIALIZING");
      this.isInitialized = true;
      this.isReady = true;
    });
  }

  addEvent(eventName: string, callback: (data: any) => void) {
    this.events.set(eventName, callback);
  }

  deleteEvent(eventName: string) {
    this.events.delete(eventName);
  }
  findSymbolByPath = (symbolPath: string) => {
    for (let [key, symbol] of this.symbols) {
      if (symbol.Path === symbolPath) {
        return symbol;
      }
    }
  }
}

export default DataSource;
