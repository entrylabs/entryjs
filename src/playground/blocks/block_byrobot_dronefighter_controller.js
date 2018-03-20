'use strict';

/***************************************************************************************
 *
 *  이름 붙이기 규칙(2017.1.16)
 *
 *  1. 변수에 해당하는 이름들은 모두 소문자
 *  2. 이어지는 추가 이름은 '_'를 붙여서 연결
 *
 ***************************************************************************************/

/***************************************************************************************
 *  장치와 연관된 변수 및 함수 정의
 ***************************************************************************************/

Entry.byrobot_dronefighter_controller = {
    name: 'byrobot_dronefighter_controller',
    url: 'http://www.byrobot.co.kr/',
    imageName: 'byrobot_dronefighter_controller.png',
    title: {
        "ko": "바이로봇 드론파이터 조종기",
        "en": "BYROBOT Drone Fighter controller"
    },

    // 초기화
    setZero: function() {
        // 초기화

        // 한 번에 명령을 전송하면 hw까지 제대로 전달되지 않는 경우가 있어
        // 명령을 각각 분리하여 전송하게 함(2017.01.03)
        for (var i = 0; i < 1; i++) {
            this.transferVibrator(0, 0, 0, 0);
            this.transferbuzzer(0, 0, 0);
            this.transferLightManual(0x11, 0xff, 0);
            this.transferCommand(0x11, 0x81, 0);
        }
    },

    // Entry 좌측 하단 하드웨어 모니터 화면에 표시하는 속성
    // listPorts와 ports 두 곳 동시에 동일한 속성을 표시할 수는 없음
    monitorTemplate: {
        imgPath: 'hw/byrobot_dronefighter_controller.png', // 배경 이미지
        width: 500, // 이미지의 폭
        height: 500, // 이미지의 높이

        // 모니터 화면 상단에 차례대로 나열하는 값
        listPorts: {
            joystick_left_x: {
                name:
                    Lang.Blocks.byrobot_dronefighter_controller_joystick_left_x,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            joystick_left_y: {
                name:
                    Lang.Blocks.byrobot_dronefighter_controller_joystick_left_y,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            joystick_left_direction: {
                name:
                    Lang.Blocks
                        .byrobot_dronefighter_controller_joystick_left_direction,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            joystick_left_event: {
                name:
                    Lang.Blocks
                        .byrobot_dronefighter_controller_joystick_left_event,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            joystick_left_command: {
                name:
                    Lang.Blocks
                        .byrobot_dronefighter_controller_joystick_left_command,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            joystick_right_x: {
                name:
                    Lang.Blocks
                        .byrobot_dronefighter_controller_joystick_right_x,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            joystick_right_y: {
                name:
                    Lang.Blocks
                        .byrobot_dronefighter_controller_joystick_right_y,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            joystick_right_direction: {
                name:
                    Lang.Blocks
                        .byrobot_dronefighter_controller_joystick_right_direction,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            joystick_right_event: {
                name:
                    Lang.Blocks
                        .byrobot_dronefighter_controller_joystick_right_event,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            joystick_right_command: {
                name:
                    Lang.Blocks
                        .byrobot_dronefighter_controller_joystick_right_command,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            button_button: {
                name: Lang.Blocks.byrobot_dronefighter_controller_button_button,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            button_event: {
                name: Lang.Blocks.byrobot_dronefighter_controller_button_event,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            entryhw_countTransferReserved: {
                name:
                    Lang.Blocks
                        .byrobot_dronefighter_entryhw_count_transfer_reserved,
                type: 'output',
                pos: { x: 0, y: 0 },
            },
        },

        // 모니터 화면 지정 위치와 선으로 연결하여 표시하는 값
        ports: {},

        mode: 'both', // 표시 모드
    },

    // functions

    // 시간 지연
    checkFinish: function(script, ms) {
        if (!script.isStart) {
            script.isStart = true;
            script.timeFlag = 1;

            var fps = Entry.FPS || 60;
            var timeValue = 60 / fps * ms;

            setTimeout(function() {
                script.timeFlag = 0;
            }, timeValue);

            return 'Start';
        } else if (script.timeFlag == 1) {
            return 'Running';
        } else {
            delete script.timeFlag;
            delete script.isStart;
            Entry.engine.isContinue = false;
            return 'Finish';
        }
    },

    // 데이터 전송
    transferLightManual: function(target, flags, brightness) {
        // 범위 조정
        target = Math.max(target, 0);
        target = Math.min(target, 255);
        flags = Math.max(flags, 0);
        flags = Math.min(flags, 255);
        brightness = Math.max(brightness, 0);
        brightness = Math.min(brightness, 255);

        // 전송
        Entry.hw.setDigitalPortValue('target', target);
        Entry.hw.setDigitalPortValue('light_manual_flags', flags);
        Entry.hw.setDigitalPortValue('light_manual_brightness', brightness);

        Entry.hw.update();

        delete Entry.hw.sendQueue['target'];
        delete Entry.hw.sendQueue['light_manual_flags'];
        delete Entry.hw.sendQueue['light_manual_brightness'];
    },

    transferbuzzer: function(mode, value, time) {
        // 전송
        Entry.hw.setDigitalPortValue('target', 0x11);
        Entry.hw.setDigitalPortValue('buzzer_mode', mode);
        Entry.hw.setDigitalPortValue('buzzer_value', value);
        Entry.hw.setDigitalPortValue('buzzer_time', time);

        Entry.hw.update();

        delete Entry.hw.sendQueue['target'];
        delete Entry.hw.sendQueue['buzzer_mode'];
        delete Entry.hw.sendQueue['buzzer_value'];
        delete Entry.hw.sendQueue['buzzer_time'];
    },

    transferVibrator: function(mode, timeOn, timeOff, timeRun) {
        // 범위 조정
        timeOn = Math.max(timeOn, 1);
        timeOn = Math.min(timeOn, 60000);
        timeOff = Math.max(timeOff, 1);
        timeOff = Math.min(timeOff, 60000);

        // 전송
        Entry.hw.setDigitalPortValue('target', 0x11);
        Entry.hw.setDigitalPortValue('vibrator_mode', mode);
        Entry.hw.setDigitalPortValue('vibrator_on', timeOn);
        Entry.hw.setDigitalPortValue('vibrator_off', timeOff);
        Entry.hw.setDigitalPortValue('vibrator_total', timeRun);

        Entry.hw.update();

        delete Entry.hw.sendQueue['target'];
        delete Entry.hw.sendQueue['vibrator_mode'];
        delete Entry.hw.sendQueue['vibrator_on'];
        delete Entry.hw.sendQueue['vibrator_off'];
        delete Entry.hw.sendQueue['vibrator_total'];
    },

    transferCommand: function(target, command, option) {
        // 전송
        Entry.hw.setDigitalPortValue('target', target);
        Entry.hw.setDigitalPortValue('command_command', command);
        Entry.hw.setDigitalPortValue('command_option', option);

        Entry.hw.update();

        delete Entry.hw.sendQueue['target'];
        delete Entry.hw.sendQueue['command_command'];
        delete Entry.hw.sendQueue['command_option'];
    },

    transferUserInterface: function(uicommand, uifunction) {
        // 전송
        Entry.hw.setDigitalPortValue('target', 0x11);
        Entry.hw.setDigitalPortValue('userinterface_command', uicommand);
        Entry.hw.setDigitalPortValue('userinterface_function', uifunction);

        Entry.hw.update();

        delete Entry.hw.sendQueue['target'];
        delete Entry.hw.sendQueue['userinterface_command'];
        delete Entry.hw.sendQueue['userinterface_function'];
    },

    // functions for block

    // 데이터 읽기
    getData: function(script, device) {
        return Entry.hw.portData[device];
    },

    // LED 수동 설정
    setLightManual: function(script, target, flags, brightness) {
        switch (this.checkFinish(script, 40)) {
            case 'Start':
                {
                    this.transferLightManual(target, flags, brightness);
                }
                return script;

            case 'Running':
                return script;

            case 'Finish':
                return script.callReturn();

            default:
                return script.callReturn();
        }
    },

    // 버저 설정(함수 호출 시 시간은 모두 ms 단위 사용)
    /*  
        MuteInstantally     = 1,    // 묵음 즉시 적용
        MuteContinually     = 2,    // 묵음 예약
        
        ScaleInstantally    = 3,    // 음계 즉시 적용
        ScaleContinually    = 4,    // 음계 예약
        
        HzInstantally       = 5,    // 주파수 즉시 적용
        HzContinually       = 6,    // 주파수 예약
     */
    // 정지
    setBuzzerStop: function(script) {
        switch (this.checkFinish(script, 40)) {
            case 'Start':
                {
                    this.transferbuzzer(0, 0, 0);
                }
                return script;

            case 'Running':
                return script;

            case 'Finish':
                return script.callReturn();

            default:
                return script.callReturn();
        }
    },

    // 묵음
    setBuzzerMute: function(script, time, flagDelay, flagInstantly) {
        time = Math.max(time, 0);
        time = Math.min(time, 60000);

        var timeDelay = 40;
        if (flagDelay) timeDelay = time;

        switch (this.checkFinish(script, timeDelay)) {
            case 'Start':
                {
                    var mode = 2; // 묵음 연속
                    if (flagInstantly) mode = 1; // 묵음 즉시

                    this.transferbuzzer(mode, 0xee, time);
                }
                return script;

            case 'Running':
                return script;

            case 'Finish':
                return script.callReturn();

            default:
                return script.callReturn();
        }
    },

    setBuzzerScale: function(
        script,
        octave,
        scale,
        time,
        flagDelay,
        flagInstantly
    ) {
        time = Math.max(time, 0);
        time = Math.min(time, 60000);

        var timeDelay = 40;
        if (flagDelay) timeDelay = time;

        switch (this.checkFinish(script, timeDelay)) {
            case 'Start':
                {
                    var mode = 4; // Scale 연속
                    if (flagInstantly) mode = 3; // Scale 즉시

                    var scalecalc = octave * 12 + scale;

                    this.transferbuzzer(mode, scalecalc, time);
                }
                return script;

            case 'Running':
                return script;

            case 'Finish':
                return script.callReturn();

            default:
                return script.callReturn();
        }
    },

    setBuzzerHz: function(script, hz, time, flagDelay, flagInstantly) {
        time = Math.max(time, 0);
        time = Math.min(time, 60000);

        var timeDelay = 40;
        if (flagDelay) timeDelay = time;

        switch (this.checkFinish(script, timeDelay)) {
            case 'Start':
                {
                    var mode = 6; // Hz 연속
                    if (flagInstantly) mode = 5; // Hz 즉시

                    // 범위 조정
                    hz = Math.max(hz, 1);
                    hz = Math.min(hz, 63999);

                    this.transferbuzzer(mode, hz, time);
                }
                return script;

            case 'Running':
                return script;

            case 'Finish':
                return script.callReturn();

            default:
                return script.callReturn();
        }
    },

    // 진동 제어
    /*
        Stop            = 0,    // 정지
        Instantally     = 1,    // 즉시 적용
        Continually     = 2,    // 예약
     */
    setVibratorStop: function(script) {
        switch (this.checkFinish(script, 40)) {
            case 'Start':
                {
                    this.transferVibrator(0, 0, 0, 0);
                }
                return script;

            case 'Running':
                return script;

            case 'Finish':
                return script.callReturn();

            default:
                return script.callReturn();
        }
    },

    setVibrator: function(
        script,
        timeOn,
        timeOff,
        timeRun,
        flagDelay,
        flagInstantly
    ) {
        timeRun = Math.max(timeRun, 0);
        timeRun = Math.min(timeRun, 60000);

        var timeDelay = 40;
        if (flagDelay) timeDelay = timeRun;

        switch (this.checkFinish(script, timeDelay)) {
            case 'Start':
                {
                    var mode = 2; // 예약
                    if (flagInstantly) mode = 1; // 즉시

                    this.transferVibrator(mode, timeOn, timeOff, timeRun);
                }
                return script;

            case 'Running':
                return script;

            case 'Finish':
                return script.callReturn();

            default:
                return script.callReturn();
        }
    },

    sendCommand: function(script, target, command, option) {
        switch (this.checkFinish(script, 40)) {
            case 'Start':
                {
                    this.transferCommand(target, command, option);
                }
                return script;

            case 'Running':
                return script;

            case 'Finish':
                return script.callReturn();

            default:
                return script.callReturn();
        }
    },

    setUserInterface: function(script, uicommand, uifunction) {
        switch (this.checkFinish(script, 40)) {
            case 'Start':
                {
                    this.transferUserInterface(uicommand, uifunction);
                }
                return script;

            case 'Running':
                return script;

            case 'Finish':
                return script.callReturn();

            default:
                return script.callReturn();
        }
    },
};

Entry.byrobot_dronefighter_controller.getBlocks = function() {
    return {
        //region byrobot 바이로봇
        /* BYROBOT DroneFighter Controller Start */
        byrobot_dronefighter_controller_controller_value_button: {
            color: '#00979D',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [
                            Lang.Blocks
                                .byrobot_dronefighter_controller_button_button,
                            'button_button',
                        ],
                        [
                            Lang.Blocks
                                .byrobot_dronefighter_controller_button_event,
                            'button_event',
                        ],
                    ],
                    value: 'button_button', // 초기 선택항목 지정
                    fontSize: 11,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'byrobot_dronefighter_controller_controller_value_button', // 언어 파일에서 읽어들일 템플릿. 객체 이름과 동일하게
            },
            paramsKeyMap: {
                DEVICE: 0,
            },
            class: 'byrobot_dronefighter_controller_monitor', // 같은 이름인 객체들이 그룹으로 형성됨
            isNotFor: ['byrobot_dronefighter_controller'],
            func: function(sprite, script) {
                var read = Entry.hw.portData;
                var device = script.getField('DEVICE'); // paramsKeyMap에 정의된 이름 사용
                return read[device];
            },
        },
        byrobot_dronefighter_controller_controller_value_joystick: {
            color: '#00979D',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [
                            Lang.Blocks
                                .byrobot_dronefighter_controller_joystick_left_x,
                            'joystick_left_x',
                        ],
                        [
                            Lang.Blocks
                                .byrobot_dronefighter_controller_joystick_left_y,
                            'joystick_left_y',
                        ],
                        [
                            Lang.Blocks
                                .byrobot_dronefighter_controller_joystick_left_direction,
                            'joystick_left_direction',
                        ],
                        [
                            Lang.Blocks
                                .byrobot_dronefighter_controller_joystick_left_event,
                            'joystick_left_event',
                        ],
                        [
                            Lang.Blocks
                                .byrobot_dronefighter_controller_joystick_left_command,
                            'joystick_left_command',
                        ],
                        [
                            Lang.Blocks
                                .byrobot_dronefighter_controller_joystick_right_x,
                            'joystick_right_x',
                        ],
                        [
                            Lang.Blocks
                                .byrobot_dronefighter_controller_joystick_right_y,
                            'joystick_right_y',
                        ],
                        [
                            Lang.Blocks
                                .byrobot_dronefighter_controller_joystick_right_direction,
                            'joystick_right_direction',
                        ],
                        [
                            Lang.Blocks
                                .byrobot_dronefighter_controller_joystick_right_event,
                            'joystick_right_event',
                        ],
                        [
                            Lang.Blocks
                                .byrobot_dronefighter_controller_joystick_right_command,
                            'joystick_right_command',
                        ],
                    ],
                    value: 'joystick_left_x', // 초기 선택항목 지정
                    fontSize: 11,
                },
            ],
            events: {},
            def: {
                params: [null],
                type:
                    'byrobot_dronefighter_controller_controller_value_joystick', // 언어 파일에서 읽어들일 템플릿. 객체 이름과 동일하게
            },
            paramsKeyMap: {
                DEVICE: 0,
            },
            class: 'byrobot_dronefighter_controller_monitor', // 같은 이름인 객체들이 그룹으로 형성됨
            isNotFor: ['byrobot_dronefighter_controller'],
            func: function(sprite, script) {
                var read = Entry.hw.portData;
                var device = script.getField('DEVICE'); // paramsKeyMap에 정의된 이름 사용
                return read[device];
            },
        },
        byrobot_dronefighter_controller_controller_if_button_press: {
            color: '#00979D',
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [
                            Lang.Blocks
                                .byrobot_dronefighter_controller_button_front_left,
                            '1',
                        ],
                        [
                            Lang.Blocks
                                .byrobot_dronefighter_controller_button_front_right,
                            '2',
                        ],
                        [
                            Lang.Blocks
                                .byrobot_dronefighter_controller_button_front_left_right,
                            '3',
                        ],
                        [
                            Lang.Blocks
                                .byrobot_dronefighter_controller_button_center_up_left,
                            '4',
                        ],
                        [
                            Lang.Blocks
                                .byrobot_dronefighter_controller_button_center_up_right,
                            '8',
                        ],
                        [
                            Lang.Blocks
                                .byrobot_dronefighter_controller_button_center_up,
                            '16',
                        ],
                        [
                            Lang.Blocks
                                .byrobot_dronefighter_controller_button_center_left,
                            '32',
                        ],
                        [
                            Lang.Blocks
                                .byrobot_dronefighter_controller_button_center_right,
                            '64',
                        ],
                        [
                            Lang.Blocks
                                .byrobot_dronefighter_controller_button_center_down,
                            '128',
                        ],
                        [
                            Lang.Blocks
                                .byrobot_dronefighter_controller_button_bottom_left,
                            '256',
                        ],
                        [
                            Lang.Blocks
                                .byrobot_dronefighter_controller_button_bottom_right,
                            '512',
                        ],
                        [
                            Lang.Blocks
                                .byrobot_dronefighter_controller_button_bottom_left_right,
                            '768',
                        ],
                    ],
                    value: '1',
                    fontSize: 11,
                },
            ],
            events: {},
            def: {
                params: [null],
                type:
                    'byrobot_dronefighter_controller_controller_if_button_press',
            },
            paramsKeyMap: {
                BUTTON: 0,
            },
            class: 'byrobot_dronefighter_controller_boolean_input',
            isNotFor: ['byrobot_dronefighter_controller'],
            func: function(sprite, script) {
                var read = Entry.hw.portData;
                var button = 'button_button'; // paramsKeyMap에 정의된 이름 사용
                var buttonevent = 'button_event'; // paramsKeyMap에 정의된 이름 사용

                if (
                    read[button] == script.getField('BUTTON') &&
                    read[buttonevent] == 2
                )
                    return true;
                else return false;
            },
        },
        byrobot_dronefighter_controller_controller_if_joystick_direction: {
            color: '#00979D',
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [
                            Lang.Blocks.byrobot_dronefighter_common_left,
                            'joystick_left_direction',
                        ],
                        [
                            Lang.Blocks.byrobot_dronefighter_common_right,
                            'joystick_right_direction',
                        ],
                    ],
                    value: 'joystick_left_direction',
                    fontSize: 11,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [
                            Lang.Blocks
                                .byrobot_dronefighter_controller_joystick_direction_left_up,
                            '17',
                        ],
                        [
                            Lang.Blocks
                                .byrobot_dronefighter_controller_joystick_direction_up,
                            '18',
                        ],
                        [
                            Lang.Blocks
                                .byrobot_dronefighter_controller_joystick_direction_right_up,
                            '20',
                        ],
                        [
                            Lang.Blocks
                                .byrobot_dronefighter_controller_joystick_direction_left,
                            '33',
                        ],
                        [
                            Lang.Blocks
                                .byrobot_dronefighter_controller_joystick_direction_center,
                            '34',
                        ],
                        [
                            Lang.Blocks
                                .byrobot_dronefighter_controller_joystick_direction_right,
                            '36',
                        ],
                        [
                            Lang.Blocks
                                .byrobot_dronefighter_controller_joystick_direction_left_down,
                            '65',
                        ],
                        [
                            Lang.Blocks
                                .byrobot_dronefighter_controller_joystick_direction_down,
                            '66',
                        ],
                        [
                            Lang.Blocks
                                .byrobot_dronefighter_controller_joystick_direction_right_down,
                            '68',
                        ],
                    ],
                    value: '34',
                    fontSize: 11,
                },
            ],
            events: {},
            def: {
                params: [null, null],
                type:
                    'byrobot_dronefighter_controller_controller_if_joystick_direction',
            },
            paramsKeyMap: {
                DEVICE: 0,
                DIRECTION: 1,
            },
            class: 'byrobot_dronefighter_controller_boolean_input',
            isNotFor: ['byrobot_dronefighter_controller'],
            func: function(sprite, script) {
                var read = Entry.hw.portData;

                var device = script.getField('DEVICE'); // paramsKeyMap에 정의된 이름 사용

                if (read[device] == script.getField('DIRECTION')) return true;
                else return false;
            },
        },
        byrobot_dronefighter_controller_controller_light_manual_single_off: {
            color: '#00979D',
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_03.png',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [null],
                type:
                    'byrobot_dronefighter_controller_controller_light_manual_single_off',
            },
            paramsKeyMap: {},
            class: 'byrobot_dronefighter_controller_controller_light',
            isNotFor: ['byrobot_dronefighter_controller'],
            func: function(sprite, script) {
                return Entry.byrobot_dronefighter_controller.setLightManual(
                    script,
                    0x11,
                    0xff,
                    0
                );
            },
        },
        byrobot_dronefighter_controller_controller_light_manual_single: {
            color: '#00979D',
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [
                            Lang.Blocks
                                .byrobot_dronefighter_common_light_manual_all,
                            '255',
                        ],
                        [
                            Lang.Blocks
                                .byrobot_dronefighter_common_light_manual_1,
                            '128',
                        ],
                        [
                            Lang.Blocks
                                .byrobot_dronefighter_common_light_manual_2,
                            '64',
                        ],
                        [
                            Lang.Blocks
                                .byrobot_dronefighter_common_light_manual_3,
                            '32',
                        ],
                        [
                            Lang.Blocks
                                .byrobot_dronefighter_common_light_manual_4,
                            '16',
                        ],
                        [
                            Lang.Blocks
                                .byrobot_dronefighter_common_light_manual_5,
                            '8',
                        ],
                        [
                            Lang.Blocks
                                .byrobot_dronefighter_common_light_manual_6,
                            '4',
                        ],
                        [
                            Lang.Blocks
                                .byrobot_dronefighter_common_light_manual_blue,
                            '2',
                        ],
                        [
                            Lang.Blocks
                                .byrobot_dronefighter_common_light_manual_red,
                            '1',
                        ],
                    ],
                    value: '128',
                    fontSize: 11,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [
                            Lang.Blocks
                                .byrobot_dronefighter_common_light_manual_on,
                            '220',
                        ],
                        [
                            Lang.Blocks
                                .byrobot_dronefighter_common_light_manual_off,
                            '0',
                        ],
                        [
                            Lang.Blocks
                                .byrobot_dronefighter_common_light_manual_b25,
                            '75',
                        ],
                        [
                            Lang.Blocks
                                .byrobot_dronefighter_common_light_manual_b50,
                            '125',
                        ],
                        [
                            Lang.Blocks
                                .byrobot_dronefighter_common_light_manual_b75,
                            '200',
                        ],
                        [
                            Lang.Blocks
                                .byrobot_dronefighter_common_light_manual_b100,
                            '255',
                        ],
                    ],
                    value: '220',
                    fontSize: 11,
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_03.png',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [null, null, null],
                type:
                    'byrobot_dronefighter_controller_controller_light_manual_single',
            },
            paramsKeyMap: {
                FLAGS: 0,
                BRIGHTNESS: 1,
            },
            class: 'byrobot_dronefighter_controller_controller_light',
            isNotFor: ['byrobot_dronefighter_controller'],
            func: function(sprite, script) {
                var flags = parseInt(script.getField('FLAGS'));
                var brightness = parseInt(script.getField('BRIGHTNESS'));
                return Entry.byrobot_dronefighter_controller.setLightManual(
                    script,
                    0x11,
                    flags,
                    brightness
                );
            },
        },
        byrobot_dronefighter_controller_controller_light_manual_single_input: {
            color: '#00979D',
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
                    img: 'block_icon/hardware_03.png',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'text',
                        params: ['0b11111111'],
                    },
                    {
                        type: 'text',
                        params: ['255'],
                    },
                    null,
                ],
                type:
                    'byrobot_dronefighter_controller_controller_light_manual_single_input',
            },
            paramsKeyMap: {
                FLAGS: 0,
                BRIGHTNESS: 1,
            },
            class: 'byrobot_dronefighter_controller_controller_light',
            isNotFor: ['byrobot_dronefighter_controller'],
            func: function(sprite, script) {
                var flags = script.getNumberValue('FLAGS');
                var brightness = script.getNumberValue('BRIGHTNESS');
                return Entry.byrobot_dronefighter_controller.setLightManual(
                    script,
                    0x11,
                    flags,
                    brightness
                );
            },
        },
        byrobot_dronefighter_controller_controller_buzzer_off: {
            color: '#00979D',
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_03.png',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'byrobot_dronefighter_controller_controller_buzzer_off',
            },
            paramsKeyMap: {},
            class: 'byrobot_dronefighter_controller_buzzer',
            isNotFor: ['byrobot_dronefighter_controller'],
            func: function(sprite, script) {
                return Entry.byrobot_dronefighter_controller.setBuzzerStop(
                    script
                );
            },
        },
        byrobot_dronefighter_controller_controller_buzzer_scale: {
            color: '#00979D',
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['4', '3'],
                        ['5', '4'],
                        ['6', '5'],
                        ['7', '6'],
                        ['8', '7'],
                    ],
                    value: '4',
                    fontSize: 11,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [
                            Lang.Blocks
                                .byrobot_dronefighter_controller_buzzer_mute,
                            '-1',
                        ],
                        [
                            Lang.Blocks
                                .byrobot_dronefighter_controller_buzzer_c,
                            '0',
                        ],
                        [
                            Lang.Blocks
                                .byrobot_dronefighter_controller_buzzer_cs,
                            '1',
                        ],
                        [
                            Lang.Blocks
                                .byrobot_dronefighter_controller_buzzer_d,
                            '2',
                        ],
                        [
                            Lang.Blocks
                                .byrobot_dronefighter_controller_buzzer_ds,
                            '3',
                        ],
                        [
                            Lang.Blocks
                                .byrobot_dronefighter_controller_buzzer_e,
                            '4',
                        ],
                        [
                            Lang.Blocks
                                .byrobot_dronefighter_controller_buzzer_f,
                            '5',
                        ],
                        [
                            Lang.Blocks
                                .byrobot_dronefighter_controller_buzzer_fs,
                            '6',
                        ],
                        [
                            Lang.Blocks
                                .byrobot_dronefighter_controller_buzzer_g,
                            '7',
                        ],
                        [
                            Lang.Blocks
                                .byrobot_dronefighter_controller_buzzer_gs,
                            '8',
                        ],
                        [
                            Lang.Blocks
                                .byrobot_dronefighter_controller_buzzer_a,
                            '9',
                        ],
                        [
                            Lang.Blocks
                                .byrobot_dronefighter_controller_buzzer_as,
                            '10',
                        ],
                        [
                            Lang.Blocks
                                .byrobot_dronefighter_controller_buzzer_b,
                            '11',
                        ],
                    ],
                    value: '0',
                    fontSize: 11,
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_03.png',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [null, null, null],
                type: 'byrobot_dronefighter_controller_controller_buzzer_scale',
            },
            paramsKeyMap: {
                OCTAVE: 0,
                SCALE: 1,
            },
            class: 'byrobot_dronefighter_controller_buzzer',
            isNotFor: ['byrobot_dronefighter_controller'],
            func: function(sprite, script) {
                var octave = parseInt(script.getField('OCTAVE'));
                var scale = parseInt(script.getField('SCALE'));

                if (scale == -1)
                    return Entry.byrobot_dronefighter_controller.setBuzzerMute(
                        script,
                        60000,
                        false,
                        true
                    );
                else
                    return Entry.byrobot_dronefighter_controller.setBuzzerScale(
                        script,
                        octave,
                        scale,
                        60000,
                        false,
                        true
                    );
            },
        },
        byrobot_dronefighter_controller_controller_buzzer_scale_delay: {
            color: '#00979D',
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['4', '3'],
                        ['5', '4'],
                        ['6', '5'],
                        ['7', '6'],
                        ['8', '7'],
                    ],
                    value: '4',
                    fontSize: 11,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [
                            Lang.Blocks
                                .byrobot_dronefighter_controller_buzzer_mute,
                            '-1',
                        ],
                        [
                            Lang.Blocks
                                .byrobot_dronefighter_controller_buzzer_c,
                            '0',
                        ],
                        [
                            Lang.Blocks
                                .byrobot_dronefighter_controller_buzzer_cs,
                            '1',
                        ],
                        [
                            Lang.Blocks
                                .byrobot_dronefighter_controller_buzzer_d,
                            '2',
                        ],
                        [
                            Lang.Blocks
                                .byrobot_dronefighter_controller_buzzer_ds,
                            '3',
                        ],
                        [
                            Lang.Blocks
                                .byrobot_dronefighter_controller_buzzer_e,
                            '4',
                        ],
                        [
                            Lang.Blocks
                                .byrobot_dronefighter_controller_buzzer_f,
                            '5',
                        ],
                        [
                            Lang.Blocks
                                .byrobot_dronefighter_controller_buzzer_fs,
                            '6',
                        ],
                        [
                            Lang.Blocks
                                .byrobot_dronefighter_controller_buzzer_g,
                            '7',
                        ],
                        [
                            Lang.Blocks
                                .byrobot_dronefighter_controller_buzzer_gs,
                            '8',
                        ],
                        [
                            Lang.Blocks
                                .byrobot_dronefighter_controller_buzzer_a,
                            '9',
                        ],
                        [
                            Lang.Blocks
                                .byrobot_dronefighter_controller_buzzer_as,
                            '10',
                        ],
                        [
                            Lang.Blocks
                                .byrobot_dronefighter_controller_buzzer_b,
                            '11',
                        ],
                    ],
                    value: '0',
                    fontSize: 11,
                },
                {
                    type: 'Block',
                    accept: 'string',
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_03.png',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [
                    null,
                    null,
                    {
                        type: 'text',
                        params: ['1'],
                    },
                    null,
                ],
                type:
                    'byrobot_dronefighter_controller_controller_buzzer_scale_delay',
            },
            paramsKeyMap: {
                OCTAVE: 0,
                SCALE: 1,
                TIME: 2,
            },
            class: 'byrobot_dronefighter_controller_buzzer',
            isNotFor: ['byrobot_dronefighter_controller'],
            func: function(sprite, script) {
                var octave = parseInt(script.getField('OCTAVE'));
                var scale = parseInt(script.getField('SCALE'));
                var time = parseInt(script.getNumberValue('TIME') * 1000);

                if (scale == -1)
                    return Entry.byrobot_dronefighter_controller.setBuzzerMute(
                        script,
                        time,
                        true,
                        true
                    );
                else
                    return Entry.byrobot_dronefighter_controller.setBuzzerScale(
                        script,
                        octave,
                        scale,
                        time,
                        true,
                        true
                    );
            },
        },
        byrobot_dronefighter_controller_controller_buzzer_scale_reserve: {
            color: '#00979D',
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['4', '3'],
                        ['5', '4'],
                        ['6', '5'],
                        ['7', '6'],
                        ['8', '7'],
                    ],
                    value: '4',
                    fontSize: 11,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [
                            Lang.Blocks
                                .byrobot_dronefighter_controller_buzzer_mute,
                            '-1',
                        ],
                        [
                            Lang.Blocks
                                .byrobot_dronefighter_controller_buzzer_c,
                            '0',
                        ],
                        [
                            Lang.Blocks
                                .byrobot_dronefighter_controller_buzzer_cs,
                            '1',
                        ],
                        [
                            Lang.Blocks
                                .byrobot_dronefighter_controller_buzzer_d,
                            '2',
                        ],
                        [
                            Lang.Blocks
                                .byrobot_dronefighter_controller_buzzer_ds,
                            '3',
                        ],
                        [
                            Lang.Blocks
                                .byrobot_dronefighter_controller_buzzer_e,
                            '4',
                        ],
                        [
                            Lang.Blocks
                                .byrobot_dronefighter_controller_buzzer_f,
                            '5',
                        ],
                        [
                            Lang.Blocks
                                .byrobot_dronefighter_controller_buzzer_fs,
                            '6',
                        ],
                        [
                            Lang.Blocks
                                .byrobot_dronefighter_controller_buzzer_g,
                            '7',
                        ],
                        [
                            Lang.Blocks
                                .byrobot_dronefighter_controller_buzzer_gs,
                            '8',
                        ],
                        [
                            Lang.Blocks
                                .byrobot_dronefighter_controller_buzzer_a,
                            '9',
                        ],
                        [
                            Lang.Blocks
                                .byrobot_dronefighter_controller_buzzer_as,
                            '10',
                        ],
                        [
                            Lang.Blocks
                                .byrobot_dronefighter_controller_buzzer_b,
                            '11',
                        ],
                    ],
                    value: '0',
                    fontSize: 11,
                },
                {
                    type: 'Block',
                    accept: 'string',
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_03.png',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [
                    null,
                    null,
                    {
                        type: 'text',
                        params: ['1'],
                    },
                    null,
                ],
                type:
                    'byrobot_dronefighter_controller_controller_buzzer_scale_reserve',
            },
            paramsKeyMap: {
                OCTAVE: 0,
                SCALE: 1,
                TIME: 2,
            },
            class: 'byrobot_dronefighter_controller_buzzer',
            isNotFor: ['byrobot_dronefighter_controller'],
            func: function(sprite, script) {
                var octave = parseInt(script.getField('OCTAVE'));
                var scale = parseInt(script.getField('SCALE'));
                var time = parseInt(script.getNumberValue('TIME') * 1000);

                if (scale == -1)
                    return Entry.byrobot_dronefighter_controller.setBuzzerMute(
                        script,
                        time,
                        false,
                        false
                    );
                else
                    return Entry.byrobot_dronefighter_controller.setBuzzerScale(
                        script,
                        octave,
                        scale,
                        time,
                        false,
                        false
                    );
            },
        },
        byrobot_dronefighter_controller_controller_buzzer_hz: {
            color: '#00979D',
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_03.png',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'text',
                        params: ['1000'],
                    },
                    null,
                ],
                type: 'byrobot_dronefighter_controller_controller_buzzer_hz',
            },
            paramsKeyMap: {
                HZ: 0,
            },
            class: 'byrobot_dronefighter_controller_buzzer',
            isNotFor: ['byrobot_dronefighter_controller'],
            func: function(sprite, script) {
                var hz = parseInt(script.getNumberValue('HZ', script));
                return Entry.byrobot_dronefighter_controller.setBuzzerHz(
                    script,
                    hz,
                    60000,
                    false,
                    true
                );
            },
        },
        byrobot_dronefighter_controller_controller_buzzer_hz_delay: {
            color: '#00979D',
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
                    img: 'block_icon/hardware_03.png',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'text',
                        params: ['1000'],
                    },
                    {
                        type: 'text',
                        params: ['1'],
                    },
                    null,
                ],
                type:
                    'byrobot_dronefighter_controller_controller_buzzer_hz_delay',
            },
            paramsKeyMap: {
                HZ: 0,
                TIME: 1,
            },
            class: 'byrobot_dronefighter_controller_buzzer',
            isNotFor: ['byrobot_dronefighter_controller'],
            func: function(sprite, script) {
                var hz = parseInt(script.getNumberValue('HZ', script));
                var time = parseInt(script.getNumberValue('TIME') * 1000);
                return Entry.byrobot_dronefighter_controller.setBuzzerHz(
                    script,
                    hz,
                    time,
                    true,
                    true
                );
            },
        },
        byrobot_dronefighter_controller_controller_buzzer_hz_reserve: {
            color: '#00979D',
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
                    img: 'block_icon/hardware_03.png',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'text',
                        params: ['1000'],
                    },
                    {
                        type: 'text',
                        params: ['1'],
                    },
                    null,
                ],
                type:
                    'byrobot_dronefighter_controller_controller_buzzer_hz_reserve',
            },
            paramsKeyMap: {
                HZ: 0,
                TIME: 1,
            },
            class: 'byrobot_dronefighter_controller_buzzer',
            isNotFor: ['byrobot_dronefighter_controller'],
            func: function(sprite, script) {
                var hz = parseInt(script.getNumberValue('HZ', script));
                var time = parseInt(script.getNumberValue('TIME') * 1000);
                return Entry.byrobot_dronefighter_controller.setBuzzerHz(
                    script,
                    hz,
                    time,
                    false,
                    false
                );
            },
        },
        byrobot_dronefighter_controller_controller_vibrator_off: {
            color: '#00979D',
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_03.png',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'byrobot_dronefighter_controller_controller_vibrator_off',
            },
            paramsKeyMap: {},
            class: 'byrobot_dronefighter_controller_vibrator',
            isNotFor: ['byrobot_dronefighter_controller'],
            func: function(sprite, script) {
                return Entry.byrobot_dronefighter_controller.setVibratorStop(
                    script
                );
            },
        },
        byrobot_dronefighter_controller_controller_vibrator_on_delay: {
            color: '#00979D',
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_03.png',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'text',
                        params: ['1'],
                    },
                    null,
                ],
                type:
                    'byrobot_dronefighter_controller_controller_vibrator_on_delay',
            },
            paramsKeyMap: {
                TIMEON: 0,
            },
            class: 'byrobot_dronefighter_controller_vibrator',
            isNotFor: ['byrobot_dronefighter_controller'],
            func: function(sprite, script) {
                var timeOn = parseInt(script.getNumberValue('TIMEON') * 1000);
                return Entry.byrobot_dronefighter_controller.setVibrator(
                    script,
                    timeOn,
                    0,
                    timeOn,
                    true,
                    true
                );
            },
        },
        byrobot_dronefighter_controller_controller_vibrator_on_reserve: {
            color: '#00979D',
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_03.png',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'text',
                        params: ['1'],
                    },
                    null,
                ],
                type:
                    'byrobot_dronefighter_controller_controller_vibrator_on_reserve',
            },
            paramsKeyMap: {
                TIMEON: 0,
            },
            class: 'byrobot_dronefighter_controller_vibrator',
            isNotFor: ['byrobot_dronefighter_controller'],
            func: function(sprite, script) {
                var timeOn = parseInt(script.getNumberValue('TIMEON') * 1000);
                return Entry.byrobot_dronefighter_controller.setVibrator(
                    script,
                    timeOn,
                    0,
                    timeOn,
                    false,
                    false
                );
            },
        },
        byrobot_dronefighter_controller_controller_vibrator_delay: {
            color: '#00979D',
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
                    img: 'block_icon/hardware_03.png',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'text',
                        params: ['0.02'],
                    },
                    {
                        type: 'text',
                        params: ['0.2'],
                    },
                    {
                        type: 'text',
                        params: ['1'],
                    },
                    null,
                ],
                type:
                    'byrobot_dronefighter_controller_controller_vibrator_delay',
            },
            paramsKeyMap: {
                TIMEON: 0,
                TIMEOFF: 1,
                TIMERUN: 2,
            },
            class: 'byrobot_dronefighter_controller_vibrator',
            isNotFor: ['byrobot_dronefighter_controller'],
            func: function(sprite, script) {
                var timeOn = parseInt(script.getNumberValue('TIMEON') * 1000);
                var timeOff = parseInt(script.getNumberValue('TIMEOFF') * 1000);
                var timeRun = parseInt(script.getNumberValue('TIMERUN') * 1000);
                return Entry.byrobot_dronefighter_controller.setVibrator(
                    script,
                    timeOn,
                    timeOff,
                    timeRun,
                    true,
                    true
                );
            },
        },
        byrobot_dronefighter_controller_controller_vibrator_reserve: {
            color: '#00979D',
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
                    img: 'block_icon/hardware_03.png',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'text',
                        params: ['0.02'],
                    },
                    {
                        type: 'text',
                        params: ['0.2'],
                    },
                    {
                        type: 'text',
                        params: ['1'],
                    },
                    null,
                ],
                type:
                    'byrobot_dronefighter_controller_controller_vibrator_reserve',
            },
            paramsKeyMap: {
                TIMEON: 0,
                TIMEOFF: 1,
                TIMERUN: 2,
            },
            class: 'byrobot_dronefighter_controller_vibrator',
            isNotFor: ['byrobot_dronefighter_controller'],
            func: function(sprite, script) {
                var timeOn = parseInt(script.getNumberValue('TIMEON') * 1000);
                var timeOff = parseInt(script.getNumberValue('TIMEOFF') * 1000);
                var timeRun = parseInt(script.getNumberValue('TIMERUN') * 1000);
                return Entry.byrobot_dronefighter_controller.setVibrator(
                    script,
                    timeOn,
                    timeOff,
                    timeRun,
                    false,
                    false
                );
            },
        },
        byrobot_dronefighter_controller_controller_userinterface_preset: {
            color: '#00979D',
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [
                            Lang.Blocks
                                .byrobot_dronefighter_controller_userinterface_preset_clear,
                            '1',
                        ],
                        [
                            Lang.Blocks
                                .byrobot_dronefighter_controller_userinterface_preset_dronefighter2017,
                            '3',
                        ],
                        [
                            Lang.Blocks
                                .byrobot_dronefighter_controller_userinterface_preset_education,
                            '4',
                        ],
                    ],
                    value: '4',
                    fontSize: 11,
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_03.png',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [null, null],
                type:
                    'byrobot_dronefighter_controller_controller_userinterface_preset',
            },
            paramsKeyMap: {
                PRESET: 0,
            },
            class: 'byrobot_dronefighter_controller_userinterface',
            isNotFor: ['byrobot_dronefighter_controller'],
            func: function(sprite, script) {
                var preset = parseInt(script.getField('PRESET'));
                return Entry.byrobot_dronefighter_controller.sendCommand(
                    script,
                    0x11,
                    0x80,
                    preset
                );
            },
        },
        byrobot_dronefighter_controller_controller_userinterface: {
            color: '#00979D',
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [
                            Lang.Blocks
                                .byrobot_dronefighter_controller_userinterface_command_setup_button_frontleft_down,
                            '1',
                        ],
                        [
                            Lang.Blocks
                                .byrobot_dronefighter_controller_userinterface_command_setup_button_frontright_down,
                            '2',
                        ],
                        [
                            Lang.Blocks
                                .byrobot_dronefighter_controller_userinterface_command_setup_button_midturnleft_down,
                            '3',
                        ],
                        [
                            Lang.Blocks
                                .byrobot_dronefighter_controller_userinterface_command_setup_button_midturnright_down,
                            '4',
                        ],
                        [
                            Lang.Blocks
                                .byrobot_dronefighter_controller_userinterface_command_setup_button_midup_down,
                            '5',
                        ],
                        [
                            Lang.Blocks
                                .byrobot_dronefighter_controller_userinterface_command_setup_button_midleft_down,
                            '6',
                        ],
                        [
                            Lang.Blocks
                                .byrobot_dronefighter_controller_userinterface_command_setup_button_midright_down,
                            '7',
                        ],
                        [
                            Lang.Blocks
                                .byrobot_dronefighter_controller_userinterface_command_setup_button_middown_down,
                            '8',
                        ],
                        [
                            Lang.Blocks
                                .byrobot_dronefighter_controller_userinterface_command_setup_joystick_left_up_in,
                            '9',
                        ],
                        [
                            Lang.Blocks
                                .byrobot_dronefighter_controller_userinterface_command_setup_joystick_left_left_in,
                            '10',
                        ],
                        [
                            Lang.Blocks
                                .byrobot_dronefighter_controller_userinterface_command_setup_joystick_left_right_in,
                            '11',
                        ],
                        [
                            Lang.Blocks
                                .byrobot_dronefighter_controller_userinterface_command_setup_joystick_left_down_in,
                            '12',
                        ],
                        [
                            Lang.Blocks
                                .byrobot_dronefighter_controller_userinterface_command_setup_joystick_right_up_in,
                            '13',
                        ],
                        [
                            Lang.Blocks
                                .byrobot_dronefighter_controller_userinterface_command_setup_joystick_right_left_in,
                            '14',
                        ],
                        [
                            Lang.Blocks
                                .byrobot_dronefighter_controller_userinterface_command_setup_joystick_right_right_in,
                            '15',
                        ],
                        [
                            Lang.Blocks
                                .byrobot_dronefighter_controller_userinterface_command_setup_joystick_right_down_in,
                            '16',
                        ],
                    ],
                    value: '1',
                    fontSize: 11,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [
                            Lang.Blocks
                                .byrobot_dronefighter_controller_userinterface_function_joystickcalibration_reset,
                            '1',
                        ],
                        [
                            Lang.Blocks
                                .byrobot_dronefighter_controller_userinterface_function_change_team_red,
                            '2',
                        ],
                        [
                            Lang.Blocks
                                .byrobot_dronefighter_controller_userinterface_function_change_team_blue,
                            '3',
                        ],
                        [
                            Lang.Blocks
                                .byrobot_dronefighter_controller_userinterface_function_change_mode_vehicle_flight,
                            '4',
                        ],
                        [
                            Lang.Blocks
                                .byrobot_dronefighter_controller_userinterface_function_change_mode_vehicle_flightnoguard,
                            '5',
                        ],
                        [
                            Lang.Blocks
                                .byrobot_dronefighter_controller_userinterface_function_change_mode_vehicle_drive,
                            '6',
                        ],
                        [
                            Lang.Blocks
                                .byrobot_dronefighter_controller_userinterface_function_change_coordinate_local,
                            '7',
                        ],
                        [
                            Lang.Blocks
                                .byrobot_dronefighter_controller_userinterface_function_change_coordinate_world,
                            '8',
                        ],
                        [
                            Lang.Blocks
                                .byrobot_dronefighter_controller_userinterface_function_change_mode_control_mode1,
                            '9',
                        ],
                        [
                            Lang.Blocks
                                .byrobot_dronefighter_controller_userinterface_function_change_mode_control_mode2,
                            '10',
                        ],
                        [
                            Lang.Blocks
                                .byrobot_dronefighter_controller_userinterface_function_change_mode_control_mode3,
                            '11',
                        ],
                        [
                            Lang.Blocks
                                .byrobot_dronefighter_controller_userinterface_function_change_mode_control_mode4,
                            '12',
                        ],
                        [
                            Lang.Blocks
                                .byrobot_dronefighter_controller_userinterface_function_gyrobias_reset,
                            '13',
                        ],
                        [
                            Lang.Blocks
                                .byrobot_dronefighter_controller_userinterface_function_change_mode_usb_cdc,
                            '14',
                        ],
                        [
                            Lang.Blocks
                                .byrobot_dronefighter_controller_userinterface_function_change_mode_usb_hid,
                            '15',
                        ],
                    ],
                    value: '1',
                    fontSize: 11,
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_03.png',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [null, null, null],
                type:
                    'byrobot_dronefighter_controller_controller_userinterface',
            },
            paramsKeyMap: {
                COMMAND: 0,
                FUNCTION: 1,
            },
            class: 'byrobot_dronefighter_controller_userinterface',
            isNotFor: ['byrobot_dronefighter_controller'],
            func: function(sprite, script) {
                var uicommand = parseInt(script.getField('COMMAND'));
                var uifunction = parseInt(script.getField('FUNCTION'));
                return Entry.byrobot_dronefighter_controller.setUserInterface(
                    script,
                    uicommand,
                    uifunction
                );
            },
        },
        /* BYROBOT DroneFighter Controller End */
        //endregion byrobot 바이로봇
    };
};
