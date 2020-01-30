import VideoUtils from '../../util/videoUtils';
import PromiseManager from '../../core/promiseManager';
const _clamp = require('lodash/clamp');

Entry.AI_UTILIZE_BLOCK.video = {
    name: 'video',
    imageName: 'audio.svg',
    title: {
        ko: '비디오 감지',
        en: 'Video Detection',
        jp: 'ビデオ検出',
    },
    titleKey: 'template.video_title_text',
    description: Lang.Msgs.ai_utilize_video_description,
    descriptionKey: 'Msgs.ai_utilize_video_description',
    isInitialized: false,
    init() {
        if (this.isInitialized) {
            return;
        }
        Entry.AI_UTILIZE_BLOCK.video.isInitialized = true;
    },
};

Entry.AI_UTILIZE_BLOCK.video.getBlocks = function() {
    return {
        video_title: {
            skeleton: 'basic_text',
            color: EntryStatic.colorSet.common.TRANSPARENT,
            params: [
                {
                    type: 'Text',
                    text: Lang.template.video_title_text,
                    color: EntryStatic.colorSet.common.TEXT,
                    align: 'center',
                },
            ],
            def: {
                type: 'video_title',
            },
            class: 'video',
            isNotFor: ['video'],
            events: {},
        },
        check_webcam: {
            color: EntryStatic.colorSet.block.default.AI_UTILIZE,
            outerLine: EntryStatic.colorSet.block.darken.AI_UTILIZE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '비디오가 연결되었는가?',
            params: [],
            events: {},
            def: {
                type: 'check_webcam',
            },
            paramsKeyMap: {
                VALUE: 0,
            },
            class: 'video',
            isNotFor: ['video'],
            async func(sprite, script) {
                if (!VideoUtils.isInitialized) {
                    await VideoUtils.initialize();
                }
                const result = await VideoUtils.checkUserCamAvailable();
                return result.toString();
            },
            syntax: {
                js: [],
                py: [],
            },
        },
        draw_webcam: {
            color: EntryStatic.colorSet.block.default.AI_UTILIZE,
            outerLine: EntryStatic.colorSet.block.darken.AI_UTILIZE,
            skeleton: 'basic',
            statements: [],
            template: '비디오 화면 %1 %2',
            params: [
                {
                    type: 'Dropdown',
                    options: [['보이기', 'on'], ['숨기기', 'off']],
                    value: 'on',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.AI_UTILIZE,
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
                type: 'draw_webcam',
            },
            paramsKeyMap: {
                VALUE: 0,
            },
            class: 'video',
            isNotFor: ['video'],
            async func(sprite, script) {
                const value = script.getField('VALUE');
                try {
                    if (!VideoUtils.isInitialized) {
                        await VideoUtils.initialize();
                    }
                    VideoUtils.cameraSwitch(value);
                    return script.callReturn();
                } catch (err) {
                    console.log(err);
                }
            },
            syntax: {
                js: [],
                py: [],
            },
        },
        set_camera_option: {
            color: EntryStatic.colorSet.block.default.AI_UTILIZE,
            outerLine: EntryStatic.colorSet.block.darken.AI_UTILIZE,
            skeleton: 'basic',
            statements: [],
            template: '비디오 %1 효과를 %2 으로 정하기 %3',
            params: [
                {
                    type: 'Dropdown',
                    options: [['밝기', 'brightness'], ['투명도', 'opacity']],
                    value: 'brightness',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.AI_UTILIZE,
                    arrowColor: EntryStatic.colorSet.common.WHITE,
                },
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                    value: '0',
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/ai_utilize_icon.svg',
                    size: 11,
                },
            ],
            events: {},
            def: {
                type: 'set_camera_option',
            },
            paramsKeyMap: {
                TARGET: 0,
                VALUE: 1,
            },
            class: 'video',
            isNotFor: ['video'],
            async func(sprite, script) {
                const target = script.getField('TARGET');
                const value = _clamp(
                    script.getNumberValue('VALUE'),
                    target === 'brightness' ? -100 : 0,
                    100
                );
                try {
                    if (!VideoUtils.isInitialized) {
                        await VideoUtils.initialize();
                    }
                    VideoUtils.setOptions(target, value);
                    return script.callReturn();
                } catch (err) {
                    console.log(err);
                }
            },
            syntax: {
                js: [],
                py: [],
            },
        },
        flip_camera: {
            color: EntryStatic.colorSet.block.default.AI_UTILIZE,
            outerLine: EntryStatic.colorSet.block.darken.AI_UTILIZE,
            skeleton: 'basic',
            statements: [],
            template: '비디오 화면 %1 뒤집기 %2',
            params: [
                {
                    type: 'Dropdown',
                    options: [['좌우', 'hflip'], ['상하', 'vflip']],
                    value: 'hflip',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.AI_UTILIZE,
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
                type: 'flip_camera',
            },
            paramsKeyMap: {
                TARGET: 0,
            },
            class: 'video',
            isNotFor: ['video'],
            async func(sprite, script) {
                const target = script.getField('TARGET');
                try {
                    if (!VideoUtils.isInitialized) {
                        await VideoUtils.initialize();
                    }
                    VideoUtils.setOptions(target);
                    return script.callReturn();
                } catch (err) {
                    console.log(err);
                }
            },
            syntax: {
                js: [],
                py: [],
            },
        },
    };
};
