module.exports = {
    getBlocks() {
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
                            const table = Entry.Variable.create({
                                name: `test_table_${Entry.generateHash()}`,
                                variableType: 'table',
                                labels: [
                                    `attr_${Entry.generateHash()}`,
                                    `attr_${Entry.generateHash()}`,
                                ],
                            });
                            console.log('analizyDataAddButton', table);
                            Entry.do('variableContainerAddTable', table);
                        },
                    ],
                },
                syntax: { js: [], py: [''] },
            },
            append_row_to_table: {
                color: EntryStatic.colorSet.block.default.ANALIZE,
                outerLine: EntryStatic.colorSet.block.darken.ANALIZE,
                skeleton: 'basic',
                statements: [],
                params: [
                    {
                        type: 'DropdownDynamic',
                        value: null,
                        menuName: 'tables',
                        fontSize: 10,
                        bgColor: EntryStatic.colorSet.block.darken.ANALIZE,
                        arrowColor: EntryStatic.colorSet.arrow.default.DEFAULT,
                    },
                    {
                        type: 'Indicator',
                        img: 'block_icon/variable_icon.svg',
                        size: 11,
                    },
                ],
                events: {},
                def: {
                    params: [null, null],
                    type: 'append_row_to_table',
                },
                pyHelpDef: {
                    params: [
                        {
                            type: 'text',
                            params: ['A&value'],
                        },
                        null,
                    ],
                    type: 'append_row_to_table',
                },
                paramsKeyMap: {
                    MATRIX: 0,
                },
                class: 'analysis',
                isNotFor: ['analysis'],
                func(sprite, script) {
                    const tableId = script.getField('MATRIX', script);
                    const table = Entry.variableContainer.getTable(tableId, sprite);
                    table.appendValue();
                    return script.callReturn();
                },
                syntax: {
                    js: [],
                    py: [],
                },
            },
            insert_row_to_table: {
                color: EntryStatic.colorSet.block.default.ANALIZE,
                outerLine: EntryStatic.colorSet.block.darken.ANALIZE,
                skeleton: 'basic',
                statements: [],
                params: [
                    {
                        type: 'DropdownDynamic',
                        value: null,
                        menuName: 'tables',
                        fontSize: 10,
                        bgColor: EntryStatic.colorSet.block.darken.ANALIZE,
                        arrowColor: EntryStatic.colorSet.arrow.default.DEFAULT,
                    },
                    {
                        type: 'Block',
                        accept: 'string',
                        isListIndex: true,
                        defaultType: 'number',
                    },
                    {
                        type: 'Indicator',
                        img: 'block_icon/variable_icon.svg',
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
                        null,
                    ],
                    type: 'insert_row_to_table',
                },
                paramsKeyMap: {
                    MATRIX: 0,
                    ROW: 1,
                },
                class: 'analysis',
                isNotFor: ['analysis'],
                func(sprite, script) {
                    const tableId = script.getField('MATRIX', script);
                    const row = script.getNumberValue('ROW', script);
                    const table = Entry.variableContainer.getTable(tableId, sprite);
                    table.insertValue(row);
                    return script.callReturn();
                },
                syntax: {
                    js: [],
                    py: [],
                },
            },
            delete_row_from_table: {
                color: EntryStatic.colorSet.block.default.ANALIZE,
                outerLine: EntryStatic.colorSet.block.darken.ANALIZE,
                skeleton: 'basic',
                statements: [],
                params: [
                    {
                        type: 'DropdownDynamic',
                        value: null,
                        menuName: 'tables',
                        fontSize: 10,
                        bgColor: EntryStatic.colorSet.block.darken.ANALIZE,
                        arrowColor: EntryStatic.colorSet.arrow.default.DEFAULT,
                    },
                    {
                        type: 'Block',
                        accept: 'string',
                        isListIndex: true,
                        defaultType: 'number',
                    },
                    {
                        type: 'Indicator',
                        img: 'block_icon/variable_icon.svg',
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
                        null,
                    ],
                    type: 'delete_row_from_table',
                },
                paramsKeyMap: {
                    MATRIX: 0,
                    ROW: 1,
                },
                class: 'analysis',
                isNotFor: ['analysis'],
                func(sprite, script) {
                    const tableId = script.getField('MATRIX', script);
                    const row = script.getNumberValue('ROW', script);
                    const table = Entry.variableContainer.getTable(tableId, sprite);
                    table.deleteValue(row);
                    return script.callReturn();
                },
                syntax: {
                    js: [],
                    py: [],
                },
            },
            set_value_from_table: {
                color: EntryStatic.colorSet.block.default.ANALIZE,
                outerLine: EntryStatic.colorSet.block.darken.ANALIZE,
                skeleton: 'basic',
                statements: [],
                params: [
                    {
                        type: 'DropdownDynamic',
                        value: null,
                        menuName: 'tables',
                        fontSize: 10,
                        bgColor: EntryStatic.colorSet.block.darken.ANALIZE,
                        arrowColor: EntryStatic.colorSet.arrow.default.DEFAULT,
                    },
                    {
                        type: 'Block',
                        accept: 'string',
                        isListIndex: true,
                        defaultType: 'number',
                    },
                    {
                        type: 'DropdownDynamic',
                        value: null,
                        menuName(value) {
                            const table = Entry.variableContainer.getTable(value);
                            if (!table) {
                                return [];
                            }
                            return table.getLabels().map((label, index) => [label, index + 1]);
                        },
                        targetIndex: 0,
                        needDeepCopy: true,
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.EXPANSION,
                        arrowColor: EntryStatic.colorSet.common.WHITE,
                    },
                    {
                        type: 'Block',
                        accept: 'string',
                        defaultType: 'number',
                    },
                    {
                        type: 'Indicator',
                        img: 'block_icon/variable_icon.svg',
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
                            type: 'text',
                            params: ['1'],
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
                    ROW: 1,
                    COL: 2,
                    VALUE: 3,
                },
                class: 'analysis',
                isNotFor: ['analysis'],
                func(sprite, script) {
                    const tableId = script.getField('MATRIX', script);
                    const row = script.getNumberValue('ROW', script);
                    const col = script.getNumberValue('COL', script);
                    const value = script.getValue('VALUE', script);
                    const table = Entry.variableContainer.getTable(tableId, sprite);
                    const isExist = table.getValue([row, col]);
                    if (isExist === 0 || isExist) {
                        table.replaceValue([row, col], value);
                    } else {
                        table.insertValue([row, col], value);
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
                color: EntryStatic.colorSet.block.default.ANALIZE,
                outerLine: EntryStatic.colorSet.block.darken.ANALIZE,
                skeleton: 'basic_string_field',
                statements: [],
                params: [
                    {
                        type: 'DropdownDynamic',
                        value: null,
                        menuName: 'tables',
                        fontSize: 10,
                        bgColor: EntryStatic.colorSet.block.darken.ANALIZE,
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
                        bgColor: EntryStatic.colorSet.block.darken.ANALIZE,
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
                isNotFor: [],
                func(sprite, script) {
                    const tableId = script.getField('MATRIX', script);
                    const property = script.getField('PROPERTY', script);
                    const table = Entry.variableContainer.getTable(tableId, sprite);
                    if (property === 'ROW') {
                        const array = table.getArray();
                        return array.length;
                    } else if (property === 'COL') {
                        const labels = table.getLabels();
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
                color: EntryStatic.colorSet.block.default.ANALIZE,
                outerLine: EntryStatic.colorSet.block.darken.ANALIZE,
                skeleton: 'basic_string_field',
                statements: [],
                params: [
                    {
                        type: 'DropdownDynamic',
                        value: null,
                        menuName: 'tables',
                        fontSize: 10,
                        bgColor: EntryStatic.colorSet.block.darken.ANALIZE,
                        arrowColor: EntryStatic.colorSet.arrow.default.DEFAULT,
                    },
                    {
                        type: 'Block',
                        accept: 'string',
                        isListIndex: true,
                        defaultType: 'number',
                    },
                    {
                        type: 'DropdownDynamic',
                        value: null,
                        menuName(value) {
                            const table = Entry.variableContainer.getTable(value);
                            if (!table) {
                                return [];
                            }
                            return table.getLabels().map((label, index) => [label, index + 1]);
                        },
                        targetIndex: 0,
                        needDeepCopy: true,
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.EXPANSION,
                        arrowColor: EntryStatic.colorSet.common.WHITE,
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
                            type: 'text',
                            params: ['1'],
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
                isNotFor: [],
                func(sprite, script) {
                    const tableId = script.getField('MATRIX', script);
                    const row = script.getNumberValue('ROW', script);
                    const col = script.getNumberValue('COL', script);
                    try {
                        const table = Entry.variableContainer.getTable(tableId, sprite);
                        return table.getValue([row, col]);
                    } catch (e) {
                        return 0;
                    }
                },
                syntax: {
                    js: [],
                    py: [],
                },
            },
            // 테이블 %1 속성 %1의 합
            calc_values_from_table: {
                color: EntryStatic.colorSet.block.default.ANALIZE,
                outerLine: EntryStatic.colorSet.block.darken.ANALIZE,
                skeleton: 'basic_string_field',
                statements: [],
                params: [
                    {
                        type: 'DropdownDynamic',
                        value: null,
                        menuName: 'tables',
                        fontSize: 10,
                        bgColor: EntryStatic.colorSet.block.darken.ANALIZE,
                        arrowColor: EntryStatic.colorSet.arrow.default.DEFAULT,
                    },
                    {
                        type: 'DropdownDynamic',
                        value: null,
                        menuName(value) {
                            const table = Entry.variableContainer.getTable(value);
                            if (!table) {
                                return [];
                            }
                            return table.getLabels().map((label, index) => [label, index + 1]);
                        },
                        targetIndex: 0,
                        needDeepCopy: true,
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.EXPANSION,
                        arrowColor: EntryStatic.colorSet.common.WHITE,
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
                        bgColor: EntryStatic.colorSet.block.darken.ANALIZE,
                        arrowColor: EntryStatic.colorSet.arrow.default.DEFAULT,
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
                    ],
                    type: 'calc_values_from_table',
                },
                paramsKeyMap: {
                    MATRIX: 0,
                    COL: 1,
                    CALC: 2,
                },
                class: 'analysis',
                isNotFor: [],
                func(sprite, script) {
                    const tableId = script.getField('MATRIX', script);
                    const calc = script.getField('CALC', script);
                    const col = script.getNumberValue('COL', script);
                    const table = Entry.variableContainer.getTable(tableId, sprite);
                    const array = table.getArray().map(({ data }) => data[col - 1] || 0);
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
        };
    },
};
