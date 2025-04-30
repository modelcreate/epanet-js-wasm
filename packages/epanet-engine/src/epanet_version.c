#include "emscripten.h"
#include "epanet2_2.h"

EMSCRIPTEN_KEEPALIVE
int getversion()
{
    int i;
    EN_getversion(&i);
    return i;
}

// This adds 200KB to the wasm file size, it must be adding everything

EMSCRIPTEN_KEEPALIVE
int open_epanet(EN_Project ph, const char *inpFile, const char *rptFile, const char *outFile)
{

    return EN_open(ph, inpFile, rptFile, outFile);
}