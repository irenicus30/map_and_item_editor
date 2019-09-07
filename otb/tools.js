// for (let j = 0; j < process.argv.length; j++) {
//     console.log(j + ' -> ' + (process.argv[j]));
// }
const fs = require('fs');
const js2xmlparser = require("js2xmlparser");

if (process.argv.length<3) {
    console.log('use syntax: node tools.js INPUT_FILE')
    process.exit(1);
}

const name = process.argv[2];

const jsonFileName = name.endsWith('.json') ? name : name + '.json';
const xmlFileName = name.endsWith('.json') ?  name.substr(0, name.length-5) + '.xml' : name + '.xml';

console.log("Input file: ", jsonFileName);
console.log("Output filename: ", xmlFileName);


const rawData = fs.readFileSync(jsonFileName);
const jsonData = JSON.parse(rawData);

const xmlData = js2xmlparser.parse("map", jsonData);

fs.writeFileSync(xmlFileName, xmlData);


console.log("DONE!");