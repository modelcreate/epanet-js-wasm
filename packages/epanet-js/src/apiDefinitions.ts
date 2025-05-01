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
      { typeHint: "length" }, // count (automatically calculated from x array)
    ],
    outputArgDefs: [],
  },

  // Project Functions
  getTitle: {
    wasmFunctionName: "_EN_gettitle",
    inputArgDefs: [],
    outputArgDefs: [
      { name: "line1", type: "char-title" },
      { name: "line2", type: "char-title" },
      { name: "line3", type: "char-title" },
    ],
  },

  setTitle: {
    wasmFunctionName: "_EN_settitle",
    inputArgDefs: [
      { typeHint: "string", isStringPtr: true }, // line1
      { typeHint: "string", isStringPtr: true }, // line2
      { typeHint: "string", isStringPtr: true }, // line3
    ],
    outputArgDefs: [],
  },

  saveInpFile: {
    wasmFunctionName: "_EN_saveinpfile",
    inputArgDefs: [{ typeHint: "string", isStringPtr: true }], // filename
    outputArgDefs: [],
  },

  runProject: {
    wasmFunctionName: "_EN_runproject",
    inputArgDefs: [
      { typeHint: "string", isStringPtr: true }, // inputFile
      { typeHint: "string", isStringPtr: true }, // reportFile
      { typeHint: "string", isStringPtr: true }, // outputFile
    ],
    outputArgDefs: [],
  },

  // Reporting Functions
  writeLine: {
    wasmFunctionName: "_EN_writeline",
    inputArgDefs: [{ typeHint: "string", isStringPtr: true }], // line
    outputArgDefs: [],
  },

  report: {
    wasmFunctionName: "_EN_report",
    inputArgDefs: [],
    outputArgDefs: [],
  },

  copyReport: {
    wasmFunctionName: "_EN_copyreport",
    inputArgDefs: [{ typeHint: "string", isStringPtr: true }], // filename
    outputArgDefs: [],
  },

  clearReport: {
    wasmFunctionName: "_EN_clearreport",
    inputArgDefs: [],
    outputArgDefs: [],
  },

  resetReport: {
    wasmFunctionName: "_EN_resetreport",
    inputArgDefs: [],
    outputArgDefs: [],
  },

  setReport: {
    wasmFunctionName: "_EN_setreport",
    inputArgDefs: [{ typeHint: "string", isStringPtr: true }], // format
    outputArgDefs: [],
  },

  setStatusReport: {
    wasmFunctionName: "_EN_setstatusreport",
    inputArgDefs: [{ typeHint: "enum" }], // level (StatusReport enum)
    outputArgDefs: [],
  },

  getStatistic: {
    wasmFunctionName: "_EN_getstatistic",
    inputArgDefs: [{ typeHint: "enum" }], // type (AnalysisStatistic enum)
    outputArgDefs: [{ name: "value", type: "double" }],
  },

  getResultIndex: {
    wasmFunctionName: "_EN_getresultindex",
    inputArgDefs: [
      { typeHint: "enum" }, // type (ObjectType enum)
      { typeHint: "number" }, // index
    ],
    outputArgDefs: [{ name: "resultIndex", type: "int" }],
  },

  // Time Pattern Functions
  addPattern: {
    wasmFunctionName: "_EN_addpattern",
    inputArgDefs: [{ typeHint: "string", isStringPtr: true }], // id
    outputArgDefs: [],
  },

  deletePattern: {
    wasmFunctionName: "_EN_deletepattern",
    inputArgDefs: [{ typeHint: "number" }], // index
    outputArgDefs: [],
  },

  getPatternIndex: {
    wasmFunctionName: "_EN_getpatternindex",
    inputArgDefs: [{ typeHint: "string", isStringPtr: true }], // id
    outputArgDefs: [{ name: "index", type: "int" }],
  },

  getPatternId: {
    wasmFunctionName: "_EN_getpatternid",
    inputArgDefs: [{ typeHint: "number" }], // index
    outputArgDefs: [{ name: "id", type: "char" }],
  },

  setPatternId: {
    wasmFunctionName: "_EN_setpatternid",
    inputArgDefs: [
      { typeHint: "number" }, // index
      { typeHint: "string", isStringPtr: true }, // id
    ],
    outputArgDefs: [],
  },

  getPatternLength: {
    wasmFunctionName: "_EN_getpatternlen",
    inputArgDefs: [{ typeHint: "number" }], // index
    outputArgDefs: [{ name: "length", type: "int" }],
  },

  getPatternValue: {
    wasmFunctionName: "_EN_getpatternvalue",
    inputArgDefs: [
      { typeHint: "number" }, // index
      { typeHint: "number" }, // period
    ],
    outputArgDefs: [{ name: "value", type: "double" }],
  },

  setPatternValue: {
    wasmFunctionName: "_EN_setpatternvalue",
    inputArgDefs: [
      { typeHint: "number" }, // index
      { typeHint: "number" }, // period
      { typeHint: "number" }, // value
    ],
    outputArgDefs: [],
  },

  getAveragePatternValue: {
    wasmFunctionName: "_EN_getaveragepatternvalue",
    inputArgDefs: [{ typeHint: "number" }], // index
    outputArgDefs: [{ name: "value", type: "double" }],
  },

  setPattern: {
    wasmFunctionName: "_EN_setpattern",
    inputArgDefs: [
      { typeHint: "number" }, // index
      { typeHint: "double[]" }, // values array
      { typeHint: "length" }, // count (automatically calculated from values array)
    ],
    outputArgDefs: [],
  },

  // Water Quality Analysis Functions
  solveQ: {
    wasmFunctionName: "_EN_solveQ",
    inputArgDefs: [],
    outputArgDefs: [],
  },

  openQ: {
    wasmFunctionName: "_EN_openQ",
    inputArgDefs: [],
    outputArgDefs: [],
  },

  initQ: {
    wasmFunctionName: "_EN_initQ",
    inputArgDefs: [{ typeHint: "enum" }], // initFlag (InitHydOption enum)
    outputArgDefs: [],
  },

  runQ: {
    wasmFunctionName: "_EN_runQ",
    inputArgDefs: [],
    outputArgDefs: [{ name: "currentTime", type: "int" }],
  },

  nextQ: {
    wasmFunctionName: "_EN_nextQ",
    inputArgDefs: [],
    outputArgDefs: [{ name: "tStep", type: "int" }],
  },

  stepQ: {
    wasmFunctionName: "_EN_stepQ",
    inputArgDefs: [],
    outputArgDefs: [{ name: "tStep", type: "int" }],
  },

  closeQ: {
    wasmFunctionName: "_EN_closeQ",
    inputArgDefs: [],
    outputArgDefs: [],
  },

  // Analysis Options Functions
  getFlowUnits: {
    wasmFunctionName: "_EN_getflowunits",
    inputArgDefs: [],
    outputArgDefs: [{ name: "units", type: "int" }],
  },

  getOption: {
    wasmFunctionName: "_EN_getoption",
    inputArgDefs: [{ typeHint: "enum" }], // option (Option enum)
    outputArgDefs: [{ name: "value", type: "double" }],
  },

  getQualityInfo: {
    wasmFunctionName: "_EN_getqualinfo",
    inputArgDefs: [],
    outputArgDefs: [
      { name: "qualType", type: "int" },
      { name: "chemName", type: "char" },
      { name: "chemUnits", type: "char" },
      { name: "traceNode", type: "int" },
    ],
  },

  getQualityType: {
    wasmFunctionName: "_EN_getqualtype",
    inputArgDefs: [],
    outputArgDefs: [
      { name: "qualType", type: "int" },
      { name: "traceNode", type: "int" },
    ],
  },

  getTimeParameter: {
    wasmFunctionName: "_EN_gettimeparam",
    inputArgDefs: [{ typeHint: "enum" }], // param (TimeParameter enum)
    outputArgDefs: [{ name: "value", type: "long" }],
  },

  setFlowUnits: {
    wasmFunctionName: "_EN_setflowunits",
    inputArgDefs: [{ typeHint: "enum" }], // units (FlowUnits enum)
    outputArgDefs: [],
  },

  setOption: {
    wasmFunctionName: "_EN_setoption",
    inputArgDefs: [
      { typeHint: "enum" }, // option (Option enum)
      { typeHint: "number" }, // value
    ],
    outputArgDefs: [],
  },

  setQualityType: {
    wasmFunctionName: "_EN_setqualtype",
    inputArgDefs: [
      { typeHint: "enum" }, // qualType (QualityType enum)
      { typeHint: "string", isStringPtr: true }, // chemName
      { typeHint: "string", isStringPtr: true }, // chemUnits
      { typeHint: "string", isStringPtr: true }, // traceNode
    ],
    outputArgDefs: [],
  },

  setTimeParameter: {
    wasmFunctionName: "_EN_settimeparam",
    inputArgDefs: [
      { typeHint: "enum" }, // param (TimeParameter enum)
      { typeHint: "number" }, // value
    ],
    outputArgDefs: [],
  },

  // ... Define ALL other EPANET functions ...
};
