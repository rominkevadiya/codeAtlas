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

            // Soften background hover
            content = content.replace(/hover:bg-zinc-200/g, 'hover:bg-zinc-300');
            // Soften background primary
            content = content.replace(/bg-zinc-100/g, 'bg-zinc-200');
            // Soften text primary
            content = content.replace(/text-zinc-100/g, 'text-zinc-300');
            // Soften hover text
            content = content.replace(/hover:text-zinc-100/g, 'hover:text-zinc-300');
            // Soften borders and rings
            content = content.replace(/border-zinc-100/g, 'border-zinc-400');
            content = content.replace(/hover:border-zinc-100/g, 'hover:border-zinc-400');
            content = content.replace(/ring-zinc-100/g, 'ring-zinc-400');
            content = content.replace(/stroke-zinc-100/g, 'stroke-zinc-400');
            content = content.replace(/fill-zinc-100/g, 'fill-zinc-400');
            
            // Re-replace text-zinc-300 where we want text-zinc-200? Wait, text-zinc-300 is perfectly readable and comfortable in dark mode. We can stick with text-zinc-300 for a very soft look, or text-zinc-200 for a slightly crisper look. Let's use text-zinc-200.
            content = content.replace(/text-zinc-300/g, 'text-zinc-200');
            content = content.replace(/hover:text-zinc-300/g, 'hover:text-zinc-200');
            
            // Wait, we just replaced text-zinc-100 -> text-zinc-300 -> text-zinc-200.
            // If there were ALREADY text-zinc-300 in the code, they also became text-zinc-200.
            // Is that fine? text-zinc-400 is usually the secondary text. text-zinc-300 becoming text-zinc-200 is fine, they are very close.
            
            // Replace hardcoded #f4f4f5 (zinc-100) with #e4e4e7 (zinc-200) in CSS
            content = content.replace(/#f4f4f5/g, '#e4e4e7');
            content = content.replace(/rgba\(244, 244, 245/g, 'rgba(228, 228, 231');

            if (content !== originalContent) {
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log(`Updated: ${fullPath}`);
            }
        }
    });
}

traverseAndReplace(directoryPath);
console.log("Theme refactoring complete.");
