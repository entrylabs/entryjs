const webpack = require('webpack');

module.exports = {
    mode: 'development',
    module: {
        rules: [],
    },
    devtool: 'cheap-source-map',
    plugins: [
        new webpack.ProgressPlugin({
            activeModules: true, // display the current module
        }),
    ],
    stats: {
        logging: 'verbose',
    },
    infrastructureLogging: {
        level: 'verbose',
    },
    parallelism: 1,
};
