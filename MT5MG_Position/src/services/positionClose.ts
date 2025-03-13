import { ERROR_MESSAGES } from "../constants/errorMessages";
import { loginToMeta } from "../utils/loginToMeta";
import { dataSource } from "../server";
import { IRequest } from "../types/request";

export const positionClose = async (req: IRequest) => {
  return new Promise((resolve, reject) => {
    const {
      Position,
      Symbol,
      Volume,
    } = req.body;

    const metaLogin = loginToMeta(req.user.ID);

    const messageData = {
      Login: metaLogin,
      Position: Position,
      Symbol: Symbol,
      Volume: Volume * 10000,
    };
    dataSource.sendRequest(
      "position-close",
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
