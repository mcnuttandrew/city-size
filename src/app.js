import React from 'react';
import ReactDOM from 'react-dom';
// import {browserHistory, Router, Route} from 'react-router';

import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom';

import './stylesheets/main.scss';
import Root from './components/root.js';

const Routes = (
  <Router >
    <div>
      <Route path="/city-size/" component={Root} />
      <Route path="/city-size" component={Root} />
      <Route path="/" component={Root} />
    </div>
  </Router>
);

ReactDOM.render(Routes, document.getElementById('app'));
