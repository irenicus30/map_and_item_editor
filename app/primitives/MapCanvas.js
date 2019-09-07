// @flow
import React, { useEffect, useRef }  from 'react';

const spritesPerAtlas = 256;
const spritesPerAtlasX = 16;
// const spritesPerAtlasY = 16;
const singleSpritePixels = 32;

type Props = {
    scale: number,
    position: object,
    objectsData: object,
    spritesData: object,
    mapData: object,
    itemsData: object,
    itemsIdMap: object,
    windowSquaresInX: number,
    windowSquaresInY: number,
    selectTile: (key: any) => void,
};

function* generateTilesForGivenRange(range, mapData) {
  function isInRange(posAndId) {
    return (
      range.xmin <= posAndId.x &&
      posAndId.x <= range.xmax &&
      range.ymin <= posAndId.y &&
      posAndId.y <= range.ymax &&
      range.z === posAndId.z
    );
  }

  const nodes = mapData.data.nodes;
  for (let node of nodes) {
    if (node.type != 'OTBM_MAP_DATA') {
      continue;
    }
    const features = node.features;
    for (let feature of features) {
      if (feature.type != 'OTBM_TILE_AREA') {
        continue;
      }
      const tiles = feature.tiles;
      for (let tile of tiles) {
        if (tile.type != 'OTBM_TILE' && tile.type != 'OTBM_HOUSETILE') {
          continue;
        }
        const posAndId = {
          x: feature.x + tile.x,
          y: feature.y + tile.y,
          z: feature.z,
          id: tile.tileid
        }
        if (isInRange(posAndId)) {
          yield posAndId;
        }
      }
    }
  }
}

export default function({
  scale,
  position,
  objectsData,
  spritesData,
  mapData,
  itemsData,
  itemsIdMap,
  windowSquaresInX,
  windowSquaresInY,
  selectTile
}: Props) {
  const singleSpriteSize = singleSpritePixels * scale;
  const width = singleSpriteSize * windowSquaresInX;
  const height = singleSpriteSize * windowSquaresInY;

  const canvasRef = useRef(null);

  const tilesDictionary = {};

  useEffect(() => {
    const ctx = canvasRef.current.getContext('2d');
    ctx.fillRect(0,0, width, height);

    const drawTile = (tilePosition, tileData) => {
      const { sprites } = tileData;

      const imageId = sprites[0];
      const sWidth = singleSpritePixels;
      const sHeight = singleSpritePixels;
      const dWidth = singleSpriteSize;
      const dHeight = singleSpriteSize;

      let lowerId = 1;
      let higherId = spritesPerAtlas;
      while (imageId > higherId) {
        lowerId += spritesPerAtlas;
        higherId += spritesPerAtlas;
      }
      const offset = imageId - lowerId;
      const name = `${lowerId}-${higherId}`;

      const prefix = 'data:image/png;base64,';
      const src = prefix + spritesData[name].toString('base64');

      const sx = singleSpritePixels * Math.floor(offset % spritesPerAtlasX);
      const sy = singleSpritePixels * Math.floor(offset / spritesPerAtlasX);

      const dx = singleSpriteSize * (tilePosition.x - position.x + Math.floor(windowSquaresInX/2));
      const dy = singleSpriteSize * (tilePosition.y - position.y + Math.floor(windowSquaresInY/2));

      const img = new Image();
      img.onload = function () {
        ctx.drawImage(img, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
      }
      img.src = src;
    }
    const generator = generateTilesForGivenRange({
        xmin: position.x - Math.floor(windowSquaresInX/2),
        xmax: position.x + Math.floor(windowSquaresInX/2),
        ymin: position.y - Math.floor(windowSquaresInY/2),
        ymax: position.y + Math.floor(windowSquaresInY/2),
        z: position.z
      },
      mapData
    );
    for (let posAndId of generator) {
        const { x, y, z, id } = posAndId;
        const clientId = itemsIdMap[id];
        const tileData = objectsData.items[clientId];
        if(tileData===null || tileData===undefined) {
          continue;
        }
        const posString = `${x}:${y}:${z}`; 
        tilesDictionary[posString] = tileData;
        drawTile(posAndId, tileData);
    }
    });

  return (
    <div>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        onClick={e => {
          const x = e.clientX - canvasRef.current.offsetLeft + window.scrollX;
          const y = e.clientY - canvasRef.current.offsetTop + window.scrollY;
          const selectedPosition = {
            x: position.x + Math.floor( (x-width/2)/singleSpriteSize + 1/2),
            y: position.y + Math.floor( (y-height/2)/singleSpriteSize + 1/2),
            z: position.z
          };
          const posString = `${selectedPosition.x}:${selectedPosition.y}:${selectedPosition.z}`; 
          const data = tilesDictionary[posString];
          if (data) {
            selectTile(data);
          }
        }}
      />
    </div>
  );
}
