import _find from 'lodash/find';
import _findIndex from 'lodash/findIndex';
import DataTableSource from './source/DataTableSource';
import { ModalChart, DataAnalytics } from '@entrylabs/tool';

class DataTable {
    #tables = [];
    #view;
    modal;
    selected;

    banAllBlock() {
        Entry.playground.blockMenu.banClass('analysis');
    }

    unbanBlock() {
        Entry.playground.blockMenu.unbanClass('analysis');
    }

    set view(view) {
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
        Entry.do('playgroundChangeViewMode', 'table');
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
        const json = table ? table.toJSON() : [];
        this.selected = table;
        this.dataAnalytics.setData({
            table: { ...json, tab: table.tab },
        });
    }

    #generateView() {
        this.dataAnalytics = new DataAnalytics({ container: this.#view, data: {} })
            .on('submit', (dataAnalytics) => {
                const { id, table = [[]], charts = [], title } = dataAnalytics;
                if (
                    Entry.playground.isDuplicatedTableName(
                        title,
                        _.findIndex(this.tables, (table) => table.id === id)
                    )
                ) {
                    return Entry.toast.alert(
                        Lang.DataAnalytics.duplicate_table_name_title,
                        Lang.DataAnalytics.duplicate_table_name_content
                    );
                }
                if (Entry.playground.dataTable.getSource(id)) {
                    Entry.playground.dataTable.getSource(id).setArray({
                        chart: charts,
                        fields: table[0],
                        chart: charts,
                        data: table.slice(1),
                        name: title,
                    });
                    Entry.playground.injectTable();
                }
            })
            .on('toast', (message) => {
                const { title, content } = message;
                Entry.toast.alert(title, content);
            });
    }

    getTableJSON() {
        return this.tables.filter(_.identity).map((v) => (v.toJSON ? v.toJSON() : v));
    }

    setTables(tables = []) {
        tables.forEach((table) => {
            this.addSource(table);
        });
    }

    setTableName(id, name) {
        if (!name) {
            return;
        }

        const source = this.getSource(id);
        if (!source) {
            return;
        }

        const { chart, array, fields } = source;
        source.setArray({ chart, data: array, fields, name });
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
        const tables = this.#tables.map(({ id, name }) => [name, id]);
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

    clear() {
        this.#tables = [];
        this.modal = null;
    }
}

export default new DataTable();
