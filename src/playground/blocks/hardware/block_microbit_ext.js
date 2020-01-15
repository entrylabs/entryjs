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

Entry.MicrobitExt = new (class MicrobitExt {
    constructor() {
        this.id = '22.2';
        this.url = 'http://microbit.org/ko/';
        this.imageName = 'microbit_ext.png';
        this.title = {
            en: 'MicrobitExt',
            ko: '마이크로빗 확장',
        };
        this.name = 'microbitExt';
        this.communicationType = 'manual';
        this.lastGesture = -1;
        this.blockMenuBlocks = [
            'microbit_ext_led_toggle',
            'microbit_ext_get_led',
            'microbit_ext_show_string',
            'microbit_ext_show_image',
            'microbit_ext_set_led_image',
            'microbit_ext_reset_screen',
            'microbit_ext_set_analog',
            'microbit_ext_set_analog_period',
            'microbit_ext_get_analog',
            'microbit_ext_get_analog_map',
            'microbit_ext_set_digital',
            'microbit_ext_get_digital',
            'microbit_ext_set_tone',
            'microbit_ext_set_tempo',
            'microbit_ext_set_relative_tempo',
            'microbit_ext_get_button',
            'microbit_ext_is_tilt',
            'microbit_ext_get_tilt',
            'microbit_ext_get_gesture',
            'microbit_ext_get_sensor',
            'microbit_ext_get_accelerometer',
            'microbit_ext_set_servo',
            'microbit_ext_set_servo_period',
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
            microbit_ext_led_toggle: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic',
                statements: [],
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
                        options: [
                            [Lang.Blocks.microbit_led_toggle_on, 'on'],
                            [Lang.Blocks.microbit_led_toggle_off, 'off'],
                            [Lang.Blocks.microbit_led_toggle_toggle, 'toggle'],
                        ],
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
                class: 'microbitExtLed',
                isNotFor: ['microbitExt'],
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
                    type: 'microbit_ext_led_toggle',
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
            microbit_ext_get_led: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                fontColor: '#ffffff',
                skeleton: 'basic_string_field',
                statements: [],
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
                class: 'microbitExtLed',
                isNotFor: ['microbitExt'],
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
                    type: 'microbit_ext_get_led',
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
            microbit_ext_show_string: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic',
                statements: [],
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
                class: 'microbitExtLed',
                isNotFor: ['microbitExt'],
                def: {
                    params: [
                        {
                            type: 'text',
                            params: ['Hello!'],
                        },
                    ],
                    type: 'microbit_ext_show_string',
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
            microbit_ext_show_image: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic',
                statements: [],
                params: [
                    {
                        type: 'Dropdown',
                        options: [
                            [Lang.Blocks.microbit_image_heart, 0],
                            [Lang.Blocks.microbit_image_small_heart, 1],
                            [Lang.Blocks.microbit_image_happiness, 2],
                            [Lang.Blocks.microbit_image_sadness, 3],
                            [Lang.Blocks.microbit_image_confused, 4],
                            [Lang.Blocks.microbit_image_angry, 5],
                            [Lang.Blocks.microbit_image_sleepy, 6],
                            [Lang.Blocks.microbit_image_surprised, 7],
                            [Lang.Blocks.microbit_image_fool, 8],
                            [Lang.Blocks.microbit_image_fantastic, 9],
                            [Lang.Blocks.microbit_image_not_good, 10],
                            [Lang.Blocks.microbit_image_yes, 11],
                            [Lang.Blocks.microbit_image_no, 12],
                            [Lang.Blocks.microbit_image_triangle, 13],
                            [Lang.Blocks.microbit_image_left_triangle, 14],
                            [Lang.Blocks.microbit_image_chessboard, 15],
                            [Lang.Blocks.microbit_image_diamond, 17],
                            [Lang.Blocks.microbit_image_small_diamond, 18],
                            [Lang.Blocks.microbit_image_square, 19],
                            [Lang.Blocks.microbit_image_small_square, 20],
                            [Lang.Blocks.microbit_image_scissors, 21],
                            [Lang.Blocks.microbit_image_tshirt, 22],
                            [Lang.Blocks.microbit_image_rollerskate, 23],
                            [Lang.Blocks.microbit_image_duck, 24],
                            [Lang.Blocks.microbit_image_house, 25],
                            [Lang.Blocks.microbit_image_turtle, 26],
                            [Lang.Blocks.microbit_image_butterfly, 27],
                            [Lang.Blocks.microbit_image_stickman, 28],
                            [Lang.Blocks.microbit_image_ghost, 29],
                            [Lang.Blocks.microbit_image_sword, 30],
                            [Lang.Blocks.microbit_image_giraffe, 31],
                            [Lang.Blocks.microbit_image_skull, 32],
                            [Lang.Blocks.microbit_image_umbrella, 33],
                            [Lang.Blocks.microbit_image_snake, 34],
                            [Lang.Blocks.microbit_image_rabbit, 35],
                            [Lang.Blocks.microbit_image_ox, 36],
                            [Lang.Blocks.microbit_image_quarter_note, 37],
                            [Lang.Blocks.microbit_image_eighth_note, 38],
                            [Lang.Blocks.microbit_image_rake, 39],
                            [Lang.Blocks.microbit_image_target, 40],
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
                class: 'microbitExtLed',
                isNotFor: ['microbitExt'],
                def: {
                    type: 'microbit_ext_show_image',
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
            microbit_ext_set_led_image: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic',
                statements: [],
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
                class: 'microbitExtLed',
                isNotFor: ['microbitExt'],
                def: {
                    type: 'microbit_ext_set_led_image',
                },
                paramsKeyMap: {
                    VALUE: 0,
                },
                func: (sprite, script) => {
                    const value = script.getField('VALUE');
                    this.requestCommand(functionKeys.SET_CUSTOM_IMAGE, { value });
                },
            },
            microbit_ext_reset_screen: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic',
                statements: [],
                params: [
                    {
                        type: 'Indicator',
                        img: 'block_icon/hardware_icon.svg',
                        size: 12,
                    },
                ],
                events: {},
                class: 'microbitExtLed',
                isNotFor: ['microbitExt'],
                def: {
                    type: 'microbit_ext_reset_screen',
                },
                paramsKeyMap: {},
                func: (sprite, script) => {
                    this.requestCommand(functionKeys.RESET_SCREEN);
                },
            },
            microbit_ext_set_tone: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic',
                statements: [],
                params: [
                    {
                        type: 'Dropdown',
                        options: [
                            [Lang.Blocks.microbit_tone_lowc, 131],
                            [Lang.Blocks.microbit_tone_lowc_sharp, 139],
                            [Lang.Blocks.microbit_tone_lowd, 147],
                            [Lang.Blocks.microbit_tone_lowd_sharp, 156],
                            [Lang.Blocks.microbit_tone_lowe, 165],
                            [Lang.Blocks.microbit_tone_lowf, 175],
                            [Lang.Blocks.microbit_tone_lowf_sharp, 185],
                            [Lang.Blocks.microbit_tone_lowg, 196],
                            [Lang.Blocks.microbit_tone_lowg_sharp, 208],
                            [Lang.Blocks.microbit_tone_lowa, 220],
                            [Lang.Blocks.microbit_tone_lowa_sharp, 233],
                            [Lang.Blocks.microbit_tone_lowb, 247],
                            [Lang.Blocks.microbit_tone_c, 262],
                            [Lang.Blocks.microbit_tone_c_sharp, 277],
                            [Lang.Blocks.microbit_tone_d, 294],
                            [Lang.Blocks.microbit_tone_d_sharp, 311],
                            [Lang.Blocks.microbit_tone_e, 330],
                            [Lang.Blocks.microbit_tone_f, 349],
                            [Lang.Blocks.microbit_tone_f_sharp, 370],
                            [Lang.Blocks.microbit_tone_g, 392],
                            [Lang.Blocks.microbit_tone_g_sharp, 415],
                            [Lang.Blocks.microbit_tone_a, 440],
                            [Lang.Blocks.microbit_tone_a_sharp, 466],
                            [Lang.Blocks.microbit_tone_b, 494],
                            [Lang.Blocks.microbit_tone_highc, 523],
                            [Lang.Blocks.microbit_tone_highc_sharp, 554],
                            [Lang.Blocks.microbit_tone_highd, 587],
                            [Lang.Blocks.microbit_tone_highd_sharp, 622],
                            [Lang.Blocks.microbit_tone_highe, 659],
                            [Lang.Blocks.microbit_tone_highf, 698],
                            [Lang.Blocks.microbit_tone_highf_sharp, 740],
                            [Lang.Blocks.microbit_tone_highg, 784],
                            [Lang.Blocks.microbit_tone_highg_sharp, 831],
                            [Lang.Blocks.microbit_tone_higha, 880],
                            [Lang.Blocks.microbit_tone_higha_sharp, 932],
                            [Lang.Blocks.microbit_tone_highb, 988],
                        ],
                        value: 131,
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                    {
                        type: 'Dropdown',
                        options: [
                            ['4', 1],
                            ['2', 2],
                            ['1', 4],
                            ['1/2', 8],
                            ['1/4', 16],
                            ['1/8', 32],
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
                class: 'microbitExtSound',
                isNotFor: ['microbitExt'],
                def: {
                    type: 'microbit_ext_set_tone',
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
            microbit_ext_set_tempo: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic',
                statements: [],
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
                class: 'microbitExtSound',
                isNotFor: ['microbitExt'],
                def: {
                    params: [
                        null,
                        {
                            type: 'number',
                            params: ['120'],
                        },
                    ],
                    type: 'microbit_ext_set_tempo',
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
            microbit_ext_set_relative_tempo: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic',
                statements: [],
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
                class: 'microbitExtSound',
                isNotFor: ['microbitExt'],
                def: {
                    params: [
                        null,
                        {
                            type: 'number',
                            params: ['20'],
                        },
                    ],
                    type: 'microbit_ext_set_relative_tempo',
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

            microbit_ext_set_analog: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic',
                statements: [],
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
                class: 'microbitExtAnalog',
                isNotFor: ['microbitExt'],
                def: {
                    params: [
                        null,
                        {
                            type: 'number',
                            params: ['1023'],
                        },
                    ],
                    type: 'microbit_ext_set_analog',
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
            microbit_ext_set_analog_period: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic',
                statements: [],
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
                class: 'microbitExtAnalog',
                isNotFor: ['microbitExt'],
                def: {
                    params: [
                        null,
                        {
                            type: 'number',
                            params: ['20000'],
                        },
                    ],
                    type: 'microbit_ext_set_analog_period',
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
            microbit_ext_get_analog: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                fontColor: '#ffffff',
                skeleton: 'basic_string_field',
                statements: [],
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
                class: 'microbitExtAnalog',
                isNotFor: ['microbitExt'],
                def: {
                    type: 'microbit_ext_get_analog',
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
            microbit_ext_get_analog_map: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                fontColor: '#ffffff',
                skeleton: 'basic_string_field',
                statements: [],
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
                class: 'microbitExtAnalog',
                isNotFor: ['microbitExt'],
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
                    type: 'microbit_ext_get_analog_map',
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
            microbit_ext_set_digital: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic',
                statements: [],
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
                class: 'microbitExtDigital',
                isNotFor: ['microbitExt'],
                def: {
                    params: [],
                    type: 'microbit_ext_set_digital',
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
            microbit_ext_get_digital: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                fontColor: '#ffffff',
                skeleton: 'basic_boolean_field',
                statements: [],
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
                class: 'microbitExtDigital',
                isNotFor: ['microbitExt'],
                def: {
                    type: 'microbit_ext_get_digital',
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
            microbit_ext_get_button: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                fontColor: '#ffffff',
                skeleton: 'basic_boolean_field',
                statements: [],
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
                class: 'microbitExtButton',
                isNotFor: ['microbitExt'],
                def: {
                    type: 'microbit_ext_get_button',
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
            microbit_ext_get_sensor: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                fontColor: '#ffffff',
                skeleton: 'basic_string_field',
                statements: [],
                params: [
                    {
                        type: 'Dropdown',
                        options: [
                            [Lang.Blocks.microbit_sensor_light, 'lightLevel'],
                            [Lang.Blocks.microbit_sensor_temperature, 'temperature'],
                            [Lang.Blocks.microbit_sensor_compass, 'compassHeading'],
                        ],
                        value: 'temperature',
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                ],
                events: {},
                class: 'microbitExtSensor',
                isNotFor: ['microbitExt'],
                def: {
                    type: 'microbit_ext_get_sensor',
                },
                paramsKeyMap: {
                    VALUE: 0,
                },
                func: (sprite, script) => {
                    const value = script.getField('VALUE');
                    if (value === 'lightLevel') {
                        let commandType = functionKeys.GET_LIGHT_LEVEL;
                        this.requestCommandWithResponse(script.entity.id, commandType);
                    } else if (value === 'compassHeading') {
                        let commandType = functionKeys.GET_COMPASS_HEADING;
                        this.requestCommandWithResponse(script.entity.id, commandType);
                    }
                    return _get(Entry.hw.portData, ['payload', 'sensorData', value], -1);
                },
            },
            microbit_ext_is_tilt: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                fontColor: '#ffffff',
                skeleton: 'basic_boolean_field',
                statements: [],
                params: [
                    {
                        type: 'Dropdown',
                        options: [
                            [Lang.Blocks.microbit_tilt_left, 0],
                            [Lang.Blocks.microbit_tilt_right, 1],
                            [Lang.Blocks.microbit_tilt_front, 2],
                            [Lang.Blocks.microbit_tilt_rear, 3],
                        ],
                        value: 0,
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                ],
                events: {},
                class: 'microbitExtMove',
                isNotFor: ['microbitExt'],
                def: {
                    type: 'microbit_ext_is_tilt',
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
            microbit_ext_get_tilt: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                fontColor: '#ffffff',
                skeleton: 'basic_string_field',
                statements: [],
                params: [
                    {
                        type: 'Dropdown',
                        options: [
                            [Lang.Blocks.microbit_tilt_left, 0],
                            [Lang.Blocks.microbit_tilt_right, 1],
                            [Lang.Blocks.microbit_tilt_front, 2],
                            [Lang.Blocks.microbit_tilt_rear, 3],
                        ],
                        value: 0,
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                ],
                events: {},
                class: 'microbitExtMove',
                isNotFor: ['microbitExt'],
                def: {
                    type: 'microbit_ext_get_tilt',
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
            microbit_ext_get_accelerometer: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                fontColor: '#ffffff',
                skeleton: 'basic_string_field',
                statements: [],
                params: [
                    {
                        type: 'Dropdown',
                        options: [
                            [Lang.Blocks.microbit_acc_xaxis, 0],
                            [Lang.Blocks.microbit_acc_yaxis, 1],
                            [Lang.Blocks.microbit_acc_zaxis, 2],
                            [Lang.Blocks.microbit_acc_strength, 3],
                        ],
                        value: 0,
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                ],
                events: {},
                class: 'microbitExtSensor',
                isNotFor: ['microbitExt'],
                def: {
                    type: 'microbit_ext_get_accelerometer',
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
            microbit_ext_get_gesture: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                fontColor: '#ffffff',
                skeleton: 'basic_boolean_field',
                statements: [],
                template: '%1 움직임이 감지되는가?',
                params: [
                    {
                        type: 'Dropdown',
                        options: [
                            ['흔들림', 11],
                            ['세워서 위쪽 방향', 1],
                            ['세워서 아래쪽 방향', 2],
                            ['세워서 오른쪽 방향', 4],
                            ['세워서 왼쪽 방향', 3],
                            ['눕혀서 위쪽 방향', 5],
                            ['눕혀서 아래쪽 방향', 6],
                            ['눕혀서 오른쪽 방향', 14],
                            ['눕혀서 왼쪽 방향', 13],
                        ],
                        value: 1,
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                ],
                events: {},
                class: 'microbitExtMove',
                isNotFor: ['microbitExt'],
                def: {
                    type: 'microbit_ext_get_gesture',
                },
                paramsKeyMap: {
                    VALUE: 0,
                },
                func: (sprite, script) => {
                    let value = script.getField('VALUE');
                    const gesture = _get(Entry.hw.portData, 'payload.sensorData.gesture', -1);
                    // 밸류 중복으로 인해서 생기는 문제로 인해 +10을 오프셋으로 사용
                    if (value > 11) {
                        value = value - 10;
                    }
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
                        } else if (value == gesture) {
                            return true;
                        }
                        //

                        // } else if (value === 1) {
                        //     return true;
                        // }
                    }
                },
            },
            microbit_ext_set_servo: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic',
                statements: [],
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
                class: 'microbitExtServo',
                isNotFor: ['microbitExt'],
                def: {
                    params: [
                        null,
                        {
                            type: 'number',
                            params: ['180'],
                        },
                    ],
                    type: 'microbit_ext_set_servo',
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
            microbit_ext_set_servo_period: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic',
                statements: [],
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
                class: 'microbitExtServo',
                isNotFor: ['microbitExt'],
                def: {
                    params: [
                        null,
                        {
                            type: 'number',
                            params: ['1500'],
                        },
                    ],
                    type: 'microbit_ext_set_servo_period',
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
module.exports = Entry.MicrobitExt;
