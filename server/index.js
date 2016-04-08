require('babel-register')({
    ignore: /(node_modules|modules)\/(?!(lib|booker|core)-ui__)/,
    presets: ['es2015', 'react', 'stage-1'],
    plugins: ['babel-plugin-transform-decorators-legacy']
});

var WebpackIsomorphicTools = require('webpack-isomorphic-tools');
var projectBasePath = require('path').resolve(__dirname, '..');

/**
 * Define isomorphic constants.
 */
global.__CLIENT__ = false;
global.__SERVER__ = true;
global.__DEVELOPMENT__ = process.env.NODE_ENV !== 'production';

if (__DEVELOPMENT__) {
    if (!require('piping')({
            hook: true,
            ignore: /(\/\.|~$|\.json|\.pcss$)/i
        })) {
        return;
    }
}

global.webpackIsomorphicTools = new WebpackIsomorphicTools(require('./../webpack.isomorphic.config'))
    .development(__DEVELOPMENT__)
    .server(projectBasePath, function() {
        require('./server');
    });
