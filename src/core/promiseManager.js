module.exports = class PromiseManager {
    // default timeout value
    get timeout() {
        return 30000;
    }

    setPromiseTimer(resolve, reject, option) {
        const { timeout = this.timeout, defaultValue } = option;
        return setTimeout(() => {
            if (Entry.engine.state === 'run') {
                if (defaultValue !== undefined) {
                    resolve(defaultValue);
                } else {
                    reject('timeout');
                }
            }
        }, timeout);
    }

    /**
     * sample code
     * Entry.addEventListener('callApi', ({url}, resolve, reject) => {
     *     $.ajax(url).then((...args) => {
     *         console.log(args);
     *         resolve('asd');
     *     }).fail(() => {
     *         reject()
     *     });
     * });
     */
    async EventPromise(key, data, option) {
        return this.Promise((resolve, reject) => {
            const { defaultValue } = option;
            const t = this.setPromiseTimer(resolve, reject, option);
            Entry.dispatchEvent(
                key,
                data,
                (value) => {
                    clearTimeout(t);
                    resolve(value);
                },
                (value) => {
                    clearTimeout(t);
                    if (defaultValue !== undefined) {
                        resolve(defaultValue);
                    } else {
                        reject(value);
                    }
                }
            );
        });
    }

    Promise(f) {
        return new Promise((resolve, reject) => {
            const callback = (data) => {
                if (Entry.engine.state !== 'run') {
                    reject(new Entry.Utils.AsyncError('Engine 정지'));
                } else {
                    resolve(data);
                }
            };
            f(callback, reject);
        });
    }
};
