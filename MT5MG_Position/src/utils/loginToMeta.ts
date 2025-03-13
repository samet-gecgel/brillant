export const codeList = [
  { code: "pf", name: "Phase Forex" },
  // { code: 'wx', name: 'Winex' },
];

export const loginToMeta = (login: string): number => {
  const regex = codeList.map((item) => item.code).join('|')
  const reg = new RegExp(`^(${regex})\\d{3,}$`, 'i')
  if (!reg.test(login)) {
    return 0;
    // console.log('loginToMeta', login, reg.source);
    // return Number(login);
  }

  const convertedLogin = Number(login.substring(2));
  if (isNaN(convertedLogin)) {
    return 0;
  }

  return parseInt((convertedLogin / 2).toString(), 9);
}
