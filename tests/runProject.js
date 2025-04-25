import epanetEngine from "../dist/epanet_version.js";
import fs from "fs";
const engine = await epanetEngine();

const startTime = performance.now();

let errorCode;
let projectHandle;
let ptrToProjectHandlePtr;
let ptrInpFile;
let ptrRptFile;
let ptrBinFile;
let ptrNodeId;
let ptrToIndexHandlePtr;
let indexOfNode;

const inpFileName = "./tests/sw-network1.inp";
const inpText = fs.readFileSync(inpFileName);
engine.FS.writeFile("net1.inp", inpText);

// Create Project
ptrToProjectHandlePtr = engine._malloc(4);
errorCode = engine._EN_createproject(ptrToProjectHandlePtr);
console.log(`_EN_createproject: ${errorCode}`);
projectHandle = engine.getValue(ptrToProjectHandlePtr, 'i32');
engine._free(ptrToProjectHandlePtr);

// Run Project
ptrInpFile = engine.allocateUTF8("net1.inp");
ptrRptFile = engine.allocateUTF8("report.rpt");
ptrBinFile = engine.allocateUTF8("out.bin");

errorCode = engine._EN_runproject(projectHandle, ptrInpFile, ptrRptFile, ptrBinFile, 0);
console.log(`_EN_init: ${errorCode}`);
engine._free(ptrInpFile);
engine._free(ptrRptFile);
engine._free(ptrBinFile);

// Delete Project
errorCode = engine._EN_deleteproject(projectHandle);
console.log(`_EN_deleteproject: ${errorCode}`);

const endTime = performance.now();
const durationSeconds = (endTime - startTime) / 1000;
console.log(`Completed in ${durationSeconds} seconds`);