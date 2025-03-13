import Order from '../order';
import Position from '../position';
import type { IUser } from './types';

export default class User implements IUser {
	ID: string = '';
	Login: number;
	Password: string;
	Leverage: number;
	LimitPositionsValue: number;
	LimitOrders: number;
	Balance: number;
	Credit: number;
	BalancePrevDay: number;
	MarginFree: number;
	Margin: number;
	IsInvestor: boolean = false;
	Name: string;
	Phone: string;
	EMail: string;
	Group: string;
	Token: string = '';
	Orders: Map<number, Order> = new Map();
	Positions: Map<number, Position> = new Map();
	FavoriteSymbols: Array<string> = [];

	constructor(data: IUser) {
		this.ID = data.ID;
		this.Login = data.Login;
		this.Password = data.Password;
		this.Leverage = data.Leverage;
		this.LimitPositionsValue = data.LimitPositionsValue;
		this.LimitOrders = data.LimitOrders;
		this.Balance = data.Balance;
		this.Credit = data.Credit;
		this.BalancePrevDay = data.BalancePrevDay;
		this.MarginFree = data.MarginFree;
		this.Margin = data.Margin;
		this.IsInvestor = data.IsInvestor;
		this.Name = data.Name;
		this.Phone = data.Phone;
		this.EMail = data.EMail;
		this.Group = data.Group;
		this.FavoriteSymbols = [];
	}

	setUser(data: IUser) {
		this.Leverage = data.Leverage;
		this.Name = data.Name;
		this.Phone = data.Phone;
		this.EMail = data.EMail;
		this.Group = data.Group;
		this.IsInvestor = data.IsInvestor;
		this.LimitPositionsValue = data.LimitPositionsValue;
		this.LimitOrders = data.LimitOrders;
		this.Balance = data.Balance;
		this.Credit = data.Credit;
		this.BalancePrevDay = data.BalancePrevDay;
		this.MarginFree = data.MarginFree;
		this.Margin = data.Margin;
	}

	setPositions(positions: Position[]) {
		positions.forEach((position: Position) => {
			this.Positions.set(position.Position, new Position(position));
		});
	}

	setOrders(orders: Order[]) {
		orders.forEach((order: Order) => {
			this.Orders.set(order.Order, new Order(order));
		});
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
			LimitPositionsValue: this.LimitPositionsValue,
			LimitOrders: this.LimitOrders,
			Balance: this.Balance,
			Credit: this.Credit,
			BalancePrevDay: this.BalancePrevDay,
			MarginFree: this.MarginFree,
			Margin: this.Margin,
			FavoriteSymbols: this.FavoriteSymbols,
			Orders: Array.from(this.Orders.values()).map((order: Order) => order.toJSON()),
			Positions: Array.from(this.Positions.values()).map((position: Position) => position.toJSON()),
			...args
		}
	}
}