import { DataAnalytics } from '@entrylabs/tool';
import _find from 'lodash/find';
import _findIndex from 'lodash/findIndex';
import DataTableSource from './source/DataTableSource';
import { ModalChart } from '@entrylabs/tool';

class DataTable {
    #tables = [];
    #view;
    modal;
    container;

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
        let data = table || { name: Lang.Workspace.data_table };
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
        this.dataAnalytics.addListener('modified', () => {
            console.log('MODI RECEPTED');
            Entry.do('editDataTable');
        });
    }

    undo() {
        this.dataAnalytics.undo();
    }

    redo() {
        this.dataAnalytics.redo();
    }

    getTableJSON() {
        return this.tables.filter(_.identity).map((v) => (v.toJSON ? v.toJSON() : v));
    }

    setTables(tables = []) {
        tables.forEach((table) => {
            this.addSource(table);
        });
    }

    showChart(tableId) {
        this.closeChart();
        const source = this.getSource(tableId);
        if (!source.modal) {
            source.modal = this.createChart(source);
        }
        source.modal.show();
        this.modal = source.modal;
    }

    closeChart() {
        if (this.modal && this.modal.isShow) {
            this.modal.hide();
        }
    }

    createChart(source) {
        const tables = this.#tables.map(({ id, name }) => ([name, id]));
        const container = Entry.Dom('div', {
            class: 'entry-table-chart',
            parent: $('body'),
        })[0];
        return new ModalChart({
            data: {
                tables,
                source,
                setTable: (selected) => {
                    const [tableName, tableId] = selected;
                    this.showChart(tableId);
                },
            },
            container,
        });
    }
}

export default DataTable;
