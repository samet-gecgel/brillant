import { ERROR_MESSAGES } from "../constants/errorMessages";
import { loginToMeta } from "../utils/loginToMeta";
import { dataSource } from "../server";
import { IRequest } from "../types/request";

export const orderCreate = async (req: IRequest) => {
  return new Promise((resolve, reject) => {
    const {
      Symbol,
      Volume,
      Type,
      PriceOrder,
      TypeTime,
      TimeExpiration,
      PriceSL,
      PriceTP,
    } = req.body;

    if (!Symbol || !Volume) {
      throw new Error(ERROR_MESSAGES.INVALID_ORDER);
    }

    const metaLogin = loginToMeta(req.user.ID);

    const messageData = {
      Login: metaLogin,
      Symbol: Symbol,
      Volume: Volume * 10000,
      Type: Type,
      PriceOrder: PriceOrder,
      TypeTime: TypeTime,
      TimeExpiration: TimeExpiration,
      PriceSL: PriceSL,
      PriceTP: PriceTP,
    };
    dataSource.sendRequest(
      "OrderCreate",
      metaLogin.toString(),
      messageData,
      (response: any) => {
        console.log("Response: ", response);
        if (response?.RetCode === 13) {
          resolve([]);
        } else if (response?.RetCode === 9) {
          resolve({ message: "Timeout expired." });
        } else {
          resolve(response?.Data);
        }
      }
    );
  });
};
