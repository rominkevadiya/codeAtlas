const fs = require('fs');
const path = './src/features/landing/LandingPage.tsx';
let content = fs.readFileSync(path, 'utf8');

// Replace solid backgrounds on sections and footer to be transparent or removed
content = content.replace(/className="([^"]*)bg-zinc-950([^"]*)"/g, 'className="$1bg-transparent backdrop-blur-[2px]$2"');
content = content.replace(/className="([^"]*)bg-black([^"]*)"/g, (match, p1, p2) => {
  // We want to keep bg-black on the root div, so check if it's a section or footer
  return match;
});

// Since the regex approach for bg-black might hit things we don't want, let's just do it directly for sections:
content = content.replace(/<section(.*?)bg-zinc-950(.*?)>/g, '<section$1bg-transparent backdrop-blur-[2px]$2>');
content = content.replace(/<section(.*?)bg-black(.*?)>/g, '<section$1bg-transparent backdrop-blur-[2px]$2>');
content = content.replace(/<footer(.*?)bg-black(.*?)>/g, '<footer$1bg-transparent backdrop-blur-[2px]$2>');

fs.writeFileSync(path, content, 'utf8');
console.log('Fixed backgrounds in LandingPage.tsx');
