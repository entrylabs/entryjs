import _isNumber from 'lodash/isNumber';
import DataTable from '../../class/DataTable';

module.exports = {
    getBlocks() {
        const getSubMenus = (value) => {
            const { fields = [] } = DataTable.getSource(value) || {};
            return fields.map((label, index) => [label, index + 1]);
        };

        return {
            analizyDataAddButton: {
                skeleton: 'basic_button',
                color: EntryStatic.colorSet.common.BUTTON_BACKGROUND,
                params: [
                    {
                        type: 'Text',
                        text: Lang.Workspace.open_analizy_data_import,
                        color: EntryStatic.colorSet.common.BUTTON,
                        align: 'center',
                    },
                ],
                def: {
                    type: 'analizyDataAddButton',
                },
                events: {
                    mousedown: [
                        function() {
                            Entry.do('playgroundClickAddTable');
                        },
                    ],
                },
                syntax: { js: [], py: [''] },
            },
            append_row_to_table: {
                color: EntryStatic.colorSet.block.default.ANALYSIS,
                outerLine: EntryStatic.colorSet.block.darken.ANALYSIS,
                skeleton: 'basic',
                statements: [],
                params: [
                    {
                        type: 'DropdownDynamic',
                        value: null,
                        menuName: 'tables',
                        dropdownSync: 'dataTables',
                        fontSize: 10,
                        bgColor: EntryStatic.colorSet.block.darken.ANALYSIS,
                        arrowColor: EntryStatic.colorSet.arrow.default.DEFAULT,
                    },
                    {
                        type: 'Dropdown',
                        options: [
                            [Lang.Blocks.table_row, 'ROW'],
                            [Lang.Blocks.table_col, 'COL'],
                        ],
                        value: 'ROW',
                        fontSize: 10,
                        bgColor: EntryStatic.colorSet.block.darken.ANALYSIS,
                        arrowColor: EntryStatic.colorSet.arrow.default.DEFAULT,
                    },
                    {
                        type: 'Indicator',
                        img: 'block_icon/block_analysis.svg',
                        size: 11,
                    },
                ],
                events: {},
                def: {
                    params: [null, null, null],
                    type: 'append_row_to_table',
                },
                pyHelpDef: {
                    params: [
                        {
                            type: 'text',
                            params: ['A&value'],
                        },
                        {
                            type: 'text',
                            params: ['B&value'],
                        },
                    ],
                    type: 'append_row_to_table',
                },
                paramsKeyMap: {
                    MATRIX: 0,
                    PROPERTY: 1,
                },
                class: 'analysis',
                isNotFor: ['analysis'],
                async func(sprite, script) {
                    const tableId = script.getField('MATRIX', script);
                    const property = script.getStringValue('PROPERTY', script);
                    const table = DataTable.getSource(tableId, sprite);
                    if (property === 'ROW') {
                        await table.appendRow();
                    } else {
                        await table.appendCol();
                    }
                    return script.callReturn();
                },
                syntax: {
                    js: [],
                    py: [],
                },
            },
            insert_row_to_table: {
                color: EntryStatic.colorSet.block.default.ANALYSIS,
                outerLine: EntryStatic.colorSet.block.darken.ANALYSIS,
                skeleton: 'basic',
                statements: [],
                params: [
                    {
                        type: 'DropdownDynamic',
                        value: null,
                        menuName: 'tables',
                        dropdownSync: 'dataTables',
                        fontSize: 10,
                        bgColor: EntryStatic.colorSet.block.darken.ANALYSIS,
                        arrowColor: EntryStatic.colorSet.arrow.default.DEFAULT,
                    },
                    {
                        type: 'Block',
                        accept: 'string',
                        defaultType: 'number',
                    },
                    {
                        type: 'Dropdown',
                        options: [
                            [Lang.Blocks.table_row, 'ROW'],
                            [Lang.Blocks.table_col, 'COL'],
                        ],
                        value: 'ROW',
                        fontSize: 10,
                        bgColor: EntryStatic.colorSet.block.darken.ANALYSIS,
                        arrowColor: EntryStatic.colorSet.arrow.default.DEFAULT,
                    },
                    {
                        type: 'Indicator',
                        img: 'block_icon/block_analysis.svg',
                        size: 11,
                    },
                ],
                events: {},
                def: {
                    params: [
                        null,
                        {
                            type: 'text',
                            params: ['1'],
                        },
                        null,
                        null,
                    ],
                    type: 'insert_row_to_table',
                },
                pyHelpDef: {
                    params: [
                        {
                            type: 'text',
                            params: ['B&value'],
                        },
                        {
                            type: 'text',
                            params: ['A&value'],
                        },
                        {
                            type: 'text',
                            params: ['C&value'],
                        },
                        null,
                    ],
                    type: 'insert_row_to_table',
                },
                paramsKeyMap: {
                    MATRIX: 0,
                    NUMBER: 1,
                    PROPERTY: 2,
                },
                class: 'analysis',
                isNotFor: ['analysis'],
                async func(sprite, script) {
                    const tableId = script.getField('MATRIX', script);
                    const number = script.getNumberValue('NUMBER', script);
                    const property = script.getStringValue('PROPERTY', script);
                    const table = DataTable.getSource(tableId, sprite);
                    if (property === 'ROW') {
                        await table.insertRow(number);
                    } else {
                        await table.insertCol(number);
                    }
                    return script.callReturn();
                },
                syntax: {
                    js: [],
                    py: [],
                },
            },
            delete_row_from_table: {
                color: EntryStatic.colorSet.block.default.ANALYSIS,
                outerLine: EntryStatic.colorSet.block.darken.ANALYSIS,
                skeleton: 'basic',
                statements: [],
                params: [
                    {
                        type: 'DropdownDynamic',
                        value: null,
                        menuName: 'tables',
                        dropdownSync: 'dataTables',
                        fontSize: 10,
                        bgColor: EntryStatic.colorSet.block.darken.ANALYSIS,
                        arrowColor: EntryStatic.colorSet.arrow.default.DEFAULT,
                    },
                    {
                        type: 'Block',
                        accept: 'string',
                        defaultType: 'number',
                    },
                    {
                        type: 'Dropdown',
                        options: [
                            [Lang.Blocks.table_row, 'ROW'],
                            [Lang.Blocks.table_col, 'COL'],
                        ],
                        value: 'ROW',
                        fontSize: 10,
                        bgColor: EntryStatic.colorSet.block.darken.ANALYSIS,
                        arrowColor: EntryStatic.colorSet.arrow.default.DEFAULT,
                    },
                    {
                        type: 'Indicator',
                        img: 'block_icon/block_analysis.svg',
                        size: 11,
                    },
                ],
                events: {},
                def: {
                    params: [
                        null,
                        {
                            type: 'text',
                            params: ['1'],
                        },
                        null,
                        null,
                    ],
                    type: 'delete_row_from_table',
                },
                pyHelpDef: {
                    params: [
                        {
                            type: 'text',
                            params: ['B&value'],
                        },
                        {
                            type: 'text',
                            params: ['A&value'],
                        },
                        {
                            type: 'text',
                            params: ['C&value'],
                        },
                        null,
                    ],
                    type: 'delete_row_from_table',
                },
                paramsKeyMap: {
                    MATRIX: 0,
                    NUMBER: 1,
                    PROPERTY: 2,
                },
                class: 'analysis',
                isNotFor: ['analysis'],
                func(sprite, script) {
                    const tableId = script.getField('MATRIX', script);
                    const number = script.getNumberValue('NUMBER', script);
                    const property = script.getStringValue('PROPERTY', script);
                    const table = DataTable.getSource(tableId, sprite);
                    if (property === 'ROW') {
                        table.deleteRow(number);
                    } else {
                        table.deleteCol(number);
                    }
                    return script.callReturn();
                },
                syntax: {
                    js: [],
                    py: [],
                },
            },
            set_value_from_table: {
                color: EntryStatic.colorSet.block.default.ANALYSIS,
                outerLine: EntryStatic.colorSet.block.darken.ANALYSIS,
                skeleton: 'basic',
                statements: [],
                params: [
                    {
                        type: 'DropdownDynamic',
                        value: null,
                        menuName: 'tables',
                        dropdownSync: 'dataTables',
                        fontSize: 10,
                        bgColor: EntryStatic.colorSet.block.darken.ANALYSIS,
                        arrowColor: EntryStatic.colorSet.arrow.default.DEFAULT,
                    },
                    {
                        type: 'Block',
                        accept: 'string',
                        defaultType: 'number',
                    },
                    {
                        type: 'Block',
                        accept: 'string',
                        defaultType: 'number',
                    },
                    {
                        type: 'Block',
                        accept: 'string',
                        defaultType: 'number',
                    },
                    {
                        type: 'Indicator',
                        img: 'block_icon/block_analysis.svg',
                        size: 11,
                    },
                ],
                events: {},
                def: {
                    params: [
                        null,
                        {
                            type: 'text',
                            params: ['1'],
                        },
                        {
                            type: 'get_table_fields',
                        },
                        {
                            type: 'text',
                            params: ['10'],
                        },
                        null,
                    ],
                    type: 'set_value_from_table',
                },
                pyHelpDef: {
                    params: [
                        {
                            type: 'text',
                            params: ['D&value'],
                        },
                        {
                            type: 'text',
                            params: ['C&value'],
                        },
                        {
                            type: 'text',
                            params: ['B&value'],
                        },
                        {
                            type: 'text',
                            params: ['A&value'],
                        },
                        null,
                    ],
                    type: 'set_value_from_table',
                },
                paramsKeyMap: {
                    MATRIX: 0,
                    NUMBER: 1,
                    FIELD: 2,
                    VALUE: 3,
                },
                class: 'analysis',
                isNotFor: ['analysis'],
                func(sprite, script) {
                    const tableId = script.getField('MATRIX', script);
                    const row = script.getNumberValue('NUMBER', script);
                    const col = script.getNumberValue('FIELD', script);
                    const value = script.getValue('VALUE', script);
                    const table = DataTable.getSource(tableId, sprite);
                    if (table.isExist([row])) {
                        table.replaceValue([row, col], value);
                    } else {
                        throw new Error('data not exist');
                    }
                    return script.callReturn();
                },
                syntax: {
                    js: [],
                    py: [],
                },
            },
            // 테이블 %1 %2 개수
            get_table_count: {
                color: EntryStatic.colorSet.block.default.ANALYSIS,
                outerLine: EntryStatic.colorSet.block.darken.ANALYSIS,
                skeleton: 'basic_string_field',
                statements: [],
                params: [
                    {
                        type: 'DropdownDynamic',
                        value: null,
                        menuName: 'tables',
                        dropdownSync: 'dataTables',
                        fontSize: 10,
                        bgColor: EntryStatic.colorSet.block.darken.ANALYSIS,
                        arrowColor: EntryStatic.colorSet.arrow.default.DEFAULT,
                    },
                    {
                        type: 'Dropdown',
                        options: [
                            [Lang.Blocks.table_row, 'ROW'],
                            [Lang.Blocks.table_col, 'COL'],
                        ],
                        value: 'ROW',
                        fontSize: 10,
                        bgColor: EntryStatic.colorSet.block.darken.ANALYSIS,
                        arrowColor: EntryStatic.colorSet.arrow.default.DEFAULT,
                    },
                ],
                events: {},
                def: {
                    params: [null, null],
                    type: 'get_table_count',
                },
                paramsKeyMap: {
                    MATRIX: 0,
                    PROPERTY: 1,
                },
                class: 'analysis',
                isNotFor: ['analysis'],
                func(sprite, script) {
                    const tableId = script.getField('MATRIX', script);
                    const property = script.getStringValue('PROPERTY', script);
                    const table = DataTable.getSource(tableId, sprite);
                    if (property === 'ROW') {
                        const { array } = table;
                        return array.length;
                    } else if (property === 'COL') {
                        const labels = table.fields;
                        return labels.length;
                    }
                    return 0;
                },
                syntax: {
                    js: [],
                    py: [],
                },
            },
            // 테이블 %1 행 %2 속성 %3 의 값
            get_value_from_table: {
                color: EntryStatic.colorSet.block.default.ANALYSIS,
                outerLine: EntryStatic.colorSet.block.darken.ANALYSIS,
                skeleton: 'basic_string_field',
                statements: [],
                params: [
                    {
                        type: 'DropdownDynamic',
                        value: null,
                        menuName: 'tables',
                        dropdownSync: 'dataTables',
                        fontSize: 10,
                        bgColor: EntryStatic.colorSet.block.darken.ANALYSIS,
                        arrowColor: EntryStatic.colorSet.arrow.default.DEFAULT,
                    },
                    {
                        type: 'Block',
                        accept: 'string',
                        defaultType: 'number',
                    },
                    {
                        type: 'Block',
                        accept: 'string',
                        defaultType: 'number',
                    },
                ],
                events: {},
                def: {
                    params: [
                        null,
                        {
                            type: 'text',
                            params: ['1'],
                        },
                        {
                            type: 'get_table_fields',
                        },
                    ],
                    type: 'get_value_from_table',
                },
                paramsKeyMap: {
                    MATRIX: 0,
                    ROW: 1,
                    COL: 2,
                },
                class: 'analysis',
                isNotFor: ['analysis'],
                func(sprite, script) {
                    const tableId = script.getField('MATRIX', script);
                    const row = script.getNumberValue('ROW', script);
                    const col = script.getNumberValue('COL', script);
                    const table = DataTable.getSource(tableId, sprite);
                    if (table.isExist([row, col])) {
                        return table.getValue([row, col]);
                    }
                    throw new Error('data not exist');
                },
                syntax: {
                    js: [],
                    py: [],
                },
            },
            // 테이블 %1 속성 %1의 합
            calc_values_from_table: {
                color: EntryStatic.colorSet.block.default.ANALYSIS,
                outerLine: EntryStatic.colorSet.block.darken.ANALYSIS,
                skeleton: 'basic_string_field',
                statements: [],
                params: [
                    {
                        type: 'DropdownDynamic',
                        value: null,
                        menuName: 'tables',
                        dropdownSync: 'dataTables',
                        fontSize: 10,
                        bgColor: EntryStatic.colorSet.block.darken.ANALYSIS,
                        arrowColor: EntryStatic.colorSet.arrow.default.DEFAULT,
                    },
                    {
                        type: 'Block',
                        accept: 'string',
                        defaultType: 'number',
                    },
                    {
                        type: 'Dropdown',
                        options: [
                            [Lang.Blocks.table_sum, 'SUM'],
                            [Lang.Blocks.table_max, 'MAX'],
                            [Lang.Blocks.table_min, 'MIN'],
                            [Lang.Blocks.table_avg, 'AVG'],
                            [Lang.Blocks.table_stdev, 'STDEV'],
                        ],
                        value: 'SUM',
                        fontSize: 10,
                        bgColor: EntryStatic.colorSet.block.darken.ANALYSIS,
                        arrowColor: EntryStatic.colorSet.arrow.default.DEFAULT,
                    },
                ],
                events: {},
                def: {
                    params: [
                        null,
                        {
                            type: 'get_table_fields',
                        },
                        null,
                    ],
                    type: 'calc_values_from_table',
                },
                paramsKeyMap: {
                    MATRIX: 0,
                    COL: 1,
                    CALC: 2,
                },
                class: 'analysis',
                isNotFor: ['analysis'],
                func(sprite, script) {
                    const tableId = script.getField('MATRIX', script);
                    const calc = script.getField('CALC', script);
                    const col = script.getNumberValue('COL', script);
                    const table = DataTable.getSource(tableId, sprite);
                    const array = table.array.map(({ value = [] }) =>
                        _isNumber(value[col - 1]) ? value[col - 1] : 0
                    );
                    const total = array.length;
                    const sum = (x, y) => x + y;
                    const square = (x) => x * x;
                    if (!total) {
                        return 0;
                    }
                    switch (calc) {
                        case 'SUM':
                            return array.reduce(sum);
                        case 'MAX':
                            return array.reduce((x, y) => Math.max(x, y));
                        case 'MIN':
                            return array.reduce((x, y) => Math.min(x, y));
                        case 'AVG':
                            return array.reduce(sum) / total;
                        case 'STDEV':
                            const avg = array.reduce(sum) / total;
                            const deviations = array.map((x) => x - avg);
                            return Math.sqrt(deviations.map(square).reduce(sum) / (total - 1));
                        default:
                            return 0;
                    }
                },
                syntax: {
                    js: [],
                    py: [],
                },
            },
            open_table_chart: {
                color: EntryStatic.colorSet.block.default.ANALYSIS,
                outerLine: EntryStatic.colorSet.block.darken.ANALYSIS,
                skeleton: 'basic',
                statements: [],
                params: [
                    {
                        type: 'DropdownDynamic',
                        value: null,
                        menuName: 'tables',
                        dropdownSync: 'dataTables',
                        fontSize: 10,
                        bgColor: EntryStatic.colorSet.block.darken.ANALYSIS,
                        arrowColor: EntryStatic.colorSet.arrow.default.DEFAULT,
                    },
                    {
                        type: 'Indicator',
                        img: 'block_icon/block_analysis.svg',
                        size: 11,
                    },
                ],
                events: {},
                def: {
                    params: [null, null],
                    type: 'open_table_chart',
                },
                pyHelpDef: {
                    params: [
                        {
                            type: 'text',
                            params: ['A&value'],
                        },
                        null,
                    ],
                    type: 'open_table_chart',
                },
                paramsKeyMap: {
                    MATRIX: 0,
                },
                class: 'analysis',
                isNotFor: ['analysis'],
                func(sprite, script) {
                    const tableId = script.getField('MATRIX', script);
                    DataTable.showChart(tableId);
                    return script.callReturn();
                },
                syntax: {
                    js: [],
                    py: [],
                },
            },
            close_table_chart: {
                color: EntryStatic.colorSet.block.default.ANALYSIS,
                outerLine: EntryStatic.colorSet.block.darken.ANALYSIS,
                skeleton: 'basic',
                statements: [],
                params: [
                    {
                        type: 'Indicator',
                        img: 'block_icon/block_analysis.svg',
                        size: 11,
                    },
                ],
                events: {},
                def: {
                    params: [null, null],
                    type: 'close_table_chart',
                },
                pyHelpDef: {
                    params: [null],
                    type: 'close_table_chart',
                },
                paramsKeyMap: {},
                class: 'analysis',
                isNotFor: ['analysis'],
                func(sprite, script) {
                    DataTable.closeChart();
                    return script.callReturn();
                },
                syntax: {
                    js: [],
                    py: [],
                },
            },
        };
    },
};
