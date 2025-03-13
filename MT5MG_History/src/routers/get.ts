import { FastifyInstance } from "fastify";
import { ERROR_MESSAGES } from "../constants/errorMessages";
import getHistory from "../services/getHistory";
import { IRequest } from "../types/request";

async function getRouter(server: FastifyInstance) {
  server.get("/history", async (req: IRequest, reply) => {
    try {
      const result = await getHistory(req);
      reply.send(result);
    } catch (err) {
      console.log(err);
      reply.code(503).send({ error: err || ERROR_MESSAGES.INVALID_ORDER });
    }
  });
}

export default getRouter;
