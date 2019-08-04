// @flow
import {
  CHANGE_TILESET,
  MAP_SET_POSITION,
  MAP_MOVE_POSITION,
  MAP_CHANGE_MINIMAP_SCALE
} from '../actions/maps';
import type { Action } from './types';
import { loadObjectsData, loadSpritesData, loadMapData } from '../datamanipulators/loaders';

const rootPath = '.'; // this is folder root/app/reducers
const defaultPosition = { x: 1000, y: 1000, z: 7};
const defaultMinimapScale = 0.1;

const defaultPathToData = 'otb/opentibiasprites';
let defaultObjectsData = loadObjectsData(rootPath, defaultPathToData);
let defaultSpritesData = loadSpritesData(rootPath, defaultPathToData);
let defaultMapData = loadMapData(rootPath, defaultPathToData);

export default function objects(
  state: object = {
    position: defaultPosition,
    objectsData: defaultObjectsData,
    spritesData: defaultSpritesData,
    mapData: defaultMapData,
    minimapScale: defaultMinimapScale
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

    case MAP_SET_POSITION:
      return { ...state, position: action.position };

    case MAP_MOVE_POSITION:
      let position = state.position;
      let delta = action.delta;
      if (delta.x) {
        position.x += delta.x;
      }
      if (delta.y) {
        position.y += delta.y;
      }
      if (delta.z) {
        position.z += delta.z;
      }
      return { ...state, position: position };

    case MAP_CHANGE_MINIMAP_SCALE:
      return { ...state, minimapScale: action.minimapScale };

    default:
      return state;
  }
}
