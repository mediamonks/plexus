const fs = require('node:fs');
const path = require('node:path');

const inputFile = process.argv[2];
if (!inputFile) {
    console.error('Usage: node json2jsonl.js <file.json>');
    process.exit(1);
}

if (!inputFile.endsWith('.json')) {
    console.error('Input file must be a .json file');
    process.exit(1);
}

const data = require(path.join(process.cwd(), inputFile));
let output = '';
for (const item of data) {
    output += JSON.stringify(item) + '\n';
}
fs.writeFileSync(path.join(process.cwd(), inputFile.replace(/json$/, 'jsonl')), output);
