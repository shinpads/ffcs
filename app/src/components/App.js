import React, { Component } from 'react';
import {
  Route, Switch, Redirect, withRouter,
} from 'react-router-dom';

import Home from './pages/Home';

class App extends Component {
  render() {
    return (
      <>
        <Switch>
          <Route path="/" component={Home} exact />
          <Redirect from="*" to="/" />
        </Switch>
      </>
    );
  }
}

export default withRouter(App);
