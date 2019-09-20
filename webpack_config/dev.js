'use strict';

const merge = require('webpack-merge');
const common = require('./common.js');

module.exports = merge(common, {
    mode: 'development',
    module: {
        rules: [],
    },
    devtool: 'cheap-source-map',
});
