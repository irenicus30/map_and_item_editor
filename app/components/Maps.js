// @flow
import React, { useRef } from 'react';

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
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Input from '@material-ui/core/Input';

import MapCanvas from '../primitives/MapCanvas';
import Minimap from '../primitives/Minimap';
import SingleObject from '../primitives/SingleObject';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
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
const scale2 = 1;
const singleSpritePixels = 32;
const singleObjectSize = singleSpritePixels * scale2;

const scaleFactor = 2;

type Props = {
  changeTileset: (value: string) => void,
  setPosition: (position: object) => void,
  movePosition: (delta: object) => void,
  changeMinimapScale: (newScale: number) => void,
  selectTile: (key: any) => void,
  changePanelStartId: (value: string) => void,
  maps: object
};

export default function(props: Props) {
  const classes = useStyles();

  const {
    changeTileset,
    setPosition,
    movePosition,
    changeMinimapScale,
    selectTile,
    changePanelStartId,
    shared,
    maps
  } = props;
  const {
    objectsData,
    spritesData,
    mapData,
    itemsData,
    itemsIdMap
  } = shared;
  const {
    itemStartIndex,
    position,
    minimapScale,
    selectedTileId
  } = maps;

  const objectsOnPanel = objectsInX * objectsInY;
  const itemEndIndex = itemStartIndex + objectsOnPanel;
  const cardWidth = singleSpritePixels * windowSquaresInX;
  const cardHeight =
    singleSpritePixels * scale * windowSquaresInY -
    singleSpritePixels * windowSquaresInY;
  const cardStyle = {
    width: cardWidth + 'px',
    height: cardHeight + 'px'
  };

  const filesRef = useRef(null);
  const xFormRef = useRef(null);
  const yFormRef = useRef(null);
  const zFormRef = useRef(null);

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
            itemsData={itemsData}
            itemsIdMap={itemsIdMap}
            windowSquaresInX={windowSquaresInX}
            windowSquaresInY={windowSquaresInY}
            selectTile={selectTile}
          />
        </Grid>

        <Grid item xs={12} sm={4} className={classes.column}>
          <Card className={classes.card}>
            <CardContent>              
              <Typography variand="h5" component="h2">
                {"Select folder with dat.json items.json map.json and sprites"}
              </Typography>
              <Typography variand="h5" component="h2">
                <input
                  type="file"
                  webkitdirectory="true"
                  multiple
                  ref={filesRef}
                  onChange={event => {
                    const newPathToData = filesRef.current.files[0].path;
                    changeTileset(newPathToData);
                  }}
                />
              </Typography>
            </CardContent>
          </Card>
          <Minimap
            scale={minimapScale}
            position={position}
            objectsData={objectsData}
            spritesData={spritesData}
            mapData={mapData}
            itemsData={itemsData}
            itemsIdMap={itemsIdMap}
            width={windowSquaresInX * singleSpritePixels}
            height={windowSquaresInY * singleSpritePixels}
            windowSquaresInX={windowSquaresInX}
            windowSquaresInY={windowSquaresInY}
            setPosition={setPosition}
          />

          <Card style={cardStyle}>
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={6} className={classes.column}>
                  <div
                    style={{
                      width: singleSpritePixels * 3,
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
                </Grid>
                <Grid item xs={6} className={classes.column}>
                  <div>
                    <Typography variand="h5" component="h2">
                      {`position: ${JSON.stringify(position)}`}
                    </Typography>
                    <Typography variand="h5" component="h2">
                      {`selectedTileId: ${selectedTileId}`}
                    </Typography>
                  </div>
                  <div>
                    <label htmlFor="x">x: </label>
                    <input
                      ref={xFormRef}
                      id="x"
                      type="number"
                      label="put x coordinate"
                      defaultValue="1000"
                    />
                    <label htmlFor="y">y: </label>
                    <input
                      ref={yFormRef}
                      id="y"
                      type="number"
                      label="put y coordinate"
                      defaultValue="1000"
                    />
                    <label htmlFor="z">z: </label>
                    <input
                      ref={zFormRef}
                      id="z"
                      type="number"
                      label="put z coordinate"
                      defaultValue="7"
                    />
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => {
                        const x = parseInt(xFormRef.current.value);
                        const y = parseInt(yFormRef.current.value);
                        const z = parseInt(zFormRef.current.value);
                        const newPosition = {x, y, z};
                        setPosition(newPosition);
                      }}
                    >
                      Change position
                    </Button>
                  </div>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={8} className={classes.column}>
          <div
            style={{
              width: singleObjectSize * objectsInX,
              height: singleObjectSize * objectsInY,
              display: 'grid',
              gridTemplateColumns: `repeat(${objectsInX}, ${singleObjectSize}px`
            }}
          >
            {Object.keys(objectsData.items)
              .slice(itemStartIndex, itemEndIndex)
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
        
        <Grid item xs={12} sm={4} className={classes.column}>
          <Card className={classes.card}>
            <CardContent>
              <Button
                variant="outlined"
                color="primary"
                onClick={() =>
                  changePanelStartId(itemStartIndex - objectsOnPanel)
                }
              >
                Prev {objectsOnPanel} objects
              </Button>
              <Button
                variant="outlined"
                color="primary"
                onClick={() =>
                  changePanelStartId(itemStartIndex + objectsOnPanel)
                }
              >
                Next {objectsOnPanel} objects
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
}
