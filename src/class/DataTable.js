import { DataAnalytics } from '@entrylabs/tool';
import _find from 'lodash/find';
import _findIndex from 'lodash/findIndex';
import DataTableSource from './source/DataTableSource';
import CommonUtils from '../util/common';

const defalutValue = {
    name: Lang.Workspace.data_table,
    fields: [1],
    data: [{ key: CommonUtils.generateId(), value: [0] }],
};

class DataTable {
    #tables = [];
    #view;

    constructor(view) {
        this.#view = view;
        this.#generateView();
    }

    get tables() {
        return this.#tables;
    }

    getSource(id) {
        if (!id) {
            console.warn('empty argument');
            return null;
        }
        return _find(this.#tables, { id });
    }

    getIndex({ id }) {
        if (!id) {
            console.warn('empty argument');
            return null;
        }
        return _findIndex(this.#tables, { id });
    }

    addSource(table) {
        let data = table || defalutValue;
        data.name = Entry.getOrderedName(data.name, this.#tables, 'name');
        const isDataTableSource = data instanceof DataTableSource;
        Entry.do('dataTableAddSource', isDataTableSource ? data : new DataTableSource(data));
    }

    removeSource(table) {
        Entry.do('dataTableRemoveSource', table);
    }

    changeItemPosition(start, end) {
        if (this.#tables.length) {
            this.#tables.splice(end, 0, this.#tables.splice(start, 1)[0]);
        }
    }

    selectTable(table) {
        this.dataAnalytics.setData({
            table: table.toJSON(),
        });
    }

    #generateView() {
        this.dataAnalytics = new DataAnalytics({ container: this.#view, data: {} });
    }
}

export default DataTable;
