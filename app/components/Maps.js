// @flow
import React from 'react';

import { makeStyles } from '@material-ui/core/styles';

import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import ArrowLeft from '@material-ui/icons/ArrowLeft';
import ArrowRight from '@material-ui/icons/ArrowRight';
import ArrowDropUp from '@material-ui/icons/ArrowDropUp';
import ArrowDropDown from '@material-ui/icons/ArrowDropDown';
import ExposureNeg1 from '@material-ui/icons/ExposureNeg1';
import ExposurePlus1 from '@material-ui/icons/ExposurePlus1';
import ZoomIn from '@material-ui/icons/ZoomIn';
import ZoomOut from '@material-ui/icons/ZoomOut';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';

import MapCanvas from '../primitives/MapCanvas';
import Minimap from '../primitives/Minimap';
import SingleObject from '../primitives/SingleObject';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  card: {
    maxWidth: 800,    
    minHeight: 300
  },
  column: {
    overflow: 'scroll'
  },
  menuButton: {
    marginRight: theme.spacing(2)
  }
}));

const windowSquaresInX = 15;
const windowSquaresInY = 11;
const objectsInX = 32;
const objectsInY = 4;

const scale = 2;
const scale2 = 1.5;
const singleSpritePixels = 32;
const singleObjectSize = singleSpritePixels * scale2;

const scaleFactor = 1.2;

type Props = {
  changeTileset: (value: string) => void,
  setPosition: (position: object) => void,
  movePosition: (delta: object) => void,
  maps: object
};

export default function(props: Props) {
  const classes = useStyles();

  const {
    changeTileset,
    setPosition,
    movePosition,
    changeMinimapScale,
    maps
  } = props;
  const {
    position,
    objectsData,
    spritesData,
    mapData,
    minimapScale
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
          <Minimap
            scale={minimapScale}
            position={position}
            objectsData={objectsData}
            spritesData={spritesData}
            mapData={mapData}
            width={windowSquaresInX * singleSpritePixels}
            height={windowSquaresInY * singleSpritePixels}
            windowSquaresInX={windowSquaresInX}
            windowSquaresInY={windowSquaresInY}
            setPosition={setPosition}
          />

          <Card className={classes.card}>
            <CardContent>

              <div
                style={{
                  width: singleSpritePixels * 3,
                  height: singleSpritePixels * 3,
                  display: 'grid',
                  gridTemplateColumns: `repeat(${3}, ${singleSpritePixels}px`
                }}
              >
                <div></div>
                <div>
                  <IconButton
                    edge="start"
                    className={classes.menuButton}
                    color="inherit"
                    aria-label="menu"
                    onClick={() => movePosition({y: -1})}
                  >
                    <ArrowDropUp />
                  </IconButton>
                </div>
                <div></div>
                <div>
                  <IconButton
                    edge="start"
                    className={classes.menuButton}
                    color="inherit"
                    aria-label="menu"
                    onClick={() => movePosition({x: -1})}
                  >
                    <ArrowLeft />
                  </IconButton>
                </div>
                <div></div>
                <div>
                  <IconButton
                    edge="start"
                    className={classes.menuButton}
                    color="inherit"
                    aria-label="menu"
                    onClick={() => movePosition({x: 1})}
                  >
                    <ArrowRight />
                  </IconButton>
                </div>
                <div></div>
                <div>
                  <IconButton
                    edge="start"
                    className={classes.menuButton}
                    color="inherit"
                    aria-label="menu"
                    onClick={() => movePosition({y: 1})}
                  >
                    <ArrowDropDown />
                  </IconButton>
                </div>
                <div></div>
                <div>
                  <IconButton
                    edge="start"
                    className={classes.menuButton}
                    color="inherit"
                    aria-label="menu"
                    onClick={() => movePosition({z: -1})}
                  >
                    <ExposurePlus1 />
                  </IconButton>
                </div>
                <div></div>
                <div>
                  <IconButton
                    edge="start"
                    className={classes.menuButton}
                    color="inherit"
                    aria-label="menu"
                    onClick={() => changeMinimapScale(minimapScale * scaleFactor)}
                  >
                    <ZoomIn />
                  </IconButton>
                </div>
                <div>
                  <IconButton
                    edge="start"
                    className={classes.menuButton}
                    color="inherit"
                    aria-label="menu"
                    onClick={() => movePosition({z: 1})}
                  >
                    <ExposureNeg1 />
                  </IconButton>
                </div>
                <div></div>
                <div>
                  <IconButton
                    edge="start"
                    className={classes.menuButton}
                    color="inherit"
                    aria-label="menu"
                    onClick={() => changeMinimapScale(minimapScale / scaleFactor)}
                  >
                    <ZoomOut />
                  </IconButton>
                </div>
              </div>

            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={12} className={classes.column}>
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
