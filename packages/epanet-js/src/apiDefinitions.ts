import { ApiFunctionDefinition, EpanetMemoryType, CountType, NodeProperty } from './types';

// Define the metadata for all EPANET functions to be wrapped.
// Keys are the desired public JavaScript method names.
export const apiDefinitions: Record<string, ApiFunctionDefinition> = {

  // --- Project Functions ---
  // EN_getversion handled directly in constructor, no public wrapper needed by default

  getCount: {
    wasmFunctionName: 'EN_getcount', // int EN_getcount(int countcode, int *count)
    outputArgTypes: ['int']
  },
  getNodeIndex: {
    wasmFunctionName: 'EN_getnodeindex', // int EN_getnodeindex(char *id, int *index)
    outputArgTypes: ['int']
  },
  // ... other baseline functions (e.g., open, close, init, getTitle, saveInpFile) ...

  // --- Network Node Functions ---
  getNodeValue: {
    wasmFunctionName: 'EN_getnodevalue', // int EN_getnodevalue(int index, int propcode, double *value)
    outputArgTypes: ['double']
  },
  setNodeValue: {
      wasmFunctionName: 'EN_setnodevalue', // int EN_setnodevalue(int index, int propcode, double value)
      outputArgTypes: [] // No output pointers
  },
  // ... other baseline node functions ...

  // --- Example Version-Gated Function ---
  /**
   * Hypothetical function added in EPANET 2.3
   * Gets a special node property.
   * @param nodeIndex Index of the node.
   * @returns The special property value.
   * @throws Error if used with EPANET version < 2.3.0
   */
  getSpecialNodePropertyV23: {
    wasmFunctionName: 'EN_getspecialnodeprop_v23', // Replace with actual WASM name
    outputArgTypes: ['double'],
    minVersion: 20300 // Requires EPANET 2.3.0+
  },

  // ... Define ALL other EPANET functions you want to expose here ...
  // Add 'minVersion' property where appropriate
};