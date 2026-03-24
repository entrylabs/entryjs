'use strict';

const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const autoprefixer = require('autoprefixer');

module.exports = {
    mode: 'development',
    entry: {
        entry: './src/entry.js',
    },
   output: {
    path: path.resolve(__dirname, 'dist'),   // ← 여기 쉼표 빠져있던 거 고침
    publicPath: '/dist/',
    filename: '[name].js',
    clean: false,          // ← 이 줄 추가! (가장 중요)
},

    module: {
        rules: [
            {
                enforce: 'pre',
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'eslint-loader',
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
                test: /\.(css|less)$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        {
                            loader: 'css-loader',
                            options: {
                                url: false,
                                sourceMap: false,
                            },
                        },
                        {
                            loader: require.resolve('postcss-loader'),
                            options: {
                                ident: 'postcss',
                                plugins: () => [
                                    require('postcss-flexbugs-fixes'),
                                    require('cssnano')({ preset: 'default' }),
                                    autoprefixer({
                                        overrideBrowserslist: [
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
    plugins: [
        new ExtractTextPlugin({
            filename: 'entry.css',
        }),
    ],
};
