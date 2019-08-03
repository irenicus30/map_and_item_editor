// @flow
import { CHANGE_TILESET, MAP_CHANGE_POSITION } from '../actions/maps';
import type { Action } from './types';
import { loadObjectsData, loadSpritesData, loadMapData } from '../datamanipulators/loaders';

const defaultPathToData = 'otb/opentibiasprites';
const rootPath = '.'; // this is folder root/app/reducers
let defaultObjectsData = loadObjectsData(rootPath, defaultPathToData);
let defaultSpritesData = loadSpritesData(rootPath, defaultPathToData);
let defaultMapData = loadMapData(rootPath, defaultPathToData);
const defaultPosition = { x: 1, y: 1, z: 7};


export default function objects(
  state: object = {
    position: defaultPosition,
    objectsData: defaultObjectsData,
    spritesData: defaultSpritesData,
    mapData: defaultMapData
  },
  action: Action
) {
  switch (action.type) {
    case CHANGE_TILESET: {
      defaultObjectsData = action.objectsData;
      defaultSpritesData = action.spritesData;
      return {
        ...state,
        objectsData: action.objectsData,
        spritesData: action.spritesData
      };
    }

    case MAP_CHANGE_POSITION:
      return { ...state, position: action.position };
    default:
      return state;
  }
}
