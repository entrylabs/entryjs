import fetch from 'isomorphic-fetch';
import _isNaN from 'lodash/isNaN';
import _toNumber from 'lodash/toNumber';
import _cuid from 'cuid';
import _uid from 'uid';

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
        const response = await fetch(`${Entry.baseUrl || ''}${options.url}${queryString}`, options);
        if (response.status >= 400) {
            Common.callApi.cache = new _memoize.Cache();
            throw new Error(response);
        }
        const data = await response.json();
        return { data };
    }),
    toNumber: (str) => {
        if (typeof str === 'number') {
            return str;
        }
        if (Array.isArray(str)) {
            return str.map((x) => Common.toNumber(x));
        }
        const result = _toNumber(str);
        if (_isNaN(result)) {
            return str;
        }
        return result;
    },
    generateId() {
        return _uid(8) + _cuid();
    },
};

module.exports = Common;
