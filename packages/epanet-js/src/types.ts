// Define memory types more strictly
export type EpanetMemoryType = 'int' | 'long' | 'double' | 'char' | 'char-title';

// Mapping for JS return types
export interface MemoryTypes {
  int: number;
  long: number; // Adjust if BigInt is needed/used for i64
  double: number;
  char: string;
  'char-title': string;
}

// Define the structure for API function metadata
export interface ApiFunctionDefinition {
  /** The name of the function exposed on the _EN (WASM) object */
  wasmFunctionName: keyof EpanetProject; // Use keyof EpanetProject if available

  /** List of types for arguments that EPANET expects pointers for (output values) */
  outputArgTypes: EpanetMemoryType[];

  /** Optional: Minimum EPANET version (integer format, e.g., 20300) required */
  minVersion?: number;

  /** Optional function to process the raw results array */
  postProcess?: (results: any[]) => any;
}

// Define the Emscripten Module type (adjust based on your actual module structure)
export interface EmscriptenModule {
  _malloc: (size: number) => number;
  _free: (ptr: number) => void;
  getValue: (ptr: number, type: 'i8' | 'i16' | 'i32' | 'i64' | 'float' | 'double' | '*') => number; // Add other types if needed
  UTF8ToString: (ptr: number) => string;
  HEAP8: Int8Array; // Or other HEAP views if needed
  Epanet: any; // Constructor or namespace for the EPANET object/class
  // Add other Emscripten functions/properties you use
}

// Define the EPANET project instance type (adjust based on actual WASM exports)
export interface EpanetProject {
  // List function names explicitly if possible for better type checking
  // Example:
  EN_getversion: (versionPtr: number) => number;
  EN_getnodeindex: (id: string, indexPtr: number) => number;
  EN_getnodevalue: (index: number, property: number, valuePtr: number) => number;
  EN_newfunction_v23?: (arg1: number, resultPtr: number) => number; // Example v2.3 function

  // Use an index signature as a fallback if explicit listing is too cumbersome
  [key: string]: Function | any;
}

// Define your Workspace type (replace with your actual implementation details)
export interface Workspace {
  _instance: EmscriptenModule;
  init?: () => Promise<void>; // Example async init
  getError: (errorCode: number) => string;
}

// Define EPANET constants/enums used in function arguments (examples)
export enum NodeType {
  Junction = 0,
  Reservoir = 1,
  Tank = 2
}

export enum NodeProperty {
  Elevation = 0,
  BaseDemand = 1,
  // ... other node properties
}

export enum CountType {
    NodeCount = 0,
    LinkCount = 1,
    // ... other count types
}

// Add other enums like LinkProperty, TimeParameter, QualityType, etc.