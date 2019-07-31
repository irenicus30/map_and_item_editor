// @flow
import React from 'react';
import path from 'path';

const spritesPerAtlas = 256;
const spritesPerAtlasX = 16;
// const spritesPerAtlasY = 16;
const singleSpritePixels = 32;

type Props = {
  data: object,
  spritesData: object,
  scale: number
};

export default function({ data, spritesData, scale }: Props) {
  const singleSpriteSize = singleSpritePixels * scale;
  const placeholder = (
    <div>
      <div
        style={{
          width: singleSpriteSize,
          height: singleSpriteSize,
          transform: `scale(${scale})`,
          opacity: 1,
          background: "white"
        }}
      />
    </div>
  );
 
  let objectId = 0;
  let imageId = 1;
  let sprites = [];
  if (data && data.objectId) {
    objectId = data.objectId;
    { sprites } = data;
    [imageId] = sprites;
  }

  let lowerId = 1;
  let higherId = spritesPerAtlas;
  while (imageId > higherId) {
    lowerId += spritesPerAtlas;
    higherId += spritesPerAtlas;
  }

  const fileName = `${lowerId.toString()}-${higherId.toString()}.png`;

  const fullFileName = path.join(__dirname, '..', pathToSprites, fileName);
  // console.log(fullFileName);

  let x = 0;
  let y = 0;
  let offset = imageId - lowerId;
  while (offset > 0) {
    offset -= 1;
    x += singleSpritePixels;
    if (x >= singleSpritePixels * spritesPerAtlasX) {
      x = 0;
      y += singleSpritePixels;
    }
  }

  x *= scale;
  y *= scale;
  x -= (singleSpritePixels * scale * (scale - 1)) / 2;
  y -= (singleSpritePixels * scale * (scale - 1)) / 2;
  // console.log(`x=${x} y=${y}`);

  return (
    <div>
      <div
        style={{
          width: singleSpriteSize,
          height: singleSpriteSize,
          transform: `translateX(${-x}px) translateY(${-y}px) scale(${scale})`,
          opacity: 0.8
        }}
      >
        <img src={fullFileName} alt={`clientId: ${imageId}`} />
      </div>
    </div>
  );
}
