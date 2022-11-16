import { createParamBlock, DropDownDynamicGenerator } from './block_ai_learning';

module.exports = {
    getBlocks() {
        return {
            learning_title_decisiontree: {
                skeleton: 'basic_text',
                color: EntryStatic.colorSet.common.TRANSPARENT,
                params: [
                    {
                        type: 'Text',
                        text: Lang.template.learning_title_decisiontree_str,
                        color: EntryStatic.colorSet.common.TEXT,
                        align: 'center',
                    },
                ],
                def: {
                    type: 'learning_title_decisiontree',
                },
                class: 'ai_learning',
                isNotFor: ['ai_learning_decisiontree'],
                events: {},
            },
            set_decisiontree_option: {
                color: EntryStatic.colorSet.block.default.AI_LEARNING,
                outerLine: EntryStatic.colorSet.block.darken.AI_LEARNING,
                skeleton: 'basic',
                statements: [],
                params: [
                    {
                        type: 'Dropdown',
                        options: [
                            [Lang.AiLearning.train_param_minNumSamples, 'minNumSamples'],
                            [Lang.AiLearning.train_param_maxDepth, 'maxDepth'],
                        ],
                        value: 'minNumSamples',
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
                    type: 'set_decisiontree_option',
                },
                pyHelpDef: {
                    params: [],
                    type: 'set_decisiontree_option',
                },
                paramsKeyMap: {
                    OPTION: 0,
                    VALUE: 1,
                },
                class: 'ai_learning',
                isNotFor: ['ai_learning_decisiontree'],
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
            set_decisiontree_tree: {
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
                    params: ['open', null],
                    type: 'set_decisiontree_tree',
                },
                pyHelpDef: {
                    params: [],
                    type: 'set_decisiontree_tree',
                },
                paramsKeyMap: {
                    VISIBLE: 0,
                },
                class: 'ai_learning',
                isNotFor: ['ai_learning_decisiontree'],
                async func(sprite, script) {
                    const visible = script.getField('VISIBLE');
                    Entry.aiLearning.setChartVisible(visible === 'open');
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
