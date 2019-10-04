import io from 'socket.io-client';
import { dmet, dmetVariable, dmetList } from './dmet';
import singleInstance from '../core/singleInstance';
import { runInContext } from 'vm';

class CloudVariableExtension {
    #cvSocket = null;
    #data = null;
    #defaultData = null;

    get data() {
        return this.#data;
    }

    async connect(cvServer) {
        if (this.#cvSocket) {
            return;
        }
        const { url, query } = cvServer;
        const socket = io(url, {
            query: {
                q: query,
            },
            reconnectionAttempts: 2,
            timeout: 5000,
        });
        socket.on('action', this.#execDmet.bind(this));
        socket.on('create', this.#createVariable.bind(this));
        socket.on('disconnect', (reason) => {
            this.#data = null;
        });
        this.#cvSocket = socket;
        return new Promise((resolve) => {
            socket.on('connect_error', () => {
                if (!this.#data) {
                    try {
                        this.#data = new dmet(this.#defaultData);
                    } catch (e) {
                        console.warn(e);
                    }
                    resolve();
                }
            });
            socket.on('welcome', (variables) => {
                try {
                    this.#data = new dmet(variables);
                } catch (e) {
                    console.warn(e);
                }
                resolve();
            });
        });
    }

    setDefaultData(defaultData) {
        this.#defaultData = defaultData;
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
            if (this.#cvSocket.connected) {
                this.#cvSocket.emit('action', operation, (isUpdate, operation) => {
                    if (isUpdate) {
                        this.#data.exec(operation);
                    }
                    resolve(operation);
                });
            } else {
                this.#data.exec(operation);
                resolve(operation);
            }
        }).then((operation) => {
            const { id, value } = operation;
            const variable = Entry.variableContainer.getVariable(id);
            variable.value_ = value;
            variable._valueWidth = null;
            variable.updateView();
        });
    }

    #execDmet(operation) {
        this.#data.exec(operation);
        const { id, value } = operation;
        const variable = Entry.variableContainer.getVariable(id);
        variable.value_ = value;
        variable._valueWidth = null;
        variable.updateView();
    }

    set(target, value) {
        if (!this.#cvSocket) {
            return;
        }
        const variable = this.#data.get(target);
        const operation = variable.getOperation({
            type: 'set',
            value,
        });
        return this.#run(operation);
    }

    get(target) {
        return this.#data && this.#data.get(target);
    }

    insert(target, index, value) {
        if (!this.#cvSocket) {
            return;
        }
        const variable = this.#data.get(target);
        const operation = variable.getOperation({
            type: 'insert',
            index,
            value,
        });
        return this.#run(operation);
    }

    delete(target, index) {
        if (!this.#cvSocket) {
            return;
        }
        const variable = this.#data.get(target);
        const operation = variable.getOperation({
            type: 'delete',
            index,
        });
        return this.#run(operation);
    }

    replace(target, index, value) {
        if (!this.#cvSocket) {
            return;
        }
        const variable = this.#data.get(target);
        const operation = variable.getOperation({
            type: 'replace',
            index,
            value,
        });
        return this.#run(operation);
    }
}

export default singleInstance(CloudVariableExtension);
