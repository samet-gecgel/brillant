import { FastifyInstance } from 'fastify';
import fastifyMysql from '@fastify/mysql';

export async function connectDB(fastify: FastifyInstance) {
    fastify.register(fastifyMysql, {
        connectionString: process.env.DATABASE_URL
    });
}
