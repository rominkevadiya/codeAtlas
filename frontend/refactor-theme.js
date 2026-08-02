import fs from 'fs';
import path from 'path';

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else { 
      if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk('/home/meetpatel/ROMIN/LJ/sem_4_project/codeAtlas/frontend/src');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  // Remove glowing shadows: shadow-[0_0_...rgba(...)]
  content = content.replace(/shadow-\[0_0_[^\]]+rgba[^\]]+\]/g, 'shadow-sm');
  
  // Replace heavy glass borders with clean subtle borders
  content = content.replace(/border-indigo-500\/[0-9]+/g, 'border-white/10');
  content = content.replace(/border-purple-500\/[0-9]+/g, 'border-white/10');
  
  // Remove backdrop-blur if it's overused in panels
  // Actually, we'll keep backdrop-blur-md for real overlays, but maybe just let the CSS handle backgrounds.
  
  // Replace neon background gradients with subtle solid or monochromatic styles
  content = content.replace(/bg-gradient-to-[a-z]+\s+from-indigo-500\s+to-purple-600/g, 'bg-zinc-800');
  content = content.replace(/bg-gradient-to-[a-z]+\s+from-indigo-500\/20\s+to-purple-500\/20/g, 'bg-zinc-800/50');
  
  // Change bright text colors to more professional monotone where applicable?
  // Let's leave text colors alone for now, just removing the "glow" does wonders.
  
  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Updated theme classes in:', file);
  }
});
