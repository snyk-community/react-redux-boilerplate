var defaultConfig = require('./default');
var localConfig = {};

if (process.env.CONFIG) {
    try {
        localConfig = require('./' + process.env.CONFIG);
    } catch (e) {
        console.error('Do you have ' + process.env.CONFIG + ' config?', e);
    }
} else {
    console.error('Supply correct CONFIG env variable');
}

module.exports = Object.assign({}, defaultConfig, localConfig);
