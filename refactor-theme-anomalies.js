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

            // Fix anomalies where bg-zinc-200 was left with text-zinc-300
            content = content.replace(/bg-zinc-200 text-zinc-300/g, 'bg-zinc-800 border border-zinc-700 text-zinc-300');
            content = content.replace(/bg-zinc-200 hover:bg-zinc-700 text-zinc-300/g, 'bg-zinc-800 border border-zinc-700 hover:bg-zinc-700 text-zinc-300');
            
            // Fix RepositoryDashboard tab headers
            content = content.replace(/bg-zinc-200 text-zinc-800/g, 'bg-zinc-800 text-zinc-300 border-zinc-700');
            content = content.replace(/bg-zinc-200 border border-zinc-200/g, 'bg-zinc-800 border border-zinc-700');

            if (content !== originalContent) {
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log(`Updated: ${fullPath}`);
            }
        }
    });
}

traverseAndReplace(directoryPath);
console.log("Anomaly fix complete.");
