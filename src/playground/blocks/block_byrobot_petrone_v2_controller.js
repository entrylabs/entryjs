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

Entry.byrobot_petrone_v2_controller = {
    name: 'byrobot_petrone_v2_controller',
    url: 'http://www.byrobot.co.kr/',
    imageName: 'byrobot_petrone_v2_controller.png',
    title: {
        "en": "BYROBOT Petrone V2 controller",
        "ko": "바이로봇 페트론V2 조종기"
    },

    // 초기화
    setZero: function() {
        // 초기화

        // 한 번에 명령을 전송하면 hw까지 제대로 전달되지 않는 경우가 있어
        // 명령을 각각 분리하여 전송하게 함(2017.01.03)
        for (var i = 0; i < 1; i++) {
            this.transferVibrator(0, 0, 0, 0);
            this.transferbuzzer(0, 0, 0);
            this.transferLightManual(0x31, 0xff, 0); // 조종기, flags = 0xFF (전체선택)
            this.transferCommand(0x31, 0x80, 0); // 조종기, command = 0x80 (DataStorageWrite)
        }
    },

    // Entry 좌측 하단 하드웨어 모니터 화면에 표시하는 속성
    // listPorts와 ports 두 곳 동시에 동일한 속성을 표시할 수는 없음
    monitorTemplate: {
        /* 센서창 가림 현상을 해결하기 위해서 주석 처리함(2017.11.06)
        imgPath: "hw/byrobot_petrone_v2_controller.png",      // 배경 이미지
        width: 500,     // 이미지의 폭
        height: 500,    // 이미지의 높이
        */

        // 모니터 화면 상단에 차례대로 나열하는 값
        listPorts: {
            joystick_left_x: {
                name: Lang.Blocks.byrobot_petrone_v2_controller_joystick_left_x,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            joystick_left_y: {
                name: Lang.Blocks.byrobot_petrone_v2_controller_joystick_left_y,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            joystick_left_direction: {
                name:
                    Lang.Blocks
                        .byrobot_petrone_v2_controller_joystick_left_direction,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            joystick_left_event: {
                name:
                    Lang.Blocks
                        .byrobot_petrone_v2_controller_joystick_left_event,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            joystick_right_x: {
                name:
                    Lang.Blocks.byrobot_petrone_v2_controller_joystick_right_x,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            joystick_right_y: {
                name:
                    Lang.Blocks.byrobot_petrone_v2_controller_joystick_right_y,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            joystick_right_direction: {
                name:
                    Lang.Blocks
                        .byrobot_petrone_v2_controller_joystick_right_direction,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            joystick_right_event: {
                name:
                    Lang.Blocks
                        .byrobot_petrone_v2_controller_joystick_right_event,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            button_button: {
                name: Lang.Blocks.byrobot_petrone_v2_controller_button_button,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            button_event: {
                name: Lang.Blocks.byrobot_petrone_v2_controller_button_event,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            entryhw_countTransferReserved: {
                name:
                    Lang.Blocks
                        .byrobot_petrone_v2_entryhw_count_transfer_reserved,
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

    transferLightColorRgb: function(target, mode, red, green, blue) {
        // 범위 조정
        target = Math.max(target, 0);
        target = Math.min(target, 255);
        mode = Math.max(mode, 0);
        mode = Math.min(mode, 255);
        red = Math.max(red, 0);
        red = Math.min(red, 255);
        green = Math.max(green, 0);
        green = Math.min(green, 255);
        blue = Math.max(blue, 0);
        blue = Math.min(blue, 255);

        // 전송
        Entry.hw.setDigitalPortValue('target', target);
        Entry.hw.setDigitalPortValue('light_mode_mode', mode);
        Entry.hw.setDigitalPortValue('light_color_r', red);
        Entry.hw.setDigitalPortValue('light_color_g', green);
        Entry.hw.setDigitalPortValue('light_color_b', blue);

        Entry.hw.update();

        delete Entry.hw.sendQueue['target'];
        delete Entry.hw.sendQueue['light_mode_mode'];
        delete Entry.hw.sendQueue['light_color_r'];
        delete Entry.hw.sendQueue['light_color_g'];
        delete Entry.hw.sendQueue['light_color_b'];
    },

    transferDisplayClear: function(
        target,
        pixel,
        clearAll,
        x,
        y,
        width,
        height
    ) {
        if (clearAll) {
            // 전송
            Entry.hw.setDigitalPortValue('target', target);
            Entry.hw.setDigitalPortValue('display_clearall_pixel', pixel);

            Entry.hw.update();

            delete Entry.hw.sendQueue['target'];
            delete Entry.hw.sendQueue['display_clearall_pixel'];
        } else {
            // 범위 조정
            x = Math.max(x, 0);
            x = Math.min(x, 128);
            y = Math.max(y, 0);
            y = Math.min(y, 64);
            width = Math.max(width, 0);
            width = Math.min(width, 128);
            height = Math.max(height, 0);
            height = Math.min(height, 64);

            // 전송
            Entry.hw.setDigitalPortValue('target', target);
            Entry.hw.setDigitalPortValue('display_clear_x', x);
            Entry.hw.setDigitalPortValue('display_clear_y', y);
            Entry.hw.setDigitalPortValue('display_clear_width', width);
            Entry.hw.setDigitalPortValue('display_clear_height', height);
            Entry.hw.setDigitalPortValue('display_clear_pixel', pixel);

            Entry.hw.update();

            delete Entry.hw.sendQueue['target'];
            delete Entry.hw.sendQueue['display_clear_x'];
            delete Entry.hw.sendQueue['display_clear_y'];
            delete Entry.hw.sendQueue['display_clear_width'];
            delete Entry.hw.sendQueue['display_clear_height'];
            delete Entry.hw.sendQueue['display_clear_pixel'];
        }
    },

    transferDisplayInvert: function(target, x, y, width, height) {
        // 범위 조정
        x = Math.max(x, 0);
        x = Math.min(x, 128);
        y = Math.max(y, 0);
        y = Math.min(y, 64);
        width = Math.max(width, 0);
        width = Math.min(width, 128);
        height = Math.max(height, 0);
        height = Math.min(height, 64);

        // 전송
        Entry.hw.setDigitalPortValue('target', target);
        Entry.hw.setDigitalPortValue('display_invert_x', x);
        Entry.hw.setDigitalPortValue('display_invert_y', y);
        Entry.hw.setDigitalPortValue('display_invert_width', width);
        Entry.hw.setDigitalPortValue('display_invert_height', height);

        Entry.hw.update();

        delete Entry.hw.sendQueue['target'];
        delete Entry.hw.sendQueue['display_invert_x'];
        delete Entry.hw.sendQueue['display_invert_y'];
        delete Entry.hw.sendQueue['display_invert_width'];
        delete Entry.hw.sendQueue['display_invert_height'];
    },

    transferDisplayDrawPoint: function(target, x, y, pixel) {
        // 범위 조정
        x = Math.max(x, 0);
        x = Math.min(x, 128);
        y = Math.max(y, 0);
        y = Math.min(y, 64);

        // 전송
        Entry.hw.setDigitalPortValue('target', target);
        Entry.hw.setDigitalPortValue('display_draw_point_x', x);
        Entry.hw.setDigitalPortValue('display_draw_point_y', y);
        Entry.hw.setDigitalPortValue('display_draw_point_pixel', pixel);

        Entry.hw.update();

        delete Entry.hw.sendQueue['target'];
        delete Entry.hw.sendQueue['display_draw_point_x'];
        delete Entry.hw.sendQueue['display_draw_point_y'];
        delete Entry.hw.sendQueue['display_draw_point_pixel'];
    },

    transferDisplayDrawLine: function(target, x1, y1, x2, y2, pixel, line) {
        // 범위 조정
        x1 = Math.max(x1, 0);
        x1 = Math.min(x1, 128);
        y1 = Math.max(y1, 0);
        y1 = Math.min(y1, 64);
        x2 = Math.max(x2, 0);
        x2 = Math.min(x2, 128);
        y2 = Math.max(y2, 0);
        y2 = Math.min(y2, 64);

        // 전송
        Entry.hw.setDigitalPortValue('target', target);
        Entry.hw.setDigitalPortValue('display_draw_line_x1', x1);
        Entry.hw.setDigitalPortValue('display_draw_line_y1', y1);
        Entry.hw.setDigitalPortValue('display_draw_line_x2', x2);
        Entry.hw.setDigitalPortValue('display_draw_line_y2', y2);
        Entry.hw.setDigitalPortValue('display_draw_line_pixel', pixel);
        Entry.hw.setDigitalPortValue('display_draw_line_line', line);

        Entry.hw.update();

        delete Entry.hw.sendQueue['target'];
        delete Entry.hw.sendQueue['display_draw_line_x1'];
        delete Entry.hw.sendQueue['display_draw_line_y1'];
        delete Entry.hw.sendQueue['display_draw_line_x2'];
        delete Entry.hw.sendQueue['display_draw_line_y2'];
        delete Entry.hw.sendQueue['display_draw_line_pixel'];
        delete Entry.hw.sendQueue['display_draw_line_line'];
    },

    transferDisplayDrawRect: function(
        target,
        x,
        y,
        width,
        height,
        pixel,
        flagFill,
        line
    ) {
        // 범위 조정
        x = Math.max(x, 0);
        x = Math.min(x, 128);
        y = Math.max(y, 0);
        y = Math.min(y, 64);
        width = Math.max(width, 0);
        width = Math.min(width, 128);
        height = Math.max(height, 0);
        height = Math.min(height, 64);

        // 전송
        Entry.hw.setDigitalPortValue('target', target);
        Entry.hw.setDigitalPortValue('display_draw_rect_x', x);
        Entry.hw.setDigitalPortValue('display_draw_rect_y', y);
        Entry.hw.setDigitalPortValue('display_draw_rect_width', width);
        Entry.hw.setDigitalPortValue('display_draw_rect_height', height);
        Entry.hw.setDigitalPortValue('display_draw_rect_pixel', pixel);
        Entry.hw.setDigitalPortValue('display_draw_rect_flagfill', flagFill);
        Entry.hw.setDigitalPortValue('display_draw_rect_line', line);

        Entry.hw.update();

        delete Entry.hw.sendQueue['target'];
        delete Entry.hw.sendQueue['display_draw_rect_x'];
        delete Entry.hw.sendQueue['display_draw_rect_y'];
        delete Entry.hw.sendQueue['display_draw_rect_width'];
        delete Entry.hw.sendQueue['display_draw_rect_height'];
        delete Entry.hw.sendQueue['display_draw_rect_pixel'];
        delete Entry.hw.sendQueue['display_draw_rect_flagfill'];
        delete Entry.hw.sendQueue['display_draw_rect_line'];
    },

    transferDisplayDrawCircle: function(target, x, y, radius, pixel, flagFill) {
        // 범위 조정
        x = Math.max(x, -50);
        x = Math.min(x, 178);
        y = Math.max(y, -50);
        y = Math.min(y, 114);
        radius = Math.max(radius, 1);
        radius = Math.min(radius, 200);

        // 전송
        Entry.hw.setDigitalPortValue('target', target);
        Entry.hw.setDigitalPortValue('display_draw_circle_x', x);
        Entry.hw.setDigitalPortValue('display_draw_circle_y', y);
        Entry.hw.setDigitalPortValue('display_draw_circle_radius', radius);
        Entry.hw.setDigitalPortValue('display_draw_circle_pixel', pixel);
        Entry.hw.setDigitalPortValue('display_draw_circle_flagfill', flagFill);

        Entry.hw.update();

        delete Entry.hw.sendQueue['target'];
        delete Entry.hw.sendQueue['display_draw_circle_x'];
        delete Entry.hw.sendQueue['display_draw_circle_y'];
        delete Entry.hw.sendQueue['display_draw_circle_radius'];
        delete Entry.hw.sendQueue['display_draw_circle_pixel'];
        delete Entry.hw.sendQueue['display_draw_circle_flagfill'];
    },

    transferDisplayDrawString: function(target, x, y, font, pixel, string) {
        // 범위 조정
        x = Math.max(x, 0);
        x = Math.min(x, 120);
        y = Math.max(y, 0);
        y = Math.min(y, 60);

        // 전송
        Entry.hw.setDigitalPortValue('target', target);
        Entry.hw.setDigitalPortValue('display_draw_string_x', x);
        Entry.hw.setDigitalPortValue('display_draw_string_y', y);
        Entry.hw.setDigitalPortValue('display_draw_string_font', font);
        Entry.hw.setDigitalPortValue('display_draw_string_pixel', pixel);
        Entry.hw.setDigitalPortValue('display_draw_string_string', string);

        Entry.hw.update();

        delete Entry.hw.sendQueue['target'];
        delete Entry.hw.sendQueue['display_draw_string_x'];
        delete Entry.hw.sendQueue['display_draw_string_y'];
        delete Entry.hw.sendQueue['display_draw_string_font'];
        delete Entry.hw.sendQueue['display_draw_string_pixel'];
        delete Entry.hw.sendQueue['display_draw_string_string'];
    },

    transferDisplayDrawStringAlign: function(
        target,
        xStart,
        xEnd,
        y,
        align,
        font,
        pixel,
        string
    ) {
        // 범위 조정
        xStart = Math.max(xStart, 0);
        xStart = Math.min(xStart, 124);
        xEnd = Math.max(xEnd, 4);
        xEnd = Math.min(xEnd, 128);
        y = Math.max(y, 0);
        y = Math.min(y, 60);

        // 전송
        Entry.hw.setDigitalPortValue('target', target);
        Entry.hw.setDigitalPortValue(
            'display_draw_string_align_x_start',
            xStart
        );
        Entry.hw.setDigitalPortValue('display_draw_string_align_x_end', xEnd);
        Entry.hw.setDigitalPortValue('display_draw_string_align_y', y);
        Entry.hw.setDigitalPortValue('display_draw_string_align_align', align);
        Entry.hw.setDigitalPortValue('display_draw_string_align_font', font);
        Entry.hw.setDigitalPortValue('display_draw_string_align_pixel', pixel);
        Entry.hw.setDigitalPortValue(
            'display_draw_string_align_string',
            string
        );

        Entry.hw.update();

        delete Entry.hw.sendQueue['target'];
        delete Entry.hw.sendQueue['display_draw_string_align_x_start'];
        delete Entry.hw.sendQueue['display_draw_string_align_x_end'];
        delete Entry.hw.sendQueue['display_draw_string_align_y'];
        delete Entry.hw.sendQueue['display_draw_string_align_align'];
        delete Entry.hw.sendQueue['display_draw_string_align_font'];
        delete Entry.hw.sendQueue['display_draw_string_align_pixel'];
        delete Entry.hw.sendQueue['display_draw_string_align_string'];
    },

    transferbuzzer: function(mode, value, time) {
        // 전송
        Entry.hw.setDigitalPortValue('target', 0x31);
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
        Entry.hw.setDigitalPortValue('target', 0x31);
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

    // LED 수동 설정 - RGB 값 직접 지정
    setLightColorRgb: function(script, target, mode, red, green, blue) {
        switch (this.checkFinish(script, 40)) {
            case 'Start':
                {
                    this.transferLightColorRgb(target, mode, red, green, blue);
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

    // OLED - 화면 전체 지우기, 선택 영역 지우기
    setDisplayClear: function(
        script,
        target,
        pixel,
        clearAll,
        x,
        y,
        width,
        height
    ) {
        switch (this.checkFinish(script, 40)) {
            case 'Start':
                {
                    this.transferDisplayClear(
                        target,
                        pixel,
                        clearAll,
                        x,
                        y,
                        width,
                        height
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

    // OLED - 선택 영역 반전
    setDisplayInvert: function(script, target, x, y, width, height) {
        switch (this.checkFinish(script, 40)) {
            case 'Start':
                {
                    this.transferDisplayInvert(target, x, y, width, height);
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

    // OLED - 화면에 점 찍기
    setDisplayDrawPoint: function(script, target, x, y, pixel) {
        switch (this.checkFinish(script, 40)) {
            case 'Start':
                {
                    this.transferDisplayDrawPoint(target, x, y, pixel);
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

    // OLED - 화면에 선 그리기
    setDisplayDrawLine: function(script, target, x1, y1, x2, y2, pixel, line) {
        switch (this.checkFinish(script, 40)) {
            case 'Start':
                {
                    this.transferDisplayDrawLine(
                        target,
                        x1,
                        y1,
                        x2,
                        y2,
                        pixel,
                        line
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

    // OLED - 화면에 사각형 그리기
    setDisplayDrawRect: function(
        script,
        target,
        x,
        y,
        width,
        height,
        pixel,
        flagFill,
        line
    ) {
        switch (this.checkFinish(script, 40)) {
            case 'Start':
                {
                    this.transferDisplayDrawRect(
                        target,
                        x,
                        y,
                        width,
                        height,
                        pixel,
                        flagFill,
                        line
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

    // OLED - 화면에 원 그리기
    setDisplayDrawCircle: function(
        script,
        target,
        x,
        y,
        radius,
        pixel,
        flagFill
    ) {
        switch (this.checkFinish(script, 40)) {
            case 'Start':
                {
                    this.transferDisplayDrawCircle(
                        target,
                        x,
                        y,
                        radius,
                        pixel,
                        flagFill
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

    // OLED - 화면에 문자열 쓰기
    setDisplayDrawString: function(script, target, x, y, font, pixel, string) {
        switch (this.checkFinish(script, 40)) {
            case 'Start':
                {
                    this.transferDisplayDrawString(
                        target,
                        x,
                        y,
                        font,
                        pixel,
                        string
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

    // OLED - 화면에 문자열 정렬하여 그리기
    setDisplayDrawStringAlign: function(
        script,
        target,
        xStart,
        xEnd,
        y,
        align,
        font,
        pixel,
        string
    ) {
        switch (this.checkFinish(script, 40)) {
            case 'Start':
                {
                    this.transferDisplayDrawStringAlign(
                        target,
                        xStart,
                        xEnd,
                        y,
                        align,
                        font,
                        pixel,
                        string
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
};

Entry.byrobot_petrone_v2_controller.getBlocks = function() {
    return {
        //region byrobot 바이로봇
        /* BYROBOT PetroneV2 Controller Start */
        byrobot_petrone_v2_controller_controller_value_button: {
            color: '#00979D',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [
                            Lang.Blocks
                                .byrobot_petrone_v2_controller_button_button,
                            'button_button',
                        ],
                        [
                            Lang.Blocks
                                .byrobot_petrone_v2_controller_button_event,
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
                type: 'byrobot_petrone_v2_controller_controller_value_button', // 언어 파일에서 읽어들일 템플릿. 객체 이름과 동일하게
            },
            paramsKeyMap: {
                DEVICE: 0,
            },
            class: 'byrobot_petrone_v2_controller_monitor', // 같은 이름인 객체들이 그룹으로 형성됨
            isNotFor: ['byrobot_petrone_v2_controller'],
            func: function(sprite, script) {
                var read = Entry.hw.portData;
                var device = script.getField('DEVICE'); // paramsKeyMap에 정의된 이름 사용
                return read[device];
            },
        },
        byrobot_petrone_v2_controller_controller_value_joystick: {
            color: '#00979D',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [
                            Lang.Blocks
                                .byrobot_petrone_v2_controller_joystick_left_x,
                            'joystick_left_x',
                        ],
                        [
                            Lang.Blocks
                                .byrobot_petrone_v2_controller_joystick_left_y,
                            'joystick_left_y',
                        ],
                        [
                            Lang.Blocks
                                .byrobot_petrone_v2_controller_joystick_left_direction,
                            'joystick_left_direction',
                        ],
                        [
                            Lang.Blocks
                                .byrobot_petrone_v2_controller_joystick_left_event,
                            'joystick_left_event',
                        ],
                        [
                            Lang.Blocks
                                .byrobot_petrone_v2_controller_joystick_right_x,
                            'joystick_right_x',
                        ],
                        [
                            Lang.Blocks
                                .byrobot_petrone_v2_controller_joystick_right_y,
                            'joystick_right_y',
                        ],
                        [
                            Lang.Blocks
                                .byrobot_petrone_v2_controller_joystick_right_direction,
                            'joystick_right_direction',
                        ],
                        [
                            Lang.Blocks
                                .byrobot_petrone_v2_controller_joystick_right_event,
                            'joystick_right_event',
                        ],
                    ],
                    value: 'joystick_left_x', // 초기 선택항목 지정
                    fontSize: 11,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'byrobot_petrone_v2_controller_controller_value_joystick', // 언어 파일에서 읽어들일 템플릿. 객체 이름과 동일하게
            },
            paramsKeyMap: {
                DEVICE: 0,
            },
            class: 'byrobot_petrone_v2_controller_monitor', // 같은 이름인 객체들이 그룹으로 형성됨
            isNotFor: ['byrobot_petrone_v2_controller'],
            func: function(sprite, script) {
                var read = Entry.hw.portData;
                var device = script.getField('DEVICE'); // paramsKeyMap에 정의된 이름 사용
                return read[device];
            },
        },
        byrobot_petrone_v2_controller_controller_if_button_press: {
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
                                .byrobot_petrone_v2_controller_button_front_left,
                            '1',
                        ],
                        [
                            Lang.Blocks
                                .byrobot_petrone_v2_controller_button_front_right,
                            '2',
                        ],
                        [
                            Lang.Blocks
                                .byrobot_petrone_v2_controller_button_front_left_right,
                            '3',
                        ],
                        [
                            Lang.Blocks
                                .byrobot_petrone_v2_controller_button_center_up_left,
                            '4',
                        ],
                        [
                            Lang.Blocks
                                .byrobot_petrone_v2_controller_button_center_up_right,
                            '8',
                        ],
                        [
                            Lang.Blocks
                                .byrobot_petrone_v2_controller_button_center_up,
                            '16',
                        ],
                        [
                            Lang.Blocks
                                .byrobot_petrone_v2_controller_button_center_left,
                            '32',
                        ],
                        [
                            Lang.Blocks
                                .byrobot_petrone_v2_controller_button_center_right,
                            '64',
                        ],
                        [
                            Lang.Blocks
                                .byrobot_petrone_v2_controller_button_center_down,
                            '128',
                        ],
                        [
                            Lang.Blocks
                                .byrobot_petrone_v2_controller_button_bottom_left,
                            '256',
                        ],
                        [
                            Lang.Blocks
                                .byrobot_petrone_v2_controller_button_bottom_right,
                            '512',
                        ],
                        [
                            Lang.Blocks
                                .byrobot_petrone_v2_controller_button_bottom_left_right,
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
                    'byrobot_petrone_v2_controller_controller_if_button_press',
            },
            paramsKeyMap: {
                BUTTON: 0,
            },
            class: 'byrobot_petrone_v2_controller_boolean_input',
            isNotFor: ['byrobot_petrone_v2_controller'],
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
        byrobot_petrone_v2_controller_controller_if_joystick_direction: {
            color: '#00979D',
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [
                            Lang.Blocks.byrobot_petrone_v2_common_left,
                            'joystick_left_direction',
                        ],
                        [
                            Lang.Blocks.byrobot_petrone_v2_common_right,
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
                                .byrobot_petrone_v2_controller_joystick_direction_left_up,
                            '17',
                        ],
                        [
                            Lang.Blocks
                                .byrobot_petrone_v2_controller_joystick_direction_up,
                            '18',
                        ],
                        [
                            Lang.Blocks
                                .byrobot_petrone_v2_controller_joystick_direction_right_up,
                            '20',
                        ],
                        [
                            Lang.Blocks
                                .byrobot_petrone_v2_controller_joystick_direction_left,
                            '33',
                        ],
                        [
                            Lang.Blocks
                                .byrobot_petrone_v2_controller_joystick_direction_center,
                            '34',
                        ],
                        [
                            Lang.Blocks
                                .byrobot_petrone_v2_controller_joystick_direction_right,
                            '36',
                        ],
                        [
                            Lang.Blocks
                                .byrobot_petrone_v2_controller_joystick_direction_left_down,
                            '65',
                        ],
                        [
                            Lang.Blocks
                                .byrobot_petrone_v2_controller_joystick_direction_down,
                            '66',
                        ],
                        [
                            Lang.Blocks
                                .byrobot_petrone_v2_controller_joystick_direction_right_down,
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
                    'byrobot_petrone_v2_controller_controller_if_joystick_direction',
            },
            paramsKeyMap: {
                DEVICE: 0,
                DIRECTION: 1,
            },
            class: 'byrobot_petrone_v2_controller_boolean_input',
            isNotFor: ['byrobot_petrone_v2_controller'],
            func: function(sprite, script) {
                var read = Entry.hw.portData;

                var device = script.getField('DEVICE'); // paramsKeyMap에 정의된 이름 사용

                if (read[device] == script.getField('DIRECTION')) return true;
                else return false;
            },
        },
        byrobot_petrone_v2_controller_controller_light_manual_single_off: {
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
                    'byrobot_petrone_v2_controller_controller_light_manual_single_off',
            },
            paramsKeyMap: {},
            class: 'byrobot_petrone_v2_controller_controller_light',
            isNotFor: ['byrobot_petrone_v2_controller'],
            func: function(sprite, script) {
                return Entry.byrobot_petrone_v2_controller.setLightManual(
                    script,
                    0x31,
                    0xff,
                    0
                );
            },
        },
        byrobot_petrone_v2_controller_controller_light_manual_single: {
            color: '#00979D',
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [
                            Lang.Blocks
                                .byrobot_petrone_v2_common_light_manual_red,
                            '128',
                        ],
                        [
                            Lang.Blocks
                                .byrobot_petrone_v2_common_light_manual_green,
                            '64',
                        ],
                        [
                            Lang.Blocks
                                .byrobot_petrone_v2_common_light_manual_blue,
                            '32',
                        ],
                        [
                            Lang.Blocks
                                .byrobot_petrone_v2_common_light_manual_yellow,
                            '192',
                        ],
                        [
                            Lang.Blocks
                                .byrobot_petrone_v2_common_light_manual_magenta,
                            '160',
                        ],
                        [
                            Lang.Blocks
                                .byrobot_petrone_v2_common_light_manual_cyan,
                            '96',
                        ],
                        [
                            Lang.Blocks
                                .byrobot_petrone_v2_common_light_manual_white,
                            '255',
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
                                .byrobot_petrone_v2_common_light_manual_on,
                            '220',
                        ],
                        [
                            Lang.Blocks
                                .byrobot_petrone_v2_common_light_manual_off,
                            '0',
                        ],
                        [
                            Lang.Blocks
                                .byrobot_petrone_v2_common_light_manual_b25,
                            '75',
                        ],
                        [
                            Lang.Blocks
                                .byrobot_petrone_v2_common_light_manual_b50,
                            '125',
                        ],
                        [
                            Lang.Blocks
                                .byrobot_petrone_v2_common_light_manual_b75,
                            '200',
                        ],
                        [
                            Lang.Blocks
                                .byrobot_petrone_v2_common_light_manual_b100,
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
                    'byrobot_petrone_v2_controller_controller_light_manual_single',
            },
            paramsKeyMap: {
                FLAGS: 0,
                BRIGHTNESS: 1,
            },
            class: 'byrobot_petrone_v2_controller_controller_light',
            isNotFor: ['byrobot_petrone_v2_controller'],
            func: function(sprite, script) {
                var flags = parseInt(script.getField('FLAGS'));
                var brightness = parseInt(script.getField('BRIGHTNESS'));
                return Entry.byrobot_petrone_v2_controller.setLightManual(
                    script,
                    0x31,
                    flags,
                    brightness
                );
            },
        },
        byrobot_petrone_v2_controller_controller_light_manual_single_input: {
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
                        params: ['0b11100000'],
                    },
                    {
                        type: 'text',
                        params: ['255'],
                    },
                    null,
                ],
                type:
                    'byrobot_petrone_v2_controller_controller_light_manual_single_input',
            },
            paramsKeyMap: {
                FLAGS: 0,
                BRIGHTNESS: 1,
            },
            class: 'byrobot_petrone_v2_controller_controller_light',
            isNotFor: ['byrobot_petrone_v2_controller'],
            func: function(sprite, script) {
                var flags = script.getNumberValue('FLAGS');
                var brightness = script.getNumberValue('BRIGHTNESS');
                return Entry.byrobot_petrone_v2_controller.setLightManual(
                    script,
                    0x31,
                    flags,
                    brightness
                );
            },
        },
        byrobot_petrone_v2_controller_controller_light_color_rgb_input: {
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
                    type: 'Dropdown',
                    options: [
                        [
                            Lang.Blocks
                                .byrobot_petrone_v2_common_light_mode_hold,
                            '0',
                        ], // TeamHold = 0x12
                        [
                            Lang.Blocks
                                .byrobot_petrone_v2_common_light_mode_flicker,
                            '1',
                        ], // TeamFlicker = 0x13
                        [
                            Lang.Blocks
                                .byrobot_petrone_v2_common_light_mode_flicker_double,
                            '2',
                        ], // TeamFlickerDouble = 0x14
                        [
                            Lang.Blocks
                                .byrobot_petrone_v2_common_light_mode_dimming,
                            '3',
                        ], // TeamDimming = 0x15
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
                params: [
                    {
                        type: 'text',
                        params: ['255'],
                    },
                    {
                        type: 'text',
                        params: ['255'],
                    },
                    {
                        type: 'text',
                        params: ['255'],
                    },
                    null,
                    null,
                ],
                type:
                    'byrobot_petrone_v2_controller_controller_light_color_rgb_input',
            },
            paramsKeyMap: {
                RED: 0,
                GREEN: 1,
                BLUE: 2,
                ADDITION: 3,
            },
            class: 'byrobot_petrone_v2_controller_controller_light',
            isNotFor: ['byrobot_petrone_v2_controller'],
            func: function(sprite, script) {
                var mode = 0x12 + parseInt(script.getField('ADDITION'));
                var red = script.getNumberValue('RED');
                var green = script.getNumberValue('GREEN');
                var blue = script.getNumberValue('BLUE');
                return Entry.byrobot_petrone_v2_controller.setLightColorRgb(
                    script,
                    0x31,
                    mode,
                    red,
                    green,
                    blue
                );
            },
        },
        byrobot_petrone_v2_controller_controller_light_color_rgb_select: {
            color: '#00979D',
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [
                            Lang.Blocks
                                .byrobot_petrone_v2_common_light_color_sunset,
                            'sunset',
                        ],
                        [
                            Lang.Blocks
                                .byrobot_petrone_v2_common_light_color_cottoncandy,
                            'cottonCandy',
                        ],
                        [
                            Lang.Blocks
                                .byrobot_petrone_v2_common_light_color_muscat,
                            'muscat',
                        ],
                        [
                            Lang.Blocks
                                .byrobot_petrone_v2_common_light_color_strawberrymilk,
                            'strawberryMilk',
                        ],
                        [
                            Lang.Blocks
                                .byrobot_petrone_v2_common_light_color_emerald,
                            'emerald',
                        ],
                        [
                            Lang.Blocks
                                .byrobot_petrone_v2_common_light_color_lavender,
                            'lavender',
                        ],
                    ],
                    value: 'sunset',
                    fontSize: 11,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [
                            Lang.Blocks
                                .byrobot_petrone_v2_common_light_mode_hold,
                            '0',
                        ], // TeamHold = 0x12
                        [
                            Lang.Blocks
                                .byrobot_petrone_v2_common_light_mode_flicker,
                            '1',
                        ], // TeamFlicker = 0x13
                        [
                            Lang.Blocks
                                .byrobot_petrone_v2_common_light_mode_flicker_double,
                            '2',
                        ], // TeamFlickerDouble = 0x14
                        [
                            Lang.Blocks
                                .byrobot_petrone_v2_common_light_mode_dimming,
                            '3',
                        ], // TeamDimming = 0x15
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
                type:
                    'byrobot_petrone_v2_controller_controller_light_color_rgb_select',
            },
            paramsKeyMap: {
                SELECT: 0,
                ADDITION: 1,
            },
            class: 'byrobot_petrone_v2_controller_controller_light',
            isNotFor: ['byrobot_petrone_v2_controller'],
            func: function(sprite, script) {
                var mode = 0x12 + parseInt(script.getField('ADDITION'));
                var select = script.getField('SELECT');
                var red = 0;
                var green = 0;
                var blue = 0;

                switch (select) {
                    case 'sunset':
                        red = 255;
                        green = 100;
                        blue = 0;
                        break;
                    case 'cottonCandy':
                        red = 20;
                        green = 250;
                        blue = 150;
                        break;
                    case 'muscat':
                        red = 70;
                        green = 255;
                        blue = 0;
                        break;
                    case 'strawberryMilk':
                        red = 150;
                        green = 60;
                        blue = 20;
                        break;
                    case 'emerald':
                        red = 0;
                        green = 255;
                        blue = 30;
                        break;
                    case 'lavender':
                        red = 80;
                        green = 0;
                        blue = 200;
                        break;
                }

                return Entry.byrobot_petrone_v2_controller.setLightColorRgb(
                    script,
                    0x31,
                    mode,
                    red,
                    green,
                    blue
                );
            },
        },
        byrobot_petrone_v2_controller_controller_display_clear_all: {
            color: '#00979D',
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [
                            Lang.Blocks
                                .byrobot_petrone_v2_controller_display_pixel_black,
                            '0',
                        ],
                        [
                            Lang.Blocks
                                .byrobot_petrone_v2_controller_display_pixel_white,
                            '1',
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
                params: [null, null],
                type:
                    'byrobot_petrone_v2_controller_controller_display_clear_all',
            },
            paramsKeyMap: {
                PIXEL: 0,
            },
            class: 'byrobot_petrone_v2_controller_controller_display',
            isNotFor: ['byrobot_petrone_v2_controller'],
            func: function(sprite, script) {
                var pixel = parseInt(script.getField('PIXEL'));
                return Entry.byrobot_petrone_v2_controller.setDisplayClear(
                    script,
                    0x31,
                    pixel,
                    true,
                    0,
                    0,
                    0,
                    0
                );
            },
        },
        byrobot_petrone_v2_controller_controller_display_clear: {
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
                    type: 'Dropdown',
                    options: [
                        [
                            Lang.Blocks
                                .byrobot_petrone_v2_controller_display_pixel_black,
                            '0',
                        ],
                        [
                            Lang.Blocks
                                .byrobot_petrone_v2_controller_display_pixel_white,
                            '1',
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
                params: [
                    {
                        type: 'text',
                        params: ['64'],
                    },
                    {
                        type: 'text',
                        params: ['32'],
                    },
                    {
                        type: 'text',
                        params: ['32'],
                    },
                    {
                        type: 'text',
                        params: ['16'],
                    },
                    null,
                    null,
                ],
                type: 'byrobot_petrone_v2_controller_controller_display_clear',
            },
            paramsKeyMap: {
                X: 0,
                Y: 1,
                WIDTH: 2,
                HEIGHT: 3,
                PIXEL: 4,
            },
            class: 'byrobot_petrone_v2_controller_controller_display',
            isNotFor: ['byrobot_petrone_v2_controller'],
            func: function(sprite, script) {
                var x = script.getNumberValue('X');
                var y = script.getNumberValue('Y');
                var width = script.getNumberValue('WIDTH');
                var height = script.getNumberValue('HEIGHT');
                var pixel = parseInt(script.getField('PIXEL'));
                return Entry.byrobot_petrone_v2_controller.setDisplayClear(
                    script,
                    0x31,
                    pixel,
                    false,
                    x,
                    y,
                    width,
                    height
                );
            },
        },
        byrobot_petrone_v2_controller_controller_display_invert: {
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
                        type: 'text',
                        params: ['32'],
                    },
                    {
                        type: 'text',
                        params: ['16'],
                    },
                    {
                        type: 'text',
                        params: ['64'],
                    },
                    {
                        type: 'text',
                        params: ['32'],
                    },
                    null,
                    null,
                ],
                type: 'byrobot_petrone_v2_controller_controller_display_invert',
            },
            paramsKeyMap: {
                X: 0,
                Y: 1,
                WIDTH: 2,
                HEIGHT: 3,
            },
            class: 'byrobot_petrone_v2_controller_controller_display',
            isNotFor: ['byrobot_petrone_v2_controller'],
            func: function(sprite, script) {
                var x = script.getNumberValue('X');
                var y = script.getNumberValue('Y');
                var width = script.getNumberValue('WIDTH');
                var height = script.getNumberValue('HEIGHT');
                return Entry.byrobot_petrone_v2_controller.setDisplayInvert(
                    script,
                    0x31,
                    x,
                    y,
                    width,
                    height
                );
            },
        },
        byrobot_petrone_v2_controller_controller_display_draw_point: {
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
                    type: 'Dropdown',
                    options: [
                        [
                            Lang.Blocks
                                .byrobot_petrone_v2_controller_display_pixel_black,
                            '0',
                        ],
                        [
                            Lang.Blocks
                                .byrobot_petrone_v2_controller_display_pixel_white,
                            '1',
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
                params: [
                    {
                        type: 'text',
                        params: ['64'],
                    },
                    {
                        type: 'text',
                        params: ['32'],
                    },
                    null,
                    null,
                ],
                type:
                    'byrobot_petrone_v2_controller_controller_display_draw_point',
            },
            paramsKeyMap: {
                X: 0,
                Y: 1,
                PIXEL: 2,
            },
            class: 'byrobot_petrone_v2_controller_controller_display',
            isNotFor: ['byrobot_petrone_v2_controller'],
            func: function(sprite, script) {
                var x = script.getNumberValue('X');
                var y = script.getNumberValue('Y');
                var pixel = parseInt(script.getField('PIXEL'));
                return Entry.byrobot_petrone_v2_controller.setDisplayDrawPoint(
                    script,
                    0x31,
                    x,
                    y,
                    pixel
                );
            },
        },
        byrobot_petrone_v2_controller_controller_display_draw_line: {
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
                    type: 'Dropdown',
                    options: [
                        [
                            Lang.Blocks
                                .byrobot_petrone_v2_controller_display_pixel_black,
                            '0',
                        ],
                        [
                            Lang.Blocks
                                .byrobot_petrone_v2_controller_display_pixel_white,
                            '1',
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
                                .byrobot_petrone_v2_controller_display_line_solid,
                            '0',
                        ],
                        [
                            Lang.Blocks
                                .byrobot_petrone_v2_controller_display_line_dotted,
                            '1',
                        ],
                        [
                            Lang.Blocks
                                .byrobot_petrone_v2_controller_display_line_dashed,
                            '2',
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
                params: [
                    {
                        type: 'text',
                        params: ['32'],
                    },
                    {
                        type: 'text',
                        params: ['16'],
                    },
                    {
                        type: 'text',
                        params: ['96'],
                    },
                    {
                        type: 'text',
                        params: ['48'],
                    },
                    null,
                    null,
                    null,
                ],
                type:
                    'byrobot_petrone_v2_controller_controller_display_draw_line',
            },
            paramsKeyMap: {
                X1: 0,
                Y1: 1,
                X2: 2,
                Y2: 3,
                PIXEL: 4,
                LINE: 5,
            },
            class: 'byrobot_petrone_v2_controller_controller_display',
            isNotFor: ['byrobot_petrone_v2_controller'],
            func: function(sprite, script) {
                var x1 = script.getNumberValue('X1');
                var y1 = script.getNumberValue('Y1');
                var x2 = script.getNumberValue('X2');
                var y2 = script.getNumberValue('Y2');
                var pixel = parseInt(script.getField('PIXEL'));
                var line = parseInt(script.getField('LINE'));
                return Entry.byrobot_petrone_v2_controller.setDisplayDrawLine(
                    script,
                    0x31,
                    x1,
                    y1,
                    x2,
                    y2,
                    pixel,
                    line
                );
            },
        },
        byrobot_petrone_v2_controller_controller_display_draw_rect: {
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
                    type: 'Dropdown',
                    options: [
                        [
                            Lang.Blocks
                                .byrobot_petrone_v2_controller_display_pixel_black,
                            '0',
                        ],
                        [
                            Lang.Blocks
                                .byrobot_petrone_v2_controller_display_pixel_white,
                            '1',
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
                                .byrobot_petrone_v2_controller_display_flagfill_off,
                            '0',
                        ],
                        [
                            Lang.Blocks
                                .byrobot_petrone_v2_controller_display_flagfill_on,
                            '1',
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
                                .byrobot_petrone_v2_controller_display_line_solid,
                            '0',
                        ],
                        [
                            Lang.Blocks
                                .byrobot_petrone_v2_controller_display_line_dotted,
                            '1',
                        ],
                        [
                            Lang.Blocks
                                .byrobot_petrone_v2_controller_display_line_dashed,
                            '2',
                        ],
                    ],
                    value: '2',
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
                params: [
                    {
                        type: 'text',
                        params: ['64'],
                    },
                    {
                        type: 'text',
                        params: ['32'],
                    },
                    {
                        type: 'text',
                        params: ['32'],
                    },
                    {
                        type: 'text',
                        params: ['16'],
                    },
                    null,
                    null,
                    null,
                    null,
                ],
                type:
                    'byrobot_petrone_v2_controller_controller_display_draw_rect',
            },
            paramsKeyMap: {
                X: 0,
                Y: 1,
                WIDTH: 2,
                HEIGHT: 3,
                PIXEL: 4,
                FLAGFILL: 5,
                LINE: 6,
            },
            class: 'byrobot_petrone_v2_controller_controller_display',
            isNotFor: ['byrobot_petrone_v2_controller'],
            func: function(sprite, script) {
                var x = script.getNumberValue('X');
                var y = script.getNumberValue('Y');
                var width = script.getNumberValue('WIDTH');
                var height = script.getNumberValue('HEIGHT');
                var pixel = parseInt(script.getField('PIXEL'));
                var flagFill = parseInt(script.getField('FLAGFILL'));
                var line = parseInt(script.getField('LINE'));
                return Entry.byrobot_petrone_v2_controller.setDisplayDrawRect(
                    script,
                    0x31,
                    x,
                    y,
                    width,
                    height,
                    pixel,
                    flagFill,
                    line
                );
            },
        },
        byrobot_petrone_v2_controller_controller_display_draw_circle: {
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
                    type: 'Dropdown',
                    options: [
                        [
                            Lang.Blocks
                                .byrobot_petrone_v2_controller_display_pixel_black,
                            '0',
                        ],
                        [
                            Lang.Blocks
                                .byrobot_petrone_v2_controller_display_pixel_white,
                            '1',
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
                                .byrobot_petrone_v2_controller_display_flagfill_off,
                            '0',
                        ],
                        [
                            Lang.Blocks
                                .byrobot_petrone_v2_controller_display_flagfill_on,
                            '1',
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
                params: [
                    {
                        type: 'text',
                        params: ['64'],
                    },
                    {
                        type: 'text',
                        params: ['32'],
                    },
                    {
                        type: 'text',
                        params: ['24'],
                    },
                    null,
                    null,
                    null,
                ],
                type:
                    'byrobot_petrone_v2_controller_controller_display_draw_circle',
            },
            paramsKeyMap: {
                X: 0,
                Y: 1,
                RADIUS: 2,
                PIXEL: 3,
                FLAGFILL: 4,
            },
            class: 'byrobot_petrone_v2_controller_controller_display',
            isNotFor: ['byrobot_petrone_v2_controller'],
            func: function(sprite, script) {
                var x = script.getNumberValue('X');
                var y = script.getNumberValue('Y');
                var radius = script.getNumberValue('RADIUS');
                var pixel = parseInt(script.getField('PIXEL'));
                var flagFill = parseInt(script.getField('FLAGFILL'));
                return Entry.byrobot_petrone_v2_controller.setDisplayDrawCircle(
                    script,
                    0x31,
                    x,
                    y,
                    radius,
                    pixel,
                    flagFill
                );
            },
        },
        byrobot_petrone_v2_controller_controller_display_draw_string: {
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
                    type: 'Dropdown',
                    options: [
                        [
                            Lang.Blocks
                                .byrobot_petrone_v2_controller_display_font_5x8,
                            '0',
                        ],
                        [
                            Lang.Blocks
                                .byrobot_petrone_v2_controller_display_font_10x16,
                            '1',
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
                                .byrobot_petrone_v2_controller_display_pixel_black,
                            '0',
                        ],
                        [
                            Lang.Blocks
                                .byrobot_petrone_v2_controller_display_pixel_white,
                            '1',
                        ],
                    ],
                    value: '1',
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
                    {
                        type: 'text',
                        params: ['4'],
                    },
                    {
                        type: 'text',
                        params: ['24'],
                    },
                    null,
                    null,
                    {
                        type: 'text',
                        params: ['{Petrone V2}'],
                    },
                    null,
                ],
                type:
                    'byrobot_petrone_v2_controller_controller_display_draw_string',
            },
            paramsKeyMap: {
                X: 0,
                Y: 1,
                FONT: 2,
                PIXEL: 3,
                STRING: 4,
            },
            class: 'byrobot_petrone_v2_controller_controller_display',
            isNotFor: ['byrobot_petrone_v2_controller'],
            func: function(sprite, script) {
                var x = script.getNumberValue('X');
                var y = script.getNumberValue('Y');
                var font = parseInt(script.getField('FONT'));
                var pixel = parseInt(script.getField('PIXEL'));
                var string = script.getStringValue('STRING');
                return Entry.byrobot_petrone_v2_controller.setDisplayDrawString(
                    script,
                    0x31,
                    x,
                    y,
                    font,
                    pixel,
                    string
                );
            },
        },
        byrobot_petrone_v2_controller_controller_display_draw_string_align: {
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
                    type: 'Dropdown',
                    options: [
                        [
                            Lang.Blocks
                                .byrobot_petrone_v2_controller_display_align_left,
                            '0',
                        ],
                        [
                            Lang.Blocks
                                .byrobot_petrone_v2_controller_display_align_center,
                            '1',
                        ],
                        [
                            Lang.Blocks
                                .byrobot_petrone_v2_controller_display_align_right,
                            '2',
                        ],
                    ],
                    value: '0',
                    fontSize: 11,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [
                            Lang.Blocks
                                .byrobot_petrone_v2_controller_display_font_5x8,
                            '0',
                        ],
                        [
                            Lang.Blocks
                                .byrobot_petrone_v2_controller_display_font_10x16,
                            '1',
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
                                .byrobot_petrone_v2_controller_display_pixel_black,
                            '0',
                        ],
                        [
                            Lang.Blocks
                                .byrobot_petrone_v2_controller_display_pixel_white,
                            '1',
                        ],
                    ],
                    value: '1',
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
                    {
                        type: 'text',
                        params: ['0'],
                    },
                    {
                        type: 'text',
                        params: ['128'],
                    },
                    {
                        type: 'text',
                        params: ['24'],
                    },
                    null,
                    null,
                    null,
                    {
                        type: 'text',
                        params: ['BYROBOT & U'],
                    },
                    null,
                ],
                type:
                    'byrobot_petrone_v2_controller_controller_display_draw_string_align',
            },
            paramsKeyMap: {
                XSTART: 0,
                XEND: 1,
                Y: 2,
                ALIGN: 3,
                FONT: 4,
                PIXEL: 5,
                STRING: 6,
            },
            class: 'byrobot_petrone_v2_controller_controller_display',
            isNotFor: ['byrobot_petrone_v2_controller'],
            func: function(sprite, script) {
                var xStart = script.getNumberValue('XSTART');
                var xEnd = script.getNumberValue('XEND');
                var y = script.getNumberValue('Y');
                var align = parseInt(script.getField('ALIGN'));
                var font = parseInt(script.getField('FONT'));
                var pixel = parseInt(script.getField('PIXEL'));
                var string = script.getStringValue('STRING');
                return Entry.byrobot_petrone_v2_controller.setDisplayDrawStringAlign(
                    script,
                    0x31,
                    xStart,
                    xEnd,
                    y,
                    align,
                    font,
                    pixel,
                    string
                );
            },
        },
        byrobot_petrone_v2_controller_controller_buzzer_off: {
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
                type: 'byrobot_petrone_v2_controller_controller_buzzer_off',
            },
            paramsKeyMap: {},
            class: 'byrobot_petrone_v2_controller_buzzer',
            isNotFor: ['byrobot_petrone_v2_controller'],
            func: function(sprite, script) {
                return Entry.byrobot_petrone_v2_controller.setBuzzerStop(
                    script
                );
            },
        },
        byrobot_petrone_v2_controller_controller_buzzer_scale: {
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
                                .byrobot_petrone_v2_controller_buzzer_mute,
                            '-1',
                        ],
                        [
                            Lang.Blocks.byrobot_petrone_v2_controller_buzzer_c,
                            '0',
                        ],
                        [
                            Lang.Blocks.byrobot_petrone_v2_controller_buzzer_cs,
                            '1',
                        ],
                        [
                            Lang.Blocks.byrobot_petrone_v2_controller_buzzer_d,
                            '2',
                        ],
                        [
                            Lang.Blocks.byrobot_petrone_v2_controller_buzzer_ds,
                            '3',
                        ],
                        [
                            Lang.Blocks.byrobot_petrone_v2_controller_buzzer_e,
                            '4',
                        ],
                        [
                            Lang.Blocks.byrobot_petrone_v2_controller_buzzer_f,
                            '5',
                        ],
                        [
                            Lang.Blocks.byrobot_petrone_v2_controller_buzzer_fs,
                            '6',
                        ],
                        [
                            Lang.Blocks.byrobot_petrone_v2_controller_buzzer_g,
                            '7',
                        ],
                        [
                            Lang.Blocks.byrobot_petrone_v2_controller_buzzer_gs,
                            '8',
                        ],
                        [
                            Lang.Blocks.byrobot_petrone_v2_controller_buzzer_a,
                            '9',
                        ],
                        [
                            Lang.Blocks.byrobot_petrone_v2_controller_buzzer_as,
                            '10',
                        ],
                        [
                            Lang.Blocks.byrobot_petrone_v2_controller_buzzer_b,
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
                type: 'byrobot_petrone_v2_controller_controller_buzzer_scale',
            },
            paramsKeyMap: {
                OCTAVE: 0,
                SCALE: 1,
            },
            class: 'byrobot_petrone_v2_controller_buzzer',
            isNotFor: ['byrobot_petrone_v2_controller'],
            func: function(sprite, script) {
                var octave = parseInt(script.getField('OCTAVE'));
                var scale = parseInt(script.getField('SCALE'));

                if (scale == -1)
                    return Entry.byrobot_petrone_v2_controller.setBuzzerMute(
                        script,
                        60000,
                        false,
                        true
                    );
                else
                    return Entry.byrobot_petrone_v2_controller.setBuzzerScale(
                        script,
                        octave,
                        scale,
                        60000,
                        false,
                        true
                    );
            },
        },
        byrobot_petrone_v2_controller_controller_buzzer_scale_delay: {
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
                                .byrobot_petrone_v2_controller_buzzer_mute,
                            '-1',
                        ],
                        [
                            Lang.Blocks.byrobot_petrone_v2_controller_buzzer_c,
                            '0',
                        ],
                        [
                            Lang.Blocks.byrobot_petrone_v2_controller_buzzer_cs,
                            '1',
                        ],
                        [
                            Lang.Blocks.byrobot_petrone_v2_controller_buzzer_d,
                            '2',
                        ],
                        [
                            Lang.Blocks.byrobot_petrone_v2_controller_buzzer_ds,
                            '3',
                        ],
                        [
                            Lang.Blocks.byrobot_petrone_v2_controller_buzzer_e,
                            '4',
                        ],
                        [
                            Lang.Blocks.byrobot_petrone_v2_controller_buzzer_f,
                            '5',
                        ],
                        [
                            Lang.Blocks.byrobot_petrone_v2_controller_buzzer_fs,
                            '6',
                        ],
                        [
                            Lang.Blocks.byrobot_petrone_v2_controller_buzzer_g,
                            '7',
                        ],
                        [
                            Lang.Blocks.byrobot_petrone_v2_controller_buzzer_gs,
                            '8',
                        ],
                        [
                            Lang.Blocks.byrobot_petrone_v2_controller_buzzer_a,
                            '9',
                        ],
                        [
                            Lang.Blocks.byrobot_petrone_v2_controller_buzzer_as,
                            '10',
                        ],
                        [
                            Lang.Blocks.byrobot_petrone_v2_controller_buzzer_b,
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
                    'byrobot_petrone_v2_controller_controller_buzzer_scale_delay',
            },
            paramsKeyMap: {
                OCTAVE: 0,
                SCALE: 1,
                TIME: 2,
            },
            class: 'byrobot_petrone_v2_controller_buzzer',
            isNotFor: ['byrobot_petrone_v2_controller'],
            func: function(sprite, script) {
                var octave = parseInt(script.getField('OCTAVE'));
                var scale = parseInt(script.getField('SCALE'));
                var time = parseInt(script.getNumberValue('TIME') * 1000);

                if (scale == -1)
                    return Entry.byrobot_petrone_v2_controller.setBuzzerMute(
                        script,
                        time,
                        true,
                        true
                    );
                else
                    return Entry.byrobot_petrone_v2_controller.setBuzzerScale(
                        script,
                        octave,
                        scale,
                        time,
                        true,
                        true
                    );
            },
        },
        byrobot_petrone_v2_controller_controller_buzzer_scale_reserve: {
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
                                .byrobot_petrone_v2_controller_buzzer_mute,
                            '-1',
                        ],
                        [
                            Lang.Blocks.byrobot_petrone_v2_controller_buzzer_c,
                            '0',
                        ],
                        [
                            Lang.Blocks.byrobot_petrone_v2_controller_buzzer_cs,
                            '1',
                        ],
                        [
                            Lang.Blocks.byrobot_petrone_v2_controller_buzzer_d,
                            '2',
                        ],
                        [
                            Lang.Blocks.byrobot_petrone_v2_controller_buzzer_ds,
                            '3',
                        ],
                        [
                            Lang.Blocks.byrobot_petrone_v2_controller_buzzer_e,
                            '4',
                        ],
                        [
                            Lang.Blocks.byrobot_petrone_v2_controller_buzzer_f,
                            '5',
                        ],
                        [
                            Lang.Blocks.byrobot_petrone_v2_controller_buzzer_fs,
                            '6',
                        ],
                        [
                            Lang.Blocks.byrobot_petrone_v2_controller_buzzer_g,
                            '7',
                        ],
                        [
                            Lang.Blocks.byrobot_petrone_v2_controller_buzzer_gs,
                            '8',
                        ],
                        [
                            Lang.Blocks.byrobot_petrone_v2_controller_buzzer_a,
                            '9',
                        ],
                        [
                            Lang.Blocks.byrobot_petrone_v2_controller_buzzer_as,
                            '10',
                        ],
                        [
                            Lang.Blocks.byrobot_petrone_v2_controller_buzzer_b,
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
                    'byrobot_petrone_v2_controller_controller_buzzer_scale_reserve',
            },
            paramsKeyMap: {
                OCTAVE: 0,
                SCALE: 1,
                TIME: 2,
            },
            class: 'byrobot_petrone_v2_controller_buzzer',
            isNotFor: ['byrobot_petrone_v2_controller'],
            func: function(sprite, script) {
                var octave = parseInt(script.getField('OCTAVE'));
                var scale = parseInt(script.getField('SCALE'));
                var time = parseInt(script.getNumberValue('TIME') * 1000);

                if (scale == -1)
                    return Entry.byrobot_petrone_v2_controller.setBuzzerMute(
                        script,
                        time,
                        false,
                        false
                    );
                else
                    return Entry.byrobot_petrone_v2_controller.setBuzzerScale(
                        script,
                        octave,
                        scale,
                        time,
                        false,
                        false
                    );
            },
        },
        byrobot_petrone_v2_controller_controller_buzzer_hz: {
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
                type: 'byrobot_petrone_v2_controller_controller_buzzer_hz',
            },
            paramsKeyMap: {
                HZ: 0,
            },
            class: 'byrobot_petrone_v2_controller_buzzer',
            isNotFor: ['byrobot_petrone_v2_controller'],
            func: function(sprite, script) {
                var hz = parseInt(script.getNumberValue('HZ', script));
                return Entry.byrobot_petrone_v2_controller.setBuzzerHz(
                    script,
                    hz,
                    60000,
                    false,
                    true
                );
            },
        },
        byrobot_petrone_v2_controller_controller_buzzer_hz_delay: {
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
                    'byrobot_petrone_v2_controller_controller_buzzer_hz_delay',
            },
            paramsKeyMap: {
                HZ: 0,
                TIME: 1,
            },
            class: 'byrobot_petrone_v2_controller_buzzer',
            isNotFor: ['byrobot_petrone_v2_controller'],
            func: function(sprite, script) {
                var hz = parseInt(script.getNumberValue('HZ', script));
                var time = parseInt(script.getNumberValue('TIME') * 1000);
                return Entry.byrobot_petrone_v2_controller.setBuzzerHz(
                    script,
                    hz,
                    time,
                    true,
                    true
                );
            },
        },
        byrobot_petrone_v2_controller_controller_buzzer_hz_reserve: {
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
                    'byrobot_petrone_v2_controller_controller_buzzer_hz_reserve',
            },
            paramsKeyMap: {
                HZ: 0,
                TIME: 1,
            },
            class: 'byrobot_petrone_v2_controller_buzzer',
            isNotFor: ['byrobot_petrone_v2_controller'],
            func: function(sprite, script) {
                var hz = parseInt(script.getNumberValue('HZ', script));
                var time = parseInt(script.getNumberValue('TIME') * 1000);
                return Entry.byrobot_petrone_v2_controller.setBuzzerHz(
                    script,
                    hz,
                    time,
                    false,
                    false
                );
            },
        },
        byrobot_petrone_v2_controller_controller_vibrator_off: {
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
                type: 'byrobot_petrone_v2_controller_controller_vibrator_off',
            },
            paramsKeyMap: {},
            class: 'byrobot_petrone_v2_controller_vibrator',
            isNotFor: ['byrobot_petrone_v2_controller'],
            func: function(sprite, script) {
                return Entry.byrobot_petrone_v2_controller.setVibratorStop(
                    script
                );
            },
        },
        byrobot_petrone_v2_controller_controller_vibrator_on_delay: {
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
                    'byrobot_petrone_v2_controller_controller_vibrator_on_delay',
            },
            paramsKeyMap: {
                TIMEON: 0,
            },
            class: 'byrobot_petrone_v2_controller_vibrator',
            isNotFor: ['byrobot_petrone_v2_controller'],
            func: function(sprite, script) {
                var timeOn = parseInt(script.getNumberValue('TIMEON') * 1000);
                return Entry.byrobot_petrone_v2_controller.setVibrator(
                    script,
                    timeOn,
                    0,
                    timeOn,
                    true,
                    true
                );
            },
        },
        byrobot_petrone_v2_controller_controller_vibrator_on_reserve: {
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
                    'byrobot_petrone_v2_controller_controller_vibrator_on_reserve',
            },
            paramsKeyMap: {
                TIMEON: 0,
            },
            class: 'byrobot_petrone_v2_controller_vibrator',
            isNotFor: ['byrobot_petrone_v2_controller'],
            func: function(sprite, script) {
                var timeOn = parseInt(script.getNumberValue('TIMEON') * 1000);
                return Entry.byrobot_petrone_v2_controller.setVibrator(
                    script,
                    timeOn,
                    0,
                    timeOn,
                    false,
                    false
                );
            },
        },
        byrobot_petrone_v2_controller_controller_vibrator_delay: {
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
                type: 'byrobot_petrone_v2_controller_controller_vibrator_delay',
            },
            paramsKeyMap: {
                TIMEON: 0,
                TIMEOFF: 1,
                TIMERUN: 2,
            },
            class: 'byrobot_petrone_v2_controller_vibrator',
            isNotFor: ['byrobot_petrone_v2_controller'],
            func: function(sprite, script) {
                var timeOn = parseInt(script.getNumberValue('TIMEON') * 1000);
                var timeOff = parseInt(script.getNumberValue('TIMEOFF') * 1000);
                var timeRun = parseInt(script.getNumberValue('TIMERUN') * 1000);
                return Entry.byrobot_petrone_v2_controller.setVibrator(
                    script,
                    timeOn,
                    timeOff,
                    timeRun,
                    true,
                    true
                );
            },
        },
        byrobot_petrone_v2_controller_controller_vibrator_reserve: {
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
                    'byrobot_petrone_v2_controller_controller_vibrator_reserve',
            },
            paramsKeyMap: {
                TIMEON: 0,
                TIMEOFF: 1,
                TIMERUN: 2,
            },
            class: 'byrobot_petrone_v2_controller_vibrator',
            isNotFor: ['byrobot_petrone_v2_controller'],
            func: function(sprite, script) {
                var timeOn = parseInt(script.getNumberValue('TIMEON') * 1000);
                var timeOff = parseInt(script.getNumberValue('TIMEOFF') * 1000);
                var timeRun = parseInt(script.getNumberValue('TIMERUN') * 1000);
                return Entry.byrobot_petrone_v2_controller.setVibrator(
                    script,
                    timeOn,
                    timeOff,
                    timeRun,
                    false,
                    false
                );
            },
        },
        /* BYROBOT PetroneV2 Controller End */
        //endregion byrobot 바이로봇
    };
};
