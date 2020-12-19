import './index.css';
import 'regenerator-runtime/runtime';
import React from 'react';
import ReactDOM from 'react-dom';
import { Router } from 'react-router-dom';

import * as serviceWorker from './serviceWorker';

require('babel-polyfill');

ReactDOM.render((
  <div>
    <h1>Test</h1>
    <p>
      hello hello 123
    </p>
  </div>
), document.getElementById('root'));


serviceWorker.unregister();
