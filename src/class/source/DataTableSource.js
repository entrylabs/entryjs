import { dmetTable } from '../../extensions/dmet';
import CloudVariable from '../../extensions/CloudVariable';

class DataTableSource {
    #id;
    #name;
    #data;
    #originData;
    #object;
    #isCloud = false;
    #cloudDate = null;
    #cloudVariable = CloudVariable.getInstance();

    constructor(source = {}) {
        const { name, id = Entry.generateHash(), object = null } = source;
        this.#name = name;
        this.#id = id;
        this.#object = object;
        this.#data = new dmetTable(source);
        this.#originData = this.#data.toJSON();
        // 정지시 data 초기화.
        Entry.addEventListener('stop', () => {
            console.log('init tableVariable');
            this.#data.from(source);
        });
    }

    get id() {
        return this.#id;
    }

    get name() {
        return this.#name;
    }

    set name(name) {
        this.#name = name;
    }

    get fields() {
        return this.#data.fields;
    }

    get array() {
        const { array } = this.#data;
        return array;
    }

    getValue(index) {
        return this.#data.getValue(index);
    }

    appendValue(index, data) {
        return new Promise(async (resolve, reject) => {
            try {
                const appendOp = this.#data.getOperation({ type: 'append', index, data });
                this.#data.exec(appendOp);
                resolve();
            } catch (e) {
                reject(e);
            }
        });
    }

    deleteValue(index) {
        return new Promise(async (resolve, reject) => {
            try {
                const deleteOp = this.#data.getOperation({ type: 'delete', index });
                this.#data.exec(deleteOp);
            } catch (e) {
                reject(e);
            }
        });
    }

    insertValue(index, data) {
        return new Promise(async (resolve, reject) => {
            try {
                const insertOp = this.#data.getOperation({ type: 'insert', index, data });
                this.#data.exec(insertOp);
            } catch (e) {
                reject(e);
            }
        });
    }

    replaceValue(index, data) {
        return new Promise(async (resolve, reject) => {
            try {
                const replaceOp = this.#data.getOperation({ type: 'replace', index, data });
                this.#data.exec(replaceOp);
            } catch (e) {
                reject(e);
            }
        });
    }

    toJSON() {
        return {
            id: this.#id,
            name: this.#name,
            isCloud: this.#isCloud,
            cloudDate: this.#cloudDate,
            object: this.#object,
            data: this.#originData,
        };
    }
}

export default DataTableSource;
