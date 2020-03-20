'use strict';

Entry.mkboard = {
    id: '6.1',
    name: 'mkboard',
    url: 'http://www.jkelec.co.kr',
    imageName: 'mkboard.png',
    title: {
        en: 'MakeBrick',
        ko: '메이크브릭',
    },
    setZero: function() {
        if (!Entry.hw.sendQueue.SET) {
            Entry.hw.sendQueue = {
                GET: {},
                SET: {},
            };
        } else {
            var keySet = Object.keys(Entry.hw.sendQueue.SET);
            keySet.forEach(function(key) {
                Entry.hw.sendQueue.SET[key].data = 0;
                Entry.hw.sendQueue.SET[key].time = new Date().getTime();
            });
        }
        Entry.hw.update();
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
    sensorTypes: {
        ALIVE: 0,
        DIGITAL: 1,
        ANALOG: 2,
        PWM: 3,
        SERVO_PIN: 4,
        TONE: 5,
        PULSEIN: 6,
        ULTRASONIC_1: 7,
        ULTRASONIC_2: 8,
        TIMER: 9,
        LCD: 10,  
        SEGMENT:11,
        OLED:12,
        MATRIX:13,
        NEOPIXEL:14,
        PMS5003:15,
        PMS5003_PM10:16,
        PMS5003_PM25:17,
        PMS5003_PM100:18,
        LSM303_ACCEL:19,
        LSM303_ACCEL_X:20,
        LSM303_ACCEL_Y:21,
        LSM303_ACCEL_Z:22,
        LSM303_COMPASS:23,
        ULTRASONIC_1_USE: 24,
        ULTRASONIC_2_USE: 25,
        UNKNOWN_SENSOR:99,          
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
    directionTable: {
        Forward: 0,
        Backward: 1,
    },
    highList: ['high', '1', 'on'],
    lowList: ['low', '0', 'off'],
    duration: {
        TIME_1ms: 1,
        TIME_5ms: 5,
        TIME_10ms: 10,
        TIME_20ms: 20,
        TIME_50ms: 50,
        TIME_100ms: 100,
        TIME_200ms: 200, 
        TIME_500ms: 500,    
        TIME_600ms: 600,   
    },    
    BlockState: {},
}; 

Entry.mkboard.setLanguage = function() {
    return {
        ko: {
            template: {
                "mkboard_digital_pwm": "디지털 %1 번 핀을 %2 (으)로 정하기 %3",
                "mkboard_get_analog_value": "아날로그 %1 번 센서값",
                "mkboard_get_analog_value_map": "%1 의 범위를 %2 ~ %3 에서 %4 ~ %5 로 바꾼값",
                "mkboard_get_digital": "디지털 %1 번 센서값",
                "mkboard_get_ultrasonic_1_use": "초음파센서 1번 Trig %1 Echo %2 시작 %3",
                "mkboard_get_ultrasonic_1_value": "초음파센서 1번 센서값",    
                "mkboard_get_ultrasonic_2_use": "초음파센서 2번 Trig %1 Echo %2 시작 %3",
                "mkboard_get_ultrasonic_2_value": "초음파센서 2번 센서값",
                "mkboard_set_servo": "디지털 %1 번 핀의 서보모터를 %2 의 각도로 정하기 %3",
                "mkboard_set_tone": "디지털 %1 번 핀의 버저를 %2 %3 음으로 %4 초 연주하기 %5",
                "mkboard_toggle_led": "디지털 %1 번 핀 %2 %3",
                "mkboard_lcd_print": "1602 LCD : 문자를 %1 행 %2 열에 %3 출력 %4",
                "mkboard_lcd_init": "1602 LCD : LCD를 %1 로 초기화 %2",
                "mkboard_lcd_command": "1602 LCD : LCD에 %1 명령어 수행 %2",
                "mkboard_segment_init": "FND : 디지털 CLK을 %1 DIO를 %2 로 설정 %3",
                "mkboard_segment_bright": "FND : 밝기를 %1 로 설정 하기 %2",
                "mkboard_segment_clear": "FND : 세그먼트 내용 지우기 %1",
                "mkboard_segment_value": "FND : 숫자 %1 를 소숫점 이하 %2로 출력 0 채움 %3 %4",
                "mkboard_oled_init": "OLED : OLED를 %1 로 초기화 %2",
                "mkboard_oled_clear": "OLED : OLED 내용 지우기 %1",
                "mkboard_oled_print": "OLED : %1 행, %2 열에 문자열 %3 출력 %4",
                "mkboard_oled_print_number": "OLED : %1 행 %2 열에 숫자 %3 를 소수점 이하 %4로 출력 %5",
                "mkboard_matrix_init": "매트릭스 : 총 개수 %1 매트릭스 Data %2 Clk %3 CS %4로 설정 %5",    
                "mkboard_matrix_bright": "매트릭스 : %1 매트릭스 밝기를 %2 로 설정 하기 %3",
                "mkboard_matrix_clear": "매트릭스 : %1 매트릭스 내용 지우기 %2",
                "mkboard_matrix_set": "매트릭스 : %1 매트릭스 %2행 %3열 위치 %4 %5",
                "mkboard_matrix_set_row": "매트릭스 : %1 매트릭스 %2행에 2진수 %3 출력 %4",
                "mkboard_matrix_set_col": "매트릭스 : %1 매트릭스 %2열에 2진수 %3 출력 %4",
                "mkboard_matrix_char": "매트릭스 : %1 문자 %2 출력 %3",
                "mkboard_neopixel_init": "네오픽셀(%1) : 디지털 %2 번 핀으로 설정(LED 개수 %3개) %4 로 설정",
                "mkboard_neopixel_set_rgb": "네오픽셀(RGB) : %1 번째 LED를 색상 (R:%2 G:%3 B:%4) %5",
                "mkboard_neopixel_set_rgbw": "네오픽셀(RGBW) : %1 번째 LED를 색상 (R:%2 G:%3 B:%4 W:%5) %6",
                "mkboard_neopixel_on": "네오픽셀 : 설정한 값으로 네오픽셀 %1 %2",
                "mkboard_pms5003_init": "먼지센서 : RX핀 %1 TX핀 %2로 설정 %3",
                "mkboard_pms5003_measure": "먼지센서 : 먼지 값 측정 시작하기 %1",
                "mkboard_pms5003_read": "먼지센서 : %1 먼지 값 읽오 오기 %2",
                "mkboard_lsm303_accel_init": "가속도센서 : 초기화 %1",
                "mkboard_lsm303_accel_measure": "가속도센서 : 가속도 값 측정 시작하기 %1",
                "mkboard_lsm303_accel_read": "가속도센서 : %1 축 가속도 값 읽기 %2",
                "mkboard_lsm303_compass_init": "나침반센서 : 초기화 %1",
                "mkboard_lsm303_compass_measure": "나침반센서 : 방위각 측정 시작하기 %1",
                "mkboard_lsm303_compass_read": "나침반센서 : 방위각 읽기 %1",               },
        },
        en: {
            template: {
                "mkboard_digital_pwm": "Digital %1 Pin %2 %3",
                "mkboard_get_analog_value": "Analog %1 Sensor value",
                "mkboard_get_analog_value_map": "Map Value %1 %2 ~ %3 to %4 ~ %5",
                "mkboard_get_digital": "Digital %1 Sensor value",
                "mkboard_get_ultrasonic_1_use": "Start ultrasonic 1 sensor trig pin %1 echo pin %2",
                "mkboard_get_ultrasonic_1_value": "Read ultrasonic 1 sensor value",        
                "mkboard_get_ultrasonic_2_use": "Start ultrasonic 2 sensor trig pin %1 echo pin %2",
                "mkboard_get_ultrasonic_2_value": "Read ultrasonic 2 sensor value",            
                "mkboard_set_servo": "Set servo pin %1 angle as %2 %3",
                "mkboard_set_tone": "Play tone pin %1 on note %2 octave %3 beat %4 %5",
                "mkboard_toggle_led": "Digital %1 Pin %2 %3",
                "mkboard_lcd_print": "1602 LCD : Print Row %1, Column %2, Value %3 %4",
                "mkboard_lcd_init": "1602 LCD : LCD initialize %1 %2",
                "mkboard_lcd_command": "1602 LCD : Execute %1 command %2",
                "mkboard_segment_init": "FND : Set digital CLK %1 DIO %2 %3",
                "mkboard_segment_bright": "FND : Set bright %1 %2",
                "mkboard_segment_clear": "FND : Clear all segment value %1",
                "mkboard_segment_value": "FND : Print number %1 point %2 fill zero %3 %4",
                "mkboard_oled_init": "OLED : Initialize OLED %1 %2",
                "mkboard_oled_clear": "OLED : Clear OLED %1",
                "mkboard_oled_print": "OLED : Row %1, Col %2 print string %3 %4",
                "mkboard_oled_print_number": "OLED : Row %1, Col %2 print number %3 point %4 %5",
                "mkboard_maxtrix_init": "Matrix : Count %1, Matrix initialize Data %2 Clk %3 CS %4 %5",
                "mkboard_maxtrix_set": "Matrix : No %1, Matrix set Row %2 Col %3 %4 %5",
                "mkboard_matrix_bright": "Matrix : No %1, Matrix Set bright %2 %3",
                "mkboard_matrix_clear": "Matrix : No %1, Matrix All clear %2",
                "mkboard_matrix_set_row": "Matrix : No %1, Matrix Row %2, Binary number %3 print %4",
                "mkboard_matrix_set_col": "Matrix : No %1, Matrix Column %2, Binary number %3 print %4",
                "mkboard_matrix_char": "Matrix : No %1, Matrix Char %2 print %3",    
                "mkboard_neopixel_init": "Nexpixel(%1) : Set Digital pin %2(LED count %3) %4",
                "mkboard_neopixel_set_rgb": "Nexpixel(RGB) : LED %1 Set color (R:%2 G:%3 B:%4) %5",
                "mkboard_neopixel_set_rgbw": "Nexpixel(RGBW) : LED %1 Set color (R:%2 G:%3 B:%4 W:%5) %6",
                "mkboard_neopixel_on": "Nexpixel : Nexpixel LED %1 %2",
                "mkboard_pms5003_init": "Dust Sensor : Set pin RX %1, TX %2 %3",
                "mkboard_pms5003_measure": "Dust Sensor : Sensor measure %1",
                "mkboard_pms5003_read": "Dust Sensor : Read %1 value %2",
                "mkboard_lsm303_accel_init": "Accelerometer : Initialize %1",
                "mkboard_lsm303_accel_measure": "Accelerometer : Sensor measure %1",
                "mkboard_lsm303_accel_read": "Accelerometer : Read %1 Axis %2",
                "mkboard_lsm303_compass_init": "Compass : Initialize %1",
                "mkboard_lsm303_compass_measure": "Compass : Sensor measure %1",
                "mkboard_lsm303_compass_read": "Compass : Read compass value %1",  
            },
        },
    };
};

Entry.mkboard.blockMenuBlocks = [
    // mkboard Added 2017-07-04
    'mkboard_get_analog_value',
    'mkboard_get_analog_value_map',
    'mkboard_get_digital',

    'mkboard_get_ultrasonic_1_use',
    'mkboard_get_ultrasonic_1_value',
    'mkboard_get_ultrasonic_2_use',
    'mkboard_get_ultrasonic_2_value',

    'mkboard_toggle_led',
    'mkboard_digital_pwm',
    'mkboard_set_servo',
    'mkboard_set_tone',

    'mkboard_lcd_init',
    'mkboard_lcd_command',
    'mkboard_lcd_print',

    'mkboard_segment_init',
    'mkboard_segment_bright',
    'mkboard_segment_clear',
    'mkboard_segment_value',

    'mkboard_oled_init',
    'mkboard_oled_clear',
    'mkboard_oled_print',
    'mkboard_oled_print_number',

    'mkboard_matrix_init',
    'mkboard_matrix_bright',
    'mkboard_matrix_clear',
    'mkboard_matrix_set',
    'mkboard_matrix_set_row',
    'mkboard_matrix_set_col',
    'mkboard_matrix_char',

    'mkboard_neopixel_init',
    'mkboard_neopixel_set_rgb',
    'mkboard_neopixel_set_rgbw',
    'mkboard_neopixel_on',


    'mkboard_pms5003_init',
    'mkboard_pms5003_measure',
    'mkboard_pms5003_read',

    'mkboard_lsm303_accel_init',
    'mkboard_lsm303_accel_measure',
    'mkboard_lsm303_accel_read',

    'mkboard_lsm303_compass_init',
    'mkboard_lsm303_compass_measure',
    'mkboard_lsm303_compass_read'

    // mkboard Added 2017-07-04
];
Entry.mkboard.getBlocks = function() {
    return {
        //region mkboard 몽키보드
        mkboard_analog_list: {
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
                        ['A6', '6'],
                        ['A7', '7'],
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
            syntax: { js: [], py: [] },
        },
        mkboard_get_analog_value: {
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
                        type: 'mkboard_analog_list',
                    },
                ],
                type: 'mkboard_get_analog_value',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'mkboardGet',
            isNotFor: ['mkboard'],
            func: function(sprite, script) {
                var port = script.getValue('PORT', script);
                var ANALOG = Entry.hw.portData.ANALOG;
                if (port[0] === 'A') port = port.substring(1);
                return ANALOG ? ANALOG[port] || 0 : 0;
            },
            syntax: { js: [], py: [] },
        },
        mkboard_get_analog_value_map: {
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
                        type: 'mkboard_get_analog_value',
                        params: [
                            {
                                type: 'mkboard_analog_list',
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
                type: 'mkboard_get_analog_value_map',
            },
            paramsKeyMap: {
                PORT: 0,
                VALUE2: 1,
                VALUE3: 2,
                VALUE4: 3,
                VALUE5: 4,
            },
            class: 'mkboardGet',
            isNotFor: ['mkboard'],
            func: function(sprite, script) {
                var result = script.getValue('PORT', script);
                var ANALOG = Entry.hw.portData.ANALOG;
                var value2 = script.getNumberValue('VALUE2', script);
                var value3 = script.getNumberValue('VALUE3', script);
                var value4 = script.getNumberValue('VALUE4', script);
                var value5 = script.getNumberValue('VALUE5', script);

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
            syntax: { js: [], py: [] },
        }, 
        mkboard_get_ultrasonic_1_use: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic',
            // template: Lang.template.mkboard_get_ultrasonic_1_use,
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
                        type: 'arduino_get_port_number',
                        params: ['6'],
                    },
                    {
                        type: 'arduino_get_port_number',
                        params: ['7'],
                    },
                ],
                type: 'mkboard_get_ultrasonic_1_use',
            },
            paramsKeyMap: {
                TRIG: 0,
                ECHO: 1,
            },
            class: 'mkboardUltrasound',
            isNotFor: ['mkboard'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var trig = script.getNumberValue('TRIG', script);
                var echo = script.getNumberValue('ECHO', script);
                //console.log("ULTRASONIC_1_USE");
                if (!script.isStart) 
                {
                    if (!Entry.hw.sendQueue['SET']) {
                        Entry.hw.sendQueue['SET'] = {};
                    }

                    var duration = Entry.mkboard.duration.TIME_500ms;
                    script.isStart = true;
                    script.timeFlag = 1;                    

                    sq['SET'][0] = {
                        type: Entry.mkboard.sensorTypes.ULTRASONIC_1_USE,
                        data: {
                            trig: trig,
                            echo: echo,
                        },
                        time: new Date().getTime(),
                    };

                    setTimeout(function() {
                        script.timeFlag = 0;
                    }, duration);
                    return script;
                }
                else if (script.timeFlag == 1) 
                {
                    return script;
                } 
                else 
                {
                    delete script.timeFlag;
                    delete script.isStart;

                    Entry.engine.isContinue = false;
                    return script.callReturn();
                }                
            },
            syntax: { js: [], py: [] },
        },        
        mkboard_get_ultrasonic_1_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            // template: Lang.template.mkboard_get_ultrasonic_1_value,
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
                params: [null],
                type: 'mkboard_get_ultrasonic_1_value',
            },
            //paramsKeyMap: {
            //    PORT1: 0,
            //    PORT2: 1,
            //},
            class: 'mkboardUltrasound',
            isNotFor: ['mkboard'],
            func: function(sprite, script) {
                //var port1 = script.getNumberValue('PORT1', script);
                //var port2 = script.getNumberValue('PORT2', script);

                /*
                if (!Entry.hw.sendQueue['SET']) {
                    Entry.hw.sendQueue['SET'] = {};
                }
                delete Entry.hw.sendQueue['SET'][0];
                delete Entry.hw.sendQueue['SET'][0];

                if (!Entry.hw.sendQueue['GET']) {
                    Entry.hw.sendQueue['GET'] = {};
                }
                Entry.hw.sendQueue['GET'][Entry.mkboard.sensorTypes.ULTRASONIC_1] = {
                    port: [0, 0],
                    time: new Date().getTime(),
                };
                return Entry.hw.portData.ULTRASONIC_1 || 0;
                */
                return Entry.hw.portData.ULTRASONIC_1 || 0;
            },
            syntax: { js: [], py: [] },
        },
        mkboard_get_ultrasonic_2_use: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic',
            // template: Lang.template.mkboard_get_ultrasonic_2_use,
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
                        type: 'arduino_get_port_number',
                        params: ['5'],
                    },
                    {
                        type: 'arduino_get_port_number',
                        params: ['4'],
                    },
                ],
                type: 'mkboard_get_ultrasonic_2_use',
            },
            paramsKeyMap: {
                TRIG: 0,
                ECHO: 1,
            },
            class: 'mkboardUltrasound',
            isNotFor: ['mkboard'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var trig = script.getNumberValue('TRIG', script);
                var echo = script.getNumberValue('ECHO', script);
                //console.log("ULTRASONIC_2_USE");
                if (!script.isStart) 
                {
                    if (!Entry.hw.sendQueue['SET']) {
                        Entry.hw.sendQueue['SET'] = {};
                    }

                    var duration = Entry.mkboard.duration.TIME_500ms;
                    script.isStart = true;
                    script.timeFlag = 1;                    

                    sq['SET'][0] = {
                        type: Entry.mkboard.sensorTypes.ULTRASONIC_2_USE,
                        data: {
                            trig: trig,
                            echo: echo,
                        },
                        time: new Date().getTime(),
                    };

                    setTimeout(function() {
                        script.timeFlag = 0;
                    }, duration);
                    return script;
                }
                else if (script.timeFlag == 1) 
                {
                    return script;
                } 
                else 
                {
                    delete script.timeFlag;
                    delete script.isStart;

                    Entry.engine.isContinue = false;
                    return script.callReturn();
                }                
            },
            syntax: { js: [], py: [] },
        },        
        mkboard_get_ultrasonic_2_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            // template: Lang.template.mkboard_get_ultrasonic_2_value,
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
                params: [null],
                type: 'mkboard_get_ultrasonic_2_value',
            },
            //paramsKeyMap: {
            //    PORT1: 0,
            //    PORT2: 1,
            //},
            class: 'mkboardUltrasound',
            isNotFor: ['mkboard'],
            func: function(sprite, script) {
                //var port1 = script.getNumberValue('PORT1', script);
                //var port2 = script.getNumberValue('PORT2', script);

                /*
                if (!Entry.hw.sendQueue['SET']) {
                    Entry.hw.sendQueue['SET'] = {};
                }
                delete Entry.hw.sendQueue['SET'][0];
                delete Entry.hw.sendQueue['SET'][0];

                if (!Entry.hw.sendQueue['GET']) {
                    Entry.hw.sendQueue['GET'] = {};
                }
                Entry.hw.sendQueue['GET'][Entry.mkboard.sensorTypes.ULTRASONIC_2] = {
                    port: [0, 0],
                    time: new Date().getTime(),
                };
                return Entry.hw.portData.ULTRASONIC_2 || 0;
                */
                return Entry.hw.portData.ULTRASONIC_2 || 0;
            },
            syntax: { js: [], py: [] },
        },
        mkboard_get_digital: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
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
                        type: 'arduino_get_port_number',
                    },
                ],
                type: 'mkboard_get_digital',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'mkboardGet',
            isNotFor: ['mkboard'],
            func: function(sprite, script) {
                var port = script.getNumberValue('PORT', script);
                var DIGITAL = Entry.hw.portData.DIGITAL;
                if (!Entry.hw.sendQueue['GET']) {
                    Entry.hw.sendQueue['GET'] = {};
                }
                Entry.hw.sendQueue['GET'][Entry.mkboard.sensorTypes.DIGITAL] = {
                    port: port,
                    time: new Date().getTime(),
                };
                return DIGITAL ? DIGITAL[port] || 0 : 0;
            },
            syntax: { js: [], py: [] },
        },
        mkboard_toggle_led: {
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
                        type: 'arduino_get_port_number',
                    },
                    {
                        type: 'arduino_get_digital_toggle',
                        params: ['on'],
                    },
                    null,
                ],
                type: 'mkboard_toggle_led',
            },
            paramsKeyMap: {
                PORT: 0,
                VALUE: 1,
            },
            class: 'mkboard',
            isNotFor: ['mkboard'],
            func: function(sprite, script) {
                var port = script.getNumberValue('PORT');
                var value = script.getValue('VALUE');

                if (typeof value === 'string') {
                    value = value.toLowerCase();
                }
                if (Entry.mkboard.highList.indexOf(value) > -1) {
                    value = 255;
                } else if (Entry.mkboard.lowList.indexOf(value) > -1) {
                    value = 0;
                } else {
                    throw new Error();
                }
                if (!Entry.hw.sendQueue['SET']) {
                    Entry.hw.sendQueue['SET'] = {};
                }
                Entry.hw.sendQueue['SET'][port] = {
                    type: Entry.mkboard.sensorTypes.DIGITAL,
                    data: value,
                    time: new Date().getTime(),
                };
                return script.callReturn();
            },
            syntax: { js: [], py: [] },
        },
        mkboard_digital_pwm: {
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
                        type: 'arduino_get_pwm_port_number',
                    },
                    {
                        type: 'text',
                        params: ['255'],
                    },
                    null,
                ],
                type: 'mkboard_digital_pwm',
            },
            paramsKeyMap: {
                PORT: 0,
                VALUE: 1,
            },
            class: 'mkboard',
            isNotFor: ['mkboard'],
            func: function(sprite, script) {
                var port = script.getNumberValue('PORT');
                var value = script.getNumberValue('VALUE');
                value = Math.round(value);
                value = Math.max(value, 0);
                value = Math.min(value, 255);
                if (!Entry.hw.sendQueue['SET']) {
                    Entry.hw.sendQueue['SET'] = {};
                }
                Entry.hw.sendQueue['SET'][port] = {
                    type: Entry.mkboard.sensorTypes.PWM,
                    data: value,
                    time: new Date().getTime(),
                };
                return script.callReturn();
            },
            syntax: { js: [], py: [] },
        },
        mkboard_tone_list: {
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
            syntax: { js: [], py: [] },
        },
        mkboard_tone_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
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
                        type: 'mkboard_tone_list',
                    },
                ],
                type: 'mkboard_tone_value',
            },
            paramsKeyMap: {
                NOTE: 0,
            },
            func: function(sprite, script) {
                return script.getNumberValue('NOTE');
            },
            syntax: { js: [], py: [] },
        },
        mkboard_octave_list: {
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
            syntax: { js: [], py: [] },
        },
        mkboard_set_tone: {
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
                        type: 'arduino_get_port_number',
                        value: 4,
                        params: ['11'],
                    },
                    {
                        type: 'mkboard_tone_list',
                    },
                    {
                        type: 'mkboard_octave_list',
                    },
                    {
                        type: 'text',
                        params: ['1'],
                    },
                    null,
                ],
                type: 'mkboard_set_tone',
            },
            paramsKeyMap: {
                PORT: 0,
                NOTE: 1,
                OCTAVE: 2,
                DURATION: 3,
            },
            class: 'mkboard',
            isNotFor: ['mkboard'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var port = script.getNumberValue('PORT', script);

                if (!script.isStart) 
                {
                    var note = script.getValue('NOTE', script);
                    if (!Entry.Utils.isNumber(note)) note = Entry.mkboard.toneTable[note];

                    if (note < 0) {
                        note = 0;
                    } else if (note > 12) {
                        note = 12;
                    }

                    var duration = script.getNumberValue('DURATION', script);

                    if (duration < 0) {
                        duration = 0;
                    }

                    if (!sq['SET']) {
                        sq['SET'] = {};
                    }

                    if (duration === 0) {
                        sq['SET'][port] = {
                            type: Entry.mkboard.sensorTypes.TONE,
                            data: 0,
                            time: new Date().getTime(),
                        };
                        return script.callReturn();
                    }

                    var octave = script.getNumberValue('OCTAVE', script) - 1;
                    if (octave < 0) {
                        octave = 0;
                    } else if (octave > 5) {
                        octave = 5;
                    }

                    var value = 0;

                    if (note != 0) {
                        value = Entry.mkboard.toneMap[note][octave];
                    }

                    duration = duration * 1000;
                    script.isStart = true;
                    script.timeFlag = 1;

                    sq['SET'][port] = {
                        type: Entry.mkboard.sensorTypes.TONE,
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
                } 
                else if (script.timeFlag == 1) 
                {
                    return script;
                } 
                else 
                {
                    delete script.timeFlag;
                    delete script.isStart;
                    sq['SET'][port] = {
                        type: Entry.mkboard.sensorTypes.TONE,
                        data: 0,
                        time: new Date().getTime(),
                    };
                    Entry.engine.isContinue = false;
                    return script.callReturn();
                }
            },
            syntax: { js: [], py: [] },
        },
        mkboard_set_servo: {
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
                        type: 'arduino_get_port_number',
                        params: ['10'],
                    },
                    null,
                ],
                type: 'mkboard_set_servo',
            },
            paramsKeyMap: {
                PORT: 0,
                VALUE: 1,
            },
            class: 'mkboard',
            isNotFor: ['mkboard'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var port = script.getNumberValue('PORT', script);
                var value = script.getNumberValue('VALUE', script);
                value = Math.min(360, value);
                value = Math.max(0, value);

                if (!sq['SET']) {
                    sq['SET'] = {};
                }
                sq['SET'][port] = {
                    type: Entry.mkboard.sensorTypes.SERVO_PIN,
                    data: value,
                    time: new Date().getTime(),
                };

                return script.callReturn();
            },
            syntax: { js: [], py: [] },
        },
        mkboard_list_digital_lcd_line: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [['LINE1', '0'], ['LINE2', '1']],
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
        mkboard_list_digital_lcd_column: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['COL1', '0'],
                        ['COL2', '1'],
                        ['COL3', '2'],
                        ['COL4', '3'],
                        ['COL5', '4'],
                        ['COL6', '5'],
                        ['COL7', '6'],
                        ['COL8', '7'],
                        ['COL9', '8'],
                        ['COL10', '9'],
                        ['COL11', '10'],
                        ['COL12', '11'],
                        ['COL13', '12'],
                        ['COL14', '13'],
                        ['COL15', '14'],
                        ['COL16', '15'],
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
                COLUMN: 0,
            },
            func: function(sprite, script) {
                return script.getField('COLUMN');
            },
        },

        mkboard_list_lcd_init: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['0x20', '0x20'],
                        ['0x27', '0x27'],
                        ['0x3f', '0x3f']
                    ],
                    value: '0x27',
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
                LCD_INIT: 0,
            },
            func: function(sprite, script) {
                return script.getField('LCD_INIT');
            },
        },

        mkboard_list_lcd_command: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['LCD_CLEAR', '0']
                        /*,
                        [ "BACKLIGHT_ON", "3" ],
                        [ "BACKLIGHT_OFF", "4" ]
                        */
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
                LCD_COMMAND: 0,
            },
            func: function(sprite, script) {
                return script.getField('LCD_COMMAND');
            },
        },

        mkboard_lcd_init: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            // template: Lang.template.mkboard_lcd_init,
            //"template": "%1 %2",
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
                        type: 'mkboard_list_lcd_init',
                        params: ['0x27'],
                    },
                    null,
                ],
                type: 'mkboard_lcd_init',
            },
            paramsKeyMap: {
                LCD_INIT: 0,
            },
            class: 'mkboardLcd',
            isNotFor: ['mkboard'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var value = script.getNumberValue('LCD_INIT', script);
                //var value = script.getValue('LCD_INIT', script);

                //console.log("LCD_INIT=");
                //console.log(value);
                if (!script.isStart) 
                {
                    if (!Entry.hw.sendQueue['SET']) {
                        Entry.hw.sendQueue['SET'] = {};
                    }

                    var duration = Entry.mkboard.duration.TIME_500ms;
                    script.isStart = true;
                    script.timeFlag = 1;                    

                    sq['SET'][0] = {
                        type: Entry.mkboard.sensorTypes.LCD,
                        data: {
                            cmd: 0,
                            value: value,
                        },
                        time: new Date().getTime(),
                    };

                    setTimeout(function() {
                        script.timeFlag = 0;
                    }, duration);
                    return script;
                }
                else if (script.timeFlag == 1) 
                {
                    return script;
                } 
                else 
                {
                    delete script.timeFlag;
                    delete script.isStart;

                    Entry.engine.isContinue = false;
                    return script.callReturn();
                }                
            },
            syntax: { js: [], py: ['mkboard.mkboard_lcd_init(%1)'] },
        },        
                          
        mkboard_lcd_command: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            // template: Lang.template.mkboard_lcd_command,
            //"template": "%1 %2",
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
                        type: 'mkboard_list_lcd_command',
                    },
                    null,
                ],
                type: 'mkboard_lcd_command',
            },
            paramsKeyMap: {
                LCD_COMMAND: 0,
            },
            class: 'mkboardLcd',
            isNotFor: ['mkboard'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var value = script.getNumberValue('LCD_COMMAND', script);

                if (!script.isStart) 
                {
                    if (!Entry.hw.sendQueue['SET']) {
                        Entry.hw.sendQueue['SET'] = {};
                    }

                    var duration = Entry.mkboard.duration.TIME_100ms;
                    script.isStart = true;
                    script.timeFlag = 1;    

                    sq['SET'][0] = {
                        type: Entry.mkboard.sensorTypes.LCD,
                        data: {
                            cmd: 1,
                            value: value,
                        },
                        time: new Date().getTime(),
                    };

                    setTimeout(function() {
                        script.timeFlag = 0;
                    }, duration);
                    return script;                    
                }
                else if (script.timeFlag == 1) 
                {
                    return script;
                } 
                else 
                {
                    delete script.timeFlag;
                    delete script.isStart;

                    Entry.engine.isContinue = false;
                    return script.callReturn();
                }
            },
            syntax: { js: [], py: ['mkboard.mkboard_lcd_command(%1)'] },
        },

        mkboard_lcd_print: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic',
            // template: Lang.template.mkboard_lcd_print,
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
                        type: 'mkboard_list_digital_lcd_line',
                        params: ['0'],
                    },
                    {
                        type: 'mkboard_list_digital_lcd_column',
                        params: ['0'],
                    },
                    {
                        type: 'text',
                        params: ['Type text !!'],
                    },
                    null,
                ],
                type: 'mkboard_lcd_print',
            },
            paramsKeyMap: {
                LINE: 0,
                COLUMN: 1,
                STRING: 2,
            },
            class: 'mkboardLcd',
            isNotFor: ['mkboard'],
            func: function(sprite, script) {
                var line = script.getValue('LINE', script);
                var column = script.getValue('COLUMN', script);
                var string = script.getValue('STRING', script);
                var text = [];

                if (!script.isStart) 
                {
                    if (typeof string === 'string') 
                    {
                        for (var i = 0; i < string.length; i++) {
                            text[i] = Entry.mkboard.toByte(string[i]);
                        }
                    } 
                    else if (typeof string === 'number') 
                    {
                        //console.log("string");
                        //console.log(string);
                        var num_to_string = string.toString();
                        for (var i = 0; i < num_to_string.length; i++) {
                            text[i] = Entry.mkboard.toByte(num_to_string[i]);
                        }
                        //console.log("num_to_string");
                        //console.log(num_to_string);
                        //text[0] = 1;
                        //text[1] = string / 1;
                    } 
                    else 
                    {
                        text[0] = string;
                    }

                    if (!Entry.hw.sendQueue['SET']) {
                        Entry.hw.sendQueue['SET'] = {};
                    }

                    script.isStart = true;
                    script.timeFlag = 1;
                    //var fps = Entry.FPS || 60;
                    //var timeValue = 60 / fps * 50;
                    var duration = Entry.mkboard.duration.TIME_100ms;

                    Entry.hw.sendQueue['SET'][1] = {
                        type: Entry.mkboard.sensorTypes.LCD,
                        data: {
                            cmd: 2,
                            line: line,
                            column: column,
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
                    }, duration);
                    return script;
                } else if (script.timeFlag == 1) 
                {
                    return script;
                } 
                else 
                {
                    delete script.timeFlag;
                    delete script.isStart;
                    Entry.engine.isContinue = false;
                    return script.callReturn();
                }
            },
            syntax: { js: [], py: ['mkboard.mkboard_lcd_print(%1, %2, %3)'] },
        },        

       mkboard_list_segment_bright: {
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
                        ['5', '5']
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
                BRIGHT: 0,
            },
            func: function(sprite, script) {
                return script.getField('BRIGHT');
            },
        },              

        mkboard_list_segment_comma: {
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
                SEGMENT_COMMA: 0,
            },
            func: function(sprite, script) {
                return script.getField('SEGMENT_COMMA');
            },
        },        

        mkboard_segment_init: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic',
            // template: Lang.template.mkboard_segment_init,
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
                        type: 'arduino_get_port_number',
                        params: ['6'],
                    },
                    {
                        type: 'arduino_get_port_number',
                        params: ['7'],
                    },
                    null,
                ],
                type: 'mkboard_segment_init',
            },
            paramsKeyMap: {
                PORT_CLK: 0,
                PORT_DIO: 1,
            },
            class: 'mkboardSegment',
            isNotFor: ['mkboard'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;

                var port_clk = script.getNumberValue('PORT_CLK', script);
                var port_dio = script.getNumberValue('PORT_DIO', script);


                if (!script.isStart) 
                {
                    if (!Entry.hw.sendQueue['SET']) {
                        Entry.hw.sendQueue['SET'] = {};
                    }

                    var duration = Entry.mkboard.duration.TIME_500ms;
                    script.isStart = true;
                    script.timeFlag = 1; 

                    Entry.hw.sendQueue['SET'][0] = {
                        type: Entry.mkboard.sensorTypes.SEGMENT,
                        data: {
                                cmd: 0,  // 포트설정
                                port_clk: port_clk,
                                port_dio: port_dio,
                            },
                        time: new Date().getTime(),
                    };
                    setTimeout(function() {
                        script.timeFlag = 0;
                    }, duration);
                    return script; 
                }
                else if (script.timeFlag == 1) 
                {
                    return script;
                } 
                else 
                {
                    delete script.timeFlag;
                    delete script.isStart;

                    Entry.engine.isContinue = false;
                    return script.callReturn();
                }                
            },
            syntax: { js: [], py: ['mkboard.mkboard_segment_init(%1, %2)'] },
        },        

        mkboard_segment_bright: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic',
            // template: Lang.template.mkboard_segment_bright,
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
                        type: 'mkboard_list_segment_bright',
                        params: ['3'],
                    },
                    null,
                ],
                type: 'mkboard_segment_bright',
            },
            paramsKeyMap: {
                BRIGHT: 0,
            },
            class: 'mkboardSegment',
            isNotFor: ['mkboard'],
            func: function(sprite, script) {

                var bright = script.getNumberValue('BRIGHT', script);

                if (!script.isStart) 
                {
                    if (!Entry.hw.sendQueue['SET']) {
                        Entry.hw.sendQueue['SET'] = {};
                    }

                    var duration = Entry.mkboard.duration.TIME_200ms;
                    script.isStart = true;
                    script.timeFlag = 1;    

                    Entry.hw.sendQueue['SET'][0] = {
                        type: Entry.mkboard.sensorTypes.SEGMENT,
                        data: {
                                cmd: 1,  // 밝기설정
                                bright: bright,
                            },
                        time: new Date().getTime(),
                    };
                    setTimeout(function() {
                        script.timeFlag = 0;
                    }, duration);
                    return script;                    
                }
                else if (script.timeFlag == 1) 
                {
                    return script;
                } 
                else 
                {
                    delete script.timeFlag;
                    delete script.isStart;

                    Entry.engine.isContinue = false;
                    return script.callReturn();
                }
            },
            syntax: { js: [], py: ['mkboard.mkboard_segment_bright(%1)'] },
        },             

        mkboard_segment_clear: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic',
            // template: Lang.template.mkboard_segment_clear,
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
                params: [null],
                type: 'mkboard_segment_clear',
            },
            //paramsKeyMap: {
            //    PORT_RX: 0,
            //    PORT_TX: 1,
            //},
            class: 'mkboardSegment',
            isNotFor: ['mkboard'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;

                if (!script.isStart) 
                {
                    if (!Entry.hw.sendQueue['SET']) {
                        Entry.hw.sendQueue['SET'] = {};
                    }

                    var duration = Entry.mkboard.duration.TIME_200ms;
                    script.isStart = true;
                    script.timeFlag = 1;  

                    Entry.hw.sendQueue['SET'][0] = {
                        type: Entry.mkboard.sensorTypes.SEGMENT,
                        data: {
                                cmd: 3,  // Segment Clear
                            },
                        time: new Date().getTime(),
                    };
                    setTimeout(function() {
                        script.timeFlag = 0;
                    }, duration );
                    return script;                    
                }
                else if (script.timeFlag == 1) 
                {
                    return script;
                } 
                else 
                {
                    delete script.timeFlag;
                    delete script.isStart;

                    Entry.engine.isContinue = false;
                    return script.callReturn();
                }
            },
            syntax: { js: [], py: ['mkboard.mkboard_segment_clear()'] },
        },          

        mkboard_segment_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic',
            // template: Lang.template.mkboard_segment_value,
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
                        type: 'number',
                        params: ['888'],
                    },
                    {
                        type: 'mkboard_list_segment_comma',
                        params: ['0'],
                    },                    
                    {
                        type: 'arduino_get_digital_toggle',
                        params: ['off'],
                    },                    
                    null,
                ],
                type: 'mkboard_segment_value',
            },
            paramsKeyMap: {
                NUMBER: 0,
                SEGMENT_COMMA: 1,
                ON_OFF: 2,
            },
            class: 'mkboardSegment',
            isNotFor: ['mkboard'],
            func: function(sprite, script) {
                var number = script.getNumberValue('NUMBER');                
                var segment_comma = script.getNumberValue('SEGMENT_COMMA');
                var on_off = script.getValue('ON_OFF');

                number = Math.round(number);
                number = Math.max(number, 0);
                number = Math.min(number, 999);

                if (typeof on_off === 'string') {
                    on_off = on_off.toLowerCase();
                }
                if (Entry.mkboard.highList.indexOf(on_off) > -1) {
                    on_off = 1;
                } else if (Entry.mkboard.lowList.indexOf(on_off) > -1) {
                    on_off = 0;
                } else {
                    throw new Error();
                }                     

                if (!script.isStart) 
                {
                    if (!Entry.hw.sendQueue['SET']) {
                        Entry.hw.sendQueue['SET'] = {};
                    }

                    var duration = Entry.mkboard.duration.TIME_100ms;
                    script.isStart = true;
                    script.timeFlag = 1;                     

                    Entry.hw.sendQueue['SET'][0] = {
                        type: Entry.mkboard.sensorTypes.SEGMENT,
                        data: {
                                cmd: 2,  // 데이터출력
                                number: number,
                                segment_comma : segment_comma,
                                on_off: on_off,
                            },
                        time: new Date().getTime(),
                    };


                    setTimeout(function() {
                        script.timeFlag = 0;
                    }, duration);
                    return script;                    
                }
                else if (script.timeFlag == 1) 
                {
                    return script;
                } 
                else 
                {
                    delete script.timeFlag;
                    delete script.isStart;

                    Entry.engine.isContinue = false;
                    return script.callReturn();
                }
            },
            syntax: { js: [], py: ['mkboard.mkboard_segment_value(%1, %2, %3)'] },
        },               

        mkboard_list_oled_comma: {
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
                        ['2', '2']
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
                OLED_COMMA: 0,
            },
            func: function(sprite, script) {
                return script.getField('OLED_COMMA');
            },
        },               

        mkboard_oled_init: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            // template: Lang.template.mkboard_oled_init,
            //"template": "%1 %2",
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
                        type: 'number',
                        params: ['0x3C'],
                    },
                    null,
                ],
                type: 'mkboard_oled_init',
            },
            paramsKeyMap: {
                OLED_INIT: 0,
            },
            class: 'mkboardOled',
            isNotFor: ['mkboard'],
            func: function(sprite, script) {

                var oled_init = script.getNumberValue('OLED_INIT', script);

                if (!script.isStart) 
                {
                    if (!Entry.hw.sendQueue['SET']) {
                        Entry.hw.sendQueue['SET'] = {};
                    }

                    var duration = Entry.mkboard.duration.TIME_500ms;
                    script.isStart = true;
                    script.timeFlag = 1;    

                    Entry.hw.sendQueue['SET'][0] = {
                        type: Entry.mkboard.sensorTypes.OLED,
                        data: {
                                cmd: 0,  // OLED Initialize
                                oled_init: oled_init,
                            },
                        time: new Date().getTime(),
                    };
                    setTimeout(function() {
                        script.timeFlag = 0;
                    }, duration);
                    return script;                    
                }
                else if (script.timeFlag == 1) 
                {
                    return script;
                } 
                else 
                {
                    delete script.timeFlag;
                    delete script.isStart;

                    Entry.engine.isContinue = false;
                    return script.callReturn();
                }
            },
            syntax: { js: [], py: ['mkboard.mkboard_oled_init(%)'] },
        },           


        mkboard_oled_clear: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic',
            // template: Lang.template.mkboard_oled_clear,
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
                params: [null],
                type: 'mkboard_oled_clear',
            },
            //paramsKeyMap: {
            //    PORT_RX: 0,
            //    PORT_TX: 1,
            //}, 
            class: 'mkboardOled',
            isNotFor: ['mkboard'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;

                if (!script.isStart) 
                {
                    if (!Entry.hw.sendQueue['SET']) {
                        Entry.hw.sendQueue['SET'] = {};
                    }

                    var duration = Entry.mkboard.duration.TIME_200ms;
                    script.isStart = true;
                    script.timeFlag = 1;  

                    Entry.hw.sendQueue['SET'][0] = {
                        type: Entry.mkboard.sensorTypes.OLED,
                        data: {
                                cmd: 3,  // OLED Clear
                            },
                        time: new Date().getTime(),
                    };
                    setTimeout(function() {
                        script.timeFlag = 0;
                    }, duration );
                    return script;                    
                }
                else if (script.timeFlag == 1) 
                {
                    return script;
                } 
                else 
                {
                    delete script.timeFlag;
                    delete script.isStart;

                    Entry.engine.isContinue = false;
                    return script.callReturn();
                }
            },
            syntax: { js: [], py: ['mkboard.mkboard_oled_clear()'] },
        },          


        mkboard_oled_print: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic',
            // template: Lang.template.mkboard_oled_print,
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
                        type: 'number',
                        params: ['0'],
                    },
                     {
                        type: 'number',
                        params: ['0'],
                    },
                    {
                        type: 'text',
                        params: ['Type text !!'],
                    },
                    null,
                ],
                type: 'mkboard_oled_print',
            },
            paramsKeyMap: {
                LINE: 0, 
                COLUMN: 1,
                STRING: 2,
            },
            class: 'mkboardOled',
            isNotFor: ['mkboard'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;

                var line = script.getNumberValue('LINE', script);
                var column = script.getNumberValue('COLUMN', script);
                var string = script.getValue('STRING', script);
                var text = [];

                if (!script.isStart) 
                {
                    line = Math.min(5, line);
                    line = Math.max(0, line);

                    column = Math.min(20, column);
                    column = Math.max(0, column);                    

                    if (typeof string === 'string') 
                    {
                        for (var i = 0; i < string.length; i++) {
                            text[i] = Entry.mkboard.toByte(string[i]);
                        }
                    } 
                    else if (typeof string === 'number') 
                    {
                        //console.log("string");
                        //console.log(string);
                        var num_to_string = string.toString();
                        for (var i = 0; i < num_to_string.length; i++) {
                            text[i] = Entry.mkboard.toByte(num_to_string[i]);
                        }
                        //console.log("num_to_string");
                        //console.log(num_to_string);
                        //text[0] = 1;
                        //text[1] = string / 1;
                    } 
                    else 
                    {
                        text[0] = string;
                    }

                    if (!Entry.hw.sendQueue['SET']) {
                        Entry.hw.sendQueue['SET'] = {};
                    }

                    var duration = Entry.mkboard.duration.TIME_200ms;
                    script.isStart = true;
                    script.timeFlag = 1;    

                    Entry.hw.sendQueue['SET'][0] = {
                        type: Entry.mkboard.sensorTypes.OLED,
                        data: {
                            cmd: 1,
                            line: line,
                            column: column,
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
                    }, duration );
                    return script;                    
                }
                else if (script.timeFlag == 1) 
                {
                    return script;
                } 
                else 
                {
                    delete script.timeFlag;
                    delete script.isStart;

                    Entry.engine.isContinue = false;
                    return script.callReturn();
                }
            },
            syntax: { js: [], py: ['mkboard.mkboard_oled_print(%1, %2, %3)'] },
        },

        mkboard_oled_print_number: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic',
            // template: Lang.template.mkboard_oled_print_number,
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
                        params: ['0'],
                    },
                    {
                        type: 'number',
                        params: ['0'],
                    },
                     {
                        type: 'number',
                        params: ['999'],
                    },
                    {
                        type: 'mkboard_list_oled_comma',
                        params: ['1'],
                    },                 
                    null,
                ],
                type: 'mkboard_oled_print_number',
            },
            paramsKeyMap: {
                LINE: 0,
                COLUMN: 1,
                NUMBER: 2,
                OLED_COMMA: 3,
            },
            class: 'mkboardOled',
            isNotFor: ['mkboard'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;

                var line = script.getNumberValue('LINE', script);
                var column = script.getNumberValue('COLUMN', script);
                var number = script.getNumberValue('NUMBER', script);
                var oled_comma = script.getNumberValue('OLED_COMMA', script);

                if (!script.isStart) 
                {
                    line = Math.min(5, line);
                    line = Math.max(0, line);

                    column = Math.min(20, column);
                    column = Math.max(0, column);   

                    number = Math.round(number);
                    number = Math.max(number, 0);
                    number = Math.min(number, 65535);

                    if (!Entry.hw.sendQueue['SET']) {
                        Entry.hw.sendQueue['SET'] = {};
                    }

                    var duration = Entry.mkboard.duration.TIME_200ms;
                    script.isStart = true;
                    script.timeFlag = 1;   

                    Entry.hw.sendQueue['SET'][0] = {
                        type: Entry.mkboard.sensorTypes.OLED,
                        data: {
                                cmd: 2,  // 데이터출력
                                line: line,
                                column : column,
                                number: number,
                                oled_comma: oled_comma,
                            },
                        time: new Date().getTime(),
                    };     
                    setTimeout(function() {
                        script.timeFlag = 0;
                    }, duration );
                    return script;                    
                }
                else if (script.timeFlag == 1) 
                {
                    return script;
                } 
                else 
                {
                    delete script.timeFlag;
                    delete script.isStart;

                    Entry.engine.isContinue = false;
                    return script.callReturn();
                }                          
            },
            syntax: { js: [], py: ['mkboard.mkboard_oled_print_number(%1, %2, %3, %4)'] },
        },

        mkboard_matrix_count_list: {
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
                MATRIX_NUM: 0,
            },
            func: function(sprite, script) {
                return script.getField('MATRIX_NUM');
            },
            syntax: { js: [], py: [] },
        },        

       mkboard_list_matrix_bright: {
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
                        ['9', '9'],
                        ['10', '10'],
                        ['11', '11'],
                        ['12', '12'],
                        ['13', '13'],
                        ['14', '14'],
                        ['15', '15'],
                    ],
                    value: '7',
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
                BRIGHT: 0,
            },
            func: function(sprite, script) {
                return script.getField('BRIGHT');
            },
        },                  

        mkboard_matrix_init: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic',
            // template: Lang.template.mkboard_matrix_init, 
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
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'mkboard_matrix_count_list',
                        params: ['1'],
                    },                   
                    {
                        type: 'arduino_get_port_number',
                        params: ['10'],
                    },
                    {
                        type: 'arduino_get_port_number',
                        params: ['11'],
                    },
                    {
                        type: 'arduino_get_port_number',
                        params: ['9'],
                    }, 
                    null,
                ],
                type: 'mkboard_matrix_init',
            },
            paramsKeyMap: {
                MATRIX_NUM: 0,
                PORT_DATA: 1,
                PORT_CLK: 2,
                PORT_CS: 3,
            },
            class: 'mkboardMatrix',
            isNotFor: ['mkboard'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue; 

                var matrix_num = script.getValue('MATRIX_NUM', script);
                var port_data = script.getValue('PORT_DATA', script);
                var port_clk = script.getValue('PORT_CLK', script);
                var port_cs = script.getValue('PORT_CS', script);

                if (!script.isStart) 
                {
                    if (!Entry.hw.sendQueue['SET']) {
                        Entry.hw.sendQueue['SET'] = {};
                    }

                    var duration = Entry.mkboard.duration.TIME_200ms;
                    script.isStart = true;
                    script.timeFlag = 1;    

                    Entry.hw.sendQueue['SET'][0] = {
                        type: Entry.mkboard.sensorTypes.MATRIX,
                        data: {
                                cmd: 0,  // 포트설정
                                matrix_num: matrix_num,
                                port_data: port_data,
                                port_clk: port_clk,
                                port_cs: port_cs,
                            },
                        time: new Date().getTime(),
                    };
                    setTimeout(function() {
                        script.timeFlag = 0;
                    }, duration );
                    return script;                    
                }
                else if (script.timeFlag == 1) 
                {
                    return script;
                } 
                else 
                {
                    delete script.timeFlag;
                    delete script.isStart;

                    Entry.engine.isContinue = false;
                    return script.callReturn();
                }
            },
            syntax: { js: [], py: ['mkboard.mkboard_matrix_init(%1, %2, %3, %4)'] },
        },  

        mkboard_matrix_bright: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic',
            // template: Lang.template.mkboard_matrix_bright,
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
                        type: 'mkboard_matrix_count_list',
                        params: ['1'],
                    },                   
                    {
                        type: 'mkboard_list_matrix_bright',
                        params: ['7'],
                    },
                    null,
                ],
                type: 'mkboard_matrix_bright',
            },
            paramsKeyMap: {
                MATRIX_NUM: 0,
                BRIGHT: 0,
            },
            class: 'mkboardMatrix',
            isNotFor: ['mkboard'],
            func: function(sprite, script) {

                var matrix_num = script.getValue('MATRIX_NUM', script);
                var bright = script.getValue('BRIGHT', script);

                if (!script.isStart) 
                {
                    if (!Entry.hw.sendQueue['SET']) {
                        Entry.hw.sendQueue['SET'] = {};
                    }

                    var duration = Entry.mkboard.duration.TIME_200ms;
                    script.isStart = true;
                    script.timeFlag = 1;    

                    Entry.hw.sendQueue['SET'][0] = {
                        type: Entry.mkboard.sensorTypes.MATRIX,
                        data: {
                                cmd: 1,  // 밝기설정
                                matrix_num: matrix_num,
                                bright: bright,
                            },
                        time: new Date().getTime(),
                    };
                    setTimeout(function() {
                        script.timeFlag = 0;
                    }, duration);
                    return script;                    
                }
                else if (script.timeFlag == 1) 
                {
                    return script;
                } 
                else 
                {
                    delete script.timeFlag;
                    delete script.isStart;

                    Entry.engine.isContinue = false;
                    return script.callReturn();
                }
            },
            syntax: { js: [], py: ['mkboard.mkboard_matrix_bright(%1, %2)'] },
        },         

        mkboard_matrix_clear: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic',
            // template: Lang.template.mkboard_matrix_clear,
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
                        type: 'mkboard_matrix_count_list',
                        params: ['1'],
                    },   
                    null,
                ],
                type: 'mkboard_matrix_clear',
            },
            paramsKeyMap: {
                MATRIX_NUM: 0,
            },
            class: 'mkboardMatrix',
            isNotFor: ['mkboard'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var matrix_num = script.getValue('MATRIX_NUM', script);

                if (!script.isStart) 
                {
                    if (!Entry.hw.sendQueue['SET']) {
                        Entry.hw.sendQueue['SET'] = {};
                    }

                    var duration = Entry.mkboard.duration.TIME_200ms;
                    script.isStart = true;
                    script.timeFlag = 1;  

                    Entry.hw.sendQueue['SET'][0] = {
                        type: Entry.mkboard.sensorTypes.MATRIX,
                        data: {
                                cmd: 2,  // Matrix Clear
                                matrix_num: matrix_num,
                            },
                        time: new Date().getTime(),
                    };
                    setTimeout(function() {
                        script.timeFlag = 0;
                    }, duration );
                    return script;                    
                }
                else if (script.timeFlag == 1) 
                {
                    return script;
                } 
                else 
                {
                    delete script.timeFlag;
                    delete script.isStart;

                    Entry.engine.isContinue = false;
                    return script.callReturn();
                }
            },
            syntax: { js: [], py: ['mkboard.mkboard_matrix_clear(%1)'] },
        },           

        mkboard_matrix_set: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic',
            // template: Lang.template.mkboard_matrix_set,
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
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'mkboard_matrix_count_list',
                        params: ['1'],
                    },                   
                    {
                        type: 'mkboard_matrix_count_list',
                        params: ['1'],
                    },
                    {
                        type: 'mkboard_matrix_count_list',
                        params: ['1'],
                    },
                    {
                        type: 'arduino_get_digital_toggle',
                        params: ['on'],
                    },                   
                    null,
                ],
                type: 'mkboard_matrix_set',
            },
            paramsKeyMap: {
                MATRIX_NUM: 0,
                MATRIX_ROW: 1,
                MATRIX_COL: 2,
                MATRIX_ON_OFF: 3,
            },
            class: 'mkboardMatrix',
            isNotFor: ['mkboard'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;

                var matrix_num = script.getValue('MATRIX_NUM', script);
                var matrix_row = script.getValue('MATRIX_ROW', script);
                var matrix_col = script.getValue('MATRIX_COL', script);
                var matrix_on_off = script.getValue('MATRIX_ON_OFF', script);

                // var matrix_num_row = script.getNumberValue('MATRIX_ROW', script);

                // console.log("mkboard_matrix_set");
                // console.log("matrix_row=");   
                // console.log(matrix_row);        

                // console.log("matrix_num_row=");   
                // console.log(matrix_num_row);                         

                if (typeof matrix_on_off === 'string') {
                    matrix_on_off = matrix_on_off.toLowerCase();
                }
                if (Entry.mkboard.highList.indexOf(matrix_on_off) > -1) {
                    matrix_on_off = 1;
                } else if (Entry.mkboard.lowList.indexOf(matrix_on_off) > -1) {
                    matrix_on_off = 0;
                } else {
                    throw new Error();
                }                

                if (!script.isStart) 
                {

                    if (!Entry.hw.sendQueue['SET']) {
                        Entry.hw.sendQueue['SET'] = {};
                    }

                    var duration = Entry.mkboard.duration.TIME_200ms;
                    script.isStart = true;
                    script.timeFlag = 1;    

                    Entry.hw.sendQueue['SET'][0] = {
                        type: Entry.mkboard.sensorTypes.MATRIX,
                        data: {
                                cmd: 3,  // 포트설정
                                matrix_num: matrix_num,
                                matrix_row: matrix_row,
                                matrix_col: matrix_col,
                                matrix_on_off: matrix_on_off,
                            },
                        time: new Date().getTime(),
                    };
                    setTimeout(function() {
                        script.timeFlag = 0;
                    }, duration );
                    return script;                    
                }
                else if (script.timeFlag == 1) 
                {
                    return script;
                } 
                else 
                {
                    delete script.timeFlag;
                    delete script.isStart;

                    Entry.engine.isContinue = false;
                    return script.callReturn();
                }
            },
            syntax: { js: [], py: ['mkboard.mkboard_matrix_set(%1, %2, %3, %4)'] },
        },       

        mkboard_matrix_set_row: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic',
            // template: Lang.template.mkboard_matrix_set_row,
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
                        type: 'mkboard_matrix_count_list',
                        params: ['1'],
                    },        
                    {
                        type: 'mkboard_matrix_count_list',
                        params: ['1'],
                    },                                   
                    {
                        type: 'text',
                        params: ['01010101'],
                    },                                       
                    null,
                ],
                type: 'mkboard_matrix_set_row',
            },
            paramsKeyMap: {
                MATRIX_NUM: 0,
                MATRIX_ROW: 1,
                STRING: 2,
            },
            class: 'mkboardMatrix',
            isNotFor: ['mkboard'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;

                var matrix_num = script.getValue('MATRIX_NUM', script);
                var matrix_row = script.getValue('MATRIX_ROW', script);
                var string = script.getValue('STRING', script);
                var text = [];

                for (var i = 0; i < 8; i++) {
                    text[i] = '0';
                }

                if (typeof string === 'string') 
                {
                    for (var i = 0; i < string.length; i++) {
                        text[i] = Entry.mkboard.toByte(string[i]);
                    }
                } 
                else if (typeof string === 'number') 
                {
                    var num_to_string = string.toString();
                    for (var i = 0; i < num_to_string.length; i++) {
                        text[i] = Entry.mkboard.toByte(num_to_string[i]);
                    }
                } 
                else 
                {
                    text[0] = string;
                }

                if (!script.isStart) 
                {

                    if (!Entry.hw.sendQueue['SET']) {
                        Entry.hw.sendQueue['SET'] = {};
                    }

                    var duration = Entry.mkboard.duration.TIME_200ms;
                    script.isStart = true;
                    script.timeFlag = 1;    

                    Entry.hw.sendQueue['SET'][0] = {
                        type: Entry.mkboard.sensorTypes.MATRIX,
                        data: {
                                cmd: 4,  // Row
                                matrix_num: matrix_num,
                                matrix_row: matrix_row,
                                text0: text[0],
                                text1: text[1],
                                text2: text[2],
                                text3: text[3],
                                text4: text[4],
                                text5: text[5],
                                text6: text[6],
                                text7: text[7],                                
                            },
                        time: new Date().getTime(),
                    };
                    setTimeout(function() {
                        script.timeFlag = 0;
                    }, duration );
                    return script;                    
                }
                else if (script.timeFlag == 1) 
                {
                    return script;
                } 
                else 
                {
                    delete script.timeFlag;
                    delete script.isStart;

                    Entry.engine.isContinue = false;
                    return script.callReturn();
                }
            },
            syntax: { js: [], py: ['mkboard.mkboard_matrix_set_row(%1, %2, %3)'] },
        },                        

        mkboard_matrix_set_col: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic',
            // template: Lang.template.mkboard_matrix_set_col,
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
                        type: 'mkboard_matrix_count_list',
                        params: ['1'],
                    },      
                    {
                        type: 'mkboard_matrix_count_list',
                        params: ['1'],
                    },                                  
                    {
                        type: 'text',
                        params: ['01010101'],
                    },                                       
                    null,
                ],
                type: 'mkboard_matrix_set_col',
            },
            paramsKeyMap: {
                MATRIX_NUM: 0,
                MATRIX_COL: 1,
                STRING: 2,
            },
            class: 'mkboardMatrix',
            isNotFor: ['mkboard'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;

                var matrix_num = script.getValue('MATRIX_NUM', script);
                var matrix_col = script.getValue('MATRIX_COL', script);
                var string = script.getValue('STRING', script);
                var text = [];

                for (var i = 0; i < 8; i++) {
                    text[i] = '0';
                }

                if (typeof string === 'string') 
                {
                    for (var i = 0; i < string.length; i++) {
                        text[i] = Entry.mkboard.toByte(string[i]);
                    }
                } 
                else if (typeof string === 'number') 
                {
                    var num_to_string = string.toString();
                    for (var i = 0; i < num_to_string.length; i++) {
                        text[i] = Entry.mkboard.toByte(num_to_string[i]);
                    }
                } 
                else 
                {
                    text[0] = string;
                }

                if (!script.isStart) 
                {

                    if (!Entry.hw.sendQueue['SET']) {
                        Entry.hw.sendQueue['SET'] = {};
                    }

                    var duration = Entry.mkboard.duration.TIME_200ms;
                    script.isStart = true;
                    script.timeFlag = 1;    

                    Entry.hw.sendQueue['SET'][0] = {
                        type: Entry.mkboard.sensorTypes.MATRIX,
                        data: {
                                cmd: 5,  // Col
                                matrix_num: matrix_num,
                                matrix_col: matrix_col,
                                text0: text[0],
                                text1: text[1],
                                text2: text[2],
                                text3: text[3],
                                text4: text[4],
                                text5: text[5],
                                text6: text[6],
                                text7: text[7],                                
                            },
                        time: new Date().getTime(),
                    };
                    setTimeout(function() {
                        script.timeFlag = 0;
                    }, duration );
                    return script;                    
                }
                else if (script.timeFlag == 1) 
                {
                    return script;
                } 
                else 
                {
                    delete script.timeFlag;
                    delete script.isStart;

                    Entry.engine.isContinue = false;
                    return script.callReturn();
                }
            },
            syntax: { js: [], py: ['mkboard.mkboard_matrix_set_col(%1, %2, %3)'] },
        },    

       mkboard_matrix_char: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic',
            // template: Lang.template.mkboard_matrix_char,
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
                        type: 'mkboard_matrix_count_list',
                        params: ['1'],
                    },                           
                    {
                        type: 'text',
                        params: ['A'],
                    },                                       
                    null,
                ],
                type: 'mkboard_matrix_char',
            },
            paramsKeyMap: {
                MATRIX_NUM: 0,
                STRING: 1,
            },
            class: 'mkboardMatrix',
            isNotFor: ['mkboard'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;

                var matrix_num = script.getValue('MATRIX_NUM', script);
                var string = script.getValue('STRING', script);
                var text = [];

                for (var i = 0; i < 1; i++) {
                    text[i] = '0';
                }

                if (typeof string === 'string') 
                {
                    for (var i = 0; i < string.length; i++) {
                        text[i] = Entry.mkboard.toByte(string[i]);
                    }
                } 
                else if (typeof string === 'number') 
                {
                    var num_to_string = string.toString();
                    for (var i = 0; i < num_to_string.length; i++) {
                        text[i] = Entry.mkboard.toByte(num_to_string[i]);
                    }
                } 
                else 
                {
                    text[0] = string;
                }

                if (!script.isStart) 
                {

                    if (!Entry.hw.sendQueue['SET']) {
                        Entry.hw.sendQueue['SET'] = {};
                    }

                    var duration = Entry.mkboard.duration.TIME_200ms;
                    script.isStart = true;
                    script.timeFlag = 1;    

                    Entry.hw.sendQueue['SET'][0] = {
                        type: Entry.mkboard.sensorTypes.MATRIX,
                        data: {
                                cmd: 6,  // Char
                                matrix_num: matrix_num,
                                text0: text[0],                      
                            },
                        time: new Date().getTime(),
                    };
                    setTimeout(function() {
                        script.timeFlag = 0;
                    }, duration );
                    return script;                    
                }
                else if (script.timeFlag == 1) 
                {
                    return script;
                } 
                else 
                {
                    delete script.timeFlag;
                    delete script.isStart;

                    Entry.engine.isContinue = false;
                    return script.callReturn();
                }
            },
            syntax: { js: [], py: ['mkboard.mkboard_matrix_char(%1, %2)'] },
        },          

        mkboard_neopixel_list: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                { 
                    type: 'Dropdown',
                    options: [
                        ['RGB', '0'],
                        ['RGBW', '1'],
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
                RGB: 0,
            },
            func: function(sprite, script) {
                return script.getField('RGB');
            },
            syntax: { js: [], py: [] },
        },        

        mkboard_neopixel_init: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic',
            // template: Lang.template.mkboard_neopixel_init,
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
                        type: 'mkboard_neopixel_list',
                        params: ['0'],
                    },                       
                    {
                        type: 'arduino_get_port_number',
                        params: ['2'],
                    },                 
                     {
                        type: 'number',
                        params: ['5'],
                    },       
                    null,
                ],
                type: 'mkboard_neopixel_init',
            },
            paramsKeyMap: {                
                RGB: 0,
                PORT_NO: 1,
                LED_COUNT: 2,                
            },
            class: 'mkboardNeopixel',
            isNotFor: ['mkboard'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;

                var port_no = script.getNumberValue('PORT_NO', script);
                var led_count = script.getNumberValue('LED_COUNT', script);
                var rgb = script.getNumberValue('RGB', script);

                led_count = Math.round(led_count);
                led_count = Math.max(led_count, 1);
                led_count = Math.min(led_count, 30);

                if (!script.isStart) 
                {
                    if (!Entry.hw.sendQueue['SET']) {
                        Entry.hw.sendQueue['SET'] = {};
                    }

                    var duration = Entry.mkboard.duration.TIME_200ms;
                    script.isStart = true;
                    script.timeFlag = 1;    

                    Entry.hw.sendQueue['SET'][0] = {
                        type: Entry.mkboard.sensorTypes.NEOPIXEL,
                        data: {
                                cmd: 0,  // 포트설정
                                port_no: port_no,
                                led_count: led_count,
                                rgb: rgb,
                            },
                        time: new Date().getTime(),
                    };

                    setTimeout(function() {
                        script.timeFlag = 0;
                    }, duration );
                    return script;                        
                }
                else if (script.timeFlag == 1) 
                {
                    return script;
                } 
                else 
                {
                    delete script.timeFlag;
                    delete script.isStart;

                    Entry.engine.isContinue = false;
                    return script.callReturn();
                }                
            },
            syntax: { js: [], py: ['mkboard.mkboard_neopixel_init(%1, %2, %3)'] },
        },  

        mkboard_neopixel_set_rgb: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic',
            // template: Lang.template.mkboard_neopixel_set_rgb,
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
                        params: ['255'],
                    },
                    {
                        type: 'number',
                        params: ['0'],
                    },
                    {
                        type: 'number',
                        params: ['0'],
                    },                                      
                    null,
                ],
                type: 'mkboard_neopixel_set_rgb',
            },
            paramsKeyMap: {                
                LED_NO: 0,                
                R_VAL: 1,
                G_VAL: 2,
                B_VAL: 3,
            },
            class: 'mkboardNeopixel',
            isNotFor: ['mkboard'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;

                var led_no = script.getNumberValue('LED_NO', script);                
                var r_val = script.getNumberValue('R_VAL', script);
                var g_val = script.getNumberValue('G_VAL', script);
                var b_val = script.getNumberValue('B_VAL', script);

                led_no = Math.round(led_no);
                led_no = Math.max(led_no, 1);
                led_no = Math.min(led_no, 30);                

                r_val = Math.round(r_val);
                r_val = Math.max(r_val, 0);
                r_val = Math.min(r_val, 255);                

                g_val = Math.round(g_val);
                g_val = Math.max(g_val, 0);
                g_val = Math.min(g_val, 255);                

                b_val = Math.round(b_val);
                b_val = Math.max(b_val, 0);
                b_val = Math.min(b_val, 255);

                if (!script.isStart) 
                {                

                    if (!Entry.hw.sendQueue['SET']) {
                        Entry.hw.sendQueue['SET'] = {};
                    }

                    var duration = Entry.mkboard.duration.TIME_200ms;
                    script.isStart = true;
                    script.timeFlag = 1;   

                    Entry.hw.sendQueue['SET'][0] = {
                        type: Entry.mkboard.sensorTypes.NEOPIXEL,
                        data: {
                                cmd: 1,  // 포트설정
                                led_no: led_no,                                
                                r_val: r_val,
                                g_val: g_val,
                                b_val: b_val,
                            },
                        time: new Date().getTime(),
                    };
                    setTimeout(function() {
                        script.timeFlag = 0;
                    }, duration );
                    return script;                    
                }
                else if (script.timeFlag == 1) 
                {
                    return script;
                } 
                else 
                {
                    delete script.timeFlag;
                    delete script.isStart;

                    Entry.engine.isContinue = false;
                    return script.callReturn();
                }
            },
            syntax: { js: [], py: ['mkboard.mkboard_neopixel_set_rgb(%1, %2, %3, %4)'] },
        },     

        mkboard_neopixel_set_rgbw: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic',
            // template: Lang.template.mkboard_neopixel_set_rgbw,
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
                        params: ['255'],
                    },
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
                        params: ['0'],
                    },                                      
                    null,
                ],
                type: 'mkboard_neopixel_set_rgbw',
            },
            paramsKeyMap: {                
                LED_NO: 0,                
                R_VAL: 1,
                G_VAL: 2,
                B_VAL: 3,
                W_VAL: 4,
            },
            class: 'mkboardNeopixel',
            isNotFor: ['mkboard'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;

                var led_no = script.getNumberValue('LED_NO', script);                
                var r_val = script.getNumberValue('R_VAL', script);
                var g_val = script.getNumberValue('G_VAL', script);
                var b_val = script.getNumberValue('B_VAL', script);
                var w_val = script.getNumberValue('W_VAL', script);

                led_no = Math.round(led_no);
                led_no = Math.max(led_no, 1);
                led_no = Math.min(led_no, 30);                

                r_val = Math.round(r_val);
                r_val = Math.max(r_val, 0);
                r_val = Math.min(r_val, 255);                

                g_val = Math.round(g_val);
                g_val = Math.max(g_val, 0);
                g_val = Math.min(g_val, 255);                

                b_val = Math.round(b_val);
                b_val = Math.max(b_val, 0);
                b_val = Math.min(b_val, 255);

                w_val = Math.round(w_val);
                w_val = Math.max(w_val, 0);
                w_val = Math.min(w_val, 255);


                if (!script.isStart) 
                {                

                    if (!Entry.hw.sendQueue['SET']) {
                        Entry.hw.sendQueue['SET'] = {};
                    }

                    var duration = Entry.mkboard.duration.TIME_200ms;
                    script.isStart = true;
                    script.timeFlag = 1;   

                    Entry.hw.sendQueue['SET'][0] = {
                        type: Entry.mkboard.sensorTypes.NEOPIXEL,
                        data: {
                                cmd: 2,  // 포트설정
                                led_no: led_no,                                
                                r_val: r_val,
                                g_val: g_val,
                                b_val: b_val,
                                w_val: w_val,
                            },
                        time: new Date().getTime(),
                    };
                    setTimeout(function() {
                        script.timeFlag = 0;
                    }, duration );
                    return script;                    
                }
                else if (script.timeFlag == 1) 
                {
                    return script;
                } 
                else 
                {
                    delete script.timeFlag;
                    delete script.isStart;

                    Entry.engine.isContinue = false;
                    return script.callReturn();
                }
            },
            syntax: { js: [], py: ['mkboard.mkboard_neopixel_set_rgbw(%1, %2, %3, %4, %5)'] },
        },      


        mkboard_neopixel_on: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic',
            // template: Lang.template.mkboard_neopixel_on,
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
                        type: 'arduino_get_digital_toggle',
                        params: ['on'],
                    },                        
                    null,
                ],
                type: 'mkboard_neopixel_on',
            },
            paramsKeyMap: {
                VALUE: 0,
            },
            class: 'mkboardNeopixel',
            isNotFor: ['mkboard'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;

                var value = script.getValue('VALUE', script);

                //console.log("value=");
                //console.log(value);

                if (typeof value === 'string') {
                    value = value.toLowerCase();
                }
                if (Entry.mkboard.highList.indexOf(value) > -1) {
                    value = 1;
                } else if (Entry.mkboard.lowList.indexOf(value) > -1) {
                    value = 0;
                } else {
                    throw new Error();
                }                     

                //console.log("value=");
                //console.log(value);                

                if (!script.isStart) 
                {
                    if (!Entry.hw.sendQueue['SET']) {
                        Entry.hw.sendQueue['SET'] = {};
                    }


                    var duration = Entry.mkboard.duration.TIME_50ms;
                    script.isStart = true;
                    script.timeFlag = 1;    

                    Entry.hw.sendQueue['SET'][0] = {
                        type: Entry.mkboard.sensorTypes.NEOPIXEL,
                        data: {
                                cmd: 3,  // 켜기
                                value: value,
                            },
                        time: new Date().getTime(),
                    };
                    setTimeout(function() {
                        script.timeFlag = 0;
                    }, duration );
                    return script;                    
                }
                else if (script.timeFlag == 1) 
                {
                    return script;
                } 
                else 
                {
                    delete script.timeFlag;
                    delete script.isStart;

                    Entry.engine.isContinue = false;
                    return script.callReturn();
                }
            },
            syntax: { js: [], py: ['mkboard.mkboard_neopixel_on(%1)'] },
        },  

        mkboard_pm5003_pm_list: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['PM1.0', '0'],
                        ['PM2.5', '1'],
                        ['PM10', '2'],
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
                PM_KIND: 0,
            },
            func: function(sprite, script) {
                return script.getField('PM_KIND');
            },
            syntax: { js: [], py: [] },
        },                  

        mkboard_pms5003_init: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic',
            // template: Lang.template.mkboard_pms5003_init,
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
                        type: 'arduino_get_port_number',
                        params: ['9'],
                    },                 
                    {
                        type: 'arduino_get_port_number',
                        params: ['8'],
                    }, 
                    null,
                ],
                type: 'mkboard_pms5003_init',
            },
            paramsKeyMap: {
                PORT_RX: 0,
                PORT_TX: 1,
            },
            class: 'mkboardPms5003',
            isNotFor: ['mkboard'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;

                var port_rx = script.getNumberValue('PORT_RX', script);
                var port_tx = script.getNumberValue('PORT_TX', script);

                if (!script.isStart) 
                {
                
                    if (!Entry.hw.sendQueue['SET']) {
                        Entry.hw.sendQueue['SET'] = {};
                    }

                    var duration = Entry.mkboard.duration.TIME_200ms;
                    script.isStart = true;
                    script.timeFlag = 1;    

                    Entry.hw.sendQueue['SET'][0] = {
                        type: Entry.mkboard.sensorTypes.PMS5003,
                        data: {
                                cmd: 0,  // 포트설정
                                port_rx: port_rx,
                                port_tx: port_tx,
                            },
                        time: new Date().getTime(),
                    };
                    setTimeout(function() {
                        script.timeFlag = 0;
                    }, duration );
                    return script;                    
                }
                else if (script.timeFlag == 1) 
                {
                    return script;
                } 
                else 
                {
                    delete script.timeFlag;
                    delete script.isStart;

                    Entry.engine.isContinue = false;
                    return script.callReturn();
                }

                
            },
            syntax: { js: [], py: ['mkboard.mkboard_pms5003_init(%1, %2)'] },
        },  

        mkboard_pms5003_measure: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic',
            // template: Lang.template.mkboard_pms5003_measure,
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
                params: [null],
                type: 'mkboard_pms5003_measure',
            },
            //paramsKeyMap: {
            //    PORT_RX: 0,
            //    PORT_TX: 1,
            //},
            class: 'mkboardPms5003',
            isNotFor: ['mkboard'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;

                if (!script.isStart) 
                {
                    if (!Entry.hw.sendQueue['SET']) {
                        Entry.hw.sendQueue['SET'] = {};
                    }

                    var duration = Entry.mkboard.duration.TIME_10ms;
                    script.isStart = true;
                    script.timeFlag = 1;  

                    Entry.hw.sendQueue['SET'][0] = {
                        type: Entry.mkboard.sensorTypes.PMS5003,
                        data: {
                                cmd: 1,  // 먼지센서 측정
                            },
                        time: new Date().getTime(),
                    };
                    setTimeout(function() {
                        script.timeFlag = 0;
                    }, duration );
                    return script;                    
                }
                else if (script.timeFlag == 1) 
                {
                    return script;
                } 
                else 
                {
                    delete script.timeFlag;
                    delete script.isStart;

                    Entry.engine.isContinue = false;
                    return script.callReturn();
                }
            },
            syntax: { js: [], py: ['mkboard.mkboard_pms5003_measure()'] },
        },          

        mkboard_pms5003_read: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            // template: Lang.template.mkboard_pms5003_read,
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
                        type: 'mkboard_pm5003_pm_list',
                        params: ['1'],
                    },
                    null,
                ],
                type: 'mkboard_pms5003_read',
            },
            paramsKeyMap: {
                PM_KIND: 0,
            },
            class: 'mkboardPms5003',
            isNotFor: ['mkboard'],
            func: function(sprite, script) {                
                var pm_kind = script.getNumberValue('PM_KIND', script);            

                if (pm_kind === 0) 
                {
                    return Entry.hw.portData.PMS5003_PM10 || 0;
                }
                else if (pm_kind === 1) 
                {
                    return Entry.hw.portData.PMS5003_PM25 || 0;
                }
                else
                {
                    return Entry.hw.portData.PMS5003_PM100 || 0;
                }
                
            },
            syntax: { js: [], py: ['mkboard.mkboard_pms5003_read(%1)'] },
        },        


        mkboard_lsm303_axis_list: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['X', '0'],
                        ['Y', '1'],
                        ['Z', '2'],
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
                AXIS: 0,
            },
            func: function(sprite, script) {
                return script.getField('AXIS');
            },
            syntax: { js: [], py: [] },
        },                  

        mkboard_lsm303_accel_init: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic',
            // template: Lang.template.mkboard_lsm303_accel_init,
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
                params: [null],
                type: 'mkboard_lsm303_accel_init',
            },
            //paramsKeyMap: {
            //    PORT_RX: 0,
            //    PORT_TX: 1,
            //},
            class: 'mkboardLsm303Accel',
            isNotFor: ['mkboard'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;

                if (!script.isStart) 
                {

                    if (!Entry.hw.sendQueue['SET']) {
                        Entry.hw.sendQueue['SET'] = {};
                    }

                    var duration = Entry.mkboard.duration.TIME_100ms;
                    script.isStart = true;
                    script.timeFlag = 1;  

                    Entry.hw.sendQueue['SET'][0] = {
                        type: Entry.mkboard.sensorTypes.LSM303_ACCEL,
                        data: {
                                cmd: 0,  // 초기화
                            },
                        time: new Date().getTime(),
                    };
                    setTimeout(function() {
                        script.timeFlag = 0;
                    }, duration );
                    return script;                    
                }
                else if (script.timeFlag == 1) 
                {
                    return script;
                } 
                else 
                {
                    delete script.timeFlag;
                    delete script.isStart;

                    Entry.engine.isContinue = false;
                    return script.callReturn();
                }
            },
            syntax: { js: [], py: ['mkboard.mkboard_lsm303_accel_init()'] },
        },  

        mkboard_lsm303_accel_measure: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic',
            // template: Lang.template.mkboard_lsm303_accel_measure,
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
                params: [null],
                type: 'mkboard_lsm303_accel_measure',
            },
            //paramsKeyMap: {
            //    PORT_RX: 0,
            //    PORT_TX: 1,
            //},
            class: 'mkboardLsm303Accel',
            isNotFor: ['mkboard'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;

                if (!script.isStart) 
                {
                    if (!Entry.hw.sendQueue['SET']) {
                        Entry.hw.sendQueue['SET'] = {};
                    }

                    var duration = Entry.mkboard.duration.TIME_100ms;
                    script.isStart = true;
                    script.timeFlag = 1;   

                    Entry.hw.sendQueue['SET'][0] = {
                        type: Entry.mkboard.sensorTypes.LSM303_ACCEL,
                        data: {
                                cmd: 1,  // 먼지센서 측정
                            },
                        time: new Date().getTime(),
                    };
                    setTimeout(function() {
                        script.timeFlag = 0;
                    }, duration );
                    return script;                    
                }
                else if (script.timeFlag == 1) 
                {
                    return script;
                } 
                else 
                {
                    delete script.timeFlag;
                    delete script.isStart;

                    Entry.engine.isContinue = false;
                    return script.callReturn();
                }
            },
            syntax: { js: [], py: ['mkboard.mkboard_lsm303_accel_measure()'] },
        },          

        mkboard_lsm303_accel_read: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            // template: Lang.template.mkboard_lsm303_accel_read,
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
                        type: 'mkboard_lsm303_axis_list',
                        params: ['0'],
                    },
                    null,
                ],
                type: 'mkboard_lsm303_accel_read',
            },
            paramsKeyMap: {
                AXIS: 0,
            },
            class: 'mkboardLsm303Accel',
            isNotFor: ['mkboard'],
            func: function(sprite, script) {                
                var axis = script.getNumberValue('AXIS', script);

                if (axis === 0) 
                    return Entry.hw.portData.LSM303_ACCEL_X || 0;
                else if (axis === 1) 
                    return Entry.hw.portData.LSM303_ACCEL_Y || 0;
                else
                    return Entry.hw.portData.LSM303_ACCEL_Z || 0;
                
            },
            syntax: { js: [], py: ['mkboard.mkboard_lsm303_accel_read(%1)'] },
        },          

        mkboard_lsm303_compass_init: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic',
            // template: Lang.template.mkboard_lsm303_compass_init,
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
                params: [null],
                type: 'mkboard_lsm303_compass_init',
            },
            //paramsKeyMap: {
            //    PORT_RX: 0,
            //    PORT_TX: 1,
            //},
            class: 'mkboardLsm303Compass',
            isNotFor: ['mkboard'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;

                if (!script.isStart) 
                {
                    if (!Entry.hw.sendQueue['SET']) {
                        Entry.hw.sendQueue['SET'] = {};
                    }

                    var duration = Entry.mkboard.duration.TIME_200ms;
                    script.isStart = true;
                    script.timeFlag = 1;   

                    Entry.hw.sendQueue['SET'][0] = {
                        type: Entry.mkboard.sensorTypes.LSM303_COMPASS,
                        data: {
                                cmd: 0,  // 초기화
                            },
                        time: new Date().getTime(),
                    };
                    setTimeout(function() {
                        script.timeFlag = 0;
                    }, duration );
                    return script;                    
                }
                else if (script.timeFlag == 1) 
                {
                    return script;
                } 
                else 
                {
                    delete script.timeFlag;
                    delete script.isStart;

                    Entry.engine.isContinue = false;
                    return script.callReturn();
                }
            },
            syntax: { js: [], py: ['mkboard.mkboard_lsm303_compass_init()'] },
        },  

        mkboard_lsm303_compass_measure: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic',
            // template: Lang.template.mkboard_lsm303_compass_measure,
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
                params: [null],
                type: 'mkboard_lsm303_compass_measure',
            },
            //paramsKeyMap: {
            //    PORT_RX: 0,
            //    PORT_TX: 1,
            //},
            class: 'mkboardLsm303Compass',
            isNotFor: ['mkboard'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;

                if (!script.isStart) 
                {
                    if (!Entry.hw.sendQueue['SET']) {
                        Entry.hw.sendQueue['SET'] = {};
                    }

                    var duration = Entry.mkboard.duration.TIME_200ms;
                    script.isStart = true;
                    script.timeFlag = 1;   

                    Entry.hw.sendQueue['SET'][0] = {
                        type: Entry.mkboard.sensorTypes.LSM303_COMPASS,
                        data: {
                                cmd: 1,  // 지자기 센서 측정
                            },
                        time: new Date().getTime(),
                    };
                    setTimeout(function() {
                        script.timeFlag = 0;
                    }, duration );
                    return script;                    
                }
                else if (script.timeFlag == 1) 
                {
                    return script;
                } 
                else 
                {
                    delete script.timeFlag;
                    delete script.isStart;

                    Entry.engine.isContinue = false;
                    return script.callReturn();
                }
            },
            syntax: { js: [], py: ['mkboard.mkboard_lsm303_compass_measure()'] },
        },          

        mkboard_lsm303_compass_read: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            // template: Lang.template.mkboard_lsm303_compass_read,
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
                params: [null],
                type: 'mkboard_lsm303_compass_read',
            },
            //paramsKeyMap: {
            //    AXIS: 0,
            //},
            class: 'mkboardLsm303Compass',
            isNotFor: ['mkboard'],
            func: function(sprite, script) {                
                return Entry.hw.portData.LSM303_COMPASS || 0;                
            },
            syntax: { js: [], py: ['mkboard.mkboard_lsm303_compass_read()'] },
        },          

        //endregion mkboard 몽키보드
    };
};

module.exports = Entry.mkboard;
