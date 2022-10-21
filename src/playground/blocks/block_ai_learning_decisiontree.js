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
            ...predictBlocks,
            ...booleanPredictBlocks,
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
            get_decisiontree_result_info: {
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
                    type: 'get_decisiontree_result_info',
                },
                pyHelpDef: {
                    params: [],
                    type: 'get_decisiontree_result_info',
                },
                paramsKeyMap: {
                    TYPE: 0,
                },
                class: 'ai_learning',
                isNotFor: ['ai_learning_decisiontree'],
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

const predictBlocks = createParamBlock({
    type: 'decisiontree',
    name: 'get_decisiontree_predict',
    length: 6,
    createFunc: (paramsKeyMap) => async (sprite, script) => {
        const params = Object.keys(paramsKeyMap).map((key) => script.getNumberValue(key, script));
        await Entry.aiLearning.predict(params);
        const result = Entry.aiLearning.getPredictResult();
        return result.sort((a, b) => b.probability - a.probability)[0].className;
    },
});
const booleanPredictBlocks = createParamBlock({
    type: 'decisiontree',
    name: 'is_decisiontree_result',
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
