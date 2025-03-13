import 'fastify';
import { Pool } from 'mysql2/promise';

declare module 'fastify' {
  export interface FastifyInstance {
    mysql: Pool;
  }
}
