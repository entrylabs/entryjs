import { createParamBlock, DropDownDynamicGenerator } from './block_ai_learning';

module.exports = {
    getBlocks() {
        const probabilityBlocks = createParamBlock({
            type: 'logistic_regression',
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
        return {
            ...probabilityBlocks,
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
        };
    },
};
