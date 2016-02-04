import React from 'react';
import ReactDOM from 'react-dom';
import createHistory from 'history/lib/createBrowserHistory';
import createStore from './blocks/core/create';
import { Provider } from 'react-redux';
import { reduxReactRouter, ReduxRouter } from 'redux-router';
import getRoutes from './routes';
import makeRouteHooksSafe from './blocks/core/helpers/makeRouteHooksSafe';
import Core from './blocks/core/core.view';
import config from '../configs/config';

import logger from '../app/blocks/log/log';

let log = logger('clientRender');

const store = createStore(reduxReactRouter, makeRouteHooksSafe(getRoutes), createHistory, window.__data);

let mountNode = document.getElementById('app');
const component = (
    <ReduxRouter routes={getRoutes(store)} />
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
