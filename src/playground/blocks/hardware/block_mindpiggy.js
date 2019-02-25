'use strict';

Entry.Mindpiggy = {
    PORT_MAP: {
        //코드 내 전역변수
        digitalpin:0,
        moodneopixel:[12,0,0,0],
        chipneopixel:[0,0,0],
        vibration:0,
        soundsensor:0,
        photointerrupt:0,
        speaker:[0,0],
    },
    id: '29.1',
    name: 'Mindpiggy',
    url: 'http://inuscoop.com',
    imageName: 'mindpiggy.png',
    title: {
        "en": 'mindpiggy',
        "ko": '마인드피기'
    },
    setZero: function () {
        // 엔트리 정지시 하드웨어 초기화 로직
        Entry.hw.sendQueue = {
            digitalpin:0,
            moodneopixel:[12,0,0,0],
            chipneopixel:[0,0,0],
            vibration:0,
            soundsensor:0,
            photointerrupt:0,
            speaker:[0,0],
        };
        Entry.hw.update();
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
                mindpiggy_on_digital_value: '디지털 핀 %1 번을 켜기',
                mindpiggy_off_digital_value: '디지털 핀 %1 번을 끄기',
                mindpiggy_neopixel_mood_on_value: '무드등(D7) R %1 G %2 B %3 로 설정하기',
                mindpiggy_neopixel_mood_pixel_on_value: '무드등(D7) %1 번째 픽셀을 R %2 G %3 B %4 로 설정하기',
                mindpiggy_neopixel_mood_off_value: '무드등(D7) 끄기',
                mindpiggy_neopixel_chip_on_value: '볼(D11) R %1 G %2 B %3 로 설정하기',
                mindpiggy_neopixel_chip_off_value: '볼(D11) 끄기',
                mindpiggy_get_vibration: '진동센서(D3) 값',
                mindpiggy_get_soundsensor: '사운드센서(A1) 값',
                mindpiggy_get_photo: '물체감지센서 %1핀 값',
                mindpiggy_set_tone: '스피커(A0)를 %1 %2의 음으로 %3초 연주하기.'
            }
        },
        en: {
            // en.js에 작성하던 내용
            template: {
                mindpiggy_on_digital_value: 'turn on digital pin %1',
                mindpiggy_off_digital_value: 'turn off digital pin %1',
                mindpiggy_neopixel_mood_on_value: 'mood(D7) on R %2 G %3 B %4',
                mindpiggy_neopixel_mood_pixel_on_value: 'mood(D7) %1 pixel on R %2 G %3 B %4',
                mindpiggy_neopixel_mood_off_value: 'mood(D7) off',
                mindpiggy_neopixel_chip_on_value: 'chip(D11)  on R %1 G %2 B %3',
                mindpiggy_neopixel_chip_off_value: 'chip(D11) off',
                mindpiggy_get_vibration: 'vibration(D3) digital value',
                mindpiggy_get_soundsensor: 'soundsensor(A1) analog value',
                mindpiggy_get_photo: 'photointerrupt %1 pin digital value',
                mindpiggy_set_tone: 'play tone on node %1 octave %2 beat %3.'
            }
        }
    }
};

// 엔트리에 등록할 블록들의 블록명 작성
Entry.Mindpiggy.blockMenuBlocks = [
    "mindpiggy_neopixel_mood_on_value",
    "mindpiggy_neopixel_mood_pixel_on_value",
    "mindpiggy_neopixel_mood_off_value",
    "mindpiggy_neopixel_chip_on_value",
    "mindpiggy_neopixel_chip_off_value",
    "mindpiggy_get_vibration",
    "mindpiggy_get_soundsensor",
    "mindpiggy_get_photo",
    "mindpiggy_set_tone",
];

// 블록 생성
Entry.Mindpiggy.getBlocks = function () {
    return {
        mindpiggy_neopixel_mood_on_value: {
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
                    type:'Block',
                    accept:'string'
                }
            ],
            def:{
                params: [
                    {
                        type:'number',
                        params:['255']
                    },
                    {
                        type:'number',
                        params:['110']
                    },
                    {
                        type:'number',
                        params:['0']
                    },
                ],
                type:'mindpiggy_neopixel_mood_on_value'
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
                var RedValue = script.getNumberValue('RED');
                var GreenValue = script.getNumberValue('GREEN');
                var BlueValue = script.getNumberValue('BLUE');
                Entry.hw.sendQueue.moodneopixel=[12,RedValue,GreenValue,BlueValue];
            },
            syntax: { js: [], py: ['mindpiggy.neopixel_mood_on_value(%1, %2, %3)'] },
        },
        mindpiggy_neopixel_mood_pixel_on_value :{
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
                    type:'Block',
                    accept:'string'
                }
            ],
            def : {
                params : [
                    {
                        type:'number',
                        params:['1']
                    },
                    {
                        type:'number',
                        params:['255']
                    },
                    {
                        type:'number',
                        params:['110']
                    },
                    {
                        type:'number',
                        params:['0']
                    },
                ],
                type : 'mindpiggy_neopixel_mood_pixel_on_value'
            },
            paramsKeyMap : {
                PIXEL: 0,
                RED: 1,
                GREEN: 2,
                BLUE: 3
            },
            events : {},
            class : 'MindpiggyBlock',
            isNotFor : ['Mindpiggy'],
            func:function(sprite,script){
                var Pixel = script.getNumberValue('PIXEL');
                var RedValue = script.getNumberValue('RED');
                var GreenValue = script.getNumberValue('GREEN');
                var BlueValue = script.getNumberValue('BLUE');
                Entry.hw.sendQueue.moodneopixel=[Pixel,RedValue,GreenValue,BlueValue];
            },
            syntax: { js: [], py: ['mindpiggy.neopixel_mood_pixel_on_value(1%, 2%, 3%, 4%)'] },
        },
        mindpiggy_neopixel_mood_off_value : {
            color : EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton : 'basic',
            statements : [],
            params : [],
            def : {
                params: [],
                type : 'mindpiggy_neopixel_mood_off_value'
            },
            paramsKeyMap : {},
            events : {},
            class : 'MindpiggyBlock',
            isNotFor : ['Mindpiggy'],
            func:function(sprite,script){
                Entry.hw.sendQueue.moodneopixel=[12,0,0,0];
            },
            syntax: { js: [], py: ['mindpiggy.neopixel_mood_off_value()'] },
        },
        mindpiggy_neopixel_chip_on_value: {
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
                    type:'Block',
                    accept:'string'
                }
            ],
            def:{
                params: [
                    {
                        type:'number',
                        params:['255']
                    },
                    {
                        type:'number',
                        params:['0']
                    },
                    {
                        type:'number',
                        params:['0']
                    },
                ],
                type:'mindpiggy_neopixel_chip_on_value'
            },
            paramsKeyMap:{
                RED:0,
                GREAN:1,
                BLUE:2
            },
            events:{},
            class:'MindpiggyBlock',
            isNotFor:['Mindpiggy'],
            func:function(sprite,script){
                var RedValue = script.getNumberValue('RED');
                var GreenValue = script.getNumberValue('GREAN');
                var BlueValue = script.getNumberValue('BLUE');
                Entry.hw.sendQueue.chipneopixel=[RedValue,GreenValue,BlueValue];
            },
            syntax: { js: [], py: ['mindpiggy.neopixel_chip_on_value(1%, 2%, 3%)'] },
        },
        mindpiggy_neopixel_chip_off_value : {
            color : EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton : 'basic',
            statements : [],
            params : [],
            def : {
                params: [],
                type : 'mindpiggy_neopixel_chip_off_value'
            },
            paramsKeyMap : {},
            events : {},
            class : 'MindpiggyBlock',
            isNotFor : ['Mindpiggy'],
            func:function(sprite,script){
                Entry.hw.sendQueue.chipneopixel=[0,0,0];
            },
            syntax: { js: [], py: ['mindpiggy.neopixel_chip_off_value()'] },
        },
        mindpiggy_get_vibration: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_boolean_field',
            params: [],
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
                return Entry.hw.portData.isVibration;
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
                return Entry.hw.portData.SoundsensorValue;
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
            ],
            events: {},
            def: {
                params: [
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
                ],
                type: 'mindpiggy_set_tone',
            },
            paramsKeyMap: {
                NOTE: 0,
                OCTAVE: 1,
                DURATION: 2,
            },
            class: 'MindpiggyBlock',
            isNotFor: ['Mindpiggy'],
            func: function(sprite, script) {

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
                        Entry.hw.sendQueue.speaker[0] = 0;
                        Entry.hw.sendQueue.speaker[1] = 0;
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
                    Entry.hw.sendQueue.speaker[0] = frequency;
                     Entry.hw.sendQueue.speaker[1] = duration;

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
                    Entry.hw.sendQueue.speaker[0] = 0;
                    Entry.hw.sendQueue.speaker[1] = 0;
                    Entry.engine.isContinue = false;
                    return script.callReturn();
                }
            },
            syntax: { js: [], py: ['mindpiggy.set_tone(%1, %2, %3)'] },
        },
    }
};

// 엔트리에서 하드웨어 블록 클래스를 인식할 수 있도록 내보내기
module.exports = Entry.Mindpiggy;