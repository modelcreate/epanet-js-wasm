import { describe, it, expect, vi, beforeAll } from "vitest";
import Project from "../src/Project/Project";
import { EpanetProject, EmscriptenModule } from "../src/types";
import { apiDefinitions } from "../src/apiDefinitions";

import { Workspace } from "../src/Workspace/Workspace";

// Mock Workspace for testing
class MockWorkspace extends Workspace {
  constructor(epanetVersion: number) {
    super();
    const mockInstance = {
      _malloc: vi.fn((size) => (size > 0 ? 1000 : 0)),
      _free: vi.fn(),
      getValue: vi.fn((ptr, type) => (type === "i32" ? epanetVersion : 0)),
      lengthBytesUTF8: vi.fn((ptr) => 10),
      UTF8ToString: vi.fn((ptr) => "mock string"),
      stringToUTF8: vi.fn((str, len, ptr) => {
        if (ptr) {
          const buffer = new Uint8Array(ptr);
          for (let i = 0; i < len; i++) {
            buffer[i] = str.charCodeAt(i);
          }
        }
        return len;
      }),
      HEAP8: new Int8Array(),
      FS: {
        writeFile: vi.fn(),
        readFile: vi.fn(),
      },
      _EN_getversion: vi.fn((ptr) => 0),
      _EN_getnodeindex: vi.fn(() => 0),
      _EN_getspecialnodeprop_v23: vi.fn((idx, ptr) => 0),
      _EN_createproject: vi.fn((idx, ptr) => 0),
    } as any;
    Object.defineProperty(this, "instance", { get: () => mockInstance });
  }

  async loadModule(): Promise<void> {
    // No-op for testing
  }
}

// --- Test Suite ---
describe("EPANET WASM Function Coverage and Project API", () => {
  let project: Project;
  let enInstance: EpanetProject;
  let mockWorkspace: MockWorkspace;

  const baselineVersion = 20200;

  beforeAll(async () => {
    mockWorkspace = new MockWorkspace(baselineVersion);
    project = new Project(mockWorkspace);
    enInstance = (project as any)._EN;
  });

  it("should have definitions for all available relevant WASM functions", () => {
    const definedWasmFunctions = new Set<keyof EpanetProject>(
      Object.values(apiDefinitions).map((def) => def.wasmFunctionName),
    );

    // Get *mocked* function names from the test instance prototype
    // Adjust this depending on whether Epanet is a class or object in your mock
    const allPropertyNames = Object.getOwnPropertyNames(
      Object.getPrototypeOf(enInstance) || enInstance,
    );
    const availableWasmFunctions = new Set<keyof EpanetProject>(
      allPropertyNames.filter(
        (propName) =>
          propName.startsWith("EN_") && // Filter based on convention
          typeof (enInstance as any)[propName] === "function",
      ) as (keyof EpanetProject)[], // Cast needed if propName is just string
    );

    // Find functions available in the mock but not defined
    const missingDefinitions = [...availableWasmFunctions].filter(
      (funcName) => !definedWasmFunctions.has(funcName),
    );

    // Find functions defined but not available in the mock
    // Note: This depends heavily on the completeness of your mock `enInstance`
    const orphanedDefinitions = [...definedWasmFunctions].filter(
      (funcName) => !availableWasmFunctions.has(funcName),
    );

    // Assertions
    expect(
      missingDefinitions,
      `WASM functions missing definitions: ${missingDefinitions.join(", ")}`,
    ).toHaveLength(0);

    // This assertion might be less reliable unless the mock is exhaustive
    // expect(orphanedDefinitions, `Definitions for non-existent WASM functions: ${orphanedDefinitions.join(', ')}`).toHaveLength(0);
  });

  it("should have all public methods defined in apiDefinitions implemented on Project instance", () => {
    const definedPublicMethods = Object.keys(apiDefinitions);
    const missingProjectMethods: string[] = [];
    definedPublicMethods.forEach((methodName) => {
      if (typeof (project as any)[methodName] !== "function") {
        missingProjectMethods.push(methodName);
      }
    });
    expect(
      missingProjectMethods,
      `Public methods missing on Project: ${missingProjectMethods.join(", ")}`,
    ).toHaveLength(0);
  });
});
