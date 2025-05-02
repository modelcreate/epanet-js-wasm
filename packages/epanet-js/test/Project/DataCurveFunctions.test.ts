import { Project, Workspace } from "../../src";

import fs from "fs";

const net1 = fs.readFileSync(__dirname + "/../data/tankTest.inp", "utf8");
const ws = new Workspace();
await ws.loadModule();

describe("Epanet Data Curve Functions", () => {
  describe("Impliment Methods", () => {
    test("get curve", () => {
      ws.writeFile("net1.inp", net1);
      const model = new Project(ws);
      model.open("net1.inp", "net1.rpt", "out.bin");

      const curve = model.getCurve(1);

      expect(curve.id).toEqual("CURVE_ID");
      expect(curve.x).toEqual([2, 5]);
      expect(curve.y).toEqual([5, 5]);
    });
  });
});
