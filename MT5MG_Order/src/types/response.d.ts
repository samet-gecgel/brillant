import { returnCodes } from "../constants/codes";

export interface IResponse {
  RequestId: number;
  ReqUser: string;
  RetCode: number|null;
  RetCodeMessage: string|null;
  
  Data: any;
} 
