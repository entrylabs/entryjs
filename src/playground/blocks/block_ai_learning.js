import _floor from 'lodash/floor';

const DropDownDynamicGenerator = {
    labels: () => {
        if (Entry?.aiLearning?.labels?.length) {
            return Entry.aiLearning.labels.map((name, index) => [name, index]);
        } else {
            return [[Lang.Blocks.no_target, 'null']];
        }
    },
    tableAttrFields: () => {
        const table = Entry.aiLearning?.getTableData?.();
        if (table) {
            const { select = [], fields } = table || {};
            const attr = select?.[0] || [];
            return attr.map((fieldIndex, idx) => [fields[fieldIndex], idx]);
        } else {
            return [[Lang.Blocks.no_target, 'null']];
        }
    },
    tablePredictDataDistinct: () => {
        if (Entry.aiLearning.labels) {
            return Entry.aiLearning.labels.map((item) => [item, item]);
        } else {
            return [[Lang.Blocks.no_target, 'null']];
        }
    }
}
module.exports = {
    getBlocks() {
        return {
            learning_title_image: {
                skeleton: 'basic_text',
                color: EntryStatic.colorSet.common.TRANSPARENT,
                params: [
                    {
                        type: 'Text',
                        text: Lang.template.learning_title_image_str,
                        color: EntryStatic.colorSet.common.TEXT,
                        align: 'center',
                    },
                ],
                def: {
                    type: 'learning_title_image',
                },
                class: 'ai_learning',
                isNotFor: ['ai_learning_image'],
                events: {},
            },
            learning_title_speech: {
                skeleton: 'basic_text',
                color: EntryStatic.colorSet.common.TRANSPARENT,
                params: [
                    {
                        type: 'Text',
                        text: Lang.template.learning_title_speech_str,
                        color: EntryStatic.colorSet.common.TEXT,
                        align: 'center',
                    },
                ],
                def: {
                    type: 'learning_title_speech',
                },
                class: 'ai_learning',
                isNotFor: ['ai_learning_speech'],
                events: {},
            },
            learning_title_text: {
                skeleton: 'basic_text',
                color: EntryStatic.colorSet.common.TRANSPARENT,
                params: [
                    {
                        type: 'Text',
                        text: Lang.template.learning_title_text_str,
                        color: EntryStatic.colorSet.common.TEXT,
                        align: 'center',
                    },
                ],
                def: {
                    type: 'learning_title_text',
                },
                class: 'ai_learning',
                isNotFor: ['ai_learning_text'],
                events: {},
            },
            learning_title_number: {
                skeleton: 'basic_text',
                color: EntryStatic.colorSet.common.TRANSPARENT,
                params: [
                    {
                        type: 'Text',
                        text: Lang.template.learning_title_number_str,
                        color: EntryStatic.colorSet.common.TEXT,
                        align: 'center',
                    },
                ],
                def: {
                    type: 'learning_title_number',
                },
                class: 'ai_learning',
                isNotFor: ['ai_learning_number'],
                events: {},
            },
            learning_title_regression: {
                skeleton: 'basic_text',
                color: EntryStatic.colorSet.common.TRANSPARENT,
                params: [
                    {
                        type: 'Text',
                        text: Lang.template.learning_title_regression_str,
                        color: EntryStatic.colorSet.common.TEXT,
                        align: 'center',
                    },
                ],
                def: {
                    type: 'learning_title_regression',
                },
                class: 'ai_learning',
                isNotFor: ['ai_learning_regression'],
                events: {},
            },
            learning_title_cluster: {
                skeleton: 'basic_text',
                color: EntryStatic.colorSet.common.TRANSPARENT,
                params: [
                    {
                        type: 'Text',
                        text: Lang.template.learning_title_cluster_str,
                        color: EntryStatic.colorSet.common.TEXT,
                        align: 'center',
                    },
                ],
                def: {
                    type: 'learning_title_cluster',
                },
                class: 'ai_learning',
                isNotFor: ['ai_learning_cluster'],
                events: {},
            },
            insert_data_for_test: {
                color: EntryStatic.colorSet.block.default.AI_LEARNING,
                outerLine: EntryStatic.colorSet.block.darken.AI_LEARNING,
                skeleton: 'basic',
                statements: [],
                params: [
                    {
                        type: 'Indicator',
                        img: 'block_icon/ai_utilize_icon.svg',
                        size: 11,
                    },
                ],
                events: {},
                def: {
                    params: [null],
                    type: 'insert_data_for_test',
                },
                pyHelpDef: {
                    params: [],
                    type: 'insert_data_for_test',
                },
                paramsKeyMap: {},
                class: 'ai_learning',
                isNotFor: ['ai_learning_classification'],
                func(sprite, script) {
                    if (!script.isStart) {
                        script.isStart = true;
                        Entry.aiLearning.openInputPopup();
                        return script;
                    }
                    if (!Entry.aiLearning.isLoading) {
                        delete script.isStart;
                        return script.callReturn();
                    }
                    return script;
                },
                syntax: {
                    js: [],
                    py: [],
                },
            },
            insert_text_block_for_test: {
                color: EntryStatic.colorSet.block.default.AI_LEARNING,
                outerLine: EntryStatic.colorSet.block.darken.AI_LEARNING,
                skeleton: 'basic',
                statements: [],
                params: [
                    {
                        type: 'Block',
                        accept: 'string',
                    },
                    {
                        type: 'Indicator',
                        img: 'block_icon/ai_utilize_icon.svg',
                        size: 11,
                    },
                ],
                events: {},
                def: {
                    params: [
                        {
                            type: 'text',
                            params: [Lang.Blocks.entry],
                        },
                        null,
                    ],
                    type: 'insert_text_block_for_test',
                },
                pyHelpDef: {
                    params: [],
                    type: 'insert_text_block_for_test',
                },
                paramsKeyMap: {
                    TEXT: 0,
                },
                class: 'ai_learning',
                isNotFor: ['ai_learning_text'],
                async func(sprite, script) {
                    const text = script.getStringValue('TEXT', script);
                    await Entry.aiLearning.predict(text);
                    return script.callReturn();
                },
                syntax: {
                    js: [],
                    py: [],
                },
            },
            test_result: {
                color: EntryStatic.colorSet.block.default.AI_LEARNING,
                outerLine: EntryStatic.colorSet.block.darken.AI_LEARNING,
                skeleton: 'basic_string_field',
                statements: [],
                params: [],
                events: {},
                def: {
                    params: [null],
                    type: 'test_result',
                },
                pyHelpDef: {
                    params: [],
                    type: 'test_result',
                },
                paramsKeyMap: {},
                class: 'ai_learning',
                isNotFor: ['ai_learning_classification'],
                func(sprite, script) {
                    return Entry.aiLearning.getPredictResult().className;
                },
                syntax: {
                    js: [],
                    py: [],
                },
            },
            accuracy_of_result: {
                color: EntryStatic.colorSet.block.default.AI_LEARNING,
                outerLine: EntryStatic.colorSet.block.darken.AI_LEARNING,
                skeleton: 'basic_string_field',
                statements: [],
                params: [
                    {
                        type: 'DropdownDynamic',
                        value: null,
                        menuName: DropDownDynamicGenerator.labels,
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
                events: {},
                def: {
                    params: [0],
                    type: 'accuracy_of_result',
                },
                pyHelpDef: {
                    params: [],
                    type: 'accuracy_of_result',
                },
                paramsKeyMap: {
                    GROUP: 0,
                },
                class: 'ai_learning',
                isNotFor: ['ai_learning_classification'],
                func(sprite, script) {
                    const group = script.getNumberValue('GROUP', script);
                    return Entry.aiLearning.getPredictResult(group).probability;
                },
                syntax: {
                    js: [],
                    py: [],
                },
            },
            is_group: {
                color: EntryStatic.colorSet.block.default.AI_LEARNING,
                outerLine: EntryStatic.colorSet.block.darken.AI_LEARNING,
                skeleton: 'basic_boolean_field',
                statements: [],
                params: [
                    {
                        type: 'DropdownDynamic',
                        value: null,
                        menuName: DropDownDynamicGenerator.labels,
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
                events: {},
                def: {
                    params: [0],
                    type: 'is_group',
                },
                class: 'ai_learning',
                isNotFor: ['ai_learning_classification'],
                paramsKeyMap: {
                    GROUP: 0,
                },
                func(sprite, script) {
                    const group = script.getNumberValue('GROUP', script);
                    const { labels } = Entry.aiLearning;
                    const result = Entry.aiLearning.getPredictResult().className;
                    return result === labels[group];
                },
                syntax: {
                    js: [],
                    py: [],
                },
            },
            retrain_model: {
                color: EntryStatic.colorSet.block.default.AI_LEARNING,
                outerLine: EntryStatic.colorSet.block.darken.AI_LEARNING,
                skeleton: 'basic',
                statements: [],
                params: [
                    {
                        type: 'Indicator',
                        img: 'block_icon/ai_utilize_icon.svg',
                        size: 11,
                    },
                ],
                events: {},
                def: {
                    params: [
                        null,
                    ],
                    type: 'retrain_model',
                },
                pyHelpDef: {
                    params: [],
                    type: 'retrain_model',
                },
                paramsKeyMap: {
                    TEXT: 0,
                },
                class: 'ai_learning',
                isNotFor: ['ai_learning_train'],
                async func(sprite, script) {
                    Entry.aiLearning.train();
                    return script.callReturn();
                },
                syntax: {
                    js: [],
                    py: [],
                },
            },
            model_is_trained: {
                color: EntryStatic.colorSet.block.default.AI_LEARNING,
                outerLine: EntryStatic.colorSet.block.darken.AI_LEARNING,
                skeleton: 'basic_boolean_field',
                statements: [],
                params: [
                ],
                events: {},
                def: {
                    type: 'model_is_trained',
                },
                class: 'ai_learning',
                isNotFor: ['ai_learning_train'],
                func(sprite, script) {
                    return Entry.aiLearning.isTrained();
                },
                syntax: {
                    js: [],
                    py: [],
                },
            },
            set_train_visible: {
                color: EntryStatic.colorSet.block.default.AI_LEARNING,
                outerLine: EntryStatic.colorSet.block.darken.AI_LEARNING,
                skeleton: 'basic',
                statements: [],
                params: [
                    {
                        type: 'Dropdown',
                        options: [
                            [Lang.AiLearning.show, 'show'],
                            [Lang.AiLearning.hide, 'hide'],
                        ],
                        value: 'show',
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
                    params: [
                        'show',
                        null,
                    ],
                    type: 'set_train_visible',
                },
                pyHelpDef: {
                    params: [],
                    type: 'set_train_visible',
                },
                paramsKeyMap: {
                    VISIBLE: 0,
                },
                class: 'ai_learning',
                isNotFor: ['ai_learning_train'],
                async func(sprite, script) {
                    const visible = script.getField('VISIBLE');
                    Entry.aiLearning.setVisible(visible === 'show' ? true : false);
                    return script.callReturn();
                },
                syntax: {
                    js: [],
                    py: [],
                },
            },
            set_train_chart: {
                color: EntryStatic.colorSet.block.default.AI_LEARNING,
                outerLine: EntryStatic.colorSet.block.darken.AI_LEARNING,
                skeleton: 'basic',
                statements: [],
                params: [
                    {
                        type: 'Dropdown',
                        options: [
                            [Lang.AiLearning.open, 'open'],
                            [Lang.AiLearning.close, 'close'],
                        ],
                        value: 'open',
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
                    params: [
                        'open',
                        null,
                    ],
                    type: 'set_train_chart',
                },
                pyHelpDef: {
                    params: [],
                    type: 'set_train_chart',
                },
                paramsKeyMap: {
                    VISIBLE: 0,
                },
                class: 'ai_learning',
                isNotFor: ['ai_learning_train_chart'],
                async func(sprite, script) {
                    const visible = script.getField('VISIBLE');
                    Entry.aiLearning.setChartVisible(visible === 'open' ? true : false);
                    return script.callReturn();
                },
                syntax: {
                    js: [],
                    py: [],
                },
            },
            set_regression_option: {
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
                    type: 'set_regression_option',
                },
                pyHelpDef: {
                    params: [],
                    type: 'set_regression_option',
                },
                paramsKeyMap: {
                    OPTION: 0,
                    VALUE: 1,
                },
                class: 'ai_learning',
                isNotFor: ['ai_learning_regression'],
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
            get_regression_predict_1: {
                color: EntryStatic.colorSet.block.default.AI_LEARNING,
                outerLine: EntryStatic.colorSet.block.darken.AI_LEARNING,
                skeleton: 'basic_string_field',
                statements: [],
                params: [
                    {
                        type: 'TextDynamic',
                        setValue: () => {
                            const table = Entry.aiLearning?.getTableData?.();
                            if(table) {
                                const {select = [], fields = []} = Entry.aiLearning?.getTableData?.();
                                return fields[select?.[0]?.[0]] || Lang.AiLearning.model_attr_str;
                            }
                            return Lang.AiLearning.model_attr_str;
                        }
                    },
                    {
                        type: 'Block',
                        accept: 'string',
                        defaultType: 'number',
                    },
                ],
                events: {},
                def: {
                    type: 'get_regression_predict_1',
                },
                pyHelpDef: {
                    params: [],
                    type: 'get_regression_predict_1',
                },
                paramsKeyMap: {
                    ATTR1: 1
                },
                class: 'ai_learning',
                isNotFor: ['regression_attr_1'],
                async func(sprite, script) {
                    const x = script.getNumberValue('ATTR1', script);
                    await Entry.aiLearning.predict(x);
                    return Entry.aiLearning.getPredictResult();
                },
                syntax: {
                    js: [],
                    py: [],
                },
            },
            get_regression_predict_2: {
                color: EntryStatic.colorSet.block.default.AI_LEARNING,
                outerLine: EntryStatic.colorSet.block.darken.AI_LEARNING,
                skeleton: 'basic_string_field',
                statements: [],
                params: [
                    {
                        type: 'TextDynamic',
                        setValue: () => {
                            const table = Entry.aiLearning?.getTableData?.();
                            if(table) {
                                const {select = [], fields = []} = Entry.aiLearning?.getTableData?.();
                                return fields[select?.[0]?.[0]] || Lang.AiLearning.model_attr_str;
                            }
                            return Lang.AiLearning.model_attr_str;
                        }
                    },
                    {
                        type: 'Block',
                        accept: 'string',
                        defaultType: 'number',
                    },
                    {
                        type: 'TextDynamic',
                        setValue: () => {
                            const table = Entry.aiLearning?.getTableData?.();
                            if(table) {
                                const {select = [], fields = []} = Entry.aiLearning?.getTableData?.();
                                return fields[select?.[0]?.[1]] || Lang.AiLearning.model_attr_str;
                            }
                            return Lang.AiLearning.model_attr_str;
                        }
                    },
                    {
                        type: 'Block',
                        accept: 'string',
                        defaultType: 'number',
                    },
                ],
                events: {},
                def: {
                    type: 'get_regression_predict_2',
                },
                pyHelpDef: {
                    params: [],
                    type: 'get_regression_predict_2',
                },
                paramsKeyMap: {
                    ATTR1: 1,
                    ATTR2: 3
                },
                class: 'ai_learning',
                isNotFor: ['regression_attr_2'],
                async func(sprite, script) {
                    const x = script.getNumberValue('ATTR1', script);
                    const y = script.getNumberValue('ATTR2', script);
                    await Entry.aiLearning.predict([x, y]);
                    return Entry.aiLearning.getPredictResult();
                },
                syntax: {
                    js: [],
                    py: [],
                },
            },
            get_regression_predict_3: {
                color: EntryStatic.colorSet.block.default.AI_LEARNING,
                outerLine: EntryStatic.colorSet.block.darken.AI_LEARNING,
                skeleton: 'basic_string_field',
                statements: [],
                params: [
                    {
                        type: 'TextDynamic',
                        setValue: () => {
                            const table = Entry.aiLearning?.getTableData?.();
                            if(table) {
                                const {select = [], fields = []} = Entry.aiLearning?.getTableData?.();
                                return fields[select?.[0]?.[0]] || Lang.AiLearning.model_attr_str;
                            }
                            return Lang.AiLearning.model_attr_str;
                        }
                    },
                    {
                        type: 'Block',
                        accept: 'string',
                        defaultType: 'number',
                    },
                    {
                        type: 'TextDynamic',
                        setValue: () => {
                            const table = Entry.aiLearning?.getTableData?.();
                            if(table) {
                                const {select = [], fields = []} = Entry.aiLearning?.getTableData?.();
                                return fields[select?.[0]?.[1]] || Lang.AiLearning.model_attr_str;
                            }
                            return Lang.AiLearning.model_attr_str;
                        }
                    },
                    {
                        type: 'Block',
                        accept: 'string',
                        defaultType: 'number',
                    },
                    {
                        type: 'TextDynamic',
                        setValue: () => {
                            const table = Entry.aiLearning?.getTableData?.();
                            if(table) {
                                const {select = [], fields = []} = Entry.aiLearning?.getTableData?.();
                                return fields[select?.[0]?.[2]] || Lang.AiLearning.model_attr_str;
                            }
                            return Lang.AiLearning.model_attr_str;
                        }
                    },
                    {
                        type: 'Block',
                        accept: 'string',
                        defaultType: 'number',
                    },
                ],
                events: {},
                def: {
                    type: 'get_regression_predict_3',
                },
                pyHelpDef: {
                    params: [],
                    type: 'get_regression_predict_3',
                },
                paramsKeyMap: {
                    ATTR1: 1,
                    ATTR2: 3,
                    ATTR3: 5
                },
                class: 'ai_learning',
                isNotFor: ['regression_attr_3'],
                async func(sprite, script) {
                    const x = script.getNumberValue('ATTR1', script);
                    const y = script.getNumberValue('ATTR2', script);
                    const z = script.getNumberValue('ATTR3', script);
                    await Entry.aiLearning.predict([x, y, z]);
                    return Entry.aiLearning.getPredictResult();
                },
                syntax: {
                    js: [],
                    py: [],
                },
            },
            get_regression_accuracy: {
                color: EntryStatic.colorSet.block.default.AI_LEARNING,
                outerLine: EntryStatic.colorSet.block.darken.AI_LEARNING,
                skeleton: 'basic_string_field',
                statements: [],
                params: [],
                events: {},
                def: {
                    type: 'get_regression_accuracy',
                },
                pyHelpDef: {
                    params: [],
                    type: 'get_regression_accuracy',
                },
                paramsKeyMap: {},
                class: 'ai_learning',
                isNotFor: ['ai_learning_regression'],
                async func(sprite, script) {
                    return Entry.aiLearning?.getTrainResult()?.rsquared;
                },
                syntax: {
                    js: [],
                    py: [],
                },
            },
            set_cluster_option_k: {
                color: EntryStatic.colorSet.block.default.AI_LEARNING,
                outerLine: EntryStatic.colorSet.block.darken.AI_LEARNING,
                skeleton: 'basic',
                statements: [],
                params: [
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
                    params: [
                        0,
                        null,
                    ],
                    type: 'set_cluster_option_k',
                },
                pyHelpDef: {
                    params: [],
                    type: 'set_cluster_option_k',
                },
                paramsKeyMap: {
                    VALUE: 0,
                },
                class: 'ai_learning',
                isNotFor: ['ai_learning_cluster'],
                async func(sprite, script) {
                    const value = script.getStringValue('VALUE', script);
                    Entry.aiLearning.setTrainOption('k', parseInt(value));
                    return script.callReturn();
                },
                syntax: {
                    js: [],
                    py: [],
                },
            },
            set_cluster_option_centroids: {
                color: EntryStatic.colorSet.block.default.AI_LEARNING,
                outerLine: EntryStatic.colorSet.block.darken.AI_LEARNING,
                skeleton: 'basic',
                statements: [],
                params: [
                    {
                        type: 'Dropdown',
                        options: [
                            [Lang.AiLearning.cluster_option_centroids_kmpp, 'kmpp'],
                            [Lang.AiLearning.cluster_option_centroids_random, 'random'],
                        ],
                        value: 'kmpp',
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
                    params: [
                        null,
                        null,
                    ],
                    type: 'set_cluster_option_centroids',
                },
                pyHelpDef: {
                    params: [],
                    type: 'set_cluster_option_centroids',
                },
                paramsKeyMap: {
                    CENTRIOD_TYPE: 0,
                },
                class: 'ai_learning',
                isNotFor: ['ai_learning_cluster'],
                async func(sprite, script) {
                    const value = script.getField('CENTRIOD_TYPE');
                    Entry.aiLearning.setTrainOption('initialCentroids', value);
                    return script.callReturn();
                },
                syntax: {
                    js: [],
                    py: [],
                },
            },
            get_cluster_centriod_count: {
                color: EntryStatic.colorSet.block.default.AI_LEARNING,
                outerLine: EntryStatic.colorSet.block.darken.AI_LEARNING,
                skeleton: 'basic_string_field',
                statements: [],
                params: [],
                events: {},
                def: {
                    params: [],
                    type: 'get_cluster_centriod_count',
                },
                pyHelpDef: {
                    params: [],
                    type: 'get_cluster_centriod_count',
                },
                paramsKeyMap: {},
                class: 'ai_learning',
                isNotFor: ['ai_learning_cluster'],
                func(sprite, script) {
                    const { k = 0 } = Entry.aiLearning.getTrainOption() || {};
                    return k;
                },
                syntax: {
                    js: [],
                    py: [],
                },
            },
            get_cluster_centriod_value: {
                color: EntryStatic.colorSet.block.default.AI_LEARNING,
                outerLine: EntryStatic.colorSet.block.darken.AI_LEARNING,
                skeleton: 'basic_string_field',
                statements: [],
                params: [
                    {
                        type: 'Block',
                        accept: 'string',
                        defaultType: 'number',
                    },
                    {
                        type: 'DropdownDynamic',
                        value: null,
                        menuName: DropDownDynamicGenerator.tableAttrFields,
                        needDeepCopy: true,
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.AI_LEARNING,
                        arrowColor: EntryStatic.colorSet.common.WHITE,
                        defaultValue: (value, options) => {
                            if(options[0] && options[0][1]){
                                return options[0][1];
                            }
                            return value || 0;
                        }
                    },
                ],
                events: {},
                def: {
                    params: [1,0],
                    type: 'get_cluster_centriod_value',
                },
                pyHelpDef: {
                    params: [],
                    type: 'get_cluster_centriod_value',
                },
                paramsKeyMap: {
                    K: 0,
                    ATTR: 1,
                },
                class: 'ai_learning',
                isNotFor: ['ai_learning_cluster'],
                func(sprite, script) {
                    const k = script.getNumberValue('K');
                    const attr = script.getField('ATTR');
                    const { centroids } = Entry.aiLearning.getTrainResult();
                    return centroids?.[k - 1]?.[attr] || NaN;
                },
                syntax: {
                    js: [],
                    py: [],
                },
            },
            get_cluster_centriod_index_1: {
                color: EntryStatic.colorSet.block.default.AI_LEARNING,
                outerLine: EntryStatic.colorSet.block.darken.AI_LEARNING,
                skeleton: 'basic_string_field',
                statements: [],
                params: [
                    {
                        type: 'TextDynamic',
                        setValue: () => {
                            const table = Entry.aiLearning?.getTableData?.();
                            if(table) {
                                const {select = [], fields = []} = Entry.aiLearning?.getTableData?.();
                                return fields[select?.[0]?.[0]] || Lang.AiLearning.model_attr_str;
                            }
                            return Lang.AiLearning.model_attr_str;
                        }
                    },
                    {
                        type: 'Block',
                        accept: 'string',
                        defaultType: 'number',
                    },
                ],
                def: {
                    type: 'get_cluster_centriod_index_1',
                },
                events: {},
                pyHelpDef: {
                    params: [],
                    type: 'get_cluster_centriod_index_1',
                },
                paramsKeyMap: {
                    ATTR1: 1
                },
                class: 'ai_learning',
                isNotFor: ['cluster_attr_1'],
                async func(sprite, script) {
                    const x = script.getNumberValue('ATTR1', script);
                    await Entry.aiLearning.predict({x});
                    return Entry.aiLearning.getPredictResult();
                },
                syntax: {
                    js: [],
                    py: [],
                },
            },
            get_cluster_centriod_index_2: {
                color: EntryStatic.colorSet.block.default.AI_LEARNING,
                outerLine: EntryStatic.colorSet.block.darken.AI_LEARNING,
                skeleton: 'basic_string_field',
                statements: [],
                params: [
                    {
                        type: 'TextDynamic',
                        setValue: () => {
                            const table = Entry.aiLearning?.getTableData?.();
                            if(table) {
                                const {select = [], fields = []} = Entry.aiLearning?.getTableData?.();
                                return fields[select?.[0]?.[0]] || Lang.AiLearning.model_attr_str;
                            }
                            return Lang.AiLearning.model_attr_str;
                        }
                    },
                    {
                        type: 'Block',
                        accept: 'string',
                        defaultType: 'number',
                    },
                    {
                        type: 'TextDynamic',
                        setValue: () => {
                            const table = Entry.aiLearning?.getTableData?.();
                            if(table) {
                                const {select = [], fields = []} = Entry.aiLearning?.getTableData?.();
                                return fields[select?.[0]?.[1]] || Lang.AiLearning.model_attr_str;
                            }
                            return Lang.AiLearning.model_attr_str;
                        }
                    },
                    {
                        type: 'Block',
                        accept: 'string',
                        defaultType: 'number',
                    },
                ],
                def: {
                    type: 'get_cluster_centriod_index_2',
                },
                events: {},
                pyHelpDef: {
                    params: [],
                    type: 'get_cluster_centriod_index_2',
                },
                paramsKeyMap: {
                    ATTR1: 1,
                    ATTR2: 3,
                },
                class: 'ai_learning',
                isNotFor: ['cluster_attr_2'],
                async func(sprite, script) {
                    const x = script.getNumberValue('ATTR1', script);
                    const y = script.getNumberValue('ATTR2', script);
                    await Entry.aiLearning.predict({x, y});
                    return Entry.aiLearning.getPredictResult();
                },
                syntax: {
                    js: [],
                    py: [],
                },
            },
            get_cluster_centriod_index_3: {
                color: EntryStatic.colorSet.block.default.AI_LEARNING,
                outerLine: EntryStatic.colorSet.block.darken.AI_LEARNING,
                skeleton: 'basic_string_field',
                statements: [],
                params: [
                    {
                        type: 'TextDynamic',
                        setValue: () => {
                            const table = Entry.aiLearning?.getTableData?.();
                            if(table) {
                                const {select = [], fields = []} = Entry.aiLearning?.getTableData?.();
                                return fields[select?.[0]?.[0]] || Lang.AiLearning.model_attr_str;
                            }
                            return Lang.AiLearning.model_attr_str;
                        }
                    },
                    {
                        type: 'Block',
                        accept: 'string',
                        defaultType: 'number',
                    },
                    {
                        type: 'TextDynamic',
                        setValue: () => {
                            const table = Entry.aiLearning?.getTableData?.();
                            if(table) {
                                const {select = [], fields = []} = Entry.aiLearning?.getTableData?.();
                                return fields[select?.[0]?.[1]] || Lang.AiLearning.model_attr_str;
                            }
                            return Lang.AiLearning.model_attr_str;
                        }
                    },
                    {
                        type: 'Block',
                        accept: 'string',
                        defaultType: 'number',
                    },
                    {
                        type: 'TextDynamic',
                        setValue: () => {
                            const table = Entry.aiLearning?.getTableData?.();
                            if(table) {
                                const {select = [], fields = []} = Entry.aiLearning?.getTableData?.();
                                return fields[select?.[0]?.[2]] || Lang.AiLearning.model_attr_str;
                            }
                            return Lang.AiLearning.model_attr_str;
                        }
                    },
                    {
                        type: 'Block',
                        accept: 'string',
                        defaultType: 'number',
                    },
                ],
                def: {
                    type: 'get_cluster_centriod_index_3',
                },
                events: {},
                pyHelpDef: {
                    params: [],
                    type: 'get_cluster_centriod_index_3',
                },
                paramsKeyMap: {
                    ATTR1: 1,
                    ATTR2: 3,
                    ATTR3: 5,
                },
                class: 'ai_learning',
                isNotFor: ['cluster_attr_3'],
                async func(sprite, script) {
                    const x = script.getNumberValue('ATTR1', script);
                    const y = script.getNumberValue('ATTR2', script);
                    const z = script.getNumberValue('ATTR3', script);
                    await Entry.aiLearning.predict({x, y, z});
                    return Entry.aiLearning.getPredictResult();
                },
                syntax: {
                    js: [],
                    py: [],
                },
            },
            set_number_learning_option_k: {
                color: EntryStatic.colorSet.block.default.AI_LEARNING,
                outerLine: EntryStatic.colorSet.block.darken.AI_LEARNING,
                skeleton: 'basic',
                statements: [],
                params: [
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
                    params: [
                        10,
                        null,
                    ],
                    type: 'set_number_learning_option_k',
                },
                pyHelpDef: {
                    params: [],
                    type: 'set_number_learning_option_k',
                },
                paramsKeyMap: {
                    VALUE: 0,
                },
                class: 'ai_learning',
                isNotFor: ['ai_learning_number'],
                async func(sprite, script) {
                    const value = script.getNumberValue('VALUE', script);
                    Entry.aiLearning.setTrainOption('neighbors', parseInt(value));
                    return script.callReturn();
                },
                syntax: {
                    js: [],
                    py: [],
                },
            },
            get_number_learning_predict_1: {
                color: EntryStatic.colorSet.block.default.AI_LEARNING,
                outerLine: EntryStatic.colorSet.block.darken.AI_LEARNING,
                skeleton: 'basic_string_field',
                statements: [],
                params: [
                    {
                        type: 'TextDynamic',
                        setValue: () => {
                            const table = Entry.aiLearning?.getTableData?.();
                            if(table) {
                                const {select = [], fields = []} = Entry.aiLearning?.getTableData?.();
                                return fields[select?.[0]?.[0]] || Lang.AiLearning.model_attr_str;
                            }
                            return Lang.AiLearning.model_attr_str;
                        }
                    },
                    {
                        type: 'Block',
                        accept: 'string',
                        defaultType: 'number',
                    },
                ],
                events: {},
                def: {
                    type: 'get_number_learning_predict_1',
                },
                pyHelpDef: {
                    params: [],
                    type: 'get_number_learning_predict_1',
                },
                paramsKeyMap: {
                    ATTR1: 1
                },
                class: 'ai_learning',
                isNotFor: ['number_learning_attr_1'],
                async func(sprite, script) {
                    const x = script.getNumberValue('ATTR1', script);
                    await Entry.aiLearning.predict([x]);
                    const [{ className }] = Entry.aiLearning.getPredictResult();
                    return className;
                },
                syntax: {
                    js: [],
                    py: [],
                },
            },
            get_number_learning_predict_2: {
                color: EntryStatic.colorSet.block.default.AI_LEARNING,
                outerLine: EntryStatic.colorSet.block.darken.AI_LEARNING,
                skeleton: 'basic_string_field',
                statements: [],
                params: [
                    {
                        type: 'TextDynamic',
                        setValue: () => {
                            const table = Entry.aiLearning?.getTableData?.();
                            if(table) {
                                const {select = [], fields = []} = Entry.aiLearning?.getTableData?.();
                                return fields[select?.[0]?.[0]] || Lang.AiLearning.model_attr_str;
                            }
                            return Lang.AiLearning.model_attr_str;
                        }
                    },
                    {
                        type: 'Block',
                        accept: 'string',
                        defaultType: 'number',
                    },
                    {
                        type: 'TextDynamic',
                        setValue: () => {
                            const table = Entry.aiLearning?.getTableData?.();
                            if(table) {
                                const {select = [], fields = []} = Entry.aiLearning?.getTableData?.();
                                return fields[select?.[0]?.[1]] || Lang.AiLearning.model_attr_str;
                            }
                            return Lang.AiLearning.model_attr_str;
                        }
                    },
                    {
                        type: 'Block',
                        accept: 'string',
                        defaultType: 'number',
                    },
                ],
                events: {},
                def: {
                    type: 'get_number_learning_predict_2',
                },
                pyHelpDef: {
                    params: [],
                    type: 'get_number_learning_predict_2',
                },
                paramsKeyMap: {
                    ATTR1: 1,
                    ATTR2: 3
                },
                class: 'ai_learning',
                isNotFor: ['number_learning_attr_2'],
                async func(sprite, script) {
                    const x = script.getNumberValue('ATTR1', script);
                    const y = script.getNumberValue('ATTR2', script);
                    await Entry.aiLearning.predict([x, y]);
                    const [{ className }] = Entry.aiLearning.getPredictResult();
                    return className;
                },
                syntax: {
                    js: [],
                    py: [],
                },
            },
            get_number_learning_predict_3: {
                color: EntryStatic.colorSet.block.default.AI_LEARNING,
                outerLine: EntryStatic.colorSet.block.darken.AI_LEARNING,
                skeleton: 'basic_string_field',
                statements: [],
                params: [
                    {
                        type: 'TextDynamic',
                        setValue: () => {
                            const table = Entry.aiLearning?.getTableData?.();
                            if(table) {
                                const {select = [], fields = []} = Entry.aiLearning?.getTableData?.();
                                return fields[select?.[0]?.[0]] || Lang.AiLearning.model_attr_str;
                            }
                            return Lang.AiLearning.model_attr_str;
                        }
                    },
                    {
                        type: 'Block',
                        accept: 'string',
                        defaultType: 'number',
                    },
                    {
                        type: 'TextDynamic',
                        setValue: () => {
                            const table = Entry.aiLearning?.getTableData?.();
                            if(table) {
                                const {select = [], fields = []} = Entry.aiLearning?.getTableData?.();
                                return fields[select?.[0]?.[1]] || Lang.AiLearning.model_attr_str;
                            }
                            return Lang.AiLearning.model_attr_str;
                        }
                    },
                    {
                        type: 'Block',
                        accept: 'string',
                        defaultType: 'number',
                    },
                    {
                        type: 'TextDynamic',
                        setValue: () => {
                            const table = Entry.aiLearning?.getTableData?.();
                            if(table) {
                                const {select = [], fields = []} = Entry.aiLearning?.getTableData?.();
                                return fields[select?.[0]?.[2]] || Lang.AiLearning.model_attr_str;
                            }
                            return Lang.AiLearning.model_attr_str;
                        }
                    },
                    {
                        type: 'Block',
                        accept: 'string',
                        defaultType: 'number',
                    },
                ],
                events: {},
                def: {
                    type: 'get_number_learning_predict_3',
                },
                pyHelpDef: {
                    params: [],
                    type: 'get_number_learning_predict_3',
                },
                paramsKeyMap: {
                    ATTR1: 1,
                    ATTR2: 3,
                    ATTR3: 5,
                },
                class: 'ai_learning',
                isNotFor: ['number_learning_attr_3'],
                async func(sprite, script) {
                    const x = script.getNumberValue('ATTR1', script);
                    const y = script.getNumberValue('ATTR3', script);
                    const z = script.getNumberValue('ATTR5', script);
                    await Entry.aiLearning.predict([x, y, z]);
                    const [{ className }] = Entry.aiLearning.getPredictResult();
                    return className;
                },
                syntax: {
                    js: [],
                    py: [],
                },
            },
            get_number_learning_predict_param_1: {
                color: EntryStatic.colorSet.block.default.AI_LEARNING,
                outerLine: EntryStatic.colorSet.block.darken.AI_LEARNING,
                skeleton: 'basic_string_field',
                statements: [],
                params: [
                    {
                        type: 'TextDynamic',
                        setValue: () => {
                            const table = Entry.aiLearning?.getTableData?.();
                            if(table) {
                                const {select = [], fields = []} = Entry.aiLearning?.getTableData?.();
                                return fields[select?.[0]?.[0]] || Lang.AiLearning.model_attr_str;
                            }
                            return Lang.AiLearning.model_attr_str;
                        }
                    },
                    {
                        type: 'Block',
                        accept: 'string',
                        defaultType: 'number',
                    },
                    {
                        type: 'DropdownDynamic',
                        value: null,
                        menuName: DropDownDynamicGenerator.tablePredictDataDistinct,
                        needDeepCopy: true,
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.AI_LEARNING,
                        arrowColor: EntryStatic.colorSet.common.WHITE,
                        defaultValue: (value, options) => {
                            if(options[0] && options[0][1]){
                                return options[0][1];
                            }
                            return value || 0;
                        }
                    },
                    {
                        type: 'Dropdown',
                        options: [
                            [Lang.AiLearning.probability, 'probability'],
                            [Lang.AiLearning.neighbor_count, 'count'],
                        ],
                        value: 'probability',
                        bgColor: EntryStatic.colorSet.block.darken.AI_LEARNING,
                        arrowColor: EntryStatic.colorSet.common.WHITE,
                    },
                ],
                events: {},
                def: {
                    type: 'get_number_learning_predict_param_1',
                },
                pyHelpDef: {
                    params: [],
                    type: 'get_number_learning_predict_param_1',
                },
                paramsKeyMap: {
                    ATTR1: 1,
                    CLASS: 2,
                    OPTION: 3,
                },
                class: 'ai_learning',
                isNotFor: ['number_learning_attr_1'],
                async func(sprite, script) {
                    const x = script.getNumberValue('ATTR1', script);
                    const clazz = script.getField('CLASS', script);
                    const option = script.getField('OPTION', script);
                    await Entry.aiLearning.predict([x]);
                    const result = Entry.aiLearning.getPredictResult();
                    const classData = result.find(({className}) => className === clazz) || {};
                    return classData[option] || 0;
                },
                syntax: {
                    js: [],
                    py: [],
                },
            },
            get_number_learning_predict_param_2: {
                color: EntryStatic.colorSet.block.default.AI_LEARNING,
                outerLine: EntryStatic.colorSet.block.darken.AI_LEARNING,
                skeleton: 'basic_string_field',
                statements: [],
                params: [
                    {
                        type: 'TextDynamic',
                        setValue: () => {
                            const table = Entry.aiLearning?.getTableData?.();
                            if(table) {
                                const {select = [], fields = []} = Entry.aiLearning?.getTableData?.();
                                return fields[select?.[0]?.[0]] || Lang.AiLearning.model_attr_str;
                            }
                            return Lang.AiLearning.model_attr_str;
                        }
                    },
                    {
                        type: 'Block',
                        accept: 'string',
                        defaultType: 'number',
                    },
                    {
                        type: 'TextDynamic',
                        setValue: () => {
                            const table = Entry.aiLearning?.getTableData?.();
                            if(table) {
                                const {select = [], fields = []} = Entry.aiLearning?.getTableData?.();
                                return fields[select?.[0]?.[1]] || Lang.AiLearning.model_attr_str;
                            }
                            return Lang.AiLearning.model_attr_str;
                        }
                    },
                    {
                        type: 'Block',
                        accept: 'string',
                        defaultType: 'number',
                    },
                    {
                        type: 'DropdownDynamic',
                        value: null,
                        menuName: DropDownDynamicGenerator.tablePredictDataDistinct,
                        needDeepCopy: true,
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.AI_LEARNING,
                        arrowColor: EntryStatic.colorSet.common.WHITE,
                        defaultValue: (value, options) => {
                            if(options[0] && options[0][1]){
                                return options[0][1];
                            }
                            return value || 0;
                        }
                    },
                    {
                        type: 'Dropdown',
                        options: [
                            [Lang.AiLearning.probability, 'probability'],
                            [Lang.AiLearning.neighbor_count, 'count'],
                        ],
                        value: 'probability',
                        bgColor: EntryStatic.colorSet.block.darken.AI_LEARNING,
                        arrowColor: EntryStatic.colorSet.common.WHITE,
                    },
                ],
                events: {},
                def: {
                    type: 'get_number_learning_predict_param_2',
                },
                pyHelpDef: {
                    params: [],
                    type: 'get_number_learning_predict_param_2',
                },
                paramsKeyMap: {
                    ATTR1: 1,
                    ATTR2: 3,
                    CLASS: 4,
                    OPTION: 5,
                },
                class: 'ai_learning',
                isNotFor: ['number_learning_attr_2'],
                async func(sprite, script) {
                    const x = script.getNumberValue('ATTR1', script);
                    const y = script.getNumberValue('ATTR2', script);
                    const clazz = script.getField('CLASS', script);
                    const option = script.getField('OPTION', script);
                    await Entry.aiLearning.predict([x, y]);
                    const result = Entry.aiLearning.getPredictResult();
                    const classData = result.find(({className}) => className === clazz) || {};
                    return classData[option] || 0;
                },
                syntax: {
                    js: [],
                    py: [],
                },
            },
            get_number_learning_predict_param_3: {
                color: EntryStatic.colorSet.block.default.AI_LEARNING,
                outerLine: EntryStatic.colorSet.block.darken.AI_LEARNING,
                skeleton: 'basic_string_field',
                statements: [],
                params: [
                    {
                        type: 'TextDynamic',
                        setValue: () => {
                            const table = Entry.aiLearning?.getTableData?.();
                            if(table) {
                                const {select = [], fields = []} = Entry.aiLearning?.getTableData?.();
                                return fields[select?.[0]?.[0]] || Lang.AiLearning.model_attr_str;
                            }
                            return Lang.AiLearning.model_attr_str;
                        }
                    },
                    {
                        type: 'Block',
                        accept: 'string',
                        defaultType: 'number',
                    },
                    {
                        type: 'TextDynamic',
                        setValue: () => {
                            const table = Entry.aiLearning?.getTableData?.();
                            if(table) {
                                const {select = [], fields = []} = Entry.aiLearning?.getTableData?.();
                                return fields[select?.[0]?.[1]] || Lang.AiLearning.model_attr_str;
                            }
                            return Lang.AiLearning.model_attr_str;
                        }
                    },
                    {
                        type: 'Block',
                        accept: 'string',
                        defaultType: 'number',
                    },
                    {
                        type: 'TextDynamic',
                        setValue: () => {
                            const table = Entry.aiLearning?.getTableData?.();
                            if(table) {
                                const {select = [], fields = []} = Entry.aiLearning?.getTableData?.();
                                return fields[select?.[0]?.[2]] || Lang.AiLearning.model_attr_str;
                            }
                            return Lang.AiLearning.model_attr_str;
                        }
                    },
                    {
                        type: 'Block',
                        accept: 'string',
                        defaultType: 'number',
                    },
                    {
                        type: 'DropdownDynamic',
                        value: null,
                        menuName: DropDownDynamicGenerator.tablePredictDataDistinct,
                        needDeepCopy: true,
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.AI_LEARNING,
                        arrowColor: EntryStatic.colorSet.common.WHITE,
                        defaultValue: (value, options) => {
                            if(options[0] && options[0][1]){
                                return options[0][1];
                            }
                            return value || 0;
                        }
                    },
                    {
                        type: 'Dropdown',
                        options: [
                            [Lang.AiLearning.probability, 'probability'],
                            [Lang.AiLearning.neighbor_count, 'count'],
                        ],
                        value: 'probability',
                        bgColor: EntryStatic.colorSet.block.darken.AI_LEARNING,
                        arrowColor: EntryStatic.colorSet.common.WHITE,
                    },
                ],
                events: {},
                def: {
                    type: 'get_number_learning_predict_param_3',
                },
                pyHelpDef: {
                    params: [],
                    type: 'get_number_learning_predict_param_3',
                },
                paramsKeyMap: {
                    ATTR1: 1,
                    ATTR2: 3,
                    ATTR3: 5,
                    CLASS: 6,
                    OPTION: 7,
                },
                class: 'ai_learning',
                isNotFor: ['number_learning_attr_3'],
                async func(sprite, script) {
                    const x = script.getNumberValue('ATTR1', script);
                    const y = script.getNumberValue('ATTR2', script);
                    const z = script.getNumberValue('ATTR3', script);
                    const clazz = script.getField('CLASS', script);
                    const option = script.getField('OPTION', script);
                    await Entry.aiLearning.predict([x, y, z]);
                    const result = Entry.aiLearning.getPredictResult();
                    const classData = result.find(({className}) => className === clazz) || {};
                    return classData[option] || 0;
                },
                syntax: {
                    js: [],
                    py: [],
                },
            },
            is_number_learning_group_1: {
                color: EntryStatic.colorSet.block.default.AI_LEARNING,
                outerLine: EntryStatic.colorSet.block.darken.AI_LEARNING,
                skeleton: 'basic_boolean_field',
                statements: [],
                params: [
                    {
                        type: 'TextDynamic',
                        setValue: () => {
                            const table = Entry.aiLearning?.getTableData?.();
                            if(table) {
                                const {select = [], fields = []} = Entry.aiLearning?.getTableData?.();
                                return fields[select?.[0]?.[0]] || Lang.AiLearning.model_attr_str;
                            }
                            return Lang.AiLearning.model_attr_str;
                        }
                    },
                    {
                        type: 'Block',
                        accept: 'string',
                        defaultType: 'number',
                    },
                    {
                        type: 'DropdownDynamic',
                        value: null,
                        menuName: DropDownDynamicGenerator.tablePredictDataDistinct,
                        needDeepCopy: true,
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.AI_LEARNING,
                        arrowColor: EntryStatic.colorSet.common.WHITE,
                        defaultValue: (value, options) => {
                            if(options[0] && options[0][1]){
                                return options[0][1];
                            }
                            return value || 0;
                        }
                    },
                ],
                events: {},
                def: {
                    params: [0],
                    type: 'is_number_learning_group_1',
                },
                pyHelpDef: {
                    params: [],
                    type: 'is_number_learning_group_1',
                },
                class: 'ai_learning',
                isNotFor: ['number_learning_attr_1'],
                paramsKeyMap: {
                    ATTR1: 1,
                    CLASS: 2,
                },
                async func(sprite, script) {
                    const x = script.getNumberValue('ATTR1', script);
                    const clazz = script.getField('CLASS', script);
                    await Entry.aiLearning.predict([x]);
                    const [{className}] = Entry.aiLearning.getPredictResult();
                    return className === clazz;
                },
                syntax: {
                    js: [],
                    py: [],
                },
            },
            is_number_learning_group_2: {
                color: EntryStatic.colorSet.block.default.AI_LEARNING,
                outerLine: EntryStatic.colorSet.block.darken.AI_LEARNING,
                skeleton: 'basic_boolean_field',
                statements: [],
                params: [
                    {
                        type: 'TextDynamic',
                        setValue: () => {
                            const table = Entry.aiLearning?.getTableData?.();
                            if(table) {
                                const {select = [], fields = []} = Entry.aiLearning?.getTableData?.();
                                return fields[select?.[0]?.[0]] || Lang.AiLearning.model_attr_str;
                            }
                            return Lang.AiLearning.model_attr_str;
                        }
                    },
                    {
                        type: 'Block',
                        accept: 'string',
                        defaultType: 'number',
                    },
                    {
                        type: 'TextDynamic',
                        setValue: () => {
                            const table = Entry.aiLearning?.getTableData?.();
                            if(table) {
                                const {select = [], fields = []} = Entry.aiLearning?.getTableData?.();
                                return fields[select?.[0]?.[1]] || Lang.AiLearning.model_attr_str;
                            }
                            return Lang.AiLearning.model_attr_str;
                        }
                    },
                    {
                        type: 'Block',
                        accept: 'string',
                        defaultType: 'number',
                    },
                    {
                        type: 'DropdownDynamic',
                        value: null,
                        menuName: DropDownDynamicGenerator.tablePredictDataDistinct,
                        needDeepCopy: true,
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.AI_LEARNING,
                        arrowColor: EntryStatic.colorSet.common.WHITE,
                        defaultValue: (value, options) => {
                            if(options[0] && options[0][1]){
                                return options[0][1];
                            }
                            return value || 0;
                        }
                    },
                ],
                events: {},
                def: {
                    params: [0],
                    type: 'is_number_learning_group_2',
                },
                pyHelpDef: {
                    params: [],
                    type: 'is_number_learning_group_2',
                },
                class: 'ai_learning',
                isNotFor: ['number_learning_attr_2'],
                paramsKeyMap: {
                    ATTR1: 1,
                    ATTR2: 3,
                    CLASS: 4,
                },
                async func(sprite, script) {
                    const x = script.getNumberValue('ATTR1', script);
                    const y = script.getNumberValue('ATTR2', script);
                    const clazz = script.getField('CLASS', script);
                    await Entry.aiLearning.predict([x, y]);
                    const [{className}] = Entry.aiLearning.getPredictResult();
                    return className === clazz;
                },
                syntax: {
                    js: [],
                    py: [],
                },
            },
            is_number_learning_group_3: {
                color: EntryStatic.colorSet.block.default.AI_LEARNING,
                outerLine: EntryStatic.colorSet.block.darken.AI_LEARNING,
                skeleton: 'basic_boolean_field',
                statements: [],
                params: [
                    {
                        type: 'TextDynamic',
                        setValue: () => {
                            const table = Entry.aiLearning?.getTableData?.();
                            if(table) {
                                const {select = [], fields = []} = Entry.aiLearning?.getTableData?.();
                                return fields[select?.[0]?.[0]] || Lang.AiLearning.model_attr_str;
                            }
                            return Lang.AiLearning.model_attr_str;
                        }
                    },
                    {
                        type: 'Block',
                        accept: 'string',
                        defaultType: 'number',
                    },
                    {
                        type: 'TextDynamic',
                        setValue: () => {
                            const table = Entry.aiLearning?.getTableData?.();
                            if(table) {
                                const {select = [], fields = []} = Entry.aiLearning?.getTableData?.();
                                return fields[select?.[0]?.[1]] || Lang.AiLearning.model_attr_str;
                            }
                            return Lang.AiLearning.model_attr_str;
                        }
                    },
                    {
                        type: 'Block',
                        accept: 'string',
                        defaultType: 'number',
                    },
                    {
                        type: 'TextDynamic',
                        setValue: () => {
                            const table = Entry.aiLearning?.getTableData?.();
                            if(table) {
                                const {select = [], fields = []} = Entry.aiLearning?.getTableData?.();
                                return fields[select?.[0]?.[2]] || Lang.AiLearning.model_attr_str;
                            }
                            return Lang.AiLearning.model_attr_str;
                        }
                    },
                    {
                        type: 'Block',
                        accept: 'string',
                        defaultType: 'number',
                    },
                    {
                        type: 'DropdownDynamic',
                        value: null,
                        menuName: DropDownDynamicGenerator.tablePredictDataDistinct,
                        needDeepCopy: true,
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.AI_LEARNING,
                        arrowColor: EntryStatic.colorSet.common.WHITE,
                        defaultValue: (value, options) => {
                            if(options[0] && options[0][1]){
                                return options[0][1];
                            }
                            return value || 0;
                        }
                    },
                ],
                events: {},
                def: {
                    params: [0],
                    type: 'is_number_learning_group_3',
                },
                pyHelpDef: {
                    params: [],
                    type: 'is_number_learning_group_3',
                },
                class: 'ai_learning',
                isNotFor: ['number_learning_attr_3'],
                paramsKeyMap: {
                    ATTR1: 1,
                    ATTR2: 3,
                    ATTR3: 5,
                    CLASS: 6,
                },
                async func(sprite, script) {
                    const x = script.getNumberValue('ATTR1', script);
                    const y = script.getNumberValue('ATTR2', script);
                    const z = script.getNumberValue('ATTR3', script);
                    const clazz = script.getField('CLASS', script);
                    await Entry.aiLearning.predict([x, y, z]);
                    const [{className}] = Entry.aiLearning.getPredictResult();
                    return className === clazz;
                },
                syntax: {
                    js: [],
                    py: [],
                },
            }
        };
    },
};
