import Request from "./request"
import * as net from "net";
import { SocketConnectOpts } from "../types/connection";
import { IResponse } from "../types/response";
import { returnCodes } from "../constants/codes";

class DataSource {
  socket: net.Socket;
  connectOptions: SocketConnectOpts;
  events: Map<string, (data: any) => void> = new Map();
  requests: Map<number, (response: IResponse) => void> = new Map();
  timeouts: Map<number, NodeJS.Timeout> = new Map();
  isReady: boolean;
  isInitialized: boolean;
  responseChunk: string = '';

  constructor(connectOptions: SocketConnectOpts) {
    this.socket = new net.Socket;
    this.isReady = false;
    this.isInitialized = false;
    this.connectOptions = connectOptions;

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
      console.log(data.toString());
      
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
