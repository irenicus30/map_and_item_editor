import fs from 'fs';
import path from 'path';
import { PNG  from 'pngjs';

const rootPath = '../..'; // this is folder root/app/datamanipulators
const datFileName = 'dat.json';
const mapFileName = 'map.json';
const itemsFileName = 'items.json';
const itemsFileNameXML = 'items.xml';
const spritesFolderName = 'sprites';


export function loadObjectsData(pathToData) {
    const fullPathToDat = path.join( rootPath, pathToData, datFileName);

    const rawdata = fs.readFileSync (fullPathToDat);
    const dat = JSON.parse(rawdata);
    return dat;
}

export function loadSpritesData(pathToData) {
    const fullPathToSprites = path.join( rootPath, pathToData, spritesFolderName);
    const files = fs.readdirSync (fullPathToSprites);

    const sprites = files.map( function(fileName) {
        const rawdata = fs.readFileSync(fileName);
        const png = PNG.sync.read(rawdata);

    });
    return sprites;
}