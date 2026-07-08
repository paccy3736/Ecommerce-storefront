const fs = require('fs');
const path = require('path');
const p = path.join(__dirname, '..', 'src', 'api', 'client.ts');
let s = fs.readFileSync(p, 'utf8');
const marker = "const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string\n";
if (s.includes("console.log('VITE_API_BASE_URL'")) {
  console.log('already patched');
  process.exit(0);
}
if (s.includes(marker)) {
  const insert = "console.log('VITE_API_BASE_URL=', API_BASE_URL)\n";
  s = s.replace(marker, marker + insert);
  fs.writeFileSync(p, s);
  console.log('patched file:', p);
} else {
  console.error('marker not found in', p);
  process.exit(1);
}
