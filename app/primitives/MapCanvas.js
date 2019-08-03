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
    windowSquaresInX: number,
    windowSquaresInY: number
};

function makeToDrawPositios(tilePosition, width, height) {
    const toDrawPositions = [tilePosition];
    if(width == 2) {
        if(height==2) {
            toDrawPositions.push({
                ...tilePosition,
                x: tilePosition.x-1
            });
            toDrawPositions.push({
                ...tilePosition,
                y: tilePosition.y-1
            });
            toDrawPositions.push({
                ...tilePosition,
                x: tilePosition.x-1,
                y: tilePosition.y-1
            });
        } else {                
            toDrawPositions.push({
                ...tilePosition,
                x: tilePosition.x-1
            });
        }

    } else {
        if (height==2) {
            toDrawPositions.push({
                ...tilePosition,
                y: tilePosition.y-1
            });
        }
    }
    return toDrawPositions;
}

export default function({ scale, position, objectsData, spritesData, mapData, windowSquaresInX, windowSquaresInY }: Props) {
  const singleSpriteSize = singleSpritePixels * scale;
  const width = singleSpriteSize * windowSquaresInX;
  const height = singleSpriteSize * windowSquaresInY;

//   const { objectId, sprites } = data;
//   const [imageId] = sprites;

//   let lowerId = 1;
//   let higherId = spritesPerAtlas;
//   while (imageId > higherId) {
//     lowerId += spritesPerAtlas;
//     higherId += spritesPerAtlas;
//   }

//   const name = `${lowerId}-${higherId}`;

//   let x = 0;
//   let y = 0;
//   let offset = imageId - lowerId;
//   while (offset > 0) {
//     offset -= 1;
//     x += singleSpritePixels;
//     if (x >= singleSpritePixels * spritesPerAtlasX) {
//       x = 0;
//       y += singleSpritePixels;
//     }
//   }

//   x *= scale;
//   y *= scale;
//   x -= (singleSpritePixels * scale * (scale - 1)) / 2;
//   y -= (singleSpritePixels * scale * (scale - 1)) / 2;
//   // console.log(`x=${x} y=${y}`);

//   const prefix = 'data:image/png;base64,';
//   const src = prefix + spritesData[name].toString('base64');

  const canvasRef = useRef(null);

  useEffect(() => {
    const ctx = canvasRef.current.getContext('2d');
    ctx.fillRect(0,0, width, height);

    const drawTile = (tilePosition, tileData) => {
        const toDrawTiles = [];
        const { sprites, width, height } = tileData;
        
        const toDrawPositions = makeToDrawPositions(tilePosition, width, height);

        toDrawPositions.forEach( (thisTilePosition, index) => {
            const imageId = sprites[index];
            const sWidth = singleSpritePixels, sHeight = singleSpritePixels;
            const dWidth = singleSpriteSize, height = singleSpriteSize;

            let lowerId = 1;
            let higherId = spritesPerAtlas;
            while (imageId > higherId) {
                lowerId += spritesPerAtlas;
                higherId += spritesPerAtlas;
            }
            let offset = imageId - lowerId;
            const name = `${lowerId}-${higherId}`;

            const prefix = 'data:image/png;base64,';
            const src = prefix + spritesData[name].toString('base64');

            const sx = singleSpritePixels * Math.floor(offset % spritesPerAtlasX);
            const sy = singleSpritePixels * Math.floor(offset / spritesPerAtlasX);

            const dx = singleSpriteSize * (thisTilePosition.x - position.x);
            const dy = singleSpriteSize * (thisTilePosition.y - position.y)

            ctx.drawImage(src, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
        });
    }
    mapData
  });

  return (
    <div>
        <canvas ref={canvasRef} width={width} height={height}/>
    </div>
  );
}
