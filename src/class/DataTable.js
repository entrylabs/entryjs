import { DataAnalytics } from '@entrylabs/tool';
import _find from 'lodash/find';
import DataTableSource from './source/DataTableSource';

class DataTable {
    #tables = [];
    #view;
    constructor(view) {
        this.#view = view;
        this.#generateView();
        console.log('c');
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

    addSource(table) {
        let data = table || { name: Lang.Workspace.data_table };
        data.name = Entry.getOrderedName(data.name, this.#tables, 'name');
        const isDataTableSource = data instanceof DataTableSource;
        this.#tables.unshift(isDataTableSource ? data : new DataTableSource(data));
        Entry.playground.reloadPlayground();
    }

    removeSource({ id: targetId }) {
        this.#tables = this.#tables.filter(({ id }) => id === targetId);
        // Entry.playground.reloadPlayground();
    }

    changeItemPosition(start, end) {
        if (this.#tables.length) {
            this.#tables.splice(end, 0, this.#tables.splice(start, 1)[0]);
        }
    }

    selectTable(table) {
        console.log(table);
        const { origin } = table.toJSON();
        this.dataAnalytics.setData({
            table: origin,
        });
    }

    #generateView() {
        this.dataAnalytics = new DataAnalytics({ container: this.#view, data: {} });
    }
}

export default DataTable;
