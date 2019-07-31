// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import routes from '../constants/routes';

type Props = {};

export default class Home extends Component<Props> {
  props: Props;

  render() {
    return (
      <div data-tid="container">
        <h2>Home</h2>
        <nav>
          <ul>
            <li>
              <Link to={routes.COUNTER}>to Counter</Link>
            </li>
            <li>
              <Link to={routes.OBJECTS}>to Objects</Link>
            </li>
            <li>
              <Link to={routes.ITEMS}>to Items</Link>
            </li>
            <li>
              <Link to={routes.MAP}>to Map</Link>
            </li>
          </ul>
        </nav>
      </div>
    );
  }
}
