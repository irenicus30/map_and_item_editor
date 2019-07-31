// @flow
import fs from 'fs';
import path from 'path';
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

const useStyles = makeStyles({
  root: {
    flexGrow: 1
  },
  card: {
    maxWidth: 400
  }
});

const scale = 2;
const scale2 = 5;
const singleObjectPixels = 32;
const singleObjectSize = singleObjectPixels * scale;
const singleObjectSize2 = singleObjectPixels * scale2;

const windowFieldsY = 11;
const windowFieldsX = 15;

const pathToForgottenserverSprites = 'otb/forgottenserver/sprites';
const pathToOpentibiaspritesSprites = 'otb/opentibiasprites/sprites';

type Props = {
  changeTextField: (event: object) => void,
  changeStartId: (value: string) => void,
  changeTileset: (value: string) => void,
  imageSelect: (key: any) => void,
  mapUpdate: (toUpdate: object) => void,
  mapDelete: (toDelete: object) => void,
  maps: object
};

export default function(props: Props) {
  const classes = useStyles();

  const { changeTextField, changeStartId, changeTileset, imageSelect, mapUpdate, mapDelete, maps } = props;
  const { startIdProps, textFieldValue, pathToSprites, selectedId, mapData } = maps;

  const fullFileName = path.join(__dirname, '..', pathToSprites, 'dat.json');
  const contents = fs.readFileSync(fullFileName);
  const dat = JSON.parse(contents);

  let startId = startIdProps - 101;
  if (!startId) startId = 0;
  if (startId < 0) startId = 0;
  const endId = startId + windowFieldsX * windowFieldsY;

  const imagesOnScreen = windowFieldsX * windowFieldsY;

  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        <Card className={classes.card}>
          <CardContent>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => changeTileset(pathToForgottenserverSprites)}
            >
              tileset forgottenserver
            </Button>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => changeTileset(pathToOpentibiaspritesSprites)}
            >
              tileset opentibiasprites
            </Button>
            <TextField
              id="itemId"
              type="number"
              label="starting item id"
              placeholder="101"
              onChange={changeTextField}
            />
            <Button
              variant="outlined"
              color="primary"
              onClick={() => changeStartId(textFieldValue)}
            >
              Set Start Id
            </Button>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => changeStartId(startIdProps-imagesOnScreen)}
            >
              Prev {imagesOnScreen} images
            </Button>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => changeStartId(startIdProps+imagesOnScreen)}
            >
              Next {imagesOnScreen} images
            </Button>
            <Typography variand="h5" component="h2">
              {`items ${startId} to ${endId - 1}`}
            </Typography>
            <input type="file" id="file" red="fileUploader" />
            <div
              style={{
                width: singleObjectSize2,
                height: singleObjectSize2,
                overflow: 'hidden'
              }}
            >
              <SingleObjectInfo
                id={selectedId}
                data={dat.items[selectedId]}
                pathToSprites={pathToSprites}
                scale={scale2}
              />
            </div>
            <Typography variand="h5" component="h2">
              {`cliendId ${selectedId}`}
            </Typography>
            <Typography variand="h5" component="h2">
              {`spriteId ${dat.items[selectedId]==undefined?'none':dat.items[selectedId].sprites[0]}`}
            </Typography>
            <Typography variand="h5" component="h2">
              {`serverId ${undefined}`}
            </Typography>
          </CardContent>
        </Card>
        <div
          style={{
            width: singleObjectSize * windowFieldsX,
            height: singleObjectSize * windowFieldsY,
            display: 'grid',
            gridTemplateColumns: `repeat(${windowFieldsX}, ${singleObjectSize}px`,
            gridGap: '2px'
          }}
        >
          {Object.keys(dat.items)
            .slice(startId, endId)
            .map((key, index) => {
              return (
                <div
                  key={index}
                  style={{
                    width: singleObjectSize,
                    height: singleObjectSize,
                    overflow: 'hidden'
                  }}
                  onClick={() => imageSelect(key)}
                >
                  <SingleObject
                    mykey={key}
                    data={dat.items[key]}
                    pathToSprites={pathToSprites}
                    scale={scale}
                  />
                </div>
              );
            })}
        </div>
      </Grid>
    </div>
  );
}
