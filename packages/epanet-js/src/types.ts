import type { EpanetModule } from "@model-create/epanet-engine";

// Define memory types more strictly
export type EpanetMemoryType = "int" | "double" | "char" | "char-title";

// Mapping for JS return types
export interface MemoryTypes {
  int: number;
  long: number; // Adjust if BigInt is needed/used for i64
  double: number;
  char: string;
  "char-title": string;
}

// Define input argument description
export interface InputArgDef {
  // Type hint for potential validation or complex marshalling (optional)
  typeHint?:
    | "string"
    | "number"
    | "enum"
    | "boolean"
    | "double[]"
    | "length"
    | string;
  /** Set to true if this JS string argument needs conversion to a char* pointer */
  isStringPtr?: boolean;
  /** For length parameters, specifies which array parameter this length corresponds to */
  lengthFor?: string;
}

// Define output argument description
export interface OutputArgDef {
  /** The name of the output property in the returned object */
  name: string;
  /** The type of the output value */
  type: EpanetMemoryType;
}

// Define the structure for API function metadata
export interface ApiFunctionDefinition {
  /** The exact name exported by WASM (e.g., '_EN_getnodeindex') */
  wasmFunctionName: keyof EpanetModule; // Allow string for flexibility

  /** Describes the INPUT arguments the JS function receives (excluding project handle) */
  inputArgDefs: InputArgDef[];

  /** List of output arguments with names and types */
  outputArgDefs: OutputArgDef[];

  /** Optional: Minimum EPANET version required */
  minVersion?: number;

  /** Optional: Custom formatting for return values */
  postProcess?: (results: any[]) => any;

  arrayInputs?: {
    [key: string]: {
      type: "double";
      lengthParam: string;
    };
  };
}

// Define the Emscripten Module type (adjust based on your actual module structure)
export interface EmscriptenModule {
  _malloc: (size: number) => number;
  _free: (ptr: number) => void;
  getValue: (
    ptr: number,
    type: "i8" | "i16" | "i32" | "i64" | "float" | "double" | "*",
  ) => number; // Add other types if needed
  UTF8ToString: (ptr: number) => string;
  HEAP8: Int8Array; // Changed from Int8Array to Uint8Array
  HEAP32: Int32Array; // Changed from Int32Array to Uint32Array
  Epanet: any; // Constructor or namespace for the EPANET object/class
  [key: string]: any; // Add index signature for string keys
}

// Define the EPANET project instance type (adjust based on actual WASM exports)
export interface EpanetProject {
  _EN_createproject: (ptrToProjectHandlePtr: number) => number;
  _EN_getversion: (versionPtr: number) => number; // Note: No project handle
  _EN_init: (
    proj: number,
    rptFilePtr: number,
    binFilePtr: number,
    unitsType: number,
    headlossType: number,
  ) => number;
  _EN_addnode: (
    proj: number,
    idPtr: number,
    nodeType: number,
    indexPtr: number,
  ) => number;
  _EN_getnodeindex: (proj: number, idPtr: number, indexPtr: number) => number;
  _EN_getnodevalue: (
    proj: number,
    index: number,
    property: number,
    valuePtr: number,
  ) => number;
  // ... other function signatures ...

  // Emscripten helpers likely still needed on the main module object
  _malloc: (size: number) => number;
  _free: (ptr: number) => void;
  getValue: (
    ptr: number,
    type: "i8" | "i16" | "i32" | "i64" | "float" | "double" | "*",
  ) => number;
  UTF8ToString: (ptr: number) => string;
  lengthBytesUTF8: (str: string) => number;
  stringToUTF8: (str: string, outPtr: number, maxBytesToWrite: number) => void;
  // ... other helpers ...

  [key: string]: Function | any; // Index signature fallback
}
// Define your Workspace type (replace with your actual implementation details)
export interface Workspace {
  _instance: EmscriptenModule;
  init?: () => Promise<void>; // Example async init
  getError: (errorCode: number) => string;
}
