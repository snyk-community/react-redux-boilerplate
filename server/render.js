import React from 'react';
import ReactDOM from 'react-dom/server';
import serialize from 'serialize-javascript';
import HtmlComponent from '../app/pages/html/html.view';
import logger from '../app/blocks/log/log';
import Core from '../app/blocks/core/core.view';
import PrettyError from 'pretty-error';
import createStore from '../app/blocks/core/create';
import getRoutes from '../app/routes';
import { match } from 'react-router';
import createHistory from 'react-router/lib/createMemoryHistory';
import { ReduxAsyncConnect, loadOnServer } from 'redux-async-connect';
import { Provider } from 'react-redux';

const pretty = new PrettyError();
let log = logger('serverRender');

export default function(req, res, next) {
    log.debug('Incoming request', {method: req.method, path: req.path});
    if (process.env.NODE_ENV === 'development') {
        webpackIsomorphicTools.refresh();
    }

    const history = createHistory(req.url);
    const store = createStore(history);

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

    function getHttpStatusCode(props) {
        var statusCode = 200;

        /* TODO: check statusCode from Route */
        for (let route of props.routes) {
            if (!isNaN(route.status) && route.status !== 200) {
                statusCode = route.status;
                break;
            }
        }

        return statusCode;
    }

    log.debug('Executing navigate action');
    match({history, routes: getRoutes(store), location: req.url }, (err, redirect, props) => {
        // in here we can make some decisions all at once
        if (err) {
            // there was an error somewhere during route matching
            res.status(500).send(err.message)
        } else if (redirect) {
            // we haven't talked about `onEnter` hooks on routes, but before a
            // route is entered, it can redirect. Here we handle on the server.
            res.redirect(redirect.pathname + redirect.search)
        } else if (props) {
            // if we got props then we matched a route and can render
            loadOnServer({...props, store}).then(() => {

                res.status(getHttpStatusCode(props));

                const component = (
                    <Core>
                        <Provider store={store} key="provider">
                            <ReduxAsyncConnect {...props} />
                        </Provider>
                    </Core>
                );

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
            }).catch((e) => log.error(pretty.render(e)));
        } else {
            // no errors, no redirect, we just didn't match anything
            res.status(404).send('Not Found')
        }
    });
}
