'use strict';

Entry.castarter_v2 = {
    id: '4D.1',
    name: 'castarter_v2',
    url: 'http://codingarray.cc/',
    imageName: 'castarter_v2.png',
    title: {
        ko: '2세대 코딩어레이 스타터',
        en: '2nd Coding Array Starter',
    },
    setZero: function() {
        if (!Entry.hw.sendQueue.SET) {
            Entry.hw.sendQueue = {
                GET: {},
                SET: {},
            };
        } else {
            let keySet = Object.keys(Entry.hw.sendQueue.SET);
            keySet.forEach(function(key) {
                Entry.hw.sendQueue.SET[key].data = 0;
                Entry.hw.sendQueue.SET[key].time = new Date().getTime();
            });
        }
        Entry.hw.update();
    },
    pins: {},
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
        NEOPIXELINIT: 11,
        NEOPIXELDIS: 12,
        LCDINIT: 14,
        LCD_DIS: 15,
        LCDCLEAR: 16,
        LCDOPTION: 17,
        DHTTEMP: 26,
        DHTHUMI: 27,
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
    },
    waitMilliSec(milli) {
        this.blockReq = true;
        setTimeout(() => {
            this.blockReq = false;
        }, milli);
    },
    getOffsetX(str) {
        return this.getByteLength(str) * 1.5 - 5;
    },
    getByteLength(s, b, i, c) {
        for (b = i = 0; (c = s.charCodeAt(i++)); b += c >> 11 ? 3 : c >> 7 ? 2 : 1);
        return b;
    },
    BlockState: {},
};
Entry.castarter_v2.setLanguage = function () {
    return {
        ko: {
            Blocks: {
                led_on: '켜기',
                led_off: '끄기',
                emoticonHeart:'하트',
                emoticonSmile:'웃음',
                emoticonSad:'슬픔',
                emoticonTempsimbol:'온도 이미지',
                emoticonTempsine:'온도 °C 기호',
                emoticonHumisimbol:'습도 이미지',
            },
            template: {
                castarterv2_get_Analog_title:'아날로그 입력',
                castarterv2_get_analog_value: '아날로그 %1번 센서 값 ',
                castarterv2_get_analog_value_map: '아날로그 %1번 센서 (%2~%3)값의 범위를 [%4~%5]으로 바꾼 값',
                castarterv2_get_digital_title:'디지털 입력',
                castarterv2_get_digital_dis: '디지털 %1 번 센서 값 ( LCD에 프린트 )',
                castarterv2_get_digital: '디지털 %1 번 센서 값',
                castarterv2_get_ultrasonic_title:'초음파 센서 값 입력',
                castarterv2_get_ultrasonic_init: '초음파 센서 Trig%1번,  Echo%2번 센서 사용하기 %3 ',
                castarterv2_get_ultrasonic_value: '초음파 센서 값 (Cm) ',
                castarterv2_set_digital_title:'디지털 출력',
                castarterv2_set_toggle_pin: '디지털 %1번을 %2  %3',
                castarterv2_set_digital_pwm: '디지털 %1번을 아날로그 값 %2으로 정하기 %3',
                castarterv2_set_tone_title:'피에조 부저 출력',
                castarterv2_set_tone: '디지털 %1번 부저를 %2%3음으로%4초간 연주하기 %5',
                castarterv2_set_servo_title:'서보 모터 출력',
                castarterv2_set_servo: '디지털 %1번 서보모터를 %2도 각도로 정하기 %3',
                castarterv2_set_analog_rgbled_title:'코딩어레이 RGB LED 아날로그(PWM) 출력',
                castarterv2_set_analog_rgbled: 'RGB LED의 빨강:%1, 초록:%2, 파랑:%3으로 아날로그 값 정하기%4',
                castarterv2_set_neopixel_title:'네오픽셀 RGB LED 출력',
                castarterv2_set_neopixel_init:'디지털%1번에 네오픽셀%2개를 사용하기 %3',
                castarterv2_set_neopixel_dis:'디지털%1번에 네오픽셀%2번째 빨강:%3,녹색:%4,파랑:%5으로 정하기 %6',
                castarterv2_set_i2clcd_title:'I2C 1602 LCD 프린트',
                castarterv2_set_i2clcd_init: 'I2C 1602 LCD 사용하기 %1',
                castarterv2_set_i2clcd_print: 'LCD의%1번째 줄, %2번째 칸에%3 프린트하기 %4',
                castarterv2_set_i2clcd_emotion: 'LCD의%1번째 줄, %2번째 칸에 %3 프린트하기 %4',
                castarterv2_set_i2clcd_clear: 'LCD 화면 모두 지우기 %1',
                castarterv2_set_dht_title:'DHT11 디지털 온도, 습도 센서 입력',
                castarterv2_get_dht_temp_value: 'DHT11 온도 %1 센서의 온도 값',
                castarterv2_get_dht_humi_value: 'DHT11 습도 %1 센서의 습도 값',
                castarterv2_blank_title:' ',
            },
            Helper: { 
                castarterv2_get_analog_value: '아날로그 출력 값은 0~1023 까지입니다. LCD에 프린트 할 때는 4자리로 표시합니다.',
                castarterv2_get_analog_value_map: ' ',
                castarterv2_get_digital_dis: ' 디지털 핀 출력 값은 0 또는 1입니다. 이 블럭은 LCD에 디지털 값을 프린트 할 때 사용합니다. ',
                castarterv2_get_digital: ' ',
                castarterv2_get_ultrasonic_init: ' ',
                castarterv2_get_ultrasonic_value: ' ',
                castarterv2_set_toggle_pin: ' ',
                castarterv2_set_digital_pwm: ' 서보모터와 아날로그 출력 블럭은 함께 사용할 수 없습니다.',
                castarterv2_set_tone: ' ',
                castarterv2_set_servo: ' 서보모터와 RGB LED 아날로그 출력 블럭은 함께 사용할 수 없습니다. ',
                castarterv2_set_analog_rgbled: ' 서보모터와 RGB LED 아날로그 출력 블럭은 함께 사용할 수 없습니다.  ',
                castarterv2_set_neopixel_init: ' ',
                castarterv2_set_neopixel_dis: ' ',
                castarterv2_set_i2clcd_init: ' LCD 사용을 위한 블럭입니다. 실행 초기에는 선언하지 않아도 LCD 프린트 블럭을 사용할 수 있습니다. 다만, 아날로그 4번 핀, 5번 핀을 사용 했었다면 이 블럭으로 LCD를 재설정 해줄 필요가 있을 수 있습니다.',
                castarterv2_set_i2clcd_print: ' ',
                castarterv2_set_i2clcd_emotion: ' ',
                castarterv2_set_i2clcd_clear: ' ',
                castarterv2_get_dht_temp_value: ' 온도는 2자리 숫자로 출력 및 표시됩니다.',
                castarterv2_get_dht_humi_value: ' 습도는 2자리 숫자로 출력 및 표시됩니다.',
            },
            Device: {
                castarter_v2: 'castarter_v2',
            },
            Menus: {
                castarter_v2: 'castarter_v2',
            },
        },
        en: {
            Blocks: {
                led_on: 'On',
                led_off: 'Off',
                emoticonHeart:'heart',
                emoticonSmile:'Smile',
                emoticonSad:'Sad',
                emoticonTempsimbol:'Temp simbol',
                emoticonTempsine:'Temp °C sine',
                emoticonHumisimbol:'Humi simbol',
            },
            template: { 
                castarterv2_get_Analog_title:'Analog Sensor input',
                castarterv2_get_analog_value: 'Analog %1 Sensor value',
                castarterv2_get_analog_value_map: 'Map analog %1 pin sensor value %2 from %3 ~ %4 to %5 ~ %6',
                castarterv2_get_digital_title:'Digital Sensor input',
                castarterv2_get_digital_dis: 'Digital %1 Sensor value ( LCD Print )',
                castarterv2_get_digital: 'Digital %1 Sensor value',
                castarterv2_get_ultrasonic_title:'Ultrasonic sensor value input',
                castarterv2_get_ultrasonic_init: 'Read ultrasonic sensor trig pin %1 echo pin %2',
                castarterv2_get_ultrasonic_value: ' ultrasonic sensor value (Cm) ',
                castarterv2_set_digital_title:'Digital Sensor output',
                castarterv2_set_toggle_pin: 'Digital %1 Pin %2 %3',
                castarterv2_set_digital_pwm: 'Digital %1 Pin %2 %3',
                castarterv2_set_tone_title:'Piezo buzzer output',
                castarterv2_set_tone: 'Play tone pin %1 on note %2 octave %3 beat %4 %5',
                castarterv2_set_servo_title:'Servo motor output',
                castarterv2_set_servo: 'Set servo pin %1 angle as %2 %3',
                castarterv2_set_analog_rgbled_title:'Coding array RGB LED analog (PWM) output',
                castarterv2_set_analog_rgbled: 'Coding Array RGB LED Red %1 Green %2 Blue %3 %4', 
                castarterv2_set_neopixel_title:'NeoPixel RGB LED output',      
                castarterv2_set_neopixel_init:'Digital %1 Pin NeoPixel %2 pixels setting %3',
                castarterv2_set_neopixel_dis:'Digital %1 Pin NeoPixel %2 String red %3 , green %4 , blue %5 %6',
                castarterv2_set_i2clcd_title:'I2C 1602 LCD Print',
                castarterv2_set_i2clcd_init: 'Using LCD %1',
                castarterv2_set_i2clcd_print: 'LCD %1 line, %2 column %3 Print %4',
                castarterv2_set_i2clcd_emotion: 'LCD %1 line, %2 column %3 Print %4',
                castarterv2_set_i2clcd_clear: 'LCD Erase all the screens %1',
                castarterv2_set_dht_title:'Digital temperature, humidity sensor input',
                castarterv2_get_dht_temp_value: 'DHT11 Temperature value',
                castarterv2_get_dht_humi_value: 'DHT11 Humidity value',
                castarterv2_blank_title:' ',
            },
            Helper: { 
                castarterv2_get_analog_value: ' ',
                castarterv2_get_analog_value_map: ' ',
                castarterv2_get_digital_dis: ' ',
                castarterv2_get_digital: ' ',
                castarterv2_get_ultrasonic_init: ' ',
                castarterv2_get_ultrasonic_value: ' ',
                castarterv2_set_toggle_pin: ' ',
                castarterv2_set_digital_pwm: ' ',
                castarterv2_set_tone: ' ',
                castarterv2_set_servo: ' ',
                castarterv2_set_analog_rgbled: ' ',
                castarterv2_set_neopixel_init: ' ',
                castarterv2_set_neopixel_dis: ' ',
                castarterv2_set_i2clcd_init: ' ',
                castarterv2_set_i2clcd_print: ' ',
                castarterv2_set_i2clcd_emotion: ' ',
                castarterv2_set_i2clcd_clear: ' ',
                castarterv2_get_dht_temp_value: ' ',
                castarterv2_get_dht_humi_value: ' ',
            },
            Device: {
                castarter_v2: 'castarter_v2',
            },
            Menus: {
                castarter_v2: 'castarter_v2',
            },
        },
    };
};
Entry.castarter_v2.blockMenuBlocks = [
    'castarterv2_get_Analog_title',
    'castarterv2_analog_list',
    'castarterv2_get_analog_value',
    'castarterv2_get_analog_value_map',
    'castarterv2_digital_list',
    'castarterv2_get_digital_title',
    'castarterv2_get_digital',
    'castarterv2_get_digital_dis',
    'castarterv2_get_ultrasonic_title',
    'castarterv2_get_ultrasonic_init',
    'castarterv2_get_ultrasonic_value',
    'castarterv2_set_digital_title',
    'castarterv2_set_toggle_pin',
    'castarterv2_set_digital_pwm',
    'castarterv2_set_tone_title',
    'castarterv2_set_tone',
    'castarterv2_set_servo_title',
    'castarterv2_set_servo',
    'castarterv2_set_analog_rgbled_title',
    'castarterv2_set_analog_rgbled',
    'castarterv2_set_neopixel_title',
    'castarterv2_set_neopixel_init',
    'castarterv2_set_neopixel_dis',
    'castarterv2_set_i2clcd_title',
    'castarter_v2_i2clcd_row',
    'castarter_v2_i2clcd_col',
    'castarterv2_set_i2clcd_init',
    'castarterv2_set_i2clcd_print',
    'castarterv2_set_i2clcd_emotion',
    'castarterv2_set_i2clcd_clear',
    'castarterv2_set_dht_title',
    'castarterv2_get_dht_temp_value',
    'castarterv2_get_dht_humi_value',
    'castarterv2_blank_title',
];
Entry.castarter_v2.getBlocks = function () {
    return {
        castarterv2_get_Analog_title: {
            skeleton: 'basic_text',
            skeletonOptions: {
                box: {
                    offsetX: this.getOffsetX(Lang.template.castarterv2_get_Analog_title),
                    offsetY: 3,
                },
            },
            color: EntryStatic.colorSet.common.TRANSPARENT,
            fontColor: '#d1702a',
            params: [
                {
                    type: 'Text',
                    text: Lang.template.castarterv2_get_Analog_title,
                    color: '#d1702a',
                    align: 'left',
                },
            ],
            def: {
                type: 'castarterv2_get_Analog_title',
            },
            class: 'Analog_Get',
            isNotFor: ['castarter_v2'],
            events: {},
        },
        castarterv2_analog_list: {
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
                return script.getStringField('PORT');
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: '%1',
                        blockType: 'param',
                        textParams: [
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
                                converter: Entry.block.converters.returnStringKey,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                            },
                        ],
                        keyOption: 'castarterv2_analog_list',
                    },
                ],
            },
        },
        castarterv2_get_analog_value: {
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
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'castarterv2_analog_list',
                    },
                ],
                type: 'castarterv2_get_analog_value',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'Analog_Get',
            isNotFor: ['castarter_v2'],
            func: function(sprite, script) {         
                let port = script.getValue('PORT', script);
                const ANALOG = Entry.hw.portData.ANALOG;
                if (port[0] === 'A') port = port.substring(1);
                let velue =  ANALOG ? ANALOG[port] || 0 : 0;
                velue = velue + '';
                return velue.length >= 4 ? velue : new Array(4 - velue.length + 1).join(' ') + velue;
            },
            syntax: { js: [], py: ['castarter_v2.castarterv2_get_analog_value(%1)'] },
        },
        castarterv2_get_analog_value_map: {
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
                    value: '0',
                    fontSize: 11,
                },
                {
                    type: 'Block',
                    accept: 'string',
                    value: '1023',
                    fontSize: 11,
                },
                {
                    type: 'Block',
                    accept: 'string',
                    value: '0',
                    fontSize: 11,
                },
                {
                    type: 'Block',
                    accept: 'string',
                    value: '100',
                    fontSize: 11,
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'castarterv2_analog_list',
                    },
                ],
                type: 'castarterv2_get_analog_value_map',
            },
            paramsKeyMap: {
                PORT: 0,
                VALUE2: 1,
                VALUE3: 2,
                VALUE4: 3,
                VALUE5: 4,
            },
            class: 'Analog_Get',
            isNotFor: ['castarter_v2'],
            func: function(sprite, script) {
                let port = script.getValue('PORT', script);
                let result = 0;
                let width = 0;
                const ANALOG = Entry.hw.portData.ANALOG;
                let value2 = script.getNumberValue('VALUE2', script);
                let value3 = script.getNumberValue('VALUE3', script);
                let value4 = script.getNumberValue('VALUE4', script);
                let value5 = script.getNumberValue('VALUE5', script);
                if (port[0] === 'A') {
                    port = port.substring(1);
                }
                result = ANALOG ? ANALOG[port] || 0 : 0;
                value2 = Math.min(1023, value2);
                value2 = Math.max(0, value2);             
                value3 = Math.min(1023, value3);
                value3 = Math.max(0, value3);
                let num = value4;
                num = num.toString();
                const value4Digit = num.length;
                num = value5;
                num = num.toString();
                const value5Digit = num.length;
                if(value4Digit > value5Digit) width = value4Digit;
                else width = value5Digit;
                if (value2 > value3) {
                    const swap = value2;
                    value2 = value3;
                    value3 = swap;
                }
                if (value4 > value5) {
                    const swap = value4;
                    value4 = value5;
                    value5 = swap;
                }
                result -= value2;
                result = result * ((value5 - value4) / (value3 - value2));
                result += value4;
                result = Math.min(value5, result);
                result = Math.max(value4, result);
                result = result.toFixed(0);
                result = result + '';
                return result.length >= width ? result : new Array(width - result.length + 1).join(' ') + result;
            },
            syntax: {
                js: [],
                py: ['castarterv2_get_analog_value_map(%1, %2, %3, %4, %5)'],
            },
        },
        castarterv2_digital_list: {
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
                        ['A0', '14'],
                        ['A1', '15'],
                        ['A2', '16'],
                        ['A3', '17'],
                        ['A4', '18'],
                        ['A5', '19'],
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
                PORT: 0,
            },
            func: function(sprite, script) {
                return script.getStringField('PORT');
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
                                    ['A0', '14'],
                                    ['A1', '15'],
                                    ['A2', '16'],
                                    ['A3', '17'],
                                    ['A4', '18'],
                                    ['A5', '19'],
                                ],
                                value: '3',
                                fontSize: 11,
                                converter: Entry.block.converters.returnStringKey,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                            },
                        ],
                        keyOption: 'castarterv2_digital_list',
                    },
                ],
            },
        },
        castarterv2_get_digital_title: {
            skeleton: 'basic_text',
            skeletonOptions: {
                box: {
                    offsetX: this.getOffsetX(Lang.template.castarterv2_get_digital_title),
                    offsetY: 3,
                },
            },
            color: EntryStatic.colorSet.common.TRANSPARENT,
            fontColor: '#d1702a',
            params: [
                {
                    type: 'Text',
                    text: Lang.template.castarterv2_get_digital_title,
                    color: '#d1702a',
                    align: 'left',
                },
            ],
            def: {
                type: 'castarterv2_get_digital_title',
            },
            class: 'Digital_Get',
            isNotFor: ['castarter_v2'],
            events: {},
        },
        castarterv2_get_digital_dis: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
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
                        type: 'castarterv2_digital_list',
                        params: ['3'],
                    },
                ],
                type: 'castarterv2_get_digital_dis',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'Digital_Get',
            isNotFor: ['castarter_v2'],
            func: function(sprite, script) {
                const { hwModule = {} } = Entry.hw;
                const { name } = hwModule;
                if (name === 'castarter_v2') {
                    const port = script.getNumberValue('PORT', script);
                    const DIGITAL = Entry.hw.portData.DIGITAL;
                    if (!Entry.hw.sendQueue.GET) {
                        Entry.hw.sendQueue.GET = {};
                    }
                    Entry.hw.sendQueue.GET[Entry.castarter_v2.sensorTypes.DIGITAL] = {
                        port,
                        time: new Date().getTime(),
                    };
                    return DIGITAL ? DIGITAL[port] || 0 : 0;
                }; 
            },
            syntax: { js: [], py: ['castarter_v2.castarterv2_get_digital_dis(%1)'] },
        },
        castarterv2_get_digital: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
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
                        type: 'castarterv2_digital_list',
                        params: ['3'],
                    },
                ],
                type: 'castarterv2_get_digital',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'Digital_Get',
            isNotFor: ['castarter_v2'],
            func: function(sprite, script) {
                const { hwModule = {} } = Entry.hw;
                const { name } = hwModule;
                if (name === 'castarter_v2') {
                    const port = script.getNumberValue('PORT', script);
                    const DIGITAL = Entry.hw.portData.DIGITAL;
                    if (!Entry.hw.sendQueue.GET) {
                        Entry.hw.sendQueue.GET = {};
                    }
                    Entry.hw.sendQueue.GET[Entry.castarter_v2.sensorTypes.DIGITAL] = {
                        port,
                        time: new Date().getTime(),
                    };
                    return DIGITAL ? DIGITAL[port] || 0 : 0;
                }; 
            },
            syntax: { js: [], py: ['castarter_v2.castarterv2_get_digital(%1)'] },
        },
        castarterv2_get_ultrasonic_title: {
            skeleton: 'basic_text',
            skeletonOptions: {
                box: {
                    offsetX: this.getOffsetX(Lang.template.castarterv2_get_ultrasonic_title),
                    offsetY: 3,
                },
            },
            color: EntryStatic.colorSet.common.TRANSPARENT,
            fontColor: '#d1702a',
            params: [
                {
                    type: 'Text',
                    text: Lang.template.castarterv2_get_ultrasonic_title,
                    color: '#d1702a',
                    align: 'left',
                },
            ],
            def: {
                type: 'castarterv2_get_ultrasonic_title',
            },
            class: 'Ultrasonic_Set',
            isNotFor: ['castarter_v2'],
            events: {},
        },
        castarterv2_get_ultrasonic_init: {
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
                    size: 11,
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'castarterv2_digital_list',
                        params: ['2'],
                    },
                    {
                        type: 'castarterv2_digital_list',
                        params: ['4'],
                    },
                    null,
                ],
                type: 'castarterv2_get_ultrasonic_init',
            },
            paramsKeyMap: {
                PORT1: 0,
                PORT2: 1,
            },
            class: 'Ultrasonic_Set',
            isNotFor: ['castarter_v2'],
            func: function(sprite, script) {
                const sq = Entry.hw.sendQueue;
                const port = script.getNumberValue('PORT1', script);
                const value = script.getNumberValue('PORT2', script);
                if (!script.isStart) {
                    if (!sq.SET) {
                        sq.SET = {};
                    }
                    const duration = Entry.castarter_v2.duration.TIME_50ms;
                    script.isStart = true;
                    script.timeFlag = 1;
                    sq.SET[port] = {
                        type: Entry.castarter_v2.sensorTypes.ULTRASONIC,
                        data: value,
                        time: new Date().getTime(),
                    };
                    setTimeout(function () {
                        script.timeFlag = 0;
                    }, duration);
                    return script;
                }
                else if (script.timeFlag == 1) {
                    return script;
                } else {
                    delete script.timeFlag;
                    delete script.isStart;

                    Entry.engine.isContinue = false;
                    return script.callReturn();
                }
            },
            syntax: { js: [], py: ['castarter_v2.castarterv2_get_ultrasonic_init(%1, %2)'] },
        },
        castarterv2_get_ultrasonic_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [],
            events: {},
            def: {
                params: [null],
                type: 'castarterv2_get_ultrasonic_value',
            },
            paramsKeyMap: {
                DISTANCE: 0,
            },
            class: 'Ultrasonic_Set',
            isNotFor: ['castarter_v2'],
            func: function(sprite, script) {
                const distance = script.getNumberValue('DISTANCE', script);
                if (!Entry.hw.sendQueue.SET) {
                    Entry.hw.sendQueue.SET = {};
                }
                delete Entry.hw.sendQueue.SET[distance];
                if (!Entry.hw.sendQueue.GET) {
                    Entry.hw.sendQueue.GET = {};
                }
                Entry.hw.sendQueue.GET[Entry.castarter_v2.sensorTypes.ULTRASONIC] = {
                    port: distance,
                    time: new Date().getTime(),
                };
                let result = Entry.hw.portData.ULTRASONIC.toFixed(0) || 0;
                let width = 3;
                result = result + '';
                return result.length >= width ? result : new Array(width - result.length + 1).join(' ') + result;
            },
            syntax: { js: [], py: ['castarter_v2.castarterv2_get_ultrasonic_value()'] },
        },
        castarterv2_set_dht_title: {
            skeleton: 'basic_text',
            skeletonOptions: {
                box: {
                    offsetX: this.getOffsetX(Lang.template.castarterv2_set_dht_title),
                    offsetY: 3,
                },
            },
            color: EntryStatic.colorSet.common.TRANSPARENT,
            fontColor: '#d1702a',
            params: [
                {
                    type: 'Text',
                    text: Lang.template.castarterv2_set_dht_title,
                    color: '#d1702a',
                    align: 'left',
                },
            ],
            def: {
                type: 'castarterv2_set_dht_title',
            },
            class: 'Digital_DHT_Get',
            isNotFor: ['castarter_v2'],
            events: {},
        },
        castarterv2_get_dht_temp_value: {
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
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'castarterv2_digital_list',
                        params: ['12'],
                    },
                ],
                type: 'castarterv2_get_dht_temp_value',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'Digital_DHT_Get',
            isNotFor: ['castarter_v2'],
            func: function(sprite, script) {
                const port = script.getNumberValue('PORT', script);
                if (!Entry.hw.sendQueue.SET) {
                    Entry.hw.sendQueue.SET = {};
                }
                delete Entry.hw.sendQueue.SET[port];
                if (!Entry.hw.sendQueue.GET) {
                    Entry.hw.sendQueue.GET = {};
                }
                Entry.hw.sendQueue.GET[Entry.castarter_v2.sensorTypes.DHTTEMP] = {
                    port: port,
                    time: new Date().getTime(),
                };
                let result = Entry.hw.portData.DHTTEMP.toFixed(0) || 0;
                let width = 2;
                result = result + '';
                return result.length >= width ? result : new Array(width - result.length + 1).join(' ') + result;
            },
            syntax: { js: [], py: ['castarter_v2.castarterv2_get_dht_temp_value(%1)'] },
        },
        castarterv2_get_dht_humi_value: {
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
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'castarterv2_digital_list',
                        params: ['12'],
                    },
                ],
                type: 'castarterv2_get_dht_humi_value',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'Digital_DHT_Get',
            isNotFor: ['castarter_v2'],
            func: function(sprite, script) {
                const port = script.getNumberValue('PORT', script);
                if (!Entry.hw.sendQueue.SET) {
                    Entry.hw.sendQueue.SET = {};
                }
                delete Entry.hw.sendQueue.SET[port];
                if (!Entry.hw.sendQueue.GET) {
                    Entry.hw.sendQueue.GET = {};
                }
                Entry.hw.sendQueue.GET[Entry.castarter_v2.sensorTypes.DHTHUMI] = {
                    port: port,
                    time: new Date().getTime(),
                };
                let result = Entry.hw.portData.DHTHUMI.toFixed(0) || 0;
                let width = 2;
                result = result + '';
                return result.length >= width ? result : new Array(width - result.length + 1).join(' ') + result;
            },
            syntax: { js: [], py: ['castarter_v2.castarterv2_get_dht_humi_value(%1)'] },
        },
        castarter_v2_highlow_list: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [[Lang.Blocks.led_on, 'on'], [Lang.Blocks.led_off, 'off']],
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
                VELUE: 0,
            },
            func: function(sprite, script) {
                return script.getField('VELUE');
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: '%1',
                        keyOption: 'castarter_v2_highlow_list',
                    },
                ],
            },
        },
        castarterv2_set_toggle_pin: {
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
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 11,
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'castarterv2_digital_list',
                        params: ['13'],
                    },
                    {
                        type: 'castarter_v2_highlow_list',
                        params: ['on'],
                    },
                    null
                ],
                type: 'castarterv2_set_toggle_pin',
            },
            paramsKeyMap: {
                PORT: 0,
                VALUE: 1,
            },
            class: 'Digital_Set',
            isNotFor: ['castarter_v2'],
            func: function(sprite, script) {
                const port = script.getNumberValue('PORT');
                let value = script.getValue('VALUE');
                if (typeof value === 'string') {
                    value = value.toLowerCase();
                }
                if (Entry.castarter_v2.highList.indexOf(value) > -1) {
                    value = 255;
                } else if (Entry.castarter_v2.lowList.indexOf(value) > -1) {
                    value = 0;
                } else {
                    throw new Error();
                }
                if (!Entry.hw.sendQueue.SET) {
                    Entry.hw.sendQueue.SET = {};
                }
                Entry.hw.sendQueue.SET[port] = {
                    type: Entry.castarter_v2.sensorTypes.DIGITAL,
                    data: value,
                    time: new Date().getTime(),
                };
                return script.callReturn();
            },
            syntax: { js: [], py: ['castarter_v2.castarterv2_set_toggle_pin(%1,%2)'] },
        },
        castarterv2_pwm_list: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['3', '3'],
                        ['5', '5'],
                        ['6', '6'],
                        ['9', '9'],
                        ['10', '10'],
                        ['11', '11'],
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
            syntax: {
                js: [],
                py: [
                    {
                        syntax: '%1',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    ['3', '3'],
                                    ['5', '5'],
                                    ['6', '6'],
                                    ['9', '9'],
                                    ['10', '10'],
                                    ['11', '11'],
                                ],
                                value: '11',
                                fontSize: 11,
                                converter: Entry.block.converters.returnStringKey,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                            },
                        ],
                        keyOption: 'castarterv2_pwm_list',
                    },
                ],
            },
        },
        castarterv2_set_digital_title: {
            skeleton: 'basic_text',
            skeletonOptions: {
                box: {
                    offsetX: this.getOffsetX(Lang.template.castarterv2_set_digital_title),
                    offsetY: 3,
                },
            },
            color: EntryStatic.colorSet.common.TRANSPARENT,
            fontColor: '#d1702a',
            params: [
                {
                    type: 'Text',
                    text: Lang.template.castarterv2_set_digital_title,
                    color: '#d1702a',
                    align: 'left',
                },
            ],
            def: {
                type: 'castarterv2_set_digital_title',
            },
            class: 'Digital_Set',
            isNotFor: ['castarter_v2'],
            events: {},
        },
        castarterv2_set_digital_pwm: {
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
                    value: '255',
                    fontSize: 11,
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 11,
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'castarterv2_pwm_list',
                        params: ['11'],
                    },
                    null
                ],
                type: 'castarterv2_set_digital_pwm',
            },
            paramsKeyMap: {
                PORT: 0,
                VALUE: 1,
            },
            class: 'Digital_Set',
            isNotFor: ['castarter_v2'],
            func: function(sprite, script) {
                const sq = Entry.hw.sendQueue;
                const port = script.getNumberValue('PORT');
                let value = script.getNumberValue('VALUE');
                value = Math.round(value);
                value = Math.max(value, 0);
                value = Math.min(value, 255);
                if (!script.isStart) {
                    if (!sq.SET) {
                        sq.SET = {};
                    }
                    let duration = Entry.castarter_v2.duration.TIME_50ms;
                        script.isStart = true;
                        script.timeFlag = 1;

                    Entry.hw.sendQueue.SET[port] = {
                        type: Entry.castarter_v2.sensorTypes.PWM,
                        data: value,
                        time: new Date().getTime(),
                    };
                    setTimeout(function() {
                        script.timeFlag = 0;
                    }, duration );
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
                py: ['castarter_v2.castarterv2_set_digital_pwm(%1, %2)'],
            },
        },
        castarter_v2_tone_list: {
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
            syntax: {
                js: [],
                py: [
                    {
                        syntax: '%1',
                        textParams: [
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
                                converter: Entry.block.converters.returnStringValueUpperCase,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                            },
                        ],
                        keyOption: 'castarter_v2_tone_list',
                    },
                ],
            },
        },
        castarter_v2_tone_value: {
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
                        type: 'castarter_v2_tone_value',
                    },
                ],
                type: 'castarter_v2_tone_value',
            },
            paramsKeyMap: {
                NOTE: 0,
            },
            func: function(sprite, script) {
                return script.getNumberValue('NOTE');
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: '%1',
                        keyOption: 'castarter_v2_tone_value',
                    },
                ],
            },
        },
        castarter_v2_octave_list: {
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
                    value: '4',
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
            syntax: {
                js: [],
                py: [
                    {
                        syntax: '%1',
                        keyOption: 'castarter_v2_octave_list',
                    },
                ],
            },
        },
        castarterv2_set_tone_title: {
            skeleton: 'basic_text',
            skeletonOptions: {
                box: {
                    offsetX: this.getOffsetX(Lang.template.castarterv2_set_tone_title),
                    offsetY: 3,
                },
            },
            color: EntryStatic.colorSet.common.TRANSPARENT,
            fontColor: '#d1702a',
            params: [
                {
                    type: 'Text',
                    text: Lang.template.castarterv2_set_tone_title,
                    color: '#d1702a',
                    align: 'left',
                },
            ],
            def: {
                type: 'castarterv2_set_tone_title',
            },
            class: 'TONE_Set',
            isNotFor: ['castarter_v2'],
            events: {},
        },
        castarterv2_set_tone: {
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
                    size: 11,
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'castarterv2_digital_list',
                        params: ['6'],
                    },
                    {
                        type: 'castarter_v2_tone_list',
                    },
                    {
                        type: 'castarter_v2_octave_list',
                    },
                    {
                        type: 'text',
                        params: ['1'],
                    },
                    null
                ],
                type: 'castarterv2_set_tone',
            },
            paramsKeyMap: {
                PORT: 0,
                NOTE: 1,
                OCTAVE: 2,
                DURATION: 3,
            },
            class: 'TONE_Set',
            isNotFor: ['castarter_v2'],
            func: function(sprite, script) {
                const sq = Entry.hw.sendQueue;
                const port = script.getNumberValue('PORT', script);
                if (!script.isStart) {
                    let note = script.getValue('NOTE', script);
                    if (!Entry.Utils.isNumber(note)) {
                        note = Entry.castarter_v2.toneTable[note];
                    }
                    if (note < 0) {
                        note = 0;
                    } else if (note > 12) {
                        note = 12;
                    }
                    let duration = script.getNumberValue('DURATION', script);
                    if (duration < 0) {
                        duration = 0;
                    }
                    if (!sq.SET) {
                        sq.SET = {};
                    }
                    if (duration === 0) {
                        sq.SET[port] = {
                            type: Entry.castarter_v2.sensorTypes.TONE,
                            data: 0,
                            time: new Date().getTime(),
                        };
                        return script.callReturn();
                    }
                    let octave = script.getNumberValue('OCTAVE', script) - 1;
                    if (octave < 0) {
                        octave = 0;
                    } else if (octave > 5) {
                        octave = 5;
                    }
                    let value = 0;
                    if (note != 0) {
                        value = Entry.castarter_v2.toneMap[note][octave];
                    }
                    duration = duration * 1000;
                    script.isStart = true;
                    script.timeFlag = 1;
                    sq.SET[port] = {
                        type: Entry.castarter_v2.sensorTypes.TONE,
                        data: {
                            value,
                            duration,
                        },
                        time: new Date().getTime(),
                    };
                    setTimeout(() => {
                        script.timeFlag = 0;
                    }, duration + 32);
                    return script;
                } else if (script.timeFlag == 1) {
                    return script;
                } else {
                    delete script.timeFlag;
                    delete script.isStart;
                    sq.SET[port] = {
                        type: Entry.castarter_v2.sensorTypes.TONE,
                        data: 0,
                        time: new Date().getTime(),
                    };
                    Entry.engine.isContinue = false;
                    return script.callReturn();
                }
            },
            syntax: { js: [], py: ['castarter_v2.castarterv2_set_tone(%1,%2,%3,%4)'] },
        },
        castarterv2_set_servo_title: {
            skeleton: 'basic_text',
            skeletonOptions: {
                box: {
                    offsetX: this.getOffsetX(Lang.template.castarterv2_set_servo_title),
                    offsetY: 3,
                },
            },
            color: EntryStatic.colorSet.common.TRANSPARENT,
            fontColor: '#d1702a',
            params: [
                {
                    type: 'Text',
                    text: Lang.template.castarterv2_set_servo_title,
                    color: '#d1702a',
                    align: 'left',
                },
            ],
            def: {
                type: 'castarterv2_set_servo_title',
            },
            class: 'SERVO_Set',
            isNotFor: ['castarter_v2'],
            events: {},
        },
        castarterv2_set_servo: {
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
                    value: '90',
                    fontSize: 11,
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 11,
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'castarterv2_digital_list',
                        params: ['13'],
                    },
                    null
                ],
                type: 'castarterv2_set_servo',
            },
            paramsKeyMap: {
                PORT: 0,
                VALUE: 1,
            },
            class: 'SERVO_Set',
            isNotFor: ['castarter_v2'],
            func: function(sprite, script) {
                const sq = Entry.hw.sendQueue;
                const port = script.getNumberValue('PORT', script);
                let value = script.getNumberValue('VALUE', script);
                value = Math.min(180, value);
                value = Math.max(1, value);
                if (!script.isStart) {
                    if (!sq.SET) {
                        sq.SET = {};
                    }
                    let duration = Entry.castarter_v2.duration.TIME_500ms;
                            script.isStart = true;
                            script.timeFlag = 1;
                    if (!sq.SET) {
                        sq.SET = {};
                    }
                    sq.SET[port] = {
                        type: Entry.castarter_v2.sensorTypes.SERVO_PIN,
                        data: value,
                        time: new Date().getTime(),
                    };
                    setTimeout(function() {
                        script.timeFlag = 0;
                    }, duration );
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
            syntax: { js: [], py: ['castarter_v2.castarterv2_set_servo(%1,%2)'] },
        },
        castarterv2_set_analog_rgbled_title: {
            skeleton: 'basic_text',
            skeletonOptions: {
                box: {
                    offsetX: this.getOffsetX(Lang.template.castarterv2_set_analog_rgbled_title),
                    offsetY: 3,
                },
            },
            color: EntryStatic.colorSet.common.TRANSPARENT,
            fontColor: '#d1702a',
            params: [
                {
                    type: 'Text',
                    text: Lang.template.castarterv2_set_analog_rgbled_title,
                    color: '#d1702a',
                    align: 'left',
                },
            ],
            def: {
                type: 'castarterv2_set_analog_rgbled_title',
            },
            class: 'RGBLED_Set',
            isNotFor: ['castarter_v2'],
            events: {},
        },
        castarterv2_set_analog_rgbled: {
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
                    img: 'block_icon/hardware_icon.svg',
                    size: 11,
                },
            ],
            events: {},
            def: {
                params: [null, null, null],
                type: 'castarterv2_set_analog_rgbled',
            },
            paramsKeyMap: {
                R: 0,
                G: 1,
                B: 2,
            },
            class: 'RGBLED_Set',
            isNotFor: ['castarter_v2'],
            func: function(sprite, script) {
                const sq = Entry.hw.sendQueue;
                let redPWM = script.getNumberValue('R');
                let greenPWM = script.getNumberValue('G');
                let bluePWM = script.getNumberValue('B');
                redPWM = Math.round(redPWM);
                redPWM = Math.max(redPWM, 0);
                redPWM = Math.min(redPWM, 255);
                greenPWM = Math.round(greenPWM);
                greenPWM = Math.max(greenPWM, 0);
                greenPWM = Math.min(greenPWM, 255);
                bluePWM = Math.round(bluePWM);
                bluePWM = Math.max(bluePWM, 0);
                bluePWM = Math.min(bluePWM, 255);
                if (!script.isStart) {
                    if (!sq.SET) {
                        sq.SET = {};
                    }
                    let duration = Entry.castarter_v2.duration.TIME_100ms;
                        script.isStart = true;
                        script.timeFlag = 1;

                    Entry.hw.sendQueue.SET[9] = {
                        type: Entry.castarter_v2.sensorTypes.PWM,
                        data: redPWM,
                        time: new Date().getTime(),
                    };
                    Entry.hw.sendQueue.SET[10] = {
                        type: Entry.castarter_v2.sensorTypes.PWM,
                        data: greenPWM,
                        time: new Date().getTime(),
                    };
                    Entry.hw.sendQueue.SET[11] = {
                        type: Entry.castarter_v2.sensorTypes.PWM,
                        data: bluePWM,
                        time: new Date().getTime(),
                    };
                    setTimeout(function() {
                        script.timeFlag = 0;
                    }, duration );
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
                py: ['castarter_v2.castarterv2_set_analog_rgbled(%1, %2, %3)'],
            },
        },
        castarterv2_set_neopixel_title: {
            skeleton: 'basic_text',
            skeletonOptions: {
                box: {
                    offsetX: this.getOffsetX(Lang.template.castarterv2_set_neopixel_title),
                    offsetY: 3,
                },
            },
            color: EntryStatic.colorSet.common.TRANSPARENT,
            fontColor: '#d1702a',
            params: [
                {
                    type: 'Text',
                    text: Lang.template.castarterv2_set_neopixel_title,
                    color: '#d1702a',
                    align: 'left',
                },
            ],
            def: {
                type: 'castarterv2_set_neopixel_title',
            },
            class: 'NEOPIXEL_Set',
            isNotFor: ['castarter_v2'],
            events: {},
        },
		castarterv2_set_neopixel_init: {
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
                    value: '2',
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 11,
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'castarterv2_digital_list',
                        params: ['8'],
                    },
                    {
                        type: 'number',
                        params: ['2'],
                    },
                    null
                ],
                type: 'castarterv2_set_neopixel_init',
            },
            paramsKeyMap: {
                PORT: 0,
                NUM: 1,
            },
            class: 'NEOPIXEL_Set',
            isNotFor: ['castarter_v2'],
            func: function(sprite, script) {
                const sq = Entry.hw.sendQueue;
                const port = script.getNumberValue('PORT', script);
                let value = script.getNumberValue('NUM', script);
                value = Math.max(value, 0);
                value = Math.min(value, 255);
				if (!script.isStart) {
					if (!sq.SET) {
						sq.SET = {};
					}
					let duration = Entry.castarter_v2.duration.TIME_50ms;
                    script.isStart = true;
                    script.timeFlag = 1; 
					sq.SET[port] = {
							type: Entry.castarter_v2.sensorTypes.NEOPIXELINIT,
							data: value,
							time: new Date().getTime(),
					};
					setTimeout(function() {
                        script.timeFlag = 0;
                    }, duration );
                    return script;
				}
				else if (script.timeFlag == 1) {
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
                py: ['castarter_v2.castarterv2_set_neopixel_init(%1, %2)'],
            },
        },
		castarterv2_set_neopixel_dis: {
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
                    value: '0',
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                },
                {
                    value: '255',
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                },
                {
                    value: '255',
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                },
                {
                    value: '255',
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 11,
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'castarterv2_digital_list',
                        params: ['8'],
                    },
                    {
                        type: 'number',
                        params: ['1'],
                    },
                    null, 
                    null, 
                    null, 
                    null
                ],
                type: 'castarterv2_set_neopixel_dis',
            },
            paramsKeyMap: {
                PORT: 0,
                NUM: 1,
				RED: 2,
				GREEN: 3,
				BLUE: 4,
            },
            class: 'NEOPIXEL_Set',
            isNotFor: ['castarter_v2'],
            func: function(sprite, script) {
                const sq = Entry.hw.sendQueue;
                const port = script.getNumberValue('PORT', script);
                let num = script.getNumberValue('NUM', script);
				let r = script.getNumberValue('RED', script);
				let g = script.getNumberValue('GREEN', script);
				let b = script.getNumberValue('BLUE', script);
                num = Math.max(num, 1);
                num = Math.min(num, 255);
                r = Math.max(r, 0);
                r = Math.min(r, 255);
                g = Math.max(g, 0);
                g = Math.min(g, 255);
                b = Math.max(b, 0);
                b = Math.min(b, 255);
				if (!script.isStart) {
					if (!sq.SET) {
						sq.SET = {};
					}
					let duration = Entry.castarter_v2.duration.TIME_50ms;
						script.isStart = true;
						script.timeFlag = 1;
					sq.SET[port] = {
						type: Entry.castarter_v2.sensorTypes.NEOPIXELDIS,
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
                    }, duration );
                    return script; 
				}
				else if (script.timeFlag == 1) {
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
                py: ['castarter_v2.castarterv2_set_neopixel_dis(%1, %2, %3, %4, %5)'],
            },
        },
		castarter_v2_i2clcd_row: {
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
            func: function(sprite, script) {
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
                        keyOption: 'castarter_v2_i2clcd_row',
                    },
                ],
            },
        },
		castarter_v2_i2clcd_col: {
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
                COL: 0,
            },
            func: function(sprite, script) {
                return script.getStringField('COL');
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
                        keyOption: 'castarter_v2_i2clcd_col',
                    },
                ],
            },
        },
        castarterv2_set_i2clcd_title: {
            skeleton: 'basic_text',
            skeletonOptions: {
                box: {
                    offsetX: this.getOffsetX(Lang.template.castarterv2_set_i2clcd_title),
                    offsetY: 3,
                },
            },
            color: EntryStatic.colorSet.common.TRANSPARENT,
            fontColor: '#d1702a',
            params: [
                {
                    type: 'Text',
                    text: Lang.template.castarterv2_set_i2clcd_title,
                    color: '#d1702a',
                    align: 'left',
                },
            ],
            def: {
                type: 'castarterv2_set_i2clcd_title',
            },
            class: 'CLCD_Set',
            isNotFor: ['castarter_v2'],
            events: {},
        },
        castarterv2_set_i2clcd_init: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [                
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 11,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'castarterv2_set_i2clcd_init',
            },
            paramsKeyMap: {},
            class: 'CLCD_Set',
            isNotFor: ['castarter_v2'],
            func: function(sprite, script) {
                const sq = Entry.hw.sendQueue;
                const port = 0;
                const value = 255;
                if (!script.isStart) {
                    if (!sq.SET) {
                        sq.SET = {};
                    }
                    const duration = Entry.castarter_v2.duration.TIME_200ms;
                    script.isStart = true;
                    script.timeFlag = 1;
                    sq.SET[port] = {
                        type: Entry.castarter_v2.sensorTypes.LCDINIT,
                        data: value,
                        time: new Date().getTime(),
                    };
                    setTimeout(function () {
                        script.timeFlag = 0;
                    }, duration);
                    return script;
                }
                else if (script.timeFlag == 1) {
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
                py: ['castarter_v2.castarterv2_set_i2clcd_init()'],
            },
        },
        castarterv2_set_i2clcd_print: {
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
                    defaultType: 'text',
                    value: 'Coding Array',
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 11,
                },
            ],
            events: {},
            def: {
                params: [
					{
						type: 'castarter_v2_i2clcd_row',
						params: ['0'],
					},
					{
						type: 'castarter_v2_i2clcd_col',
						params: ['0'],
					},
                    null
                ],
                type: 'castarterv2_set_i2clcd_print',
            },
            paramsKeyMap: {
                ROW: 0,
                COL: 1,
                TEXT: 2,
            },
            class: 'CLCD_Set',
            isNotFor: ['castarter_v2'],
            func: function(sprite, script) {
                    const sq = Entry.hw.sendQueue;
                    const row = script.getNumberValue('ROW', script);
                    const column = script.getNumberValue('COL', script);
                    const text = script.getValue('TEXT', script);
                    if (!script.isStart) {
                        if (!sq.SET) {
                            sq.SET = {};
                        }
                        const duration = Entry.castarter_v2.duration.TIME_100ms;
                        script.isStart = true;
                        script.timeFlag = 1;
                        sq.SET[0] = {
                            type: Entry.castarter_v2.sensorTypes.LCD_DIS,
                            data: {
                                row,
                                column,
                                text,
                            },
                            time: new Date().getTime(),
                        };
                        setTimeout(function() {
                            script.timeFlag = 0;
                        }, duration );
                        return script;
                    }
                    else if (script.timeFlag == 1) {
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
                py: ['castarter_v2.castarterv2_set_i2clcd_print(%1,%2,%3)'],
            },
        },
        castarterv2_set_i2clcd_emotion: {
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
                        [Lang.Blocks.emoticonHeart,         '1'],
                        [Lang.Blocks.emoticonSmile,         '2'],
                        [Lang.Blocks.emoticonSad,           '3'],
                        [Lang.Blocks.emoticonTempsimbol,    '4'],
                        [Lang.Blocks.emoticonTempsine,      '5'],
                        [Lang.Blocks.emoticonHumisimbol,    '6'],
                    ],
                    value: '1',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 11,
                },
            ],
            events: {},
            def: {
                params: [
					{
						type: 'castarter_v2_i2clcd_row',
						params: ['0'],
					},
					{
						type: 'castarter_v2_i2clcd_col',
						params: ['0'],
					},
                    null
                ],
                type: 'castarterv2_set_i2clcd_emotion',
            },
            paramsKeyMap: {
                ROW: 0,
                COL: 1,
                TEXT: 2,
            },
            class: 'CLCD_Set',
            isNotFor: ['castarter_v2'],
            func: function(sprite, script) {
                    const sq = Entry.hw.sendQueue;
                    let row = script.getNumberValue('ROW', script);
                    let column = script.getNumberValue('COL', script);
                    const text = script.getValue('TEXT', script);
                    if (!script.isStart) {
                        if (!sq.SET) {
                            sq.SET = {};
                        }
                        const duration = Entry.castarter_v2.duration.TIME_100ms;
                        script.isStart = true;
                        script.timeFlag = 1;
                        sq.SET[0] = {
                            type: Entry.castarter_v2.sensorTypes.LCDOPTION,
                            data: {
                                row,
                                column,
                                text,
                            },
                            time: new Date().getTime(),
                        }; 
                        setTimeout(function() {
                            script.timeFlag = 0;
                        }, duration );
                        return script;
                    }
                    else if (script.timeFlag == 1) {
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
                py: ['castarter_v2.castarterv2_set_i2clcd_emotion(%1,%2,%3)'],
            },
        },        
        castarterv2_set_i2clcd_clear: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [                
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 11,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'castarterv2_set_i2clcd_clear',
            },
            paramsKeyMap: {},
            class: 'CLCD_Set',
            isNotFor: ['castarter_v2'],
            func: function(sprite, script) {
                const sq = Entry.hw.sendQueue;
                const port = 0;
                const value = 1;
                if (!script.isStart) {
                    if (!sq.SET) {
                        sq.SET = {};
                    }
                    const duration = Entry.castarter_v2.duration.TIME_50ms;
                    script.isStart = true;
                    script.timeFlag = 1;

                    sq.SET[port] = {
                        type: Entry.castarter_v2.sensorTypes.LCDCLEAR,
                        data: value,
                        time: new Date().getTime(),
                    };
                    setTimeout(function () {
                        script.timeFlag = 0;
                    }, duration);
                    return script;
                }
                else if (script.timeFlag == 1) {
                    return script;
                }
                else {
                    delete script.timeFlag;
                    delete script.isStart;

                    Entry.engine.isContinue = false;
                    return script.callReturn();
                }
            },
            syntax: {
                js: [],
                py: ['castarter_v2.castarterv2_set_i2clcd_clear()'],
            },
        },
        castarterv2_blank_title: {
            skeleton: 'basic_text',
            skeletonOptions: {
                box: {
                    offsetX: this.getOffsetX(Lang.template.castarterv2_blank_title),
                    offsetY: 3,
                },
            },
            color: EntryStatic.colorSet.common.TRANSPARENT,
            fontColor: '#d1702a',
            params: [
                {
                    type: 'Text',
                    text: Lang.template.castarterv2_blank_title,
                    color: '#d1702a',
                    align: 'left',
                },
            ],
            def: {
                type: 'castarterv2_blank_title',
            },
            class: 'CLCD_Set',
            isNotFor: ['castarter_v2'],
            events: {},
        },
    };
};
module.exports = Entry.castarter_v2;
