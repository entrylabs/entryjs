'use strict';

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const isWebGLEnabled = process.argv.some(
    (arg) => arg.startsWith('--webgl') && arg.split('=')[1] === 'true'
);
const templateName = (() => {
    if (process.env.NODE_ENV === 'serve') {
        return isWebGLEnabled ? 'example_webgl.ejs' : 'example.ejs';
    } else {
        return 'example_mini.ejs';
    }
})();
const template = path.resolve('example', templateName);
const devServerPort = 8080;

class LogHtmlWebpackPluginFiles {
    apply(compiler) {
        compiler.hooks.compilation.tap('LogHtmlWebpackPluginFiles', (compilation) => {
            HtmlWebpackPlugin.getHooks(compilation).afterTemplateExecution.tap(
                'LogHtmlWebpackPluginFiles',
                (data) => {
                    console.log('LogHtmlWebpackPluginFiles', data);
                }
            );
        });
    }
}

module.exports = {
    mode: 'development',
    module: {
        rules: [],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template,
            title: 'Entry Example',
            filename: path.resolve('dist', 'index.html'),
            inject: false,
            hash: true,
        }),
        new LogHtmlWebpackPluginFiles(),
    ],
    devServer: {
        static: {
            directory: path.join(__dirname, '../'),
        },
        port: devServerPort,
        historyApiFallback: true,
        devMiddleware: {
            publicPath: '/',
        },
        proxy: {
            '/lib/entry-js': {
                target: `http://localhost:${devServerPort}`,
                pathRewrite: { '^/lib/entry-js': '' },
            },
            '/dist': {
                target: `http://localhost:${devServerPort}`,
                pathRewrite: { '^/dist': '' },
            },
        },
    },
    devtool: 'source-map',
};
