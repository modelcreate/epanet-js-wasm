# BREAKING CHANGES
  writeFile(path: string, data: string | Uint8Array) {
    this.FS.writeFile(path, data);
  }

  writeFile now takes Uint8Array instead of ArrayBufferView which was the wrong too broad type



# Wed Apr 30

Switch to pnpm monorepo and added vitest


 Foreign Function Interface (FFI) challenge
https://gemini.google.com/u/1/app/cd03f13785ec7b98

# Mon Apr 28

Remove allocateUTF8 as its depreicated 

stackAlloc, stackSave, and stackRestore



## CWRAP
Promising and makes things simplier but it reduces the amount of calls from 32M to 7M, not worth it for now

```
const getNodeIndex = engine.cwrap('EN_getnodeindex', 'number', ['number','string','number'])

const test = getNodeIndex(projectHandle, "J1", valuePtr);
const value = engine.getValue(valuePtr, 'i32');
console.log(`return: ${test} test value: ${value}`);
engine._free(valuePtr);
```


## Sun Apr 27


Would anything be different if I compile straight from epanet instead of linking?

Use --closure 1 to minimize


Some other flags that can help with performance but not enabled yet:
    -s ASSERTIONS=0 \
    -s SAFE_HEAP=0 \
    -s INITIAL_MEMORY=1024MB \
    --closure 1
    #-s ALLOW_MEMORY_GROWTH=1 \
    # -msimd128 \
    -flto 



Doubles iterations from 17  million calls per second to 32
-s ASSERTIONS=0
    

## Fri Apr 25

- Basic version of accessing EPANET with wasm and direct memory management