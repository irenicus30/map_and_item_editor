// @flow
import {
  CHANGE_TILESET,
  CHANGE_OBJECT_TEXT_FIELD,
  CHANGE_OBJECT_START_ID,
  SELECT_OBJECT,
  SELECT_SPRITE_TEXT_FIELD,
  SELECT_SPRITE_START_ID,
  SELECT_SPRITE
} from '../actions/objects';
import type { Action } from './types';

const defaultStartIdProps = 101;
const defaultSelectedId = -1;
const defaultPathToObjects = 'otb/opentibiasprites/sprites';

export default function objects( state: object, action: Action) {
  switch (action.type) {
    case CHANGE_TILESET:
      return { ...state, pathToSprites: action.pathToSprites };
    case CHANGE_OBJECT_TEXT_FIELD:
      return { ...state, textFieldValue: action.textFieldValue };
    case CHANGE_OBJECT_START_ID:
      return { ...state, startIdProps: action.startIdProps };
    case SELECT_OBJECT:
      return { ...state, selectedId: action.selectedId };
    default:
      return state;
  }
}
