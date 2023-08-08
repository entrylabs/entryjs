import MediaPipeUtils from '../../util/mediaPipeUtils';

const mediaPipeUtils = MediaPipeUtils.getInstance();
Entry.AI_UTILIZE_BLOCK.poseLandmarker = {
    name: 'poseLandmarker',
    imageName: 'poseLandmarker.svg',
    title: {
        ko: '사람 인식',
        en: 'Pose Landmarker',
        jp: 'ビデオ検出',
    },
    titleKey: 'template.pose_landmarker_title_text',
    description: Lang.Msgs.ai_utilize_pose_landmarker_description,
    descriptionKey: 'Msgs.ai_utilize_pose_landmarker_description',
    isInitialized: false,
    async init() {
        await mediaPipeUtils.initialize();
        Entry.AI_UTILIZE_BLOCK.poseLandmarker.isInitialized = true;
    },
    destroy() {
        mediaPipeUtils.destroy();
        Entry.AI_UTILIZE_BLOCK.poseLandmarker.isInitialized = false;
    },
};

Entry.AI_UTILIZE_BLOCK.poseLandmarker.getBlocks = function() {
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
        getPoseNumber() {
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
        getGesture() {
            return {
                type: 'Dropdown',
                options: [
                    ['쥔 손', 'Closed_Fist'],
                    ['편 손', 'Open_Palm'],
                    ['가리킨 손', 'Pointing_Up'],
                    ['엄지 아래로', 'Thumb_Down'],
                    ['엄지 위로', 'Thumb_Up'],
                    ['브이 사인', 'Victory'],
                    ['사랑해', 'ILoveYou'],
                ],
                value: 'Left',
                fontSize: 11,
                bgColor: EntryStatic.colorSet.block.darken.AI_UTILIZE,
                arrowColor: EntryStatic.colorSet.common.WHITE,
            };
        },
        getPosePoint() {
            return {
                type: 'Dropdown',
                options: [['얼굴', 0]],
                value: 0,
                fontSize: 11,
                bgColor: EntryStatic.colorSet.block.darken.AI_UTILIZE,
                arrowColor: EntryStatic.colorSet.common.WHITE,
                dropdownSync: 'handPoint',
            };
        },
        getAxis() {
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
        getShowHide() {
            return {
                type: 'Dropdown',
                options: [
                    ['보이기', 'show'],
                    ['숨기기', 'hide'],
                ],
                value: 'show',
                fontSize: 11,
                bgColor: EntryStatic.colorSet.block.darken.AI_UTILIZE,
                arrowColor: EntryStatic.colorSet.common.WHITE,
            };
        },
    };
    return {
        when_pose_landmarker: {
            template: '%1 사람을 인식했을 때',
            color: EntryStatic.colorSet.block.default.AI_UTILIZE,
            outerLine: EntryStatic.colorSet.block.darken.AI_UTILIZE,
            skeleton: 'basic_event',
            statements: [],
            params: [params.getEventIndicator()],
            events: {},
            def: {
                params: [null],
                type: 'when_pose_landmarker',
            },
            paramsKeyMap: {
                VALUE: 0,
            },
            event: 'when_pose_landmarker',
            class: 'pose',
            isNotFor: ['poseLandmarker'],
            func(sprite, script) {
                return script.callReturn();
            },
        },
        pose_landmarker: {
            template: '사람 인식 %1 %2',
            color: EntryStatic.colorSet.block.default.AI_UTILIZE,
            outerLine: EntryStatic.colorSet.block.darken.AI_UTILIZE,
            skeleton: 'basic',
            statements: [],
            params: [params.getStartStop(), params.getCommonIndicator()],
            events: {},
            def: {
                type: 'pose_landmarker',
            },
            paramsKeyMap: {
                VALUE: 0,
            },
            class: 'pose',
            isNotFor: ['poseLandmarker'],
            async func(sprite, script) {
                const value = script.getField('VALUE');
                if (!mediaPipeUtils.isInitialized) {
                    await mediaPipeUtils.initialize();
                }
                if (value === 'start') {
                    await mediaPipeUtils.startPoseLandmarker(value);
                } else {
                    await mediaPipeUtils.stopPoseLandmarker(value);
                }
                return script.callReturn();
            },
        },
        draw_detected_pose: {
            template: '인식한 사람 %1 %2',
            color: EntryStatic.colorSet.block.default.AI_UTILIZE,
            outerLine: EntryStatic.colorSet.block.darken.AI_UTILIZE,
            skeleton: 'basic',
            statements: [],
            params: [params.getShowHide(), params.getCommonIndicator()],
            events: {},
            def: {
                type: 'draw_detected_pose',
            },
            paramsKeyMap: {
                VALUE: 0,
            },
            class: 'pose',
            isNotFor: ['poseLandmarker'],
            async func(sprite, script) {
                const value = script.getField('VALUE');
                if (!mediaPipeUtils.isInitialized) {
                    await mediaPipeUtils.initialize();
                }
                if (value === 'show') {
                    mediaPipeUtils.changeDrawDetectedPoseLandmarker(true);
                } else {
                    mediaPipeUtils.changeDrawDetectedPoseLandmarker(false);
                }
                return script.callReturn();
            },
        },
        check_detected_pose: {
            template: '사람을 인식했는가?',
            color: EntryStatic.colorSet.block.default.AI_UTILIZE,
            outerLine: EntryStatic.colorSet.block.darken.AI_UTILIZE,
            skeleton: 'basic_boolean_field',
            statements: [],
            params: [],
            events: {},
            def: {
                type: 'check_detected_pose',
            },
            paramsKeyMap: {
                VALUE: 0,
            },
            class: 'pose',
            isNotFor: ['poseLandmarker'],
            func(sprite, script) {
                return mediaPipeUtils.isPrevPoseLandmarker;
            },
        },
        count_detected_pose: {
            template: '인식한 사람의 수',
            color: EntryStatic.colorSet.block.default.AI_UTILIZE,
            outerLine: EntryStatic.colorSet.block.darken.AI_UTILIZE,
            skeleton: 'basic_string_field',
            statements: [],
            params: [],
            events: {},
            def: {
                type: 'count_detected_pose',
            },
            paramsKeyMap: {
                VALUE: 0,
            },
            class: 'pose',
            isNotFor: ['poseLandmarker'],
            func(sprite, script) {
                return mediaPipeUtils.countDetectedPose;
            },
        },
        locate_to_pose: {
            template: '%1 번째의 사람의 %2 (으)로 이동하기 %3',
            color: EntryStatic.colorSet.block.default.AI_UTILIZE,
            outerLine: EntryStatic.colorSet.block.darken.AI_UTILIZE,
            skeleton: 'basic',
            statements: [],
            params: [params.getPoseNumber(), params.getPosePoint(), params.getCommonIndicator()],
            events: {},
            def: {
                type: 'locate_to_pose',
            },
            paramsKeyMap: {
                POSE: 0,
                POSE_POINT: 1,
            },
            class: 'pose',
            isNotFor: ['poseLandmarker'],
            func(sprite, script) {
                const pose = script.getField('POSE');
                const point = script.getField('POSE_POINT');
                const axis = mediaPipeUtils.getPosePointAxis(pose, point);
                if (axis) {
                    sprite.setX(axis.x);
                    sprite.setY(axis.y);
                    if (sprite.brush && !sprite.brush.stop) {
                        sprite.brush.lineTo(axis.x, axis.y * -1);
                    }
                }
                return script.callReturn();
            },
        },
        locate_time_to_pose: {
            template: '%1 초 동안 %2 번째의 사람의 %3 (으)로 이동하기 %4',
            color: EntryStatic.colorSet.block.default.AI_UTILIZE,
            outerLine: EntryStatic.colorSet.block.darken.AI_UTILIZE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                },
                params.getPoseNumber(),
                params.getPosePoint(),
                params.getCommonIndicator(),
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'number',
                        params: ['2'],
                    },
                    null,
                    null,
                ],
                type: 'locate_time_to_pose',
            },
            paramsKeyMap: {
                TIME: 0,
                POSE: 1,
                POSE_POINT: 2,
            },
            class: 'pose',
            isNotFor: ['poseLandmarker'],
            func(sprite, script) {
                if (!script.isStart) {
                    const time = script.getNumberValue('TIME', script);
                    const frameCount = Math.floor(time * Entry.FPS);
                    const pose = script.getField('POSE', script);
                    const point = script.getField('POSE_POINT', script);

                    if (frameCount != 0) {
                        const axis = mediaPipeUtils.getPosePointAxis(pose, point);
                        if (axis) {
                            script.isStart = true;
                            script.frameCount = frameCount;
                            script.dX = (axis.x - sprite.getX()) / script.frameCount;
                            script.dY = (axis.y - sprite.getY()) / script.frameCount;
                        }
                    } else {
                        const axis = mediaPipeUtils.getPosePointAxis(pose, point);
                        if (axis) {
                            sprite.setX(axis.x);
                            sprite.setY(axis.y);
                            if (sprite.brush && !sprite.brush.stop) {
                                sprite.brush.lineTo(axis.x, axis.y * -1);
                            }
                        }
                        return script.callReturn();
                    }
                }
                if (script.frameCount != 0) {
                    sprite.setX(sprite.getX() + script.dX);
                    sprite.setY(sprite.getY() + script.dY);
                    script.frameCount--;
                    if (sprite.brush && !sprite.brush.stop) {
                        sprite.brush.lineTo(sprite.getX(), sprite.getY() * -1);
                    }
                    return script;
                } else {
                    delete script.isStart;
                    delete script.frameCount;
                    return script.callReturn();
                }
            },
        },
        axis_detected_pose: {
            template: '%1 번째 사람의 %2 의 %3 좌표',
            color: EntryStatic.colorSet.block.default.AI_UTILIZE,
            outerLine: EntryStatic.colorSet.block.darken.AI_UTILIZE,
            skeleton: 'basic_string_field',
            statements: [],
            params: [params.getPoseNumber(), params.getPosePoint(), params.getAxis()],
            events: {},
            def: {
                params: [null, null, null],
                type: 'axis_detected_pose',
            },
            paramsKeyMap: {
                POSE: 0,
                POSE_POINT: 1,
                AXIS: 2,
            },
            class: 'pose',
            isNotFor: ['poseLandmarker'],
            func(sprite, script) {
                const pose = script.getField('POSE', script);
                const point = script.getField('POSE_POINT', script);
                const axisName = script.getField('AXIS', script);
                const axis = mediaPipeUtils.getPosePointAxis(pose, point);
                if (axis) {
                    return axis[axisName];
                }
                return 0;
            },
        },
    };
};
