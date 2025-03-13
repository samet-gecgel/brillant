import { Socket } from "socket.io";

export type IUser = {
    ID: string;
    Login: number;
    Leverage: number;
    IsInvestor: boolean;
    Name: string;
    Phone: string;
    EMail: string;
    Group: string;
    Token: string;
    Socket?: Socket;
    setSocket: (socket: any) => void;
    clearSocket: () => void;
    sendMessage: (channel: string, data: any, callback?: any) => void;
    Investors: Set<string>; // Yatırımcılar
    InvestorId: string;
}
