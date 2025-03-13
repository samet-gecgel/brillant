export interface IServerTime {
    ServerTime: number;
    // TimeServerAddress: 'de.pool.ntp.org',
    TimeZone: number;
}

export type setServerData = { 
  Groups: any,
  Symbols: any, 
  Time: IServerTime 
}