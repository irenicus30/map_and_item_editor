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

function makeToDrawPositions(tilePosition, width, height) {
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

function* generateTilesForGivenRange(range, mapData) {
    function isInRange(posAndId) {
        return (
            range.xmin <= posAndId.x &&
            posAndId.x <= range.xmax &&
            range.ymin <= posAndId.y &&
            posAndId.y <= range.ymax &&
            range.z == posAndId.z
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

export default function({ scale, position, objectsData, spritesData, mapData, windowSquaresInX, windowSquaresInY }: Props) {
  const singleSpriteSize = singleSpritePixels * scale;
  const width = singleSpriteSize * windowSquaresInX;
  const height = singleSpriteSize * windowSquaresInY;

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
            const dWidth = singleSpriteSize, dHeight = singleSpriteSize;

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

            const dx = singleSpriteSize * (thisTilePosition.x - position.x + Math.floor(windowSquaresInX/2));
            const dy = singleSpriteSize * (thisTilePosition.y - position.y + Math.floor(windowSquaresInY/2));

            const img = new Image();
            img.onload = function () {
                ctx.drawImage(img, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
            }
            img.src = src;
            
        });
    }
    let generator = generateTilesForGivenRange({
        xmin: position.x - Math.floor(windowSquaresInX/2),
        xmax: position.x + Math.floor(windowSquaresInX/2),
        ymin: position.y - Math.floor(windowSquaresInY/2),
        ymax: position.y + Math.floor(windowSquaresInY/2),
        z: position.z
    }, mapData);
    for (let posAndId of generator) {
        const { id } = posAndId;
        const tileData = objectsData.items[id];
        drawTile(posAndId, tileData);
    }
  });

  return (
    <div>
        <canvas ref={canvasRef} width={width} height={height}/>
    </div>
  );
}
