import debug from 'debug';

global.myDebug = debug;

export default function(namespace) {
    let ns;
    if (namespace === undefined) {
        ns = 'app';
    } else {
        ns = 'app:' + namespace;
    }

    return {
        debug: debug(ns + ':debug'),
        info: debug(ns + ':info'),
        warn: debug(ns + ':warn'),
        error: debug(ns + ':error')
    };
}
