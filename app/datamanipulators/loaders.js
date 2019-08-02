import fs from 'fs';
import path from 'path';

const datFileName = 'dat.json';
const mapFileName = 'map.json';
const itemsFileName = 'items.json';
const itemsFileNameXML = 'items.xml';
const spritesFolderName = 'sprites';

const rootPath = '../..'; // this is folder root/app/datamanipulators

export function loadObjectsData(rootPath, pathToData) {
    const fullPathToDat = path.join( rootPath, pathToData, datFileName);

    const rawdata = fs.readFileSync (fullPathToDat);
    const dat = JSON.parse(rawdata);
    return dat;
}

export function loadSpritesData(rootPath, pathToData) {
    const fullPathToSprites = path.join( rootPath, pathToData, spritesFolderName);
    const files = fs.readdirSync (fullPathToSprites);

    const sprites = {};

    files.forEach( function(fileName) {
        const fullFileName = path.join( rootPath, pathToData, spritesFolderName, fileName);
        const name = fileName.slice(0, -4);

        const data = fs.readFileSync(fullFileName);
        sprites[name] = data;
    });
    return sprites;
}