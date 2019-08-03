// @flow
import React from 'react';
import Typography from '@material-ui/core/Typography';

const spritesPerAtlas = 256;
const spritesPerAtlasX = 16;
// const spritesPerAtlasY = 16;
const singleSpritePixels = 32;

type Props = {
  data: object,
  spriteIndex: number
};

export default function({ data, spriteIndex }: Props) {
  const placeholder = <div />;
  if (!data || !data.objectId) {
    return placeholder;
  }

  const {
    objectId,
    type,
    groundSpeed,
    hasStackOrder,
    stackOrder,
    unpassable,
    movable,
    blockMissiles,
    hookSouth,
    minimap,
    minimapColor,
    fullGround,
    sprites,
    animationPhases,
    width,
    height,
    blendframes,
    xrepeat,
    yrepeat,
    zrepeat,
    groupAnimationPhases
  } = data;

  let index = spriteIndex;
  if (sprites && sprites.length) {
    index %= sprites.length;
  }
  let imageId = -1;
  if (sprites) {
    imageId = sprites[index];
  }

  return (
    <div>
      <Typography variand="h5" component="h2">
        {`sprite index ${index}`}
      </Typography>
      <Typography variand="h5" component="h2">
        {`cliendId ${objectId}`}
      </Typography>
      <Typography variand="h5" component="h2">
        {`spriteId ${imageId}`}
      </Typography>
      <Typography variand="h5" component="h2">
        {`serverId ${undefined}`}
      </Typography>

      <Typography variand="h5" component="h2" style={{ overflow: 'scroll' }}>
        {`sprites ${sprites}`}
      </Typography>

      <Typography variand="h5" component="h2">
        {`type ${type}`}
      </Typography>
      <Typography variand="h5" component="h2">
        {`groundSpeed ${groundSpeed}`}
      </Typography>
      <Typography variand="h5" component="h2">
        {`hasStackOrder ${hasStackOrder}`}
      </Typography>
      <Typography variand="h5" component="h2">
        {`stackOrder ${stackOrder}`}
      </Typography>
      <Typography variand="h5" component="h2">
        {`unpassable ${unpassable}`}
      </Typography>
      <Typography variand="h5" component="h2">
        {`movable ${movable}`}
      </Typography>
      <Typography variand="h5" component="h2">
        {`blockMissiles ${blockMissiles}`}
      </Typography>
      <Typography variand="h5" component="h2">
        {`hookSouth ${hookSouth}`}
      </Typography>
      <Typography variand="h5" component="h2">
        {`minimap ${minimap}`}
      </Typography>
      <Typography variand="h5" component="h2">
        {`minimapColor ${minimapColor}`}
      </Typography>
      <Typography variand="h5" component="h2">
        {`fullGround ${fullGround}`}
      </Typography>
      <Typography variand="h5" component="h2">
        {`animationPhases ${animationPhases}`}
      </Typography>
      <Typography variand="h5" component="h2">
        {`width ${width}`}
      </Typography>
      <Typography variand="h5" component="h2">
        {`height ${height}`}
      </Typography>
      <Typography variand="h5" component="h2">
        {`blendframes ${blendframes}`}
      </Typography>
      <Typography variand="h5" component="h2">
        {`xrepeat ${xrepeat}`}
      </Typography>
      <Typography variand="h5" component="h2">
        {`yrepeat ${yrepeat}`}
      </Typography>
      <Typography variand="h5" component="h2">
        {`zrepeat ${zrepeat}`}
      </Typography>
      <Typography variand="h5" component="h2">
        {`groupAnimationPhases ${groupAnimationPhases}`}
      </Typography>
    </div>
  );
}
