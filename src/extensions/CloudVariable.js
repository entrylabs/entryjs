import io from 'socket.io-client';
import { dmet, dmetList, dmetTable, dmetVariable } from './dmet';
import singleInstance from '../core/singleInstance';

// welcome 없이 끊기는 접속을 몇 번까지 다시 시도할지
const MAX_RECONNECT_WITHOUT_WELCOME = 2;

class CloudVariableExtension {
    #cvSocket = null;
    #data = null;
    #defaultData = null;
    // 서버가 이 작품의 실시간 변수 접속을 막았는지 여부. 한번 막히면 같은 페이지에서는 다시 접속하지 않는다.
    #blocked = false;

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
            },
            transports: ['websocket'],
            reconnectionAttempts: 2,
            timeout: 5000,
        });
        socket.on('action', this.#execDmet.bind(this));
        socket.on('create', this.#createVariable.bind(this));
        socket.on('reset', (variables) => {
            try {
                this.#data = new dmet(variables);
            } catch (e) {
                console.warn(e);
            }
        });

        this.#cvSocket = socket;
        // welcome 을 받지 못한 채 끊긴 횟수. 재접속에 성공하면 reconnectionAttempts 가 초기화되므로 따로 센다.
        let isWelcomed = false;
        let failCount = 0;
        return new Promise((resolve) => {
            socket.on('connect', () => {
                isWelcomed = false;
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
            socket.on('welcome', ({ variables = [], isOffline }) => {
                isWelcomed = true;
                failCount = 0;
                try {
                    this.#data = new dmet(variables);
                    variables.forEach(this.#applyValue);
                } catch (e) {
                    console.warn(e);
                }
                if (isOffline) {
                    socket.close();
                }
                resolve();
            });
            // 데이터가 너무 크거나 운영자가 막은 작품은 서버가 welcome 대신 blocked 를 보내고 접속을 끊는다.
            socket.on('blocked', ({ reason } = {}) => {
                this.#blocked = true;
                if (!this.#data) {
                    try {
                        this.#data = new dmet(this.#defaultData);
                    } catch (e) {
                        console.warn(e);
                    }
                }
                resolve();
                // 전송 계층이 먼저 끊기면 자동 재접속이 일어나므로, 서버가 끊기를 기다리지 않고 직접 닫는다.
                socket.close();
                this.#notifyBlocked(reason);
            });
            socket.on('disconnect', (reason) => {
                console.log('disconnect', reason);
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
                    if (isUpdate) {
                        this.#data.exec(operation);
                        resolve(operation);
                    } else {
                        resolve();
                    }
                });
            } else {
                this.#data.exec(operation);
                resolve(operation);
            }
        }).then((operation) => {
            if (operation) {
                this.#applyValue(operation);
            }
        });
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
