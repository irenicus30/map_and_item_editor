// @flow
import React from 'react';
import Typography from '@material-ui/core/Typography';

const spritesPerAtlas = 256;
const spritesPerAtlasX = 16;
// const spritesPerAtlasY = 16;
const singleSpritePixels = 32;

type Props = {
  data: object,
  spriteIndex: number,
  spritesData: object,
  scale: number
};

export default function({ data, spriteIndex, spritesData, scale }: Props) {
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
  if (!data || !data.objectId) {
    return placeholder;
  }

  const { objectId, sprites } = data;
  let index = spriteIndex;
  while (sprites.length <= index) {
    index -= sprites.length;
  }
  const imageId = sprites[index];

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

  const name = `${lowerId}-${higherId}`;

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
          opacity: 0.8
        }}
      >
        <img src={src} alt={`clientId: ${objectId}`} />
      </div>
      <Typography variand="h5" component="h2">
        {`cliendId ${objectId}`}
      </Typography>
      <Typography variand="h5" component="h2">
        {`spriteId ${imageId}`}
      </Typography>
      <Typography variand="h5" component="h2">
        {`serverId ${undefined}`}
      </Typography>
    </div>
  );
}
