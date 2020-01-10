'use strict';

const _clamp = require('lodash/clamp');
const _get = require('lodash/get');

const functionKeys = {
    TEST_MESSAGE: 0xfa,
    RESET: 0xfe,
    CHECK_READY: 0xff,
    SET_LED: 0x01,
    SET_STRING: 0x02,
    SET_IMAGE: 0x03,
    SET_TONE: 0x04,
    SET_TEMPO: 0x05,
    SET_RELATIVE_TEMPO: 0x06,
    SET_DIGITAL: 0x07,
    SET_ANALOG: 0x08,
    RESET_SCREEN: 0x09,
    SET_ANALOG_PERIOD: 0x10,
    SET_SERVO: 0x11,
    SET_SERVO_PERIOD: 0x12,
    SET_CUSTOM_IMAGE: 0x13,

    GET_LED: 0x31,
    GET_ANALOG: 0x32,
    GET_DIGITAL: 0x33,
    GET_BUTTON: 0x34,
    GET_LIGHT_LEVEL: 0x35,
    GET_TEMPERATURE: 0x36,
    GET_COMPASS_HEADING: 0x37,
    GET_ACCELEROMETER: 0x38,
    GET_PITCH: 0x39,
    GET_ROLL: 0x40,
    GET_GESTURE: 0x41,
};

const microbitGestures = {
    TILT_UP: 1,
    TILT_DOWN: 2,
    TILT_LEFT: 3,
    TILT_RIGHT: 4,
    FACE_UP: 5,
    FACE_DOWN: 6,
    FREEFALL: 7,
    THREE_G: 8,
    SIX_G: 9,
    EIGHT_G: 10,
    SHAKE: 11,
};

Entry.Microbit = new (class Microbit {
    constructor() {
        this.id = '22.1';
        this.url = 'http://microbit.org/ko/';
        this.imageName = 'microbit.png';
        this.title = {
            en: 'Microbit',
            ko: '마이크로빗',
        };
        this.name = 'microbit';
        this.communicationType = 'manual';
        this.lastGesture = -1;
        this.blockMenuBlocks = [
            'microbit_led_toggle',
            'microbit_get_led',
            'microbit_show_string',
            'microbit_show_image',
            'microbit_set_led_image',
            'microbit_reset_screen',
            'microbit_set_analog',
            'microbit_set_analog_period',
            'microbit_get_analog',
            'microbit_get_analog_map',
            'microbit_set_digital',
            'microbit_get_digital',
            'microbit_set_tone',
            'microbit_set_tempo',
            'microbit_set_relative_tempo',
            'microbit_get_button',
            'microbit_is_tilt',
            'microbit_get_tilt',
            'microbit_get_gesture',
            'microbit_get_sensor',
            'microbit_get_accelerometer',
            'microbit_set_servo',
            'microbit_set_servo_period',
        ];
        this.commandStatus = {};
    }

    setZero() {
        this.requestCommand(functionKeys.RESET);
        this.lastGesture = -1;
        this.commandStatus = {};
        this.isEngineStop = true;
        delete Entry.hw.portData.sensorData;
    }

    requestCommand(type, payload) {
        this.isEngineStop = false;
        Entry.hw.sendQueue = {
            type,
            payload,
        };
        Entry.hw.update();
    }

    /**
     * command 요청 후 데이터 송수신이 끝날 때까지 대기한다.
     * @param type
     * @param payload
     */
    requestCommandWithResponse(entityId, type, payload) {
        this.isEngineStop = false;
        const codeId = `${entityId}-${type}`;
        if (!this.commandStatus[codeId]) {
            // 첫 진입시 무조건 AsyncError
            Entry.hw.sendQueue = {
                type,
                payload,
            };
            this.commandStatus[codeId] = 'pending';
            Entry.hw.sendQueue.codeId = codeId;
            Entry.hw.update();
            throw new Entry.Utils.AsyncError();
        } else if (this.commandStatus[codeId] === 'pending') {
            // 두 번째 이상의 진입시도이며 작업이 아직 끝나지 않은 경우
            throw new Entry.Utils.AsyncError();
        } else if (this.commandStatus[codeId] === 'completed') {
            // 두 번째 이상의 진입시도이며 pending 도 아닌 경우
            // 블록 func 로직에서 다음 데이터를 처리한다.
            this.commandStatus[codeId] = null;
        }
    }

    afterReceive(portData) {
        if (this.isEngineStop) {
            return;
        }
        if (!portData.payload) {
            return;
        }
        if (portData.payload.isSensorMap) {
            return;
        }
        if (portData.payload.codeId) {
            this.commandStatus[portData.payload.codeId] = 'completed';
        }
        if (portData.payload.codeIdMiss) {
            this.commandStatus[portData.payload.codeIdMiss] = 'completed';
        }
    }

    getBlocks() {
        return {
            microbit_led_toggle: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic',
                statements: [],
                template: 'LED의 X:%1 Y:%2 %3 %4',
                params: [
                    {
                        type: 'Block',
                        accept: 'string',
                        defaultType: 'number',
                    },
                    {
                        type: 'Block',
                        accept: 'string',
                        defaultType: 'number',
                    },
                    {
                        type: 'Dropdown',
                        options: [['켜기', 'on'], ['끄기', 'off'], ['반전', 'toggle']],
                        value: 'on',
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                    {
                        type: 'Indicator',
                        img: 'block_icon/hardware_icon.svg',
                        size: 12,
                    },
                ],
                events: {},
                class: 'microbitLed',
                isNotFor: ['microbit'],
                def: {
                    params: [
                        {
                            type: 'text',
                            params: ['0'],
                        },
                        {
                            type: 'text',
                            params: ['0'],
                        },
                    ],
                    type: 'microbit_led_toggle',
                },
                paramsKeyMap: {
                    X: 0,
                    Y: 1,
                    VALUE: 2,
                },
                func: (sprite, script) => {
                    const value = script.getField('VALUE');
                    const x = _clamp(script.getNumberValue('X'), 0, 4);
                    const y = _clamp(script.getNumberValue('Y'), 0, 4);
                    this.requestCommandWithResponse(script.entity.id, functionKeys.SET_LED, {
                        x,
                        y,
                        value,
                    });
                },
            },
            microbit_get_led: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                fontColor: '#ffffff',
                skeleton: 'basic_string_field',
                statements: [],
                template: 'LED의 X:%1 Y:%2 상태값',
                params: [
                    {
                        type: 'Block',
                        accept: 'string',
                        defaultType: 'number',
                    },
                    {
                        type: 'Block',
                        accept: 'string',
                        defaultType: 'number',
                    },
                ],
                events: {},
                class: 'microbitLed',
                isNotFor: ['microbit'],
                def: {
                    params: [
                        {
                            type: 'text',
                            params: ['0'],
                        },
                        {
                            type: 'text',
                            params: ['0'],
                        },
                    ],
                    type: 'microbit_get_led',
                },
                paramsKeyMap: {
                    X: 0,
                    Y: 1,
                },
                func: (sprite, script) => {
                    const x = _clamp(script.getNumberValue('X'), 0, 4);
                    const y = _clamp(script.getNumberValue('Y'), 0, 4);
                    this.requestCommandWithResponse(script.entity.id, functionKeys.GET_LED, {
                        x,
                        y,
                    });
                    return _get(Entry.hw.portData, ['payload', 'sensorData', 'led', x, y]);
                },
            },
            microbit_show_string: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic',
                statements: [],
                template: '%1 출력하기 %2',
                params: [
                    {
                        type: 'Block',
                        accept: 'string',
                    },
                    {
                        type: 'Indicator',
                        img: 'block_icon/hardware_icon.svg',
                        size: 12,
                    },
                ],
                events: {},
                class: 'microbitLed',
                isNotFor: ['microbit'],
                def: {
                    params: [
                        {
                            type: 'text',
                            params: ['Hello!'],
                        },
                    ],
                    type: 'microbit_show_string',
                },
                paramsKeyMap: {
                    VALUE: 0,
                },
                func: (sprite, script) => {
                    let value = script.getStringValue('VALUE');
                    value = value.replace(
                        /[^A-Za-z0-9_\`\~\!\@\#\$\%\^\&\*\(\)\-\=\+\\\{\}\[\]\'\"\;\:\<\,\>\.\?\/\s]/gim,
                        ''
                    );
                    this.requestCommandWithResponse(
                        script.entity.id,
                        functionKeys.SET_STRING,
                        value
                    );
                },
            },
            microbit_show_image: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic',
                statements: [],
                template: '%1 아이콘 출력하기 %2',
                params: [
                    {
                        type: 'Dropdown',
                        options: [
                            ['하트', 0],
                            ['작은하트', 1],
                            ['행복함', 2],
                            ['슬픔', 3],
                            ['혼란', 4],
                            ['화남', 5],
                            ['졸림', 6],
                            ['놀람', 7],
                            ['바보', 8],
                            ['환상적인', 9],
                            ['별로', 10],
                            ['예스', 11],
                            ['노놉', 12],
                            ['삼각형', 13],
                            ['왼쪽 삼각형', 14],
                            ['체스판', 15],
                            ['다이아몬드', 17],
                            ['작은 다이아몬드', 18],
                            ['사각형', 19],
                            ['작은 사각형', 20],
                            ['가위', 21],
                            ['티셔츠', 22],
                            ['롤러스케이트', 23],
                            ['오리', 24],
                            ['집', 25],
                            ['거북이', 26],
                            ['나비', 27],
                            ['스틱맨', 28],
                            ['유령', 29],
                            ['칼', 30],
                            ['기린', 31],
                            ['해골', 32],
                            ['우산', 33],
                            ['뱀', 34],
                            ['토끼', 35],
                            ['소', 36],
                            ['4분음표', 37],
                            ['8분음표', 38],
                            ['갈퀴', 39],
                            ['표적', 40],
                        ],
                        value: 0,
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                    {
                        type: 'Indicator',
                        img: 'block_icon/hardware_icon.svg',
                        size: 12,
                    },
                ],
                events: {},
                class: 'microbitLed',
                isNotFor: ['microbit'],
                def: {
                    type: 'microbit_show_image',
                },
                paramsKeyMap: {
                    VALUE: 0,
                },
                func: (sprite, script) => {
                    const value = script.getField('VALUE');
                    this.requestCommandWithResponse(script.entity.id, functionKeys.SET_IMAGE, {
                        value,
                    });
                },
            },
            microbit_set_led_image: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic',
                statements: [],
                template: 'LED %1 으로 출력하기 %2',
                params: [
                    {
                        type: 'Led',
                    },
                    {
                        type: 'Indicator',
                        img: 'block_icon/hardware_icon.svg',
                        size: 12,
                    },
                ],
                events: {},
                class: 'microbitLed',
                isNotFor: ['microbit'],
                def: {
                    type: 'microbit_set_led_image',
                },
                paramsKeyMap: {
                    VALUE: 0,
                },
                func: (sprite, script) => {
                    const value = script.getField('VALUE');
                    this.requestCommand(functionKeys.SET_CUSTOM_IMAGE, { value });
                },
            },
            microbit_reset_screen: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic',
                statements: [],
                template: '화면 지우기 %1',
                params: [
                    {
                        type: 'Indicator',
                        img: 'block_icon/hardware_icon.svg',
                        size: 12,
                    },
                ],
                events: {},
                class: 'microbitLed',
                isNotFor: ['microbit'],
                def: {
                    type: 'microbit_reset_screen',
                },
                paramsKeyMap: {},
                func: (sprite, script) => {
                    this.requestCommand(functionKeys.RESET_SCREEN);
                },
            },
            microbit_set_tone: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic',
                statements: [],
                template: '%1 를 %2 동안 출력 %3',
                params: [
                    {
                        type: 'Dropdown',
                        options: [
                            ['낮은 도', 131],
                            ['낮은 도#', 139],
                            ['낮은 레', 147],
                            ['낮은 레#', 156],
                            ['낮은 미', 165],
                            ['낮은 파', 175],
                            ['낮은 파#', 185],
                            ['낮은 솔', 196],
                            ['낮은 솔#', 208],
                            ['낮은 라', 220],
                            ['낮은 라#', 233],
                            ['낮은 시', 247],
                            ['도', 262],
                            ['도#', 277],
                            ['레', 294],
                            ['레#', 311],
                            ['미', 330],
                            ['파', 349],
                            ['파#', 370],
                            ['솔', 392],
                            ['솔#', 415],
                            ['라', 440],
                            ['라#', 466],
                            ['시', 494],
                            ['높은 도', 523],
                            ['높은 도#', 554],
                            ['높은 레', 587],
                            ['높은 레#', 622],
                            ['높은 미', 659],
                            ['높은 파', 698],
                            ['높은 파#', 740],
                            ['높은 솔', 784],
                            ['높은 솔#', 831],
                            ['높은 라', 880],
                            ['높은 라#', 932],
                            ['높은 시', 988],
                        ],
                        value: 131,
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                    {
                        type: 'Dropdown',
                        options: [
                            ['온음표', 1],
                            ['2분음표', 2],
                            ['4분음표', 4],
                            ['8분음표', 8],
                            ['16분음표', 16],
                            ['32분음표', 32],
                            ['셋잇단음표', 3],
                        ],
                        value: 4,
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                    {
                        type: 'Indicator',
                        img: 'block_icon/hardware_icon.svg',
                        size: 12,
                    },
                ],
                events: {},
                class: 'microbitSound',
                isNotFor: ['microbit'],
                def: {
                    type: 'microbit_set_tone',
                },
                paramsKeyMap: {
                    NOTE_VALUE: 0,
                    BEAT_VALUE: 1,
                },
                func: (sprite, script) => {
                    const noteValue = script.getField('NOTE_VALUE');
                    const beatValue = script.getField('BEAT_VALUE');
                    this.requestCommandWithResponse(script.entity.id, functionKeys.SET_TONE, {
                        noteValue,
                        beatValue,
                    });
                },
            },
            microbit_set_tempo: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic',
                statements: [],
                template: '연주 속도를 %1으로 정하기 %2',
                params: [
                    {
                        type: 'Block',
                        accept: 'string',
                        defaultType: 'number',
                    },
                    {
                        type: 'Indicator',
                        img: 'block_icon/hardware_icon.svg',
                        size: 12,
                    },
                ],
                events: {},
                class: 'microbitSound',
                isNotFor: ['microbit'],
                def: {
                    params: [
                        null,
                        {
                            type: 'number',
                            params: ['120'],
                        },
                    ],
                    type: 'microbit_set_tempo',
                },
                paramsKeyMap: {
                    VALUE: 0,
                },
                func: (sprite, script) => {
                    const pinNumber = script.getField('PIN');
                    const value = _clamp(script.getNumberValue('VALUE'), 0, 255);
                    this.requestCommand(functionKeys.SET_TEMPO, { value });
                },
            },
            microbit_set_relative_tempo: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic',
                statements: [],
                template: '연주 속도를  %1 BPM 만큼 바꾸기 %2',
                params: [
                    {
                        type: 'Block',
                        accept: 'string',
                        defaultType: 'number',
                    },
                    {
                        type: 'Indicator',
                        img: 'block_icon/hardware_icon.svg',
                        size: 12,
                    },
                ],
                events: {},
                class: 'microbitSound',
                isNotFor: ['microbit'],
                def: {
                    params: [
                        null,
                        {
                            type: 'number',
                            params: ['20'],
                        },
                    ],
                    type: 'microbit_set_relative_tempo',
                },
                paramsKeyMap: {
                    VALUE: 0,
                },
                func: (sprite, script) => {
                    const pinNumber = script.getField('PIN');
                    const value = _clamp(script.getNumberValue('VALUE'), -127, 127) + 128; // offset for uint8_t payload
                    this.requestCommand(functionKeys.SET_RELATIVE_TEMPO, { value });
                },
            },

            microbit_set_analog: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic',
                statements: [],
                template: '%1 에 아날로그 값 %2 출력 %3',
                params: [
                    {
                        type: 'Dropdown',
                        options: [
                            ['P0', 0],
                            ['P1', 1],
                            ['P2', 2],
                            ['P3', 3],
                            ['P4', 4],
                            ['P10', 10],
                        ],
                        value: 0,
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                    {
                        type: 'Block',
                        accept: 'string',
                        defaultType: 'number',
                    },
                    {
                        type: 'Indicator',
                        img: 'block_icon/hardware_icon.svg',
                        size: 12,
                    },
                ],
                events: {},
                class: 'microbitAnalog',
                isNotFor: ['microbit'],
                def: {
                    params: [
                        null,
                        {
                            type: 'number',
                            params: ['1023'],
                        },
                    ],
                    type: 'microbit_set_analog',
                },
                paramsKeyMap: {
                    PIN: 0,
                    VALUE: 1,
                },
                func: (sprite, script) => {
                    const pinNumber = script.getField('PIN');
                    const value = _clamp(script.getNumberValue('VALUE'), 0, 1023);
                    this.requestCommand(functionKeys.SET_ANALOG, { pinNumber, value });
                },
            },
            microbit_set_analog_period: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic',
                statements: [],
                template: '%1 에 아날로그 PWM 출력 주기를 %2 (µs) 로 설정 %3',
                params: [
                    {
                        type: 'Dropdown',
                        options: [
                            ['P0', 0],
                            ['P1', 1],
                            ['P2', 2],
                            ['P3', 3],
                            ['P4', 4],
                            ['P10', 10],
                        ],
                        value: 0,
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                    {
                        type: 'Block',
                        accept: 'string',
                        defaultType: 'number',
                    },
                    {
                        type: 'Indicator',
                        img: 'block_icon/hardware_icon.svg',
                        size: 12,
                    },
                ],
                events: {},
                class: 'microbitAnalog',
                isNotFor: ['microbit'],
                def: {
                    params: [
                        null,
                        {
                            type: 'number',
                            params: ['20000'],
                        },
                    ],
                    type: 'microbit_set_analog_period',
                },
                paramsKeyMap: {
                    PIN: 0,
                    VALUE: 1,
                },
                func: (sprite, script) => {
                    const pinNumber = script.getField('PIN');
                    const value = script.getNumberValue('VALUE');
                    this.requestCommand(functionKeys.SET_ANALOG_PERIOD, { pinNumber, value });
                },
            },
            microbit_get_analog: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                fontColor: '#ffffff',
                skeleton: 'basic_string_field',
                statements: [],
                template: '아날로그 핀 %1번 센서값',
                params: [
                    {
                        type: 'Dropdown',
                        options: [
                            ['P0', 0],
                            ['P1', 1],
                            ['P2', 2],
                            ['P3', 3],
                            ['P4', 4],
                            ['P10', 10],
                        ],
                        value: 0,
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                ],
                events: {},
                class: 'microbitAnalog',
                isNotFor: ['microbit'],
                def: {
                    type: 'microbit_get_analog',
                },
                paramsKeyMap: {
                    VALUE: 0,
                },
                func: (sprite, script) => {
                    const value = script.getField('VALUE');
                    this.requestCommandWithResponse(script.entity.id, functionKeys.GET_ANALOG, [
                        value,
                    ]);
                    return _get(Entry.hw.portData, ['payload', 'sensorData', 'analog', value], 0);
                },
            },
            microbit_get_analog_map: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                fontColor: '#ffffff',
                skeleton: 'basic_string_field',
                statements: [],
                template: '아날로그 핀 %1번 센서값의 범위를 %2~%3 에서 %4~%5 (으)로 바꾼값',
                params: [
                    {
                        type: 'Dropdown',
                        options: [
                            ['P0', 0],
                            ['P1', 1],
                            ['P2', 2],
                            ['P3', 3],
                            ['P4', 4],
                            ['P10', 10],
                        ],
                        value: 0,
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                    {
                        type: 'Block',
                        accept: 'string',
                        defaultType: 'number',
                    },
                    {
                        type: 'Block',
                        accept: 'string',
                        defaultType: 'number',
                    },
                    {
                        type: 'Block',
                        accept: 'string',
                        defaultType: 'number',
                    },
                    {
                        type: 'Block',
                        accept: 'string',
                        defaultType: 'number',
                    },
                ],
                events: {},
                class: 'microbitAnalog',
                isNotFor: ['microbit'],
                def: {
                    params: [
                        null,
                        {
                            type: 'number',
                            params: ['0'],
                        },
                        {
                            type: 'number',
                            params: ['1023'],
                        },
                        {
                            type: 'number',
                            params: ['0'],
                        },
                        {
                            type: 'number',
                            params: ['100'],
                        },
                    ],
                    type: 'microbit_get_analog_map',
                },
                paramsKeyMap: {
                    PORT: 0,
                    VALUE2: 1,
                    VALUE3: 2,
                    VALUE4: 3,
                    VALUE5: 4,
                },
                func: (sprite, script) => {
                    const value = script.getField('VALUE');
                    this.requestCommandWithResponse(script.entity.id, functionKeys.GET_ANALOG, [
                        value,
                    ]);
                    let returnData = _get(
                        Entry.hw.portData,
                        ['payload', 'sensorData', 'analog', value],
                        0
                    );

                    let value2 = script.getNumberValue('VALUE2', script);
                    let value3 = script.getNumberValue('VALUE3', script);
                    let value4 = script.getNumberValue('VALUE4', script);
                    let value5 = script.getNumberValue('VALUE5', script);
                    const stringValue4 = script.getValue('VALUE4', script);
                    const stringValue5 = script.getValue('VALUE5', script);
                    let isFloat = false;

                    if (
                        (Entry.Utils.isNumber(stringValue4) && stringValue4.indexOf('.') > -1) ||
                        (Entry.Utils.isNumber(stringValue5) && stringValue5.indexOf('.') > -1)
                    ) {
                        isFloat = true;
                    }
                    let swap;
                    if (value2 > value3) {
                        swap = value2;
                        value2 = value3;
                        value3 = swap;
                    }
                    if (value4 > value5) {
                        swap = value4;
                        value4 = value5;
                        value5 = swap;
                    }
                    returnData -= value2;
                    returnData = returnData * ((value5 - value4) / (value3 - value2));
                    returnData += value4;
                    returnData = Math.min(value5, returnData);
                    returnData = Math.max(value4, returnData);

                    if (isFloat) {
                        returnData = Math.round(returnData * 100) / 100;
                    } else {
                        returnData = Math.round(returnData);
                    }
                    return returnData;
                },
            },
            microbit_set_digital: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic',
                statements: [],
                template: '%1 에 디지털 값 %2 출력 %3',
                params: [
                    {
                        type: 'Dropdown',
                        options: [
                            ['P0', 0],
                            ['P1', 1],
                            ['P2', 2],
                            ['P3', 3],
                            ['P4', 4],
                            ['P5', 5],
                            ['P6', 6],
                            ['P7', 7],
                            ['P8', 8],
                            ['P9', 9],
                            ['P10', 10],
                            ['P11', 11],
                            ['P12', 12],
                            ['P13', 13],
                            ['P14', 14],
                            ['P15', 15],
                            ['P16', 16],
                            ['P19', 19],
                            ['P20', 20],
                        ],
                        value: 0,
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                    {
                        type: 'Dropdown',
                        options: [['0', 0], ['1', 1]],
                        value: 0,
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                    {
                        type: 'Indicator',
                        img: 'block_icon/hardware_icon.svg',
                        size: 12,
                    },
                ],
                events: {},
                class: 'microbitDigital',
                isNotFor: ['microbit'],
                def: {
                    params: [],
                    type: 'microbit_set_digital',
                },
                paramsKeyMap: {
                    PIN: 0,
                    VALUE: 1,
                },
                func: (sprite, script) => {
                    const pinNumber = script.getField('PIN');
                    const value = script.getNumberField('VALUE');
                    this.requestCommandWithResponse(script.entity.id, functionKeys.SET_DIGITAL, {
                        pinNumber,
                        value,
                    });
                },
            },
            microbit_get_digital: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                fontColor: '#ffffff',
                skeleton: 'basic_boolean_field',
                statements: [],
                template: '디지털 핀 %1번 센서값',
                params: [
                    {
                        type: 'Dropdown',
                        options: [
                            ['P0', 0],
                            ['P1', 1],
                            ['P2', 2],
                            ['P3', 3],
                            ['P4', 4],
                            ['P5', 5],
                            ['P6', 6],
                            ['P7', 7],
                            ['P8', 8],
                            ['P9', 9],
                            ['P10', 10],
                            ['P11', 11],
                            ['P12', 12],
                            ['P13', 13],
                            ['P14', 14],
                            ['P15', 15],
                            ['P16', 16],
                            ['P19', 19],
                            ['P20', 20],
                        ],
                        value: 0,
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                ],
                events: {},
                class: 'microbitDigital',
                isNotFor: ['microbit'],
                def: {
                    type: 'microbit_get_digital',
                },
                paramsKeyMap: {
                    VALUE: 0,
                },
                func: (sprite, script) => {
                    const value = script.getField('VALUE');
                    this.requestCommandWithResponse(script.entity.id, functionKeys.GET_DIGITAL, [
                        value,
                    ]);
                    return _get(Entry.hw.portData, ['payload', 'sensorData', 'digital', value], 0);
                },
            },
            microbit_get_button: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                fontColor: '#ffffff',
                skeleton: 'basic_boolean_field',
                statements: [],
                template: '%1버튼을 눌렀는가?',
                params: [
                    {
                        type: 'Dropdown',
                        options: [['A', 1], ['B', 2], ['A+B', 3]],
                        value: 1,
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                ],
                events: {},
                class: 'microbitButton',
                isNotFor: ['microbit'],
                def: {
                    type: 'microbit_get_button',
                },
                paramsKeyMap: {
                    VALUE: 0,
                },
                func: (sprite, script) => {
                    const value = script.getField('VALUE');
                    const buttonState = _get(
                        Entry.hw.portData,
                        ['payload', 'sensorData', 'button'],
                        -1
                    );

                    // double equal 은 의도한 것임.
                    // noinspection EqualityComparisonWithCoercionJS
                    return buttonState == value;
                },
            },
            microbit_get_sensor: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                fontColor: '#ffffff',
                skeleton: 'basic_string_field',
                statements: [],
                template: '%1 센서값',
                params: [
                    {
                        type: 'Dropdown',
                        options: [
                            ['빛', 'lightLevel'],
                            ['온도', 'temperature'],
                            ['자기', 'compassHeading'],
                        ],
                        value: 'temperature',
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                ],
                events: {},
                class: 'microbitSensor',
                isNotFor: ['microbit'],
                def: {
                    type: 'microbit_get_sensor',
                },
                paramsKeyMap: {
                    VALUE: 0,
                },
                func: (sprite, script) => {
                    const value = script.getField('VALUE');
                    if (value === 'lightLevel') {
                        let commandType = functionKeys.GET_LIGHT_LEVEL;
                        this.requestCommandWithResponse(script.entity.id, commandType);
                    }
                    return _get(Entry.hw.portData, ['payload', 'sensorData', value], -1);
                },
            },
            microbit_is_tilt: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                fontColor: '#ffffff',
                skeleton: 'basic_boolean_field',
                statements: [],
                template: '%1 방향으로 기울었는가?',
                params: [
                    {
                        type: 'Dropdown',
                        options: [['왼쪽', 0], ['오른쪽', 1], ['앞쪽', 2], ['뒤쪽', 3]],
                        value: 0,
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                ],
                events: {},
                class: 'microbitMove',
                isNotFor: ['microbit'],
                def: {
                    type: 'microbit_is_tilt',
                },
                paramsKeyMap: {
                    DIRECTION: 0,
                },
                func: (sprite, script) => {
                    const direction = script.getField('DIRECTION');

                    let command;
                    const sensorDataMap = ['payload', 'sensorData', 'tilt'];
                    switch (direction) {
                        case 0:
                        case 1: {
                            command = functionKeys.GET_ROLL;
                            sensorDataMap.push('roll');
                            break;
                        }
                        case 2:
                        case 3:
                        default: {
                            command = functionKeys.GET_PITCH;
                            sensorDataMap.push('pitch');
                            break;
                        }
                    }

                    const value = _get(Entry.hw.portData, sensorDataMap, -1);
                    // 기획팀 의도에 따라 30도 이내는 기울지 않았다고 판단

                    /*
                    좌우 = 우측으로 기울일수록 +
                    앞뒤 = 뒤로 기울일수록 +
                     */
                    switch (direction) {
                        case 0: // 왼쪽
                        case 2: // 앞쪽
                            return value <= -30 && value >= -180;
                        case 1: // 오른쪽
                        case 3: // 뒤쪽
                            return value >= 30 && value <= 180;
                        default:
                            return false;
                    }
                },
            },
            microbit_get_tilt: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                fontColor: '#ffffff',
                skeleton: 'basic_string_field',
                statements: [],
                template: '%1 방향으로 기울어진 각도값',
                params: [
                    {
                        type: 'Dropdown',
                        options: [['왼쪽', 0], ['오른쪽', 1], ['앞쪽', 2], ['뒤쪽', 3]],
                        value: 0,
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                ],
                events: {},
                class: 'microbitMove',
                isNotFor: ['microbit'],
                def: {
                    type: 'microbit_get_tilt',
                },
                paramsKeyMap: {
                    DIRECTION: 0,
                },
                func: (sprite, script) => {
                    const direction = script.getField('DIRECTION');

                    let command;
                    const sensorDataMap = ['payload', 'sensorData', 'tilt'];
                    switch (direction) {
                        case 0:
                        case 1: {
                            command = functionKeys.GET_ROLL;
                            sensorDataMap.push('roll');
                            break;
                        }
                        case 2:
                        case 3:
                        default: {
                            command = functionKeys.GET_PITCH;
                            sensorDataMap.push('pitch');
                            break;
                        }
                    }

                    const value = _get(Entry.hw.portData, sensorDataMap, -1);
                    /*
                    좌우 = 우측으로 기울일수록 +
                    앞뒤 = 뒤로 기울일수록 +
                     */
                    switch (direction) {
                        case 1: // 오른쪽
                        case 3: // 뒤쪽
                            return value;
                        case 0: // 왼쪽
                        case 2: // 앞쪽
                        default:
                            return -value;
                    }
                },
            },
            microbit_get_accelerometer: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                fontColor: '#ffffff',
                skeleton: 'basic_string_field',
                statements: [],
                template: '가속도 센서 %1의 값',
                params: [
                    {
                        type: 'Dropdown',
                        options: [['x축', 0], ['y축', 1], ['z축', 2], ['크기', 3]],
                        value: 0,
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                ],
                events: {},
                class: 'microbitSensor',
                isNotFor: ['microbit'],
                def: {
                    type: 'microbit_get_accelerometer',
                },
                paramsKeyMap: {
                    VALUE: 0,
                },
                func: (sprite, script) => {
                    const value = script.getField('VALUE');
                    let whole = _get(Entry.hw.portData, 'payload.sensorData.accelerometer', -1);
                    if (whole instanceof Object) {
                        switch (value) {
                            case 0:
                                whole = whole.x;
                                break;
                            case 1:
                                whole = whole.y;
                                break;
                            case 2:
                                whole = whole.z;
                                break;
                            case 3:
                                whole = whole.strength;
                                break;
                            default:
                                whole = whole;
                                break;
                        }
                    }
                    return whole;
                },
            },
            microbit_get_gesture: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                fontColor: '#ffffff',
                skeleton: 'basic_boolean_field',
                statements: [],
                template: '%1 이 있는가?',
                params: [
                    {
                        type: 'Dropdown',
                        options: [['흔들림', 0], ['움직임', 1]],
                        value: 1,
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                ],
                events: {},
                class: 'microbitMove',
                isNotFor: ['microbit'],
                def: {
                    type: 'microbit_get_gesture',
                },
                paramsKeyMap: {
                    VALUE: 0,
                },
                func: (sprite, script) => {
                    const value = script.getField('VALUE');
                    const gesture = _get(Entry.hw.portData, 'payload.sensorData.gesture', -1);

                    /**
                     * 제스쳐는 단 한번만 검사하기 위해 제스쳐가 이전과 다르게 변경된 경우만 검사한다.
                     * 달라진 경우,
                     * '흔들림' 이 있는가? = SHAKE event 인지만 검사
                     * '움직임' 이 있는가? = 제스쳐의 변경 -> 움직임이기 때문에 무조건 true
                     */
                    if (this.lastGesture === gesture) {
                        return false;
                    } else {
                        this.lastGesture = gesture;
                        if (value === 0) {
                            return this.lastGesture === microbitGestures.SHAKE;
                        } else if (value === 1) {
                            return true;
                        }
                    }
                },
            },
            microbit_set_servo: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic',
                statements: [],
                template: '%1 에 서보 값 %2 출력 %3',
                params: [
                    {
                        type: 'Dropdown',
                        options: [['P0', 0], ['P1', 1], ['P2', 2]],
                        value: 0,
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                    {
                        type: 'Block',
                        accept: 'string',
                        defaultType: 'number',
                    },
                    {
                        type: 'Indicator',
                        img: 'block_icon/hardware_icon.svg',
                        size: 12,
                    },
                ],
                events: {},
                class: 'microbitServo',
                isNotFor: ['microbit'],
                def: {
                    params: [
                        null,
                        {
                            type: 'number',
                            params: ['180'],
                        },
                    ],
                    type: 'microbit_set_servo',
                },
                paramsKeyMap: {
                    PIN: 0,
                    VALUE: 1,
                },
                func: (sprite, script) => {
                    const pinNumber = script.getField('PIN');
                    const value = _clamp(script.getNumberValue('VALUE'), 0, 180);
                    this.requestCommand(functionKeys.SET_SERVO, { pinNumber, value });
                },
            },
            microbit_set_servo_period: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic',
                statements: [],
                template: '%1 에 서보 펄스 폭을 %2 마이크로초로 설정 %3',
                params: [
                    {
                        type: 'Dropdown',
                        options: [['P0', 0], ['P1', 1], ['P2', 2]],
                        value: 0,
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                    {
                        type: 'Block',
                        accept: 'string',
                        defaultType: 'number',
                    },
                    {
                        type: 'Indicator',
                        img: 'block_icon/hardware_icon.svg',
                        size: 12,
                    },
                ],
                events: {},
                class: 'microbitServo',
                isNotFor: ['microbit'],
                def: {
                    params: [
                        null,
                        {
                            type: 'number',
                            params: ['1500'],
                        },
                    ],
                    type: 'microbit_set_servo_period',
                },
                paramsKeyMap: {
                    PIN: 0,
                    VALUE: 1,
                },
                func: (sprite, script) => {
                    const pinNumber = script.getField('PIN');
                    const value = script.getNumberValue('VALUE');
                    this.requestCommand(functionKeys.SET_SERVO_PERIOD, { pinNumber, value });
                },
            },
        };
    }
})();
module.exports = Entry.Microbit;
