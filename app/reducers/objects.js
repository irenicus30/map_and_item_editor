// @flow
import {
  CHANGE_TILESET,
  CHANGE_OBJECT_TEXT_FIELD,
  CHANGE_OBJECT_START_ID,
  SELECT_OBJECT,
  CHANGE_SPRITE_TEXT_FIELD,
  CHANGE_SPRITE_START_ID,
  SELECT_SPRITE
} from '../actions/objects';
import type { Action } from './types';
import {
  loadObjectsData,
  loadSpritesData
} from '../datamanipulators/loaders';

const defaultPathToData = 'otb/opentibiasprites';
const defaultObjectStartId = 101;
const defaultSelectedObject = 0;
const defaultSpriteStartId = 101;
const defaultSelectedSprite = 0;

let defaultObjectsData = loadObjectsData(defaultPathToData);
let defaultSpritesData = loadSpritesData(defaultPathToData);

export default function objects(
  state = {
    objectStartId: defaultObjectStartId,
    objectSelectedId: defaultSelectedObject,
    spriteStartId: defaultSpriteStartId,
    spriteSelectedId: defaultSelectedSprite,
    objectsData: defaultObjectsData,
    spritesData: defaultSpritesData
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

    case CHANGE_OBJECT_TEXT_FIELD:
      return { ...state, objectTextField: action.objectTextField };

    case CHANGE_OBJECT_START_ID:
      return { ...state, objectStartId: action.objectStartId };

    case SELECT_OBJECT:
      return { ...state, objectSelectedId: action.objectSelectedId };

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
