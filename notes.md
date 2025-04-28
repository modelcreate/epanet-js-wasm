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

    

## Fri Apr 25

- Basic version of accessing EPANET with wasm and direct memory management