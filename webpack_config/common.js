"use strict";

var path = require('path');

module.exports = {
    entry: {
        entry: './src/entry.js'
    },
    output: {
        path: path.resolve('./dist'),
        publicPath: '/dist/',
        filename: '[name].js'
    },
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /node_modules/,
            use: [
                {
                    loader: 'webpack-strip-block',
                    options: {
                        start: 'IGNORE_WEBPACK:START',
                        end: 'IGNORE_WEBPACK:END'
                    },
                },
                {
                    loader: "babel-loader"
                }
            ]
        }]
    },
    plugins: []
};
