import './index.css';
import 'regenerator-runtime/runtime';
import React from 'react';
import ReactDOM from 'react-dom';
import { Router } from 'react-router-dom';
import App from './components/App';

import * as serviceWorker from './serviceWorker';

require('babel-polyfill');

ReactDOM.render((
  <App />
), document.getElementById('root'));


serviceWorker.unregister();
