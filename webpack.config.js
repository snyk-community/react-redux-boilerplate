var devConfig  = require('./webpack.dev.config');
var prodConfig = require('./webpack.prod.config');

var prod = !!process.argv.find(function(el, i, arr){
    if (el === '-p') return true;
});
var config = null;

if (prod) {
    config = prodConfig
} else {
    config = devConfig;
}

module.exports = config;
