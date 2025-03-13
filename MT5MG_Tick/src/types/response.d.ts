import { returnCodes } from "../constants/codes";

export interface IResponse {
  RequestId: number;
  ReqUser: string;
  RetCode: number | string | null;
  RetCodeMessage: string;

  Data: any;
}