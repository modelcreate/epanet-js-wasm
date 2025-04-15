# Build epanet as a wasm package

**Build docker image**

```
pnpm run build:dockerimage
```

## Proposed new API

```diff
import { Project, Workspace } from "epanet-js";

- const ws = new Workspace();
+ const ws = await Workspace.loadModule();
const model = new Project(ws);
```

### Default path, wasm as inline base64 (33% package size increase)

```javascript
import { Project, Workspace } from "epanet-js";

// Initialise a new Workspace and Project object
const ws = await Workspace.loadModule();
const model = new Project(ws);

// Write a copy of the inp file to the virtual workspace
ws.writeFile("net1.inp", net1);

// Runs toolkit methods: EN_open, EN_solveH & EN_close
model.open("net1.inp", "report.rpt", "out.bin");
model.solveH();
model.close();
```

### Slim loader with WASM

```javascript
import { Project, Workspace } from "epanet-js/slim";
import wasm from "epanet-js/wasm";

// Initialise a new Workspace and Project object
const ws = await Workspace.loadModule({ wasm });
const model = new Project(ws);

// Write a copy of the inp file to the virtual workspace
ws.writeFile("net1.inp", net1);

// Runs toolkit methods: EN_open, EN_solveH & EN_close
model.open("net1.inp", "report.rpt", "out.bin");
model.solveH();
model.close();
```

### Slim loader with WASM, fall back to fetch from CDN

```javascript
import { Project, Workspace } from "epanet-js/slim";
import wasm from "epanet-js/wasm";

// Initialise a new Workspace and Project object
const ws = await Workspace.loadModule();
const model = new Project(ws);

// Write a copy of the inp file to the virtual workspace
ws.writeFile("net1.inp", net1);

// Runs toolkit methods: EN_open, EN_solveH & EN_close
model.open("net1.inp", "report.rpt", "out.bin");
model.solveH();
model.close();
```
