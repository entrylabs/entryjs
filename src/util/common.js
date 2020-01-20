import fetch from 'isomorphic-fetch';
import _parseInt from 'lodash/parseInt';
import _isNaN from 'lodash/isNaN';
import cuid from 'cuid';
import uid from 'uid';

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
    parseInt: (str) => {
        if (typeof str === 'number') {
            return str;
        }
        const result = _parseInt(str);
        if (_isNaN(result)) {
            return str;
        }
        return result;
    },
    generateId() {
        return uid(8) + cuid();
    },
};

module.exports = Common;
