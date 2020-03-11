import { dmetTable } from '../../extensions/dmet';
import CloudVariable from '../../extensions/CloudVariable';
import _throttle from 'lodash/throttle';

class DataTableSource {
    #id;
    #name;
    #data;
    #object;
    #isCloud = false;
    #cloudDate = null;
    #chart = [];
    #cloudVariable = CloudVariable.getInstance();
    #source;
    modal;
    tab = 'summary';

    constructor(source = {}) {
        const {
            name,
            id = Entry.generateHash(),
            object = null,
            chart,
            data,
            tab = 'summary',
            fields = [],
        } = source;
        this.#name = name;
        this.#id = id;
        this.#object = object;
        this.#source = source;
        this.#data = new dmetTable(source);
        this.#chart = chart || [];
        this.tab = tab;
        // 정지시 data 초기화.
        Entry.addEventListener('stop', () => {
            this.modal = null;
            this.#data.from({
                ...source,
                data: this.#data.origin,
                fields: this.#data.originFields,
            });
        });

        const apply = () => {
            if (this.modal && this.modal.isShow) {
                const find = (x) => this.fields.findIndex((y) => y === this.#data.originFields[x]);
                const chart = this.#chart.map(({ xIndex, yIndex, categoryIndexes, ...infos }) => ({
                    xIndex: find(xIndex),
                    yIndex: find(yIndex),
                    categoryIndexes: categoryIndexes.map((x) => find(x)).filter((x) => x !== -1),
                    ...infos,
                }));
                this.modal.setData({
                    source: {
                        chart,
                        fields: this.fields,
                        origin: this.rows,
                        tab: this.tab,
                    },
                });
            }
        };
        this.applyChart = _throttle(apply, 1000);
    }

    get rows() {
        return this.array.map(({ value }) => value);
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

    get chart() {
        return this.#chart;
    }

    get origin() {
        return this.#data.origin;
    }

    setArray({ chart, data, fields, name }) {
        this.#chart = chart;
        this.#name = name;
        this.#source = { ...this.#source, fields, data, name };
        this.#data.from(this.#source);
    }

    getValue(index) {
        return this.#data.getValue(index);
    }

    isExist(index) {
        const isExist = this.getValue(index);
        return !!(isExist === 0 || isExist === null || isExist);
    }

    appendRow(data) {
        return new Promise(async (resolve, reject) => {
            try {
                const appendOp = this.#data.getOperation({ type: 'appendRow', data });
                this.#data.exec(appendOp);
                resolve();
                this.applyChart();
            } catch (e) {
                reject(e);
            }
        });
    }

    appendCol(data) {
        return new Promise(async (resolve, reject) => {
            try {
                const appendOp = this.#data.getOperation({ type: 'appendCol', data });
                this.#data.exec(appendOp);
                resolve();
                this.applyChart();
            } catch (e) {
                reject(e);
            }
        });
    }

    insertRow(index, data) {
        return new Promise(async (resolve, reject) => {
            try {
                const insertOp = this.#data.getOperation({ type: 'insertRow', index, data });
                this.#data.exec(insertOp);
                resolve();
                this.applyChart();
            } catch (e) {
                reject(e);
            }
        });
    }

    insertCol(index, data) {
        return new Promise(async (resolve, reject) => {
            try {
                const insertOp = this.#data.getOperation({ type: 'insertCol', index, data });
                this.#data.exec(insertOp);
                resolve();
                this.applyChart();
            } catch (e) {
                reject(e);
            }
        });
    }

    deleteCol(index) {
        return new Promise(async (resolve, reject) => {
            try {
                const deleteOp = this.#data.getOperation({ type: 'deleteCol', index });
                this.#data.exec(deleteOp);
                resolve();
                this.applyChart();
            } catch (e) {
                reject(e);
            }
        });
    }

    deleteRow(index) {
        return new Promise(async (resolve, reject) => {
            try {
                const deleteOp = this.#data.getOperation({ type: 'deleteRow', index });
                this.#data.exec(deleteOp);
                resolve();
                this.applyChart();
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
                resolve();
                this.applyChart();
            } catch (e) {
                reject(e);
            }
        });
    }

    toJSON() {
        return {
            _id: this.#data._id,
            id: this.#id,
            project: Entry.projectId,
            fields: this.fields,
            name: this.#name,
            object: this.#object,
            data: this.array,
            origin: this.#data.origin,
            chart: this.#chart,
            isCloud: this.#isCloud,
            cloudDate: this.#cloudDate,
        };
    }
}

export default DataTableSource;
