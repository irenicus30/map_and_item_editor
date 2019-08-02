// @flow
import * as React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import MenuIcon from '@material-ui/icons/Menu';
import NavigateBefore from '@material-ui/icons/NavigateBefore';
import routes from '../constants/routes';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  menuButton: {
    marginRight: theme.spacing(2)
  },
  title: {
    flexGrow: 1
  }
}));

type Props = {
  children: React.Node
};

export default function App(props: Props) {
  const classes = useStyles();
  const { children } = props;

  return (
    <React.Fragment>
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              edge="start"
              className={classes.menuButton}
              color="inherit"
              aria-label="menu"
            >
              <Link
                to={routes.HOME}
                style={{ textDecoration: 'none', color: 'white' }}
              >
                <NavigateBefore />
              </Link>
            </IconButton>

            <IconButton
              edge="start"
              className={classes.menuButton}
              color="inherit"
              aria-label="menu"
            >
              <MenuIcon />
            </IconButton>

            <Button color="inherit">
              <Link
                to={routes.COUNTER}
                style={{ textDecoration: 'none', color: 'white' }}
              >
                to Counter
              </Link>
            </Button>

            <Button color="inherit">
              <Link
                to={routes.OBJECTS}
                style={{ textDecoration: 'none', color: 'white' }}
              >
                to Objects
              </Link>
            </Button>

            <Button color="inherit">
              <Link
                to={routes.ITEMS}
                style={{ textDecoration: 'none', color: 'white' }}
              >
                to Items
              </Link>
            </Button>

            <Button color="inherit">
              <Link
                to={routes.MAP}
                style={{ textDecoration: 'none', color: 'white' }}
              >
                to Map
              </Link>
            </Button>
          </Toolbar>
        </AppBar>
      </div>
      <div>{children}</div>
    </React.Fragment>
  );
}
