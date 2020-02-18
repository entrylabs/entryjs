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
            template: '비디오가 연결되었는가?',
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
            template: '비디오 화면 %1 %2',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['보이기', 'on'],
                        ['숨기기', 'off'],
                    ],
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
            template: '비디오 %1 효과를 %2 으로 정하기 %3',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['밝기', 'brightness'],
                        ['투명도', 'opacity'],
                    ],
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
            template: '비디오 화면 %1 뒤집기 %2',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['좌우', 'hflip'],
                        ['상하', 'vflip'],
                    ],
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
        video_toggle_ind: {
            color: EntryStatic.colorSet.block.default.AI_UTILIZE,
            outerLine: EntryStatic.colorSet.block.darken.AI_UTILIZE,
            skeleton: 'basic',
            statements: [],
            template: '인식된 %1 %2 %3',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['사람', 'pose'],
                        ['얼굴', 'face'],
                        ['사물', 'object'],
                    ],
                    value: 'pose',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.AI_UTILIZE,
                    arrowColor: EntryStatic.colorSet.common.WHITE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        ['보이기', 'on'],
                        ['숨기기', 'off'],
                    ],
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
            template: '인식된 %1 의 수',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['사람', 'pose'],
                        ['얼굴', 'face'],
                        ['사물', 'object'],
                    ],
                    value: 'pose',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.AI_UTILIZE,
                    arrowColor: EntryStatic.colorSet.common.WHITE,
                },
            ],
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
        video_motion_value: {
            color: EntryStatic.colorSet.block.default.AI_UTILIZE,
            outerLine: EntryStatic.colorSet.block.darken.AI_UTILIZE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1 에서 감지한 %2 값',
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
                        ['움직임 x 위치', 'x_pos'],
                        ['움직임 y 위치', 'y_pos'],
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
                            return clamp(VideoUtils.motions.total / 10, 0, 100000).toString();
                        case 'x':
                            let rawX = VideoUtils.motionDirection.x;
                            if (VideoUtils.flipStatus.horizontal) {
                                rawX *= -1;
                            }
                            return rawX.toString();
                        case 'y':
                            let rawY = VideoUtils.motionDirection.y;
                            if (VideoUtils.flipStatus.vertical) {
                                rawY *= -1;
                            }
                            return rawY.toString();
                        case 'x_pos':
                            let posX = VideoUtils.motionPoint.x - VideoUtils.CANVAS_WIDTH / 2;
                            if (VideoUtils.flipStatus.horizontal) {
                                posX *= -1;
                            }
                            return posX.toString();
                        case 'y_pos':
                            let posY = VideoUtils.motionPoint.y - VideoUtils.CANVAS_HEIGHT / 2;
                            if (!VideoUtils.flipStatus.vertical) {
                                posY *= -1;
                            }
                            return posY.toString();

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
        video_body_part_coord: {
            color: EntryStatic.colorSet.block.default.AI_UTILIZE,
            outerLine: EntryStatic.colorSet.block.darken.AI_UTILIZE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1 번째 사람의 %2 의 %3 좌표',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['1', 1],
                        ['2', 2],
                        ['3', 3],
                        ['4', 4],
                    ],
                    value: 1,
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.AI_UTILIZE,
                    arrowColor: EntryStatic.colorSet.common.WHITE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        // ['코', 'nose'],
                        // ['왼쪽 눈', 'leftEye'],
                        // ['오른쪽 눈', 'rightEye'],
                        // ['왼쪽 귀', 'leftEar'],
                        // ['오른쪽 귀', 'rightEar'],
                        // ['왼족 어깨', 'leftShoulder'],
                        // ['오른쪽 어깨', 'rightShoulder'],
                        // ['왼쪽 팔꿈치', 'leftElbow'],
                        // ['오른쪽 팔꿈치', 'rightElbow'],
                        // ['왼쪽 손목', 'leftWrist'],
                        // ['오른쪽 손목', 'rightWrist'],
                        // ['왼쪽 엉덩이', 'leftHip'],
                        // ['오른쪽 엉덩이', 'rightHip'],
                        // ['왼쪽 무릎', 'leftKnee'],
                        // ['오른쪽 무릎', 'rightKnee'],
                        // ['왼쪽 발목', 'leftAnkle'],
                        // ['오른쪽 발목', 'rightAnkle'],

                        ['얼굴', 0],
                        ['입', 21],
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
                const rawValue = poses[index - 1].keypoints[part].position[coord];

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
