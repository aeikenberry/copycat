import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from './containers/App';
import History from './containers/History';

export default (
  <Route path="/" component={App}>
    <IndexRoute component={History} />
  </Route>
);
