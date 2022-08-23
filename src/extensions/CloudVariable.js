import io from 'socket.io-client';
import { dmet, dmetList, dmetTable, dmetVariable } from './dmet';
import singleInstance from '../core/singleInstance';

class CloudVariableExtension {
    #cvSocket = null;
    #data = null;
    #defaultData = null;

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
        if (this.#cvSocket || !this.cvServer) {
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
        return new Promise((resolve) => {
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
            socket.on('disconnect', (reason) => {
                console.log('disconnect', reason);
                if (!this.#data) {
                    this.#data = new dmet(this.#defaultData);
                }
                resolve();
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

    setDefaultData(defaultData) {
        this.#defaultData = defaultData;
        defaultData.forEach(this.#applyValue);
    }

    createDmet(object) {
        this.#data.create(object);
    }

    async create(data) {
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
