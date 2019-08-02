const fs = require('fs');
const path = require('path');
const PNG = require('pngjs').PNG;

const thisScriptRootPath = '..'; // this is folder root/app/datamanipulators
const datFileName = 'dat.json';
const mapFileName = 'map.json';
const itemsFileName = 'items.json';
const itemsFileNameXML = 'items.xml';
const spritesFolderName = 'sprites';


function loadObjectsData(rootPath, pathToData) {
    const fullPathToDat = path.join( rootPath, pathToData, datFileName);

    const rawdata = fs.readFileSync (fullPathToDat);
    const dat = JSON.parse(rawdata);
    return dat;
}
function loadSpritesData(rootPath, pathToData) {
    const fullPathToSprites = path.join( rootPath, pathToData, spritesFolderName);
    const files = fs.readdirSync (fullPathToSprites);

    const sprites = {};

    files.forEach( function(fileName) {
        console.log(fileName);
        const fullFileName = path.join( rootPath, pathToData, spritesFolderName, fileName);
        console.log(fullFileName);
        const name = fileName.slice(0, -4);
        console.log(name);

        const rawdata = fs.readFileSync(fullFileName);
        const png = PNG.sync.read(rawdata);

        sprites[name] = png;
    });
    return sprites;
}

let pathToData = 'otb/opentibiasprites';

let s = loadSpritesData(thisScriptRootPath, pathToData);

console.log(s)

var appDir = path.dirname(require.main.filename);
console.log(appDir)

module.exports = { loadSpritesData };