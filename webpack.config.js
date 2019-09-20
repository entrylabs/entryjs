'use strict';

let conf;

switch (process.env.NODE_ENV) {
    case 'production':
        conf = require('./webpack_config/prod');
        break;
    case 'lint':
        conf = require('./webpack_config/lint');
        break;
    case 'serve':
    case 'serve-mini':
        conf = require('./webpack_config/serve');
        break;
    case 'development':
    default:
        conf = require('./webpack_config/dev');
        break;
}

module.exports = conf;
