import VideoUtils from '../../util/videoUtils';

module.exports = {
    getBlocks() {
        return {
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
                async func(sprite, script) {
                    const result = await Entry.aiLearning.predict(VideoUtils.inMemoryCanvas);
                    return result[0].className;
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
                        menuName() {
                            return Entry.aiLearning.labels.map((label, index) => [label, index]);
                        },
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
                async func(sprite, script) {
                    const group = script.getNumberValue('GROUP', script)
                    const result = await Entry.aiLearning.predict(VideoUtils.inMemoryCanvas);
                    return result.find(({index}) => index === group).probability;
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
                        menuName() {
                            return Entry.aiLearning.labels.map((label, index) => [label, index]);
                        },
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
                async func(sprite, script) {
                    const group = script.getNumberValue('GROUP', script)
                    const result = await Entry.aiLearning.predict(VideoUtils.inMemoryCanvas);
                    return result[0].index === group;
                },
                syntax: {
                    js: [],
                    py: [],
                },
            }
        };
    },
};
