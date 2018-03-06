'use strict';

var conf;

switch (process.env.NODE_ENV) {
    case 'production':
        conf = require('./webpack_config/prod');
        break;
    case 'development':
    default:
        conf = require('./webpack_config/dev');
        break;
}

module.exports = conf;
