import { dataSource } from "../server";
import { IRequest } from "../types/history";

export const codeList = [
  { code: 'pf', name: 'Phase Forex' },
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

export function getNextBarTime(barTime: number, resolution: number) {
  return barTime + resolution * 60;
}

export const getGraphData = (req: IRequest, resolution: number): Promise<{
  Bars: Array<[
    number, // time
    number, // open
    number, // high
    number, // low
    number, // close
    number, // volume
  ]>,
  Retcode: number
}> => {
  return new Promise((resolve, reject) => {
    if (!req.query.symbol || !req.query.from || !req.query.to) {
      throw new Error("Geçersiz istek!");
    }
    //   M    M     M     M     H240    D      W
    // ['1', '5', '30', '60', '4H', '1D', '1W']

    // console.error(req.query.from - (req.query.from % resolution));
    const dateFrom = new Date(req.query.from);
    const dateTo = new Date(req.query.to);
    console.log('dateFrom', dateFrom)
    console.log('dateTo', dateTo)

    const params = {
      Symbol: req.query.symbol,
      From: Math.round((dateFrom.getTime() - dataSource.serverTimeDiff) / 1000),
      To: Math.round((dateTo.getTime() - dataSource.serverTimeDiff) / 1000),
      Resolution: resolution,
    }
    const login_m = loginToMeta(req.user.ID)
    console.log('RESTRESDF', params.From, resolution)
    params.From -= params.From % resolution;
    console.log('PARAMETERS', params)

    dataSource.sendRequest('M1HISTORY', login_m.toString(), params, (response: any) => {
      console.log('result =======~~~~>>>>')
      console.log(response)
      resolve(response)
    })
  });
}