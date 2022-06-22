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
     * 입력한 time 만큼 일시정지한다.
     * pause 상태인 경우 로직을 수행하지 않고 멈춘다.
     * 시간은 그대로 흐르기 때문에 timeout 후 재시작하면 다음블록이 바로 실행된다.
     * 
     * @param time 일시정지할 ms
     */
    sleep(time) {
        return new Promise((resolve) => {
            setTimeout(async() => {
                await waitWhilePause();
                resolve();
            }, time);
        });

        function waitWhilePause() {
            return new Promise((resolve) => {
                if (Entry.engine.state !== 'pause') {
                    resolve();
                }

                const polling = setInterval(() => {
                    if (Entry.engine.state !== 'pause') {
                        window.clearInterval(polling);
                        resolve();
                    }
                }, 1000 / Entry.FPS);
            });
        }
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
