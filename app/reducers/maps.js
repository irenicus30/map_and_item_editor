// @flow
import { CHANGE_TEXT_FIELD, CHANGE_ID, CHANGE_TILESET, SELECT_IMAGE, MAP_UPDATE, MAP_DELETE } from '../actions/maps';
import type { Action } from './types';

const defaultMapData = require('../../otb/opentibiasprites/sprites/map.json');

const defaultStartIdProps = 101;
const defaultPathToSprites = 'otb/opentibiasprites/sprites';
const defaultSelectedId = 101;

export default function objects(
  state: object = {
    startIdProps: defaultStartIdProps,
    pathToSprites: defaultPathToSprites,
    selectedId: defaultSelectedId,
    mapData: defaultMapData
  },
  action: Action
) {
  switch (action.type) {
    case CHANGE_TEXT_FIELD:
      return { ...state, textFieldValue: action.textFieldValue };
    case CHANGE_ID:
      return { ...state, startIdProps: action.startIdProps };
    case CHANGE_TILESET:
      return { ...state, pathToSprites: action.pathToSprites };
    case SELECT_IMAGE:
      return { ...state, selectedId: action.selectedId };
    default:
      return state;
  }
}
