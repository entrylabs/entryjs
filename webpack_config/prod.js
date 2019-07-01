'use strict';

const merge = require('webpack-merge');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const common = require('./common.js');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const autoprefixer = require('autoprefixer');

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
        rules: [
            {
                test: /\.(css|less)$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            // you can specify a publicPath here
                            // by default it use publicPath in webpackOptions.output
                            publicPath: '../',
                        },
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            url: false,
                            minimize: true,
                            sourceMap: false,
                        },
                    },
                    {
                        loader: require.resolve('postcss-loader'),
                        options: {
                            ident: 'postcss',
                            plugins: () => [
                                require('postcss-flexbugs-fixes'),
                                autoprefixer({
                                    browsers: [
                                        '>1%',
                                        'last 4 versions',
                                        'Firefox ESR',
                                        'not ie < 9', // React doesn't support IE8 anyway
                                    ],
                                    flexbox: 'no-2009',
                                    remove: false,
                                }),
                            ],
                        },
                    },
                    {
                        loader: 'less-loader',
                        options: {
                            sourceMap: false,
                        },
                    },
                ],
            },
        ],
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
