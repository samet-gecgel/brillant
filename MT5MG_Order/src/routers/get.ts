import { FastifyInstance } from "fastify";
import { IRequest } from "../types/request";
import { ERROR_MESSAGES } from "../constants/errorMessages";
import getOpenOrders from "../services/getOpenOrders";
import getOrder from "../services/getOrder";


async function getRouter(server:FastifyInstance) {
    server.get('/GetOpenOrders', async (req: IRequest, reply) => {
        try {
          const result = await getOpenOrders(req);
          reply.send(result);
        } catch (err) {
          console.log(err);
          reply.code(503).send({ error: err || ERROR_MESSAGES.INVALID_ORDER });
        }
      });
    server.get('/GetOrder', async (req: IRequest, reply) => {
        try {
          const result = await getOrder(req);
          reply.send(result);
        } catch (err) {
          console.log(err);
          reply.code(503).send({ error: err || ERROR_MESSAGES.INVALID_ORDER });
        }
      });
}

export default getRouter;