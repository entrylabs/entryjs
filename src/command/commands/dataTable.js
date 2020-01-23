/*
 *
 */
'use strict';

(function(c) {
    const { COMMAND_TYPES, RECORDABLE } = Entry.STATIC;

    c[COMMAND_TYPES.dataTableAddSource] = {
        do(table) {
            const { dataTable } = Entry.playground;
            if (dataTable) {
                dataTable.tables.unshift(table);
                Entry.playground.reloadPlayground();
                Entry.playground.refreshPlayground();
            }
        },
        state(table) {
            return [table];
        },
        log(table) {
            return [['table', table]];
        },
        recordable: RECORDABLE.SUPPORT,
        validate: false,
        undo: 'dataTableRemoveSource',
        dom: ['playground', 'tableAddButton'],
    };

    c[COMMAND_TYPES.dataTableRemoveSource] = {
        do(table = {}) {
            const { dataTable } = Entry.playground;
            const index = dataTable.getIndex(table);
            if (index < 0) {
                console.warn('not found table', table);
                return;
            }
            dataTable.tables.splice(index, 1);
            Entry.playground.reloadPlayground();
            Entry.playground.refreshPlayground();
        },
        state(table) {
            return [table];
        },
        log(table) {
            return [['table', table]];
        },
        recordable: RECORDABLE.SUPPORT,
        validate: false,
        undo: 'dataTableAddSource',
        dom: ['playground', 'tableAddButton'],
    };

    c[COMMAND_TYPES.editDataTable] = {
        do() {
            // setTable(table.splice(rowNum, 0, rowInfo));
            // setTable(table);
            Entry.playground.dataTable.redo();
            return;
        },
        state() {
            // return [table, rowNum, rowInfo, setTable];
            return;
        },
        log(objectId) {
            // return [['row', [table, rowNum, rowInfo, setTable]]];
            return [objectId];
        },
        recordable: RECORDABLE.SUPPORT,
        validate: false,
        undo: 'uneditDataTable',
    };
    c[COMMAND_TYPES.uneditDataTable] = {
        do() {
            Entry.playground.dataTable.undo();
            // setTable(table.splice(rowNum, 1));
            // setTable(table);
            return;
        },
        state() {
            // return [table, rowNum, rowInfo, setTable];
            return;
        },
        log(objectId) {
            // return [['row', [table, rowNum, rowInfo, setTable]]];
            return [objectId];
        },
        recordable: RECORDABLE.SUPPORT,
        validate: false,
        undo: 'editDataTable',
    };
})(Entry.Command);
