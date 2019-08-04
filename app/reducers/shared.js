// @flow
import {
  CHANGE_TILESET
} from '../actions/shared';
import type { Action } from './types';
import {
  loadObjectsData,
  loadSpritesData,
  loadMapData,
  loadItemsData,
  getItemsIdMap
} from '../datamanipulators/loaders';

const rootPath = '.'; // this is folder root/app/reducers

const defaultPathToData = 'otb/opentibiasprites';
let defaultObjectsData = loadObjectsData(rootPath, defaultPathToData);
let defaultSpritesData = loadSpritesData(rootPath, defaultPathToData);
let defaultMapData = loadMapData(rootPath, defaultPathToData);
let defaultItemsData = loadItemsData(rootPath, defaultPathToData);
let defaultItemsIdMap = getItemsIdMap(defaultItemsData);

export default function objects(
  state: object = {
    objectsData: defaultObjectsData,
    spritesData: defaultSpritesData,
    mapData: defaultMapData,
    itemsData: defaultItemsData,
    pathToData: defaultPathToData,
    itemsIdMap: defaultItemsIdMap
  },
  action: Action
) {
  switch (action.type) {
    case CHANGE_TILESET: {
      defaultObjectsData = action.objectsData;
      defaultSpritesData = action.spritesData;
      defaultMapData = action.mapData;
      defaultItemsData = action.itemsData;
      defaultItemsIdMap = action.itemsIdMap;
      return {
        ...state,
        objectsData: action.objectsData,
        spritesData: action.spritesData,        
        mapData: action.mapData,
        itemsData: action.itemsData,
        pathToData: action.pathToData,
        itemsIdMap: action.itemsIdMap
      };
    }

    default:
      return state;
  }
}
