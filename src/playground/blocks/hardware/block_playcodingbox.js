'use strict';

// const dotMatrixPattern = {
//     0: [
//         [0, 0, 0, 0, 0, 0, 0, 0],
//         [0, 1, 1, 1, 1, 1, 1, 0],
//         [0, 1, 0, 0, 0, 0, 1, 0],
//         [0, 1, 0, 0, 0, 0, 1, 0],
//         [0, 1, 0, 0, 0, 0, 1, 0],
//         [0, 1, 0, 0, 0, 0, 1, 0],
//         [0, 1, 1, 1, 1, 1, 1, 0],
//         [0, 0, 0, 0, 0, 0, 0, 0],
//     ],
//     1: [
//         [0, 0, 0, 0, 0, 0, 0, 0],
//         [0, 0, 0, 1, 1, 0, 0, 0],
//         [0, 0, 1, 1, 1, 0, 0, 0],
//         [0, 0, 0, 1, 1, 0, 0, 0],
//         [0, 0, 0, 1, 1, 0, 0, 0],
//         [0, 0, 0, 1, 1, 0, 0, 0],
//         [0, 0, 1, 1, 1, 1, 0, 0],
//         [0, 0, 0, 0, 0, 0, 0, 0],
//     ],
//     2: [
//         [0, 0, 0, 0, 0, 0, 0, 0],
//         [0, 0, 1, 1, 1, 1, 0, 0],
//         [0, 0, 0, 0, 0, 1, 0, 0],
//         [0, 0, 0, 0, 1, 0, 0, 0],
//         [0, 0, 0, 1, 0, 0, 0, 0],
//         [0, 0, 1, 0, 0, 0, 0, 0],
//         [0, 0, 1, 1, 1, 1, 0, 0],
//         [0, 0, 0, 0, 0, 0, 0, 0],
//     ],
//     3: [
//         [0, 0, 0, 0, 0, 0, 0, 0],
//         [0, 0, 1, 1, 1, 1, 0, 0],
//         [0, 0, 0, 0, 0, 1, 0, 0],
//         [0, 0, 1, 1, 1, 1, 0, 0],
//         [0, 0, 1, 1, 1, 1, 0, 0],
//         [0, 0, 0, 0, 0, 1, 0, 0],
//         [0, 0, 1, 1, 1, 1, 0, 0],
//         [0, 0, 0, 0, 0, 0, 0, 0],
//     ],
//     4: [
//         [0, 0, 0, 0, 0, 0, 0, 0],
//         [0, 0, 0, 0, 1, 0, 0, 0],
//         [0, 0, 0, 1, 1, 0, 0, 0],
//         [0, 0, 1, 0, 1, 0, 1, 0],
//         [0, 1, 1, 1, 1, 1, 1, 0],
//         [0, 0, 0, 0, 1, 0, 0, 0],
//         [0, 0, 0, 0, 1, 0, 0, 0],
//         [0, 0, 0, 0, 0, 0, 0, 0],
//     ],
//     5: [
//         [0, 0, 0, 0, 0, 0, 0, 0],
//         [0, 1, 1, 1, 1, 1, 1, 0],
//         [0, 1, 0, 0, 0, 0, 0, 0],
//         [0, 1, 0, 0, 0, 0, 0, 0],
//         [0, 1, 1, 1, 1, 1, 1, 0],
//         [0, 0, 0, 0, 0, 0, 1, 0],
//         [0, 1, 1, 1, 1, 1, 1, 0],
//         [0, 0, 0, 0, 0, 0, 0, 0],
//     ],
//     6: [
//         [0, 0, 0, 0, 0, 0, 0, 0],
//         [0, 1, 1, 1, 1, 1, 1, 0],
//         [0, 1, 0, 0, 0, 0, 0, 0],
//         [0, 1, 0, 0, 0, 0, 0, 0],
//         [0, 1, 1, 1, 1, 1, 1, 0],
//         [0, 1, 0, 0, 0, 0, 1, 0],
//         [0, 1, 1, 1, 1, 1, 1, 0],
//         [0, 0, 0, 0, 0, 0, 0, 0],
//     ],
//     7: [
//         [0, 0, 0, 0, 0, 0, 0, 0],
//         [0, 1, 1, 1, 1, 1, 1, 0],
//         [0, 1, 0, 0, 0, 0, 1, 0],
//         [0, 1, 0, 0, 0, 0, 1, 0],
//         [0, 0, 0, 0, 0, 0, 1, 0],
//         [0, 0, 0, 0, 0, 0, 1, 0],
//         [0, 0, 0, 0, 0, 0, 1, 0],
//         [0, 0, 0, 0, 0, 0, 0, 0],
//     ],
//     8: [
//         [0, 0, 0, 0, 0, 0, 0, 0],
//         [0, 1, 1, 1, 1, 1, 1, 0],
//         [0, 1, 0, 0, 0, 0, 1, 0],
//         [0, 1, 1, 1, 1, 1, 1, 0],
//         [0, 0, 0, 1, 1, 0, 0, 0],
//         [0, 1, 0, 0, 0, 1, 1, 0],
//         [0, 1, 0, 0, 0, 0, 1, 0],
//         [0, 1, 1, 1, 1, 1, 1, 0],
//     ],
//     9: [
//         [0, 0, 0, 0, 0, 0, 0, 0],
//         [0, 1, 1, 1, 1, 1, 1, 0],
//         [0, 1, 0, 0, 0, 0, 1, 0],
//         [0, 1, 1, 1, 1, 1, 1, 0],
//         [0, 0, 0, 0, 0, 0, 1, 0],
//         [0, 0, 0, 0, 0, 0, 1, 0],
//         [0, 1, 1, 1, 1, 1, 1, 0],
//         [0, 0, 0, 0, 0, 0, 0, 0],
//     ],
// };

Entry.Playcodingbox = {
    id: '66.1',
    name: 'Playcodingbox',
    url: 'https://www.playcoding.kr/edu1',
    imageName: 'playcodingbox.png',
    title: {
        ko: '플레이코딩박스',
        en: 'PlayCodingBox',
    },
    setZero() {
        if (!Entry.hw.sendQueue.SET) {
            Entry.hw.sendQueue = {
                GET: {},
                SET: {},
            };
        } else {
            const keySet = Object.keys(Entry.hw.sendQueue.SET);
            keySet.forEach((key) => {
                Entry.hw.sendQueue.SET[key].data = 0;
                Entry.hw.sendQueue.SET[key].time = new Date().getTime();
            });
        }
        Entry.hw.update();
    },
    sensorTypes: { 
        ALIVE: 0,
        DIGITAL: 1,
        ANALOG: 2,
        PWM: 3,
        SERVO_PIN: 4,
        TONE: 5,
        TIMER: 7,
        RGB_LED: 8,
        BUZZER: 9,
        DOT_MATRIX: 10,
        GAS_SENSOR: 11,
        MAGNETIC_SENSOR: 12,
        SOUND_SENSOR: 13,
        TEMP_SENSOR: 14,
        PIR_SENSOR: 15,
        MORTOR_FAN: 16,
        BUTTON_SENSOR: 17,
    },
    

    toneTable: {
        0: 0,
        C: 1,
        CS: 2,
        D: 3,
        DS: 4,
        E: 5,
        F: 6,
        FS: 7,
        G: 8,
        GS: 9,
        A: 10,
        AS: 11,
        B: 12,
    },
    toneMap: {
        1: [33, 65, 131, 262, 523, 1046, 2093, 4186],
        2: [35, 69, 139, 277, 554, 1109, 2217, 4435],
        3: [37, 73, 147, 294, 587, 1175, 2349, 4699],
        4: [39, 78, 156, 311, 622, 1245, 2849, 4978],
        5: [41, 82, 165, 330, 659, 1319, 2637, 5274],
        6: [44, 87, 175, 349, 698, 1397, 2794, 5588],
        7: [46, 92, 185, 370, 740, 1480, 2960, 5920],
        8: [49, 98, 196, 392, 784, 1568, 3136, 6272],
        9: [52, 104, 208, 415, 831, 1661, 3322, 6645],
        10: [55, 110, 220, 440, 880, 1760, 3520, 7040],
        11: [58, 117, 233, 466, 932, 1865, 3729, 7459],
        12: [62, 123, 247, 494, 988, 1976, 3951, 7902],
    },
    highList: ['high', '1', 'on'],
    lowList: ['low', '0', 'off'],
    BlockState: {},
};



Entry.playcodingbox.blockMenuBlocks = [
    'playcodingbox_get_infrared_sensor', 
    'playcodingbox_set_rgb_led', 
    'playcodingbox_set_buzzer', 
    'playcodingbox_toggle_led', 
    'playcodingbox_set_servo_motor', 
    'playcodingbox_set_motor_fan',  
    'playcodingbox_when_button_pressed', 
    'playcodingbox_get_magnetic_sensor', 
    'playcodingbox_get_gas_sensor', 
    'playcodingbox_check_sound_level_duration', 
    'playcodingbox_get_temperature_sensor', 
    'playcodingbox_set_dotmatrix', 
    'playcodingbox_get_analog', 
    'playcodingbox_get_digital', 
    'playcodingbox_get_analog_value_map'
];

Entry.playcodingbox.getBlocks = function () {
    return {   
        playcodingbox_get_infrared_sensor: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_boolean_field',
            params: [
                {
                    type: 'Dropdown',
                    options:[
                        ['D2', '2'],
                    ],
                    value: '2',
                    fontSize: 11,
                },
            ],
            def: {
                params: [
                    '2', 
                ],
                type: 'playcodingbox_get_infrared_sensor',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'playcodingboxGet',
            isNotFor: ['Playcodingbox'],
            func(sprite, script) {
                const port = script.getNumberValue('PORT', script);
                const DIGITAL = Entry.hw.portData.DIGITAL;
            
                if (!Entry.hw.sendQueue.GET) {
                    Entry.hw.sendQueue.GET = {};
                }
                Entry.hw.sendQueue.GET[Entry.playcodingbox.sensorTypes.DIGITAL] = {
                    port,
                    time: new Date().getTime(),
                };
            
                return DIGITAL && DIGITAL[port] ? 1 : 0; 
            }
        },

        playcodingbox_set_rgb_led: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
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
            def: {
                params: [
                    {
                        type: 'number',
                        params: ['255'], 
                    },
                    {
                        type: 'number',
                        params: ['255'],
                    },
                    {
                        type: 'number',
                        params: ['255'],
                    },
                    null,
                ],
                type: 'playcodingbox_set_rgb_led',
            },
            paramsKeyMap: {
                R: 0,
                G: 1,
                B: 2,
            },

            class: 'playcodingbox',
            isNotFor: ['Playcodingbox'],
            func(sprite, script) {
                const redPin = 3; 
                const greenPin = 5; 
                const bluePin = 6; 

                let rValue = script.getNumberValue('R', script);
                let gValue = script.getNumberValue('G', script);
                let bValue = script.getNumberValue('B', script);

                rValue = Math.max(0, Math.min(rValue, 255));
                gValue = Math.max(0, Math.min(gValue, 255));
                bValue = Math.max(0, Math.min(bValue, 255));

                Entry.hw.sendQueue.SET = Entry.hw.sendQueue.SET || {};
                Entry.hw.sendQueue.SET[redPin] = {
                    type: Entry.playcodingbox.sensorTypes.PWM,
                    data: rValue,
                    time: new Date().getTime(),
                };
                Entry.hw.sendQueue.SET[greenPin] = {
                    type: Entry.playcodingbox.sensorTypes.PWM,
                    data: gValue,
                    time: new Date().getTime(),
                };
                Entry.hw.sendQueue.SET[bluePin] = {
                    type: Entry.playcodingbox.sensorTypes.PWM,
                    data: bValue,
                    time: new Date().getTime(),
                };

                return script.callReturn();
            }
        },
        playcodingbox_set_buzzer: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                },
                {
                    type: 'Dropdown',
                    options: [
                        ['도', 'C'],
                        ['도#', 'CS'],
                        ['레', 'D'],
                        ['레#', 'DS'],
                        ['미', 'E'],
                        ['파', 'F'],
                        ['파#', 'FS'],
                        ['솔', 'G'],
                        ['솔#', 'GS'],
                        ['라', 'A'],
                        ['라#', 'AS'],
                        ['시', 'B'],
                    ],
                    value: 'C',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        ['1', '1'],
                        ['2', '2'],
                        ['3', '3'],
                        ['4', '4'],
                        ['5', '5'],
                        ['6', '6'],
                    ],
                    value: '4',
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
            def: {
                params: [
                    {
                        type: 'number',
                        params: ['D4'], 
                    },
                    {
                        type: 'Dropdown',
                        params: ['C'],
                    },
                    {
                        type: 'Dropdown',
                        params: ['4'],
                    },
                    {
                        type: 'number',
                        params: ['1'],
                    },
                    null,
                ],
                type: 'playcodingbox_set_buzzer',
            },
            paramsKeyMap: {
                PORT: 0,
                NOTE: 1,
                OCTAVE: 2,
                DURATION: 3,
            },
            class: 'playcodingbox',
            isNotFor: ['Playcodingbox'],
            func(sprite, script) {
                const port = script.getNumberValue('PORT', script);
                const note = script.getField('NOTE', script);
                const octave = script.getNumberValue('OCTAVE', script);
                const duration = script.getNumberValue('DURATION', script);

                let noteValue = Entry.playcodingbox.toneTable[note];
                let octaveIndex = octave - 1;
                Entry.hw.sendQueue.SET[port] = 
                {
                    type: Entry.playcodingbox.sensorTypes.BUZZER,
                    data: {
                        noteIndex: noteValue,
                        octave: octaveIndex,
                        duration: duration * 1000,
                    },
                    time: new Date().getTime(),
                };


                return script.callReturn();
            },
        },

        playcodingbox_toggle_led: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['D7', '7'],
                        ['D8', '8'],
                    ],
                    value: '7',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        ['켜기', 'on'],
                        ['끄기', 'off'],
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
            def: {
                params: [null, null, null],
                type: 'playcodingbox_toggle_led',
            },
            paramsKeyMap: {
                PORT: 0,
                OPERATOR: 1,
            },
            class: 'playcodingbox',
            isNotFor: ['Playcodingbox'],
            func(sprite, script) {
                const port = script.getNumberValue('PORT', script);
                let value = script.getValue('OPERATOR', script);

                if (value === 'on') {
                    value = 255;
                } else if (value === 'off') {
                    value = 0;
                }

                if (!Entry.hw.sendQueue.SET) {
                    Entry.hw.sendQueue.SET = {};
                }
                Entry.hw.sendQueue.SET[port] = {
                    type: Entry.playcodingbox.sensorTypes.DIGITAL,
                    data: value,
                    time: new Date().getTime(),
                };
                return script.callReturn();
            },
        },

        playcodingbox_set_servo_motor: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
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
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            def: {
                params: [
                    {
                        type: 'arduino_get_port_number',
                        params:['D9']
                    },
                    {
                        type: 'number',
                        params: ['90'],
                    },
                    null,
                ],
                type: 'playcodingbox_set_servo_motor',
            },
            paramsKeyMap: {
                DEGREE: 0,
            },
            class: 'playcodingbox',
            isNotFor: ['Playcodingbox'],
            func(sprite, script) {
                const servoPin = 9;
                let degree = script.getNumberValue('DEGREE', script);

                degree = Math.max(0, Math.min(degree, 180));

                Entry.hw.sendQueue.SET = Entry.hw.sendQueue.SET || {};
                Entry.hw.sendQueue.SET[servoPin] = {
                    type: Entry.playcodingbox.sensorTypes.SERVO_PIN,
                    data: degree,
                    time: new Date().getTime(),
                };

                return script.callReturn();
            },
        },

        playcodingbox_set_motor_fan: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['D10', '10'],
                        ['D11', '11'],
                    ],
                    value: '10',
                    fontSize: 11,
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
            def: {
                params: [
                    {
                        type: 'number',
                        params: ['255'],
                    },
                    null,
                ],
                type: 'playcodingbox_set_motor_fan',
            },
            paramsKeyMap: {
                PORT: 0,
                SPEED: 1,
            },
            class: 'playcodingbox',
            isNotFor: ['Playcodingbox'],
            func(sprite, script) {
                const port = script.getNumberValue('PORT', script);
                const speed = script.getNumberValue('SPEED', script);
        
                Entry.hw.sendQueue.SET = Entry.hw.sendQueue.SET || {};
                Entry.hw.sendQueue.SET[port] = {
                    type: Entry.playcodingbox.sensorTypes.PWM,
                    data: speed,
                    time: new Date().getTime(),
                };
        
                return script.callReturn();
            },
        },

        playcodingbox_set_motor_fan: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['왼쪽 모터 (D10)', '10'],
                        ['오른쪽 모터 (D11)', '11'],
                    ],
                    value: '10',
                    fontSize: 11,
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
            def: {
                params: [
                    null,
                    {
                        type: 'number',
                        params: ['255'],
                    },
                    null,
                ],
                type: 'playcodingbox_set_motor_fan',
            },
            paramsKeyMap: {
                PORT: 0,
                SPEED: 1,
            },
            class: 'playcodingbox',
            isNotFor: ['Playcodingbox'],
            func(sprite, script) {
                const port = script.getNumberValue('PORT', script);
                const speed = script.getNumberValue('SPEED', script);
        
                const adjustedSpeed = Math.max(0, Math.min(speed, 255));
        
                Entry.hw.sendQueue.SET = Entry.hw.sendQueue.SET || {};
                Entry.hw.sendQueue.SET[port] = {
                    type: Entry.playcodingbox.sensorTypes.PWM,
                    data: adjustedSpeed,
                    time: new Date().getTime(),
                };
        
                return script.callReturn();
            },
        },
        playcodingbox_when_button_pressed: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['D12', '12'],
                        ['D13', '13'],
                    ],
                    value: '12',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            def: {
                params: [null],
                type: 'playcodingbox_when_button_pressed',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'playcodingbox',
            isNotFor: ['Playcodingbox'],
            event: {
                type: 'when_button_pressed',
            },
            func(sprite, script) {
                const port = script.getField('PORT', script);
                const BUTTON_SENSOR = Entry.hw.portData.BUTTON_SENSOR;
        
                if (BUTTON_SENSOR && BUTTON_SENSOR[port] === 1) {
                    return script.callReturn();
                } else {
                    return script;
                }
            },
        },
        
        playcodingbox_get_magnetic_sensor: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_boolean_field',
            params: [
                {
                    type: 'Dropdown',
                    options: [['A0', '0'], ['A1', '1'], ['A2', '2'], ['A3', '3'], ['A4', '4'], ['A5', '5'],['A6', '6'],['A7', '7']],
                    value: '0',
                    fontSize: 11,
                },
            ],
            Def: {
                params: [null],
                type: 'playcodingbox_get_magnetic_sensor',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'playcodingboxGet',
            isNotFor: ['Playcodingbox'],
            func(sprite, script) {
                const port = script.getNumberValue('PORT', script);
                const ANALOG = Entry.hw.portData.ANALOG;
                const value = ANALOG ? ANALOG[port] || 0 : 0;
        
                return value > 512 ? 1 : 0;
            },
        },
        playcodingbox_get_analog_value_map: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
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
            def: {
                params: [
                    {
                        type: 'playcodingbox_get_analog_value',
                        params: [
                            {
                                type: 'playcodingbox_analog_list',
                                },
                            ],
                        },
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
       
                        type: 'playcodingbox_get_analog_value_map',
   
                    },
   
                    paramsKeyMap: {
   
                        PORT: 0,
   
                        VALUE2: 1,
   
                        VALUE3: 2,
   
                        VALUE4: 3,
   
                        VALUE5: 4,
   
                    },
   
                    class: 'PlayCodingBoxGet',
   
                    isNotFor: ['Playcodingbox'],
   
                    func(sprite, script) {
   
                        let result = script.getValue('PORT', script);
   
                        const ANALOG = Entry.hw.portData.ANALOG;
   
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

                        
       
                        if (value2 > value3) {
       
                            var swap = value2;
       
                            value2 = value3;
       
                            value3 = swap;
       
                        }
       
                        if (value4 > value5) {
       
                            var swap = value4;
       
                            value4 = value5;
       
                            value5 = swap;
       
                        }
       
                        result -= value2;
       
                        result = result * ((value5 - value4) / (value3 - value2));
       
                        result += value4;
       
                        result = Math.min(value5, result);      
                        result = Math.max(value4, result);      
                        if (isFloat) {       
                            result = Math.round(result * 100) / 100;        
                        } else {        
                            result = Math.round(result);       
                        }       
                        return result;    
                    },

                },


        playcodingbox_get_gas_sensor: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_boolean_field',
            params: [
                {
                    type: 'Dropdown',
                    options: [['A0', '0'], ['A1', '1'], ['A2', '2'], ['A3', '3'], ['A4', '4'], ['A5', '5'],['A6', '6'],['A7', '7']],
                    value: '1',
                    fontSize: 11,
                },
            ],
            def: {
                params: [null],
                type: 'playcodingbox_get_gas_sensor',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'playcodingboxGet',
            isNotFor: ['Playcodingbox'],
            func(sprite, script) {
                const port = script.getNumberValue('PORT', script);
                const ANALOG = Entry.hw.portData.ANALOG;
                const value = ANALOG ? ANALOG[port] || 0 : 0;
        
                return value > 512 ? 1 : 0;
            },
        },
        playcodingbox_check_sound_level_duration: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_boolean_field',
            params: [
                {
                    type: 'Dropdown',
                    options: [['A0', '0'], ['A1', '1'], ['A2', '2'], ['A3', '3'], ['A4', '4'], ['A5', '5'], ['A6', '6'], ['A7', '7']],
                    value: '2',
                    fontSize: 11,
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
            def: {
                params: [
                    '2',
                    {
                        type: 'number',
                        params: ['50'],
                    },
                    {
                        type: 'number',
                        params: ['2'],
                    },
                ],
                type: 'playcodingbox_check_sound_level_duration',
            },
            paramsKeyMap: {
                PORT: 0,
                THRESHOLD: 1,
                DURATION: 2,
            },
            class: 'playcodingbox',
            isNotFor: ['Playcodingbox'],
            func(sprite, script) {
                const port = script.getNumberValue('PORT', script);
                const threshold = script.getNumberValue('THRESHOLD', script);
                const soundLevel = Entry.hw.portData.ANALOG[port];
        
                if (soundLevel >= threshold) {
                    return 1; 
                } else {
                    return 0;
                }
            },
        },

        playcodingbox_get_temperature_sensor: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_boolean_field',
            params: [
                {
                    type: 'Dropdown',
                    options: [['A0', '0'], ['A1', '1'], ['A2', '2'], ['A3', '3'], ['A4', '4'], ['A5', '5'], ['A6', '6'], ['A7', '7']],
                    value: '3',
                    fontSize: 11,
                },
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                },
            ],
            def: {
                params: [
                    null,
                    {
                        type: 'number',
                        params: ['30'],
                    },
                ],
                type: 'playcodingbox_get_temperature_sensor',
            },
            paramsKeyMap: {
                PORT: 0,
                TEMP: 1,
            },
            class: 'playcodingboxGet',
            isNotFor: ['Playcodingbox'],
            func(sprite, script) {
                const port = script.getField('PORT', script);
                const temperature = script.getNumberValue('TEMP', script);
                const ANALOG = Entry.hw.portData.ANALOG;
                
                const sensorValue = ANALOG[port];
                const calculatedTemp = (sensorValue * 5 / 1024) * 100;

                return calculatedTemp >= temperature ? 1 : 0;
            },
        }, 
        playcodingbox_set_dotmatrix: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['숫자 0', '0'],
                        ['숫자 1', '1'],
                        ['숫자 2', '2'],
                        ['숫자 3', '3'],
                        ['숫자 4', '4'],
                        ['숫자 5', '5'],
                        ['숫자 6', '6'],
                        ['숫자 7', '7'],
                        ['숫자 8', '8'],
                        ['숫자 9', '9'],
                    ],
                    value: '0',
                    fontSize: 11,
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            def: {
                params: [null, null],
                type: 'playcodingbox_set_dotmatrix',
            },
            paramsKeyMap: {
                PATTERN: 0,
            },
            class: 'playcodingbox',
            isNotFor: ['Playcodingbox'],
            func(sprite, script) {
                const patternKey = script.getField('PATTERN', script);
                const pattern = dotMatrixPattern[patternKey];
        
                if (!pattern) {
                    console.warn(`Invalid pattern key: ${patternKey}`);
                    return script.callReturn();
                }
        
                Entry.hw.sendQueue.SET = Entry.hw.sendQueue.SET || {};
                Entry.hw.sendQueue.SET['A4'] = {
                    type: Entry.playcodingbox.sensorTypes.DOT_MATRIX,
                    data: pattern.flat(),
                    };
                    Entry.hw.sendQueue.SET['A5'] = {
                        type: Entry.playcodingbox.sensorTypes.DOT_MATRIX,
                        data: pattern.flat(),
                        };
        
                return script.callReturn();
            },
        },
    
        playcodingbox_get_analog: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            params: [
                {
                    type: 'Dropdown',
                    options: [['A0', '0'], ['A1', '1'], ['A2', '2'], ['A3', '3'], ['A4', '4'], ['A5', '5'], ['A6', '6'], ['A7', '7']],
                    value: '0',
                    fontSize: 11,
                },
            ],
            def: {
                params: [null],
                type: 'playcodingbox_get_analog',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'playcodingboxGet',
            isNotFor: ['Playcodingbox'],
            func(sprite, script) {
                const port = script.getNumberValue('PORT', script);
                const ANALOG = Entry.hw.portData.ANALOG;
                return ANALOG ? ANALOG[port] || 0 : 0;
            },
        },
        playcodingbox_get_digital: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_boolean_field',
            params: [
                {
                    type: 'Dropdown',
                    options: [['D0', '0'], ['D1', '1'], ['D2', '2'], ['D3', '3'], ['D4', '4'], ['D5', '5'], ['D6', '6'], ['D7', '7'], ['D8', '8'], ['D9', '9'], ['D10', '10'], ['D11', '11'], ['D12', '12'], ['D13', '13']],
                    value: '0',
                    fontSize: 11,
                },
            ],
            def: {
                params: [null],
                type: 'playcodingbox_get_digital',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'playcodingboxGet',
            isNotFor: ['Playcodingbox'],
            func(sprite, script) {
                const port = script.getNumberValue('PORT', script);
                const DIGITAL = Entry.hw.portData.DIGITAL;
                return DIGITAL ? DIGITAL[port] || 0 : 0;
            },
        },   

    };
};




Entry.playcodingbox.setLanguage = function () {
    return {
        ko: {
            template: {
                playcodingbox_get_infrared_sensor: '디지털 %1 번 핀에서 감지됐을때',
                playcodingbox_set_rgb_led: 'RGB LED 빨강 %1, 초록%2, 파랑%3 값 설정',
                playcodingbox_set_buzzer: '디지털 %1 번 핀의 부저를 %2 음계 %3 옥타브로 %4 초 울리기',
                playcodingbox_toggle_led: '디지털 LED %1 번 핀을 %2 상태로 설정',
                playcodingbox_set_servo_motor: '디지털 %1 번 핀의 서보모터를 %2 도로 설정',
                playcodingbox_set_motor_fan: '디지털 %1 번 핀의 모터를 %2 속도로 설정',
                playcodingbox_when_button_pressed: '디지털 %1 번 핀의 버튼이 눌렸을 때',
                playcodingbox_get_magnetic_sensor: '아날로그 %1 핀의 자기 센서 값',
                playcodingbox_get_gas_sensor: '아날로그 %1핀의 가스 센서 값',
                playcodingbox_check_sound_level_duration: '아날로그 %1핀의 사운드 크기가 %2 이상일 때',
                playcodingbox_get_temperature_sensor: '아날로그 %1 핀의 온도가 %2도 이상일 때',
                playcodingbox_set_dotmatrix: '도트 매트릭스 설정 %1',
                playcodingbox_get_analog: '아날로그 핀 %1 번 읽기',
                playcodingbox_get_digital: '디지털 핀 %1 번 읽기',
                playcodingbox_get_analog_value_map: '%1 의 범위를 %2 ~ %3 에서 %4 ~ %5 (으)로 바꾼 값',






            },
        },
    };
};

module.exports = Entry.playcodingbox;