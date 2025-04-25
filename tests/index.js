//const epanetEngine = require("../dist/epanet_version.js");
import epanetEngine from "../dist/epanet_version.js";
const engine = await epanetEngine();

console.log("epanetEngine", engine._getversion());
console.log("epanetEngine", engine._open_epanet());

