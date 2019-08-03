// @flow
import React from 'react';

import { makeStyles } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';

import MapCanvas from '../primitives/MapCanvas';
import SingleObject from '../primitives/SingleObject';

const useStyles = makeStyles({
  root: {
    flexGrow: 1
  },
  column: {
    overflow: 'scroll'
  }
});

const pathToForgottenserverData = 'otb/forgottenserver';
const pathToOpentibiaspritesData = 'otb/opentibiasprites';

const windowSquaresInX = 15;
const windowSquaresInY = 11;
const objectsInX = 8;
const objectsInY = 8;

const scale = 2;
const scale2 = 1.5;
const singleSpritePixels = 32;
const singleSTileSize = singleSpritePixels * scale;
const singleObjectSize = singleSpritePixels * scale2;


type Props = {
  changeTileset: (value: string) => void,
  changePosition: (position: object) => void,
  maps: object
};

export default function(props: Props) {
  const classes = useStyles();

  const {
    changeTileset,
    changePosition,
    maps
  } = props;
  const {
    position,
    objectsData,
    spritesData,
    mapData,
  } = maps;
 
  let itemStartId = 0;
  const itemEndId = itemStartId + objectsInX * objectsInY;

  return (
    <div className={classes.root}>
      <Grid container spacing={3} direction="row-reverse">
        <Grid item xs={12} sm={8} className={classes.column}>
          <MapCanvas
            scale={scale}
            position={position}
            objectsData={objectsData}
            spritesData={spritesData}
            mapData={mapData}
            windowSquaresInX={windowSquaresInX}
            windowSquaresInY={windowSquaresInY}
          />
        </Grid>

        <Grid item xs={12} sm={4} className={classes.column}>
          <div
            style={{
              width: singleObjectSize * objectsInX,
              height: singleObjectSize * objectsInY,
              display: 'grid',
              gridTemplateColumns: `repeat(${objectsInX}, ${singleObjectSize}px`
            }}
          >
            {Object.keys(objectsData.items)
              .slice(itemStartId, itemEndId)
              .map(objectId => {
                const data = objectsData.items[objectId];
                return (
                  <div
                    key={objectId}
                    style={{
                      width: singleObjectSize,
                      height: singleObjectSize,
                      overflow: 'hidden'
                    }}
                    onClick={() => {NaN;}}
                  >
                    <SingleObject
                      data={data}
                      spritesData={spritesData}
                      scale={scale2}
                    />
                  </div>
                );
              })}
          </div>
        </Grid>
      </Grid>
    </div>
  );
}
