var fs = require( "fs" );
var JSONStream = require( "JSONStream" );
// const fileloader = require('./fileloader');
const maps = require('./maps');

// const f = './opentibiasprites/otsp.otbm';
// use option --max-old-space-size=8192
const f = './forgottenserver/map.otbm';
// fileloader.readOtb(f);

const mapsDictionary = maps.loadFromOtb(f);

console.log('Done reading otbm');

// console.log(JSON.stringify(mapsDictionary, null, 4));


const of = '/forgottenserver/map.json';

var transformStream = JSONStream.stringify(``, sep=``, close=`\n`); // JSONstream.stringify(open, sep, close)
var outputStream = fs.createWriteStream( __dirname + of );
transformStream.pipe( outputStream );    
transformStream.write( mapsDictionary );
transformStream.end();

outputStream.on(
    "finish",
    function handleFinish() {
        console.log("Done");
    }
);