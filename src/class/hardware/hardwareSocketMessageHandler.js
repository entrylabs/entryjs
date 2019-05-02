/**
 * 엔트리 하드웨어와 엔트리 워크스페이스간 통신을 정리한 클래스
 * action, data(payload) 를 메세지로 받는다..
 * action
 * - state { statement: String } : 현재 상태를 정의한다. 하드웨어의 연결 상태 체크용
 * - init { name: String } : 하드웨어 프로그램에 모듈을 다운받도록 요청
 * - TODO [default] { anyObject for data handle }: 이전의 hw.js 에 있는 로직을 그대로 복사. 수정요
 */
export default class {
    constructor(socket) {
        this.socket = socket;
        this.listeners = [];
        socket.on('message', this._onAction.bind(this));
    }

    _onAction(message) {
        const { action, data } = message;
        switch (action) {
            case 'state':
                this._onStateAction(data);
                break;
            case 'init':
                this._onInitAction(data);
                break;
            default:
                this._onDefaultAction(data);
        }
    }

    _onStateAction({ statement }) {
        this.dispatchEvent('state', statement);
    }

    _onInitAction({ name }) {
        this.dispatchEvent('init', name);
    }

    /**
     * 1.7.0 이전 하드웨어 버전의 원활한 통신을 위해 남겨두어야 한다.
     * @param data
     * @private
     */
    _onDefaultAction(data) {
        if (data) {
            let portData = {};
            if (typeof data === 'string') {
                switch (data) {
                    case 'disconnectHardware': {
                        this.dispatchEvent('disconnect');
                        return;
                    }
                    default: {
                        portData = JSON.parse(data);
                        break;
                    }
                }
            } else if (_.isObject(data)) {
                portData = data;
            }
            this.dispatchEvent('data', portData);
        }
    }

    addEventListener(type, callback) {
        if (!(type in this.listeners)) {
            this.listeners[type] = [];
        }
        this.listeners[type].push(callback);
    }

    removeEventListener(type, callback) {
        if (!(type in this.listeners)) {
            return;
        }
        const stack = this.listeners[type];
        for (let i = 0, l = stack.length; i < l; i++) {
            if (stack[i] === callback) {
                stack.splice(i, 1);
                return;
            }
        }
    }

    dispatchEvent(eventName, ...args) {
        if (!(eventName in this.listeners)) {
            return true;
        }
        const stack = this.listeners[eventName].slice();

        for (let i = 0, l = stack.length; i < l; i++) {
            stack[i].call(this, ...args);
        }
    }
}
