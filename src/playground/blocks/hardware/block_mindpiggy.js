'use strict';

Entry.Mindpiggy = {
    id: '29.1',
    name: 'Mindpiggy',
    url: 'http://inuscoop.com',
    imageName: 'mindpiggy.png',
    title: {
        "en": 'mindpiggy',
        "ko": '마인드피기'
    },
    setZero: function () {
        Entry.hw.sendQueue = {
            GET: {},
            SET: {},
        };
        // var keySet = Object.keys(Entry.hw.sendQueue.SET);
        // keySet.forEach(function(key) {
        //     Entry.hw.sendQueue.SET[key].data = 0;
        // });
        Entry.hw.update();
    },
    sensorTypes: {
        DIGITAL:0,
        ANALOG:1,
        NEOPIXEL:2,
        SPEAKER:3,
        DCMOTOR:4,
        REMOTE:5,
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
};

// 언어 적용
Entry.Mindpiggy.setLanguage = function () {
    return {
        ko: {
            // ko.js에 작성하던 내용
            template: {
                mindpiggy_get_analog_value: '아날로그 %1 번 센서값 ',
                mindpiggy_get_analog_value_map: '%1 의 범위를 %2 ~ %3 에서 %4 ~ %5 로 바꾼값',
                mindpiggy_toggle_led: '디지털 %1 번 핀 %2 %3',
                mindpiggy_digital_pwm: '디지털 %1 번 핀을 %2 (으)로 정하기 %3',
                mindpiggy_get_digital: '디지털 %1 번 센서값',
                mindpiggy_get_bool_digital: '디지털 %1 번 센서값 ',
                mindpiggy_neopixel_on_value: '네오픽셀 %1 번핀  %2 로 설정하기 %3',
                mindpiggy_neopixel_pixel_on_value: '네오픽셀 %1 번핀 %2번째 픽셀 %3 로 설정하기 %4',
                mindpiggy_neopixel_off_value: '네오픽셀 %1 번핀 끄기 %2',
                mindpiggy_set_tone: '스피커 %1 핀 %2 %3의 음으로 %4초 연주하기 %5',
                mindpiggy_dcmotor_direction_forward: '정방향',
                mindpiggy_dcmotor_direction_reverse: '역방향',
                mindpiggy_set_dcmotor:
                    'DC모터 %1 번 핀을 %2 , %3 번 핀의 속도를 %4 로 정하기 %5',
                mindpiggy_get_vibration:' 진동센서 %1 번핀 값 ',
                mindpiggy_module_digital_remote: '리모컨 아날로그 %1 핀 수신값',
            }
        },
        en: {
            // en.js에 작성하던 내용
            template: {
                mindpiggy_get_analog_value: 'Analog %1 Sensor value',
                mindpiggy_get_analog_value_map: 'Map Value %1 %2 ~ %3 to %4 ~ %5',
                mindpiggy_toggle_led: 'Digital %1 Pin %2 %3',
                mindpiggy_digital_pwm: 'Digital %1 Pin %2 %3',
                mindpiggy_get_digital: 'Digital %1 Sensor value',
                mindpiggy_get_bool_digital: 'Digital %1 Pin Sensor value',
                mindpiggy_neopixel_on_value: 'Neopixel %1 Pin on %2 %3',
                mindpiggy_neopixel_pixel_on_value: 'Neopixel %1 Pin %2 pixel on %3 %4',
                mindpiggy_neopixel_off_value: 'Neopixel %1 Pin off %2',
                mindpiggy_set_tone: 'play %1 Pin tone on node %2 octave %3 beat %4 %5',
                mindpiggy_dcmotor_direction_forward: 'forward',
                mindpiggy_dcmotor_direction_reverse: 'reverse',
                mindpiggy_set_dcmotor: 'DC Motor %1 pin direction %2 , %3 pin speed %4 %5',
                mindpiggy_get_vibration:' Vibration %1 pin value ',
                mindpiggy_module_digital_remote: 'RemoteController Analog %1 Pin value',
            }
        }
    }
};

// 엔트리에 등록할 블록들의 블록명 작성
Entry.Mindpiggy.blockMenuBlocks = [
    "mindpiggy_get_analog_value",
    "mindpiggy_get_analog_value_map",
    "mindpiggy_toggle_led",
    "mindpiggy_digital_pwm",
    "mindpiggy_get_bool_digital",
    "mindpiggy_get_digital",
    "mindpiggy_get_vibration",
    "mindpiggy_neopixel_on_value",
    "mindpiggy_neopixel_pixel_on_value",
    "mindpiggy_neopixel_off_value",
    "mindpiggy_module_digital_remote",
    "mindpiggy_set_dcmotor",
];
/* 보류
    "mindpiggy_set_tone",
    "mindpiggy_get_soundsensor",
    "mindpiggy_get_photo",
*/
// 블록 생성
Entry.Mindpiggy.getBlocks = function () {
    return {
        mindpiggy_analog_list: {
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
            syntax: {js: [],py: []},
        },
        mindpiggy_get_port_number: {
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
            syntax: { js: [],py: []},
        },
        mindpiggy_digital_pwm_list: {
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
        mindpiggy_get_analog_value: {
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
                        type: 'mindpiggy_analog_list',
                    },
                ],
                type: 'mindpiggy_get_analog_value',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'MindpiggyNomalBlock',
            isNotFor: ['Mindpiggy'],
            func: function(sprite, script) {
                var port = script.getStringValue('PORT', script);
                port = String(Number(port)+14);
                var ANALOG = Entry.hw.portData[port];
                return ANALOG ? ANALOG['data'] || 0 : 0;
            },
            syntax: {js: [], py: ['mindpiggy.analogRead(%1)']},
        },
        mindpiggy_get_analog_value_map: {
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
                        type: 'mindpiggy_get_analog_value',
                        params: [
                            {
                                type: 'mindpiggy_analog_list',
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
                type: 'mindpiggy_get_analog_value_map',
            },
            paramsKeyMap: {
                PORT: 0,
                VALUE2: 1,
                VALUE3: 2,
                VALUE4: 3,
                VALUE5: 4,
            },
            class: 'MindpiggyNomalBlock',
            isNotFor: ['Mindpiggy'],
            func: function(sprite, script) {
                var result = script.getValue('PORT', script);
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
            syntax: {js:[], py:['mindpiggy.map(%1, %2, %3, %4, %5)']},
        },
        mindpiggy_get_bool_digital: {
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
                        type: 'mindpiggy_get_port_number',
                    },
                ],
                type: 'mindpiggy_get_bool_digital',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'MindpiggyNomalBlock',
            isNotFor: ['Mindpiggy'],
            func: function(sprite, script) {
                var port = script.getStringValue('PORT', script);
                var val = Entry.hw.portData[port];
                if (!Entry.hw.sendQueue['GET'])Entry.hw.sendQueue['GET'] = {};
                Entry.hw.sendQueue['GET'][port]={
                    type: Entry.Mindpiggy.sensorTypes.DIGITAL,
                    time: new Date().getTime(),
                };
                return val? val['data'] : 0;

            },
            syntax: {js: [], py: ['mindpiggy.digitalRead(%1)'] },
        },
        mindpiggy_get_digital: {
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
                        type: 'mindpiggy_get_port_number',
                    },
                ],
                type: 'mindpiggy_get_digital',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'MindpiggyBlock',
            isNotFor: ['Mindpiggy'],
            func: function(sprite, script) {
                var port = script.getStringValue('PORT', script);
                var val = Entry.hw.portData[port];
                if (!Entry.hw.sendQueue['GET'])Entry.hw.sendQueue['GET'] = {};
                Entry.hw.sendQueue['GET'][port]={
                    type: Entry.Mindpiggy.sensorTypes.DIGITAL,
                    time: new Date().getTime(),
                };
                return val? val['data'] : 0;

            },
            syntax: {js: [], py: ['mindpiggy.digitalRead(%1)'] },
        },
        mindpiggy_get_digital_toggle: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template:'%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [[Lang.Blocks.ARDUINO_on, 'on'], [Lang.Blocks.ARDUINO_off, 'off']],
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
                return script.getField('OPERATOR');
            },
            syntax: { js: [],  py: []},
        },
        mindpiggy_toggle_led: {
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
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'mindpiggy_get_port_number',
                        params: ['3'],
                    },
                    {
                        type: 'mindpiggy_get_digital_toggle',
                        params: ['on'],
                    },
                    null,
                ],
                type: 'mindpiggy_toggle_led',
            },
            paramsKeyMap: {
                PORT: 0,
                VALUE: 1,
            },
            class: 'MindpiggyNomalBlock',
            isNotFor: ['Mindpiggy'],
            func: function(sprite, script) {
                var port = script.getStringValue('PORT');
                var value = script.getValue('VALUE');
                value = value.toLowerCase();
                if(value=='on')value=255;
                else if(value=='off')value=0;
                if (!Entry.hw.sendQueue['SET'])Entry.hw.sendQueue['SET'] = {};
                Entry.hw.sendQueue['SET'][port] = {
                    type: Entry.Mindpiggy.sensorTypes.DIGITAL,
                    data: value,
                    time: new Date().getTime(),
                };
            },
            syntax: { js: [],  py: ['mindpiggy.digitalWrite(%1, %2)'] },
        },
        mindpiggy_digital_pwm: {
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
                        type: 'mindpiggy_digital_pwm_list',
                    },
                    {
                        type: 'number',
                        params: ['255'],
                    },
                    null,
                ],
                type: 'mindpiggy_digital_pwm',
            },
            paramsKeyMap: {
                PORT: 0,
                VALUE: 1,
            },
            class: 'MindpiggyNomalBlock',
            isNotFor: ['Mindpiggy'],
            func: function(sprite, script) {
                var port = script.getStringValue('PORT');
                var value = script.getNumberValue('VALUE');
                value = Math.round(value);
                value = Math.max(value, 0);
                value = Math.min(value, 255);
                if (!Entry.hw.sendQueue['SET'])Entry.hw.sendQueue['SET'] = {};
                Entry.hw.sendQueue['SET'][port] = {
                    type: Entry.Mindpiggy.sensorTypes.DIGITAL,
                    data: value,
                    time: new Date().getTime(),
                };
            },
            syntax: { js: [], py: ['mindpiggy.analogWrite(%1, %2)' ] },
        },
        mindpiggy_rgb:{
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template:'R %1 G %2 B %3',
            params:[
                {
                    type:'Block',
                    accept:'string',
                    defaultType: 'number',
                },
                {
                    type:'Block',
                    accept:'string',
                    defaultType: 'number',
                },
                {
                    type:'Block',
                    accept:'string',
                    defaultType: 'number',
                },
            ],
            def:{
                params:[
                    {
                        type:'number',
                    },
                    {
                        type:'number',
                    },
                    {
                        type:'number',
                    },
                ],
                type:'mindpiggy_rgb',
            },
            paramsKeyMap:{
                RED:0,
                GREEN:1,
                BLUE:2
            },
            events:{},
            class:'MindpiggyBlock',
            isNotFor:['Mindpiggy'],
            func:function(sprite,script){
                var Red = script.getNumberValue('RED');
                var Green = script.getNumberValue('GREEN');
                var Blue = script.getNumberValue('BLUE');
                var rgb = [Red,Green,Blue];
                rgb.forEach(function(val){
                    val = Math.round(val);
                    val = Math.max(val, 0);
                    val = Math.min(val, 255);
                });
                return rgb;
            },
            syntax: { js: [], py: []},
        },
        mindpiggy_neopixel_on_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type:'Block',
                    accept:'string'
                },
                {
                    type:'Block',
                    accept:'string'
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            def:{
                params: [
                    {
                        type: 'mindpiggy_get_port_number',
                        params:[11],
                    },
                    {
                        type:'mindpiggy_rgb',
                        params:[255,110,0],
                    },
                    null,
                ],
                type:'mindpiggy_neopixel_on_value'
            },
            paramsKeyMap:{
                PORT:0,
                RGB:1,
            },
            events:{},
            class:'MindpiggyBlock',
            isNotFor:['Mindpiggy'],
            func:function(sprite,script){
                if (!script.isStart){
                    var Port = script.getStringValue('PORT');
                    var rgbValue = script.getValue('RGB');
                    if(!Entry.hw.sendQueue.SET)Entry.hw.sendQueue.SET={};
                    Entry.hw.sendQueue['SET'][Port]={
                        type : Entry.Mindpiggy.sensorTypes.NEOPIXEL,
                        data : [0,255,rgbValue[0],rgbValue[1],rgbValue[2]],
                        time: new Date().getTime(),
                    };
                    script.isStart = true;
                    script.timeFlag = 1;
                    setTimeout(function() {
                        script.timeFlag = 0;},20);
                    return script;
                }else if (script.timeFlag == 1) {
                    return script;
                } else {
                    delete script.isStart;
                    delete script.timeFlag;
                    return script.callReturn();
                }
            },
            syntax: { js: [], py: ['mindpiggy.neopixel_mood_on_value(%1, %2, %3)'] },
        },
        mindpiggy_neopixel_pixel_on_value :{
            color : EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton : 'basic',
            statements : [],
            params : [
                {
                    type:'Block',
                    accept:'string'
                },
                {
                    type:'Block',
                    accept:'string'
                },
                {
                    type:'Block',
                    accept:'string'
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            def : {
                params : [
                    {
                        type: 'mindpiggy_get_port_number',
                        params:[11]
                    },
                    {
                        type:'number',
                        params:['0']
                    },
                    {
                        type:'mindpiggy_rgb',
                        params:[255,110,0],
                    },
                    null,
                ],
                type : 'mindpiggy_neopixel_pixel_on_value'
            },
            paramsKeyMap : {
                PORT: 0,
                PIXEL: 1,
                RGB: 2,
            },
            events : {},
            class : 'MindpiggyBlock',
            isNotFor : ['Mindpiggy'],
            func:function(sprite,script){
                if (!script.isStart){
                    var Port = script.getStringValue('PORT');
                    var Pixel = script.getNumberValue('PIXEL');
                    var rgb = script.getValue('RGB');
                    if(!Entry.hw.sendQueue.SET)Entry.hw.sendQueue.SET={};
                    Entry.hw.sendQueue['SET'][Port]={
                        type : Entry.Mindpiggy.sensorTypes.NEOPIXEL,
                        data : [Pixel,Pixel,rgb[0],rgb[1],rgb[2]],
                        time: new Date().getTime(),
                    };
                    script.isStart = true;
                    script.timeFlag = 1;
                    setTimeout(function() {
                        script.timeFlag = 0;},20);
                    return script;
                }else if (script.timeFlag == 1) {
                    return script;
                } else {
                    delete script.isStart;
                    delete script.timeFlag;
                    return script.callReturn();
                }
            },
            syntax: { js: [], py: ['mindpiggy.neopixel_mood_pixel_on_value(1%, 2%, 3%, 4%)'] },
        },
        mindpiggy_neopixel_off_value : {
            color : EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton : 'basic',
            statements : [],
            params : [
                {
                    type: 'Block',
                    accept:'String',
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            def : {
                params: [
                    {
                        type: 'mindpiggy_get_port_number',
                        params:[11],
                    },
                    null
                ],
                type : 'mindpiggy_neopixel_off_value'
            },
            paramsKeyMap : {
                PORT : 0,
            },
            events : {},
            class : 'MindpiggyBlock',
            isNotFor : ['Mindpiggy'],
            func:function(sprite,script){
                if (!script.isStart){
                    var Port = script.getStringValue('PORT');
                    if(!Entry.hw.sendQueue.SET)Entry.hw.sendQueue.SET={};
                    Entry.hw.sendQueue['SET'][Port]={
                    type : Entry.Mindpiggy.sensorTypes.NEOPIXEL,
                    data : [0,255,0,0,0],
                    time: new Date().getTime(),
                };
                    script.isStart = true;
                    script.timeFlag = 1;
                    setTimeout(function() {
                        script.timeFlag = 0;},20);
                    return script;
                }else if (script.timeFlag == 1) {
                    return script;
                } else {
                    delete script.isStart;
                    delete script.timeFlag;
                    return script.callReturn();
                }


            },
            syntax: { js: [], py: ['mindpiggy.neopixel_mood_off_value()'] },
        },
        mindpiggy_get_vibration: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_boolean_field',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['3', '0'],
                    ],
                    value : '0',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [],
                type: 'mindpiggy_get_vibration',
            },
            paramsKeyMap: {
                EVENT : 0,
            },
            class: 'MindpiggyBlock',
            isNotFor: ['Mindpiggy'],
            func:function(sprite,script){
                var getdata = Entry.hw.portData['3'];
                if(!Entry.hw.sendQueue.GET)Entry.hw.sendQueue.GET={};
                Entry.hw.sendQueue.GET['3']={
                    type : Entry.Mindpiggy.sensorTypes.DIGITAL,
                    time: new Date().getTime(),
                };
                return getdata ? getdata.data : 0;
            },
            syntax: { js: [], py: ['mindpiggy.get_vibration(1%)'] },
        },

        mindpiggy_get_soundsensor: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            params: [],
            events: {},
            def: {
                params: [],
                type: 'mindpiggy_get_soundsensor',
            },
            paramsKeyMap: {},
            class: 'MindpiggyBlock',
            isNotFor: ['Mindpiggy'],
            func:function(sprite,script){
                var getdata = Entry.hw.portData['15'];
                if(!Entry.hw.sendQueue.GET)Entry.hw.sendQueue.GET={};
                Entry.hw.sendQueue.GET['15']={
                    type : Entry.Mindpiggy.sensorTypes.ANALOG,
                    time: new Date().getTime(),
                };
                return getdata ? getdata.data : 0;
            },
            syntax: { js: [], py: ['mindpiggy.get_soundsensor()'] },
        },
        mindpiggy_get_photo: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_boolean_field',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['5', '0'],
                        ['6', '1'],
                    ],
                    value : '0',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'mindpiggy_get_photo',
            },
            paramsKeyMap: {
                PINNUM: 0,
            },
            class: 'MindpiggyBlock',
            isNotFor: ['Mindpiggy'],
            func:function(sprite,script){
                var pinNum = script.getField('PINNUM');
                var isSense;
                if(pinNum === '0'){
                    isSense = Entry.hw.portData.isPhotoInterrupt&2;
                }else if(pinNum === '1'){
                    isSense = Entry.hw.portData.isPhotoInterrupt&1;
                }
                if(isSense == 0)return false;
                else return true;
            },
            syntax: { js: [], py: ['mindpiggy.get_photo(%1)'] },
        },
        mindpiggy_octave_list: {
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
            syntax: { js: [], py: [] },
        },
        mindpiggy_tone_list: {
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
        mindpiggy_set_tone: {
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
                        type: 'mindpiggy_analog_list',
                    },
                    {
                        type: 'mindpiggy_tone_list',
                    },
                    {
                        type: 'mindpiggy_octave_list',
                    },
                    {
                        type: 'text',
                        params: ['1'],
                    },
                    null,
                ],
                type: 'mindpiggy_set_tone',
            },
            paramsKeyMap: {
                PORT: 0,
                NOTE: 1,
                OCTAVE: 2,
                DURATION: 3,
            },
            class: 'MindpiggyExtBlock',
            isNotFor: ['Mindpiggy'],
            func: function(sprite, script) {
                var Port = script.getStringValue('PORT');
                Port = String(Number(Port)+14);
                if (!script.isStart) {
                    var note = script.getValue('NOTE', script);
                    if (!Entry.Utils.isNumber(note))
                        note = Entry.Mindpiggy.toneTable[note];

                    if (note < 0) {
                        note = 0;
                    } else if (note > 12) {
                        note = 12;
                    }

                    var duration = script.getNumberValue('DURATION', script);

                    if (duration < 0) {
                        duration = 0;
                    }

                    if (duration === 0) {
                        // sned
                        if(!Entry.hw.sendQueue.SET)Entry.hw.sendQueue.SET={};
                        Entry.hw.sendQueue['SET'][Port]={
                            type:Entry.Mindpiggy.sensorTypes.SPEAKER,
                            data:[0,0],
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

                    var frequency = 0;

                    if (note != 0) {
                        frequency = Entry.Mindpiggy.toneMap[note][octave];
                    }

                    duration = duration * 1000;
                    script.isStart = true;
                    script.timeFlag = 1;

                    //send

                    if(!Entry.hw.sendQueue.SET)Entry.hw.sendQueue.SET={};
                    Entry.hw.sendQueue['SET'][Port]={
                        type:Entry.Mindpiggy.sensorTypes.SPEAKER,
                        data:[frequency,duration],
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
                    // send
                    if(!Entry.hw.sendQueue.SET)Entry.hw.sendQueue.SET={};
                    Entry.hw.sendQueue['SET'][Port]={
                        type:Entry.Mindpiggy.sensorTypes.SPEAKER,
                        data:[0,0],
                        time: new Date().getTime(),
                    };

                    Entry.engine.isContinue = false;
                    return script.callReturn();
                }
            },
            syntax: { js: [], py: ['mindpiggy.set_tone(%1, %2, %3)'] },
        },
        mindpiggy_dcmotor_direction: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.template.mindpiggy_dcmotor_direction_reverse, 'reverse'],
                        [Lang.template.mindpiggy_dcmotor_direction_forward, 'forward'],
                    ],
                    value: 'forward',
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
        mindpiggy_set_dcmotor:{
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params:[
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
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            def:{
                params: [
                    {
                        type: 'mindpiggy_get_port_number',
                        params: [12],
                    },
                    {
                        type: 'mindpiggy_dcmotor_direction'
                    },
                    {
                        type: 'mindpiggy_digital_pwm_list',
                        params: [10],
                    },
                    {
                        type: 'number',
                        params: ['255'],
                    },
                    null,
                ],
                type:'mindpiggy_set_dcmotor',
            },
            paramsKeyMap:{
                PORT0: 0,
                VALUE0: 1,
                PORT1: 2,
                VALUE1: 3,
            },
            events : {},
            class : 'MindpiggyExtBlock',
            isNotFor : ['Mindpiggy'],
            func:function(sprite,script){
                var directionPort = script.getStringValue('PORT0');
                var directionValue = script.getStringValue('VALUE0');
                var speedPort = script.getStringValue('PORT1');
                var speedValue = script.getNumberValue('VALUE1');
                if(directionValue=='reverse') directionValue=0;
                else if(directionValue=='forward')directionValue=1;
                speedValue = Math.round(speedValue);
                speedValue = Math.max(speedValue, 0);
                speedValue = Math.min(speedValue, 255);
                if(!Entry.hw.sendQueue.SET)Entry.hw.sendQueue.SET={};
                Entry.hw.sendQueue['SET'][directionPort]={
                    type:Entry.Mindpiggy.sensorTypes.DCMOTOR,
                    data:[directionValue,1],
                    time: new Date().getTime(),
                };
                Entry.hw.sendQueue['SET'][speedPort]={
                    type:Entry.Mindpiggy.sensorTypes.DCMOTOR,
                    data:[speedValue,0],
                    time: new Date().getTime(),
                };
            },
            syntax: { js: [], py: [] },
        },
        mindpiggy_module_digital_remote:{
            color:EntryStatic.colorSet.block.default.HARDWARE,
            outerLine:EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor:'#fff',
            skeleton:'basic_string_field',
            statements:[],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['A0', '0'],
                    ],
                    value: '0',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [],
                type: 'mindpiggy_module_digital_remote',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'MindpiggyExtBlock',
            isNotFor: ['Mindpiggy'],
            func: function(sprite, script) {
                // var port = script.getStringValue('PORT', script);
                // port = String(Number(port)+14);
                var REMOTE = Entry.hw.portData['A0'];
                if (!Entry.hw.sendQueue['GET'])Entry.hw.sendQueue['GET'] = {};
                Entry.hw.sendQueue['GET']['14']={
                    type: Entry.Mindpiggy.sensorTypes.REMOTE,
                    time: new Date().getTime(),
                };
                if(REMOTE && (REMOTE['data']!=255))return REMOTE['data'];
                else return String('x');
            },
            syntax: { js: [], py: ['mindpiggy.module_digital_remote(%1)'] },
        },
    }
};

// 엔트리에서 하드웨어 블록 클래스를 인식할 수 있도록 내보내기
module.exports = Entry.Mindpiggy;