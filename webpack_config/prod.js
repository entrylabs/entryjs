"use strict";

const merge = require('webpack-merge');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const common = require('./common.js');

module.exports = merge(common, {
    output: {
        filename: '[name].min.js'
    },
    plugins: [
        new UglifyJSPlugin()
    ]
});