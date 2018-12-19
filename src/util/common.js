const axios = require('axios');
const _memoize = require('lodash/memoize');
const _assign = require('lodash/assign');

exports.callApi = _memoize((key, opt) => {
    let options = _assign({method:"GET"}, opt);
    if(EntryStatic.baseUrl) {
        options.url = EntryStatic.baseUrl + opt.url;
    }
    return axios(options);
});
