// @flow
import React from 'react';
import path from 'path';

const spritesPerAtlas = 256;
const spritesPerAtlasX = 16;
// const spritesPerAtlasY = 16;
const singleSpritePixels = 32;

type Props = {
  data: object,
  pathToSprites: string,
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
          opacity: 1,
          background: 'aqua'
        }}
      />
    </div>
  );

  let lowerId = 1;
  let higherId = spritesPerAtlas;
  while (imageId > higherId) {
    lowerId += spritesPerAtlas;
    higherId += spritesPerAtlas;
  }

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
          width: singleObjectSize,
          height: singleObjectSize,
          transform: `translateX(${-x}px) translateY(${-y}px) scale(${scale})`,
          opacity: 0.8
        }}
      >
        <img src={fullFileName} alt={`clientId: ${imageId}`} />
      </div>
    </div>
  );
}
