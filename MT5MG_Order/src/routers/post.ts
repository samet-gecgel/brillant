import { FastifyInstance } from "fastify";
import { IRequest } from "../types/request";
import { ERROR_MESSAGES } from "../constants/errorMessages";
import { orderCreate } from "../services/orderCreate";
import { orderUpdate } from "../services/orderUpdate";
import { orderDelete } from "../services/orderDelete";

async function postRouter(server: FastifyInstance) {
  server.post("/OrderCreate", async (req: IRequest, reply: any) => {
    try {
      const result = await orderCreate(req);
      reply.send(result);
    } catch (err) {
      console.error(err);
      reply
        .code(503)
        .send({ error: err || ERROR_MESSAGES.INVALID_ORDER });
    }
  });
  server.post("/OrderUpdate", async (req: IRequest, reply: any) => {
    try {
      const result = await orderUpdate(req);
      reply.send(result);
    } catch (err) {
      console.error(err);
      reply
        .code(503)
        .send({ error: err || ERROR_MESSAGES.INVALID_ORDER });
    }
  });
  server.post("/OrderDelete", async (req: IRequest, reply: any) => {
    try {
      const result = await orderDelete(req);
      reply.send(result);
    } catch (err) {
      console.error(err);
      reply
        .code(503)
        .send({ error: err || ERROR_MESSAGES.INVALID_ORDER });
    }
  });
  
}
export default postRouter;
