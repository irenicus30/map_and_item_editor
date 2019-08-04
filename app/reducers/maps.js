// @flow
import {
  MAP_SET_POSITION,
  MAP_MOVE_POSITION,
  MAP_CHANGE_MINIMAP_SCALE,
  MAP_SELECT_TILE
} from '../actions/maps';
import type { Action } from './types';

const rootPath = '.'; // this is folder root/app/reducers
const defaultPosition = { x: 1000, y: 1000, z: 7 };
const defaultMinimapScale = 0.125;

export default function objects(
  state: object = {
    position: defaultPosition,
    minimapScale: defaultMinimapScale
  },
  action: Action
) {
  switch (action.type) {
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

    case MAP_SELECT_TILE:
      return { ...state, selectedTileId: action.selectedTileId };

    default:
      return state;
  }
}
