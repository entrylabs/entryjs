/*
 *
 */
'use strict';
import DataTable from '../../class/DataTable';

(function(c) {
    const { COMMAND_TYPES, RECORDABLE } = Entry.STATIC;

    c[COMMAND_TYPES.dataTableAddSource] = {
        do(table) {
            DataTable.tables.unshift(table);
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
        undo: 'dataTableRemoveSource',
        dom: ['playground', 'tableAddButton'],
    };

    c[COMMAND_TYPES.dataTableRemoveSource] = {
        do(table = {}) {
            const index = DataTable.getIndex(table);
            if (index < 0) {
                console.warn('not found table', table);
                return;
            }
            DataTable.tables.splice(index, 1);
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

    c[COMMAND_TYPES.dataTableAddRow] = {
        do(table, rowNum, rowInfo, setTable) {
            setTable(table.splice(rowNum, 0, rowInfo));
            setTable(table);
        },
        state(table, rowNum, rowInfo, setTable) {
            return [table, rowNum, rowInfo, setTable];
        },
        log(table, rowNum, rowInfo, setTable) {
            return [['row', [table, rowNum, rowInfo, setTable]]];
        },
        recordable: RECORDABLE.SUPPORT,
        validate: false,
        undo: 'dataTableRemoveRow',
    };
    c[COMMAND_TYPES.dataTableRemoveRow] = {
        do(table, rowNum, rowInfo, setTable) {
            setTable(table.splice(rowNum, 1));
            setTable(table);
        },
        state(table, rowNum, rowInfo, setTable) {
            return [table, rowNum, rowInfo, setTable];
        },
        log(table, rowNum, rowInfo, setTable) {
            return [['row', [table, rowNum, rowInfo, setTable]]];
        },
        recordable: RECORDABLE.SUPPORT,
        validate: false,
        undo: 'dataTableAddRow',
    };
})(Entry.Command);
