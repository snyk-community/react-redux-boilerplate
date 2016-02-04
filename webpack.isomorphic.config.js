var WebpackIsomorphicToolsPlugin = require('webpack-isomorphic-tools/plugin');

module.exports = {
    assets: {
        styles: {
            extensions: ['pcss'],
            filter(module, regular_expression, options, log) {
                if (options.development) {
                    // in development mode there's webpack "style-loader",
                    // so the module.name is not equal to module.name
                    return WebpackIsomorphicToolsPlugin.style_loader_filter(module, regular_expression, options, log);
                } else {
                    // in production mode there's no webpack "style-loader",
                    // so the module.name will be equal to the asset path
                    return regular_expression.test(module.name);
                }
            },
            path: function(module, options, log) {
                if (options.development) {
                    // in development mode there's webpack "style-loader",
                    // so the module.name is not equal to module.name
                    return WebpackIsomorphicToolsPlugin.style_loader_path_extractor(module, options, log);
                } else {
                    // in production mode there's no webpack "style-loader",
                    // so the module.name will be equal to the asset path
                    return module.name;
                }
            },
            parser: function(module, options, log) {
                if (options.development) {
                    return WebpackIsomorphicToolsPlugin.css_modules_loader_parser(module, options, log);
                } else {
                    // in production mode there's Extract Text Loader which extracts CSS text away
                    return module.source;
                }
            }
        },
        images: {
            extensions: ['png', 'jpg', 'jpeg', 'gif', 'ico', 'svg'],
            parser: WebpackIsomorphicToolsPlugin.url_loader_parser // see Configuration and API sections for more info on this parameter
        },
        videos: {
            extensions: ['webm', 'mp4'],
            parser: WebpackIsomorphicToolsPlugin.url_loader_parser
        }
    }
};
