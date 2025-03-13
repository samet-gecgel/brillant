import { FastifyInstance } from "fastify";
import Symbol from "../modules/symbol";
import { dataSource } from "../server";
import GroupSymbol from "../modules/group-symbol";
import Group from "../modules/group";
import { IGroupSymbol } from "../modules/group-symbol/types";

async function postRouter(server: FastifyInstance) {
  server.post('/symbol-added', (req, res) => {
    const symbolData: any = req.body
    const symbol = new Symbol(symbolData);
    dataSource.symbols.set(symbolData.Symbol, symbol);
    res.send({ status: 'OK' });
  })
  server.post('/symbol-updated', (req, res) => {
    const symbolData: any = req.body
    const symbol = dataSource.symbols.get(symbolData.Symbol);
    if (symbol) {
      symbol.setSymbol(symbolData);
    }
    res.send({ status: 'OK' });
  })
  server.post('/symbol-deleted', (req, res) => {
    const symbolData: any = req.body
    dataSource.symbols.delete(symbolData.Symbol);
    res.send({ status: 'OK' });
  })
  server.post('/group-added', (req, res) => {
    const groupData: any = req.body;
    const group = new Group(groupData);
    dataSource.groups.set(group.Group, group);
    res.send({ status: 'OK' });
  })
  server.post('/group-deleted', (req, res) => {
    const groupData: any = req.body;
    dataSource.groups.delete(groupData.Group);
    res.send({ status: 'OK' });
  })
  server.post('/group-updated', (req, res) => {
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
        }
        else {
          const groupSymbolObj = new GroupSymbol(groupSymbol);
          const symbolObj = dataSource.findSymbolByPath(groupSymbol.Path);
          if (symbolObj) {
            groupSymbolObj.setSymbol(symbolObj);
            oldGroup.Symbols.set(symbolObj.Path, groupSymbolObj);
          }
        }
      });
    }
    res.send({ status: 'OK' });
  })
  server.post("/get-all-group", (req, res) => {
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
    res.send({ status: 'OK' });
  });
  server.post("/get-all-symbol", (req, res) => {
    const symbolsData: any = req.body;
    Object.values(symbolsData).forEach((symbol: any) => {
      const symbolObj = new Symbol(symbol);
      dataSource.symbols.set(symbol.Symbol, symbolObj);
    });
    res.send({ status: 'OK' });
  });
}


export default postRouter;