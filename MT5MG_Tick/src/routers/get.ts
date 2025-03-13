import { FastifyInstance } from "fastify";
import { dataSource } from "../server";

async function getRouter(server: FastifyInstance) {
    server.get('/symbols', async (request, reply) => {
        try {
            if (dataSource.symbols.size > 1) {
                const mapToObject = Object.fromEntries(dataSource.symbols);
                reply.send(JSON.stringify(mapToObject))
            } else {
                reply.status(500).send({ error: 'symbols are empty' });
            }
        } catch (err) {
            console.log(err)
            reply.status(500).send({ error: err });
        }
    });
    server.get('/groups', async (request, reply) => {
        try {
            if (dataSource.groups.size > 1) {
                const mapToObject = Object.fromEntries(dataSource.groups);
                reply.send(JSON.stringify(mapToObject))
            } else {
                reply.status(500).send({ error: 'groups are empty' });
            }
        } catch (err) {
            console.log(err)
            reply.status(500).send({ error: err });
        }
    });
}

export default getRouter;