// @flow
import * as React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
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

    return <React.Fragment>
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
              <Link to={routes.HOME}>
                <NavigateBefore />
              </Link>
            </IconButton>

            <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
              <MenuIcon />
            </IconButton>

            <Typography variant="h6" className={classes.title}>
              <Link to={routes.COUNTER}>to Counter</Link>
            </Typography>

            <Typography variant="h6" className={classes.title}>
              <Link to={routes.OBJECTS}>to Objects</Link>
            </Typography>

            <Typography variant="h6" className={classes.title}>
              <Link to={routes.ITEMS}>to Items</Link>
            </Typography>

            <Typography variant="h6" className={classes.title}>
              <Link to={routes.MAP}>to Map</Link>
            </Typography>
          </Toolbar>
        </AppBar>
      </div>


      <div>
        {children}
      </div>
    </React.Fragment>;
}
