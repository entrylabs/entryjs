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
                            console.log('analizyDataAddButton');
                            const matrix = Entry.Variable.create({
                                name: Entry.generateHash(),
                                variableType: 'matrix',
                            });
                            Entry.do('variableContainerAddMatrix', matrix);
                        },
                    ],
                },
                syntax: { js: [], py: [''] },
            },
            // 테이블 A에 행 추가하기
            add_row_to_matrix: {
                color: EntryStatic.colorSet.block.default.ANALIZE,
                outerLine: EntryStatic.colorSet.block.darken.ANALIZE,
                skeleton: 'basic',
                statements: [],
                params: [
                    {
                        type: 'DropdownDynamic',
                        value: null,
                        menuName: 'matrices',
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
                    type: 'add_row_to_matrix',
                },
                pyHelpDef: {
                    params: [
                        {
                            type: 'text',
                            params: ['A&value'],
                        },
                        null,
                    ],
                    type: 'add_row_to_matrix',
                },
                paramsKeyMap: {
                    MATRIX: 0,
                },
                class: 'analysis',
                isNotFor: ['analysis'],
                func(sprite, script) {
                    const matrixId = script.getField('MATRIX', script);
                    const matrix = Entry.variableContainer.getMatrix(matrixId, sprite);
                    const length = matrix.getArray().length;
                    matrix.insertValue([length + 1]);
                    return script.callReturn();
                },
                syntax: {
                    js: [],
                    py: [],
                },
            },
            // 테이블 A의 1번째 행에 넣기
            insert_row_to_matrix: {
                color: EntryStatic.colorSet.block.default.ANALIZE,
                outerLine: EntryStatic.colorSet.block.darken.ANALIZE,
                skeleton: 'basic',
                statements: [],
                params: [
                    {
                        type: 'DropdownDynamic',
                        value: null,
                        menuName: 'matrices',
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
                    type: 'insert_row_to_matrix',
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
                    type: 'insert_row_to_matrix',
                },
                paramsKeyMap: {
                    MATRIX: 0,
                    ROW: 1,
                },
                class: 'analysis',
                isNotFor: ['analysis'],
                func(sprite, script) {
                    const matrixId = script.getField('MATRIX', script);
                    const row = script.getNumberValue('ROW', script);
                    const matrix = Entry.variableContainer.getMatrix(matrixId, sprite);
                    matrix.insertValue([row]);
                    return script.callReturn();
                },
                syntax: {
                    js: [],
                    py: [],
                },
            },
            // 테이블 A의 행 x 삭제하기
            delete_row_from_matrix: {
                color: EntryStatic.colorSet.block.default.ANALIZE,
                outerLine: EntryStatic.colorSet.block.darken.ANALIZE,
                skeleton: 'basic',
                statements: [],
                params: [
                    {
                        type: 'DropdownDynamic',
                        value: null,
                        menuName: 'matrices',
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
                    type: 'delete_row_from_matrix',
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
                    type: 'delete_row_from_matrix',
                },
                paramsKeyMap: {
                    MATRIX: 0,
                    ROW: 1,
                },
                class: 'analysis',
                isNotFor: ['analysis'],
                func(sprite, script) {
                    const matrixId = script.getField('MATRIX', script);
                    const row = script.getNumberValue('ROW', script);
                    const matrix = Entry.variableContainer.getMatrix(matrixId, sprite);
                    matrix.deleteValue([row]);
                    return script.callReturn();
                },
                syntax: {
                    js: [],
                    py: [],
                },
            },
            // 테이블 A의 행 x 속성 y 을 0으로 바꾸기.
            set_col_from_matrix: {
                color: EntryStatic.colorSet.block.default.ANALIZE,
                outerLine: EntryStatic.colorSet.block.darken.ANALIZE,
                skeleton: 'basic',
                statements: [],
                params: [
                    {
                        type: 'DropdownDynamic',
                        value: null,
                        menuName: 'matrices',
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
                        type: 'Block',
                        accept: 'string',
                        isListIndex: true,
                        defaultType: 'number',
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
                    type: 'set_col_from_matrix',
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
                    type: 'set_col_from_matrix',
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
                    const matrixId = script.getField('MATRIX', script);
                    const row = script.getNumberValue('ROW', script);
                    const col = script.getNumberValue('COL', script);
                    const value = script.getValue('VALUE', script);
                    const matrix = Entry.variableContainer.getMatrix(matrixId, sprite);
                    const isExist = matrix.getValue([row, col]);
                    if (isExist) {
                        matrix.replaceValue([row, col], value);
                    } else {
                        matrix.insertValue([row, col], value);
                    }
                    return script.callReturn();
                },
                syntax: {
                    js: [],
                    py: [],
                },
            },
            // 테이블 %1 %2 개수
            get_count_from_matrix: {
                color: EntryStatic.colorSet.block.default.ANALIZE,
                outerLine: EntryStatic.colorSet.block.darken.ANALIZE,
                skeleton: 'basic_string_field',
                statements: [],
                params: [
                    {
                        type: 'DropdownDynamic',
                        value: null,
                        menuName: 'matrices',
                        fontSize: 10,
                        bgColor: EntryStatic.colorSet.block.darken.ANALIZE,
                        arrowColor: EntryStatic.colorSet.arrow.default.DEFAULT,
                    },
                    {
                        type: 'Dropdown',
                        options: [
                            [Lang.Blocks.matrix_row, 'ROW'],
                            [Lang.Blocks.matrix_col, 'COL'],
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
                    type: 'get_count_from_matrix',
                },
                paramsKeyMap: {
                    MATRIX: 0,
                    PROPERTY: 1,
                },
                class: 'analysis',
                isNotFor: [],
                func(sprite, script) {
                    const matrixId = script.getField('MATRIX', script);
                    const property = script.getField('PROPERTY', script);
                    const matrix = Entry.variableContainer.getMatrix(matrixId, sprite);
                    const array = matrix.getArray();
                    if (property === 'ROW') {
                        return array.length;
                    } else if (property === 'COL') {
                        return array
                            .map((subArr) => subArr.length)
                            .reduce((x, y) => Math.max(x, y));
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
                        menuName: 'matrices',
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
                        type: 'Block',
                        accept: 'string',
                        isListIndex: true,
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
                    const matrixId = script.getField('MATRIX', script);
                    const row = script.getNumberValue('ROW', script);
                    const col = script.getNumberValue('COL', script);
                    try {
                        const matrix = Entry.variableContainer.getMatrix(matrixId, sprite);
                        const result = matrix.getValue([row, col]);
                        return result.value;
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
            calc_values_from_matrix: {
                color: EntryStatic.colorSet.block.default.ANALIZE,
                outerLine: EntryStatic.colorSet.block.darken.ANALIZE,
                skeleton: 'basic_string_field',
                statements: [],
                params: [
                    {
                        type: 'DropdownDynamic',
                        value: null,
                        menuName: 'matrices',
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
                        type: 'Dropdown',
                        options: [
                            [Lang.Blocks.matrix_sum, 'SUM'],
                            [Lang.Blocks.matrix_max, 'MAX'],
                            [Lang.Blocks.matrix_min, 'MIN'],
                            [Lang.Blocks.matrix_avg, 'AVG'],
                            [Lang.Blocks.matrix_stdev, 'STDEV'],
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
                    type: 'calc_values_from_matrix',
                },
                paramsKeyMap: {
                    MATRIX: 0,
                    COL: 1,
                    CALC: 2,
                },
                class: 'analysis',
                isNotFor: [],
                func(sprite, script) {
                    const matrixId = script.getField('MATRIX', script);
                    const calc = script.getField('CALC', script);
                    const col = script.getNumberValue('COL', script);
                    const matrix = Entry.variableContainer.getMatrix(matrixId, sprite);
                    const array = matrix
                        .getArray()
                        .map((subArr) => (subArr[col] && subArr[col].value) || 0);
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
