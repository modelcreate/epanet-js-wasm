import {
  ApiFunctionDefinition,
  EpanetMemoryType,
  MemoryTypes,
  // Import other needed types/enums
} from "../types"; // Adjust path if types are elsewhere

import type { EpanetModule } from "@model-create/epanet-engine";

import { Workspace } from "../";
import {
  NodeType,
  NodeProperty,
  ActionCodeType,
  CountType,
  InitHydOption,
  LinkType,
  LinkProperty,
  PumpType,
  StatusReport,
  AnalysisStatistic,
  ObjectType,
  FlowUnits,
  QualityType,
  Option,
  TimeParameter,
  DemandModel,
  ControlType,
  RuleObject,
  RuleVariable,
  RuleOperator,
  RuleStatus,
  CurveType,
} from "../enum";
import { apiDefinitions } from "../apiDefinitions";

class Project {
  _ws: Workspace;
  _EN: EpanetModule; // Use the combined type EpanetModule
  private _projectHandle!: number; // Assert definite assignment
  private _epanetVersionInt: number = -1;
  private readonly _absoluteMinVersion = 20200;

  // --- Declare Public API Methods with '!' ---
  getComment!: (objectType: ObjectType, index: number) => string;
  setComment!: (objectType: ObjectType, index: number, comment: string) => void;
  openX!: (inputFile: string, reportFile: string, binaryFile: string) => void;
  // ... other version-specific methods ...

  // Node Functions
  addNode!: (id: string, type: NodeType) => number;
  getNodeIndex!: (id: string) => number;
  getNodeValue!: (index: number, property: NodeProperty) => number;
  setNodeValue!: (index: number, property: NodeProperty, value: number) => void;
  setJunctionData!: (
    nodeIndex: number,
    elev: number,
    demand: number,
    patternId: string,
  ) => void;
  getNodeType!: (nodeIndex: number) => NodeType;
  deleteNode!: (index: number, actionCode: ActionCodeType) => void;
  getNodeId!: (index: number) => string;
  setNodeId!: (index: number, newid: string) => void;
  setTankData!: (
    index: number,
    elev: number,
    initlvl: number,
    minlvl: number,
    maxlvl: number,
    diam: number,
    minvol: number,
    volcurve: string,
  ) => void;
  getCoordinates!: (index: number) => { x: number; y: number };
  setCoordinates!: (index: number, x: number, y: number) => void;

  // Hydraulic Analysis Functions
  solveH!: () => void;
  useHydFile!: (filename: string) => void;
  openH!: () => void;
  initH!: (initFlag: InitHydOption) => void;
  runH!: () => number;
  nextH!: () => number;
  saveH!: () => void;
  saveHydFile!: (filename: string) => void;
  closeH!: () => void;

  // Network Link Functions
  addLink!: (
    id: string,
    linkType: LinkType,
    fromNode: string,
    toNode: string,
  ) => number;
  deleteLink!: (index: number, actionCode: ActionCodeType) => void;
  getLinkIndex!: (id: string) => number;
  getLinkId!: (index: number) => string;
  setLinkId!: (index: number, newid: string) => void;
  getLinkType!: (index: number) => LinkType;
  getLinkNodes!: (index: number) => { node1: number; node2: number };
  setLinkNodes!: (index: number, node1: number, node2: number) => void;
  getLinkValue!: (index: number, property: LinkProperty) => number;
  setLinkValue!: (index: number, property: LinkProperty, value: number) => void;
  setPipeData!: (
    index: number,
    length: number,
    diam: number,
    rough: number,
    mloss: number,
  ) => void;
  getPumpType!: (index: number) => PumpType;
  getHeadCurveIndex!: (linkIndex: number) => number;
  setHeadCurveIndex!: (linkIndex: number, curveIndex: number) => void;
  getVertexCount!: (index: number) => number;
  getVertex!: (index: number, vertex: number) => { x: number; y: number };
  setVertices!: (index: number, x: number[], y: number[]) => void;

  // Project Functions
  close!: () => void;
  getCount!: (countType: CountType) => number;
  getTitle!: () => { line1: string; line2: string; line3: string };
  setTitle!: (line1: string, line2: string, line3: string) => void;
  init!: (
    reportFile: string,
    binaryFile: string,
    unitsType: number,
    headlossType: number,
  ) => void;
  open!: (inputFile: string, reportFile: string, binaryFile: string) => void;
  saveInpFile!: (filename: string) => void;
  runProject!: (
    inputFile: string,
    reportFile: string,
    outputFile: string,
  ) => void;

  // Reporting Functions
  writeLine!: (line: string) => void;
  report!: () => void;
  copyReport!: (filename: string) => void;
  clearReport!: () => void;
  resetReport!: () => void;
  setReport!: (format: string) => void;
  setStatusReport!: (level: StatusReport) => void;
  getStatistic!: (type: AnalysisStatistic) => number;
  getResultIndex!: (
    type: ObjectType.Node | ObjectType.Link,
    index: number,
  ) => number;

  // Time Pattern Functions
  addPattern!: (id: string) => void;
  deletePattern!: (index: number) => void;
  getPatternIndex!: (id: string) => number;
  getPatternId!: (index: number) => string;
  setPatternId!: (index: number, id: string) => void;
  getPatternLength!: (index: number) => number;
  getPatternValue!: (index: number, period: number) => number;
  setPatternValue!: (index: number, period: number, value: number) => void;
  getAveragePatternValue!: (index: number) => number;
  setPattern!: (index: number, values: number[]) => void;

  // Water Quality Analysis Functions
  solveQ!: () => void;
  openQ!: () => void;
  initQ!: (initFlag: InitHydOption.Save | InitHydOption.NoSave) => void;
  runQ!: () => number;
  nextQ!: () => number;
  stepQ!: () => number;
  closeQ!: () => void;

  // Analysis Options Functions
  getFlowUnits!: () => FlowUnits;
  getOption!: (option: Option) => number;
  getQualityInfo!: () => {
    qualType: QualityType;
    chemName: string;
    chemUnits: string;
    traceNode: number;
  };
  getQualityType!: () => {
    qualType: QualityType;
    traceNode: number;
  };
  getTimeParameter!: (param: TimeParameter) => number;
  setFlowUnits!: (units: FlowUnits) => void;
  setOption!: (option: Option, value: number) => void;
  setQualityType!: (
    qualType: QualityType,
    chemName: string,
    chemUnits: string,
    traceNode: string,
  ) => void;
  setTimeParameter!: (param: TimeParameter, value: number) => void;

  // Nodal Demand Functions
  addDemand!: (
    nodeIndex: number,
    baseDemand: number,
    demandPattern: string,
    demandName: string,
  ) => void;
  deleteDemand!: (nodeIndex: number, demandIndex: number) => void;
  getBaseDemand!: (nodeIndex: number, demandIndex: number) => number;
  getDemandIndex!: (nodeIndex: number, demandName: string) => number;
  getDemandModel!: () => {
    type: DemandModel;
    pmin: number;
    preq: number;
    pexp: number;
  };
  getDemandName!: (nodeIndex: number, demandIndex: number) => string;
  getDemandPattern!: (nodeIndex: number, demandIndex: number) => number;
  getNumberOfDemands!: (nodeIndex: number) => number;
  setBaseDemand!: (
    nodeIndex: number,
    demandIndex: number,
    baseDemand: number,
  ) => void;
  setDemandModel!: (
    type: DemandModel,
    pmin: number,
    preq: number,
    pexp: number,
  ) => void;
  setDemandName!: (
    nodeIndex: number,
    demandIdx: number,
    demandName: string,
  ) => void;
  setDemandPattern!: (
    nodeIndex: number,
    demandIndex: number,
    patIndex: number,
  ) => void;

  // Simple Control Functions
  addControl!: (
    type: ControlType,
    linkIndex: number,
    setting: number,
    nodeIndex: number,
    level: number,
  ) => number;
  deleteControl!: (index: number) => void;
  getControl!: (index: number) => {
    type: ControlType;
    linkIndex: number;
    setting: number;
    nodeIndex: number;
    level: number;
  };
  setControl!: (
    index: number,
    type: ControlType,
    linkIndex: number,
    setting: number,
    nodeIndex: number,
    level: number,
  ) => void;

  // Rule-Based Control Functions
  addRule!: (rule: string) => void;
  deleteRule!: (index: number) => void;
  getRule!: (index: number) => {
    premiseCount: number;
    thenActionCount: number;
    elseActionCount: number;
    priority: number;
  };
  getRuleId!: (index: number) => string;
  getPremise!: (
    ruleIndex: number,
    premiseIndex: number,
  ) => {
    logop: number;
    object: RuleObject;
    objIndex: number;
    variable: RuleVariable;
    relop: RuleOperator;
    status: RuleStatus;
    value: number;
  };
  setPremise!: (
    ruleIndex: number,
    premiseIndex: number,
    logop: number,
    object: RuleObject,
    objIndex: number,
    variable: RuleVariable,
    relop: RuleOperator,
    status: RuleStatus,
    value: number,
  ) => void;
  setPremiseIndex!: (
    ruleIndex: number,
    premiseIndex: number,
    objIndex: number,
  ) => void;
  setPremiseStatus!: (
    ruleIndex: number,
    premiseIndex: number,
    status: RuleStatus,
  ) => void;
  setPremiseValue!: (
    ruleIndex: number,
    premiseIndex: number,
    value: number,
  ) => void;
  getThenAction!: (
    ruleIndex: number,
    actionIndex: number,
  ) => {
    linkIndex: number;
    status: RuleStatus;
    setting: number;
  };
  setThenAction!: (
    ruleIndex: number,
    actionIndex: number,
    linkIndex: number,
    status: RuleStatus,
    setting: number,
  ) => void;
  getElseAction!: (
    ruleIndex: number,
    actionIndex: number,
  ) => {
    linkIndex: number;
    status: RuleStatus;
    setting: number;
  };
  setElseAction!: (
    ruleIndex: number,
    actionIndex: number,
    linkIndex: number,
    status: RuleStatus,
    setting: number,
  ) => void;
  setRulePriority!: (index: number, priority: number) => void;

  // Data Curve Functions
  addCurve!: (id: string) => void;
  deleteCurve!: (index: number) => void;
  getCurveIndex!: (id: string) => number;
  getCurveId!: (index: number) => string;
  setCurveId!: (index: number, id: string) => void;
  getCurveLenth!: (index: number) => number;
  getCurveType!: (index: number) => CurveType;
  getCurveValue!: (
    curveIndex: number,
    pointIndex: number,
  ) => {
    x: number;
    y: number;
  };
  setCurveValue!: (
    curveIndex: number,
    pointIndex: number,
    x: number,
    y: number,
  ) => void;
  setCurve!: (index: number, xValues: number[], yValues: number[]) => void;

  // Complex Functions
  getCurve(index: number): {
    id: string;
    x: number[];
    y: number[];
  } {
    // Get the number of points in the curve
    const nPoints = this.getCurveLenth(index);

    // Allocate memory for the ID string (EN_MAXID + 1 characters)
    const idPtr = this._EN._malloc(32); // EN_MAXID is typically 32

    // Allocate memory for the x and y arrays
    const xPtr = this._EN._malloc(nPoints * 8); // 8 bytes per double
    const yPtr = this._EN._malloc(nPoints * 8);

    // Allocate memory for nPoints output
    const nPointsPtr = this._EN._malloc(4); // 4 bytes for int

    try {
      // Call the WASM function
      const errorCode = this._EN._EN_getcurve(
        this._projectHandle,
        index,
        idPtr,
        nPointsPtr,
        xPtr,
        yPtr,
      );

      // Check for errors
      this._checkError(errorCode);

      // Read the ID string
      const id = this._EN.UTF8ToString(idPtr);

      // Read the x and y arrays
      const x = new Array(nPoints);
      const y = new Array(nPoints);

      for (let i = 0; i < nPoints; i++) {
        x[i] = this._EN.getValue(xPtr + i * 8, "double");
        y[i] = this._EN.getValue(yPtr + i * 8, "double");
      }

      return {
        id,
        x,
        y,
      };
    } finally {
      // Free allocated memory
      this._EN._free(idPtr);
      this._EN._free(xPtr);
      this._EN._free(yPtr);
      this._EN._free(nPointsPtr);
    }
  }

  setLinkType(
    index: number,
    linkType: LinkType,
    actionCode: ActionCodeType,
  ): number {
    // Allocate memory for the inout_index pointer
    const indexPtr = this._EN._malloc(4); // 4 bytes for int

    try {
      // Initialize the pointer with the input index using HEAP32
      this._EN.HEAP32[indexPtr >> 2] = index;

      // Call the WASM function
      const errorCode = this._EN._EN_setlinktype(
        this._projectHandle,
        indexPtr,
        linkType,
        actionCode,
      );

      // Check for errors
      this._checkError(errorCode);

      // Get the new index value from the pointer
      const newIndex = this._EN.getValue(indexPtr, "i32");

      return newIndex;
    } finally {
      // Free allocated memory
      this._EN._free(indexPtr);
    }
  }

  constructor(ws: Workspace) {
    this._ws = ws;
    // Assign the instance, assuming it includes EPANET functions and Emscripten helpers
    this._EN = ws.instance as EpanetModule;

    // Create the project FIRST, as version check might now need it (or not)
    // But subsequent API calls definitely will. Assert assignment with !
    this._projectHandle = this._createProject();

    this._epanetVersionInt = this._getAndVerifyEpanetVersion();
    this._buildApiMethods();
  }

  private _createProject(): number {
    const funcName = "_EN_createproject"; // Ensure name matches export
    const createProjectFunc = this._EN[funcName] as Function | undefined;
    if (typeof createProjectFunc !== "function") {
      throw new Error(
        `EPANET function '${funcName}' not found in WASM module.`,
      );
    }

    const ptrToProjectHandlePtr = this._EN._malloc(4);
    if (ptrToProjectHandlePtr === 0)
      throw new Error("Memory allocation failed for project creation.");

    let projectHandle = 0;
    try {
      const errorCode = createProjectFunc(ptrToProjectHandlePtr); // Call directly
      if (errorCode !== 0) {
        // Use getError if available, otherwise just code
        const errorMsg = this._ws.getError
          ? this._ws.getError(errorCode)
          : `error code ${errorCode}`;
        throw new Error(`Failed to create EPANET project: ${errorMsg}`);
      }
      projectHandle = this._EN.getValue(ptrToProjectHandlePtr, "i32");
    } finally {
      this._EN._free(ptrToProjectHandlePtr); // Free the pointer *to* the handle pointer
    }

    if (projectHandle === 0) {
      throw new Error(
        "EPANET project creation succeeded but returned a null handle.",
      );
    }
    return projectHandle;
  }

  private _getAndVerifyEpanetVersion(): number {
    // !! IMPORTANT: Assume EN_getversion does NOT take projectHandle !!
    const funcName = "_EN_getversion"; // Ensure name matches export
    const getVersionFunc = this._EN[funcName] as Function | undefined;

    if (typeof getVersionFunc !== "function") {
      throw new Error(
        `WASM module missing '${funcName}'. Min required v${this._formatVersionInt(
          this._absoluteMinVersion,
        )}.`,
      );
    }

    let versionPtr: number = 0;
    let actualVersion: number = -1;

    try {
      versionPtr = this._EN._malloc(4);
      if (versionPtr === 0)
        throw new Error("Memory allocation failed for version check.");

      // Call *without* projectHandle
      const errorCode = getVersionFunc(versionPtr); // No apply needed if 'this' context isn't required
      if (errorCode !== 0)
        throw new Error(`'${funcName}' failed with code ${errorCode}.`);

      actualVersion = this._EN.getValue(versionPtr, "i32");
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      throw new Error(`Failed to determine EPANET version: ${message}`);
    } finally {
      if (versionPtr !== 0) {
        try {
          this._EN._free(versionPtr);
        } catch (e) {
          /* ignore */
        }
      }
    }

    if (actualVersion < this._absoluteMinVersion) {
      throw new Error(
        `EPANET Version Too Low: Loaded v${this._formatVersionInt(
          actualVersion,
        )}, requires v${this._formatVersionInt(this._absoluteMinVersion)}.`,
      );
    }
    return actualVersion;
  }

  private _formatVersionInt(versionInt: number): string {
    if (versionInt < 0) return "Unknown";
    const major = Math.floor(versionInt / 10000);
    const minor = Math.floor((versionInt % 10000) / 100);
    const patch = versionInt % 100;
    return `${major}.${minor}.${patch}`;
  }

  // --- API Builder ---
  private _buildApiMethods() {
    for (const methodName in apiDefinitions) {
      if (Object.prototype.hasOwnProperty.call(apiDefinitions, methodName)) {
        const definition = apiDefinitions[methodName];
        (this as any)[methodName] = this._createApiMethod(
          definition,
          methodName,
        );
      }
    }
  }

  // --- API Method Factory (Handles projectHandle and input strings) ---
  private _createApiMethod(
    definition: ApiFunctionDefinition,
    methodName: string,
  ) {
    const wasmFunctionName = definition.wasmFunctionName;

    return (...userArgs: any[]) => {
      // --- Runtime Version Check ---
      if (
        definition.minVersion &&
        this._epanetVersionInt < definition.minVersion
      ) {
        throw new Error(
          `Method '${methodName}' requires EPANET v${this._formatVersionInt(
            definition.minVersion,
          )}, loaded is v${this._formatVersionInt(this._epanetVersionInt)}.`,
        );
      }
      // --- End Runtime Version Check ---

      const wasmFunction = this._EN[wasmFunctionName] as Function | undefined;

      if (typeof wasmFunction !== "function") {
        throw new Error(
          `EPANET function '${wasmFunctionName}' (for method '${methodName}') not found.`,
        );
      }

      let outputPointers: number[] = [];
      let inputStringPointers: number[] = []; // Track allocated input string pointers
      let arrayPointers: number[] = []; // Track allocated array pointers
      const processedWasmArgs: any[] = [this._projectHandle]; // Start with project handle

      try {
        // Validate input argument count (excluding length parameters)
        const expectedArgs =
          definition.inputArgDefs?.filter((def) => def.typeHint !== "length")
            .length ?? 0;
        if (userArgs.length !== expectedArgs) {
          throw new Error(
            `Method '${methodName}' expected ${expectedArgs} arguments, received ${userArgs.length}.`,
          );
        }

        // Check array lengths if there are multiple arrays
        const arrayArgs = definition.inputArgDefs
          ?.map((def, index) =>
            def.typeHint === "double[]" ? userArgs[index] : null,
          )
          .filter((arg) => arg !== null) as number[][];

        if (arrayArgs.length > 1) {
          const firstLength = arrayArgs[0].length;
          const mismatchedArrays = arrayArgs.filter(
            (arr) => arr.length !== firstLength,
          );
          if (mismatchedArrays.length > 0) {
            throw new Error(
              `All array arguments must have the same length. First array length: ${firstLength}, mismatched arrays: ${mismatchedArrays
                .map((arr) => arr.length)
                .join(", ")}`,
            );
          }
        }

        // Process Input Arguments for WASM call (Handle Strings and Arrays)
        definition.inputArgDefs?.forEach((inputDef, index) => {
          const arg = userArgs[index];
          if (inputDef.isStringPtr && typeof arg === "string") {
            const utf8Length = this._EN.lengthBytesUTF8(arg) + 1; // Null terminator
            const ptr = this._EN._malloc(utf8Length);
            if (ptr === 0)
              throw new Error(
                `Malloc failed for input string arg ${index} in ${methodName}`,
              );
            this._EN.stringToUTF8(arg, ptr, utf8Length);
            inputStringPointers.push(ptr); // Remember to free this
            processedWasmArgs.push(ptr); // Add pointer to WASM args
          } else if (inputDef.typeHint === "double[]") {
            if (!Array.isArray(arg)) {
              throw new Error(`Argument ${index} must be an array`);
            }
            const ptr = this._allocateMemoryForArray(arg);
            arrayPointers.push(ptr);
            processedWasmArgs.push(ptr);
          } else if (inputDef.typeHint === "length") {
            // For length parameters, find the corresponding array and use its length
            const arrayIndex = definition.inputArgDefs.findIndex(
              (def) => def.typeHint === "double[]",
            );
            if (arrayIndex === -1) {
              throw new Error(
                `No array found for length parameter at index ${index}`,
              );
            }
            // Use the user argument index that corresponds to the array definition index
            const arrayArg = userArgs[arrayIndex];
            if (!Array.isArray(arrayArg)) {
              throw new Error(
                `Length parameter at index ${index} requires a corresponding array`,
              );
            }
            processedWasmArgs.push(arrayArg.length);
          } else {
            processedWasmArgs.push(arg); // Add other args directly
          }
        });

        // Allocate memory for output pointers
        if (definition.outputArgDefs.length > 0) {
          outputPointers = this._allocateMemory(
            definition.outputArgDefs.map((def) => def.type),
          );
          processedWasmArgs.push(...outputPointers); // Add output pointers to WASM args
        }

        // Call the WASM function: apply(thisContext, [arg1, arg2, ...])
        const errorCode = wasmFunction.apply(this._EN, processedWasmArgs);

        // Check EPANET error code AFTER the call
        this._checkError(errorCode); // Throws on critical error

        // Retrieve output values (if any) - _getValue frees the output pointers
        let resultsArray: any[] = [];
        if (definition.outputArgDefs.length > 0) {
          resultsArray = outputPointers.map((ptr, index) =>
            this._getValue(ptr, definition.outputArgDefs[index].type),
          );
          outputPointers = []; // Pointers are invalid now
        }

        // Format & Return results
        if (definition.outputArgDefs.length === 0) return undefined;

        // If there's only one output, return it directly
        if (definition.outputArgDefs.length === 1) {
          return resultsArray[0];
        }

        // For multiple outputs, return an object with named properties
        const result: Record<string, any> = {};
        definition.outputArgDefs.forEach((def, index) => {
          result[def.name] = resultsArray[index];
        });
        return result;
      } catch (error) {
        // Cleanup ALL allocated pointers on error
        outputPointers.forEach((ptr) => {
          if (ptr !== 0)
            try {
              this._EN._free(ptr);
            } catch (e) {
              /*ignore*/
            }
        });
        inputStringPointers.forEach((ptr) => {
          if (ptr !== 0)
            try {
              this._EN._free(ptr);
            } catch (e) {
              /*ignore*/
            }
        });
        arrayPointers.forEach((ptr) => {
          if (ptr !== 0)
            try {
              this._EN._free(ptr);
            } catch (e) {
              /*ignore*/
            }
        });
        throw error; // Re-throw
      } finally {
        // Cleanup input string pointers on success (output pointers freed by _getValue)
        inputStringPointers.forEach((ptr) => {
          if (ptr !== 0) {
            this._EN._free(ptr);
          }
        });
        // Cleanup array pointers on success
        arrayPointers.forEach((ptr) => {
          if (ptr !== 0) {
            this._EN._free(ptr);
          }
        });
      }
    };
  }

  // --- Memory/Error Helpers ---
  private _allocateMemory(types: EpanetMemoryType[]): number[] {
    return types.map((t) => {
      let memsize: number;
      switch (t) {
        case "char":
          memsize = 32;
          break; // MAXID
        case "char-title":
          memsize = 80;
          break; // TITLELEN
        case "int":
          memsize = 4;
          break;
        case "double":
        default:
          memsize = 8;
          break;
      }
      const pointer = this._EN._malloc(memsize);
      if (pointer === 0)
        throw new Error(`Failed to allocate ${memsize} bytes for type ${t}`);
      return pointer;
    });
  }

  private _allocateMemoryForArray(arr: number[]): number {
    const typedArray = new Float64Array(arr);
    const nDataBytes = typedArray.length * typedArray.BYTES_PER_ELEMENT;
    const dataPtr = this._EN._malloc(nDataBytes);
    if (dataPtr === 0) {
      throw new Error(
        `Malloc failed allocating ${nDataBytes} bytes for array.`,
      );
    }

    this._EN.HEAPF64.set(typedArray, dataPtr / typedArray.BYTES_PER_ELEMENT);

    return dataPtr;
  }

  private _getValue<T extends EpanetMemoryType>(
    pointer: number,
    type: T,
  ): MemoryTypes[T] {
    let value: any;
    if (pointer === 0)
      throw new Error(`Attempted to read from null pointer for type ${type}`);

    try {
      if (type === "char" || type === "char-title") {
        value = this._EN.UTF8ToString(pointer);
      } else {
        const emsType = type === "int" ? "i32" : "double";
        value = this._EN.getValue(pointer, emsType);
      }
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      throw new Error(
        `Failed to get value for type ${type} from pointer ${pointer}: ${message}`,
      );
    } finally {
      // Free memory *after* reading or attempting to read
      // Add check to prevent freeing 0, though allocateMemory should prevent 0 pointers.
      if (pointer !== 0) {
        try {
          this._EN._free(pointer);
        } catch (e) {
          console.error(`Error freeing pointer ${pointer}: ${e}`);
        }
      }
    }
    return value;
  }

  private _checkError(errorCode: number) {
    if (errorCode === 0) return; // Success
    const errorMsg = this._ws.getError(errorCode); // Use workspace helper
    if (errorCode < 100) {
      // Warning
      console.warn(`epanet-js (Warning ${errorCode}): ${errorMsg}`);
      return;
    }
    // Error
    throw new Error(`EPANET Error ${errorCode}: ${errorMsg}`);
  }

  // Add _allocateMemoryForArray if needed
}

export default Project;
