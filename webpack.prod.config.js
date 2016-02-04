var webpack   = require('webpack');
var config = require('./webpack.base.config').config;
var deepmerge = require('./webpack.base.config').deepmerge;
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = deepmerge(config, {
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
                    "presets": ['react', 'es2015', 'stage-2']
                }
            },
            {
                test: /(lib|booker|core)-ui__[a-zA-Z0-9-_\/]+\.jsx?$/,
                include: [__dirname + '/node_modules'],
                loader: 'babel-loader',
                query: {
                    "presets": ['react', 'es2015', 'stage-2']
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
        new ExtractTextPlugin('[name]-[chunkhash].css', {allChunks: true}),
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
