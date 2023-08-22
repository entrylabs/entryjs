import MediaPipeUtils from '../../util/mediaPipeUtils';

const mediaPipeUtils = MediaPipeUtils.getInstance();
Entry.AI_UTILIZE_BLOCK.faceLandmarker = {
    name: 'faceLandmarker',
    imageName: 'faceLandmarker.svg',
    category: 'video',
    title: {
        ko: '얼굴 인식',
        en: 'Face Detection',
    },
    titleKey: 'Workspace.face_landmarker_title_text',
    description: Lang.Msgs.ai_utilize_face_landmarker_description,
    descriptionKey: 'Msgs.ai_utilize_face_landmarker_description',
    isInitialized: false,
    async init() {
        await mediaPipeUtils.initialize();
        Entry.AI_UTILIZE_BLOCK.faceLandmarker.isInitialized = true;
    },
    destroy() {
        mediaPipeUtils.destroy();
        Entry.AI_UTILIZE_BLOCK.faceLandmarker.isInitialized = false;
    },
};

Entry.AI_UTILIZE_BLOCK.faceLandmarker.getBlocks = function() {
    const params = {
        getEventIndicator() {
            return {
                type: 'Indicator',
                img: 'block_icon/start_icon_face.svg',
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
                img: 'block_icon/ai_face_icon.svg',
                size: 11,
            };
        },
        getFaceNumber() {
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
        getFacePoint() {
            return {
                type: 'Dropdown',
                options: [
                    [Lang.video_body_coord_params.left_eye, 374],
                    [Lang.video_body_coord_params.right_eye, 145],
                    [Lang.video_body_coord_params.nose, 4],
                    [Lang.video_body_coord_params.left_mouth, 291],
                    [Lang.video_body_coord_params.right_mouth, 61],
                    [Lang.video_body_coord_params.upper_lip, 0],
                    [Lang.video_body_coord_params.lower_lip, 17],
                ],
                value: 374,
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
                    [Lang.Blocks.video_start, 'start'],
                    [Lang.Blocks.video_end, 'stop'],
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
                    [Lang.Blocks.video_show_video, 'show'],
                    [Lang.Blocks.video_hide_video, 'hide'],
                ],
                value: 'show',
                fontSize: 11,
                bgColor: EntryStatic.colorSet.block.darken.AI_UTILIZE,
                arrowColor: EntryStatic.colorSet.common.WHITE,
            };
        },
    };
    return {
        face_landmarker_title: {
            skeleton: 'basic_text',
            color: EntryStatic.colorSet.common.TRANSPARENT,
            params: [
                {
                    type: 'Text',
                    text: Lang.Blocks.face_landmarker_title_text,
                    color: EntryStatic.colorSet.common.TEXT,
                    align: 'center',
                },
            ],
            def: {
                type: 'face_landmarker_title',
            },
            class: 'face',
            isNotFor: ['faceLandmarker'],
            events: {},
        },
        when_face_landmarker: {
            color: EntryStatic.colorSet.block.default.AI_UTILIZE,
            outerLine: EntryStatic.colorSet.block.darken.AI_UTILIZE,
            skeleton: 'basic_event',
            statements: [],
            params: [params.getEventIndicator()],
            events: {},
            def: {
                params: [null],
                type: 'when_face_landmarker',
            },
            paramsKeyMap: {
                VALUE: 0,
            },
            event: 'when_face_landmarker',
            class: 'face',
            isNotFor: ['faceLandmarker'],
            func(sprite, script) {
                return script.callReturn();
            },
        },
        face_landmarker: {
            color: EntryStatic.colorSet.block.default.AI_UTILIZE,
            outerLine: EntryStatic.colorSet.block.darken.AI_UTILIZE,
            skeleton: 'basic',
            statements: [],
            params: [params.getStartStop(), params.getCommonIndicator()],
            events: {},
            def: {
                type: 'face_landmarker',
            },
            paramsKeyMap: {
                VALUE: 0,
            },
            class: 'face',
            isNotFor: ['faceLandmarker'],
            async func(sprite, script) {
                const value = script.getField('VALUE');
                if (!mediaPipeUtils.isInitialized) {
                    await mediaPipeUtils.initialize();
                }
                if (value === 'start') {
                    await mediaPipeUtils.startFaceLandmarker(value);
                } else {
                    await mediaPipeUtils.stopFaceLandmarker(value);
                }
                return script.callReturn();
            },
        },
        draw_detected_face: {
            color: EntryStatic.colorSet.block.default.AI_UTILIZE,
            outerLine: EntryStatic.colorSet.block.darken.AI_UTILIZE,
            skeleton: 'basic',
            statements: [],
            params: [params.getShowHide(), params.getCommonIndicator()],
            events: {},
            def: {
                type: 'draw_detected_face',
            },
            paramsKeyMap: {
                VALUE: 0,
            },
            class: 'face',
            isNotFor: ['faceLandmarker'],
            async func(sprite, script) {
                const value = script.getField('VALUE');
                if (!mediaPipeUtils.isInitialized) {
                    await mediaPipeUtils.initialize();
                }
                if (value === 'show') {
                    mediaPipeUtils.changeDrawDetectedFaceLandmarker(true);
                } else {
                    mediaPipeUtils.changeDrawDetectedFaceLandmarker(false);
                }
                return script.callReturn();
            },
        },
        check_detected_face: {
            color: EntryStatic.colorSet.block.default.AI_UTILIZE,
            outerLine: EntryStatic.colorSet.block.darken.AI_UTILIZE,
            skeleton: 'basic_boolean_field',
            statements: [],
            params: [],
            events: {},
            def: {
                type: 'check_detected_face',
            },
            paramsKeyMap: {
                VALUE: 0,
            },
            class: 'face',
            isNotFor: ['faceLandmarker'],
            func(sprite, script) {
                return mediaPipeUtils.isPrevFaceLandmarker;
            },
        },
        count_detected_face: {
            color: EntryStatic.colorSet.block.default.AI_UTILIZE,
            outerLine: EntryStatic.colorSet.block.darken.AI_UTILIZE,
            skeleton: 'basic_string_field',
            statements: [],
            params: [],
            events: {},
            def: {
                type: 'count_detected_face',
            },
            paramsKeyMap: {
                VALUE: 0,
            },
            class: 'face',
            isNotFor: ['faceLandmarker'],
            func(sprite, script) {
                return mediaPipeUtils.countDetectedFace;
            },
        },
        locate_to_face: {
            color: EntryStatic.colorSet.block.default.AI_UTILIZE,
            outerLine: EntryStatic.colorSet.block.darken.AI_UTILIZE,
            skeleton: 'basic',
            statements: [],
            params: [params.getFaceNumber(), params.getFacePoint(), params.getCommonIndicator()],
            events: {},
            def: {
                type: 'locate_to_face',
            },
            paramsKeyMap: {
                FACE: 0,
                FACE_POINT: 1,
            },
            class: 'face',
            isNotFor: ['faceLandmarker'],
            func(sprite, script) {
                const face = script.getField('FACE');
                const point = script.getField('FACE_POINT');
                const axis = mediaPipeUtils.getFacePointAxis(face, point);
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
        locate_time_to_face: {
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
                params.getFaceNumber(),
                params.getFacePoint(),
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
                type: 'locate_time_to_face',
            },
            paramsKeyMap: {
                TIME: 0,
                FACE: 1,
                FACE_POINT: 2,
            },
            class: 'face',
            isNotFor: ['faceLandmarker'],
            func(sprite, script) {
                if (!script.isStart) {
                    const time = script.getNumberValue('TIME', script);
                    const frameCount = Math.floor(time * Entry.FPS);
                    const face = script.getField('FACE', script);
                    const point = script.getField('FACE_POINT', script);

                    if (frameCount != 0) {
                        const axis = mediaPipeUtils.getFacePointAxis(face, point);
                        if (axis) {
                            script.isStart = true;
                            script.frameCount = frameCount;
                            script.dX = (axis.x - sprite.getX()) / script.frameCount;
                            script.dY = (axis.y - sprite.getY()) / script.frameCount;
                        }
                    } else {
                        const axis = mediaPipeUtils.getFacePointAxis(face, point);
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
        axis_detected_face: {
            template: '%1 번째 얼굴의 %2 의 %3 좌표',
            color: EntryStatic.colorSet.block.default.AI_UTILIZE,
            outerLine: EntryStatic.colorSet.block.darken.AI_UTILIZE,
            skeleton: 'basic_string_field',
            statements: [],
            params: [params.getFaceNumber(), params.getFacePoint(), params.getAxis()],
            events: {},
            def: {
                params: [null, null, null],
                type: 'axis_detected_face',
            },
            paramsKeyMap: {
                FACE: 0,
                FACE_POINT: 1,
                AXIS: 2,
            },
            class: 'face',
            isNotFor: ['faceLandmarker'],
            func(sprite, script) {
                const face = script.getField('FACE', script);
                const point = script.getField('FACE_POINT', script);
                const axisName = script.getField('AXIS', script);
                const axis = mediaPipeUtils.getFacePointAxis(face, point);
                if (axis) {
                    return axis[axisName];
                }
                return 0;
            },
        },
    };
};
