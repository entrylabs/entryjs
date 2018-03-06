"use strict";

const merge = require('webpack-merge');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const common = require('./webpack.common.js');

module.exports = merge(common, {
    output: {
        filename: '[name].min.js'
    },
    plugins: [
        new UglifyJSPlugin()
    ]
});