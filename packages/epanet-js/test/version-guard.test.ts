import { describe, it, expect, vi, beforeAll } from 'vitest';
import Project from '../src/Project/Project';
import { Workspace, EpanetProject, EmscriptenModule } from '../src/types'; // Adjust path/structure as needed
// apiDefinitions might be needed if you reference specific method names that require versions
// import { apiDefinitions } from '../src/apiDefinitions';

// Helper to create a Mock Workspace with a specific EPANET version
const createMockWorkspace = (epanetVersion: number): Workspace => {
    let tempPtr = 1000; // Simulate pointer allocation
    // Hold the reference to getValue to modify it within EN_getversion mock
    let valueGetter = vi.fn((ptr: number, type: string) => 0);

    const mockENInstance: Partial<EpanetProject> = {
        EN_getversion: vi.fn((ptr: number) => {
            // Simulate writing the specific version to the pointer by configuring getValue
            valueGetter.mockImplementation((p, type) => (p === ptr && type === 'i32') ? epanetVersion : 0);
            return 0; // Success
        }),
        // Mock functions required by definitions (baseline + version specific)
        EN_getnodeindex: vi.fn(() => 0), // Baseline example
        EN_getspecialnodeprop_v23: vi.fn((idx, ptr) => { // v2.3 example
             // Simulate writing result to pointer
             valueGetter.mockImplementation((p, type) => (p === ptr && type === 'double') ? 123.45 : 0);
             return 0;
        })
        // Add other necessary mocks based on apiDefinitions used in tests
    };

    const mockInstance: EmscriptenModule = {
        _malloc: vi.fn(size => (size > 0 ? ++tempPtr : 0)), // Simple pointer simulation
        _free: vi.fn(),
        getValue: (ptr, type) => valueGetter(ptr, type), // Use the closured getter
        UTF8ToString: vi.fn(ptr => 'mock string'),
        HEAP8: new Int8Array(),
        // Return the instance when 'new Epanet()' or direct access happens
        Epanet: vi.fn(() => mockENInstance)
    };

    return {
        _instance: mockInstance,
        getError: vi.fn(code => `Mock Error ${code}`),
        init: vi.fn(() => Promise.resolve()),
    };
};

// --- Test Suite ---
describe('EPANET Version Guarding', () => {
    // Use version integers as defined in Project.ts / apiDefinitions
    const baselineVersion = 20200; // e.g., 2.2.0
    const nextVersion = 20300;     // e.g., 2.3.0
    const oldVersion = 20100;      // e.g., 2.1.0
    const absoluteMinVersion = 20200; // Must match _absoluteMinVersion in Project.ts

    it('should initialize successfully with required baseline version', () => {
        const workspace = createMockWorkspace(baselineVersion);
        expect(() => new Project(workspace)).not.toThrow();
    });

     it('should initialize successfully with a newer version', () => {
        const workspace = createMockWorkspace(nextVersion);
        expect(() => new Project(workspace)).not.toThrow();
    });

    it('should throw error if version is below absolute minimum', () => {
        const workspace = createMockWorkspace(oldVersion);
        expect(() => new Project(workspace)).toThrow(/EPANET Version Too Low/);
    });

    it('should allow calling baseline functions with baseline version', () => {
        const workspace = createMockWorkspace(baselineVersion);
        const project = new Project(workspace);
        expect(() => project.getNodeIndex('N1')).not.toThrow();
    });

    it('should allow calling baseline functions with newer version', () => {
        const workspace = createMockWorkspace(nextVersion);
        const project = new Project(workspace);
        expect(() => project.getNodeIndex('N1')).not.toThrow();
    });

    it('should THROW when calling version-specific function with baseline version', () => {
        const workspace = createMockWorkspace(baselineVersion);
        const project = new Project(workspace);
        // Find a method that requires nextVersion (e.g., 2.3.0)
        const v23MethodName = 'getSpecialNodePropertyV23'; // Assumes this requires 20300 in apiDefinitions
        expect(() => (project as any)[v23MethodName](1)).toThrow(
            "Method 'getSpecialNodePropertyV23' requires EPANET v2.3.0 or later, but loaded version is v2.2.0." // Check error message content
        );
    });

     it('should ALLOW calling version-specific function with required version', () => {
        const workspace = createMockWorkspace(nextVersion); // Load 2.3.0
        const project = new Project(workspace);
        const v23MethodName = 'getSpecialNodePropertyV23';
        // Ensure the mock for EN_getspecialnodeprop_v23 is set up correctly
        expect(() => (project as any)[v23MethodName](1)).not.toThrow();
        // Optionally check return value if mock provides one
         expect((project as any)[v23MethodName](1)).toBeCloseTo(123.45);
    });

     it('should throw if underlying WASM function is missing (even if version is high enough)', () => {
        // Create a mock where the version is high, but the function is deliberately missing
        const workspace = createMockWorkspace(nextVersion);
        // Tamper with the mock Epanet instance AFTER creation
        // Access the instance created by the constructor mock
        const enInstance = workspace._instance.Epanet();
        delete (enInstance as any)['EN_getspecialnodeprop_v23']; // Remove the function

        // Create Project *after* tampering with the mock prototype/instance
        const project = new Project(workspace);
        const v23MethodName = 'getSpecialNodePropertyV23';

        expect(() => (project as any)[v23MethodName](1)).toThrow(
             /EPANET function 'EN_getspecialnodeprop_v23'.* not found/ // Check error message
        );
    });
});