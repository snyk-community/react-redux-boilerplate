import http from 'http';
import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import webpack from 'webpack';
import compression from 'compression';
import path from 'path';
import favicon from 'serve-favicon';

import render from './render';
import logger from '../app/blocks/log/log';
import config from '../configs/config';

let log = logger('server');

let expressApp = express();
let server = http.Server(expressApp);

// Express Middleware
expressApp.use(compression());
expressApp.use(cookieParser());
expressApp.use(bodyParser.json());
expressApp.use(favicon(path.join(__dirname, '..', 'public', 'favicon.ico')));

if (process.env.NODE_ENV === 'development') {
    expressApp.use(express.static(path.join(__dirname, '..', 'public')));
}

expressApp.use(render);


let port = process.env.PORT || 8080;
server.listen(port, function() {
    log.info('Listening on port => ' + port);
}); 
