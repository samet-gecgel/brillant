import { ERROR_MESSAGES } from "../constants/errorMessages";
import { loginToMeta } from "../utils/loginToMeta";
import { dataSource } from "../server";
import { IRequest } from "../types/request";

export const positionCreate = async (req: IRequest) => {
  return new Promise((resolve, reject) => {
    const {
      Volume,
      Symbol,
      Type,
      Price,
      PriceSL,
      PriceTP,
    } = req.body;

    if (!Symbol || !Volume) {
      throw new Error(ERROR_MESSAGES.INVALID_ORDER);
    }

    const metaLogin = loginToMeta(req.user.ID);

    const messageData = {
      Login: metaLogin,
      Volume: Volume * 10000,
      Symbol: Symbol,
      Type: Type,
      Price: Price,
      PriceSL: PriceSL,
      PriceTP: PriceTP,
    };
    dataSource.sendRequest(
      "position-create",
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
