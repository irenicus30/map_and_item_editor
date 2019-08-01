// @flow
import type { GetState, Dispatch } from '../reducers/types';

export const CHANGE_TILESET = 'CHANGE_TILESET';
export const CHANGE_OBJECT_TEXT_FIELD = 'CHANGE_OBJECT_TEXT_FIELD';
export const CHANGE_OBJECT_START_ID = 'CHANGE_OBJECT_START_ID';
export const SELECT_OBJECT = 'SELECT_OBJECT';
export const CHANGE_SPRITE_TEXT_FIELD = 'SELECT_SPRITE_TEXT_FIELD';
export const CHANGE_SPRITE_START_ID = 'SELECT_SPRITE_START_ID';
export const SELECT_SPRITE = 'SELECT_SPRITE';

export function changeTileset(pathToSprites: string) {
  return {
    type: CHANGE_TILESET,
    pathToSprites
  };
}

export function changeObjectTextField(event: object) {
  let value = '101';
  if (event.target && event.target.value)
    value = event.target.value;
  return {
    type: CHANGE_OBJECT_TEXT_FIELD,
    objectTextField: value
  };
}

export function changeObjectStartId(textFieldValue: string) {
  let value = parseInt(textFieldValue, 10);
  if (!value) value = 101;
  if (value < 101) value = 101;
  return {
    type: CHANGE_OBJECT_START_ID,
    objectStartId: value
  };
}

export function selectObject(selectedId: any) {
  const integerSelectedId = parseInt(selectedId, 10);
  if (isNaN(integerSelectedId))
    return {
      type: SELECT_OBJECT,
      selectedId: 0
    };

  return {
    type: SELECT_OBJECT,
    objectSelectedId: integerSelectedId
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

export function selectSprite(selectedId: any) {
  const integerSelectedId = parseInt(selectedId, 10);
  if (isNaN(integerSelectedId))
    return {
      type: SELECT_SPRITE,
      selectedId: 0
    };

  return {
    type: SELECT_SPRITE,
    spriteSelectedId: integerSelectedId
  };
}
