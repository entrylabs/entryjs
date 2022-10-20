const DropDownDynamicGenerator = {
    valueMap: () => {
        const valueMap = Object.values(Entry.aiLearning.getTrainResult()?.valueMap || []);
        if (valueMap?.length) {
            return valueMap.map((name) => [name, name]);
        } else {
            return [[Lang.Blocks.no_target, 'null']];
        }
    },
};

const createParamBlock = ({
    name,
    length,
    createFunc,
    skeleton = 'basic_string_field',
    params = [],
}) => {
    const result = {};
    new Array(length).fill(0).forEach((_, idx) => {
        const index = idx + 1;
        const blockName = `${name}_${index}`;
        const EmptyArray = new Array(index * 2).fill(0);
        const lastAttr = {
            key: 1,
            value: 1,
        };
        const paramsKeyMap = EmptyArray.reduce((acc, cur, idx, array) => {
            if (idx % 2 !== 0) {
                return acc;
            }
            const index = idx / 2 + 1;
            acc[`ATTR${index}`] = idx + 1;
            lastAttr.key = index;
            lastAttr.value = idx + 1;
            return acc;
        }, {});
        if (params.length) {
            params.forEach((p, i) => {
                paramsKeyMap[`ATTR${lastAttr.key + i + 1}`] = lastAttr.value + 1;
            });
        }
        result[blockName] = {
            color: EntryStatic.colorSet.block.default.AI_LEARNING,
            outerLine: EntryStatic.colorSet.block.darken.AI_LEARNING,
            skeleton,
            statements: [],
            params: [
                ...EmptyArray.map((_, i) => {
                    if (i % 2 !== 0) {
                        return {
                            type: 'Block',
                            accept: 'string',
                            defaultType: 'number',
                        };
                    }
                    return {
                        type: 'TextDynamic',
                        setValue: () => {
                            const table = Entry.aiLearning?.getTableData?.();
                            if (table) {
                                const {
                                    select = [],
                                    fields = [],
                                } = Entry.aiLearning?.getTableData?.();
                                return (
                                    fields[select?.[0]?.[i / 2]] || Lang.AiLearning.model_attr_str
                                );
                            }
                            return Lang.AiLearning.model_attr_str;
                        },
                    };
                }),
                ...params,
            ],
            events: {},
            def: {
                type: blockName,
            },
            pyHelpDef: {
                params: [],
                type: blockName,
            },
            paramsKeyMap,
            class: 'ai_learning',
            isNotFor: [`logistic_regression_attr_${index}`],
            func: createFunc(paramsKeyMap),
            syntax: {
                js: [],
                py: [],
            },
        };
    });
    return result;
};

module.exports = {
    getBlocks() {
        const predictBlocks = createParamBlock({
            name: 'get_logistic_regression_predict',
            length: 6,
            createFunc: (paramsKeyMap) => async (sprite, script) => {
                const params = Object.keys(paramsKeyMap).map((key) =>
                    script.getNumberValue(key, script)
                );
                await Entry.aiLearning.predict(params);
                const result = Entry.aiLearning.getPredictResult();
                return result.sort((a, b) => b.probability - a.probability)[0].className;
            },
        });
        const probabilityBlocks = createParamBlock({
            name: 'get_logistic_regression_probability',
            length: 6,
            createFunc: (paramsKeyMap) => async (sprite, script) => {
                const keys = Object.keys(paramsKeyMap);
                const predictKey = keys.pop();
                const params = keys.map((key) => script.getNumberValue(key, script));
                const predict = script.getStringField(predictKey, script);
                await Entry.aiLearning.predict(params);
                const predictResult = Entry.aiLearning.getPredictResult();
                const result = predictResult.find((x) => x.className === predict);
                return result?.probability || 0;
            },
            params: [
                {
                    type: 'DropdownDynamic',
                    value: null,
                    menuName: DropDownDynamicGenerator.valueMap,
                    needDeepCopy: true,
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.AI_LEARNING,
                    arrowColor: EntryStatic.colorSet.common.WHITE,
                    defaultValue: (value, options) => {
                        if (options[0] && options[0][1]) {
                            return options[0][1];
                        }
                        return value || 0;
                    },
                },
            ],
        });
        const booleanPredictBlocks = createParamBlock({
            name: 'is_logistic_regression_result',
            skeleton: 'basic_boolean_field',
            length: 6,
            createFunc: (paramsKeyMap) => async (sprite, script) => {
                const keys = Object.keys(paramsKeyMap);
                const predictKey = keys.pop();
                const params = keys.map((key) => script.getNumberValue(key, script));
                const predict = script.getStringField(predictKey, script);
                await Entry.aiLearning.predict(params);
                const predictResult = Entry.aiLearning.getPredictResult();
                const result = predictResult.find((x) => x.className === predict);
                return !!result?.probability;
            },
            params: [
                {
                    type: 'DropdownDynamic',
                    value: null,
                    menuName: DropDownDynamicGenerator.valueMap,
                    needDeepCopy: true,
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.AI_LEARNING,
                    arrowColor: EntryStatic.colorSet.common.WHITE,
                    defaultValue: (value, options) => {
                        if (options[0] && options[0][1]) {
                            return options[0][1];
                        }
                        return value || 0;
                    },
                },
            ],
        });
        return {
            ...predictBlocks,
            ...probabilityBlocks,
            ...booleanPredictBlocks,
            learning_title_logistic_regression: {
                skeleton: 'basic_text',
                color: EntryStatic.colorSet.common.TRANSPARENT,
                params: [
                    {
                        type: 'Text',
                        text: Lang.template.learning_title_logistic_regression_str,
                        color: EntryStatic.colorSet.common.TEXT,
                        align: 'center',
                    },
                ],
                def: {
                    type: 'learning_title_logistic_regression',
                },
                class: 'ai_learning',
                isNotFor: ['ai_learning_logistic_regression'],
                events: {},
            },
            set_logistic_regression_option: {
                color: EntryStatic.colorSet.block.default.AI_LEARNING,
                outerLine: EntryStatic.colorSet.block.darken.AI_LEARNING,
                skeleton: 'basic',
                statements: [],
                params: [
                    {
                        type: 'Dropdown',
                        options: [
                            [Lang.AiLearning.train_param_learningRate, 'learningRate'],
                            [Lang.AiLearning.train_param_epochs, 'epochs'],
                            [Lang.AiLearning.train_param_validationRate, 'validationRate'],
                        ],
                        value: 'learningRate',
                        bgColor: EntryStatic.colorSet.block.darken.AI_LEARNING,
                        arrowColor: EntryStatic.colorSet.common.WHITE,
                    },
                    {
                        type: 'Block',
                        accept: 'string',
                        defaultType: 'number',
                    },
                    {
                        type: 'Indicator',
                        img: 'block_icon/ai_utilize_icon.svg',
                        size: 11,
                    },
                ],
                events: {},
                def: {
                    type: 'set_logistic_regression_option',
                },
                pyHelpDef: {
                    params: [],
                    type: 'set_logistic_regression_option',
                },
                paramsKeyMap: {
                    OPTION: 0,
                    VALUE: 1,
                },
                class: 'ai_learning',
                isNotFor: ['ai_learning_logistic_regression'],
                func(sprite, script) {
                    const option = script.getField('OPTION', script);
                    const value = script.getNumberValue('VALUE', script);
                    Entry.aiLearning.setTrainOption(option, parseFloat(value));
                    return script.callReturn();
                },
                syntax: {
                    js: [],
                    py: [],
                },
            },
            set_logistic_regression_optimizer: {
                color: EntryStatic.colorSet.block.default.AI_LEARNING,
                outerLine: EntryStatic.colorSet.block.darken.AI_LEARNING,
                skeleton: 'basic',
                statements: [],
                params: [
                    {
                        type: 'Dropdown',
                        options: [
                            [Lang.AiLearning.train_param_optimizer_adam, 'adam'],
                            [Lang.AiLearning.train_param_optimizer_sgd, 'sgd'],
                        ],
                        value: 'adam',
                        bgColor: EntryStatic.colorSet.block.darken.AI_LEARNING,
                        arrowColor: EntryStatic.colorSet.common.WHITE,
                    },
                    {
                        type: 'Indicator',
                        img: 'block_icon/ai_utilize_icon.svg',
                        size: 11,
                    },
                ],
                events: {},
                def: {
                    type: 'set_logistic_regression_optimizer',
                },
                pyHelpDef: {
                    params: [],
                    type: 'set_logistic_regression_optimizer',
                },
                paramsKeyMap: {
                    OPTIMIZER: 0,
                },
                class: 'ai_learning',
                isNotFor: ['ai_learning_logistic_regression'],
                func(sprite, script) {
                    const optimizer = script.getField('OPTIMIZER', script);
                    Entry.aiLearning.setTrainOption('optimizer', optimizer);
                    return script.callReturn();
                },
                syntax: {
                    js: [],
                    py: [],
                },
            },
            get_logistic_regression_result_info: {
                color: EntryStatic.colorSet.block.default.AI_LEARNING,
                outerLine: EntryStatic.colorSet.block.darken.AI_LEARNING,
                skeleton: 'basic_string_field',
                statements: [],
                params: [
                    {
                        type: 'Dropdown',
                        options: [
                            [Lang.AiLearning.accuracy, 'accuracy'],
                            [Lang.AiLearning.f1, 'f1'],
                            [Lang.AiLearning.precision, 'precision'],
                            [Lang.AiLearning.recall, 'recall'],
                        ],
                        value: 'accuracy',
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.AI_LEARNING,
                        arrowColor: EntryStatic.colorSet.common.WHITE,
                    },
                ],
                events: {},
                def: {
                    type: 'get_logistic_regression_result_info',
                },
                pyHelpDef: {
                    params: [],
                    type: 'get_logistic_regression_result_info',
                },
                paramsKeyMap: {
                    TYPE: 0,
                },
                class: 'ai_learning',
                isNotFor: ['ai_learning_logistic_regression'],
                async func(sprite, script) {
                    const type = script.getField('TYPE', script);
                    const result = Entry.aiLearning?.getTrainResult();
                    return result?.[type];
                },
                syntax: {
                    js: [],
                    py: [],
                },
            },
        };
    },
};
