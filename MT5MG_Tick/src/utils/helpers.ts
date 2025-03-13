import { retCodeToEventMap } from "../constants/constants";

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

export const getEventNameFromRetCodeMessage = (message: string): string | undefined => {
  message = message.split(' | ')[0];
  return retCodeToEventMap.get(message);
}