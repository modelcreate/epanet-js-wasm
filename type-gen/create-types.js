import fs from 'fs';
import path from 'path';

// --- Configuration ---
const HEADER_FILE_PATH = './type-gen/epanet2_2.h'; // Path to your header
const OUTPUT_D_TS_PATH = './type-gen/epanet2_2.d.ts'; // Where to write the .d.ts
const POINTER_TYPE_NAME = 'Pointer'; // TS type alias for C pointers
const KNOWN_POINTER_TYPES = ['char *', 'const char *', 'int *', 'float *', 'double *', 'EN_Project', 'void *']; // Add known pointer types (EN_Project is likely a typedef for a pointer)
const MODULE_INTERFACE_NAME = 'EpanetModule';

// --- Helper Functions ---

function mapCTypeToTsType(cType, isOutParam = false) {
    cType = cType.replace('const ', '').trim(); // Ignore const for TS typing
    if (KNOWN_POINTER_TYPES.includes(cType) || cType.endsWith('*')) {
        return POINTER_TYPE_NAME;
    }
    // Basic types
    switch (cType) {
        case 'int':
        case 'long':
        case 'short':
        case 'float':
        case 'double':
        // Potentially add enum types if you parse them elsewhere
            return 'number';
        case 'void':
            return 'void';
        default:
            console.warn(` - Unhandled C type encountered: ${cType}. Defaulting to 'any'.`);
            return 'any'; // Fallback for unknown types
    }
}

function parseParametersString(paramString) {
    if (!paramString.trim()) {
        return []; // No parameters
    }
    const params = [];
    // Split by comma, but handle potential commas within types later if needed (unlikely for this API)
    const parts = paramString.split(',');
    for (const part of parts) {
        const trimmedPart = part.trim();
        if (!trimmedPart) continue;

        const lastSpaceIndex = trimmedPart.lastIndexOf(' ');
        if (lastSpaceIndex === -1) {
            // Could be a single type like 'void' - handle if necessary
            console.warn(` - Could not parse parameter part: ${trimmedPart}`);
            continue;
        }

        const paramType = trimmedPart.substring(0, lastSpaceIndex).trim();
        const paramName = trimmedPart.substring(lastSpaceIndex + 1).trim().replace('*', ''); // Remove potential * from name

        params.push({
            name: paramName,
            cType: paramType + (trimmedPart.includes('*') ? ' *' : ''), // Re-add * to type if present
        });
    }
    return params;
}


function parseJSDoc(jsdocLines) {
    const data = {
        brief: '',
        params: {}, // Keyed by param name
        returnDesc: '',
    };
    let currentTag = null;
    let currentParamName = null;

    for (const line of jsdocLines) {
        let cleanLine = line.trim();
        // Remove leading *, optional space
        if (cleanLine.startsWith('*')) {
            cleanLine = cleanLine.substring(1).trim();
        }
        if (!cleanLine) continue;

        if (cleanLine.startsWith('@brief')) {
            data.brief = cleanLine.substring(6).trim();
            currentTag = 'brief';
        } else if (cleanLine.startsWith('@param')) {
            currentTag = 'param';
            const parts = cleanLine.substring(6).trim().split(' ');
            const directionMatch = parts[0].match(/\[(in|out|in,out)\]/);
            let isOut = false;
            if (directionMatch) {
                isOut = directionMatch[1].includes('out');
                parts.shift(); // Remove the [out] part
            }
            currentParamName = parts[0];
            const description = parts.slice(1).join(' ');
            if (currentParamName) {
                 data.params[currentParamName] = { description: description, isOut: isOut };
            }
        } else if (cleanLine.startsWith('@return')) {
            data.returnDesc = cleanLine.substring(7).trim();
            currentTag = 'return';
        } else if (currentTag) {
            // Append to the description of the current tag
            if (currentTag === 'brief') data.brief += ' ' + cleanLine;
            else if (currentTag === 'return') data.returnDesc += ' ' + cleanLine;
            else if (currentTag === 'param' && currentParamName && data.params[currentParamName]) {
                data.params[currentParamName].description += ' ' + cleanLine;
            }
        }
    }
     // Clean up extra spaces
    data.brief = data.brief.replace(/\s+/g, ' ').trim();
    data.returnDesc = data.returnDesc.replace(/\s+/g, ' ').trim();
    Object.values(data.params).forEach(p => p.description = p.description.replace(/\s+/g, ' ').trim());

    return data;
}

// --- Main Parsing Logic ---

console.log(`Reading header file: ${HEADER_FILE_PATH}`);
const headerContent = fs.readFileSync(HEADER_FILE_PATH, 'utf8');
const lines = headerContent.split(/\r?\n/); // Split by newline

const functions = [];
const failures = [];
let currentJSDocLines = [];
let inJSDoc = false;

for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Start of JSDoc
    if (line.startsWith('/**')) {
        // Check for previous unterminated JSDoc (shouldn't happen in clean files)
        if (inJSDoc) {
            failures.push(`Line ${i + 1}: New JSDoc started before previous one ended.`);
        }
        inJSDoc = true;
        currentJSDocLines = [line];
        // Handle single-line JSDoc immediately
        if (line.endsWith('*/') && line.length > 4) {
             inJSDoc = false;
        }
        continue; // Move to next line
    }

    // Inside JSDoc
    if (inJSDoc) {
        currentJSDocLines.push(line);
        // End of JSDoc
        if (line.endsWith('*/')) {
            inJSDoc = false;
        }
        continue; // Move to next line
    }

    // Outside JSDoc - looking for function signature after a completed JSDoc
    if (!inJSDoc && currentJSDocLines.length > 0 && line) {
        // We just finished a JSDoc block, and this is the first non-empty line after it.
        // Assume this line STARTS the function signature. It might span multiple lines.
        let signature = line;
        let signatureEndLine = i;
        // Read ahead to find the closing parenthesis and semicolon
        let parenLevel = (line.match(/\(/g) || []).length - (line.match(/\)/g) || []).length;
        let foundSemicolon = line.endsWith(';');

        if (!line.includes('(')) {
             // This line doesn't even start a function call potentially - maybe a struct or enum?
             failures.push(`Line ${i + 1}: Expected function signature after JSDoc, but found: ${line}`);
             currentJSDocLines = []; // Reset JSDoc context
             continue;
        }

        while (!foundSemicolon && signatureEndLine + 1 < lines.length) {
            signatureEndLine++;
            const nextLine = lines[signatureEndLine].trim();
            signature += ' ' + nextLine; // Combine lines
            parenLevel += (nextLine.match(/\(/g) || []).length - (nextLine.match(/\)/g) || []).length;
            if (parenLevel === 0 && nextLine.includes(')')) {
                // If we found the closing paren, look for semicolon soon
            }
             if (nextLine.endsWith(';')) { // Found the end
                foundSemicolon = true;
             }
             // Add safety break for runaway loops?
             if (signatureEndLine > i + 10) { // Arbitrary limit
                 failures.push(`Line ${i+1}-${signatureEndLine+1}: Potential runaway function signature parsing for: ${line}`);
                 foundSemicolon = true; // Force break
             }
        }

        if (!foundSemicolon) {
             failures.push(`Line ${i + 1}: Could not find terminating semicolon for potential function signature starting with: ${line}`);
             currentJSDocLines = []; // Reset JSDoc context
             continue;
        }

        // --- Try to Parse the Signature ---
        signature = signature.replace(/\s+/g, ' ').trim(); // Normalize spaces
        const parenOpenIndex = signature.indexOf('(');
        const parenCloseIndex = signature.lastIndexOf(')');
        const semicolonIndex = signature.lastIndexOf(';');

        if (parenOpenIndex === -1 || parenCloseIndex === -1 || parenCloseIndex < parenOpenIndex || semicolonIndex < parenCloseIndex ) {
            failures.push(`Line ${i + 1}-${signatureEndLine + 1}: Malformed function signature structure: ${signature}`);
        } else {
            const beforeParams = signature.substring(0, parenOpenIndex).trim();
            const paramString = signature.substring(parenOpenIndex + 1, parenCloseIndex).trim();

            const partsBeforeParams = beforeParams.split(' ');
            const functionName = partsBeforeParams.pop().replace('DLLEXPORT', '').trim(); // Handle DLLEXPORT macro simply
            const returnType = partsBeforeParams.join(' ').replace('DLLEXPORT', '').trim(); // Handle DLLEXPORT potentially before type

            if (!functionName || !returnType) {
                 failures.push(`Line ${i + 1}-${signatureEndLine + 1}: Could not extract function name or return type from: ${beforeParams}`);
            } else {
                 try {
                    const parsedParams = parseParametersString(paramString);
                    const jsdocData = parseJSDoc(currentJSDocLines);

                    // Augment params with JSDoc info
                    parsedParams.forEach(p => {
                        if (jsdocData.params[p.name]) {
                            p.description = jsdocData.params[p.name].description;
                            p.isOut = jsdocData.params[p.name].isOut;
                        }
                        p.tsType = mapCTypeToTsType(p.cType, p.isOut);
                    });

                    functions.push({
                        name: functionName,
                        returnCType: returnType,
                        returnTSType: mapCTypeToTsType(returnType),
                        params: parsedParams,
                        briefDescription: jsdocData.brief,
                        returnDescription: jsdocData.returnDesc,
                        rawSignature: signature,
                        jsdocContent: currentJSDocLines.join('\n') // Keep original JSDoc for reference if needed
                    });
                     // Successfully parsed, advance main loop index
                     i = signatureEndLine;

                 } catch (e) {
                     failures.push(`Line ${i + 1}-${signatureEndLine + 1}: Error parsing parameters or JSDoc for ${functionName}: ${e.message}. Signature: ${signature}`);
                 }
            }
        }
        // Reset JSDoc context for the next block
        currentJSDocLines = [];
    } else if (!inJSDoc && line && !line.startsWith('//') && !line.startsWith('#')) {
         // Non-empty, non-comment, non-directive line outside JSDoc and not following one.
         // Could be enum, struct, typedef, #define, etc.
         // Basic reporting for now, could add specific parsers later.
         //failures.push(`Line ${i + 1}: Unhandled line outside JSDoc: ${line}`);
    } else if (!inJSDoc) {
        // Empty line or comment line outside JSDoc, reset context just in case
         currentJSDocLines = [];
    }

}

// --- Generate TypeScript Output ---

console.log("\nGenerating TypeScript definitions...");

const tsFunctionDefs = functions.map(f => {
    const tsParams = f.params.map(p => `${p.name}: ${p.tsType}`).join(', ');
    let tsComment = `    /**\n`;
    if (f.briefDescription) tsComment += `     * ${f.briefDescription}\n`;
    if (f.params.length > 0) tsComment += `     *\n`;
    f.params.forEach(p => {
        const outFlag = p.isOut ? ' [out]' : '';
        tsComment += `     * @param ${p.name}${outFlag} ${p.description || ''}\n`;
    });
     if (f.returnDescription) tsComment += `     * @returns ${f.returnDescription}\n`;
     // Optional: Include original C signature for reference
     // tsComment += `     * C Signature: ${f.rawSignature}\n`;
    tsComment += `     */\n`;

    return `${tsComment}    _${f.name}(${tsParams}): ${f.returnTSType};`; // Add the Emscripten underscore prefix
}).join('\n\n');


// Add Emscripten boilerplate (customize as needed based on your build)
const boilerplateTop = `// Generated from ${path.basename(HEADER_FILE_PATH)} on ${new Date().toISOString()}
// WARNING: This file is auto-generated. Do not edit manually.

type ${POINTER_TYPE_NAME} = number;

// TODO: Define EmscriptenFS interface more completely if needed
interface EmscriptenFS {
    mkdir(path: string): void;
    writeFile(path: string, data: string | Uint8Array, opts?: { encoding?: 'utf8' | 'binary' }): void;
    readFile(path: string, opts?: { encoding: 'utf8' | 'binary' }): string | Uint8Array;
    // Add other FS methods you use
}

export interface ${MODULE_INTERFACE_NAME} {
    // --- Standard Emscripten Runtime ---
    _malloc(size: number): ${POINTER_TYPE_NAME};
    _free(ptr: ${POINTER_TYPE_NAME}): void;
    FS: EmscriptenFS;
    getValue(ptr: ${POINTER_TYPE_NAME}, type: 'i8' | 'i16' | 'i32' | 'i64' | 'float' | 'double' | '*' | string, noSafe?: boolean): number;
    lengthBytesUTF8(str: string): number;
    stringToUTF8(str: string, outPtr: ${POINTER_TYPE_NAME}, maxBytesToWrite: number): void;
    stringToNewUTF8(str: string): ${POINTER_TYPE_NAME};
    // Add any other EXPORTED_RUNTIME_METHODS here

    // --- Exported EPANET Functions ---
`;

const boilerplateBottom = `
}

// Default export factory function matching Emscripten MODULARIZE=1 and EXPORT_ES6=1
export default function EpanetModuleFactory(moduleOverrides?: object): Promise<${MODULE_INTERFACE_NAME}>;
`;

const finalTsContent = boilerplateTop + tsFunctionDefs + boilerplateBottom;

fs.writeFileSync(OUTPUT_D_TS_PATH, finalTsContent);

console.log(`\nSuccessfully generated ${OUTPUT_D_TS_PATH} with ${functions.length} functions.`);

if (failures.length > 0) {
    console.warn(`\nEncountered ${failures.length} parsing issues:`);
    failures.forEach(fail => console.warn(` - ${fail}`));
    console.warn("\nPlease review the header file and the script's parsing logic for these sections.");
} else {
    console.log("No parsing issues detected.")
}