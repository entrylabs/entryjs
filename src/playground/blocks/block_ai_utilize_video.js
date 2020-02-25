import VideoUtils from '../../util/videoUtils';
import clamp from 'lodash/clamp';

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
        getFaceCoords() {
            return {
                type: 'Dropdown',
                options: [
                    [Lang.video_body_coord_params.left_eye, 45],
                    [Lang.video_body_coord_params.right_eye, 36],
                    [Lang.video_body_coord_params.nose, 30],
                    [Lang.video_body_coord_params.left_mouth, 54],
                    [Lang.video_body_coord_params.right_mouth, 48],
                    [Lang.video_body_coord_params.upper_lip, 62],
                    [Lang.video_body_coord_params.lower_lip, 66],
                ],
                value: 45,
                fontSize: 11,
                bgColor: EntryStatic.colorSet.block.darken.AI_UTILIZE,
                arrowColor: EntryStatic.colorSet.common.WHITE,
            };
        },
        getBodyCoords() {
            return {
                type: 'Dropdown',
                options: [
                    [Lang.video_body_coord_params.face, 0],
                    [Lang.video_body_coord_params.neck, 21],
                    [Lang.video_body_coord_params.left_eye, 1],
                    [Lang.video_body_coord_params.right_eye, 2],
                    [Lang.video_body_coord_params.left_ear, 3],
                    [Lang.video_body_coord_params.right_ear, 4],
                    [Lang.video_body_coord_params.left_shoulder, 5],
                    [Lang.video_body_coord_params.right_shoulder, 6],
                    [Lang.video_body_coord_params.left_elbow, 7],
                    [Lang.video_body_coord_params.right_elbow, 8],
                    [Lang.video_body_coord_params.left_wrist, 9],
                    [Lang.video_body_coord_params.right_wrist, 10],
                    [Lang.video_body_coord_params.left_hip, 11],
                    [Lang.video_body_coord_params.right_hip, 12],
                    [Lang.video_body_coord_params.left_knee, 13],
                    [Lang.video_body_coord_params.right_knee, 14],
                    [Lang.video_body_coord_params.left_ankle, 15],
                    [Lang.video_body_coord_params.right_ankle, 16],
                ],
                value: 1,
                fontSize: 11,
                bgColor: EntryStatic.colorSet.block.darken.AI_UTILIZE,
                arrowColor: EntryStatic.colorSet.common.WHITE,
            };
        },
        getCoordXYOptions() {
            return {
                type: 'Dropdown',
                options: [
                    ['x', 'x'],
                    ['y', 'y'],
                ],
                value: 'x',
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
                if (!VideoUtils.isInitialized) {
                    await VideoUtils.initialize();
                }
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
                if (!VideoUtils.isInitialized) {
                    await VideoUtils.initialize();
                }
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
                if (!VideoUtils.isInitialized) {
                    await VideoUtils.initialize();
                }
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
                if (!VideoUtils.isInitialized) {
                    await VideoUtils.initialize();
                }
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
                    options: [
                        [Lang.Blocks.video_motion_onself, 'self'],
                        [Lang.Blocks.video_motion_onscreen, 'screen'],
                    ],
                    value: 'self',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.AI_UTILIZE,
                    arrowColor: EntryStatic.colorSet.common.WHITE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.video_motion_scale, 'total'],
                        [Lang.Blocks.video_motion_direction_horizontal, 'x'],
                        [Lang.Blocks.video_motion_direction_vertical, 'y'],
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
                let detected = VideoUtils.totalMotions;
                if (!VideoUtils.isInitialized) {
                    await VideoUtils.initialize();
                }
                if (target === 'self') {
                    detected = VideoUtils.motionDetect(sprite);
                }
                if (type === 'total') {
                    return clamp(detected.total / 10, 0, 100000).toString();
                }
                let rawX = detected.totalMotionDirection.x;
                if (!VideoUtils.flipStatus.horizontal) {
                    rawX *= -1;
                }

                let rawY = detected.totalMotionDirection.y;
                if (VideoUtils.flipStatus.vertical) {
                    rawY *= -1;
                }
                const absX = Math.abs(rawX);
                const absY = Math.abs(rawY);
                if (absX < 20 && absY < 20) {
                    return 0;
                }
                if (type === 'x') {
                    return rawX.toFixed(1).toString();
                } else if (type === 'y') {
                    return rawY.toFixed(1).toString();
                }
                return 0;
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
            params: [params.getNumbers(), params.getFaceCoords(), params.getCoordXYOptions()],
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
                if (!VideoUtils.isInitialized) {
                    await VideoUtils.initialize();
                }
                if (faces.length <= index) {
                    return 0;
                }

                // offset since value shown starts from 1;
                const rawValue = faces[index].landmarks._positions[part][`_${coord}`];

                if (!rawValue) {
                    return 0;
                }
                let returningValue = 0;
                if (coord === 'x') {
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
            params: [params.getNumbers(), params.getBodyCoords(), params.getCoordXYOptions()],
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
                if (!VideoUtils.isInitialized) {
                    await VideoUtils.initialize();
                }
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
