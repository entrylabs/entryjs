import _find from 'lodash/find';
import _findIndex from 'lodash/findIndex';
import DataTableSource from './source/DataTableSource';
import { DataAnalytics, ModalChart } from '@entrylabs/tool';

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

    getTables(blockList = []) {
        return _.union(
            blockList
                .filter((block) => {
                    const { _schema = {}, data = {} } = block || {};
                    if (!data.type) {
                        return false;
                    }
                    const { isFor, isNotFor = [] } = _schema;
                    const [key] = isNotFor;
                    return key && isFor && key === 'analysis';
                })
                .map((block) => {
                    const { params = [] } = block.data || {};
                    return params.filter((param) => {
                        if (typeof param !== 'string') {
                            return false;
                        }
                        return _find(this.#tables, { id: param });
                    });
                })
                .flat()
        ).map((tableId) => {
            const table = this.getSource(tableId);
            return table.toJSON();
        });
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

    addSource(table, shouldTableMode = true) {
        const isWorkspace = Entry.type === 'workspace';
        if (shouldTableMode && isWorkspace) {
            Entry.do('playgroundChangeViewMode', 'table');
        }
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

    async selectTable(table = {}) {
        if (this.tempDataAnalytics) {
            const temp = { ...this.tempDataAnalytics };
            const confirm = await entrylms.confirm(Lang.Menus.save_modified_table);
            if (confirm) {
                const result = this.saveTable(temp);
                if (!result) {
                    return;
                }
            }
        }
        const json = table.toJSON && table.toJSON();
        const { tab } = table;
        this.selected = table;
        this.dataAnalytics.setData({
            table: { ...json, tab },
        });
        delete table.tab;
        delete this.tempDataAnalytics;
        return table;
    }

    saveTable = (dataAnalytics) => {
        const { id, table = [[]], charts = [], title } = dataAnalytics;
        if (!title) {
            Entry.toast.alert(
                Lang.DataAnalytics.fail_save_table,
                Lang.DataAnalytics.empty_table_name_content
            );
            return;
        }
        if (
            Entry.playground.isDuplicatedTableName(
                title,
                _.findIndex(this.tables, (table) => table.id === id)
            )
        ) {
            Entry.toast.alert(
                Lang.DataAnalytics.fail_save_table,
                Lang.DataAnalytics.duplicate_table_name_content
            );
            return;
        }
        const source = this.getSource(id);
        if (source) {
            source.modal = null;
            source.setArray({
                chart: charts,
                fields: table[0],
                data: table.slice(1),
                name: title,
            });
            Entry.playground.injectTable();
        }
        Entry.toast.success(
            Lang.DataAnalytics.saved_table_title,
            Lang.DataAnalytics.saved_table_content
        );
        delete this.tempDataAnalytics;
        Entry.playground.reloadPlayground();
        return true;
    };

    #generateView() {
        this.dataAnalytics = new DataAnalytics({ container: this.#view, data: {} })
            .on('submit', this.saveTable)
            .on('toast', (message) => {
                const { title, content } = message;
                Entry.toast.alert(title, content);
            })
            .on('change', (dataAnalytics) => {
                this.tempDataAnalytics = dataAnalytics;
            });
    }

    getTableJSON() {
        return this.tables.filter(_.identity).map((v) => (v.toJSON ? v.toJSON() : v));
    }

    setTables(tables = []) {
        tables.forEach((table) => {
            this.addSource(table, false);
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
