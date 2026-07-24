const fs = require('fs');
const path = require('path');
const hrDir = path.join('c:\\Ahmad\\sana\\HR-system-\\src\\core\\modules\\HR');
const i18nFile = fs.readFileSync('c:\\Ahmad\\sana\\HR-system-\\src\\i18n\\index.ts', 'utf8');

function getFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(getFiles(file));
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      results.push(file);
    }
  });
  return results;
}

const files = getFiles(hrDir);
const keys = new Set();
const regex = /t\(['"]([a-zA-Z0-9_\.]+)['"]\)/g;

files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  let match;
  while ((match = regex.exec(content)) !== null) {
    keys.add(match[1]);
  }
});

const missing = [];
keys.forEach(k => {
  if (!i18nFile.includes(k + ':') && !i18nFile.includes(k + ' :')) {
    missing.push(k);
  }
});
console.log(missing.join(', '));
