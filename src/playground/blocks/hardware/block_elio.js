'use strict';

Entry.elio = {
    id: '28.1', // 엔트리에서 발급받은 하드웨어 번호를 기술합니다.
    name: 'elio', // isNotFor 속성과 대소문자까지 정확하게 매치되어야 합니다.
    url: 'https://mobilian.biz/#/app/product/elio', // 생략 가능합니다. 엔트리 사이트에서 홍보시 사용됩니다.
    imageName: 'elio.png', // images/hardware 폴더 내에 존재하는 이미지입니다. 엔트리 사이트에서 홍보시 사용됩니다.
    title: {
        'ko': '엘리오',
        'en': 'ELIO',
    },
    setZero: function() {
        var sq = Entry.hw.sendQueue;
        for (var port in  Entry.Power) {
            sq[port] = 0;
        }
        Entry.hw.update();
    },

};

Entry.Power = {
    DC1: 0,
    DC2: 0,
    SV1: 0,
    SV2: 0,

    V3: 0,
    V5: 0,
    IO1: 0,
    IO2: 0,
    IO3: 0,
    IO4: 0,
};

Entry.elio.getIO = function(data) {
    if (data == '0') {
        return 'V3';
    } else if (data == '1') {
        return 'V5';
    } else if (data == '2') {
        return 'IO1';
    } else if (data == '3') {
        return 'IO2';
    } else if (data == '4') {
        return 'IO3';
    } else if (data == '5') {
        return 'IO4';
    }
};

Entry.elio.getDC = function(data) {
    if (data == '0') {
        return 'DC1';
    } else if (data == '1') {
        return 'DC2';
    }
};

Entry.elio.getSV = function(data) {
    if (data == '0') {
        return 'SV1';
    } else if (data == '1') {
        return 'SV2';
    }
};

// 언어 적용
Entry.elio.setLanguage = function() {
    return {
        ko: {
            template: {
                'elio_config_block': '초음파 %1,  라인센서1 %2, 라인센서2 %3 으로 정하기 %4',
                'elio_io_block': '%1 %2 으로 정하기 %3',
                'elio_io_all_block': '%1 %2, %3 %4, %5 %6, %7 %8, %9 %10, %11 %12 으로 정하기 %13',

                'elio_dc_block': '%1 %2 으로 정하기 %3',
                'elio_dc_all_block': '%1 %2, %3 %4 으로 정하기 %5',

                'elio_servo_block': '%1 %2 으로 정하기 %3',
                'elio_servo_all_block': '%1 %2, %3 %4 으로 정하기 %5',

                'elio_all_block': '%1 %2, %3 %4, %5 %6, %7 %8, %9 %10, %11 %12, %13 %14, %15 %16, %17 %18, %19 %20 으로 정하기 %21',

                'elio_dc_value': '%1 속도값 읽기',
                'elio_servo_value': '%1 각도 읽기',
                'elio_io_value': '%1 값 읽기',

                'elio_distance_value': '거리',
                'elio_line1_value': '라인1',
                'elio_line2_value': '라인2',
            },
        },
        en: {
            template: {
                'elio_config_block': '초음파 %1,  라인센서1 %2, 라인센서2 %3 으로 정하기 %4',
                'elio_io_block': '%1 %2 으로 정하기 %3',
                'elio_io_all_block': '%1 %2, %3 %4, %5 %6, %7 %8, %9 %10, %11 %12 으로 정하기 %13',

                'elio_dc_block': '%1 %2 으로 정하기 %3',
                'elio_dc_all_block': '%1 %2, %3 %4 으로 정하기 %5',

                'elio_servo_block': '%1 %2 으로 정하기 %3',
                'elio_servo_all_block': '%1 %2, %3 %4 으로 정하기 %5',

                'elio_all_block': '%1 %2, %3 %4, %5 %6, %7 %8, %9 %10, %11 %12, %13 %14, %15 %16, %17 %18, %19 %20 으로 정하기 %21',

                'elio_dc_value': '%1 속도값 읽기',
                'elio_servo_value': '%1 각도 읽기',
                'elio_io_value': '%1 값 읽기',

                'elio_distance_value': '거리',
                'elio_line1_value': '라인1',
                'elio_line2_value': '라인2',
            },
        },
    };
};

// 엔트리에 등록할 블록들의 블록명 작성
Entry.elio.blockMenuBlocks = [
    'elio_config_block',

    'elio_io_block',
    'elio_io_all_block',
    'elio_dc_block',
    'elio_dc_all_block',
    'elio_servo_block',
    'elio_servo_all_block',

    'elio_all_block',

    'elio_dc_value',
    'elio_servo_value',
    'elio_io_value',

    'elio_distance_value',
    'elio_line1_value',
    'elio_line2_value',


];

// 블록 생성
Entry.elio.getBlocks = function() {
    return {
        elio_config_block: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            fontColor: '#fff',
            params: [
                {
                    type: 'Dropdown',

                    options: [
                        ['OFF', '0'],
                        ['ON', '1'],
                    ],
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },

                {
                    type: 'Dropdown',

                    options: [
                        ['OFF', '0'],
                        ['ON', '1'],
                    ],
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },


                {
                    type: 'Dropdown',

                    options: [
                        ['OFF', '0'],
                        ['ON', '1'],
                    ],
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },

                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],

            def: {
                params: ['0', '1', '0'],
                type: 'elio_config_block',
            },

            paramsKeyMap: {
                SONIC: 0,
                LINE1: 1,
                LINE2: 2,
            },
            class: 'elio',
            isNotFor: ['elio'],
            func: function(sprite, script) {

                var sonic = script.getStringField('SONIC', script);
                var line1 = script.getStringField('LINE1', script);
                var line2 = script.getStringField('LINE2', script);

                var sq = Entry.hw.sendQueue;

                Entry.hw.sendQueue['SONIC'] = sonic;
                Entry.hw.sendQueue['LINE1'] = line1;
                Entry.hw.sendQueue['LINE2'] = line2;

                return script.callReturn();
            },
        },


        elio_io_block: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            fontColor: '#fff',
            params: [
                {
                    type: 'Dropdown',

                    options: [
                        ['3V', '0'],
                        ['5V', '1'],
                        ['IO1', '2'],
                        ['IO2', '3'],
                        ['IO3', '4'],
                        ['IO4', '5'],
                    ],
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
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],

            def: {
                params: ['0', null],
                type: 'elio_io_block',
            },

            paramsKeyMap: {
                IO: 0,
                VALUE: 1,
            },

            class: 'elio',
            isNotFor: ['elio'],
            func: function(sprite, script) {
                var io = Entry.elio.getIO(script.getStringField('IO', script));
                var value = script.getValue('VALUE', script);
                var sq = Entry.hw.sendQueue;
                Entry.hw.sendQueue[io] = value;
                return script.callReturn();
            },
        },

        elio_io_all_block: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            fontColor: '#fff',
            params: [
                {
                    type: 'Dropdown',

                    options: [
                        ['3V', '0'],
                        ['5V', '1'],
                        ['IO1', '2'],
                        ['IO2', '3'],
                        ['IO3', '4'],
                        ['IO4', '5'],
                    ],
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },

                {
                    type: 'Block',
                    accept: 'string',
                },

                {
                    type: 'Dropdown',

                    options: [
                        ['3V', '0'],
                        ['5V', '1'],
                        ['IO1', '2'],
                        ['IO2', '3'],
                        ['IO3', '4'],
                        ['IO4', '5'],
                    ],
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },

                {
                    type: 'Block',
                    accept: 'string',
                },

                {
                    type: 'Dropdown',

                    options: [
                        ['3V', '0'],
                        ['5V', '1'],
                        ['IO1', '2'],
                        ['IO2', '3'],
                        ['IO3', '4'],
                        ['IO4', '5'],
                    ],
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },

                {
                    type: 'Block',
                    accept: 'string',
                },

                {
                    type: 'Dropdown',

                    options: [
                        ['3V', '0'],
                        ['5V', '1'],
                        ['IO1', '2'],
                        ['IO2', '3'],
                        ['IO3', '4'],
                        ['IO4', '5'],
                    ],
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },

                {
                    type: 'Block',
                    accept: 'string',
                },

                {
                    type: 'Dropdown',

                    options: [
                        ['3V', '0'],
                        ['5V', '1'],
                        ['IO1', '2'],
                        ['IO2', '3'],
                        ['IO3', '4'],
                        ['IO4', '5'],
                    ],
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },

                {
                    type: 'Block',
                    accept: 'string',
                },

                {
                    type: 'Dropdown',

                    options: [
                        ['3V', '0'],
                        ['5V', '1'],
                        ['IO1', '2'],
                        ['IO2', '3'],
                        ['IO3', '4'],
                        ['IO4', '5'],
                    ],
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
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],

            def: {
                params: ['0', '100', '1', '100', '2', '100', '3', '100', '4', '100', '5', '100', '6', '100'],
                type: 'elio_io_all_block',
            },

            paramsKeyMap: {
                IO1: 0,
                V1: 1,

                IO2: 2,
                V2: 3,


                IO3: 4,
                V3: 5,

                IO4: 6,
                V4: 7,

                IO5: 8,
                V5: 9,

                IO6: 10,
                V6: 11,
            },
            class: 'elio',
            isNotFor: ['elio'],
            func: function(sprite, script) {
                var io1 = Entry.elio.getIO(script.getStringField('IO1', script));
                var v1 = script.getValue('V1', script);

                var io2 = Entry.elio.getIO(script.getStringField('IO2', script));
                var v2 = script.getValue('V2', script);

                var io3 = Entry.elio.getIO(script.getStringField('IO3', script));
                var v3 = script.getValue('V3', script);

                var io4 = Entry.elio.getIO(script.getStringField('IO4', script));
                var v4 = script.getValue('V4', script);

                var io5 = Entry.elio.getIO(script.getStringField('IO5', script));
                var v5 = script.getValue('V5', script);

                var io6 = Entry.elio.getIO(script.getStringField('IO6', script));
                var v6 = script.getValue('V6', script);

                var sq = Entry.hw.sendQueue;

                Entry.hw.sendQueue[io1] = v1;
                Entry.hw.sendQueue[io2] = v2;
                Entry.hw.sendQueue[io3] = v3;
                Entry.hw.sendQueue[io4] = v4;
                Entry.hw.sendQueue[io5] = v5;
                Entry.hw.sendQueue[io6] = v6;
                //왜 소스가 반영이 안되지...
                return script.callReturn();
            },
        },


        elio_dc_block: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            fontColor: '#fff',
            params: [
                {
                    type: 'Dropdown',

                    options: [
                        ['DC1', '0'],
                        ['DC2', '1'],
                    ],
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
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],

            def: {
                params: ['0', 50],
                type: 'elio_dc_block',
            },
            paramsKeyMap: {
                DC1: 0,
                V1: 1,
            },
            class: 'elio',
            isNotFor: ['elio'],
            func: function(sprite, script) {
                var dc1 = Entry.elio.getDC(script.getStringField('DC1', script));
                var v1 = script.getValue('V1', script);

                var sq = Entry.hw.sendQueue;
                Entry.hw.sendQueue[dc1] = v1;

                return script.callReturn();
            },
        },

        elio_dc_all_block: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            fontColor: '#fff',
            params: [
                {
                    type: 'Dropdown',

                    options: [
                        ['DC1', '0'],
                        ['DC2', '1'],
                    ],
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },

                {
                    type: 'Block',
                    accept: 'string',
                },

                {
                    type: 'Dropdown',

                    options: [
                        ['DC1', '0'],
                        ['DC2', '1'],
                    ],
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
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],

            def: {
                params: ['0', '30', '1', '30'],
                type: 'elio_dc_all_block',
            },
            paramsKeyMap: {
                DC1: 0,
                V1: 1,
                DC2: 2,
                V2: 3,
            },
            class: 'elio',
            isNotFor: ['elio'],
            func: function(sprite, script) {

                var dc1 = Entry.elio.getDC(script.getStringField('DC1', script));
                var v1 = script.getValue('V1', script);

                var dc2 = Entry.elio.getDC(script.getStringField('DC2', script));
                var v2 = script.getValue('V2', script);

                var sq = Entry.hw.sendQueue;

                Entry.hw.sendQueue[dc1] = v1;
                Entry.hw.sendQueue[dc2] = v2;

                return script.callReturn();
            },
        },

        elio_servo_block: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            fontColor: '#fff',
            params: [
                {
                    type: 'Dropdown',

                    options: [
                        ['방향1', '0'],
                        ['방향2', '1'],
                    ],
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
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],

            def: {
                params: ['0', null],
                type: 'elio_servo_block',
            },
            paramsKeyMap: {
                SV1: 0,
                V1: 1,
            },
            class: 'elio',
            isNotFor: ['elio'],
            func: function(sprite, script) {

                var sv1 = Entry.elio.getSV(script.getStringField('SV1', script));
                var v1 = script.getValue('V1', script);

                var sq = Entry.hw.sendQueue;

                Entry.hw.sendQueue[sv1] = v1;

                return script.callReturn();
            },
        },

        elio_servo_all_block: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            fontColor: '#fff',
            params: [
                {
                    type: 'Dropdown',

                    options: [
                        ['방향1', '0'],
                        ['방향2', '1'],
                    ],
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },

                {
                    type: 'Block',
                    accept: 'string',
                },

                {
                    type: 'Dropdown',

                    options: [
                        ['방향1', '0'],
                        ['방향2', '1'],
                    ],
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
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],

            def: {
                params: ['0', '10', '1', '10'],
                type: 'elio_servo_all_block',
            },
            paramsKeyMap: {
                SV1: 0,
                V1: 1,
                SV2: 2,
                V2: 3,
            },
            class: 'elio',
            isNotFor: ['elio'],
            func: function(sprite, script) {
                var sv1 = Entry.elio.getSV(script.getStringField('SV1', script));
                var v1 = script.getValue('V1', script);
                var sv2 = Entry.elio.getSV(script.getStringField('SV2', script));
                var v2 = script.getValue('V2', script);


                var sq = Entry.hw.sendQueue;

                Entry.hw.sendQueue[sv1] = v1;
                Entry.hw.sendQueue[sv2] = v2;

                return script.callReturn();
            },
        },

        elio_all_block: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            fontColor: '#fff',
            params: [
                {
                    type: 'Dropdown',

                    options: [
                        ['모터1', '0'],
                        ['모터2', '1'],
                    ],
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },

                {
                    type: 'Block',
                    accept: 'string',
                },

                {
                    type: 'Dropdown',

                    options: [
                        ['모터1', '0'],
                        ['모터2', '1'],
                    ],
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },

                {
                    type: 'Block',
                    accept: 'string',
                },

                {
                    type: 'Dropdown',

                    options: [
                        ['방향1', '0'],
                        ['방향2', '1'],
                    ],
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },

                {
                    type: 'Block',
                    accept: 'string',
                },

                {
                    type: 'Dropdown',

                    options: [
                        ['방향1', '0'],
                        ['방향2', '1'],
                    ],
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },

                {
                    type: 'Block',
                    accept: 'string',
                },


                {
                    type: 'Dropdown',

                    options: [
                        ['3V', '0'],
                        ['5V', '1'],
                        ['IO1', '2'],
                        ['IO2', '3'],
                        ['IO3', '4'],
                        ['IO4', '5'],
                    ],
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },

                {
                    type: 'Block',
                    accept: 'string',
                },

                {
                    type: 'Dropdown',

                    options: [
                        ['3V', '0'],
                        ['5V', '1'],
                        ['IO1', '2'],
                        ['IO2', '3'],
                        ['IO3', '4'],
                        ['IO4', '5'],
                    ],
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },

                {
                    type: 'Block',
                    accept: 'string',
                },

                {
                    type: 'Dropdown',

                    options: [
                        ['3V', '0'],
                        ['5V', '1'],
                        ['IO1', '2'],
                        ['IO2', '3'],
                        ['IO3', '4'],
                        ['IO4', '5'],
                    ],
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },

                {
                    type: 'Block',
                    accept: 'string',
                },

                {
                    type: 'Dropdown',

                    options: [
                        ['3V', '0'],
                        ['5V', '1'],
                        ['IO1', '2'],
                        ['IO2', '3'],
                        ['IO3', '4'],
                        ['IO4', '5'],
                    ],
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },

                {
                    type: 'Block',
                    accept: 'string',
                },

                {
                    type: 'Dropdown',

                    options: [
                        ['3V', '0'],
                        ['5V', '1'],
                        ['IO1', '2'],
                        ['IO2', '3'],
                        ['IO3', '4'],
                        ['IO4', '5'],
                    ],
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },

                {
                    type: 'Block',
                    accept: 'string',
                },

                {
                    type: 'Dropdown',

                    options: [
                        ['3V', '0'],
                        ['5V', '1'],
                        ['IO1', '2'],
                        ['IO2', '3'],
                        ['IO3', '4'],
                        ['IO4', '5'],
                    ],
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
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],

            def: {
                params: ['0', '30',
                    '1', '30',

                    '0', '30',
                    '1', '30',

                    '0', '100',
                    '1', '100',
                    '2', '100',
                    '3', '100',
                    '4', '100',
                    '5', '100',
                ],
                type: 'elio_all_block',
            },
            paramsKeyMap: {
                DC1: 0,
                DC1_V: 1,

                DC2: 2,
                DC2_V: 3,

                SV1: 4,
                SV1_V: 5,

                SV2: 6,
                SV2_V: 7,


                V3: 8,
                V3_V: 9,

                V5: 10,
                V5_V: 11,

                IO1: 12,
                IO1_V: 13,

                IO2: 14,
                IO2_V: 15,

                IO3: 16,
                IO3_V: 17,

                IO4: 18,
                IO4_V: 19,

            },
            class: 'elio',
            isNotFor: ['elio'],
            func: function(sprite, script) {
                var dc1 = Entry.elio.getSV(script.getStringField('DC1', script));
                var dc1_v = script.getValue('DC1_V', script);

                var dc2 = Entry.elio.getSV(script.getStringField('DC2', script));
                var dc2_v = script.getValue('DC2_V', script);

                var sv1 = Entry.elio.getSV(script.getStringField('SV1', script));
                var sv1_v = script.getValue('SV1_V', script);

                var sv2 = Entry.elio.getSV(script.getStringField('SV2', script));
                var sv2_v = script.getValue('SV2_V', script);

                var v3 = Entry.elio.getSV(script.getStringField('V3', script));
                var v3_v = script.getValue('V3_V', script);

                var v5 = Entry.elio.getSV(script.getStringField('V5', script));
                var v5_v = script.getValue('V5_V', script);


                var io1 = Entry.elio.getSV(script.getStringField('IO1', script));
                var io1_v = script.getValue('IO1_V', script);

                var io2 = Entry.elio.getSV(script.getStringField('IO2', script));
                var io2_v = script.getValue('IO2_V', script);

                var io3 = Entry.elio.getSV(script.getStringField('IO3', script));
                var io3_v = script.getValue('IO3_V', script);

                var io4 = Entry.elio.getSV(script.getStringField('IO4', script));
                var io4_v = script.getValue('IO4_V', script);


                var sq = Entry.hw.sendQueue;

                Entry.hw.sendQueue[dc1] = dc1_v;
                Entry.hw.sendQueue[dc2] = dc2_v;

                Entry.hw.sendQueue[sv1] = sv1_v;
                Entry.hw.sendQueue[sv2] = sv2_v;

                Entry.hw.sendQueue[io1] = io1_v;
                Entry.hw.sendQueue[io2] = io2_v;
                Entry.hw.sendQueue[io3] = io3_v;
                Entry.hw.sendQueue[io4] = io4_v;


                return script.callReturn();
            },
        },

        elio_dc_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            fontColor: '#fff',
            params: [
                {
                    type: 'Dropdown',

                    options: [
                        ['DC1', '0'],
                        ['DC2', '1'],

                    ],
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },


                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],

            def: {
                params: ['1', null],
                type: 'elio_dc_value',
            },

            paramsKeyMap: {
                VALUE: 0,
            },
            class: 'elio',
            isNotFor: ['elio'],
            func: function(sprite, script) {
                var port = Entry.elio.getDC(script.getStringField('VALUE', script));
                var pd = Entry.hw.portData;
                return pd[port];
            },
        },

        elio_servo_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            fontColor: '#fff',
            params: [
                {
                    type: 'Dropdown',

                    options: [
                        ['방향1', '0'],
                        ['방향2', '1'],

                    ],
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
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],

            def: {
                params: ['0', null],
                type: 'elio_servo_value',
            },

            paramsKeyMap: {
                VALUE: 0,
            },
            class: 'elio',
            isNotFor: ['elio'],
            func: function(sprite, script) {
                var port = Entry.elio.getSV(script.getStringField('VALUE', script));
                var pd = Entry.hw.portData;
                return pd[port];
            },
        },

        elio_io_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            fontColor: '#fff',
            params: [
                {
                    type: 'Dropdown',

                    options: [
                        ['3V', '0'],
                        ['5V', '1'],
                        ['IO1', '2'],
                        ['IO2', '3'],
                        ['IO3', '4'],
                        ['IO4', '5'],

                    ],
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
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],

            def: {
                params: ['0', null],
                type: 'elio_io_value',
            },

            paramsKeyMap: {
                VALUE: 0,
            },
            class: 'elio',
            isNotFor: ['elio'],
            func: function(sprite, script) {
                var port = Entry.elio.getIO(script.getStringField('VALUE', script));
                var pd = Entry.hw.portData;
                return pd[port];
            },
        },

        elio_distance_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            fontColor: '#fff',
            params: [
                {
                    type: 'TextInput',
                    value: 0,
                },
            ],
            def: {
                type: 'elio_distance_value',
            },
            paramsKeyMap: {
                VALUE: 0,
            },
            class: 'elio',
            isNotFor: ['elio'],
            func: function(sprite, script) {
                var pd = Entry.hw.portData;
                return pd['SONIC'];
            },
        },

        elio_line1_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            fontColor: '#fff',
            params: [
                {
                    type: 'TextInput',
                    value: 0,
                },
            ],
            def: {
                type: 'elio_line1_value',
            },
            paramsKeyMap: {
                VALUE: 0,
            },
            class: 'elio',
            isNotFor: ['elio'],
            func: function(sprite, script) {
                //var port = Entry.elio.getDC(script.getStringField('VALUE', script));
                var pd = Entry.hw.portData;
                return pd['LINE1'];
            },
        },

        elio_line2_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            fontColor: '#fff',
            params: [
                {
                    type: 'TextInput',
                    value: 0,
                },
            ],
            def: {
                type: 'elio_line2_value',
            },
            paramsKeyMap: {
                VALUE: 0,
            },
            class: 'elio',
            isNotFor: ['elio'],
            func: function(sprite, script) {
                //var port = Entry.elio.getDC(script.getStringField('VALUE', script));
                var pd = Entry.hw.portData;
                return pd['LINE2'];
            },
        },
    };
};

// 엔트리에서 하드웨어 블록 클래스를 인식할 수 있도록 내보내기
module.exports = Entry.elio;
