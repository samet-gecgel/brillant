import { dataSource } from "../server";
import { IRequest } from "../types/request";
import { formatDate, isValidHistoryType, loginToMeta } from "../utils/helpers";

const getHistory = (req: IRequest) => {
  return new Promise((resolve, reject) => {
    const { type, from, to } = req.query;

    if (!type || !from || !to || !isValidHistoryType(type)) {
      reject(new Error("Geçersiz istek!"));
      return;
    }

    const dateFrom = formatDate(from);
    const dateTo = formatDate(to);
    const metaLogin = loginToMeta(req.user.ID);

    const requestData = {
      LoginId: metaLogin,
      from: dateFrom,
      to: dateTo,
      historytype: type,
    };
    console.log(requestData);

    dataSource.sendRequest(
      "GetHistory",
      metaLogin.toString(),
      requestData,
      (response: any) => {
        console.log("Response: ", response);
        if (response.RetCode) {
          resolve(response);
        } else {
          resolve(response.Data[String(type)]);
        }
      }
    );
  });
};

export default getHistory;
