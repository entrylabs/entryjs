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
    devtool: 'source-map',
});
