import MediaPipeUtils from '../../util/mediaPipeUtils';

const mediaPipeUtils = MediaPipeUtils.getInstance();
Entry.AI_UTILIZE_BLOCK.objectDetector = {
    name: 'objectDetector',
    imageName: 'objectDetector.svg',
    title: {
        ko: '사람 인식',
        en: 'Object Detector',
        jp: 'ビデオ検出',
    },
    titleKey: 'template.object_detector_title_text',
    description: Lang.Msgs.ai_utilize_object_detector_description,
    descriptionKey: 'Msgs.ai_utilize_object_detector_description',
    isInitialized: false,
    async init() {
        await mediaPipeUtils.initialize();
        Entry.AI_UTILIZE_BLOCK.objectDetector.isInitialized = true;
    },
    destroy() {
        mediaPipeUtils.destroy();
        Entry.AI_UTILIZE_BLOCK.objectDetector.isInitialized = false;
    },
};

Entry.AI_UTILIZE_BLOCK.objectDetector.getBlocks = function() {
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
        getObjectNumber() {
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
        getObjectPoint() {
            return {
                type: 'Dropdown',
                options: [
                    ['코', 0],
                    ['왼쪽 눈 안쪽', 1],
                    ['왼쪽 눈', 2],
                    ['왼쪽 눈 바깥쪽', 3],
                    ['오른쪽 눈 안쪽', 4],
                    ['오른쪽 눈', 5],
                    ['오른쪽 눈 바깥쪽', 6],
                    ['왼쪽 귀', 7],
                    ['오른쪽 귀', 8],
                    ['왼쪽 입꼬리', 9],
                    ['오른쪽 입꼬리', 10],
                    ['왼쪽 어깨', 11],
                    ['오른쪽 어깨', 12],
                    ['왼쪽 팔꿈치', 13],
                    ['오른쪽 팔꿈치', 14],
                    ['왼쪽 손목', 15],
                    ['오른쪽 손목', 16],
                    ['왼쪽 소지', 17],
                    ['오른쪽 소지', 18],
                    ['왼쪽 검지', 19],
                    ['오른쪽 검지', 20],
                    ['왼쪽 엄지', 21],
                    ['오른쪽 엄지', 22],
                    ['왼쪽 엉덩이', 23],
                    ['오른쪽 엉덩이', 24],
                    ['왼쪽 무릎', 25],
                    ['오른쪽 무릎', 26],
                    ['왼쪽 발목', 27],
                    ['오른쪽 발목', 28],
                    ['왼쪽 발꿈치', 29],
                    ['오른쪽 발꿈치', 30],
                    ['왼쪽 발끝 ', 31],
                    ['오른쪽 발끝', 32],
                ],
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
        when_object_detector: {
            template: '%1 사물을 인식했을 때',
            color: EntryStatic.colorSet.block.default.AI_UTILIZE,
            outerLine: EntryStatic.colorSet.block.darken.AI_UTILIZE,
            skeleton: 'basic_event',
            statements: [],
            params: [params.getEventIndicator()],
            events: {},
            def: {
                params: [null],
                type: 'when_object_detector',
            },
            paramsKeyMap: {
                VALUE: 0,
            },
            event: 'when_object_detector',
            class: 'object',
            isNotFor: ['objectDetector'],
            func(sprite, script) {
                return script.callReturn();
            },
        },
        object_detector: {
            template: '사물 인식 %1 %2',
            color: EntryStatic.colorSet.block.default.AI_UTILIZE,
            outerLine: EntryStatic.colorSet.block.darken.AI_UTILIZE,
            skeleton: 'basic',
            statements: [],
            params: [params.getStartStop(), params.getCommonIndicator()],
            events: {},
            def: {
                type: 'object_detector',
            },
            paramsKeyMap: {
                VALUE: 0,
            },
            class: 'object',
            isNotFor: ['objectDetector'],
            async func(sprite, script) {
                const value = script.getField('VALUE');
                if (!mediaPipeUtils.isInitialized) {
                    await mediaPipeUtils.initialize();
                }
                if (value === 'start') {
                    await mediaPipeUtils.startObjectDetector(value);
                } else {
                    await mediaPipeUtils.stopObjectDetector(value);
                }
                return script.callReturn();
            },
        },
        draw_detected_object: {
            template: '인식한 사물 %1 %2',
            color: EntryStatic.colorSet.block.default.AI_UTILIZE,
            outerLine: EntryStatic.colorSet.block.darken.AI_UTILIZE,
            skeleton: 'basic',
            statements: [],
            params: [params.getShowHide(), params.getCommonIndicator()],
            events: {},
            def: {
                type: 'draw_detected_object',
            },
            paramsKeyMap: {
                VALUE: 0,
            },
            class: 'object',
            isNotFor: ['objectDetector'],
            async func(sprite, script) {
                const value = script.getField('VALUE');
                if (!mediaPipeUtils.isInitialized) {
                    await mediaPipeUtils.initialize();
                }
                if (value === 'show') {
                    mediaPipeUtils.changeDrawDetectedObjectDetector(true);
                } else {
                    mediaPipeUtils.changeDrawDetectedObjectDetector(false);
                }
                return script.callReturn();
            },
        },
        // check_detected_object: {
        //     template: '사람을 인식했는가?',
        //     color: EntryStatic.colorSet.block.default.AI_UTILIZE,
        //     outerLine: EntryStatic.colorSet.block.darken.AI_UTILIZE,
        //     skeleton: 'basic_boolean_field',
        //     statements: [],
        //     params: [],
        //     events: {},
        //     def: {
        //         type: 'check_detected_object',
        //     },
        //     paramsKeyMap: {
        //         VALUE: 0,
        //     },
        //     class: 'object',
        //     isNotFor: ['objectDetector'],
        //     func(sprite, script) {
        //         return mediaPipeUtils.isPrevObjectDetector;
        //     },
        // },
        // count_detected_object: {
        //     template: '인식한 사람의 수',
        //     color: EntryStatic.colorSet.block.default.AI_UTILIZE,
        //     outerLine: EntryStatic.colorSet.block.darken.AI_UTILIZE,
        //     skeleton: 'basic_string_field',
        //     statements: [],
        //     params: [],
        //     events: {},
        //     def: {
        //         type: 'count_detected_object',
        //     },
        //     paramsKeyMap: {
        //         VALUE: 0,
        //     },
        //     class: 'object',
        //     isNotFor: ['objectDetector'],
        //     func(sprite, script) {
        //         return mediaPipeUtils.countDetectedObject;
        //     },
        // },
        // locate_to_object: {
        //     template: '%1 번째의 사람의 %2 (으)로 이동하기 %3',
        //     color: EntryStatic.colorSet.block.default.AI_UTILIZE,
        //     outerLine: EntryStatic.colorSet.block.darken.AI_UTILIZE,
        //     skeleton: 'basic',
        //     statements: [],
        //     params: [params.getObjectNumber(), params.getObjectPoint(), params.getCommonIndicator()],
        //     events: {},
        //     def: {
        //         type: 'locate_to_object',
        //     },
        //     paramsKeyMap: {
        //         OBJECT: 0,
        //         OBJECT_POINT: 1,
        //     },
        //     class: 'object',
        //     isNotFor: ['objectDetector'],
        //     func(sprite, script) {
        //         const object = script.getField('OBJECT');
        //         const point = script.getField('OBJECT_POINT');
        //         const axis = mediaPipeUtils.getObjectPointAxis(object, point);
        //         if (axis) {
        //             sprite.setX(axis.x);
        //             sprite.setY(axis.y);
        //             if (sprite.brush && !sprite.brush.stop) {
        //                 sprite.brush.lineTo(axis.x, axis.y * -1);
        //             }
        //         }
        //         return script.callReturn();
        //     },
        // },
        // locate_time_to_object: {
        //     template: '%1 초 동안 %2 번째의 사람의 %3 (으)로 이동하기 %4',
        //     color: EntryStatic.colorSet.block.default.AI_UTILIZE,
        //     outerLine: EntryStatic.colorSet.block.darken.AI_UTILIZE,
        //     skeleton: 'basic',
        //     statements: [],
        //     params: [
        //         {
        //             type: 'Block',
        //             accept: 'string',
        //             defaultType: 'number',
        //         },
        //         params.getObjectNumber(),
        //         params.getObjectPoint(),
        //         params.getCommonIndicator(),
        //     ],
        //     events: {},
        //     def: {
        //         params: [
        //             {
        //                 type: 'number',
        //                 params: ['2'],
        //             },
        //             null,
        //             null,
        //         ],
        //         type: 'locate_time_to_object',
        //     },
        //     paramsKeyMap: {
        //         TIME: 0,
        //         OBJECT: 1,
        //         OBJECT_POINT: 2,
        //     },
        //     class: 'object',
        //     isNotFor: ['objectDetector'],
        //     func(sprite, script) {
        //         if (!script.isStart) {
        //             const time = script.getNumberValue('TIME', script);
        //             const frameCount = Math.floor(time * Entry.FPS);
        //             const object = script.getField('OBJECT', script);
        //             const point = script.getField('OBJECT_POINT', script);

        //             if (frameCount != 0) {
        //                 const axis = mediaPipeUtils.getObjectPointAxis(object, point);
        //                 if (axis) {
        //                     script.isStart = true;
        //                     script.frameCount = frameCount;
        //                     script.dX = (axis.x - sprite.getX()) / script.frameCount;
        //                     script.dY = (axis.y - sprite.getY()) / script.frameCount;
        //                 }
        //             } else {
        //                 const axis = mediaPipeUtils.getObjectPointAxis(object, point);
        //                 if (axis) {
        //                     sprite.setX(axis.x);
        //                     sprite.setY(axis.y);
        //                     if (sprite.brush && !sprite.brush.stop) {
        //                         sprite.brush.lineTo(axis.x, axis.y * -1);
        //                     }
        //                 }
        //                 return script.callReturn();
        //             }
        //         }
        //         if (script.frameCount != 0) {
        //             sprite.setX(sprite.getX() + script.dX);
        //             sprite.setY(sprite.getY() + script.dY);
        //             script.frameCount--;
        //             if (sprite.brush && !sprite.brush.stop) {
        //                 sprite.brush.lineTo(sprite.getX(), sprite.getY() * -1);
        //             }
        //             return script;
        //         } else {
        //             delete script.isStart;
        //             delete script.frameCount;
        //             return script.callReturn();
        //         }
        //     },
        // },
        // axis_detected_object: {
        //     template: '%1 번째 사람의 %2 의 %3 좌표',
        //     color: EntryStatic.colorSet.block.default.AI_UTILIZE,
        //     outerLine: EntryStatic.colorSet.block.darken.AI_UTILIZE,
        //     skeleton: 'basic_string_field',
        //     statements: [],
        //     params: [params.getObjectNumber(), params.getObjectPoint(), params.getAxis()],
        //     events: {},
        //     def: {
        //         params: [null, null, null],
        //         type: 'axis_detected_object',
        //     },
        //     paramsKeyMap: {
        //         OBJECT: 0,
        //         OBJECT_POINT: 1,
        //         AXIS: 2,
        //     },
        //     class: 'object',
        //     isNotFor: ['objectDetector'],
        //     func(sprite, script) {
        //         const object = script.getField('OBJECT', script);
        //         const point = script.getField('OBJECT_POINT', script);
        //         const axisName = script.getField('AXIS', script);
        //         const axis = mediaPipeUtils.getObjectPointAxis(object, point);
        //         if (axis) {
        //             return axis[axisName];
        //         }
        //         return 0;
        //     },
        // },
    };
};
