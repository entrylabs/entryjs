import MediaPipeUtils from '../../util/mediaPipeUtils';
import _get from 'lodash/get';

const mediaPipeUtils = MediaPipeUtils.getInstance();
Entry.AI_UTILIZE_BLOCK.objectDetector = {
    name: 'objectDetector',
    imageName: 'objectDetector.svg',
    title: {
        ko: '사물 인식',
        en: 'Object Detector',
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
        getObjectList() {
            return {
                type: 'DropdownExtra',
                options: [
                    [Lang.video_object_params.person, 'person'],
                    [Lang.video_object_params.bicycle, 'bicycle'],
                    [Lang.video_object_params.car, 'car'],
                    [Lang.video_object_params.motorcycle, 'motorcycle'],
                    [Lang.video_object_params.airplane, 'airplane'],
                    [Lang.video_object_params.bus, 'bus'],
                    [Lang.video_object_params.train, 'train'],
                    [Lang.video_object_params.truck, 'truck'],
                    [Lang.video_object_params.boat, 'boat'],
                    [Lang.video_object_params['traffic light'], 'traffic light'],
                    [Lang.video_object_params['fire hydrant'], 'fire hydrant'],
                    [Lang.video_object_params['stop sign'], 'stop sign'],
                    [Lang.video_object_params['parking meter'], 'parking meter'],
                    [Lang.video_object_params.bench, 'bench'],
                    [Lang.video_object_params.bird, 'bird'],
                    [Lang.video_object_params.cat, 'cat'],
                    [Lang.video_object_params.dog, 'dog'],
                    [Lang.video_object_params.horse, 'horse'],
                    [Lang.video_object_params.sheep, 'sheep'],
                    [Lang.video_object_params.cow, 'cow'],
                    [Lang.video_object_params.elephant, 'elephant'],
                    [Lang.video_object_params.bear, 'bear'],
                    [Lang.video_object_params.zebra, 'zebra'],
                    [Lang.video_object_params.giraffe, 'giraffe'],
                    [Lang.video_object_params.backpack, 'backpack'],
                    [Lang.video_object_params.umbrella, 'umbrella'],
                    [Lang.video_object_params.handbag, 'handbag'],
                    [Lang.video_object_params.tie, 'tie'],
                    [Lang.video_object_params.suitcase, 'suitcase'],
                    [Lang.video_object_params.frisbee, 'frisbee'],
                    [Lang.video_object_params.skis, 'skis'],
                    [Lang.video_object_params.snowboard, 'snowboard'],
                    [Lang.video_object_params['sports ball'], 'sports ball'],
                    [Lang.video_object_params.kite, 'kite'],
                    [Lang.video_object_params['baseball bat'], 'baseball bat'],
                    [Lang.video_object_params['baseball glove'], 'baseball glove'],
                    [Lang.video_object_params.skateboard, 'skateboard'],
                    [Lang.video_object_params.surfboard, 'surfboard'],
                    [Lang.video_object_params['tennis racket'], 'tennis racket'],
                    [Lang.video_object_params.bottle, 'bottle'],
                    [Lang.video_object_params['wine glass'], 'wine glass'],
                    [Lang.video_object_params.cup, 'cup'],
                    [Lang.video_object_params.fork, 'fork'],
                    [Lang.video_object_params.knife, 'knife'],
                    [Lang.video_object_params.spoon, 'spoon'],
                    [Lang.video_object_params.bowl, 'bowl'],
                    [Lang.video_object_params.banana, 'banana'],
                    [Lang.video_object_params.apple, 'apple'],
                    [Lang.video_object_params.sandwich, 'sandwich'],
                    [Lang.video_object_params.orange, 'orange'],
                    [Lang.video_object_params.broccoli, 'broccoli'],
                    [Lang.video_object_params.carrot, 'carrot'],
                    [Lang.video_object_params['hot dog'], 'hot dog'],
                    [Lang.video_object_params.pizza, 'pizza'],
                    [Lang.video_object_params.donut, 'donut'],
                    [Lang.video_object_params.cake, 'cake'],
                    [Lang.video_object_params.chair, 'chair'],
                    [Lang.video_object_params.couch, 'couch'],
                    [Lang.video_object_params['potted plant'], 'potted plant'],
                    [Lang.video_object_params.bed, 'bed'],
                    [Lang.video_object_params['dining table'], 'dining table'],
                    [Lang.video_object_params.toilet, 'toilet'],
                    [Lang.video_object_params.tv, 'tv'],
                    [Lang.video_object_params.laptop, 'laptop'],
                    [Lang.video_object_params.mouse, 'mouse'],
                    [Lang.video_object_params.remote, 'remote'],
                    [Lang.video_object_params.keyboard, 'keyboard'],
                    [Lang.video_object_params['cell phone'], 'cell phone'],
                    [Lang.video_object_params.microwave, 'microwave'],
                    [Lang.video_object_params.oven, 'oven'],
                    [Lang.video_object_params.toaster, 'toaster'],
                    [Lang.video_object_params.sink, 'sink'],
                    [Lang.video_object_params.refrigerator, 'refrigerator'],
                    [Lang.video_object_params.book, 'book'],
                    [Lang.video_object_params.clock, 'clock'],
                    [Lang.video_object_params.vase, 'vase'],
                    [Lang.video_object_params.scissors, 'scissors'],
                    [Lang.video_object_params['teddy bear'], 'teddy bear'],
                    [Lang.video_object_params['hair drier'], 'hair drier'],
                    [Lang.video_object_params.toothbrush, 'toothbrush'],
                ],
                value: 'bicycle',
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
        check_detected_object: {
            template: '사물을 인식했는가?',
            color: EntryStatic.colorSet.block.default.AI_UTILIZE,
            outerLine: EntryStatic.colorSet.block.darken.AI_UTILIZE,
            skeleton: 'basic_boolean_field',
            statements: [],
            params: [],
            events: {},
            def: {
                type: 'check_detected_object',
            },
            paramsKeyMap: {},
            class: 'object',
            isNotFor: ['objectDetector'],
            func(sprite, script) {
                return mediaPipeUtils.isPrevObjectDetector;
            },
        },
        count_detected_object: {
            template: '인식한 사물의 수',
            color: EntryStatic.colorSet.block.default.AI_UTILIZE,
            outerLine: EntryStatic.colorSet.block.darken.AI_UTILIZE,
            skeleton: 'basic_string_field',
            statements: [],
            params: [],
            events: {},
            def: {
                type: 'count_detected_object',
            },
            paramsKeyMap: {},
            class: 'object',
            isNotFor: ['objectDetector'],
            func(sprite, script) {
                return mediaPipeUtils.countDetectedObject;
            },
        },
        is_detected_among_objects: {
            template: '사물중 %1 을(를) 인식했는가?',
            color: EntryStatic.colorSet.block.default.AI_UTILIZE,
            outerLine: EntryStatic.colorSet.block.darken.AI_UTILIZE,
            skeleton: 'basic_boolean_field',
            statements: [],
            params: [params.getObjectList()],
            events: {},
            def: {
                type: 'is_detected_among_objects',
            },
            paramsKeyMap: {
                TARGET: 0,
            },
            class: 'object',
            isNotFor: ['objectDetector'],
            func(sprite, script) {
                const target = script.getField('TARGET');
                const objectDetectorResult = mediaPipeUtils.prevObjectDetectorResult;
                const detections = _get(objectDetectorResult, 'detections');
                if (detections) {
                    const isFound = detections.some((detect) =>
                        detect.categories.some((category) => category.categoryName === target)
                    );
                    return isFound;
                }
                console.log('objectDetectorResult', objectDetectorResult);
                return false;
            },
        },
    };
};
