const fs = require('fs');
const fileloader = require('./fileloader');
const items = require('./items');

if (process.argv.length<4) {
    console.log('use syntax: node itemsotb2json.js INPUT_FILE OUTPUT_FILE')
    process.exit(1);
}
console.log('reading file ', process.argv[2]);

const itemsDictionary = items.loadFromOtb(process.argv[2]);

console.log('writing file ', process.argv[3]);

fs.writeFileSync(process.argv[3], JSON.stringify(itemsDictionary, null, 4));