import { ERROR_MESSAGES } from "../constants/errorMessages";
import { loginToMeta } from "../utils/loginToMeta";
import { dataSource } from "../server";
import { IRequest } from "../types/request";

export const positionModify = async (req: IRequest) => {
  return new Promise((resolve, reject) => {
    const {
      Position,
      Symbol,
      Type,
      PriceSL,
      PriceTP,
    } = req.body;

    const metaLogin = loginToMeta(req.user.ID);

    const messageData = {
      Login: metaLogin,
      Position: Position,
      Symbol: Symbol,
      Type: Type,
      PriceSL: PriceSL,
      PriceTP: PriceTP,
    };
    dataSource.sendRequest(
      "position-modify",
      metaLogin.toString(),
      messageData,
      (response: any) => {
        console.log("Response: ", response);
        if (response?.RetCode) {
          resolve({
            RequestId: response.RequestId,
            RetCode: response.RetCode,
            RetCodeMessage: '',
            Data: response.Data
          })
        } else {
          resolve(response?.Data);
        }
      }
    );
  });
};
