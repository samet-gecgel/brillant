import fastifyJwt from '@fastify/jwt';
import fastify from "fastify";
import 'dotenv/config'
import * as colors from 'colors';
import getRouter from "./routers/get";
import postRouter from "./routers/post"
import DataSource from './modules/data-source.js';

const allowedPaths = ['/symbol-added', '/symbol-updated', '/symbol-deleted', '/group-added',
	'/group-deleted', '/group-updated', '/get-all-group', '/get-all-symbol'];

colors.enable();
console.log('VERSION: ', 'v1.0.0-rc.1');

const dataSourceConnectOptions = {
	host: "52.214.58.254",
	port: 18088,
	keepAlive: true
}

export const dataSource = new DataSource(dataSourceConnectOptions);

const server = fastify({
	bodyLimit: 52428800
});

server.register(getRouter);

server.register(postRouter);

server.register(fastifyJwt, {
	secret: 'c-*MHGizAqx8,*%O}I1L~>5KaqE97ttf£n~0dWY*h02i[$7dA?',
	sign: {
		algorithm: 'HS256',
		expiresIn: '1h'
	},
});

server.addHook("onRequest", async (req: any, reply: any) => {
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

server.listen({ port: 8447, host: "0.0.0.0" }, function (err: any, address: any) {
	if (err) {
		// fastify.log.error(err);
		console.error(err);
		process.exit(1);
	}
	// Server is now listening on ${address}
});

export default server;
