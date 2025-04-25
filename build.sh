#!/bin/bash

set -e

echo "============================================="
echo "Compiling wasm "
echo "============================================="
(

    mkdir -p build

    emcc -o3 ./src/epanet_version.c -o epanet_version.js \
    -I /opt/epanet/src/include \
    /opt/epanet/build/lib/libepanet2.a \
    -s WASM=1 \
    -s "EXPORTED_FUNCTIONS=['_malloc', '_free', 'allocateUTF8', '_getversion', '_EN_open', '_EN_close', '_EN_createproject', '_EN_deleteproject', '_EN_init', '_EN_getcount', '_EN_addnode']" \
    -s MODULARIZE=1 \
    -s EXPORT_ES6=1 \
    -s FORCE_FILESYSTEM=1 \
    -s EXPORTED_RUNTIME_METHODS='' \
    -s EXPORT_ALL=1 \
    -s ALLOW_MEMORY_GROWTH=1
    #-s SINGLE_FILE=1 \
    #-s "EXPORTED_FUNCTIONS=['_getversion', '_open_epanet', '_EN_close']" \



# We will use this in a switch to allow the slim loader version
# -s SINGLE_FILE=1 embeds the wasm file in the js file

# Export to ES6 module, you also need MODULARIZE for this to work
# By default these are not enabled
#    -s EXPORT_ES6=1 \
#    -s MODULARIZE=1 \

# Compile to a wasm file (though this is set by default)
#    -s WASM=1 \

# FORCE_FILESYSTEM
# Makes full filesystem support be included, even if statically it looks like it is not used.
# For example, if your C code uses no files, but you include some JS that does, you might need this.


#EXPORTED_RUNTIME_METHODS
# Blank for now but previously I used 
# EXPORTED_RUNTIME_METHODS='["ccall", "getValue", "UTF8ToString", "stringToUTF8", "_free", "intArrayToString","FS"]'

# ALLOW_MEMORY_GROWTH
# Allow the memory to grow as needed



## Things to look at later
# WASMFS
# https://emscripten.org/docs/tools_reference/settings_reference.html#wasmfs



    mkdir -p dist
    mv epanet_version.js dist
    mv epanet_version.wasm dist

)
echo "============================================="
echo "Compiling wasm bindings done"
echo "============================================="