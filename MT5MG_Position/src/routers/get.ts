import { FastifyInstance } from "fastify";
import { IRequest } from "../types/request";
import { ERROR_MESSAGES } from "../constants/errorMessages";
import getPosition from "../services/getPosition";
import getAllPositions from "../services/getAllPositions";

async function getRouter(server:FastifyInstance) {
    server.get('/get-positions', async (req: IRequest, reply) => {
        try {
          const result = await getAllPositions(req);
          reply.send(result);
        } catch (err) {
          console.log(err);
          reply.code(503).send({ error: err || ERROR_MESSAGES.INVALID_ORDER });
        }
      });
    server.get('/position-get', async (req: IRequest, reply) => {
        try {
          const result = await getPosition(req);
          reply.send(result);
        } catch (err) {
          console.log(err);
          reply.code(503).send({ error: err || ERROR_MESSAGES.INVALID_ORDER });
        }
      });
}

export default getRouter;