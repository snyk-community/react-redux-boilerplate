import React from 'react';
import ReactDOM from 'react-dom/server';
import serialize from 'serialize-javascript';
import HtmlComponent from '../app/pages/html/html.view';
import logger from '../app/blocks/log/log';
import Core from '../app/blocks/core/core.view';

import PrettyError from 'pretty-error';
import createStore from '../app/blocks/core/create';
import { ReduxRouter } from 'redux-router';
import createHistory from 'history/lib/createMemoryHistory';
import { reduxReactRouter, match } from 'redux-router/server';
import { Provider } from 'react-redux';
import qs from 'query-string';
import getRoutes from '../app/routes';
import getStatusFromRoutes from '../app/blocks/core/helpers/getStatusFromRoutes';

const pretty = new PrettyError();
let log = logger('serverRender');

export default function(req, res, next) {
    log.debug('Incoming request', {method: req.method, path: req.path});
    if (process.env.NODE_ENV === 'development') {
        webpackIsomorphicTools.refresh();
    }

    const store = createStore(reduxReactRouter, getRoutes, createHistory);

    function hydrateOnClient() {
        log.debug('Exposing context state');
        let exposed = 'window.__data=' + serialize(store.getState()) + ';';

        log.debug('Rendering Application component into html');
        let html = ReactDOM.renderToStaticMarkup(HtmlComponent({
            state: exposed,
            assets: webpackIsomorphicTools.assets()
        }));

        log.debug('Sending markup');
        res.send('<!DOCTYPE html>' + html);
    }

    log.debug('Executing navigate action');
    store.dispatch(match(req.originalUrl, (error, redirectLocation, routerState) => {
            if (redirectLocation) {
                res.redirect(redirectLocation.pathname + redirectLocation.search);
            } else if (error) {
                log.error('ROUTER ERROR:', pretty.render(error));
                res.status(500);
                hydrateOnClient();
            } else if (!routerState) {
                res.status(500);
                hydrateOnClient();
            } else {
                // Workaround redux-router query string issue:
                // https://github.com/rackt/redux-router/issues/106
                if (routerState.location.search && !routerState.location.query) {
                    routerState.location.query = qs.parse(routerState.location.search);
                }

                store.getState().router.then(() => {
                    const component = (
                        <Core>
                            <Provider store={store} key="provider">
                                <ReduxRouter/>
                            </Provider>
                        </Core>
                    );

                    const status = getStatusFromRoutes(routerState.routes);
                    if (status) {
                        res.status(status);
                    }

                    log.debug('Exposing context state');
                    let exposed = 'window.__data=' + serialize(store.getState()) + ';';

                    log.debug('Rendering Application component into html');
                    let html = ReactDOM.renderToStaticMarkup(HtmlComponent({
                        state: exposed,
                        markup: ReactDOM.renderToString(component),
                        assets: webpackIsomorphicTools.assets()
                    }));
                    log.debug('Sending markup');
                    res.send('<!DOCTYPE html>' + html);
                }).catch((err) => {
                    log.error('DATA FETCHING ERROR:', pretty.render(err));
                    res.status(500);
                    hydrateOnClient();
                });
            }
        }));
}
