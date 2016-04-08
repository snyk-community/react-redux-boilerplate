var webpack   = require('webpack');
var webpackConfig = require('./webpack.base.config').config;
var deepmerge = require('./webpack.base.config').deepmerge;

var config = require('./configs/config');

var host = config.host || 'localhost';
var port = config.port || 3001;

var includePath = [__dirname + '/node_modules'].concat(config.devInclude);

module.exports = deepmerge(webpackConfig, {
    devtool: 'source-map',
    entry:  {
        main: [
            'webpack-hot-middleware/client?path=http://' + host + ':' + port + '/__webpack_hmr',
            './app/index'
        ]
    },
    output: {
        path: __dirname + '/public/build',
        publicPath: 'http://' + host + ':' + port + '/build/',
        filename: '[name]-[hash].js',
        chunkFilename: '[name]-[chunkhash].js'
    },
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                include: [__dirname + '/app', __dirname + '/configs'],
                loader: 'babel-loader',
                query: {
                    "presets": ['react', 'es2015', 'stage-1', 'react-hmre'],
                    "plugins": [
                        // must be an array with options object as second item
                        ["react-transform", {
                            // must be an array of objects
                            "transforms": [{
                                // can be an NPM module name or a local path
                                "transform": "react-transform-hmr",
                                // see transform docs for "imports" and "locals" dependencies
                                "imports": ["react"],
                                "locals": ["module"]
                            }, {
                                // you can have many transforms, not just one
                                "transform": "react-transform-catch-errors",
                                "imports": ["react", "redbox-react"]
                            }]
                            // by default we only look for `React.createClass` (and ES6 classes)
                            // but you can tell the plugin to look for different component factories:
                            // factoryMethods: ["React.createClass", "createClass"]
                        }]
                    ]
                }
            },
            {
                test: /(lib|booker|core)-ui__[a-zA-Z0-9-_\/]+\.jsx?$/,
                include: includePath,
                loader: 'babel-loader',
                query: {
                    presets: ['react', 'es2015', 'stage-1'],
                    plugins: ['transform-runtime', 'babel-plugin-transform-decorators-legacy']
                }
            },
            {
                test: /\.pcss$/,
                include: [__dirname + '/app'],
                loader: 'style-loader!css-loader!postcss-loader'
            },
            {
                test: /\.pcss$/,
                include: includePath,
                loader: 'style-loader!css-loader?modules&localIdentName=[local]-[hash:hex:5]!postcss-loader'
            }
        ]
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.DefinePlugin({
            __CLIENT__: true,
            __SERVER__: false,
            __DEVELOPMENT__: true,
            __DEVTOOLS__: false,  // <-------- DISABLE redux-devtools HERE
            'process.env': {
                NODE_ENV: JSON.stringify('development'),
                CONFIG: JSON.stringify('development')
            }
        })
    ]
});
