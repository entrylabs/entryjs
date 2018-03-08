'use strict';


Entry.FunBoard = {
    // isNotFor": [ "funboard" ] 값
    name: 'funboard',
    Static: {
        FUNBOARD_BLOCK_COLOR: '#00979D', // gray(#848484)
        FUNBOARD_ARROW_COLOR_HW: '#00979D',
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
                Entry.hw.sendQueue.SET[key].type =
                    Entry.FunBoard.sensorTypes.ETC;
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
            (Entry.Utils.isNumber(stringValue4) &&
                stringValue4.indexOf('.') > -1) ||
            (Entry.Utils.isNumber(stringValue5) &&
                stringValue5.indexOf('.') > -1)
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
