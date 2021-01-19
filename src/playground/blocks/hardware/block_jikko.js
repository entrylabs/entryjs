'use strict';

const PromiseManager = require('../../../core/promiseManager');

Entry.jikko = {
    id: 'FF.FF',
    name: 'jikko',
    url: 'http://www.makeitall.co.kr',
    imageName: 'jikko.png',
    title: {
        ko: '직코',
        en: 'jikko',
    },
    Static: {
        BUTTON_PRESS_VALUE: 0,
    },
    setZero: function() {
        if (!Entry.hw.sendQueue.SET) {
            Entry.hw.sendQueue = {
                GET: {},
                SET: {},
            };
        } else {
            var keySet = Object.keys(Entry.hw.sendQueue.SET);
            keySet.forEach((key) => {
                if (Entry.hw.sendQueue.SET[key].type == Entry.jikko.sensorTypes.NEOPIXEL) {
                    Entry.hw.sendQueue.SET[key].data.num = 4;
                    Entry.hw.sendQueue.SET[key].time = new Date().getTime();
                } else if (Entry.hw.sendQueue.SET[key].type == Entry.jikko.sensorTypes.LCD) {
                    // Entry.hw.sendQueue['SET'][1] = {
                    //     data: { line: 3 },
                    //     time: new Date().getTime(),
                    Entry.hw.sendQueue.SET[key].data.line = 3;
                    Entry.hw.sendQueue.SET[key].time = new Date().getTime();
                    //};
                } else {
                    //Entry.hw.sendQueue.RESET[key].data = 0;
                    //Entry.hw.sendQueue.RESET[key].time = new Date().getTime();

                    Entry.hw.sendQueue.SET[key].data = 0;
                    Entry.hw.sendQueue.SET[key].time = new Date().getTime();
                }
            });
            //     keySet.forEach(function(key) {
            //        else {
            //             Entry.hw.sendQueue.SET[key].data = 0;
            //             Entry.hw.sendQueue.SET[key].time = new Date().getTime();
            //         }
            //     });
        }
        //Entry.hw.sendQueue.GET = {};
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
        DOTMATRIXINIT: 25,
        DOTMATRIXBRIGHT: 26,
        DOTMATRIX: 27,
        DOTMATRIXCLEAR: 28,
        MP3INIT: 29,
        MP3PLAY1: 30,
        MP3PLAY2: 31,
        MP3VOL: 32,
        RESET_: 33,
        PULUP: 34,
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
    toByte: function(data) {
        switch (data) {
            case ' ':
                data = 32;
                break;
            case '!':
                data = 33;
                break;
            case '"':
                data = 34;
                break;
            case '#':
                data = 35;
                break;
            case '$':
                data = 36;
                break;
            case '%':
                data = 37;
                break;
            case '&':
                data = 38;
                break;
            case "'":
                data = 39;
                break;
            case '(':
                data = 40;
                break;
            case ')':
                data = 41;
                break;
            case '*':
                data = 42;
                break;
            case '+':
                data = 43;
                break;
            case ',':
                data = 44;
                break;
            case '-':
                data = 45;
                break;
            case '.':
                data = 46;
                break;
            case '/':
                data = 47;
                break;
            case '0':
                data = 48;
                break;
            case '1':
                data = 49;
                break;
            case '2':
                data = 50;
                break;
            case '3':
                data = 51;
                break;
            case '4':
                data = 52;
                break;
            case '5':
                data = 53;
                break;
            case '6':
                data = 54;
                break;
            case '7':
                data = 55;
                break;
            case '8':
                data = 56;
                break;
            case '9':
                data = 57;
                break;
            case ':':
                data = 58;
                break;
            case ';':
                data = 59;
                break;
            case '<':
                data = 60;
                break;
            case '=':
                data = 61;
                break;
            case '>':
                data = 62;
                break;
            case '?':
                data = 63;
                break;
            case '@':
                data = 64;
                break;
            case 'A':
                data = 65;
                break;
            case 'B':
                data = 66;
                break;
            case 'C':
                data = 67;
                break;
            case 'D':
                data = 68;
                break;
            case 'E':
                data = 69;
                break;
            case 'F':
                data = 70;
                break;
            case 'G':
                data = 71;
                break;
            case 'H':
                data = 72;
                break;
            case 'I':
                data = 73;
                break;
            case 'J':
                data = 74;
                break;
            case 'K':
                data = 75;
                break;
            case 'L':
                data = 76;
                break;
            case 'M':
                data = 77;
                break;
            case 'N':
                data = 78;
                break;
            case 'O':
                data = 79;
                break;
            case 'P':
                data = 80;
                break;
            case 'Q':
                data = 81;
                break;
            case 'R':
                data = 82;
                break;
            case 'S':
                data = 83;
                break;
            case 'T':
                data = 84;
                break;
            case 'U':
                data = 85;
                break;
            case 'V':
                data = 86;
                break;
            case 'W':
                data = 87;
                break;
            case 'X':
                data = 88;
                break;
            case 'Y':
                data = 89;
                break;
            case 'Z':
                data = 90;
                break;
            case '[':
                data = 91;
                break;
            case '\\':
                data = 92;
                break;
            case ']':
                data = 93;
                break;
            case '^':
                data = 94;
                break;
            case '_':
                data = 95;
                break;
            case '`':
                data = 96;
                break;
            case 'a':
                data = 97;
                break;
            case 'b':
                data = 98;
                break;
            case 'c':
                data = 99;
                break;
            case 'd':
                data = 100;
                break;
            case 'e':
                data = 101;
                break;
            case 'f':
                data = 102;
                break;
            case 'g':
                data = 103;
                break;
            case 'h':
                data = 104;
                break;
            case 'i':
                data = 105;
                break;
            case 'j':
                data = 106;
                break;
            case 'k':
                data = 107;
                break;
            case 'l':
                data = 108;
                break;
            case 'm':
                data = 109;
                break;
            case 'n':
                data = 110;
                break;
            case 'o':
                data = 111;
                break;
            case 'p':
                data = 112;
                break;
            case 'q':
                data = 113;
                break;
            case 'r':
                data = 114;
                break;
            case 's':
                data = 115;
                break;
            case 't':
                data = 116;
                break;
            case 'u':
                data = 117;
                break;
            case 'v':
                data = 118;
                break;
            case 'w':
                data = 119;
                break;
            case 'x':
                data = 120;
                break;
            case 'y':
                data = 121;
                break;
            case 'z':
                data = 122;
                break;
            case '{':
                data = 123;
                break;
            case '|':
                data = 124;
                break;
            case '}':
                data = 125;
                break;
            case '~':
                data = 126;
                break;
        }

        return data;
    },
    highList: ['high', '1', 'on'],
    lowList: ['low', '0', 'off'],
    BlockState: {},
};
Entry.jikko.setLanguage = function() {
    return {
        ko: {
            template: {
                jikko_toggle_on: '켜기',
                jikko_toggle_off: '끄기',
                jikko_lcd_first_line: '첫 번째',
                jikko_lcd_seconds_line: '두 번째',
                jikko_dcmotor_direction_forward: '정방향',
                jikko_dcmotor_direction_reverse: '역방향',
                jikko_btData_select_number: '숫자',
                jikko_btData_select_character: '문자',
                jikko_get_analog_value: '아날로그 %1 핀 읽기',
                jikko_get_light_value: '조도센서(AO %1)값',
                jikko_get_moisture_value: '토양수분센서(AO %1)값',
                jikko_get_sound_value: '사운드센서(AO %1)값',
                jikko_get_infrared_value: '적외선센서(AO %1)값',
                jikko_get_pullup: '풀업 저항 사용 버튼 %1 핀 눌림 상태',
                jikko_get_button: '버튼 %1 핀 눌림 상태',
                jikko_get_analog_mapping:
                    '아날로그 %1 번 핀 센서 값의 범위를 %2 ~ %3 에서 %4 ~ %5 로 바꾼 값',
                jikko_get_digital_bluetooth: '블루투스 RX 2 핀 데이터 값',
                jikko_get_digital_ultrasonic: '초음파 Trig %1 핀 Echo %2 핀 센서 값',
                jikko_get_digital: '디지털 %1 핀 읽기',
                jikko_get_digital_toggle: '디지털 %1 핀 센서 값',
                jikko_get_digital_pir: 'PIR %1 핀 센서 값',
                jikko_set_digital_toggle: '디지털 %1 핀 %2 %3',
                jikko_set_led_toggle: 'LED %1 핀 %2 %3',

                jikko_set_digital_pwm: '디지털(PWM %1 핀)밝기 %2 출력(0~255)%3',
                jikko_set_digital_rgbled:
                    '디지털 %1 번 핀의 RGB LED를 빨강 %2 초록 %3 파랑 %4 로 정하기 %5',
                jikko_set_digital_servo: '디지털 %1 번 핀의 서보모터를 %2 의 각도로 정하기 %3',
                jikko_set_digital_buzzer: '디지털 %1 번 핀의 버저를 %2 %3 음으로 %4 초 연주하기 %5',
                jikko_set_digital_dcmotor: 'DC모터 %1 번 핀을 %2 %3 번 핀의 속도를 %4 로 정하기 %5',
                jikko_set_neopixel_init:
                    '네오픽셀 LED 시작하기 설정 ( %1 핀에 %2 개의 LED 연결) %3',
                jikko_set_neopixel_bright: '네오픽셀 LED ( %1 핀) 밝기 %2 으로 설정 (0 ~ 255) %3',
                jikko_set_neopixel: '네오픽셀 LED ( %1 핀) %2 번째 LED 색 %3 출력 %4',
                //jikko_set_neopixel: '네오픽셀 LED ( %1 핀) %2 번째 LED 색 R: %3 , G: %4 , B: %5 출력 %6',
                jikko_set_neopixel_all: '네오픽셀 LED ( %1 핀) 모든 LED 색 %2 출력 %3',
                //jikko_set_neopixel_all: '네오픽셀 LED ( %1 핀) 모든 LED 색 R: %2 , G: %3 , B: %4 출력 %5',
                jikko_set_neopixel_clear: '네오픽셀 LED( %1 핀) 모든 LED 끄기 %2',
                jikko_set_dotmatrix_init:
                    '8x8 도트매트릭스 시작하기 설정(DIN %1, CLK %2, CS %3) %4',
                jikko_set_dotmatrix_bright: '도트매트릭스 밝기 %1 으로 설정 (0 ~ 8) %2',
                jikko_set_dotmatrix: '도트매트릭스 LED %1 그리기 %2',
                jikko_set_dotmatrix_clear: '도트매트릭스 LED 지우기 %1',

                jikko_lcd_init: 'I2C LCD 시작하기 설정(주소 %1 ,열 %2, 행 %3) %4',
                jikko_get_lcd_row: '%1',
                jikko_get_lcd_col: '%1',
                jikko_module_digital_lcd: 'LCD화면 %1 줄 %2 칸에 %3 나타내기 %4',
                jikko_lcd_clear: 'LCD화면 지우기 %1',
                // jikko_set_dht_init: '디지털 %1 번 핀에 연결된 온습도센서 사용하기 %2',
                jikko_get_dht_temp_value: 'DHT11 온습도센서(out %1)의 온도값',
                jikko_get_dht_humi_value: 'DHT11 온습도센서(out %1)의 습도값',

                jikko_set_mp3_init: 'mp3 초기화 ( tx: %1, rx: %2 ) %3',
                jikko_set_mp3_play: 'mp3 %1 번 파일 재생 %2',
                //jikko_set_mp3_play2: 'mp3 %1 번 파일 %2 초 동안 재생 %3',
                jikko_set_mp3_vol: 'mp3 볼륨 %1 으로 설정 (0 ~ 30) %2',
                jikko_get_analog_temp_value: 'DHT11 포트 %1의 %2 센서 값',
                jikko_module_digital_bluetooth: '블루투스 TX 3 핀에 %1 데이터 보내기 %2',
                jikko_module_digital_oled: 'OLED화면 X 좌표 %1  Y 좌표 %2 에 %3 나타내기 %4',
            },
        },
        en: {
            template: {
                jikko_toggle_on: 'on',
                jikko_toggle_off: 'off',
                jikko_lcd_first_line: 'first',
                jikko_lcd_seconds_line: 'seconds',
                jikko_dcmotor_direction_forward: 'forward',
                jikko_dcmotor_direction_reverse: 'reverse',
                jikko_btData_select_number: 'number',
                jikko_btData_select_character: 'character',
                jikko_get_analog_value: 'Read analog %1 pin sensor value',
                jikko_get_analog_mapping: 'Map analog %1 pin sensor value from %2 ~ %3 to %4 ~ %5',
                jikko_get_digital_bluetooth: 'Bluetooth RX 2 value',
                jikko_get_digital_ultrasonic: 'Read ultrasonic Trig %1 Echo %2 sensor value',
                jikko_get_digital: 'Digital %1 pin sensor value',
                jikko_get_digital_toggle: 'Digital %1 pin sensor value',
                jikko_set_digital_toggle: 'Digital %1 pin %2 %3',
                jikko_set_digital_pwm: 'Digital pwm %1 Pin %2 %3',
                jikko_set_digital_rgbled: 'Digital %1 pin RGB LED Red %2 Green %3 Blue %4 %5',
                jikko_set_digital_servo: 'Set servo pin %1 angle as %2 %3',
                jikko_set_digital_buzzer: 'Play tone pin %1 on note %2 octave %3 beat %4 %5',
                jikko_set_digital_dcmotor: 'DC Motor %1 pin direction %2 %3 pin speed %4 %5',
                jikko_set_neopixel_init:
                    '네오픽셀 LED 시작하기 설정 ( %1 핀에 %2 개의 LED 연결) %3',
                jikko_set_neopixel_bright: '네오픽셀 LED ( %1 핀) 밝기 %2 으로 설정 (0 ~ 255) %3',
                jikko_set_neopixel: '네오픽셀 LED ( %1 핀) %2 번째 LED 색 %3 출력 %4',
                //jikko_set_neopixel: '네오픽셀 LED ( %1 핀) %2 번째 LED 색 R: %3 , G: %4 , B: %5 출력 %6',
                jikko_set_neopixel_all: '네오픽셀 LED ( %1 핀) 모든 LED 색 %2 출력 %3',
                //jikko_set_neopixel_all: '네오픽셀 LED ( %1 핀) 모든 LED 색 R: %2 , G: %3 , B: %4 출력 %5',
                jikko_set_neopixel_clear: '네오픽셀 LED( %1 핀) 모든 LED 끄기 %2',
                jikko_set_dotmatrix_init:
                    '8x8 도트매트릭스 시작하기 설정(DIN %1, CLK %2, CS %3) %4',
                jikko_set_dotmatrix_bright: '도트매트릭스 밝기 %1 으로 설정 (0 ~ 8) %2',
                jikko_set_dotmatrix: '도트매트릭스 LED 그리기 %1 %2',
                jikko_module_digital_lcd: 'LCD %1 line %2 appear %3',
                jikko_lcd_init: 'I2C LCD 시작하기 설정(주소 %1 ,열 %2, 행 %3) %4',

                jikko_module_digital_bluetooth: 'Bluetooth TX 3 Pin %1 data send %2',
                jikko_module_digital_oled: 'OLED X codinate %1 Y coodinate %2 appear %3 %4',
                //jikko_set_dht_init: '디지털 %1 번 핀에 연결된 온습도센서 사용하기 %2',
                jikko_get_dht_temp_value: '온습도센서의 온도값',
                jikko_get_dht_humi_value: '온습도센서의 습도값',

                jikko_set_mp3_init: 'mp3 초기화 ( tx: %1, rx: %2 ) %3',
                jikko_set_mp3_play: 'mp3 %1 번 파일 재생 %2',
                //jikko_set_mp3_play2: 'mp3 %1 번 파일 %2 초 동안 재생 %3',
                jikko_set_mp3_vol: 'mp3 볼륨 %1 으로 설정 (0 ~ 30) %2',
            },
        },
    };
};
Entry.jikko.blockMenuBlocks = [
    'jikko_set_digital_toggle',
    'jikko_get_analog_value',
    'jikko_get_digital',
    'jikko_get_analog_mapping',

    'jikko_set_led_toggle',
    'jikko_set_digital_pwm',

    'jikko_get_digital_bluetooth',
    'jikko_get_digital_ultrasonic',

    'jikko_get_digital_toggle',
    'jikko_get_digital_pir',
    'jikko_get_light_value',
    'jikko_get_moisture_value',
    'jikko_get_sound_value',
    'jikko_get_infrared_value',
    'jikko_get_dht_temp_value',
    'jikko_get_dht_humi_value',
    'jikko_get_pullup',
    'jikko_get_button',

    'jikko_set_digital_rgbled',
    'jikko_set_digital_servo',
    'jikko_set_digital_buzzer',
    'jikko_set_digital_dcmotor',
    'jikko_set_neopixel_init',
    'jikko_set_neopixel_bright',
    'jikko_set_neopixel',
    'jikko_set_neopixel_all',
    'jikko_set_neopixel_clear',
    'jikko_set_dotmatrix_init',
    'jikko_set_dotmatrix_bright',
    'jikko_set_dotmatrix',
    'jikko_set_dotmatrix_clear',
    'jikko_module_digital_lcd',
    'jikko_lcd_init',
    'jikko_get_lcd_row',
    'jikko_get_lcd_col',
    'jikko_lcd_clear',
    // 'jikko_set_dht_init',

    'jikko_module_digital_bluetooth',
    //'jikko_module_digital_oled',
    'jikko_set_mp3_init',
    'jikko_set_mp3_play',
    //'jikko_set_mp3_play2',
    'jikko_set_mp3_vol',
];
Entry.jikko.getBlocks = function() {
    var tx;
    var din;
    var cs;
    var clk;

    return {
        jikko_list_analog_basic: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
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
        jikko_list_digital_basic: {
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
                        ['6', '6'],
                        ['7', '7'],
                        ['8', '8'],
                        ['9', '9'],
                        ['10', '10'],
                        ['11', '11'],
                        ['12', '12'],
                        ['13', '13'],
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
        jikko_list_digital_octave: {
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
        jikko_list_digital_pwm: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['~3', '3'],
                        ['~5', '5'],
                        ['~6', '6'],
                        ['~9', '9'],
                        ['~10', '10'],
                        ['~11', '11'],
                    ],
                    value: '11',
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
        jikko_list_digital_toggle: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.template.jikko_toggle_on, 'on'],
                        [Lang.template.jikko_toggle_off, 'off'],
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
        jikko_list_digital_toggle_en: {
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
        jikko_list_digital_tone: {
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
        jikko_set_neopixel_init: {
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
                        type: 'arduino_get_port_number',
                        params: ['7'],
                    },
                    {
                        type: 'number',
                        params: ['4'],
                    },
                    null,
                ],
                type: 'jikko_set_neopixel_init',
            },
            paramsKeyMap: {
                PORT: 0,
                NUM: 1,
            },
            class: 'neo',
            isNotFor: ['jikko'],
            func: function(sprite, script) {
                //var sq = Entry.hw.sendQueue;
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
                        type: Entry.jikko.sensorTypes.NEOPIXELINIT,
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
        jikko_set_neopixel_bright: {
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
                        type: 'arduino_get_port_number',
                        params: ['7'],
                    },
                    {
                        type: 'number',
                        params: ['255'],
                    },
                    null,
                ],
                type: 'jikko_set_neopixel_bright',
            },
            paramsKeyMap: {
                PORT: 0,
                NUM: 1,
            },
            class: 'neo',
            isNotFor: ['jikko'],
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
                        type: Entry.jikko.sensorTypes.NEOPIXELBRIGHT,
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
        jikko_set_neopixel: {
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
                        type: 'arduino_get_port_number',
                        params: ['7'],
                    },
                    {
                        type: 'number',
                        params: ['0'],
                    },
                    null,
                    null,
                ],
                type: 'jikko_set_neopixel',
            },
            paramsKeyMap: {
                PORT: 0,
                NUM: 1,
                COLOR: 2,
            },
            class: 'neo',
            isNotFor: ['jikko'],
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
                        type: Entry.jikko.sensorTypes.NEOPIXEL,
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
        jikko_set_neopixel_all: {
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
                        type: 'arduino_get_port_number',
                        params: ['7'],
                    },
                    null,
                    null,
                ],
                type: 'jikko_set_neopixel_all',
            },
            paramsKeyMap: {
                PORT: 0,
                COLOR: 1,
            },
            class: 'neo',
            isNotFor: ['jikko'],
            func: function(sprite, script) {
                //var sq = Entry.hw.sendQueue;
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
                        type: Entry.jikko.sensorTypes.NEOPIXELALL,
                        data: {
                            r: r,
                            g: g,
                            b: b,
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

        jikko_set_neopixel_clear: {
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
                        type: 'arduino_get_port_number',
                        params: ['7'],
                    },
                    null,
                ],
                type: 'jikko_set_neopixel_clear',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'neo',
            isNotFor: ['jikko'],
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
                        type: Entry.jikko.sensorTypes.NEOPIXELCLEAR,
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
        jikko_lcd_list_init: {
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
        // dot matrix
        jikko_set_dotmatrix_init: {
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
                        type: 'arduino_get_port_number',
                        params: ['12'],
                    },
                    {
                        type: 'arduino_get_port_number',
                        params: ['11'],
                    },
                    {
                        type: 'arduino_get_port_number',
                        params: ['10'],
                    },
                    null,
                ],
                type: 'jikko_set_dotmatrix_init',
            },
            paramsKeyMap: {
                PORT1: 0,
                PORT2: 1,
                PORT3: 2,
            },
            class: 'dot',
            isNotFor: ['jikko'],
            func: function(sprite, script) {
                //var sq = Entry.hw.sendQueue;
                var port1 = script.getNumberValue('PORT1', script);
                var port2 = script.getNumberValue('PORT2', script);
                var port3 = script.getNumberValue('PORT3', script);

                din = port1;
                clk = port2;
                cs = port3;

                if (!script.isStart) {
                    if (!Entry.hw.sendQueue['SET']) {
                        Entry.hw.sendQueue['SET'] = {};
                    }
                    script.isStart = true;
                    script.timeFlag = 1;
                    var fps = Entry.FPS || 60;
                    var timeValue = (60 / fps) * 50;
                    // var timeValue = (1 + 0.5) * 0.1; //0.15
                    // timeValue = (60 / fps) * timeValue * 10000;

                    Entry.hw.sendQueue['SET'][port1] = {
                        type: Entry.jikko.sensorTypes.DOTMATRIXINIT,
                        data: {
                            port1: port1,
                            port2: port2,
                            port3: port3,
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
                //  return script.callReturn();
            },
            syntax: {
                js: [],
                py: [{}],
            },
        },
        jikko_set_dotmatrix_bright: {
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
                        type: 'arduino_get_port_number',
                        params: ['8'],
                    },
                    null,
                ],
                type: 'jikko_set_dotmatrix_bright',
            },
            paramsKeyMap: {
                NUM: 0,
            },
            class: 'dot',
            isNotFor: ['jikko'],
            func: function(sprite, script) {
                //var sq = Entry.hw.sendQueue;
                var num = script.getNumberValue('NUM', script);

                if (!script.isStart) {
                    if (!Entry.hw.sendQueue['SET']) {
                        Entry.hw.sendQueue['SET'] = {};
                    }
                    script.isStart = true;
                    script.timeFlag = 1;
                    var fps = Entry.FPS || 60;
                    var timeValue = (60 / fps) * 50;

                    Entry.hw.sendQueue['SET'][din] = {
                        type: Entry.jikko.sensorTypes.DOTMATRIXBRIGHT,
                        data: num,
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
        jikko_set_dotmatrix_clear: {
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
                type: 'jikko_set_dotmatrix_clear',
            },
            class: 'dot',
            isNotFor: ['jikko'],
            func(sprite, script) {
                if (!script.isStart) {
                    if (!Entry.hw.sendQueue['SET']) {
                        Entry.hw.sendQueue['SET'] = {};
                    }

                    // script.isStart = true;
                    // script.timeFlag = 1;
                    // var fps = Entry.FPS || 60;
                    // var timeValue = (60 / fps) * 50;
                    script.isStart = true;
                    script.timeFlag = 1;
                    var fps = Entry.FPS || 60;
                    // var timeValue = (60 / fps) * 50;
                    var timeValue = (1 + 0.5) * 0.1; //0.15
                    timeValue = (60 / fps) * timeValue * 100;

                    Entry.hw.sendQueue['SET'][din] = {
                        type: Entry.jikko.sensorTypes.DOTMATRIXCLEAR,
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
        jikko_set_dotmatrix: {
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
            def: {
                params: [
                    {
                        type: 'text',
                        params: ['003c420024242400'],
                    },
                ],
                type: 'jikko_set_dotmatrix',
            },
            paramsKeyMap: {
                STRING: 0,
            },
            class: 'dot',
            isNotFor: ['jikko'],
            func: function(sprite, script) {
                var text = script.getValue('STRING');
                if (!script.isStart) {
                    if (!Entry.hw.sendQueue['SET']) {
                        Entry.hw.sendQueue['SET'] = {};
                    }

                    //script.isStart = true;
                    //script.timeFlag = 1;
                    //var fps = Entry.FPS || 60;
                    //var timeValue = (1 + 0.5) * 0.1; //0.15
                    //timeValue = (60 / fps) * timeValue * 100;

                    script.isStart = true;
                    script.timeFlag = 1;
                    var fps = Entry.FPS || 60;
                    var timeValue = (60 / fps) * 50;

                    Entry.hw.sendQueue['SET'][din] = {
                        type: Entry.jikko.sensorTypes.DOTMATRIX,
                        data: {
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
            syntax: {
                js: [],
                py: [{}],
            },
        },
        // dot matrix
        jikko_list_digital_lcd: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.template.jikko_lcd_first_line, '0'],
                        [Lang.template.jikko_lcd_seconds_line, '1'],
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
        jikko_list_digital_dcmotor_direction: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.template.jikko_dcmotor_direction_reverse, '0'],
                        [Lang.template.jikko_dcmotor_direction_forward, '1'],
                    ],
                    value: '1',
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
                DIRECTION: 0,
            },
            func: function(sprite, script) {
                return script.getField('DIRECTION');
            },
        },
        jikko_get_lcd_row: {
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
                        keyOption: 'jikko_get_lcd_row',
                    },
                ],
            },
        },

        jikko_get_lcd_col: {
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
                        keyOption: 'jikko_get_lcd_col',
                    },
                ],
            },
        },

        jikko_list_digital_btData_select: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.template.jikko_btData_select_number, '0'],
                        [Lang.template.jikko_btData_select_character, '1'],
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
                DIRECTION: 0,
            },
            func: function(sprite, script) {
                return script.getField('DIRECTION');
            },
        },
        jikko_get_analog_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            template: Lang.template.jikko_get_analog_value,
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
                        type: 'jikko_list_analog_basic',
                    },
                ],
                type: 'jikko_get_analog_value',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'jikkoPin',
            isNotFor: ['jikko'],
            func: function(sprite, script) {
                var port = script.getValue('PORT', script);
                var ANALOG = Entry.hw.portData.ANALOG;

                if (port[0] === 'A') port = port.substring(1);

                return ANALOG ? ANALOG[port] || 0 : 0;
            },
            syntax: { js: [], py: ['jikko.get_analog_value(%1)'] },
        },
        jikko_get_light_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            //template: Lang.template.jikko_get_analog_value,
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
                        type: 'jikko_list_analog_basic',
                    },
                ],
                type: 'jikko_get_light_value',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'jikkoGet',
            isNotFor: ['jikko'],
            func: function(sprite, script) {
                var port = script.getValue('PORT', script);
                var ANALOG = Entry.hw.portData.ANALOG;

                if (port[0] === 'A') port = port.substring(1);

                return ANALOG ? (ANALOG[port] || 0) / 10 : 0;
            },
            syntax: { js: [], py: ['jikko.get_analog_value(%1)'] },
        },
        jikko_get_moisture_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            //template: Lang.template.jikko_get_analog_value,
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
                        type: 'jikko_list_analog_basic',
                    },
                ],
                type: 'jikko_get_moisture_value',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'jikkoGet',
            isNotFor: ['jikko'],
            func: function(sprite, script) {
                var port = script.getValue('PORT', script);
                var ANALOG = Entry.hw.portData.ANALOG;

                if (port[0] === 'A') port = port.substring(1);

                return ANALOG ? (ANALOG[port] || 0) / 10 : 0;
            },
            syntax: { js: [], py: ['jikko.get_analog_value(%1)'] },
        },
        jikko_get_sound_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            //template: Lang.template.jikko_get_analog_value,
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
                        type: 'jikko_list_analog_basic',
                    },
                ],
                type: 'jikko_get_sound_value',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'jikkoGet',
            isNotFor: ['jikko'],
            func: function(sprite, script) {
                var port = script.getValue('PORT', script);
                var ANALOG = Entry.hw.portData.ANALOG;

                if (port[0] === 'A') port = port.substring(1);

                return ANALOG ? ANALOG[port] || 0 : 0;
            },
            syntax: { js: [], py: ['jikko.get_analog_value(%1)'] },
        },
        jikko_get_infrared_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            //template: Lang.template.jikko_get_analog_value,
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
                        type: 'jikko_list_analog_basic',
                    },
                ],
                type: 'jikko_get_infrared_value',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'jikkoGet',
            isNotFor: ['jikko'],
            func: function(sprite, script) {
                var port = script.getValue('PORT', script);
                var ANALOG = Entry.hw.portData.ANALOG;

                if (port[0] === 'A') port = port.substring(1);

                return ANALOG ? ANALOG[port] || 0 : 0;
            },
            syntax: { js: [], py: ['jikko.get_analog_value(%1)'] },
        },
        jikko_get_pullup: {
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
                        type: 'jikko_list_digital_basic',
                    },
                ],
                type: 'jikko_get_pullup',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'jikkoGet',
            isNotFor: ['jikko'],
            func: function(sprite, script) {
                var port = script.getNumberValue('PORT');
                var DIGITAL = Entry.hw.portData.DIGITAL;

                if (!Entry.hw.sendQueue['GET']) {
                    Entry.hw.sendQueue['GET'] = {};
                }

                Entry.hw.sendQueue['GET'][Entry.jikko.sensorTypes.DIGITAL] = {
                    port: port,
                    data: 2,
                    time: new Date().getTime(),
                };

                var value = DIGITAL ? DIGITAL[port] || 0 : 0;
                return !value;

                // var value = DIGITAL ? DIGITAL[port] || 0 : 0;
                // if (Entry.jikko.Static.BUTTON_PRESS_VALUE == 0) {
                //     value = value ? 1 : 0;
                // }
                // return value;
                //return DIGITAL ? 0 : DIGITAL[port] || 0;
                //return DIGITAL ? DIGITAL[port] || 0 : 0;
            },
            syntax: { js: [], py: [] },
        },
        jikko_get_button: {
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
                        type: 'jikko_list_digital_basic',
                    },
                ],
                type: 'jikko_get_button',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'jikkoGet',
            isNotFor: ['jikko'],
            func: function(sprite, script) {
                var port = script.getNumberValue('PORT', script);
                var DIGITAL = Entry.hw.portData.DIGITAL;

                var value = DIGITAL ? DIGITAL[port] || 0 : 0;
                /*
                if (Entry.jikko.Static.BUTTON_PRESS_VALUE == 0) {
                    value = value ? 1 : 0;
                }
                */
                return !value;
                //return DIGITAL ? 0 : DIGITAL[port] || 0;
                //return DIGITAL ? DIGITAL[port] || 0 : 0;
            },
            syntax: { js: [], py: [] },
        },
        jikko_get_analog_mapping: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            template: Lang.template.jikko_get_analog_mapping,
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
                        type: 'jikko_list_analog_basic',
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
                type: 'jikko_get_analog_mapping',
            },
            paramsKeyMap: {
                PORT: 0,
                VALUE2: 1,
                VALUE3: 2,
                VALUE4: 3,
                VALUE5: 4,
            },
            class: 'jikkoPin',
            isNotFor: ['jikko'],
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
                py: ['jikko.get_analog_mapping(%1, %2, %3, %4, %5)'],
            },
        },
        jikko_get_digital_bluetooth: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            template: Lang.template.jikko_get_digital_bluetooth,
            statements: [],
            params: [],
            events: {},
            def: {
                params: [],
                type: 'jikko_get_digital_bluetooth',
            },
            paramsKeyMap: {},
            class: 'jikkoGet',
            isNotFor: ['jikko'],
            func: function(sprite, script) {
                var port = 2;
                var getString = Entry.hw.portData.READ_BLUETOOTH;
                if (!Entry.hw.sendQueue['SET']) {
                    Entry.hw.sendQueue['SET'] = {};
                }
                delete Entry.hw.sendQueue['SET'][port];
                if (!Entry.hw.sendQueue['GET']) {
                    Entry.hw.sendQueue['GET'] = {};
                }
                Entry.hw.sendQueue['GET'][Entry.jikko.sensorTypes.READ_BLUETOOTH] = {
                    port: port,
                    time: new Date().getTime(),
                };

                return getString ? getString.slice(0, getString.length - 1) : ' ';
            },
            syntax: { js: [], py: ['jikko.get_digital_bluetooth()'] },
        },
        jikko_get_digital_ultrasonic: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            template: Lang.template.jikko_get_digital_ultrasonic,
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
                        type: 'text',
                        params: ['4'],
                    },
                    {
                        type: 'text',
                        params: ['5'],
                    },
                ],
                type: 'jikko_get_digital_ultrasonic',
            },
            paramsKeyMap: {
                PORT1: 0,
                PORT2: 1,
            },
            class: 'jikkoGet',
            isNotFor: ['jikko'],
            func: function(sprite, script) {
                var port1 = script.getNumberValue('PORT1');
                var port2 = script.getNumberValue('PORT2');

                if (!Entry.hw.sendQueue['SET']) {
                    Entry.hw.sendQueue['SET'] = {};
                }
                delete Entry.hw.sendQueue['SET'][port1];
                delete Entry.hw.sendQueue['SET'][port2];
                if (!Entry.hw.sendQueue['GET']) {
                    Entry.hw.sendQueue['GET'] = {};
                }
                Entry.hw.sendQueue['GET'][Entry.jikko.sensorTypes.ULTRASONIC] = {
                    port: [port1, port2],
                    time: new Date().getTime(),
                };

                return Entry.hw.portData.ULTRASONIC || 0;
            },
            syntax: {
                js: [],
                py: ['jikko.get_digital_ultrasonic(%1, %2)'],
            },
        },
        jikko_get_digital: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            template: Lang.template.jikko_get_digital,
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
                        type: 'jikko_list_digital_basic',
                    },
                ],
                type: 'jikko_get_digital',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'jikkoPin',
            isNotFor: ['jikko'],
            func: function(sprite, script) {
                var port = script.getNumberValue('PORT');
                var DIGITAL = Entry.hw.portData.DIGITAL;

                if (!Entry.hw.sendQueue['GET']) {
                    Entry.hw.sendQueue['GET'] = {};
                }
                if (Entry.hw.sendQueue.SET[port]) {
                    return Entry.hw.sendQueue.SET[port].data;
                } else {
                    Entry.hw.sendQueue['GET'][Entry.jikko.sensorTypes.DIGITAL] = {
                        port: port,
                        time: new Date().getTime(),
                    };
                }

                return DIGITAL ? DIGITAL[port] || 0 : 0;
            },
            syntax: { js: [], py: ['jikko.get_digital(%1)'] },
        },
        jikko_get_digital_toggle: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
            statements: [],
            template: Lang.template.jikko_get_digital_toggle,
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
                        type: 'jikko_list_digital_basic',
                    },
                ],
                type: 'jikko_get_digital_toggle',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'jikkoGet',
            isNotFor: ['jikko'],
            func: function(sprite, script) {
                var port = script.getNumberValue('PORT');
                var DIGITAL = Entry.hw.portData.DIGITAL;

                if (!Entry.hw.sendQueue['GET']) {
                    Entry.hw.sendQueue['GET'] = {};
                }
                Entry.hw.sendQueue['GET'][Entry.jikko.sensorTypes.DIGITAL] = {
                    port: port,
                    time: new Date().getTime(),
                };

                return DIGITAL ? DIGITAL[port] || 0 : 0;
            },
            syntax: { js: [], py: ['jikko.get_digital_toggle(%1)'] },
        },
        jikko_get_digital_pir: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
            statements: [],
            template: Lang.template.jikko_get_digital_pir,
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
                        type: 'jikko_list_digital_basic',
                    },
                ],
                type: 'jikko_get_digital_pir',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'jikkoGet',
            isNotFor: ['jikko'],
            func: function(sprite, script) {
                var port = script.getNumberValue('PORT');
                var DIGITAL = Entry.hw.portData.DIGITAL;

                if (!Entry.hw.sendQueue['GET']) {
                    Entry.hw.sendQueue['GET'] = {};
                }
                Entry.hw.sendQueue['GET'][Entry.jikko.sensorTypes.PIR] = {
                    port: port,
                    time: new Date().getTime(),
                };

                return DIGITAL ? DIGITAL[port] || 0 : 0;
            },
            syntax: { js: [], py: ['jikko.get_digital_pir(%1)'] },
        },
        jikko_set_digital_toggle: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic',
            statements: [],
            template: Lang.template.jikko_set_digital_toggle,
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
                        type: 'jikko_list_digital_basic',
                    },
                    {
                        type: 'jikko_list_digital_toggle_en',
                    },
                    null,
                ],
                type: 'jikko_set_digital_toggle',
            },
            paramsKeyMap: {
                PORT: 0,
                VALUE: 1,
            },
            class: 'jikkoPin',
            isNotFor: ['jikko'],
            func: function(sprite, script) {
                var port = script.getNumberValue('PORT');
                var value = script.getValue('VALUE');

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
                    type: Entry.jikko.sensorTypes.DIGITAL,
                    data: value,
                    time: new Date().getTime(),
                };

                return script.callReturn();
            },
            syntax: { js: [], py: ['jikko.set_digital_toggle(%1, %2)'] },
        },
        jikko_set_led_toggle: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic',
            statements: [],
            //template: Lang.template.jikko_set_digital_toggle,
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
                        type: 'jikko_list_digital_basic',
                    },
                    {
                        type: 'jikko_list_digital_toggle',
                    },
                    null,
                ],
                type: 'jikko_set_led_toggle',
            },
            paramsKeyMap: {
                PORT: 0,
                VALUE: 1,
            },
            class: 'jikkoLed',
            isNotFor: ['jikko'],
            func: function(sprite, script) {
                var port = script.getNumberValue('PORT');
                var value = script.getValue('VALUE');

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
                    type: Entry.jikko.sensorTypes.DIGITAL,
                    data: value,
                    time: new Date().getTime(),
                };

                return script.callReturn();
            },
            syntax: { js: [], py: ['jikko.set_digital_toggle(%1, %2)'] },
        },
        jikko_set_digital_pwm: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic',
            statements: [],
            template: Lang.template.jikko_set_digital_pwm,
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
                        type: 'jikko_list_digital_pwm',
                    },
                    {
                        type: 'text',
                        params: ['255'],
                    },
                    null,
                ],
                type: 'jikko_set_digital_pwm',
            },
            paramsKeyMap: {
                PORT: 0,
                VALUE: 1,
            },
            class: 'jikkoLed',
            isNotFor: ['jikko'],
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
                    type: Entry.jikko.sensorTypes.PWM,
                    data: value,
                    time: new Date().getTime(),
                };

                return script.callReturn();
            },
            syntax: { js: [], py: ['jikko.set_digital_pwm(%1, %2)'] },
        },
        jikko_set_digital_rgbled: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic',
            statements: [],
            template: Lang.template.jikko_set_digital_rgbled,
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
                        type: 'jikko_list_digital_basic',
                    },
                    {
                        type: 'text',
                        params: ['255'],
                    },
                    {
                        type: 'text',
                        params: ['0'],
                    },
                    {
                        type: 'text',
                        params: ['0'],
                    },
                    null,
                ],
                type: 'jikko_set_digital_rgbled',
            },
            paramsKeyMap: {
                PORT: 0,
                VALUE0: 1,
                VALUE1: 2,
                VALUE2: 3,
            },
            class: 'jikkoSet',
            isNotFor: ['jikko'],
            func: function(sprite, script) {
                var port = script.getNumberValue('PORT');
                var value = [3];
                value[0] = script.getNumberValue('VALUE0');
                value[1] = script.getNumberValue('VALUE1');
                value[2] = script.getNumberValue('VALUE2');

                for (var i = 0; i < 3; i++) {
                    value[i] = Math.round(value[i]);
                    value[i] = Math.min(value[i], 200);
                    value[i] = Math.max(value[i], 0);
                }
                if (!Entry.hw.sendQueue['SET']) {
                    Entry.hw.sendQueue['SET'] = {};
                }
                Entry.hw.sendQueue['SET'][port] = {
                    type: Entry.jikko.sensorTypes.RGBLED,
                    data: {
                        redValue: value[0],
                        greenValue: value[1],
                        blueValue: value[2],
                    },
                    time: new Date().getTime(),
                };

                return script.callReturn();
            },
            syntax: { js: [], py: ['jikko.set_digital_pwm(%1, %2)'] },
        },
        jikko_set_digital_servo: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic',
            statements: [],
            template: Lang.template.jikko_set_digital_servo,
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
                        type: 'jikko_list_digital_basic',
                    },
                    {
                        type: 'text',
                        params: ['90'],
                    },
                    null,
                ],
                type: 'jikko_set_digital_servo',
            },
            paramsKeyMap: {
                PORT: 0,
                VALUE: 1,
            },
            class: 'jikkoSet',
            isNotFor: ['jikko'],
            func: function(sprite, script) {
                var port = script.getNumberValue('PORT');
                var value = script.getNumberValue('VALUE');
                value = Math.min(value, 180);
                value = Math.max(value, 0);

                if (!Entry.hw.sendQueue['SET']) {
                    Entry.hw.sendQueue['SET'] = {};
                }
                Entry.hw.sendQueue['SET'][port] = {
                    type: Entry.jikko.sensorTypes.SERVO,
                    data: value,
                    time: new Date().getTime(),
                };

                return script.callReturn();
            },
            syntax: { js: [], py: ['jikko.set_digital_servo(%1, %2)'] },
        },
        jikko_set_digital_buzzer: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic',
            statements: [],
            template: Lang.template.jikko_set_digital_buzzer,
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
                        type: 'jikko_list_digital_basic',
                        params: ['6'],
                    },
                    {
                        type: 'jikko_list_digital_tone',
                    },
                    {
                        type: 'jikko_list_digital_octave',
                    },
                    {
                        type: 'text',
                        params: ['1'],
                    },
                    null,
                ],
                type: 'jikko_set_digital_buzzer',
            },
            paramsKeyMap: {
                PORT: 0,
                NOTE: 1,
                OCTAVE: 2,
                DURATION: 3,
            },
            class: 'jikkoSet',
            isNotFor: ['jikko'],
            func: function(sprite, script) {
                var port = script.getNumberValue('PORT');
                var duration = script.getNumberValue('DURATION');
                var octave = script.getNumberValue('OCTAVE') - 1;
                var value = 0;

                if (!script.isStart) {
                    var note = script.getValue('NOTE');
                    if (!Entry.Utils.isNumber(note)) {
                        note = Entry.jikko.toneTable[note];
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
                            type: Entry.jikko.sensorTypes.TONE,
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
                        value = Entry.jikko.toneMap[note][octave];
                    }

                    duration = duration * 1000;
                    script.isStart = true;
                    script.timeFlag = 1;

                    Entry.hw.sendQueue['SET'][port] = {
                        type: Entry.jikko.sensorTypes.TONE,
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
                        type: Entry.jikko.sensorTypes.TONE,
                        data: 0,
                        time: new Date().getTime(),
                    };
                    Entry.engine.isContinue = false;
                    return script.callReturn();
                }
            },
            syntax: {
                js: [],
                py: ['jikko.set_digital_toggle(%1, %2, %3, %4)'],
            },
        },
        jikko_set_digital_dcmotor: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic',
            statements: [],
            template: Lang.template.jikko_set_digital_dcmotor,
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
                        type: 'jikko_list_digital_basic',
                    },
                    {
                        type: 'jikko_list_digital_dcmotor_direction',
                    },
                    {
                        type: 'jikko_list_digital_pwm',
                    },
                    {
                        type: 'text',
                        params: ['255'],
                    },
                    null,
                ],
                type: 'jikko_set_digital_dcmotor',
            },
            paramsKeyMap: {
                PORT0: 0,
                VALUE0: 1,
                PORT1: 2,
                VALUE1: 3,
            },
            class: 'jikkoSet',
            isNotFor: ['jikko'],
            func: function(sprite, script) {
                var port = 0; // port value is dummy;
                var directionPort = script.getNumberValue('PORT0');
                var speedPort = script.getNumberValue('PORT1');
                var directionValue = script.getNumberValue('VALUE0');
                var speedValue = script.getNumberValue('VALUE1');

                speedValue = Math.round(speedValue);
                speedValue = Math.min(speedValue, 255);
                speedValue = Math.max(speedValue, 0);
                if (!Entry.hw.sendQueue['SET']) {
                    Entry.hw.sendQueue['SET'] = {};
                }
                Entry.hw.sendQueue['SET'][port] = {
                    type: Entry.jikko.sensorTypes.DCMOTOR,
                    data: {
                        port0: directionPort,
                        port1: speedPort,
                        value0: directionValue,
                        value1: speedValue,
                    },
                    time: new Date().getTime(),
                };

                return script.callReturn();
            },
            syntax: { js: [], py: ['jikko.set_digital_dcmotor(%1, %2, %3, %4)'] },
        },
        jikko_lcd_init: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic',
            //    template: Lang.template.jikko_module_digital_lcd,
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                    //defaultType: 'number',
                },
                {
                    type: 'Block',
                    accept: 'string',
                    // defaultType: 'number',
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
                        type: 'jikko_lcd_list_init',
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
                type: 'jikko_lcd_init',
            },
            paramsKeyMap: {
                LIST: 0,
                COL: 1,
                LINE: 2,
            },
            class: 'jikkoModule',
            isNotFor: ['jikko'],
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

                    //Entry.hw.sendQueue['SET'][0] = {
                    Entry.hw.sendQueue['SET'][1] = {
                        type: Entry.jikko.sensorTypes.LCDINIT,
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
                    // const blockId = script.block.id;
                    // Entry.TimeWaitManager.add(
                    //     blockId,
                    //     function() {
                    //         script.timeFlag = 0;
                    //     },
                    //     timeValue
                    // );
                    // return script;
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
        jikko_module_digital_lcd: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic',
            //    template: Lang.template.jikko_module_digital_lcd,
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
                        type: 'jikko_get_lcd_row',
                        params: ['0'],
                    },
                    {
                        type: 'jikko_get_lcd_col',
                        params: ['0'],
                    },
                    {
                        type: 'text',
                        params: ['Hello, Jikko'],
                    },
                    null,
                ],
                type: 'jikko_module_digital_lcd',
            },
            paramsKeyMap: {
                LINE: 0,
                COL: 1,
                STRING: 2,
            },
            class: 'jikkoModule',
            isNotFor: ['jikko'],
            func: function(sprite, script) {
                var line = script.getNumberValue('LINE');
                var column = script.getNumberValue('COL');
                var text = script.getValue('STRING');
                //var text = [];

                if (!script.isStart) {
                    // if (typeof string === 'string') {
                    //     for (var i = 0; i < string.length; i++) {
                    //         //  text[i] = string.charCodeAt(i);
                    //         text[i] = Entry.jikko.toByte(string[i]);
                    //     }
                    // } else if (typeof string === 'number') {
                    //     // text[0] = 1;
                    //     // text[1] = string / 1;
                    //     var num_to_string = string.toString();
                    //     for (var i = 0; i < num_to_string.length; i++) {
                    //         text[i] = Entry.jikko.toByte(num_to_string[i]);
                    //     }
                    // } else {
                    //     text[0] = string;
                    // }

                    if (!Entry.hw.sendQueue['SET']) {
                        Entry.hw.sendQueue['SET'] = {};
                    }

                    script.isStart = true;
                    script.timeFlag = 1;
                    var fps = Entry.FPS || 60;
                    var timeValue = (60 / fps) * 0.1 * 1000;

                    //Entry.hw.sendQueue['SET'][0] = {
                    Entry.hw.sendQueue['SET'][1] = {
                        type: Entry.jikko.sensorTypes.LCD,
                        data: {
                            line: line,
                            column: column,
                            text: text,
                            // text0: text[0],
                            // text1: text[1],
                            // text2: text[2],
                            // text3: text[3],
                            // text4: text[4],
                            // text5: text[5],
                            // text6: text[6],
                            // text7: text[7],
                            // text8: text[8],
                            // text9: text[9],
                            // text10: text[10],
                            // text11: text[11],
                            // text12: text[12],
                            // text13: text[13],
                            // text14: text[14],
                            // text15: text[15],
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
        jikko_lcd_clear: {
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
                type: 'jikko_lcd_clear',
            },
            class: 'jikkoModule',
            isNotFor: ['jikko'],
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
                        type: Entry.jikko.sensorTypes.LCDCLEAR,
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
        jikko_analog_temp_name: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['습도', '0'],
                        ['온도(화씨)', '1'],
                        ['온도(섭씨)', '2'],
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

        jikko_get_dht_temp_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                    //defaultType: 'number',
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'arduino_get_port_number',
                        params: ['4'],
                    },
                ],
                type: 'jikko_get_dht_temp_value',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'jikkoGet',
            isNotFor: ['jikko'],
            func: function(sprite, script) {
                var port = script.getNumberValue('PORT');

                if (!Entry.hw.sendQueue['SET']) {
                    Entry.hw.sendQueue['SET'] = {};
                }
                delete Entry.hw.sendQueue['SET'][port];

                if (!Entry.hw.sendQueue['GET']) {
                    Entry.hw.sendQueue['GET'] = {};
                }

                Entry.hw.sendQueue['GET'][Entry.jikko.sensorTypes.DHTTEMP] = {
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

        jikko_get_dht_humi_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                    //defaultType: 'number',
                },
            ],
            events: {},
            def: {
                //params: ['1'],
                params: [
                    {
                        type: 'arduino_get_port_number',
                        params: ['4'],
                    },
                ],
                type: 'jikko_get_dht_humi_value',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'jikkoGet',
            isNotFor: ['jikko'],
            func: function(sprite, script) {
                var port = script.getNumberValue('PORT');

                if (!Entry.hw.sendQueue['SET']) {
                    Entry.hw.sendQueue['SET'] = {};
                }
                delete Entry.hw.sendQueue['SET'][port];

                if (!Entry.hw.sendQueue['GET']) {
                    Entry.hw.sendQueue['GET'] = {};
                }

                Entry.hw.sendQueue['GET'][Entry.jikko.sensorTypes.DHTHUMI] = {
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

        jikko_set_mp3_init: {
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
                        type: 'arduino_get_port_number',
                        params: ['2'],
                    },
                    {
                        type: 'arduino_get_port_number',
                        params: ['3'],
                    },
                    null,
                ],
                type: 'jikko_set_mp3_init',
            },
            paramsKeyMap: {
                PORT1: 0,
                PORT2: 1,
            },
            class: 'mp3',
            isNotFor: ['jikko'],
            func: function(sprite, script) {
                //var sq = Entry.hw.sendQueue;
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
                        type: Entry.jikko.sensorTypes.MP3INIT,
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

        jikko_set_mp3_play: {
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
                type: 'jikko_set_mp3_play',
            },
            paramsKeyMap: {
                NUM: 0,
            },
            class: 'mp3',
            isNotFor: ['jikko'],
            func: function(sprite, script) {
                //var tx = script.getNumberValue('PORT');
                var num = script.getNumberValue('NUM');

                if (!script.isStart) {
                    if (!Entry.hw.sendQueue['SET']) {
                        Entry.hw.sendQueue['SET'] = {};
                    }
                    script.isStart = true;
                    script.timeFlag = 1;
                    var fps = Entry.FPS || 60;
                    var timeValue = (60 / fps) * 50;

                    Entry.hw.sendQueue['SET'][tx] = {
                        type: Entry.jikko.sensorTypes.MP3PLAY1,
                        data: {
                            tx: tx,
                            num: num,
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
        /*
        jikko_set_mp3_play2: {
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
                type: 'jikko_set_mp3_play2',
            },
            paramsKeyMap: {
                NUM: 0,
                TIME: 1,
            },
            class: 'mp3',
            isNotFor: ['jikko'],
            func: function(sprite, script) {
                //var tx = script.getNumberValue('PORT');
                var num = script.getNumberValue('NUM');
                var time_value = script.getNumberValue('TIME');

                if (!script.isStart) {
                    if (!Entry.hw.sendQueue['SET']) {
                        Entry.hw.sendQueue['SET'] = {};
                    }
                    script.isStart = true;
                    script.timeFlag = 1;
                    var fps = Entry.FPS || 60;
                    var timeValue = (60 / fps) * 50;

                    Entry.hw.sendQueue['SET'][tx] = {
                        type: Entry.jikko.sensorTypes.MP3PLAY2,
                        data: {
                            tx: tx,
                            num: num,
                            time_value: time_value,
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
        */
        jikko_set_mp3_vol: {
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
                type: 'jikko_set_mp3_vol',
            },
            paramsKeyMap: {
                VOL: 0,
            },
            class: 'mp3',
            isNotFor: ['jikko'],
            func: function(sprite, script) {
                //var tx = script.getNumberValue('PORT');
                var vol = script.getNumberValue('VOL');

                if (!script.isStart) {
                    if (!Entry.hw.sendQueue['SET']) {
                        Entry.hw.sendQueue['SET'] = {};
                    }
                    script.isStart = true;
                    script.timeFlag = 1;
                    var fps = Entry.FPS || 60;
                    var timeValue = (60 / fps) * 50;

                    Entry.hw.sendQueue['SET'][tx] = {
                        type: Entry.jikko.sensorTypes.MP3VOL,
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

        jikko_module_digital_oled: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic',
            statements: [],
            template: Lang.template.jikko_module_digital_oled,
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
                        type: 'text',
                        params: ['20'],
                    },
                    {
                        type: 'text',
                        params: ['20'],
                    },
                    {
                        type: 'text',
                        params: ['My Entry!!'],
                    },
                    null,
                ],
                type: 'jikko_module_digital_oled',
            },
            paramsKeyMap: {
                VALUE0: 0,
                VALUE1: 1,
                STRING: 2,
            },
            class: 'jikkoModule',
            isNotFor: ['jikko'],
            func: function(sprite, script) {
                var port = 0; // port value is dummy;
                var coodinate_x = script.getNumberValue('VALUE0');
                var coodinate_y = script.getNumberValue('VALUE1');
                var string = script.getValue('STRING');
                var text = [];

                if (!script.isStart) {
                    if (typeof string === 'string') {
                        for (var i = 0; i < string.length; i++) {
                            text[i] = string.charCodeAt(i);
                        }
                    } else if (typeof string === 'number') {
                        text[0] = 1;
                        text[1] = string / 1;
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

                    coodinate_x = Math.min(coodinate_x, 127);
                    coodinate_x = Math.max(coodinate_x, 0);
                    coodinate_y = Math.min(coodinate_y, 63);
                    coodinate_y = Math.max(coodinate_y, 0);

                    Entry.hw.sendQueue['SET'][port] = {
                        type: Entry.jikko.sensorTypes.OLED,
                        data: {
                            value0: coodinate_x,
                            value1: coodinate_y,
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
            syntax: { js: [], py: ['jikko.Module_digital_oled(%1, %2, %3)'] },
        },
        jikko_module_digital_bluetooth: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic',
            template: Lang.template.jikko_module_digital_bluetooth,
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
                type: 'jikko_module_digital_bluetooth',
            },
            paramsKeyMap: {
                STRING: 0,
            },
            class: 'jikkoBlue',
            isNotFor: ['jikko'],
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
                        type: Entry.jikko.sensorTypes.WRITE_BLUETOOTH,
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
            syntax: { js: [], py: ['jikko.module_digital_bluetooth(%1)'] },
        },
    };
};

module.exports = Entry.jikko;
