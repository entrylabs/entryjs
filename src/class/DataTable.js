import _map from 'lodash/map';
import _find from 'lodash/find';
import _uniq from 'lodash/uniq';
import _filter from 'lodash/filter';
import _flatten from 'lodash/flatten';
import _cloneDeep from 'lodash/cloneDeep';
import _findIndex from 'lodash/findIndex';
import DataTableSource from './source/DataTableSource';
import { DataAnalytics, ModalChart } from '@entrylabs/tool';

class DataTable {
    #tables = [];
    #view;
    modal;
    selected;

    get tables() {
        return this.#tables;
    }

    get dataTables() {
        return _map(this.#tables, ({ id, fields, chart, name, origin, summary }) => ({
            id,
            name,
            summary,
            chart: _cloneDeep(chart),
            table: [[...fields], ..._cloneDeep(origin)],
        }));
    }

    constructor() {
        this.#generateView();
    }

    removeAllBlocks() {
        const { blocks } = EntryStatic.getAllBlocks().find(
            ({ category }) => category === 'analysis'
        );
        blocks.forEach((blockType) => {
            Entry.Utils.removeBlockByType(blockType);
        });
        this.banAllBlock();
        this.clear();
    }

    banAllBlock() {
        Entry.playground.blockMenu.banClass('analysis');
    }

    unbanBlock() {
        Entry.playground.blockMenu.unbanClass('analysis');
    }

    getTables(blockList = []) {
        return _uniq(
            _flatten(
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
            )
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

    addSource(table) {
        let data = table || { name: Lang.Workspace.data_table };
        data.name = Entry.getOrderedName(data.name, this.#tables, 'name');

        this.#tables.push(table instanceof DataTableSource ? table : new DataTableSource(table));
        this.hide();
        this.show({ list: this.dataTables, selectedIndex: this.dataTables.length - 1 });
    }

    addSources(tables = []) {
        const dataTableSources = _map(tables, (table) =>
            table instanceof DataTableSource ? table : new DataTableSource(table)
        );
        this.#tables.push(...dataTableSources);
        this.hide();
        this.show({ list: this.dataTables, selectedIndex: this.dataTables.length - 1 });
    }

    changeItemPosition(start, end) {
        if (this.#tables.length) {
            this.#tables.splice(end, 0, this.#tables.splice(start, 1)[0]);
        }
    }
    setSource({ chart, table, name, id }) {
        const { chart, table, name, id } = selected;
        const source = this.getSource(id);
        if (source) {
            source.modal = null;
            source.setArray({
                name,
                chart,
                fields: table[0],
                data: table.slice(1),
            });
            source.updated = new Date();
        }
    }

    saveTable = ({ selected }) => {
        this.setSource(selected);
        Entry.playground.reloadPlayground();
    };

    removeTable = (index) => {
        this.#tables = _filter(this.#tables, (__, tIndex) => index !== tIndex);
    };

    show(data) {
        if (!this.dataAnalytics) {
            this.#generateView();
        }
        this.dataAnalytics.show(
            data || { selectedIndex: this.#tables.legnth - 1, list: this.dataTables }
        );
    }

    hide() {
        this.dataAnalytics && this.dataAnalytics.hide();
        if (this.#tables.length) {
            this.unbanBlock();
        } else {
            this.banAllBlock();
        }
        Entry.playground.reloadPlayground();
        Entry.playground.refreshPlayground();
        Entry.dispatchEvent('dismissModal');
    }

    #generateView() {
        const view = document.createElement('div');
        view.className = 'table-modal';
        document.body.appendChild(view);
        this.dataAnalytics = new DataAnalytics({ container: view, data: {}, isShow: false })
            .on('submit', this.saveTable)
            .on('alert', ({ message, title = Lang.DataAnalytics.max_row_count_error_title }) =>
                entrylms.alert(message, title)
            )
            .on('toast', (message) => {
                const { title, content } = message;
                Entry.toast.alert(title, content);
            })
            .on('close', async () => {
                this.hide();
            })
            .on('addTable', () => {
                Entry.dispatchEvent('openTableManager');
            })
            .on('removeTable', this.removeTable);
    }

    getTableJSON() {
        return this.tables.filter(_.identity).map((v) => (v.toJSON ? v.toJSON() : v));
    }

    setTables(tables = []) {
        tables.forEach((table) => {
            let data = table || { name: Lang.Workspace.data_table };
            data.name = Entry.getOrderedName(data.name, this.#tables, 'name');
            const isDataTableSource = data instanceof DataTableSource;
            this.#tables.push(isDataTableSource ? data : new DataTableSource(data));
        });

        tables.length && this.refreshPlayground();
    }

    refreshPlayground() {
        const isWorkspace = Entry.type === 'workspace';
        if (isWorkspace) {
            this.unbanBlock();
            Entry.playground.reloadPlayground();
            Entry.playground.refreshPlayground();
        }
    }

    showChart(tableId, chartIndex = 0) {
        this.closeChart();
        const source = this.getSource(tableId);
        if (!source) {
            console.log(`not exist souce, table id: ${tableId}`);
            return;
        }
        if (!source.modal) {
            source.modal = this.createChart(source, chartIndex);
        }
        source.forceApply();
        source.modal.show({ chartIndex });
        this.modal = source.modal;
    }

    closeChart() {
        if (this.modal && this.modal.isShow) {
            this.modal.hide();
        }
    }

    createChart(source, chartIndex = 0) {
        const { chart = [], fields, rows } = source;
        const container = Entry.Dom('div', {
            class: 'entry-table-chart',
            parent: $('body'),
        })[0];
        return new ModalChart({
            data: {
                chartIndex,
                source: { fields, origin: rows, chart },
                togglePause: () => Entry.engine.togglePause(),
                stop: () => Entry.engine.toggleStop(),
                isIframe: self !== top,
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
