import { IResponse } from "../types/response";

export function roundToDigits(num: number, digits: number) {
  return Math.round(num * Math.pow(10, digits)) / Math.pow(10, digits);
}

export const codeList = [
  { code: 'pf', name: 'Phase Forex' },
  // { code: 'wx', name: 'Winex' },
]

export const loginToMeta = (login: string): number => {
  const regex = codeList.map((item) => item.code).join('|')
  const reg = new RegExp(`^(${regex})\\d{3,}$`, 'i')
  if (!reg.test(login)) {
    return 0;
  }

  const convertedLogin = Number(login.substring(2));
  if (isNaN(convertedLogin)) {
    return 0;
  }

  return parseInt((convertedLogin / 2).toString(), 9);
}


export const sendAccountToUser = async (data: IResponse): Promise<void> => {
  const url = String(process.env.TICK_SERVER_URL);
  const endPoint = '/send-account';
  try {
      const response = await fetch(url + endPoint, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
      });
      if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
      }
      const responseData = await response.json();
      console.log('Response from TICK server:', responseData);
  } catch (error) {
      console.error('Error posting data to TICK server:', error);
  }
}
