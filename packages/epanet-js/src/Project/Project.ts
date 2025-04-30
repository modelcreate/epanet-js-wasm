import {
    ApiFunctionDefinition,
    EpanetMemoryType,
    MemoryTypes,
    CountType
    // Import other needed types/enums
} from '../types';

import type {EpanetModule} from '@model-create/epanet-engine';

import {  Workspace } from '../';
import { NodeType, NodeProperty } from '../enum';
import { apiDefinitions } from '../apiDefinitions';

class Project /* Consider implementing specific interfaces for clarity */ {
    _ws: Workspace;
    private _projectHandle: number;
    _EN: EpanetModule;
    private _epanetVersionInt: number = -1; // Stores detected version (e.g., 20200)
    private readonly _absoluteMinVersion = 20200; // Absolute minimum supported (e.g., 2.2.0)

    // --- Declare Public API Methods ---
    // List all methods defined in apiDefinitions keys for type safety / intellisense
    // Baseline methods (examples)
    getCount!: (countType: CountType) => number;
    getNodeIndex!: (id: string) => number;
    getNodeValue!: (index: number, property: NodeProperty) => number;
    setNodeValue!: (index: number, property: NodeProperty, value: number) => void;
    // ... other baseline methods ...

    // Version-specific methods (examples) - declare them normally
    getSpecialNodePropertyV23!: (nodeIndex: number) => number;
    // ... other version-specific methods ...


    // Real implementation here:
    addNode!: (id: string, type: NodeType) => number;
    init!: (reportFile: string, binaryFile: string, hydOption: number, qualOption: number) => void;
    setJunctionData!: (nodeIndex: number, demand: number, patternIndex: number, demandCategory: string) => void;
    getNodeType!: (nodeIndex: number) => NodeType;

    constructor(ws: Workspace) {
        this._ws = ws;
        this._EN = ws.instance;
        this._projectHandle = this._createProject();


        // --- EPANET Version Check ---
        // Detect and store the version, throw only if below absolute minimum
        this._epanetVersionInt = this._getAndVerifyEpanetVersion();
        // --- End Version Check ---

        // --- Build the main API methods ---
        // This runs only if the version check passes the absolute minimum
        this._buildApiMethods();
        // --- End API Build ---
    }

    private _createProject(): number {
        const ptrToProjectHandlePtr = this._EN._malloc(4);

        const errorCode = this._EN._EN_createproject(ptrToProjectHandlePtr);
        if (errorCode !== 0) {
            throw new Error(`Failed to create project: ${errorCode}`);
        }
        const projectHandle = this._EN.getValue(ptrToProjectHandlePtr, 'i32');
        this._EN._free(ptrToProjectHandlePtr);

        return projectHandle;

    }

    // --- Version Checking Logic ---
    private _getAndVerifyEpanetVersion(): number {
        const getVersionFunc = this._EN['_EN_getversion'] as Function | undefined;
        if (typeof getVersionFunc !== 'function') {
            throw new Error(
                `Loaded EPANET WASM module missing '_EN_getversion'. Minimum required version is ${this._formatVersionInt(this._absoluteMinVersion)} (likely pre-v2.2).`
            );
        }

        let versionPtr: number = 0;
        let actualVersion: number = -1;

        try {
            versionPtr = this._EN._malloc(4); // sizeof(int)
            if (versionPtr === 0) { throw new Error("Memory allocation failed for version check."); }

            const errorCode = getVersionFunc.apply(this._EN, [versionPtr]);
             if (errorCode !== 0) {
                  // Handle error if EN_getversion itself failed
                  throw new Error(`EN_getversion failed with code ${errorCode}. Cannot verify EPANET version.`);
             }

            actualVersion = this._EN.getValue(versionPtr, 'i32');

        } catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            throw new Error(`Failed to determine EPANET version: ${message}`);
        } finally {
            if (versionPtr !== 0) {
                try { this._EN._free(versionPtr); } catch(e) {/* ignore cleanup error */}
            }
        }

        if (actualVersion < this._absoluteMinVersion) {
             throw new Error(
                 `EPANET Version Too Low: Loaded WASM reports v${this._formatVersionInt(actualVersion)}, library requires at least v${this._formatVersionInt(this._absoluteMinVersion)}.`
             );
        }

        //console.log(`Detected EPANET Version: ${this._formatVersionInt(actualVersion)}`);
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
                // Assign the generated function (which includes version checks)
                (this as any)[methodName] = this._createApiMethod(definition, methodName);
            }
        }
    }

    // --- API Method Factory ---
    private _createApiMethod(definition: ApiFunctionDefinition, methodName: string) {
        const wasmFunction = this._EN[definition.wasmFunctionName] as Function | undefined;

        // Check if the underlying function exists in this specific WASM build
        if (typeof wasmFunction !== 'function') {
            return () => { // Return a function that throws informative error
                throw new Error(`EPANET function '${definition.wasmFunctionName}' (for method '${methodName}') not found in the loaded WASM module. Version might be too old or definition mismatch.`);
            };
        }

        // Return the actual wrapper function
        return (...args: any[]) => {
            // --- Runtime Version Check ---
            if (definition.minVersion && this._epanetVersionInt < definition.minVersion) {
                throw new Error(
                    `Method '${methodName}' requires EPANET v${this._formatVersionInt(definition.minVersion)} or later, but loaded version is v${this._formatVersionInt(this._epanetVersionInt)}.`
                );
            }
            // --- End Runtime Version Check ---

            let outputPointers: number[] = [];
            try {
                // Allocate memory for output pointers
                if (definition.outputArgTypes.length > 0) {
                    outputPointers = this._allocateMemory(definition.outputArgTypes);
                }

                // Call the WASM function
                const errorCode = wasmFunction.apply(this._EN, [this._projectHandle, ...args, ...outputPointers]);

                // Check EPANET error code
                this._checkError(errorCode); // Throws on critical error

                // Retrieve values (if any) - _getValue frees the pointers
                if (outputPointers.length > 0) {
                    const results = outputPointers.map((ptr, index) =>
                        this._getValue(ptr, definition.outputArgTypes[index])
                    );
                    outputPointers = []; // Pointers are invalid now

                    // Post-process results if needed
                    if (definition.postProcess) {
                        return definition.postProcess(results);
                    }
                    // Return single value or array
                    return results.length === 1 ? results[0] : results;
                } else {
                    return undefined; // No output pointers
                }
            } catch (error) {
                 // Cleanup any pointers allocated *before* an error occurred mid-process
                 if (outputPointers.length > 0) {
                     console.warn(`Cleaning up ${outputPointers.length} pointer(s) after error in ${methodName}.`);
                     outputPointers.forEach(ptr => {
                         if (ptr !== 0) { try { this._EN._free(ptr); } catch(e) {/* ignore */} }
                     });
                 }
                 throw error; // Re-throw the original error
            }
        };
    }

    // --- Memory/Error Helpers ---
    private _allocateMemory(types: EpanetMemoryType[]): number[] {
        return types.map(t => {
            let memsize: number;
            switch (t) {
                case 'char': memsize = 32; break; // MAXID
                case 'char-title': memsize = 80; break; // TITLELEN
                case 'int': memsize = 4; break;
                case 'long': memsize = 8; break; // Assume 64-bit
                case 'double': default: memsize = 8; break;
            }
            const pointer = this._EN._malloc(memsize);
            if (pointer === 0) throw new Error(`Failed to allocate ${memsize} bytes for type ${t}`);
            return pointer;
        });
    }

    private _getValue<T extends EpanetMemoryType>(pointer: number, type: T): MemoryTypes[T] {
        let value: any;
         if (pointer === 0) throw new Error(`Attempted to read from null pointer for type ${type}`);

        try {
            if (type === 'char' || type === 'char-title') {
                value = this._EN.UTF8ToString(pointer);
            } else {
                const emsType = type === 'int' ? 'i32' : type === 'long' ? 'i64' : 'double';
                 // Note: Handle potential BigInt for i64 if necessary
                value = this._EN.getValue(pointer, emsType);
            }
        } catch (e) {
            const message = e instanceof Error ? e.message : String(e);
            throw new Error(`Failed to get value for type ${type} from pointer ${pointer}: ${message}`);
        } finally {
            // Free memory *after* reading or attempting to read
            // Add check to prevent freeing 0, though allocateMemory should prevent 0 pointers.
            if(pointer !== 0) {
                 try { this._EN._free(pointer); } catch(e) { console.error(`Error freeing pointer ${pointer}: ${e}`); }
            }
        }
        return value;
    }

    private _checkError(errorCode: number) {
        if (errorCode === 0) return; // Success
        const errorMsg = this._ws.getError(errorCode); // Use workspace helper
        if (errorCode < 100) { // Warning
            console.warn(`epanet-js (Warning ${errorCode}): ${errorMsg}`);
            return;
        }
        // Error
        throw new Error(`EPANET Error ${errorCode}: ${errorMsg}`);
    }

    // Add _allocateMemoryForArray if needed
}

export default Project;