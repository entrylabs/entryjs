import io from 'socket.io-client';
import _uniq from 'lodash/uniq';
import _uniqBy from 'lodash/uniqBy';
import { dmet, dmetVariable, dmetList } from './dmet';
import singleInstance from '../core/singleInstance';

class CloudVariableExtension {
    #cvSocket = null;
    #data = null;
    #defaultData = null;
    #disabled = {};

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
        this.setStatus('offline', target);
        this.#cvSocket.emit('changeMode', 'offline', target);
    }

    enable(target) {
        if (!this.#cvSocket) {
            return;
        }
        this.setStatus('online', target);
        this.#cvSocket.emit('changeMode', 'online', target);
    }

    setStatus(mode = 'offline', target) {
        const isOffline = mode === 'offline';
        if (target) {
            this.#disabled[target] = isOffline;
        } else {
            Object.keys(this.#disabled).forEach(key => this.#disabled[key] = isOffline);
        }
    }

    async connect(cvServer) {
        if (this.#cvSocket || !this.cvServer) {
            return;
        }
        const { url, query } = this.cvServer;
        const socket = io(url, {
            query: {
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
            socket.on('welcome', (variables = []) => {
                this.#convertToUniqList(variables).forEach((item) => {
                    this.#disabled[item.id] = !!item.isOffline;
                });
                console.log('welcome', variables, this.#disabled);
                try {
                    this.#data = new dmet(variables);
                } catch (e) {
                    console.warn(e);
                }
                resolve();
            });
            socket.on('disconnect', (reason) => {
                console.log('disconnect', reason);
                this.#data = new dmet(this.#defaultData);
                resolve();
            });
            socket.on('changeMode', (mode, target) => {
                const isOffline = mode == 'offline';
                if (target) {
                    this.#disabled[target] = isOffline;
                } else {
                    Object.keys(this.#disabled).forEach(key => this.#disabled[key] = isOffline);
                }
                resolve();
            });
        });
    }

    setDefaultData(defaultData) {
        this.#defaultData = this.#convertToUniqList(defaultData);
        console.log(this.#defaultData);
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
        }
        // Entry.dispatchEvent('saveVariable');
    }

    #convertToUniqList(data) {
        return data.map((item) => {
            if (item.list) {
                item.list = _uniq(item.list);
            }
            if (item.array) {
                item.array = _uniqBy(item.array, 'key');
            }
            return item;
        });
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

    #run(operation) {
        return new Promise((resolve) => {
            if (this.#cvSocket.connected && !this.#disabled[operation.id]) {
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
        if (!this.#disabled[operation.id]) {
            this.#data.exec(operation);
            this.#applyValue(operation);
        }
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
            if (list) {
                const { array } = this.get(operation);
                list.array_ = array;
                list.updateView();
            }
        }
    }

    set(target, value) {
        if (!this.#cvSocket) {
            return;
        }
        const variable = this.#data.get(target);
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
        dmetList.from(array.map(({data}) => data));
    }

    append(target, data) {
        if (!this.#cvSocket) {
            return;
        }
        const variable = this.#data.get(target);
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
