/*
 *
 */
'use strict';
import DataTable from '../../class/DataTable';

(function(c) {
    const { COMMAND_TYPES, RECORDABLE } = Entry.STATIC;

    c[COMMAND_TYPES.dataTableAddSource] = {
        do(table) {
            DataTable.tables.push(table);
            Entry.playground.selectTable(table);
            // const isWorkspace = Entry.type === 'workspace';
            // if (isWorkspace) {
            //     const isTableMode = Entry.playground.getViewMode() === 'table';
            //     DataTable.unbanBlock();
            //     Entry.playground.reloadPlayground();
            //     Entry.playground.refreshPlayground();
            //     isTableMode && Entry.playground.selectTable(table);
            // }
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
            const isWorkspace = Entry.type === 'workspace';
            if (isWorkspace) {
                const isTableMode = Entry.playground.getViewMode() === 'table';
                Entry.playground.reloadPlayground();
                Entry.playground.refreshPlayground();
                if (isTableMode && table === DataTable.selected) {
                    Entry.playground.selectTable(DataTable.tables[0]);
                }
                !DataTable.tables.length && DataTable.banAllBlock();
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
        undo: 'dataTableAddSource',
        dom: ['playground', 'tableAddButton'],
    };
})(Entry.Command);
