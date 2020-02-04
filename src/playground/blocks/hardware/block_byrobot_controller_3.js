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
 *  장치 기본 정의
 ***************************************************************************************/

Entry.byrobot_controller_3 =
{
    id: 'F.7',
    name: 'byrobot_controller_3',
    url: 'http://www.byrobot.co.kr/',
    imageName: 'byrobot_controller_3.png',
    title: {
        "en": "BYROBOT Controller 3",
        "ko": "바이로봇 조종기 3"
    },


    // 엔트리 정지시 하드웨어 초기화 로직
    setZero: function()
    {
        // 초기화
        this.transferBufferClear();

        // 한 번에 명령을 전송하면 hw까지 제대로 전달되지 않는 경우가 있어
        // 명령을 각각 분리하여 전송하게 함(2017.01.03)
        for (var i = 0; i < 1; i++)
        {
            this.transferbuzzer(0, 0, 0);
            this.transferLightManual(0x20, 0xff, 0);   // LED 초기화(모두 꺼짐)
            this.transferLightModeColor(0x20, 0x21, 200, 255, 0, 0); // LED 초기화(조종기)
        }
    },


    // Entry 좌측 하단 하드웨어 모니터 화면에 표시하는 속성
    // listPorts와 ports 두 곳 동시에 동일한 속성을 표시할 수는 없음
    monitorTemplate:
    {
        /* 센서창 가림 현상을 해결하기 위해서 주석 처리함(2017.11.06)
        imgPath: "hw/byrobot_controller_3.png",      // 배경 이미지
        width: 256,     // 이미지의 폭
        height: 256,    // 이미지의 높이
        */

        // 모니터 화면 상단에 차례대로 나열하는 값
        listPorts: {
            joystick_left_x:                {name: 'Left Joystick X',               type: 'input',  pos: { x: 0, y: 0 }},
            joystick_left_y:                {name: 'Left Joystick Y',               type: 'input',  pos: { x: 0, y: 0 }},
            joystick_left_direction:        {name: 'Left Joystick Direction',       type: 'input',  pos: { x: 0, y: 0 }},
            joystick_left_event:            {name: 'Left Joystick Event',           type: 'input',  pos: { x: 0, y: 0 }},
            joystick_right_x:               {name: 'Right Joystick X',              type: 'input',  pos: { x: 0, y: 0 }},
            joystick_right_y:               {name: 'Right Joystick Y',              type: 'input',  pos: { x: 0, y: 0 }},
            joystick_right_direction:       {name: 'Right Joystick Direction',      type: 'input',  pos: { x: 0, y: 0 }},
            joystick_right_event:           {name: 'Right Joystick Event',          type: 'input',  pos: { x: 0, y: 0 }},
            button_button:                  {name: 'Button',                        type: 'input',  pos: { x: 0, y: 0 }},
            button_event:                   {name: 'Button Event',                  type: 'input',  pos: { x: 0, y: 0 }},
            entryhw_countTransferReserved:  {name: 'Transfer Buffer',               type: 'output', pos: { x: 0, y: 0 }},
        },

        // 모니터 화면 지정 위치와 선으로 연결하여 표시하는 값
        ports: {},

        mode: 'both', // 표시 모드
    },


    /***************************************************************************************
     *  시간 지연 함수
     ***************************************************************************************/


    // 시간 지연
    checkFinish: function(script, ms)
    {
        if (!script.isStart)
        {
            script.isStart = true;
            script.timeFlag = 1;

            var fps = Entry.FPS || 60;
            var timeValue = 60 / fps * ms;

            setTimeout(function() {
                script.timeFlag = 0;
            }, timeValue);

            return 'Start';
        }
        else if (script.timeFlag == 1)
        {
            return 'Running';
        }
        else
        {
            delete script.timeFlag;
            delete script.isStart;
            Entry.engine.isContinue = false;
            return 'Finish';
        }
    },


    /***************************************************************************************
     *  기능 함수
     ***************************************************************************************/


    transferBufferClear: function()
    {
        Entry.hw.setDigitalPortValue('buffer_clear', 0);

        Entry.hw.update();

        delete Entry.hw.sendQueue['buffer_clear'];
    },


    fit: function(min, value, max)
    {
        return Math.max(Math.min(value, max), min);
    },



    /***************************************************************************************
     *  데이터 전송 함수 (Entry -> Hardware)
     ***************************************************************************************/

    // 데이터 전송
    transferLightManual: function(target, flags, brightness)
    {
        // 범위 조정
        target      = this.fit(0, target, 255);
        flags       = this.fit(0, flags, 65535);
        brightness  = this.fit(0, brightness, 255);

        // 전송
        Entry.hw.setDigitalPortValue('target', target);
        Entry.hw.setDigitalPortValue('light_manual_flags', flags);
        Entry.hw.setDigitalPortValue('light_manual_brightness', brightness);

        Entry.hw.update();

        delete Entry.hw.sendQueue['target'];
        delete Entry.hw.sendQueue['light_manual_flags'];
        delete Entry.hw.sendQueue['light_manual_brightness'];
    },


    transferLightMode: function(target, mode, interval)
    {
        // 범위 조정
        target      = this.fit(0, target, 255);
        mode        = this.fit(0, mode, 255);
        interval    = this.fit(0, interval, 65535);

        // 전송
        Entry.hw.setDigitalPortValue('target', target);
        Entry.hw.setDigitalPortValue('light_mode_mode', mode);
        Entry.hw.setDigitalPortValue('light_mode_interval', interval);

        Entry.hw.update();

        delete Entry.hw.sendQueue['target'];
        delete Entry.hw.sendQueue['light_mode_mode'];
        delete Entry.hw.sendQueue['light_mode_interval'];
    },


    transferLightModeColor: function(target, mode, interval, red, green, blue)
    {
        // 범위 조정
        target      = this.fit(0, target,   255);
        mode        = this.fit(0, mode,     255);
        interval    = this.fit(0, interval, 65535);
        red         = this.fit(0, red,      255);
        green       = this.fit(0, green,    255);
        blue        = this.fit(0, blue,     255);

        // 전송
        Entry.hw.setDigitalPortValue('target',              target);
        Entry.hw.setDigitalPortValue('light_mode_mode',     mode);
        Entry.hw.setDigitalPortValue('light_mode_interval', interval);
        Entry.hw.setDigitalPortValue('light_color_r',       red);
        Entry.hw.setDigitalPortValue('light_color_g',       green);
        Entry.hw.setDigitalPortValue('light_color_b',       blue);

        Entry.hw.update();

        delete Entry.hw.sendQueue['target'];
        delete Entry.hw.sendQueue['light_mode_mode'];
        delete Entry.hw.sendQueue['light_mode_interval'];
        delete Entry.hw.sendQueue['light_color_r'];
        delete Entry.hw.sendQueue['light_color_g'];
        delete Entry.hw.sendQueue['light_color_b'];
    },


    transferLightEvent: function(target, event, interval, repeat)
    {
        // 범위 조정
        target      = this.fit(0, target,   255);
        event       = this.fit(0, event,    255);
        interval    = this.fit(0, interval, 65535);
        repeat      = this.fit(0, repeat,   255);

        // 전송
        Entry.hw.setDigitalPortValue('target', target);
        Entry.hw.setDigitalPortValue('light_event_event', event);
        Entry.hw.setDigitalPortValue('light_event_interval', interval);
        Entry.hw.setDigitalPortValue('light_event_repeat', repeat);

        Entry.hw.update();

        delete Entry.hw.sendQueue['target'];
        delete Entry.hw.sendQueue['light_event_event'];
        delete Entry.hw.sendQueue['light_event_interval'];
        delete Entry.hw.sendQueue['light_event_repeat'];
    },


    transferLightEventColor: function(target, event, interval, repeat, red, green, blue)
    {
        // 범위 조정
        target      = this.fit(0, target,   255);
        event       = this.fit(0, event,    255);
        interval    = this.fit(0, interval, 65535);
        repeat      = this.fit(0, repeat,   255);
        red         = this.fit(0, red,      255);
        green       = this.fit(0, green,    255);
        blue        = this.fit(0, blue,     255);

        // 전송
        Entry.hw.setDigitalPortValue('target',               target);
        Entry.hw.setDigitalPortValue('light_event_event',    event);
        Entry.hw.setDigitalPortValue('light_event_interval', interval);
        Entry.hw.setDigitalPortValue('light_event_repeat',   repeat);
        Entry.hw.setDigitalPortValue('light_color_r',        red);
        Entry.hw.setDigitalPortValue('light_color_g',        green);
        Entry.hw.setDigitalPortValue('light_color_b',        blue);

        Entry.hw.update();

        delete Entry.hw.sendQueue['target'];
        delete Entry.hw.sendQueue['light_event_event'];
        delete Entry.hw.sendQueue['light_event_interval'];
        delete Entry.hw.sendQueue['light_event_repeat'];
        delete Entry.hw.sendQueue['light_color_r'];
        delete Entry.hw.sendQueue['light_color_g'];
        delete Entry.hw.sendQueue['light_color_b'];
    },


    transferbuzzer: function(mode, value, time)
    {
        // 전송
        Entry.hw.setDigitalPortValue('target', 0x20);
        Entry.hw.setDigitalPortValue('buzzer_mode', mode);
        Entry.hw.setDigitalPortValue('buzzer_value', value);
        Entry.hw.setDigitalPortValue('buzzer_time', time);

        Entry.hw.update();

        delete Entry.hw.sendQueue['target'];
        delete Entry.hw.sendQueue['buzzer_mode'];
        delete Entry.hw.sendQueue['buzzer_value'];
        delete Entry.hw.sendQueue['buzzer_time'];
    },


    transferCommand: function(target, command, option)
    {
        // 전송
        Entry.hw.setDigitalPortValue('target', target);
        Entry.hw.setDigitalPortValue('command_command', command);
        Entry.hw.setDigitalPortValue('command_option', option);

        Entry.hw.update();

        delete Entry.hw.sendQueue['target'];
        delete Entry.hw.sendQueue['command_command'];
        delete Entry.hw.sendQueue['command_option'];
    },


    /***************************************************************************************
     *  블럭 연동 함수
     ***************************************************************************************/

    // 데이터 읽기
    getData: function(script, device)
    {
        return Entry.hw.portData[device];
    },


    // LED 수동 설정
    setLightManual: function(script, target, flags, brightness)
    {
        switch (this.checkFinish(script, 40))
        {
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


    // LED 모드 설정
    setLightMode: function(script, target, mode, interval)
    {
        switch (this.checkFinish(script, 40))
        {
            case 'Start':
                {
                    this.transferLightMode(target, mode, interval);
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


    // LED 모드 설정, RGB
    setLightModeColor: function(script, target, mode, interval, red, green, blue)
    {
        switch (this.checkFinish(script, 40))
        {
            case 'Start':
                {
                    this.transferLightModeColor(target, mode, interval, red, green, blue);
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


    // LED 이벤트 설정
    setLightEvent: function(script, target, mode, interval, repeat)
    {
        switch (this.checkFinish(script, 40))
        {
            case 'Start':
                {
                    this.transferLightEvent(target, mode, interval, repeat);
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


    // LED 이벤트 설정, RGB
    setLightEventColor: function(script, target, mode, interval, repeat, red, green, blue)
    {
        switch (this.checkFinish(script, 40))
        {
            case 'Start':
                {
                    this.transferLightEventColor(target, mode, interval, repeat, red, green, blue);
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
    setBuzzerStop: function(script)
    {
        switch (this.checkFinish(script, 40))
        {
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
    setBuzzerMute: function(script, time, flagDelay, flagInstantly)
    {
        time = this.fit(0, time, 60000);

        var timeDelay = 40;
        if (flagDelay) timeDelay = time;

        switch (this.checkFinish(script, timeDelay))
        {
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


    setBuzzerScale: function(script, octave, scale, time, flagDelay, flagInstantly)
    {
        time = this.fit(0, time, 60000);

        var timeDelay = 40;
        if (flagDelay) timeDelay = time;

        switch (this.checkFinish(script, timeDelay))
        {
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


    setBuzzerHz: function(script, hz, time, flagDelay, flagInstantly)
    {
        time = this.fit(0, time, 60000);

        var timeDelay = 40;
        if (flagDelay) timeDelay = time;

        switch (this.checkFinish(script, timeDelay))
        {
            case 'Start':
                {
                    var mode = 6; // Hz 연속
                    if (flagInstantly) mode = 5; // Hz 즉시

                    // 범위 조정
                    hz = this.fit(1, hz, 63999);

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


    sendCommand: function(script, target, command, option)
    {
        switch (this.checkFinish(script, 40))
        {
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


    sendStop: function(script)
    {
        return this.sendCommand(script, 0x10, 0x01, 0);
    },


    setMotorSingle: function(script, motorIndex, motorRotation, motorSpeed)
    {
        switch (this.checkFinish(script, 40))
        {
            case 'Start':
                {
                    this.transferMotorSingle(motorIndex, motorRotation, motorSpeed);
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



/***************************************************************************************
 *  언어 적용
 ***************************************************************************************/
// 
Entry.byrobot_controller_3.setLanguage = function ()
{
    return {
        ko: {
            // ko.js에 작성하던 내용
            Blocks: {
                "byrobot_controller_3_common_light_color_cottoncandy":       "구름솜사탕",
                "byrobot_controller_3_common_light_color_emerald":           "에메랄드",
                "byrobot_controller_3_common_light_color_lavender":          "라벤더",
                "byrobot_controller_3_common_light_color_muscat":            "청포도",
                "byrobot_controller_3_common_light_color_strawberrymilk":    "딸기우유",
                "byrobot_controller_3_common_light_color_sunset":            "저녁노을",
                "byrobot_controller_3_common_light_mode_hold":               "켜짐",
                "byrobot_controller_3_common_light_mode_dimming":            "천천히 깜빡임",
                "byrobot_controller_3_common_light_mode_flicker":            "깜빡임",
                "byrobot_controller_3_common_light_mode_flicker_double":     "2번 연속 깜빡임",
                "byrobot_controller_3_common_light_manual_all":              "전체",
                "byrobot_controller_3_common_light_manual_b100":             "밝기 100%",
                "byrobot_controller_3_common_light_manual_b25":              "밝기 25%",
                "byrobot_controller_3_common_light_manual_b50":              "밝기 50%",
                "byrobot_controller_3_common_light_manual_b75":              "밝기 75%",
                "byrobot_controller_3_common_light_manual_blue":             "파랑",
                "byrobot_controller_3_common_light_manual_cyan":             "하늘색",
                "byrobot_controller_3_common_light_manual_green":            "초록",
                "byrobot_controller_3_common_light_manual_magenta":          "자홍",
                "byrobot_controller_3_common_light_manual_off":              "끄기",
                "byrobot_controller_3_common_light_manual_on":               "켜기",
                "byrobot_controller_3_common_light_manual_red":              "빨강",
                "byrobot_controller_3_common_light_manual_white":            "흰색",
                "byrobot_controller_3_common_light_manual_yellow":           "노랑",
                "byrobot_controller_3_common_left":                          "왼쪽",
                "byrobot_controller_3_common_right":                         "오른쪽",
                "byrobot_controller_3_common_roll":                          "Roll",
                "byrobot_controller_3_common_pitch":                         "Pitch",
                "byrobot_controller_3_common_yaw":                           "Yaw",
                "byrobot_controller_3_common_throttle":                      "Throttle",
                "byrobot_controller_3_controller_button":                    "버튼",
                "byrobot_controller_3_controller_button_event":              "버튼 이벤트",
                "byrobot_controller_3_controller_button_front_left_up":      "전면 왼쪽 상단 버튼",
                "byrobot_controller_3_controller_button_front_left_down":    "전면 왼쪽 하단 버튼",
                "byrobot_controller_3_controller_button_front_right_up":     "전면 오른쪽 상단 버튼",
                "byrobot_controller_3_controller_button_front_right_down":   "전면 오른쪽 하단 버튼",
                "byrobot_controller_3_controller_button_top_left":           "상단 왼쪽 버튼",
                "byrobot_controller_3_controller_button_top_right":          "상단 오른쪽 버튼",
                "byrobot_controller_3_controller_button_bottom_left":        "하단 왼쪽 버튼",
                "byrobot_controller_3_controller_button_bottom_right":       "하단 오른쪽 버튼",
                "byrobot_controller_3_controller_button_center_top":         "중앙 위 버튼",
                "byrobot_controller_3_controller_button_center_left":        "중앙 왼쪽 버튼",
                "byrobot_controller_3_controller_button_center_right":       "중앙 오른쪽 버튼",
                "byrobot_controller_3_controller_button_center_bottom":      "중앙 아래쪽 버튼",
                "byrobot_controller_3_controller_buzzer":         "버저",
                "byrobot_controller_3_controller_buzzer_a":       "라",
                "byrobot_controller_3_controller_buzzer_as":      "라#",
                "byrobot_controller_3_controller_buzzer_b":       "시",
                "byrobot_controller_3_controller_buzzer_c":       "도",
                "byrobot_controller_3_controller_buzzer_cs":      "도#",
                "byrobot_controller_3_controller_buzzer_d":       "레",
                "byrobot_controller_3_controller_buzzer_ds":      "레#",
                "byrobot_controller_3_controller_buzzer_e":       "미",
                "byrobot_controller_3_controller_buzzer_f":       "파",
                "byrobot_controller_3_controller_buzzer_fs":      "파#",
                "byrobot_controller_3_controller_buzzer_g":       "솔",
                "byrobot_controller_3_controller_buzzer_gs":      "솔#",
                "byrobot_controller_3_controller_buzzer_mute":    "쉼",
                "byrobot_controller_3_controller_joystick_direction_left_up":     "왼쪽 위",
                "byrobot_controller_3_controller_joystick_direction_up":          "위",
                "byrobot_controller_3_controller_joystick_direction_right_up":    "오른쪽 위",
                "byrobot_controller_3_controller_joystick_direction_left":        "왼쪽",
                "byrobot_controller_3_controller_joystick_direction_center":      "중앙",
                "byrobot_controller_3_controller_joystick_direction_right":       "오른쪽",
                "byrobot_controller_3_controller_joystick_direction_left_down":   "왼쪽 아래",
                "byrobot_controller_3_controller_joystick_direction_down":        "아래",
                "byrobot_controller_3_controller_joystick_direction_right_down":  "오른쪽 아래",
                "byrobot_controller_3_controller_joystick_left_direction":        "왼쪽 조이스틱 방향",
                "byrobot_controller_3_controller_joystick_left_event":            "왼쪽 조이스틱 이벤트",
                "byrobot_controller_3_controller_joystick_left_x":                "왼쪽 조이스틱 가로축",
                "byrobot_controller_3_controller_joystick_left_y":                "왼쪽 조이스틱 세로축",
                "byrobot_controller_3_controller_joystick_right_direction":       "오른쪽 조이스틱 방향",
                "byrobot_controller_3_controller_joystick_right_event":           "오른쪽 조이스틱 이벤트",
                "byrobot_controller_3_controller_joystick_right_x":               "오른쪽 조이스틱 가로축",
                "byrobot_controller_3_controller_joystick_right_y":               "오른쪽 조이스틱 세로축",
                "byrobot_controller_3_entryhw_count_transfer_reserved":           "전송 예약된 데이터 수",
            },

            // ko.js에 작성하던 내용
            template: {
                "byrobot_controller_3_controller_buzzer_hz":                   "%1 Hz 소리를 연주 %2",
                "byrobot_controller_3_controller_buzzer_hz_delay":             "%1 Hz 소리를 %2 초 연주 %3",
                "byrobot_controller_3_controller_buzzer_hz_reserve":           "%1 Hz 소리를 %2 초 예약 %3",
                "byrobot_controller_3_controller_buzzer_off":                  "버저 끄기 %1",
                "byrobot_controller_3_controller_buzzer_scale":                "%1 옥타브 %2 을(를) 연주 %3",
                "byrobot_controller_3_controller_buzzer_scale_delay":          "%1 옥타브 %2 을(를) %3 초 연주 %4",
                "byrobot_controller_3_controller_buzzer_scale_reserve":        "%1 옥타브 %2 을(를) %3 초 예약 %4",
                "byrobot_controller_3_controller_if_button_press":             "조종기 %1 눌렀을 때",
                "byrobot_controller_3_controller_if_joystick_direction":       "조종기 %1 조이스틱 %2 움직였을 때",
                "byrobot_controller_3_controller_light_color_input":           "조종기 LED 색지정 R %1, G %2, B %3 %4 %5 %6",
                "byrobot_controller_3_controller_light_color_select":          "조종기 LED의 RGB 조합 예시 %1 %2 %3 %4",
                "byrobot_controller_3_controller_light_color_preset":          "조종기 LED %1 %2 %3",
                "byrobot_controller_3_controller_light_manual_single_input":   "조종기 LED %1 밝기 %2 %3",
                "byrobot_controller_3_controller_light_manual_single_off":     "조종기 LED 끄기 %1",
                "byrobot_controller_3_controller_value_button":                "%1",
                "byrobot_controller_3_controller_value_joystick":              "%1",
            },

            Helper: {
                "byrobot_controller_3_controller_buzzer_hz":                   "<br>지정한 주파수의 소리를 계속해서 연주합니다(최대 60초). 권장 사용 범위는 250 ~ 8000 입니다. 4옥타브를 기준으로 도(261), 도#(277), 레(293), 레#(311), 미(329), 파(349), 파#(370), 솔(392), 솔#(415), 라(440), 라#(466), 시(493)입니다. 여기에서 한 옥타브를 올라갈 때마다 주파수 값이 두 배가 됩니다. 한 옥타브를 내려갈 때에는 주파수 값이 절반이 됩니다. 예를 들면 3옥타브의 도는 130.8128Hz, 4옥타브의 도는 261.6256Hz, 5옥타브의 도는 523.2511Hz 입니다. 이 블럭을 만났을 경우 소리가 켜져있거나 예약된 소리가 있다면 모두 삭제합니다. 이 블럭은 연주 명령을 실행 후 바로 다음 블럭으로 넘어갑니다.<br><br><font color='crimson'>#조종기</font> <font color='dodgerblue'>#버저</font> <font color='forestgreen'>#주파수</font> <font color='peru'>#즉시</font>",
                "byrobot_controller_3_controller_buzzer_hz_delay":             "<br>지정한 주파수의 소리를 지정한 시간동안 연주합니다. 권장 사용 범위는 250 ~ 8000 입니다. 4옥타브를 기준으로 도(261), 도#(277), 레(293), 레#(311), 미(329), 파(349), 파#(370), 솔(392), 솔#(415), 라(440), 라#(466), 시(493)입니다. 여기에서 한 옥타브를 올라갈 때마다 주파수 값이 두 배가 됩니다. 한 옥타브를 내려갈 때에는 주파수 값이 절반이 됩니다. 예를 들면 3옥타브의 도는 130.8128Hz, 4옥타브의 도는 261.6256Hz, 5옥타브의 도는 523.2511Hz 입니다. 이 블럭을 만났을 경우 소리가 켜져있거나 예약된 소리가 있다면 모두 삭제합니다. 이 블럭을 사용하면 소리가 끝날때까지 다음 블럭으로 넘어가지 않습니다.<br><br><font color='crimson'>#조종기</font> <font color='dodgerblue'>#버저</font> <font color='forestgreen'>#음계</font> <font color='peru'>#즉시</font> <font color='blueviolet'>#시간지연</font>",
                "byrobot_controller_3_controller_buzzer_hz_reserve":           "<br>지정한 주파수의 소리를 지정한 시간동안 연주하도록 예약합니다. 권장 사용 범위는 250 ~ 8000 입니다. 4옥타브를 기준으로 도(261), 도#(277), 레(293), 레#(311), 미(329), 파(349), 파#(370), 솔(392), 솔#(415), 라(440), 라#(466), 시(493)입니다. 여기에서 한 옥타브를 올라갈 때마다 주파수 값이 두 배가 됩니다. 한 옥타브를 내려갈 때에는 주파수 값이 절반이 됩니다. 예를 들면 3옥타브의 도는 130.8128Hz, 4옥타브의 도는 261.6256Hz, 5옥타브의 도는 523.2511Hz 입니다. 이 블럭은 소리가 나도록 예약하고, 바로 다음 블럭으로 넘어갑니다. 예약은 최대 12개까지 누적할 수 있습니다. 이 블럭은 주로 버저 소리와 함께 다른 행동을 동시에 할 때 사용합니다.<br><br><font color='crimson'>#조종기</font> <font color='dodgerblue'>#버저</font> <font color='forestgreen'>#주파수</font> <font color='peru'>#예약</font>",
                "byrobot_controller_3_controller_buzzer_off":                  "<br>버저 작동을 중단합니다. 예약된 소리가 있다면 모두 삭제합니다.<br><br><font color='crimson'>#조종기</font> <font color='dodgerblue'>#버저끄기</font>",
                "byrobot_controller_3_controller_buzzer_scale":                "<br>지정한 옥타브의 음을 계속해서 연주합니다(최대 60초). 이 블럭을 만났을 경우 소리가 켜져있거나 예약된 소리가 있다면 모두 삭제합니다. 이 블럭은 연주 명령을 실행 후 바로 다음 블럭으로 넘어갑니다.<br><br><font color='crimson'>#조종기</font> <font color='dodgerblue'>#버저</font> <font color='forestgreen'>#음계</font> <font color='peru'>#즉시</font>",
                "byrobot_controller_3_controller_buzzer_scale_delay":          "<br>지정한 옥타브의 음을 지정한 시간동안 연주합니다. 이 블럭을 만났을 경우 소리가 켜져있거나 예약된 소리가 있다면 모두 삭제합니다. 이 블럭을 사용하면 소리가 끝날때까지 다음 블럭으로 넘어가지 않습니다.<br><br><font color='crimson'>#조종기</font> <font color='dodgerblue'>#버저</font> <font color='forestgreen'>#음계</font> <font color='peru'>#즉시</font> <font color='blueviolet'>#시간지연</font>",
                "byrobot_controller_3_controller_buzzer_scale_reserve":        "<br>지정한 옥타브의 음을 지정한 시간동안 연주하도록 예약합니다. 이 블럭은 소리가 나도록 예약하고 바로 다음 블럭으로 넘어갑니다. 예약은 최대 12개까지 누적할 수 있습니다. 이 블럭은 주로 버저 소리와 함께 다른 행동을 동시에 할 때 사용합니다.<br><br><font color='crimson'>#조종기</font> <font color='dodgerblue'>#버저</font> <font color='forestgreen'>#음계</font> <font color='peru'>#예약</font>",
                "byrobot_controller_3_controller_if_button_press":             "<br>지정한 조종기의 버튼이 눌러졌을 때 true를 반환합니다.<br><br><font color='crimson'>#조건</font> <font color='dodgerblue'>#조종기</font> <font color='forestgreen'>#버튼</font>",
                "byrobot_controller_3_controller_if_joystick_direction":       "<br>조종기의 조이스틱을 지정한 방향으로 움직였을 때 true를 반환합니다.<br><br><font color='crimson'>#조건</font> <font color='dodgerblue'>#조종기</font> <font color='forestgreen'>#조이스틱</font>",
                "byrobot_controller_3_controller_light_color_input":           "<br>빛의 삼원색인 Red, Green, Blue 값을 지정하여 조종기 LED의 색상을 원하는대로 만들 수 있습니다.<br>10진수(0 ~ 255) 값을 사용합니다.<br><br><font color='crimson'>#조종기</font> <font color='dodgerblue'>#LED제어</font>",
                "byrobot_controller_3_controller_light_color_select":          "<br>RGB 색지정 블록을 이용해서 만들 수 있는<br> 조종기 LED 예시입니다.<br>RGB 색지정 블록을 이용해서 멋진 색깔을<br> 다양하게 만들어보세요.<br><br><font color='crimson'>#조종기</font> <font color='dodgerblue'>#LED제어</font>",
                "byrobot_controller_3_controller_light_color_preset":         "<br>조종기 LED를 조작하는데 사용합니다.<br><br><font color='crimson'>#조종기</font> <font color='dodgerblue'>#LED제어</font>",
                "byrobot_controller_3_controller_light_manual_single_input":   "<br>조종기 LED를 조작하는데 사용합니다.<br>2진수(0b00000001 ~ 0b00000111), 10진수(32 ~ 224), 16진수(0x20 ~ 0xE0) 값을 사용할 수 있습니다.  2진수로 표현한 값에서 각각의 비트는 LED의 Red, Green, Blue 색을 선택하는 스위치 역할을 합니다.  밝기 값은 0 ~ 255 사이의 값을 사용할 수 있습니다. 값이 커질수록 더 밝아집니다. <br><br><font color='crimson'>#조종기</font> <font color='dodgerblue'>#LED제어</font>",
                "byrobot_controller_3_controller_light_manual_single_off":     "<br>조종기의 모든 LED를 끕니다.<br><br><font color='crimson'>#조종기</font> <font color='dodgerblue'>#LED끄기</font>",
                "byrobot_controller_3_controller_value_button":                "<br>조종기에서 눌러진 버튼과 관련된 이벤트를 반환합니다.<br><br><font color='crimson'>#값</font> <font color='dodgerblue'>#조종기</font> <font color='forestgreen'>#버튼</font>",
                "byrobot_controller_3_controller_value_joystick":              "<br>조종기의 조이스틱과 관련된 입력 값을 반환합니다. 각 축의 범위는 -100 ~ 100 입니다.<br><br>조이스틱 방향은 가로x세로 = 3x3 = 총9방향입니다.<br>위(왼쪽=17, 가운데=18, 오른쪽=20)<br>중간(왼쪽=33, 센터=34, 오른쪽=36)<br>아래(왼쪽=65, 가운데=66, 오른쪽=68)<br>기본값은 센터=34입니다.<br><br>조이스틱 이벤트는 값이 있을때 2, 없으면 0, 진입 1, 벗어남 3입니다.<br><br><font color='crimson'>#값</font> <font color='dodgerblue'>#조종기</font> <font color='forestgreen'>#조이스틱</font>",
            }
        },

        en: {
            // en.js에 작성하던 내용
            Blocks: {
                "byrobot_controller_3_common_left":                       "left",
                "byrobot_controller_3_common_light_color_cottoncandy":    "cotton candy",
                "byrobot_controller_3_common_light_color_emerald":        "emerald",
                "byrobot_controller_3_common_light_color_lavender":       "lavender",
                "byrobot_controller_3_common_light_mode_dimming":         "dimming",
                "byrobot_controller_3_common_light_mode_flicker":         "flicker",
                "byrobot_controller_3_common_light_mode_flicker_double":  "flicker double",
                "byrobot_controller_3_common_light_mode_hold":            "hold",
                "byrobot_controller_3_common_light_color_muscat":         "muscat",
                "byrobot_controller_3_common_light_color_strawberrymilk": "strawberry milk",
                "byrobot_controller_3_common_light_color_sunset":         "sunset",
                "byrobot_controller_3_common_light_manual_all":           "all",
                "byrobot_controller_3_common_light_manual_b100":          "brightness 100%",
                "byrobot_controller_3_common_light_manual_b25":           "brightness 25%",
                "byrobot_controller_3_common_light_manual_b50":           "brightness 50%",
                "byrobot_controller_3_common_light_manual_b75":           "brightness 75%",
                "byrobot_controller_3_common_light_manual_blue":          "blue",
                "byrobot_controller_3_common_light_manual_cyan":          "cyan",
                "byrobot_controller_3_common_light_manual_green":         "green",
                "byrobot_controller_3_common_light_manual_magenta":       "magenta",
                "byrobot_controller_3_common_light_manual_off":           "off",
                "byrobot_controller_3_common_light_manual_on":            "on",
                "byrobot_controller_3_common_light_manual_red":           "red",
                "byrobot_controller_3_common_light_manual_white":         "white",
                "byrobot_controller_3_common_light_manual_yellow":        "yellow",
                "byrobot_controller_3_common_pitch":      "pitch",
                "byrobot_controller_3_common_right":      "right",
                "byrobot_controller_3_common_roll":       "roll",
                "byrobot_controller_3_common_throttle":   "throttle",
                "byrobot_controller_3_common_yaw":        "yaw",
                "byrobot_controller_3_controller_button_bottom_left":         "left round button",
                "byrobot_controller_3_controller_button_bottom_left_right":   "both round button",
                "byrobot_controller_3_controller_button_bottom_right":        "right round button",
                "byrobot_controller_3_controller_button":                     "button",
                "byrobot_controller_3_controller_button_center_down":         "trim-backward button",
                "byrobot_controller_3_controller_button_center_left":         "trim-left button",
                "byrobot_controller_3_controller_button_center_right":        "trim-right button",
                "byrobot_controller_3_controller_button_center_up":           "trim-forward button",
                "byrobot_controller_3_controller_button_center_up_left":      "trim-turn-left button",
                "byrobot_controller_3_controller_button_center_up_right":     "trim-turn-right button",
                "byrobot_controller_3_controller_button_event":               "button event",
                "byrobot_controller_3_controller_button_front_left":          "left red button",
                "byrobot_controller_3_controller_button_front_left_right":    "both red button",
                "byrobot_controller_3_controller_button_front_right":         "right red button",
                "byrobot_controller_3_controller_buzzer":         "buzzer",
                "byrobot_controller_3_controller_buzzer_a":       "A",
                "byrobot_controller_3_controller_buzzer_as":      "A#",
                "byrobot_controller_3_controller_buzzer_b":       "B",
                "byrobot_controller_3_controller_buzzer_c":       "C",
                "byrobot_controller_3_controller_buzzer_cs":      "C#",
                "byrobot_controller_3_controller_buzzer_d":       "D",
                "byrobot_controller_3_controller_buzzer_ds":      "D#",
                "byrobot_controller_3_controller_buzzer_e":       "E",
                "byrobot_controller_3_controller_buzzer_f":       "F",
                "byrobot_controller_3_controller_buzzer_fs":      "F#",
                "byrobot_controller_3_controller_buzzer_g":       "G",
                "byrobot_controller_3_controller_buzzer_gs":      "G#",
                "byrobot_controller_3_controller_buzzer_mute":    "mute",
                "byrobot_controller_3_controller_joystick_direction_center":      "center",
                "byrobot_controller_3_controller_joystick_direction_down":        "down",
                "byrobot_controller_3_controller_joystick_direction_left":        "left",
                "byrobot_controller_3_controller_joystick_direction_left_down":   "left down",
                "byrobot_controller_3_controller_joystick_direction_left_up":     "left up",
                "byrobot_controller_3_controller_joystick_direction_right":       "right",
                "byrobot_controller_3_controller_joystick_direction_right_down":  "right down",
                "byrobot_controller_3_controller_joystick_direction_right_up":    "right up",
                "byrobot_controller_3_controller_joystick_direction_up":          "up",
                "byrobot_controller_3_controller_joystick_left_direction":        "left joystick direction",
                "byrobot_controller_3_controller_joystick_left_event":            "left joystick event",
                "byrobot_controller_3_controller_joystick_left_x":                "left joystick horizontal",
                "byrobot_controller_3_controller_joystick_left_y":                "left joystick vertical",
                "byrobot_controller_3_controller_joystick_right_direction":       "right joystick direction",
                "byrobot_controller_3_controller_joystick_right_event":           "right joystick event",
                "byrobot_controller_3_controller_joystick_right_x":               "right joystick horizontal",
                "byrobot_controller_3_controller_joystick_right_y":               "right joystick vertical",
                "byrobot_controller_3_entryhw_count_transfer_reserved":           "reserved data blocks",
            },

            // en.js에 작성하던 내용
            template: {
                "byrobot_controller_3_controller_buzzer_hz": "play %1 Hz sound %2",
                "byrobot_controller_3_controller_buzzer_hz_delay": "play %1 Hz sound for %2 second %3",
                "byrobot_controller_3_controller_buzzer_hz_reserve": "reserve to play %1 Hz sound for %2 second %3",
                "byrobot_controller_3_controller_buzzer_off": "turn off the buzzer %1",
                "byrobot_controller_3_controller_buzzer_scale": "play %1 octave %2 %3",
                "byrobot_controller_3_controller_buzzer_scale_delay": "play %1 octave %2 for %3 second %4",
                "byrobot_controller_3_controller_buzzer_scale_reserve": "reserve to play %1 octave %2 for %3 second %4",
                "byrobot_controller_3_controller_if_button_press": "when press %1",
                "byrobot_controller_3_controller_if_joystick_direction": "when %1 stick move to %2",
                "byrobot_controller_3_controller_light_color_input": "decide the color values of controller LED R %1, G %2, B %3 %4 %5",
                "byrobot_controller_3_controller_light_color_select": "RGB combination examples of controller LED %1 %2 %3",
                "byrobot_controller_3_controller_light_color_preset": "change the state of %1 controller LED to %2 %3",
                "byrobot_controller_3_controller_light_manual_single_input": "change the brightness of %1 controller LED to %2 %3",
                "byrobot_controller_3_controller_light_manual_single_off": "turn off all controller LEDs %1",
                "byrobot_controller_3_controller_value_button": "%1",
                "byrobot_controller_3_controller_value_joystick": "%1",
            },
            
            Helper: {

            }
        }
    }
};



/***************************************************************************************
 *  엔트리에 등록할 블록들의 블록명
 ***************************************************************************************/
Entry.byrobot_controller_3.blockMenuBlocks = [
    'byrobot_controller_3_controller_value_button',
    'byrobot_controller_3_controller_value_joystick',
    'byrobot_controller_3_controller_if_button_press',
    'byrobot_controller_3_controller_if_joystick_direction',
    'byrobot_controller_3_controller_light_manual_single_off',
    'byrobot_controller_3_controller_light_manual_single_input',
    'byrobot_controller_3_controller_light_color_preset',
    'byrobot_controller_3_controller_light_color_input',
    'byrobot_controller_3_controller_light_color_select',
    'byrobot_controller_3_controller_buzzer_off',
    'byrobot_controller_3_controller_buzzer_scale',
    'byrobot_controller_3_controller_buzzer_scale_delay',
    'byrobot_controller_3_controller_buzzer_scale_reserve',
    'byrobot_controller_3_controller_buzzer_hz',
    'byrobot_controller_3_controller_buzzer_hz_delay',
    'byrobot_controller_3_controller_buzzer_hz_reserve',
];



Entry.byrobot_controller_3.getBlocks = function()
{
    return {
        byrobot_controller_3_controller_value_button:
        {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.byrobot_controller_3_controller_button,   'button_button'],
                        [Lang.Blocks.byrobot_controller_3_controller_button_event,    'button_event'],
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
                type: 'byrobot_controller_3_controller_value_button', // 언어 파일에서 읽어들일 템플릿. 객체 이름과 동일하게
            },
            paramsKeyMap: {
                DEVICE: 0,
            },
            class: 'byrobot_controller_3_monitor', // 같은 이름인 객체들이 그룹으로 형성됨
            isNotFor: ['byrobot_controller_3'],
            func: function(sprite, script) {
                return Entry.hw.portData[script.getField('DEVICE')];
            },
        },


        byrobot_controller_3_controller_value_joystick:
        {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.byrobot_controller_3_controller_joystick_left_x,             'joystick_left_x'],
                        [Lang.Blocks.byrobot_controller_3_controller_joystick_left_y,             'joystick_left_y'],
                        [Lang.Blocks.byrobot_controller_3_controller_joystick_left_direction,     'joystick_left_direction'],
                        [Lang.Blocks.byrobot_controller_3_controller_joystick_left_event,         'joystick_left_event'],
                        [Lang.Blocks.byrobot_controller_3_controller_joystick_right_x,            'joystick_right_x'],
                        [Lang.Blocks.byrobot_controller_3_controller_joystick_right_y,            'joystick_right_y'],
                        [Lang.Blocks.byrobot_controller_3_controller_joystick_right_direction,    'joystick_right_direction'],
                        [Lang.Blocks.byrobot_controller_3_controller_joystick_right_event,        'joystick_right_event'],
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
                type: 'byrobot_controller_3_controller_value_joystick', // 언어 파일에서 읽어들일 템플릿. 객체 이름과 동일하게
            },
            paramsKeyMap: {
                DEVICE: 0,
            },
            class: 'byrobot_controller_3_monitor', // 같은 이름인 객체들이 그룹으로 형성됨
            isNotFor: ['byrobot_controller_3'],
            func: function(sprite, script) {
                return Entry.hw.portData[script.getField('DEVICE')];
            },
        },


        byrobot_controller_3_controller_if_button_press:
        {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.byrobot_controller_3_controller_button_front_left,        '1'],
                        [Lang.Blocks.byrobot_controller_3_controller_button_front_right,       '2'],
                        [Lang.Blocks.byrobot_controller_3_controller_button_front_left_right,  '3'],
                        [Lang.Blocks.byrobot_controller_3_controller_button_center_up_left,    '4'],
                        [Lang.Blocks.byrobot_controller_3_controller_button_center_up_right,   '8'],
                        [Lang.Blocks.byrobot_controller_3_controller_button_center_up,         '16'],
                        [Lang.Blocks.byrobot_controller_3_controller_button_center_left,       '32'],
                        [Lang.Blocks.byrobot_controller_3_controller_button_center_right,      '64'],
                        [Lang.Blocks.byrobot_controller_3_controller_button_center_down,       '128'],
                        [Lang.Blocks.byrobot_controller_3_controller_button_bottom_left,       '256'],
                        [Lang.Blocks.byrobot_controller_3_controller_button_bottom_right,      '512'],
                        [Lang.Blocks.byrobot_controller_3_controller_button_bottom_left_right, '768'],
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
                type: 'byrobot_controller_3_controller_if_button_press',
            },
            paramsKeyMap: {
                BUTTON: 0,
            },
            class: 'byrobot_controller_3_boolean_input',
            isNotFor: ['byrobot_controller_3'],
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


        byrobot_controller_3_controller_if_joystick_direction:
        {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.byrobot_controller_3_common_left, 'joystick_left_direction'],
                        [Lang.Blocks.byrobot_controller_3_common_right, 'joystick_right_direction'],
                    ],
                    value: 'joystick_left_direction',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.byrobot_controller_3_controller_joystick_direction_left_up,      '17'],
                        [Lang.Blocks.byrobot_controller_3_controller_joystick_direction_up,           '18'],
                        [Lang.Blocks.byrobot_controller_3_controller_joystick_direction_right_up,     '20'],
                        [Lang.Blocks.byrobot_controller_3_controller_joystick_direction_left,         '33'],
                        [Lang.Blocks.byrobot_controller_3_controller_joystick_direction_center,       '34'],
                        [Lang.Blocks.byrobot_controller_3_controller_joystick_direction_right,        '36'],
                        [Lang.Blocks.byrobot_controller_3_controller_joystick_direction_left_down,    '65'],
                        [Lang.Blocks.byrobot_controller_3_controller_joystick_direction_down,         '66'],
                        [Lang.Blocks.byrobot_controller_3_controller_joystick_direction_right_down,   '68'],
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
                type: 'byrobot_controller_3_controller_if_joystick_direction',
            },
            paramsKeyMap: {
                DEVICE: 0,
                DIRECTION: 1,
            },
            class: 'byrobot_controller_3_boolean_input',
            isNotFor: ['byrobot_controller_3'],
            func: function(sprite, script) {
                var read = Entry.hw.portData;

                var device = script.getField('DEVICE'); // paramsKeyMap에 정의된 이름 사용

                if (read[device] == script.getField('DIRECTION')) return true;
                else return false;
            },
        },


        byrobot_controller_3_controller_light_manual_single_off:
        {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {type: 'Indicator', img: 'block_icon/hardware_icon.svg', size: 12},
            ],
            events: {},
            def: {
                params: [null],
                type: 'byrobot_controller_3_controller_light_manual_single_off',
            },
            paramsKeyMap: {},
            class: 'byrobot_controller_3_controller_light',
            isNotFor: ['byrobot_controller_3'],
            func: function(sprite, script) {
                return Entry.byrobot_controller_3.setLightManual(script, 0x20, 0xff, 0);
            },
        },


        byrobot_controller_3_controller_light_color_preset:
        {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.byrobot_controller_3_common_light_manual_red,        'red'],
                        [Lang.Blocks.byrobot_controller_3_common_light_manual_green,      'green'],
                        [Lang.Blocks.byrobot_controller_3_common_light_manual_blue,       'blue'],
                        [Lang.Blocks.byrobot_controller_3_common_light_manual_yellow,     'yellow'],
                        [Lang.Blocks.byrobot_controller_3_common_light_manual_magenta,    'magenta'],
                        [Lang.Blocks.byrobot_controller_3_common_light_manual_cyan,       'cyan'],
                        [Lang.Blocks.byrobot_controller_3_common_light_manual_white,      'white'],
                    ],
                    value: 'red',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.byrobot_controller_3_common_light_manual_on,     '220'],
                        [Lang.Blocks.byrobot_controller_3_common_light_manual_off,    '0'],
                        [Lang.Blocks.byrobot_controller_3_common_light_manual_b25,    '75'],
                        [Lang.Blocks.byrobot_controller_3_common_light_manual_b50,    '125'],
                        [Lang.Blocks.byrobot_controller_3_common_light_manual_b75,    '200'],
                        [Lang.Blocks.byrobot_controller_3_common_light_manual_b100,   '255'],
                    ],
                    value: '220',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {type: 'Indicator', img: 'block_icon/hardware_icon.svg', size: 12},
            ],
            events: {},
            def: {
                params: [null, null, null],
                type: 'byrobot_controller_3_controller_light_color_preset',
            },
            paramsKeyMap: {
                FLAGS: 0,
                BRIGHTNESS: 1,
            },
            class: 'byrobot_controller_3_controller_light',
            isNotFor: ['byrobot_controller_3'],
            func: function(sprite, script) {
                var mode = 0x12;
                var interval = parseInt(script.getField('BRIGHTNESS'));
                var select = script.getField('FLAGS');
                var red = 0;
                var green = 0;
                var blue = 0;

                switch (select)
                {
                    case 'red':     red = 255;  green = 0;    blue = 0;     break;
                    case 'green':   red = 0;    green = 255;  blue = 0;     break;
                    case 'blue':    red = 0;    green = 0;    blue = 255;   break;
                    case 'cyan':    red = 0;    green = 255;  blue = 255;   break;
                    case 'magenta': red = 255;  green = 0;    blue = 255;   break;
                    case 'yellow':  red = 255;  green = 255;  blue = 0;     break;
                    case 'white':   red = 255;  green = 255;  blue = 255;   break;
                }

                return Entry.byrobot_controller_3.setLightModeColor(script, 0x20, mode, interval, red, green, blue);
            },
        },


        byrobot_controller_3_controller_light_manual_single_input:
        {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {type: 'Block', accept: 'string'},
                {type: 'Block', accept: 'string'},
                {type: 'Indicator', img: 'block_icon/hardware_icon.svg', size: 12},
            ],
            events: {},
            def: {
                params: [
                    {type: 'text', params: ['0b00000111']},
                    {type: 'text', params: ['255']},
                    null,
                ],
                type: 'byrobot_controller_3_controller_light_manual_single_input',
            },
            paramsKeyMap: {
                FLAGS: 0,
                BRIGHTNESS: 1,
            },
            class: 'byrobot_controller_3_controller_light',
            isNotFor: ['byrobot_controller_3'],
            func: function(sprite, script) {
                var flags = script.getNumberValue('FLAGS');
                var brightness = script.getNumberValue('BRIGHTNESS');
                return Entry.byrobot_controller_3.setLightManual(script, 0x20, flags, brightness);
            },
        },


        byrobot_controller_3_controller_light_color_input:
        {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {type: 'Block', accept: 'string'},
                {type: 'Block', accept: 'string'},
                {type: 'Block', accept: 'string'},
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.byrobot_controller_3_common_light_mode_hold,             '0'],   // TeamHold             = 0x12
                        [Lang.Blocks.byrobot_controller_3_common_light_mode_flicker,          '1'],   // TeamFlicker          = 0x13
                        [Lang.Blocks.byrobot_controller_3_common_light_mode_flicker_double,   '2'],   // TeamFlickerDouble    = 0x14
                        [Lang.Blocks.byrobot_controller_3_common_light_mode_dimming,          '3'],   // TeamDimming          = 0x15
                    ],
                    value: '0',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {type: 'Block', accept: 'string'},
                {type: 'Indicator', img: 'block_icon/hardware_icon.svg', size: 12},
            ],
            events: {},
            def: {
                params: [
                    {type: 'text', params: ['255']},
                    {type: 'text', params: ['255']},
                    {type: 'text', params: ['255']},
                    null,
                    {type: 'text', params: ['500']},
                    null,
                ],
                type:
                    'byrobot_controller_3_controller_light_color_input',
            },
            paramsKeyMap: {
                RED: 0,
                GREEN: 1,
                BLUE: 2,
                MODE: 3,
                INTERVAL: 4,
            },
            class: 'byrobot_controller_3_controller_light',
            isNotFor: ['byrobot_controller_3'],
            func: function(sprite, script) {
                var mode = 0x12 + parseInt(script.getField('MODE'));
                var interval = script.getNumberValue('INTERVAL');
                var red = script.getNumberValue('RED');
                var green = script.getNumberValue('GREEN');
                var blue = script.getNumberValue('BLUE');
                return Entry.byrobot_controller_3.setLightModeColor(script, 0x20, mode, interval, red, green, blue);
            },
        },


        byrobot_controller_3_controller_light_color_select:
        {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.byrobot_controller_3_common_light_color_sunset,          'sunset'],
                        [Lang.Blocks.byrobot_controller_3_common_light_color_cottoncandy,     'cottonCandy'],
                        [Lang.Blocks.byrobot_controller_3_common_light_color_muscat,          'muscat'],
                        [Lang.Blocks.byrobot_controller_3_common_light_color_strawberrymilk,  'strawberryMilk'],
                        [Lang.Blocks.byrobot_controller_3_common_light_color_emerald,         'emerald'],
                        [Lang.Blocks.byrobot_controller_3_common_light_color_lavender,        'lavender'],
                    ],
                    value: 'sunset',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.byrobot_controller_3_common_light_mode_hold,             '0'], // TeamHold           = 0x12
                        [Lang.Blocks.byrobot_controller_3_common_light_mode_flicker,          '1'], // TeamFlicker        = 0x13
                        [Lang.Blocks.byrobot_controller_3_common_light_mode_flicker_double,   '2'], // TeamFlickerDouble  = 0x14
                        [Lang.Blocks.byrobot_controller_3_common_light_mode_dimming,          '3'], // TeamDimming        = 0x15
                    ],
                    value: '0',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {type: 'Block', accept: 'string'},
                {type: 'Indicator', img: 'block_icon/hardware_icon.svg', size: 12},
            ],
            events: {},
            def: {
                params: [
                    null,
                    null,
                    {type: 'text', params: ['500']},
                    null
                ],
                type: 'byrobot_controller_3_controller_light_color_select',
            },
            paramsKeyMap: {
                SELECT: 0,
                MODE: 1,
                INTERVAL: 2,
            },
            class: 'byrobot_controller_3_controller_light',
            isNotFor: ['byrobot_controller_3'],
            func: function(sprite, script) {
                var mode = 0x12 + parseInt(script.getField('MODE'));
                var interval = script.getNumberValue('INTERVAL');
                var select = script.getField('SELECT');
                var red = 0;
                var green = 0;
                var blue = 0;

                switch (select)
                {
                    case 'sunset':          red = 255;  green = 100;    blue = 0;   break;
                    case 'cottonCandy':     red = 20;   green = 250;    blue = 150; break;
                    case 'muscat':          red = 70;   green = 255;    blue = 0;   break;
                    case 'strawberryMilk':  red = 150;  green = 60;     blue = 20;  break;
                    case 'emerald':         red = 0;    green = 255;    blue = 30;  break;
                    case 'lavender':        red = 80;   green = 0;      blue = 200; break;
                }

                return Entry.byrobot_controller_3.setLightModeColor(script, 0x20, mode, interval, red, green, blue);
            },
        },


        byrobot_controller_3_controller_buzzer_off:
        {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {type: 'Indicator', img: 'block_icon/hardware_icon.svg', size: 12},
            ],
            events: {},
            def: {
                params: [null],
                type: 'byrobot_controller_3_controller_buzzer_off',
            },
            paramsKeyMap: {},
            class: 'byrobot_controller_3_buzzer',
            isNotFor: ['byrobot_controller_3'],
            func: function(sprite, script) {
                return Entry.byrobot_controller_3.setBuzzerStop(script);
            },
        },


        byrobot_controller_3_controller_buzzer_scale:
        {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
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
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.byrobot_controller_3_controller_buzzer_mute, '-1'],
                        [Lang.Blocks.byrobot_controller_3_controller_buzzer_c,    '0'],
                        [Lang.Blocks.byrobot_controller_3_controller_buzzer_cs,   '1'],
                        [Lang.Blocks.byrobot_controller_3_controller_buzzer_d,    '2'],
                        [Lang.Blocks.byrobot_controller_3_controller_buzzer_ds,   '3'],
                        [Lang.Blocks.byrobot_controller_3_controller_buzzer_e,    '4'],
                        [Lang.Blocks.byrobot_controller_3_controller_buzzer_f,    '5'],
                        [Lang.Blocks.byrobot_controller_3_controller_buzzer_fs,   '6'],
                        [Lang.Blocks.byrobot_controller_3_controller_buzzer_g,    '7'],
                        [Lang.Blocks.byrobot_controller_3_controller_buzzer_gs,   '8'],
                        [Lang.Blocks.byrobot_controller_3_controller_buzzer_a,    '9'],
                        [Lang.Blocks.byrobot_controller_3_controller_buzzer_as,   '10'],
                        [Lang.Blocks.byrobot_controller_3_controller_buzzer_b,    '11'],
                    ],
                    value: '0',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {type: 'Indicator', img: 'block_icon/hardware_icon.svg', size: 12},
            ],
            events: {},
            def: {
                params: [null, null, null],
                type: 'byrobot_controller_3_controller_buzzer_scale',
            },
            paramsKeyMap: {
                OCTAVE: 0,
                SCALE: 1,
            },
            class: 'byrobot_controller_3_buzzer',
            isNotFor: ['byrobot_controller_3'],
            func: function(sprite, script) {
                var octave = parseInt(script.getField('OCTAVE'));
                var scale = parseInt(script.getField('SCALE'));

                if (scale == -1)
                    return Entry.byrobot_controller_3.setBuzzerMute(script, 60000, false, true);
                else
                    return Entry.byrobot_controller_3.setBuzzerScale(script, octave, scale, 60000, false, true);
            },
        },


        byrobot_controller_3_controller_buzzer_scale_delay:
        {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
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
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.byrobot_controller_3_controller_buzzer_mute, '-1'],
                        [Lang.Blocks.byrobot_controller_3_controller_buzzer_c,    '0'],
                        [Lang.Blocks.byrobot_controller_3_controller_buzzer_cs,   '1'],
                        [Lang.Blocks.byrobot_controller_3_controller_buzzer_d,    '2'],
                        [Lang.Blocks.byrobot_controller_3_controller_buzzer_ds,   '3'],
                        [Lang.Blocks.byrobot_controller_3_controller_buzzer_e,    '4'],
                        [Lang.Blocks.byrobot_controller_3_controller_buzzer_f,    '5'],
                        [Lang.Blocks.byrobot_controller_3_controller_buzzer_fs,   '6'],
                        [Lang.Blocks.byrobot_controller_3_controller_buzzer_g,    '7'],
                        [Lang.Blocks.byrobot_controller_3_controller_buzzer_gs,   '8'],
                        [Lang.Blocks.byrobot_controller_3_controller_buzzer_a,    '9'],
                        [Lang.Blocks.byrobot_controller_3_controller_buzzer_as,   '10'],
                        [Lang.Blocks.byrobot_controller_3_controller_buzzer_b,    '11'],
                    ],
                    value: '0',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {type: 'Block', accept: 'string'},
                {type: 'Indicator', img: 'block_icon/hardware_icon.svg', size: 12},
            ],
            events: {},
            def: {
                params: [
                    null,
                    null,
                    {type: 'text', params: ['1']},
                    null,
                ],
                type: 'byrobot_controller_3_controller_buzzer_scale_delay',
            },
            paramsKeyMap: {
                OCTAVE: 0,
                SCALE: 1,
                TIME: 2,
            },
            class: 'byrobot_controller_3_buzzer',
            isNotFor: ['byrobot_controller_3'],
            func: function(sprite, script) {
                var octave = parseInt(script.getField('OCTAVE'));
                var scale = parseInt(script.getField('SCALE'));
                var time = parseInt(script.getNumberValue('TIME') * 1000);

                if (scale == -1)
                    return Entry.byrobot_controller_3.setBuzzerMute(script, time, true, true);
                else
                    return Entry.byrobot_controller_3.setBuzzerScale(script, octave, scale, time, true, true);
            },
        },


        byrobot_controller_3_controller_buzzer_scale_reserve:
        {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
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
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.byrobot_controller_3_controller_buzzer_mute, '-1'],
                        [Lang.Blocks.byrobot_controller_3_controller_buzzer_c,    '0'],
                        [Lang.Blocks.byrobot_controller_3_controller_buzzer_cs,   '1'],
                        [Lang.Blocks.byrobot_controller_3_controller_buzzer_d,    '2'],
                        [Lang.Blocks.byrobot_controller_3_controller_buzzer_ds,   '3'],
                        [Lang.Blocks.byrobot_controller_3_controller_buzzer_e,    '4'],
                        [Lang.Blocks.byrobot_controller_3_controller_buzzer_f,    '5'],
                        [Lang.Blocks.byrobot_controller_3_controller_buzzer_fs,   '6'],
                        [Lang.Blocks.byrobot_controller_3_controller_buzzer_g,    '7'],
                        [Lang.Blocks.byrobot_controller_3_controller_buzzer_gs,   '8'],
                        [Lang.Blocks.byrobot_controller_3_controller_buzzer_a,    '9'],
                        [Lang.Blocks.byrobot_controller_3_controller_buzzer_as,   '10'],
                        [Lang.Blocks.byrobot_controller_3_controller_buzzer_b,    '11'],
                    ],
                    value: '0',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {type: 'Block', accept: 'string'},
                {type: 'Indicator', img: 'block_icon/hardware_icon.svg', size: 12},
            ],
            events: {},
            def: {
                params: [
                    null,
                    null,
                    {type: 'text', params: ['1']},
                    null,
                ],
                type: 'byrobot_controller_3_controller_buzzer_scale_reserve',
            },
            paramsKeyMap: {
                OCTAVE: 0,
                SCALE: 1,
                TIME: 2,
            },
            class: 'byrobot_controller_3_buzzer',
            isNotFor: ['byrobot_controller_3'],
            func: function(sprite, script) {
                var octave = parseInt(script.getField('OCTAVE'));
                var scale = parseInt(script.getField('SCALE'));
                var time = parseInt(script.getNumberValue('TIME') * 1000);

                if (scale == -1)
                    return Entry.byrobot_controller_3.setBuzzerMute(script, time, false, false);
                else
                    return Entry.byrobot_controller_3.setBuzzerScale(script, octave, scale, time, false, false);
            },
        },


        byrobot_controller_3_controller_buzzer_hz:
        {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {type: 'Block', accept: 'string'},
                {type: 'Indicator', img: 'block_icon/hardware_icon.svg', size: 12},
            ],
            events: {},
            def: {
                params: [
                    {type: 'text', params: ['1000']},
                    null,
                ],
                type: 'byrobot_controller_3_controller_buzzer_hz',
            },
            paramsKeyMap: {
                HZ: 0,
            },
            class: 'byrobot_controller_3_buzzer',
            isNotFor: ['byrobot_controller_3'],
            func: function(sprite, script) {
                var hz = parseInt(script.getNumberValue('HZ', script));
                return Entry.byrobot_controller_3.setBuzzerHz(script, hz, 60000, false, true);
            },
        },


        byrobot_controller_3_controller_buzzer_hz_delay:
        {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {type: 'Block', accept: 'string'},
                {type: 'Block', accept: 'string'},
                {type: 'Indicator', img: 'block_icon/hardware_icon.svg', size: 12},
            ],
            events: {},
            def: {
                params: [
                    {type: 'text', params: ['1000']},
                    {type: 'text', params: ['1']},
                    null,
                ],
                type: 'byrobot_controller_3_controller_buzzer_hz_delay',
            },
            paramsKeyMap: {
                HZ: 0,
                TIME: 1,
            },
            class: 'byrobot_controller_3_buzzer',
            isNotFor: ['byrobot_controller_3'],
            func: function(sprite, script) {
                var hz = parseInt(script.getNumberValue('HZ', script));
                var time = parseInt(script.getNumberValue('TIME') * 1000);
                return Entry.byrobot_controller_3.setBuzzerHz(script, hz, time, true, true);
            },
        },


        byrobot_controller_3_controller_buzzer_hz_reserve:
        {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {type: 'Block', accept: 'string'},
                {type: 'Block', accept: 'string'},
                {type: 'Indicator', img: 'block_icon/hardware_icon.svg', size: 12},
            ],
            events: {},
            def: {
                params: [
                    {type: 'text', params: ['1000']},
                    {type: 'text', params: ['1']},
                    null,
                ],
                type: 'byrobot_controller_3_controller_buzzer_hz_reserve',
            },
            paramsKeyMap: {
                HZ: 0,
                TIME: 1,
            },
            class: 'byrobot_controller_3_buzzer',
            isNotFor: ['byrobot_controller_3'],
            func: function(sprite, script) {
                var hz = parseInt(script.getNumberValue('HZ', script));
                var time = parseInt(script.getNumberValue('TIME') * 1000);
                return Entry.byrobot_controller_3.setBuzzerHz(script, hz, time, false, false);
            },
        },
    };
};

module.exports = Entry.byrobot_controller_3;

