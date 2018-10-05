const axios = require('axios');
const _memoize = require('lodash/memoize');
const _assign = require('lodash/assign');

exports.callApi = _memoize((key, opt) => {
    return axios(_assign({method:"GET"}, opt));
})