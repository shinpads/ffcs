import './index.css';
import 'regenerator-runtime/runtime';
import React from 'react';
import ReactDOM from 'react-dom';
import { Router } from 'react-router-dom';
import App from './components/App';
import { createBrowserHistory } from 'history';

const history = createBrowserHistory();

import * as serviceWorker from './serviceWorker';

require('babel-polyfill');

ReactDOM.render((
  <Router history={history}>
    <App />
  </Router>
), document.getElementById('root'));


serviceWorker.unregister();
