import React, { Component } from 'react';
import {
  Route, Switch, Redirect, withRouter,
} from 'react-router-dom';
import { connect } from 'react-redux';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import colors from '../colors';
import { getUser } from '../actions/userActions';
import { getLeagueData } from '../actions/leagueActions';
import Home from './pages/Home';
import Signup from './pages/Signup';
import Match from './pages/Match';
import UserProfile from './pages/UserProfile';

const theme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: {
      main: colors.primary,
      contrastText: colors.white,
    },
    secondary: {
      main: colors.secondary,
      contrastText: colors.white,
    },
    background: {
      paper: colors.darkGrey,
      linearProgress: colors.darkGrey,
    },
  },
});

class App extends Component {
  componentDidMount() {
    const { dispatch } = this.props;

    document.body.style.backgroundColor = colors.background;
    dispatch(getUser());
    dispatch(getLeagueData());
  }

  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <Switch>
          <Route path="/" component={Home} exact />
          <Route path="/signup" component={Signup} exact />
          <Route path="/match/:id" component={Match} exact />
          <Route path="/user/:id" component={UserProfile} exact />
          <Redirect from="*" to="/" />
        </Switch>
      </MuiThemeProvider>
    );
  }
}

export default withRouter(connect()(App));
