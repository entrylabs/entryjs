(function() {
    var miniBlock = {
        practical_course_motor_speed: {
            color: '#00B200',
            skeleton: 'basic_string_field',
            statements: [],
            isNotFor: [ 'Neobot' ],
            template: '%1',
            params: [{
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
                    ['15', '15']
                ],
                value: '15',
                fontsIze: 11
            }],
            events: {},
            def: {
                params: [null]
            },
            paramskEymAp: {
                VALUE: 0
            },
            func: function(sprite, script) {
                return script.getStringField('VALUE');
            }
        },
        practical_course_set_servo2: {
            color: '#D126BD',
            skeleton: 'basic',
            statements: [],
            isNotFor: [ 'Neobot' ],
            template: '%1 포트의 서보모터를 %2 도 이동 %3',
            params: [{
                type: 'Dropdown',
                options: [
                    ['OUT1', '1'],
                    ['OUT2', '2'],
                    ['OUT3', '3']
                ],
                value: '1',
                fontsIze: 11
            }, {
                type: 'Block',
                accept: 'string'
            }, {
                type: 'Indicator',
                img: 'block_icon/practical_course/servo.png',
                size: 12
            }],
            events: {},
            def: {
                params: [null, null, null],
                type: 'practical_course_set_servo2'
            },
            paramskEymAp: {
                PORT: 0,
                'DEGREE': 1
            },
            class: 'practical_course_servo',
            func: function(sprite, script) {
                var port = script.getNumberField('PORT');
                var degree = script.getNumberValue('DEGREE');
                if (degree < 0) {
                    degree = 0;
                } else if (degree > 180) {
                    degree = 180;
                }
                Entry.hw.sendQueue['OUT' + port] = degree;
                var option = port;
                if (option === 3) {
                    option = 4;
                }
                Entry.hw.sendQueue['OPT'] = Entry.hw.sendQueue['OPT'] | option;
                return script.callReturn();
            }
        },
        practical_course_move_for_secs: {
            color: '#00B200',
            skeleton: 'basic',
            fontColor: '#fff',
            statements: [],
            isNotFor: [ 'Neobot' ],
            template: '%1모터를 %2 %3의 속도로 %4초 동안 회전 %5',
            params: [{
                type: 'Dropdown',
                options: [
                    ['양쪽', '1'],
                    ['오른쪽', '2'],
                    ['왼쪽', '3'],
                ],
                value: '1',
                fontsIze: 11
            }, {
                type: 'Dropdown',
                options: [
                    ['앞으로', '16'],
                    ['뒤로', '32']
                ],
                value: '16',
                fontsIze: 11
            }, {
                type: 'Block',
                accept: 'string'
            }, {
                type: 'Block',
                accept: 'string'
            }, {
                type: 'Indicator',
                img: 'block_icon/practical_course/dcmotor.png',
                size: 12
            }],
            events: {},
            def: {
                params: [null, null, {
                    type: 'practical_course_motor_speed',
                }, {
                    type: 'number',
                    params: ['2'],
                }, null],
                type: 'practical_course_move_for_secs'
            },
            paramskEymAp: {
                'WHEEL': 0,
                'DIRECTION': 1,
                'SPEED': 2,
                DURATION: 3
            },
            class: 'practical_course_motor',
            func: function(sprite, script) {
                if (!script.isStart) {
                    var wheel = script.getNumberField('WHEEL');
                    var speed = script.getNumberValue('SPEED');
                    var direction = script.getNumberField('DIRECTION');
                    var duration = script.getNumberValue('DURATION');
                    var value = speed + direction;
                    switch (wheel) {
                        case 1:
                            {
                                Entry.hw.sendQueue['DCL'] = value;
                                Entry.hw.sendQueue['DCR'] = value;
                                break;
                            }

                        case 2:
                            {
                                Entry.hw.sendQueue['DCR'] = value;
                                break;
                            }

                        case 3:
                            {
                                Entry.hw.sendQueue['DCL'] = value;
                                break;
                            }
                    }

                    script.wheelMode = wheel;
                    script.isStart = true;
                    script.timeFlag = 1;
                    setTimeout(function() {
                        script.timeFlag = 0;
                    }, duration * 1000);
                    return script;
                } else if (script.timeFlag == 1) {
                    return script;
                } else {
                    switch (script.wheelMode) {
                        case 1:
                            {
                                Entry.hw.sendQueue['DCL'] = 0;
                                Entry.hw.sendQueue['DCR'] = 0;
                                break;
                            }

                        case 2:
                            {
                                Entry.hw.sendQueue['DCR'] = 0;
                                break;
                            }

                        case 3:
                            {
                                Entry.hw.sendQueue['DCL'] = 0;
                                break;
                            }
                    }
                    delete script.timeFlag;
                    delete script.isStart;
                    delete script.wheelMode;
                    Entry.engine.isContinue = false;
                    return script.callReturn();
                }
            }
        },
        practical_course_move_for: {
            color: '#00B200',
            skeleton: 'basic',
            fontColor: '#fff',
            statements: [],
            isNotFor: [ 'Neobot' ],
            template: '%1모터를 %2 %3의 속도로 계속 회전 %4',
            params: [{
                type: 'Dropdown',
                options: [
                    ['양쪽', '1'],
                    ['오른쪽', '2'],
                    ['왼쪽', '3'],
                ],
                value: '1',
                fontsIze: 11
            }, {
                type: 'Dropdown',
                options: [
                    ['앞으로', '16'],
                    ['뒤로', '32']
                ],
                value: '16',
                fontsIze: 11
            }, {
                type: 'Block',
                accept: 'string'
            }, {
                type: 'Indicator',
                img: 'block_icon/practical_course/dcmotor.png',
                size: 12
            }],
            events: {},
            def: {
                params: [null, null, {
                    type: 'practical_course_motor_speed',
                }, null],
                type: 'practical_course_move_for'
            },
            paramskEymAp: {
                'WHEEL': 0,
                'DIRECTION': 1,
                'SPEED': 2
            },
            class: 'practical_course_motor',
            //'isNotFor': ['mini'],
            func: function(sprite, script) {
                var wheel = script.getNumberField('WHEEL');
                var speed = script.getNumberValue('SPEED');
                var direction = script.getNumberField('DIRECTION');
                var value = speed + direction;

                switch (wheel) {
                    case 1:
                        {
                            Entry.hw.sendQueue['DCL'] = value;
                            Entry.hw.sendQueue['DCR'] = value;
                            break;
                        }

                    case 2:
                        {
                            Entry.hw.sendQueue['DCR'] = value;
                            break;
                        }

                    case 3:
                        {
                            Entry.hw.sendQueue['DCL'] = value;
                            break;
                        }
                }

                return script.callReturn();
            }
        },
        practical_course_stop_for: {
            color: '#00B200',
            skeleton: 'basic',
            fontColor: '#fff',
            statements: [],
            isNotFor: [ 'Neobot' ],
            template: '%1모터를 정지 %2',
            params: [{
                type: 'Dropdown',
                options: [
                    ['양쪽', '1'],
                    ['오른쪽', '2'],
                    ['왼쪽', '3'],
                ],
                value: '1',
                fontsIze: 11
            }, {
                type: 'Indicator',
                img: 'block_icon/practical_course/dcmotor.png',
                size: 12
            }],
            events: {},
            def: {
                params: [null, null],
                type: 'practical_course_stop_for'
            },
            paramskEymAp: {
                'WHEEL': 0
            },
            class: 'practical_course_motor',
            func: function(sprite, script) {
                var wheel = script.getNumberField('WHEEL');
                if (wheel == 2) {
                    Entry.hw.sendQueue['DCR'] = 0;
                } else if (wheel == 3) {
                    Entry.hw.sendQueue['DCL'] = 0;
                } else {
                    Entry.hw.sendQueue['DCR'] = 0;
                    Entry.hw.sendQueue['DCL'] = 0;
                }
                return script.callReturn();
            }
        },
        practical_course_touch_value: {
            color: '#2AB4D3',
            skeleton: 'basic_string_field',
            fontColor: '#fff',
            statements: [],
            isNotFor: [ 'Neobot' ],
            template: '%1번 포트의 접촉 센서 값',
            params: [{
                type: 'Dropdown',
                options: [
                    ['IN 1', '1'],
                    ['IN 2', '2'],
                    ['IN 3', '3']
                ],
                value: '1',
                fontsIze: 11
            }],
            events: {},
            def: {
                params: [null],
                type: 'practical_course_touch_value'
            },
            paramskEymAp: {
                PORT: 0
            },
            class: 'practical_course_touch',
            func: function(sprite, script) {
                var port = script.getStringField('PORT');
                var value = (Entry.hw.portData['IN' + port] > 125) ? 1 : 0;
                return value;
            }
        },
        practical_course_touch_value_boolean: {
            color: '#2AB4D3',
            skeleton: 'basic_boolean_field',
            fontColor: '#fff',
            template: '%1번 포트의 접촉 센서가 %2',
            params: [{
                type: 'Dropdown',
                options: [
                    ['IN 1', '1'],
                    ['IN 2', '2'],
                    ['IN 3', '3']
                ],
                value: '1',
                fontsIze: 11
            }, {
                type: 'Dropdown',
                options: [
                    ['접촉 되면', '1'],
                    ['접촉 안되면', '0']
                ],
                value: '1',
                fontsIze: 11
            }],
            def: {
                params: [null, null, null],
                type: 'practical_course_touch_value_boolean'
            },
            paramskEymAp: {
                PORT: 0,
                'TOUCH': 1
            },
            class: 'practical_course_touch',
            func: function(sprite, script) {
                var port = script.getStringField('PORT');
                var touch = script.getNumberField('TOUCH', script);
                var value = Entry.hw.portData['IN' + port];
                var isTouch = !((value > 125) ^ touch);

                return isTouch;
            }
        },
        practical_course_light_value: {
            color: '#498DEB',
            skeleton: 'basic_string_field',
            fontColor: '#fff',
            statements: [],
            isNotFor: [ 'Neobot' ],
            template: '%1번 포트의 빛 감지 센서 값',
            params: [{
                type: 'Dropdown',
                options: [
                    ['IN 1', '1'],
                    ['IN 2', '2'],
                    ['IN 3', '3']
                ],
                value: '1',
                fontsIze: 11
            }],
            events: {},
            def: {
                params: [null],
                type: 'practical_course_light_value'
            },
            paramskEymAp: {
                PORT: 0
            },
            class: 'practical_course_light',
            func: function(sprite, script) {
                var port = script.getStringField('PORT');
                return Entry.hw.portData['IN' + port];
            }
        },
        practical_course_light_value_boolean: {
            color: '#498DEB',
            skeleton: 'basic_boolean_field',
            fontColor: '#fff',
            template: '%1번 포트의 빛 감지 센서 값 %2 %3',
            params: [{
                type: 'Dropdown',
                options: [
                    ['IN 1', '1'],
                    ['IN 2', '2'],
                    ['IN 3', '3']
                ],
                value: '1',
                fontsIze: 11
            }, {
                type: 'Dropdown',
                options: [
                    ['=', 'EQUAL'],
                    ['>', 'GREATER'],
                    ['<', 'LESS'],
                    ['≥', 'GREATER_OR_EQUAL'],
                    ['≤', 'LESS_OR_EQUAL']
                ],
                value: 'LESS',
                fontsIze: 11,
                noaRrow: true
            }, {
                type: 'Block',
                accept: 'string'
            }],
            def: {
                params: [null, null, {
                    type: 'number',
                    params: ['100']
                }],
                type: 'practical_course_light_value_boolean'
            },
            paramskEymAp: {
                PORT: 0,
                'OPERATOR': 1,
                'RIGHTVALUE': 2
            },
            class: 'practical_course_light',
            func: function(sprite, script) {
                var port = script.getNumberField('PORT', script);
                var operator = script.getField('OPERATOR', script);
                var rightValue = script.getNumberValue('RIGHTVALUE', script);
                var leftValue = Entry.hw.portData['IN' + port];
                var isCheck = false;

                switch (operator) {
                    case 'EQUAL':
                        isCheck = leftValue == rightValue;
                        break;
                    case 'GREATER':
                        isCheck = Number(leftValue) > Number(rightValue);
                        break;
                    case 'LESS':
                        isCheck = Number(leftValue) < Number(rightValue);
                        break;
                    case 'GREATER_OR_EQUAL':
                        isCheck = Number(leftValue) >= Number(rightValue);
                        break;
                    case 'LESS_OR_EQUAL':
                        isCheck = Number(leftValue) <= Number(rightValue);
                        break;
                }

                return isCheck;
            }
        },
        practical_course_sound_value: {
            color: '#00D67F',
            skeleton: 'basic_string_field',
            fontColor: '#fff',
            statements: [],
            isNotFor: [ 'Neobot' ],
            template: '%1번 포트의 소리 센서에 감지되는 소리 값',
            params: [{
                type: 'Dropdown',
                options: [
                    ['IN 1', '1'],
                    ['IN 2', '2'],
                    ['IN 3', '3']
                ],
                value: '1',
                fontsIze: 11
            }],
            events: {},
            def: {
                params: [null],
                type: 'practical_course_sound_value'
            },
            paramskEymAp: {
                PORT: 0
            },
            class: 'practical_course_sound',
            func: function(sprite, script) {
                var port = script.getStringField('PORT');
                return Entry.hw.portData['IN' + port];
            }
        },
        practical_course_sound_value_boolean: {
            color: '#00D67F',
            skeleton: 'basic_boolean_field',
            fontColor: '#fff',
            template: '%1번 포트의 소리 센서에 감지되는 소리 값 %2 %3',
            params: [{
                type: 'Dropdown',
                options: [
                    ['IN 1', '1'],
                    ['IN 2', '2'],
                    ['IN 3', '3']
                ],
                value: '1',
                fontsIze: 11
            }, {
                type: 'Dropdown',
                options: [
                    ['=', 'EQUAL'],
                    ['>', 'GREATER'],
                    ['<', 'LESS'],
                    ['≥', 'GREATER_OR_EQUAL'],
                    ['≤', 'LESS_OR_EQUAL']
                ],
                value: 'LESS',
                fontsIze: 11,
                noaRrow: true
            }, {
                type: 'Block',
                accept: 'string'
            }],
            def: {
                params: [null, null, {
                    type: 'number',
                    params: ['100']
                }],
                type: 'practical_course_sound_value_boolean'
            },
            paramskEymAp: {
                PORT: 0,
                'OPERATOR': 1,
                'RIGHTVALUE': 2
            },
            class: 'practical_course_sound',
            func: function(sprite, script) {
                var port = script.getNumberField('PORT', script);
                var operator = script.getField('OPERATOR', script);
                var rightValue = script.getNumberValue('RIGHTVALUE', script);
                var leftValue = Entry.hw.portData['IN' + port];
                var isCheck = false;

                switch (operator) {
                    case 'EQUAL':
                        isCheck = leftValue == rightValue;
                        break;
                    case 'GREATER':
                        isCheck = Number(leftValue) > Number(rightValue);
                        break;
                    case 'LESS':
                        isCheck = Number(leftValue) < Number(rightValue);
                        break;
                    case 'GREATER_OR_EQUAL':
                        isCheck = Number(leftValue) >= Number(rightValue);
                        break;
                    case 'LESS_OR_EQUAL':
                        isCheck = Number(leftValue) <= Number(rightValue);
                        break;
                }

                return isCheck;
            }
        },
        practical_course_irs_value: {
            color: '#C4065C',
            skeleton: 'basic_string_field',
            fontColor: '#fff',
            statements: [],
            isNotFor: [ 'Neobot' ],
            template: '%1번 포트의 적외선 센서에 감지되는 크기 값',
            params: [{
                type: 'Dropdown',
                options: [
                    ['IN 1', '1'],
                    ['IN 2', '2'],
                    ['IN 3', '3']
                ],
                value: '1',
                fontsIze: 11
            }],
            events: {},
            def: {
                params: [null],
                type: 'practical_course_irs_value'
            },
            paramskEymAp: {
                PORT: 0
            },
            class: 'practical_course_irs',
            //'isNotFor': ['mini'],
            func: function(sprite, script) {
                var port = script.getStringField('PORT');
                return Entry.hw.portData['IN' + port];
            }
        },
        practical_course_irs_value_boolean: {
            color: '#C4065C',
            skeleton: 'basic_boolean_field',
            fontColor: '#fff',
            template: '%1번 포트의 적외선 센서에 감지되는 크기 값이 %2 %3',
            params: [{
                type: 'Dropdown',
                options: [
                    ['IN 1', '1'],
                    ['IN 2', '2'],
                    ['IN 3', '3']
                ],
                value: '1',
                fontsIze: 11
            }, {
                type: 'Dropdown',
                options: [
                    ['=', 'EQUAL'],
                    ['>', 'GREATER'],
                    ['<', 'LESS'],
                    ['≥', 'GREATER_OR_EQUAL'],
                    ['≤', 'LESS_OR_EQUAL']
                ],
                value: 'LESS',
                fontsIze: 11,
                noaRrow: true
            }, {
                type: 'Block',
                accept: 'string'
            }],
            def: {
                params: [null, null, {
                    type: 'number',
                    params: ['100']
                }],
                type: 'practical_course_irs_value_boolean'
            },
            paramskEymAp: {
                PORT: 0,
                'OPERATOR': 1,
                'RIGHTVALUE': 2
            },
            class: 'practical_course_irs',
            //'isNotFor': ['mini'],
            func: function(sprite, script) {
                var port = script.getNumberField('PORT', script);
                var operator = script.getField('OPERATOR', script);
                var rightValue = script.getNumberValue('RIGHTVALUE', script);
                var leftValue = Entry.hw.portData['IN' + port];
                var isCheck = false;

                switch (operator) {
                    case 'EQUAL':
                        isCheck = leftValue == rightValue;
                        break;
                    case 'GREATER':
                        isCheck = Number(leftValue) > Number(rightValue);
                        break;
                    case 'LESS':
                        isCheck = Number(leftValue) < Number(rightValue);
                        break;
                    case 'GREATER_OR_EQUAL':
                        isCheck = Number(leftValue) >= Number(rightValue);
                        break;
                    case 'LESS_OR_EQUAL':
                        isCheck = Number(leftValue) <= Number(rightValue);
                        break;
                }

                return isCheck;
            }
        },
        practical_course_diode_secs_toggle: {
            color: '#FF8D10',
            skeleton: 'basic',
            fontColor: '#fff',
            statements: [],
            isNotFor: [ 'Neobot' ],
            template: '%1번 포트의 발광다이오드를 %2초 동안 %3 %4',
            params: [{
                type: 'Dropdown',
                options: [
                    ['OUT 1', '1'],
                    ['OUT 2', '2'],
                    ['OUT 3', '3']
                ],
                value: '1',
                fontsIze: 11
            }, {
                type: 'Block',
                accept: 'string'
            }, {
                type: 'Dropdown',
                options: [
                    ['켜기', '255'],
                    ['끄기', '0']
                ],
                value: '255',
                fontsIze: 11
            }, {
                type: 'Indicator',
                img: 'block_icon/practical_course/diode.png',
                size: 12
            }],
            events: {},
            def: {
                params: [null, {
                    type: 'number',
                    params: ['2']
                }, null, null],
                type: 'practical_course_diode_secs_toggle'
            },
            paramskEymAp: {
                PORT: 0,
                DURATION: 1,
                VALUE: 2
            },
            class: 'practical_course_diode',
            func: function(sprite, script) {
                if (!script.isStart) {
                    var port = script.getNumberField('PORT');
                    var duration = script.getNumberValue('DURATION');
                    var value = script.getNumberField('VALUE');

                    var option = port;
                    if (value < 0) {
                        value = 0;
                    } else if (value > 255) {
                        value = 255;
                    }
                    if (option === 3) {
                        option = 4;
                    }

                    script.isStart = true;
                    script.timeFlag = 1;
                    script.outPort = port;
                    script.outOption = option;
                    Entry.hw.sendQueue['OUT' + port] = value;
                    Entry.hw.sendQueue['OPT'] = Entry.hw.sendQueue['OPT'] & (~option);

                    setTimeout(function() {
                        script.timeFlag = 0;
                    }, duration * 1000);
                    return script;
                } else if (script.timeFlag == 1) {
                    return script;
                } else {
                    Entry.hw.sendQueue['OUT' + script.outPort] = 0;
                    Entry.hw.sendQueue['OPT'] = Entry.hw.sendQueue['OPT'] & (~script.outOption);
                    delete script.timeFlag;
                    delete script.isStart;
                    delete script.outPort;
                    delete script.outOption;
                    Entry.engine.isContinue = false;
                    return script.callReturn();
                }
            }
        },
        practical_course_diode_toggle: {
            color: '#FF8D10',
            skeleton: 'basic',
            fontColor: '#fff',
            statements: [],
            isNotFor: [ 'Neobot' ],
            template: '%1번 포트의 발광다이오드를 %2 %3',
            params: [{
                type: 'Dropdown',
                options: [
                    ['OUT 1', '1'],
                    ['OUT 2', '2'],
                    ['OUT 3', '3']
                ],
                value: '1',
                fontsIze: 11
            }, {
                type: 'Dropdown',
                options: [
                    ['켜기', '255'],
                    ['끄기', '0']
                ],
                value: '255',
                fontsIze: 11
            }, {
                type: 'Indicator',
                img: 'block_icon/practical_course/diode.png',
                size: 12
            }],
            events: {},
            def: {
                params: [null, null, null],
                type: 'practical_course_diode_toggle'
            },
            paramskEymAp: {
                PORT: 0,
                VALUE: 1
            },
            class: 'practical_course_diode',
            //'isNotFor': ['mini'],
            func: function(sprite, script) {
                var port = script.getNumberField('PORT');
                var value = script.getNumberField('VALUE');
                var option = port;

                if (value < 0) {
                    value = 0;
                } else if (value > 255) {
                    value = 255;
                }

                if (option === 3) {
                    option = 4;
                }

                Entry.hw.sendQueue['OUT' + port] = value;
                Entry.hw.sendQueue['OPT'] = Entry.hw.sendQueue['OPT'] & (~option);

                return script.callReturn();
            }
        },
        practical_course_diode_inout_toggle: {
            color: '#FF8D10',
            skeleton: 'basic',
            fontColor: '#fff',
            statements: [],
            isNotFor: [ 'Neobot' ],
            template: '%1번 포트의 발광다이오드를 %2번 포트의 %3~%4의 범위로 켜기%5',
            params: [{
                type: 'Dropdown',
                options: [
                    ['OUT 1', '1'],
                    ['OUT 2', '2'],
                    ['OUT 3', '3']
                ],
                value: '1',
                fontsIze: 11
            }, {
                type: 'Dropdown',
                options: [
                    ['IN 1', '1'],
                    ['IN 2', '2'],
                    ['IN 3', '3']
                ],
                value: '1',
                fontsIze: 11
            }, {
                type: 'Block',
                accept: 'string'
            }, {
                type: 'Block',
                accept: 'string'
            }, {
                type: 'Indicator',
                img: 'block_icon/practical_course/diode.png',
                size: 12
            }],
            events: {},
            def: {
                params: [null, null,
                    { type: 'number', params: ['0'] },
                    { type: 'number', params: ['255'] },
                    null
                ],
                type: 'practical_course_diode_inout_toggle'
            },
            paramskEymAp: {
                'OUTPUT': 0,
                'INPUT': 1,
                'MIN': 2,
                'MAX': 3
            },
            class: 'practical_course_diode',
            //'isNotFor': ['mini'],
            func: function(sprite, script) {
                var outputPort = script.getNumberField('OUTPUT');
                var inputPort = script.getNumberField('INPUT');
                var option = inputPort;
                if (option === 3) {
                    option = 4;
                }
                var oMin = script.getNumberValue('MIN');
                var oMax = script.getNumberValue('MAX');
                var nMin = 0;
                var nMax = 255;
                var x = Entry.hw.portData['IN' + inputPort];
                var percent = (x - oMin) / (oMax - oMin);
                result = percent * (nMax - nMin) + nMin;
                if (result > nMax)
                    result = nMax;
                if (result < nMin)
                    result = nMin;

                Entry.hw.sendQueue['OUT' + outputPort] = result;
                Entry.hw.sendQueue['OPT'] = Entry.hw.sendQueue['OPT'] & (~option);

                return script.callReturn();
            }
        },
        practical_course_diode_set_output: {
            color: '#FF8D10',
            skeleton: 'basic',
            statements: [],
            isNotFor: [ 'Neobot' ],
            template: '%1번 포트의 발광다이오드를 %2의 밝기로 정하기 %3',
            params: [{
                type: 'Dropdown',
                options: [
                    ['OUT 1', '1'],
                    ['OUT 2', '2'],
                    ['OUT 3', '3']
                ],
                value: '1',
                fontsIze: 11
            }, {
                type: 'Block',
                accept: 'string'
            }, {
                type: 'Indicator',
                img: 'block_icon/practical_course/diode.png',
                size: 12
            }],
            events: {},
            def: {
                params: [null, {
                    type: 'number',
                    params: ['255']
                }, null],
                type: 'practical_course_diode_set_output',
            },
            paramskEymAp: {
                PORT: 0,
                VALUE: 1
            },
            class: 'practical_course_diode',
            //'isNotFor': ['mini'],
            func: function(sprite, script) {
                var port = script.getStringField('PORT', script);
                var value = script.getNumberValue('VALUE', script);
                var option = port;
                if (value < 0) {
                    value = 0;
                } else if (value > 255) {
                    value = 255;
                }
                if (option === 3) {
                    option = 4;
                }
                Entry.hw.sendQueue['OUT' + port] = value;
                Entry.hw.sendQueue['OPT'] = Entry.hw.sendQueue['OPT'] & (~option);
                return script.callReturn();
            }
        },
        practical_course_diode_input_value: {
            color: '#FF8D10',
            skeleton: 'basic_string_field',
            fontColor: '#fff',
            statements: [],
            isNotFor: [ 'Neobot' ],
            template: '%1번 포트의 값',
            params: [{
                type: 'Dropdown',
                options: [
                    ['IN 1', '1'],
                    ['IN 2', '2'],
                    ['IN 3', '3']
                ],
                value: '1',
                fontsIze: 11
            }],
            events: {},
            def: {
                params: [null],
                type: 'practical_course_diode_input_value'
            },
            paramskEymAp: {
                PORT: 0
            },
            class: 'practical_course_diode',
            func: function(sprite, script) {
                var port = script.getStringField('PORT');
                return Entry.hw.portData['IN' + port];
            }
        },
        practical_course_melody_note_for: {
            color: '#FC327F',
            skeleton: 'basic',
            statements: [],
            isNotFor: [ 'Neobot' ],
            template: '멜로디 %1 을(를) %2 옥타브로 %3 길이만큼 소리내기 %4',
            params: [{
                type: 'Dropdown',
                options: [
                    ['무음', '0'],
                    ['도', '1'],
                    ['도#(레♭)', '2'],
                    ['레', '3'],
                    ['레#(미♭)', '4'],
                    ['미', '5'],
                    ['파', '6'],
                    ['파#(솔♭)', '7'],
                    ['솔', '8'],
                    ['솔#(라♭)', '9'],
                    ['라', '10'],
                    ['라#(시♭)', '11'],
                    ['시', '12']
                ],
                value: '1',
                fontsIze: 11
            }, {
                type: 'Dropdown',
                options: [
                    ['1', '0'],
                    ['2', '1'],
                    ['3', '2'],
                    ['4', '3'],
                    ['5', '4'],
                    ['6', '5']
                ],
                value: '2',
                fontsIze: 11
            }, {
                type: 'Dropdown',
                options: [
                    ['온음표', '1'],
                    ['2분음표', '2'],
                    ['4분음표', '4'],
                    ['8분음표', '8'],
                    ['16분음표', '16'],
                ],
                value: '4',
                fontsIze: 11
            }, {
                type: 'Indicator',
                img: 'block_icon/practical_course/melody.png',
                size: 12
            }],
            events: {},
            def: {
                params: [null, null, null, null],
                type: 'practical_course_melody_note_for'
            },
            paramskEymAp: {
                'NOTE': 0,
                'OCTAVE': 1,
                DURATION: 2
            },
            class: 'practical_course_melody',
            //'isNotFor': ['mini'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;

                if (!script.isStart) {
                    var note = script.getNumberField('NOTE', script);
                    var octave = script.getNumberField('OCTAVE', script);
                    var duration = script.getNumberField(DURATION, script);
                    var value = (note > 0) ? note + (12 * octave) : 0;

                    script.isStart = true;
                    script.timeFlag = 1;
                    script.soundFlag = 1;
                    if (value > 65) {
                        value = 65;
                    }
                    sq.SND = value;
                    setTimeout(function() {
                        setTimeout(function() {
                            script.timeFlag = 0;
                        }, 50);
                    }, 1 / duration * 2000);
                    return script;
                } else if (script.timeFlag == 1) {
                    return script;
                } else if (script.soundFlag == 1) {
                    Entry.hw.sendQueue['SND'] = 0;
                    script.soundFlag = 0;
                    return script;
                } else {
                    delete script.timeFlag;
                    delete script.isStart;
                    Entry.engine.isContinue = false;
                    return script.callReturn();
                }
            }
        },
    };

    $.extend(Entry.block, miniBlock);

})();
