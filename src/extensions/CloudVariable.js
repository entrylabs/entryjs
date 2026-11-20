import io from 'socket.io-client';
import { dmet, dmetList, dmetTable, dmetVariable } from './dmet';
import singleInstance from '../core/singleInstance';

// welcome 없이 끊기는 접속을 몇 번까지 다시 시도할지
const MAX_RECONNECT_WITHOUT_WELCOME = 2;
// 순번이 빈 연산을 기다리는 시간(ms). 서버 프로세스가 여러 개라 연산이 순서가 바뀌어 도착할 수 있다.
const SEQ_GAP_WAIT = 1500;

class CloudVariableExtension {
    #cvSocket = null;
    #data = null;
    #defaultData = null;
    // 서버가 이 작품의 실시간 변수 접속을 막았는지 여부. 한번 막히면 같은 페이지에서는 다시 접속하지 않는다.
    #blocked = false;
    // 서버가 welcome 을 나눠 보낼 때(welcome:begin ~ welcome:end) 받고 있는 값. 받는 중이 아니면 null.
    #incoming = null;
    // 접속한 뒤 welcome 을 다 받기 전에 온 action. 다 받은 뒤에 적용한다. 모으는 중이 아니면 null.
    // 나눠 받을 때는 서버가 값을 읽기 전에 방에 먼저 넣어 주므로, 읽는 동안 다른 사용자가 바꾼 내용이 여기로 온다.
    #pending = null;
    // 서버가 연산마다 붙이는 순번 가운데 마지막으로 적용한 것. 0 이면 순번을 붙이지 않는 서버다.
    #seq = 0;
    // 리스트마다, 받은 값에 이미 반영돼 있는 마지막 순번. 이 순번 이하의 연산은 적용하지 않는다.
    #snapshotSeq = {};
    // 앞 순번이 아직 오지 않아 미뤄 둔 연산 (순번 → { operation, done })
    #held = new Map();
    #gapTimer = null;

    get data() {
        return this.#data;
    }

    setServerInfo(cvServer) {
        this.cvServer = cvServer;
    }

    disable(target) {
        if (!this.#cvSocket) {
            return;
        }
        this.#cvSocket.emit('changeMode', 'offline', target);
    }

    enable(target) {
        if (!this.#cvSocket) {
            return;
        }
        this.#cvSocket.emit('changeMode', 'online', target);
    }

    async connect(cvServer) {
        if (this.#blocked || this.#cvSocket || !this.cvServer) {
            return;
        }
        const { url, query, type } = this.cvServer;
        const socket = io(url, {
            path: '/cv',
            query: {
                type,
                q: query,
                // 큰 작품을 한 번에 받지 않고 나눠 받는다. 지원하지 않는 서버는 무시하고 welcome 하나로 보낸다.
                stream: 1,
            },
            transports: ['websocket'],
            reconnectionAttempts: 2,
            timeout: 5000,
        });
        socket.on('action', (operation) => {
            if (this.#pending) {
                this.#pending.push(operation);
                return;
            }
            this.#receive(operation);
        });
        socket.on('create', this.#createVariable.bind(this));
        socket.on('reset', (variables) => {
            try {
                this.#data = new dmet(variables);
            } catch (e) {
                console.warn(e);
            }
        });

        this.#pending = [];
        this.#cvSocket = socket;
        // welcome 을 받지 못한 채 끊긴 횟수. 재접속에 성공하면 reconnectionAttempts 가 초기화되므로 따로 센다.
        let isWelcomed = false;
        let failCount = 0;
        return new Promise((resolve) => {
            socket.on('connect', () => {
                isWelcomed = false;
                this.#incoming = null;
                this.#pending = [];
            });
            socket.on('connect_error', () => {
                console.log('connect_error');
                if (!this.#data) {
                    try {
                        this.#data = new dmet(this.#defaultData);
                    } catch (e) {
                        console.warn(e);
                    }
                    resolve();
                }
            });
            socket.on('check', (id) => {
                socket.emit('imAlive', id);
            });
            const onWelcome = ({ variables = [], isOffline, seq = 0, snapshotSeq = {} }) => {
                isWelcomed = true;
                failCount = 0;
                try {
                    this.#data = new dmet(variables);
                    variables.forEach(this.#applyValue);
                } catch (e) {
                    console.warn(e);
                }
                this.#resetSeq(seq, snapshotSeq);
                const operations = this.#pending || [];
                this.#pending = null;
                operations.forEach((operation) => {
                    try {
                        if (this.#seq && operation.seq) {
                            this.#receive(operation);
                        } else if (!this.#isApplied(operation)) {
                            this.#execDmet(operation);
                        }
                    } catch (e) {
                        console.warn(e);
                    }
                });
                if (isOffline) {
                    socket.close();
                }
                resolve();
            };
            socket.on('welcome', (data) => onWelcome(data));
            // 나눠 받는 welcome: begin(리스트 항목을 뺀 값) → chunk(리스트 항목) → end
            socket.on('welcome:begin', ({ variables = [], isOffline, seq } = {}) => {
                const lists = {};
                variables.forEach((variable) => {
                    if (variable.variableType === 'list') {
                        variable.array = [];
                        lists[variable.id] = variable.array;
                    }
                });
                this.#incoming = { variables, isOffline, lists, seq, snapshotSeq: {} };
            });
            socket.on('welcome:chunk', ({ id, seq, keys = [], values = [] } = {}, ack) => {
                const array = this.#incoming?.lists[id];
                if (array) {
                    this.#incoming.snapshotSeq[id] = seq;
                    for (let i = 0; i < keys.length; i++) {
                        array.push({ key: keys[i], data: values[i] });
                    }
                }
                // 받았다고 답해야 서버가 다음 조각을 보낸다.
                if (typeof ack === 'function') {
                    ack();
                }
            });
            socket.on('welcome:end', () => {
                const incoming = this.#incoming;
                this.#incoming = null;
                if (incoming) {
                    onWelcome(incoming);
                }
            });
            // 데이터가 너무 크거나 운영자가 막은 작품은 서버가 welcome 대신 blocked 를 보내고 접속을 끊는다.
            socket.on('blocked', ({ reason } = {}) => {
                this.#blocked = true;
                this.#notifyBlocked(reason);
                // 전송 계층이 먼저 끊기면 자동 재접속이 일어나므로, 서버가 끊기를 기다리지 않고 직접 닫는다.
                // 닫으면 아래 disconnect 처리가 불려 기본값으로 동작한다.
                socket.close();
            });
            socket.on('disconnect', (reason) => {
                console.log('disconnect', reason);
                this.#incoming = null;
                if (!this.#data) {
                    this.#data = new dmet(this.#defaultData);
                }
                resolve();
                if (!isWelcomed && ++failCount > MAX_RECONNECT_WITHOUT_WELCOME) {
                    socket.close();
                }
            });
            socket.on('changeMode', (mode, target) => {
                const isOffline = mode === 'offline';
                if (isOffline) {
                    socket.close();
                }
                resolve();
            });
        });
    }

    #notifyBlocked(reason) {
        const isSizeLimit = reason === 'items' || reason === 'bytes';
        const message = isSizeLimit
            ? Lang?.Workspace?.real_time_blocked_by_size ||
              'The real-time variables and lists of this project hold too much data ' +
                  'to connect to the server.\nTheir values will not be stored in the server.'
            : Lang?.Workspace?.real_time_blocked ||
              'This project cannot connect to the real-time variable server.\n' +
                  'Values of real-time variables and lists will not be stored in the server.';
        Entry.toast?.alert(Lang?.Msgs?.warn || 'Warning', message, true);
    }

    setDefaultData(defaultData) {
        this.#defaultData = defaultData;
        defaultData.forEach(this.#applyValue);
    }

    createDmet(object) {
        this.#data.create(object);
    }

    async create(data) {
        if (this.#blocked) {
            return;
        }
        if (!this.#cvSocket) {
            await this.connect();
        }
        const { id_, type, name } = data;
        if (type === 'variable') {
            await this.#createVariable(name, id_);
        } else if (type === 'list') {
            await this.#createList(name, id_);
        } else if (type === 'table') {
            await this.#createTable(name, id_);
        }
        // Entry.dispatchEvent('saveVariable');
    }

    #createVariable(name, id) {
        if (!this.#cvSocket) {
            return;
        }
        const variable = new dmetVariable(
            {
                name,
            },
            id
        );
        return new Promise((resolve) => {
            this.#cvSocket.emit('create', variable, (isCreate, variable) => {
                if (isCreate) {
                    this.createDmet(variable);
                }
                resolve();
            });
        });
    }

    #createList(name, id) {
        if (!this.#cvSocket) {
            return;
        }
        const list = new dmetList(
            {
                name,
            },
            id
        );
        return new Promise((resolve) => {
            this.#cvSocket.emit('create', list, (isCreate, list) => {
                if (isCreate) {
                    this.createDmet(list);
                }
                resolve();
            });
        });
    }

    #createTable(name, id) {
        if (!this.#cvSocket) {
            return;
        }
        const table = new dmetTable(
            {
                name,
            },
            id
        );
        return new Promise((resolve) => {
            this.#cvSocket.emit('create', table, (isCreate, table) => {
                if (isCreate) {
                    this.createDmet(table);
                }
                resolve();
            });
        });
    }

    #run(operation) {
        return new Promise((resolve) => {
            if (this.#cvSocket.connected) {
                this.#cvSocket.emit('action', operation, (isUpdate, operation) => {
                    if (!isUpdate) {
                        resolve();
                    } else if (this.#pending) {
                        // 다시 접속해 값을 새로 받는 중이다. 지금 화면에 적용하고, 새로 받을 값에도 반영되게 모아 둔다.
                        this.#pending.push(operation);
                        this.#execDmet(operation);
                        resolve();
                    } else {
                        // 내 연산도 순번대로 적용한다. 적용된 뒤에 끝난 것으로 본다.
                        this.#receive(operation, resolve);
                    }
                });
            } else {
                this.#execDmet(operation);
                resolve();
            }
        });
    }

    #resetSeq(seq, snapshotSeq) {
        clearTimeout(this.#gapTimer);
        this.#gapTimer = null;
        this.#held.forEach(({ done }) => done?.());
        this.#held.clear();
        this.#seq = seq || 0;
        this.#snapshotSeq = snapshotSeq;
    }

    // 다른 사용자의 연산과 내 연산의 결과를 서버가 붙인 순번대로 적용한다.
    // 도착한 순서대로 적용하면 사용자마다 리스트 순서나 변수의 마지막 값이 달라질 수 있다.
    // 순번이 없으면(예전 서버) 도착한 순서대로 적용한다.
    #receive(operation, done) {
        const { seq } = operation;
        if (!this.#seq || !seq) {
            this.#execDmet(operation);
            done?.();
            return;
        }
        if (seq <= this.#seq || this.#held.has(seq)) {
            done?.();
            return;
        }
        this.#held.set(seq, { operation, done });
        this.#drain();
    }

    // 미뤄 둔 연산을 순번이 이어지는 데까지 적용한다.
    // skipGap 이면 빈 순번 하나를 건너뛴다. 방송이 유실됐을 때 뒤 연산이 끝없이 밀리지 않게 한다.
    #drain(skipGap = false) {
        clearTimeout(this.#gapTimer);
        this.#gapTimer = null;
        let canSkip = skipGap;
        while (this.#held.size) {
            let next = this.#seq + 1;
            if (!this.#held.has(next)) {
                if (!canSkip) {
                    break;
                }
                next = Math.min(...this.#held.keys());
            }
            canSkip = false;
            const { operation, done } = this.#held.get(next);
            this.#held.delete(next);
            this.#seq = next;
            try {
                // 받은 값에 이미 반영된 연산은 순번만 넘긴다.
                if (!(next <= this.#snapshotSeq[operation.id])) {
                    this.#execDmet(operation);
                }
            } catch (e) {
                console.warn(e);
            }
            done?.();
        }
        if (this.#held.size) {
            this.#gapTimer = setTimeout(() => this.#drain(true), SEQ_GAP_WAIT);
        }
    }

    // (순번을 붙이지 않는 서버용) welcome 을 받기 전에 온 추가·삽입이 받은 값에 이미 들어 있는지 확인한다.
    // 서버가 값을 읽기 직전에 실행된 연산은 받은 값에도 있고 action 으로도 와서, 그대로 적용하면 항목이 둘이 된다.
    // 삭제·교체는 대상 키가 없으면 아무 일도 하지 않으므로 따로 거르지 않는다.
    #isApplied(operation) {
        const { variableType, type, key } = operation;
        if (variableType !== 'list' || (type !== 'append' && type !== 'insert') || !key) {
            return false;
        }
        return !!this.#data?.get(operation)?.get(key);
    }

    #execDmet(operation) {
        this.#data.exec(operation);
        this.#applyValue(operation);
    }

    #applyValue(operation) {
        const { id, value, data, variableType } = operation;
        if (variableType === 'variable' || variableType === 'slide') {
            const variable = Entry.variableContainer.getVariable(id);
            if (variable) {
                variable.value_ = value;
                variable._valueWidth = null;
                variable.updateView();
            }
        } else if (variableType === 'list') {
            const list = Entry.variableContainer.getList(id);
            if (!list) {
                return;
            }
            if (this && this.get) {
                const { array } = this.get(operation);
                list.array_ = array;
            } else if (operation.array) {
                list.array_ = operation.array;
            } else if (operation.list) {
                list.array_ = operation.list.map((key) => ({ data: operation.value[key] }));
            }
            list.updateView();
        }
    }

    set(target, value) {
        if (!this.#cvSocket) {
            return;
        }
        const variable = this.#data && this.#data.get(target);
        if (!variable) {
            return;
        }
        const operation = variable.getOperation({
            type: 'set',
            value,
        });
        return this.#run(operation);
    }

    get(target) {
        return this.#data && this.#data.get(target);
    }

    // 워크스페이스에서만 동작하는 함수이기 때문에 run 생략
    setArray(target, array) {
        const dmetList = this.#data && this.#data.get(target);
        if (!dmetList) {
            console.error('no target ', target);
        }
        dmetList.from(array.map(({ data }) => data));
    }

    append(target, data) {
        if (!this.#cvSocket) {
            return;
        }
        const variable = this?.#data?.get(target);
        if (!variable) {
            return;
        }
        const operation = variable.getOperation({
            type: 'append',
            data,
        });
        return this.#run(operation);
    }

    insert(target, index, data) {
        if (!this.#cvSocket) {
            return;
        }
        const variable = this.#data.get(target);
        if (!variable) {
            return;
        }
        const operation = variable.getOperation({
            type: 'insert',
            index,
            data,
        });
        return this.#run(operation);
    }

    delete(target, index) {
        if (!this.#cvSocket) {
            return;
        }
        const variable = this.#data.get(target);
        if (!variable) {
            return;
        }
        const operation = variable.getOperation({
            type: 'delete',
            index,
        });
        return this.#run(operation);
    }

    replace(target, index, data) {
        if (!this.#cvSocket) {
            return;
        }
        const variable = this.#data.get(target);
        if (!variable) {
            return;
        }
        const operation = variable.getOperation({
            type: 'replace',
            index,
            data,
        });
        return this.#run(operation);
    }
}

export default singleInstance(CloudVariableExtension);
