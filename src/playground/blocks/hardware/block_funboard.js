'use strict';

Entry.FunBoard = {
    // isNotFor": [ "funboard" ] 값
    id: '21.1',
    name: 'funboard',
    url: 'http://www.thinkfunedu.com',
    imageName: 'funboard.png',
    title: {
        en: 'funboard',
        ko: '펀보드',
    },
    Static: {
        FUNBOARD_BLOCK_color: EntryStatic.colorSet.block.default.HARDWARE, // gray(#848484)
        FUNBOARD_ARROW_COLOR_HW: EntryStatic.colorSet.block.default.HARDWARE,
        FUNBOARD_FONT_COLOR: '#000f0f', // cyan(#000f0f), lightgray(#000113), reddish-brown(#982600)
        FUNBOARD_LED_ON: 255,
        BUTTON_PRESS_VALUE: 0, // 버튼 눌림 값
        FUNBOARD_MATRIX_STRING_MAX: 5, //문자열 입력 허용 최대 문자수//실제 적용갯수는 (이 값 - 1)
        DELAY_SECOND: 0.1, //0.3//0.2
        ANALOG_STATE_PERCENT: 0.5, //30%(306.9) , 50%(511.5)
        MATRIX_REGISTED_SYMBOL_TOTAL: 10, //펌웨어에 등록되어 있는 symbol 갯수
    },

    //entry [중지]-버튼을 누르면 실행되므로...
    setZero: function() {
        //-------------------------------------------------
        {
            if (!Entry.hw.sendQueue['SET']) {
                Entry.hw.sendQueue['SET'] = {};
            }
            //reset - [중지] 시
            var port = 13;
            Entry.hw.sendQueue['SET'][port] = {
                type: Entry.FunBoard.sensorTypes.ETC,
                data: Entry.FunBoard.EventTypes.RESET,
                time: new Date().getTime(),
            };
            for (var i = 0; i < 50000; i++) {}
            Entry.hw.update();
            delete Entry.hw.sendQueue[port];
            for (var i = 0; i < 500000; i++) {}
        }
        //-------------------------------------------------
        if (!Entry.hw.sendQueue.SET) {
            Entry.hw.sendQueue = {
                GET: {},
                SET: {},
            };
        } else {
            var keySet = Object.keys(Entry.hw.sendQueue.SET);
            keySet.forEach(function(key) {
                Entry.hw.sendQueue.SET[key].type = Entry.FunBoard.sensorTypes.ETC;
                Entry.hw.sendQueue.SET[key].data = 0;
                Entry.hw.sendQueue.SET[key].time = new Date().getTime();
            });
        }
        Entry.hw.update();
    },
    toByte: function(data) {
        var c = data;
        data = Entry.FunBoard._str2bin(c);
        return data;
    },
    EventTypes: {
        //ETC
        BUZZER_ON: 1,
        BUZZER_OFF: 2,
        MATRIX_OFF_ALL: 3,
        MATRIX_ON_ALL: 4,
        MATRIX_INTENSITY: 5,
        MATRIX_SCROLL_DIR: 6,
        MATRIX_SCROLL_RAPID: 7,
        MATRIX_SYMBOL_OUT: 8,
        RESET: 13,
        //MATRIX, MATRIX64
        SET_ROW_COL: 3,
        SET_ROW1: 4,
        SET_COL1: 5,
        STR_OUT_NO_SCROLL: 6,
        STR_OUT_LEFT: 7,
        STR_OUT_UP: 8,
        STR_OUT_RIGHT: 9,
        STR_OUT_DOWN: 10,
        STR_OUT_DEFAULT: 11,
        CHAR_OUT: 12,
        SET_64: 13,
        //14 이상 안된다. (digital port memory 14개)
    },
    sensorTypes: {
        ALIVE: 0,
        DIGITAL: 1,
        ANALOG: 2,
        PWM: 3,
        ETC: 4,
        TONE: 5,
        PULSEIN: 6,
        ULTRASONIC: 7,
        TIMER: 8,
        rxBLUETOOTH: 9,
        MATRIX: 10,
        txBLUETOOTH: 11,
        MATRIX64: 12,
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

    PORT_MAP: {
        rx: 0, //D0
        tx: 1, //D1
        matrix_cs: 2, //D2
        matrix_data: 3, //D3(PWM)
        matrix_clk: 4, //D4
        up_bt: 5, //D5(PWM)
        down_bt: 6, //D6(PWM)
        left_bt: 7, //D7
        right_bt: 8, //D8
        buzzer: 9, //D9(PWM)
        led_red: 10, //D10(PWM)
        led_yellow: 11, //D11(PWM)
        led_green: 12, //D12
        led_blue: 13, //D13

        slide: 0, //A0
        cds: 1, //A1
        mic: 2, //A2
        space_touchbt: 3, //A3
        enter_touchbt: 4, //A4
        escape_touchbt: 5, //A5
    },

    //-------------------------------------------------------------//
    // (value2 ~ value3) 범위의 값을 (value4 ~ value5) 범위로 변환 //
    //-------------------------------------------------------------//
    get_analog_value_map: function(a, what, value2, value3, value4, value5) {
        var result = a;
        var value2 = value2;
        var value3 = value3;
        var value4 = value4;
        var value5 = value5;

        var stringValue4 = String(value4);
        var stringValue5 = String(value5);
        var isFloat = false;

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

    bt_pressed: function(bt_index, value) {
        var bt_pressed = 0;
        //Analog
        if (bt_index >= 5) {
            bt_pressed = value > 100 ? 0 : 1;
            //bt_pressed = value < 3 ? 1 : 0;
            //bt_pressed = value < 1 ? 1 : 0;
        } else {
            //Digital
            //bt_pressed = value > 0 ? 0 : 1;
            bt_pressed = value > 0 ? 1 : 0;
        }
        return bt_pressed;
    },
    sleep: function(num) {
        var now = new Date();
        var stop = now.getTime() + num;
        while (true) {
            now = new Date();
            if (now.getTime() > stop) return;
        }
    },
    MinMax: function(v, vmin, vmax) {
        var value = v;
        value = Math.max(value, vmin);
        value = Math.min(value, vmax);
        return value;
    },
    get_char_index: function(k, str) {
        //LedControl.h 의 displayCharSet[] 에서 symbol 제외한 문자들만 복사 사용 !!!
        //즉, 비교할 수 있는 문자들만(기호는 문자비교를 할 수 없으니...)...
        // \ 는 앞에 \ 를 붙인다.
        var displayCharSet =
            "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz !?#$%&*+-/~^_@<>=()[]{},.:;'`\\|";
        var not_found = 62; //62 == space 문자 위치
        if (k < 0 || k >= str.length) return not_found;
        var pos = displayCharSet.indexOf(str[k]);
        if (pos >= 0) {
            return pos;
        }
        return not_found;
    },
    strwith01: function(len, str) {
        var charset = '1#*';
        var pos = -1;
        var str3 = '';
        for (var i = 0; i < len; i++) {
            pos = -1;
            if (i < len) pos = charset.indexOf(str[i]);
            if (pos < 0) str3 = str3.concat('0');
            else str3 = str3.concat('1');
        }
        return str3;
    },
    str2byte: function(str) {
        var value = 0;
        for (var i = str.length - 1; i >= 0; i--) {
            value = value + str[i] * Math.pow(2, 8 - (i + 1));
        }
        return value;
    },
    // Convert a string to an array of little-endian words
    // If chrsz is ASCII, characters >255 have their hi-byte silently ignored.
    _str2bin: function(str) {
        var chrsz = 8;
        var bin = Array();
        //var mask = 0xFF;
        var mask = (1 << chrsz) - 1;
        for (var i = 0; i < str.length * chrsz; i += chrsz)
            bin[i >> 5] |= (str.charCodeAt(i / chrsz) & mask) << (i % 32);
        return bin;
    },
};
Entry.FunBoard.setLanguage = function () {
    return {
        ko: {
            template: {
                funboard_buzzer_onoff: "버저 %1 %2",
                funboard_buzzer_second: "버저%1%2초 동안%3",
                funboard_buzzer_tone_simple: "%1%2음을%3초 연주하기%4",
                funboard_color_led_on_pwm: "%1색  LED %2 % %3",
                funboard_color_led_onoff: "%1색  LED %2 %3",
                funboard_convert_scale: "%1값 %2~%3 에서 %4~%5 으로 변환값",
                funboard_dotmatrix_1column: "%1칸 %2표시하기 %3",
                funboard_dotmatrix_1row: "%1줄 %2표시하기 %3",
                funboard_dotmatrix_1row_1column: "%1%2 %3표시하기 %4",
                funboard_dotmatrix_64_display: "%1 (8x8)표시하기%2",
                funboard_dotmatrix_big_eng: "대문자 %1표시하기 %2",
                funboard_dotmatrix_char_display: "문자%1표시하기%2",
                funboard_dotmatrix_extra_char: "문자 %1표시하기 %2",
                funboard_dotmatrix_intensity: "밝기 %1% %2",
                funboard_dotmatrix_kor: "▦  한글 %1표시하기 %2",
                funboard_dotmatrix_num: "숫자 %1표시하기 %2",
                funboard_dotmatrix_onoff: "모두 %1 %2",
                funboard_dotmatrix_scroll_option: "스크롤 방향%1%2",
                funboard_dotmatrix_scroll_rapid: "스크롤 속도 %1% %2",
                funboard_dotmatrix_set: "%1줄 %2칸  %3 %4",
                funboard_dotmatrix_small_eng: "소문자 %1표시하기 %2",
                funboard_dotmatrix_string_display: "문자열%1표시하기%2",
                funboard_dotmatrix_string_display_scroll: "문자열%1표시하기%2스크롤%3",
                funboard_dotmatrix_symbol: "기호 %1표시하기 %2",
                funboard_get_analog_sensor_2state: "%1값 %2",
                funboard_get_digital_button_value: "%1 버튼  값",
                funboard_get_number_sensor_value: "%1 값",
                funboard_get_touch_button_value: "%1 터치  값",
                funboard_set_digital_buzzer: "버저를 %1옥타브 %2음 %3초  연주%4",
                funboard_what_button_pressed: "%1 버튼  눌림",
                funboard_what_touch_button_pressed: "%1 터치됨",
            },
            Blocks: {
                //for dropdown
                FUNBOARD_bt_down: "노랑(B)",
                FUNBOARD_bt_left: "초록(C)",
                FUNBOARD_bt_right: "파랑(D)",
                FUNBOARD_bt_up: "빨강(A)",
                FUNBOARD_column_tag: "칸",
                FUNBOARD_do_off: "끄기",
                FUNBOARD_do_on: "켜기",
                FUNBOARD_led_color_all: "모두",
                FUNBOARD_led_color_blue: "파랑",
                FUNBOARD_led_color_green: "초록",
                FUNBOARD_led_color_red: "빨강",
                FUNBOARD_led_color_str: "색",
                FUNBOARD_led_color_yellow: "노랑",
                FUNBOARD_led_off_str: "LED 끄기",
                FUNBOARD_led_on_str: "LED 켜기",
                FUNBOARD_row_tag: "줄",
                FUNBOARD_scroll_down: "아래쪽으로",
                FUNBOARD_scroll_left: "왼쪽으로",
                FUNBOARD_scroll_no: "없음",
                FUNBOARD_scroll_right: "오른쪽으로",
                FUNBOARD_scroll_up: "위쪽으로",
                FUNBOARD_sensor_cds: "Cds (밝기 감지)",
                FUNBOARD_sensor_mic: "마이크 (소리 감지)",
                FUNBOARD_sensor_slide: "슬라이드 (막대 조정)",
                FUNBOARD_sensor_state_1: "작다",
                FUNBOARD_sensor_state_2: "크다",
                FUNBOARD_touchbt_down: "B(노랑)",
                FUNBOARD_touchbt_enter: "F",
                FUNBOARD_touchbt_escape: "G",
                FUNBOARD_touchbt_left: "C(초록)",
                FUNBOARD_touchbt_right: "D(파랑)",
                FUNBOARD_touchbt_space: "E",
                FUNBOARD_touchbt_up: "A(빨강)",
                funboard_dotmatrix_set_off: "끄기",
                funboard_dotmatrix_set_on: "켜기",
            }
        },
        en: {
            // en.js에 작성하던 내용
            template: {
                funboard_buzzer_onoff: "buzzer %1 %2",
                funboard_buzzer_second: "buzzer%1%2seconds%3",
                funboard_buzzer_tone_simple: "play note%1%2,%3sec of Melody Playing%4",
                funboard_color_led_on_pwm: "%1COLOR  LED %2 % %3",
                funboard_color_led_onoff: "%1COLOR  LED %2 %3",
                funboard_convert_scale: "Convert %1 value from %2~%3 to %4~%5",
                funboard_dotmatrix_1column: "%1column %2set %3",
                funboard_dotmatrix_1row: "%1row %2set %3",
                funboard_dotmatrix_1row_1column: "%1%2 %3set %4",
                funboard_dotmatrix_64_display: "%1 (8x8)display%2",
                funboard_dotmatrix_big_eng: "capital letters %1 %2",
                funboard_dotmatrix_char_display: "char%1display%2",
                funboard_dotmatrix_extra_char: "char %1 %2",
                funboard_dotmatrix_intensity: "Intensity %1% %2",
                funboard_dotmatrix_kor: "∷∷  korean %1 %2",
                funboard_dotmatrix_num: "number %1 %2",
                funboard_dotmatrix_onoff: "turn all %1 %2",
                funboard_dotmatrix_scroll_option: "scroll direction%1%2",
                funboard_dotmatrix_scroll_rapid: "scroll rapid %1% %2",
                funboard_dotmatrix_set: "%1row %2column  %3 %4",
                funboard_dotmatrix_small_eng: "small letter %1 %2",
                funboard_dotmatrix_string_display: "string%1display%2",
                funboard_dotmatrix_string_display_scroll: "string%1display%2scroll%3",
                funboard_dotmatrix_symbol: "symbol %1 %2",
                funboard_get_analog_sensor_2state: "%1 value %2",
                funboard_get_digital_button_value: "%1 button value",
                funboard_get_number_sensor_value: "%1 value",
                funboard_get_touch_button_value: "%1 touch button value",
                funboard_set_digital_buzzer: "Play tone octave %1 note %2 beat %3 %4",
                funboard_what_button_pressed: "%1 button pressed.",
                funboard_what_touch_button_pressed: "%1 touch button pressed.",
            },
            Blocks: {
                //for dropdown
                FUNBOARD_bt_down: "yellow(B)",
                FUNBOARD_bt_left: "green(C)",
                FUNBOARD_bt_right: "blue(D)",
                FUNBOARD_bt_up: "red(A)",
                FUNBOARD_column_tag: "column",
                FUNBOARD_do_off: "off",
                FUNBOARD_do_on: "on",
                FUNBOARD_led_color_all: "all",
                FUNBOARD_led_color_blue: "blue",
                FUNBOARD_led_color_green: "green",
                FUNBOARD_led_color_red: "red",
                FUNBOARD_led_color_str: "color  ",
                FUNBOARD_led_color_yellow: "yellow",
                FUNBOARD_led_off_str: "Turn off the LED",
                FUNBOARD_led_on_str: "Turn on the LED",
                FUNBOARD_row_tag: "row",
                FUNBOARD_scroll_down: "downward",
                FUNBOARD_scroll_left: "leftward",
                FUNBOARD_scroll_no: "no",
                FUNBOARD_scroll_right: "rightward",
                FUNBOARD_scroll_up: "upwards",
                FUNBOARD_sensor_cds: "light sensor",
                FUNBOARD_sensor_mic: "microphone sensor",
                FUNBOARD_sensor_slide: "potentiometer",
                FUNBOARD_sensor_state_1: "low",
                FUNBOARD_sensor_state_2: "high",
                FUNBOARD_touchbt_down: "B(yellow)",
                FUNBOARD_touchbt_enter: "F",
                FUNBOARD_touchbt_escape: "G",
                FUNBOARD_touchbt_left: "C(green)",
                FUNBOARD_touchbt_right: "D(blue)",
                FUNBOARD_touchbt_space: "E",
                FUNBOARD_touchbt_up: "A(red)",
                funboard_dotmatrix_set_off: "off",
                funboard_dotmatrix_set_on: "on",
            },
        }, //
    };
};
Entry.FunBoard.blockMenuBlocks = [
    'funboard_list_pushbutton_basic',
    'funboard_list_touchbutton_basic',
    'funboard_list_analogsensor_basic',
    'funboard_list_2_state_basic',
    'funboard_list_ledcolor_basic',
    'funboard_list_onoff_basic',
    'funboard_what_button_pressed',
    'funboard_what_touch_button_pressed',
    'funboard_get_analog_sensor_2state',
    'funboard_get_digital_button_value',
    'funboard_get_touch_button_value',
    'funboard_get_number_sensor_value',
    'funboard_convert_scale',
    'funboard_set_digital_buzzer',
    'funboard_buzzer_onoff',
    'funboard_color_led_onoff',
    'funboard_color_led_on_pwm',
    'funboard_dotmatrix_intensity',
    'funboard_dotmatrix_onoff',
    'funboard_dotmatrix_symbol',
    'funboard_dotmatrix_char_display',
    'funboard_dotmatrix_string_display_scroll',
    'funboard_dotmatrix_set',
    'funboard_dotmatrix_1row',
    'funboard_dotmatrix_1column',
];
Entry.FunBoard.getBlocks = function() {
    return {
        //region FunBoard
        funboard_list_pushbutton_basic: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.FUNBOARD_bt_up, '1'],
                        [Lang.Blocks.FUNBOARD_bt_down, '2'],
                        [Lang.Blocks.FUNBOARD_bt_left, '3'],
                        [Lang.Blocks.FUNBOARD_bt_right, '4'],
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
                PORT: 0,
            },
            func: function(sprite, script) {
                return script.getField('PORT');
            },
        },
        funboard_list_touchbutton_basic: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.FUNBOARD_touchbt_up, '1'],
                        [Lang.Blocks.FUNBOARD_touchbt_down, '2'],
                        [Lang.Blocks.FUNBOARD_touchbt_left, '3'],
                        [Lang.Blocks.FUNBOARD_touchbt_right, '4'],
                        [Lang.Blocks.FUNBOARD_touchbt_space, '5'],
                        [Lang.Blocks.FUNBOARD_touchbt_enter, '6'],
                        [Lang.Blocks.FUNBOARD_touchbt_escape, '7'],
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
                PORT: 0,
            },
            func: function(sprite, script) {
                return script.getField('PORT');
            },
        },
        funboard_list_analogsensor_basic: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.FUNBOARD_sensor_slide, '1'],
                        [Lang.Blocks.FUNBOARD_sensor_cds, '2'],
                        [Lang.Blocks.FUNBOARD_sensor_mic, '3'],
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
                PORT: 0,
            },
            func: function(sprite, script) {
                return script.getField('PORT');
            },
        },
        funboard_list_2_state_basic: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.FUNBOARD_sensor_state_1, '1'],
                        [Lang.Blocks.FUNBOARD_sensor_state_2, '2'],
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
                PORT: 0,
            },
            func: function(sprite, script) {
                return script.getField('PORT');
            },
        },
        funboard_list_ledcolor_basic: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.FUNBOARD_led_color_red, '1'],
                        [Lang.Blocks.FUNBOARD_led_color_yellow, '2'],
                        [Lang.Blocks.FUNBOARD_led_color_green, '3'],
                        [Lang.Blocks.FUNBOARD_led_color_blue, '4'],
                        [Lang.Blocks.FUNBOARD_led_color_all, '5'],
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
                PORT: 0,
            },
            func: function(sprite, script) {
                return script.getField('PORT');
            },
        },
        funboard_list_ledcolor_pwm_basic: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.FUNBOARD_led_color_red, '1'],
                        [Lang.Blocks.FUNBOARD_led_color_yellow, '2'],
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
                PORT: 0,
            },
            func: function(sprite, script) {
                return script.getField('PORT');
            },
        },
        funboard_list_onoff_basic: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.FUNBOARD_do_on, '1'],
                        [Lang.Blocks.FUNBOARD_do_off, '0'],
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
                PORT: 0,
            },
            func: function(sprite, script) {
                return script.getField('PORT');
            },
        },
        funboard_list_digital_octave: {
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
        funboard_list_digital_tone: {
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
        funboard_list_matrix_rows: {
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
                ROW: 0,
            },
            func: function(sprite, script) {
                return script.getField('ROW');
            },
        },
        funboard_list_matrix_row_or_column: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.FUNBOARD_row_tag, '1'],
                        [Lang.Blocks.FUNBOARD_column_tag, '2'],
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
                WHAT: 0,
            },
            func: function(sprite, script) {
                return script.getField('WHAT');
            },
        },
        funboard_list_matrix_scroll_option: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.FUNBOARD_scroll_no, '1'],
                        [Lang.Blocks.FUNBOARD_scroll_left, '2'],
                        [Lang.Blocks.FUNBOARD_scroll_right, '4'],
                        [Lang.Blocks.FUNBOARD_scroll_up, '3'],
                        [Lang.Blocks.FUNBOARD_scroll_down, '5'],
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
                RET: 0,
            },
            func: function(sprite, script) {
                return script.getField('RET');
            },
        },
        funboard_list_matrix_char: {
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
                        ['A', 'A'],
                        ['B', 'B'],
                        ['C', 'C'],
                        ['D', 'D'],
                        ['E', 'E'],
                        ['F', 'F'],
                        ['G', 'G'],
                        ['H', 'H'],
                        ['I', 'I'],
                        ['J', 'J'],
                        ['K', 'K'],
                        ['L', 'L'],
                        ['M', 'M'],
                        ['N', 'N'],
                        ['O', 'O'],
                        ['P', 'P'],
                        ['Q', 'Q'],
                        ['R', 'R'],
                        ['S', 'S'],
                        ['T', 'T'],
                        ['U', 'U'],
                        ['V', 'V'],
                        ['W', 'W'],
                        ['X', 'X'],
                        ['Y', 'Y'],
                        ['Z', 'Z'],
                        ['a', 'a'],
                        ['b', 'b'],
                        ['c', 'c'],
                        ['d', 'd'],
                        ['e', 'e'],
                        ['f', 'f'],
                        ['g', 'g'],
                        ['h', 'h'],
                        ['i', 'i'],
                        ['j', 'j'],
                        ['k', 'k'],
                        ['l', 'l'],
                        ['m', 'm'],
                        ['n', 'n'],
                        ['o', 'o'],
                        ['p', 'p'],
                        ['q', 'q'],
                        ['r', 'r'],
                        ['s', 's'],
                        ['t', 't'],
                        ['u', 'u'],
                        ['v', 'v'],
                        ['w', 'w'],
                        ['x', 'x'],
                        ['y', 'y'],
                        ['z', 'z'],
                        [' ', ' '],
                        ['!', '!'],
                        ['?', '?'],
                        ['#', '#'],
                        ['$', '$'],
                        ['%', '%'],
                        ['&', '&'],
                        ['*', '*'],
                        ['+', '+'],
                        ['-', '-'],
                        ['/', '/'],
                        ['~', '~'],
                        ['^', '^'],
                        ['_', '_'],
                        ['@', '@'],
                        ['<', '<'],
                        ['>', '>'],
                        ['=', '='],
                        ['(', '('],
                        [')', ')'],
                        ['[', '['],
                        [']', ']'],
                        ['{', '{'],
                        ['}', '}'],
                        [',', ','],
                        ['.', '.'],
                        [':', ':'],
                        [';', ';'],
                        ["'", "'"],
                        ['`', '`'],
                        ['\\', '\\'],
                        ['|', '|'],
                    ],
                    value: 'A',
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
                RET: 0,
            },
            func: function(sprite, script) {
                return script.getField('RET');
            },
        },
        funboard_what_button_pressed: {
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
                        type: 'funboard_list_pushbutton_basic',
                    },
                ],
                type: 'funboard_what_button_pressed',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'funboardget',
            isNotFor: ['funboard'],
            func: function(sprite, script) {
                var port = 0;
                var bt_index = script.getNumberValue('PORT');
                if (bt_index == 1) port = Entry.FunBoard.PORT_MAP['up_bt'];
                else if (bt_index == 2) port = Entry.FunBoard.PORT_MAP['down_bt'];
                else if (bt_index == 3) port = Entry.FunBoard.PORT_MAP['left_bt'];
                else if (bt_index == 4) port = Entry.FunBoard.PORT_MAP['right_bt'];

                var DIGITAL = Entry.hw.portData.DIGITAL;
                var value = 0;
                var bt_pressed = 0;
                value = DIGITAL ? DIGITAL[port] || 0 : 0;

                if (Entry.FunBoard.Static.BUTTON_PRESS_VALUE == 0) {
                    bt_pressed = value > 0 ? 0 : 1;
                } else {
                    bt_pressed = value > 0 ? 1 : 0;
                }
                /*
            if(!Entry.hw.sendQueue['GET']) {
                Entry.hw.sendQueue['GET'] = {};
            }
            Entry.hw.sendQueue['GET'][Entry.FunBoard.sensorTypes.DIGITAL] = {
                port: port,
                time: new Date().getTime()
            };
            */

                return bt_pressed;
            },
            syntax: { js: [], py: [] },
        },
        funboard_what_touch_button_pressed: {
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
                        type: 'funboard_list_touchbutton_basic',
                    },
                ],
                type: 'funboard_what_touch_button_pressed',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'funboardget',
            isNotFor: ['funboard'],
            func: function(sprite, script) {
                var port = 0;
                var bt_index = script.getNumberValue('PORT');
                if (bt_index == 1) port = Entry.FunBoard.PORT_MAP['up_bt'];
                else if (bt_index == 2) port = Entry.FunBoard.PORT_MAP['down_bt'];
                else if (bt_index == 3) port = Entry.FunBoard.PORT_MAP['left_bt'];
                else if (bt_index == 4) port = Entry.FunBoard.PORT_MAP['right_bt'];
                else if (bt_index == 5) port = Entry.FunBoard.PORT_MAP['space_touchbt'];
                else if (bt_index == 6) port = Entry.FunBoard.PORT_MAP['enter_touchbt'];
                else if (bt_index == 7) port = Entry.FunBoard.PORT_MAP['escape_touchbt'];

                var value = 0;
                var bt_pressed = 0;

                if (bt_index >= 5) {
                    var ANALOG = Entry.hw.portData.ANALOG;
                    value = ANALOG ? ANALOG[port] || 0 : 0;
                } else {
                    var DIGITAL = Entry.hw.portData.DIGITAL;
                    value = DIGITAL ? DIGITAL[port] || 0 : 0;
                    /*
                if(!Entry.hw.sendQueue['GET']) {
                    Entry.hw.sendQueue['GET'] = {};
                }
                Entry.hw.sendQueue['GET'][Entry.FunBoard.sensorTypes.DIGITAL] = {
                    port: port,
                    time: new Date().getTime()
                };
                */
                }
                if (Entry.FunBoard.Static.BUTTON_PRESS_VALUE == 0) {
                    bt_pressed = value > 0 ? 0 : 1;
                } else {
                    bt_pressed = value > 0 ? 1 : 0;
                }
                return bt_pressed;
            },
            syntax: { js: [], py: [] },
        },
        funboard_get_digital_button_value: {
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
                        type: 'funboard_list_pushbutton_basic',
                    },
                ],
                type: 'funboard_get_digital_button_value',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'funboardget',
            isNotFor: ['funboard'],
            func: function(sprite, script) {
                var port = 0;
                var bt_index = script.getNumberValue('PORT');
                if (bt_index == 1) port = Entry.FunBoard.PORT_MAP['up_bt'];
                else if (bt_index == 2) port = Entry.FunBoard.PORT_MAP['down_bt'];
                else if (bt_index == 3) port = Entry.FunBoard.PORT_MAP['left_bt'];
                else if (bt_index == 4) port = Entry.FunBoard.PORT_MAP['right_bt'];

                var DIGITAL = Entry.hw.portData.DIGITAL;
                var value = 0;
                /*
            if(!Entry.hw.sendQueue['GET']) {
                Entry.hw.sendQueue['GET'] = {};
            }
            Entry.hw.sendQueue['GET'][Entry.FunBoard.sensorTypes.DIGITAL] = {
                port: port,
                time: new Date().getTime()
            };
            */

                // 버튼 눌림 값 그대로...
                value = DIGITAL ? DIGITAL[port] || 0 : 0;
                //누른 경우 1, 아니면 0 으로 알려 준다.
                if (Entry.FunBoard.Static.BUTTON_PRESS_VALUE == 0) {
                    value = value ? 0 : 1;
                }
                return value;
            },
            syntax: { js: [], py: [] },
        },
        funboard_get_touch_button_value: {
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
                        type: 'funboard_list_touchbutton_basic',
                    },
                ],
                type: 'funboard_get_touch_button_value',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'funboardget',
            isNotFor: ['funboard'],
            func: function(sprite, script) {
                var port = 0;
                var bt_index = script.getNumberValue('PORT');
                if (bt_index == 1) port = Entry.FunBoard.PORT_MAP['up_bt'];
                else if (bt_index == 2) port = Entry.FunBoard.PORT_MAP['down_bt'];
                else if (bt_index == 3) port = Entry.FunBoard.PORT_MAP['left_bt'];
                else if (bt_index == 4) port = Entry.FunBoard.PORT_MAP['right_bt'];
                else if (bt_index == 5) port = Entry.FunBoard.PORT_MAP['space_touchbt'];
                else if (bt_index == 6) port = Entry.FunBoard.PORT_MAP['enter_touchbt'];
                else if (bt_index == 7) port = Entry.FunBoard.PORT_MAP['escape_touchbt'];

                var value = 0;
                if (bt_index >= 5) {
                    var ANALOG = Entry.hw.portData.ANALOG;
                    value = ANALOG ? ANALOG[port] || 0 : 0;

                    // 버튼 눌림 값 그대로...
                    value = ANALOG ? ANALOG[port] || 0 : 0;
                    //누른 경우 1, 아니면 0 으로 알려 준다.
                    if (Entry.FunBoard.Static.BUTTON_PRESS_VALUE == 0) {
                        value = value ? 0 : 1;
                    }
                } else {
                    var DIGITAL = Entry.hw.portData.DIGITAL;
                    /*
                if(!Entry.hw.sendQueue['GET']) {
                    Entry.hw.sendQueue['GET'] = {};
                }
                Entry.hw.sendQueue['GET'][Entry.FunBoard.sensorTypes.DIGITAL] = {
                    port: port,
                    time: new Date().getTime()
                };
                */

                    // 버튼 눌림 값 그대로...
                    value = DIGITAL ? DIGITAL[port] || 0 : 0;
                    //누른 경우 1, 아니면 0 으로 알려 준다.
                    if (Entry.FunBoard.Static.BUTTON_PRESS_VALUE == 0) {
                        value = value ? 0 : 1;
                    }
                }
                return value;
            },
            syntax: { js: [], py: [] },
        },
        funboard_get_number_sensor_value: {
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
                        type: 'funboard_list_analogsensor_basic',
                    },
                ],
                type: 'funboard_get_number_sensor_value',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'funboardget',
            isNotFor: ['funboard'],
            func: function(sprite, script) {
                var port = 0;
                var index = script.getValue('PORT', script);
                if (index == 1) port = Entry.FunBoard.PORT_MAP['slide'];
                else if (index == 2) port = Entry.FunBoard.PORT_MAP['cds'];
                else if (index == 3) port = Entry.FunBoard.PORT_MAP['mic'];

                var ANALOG = Entry.hw.portData.ANALOG;
                var value = ANALOG ? ANALOG[port] || 0 : 0;
                return value;
            },
            syntax: { js: [], py: [] },
        },
        funboard_get_analog_sensor_2state: {
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
                {
                    type: 'Block',
                    accept: 'string',
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'funboard_list_analogsensor_basic',
                    },
                    {
                        type: 'funboard_list_2_state_basic',
                    },
                ],
                type: 'funboard_get_analog_sensor_2state',
            },
            paramsKeyMap: {
                PORT: 0,
                STATE: 1,
            },
            class: 'funboardget',
            isNotFor: ['funboard'],
            func: function(sprite, script) {
                var index = script.getValue('PORT', script);
                var state = script.getValue('STATE', script);
                var vmin = 0,
                    vmax = 1023,
                    vlimit;
                var port = 0;
                var mode = 1;
                if (index == 1) port = Entry.FunBoard.PORT_MAP['slide'];
                else if (index == 2) port = Entry.FunBoard.PORT_MAP['cds'];
                else if (index == 3) port = Entry.FunBoard.PORT_MAP['mic'];

                var ANALOG = Entry.hw.portData.ANALOG;
                var value = ANALOG ? ANALOG[port] || 0 : 0;

                vlimit =
                    vmin +
                    Math.max(0, Math.abs(vmax - vmin) * Entry.FunBoard.Static.ANALOG_STATE_PERCENT);

                var ret = 0;
                //작다
                if (state == 1) {
                    if (value < vlimit) ret = 1;
                } else {
                    //크다
                    //if(state == 2)
                    if (value > vlimit) ret = 1;
                }
                return ret;
            },
            syntax: { js: [], py: [] },
        },
        funboard_convert_scale: {
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
                        type: 'funboard_list_analogsensor_basic',
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
                type: 'funboard_convert_scale',
            },
            paramsKeyMap: {
                PORT: 0,
                VALUE2: 1,
                VALUE3: 2,
                VALUE4: 3,
                VALUE5: 4,
            },
            class: 'funboardget',
            isNotFor: ['funboard'],
            func: function(sprite, script) {
                var index = script.getValue('PORT', script);
                var port = 0;
                if (index == 1) port = Entry.FunBoard.PORT_MAP['slide'];
                else if (index == 2) port = Entry.FunBoard.PORT_MAP['cds'];
                else if (index == 3) port = Entry.FunBoard.PORT_MAP['mic'];

                var value2 = script.getNumberValue('VALUE2', script);
                var value3 = script.getNumberValue('VALUE3', script);
                var value4 = script.getNumberValue('VALUE4', script);
                var value5 = script.getNumberValue('VALUE5', script);

                var stringValue4 = script.getValue('VALUE4', script);
                var stringValue5 = script.getValue('VALUE5', script);
                var isFloat = false;
                if (
                    (Entry.Utils.isNumber(stringValue4) && stringValue4.indexOf('.') > -1) ||
                    (Entry.Utils.isNumber(stringValue5) && stringValue5.indexOf('.') > -1)
                ) {
                    isFloat = true;
                }

                var ANALOG = Entry.hw.portData.ANALOG;
                var value1 = ANALOG ? ANALOG[port] || 0 : 0;
                var result = value1;

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
                //return Math.round(result);

                if (isFloat) {
                    result = Math.round(result * 100) / 100;
                } else {
                    result = Math.round(result);
                }
                return result;
            },
            syntax: { js: [], py: [] },
        },
        funboard_set_digital_buzzer: {
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
                    img: 'block_icon/hardware_bzr.png',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'funboard_list_digital_octave',
                    },
                    {
                        type: 'funboard_list_digital_tone',
                    },
                    {
                        type: 'text',
                        params: ['1'],
                    },
                    null,
                ],
                type: 'funboard_set_digital_buzzer',
            },
            paramsKeyMap: {
                OCTAVE: 0,
                NOTE: 1,
                DURATION: 2,
            },
            class: 'funboardset',
            isNotFor: ['funboard'],
            func: function(sprite, script) {
                var port = Entry.FunBoard.PORT_MAP['buzzer'];
                var duration = script.getNumberValue('DURATION');
                var octave = script.getNumberValue('OCTAVE') - 1;
                var value = 0;

                if (!script.isStart) {
                    var note = script.getValue('NOTE');
                    if (!Entry.Utils.isNumber(note)) {
                        note = Entry.FunBoard.toneTable[note];
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
                            type: Entry.FunBoard.sensorTypes.TONE,
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
                        value = Entry.FunBoard.toneMap[note][octave];
                    }

                    duration = duration * 1000;
                    script.isStart = true;
                    script.timeFlag = 1;

                    Entry.hw.sendQueue['SET'][port] = {
                        type: Entry.FunBoard.sensorTypes.TONE,
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
                        type: Entry.FunBoard.sensorTypes.TONE,
                        data: 0,
                        time: new Date().getTime(),
                    };
                    Entry.engine.isContinue = false;

                    return script.callReturn();
                }
            },
            syntax: { js: [], py: [] },
        },
        funboard_buzzer_second: {
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
                    img: 'block_icon/hardware_bzr.png',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'funboard_list_onoff_basic',
                    },
                    {
                        type: 'text',
                        params: ['1'],
                    },
                    null,
                ],
                type: 'funboard_buzzer_second',
            },
            paramsKeyMap: {
                ONOFF: 0,
                DURATION: 1,
            },
            class: 'funboardset',
            isNotFor: ['funboard'],
            func: function(sprite, script) {
                var onoff = script.getNumberValue('ONOFF');
                var duration = script.getNumberValue('DURATION');
                var li_duration = Math.ceil(duration);
                if (li_duration < 1) return script.callReturn();

                if (!script.isStart) {
                    {
                        var port = 0;
                        if (onoff == '1') port = Entry.FunBoard.EventTypes.BUZZER_ON;
                        else port = Entry.FunBoard.EventTypes.BUZZER_OFF;

                        if (!Entry.hw.sendQueue['SET']) {
                            Entry.hw.sendQueue['SET'] = {};
                        }
                        Entry.hw.sendQueue['SET'][port] = {
                            type: Entry.FunBoard.sensorTypes.ETC,
                            data: li_duration,
                            time: new Date().getTime(),
                        };
                    }

                    script.isStart = true;
                    script.timeFlag = 1;
                    var timeValue = li_duration; // * Entry.FunBoard.Static.DELAY_SECOND;
                    var fps = Entry.FPS || 60;
                    timeValue = 60 / fps * timeValue * 1000;
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
            syntax: { js: [], py: [] },
        },
        funboard_buzzer_tone_simple: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.XBOT_c, 'C'],
                        [Lang.Blocks.XBOT_d, 'D'],
                        [Lang.Blocks.XBOT_e, 'E'],
                        [Lang.Blocks.XBOT_f, 'F'],
                        [Lang.Blocks.XBOT_g, 'G'],
                        [Lang.Blocks.XBOT_a, 'A'],
                        [Lang.Blocks.XBOT_b, 'B'],
                    ],
                    value: 'C',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        ['2', '2'],
                        ['3', '3'],
                        ['4', '4'],
                        ['5', '5'],
                        ['6', '6'],
                        ['7', '7'],
                    ],
                    value: '2',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Block',
                    accept: 'string',
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_bzr.png',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [
                    null,
                    '4',
                    {
                        type: 'text',
                        params: ['0.5'],
                    },
                    null,
                ],
                type: 'funboard_buzzer_tone_simple',
            },
            paramsKeyMap: {
                NOTE: 0,
                OCTAVE: 1,
                VALUE: 2,
            },
            class: 'funboardset',
            isNotFor: ['funboard'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var note = script.getStringField('NOTE', script);
                var octave = script.getStringField('OCTAVE', script);
                var duration = script.getNumberValue('VALUE', script);

                var value = 255;
                if (note == 'C') value = 39;
                else if (note == 'D') value = 75;
                else if (note == 'E') value = 111;
                else if (note == 'F') value = 147;
                else if (note == 'G') value = 183;
                else if (note == 'A') value = 219;
                else if (note == 'B') value = 255;
                var port = Entry.FunBoard.PORT_MAP['buzzer'];
                Entry.hw.sendQueue[port] = value;

                return script.callReturn();
            },
            syntax: { js: [], py: [] },
        },
        funboard_buzzer_onoff: {
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
                    img: 'block_icon/hardware_bzr.png',
                    size: 11,
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'funboard_list_onoff_basic',
                    },
                    null,
                ],
                type: 'funboard_buzzer_onoff',
            },
            paramsKeyMap: {
                ONOFF: 0,
            },
            class: 'funboardset',
            isNotFor: ['funboard'],
            func: function(sprite, script) {
                var onoff = script.getNumberValue('ONOFF');

                if (!script.isStart) {
                    {
                        //1 based value
                        var eff_value = Math.floor(Math.random() * (123 - 1)) + 1;

                        var port = 0;
                        if (onoff == '1') port = Entry.FunBoard.EventTypes.BUZZER_ON;
                        else port = Entry.FunBoard.EventTypes.BUZZER_OFF;

                        if (!Entry.hw.sendQueue['SET']) {
                            Entry.hw.sendQueue['SET'] = {};
                        }
                        Entry.hw.sendQueue['SET'][port] = {
                            type: Entry.FunBoard.sensorTypes.ETC,
                            data: eff_value,
                            time: new Date().getTime(),
                        };
                    }

                    script.isStart = true;
                    script.timeFlag = 1;
                    var fps = Entry.FPS || 60;
                    var timeValue = Math.max(1, 3 * Entry.FunBoard.Static.DELAY_SECOND);
                    timeValue = Entry.FunBoard.Static.DELAY_SECOND;
                    timeValue = 60 / fps * timeValue * 1000;
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
            syntax: { js: [], py: [] },
        },
        funboard_color_led_onoff: {
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
                    img: 'block_icon/hardware_led.png',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'funboard_list_ledcolor_basic',
                    },
                    {
                        type: 'funboard_list_onoff_basic',
                    },
                    null,
                ],
                type: 'funboard_color_led_onoff',
            },
            paramsKeyMap: {
                VALUE: 0,
                ONOFF: 1,
            },
            class: 'funboardset',
            isNotFor: ['funboard'],
            func: function(sprite, script) {
                var color_index = script.getNumberValue('VALUE');
                var onoff = script.getValue('ONOFF');

                if (!script.isStart) {
                    {
                        var portR = 0;
                        var portY = 0;
                        var portG = 0;
                        var portB = 0;

                        //on
                        if (onoff == '1') {
                            portR = 0;
                            portY = 0;
                            portG = 0;
                            portB = 0;
                            if (color_index === 1) portR = 255;
                            else if (color_index === 2) portY = 255;
                            else if (color_index === 3) portG = 255;
                            else if (color_index === 4) portB = 255;
                            else if (color_index === 5) {
                                portR = 255;
                                portY = 255;
                                portG = 255;
                                portB = 255;
                            }

                            if (portR > 0) {
                                if (!Entry.hw.sendQueue['SET']) {
                                    Entry.hw.sendQueue['SET'] = {};
                                }
                                Entry.hw.sendQueue['SET'][Entry.FunBoard.PORT_MAP['led_red']] = {
                                    type: Entry.FunBoard.sensorTypes.DIGITAL,
                                    data: portR,
                                    time: new Date().getTime(),
                                };
                            }
                            if (portY > 0) {
                                if (!Entry.hw.sendQueue['SET']) {
                                    Entry.hw.sendQueue['SET'] = {};
                                }
                                Entry.hw.sendQueue['SET'][Entry.FunBoard.PORT_MAP['led_yellow']] = {
                                    type: Entry.FunBoard.sensorTypes.DIGITAL,
                                    data: portY,
                                    time: new Date().getTime(),
                                };
                            }
                            if (portG > 0) {
                                if (!Entry.hw.sendQueue['SET']) {
                                    Entry.hw.sendQueue['SET'] = {};
                                }
                                Entry.hw.sendQueue['SET'][Entry.FunBoard.PORT_MAP['led_green']] = {
                                    type: Entry.FunBoard.sensorTypes.DIGITAL,
                                    data: portG,
                                    time: new Date().getTime(),
                                };
                            }
                            if (portB > 0) {
                                if (!Entry.hw.sendQueue['SET']) {
                                    Entry.hw.sendQueue['SET'] = {};
                                }
                                Entry.hw.sendQueue['SET'][Entry.FunBoard.PORT_MAP['led_blue']] = {
                                    type: Entry.FunBoard.sensorTypes.DIGITAL,
                                    data: portB,
                                    time: new Date().getTime(),
                                };
                            }
                        } else {
                            //off
                            portR = 255;
                            portY = 255;
                            portG = 255;
                            portB = 255;

                            if (color_index === 1) portR = 0;
                            else if (color_index === 2) portY = 0;
                            else if (color_index === 3) portG = 0;
                            else if (color_index === 4) portB = 0;
                            else if (color_index === 5) {
                                portR = 0;
                                portY = 0;
                                portG = 0;
                                portB = 0;
                            }

                            if (portR < 1) {
                                if (!Entry.hw.sendQueue['SET']) {
                                    Entry.hw.sendQueue['SET'] = {};
                                }
                                Entry.hw.sendQueue['SET'][Entry.FunBoard.PORT_MAP['led_red']] = {
                                    type: Entry.FunBoard.sensorTypes.DIGITAL,
                                    data: portR,
                                    time: new Date().getTime(),
                                };
                            }
                            if (portY < 1) {
                                if (!Entry.hw.sendQueue['SET']) {
                                    Entry.hw.sendQueue['SET'] = {};
                                }
                                Entry.hw.sendQueue['SET'][Entry.FunBoard.PORT_MAP['led_yellow']] = {
                                    type: Entry.FunBoard.sensorTypes.DIGITAL,
                                    data: portY,
                                    time: new Date().getTime(),
                                };
                            }
                            if (portG < 1) {
                                if (!Entry.hw.sendQueue['SET']) {
                                    Entry.hw.sendQueue['SET'] = {};
                                }
                                Entry.hw.sendQueue['SET'][Entry.FunBoard.PORT_MAP['led_green']] = {
                                    type: Entry.FunBoard.sensorTypes.DIGITAL,
                                    data: portG,
                                    time: new Date().getTime(),
                                };
                            }
                            if (portB < 1) {
                                if (!Entry.hw.sendQueue['SET']) {
                                    Entry.hw.sendQueue['SET'] = {};
                                }
                                Entry.hw.sendQueue['SET'][Entry.FunBoard.PORT_MAP['led_blue']] = {
                                    type: Entry.FunBoard.sensorTypes.DIGITAL,
                                    data: portB,
                                    time: new Date().getTime(),
                                };
                            }
                        }
                    }

                    script.isStart = true;
                    script.timeFlag = 1;
                    var fps = Entry.FPS || 60;
                    var timeValue = Entry.FunBoard.Static.DELAY_SECOND;
                    timeValue = 60 / fps * timeValue * 1000;
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
            syntax: { js: [], py: [] },
        },
        funboard_color_led_on_pwm: {
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
                    img: 'block_icon/hardware_led.png',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'funboard_list_ledcolor_pwm_basic',
                    },
                    {
                        type: 'text',
                        params: ['100'],
                    },
                    null,
                ],
                type: 'funboard_color_led_on_pwm',
            },
            pyHelpDef: {
                params: [
                    null,
                    {
                        type: 'number',
                        params: ['A&value'],
                    },
                    null,
                ],
                type: 'funboard_color_led_on_pwm',
            },
            paramsKeyMap: {
                VALUE: 0,
                PERCENT: 1,
            },
            class: 'funboardset',
            isNotFor: ['funboard'],
            func: function(sprite, script) {
                var color_index = script.getNumberValue('VALUE');
                var li_percent = script.getNumberValue('PERCENT');
                li_percent = Entry.FunBoard.MinMax(li_percent, 0, 100);
                var pwm_value = Math.round(
                    Entry.FunBoard.Static.FUNBOARD_LED_ON * (li_percent / 100),
                );

                if (!script.isStart) {
                    {
                        var portR = 0;
                        var portY = 0;
                        if (color_index === 1) portR = pwm_value;
                        else if (color_index === 2) portY = pwm_value;

                        if (portR > 0) {
                            if (!Entry.hw.sendQueue['SET']) {
                                Entry.hw.sendQueue['SET'] = {};
                            }
                            Entry.hw.sendQueue['SET'][Entry.FunBoard.PORT_MAP['led_red']] = {
                                type: Entry.FunBoard.sensorTypes.PWM,
                                data: portR,
                                time: new Date().getTime(),
                            };
                        }
                        if (portY > 0) {
                            if (!Entry.hw.sendQueue['SET']) {
                                Entry.hw.sendQueue['SET'] = {};
                            }
                            Entry.hw.sendQueue['SET'][Entry.FunBoard.PORT_MAP['led_yellow']] = {
                                type: Entry.FunBoard.sensorTypes.PWM,
                                data: portY,
                                time: new Date().getTime(),
                            };
                        }
                    }

                    script.isStart = true;
                    script.timeFlag = 1;
                    var fps = Entry.FPS || 60;
                    var timeValue = Entry.FunBoard.Static.DELAY_SECOND;
                    timeValue = 60 / fps * timeValue * 1000;
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
            syntax: { js: [], py: [] },
        },
        funboard_dotmatrix_intensity: {
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
                    img: 'block_icon/hardware_ledx.png',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'text',
                        params: ['100'],
                    },
                    null,
                ],
                type: 'funboard_dotmatrix_intensity',
            },
            pyHelpDef: {
                params: [
                    {
                        type: 'number',
                        params: ['A&value'],
                    },
                    null,
                ],
                type: 'funboard_color_led_on_pwm',
            },
            paramsKeyMap: {
                PERCENT: 0,
            },
            class: 'funboardsetmatrix',
            isNotFor: ['funboard'],
            func: function(sprite, script) {
                var li_percent = script.getNumberValue('PERCENT');
                //1-based value (setZero와 구별)
                li_percent = Entry.FunBoard.MinMax(li_percent, 0, 100);
                li_percent = li_percent + 1;

                if (!script.isStart) {
                    {
                        var port = Entry.FunBoard.EventTypes.MATRIX_INTENSITY;

                        if (!Entry.hw.sendQueue['SET']) {
                            Entry.hw.sendQueue['SET'] = {};
                        }
                        Entry.hw.sendQueue['SET'][port] = {
                            type: Entry.FunBoard.sensorTypes.ETC,
                            data: li_percent,
                            time: new Date().getTime(),
                        };
                    }

                    script.isStart = true;
                    script.timeFlag = 1;
                    var fps = Entry.FPS || 60;
                    var timeValue = 1 * Entry.FunBoard.Static.DELAY_SECOND;
                    timeValue = 60 / fps * timeValue * 1000;
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
            syntax: { js: [], py: [] },
        },
        funboard_dotmatrix_scroll_option: {
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
                    img: 'block_icon/hardware_ledx.png',
                    size: 11,
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'funboard_list_matrix_scroll_option',
                    },
                    null,
                ],
                type: 'funboard_dotmatrix_scroll_option',
            },
            paramsKeyMap: {
                OPTION: 0,
            },
            class: 'funboardsetmatrix',
            isNotFor: ['funboard'],
            func: function(sprite, script) {
                var value = script.getValue('OPTION', script);
                if (value.length < 1) return script.callReturn();

                if (!script.isStart) {
                    var port = Entry.FunBoard.EventTypes.MATRIX_SCROLL_DIR;
                    if (!Entry.hw.sendQueue['SET']) {
                        Entry.hw.sendQueue['SET'] = {};
                    }
                    script.isStart = true;
                    script.timeFlag = 1;
                    var fps = Entry.FPS || 60;
                    var timeValue = Entry.FunBoard.Static.DELAY_SECOND;
                    timeValue = 60 / fps * timeValue * 1000;
                    Entry.hw.sendQueue['SET'][port] = {
                        type: Entry.FunBoard.sensorTypes.ETC,
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
            syntax: { js: [], py: [] },
        },
        funboard_dotmatrix_scroll_rapid: {
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
                    img: 'block_icon/hardware_ledx.png',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'text',
                        params: ['100'],
                    },
                    null,
                ],
                type: 'funboard_dotmatrix_scroll_rapid',
            },
            pyHelpDef: {
                params: [
                    {
                        type: 'number',
                        params: ['A&value'],
                    },
                    null,
                ],
                type: 'funboard_color_led_on_pwm',
            },
            paramsKeyMap: {
                PERCENT: 0,
            },
            class: 'funboardsetmatrix',
            isNotFor: ['funboard'],
            func: function(sprite, script) {
                var li_percent = script.getNumberValue('PERCENT');
                //1-based value로 (setZero와 구별)
                li_percent = Entry.FunBoard.MinMax(li_percent, 0, 100);
                li_percent = li_percent + 1;

                if (!script.isStart) {
                    {
                        var port = Entry.FunBoard.EventTypes.MATRIX_SCROLL_RAPID;
                        if (!Entry.hw.sendQueue['SET']) {
                            Entry.hw.sendQueue['SET'] = {};
                        }
                        Entry.hw.sendQueue['SET'][port] = {
                            type: Entry.FunBoard.sensorTypes.ETC,
                            data: li_percent,
                            time: new Date().getTime(),
                        };
                    }

                    script.isStart = true;
                    script.timeFlag = 1;
                    var fps = Entry.FPS || 60;
                    var timeValue = Entry.FunBoard.Static.DELAY_SECOND;
                    timeValue = 60 / fps * timeValue * 1000;
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
            syntax: { js: [], py: [] },
        },
        funboard_dotmatrix_onoff: {
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
                    img: 'block_icon/hardware_ledx.png',
                    size: 11,
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'funboard_list_onoff_basic',
                    },
                    null,
                ],
                type: 'funboard_dotmatrix_onoff',
            },
            paramsKeyMap: {
                ONOFF: 0,
            },
            class: 'funboardsetmatrix',
            isNotFor: ['funboard'],
            func: function(sprite, script) {
                var onoff = script.getValue('ONOFF', script);
                var eff_value = Math.floor(Math.random() * (123 - 1)) + 1;

                if (!script.isStart) {
                    var port = Entry.FunBoard.EventTypes.MATRIX_OFF_ALL;
                    if (onoff == '1') port = Entry.FunBoard.EventTypes.MATRIX_ON_ALL;

                    if (!Entry.hw.sendQueue['SET']) {
                        Entry.hw.sendQueue['SET'] = {};
                    }

                    script.isStart = true;
                    script.timeFlag = 1;
                    var fps = Entry.FPS || 60;
                    var timeValue = 1 * Entry.FunBoard.Static.DELAY_SECOND;
                    timeValue = 60 / fps * timeValue * 1000;

                    Entry.hw.sendQueue['SET'][port] = {
                        type: Entry.FunBoard.sensorTypes.ETC,
                        data: eff_value,
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
            syntax: { js: [], py: [] },
        },
        funboard_dotmatrix_char_display: {
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
                    img: 'block_icon/hardware_ledx.png',
                    size: 11,
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'funboard_list_matrix_char',
                    },
                    null,
                ],
                type: 'funboard_dotmatrix_char_display',
            },
            paramsKeyMap: {
                VALUE: 0,
            },
            class: 'funboardsetmatrix',
            isNotFor: ['funboard'],
            func: function(sprite, script) {
                var string = script.getValue('VALUE', script);
                if (string.length < 1) {
                    return script.callReturn();
                }

                //1개 문자만 허용
                var char_tot = 1;

                if (!script.isStart) {
                    var port = Entry.FunBoard.EventTypes.CHAR_OUT;

                    var text = [];
                    if (typeof string === 'string') {
                        for (var i = 0; i < char_tot; i++) {
                            text[i] = Entry.FunBoard.toByte(string[i]);
                        }
                    } else {
                        text[0] = string[0];
                    }

                    if (!Entry.hw.sendQueue['SET']) {
                        Entry.hw.sendQueue['SET'] = {};
                    }

                    script.isStart = true;
                    script.timeFlag = 1;
                    var fps = Entry.FPS || 60;
                    var timeValue = (char_tot + 0.5) * Entry.FunBoard.Static.DELAY_SECOND;
                    timeValue = 60 / fps * timeValue * 1000;

                    Entry.hw.sendQueue['SET'][port] = {
                        type: Entry.FunBoard.sensorTypes.MATRIX,
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
            syntax: { js: [], py: [] },
        },
        funboard_dotmatrix_string_display: {
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
                    img: 'block_icon/hardware_ledx.png',
                    size: 11,
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'text',
                        params: ['A'],
                    },
                    null,
                ],
                type: 'funboard_dotmatrix_string_display',
            },
            pyHelpDef: {
                params: [
                    {
                        type: 'text',
                        params: ['A&value'],
                    },
                    null,
                ],
                type: 'funboard_dotmatrix_string_display',
            },
            paramsKeyMap: {
                VALUE: 0,
            },
            class: 'funboardsetmatrix',
            isNotFor: ['funboard'],
            func: function(sprite, script) {
                var string = script.getValue('VALUE', script);
                if (string.length < 1) {
                    return script.callReturn();
                }
                var char_tot = Math.min(
                    string.length,
                    Entry.FunBoard.Static.FUNBOARD_MATRIX_STRING_MAX,
                );

                if (!script.isStart) {
                    var port = Entry.FunBoard.EventTypes.STR_OUT_DEFAULT;

                    var text = [];
                    if (typeof string === 'string') {
                        for (var i = 0; i < char_tot; i++) {
                            text[i] = Entry.FunBoard.toByte(string[i]);
                        }
                    } else {
                        text[0] = string[0];
                    }

                    if (!Entry.hw.sendQueue['SET']) {
                        Entry.hw.sendQueue['SET'] = {};
                    }

                    script.isStart = true;
                    script.timeFlag = 1;
                    var fps = Entry.FPS || 60;
                    var timeValue = char_tot * Entry.FunBoard.Static.DELAY_SECOND;
                    //scroll//var timeValue = (char_tot*3)*Entry.FunBoard.Static.DELAY_SECOND;
                    timeValue = 60 / fps * timeValue * 1000;

                    Entry.hw.sendQueue['SET'][port] = {
                        type: Entry.FunBoard.sensorTypes.MATRIX,
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
            syntax: { js: [], py: [] },
        },
        funboard_dotmatrix_string_display_scroll: {
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
                    img: 'block_icon/hardware_ledx.png',
                    size: 11,
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'text',
                        params: ['A'],
                    },
                    {
                        type: 'funboard_list_matrix_scroll_option',
                    },
                    null,
                ],
                type: 'funboard_dotmatrix_string_display_scroll',
            },
            pyHelpDef: {
                params: [
                    {
                        type: 'text',
                        params: ['A&value'],
                    },
                    {
                        type: 'text',
                        params: ['A&value'],
                    },
                    null,
                ],
                type: 'funboard_dotmatrix_string_display_scroll',
            },
            paramsKeyMap: {
                VALUE: 0,
                SCROLL: 1,
            },
            class: 'funboardsetmatrix',
            isNotFor: ['funboard'],
            func: function(sprite, script) {
                var string = script.getValue('VALUE', script);
                var scroll_opt = script.getValue('SCROLL', script);
                if (string.length < 1) return script.callReturn();

                var char_tot = Math.min(
                    string.length,
                    Entry.FunBoard.Static.FUNBOARD_MATRIX_STRING_MAX,
                );

                if (!script.isStart) {
                    var port = Entry.FunBoard.EventTypes.STR_OUT_NO_SCROLL;
                    if (scroll_opt == '1') port = Entry.FunBoard.EventTypes.STR_OUT_NO_SCROLL;
                    else if (scroll_opt == '2') port = Entry.FunBoard.EventTypes.STR_OUT_LEFT;
                    else if (scroll_opt == '3') port = Entry.FunBoard.EventTypes.STR_OUT_UP;
                    else if (scroll_opt == '4') port = Entry.FunBoard.EventTypes.STR_OUT_RIGHT;
                    else if (scroll_opt == '5') port = Entry.FunBoard.EventTypes.STR_OUT_DOWN;

                    var text = [];
                    if (typeof string === 'string') {
                        for (var i = 0; i < char_tot; i++) {
                            text[i] = Entry.FunBoard.toByte(string[i]);
                        }
                    } else {
                        text[0] = string[0];
                    }

                    if (!Entry.hw.sendQueue['SET']) {
                        Entry.hw.sendQueue['SET'] = {};
                    }

                    Entry.hw.sendQueue['SET'][port] = {
                        type: Entry.FunBoard.sensorTypes.MATRIX,
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

                    script.isStart = true;
                    script.timeFlag = 1;
                    var fps = Entry.FPS || 60;
                    //var timeValue = char_tot*Entry.FunBoard.Static.DELAY_SECOND;
                    var timeValue = char_tot;
                    //var timeValue = Math.ceil(char_tot*0.6);
                    //var timeValue = (char_tot*0.8);
                    timeValue = 60 / fps * timeValue * 1000;
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
                py: [],
            },
        },
        funboard_dotmatrix_symbol: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['♥', '1'],
                        ['♡', '2'],
                        ['↑', '3'],
                        ['↓', '4'],
                        ['←', '5'],
                        ['→', '6'],
                        ['■', '7'],
                        ['◆', '8'],
                        ['●', '9'],
                        ['※', '10'],
                    ],
                    value: '1',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_ledx.png',
                    size: 11,
                },
            ],
            events: {},
            def: {
                params: [null, null],
                type: 'funboard_dotmatrix_symbol',
            },
            paramsKeyMap: {
                VALUE: 0,
            },
            class: 'funboardsetmatrix',
            isNotFor: ['funboard'],
            func: function(sprite, script) {
                var string = script.getField('VALUE');
                //1 based value (setZero 구별)
                var value = parseInt(string);
                if (value < 1 || value > Entry.FunBoard.Static.MATRIX_REGISTED_SYMBOL_TOTAL) {
                    return script.callReturn();
                }

                if (!script.isStart) {
                    var port = Entry.FunBoard.EventTypes.MATRIX_SYMBOL_OUT;

                    if (!Entry.hw.sendQueue['SET']) {
                        Entry.hw.sendQueue['SET'] = {};
                    }
                    Entry.hw.sendQueue['SET'][port] = {
                        type: Entry.FunBoard.sensorTypes.ETC,
                        data: value,
                        time: new Date().getTime(),
                    };

                    script.isStart = true;
                    script.timeFlag = 1;
                    var fps = Entry.FPS || 60;
                    var timeValue = 1 * Entry.FunBoard.Static.DELAY_SECOND;
                    timeValue = 60 / fps * timeValue * 1000;
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
            syntax: { js: [], py: [] },
        },
        funboard_dotmatrix_num: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
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
                    ],
                    value: '1',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_ledx.png',
                    size: 11,
                },
            ],
            events: {},
            def: {
                params: [null, null],
                type: 'funboard_dotmatrix_num',
            },
            paramsKeyMap: {
                VALUE: 0,
            },
            class: 'funboardsetmatrix',
            isNotFor: ['funboard'],
            func: function(sprite, script) {
                var string = script.getField('VALUE');
                var char_index = parseInt(string);
                if (char_index < 0 || string.length < 1) {
                    return script.callReturn();
                }
                var char_tot = Math.min(
                    string.length,
                    Entry.FunBoard.Static.FUNBOARD_MATRIX_STRING_MAX,
                );

                if (!script.isStart) {
                    var port = Entry.FunBoard.EventTypes.STR_OUT_NO_SCROLL;

                    var text = [];
                    if (typeof string === 'string') {
                        for (var i = 0; i < char_tot; i++) {
                            text[i] = Entry.FunBoard.toByte(string[i]);
                        }
                    } else {
                        text[0] = string[0];
                    }

                    if (!Entry.hw.sendQueue['SET']) {
                        Entry.hw.sendQueue['SET'] = {};
                    }

                    script.isStart = true;
                    script.timeFlag = 1;
                    var fps = Entry.FPS || 60;
                    var timeValue = char_tot * Entry.FunBoard.Static.DELAY_SECOND;
                    timeValue = 60 / fps * timeValue * 1000;

                    Entry.hw.sendQueue['SET'][port] = {
                        type: Entry.FunBoard.sensorTypes.MATRIX,
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
            syntax: { js: [], py: [] },
        },
        funboard_dotmatrix_big_eng: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['A', 'A'],
                        ['B', 'B'],
                        ['C', 'C'],
                        ['D', 'D'],
                        ['E', 'E'],
                        ['F', 'F'],
                        ['G', 'G'],
                        ['H', 'H'],
                        ['I', 'I'],
                        ['J', 'J'],
                        ['K', 'K'],
                        ['L', 'L'],
                        ['M', 'M'],
                        ['N', 'N'],
                        ['O', 'O'],
                        ['P', 'P'],
                        ['Q', 'Q'],
                        ['R', 'R'],
                        ['S', 'S'],
                        ['T', 'T'],
                        ['U', 'U'],
                        ['V', 'V'],
                        ['W', 'W'],
                        ['X', 'X'],
                        ['Y', 'Y'],
                        ['Z', 'Z'],
                    ],
                    value: 'A',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_ledx.png',
                    size: 11,
                },
            ],
            events: {},
            def: {
                params: [null, null],
                type: 'funboard_dotmatrix_big_eng',
            },
            paramsKeyMap: {
                VALUE: 0,
            },
            class: 'funboardsetmatrix',
            isNotFor: ['funboard'],
            func: function(sprite, script) {
                var string = script.getField('VALUE');
                if (string.length < 1) {
                    return script.callReturn();
                }
                var char_tot = Math.min(
                    string.length,
                    Entry.FunBoard.Static.FUNBOARD_MATRIX_STRING_MAX,
                );

                if (!script.isStart) {
                    var port = Entry.FunBoard.EventTypes.STR_OUT_NO_SCROLL;

                    var text = [];
                    if (typeof string === 'string') {
                        for (var i = 0; i < char_tot; i++) {
                            text[i] = Entry.FunBoard.toByte(string[i]);
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
                    var timeValue = char_tot * Entry.FunBoard.Static.DELAY_SECOND;
                    timeValue = 60 / fps * timeValue * 1000;

                    Entry.hw.sendQueue['SET'][port] = {
                        type: Entry.FunBoard.sensorTypes.MATRIX,
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
            syntax: { js: [], py: [] },
        },
        funboard_dotmatrix_small_eng: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['a', 'a'],
                        ['b', 'b'],
                        ['c', 'c'],
                        ['d', 'd'],
                        ['e', 'e'],
                        ['f', 'f'],
                        ['g', 'g'],
                        ['h', 'h'],
                        ['i', 'i'],
                        ['j', 'j'],
                        ['k', 'k'],
                        ['l', 'l'],
                        ['m', 'm'],
                        ['n', 'n'],
                        ['o', 'o'],
                        ['p', 'p'],
                        ['q', 'q'],
                        ['r', 'r'],
                        ['s', 's'],
                        ['t', 't'],
                        ['u', 'u'],
                        ['v', 'v'],
                        ['w', 'w'],
                        ['x', 'x'],
                        ['y', 'y'],
                        ['z', 'z'],
                    ],
                    value: 'a',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_ledx.png',
                    size: 11,
                },
            ],
            events: {},
            def: {
                params: [null, null],
                type: 'funboard_dotmatrix_small_eng',
            },
            paramsKeyMap: {
                VALUE: 0,
            },
            class: 'funboardsetmatrix',
            isNotFor: ['funboard'],
            func: function(sprite, script) {
                var string = script.getField('VALUE');
                if (string.length < 1) {
                    return script.callReturn();
                }
                var char_tot = Math.min(
                    string.length,
                    Entry.FunBoard.Static.FUNBOARD_MATRIX_STRING_MAX,
                );

                if (!script.isStart) {
                    var port = Entry.FunBoard.EventTypes.STR_OUT_NO_SCROLL;

                    var text = [];
                    if (typeof string === 'string') {
                        for (var i = 0; i < char_tot; i++) {
                            text[i] = Entry.FunBoard.toByte(string[i]);
                        }
                    } else {
                        text[0] = string[0];
                    }

                    if (!Entry.hw.sendQueue['SET']) {
                        Entry.hw.sendQueue['SET'] = {};
                    }

                    script.isStart = true;
                    script.timeFlag = 1;
                    var fps = Entry.FPS || 60;
                    var timeValue = char_tot * Entry.FunBoard.Static.DELAY_SECOND;
                    timeValue = 60 / fps * timeValue * 1000;

                    Entry.hw.sendQueue['SET'][port] = {
                        type: Entry.FunBoard.sensorTypes.MATRIX,
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
            syntax: { js: [], py: [] },
        },
        funboard_dotmatrix_extra_char: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['!', '!'],
                        ['?', '?'],
                        ['#', '#'],
                        ['$', '$'],
                        ['%', '%'],
                        ['&', '&'],
                        ['*', '*'],
                        ['+', '+'],
                        ['-', '-'],
                        ['/', '/'],
                        ['~', '~'],
                        ['^', '^'],
                        ['_', '_'],
                        ['@', '@'],
                        ['<', '<'],
                        ['>', '>'],
                        [
                            '=',
                            '=',
                        ] /*,
                    ["(","("],
                    [")",")"],
                    ["[","["],
                    ["]","]"],
                    ["{","{"],
                    ["}","}"],
                    [",",","],
                    [".","."],
                    [":",":"],
                    [";",";"],
                    ["'","'"],
                    ["`","`"],
                    ["\\","\\"],
                    ["|","|"]
                    */,
                    ],
                    value: '!',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_ledx.png',
                    size: 11,
                },
            ],
            events: {},
            def: {
                params: [null, null],
                type: 'funboard_dotmatrix_extra_char',
            },
            paramsKeyMap: {
                VALUE: 0,
            },
            class: 'funboardsetmatrix',
            isNotFor: ['funboard'],
            func: function(sprite, script) {
                var string = script.getField('VALUE');
                if (string.length < 1) {
                    return script.callReturn();
                }
                var char_tot = Math.min(
                    string.length,
                    Entry.FunBoard.Static.FUNBOARD_MATRIX_STRING_MAX,
                );

                if (!script.isStart) {
                    var port = Entry.FunBoard.EventTypes.STR_OUT_NO_SCROLL;

                    var text = [];
                    if (typeof string === 'string') {
                        for (var i = 0; i < char_tot; i++) {
                            text[i] = Entry.FunBoard.toByte(string[i]);
                        }
                    } else {
                        text[0] = string[0];
                    }
                    if (!Entry.hw.sendQueue['SET']) {
                        Entry.hw.sendQueue['SET'] = {};
                    }

                    script.isStart = true;
                    script.timeFlag = 1;
                    var fps = Entry.FPS || 60;
                    var timeValue = char_tot * Entry.FunBoard.Static.DELAY_SECOND;
                    timeValue = 60 / fps * timeValue * 1000;

                    Entry.hw.sendQueue['SET'][port] = {
                        type: Entry.FunBoard.sensorTypes.MATRIX,
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
            syntax: { js: [], py: [] },
        },
        funboard_dotmatrix_1row: {
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
                    img: 'block_icon/hardware_ledx.png',
                    size: 11,
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'funboard_list_matrix_rows',
                    },
                    {
                        type: 'text',
                        params: ['00000000'],
                    },
                    null,
                ],
                type: 'funboard_dotmatrix_1row',
            },
            paramsKeyMap: {
                WHAT: 0,
                BIT8: 1,
            },
            class: 'funboardsetmatrix',
            isNotFor: ['funboard'],
            func: function(sprite, script) {
                var str = script.getNumberValue('WHAT');
                var str_bit8 = script.getStringValue('BIT8', script);

                var charset = '1#*';
                var pos = -1;
                var str3 = '';
                //8개 column 값
                for (var i = 0; i < 8; i++) {
                    pos = -1;
                    if (i < str_bit8.length) pos = charset.indexOf(str_bit8[i]);
                    if (pos < 0) str3 = str3.concat('0');
                    else str3 = str3.concat('1');
                }

                if (!script.isStart) {
                    var port = Entry.FunBoard.EventTypes.SET_ROW1;
                    var text = [];
                    text[0] = str;
                    text[1] = Entry.FunBoard.toByte(str3[0]);
                    text[2] = Entry.FunBoard.toByte(str3[1]);
                    text[3] = Entry.FunBoard.toByte(str3[2]);
                    text[4] = Entry.FunBoard.toByte(str3[3]);
                    text[5] = Entry.FunBoard.toByte(str3[4]);
                    text[6] = Entry.FunBoard.toByte(str3[5]);
                    text[7] = Entry.FunBoard.toByte(str3[6]);
                    text[8] = Entry.FunBoard.toByte(str3[7]);

                    if (!Entry.hw.sendQueue['SET']) {
                        Entry.hw.sendQueue['SET'] = {};
                    }

                    script.isStart = true;
                    script.timeFlag = 1;
                    var fps = Entry.FPS || 60;
                    var timeValue = Entry.FunBoard.Static.DELAY_SECOND;
                    //timeValue = 60/fps*timeValue*1000;
                    timeValue = 60 / fps * 50;

                    Entry.hw.sendQueue['SET'][port] = {
                        type: Entry.FunBoard.sensorTypes.MATRIX,
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
                        value: 0,
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
            syntax: { js: [], py: [] },
        },
        funboard_dotmatrix_1column: {
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
                    img: 'block_icon/hardware_ledx.png',
                    size: 11,
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'funboard_list_matrix_rows',
                    },
                    {
                        type: 'text',
                        params: ['00000000'],
                    },
                    null,
                ],
                type: 'funboard_dotmatrix_1column',
            },
            paramsKeyMap: {
                WHAT: 0,
                BIT8: 1,
            },
            class: 'funboardsetmatrix',
            isNotFor: ['funboard'],
            func: function(sprite, script) {
                var str = script.getNumberValue('WHAT');
                var str_bit8 = script.getStringValue('BIT8', script);

                var charset = '1#*';
                var pos = -1;
                var str3 = '';
                //8개 row 값
                for (var i = 0; i < 8; i++) {
                    pos = -1;
                    if (i < str_bit8.length) pos = charset.indexOf(str_bit8[i]);
                    if (pos < 0) str3 = str3.concat('0');
                    else str3 = str3.concat('1');
                }

                var port = Entry.FunBoard.EventTypes.SET_COL1;

                if (!script.isStart) {
                    var text = [];
                    text[0] = str;
                    text[1] = Entry.FunBoard.toByte(str3[0]);
                    text[2] = Entry.FunBoard.toByte(str3[1]);
                    text[3] = Entry.FunBoard.toByte(str3[2]);
                    text[4] = Entry.FunBoard.toByte(str3[3]);
                    text[5] = Entry.FunBoard.toByte(str3[4]);
                    text[6] = Entry.FunBoard.toByte(str3[5]);
                    text[7] = Entry.FunBoard.toByte(str3[6]);
                    text[8] = Entry.FunBoard.toByte(str3[7]);

                    if (!Entry.hw.sendQueue['SET']) {
                        Entry.hw.sendQueue['SET'] = {};
                    }

                    script.isStart = true;
                    script.timeFlag = 1;
                    var fps = Entry.FPS || 60;
                    var timeValue = Entry.FunBoard.Static.DELAY_SECOND;
                    //timeValue = 60/fps*timeValue*1000;
                    timeValue = 60 / fps * 50;

                    Entry.hw.sendQueue['SET'][port] = {
                        type: Entry.FunBoard.sensorTypes.MATRIX,
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
                        value: 0,
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
            syntax: { js: [], py: [] },
        },
        funboard_dotmatrix_1row_1column: {
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
                    type: 'Indicator',
                    img: 'block_icon/hardware_ledx.png',
                    size: 11,
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'funboard_list_matrix_rows',
                    },
                    {
                        type: 'funboard_list_matrix_row_or_column',
                    },
                    {
                        type: 'text',
                        params: ['00000000'],
                    },
                    null,
                ],
                type: 'funboard_dotmatrix_1row_1column',
            },
            paramsKeyMap: {
                WHAT: 0,
                HOW: 1,
                BIT8: 2,
            },
            class: 'funboardsetmatrix',
            isNotFor: ['funboard'],
            func: function(sprite, script) {
                var str = script.getNumberValue('WHAT');
                var how = script.getNumberValue('HOW');
                var str_bit8 = script.getStringValue('BIT8', script);

                var charset = '1#*';
                var pos = -1;
                var str3 = '';
                //8개 값
                for (var i = 0; i < 8; i++) {
                    pos = -1;
                    if (i < str_bit8.length) pos = charset.indexOf(str_bit8[i]);
                    if (pos < 0) str3 = str3.concat('0');
                    else str3 = str3.concat('1');
                }

                var port = Entry.FunBoard.EventTypes.SET_ROW1;
                if (how == '2') port = Entry.FunBoard.EventTypes.SET_COL1;

                if (!script.isStart) {
                    var text = [];
                    text[0] = str;
                    text[1] = Entry.FunBoard.toByte(str3[0]);
                    text[2] = Entry.FunBoard.toByte(str3[1]);
                    text[3] = Entry.FunBoard.toByte(str3[2]);
                    text[4] = Entry.FunBoard.toByte(str3[3]);
                    text[5] = Entry.FunBoard.toByte(str3[4]);
                    text[6] = Entry.FunBoard.toByte(str3[5]);
                    text[7] = Entry.FunBoard.toByte(str3[6]);
                    text[8] = Entry.FunBoard.toByte(str3[7]);

                    if (!Entry.hw.sendQueue['SET']) {
                        Entry.hw.sendQueue['SET'] = {};
                    }

                    script.isStart = true;
                    script.timeFlag = 1;
                    var fps = Entry.FPS || 60;
                    var timeValue = Entry.FunBoard.Static.DELAY_SECOND;
                    //timeValue = 60/fps*timeValue*1000;
                    timeValue = 60 / fps * 50;

                    Entry.hw.sendQueue['SET'][port] = {
                        type: Entry.FunBoard.sensorTypes.MATRIX,
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
                        value: 0,
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
                py: [],
            },
        },
        funboard_dotmatrix_set: {
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
                    type: 'Indicator',
                    img: 'block_icon/hardware_ledx.png',
                    size: 11,
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'funboard_list_matrix_rows',
                    },
                    {
                        type: 'funboard_list_matrix_rows',
                    },
                    {
                        type: 'funboard_list_onoff_basic',
                    },
                    null,
                ],
                type: 'funboard_dotmatrix_set',
            },
            paramsKeyMap: {
                ROW: 0,
                COL: 1,
                ONOFF: 2,
            },
            class: 'funboardsetmatrix',
            isNotFor: ['funboard'],
            func: function(sprite, script) {
                var str_row = script.getNumberValue('ROW');
                var str_col = script.getNumberValue('COL');
                var str_onoff = script.getValue('ONOFF');

                var port = Entry.FunBoard.EventTypes.SET_ROW_COL;

                if (!script.isStart) {
                    var text = [];
                    text[0] = str_row;
                    text[1] = str_col;
                    text[2] = str_onoff;

                    if (!Entry.hw.sendQueue['SET']) {
                        Entry.hw.sendQueue['SET'] = {};
                    }

                    script.isStart = true;
                    script.timeFlag = 1;
                    var fps = Entry.FPS || 60;
                    var timeValue = Entry.FunBoard.Static.DELAY_SECOND;
                    //timeValue = 60/fps*timeValue*1000;
                    timeValue = 60 / fps * 50;

                    Entry.hw.sendQueue['SET'][port] = {
                        type: Entry.FunBoard.sensorTypes.MATRIX,
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
                        value: 0,
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
            syntax: { js: [], py: [] },
        },
        //endregion FunBoard
    };
};

module.exports = Entry.FunBoard;
