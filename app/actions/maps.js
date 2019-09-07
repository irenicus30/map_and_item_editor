// @flow
import type { GetState, Dispatch } from '../reducers/types';

export const MAP_SET_POSITION = 'MAP_SET_POSITION';
export const MAP_MOVE_POSITION = 'MAP_MOVE_POSITION';
export const MAP_CHANGE_MINIMAP_SCALE = 'MAP_CHANGE_MINIMAP_SCALE';
export const MAP_SELECT_TILE = 'MAP_SELECT_TILE';
export const MAP_UPDATE = 'MAP_UPDATE';
export const MAP_DELETE = 'MAP_DELETE';
export const MAP_CHANGE_PANEL_START_INDEX = 'MAP_CHANGE_PANEL_START_INDEX';

export function setPosition(position: object) {
  return {
    type: MAP_SET_POSITION,
    position: position
  };
}

export function movePosition(delta: object) {
  return {
    type: MAP_MOVE_POSITION,
    delta: delta
  };
}

export function changeMinimapScale(scale: number) {
  return {
    type: MAP_CHANGE_MINIMAP_SCALE,
    minimapScale: scale
  };
}

export function selectTile(data: any) {
  const { objectId } = data;
  if (isNaN(objectId))
    return {
      type: MAP_SELECT_TILE,
      selectedId: 100
    };

  return {
    type: MAP_SELECT_TILE,
    selectedTileId: objectId
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

export function changePanelStartId(textFieldValue: string) {
  let value = parseInt(textFieldValue, 10);
  if (!value) value = 0;
  if (value < 0) value = 0;
  return {
    type: MAP_CHANGE_PANEL_START_INDEX,
    itemStartIndex: value
  };
}