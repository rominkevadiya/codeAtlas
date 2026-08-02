const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'frontend/src');

function traverseAndReplace(dir) {
    fs.readdirSync(dir).forEach(file => {
        const fullPath = path.join(dir, file);
        if (fs.lstatSync(fullPath).isDirectory()) {
            traverseAndReplace(fullPath);
        } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts') || fullPath.endsWith('.css')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let originalContent = content;

            // Replace exact solid colors first
            // Matches class names like text-white, bg-white, etc. with or without pseudo-classes
            // Handles cases with or without opacity modifiers
            content = content.replace(/(text|bg|border|ring|stroke|fill)-white/g, '$1-zinc-100');
            
            if (content !== originalContent) {
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log(`Updated: ${fullPath}`);
            }
        }
    });
}

traverseAndReplace(directoryPath);
console.log("Theme refactoring complete.");
