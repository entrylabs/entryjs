import fetch from 'isomorphic-fetch';
import _isNaN from 'lodash/isNaN';
import _toNumber from 'lodash/toNumber';
import _isNumber from 'lodash/isNumber';
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
        const fetchPromise = fetch(`${Entry.baseUrl || ''}${options.url}${queryString}`, options);
        const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Request timeout')), 3000)
        );
        try {
            const response = await Promise.race([fetchPromise, timeoutPromise]);
            if (response.status >= 400) {
                Common.callApi.cache = new _memoize.Cache();
                throw new Error(response);
            }
            const data = await response.json();
            return { data };
        } catch (error) {
            Common.callApi.cache = new _memoize.Cache();
            throw error;
        }
    }),
    toNumber: (str) => {
        if (typeof str === 'number') {
            return str;
        }
        if (Array.isArray(str)) {
            return str.map((x) => Common.toNumber(x));
        }
        if (!_isNaN(parseInt(str, 10)) && !_isNaN(_toNumber(str))) {
            return _toNumber(str);
        }
        return str;
    },
    generateId() {
        return _uid(8) + _cuid();
    },
};

module.exports = Common;
