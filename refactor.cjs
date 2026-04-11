const fs = require('fs');
const path = require('path');

function stripComments(str) {
    let out = '';
    let inString = false;
    let stringChar = null;
    let inLineComment = false;
    let inBlockComment = false;
    for (let i = 0; i < str.length; i++) {
        let c = str[i];
        let nextStart = str.substring(i, i + 2);
        if (inLineComment) {
            if (c === '\n') { inLineComment = false; out += c; }
        } else if (inBlockComment) {
            if (nextStart === '*/') { inBlockComment = false; i++; }
        } else if (inString) {
            if (c === '\\') { out += c; i++; if (str[i]) out += str[i]; }
            else if (c === stringChar) { inString = false; out += c; }
            else { out += c; }
        } else {
            if (c === '"' || c === "'" || c === "`") {
                inString = true;
                stringChar = c;
                out += c;
            } else if (nextStart === '//') {
                inLineComment = true;
                i++;
            } else if (nextStart === '/*') {
                inBlockComment = true;
                i++;
            } else {
                out += c;
            }
        }
    }
    return out;
}

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // 1. Strip comments
    content = stripComments(content);
    
    // 2. Convert: export default function X(...) { -> const X = (...) => { ... export default X;
    const funcRegex = /export\s+default\s+function\s+([A-Za-z0-9_]+)\s*\(([^\{]*)\)\s*\{/g;
    let componentsToExport = [];
    
    content = content.replace(funcRegex, (fullMatch, name, args) => {
        componentsToExport.push(name);
        return 'const ' + name + ' = (' + args + ') => {';
    });
    
    if (componentsToExport.length > 0) {
        content = content.trimEnd() + '\n\n';
        for (const name of componentsToExport) {
            content += 'export default ' + name + ';\n';
        }
    }
    
    // Clean up empty lines created by comment stripping
    content = content.replace(/\n\s*\n\s*\n/g, '\n\n');
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log("Processed:", filePath);
}

function traverse(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            traverse(fullPath);
        } else if (fullPath.endsWith('.js') || fullPath.endsWith('.jsx')) {
            try {
                processFile(fullPath);
            } catch (e) {
                console.error('Error on', fullPath, e.message);
            }
        }
    }
}

const targetDir = 'c:\\Users\\91639\\Desktop\\SahiSpot\\fronted\\src';
console.log('Starting refactor in', targetDir);
traverse(targetDir);
console.log('Finished refactor');
