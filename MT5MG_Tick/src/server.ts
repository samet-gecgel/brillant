import fastifyJwt from '@fastify/jwt';
import fastify from "fastify";
import fastifyIO from "fastify-socket.io";
import DataSource from './modules/data-source';
import 'dotenv/config'
import * as colors from 'colors';
import postRouter from './routers/post';
import { loginToMeta } from './utils/helpers';
import getRouter from './routers/get';
import User from './modules/user';

const allowedPaths = ['/symbol-added', '/symbol-updated', '/symbol-deleted', '/group-added',
	'/group-deleted', '/group-updated', '/get-all-group', '/get-all-symbol', '/send-message'];

colors.enable();
console.log('VERSION: ', 'v1.0.0-rc.1');

const dataSourceConnectOptions = {
	host: "52.214.58.254",
	port: 18089,
	keepAlive: true
}

export const dataSource = new DataSource(dataSourceConnectOptions);

const server = fastify({
	bodyLimit: 52428800
});
server.register(getRouter);
server.register(fastifyIO, {
	maxHttpBufferSize: 1e8,
});

server.register(fastifyJwt, {
	secret: 'c-*MHGizAqx8,*%O}I1L~>5KaqE97ttf£n~0dWY*h02i[$7dA?',
	sign: {
		algorithm: 'HS256',
		expiresIn: '1h'
	},
});

server.register(postRouter);

server.addHook("onRequest", async (req, reply) => {
	console.log({ url: req.raw.url, id: req.id, path: req.routeOptions.url }, "received request");
	if (!dataSource.isReady) {
		reply
			.code(503)
			.send({ error: "Data source is not ready!" });
	}

	if (req.ip === '127.0.0.1' && allowedPaths.includes(req.url)) return

	try {
		await req.jwtVerify()
	} catch (err) {
		console.log(err)
		reply.code(401).send({
			error: 'Authentication required'
		})
	}
});

server.ready().then(() => {
	server.io.on("connection", (socket) => {
		try {
			console.log("USER CONNECTED: ", socket.id);
			if (!socket.handshake.headers.authorization) {
				console.error('Authorization required');
				throw new Error('Authorization required');
			}
			const token: string = socket.handshake.headers.authorization.split(' ')[1];
			const user = server.jwt.verify(token) as any;
			if (!user) {
				console.error('Authorization required');
				throw new Error('Authorization required');
			}
			console.log('user verified', user.ID);
			const group = dataSource.groups.get(user.Group);
			if (!group) {
				console.error('Grup bulunamadı');
				throw new Error('Grup bulunamadı');
			}
			const metaLogin = loginToMeta(user.ID);
			const existingUser = dataSource.users.get(metaLogin);
			if (!existingUser) {
				user.Login = metaLogin;
				const newUser = new User(user);
				if (!user.IsInvestor) {
					newUser.setToken(token);
					newUser.setSocket(socket);
				} else {
					socket.join(newUser.InvestorId)
					newUser.addInvestor(socket.id);
				}

				for (let [_, groupSymbol] of group.Symbols) {
					if (groupSymbol.Symbol) {
						groupSymbol.Symbol.setOnTick(metaLogin, () => {
							const symbol = groupSymbol.Symbol?.Symbol;
							if (symbol) {
								newUser.sendMessage(symbol, groupSymbol.getTick());
							}
						});
					}
				}

				dataSource.users.set(metaLogin, newUser);
			} else {
				if (user.IsInvestor) {
					socket.join(existingUser.InvestorId)
					existingUser.addInvestor(socket.id);
				} else {
					existingUser.setToken(token);
					existingUser.sendPrivateMessage('logout', { message: 'Başka bir cihazda giriş yapıldığı için sistemden çıkış yapıldı.', type: 'error' });
					existingUser.setSocket(socket);
				}
			}

			socket.on("disconnect", () => {
				console.log("USER DISCONNECTED!!!: !", user.Name);
				const existingUser = dataSource.users.get(metaLogin);

				if (existingUser) {
					if (user.IsInvestor) {
						existingUser.removeInvestor(socket.id);
					} else {
						existingUser.clearSocket();
					}
					if (existingUser.Investors.size === 0 && !existingUser.Socket) {
						for (let [_, groupSymbol] of group.Symbols) {
							if (groupSymbol.Symbol) {
								groupSymbol.Symbol.offOnTick(metaLogin);
							}
						}
						dataSource.users.delete(metaLogin);
					}
				}
			});
		}
		catch (err) {
			console.log(err)
			socket.disconnect()
		}
	});
});

server.listen({ port: 8448, host: "0.0.0.0" }, function (err, address) {
	if (err) {
		console.error(err);
		process.exit(1);
	}
});

export default server;