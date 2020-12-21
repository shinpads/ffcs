import React, { Component } from 'react';
import {
  Route, Switch, Redirect, withRouter,
} from 'react-router-dom';
import colors from '../colors';
import Home from './pages/Home';

class App extends Component {
  componentDidMount() {
    document.body.style.backgroundColor = colors.background;
  }

  render() {
    return (
      <Switch>
        <Route path="/" component={Home} exact />
        <Redirect from="*" to="/" />
      </Switch>
    );
  }
}

export default withRouter(App);
