import React from 'react';
import { Switch, Route } from 'react-router';
import routes from './constants/routes';
import App from './containers/App';
import HomePage from './containers/HomePage';
import CounterPage from './containers/CounterPage';
import ObjectsPage from './containers/ObjectsPage';
import MapsPage from './containers/MapsPage';

export default () => (
  <App>
    <Switch>
      <Route path={routes.COUNTER} component={CounterPage} />
      <Route path={routes.OBJECTS} component={ObjectsPage} />
      <Route path={routes.ITEMS} component={ObjectsPage} />
      <Route path={routes.MAP} component={MapsPage} />
      <Route exact path={routes.HOME} component={HomePage} />
    </Switch>
  </App>
);
