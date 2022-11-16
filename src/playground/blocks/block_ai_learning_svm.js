import { createParamBlock, DropDownDynamicGenerator } from './block_ai_learning';
import { OPTION_DEFAULT_VALUE, KERNEL_STRING_TYPE } from '.././../class/learning/Svm';


module.exports = {
    getBlocks() {
        const params = {
            getKernelOption() {
                const param = {
                    type: 'DropdownDynamic',
                    value: null,
                    menuName() {
                        const value = this.getTargetValue('kernel');
                        if (value === KERNEL_STRING_TYPE.POLYNOMIAL) {
                            return [[Lang.AiLearning.train_param_degree, 'degree']]
                        } else if (value === KERNEL_STRING_TYPE.RBF) {
                            return [[Lang.AiLearning.train_param_gamma, 'gamma']]
                        } else {
                            return;
                        }
                    },

                    needDeepCopy: true,
                    bgColor: EntryStatic.colorSet.block.darken.AI_LEARNING,
                    arrowColor: EntryStatic.colorSet.common.WHITE,
                    defaultValue: (value, options) => {
                        if (options.length) {
                            return options[0][1];
                        }
                        return null;
                    }
                }
                return param;
            }
        }
        return {
            learning_title_svm: {
                skeleton: 'basic_text',
                color: EntryStatic.colorSet.common.TRANSPARENT,
                params: [
                    {
                        type: 'Text',
                        text: Lang.template.learning_title_svm_str,
                        color: EntryStatic.colorSet.common.TEXT,
                        align: 'center',
                    },
                ],
                def: {
                    type: 'learning_title_svm',
                },
                class: 'ai_learning',
                isNotFor: ['ai_learning_svm'],
                events: {},
            },
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
                        value: OPTION_DEFAULT_VALUE.C
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
            },
            set_kernel_option: {
                color: EntryStatic.colorSet.block.default.AI_LEARNING,
                outerLine: EntryStatic.colorSet.block.darken.AI_LEARNING,
                skeleton: 'basic',
                statements: [],
                params: [
                    {
                        type: 'Dropdown',
                        options: [
                            [Lang.AiLearning.train_param_kernel_polynomial, KERNEL_STRING_TYPE.POLYNOMIAL],
                            [Lang.AiLearning.train_param_kernel_rbf, KERNEL_STRING_TYPE.RBF],
                        ],
                        value: 'polynomial',
                        bgColor: EntryStatic.colorSet.block.darken.AI_LEARNING,
                        arrowColor: EntryStatic.colorSet.common.WHITE,
                        dropdownSync: 'kernel',
                    },
                    params.getKernelOption(),
                    {
                        type: 'Block',
                        accept: 'string',
                        defaultType: 'number',
                        value: OPTION_DEFAULT_VALUE.degree
                    },
                    {
                        type: 'Indicator',
                        img: 'block_icon/ai_utilize_icon.svg',
                        size: 11,
                    }
                ],
                def: {
                    type: 'set_kernel_option',
                },
                paramsKeyMap: {
                    KERNEL: 0,
                    OPTION: 1,
                    VALUE: 2,
                },
                class: 'ai_learning',
                isNotFor: ['ai_learning_svm'],
                func(sprite, script) {
                    // 초기화
                    Entry.aiLearning.setTrainOption('gamma', OPTION_DEFAULT_VALUE.gamma);
                    Entry.aiLearning.setTrainOption('degree', OPTION_DEFAULT_VALUE.degree);

                    const kernel = script.getStringField('KERNEL', script);
                    const option = script.getStringField('OPTION', script);
                    const value = script.getNumberValue('VALUE', script);
                    Entry.aiLearning.setTrainOption('kernel', kernel);
                    Entry.aiLearning.setTrainOption(option, parseFloat(value));
                    return script.callReturn();
                },
                events: {},
                pyHelpDef: {
                    params: [],
                    type: 'set_kernel_option',
                },
                syntax: {
                    js: [],
                    py: [],
                },
            }
        };
    }
};
