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
    width: number,
    height: number,
    setPosition: (position: object) => void
};

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

export default function({ scale, position, objectsData, spritesData, mapData, width, height, windowSquaresInX, windowSquaresInY, setPosition }: Props) {
  const singleSpriteSize = singleSpritePixels * scale;

  const canvasRef = useRef(null);

  useEffect(() => {
    const ctx = canvasRef.current.getContext('2d');
    ctx.fillRect(0,0, width, height);

    const drawMinimapTile = (tilePosition, minimapColor) => {
        let hexColor = '#000000';
        if( 0 < minimapColor && minimapColor < 216) {
            const r = Math.floor(minimapColor / 36) % 6 * 51;
            const g = Math.floor(minimapColor / 6) % 6 * 51;
            const b = minimapColor % 6 * 51;
            hexColor = '#' + ((1<<24) + (r<<16) + (g<<8) + b).toString(16).slice(1);
        }
        ctx.fillStyle = hexColor;

        const dWidth = singleSpriteSize, dHeight = singleSpriteSize;

        const dx = singleSpriteSize * (tilePosition.x - position.x) + Math.floor(width/2);
        const dy = singleSpriteSize * (tilePosition.y - position.y) + Math.floor(height/2);

        ctx.fillRect(dx, dy, dWidth, dHeight);
    }
    let generator = generateTilesForGivenRange({
        xmin: position.x - Math.floor(width/2) / singleSpriteSize,
        xmax: position.x + Math.floor(width/2) / singleSpriteSize,
        ymin: position.y - Math.floor(height/2) / singleSpriteSize,
        ymax: position.y + Math.floor(height/2) / singleSpriteSize,
        z: position.z
    }, mapData);
    for (let posAndId of generator) {
        const { id } = posAndId;
        const minimapColor = objectsData.items[id].minimapColor;
        drawMinimapTile(posAndId, minimapColor);
    }
    let mapVisibleX = -singleSpriteSize * Math.floor(windowSquaresInX/2) + Math.floor(width/2);
    let mapVisibleY = -singleSpriteSize * Math.floor(windowSquaresInY/2) + Math.floor(height/2);
    let mapVisibleWidth = singleSpriteSize * windowSquaresInX;
    let mapVisibleHeight = singleSpriteSize * windowSquaresInY;
    ctx.beginPath()
    ctx.rect(mapVisibleX, mapVisibleY, mapVisibleWidth, mapVisibleHeight);
    ctx.strokeStyle = "white";    
    ctx.stroke();
    ctx.beginPath()
    ctx.rect(mapVisibleX-1, mapVisibleY-1, mapVisibleWidth+2, mapVisibleHeight+2);
    ctx.strokeStyle = "black";    
    ctx.stroke();
  });

  return (
    <div>
        <canvas
            ref={canvasRef}
            width={width}
            height={height}
            onClick={ e => {
                let x = e.clientX - canvasRef.current.offsetLeft;
                let y = e.clientY - canvasRef.current.offsetTop;
                setPosition({
                    x: position.x + Math.floor( (x-width/2)/singleSpriteSize ),
                    y: position.y + Math.floor( (y-height/2)/singleSpriteSize ),
                    z: position.z
                });
            }}
        />
    </div>
  );
}
