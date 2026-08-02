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

            // Target the specific combinations causing high contrast
            
            // 1. bg-zinc-200 text-black hover:bg-zinc-300
            content = content.replace(/bg-zinc-200 text-black(.*?)hover:bg-zinc-300/g, 'bg-zinc-800 text-zinc-300 border border-zinc-700$1hover:bg-zinc-700 hover:text-zinc-200');
            content = content.replace(/bg-zinc-200 px-4(.*?)text-black transition hover:bg-zinc-300/g, 'bg-zinc-800 border border-zinc-700 px-4$1text-zinc-300 transition hover:bg-zinc-700 hover:text-zinc-200');
            content = content.replace(/bg-zinc-200 px-6(.*?)text-black transition hover:bg-zinc-300/g, 'bg-zinc-800 border border-zinc-700 px-6$1text-zinc-300 transition hover:bg-zinc-700 hover:text-zinc-200');
            
            // 2. Any remaining bg-zinc-200 text-black
            content = content.replace(/bg-zinc-200 text-black/g, 'bg-zinc-800 text-zinc-300 border border-zinc-700');
            
            // 3. Isolated hover:bg-zinc-300 that might be left over from the first script
            content = content.replace(/hover:bg-zinc-300/g, 'hover:bg-zinc-700');
            
            // 4. Any other text-black that's out of place (like icons)
            content = content.replace(/text-black/g, 'text-zinc-300');

            if (content !== originalContent) {
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log(`Updated: ${fullPath}`);
            }
        }
    });
}

traverseAndReplace(directoryPath);
console.log("Theme refactoring complete.");
