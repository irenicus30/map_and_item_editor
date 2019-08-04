// @flow
import type { GetState, Dispatch } from '../reducers/types';
import {
  loadObjectsData,
  loadSpritesData,
  loadMapData,
  loadItemsData,
  getItemsIdMap
} from '../datamanipulators/loaders';

export const CHANGE_TILESET = 'CHANGE_TILESET';

const rootPath = '.'; // this is folder root/app/actions

export function changeTileset(pathToData: string) {  
  const objectsData = loadObjectsData(rootPath, pathToData);
  const spritesData = loadSpritesData(rootPath, pathToData);
  const mapData = loadMapData(rootPath, pathToData);
  const itemsData = loadItemsData(rootPath, pathToData);
  const itemsIdMap = getItemsIdMap(itemsData);

  return {
    type: CHANGE_TILESET,
    objectsData,
    spritesData,
    mapData,
    itemsData,
    pathToData,
    itemsIdMap
  };
}

