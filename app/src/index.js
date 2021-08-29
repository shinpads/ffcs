import './index.css';
import '../public/favicon.ico';
import 'regenerator-runtime/runtime';
import React from 'react';
import ReactDOM from 'react-dom';
import { Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import App from './components/App';

import { createBrowserHistory } from 'history';
import { store } from './store';

const history = createBrowserHistory();

import * as serviceWorker from './serviceWorker';

require('babel-polyfill');

ReactDOM.render((
  <Router history={history}>
    <Provider store={store}>
      <App />
    </Provider>
  </Router>
), document.getElementById('root'));


serviceWorker.unregister();
