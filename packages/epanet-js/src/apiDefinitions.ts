import { ApiFunctionDefinition } from "./types";

export const apiDefinitions: Record<string, ApiFunctionDefinition> = {
  // EN_createproject is handled manually in constructor
  // EN_getversion is handled manually in version check

  init: {
    wasmFunctionName: "_EN_init",
    inputArgDefs: [
      { typeHint: "string", isStringPtr: true }, // reportFile
      { typeHint: "string", isStringPtr: true }, // binaryFile
      { typeHint: "number" }, // hydOption (unitsType in C API)
      { typeHint: "number" }, // qualOption (headlossType in C API)
    ],
    outputArgDefs: [],
  },
  open: {
    wasmFunctionName: "_EN_open",
    inputArgDefs: [
      { typeHint: "string", isStringPtr: true }, // inputFile
      { typeHint: "string", isStringPtr: true }, // reportFile
      { typeHint: "string", isStringPtr: true }, // binaryFile
    ],
    outputArgDefs: [],
  },
  close: {
    wasmFunctionName: "_EN_close",
    inputArgDefs: [],
    outputArgDefs: [],
  },
  addNode: {
    wasmFunctionName: "_EN_addnode",
    inputArgDefs: [
      { typeHint: "string", isStringPtr: true }, // id
      { typeHint: "enum", isStringPtr: false }, // type (NodeType enum)
    ],
    outputArgDefs: [{ name: "index", type: "int" }],
  },
  getCount: {
    wasmFunctionName: "_EN_getcount",
    inputArgDefs: [{ typeHint: "enum" }], // countType (CountType enum)
    outputArgDefs: [{ name: "count", type: "int" }],
  },
  getNodeIndex: {
    wasmFunctionName: "_EN_getnodeindex",
    inputArgDefs: [{ typeHint: "string", isStringPtr: true }], // id string
    outputArgDefs: [{ name: "index", type: "int" }],
  },
  getNodeValue: {
    wasmFunctionName: "_EN_getnodevalue",
    inputArgDefs: [
      { typeHint: "number" },
      { typeHint: "enum" }, // NodeProperty enum
    ],
    outputArgDefs: [{ name: "value", type: "double" }],
  },
  setNodeValue: {
    wasmFunctionName: "_EN_setnodevalue",
    inputArgDefs: [
      { typeHint: "number" },
      { typeHint: "enum" }, // NodeProperty enum
      { typeHint: "number" }, // value
    ],
    outputArgDefs: [],
  },
  getNodeType: {
    wasmFunctionName: "_EN_getnodetype",
    inputArgDefs: [{ typeHint: "number" }], // index
    outputArgDefs: [{ name: "type", type: "int" }],
  },
  setJunctionData: {
    wasmFunctionName: "_EN_setjuncdata",
    inputArgDefs: [
      { typeHint: "number" }, // nodeIndex
      { typeHint: "number" }, // elev
      { typeHint: "number" }, // demand
      { typeHint: "string", isStringPtr: true }, // patternId string
    ],
    outputArgDefs: [],
  },

  // --- Example Version-Gated Function ---
  openX: {
    wasmFunctionName: "_EN_openX",
    inputArgDefs: [{ typeHint: "number" }], // nodeIndex
    outputArgDefs: [{ name: "value", type: "double" }],
    minVersion: 20300, // Requires EPANET 2.3.0+
  },

  // Node Functions
  deleteNode: {
    wasmFunctionName: "_EN_deletenode",
    inputArgDefs: [
      { typeHint: "number" }, // index
      { typeHint: "enum" }, // actionCode (ActionCodeType enum)
    ],
    outputArgDefs: [],
  },

  getNodeId: {
    wasmFunctionName: "_EN_getnodeid",
    inputArgDefs: [{ typeHint: "number" }], // index
    outputArgDefs: [{ name: "id", type: "char" }],
  },

  setNodeId: {
    wasmFunctionName: "_EN_setnodeid",
    inputArgDefs: [
      { typeHint: "number" }, // index
      { typeHint: "string", isStringPtr: true }, // newid
    ],
    outputArgDefs: [],
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
    outputArgDefs: [],
  },

  getCoordinates: {
    wasmFunctionName: "_EN_getcoord",
    inputArgDefs: [{ typeHint: "number" }], // index
    outputArgDefs: [
      { name: "x", type: "double" },
      { name: "y", type: "double" },
    ],
  },

  setCoordinates: {
    wasmFunctionName: "_EN_setcoord",
    inputArgDefs: [
      { typeHint: "number" }, // index
      { typeHint: "number" }, // x
      { typeHint: "number" }, // y
    ],
    outputArgDefs: [],
  },

  // Hydraulic Analysis Functions
  solveH: {
    wasmFunctionName: "_EN_solveH",
    inputArgDefs: [],
    outputArgDefs: [],
  },

  useHydFile: {
    wasmFunctionName: "_EN_usehydfile",
    inputArgDefs: [
      { typeHint: "string", isStringPtr: true }, // filename
    ],
    outputArgDefs: [],
  },

  openH: {
    wasmFunctionName: "_EN_openH",
    inputArgDefs: [],
    outputArgDefs: [],
  },

  initH: {
    wasmFunctionName: "_EN_initH",
    inputArgDefs: [
      { typeHint: "enum" }, // initFlag (InitHydOption enum)
    ],
    outputArgDefs: [],
  },

  runH: {
    wasmFunctionName: "_EN_runH",
    inputArgDefs: [],
    outputArgDefs: [{ name: "currentTime", type: "int" }],
  },

  nextH: {
    wasmFunctionName: "_EN_nextH",
    inputArgDefs: [],
    outputArgDefs: [{ name: "tStep", type: "int" }],
  },

  saveH: {
    wasmFunctionName: "_EN_saveH",
    inputArgDefs: [],
    outputArgDefs: [],
  },

  saveHydFile: {
    wasmFunctionName: "_EN_savehydfile",
    inputArgDefs: [
      { typeHint: "string", isStringPtr: true }, // filename
    ],
    outputArgDefs: [],
  },

  closeH: {
    wasmFunctionName: "_EN_closeH",
    inputArgDefs: [],
    outputArgDefs: [],
  },

  // Network Link Functions
  addLink: {
    wasmFunctionName: "_EN_addlink",
    inputArgDefs: [
      { typeHint: "string", isStringPtr: true }, // id
      { typeHint: "enum" }, // linkType (LinkType enum)
      { typeHint: "string", isStringPtr: true }, // fromNode
      { typeHint: "string", isStringPtr: true }, // toNode
    ],
    outputArgDefs: [{ name: "index", type: "int" }],
  },

  deleteLink: {
    wasmFunctionName: "_EN_deletelink",
    inputArgDefs: [
      { typeHint: "number" }, // index
      { typeHint: "enum" }, // actionCode (ActionCodeType enum)
    ],
    outputArgDefs: [],
  },

  getLinkIndex: {
    wasmFunctionName: "_EN_getlinkindex",
    inputArgDefs: [{ typeHint: "string", isStringPtr: true }], // id
    outputArgDefs: [{ name: "index", type: "int" }],
  },

  getLinkId: {
    wasmFunctionName: "_EN_getlinkid",
    inputArgDefs: [{ typeHint: "number" }], // index
    outputArgDefs: [{ name: "id", type: "char" }],
  },

  setLinkId: {
    wasmFunctionName: "_EN_setlinkid",
    inputArgDefs: [
      { typeHint: "number" }, // index
      { typeHint: "string", isStringPtr: true }, // newid
    ],
    outputArgDefs: [],
  },

  getLinkType: {
    wasmFunctionName: "_EN_getlinktype",
    inputArgDefs: [{ typeHint: "number" }], // index
    outputArgDefs: [{ name: "type", type: "int" }],
  },

  setLinkType: {
    wasmFunctionName: "_EN_setlinktype",
    inputArgDefs: [
      { typeHint: "number" }, // index
      { typeHint: "enum" }, // linkType (LinkType enum)
      { typeHint: "enum" }, // actionCode (ActionCodeType enum)
    ],
    outputArgDefs: [{ name: "newIndex", type: "int" }],
  },

  getLinkNodes: {
    wasmFunctionName: "_EN_getlinknodes",
    inputArgDefs: [{ typeHint: "number" }], // index
    outputArgDefs: [
      { name: "node1", type: "int" },
      { name: "node2", type: "int" },
    ],
  },

  setLinkNodes: {
    wasmFunctionName: "_EN_setlinknodes",
    inputArgDefs: [
      { typeHint: "number" }, // index
      { typeHint: "number" }, // node1
      { typeHint: "number" }, // node2
    ],
    outputArgDefs: [],
  },

  getLinkValue: {
    wasmFunctionName: "_EN_getlinkvalue",
    inputArgDefs: [
      { typeHint: "number" }, // index
      { typeHint: "enum" }, // property (LinkProperty enum)
    ],
    outputArgDefs: [{ name: "value", type: "double" }],
  },

  setLinkValue: {
    wasmFunctionName: "_EN_setlinkvalue",
    inputArgDefs: [
      { typeHint: "number" }, // index
      { typeHint: "enum" }, // property (LinkProperty enum)
      { typeHint: "number" }, // value
    ],
    outputArgDefs: [],
  },

  setPipeData: {
    wasmFunctionName: "_EN_setpipedata",
    inputArgDefs: [
      { typeHint: "number" }, // index
      { typeHint: "number" }, // length
      { typeHint: "number" }, // diam
      { typeHint: "number" }, // rough
      { typeHint: "number" }, // mloss
    ],
    outputArgDefs: [],
  },

  getPumpType: {
    wasmFunctionName: "_EN_getpumptype",
    inputArgDefs: [{ typeHint: "number" }], // index
    outputArgDefs: [{ name: "type", type: "int" }],
  },

  getHeadCurveIndex: {
    wasmFunctionName: "_EN_getheadcurveindex",
    inputArgDefs: [{ typeHint: "number" }], // linkIndex
    outputArgDefs: [{ name: "curveIndex", type: "int" }],
  },

  setHeadCurveIndex: {
    wasmFunctionName: "_EN_setheadcurveindex",
    inputArgDefs: [
      { typeHint: "number" }, // linkIndex
      { typeHint: "number" }, // curveIndex
    ],
    outputArgDefs: [],
  },

  getVertexCount: {
    wasmFunctionName: "_EN_getvertexcount",
    inputArgDefs: [{ typeHint: "number" }], // index
    outputArgDefs: [{ name: "count", type: "int" }],
  },

  getVertex: {
    wasmFunctionName: "_EN_getvertex",
    inputArgDefs: [
      { typeHint: "number" }, // index
      { typeHint: "number" }, // vertex
    ],
    outputArgDefs: [
      { name: "x", type: "double" },
      { name: "y", type: "double" },
    ],
  },

  setVertices: {
    wasmFunctionName: "_EN_setvertices",
    inputArgDefs: [
      { typeHint: "number" }, // index
      { typeHint: "double[]" }, // x array
      { typeHint: "double[]" }, // y array
      { typeHint: "length", lengthFor: "x" }, // count (automatically calculated from x array)
    ],
    outputArgDefs: [],
  },

  // ... Define ALL other EPANET functions ...
};
