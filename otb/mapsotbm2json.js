const fs = require('fs');
const maps = require('./maps');

if (process.argv.length<4) {
    console.log('use syntax: node mapsotbm2json.js INPUT_FILE OUTPUT_FILE')
    process.exit(1);
}
console.log('reading file ', process.argv[2]);

const mapsDictionary = maps.loadFromOtbm(process.argv[2]);

console.log('writing file ', process.argv[3]);

fs.writeFileSync(process.argv[3], JSON.stringify(mapsDictionary, null, 4));