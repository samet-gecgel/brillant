import { FastifyInstance } from "fastify";
import { IRequest } from "../types/request";
import { ERROR_MESSAGES } from "../constants/errorMessages";
import { positionCreate } from "../services/positionCreate";
import { positionModify } from "../services/positionModify";
import { positionDelete } from "../services/positionDelete";
import { positionClose } from "../services/positionClose";
import { positionCloseAll } from "../services/positionCloseAll";

async function postRouter(server: FastifyInstance) {
  server.post("/position-create", async (req: IRequest, reply) => {
    try {
      const result = await positionCreate(req);
      reply.send(result);
    } catch (err) {
      console.log(err);
      reply.code(503).send({ error: err || ERROR_MESSAGES.INVALID_ORDER });
    }
  });
  server.post("/position-modify", async (req: IRequest, reply) => {
    try {
      const result = await positionModify(req);
      reply.send(result);
    } catch (err) {
      console.log(err);
      reply.code(503).send({ error: err || ERROR_MESSAGES.INVALID_ORDER });
    }
  });
  server.post("/position-delete", async (req: IRequest, reply) => {
    try {
      const result = await positionDelete(req);
      reply.send(result);
    } catch (err) {
      console.log(err);
      reply.code(503).send({ error: err || ERROR_MESSAGES.INVALID_ORDER });
    }
  });
  server.post("/position-close", async (req: IRequest, reply) => {
    try {
      const result = await positionClose(req);
      reply.send(result);
    } catch (err) {
      console.log(err);
      reply.code(503).send({ error: err || ERROR_MESSAGES.INVALID_ORDER });
    }
  });
  server.post("/position-close-all", async (req: IRequest, reply) => {
    try {
      const result = await positionCloseAll(req);
      reply.send(result);
    } catch (err) {
      console.log(err);
      reply.code(503).send({ error: err || ERROR_MESSAGES.INVALID_ORDER });
    }
  });
}
export default postRouter;
