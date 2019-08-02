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
import { loadObjectsData, loadSpritesData } from '../datamanipulators/loaders';

const defaultPathToData = 'otb/opentibiasprites';
const defaultObjectStartId = 100;
const defaultSelectedObject = 100;
const defaultSpriteStartId = 1;
const defaultSelectedSprite = 1;
const defaultObjectSelectedSpriteIndex = 0;

const rootPath = '.'; // this is folder root/app/reducers
let defaultObjectsData = loadObjectsData(rootPath, defaultPathToData);
let defaultSpritesData = loadSpritesData(rootPath, defaultPathToData);

export default function objects(
  state = {
    objectStartId: defaultObjectStartId,
    objectSelectedId: defaultSelectedObject,
    objectSelectedSpriteIndex: defaultObjectSelectedSpriteIndex,
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
