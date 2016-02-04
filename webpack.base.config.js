var webpack = require('webpack');
var WebpackIsomorphicToolsPlugin = require('webpack-isomorphic-tools/plugin');
var deepMerge = require('deep-merge');

// PostCSS
var autoprefixer = require('autoprefixer');
var nested = require('postcss-nested');
var verticalrhythm = require('postcss-vertical-rhythm');
var vars = require('postcss-simple-vars');
var coloralpha = require('postcss-color-alpha');
var flexbugs = require('postcss-flexbugs-fixes');

var webpackIsomorphicToolsPlugin = new WebpackIsomorphicToolsPlugin(require('./webpack.isomorphic.config')).development(process.env.NODE_ENV !== 'production');


module.exports.deepmerge = deepMerge(function(target, source, key) {
    if (target instanceof Array) {
        return [].concat(target, source);
    }
    return source;
});

module.exports.config = {
    context: __dirname,
    entry:  {
        main: [
            './app/index'
        ]
    },
    output: {
        path: __dirname + '/public/build',
        publicPath: '/public/build/',
        filename: '[name]-[hash].js',
        chunkFilename: '[name]-[chunkhash].js'
    },
    resolve: {
        root: __dirname + '/app',
        extensions: ['', '.js', '.jsx', '.json']
    },
    module: {
        loaders: [
            {
                test: /\.eot?$|\.woff?$|\.ttf?$/,
                loader: 'file-loader?name=[name].[hash].[ext]'
            },
            {
                test: /\.webm$|\.mp4$/,
                loader: 'file-loader'
            },
            {
                test: webpackIsomorphicToolsPlugin.regular_expression('images'),
                loader: 'url-loader?limit=10240'
            },
            {
                test: /\.json/,
                loader: 'json-loader'
            }
        ]
    },
    postcss: function() {
        return [
            vars,
            nested,
            verticalrhythm,
            coloralpha,
            flexbugs,
            autoprefixer({browsers: ['last 2 version']})
        ];
    },
    plugins: [
        new webpack.NoErrorsPlugin(),
        webpackIsomorphicToolsPlugin
    ],
    progress: true,
    target: 'web'
};

