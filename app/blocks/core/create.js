import { createStore as _createStore, applyMiddleware, compose } from 'redux';
import transitionMiddleware from './middleware/transitionMiddleware';
import thunk from 'redux-thunk';

export default function createStore(reduxReactRouter, getRoutes, createHistory, data) {
    const middleware = [
        thunk,
        transitionMiddleware
    ];
    let finalCreateStore;
    if (__CLIENT__ && __DEVELOPMENT__) {
        const createLogger = require('redux-logger');
        const logger = createLogger({
            duration: true
        });
        middleware.push(logger);
    }
    if (__SERVER__) {
        finalCreateStore = compose(
            reduxReactRouter({ getRoutes, createHistory }),
            applyMiddleware(...middleware)
        )(_createStore);
    } else if (__CLIENT__ && __DEVTOOLS__) {
        const { persistState } = require('redux-devtools');
        const DevTools = require('./../dev-tools/dev-tools.view');
        finalCreateStore = compose(
            applyMiddleware(...middleware, logger),
            reduxReactRouter({ getRoutes, createHistory }),
            window.devToolsExtension ? window.devToolsExtension() : DevTools.instrument(),
            persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/))
        )(_createStore);
    } else if (__CLIENT__) {
        finalCreateStore = compose(
            applyMiddleware(...middleware),
            reduxReactRouter({ getRoutes, createHistory })
        )(_createStore);
    }

    const reducers = require('./../../reducers').default;
    const store = finalCreateStore(reducers, data);

    if (__DEVELOPMENT__ && module.hot) {
        module.hot.accept('./../../reducers', () => {
            store.replaceReducer(require('./../../reducers').default);
        });
    }

    return store;
}
