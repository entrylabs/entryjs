import fetch from 'isomorphic-fetch';

const _memoize = require('lodash/memoize');
const _assign = require('lodash/assign');

const Common = {
    toQueryString: (obj) =>
        encodeURI(
            Object.keys(obj)
                .map((k) => `${k}=${obj[k]}`)
                .join('&')
        ),
    callApi: _memoize(async (key, opt) => {
        const options = _assign(
            {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
            },
            opt
        );
        if (typeof options.data !== 'string') {
            options.body = JSON.stringify(options.data);
        }
        const queryString = options.params ? `?${Common.toQueryString(options.params)}` : '';
        const response = await fetch(
            `${EntryStatic.baseUrl || ''}${options.url}${queryString}`,
            options
        );
        if (response.status >= 400) {
            Common.callApi.cache = new _memoize.Cache();
            throw new Error(response);
        }
        const data = await response.json();
        return { data };
    }),
};

module.exports = Common;
