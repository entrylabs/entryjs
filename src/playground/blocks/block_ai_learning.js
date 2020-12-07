import _floor from 'lodash/floor';

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
                    return Entry.aiLearning.getResult().className;
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
                        menuName: () => {
                            if (Entry?.aiLearning?.labels?.length) {
                                return Entry.aiLearning.labels.map((name, index) => [name, index]);
                            } else {
                                return [[Lang.Blocks.no_target, 'null']];
                            }
                        },
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
                    return Entry.aiLearning.getResult(group).probability;
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
                        menuName: () => {
                            if (Entry?.aiLearning?.labels?.length) {
                                return Entry.aiLearning.labels.map((name, index) => [name, index]);
                            } else {
                                return [[Lang.Blocks.no_target, 'null']];
                            }
                        },
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
                    const result = Entry.aiLearning.getResult().className;
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
                    console.log('set_train_chart', visible);
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
                        accept: 'number',
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
                    Entry.aiLearning.setTrainOption(option, parseInt(value));
                    return 0;
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
                        accept: 'number',
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
                    return Entry.aiLearning.result;
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
                        accept: 'number',
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
                        accept: 'number',
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
                    return Entry.aiLearning.result;
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
                        accept: 'number',
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
                        accept: 'number',
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
                        accept: 'number',
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
                    return Entry.aiLearning.result;
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
                    return _floor(Entry.aiLearning?.result?.accuracy || 0, 3);
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
                        accept: 'number',
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
                        accept: 'number',
                    },
                    {
                        type: 'DropdownDynamic',
                        value: null,
                        menuName: () => {
                            const table = Entry.aiLearning?.getTableData?.();
                            if(table) {
                                const { select = [], fields } = table || {};
                                const attr = select?.[0] || [];
                                return attr.map((fieldIndex, idx) => [fields[fieldIndex], idx]);
                            } else {
                                return [[Lang.Blocks.no_target, 'null']];
                            }
                        },
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
                    const { centroids } = Entry.aiLearning.getResult();
                    return centroids[k + 1][attr];
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
                        accept: 'number',
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
                    return Entry.aiLearning.result;
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
                        accept: 'number',
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
                        accept: 'number',
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
                    return Entry.aiLearning.result;
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
                        accept: 'number',
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
                        accept: 'number',
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
                        accept: 'number',
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
                    return Entry.aiLearning.result;
                },
                syntax: {
                    js: [],
                    py: [],
                },
            }
        };
    },
};
