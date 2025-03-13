import { IRequest } from "./types";

export default class Request implements IRequest {
    RequestId: number = Date.now();
    User: string;
    Command: string;
    Data: object;

    constructor(request: IRequest) {
        this.User = request.User;
        this.Command = request.Command;
        this.Data = request.Data;
    }

    get requestId() {
        return this.RequestId;
    }
    
    toJSON() {
        return {
            RequestId: this.RequestId,
            User: this.User,
            Command: this.Command,
            Data: this.Data
        }
    }
}