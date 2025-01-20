'use strict';

Entry.ArduinoNano = {
    id: ['1.10', '1A.1'],
    name: 'ArduinoNano',
    url: 'http://www.arduino.cc/',
    imageName: 'arduinoNano.png',
    title: {
        ko: '아두이노 Nano',
        en: 'Arduino Nano',
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
        PULSEIN: 6,
        ULTRASONIC: 7,
        TIMER: 8,
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

Entry.ArduinoNano.setLanguage = function () {
    return {
        ko: {
            template: {
                arduino_nano_get_analog_value: '아날로그 %1 번 값',
                arduino_nano_get_analog_value_map:
                    '%1 의 범위를 %2 ~ %3 에서 %4 ~ %5 (으)로 바꾼 값',
                arduino_nano_get_ultrasonic_value:
                    '디지털 %1 번 핀을 Trig에 디지털 %2 번 핀을 Echo에 연결한 초음파 센서 값',
                arduino_nano_toggle_led: '디지털 %1 번 핀 %2 %3',
                arduino_nano_digital_pwm: '디지털 %1 번 핀을 %2 (으)로 정하기 %3',
                arduino_nano_set_tone: '디지털 %1 번 핀의 버저를 %2 %3 음으로 %4 초 울리기 %5',
                arduino_nano_set_servo: '디지털 %1 번 핀의 서보모터를 %2 도로 정하기 %3',
                arduino_nano_get_digital: '디지털 %1 번 값',
            },
            Device: {
                arduinonano: '아두이노 Nano',
            },
            Helper: {
                arduino_nano_get_analog_value: '선택한 핀의 아날로그 값입니다. (0 ~ 1023)',
                arduino_nano_get_analog_value_map:
                    '선택한 핀의 아날로그 값을 입력한 범위로 바꾼 값입니다.',
                arduino_nano_get_digital:
                    '선택한 핀의 디지털 값입니다. 핀이 켜진 경우 "참"으로 판단합니다.',
                arduino_nano_toggle_led: '선택한 핀을 켜거나 끕니다.',
                arduino_nano_digital_pwm: '선택한 핀을 입력한 값으로 정합니다.',
                arduino_nano_get_ultrasonic_value: '선택한 핀에 연결한 초음파 센서 값입니다.',
                arduino_nano_set_servo: '선택한 핀에 연결한 서보모터의 각도를 정합니다.',
                arduino_nano_set_tone:
                    '선택한 핀에 연결한 버저를 선택한 음으로 입력한 시간 동안 울립니다.',
            },
        },
        en: {
            template: {
                arduino_nano_get_analog_value: 'analog %1 value',
                arduino_nano_get_analog_value_map:
                    'mapped value of analog %1 that %2 ~ %3 to %4 ~ %5',
                arduino_nano_get_ultrasonic_value:
                    'ultrasonic sensor value that connects pin %1 to Trig and pin %2 to Echo',
                arduino_nano_toggle_led: '%2 digital %1 pin %3',
                arduino_nano_digital_pwm: 'Set digital %1 pin to %2 %3',
                arduino_nano_set_tone:
                    'Ring buzzer of pin %1 on note %2 octave %3 for %4 second(s) %5',
                arduino_nano_set_servo: 'Set servo motor of pin %1 to %2 degree %3',
                arduino_nano_get_digital: 'digital %1 value',
            },
            Helper: {
                arduino_nano_get_analog_value:
                    'Reports the value that analog signal of the selected pin. (0 ~ 1023)',
                arduino_nano_get_analog_value_map:
                    'Reports the value that analog signal of the selected pin mapping original range onto input range.',
                arduino_nano_get_digital:
                    'Checks whether the selected pin is turned on. If it turned on, it is judged as "True".',
                arduino_nano_toggle_led: 'Turn on or turn off the selected pin.',
                arduino_nano_digital_pwm: 'Set the selected pin to input value.',
                arduino_nano_set_servo:
                    'Set the degree of servo motor that connected with selected pin.',
                arduino_nano_set_tone:
                    'Rings buzzer connected with selected pin during input seconds.',
                arduino_nano_get_ultrasonic_value:
                    'Reports the value of ultrasonic sensor that connects pin.',
            },
        },
    };
};

Entry.ArduinoNano.blockMenuBlocks = [
    'arduino_nano_get_analog_value',
    'arduino_nano_get_analog_value_map',
    'arduino_nano_get_ultrasonic_value',
    'arduino_nano_get_digital',
    'arduino_nano_toggle_led',
    'arduino_nano_digital_pwm',
    'arduino_nano_set_servo',
    'arduino_nano_set_tone',
];

Entry.ArduinoNano.getBlocks = function () {
    return {
        //region arduinoNano 아두이노 나노
        arduino_nano_analog_list: {
            parent: 'arduino_ext_analog_list',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['A0', '0'],
                        ['A1', '1'],
                        ['A2', '2'],
                        ['A3', '3'],
                        ['A4', '4'],
                        ['A5', '5'],
                        ['A6', '6'],
                        ['A7', '7'],
                    ],
                    value: '0',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            syntax: undefined,
        },
        arduino_nano_get_analog_value: {
            parent: 'arduino_ext_get_analog_value',
            def: {
                params: [
                    {
                        type: 'arduino_nano_analog_list',
                    },
                ],
                type: 'arduino_nano_get_analog_value',
            },
            isNotFor: ['ArduinoNano'],
            syntax: undefined,
        },
        arduino_nano_get_analog_value_map: {
            parent: 'arduino_ext_get_analog_value_map',
            def: {
                params: [
                    {
                        type: 'arduino_nano_get_analog_value',
                        params: [
                            {
                                type: 'arduino_nano_analog_list',
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
                type: 'arduino_nano_get_analog_value_map',
            },
            isNotFor: ['ArduinoNano'],
            syntax: undefined,
        },
        arduino_nano_get_ultrasonic_value: {
            parent: 'arduino_ext_get_ultrasonic_value',
            def: {
                params: [
                    {
                        type: 'arduino_get_port_number',
                        params: ['2'],
                    },
                    {
                        type: 'arduino_get_port_number',
                        params: ['4'],
                    },
                ],
                type: 'arduino_nano_get_ultrasonic_value',
            },
            isNotFor: ['ArduinoNano'],
            syntax: undefined,
        },
        arduino_nano_get_digital: {
            parent: 'arduino_ext_get_digital',
            def: {
                params: [
                    {
                        type: 'arduino_get_port_number',
                    },
                ],
                type: 'arduino_nano_get_digital',
            },
            isNotFor: ['ArduinoNano'],
            syntax: undefined,
        },
        arduino_nano_toggle_led: {
            parent: 'arduino_ext_toggle_led',
            def: {
                params: [
                    {
                        type: 'arduino_get_port_number',
                    },
                    {
                        type: 'arduino_get_digital_toggle',
                        params: ['on'],
                    },
                    null,
                ],
                type: 'arduino_nano_toggle_led',
            },
            isNotFor: ['ArduinoNano'],
            syntax: undefined,
        },
        arduino_nano_digital_pwm: {
            template: Lang.template.arduino_ext_digital_pwm,
            parent: 'arduino_ext_digital_pwm',
            def: {
                params: [
                    {
                        type: 'arduino_get_pwm_port_number',
                    },
                    {
                        type: 'text',
                        params: ['255'],
                    },
                    null,
                ],
                type: 'arduino_nano_digital_pwm',
            },
            isNotFor: ['ArduinoNano'],
            syntax: undefined,
        },
        arduino_nano_set_tone: {
            parent: 'arduino_ext_set_tone',
            def: {
                params: [
                    {
                        type: 'arduino_get_port_number',
                        value: 4,
                    },
                    {
                        type: 'arduino_ext_tone_list',
                    },
                    {
                        type: 'arduino_ext_octave_list',
                    },
                    {
                        type: 'text',
                        params: ['1'],
                    },
                    null,
                ],
                type: 'arduino_nano_set_tone',
            },
            isNotFor: ['ArduinoNano'],
            syntax: undefined,
        },
        arduino_nano_set_servo: {
            parent: 'arduino_ext_set_servo',
            def: {
                params: [
                    {
                        type: 'arduino_get_port_number',
                    },
                    null,
                ],
                type: 'arduino_nano_set_servo',
            },
            isNotFor: ['ArduinoNano'],
            syntax: undefined,
        },
        //endregion arduinoNano 아두이노 나노
    };
};

module.exports = Entry.ArduinoNano;
