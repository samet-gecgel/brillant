import { ERROR_MESSAGES } from "../constants/errorMessages";
import { loginToMeta } from "../utils/loginToMeta";
import { dataSource } from "../server";
import { IRequest } from "../types/request";

export const orderUpdate = async (req: IRequest) => {
  return new Promise((resolve, reject) => {
    const {
      Order,
      Reason,
      TimeSetup,
      TimeExpiration,
      Type,
      TypeTime,
      Volume,
      VolumeCurrent,
      TypeFill,
      PriceOrder,
      PriceSL,
      PriceTP,
      RateMargin,
      Symbol,
    } = req.body;

    if (!Symbol || !Volume) {
      throw new Error(ERROR_MESSAGES.INVALID_ORDER);
    }

    const metaLogin = loginToMeta(req.user.ID);

    const messageData = {
      Order: Order,
      Login: metaLogin,
      Reason: Reason,
      TimeSetup: TimeSetup,
      TimeExpiration: TimeExpiration,
      Type: Type,
      TypeTime: TypeTime,
      Volume: Volume * 10000,
      VolumeCurrent: VolumeCurrent,
      TypeFill: TypeFill,
      PriceOrder: PriceOrder,
      PriceSL: PriceSL,
      PriceTP: PriceTP,
      RateMargin: RateMargin,
      Symbol: Symbol,
    };
    dataSource.sendRequest(
      "OrderUpdate",
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
