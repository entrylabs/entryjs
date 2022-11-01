import { createParamBlock, DropDownDynamicGenerator } from './block_ai_learning';


module.exports = {
    getBlocks() {
        return {
            // ...predictBlocks,
            // ...booleanPredictBlocks,
            set_svm_option: {
                color: EntryStatic.colorSet.block.default.AI_LEARNING,
                outerLine: EntryStatic.colorSet.block.darken.AI_LEARNING,
                skeleton: 'basic',
                statements: [],
                params: [
                    {
                        type: 'Dropdown',
                        options: [
                            [Lang.AiLearning.train_param_C, 'C'],
                        ],
                        value: 'C',
                        bgColor: EntryStatic.colorSet.block.darken.AI_LEARNING,
                        arrowColor: EntryStatic.colorSet.common.WHITE,
                    },
                    {
                        type: 'Block',
                        accept: 'string',
                        defaultType: 'number',
                        value: '0.00001'
                    },
                    {
                        type: 'Indicator',
                        img: 'block_icon/ai_utilize_icon.svg',
                        size: 11,
                    }
                ],
                def: {
                    type: 'set_svm_option',
                },
                paramsKeyMap: {
                    OPTION: 0,
                    VALUE: 1,
                },
                class: 'ai_learning',
                isNotFor: ['ai_learning_svm'],
                func(sprite, script) {
                    const option = script.getStringField('OPTION', script);
                    const value = script.getNumberValue('VALUE', script);
                    Entry.aiLearning.setTrainOption(option, parseFloat(value));
                    return script.callReturn();
                },
                events: {},
                pyHelpDef: {
                    params: [],
                    type: 'set_svm_option',
                },
                syntax: {
                    js: [],
                    py: [],
                },
            }
        };
    }
}