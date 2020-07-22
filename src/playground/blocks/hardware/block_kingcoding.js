'use strict';

Entry.Kingcoding = {
    id: '34.1',
    name: 'Kingcoding',
    url: 'http://www.kingkongedu.co.kr/',
    imageName: 'kingcoderLine.png',
    title: {
        ko: '킹코딩',
        en: 'Kingcoding',
    },
    setZero() {
        //정지시 초기화 부분

        //200210 setDigitalPortValue 추후 지원 않을 예정임으로 변경
        Entry.hw.sendQueue.MOTOR1 = 0;
        Entry.hw.sendQueue.MOTOR2 = 0;
        Entry.hw.sendQueue.LED = 0;
        Entry.hw.sendQueue.BUZZER = 0;

        Entry.hw.sendQueue.ANAL1 = 0; //a1값 요청 명령 변수
        Entry.hw.sendQueue.ANAL2 = 0;
        Entry.hw.sendQueue.DIGI1 = 0; //d1값 요청 명령 변수
        Entry.hw.sendQueue.DIGI2 = 0;

        Entry.hw.sendQueue.SET_DIGI1 = 0; //d1 출력 명령
        Entry.hw.sendQueue.SET_DIGI2 = 0;
        Entry.hw.sendQueue.USE_SET_DIGITAL = 0; //digital 입력을 받을 것인지 출력을 줄것인지 결정하는 flag

        Entry.hw.update();
    },
};

Entry.Kingcoding.setLanguage = function() {
    return {
        ko: {
            template: {
                kingcoding_set_motor: '킹코딩 모터 제어 %1 %2',
                kingcoding_set_led: '킹코딩 LED 제어 %1 %2',
                kingcoding_set_buzzer: '킹코딩 버저 제어 %1 %2',
                kingcoding_set_digital1: '디지털 1번 제어  %1 %2',
                kingcoding_set_digital2: '디지털 2번 제어  %1 %2',
                kingcoding_get_number_sensor_1_value: '아날로그 1번 센서값(0~100)',
                kingcoding_get_number_sensor_2_value: '아날로그 2번 센서값(0~100)',
                kingcoding_get_digital_1_value: '디지털 1번 센서 참 ',
                kingcoding_get_digital_2_value: '디지털 2번 센서 참',
            },
        },
        en: {
            template: {
                kingcoding_set_motor: 'Motor Control',
                kingcoding_set_led: 'LED Control',
                kingcoding_set_buzzer: 'Buzzer Control',
                kingcoding_set_digital1: 'Digital no.1 Control %1 %2',
                kingcoding_set_digital2: 'Digital no.2 Control  %1 %2',
                kingcoding_get_number_sensor_1_value: 'Analog Port 1 Value',
                kingcoding_get_number_sensor_2_value: 'Analog Port 2 Value',
                kingcoding_get_digital_1_value: 'Digital Port 1 Value',
                kingcoding_get_digital_2_value: 'Digital Port 2 Value',
            },
        },
    };
};

Entry.Kingcoding.blockMenuBlocks = [
    'kingcoding_set_motor',
    'kingcoding_set_led',
    'kingcoding_set_buzzer',
    'kingcoding_set_digital1',
    'kingcoding_set_digital2',
    'kingcoding_get_number_sensor_1_value',
    'kingcoding_get_number_sensor_2_value',
    'kingcoding_get_digital_1_value',
    'kingcoding_get_digital_2_value',
];

Entry.Kingcoding.getBlocks = function() {
    return {
        kingcoding_set_motor: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['1번 정회전', '1'],
                        ['1번 역회전', '2'],
                        ['1번 정지', '3'],
                        ['2번 정회전', '4'],
                        ['2번 역회전', '5'],
                        ['2번 정지', '6'],
                        ['1,2번 정회전', '7'],
                        ['1,2번 역회전', '8'],
                        ['1번 정회전, 2번 역회전', '9'],
                        ['1번 역회전, 2번 정회전', '10'],
                        ['모든 모터 정지', '11'],
                    ],
                    value: '1',
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
            events: {},
            def: {
                params: [null, null],
                type: 'kingcoding_set_motor',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'Kingcoding',
            isNotFor: ['Kingcoding'],
            func(sprite, script) {
                if (!script.isStart) {
                    script.isStart = true;
                    script.timeFlag = 1;
                    const timeValue = 50; //지연 시간 ms
                    const blockId = script.block.id;
                    Entry.TimeWaitManager.add(
                        blockId,
                        () => {
                            script.timeFlag = 0;
                        },
                        timeValue
                    );

                    return script;
                } else if (script.timeFlag == 1) {
                    return script;
                } else {
                    delete script.timeFlag;
                    delete script.isStart;
                    Entry.engine.isContinue = false;
                    const value = script.getNumberField('PORT', script);
                    console.log(`motor :${value}`);
                    switch (value) {
                        case 1:
                            Entry.hw.sendQueue.MOTOR1 = 1; //정
                            break;
                        case 2:
                            Entry.hw.sendQueue.MOTOR1 = 2; //역
                            break;
                        case 3:
                            Entry.hw.sendQueue.MOTOR1 = 0; //STOP
                            break;
                        case 4:
                            Entry.hw.sendQueue.MOTOR2 = 1; //정
                            break;
                        case 5:
                            Entry.hw.sendQueue.MOTOR2 = 2; //역
                            break;
                        case 6:
                            Entry.hw.sendQueue.MOTOR2 = 0; //STOP
                            break;
                        case 7:
                            Entry.hw.sendQueue.MOTOR1 = 1; //정
                            Entry.hw.sendQueue.MOTOR2 = 1; //정
                            break;
                        case 8:
                            Entry.hw.sendQueue.MOTOR1 = 2; //역
                            Entry.hw.sendQueue.MOTOR2 = 2; //역
                            break;
                        case 9:
                            Entry.hw.sendQueue.MOTOR1 = 1; //정
                            Entry.hw.sendQueue.MOTOR2 = 2; //역
                            break;
                        case 10:
                            Entry.hw.sendQueue.MOTOR1 = 2; //역
                            Entry.hw.sendQueue.MOTOR2 = 1; //정
                            break;
                        case 11:
                            Entry.hw.sendQueue.MOTOR1 = 0; //STOP
                            Entry.hw.sendQueue.MOTOR2 = 0; //STOP
                            break;
                    }

                    return script.callReturn();
                }
            },
            syntax: { js: [], py: ['Kingcoding.set_motor(%1)'] },
        },

        kingcoding_set_led: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['적색 LED 켜기', '1'],
                        ['청색 LED 켜기', '2'],
                        ['녹색 LED 켜기', '3'],
                        ['주황색 LED 켜기', '4'],
                        ['보라색 LED 켜기', '5'],
                        ['하늘색 LED 켜기', '6'],
                        ['백색 LED 켜기', '7'],
                        ['LED 끄기', '0'],
                    ],
                    value: '1',
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
            events: {},
            def: {
                params: [null, null],
                type: 'kingcoding_set_led',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'Kingcoding',
            isNotFor: ['Kingcoding'],
            func(sprite, script) {
                if (!script.isStart) {
                    script.isStart = true;
                    script.timeFlag = 1;
                    const timeValue = 25; //시간지연
                    const blockId = script.block.id;
                    Entry.TimeWaitManager.add(
                        blockId,
                        () => {
                            script.timeFlag = 0;
                        },
                        timeValue
                    );

                    return script;
                } else if (script.timeFlag == 1) {
                    return script;
                } else {
                    delete script.timeFlag;
                    delete script.isStart;
                    Entry.engine.isContinue = false;
                    Entry.hw.sendQueue.LED = script.getNumberField('PORT', script);
                    console.log(`led :${Entry.hw.sendQueue.LED}`);
                    return script.callReturn();
                }
            },
            syntax: { js: [], py: ['Kingcoding.set_led(%1)'] },
        },
        kingcoding_set_buzzer: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['낮은음', '1'],
                        ['중간음', '2'],
                        ['높은음', '3'],
                        ['버저 끄기', '0'],
                    ],
                    value: '1',
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
            events: {},
            def: {
                params: [null, null],
                type: 'kingcoding_set_buzzer',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'Kingcoding',
            isNotFor: ['Kingcoding'],
            func(sprite, script) {
                if (!script.isStart) {
                    script.isStart = true;
                    script.timeFlag = 1;
                    const timeValue = 25; //시간지연
                    const blockId = script.block.id;
                    Entry.TimeWaitManager.add(
                        blockId,
                        () => {
                            script.timeFlag = 0;
                        },
                        timeValue
                    );

                    return script;
                } else if (script.timeFlag == 1) {
                    return script;
                } else {
                    delete script.timeFlag;
                    delete script.isStart;
                    Entry.engine.isContinue = false;
                    Entry.hw.sendQueue.BUZZER = script.getNumberField('PORT', script);
                    console.log(`buzzer :${Entry.hw.sendQueue.BUZZER}`);
                    return script.callReturn();
                }
            },
            syntax: { js: [], py: ['Kingcoding.set_buzzer(%1)'] },
        },
        // kingcoding_set_digital1: {
        //     color: EntryStatic.colorSet.block.default.HARDWARE,
        //     outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
        //     skeleton: 'basic',
        //     statements: [],
        //     params: [
        //         {
        //             type: 'Dropdown',
        //             options: [['켜기', '1'], ['끄기', '0']],
        //             value: '1',
        //             fontSize: 11,
        //             bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
        //             arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
        //         },
        //         {
        //             type: 'Indicator',
        //             img: 'block_icon/hardware_icon.svg',
        //             size: 12,
        //         },
        //     ],
        //     events: {},
        //     def: {
        //         params: [null, null],
        //         type: 'kingcoding_set_digital1',
        //     },
        //     paramsKeyMap: {
        //         PORT: 0,
        //     },
        //     class: 'Kingcoding2',
        //     isNotFor: ['Kingcoding'],
        //     func: function(sprite, script) {
        //         if (!script.isStart) {
        //             script.isStart = true;
        //             script.timeFlag = 1;
        //             var timeValue = 25;//시간지연
        //             const blockId = script.block.id;
        //             Entry.TimeWaitManager.add(
        //                 blockId,
        //                 function() {
        //                     script.timeFlag = 0;
        //                 },
        //                 timeValue
        //             );
        //             return script;
        //         } else if (script.timeFlag == 1) {
        //             return script;
        //         } else {
        //             delete script.timeFlag;
        //             delete script.isStart;
        //             Entry.engine.isContinue = false;
        //             var value = script.getNumberField('PORT', script);
        //             console.log("digital1 :"+value);
        //             Entry.hw.setDigitalPortValue(`11`, value); 
        //             Entry.hw.setDigitalPortValue(`13`, 1); //출력을 사용한다는 플래그 세움
        //             return script.callReturn();
        //         }
        //       },
        //     syntax: { js: [], py: ['Kingcoding.set_digital1(%1)'] },
        // },

        // kingcoding_set_digital2: {
        //     color: EntryStatic.colorSet.block.default.HARDWARE,
        //     outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
        //     skeleton: 'basic',
        //     statements: [],
        //     params: [
        //         {
        //             type: 'Dropdown',
        //             options: [['켜기', '1'], ['끄기', '0']],
        //             value: '1',
        //             fontSize: 11,
        //             bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
        //             arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
        //         },
        //         {
        //             type: 'Indicator',
        //             img: 'block_icon/hardware_icon.svg',
        //             size: 12,
        //         },
        //     ],
        //     events: {},
        //     def: {
        //         params: [null, null],
        //         type: 'kingcoding_set_digital2',
        //     },
        //     paramsKeyMap: {
        //         PORT: 0,
        //     },
        //     class: 'Kingcoding2',
        //     isNotFor: ['Kingcoding'],
        //     func: function(sprite, script) {
        //         if (!script.isStart) {
        //             script.isStart = true;
        //             script.timeFlag = 1;
        //             var timeValue = 25;//시간지연
        //             const blockId = script.block.id;
        //             Entry.TimeWaitManager.add(
        //                 blockId,
        //                 function() {
        //                     script.timeFlag = 0;
        //                 },
        //                 timeValue
        //             );
        //             return script;
        //         } else if (script.timeFlag == 1) {
        //             return script;
        //         } else {
        //             delete script.timeFlag;
        //             delete script.isStart;
        //             Entry.engine.isContinue = false;
        //             var value = script.getNumberField('PORT', script);
        //             console.log("digital1 :"+value);
        //             Entry.hw.setDigitalPortValue(`12`, value); 
        //             Entry.hw.setDigitalPortValue(`13`, 1); //출력을 사용한다는 플래그 세움
        //             return script.callReturn();
        //         }
        //       },
        //     syntax: { js: [], py: ['Kingcoding.set_digital2(%1)'] },
        // },

        kingcoding_get_number_sensor_1_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Text',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'kingcoding_get_number_sensor_1_value',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'Kingcoding3',
            isNotFor: ['Kingcoding'],
            func(sprite, script) {
                Entry.hw.sendQueue.ANAL1 = 1;
                let ret = Entry.hw.portData.ANAL1; //값을 받기
                ret = ret & 63; // mask: 00111111
                ret = (ret * 100) / 63; //(0~100 으로 변환)
                console.log(`anal 1 :${ret}`);
                return ret;
            },
            syntax: { js: [], py: ['Kingcoding.sensor_1_value()'] },
        },
        kingcoding_get_number_sensor_2_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Text',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'kingcoding_get_number_sensor_2_value',
            },

            class: 'Kingcoding3',
            isNotFor: ['Kingcoding'],
            func(sprite, script) {
                Entry.hw.sendQueue.ANAL2 = 1;
                let ret = Entry.hw.portData.ANAL2; //값을 받기
                ret = ret & 63; // mask: 00111111
                ret = (ret * 100) / 63; //(0~100 으로 변환)
                console.log(`anal 2 :${ret}`);
                return ret;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Kingcoding.sensor_2_value()',
                        blockType: 'param',
                    },
                ],
            },
        },
        kingcoding_get_digital_1_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
            statements: [],
            params: [
                {
                    type: 'Text',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'kingcoding_get_digital_1_value',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'Kingcoding3',
            isNotFor: ['Kingcoding'],
            func(sprite, script) {
                Entry.hw.sendQueue.DIGI1 = 1;
                let ret = Entry.hw.portData.DIGI_1_2; //값을 받기
                ret = ret & 1; // mask: 0000 0001
                console.log(`digi 1 :${ret}`);
                return ret;
            },
            syntax: { js: [], py: ['Kingcoding.is_button_1_pressed()'] },
        },
        kingcoding_get_digital_2_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
            statements: [],
            params: [
                {
                    type: 'Text',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'kingcoding_get_digital_2_value',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'Kingcoding3',
            isNotFor: ['Kingcoding'],
            func(sprite, script) {
                Entry.hw.sendQueue.DIGI2 = 1;
                let ret = Entry.hw.portData.DIGI_1_2; //값을 받기
                ret = ret & 2; // mask: 0000 0010
                console.log(`digi 2 :${ret}`);
                return ret;
            },
            syntax: { js: [], py: ['Kingcoding.is_button_2_pressed()'] },
        },
    };
};

module.exports = Entry.Kingcoding;
