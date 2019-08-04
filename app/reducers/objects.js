// @flow
import {
  CHANGE_OBJECT_TEXT_FIELD,
  CHANGE_OBJECT_START_ID,
  SELECT_OBJECT,
  CHANGE_SPRITE_TEXT_FIELD,
  CHANGE_SPRITE_START_ID,
  SELECT_SPRITE
} from '../actions/objects';
import type { Action } from './types';

const defaultPathToData = 'otb/opentibiasprites';
const defaultObjectStartId = 100;
const defaultSelectedObject = 100;
const defaultSpriteStartId = 1;
const defaultSelectedSprite = 1;
const defaultObjectSelectedSpriteIndex = 0;

export default function objects(
  state = {
    objectStartId: defaultObjectStartId,
    objectSelectedId: defaultSelectedObject,
    objectSelectedSpriteIndex: defaultObjectSelectedSpriteIndex,
    spriteStartId: defaultSpriteStartId,
    spriteSelectedId: defaultSelectedSprite
  },
  action: Action
) {
  switch (action.type) {
    case CHANGE_OBJECT_TEXT_FIELD:
      return { ...state, objectTextField: action.objectTextField };

    case CHANGE_OBJECT_START_ID:
      return { ...state, objectStartId: action.objectStartId };

    case SELECT_OBJECT: {
      let { objectSelectedSpriteIndex } = state;
      if (state.objectSelectedId === action.objectSelectedId) {
        objectSelectedSpriteIndex += 1;
      } else {
        objectSelectedSpriteIndex = 0;
      }
      return {
        ...state,
        objectSelectedId: action.objectSelectedId,
        objectSelectedSpriteIndex
      };
    }

    case CHANGE_SPRITE_TEXT_FIELD:
      return { ...state, spriteTextField: action.spriteTextField };

    case CHANGE_SPRITE_START_ID:
      return { ...state, spriteStartId: action.spriteStartId };

    case SELECT_SPRITE:
      return { ...state, spriteSelectedId: action.spriteSelectedId };

    default:
      return state;
  }
}
