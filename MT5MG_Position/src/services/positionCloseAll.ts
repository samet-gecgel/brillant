import { ERROR_MESSAGES } from "../constants/errorMessages";
import { loginToMeta } from "../utils/loginToMeta";
import { dataSource } from "../server";
import { IRequest } from "../types/request";

export const positionCloseAll = async (req: IRequest) => {
  return new Promise((resolve, reject) => {
    const {
      Symbol,
    } = req.body;

    if (!Symbol) {
      throw new Error(ERROR_MESSAGES.INVALID_ORDER);
    }

    const metaLogin = loginToMeta(req.user.ID);

    const messageData = {
      Login: metaLogin,
      Symbol: Symbol,
    };
    dataSource.sendRequest(
      "position-close-all",
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
