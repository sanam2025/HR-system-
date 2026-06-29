const fs = require('fs'); 
const lines = fs.readFileSync('C:/Users/DELL/.gemini/antigravity-ide/brain/810eccb3-c47f-4c52-8544-f65fd23ef037/.system_generated/logs/transcript.jsonl', 'utf8').split('\n'); 
let content = ''; 
for (const line of lines) { 
  if (line.includes('"step_index":177') && line.includes('VIEW_FILE')) { 
    const json = JSON.parse(line); 
    const contentLines = json.content.split('\n'); 
    let start = false; 
    for (let l of contentLines) { 
      if (l.startsWith('1: ')) { start = true; } 
      if (l.startsWith('The above content shows')) { break; } 
      if (start) { content += l.replace(/^\d+:\s/, '') + '\n'; } 
    } 
    break; 
  } 
} 
fs.writeFileSync('C:/Users/DELL/Desktop/Front/Front/HR-system-/src/core/pages/manager/Dashboard.tsx', content.trim() + '\n', 'utf8'); 
console.log('Restored FULL Dashboard.tsx');
