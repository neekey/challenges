const path = require('path');
const ENV = process.env.NODE_DEV;
const webpack = require('webpack');

const BUILD_DIR = path.resolve(__dirname, '../build');
const PLUGINS = [];
const PAGE_ENTRIES = {
    index: path.resolve(__dirname, '../src/index.js')
};

if (ENV === 'development') {
    PAGE_ENTRIES['webpack-dev-server'] = 'webpack/hot/dev-server';
}

if (ENV === 'production') {
    PLUGINS.push(new webpack.optimize.UglifyJsPlugin({
        compress: {
            warnings: false,
        },
        output: {
            comments: false,
        },
    }));
}

module.exports = {
    entry: PAGE_ENTRIES,
    output: {
        path: BUILD_DIR,
        filename: '[name].js',
    },
    module: {
        loaders: [
            {
                test: /\.css$/, // Only .css files
                loader: 'style!css', // Run both loaders
            },
            {
                test: /\.scss$/,
                loader: 'style!css!sass',
            },
            {
                test: /\.json$/,
                loader: 'json',
            },
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel',
                query: {
                    presets: [ 'es2015' ],
                    plugins: [
                        'babel-plugin-transform-object-rest-spread',
                        'transform-class-properties' ]
                }
            },
        ],
    },
    plugins: PLUGINS
};
