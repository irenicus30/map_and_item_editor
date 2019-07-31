// @flow
import type { GetState, Dispatch } from '../reducers/types';

export const CHANGE_TEXT_FIELD = 'CHANGE_TEXT_FIELD';
export const CHANGE_ID = 'CHANGE_ID';
export const CHANGE_TILESET = 'CHANGE_TILESET';
export const SELECT_IMAGE = 'SELECT_IMAGE';
export const MAP_UPDATE = 'MAP_UPDATE';
export const MAP_DELETE = 'MAP_DELETE';

export function changeTextField(event: object) {
  let value = '101';
  if(event.target && event.target.value)
    value = event.target.value;
  return {
    type: CHANGE_TEXT_FIELD,
    textFieldValue: value
  };
}

export function changeStartId(textFieldValue: string) {
  let value = parseInt(textFieldValue);
  if (!value) value = 101;
  if (value < 101) value = 101;
  return {
    type: CHANGE_ID,
    startIdProps: value
  };
}

export function changeTileset(pathToSprites: string) {
  return {
    type: CHANGE_TILESET,
    pathToSprites
  };
}

export function imageSelect(selectedId: any) {
  const integerSelectedId = parseInt(selectedId);
  if (isNaN(integerSelectedId))
    return {
      type: SELECT_IMAGE,
      selectedId: -1
    };

  return {
    type: SELECT_IMAGE,
    selectedId: integerSelectedId
  };
}

export function mapUpdate(toUpdate: object) {
  return {
    type: MAP_UPDATE
  }
}

export function mapDelete(toDelete: object) {
  return {
    type: MAP_DELETE
  }
}