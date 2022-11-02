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
            },
            set_kernel_linear: {
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
                    type: 'set_kernel_linear',
                },
                pyHelpDef: {
                    params: [],
                    type: 'set_kernel_linear',
                },
                paramsKeyMap: {
                    TEXT: 0,
                },
                class: 'ai_learning',
                isNotFor: ['ai_learning_svm'],
                async func(sprite, script) {
                    const defaultValue = { degree: 3, gamma: 1 };
                    Entry.aiLearning.setTrainOption('kernel', 'linear');
                    Entry.aiLearning.setTrainOption('degree', defaultValue.degree);
                    Entry.aiLearning.setTrainOption('gamma', defaultValue.gamma);
                    return script.callReturn();
                },
                syntax: {
                    js: [],
                    py: [],
                },
            }
        };
    }
}