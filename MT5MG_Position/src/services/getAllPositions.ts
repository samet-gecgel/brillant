import { dataSource } from "../server";
import { IRequest } from "../types/request";
import { loginToMeta } from "../utils/loginToMeta";

const getAllPositions = (req: IRequest): Promise<any> => {
    return new Promise((resolve, reject) => {
  
      const metaLogin = loginToMeta(req.user.ID);
  
      if (!metaLogin) {
        return reject({ message: 'Invalid Login ID mapping.' });
      }
  
      const requestData = {
        LoginId: metaLogin,
      };
  
      console.log('Request Data:', requestData);
  
      dataSource.sendRequest(
        'get-positions',
        metaLogin.toString(),
        requestData,
        (response: any) => {
          console.log('Response:', response);
  
          if (response?.RetCode === 13) {
            resolve([]);
          } else if (response?.RetCode === 9) {
            resolve({ message: 'Timeout expired.' });
          } else if (response?.RetCode === 97) {
            resolve({ message: 'Login ID or Position not found.' });
          } else {
            resolve(response?.Data);
          }
        }
      );
    });
  };
export default getAllPositions;