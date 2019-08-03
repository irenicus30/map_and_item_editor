// @flow
import type { GetState, Dispatch } from '../reducers/types';
import {
  loadObjectsData,
  loadSpritesData,
  loadMapData
} from '../datamanipulators/loaders';

export const CHANGE_TILESET = 'CHANGE_TILESET';
export const MAP_CHANGE_POSITION = 'MAP_CHANGE_POSITION';
export const MAP_UPDATE = 'MAP_UPDATE';
export const MAP_DELETE = 'MAP_DELETE';

const rootPath = '.'; // this is folder root/app/actions

export function changeTileset(pathToSprites: string) {  
  const objectsData = loadObjectsData(rootPath, pathToSprites);
  const spritesData = loadSpritesData(rootPath, pathToSprites);
  const mapData = loadMapData(rootPath, pathToSprites);
  return {
    type: CHANGE_TILESET,
    objectsData,
    spritesData,
    mapData
  };
}

export function changePosition(position: object) {
  return {
    type: MAP_CHANGE_POSITION,
    position: position
  };
}

export function mapUpdate(toUpdate: object) {
  return {
    type: MAP_UPDATE
  }
}

export function mapDelete(toDelete: object) {
  return {
    type: MAP_DELETE
  }
}