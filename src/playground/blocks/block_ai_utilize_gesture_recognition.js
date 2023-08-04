import mediaPipeUtils from '../../util/mediaPipeUtils';

const MediaPipeUtils = mediaPipeUtils.getInstance();
Entry.AI_UTILIZE_BLOCK.gestureRecognition = {
    name: 'gestureRecognition',
    imageName: 'gestureRecognition.svg',
    title: {
        ko: '손 인식',
        en: 'Gesture Recognition',
        jp: 'ビデオ検出',
    },
    titleKey: 'template.gesture_recognition_title_text',
    description: Lang.Msgs.ai_utilize_gesture_recognition_description,
    descriptionKey: 'Msgs.ai_utilize_gesture_recognition_description',
    isInitialized: false,
    async init() {
        await MediaPipeUtils.initialize();
        Entry.AI_UTILIZE_BLOCK.gestureRecognition.isInitialized = true;
    },
    destroy() {
        MediaPipeUtils.destroy();
        Entry.AI_UTILIZE_BLOCK.gestureRecognition.isInitialized = false;
    },
};

Entry.AI_UTILIZE_BLOCK.gestureRecognition.getBlocks = function() {
    const params = {
        getEventIndicator() {
            return {
                type: 'Indicator',
                img: 'block_icon/start_icon_play.svg',
                size: 14,
                position: {
                    x: 0,
                    y: -2,
                },
            };
        },
        getCommonIndicator() {
            return {
                type: 'Indicator',
                img: 'block_icon/ai_utilize_icon.svg',
                size: 11,
            };
        },
        getStartStop() {
            return {
                type: 'Dropdown',
                options: [
                    ['시작하기', 'start'],
                    ['중지하기', 'stop'],
                ],
                value: 'start',
                fontSize: 11,
                bgColor: EntryStatic.colorSet.block.darken.AI_UTILIZE,
                arrowColor: EntryStatic.colorSet.common.WHITE,
            };
        },
    };
    return {
        when_hand_detection: {
            template: '%1 손을 인식했을 때',
            color: EntryStatic.colorSet.block.default.AI_UTILIZE,
            outerLine: EntryStatic.colorSet.block.darken.AI_UTILIZE,
            skeleton: 'basic_event',
            statements: [],
            params: [params.getEventIndicator()],
            events: {},
            def: {
                params: [null],
                type: 'when_hand_detection',
            },
            paramsKeyMap: {
                VALUE: 0,
            },
            class: 'hand',
            isNotFor: ['gestureRecognition'],
            async func(sprite, script) {
                return script.callReturn();
            },
        },
        hand_detection: {
            template: '손 인식 %1 %2',
            color: EntryStatic.colorSet.block.default.AI_UTILIZE,
            outerLine: EntryStatic.colorSet.block.darken.AI_UTILIZE,
            skeleton: 'basic',
            statements: [],
            params: [params.getStartStop(), params.getCommonIndicator()],
            events: {},
            def: {
                type: 'start_hand_detection',
            },
            paramsKeyMap: {
                VALUE: 0,
            },
            class: 'hand',
            isNotFor: ['gestureRecognition'],
            async func(sprite, script) {
                const value = script.getField('VALUE');
                if (!MediaPipeUtils.isInitialized) {
                    await MediaPipeUtils.initialize();
                }
                if (value === 'start') {
                    await MediaPipeUtils.startHandGestureRecognition(value);
                } else {
                    await MediaPipeUtils.stopHandGestureRecognition(value);
                }
                return script.callReturn();
            },
        },
    };
};
