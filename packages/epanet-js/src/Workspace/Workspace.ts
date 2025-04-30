import EpanetEngine from '@model-create/epanet-engine';

export class Workspace {
  private engine: typeof EpanetEngine;
  private loadedEngine: Awaited<ReturnType<typeof EpanetEngine>> | undefined;

  constructor() {
    this.engine = EpanetEngine;
  }

  async loadModule(): Promise<void> {
    const engine = await this.engine();
    this.loadedEngine = engine;
  }

  // Add your methods here that will use the engine
} 


export default Workspace;