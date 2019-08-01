// @flow
import React from 'react';
import path from 'path';

const spritesPerAtlas = 256;
const spritesPerAtlasX = 16;
// const spritesPerAtlasY = 16;
const singleObjectPixels = 32;

type Props = {
  id: number,
  spritesData: object,
  scale: number
};

export default function({ id, spritesData, scale }: Props) {
  const singleObjectSize = singleObjectPixels * scale;

  let objectId = 0;
  let imageId = 1;
  if (data !== undefined) {
    objectId = data.objectId;
    const { sprites } = data;
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
    x += singleObjectPixels;
    if (x >= singleObjectPixels * spritesPerAtlasX) {
      x = 0;
      y += singleObjectPixels;
    }
  }

  x *= scale;
  y *= scale;
  x -= (singleObjectPixels * scale * (scale - 1)) / 2;
  y -= (singleObjectPixels * scale * (scale - 1)) / 2;
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
