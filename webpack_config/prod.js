'use strict';

const merge = require('webpack-merge');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const common = require('./common.js');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = merge(common, {
    entry: {
        'entry.min': './src/entry.js',
    },
    mode: 'production',
    output: {
        chunkFilename: '[name].[contenthash].js',
        filename: '[name].js',
    },
    module: {
        rules: [],
    },
    plugins: [
        new UglifyJSPlugin({
            // uglifyOptions: {
            //     keep_fnames: true,
            // },
            include: /\.min\.js$/,
        }),
        new MiniCssExtractPlugin({
            filename: '[name].css',
            chunkFilename: '[name][contenthash].css',
        }),
    ],
});
