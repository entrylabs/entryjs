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
    id: 'F.3',
    name: 'byrobot_dronefighter_flight',
    url: 'http://www.byrobot.co.kr/',
    imageName: 'byrobot_dronefighter_flight.png',
    title: {
        ko: '바이로봇 드론파이터 드론',
        en: 'BYROBOT Drone Fighter flight',
    },

    // 초기화
    setZero: function() {
        // 초기화

        // 한 번에 명령을 전송하면 hw까지 제대로 전달되지 않는 경우가 있어
        // 명령을 각각 분리하여 전송하게 함(2017.01.03)
        for (var i = 0; i < 1; i++) {
            this.transferCommand(0x10, 0x24, 0);
            this.transferVibrator(0, 0, 0, 0);
            this.transferBuzzer(0, 0, 0);
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
            state_modeVehicle:              {name: 'Vehicle Mode',              type: 'input',  pos: { x: 0, y: 0 }},
            state_modeFlight:               {name: 'Flight Mode',               type: 'input',  pos: { x: 0, y: 0 },},
            state_coordinate:               {name: 'Headless',                  type: 'input',  pos: { x: 0, y: 0 },},
            state_modeDrive:                {name: 'Drive Mode',                type: 'input',  pos: { x: 0, y: 0 }},
            state_battery:                  {name: 'Battery',                   type: 'input',  pos: { x: 0, y: 0 }},
            attitude_roll:                  {name: 'Roll',                      type: 'input',  pos: { x: 0, y: 0 }},
            attitude_pitch:                 {name: 'Pitch',                     type: 'input',  pos: { x: 0, y: 0 }},
            attitude_yaw:                   {name: 'Yaw',                       type: 'input',  pos: { x: 0, y: 0 }},
            irmessage_irdata:               {name: 'IR Data',                   type: 'input',  pos: { x: 0, y: 0 }},
            joystick_left_x:                {name: 'Left Joystick X',           type: 'input',  pos: { x: 0, y: 0 }},
            joystick_left_y:                {name: 'Left Joystick Y',           type: 'input',  pos: { x: 0, y: 0 }},
            joystick_left_direction:        {name: 'Left Joystick Direction',   type: 'input',  pos: { x: 0, y: 0 }},
            joystick_left_event:            {name: 'Left Joystick Event',       type: 'input',  pos: { x: 0, y: 0 }},
            joystick_left_command:          {name: 'Left Joystick Command',     type: 'input',  pos: { x: 0, y: 0 }},
            joystick_right_x:               {name: 'Right Joystick X',          type: 'input',  pos: { x: 0, y: 0 }},
            joystick_right_y:               {name: 'Right Joystick Y',          type: 'input',  pos: { x: 0, y: 0 }},
            joystick_right_direction:       {name: 'Right Joystick Direction',  type: 'input',  pos: { x: 0, y: 0 }},
            joystick_right_event:           {name: 'Right Joystick Event',      type: 'input',  pos: { x: 0, y: 0 }},
            joystick_right_command:         {name: 'Right Joystick Command',    type: 'input',  pos: { x: 0, y: 0 }},
            button_button:                  {name: 'Button',                    type: 'input',  pos: { x: 0, y: 0 }},
            button_event:                   {name: 'Button Event',              type: 'input',  pos: { x: 0, y: 0 }},
            entryhw_countTransferReserved:  {name: 'Transfer Buffer',           type: 'output', pos: { x: 0, y: 0 }},
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

    transferBuzzer: function(mode, value, time) {
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
                    this.transferBuzzer(0, 0, 0);
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

                    this.transferBuzzer(mode, 0xee, time);
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

    setBuzzerScale: function(script, octave, scale, time, flagDelay, flagInstantly) {
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

                    this.transferBuzzer(mode, scalecalc, time);
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

                    this.transferBuzzer(mode, hz, time);
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

    setVibrator: function(script, timeOn, timeOff, timeRun, flagDelay, flagInstantly) {
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
                    this.transferMotorSingle(motorIndex, motorDirection, motorSpeed);
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

    sendControlQuadSingle: function(script, controlTarget, value, time, flagDelay) {
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

    sendControlQuad: function(script, roll, pitch, yaw, throttle, time, flagDelay) {
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


/***************************************************************************************
 *  언어 적용
 ***************************************************************************************/
// 
Entry.byrobot_dronefighter_flight.setLanguage = function ()
{
    return {
        ko: {
            // ko.js에 작성하던 내용
            Blocks: {
                "byrobot_dronefighter_drone_state_mode_system": "시스템 모드",
                "byrobot_dronefighter_drone_state_mode_vehicle": "드론파이터 모드",
                "byrobot_dronefighter_drone_state_mode_flight": "비행 모드",
                "byrobot_dronefighter_drone_state_mode_drive": "자동차 모드",
                "byrobot_dronefighter_drone_state_mode_coordinate": "기본 좌표계",
                "byrobot_dronefighter_drone_state_battery": "배터리",
                "byrobot_dronefighter_drone_attitude_roll": "자세 Roll",
                "byrobot_dronefighter_drone_attitude_pitch": "자세 Pitch",
                "byrobot_dronefighter_drone_attitude_yaw": "자세 Yaw",
                "byrobot_dronefighter_drone_irmessage": "적외선 수신 값",
                "byrobot_dronefighter_controller_joystick_left_x": "왼쪽 조이스틱 가로축",
                "byrobot_dronefighter_controller_joystick_left_y": "왼쪽 조이스틱 세로축",
                "byrobot_dronefighter_controller_joystick_left_direction": "왼쪽 조이스틱 방향",
                "byrobot_dronefighter_controller_joystick_left_event": "왼쪽 조이스틱 이벤트",
                "byrobot_dronefighter_controller_joystick_left_command": "왼쪽 조이스틱 명령",
                "byrobot_dronefighter_controller_joystick_right_x": "오른쪽 조이스틱 가로축",
                "byrobot_dronefighter_controller_joystick_right_y": "오른쪽 조이스틱 세로축",
                "byrobot_dronefighter_controller_joystick_right_direction": "오른쪽 조이스틱 방향",
                "byrobot_dronefighter_controller_joystick_right_event": "오른쪽 조이스틱 이벤트",
                "byrobot_dronefighter_controller_joystick_right_command": "오른쪽 조이스틱 명령",
                "byrobot_dronefighter_controller_joystick_direction_left_up": "왼쪽 위",
                "byrobot_dronefighter_controller_joystick_direction_up": "위",
                "byrobot_dronefighter_controller_joystick_direction_right_up": "오른쪽 위",
                "byrobot_dronefighter_controller_joystick_direction_left": "왼쪽",
                "byrobot_dronefighter_controller_joystick_direction_center": "중앙",
                "byrobot_dronefighter_controller_joystick_direction_right": "오른쪽",
                "byrobot_dronefighter_controller_joystick_direction_left_down": "왼쪽 아래",
                "byrobot_dronefighter_controller_joystick_direction_down": "아래",
                "byrobot_dronefighter_controller_joystick_direction_right_down": "오른쪽 아래",
                "byrobot_dronefighter_controller_button_button": "버튼",
                "byrobot_dronefighter_controller_button_event": "버튼 이벤트",
                "byrobot_dronefighter_controller_button_front_left": "왼쪽 빨간 버튼",
                "byrobot_dronefighter_controller_button_front_right": "오른쪽 빨간 버튼",
                "byrobot_dronefighter_controller_button_front_left_right": "양쪽 빨간 버튼",
                "byrobot_dronefighter_controller_button_center_up_left": "트림 좌회전 버튼",
                "byrobot_dronefighter_controller_button_center_up_right": "트림 우회전 버튼",
                "byrobot_dronefighter_controller_button_center_up": "트림 앞 버튼",
                "byrobot_dronefighter_controller_button_center_left": "트림 왼쪽 버튼",
                "byrobot_dronefighter_controller_button_center_right": "트림 오른쪽 버튼",
                "byrobot_dronefighter_controller_button_center_down": "트림 뒤 버튼",
                "byrobot_dronefighter_controller_button_bottom_left": "왼쪽 둥근 버튼",
                "byrobot_dronefighter_controller_button_bottom_right": "오른쪽 둥근 버튼",
                "byrobot_dronefighter_controller_button_bottom_left_right": "양쪽 둥근 버튼",
                "byrobot_dronefighter_entryhw_count_transfer_reserved": "전송 예약된 데이터 수",
                "byrobot_dronefighter_common_roll": "Roll",
                "byrobot_dronefighter_common_pitch": "Pitch",
                "byrobot_dronefighter_common_yaw": "Yaw",
                "byrobot_dronefighter_common_throttle": "Throttle",
                "byrobot_dronefighter_common_left": "왼쪽",
                "byrobot_dronefighter_common_right": "오른쪽",
                "byrobot_dronefighter_common_light_manual_on": "켜기",
                "byrobot_dronefighter_common_light_manual_off": "끄기",
                "byrobot_dronefighter_common_light_manual_b25": "밝기 25%",
                "byrobot_dronefighter_common_light_manual_b50": "밝기 50%",
                "byrobot_dronefighter_common_light_manual_b75": "밝기 75%",
                "byrobot_dronefighter_common_light_manual_b100": "밝기 100%",
                "byrobot_dronefighter_common_light_manual_all": "전체",
                "byrobot_dronefighter_common_light_manual_red": "빨강",
                "byrobot_dronefighter_common_light_manual_blue": "파랑",
                "byrobot_dronefighter_common_light_manual_1": "1",
                "byrobot_dronefighter_common_light_manual_2": "2",
                "byrobot_dronefighter_common_light_manual_3": "3",
                "byrobot_dronefighter_common_light_manual_4": "4",
                "byrobot_dronefighter_common_light_manual_5": "5",
                "byrobot_dronefighter_common_light_manual_6": "6",
                "byrobot_dronefighter_controller_buzzer": "버저",
                "byrobot_dronefighter_controller_buzzer_mute": "쉼",
                "byrobot_dronefighter_controller_buzzer_c": "도",
                "byrobot_dronefighter_controller_buzzer_cs": "도#",
                "byrobot_dronefighter_controller_buzzer_d": "레",
                "byrobot_dronefighter_controller_buzzer_ds": "레#",
                "byrobot_dronefighter_controller_buzzer_e": "미",
                "byrobot_dronefighter_controller_buzzer_f": "파",
                "byrobot_dronefighter_controller_buzzer_fs": "파#",
                "byrobot_dronefighter_controller_buzzer_g": "솔",
                "byrobot_dronefighter_controller_buzzer_gs": "솔#",
                "byrobot_dronefighter_controller_buzzer_a": "라",
                "byrobot_dronefighter_controller_buzzer_as": "라#",
                "byrobot_dronefighter_controller_buzzer_b": "시",
                "byrobot_dronefighter_controller_userinterface_preset_clear": "모두 지우기",
                "byrobot_dronefighter_controller_userinterface_preset_dronefighter2017": "기본",
                "byrobot_dronefighter_controller_userinterface_preset_education": "교육용",
                "byrobot_dronefighter_controller_userinterface_command_setup_button_frontleft_down": "왼쪽 빨간 버튼을 눌렀을 때",
                "byrobot_dronefighter_controller_userinterface_command_setup_button_frontright_down": "오른쪽 빨간 버튼을 눌렀을 때",
                "byrobot_dronefighter_controller_userinterface_command_setup_button_midturnleft_down": "트림 좌회전 버튼을 눌렀을 때",
                "byrobot_dronefighter_controller_userinterface_command_setup_button_midturnright_down": "트림 우회전 버튼을 눌렀을 때",
                "byrobot_dronefighter_controller_userinterface_command_setup_button_midup_down": "트림 앞 버튼을 눌렀을 때",
                "byrobot_dronefighter_controller_userinterface_command_setup_button_midleft_down": "트림 왼쪽 버튼을 눌렀을 때",
                "byrobot_dronefighter_controller_userinterface_command_setup_button_midright_down": "트림 오른쪽 버튼을 눌렀을 때",
                "byrobot_dronefighter_controller_userinterface_command_setup_button_middown_down": "트림 뒤 버튼을 눌렀을 때",
                "byrobot_dronefighter_controller_userinterface_command_setup_joystick_left_up_in": "왼쪽 조이스틱을 위로 움직였을 때",
                "byrobot_dronefighter_controller_userinterface_command_setup_joystick_left_left_in": "왼쪽 조이스틱을 왼쪽으로 움직였을 때",
                "byrobot_dronefighter_controller_userinterface_command_setup_joystick_left_right_in": "왼쪽 조이스틱을 오른쪽으로 움직였을 때",
                "byrobot_dronefighter_controller_userinterface_command_setup_joystick_left_down_in": "왼쪽 조이스틱을 아래로 움직였을 때",
                "byrobot_dronefighter_controller_userinterface_command_setup_joystick_right_up_in": "오른쪽 조이스틱을 위로 움직였을 때",
                "byrobot_dronefighter_controller_userinterface_command_setup_joystick_right_left_in": "오른쪽 조이스틱을 왼쪽으로 움직였을 때",
                "byrobot_dronefighter_controller_userinterface_command_setup_joystick_right_right_in": "오른쪽 조이스틱을 오른쪽으로 움직였을 때",
                "byrobot_dronefighter_controller_userinterface_command_setup_joystick_right_down_in": "오른쪽 조이스틱을 아래로 움직였을 때",
                "byrobot_dronefighter_controller_userinterface_function_joystickcalibration_reset": "조이스틱 보정 초기화",
                "byrobot_dronefighter_controller_userinterface_function_change_team_red": "팀 - 레드",
                "byrobot_dronefighter_controller_userinterface_function_change_team_blue": "팀 - 블루",
                "byrobot_dronefighter_controller_userinterface_function_change_mode_vehicle_flight": "드론",
                "byrobot_dronefighter_controller_userinterface_function_change_mode_vehicle_flightnoguard": "드론 - 가드 없음",
                "byrobot_dronefighter_controller_userinterface_function_change_mode_vehicle_drive": "자동차",
                "byrobot_dronefighter_controller_userinterface_function_change_coordinate_local": "방위 - 일반",
                "byrobot_dronefighter_controller_userinterface_function_change_coordinate_world": "방위 - 앱솔루트",
                "byrobot_dronefighter_controller_userinterface_function_change_mode_control_mode1": "조종 - MODE 1",
                "byrobot_dronefighter_controller_userinterface_function_change_mode_control_mode2": "조종 - MODE 2",
                "byrobot_dronefighter_controller_userinterface_function_change_mode_control_mode3": "조종 - MODE 3",
                "byrobot_dronefighter_controller_userinterface_function_change_mode_control_mode4": "조종 - MODE 4",
                "byrobot_dronefighter_controller_userinterface_function_gyrobias_reset": "자이로 바이어스 리셋",
                "byrobot_dronefighter_controller_userinterface_function_change_mode_usb_cdc": "USB 시리얼 통신 장치",
                "byrobot_dronefighter_controller_userinterface_function_change_mode_usb_hid": "USB 게임 컨트롤러",
                "byrobot_dronefighter_drone_team": "팀 ",
                "byrobot_dronefighter_drone_team_red": "레드",
                "byrobot_dronefighter_drone_team_blue": "블루",
                "byrobot_dronefighter_drone_coordinate_world": "앱솔루트",
                "byrobot_dronefighter_drone_coordinate_local": "일반",
                "byrobot_dronefighter_drone_mode_vehicle_flight": "드론",
                "byrobot_dronefighter_drone_mode_vehicle_drive": "자동차",
                "byrobot_dronefighter_drone_control_double_wheel": "방향",
                "byrobot_dronefighter_drone_control_double_wheel_left": "왼쪽 회전",
                "byrobot_dronefighter_drone_control_double_wheel_right": "오른쪽 회전",
                "byrobot_dronefighter_drone_control_double_accel_forward": "전진",
                "byrobot_dronefighter_drone_control_double_accel_backward": "후진",
                "byrobot_dronefighter_drone_control_quad_roll": "Roll",
                "byrobot_dronefighter_drone_control_quad_pitch": "Pitch",
                "byrobot_dronefighter_drone_control_quad_yaw": "Yaw",
                "byrobot_dronefighter_drone_control_quad_throttle": "Throttle",
                "byrobot_dronefighter_drone_control_quad_roll_left": "왼쪽",
                "byrobot_dronefighter_drone_control_quad_roll_right": "오른쪽",
                "byrobot_dronefighter_drone_control_quad_pitch_forward": "앞으로",
                "byrobot_dronefighter_drone_control_quad_pitch_backward": "뒤로",
                "byrobot_dronefighter_drone_control_quad_yaw_left": "왼쪽 회전",
                "byrobot_dronefighter_drone_control_quad_yaw_right": "오른쪽 회전",
                "byrobot_dronefighter_drone_control_quad_throttle_up": "위",
                "byrobot_dronefighter_drone_control_quad_throttle_down": "아래",
            },

            // ko.js에 작성하던 내용
            template: {
                "byrobot_dronefighter_flight_drone_value_attitude": "%1",
                "byrobot_dronefighter_flight_drone_value_etc": "%1",
                "byrobot_dronefighter_flight_controller_value_button": "%1",
                "byrobot_dronefighter_flight_controller_value_joystick": "%1",
                "byrobot_dronefighter_flight_controller_if_button_press": "조종기 %1 눌렀을 때",
                "byrobot_dronefighter_flight_controller_if_joystick_direction": "조종기 %1 조이스틱 %2 움직였을 때",
                "byrobot_dronefighter_flight_drone_control_drone_stop": "드론 정지 %1",
                "byrobot_dronefighter_flight_drone_control_coordinate": "드론 좌표 기준을 %1로 정하기 %2",
                "byrobot_dronefighter_flight_drone_control_drone_reset_heading": "드론 방향 초기화 %1",
                "byrobot_dronefighter_flight_drone_control_quad_one": "드론 %1 %2% 정하기 %3",
                "byrobot_dronefighter_flight_drone_control_quad_one_delay": "드론 %1 %2% %3 초 실행 %4",
                "byrobot_dronefighter_flight_drone_control_quad": "드론 Roll %1%, Pitch %2%, Yaw %3%, Throttle %4% 정하기 %5",
                "byrobot_dronefighter_flight_drone_motor_stop": "모터 정지 %1",
                "byrobot_dronefighter_flight_drone_motorsingle": "%1 번 모터를 %2 (으)로 회전 %3",
                "byrobot_dronefighter_flight_drone_motorsingle_input": "%1 번 모터를 %2 (으)로 회전 %3",
                "byrobot_dronefighter_flight_drone_irmessage": "적외선으로 %1 값 보내기 %2",
                "byrobot_dronefighter_flight_controller_light_manual_single_off": "조종기 LED 끄기 %1",
                "byrobot_dronefighter_flight_controller_light_manual_single": "조종기 LED %1 %2 %3",
                "byrobot_dronefighter_flight_controller_light_manual_single_input": "조종기 LED %1 밝기 %2 %3",
                "byrobot_dronefighter_flight_drone_light_manual_single_off": "드론 LED 끄기 %1",
                "byrobot_dronefighter_flight_drone_light_manual_single": "드론 LED %1 %2 %3",
                "byrobot_dronefighter_flight_drone_light_manual_single_input": "드론 LED %1 밝기 %2 %3",
                "byrobot_dronefighter_flight_controller_buzzer_off": "버저 끄기 %1",
                "byrobot_dronefighter_flight_controller_buzzer_scale": "%1 옥타브 %2 을(를) 연주 %3",
                "byrobot_dronefighter_flight_controller_buzzer_scale_delay": "%1 옥타브 %2 을(를) %3 초 연주 %4",
                "byrobot_dronefighter_flight_controller_buzzer_scale_reserve": "%1 옥타브 %2 을(를) %3 초 예약 %4",
                "byrobot_dronefighter_flight_controller_buzzer_hz": "%1 Hz 소리를 연주 %2",
                "byrobot_dronefighter_flight_controller_buzzer_hz_delay": "%1 Hz 소리를 %2 초 연주 %3",
                "byrobot_dronefighter_flight_controller_buzzer_hz_reserve": "%1 Hz 소리를 %2 초 예약 %3",
                "byrobot_dronefighter_flight_controller_vibrator_off": "진동 끄기 %1",
                "byrobot_dronefighter_flight_controller_vibrator_on_delay": "진동 %1 초 켜기 %2",
                "byrobot_dronefighter_flight_controller_vibrator_on_reserve": "진동 %1 초 예약 %2",
                "byrobot_dronefighter_flight_controller_vibrator_delay": "진동 %1 초 켜기, %2 초 끄기를 %3 초 실행 %4",
                "byrobot_dronefighter_flight_controller_vibrator_reserve": "진동 %1 초 켜기, %2 초 끄기를 %3 초 예약 %4",
            },

            Helper: {
                "byrobot_dronefighter_flight_drone_value_attitude": "<br>드론의 현재 자세를 각도로 반환합니다. Roll은 좌우 기울기(-90 ~ 90), Pitch는 앞뒤 기울기(-90 ~ 90), Yaw는 회전 각도(-180 ~ 180) 입니다.<br><br><font color='crimson'>#값</font> <font color='dodgerblue'>#드론</font> <font color='forestgreen'>#자세</font>",
                "byrobot_dronefighter_flight_drone_value_etc": "<br>드론파이터 설정과 관련된 값들과 적외선 통신으로 받은 값을 반환합니다.<br><br><font color='crimson'>#값</font> <font color='dodgerblue'>#드론</font> <font color='forestgreen'>#기타</font>",
                "byrobot_dronefighter_flight_controller_value_button": "<br>조종기에서 눌러진 버튼과 관련된 이벤트를 반환합니다.<br><br><font color='crimson'>#값</font> <font color='dodgerblue'>#조종기</font> <font color='forestgreen'>#버튼</font>",
                "byrobot_dronefighter_flight_controller_value_joystick": "<br>조종기의 조이스틱과 관련된 입력 값을 반환합니다. 각 축의 범위는 -100 ~ 100 입니다.<br><br><font color='crimson'>#값</font> <font color='dodgerblue'>#조종기</font> <font color='forestgreen'>#조이스틱</font>",
                "byrobot_dronefighter_flight_controller_if_button_press": "<br>지정한 조종기의 버튼이 눌러졌을 때 true를 반환합니다.<br><br><font color='crimson'>#조건</font> <font color='dodgerblue'>#조종기</font> <font color='forestgreen'>#버튼</font>",
                "byrobot_dronefighter_flight_controller_if_joystick_direction": "<br>조종기의 조이스틱을 지정한 방향으로 움직였을 때 true를 반환합니다.<br><br><font color='crimson'>#조건</font> <font color='dodgerblue'>#조종기</font> <font color='forestgreen'>#조이스틱</font>",
                "byrobot_dronefighter_flight_drone_control_drone_stop": "<br>드론 작동을 정지합니다.<br><br><font color='crimson'>#드론</font> <font color='dodgerblue'>#정지</font>",
                "byrobot_dronefighter_flight_drone_control_coordinate": "<br>드론 좌표 기준을 변경합니다. 앱솔루트 모드는 이륙 시와 '방향초기화'를 했을 때 드론이 바라보는 방향을 기준으로 앞뒤좌우가 고정됩니다. 이 때에는 Yaw를 조작하여 드론이 다른 방향을 보게 하여도 처음 지정한 방향을 기준으로 앞뒤좌우로 움직입니다. 사용자가 바라보는 방향과 드론의 기준 방향이 같을 때 조작하기 편리한 장점이 있습니다. 일반 모드는 현재 드론이 바라보는 방향을 기준으로 앞뒤좌우가 결정됩니다. 드론의 움직임에 따라 앞뒤좌우가 계속 바뀌기 때문에 익숙해지기 전까지는 사용하기 어려울 수 있습니다.<br><br><font color='crimson'>#드론</font> <font color='dodgerblue'>#좌표기준</font>",
                "byrobot_dronefighter_flight_drone_control_drone_reset_heading": "<br>드론의 방향을 초기화합니다. 앱솔루트 모드인 경우 현재 드론이 바라보는 방향을 0도로 변경합니다. 일반 모드에서는 아무런 영향이 없습니다.<br><br><font color='crimson'>#드론</font> <font color='dodgerblue'>#방향초기화</font>",
                "byrobot_dronefighter_flight_drone_control_quad_one": "<br>드론 조종 값을 지정합니다. 입력 가능한 값의 범위는 -100 ~ 100입니다. 정지 상태에서 Throttle 값을 50이상으로 지정하면 드론이 이륙합니다. 명령 전달 후 바로 다음 블럭으로 넘어갑니다.<br><br><font color='crimson'>#드론</font> <font color='dodgerblue'>#조종</font>",
                "byrobot_dronefighter_flight_drone_control_quad_one_delay": "<br>드론 조종 값을 지정합니다. 입력 가능한 값의 범위는 -100 ~ 100입니다. 정지 상태에서 Throttle 값을 50이상으로 지정하면 드론이 이륙합니다. 지정한 시간이 지나면 해당 조종 값을 0으로 변경합니다. 지정한 시간이 끝날 때까지 다음 블럭으로 넘어가지 않습니다.<br><br><font color='crimson'>#드론</font> <font color='dodgerblue'>#조종</font> <font color='forestgreen'>#시간지연</font>",
                "byrobot_dronefighter_flight_drone_control_quad": "<br>드론 조종 값을 지정합니다. 입력 가능한 값의 범위는 -100 ~ 100입니다. 정지 상태에서 Throttle 값을 50이상으로 지정하면 드론이 이륙합니다. 명령 전달 후 바로 다음 블럭으로 넘어갑니다.<br><br><font color='crimson'>#드론</font> <font color='dodgerblue'>#조종</font>",
                "byrobot_dronefighter_flight_drone_motor_stop": "<br>모든 모터의 작동을 정지합니다.<br><br><font color='crimson'>#드론</font> <font color='dodgerblue'>#모터정지</font>",
                "byrobot_dronefighter_flight_drone_motorsingle": "<br>지정한 모터를 원하는 빠르기로 회전할 때 사용합니다. 사용 가능한 값의 범위는 0 ~ 4000입니다. 모터의 순서는 '왼쪽 앞', '오른쪽 앞', '오른쪽 뒤', '왼쪽 뒤' 입니다.<br><br><font color='crimson'>#드론</font> <font color='dodgerblue'>#모터제어</font>",
                "byrobot_dronefighter_flight_drone_motorsingle_input": "<br>지정한 모터(1, 2, 3, 4)를 원하는 빠르기로 회전할 때 사용합니다. 사용 가능한 값의 범위는 0 ~ 4000입니다. 모터의 순서는 '왼쪽 앞', '오른쪽 앞', '오른쪽 뒤', '왼쪽 뒤' 입니다.<br><br><font color='crimson'>#드론</font> <font color='dodgerblue'>#모터제어</font>",
                "byrobot_dronefighter_flight_drone_irmessage": "<br>적외선으로 지정한 값을 보냅니다. 사용 가능한 값의 범위는 0 ~ 127입니다.<br><br><font color='crimson'>#드론</font> <font color='dodgerblue'>#적외선통신</font>",
                "byrobot_dronefighter_flight_drone_light_manual_single_off": "<br>드론의 모든 LED를 끕니다.<br><br><font color='crimson'>#드론</font> <font color='dodgerblue'>#LED끄기</font>",
                "byrobot_dronefighter_flight_drone_light_manual_single": "<br>드론의 LED를 조작하는데 사용합니다.<br><br><font color='crimson'>#드론</font> <font color='dodgerblue'>#LED제어</font>",
                "byrobot_dronefighter_flight_drone_light_manual_single_input": "<br>드론 LED 여러 개의 밝기를 동시에 변경할 때 사용합니다.<br>10진수(0 ~ 255), 16진수(0x00 ~ 0xFF) 값을 사용할 수 있습니다.<br>2진수로 표현한 값에서 각각의 비트는 개별 LED를 선택하는 스위치 역할을 합니다.<br>밝기 값은 0 ~ 255 사이의 값을 사용할 수 있습니다.<br>값이 커질수록 더 밝아집니다.<br><br><font color='crimson'>#드론</font> <font color='dodgerblue'>#LED제어</font>",
                "byrobot_dronefighter_flight_controller_light_manual_single_off": "<br>조종기의 모든 LED를 끕니다.<br><br><font color='crimson'>#조종기</font> <font color='dodgerblue'>#LED끄기</font>",
                "byrobot_dronefighter_flight_controller_light_manual_single": "<br>조종기 LED를 조작하는데 사용합니다.<br><br><font color='crimson'>#조종기</font> <font color='dodgerblue'>#LED제어</font>",
                "byrobot_dronefighter_flight_controller_light_manual_single_input": "<br>조종기 LED 여러 개의 밝기를 동시에 변경할 때 사용합니다.<br>10진수(0 ~ 255), 16진수(0x00 ~ 0xFF) 값을 사용할 수 있습니다.<br>2진수로 표현한 값에서 각각의 비트는 개별 LED를 선택하는 스위치 역할을 합니다.<br>밝기 값은 0 ~ 255 사이의 값을 사용할 수 있습니다.<br>값이 커질수록 더 밝아집니다.<br><br><font color='crimson'>#조종기</font> <font color='dodgerblue'>#LED제어</font>",
                "byrobot_dronefighter_flight_controller_buzzer_off": "<br>버저 작동을 중단합니다. 예약된 소리가 있다면 모두 삭제합니다.<br><br><font color='crimson'>#조종기</font> <font color='dodgerblue'>#버저끄기</font>",
                "byrobot_dronefighter_flight_controller_buzzer_scale": "<br>지정한 옥타브의 음을 계속해서 연주합니다(최대 60초). 이 블럭을 만났을 경우 소리가 켜져있거나 예약된 소리가 있다면 모두 삭제합니다. 이 블럭은 연주 명령을 실행 후 바로 다음 블럭으로 넘어갑니다.<br><br><font color='crimson'>#조종기</font> <font color='dodgerblue'>#버저</font> <font color='forestgreen'>#음계</font> <font color='peru'>#즉시</font>",
                "byrobot_dronefighter_flight_controller_buzzer_scale_delay": "<br>지정한 옥타브의 음을 지정한 시간동안 연주합니다. 이 블럭을 만났을 경우 소리가 켜져있거나 예약된 소리가 있다면 모두 삭제합니다. 이 블럭을 사용하면 소리가 끝날때까지 다음 블럭으로 넘어가지 않습니다.<br><br><font color='crimson'>#조종기</font> <font color='dodgerblue'>#버저</font> <font color='forestgreen'>#음계</font> <font color='peru'>#즉시</font> <font color='blueviolet'>#시간지연</font>",
                "byrobot_dronefighter_flight_controller_buzzer_scale_reserve": "<br>지정한 옥타브의 음을 지정한 시간동안 연주하도록 예약합니다. 이 블럭은 소리가 나도록 예약하고 바로 다음 블럭으로 넘어갑니다. 예약은 최대 12개까지 누적할 수 있습니다. 이 블럭은 주로 버저 소리와 함께 다른 행동을 동시에 할 때 사용합니다.<br><br><font color='crimson'>#조종기</font> <font color='dodgerblue'>#버저</font> <font color='forestgreen'>#음계</font> <font color='peru'>#예약</font>",
                "byrobot_dronefighter_flight_controller_buzzer_hz": "<br>지정한 주파수의 소리를 계속해서 연주합니다(최대 60초). 권장 사용 범위는 250 ~ 8000 입니다. 4옥타브를 기준으로 도(261), 도#(277), 레(293), 레#(311), 미(329), 파(349), 파#(370), 솔(392), 솔#(415), 라(440), 라#(466), 시(493)입니다. 여기에서 한 옥타브를 올라갈 때마다 주파수 값이 두 배가 됩니다. 한 옥타브를 내려갈 때에는 주파수 값이 절반이 됩니다. 예를 들면 3옥타브의 도는 130.8128Hz, 4옥타브의 도는 261.6256Hz, 5옥타브의 도는 523.2511Hz 입니다. 이 블럭을 만났을 경우 소리가 켜져있거나 예약된 소리가 있다면 모두 삭제합니다. 이 블럭은 연주 명령을 실행 후 바로 다음 블럭으로 넘어갑니다.<br><br><font color='crimson'>#조종기</font> <font color='dodgerblue'>#버저</font> <font color='forestgreen'>#주파수</font> <font color='peru'>#즉시</font>",
                "byrobot_dronefighter_flight_controller_buzzer_hz_delay": "<br>지정한 주파수의 소리를 지정한 시간동안 연주합니다. 권장 사용 범위는 250 ~ 8000 입니다. 4옥타브를 기준으로 도(261), 도#(277), 레(293), 레#(311), 미(329), 파(349), 파#(370), 솔(392), 솔#(415), 라(440), 라#(466), 시(493)입니다. 여기에서 한 옥타브를 올라갈 때마다 주파수 값이 두 배가 됩니다. 한 옥타브를 내려갈 때에는 주파수 값이 절반이 됩니다. 예를 들면 3옥타브의 도는 130.8128Hz, 4옥타브의 도는 261.6256Hz, 5옥타브의 도는 523.2511Hz 입니다. 이 블럭을 만났을 경우 소리가 켜져있거나 예약된 소리가 있다면 모두 삭제합니다. 이 블럭을 사용하면 소리가 끝날때까지 다음 블럭으로 넘어가지 않습니다.<br><br><font color='crimson'>#조종기</font> <font color='dodgerblue'>#버저</font> <font color='forestgreen'>#음계</font> <font color='peru'>#즉시</font> <font color='blueviolet'>#시간지연</font>",
                "byrobot_dronefighter_flight_controller_buzzer_hz_reserve": "<br>지정한 주파수의 소리를 지정한 시간동안 연주하도록 예약합니다. 권장 사용 범위는 250 ~ 8000 입니다. 4옥타브를 기준으로 도(261), 도#(277), 레(293), 레#(311), 미(329), 파(349), 파#(370), 솔(392), 솔#(415), 라(440), 라#(466), 시(493)입니다. 여기에서 한 옥타브를 올라갈 때마다 주파수 값이 두 배가 됩니다. 한 옥타브를 내려갈 때에는 주파수 값이 절반이 됩니다. 예를 들면 3옥타브의 도는 130.8128Hz, 4옥타브의 도는 261.6256Hz, 5옥타브의 도는 523.2511Hz 입니다. 이 블럭은 소리가 나도록 예약하고, 바로 다음 블럭으로 넘어갑니다. 예약은 최대 12개까지 누적할 수 있습니다. 이 블럭은 주로 버저 소리와 함께 다른 행동을 동시에 할 때 사용합니다.<br><br><font color='crimson'>#조종기</font> <font color='dodgerblue'>#버저</font> <font color='forestgreen'>#주파수</font> <font color='peru'>#예약</font>",
                "byrobot_dronefighter_flight_controller_vibrator_off": "<br>진동을 끕니다. 예약된 진동이 있다면 모두 삭제합니다.<br><br><font color='crimson'>#조종기</font> <font color='dodgerblue'>#진동끄기</font>",
                "byrobot_dronefighter_flight_controller_vibrator_on_delay": "<br>진동을 지정한 시간동안 켭니다. 이 블럭을 만났을 경우 진동이 켜져있거나 예약된 진동이 있다면 모두 삭제합니다. 이 블럭은 지정한 시간이 끝날 때까지 다음 블럭으로 넘어가지 않습니다.<br><br><font color='crimson'>#조종기</font> <font color='dodgerblue'>#진동</font> <font color='forestgreen'>#즉시</font> <font color='peru'>#시간지연</font>",
                "byrobot_dronefighter_flight_controller_vibrator_on_reserve": "<br>진동을 지정한 시간동안 켜는 것을 예약합니다. 이 블럭은 명령을 전달 후 바로 다음 블럭으로 넘어갑니다.<br><br><font color='crimson'>#조종기</font> <font color='dodgerblue'>#진동</font> <font color='forestgreen'>#예약</font>",
                "byrobot_dronefighter_flight_controller_vibrator_delay": "<br>진동을 지정한 시간동안 켜고 끄는 것을 지정한 시간동안 반복합니다. 이 블럭을 만났을 경우 진동이 켜져있거나 예약된 진동이 있다면 모두 삭제합니다. 이 블럭은 지정한 시간이 끝날 때까지 다음 블럭으로 넘어가지 않습니다.<br><br><font color='crimson'>#조종기</font> <font color='dodgerblue'>#진동</font> <font color='forestgreen'>#즉시</font> <font color='peru'>#시간지연</font>",
                "byrobot_dronefighter_flight_controller_vibrator_reserve": "<br>진동을 지정한 시간동안 켜고 끄는 것을 지정한 시간동안 반복하도록 예약합니다. 이 블럭은 명령을 전달 후 바로 다음 블럭으로 넘어갑니다.<br><br><font color='crimson'>#조종기</font> <font color='dodgerblue'>#진동</font> <font color='forestgreen'>#예약</font>",
            }
        },

        en: {
            // en.js에 작성하던 내용
            Blocks: {
                "byrobot_dronefighter_drone_state_mode_system": "system Mode",
                "byrobot_dronefighter_drone_state_mode_vehicle": "vehicle Mode",
                "byrobot_dronefighter_drone_state_mode_flight": "flight Mode",
                "byrobot_dronefighter_drone_state_mode_drive": "drive Mode",
                "byrobot_dronefighter_drone_state_mode_coordinate": "coordinate",
                "byrobot_dronefighter_drone_state_battery": "battery",
                "byrobot_dronefighter_drone_attitude_roll": "attitude - roll",
                "byrobot_dronefighter_drone_attitude_pitch": "attitude - pitch",
                "byrobot_dronefighter_drone_attitude_yaw": "attitude - yaw",
                "byrobot_dronefighter_drone_irmessage": "IR data Received",
                "byrobot_dronefighter_controller_joystick_left_x": "left joystick horizontal",
                "byrobot_dronefighter_controller_joystick_left_y": "left joystick vertical",
                "byrobot_dronefighter_controller_joystick_left_direction": "left joystick direction",
                "byrobot_dronefighter_controller_joystick_left_event": "left joystick event",
                "byrobot_dronefighter_controller_joystick_left_command": "left joystick command",
                "byrobot_dronefighter_controller_joystick_right_x": "right joystick horizontal",
                "byrobot_dronefighter_controller_joystick_right_y": "right joystick vertical",
                "byrobot_dronefighter_controller_joystick_right_direction": "right joystick direction",
                "byrobot_dronefighter_controller_joystick_right_event": "right joystick event",
                "byrobot_dronefighter_controller_joystick_right_command": "right joystick command",
                "byrobot_dronefighter_controller_joystick_direction_left_up": "left up",
                "byrobot_dronefighter_controller_joystick_direction_up": "up",
                "byrobot_dronefighter_controller_joystick_direction_right_up": "right up",
                "byrobot_dronefighter_controller_joystick_direction_left": "left",
                "byrobot_dronefighter_controller_joystick_direction_center": "center",
                "byrobot_dronefighter_controller_joystick_direction_right": "right",
                "byrobot_dronefighter_controller_joystick_direction_left_down": "left down",
                "byrobot_dronefighter_controller_joystick_direction_down": "down",
                "byrobot_dronefighter_controller_joystick_direction_right_down": "right down",
                "byrobot_dronefighter_controller_button_button": "button",
                "byrobot_dronefighter_controller_button_event": "button event",
                "byrobot_dronefighter_controller_button_front_left": "left red button",
                "byrobot_dronefighter_controller_button_front_right": "right red button",
                "byrobot_dronefighter_controller_button_front_left_right": "both red button",
                "byrobot_dronefighter_controller_button_center_up_left": "trim-turn-left button",
                "byrobot_dronefighter_controller_button_center_up_right": "trim-turn-right button",
                "byrobot_dronefighter_controller_button_center_up": "trim-forward button",
                "byrobot_dronefighter_controller_button_center_left": "trim-left button",
                "byrobot_dronefighter_controller_button_center_right": "trim-right button",
                "byrobot_dronefighter_controller_button_center_down": "trim-backward button",
                "byrobot_dronefighter_controller_button_bottom_left": "left round button",
                "byrobot_dronefighter_controller_button_bottom_right": "right round button",
                "byrobot_dronefighter_controller_button_bottom_left_right": "both round button",
                "byrobot_dronefighter_entryhw_count_transfer_reserved": "reserved data blocks",
                "byrobot_dronefighter_common_roll": "roll",
                "byrobot_dronefighter_common_pitch": "pitch",
                "byrobot_dronefighter_common_yaw": "yaw",
                "byrobot_dronefighter_common_throttle": "throttle",
                "byrobot_dronefighter_common_left": "left",
                "byrobot_dronefighter_common_right": "right",
                "byrobot_dronefighter_common_light_manual_on": "on",
                "byrobot_dronefighter_common_light_manual_off": "off",
                "byrobot_dronefighter_common_light_manual_b25": "brightness 25%",
                "byrobot_dronefighter_common_light_manual_b50": "brightness 50%",
                "byrobot_dronefighter_common_light_manual_b75": "brightness 75%",
                "byrobot_dronefighter_common_light_manual_b100": "brightness 100%",
                "byrobot_dronefighter_common_light_manual_all": "all",
                "byrobot_dronefighter_common_light_manual_red": "red",
                "byrobot_dronefighter_common_light_manual_blue": "blue",
                "byrobot_dronefighter_common_light_manual_1": "1",
                "byrobot_dronefighter_common_light_manual_2": "2",
                "byrobot_dronefighter_common_light_manual_3": "3",
                "byrobot_dronefighter_common_light_manual_4": "4",
                "byrobot_dronefighter_common_light_manual_5": "5",
                "byrobot_dronefighter_common_light_manual_6": "6",
                "byrobot_dronefighter_controller_buzzer": "buzzer",
                "byrobot_dronefighter_controller_buzzer_mute": "mute",
                "byrobot_dronefighter_controller_buzzer_c": "C",
                "byrobot_dronefighter_controller_buzzer_cs": "C#",
                "byrobot_dronefighter_controller_buzzer_d": "D",
                "byrobot_dronefighter_controller_buzzer_ds": "D#",
                "byrobot_dronefighter_controller_buzzer_e": "E",
                "byrobot_dronefighter_controller_buzzer_f": "F",
                "byrobot_dronefighter_controller_buzzer_fs": "F#",
                "byrobot_dronefighter_controller_buzzer_g": "G",
                "byrobot_dronefighter_controller_buzzer_gs": "G#",
                "byrobot_dronefighter_controller_buzzer_a": "A",
                "byrobot_dronefighter_controller_buzzer_as": "A#",
                "byrobot_dronefighter_controller_buzzer_b": "B",
                "byrobot_dronefighter_controller_userinterface_preset_clear": "clear",
                "byrobot_dronefighter_controller_userinterface_preset_dronefighter2017": "default",
                "byrobot_dronefighter_controller_userinterface_preset_education": "education",
                "byrobot_dronefighter_controller_userinterface_command_setup_button_frontleft_down": "press left red button",
                "byrobot_dronefighter_controller_userinterface_command_setup_button_frontright_down": "press right red button",
                "byrobot_dronefighter_controller_userinterface_command_setup_button_midturnleft_down": "press trim-left-turn button",
                "byrobot_dronefighter_controller_userinterface_command_setup_button_midturnright_down": "press trim-right-turn button",
                "byrobot_dronefighter_controller_userinterface_command_setup_button_midup_down": "press trim-forward button",
                "byrobot_dronefighter_controller_userinterface_command_setup_button_midleft_down": "press trim-left button",
                "byrobot_dronefighter_controller_userinterface_command_setup_button_midright_down": "press trim-right button",
                "byrobot_dronefighter_controller_userinterface_command_setup_button_middown_down": "press trim-backward button",
                "byrobot_dronefighter_controller_userinterface_command_setup_joystick_left_up_in": "left joystick move up",
                "byrobot_dronefighter_controller_userinterface_command_setup_joystick_left_left_in": "left joystick move left",
                "byrobot_dronefighter_controller_userinterface_command_setup_joystick_left_right_in": "left joystick move right",
                "byrobot_dronefighter_controller_userinterface_command_setup_joystick_left_down_in": "left joystick move down",
                "byrobot_dronefighter_controller_userinterface_command_setup_joystick_right_up_in": "right joystick move up",
                "byrobot_dronefighter_controller_userinterface_command_setup_joystick_right_left_in": "right joystick move left",
                "byrobot_dronefighter_controller_userinterface_command_setup_joystick_right_right_in": "right joystick move right",
                "byrobot_dronefighter_controller_userinterface_command_setup_joystick_right_down_in": "right joystick move down",
                "byrobot_dronefighter_controller_userinterface_function_joystickcalibration_reset": "reset joystick calibration",
                "byrobot_dronefighter_controller_userinterface_function_change_team_red": "team - red",
                "byrobot_dronefighter_controller_userinterface_function_change_team_blue": "team - blue",
                "byrobot_dronefighter_controller_userinterface_function_change_mode_vehicle_flight": "flight",
                "byrobot_dronefighter_controller_userinterface_function_change_mode_vehicle_flightnoguard": "flight - no guard",
                "byrobot_dronefighter_controller_userinterface_function_change_mode_vehicle_drive": "drive",
                "byrobot_dronefighter_controller_userinterface_function_change_coordinate_local": "coordinate - normal",
                "byrobot_dronefighter_controller_userinterface_function_change_coordinate_world": "coordinate - absolute",
                "byrobot_dronefighter_controller_userinterface_function_change_mode_control_mode1": "control - MODE 1",
                "byrobot_dronefighter_controller_userinterface_function_change_mode_control_mode2": "control - MODE 2",
                "byrobot_dronefighter_controller_userinterface_function_change_mode_control_mode3": "control - MODE 3",
                "byrobot_dronefighter_controller_userinterface_function_change_mode_control_mode4": "control - MODE 4",
                "byrobot_dronefighter_controller_userinterface_function_gyrobias_reset": "reset gyro bias",
                "byrobot_dronefighter_controller_userinterface_function_change_mode_usb_cdc": "USB serial device",
                "byrobot_dronefighter_controller_userinterface_function_change_mode_usb_hid": "USB game controller",
                "byrobot_dronefighter_drone_team": "team",
                "byrobot_dronefighter_drone_team_red": "red",
                "byrobot_dronefighter_drone_team_blue": "blue",
                "byrobot_dronefighter_drone_coordinate_world": "absolute",
                "byrobot_dronefighter_drone_coordinate_local": "normal",
                "byrobot_dronefighter_drone_mode_vehicle_flight": "flight",
                "byrobot_dronefighter_drone_mode_vehicle_drive": "drive",
                "byrobot_dronefighter_drone_control_double_wheel": "direction",
                "byrobot_dronefighter_drone_control_double_wheel_left": "turn left",
                "byrobot_dronefighter_drone_control_double_wheel_right": "turn right",
                "byrobot_dronefighter_drone_control_double_accel_forward": "forward",
                "byrobot_dronefighter_drone_control_double_accel_backward": "backward",
                "byrobot_dronefighter_drone_control_quad_roll": "roll",
                "byrobot_dronefighter_drone_control_quad_pitch": "pitch",
                "byrobot_dronefighter_drone_control_quad_yaw": "yaw",
                "byrobot_dronefighter_drone_control_quad_throttle": "throttle",
                "byrobot_dronefighter_drone_control_quad_roll_left": "left",
                "byrobot_dronefighter_drone_control_quad_roll_right": "right",
                "byrobot_dronefighter_drone_control_quad_pitch_forward": "foward",
                "byrobot_dronefighter_drone_control_quad_pitch_backward": "backward",
                "byrobot_dronefighter_drone_control_quad_yaw_left": "turn Left",
                "byrobot_dronefighter_drone_control_quad_yaw_right": "turn Right",
                "byrobot_dronefighter_drone_control_quad_throttle_up": "up",
                "byrobot_dronefighter_drone_control_quad_throttle_down": "down",
            },

            // en.js에 작성하던 내용
            template: {
                "byrobot_dronefighter_flight_drone_value_attitude": "%1",
                "byrobot_dronefighter_flight_drone_value_etc": "%1",
                "byrobot_dronefighter_flight_controller_value_button": "%1",
                "byrobot_dronefighter_flight_controller_value_joystick": "%1",
                "byrobot_dronefighter_flight_controller_if_button_press": "when press %1",
                "byrobot_dronefighter_flight_controller_if_joystick_direction": "when %1 stick move to %2",
                "byrobot_dronefighter_flight_drone_control_drone_stop": "stop %1",
                "byrobot_dronefighter_flight_drone_control_coordinate": "set coordinate reference to %1 %2",
                "byrobot_dronefighter_flight_drone_control_drone_reset_heading": "reset heading reference %1",
                "byrobot_dronefighter_flight_drone_control_quad_one": "set %1 to %2 %3",
                "byrobot_dronefighter_flight_drone_control_quad_one_delay": "set %1 to %2 and run for %3 second %4",
                "byrobot_dronefighter_flight_drone_control_quad": "set roll to %1, pitch to %2, yaw to %3, throttle to %4 %5",
                "byrobot_dronefighter_flight_drone_motor_stop": "turn off all motors %1",
                "byrobot_dronefighter_flight_drone_motorsingle": "set rotate for number %1 motor to %2 %3",
                "byrobot_dronefighter_flight_drone_motorsingle_input": "set rotate for number %1 motor to %2 %3",
                "byrobot_dronefighter_flight_drone_irmessage": "send %1 to the IR transmitter %2",
                "byrobot_dronefighter_flight_controller_light_manual_single_off": "turn off all controller LEDs %1",
                "byrobot_dronefighter_flight_controller_light_manual_single": "change the state of %1 controller LED to %2 %3",
                "byrobot_dronefighter_flight_controller_light_manual_single_input": "change the brightness of %1 controller LED to %2 %3",
                "byrobot_dronefighter_flight_drone_light_manual_single_off": "turn off all drone LEDs %1",
                "byrobot_dronefighter_flight_drone_light_manual_single": "change the state of %1 drone LED to %2 %3",
                "byrobot_dronefighter_flight_drone_light_manual_single_input": "change the brightness of %1 drone LED to %2 %3",
                "byrobot_dronefighter_flight_controller_buzzer_off": "turn off the buzzer %1",
                "byrobot_dronefighter_flight_controller_buzzer_scale": "play %1 octave %2 %3",
                "byrobot_dronefighter_flight_controller_buzzer_scale_delay": "play %1 octave %2 for %3 second %4",
                "byrobot_dronefighter_flight_controller_buzzer_scale_reserve": "reserve to play %1 octave %2 for %3 second %4",
                "byrobot_dronefighter_flight_controller_buzzer_hz": "play %1 Hz sound %2",
                "byrobot_dronefighter_flight_controller_buzzer_hz_delay": "play %1 Hz sound for %2 second %3",
                "byrobot_dronefighter_flight_controller_buzzer_hz_reserve": "reserve to play %1 Hz sound for %2 second %3",
                "byrobot_dronefighter_flight_controller_vibrator_off": "turn off the vibrator %1",
                "byrobot_dronefighter_flight_controller_vibrator_on_delay": "turn on the vibrator for %1 second %2",
                "byrobot_dronefighter_flight_controller_vibrator_on_reserve": "reserve turn on the vibrator for %1 second %2",
                "byrobot_dronefighter_flight_controller_vibrator_delay": "vibration %1 second on, %2 second off for %3 seconds %4",
                "byrobot_dronefighter_flight_controller_vibrator_reserve": "reserve vibration %1 second on, %2 second off for %3 seconds %4",
            },
            
            Helper: {

            }
        }
    }
};


/***************************************************************************************
 *  엔트리에 등록할 블록들의 이름
 ***************************************************************************************/
Entry.byrobot_dronefighter_flight.blockMenuBlocks = [
    'byrobot_dronefighter_flight_drone_value_attitude',
    'byrobot_dronefighter_flight_drone_value_etc',
    'byrobot_dronefighter_flight_controller_value_button',
    'byrobot_dronefighter_flight_controller_value_joystick',
    'byrobot_dronefighter_flight_controller_if_button_press',
    'byrobot_dronefighter_flight_controller_if_joystick_direction',
    'byrobot_dronefighter_flight_drone_control_drone_stop',
    'byrobot_dronefighter_flight_drone_control_coordinate',
    'byrobot_dronefighter_flight_drone_control_drone_reset_heading',
    'byrobot_dronefighter_flight_drone_control_quad_one',
    'byrobot_dronefighter_flight_drone_control_quad_one_delay',
    'byrobot_dronefighter_flight_drone_control_quad',
    'byrobot_dronefighter_flight_drone_motor_stop',
    'byrobot_dronefighter_flight_drone_motorsingle',
    'byrobot_dronefighter_flight_drone_motorsingle_input',
    'byrobot_dronefighter_flight_drone_irmessage',
    'byrobot_dronefighter_flight_drone_light_manual_single_off',
    'byrobot_dronefighter_flight_drone_light_manual_single',
    'byrobot_dronefighter_flight_drone_light_manual_single_input',
    'byrobot_dronefighter_flight_controller_light_manual_single_off',
    'byrobot_dronefighter_flight_controller_light_manual_single',
    'byrobot_dronefighter_flight_controller_light_manual_single_input',
    'byrobot_dronefighter_flight_controller_buzzer_off',
    'byrobot_dronefighter_flight_controller_buzzer_scale',
    'byrobot_dronefighter_flight_controller_buzzer_scale_delay',
    'byrobot_dronefighter_flight_controller_buzzer_scale_reserve',
    'byrobot_dronefighter_flight_controller_buzzer_hz',
    'byrobot_dronefighter_flight_controller_buzzer_hz_delay',
    'byrobot_dronefighter_flight_controller_buzzer_hz_reserve',
    'byrobot_dronefighter_flight_controller_vibrator_off',
    'byrobot_dronefighter_flight_controller_vibrator_on_delay',
    'byrobot_dronefighter_flight_controller_vibrator_on_reserve',
    'byrobot_dronefighter_flight_controller_vibrator_delay',
    'byrobot_dronefighter_flight_controller_vibrator_reserve',
];


/***************************************************************************************
 *  엔트리 블록 상세
 ***************************************************************************************/
Entry.byrobot_dronefighter_flight.getBlocks = function() {
    return {
        //region byrobot 바이로봇
        /* BYROBOT DroneFighter Flight Start */
        byrobot_dronefighter_flight_drone_value_attitude: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.byrobot_dronefighter_drone_attitude_roll, 'attitude_roll'],
                        [Lang.Blocks.byrobot_dronefighter_drone_attitude_pitch, 'attitude_pitch'],
                        [Lang.Blocks.byrobot_dronefighter_drone_attitude_yaw, 'attitude_yaw'],
                    ],
                    value: 'attitude_roll', // 초기 선택항목 지정
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
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
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [
                            Lang.Blocks.byrobot_dronefighter_drone_state_mode_vehicle,
                            'state_modeVehicle',
                        ],
                        [
                            Lang.Blocks.byrobot_dronefighter_drone_state_mode_flight,
                            'state_modeFlight',
                        ],
                        [
                            Lang.Blocks.byrobot_dronefighter_drone_state_mode_coordinate,
                            'state_coordinate',
                        ],
                        [Lang.Blocks.byrobot_dronefighter_drone_state_battery, 'state_battery'],
                        [Lang.Blocks.byrobot_dronefighter_drone_irmessage, 'irmessage_irdata'],
                    ],
                    value: 'irmessage_irdata', // 초기 선택항목 지정
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
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
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [
                            Lang.Blocks.byrobot_dronefighter_controller_button_button,
                            'button_button',
                        ],
                        [Lang.Blocks.byrobot_dronefighter_controller_button_event, 'button_event'],
                    ],
                    value: 'button_button', // 초기 선택항목 지정
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
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
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [
                            Lang.Blocks.byrobot_dronefighter_controller_joystick_left_x,
                            'joystick_left_x',
                        ],
                        [
                            Lang.Blocks.byrobot_dronefighter_controller_joystick_left_y,
                            'joystick_left_y',
                        ],
                        [
                            Lang.Blocks.byrobot_dronefighter_controller_joystick_left_direction,
                            'joystick_left_direction',
                        ],
                        [
                            Lang.Blocks.byrobot_dronefighter_controller_joystick_left_event,
                            'joystick_left_event',
                        ],
                        [
                            Lang.Blocks.byrobot_dronefighter_controller_joystick_left_command,
                            'joystick_left_command',
                        ],
                        [
                            Lang.Blocks.byrobot_dronefighter_controller_joystick_right_x,
                            'joystick_right_x',
                        ],
                        [
                            Lang.Blocks.byrobot_dronefighter_controller_joystick_right_y,
                            'joystick_right_y',
                        ],
                        [
                            Lang.Blocks.byrobot_dronefighter_controller_joystick_right_direction,
                            'joystick_right_direction',
                        ],
                        [
                            Lang.Blocks.byrobot_dronefighter_controller_joystick_right_event,
                            'joystick_right_event',
                        ],
                        [
                            Lang.Blocks.byrobot_dronefighter_controller_joystick_right_command,
                            'joystick_right_command',
                        ],
                    ],
                    value: 'joystick_left_x', // 초기 선택항목 지정
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
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
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.byrobot_dronefighter_controller_button_front_left, '1'],
                        [Lang.Blocks.byrobot_dronefighter_controller_button_front_right, '2'],
                        [Lang.Blocks.byrobot_dronefighter_controller_button_front_left_right, '3'],
                        [Lang.Blocks.byrobot_dronefighter_controller_button_center_up_left, '4'],
                        [Lang.Blocks.byrobot_dronefighter_controller_button_center_up_right, '8'],
                        [Lang.Blocks.byrobot_dronefighter_controller_button_center_up, '16'],
                        [Lang.Blocks.byrobot_dronefighter_controller_button_center_left, '32'],
                        [Lang.Blocks.byrobot_dronefighter_controller_button_center_right, '64'],
                        [Lang.Blocks.byrobot_dronefighter_controller_button_center_down, '128'],
                        [Lang.Blocks.byrobot_dronefighter_controller_button_bottom_left, '256'],
                        [Lang.Blocks.byrobot_dronefighter_controller_button_bottom_right, '512'],
                        [
                            Lang.Blocks.byrobot_dronefighter_controller_button_bottom_left_right,
                            '768',
                        ],
                    ],
                    value: '1',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
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

                if (read[button] == script.getField('BUTTON') && read[buttonevent] == 2)
                    return true;
                else return false;
            },
            syntax: { js: [], py: [] },
        },
        byrobot_dronefighter_flight_controller_if_joystick_direction: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.byrobot_dronefighter_common_left, 'joystick_left_direction'],
                        [Lang.Blocks.byrobot_dronefighter_common_right, 'joystick_right_direction'],
                    ],
                    value: 'joystick_left_direction',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [
                            Lang.Blocks.byrobot_dronefighter_controller_joystick_direction_left_up,
                            '17',
                        ],
                        [Lang.Blocks.byrobot_dronefighter_controller_joystick_direction_up, '18'],
                        [
                            Lang.Blocks.byrobot_dronefighter_controller_joystick_direction_right_up,
                            '20',
                        ],
                        [Lang.Blocks.byrobot_dronefighter_controller_joystick_direction_left, '33'],
                        [
                            Lang.Blocks.byrobot_dronefighter_controller_joystick_direction_center,
                            '34',
                        ],
                        [
                            Lang.Blocks.byrobot_dronefighter_controller_joystick_direction_right,
                            '36',
                        ],
                        [
                            Lang.Blocks
                                .byrobot_dronefighter_controller_joystick_direction_left_down,
                            '65',
                        ],
                        [Lang.Blocks.byrobot_dronefighter_controller_joystick_direction_down, '66'],
                        [
                            Lang.Blocks
                                .byrobot_dronefighter_controller_joystick_direction_right_down,
                            '68',
                        ],
                    ],
                    value: '34',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [null, null],
                type: 'byrobot_dronefighter_flight_controller_if_joystick_direction',
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
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'byrobot_dronefighter_flight_controller_light_manual_single_off',
            },
            paramsKeyMap: {},
            class: 'byrobot_dronefighter_flight_controller_light',
            isNotFor: ['byrobot_dronefighter_flight'],
            func: function(sprite, script) {
                return Entry.byrobot_dronefighter_flight.setLightManual(script, 0x11, 0xff, 0);
            },
        },
        byrobot_dronefighter_flight_controller_light_manual_single: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.byrobot_dronefighter_common_light_manual_all, '255'],
                        [Lang.Blocks.byrobot_dronefighter_common_light_manual_1, '128'],
                        [Lang.Blocks.byrobot_dronefighter_common_light_manual_2, '64'],
                        [Lang.Blocks.byrobot_dronefighter_common_light_manual_3, '32'],
                        [Lang.Blocks.byrobot_dronefighter_common_light_manual_4, '16'],
                        [Lang.Blocks.byrobot_dronefighter_common_light_manual_5, '8'],
                        [Lang.Blocks.byrobot_dronefighter_common_light_manual_6, '4'],
                        [Lang.Blocks.byrobot_dronefighter_common_light_manual_blue, '2'],
                        [Lang.Blocks.byrobot_dronefighter_common_light_manual_red, '1'],
                    ],
                    value: '128',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.byrobot_dronefighter_common_light_manual_on, '220'],
                        [Lang.Blocks.byrobot_dronefighter_common_light_manual_off, '0'],
                        [Lang.Blocks.byrobot_dronefighter_common_light_manual_b25, '75'],
                        [Lang.Blocks.byrobot_dronefighter_common_light_manual_b50, '125'],
                        [Lang.Blocks.byrobot_dronefighter_common_light_manual_b75, '200'],
                        [Lang.Blocks.byrobot_dronefighter_common_light_manual_b100, '255'],
                    ],
                    value: '220',
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
                params: [null, null, null],
                type: 'byrobot_dronefighter_flight_controller_light_manual_single',
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
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'text',
                        params: ['0xFF'],
                    },
                    {
                        type: 'text',
                        params: ['255'],
                    },
                    null,
                ],
                type: 'byrobot_dronefighter_flight_controller_light_manual_single_input',
            },
            paramsKeyMap: {
                FLAGS: 0,
                BRIGHTNESS: 1,
            },
            class: 'byrobot_dronefighter_flight_controller_light',
            isNotFor: ['byrobot_dronefighter_flight'],
            func: function(sprite, script) {
                const flags      = parseInt(script.getStringValue('FLAGS'));
                const brightness = script.getNumberValue('BRIGHTNESS');
                return Entry.byrobot_dronefighter_flight.setLightManual(
                    script,
                    0x11,
                    flags,
                    brightness
                );
            },
        },
        byrobot_dronefighter_flight_drone_light_manual_single_off: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'byrobot_dronefighter_flight_drone_light_manual_single_off',
            },
            paramsKeyMap: {},
            class: 'byrobot_dronefighter_flight_drone_light',
            isNotFor: ['byrobot_dronefighter_flight'],
            func: function(sprite, script) {
                return Entry.byrobot_dronefighter_flight.setLightManual(script, 0x10, 0xff, 0);
            },
        },
        byrobot_dronefighter_flight_drone_light_manual_single: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.byrobot_dronefighter_common_light_manual_all, '255'],
                        [Lang.Blocks.byrobot_dronefighter_common_light_manual_1, '128'],
                        [Lang.Blocks.byrobot_dronefighter_common_light_manual_2, '64'],
                        [Lang.Blocks.byrobot_dronefighter_common_light_manual_3, '32'],
                        [Lang.Blocks.byrobot_dronefighter_common_light_manual_4, '16'],
                        [Lang.Blocks.byrobot_dronefighter_common_light_manual_blue, '8'],
                        [Lang.Blocks.byrobot_dronefighter_common_light_manual_red, '4'],
                    ],
                    value: '128',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.byrobot_dronefighter_common_light_manual_on, '220'],
                        [Lang.Blocks.byrobot_dronefighter_common_light_manual_off, '0'],
                        [Lang.Blocks.byrobot_dronefighter_common_light_manual_b25, '75'],
                        [Lang.Blocks.byrobot_dronefighter_common_light_manual_b50, '125'],
                        [Lang.Blocks.byrobot_dronefighter_common_light_manual_b75, '200'],
                        [Lang.Blocks.byrobot_dronefighter_common_light_manual_b100, '255'],
                    ],
                    value: '220',
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
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'text',
                        params: ['0xFF'],
                    },
                    {
                        type: 'text',
                        params: ['255'],
                    },
                    null,
                ],
                type: 'byrobot_dronefighter_flight_drone_light_manual_single_input',
            },
            paramsKeyMap: {
                FLAGS: 0,
                BRIGHTNESS: 1,
            },
            class: 'byrobot_dronefighter_flight_drone_light',
            isNotFor: ['byrobot_dronefighter_flight'],
            func: function(sprite, script) {
                const flags      = parseInt(script.getStringValue('FLAGS'));
                const brightness = script.getNumberValue('BRIGHTNESS');
                return Entry.byrobot_dronefighter_flight.setLightManual(
                    script,
                    0x10,
                    flags,
                    brightness
                );
            },
        },
        byrobot_dronefighter_flight_controller_buzzer_off: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
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
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [['4', '3'], ['5', '4'], ['6', '5'], ['7', '6'], ['8', '7']],
                    value: '4',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.byrobot_dronefighter_controller_buzzer_mute, '-1'],
                        [Lang.Blocks.byrobot_dronefighter_controller_buzzer_c, '0'],
                        [Lang.Blocks.byrobot_dronefighter_controller_buzzer_cs, '1'],
                        [Lang.Blocks.byrobot_dronefighter_controller_buzzer_d, '2'],
                        [Lang.Blocks.byrobot_dronefighter_controller_buzzer_ds, '3'],
                        [Lang.Blocks.byrobot_dronefighter_controller_buzzer_e, '4'],
                        [Lang.Blocks.byrobot_dronefighter_controller_buzzer_f, '5'],
                        [Lang.Blocks.byrobot_dronefighter_controller_buzzer_fs, '6'],
                        [Lang.Blocks.byrobot_dronefighter_controller_buzzer_g, '7'],
                        [Lang.Blocks.byrobot_dronefighter_controller_buzzer_gs, '8'],
                        [Lang.Blocks.byrobot_dronefighter_controller_buzzer_a, '9'],
                        [Lang.Blocks.byrobot_dronefighter_controller_buzzer_as, '10'],
                        [Lang.Blocks.byrobot_dronefighter_controller_buzzer_b, '11'],
                    ],
                    value: '0',
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
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [['4', '3'], ['5', '4'], ['6', '5'], ['7', '6'], ['8', '7']],
                    value: '4',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.byrobot_dronefighter_controller_buzzer_mute, '-1'],
                        [Lang.Blocks.byrobot_dronefighter_controller_buzzer_c, '0'],
                        [Lang.Blocks.byrobot_dronefighter_controller_buzzer_cs, '1'],
                        [Lang.Blocks.byrobot_dronefighter_controller_buzzer_d, '2'],
                        [Lang.Blocks.byrobot_dronefighter_controller_buzzer_ds, '3'],
                        [Lang.Blocks.byrobot_dronefighter_controller_buzzer_e, '4'],
                        [Lang.Blocks.byrobot_dronefighter_controller_buzzer_f, '5'],
                        [Lang.Blocks.byrobot_dronefighter_controller_buzzer_fs, '6'],
                        [Lang.Blocks.byrobot_dronefighter_controller_buzzer_g, '7'],
                        [Lang.Blocks.byrobot_dronefighter_controller_buzzer_gs, '8'],
                        [Lang.Blocks.byrobot_dronefighter_controller_buzzer_a, '9'],
                        [Lang.Blocks.byrobot_dronefighter_controller_buzzer_as, '10'],
                        [Lang.Blocks.byrobot_dronefighter_controller_buzzer_b, '11'],
                    ],
                    value: '0',
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
                type: 'byrobot_dronefighter_flight_controller_buzzer_scale_delay',
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
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [['4', '3'], ['5', '4'], ['6', '5'], ['7', '6'], ['8', '7']],
                    value: '4',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.byrobot_dronefighter_controller_buzzer_mute, '-1'],
                        [Lang.Blocks.byrobot_dronefighter_controller_buzzer_c, '0'],
                        [Lang.Blocks.byrobot_dronefighter_controller_buzzer_cs, '1'],
                        [Lang.Blocks.byrobot_dronefighter_controller_buzzer_d, '2'],
                        [Lang.Blocks.byrobot_dronefighter_controller_buzzer_ds, '3'],
                        [Lang.Blocks.byrobot_dronefighter_controller_buzzer_e, '4'],
                        [Lang.Blocks.byrobot_dronefighter_controller_buzzer_f, '5'],
                        [Lang.Blocks.byrobot_dronefighter_controller_buzzer_fs, '6'],
                        [Lang.Blocks.byrobot_dronefighter_controller_buzzer_g, '7'],
                        [Lang.Blocks.byrobot_dronefighter_controller_buzzer_gs, '8'],
                        [Lang.Blocks.byrobot_dronefighter_controller_buzzer_a, '9'],
                        [Lang.Blocks.byrobot_dronefighter_controller_buzzer_as, '10'],
                        [Lang.Blocks.byrobot_dronefighter_controller_buzzer_b, '11'],
                    ],
                    value: '0',
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
                type: 'byrobot_dronefighter_flight_controller_buzzer_scale_reserve',
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
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
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
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
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
                return Entry.byrobot_dronefighter_flight.setBuzzerHz(script, hz, time, true, true);
            },
        },
        byrobot_dronefighter_flight_controller_buzzer_hz_reserve: {
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
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
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
                type: 'byrobot_dronefighter_flight_controller_buzzer_hz_reserve',
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
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
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
                return Entry.byrobot_dronefighter_flight.setVibratorStop(script);
            },
        },
        byrobot_dronefighter_flight_controller_vibrator_on_delay: {
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
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
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
                type: 'byrobot_dronefighter_flight_controller_vibrator_on_delay',
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
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
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
                type: 'byrobot_dronefighter_flight_controller_vibrator_on_reserve',
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
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
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
                return Entry.byrobot_dronefighter_flight.sendIrMessage(script, irmessage);
            },
        },
        byrobot_dronefighter_flight_drone_motor_stop: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
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
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [['1', '0'], ['2', '1'], ['3', '2'], ['4', '3']],
                    value: '0',
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
                var motorSpeed = parseInt(script.getNumberValue('MOTORSPEED', script));

                return Entry.byrobot_dronefighter_flight.setMotorSingle(
                    script,
                    motorIndex,
                    motorDirection,
                    motorSpeed
                );
            },
        },
        byrobot_dronefighter_flight_drone_motorsingle_input: {
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
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
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
                var motorIndex = parseInt(script.getNumberValue('MOTORINDEX', script)) - 1;
                var motorDirection = 1;
                var motorSpeed = parseInt(script.getNumberValue('MOTORSPEED', script));

                return Entry.byrobot_dronefighter_flight.setMotorSingle(
                    script,
                    motorIndex,
                    motorDirection,
                    motorSpeed
                );
            },
        },
        byrobot_dronefighter_flight_drone_command_mode_vehicle_drone: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'byrobot_dronefighter_flight_drone_command_mode_vehicle_drone',
            },
            paramsKeyMap: {},
            class: 'byrobot_dronefighter_flight_control_flight',
            isNotFor: ['byrobot_dronefighter_flight'],
            func: function(sprite, script) {
                return Entry.byrobot_dronefighter_flight.setModeVehicle(script, 0x10); // 0x10 : Mode::Vehicle::Flight
            },
        },
        byrobot_dronefighter_flight_drone_control_drone_takeoff: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
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
                return Entry.byrobot_dronefighter_flight.setEventFlight(script, 0x11, 200); // 0x11 : FlightEvent::TakeOff
            },
        },
        byrobot_dronefighter_flight_drone_control_drone_landing: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
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
                return Entry.byrobot_dronefighter_flight.setEventFlight(script, 0x12, 200); // 0x12 : FlightEvent::Landing
            },
        },
        byrobot_dronefighter_flight_drone_control_drone_stop: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
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
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.byrobot_dronefighter_drone_coordinate_world, '1'],
                        [Lang.Blocks.byrobot_dronefighter_drone_coordinate_local, '2'],
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
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'byrobot_dronefighter_flight_drone_control_drone_reset_heading',
            },
            paramsKeyMap: {},
            class: 'byrobot_dronefighter_flight_control_flight',
            isNotFor: ['byrobot_dronefighter_flight'],
            func: function(sprite, script) {
                return Entry.byrobot_dronefighter_flight.sendCommand(script, 0x10, 0x22, 0xa0); // 0x22 : CommandType::FlightEvent  // 0xA0 : FlightEvent::ResetHeading
            },
        },
        byrobot_dronefighter_flight_drone_control_quad_one: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.byrobot_dronefighter_drone_control_quad_roll, 'control_roll'],
                        [
                            Lang.Blocks.byrobot_dronefighter_drone_control_quad_pitch,
                            'control_pitch',
                        ],
                        [Lang.Blocks.byrobot_dronefighter_drone_control_quad_yaw, 'control_yaw'],
                        [
                            Lang.Blocks.byrobot_dronefighter_drone_control_quad_throttle,
                            'control_throttle',
                        ],
                    ],
                    value: 'control_throttle',
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
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.byrobot_dronefighter_drone_control_quad_roll, 'control_roll'],
                        [
                            Lang.Blocks.byrobot_dronefighter_drone_control_quad_pitch,
                            'control_pitch',
                        ],
                        [Lang.Blocks.byrobot_dronefighter_drone_control_quad_yaw, 'control_yaw'],
                        [
                            Lang.Blocks.byrobot_dronefighter_drone_control_quad_throttle,
                            'control_throttle',
                        ],
                    ],
                    value: 'control_throttle',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
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
                type: 'byrobot_dronefighter_flight_drone_control_quad_one_delay',
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
                var time = parseInt(script.getNumberValue('TIME', script) * 1000);

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
                var throttle = parseInt(script.getNumberValue('THROTTLE', script));

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

module.exports = Entry.byrobot_dronefighter_flight;
