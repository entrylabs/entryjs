import isPlainObject from 'lodash/isPlainObject';
import _mapValues from 'lodash/mapValues';
import _get from 'lodash/get';
import _cloneDeep from 'lodash/cloneDeep';
import CommonUtils, { toNumber } from '../util/common';

class dmetTable {
    constructor(array = [], id) {
        this.#id = id;
        this.from(array);
    }

    _id = undefined;
    __isUpdate = false;
    #id = '';
    #key = CommonUtils.generateId();
    #object = {};
    #array = [];
    #origin = [];
    #fields = [];
    #originFields = [];
    #info = {};
    #maxRow = 3000;
    #maxCol = 100;
    #variableType = 'table';
    #keyDelimter = '_';

    get fields() {
        return this.#fields;
    }

    get originFields() {
        return this.#originFields;
    }

    get value() {
        return this.#object;
    }

    get array() {
        return this.#array;
    }

    get isDmet() {
        return true;
    }

    get variableType() {
        return this.#variableType;
    }

    get origin() {
        return this.#origin;
    }

    setLabel(index, name) {
        this.#fields[index] = name;
    }

    #fillArray(array, length) {
        const start = array.length;
        array.length = length;
        array.fill(0, start, length);
    }

    from(data) {
        const {
            list = [],
            data: array = [],
            value,
            _id,
            id = this.#id,
            fields = [],
            ...info
        } = data;
        this.#object = {};
        this.#array = [];
        this.#origin = [];
        if (Array.isArray(array)) {
            array.forEach((row = []) => {
                if (Array.isArray(row)) {
                    const key = CommonUtils.generateId();
                    const value = row.map(toNumber);
                    this.#fillArray(value, fields.length);
                    this.#array.push({ key, value });
                    this.#object[key] = value;
                    this.#origin.push(_cloneDeep(row));
                } else if (typeof row === 'object' && row.key) {
                    const newRow = {
                        key: row.key,
                        value: row.value.map(toNumber),
                    };
                    this.#array.push(newRow);
                    this.#object[row.key] = newRow.value;
                    this.#origin.push(_cloneDeep(row.value));
                }
            });
        }
        this._id = _id;
        this.#id = id;
        this.#fields = fields;
        this.#originFields = [...fields];
        this.#info = info;
    }

    toJSON() {
        return {
            _id: this._id || undefined,
            id: this.#id,
            key: this.#key,
            data: this.#array,
            origin: this.#origin,
            fields: this.#fields,
            isDmet: true,
            variableType: this.variableType,
        };
    }

    getRow(key) {
        if (Array.isArray(key)) {
            const [row, col = 0] = key;
            const result = this.#array[row - 1] || {};
            return { ...result, x: row - 1, y: col - 1 };
        } else if (typeof key === 'number') {
            const result = this.#array[key - 1] || {};
            return { ...result, x: key - 1 };
        } else if (typeof key === 'string') {
            const [rowKey, col = 0] = key.split(this.#keyDelimter);
            return {
                key: rowKey,
                value: this.#object[rowKey],
                x: this.getIndex(rowKey),
                y: col - 1,
            };
        }
        throw { message: `not found tableData ${key} id: ${this.#id}` };
    }

    getValue(key) {
        if (typeof key === 'number') {
            return this.#array[key - 1].value;
        } else if (Array.isArray(key)) {
            const [rowKey, ...keys] = key;
            let { value: row } = this.#array[rowKey - 1] || {};
            if (rowKey === 0) {
                row = this.#fields;
            }
            if (keys.length && row) {
                return _get(row, `[${keys.map((x) => x - 1).join('][')}]`);
            } else {
                return row;
            }
        } else if (typeof key === 'string') {
            const [rowKey, ...keys] = key.split(this.#keyDelimter);
            if (keys.length) {
                return _get(this.#object[rowKey], `[${keys.map((x) => x - 1).join('][')}]`);
            }
            return this.#object[rowKey];
        }
        throw { message: `not found tableData ${key} id: ${this.#id}` };
    }

    getIndex(key) {
        if (Array.isArray(key)) {
            return key;
        } else if (typeof key === 'string') {
            const [rowKey, ...keys] = key.split(this.#keyDelimter);
            const rowIndex = this.#array.findIndex((x) => x.key === rowKey);
            if (rowIndex >= 0) {
                return [rowIndex, ...keys];
            }
        }
        return [];
    }

    #skipOperation = ['appendRow', 'appendCol', 'insertRow', 'insertCol'];

    getOperation({ type, key, index, data, newKey } = {}) {
        if (this.#skipOperation.indexOf(type) === -1 && typeof index === 'number') {
            const data = this.getRow(index);
            key = data.key;
        }
        let attach = {};
        switch (type) {
            case 'appendRow':
            case 'appendCol':
            case 'insertRow':
            case 'insertCol':
                attach = {
                    index,
                    data,
                };
                break;
            case 'deleteCol':
            case 'deleteRow':
                attach = { index };
                break;
            case 'replace':
                attach = {
                    data,
                    index,
                    newKey,
                };
                break;
        }

        return {
            _id: this._id || undefined,
            id: this.#id,
            variableType: this.variableType,
            key,
            type,
            ...attach,
        };
    }

    exec(operation) {
        const { type } = operation;
        this.__isUpdate = true;
        switch (type) {
            case 'appendCol':
                return this.#appendCol(operation);
            case 'appendRow':
                return this.#appendRow(operation);
            case 'insertRow':
                return this.#insertRow(operation);
            case 'insertCol':
                return this.#insertCol(operation);
            case 'deleteCol':
                return this.#deleteCol(operation);
            case 'deleteRow':
                return this.#deleteRow(operation);
            case 'replace':
                return this.#replace(operation);
        }
    }

    #getDefaultData(isRow = true) {
        if (isRow) {
            return new Array(this.fields.length).fill(0);
        }
        return new Array(this.#array.length).fill(0);
    }

    #getNewColName() {
        return Entry.getOrderedName(
            Lang.DataAnalytics.new_attribute,
            this.fields.map((name) => ({ name })),
            'name'
        );
    }

    #appendCol({ index, data = this.#getDefaultData(false) } = {}) {
        this.fields.push(this.#getNewColName());
        this.#array.forEach(({ value }, idx) => {
            value.push(0);
        });
        return this.getOperation({ type: 'appendCol', index, data });
    }

    #insertCol({ index, data = this.#getDefaultData(false) } = {}) {
        if (index < 1 || index > this.fields.length + 1) {
            throw { message: `error: insertCol ${index}` };
        }
        this.fields.splice(index - 1, 0, this.#getNewColName());
        this.#array.forEach(({ value }, idx) => {
            value.splice(index - 1, 0, 0);
        });
        return this.getOperation({ type: 'insertCol', index, data });
    }

    #deleteCol({ index }) {
        if (!index) {
            throw { message: `error: deleteCol : ${index}` };
        }
        this.fields.splice(index - 1, 1);
        this.#array.forEach(({ value }, idx) => {
            value.splice(index - 1, 1);
        });
        return this.getOperation({ type: 'deleteCol', index });
    }

    #appendRow({ key = CommonUtils.generateId(), data = this.#getDefaultData() } = {}) {
        const index = this.#array.length + 1;
        if (Array.isArray(data)) {
            this.#object[key] = data;
            this.#array.splice(index, 0, { key, value: data });
        } else {
            console.warn('appendRow : ', key, data);
        }
        return this.getOperation({ type: 'appendRow', key, index, data });
    }

    #insertRow({ key = CommonUtils.generateId(), index, data = this.#getDefaultData() } = {}) {
        const value = toNumber(data);
        if (Array.isArray(data) || index > this.#array.length + 1 || index < 0) {
            if (index === 0) {
                const fields = [...data];
                data = [...this.#fields];
                this.#fields = fields;
                index = 1;
            }
            this.#object[key] = Array.isArray(data) ? data : [value];
            this.#array.splice(index - 1, 0, { key, value: this.#object[key] });
        } else {
            console.warn('insert row : ', key, data, index);
        }
        return this.getOperation({ type: 'insertRow', key, index, data: value });
    }

    #deleteRow({ key, index }) {
        if (index === 0) {
            index = 1;
            const { value: row } = this.getRow(index);
            this.#fields = [...row];
        }
        if (!key) {
            key = index;
        }
        const { value: row, key: objKey, x, y } = this.getRow(key);
        if (!row || (y > -1 && !row[y])) {
            throw { message: 'not found data' };
        }
        if (y > -1) {
            delete row[y];
        } else {
            delete this.#object[objKey];
            this.#array.splice(x, 1);
        }
        return this.getOperation({ type: 'deleteRow', key });
    }

    #replace({ key, index, data, newKey = CommonUtils.generateId() }) {
        const value = toNumber(data);
        if (!key) {
            key = index;
        }
        const { value: row, key: objKey, x, y } = this.getRow(key);
        if (x === -1) {
            this.#fields[y] = value;
        } else {
            if (!row) {
                throw { message: `not found row ${y}` };
            }
            row[y] = value;
        }
        return this.getOperation({ type: 'replace', key, index, data: value, newKey });
    }
}

class dmetList {
    constructor(array = [], id) {
        this.#id = id;
        this.from(array);
    }

    _id = undefined;
    __isUpdate = false;
    #id = '';
    #key = CommonUtils.generateId();
    #object = {};
    #array = [];
    #info = {};
    #variableType = 'list';

    get value() {
        return this.#array;
    }

    get array() {
        return this.#array;
    }

    get isDmet() {
        return true;
    }

    get id() {
        return this.#id;
    }

    get key() {
        return this.#key;
    }

    get variableType() {
        return this.#variableType;
    }

    set #data(array) {
        this.#array = array.map((data) => {
            const key = CommonUtils.generateId();
            const item = {
                key,
                data,
            };
            this.#object[key] = item;
            return item;
        });
    }

    from(data) {
        if (Array.isArray(data)) {
            this.#data = data;
        } else if (data.isDmet || isPlainObject(data)) {
            const { list = [], array = [], value, _id, id = this.#id, ...info } = data;
            if (data.array && Array.isArray(array)) {
                this.#array = array;
                this.#array.map((value) => {
                    const { key } = value;
                    this.#object[key] = value;
                });
            } else if (Array.isArray(list) && isPlainObject(value)) {
                this.#array = list.map((key) => {
                    const data = {
                        key,
                        data: value[key],
                    };
                    this.#object[key] = data;
                    return data;
                });
            } else {
                this.#array = [];
                this.#object = {};
            }
            this._id = _id;
            this.#id = id;
            this.#info = info;
        } else if ('toJSON' in data) {
            const plainObject = data.toJSON();
            const { array = [], _id, id = this.#id, ...info } = plainObject;
            this.#array = array;
            this._id = _id;
            this.#id = id;
            this.#info = info;
            this.#array.map((value) => {
                const { key } = value;
                this.#object[key] = value;
            });
        } else {
            throw 'data is wrong.';
        }
    }

    get(key) {
        if (typeof key === 'number') {
            return this.#array[key];
        } else if (typeof key === 'string') {
            return this.#object[key];
        }
    }

    getIndex(key) {
        if (typeof key === 'number') {
            return key;
        } else if (typeof key === 'string') {
            const oldData = this.#object[key];
            return this.#array.indexOf(oldData);
        } else {
            return 0;
        }
    }

    #skipOperation = ['append', 'insert'];

    getOperation({ type, key, index, data, newKey } = {}) {
        if (this.#skipOperation.indexOf(type) === -1 && typeof index === 'number') {
            const data = this.get(index);
            key = data.key;
        }
        let attach = {};
        switch (type) {
            case 'append':
                attach = {
                    data,
                };
                break;
            case 'insert':
                attach = {
                    index,
                    data,
                };
                break;
            case 'delete':
                attach = { index };
                break;
            case 'replace':
                attach = {
                    data,
                    newKey,
                };
                break;
        }

        return {
            _id: this._id || undefined,
            id: this.#id,
            variableType: this.variableType,
            key,
            type,
            ...attach,
        };
    }

    exec(operation) {
        const { type } = operation;
        this.__isUpdate = true;
        switch (type) {
            case 'append':
                return this.#append(operation);
            case 'insert':
                return this.#insert(operation);
            case 'delete':
                return this.#delete(operation);
            case 'replace':
                return this.#replace(operation);
        }
    }

    toJSON() {
        return {
            _id: this._id || undefined,
            id: this.#id,
            key: this.#key,
            array: this.#array,
            isDmet: true,
            variableType: this.variableType,
        };
    }

    #append({ key, data } = {}) {
        if (!key) {
            key = CommonUtils.generateId();
        }
        const newData = {
            key,
            data,
        };
        this.#object[key] = newData;
        this.#array.push(newData);
        return this.getOperation({ type: 'append', key, index: -1, data });
    }

    #insert({ key, index, data } = {}) {
        if (!key) {
            key = CommonUtils.generateId();
        }
        const newData = {
            key,
            data,
        };
        this.#object[key] = newData;
        this.#array.splice(index, 0, newData);
        return this.getOperation({ type: 'insert', key, index, data });
    }

    #delete({ key, index }) {
        try {
            if (!key) {
                key = index;
            }
            const oldData = this.get(key);
            if (!oldData) {
                throw { message: 'not found data' };
            }
            const oldIndex = this.getIndex(key);
            delete this.#object[oldData.key];
            this.#array.splice(oldIndex, 1);
            return this.getOperation({ type: 'delete', key });
        } catch (e) {}
    }

    #replace({ key, data, newKey = CommonUtils.generateId() }) {
        try {
            const item = this.get(key);
            if (!item) {
                throw { message: 'not found data' };
            }
            delete this.#object[item.key];
            item.key = newKey;
            item.data = data;
            this.#object[newKey] = item;
            return this.getOperation({ type: 'replace', key, data, newKey });
        } catch (e) {}
    }
}

class dmetVariable {
    constructor(variable = '', id) {
        this.#id = id;
        this.from(variable);
    }

    _id = undefined;
    #id = '';
    #key = CommonUtils.generateId();
    #info = {};
    #value = '';
    #variableType = 'variable';

    get value() {
        return this.#value;
    }

    get id() {
        return this.#id;
    }

    get key() {
        return this.#key;
    }

    get variableType() {
        return this.#variableType;
    }

    toJSON() {
        return {
            ...this.#info,
            _id: this._id || undefined,
            id: this.#id,
            key: this.#key,
            value: this.value,
            isDmet: true,
            variableType: this.variableType,
        };
    }

    from(data) {
        if (typeof data === 'string') {
            this.#value = data;
        } else if (data.isDmet || isPlainObject(data)) {
            const { value = '', _id, id = this.#id, ...info } = data;
            this.#value = value;
            this._id = _id;
            this.#id = id;
            this.#info = info;
        } else if ('toJSON' in data) {
            const plainObject = data.toJSON();
            const { value = '', _id, id = this.#id, ...info } = plainObject;
            this.#value = value;
            this._id = _id;
            this.#id = id;
            this.#info = info;
        } else {
            throw 'data is wrong.';
        }
    }

    get() {
        return this.#value;
    }

    #set(operation) {
        const { value } = operation;
        this.#value = value;
        return operation;
    }

    getOperation({ type, value } = {}) {
        switch (type) {
            case 'set':
                return {
                    _id: this._id,
                    id: this.#id,
                    variableType: this.variableType,
                    type,
                    value,
                };
        }
    }

    exec(operation) {
        const { type } = operation;
        switch (type) {
            case 'set':
                return this.#set(operation);
        }
    }
}

class dmetSlideVariable extends dmetVariable {
    constructor(variable, id) {
        variable.variableType = 'slide';
        super(variable, id);
    }
}

class dmet {
    constructor(variables, options) {
        this.from(variables, options);
    }

    #original = { list: {}, variable: {} };
    #id = CommonUtils.generateId();
    #list = {};
    #variable = {};
    #table = {};

    get list() {
        return this.#list;
    }

    get variable() {
        return this.#variable;
    }

    get table() {
        return this.#table;
    }

    get id() {
        return this.#id;
    }

    get isDmet() {
        return true;
    }

    get original() {
        return this.#original;
    }

    #objectToJSON(object) {
        for (const key in object) {
            object[key] = object[key].toJSON();
        }
        return object;
    }

    toJSON() {
        return {
            id: this.#id,
            list: this.list,
            table: this.table,
            variable: this.variable,
            isDmet: true,
        };
    }

    from(variables = []) {
        if (Array.isArray(variables)) {
            variables.forEach((variable) => {
                const { variableType } = variable;
                if (variableType === 'variable') {
                    const result = new dmetVariable(variable);
                    this.#variable[result.id] = result;
                } else if (variableType === 'slide') {
                    const result = new dmetSlideVariable(variable);
                    this.#variable[result.id] = result;
                } else if (variableType === 'list') {
                    const result = new dmetList(variable);
                    this.#list[result.id] = result;
                } else if (variableType === 'table') {
                    const result = new dmetTable(variable);
                    this.#table[result.id] = result;
                }
            });
        } else if (isPlainObject(variables) && variables.isDmet) {
            this.#list = _mapValues(variables.list, (list) => new dmetList(list));
            this.#variable = _mapValues(
                variables.variable,
                (variable) => new dmetVariable(variable)
            );
            this.#table = _mapValues(variables.table, (list) => new dmetTable(list));
            this.#id = variables.id;
        }
    }

    get({ variableType, id }) {
        switch (variableType) {
            case 'variable':
                return this.#variable[id];
            case 'slide':
                return this.#variable[id];
            case 'list':
                return this.#list[id];
            case 'table':
                return this.#table[id];
            case 'default':
                return undefined;
        }
    }

    create(object) {
        const { id, variableType } = object;
        if (!id) {
            throw 'not found ID';
        }
        if (variableType === 'variable') {
            this.#variable[id] = new dmetVariable(object);
        } else if (variableType === 'slide') {
            this.#variable[id] = new dmetSlideVariable(object);
        } else if (variableType === 'list') {
            this.#list[id] = new dmetList(object);
        } else if (variableType === 'table') {
            this.#table[id] = new dmetTable(object);
        }
    }

    #subscriber = new Map();

    subscribe(key, callback) {
        this.#subscriber.set(key, callback);
    }

    unsubscribe(key) {
        this.#subscriber.delete(key, callback);
    }

    notify(...args) {
        for (const observer of this.#subscriber.values()) {
            observer(...args);
        }
    }

    exec(operation) {
        try {
            const { id, variableType } = operation;
            if (variableType === 'variable') {
                return this.#variable[id].exec(operation);
            } else if (variableType === 'slide') {
                return this.#variable[id].exec(operation);
            } else if (variableType === 'list') {
                return this.#list[id].exec(operation);
            } else if (variableType === 'table') {
                return this.#table[id].exec(operation);
            }
        } finally {
            this.notify();
        }
    }
}

export { dmetList, dmetVariable, dmet, dmetTable };
