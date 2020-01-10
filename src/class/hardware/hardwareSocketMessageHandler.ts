import { isObject } from 'lodash';

/**
 * 엔트리 하드웨어 -> 엔트리 워크스페이스간 통신을 정리한 클래스
 * action, data(payload) 를 메세지로 받는다.
 * action
 * - state { statement: String } : 현재 상태를 정의한다. 하드웨어의 연결 상태 체크용
 * - init { name: String } : 현재 연결된 하드웨어의 모듈명을 전달 받고, 서버에서 블록데이터를 받아온다.
 * - default { anyObject for data handle }: 이전의 hw.js 에 있는 로직을 그대로 복사. 과거 코드 대응
 *   - disconnect : 이전 disconnectHardware 와 동일
 */

type EntryHardwareSocketMessage = {
    action: string;
    data: any;
};

export default class {
    private socket: SocketIOClient.Socket;
    private readonly listeners: { [type: string]: any };

    constructor(socket: SocketIOClient.Socket) {
        this.socket = socket;
        this.listeners = [];
        socket.on('message', this._onAction.bind(this));
    }

    _onAction(message: EntryHardwareSocketMessage) {
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

    /**
     * 현재 하드웨어 연결 상태를 표기한다.
     * connected 의 경우 어떤 하드웨어와 연결되었는지 표기된다.
     * @param statement {string} 하드웨어 연결상태
     * @param args
     * @private
     */
    _onStateAction({ statement, args }: any) {
        const [name] = args;
        this.dispatchEvent('state', statement, name);
    }

    _onInitAction({ name }: any) {
        this.dispatchEvent('init', name);
    }

    /**
     * 1.7.0 이전 하드웨어 버전의 원활한 통신을 위해 남겨두어야 한다.
     * @param data
     * @private
     */
    _onDefaultAction(data: any) {
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
            } else if (isObject(data)) {
                portData = data;
            }
            this.dispatchEvent('data', portData);
        }
    }

    addEventListener(type: string, callback: (...args: any[]) => void) {
        if (!(type in this.listeners)) {
            this.listeners[type] = [];
        }
        this.listeners[type].push(callback);
    }

    removeEventListener(type: string, callback: () => void) {
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

    dispatchEvent(eventName: string, ...args: any[]) {
        if (!(eventName in this.listeners)) {
            return true;
        }
        const stack = this.listeners[eventName].slice();

        for (let i = 0, l = stack.length; i < l; i++) {
            stack[i].call(this, ...args);
        }
    }
}
