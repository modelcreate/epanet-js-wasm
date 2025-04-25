//const epanetEngine = require("../dist/epanet_version.js");
import epanetEngine from "../dist/epanet_version.js";
const engine = await epanetEngine();

let errorCode;
let projectHandle;
let ptrToProjectHandlePtr;
let ptrRptFile;
let ptrBinFile;
let ptrNodeId;
let ptrToIndexHandlePtr;
let indexOfNode;



// Create Project
ptrToProjectHandlePtr = engine._malloc(4);
errorCode = engine._EN_createproject(ptrToProjectHandlePtr);
console.log(`_EN_createproject: ${errorCode}`);
projectHandle = engine.getValue(ptrToProjectHandlePtr, 'i32');
engine._free(ptrToProjectHandlePtr);

// Initialize Project
ptrRptFile = engine.allocateUTF8("report.rpt");
ptrBinFile = engine.allocateUTF8("out.bin");
errorCode = engine._EN_init(projectHandle, ptrRptFile, ptrBinFile, 1, 1); // Units=GPM, Headloss=H-W
console.log(`_EN_init: ${errorCode}`);
engine._free(ptrRptFile);
engine._free(ptrBinFile);

// Add Node
ptrNodeId = engine.allocateUTF8("J1");
ptrToIndexHandlePtr = engine._malloc(4);
errorCode = engine._EN_addnode(projectHandle, ptrNodeId, 0 /* JUNCTION */, ptrToIndexHandlePtr);
console.log(`_EN_addnode: ${errorCode}`);
indexOfNode = engine.getValue(ptrToIndexHandlePtr, 'i32');
console.log(`Node index: ${indexOfNode}`);
engine._free(ptrNodeId);
engine._free(ptrToIndexHandlePtr);

// Delete Project
errorCode = engine._EN_deleteproject(projectHandle);
console.log(`_EN_deleteproject: ${errorCode}`);




//console.log("epanetEngine", engine._getversion());
//console.log("epanetEngine", engine._open_epanet());


// Code to replicate:
//for (let i = 1; i <= 3; i++) {
//    console.time("runSimulation");
//    const workspace = new Workspace();
//    const model = new Project(workspace);
//    workspace.writeFile("net1.inp", horribleInp);
//    model.open("net1.inp", "report.rpt", "out.bin");
//    model.close();
//    console.timeEnd("runSimulation");
//  }


// const workspace = new Workspace();
//      this._instance = epanetEngine;
//      this._FS = this._instance.FS;
//
// workspace.writeFile("net1.inp", horribleInp);
//       writeFile(path: string, data: string | ArrayBufferView) {
//        this._FS.writeFile(path, data);
//      }
//
// const model = new Project(workspace);
//   this._ws = ws;
//   this._instance = ws._instance;
//   this._EN = new this._ws._instance.Epanet();
//
