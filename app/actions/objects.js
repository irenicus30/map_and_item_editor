// @flow
import type { GetState, Dispatch } from '../reducers/types';
import {
  loadObjectsData,
  loadSpritesData
} from '../datamanipulators/loaders';

export const CHANGE_TILESET = 'CHANGE_TILESET';
export const CHANGE_OBJECT_TEXT_FIELD = 'CHANGE_OBJECT_TEXT_FIELD';
export const CHANGE_OBJECT_START_ID = 'CHANGE_OBJECT_START_ID';
export const SELECT_OBJECT = 'SELECT_OBJECT';
export const CHANGE_SPRITE_TEXT_FIELD = 'SELECT_SPRITE_TEXT_FIELD';
export const CHANGE_SPRITE_START_ID = 'SELECT_SPRITE_START_ID';
export const SELECT_SPRITE = 'SELECT_SPRITE';

const rootPath = '.'; // this is folder root/app/actions

export function changeTileset(pathToSprites: string) {  
  const objectsData = loadObjectsData(rootPath, pathToSprites);
  const spritesData = loadSpritesData(rootPath, pathToSprites);
  return {
    type: CHANGE_TILESET,
    objectsData,
    spritesData
  };
}

export function changeObjectTextField(event: object) {
  let value = '100';
  if (event.target && event.target.value)
    value = event.target.value;
  return {
    type: CHANGE_OBJECT_TEXT_FIELD,
    objectTextField: value
  };
}

export function changeObjectStartId(textFieldValue: string) {
  let value = parseInt(textFieldValue, 10);
  if (!value) value = 100;
  if (value < 100) value = 100;
  return {
    type: CHANGE_OBJECT_START_ID,
    objectStartId: value
  };
}

export function selectObject(data: any) {
  const { objectId } = data;
  if (isNaN(objectId))
    return {
      type: SELECT_OBJECT,
      selectedId: 100
    };

  return {
    type: SELECT_OBJECT,
    objectSelectedId: objectId
  };
}

export function changeSpriteTextField(event: object) {
  let value = '1';
  if (event.target && event.target.value)
    value = event.target.value;
  return {
    type: CHANGE_SPRITE_TEXT_FIELD,
    spriteTextField: value
  };
}

export function changeSpriteStartId(textFieldValue: string) {
  let value = parseInt(textFieldValue, 10);
  if (!value) value = 1;
  if (value < 1) value = 1;
  return {
    type: CHANGE_SPRITE_START_ID,
    spriteStartId: value
  };
}

export function selectSprite(id: any) {
  if (isNaN(id))
    return {
      type: SELECT_SPRITE,
      selectedId: 1
    };

  return {
    type: SELECT_SPRITE,
    spriteSelectedId: id
  };
}
