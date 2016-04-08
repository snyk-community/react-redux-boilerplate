import { createStore as _createStore, applyMiddleware, compose } from 'redux';
import { syncHistory } from 'react-router-redux';
import thunk from 'redux-thunk';

export default function createStore(history, data) {
    const reduxRouterMiddleware = syncHistory(history);
    const middleware = [
        thunk,
        reduxRouterMiddleware
    ];
    let createStoreWithMiddleware;
    if (__CLIENT__ && __DEVELOPMENT__) {
        const createLogger = require('redux-logger');
        const logger = createLogger({
            duration: true
        });
        middleware.push(logger);
    }
    if (__CLIENT__ && __DEVTOOLS__) {
        const { persistState } = require('redux-devtools');
        const DevTools = require('./../dev-tools/dev-tools.view');
        createStoreWithMiddleware = compose(
            applyMiddleware(...middleware, logger),
            window.devToolsExtension ? window.devToolsExtension() : DevTools.instrument(),
            persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/))
        )(_createStore);
    } else {
        createStoreWithMiddleware = applyMiddleware(...middleware)(_createStore);
    }

    const reducers = require('../../reducers').default;
    const store = createStoreWithMiddleware(reducers, data);

    // TODO: why this not working? O.o  
    //reduxRouterMiddleware.listenForReplays(store);

    if (__DEVELOPMENT__ && module.hot) {
        module.hot.accept('./../../reducers', () => {
            store.replaceReducer(require('./../../reducers').default);
        });
    }

    return store;
}
