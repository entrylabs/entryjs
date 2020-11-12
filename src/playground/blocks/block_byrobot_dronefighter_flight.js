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

Entry.byrobot_dronefighter_flight = {
    name: 'byrobot_dronefighter_flight',
    url: 'http://www.byrobot.co.kr/',
    imageName: 'byrobot_dronefighter_flight.png',
    title: {
        "ko": "바이로봇 드론파이터 드론",
        "en": "BYROBOT Drone Fighter flight"
    },

    // 초기화
    setZero: function() {
        // 초기화

        // 한 번에 명령을 전송하면 hw까지 제대로 전달되지 않는 경우가 있어
        // 명령을 각각 분리하여 전송하게 함(2017.01.03)
        for (var i = 0; i < 1; i++) {
            this.transferCommand(0x10, 0x24, 0);
            this.transferVibrator(0, 0, 0, 0);
            this.transferbuzzer(0, 0, 0);
            this.transferLightManual(0x10, 0xff, 0);
            this.transferLightManual(0x11, 0xff, 0);
        }
    },

    // Entry 좌측 하단 하드웨어 모니터 화면에 표시하는 속성
    // listPorts와 ports 두 곳 동시에 동일한 속성을 표시할 수는 없음
    monitorTemplate: {
        imgPath: 'hw/byrobot_dronefighter_flight.png', // 배경 이미지
        width: 500, // 이미지의 폭
        height: 500, // 이미지의 높이

        // 모니터 화면 상단에 차례대로 나열하는 값
        listPorts: {
            state_modeVehicle: {
                name: Lang.Blocks.byrobot_dronefighter_drone_state_mode_vehicle,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            state_modeFlight: {
                name: Lang.Blocks.byrobot_dronefighter_drone_state_mode_flight,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            state_coordinate: {
                name:
                    Lang.Blocks
                        .byrobot_dronefighter_drone_state_mode_coordinate,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            state_battery: {
                name: Lang.Blocks.byrobot_dronefighter_drone_state_battery,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            attitude_roll: {
                name: Lang.Blocks.byrobot_dronefighter_drone_attitude_roll,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            attitude_pitch: {
                name: Lang.Blocks.byrobot_dronefighter_drone_attitude_pitch,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            attitude_yaw: {
                name: Lang.Blocks.byrobot_dronefighter_drone_attitude_yaw,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            irmessage_irdata: {
                name: Lang.Blocks.byrobot_dronefighter_drone_irmessage,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
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

    transferIrMessage: function(irmessage) {
        // 범위 조정
        irmessage = Math.max(irmessage, 0);
        irmessage = Math.min(irmessage, 127);

        // 전송
        Entry.hw.setDigitalPortValue('target', 0x10);
        Entry.hw.setDigitalPortValue('irmessage_data', irmessage);

        Entry.hw.update();

        delete Entry.hw.sendQueue['target'];
        delete Entry.hw.sendQueue['irmessage_data'];
    },

    transferMotorSingle: function(motorIndex, motorDirection, motorSpeed) {
        // 범위 조정
        motorSpeed = Math.max(motorSpeed, 0);
        motorSpeed = Math.min(motorSpeed, 4096);

        // 전송
        Entry.hw.setDigitalPortValue('target', 0x10);
        Entry.hw.setDigitalPortValue('motorsingle_target', motorIndex);
        Entry.hw.setDigitalPortValue('motorsingle_direction', motorDirection);
        Entry.hw.setDigitalPortValue('motorsingle_value', motorSpeed);

        Entry.hw.update();

        delete Entry.hw.sendQueue['target'];
        delete Entry.hw.sendQueue['motorsingle_target'];
        delete Entry.hw.sendQueue['motorsingle_direction'];
        delete Entry.hw.sendQueue['motorsingle_value'];
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

    transferControlDouble: function(wheel, accel) {
        // 범위 조정
        wheel = Math.max(wheel, -100);
        wheel = Math.min(wheel, 100);
        accel = Math.max(accel, 0);
        accel = Math.min(accel, 100);

        // 전송
        Entry.hw.setDigitalPortValue('target', 0x10);
        Entry.hw.setDigitalPortValue('control_wheel', wheel);
        Entry.hw.setDigitalPortValue('control_accel', accel);

        Entry.hw.update();

        delete Entry.hw.sendQueue['target'];
        delete Entry.hw.sendQueue['control_wheel'];
        delete Entry.hw.sendQueue['control_accel'];
    },

    transferControlQuad: function(roll, pitch, yaw, throttle) {
        // 범위 조정
        roll = Math.max(roll, -100);
        roll = Math.min(roll, 100);
        pitch = Math.max(pitch, -100);
        pitch = Math.min(pitch, 100);
        yaw = Math.max(yaw, -100);
        yaw = Math.min(yaw, 100);
        throttle = Math.max(throttle, -100);
        throttle = Math.min(throttle, 100);

        // 전송
        Entry.hw.setDigitalPortValue('target', 0x10);
        Entry.hw.setDigitalPortValue('control_roll', roll);
        Entry.hw.setDigitalPortValue('control_pitch', pitch);
        Entry.hw.setDigitalPortValue('control_yaw', yaw);
        Entry.hw.setDigitalPortValue('control_throttle', throttle);

        Entry.hw.update();

        delete Entry.hw.sendQueue['target'];
        delete Entry.hw.sendQueue['control_roll'];
        delete Entry.hw.sendQueue['control_pitch'];
        delete Entry.hw.sendQueue['control_yaw'];
        delete Entry.hw.sendQueue['control_throttle'];
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

    sendIrMessage: function(script, irmessage) {
        switch (this.checkFinish(script, 40)) {
            case 'Start':
                {
                    this.transferIrMessage(irmessage);
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

    sendStop: function(script) {
        return this.sendCommand(script, 0x10, 0x24, 0);
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

    setMotorSingle: function(script, motorIndex, motorDirection, motorSpeed) {
        switch (this.checkFinish(script, 40)) {
            case 'Start':
                {
                    this.transferMotorSingle(
                        motorIndex,
                        motorDirection,
                        motorSpeed
                    );
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
    /*
        None = 0,           ///< 없음
        
        Flight = 0x10,      ///< 비행(가드 포함)
        FlightNoGuard,      ///< 비행(가드 없음)
        FlightFPV,          ///< 비행(FPV)
        
        Drive = 0x20,       ///< 주행
        DriveFPV,           ///< 주행(FPV)
        
        Test = 0x30,        ///< 테스트
     */
    setModeVehicle: function(script, modeVehicle) {
        switch (this.checkFinish(script, 40)) {
            case 'Start':
                {
                    this.transferCommand(0x10, 0x10, modeVehicle);

                    this.transferControlQuad(0, 0, 0, 0);
                    this.transferControlDouble(0, 0);
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

    setEventFlight: function(script, eventFlight, time) {
        switch (this.checkFinish(script, time)) {
            case 'Start':
                {
                    this.transferCommand(0x10, 0x22, eventFlight); // 0x22 : CommandType::FlightEvent
                    this.transferControlQuad(0, 0, 0, 0);
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

    sendControlQuadSingle: function(
        script,
        controlTarget,
        value,
        time,
        flagDelay
    ) {
        var timeDelay = 40;
        if (flagDelay) timeDelay = time;

        switch (this.checkFinish(script, timeDelay)) {
            case 'Start':
                {
                    // 범위 조정
                    value = Math.max(value, -100);
                    value = Math.min(value, 100);

                    // 전송
                    Entry.hw.setDigitalPortValue('target', 0x10);
                    Entry.hw.setDigitalPortValue(controlTarget, value);

                    Entry.hw.update();

                    delete Entry.hw.sendQueue['target'];
                    delete Entry.hw.sendQueue[controlTarget];
                }
                return script;

            case 'Running':
                return script;

            case 'Finish':
                if (flagDelay) {
                    // 전송
                    Entry.hw.setDigitalPortValue('target', 0x10);
                    Entry.hw.setDigitalPortValue(controlTarget, 0);

                    Entry.hw.update();

                    delete Entry.hw.sendQueue['target'];
                    delete Entry.hw.sendQueue[controlTarget];
                }
                return script.callReturn();

            default:
                return script.callReturn();
        }
    },

    sendControlQuad: function(
        script,
        roll,
        pitch,
        yaw,
        throttle,
        time,
        flagDelay
    ) {
        var timeDelay = 40;
        if (flagDelay) timeDelay = time;

        switch (this.checkFinish(script, timeDelay)) {
            case 'Start':
                {
                    this.transferControlQuad(roll, pitch, yaw, throttle);
                }
                return script;

            case 'Running':
                return script;

            case 'Finish':
                if (flagDelay) {
                    this.transferControlQuad(0, 0, 0, 0);
                }
                return script.callReturn();

            default:
                return script.callReturn();
        }
    },
};

Entry.byrobot_dronefighter_flight.getBlocks = function() {
    return {
        //region byrobot 바이로봇
        /* BYROBOT DroneFighter Flight Start */
        byrobot_dronefighter_flight_drone_value_attitude: {
            color: '#00979D',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [
                            Lang.Blocks
                                .byrobot_dronefighter_drone_attitude_roll,
                            'attitude_roll',
                        ],
                        [
                            Lang.Blocks
                                .byrobot_dronefighter_drone_attitude_pitch,
                            'attitude_pitch',
                        ],
                        [
                            Lang.Blocks.byrobot_dronefighter_drone_attitude_yaw,
                            'attitude_yaw',
                        ],
                    ],
                    value: 'attitude_roll', // 초기 선택항목 지정
                    fontSize: 11,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'byrobot_dronefighter_flight_drone_value_attitude', // 언어 파일에서 읽어들일 템플릿. 객체 이름과 동일하게
            },
            paramsKeyMap: {
                DEVICE: 0,
            },
            class: 'byrobot_dronefighter_flight_monitor', // 같은 이름인 객체들이 그룹으로 형성됨
            isNotFor: ['byrobot_dronefighter_flight'],
            func: function(sprite, script) {
                return Entry.hw.portData[script.getField('DEVICE')];
            },
        },
        byrobot_dronefighter_flight_drone_value_etc: {
            color: '#00979D',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [
                            Lang.Blocks
                                .byrobot_dronefighter_drone_state_mode_vehicle,
                            'state_modeVehicle',
                        ],
                        [
                            Lang.Blocks
                                .byrobot_dronefighter_drone_state_mode_flight,
                            'state_modeFlight',
                        ],
                        [
                            Lang.Blocks
                                .byrobot_dronefighter_drone_state_mode_coordinate,
                            'state_coordinate',
                        ],
                        [
                            Lang.Blocks
                                .byrobot_dronefighter_drone_state_battery,
                            'state_battery',
                        ],
                        [
                            Lang.Blocks.byrobot_dronefighter_drone_irmessage,
                            'irmessage_irdata',
                        ],
                    ],
                    value: 'irmessage_irdata', // 초기 선택항목 지정
                    fontSize: 11,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'byrobot_dronefighter_flight_drone_value_etc', // 언어 파일에서 읽어들일 템플릿. 객체 이름과 동일하게
            },
            paramsKeyMap: {
                DEVICE: 0,
            },
            class: 'byrobot_dronefighter_flight_monitor', // 같은 이름인 객체들이 그룹으로 형성됨
            isNotFor: ['byrobot_dronefighter_flight'],
            func: function(sprite, script) {
                return Entry.hw.portData[script.getField('DEVICE')];
            },
        },
        byrobot_dronefighter_flight_controller_value_button: {
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
                type: 'byrobot_dronefighter_flight_controller_value_button', // 언어 파일에서 읽어들일 템플릿. 객체 이름과 동일하게
            },
            paramsKeyMap: {
                DEVICE: 0,
            },
            class: 'byrobot_dronefighter_flight_monitor', // 같은 이름인 객체들이 그룹으로 형성됨
            isNotFor: ['byrobot_dronefighter_flight'],
            func: function(sprite, script) {
                return Entry.hw.portData[script.getField('DEVICE')];
            },
        },
        byrobot_dronefighter_flight_controller_value_joystick: {
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
                type: 'byrobot_dronefighter_flight_controller_value_joystick', // 언어 파일에서 읽어들일 템플릿. 객체 이름과 동일하게
            },
            paramsKeyMap: {
                DEVICE: 0,
            },
            class: 'byrobot_dronefighter_flight_monitor', // 같은 이름인 객체들이 그룹으로 형성됨
            isNotFor: ['byrobot_dronefighter_flight'],
            func: function(sprite, script) {
                return Entry.hw.portData[script.getField('DEVICE')];
            },
        },
        byrobot_dronefighter_flight_controller_if_button_press: {
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
                type: 'byrobot_dronefighter_flight_controller_if_button_press',
            },
            paramsKeyMap: {
                BUTTON: 0,
            },
            class: 'byrobot_dronefighter_flight_boolean_input',
            isNotFor: ['byrobot_dronefighter_flight'],
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
            syntax: { js: [], py: [] },
        },
        byrobot_dronefighter_flight_controller_if_joystick_direction: {
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
                    'byrobot_dronefighter_flight_controller_if_joystick_direction',
            },
            paramsKeyMap: {
                DEVICE: 0,
                DIRECTION: 1,
            },
            class: 'byrobot_dronefighter_flight_boolean_input',
            isNotFor: ['byrobot_dronefighter_flight'],
            func: function(sprite, script) {
                var read = Entry.hw.portData;

                var device = script.getField('DEVICE'); // paramsKeyMap에 정의된 이름 사용

                if (read[device] == script.getField('DIRECTION')) return true;
                else return false;
            },
        },
        byrobot_dronefighter_flight_controller_light_manual_single_off: {
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
                    'byrobot_dronefighter_flight_controller_light_manual_single_off',
            },
            paramsKeyMap: {},
            class: 'byrobot_dronefighter_flight_controller_light',
            isNotFor: ['byrobot_dronefighter_flight'],
            func: function(sprite, script) {
                return Entry.byrobot_dronefighter_flight.setLightManual(
                    script,
                    0x11,
                    0xff,
                    0
                );
            },
        },
        byrobot_dronefighter_flight_controller_light_manual_single: {
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
                    'byrobot_dronefighter_flight_controller_light_manual_single',
            },
            paramsKeyMap: {
                FLAGS: 0,
                BRIGHTNESS: 1,
            },
            class: 'byrobot_dronefighter_flight_controller_light',
            isNotFor: ['byrobot_dronefighter_flight'],
            func: function(sprite, script) {
                var flags = parseInt(script.getField('FLAGS'));
                var brightness = parseInt(script.getField('BRIGHTNESS'));
                return Entry.byrobot_dronefighter_flight.setLightManual(
                    script,
                    0x11,
                    flags,
                    brightness
                );
            },
        },
        byrobot_dronefighter_flight_controller_light_manual_single_input: {
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
                    'byrobot_dronefighter_flight_controller_light_manual_single_input',
            },
            paramsKeyMap: {
                FLAGS: 0,
                BRIGHTNESS: 1,
            },
            class: 'byrobot_dronefighter_flight_controller_light',
            isNotFor: ['byrobot_dronefighter_flight'],
            func: function(sprite, script) {
                var flags = script.getNumberValue('FLAGS');
                var brightness = script.getNumberValue('BRIGHTNESS');
                return Entry.byrobot_dronefighter_flight.setLightManual(
                    script,
                    0x11,
                    flags,
                    brightness
                );
            },
        },
        byrobot_dronefighter_flight_drone_light_manual_single_off: {
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
                    'byrobot_dronefighter_flight_drone_light_manual_single_off',
            },
            paramsKeyMap: {},
            class: 'byrobot_dronefighter_flight_drone_light',
            isNotFor: ['byrobot_dronefighter_flight'],
            func: function(sprite, script) {
                return Entry.byrobot_dronefighter_flight.setLightManual(
                    script,
                    0x10,
                    0xff,
                    0
                );
            },
        },
        byrobot_dronefighter_flight_drone_light_manual_single: {
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
                                .byrobot_dronefighter_common_light_manual_blue,
                            '8',
                        ],
                        [
                            Lang.Blocks
                                .byrobot_dronefighter_common_light_manual_red,
                            '4',
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
                type: 'byrobot_dronefighter_flight_drone_light_manual_single',
            },
            paramsKeyMap: {
                FLAGS: 0,
                BRIGHTNESS: 1,
            },
            class: 'byrobot_dronefighter_flight_drone_light',
            isNotFor: ['byrobot_dronefighter_flight'],
            func: function(sprite, script) {
                var flags = parseInt(script.getField('FLAGS'));
                var brightness = parseInt(script.getField('BRIGHTNESS'));
                return Entry.byrobot_dronefighter_flight.setLightManual(
                    script,
                    0x10,
                    flags,
                    brightness
                );
            },
        },
        byrobot_dronefighter_flight_drone_light_manual_single_input: {
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
                    'byrobot_dronefighter_flight_drone_light_manual_single_input',
            },
            paramsKeyMap: {
                FLAGS: 0,
                BRIGHTNESS: 1,
            },
            class: 'byrobot_dronefighter_flight_drone_light',
            isNotFor: ['byrobot_dronefighter_flight'],
            func: function(sprite, script) {
                var flags = script.getNumberValue('FLAGS');
                var brightness = script.getNumberValue('BRIGHTNESS');
                return Entry.byrobot_dronefighter_flight.setLightManual(
                    script,
                    0x10,
                    flags,
                    brightness
                );
            },
        },
        byrobot_dronefighter_flight_controller_buzzer_off: {
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
                type: 'byrobot_dronefighter_flight_controller_buzzer_off',
            },
            paramsKeyMap: {},
            class: 'byrobot_dronefighter_flight_buzzer',
            isNotFor: ['byrobot_dronefighter_flight'],
            func: function(sprite, script) {
                return Entry.byrobot_dronefighter_flight.setBuzzerStop(script);
            },
        },
        byrobot_dronefighter_flight_controller_buzzer_scale: {
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
                type: 'byrobot_dronefighter_flight_controller_buzzer_scale',
            },
            paramsKeyMap: {
                OCTAVE: 0,
                SCALE: 1,
            },
            class: 'byrobot_dronefighter_flight_buzzer',
            isNotFor: ['byrobot_dronefighter_flight'],
            func: function(sprite, script) {
                var octave = parseInt(script.getField('OCTAVE'));
                var scale = parseInt(script.getField('SCALE'));

                if (scale == -1)
                    return Entry.byrobot_dronefighter_flight.setBuzzerMute(
                        script,
                        60000,
                        false,
                        true
                    );
                else
                    return Entry.byrobot_dronefighter_flight.setBuzzerScale(
                        script,
                        octave,
                        scale,
                        60000,
                        false,
                        true
                    );
            },
        },
        byrobot_dronefighter_flight_controller_buzzer_scale_delay: {
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
                    'byrobot_dronefighter_flight_controller_buzzer_scale_delay',
            },
            paramsKeyMap: {
                OCTAVE: 0,
                SCALE: 1,
                TIME: 2,
            },
            class: 'byrobot_dronefighter_flight_buzzer',
            isNotFor: ['byrobot_dronefighter_flight'],
            func: function(sprite, script) {
                var octave = parseInt(script.getField('OCTAVE'));
                var scale = parseInt(script.getField('SCALE'));
                var time = parseInt(script.getNumberValue('TIME') * 1000);

                if (scale == -1)
                    return Entry.byrobot_dronefighter_flight.setBuzzerMute(
                        script,
                        time,
                        true,
                        true
                    );
                else
                    return Entry.byrobot_dronefighter_flight.setBuzzerScale(
                        script,
                        octave,
                        scale,
                        time,
                        true,
                        true
                    );
            },
        },
        byrobot_dronefighter_flight_controller_buzzer_scale_reserve: {
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
                    'byrobot_dronefighter_flight_controller_buzzer_scale_reserve',
            },
            paramsKeyMap: {
                OCTAVE: 0,
                SCALE: 1,
                TIME: 2,
            },
            class: 'byrobot_dronefighter_flight_buzzer',
            isNotFor: ['byrobot_dronefighter_flight'],
            func: function(sprite, script) {
                var octave = parseInt(script.getField('OCTAVE'));
                var scale = parseInt(script.getField('SCALE'));
                var time = parseInt(script.getNumberValue('TIME') * 1000);

                if (scale == -1)
                    return Entry.byrobot_dronefighter_flight.setBuzzerMute(
                        script,
                        time,
                        false,
                        false
                    );
                else
                    return Entry.byrobot_dronefighter_flight.setBuzzerScale(
                        script,
                        octave,
                        scale,
                        time,
                        false,
                        false
                    );
            },
        },
        byrobot_dronefighter_flight_controller_buzzer_hz: {
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
                type: 'byrobot_dronefighter_flight_controller_buzzer_hz',
            },
            paramsKeyMap: {
                HZ: 0,
            },
            class: 'byrobot_dronefighter_flight_buzzer',
            isNotFor: ['byrobot_dronefighter_flight'],
            func: function(sprite, script) {
                var hz = parseInt(script.getNumberValue('HZ', script));
                return Entry.byrobot_dronefighter_flight.setBuzzerHz(
                    script,
                    hz,
                    60000,
                    false,
                    true
                );
            },
        },
        byrobot_dronefighter_flight_controller_buzzer_hz_delay: {
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
                type: 'byrobot_dronefighter_flight_controller_buzzer_hz_delay',
            },
            paramsKeyMap: {
                HZ: 0,
                TIME: 1,
            },
            class: 'byrobot_dronefighter_flight_buzzer',
            isNotFor: ['byrobot_dronefighter_flight'],
            func: function(sprite, script) {
                var hz = parseInt(script.getNumberValue('HZ', script));
                var time = parseInt(script.getNumberValue('TIME') * 1000);
                return Entry.byrobot_dronefighter_flight.setBuzzerHz(
                    script,
                    hz,
                    time,
                    true,
                    true
                );
            },
        },
        byrobot_dronefighter_flight_controller_buzzer_hz_reserve: {
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
                    'byrobot_dronefighter_flight_controller_buzzer_hz_reserve',
            },
            paramsKeyMap: {
                HZ: 0,
                TIME: 1,
            },
            class: 'byrobot_dronefighter_flight_buzzer',
            isNotFor: ['byrobot_dronefighter_flight'],
            func: function(sprite, script) {
                var hz = parseInt(script.getNumberValue('HZ', script));
                var time = parseInt(script.getNumberValue('TIME') * 1000);
                return Entry.byrobot_dronefighter_flight.setBuzzerHz(
                    script,
                    hz,
                    time,
                    false,
                    false
                );
            },
        },
        byrobot_dronefighter_flight_controller_vibrator_off: {
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
                type: 'byrobot_dronefighter_flight_controller_vibrator_off',
            },
            paramsKeyMap: {},
            class: 'byrobot_dronefighter_flight_vibrator',
            isNotFor: ['byrobot_dronefighter_flight'],
            func: function(sprite, script) {
                return Entry.byrobot_dronefighter_flight.setVibratorStop(
                    script
                );
            },
        },
        byrobot_dronefighter_flight_controller_vibrator_on_delay: {
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
                    'byrobot_dronefighter_flight_controller_vibrator_on_delay',
            },
            paramsKeyMap: {
                TIMEON: 0,
            },
            class: 'byrobot_dronefighter_flight_vibrator',
            isNotFor: ['byrobot_dronefighter_flight'],
            func: function(sprite, script) {
                var timeOn = parseInt(script.getNumberValue('TIMEON') * 1000);
                return Entry.byrobot_dronefighter_flight.setVibrator(
                    script,
                    timeOn,
                    0,
                    timeOn,
                    true,
                    true
                );
            },
        },
        byrobot_dronefighter_flight_controller_vibrator_on_reserve: {
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
                    'byrobot_dronefighter_flight_controller_vibrator_on_reserve',
            },
            paramsKeyMap: {
                TIMEON: 0,
            },
            class: 'byrobot_dronefighter_flight_vibrator',
            isNotFor: ['byrobot_dronefighter_flight'],
            func: function(sprite, script) {
                var timeOn = parseInt(script.getNumberValue('TIMEON') * 1000);
                return Entry.byrobot_dronefighter_flight.setVibrator(
                    script,
                    timeOn,
                    0,
                    timeOn,
                    false,
                    false
                );
            },
        },
        byrobot_dronefighter_flight_controller_vibrator_delay: {
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
                type: 'byrobot_dronefighter_flight_controller_vibrator_delay',
            },
            paramsKeyMap: {
                TIMEON: 0,
                TIMEOFF: 1,
                TIMERUN: 2,
            },
            class: 'byrobot_dronefighter_flight_vibrator',
            isNotFor: ['byrobot_dronefighter_flight'],
            func: function(sprite, script) {
                var timeOn = parseInt(script.getNumberValue('TIMEON') * 1000);
                var timeOff = parseInt(script.getNumberValue('TIMEOFF') * 1000);
                var timeRun = parseInt(script.getNumberValue('TIMERUN') * 1000);
                return Entry.byrobot_dronefighter_flight.setVibrator(
                    script,
                    timeOn,
                    timeOff,
                    timeRun,
                    true,
                    true
                );
            },
        },
        byrobot_dronefighter_flight_controller_vibrator_reserve: {
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
                type: 'byrobot_dronefighter_flight_controller_vibrator_reserve',
            },
            paramsKeyMap: {
                TIMEON: 0,
                TIMEOFF: 1,
                TIMERUN: 2,
            },
            class: 'byrobot_dronefighter_flight_vibrator',
            isNotFor: ['byrobot_dronefighter_flight'],
            func: function(sprite, script) {
                var timeOn = parseInt(script.getNumberValue('TIMEON') * 1000);
                var timeOff = parseInt(script.getNumberValue('TIMEOFF') * 1000);
                var timeRun = parseInt(script.getNumberValue('TIMERUN') * 1000);
                return Entry.byrobot_dronefighter_flight.setVibrator(
                    script,
                    timeOn,
                    timeOff,
                    timeRun,
                    false,
                    false
                );
            },
        },
        byrobot_dronefighter_flight_drone_irmessage: {
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
                        params: ['100'],
                    },
                    null,
                ],
                type: 'byrobot_dronefighter_flight_drone_irmessage',
            },
            paramsKeyMap: {
                IRMESSAGE: 0,
            },
            class: 'byrobot_dronefighter_flight_irmessage',
            isNotFor: ['byrobot_dronefighter_flight'],
            func: function(sprite, script) {
                var irmessage = script.getNumberValue('IRMESSAGE', script);
                return Entry.byrobot_dronefighter_flight.sendIrMessage(
                    script,
                    irmessage
                );
            },
        },
        byrobot_dronefighter_flight_drone_motor_stop: {
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
                type: 'byrobot_dronefighter_flight_drone_motor_stop',
            },
            paramsKeyMap: {},
            class: 'byrobot_dronefighter_flight_motor',
            isNotFor: ['byrobot_dronefighter_flight'],
            func: function(sprite, script) {
                return Entry.byrobot_dronefighter_flight.sendStop(script);
            },
        },
        byrobot_dronefighter_flight_drone_motorsingle: {
            color: '#00979D',
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [['1', '0'], ['2', '1'], ['3', '2'], ['4', '3']],
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
                    {
                        type: 'text',
                        params: ['1000'],
                    },
                    null,
                ],
                type: 'byrobot_dronefighter_flight_drone_motorsingle',
            },
            paramsKeyMap: {
                MOTORINDEX: 0,
                MOTORSPEED: 1,
            },
            class: 'byrobot_dronefighter_flight_motor',
            isNotFor: ['byrobot_dronefighter_flight'],
            func: function(sprite, script) {
                var motorIndex = parseInt(script.getField('MOTORINDEX'));
                var motorDirection = 1;
                var motorSpeed = parseInt(
                    script.getNumberValue('MOTORSPEED', script)
                );

                return Entry.byrobot_dronefighter_flight.setMotorSingle(
                    script,
                    motorIndex,
                    motorDirection,
                    motorSpeed
                );
            },
        },
        byrobot_dronefighter_flight_drone_motorsingle_input: {
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
                        params: ['1'],
                    },
                    {
                        type: 'text',
                        params: ['1000'],
                    },
                    null,
                ],
                type: 'byrobot_dronefighter_flight_drone_motorsingle_input',
            },
            paramsKeyMap: {
                MOTORINDEX: 0,
                MOTORSPEED: 1,
            },
            class: 'byrobot_dronefighter_flight_motor',
            isNotFor: ['byrobot_dronefighter_flight'],
            func: function(sprite, script) {
                var motorIndex =
                    parseInt(script.getNumberValue('MOTORINDEX', script)) - 1;
                var motorDirection = 1;
                var motorSpeed = parseInt(
                    script.getNumberValue('MOTORSPEED', script)
                );

                return Entry.byrobot_dronefighter_flight.setMotorSingle(
                    script,
                    motorIndex,
                    motorDirection,
                    motorSpeed
                );
            },
        },
        byrobot_dronefighter_flight_drone_command_mode_vehicle_drone: {
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
                    'byrobot_dronefighter_flight_drone_command_mode_vehicle_drone',
            },
            paramsKeyMap: {},
            class: 'byrobot_dronefighter_flight_control_flight',
            isNotFor: ['byrobot_dronefighter_flight'],
            func: function(sprite, script) {
                return Entry.byrobot_dronefighter_flight.setModeVehicle(
                    script,
                    0x10
                ); // 0x10 : Mode::Vehicle::Flight
            },
        },
        byrobot_dronefighter_flight_drone_control_drone_takeoff: {
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
                type: 'byrobot_dronefighter_flight_drone_control_drone_takeoff',
            },
            paramsKeyMap: {},
            class: 'byrobot_dronefighter_flight_control_flight',
            isNotFor: ['byrobot_dronefighter_flight'],
            func: function(sprite, script) {
                return Entry.byrobot_dronefighter_flight.setEventFlight(
                    script,
                    0x11,
                    200
                ); // 0x11 : FlightEvent::TakeOff
            },
        },
        byrobot_dronefighter_flight_drone_control_drone_landing: {
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
                type: 'byrobot_dronefighter_flight_drone_control_drone_landing',
            },
            paramsKeyMap: {},
            class: 'byrobot_dronefighter_flight_control_flight',
            isNotFor: ['byrobot_dronefighter_flight'],
            func: function(sprite, script) {
                return Entry.byrobot_dronefighter_flight.setEventFlight(
                    script,
                    0x12,
                    200
                ); // 0x12 : FlightEvent::Landing
            },
        },
        byrobot_dronefighter_flight_drone_control_drone_stop: {
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
                type: 'byrobot_dronefighter_flight_drone_control_drone_stop',
            },
            paramsKeyMap: {},
            class: 'byrobot_dronefighter_flight_control_flight',
            isNotFor: ['byrobot_dronefighter_flight'],
            func: function(sprite, script) {
                return Entry.byrobot_dronefighter_flight.sendStop(script);
            },
        },
        byrobot_dronefighter_flight_drone_control_coordinate: {
            color: '#00979D',
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [
                            Lang.Blocks
                                .byrobot_dronefighter_drone_coordinate_world,
                            '1',
                        ],
                        [
                            Lang.Blocks
                                .byrobot_dronefighter_drone_coordinate_local,
                            '2',
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
                params: [null, null],
                type: 'byrobot_dronefighter_flight_drone_control_coordinate',
            },
            paramsKeyMap: {
                COORDINATE: 0,
            },
            class: 'byrobot_dronefighter_flight_control_flight',
            isNotFor: ['byrobot_dronefighter_flight'],
            func: function(sprite, script) {
                var coordinate = script.getField('COORDINATE');
                return Entry.byrobot_dronefighter_flight.sendCommand(
                    script,
                    0x10,
                    0x20,
                    coordinate
                );
            },
        },
        byrobot_dronefighter_flight_drone_control_drone_reset_heading: {
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
                    'byrobot_dronefighter_flight_drone_control_drone_reset_heading',
            },
            paramsKeyMap: {},
            class: 'byrobot_dronefighter_flight_control_flight',
            isNotFor: ['byrobot_dronefighter_flight'],
            func: function(sprite, script) {
                return Entry.byrobot_dronefighter_flight.sendCommand(
                    script,
                    0x10,
                    0x22,
                    0xa0
                ); // 0x22 : CommandType::FlightEvent  // 0xA0 : FlightEvent::ResetHeading
            },
        },
        byrobot_dronefighter_flight_drone_control_quad_one: {
            color: '#00979D',
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [
                            Lang.Blocks
                                .byrobot_dronefighter_drone_control_quad_roll,
                            'control_roll',
                        ],
                        [
                            Lang.Blocks
                                .byrobot_dronefighter_drone_control_quad_pitch,
                            'control_pitch',
                        ],
                        [
                            Lang.Blocks
                                .byrobot_dronefighter_drone_control_quad_yaw,
                            'control_yaw',
                        ],
                        [
                            Lang.Blocks
                                .byrobot_dronefighter_drone_control_quad_throttle,
                            'control_throttle',
                        ],
                    ],
                    value: 'control_throttle',
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
                    {
                        type: 'number',
                        params: ['0'],
                    },
                    null,
                ],
                type: 'byrobot_dronefighter_flight_drone_control_quad_one',
            },
            paramsKeyMap: {
                CONTROLTARGET: 0,
                VALUE: 1,
            },
            class: 'byrobot_dronefighter_flight_control_flight',
            isNotFor: ['byrobot_dronefighter_flight'],
            func: function(sprite, script) {
                var controlTarget = script.getField('CONTROLTARGET');
                var value = parseInt(script.getNumberValue('VALUE', script));

                return Entry.byrobot_dronefighter_flight.sendControlQuadSingle(
                    script,
                    controlTarget,
                    value,
                    0,
                    false
                );
            },
        },
        byrobot_dronefighter_flight_drone_control_quad_one_delay: {
            color: '#00979D',
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [
                            Lang.Blocks
                                .byrobot_dronefighter_drone_control_quad_roll,
                            'control_roll',
                        ],
                        [
                            Lang.Blocks
                                .byrobot_dronefighter_drone_control_quad_pitch,
                            'control_pitch',
                        ],
                        [
                            Lang.Blocks
                                .byrobot_dronefighter_drone_control_quad_yaw,
                            'control_yaw',
                        ],
                        [
                            Lang.Blocks
                                .byrobot_dronefighter_drone_control_quad_throttle,
                            'control_throttle',
                        ],
                    ],
                    value: 'control_throttle',
                    fontSize: 11,
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
                    null,
                    {
                        type: 'number',
                        params: ['100'],
                    },
                    {
                        type: 'number',
                        params: ['1'],
                    },
                    null,
                ],
                type:
                    'byrobot_dronefighter_flight_drone_control_quad_one_delay',
            },
            paramsKeyMap: {
                CONTROLTARGET: 0,
                VALUE: 1,
                TIME: 2,
            },
            class: 'byrobot_dronefighter_flight_control_flight',
            isNotFor: ['byrobot_dronefighter_flight'],
            func: function(sprite, script) {
                var controlTarget = script.getField('CONTROLTARGET');
                var value = parseInt(script.getNumberValue('VALUE', script));
                var time = parseInt(
                    script.getNumberValue('TIME', script) * 1000
                );

                return Entry.byrobot_dronefighter_flight.sendControlQuadSingle(
                    script,
                    controlTarget,
                    value,
                    time,
                    true
                );
            },
        },
        byrobot_dronefighter_flight_drone_control_quad: {
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
                        type: 'number',
                        params: ['0'],
                    },
                    {
                        type: 'number',
                        params: ['0'],
                    },
                    {
                        type: 'number',
                        params: ['0'],
                    },
                    {
                        type: 'number',
                        params: ['0'],
                    },
                    null,
                ],
                type: 'byrobot_dronefighter_flight_drone_control_quad',
            },
            paramsKeyMap: {
                ROLL: 0,
                PITCH: 1,
                YAW: 2,
                THROTTLE: 3,
            },
            class: 'byrobot_dronefighter_flight_control_flight',
            isNotFor: ['byrobot_dronefighter_flight'],
            func: function(sprite, script) {
                var roll = parseInt(script.getNumberValue('ROLL', script));
                var pitch = parseInt(script.getNumberValue('PITCH', script));
                var yaw = parseInt(script.getNumberValue('YAW', script));
                var throttle = parseInt(
                    script.getNumberValue('THROTTLE', script)
                );

                return Entry.byrobot_dronefighter_flight.sendControlQuad(
                    script,
                    roll,
                    pitch,
                    yaw,
                    throttle,
                    0,
                    false
                );
            },
        },
        /* BYROBOT DroneFighter Flight End */
        //endregion byrobot 바이로봇
    };
};
