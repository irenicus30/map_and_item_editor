// @flow
import React from 'react';

import { makeStyles } from '@material-ui/core/styles';

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

import SingleObject from '../primitives/SingleObject';
import SingleObjectInfo from '../primitives/SingleObjectInfo';

import SingleSprite from '../primitives/SingleSprite';
import SingleSpriteInfo from '../primitives/SingleSpriteInfo';

const useStyles = makeStyles({
  root: {
    flexGrow: 1
  },
  card: {
    maxWidth: 400
  }
});

const pathToForgottenserverData = 'otb/forgottenserver';
const pathToOpentibiaspritesData = 'otb/opentibiasprites';

const scale = 2;
const scale2 = 5;
const singleSpritePixels = 32;
const singleSpriteSize = singleSpritePixels * scale;
const singleSpriteSize2 = singleSpriteSize * scale2;

const objectsInX = 8;
const objectsInY = 8;

const spritesInX = 6;
const spritesInY = 6;

type Props = {
  changeTileset: (value: string) => void,
  changeObjectTextField: (event: object) => void,
  changeObjectStartId: (value: string) => void,
  selectObject: (key: any) => void,
  changeSprirteTextField: (event: object) => void,
  changeSpriteStartId: (value: string) => void,
  selectSprite: (key: any) => void,
  objects: object
};

export default function(props: Props) {
  const classes = useStyles();

  const {
    changeTileset,
    changeObjectTextField,
    changeObjectStartId,
    selectObject,
    changeSprirteTextField,
    changeSpriteStartId,
    selectSprite,
    objects
  } = props;
  const {
    objectTextField,
    objectStartId,
    objectSelectedId,
    spriteTextField,
    spriteStartId,
    spriteSelectedId,
    objectsData,
    spritesData
  } = objects;

  const itemSelectedId = objectSelectedId - 101;

  let itemStartId = objectStartId - 101;
  if (!itemStartId) itemStartId = 0;
  if (itemStartId < 0) itemStartId = 0;

  const itemEndId = itemStartId + objectsInX * objectsInY;
  const objectEndId = objectStartId + objectsInX * objectsInY;

  const objectsOnScreen = objectsInX * objectsInY;

  const spriteEndId = spriteStartId + spritesInX * spritesInY;

  const spritesOnScreen = spritesInX * spritesInY;

  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={4}  sm={2}>
          <Card className={classes.card}>
            <CardContent>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => changeTileset(pathToForgottenserverData)}
              >
                tileset forgottenserver
              </Button>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => changeTileset(pathToOpentibiaspritesData)}
              >
                tileset opentibiasprites
              </Button>
              <TextField
                id="objectId"
                type="number"
                label="starting object id"
                placeholder="101"
                onChange={changeObjectTextField}
              />
              <Button
                variant="outlined"
                color="primary"
                onClick={() => changeObjectStartId(objectTextField)}
              >
                Set Start Id
              </Button>
              <Button
                variant="outlined"
                color="primary"
                onClick={() =>
                  changeObjectStartId(objectStartId - objectsOnScreen)
                }
              >
                Prev {objectsOnScreen} images
              </Button>
              <Button
                variant="outlined"
                color="primary"
                onClick={() =>
                  changeObjectStartId(objectStartId + objectsOnScreen)
                }
              >
                Next {objectsOnScreen} images
              </Button>
              <Typography variand="h5" component="h2">
                {`items ${objectStartId} to ${objectEndId - 1}`}
              </Typography>
            </CardContent>
            <div
              style={{
                width: singleSpriteSize2,
                height: singleSpriteSize2,
                overflow: 'hidden'
              }}
            >
              <SingleObjectInfo
                data={objectsData.items[itemSelectedId]}
                spritesData={spritesData}
                scale={scale2}
              />
            </div>
          </Card>
        </Grid>
        <Grid item xs={8} sm={4}>
          <Typography variand="h5" component="h2">
            {`OBJECTS`}
          </Typography>
          <div
            style={{
              width: singleSpriteSize * objectsInX,
              height: singleSpriteSize * objectsInY,
              display: 'grid',
              gridTemplateColumns: `repeat(${objectsInX}, ${singleSpriteSize}px`
            }}
          >
            {Object.keys(objectsData.items)
              .slice(itemStartId, itemEndId)
              .map(data => {
                return (
                  <div
                    key={data.objectId}
                    style={{
                      width: singleSpriteSize,
                      height: singleSpriteSize,
                      overflow: 'hidden'
                    }}
                    onClick={() => selectObject(data)}
                  >
                    <SingleObject
                      data={data}
                      spritesData={spritesData}
                      scale={scale}
                    />
                  </div>
                );
              })}
          </div>
        </Grid>
        <Grid item xs={8}  sm={4}>
          <Typography variand="h5" component="h2">
            {`SPRITES`}
          </Typography>
          <div
            style={{
              width: singleSpriteSize * spritesInX,
              height: singleSpriteSize * spritesInY,
              display: 'grid',
              gridTemplateColumns: `repeat(${spritesInX}, ${singleSpriteSize}px`
            }}
          >
            {Array.from(
              { length: spriteStartId - spriteEndId + 1 },
              (v, k) => spriteStartId + k
            ).map(id => {
              return (
                  <div
                    key={id}
                    style={{
                      width: singleSpriteSize,
                      height: singleSpriteSize,
                      overflow: 'hidden'
                    }}
                    onClick={() => selectSprite(id)}
                  >
                  <SingleSprite
                    id={id}
                    spritesData={spritesData}
                    scale={scale}
                  />
                </div>
              );
            })}
          </div>
        </Grid>
        <Grid item xs={4} sm={2}>
          <Card className={classes.card}>
            <CardContent>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => changeTileset(pathToForgottenserverData)}
              >
                tileset forgottenserver
              </Button>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => changeTileset(pathToOpentibiaspritesData)}
              >
                tileset opentibiasprites
              </Button>
              <TextField
                id="spriteId"
                type="number"
                label="starting sprite id"
                placeholder="101"
                onChange={changeSprirteTextField}
              />
              <Button
                variant="outlined"
                color="primary"
                onClick={() => changeSpriteStartId(spriteTextField)}
              >
                Set Start Id
              </Button>
              <Button
                variant="outlined"
                color="primary"
                onClick={() =>
                  changeSpriteStartId(spriteStartId - spritesOnScreen)
                }
              >
                Prev {spritesOnScreen} sprites
              </Button>
              <Button
                variant="outlined"
                color="primary"
                onClick={() =>
                  changeSpriteStartId(spriteStartId + spritesOnScreen)
                }
              >
                Next {spritesOnScreen} sprites
              </Button>
              <Typography variand="h5" component="h2">
                {`sprites ${spriteStartId} to ${spriteEndId - 1}`}
              </Typography>
              <div
                style={{
                  width: singleSpriteSize2,
                  height: singleSpriteSize2,
                  overflow: 'hidden'
                }}
              >
                <SingleSpriteInfo
                  id={spriteSelectedId}
                  spritesData={spritesData}
                  scale={scale2}
                />
              </div>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
}
