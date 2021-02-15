'use strict';

Entry.jikko_esp = {
    id: 'EF.FF',
    name: 'jikko_esp',
    url: 'http://www.makeitall.co.kr',
    imageName: 'jikko_esp.png',
    title: {
        ko: '직코_esp',
        en: 'jikko_esp',
    },
    Static: {
        BUTTON_PRESS_VALUE: 0,
    },

    //정지시 초기화 함수
    setZero: function() {
        if (!Entry.hw.sendQueue.SET) {
            Entry.hw.sendQueue = {
                GET: {},
                SET: {},
            };
        } else {
            var keySet = Object.keys(Entry.hw.sendQueue.SET);
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
        SERVO: 4,
        TONE: 5,
        PULSEIN: 6,
        ULTRASONIC: 7,
        TIMER: 8,
        READ_BLUETOOTH: 9,
        WRITE_BLUETOOTH: 10,
        LCD: 11,
        LCDCLEAR: 12,
        RGBLED: 13,
        DCMOTOR: 14,
        OLED: 15,
        PIR: 16,
        LCDINIT: 17,
        DHTHUMI: 18,
        DHTTEMP: 19,
        NEOPIXELINIT: 20,
        NEOPIXELBRIGHT: 21,
        NEOPIXEL: 22,
        NEOPIXELALL: 23,
        NEOPIXELCLEAR: 24,
        MP3INIT: 30,
        MP3PLAY1: 31,
        MP3PLAY2: 32,
        MP3VOL: 33,
        OLEDTEXT: 34,
    },

    toneTable: {
        '0': 0,
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
        '1': [33, 65, 131, 262, 523, 1046, 2093, 4186],
        '2': [35, 69, 139, 277, 554, 1109, 2217, 4435],
        '3': [37, 73, 147, 294, 587, 1175, 2349, 4699],
        '4': [39, 78, 156, 311, 622, 1245, 2849, 4978],
        '5': [41, 82, 165, 330, 659, 1319, 2637, 5274],
        '6': [44, 87, 175, 349, 698, 1397, 2794, 5588],
        '7': [46, 92, 185, 370, 740, 1480, 2960, 5920],
        '8': [49, 98, 196, 392, 784, 1568, 3136, 6272],
        '9': [52, 104, 208, 415, 831, 1661, 3322, 6645],
        '10': [55, 110, 220, 440, 880, 1760, 3520, 7040],
        '11': [58, 117, 233, 466, 932, 1865, 3729, 7459],
        '12': [62, 123, 247, 494, 988, 1976, 3951, 7902],
    },
    direction: {
        CENTER: 0,
        UP: 1,
        LEFT: 2,
        RIGHT: 3,
        DOWN: 4,
        LEFT_UP: 5,
        LEFT_DOWN: 6,
        RIGHT_UP: 7,
        RIGHT_DOWN: 8,
    },
    highList: ['high', '1', 'on'],
    lowList: ['low', '0', 'off'],
    BlockState: {},
};
Entry.jikko_esp.setLanguage = function() {
    return {
        ko: {
            template: {
                jikko_esp_toggle_on: '켜기',
                jikko_esp_toggle_off: '끄기',
                jikko_esp_lcd_first_line: '첫 번째',
                jikko_esp_lcd_seconds_line: '두 번째',
                jikko_esp_get_analog_value: '아날로그 %1 핀 읽기',
                jikko_esp_get_light_value: '조도센서(AO %1)값',
                jikko_esp_get_moisture_value: '토양수분센서(AO %1)값',
                jikko_esp_get_sound_value: '사운드센서(AO %1)값',
                jikko_esp_get_infrared_value: '적외선센서(AO %1)값',
                jikko_esp_get_pullup: '풀업 저항 사용 버튼 %1 핀 눌림 상태',
                jikko_esp_get_button: '버튼 %1 핀 눌림 상태',
                jikko_esp_get_analog_mapping:
                    '아날로그 %1 번 핀 센서 값의 범위를 %2 ~ %3 에서 %4 ~ %5 로 바꾼 값',
                jikko_esp_mapping1: '%1 값을 %2 ~ %3 사이로 제한한 값',
                jikko_esp_mapping2: '%1 값을 %2 ~ %3 범위에서 %4 ~ %5 범위로 변환',
                jikko_esp_get_digital_ultrasonic: '초음파 Trig %1 핀 Echo %2 핀 센서 값',
                jikko_esp_get_digital: '디지털 %1 핀 읽기',
                jikko_esp_get_digital_toggle: '디지털 %1 핀 센서 값',
                jikko_esp_set_digital_toggle: '디지털 %1 핀 %2 %3',
                jikko_esp_toggle_led: '디지털 %1 핀 %2  %3',
                jikko_esp_set_led_toggle: 'LED %1 핀 %2 %3',

                jikko_esp_set_digital_pwm: 'PWM %1 핀 채널: %2 주파수: %3 해상도: %4 값:%5 출력 %6',
                jikko_esp_set_digital_servo: '서보 모터 %1 핀 %2 각도로 회전 %3',
                jikko_esp_set_digital_buzzer_toggle: '피에조부저 %1 핀 %2 %3',
                jikko_esp_set_digital_buzzer_volume:
                    '피에조부저 (PWM %1 핀) 음량 %2 출력 (0 ~ 255) %3',
                jikko_esp_set_digital_buzzer: '피에조부저 %1 핀 %2 %3 음 %4 박자 연주 %5',
                jikko_esp_set_neopixel_init:
                    '네오픽셀 LED 시작하기 설정 ( %1 핀에 %2 개의 LED 연결) %3',
                jikko_esp_set_neopixel_bright:
                    '네오픽셀 LED ( %1 핀) 밝기 %2 으로 설정 (0 ~ 255) %3',
                jikko_esp_set_neopixel: '네오픽셀 LED ( %1 핀) %2 번째 LED 색 %3 출력 %4',
                jikko_esp_set_neopixel_all: '네오픽셀 LED ( %1 핀) 모든 LED 색 %2 출력 %3',
                jikko_esp_set_neopixel_clear: '네오픽셀 LED ( %1 핀) 모든 LED 끄기 %2',

                jikko_esp_lcd_init: 'I2C LCD 시작하기 설정 (주소 %1 ,열 %2, 행 %3) %4',
                jikko_esp_get_lcd_row: '%1',
                jikko_esp_get_lcd_col: '%1',
                jikko_esp_module_digital_lcd: 'LCD화면 %1 열 %2 행 부터 %3 출력 %4',
                jikko_esp_lcd_clear: 'LCD 화면 지우기 %1',
                jikko_esp_module_digital_oled: 'OLED 화면 %1 열 %2 행 부터 %3 출력 %4',
                jikko_esp_oled_clear: 'OLED 화면 지우기 %1',
                jikko_esp_oled_text_size: 'OLED 글씨 크기 %1 색상 %2로 설정 %3',
                jikko_esp_get_dht_temp_value: 'DHT11 온습도센서(out %1)의 온도(°C)값',
                jikko_esp_get_dht_humi_value: 'DHT11 온습도센서(out %1)의 습도(%)값',

                jikko_esp_set_mp3_init: 'mp3 초기화 ( tx: %1, rx: %2 ) %3',
                jikko_esp_set_mp3_play: 'mp3 %1 번 파일 재생 %2',
                jikko_esp_set_mp3_play2: 'mp3 %1 번 파일 %2 초 동안 재생 %3',
                jikko_esp_set_mp3_vol: 'mp3 볼륨 %1 으로 설정 (0 ~ 30) %2',
            },
        },
        en: {
            template: {
                jikko_esp_toggle_on: 'on',
                jikko_esp_toggle_off: 'off',
                jikko_esp_lcd_first_line: 'first',
                jikko_esp_lcd_seconds_line: 'seconds',
                jikko_esp_get_analog_value: 'Read analog %1 pin sensor value',
                jikko_esp_get_analog_mapping:
                    'Map analog %1 pin sensor value from %2 ~ %3 to %4 ~ %5',
                jikko_esp_mapping1: '%1 값을 %2 ~ %3 사이로 제한한 값',
                jikko_esp_mapping2: '%1 값을 %2 ~ %3 범위에서 %4 ~ %5 범위로 변환',
                jikko_esp_get_digital_bluetooth: 'Bluetooth RX 2 value',
                jikko_esp_get_digital_ultrasonic: 'Read ultrasonic Trig %1 Echo %2 sensor value',
                jikko_esp_get_digital: 'Digital %1 pin sensor value',
                jikko_esp_get_digital_toggle: 'Digital %1 pin sensor value',
                jikko_esp_set_digital_toggle: 'Digital %1 pin %2 %3',
                jikko_esp_toggle_led: '디지털 %1 핀 pwm %2 으로 켜기 %3',
                jikko_esp_set_digital_pwm: 'Digital pwm %1 Pin %2 %3',
                jikko_esp_set_digital_servo: '서보 모터 %1 핀 %2 각도로 회전 %3',
                jikko_esp_set_digital_buzzer_toggle: '피에조부저 %1 핀 %2 %3',
                jikko_esp_set_digital_buzzer_volume:
                    '피에조부저 (PWM %1 핀) 음량 %2 출력 (0 ~ 255) %3',
                jikko_esp_set_digital_buzzer:
                    '피에조부저 %1 번 핀의 버저를 %2 %3 음으로 %4 박자 연주 %5',
                jikko_esp_set_digital_dcmotor: 'DC Motor %1 pin direction %2 %3 pin speed %4 %5',
                jikko_esp_set_neopixel_init:
                    '네오픽셀 LED 시작하기 설정 ( %1 핀에 %2 개의 LED 연결) %3',
                jikko_esp_set_neopixel_bright:
                    '네오픽셀 LED ( %1 핀) 밝기 %2 으로 설정 (0 ~ 255) %3',
                jikko_esp_set_neopixel: '네오픽셀 LED ( %1 핀) %2 번째 LED 색 %3 출력 %4',
                jikko_esp_set_neopixel_all: '네오픽셀 LED ( %1 핀) 모든 LED 색 %2 출력 %3',
                jikko_esp_set_neopixel_clear: '네오픽셀 LED ( %1 핀) 모든 LED 끄기 %2',
                jikko_esp_module_digital_lcd: 'LCD %1 열 %2 행 부터 %3 출력',
                jikko_esp_lcd_init: 'I2C LCD 시작하기 설정 (주소 %1 ,열 %2, 행 %3) %4',

                jikko_esp_module_digital_bluetooth: 'Bluetooth TX 3 Pin %1 data send %2',
                jikko_esp_module_digital_oled: 'OLED X codinate %1 Y coodinate %2 appear %3 %4',
                jikko_esp_get_dht_temp_value: '온습도센서의 온도값',
                jikko_esp_get_dht_humi_value: '온습도센서의 습도값',

                jikko_esp_set_mp3_init: 'mp3 초기화 ( tx: %1, rx: %2 ) %3',
                jikko_esp_set_mp3_play: 'mp3 %1 번 파일 재생 %2',
                jikko_esp_set_mp3_play2: 'mp3 %1 번 파일 %2 초 동안 재생 %3',
                jikko_esp_set_mp3_vol: 'mp3 볼륨 %1 으로 설정 (0 ~ 30) %2',
            },
        },
    };
};
Entry.jikko_esp.blockMenuBlocks = [
    //'jikko_esp_set_digital_toggle',
    'jikko_esp_toggle_led',
    'jikko_esp_set_digital_servo',
    'jikko_esp_set_digital_pwm',
    // 'jikko_esp_set_digital_buzzer_toggle',
    // 'jikko_esp_set_digital_buzzer_volume',
    // 'jikko_esp_set_digital_buzzer',
    'jikko_esp_get_dht_temp_value',
    'jikko_esp_get_dht_humi_value',
    'jikko_esp_set_neopixel_init',
    'jikko_esp_set_neopixel_bright',
    'jikko_esp_set_neopixel',
    'jikko_esp_set_neopixel_all',
    'jikko_esp_set_neopixel_clear',
    'jikko_esp_lcd_init',
    'jikko_esp_module_digital_lcd',
    'jikko_esp_get_lcd_row',
    'jikko_esp_get_lcd_col',
    'jikko_esp_lcd_clear',
    'jikko_esp_module_digital_oled',
    'jikko_esp_oled_clear',
    'jikko_esp_oled_text_size',
    'jikko_esp_set_mp3_init',
    'jikko_esp_set_mp3_vol',
    'jikko_esp_set_mp3_play',
    'jikko_esp_set_mp3_play2',
];
Entry.jikko_esp.getBlocks = function() {
    var tx;
    var din;
    var dout;
    var sck;
    var num = 0;

    return {
        jikko_esp_toggle_led: {
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
            def: {
                params: [
                    {
                        type: 'jikko_esp_list_digital_basic',
                        params: ['26'],
                    },
                    {
                        type: 'jikko_esp_list_digital_toggle_en',
                    },
                    null,
                ],
                type: 'jikko_esp_toggle_led',
            },
            paramsKeyMap: {
                PORT: 0,
                VALUE: 1,
            },
            class: 'jikko_esp',
            isNotFor: ['jikko_esp'],
            func(sprite, script) {
                const port = script.getNumberValue('PORT');
                let value = script.getValue('VALUE');
                if (typeof value === 'string') {
                    value = value.toLowerCase();
                }
                if (Entry.jikko.highList.indexOf(value) > -1) {
                    value = 255;
                } else if (Entry.jikko.lowList.indexOf(value) > -1) {
                    value = 0;
                } else {
                    throw new Error();
                }

                if (!Entry.hw.sendQueue['SET']) {
                    Entry.hw.sendQueue['SET'] = {};
                }
                Entry.hw.sendQueue['SET'][port] = {
                    type: Entry.jikko_esp.sensorTypes.DIGITAL,
                    data: value,
                    time: new Date().getTime(),
                };
                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Arduino.digitalWrite(%1, %2)',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                        ],
                    },
                ],
            },
        },
        jikko_esp_list_analog_basic: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['0', '0'],
                        ['1', '1'],
                        ['2', '2'],
                        ['3', '3'],
                        ['4', '4'],
                        ['5', '5'],
                    ],
                    value: '0',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [null],
            },
            paramsKeyMap: {
                PORT: 0,
            },
            func: function(sprite, script) {
                return script.getField('PORT');
            },
        },
        jikko_esp_list_digital_basic: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['2', '2'],
                        ['4', '4'],
                        ['5', '5'],
                        ['12', '12'],
                        ['13', '13'],
                        ['14', '14'],
                        ['15', '15'],
                        ['16', '16'],
                        ['17', '17'],
                        ['18', '18'],
                        ['19', '19'],
                        ['23', '23'],
                        ['25', '25'],
                        ['26', '26'],
                        ['27', '27'],
                        ['32', '32'],
                        ['33', '33'],
                    ],
                    value: '10',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [null],
            },
            paramsKeyMap: {
                PORT: 0,
            },
            func: function(sprite, script) {
                return script.getStringField('PORT');
            },
        },
        jikko_esp_list_digital_octave: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['1', '1'],
                        ['2', '2'],
                        ['3', '3'],
                        ['4', '4'],
                        ['5', '5'],
                        ['6', '6'],
                        ['7', '7'],
                        ['8', '8'],
                    ],
                    value: '3',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [null],
            },
            paramsKeyMap: {
                OCTAVE: 0,
            },
            func: function(sprite, script) {
                return script.getField('OCTAVE');
            },
        },
        jikko_esp_list_digital_toggle: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.template.jikko_esp_toggle_on, 'on'],
                        [Lang.template.jikko_esp_toggle_off, 'off'],
                    ],
                    value: 'on',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [null],
            },
            paramsKeyMap: {
                OPERATOR: 0,
            },
            func: function(sprite, script) {
                return script.getStringField('OPERATOR');
            },
        },
        jikko_esp_list_digital_toggle_en: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['HIGH', 'on'],
                        ['LOW', 'off'],
                    ],
                    value: 'on',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [null],
            },
            paramsKeyMap: {
                OPERATOR: 0,
            },
            func: function(sprite, script) {
                return script.getStringField('OPERATOR');
            },
        },
        jikko_esp_list_digital_tone: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.silent, '0'],
                        [Lang.Blocks.do_name, 'C'],
                        [Lang.Blocks.do_sharp_name, 'CS'],
                        [Lang.Blocks.re_name, 'D'],
                        [Lang.Blocks.re_sharp_name, 'DS'],
                        [Lang.Blocks.mi_name, 'E'],
                        [Lang.Blocks.fa_name, 'F'],
                        [Lang.Blocks.fa_sharp_name, 'FS'],
                        [Lang.Blocks.sol_name, 'G'],
                        [Lang.Blocks.sol_sharp_name, 'GS'],
                        [Lang.Blocks.la_name, 'A'],
                        [Lang.Blocks.la_sharp_name, 'AS'],
                        [Lang.Blocks.si_name, 'B'],
                    ],
                    value: 'C',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [null],
            },
            paramsKeyMap: {
                NOTE: 0,
            },
            func: function(sprite, script) {
                return script.getField('NOTE');
            },
        },
        jikko_esp_set_neopixel_init: {
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
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'jikko_esp_list_digital_basic',
                        params: ['33'],
                    },
                    {
                        type: 'number',
                        params: ['4'],
                    },
                    null,
                ],
                type: 'jikko_esp_set_neopixel_init',
            },
            paramsKeyMap: {
                PORT: 0,
                NUM: 1,
            },
            class: 'neo',
            isNotFor: ['jikko_esp'],
            func: function(sprite, script) {
                var port = script.getNumberValue('PORT');
                var value = script.getNumberValue('NUM');
                if (!script.isStart) {
                    if (!Entry.hw.sendQueue['SET']) {
                        Entry.hw.sendQueue['SET'] = {};
                    }
                    script.isStart = true;
                    script.timeFlag = 1;
                    var fps = Entry.FPS || 60;
                    var timeValue = (60 / fps) * 50;

                    Entry.hw.sendQueue['SET'][port] = {
                        type: Entry.jikko_esp.sensorTypes.NEOPIXELINIT,
                        data: value,
                        time: new Date().getTime(),
                    };
                    setTimeout(function() {
                        script.timeFlag = 0;
                    }, timeValue);
                    return script;
                } else if (script.timeFlag == 1) {
                    return script;
                } else {
                    delete script.timeFlag;
                    delete script.isStart;
                    Entry.engine.isContinue = false;
                    return script.callReturn();
                }
            },
            syntax: {
                js: [],
                py: [{}],
            },
        },
        jikko_esp_set_neopixel_bright: {
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
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'jikko_esp_list_digital_basic',
                        params: ['33'],
                    },
                    {
                        type: 'number',
                        params: ['255'],
                    },
                    null,
                ],
                type: 'jikko_esp_set_neopixel_bright',
            },
            paramsKeyMap: {
                PORT: 0,
                NUM: 1,
            },
            class: 'neo',
            isNotFor: ['jikko_esp'],
            func: function(sprite, script) {
                var port = script.getNumberValue('PORT');
                var value = script.getNumberValue('NUM');

                value = Math.round(value);
                value = Math.min(value, 255);
                value = Math.max(value, 0);

                if (!script.isStart) {
                    if (!Entry.hw.sendQueue['SET']) {
                        Entry.hw.sendQueue['SET'] = {};
                    }
                    script.isStart = true;
                    script.timeFlag = 1;
                    var fps = Entry.FPS || 60;
                    var timeValue = (60 / fps) * 50;

                    Entry.hw.sendQueue['SET'][port] = {
                        type: Entry.jikko_esp.sensorTypes.NEOPIXELBRIGHT,
                        data: value,
                        time: new Date().getTime(),
                    };

                    setTimeout(function() {
                        script.timeFlag = 0;
                    }, timeValue);
                    return script;
                } else if (script.timeFlag == 1) {
                    return script;
                } else {
                    delete script.timeFlag;
                    delete script.isStart;
                    Entry.engine.isContinue = false;
                    return script.callReturn();
                }
            },
            syntax: {
                js: [],
                py: [{}],
            },
        },
        jikko_esp_set_neopixel: {
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
                    type: 'Color',
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'jikko_esp_list_digital_basic',
                        params: ['33'],
                    },
                    {
                        type: 'number',
                        params: ['0'],
                    },
                    null,
                    null,
                ],
                type: 'jikko_esp_set_neopixel',
            },
            paramsKeyMap: {
                PORT: 0,
                NUM: 1,
                COLOR: 2,
            },
            class: 'neo',
            isNotFor: ['jikko_esp'],
            func: function(sprite, script) {
                //var sq = Entry.hw.sendQueue;
                var port = script.getNumberValue('PORT', script);
                var num = script.getNumberValue('NUM', script);
                var value = script.getStringField('COLOR', script);

                let r = parseInt(value.substr(1, 2), 16);
                let g = parseInt(value.substr(3, 2), 16);
                let b = parseInt(value.substr(5, 2), 16);

                if (!script.isStart) {
                    script.isStart = true;
                    script.timeFlag = 1;
                    var fps = Entry.FPS || 60;
                    var timeValue = (60 / fps) * 50;

                    r = Math.round(r);
                    r = Math.min(r, 255);
                    r = Math.max(r, 0);

                    g = Math.round(g);
                    g = Math.min(g, 255);
                    g = Math.max(g, 0);

                    b = Math.round(b);
                    b = Math.min(b, 255);
                    b = Math.max(b, 0);

                    if (!Entry.hw.sendQueue['SET']) {
                        Entry.hw.sendQueue['SET'] = {};
                    }
                    Entry.hw.sendQueue['SET'][port] = {
                        type: Entry.jikko_esp.sensorTypes.NEOPIXEL,
                        data: {
                            num: num,
                            r: r,
                            g: g,
                            b: b,
                        },
                        time: new Date().getTime(),
                    };
                    setTimeout(function() {
                        script.timeFlag = 0;
                    }, 10);
                    return script;
                } else if (script.timeFlag == 1) {
                    return script;
                } else {
                    delete script.timeFlag;
                    delete script.isStart;
                    Entry.engine.isContinue = false;
                    return script.callReturn();
                }
            },
            syntax: {
                js: [],
                py: [{}],
            },
        },
        jikko_esp_set_neopixel_all: {
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
                    type: 'Color',
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'jikko_esp_list_digital_basic',
                        params: ['33'],
                    },
                    null,
                    null,
                ],
                type: 'jikko_esp_set_neopixel_all',
            },
            paramsKeyMap: {
                PORT: 0,
                COLOR: 1,
            },
            class: 'neo',
            isNotFor: ['jikko_esp'],
            func: function(sprite, script) {
                var port = script.getNumberValue('PORT', script);
                var value = script.getStringField('COLOR', script);

                let r = parseInt(value.substr(1, 2), 16);
                let g = parseInt(value.substr(3, 2), 16);
                let b = parseInt(value.substr(5, 2), 16);

                if (!script.isStart) {
                    script.isStart = true;
                    script.timeFlag = 1;
                    var fps = Entry.FPS || 60;
                    var timeValue = (60 / fps) * 50;
                    r = Math.round(r);
                    r = Math.min(r, 255);
                    r = Math.max(r, 0);

                    g = Math.round(g);
                    g = Math.min(g, 255);
                    g = Math.max(g, 0);

                    b = Math.round(b);
                    b = Math.min(b, 255);
                    b = Math.max(b, 0);

                    if (!Entry.hw.sendQueue['SET']) {
                        Entry.hw.sendQueue['SET'] = {};
                    }
                    Entry.hw.sendQueue['SET'][port] = {
                        type: Entry.jikko_esp.sensorTypes.NEOPIXELALL,
                        data: {
                            r: r,
                            g: g,
                            b: b,
                        },
                        time: new Date().getTime(),
                    };
                    setTimeout(function() {
                        script.timeFlag = 0;
                    }, 10);
                    return script;
                } else if (script.timeFlag == 1) {
                    return script;
                } else {
                    delete script.timeFlag;
                    delete script.isStart;
                    Entry.engine.isContinue = false;
                    return script.callReturn();
                }
            },
            syntax: {
                js: [],
                py: [{}],
            },
        },

        jikko_esp_set_neopixel_clear: {
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
            def: {
                params: [
                    {
                        type: 'jikko_esp_list_digital_basic',
                        params: ['33'],
                    },
                    null,
                ],
                type: 'jikko_esp_set_neopixel_clear',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'neo',
            isNotFor: ['jikko_esp'],
            func: function(sprite, script) {
                var port = script.getNumberValue('PORT');
                if (!script.isStart) {
                    if (!Entry.hw.sendQueue['SET']) {
                        Entry.hw.sendQueue['SET'] = {};
                    }
                    script.isStart = true;
                    script.timeFlag = 1;
                    var fps = Entry.FPS || 60;
                    var timeValue = (60 / fps) * 50;

                    Entry.hw.sendQueue['SET'][port] = {
                        type: Entry.jikko_esp.sensorTypes.NEOPIXELCLEAR,
                        time: new Date().getTime(),
                    };

                    setTimeout(function() {
                        script.timeFlag = 0;
                    }, timeValue);
                    return script;
                } else if (script.timeFlag == 1) {
                    return script;
                } else {
                    delete script.timeFlag;
                    delete script.isStart;
                    Entry.engine.isContinue = false;
                    return script.callReturn();
                }
            },
            syntax: {
                js: [],
                py: [{}],
            },
        },
        jikko_esp_lcd_list_init: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['0x27', '0'],
                        ['0x3F', '1'],
                    ],
                    value: '0',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [null],
            },
            paramsKeyMap: {
                LINE: 0,
            },
            func: function(sprite, script) {
                return script.getField('LINE');
            },
        },
        jikko_esp_list_digital_lcd: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.template.jikko_esp_lcd_first_line, '0'],
                        [Lang.template.jikko_esp_lcd_seconds_line, '1'],
                    ],
                    value: '0',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [null],
            },
            paramsKeyMap: {
                LINE: 0,
            },
            func: function(sprite, script) {
                return script.getField('LINE');
            },
        },
        jikko_esp_get_lcd_row: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['0', '0'],
                        ['1', '1'],
                    ],
                    value: '0',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [null],
            },
            paramsKeyMap: {
                ROW: 0,
            },
            func(sprite, script) {
                return script.getStringField('ROW');
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: '%1',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    ['0', '0'],
                                    ['1', '1'],
                                ],
                                value: '0',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                            },
                        ],
                        keyOption: 'jikko_esp_get_lcd_row',
                    },
                ],
            },
        },

        jikko_esp_get_lcd_col: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['0', '0'],
                        ['1', '1'],
                        ['2', '2'],
                        ['3', '3'],
                        ['4', '4'],
                        ['5', '5'],
                        ['6', '6'],
                        ['7', '7'],
                        ['8', '8'],
                        ['9', '9'],
                        ['10', '10'],
                        ['11', '11'],
                        ['12', '12'],
                        ['13', '13'],
                        ['14', '14'],
                        ['15', '15'],
                    ],
                    value: '0',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [null],
            },
            paramsKeyMap: {
                ROW: 0,
            },
            func(sprite, script) {
                return script.getStringField('ROW');
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: '%1',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    ['0', '0'],
                                    ['1', '1'],
                                    ['2', '2'],
                                    ['3', '3'],
                                    ['4', '4'],
                                    ['5', '5'],
                                    ['6', '6'],
                                    ['7', '7'],
                                    ['8', '8'],
                                    ['9', '9'],
                                    ['10', '10'],
                                    ['11', '11'],
                                    ['12', '12'],
                                    ['13', '13'],
                                    ['14', '14'],
                                    ['15', '15'],
                                ],
                                value: '0',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                            },
                        ],
                        keyOption: 'jikko_esp_get_lcd_col',
                    },
                ],
            },
        },
        jikko_esp_get_analog_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            template: Lang.template.jikko_esp_get_analog_value,
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'jikko_esp_list_analog_basic',
                    },
                ],
                type: 'jikko_esp_get_analog_value',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'jikko_espPin',
            isNotFor: ['jikko_esp'],
            func: function(sprite, script) {
                var port = script.getValue('PORT', script);
                var ANALOG = Entry.hw.portData.ANALOG;

                if (port[0] === 'A') port = port.substring(1);

                return ANALOG ? ANALOG[port] || 0 : 0;
            },
            syntax: { js: [], py: ['jikko_esp.get_analog_value(%1)'] },
        },
        jikko_esp_get_light_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'jikko_esp_list_analog_basic',
                    },
                ],
                type: 'jikko_esp_get_light_value',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'jikko_espGet',
            isNotFor: ['jikko_esp'],
            func: function(sprite, script) {
                var port = script.getValue('PORT', script);
                var ANALOG = Entry.hw.portData.ANALOG;

                if (port[0] === 'A') port = port.substring(1);

                return ANALOG ? ANALOG[port] || 0 : 0;
            },
            syntax: { js: [], py: ['jikko_esp.get_analog_value(%1)'] },
        },
        jikko_esp_get_moisture_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            //template: Lang.template.jikko_esp_get_analog_value,
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'jikko_esp_list_analog_basic',
                        params: ['1'],
                    },
                ],
                type: 'jikko_esp_get_moisture_value',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'jikko_espGet',
            isNotFor: ['jikko_esp'],
            func: function(sprite, script) {
                var port = script.getValue('PORT', script);
                var ANALOG = Entry.hw.portData.ANALOG;

                if (port[0] === 'A') port = port.substring(1);

                return ANALOG ? ANALOG[port] || 0 : 0;
            },
            syntax: { js: [], py: ['jikko_esp.get_analog_value(%1)'] },
        },
        jikko_esp_get_sound_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'jikko_esp_list_analog_basic',
                    },
                ],
                type: 'jikko_esp_get_sound_value',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'jikko_espGet',
            isNotFor: ['jikko_esp'],
            func: function(sprite, script) {
                var port = script.getValue('PORT', script);
                var ANALOG = Entry.hw.portData.ANALOG;

                if (port[0] === 'A') port = port.substring(1);

                return ANALOG ? ANALOG[port] || 0 : 0;
            },
            syntax: { js: [], py: ['jikko_esp.get_analog_value(%1)'] },
        },
        jikko_esp_get_infrared_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'jikko_esp_list_analog_basic',
                    },
                ],
                type: 'jikko_esp_get_infrared_value',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'jikko_espGet',
            isNotFor: ['jikko_esp'],
            func: function(sprite, script) {
                var port = script.getValue('PORT', script);
                var ANALOG = Entry.hw.portData.ANALOG;

                if (port[0] === 'A') port = port.substring(1);

                return ANALOG ? ANALOG[port] || 0 : 0;
            },
            syntax: { js: [], py: ['jikko_esp.get_analog_value(%1)'] },
        },
        jikko_esp_get_pullup: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'jikko_esp_list_digital_basic',
                    },
                ],
                type: 'jikko_esp_get_pullup',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'jikko_espGet',
            isNotFor: ['jikko_esp'],
            func: function(sprite, script) {
                var port = script.getNumberValue('PORT');
                var DIGITAL = Entry.hw.portData.DIGITAL;

                if (!Entry.hw.sendQueue['GET']) {
                    Entry.hw.sendQueue['GET'] = {};
                }

                Entry.hw.sendQueue['GET'][Entry.jikko_esp.sensorTypes.DIGITAL] = {
                    port: port,
                    data: 2,
                    time: new Date().getTime(),
                };

                var value = DIGITAL ? DIGITAL[port] || 0 : 0;
                return !value;
            },
            syntax: { js: [], py: [] },
        },
        jikko_esp_get_button: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'jikko_esp_list_digital_basic',
                    },
                ],
                type: 'jikko_esp_get_button',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'jikko_espGet',
            isNotFor: ['jikko_esp'],
            func: function(sprite, script) {
                var port = script.getNumberValue('PORT', script);
                var DIGITAL = Entry.hw.portData.DIGITAL;

                if (!Entry.hw.sendQueue['GET']) {
                    Entry.hw.sendQueue['GET'] = {};
                }

                Entry.hw.sendQueue['GET'][Entry.jikko_esp.sensorTypes.DIGITAL] = {
                    port: port,
                    data: 2,
                    time: new Date().getTime(),
                };

                var value = DIGITAL ? DIGITAL[port] || 0 : 0;
                return !value;
            },
            syntax: { js: [], py: [] },
        },
        jikko_esp_get_analog_mapping: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            template: Lang.template.jikko_esp_get_analog_mapping,
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                },
                {
                    type: 'Block',
                    accept: 'string',
                },
                {
                    type: 'Block',
                    accept: 'string',
                },
                {
                    type: 'Block',
                    accept: 'string',
                },
                {
                    type: 'Block',
                    accept: 'string',
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'jikko_esp_list_analog_basic',
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
                type: 'jikko_esp_get_analog_mapping',
            },
            paramsKeyMap: {
                PORT: 0,
                VALUE2: 1,
                VALUE3: 2,
                VALUE4: 3,
                VALUE5: 4,
            },
            class: 'jikko_espPin',
            isNotFor: ['jikko_esp'],
            func: function(sprite, script) {
                var port = script.getValue('PORT', script);
                var result = 0;
                var ANALOG = Entry.hw.portData.ANALOG;
                var value2 = script.getNumberValue('VALUE2', script);
                var value3 = script.getNumberValue('VALUE3', script);
                var value4 = script.getNumberValue('VALUE4', script);
                var value5 = script.getNumberValue('VALUE5', script);

                if (port[0] === 'A') {
                    port = port.substring(1);
                }
                result = ANALOG ? ANALOG[port] || 0 : 0;
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

                return result;
            },
            syntax: {
                js: [],
                py: ['jikko_esp.get_analog_mapping(%1, %2, %3, %4, %5)'],
            },
        },
        jikko_esp_mapping1: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                },
                {
                    type: 'Block',
                    accept: 'string',
                },
                {
                    type: 'Block',
                    accept: 'string',
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'number',
                        params: ['0'],
                    },
                    {
                        type: 'number',
                        params: ['0'],
                    },
                    {
                        type: 'number',
                        params: ['255'],
                    },
                ],
                type: 'jikko_esp_mapping1',
            },
            paramsKeyMap: {
                NUM: 0,
                VALUE2: 1,
                VALUE3: 2,
            },
            class: 'jikko_espPin',
            isNotFor: ['jikko_esp'],
            func: function(sprite, script) {
                var num = script.getNumberValue('NUM', script);

                var value2 = script.getNumberValue('VALUE2', script);
                var value3 = script.getNumberValue('VALUE3', script);

                if (value2 > value3) {
                    var swap = value2;
                    value2 = value3;
                    value3 = swap;
                }

                num = Math.min(value3, num);
                num = Math.max(value2, num);

                return parseInt(num);
            },
            syntax: {
                js: [],
                py: [],
            },
        },
        jikko_esp_mapping2: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                },
                {
                    type: 'Block',
                    accept: 'string',
                },
                {
                    type: 'Block',
                    accept: 'string',
                },
                {
                    type: 'Block',
                    accept: 'string',
                },
                {
                    type: 'Block',
                    accept: 'string',
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'number',
                        params: ['0'],
                    },
                    {
                        type: 'number',
                        params: ['0'],
                    },
                    {
                        type: 'number',
                        params: ['1024'],
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
                type: 'jikko_esp_mapping2',
            },
            paramsKeyMap: {
                NUM: 0,
                VALUE2: 1,
                VALUE3: 2,
                VALUE4: 3,
                VALUE5: 4,
            },
            class: 'jikko_espPin',
            isNotFor: ['jikko_esp'],
            func: function(sprite, script) {
                var num = script.getNumberValue('NUM', script);
                var flag = 0;

                var value2 = script.getNumberValue('VALUE2', script);
                var value3 = script.getNumberValue('VALUE3', script);
                var value4 = script.getNumberValue('VALUE4', script);
                var value5 = script.getNumberValue('VALUE5', script);

                var value4_1 = value4;
                var value5_1 = value5;

                if (value2 > value3) {
                    var swap = value2;
                    value2 = value3;
                    value3 = swap;
                }

                if (value4 > value5) {
                    flag = 1;
                    var swap = value4;
                    value4_1 = value5;
                    value5_1 = swap;
                }

                num -= value2;
                num = num * ((value5_1 - value4_1) / (value3 - value2));

                if (flag == 1) {
                    num = value4 - num;
                    num = Math.min(value4, num);
                    num = Math.max(value5, num);
                } else {
                    num = num + value4;
                    num = Math.min(value5, num);
                    num = Math.max(value4, num);
                }

                return parseInt(num);
            },
            syntax: {
                js: [],
                py: [],
            },
        },
        jikko_esp_get_digital_ultrasonic: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            template: Lang.template.jikko_esp_get_digital_ultrasonic,
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                },
                {
                    type: 'Block',
                    accept: 'string',
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'jikko_esp_list_digital_basic',
                        params: ['13'],
                    },
                    {
                        type: 'jikko_esp_list_digital_basic',
                        params: ['12'],
                    },
                ],
                type: 'jikko_esp_get_digital_ultrasonic',
            },
            paramsKeyMap: {
                PORT1: 0,
                PORT2: 1,
            },
            class: 'jikko_espGet',
            isNotFor: ['jikko_esp'],
            func: function(sprite, script) {
                var port1 = script.getNumberValue('PORT1');
                var port2 = script.getNumberValue('PORT2');

                if (!Entry.hw.sendQueue['SET']) {
                    Entry.hw.sendQueue['SET'] = {};
                }
                delete Entry.hw.sendQueue['SET'][port1];
                delete Entry.hw.sendQueue['SET'][port2];

                Entry.Utils.sleep(700);

                if (!Entry.hw.sendQueue['GET']) {
                    Entry.hw.sendQueue['GET'] = {};
                }
                Entry.hw.sendQueue['GET'][Entry.jikko_esp.sensorTypes.ULTRASONIC] = {
                    port: [port1, port2],
                    time: new Date().getTime(),
                };

                return Entry.hw.portData.ULTRASONIC[port2] || 0;
            },
            syntax: {
                js: [],
                py: ['jikko_esp.get_digital_ultrasonic(%1, %2)'],
            },
        },
        jikko_esp_get_digital: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            template: Lang.template.jikko_esp_get_digital,
            params: [
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
                        type: 'jikko_esp_list_digital_basic',
                    },
                ],
                type: 'jikko_esp_get_digital',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'jikko_espPin',
            isNotFor: ['jikko_esp'],
            func: function(sprite, script) {
                var port = script.getNumberValue('PORT');
                var DIGITAL = Entry.hw.portData.DIGITAL;

                if (!Entry.hw.sendQueue['GET']) {
                    Entry.hw.sendQueue['GET'] = {};
                }
                if (Entry.hw.sendQueue.SET[port]) {
                    return Entry.hw.sendQueue.SET[port].data;
                } else {
                    Entry.hw.sendQueue['GET'][Entry.jikko_esp.sensorTypes.DIGITAL] = {
                        port: port,
                        time: new Date().getTime(),
                    };
                }

                return DIGITAL ? DIGITAL[port] || 0 : 0;
            },
            syntax: { js: [], py: ['jikko_esp.get_digital(%1)'] },
        },
        jikko_esp_get_digital_toggle: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            template: Lang.template.jikko_esp_get_digital_toggle,
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'jikko_esp_list_digital_basic',
                    },
                ],
                type: 'jikko_esp_get_digital_toggle',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'jikko_espGet',
            isNotFor: ['jikko_esp'],
            func: function(sprite, script) {
                var port = script.getNumberValue('PORT');
                var DIGITAL = Entry.hw.portData.DIGITAL;

                if (!Entry.hw.sendQueue['GET']) {
                    Entry.hw.sendQueue['GET'] = {};
                }
                Entry.hw.sendQueue['GET'][Entry.jikko_esp.sensorTypes.DIGITAL] = {
                    port: port,
                    time: new Date().getTime(),
                };

                return DIGITAL ? DIGITAL[port] || 0 : 0;
            },
            syntax: { js: [], py: ['jikko_esp.get_digital_toggle(%1)'] },
        },
        jikko_esp_set_digital_toggle: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic',
            statements: [],
            template: Lang.template.jikko_esp_set_digital_toggle,
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                },
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
            def: {
                params: [
                    {
                        type: 'jikko_esp_list_digital_basic',
                    },
                    {
                        type: 'jikko_esp_list_digital_toggle_en',
                    },
                    null,
                ],
                type: 'jikko_esp_set_digital_toggle',
            },
            paramsKeyMap: {
                PORT: 0,
                VALUE: 1,
            },
            class: 'jikko_espPin',
            isNotFor: ['jikko_esp'],
            func: function(sprite, script) {
                var port = script.getNumberValue('PORT');
                var value = script.getValue('VALUE');

                if (typeof value === 'string') {
                    value = value.toLowerCase();
                }
                if (Entry.jikko_esp.highList.indexOf(value) > -1) {
                    value = 255;
                } else if (Entry.jikko_esp.lowList.indexOf(value) > -1) {
                    value = 0;
                } else {
                    throw new Error();
                }
                if (!Entry.hw.sendQueue['SET']) {
                    Entry.hw.sendQueue['SET'] = {};
                }
                Entry.hw.sendQueue['SET'][port] = {
                    type: Entry.jikko_esp.sensorTypes.DIGITAL,
                    data: value,
                    time: new Date().getTime(),
                };

                return script.callReturn();
            },
            syntax: { js: [], py: ['jikko_esp.set_digital_toggle(%1, %2)'] },
        },
        jikko_esp_set_led_toggle: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                },
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
            def: {
                params: [
                    {
                        type: 'jikko_esp_list_digital_basic',
                        params: ['5'],
                    },
                    {
                        type: 'jikko_esp_list_digital_toggle',
                    },
                    null,
                ],
                type: 'jikko_esp_set_led_toggle',
            },
            paramsKeyMap: {
                PORT: 0,
                VALUE: 1,
            },
            class: 'jikko_espLed',
            isNotFor: ['jikko_esp'],
            func: function(sprite, script) {
                var port = script.getNumberValue('PORT');
                var value = script.getValue('VALUE');

                if (typeof value === 'string') {
                    value = value.toLowerCase();
                }
                if (Entry.jikko_esp.highList.indexOf(value) > -1) {
                    value = 255;
                } else if (Entry.jikko_esp.lowList.indexOf(value) > -1) {
                    value = 0;
                } else {
                    throw new Error();
                }
                if (!Entry.hw.sendQueue['SET']) {
                    Entry.hw.sendQueue['SET'] = {};
                }
                Entry.hw.sendQueue['SET'][port] = {
                    type: Entry.jikko_esp.sensorTypes.DIGITAL,
                    data: value,
                    time: new Date().getTime(),
                };

                return script.callReturn();
            },
            syntax: { js: [], py: ['jikko_esp.set_digital_toggle(%1, %2)'] },
        },
        jikko_esp_set_digital_pwm: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic',
            statements: [],
            template: Lang.template.jikko_esp_set_digital_pwm,
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                },
                {
                    type: 'Block',
                    accept: 'string',
                },
                {
                    type: 'Block',
                    accept: 'string',
                },
                {
                    type: 'Block',
                    accept: 'string',
                },
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
            def: {
                params: [
                    {
                        type: 'jikko_esp_list_digital_basic',
                        params: ['5'],
                    },
                    {
                        type: 'text',
                        params: ['0'],
                    },
                    {
                        type: 'text',
                        params: ['5000'],
                    },
                    {
                        type: 'text',
                        params: ['8'],
                    },
                    {
                        type: 'text',
                        params: ['255'],
                    },

                    null,
                ],
                type: 'jikko_esp_set_digital_pwm',
            },
            paramsKeyMap: {
                PORT: 0,
                CHANNEL: 1,
                FREQ: 2,
                RESOL: 3,
                DUTY: 4,
            },
            class: 'jikko_espLed',
            isNotFor: ['jikko_esp'],
            func: function(sprite, script) {
                var port = script.getNumberValue('PORT');
                var channel = script.getNumberValue('CHANNEL');
                var freq = script.getNumberValue('FREQ');
                var resol = script.getNumberValue('RESOL');
                var duty = script.getNumberValue('DUTY');

                duty = Math.round(duty);
                duty = Math.min(duty, 255);
                duty = Math.max(duty, 0);
                if (!Entry.hw.sendQueue['SET']) {
                    Entry.hw.sendQueue['SET'] = {};
                }
                Entry.hw.sendQueue['SET'][port] = {
                    type: Entry.jikko_esp.sensorTypes.PWM,
                    data: {
                        channel: channel,
                        freq: freq,
                        resol: resol,
                        duty: duty,
                    },
                    time: new Date().getTime(),
                };
                return script.callReturn();
            },
            syntax: { js: [], py: ['jikko_esp.set_digital_pwm(%1, %2)'] },
        },
        jikko_esp_set_digital_servo: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic',
            statements: [],
            template: Lang.template.jikko_esp_set_digital_servo,
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                },
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
            def: {
                params: [
                    {
                        type: 'jikko_esp_list_digital_basic',
                        params: ['8'],
                    },
                    {
                        type: 'text',
                        params: ['90'],
                    },
                    null,
                ],
                type: 'jikko_esp_set_digital_servo',
            },
            paramsKeyMap: {
                PORT: 0,
                VALUE: 1,
            },
            class: 'jikko_espSet',
            isNotFor: ['jikko_esp'],
            func: function(sprite, script) {
                var port = script.getNumberValue('PORT');
                var value = script.getNumberValue('VALUE');
                value = Math.min(value, 180);
                value = Math.max(value, 0);

                if (!Entry.hw.sendQueue['SET']) {
                    Entry.hw.sendQueue['SET'] = {};
                }
                console.log('SERVO');
                Entry.hw.sendQueue['SET'][port] = {
                    type: Entry.jikko_esp.sensorTypes.SERVO,
                    data: value,
                    time: new Date().getTime(),
                };

                return script.callReturn();
            },
            syntax: { js: [], py: ['jikko_esp.set_digital_servo(%1, %2)'] },
        },
        jikko_esp_set_digital_buzzer_toggle: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                },
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
            def: {
                params: [
                    {
                        type: 'jikko_esp_list_digital_basic',
                        params: ['6'],
                    },
                    {
                        type: 'jikko_esp_list_digital_toggle',
                    },

                    null,
                ],
                type: 'jikko_esp_set_digital_buzzer_toggle',
            },
            paramsKeyMap: {
                PORT: 0,
                VALUE: 1,
            },
            class: 'jikko_espBuzzer',
            isNotFor: ['jikko_esp'],
            func: function(sprite, script) {
                var port = script.getNumberValue('PORT');
                var value = script.getValue('VALUE');

                if (typeof value === 'string') {
                    value = value.toLowerCase();
                }
                if (Entry.jikko_esp.highList.indexOf(value) > -1) {
                    value = 255;
                } else if (Entry.jikko_esp.lowList.indexOf(value) > -1) {
                    value = 0;
                } else {
                    throw new Error();
                }
                if (!Entry.hw.sendQueue['SET']) {
                    Entry.hw.sendQueue['SET'] = {};
                }
                Entry.hw.sendQueue['SET'][port] = {
                    type: Entry.jikko_esp.sensorTypes.DIGITAL,
                    data: value,
                    time: new Date().getTime(),
                };

                return script.callReturn();
            },
            syntax: {
                js: [],
                py: ['jikko_esp.set_digital_toggle(%1, %2, %3, %4)'],
            },
        },
        jikko_esp_set_digital_buzzer_volume: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                },
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
            def: {
                params: [
                    {
                        type: 'jikko_esp_list_digital_pwm',
                        params: ['6'],
                    },
                    {
                        type: 'text',
                        params: ['255'],
                    },
                    null,
                ],
                type: 'jikko_esp_set_digital_buzzer_volume',
            },
            paramsKeyMap: {
                PORT: 0,
                VALUE: 1,
            },
            class: 'jikko_espBuzzer',
            isNotFor: ['jikko_esp'],
            func: function(sprite, script) {
                var port = script.getNumberValue('PORT');
                var value = script.getNumberValue('VALUE');

                value = Math.round(value);
                value = Math.min(value, 255);
                value = Math.max(value, 0);
                if (!Entry.hw.sendQueue['SET']) {
                    Entry.hw.sendQueue['SET'] = {};
                }
                Entry.hw.sendQueue['SET'][port] = {
                    type: Entry.jikko_esp.sensorTypes.PWM,
                    data: value,
                    time: new Date().getTime(),
                };

                return script.callReturn();
            },
            syntax: {
                js: [],
                py: ['jikko_esp.set_digital_toggle(%1, %2, %3, %4)'],
            },
        },
        jikko_esp_set_digital_buzzer: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic',
            statements: [],
            template: Lang.template.jikko_esp_set_digital_buzzer,
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                },
                {
                    type: 'Block',
                    accept: 'string',
                },
                {
                    type: 'Block',
                    accept: 'string',
                },
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
            def: {
                params: [
                    {
                        type: 'jikko_esp_list_digital_basic',
                        params: ['6'],
                    },
                    {
                        type: 'jikko_esp_list_digital_tone',
                    },
                    {
                        type: 'jikko_esp_list_digital_octave',
                    },
                    {
                        type: 'text',
                        params: ['1'],
                    },
                    null,
                ],
                type: 'jikko_esp_set_digital_buzzer',
            },
            paramsKeyMap: {
                PORT: 0,
                NOTE: 1,
                OCTAVE: 2,
                DURATION: 3,
            },
            class: 'jikko_espBuzzer',
            isNotFor: ['jikko_esp'],
            func: function(sprite, script) {
                var port = script.getNumberValue('PORT');
                var duration = script.getNumberValue('DURATION');
                var octave = script.getNumberValue('OCTAVE') - 1;
                var value = 0;

                if (!script.isStart) {
                    var note = script.getValue('NOTE');
                    if (!Entry.Utils.isNumber(note)) {
                        note = Entry.jikko_esp.toneTable[note];
                    }
                    if (note < 0) {
                        note = 0;
                    } else if (note > 12) {
                        note = 12;
                    }
                    if (duration < 0) {
                        duration = 0;
                    }
                    if (!Entry.hw.sendQueue['SET']) {
                        Entry.hw.sendQueue['SET'] = {};
                    }
                    if (duration === 0) {
                        Entry.hw.sendQueue['SET'][port] = {
                            type: Entry.jikko_esp.sensorTypes.TONE,
                            data: 0,
                            time: new Date().getTime(),
                        };
                        return script.callReturn();
                    }
                    if (octave < 0) {
                        octave = 0;
                    } else if (octave > 8) {
                        octave = 8;
                    }
                    if (note != 0) {
                        value = Entry.jikko_esp.toneMap[note][octave];
                    }

                    duration = duration * 1000;
                    script.isStart = true;
                    script.timeFlag = 1;
                    Entry.hw.sendQueue['SET'][port] = {
                        type: Entry.jikko_esp.sensorTypes.TONE,
                        data: {
                            value: value,
                            duration: duration,
                        },
                        time: new Date().getTime(),
                    };

                    setTimeout(function() {
                        script.timeFlag = 0;
                    }, duration + 32);
                    return script;
                } else if (script.timeFlag == 1) {
                    return script;
                } else {
                    delete script.timeFlag;
                    delete script.isStart;
                    Entry.hw.sendQueue['SET'][port] = {
                        type: Entry.jikko_esp.sensorTypes.TONE,
                        data: 0,
                        time: new Date().getTime(),
                    };
                    Entry.engine.isContinue = false;
                    return script.callReturn();
                }
            },
            syntax: {
                js: [],
                py: ['jikko_esp.set_digital_toggle(%1, %2, %3, %4)'],
            },
        },
        jikko_esp_lcd_init: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                },
                {
                    type: 'Block',
                    accept: 'string',
                },
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
            def: {
                params: [
                    {
                        type: 'jikko_esp_lcd_list_init',
                        params: ['0'],
                    },
                    {
                        type: 'text',
                        params: ['16'],
                    },
                    {
                        type: 'text',
                        params: ['2'],
                    },
                    null,
                ],
                type: 'jikko_esp_lcd_init',
            },
            paramsKeyMap: {
                LIST: 0,
                COL: 1,
                LINE: 2,
            },
            class: 'jikko_espModule',
            isNotFor: ['jikko_esp'],
            func: function(sprite, script) {
                var list = script.getNumberValue('LIST');
                var col = script.getNumberValue('COL');
                var line = script.getValue('LINE');

                if (!script.isStart) {
                    if (!Entry.hw.sendQueue['SET']) {
                        Entry.hw.sendQueue['SET'] = {};
                    }

                    script.isStart = true;
                    script.timeFlag = 1;
                    var fps = Entry.FPS || 60;
                    var timeValue = (60 / fps) * 0.1 * 1000;

                    Entry.hw.sendQueue['SET'][1] = {
                        type: Entry.jikko_esp.sensorTypes.LCDINIT,
                        data: {
                            list: list,
                            col: col,
                            line: line,
                        },
                        time: new Date().getTime(),
                    };

                    setTimeout(function() {
                        script.timeFlag = 0;
                    }, timeValue);
                    return script;
                } else if (script.timeFlag == 1) {
                    return script;
                } else {
                    delete script.timeFlag;
                    delete script.isStart;
                    Entry.engine.isContinue = false;
                    return script.callReturn();
                }
            },
            syntax: { js: [], py: ['jikko_esp.module_digital_lcd(%1, %2)'] },
        },
        jikko_esp_module_digital_lcd: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
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
            def: {
                params: [
                    {
                        type: 'jikko_esp_get_lcd_col',
                        params: ['0'],
                    },
                    {
                        type: 'jikko_esp_get_lcd_row',
                        params: ['0'],
                    },
                    {
                        type: 'text',
                        params: ['Hello, Jikko'],
                    },
                    null,
                ],
                type: 'jikko_esp_module_digital_lcd',
            },
            paramsKeyMap: {
                COL: 0,
                ROW: 1,
                STRING: 2,
            },
            class: 'jikko_espModule',
            isNotFor: ['jikko_esp'],
            func: function(sprite, script) {
                var row = script.getNumberValue('ROW');
                var col = script.getNumberValue('COL');
                var text = script.getValue('STRING');

                if (!script.isStart) {
                    if (!Entry.hw.sendQueue['SET']) {
                        Entry.hw.sendQueue['SET'] = {};
                    }

                    script.isStart = true;
                    script.timeFlag = 1;
                    var fps = Entry.FPS || 60;
                    var timeValue = (60 / fps) * 100;

                    Entry.hw.sendQueue['SET'][1] = {
                        type: Entry.jikko_esp.sensorTypes.LCD,
                        data: {
                            line: row,
                            column: col,
                            text: text,
                        },
                        time: new Date().getTime(),
                    };

                    setTimeout(function() {
                        script.timeFlag = 0;
                    }, timeValue);
                    return script;
                } else if (script.timeFlag == 1) {
                    return script;
                } else {
                    delete script.timeFlag;
                    delete script.isStart;
                    Entry.engine.isContinue = false;
                    return script.callReturn();
                }
            },
            syntax: { js: [], py: ['jikko_esp.module_digital_lcd(%1, %2)'] },
        },
        jikko_esp_lcd_clear: {
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
            def: {
                params: [],
                type: 'jikko_esp_lcd_clear',
            },
            class: 'jikko_espModule',
            isNotFor: ['jikko_esp'],
            func(sprite, script) {
                if (!script.isStart) {
                    if (!Entry.hw.sendQueue['SET']) {
                        Entry.hw.sendQueue['SET'] = {};
                    }

                    script.isStart = true;
                    script.timeFlag = 1;
                    var fps = Entry.FPS || 60;
                    var timeValue = (60 / fps) * 50;

                    Entry.hw.sendQueue['SET'][1] = {
                        type: Entry.jikko_esp.sensorTypes.LCDCLEAR,
                        data: 0,
                        time: new Date().getTime(),
                    };

                    setTimeout(function() {
                        script.timeFlag = 0;
                    }, timeValue);
                    return script;
                } else if (script.timeFlag == 1) {
                    return script;
                } else {
                    delete script.timeFlag;
                    delete script.isStart;
                    Entry.engine.isContinue = false;
                    return script.callReturn();
                }
            },
            syntax: {
                js: [],
                py: [{}],
            },
        },

        jikko_esp_get_dht_temp_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'jikko_esp_list_digital_basic',
                        params: ['4'],
                    },
                ],
                type: 'jikko_esp_get_dht_temp_value',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'jikko_espGet',
            isNotFor: ['jikko_esp'],
            func: function(sprite, script) {
                var port = script.getNumberValue('PORT');

                if (!Entry.hw.sendQueue['SET']) {
                    Entry.hw.sendQueue['SET'] = {};
                }
                delete Entry.hw.sendQueue['SET'][port];

                if (!Entry.hw.sendQueue['GET']) {
                    Entry.hw.sendQueue['GET'] = {};
                }

                Entry.hw.sendQueue['GET'][Entry.jikko_esp.sensorTypes.DHTTEMP] = {
                    port: port,
                    time: new Date().getTime(),
                };
                return Entry.hw.portData.DHTTEMP || 0;
            },
            syntax: {
                js: [],
                py: [{}],
            },
        },

        jikko_esp_get_dht_humi_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'jikko_esp_list_digital_basic',
                        params: ['4'],
                    },
                ],
                type: 'jikko_esp_get_dht_humi_value',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'jikko_espGet',
            isNotFor: ['jikko_esp'],
            func: function(sprite, script) {
                var port = script.getNumberValue('PORT');

                if (!Entry.hw.sendQueue['SET']) {
                    Entry.hw.sendQueue['SET'] = {};
                }
                delete Entry.hw.sendQueue['SET'][port];

                if (!Entry.hw.sendQueue['GET']) {
                    Entry.hw.sendQueue['GET'] = {};
                }

                Entry.hw.sendQueue['GET'][Entry.jikko_esp.sensorTypes.DHTHUMI] = {
                    port: port,
                    time: new Date().getTime(),
                };
                return Entry.hw.portData.DHTHUMI || 0;
            },
            syntax: {
                js: [],
                py: [{}],
            },
        },

        jikko_esp_set_mp3_init: {
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
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'jikko_esp_list_digital_basic',
                        params: ['16'],
                    },
                    {
                        type: 'jikko_esp_list_digital_basic',
                        params: ['17'],
                    },
                    null,
                ],
                type: 'jikko_esp_set_mp3_init',
            },
            paramsKeyMap: {
                PORT1: 0,
                PORT2: 1,
            },
            class: 'mp3',
            isNotFor: ['jikko_esp'],
            func: function(sprite, script) {
                tx = script.getNumberValue('PORT1');
                var rx = script.getNumberValue('PORT2');

                if (!script.isStart) {
                    if (!Entry.hw.sendQueue['SET']) {
                        Entry.hw.sendQueue['SET'] = {};
                    }
                    script.isStart = true;
                    script.timeFlag = 1;
                    var fps = Entry.FPS || 60;
                    var timeValue = (60 / fps) * 50;

                    Entry.hw.sendQueue['SET'][tx] = {
                        type: Entry.jikko_esp.sensorTypes.MP3INIT,
                        data: {
                            tx: tx,
                            rx: rx,
                        },
                        time: new Date().getTime(),
                    };

                    setTimeout(function() {
                        script.timeFlag = 0;
                    }, timeValue);
                    return script;
                } else if (script.timeFlag == 1) {
                    return script;
                } else {
                    delete script.timeFlag;
                    delete script.isStart;
                    Entry.engine.isContinue = false;
                    return script.callReturn();
                }
            },
            syntax: {
                js: [],
                py: [{}],
            },
        },

        jikko_esp_set_mp3_play: {
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
            def: {
                params: [
                    {
                        type: 'number',
                        params: ['1'],
                    },
                    null,
                ],
                type: 'jikko_esp_set_mp3_play',
            },
            paramsKeyMap: {
                NUM: 0,
            },
            class: 'mp3',
            isNotFor: ['jikko_esp'],
            func: function(sprite, script) {
                var num = script.getNumberValue('NUM');

                if (!Entry.hw.sendQueue['SET']) {
                    Entry.hw.sendQueue['SET'] = {};
                }
                script.isStart = true;
                script.timeFlag = 1;
                var fps = Entry.FPS || 60;
                var timeValue = (60 / fps) * 50;

                Entry.hw.sendQueue['SET'][tx] = {
                    type: Entry.jikko_esp.sensorTypes.MP3PLAY1,
                    data: {
                        tx: tx,
                        num: num,
                    },
                    time: new Date().getTime(),
                };

                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [{}],
            },
        },

        jikko_esp_set_mp3_play2: {
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
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'number',
                        params: ['1'],
                    },
                    {
                        type: 'number',
                        params: ['3'],
                    },
                    null,
                ],
                type: 'jikko_esp_set_mp3_play2',
            },
            paramsKeyMap: {
                NUM: 0,
                TIME: 1,
            },
            class: 'mp3',
            isNotFor: ['jikko_esp'],
            func: function(sprite, script) {
                var num = script.getNumberValue('NUM');
                var time_value = script.getNumberValue('TIME');

                if (!script.isStart) {
                    if (!Entry.hw.sendQueue['SET']) {
                        Entry.hw.sendQueue['SET'] = {};
                    }
                    script.isStart = true;
                    script.timeFlag = 1;
                    var fps = Entry.FPS || 60;
                    time_value = (60 / fps) * time_value * 1000;

                    Entry.hw.sendQueue['SET'][tx] = {
                        type: Entry.jikko_esp.sensorTypes.MP3PLAY1,
                        data: {
                            tx: tx,
                            num: num,
                            //time_value: time_value,
                        },
                        time: new Date().getTime(),
                    };

                    setTimeout(function() {
                        script.timeFlag = 0;
                    }, time_value);
                    return script;
                } else if (script.timeFlag == 1) {
                    return script;
                } else {
                    delete script.timeFlag;
                    delete script.isStart;

                    Entry.hw.sendQueue['SET'][tx] = {
                        type: Entry.jikko_esp.sensorTypes.MP3PLAY1,
                        data: 0,
                        time: new Date().getTime(),
                    };
                    Entry.engine.isContinue = false;

                    return script.callReturn();
                }
            },
            syntax: {
                js: [],
                py: [{}],
            },
        },

        jikko_esp_set_mp3_vol: {
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
            def: {
                params: [
                    {
                        type: 'number',
                        params: ['15'],
                    },
                    null,
                ],
                type: 'jikko_esp_set_mp3_vol',
            },
            paramsKeyMap: {
                VOL: 0,
            },
            class: 'mp3',
            isNotFor: ['jikko_esp'],
            func: function(sprite, script) {
                var vol = script.getNumberValue('VOL');

                vol = Math.round(vol);
                vol = Math.min(vol, 30);
                vol = Math.max(vol, 0);

                if (!script.isStart) {
                    if (!Entry.hw.sendQueue['SET']) {
                        Entry.hw.sendQueue['SET'] = {};
                    }
                    script.isStart = true;
                    script.timeFlag = 1;
                    var fps = Entry.FPS || 60;
                    var timeValue = (60 / fps) * 50;

                    Entry.hw.sendQueue['SET'][tx] = {
                        type: Entry.jikko_esp.sensorTypes.MP3VOL,
                        data: {
                            tx: tx,
                            vol: vol,
                        },
                        time: new Date().getTime(),
                    };

                    setTimeout(function() {
                        script.timeFlag = 0;
                    }, timeValue);
                    return script;
                } else if (script.timeFlag == 1) {
                    return script;
                } else {
                    delete script.timeFlag;
                    delete script.isStart;
                    Entry.engine.isContinue = false;
                    return script.callReturn();
                }
            },
            syntax: {
                js: [],
                py: [{}],
            },
        },
        jikko_esp_module_digital_oled: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
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
                    {
                        type: 'text',
                        params: ['Hello, Jikko'],
                    },
                    null,
                ],
                type: 'jikko_esp_module_digital_oled',
            },
            paramsKeyMap: {
                COL: 0,
                ROW: 1,
                STRING: 2,
            },
            class: 'jikkoModule',
            isNotFor: ['jikko_esp'],
            func: function(sprite, script) {
                var row = script.getNumberValue('ROW');
                var col = script.getNumberValue('COL');
                var text = script.getValue('STRING');

                if (!script.isStart) {
                    if (!Entry.hw.sendQueue['SET']) {
                        Entry.hw.sendQueue['SET'] = {};
                    }

                    script.isStart = true;
                    script.timeFlag = 1;
                    var fps = Entry.FPS || 60;
                    var timeValue = (60 / fps) * 100;

                    Entry.hw.sendQueue['SET'][1] = {
                        type: Entry.jikko_esp.sensorTypes.OLEDTEXT,
                        data: {
                            cmd: 0,
                            line: row,
                            column: col,
                            text: text,
                        },
                        time: new Date().getTime(),
                    };

                    setTimeout(function() {
                        script.timeFlag = 0;
                    }, timeValue);
                    return script;
                } else if (script.timeFlag == 1) {
                    return script;
                } else {
                    delete script.timeFlag;
                    delete script.isStart;
                    Entry.engine.isContinue = false;
                    return script.callReturn();
                }
            },
            syntax: { js: [], py: ['jikko.module_digital_lcd(%1, %2)'] },
        },
        jikko_esp_oled_clear: {
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
            def: {
                params: [],
                type: 'jikko_esp_oled_clear',
            },
            class: 'jikkoModule',
            isNotFor: ['jikko_esp'],
            func(sprite, script) {
                if (!script.isStart) {
                    if (!Entry.hw.sendQueue['SET']) {
                        Entry.hw.sendQueue['SET'] = {};
                    }

                    script.isStart = true;
                    script.timeFlag = 1;
                    var fps = Entry.FPS || 60;
                    var timeValue = (60 / fps) * 50;

                    Entry.hw.sendQueue['SET'][1] = {
                        type: Entry.jikko_esp.sensorTypes.OLEDTEXT,
                        data: {
                            cmd: 1,
                        },
                        time: new Date().getTime(),
                    };

                    setTimeout(function() {
                        script.timeFlag = 0;
                    }, timeValue);
                    return script;
                } else if (script.timeFlag == 1) {
                    return script;
                } else {
                    delete script.timeFlag;
                    delete script.isStart;
                    Entry.engine.isContinue = false;
                    return script.callReturn();
                }
            },
            syntax: {
                js: [],
                py: [{}],
            },
        },
        jikko_esp_oled_text_size: {
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
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'text',
                        params: ['1'],
                    },
                    {
                        type: 'text',
                        params: ['1'],
                    },
                    null,
                ],
                type: 'jikko_esp_oled_text_size',
            },
            paramsKeyMap: {
                SIZE: 0,
                COLOR: 1,
            },

            class: 'jikkoModule',
            isNotFor: ['jikko_esp'],
            func(sprite, script) {
                var size = script.getNumberValue('SIZE');
                var color = script.getNumberValue('COLOR');
                if (!script.isStart) {
                    if (!Entry.hw.sendQueue['SET']) {
                        Entry.hw.sendQueue['SET'] = {};
                    }

                    script.isStart = true;
                    script.timeFlag = 1;
                    var fps = Entry.FPS || 60;
                    var timeValue = (60 / fps) * 50;

                    Entry.hw.sendQueue['SET'][1] = {
                        type: Entry.jikko_esp.sensorTypes.OLEDTEXT,
                        data: {
                            cmd: 2,
                            size: size,
                            color: color,
                        },
                        time: new Date().getTime(),
                    };

                    setTimeout(function() {
                        script.timeFlag = 0;
                    }, timeValue);
                    return script;
                } else if (script.timeFlag == 1) {
                    return script;
                } else {
                    delete script.timeFlag;
                    delete script.isStart;
                    Entry.engine.isContinue = false;
                    return script.callReturn();
                }
            },
            syntax: {
                js: [],
                py: [{}],
            },
        },
        jikko_esp_module_digital_bluetooth: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic',
            template: Lang.template.jikko_esp_module_digital_bluetooth,
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
            def: {
                params: [
                    {
                        type: 'text',
                        params: ['My Entry!!'],
                    },
                    null,
                ],
                type: 'jikko_esp_module_digital_bluetooth',
            },
            paramsKeyMap: {
                STRING: 0,
            },
            class: 'jikko_espBlue',
            isNotFor: ['jikko_esp'],
            func: function(sprite, script) {
                var string = script.getValue('STRING');
                var port = 3;
                var text = [];

                if (!script.isStart) {
                    if (typeof string === 'string') {
                        for (var i = 0; i < string.length; i++) {
                            text[i] = string.charCodeAt(i);
                        }
                    } else {
                        text[0] = string;
                    }
                    if (!Entry.hw.sendQueue['SET']) {
                        Entry.hw.sendQueue['SET'] = {};
                    }

                    script.isStart = true;
                    script.timeFlag = 1;
                    var fps = Entry.FPS || 60;
                    var timeValue = (60 / fps) * 50;

                    Entry.hw.sendQueue['SET'][port] = {
                        type: Entry.jikko_esp.sensorTypes.WRITE_BLUETOOTH,
                        data: {
                            text0: text[0],
                            text1: text[1],
                            text2: text[2],
                            text3: text[3],
                            text4: text[4],
                            text5: text[5],
                            text6: text[6],
                            text7: text[7],
                            text8: text[8],
                            text9: text[9],
                            text10: text[10],
                            text11: text[11],
                            text12: text[12],
                            text13: text[13],
                            text14: text[14],
                            text15: text[15],
                        },
                        time: new Date().getTime(),
                    };

                    setTimeout(function() {
                        script.timeFlag = 0;
                    }, timeValue);
                    return script;
                } else if (script.timeFlag == 1) {
                    return script;
                } else {
                    delete script.timeFlag;
                    delete script.isStart;
                    Entry.engine.isContinue = false;
                    return script.callReturn();
                }
            },
            syntax: { js: [], py: ['jikko_esp.module_digital_bluetooth(%1)'] },
        },
    };
};

module.exports = Entry.jikko_esp;
