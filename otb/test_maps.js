var fs = require( "fs" );
var JSONStream = require( "JSONStream" );
// const fileloader = require('./fileloader');
const maps = require('./maps');

const f = './opentibiasprites/otsp.otbm';
// use option --max-old-space-size=8192
// const f = './forgottenserver/maps.otbm';
// fileloader.readOtb(f);

const mapsDictionary = maps.loadFromOtb(f);

console.log(JSON.stringify(mapsDictionary, null, 4));


// const of = '/forgottenserver/maps.json';

// var transformStream = JSONStream.stringify();
// var outputStream = fs.createWriteStream( __dirname + of );
// transformStream.pipe( outputStream );    
// transformStream.write( mapsDictionary );
// transformStream.end();

// outputStream.on(
//     "finish",
//     function handleFinish() {
//         console.log("Done");
//     }
// );