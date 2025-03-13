import { FastifyInstance } from "fastify";
import { IRequest } from "../types/history";
import { getGraphData } from "../utils/helper";
import { dataSource } from "../server";

async function getRouter(server: FastifyInstance) {
  server.get("/graph-data", async (req: IRequest, reply) => {
    try {

      const group = dataSource.groups.get(req.user.Group);

      if (!group) {
        return reply.code(401).send({
          error: 'Unauthorized1!'
        });
      }

      const groupSymbol = group.findSymbolByName(req.query.symbol);
      console.log(groupSymbol)
      if (!groupSymbol || !groupSymbol.Symbol) {
        return reply.code(401).send({
          error: 'Unauthorized2!'
        });
      }
      let bidSpread = 0;

      if (groupSymbol.SpreadDiff !== 0) {
        const diff = ~~(groupSymbol.SpreadDiff / 2);
        bidSpread = (groupSymbol.SpreadDiff - diff) * Math.pow(10, -groupSymbol.Symbol.Digits)
      }

      const multipliers = {
        '': 1,
        'D': 1440,
        'W': 10080,
        'M': 43200,
      } as { [key: string]: number };

      const multiplier = /(\d+)([MWD]?)/.exec(req.query.resolution) || ['1', '1', ''];
      const resolution = parseInt(multiplier[1]) * multipliers[multiplier[2]];

      const result = await getGraphData(req, resolution);
      console.log('GraphData: ', result)
      if (result.Bars.length === 1 && result.Bars[0][0] === 0) {
        return reply.send([]);
      }

      const barData = result.Bars.map((bar) => {
        return {
          time: bar[0] * 1000 + dataSource.serverTimeDiff,
          open: bar[1] - bidSpread,
          high: bar[2] - bidSpread,
          low: bar[3] - bidSpread,
          close: bar[4] - bidSpread,
          volume: bar[5],
        };
      });

      reply.send(barData);
    }
    catch (err) {
      console.log(err)
      reply
        .code(503)
        .send({ error: err || "Geçersiz istek formatı!" });
    }
  });
}

export default getRouter;