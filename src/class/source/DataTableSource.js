import { dmetTable } from '../../extensions/dmet';
import CloudVariable from '../../extensions/CloudVariable';
import _throttle from 'lodash/throttle';
import _cloneDeep from 'lodash/cloneDeep';

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
    #copiedChart;
    summary;
    provider;
    description;
    fieldInfos;
    modals = [];
    updated = new Date();
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
            summary,
            updatedAt,
            provider,
            description,
            fieldInfos,
        } = source;
        this.#name = name;
        this.#id = id;
        this.#object = object;
        this.#source = source;
        this.#data = new dmetTable(source);
        this.#chart = chart || [];
        this.summary = summary;
        this.provider = provider;
        this.description = description;
        this.fieldInfos = fieldInfos;
        this.tab = tab;
        this.updated = updatedAt ? new Date(updatedAt) : new Date();
        // 정지시 data 초기화.
        Entry.addEventListener('stop', () => {
            this.modals = [];
            this.#data.from({
                ...source,
                data: this.#data.origin,
                fields: this.#data.originFields,
            });
            this.#copiedChart = undefined;
        });

        const apply = (force = false) => {
            if (this.modals.length > 0 && (force || this.modals.some((modal) => modal.isShow))) {
                this.modals.forEach((modal) =>
                    modal.setData({
                        source: {
                            chart: this.copiedChart,
                            fields: this.fields,
                            origin: this.rows,
                            tab: this.tab,
                            summary: this.summary,
                        },
                    })
                );
            }
        };
        this.forceApply = () => apply(true);
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

    get table() {
        return [this.fields, ...this.rows];
    }

    get origin() {
        return this.#data.origin;
    }

    get copiedChart() {
        if (!this.#copiedChart) {
            this.#copiedChart = _cloneDeep(this.#chart);
        }
        return this.#copiedChart;
    }

    get dataTable() {
        return {
            id: this.id,
            name: this.name,
            chart: this.#chart,
            table: this.table,
        };
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
        return !!(isExist === null || isExist === 0 || isExist);
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

                this.#copiedChart = this.copiedChart.map((chart) => {
                    if (chart.xIndex >= index) {
                        chart.xIndex++;
                    }
                    if (chart.yIndex >= index) {
                        chart.yIndex++;
                    }
                    for (let i = 0; i < chart.categoryIndexes.length; i++) {
                        if (chart.categoryIndexes[i] >= index) {
                            chart.categoryIndexes[i]++;
                        }
                    }
                    return chart;
                });
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
                this.#copiedChart = this.copiedChart.map((chart) => {
                    if (chart.xIndex == index) {
                        chart.xIndex = -1;
                        chart.yIndex = -1;
                        chart.categoryIndexes = [];
                    } else if (chart.xIndex > index) {
                        chart.xIndex--;
                    }
                    if (chart.yIndex == index) {
                        chart.yIndex = -1;
                        chart.categoryIndexes = [];
                    } else if (chart.yIndex > index) {
                        chart.yIndex--;
                    }
                    for (let i = 0; i < chart.categoryIndexes.length; i++) {
                        if (chart.categoryIndexes[i] == index) {
                            chart.categoryIndexes.splice(i, 1);
                            i--;
                        } else if (chart.categoryIndexes[i] > index) {
                            chart.categoryIndexes[i]--;
                        }
                    }
                    return chart;
                });
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
            summary: this.summary,
            updated: this.updated,
        };
    }

    clone() {
        return {
            name: this.#name,
            fields: [...this.fields],
            data: _cloneDeep(this.#data.origin),
            chart: [...this.#chart],
        };
    }
}

export default DataTableSource;
