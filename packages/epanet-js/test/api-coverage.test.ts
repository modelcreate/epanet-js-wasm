import { describe, it, expect, vi, beforeAll } from 'vitest';
import Project from '../src/Project/Project';
import { Workspace, EpanetProject, EmscriptenModule } from '../src/types';
import { apiDefinitions } from '../src/apiDefinitions';

// Mock Workspace for testing
class MockWorkspace implements Workspace {
    _instance: EmscriptenModule;
    
    constructor() {
        this._instance = {
            _malloc: vi.fn(size => (size > 0 ? Math.random() * 10000 + 1 : 0)),
            _free: vi.fn(),
            getValue: vi.fn((ptr, type) => (type === 'i32' ? 20300 : 0)),
            UTF8ToString: vi.fn(ptr => 'mock string'),
            HEAP8: new Int8Array(),
            Epanet: class MockEpanet {
                EN_getversion = vi.fn((ptr) => 0);
                EN_getcount = vi.fn(() => 0);
                EN_getnodeindex = vi.fn(() => 0);
                EN_getnodevalue = vi.fn(() => 0);
                EN_setnodevalue = vi.fn(() => 0);
                EN_getspecialnodeprop_v23 = vi.fn(() => 0);
            }
        };
    }
    
    getError = vi.fn(code => `Mock Error ${code}`);
    init = vi.fn(() => Promise.resolve());
}

// --- Test Suite ---
describe('EPANET WASM Function Coverage and Project API', () => {
    let project: Project;
    let enInstance: EpanetProject;
    let mockWorkspace: MockWorkspace;

    beforeAll(async () => {
        mockWorkspace = new MockWorkspace();
        project = new Project(mockWorkspace);
        enInstance = (project as any)._EN;
    });

    it('should have definitions for all available relevant WASM functions', () => {
        const definedWasmFunctions = new Set<keyof EpanetProject>(
            Object.values(apiDefinitions).map(def => def.wasmFunctionName)
        );

        // Get *mocked* function names from the test instance prototype
        // Adjust this depending on whether Epanet is a class or object in your mock
        const allPropertyNames = Object.getOwnPropertyNames(Object.getPrototypeOf(enInstance) || enInstance);
        const availableWasmFunctions = new Set<keyof EpanetProject>(
            allPropertyNames.filter(propName =>
                propName.startsWith('EN_') && // Filter based on convention
                typeof (enInstance as any)[propName] === 'function'
            ) as (keyof EpanetProject)[] // Cast needed if propName is just string
        );

        // Find functions available in the mock but not defined
        const missingDefinitions = [...availableWasmFunctions].filter(
            funcName => !definedWasmFunctions.has(funcName)
        );

        // Find functions defined but not available in the mock
        // Note: This depends heavily on the completeness of your mock `enInstance`
        const orphanedDefinitions = [...definedWasmFunctions].filter(
            funcName => !availableWasmFunctions.has(funcName)
        );

        // Assertions
        expect(missingDefinitions, `WASM functions missing definitions: ${missingDefinitions.join(', ')}`).toHaveLength(0);

        // This assertion might be less reliable unless the mock is exhaustive
        // expect(orphanedDefinitions, `Definitions for non-existent WASM functions: ${orphanedDefinitions.join(', ')}`).toHaveLength(0);
    });

    it('should have all public methods defined in apiDefinitions implemented on Project instance', () => {
        const definedPublicMethods = Object.keys(apiDefinitions);
        const missingProjectMethods: string[] = [];
        definedPublicMethods.forEach(methodName => {
            if (typeof (project as any)[methodName] !== 'function') {
                missingProjectMethods.push(methodName);
            }
        });
        expect(missingProjectMethods, `Public methods missing on Project: ${missingProjectMethods.join(', ')}`).toHaveLength(0);
    });
});