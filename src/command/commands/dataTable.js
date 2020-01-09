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
                dataTable.addSource(table);
            }
        },
        state(table) {
            return [table.toJSON()];
        },
        log(table) {
            return [['table', table.toJSON()]];
        },
        recordable: RECORDABLE.SUPPORT,
        validate: false,
        undo: 'dataTableRemoveSource',
        dom: ['playground', 'tableAddButton'],
    };

    c[COMMAND_TYPES.dataTableRemoveSource] = {
        do(table) {
            const { dataTable } = Entry.playground;
            dataTable.removeSource(table);
        },
        state(table) {
            return [table.toJSON()];
        },
        log(table) {
            return [['table', table.toJSON()]];
        },
        recordable: RECORDABLE.SUPPORT,
        validate: false,
        undo: 'dataTableAddSource',
        dom: ['playground', 'tableAddButton'],
    };
})(Entry.Command);
