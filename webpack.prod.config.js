var webpack   = require('webpack');
var config = require('./webpack.base.config').config;
var deepmerge = require('./webpack.base.config').deepmerge;
var ExtractTextPlugin = require('extract-text-webpack-plugin');
// https://github.com/webpack/webpack/issues/1315
var WebpackMd5Hash = require('webpack-md5-hash');

module.exports = deepmerge(config, {
    entry: {
        vendors: [
            'react',
            'react-dom',
            'react-router',
            'react-router-redux',
            'react-redux',
            'redux',
            'redux-thunk',
            'redux-async-connect',
            'scroll-behavior'
        ]
    },
    output: {
        publicPath: '/build/'
    },
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                include: [__dirname + '/app', __dirname + '/configs'],
                loader: 'babel-loader',
                query: {
                    "presets": ['react', 'es2015', 'stage-1'],
                    "plugins": ['babel-plugin-transform-decorators-legacy']
                }
            },
            {
                test: /(lib|booker|core)-ui__[a-zA-Z0-9-_\/]+\.jsx?$/,
                include: [__dirname + '/node_modules'],
                loader: 'babel-loader',
                query: {
                    "presets": ['react', 'es2015', 'stage-1'],
                    "plugins": ['babel-plugin-transform-decorators-legacy']
                }
            },
            {
                test: /\.pcss$/,
                include: [__dirname + '/app'],
                loader: ExtractTextPlugin.extract('style', 'css-loader!postcss-loader')
            },
            {
                test: /\.pcss$/,
                include: [__dirname + '/node_modules'],
                loader: ExtractTextPlugin.extract('style', 'css-loader?modules&localIdentName=[hash:hex]!postcss-loader')
            }
        ]
    },
    plugins: [
        new WebpackMd5Hash(),
        new ExtractTextPlugin('[name]-[contenthash].css', {allChunks: true}),
        new webpack.optimize.CommonsChunkPlugin('vendors', '[name]-[chunkhash].js'),
        new webpack.DefinePlugin({
            __CLIENT__: true,
            __SERVER__: false,
            __DEVELOPMENT__: false,
            __DEVTOOLS__: false,  // <-------- DISABLE redux-devtools HERE
            'process.env': {
                NODE_ENV: JSON.stringify('production'),
                CONFIG: JSON.stringify('production')
            }
        }),
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        })
    ]
});
