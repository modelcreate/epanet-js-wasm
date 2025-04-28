//const epanetEngine = require("../dist/epanet_version.js");
import epanetEngine from "../../dist/epanet_version.js";

import { Project, Workspace, NodeType, FlowUnits, HeadLossType } from "epanet-js";


// Helper function to get node index with pre-allocated memory
function getNodeIndexFast(engine, projectHandle, nodeId, ptrToIndexHandlePtr) {
    const ptrNodeId = engine.stringToNewUTF8(nodeId)
    const errorCode = engine._EN_getnodeindex(projectHandle, ptrNodeId, ptrToIndexHandlePtr);
    return engine.getValue(ptrToIndexHandlePtr, 'i32');
}

function getNodeIndexCwarp(engine, fn, projectHandle, nodeId, ptrToIndexHandlePtr) {
    const errorCode = fn(projectHandle, nodeId, ptrToIndexHandlePtr);
    return engine.getValue(ptrToIndexHandlePtr, 'i32');
}

// Benchmark function that returns performance metrics
async function benchmarkNodeIndexCalls(iterations = 1000000) {
    const engine = await epanetEngine();

    const getNodeIndex = engine.cwrap('EN_getnodeindex', 'number', ['number','string','number'])

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
    if (errorCode !== 0) throw new Error(`Failed to create project: ${errorCode}`);
    projectHandle = engine.getValue(ptrToProjectHandlePtr, 'i32');
    engine._free(ptrToProjectHandlePtr);

    // Initialize Project
    ptrRptFile = engine.stringToNewUTF8("report.rpt")
    ptrBinFile = engine.stringToNewUTF8("out.bin")



    errorCode = engine._EN_init(projectHandle, ptrRptFile, ptrBinFile, 1, 1);
    if (errorCode !== 0) throw new Error(`Failed to initialize project: ${errorCode}`);
    engine._free(ptrRptFile);
    engine._free(ptrBinFile);

    // Add Node
    ptrNodeId = engine.stringToNewUTF8("J1")


    ptrToIndexHandlePtr = engine._malloc(4);
    errorCode = engine._EN_addnode(projectHandle, ptrNodeId, 0, ptrToIndexHandlePtr);
    if (errorCode !== 0) throw new Error(`Failed to add node: ${errorCode}`);
    indexOfNode = engine.getValue(ptrToIndexHandlePtr, 'i32');
    engine._free(ptrNodeId);
    engine._free(ptrToIndexHandlePtr);

    // Pre-allocate memory buffers for benchmarking
    const benchmarkPtrNodeId = engine._malloc(4);
    const benchmarkPtrToIndexHandlePtr = engine._malloc(4);
    
    

    const startTime = performance.now();
    for (let i = 0; i < iterations; i++) {
        getNodeIndexFast(engine, projectHandle, "J1",  benchmarkPtrToIndexHandlePtr);
        //getNodeIndexCwarp(engine, getNodeIndex, projectHandle, "J1", benchmarkPtrToIndexHandlePtr);
    }


    // CWRAP TEST
    
    //const valuePtr = engine._malloc(4);
    //const test = getNodeIndex(projectHandle, "J1", valuePtr);
    //const value = engine.getValue(valuePtr, 'i32');
    //console.log(`return: ${test} test value: ${value}`);
    //engine._free(valuePtr);
    //const test2 = getNodeIndexCwarp(engine, getNodeIndex, projectHandle, "J1", valuePtr);
    //console.log(`test2: ${test2}`);


    const endTime = performance.now();
    const durationSeconds = (endTime - startTime) / 1000;
    const runsPerSecond = iterations / durationSeconds;
    const millionRunsPerSecond = runsPerSecond / 1000000;

    // Clean up pre-allocated memory
    engine._free(benchmarkPtrNodeId);
    engine._free(benchmarkPtrToIndexHandlePtr);

    // Delete Project
    errorCode = engine._EN_deleteproject(projectHandle);
    if (errorCode !== 0) throw new Error(`Failed to delete project: ${errorCode}`);

    return {
        durationSeconds,
        runsPerSecond,
        millionRunsPerSecond,
        iterations
    };
}


function benchmarkNodeIndexCallsEpanetJs(iterations = 1000000) {

    const ws = new Workspace();
    const model = new Project(ws);

    model.init("report.rpt", "out.bin", FlowUnits.CFS, HeadLossType.HW);
    model.addNode("J1", NodeType.Junction);
    model.getNodeIndex("J1");

    const startTime = performance.now();

    for (let i = 0; i < iterations; i++) {
        model.getNodeIndex("J1");
    }

    const endTime = performance.now();
    const durationSeconds = (endTime - startTime) / 1000;
    const runsPerSecond = iterations / durationSeconds;
    const millionRunsPerSecond = runsPerSecond / 1000000;

    return {
        durationSeconds,
        runsPerSecond,
        millionRunsPerSecond,
        iterations
    };
}



export { benchmarkNodeIndexCalls, benchmarkNodeIndexCallsEpanetJs };


