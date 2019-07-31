var fs = require( "fs" );
var JSONStream = require( "JSONStream" );
// const fileloader = require('./fileloader');
const map = require('./map');

// const f = './opentibiasprites/otsp.otbm';
// use option --max-old-space-size=8192
const f = './forgottenserver/map.otbm';
// fileloader.readOtb(f);

const mapDictionary = map.loadFromOtb(f);

// console.log(JSON.stringify(mapDictionary, null, 4));


const of = '/forgottenserver/sprites/map.json';

var transformStream = JSONStream.stringify();
var outputStream = fs.createWriteStream( __dirname + of );
transformStream.pipe( outputStream );    
transformStream.write( mapDictionary );
transformStream.end();

outputStream.on(
    "finish",
    function handleFinish() {
        console.log("Done");
    }
);