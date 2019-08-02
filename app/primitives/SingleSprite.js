// @flow
import React from 'react';
const spritesPerAtlas = 256;
const spritesPerAtlasX = 16;
// const spritesPerAtlasY = 16;
const singleSpritePixels = 32;

type Props = {
  id: number,
  spritesData: object,
  scale: number
};

export default function({ id, spritesData, scale }: Props) {
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
  if (!id || id < 1) {
    return placeholder;
  }
  const imageId = id;

  let lowerId = 1;
  let higherId = spritesPerAtlas;
  while (imageId > higherId) {
    lowerId += spritesPerAtlas;
    higherId += spritesPerAtlas;
  }

  const name = `${lowerId}-${higherId}`;

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

  const prefix = 'data:image/png;base64,';
  const src = prefix + spritesData[name].toString('base64');

  return (
    <div>
      <div
        style={{
          width: singleSpriteSize,
          height: singleSpriteSize,
          transform: `translateX(${-x}px) translateY(${-y}px) scale(${scale})`,
          opacity: 1
        }}
      >
        <img src={src} alt={`spriteId: ${imageId}`} />
      </div>
    </div>
  );
}
