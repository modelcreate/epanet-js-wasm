import {
  ApiFunctionDefinition,
  EpanetMemoryType,
  CountType,
  NodeProperty,
  NodeType,
} from "./types";

export const apiDefinitions: Record<string, ApiFunctionDefinition> = {
  // EN_createproject is handled manually in constructor
  // EN_getversion is handled manually in version check

  init: {
    wasmFunctionName: "_EN_init", // Assuming leading underscore
    inputArgDefs: [
      // JS args: reportFile, binaryFile, hydOption, qualOption
      { typeHint: "string", isStringPtr: true }, // reportFile
      { typeHint: "string", isStringPtr: true }, // binaryFile
      { typeHint: "number" }, // hydOption (unitsType in C API)
      { typeHint: "number" }, // qualOption (headlossType in C API)
    ],
    outputArgTypes: [],
  },
  open: {
    wasmFunctionName: "_EN_open", // Assuming leading underscore
    inputArgDefs: [
      // JS args: reportFile, binaryFile, hydOption, qualOption
      { typeHint: "string", isStringPtr: true }, // inputFile
      { typeHint: "string", isStringPtr: true }, // reportFile
      { typeHint: "string", isStringPtr: true }, // binaryFile
    ],
    outputArgTypes: [],
  },
  close: {
    wasmFunctionName: "_EN_close",
    inputArgDefs: [],
    outputArgTypes: [],
  },
  addNode: {
    wasmFunctionName: "_EN_addnode",
    inputArgDefs: [
      // JS args: id, type
      { typeHint: "string", isStringPtr: true }, // id
      { typeHint: "enum", isStringPtr: false }, // type (NodeType enum)
    ],
    outputArgTypes: ["int"], // Index pointer
  },
  getCount: {
    wasmFunctionName: "_EN_getcount",
    inputArgDefs: [{ typeHint: "enum" }], // countType (CountType enum)
    outputArgTypes: ["int"],
  },
  getNodeIndex: {
    wasmFunctionName: "_EN_getnodeindex",
    inputArgDefs: [{ typeHint: "string", isStringPtr: true }], // id string
    outputArgTypes: ["int"], // index pointer
  },
  getNodeValue: {
    wasmFunctionName: "_EN_getnodevalue",
    inputArgDefs: [
      // index, property
      { typeHint: "number" },
      { typeHint: "enum" }, // NodeProperty enum
    ],
    outputArgTypes: ["double"], // value pointer
  },
  setNodeValue: {
    wasmFunctionName: "_EN_setnodevalue",
    inputArgDefs: [
      // index, property, value
      { typeHint: "number" },
      { typeHint: "enum" }, // NodeProperty enum
      { typeHint: "number" }, // value
    ],
    outputArgTypes: [],
  },
  getNodeType: {
    wasmFunctionName: "_EN_getnodetype",
    inputArgDefs: [{ typeHint: "number" }], // index
    outputArgTypes: ["int"], // type pointer
  },
  setJunctionData: {
    // Example provided by user, needs arg clarification
    // C API: int EN_setjuncdata(int index, double elev, double dmnd, char *dmndpat);
    // Let's assume JS API matches user declaration: (nodeIndex, demand, patternIndex, demandCategory)
    // This needs adjustment based on the *actual* C API requirements vs the desired JS API.
    // Assuming JS takes pattern *ID* (string) not index, and maybe demandCategory isn't used?
    // Revisit this based on C API vs JS API design. Example assuming elev=0, patternId is string:
    wasmFunctionName: "_EN_setjuncdata",
    inputArgDefs: [
      // JS args: nodeIndex, elev, demand, patternId
      { typeHint: "number" }, // nodeIndex
      { typeHint: "number" }, // elev (assuming fixed or added to JS API)
      { typeHint: "number" }, // demand
      { typeHint: "string", isStringPtr: true }, // patternId string
    ],
    outputArgTypes: [],
  },

  // --- Example Version-Gated Function ---
  getSpecialNodePropertyV23: {
    wasmFunctionName: "_EN_getspecialnodeprop_v23", // Replace with actual name
    inputArgDefs: [{ typeHint: "number" }], // nodeIndex
    outputArgTypes: ["double"],
    minVersion: 20300, // Requires EPANET 2.3.0+
  },

  // Node Functions
  deleteNode: {
    wasmFunctionName: "_EN_deletenode",
    inputArgDefs: [
      { typeHint: "number" }, // index
      { typeHint: "enum" }, // actionCode (ActionCodeType enum)
    ],
    outputArgTypes: [],
  },

  getNodeId: {
    wasmFunctionName: "_EN_getnodeid",
    inputArgDefs: [{ typeHint: "number" }], // index
    outputArgTypes: ["char"],
  },

  setNodeId: {
    wasmFunctionName: "_EN_setnodeid",
    inputArgDefs: [
      { typeHint: "number" }, // index
      { typeHint: "string", isStringPtr: true }, // newid
    ],
    outputArgTypes: [],
  },

  setTankData: {
    wasmFunctionName: "_EN_settankdata",
    inputArgDefs: [
      { typeHint: "number" }, // index
      { typeHint: "number" }, // elev
      { typeHint: "number" }, // initlvl
      { typeHint: "number" }, // minlvl
      { typeHint: "number" }, // maxlvl
      { typeHint: "number" }, // diam
      { typeHint: "number" }, // minvol
      { typeHint: "string", isStringPtr: true }, // volcurve
    ],
    outputArgTypes: [],
  },

  getCoordinates: {
    wasmFunctionName: "_EN_getcoord",
    inputArgDefs: [{ typeHint: "number" }], // index
    outputArgTypes: ["double", "double"],
  },

  setCoordinates: {
    wasmFunctionName: "_EN_setcoord",
    inputArgDefs: [
      { typeHint: "number" }, // index
      { typeHint: "number" }, // x
      { typeHint: "number" }, // y
    ],
    outputArgTypes: [],
  },

  // ... Define ALL other EPANET functions ...
};
