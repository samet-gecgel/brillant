import { Socket } from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import type { IUser } from './types';
import * as crypto from 'node:crypto';
import server from '../../server';

export default class User implements IUser {
	ID: string = '';
	Login: number;
	Leverage: number;
	IsInvestor: boolean = false;
	Name: string;
	Phone: string;
	EMail: string;
	Group: string;
	InvestorId: string;
	Investors: Set<string> = new Set();
	Token: string;
	Socket?: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any> | undefined;
	secretKey: string = '%YsgyLHg5=H9Ybxf-hk5t9T5XwxWbTpd6nPCNNdA*sFG$+Czp#_LX2+qVNrg9AEvbE#G=t9NnQS8GXL!fpeYb-FPhGZ&ZM^kX3eTV9sBR#F%9@8GX=g#!tz=nbVE2#7*';

	constructor(data: IUser) {
		this.ID = data.ID;
		this.Login = data.Login;
		this.Leverage = data.Leverage;
		this.IsInvestor = data.IsInvestor;
		this.Name = data.Name;
		this.Phone = data.Phone;
		this.EMail = data.EMail;
		this.Group = data.Group;
		this.Token = data.Token;
		this.InvestorId = crypto.createHash('sha256').update(String(this.Login + this.secretKey)).digest('hex');
	}

	setUser(data: IUser) {
		this.Leverage = data.Leverage;
		this.Name = data.Name;
		this.Phone = data.Phone;
		this.EMail = data.EMail;
		this.Group = data.Group;
		this.IsInvestor = data.IsInvestor;
	}

	setSocket(socket: any) {
		this.Socket = socket;
	}

	clearSocket() {
		this.Socket = undefined;
	}

	setToken(token: string) {
		this.Token = token;
	}

	addInvestor(investorId: string) {
		this.Investors.add(investorId);
	}

	removeInvestor(investorId: string) {
		this.Investors.delete(investorId);
	}

	sendMessage(channel: string, data?: any, callbackFunc?: any) {
		if (this.Socket) {
			this.Socket.emit(channel, data);
		}
		server.io.to(this.InvestorId).emit(channel, data);
	}

	sendPrivateMessage(channel: string, data?: any, callbackFunc?: any) {
		if (this.Socket) {
			this.Socket.emit(channel, data);
		}
	}

	toJSON(args?: any) {
		return {
			ID: this.ID,
			Leverage: this.Leverage,
			//IsInvestor: this.IsInvestor,
			Name: this.Name,
			Phone: this.Phone,
			EMail: this.EMail,
			Group: this.Group,
			...args
		}
	}
}