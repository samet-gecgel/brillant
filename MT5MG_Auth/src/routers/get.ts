import { FastifyInstance } from "fastify";
import { IRequest } from "../types/request";
import { loginToMeta, sendAccountToUser } from "../utils/helpers";
import { dataSource } from "../server";
import { IResponse } from "../types/response";

async function getRouter(server: any) {
  server.get("/banks", async (request:any, reply:any) => {
    try {
      const query = `
      SELECT b.id, b.code, b.title, c.currency, c.account_name, c.iban
      FROM Banks b
      JOIN Currencies c ON b.id = c.bank_id;
    `;
    const result = await new Promise((resolve, reject) => {
      server.mysql.query(query, (err : any, result : any) => {
        if (err) {
          return reject(err);
        }
        resolve(result);
      });
    });
      reply.send(result);
    } catch (err) {
      console.error(err);
      reply.status(503).send({ error: "Server error" });
    }
  });

  server.get("/get-user", async (req: IRequest, reply:any) => {
    try {
      if (!req.query.login || !req.query.password) {
        return reply.code(422).send({
          error: "Eksik giriş bilgisi!",
        });
      }

      const login = loginToMeta(req.query.login);
      if (!login) {
        return reply.code(401).send({
          error: "Geçersiz giriş bilgisi!",
        });
      }

      const loginReq = {
        login: login,
        password: req.query.password,
        logintype: null,
      };

      const response = await new Promise((resolve, reject) => {
        dataSource.sendRequest(
          "get-user",
          login.toString(),
          loginReq,
          (response: IResponse) => {
            resolve(response);
          }
        );
      });
      reply.send(response);
    } catch (error) {
      console.error(error);
      return reply.code(500).send({
        error: "Internal Server Error",
      });
    }
  });
  server.get("/get-account", async (req: IRequest, reply:any) => {
    try {
        if (!req.query.login || !req.query.password) {
            return reply.code(422).send({
                error: "Eksik giriş bilgisi!",
            });
        }

        const login = loginToMeta(req.query.login);
        if (!login) {
            return reply.code(401).send({
                error: "Geçersiz giriş bilgisi!",
            });
        }

        const loginReq = {
            login: login,
            password: req.query.password,
            logintype: null,
        };

        const response = await new Promise<IResponse>((resolve, reject) => {
            dataSource.sendRequest(
                "get-account",
                login.toString(),
                loginReq,
                (response: IResponse) => {
                    resolve(response);
                }
            );
        });

        await sendAccountToUser(response);

        reply.send(response);
    } catch (error) {
        console.error(error);
        return reply.code(500).send({
            error: "Internal Server Error",
        });
    }
});



}

export default getRouter;
