'use strict';

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
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
        new MiniCssExtractPlugin({
            filename: '[name].css',
            chunkFilename: '[name][contenthash].css',
        }),
    ],
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                include: /\.min\.js$/,
                parallel: true,
                terserOptions: {
                    ecma: 5,
                },
            }),
        ],
    },
};
