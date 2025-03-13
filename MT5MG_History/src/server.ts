import fastifyJwt from '@fastify/jwt';
import fastify from "fastify";
import DataSource from './modules/data-source';
import * as colors from 'colors';
import getRouter from './routers/get';

colors.enable();
console.log('VERSION: ', 'v1.0.0-rc.1');

const dataSourceConnectOptions = {
	host: "52.214.58.254",
	port: 18085,
	keepAlive: true
}

export const dataSource = new DataSource(dataSourceConnectOptions);

const server = fastify({
	bodyLimit: 52428800
});

server.register(fastifyJwt, {
	secret: 'c-*MHGizAqx8,*%O}I1L~>5KaqE97ttf£n~0dWY*h02i[$7dA?',
	sign: {
		algorithm: 'HS256',
		expiresIn: '1h'
	},
});

server.register(getRouter);

server.addHook("onRequest", async (req, reply) => {
	console.log({ url: req.raw.url, id: req.id, path: req.routeOptions.url }, "received request");
	if (!dataSource.isReady) {
		reply
			.code(503)
			.send({ error: "Data source is not ready!" });
	}

	try {
		await req.jwtVerify()
	} catch (err) {
		console.log(err)
		reply.code(401).send({
			error: 'Authentication required'
		})
	}
});

server.listen({ port: 8446, host: "0.0.0.0" }, function (err, address) {
	if (err) {
		console.error(err);
		process.exit(1);
	}
});

export default server;