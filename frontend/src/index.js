import React from 'react';
import { render } from 'react-dom';
import { Router, Route, useRouterHistory, Redirect } from 'react-router';
import { createHistory } from 'history';
import { Provider } from 'react-redux';
import configureStore from './store/configureStore';
import { syncHistoryWithStore } from 'react-router-redux';

import Main from './containers/IndexContainer';
import AuthContainer from './containers/AuthContainer';
import './styles/index.scss';
import 'whatwg-fetch';

const store = configureStore();

const browserHistory = useRouterHistory(createHistory)({});
const history = syncHistoryWithStore(browserHistory, store);

render((
  <Provider store={store}>
    <Router history={history}>
      <Route path="/auth" component={AuthContainer} />
      <Route path="/" component={Main}>
        {/*<Route path="join" component={Join} />*/}
      </Route>
      <Redirect from="*" to="/" />
    </Router>
  </Provider>
), document.getElementById('jude'));
