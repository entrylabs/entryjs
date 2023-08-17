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
    // v8 엔진에서 V8은 구조적 문제로 객체의 크기를 1.9기가로 제한.
    // optimization: {
    //     minimize: true,
    //     minimizer: [
    //         new TerserPlugin({
    //             include: /\.min\.js$/,
    //             parallel: true,
    //             terserOptions: {
    //                 ecma: 5,
    //             },
    //         }),
    //     ],
    // },
};
