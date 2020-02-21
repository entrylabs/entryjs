import VideoUtils from '../../util/videoUtils';
import clamp from 'lodash/clamp';
Entry.videoUtils = VideoUtils;
Entry.AI_UTILIZE_BLOCK.video = {
    name: 'video',
    imageName: 'video.svg',
    sponserText: 'Powered by Naver',
    title: {
        ko: '비디오 감지',
        en: 'Video Detection',
        jp: 'ビデオ検出',
    },
    titleKey: 'template.video_title_text',
    description: Lang.Msgs.ai_utilize_video_description,
    descriptionKey: 'Msgs.ai_utilize_video_description',
    isInitialized: false,
    async init() {
        await VideoUtils.initialize();
        Entry.AI_UTILIZE_BLOCK.video.isInitialized = true;
    },
};

Entry.AI_UTILIZE_BLOCK.video.getBlocks = function() {
    const params = {
        getCommonIndicator() {
            return {
                type: 'Indicator',
                img: 'block_icon/ai_utilize_icon.svg',
                size: 11,
            };
        },
        getNumbers() {
            return {
                type: 'Dropdown',
                options: [
                    ['1', 0],
                    ['2', 1],
                    ['3', 2],
                    ['4', 3],
                ],
                value: 0,
                fontSize: 11,
                bgColor: EntryStatic.colorSet.block.darken.AI_UTILIZE,
                arrowColor: EntryStatic.colorSet.common.WHITE,
            };
        },
        getOnOff() {
            return {
                type: 'Dropdown',
                options: [
                    [Lang.Blocks.video_show_video, 'on'],
                    [Lang.Blocks.video_hide_video, 'off'],
                ],
                value: 'on',
                fontSize: 11,
                bgColor: EntryStatic.colorSet.block.darken.AI_UTILIZE,
                arrowColor: EntryStatic.colorSet.common.WHITE,
            };
        },
        getVideoEffectOptions() {
            return {
                type: 'Dropdown',
                options: [
                    [Lang.Blocks.video_brightness, 'brightness'],
                    [Lang.Blocks.video_transparency, 'transparency'],
                ],
                value: 'brightness',
                fontSize: 11,
                bgColor: EntryStatic.colorSet.block.darken.AI_UTILIZE,
                arrowColor: EntryStatic.colorSet.common.WHITE,
            };
        },
        getVideoFlipOptions() {
            return {
                type: 'Dropdown',
                options: [
                    [Lang.Blocks.video_left_right, 'hflip'],
                    [Lang.Blocks.video_top_bototm, 'vflip'],
                ],
                value: 'hflip',
                fontSize: 11,
                bgColor: EntryStatic.colorSet.block.darken.AI_UTILIZE,
                arrowColor: EntryStatic.colorSet.common.WHITE,
            };
        },
        getAiModelOptions() {
            return {
                type: 'Dropdown',
                options: [
                    [Lang.Blocks.video_human, 'pose'],
                    [Lang.Blocks.video_face, 'face'],
                    [Lang.Blocks.video_object, 'object'],
                ],
                value: 'pose',
                fontSize: 11,
                bgColor: EntryStatic.colorSet.block.darken.AI_UTILIZE,
                arrowColor: EntryStatic.colorSet.common.WHITE,
            };
        },
        getSwitchOptions() {
            return {
                type: 'Dropdown',
                options: [
                    [Lang.Blocks.video_start, 'on'],
                    [Lang.Blocks.video_end, 'off'],
                ],
                value: 'on',
                fontSize: 11,
                bgColor: EntryStatic.colorSet.block.darken.AI_UTILIZE,
                arrowColor: EntryStatic.colorSet.common.WHITE,
            };
        },
        getFaceInfoOptions() {
            return {
                type: 'Dropdown',
                options: [
                    [Lang.Blocks.video_gender, 'gender'],
                    [Lang.Blocks.video_age, 'age'],
                    [Lang.Blocks.video_emotion, 'emotion'],
                ],
                value: 'gender',
                fontSize: 11,
                bgColor: EntryStatic.colorSet.block.darken.AI_UTILIZE,
                arrowColor: EntryStatic.colorSet.common.WHITE,
            };
        },
    };
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
        video_check_webcam: {
            color: EntryStatic.colorSet.block.default.AI_UTILIZE,
            outerLine: EntryStatic.colorSet.block.darken.AI_UTILIZE,
            skeleton: 'basic_string_field',
            statements: [],
            params: [],
            events: {},
            def: {
                type: 'video_check_webcam',
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
        video_draw_webcam: {
            color: EntryStatic.colorSet.block.default.AI_UTILIZE,
            outerLine: EntryStatic.colorSet.block.darken.AI_UTILIZE,
            skeleton: 'basic',
            statements: [],
            params: [params.getOnOff(), params.getCommonIndicator()],
            events: {},
            def: {
                type: 'video_draw_webcam',
            },
            paramsKeyMap: {
                VALUE: 0,
            },
            class: 'video',
            isNotFor: ['video'],
            async func(sprite, script) {
                const value = script.getField('VALUE');
                if (!VideoUtils.isInitialized) {
                    await VideoUtils.initialize();
                }
                VideoUtils.cameraSwitch(value);
                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [],
            },
        },
        video_set_camera_option: {
            color: EntryStatic.colorSet.block.default.AI_UTILIZE,
            outerLine: EntryStatic.colorSet.block.darken.AI_UTILIZE,
            skeleton: 'basic',
            statements: [],
            params: [
                params.getVideoEffectOptions(),
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                    value: '0',
                },
                params.getCommonIndicator(),
            ],
            events: {},
            def: {
                type: 'video_set_camera_option',
            },
            paramsKeyMap: {
                TARGET: 0,
                VALUE: 1,
            },
            class: 'video',
            isNotFor: ['video'],
            async func(sprite, script) {
                const target = script.getField('TARGET');
                const value = clamp(
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
                    throw err;
                }
            },
            syntax: {
                js: [],
                py: [],
            },
        },
        video_flip_camera: {
            color: EntryStatic.colorSet.block.default.AI_UTILIZE,
            outerLine: EntryStatic.colorSet.block.darken.AI_UTILIZE,
            skeleton: 'basic',
            statements: [],
            params: [params.getVideoFlipOptions(), params.getCommonIndicator()],
            events: {},
            def: {
                type: 'video_flip_camera',
            },
            paramsKeyMap: {
                TARGET: 0,
            },
            class: 'video',
            isNotFor: ['video'],
            async func(sprite, script) {
                const target = script.getField('TARGET');
                if (!VideoUtils.isInitialized) {
                    await VideoUtils.initialize();
                }
                VideoUtils.setOptions(target);
                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [],
            },
        },
        video_toggle_model: {
            color: EntryStatic.colorSet.block.default.AI_UTILIZE,
            outerLine: EntryStatic.colorSet.block.darken.AI_UTILIZE,
            skeleton: 'basic',
            statements: [],
            params: [
                params.getAiModelOptions(),
                params.getSwitchOptions(),
                params.getCommonIndicator(),
            ],
            events: {},
            def: {
                type: 'video_toggle_model',
            },
            paramsKeyMap: {
                TARGET: 0,
                MODE: 1,
            },
            class: 'video',
            isNotFor: ['video'],
            async func(sprite, script) {
                const target = script.getField('TARGET');
                const mode = script.getField('MODE');
                VideoUtils.manageModel(target, mode);
            },
            syntax: {
                js: [],
                py: [],
            },
        },
        video_toggle_ind: {
            color: EntryStatic.colorSet.block.default.AI_UTILIZE,
            outerLine: EntryStatic.colorSet.block.darken.AI_UTILIZE,
            skeleton: 'basic',
            statements: [],
            params: [params.getAiModelOptions(), params.getOnOff(), params.getCommonIndicator()],
            events: {},
            def: {
                type: 'video_toggle_ind',
            },
            paramsKeyMap: {
                CRITERIA: 0,
                OPTION: 1,
            },
            class: 'video',
            isNotFor: ['video'],
            async func(sprite, script) {
                const criteria = script.getField('CRITERIA');
                const option = script.getField('OPTION');
                if (option === 'on') {
                    VideoUtils.showIndicator(criteria);
                } else {
                    VideoUtils.removeIndicator(criteria);
                }
            },
            syntax: {
                js: [],
                py: [],
            },
        },
        video_number_detect: {
            color: EntryStatic.colorSet.block.default.AI_UTILIZE,
            outerLine: EntryStatic.colorSet.block.darken.AI_UTILIZE,
            skeleton: 'basic_string_field',
            statements: [],
            params: [params.getAiModelOptions()],
            events: {},
            def: {
                type: 'video_number_detect',
            },
            class: 'video',
            isNotFor: ['video'],
            async func(sprite, script) {
                const target = script.getField('TARGET');
                switch (target) {
                    case 'face':
                        return VideoUtils.faces.length || 0;
                    case 'pose':
                        return VideoUtils.poses.predictions.length || 0;
                    case 'object':
                        return VideoUtils.objectDetected.length || 0;
                }
            },
            paramsKeyMap: {
                TARGET: 0,
            },
            syntax: {
                js: [],
                py: [],
            },
        },
        video_detected_face_info: {
            color: EntryStatic.colorSet.block.default.AI_UTILIZE,
            outerLine: EntryStatic.colorSet.block.darken.AI_UTILIZE,
            skeleton: 'basic_string_field',
            statements: [],
            params: [params.getNumbers(), params.getFaceInfoOptions()],
            events: {},
            def: {
                type: 'video_detected_face_info',
            },
            class: 'video',
            isNotFor: ['video'],
            async func(sprite, script) {
                const index = script.getField('INDEX');
                const info = script.getField('INFO');
                const faces = VideoUtils.faces;
                if (faces.length <= index) {
                    return 0;
                }

                const target = VideoUtils.faces[index];
                if (!target) {
                    return 0;
                }
                switch (info) {
                    case 'gender':
                        return target.gender;
                    case 'age':
                        return target.age.toFixed(0).toString();
                    case 'emotion':
                        let emotion = '';
                        let maxVal = 0;
                        for (const status in target.expressions) {
                            const emotionVal = target.expressions[status];
                            if (emotionVal > maxVal) {
                                maxVal = emotionVal;
                                emotion = status;
                            }
                        }
                        return Lang.video_emotion_params[emotion];
                }
            },
            paramsKeyMap: {
                INDEX: 0,
                INFO: 1,
            },
            syntax: {
                js: [],
                py: [],
            },
        },
        video_motion_value: {
            color: EntryStatic.colorSet.block.default.AI_UTILIZE,
            outerLine: EntryStatic.colorSet.block.darken.AI_UTILIZE,
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [['자신', 'self']],
                    value: 'self',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.AI_UTILIZE,
                    arrowColor: EntryStatic.colorSet.common.WHITE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        ['움직임', 'total'],
                        ['x 방향 움직임', 'x'],
                        ['y 방향 움직임', 'y'],
                    ],
                    value: 'total',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.AI_UTILIZE,
                    arrowColor: EntryStatic.colorSet.common.WHITE,
                },
            ],
            events: {},
            def: {
                type: 'video_motion_value',
            },
            class: 'video',
            isNotFor: ['video'],
            async func(sprite, script) {
                const target = script.getField('TARGET');
                const type = script.getField('TYPE');
                try {
                    switch (type) {
                        case 'total':
                            return clamp(VideoUtils.totalMotions / 10, 0, 100000).toString();
                        case 'x':
                            let rawX = VideoUtils.totalMotionDirection.x;
                            if (!VideoUtils.flipStatus.horizontal) {
                                rawX *= -1;
                            }
                            return rawX.toString();
                        case 'y':
                            let rawY = VideoUtils.totalMotionDirection.y;
                            if (VideoUtils.flipStatus.vertical) {
                                rawY *= -1;
                            }
                            return rawY.toString();

                        default:
                            return 0;
                    }
                } catch (err) {
                    return 0;
                }
            },
            paramsKeyMap: {
                TARGET: 0,
                TYPE: 1,
            },
            syntax: {
                js: [],
                py: [],
            },
        },
        video_face_part_coord: {
            color: EntryStatic.colorSet.block.default.AI_UTILIZE,
            outerLine: EntryStatic.colorSet.block.darken.AI_UTILIZE,
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['1', 0],
                        ['2', 1],
                        ['3', 2],
                        ['4', 3],
                    ],
                    value: 0,
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.AI_UTILIZE,
                    arrowColor: EntryStatic.colorSet.common.WHITE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        ['왼쪽 눈', 45],
                        ['오른쪽 눈', 36],
                        ['코', 30],
                        ['왼쪽 입꼬리', 54],
                        ['오른쪽 입꼬리', 48],
                        ['윗 입술', 62],
                        ['아랫 입술', 66],
                    ],
                    value: 45,
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.AI_UTILIZE,
                    arrowColor: EntryStatic.colorSet.common.WHITE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        ['x', '_x'],
                        ['y', '_y'],
                    ],
                    value: '_x',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.AI_UTILIZE,
                    arrowColor: EntryStatic.colorSet.common.WHITE,
                },
            ],
            events: {},
            def: {
                type: 'video_face_part_coord',
            },
            paramsKeyMap: {
                INDEX: 0,
                PART: 1,
                COORD: 2,
            },
            class: 'video',
            isNotFor: ['video'],
            async func(sprite, script) {
                const index = script.getField('INDEX');
                const part = script.getField('PART');
                const coord = script.getField('COORD');
                const faces = VideoUtils.faces;

                if (faces.length <= index) {
                    return 0;
                }

                // offset since value shown starts from 1;
                const rawValue = faces[index].landmarks._positions[part][coord];

                if (!rawValue) {
                    return 0;
                }
                let returningValue = 0;
                if (coord === '_x') {
                    returningValue = rawValue - VideoUtils.CANVAS_WIDTH / 2;
                    if (VideoUtils.flipStatus.horizontal) {
                        returningValue *= -1;
                    }
                } else {
                    returningValue = VideoUtils.CANVAS_HEIGHT / 2 - rawValue;
                    if (VideoUtils.flipStatus.vertical) {
                        returningValue *= -1;
                    }
                }

                return returningValue.toFixed(1);

                // return rawValue.toFixed(1);
            },
            syntax: {
                js: [],
                py: [],
            },
        },

        video_body_part_coord: {
            color: EntryStatic.colorSet.block.default.AI_UTILIZE,
            outerLine: EntryStatic.colorSet.block.darken.AI_UTILIZE,
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['1', 0],
                        ['2', 1],
                        ['3', 2],
                        ['4', 3],
                    ],
                    value: 0,
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.AI_UTILIZE,
                    arrowColor: EntryStatic.colorSet.common.WHITE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        // ['코', 'nose'],
                        ['얼굴', 0],
                        ['왼쪽 눈', 1],
                        ['오른쪽 눈', 2],
                        ['왼쪽 귀', 3],
                        ['오른쪽 귀', 4],
                        ['왼쪽 어깨', 5],
                        ['오른쪽 어깨', 6],
                        ['왼쪽 팔꿈치', 7],
                        ['오른쪽 팔꿈치', 8],
                        ['왼쪽 손목', 9],
                        ['오른쪽 손목', 10],
                        ['왼쪽 엉덩이', 11],
                        ['오른쪽 엉덩이', 12],
                        ['왼쪽 무릎', 13],
                        ['오른쪽 무릎', 14],
                        ['왼쪽 발목', 15],
                        ['오른쪽 발목', 16],
                    ],
                    value: 1,
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.AI_UTILIZE,
                    arrowColor: EntryStatic.colorSet.common.WHITE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        ['x', 'x'],
                        ['y', 'y'],
                    ],
                    value: 'x',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.AI_UTILIZE,
                    arrowColor: EntryStatic.colorSet.common.WHITE,
                },
            ],
            events: {},
            def: {
                type: 'video_body_part_coord',
            },
            paramsKeyMap: {
                INDEX: 0,
                PART: 1,
                COORD: 2,
            },
            class: 'video',
            isNotFor: ['video'],
            async func(sprite, script) {
                const index = script.getField('INDEX');
                const part = script.getField('PART');
                const coord = script.getField('COORD');

                const poses = VideoUtils.poses.predictions;
                if (poses.length < index) {
                    return 0;
                }
                // offset since value shown starts from 1;
                const rawValue = poses[index].keypoints[part].position[coord];

                if (!rawValue) {
                    return 0;
                }
                let returningValue = 0;
                if (coord === 'x') {
                    returningValue = rawValue - VideoUtils.CANVAS_WIDTH / 2;
                } else {
                    returningValue = VideoUtils.CANVAS_HEIGHT / 2 - rawValue;
                    if (VideoUtils.flipStatus.vertical) {
                        returningValue *= -1;
                    }
                }

                return returningValue.toFixed(1);
            },
            syntax: {
                js: [],
                py: [],
            },
        },
    };
};
