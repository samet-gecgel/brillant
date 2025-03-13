import fastify from 'fastify';
import { disconnectRedis } from './modules/redis';
import DataSource from './modules/dataSource';
import getRouter from './routes/get';
import 'dotenv/config'

const dataSourceConnectOptions = {
    host: String(process.env.SERVER_IP),
    port: Number(process.env.SERVER_PORT),
    keepAlive: true
}

export const dataSource = new DataSource(dataSourceConnectOptions);

const server = fastify({
    bodyLimit: 52428800,
});

const port = 8449;

server.register(getRouter);

const startServer = async (): Promise<void> => {
    try {
        await server.listen({ port, host: '0.0.0.0' });
        console.log(`Server running on http://localhost:${port}`);
    } catch (err) {
        server.log.error(err);
        process.exit(1);
    }
};

process.on('SIGINT', async () => {
    await disconnectRedis();
    process.exit();
});

startServer().catch(err => {
    console.error('Error starting server:', err);
});
