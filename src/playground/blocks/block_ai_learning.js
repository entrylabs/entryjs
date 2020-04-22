import VideoUtils from '../../util/videoUtils';

module.exports = {
    getBlocks() {
        return {
            learning_title: {
                skeleton: 'basic_text',
                color: EntryStatic.colorSet.common.TRANSPARENT,
                params: [
                    {
                        type: 'Text',
                        text: Lang.template.learning_title_text,
                        color: EntryStatic.colorSet.common.TEXT,
                        align: 'center',
                    },
                ],
                def: {
                    type: 'learning_title',
                },
                class: 'ai_learning',
                isNotFor: ['ai_learning'],
                events: {},
            },
            insert_data_for_test: {
                color: EntryStatic.colorSet.block.default.AI_LEARNING,
                outerLine: EntryStatic.colorSet.block.darken.AI_LEARNING,
                skeleton: 'basic',
                statements: [],
                params: [
                    {
                        type: 'Dropdown',
                        options: [
                            [Lang.Blocks.learn_type_image, 'image'],
                        ],
                        value: 'image',
                        fontSize: 10,
                        bgColor: EntryStatic.colorSet.block.darken.AI_LEARNING,
                        arrowColor: EntryStatic.colorSet.arrow.default.DEFAULT,
                    },
                    {
                        type: 'Indicator',
                        img: 'block_icon/ai_utilize_icon.svg',
                        size: 11,
                    }
                ],
                events: {},
                def: {
                    params: [
                        'image',
                        null,
                    ],
                    type: 'insert_data_for_test',
                },
                pyHelpDef: {
                    params: ['A&value'],
                    type: 'insert_data_for_test',
                },
                paramsKeyMap: {
                    TYPE: 0,
                },
                class: 'ai_learning',
                isNotFor: ['ai_learning'],
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
                paramsKeyMap: {
                },
                class: 'ai_learning',
                isNotFor: ['ai_learning'],
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
                        menuName: () => Entry.aiLearning.labels.map((name, index) => [name, index]),
                        needDeepCopy: true,
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.AI_LEARNING,
                        arrowColor: EntryStatic.colorSet.common.WHITE,
                        defaultValue: (value, options) => {
                            if(options[0] && options[0][1]){
                                return options[0][1];
                            }
                            return 0;
                        }
                    }
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
                isNotFor: ['ai_learning'],
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
                        menuName: () => Entry.aiLearning.labels.map((name, index) => [name, index]),
                        needDeepCopy: true,
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.AI_LEARNING,
                        arrowColor: EntryStatic.colorSet.common.WHITE,
                        defaultValue: (value, options) => {
                            if(options[0] && options[0][1]){
                                return options[0][1];
                            }
                            return 0;
                        }
                    }
                ],
                events: {},
                def: {
                    params: [0],
                    type: 'is_group',
                },
                class: 'ai_learning',
                isNotFor: ['ai_learning'],
                paramsKeyMap: {
                    GROUP: 0,
                },
                func(sprite, script) {
                    const group = script.getNumberValue('GROUP', script)
                    const {labels} = Entry.aiLearning;
                    const result = Entry.aiLearning.getResult().className;
                    return result === labels[group];
                },
                syntax: {
                    js: [],
                    py: [],
                },
            }
        };
    },
};
