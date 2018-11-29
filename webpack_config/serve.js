'use strict';

const merge = require('webpack-merge');
const common = require('./common.js');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const autoprefixer = require('autoprefixer');

module.exports = merge(common, {
    mode: 'development',
    module: {
        rules: [
            {
                test: /\.(css|less)$/,
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
                }),
            },
        ],
    },
    devServer: {
        contentBase: './',
        port: 8080,
        historyApiFallback: {
            index: '/example/example.html',
            rewrites: [
                { from: /^\/$/, to: '/example/example.html' },
                { from: /^\/lib\/entryjs/, to: '/' },
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
