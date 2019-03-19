'use strict';

const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');

module.exports = {
    entry: {
        entry: './src/entry.js',
    },
    output: {
        path: path.resolve('./dist'),
        publicPath: '/dist/',
        filename: '[name].js',
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.json'],
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'webpack-strip-block',
                        options: {
                            start: 'IGNORE_WEBPACK:START',
                            end: 'IGNORE_WEBPACK:END',
                        },
                    },
                    {
                        loader: 'babel-loader',
                    },
                ],
            },
            {
                test: /\.(ico|png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot|cur)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: 'url-loader',
                options: {
                    name: '[hash].[ext]',
                    limit: 10000,
                },
            },
            {
                test: /\.tsx?$/,
                loader: 'awesome-typescript-loader',
            },
        ],
    },
    externals: {
        react: 'React',
        'react-dom': 'ReactDOM',
    },
    plugins: [
        new CleanWebpackPlugin(['dist'], {
            root: path.join(__dirname, '..'),
        }),
        new ManifestPlugin(),
        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            filename: '[name].css',
            chunkFilename: '[id].css',
        }),
    ],
    // optimization: {
    //     runtimeChunk: 'single',
    //     // splitChunks: {
    //     //     chunks: 'all',
    //     //     // cacheGroups: {
    //     //     //     vendor: {
    //     //     //         name: 'vendors',
    //     //     //         chunks: 'all',
    //     //     //     },
    //     //     // },
    //     // },
    // },
};
