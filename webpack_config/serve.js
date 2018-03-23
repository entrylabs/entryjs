'use strict';

const merge = require('webpack-merge');
const common = require('./common.js');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = merge(common, {
    mode: 'development',
    module: {
        rules: [
            {
                test: /\.less$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        {
                            loader: 'css-loader',
                            options: {
                                url: false,
                                minimize: true,
                                sourceMap: true,
                            },
                        },
                        {
                            loader: 'less-loader',
                            options: {
                                sourceMap: false,
                            },
                        },
                    ],
                }),
            },
        ],
    },
    devServer: {
        contentBase: './',
        port: 8080,
        historyApiFallback: {
            index: '/example/example.html',
            open: true,
            rewrites: [
                { from: /^\/$/, to: '/example/example.html' },
                { from: /^\/lib\/entryjs/, to: '/' },
                { from: /./, to: '/views/404.html' },
            ],
        },
        proxy: {
            '/lib/entryjs': {
                target: 'http://localhost:8080',
                pathRewrite: { '^/lib/entryjs': '' },
            },
        },
    },
    devtool: 'source-map',
});
