import { FastifyInstance } from "fastify";
import { loginToMeta } from "../utils/helpers";
import { IRequest } from "../types/request";
import { returnCodes, returnStringCodes } from "../constants/codes";
import { dataSource } from "../server";
import { IResponse } from "../types/response";
import User from "../modules/user";
import Group from "../modules/group";
import GroupSymbol from "../modules/group-symbol";
import Symbol from "../modules/symbol";
import { IGroupSymbol } from "../modules/group-symbol/types";

async function postRouter(server: any) {
  server.post("/login", (req: IRequest, reply: any) => {
    try {
      if (!req.body.login || !req.body.password) {
        return reply.code(422).send({
          error: "Eksik giriş bilgisi!",
        });
      }
      if (!req.body.CUN || req.body.CUN < 2) {
        return reply.code(403).send({
          error:
            "Giriş yapabilmek için güncel uygulamayı indirmeniz gerekmektedir!",
        });
      }
      const login = loginToMeta(req.body.login);
      if (!login) {
        return reply.code(401).send({
          error: "Geçersiz giriş bilgisi!",
        });
      }
      const loginReq = {
        Login: login,
        password: req.body.password,
        logintype: null,
      };
      console.log('req gerceklesiyor!!')
      dataSource.sendRequest(
        "login",
        login.toString(),
        loginReq,
        async (response: IResponse) => {
          try {
            console.log('req icerisi res!!')
            const retCode = response.RetCode;
            if (retCode && retCode != '0') {
              return reply.code(401).send({
                error:
                  typeof retCode === "string"
                    ? returnStringCodes.get(retCode)
                    : returnCodes.get(retCode),
              });
            } else {
              console.log('group verileri aliniyor!!')
              let group : any ;
              await getSymbols()
              await getGroups().then(() => { 
              })
             .finally(() => {
              group = dataSource.groups.get(response.Data.User.Group);
             })

              if (!group) {
                return reply.code(503).send({ error: "Grup bulunamadı!" });
              }
              const data = response.Data;
              if (!data) {
                return reply.code(500).send({
                  error: "Internal Server Error",
                });
              }
              data.User.ID = req.body.login;
              data.User.Password = req.body.password;
              const user = new User(data.User);
              user.setOrders(data.Orders);
              user.setPositions(data.Positions);
              const token = server.jwt.sign(
                {
                  ID: req.body.login,
                  Leverage: user.Leverage,
                  Name: user.Name,
                  Phone: user.Phone,
                  EMail: user.EMail,
                  Group: user.Group,
                  IsInvestor: user.IsInvestor,
                  cid: Date.now(),
                },
                { expiresIn: "365d" }
              );
              reply.send({
                user: user.toJSON({
                  Token: token,
                }),
                group: group.toJSON(),
              });
            }
          } catch (error) {
            console.error(error);
            return reply.code(500).send({
              error: "Internal Server Error",
            });
          }
        }
      );
    } catch (error) {
      console.error(error);
      return reply.code(500).send({
        error: "Internal Server Error",
      });
    }
  });


  server.post('/set-favorite', async (req: IRequest, reply: any) => {
    try {
      const metaLogin = loginToMeta(req.user.ID);

      const user : any = await server.mysql.query('SELECT id FROM users WHERE userid = ?', [metaLogin]);

      if (user.length === 0) {
        return reply.code(203).send({ error: 'User not found!' });
      }

      const userId = user[0].id;

      const symbolData : any = await server.mysql.query('SELECT symbolid FROM symbols WHERE symbol = ? AND id = ?', [req.body.symbol, userId]);

      if (!req.body.isFavorited) {
        if (symbolData.length === 0) {
          await server.mysql.query('INSERT INTO symbols (symbol, id) VALUES (?, ?)', [req.body.symbol, userId]);
        }
      } else {
        if (symbolData.length > 0) {
          await server.mysql.query('DELETE FROM symbols WHERE symbolid = ?', [symbolData[0].symbolid]);
        }
      }

      reply.send({
        isFavorited: req.body.isFavorited
      });
    } catch (err) {
      console.log('FAVORFAVOR: ', err);
      reply.code(503).send({ error: err || "Bir hata oluştu!" });
    }
  });

  server.post("/change-password", async (req: IRequest, reply : any) => {
    try {
      if (!req.body.password || !req.body.newPassword) {
        return reply.code(401).send({
          error: "Şifreler birbiriyle uyuşmuyor!",
        });
      }

      const login = loginToMeta(req.body.login);
      if (!login) {
        return reply.code(401).send({
          error: "Geçersiz giriş bilgisi!",
        });
      }

      const changePasswordReq = {
        Login: login,
        Password: req.body.password,
        NewPassword: req.body.newPassword,
      };

      dataSource.sendRequest(
        "change-password",
        login.toString(),
        changePasswordReq,
        (response: IResponse) => {
          reply.send(response);
        }
      );
    } catch (error) {
      console.error(error);
      return reply.code(500).send({
        error: "Internal Server Error",
      });
    }
  });

  server.post("/symbol-added", (req : any, res : any) => {
    const symbolData: any = req.body;
    const symbol = new Symbol(symbolData);
    dataSource.symbols.set(symbolData.Symbol, symbol);
  });
  server.post("/symbol-updated", (req : any, res : any) => {
    const symbolData: any = req.body;
    const symbol = dataSource.symbols.get(symbolData.Symbol);
    if (symbol) {
      symbol.setSymbol(symbolData);
    }
  });
  server.post("/symbol-deleted", (req : any, res : any) => {
    const symbolData: any = req.body;
    dataSource.symbols.delete(symbolData.Symbol);
  });
  server.post("/group-added", (req : any, res : any) => {
    const groupData: any = req.body;
    const group = new Group(groupData);
    dataSource.groups.set(group.Group, group);
  });
  server.post("/group-deleted", (req : any, res : any) => {
    const groupData: any = req.body;
    dataSource.groups.delete(groupData.Group);
  });
  server.post("/group-updated", (req : any, res : any) => {
    const groupData: any = req.body;
    const oldGroup = dataSource.groups.get(groupData.Group);
    if (oldGroup) {
      groupData.Symbols.forEach((groupSymbol: any) => {
        const oldGroupSymbol = oldGroup.Symbols.get(groupSymbol.Path);
        if (oldGroupSymbol) {
          oldGroupSymbol.setGroupSymbol(groupSymbol);

          const symbolObj = dataSource.findSymbolByPath(groupSymbol.Path);
          if (symbolObj) {
            oldGroupSymbol.setSymbol(symbolObj);
          }
        } else {
          const groupSymbolObj = new GroupSymbol(groupSymbol);
          const symbolObj = dataSource.findSymbolByPath(groupSymbol.Path);
          if (symbolObj) {
            groupSymbolObj.setSymbol(symbolObj);
            oldGroup.Symbols.set(symbolObj.Path, groupSymbolObj);
          }
        }
      });
    }
  });
  server.post("/get-all-group", (req : any, res : any) => {
    const groupsData: any = req.body;
    Object.values(groupsData)
      .forEach((groupData: any) => {
        const groupObj = new Group(groupData);
        groupData.Symbols.forEach((groupSymbol: IGroupSymbol) => {
          const groupSymbolObj = new GroupSymbol(groupSymbol);
          if (groupSymbol.Symbol) {
            const symbol = new Symbol(groupSymbol.Symbol);
            groupSymbolObj.setSymbol(symbol);
          }
          groupObj.Symbols.set(groupSymbolObj.Path, groupSymbolObj);
        });
        dataSource.groups.set(groupObj.Group, groupObj);
      })
  });
  server.post("/get-all-symbol", (req : any, res : any) => {
    const symbolsData: any = req.body;
    Object.values(symbolsData).forEach((symbol: any) => {
      const symbolObj = new Symbol(symbol);
      dataSource.symbols.set(symbol.Symbol, symbolObj);
    });
  });
}

async function getSymbols() {
  console.log(String(process.env.TICK_SERVER_URL))
  await fetch(String(process.env.TICK_SERVER_URL) + '/symbols', {
    method: 'GET',
    headers : {
      'Authorization' : 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJRCI6IlBGMTA4OTAiLCJMZXZlcmFnZSI6MjAwLCJOYW1lIjoiUGhtIFVzZXIgMSIsIlBob25lIjoiIiwiRU1haWwiOiI0MDEwQG1haWwuY29tIiwiR3JvdXAiOiJyZWFsXFxQSE1cXEJWYXJpYWJsZS1VU0QtWmVybyIsIklzSW52ZXN0b3IiOmZhbHNlLCJjaWQiOjE3MTY4Mzg4MDYwOTMsImlhdCI6MTcxNjgzODgwNiwiZXhwIjoxNzQ4Mzc0ODA2fQ.6O217lEc7BtGs4lmLyB2gtnuHRkaXTVNWxWtdlyIZ4E'
    }
  })
    .then((data) => {
      return data.json()
    })
    .then((symbolsData: any) => {
      Object.values(symbolsData).forEach((symbol: any) => {
        const symbolObj = new Symbol(symbol);
        symbolObj.Tick.setTick(symbol.Tick.Ask, symbol.Tick.Bid, symbol.Tick.DateTime);
        dataSource.symbols.set(symbol.Symbol, symbolObj);
      });
    })
    .catch((err) => {
      console.log(err);
    });
}
async function getGroups() {
  await fetch(String(process.env.TICK_SERVER_URL) + '/groups', {
    method: 'GET',
    headers : {
      'Authorization' : 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJRCI6IlBGMTA4OTAiLCJMZXZlcmFnZSI6MjAwLCJOYW1lIjoiUGhtIFVzZXIgMSIsIlBob25lIjoiIiwiRU1haWwiOiI0MDEwQG1haWwuY29tIiwiR3JvdXAiOiJyZWFsXFxQSE1cXEJWYXJpYWJsZS1VU0QtWmVybyIsIklzSW52ZXN0b3IiOmZhbHNlLCJjaWQiOjE3MTY4Mzg4MDYwOTMsImlhdCI6MTcxNjgzODgwNiwiZXhwIjoxNzQ4Mzc0ODA2fQ.6O217lEc7BtGs4lmLyB2gtnuHRkaXTVNWxWtdlyIZ4E'
    }
  })
    .then((data) => {
      return data.json()
    })
    .then((groupsData: any) => {
      Object.values(groupsData)
        .forEach((groupData: any) => {
          const groupObj = new Group(groupData);
          groupData.Symbols.forEach((groupSymbol: IGroupSymbol) => {
            const groupSymbolObj = new GroupSymbol(groupSymbol);
            const symbolObj = dataSource.findSymbolByPath(groupSymbol.Path);
            if (symbolObj) {
              groupSymbolObj.setSymbol(symbolObj);
              groupObj.Symbols.set(symbolObj.Path, groupSymbolObj);
            }
            groupObj.Symbols.set(groupSymbolObj.Path, groupSymbolObj);
          });
          dataSource.groups.set(groupObj.Group, groupObj);

        })
    })
    .catch((err) => {
      console.log(err);
    });
}
export default postRouter;
