import React from 'react';
import ReactDOM from 'react-dom';
import createStore from './blocks/core/create';
import { Provider } from 'react-redux';
import { Router, browserHistory } from 'react-router';
import { ReduxAsyncConnect } from 'redux-async-connect';
import getRoutes from './routes';
import Core from './blocks/core/core.view';
import config from '../configs/config';
import useScroll from 'scroll-behavior/lib/useStandardScroll';
import logger from '../app/blocks/log/log';

let log = logger('clientRender');

const history = useScroll(() => browserHistory)();
const store = createStore(browserHistory, window.__data);

let mountNode = document.getElementById('app');
const component = (
    <Router render={(props) =>
                <ReduxAsyncConnect {...props} filter={item => !item.deferred} />
              } history={history}>
        {getRoutes(store)}
    </Router>
);
ReactDOM.render(
    <Core>
        <Provider store={store} key="provider">
            {component}
        </Provider>
    </Core>
, mountNode);

if (__DEVTOOLS__ && !window.devToolsExtension) {
    const DevTools = require('./blocks/dev-tools/dev-tools.view');
    ReactDOM.render(
        <Core>
            <Provider store={store} key="provider">
                <div>
                    {component}
                    <DevTools />
                </div>
            </Provider>
        </Core>
    , mountNode);
}
