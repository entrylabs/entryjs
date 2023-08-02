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
    pins: {
        RGB_R: 9,
        RGB_G: 10,
        RGB_B: 11,
        DHTPIN: 15,
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
        SW_RESET: 9,
        RGBLED: 10,
        NEOPIXELINIT: 11,
        NEOPIXELDIS: 12,
        SERVO_DETACH: 13,
        LCDINIT: 14,
        LCD_DIS: 15,
        LCDCLEAR: 16,
        LCDOPTION: 17,
        DHTINIT: 25,
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
        TIME_1000ms: 1000,
    },
    waitMilliSec(milli) {
        this.blockReq = true;
        setTimeout(() => {
            this.blockReq = false;
        }, milli);
    },
    BlockState: {},
};
Entry.castarter_v2.setLanguage = function () {
    return {
        ko: {
            Blocks: {
                led_on: '켜짐',
                led_off: '꺼짐',
                emoticonHeart:'하트',
                emoticonSmile:'웃음',
                emoticonSad:'슬픔',
                emoticonTempsimbol:'온도 이미지',
                emoticonTempsine:'온도 °C 기호',
                emoticonHumisimbol:'습도 이미지',
            },
            template: {
                castarterv2_get_analog_value: '아날로그 %1번 센서 값 (0~1023)',
                castarterv2_get_analog_value_map: '아날로그 %1번 센서 (%2~%3)값의 범위를 [%4~%5]으로 바꾼 값',
                castarterv2_get_digital_dis: '디지털 %1 번 센서 값 ( LCD에 프린트 )',
                castarterv2_get_digital: '디지털 %1 번 센서 값',
                castarterv2_get_ultrasonic_value: '울트라소닉 Trig%1번,  Echo%2번 센서값 ',
                castarterv2_set_toggle_pin: '디지털 %1번을 %2  %3',
                castarterv2_set_digital_pwm: '디지털 %1번을 아날로그 값 %2으로 정하기 %3',
                castarterv2_set_tone: '디지털 %1번 부저를 %2%3음으로%4초간 연주하기 %5',
                castarterv2_set_servo: '디지털 %1번 서보모터를 %2도 각도로 정하기 %3',
                castarterv2_set_servo_detach: '디지털 %1 번 서보모터를 끄기 (RGBLED와 충돌 시) %2',
                castarterv2_set_analog_rgbled: 'RGB LED의 빨강:%1, 초록:%2, 파랑:%3으로 아날로그 값 정하기%4',
                castarterv2_set_digital_rgbled: 'RGB LED의 빨강을 %1 으로, 초록을 %2 으로, 파랑 %3 으로 정하기  %4',
                castarterv2_set_neopixel_init:'디지털%1번에 네오픽셀%2개를 사용하기 %3',
                castarterv2_set_neopixel_dis:'디지털%1번에 네오픽셀%2번째 LED에 빨강:%3,녹색"%4,파랑:%5으로 정하기 %6',
                castarterv2_set_i2clcd_init: 'LCD 사용하기 %1',
                castarterv2_set_i2clcd_print: 'LCD의%1번째 줄, %2번째 칸에%3 프린트하기 %4',
                castarterv2_set_i2clcd_emotion: 'LCD의%1번째 줄, %2번째 칸에 %3 프린트하기 %4',
                castarterv2_set_i2clcd_clear: 'LCD 화면 모두 지우기 %1',
                castarterv2_set_dht_init: '디지털 %1번에 %2온습도센서 사용하기 %3',
                castarterv2_get_dht_temp_value: '온습도센서의 온도 값',
                castarterv2_get_dht_humi_value: '온습도센서의 습도 값',
                castarterv2_set_sw_reset: '코딩어레이 리셋하기 %1',
            },
            Helper: { 
                castarterv2_get_analog_value: '아날로그 출력 값은 0~1023 까지입니다. LCD에 프린트 할 때는 4자리로 표시합니다.',
                castarterv2_get_analog_value_map: ' ',
                castarterv2_get_digital_dis: ' 디지털 핀 출력 값은 0 또는 1입니다. 이 블럭은 LCD에 디지털 값을 프린트 할 때 사용합니다. ',
                castarterv2_get_digital: ' ',
                castarterv2_get_ultrasonic_value: ' ',
                castarterv2_set_toggle_pin: ' ',
                castarterv2_set_digital_pwm: ' 서보모터와 아날로그 출력 블럭은 함께 사용할 수 없습니다.',
                castarterv2_set_tone: ' ',
                castarterv2_set_servo: ' 서보모터와 RGB LED 아날로그 출력 블럭은 함께 사용할 수 없습니다. ',
                castarterv2_set_servo_detach: ' 서보모터와 RGB LED 아날로그 출력 블럭은 함께 사용할 수 없습니다. 만약 한번이라도 동시에 사용했었다면 코딩어레이 리셋하기 블럭을 사용하여 초기화를 실행해주세요.',
                castarterv2_set_analog_rgbled: ' 서보모터와 RGB LED 아날로그 출력 블럭은 함께 사용할 수 없습니다.  ',
                castarterv2_set_digital_rgbled: ' RGB LED를 디지털 값으로 켜고 끄고 할 수 있습니다. 서보모터와 RGB LED를 함께 사용하고 싶을 때 사용하는 블럭입니다. ',
                castarterv2_set_neopixel_init: ' ',
                castarterv2_set_neopixel_dis: ' ',
                castarterv2_set_i2clcd_init: ' LCD 사용을 위한 블럭입니다. 실행 초기에는 선언하지 않아도 LCD 프린트 블럭을 사용할 수 있습니다. 다만, 아날로그 4번 핀, 5번 핀을 사용 했었다면 이 블럭으로 LCD를 재설정 해줄 필요가 있을 수 있습니다.',
                castarterv2_set_i2clcd_print: ' ',
                castarterv2_set_i2clcd_emotion: ' ',
                castarterv2_set_i2clcd_clear: ' ',
                castarterv2_set_dht_init: ' ',
                castarterv2_get_dht_temp_value: ' 온도는 2자리 숫자로 출력 및 표시됩니다.',
                castarterv2_get_dht_humi_value: ' 습도는 2자리 숫자로 출력 및 표시됩니다.',
                castarterv2_set_sw_reset: ' 코딩어레이 스타터 키트의 하드웨어 초기화가 필요할 때 사용하는 블럭입니다.',
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
                castarterv2_get_analog_value: 'Analog %1 Sensor value',
                castarterv2_get_analog_value_map: 'Map analog %1 pin sensor value %2 from %3 ~ %4 to %5 ~ %6',
                castarterv2_get_digital_dis: 'Digital %1 Sensor value ( LCD Print )',
                castarterv2_get_digital: 'Digital %1 Sensor value',
                castarterv2_get_ultrasonic_value: 'Read ultrasonic sensor trig pin %1 echo pin %2',
                castarterv2_set_toggle_pin: 'Digital %1 Pin %2 %3',
                castarterv2_set_digital_pwm: 'Digital %1 Pin %2 %3',
                castarterv2_set_tone: 'Play tone pin %1 on note %2 octave %3 beat %4 %5',
                castarterv2_set_servo: 'Set servo pin %1 angle as %2 %3',
                castarterv2_set_servo_detach: 'Turn off servo pin %1 %2',
                castarterv2_set_analog_rgbled: 'Coding Array RGB LED Red %1 Green %2 Blue %3 %4',
                castarterv2_set_digital_rgbled: 'Coding Array RGB LED Red %1 Green %2 Blue %3 %4',                
                castarterv2_set_neopixel_init:'Digital %1 Pin NeoPixel %2 pixels setting %3',
                castarterv2_set_neopixel_dis:'Digital %1 Pin NeoPixel %2 String red %3 , green %4 , blue %5 %6',
                castarterv2_set_i2clcd_init: 'Using LCD %1',
                castarterv2_set_i2clcd_print: 'LCD %1 line, %2 column %3 Print %4',
                castarterv2_set_i2clcd_emotion: 'LCD %1 line, %2 column %3 Print %4',
                castarterv2_set_i2clcd_clear: 'LCD Erase all the screens %1',
                castarterv2_set_dht_init: 'Digital %1 Pin %2 Type Temperature and humidity sensor %3',
                castarterv2_get_dht_temp_value: 'Temperature value',
                castarterv2_get_dht_humi_value: 'Humidity value',
                castarterv2_set_sw_reset: 'Reset the coding array. %1',
            },
            Helper: { 
                castarterv2_get_analog_value: ' ',
                castarterv2_get_analog_value_map: ' ',
                castarterv2_get_digital_dis: ' ',
                castarterv2_get_digital: ' ',
                castarterv2_get_ultrasonic_value: ' ',
                castarterv2_set_toggle_pin: ' ',
                castarterv2_set_digital_pwm: ' ',
                castarterv2_set_tone: ' ',
                castarterv2_set_servo: ' ',
                castarterv2_set_analog_rgbled: ' ',
                castarterv2_set_digital_rgbled: ' ',
                castarterv2_set_neopixel_init: ' ',
                castarterv2_set_neopixel_dis: ' ',
                castarterv2_set_i2clcd_init: ' ',
                castarterv2_set_i2clcd_print: ' ',
                castarterv2_set_i2clcd_emotion: ' ',
                castarterv2_set_i2clcd_clear: ' ',
                castarterv2_set_dht_init: ' ',
                castarterv2_get_dht_temp_value: ' ',
                castarterv2_get_dht_humi_value: ' ',
                castarterv2_set_sw_reset: ' ',
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
    'castarterv2_get_analog_value',
    'castarterv2_get_analog_value_map',
    'castarterv2_get_digital_dis',
    'castarterv2_get_digital',
    'castarterv2_get_ultrasonic_value',
    'castarterv2_set_toggle_pin',
    'castarterv2_set_digital_pwm',
    'castarterv2_set_tone',
    'castarterv2_set_servo',
    'castarterv2_set_servo_detach',
    'castarterv2_set_analog_rgbled',
    'castarterv2_set_digital_rgbled',
    'castarterv2_set_neopixel_init',
    'castarterv2_set_neopixel_dis',
    'castarterv2_set_i2clcd_init',
    'castarterv2_set_i2clcd_print',
    'castarterv2_set_i2clcd_emotion',
    'castarterv2_set_i2clcd_clear',
    'castarterv2_set_dht_init',
    'castarterv2_get_dht_temp_value',
    'castarterv2_get_dht_humi_value',
    'castarterv2_set_sw_reset',
];
Entry.castarter_v2.getBlocks = function () {
    return {
        castarterv2_get_analog_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
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
                return velue.length >= 4 ? velue : new Array(4 - velue.length + 1).join('0') + velue;
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
                    type: 'Dropdown',
                    options: [
                        ['A0', '0'],
                        ['A1', '1'],
                        ['A2', '2'],
                        ['A3', '3'],
                        ['A4', '4'],
                        ['A5', '5'],
                    ],
                    value: '1',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
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
                params: [null],
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
                value4 = Math.min(1023, value4);
                value4 = Math.max(0, value4);
                value5 = Math.min(1023, value5);
                value5 = Math.max(0, value5);
                if(value5 < 10) width = 1;
                else if(value5 >= 10 && value5 < 100) width = 2;
                else if(value5 >= 100 && value5 < 1000) width = 3;
                else width = 4;
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
                return result.length >= width ? result : new Array(width - result.length + 1).join('0') + result;
            },
            syntax: {
                js: [],
                py: ['castarterv2_get_analog_value_map(%1, %2, %3, %4, %5)'],
            },
        },
        castarterv2_get_digital_dis: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
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
        castarterv2_get_ultrasonic_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
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
                    ],
                    value: '2',
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
                        ['8', '8'],
                        ['9', '9'],
                        ['10', '10'],
                        ['11', '11'],
                        ['12', '12'],
                        ['13', '13'],
                    ],
                    value: '4',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [null, null],
                type: 'castarterv2_get_ultrasonic_value',
            },
            paramsKeyMap: {
                PORT1: 0,
                PORT2: 1,
            },
            class: 'Digital_Get',
            isNotFor: ['castarter_v2'],
            func: function(sprite, script) {
                const port1 = script.getNumberValue('PORT1', script);
                const port2 = script.getNumberValue('PORT2', script);
                if (!Entry.hw.sendQueue.SET) {
                    Entry.hw.sendQueue.SET = {};
                }
                delete Entry.hw.sendQueue.SET[port1];
                delete Entry.hw.sendQueue.SET[port2];

                if (!Entry.hw.sendQueue.GET) {
                    Entry.hw.sendQueue.GET = {};
                }
                Entry.hw.sendQueue.GET[Entry.castarter_v2.sensorTypes.ULTRASONIC] = {
                    port: [port1, port2],
                    time: new Date().getTime(),
                };
                let result = Entry.hw.portData.ULTRASONIC.toFixed(0) || 0;
                let width = 3;
                result = result + '';
                return result.length >= width ? result : new Array(width - result.length + 1).join('0') + result;
            },
            syntax: { js: [], py: ['castarter_v2.castarterv2_get_ultrasonic_value(%1, %2)'] },
        },
        castarterv2_set_dht_init: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
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
                    ],
                    value: '12',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: "Dropdown",
                    options: [
                        ["DHT11", '11'],
                        ["DHT12", '12'],
                        ["DHT21", '21'],
                        ["DHT22", '22'],
                        ["AM2301", '21'],
                    ],
                    value: '11',
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
                params: [null, null, null],
                type: 'castarterv2_set_dht_init',
            },
            paramsKeyMap: {
                PORT: 0,
                TYPE: 1,
            },
            class: 'Digital_DHT_Get',
            isNotFor: ['castarter_v2'],
            func: function(sprite, script) {
                const sq = Entry.hw.sendQueue;
                const port = script.getNumberValue('PORT', script);
                const value = script.getNumberValue('TYPE', script);

                if (!script.isStart) {
                    if (!sq.SET) {
                        sq.SET = {};
                    }
                    const duration = Entry.castarter_v2.duration.TIME_50ms;
                    script.isStart = true;
                    script.timeFlag = 1;

                    sq.SET[port] = {
                        type: Entry.castarter_v2.sensorTypes.DHTINIT,
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
            syntax: { js: [], py: ['castarter_v2.castarterv2_set_dht_init(%1, %2)'] },
        },
        castarterv2_get_dht_temp_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [],
            events: {},
            def: {
                params: [null],
                type: 'castarterv2_get_dht_temp_value',
            },
            paramsKeyMap: {
                TEMP: 0,
            },
            class: 'Digital_DHT_Get',
            isNotFor: ['castarter_v2'],
            func: function(sprite, script) {
                const temp = script.getNumberValue('TEMP', script);
                if (!Entry.hw.sendQueue.SET) {
                    Entry.hw.sendQueue.SET = {};
                }
                delete Entry.hw.sendQueue.SET[temp];
                if (!Entry.hw.sendQueue.GET) {
                    Entry.hw.sendQueue.GET = {};
                }
                Entry.hw.sendQueue.GET[Entry.castarter_v2.sensorTypes.DHTTEMP] = {
                    port: temp,
                    time: new Date().getTime(),
                };
                let result = Entry.hw.portData.DHTTEMP.toFixed(0) || 0;
                let width = 2;
                result = result + '';
                return result.length >= width ? result : new Array(width - result.length + 1).join('0') + result;
            },
            syntax: { js: [], py: ['castarter_v2.castarterv2_get_dht_temp_value()'] },
        },
        castarterv2_get_dht_humi_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [],
            events: {},
            paramsKeyMap: {},
            class: 'Digital_DHT_Get',
            isNotFor: ['castarter_v2'],
            func: function(sprite, script) {
                const humi = script.getNumberValue('HUMI', script);

                if (!Entry.hw.sendQueue.SET) {
                    Entry.hw.sendQueue.SET = {};
                }
                delete Entry.hw.sendQueue.SET[humi];

                if (!Entry.hw.sendQueue.GET) {
                    Entry.hw.sendQueue.GET = {};
                }

                Entry.hw.sendQueue.GET[Entry.castarter_v2.sensorTypes.DHTHUMI] = {
                    port: humi,
                    time: new Date().getTime(),
                };
                let result = Entry.hw.portData.DHTHUMI.toFixed(0) || 0;
                let width = 2;
                result = result + '';
                return result.length >= width ? result : new Array(width - result.length + 1).join('0') + result;
            },
            syntax: { js: [], py: ['castarter_v2.castarterv2_get_dht_humi_value()'] },
        },
        castarterv2_set_toggle_pin: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
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
                    ],
                    value: '13',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [[Lang.Blocks.led_on, 'on'], [Lang.Blocks.led_off, 'off']],
                    value: 'on',
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
                params: [null, null],
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
        castarterv2_set_digital_pwm: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
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
                params: [null, null],
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
                if (!script.isStart) 
                {
                    if (!sq.SET) {
                        sq.SET = {};
                    }
                    let duration = Entry.castarter_v2.duration.TIME_20ms;
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
            syntax: {
                js: [],
                py: ['castarter_v2.castarterv2_set_digital_pwm(%1, %2)'],
            },
        },
        castarterv2_set_tone: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
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
                    ],
                    value: '6',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
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
                {
                    value: '1',
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
                params: [null, null, null, null],
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
                        note = Entry.Orange.toneTable[note];
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
                            type: Entry.Orange.sensorTypes.TONE,
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
        castarterv2_set_servo: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
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
                    ],
                    value: '13',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
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
                params: [null, null],
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
                if (!script.isStart) 
                {
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
            syntax: { js: [], py: ['castarter_v2.castarterv2_set_servo(%1,%2)'] },
        },
        castarterv2_set_servo_detach: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
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
                    ],
                    value: '13',
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
                params: [null, null],
                type: 'castarterv2_set_servo_detach',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'SERVO_Set',
            isNotFor: ['castarter_v2'],
            func: function(sprite, script) {
                const sq = Entry.hw.sendQueue;
                const port = script.getNumberValue('PORT', script);
                const value = 0;
                if (!script.isStart) {
                    if (!sq.SET) {
                        sq.SET = {};
                    }
                    const duration = Entry.castarter_v2.duration.TIME_200ms;
                    script.isStart = true;
                    script.timeFlag = 1;

                    sq.SET[port] = {
                        type: Entry.castarter_v2.sensorTypes.SERVO_DETACH,
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
                py: ['castarter_v2.castarterv2_set_servo_detach(%1)'],
            },
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
                if (!script.isStart) 
                {
                    if (!sq.SET) {
                        sq.SET = {};
                    }
                    let duration = Entry.castarter_v2.duration.TIME_200ms;
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
            syntax: {
                js: [],
                py: ['castarter_v2.castarterv2_set_analog_rgbled(%1, %2, %3)'],
            },
        },
        castarterv2_set_digital_rgbled: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.led_on, '1'],
                        [Lang.Blocks.led_off, '0'],
                    ],
                    value: '1',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.led_on, '1'],
                        [Lang.Blocks.led_off, '0'],
                    ],
                    value: '1',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.led_on, '1'],
                        [Lang.Blocks.led_off, '0'],
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
                params: [null, null, null],
                type: 'castarterv2_set_digital_rgbled',
            },
            paramsKeyMap: {
                R: 0,
                G: 1,
                B: 2,
            },
            class: 'RGBLED_Set',
            isNotFor: ['castarter_v2'],
            func: function(sprite, script) {
                const redPort = Entry.castarter_v2.pins.RGB_R;
                const greenPort = Entry.castarter_v2.pins.RGB_G;
                const bluePort = Entry.castarter_v2.pins.RGB_B;
                let redPWM = script.getNumberValue('R');
                let greenPWM = script.getNumberValue('G');
                let bluePWM = script.getNumberValue('B');
                redPWM = Math.max(redPWM, 0);
                redPWM = Math.min(redPWM, 255);
                greenPWM = Math.max(greenPWM, 0);
                greenPWM = Math.min(greenPWM, 255);
                bluePWM = Math.max(bluePWM, 0);
                bluePWM = Math.min(bluePWM, 255);
                if (!Entry.hw.sendQueue.SET) {
                    Entry.hw.sendQueue.SET = {};
                }
                Entry.hw.sendQueue.SET[redPort] = {
                    type: Entry.castarter_v2.sensorTypes.DIGITAL,
                    data: redPWM,
                    time: new Date().getTime(),
                };
                Entry.hw.sendQueue.SET[greenPort] = {
                    type: Entry.castarter_v2.sensorTypes.DIGITAL,
                    data: greenPWM,
                    time: new Date().getTime(),
                };
                Entry.hw.sendQueue.SET[bluePort] = {
                    type: Entry.castarter_v2.sensorTypes.DIGITAL,
                    data: bluePWM,
                    time: new Date().getTime(),
                };
                return script.callReturn();
            },
            syntax: {
                js: [],
                py: ['castarter_v2.castarterv2_set_digital_rgbled(%1, %2, %3)'],
            },
        },
		castarterv2_set_neopixel_init: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
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
                    ],
                    value: '8',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
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
                params: [null, null, null],
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

				if (!script.isStart)
                {
					if (!sq.SET) {
						sq.SET = {};
					}
					let duration = Entry.castarter_v2.duration.TIME_5ms;
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
                    ],
                    value: '8',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
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
                params: [null, null, null, null, null, null],
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
                num = Math.max(num, 0);
                num = Math.min(num, 255);
                r = Math.max(r, 0);
                r = Math.min(r, 255);
                g = Math.max(g, 0);
                g = Math.min(g, 255);
                b = Math.max(b, 0);
                b = Math.min(b, 255);
				if (!script.isStart) 
                {
					if (!sq.SET) {
						sq.SET = {};
					}
					let duration = Entry.castarter_v2.duration.TIME_20ms;
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
            syntax: {
                js: [],
                py: ['castarter_v2.castarterv2_set_neopixel_dis(%1, %2, %3, %4, %5)'],
            },
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
                const port = '14';
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
                params: [null, null, null],
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
                        const duration = Entry.castarter_v2.duration.TIME_200ms;
                        script.isStart = true;
                        script.timeFlag = 1;
                        sq.SET[15] = {
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
                params: [null, null, null],
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
                        const duration = Entry.castarter_v2.duration.TIME_200ms;
                        script.isStart = true;
                        script.timeFlag = 1;
                        sq.SET[16] = {
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
                const port = '17';
                const value = 255;

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
        castarterv2_set_sw_reset: {
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
                params: [null, null],
                type: 'castarterv2_set_sw_reset',
            },
            paramsKeyMap: {
            },
            class: 'Digital_Set',
            isNotFor: ['castarter_v2'],
            func: function(sprite, script) {
                const sq = Entry.hw.sendQueue;
                const value = 255;
                if (!script.isStart) {
                    if (!sq.SET) {
                        sq.SET = {};
                    }
                    const duration = Entry.castarter_v2.duration.TIME_100ms;
                    script.isStart = true;
                    script.timeFlag = 1;

                    sq.SET[18] = {
                        type: Entry.castarter_v2.sensorTypes.SW_RESET,
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
                py: ['castarter_v2.castarterv2_set_sw_reset()'],
            },
        },
    };
};
module.exports = Entry.castarter_v2;
