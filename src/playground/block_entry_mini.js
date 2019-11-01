const miniBlock = {
    practical_course_dummy: {
        color: '#7C7C7C',
        skeleton: 'basic',
        statements: [],
        isNotFor: ['arduinoDisconnected'],
        template: '%1',
        params: [
            {
                type: 'Indicator',
                color: '#6B6B6B',
                size: 12,
            },
        ],
        events: {},
        def: {
            params: [null],
            type: 'practical_course_dummy',
        },
        paramsKeyMap: {
            VALUE: 0,
        },
        func(sprite, script) {},
    },
    practical_course_motor_speed: {
        color: '#00B200',
        outerLine: '#019101',
        skeleton: 'basic_string_field',
        statements: [],
        isNotFor: ['neobot'],
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
                value: '15',
                bgColor: '#019101',
                arrowColor: EntryStatic.colorSet.common.WHITE,
            },
        ],
        events: {},
        def: {
            params: [null],
        },
        paramsKeyMap: {
            VALUE: 0,
        },
        func(sprite, script) {
            return script.getStringField('VALUE');
        },
    },
    practical_course_set_servo2: {
        color: '#D128BD',
        outerLine: '#a2049e',
        skeleton: 'basic',
        statements: [],
        isNotFor: ['neobot'],
        template: '%1 포트의 서보모터를 %2 도 이동 %3',
        params: [
            {
                type: 'Dropdown',
                options: [['OUT1', '1'], ['OUT2', '2'], ['OUT3', '3']],
                value: '1',
                fontSize: 11,
                bgColor: '#A2049E',
                arrowColor: EntryStatic.colorSet.common.WHITE,
            },
            {
                type: 'Block',
                accept: 'string',
            },
            {
                type: 'Indicator',
                img: 'block_icon/practical_course/servo.png',
                size: 12,
            },
        ],
        events: {},
        def: {
            params: [null, null, null],
            type: 'practical_course_set_servo2',
        },
        paramsKeyMap: {
            PORT: 0,
            DEGREE: 1,
        },
        class: 'practical_course_servo',
        func(sprite, script) {
            const port = script.getNumberField('PORT');
            let degree = script.getNumberValue('DEGREE');
            if (degree < 0) {
                degree = 0;
            } else if (degree > 180) {
                degree = 180;
            }
            Entry.hw.sendQueue[`OUT${port}`] = degree;
            let option = port;
            if (option === 3) {
                option = 4;
            }
            Entry.hw.sendQueue.OPT = Entry.hw.sendQueue.OPT | option;
            return script.callReturn();
        },
    },
    practical_course_move_for_secs: {
        color: '#00B200',
        outerLine: '#019101',
        skeleton: 'basic',
        fontColor: '#fff',
        statements: [],
        isNotFor: ['neobot'],
        template: '%1모터를 %2 %3의 속도로 %4초 동안 회전 %5',
        params: [
            {
                type: 'Dropdown',
                options: [['양쪽', '1'], ['오른쪽', '2'], ['왼쪽', '3']],
                value: '1',
                fontSize: 11,
                bgColor: '#019101',
                arrowColor: EntryStatic.colorSet.common.WHITE,
            },
            {
                type: 'Dropdown',
                options: [['앞으로', '16'], ['뒤로', '32']],
                value: '16',
                fontSize: 11,
                bgColor: '#019101',
                arrowColor: EntryStatic.colorSet.common.WHITE,
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
                img: 'block_icon/practical_course/dcmotor.png',
                size: 12,
            },
        ],
        events: {},
        def: {
            params: [
                null,
                null,
                {
                    type: 'practical_course_motor_speed',
                },
                {
                    type: 'number',
                    params: ['2'],
                },
                null,
            ],
            type: 'practical_course_move_for_secs',
        },
        paramsKeyMap: {
            WHEEL: 0,
            DIRECTION: 1,
            SPEED: 2,
            DURATION: 3,
        },
        class: 'practical_course_motor',
        func(sprite, script) {
            if (!script.isStart) {
                const wheel = script.getNumberField('WHEEL');
                const speed = script.getNumberValue('SPEED');
                const direction = script.getNumberField('DIRECTION');
                const duration = script.getNumberValue('DURATION');
                const value = speed + direction;
                switch (wheel) {
                    case 1: {
                        Entry.hw.sendQueue.DCL = value;
                        Entry.hw.sendQueue.DCR = value;
                        break;
                    }

                    case 2: {
                        Entry.hw.sendQueue.DCR = value;
                        break;
                    }

                    case 3: {
                        Entry.hw.sendQueue.DCL = value;
                        break;
                    }
                }

                script.wheelMode = wheel;
                script.isStart = true;
                script.timeFlag = 1;
                setTimeout(() => {
                    script.timeFlag = 0;
                }, duration * 1000);
                return script;
            } else if (script.timeFlag == 1) {
                return script;
            } else {
                switch (script.wheelMode) {
                    case 1: {
                        Entry.hw.sendQueue.DCL = 0;
                        Entry.hw.sendQueue.DCR = 0;
                        break;
                    }

                    case 2: {
                        Entry.hw.sendQueue.DCR = 0;
                        break;
                    }

                    case 3: {
                        Entry.hw.sendQueue.DCL = 0;
                        break;
                    }
                }
                delete script.timeFlag;
                delete script.isStart;
                delete script.wheelMode;
                Entry.engine.isContinue = false;
                return script.callReturn();
            }
        },
    },
    practical_course_move_for_secs2: {
        color: '#00B200',
        outerLine: '#019101',
        skeleton: 'basic',
        fontColor: '#fff',
        statements: [],
        isNotFor: ['neobot'],
        template: '왼쪽 모터를 %1 %2의 속도로, 오른쪽 모터를 %3 %4의 속도로 %5초 동안 회전 %6',
        params: [
            {
                type: 'Dropdown',
                options: [['앞으로', '16'], ['뒤로', '32']],
                value: '16',
                fontSize: 11,
                bgColor: '#019101',
                arrowColor: EntryStatic.colorSet.common.WHITE,
            },
            {
                type: 'Block',
                accept: 'string',
            },
            {
                type: 'Dropdown',
                options: [['앞으로', '16'], ['뒤로', '32']],
                value: '16',
                fontSize: 11,
                bgColor: '#019101',
                arrowColor: EntryStatic.colorSet.common.WHITE,
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
                img: 'block_icon/practical_course/dcmotor.png',
                size: 12,
            },
        ],
        events: {},
        def: {
            params: [
                null,
                {
                    type: 'practical_course_motor_speed',
                },
                null,
                {
                    type: 'practical_course_motor_speed',
                },
                {
                    type: 'number',
                    params: ['2'],
                },
                null,
            ],
            type: 'practical_course_move_for_secs2',
        },
        paramsKeyMap: {
            DIRECTION1: 0,
            SPEED1: 1,
            DIRECTION2: 2,
            SPEED2: 3,
            DURATION: 4,
        },
        class: 'practical_course_motor',
        func(sprite, script) {
            if (!script.isStart) {
                // var wheel = script.getNumberField('WHEEL');
                const speed1 = script.getNumberValue('SPEED1');
                const speed2 = script.getNumberValue('SPEED2');
                const direction1 = script.getNumberField('DIRECTION1');
                const direction2 = script.getNumberField('DIRECTION2');
                const duration = script.getNumberValue('DURATION');
                const value1 = speed1 + direction1;
                const value2 = speed2 + direction2;

                Entry.hw.sendQueue.DCL = value1;
                Entry.hw.sendQueue.DCR = value2;

                script.isStart = true;
                script.timeFlag = 1;
                setTimeout(() => {
                    script.timeFlag = 0;
                }, duration * 1000);
                return script;
            } else if (script.timeFlag == 1) {
                return script;
            } else {
                Entry.hw.sendQueue.DCL = 0;
                Entry.hw.sendQueue.DCR = 0;

                delete script.timeFlag;
                delete script.isStart;
                delete script.wheelMode;
                Entry.engine.isContinue = false;
                return script.callReturn();
            }
        },
    },
    practical_course_move_for: {
        color: '#00B200',
        outerLine: '#019101',
        skeleton: 'basic',
        fontColor: '#fff',
        statements: [],
        isNotFor: ['neobot'],
        template: '%1모터를 %2 %3의 속도로 계속 회전 %4',
        params: [
            {
                type: 'Dropdown',
                options: [['양쪽', '1'], ['오른쪽', '2'], ['왼쪽', '3']],
                value: '1',
                fontSize: 11,
                bgColor: '#019101',
                arrowColor: EntryStatic.colorSet.common.WHITE,
            },
            {
                type: 'Dropdown',
                options: [['앞으로', '16'], ['뒤로', '32']],
                value: '16',
                fontSize: 11,
                bgColor: '#019101',
                arrowColor: EntryStatic.colorSet.common.WHITE,
            },
            {
                type: 'Block',
                accept: 'string',
            },
            {
                type: 'Indicator',
                img: 'block_icon/practical_course/dcmotor.png',
                size: 12,
            },
        ],
        events: {},
        def: {
            params: [
                null,
                null,
                {
                    type: 'practical_course_motor_speed',
                },
                null,
            ],
            type: 'practical_course_move_for',
        },
        paramsKeyMap: {
            WHEEL: 0,
            DIRECTION: 1,
            SPEED: 2,
        },
        class: 'practical_course_motor',
        //'isNotFor': ['mini'],
        func(sprite, script) {
            const wheel = script.getNumberField('WHEEL');
            const speed = script.getNumberValue('SPEED');
            const direction = script.getNumberField('DIRECTION');
            const value = speed + direction;

            switch (wheel) {
                case 1: {
                    Entry.hw.sendQueue.DCL = value;
                    Entry.hw.sendQueue.DCR = value;
                    break;
                }

                case 2: {
                    Entry.hw.sendQueue.DCR = value;
                    break;
                }

                case 3: {
                    Entry.hw.sendQueue.DCL = value;
                    break;
                }
            }

            return script.callReturn();
        },
    },
    practical_course_move_for2: {
        color: '#00B200',
        outerLine: '#019101',
        skeleton: 'basic',
        fontColor: '#fff',
        statements: [],
        isNotFor: ['neobot'],
        template: '왼쪽 모터를 %1 %2의 속도로, 오른쪽 모터를 %3 %4의 속도로 계속 회전 %5',
        params: [
            {
                type: 'Dropdown',
                options: [['앞으로', '16'], ['뒤로', '32']],
                value: '16',
                fontSize: 11,
                bgColor: '#019101',
                arrowColor: EntryStatic.colorSet.common.WHITE,
            },
            {
                type: 'Block',
                accept: 'string',
            },
            {
                type: 'Dropdown',
                options: [['앞으로', '16'], ['뒤로', '32']],
                value: '16',
                fontSize: 11,
                bgColor: '#019101',
                arrowColor: EntryStatic.colorSet.common.WHITE,
            },
            {
                type: 'Block',
                accept: 'string',
            },
            {
                type: 'Indicator',
                img: 'block_icon/practical_course/dcmotor.png',
                size: 12,
            },
        ],
        events: {},
        def: {
            params: [
                null,
                {
                    type: 'practical_course_motor_speed',
                },
                null,
                {
                    type: 'practical_course_motor_speed',
                },
                null,
            ],
            type: 'practical_course_move_for2',
        },
        paramsKeyMap: {
            DIRECTION1: 0,
            SPEED1: 1,
            DIRECTION2: 2,
            SPEED2: 3,
        },
        class: 'practical_course_motor',
        //'isNotFor': ['mini'],
        func(sprite, script) {
            const speed1 = script.getNumberValue('SPEED1');
            const direction1 = script.getNumberField('DIRECTION1');
            const speed2 = script.getNumberValue('SPEED2');
            const direction2 = script.getNumberField('DIRECTION2');
            const value1 = speed1 + direction1;
            const value2 = speed2 + direction2;

            Entry.hw.sendQueue.DCL = value1;
            Entry.hw.sendQueue.DCR = value2;

            return script.callReturn();
        },
    },
    practical_course_stop_for: {
        color: '#00B200',
        outerLine: '#019101',
        skeleton: 'basic',
        fontColor: '#fff',
        statements: [],
        isNotFor: ['neobot'],
        template: '%1모터를 정지 %2',
        params: [
            {
                type: 'Dropdown',
                options: [['양쪽', '1'], ['오른쪽', '2'], ['왼쪽', '3']],
                value: '1',
                fontSize: 11,
                bgColor: '#019101',
                arrowColor: EntryStatic.colorSet.common.WHITE,
            },
            {
                type: 'Indicator',
                img: 'block_icon/practical_course/dcmotor.png',
                size: 12,
            },
        ],
        events: {},
        def: {
            params: [null, null],
            type: 'practical_course_stop_for',
        },
        paramsKeyMap: {
            WHEEL: 0,
        },
        class: 'practical_course_motor',
        func(sprite, script) {
            const wheel = script.getNumberField('WHEEL');
            if (wheel == 2) {
                Entry.hw.sendQueue.DCR = 0;
            } else if (wheel == 3) {
                Entry.hw.sendQueue.DCL = 0;
            } else {
                Entry.hw.sendQueue.DCR = 0;
                Entry.hw.sendQueue.DCL = 0;
            }
            return script.callReturn();
        },
    },
    practical_course_touch_value: {
        color: '#2AB4D3',
        outerLine: '#0e93b1',
        skeleton: 'basic_string_field',
        fontColor: '#fff',
        statements: [],
        isNotFor: ['neobot'],
        template: '%1번 포트의 접촉 센서 값',
        params: [
            {
                type: 'Dropdown',
                options: [['IN 1', '1'], ['IN 2', '2'], ['IN 3', '3']],
                value: '1',
                fontSize: 11,
                bgColor: '#0e93b1',
                arrowColor: EntryStatic.colorSet.common.WHITE,
            },
        ],
        events: {},
        def: {
            params: [null],
            type: 'practical_course_touch_value',
        },
        paramsKeyMap: {
            PORT: 0,
        },
        class: 'practical_course_touch',
        func(sprite, script) {
            const port = script.getStringField('PORT');
            const value = Entry.hw.portData[`IN${port}`] > 125 ? 1 : 0;
            return value;
        },
    },
    practical_course_touch_value_boolean: {
        color: '#2AB4D3',
        outerLine: '#0e93b1',
        skeleton: 'basic_boolean_field',
        fontColor: '#fff',
        isNotFor: ['neobot'],
        template: '%1번 포트의 접촉 센서가 %2',
        params: [
            {
                type: 'Dropdown',
                options: [['IN 1', '1'], ['IN 2', '2'], ['IN 3', '3']],
                value: '1',
                fontSize: 11,
                bgColor: '#0e93b1',
                arrowColor: EntryStatic.colorSet.common.WHITE,
            },
            {
                type: 'Dropdown',
                options: [['접촉 되면', '1'], ['접촉 안되면', '0']],
                value: '1',
                fontSize: 11,
                bgColor: '#0e93b1',
                arrowColor: EntryStatic.colorSet.common.WHITE,
            },
        ],
        def: {
            params: [null, null, null],
            type: 'practical_course_touch_value_boolean',
        },
        paramsKeyMap: {
            PORT: 0,
            TOUCH: 1,
        },
        class: 'practical_course_touch',
        func(sprite, script) {
            const port = script.getStringField('PORT');
            const touch = script.getNumberField('TOUCH', script);
            const value = Entry.hw.portData[`IN${port}`];
            const isTouch = !((value > 125) ^ touch);

            return isTouch;
        },
    },
    practical_course_light_value: {
        color: '#ff8d0f',
        outerLine: '#e37100',
        skeleton: 'basic_string_field',
        fontColor: '#fff',
        statements: [],
        isNotFor: ['neobot'],
        template: '%1번 포트의 빛 감지 센서 값',
        params: [
            {
                type: 'Dropdown',
                options: [['IN 1', '1'], ['IN 2', '2'], ['IN 3', '3']],
                value: '1',
                fontSize: 11,
                bgColor: '#e37100',
                arrowColor: EntryStatic.colorSet.common.WHITE,
            },
        ],
        events: {},
        def: {
            params: [null],
            type: 'practical_course_light_value',
        },
        paramsKeyMap: {
            PORT: 0,
        },
        class: 'practical_course_light',
        func(sprite, script) {
            const port = script.getStringField('PORT');
            return Entry.hw.portData[`IN${port}`];
        },
    },
    practical_course_light_value_boolean: {
        color: '#ff8d0f',
        outerLine: '#e37100',
        skeleton: 'basic_boolean_field',
        fontColor: '#fff',
        isNotFor: ['neobot'],
        template: '%1번 포트의 빛 감지 센서 값 %2 %3',
        params: [
            {
                type: 'Dropdown',
                options: [['IN 1', '1'], ['IN 2', '2'], ['IN 3', '3']],
                value: '1',
                fontSize: 11,
                bgColor: '#e37100',
                arrowColor: EntryStatic.colorSet.common.WHITE,
            },
            {
                type: 'Dropdown',
                options: [
                    ['=', 'EQUAL'],
                    ['>', 'GREATER'],
                    ['<', 'LESS'],
                    ['≥', 'GREATER_OR_EQUAL'],
                    ['≤', 'LESS_OR_EQUAL'],
                ],
                value: 'LESS',
                fontSize: 11,
                bgColor: '#e37100',
                arrowColor: EntryStatic.colorSet.common.WHITE,
                noaRrow: true,
            },
            {
                type: 'Block',
                accept: 'string',
            },
        ],
        def: {
            params: [
                null,
                null,
                {
                    type: 'number',
                    params: ['100'],
                },
            ],
            type: 'practical_course_light_value_boolean',
        },
        paramsKeyMap: {
            PORT: 0,
            OPERATOR: 1,
            RIGHTVALUE: 2,
        },
        class: 'practical_course_light',
        func(sprite, script) {
            const port = script.getNumberField('PORT', script);
            const operator = script.getField('OPERATOR', script);
            const rightValue = script.getNumberValue('RIGHTVALUE', script);
            const leftValue = Entry.hw.portData[`IN${port}`];
            let isCheck = false;

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
        },
    },
    practical_course_sound_value: {
        color: '#01d67f',
        outerLine: '#00b36a',
        skeleton: 'basic_string_field',
        fontColor: '#fff',
        statements: [],
        isNotFor: ['neobot'],
        template: '%1번 포트의 소리 센서에 감지되는 소리 값',
        params: [
            {
                type: 'Dropdown',
                options: [['IN 1', '1'], ['IN 2', '2'], ['IN 3', '3']],
                value: '1',
                fontSize: 11,
                bgColor: '#00b36a',
                arrowColor: EntryStatic.colorSet.common.WHITE,
            },
        ],
        events: {},
        def: {
            params: [null],
            type: 'practical_course_sound_value',
        },
        paramsKeyMap: {
            PORT: 0,
        },
        class: 'practical_course_sound',
        func(sprite, script) {
            const port = script.getStringField('PORT');
            return Entry.hw.portData[`IN${port}`];
        },
    },
    practical_course_sound_value_boolean: {
        color: '#01d67f',
        outerLine: '#00b36a',
        skeleton: 'basic_boolean_field',
        fontColor: '#fff',
        isNotFor: ['neobot'],
        template: '%1번 포트의 소리 센서에 감지되는 소리 값 %2 %3',
        params: [
            {
                type: 'Dropdown',
                options: [['IN 1', '1'], ['IN 2', '2'], ['IN 3', '3']],
                value: '1',
                fontSize: 11,
                bgColor: '#00b36a',
                arrowColor: EntryStatic.colorSet.common.WHITE,
            },
            {
                type: 'Dropdown',
                options: [
                    ['=', 'EQUAL'],
                    ['>', 'GREATER'],
                    ['<', 'LESS'],
                    ['≥', 'GREATER_OR_EQUAL'],
                    ['≤', 'LESS_OR_EQUAL'],
                ],
                value: 'LESS',
                fontSize: 11,
                bgColor: '#00b36a',
                arrowColor: EntryStatic.colorSet.common.WHITE,
                noaRrow: true,
            },
            {
                type: 'Block',
                accept: 'string',
            },
        ],
        def: {
            params: [
                null,
                null,
                {
                    type: 'number',
                    params: ['100'],
                },
            ],
            type: 'practical_course_sound_value_boolean',
        },
        paramsKeyMap: {
            PORT: 0,
            OPERATOR: 1,
            RIGHTVALUE: 2,
        },
        class: 'practical_course_sound',
        func(sprite, script) {
            const port = script.getNumberField('PORT', script);
            const operator = script.getField('OPERATOR', script);
            const rightValue = script.getNumberValue('RIGHTVALUE', script);
            const leftValue = Entry.hw.portData[`IN${port}`];
            let isCheck = false;

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
        },
    },
    practical_course_irs_value: {
        color: '#C4065C',
        outerLine: '#9a0045',
        skeleton: 'basic_string_field',
        fontColor: '#fff',
        statements: [],
        isNotFor: ['neobot'],
        template: '%1번 포트의 적외선 센서에 감지되는 크기 값',
        params: [
            {
                type: 'Dropdown',
                options: [['IN 1', '1'], ['IN 2', '2'], ['IN 3', '3']],
                value: '1',
                fontSize: 11,
                bgColor: '#9a0045',
                arrowColor: EntryStatic.colorSet.common.WHITE,
            },
        ],
        events: {},
        def: {
            params: [null],
            type: 'practical_course_irs_value',
        },
        paramsKeyMap: {
            PORT: 0,
        },
        class: 'practical_course_irs',
        //'isNotFor': ['mini'],
        func(sprite, script) {
            const port = script.getStringField('PORT');
            return Entry.hw.portData[`IN${port}`];
        },
    },
    practical_course_irs_value_boolean: {
        color: '#C4065C',
        outerLine: '#9a0045',
        skeleton: 'basic_boolean_field',
        fontColor: '#fff',
        isNotFor: ['neobot'],
        template: '%1번 포트의 적외선 센서에 감지되는 크기 값이 %2 %3',
        params: [
            {
                type: 'Dropdown',
                options: [['IN 1', '1'], ['IN 2', '2'], ['IN 3', '3']],
                value: '1',
                fontSize: 11,
                bgColor: '#9a0045',
                arrowColor: EntryStatic.colorSet.common.WHITE,
            },
            {
                type: 'Dropdown',
                options: [
                    ['=', 'EQUAL'],
                    ['>', 'GREATER'],
                    ['<', 'LESS'],
                    ['≥', 'GREATER_OR_EQUAL'],
                    ['≤', 'LESS_OR_EQUAL'],
                ],
                value: 'LESS',
                fontSize: 11,
                bgColor: '#9a0045',
                arrowColor: EntryStatic.colorSet.common.WHITE,
                noaRrow: true,
            },
            {
                type: 'Block',
                accept: 'string',
            },
        ],
        def: {
            params: [
                null,
                null,
                {
                    type: 'number',
                    params: ['100'],
                },
            ],
            type: 'practical_course_irs_value_boolean',
        },
        paramsKeyMap: {
            PORT: 0,
            OPERATOR: 1,
            RIGHTVALUE: 2,
        },
        class: 'practical_course_irs',
        //'isNotFor': ['mini'],
        func(sprite, script) {
            const port = script.getNumberField('PORT', script);
            const operator = script.getField('OPERATOR', script);
            const rightValue = script.getNumberValue('RIGHTVALUE', script);
            const leftValue = Entry.hw.portData[`IN${port}`];
            let isCheck = false;

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
        },
    },
    practical_course_diode_secs_toggle: {
        color: '#ff8d0f',
        outerLine: '#e37100',
        skeleton: 'basic',
        fontColor: '#fff',
        statements: [],
        isNotFor: ['neobot'],
        template: '%1번 포트의 발광다이오드를 %2초 동안 %3 %4',
        params: [
            {
                type: 'Dropdown',
                options: [['OUT 1', '1'], ['OUT 2', '2'], ['OUT 3', '3']],
                value: '1',
                fontSize: 11,
                bgColor: '#e37100',
                arrowColor: EntryStatic.colorSet.common.WHITE,
            },
            {
                type: 'Block',
                accept: 'string',
            },
            {
                type: 'Dropdown',
                options: [['켜기', '255'], ['끄기', '0']],
                value: '255',
                fontSize: 11,
                bgColor: '#e37100',
                arrowColor: EntryStatic.colorSet.common.WHITE,
            },
            {
                type: 'Indicator',
                img: 'block_icon/practical_course/diode.png',
                size: 12,
            },
        ],
        events: {},
        def: {
            params: [
                null,
                {
                    type: 'number',
                    params: ['2'],
                },
                null,
                null,
            ],
            type: 'practical_course_diode_secs_toggle',
        },
        paramsKeyMap: {
            PORT: 0,
            DURATION: 1,
            VALUE: 2,
        },
        class: 'practical_course_diode',
        func(sprite, script) {
            if (!script.isStart) {
                const port = script.getNumberField('PORT');
                const duration = script.getNumberValue('DURATION');
                let value = script.getNumberField('VALUE');

                let option = port;
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
                Entry.hw.sendQueue[`OUT${port}`] = value;
                Entry.hw.sendQueue.OPT = Entry.hw.sendQueue.OPT & ~option;

                setTimeout(() => {
                    script.timeFlag = 0;
                }, duration * 1000);
                return script;
            } else if (script.timeFlag == 1) {
                return script;
            } else {
                Entry.hw.sendQueue[`OUT${script.outPort}`] = 0;
                Entry.hw.sendQueue.OPT = Entry.hw.sendQueue.OPT & ~script.outOption;
                delete script.timeFlag;
                delete script.isStart;
                delete script.outPort;
                delete script.outOption;
                Entry.engine.isContinue = false;
                return script.callReturn();
            }
        },
    },
    practical_course_diode_toggle: {
        color: '#ff8d0f',
        outerLine: '#e37100',
        skeleton: 'basic',
        fontColor: '#fff',
        statements: [],
        isNotFor: ['neobot'],
        template: '%1번 포트의 발광다이오드를 %2 %3',
        params: [
            {
                type: 'Dropdown',
                options: [['OUT 1', '1'], ['OUT 2', '2'], ['OUT 3', '3']],
                value: '1',
                fontSize: 11,
                bgColor: '#e37100',
                arrowColor: EntryStatic.colorSet.common.WHITE,
            },
            {
                type: 'Dropdown',
                options: [['켜기', '255'], ['끄기', '0']],
                value: '255',
                fontSize: 11,
                bgColor: '#e37100',
                arrowColor: EntryStatic.colorSet.common.WHITE,
            },
            {
                type: 'Indicator',
                img: 'block_icon/practical_course/diode.png',
                size: 12,
            },
        ],
        events: {},
        def: {
            params: [null, null, null],
            type: 'practical_course_diode_toggle',
        },
        paramsKeyMap: {
            PORT: 0,
            VALUE: 1,
        },
        class: 'practical_course_diode',
        //'isNotFor': ['mini'],
        func(sprite, script) {
            const port = script.getNumberField('PORT');
            let value = script.getNumberField('VALUE');
            let option = port;

            if (value < 0) {
                value = 0;
            } else if (value > 255) {
                value = 255;
            }

            if (option === 3) {
                option = 4;
            }

            Entry.hw.sendQueue[`OUT${port}`] = value;
            Entry.hw.sendQueue.OPT = Entry.hw.sendQueue.OPT & ~option;

            return script.callReturn();
        },
    },
    practical_course_diode_inout_toggle: {
        color: '#ff8d0f',
        outerLine: '#e37100',
        skeleton: 'basic',
        fontColor: '#fff',
        statements: [],
        isNotFor: ['neobot'],
        template: '%1번 포트의 발광다이오드를 %2번 포트의 %3~%4의 범위로 켜기%5',
        params: [
            {
                type: 'Dropdown',
                options: [['OUT 1', '1'], ['OUT 2', '2'], ['OUT 3', '3']],
                value: '1',
                fontSize: 11,
                bgColor: '#e37100',
                arrowColor: EntryStatic.colorSet.common.WHITE,
            },
            {
                type: 'Dropdown',
                options: [['IN 1', '1'], ['IN 2', '2'], ['IN 3', '3']],
                value: '1',
                fontSize: 11,
                bgColor: '#e37100',
                arrowColor: EntryStatic.colorSet.common.WHITE,
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
                img: 'block_icon/practical_course/diode.png',
                size: 12,
            },
        ],
        events: {},
        def: {
            params: [
                null,
                null,
                { type: 'number', params: ['0'] },
                { type: 'number', params: ['255'] },
                null,
            ],
            type: 'practical_course_diode_inout_toggle',
        },
        paramsKeyMap: {
            OUTPUT: 0,
            INPUT: 1,
            MIN: 2,
            MAX: 3,
        },
        class: 'practical_course_diode',
        //'isNotFor': ['mini'],
        func(sprite, script) {
            const outputPort = script.getNumberField('OUTPUT');
            const inputPort = script.getNumberField('INPUT');
            let option = inputPort;
            if (option === 3) {
                option = 4;
            }
            const oMin = script.getNumberValue('MIN');
            const oMax = script.getNumberValue('MAX');
            const nMin = 0;
            const nMax = 255;
            const x = Entry.hw.portData[`IN${inputPort}`];
            const percent = (x - oMin) / (oMax - oMin);
            let result = percent * (nMax - nMin) + nMin;
            if (result > nMax) {
                result = nMax;
            }
            if (result < nMin) {
                result = nMin;
            }

            Entry.hw.sendQueue[`OUT${outputPort}`] = result;
            Entry.hw.sendQueue.OPT = Entry.hw.sendQueue.OPT & ~option;

            return script.callReturn();
        },
    },
    practical_course_diode_set_output: {
        color: '#ff8d0f',
        outerLine: '#e37100',
        skeleton: 'basic',
        statements: [],
        isNotFor: ['neobot'],
        template: '%1번 포트의 발광다이오드를 %2의 밝기로 정하기 %3',
        params: [
            {
                type: 'Dropdown',
                options: [['OUT 1', '1'], ['OUT 2', '2'], ['OUT 3', '3']],
                value: '1',
                fontSize: 11,
                bgColor: '#e37100',
                arrowColor: EntryStatic.colorSet.common.WHITE,
            },
            {
                type: 'Block',
                accept: 'string',
            },
            {
                type: 'Indicator',
                img: 'block_icon/practical_course/diode.png',
                size: 12,
            },
        ],
        events: {},
        def: {
            params: [
                null,
                {
                    type: 'number',
                    params: ['255'],
                },
                null,
            ],
            type: 'practical_course_diode_set_output',
        },
        paramsKeyMap: {
            PORT: 0,
            VALUE: 1,
        },
        class: 'practical_course_diode',
        //'isNotFor': ['mini'],
        func(sprite, script) {
            const port = script.getStringField('PORT', script);
            let value = script.getNumberValue('VALUE', script);
            let option = port;
            if (value < 0) {
                value = 0;
            } else if (value > 255) {
                value = 255;
            }
            if (option === 3) {
                option = 4;
            }
            Entry.hw.sendQueue[`OUT${port}`] = value;
            Entry.hw.sendQueue.OPT = Entry.hw.sendQueue.OPT & ~option;
            return script.callReturn();
        },
    },
    practical_course_diode_input_value: {
        color: '#ff8d0f',
        outerLine: '#e37100',
        skeleton: 'basic_string_field',
        fontColor: '#fff',
        statements: [],
        isNotFor: ['neobot'],
        template: '%1번 포트의 값',
        params: [
            {
                type: 'Dropdown',
                options: [['IN 1', '1'], ['IN 2', '2'], ['IN 3', '3']],
                value: '1',
                fontSize: 11,
                bgColor: '#e37100',
                arrowColor: EntryStatic.colorSet.common.WHITE,
            },
        ],
        events: {},
        def: {
            params: [null],
            type: 'practical_course_diode_input_value',
        },
        paramsKeyMap: {
            PORT: 0,
        },
        class: 'practical_course_diode',
        func(sprite, script) {
            const port = script.getStringField('PORT');
            return Entry.hw.portData[`IN${port}`];
        },
    },
    practical_course_melody_note_for: {
        color: '#FC327F',
        skeleton: 'basic',
        statements: [],
        isNotFor: ['neobot'],
        template: '멜로디 %1 을(를) %2 옥타브로 %3 길이만큼 소리내기 %4',
        params: [
            {
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
                    ['시', '12'],
                ],
                value: '1',
                fontSize: 11,
                bgColor: '#ce105e',
                arrowColor: EntryStatic.colorSet.common.WHITE,
            },
            {
                type: 'Dropdown',
                options: [['1', '0'], ['2', '1'], ['3', '2'], ['4', '3'], ['5', '4'], ['6', '5']],
                value: '2',
                fontSize: 11,
                bgColor: '#ce105e',
                arrowColor: EntryStatic.colorSet.common.WHITE,
            },
            {
                type: 'Dropdown',
                options: [
                    ['온음표', '1'],
                    ['2분음표', '2'],
                    ['4분음표', '4'],
                    ['8분음표', '8'],
                    ['16분음표', '16'],
                ],
                value: '4',
                fontSize: 11,
                bgColor: '#ce105e',
                arrowColor: EntryStatic.colorSet.common.WHITE,
            },
            {
                type: 'Indicator',
                img: 'block_icon/practical_course/melody.png',
                size: 12,
            },
        ],
        events: {},
        def: {
            params: [null, null, null, null],
            type: 'practical_course_melody_note_for',
        },
        paramsKeyMap: {
            NOTE: 0,
            OCTAVE: 1,
            DURATION: 2,
        },
        class: 'practical_course_melody',
        //'isNotFor': ['mini'],
        func(sprite, script) {
            const sq = Entry.hw.sendQueue;

            if (!script.isStart) {
                const note = script.getNumberField('NOTE', script);
                const octave = script.getNumberField('OCTAVE', script);
                const duration = script.getNumberField('DURATION', script);
                let value = note > 0 ? note + 12 * octave : 0;

                script.isStart = true;
                script.timeFlag = 1;
                script.soundFlag = 1;
                if (value > 65) {
                    value = 65;
                }
                sq.SND = value;
                setTimeout(() => {
                    setTimeout(() => {
                        script.timeFlag = 0;
                    }, 50);
                }, (1 / duration) * 2000);
                return script;
            } else if (script.timeFlag == 1) {
                return script;
            } else if (script.soundFlag == 1) {
                Entry.hw.sendQueue.SND = 0;
                script.soundFlag = 0;
                return script;
            } else {
                delete script.timeFlag;
                delete script.isStart;
                Entry.engine.isContinue = false;
                return script.callReturn();
            }
        },
    },

    // roborobo_mini
    roborobo_motor_speed: {
        color: '#00B200',
        outerLine: '#019101',
        skeleton: 'basic_string_field',
        statements: [],
        isNotFor: ['roborobo_schoolkit'],
        template: '%1',
        params: [
            {
                type: 'Dropdown',
                options: [
                    ['1', '52'],
                    ['2', '66'],
                    ['3', '80'],
                    ['4', '94'],
                    ['5', '107'],
                    ['6', '120'],
                    ['7', '134'],
                    ['8', '148'],
                    ['9', '162'],
                    ['10', '176'],
                    ['11', '190'],
                    ['12', '204'],
                    ['13', '218'],
                    ['14', '232'],
                    ['15', '255'],
                ],
                value: '255',
                fontSize: 11,
                bgColor: '#019101',
                arrowColor: EntryStatic.colorSet.common.WHITE,
            },
        ],
        events: {},
        def: {
            params: [null],
        },
        paramsKeyMap: {
            VALUE: 0,
        },
        func(sprite, script) {
            return script.getStringField('VALUE');
        },
    },
    roborobo_move_for_secs: {
        color: '#00B200',
        outerLine: '#019101',
        skeleton: 'basic',
        fontColor: '#fff',
        statements: [],
        isNotFor: ['roborobo_schoolkit'],
        template: '%1모터를 %2 %3의 속도로 %4초 동안 회전 %5',
        params: [
            {
                type: 'Dropdown',
                options: [['양쪽', '1'], ['오른쪽', '2'], ['왼쪽', '3']],
                value: '1',
                fontSize: 11,
                bgColor: '#019101',
                arrowColor: EntryStatic.colorSet.common.WHITE,
            },
            {
                type: 'Dropdown',
                options: [['앞으로', '1'], ['뒤로', '2']],
                value: '1',
                fontSize: 11,
                bgColor: '#019101',
                arrowColor: EntryStatic.colorSet.common.WHITE,
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
                img: 'block_icon/practical_course/dcmotor.png',
                size: 12,
            },
        ],
        events: {},
        def: {
            params: [
                null,
                null,
                {
                    type: 'roborobo_motor_speed',
                },
                {
                    type: 'number',
                    params: ['2'],
                },
                null,
            ],
            type: 'roborobo_move_for_secs',
        },
        paramsKeyMap: {
            WHEEL: 0,
            DIRECTION: 1,
            SPEED: 2,
            DURATION: 3,
        },
        class: 'roborobo_motor',
        func(sprite, script) {
            const motor1 = 0;
            const motor2 = 1;
            const wheel = script.getNumberField('WHEEL');
            const speed = script.getNumberValue('SPEED');
            const direction = script.getNumberField('DIRECTION');
            const duration = script.getNumberValue('DURATION');

            if (!Entry.hw.sendQueue.digitalPinMode) {
                Entry.hw.sendQueue.digitalPinMode = {};
            }

            if (!script.isStart) {
                if (wheel == 1) {
                    Entry.hw.sendQueue.digitalPinMode[7] = Entry.Roborobo_SchoolKit.pinMode.PWM;
                    Entry.hw.sendQueue.digitalPinMode[0] = Entry.Roborobo_SchoolKit.pinMode.PWM;
                    Entry.hw.sendQueue.digitalPinMode[8] = Entry.Roborobo_SchoolKit.pinMode.PWM;
                    Entry.hw.sendQueue.digitalPinMode[1] = Entry.Roborobo_SchoolKit.pinMode.PWM;

                    if (direction == 1) {
                        Entry.hw.sendQueue[motor1] = speed;
                        Entry.hw.sendQueue[motor2] = speed;
                    } else if (direction == 2) {
                        Entry.hw.sendQueue[motor1] = -speed;
                        Entry.hw.sendQueue[motor2] = -speed;
                    }
                } else if (wheel == 2) {
                    Entry.hw.sendQueue.digitalPinMode[8] = Entry.Roborobo_SchoolKit.pinMode.PWM;
                    Entry.hw.sendQueue.digitalPinMode[1] = Entry.Roborobo_SchoolKit.pinMode.PWM;

                    if (direction == 1) {
                        Entry.hw.sendQueue[motor1] = 0x00;
                        Entry.hw.sendQueue[motor2] = speed;
                    } else if (direction == 2) {
                        Entry.hw.sendQueue[motor1] = 0x00;
                        Entry.hw.sendQueue[motor2] = -speed;
                    }
                } else if (wheel == 3) {
                    Entry.hw.sendQueue.digitalPinMode[7] = Entry.Roborobo_SchoolKit.pinMode.PWM;
                    Entry.hw.sendQueue.digitalPinMode[0] = Entry.Roborobo_SchoolKit.pinMode.PWM;

                    if (direction == 1) {
                        Entry.hw.sendQueue[motor1] = speed;
                        Entry.hw.sendQueue[motor2] = 0x00;
                    } else if (direction == 2) {
                        Entry.hw.sendQueue[motor1] = -speed;
                        Entry.hw.sendQueue[motor2] = 0x00;
                    }
                }

                script.wheelMode = wheel;
                script.isStart = true;
                script.timeFlag = 1;
                setTimeout(() => {
                    script.timeFlag = 0;
                }, duration * 1000);
                return script;
            } else if (script.timeFlag == 1) {
                return script;
            } else {
                Entry.hw.sendQueue[motor1] = 0x00;
                Entry.hw.sendQueue[motor2] = 0x00;

                delete script.timeFlag;
                delete script.isStart;
                delete script.wheelMode;
                Entry.engine.isContinue = false;
                return script.callReturn();
            }
        },
    },
    roborobo_move_for: {
        color: '#00B200',
        outerLine: '#019101',
        skeleton: 'basic',
        fontColor: '#fff',
        statements: [],
        isNotFor: ['roborobo_schoolkit'],
        template: '%1모터를 %2 %3의 속도로 계속 회전 %4',
        params: [
            {
                type: 'Dropdown',
                options: [['양쪽', '1'], ['오른쪽', '2'], ['왼쪽', '3']],
                value: '1',
                fontSize: 11,
                bgColor: '#019101',
                arrowColor: EntryStatic.colorSet.common.WHITE,
            },
            {
                type: 'Dropdown',
                options: [['앞으로', '1'], ['뒤로', '2']],
                value: '1',
                fontSize: 11,
                bgColor: '#019101',
                arrowColor: EntryStatic.colorSet.common.WHITE,
            },
            {
                type: 'Block',
                accept: 'string',
            },
            {
                type: 'Indicator',
                img: 'block_icon/practical_course/dcmotor.png',
                size: 12,
            },
        ],
        events: {},
        def: {
            params: [
                null,
                null,
                {
                    type: 'roborobo_motor_speed',
                },
                null,
            ],
            type: 'roborobo_move_for',
        },
        paramsKeyMap: {
            WHEEL: 0,
            DIRECTION: 1,
            SPEED: 2,
        },
        class: 'roborobo_motor',
        //'isNotFor': ['mini'],
        func(sprite, script) {
            const motor1 = 0;
            const motor2 = 1;
            const wheel = script.getNumberField('WHEEL');
            const speed = script.getNumberValue('SPEED');
            const direction = script.getNumberField('DIRECTION');

            if (!Entry.hw.sendQueue.digitalPinMode) {
                Entry.hw.sendQueue.digitalPinMode = {};
            }

            if (wheel == 1) {
                Entry.hw.sendQueue.digitalPinMode[7] = Entry.Roborobo_SchoolKit.pinMode.PWM;
                Entry.hw.sendQueue.digitalPinMode[0] = Entry.Roborobo_SchoolKit.pinMode.PWM;
                Entry.hw.sendQueue.digitalPinMode[8] = Entry.Roborobo_SchoolKit.pinMode.PWM;
                Entry.hw.sendQueue.digitalPinMode[1] = Entry.Roborobo_SchoolKit.pinMode.PWM;

                if (direction == 1) {
                    Entry.hw.sendQueue[motor1] = speed;
                    Entry.hw.sendQueue[motor2] = speed;
                } else if (direction == 2) {
                    Entry.hw.sendQueue[motor1] = -speed;
                    Entry.hw.sendQueue[motor2] = -speed;
                }
            } else if (wheel == 2) {
                Entry.hw.sendQueue.digitalPinMode[8] = Entry.Roborobo_SchoolKit.pinMode.PWM;
                Entry.hw.sendQueue.digitalPinMode[1] = Entry.Roborobo_SchoolKit.pinMode.PWM;

                if (direction == 1) {
                    Entry.hw.sendQueue[motor1] = 0x00;
                    Entry.hw.sendQueue[motor2] = speed;
                } else if (direction == 2) {
                    Entry.hw.sendQueue[motor1] = 0x00;
                    Entry.hw.sendQueue[motor2] = -speed;
                }
            } else if (wheel == 3) {
                Entry.hw.sendQueue.digitalPinMode[7] = Entry.Roborobo_SchoolKit.pinMode.PWM;
                Entry.hw.sendQueue.digitalPinMode[0] = Entry.Roborobo_SchoolKit.pinMode.PWM;

                if (direction == 1) {
                    Entry.hw.sendQueue[motor1] = speed;
                    Entry.hw.sendQueue[motor2] = 0x00;
                } else if (direction == 2) {
                    Entry.hw.sendQueue[motor1] = -speed;
                    //Entry.hw.sendQueue[motor2] = 0x00;
                }
            }

            return script.callReturn();
        },
    },
    roborobo_turn_for: {
        color: '#00B200',
        outerLine: '#019101',
        skeleton: 'basic',
        fontColor: '#fff',
        statements: [],
        isNotFor: ['roborobo_schoolkit'],
        template: '오른쪽 모터를 %1 %2, 왼쪽 모터를 %3 %4의 속도로 계속 회전 %5',
        params: [
            {
                type: 'Dropdown',
                options: [['앞으로', '1'], ['뒤로', '2']],
                value: '1',
                fontSize: 11,
                bgColor: '#019101',
                arrowColor: EntryStatic.colorSet.common.WHITE,
            },
            {
                type: 'Block',
                accept: 'string',
            },
            {
                type: 'Dropdown',
                options: [['앞으로', '1'], ['뒤로', '2']],
                value: '1',
                fontSize: 11,
                bgColor: '#019101',
                arrowColor: EntryStatic.colorSet.common.WHITE,
            },
            {
                type: 'Block',
                accept: 'string',
            },
            {
                type: 'Indicator',
                img: 'block_icon/practical_course/dcmotor.png',
                size: 12,
            },
        ],
        events: {},
        def: {
            params: [
                null,
                { type: 'roborobo_motor_speed' },
                null,
                { type: 'roborobo_motor_speed' },
                null,
            ],
            type: 'roborobo_turn_for',
        },
        paramsKeyMap: {
            RDIR: 0,
            RSPEED: 1,
            LDIR: 2,
            LSPEED: 3,
        },
        class: 'roborobo_motor',
        //'isNotFor': ['mini'],
        func(sprite, script) {
            const motor1 = 0;
            const motor2 = 1;

            const rightDir = script.getNumberField('RDIR');
            const rightSpeed = script.getNumberValue('RSPEED');
            const leftDir = script.getNumberField('LDIR');
            const leftSpeed = script.getNumberValue('LSPEED');

            if (!Entry.hw.sendQueue.digitalPinMode) {
                Entry.hw.sendQueue.digitalPinMode = {};
            }

            Entry.hw.sendQueue.digitalPinMode[7] = Entry.Roborobo_SchoolKit.pinMode.PWM;
            Entry.hw.sendQueue.digitalPinMode[0] = Entry.Roborobo_SchoolKit.pinMode.PWM;
            Entry.hw.sendQueue.digitalPinMode[8] = Entry.Roborobo_SchoolKit.pinMode.PWM;
            Entry.hw.sendQueue.digitalPinMode[1] = Entry.Roborobo_SchoolKit.pinMode.PWM;

            if (leftDir == 1) {
                Entry.hw.sendQueue[motor1] = leftSpeed;
            } else {
                Entry.hw.sendQueue[motor1] = -leftSpeed;
            }

            if (rightDir == 1) {
                Entry.hw.sendQueue[motor2] = rightSpeed;
            } else {
                Entry.hw.sendQueue[motor2] = -rightSpeed;
            }

            return script.callReturn();
        },
    },
    roborobo_stop_for: {
        color: '#00B200',
        outerLine: '#019101',
        skeleton: 'basic',
        fontColor: '#fff',
        statements: [],
        isNotFor: ['roborobo_schoolkit'],
        template: '%1모터를 정지 %2',
        params: [
            {
                type: 'Dropdown',
                options: [['양쪽', '1'], ['오른쪽', '2'], ['왼쪽', '3']],
                value: '1',
                fontSize: 11,
                bgColor: '#019101',
                arrowColor: EntryStatic.colorSet.common.WHITE,
            },
            {
                type: 'Indicator',
                img: 'block_icon/practical_course/dcmotor.png',
                size: 12,
            },
        ],
        events: {},
        def: {
            params: [null, null],
            type: 'roborobo_stop_for',
        },
        paramsKeyMap: {
            WHEEL: 0,
        },
        class: 'roborobo_motor',
        func(sprite, script) {
            const motor1 = 0;
            const motor2 = 1;
            const wheel = script.getNumberField('WHEEL');

            if (!Entry.hw.sendQueue.digitalPinMode) {
                Entry.hw.sendQueue.digitalPinMode = {};
            }

            if (wheel == 1) {
                Entry.hw.sendQueue.digitalPinMode[7] = Entry.Roborobo_SchoolKit.pinMode.PWM;
                Entry.hw.sendQueue.digitalPinMode[0] = Entry.Roborobo_SchoolKit.pinMode.PWM;
                Entry.hw.sendQueue.digitalPinMode[8] = Entry.Roborobo_SchoolKit.pinMode.PWM;
                Entry.hw.sendQueue.digitalPinMode[1] = Entry.Roborobo_SchoolKit.pinMode.PWM;

                Entry.hw.sendQueue[motor1] = 0x00;
                Entry.hw.sendQueue[motor2] = 0x00;
            } else if (wheel == 2) {
                Entry.hw.sendQueue.digitalPinMode[8] = Entry.Roborobo_SchoolKit.pinMode.PWM;
                Entry.hw.sendQueue.digitalPinMode[1] = Entry.Roborobo_SchoolKit.pinMode.PWM;

                Entry.hw.sendQueue[motor2] = 0x00;
            } else if (wheel == 3) {
                Entry.hw.sendQueue.digitalPinMode[7] = Entry.Roborobo_SchoolKit.pinMode.PWM;
                Entry.hw.sendQueue.digitalPinMode[0] = Entry.Roborobo_SchoolKit.pinMode.PWM;

                Entry.hw.sendQueue[motor1] = 0x00;
            }

            return script.callReturn();
        },
    },
    roborobo_touch_value: {
        color: '#2AB4D3',
        outerLine: '#0e93b1',
        skeleton: 'basic_string_field',
        fontColor: '#fff',
        statements: [],
        isNotFor: ['roborobo_schoolkit'],
        template: '접촉 센서 값',
        params: [
            {
                type: 'Block',
                accept: 'string',
            },
        ],
        events: {},
        def: {
            params: [null],
            type: 'roborobo_touch_value',
        },
        paramsKeyMap: {},
        class: 'roborobo_touch',
        func(sprite, script) {
            const port = Entry.Roborobo_SchoolKit.inputPort.contact;
            Entry.hw.sendQueue.digitalPinMode[port] = Entry.Roborobo_SchoolKit.pinMode.INPUT;
            Entry.hw.update();
            return Entry.hw.portData[port - 7];
        },
    },
    roborobo_touch_value_boolean: {
        color: '#2AB4D3',
        outerLine: '#0e93b1',
        skeleton: 'basic_boolean_field',
        fontColor: '#fff',
        isNotFor: ['roborobo_schoolkit'],
        template: '접촉 센서가 %1',
        params: [
            {
                type: 'Dropdown',
                options: [['접촉 되면', '1'], ['접촉 안되면', '0']],
                value: '1',
                fontSize: 11,
                bgColor: '#0e93b1',
                arrowColor: EntryStatic.colorSet.common.WHITE,
            },
        ],
        def: {
            params: [null],
            type: 'roborobo_touch_value_boolean',
        },
        paramsKeyMap: {
            TOUCH: 0,
        },
        class: 'roborobo_touch',
        func(sprite, script) {
            const port = Entry.Roborobo_SchoolKit.inputPort.contact;
            const touch = script.getNumberField('TOUCH', script);

            Entry.hw.sendQueue.digitalPinMode[port] = Entry.Roborobo_SchoolKit.pinMode.INPUT;
            Entry.hw.update();

            const value = Entry.hw.portData[port - 7];
            const isTouch = touch == value;

            return isTouch;
        },
    },
    roborobo_light_value: {
        color: '#ff8d0f',
        outerLine: '#e37100',
        skeleton: 'basic_string_field',
        fontColor: '#fff',
        statements: [],
        isNotFor: ['roborobo_schoolkit'],
        template: 'CDS 센서 값',
        params: [
            {
                type: 'Block',
                accept: 'string',
            },
        ],
        events: {},
        def: {
            params: [null],
            type: 'roborobo_light_value',
        },
        paramsKeyMap: {},
        class: 'roborobo_light',
        func(sprite, script) {
            const port = Entry.Roborobo_SchoolKit.inputPort.cds;
            return Entry.hw.portData[port - 7];
        },
    },
    roborobo_light_value_boolean: {
        color: '#ff8d0f',
        outerLine: '#e37100',
        skeleton: 'basic_boolean_field',
        fontColor: '#fff',
        isNotFor: ['roborobo_schoolkit'],
        template: 'CDS 센서 값 %1 %2',
        params: [
            {
                type: 'Dropdown',
                options: [
                    ['=', 'EQUAL'],
                    ['>', 'GREATER'],
                    ['<', 'LESS'],
                    ['≥', 'GREATER_OR_EQUAL'],
                    ['≤', 'LESS_OR_EQUAL'],
                ],
                value: 'LESS',
                fontSize: 11,
                bgColor: '#e37100',
                arrowColor: EntryStatic.colorSet.common.WHITE,
                noaRrow: true,
            },
            {
                type: 'Block',
                accept: 'string',
            },
        ],
        def: {
            params: [
                null,
                {
                    type: 'number',
                    params: ['512'],
                },
            ],
            type: 'roborobo_light_value_boolean',
        },
        paramsKeyMap: {
            OPERATOR: 0,
            RIGHTVALUE: 1,
        },
        class: 'roborobo_light',
        func(sprite, script) {
            const port = Entry.Roborobo_SchoolKit.inputPort.cds;
            const operator = script.getField('OPERATOR', script);
            let rightValue = script.getNumberValue('RIGHTVALUE', script);
            const leftValue = Entry.hw.portData[port - 7];
            let isCheck = false;

            if (rightValue < 0) {
                rightValue = 0;
            } else if (rightValue > 1023) {
                rightValue = 1023;
            }
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
        },
    },
    roborobo_sound_value: {
        color: '#01d67f',
        outerLine: '#00b36a',
        skeleton: 'basic_string_field',
        fontColor: '#fff',
        statements: [],
        isNotFor: ['roborobo_schoolkit'],
        template: '소리 센서에 감지되는 소리 값',
        params: [
            {
                type: 'Block',
                accept: 'string',
            },
        ],
        events: {},
        def: {
            params: [null],
            type: 'roborobo_sound_value',
        },
        paramsKeyMap: {},
        class: 'roborobo_sound',
        func(sprite, script) {
            const port = Entry.Roborobo_SchoolKit.inputPort.sound;
            return Entry.hw.portData[port - 7];
        },
    },
    roborobo_sound_value_boolean: {
        color: '#01d67f',
        outerLine: '#00b36a',
        skeleton: 'basic_boolean_field',
        fontColor: '#fff',
        isNotFor: ['roborobo_schoolkit'],
        template: '소리 센서에 감지되는 소리 값 %1 %2',
        params: [
            {
                type: 'Dropdown',
                options: [
                    ['=', 'EQUAL'],
                    ['>', 'GREATER'],
                    ['<', 'LESS'],
                    ['≥', 'GREATER_OR_EQUAL'],
                    ['≤', 'LESS_OR_EQUAL'],
                ],
                value: 'LESS',
                fontSize: 11,
                bgColor: '#00b36a',
                arrowColor: EntryStatic.colorSet.common.WHITE,
                noaRrow: true,
            },
            {
                type: 'Block',
                accept: 'string',
            },
        ],
        def: {
            params: [
                null,
                {
                    type: 'number',
                    params: ['512'],
                },
            ],
            type: 'roborobo_sound_value_boolean',
        },
        paramsKeyMap: {
            OPERATOR: 0,
            RIGHTVALUE: 1,
        },
        class: 'roborobo_sound',
        func(sprite, script) {
            const port = Entry.Roborobo_SchoolKit.inputPort.sound;
            const operator = script.getField('OPERATOR', script);
            let rightValue = script.getNumberValue('RIGHTVALUE', script);
            const leftValue = Entry.hw.portData[port - 7];
            let isCheck = false;

            if (rightValue < 0) {
                rightValue = 0;
            } else if (rightValue > 1023) {
                rightValue = 1023;
            }

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
        },
    },
    roborobo_irs_value: {
        color: '#C4065C',
        outerLine: '#9a0045',
        skeleton: 'basic_string_field',
        fontColor: '#fff',
        statements: [],
        isNotFor: ['roborobo_schoolkit'],
        template: '적외선 센서 값',
        params: [
            {
                type: 'Block',
                accept: 'string',
            },
        ],
        events: {},
        def: {
            params: [null],
            type: 'roborobo_irs_value',
        },
        paramsKeyMap: {},
        class: 'roborobo_irs',
        //'isNotFor': ['mini'],
        func(sprite, script) {
            const port = Entry.Roborobo_SchoolKit.inputPort.ir;
            const value =
                Entry.hw.portData[port - 7] == undefined ? 0 : Entry.hw.portData[port - 7];
            return value;
        },
    },
    roborobo_irs_value_boolean: {
        color: '#C4065C',
        outerLine: '#9a0045',
        skeleton: 'basic_boolean_field',
        fontColor: '#fff',
        isNotFor: ['roborobo_schoolkit'],
        template: '적외선 센서가 %1',
        params: [
            {
                type: 'Dropdown',
                options: [['감지 되면', '1'], ['감지 안되면', '0']],
                value: '1',
                fontSize: 11,
                bgColor: '#9a0045',
                arrowColor: EntryStatic.colorSet.common.WHITE,
            },
        ],
        def: {
            params: [null],
            type: 'roborobo_irs_value_boolean',
        },
        paramsKeyMap: {
            DETECT: 0,
        },
        class: 'roborobo_irs',
        //'isNotFor': ['mini'],
        func(sprite, script) {
            const port = Entry.Roborobo_SchoolKit.inputPort.ir;
            const detect = script.getNumberField('DETECT', script);

            Entry.hw.sendQueue.digitalPinMode[port] = Entry.Roborobo_SchoolKit.pinMode.INPUT;
            Entry.hw.update();

            const value = Entry.hw.portData[port - 7];
            const isDetect = detect == value;

            return isDetect;
        },
    },
    roborobo_diode_secs_toggle: {
        color: '#ff8d0f',
        outerLine: '#e37100',
        skeleton: 'basic',
        fontColor: '#fff',
        statements: [],
        isNotFor: ['roborobo_schoolkit'],
        template: '%1번 포트의 발광다이오드를 %2초 동안 %3 %4',
        params: [
            {
                type: 'Dropdown',
                options: [['LED 1', '5'], ['LED 2', '4'], ['R - A', '3'], ['R - B', '2']],
                value: '5',
                fontSize: 11,
                bgColor: '#e37100',
                arrowColor: EntryStatic.colorSet.common.WHITE,
            },
            {
                type: 'Block',
                accept: 'string',
            },
            {
                type: 'Dropdown',
                options: [['켜기', '255'], ['끄기', '0']],
                value: '255',
                fontSize: 11,
                bgColor: '#e37100',
                arrowColor: EntryStatic.colorSet.common.WHITE,
            },
            {
                type: 'Indicator',
                img: 'block_icon/practical_course/diode.png',
                size: 12,
            },
        ],
        events: {},
        def: {
            params: [
                null,
                {
                    type: 'number',
                    params: ['2'],
                },
                null,
                null,
            ],
            type: 'roborobo_diode_secs_toggle',
        },
        paramsKeyMap: {
            PORT: 0,
            DURATION: 1,
            VALUE: 2,
        },
        class: 'roborobo_diode',
        func(sprite, script) {
            const port = script.getNumberField('PORT');
            const duration = script.getNumberValue('DURATION');
            const value = script.getNumberField('VALUE');
            if (!Entry.hw.sendQueue.digitalPinMode) {
                Entry.hw.sendQueue.digitalPinMode = {};
            }
            Entry.hw.sendQueue.digitalPinMode[port] = Entry.Roborobo_SchoolKit.pinMode.PWM;

            if (!script.isStart) {
                script.isStart = true;
                script.timeFlag = 1;
                Entry.hw.sendQueue[port] = value;

                setTimeout(() => {
                    script.timeFlag = 0;
                }, duration * 1000);
                return script;
            } else if (script.timeFlag == 1) {
                return script;
            } else {
                Entry.hw.sendQueue[port] = 0;
                delete script.timeFlag;
                delete script.isStart;
                Entry.engine.isContinue = false;
                return script.callReturn();
            }
        },
    },
    roborobo_diode_toggle: {
        color: '#ff8d0f',
        outerLine: '#e37100',
        skeleton: 'basic',
        fontColor: '#fff',
        statements: [],
        isNotFor: ['roborobo_schoolkit'],
        template: '%1번 포트의 발광다이오드를 %2 %3',
        params: [
            {
                type: 'Dropdown',
                options: [['LED 1', '5'], ['LED 2', '4'], ['R - A', '3'], ['R - B', '2']],
                value: '5',
                fontSize: 11,
                bgColor: '#e37100',
                arrowColor: EntryStatic.colorSet.common.WHITE,
            },
            {
                type: 'Dropdown',
                options: [['켜기', '255'], ['끄기', '0']],
                value: '255',
                fontSize: 11,
                bgColor: '#e37100',
                arrowColor: EntryStatic.colorSet.common.WHITE,
            },
            {
                type: 'Indicator',
                img: 'block_icon/practical_course/diode.png',
                size: 12,
            },
        ],
        events: {},
        def: {
            params: [null, null, null],
            type: 'roborobo_diode_toggle',
        },
        paramsKeyMap: {
            PORT: 0,
            VALUE: 1,
        },
        class: 'roborobo_diode',
        //'isNotFor': ['mini'],
        func(sprite, script) {
            const port = script.getNumberField('PORT');
            const value = script.getNumberField('VALUE');

            if (!Entry.hw.sendQueue.digitalPinMode) {
                Entry.hw.sendQueue.digitalPinMode = {};
            }

            Entry.hw.sendQueue.digitalPinMode[port] = Entry.Roborobo_SchoolKit.pinMode.PWM;
            Entry.hw.sendQueue[port] = value;

            return script.callReturn();
        },
    },
    roborobo_diode_inout_toggle: {
        color: '#ff8d0f',
        outerLine: '#e37100',
        skeleton: 'basic',
        fontColor: '#fff',
        statements: [],
        isNotFor: ['roborobo_schoolkit'],
        template: '%1번 포트의 발광다이오드를 %2번 포트의 %3~%4의 범위로 켜기%5',
        params: [
            {
                type: 'Dropdown',
                options: [['LED 1', '5'], ['LED 2', '4'], ['R - A', '3'], ['R - B', '2']],
                value: '5',
                fontSize: 11,
                bgColor: '#e37100',
                arrowColor: EntryStatic.colorSet.common.WHITE,
            },
            {
                type: 'Dropdown',
                options: [['소 리', '8'], ['CDS', '10']],
                value: '8',
                fontSize: 11,
                bgColor: '#e37100',
                arrowColor: EntryStatic.colorSet.common.WHITE,
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
                img: 'block_icon/practical_course/diode.png',
                size: 12,
            },
        ],
        events: {},
        def: {
            params: [
                null,
                null,
                { type: 'number', params: ['0'] },
                { type: 'number', params: ['255'] },
                null,
            ],
            type: 'roborobo_diode_inout_toggle',
        },
        paramsKeyMap: {
            OUTPUT: 0,
            INPUT: 1,
            MIN: 2,
            MAX: 3,
        },
        class: 'roborobo_diode',
        //'isNotFor': ['mini'],
        func(sprite, script) {
            const outputPort = script.getNumberField('OUTPUT');
            const inputPort = script.getNumberField('INPUT');

            const oMin = script.getNumberValue('MIN');
            const oMax = script.getNumberValue('MAX');
            const nMin = 0;
            const nMax = 255;
            const x = Entry.hw.portData[inputPort - 7] / 4;
            const percent = (x - oMin) / (oMax - oMin);
            let result = percent * (nMax - nMin) + nMin;
            if (result > nMax) {
                result = nMax;
            }
            if (result < nMin) {
                result = nMin;
            }

            if (!Entry.hw.sendQueue.digitalPinMode) {
                Entry.hw.sendQueue.digitalPinMode = {};
            }

            Entry.hw.sendQueue.digitalPinMode[outputPort] = Entry.Roborobo_SchoolKit.pinMode.PWM;
            Entry.hw.sendQueue[outputPort] = result;

            return script.callReturn();
        },
    },
    roborobo_diode_set_output: {
        color: '#ff8d0f',
        outerLine: '#e37100',
        skeleton: 'basic',
        statements: [],
        isNotFor: ['roborobo_schoolkit'],
        template: '%1번 포트의 발광다이오드를 %2의 밝기로 켜기 %3',
        params: [
            {
                type: 'Dropdown',
                options: [['LED 1', '5'], ['LED 2', '4'], ['R - A', '3'], ['R - B', '2']],
                value: '5',
                fontSize: 11,
                bgColor: '#e37100',
                arrowColor: EntryStatic.colorSet.common.WHITE,
            },
            {
                type: 'Block',
                accept: 'string',
            },
            {
                type: 'Indicator',
                img: 'block_icon/practical_course/diode.png',
                size: 12,
            },
        ],
        events: {},
        def: {
            params: [
                null,
                {
                    type: 'number',
                    params: ['255'],
                },
                null,
            ],
            type: 'roborobo_diode_set_output',
        },
        paramsKeyMap: {
            PORT: 0,
            VALUE: 1,
        },
        class: 'roborobo_diode',
        //'isNotFor': ['mini'],
        func(sprite, script) {
            const port = script.getStringField('PORT', script);
            let value = script.getNumberValue('VALUE', script);

            if (value < 0) {
                value = 0;
            } else if (value > 255) {
                value = 255;
            }
            if (!Entry.hw.sendQueue.digitalPinMode) {
                Entry.hw.sendQueue.digitalPinMode = {};
            }
            Entry.hw.sendQueue.digitalPinMode[port] = Entry.Roborobo_SchoolKit.pinMode.PWM;
            Entry.hw.sendQueue[port] = value;

            return script.callReturn();
        },
    },
    roborobo_diode_input_value: {
        color: '#ff8d0f',
        outerLine: '#e37100',
        skeleton: 'basic_string_field',
        fontColor: '#fff',
        statements: [],
        isNotFor: ['roborobo_schoolkit'],
        template: '%1 포트의 값',
        params: [
            {
                type: 'Dropdown',
                options: [['적외선', '7'], ['소 리', '8'], ['접 촉', '9'], ['CDS', '10']],
                value: '8',
                fontSize: 11,
                bgColor: '#e37100',
                arrowColor: EntryStatic.colorSet.common.WHITE,
            },
        ],
        events: {},
        def: {
            params: [null],
            type: 'roborobo_diode_input_value',
        },
        paramsKeyMap: {
            PORT: 0,
        },
        class: 'roborobo_diode',
        func(sprite, script) {
            const port = script.getNumberField('PORT');
            return Entry.hw.portData[port - 7];
        },
    },
    robotis_set_led: {
        color: '#2AB4D3',
        outerLine: '#0e93b1',
        skeleton: 'basic',
        fontColor: '#fff',
        statements: [],
        isNotFor: ['robotis_openCM70', 'robotis_openCM70EDU'],
        template: '%1번 포트 LED를 %2 %3',
        params: [
            {
                type: 'Dropdown',
                options: [['PORT 3', '3'], ['PORT 4', '4'], ['PORT 5', '5'], ['PORT 6', '6']],
                value: '3',
                fontSize: 11,
                bgColor: '#0e93b1',
                arrowColor: EntryStatic.colorSet.common.WHITE,
            },
            {
                type: 'Dropdown',
                options: [
                    ['모두 끄기', '0'],
                    ['노랑색 켜기', '1'],
                    ['파랑색 켜기', '2'],
                    ['모두 켜기', '3'],
                ],
                value: '0',
                fontSize: 11,
                bgColor: '#0e93b1',
                arrowColor: EntryStatic.colorSet.common.WHITE,
            },
            {
                type: 'Indicator',
                img: 'block_icon/practical_course/light.png',
                size: 12,
            },
        ],
        events: {},
        def: {
            params: [null],
            type: 'robotis_set_led',
        },
        paramsKeyMap: {
            PORT: 0,
            COLOR: 1,
        },
        class: 'robotis_led',
        func(sprite, script) {
            Entry.hw.sendQueue.IS_EDU = true;

            const port = script.getStringField('PORT');
            const value = 0;
            const data_instruction = Entry.Robotis_openCM70.INSTRUCTION.WRITE;
            let data_address = 0;
            const data_length = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_LED_MODULE[1];
            const data_value = script.getNumberField('COLOR');
            switch (port) {
                case '3':
                    data_address = 212;
                    break;
                case '4':
                    data_address = 213;
                    break;
                case '5':
                    data_address = 214;
                    break;
                case '6':
                    data_address = 215;
                    break;
            }
            const data_sendqueue = [[data_instruction, data_address, data_length, data_value]];
            //Entry.Robotis_carCont.setRobotisData(data_sendqueue);
            //Entry.Robotis_carCont.update();
            return Entry.Robotis_carCont.postCallReturn(
                script,
                data_sendqueue,
                Entry.Robotis_openCM70.delay
            );
        },
    },
    robotis_touch_value: {
        color: '#2AB4D3',
        outerLine: '#0e93b1',
        skeleton: 'basic_string_field',
        fontColor: '#fff',
        statements: [],
        isNotFor: ['robotis_openCM70', 'robotis_openCM70EDU'],
        template: '%1번 포트 접촉 센서 값',
        params: [
            {
                type: 'Dropdown',
                options: [['PORT 3', '3'], ['PORT 4', '4'], ['PORT 5', '5'], ['PORT 6', '6']],
                value: '3',
                fontSize: 11,
                bgColor: '#0e93b1',
                arrowColor: EntryStatic.colorSet.common.WHITE,
            },
        ],
        events: {},
        def: {
            params: [null],
            type: 'robotis_touch_value',
        },
        paramsKeyMap: {
            PORT: 0,
        },
        class: 'robotis_touch',
        func(sprite, script) {
            Entry.hw.sendQueue.IS_EDU = true;
            const port = script.getStringField('PORT');
            let value = 0;

            switch (port) {
                case '3':
                    value = Entry.hw.portData.TOUCH0;
                    break;
                case '4':
                    value = Entry.hw.portData.TOUCH1;
                    break;
                case '5':
                    value = Entry.hw.portData.TOUCH2;
                    break;
                case '6':
                    value = Entry.hw.portData.TOUCH3;
                    break;
            }
            return value;
        },
    },
    robotis_touch_value_boolean: {
        color: '#2AB4D3',
        outerLine: '#0e93b1',
        skeleton: 'basic_boolean_field',
        fontColor: '#fff',
        isNotFor: ['robotis_openCM70', 'robotis_openCM70EDU'],
        template: '%1번 포트 접촉 센서가 %2',
        params: [
            {
                type: 'Dropdown',
                options: [['PORT 3', '3'], ['PORT 4', '4'], ['PORT 5', '5'], ['PORT 6', '6']],
                value: '3',
                fontSize: 11,
                bgColor: '#0e93b1',
                arrowColor: EntryStatic.colorSet.common.WHITE,
            },
            {
                type: 'Dropdown',
                options: [['접촉 되면', '1'], ['접촉 안되면', '0']],
                value: '1',
                fontSize: 11,
                bgColor: '#0e93b1',
                arrowColor: EntryStatic.colorSet.common.WHITE,
            },
        ],
        def: {
            params: [null, null, null],
            type: 'robotis_touch_value_boolean',
        },
        paramsKeyMap: {
            PORT: 0,
            TOUCH: 1,
        },
        class: 'robotis_touch',
        func(sprite, script) {
            Entry.hw.sendQueue.IS_EDU = true;
            const port = script.getStringField('PORT');
            const touch = script.getNumberField('TOUCH', script);
            let value = 0;
            switch (port) {
                case '3':
                    value = Entry.hw.portData.TOUCH0;
                    break;
                case '4':
                    value = Entry.hw.portData.TOUCH1;
                    break;
                case '5':
                    value = Entry.hw.portData.TOUCH2;
                    break;
                case '6':
                    value = Entry.hw.portData.TOUCH3;
                    break;
            }
            const isTouch = !((value == 1) ^ touch);

            return isTouch;
        },
    },
    robotis_irs_value: {
        color: '#C4065C',
        outerLine: '#9a0045',
        skeleton: 'basic_string_field',
        fontColor: '#fff',
        statements: [],
        isNotFor: ['robotis_openCM70', 'robotis_openCM70EDU'],
        template: '%1번 포트 적외선 센서 값',
        params: [
            {
                type: 'Dropdown',
                options: [['PORT 3', '3'], ['PORT 4', '4'], ['PORT 5', '5'], ['PORT 6', '6']],
                value: '3',
                fontSize: 11,
                bgColor: '#9a0045',
                arrowColor: EntryStatic.colorSet.common.WHITE,
            },
        ],
        events: {},
        def: {
            params: [null],
            type: 'robotis_irs_value',
        },
        paramsKeyMap: {
            PORT: 0,
        },
        class: 'robotis_irs',
        //'isNotFor': ['mini'],
        func(sprite, script) {
            Entry.hw.sendQueue.IS_EDU = true;
            const port = script.getStringField('PORT');
            let value = 0;
            let data_address = 0;
            switch (port) {
                case '3':
                    value = Entry.hw.portData.IR0;
                    data_address = 108;
                    break;
                case '4':
                    value = Entry.hw.portData.IR1;
                    data_address = 109;
                    break;
                case '5':
                    value = Entry.hw.portData.IR2;
                    data_address = 110;
                    break;
                case '6':
                    value = Entry.hw.portData.IR3;
                    data_address = 111;
                    break;
            }
            const data_instruction = Entry.Robotis_openCM70.INSTRUCTION.WRITE;
            const data_length = 1;
            const data_value = 2;

            const data_sendqueue = [[data_instruction, data_address, data_length, data_value]];
            //Entry.Robotis_carCont.setRobotisData(data_sendqueue);
            //Entry.Robotis_carCont.update();
            if (!Entry.Robotis_openCM70.IRS_MODULEWRITE.PORT3 && port == '3') {
                Entry.Robotis_carCont.setRobotisData(data_sendqueue);
                Entry.Robotis_carCont.update();
                Entry.Robotis_openCM70.IRS_MODULEWRITE.PORT3 = true;
            }
            if (!Entry.Robotis_openCM70.IRS_MODULEWRITE.PORT4 && port == '4') {
                Entry.Robotis_carCont.setRobotisData(data_sendqueue);
                Entry.Robotis_carCont.update();
                Entry.Robotis_openCM70.IRS_MODULEWRITE.PORT4 = true;
            }
            if (!Entry.Robotis_openCM70.IRS_MODULEWRITE.PORT5 && port == '5') {
                Entry.Robotis_carCont.setRobotisData(data_sendqueue);
                Entry.Robotis_carCont.update();
                Entry.Robotis_openCM70.IRS_MODULEWRITE.PORT5 = true;
            }
            if (!Entry.Robotis_openCM70.IRS_MODULEWRITE.PORT6 && port == '6') {
                Entry.Robotis_carCont.setRobotisData(data_sendqueue);
                Entry.Robotis_carCont.update();
                Entry.Robotis_openCM70.IRS_MODULEWRITE.PORT6 = true;
            }
            //var value = (Entry.hw.portData['IN' + port] > 125) ? 1 : 0;
            return value;
        },
    },
    robotis_irs_value_boolean: {
        color: '#C4065C',
        outerLine: '#9a0045',
        skeleton: 'basic_boolean_field',
        fontColor: '#fff',
        isNotFor: ['robotis_openCM70', 'robotis_openCM70EDU'],
        template: '%1번 포트 적외선 센서 값 %2 %3',
        params: [
            {
                type: 'Dropdown',
                options: [['PORT 3', '3'], ['PORT 4', '4'], ['PORT 5', '5'], ['PORT 6', '6']],
                value: '3',
                fontSize: 11,
                bgColor: '#9a0045',
                arrowColor: EntryStatic.colorSet.common.WHITE,
            },
            {
                type: 'Dropdown',
                options: [
                    ['=', 'EQUAL'],
                    ['>', 'GREATER'],
                    ['<', 'LESS'],
                    ['≥', 'GREATER_OR_EQUAL'],
                    ['≤', 'LESS_OR_EQUAL'],
                ],
                value: 'LESS',
                fontSize: 11,
                bgColor: '#9a0045',
                arrowColor: EntryStatic.colorSet.common.WHITE,
                noaRrow: true,
            },
            {
                type: 'Block',
                accept: 'string',
            },
        ],
        def: {
            params: [
                null,
                null,
                {
                    type: 'number',
                    params: ['100'],
                },
            ],
            type: 'robotis_irs_value_boolean',
        },
        paramsKeyMap: {
            PORT: 0,
            OPERATOR: 1,
            RIGHTVALUE: 2,
        },
        class: 'robotis_irs',
        //'isNotFor': ['mini'],
        func(sprite, script) {
            Entry.hw.sendQueue.IS_EDU = true;
            const port = script.getStringField('PORT', script);
            const operator = script.getField('OPERATOR', script);
            const rightValue = script.getNumberValue('RIGHTVALUE', script);
            let leftValue = 0;
            let isCheck = false;
            let data_address = 0;

            switch (port) {
                case '3':
                    leftValue = Entry.hw.portData.IR0;
                    data_address = 108;
                    break;
                case '4':
                    leftValue = Entry.hw.portData.IR1;
                    data_address = 109;
                    break;
                case '5':
                    leftValue = Entry.hw.portData.IR2;
                    data_address = 110;
                    break;
                case '6':
                    leftValue = Entry.hw.portData.IR3;
                    data_address = 111;
                    break;
            }
            const data_instruction = Entry.Robotis_openCM70.INSTRUCTION.WRITE;
            const data_length = 1;
            const data_value = 2;

            const data_sendqueue = [[data_instruction, data_address, data_length, data_value]];
            //Entry.Robotis_carCont.setRobotisData(data_sendqueue);
            //Entry.Robotis_carCont.update();
            if (!Entry.Robotis_openCM70.IRS_MODULEWRITE.PORT3 && port == '3') {
                Entry.Robotis_carCont.setRobotisData(data_sendqueue);
                Entry.Robotis_carCont.update();
                Entry.Robotis_openCM70.IRS_MODULEWRITE.PORT3 = true;
            }
            if (!Entry.Robotis_openCM70.IRS_MODULEWRITE.PORT4 && port == '4') {
                Entry.Robotis_carCont.setRobotisData(data_sendqueue);
                Entry.Robotis_carCont.update();
                Entry.Robotis_openCM70.IRS_MODULEWRITE.PORT4 = true;
            }
            if (!Entry.Robotis_openCM70.IRS_MODULEWRITE.PORT5 && port == '5') {
                Entry.Robotis_carCont.setRobotisData(data_sendqueue);
                Entry.Robotis_carCont.update();
                Entry.Robotis_openCM70.IRS_MODULEWRITE.PORT5 = true;
            }
            if (!Entry.Robotis_openCM70.IRS_MODULEWRITE.PORT6 && port == '6') {
                Entry.Robotis_carCont.setRobotisData(data_sendqueue);
                Entry.Robotis_carCont.update();
                Entry.Robotis_openCM70.IRS_MODULEWRITE.PORT6 = true;
            }

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
        },
    },
    robotis_light_value: {
        color: '#ff8d0f',
        outerLine: '#e37100',
        skeleton: 'basic_string_field',
        fontColor: '#fff',
        statements: [],
        isNotFor: ['robotis_openCM70', 'robotis_openCM70EDU'],
        template: '%1번 포트 빛 감지 센서 값',
        params: [
            {
                type: 'Dropdown',
                options: [['PORT 3', '0'], ['PORT 4', '1'], ['PORT 5', '2'], ['PORT 6', '3']],
                value: '0',
                outerLine: '#e37100',
                fontSize: 11,
                bgColor: '#e37100',
                arrowColor: EntryStatic.colorSet.common.WHITE,
            },
        ],
        events: {},
        def: {
            params: [null],
            type: 'robotis_light_value',
        },
        paramsKeyMap: {
            PORT: 0,
        },
        class: 'robotis_light',
        func(sprite, script) {
            Entry.hw.sendQueue.IS_EDU = true;
            const port = script.getStringField('PORT');
            return Entry.hw.portData[`LIGHT${port}`];
        },
    },
    robotis_light_value_boolean: {
        color: '#ff8d0f',
        outerLine: '#e37100',
        skeleton: 'basic_boolean_field',
        fontColor: '#fff',
        isNotFor: ['robotis_openCM70', 'robotis_openCM70EDU'],
        template: '%1번 포트 빛 감지 센서 값 %2 %3',
        params: [
            {
                type: 'Dropdown',
                options: [['PORT 3', '0'], ['PORT 4', '1'], ['PORT 5', '2'], ['PORT 6', '3']],
                value: '0',
                fontSize: 11,
                bgColor: '#e37100',
                arrowColor: EntryStatic.colorSet.common.WHITE,
            },
            {
                type: 'Dropdown',
                options: [
                    ['=', 'EQUAL'],
                    ['>', 'GREATER'],
                    ['<', 'LESS'],
                    ['≥', 'GREATER_OR_EQUAL'],
                    ['≤', 'LESS_OR_EQUAL'],
                ],
                value: 'LESS',
                fontSize: 11,
                bgColor: '#e37100',
                arrowColor: EntryStatic.colorSet.common.WHITE,
                noaRrow: true,
            },
            {
                type: 'Block',
                accept: 'string',
            },
        ],
        def: {
            params: [
                null,
                null,
                {
                    type: 'number',
                    params: ['100'],
                },
            ],
            type: 'robotis_light_value_boolean',
        },
        paramsKeyMap: {
            PORT: 0,
            OPERATOR: 1,
            RIGHTVALUE: 2,
        },
        class: 'robotis_light',
        func(sprite, script) {
            Entry.hw.sendQueue.IS_EDU = true;
            const port = script.getNumberField('PORT', script);
            const operator = script.getField('OPERATOR', script);
            const rightValue = script.getNumberValue('RIGHTVALUE', script);
            const leftValue = Entry.hw.portData[`LIGHT${port}`];
            let isCheck = false;

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
        },
    },
    robotis_userbutton_value: {
        color: '#2AB4D3',
        outerLine: '#0e93b1',
        skeleton: 'basic_string_field',
        fontColor: '#fff',
        statements: [],
        isNotFor: ['robotis_openCM70', 'robotis_openCM70EDU'],
        template: '사용자 버튼',
        events: {},
        params: [
            {
                type: 'Block',
                accept: 'string',
            },
        ],
        def: {
            params: [null],
            type: 'robotis_userbutton_value',
        },
        paramsKeyMap: {},
        class: 'robotis_userbutton',
        func(sprite, script) {
            Entry.hw.sendQueue.IS_EDU = true;
            return Entry.hw.portData.USERBUTTONSTATE;
        },
    },
    robotis_userbutton_value_boolean: {
        color: '#2AB4D3',
        skeleton: 'basic_boolean_field',
        fontColor: '#fff',
        isNotFor: ['robotis_openCM70', 'robotis_openCM70EDU'],
        template: '사용자 버튼이 %1',
        params: [
            {
                type: 'Dropdown',
                options: [['접촉 되면', '1'], ['접촉 안되면', '0']],
                value: '1',
                fontsIze: 11,
            },
        ],
        def: {
            params: [null],
            type: 'robotis_userbutton_value_boolean',
        },
        paramsKeyMap: {
            PORT: 0,
        },
        class: 'robotis_userbutton',
        func(sprite, script) {
            Entry.hw.sendQueue.IS_EDU = true;
            const port = script.getStringField('PORT');
            const value = Entry.hw.portData.USERBUTTONSTATE;
            var isTouch = false;

            var isTouch = port == value;

            return isTouch;
        },
    },
    robotis_detectedsound_value: {
        color: '#01d67f',
        outerLine: '#00b36a',
        skeleton: 'basic_string_field',
        fontColor: '#fff',
        statements: [],
        isNotFor: ['robotis_openCM70', 'robotis_openCM70EDU'],
        template: '소리 센서 최종 소리 횟수',
        events: {},
        params: [
            {
                type: 'Block',
                accept: 'string',
            },
        ],
        def: {
            params: [null],
            type: 'robotis_detectedsound_value',
        },
        paramsKeyMap: {},
        class: 'robotis_sound',
        func(sprite, script) {
            Entry.hw.sendQueue.IS_EDU = true;
            return Entry.hw.portData.DETECTEDSOUNDE;
        },
    },
    robotis_detectedsound_value_boolean: {
        color: '#01d67f',
        outerLine: '#00b36a',
        skeleton: 'basic_boolean_field',
        fontColor: '#fff',
        isNotFor: ['robotis_openCM70', 'robotis_openCM70EDU'],
        template: '소리 센서 최종 소리 횟수 %1 %2',
        params: [
            {
                type: 'Dropdown',
                options: [
                    ['=', 'EQUAL'],
                    ['>', 'GREATER'],
                    ['<', 'LESS'],
                    ['≥', 'GREATER_OR_EQUAL'],
                    ['≤', 'LESS_OR_EQUAL'],
                ],
                value: 'LESS',
                fontSize: 11,
                bgColor: '#00b36a',
                arrowColor: EntryStatic.colorSet.common.WHITE,
                noaRrow: true,
            },
            {
                type: 'Block',
                accept: 'string',
            },
        ],
        def: {
            params: [
                null,
                {
                    type: 'number',
                    params: ['100'],
                },
            ],
            type: 'robotis_detectedsound_value_boolean',
        },
        paramsKeyMap: {
            OPERATOR: 0,
            RIGHTVALUE: 1,
        },
        class: 'robotis_sound',
        func(sprite, script) {
            Entry.hw.sendQueue.IS_EDU = true;
            const operator = script.getField('OPERATOR', script);
            const rightValue = script.getNumberValue('RIGHTVALUE', script);
            const leftValue = Entry.hw.portData.DETECTEDSOUNDE;
            let isCheck = false;

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
        },
    },
    robotis_detectedsound_value_init: {
        color: '#00D67F',
        outerLine: '#00b36a',
        skeleton: 'basic',
        fontColor: '#fff',
        statements: [],
        isNotFor: ['robotis_openCM70', 'robotis_openCM70EDU'],
        template: '소리 센서 최종 소리 횟수 초기화 %1',
        params: [
            {
                type: 'Indicator',
                img: 'block_icon/practical_course/sound.png',
                size: 12,
            },
        ],
        def: {
            params: [null],
            type: 'robotis_detectedsound_value_init',
        },
        paramsKeyMap: {},
        class: 'robotis_sound',
        func(sprite, script) {
            Entry.hw.sendQueue.IS_EDU = true;
            const data_instruction = Entry.Robotis_openCM70.INSTRUCTION.WRITE;
            const data_address = Entry.Robotis_openCM70.CONTROL_TABLE.CM_SOUND_DETECTED[0];
            const data_length = Entry.Robotis_openCM70.CONTROL_TABLE.CM_SOUND_DETECTED[1];
            const data_value = 0;

            const data_sendqueue = [[data_instruction, data_address, data_length, data_value]];
            //Entry.Robotis_carCont.setRobotisData(data_sendqueue);
            //Entry.Robotis_carCont.update();
            return Entry.Robotis_carCont.postCallReturn(
                script,
                data_sendqueue,
                Entry.Robotis_openCM70.delay
            );
        },
    },
    robotis_detectingsound_value: {
        color: '#01d67f',
        outerLine: '#00b36a',
        skeleton: 'basic_string_field',
        fontColor: '#fff',
        statements: [],
        isNotFor: ['robotis_openCM70', 'robotis_openCM70EDU'],
        template: '소리 센서 실시간 소리 횟수',
        events: {},
        params: [
            {
                type: 'Block',
                accept: 'string',
            },
        ],
        def: {
            params: [null],
            type: 'robotis_detectingsound_value',
        },
        paramsKeyMap: {},
        class: 'robotis_sound',
        func(sprite, script) {
            Entry.hw.sendQueue.IS_EDU = true;
            return Entry.hw.portData.DETECTINGSOUNDE1;
        },
    },
    robotis_detectingsound_value_boolean: {
        color: '#01d67f',
        outerLine: '#00b36a',
        skeleton: 'basic_boolean_field',
        fontColor: '#fff',
        isNotFor: ['robotis_openCM70', 'robotis_openCM70EDU'],
        template: '소리 센서 실시간 소리 횟수 %1 %2',
        params: [
            {
                type: 'Dropdown',
                options: [
                    ['=', 'EQUAL'],
                    ['>', 'GREATER'],
                    ['<', 'LESS'],
                    ['≥', 'GREATER_OR_EQUAL'],
                    ['≤', 'LESS_OR_EQUAL'],
                ],
                value: 'LESS',
                fontSize: 11,
                bgColor: '#00b36a',
                arrowColor: EntryStatic.colorSet.common.WHITE,
                noaRrow: true,
            },
            {
                type: 'Block',
                accept: 'string',
            },
        ],
        def: {
            params: [
                null,
                {
                    type: 'number',
                    params: ['100'],
                },
            ],
            type: 'robotis_detectingsound_value_boolean',
        },
        paramsKeyMap: {
            OPERATOR: 0,
            RIGHTVALUE: 1,
        },
        class: 'robotis_sound',
        func(sprite, script) {
            Entry.hw.sendQueue.IS_EDU = true;
            const operator = script.getField('OPERATOR', script);
            const rightValue = script.getNumberValue('RIGHTVALUE', script);
            const leftValue = Entry.hw.portData.DETECTINGSOUNDE1;
            let isCheck = false;

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
        },
    },
    robotis_color_value: {
        color: '#2AB4D3',
        outerLine: '#0e93b1',
        skeleton: 'basic_string_field',
        fontColor: '#fff',
        statements: [],
        isNotFor: ['robotis_openCM70', 'robotis_openCM70EDU'],
        template: '%1번 포트 칼라 센서 값',
        params: [
            {
                type: 'Dropdown',
                options: [['PORT 3', '3'], ['PORT 4', '4'], ['PORT 5', '5'], ['PORT 6', '6']],
                value: '3',
                fontSize: 11,
                bgColor: '#0e93b1',
                arrowColor: EntryStatic.colorSet.common.WHITE,
            },
        ],
        events: {},
        def: {
            params: [null],
            type: 'robotis_color_value',
        },
        paramsKeyMap: {
            PORT: 0,
        },
        class: 'robotis_color',
        func(sprite, script) {
            Entry.hw.sendQueue.IS_EDU = true;
            const port = script.getStringField('PORT');
            let value = 0;
            let data_address = 0;
            switch (port) {
                case '3':
                    value = Entry.hw.portData.COLOR0;
                    data_address = 108;
                    break;
                case '4':
                    value = Entry.hw.portData.COLOR1;
                    data_address = 109;
                    break;
                case '5':
                    value = Entry.hw.portData.COLOR2;
                    data_address = 110;
                    break;
                case '6':
                    value = Entry.hw.portData.COLOR3;
                    data_address = 111;
                    break;
            }
            const data_instruction = Entry.Robotis_openCM70.INSTRUCTION.WRITE;
            const data_length = 1;
            const data_value = 4;

            const data_sendqueue = [[data_instruction, data_address, data_length, data_value]];
            Entry.Robotis_carCont.setRobotisData(data_sendqueue);
            Entry.Robotis_carCont.update();

            switch (value) {
                case 0:
                    value = '알 수 없음';
                    break;
                case 1:
                    value = '흰색';
                    break;
                case 2:
                    value = '검은색';
                    break;
                case 3:
                    value = '빨강색';
                    break;
                case 4:
                    value = '초록색';
                    break;
                case 5:
                    value = '파랑색';
                    break;
                case 6:
                    value = '노랑색';
                    break;
            }

            return value;
        },
    },
    robotis_color_value_boolean: {
        color: '#C4065C',
        outerLine: '#9a0045',
        skeleton: 'basic_boolean_field',
        fontColor: '#fff',
        isNotFor: ['robotis_openCM70', 'robotis_openCM70EDU'],
        template: '%1번 포트 칼라 센서 값 %2 %3',
        params: [
            {
                type: 'Dropdown',
                options: [['PORT 3', '3'], ['PORT 4', '4'], ['PORT 5', '5'], ['PORT 6', '6']],
                value: '3',
                fontSize: 11,
                bgColor: '#9a0045',
                arrowColor: EntryStatic.colorSet.common.WHITE,
            },
            {
                type: 'Dropdown',
                options: [
                    ['=', 'EQUAL'],
                    ['>', 'GREATER'],
                    ['<', 'LESS'],
                    ['≥', 'GREATER_OR_EQUAL'],
                    ['≤', 'LESS_OR_EQUAL'],
                ],
                value: 'LESS',
                fontSize: 11,
                bgColor: '#9a0045',
                arrowColor: EntryStatic.colorSet.common.WHITE,
                noaRrow: true,
            },
            {
                type: 'Dropdown',
                options: [
                    ['알 수 없음 : 0', '0'],
                    ['흰색 : 1', '1'],
                    ['검은색 : 2', '2'],
                    ['빨강색 : 3', '3'],
                    ['초록색 : 4', '4'],
                    ['파랑색 : 5', '5'],
                    ['노랑색 : 6', '6'],
                ],
                value: '0',
                fontSize: 11,
                bgColor: '#9a0045',
                arrowColor: EntryStatic.colorSet.common.WHITE,
            },
        ],
        def: {
            params: [null, null, null],
            type: 'robotis_color_value_boolean',
        },
        paramsKeyMap: {
            PORT: 0,
            OPERATOR: 1,
            RIGHTVALUE: 2,
        },
        class: 'robotis_color',
        func(sprite, script) {
            Entry.hw.sendQueue.IS_EDU = true;
            const port = script.getField('PORT', script);
            const operator = script.getField('OPERATOR', script);
            const rightValue = script.getNumberField('RIGHTVALUE', script);
            let leftValue = 0;
            let data_address = 0;
            let isCheck = false;

            switch (port) {
                case '3':
                    leftValue = Entry.hw.portData.COLOR0;
                    data_address = 108;
                    break;
                case '4':
                    leftValue = Entry.hw.portData.COLOR1;
                    data_address = 109;
                    break;
                case '5':
                    leftValue = Entry.hw.portData.COLOR2;
                    data_address = 110;
                    break;
                case '6':
                    leftValue = Entry.hw.portData.COLOR3;
                    data_address = 111;
                    break;
            }

            const data_instruction = Entry.Robotis_openCM70.INSTRUCTION.WRITE;
            const data_length = 1;
            const data_value = 4;

            const data_sendqueue = [[data_instruction, data_address, data_length, data_value]];
            Entry.Robotis_carCont.setRobotisData(data_sendqueue);
            Entry.Robotis_carCont.update();

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
        },
    },
    robotis_humidity_value: {
        color: '#2AB4D3',
        outerLine: '#0e93b1',
        skeleton: 'basic_string_field',
        fontColor: '#fff',
        statements: [],
        isNotFor: ['robotis_openCM70', 'robotis_openCM70EDU'],
        template: '%1번 포트 습도 센서 값',
        params: [
            {
                type: 'Dropdown',
                options: [['PORT 3', '3'], ['PORT 4', '4'], ['PORT 5', '5'], ['PORT 6', '6']],
                value: '3',
                fontSize: 11,
                bgColor: '#0e93b1',
                arrowColor: EntryStatic.colorSet.common.WHITE,
            },
        ],
        events: {},
        def: {
            params: [null],
            type: 'robotis_humidity_value',
        },
        paramsKeyMap: {
            PORT: 0,
        },
        class: 'robotis_humidity',
        func(sprite, script) {
            Entry.hw.sendQueue.IS_EDU = true;
            const port = script.getStringField('PORT');
            let value = 0;
            let data_address = 0;
            switch (port) {
                case '3':
                    value = Entry.hw.portData.HUMIDTY0;
                    data_address = 108;
                    break;
                case '4':
                    value = Entry.hw.portData.HUMIDTY1;
                    data_address = 109;
                    break;
                case '5':
                    value = Entry.hw.portData.HUMIDTY2;
                    data_address = 110;
                    break;
                case '6':
                    value = Entry.hw.portData.HUMIDTY3;
                    data_address = 111;
                    break;
            }
            const data_instruction = Entry.Robotis_openCM70.INSTRUCTION.WRITE;
            const data_length = 1;
            const data_value = 5;

            const data_sendqueue = [[data_instruction, data_address, data_length, data_value]];
            Entry.Robotis_carCont.setRobotisData(data_sendqueue);
            Entry.Robotis_carCont.update();

            return value;
        },
    },
    robotis_humidity_value_boolean: {
        color: '#C4065C',
        outerLine: '#9a0045',
        skeleton: 'basic_boolean_field',
        fontColor: '#fff',
        isNotFor: ['robotis_openCM70', 'robotis_openCM70EDU'],
        template: '%1번 포트 습도 센서 값 %2 %3',
        params: [
            {
                type: 'Dropdown',
                options: [['PORT 3', '3'], ['PORT 4', '4'], ['PORT 5', '5'], ['PORT 6', '6']],
                value: '3',
                fontSize: 11,
                bgColor: '#9a0045',
                arrowColor: EntryStatic.colorSet.common.WHITE,
            },
            {
                type: 'Dropdown',
                options: [
                    ['=', 'EQUAL'],
                    ['>', 'GREATER'],
                    ['<', 'LESS'],
                    ['≥', 'GREATER_OR_EQUAL'],
                    ['≤', 'LESS_OR_EQUAL'],
                ],
                value: 'LESS',
                fontSize: 11,
                bgColor: '#9a0045',
                arrowColor: EntryStatic.colorSet.common.WHITE,
                noaRrow: true,
            },
            {
                type: 'Block',
                accept: 'string',
            },
        ],
        def: {
            params: [
                null,
                null,
                {
                    type: 'number',
                    params: ['50'],
                },
            ],
            type: 'robotis_humidity_value_boolean',
        },
        paramsKeyMap: {
            PORT: 0,
            OPERATOR: 1,
            RIGHTVALUE: 2,
        },
        class: 'robotis_humidity',
        func(sprite, script) {
            Entry.hw.sendQueue.IS_EDU = true;
            const port = script.getNumberField('PORT', script);
            const operator = script.getField('OPERATOR', script);
            const rightValue = script.getNumberValue('RIGHTVALUE', script);
            let leftValue = 0;
            let data_address = 0;
            let isCheck = true;

            switch (port) {
                case 3:
                    leftValue = Entry.hw.portData.HUMIDTY0;
                    data_address = 108;
                    break;
                case 4:
                    leftValue = Entry.hw.portData.HUMIDTY1;
                    data_address = 109;
                    break;
                case 5:
                    leftValue = Entry.hw.portData.HUMIDTY2;
                    data_address = 110;
                    break;
                case 6:
                    leftValue = Entry.hw.portData.HUMIDTY3;
                    data_address = 111;
                    break;
            }

            const data_instruction = Entry.Robotis_openCM70.INSTRUCTION.WRITE;
            const data_length = 1;
            const data_value = 5;

            const data_sendqueue = [[data_instruction, data_address, data_length, data_value]];
            Entry.Robotis_carCont.setRobotisData(data_sendqueue);
            Entry.Robotis_carCont.update();
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
        },
    },
    robotis_temperature_value: {
        color: '#2AB4D3',
        outerLine: '#0e93b1',
        skeleton: 'basic_string_field',
        fontColor: '#fff',
        statements: [],
        isNotFor: ['robotis_openCM70', 'robotis_openCM70EDU'],
        template: '%1번 포트 온도 센서 값',
        params: [
            {
                type: 'Dropdown',
                options: [['PORT 3', '3'], ['PORT 4', '4'], ['PORT 5', '5'], ['PORT 6', '6']],
                value: '3',
                fontSize: 11,
                bgColor: '#0e93b1',
                arrowColor: EntryStatic.colorSet.common.WHITE,
            },
        ],
        events: {},
        def: {
            params: [null],
            type: 'robotis_temperature_value',
        },
        paramsKeyMap: {
            PORT: 0,
        },
        class: 'robotis_temperature',
        func(sprite, script) {
            Entry.hw.sendQueue.IS_EDU = true;
            const port = script.getStringField('PORT');
            let value = 0;
            let data_address = 0;
            switch (port) {
                case '3':
                    value = Entry.hw.portData.TEMPERATURE0;
                    data_address = 108;
                    break;
                case '4':
                    value = Entry.hw.portData.TEMPERATURE1;
                    data_address = 109;
                    break;
                case '5':
                    value = Entry.hw.portData.TEMPERATURE2;
                    data_address = 110;
                    break;
                case '6':
                    value = Entry.hw.portData.TEMPERATURE3;
                    data_address = 111;
                    break;
            }
            const data_instruction = Entry.Robotis_openCM70.INSTRUCTION.WRITE;
            const data_length = 1;
            const data_value = 5;

            const data_sendqueue = [[data_instruction, data_address, data_length, data_value]];
            Entry.Robotis_carCont.setRobotisData(data_sendqueue);
            Entry.Robotis_carCont.update();

            return value;
        },
    },
    robotis_temperature_value_boolean: {
        color: '#C4065C',
        outerLine: '#9a0045',
        skeleton: 'basic_boolean_field',
        fontColor: '#fff',
        isNotFor: ['robotis_openCM70', 'robotis_openCM70EDU'],
        template: '%1번 포트 온도 센서 값 %2 %3',
        params: [
            {
                type: 'Dropdown',
                options: [['PORT 3', '3'], ['PORT 4', '4'], ['PORT 5', '5'], ['PORT 6', '6']],
                value: '3',
                fontSize: 11,
                bgColor: '#9a0045',
                arrowColor: EntryStatic.colorSet.common.WHITE,
            },
            {
                type: 'Dropdown',
                options: [
                    ['=', 'EQUAL'],
                    ['>', 'GREATER'],
                    ['<', 'LESS'],
                    ['≥', 'GREATER_OR_EQUAL'],
                    ['≤', 'LESS_OR_EQUAL'],
                ],
                value: 'LESS',
                fontSize: 11,
                bgColor: '#9a0045',
                arrowColor: EntryStatic.colorSet.common.WHITE,
                noaRrow: true,
            },
            {
                type: 'Block',
                accept: 'string',
            },
        ],
        def: {
            params: [
                null,
                null,
                {
                    type: 'number',
                    params: ['50'],
                },
            ],
            type: 'robotis_temperature_value_boolean',
        },
        paramsKeyMap: {
            PORT: 0,
            OPERATOR: 1,
            RIGHTVALUE: 2,
        },
        class: 'robotis_temperature',
        func(sprite, script) {
            Entry.hw.sendQueue.IS_EDU = true;
            const port = script.getNumberField('PORT', script);
            const operator = script.getField('OPERATOR', script);
            const rightValue = script.getNumberValue('RIGHTVALUE', script);
            let leftValue = 0;
            let data_address = 0;
            let isCheck = true;

            switch (port) {
                case 3:
                    leftValue = Entry.hw.portData.TEMPERATURE0;
                    data_address = 108;
                    break;
                case 4:
                    leftValue = Entry.hw.portData.TEMPERATURE1;
                    data_address = 109;
                    break;
                case 5:
                    leftValue = Entry.hw.portData.TEMPERATURE2;
                    data_address = 110;
                    break;
                case 6:
                    leftValue = Entry.hw.portData.TEMPERATURE3;
                    data_address = 111;
                    break;
            }

            const data_instruction = Entry.Robotis_openCM70.INSTRUCTION.WRITE;
            const data_length = 1;
            const data_value = 5;

            const data_sendqueue = [[data_instruction, data_address, data_length, data_value]];
            Entry.Robotis_carCont.setRobotisData(data_sendqueue);
            Entry.Robotis_carCont.update();
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
        },
    },
    robotis_move_for_secs: {
        color: '#00B200',
        outerLine: '#019101',
        skeleton: 'basic',
        fontColor: '#fff',
        statements: [],
        isNotFor: ['robotis_openCM70', 'robotis_openCM70EDU'],
        template: '%1모터를 %2 %3의 속도로 %4초 동안 회전 %5',
        params: [
            {
                type: 'Dropdown',
                options: [['왼쪽', '1'], ['오른쪽', '2'], ['양쪽', '3']],
                value: '1',
                fontSize: 11,
                bgColor: '#019101',
                arrowColor: EntryStatic.colorSet.common.WHITE,
            },
            {
                type: 'Dropdown',
                options: [['앞으로', 'CW'], ['뒤로', 'CCW']],
                value: 'CW',
                fontSize: 11,
                bgColor: '#019101',
                arrowColor: EntryStatic.colorSet.common.WHITE,
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
                img: 'block_icon/practical_course/dcmotor.png',
                size: 12,
            },
        ],
        events: {},
        def: {
            params: [
                null,
                null,
                {
                    type: 'practical_course_motor_speed',
                },
                {
                    type: 'number',
                    params: ['2'],
                },
                null,
            ],
            type: 'robotis_move_for_secs',
        },
        paramsKeyMap: {
            WHEEL: 0,
            DIRECTION: 1,
            SPEED: 2,
            DURATION: 3,
        },
        class: 'robotis_motor',
        func(sprite, script) {
            Entry.hw.sendQueue.IS_EDU = true;
            const duration = script.getNumberValue('DURATION');
            const wheel = script.getNumberField('WHEEL');
            let value = script.getNumberValue('SPEED');
            const direction = script.getStringField('DIRECTION');

            const data_instruction = Entry.Robotis_openCM70.INSTRUCTION.WRITE;
            let data_address = 0;
            let data_length = 0;
            let data_value = 0;

            data_address = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_MOTOR_SPEED[0];

            if (wheel == '3') {
                data_length = 4;
                data_address = 136;
            } else {
                data_length = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_MOTOR_SPEED[1];
                data_address = data_address + (wheel - 1) * data_length;
            }

            if (!script.isStart) {
                value = value * 68;
                if (wheel == '3' || wheel == '1') {
                    if (direction == 'CCW') {
                        value = value + 1024;
                        if (value > 2047) {
                            value = 2047;
                        }
                    } else {
                        if (value > 1023) {
                            value = 1023;
                        }
                    }
                } else {
                    if (direction == 'CW') {
                        value = value + 1024;
                        if (value > 2047) {
                            value = 2047;
                        }
                    } else {
                        if (value > 1023) {
                            value = 1023;
                        }
                    }
                }

                data_value = value;

                var data_sendqueue = [[data_instruction, data_address, data_length, data_value]];

                script.wheelMode = wheel;

                script.isStart = true;
                script.timeFlag = 1;
                setTimeout(() => {
                    script.timeFlag = 0;
                }, duration * 1000);

                Entry.Robotis_carCont.setRobotisData(data_sendqueue);
                Entry.Robotis_carCont.update();
                //return Entry.Robotis_carCont.postCallReturn(script, data_sendqueue, 2000);
                return script;
            } else if (script.timeFlag == 1) {
                //data_sendqueue = [[data_instruction, data_address, data_length, 0]];
                //Entry.Robotis_carCont.setRobotisData(data_sendqueue);
                return script;
            } else {
                delete script.timeFlag;
                delete script.isStart;
                delete script.wheelMode;
                Entry.engine.isContinue = false;

                data_sendqueue = [[data_instruction, data_address, data_length, 0]];
                Entry.Robotis_carCont.setRobotisData(data_sendqueue);
                Entry.engine.isContinue = false;
                Entry.Robotis_carCont.update();
                return script.callReturn();
            }
            //return Entry.Robotis_carCont.postCallReturn(script, data_sendqueue, 2000);
        },
    },
    robotis_aux_move_for: {
        color: '#00B200',
        outerLine: '#019101',
        skeleton: 'basic',
        fontColor: '#fff',
        statements: [],
        isNotFor: ['robotis_openCM70', 'robotis_openCM70EDU'],
        template: '%1모터를 %2 %3의 속도로 계속 회전 %4',
        params: [
            {
                type: 'Dropdown',
                options: [['왼쪽', '1'], ['오른쪽', '2'], ['양쪽', '3']],
                value: '1',
                fontSize: 11,
                bgColor: '#019101',
                arrowColor: EntryStatic.colorSet.common.WHITE,
            },
            {
                type: 'Dropdown',
                options: [['앞으로', 'CW'], ['뒤로', 'CCW']],
                value: 'CW',
                fontSize: 11,
                bgColor: '#019101',
                arrowColor: EntryStatic.colorSet.common.WHITE,
            },
            {
                type: 'Block',
                accept: 'string',
            },
            {
                type: 'Indicator',
                img: 'block_icon/practical_course/dcmotor.png',
                size: 12,
            },
        ],
        events: {},
        def: {
            params: [
                null,
                null,
                {
                    type: 'practical_course_motor_speed',
                },
                null,
            ],
            type: 'robotis_aux_move_for',
        },
        paramsKeyMap: {
            WHEEL: 0,
            DIRECTION: 1,
            SPEED: 2,
        },
        class: 'robotis_motor',
        //'isNotFor': ['mini'],
        func(sprite, script) {
            Entry.hw.sendQueue.IS_EDU = true;
            const wheel = script.getNumberField('WHEEL');
            let value = script.getNumberValue('SPEED');
            const direction = script.getStringField('DIRECTION');

            const data_instruction = Entry.Robotis_openCM70.INSTRUCTION.WRITE;
            let data_address = 0;
            let data_length = 0;
            let data_value = 0;
            data_address = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_MOTOR_SPEED[0];

            if (wheel == '3') {
                data_length = 4;
                data_address = 136;
            } else {
                data_length = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_MOTOR_SPEED[1];
                data_address = data_address + (wheel - 1) * data_length;
            }
            value = value * 68;

            if (wheel == '3' || wheel == '1') {
                if (direction == 'CCW') {
                    value = value + 1024;
                    if (value > 2047) {
                        value = 2047;
                    }
                } else {
                    if (value > 1023) {
                        value = 1023;
                    }
                }
            } else {
                if (direction == 'CW') {
                    value = value + 1024;
                    if (value > 2047) {
                        value = 2047;
                    }
                } else {
                    if (value > 1023) {
                        value = 1023;
                    }
                }
            }

            data_value = value;

            const data_sendqueue = [[data_instruction, data_address, data_length, data_value]];
            return Entry.Robotis_carCont.postCallReturn(
                script,
                data_sendqueue,
                Entry.Robotis_openCM70.delay
            );
        },
    },
    robotis_aux_stop_for: {
        color: '#00B200',
        outerLine: '#019101',
        skeleton: 'basic',
        fontColor: '#fff',
        statements: [],
        isNotFor: ['robotis_openCM70', 'robotis_openCM70EDU'],
        template: '%1모터를 정지 %2',
        params: [
            {
                type: 'Dropdown',
                options: [['왼쪽', '1'], ['오른쪽', '2'], ['양쪽', '3']],
                value: '1',
                fontSize: 11,
                bgColor: '#019101',
                arrowColor: EntryStatic.colorSet.common.WHITE,
            },
            {
                type: 'Indicator',
                img: 'block_icon/practical_course/dcmotor.png',
                size: 12,
            },
        ],
        events: {},
        def: {
            params: [null, null],
            type: 'robotis_aux_stop_for',
        },
        paramsKeyMap: {
            WHEEL: 0,
        },
        class: 'robotis_motor',
        func(sprite, script) {
            Entry.hw.sendQueue.IS_EDU = true;
            const wheel = script.getNumberField('WHEEL');
            const value = 0;

            const data_instruction = Entry.Robotis_openCM70.INSTRUCTION.WRITE;
            let data_address = 0;
            let data_length = 0;
            let data_value = 0;

            data_address = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_MOTOR_SPEED[0];
            if (wheel == '3') {
                data_length = 4;
                data_address = 136;
            } else {
                data_length = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_MOTOR_SPEED[1];
                data_address = data_address + (wheel - 1) * data_length;
            }

            data_value = value;

            const data_sendqueue = [[data_instruction, data_address, data_length, data_value]];
            return Entry.Robotis_carCont.postCallReturn(
                script,
                data_sendqueue,
                Entry.Robotis_openCM70.delay
            );
        },
    },
    robotis_set_servo_wheel: {
        color: '#D128BD',
        outerLine: '#a2049e',
        skeleton: 'basic',
        statements: [],
        isNotFor: ['robotis_openCM70', 'robotis_openCM70EDU'],
        template: '%1 포트의 서보모터를 %2 %3속도로 회전 %4',
        params: [
            {
                type: 'Dropdown',
                options: [['PORT 3', '3'], ['PORT 4', '4'], ['PORT 5', '5'], ['PORT 6', '6']],
                value: '3',
                fontSize: 11,
                bgColor: '#A2049E',
                arrowColor: EntryStatic.colorSet.common.WHITE,
            },
            {
                type: 'Dropdown',
                options: [['시계방향', 'CW'], ['반시계방향', 'CCW']],
                value: 'CW',
                fontSize: 11,
                bgColor: '#A2049E',
                arrowColor: EntryStatic.colorSet.common.WHITE,
            },
            {
                type: 'Dropdown',
                options: [
                    ['1', 1],
                    ['2', 2],
                    ['3', 3],
                    ['4', 4],
                    ['5', 5],
                    ['6', 6],
                    ['7', 7],
                    ['8', 8],
                    ['9', 9],
                    ['10', 10],
                    ['11', 11],
                    ['12', 12],
                    ['13', 13],
                    ['14', 14],
                    ['15', 15],
                ],
                value: 7,
                fontSize: 11,
                bgColor: '#A2049E',
                arrowColor: EntryStatic.colorSet.common.WHITE,
            },
            {
                type: 'Indicator',
                img: 'block_icon/practical_course/servo.png',
                size: 12,
            },
        ],
        events: {},
        def: {
            params: [null, null, null, null],
            type: 'robotis_set_servo_wheel',
        },
        paramsKeyMap: {
            PORT: 0,
            DIRECTION: 1,
            SPEED: 2,
        },
        class: 'robotis_servo_motor',
        func(sprite, script) {
            Entry.hw.sendQueue.IS_EDU = true;
            // instruction / address / length / value / default length
            const port = script.getField('PORT', script);
            const direction = script.getStringField('DIRECTION');
            const speed = script.getNumberField('SPEED');
            const value = 0;

            let data_address3 = 0;
            let data_length3 = 0;
            let data_value3 = 0;

            let data_address2 = 0;
            const data_length2 = 1;
            const data_value2 = 7;

            const data_instruction = Entry.Robotis_openCM70.INSTRUCTION.WRITE;
            let data_address = 0;
            let data_length = 0;
            let data_value = 0;

            let data_address4 = 0; // servo speed
            let data_length4 = 2;
            let data_value4 = 0;

            data_value4 = speed * 68;
            if (data_value4 > 1023) {
                data_value4 = 1023;
            }
            switch (port) {
                case '3':
                    data_address2 = 108;
                    Entry.Robotis_openCM70.SERVO_MODULEWRITE.PORT3 = true;
                    break;
                case '4':
                    data_address2 = 109;
                    Entry.Robotis_openCM70.SERVO_MODULEWRITE.PORT4 = true;
                    break;
                case '5':
                    data_address2 = 110;
                    Entry.Robotis_openCM70.SERVO_MODULEWRITE.PORT5 = true;
                    break;
                case '6':
                    data_address2 = 111;
                    Entry.Robotis_openCM70.SERVO_MODULEWRITE.PORT6 = true;
                    break;
            }

            data_address3 = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_SERVO_POSITION[0];
            data_length3 = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_SERVO_POSITION[1];

            data_address3 = data_address3 + (port - 1) * data_length3;

            data_address4 = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_SERVO_SPEED[0];
            data_length4 = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_SERVO_SPEED[1];

            data_address4 = data_address4 + (port - 1) * data_length4;

            data_address = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_SERVO_MODE[0];
            data_length = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_SERVO_MODE[1];

            data_address = data_address + (port - 1) * data_length;
            data_value = 0;

            if (direction == 'CW') {
                data_value4 = data_value4 + 1024;
                if (data_value4 > 2047) {
                    data_value4 = 2047;
                }
            } else {
                if (data_value4 > 1023) {
                    data_value4 = 1023;
                }
            }

            data_value3 = direction;

            //var data_sendqueue = [[data_instruction, data_address2, data_length2, data_value2], [data_instruction, data_address, data_length, data_value], [data_instruction, data_address4, data_length4, data_value4]];
            //return Entry.Robotis_carCont.postCallReturn(script, data_sendqueue, Entry.Robotis_openCM70.delay);
            //
            if (!script.isStart) {
                if (
                    (!Entry.Robotis_openCM70.SERVO_MODULEWRITE.PORT3 && port == '3') ||
                    (!Entry.Robotis_openCM70.SERVO_MODULEWRITE.PORT4 && port == '4') ||
                    (!Entry.Robotis_openCM70.SERVO_MODULEWRITE.PORT5 && port == '5') ||
                    (!Entry.Robotis_openCM70.SERVO_MODULEWRITE.PORT6 && port == '6')
                ) {
                    var data_sendqueue = [
                        [data_instruction, data_address2, data_length2, data_value2],
                    ];
                    Entry.Robotis_carCont.setRobotisData(data_sendqueue);
                    Entry.Robotis_carCont.update();
                    script.isStart = true;
                    script.timeFlag = 1;
                    setTimeout(() => {
                        script.timeFlag = 0;
                    }, 1 * 650);
                } else {
                    script.isStart = true;
                    script.timeFlag = 0;
                }

                /*
                    var data_sendqueue = [[data_instruction, data_address2, data_length2, data_value2]];
                    Entry.Robotis_carCont.setRobotisData(data_sendqueue);
                    Entry.Robotis_carCont.update();
                    script.isStart = true;
                    script.timeFlag = 1;
                    setTimeout(function () {
                        script.timeFlag = 0;
                    }, 1 * 650);
                    */

                return script;
            } else if (script.timeFlag == 1) {
                //data_sendqueue = [[data_instruction, data_address, data_length, 0]];
                //Entry.Robotis_carCont.setRobotisData(data_sendqueue);
                return script;
            } else {
                delete script.timeFlag;
                delete script.isStart;
                delete script.wheelMode;
                Entry.engine.isContinue = false;

                data_sendqueue = [
                    [data_instruction, data_address, data_length, data_value],
                    [data_instruction, data_address4, data_length4, data_value4],
                ];
                Entry.Robotis_carCont.setRobotisData(data_sendqueue);
                Entry.engine.isContinue = false;
                Entry.Robotis_carCont.update();
                return script.callReturn();
            }
            //
        },
    },
    robotis_set_servo_joint: {
        color: '#D128BD',
        outerLine: '#a2049e',
        skeleton: 'basic',
        statements: [],
        isNotFor: ['robotis_openCM70', 'robotis_openCM70EDU'],
        template: '%1 포트의 서보모터를 %2 도 %3속도로 이동 %4',
        params: [
            {
                type: 'Dropdown',
                options: [['PORT 3', '3'], ['PORT 4', '4'], ['PORT 5', '5'], ['PORT 6', '6']],
                value: '3',
                fontSize: 11,
                bgColor: '#A2049E',
                arrowColor: EntryStatic.colorSet.common.WHITE,
            },
            {
                type: 'Block',
                accept: 'string',
            },
            {
                type: 'Dropdown',
                options: [
                    ['1', 1],
                    ['2', 2],
                    ['3', 3],
                    ['4', 4],
                    ['5', 5],
                    ['6', 6],
                    ['7', 7],
                    ['8', 8],
                    ['9', 9],
                    ['10', 10],
                    ['11', 11],
                    ['12', 12],
                    ['13', 13],
                    ['14', 14],
                    ['15', 15],
                ],
                value: 7,
                fontSize: 11,
                bgColor: '#A2049E',
                arrowColor: EntryStatic.colorSet.common.WHITE,
            },
            {
                type: 'Indicator',
                img: 'block_icon/practical_course/servo.png',
                size: 12,
            },
        ],
        events: {},
        def: {
            params: [
                null,
                {
                    type: 'number',
                    params: ['512'],
                },
                null,
                null,
            ],
            type: 'robotis_set_servo_joint',
        },
        paramsKeyMap: {
            PORT: 0,
            VALUE: 1,
            SPEED: 2,
        },
        class: 'robotis_servo_motor',
        func(sprite, script) {
            Entry.hw.sendQueue.IS_EDU = true;
            // instruction / address / length / value / default length
            const port = script.getField('PORT', script);
            let value = script.getNumberValue('VALUE');
            const speed = script.getNumberField('SPEED');

            var data_instruction = Entry.Robotis_openCM70.INSTRUCTION.WRITE;
            let data_address3 = 0;
            let data_length3 = 0;
            let data_value3 = 0;

            let data_address2 = 0;
            const data_length2 = 1;
            const data_value2 = 7;

            var data_instruction = Entry.Robotis_openCM70.INSTRUCTION.WRITE;
            let data_address = 0;
            let data_length = 0;
            let data_value = 0;

            let data_address4 = 0; // servo speed
            let data_length4 = 2;
            let data_value4 = 0;

            data_value4 = speed * 68;
            if (data_value4 > 1023) {
                data_value4 = 1023;
            }
            switch (port) {
                case '3':
                    data_address2 = 108;
                    break;
                case '4':
                    data_address2 = 109;
                    break;
                case '5':
                    data_address2 = 110;
                    break;
                case '6':
                    data_address2 = 111;
                    break;
            }

            data_address3 = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_SERVO_POSITION[0];
            data_length3 = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_SERVO_POSITION[1];

            data_address3 = data_address3 + (port - 1) * data_length3;

            data_address4 = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_SERVO_SPEED[0];
            data_length4 = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_SERVO_SPEED[1];

            data_address4 = data_address4 + (port - 1) * data_length4;

            data_address = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_SERVO_MODE[0];
            data_length = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_SERVO_MODE[1];

            data_address = data_address + (port - 1) * data_length;
            data_value = 1;

            if (value > 1023) {
                value = 1023;
            } else if (value < 0) {
                value = 0;
            }

            data_value3 = value;

            if (!script.isStart) {
                var data_sendqueue = [[data_instruction, data_address2, data_length2, data_value2]];
                //Entry.Robotis_carCont.setRobotisData(data_sendqueue);
                //Entry.Robotis_carCont.update();
                if (
                    (!Entry.Robotis_openCM70.SERVO_MODULEWRITE.PORT3 && port == '3') ||
                    (!Entry.Robotis_openCM70.SERVO_MODULEWRITE.PORT4 && port == '4') ||
                    (!Entry.Robotis_openCM70.SERVO_MODULEWRITE.PORT5 && port == '5') ||
                    (!Entry.Robotis_openCM70.SERVO_MODULEWRITE.PORT6 && port == '6')
                ) {
                    script.isStart = true;
                    script.timeFlag = 1;
                    setTimeout(() => {
                        script.timeFlag = 0;
                    }, 1 * 650);
                } else {
                    script.isStart = true;
                    script.timeFlag = 0;
                }

                return script;
            } else if (script.timeFlag == 1) {
                return script;
            } else {
                delete script.timeFlag;
                delete script.isStart;
                delete script.wheelMode;
                Entry.engine.isContinue = false;

                setTimeout(() => {
                    script.timeFlag = 0;
                }, 1 * 70);

                data_sendqueue = [
                    [data_instruction, data_address, data_length, data_value],
                    [data_instruction, data_address4, data_length4, data_value4],
                    [data_instruction, data_address3, data_length3, data_value3],
                ];
                Entry.Robotis_carCont.setRobotisData(data_sendqueue);
                Entry.engine.isContinue = false;
                Entry.Robotis_carCont.update();
                return script.callReturn();
            }
            //
        },
    },
    robotis_melody_note_for: {
        color: '#FC327F',
        skeleton: 'basic',
        statements: [],
        isNotFor: ['robotis_openCM70', , 'robotis_openCM70EDU'],
        template: '멜로디 %1 을(를) %2 옥타브로 %3 만큼 소리내기 %4',
        params: [
            {
                type: 'Dropdown',
                options: [
                    //['무음', '12'],
                    ['도', '0'],
                    ['도#(레♭)', '1'],
                    ['레', '2'],
                    ['레#(미♭)', '3'],
                    ['미', '4'],
                    ['파', '5'],
                    ['파#(솔♭)', '6'],
                    ['솔', '7'],
                    ['솔#(라♭)', '8'],
                    ['라', '9'],
                    ['라#(시♭)', '10'],
                    ['시', '11'],
                ],
                value: '0',
                fontSize: 11,
                bgColor: '#ce105e',
                arrowColor: EntryStatic.colorSet.common.WHITE,
            },
            {
                type: 'Dropdown',
                options: [['1', '0'], ['2', '1'], ['3', '2'], ['4', '3'], ['5', '4'], ['6', '5']],
                value: '2',
                fontSize: 11,
                bgColor: '#ce105e',
                arrowColor: EntryStatic.colorSet.common.WHITE,
            },
            {
                type: 'Dropdown',
                options: [
                    ['온음표', '4'],
                    ['2분음표', '2'],
                    ['4분음표', '1'],
                    ['8분음표', '0.5'],
                    ['16분음표', '0.25'],
                    /*['4분음표', '4'],
                    ['8분음표', '8'],
                    ['16분음표', '16'],*/
                ],
                value: '4',
                fontSize: 11,
                bgColor: '#ce105e',
                arrowColor: EntryStatic.colorSet.common.WHITE,
            },
            {
                type: 'Indicator',
                img: 'block_icon/practical_course/melody.png',
                size: 12,
            },
        ],
        events: {},
        def: {
            params: [null, null, null, null],
            type: 'robotis_melody_note_for',
        },
        paramsKeyMap: {
            NOTE: 0,
            OCTAVE: 1,
            DURATION: 2,
        },
        class: 'robotis_melody',
        //'isNotFor': ['mini'],
        func(sprite, script) {
            Entry.hw.sendQueue.IS_EDU = true;
            const note = script.getNumberField('NOTE', script);
            const octave = script.getNumberField('OCTAVE', script);
            const cmBuzzerTime = script.getNumberField('DURATION', script);

            let cmBuzzerIndex = note + octave * 12;
            if (cmBuzzerIndex > 51) {
                cmBuzzerIndex = 51;
            }
            if (cmBuzzerIndex < 0) {
                cmBuzzerIndex = 0;
            }

            const data_instruction = Entry.Robotis_openCM70.INSTRUCTION.WRITE;
            let data_address_1 = 0;
            let data_length_1 = 0;
            let data_value_1 = 0;
            let data_address_2 = 0;
            let data_length_2 = 0;
            let data_value_2 = 0;

            data_address_1 = Entry.Robotis_openCM70.CONTROL_TABLE.CM_BUZZER_TIME[0];
            data_length_1 = Entry.Robotis_openCM70.CONTROL_TABLE.CM_BUZZER_TIME[1];

            // TODO 텍스트 입력으로 바꾸고 최대는 5초 : 0.5 초 하려면 5를 입력  - console.log(parseInt(0.59 * 10)); max 는 5초

            data_value_1 = parseInt(cmBuzzerTime * 10);
            if (data_value_1 > 50) {
                data_value_1 = 50;
            }
            //data_value_1
            data_address_2 = Entry.Robotis_openCM70.CONTROL_TABLE.CM_BUZZER_INDEX[0];
            data_length_2 = Entry.Robotis_openCM70.CONTROL_TABLE.CM_BUZZER_INDEX[1];
            data_value_2 = cmBuzzerIndex;

            const data_sendqueue = [
                [data_instruction, data_address_1, data_length_1, data_value_1],
                [data_instruction, data_address_2, data_length_2, data_value_2],
            ];
            return Entry.Robotis_carCont.postCallReturn(
                script,
                data_sendqueue,
                cmBuzzerTime * 1000
            );
        },
    },
};

module.exports.practicalCourseBlock = miniBlock;
module.exports.setLanguage = () => ({
    ko: {
        Helper: {
            robotis_aux_move_for: '',
        },
    },
    en: {
        Helper: {
            robotis_aux_move_for: '',
        },
    },
    jp: {
        Helper: {
            robotis_aux_move_for: '',
        },
    },
    vn: {
        Helper: {
            robotis_aux_move_for: '',
        },
    },
});
