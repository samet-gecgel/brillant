import { createClient, RedisClientType } from 'redis';
import 'dotenv/config'

const client: RedisClientType = createClient({
    url: String(process.env.REDIS_URL),
});

client.on('error', (err) => console.error('Redis Client Error', err));

export const connectRedis = async (): Promise<RedisClientType> => {
    await client.connect();
    console.log('Redis\'e bağlandı');
    return client;
};

export const disconnectRedis = async (): Promise<void> => {
    await client.quit();
    console.log('Redis bağlantısı kapatıldı');
};

export default client;
