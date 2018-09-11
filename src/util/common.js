const axios = require('axios');
const _memoize = require('lodash/memoize');
const _assign = require('lodash/assign');

exports.memoizeClearByTime = function(func, time) {
    if (!func.time || performance.now() - func.time > time) {
        func.cache.clear();
        func.time = performance.now();
    }
}

exports.callApi = _memoize((key, opt) => {
    return axios(_assign({method:"GET"}, opt));
})