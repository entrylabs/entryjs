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
        let data = table || { name: '데이터 테이블' };
        data.name = Entry.getOrderedName(data.name, this.#tables, 'name');
        if (!(data instanceof DataTableSource)) {
            data = new DataTableSource(data);
        }

        this.#tables.unshift(data);
        Entry.playground.reloadPlayground();
    }

    removeSource({ id: targetId }) {
        this.#tables = this.#tables.filter(({ id }) => id === targetId);
        // Entry.playground.reloadPlayground();
    }

    #generateView() {
        this.dataAnalytics = new DataAnalytics({ container: this.#view });
    }
}

export default DataTable;
