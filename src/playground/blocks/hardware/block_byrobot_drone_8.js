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

Entry.byrobot_drone_8 =
{
    id: 'F.B',
    name: 'byrobot_drone_8',
    url: 'http://www.byrobot.co.kr/',
    imageName: 'byrobot_drone_8.png',
    title: {
        "en": "BYROBOT Drone 8",
        "ko": "바이로봇 드론 8"
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
            this.transferCommand(0x10, 0x01, 0);       // 드론, command = 0x01 (Stop)
            this.transferVibrator(0, 0, 0, 0);
            this.transferbuzzer(0, 0, 0);
            this.transferLightManual(0x10, 0xffff, 0);   // LED 초기화(모두 꺼짐)
            this.transferLightManual(0x20, 0xffff, 0);   // LED 초기화(모두 꺼짐)
            this.transferLightModeColor(0x10, 0x21, 200, 255, 0, 0); // LED 초기화(드론)
            this.transferLightModeColor(0x20, 0x21, 200, 255, 0, 0); // LED 초기화(조종기)
        }
    },


    // Entry 좌측 하단 하드웨어 모니터 화면에 표시하는 속성
    // listPorts와 ports 두 곳 동시에 동일한 속성을 표시할 수는 없음
    monitorTemplate:
    {
        /* 센서창 가림 현상을 해결하기 위해서 주석 처리함(2017.11.06)
        imgPath: "hw/byrobot_drone_8.png",      // 배경 이미지
        width: 256,     // 이미지의 폭
        height: 256,    // 이미지의 높이
        */

        // 모니터 화면 상단에 차례대로 나열하는 값
        listPorts: {
            state_modeFlight:               {name: 'Flight Mode',                   type: 'input',  pos: { x: 0, y: 0 }},
            state_modeControlFlight:        {name: 'Control Flight Mode',           type: 'input',  pos: { x: 0, y: 0 }},
            state_modeMovement:             {name: 'Movement Mode',                 type: 'input',  pos: { x: 0, y: 0 }},
            state_headless:                 {name: 'Headless',                      type: 'input',  pos: { x: 0, y: 0 }},
            state_controlSpeed:             {name: 'Control Speed',                 type: 'input',  pos: { x: 0, y: 0 }},
            state_sensorOrientation:        {name: 'Sensor Orientation',            type: 'input',  pos: { x: 0, y: 0 }},
            state_battery:                  {name: 'Battery',                       type: 'input',  pos: { x: 0, y: 0 }},
            motion_angleRoll:               {name: 'Roll',                          type: 'input',  pos: { x: 0, y: 0 }},
            motion_anglePitch:              {name: 'Pitch',                         type: 'input',  pos: { x: 0, y: 0 }},
            motion_angleYaw:                {name: 'Yaw',                           type: 'input',  pos: { x: 0, y: 0 }},
            motion_accX:                    {name: 'Accel X',                       type: 'input',  pos: { x: 0, y: 0 }},
            motion_accY:                    {name: 'Accel Y',                       type: 'input',  pos: { x: 0, y: 0 }},
            motion_accZ:                    {name: 'Accel Z',                       type: 'input',  pos: { x: 0, y: 0 }},
            motion_gyroRoll:                {name: 'Gyro Roll',                     type: 'input',  pos: { x: 0, y: 0 }},
            motion_gyroPitch:               {name: 'Gyro Pitch',                    type: 'input',  pos: { x: 0, y: 0 }},
            motion_gyroYaw:                 {name: 'Gyro Yaw',                      type: 'input',  pos: { x: 0, y: 0 }},
            positionX:                      {name: 'Position X',                    type: 'input',  pos: { x: 0, y: 0 }},
            positionY:                      {name: 'Position Y',                    type: 'input',  pos: { x: 0, y: 0 }},
            positionZ:                      {name: 'Position Z',                    type: 'input',  pos: { x: 0, y: 0 }},
            altitude:                       {name: 'Altitude',                      type: 'input',  pos: { x: 0, y: 0 }},
            range_height:                   {name: 'Range Height',                  type: 'input',  pos: { x: 0, y: 0 }},
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


    transferDisplayClear: function(target, pixel, clearAll, x, y, width, height)
    {
        if (clearAll)
        {
            // 전송
            Entry.hw.setDigitalPortValue('target', target);
            Entry.hw.setDigitalPortValue('display_clearall_pixel', pixel);

            Entry.hw.update();

            delete Entry.hw.sendQueue['target'];
            delete Entry.hw.sendQueue['display_clearall_pixel'];
        }
        else
        {
            // 범위 조정
            x      = this.fit(-1024, x, 1024);
            y      = this.fit(-1024, y, 1024);
            width  = this.fit(0, width, 128);
            height = this.fit(0, height, 64);

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


    transferDisplayInvert: function(target, x, y, width, height)
    {
        // 범위 조정
        x      = this.fit(-1024, x, 1024);
        y      = this.fit(-1024, y, 1024);
        width  = this.fit(0, width, 128);
        height = this.fit(0, height, 64);

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


    transferDisplayDrawPoint: function(target, x, y, pixel)
    {
        // 범위 조정
        x = this.fit(-1024, x, 1024);
        y = this.fit(-1024, y, 1024);

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


    transferDisplayDrawLine: function(target, x1, y1, x2, y2, pixel, line)
    {
        // 범위 조정
        x1 = this.fit(-1024, x1, 1024);
        y1 = this.fit(-1024, y1, 1024);
        x2 = this.fit(-1024, x2, 1024);
        y2 = this.fit(-1024, y2, 1024);

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


    transferDisplayDrawRect: function(target, x, y, width, height, pixel, flagFill, line)
    {
        // 범위 조정
        x      = this.fit(-1024, x, 1024);
        y      = this.fit(-1024, y, 1024);
        width  = this.fit(0, width, 128);
        height = this.fit(0, height, 64);

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


    transferDisplayDrawCircle: function(target, x, y, radius, pixel, flagFill)
    {
        // 범위 조정
        x      = this.fit(-1024, x, 1024);
        y      = this.fit(-1024, y, 1024);
        radius = this.fit(1, radius, 200);

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


    transferDisplayDrawString: function(target, x, y, font, pixel, string)
    {
        // 범위 조정
        x = this.fit(-1024, x, 1024);
        y = this.fit(-1024, y, 1024);

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


    transferDisplayDrawStringAlign: function(target, xStart, xEnd, y, align, font, pixel, string)
    {
        // 범위 조정
        xStart = this.fit(-1024, xStart, 1024);
        xEnd   = this.fit(xStart, xEnd, 1025)
        y      = this.fit(-1024, y, 1024);

        // 전송
        Entry.hw.setDigitalPortValue('target', target);
        Entry.hw.setDigitalPortValue('display_draw_string_align_x_start', xStart);
        Entry.hw.setDigitalPortValue('display_draw_string_align_x_end', xEnd);
        Entry.hw.setDigitalPortValue('display_draw_string_align_y', y);
        Entry.hw.setDigitalPortValue('display_draw_string_align_align', align);
        Entry.hw.setDigitalPortValue('display_draw_string_align_font', font);
        Entry.hw.setDigitalPortValue('display_draw_string_align_pixel', pixel);
        Entry.hw.setDigitalPortValue('display_draw_string_align_string', string);

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


    transferVibrator: function(mode, timeOn, timeOff, timeRun)
    {
        // 범위 조정
        timeOn  = this.fit(1, timeOn, 60000);
        timeOff = this.fit(1, timeOff, 60000);

        // 전송
        Entry.hw.setDigitalPortValue('target', 0x20);
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


    transferMotorSingle: function(motorIndex, motorRotation, motorSpeed)
    {
        // 범위 조정
        motorSpeed = this.fit(0, motorSpeed, 4096);

        // 전송
        Entry.hw.setDigitalPortValue('target', 0x10);
        Entry.hw.setDigitalPortValue('motorsingle_target', motorIndex);
        Entry.hw.setDigitalPortValue('motorsingle_rotation', motorRotation);
        Entry.hw.setDigitalPortValue('motorsingle_value', motorSpeed);

        Entry.hw.update();

        delete Entry.hw.sendQueue['target'];
        delete Entry.hw.sendQueue['motorsingle_target'];
        delete Entry.hw.sendQueue['motorsingle_rotation'];
        delete Entry.hw.sendQueue['motorsingle_value'];
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


    transferControlQuad: function(roll, pitch, yaw, throttle)
    {
        // 범위 조정
        roll     = this.fit(-100, roll, 100);
        pitch    = this.fit(-100, pitch, 100);
        yaw      = this.fit(-100, yaw, 100);
        throttle = this.fit(-100, throttle, 100);

        // 전송
        Entry.hw.setDigitalPortValue('target', 0x10);
        Entry.hw.setDigitalPortValue('control_quad8_roll', roll);
        Entry.hw.setDigitalPortValue('control_quad8_pitch', pitch);
        Entry.hw.setDigitalPortValue('control_quad8_yaw', yaw);
        Entry.hw.setDigitalPortValue('control_quad8_throttle', throttle);

        Entry.hw.update();

        delete Entry.hw.sendQueue['target'];
        delete Entry.hw.sendQueue['control_quad8_roll'];
        delete Entry.hw.sendQueue['control_quad8_pitch'];
        delete Entry.hw.sendQueue['control_quad8_yaw'];
        delete Entry.hw.sendQueue['control_quad8_throttle'];
    },


    transferControlPosition: function(x, y, z, velocity, heading, rotationalVelocity)
    {
        // 범위 조정
        x                   = this.fit(-100, x, 100);
        y                   = this.fit(-100, y, 100);
        z                   = this.fit(-100, z, 100);
        velocity            = this.fit(-100, velocity, 100);
        heading             = this.fit(-360, heading, 360);
        rotationalVelocity  = this.fit(-360, rotationalVelocity, 360);

        // 전송
        Entry.hw.setDigitalPortValue('target', 0x10);
        Entry.hw.setDigitalPortValue('control_position_x', x);
        Entry.hw.setDigitalPortValue('control_position_y', y);
        Entry.hw.setDigitalPortValue('control_position_z', z);
        Entry.hw.setDigitalPortValue('control_position_velocity', velocity);
        Entry.hw.setDigitalPortValue('control_position_heading', heading);
        Entry.hw.setDigitalPortValue('control_position_rotational_velocity', rotationalVelocity);

        Entry.hw.update();

        delete Entry.hw.sendQueue['target'];
        delete Entry.hw.sendQueue['control_position_x'];
        delete Entry.hw.sendQueue['control_position_y'];
        delete Entry.hw.sendQueue['control_position_z'];
        delete Entry.hw.sendQueue['control_position_velocity'];
        delete Entry.hw.sendQueue['control_position_heading'];
        delete Entry.hw.sendQueue['control_position_rotational_velocity'];
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


    // 화면 전체 지우기, 선택 영역 지우기
    setDisplayClear: function(script, target, pixel, clearAll, x, y, width, height)
    {
        switch (this.checkFinish(script, 40))
        {
            case 'Start':
                {
                    this.transferDisplayClear(target, pixel, clearAll, x, y, width, height);
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


    // 선택 영역 반전
    setDisplayInvert: function(script, target, x, y, width, height)
    {
        switch (this.checkFinish(script, 40))
        {
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


    // 화면에 점 찍기
    setDisplayDrawPoint: function(script, target, x, y, pixel)
    {
        switch (this.checkFinish(script, 40))
        {
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


    // 화면에 선 그리기
    setDisplayDrawLine: function(script, target, x1, y1, x2, y2, pixel, line)
    {
        switch (this.checkFinish(script, 40))
        {
            case 'Start':
                {
                    this.transferDisplayDrawLine(target, x1, y1, x2, y2, pixel, line);
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


    // 화면에 사각형 그리기
    setDisplayDrawRect: function(script, target, x, y, width, height, pixel, flagFill, line)
    {
        switch (this.checkFinish(script, 40))
        {
            case 'Start':
                {
                    this.transferDisplayDrawRect(target, x, y, width, height, pixel, flagFill, line);
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


    // 화면에 원 그리기
    setDisplayDrawCircle: function(script, target, x, y, radius, pixel, flagFill)
    {
        switch (this.checkFinish(script, 40))
        {
            case 'Start':
                {
                    this.transferDisplayDrawCircle(target, x, y, radius, pixel, flagFill);
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


    // 화면에 문자열 쓰기
    setDisplayDrawString: function(script, target, x, y, font, pixel, string)
    {
        switch (this.checkFinish(script, 40))
        {
            case 'Start':
                {
                    this.transferDisplayDrawString(target, x, y, font, pixel, string);
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


    // 화면에 문자열 정렬하여 그리기
    setDisplayDrawStringAlign: function(script, target, xStart, xEnd, y, align, font, pixel, string)
    {
        switch (this.checkFinish(script, 40))
        {
            case 'Start':
                {
                    this.transferDisplayDrawStringAlign(target, xStart, xEnd, y, align, font, pixel, string);
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


    // 진동 제어
    /*
        Stop            = 0,    // 정지
        Instantally     = 1,    // 즉시 적용
        Continually     = 2,    // 예약
     */
    setVibratorStop: function(script)
    {
        switch (this.checkFinish(script, 40))
        {
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


    setVibrator: function(script, timeOn, timeOff, timeRun, flagDelay, flagInstantly)
    {
        timeRun = this.fit(0, timeRun, 60000);

        var timeDelay = 40;
        if (flagDelay) timeDelay = timeRun;

        switch (this.checkFinish(script, timeDelay))
        {
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


    setEventFlight: function(script, eventFlight, time)
    {
        switch (this.checkFinish(script, time))
        {
            case 'Start':
                {
                    this.transferControlQuad(0, 0, 0, 0); // 기존 입력되었던 조종기 방향 초기화 (수직으로 이륙, 착륙 하도록)
                    this.transferCommand(0x10, 0x07, eventFlight); // 0x07 : CommandType::FlightEvent
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


    sendControlQuadSingle: function(script, controlTarget, value, time, flagDelay)
    {
        var timeDelay = 40;
        if (flagDelay) timeDelay = time;

        switch (this.checkFinish(script, timeDelay))
        {
            case 'Start':
                {
                    // 범위 조정
                    value = this.fit(-100, value, 100);

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
                if (flagDelay)
                {
                    // 블럭을 빠져나갈 때 변경했던 값을 초기화

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


    sendControlQuad: function(script, roll, pitch, yaw, throttle, time, flagDelay)
    {
        var timeDelay = 40;
        if (flagDelay) timeDelay = time;

        switch (this.checkFinish(script, timeDelay))
        {
            case 'Start':
                {
                    this.transferControlQuad(roll, pitch, yaw, throttle);
                }
                return script;

            case 'Running':
                return script;

            case 'Finish':
                if (flagDelay)
                {
                    this.transferControlQuad(0, 0, 0, 0);
                }
                return script.callReturn();

            default:
                return script.callReturn();
        }
    },


    sendControlPosition: function(script, x, y, z, velocity, heading, rotationalVelocity)
    {
        var timeDelay = 40;
        if (flagDelay) timeDelay = time;

        switch (this.checkFinish(script, timeDelay))
        {
            case 'Start':
                {
                    this.transferControlPosition(x, y, z, velocity, heading, rotationalVelocity);
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
Entry.byrobot_drone_8.setLanguage = function ()
{
    return {
        ko: {
            // ko.js에 작성하던 내용
            Blocks: {
                "byrobot_drone_8_common_light_color_cottoncandy":       "구름솜사탕",
                "byrobot_drone_8_common_light_color_emerald":           "에메랄드",
                "byrobot_drone_8_common_light_color_lavender":          "라벤더",
                "byrobot_drone_8_common_light_color_muscat":            "청포도",
                "byrobot_drone_8_common_light_color_strawberrymilk":    "딸기우유",
                "byrobot_drone_8_common_light_color_sunset":            "저녁노을",
                "byrobot_drone_8_common_light_mode_hold":               "켜짐",
                "byrobot_drone_8_common_light_mode_dimming":            "천천히 깜빡임",
                "byrobot_drone_8_common_light_mode_flicker":            "깜빡임",
                "byrobot_drone_8_common_light_mode_flicker_double":     "2번 연속 깜빡임",
                "byrobot_drone_8_common_light_manual_all":              "전체",
                "byrobot_drone_8_common_light_manual_b100":             "밝기 100%",
                "byrobot_drone_8_common_light_manual_b25":              "밝기 25%",
                "byrobot_drone_8_common_light_manual_b50":              "밝기 50%",
                "byrobot_drone_8_common_light_manual_b75":              "밝기 75%",
                "byrobot_drone_8_common_light_manual_blue":             "파랑",
                "byrobot_drone_8_common_light_manual_cyan":             "하늘색",
                "byrobot_drone_8_common_light_manual_green":            "초록",
                "byrobot_drone_8_common_light_manual_magenta":          "자홍",
                "byrobot_drone_8_common_light_manual_off":              "끄기",
                "byrobot_drone_8_common_light_manual_on":               "켜기",
                "byrobot_drone_8_common_light_manual_red":              "빨강",
                "byrobot_drone_8_common_light_manual_white":            "흰색",
                "byrobot_drone_8_common_light_manual_yellow":           "노랑",
                "byrobot_drone_8_common_left":                          "왼쪽",
                "byrobot_drone_8_common_right":                         "오른쪽",
                "byrobot_drone_8_common_roll":                          "Roll",
                "byrobot_drone_8_common_pitch":                         "Pitch",
                "byrobot_drone_8_common_yaw":                           "Yaw",
                "byrobot_drone_8_common_throttle":                      "Throttle",
                "byrobot_drone_8_controller_button":                    "버튼",
                "byrobot_drone_8_controller_button_event":              "버튼 이벤트",
                "byrobot_drone_8_controller_button_front_left_up":      "전면 왼쪽 상단 버튼",
                "byrobot_drone_8_controller_button_front_left_down":    "전면 왼쪽 하단 버튼",
                "byrobot_drone_8_controller_button_front_right_up":     "전면 오른쪽 상단 버튼",
                "byrobot_drone_8_controller_button_front_right_down":   "전면 오른쪽 하단 버튼",
                "byrobot_drone_8_controller_button_top_left":           "상단 왼쪽 버튼",
                "byrobot_drone_8_controller_button_top_right":          "상단 오른쪽 버튼",
                "byrobot_drone_8_controller_button_bottom_left":        "하단 왼쪽 버튼",
                "byrobot_drone_8_controller_button_bottom_right":       "하단 오른쪽 버튼",
                "byrobot_drone_8_controller_button_center_top":         "중앙 위 버튼",
                "byrobot_drone_8_controller_button_center_left":        "중앙 왼쪽 버튼",
                "byrobot_drone_8_controller_button_center_right":       "중앙 오른쪽 버튼",
                "byrobot_drone_8_controller_button_center_bottom":      "중앙 아래쪽 버튼",
                "byrobot_drone_8_controller_buzzer":         "버저",
                "byrobot_drone_8_controller_buzzer_a":       "라",
                "byrobot_drone_8_controller_buzzer_as":      "라#",
                "byrobot_drone_8_controller_buzzer_b":       "시",
                "byrobot_drone_8_controller_buzzer_c":       "도",
                "byrobot_drone_8_controller_buzzer_cs":      "도#",
                "byrobot_drone_8_controller_buzzer_d":       "레",
                "byrobot_drone_8_controller_buzzer_ds":      "레#",
                "byrobot_drone_8_controller_buzzer_e":       "미",
                "byrobot_drone_8_controller_buzzer_f":       "파",
                "byrobot_drone_8_controller_buzzer_fs":      "파#",
                "byrobot_drone_8_controller_buzzer_g":       "솔",
                "byrobot_drone_8_controller_buzzer_gs":      "솔#",
                "byrobot_drone_8_controller_buzzer_mute":    "쉼",
                "byrobot_drone_8_controller_display_align_center":   "가운데",
                "byrobot_drone_8_controller_display_align_left":     "왼쪽",
                "byrobot_drone_8_controller_display_align_right":    "오른쪽",
                "byrobot_drone_8_controller_display_flagfill_off":   "채우지 않음",
                "byrobot_drone_8_controller_display_flagfill_on":    "채움",
                "byrobot_drone_8_controller_display_font_10x16":     "큼",
                "byrobot_drone_8_controller_display_font_5x8":       "작음",
                "byrobot_drone_8_controller_display_line_dashed":    "파선",
                "byrobot_drone_8_controller_display_line_dotted":    "점선",
                "byrobot_drone_8_controller_display_line_solid":     "실선",
                "byrobot_drone_8_controller_display_pixel_black":    "검은색",
                "byrobot_drone_8_controller_display_pixel_white":    "흰색",
                "byrobot_drone_8_controller_joystick_direction_left_up":     "왼쪽 위",
                "byrobot_drone_8_controller_joystick_direction_up":          "위",
                "byrobot_drone_8_controller_joystick_direction_right_up":    "오른쪽 위",
                "byrobot_drone_8_controller_joystick_direction_left":        "왼쪽",
                "byrobot_drone_8_controller_joystick_direction_center":      "중앙",
                "byrobot_drone_8_controller_joystick_direction_right":       "오른쪽",
                "byrobot_drone_8_controller_joystick_direction_left_down":   "왼쪽 아래",
                "byrobot_drone_8_controller_joystick_direction_down":        "아래",
                "byrobot_drone_8_controller_joystick_direction_right_down":  "오른쪽 아래",
                "byrobot_drone_8_controller_joystick_left_direction":        "왼쪽 조이스틱 방향",
                "byrobot_drone_8_controller_joystick_left_event":            "왼쪽 조이스틱 이벤트",
                "byrobot_drone_8_controller_joystick_left_x":                "왼쪽 조이스틱 가로축",
                "byrobot_drone_8_controller_joystick_left_y":                "왼쪽 조이스틱 세로축",
                "byrobot_drone_8_controller_joystick_right_direction":       "오른쪽 조이스틱 방향",
                "byrobot_drone_8_controller_joystick_right_event":           "오른쪽 조이스틱 이벤트",
                "byrobot_drone_8_controller_joystick_right_x":               "오른쪽 조이스틱 가로축",
                "byrobot_drone_8_controller_joystick_right_y":               "오른쪽 조이스틱 세로축",
                "byrobot_drone_8_drone_accel_x":             "가속도 x",
                "byrobot_drone_8_drone_accel_y":             "가속도 y",
                "byrobot_drone_8_drone_accel_z":             "가속도 z",
                "byrobot_drone_8_drone_attitude_pitch":      "자세 Pitch",
                "byrobot_drone_8_drone_attitude_roll":       "자세 Roll",
                "byrobot_drone_8_drone_attitude_yaw":        "자세 Yaw",
                "byrobot_drone_8_drone_control_quad_pitch":             "Pitch",
                "byrobot_drone_8_drone_control_quad_pitch_backward":    "뒤로",
                "byrobot_drone_8_drone_control_quad_pitch_forward":     "앞으로",
                "byrobot_drone_8_drone_control_quad_roll":              "Roll",
                "byrobot_drone_8_drone_control_quad_roll_left":         "왼쪽",
                "byrobot_drone_8_drone_control_quad_roll_right":        "오른쪽",
                "byrobot_drone_8_drone_control_quad_throttle":          "Throttle",
                "byrobot_drone_8_drone_control_quad_throttle_up":       "위",
                "byrobot_drone_8_drone_control_quad_throttle_down":     "아래",
                "byrobot_drone_8_drone_control_quad_yaw":               "Yaw",
                "byrobot_drone_8_drone_control_quad_yaw_left":          "왼쪽 회전",
                "byrobot_drone_8_drone_control_quad_yaw_right":         "오른쪽 회전",
                "byrobot_drone_8_drone_headless_normal":                "off (숙련자용)",
                "byrobot_drone_8_drone_headless_headless":              "on (초보자용)",
                "byrobot_drone_8_drone_gyro_pitch":                 "각속도 Pitch",
                "byrobot_drone_8_drone_gyro_roll":                  "각속도 Roll",
                "byrobot_drone_8_drone_gyro_yaw":                   "각속도 Yaw",
                "byrobot_drone_8_drone_light_color_body":           "몸체",
                "byrobot_drone_8_drone_light_manual_body_blue":     "파랑",
                "byrobot_drone_8_drone_light_manual_body_green":    "초록",
                "byrobot_drone_8_drone_light_manual_body_red":      "빨강",
                "byrobot_drone_8_drone_motor_rotation_clockwise":        "시계 방향",
                "byrobot_drone_8_drone_motor_rotation_counterclockwise": "반시계 방향",
                "byrobot_drone_8_drone_altitude":                    "해발고도",
                "byrobot_drone_8_drone_range_height":                "바닥까지 거리",
                "byrobot_drone_8_drone_state_mode_system":           "시스템 모드",
                "byrobot_drone_8_drone_state_mode_flight":           "비행 동작 상태",
                "byrobot_drone_8_drone_state_headless":              "기본 좌표계",
                "byrobot_drone_8_drone_state_battery":               "배터리",
                "byrobot_drone_8_entryhw_count_transfer_reserved":   "전송 예약된 데이터 수",
            },

            // ko.js에 작성하던 내용
            template: {
                "byrobot_drone_8_controller_buzzer_hz":                   "%1 Hz 소리를 연주 %2",
                "byrobot_drone_8_controller_buzzer_hz_delay":             "%1 Hz 소리를 %2 초 연주 %3",
                "byrobot_drone_8_controller_buzzer_hz_reserve":           "%1 Hz 소리를 %2 초 예약 %3",
                "byrobot_drone_8_controller_buzzer_off":                  "버저 끄기 %1",
                "byrobot_drone_8_controller_buzzer_scale":                "%1 옥타브 %2 을(를) 연주 %3",
                "byrobot_drone_8_controller_buzzer_scale_delay":          "%1 옥타브 %2 을(를) %3 초 연주 %4",
                "byrobot_drone_8_controller_buzzer_scale_reserve":        "%1 옥타브 %2 을(를) %3 초 예약 %4",
                "byrobot_drone_8_controller_display_clear":               "지우기 x %1, y %2, 너비 %3, 높이 %4 %5 %6",
                "byrobot_drone_8_controller_display_clear_all":           "조종기 화면 전체 지우기%1 %2",
                "byrobot_drone_8_controller_display_draw_circle":         "원 x %1, y %2, 반지름 %3 %4 %5 %6",
                "byrobot_drone_8_controller_display_draw_line":           "선 x1 %1, y1 %2, x2 %3, y2 %4 %5 %6 %7",
                "byrobot_drone_8_controller_display_draw_point":          "점 그리기 x %1, y %2 %3 %4",
                "byrobot_drone_8_controller_display_draw_rect":           "사각형 x %1, y %2, 너비 %3, 높이 %4 %5 %6 %7 %8",
                "byrobot_drone_8_controller_display_draw_string":         "문자열 x %1, y %2 %3 %4 입력 %5 %6",
                "byrobot_drone_8_controller_display_draw_string_align":   "문자열 정렬 x1 %1, x2 %2, y %3 %4 %5 %6 입력 %7 %8",
                "byrobot_drone_8_controller_display_invert":              "색반전 x %1, y %2, 너비 %3, 높이 %4 %5",
                "byrobot_drone_8_controller_if_button_press":             "조종기 %1 눌렀을 때",
                "byrobot_drone_8_controller_if_joystick_direction":       "조종기 %1 조이스틱 %2 움직였을 때",
                "byrobot_drone_8_controller_light_color_input":           "조종기 LED 색지정 R %1, G %2, B %3 %4 %5 %6",
                "byrobot_drone_8_controller_light_color_select":          "조종기 LED의 RGB 조합 예시 %1 %2 %3 %4",
                "byrobot_drone_8_controller_light_color_preset":          "조종기 LED %1 %2 %3",
                "byrobot_drone_8_controller_light_manual_single_input":   "조종기 LED %1 밝기 %2 %3",
                "byrobot_drone_8_controller_light_manual_single_off":     "조종기 LED 끄기 %1",
                "byrobot_drone_8_controller_value_button":                "%1",
                "byrobot_drone_8_controller_value_joystick":              "%1",
                "byrobot_drone_8_controller_vibrator_delay":              "진동 %1 초 켜기, %2 초 끄기를 %3 초 실행 %4",
                "byrobot_drone_8_controller_vibrator_off":                "진동 끄기 %1",
                "byrobot_drone_8_controller_vibrator_on_delay":           "진동 %1 초 켜기 %2",
                "byrobot_drone_8_controller_vibrator_on_reserve":         "진동 %1 초 예약 %2",
                "byrobot_drone_8_controller_vibrator_reserve":            "진동 %1 초 켜기, %2 초 끄기를 %3 초 예약 %4",
                "byrobot_drone_8_drone_control_headless":                 "(드론 좌표 기준) Headless mode %1 %2",
                "byrobot_drone_8_drone_control_drone_landing":            "드론 착륙 %1",
                "byrobot_drone_8_drone_control_drone_reset_heading":      "드론 방향 초기화 %1",
                "byrobot_drone_8_drone_control_drone_stop":               "드론 정지 %1",
                "byrobot_drone_8_drone_control_drone_takeoff":            "드론 이륙 %1",
                "byrobot_drone_8_drone_control_quad":                     "드론 Roll %1%, Pitch %2%, Yaw %3%, Throttle %4% 정하기 %5",
                "byrobot_drone_8_drone_control_quad_delay":               "드론 Roll %1%, Pitch %2%, Yaw %3%, Throttle %4% %5초 실행 %6",
                "byrobot_drone_8_drone_control_quad_one":                 "드론 %1 %2% 정하기 %3",
                "byrobot_drone_8_drone_control_quad_one_delay":           "드론 %1 %2% %3 초 실행 %4",
                "byrobot_drone_8_drone_light_color_input":                "드론 %1 LED 색지정 R %2, G %3, B %4 %5 %6 %7",
                "byrobot_drone_8_drone_light_color_select":               "드론 %1 LED의 RGB 조합 예시 %2 %3 %4 %5",
                "byrobot_drone_8_drone_light_color_preset":               "드론 LED %1 %2 %3",
                "byrobot_drone_8_drone_light_manual_single_input":        "드론 LED %1 밝기 %2 %3",
                "byrobot_drone_8_drone_light_manual_single_off":          "드론 LED 끄기 %1",
                "byrobot_drone_8_drone_motor_stop":                       "모터 정지 %1",
                "byrobot_drone_8_drone_motorsingle":                      "%1번 모터를 %2(으)로 회전 %3",
                "byrobot_drone_8_drone_motorsingle_input":                "%1번 모터를 %2(으)로 회전 %3",
                "byrobot_drone_8_drone_motorsingle_rotation":             "%1번 모터를 %2으로 %3(으)로 회전 %4",
                "byrobot_drone_8_drone_value_attitude":                   "%1",
                "byrobot_drone_8_drone_value_motion":                     "%1",
                "byrobot_drone_8_drone_value_sensor":                     "%1",
                "byrobot_drone_8_drone_value_etc":                        "%1",
            },

            Helper: {
                "byrobot_drone_8_controller_buzzer_hz":                   "<br>지정한 주파수의 소리를 계속해서 연주합니다(최대 60초). 권장 사용 범위는 250 ~ 8000 입니다. 4옥타브를 기준으로 도(261), 도#(277), 레(293), 레#(311), 미(329), 파(349), 파#(370), 솔(392), 솔#(415), 라(440), 라#(466), 시(493)입니다. 여기에서 한 옥타브를 올라갈 때마다 주파수 값이 두 배가 됩니다. 한 옥타브를 내려갈 때에는 주파수 값이 절반이 됩니다. 예를 들면 3옥타브의 도는 130.8128Hz, 4옥타브의 도는 261.6256Hz, 5옥타브의 도는 523.2511Hz 입니다. 이 블럭을 만났을 경우 소리가 켜져있거나 예약된 소리가 있다면 모두 삭제합니다. 이 블럭은 연주 명령을 실행 후 바로 다음 블럭으로 넘어갑니다.<br><br><font color='crimson'>#조종기</font> <font color='dodgerblue'>#버저</font> <font color='forestgreen'>#주파수</font> <font color='peru'>#즉시</font>",
                "byrobot_drone_8_controller_buzzer_hz_delay":             "<br>지정한 주파수의 소리를 지정한 시간동안 연주합니다. 권장 사용 범위는 250 ~ 8000 입니다. 4옥타브를 기준으로 도(261), 도#(277), 레(293), 레#(311), 미(329), 파(349), 파#(370), 솔(392), 솔#(415), 라(440), 라#(466), 시(493)입니다. 여기에서 한 옥타브를 올라갈 때마다 주파수 값이 두 배가 됩니다. 한 옥타브를 내려갈 때에는 주파수 값이 절반이 됩니다. 예를 들면 3옥타브의 도는 130.8128Hz, 4옥타브의 도는 261.6256Hz, 5옥타브의 도는 523.2511Hz 입니다. 이 블럭을 만났을 경우 소리가 켜져있거나 예약된 소리가 있다면 모두 삭제합니다. 이 블럭을 사용하면 소리가 끝날때까지 다음 블럭으로 넘어가지 않습니다.<br><br><font color='crimson'>#조종기</font> <font color='dodgerblue'>#버저</font> <font color='forestgreen'>#음계</font> <font color='peru'>#즉시</font> <font color='blueviolet'>#시간지연</font>",
                "byrobot_drone_8_controller_buzzer_hz_reserve":           "<br>지정한 주파수의 소리를 지정한 시간동안 연주하도록 예약합니다. 권장 사용 범위는 250 ~ 8000 입니다. 4옥타브를 기준으로 도(261), 도#(277), 레(293), 레#(311), 미(329), 파(349), 파#(370), 솔(392), 솔#(415), 라(440), 라#(466), 시(493)입니다. 여기에서 한 옥타브를 올라갈 때마다 주파수 값이 두 배가 됩니다. 한 옥타브를 내려갈 때에는 주파수 값이 절반이 됩니다. 예를 들면 3옥타브의 도는 130.8128Hz, 4옥타브의 도는 261.6256Hz, 5옥타브의 도는 523.2511Hz 입니다. 이 블럭은 소리가 나도록 예약하고, 바로 다음 블럭으로 넘어갑니다. 예약은 최대 12개까지 누적할 수 있습니다. 이 블럭은 주로 버저 소리와 함께 다른 행동을 동시에 할 때 사용합니다.<br><br><font color='crimson'>#조종기</font> <font color='dodgerblue'>#버저</font> <font color='forestgreen'>#주파수</font> <font color='peru'>#예약</font>",
                "byrobot_drone_8_controller_buzzer_off":                  "<br>버저 작동을 중단합니다. 예약된 소리가 있다면 모두 삭제합니다.<br><br><font color='crimson'>#조종기</font> <font color='dodgerblue'>#버저끄기</font>",
                "byrobot_drone_8_controller_buzzer_scale":                "<br>지정한 옥타브의 음을 계속해서 연주합니다(최대 60초). 이 블럭을 만났을 경우 소리가 켜져있거나 예약된 소리가 있다면 모두 삭제합니다. 이 블럭은 연주 명령을 실행 후 바로 다음 블럭으로 넘어갑니다.<br><br><font color='crimson'>#조종기</font> <font color='dodgerblue'>#버저</font> <font color='forestgreen'>#음계</font> <font color='peru'>#즉시</font>",
                "byrobot_drone_8_controller_buzzer_scale_delay":          "<br>지정한 옥타브의 음을 지정한 시간동안 연주합니다. 이 블럭을 만났을 경우 소리가 켜져있거나 예약된 소리가 있다면 모두 삭제합니다. 이 블럭을 사용하면 소리가 끝날때까지 다음 블럭으로 넘어가지 않습니다.<br><br><font color='crimson'>#조종기</font> <font color='dodgerblue'>#버저</font> <font color='forestgreen'>#음계</font> <font color='peru'>#즉시</font> <font color='blueviolet'>#시간지연</font>",
                "byrobot_drone_8_controller_buzzer_scale_reserve":        "<br>지정한 옥타브의 음을 지정한 시간동안 연주하도록 예약합니다. 이 블럭은 소리가 나도록 예약하고 바로 다음 블럭으로 넘어갑니다. 예약은 최대 12개까지 누적할 수 있습니다. 이 블럭은 주로 버저 소리와 함께 다른 행동을 동시에 할 때 사용합니다.<br><br><font color='crimson'>#조종기</font> <font color='dodgerblue'>#버저</font> <font color='forestgreen'>#음계</font> <font color='peru'>#예약</font>",
                "byrobot_drone_8_controller_display_clear":               "<br>조종기 OLED 화면의 선택한 영역을 지웁니다. x, y 좌표값과 너비, 높이를 지정합니다. 좌표(x, y) = (가로, 세로) 화면상의 위치입니다. 사용 가능한 값의 범위는 x값과 너비는 (0~128), y값과 높이는 (0~64)입니다.<br><br><font color='crimson'>#조종기</font> <font color='dodgerblue'>#Display</font>",
                "byrobot_drone_8_controller_display_clear_all":           "<br>조종기 OLED 화면 전체를 지웁니다. 흰색/검은색 중에서 원하는 색을 선택할 수 있습니다.<br><br><font color='crimson'>#조종기</font> <font color='dodgerblue'>#Display</font>",
                "byrobot_drone_8_controller_display_draw_circle":         "<br>조종기 OLED 화면에서 지정한 위치에 원을 그립니다.<br><br>☆★ (x, y)좌표에 관한 설명은 [조종기 화면 점 찍기]블럭을 참조해주세요. ★☆<br><br>x, y 좌표값과 반지름을 지정합니다. 원의 중심 = (x, y),<br>반지름은 원의 크기를 결정합니다.<br><br>★☆사용 가능한 값의 범위는 x값은 (-50~178), y값은 (-50~114), 반지름은 (1~200)입니다.☆★<br><br><font color='crimson'>#조종기</font> <font color='dodgerblue'>#Display</font>",
                "byrobot_drone_8_controller_display_draw_line":           "<br>조종기 OLED 화면에서 지정한 위치에 선을 그립니다.<br><br>☆★ (x, y)좌표에 관한 설명은 [조종기 화면 점 찍기]블럭을 참조해주세요. ★☆<br><br>시작점 = (x1, y1), 끝나는점 = (x2, y2)<br>선 그리기는 시작점과 끝나는점을 이어주는 기능입니다.<br>사용 가능한 값의 범위는 x값은 (0~128), y값은 (0~64)입니다.<br><br><font color='crimson'>#조종기</font> <font color='dodgerblue'>#Display</font>",
                "byrobot_drone_8_controller_display_draw_point":          "<br>조종기 OLED 화면에서 지정한 위치에 점을 찍습니다. 흰색/검은색 중에서 원하는 색을 선택할 수 있습니다. x, y 좌표값으로 지정합니다. 좌표(x, y) = (가로, 세로) 화면상의 위치입니다. 사용 가능한 값의 범위는 x값은 (0~128), y값은 (0~64)입니다.<br><br><font color='crimson'>#조종기</font> <font color='dodgerblue'>#Display</font>",
                "byrobot_drone_8_controller_display_draw_rect":           "<br>조종기 OLED 화면에서 지정한 위치에 사각형을 그립니다.<br><br>☆★ (x, y)좌표에 관한 설명은 [조종기 화면 점 찍기]블럭을 참조해주세요. ★☆<br><br>x, y 좌표값과 너비, 높이를 지정합니다. 시작점 = (x, y), 사용 가능한 값의 범위는 x값과 너비는 (0~128), y값과 높이는 (0~64)입니다.<br><br><font color='crimson'>#조종기</font> <font color='dodgerblue'>#Display</font>",
                "byrobot_drone_8_controller_display_draw_string":         "<br>조종기 OLED 화면에서 지정한 위치에 문자열을 씁니다.<br><br>☆★ (x, y)좌표에 관한 설명은 [조종기 화면 점 찍기]블럭을 참조해주세요. ★☆<br><br>글자 입력은 영문자 알파벳 대문자, 소문자와 숫자, 공백(space), 특수문자만 가능합니다.(한글은 아직 지원되지 않습니다.)<br>x, y 좌표값과 글자 크기, 색을 지정합니다. 시작점 = (x, y), 사용 가능한 값의 범위는 x값은 (0~120), y값과 높이는 (0~60)입니다.<br><br><font color='crimson'>#조종기</font> <font color='dodgerblue'>#Display</font>",
                "byrobot_drone_8_controller_display_draw_string_align":   "<br>조종기 OLED 화면에서 지정한 위치에 문자열을 정렬하여 그립니다.<br><br>☆★ (x, y)좌표에 관한 설명은 [조종기 화면 점 찍기]블럭을 참조해주세요. ★☆<br><br>글자 입력은 영문자 알파벳 대문자, 소문자와 숫자, 공백(space), 특수문자만 가능합니다.(한글은 아직 지원되지 않습니다.)<br>x, y 좌표값과 정렬 방향, 글자 크기, 색을 지정합니다. 시작점 = (x1, y), 끝나는점 = (x2, y), 사용 가능한 값의 범위는 x값은 (0~128), y값은 (0~60)입니다.<br><br><font color='crimson'>#조종기</font> <font color='dodgerblue'>#Display</font>",
                "byrobot_drone_8_controller_display_invert":              "<br>조종기 OLED 화면에서 선택한 영역의 색을 반전시킵니다. x, y 좌표값과 너비, 높이를 지정합니다. 좌표(x, y) = (가로, 세로) 화면상의 위치입니다. 사용 가능한 값의 범위는 x값과 너비는 (0~128), y값과 높이는 (0~64)입니다.<br><br><font color='crimson'>#조종기</font> <font color='dodgerblue'>#Display</font>",
                "byrobot_drone_8_controller_if_button_press":             "<br>지정한 조종기의 버튼이 눌러졌을 때 true를 반환합니다.<br><br><font color='crimson'>#조건</font> <font color='dodgerblue'>#조종기</font> <font color='forestgreen'>#버튼</font>",
                "byrobot_drone_8_controller_if_joystick_direction":       "<br>조종기의 조이스틱을 지정한 방향으로 움직였을 때 true를 반환합니다.<br><br><font color='crimson'>#조건</font> <font color='dodgerblue'>#조종기</font> <font color='forestgreen'>#조이스틱</font>",
                "byrobot_drone_8_controller_light_color_input":           "<br>빛의 삼원색인 Red, Green, Blue 값을 지정하여 조종기 LED의 색상을 원하는대로 만들 수 있습니다.<br>10진수(0 ~ 255) 값을 사용합니다.<br><br><font color='crimson'>#조종기</font> <font color='dodgerblue'>#LED제어</font>",
                "byrobot_drone_8_controller_light_color_select":          "<br>RGB 색지정 블록을 이용해서 만들 수 있는<br> 조종기 LED 예시입니다.<br>RGB 색지정 블록을 이용해서 멋진 색깔을<br> 다양하게 만들어보세요.<br><br><font color='crimson'>#조종기</font> <font color='dodgerblue'>#LED제어</font>",
                "byrobot_drone_8_controller_light_color_preset":         "<br>조종기 LED를 조작하는데 사용합니다.<br><br><font color='crimson'>#조종기</font> <font color='dodgerblue'>#LED제어</font>",
                "byrobot_drone_8_controller_light_manual_single_input":   "<br>조종기 LED를 조작하는데 사용합니다.<br>2진수(0b00100000 ~ 0b11100000), 10진수(32 ~ 224), 16진수(0x20 ~ 0xE0) 값을 사용할 수 있습니다.  2진수로 표현한 값에서 각각의 비트는 LED의 Red, Green, Blue 색을 선택하는 스위치 역할을 합니다.  밝기 값은 0 ~ 255 사이의 값을 사용할 수 있습니다. 값이 커질수록 더 밝아집니다. <br><br><font color='crimson'>#조종기</font> <font color='dodgerblue'>#LED제어</font>",
                "byrobot_drone_8_controller_light_manual_single_off":     "<br>조종기의 모든 LED를 끕니다.<br><br><font color='crimson'>#조종기</font> <font color='dodgerblue'>#LED끄기</font>",
                "byrobot_drone_8_controller_value_button":                "<br>조종기에서 눌러진 버튼과 관련된 이벤트를 반환합니다.<br><br><font color='crimson'>#값</font> <font color='dodgerblue'>#조종기</font> <font color='forestgreen'>#버튼</font>",
                "byrobot_drone_8_controller_value_joystick":              "<br>조종기의 조이스틱과 관련된 입력 값을 반환합니다. 각 축의 범위는 -100 ~ 100 입니다.<br><br>조이스틱 방향은 가로x세로 = 3x3 = 총9방향입니다.<br>위(왼쪽=17, 가운데=18, 오른쪽=20)<br>중간(왼쪽=33, 센터=34, 오른쪽=36)<br>아래(왼쪽=65, 가운데=66, 오른쪽=68)<br>기본값은 센터=34입니다.<br><br>조이스틱 이벤트는 값이 있을때 2, 없으면 0, 진입 1, 벗어남 3입니다.<br><br><font color='crimson'>#값</font> <font color='dodgerblue'>#조종기</font> <font color='forestgreen'>#조이스틱</font>",
                "byrobot_drone_8_controller_vibrator_delay":              "<br>진동을 지정한 시간동안 켜고 끄는 것을 지정한 시간동안 반복합니다. 이 블럭을 만났을 경우 진동이 켜져있거나 예약된 진동이 있다면 모두 삭제합니다. 이 블럭은 지정한 시간이 끝날 때까지 다음 블럭으로 넘어가지 않습니다.<br><br><font color='crimson'>#조종기</font> <font color='dodgerblue'>#진동</font> <font color='forestgreen'>#즉시</font> <font color='peru'>#시간지연</font>",
                "byrobot_drone_8_controller_vibrator_off":                "<br>진동을 끕니다. 예약된 진동이 있다면 모두 삭제합니다.<br><br><font color='crimson'>#조종기</font> <font color='dodgerblue'>#진동끄기</font>",
                "byrobot_drone_8_controller_vibrator_on_delay":           "<br>진동을 지정한 시간동안 켭니다. 이 블럭을 만났을 경우 진동이 켜져있거나 예약된 진동이 있다면 모두 삭제합니다. 이 블럭은 지정한 시간이 끝날 때까지 다음 블럭으로 넘어가지 않습니다.<br><br><font color='crimson'>#조종기</font> <font color='dodgerblue'>#진동</font> <font color='forestgreen'>#즉시</font> <font color='peru'>#시간지연</font>",
                "byrobot_drone_8_controller_vibrator_on_reserve":         "<br>진동을 지정한 시간동안 켜는 것을 예약합니다. 이 블럭은 명령을 전달 후 바로 다음 블럭으로 넘어갑니다.<br><br><font color='crimson'>#조종기</font> <font color='dodgerblue'>#진동</font> <font color='forestgreen'>#예약</font>",
                "byrobot_drone_8_controller_vibrator_reserve":            "<br>진동을 지정한 시간동안 켜고 끄는 것을 지정한 시간동안 반복하도록 예약합니다. 이 블럭은 명령을 전달 후 바로 다음 블럭으로 넘어갑니다.<br><br><font color='crimson'>#조종기</font> <font color='dodgerblue'>#진동</font> <font color='forestgreen'>#예약</font>",
                "byrobot_drone_8_drone_control_headless":               "<br>드론 좌표 기준을 변경합니다. Headless mode 선택을 on으로 하면 이륙 시와 '방향초기화'를 했을 때 드론이 바라보는 방향을 기준으로 앞뒤좌우가 고정됩니다. 이 때에는 Yaw를 조작하여 드론이 다른 방향을 보게 하여도 처음 지정한 방향을 기준으로 앞뒤좌우로 움직입니다. 사용자가 바라보는 방향과 드론의 기준 방향이 같을 때 조작하기 편리한 장점이 있습니다.<br>Headless mode를 off로 선택하면 현재 드론이 바라보는 방향을 기준으로 앞뒤좌우가 결정됩니다. 드론의 움직임에 따라 앞뒤좌우가 계속 바뀌기 때문에 익숙해지기 전까지는 사용하기 어려울 수 있습니다.<br><br><font color='crimson'>#드론</font> <font color='dodgerblue'>#좌표기준</font>",
                "byrobot_drone_8_drone_control_drone_landing":            "<br>드론을 착륙시킵니다.<br><br><font color='crimson'>#드론</font> <font color='dodgerblue'>#착륙</font>",
                "byrobot_drone_8_drone_control_drone_reset_heading":      "<br>드론의 방향을 초기화합니다. 앱솔루트 모드인 경우 현재 드론이 바라보는 방향을 0도로 변경합니다. 일반 모드에서는 아무런 영향이 없습니다.<br><br><font color='crimson'>#드론</font> <font color='dodgerblue'>#방향초기화</font>",
                "byrobot_drone_8_drone_control_drone_stop":               "<br>드론 작동을 정지합니다.<br><br><font color='crimson'>#드론</font> <font color='dodgerblue'>#정지</font>",
                "byrobot_drone_8_drone_control_drone_takeoff":            "<br>드론을 이륙시킵니다.<br><br><font color='crimson'>#드론</font> <font color='dodgerblue'>#이륙</font>",
                "byrobot_drone_8_drone_control_quad":                     "<br>드론 조종 값을 지정합니다. 입력 가능한 값의 범위는 -100 ~ 100입니다. 정지 상태에서 Throttle 값을 50이상으로 지정하면 드론이 이륙합니다. 명령 전달 후 바로 다음 블럭으로 넘어갑니다.<br><br><font color='crimson'>#드론</font> <font color='dodgerblue'>#조종</font>",
                "byrobot_drone_8_drone_control_quad_delay":               "<br>드론 조종 값을 지정합니다. 입력 가능한 값의 범위는 -100 ~ 100입니다. 정지 상태에서 Throttle 값을 50이상으로 지정하면 드론이 이륙합니다. 지정한 시간이 지나면 해당 조종 값을 0으로 변경합니다. 지정한 시간이 끝날 때까지 다음 블럭으로 넘어가지 않습니다.<br><br><font color='crimson'>#드론</font> <font color='dodgerblue'>#조종</font> <font color='forestgreen'>#시간지연</font>",
                "byrobot_drone_8_drone_control_quad_one":                 "<br>드론 조종 값을 지정합니다. 입력 가능한 값의 범위는 -100 ~ 100입니다. 정지 상태에서 Throttle 값을 50이상으로 지정하면 드론이 이륙합니다. 명령 전달 후 바로 다음 블럭으로 넘어갑니다.<br><br><font color='crimson'>#드론</font> <font color='dodgerblue'>#조종</font>",
                "byrobot_drone_8_drone_control_quad_one_delay":           "<br>드론 조종 값을 지정합니다. 입력 가능한 값의 범위는 -100 ~ 100입니다. 정지 상태에서 Throttle 값을 50이상으로 지정하면 드론이 이륙합니다. 지정한 시간이 지나면 해당 조종 값을 0으로 변경합니다. 지정한 시간이 끝날 때까지 다음 블럭으로 넘어가지 않습니다.<br><br><font color='crimson'>#드론</font> <font color='dodgerblue'>#조종</font> <font color='forestgreen'>#시간지연</font>",
                "byrobot_drone_8_drone_light_color_input":                "<br>빛의 삼원색인 Red, Green, Blue 값을 지정하여 드론의 눈 또는 팔 LED의 색상을 원하는대로 만들 수 있습니다.<br>10진수(0 ~ 255) 값을 사용합니다.<br><br><font color='crimson'>#드론</font> <font color='dodgerblue'>#LED제어</font>",
                "byrobot_drone_8_drone_light_color_select":               "<br>RGB 색지정 블록을 이용해서 만들 수 있는<br> 드론 LED 예시입니다.<br>RGB 색지정 블록을 이용해서 멋진 색깔을<br> 다양하게 만들어보세요.<br><br><font color='crimson'>#드론</font> <font color='dodgerblue'>#LED제어</font>",
                "byrobot_drone_8_drone_light_color_preset":              "<br>드론의 LED를 조작하는데 사용합니다.<br><br><font color='crimson'>#드론</font> <font color='dodgerblue'>#LED제어</font>",
                "byrobot_drone_8_drone_light_manual_single_input":        "<br>드론 LED를 조작하는데 사용합니다.<br>2진수(0b00000100 ~ 0b11111100), 10진수(4 ~ 252), 16진수(0x04 ~ 0xFC) 값을 사용할 수 있습니다.  2진수로 표현한 값에서 각각의 비트는 눈과 팔 LED의 Red, Green, Blue 색을 선택하는 스위치 역할을 합니다.  밝기 값은 0 ~ 255 사이의 값을 사용할 수 있습니다. 값이 커질수록 더 밝아집니다.<br><br><font color='crimson'>#드론</font> <font color='dodgerblue'>#LED제어</font>",
                "byrobot_drone_8_drone_light_manual_single_off":          "<br>드론의 모든 LED를 끕니다.<br><br><font color='crimson'>#드론</font> <font color='dodgerblue'>#LED끄기</font>",
                "byrobot_drone_8_drone_motor_stop":                       "<br>모든 모터의 작동을 정지합니다.<br><br><font color='crimson'>#드론</font> <font color='dodgerblue'>#모터정지</font>",
                "byrobot_drone_8_drone_motorsingle":                      "<br>지정한 모터를 원하는 빠르기로 회전할 때 사용합니다. 사용 가능한 값의 범위는 0 ~ 4000입니다. 모터의 순서는 '왼쪽 앞', '오른쪽 앞', '오른쪽 뒤', '왼쪽 뒤' 입니다.<br><br><font color='crimson'>#드론</font> <font color='dodgerblue'>#모터제어</font>",
                "byrobot_drone_8_drone_motorsingle_input":                "<br>지정한 모터(1, 2, 3, 4)를 원하는 빠르기로 회전할 때 사용합니다. 사용 가능한 값의 범위는 0 ~ 4000입니다. 모터의 순서는 '왼쪽 앞', '오른쪽 앞', '오른쪽 뒤', '왼쪽 뒤' 입니다.<br><br><font color='crimson'>#드론</font> <font color='dodgerblue'>#모터제어</font>",
                "byrobot_drone_8_drone_motorsingle_rotation":             "<br>지정한 모터를 원하는 빠르기로 회전할 때 사용합니다. 1번 모터와 2번 모터는 역방향도 회전 가능하기 때문에 방향도 선택할 수 있습니다. 사용 가능한 값의 범위는 0 ~ 4000입니다. 모터의 순서는 '왼쪽 앞', '오른쪽 앞', '오른쪽 뒤', '왼쪽 뒤' 입니다.<br><br><font color='crimson'>#자동차</font> <font color='dodgerblue'>#모터제어</font>",
                "byrobot_drone_8_drone_value_attitude":                   "<br>드론의 현재 자세를 각도로 반환합니다. Roll은 좌우 기울기(-90 ~ 90), Pitch는 앞뒤 기울기(-90 ~ 90), Yaw는 회전 각도(-180 ~ 180) 입니다.<br><br><font color='crimson'>#값</font> <font color='dodgerblue'>#드론</font> <font color='forestgreen'>#자세</font>",
                "byrobot_drone_8_drone_value_etc":                        "<br>페트론V2 설정과 관련된 값들과 적외선 통신으로 받은 값을 반환합니다.<br><br><font color='crimson'>#값</font> <font color='dodgerblue'>#드론</font> <font color='forestgreen'>#기타</font>",
                "byrobot_drone_8_drone_value_motion":                     "<br>페트론V2 IMU센서와 관련된 값들을 반환합니다.<br>(병진운동) 가속도는 x, y, z축에 대한 중력가속도입니다. 1g = 9.8m/s^2<br>(회전운동) 각속도는 x, y, z축을 기준으로 회전하는 속력을 나타내는 벡터입니다.(pitch, roll, yaw) <br><br><font color='crimson'>#값</font> <font color='dodgerblue'>#드론</font> <font color='forestgreen'>#IMU센서</font> <font color='crimson'>#가속도</font> <font color='dodgerblue'>#병진운동</font> <font color='crimson'>#각속도</font> <font color='dodgerblue'>#회전운동</font>",
                "byrobot_drone_8_drone_value_sensor":                     "<br>페트론V2 센서와 관련된 값들을 반환합니다.<br>온도 단위=섭씨 도, 해발고도 단위=m, image flow 단위=m, 바닥까지의 거리 단위=m<br>해발고도 값은 대기압의 영향을 받아서 오차범위가 큽니다. 바닥까지 거리의 유효 측정 거리는 2m입니다. image flow값은 일정한 속도와 높이에서 이동할 경우에 유효합니다. 이러한 센서값들을 이용하여 Petrone V2는 호버링(고도 유지) 기능을 수행합니다.<br><br><font color='crimson'>#값</font> <font color='dodgerblue'>#드론</font> <font color='forestgreen'>#센서</font> <font color='crimson'>#온도</font> <font color='dodgerblue'>#해발고도</font> <font color='forestgreen'>#image flow</font> <font color='crimson'>#range</font> <font color='dodgerblue'>#대기압</font> <font color='forestgreen'>#호버링</font>",
            }
        },

        en: {
            // en.js에 작성하던 내용
            Blocks: {
                "byrobot_drone_8_common_left":                       "left",
                "byrobot_drone_8_common_light_color_cottoncandy":    "cotton candy",
                "byrobot_drone_8_common_light_color_emerald":        "emerald",
                "byrobot_drone_8_common_light_color_lavender":       "lavender",
                "byrobot_drone_8_common_light_mode_dimming":         "dimming",
                "byrobot_drone_8_common_light_mode_flicker":         "flicker",
                "byrobot_drone_8_common_light_mode_flicker_double":  "flicker double",
                "byrobot_drone_8_common_light_mode_hold":            "hold",
                "byrobot_drone_8_common_light_color_muscat":         "muscat",
                "byrobot_drone_8_common_light_color_strawberrymilk": "strawberry milk",
                "byrobot_drone_8_common_light_color_sunset":         "sunset",
                "byrobot_drone_8_common_light_manual_all":           "all",
                "byrobot_drone_8_common_light_manual_b100":          "brightness 100%",
                "byrobot_drone_8_common_light_manual_b25":           "brightness 25%",
                "byrobot_drone_8_common_light_manual_b50":           "brightness 50%",
                "byrobot_drone_8_common_light_manual_b75":           "brightness 75%",
                "byrobot_drone_8_common_light_manual_blue":          "blue",
                "byrobot_drone_8_common_light_manual_cyan":          "cyan",
                "byrobot_drone_8_common_light_manual_green":         "green",
                "byrobot_drone_8_common_light_manual_magenta":       "magenta",
                "byrobot_drone_8_common_light_manual_off":           "off",
                "byrobot_drone_8_common_light_manual_on":            "on",
                "byrobot_drone_8_common_light_manual_red":           "red",
                "byrobot_drone_8_common_light_manual_white":         "white",
                "byrobot_drone_8_common_light_manual_yellow":        "yellow",
                "byrobot_drone_8_common_pitch":      "pitch",
                "byrobot_drone_8_common_right":      "right",
                "byrobot_drone_8_common_roll":       "roll",
                "byrobot_drone_8_common_throttle":   "throttle",
                "byrobot_drone_8_common_yaw":        "yaw",
                "byrobot_drone_8_controller_button_bottom_left":         "left round button",
                "byrobot_drone_8_controller_button_bottom_left_right":   "both round button",
                "byrobot_drone_8_controller_button_bottom_right":        "right round button",
                "byrobot_drone_8_controller_button":              "button",
                "byrobot_drone_8_controller_button_center_down":         "trim-backward button",
                "byrobot_drone_8_controller_button_center_left":         "trim-left button",
                "byrobot_drone_8_controller_button_center_right":        "trim-right button",
                "byrobot_drone_8_controller_button_center_up":           "trim-forward button",
                "byrobot_drone_8_controller_button_center_up_left":      "trim-turn-left button",
                "byrobot_drone_8_controller_button_center_up_right":     "trim-turn-right button",
                "byrobot_drone_8_controller_button_event":               "button event",
                "byrobot_drone_8_controller_button_front_left":          "left red button",
                "byrobot_drone_8_controller_button_front_left_right":    "both red button",
                "byrobot_drone_8_controller_button_front_right":         "right red button",
                "byrobot_drone_8_controller_buzzer":         "buzzer",
                "byrobot_drone_8_controller_buzzer_a":       "A",
                "byrobot_drone_8_controller_buzzer_as":      "A#",
                "byrobot_drone_8_controller_buzzer_b":       "B",
                "byrobot_drone_8_controller_buzzer_c":       "C",
                "byrobot_drone_8_controller_buzzer_cs":      "C#",
                "byrobot_drone_8_controller_buzzer_d":       "D",
                "byrobot_drone_8_controller_buzzer_ds":      "D#",
                "byrobot_drone_8_controller_buzzer_e":       "E",
                "byrobot_drone_8_controller_buzzer_f":       "F",
                "byrobot_drone_8_controller_buzzer_fs":      "F#",
                "byrobot_drone_8_controller_buzzer_g":       "G",
                "byrobot_drone_8_controller_buzzer_gs":      "G#",
                "byrobot_drone_8_controller_buzzer_mute":    "mute",
                "byrobot_drone_8_controller_display_align_center":           "center",
                "byrobot_drone_8_controller_display_align_left":             "left",
                "byrobot_drone_8_controller_display_align_right":            "right",
                "byrobot_drone_8_controller_display_flagfill_off":           "not fill",
                "byrobot_drone_8_controller_display_flagfill_on":            "fill",
                "byrobot_drone_8_controller_display_font_10x16":             "big",
                "byrobot_drone_8_controller_display_font_5x8":               "small",
                "byrobot_drone_8_controller_display_line_dashed":            "dashed",
                "byrobot_drone_8_controller_display_line_dotted":            "dotted",
                "byrobot_drone_8_controller_display_line_solid":             "solid",
                "byrobot_drone_8_controller_display_pixel_black":            "black",
                "byrobot_drone_8_controller_display_pixel_white":            "white",
                "byrobot_drone_8_controller_joystick_direction_center":      "center",
                "byrobot_drone_8_controller_joystick_direction_down":        "down",
                "byrobot_drone_8_controller_joystick_direction_left":        "left",
                "byrobot_drone_8_controller_joystick_direction_left_down":   "left down",
                "byrobot_drone_8_controller_joystick_direction_left_up":     "left up",
                "byrobot_drone_8_controller_joystick_direction_right":       "right",
                "byrobot_drone_8_controller_joystick_direction_right_down":  "right down",
                "byrobot_drone_8_controller_joystick_direction_right_up":    "right up",
                "byrobot_drone_8_controller_joystick_direction_up":          "up",
                "byrobot_drone_8_controller_joystick_left_direction":        "left joystick direction",
                "byrobot_drone_8_controller_joystick_left_event":            "left joystick event",
                "byrobot_drone_8_controller_joystick_left_x":                "left joystick horizontal",
                "byrobot_drone_8_controller_joystick_left_y":                "left joystick vertical",
                "byrobot_drone_8_controller_joystick_right_direction":       "right joystick direction",
                "byrobot_drone_8_controller_joystick_right_event":           "right joystick event",
                "byrobot_drone_8_controller_joystick_right_x":               "right joystick horizontal",
                "byrobot_drone_8_controller_joystick_right_y":               "right joystick vertical",
                "byrobot_drone_8_drone_accel_x": "accel x",
                "byrobot_drone_8_drone_accel_y": "accel y",
                "byrobot_drone_8_drone_accel_z": "accel z",
                "byrobot_drone_8_drone_attitude_pitch": "attitude - pitch",
                "byrobot_drone_8_drone_attitude_roll": "attitude - roll",
                "byrobot_drone_8_drone_attitude_yaw": "attitude - yaw",
                "byrobot_drone_8_drone_control_double_accel_forward": "forward/backward",
                "byrobot_drone_8_drone_control_double_wheel": "direction",
                "byrobot_drone_8_drone_control_double_wheel_left": "turn left",
                "byrobot_drone_8_drone_control_double_wheel_right": "turn right",
                "byrobot_drone_8_drone_control_quad_pitch": "pitch",
                "byrobot_drone_8_drone_control_quad_pitch_backward": "backward",
                "byrobot_drone_8_drone_control_quad_pitch_forward": "foward",
                "byrobot_drone_8_drone_control_quad_roll": "roll",
                "byrobot_drone_8_drone_control_quad_roll_left": "left",
                "byrobot_drone_8_drone_control_quad_roll_right": "right",
                "byrobot_drone_8_drone_control_quad_throttle": "throttle",
                "byrobot_drone_8_drone_control_quad_throttle_down": "down",
                "byrobot_drone_8_drone_control_quad_throttle_up": "up",
                "byrobot_drone_8_drone_control_quad_yaw": "yaw",
                "byrobot_drone_8_drone_control_quad_yaw_left": "turn Left",
                "byrobot_drone_8_drone_control_quad_yaw_right": "turn Right",
                "byrobot_drone_8_drone_headless_normal": "off (hard)",
                "byrobot_drone_8_drone_headless_headless": "on (easy)",
                "byrobot_drone_8_drone_gyro_pitch": "angular speed - pitch",
                "byrobot_drone_8_drone_gyro_roll": "angular speed - roll",
                "byrobot_drone_8_drone_gyro_yaw": "angular speed - yaw",
                "byrobot_drone_8_drone_positionX": "image flow X",
                "byrobot_drone_8_drone_positionY": "image flow Y",
                "byrobot_drone_8_drone_irmessage": "IR data received",
                "byrobot_drone_8_drone_irmessage_direction": "IR received direction",
                "byrobot_drone_8_drone_irmessage_direction_front": "front",
                "byrobot_drone_8_drone_irmessage_direction_rear": "rear",
                "byrobot_drone_8_drone_light_color_arm": "arm",
                "byrobot_drone_8_drone_light_color_body": "eye",
                "byrobot_drone_8_drone_light_manual_arm_blue": "arm - blue",
                "byrobot_drone_8_drone_light_manual_arm_green": "arm - green",
                "byrobot_drone_8_drone_light_manual_arm_red": "arm - red",
                "byrobot_drone_8_drone_light_manual_eye_blue": "eye - blue",
                "byrobot_drone_8_drone_light_manual_eye_green": "eye - green",
                "byrobot_drone_8_drone_light_manual_eye_red": "eye - red",
                "byrobot_drone_8_drone_motor_rotation_clockwise": "Clockwise",
                "byrobot_drone_8_drone_motor_rotation_counterclockwise": "Counterclockwise",
                "byrobot_drone_8_drone_altitude": "altitude above sea level",
                "byrobot_drone_8_drone_pressure_temperature": "temperature",
                "byrobot_drone_8_drone_range_height": "distance to bottom",
                "byrobot_drone_8_drone_state_battery": "battery",
                "byrobot_drone_8_drone_state_headless": "coordinate",
                "byrobot_drone_8_drone_state_mode_drive": "drive Mode",
                "byrobot_drone_8_drone_state_mode_flight": "flight Mode",
                "byrobot_drone_8_drone_state_mode_system": "system Mode",
                "byrobot_drone_8_drone_state_mode_vehicle": "vehicle Mode",
                "byrobot_drone_8_drone_team": "team",
                "byrobot_drone_8_drone_team_blue": "blue",
                "byrobot_drone_8_drone_team_red": "red",
                "byrobot_drone_8_drone_vehicle_drive": "drive",
                "byrobot_drone_8_drone_vehicle_drive_fpv": "drive(FPV)",
                "byrobot_drone_8_drone_vehicle_flight": "drone(with guard)",
                "byrobot_drone_8_drone_vehicle_flight_fpv": "drone(FPV)",
                "byrobot_drone_8_drone_vehicle_flight_noguard": "drone(without guard)",
                "byrobot_drone_8_entryhw_count_transfer_reserved":           "reserved data blocks",
            },

            // en.js에 작성하던 내용
            template: {
                "byrobot_drone_8_controller_buzzer_hz": "play %1 Hz sound %2",
                "byrobot_drone_8_controller_buzzer_hz_delay": "play %1 Hz sound for %2 second %3",
                "byrobot_drone_8_controller_buzzer_hz_reserve": "reserve to play %1 Hz sound for %2 second %3",
                "byrobot_drone_8_controller_buzzer_off": "turn off the buzzer %1",
                "byrobot_drone_8_controller_buzzer_scale": "play %1 octave %2 %3",
                "byrobot_drone_8_controller_buzzer_scale_delay": "play %1 octave %2 for %3 second %4",
                "byrobot_drone_8_controller_buzzer_scale_reserve": "reserve to play %1 octave %2 for %3 second %4",
                "byrobot_drone_8_controller_display_clear": "clear controller display x:%1, y:%2, width:%3, height:%4, color:%5 %6",
                "byrobot_drone_8_controller_display_clear_all": "clear controller display with %1 color %2",
                "byrobot_drone_8_controller_display_draw_circle": "draw a circle in controller display x:%1, y:%2, radius:%3, %4, %5, %6",
                "byrobot_drone_8_controller_display_draw_line": "draw a line in controller display x1:%1, y1:%2, x2:%3, y2:%4, %5, %6 %7",
                "byrobot_drone_8_controller_display_draw_point": "draw a point in controller display  x:%1, y:%2, color:%3 %4",
                "byrobot_drone_8_controller_display_draw_rect": "draw a rectangle in controller display x:%1, y:%2, width:%3, height:%4, %5, %6, %7 %8",
                "byrobot_drone_8_controller_display_draw_string": "draw a string in controller display x:%1, y:%2, font size:%3, %4, input:%5, %6",
                "byrobot_drone_8_controller_display_draw_string_align": "draw aligned string in controller display x1:%1, x2:%2, y:%3, align:%4, font size:%5, %6, input:%7, %8",
                "byrobot_drone_8_controller_display_invert": "invert controller display x:%1, y:%2, width:%3, height:%4 %5",
                "byrobot_drone_8_controller_if_button_press": "when press %1",
                "byrobot_drone_8_controller_if_joystick_direction": "when %1 stick move to %2",
                "byrobot_drone_8_controller_light_color_input": "decide the color values of controller LED R %1, G %2, B %3 %4 %5",
                "byrobot_drone_8_controller_light_color_select": "RGB combination examples of controller LED %1 %2 %3",
                "byrobot_drone_8_controller_light_color_preset": "change the state of %1 controller LED to %2 %3",
                "byrobot_drone_8_controller_light_manual_single_input": "change the brightness of %1 controller LED to %2 %3",
                "byrobot_drone_8_controller_light_manual_single_off": "turn off all controller LEDs %1",
                "byrobot_drone_8_controller_value_button": "%1",
                "byrobot_drone_8_controller_value_joystick": "%1",
                "byrobot_drone_8_controller_vibrator_delay": "vibration %1 second on, %2 second off for %3 seconds %4",
                "byrobot_drone_8_controller_vibrator_off": "turn off the vibrator %1",
                "byrobot_drone_8_controller_vibrator_on_delay": "turn on the vibrator for %1 second %2",
                "byrobot_drone_8_controller_vibrator_on_reserve": "reserve turn on the vibrator for %1 second %2",
                "byrobot_drone_8_controller_vibrator_reserve": "reserve vibration %1 second on, %2 second off for %3 seconds %4",
                "byrobot_drone_8_drone_command_mode_vehicle_drone": "set vehicle mode to %1 %2",
                "byrobot_drone_8_drone_control_headless": "Headless mode (Absolute mode) %1 %2",
                "byrobot_drone_8_drone_control_drone_landing": "landing %1",
                "byrobot_drone_8_drone_control_drone_reset_heading": "reset heading reference %1",
                "byrobot_drone_8_drone_control_drone_stop": "stop %1",
                "byrobot_drone_8_drone_control_drone_takeoff": "take off %1",
                "byrobot_drone_8_drone_control_quad": "set roll to %1, pitch to %2, yaw to %3, throttle to %4 %5",
                "byrobot_drone_8_drone_control_quad_delay": "set roll to %1, pitch to %2, yaw to %3, throttle to %4 and run for %5 second %6",
                "byrobot_drone_8_drone_control_quad_one": "set %1 to %2 %3",
                "byrobot_drone_8_drone_control_quad_one_delay": "set %1 to %2 and run for %3 second %4",
                "byrobot_drone_8_drone_irmessage": "send %1 to the IR transmitter %2",
                "byrobot_drone_8_drone_light_color_input": "decide the color values of drone %1 LED R %2, G %3, B %4 %5 %6",
                "byrobot_drone_8_drone_light_color_select": "RGB combination examples of drone %1 LED %2 %3 %4",
                "byrobot_drone_8_drone_light_color_preset": "change the state of %1 drone LED to %2 %3",
                "byrobot_drone_8_drone_light_manual_single_input": "change the brightness of %1 drone LED to %2 %3",
                "byrobot_drone_8_drone_light_manual_single_off": "turn off all drone LEDs %1",
                "byrobot_drone_8_drone_motor_stop": "turn off all motors %1",
                "byrobot_drone_8_drone_motorsingle": "set rotate for number %1 motor to %2 %3",
                "byrobot_drone_8_drone_motorsingle_input": "set rotate for number %1 motor to %2 %3",
                "byrobot_drone_8_drone_motorsingle_rotation": "set rotate for number %1 motor to %2 %3 %4",
                "byrobot_drone_8_drone_value_attitude": "%1",
                "byrobot_drone_8_drone_value_etc": "%1",
                "byrobot_drone_8_drone_value_motion": "%1",
                "byrobot_drone_8_drone_value_sensor": "%1",
            },
            
            Helper: {

            }
        }
    }
};



/***************************************************************************************
 *  엔트리에 등록할 블록들의 블록명
 ***************************************************************************************/
Entry.byrobot_drone_8.blockMenuBlocks = [
    'byrobot_drone_8_drone_value_attitude',
    'byrobot_drone_8_drone_value_motion',
    'byrobot_drone_8_drone_value_sensor',
    'byrobot_drone_8_drone_value_etc',
    'byrobot_drone_8_controller_value_button',
    'byrobot_drone_8_controller_value_joystick',
    'byrobot_drone_8_controller_if_button_press',
    'byrobot_drone_8_controller_if_joystick_direction',
    'byrobot_drone_8_drone_control_drone_takeoff',
    'byrobot_drone_8_drone_control_drone_landing',
    'byrobot_drone_8_drone_control_drone_stop',
    'byrobot_drone_8_drone_control_headless',
    'byrobot_drone_8_drone_control_drone_reset_heading',
    'byrobot_drone_8_drone_control_quad_one',
    'byrobot_drone_8_drone_control_quad_one_delay',
    'byrobot_drone_8_drone_control_quad',
    'byrobot_drone_8_drone_control_quad_delay',
    'byrobot_drone_8_drone_motor_stop',
    'byrobot_drone_8_drone_motorsingle',
    'byrobot_drone_8_drone_motorsingle_input',
    'byrobot_drone_8_drone_motorsingle_rotation',
    'byrobot_drone_8_drone_light_manual_single_off',
    'byrobot_drone_8_drone_light_manual_single_input',
    'byrobot_drone_8_drone_light_color_preset',
    'byrobot_drone_8_drone_light_color_input',
    'byrobot_drone_8_drone_light_color_select',
    'byrobot_drone_8_controller_light_manual_single_off',
    'byrobot_drone_8_controller_light_manual_single_input',
    'byrobot_drone_8_controller_light_color_preset',
    'byrobot_drone_8_controller_light_color_input',
    'byrobot_drone_8_controller_light_color_select',
    'byrobot_drone_8_controller_display_clear_all',
    'byrobot_drone_8_controller_display_clear',
    'byrobot_drone_8_controller_display_invert',
    'byrobot_drone_8_controller_display_draw_point',
    'byrobot_drone_8_controller_display_draw_line',
    'byrobot_drone_8_controller_display_draw_rect',
    'byrobot_drone_8_controller_display_draw_circle',
    'byrobot_drone_8_controller_display_draw_string',
    'byrobot_drone_8_controller_display_draw_string_align',
    'byrobot_drone_8_controller_buzzer_off',
    'byrobot_drone_8_controller_buzzer_scale',
    'byrobot_drone_8_controller_buzzer_scale_delay',
    'byrobot_drone_8_controller_buzzer_scale_reserve',
    'byrobot_drone_8_controller_buzzer_hz',
    'byrobot_drone_8_controller_buzzer_hz_delay',
    'byrobot_drone_8_controller_buzzer_hz_reserve',
    'byrobot_drone_8_controller_vibrator_off',
    'byrobot_drone_8_controller_vibrator_on_delay',
    'byrobot_drone_8_controller_vibrator_on_reserve',
    'byrobot_drone_8_controller_vibrator_delay',
    'byrobot_drone_8_controller_vibrator_reserve',
];



Entry.byrobot_drone_8.getBlocks = function()
{
    return {
        byrobot_drone_8_drone_value_attitude:
        {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.byrobot_drone_8_drone_attitude_roll,    'motion_angleRoll'],
                        [Lang.Blocks.byrobot_drone_8_drone_attitude_pitch,   'motion_anglePitch'],
                        [Lang.Blocks.byrobot_drone_8_drone_attitude_yaw,     'motion_angleYaw'],
                    ],
                    value: 'motion_angleRoll', // 초기 선택항목 지정
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'byrobot_drone_8_drone_value_attitude', // 언어 파일에서 읽어들일 템플릿. 객체 이름과 동일하게
            },
            paramsKeyMap: {
                DEVICE: 0,
            },
            class: 'byrobot_drone_8_monitor', // 같은 이름인 객체들이 그룹으로 형성됨
            isNotFor: ['byrobot_drone_8'],
            func: function(sprite, script) {
                return Entry.hw.portData[script.getField('DEVICE')];
            },
        },


        byrobot_drone_8_drone_value_motion:
        {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.byrobot_drone_8_drone_accel_x,      'motion_accX'],
                        [Lang.Blocks.byrobot_drone_8_drone_accel_y,      'motion_accY'],
                        [Lang.Blocks.byrobot_drone_8_drone_accel_z,      'motion_accZ'],
                        [Lang.Blocks.byrobot_drone_8_drone_gyro_roll,    'motion_gyroRoll'],
                        [Lang.Blocks.byrobot_drone_8_drone_gyro_pitch,   'motion_gyroPitch'],
                        [Lang.Blocks.byrobot_drone_8_drone_gyro_yaw,     'motion_gyroYaw'],
                    ],
                    value: 'motion_accX', // 초기 선택항목 지정
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'byrobot_drone_8_drone_value_motion', // 언어 파일에서 읽어들일 템플릿. 객체 이름과 동일하게
            },
            paramsKeyMap: {
                DEVICE: 0,
            },
            class: 'byrobot_drone_8_monitor', // 같은 이름인 객체들이 그룹으로 형성됨
            isNotFor: ['byrobot_drone_8'],
            func: function(sprite, script) {
                return Entry.hw.portData[script.getField('DEVICE')];
            },
        },


        byrobot_drone_8_drone_value_sensor:
        {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.byrobot_drone_8_drone_pressure_temperature, 'pressure_temperature'],
                        [Lang.Blocks.byrobot_drone_8_drone_altitude,    'altitude'],
                        [Lang.Blocks.byrobot_drone_8_drone_positionX,  'positionX'],
                        [Lang.Blocks.byrobot_drone_8_drone_positionY,  'positionY'],
                        [Lang.Blocks.byrobot_drone_8_drone_range_height,         'range_height'],
                    ],
                    value: 'pressure_temperature', // 초기 선택항목 지정
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'byrobot_drone_8_drone_value_sensor', // 언어 파일에서 읽어들일 템플릿. 객체 이름과 동일하게
            },
            paramsKeyMap: {
                DEVICE: 0,
            },
            class: 'byrobot_drone_8_monitor', // 같은 이름인 객체들이 그룹으로 형성됨
            isNotFor: ['byrobot_drone_8'],
            func: function(sprite, script) {
                return Entry.hw.portData[script.getField('DEVICE')];
            },
        },


        byrobot_drone_8_drone_value_etc:
        {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.byrobot_drone_8_drone_state_mode_vehicle,   'state_modeVehicle'],
                        [Lang.Blocks.byrobot_drone_8_drone_state_mode_flight,    'state_modeFlight'],
                        [Lang.Blocks.byrobot_drone_8_drone_state_battery,        'state_battery'],
                        [Lang.Blocks.byrobot_drone_8_drone_irmessage,            'irmessage_irdata'],
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
                type: 'byrobot_drone_8_drone_value_etc', // 언어 파일에서 읽어들일 템플릿. 객체 이름과 동일하게
            },
            paramsKeyMap: {
                DEVICE: 0,
            },
            class: 'byrobot_drone_8_monitor', // 같은 이름인 객체들이 그룹으로 형성됨
            isNotFor: ['byrobot_drone_8'],
            func: function(sprite, script) {
                return Entry.hw.portData[script.getField('DEVICE')];
            },
        },


        byrobot_drone_8_controller_value_button:
        {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.byrobot_drone_8_controller_button,   'button_button'],
                        [Lang.Blocks.byrobot_drone_8_controller_button_event,    'button_event'],
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
                type: 'byrobot_drone_8_controller_value_button', // 언어 파일에서 읽어들일 템플릿. 객체 이름과 동일하게
            },
            paramsKeyMap: {
                DEVICE: 0,
            },
            class: 'byrobot_drone_8_monitor', // 같은 이름인 객체들이 그룹으로 형성됨
            isNotFor: ['byrobot_drone_8'],
            func: function(sprite, script) {
                return Entry.hw.portData[script.getField('DEVICE')];
            },
        },


        byrobot_drone_8_controller_value_joystick:
        {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.byrobot_drone_8_controller_joystick_left_x,             'joystick_left_x'],
                        [Lang.Blocks.byrobot_drone_8_controller_joystick_left_y,             'joystick_left_y'],
                        [Lang.Blocks.byrobot_drone_8_controller_joystick_left_direction,     'joystick_left_direction'],
                        [Lang.Blocks.byrobot_drone_8_controller_joystick_left_event,         'joystick_left_event'],
                        [Lang.Blocks.byrobot_drone_8_controller_joystick_right_x,            'joystick_right_x'],
                        [Lang.Blocks.byrobot_drone_8_controller_joystick_right_y,            'joystick_right_y'],
                        [Lang.Blocks.byrobot_drone_8_controller_joystick_right_direction,    'joystick_right_direction'],
                        [Lang.Blocks.byrobot_drone_8_controller_joystick_right_event,        'joystick_right_event'],
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
                type: 'byrobot_drone_8_controller_value_joystick', // 언어 파일에서 읽어들일 템플릿. 객체 이름과 동일하게
            },
            paramsKeyMap: {
                DEVICE: 0,
            },
            class: 'byrobot_drone_8_monitor', // 같은 이름인 객체들이 그룹으로 형성됨
            isNotFor: ['byrobot_drone_8'],
            func: function(sprite, script) {
                return Entry.hw.portData[script.getField('DEVICE')];
            },
        },


        byrobot_drone_8_controller_if_button_press:
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
                        [Lang.Blocks.byrobot_drone_8_controller_button_front_left,        '1'],
                        [Lang.Blocks.byrobot_drone_8_controller_button_front_right,       '2'],
                        [Lang.Blocks.byrobot_drone_8_controller_button_front_left_right,  '3'],
                        [Lang.Blocks.byrobot_drone_8_controller_button_center_up_left,    '4'],
                        [Lang.Blocks.byrobot_drone_8_controller_button_center_up_right,   '8'],
                        [Lang.Blocks.byrobot_drone_8_controller_button_center_up,         '16'],
                        [Lang.Blocks.byrobot_drone_8_controller_button_center_left,       '32'],
                        [Lang.Blocks.byrobot_drone_8_controller_button_center_right,      '64'],
                        [Lang.Blocks.byrobot_drone_8_controller_button_center_down,       '128'],
                        [Lang.Blocks.byrobot_drone_8_controller_button_bottom_left,       '256'],
                        [Lang.Blocks.byrobot_drone_8_controller_button_bottom_right,      '512'],
                        [Lang.Blocks.byrobot_drone_8_controller_button_bottom_left_right, '768'],
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
                type: 'byrobot_drone_8_controller_if_button_press',
            },
            paramsKeyMap: {
                BUTTON: 0,
            },
            class: 'byrobot_drone_8_boolean_input',
            isNotFor: ['byrobot_drone_8'],
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


        byrobot_drone_8_controller_if_joystick_direction:
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
                        [Lang.Blocks.byrobot_drone_8_common_left, 'joystick_left_direction'],
                        [Lang.Blocks.byrobot_drone_8_common_right, 'joystick_right_direction'],
                    ],
                    value: 'joystick_left_direction',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.byrobot_drone_8_controller_joystick_direction_left_up,      '17'],
                        [Lang.Blocks.byrobot_drone_8_controller_joystick_direction_up,           '18'],
                        [Lang.Blocks.byrobot_drone_8_controller_joystick_direction_right_up,     '20'],
                        [Lang.Blocks.byrobot_drone_8_controller_joystick_direction_left,         '33'],
                        [Lang.Blocks.byrobot_drone_8_controller_joystick_direction_center,       '34'],
                        [Lang.Blocks.byrobot_drone_8_controller_joystick_direction_right,        '36'],
                        [Lang.Blocks.byrobot_drone_8_controller_joystick_direction_left_down,    '65'],
                        [Lang.Blocks.byrobot_drone_8_controller_joystick_direction_down,         '66'],
                        [Lang.Blocks.byrobot_drone_8_controller_joystick_direction_right_down,   '68'],
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
                type: 'byrobot_drone_8_controller_if_joystick_direction',
            },
            paramsKeyMap: {
                DEVICE: 0,
                DIRECTION: 1,
            },
            class: 'byrobot_drone_8_boolean_input',
            isNotFor: ['byrobot_drone_8'],
            func: function(sprite, script) {
                var read = Entry.hw.portData;

                var device = script.getField('DEVICE'); // paramsKeyMap에 정의된 이름 사용

                if (read[device] == script.getField('DIRECTION')) return true;
                else return false;
            },
        },


        byrobot_drone_8_controller_light_manual_single_off:
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
                type: 'byrobot_drone_8_controller_light_manual_single_off',
            },
            paramsKeyMap: {},
            class: 'byrobot_drone_8_controller_light',
            isNotFor: ['byrobot_drone_8'],
            func: function(sprite, script) {
                return Entry.byrobot_drone_8.setLightManual(script, 0x31, 0xff, 0);
            },
        },


        byrobot_drone_8_controller_light_color_preset:
        {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.byrobot_drone_8_common_light_manual_red,        'red'],
                        [Lang.Blocks.byrobot_drone_8_common_light_manual_green,      'green'],
                        [Lang.Blocks.byrobot_drone_8_common_light_manual_blue,       'blue'],
                        [Lang.Blocks.byrobot_drone_8_common_light_manual_yellow,     'yellow'],
                        [Lang.Blocks.byrobot_drone_8_common_light_manual_magenta,    'magenta'],
                        [Lang.Blocks.byrobot_drone_8_common_light_manual_cyan,       'cyan'],
                        [Lang.Blocks.byrobot_drone_8_common_light_manual_white,      'white'],
                    ],
                    value: 'red',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.byrobot_drone_8_common_light_manual_on,     '220'],
                        [Lang.Blocks.byrobot_drone_8_common_light_manual_off,    '0'],
                        [Lang.Blocks.byrobot_drone_8_common_light_manual_b25,    '75'],
                        [Lang.Blocks.byrobot_drone_8_common_light_manual_b50,    '125'],
                        [Lang.Blocks.byrobot_drone_8_common_light_manual_b75,    '200'],
                        [Lang.Blocks.byrobot_drone_8_common_light_manual_b100,   '255'],
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
                type: 'byrobot_drone_8_controller_light_color_preset',
            },
            paramsKeyMap: {
                FLAGS: 0,
                BRIGHTNESS: 1,
            },
            class: 'byrobot_drone_8_controller_light',
            isNotFor: ['byrobot_drone_8'],
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

                return Entry.byrobot_drone_8.setLightModeColor(script, 0x31, mode, interval, red, green, blue);
            },
        },


        byrobot_drone_8_controller_light_manual_single_input:
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
                    {type: 'text', params: ['0b11100000']},
                    {type: 'text', params: ['255']},
                    null,
                ],
                type: 'byrobot_drone_8_controller_light_manual_single_input',
            },
            paramsKeyMap: {
                FLAGS: 0,
                BRIGHTNESS: 1,
            },
            class: 'byrobot_drone_8_controller_light',
            isNotFor: ['byrobot_drone_8'],
            func: function(sprite, script) {
                var flags = script.getNumberValue('FLAGS');
                var brightness = script.getNumberValue('BRIGHTNESS');
                return Entry.byrobot_drone_8.setLightManual(script, 0x31, flags, brightness);
            },
        },


        byrobot_drone_8_controller_light_color_input:
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
                        [Lang.Blocks.byrobot_drone_8_common_light_mode_hold,             '0'],   // TeamHold             = 0x12
                        [Lang.Blocks.byrobot_drone_8_common_light_mode_flicker,          '1'],   // TeamFlicker          = 0x13
                        [Lang.Blocks.byrobot_drone_8_common_light_mode_flicker_double,   '2'],   // TeamFlickerDouble    = 0x14
                        [Lang.Blocks.byrobot_drone_8_common_light_mode_dimming,          '3'],   // TeamDimming          = 0x15
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
                    'byrobot_drone_8_controller_light_color_input',
            },
            paramsKeyMap: {
                RED: 0,
                GREEN: 1,
                BLUE: 2,
                MODE: 3,
                INTERVAL: 4,
            },
            class: 'byrobot_drone_8_controller_light',
            isNotFor: ['byrobot_drone_8'],
            func: function(sprite, script) {
                var mode = 0x12 + parseInt(script.getField('MODE'));
                var interval = script.getNumberValue('INTERVAL');
                var red = script.getNumberValue('RED');
                var green = script.getNumberValue('GREEN');
                var blue = script.getNumberValue('BLUE');
                return Entry.byrobot_drone_8.setLightModeColor(script, 0x31, mode, interval, red, green, blue);
            },
        },


        byrobot_drone_8_controller_light_color_select:
        {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.byrobot_drone_8_common_light_color_sunset,          'sunset'],
                        [Lang.Blocks.byrobot_drone_8_common_light_color_cottoncandy,     'cottonCandy'],
                        [Lang.Blocks.byrobot_drone_8_common_light_color_muscat,          'muscat'],
                        [Lang.Blocks.byrobot_drone_8_common_light_color_strawberrymilk,  'strawberryMilk'],
                        [Lang.Blocks.byrobot_drone_8_common_light_color_emerald,         'emerald'],
                        [Lang.Blocks.byrobot_drone_8_common_light_color_lavender,        'lavender'],
                    ],
                    value: 'sunset',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.byrobot_drone_8_common_light_mode_hold,             '0'], // TeamHold           = 0x12
                        [Lang.Blocks.byrobot_drone_8_common_light_mode_flicker,          '1'], // TeamFlicker        = 0x13
                        [Lang.Blocks.byrobot_drone_8_common_light_mode_flicker_double,   '2'], // TeamFlickerDouble  = 0x14
                        [Lang.Blocks.byrobot_drone_8_common_light_mode_dimming,          '3'], // TeamDimming        = 0x15
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
                type: 'byrobot_drone_8_controller_light_color_select',
            },
            paramsKeyMap: {
                SELECT: 0,
                MODE: 1,
                INTERVAL: 2,
            },
            class: 'byrobot_drone_8_controller_light',
            isNotFor: ['byrobot_drone_8'],
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

                return Entry.byrobot_drone_8.setLightModeColor(script, 0x31, mode, interval, red, green, blue);
            },
        },


        byrobot_drone_8_drone_light_manual_single_off:
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
                type: 'byrobot_drone_8_drone_light_manual_single_off',
            },
            paramsKeyMap: {},
            class: 'byrobot_drone_8_drone_light',
            isNotFor: ['byrobot_drone_8'],
            func: function(sprite, script) {
                return Entry.byrobot_drone_8.setLightManual(script, 0x30, 0xff, 0);
            },
        },


        byrobot_drone_8_drone_light_color_preset:
        {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.byrobot_drone_8_drone_light_manual_eye_red,     'eye_red'],
                        [Lang.Blocks.byrobot_drone_8_drone_light_manual_eye_green,   'eye_green'],
                        [Lang.Blocks.byrobot_drone_8_drone_light_manual_eye_blue,    'eye_blue'],
                        [Lang.Blocks.byrobot_drone_8_drone_light_manual_arm_red,     'arm_red'],
                        [Lang.Blocks.byrobot_drone_8_drone_light_manual_arm_green,   'arm_green'],
                        [Lang.Blocks.byrobot_drone_8_drone_light_manual_arm_blue,    'arm_blue'],
                    ],
                    value: 'eye_red',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.byrobot_drone_8_common_light_manual_on,     '220'],
                        [Lang.Blocks.byrobot_drone_8_common_light_manual_off,    '0'],
                        [Lang.Blocks.byrobot_drone_8_common_light_manual_b25,    '75'],
                        [Lang.Blocks.byrobot_drone_8_common_light_manual_b50,    '125'],
                        [Lang.Blocks.byrobot_drone_8_common_light_manual_b75,    '200'],
                        [Lang.Blocks.byrobot_drone_8_common_light_manual_b100,   '255'],
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
                type: 'byrobot_drone_8_drone_light_color_preset',
            },
            paramsKeyMap: {
                FLAGS: 0,
                BRIGHTNESS: 1,
            },
            class: 'byrobot_drone_8_drone_light',
            isNotFor: ['byrobot_drone_8'],
            func: function(sprite, script) {
                var mode = 0x12;
                var interval = parseInt(script.getField('BRIGHTNESS'));
                var select = script.getField('FLAGS');
                var red = 0;
                var green = 0;
                var blue = 0;

                switch (select)
                {
                    case 'eye_red':     mode = 0x12;    red = 255;  green = 0;    blue = 0;     break;
                    case 'eye_green':   mode = 0x12;    red = 0;    green = 255;  blue = 0;     break;
                    case 'eye_blue':    mode = 0x12;    red = 0;    green = 0;    blue = 255;   break;
                    case 'arm_red':     mode = 0x42;    red = 255;  green = 0;    blue = 0;     break;
                    case 'arm_green':   mode = 0x42;    red = 0;    green = 255;  blue = 0;     break;
                    case 'arm_blue':    mode = 0x42;    red = 0;    green = 0;    blue = 255;   break;
                }

                return Entry.byrobot_drone_8.setLightModeColor(script, 0x30, mode, interval, red, green, blue);
            },
        },


        byrobot_drone_8_drone_light_manual_single_input:
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
                    {type: 'text', params: ['0b11111100']},
                    {type: 'text', params: ['255']},
                    null,
                ],
                type:
                    'byrobot_drone_8_drone_light_manual_single_input',
            },
            paramsKeyMap: {
                FLAGS: 0,
                BRIGHTNESS: 1,
            },
            class: 'byrobot_drone_8_drone_light',
            isNotFor: ['byrobot_drone_8'],
            func: function(sprite, script) {
                var flags = script.getNumberValue('FLAGS');
                var brightness = script.getNumberValue('BRIGHTNESS');
                return Entry.byrobot_drone_8.setLightManual(script, 0x30, flags, brightness);
            },
        },


        byrobot_drone_8_drone_light_color_input:
        {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.byrobot_drone_8_drone_light_color_body, '18'], // EyeHold = 0x12
                        [Lang.Blocks.byrobot_drone_8_drone_light_color_arm, '66'], // ArmHold = 0x42
                    ],
                    value: '18',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {type: 'Block', accept: 'string'},
                {type: 'Block', accept: 'string'},
                {type: 'Block', accept: 'string'},
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.byrobot_drone_8_common_light_mode_hold,             '0'], // EyeHold = 0x12,          // ArmHold = 0x42
                        [Lang.Blocks.byrobot_drone_8_common_light_mode_flicker,          '1'], // EyeFlicker = 0x13,       // ArmFlicker = 0x43
                        [Lang.Blocks.byrobot_drone_8_common_light_mode_flicker_double,   '2'], // EyeFlickerDouble = 0x14, // ArmFlickerDouble = 0x44
                        [Lang.Blocks.byrobot_drone_8_common_light_mode_dimming,          '3'], // EyeDimming = 0x15,       // ArmDimming = 0x45
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
                    {type: 'text', params: ['255']},
                    {type: 'text', params: ['255']},
                    {type: 'text', params: ['255']},
                    null,
                    {type: 'text', params: ['500']},
                    null,
                ],
                type: 'byrobot_drone_8_drone_light_color_input',
            },
            paramsKeyMap: {
                MODE: 0,
                RED: 1,
                GREEN: 2,
                BLUE: 3,
                MODESUB: 4,
                INTERVAL: 5,
            },
            class: 'byrobot_drone_8_drone_light',
            isNotFor: ['byrobot_drone_8'],
            func: function(sprite, script) {
                var mode = parseInt(script.getField('MODE')) + parseInt(script.getField('MODESUB'));
                var red = script.getNumberValue('RED');
                var green = script.getNumberValue('GREEN');
                var blue = script.getNumberValue('BLUE');
                var interval = script.getNumberValue('INTERVAL');
                return Entry.byrobot_drone_8.setLightModeColor(script, 0x30, mode, interval, red, green, blue);
            },
        },


        byrobot_drone_8_drone_light_color_select:
        {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.byrobot_drone_8_drone_light_color_body, '18'], // EyeHold = 0x12
                        [Lang.Blocks.byrobot_drone_8_drone_light_color_arm, '66'], // ArmHold = 0x42
                    ],
                    value: '18',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.byrobot_drone_8_common_light_color_sunset,          'sunset'],
                        [Lang.Blocks.byrobot_drone_8_common_light_color_cottoncandy,     'cottonCandy'],
                        [Lang.Blocks.byrobot_drone_8_common_light_color_muscat,          'muscat'],
                        [Lang.Blocks.byrobot_drone_8_common_light_color_strawberrymilk,  'strawberryMilk'],
                        [Lang.Blocks.byrobot_drone_8_common_light_color_emerald,         'emerald'],
                        [Lang.Blocks.byrobot_drone_8_common_light_color_lavender,        'lavender'],
                    ],
                    value: 'sunset',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.byrobot_drone_8_common_light_mode_hold,             '0'], // EyeHold = 0x12,          // ArmHold = 0x42
                        [Lang.Blocks.byrobot_drone_8_common_light_mode_flicker,          '1'], // EyeFlicker = 0x13,       // ArmFlicker = 0x43
                        [Lang.Blocks.byrobot_drone_8_common_light_mode_flicker_double,   '2'], // EyeFlickerDouble = 0x14, // ArmFlickerDouble = 0x44
                        [Lang.Blocks.byrobot_drone_8_common_light_mode_dimming,          '3'], // EyeDimming = 0x15,       // ArmDimming = 0x45
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
                    null,
                    {type: 'text', params: ['500']},
                    null,
                ],
                type: 'byrobot_drone_8_drone_light_color_select',
            },
            paramsKeyMap: {
                MODE: 0,
                SELECT: 1,
                MODESUB: 2,
                INTERVAL: 3,
            },
            class: 'byrobot_drone_8_drone_light',
            isNotFor: ['byrobot_drone_8'],
            func: function(sprite, script) {
                var mode = parseInt(script.getField('MODE')) + parseInt(script.getField('MODESUB'));
                var select = script.getField('SELECT');
                var interval = script.getNumberValue('INTERVAL');
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

                return Entry.byrobot_drone_8.setLightModeColor(script, 0x30, mode, interval, red, green, blue);
            },
        },


        byrobot_drone_8_controller_display_clear_all:
        {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.byrobot_drone_8_controller_display_pixel_black, '0'],
                        [Lang.Blocks.byrobot_drone_8_controller_display_pixel_white, '1'],
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
                params: [null, null],
                type: 'byrobot_drone_8_controller_display_clear_all',
            },
            paramsKeyMap: {
                PIXEL: 0,
            },
            class: 'byrobot_drone_8_controller_display',
            isNotFor: ['byrobot_drone_8'],
            func: function(sprite, script) {
                var pixel = parseInt(script.getField('PIXEL'));
                return Entry.byrobot_drone_8.setDisplayClear(script, 0x31, pixel, true, 0, 0, 0, 0);
            },
        },


        byrobot_drone_8_controller_display_clear:
        {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {type: 'Block', accept: 'string'},
                {type: 'Block', accept: 'string'},
                {type: 'Block', accept: 'string'},
                {type: 'Block', accept: 'string'},
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.byrobot_drone_8_controller_display_pixel_black, '0'],
                        [Lang.Blocks.byrobot_drone_8_controller_display_pixel_white, '1'],
                    ],
                    value: '1',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {type: 'Indicator', img: 'block_icon/hardware_icon.svg', size: 12},
            ],
            events: {},
            def: {
                params: [
                    {type: 'text', params: ['64']},
                    {type: 'text', params: ['32']},
                    {type: 'text', params: ['32']},
                    {type: 'text', params: ['16']},
                    null,
                    null,
                ],
                type: 'byrobot_drone_8_controller_display_clear',
            },
            paramsKeyMap: {
                X: 0,
                Y: 1,
                WIDTH: 2,
                HEIGHT: 3,
                PIXEL: 4,
            },
            class: 'byrobot_drone_8_controller_display',
            isNotFor: ['byrobot_drone_8'],
            func: function(sprite, script) {
                var x = script.getNumberValue('X');
                var y = script.getNumberValue('Y');
                var width = script.getNumberValue('WIDTH');
                var height = script.getNumberValue('HEIGHT');
                var pixel = parseInt(script.getField('PIXEL'));
                return Entry.byrobot_drone_8.setDisplayClear(script, 0x31, pixel, false, x, y, width, height);
            },
        },


        byrobot_drone_8_controller_display_invert:
        {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {type: 'Block', accept: 'string'},
                {type: 'Block', accept: 'string'},
                {type: 'Block', accept: 'string'},
                {type: 'Block', accept: 'string'},
                {type: 'Indicator', img: 'block_icon/hardware_icon.svg', size: 12},
            ],
            events: {},
            def: {
                params: [
                    {type: 'text', params: ['32']},
                    {type: 'text', params: ['16']},
                    {type: 'text', params: ['64']},
                    {type: 'text', params: ['32']},
                    null,
                    null,
                ],
                type: 'byrobot_drone_8_controller_display_invert',
            },
            paramsKeyMap: {
                X: 0,
                Y: 1,
                WIDTH: 2,
                HEIGHT: 3,
            },
            class: 'byrobot_drone_8_controller_display',
            isNotFor: ['byrobot_drone_8'],
            func: function(sprite, script) {
                var x = script.getNumberValue('X');
                var y = script.getNumberValue('Y');
                var width = script.getNumberValue('WIDTH');
                var height = script.getNumberValue('HEIGHT');
                return Entry.byrobot_drone_8.setDisplayInvert(script, 0x31, x, y, width, height);
            },
        },


        byrobot_drone_8_controller_display_draw_point:
        {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {type: 'Block', accept: 'string'},
                {type: 'Block', accept: 'string'},
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.byrobot_drone_8_controller_display_pixel_black, '0'],
                        [Lang.Blocks.byrobot_drone_8_controller_display_pixel_white, '1'],
                    ],
                    value: '1',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {type: 'Indicator', img: 'block_icon/hardware_icon.svg', size: 12},
            ],
            events: {},
            def: {
                params: [
                    {type: 'text', params: ['64']},
                    {type: 'text', params: ['32']},
                    null,
                    null,
                ],
                type: 'byrobot_drone_8_controller_display_draw_point',
            },
            paramsKeyMap: {
                X: 0,
                Y: 1,
                PIXEL: 2,
            },
            class: 'byrobot_drone_8_controller_display',
            isNotFor: ['byrobot_drone_8'],
            func: function(sprite, script) {
                var x = script.getNumberValue('X');
                var y = script.getNumberValue('Y');
                var pixel = parseInt(script.getField('PIXEL'));
                return Entry.byrobot_drone_8.setDisplayDrawPoint(script, 0x31, x, y, pixel);
            },
        },


        byrobot_drone_8_controller_display_draw_line:
        {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {type: 'Block', accept: 'string'},
                {type: 'Block', accept: 'string'},
                {type: 'Block', accept: 'string'},
                {type: 'Block', accept: 'string'},
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.byrobot_drone_8_controller_display_pixel_black, '0'],
                        [Lang.Blocks.byrobot_drone_8_controller_display_pixel_white, '1'],
                    ],
                    value: '1',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.byrobot_drone_8_controller_display_line_solid,  '0'],
                        [Lang.Blocks.byrobot_drone_8_controller_display_line_dotted, '1'],
                        [Lang.Blocks.byrobot_drone_8_controller_display_line_dashed, '2'],
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
                params: [
                    {type: 'text', params: ['32']},
                    {type: 'text', params: ['16']},
                    {type: 'text', params: ['96']},
                    {type: 'text', params: ['48']},
                    null,
                    null,
                    null,
                ],
                type: 'byrobot_drone_8_controller_display_draw_line',
            },
            paramsKeyMap: {
                X1: 0,
                Y1: 1,
                X2: 2,
                Y2: 3,
                PIXEL: 4,
                LINE: 5,
            },
            class: 'byrobot_drone_8_controller_display',
            isNotFor: ['byrobot_drone_8'],
            func: function(sprite, script) {
                var x1 = script.getNumberValue('X1');
                var y1 = script.getNumberValue('Y1');
                var x2 = script.getNumberValue('X2');
                var y2 = script.getNumberValue('Y2');
                var pixel = parseInt(script.getField('PIXEL'));
                var line = parseInt(script.getField('LINE'));
                return Entry.byrobot_drone_8.setDisplayDrawLine(script, 0x31, x1, y1, x2, y2, pixel, line);
            },
        },


        byrobot_drone_8_controller_display_draw_rect:
        {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {type: 'Block', accept: 'string'},
                {type: 'Block', accept: 'string'},
                {type: 'Block', accept: 'string'},
                {type: 'Block', accept: 'string'},
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.byrobot_drone_8_controller_display_pixel_black, '0'],
                        [Lang.Blocks.byrobot_drone_8_controller_display_pixel_white, '1'],
                    ],
                    value: '1',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.byrobot_drone_8_controller_display_flagfill_off,    '0'],
                        [Lang.Blocks.byrobot_drone_8_controller_display_flagfill_on,     '1'],
                    ],
                    value: '1',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.byrobot_drone_8_controller_display_line_solid,  '0'],
                        [Lang.Blocks.byrobot_drone_8_controller_display_line_dotted, '1'],
                        [Lang.Blocks.byrobot_drone_8_controller_display_line_dashed, '2'],
                    ],
                    value: '2',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {type: 'Indicator', img: 'block_icon/hardware_icon.svg', size: 12},
            ],
            events: {},
            def: {
                params: [
                    {type: 'text', params: ['64']},
                    {type: 'text', params: ['32']},
                    {type: 'text', params: ['32']},
                    {type: 'text', params: ['16']},
                    null,
                    null,
                    null,
                    null,
                ],
                type: 'byrobot_drone_8_controller_display_draw_rect',
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
            class: 'byrobot_drone_8_controller_display',
            isNotFor: ['byrobot_drone_8'],
            func: function(sprite, script) {
                var x = script.getNumberValue('X');
                var y = script.getNumberValue('Y');
                var width = script.getNumberValue('WIDTH');
                var height = script.getNumberValue('HEIGHT');
                var pixel = parseInt(script.getField('PIXEL'));
                var flagFill = parseInt(script.getField('FLAGFILL'));
                var line = parseInt(script.getField('LINE'));
                return Entry.byrobot_drone_8.setDisplayDrawRect(script, 0x31, x, y, width, height, pixel, flagFill, line);
            },
        },


        byrobot_drone_8_controller_display_draw_circle:
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
                        [Lang.Blocks.byrobot_drone_8_controller_display_pixel_black, '0'],
                        [Lang.Blocks.byrobot_drone_8_controller_display_pixel_white, '1'],
                    ],
                    value: '1',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.byrobot_drone_8_controller_display_flagfill_off,    '0'],
                        [Lang.Blocks.byrobot_drone_8_controller_display_flagfill_on,     '1'],
                    ],
                    value: '1',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {type: 'Indicator', img: 'block_icon/hardware_icon.svg', size: 12},
            ],
            events: {},
            def: {
                params: [
                    {type: 'text', params: ['64']},
                    {type: 'text', params: ['32']},
                    {type: 'text', params: ['24']},
                    null,
                    null,
                    null,
                ],
                type: 'byrobot_drone_8_controller_display_draw_circle',
            },
            paramsKeyMap: {
                X: 0,
                Y: 1,
                RADIUS: 2,
                PIXEL: 3,
                FLAGFILL: 4,
            },
            class: 'byrobot_drone_8_controller_display',
            isNotFor: ['byrobot_drone_8'],
            func: function(sprite, script) {
                var x = script.getNumberValue('X');
                var y = script.getNumberValue('Y');
                var radius = script.getNumberValue('RADIUS');
                var pixel = parseInt(script.getField('PIXEL'));
                var flagFill = parseInt(script.getField('FLAGFILL'));
                return Entry.byrobot_drone_8.setDisplayDrawCircle(script, 0x31, x, y, radius, pixel, flagFill);
            },
        },


        byrobot_drone_8_controller_display_draw_string:
        {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {type: 'Block', accept: 'string'},
                {type: 'Block', accept: 'string'},
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.byrobot_drone_8_controller_display_font_5x8,    '0'],
                        [Lang.Blocks.byrobot_drone_8_controller_display_font_10x16,  '1'],
                    ],
                    value: '1',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.byrobot_drone_8_controller_display_pixel_black, '0'],
                        [Lang.Blocks.byrobot_drone_8_controller_display_pixel_white, '1'],
                    ],
                    value: '1',
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
                    {type: 'text', params: ['4']},
                    {type: 'text', params: ['24']},
                    null,
                    null,
                    {type: 'text', params: ['{Petrone V2}']},
                    null,
                ],
                type: 'byrobot_drone_8_controller_display_draw_string',
            },
            paramsKeyMap: {
                X: 0,
                Y: 1,
                FONT: 2,
                PIXEL: 3,
                STRING: 4,
            },
            class: 'byrobot_drone_8_controller_display',
            isNotFor: ['byrobot_drone_8'],
            func: function(sprite, script) {
                var x = script.getNumberValue('X');
                var y = script.getNumberValue('Y');
                var font = parseInt(script.getField('FONT'));
                var pixel = parseInt(script.getField('PIXEL'));
                var string = script.getStringValue('STRING');
                return Entry.byrobot_drone_8.setDisplayDrawString(script, 0x31, x, y, font, pixel, string);
            },
        },


        byrobot_drone_8_controller_display_draw_string_align:
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
                        [Lang.Blocks.byrobot_drone_8_controller_display_align_left,      '0'],
                        [Lang.Blocks.byrobot_drone_8_controller_display_align_center,    '1'],
                        [Lang.Blocks.byrobot_drone_8_controller_display_align_right,     '2'],
                    ],
                    value: '0',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.byrobot_drone_8_controller_display_font_5x8,    '0'],
                        [Lang.Blocks.byrobot_drone_8_controller_display_font_10x16,  '1'],
                    ],
                    value: '1',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.byrobot_drone_8_controller_display_pixel_black, '0'],
                        [Lang.Blocks.byrobot_drone_8_controller_display_pixel_white, '1'],
                    ],
                    value: '1',
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
                    {type: 'text', params: ['0']},
                    {type: 'text', params: ['128']},
                    {type: 'text', params: ['24']},
                    null,
                    null,
                    null,
                    {type: 'text', params: ['BYROBOT & U']},
                    null,
                ],
                type: 'byrobot_drone_8_controller_display_draw_string_align',
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
            class: 'byrobot_drone_8_controller_display',
            isNotFor: ['byrobot_drone_8'],
            func: function(sprite, script) {
                var xStart = script.getNumberValue('XSTART');
                var xEnd = script.getNumberValue('XEND');
                var y = script.getNumberValue('Y');
                var align = parseInt(script.getField('ALIGN'));
                var font = parseInt(script.getField('FONT'));
                var pixel = parseInt(script.getField('PIXEL'));
                var string = script.getStringValue('STRING');
                return Entry.byrobot_drone_8.setDisplayDrawStringAlign(script, 0x31, xStart, xEnd, y, align, font, pixel, string);
            },
        },


        byrobot_drone_8_controller_buzzer_off:
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
                type: 'byrobot_drone_8_controller_buzzer_off',
            },
            paramsKeyMap: {},
            class: 'byrobot_drone_8_buzzer',
            isNotFor: ['byrobot_drone_8'],
            func: function(sprite, script) {
                return Entry.byrobot_drone_8.setBuzzerStop(script);
            },
        },


        byrobot_drone_8_controller_buzzer_scale:
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
                        [Lang.Blocks.byrobot_drone_8_controller_buzzer_mute, '-1'],
                        [Lang.Blocks.byrobot_drone_8_controller_buzzer_c,    '0'],
                        [Lang.Blocks.byrobot_drone_8_controller_buzzer_cs,   '1'],
                        [Lang.Blocks.byrobot_drone_8_controller_buzzer_d,    '2'],
                        [Lang.Blocks.byrobot_drone_8_controller_buzzer_ds,   '3'],
                        [Lang.Blocks.byrobot_drone_8_controller_buzzer_e,    '4'],
                        [Lang.Blocks.byrobot_drone_8_controller_buzzer_f,    '5'],
                        [Lang.Blocks.byrobot_drone_8_controller_buzzer_fs,   '6'],
                        [Lang.Blocks.byrobot_drone_8_controller_buzzer_g,    '7'],
                        [Lang.Blocks.byrobot_drone_8_controller_buzzer_gs,   '8'],
                        [Lang.Blocks.byrobot_drone_8_controller_buzzer_a,    '9'],
                        [Lang.Blocks.byrobot_drone_8_controller_buzzer_as,   '10'],
                        [Lang.Blocks.byrobot_drone_8_controller_buzzer_b,    '11'],
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
                type: 'byrobot_drone_8_controller_buzzer_scale',
            },
            paramsKeyMap: {
                OCTAVE: 0,
                SCALE: 1,
            },
            class: 'byrobot_drone_8_buzzer',
            isNotFor: ['byrobot_drone_8'],
            func: function(sprite, script) {
                var octave = parseInt(script.getField('OCTAVE'));
                var scale = parseInt(script.getField('SCALE'));

                if (scale == -1)
                    return Entry.byrobot_drone_8.setBuzzerMute(script, 60000, false, true);
                else
                    return Entry.byrobot_drone_8.setBuzzerScale(script, octave, scale, 60000, false, true);
            },
        },


        byrobot_drone_8_controller_buzzer_scale_delay:
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
                        [Lang.Blocks.byrobot_drone_8_controller_buzzer_mute, '-1'],
                        [Lang.Blocks.byrobot_drone_8_controller_buzzer_c,    '0'],
                        [Lang.Blocks.byrobot_drone_8_controller_buzzer_cs,   '1'],
                        [Lang.Blocks.byrobot_drone_8_controller_buzzer_d,    '2'],
                        [Lang.Blocks.byrobot_drone_8_controller_buzzer_ds,   '3'],
                        [Lang.Blocks.byrobot_drone_8_controller_buzzer_e,    '4'],
                        [Lang.Blocks.byrobot_drone_8_controller_buzzer_f,    '5'],
                        [Lang.Blocks.byrobot_drone_8_controller_buzzer_fs,   '6'],
                        [Lang.Blocks.byrobot_drone_8_controller_buzzer_g,    '7'],
                        [Lang.Blocks.byrobot_drone_8_controller_buzzer_gs,   '8'],
                        [Lang.Blocks.byrobot_drone_8_controller_buzzer_a,    '9'],
                        [Lang.Blocks.byrobot_drone_8_controller_buzzer_as,   '10'],
                        [Lang.Blocks.byrobot_drone_8_controller_buzzer_b,    '11'],
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
                type: 'byrobot_drone_8_controller_buzzer_scale_delay',
            },
            paramsKeyMap: {
                OCTAVE: 0,
                SCALE: 1,
                TIME: 2,
            },
            class: 'byrobot_drone_8_buzzer',
            isNotFor: ['byrobot_drone_8'],
            func: function(sprite, script) {
                var octave = parseInt(script.getField('OCTAVE'));
                var scale = parseInt(script.getField('SCALE'));
                var time = parseInt(script.getNumberValue('TIME') * 1000);

                if (scale == -1)
                    return Entry.byrobot_drone_8.setBuzzerMute(script, time, true, true);
                else
                    return Entry.byrobot_drone_8.setBuzzerScale(script, octave, scale, time, true, true);
            },
        },


        byrobot_drone_8_controller_buzzer_scale_reserve:
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
                        [Lang.Blocks.byrobot_drone_8_controller_buzzer_mute, '-1'],
                        [Lang.Blocks.byrobot_drone_8_controller_buzzer_c,    '0'],
                        [Lang.Blocks.byrobot_drone_8_controller_buzzer_cs,   '1'],
                        [Lang.Blocks.byrobot_drone_8_controller_buzzer_d,    '2'],
                        [Lang.Blocks.byrobot_drone_8_controller_buzzer_ds,   '3'],
                        [Lang.Blocks.byrobot_drone_8_controller_buzzer_e,    '4'],
                        [Lang.Blocks.byrobot_drone_8_controller_buzzer_f,    '5'],
                        [Lang.Blocks.byrobot_drone_8_controller_buzzer_fs,   '6'],
                        [Lang.Blocks.byrobot_drone_8_controller_buzzer_g,    '7'],
                        [Lang.Blocks.byrobot_drone_8_controller_buzzer_gs,   '8'],
                        [Lang.Blocks.byrobot_drone_8_controller_buzzer_a,    '9'],
                        [Lang.Blocks.byrobot_drone_8_controller_buzzer_as,   '10'],
                        [Lang.Blocks.byrobot_drone_8_controller_buzzer_b,    '11'],
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
                type: 'byrobot_drone_8_controller_buzzer_scale_reserve',
            },
            paramsKeyMap: {
                OCTAVE: 0,
                SCALE: 1,
                TIME: 2,
            },
            class: 'byrobot_drone_8_buzzer',
            isNotFor: ['byrobot_drone_8'],
            func: function(sprite, script) {
                var octave = parseInt(script.getField('OCTAVE'));
                var scale = parseInt(script.getField('SCALE'));
                var time = parseInt(script.getNumberValue('TIME') * 1000);

                if (scale == -1)
                    return Entry.byrobot_drone_8.setBuzzerMute(script, time, false, false);
                else
                    return Entry.byrobot_drone_8.setBuzzerScale(script, octave, scale, time, false, false);
            },
        },


        byrobot_drone_8_controller_buzzer_hz:
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
                type: 'byrobot_drone_8_controller_buzzer_hz',
            },
            paramsKeyMap: {
                HZ: 0,
            },
            class: 'byrobot_drone_8_buzzer',
            isNotFor: ['byrobot_drone_8'],
            func: function(sprite, script) {
                var hz = parseInt(script.getNumberValue('HZ', script));
                return Entry.byrobot_drone_8.setBuzzerHz(script, hz, 60000, false, true);
            },
        },


        byrobot_drone_8_controller_buzzer_hz_delay:
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
                type: 'byrobot_drone_8_controller_buzzer_hz_delay',
            },
            paramsKeyMap: {
                HZ: 0,
                TIME: 1,
            },
            class: 'byrobot_drone_8_buzzer',
            isNotFor: ['byrobot_drone_8'],
            func: function(sprite, script) {
                var hz = parseInt(script.getNumberValue('HZ', script));
                var time = parseInt(script.getNumberValue('TIME') * 1000);
                return Entry.byrobot_drone_8.setBuzzerHz(script, hz, time, true, true);
            },
        },


        byrobot_drone_8_controller_buzzer_hz_reserve:
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
                type: 'byrobot_drone_8_controller_buzzer_hz_reserve',
            },
            paramsKeyMap: {
                HZ: 0,
                TIME: 1,
            },
            class: 'byrobot_drone_8_buzzer',
            isNotFor: ['byrobot_drone_8'],
            func: function(sprite, script) {
                var hz = parseInt(script.getNumberValue('HZ', script));
                var time = parseInt(script.getNumberValue('TIME') * 1000);
                return Entry.byrobot_drone_8.setBuzzerHz(script, hz, time, false, false);
            },
        },


        byrobot_drone_8_controller_vibrator_off:
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
                type: 'byrobot_drone_8_controller_vibrator_off',
            },
            paramsKeyMap: {},
            class: 'byrobot_drone_8_vibrator',
            isNotFor: ['byrobot_drone_8'],
            func: function(sprite, script) {
                return Entry.byrobot_drone_8.setVibratorStop(script);
            },
        },


        byrobot_drone_8_controller_vibrator_on_delay:
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
                    {type: 'text', params: ['1']},
                    null,
                ],
                type: 'byrobot_drone_8_controller_vibrator_on_delay',
            },
            paramsKeyMap: {
                TIMEON: 0,
            },
            class: 'byrobot_drone_8_vibrator',
            isNotFor: ['byrobot_drone_8'],
            func: function(sprite, script) {
                var timeOn = parseInt(script.getNumberValue('TIMEON') * 1000);
                return Entry.byrobot_drone_8.setVibrator(script, timeOn, 0, timeOn, true, true);
            },
        },


        byrobot_drone_8_controller_vibrator_on_reserve:
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
                    {type: 'text', params: ['1']},
                    null,
                ],
                type: 'byrobot_drone_8_controller_vibrator_on_reserve',
            },
            paramsKeyMap: {
                TIMEON: 0,
            },
            class: 'byrobot_drone_8_vibrator',
            isNotFor: ['byrobot_drone_8'],
            func: function(sprite, script) {
                var timeOn = parseInt(script.getNumberValue('TIMEON') * 1000);
                return Entry.byrobot_drone_8.setVibrator(script, timeOn, 0, timeOn, false, false);
            },
        },


        byrobot_drone_8_controller_vibrator_delay:
        {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {type: 'Block', accept: 'string'},
                {type: 'Block', accept: 'string'},
                {type: 'Block', accept: 'string'},
                {type: 'Indicator', img: 'block_icon/hardware_icon.svg', size: 12},
            ],
            events: {},
            def: {
                params: [
                    {type: 'text', params: ['0.02']},
                    {type: 'text', params: ['0.2']},
                    {type: 'text', params: ['1']},
                    null,
                ],
                type: 'byrobot_drone_8_controller_vibrator_delay',
            },
            paramsKeyMap: {
                TIMEON: 0,
                TIMEOFF: 1,
                TIMERUN: 2,
            },
            class: 'byrobot_drone_8_vibrator',
            isNotFor: ['byrobot_drone_8'],
            func: function(sprite, script) {
                var timeOn = parseInt(script.getNumberValue('TIMEON') * 1000);
                var timeOff = parseInt(script.getNumberValue('TIMEOFF') * 1000);
                var timeRun = parseInt(script.getNumberValue('TIMERUN') * 1000);
                return Entry.byrobot_drone_8.setVibrator(script, timeOn, timeOff, timeRun, true, true);
            },
        },


        byrobot_drone_8_controller_vibrator_reserve:
        {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {type: 'Block', accept: 'string'},
                {type: 'Block', accept: 'string'},
                {type: 'Block', accept: 'string'},
                {type: 'Indicator', img: 'block_icon/hardware_icon.svg', size: 12},
            ],
            events: {},
            def: {
                params: [
                    {type: 'text', params: ['0.02']},
                    {type: 'text', params: ['0.2']},
                    {type: 'text', params: ['1']},
                    null,
                ],
                type: 'byrobot_drone_8_controller_vibrator_reserve',
            },
            paramsKeyMap: {
                TIMEON: 0,
                TIMEOFF: 1,
                TIMERUN: 2,
            },
            class: 'byrobot_drone_8_vibrator',
            isNotFor: ['byrobot_drone_8'],
            func: function(sprite, script) {
                var timeOn = parseInt(script.getNumberValue('TIMEON') * 1000);
                var timeOff = parseInt(script.getNumberValue('TIMEOFF') * 1000);
                var timeRun = parseInt(script.getNumberValue('TIMERUN') * 1000);
                return Entry.byrobot_drone_8.setVibrator(script, timeOn, timeOff, timeRun, false, false);
            },
        },


        byrobot_drone_8_drone_irmessage:
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
                    {type: 'text', params: ['0']},
                    null,
                ],
                type: 'byrobot_drone_8_drone_irmessage',
            },
            paramsKeyMap: {
                IRMESSAGE: 0,
            },
            class: 'byrobot_drone_8_irmessage',
            isNotFor: ['byrobot_drone_8'],
            func: function(sprite, script) {
                var irdirection = 0;
                var irmessage = script.getNumberValue('IRMESSAGE', script);
                return Entry.byrobot_drone_8.sendIrMessage(script, irdirection, irmessage);
            },
        },


        byrobot_drone_8_drone_motor_stop:
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
                type: 'byrobot_drone_8_drone_motor_stop',
            },
            paramsKeyMap: {},
            class: 'byrobot_drone_8_motor',
            isNotFor: ['byrobot_drone_8'],
            func: function(sprite, script) {
                return Entry.byrobot_drone_8.sendStop(script);
            },
        },


        byrobot_drone_8_drone_motorsingle:
        {
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
                {type: 'Block', accept: 'string'},
                {type: 'Indicator', img: 'block_icon/hardware_icon.svg', size: 12},
            ],
            events: {},
            def: {
                params: [
                    null,
                    {type: 'text', params: ['3000']},
                    null,
                ],
                type: 'byrobot_drone_8_drone_motorsingle',
            },
            paramsKeyMap: {
                MOTORINDEX: 0,
                MOTORSPEED: 1,
            },
            class: 'byrobot_drone_8_motor',
            isNotFor: ['byrobot_drone_8'],
            func: function(sprite, script) {
                var motorIndex = parseInt(script.getField('MOTORINDEX'));
                var motorRotation = motorIndex % 2 + 1;
                var motorSpeed = parseInt(
                    script.getNumberValue('MOTORSPEED', script)
                );

                return Entry.byrobot_drone_8.setMotorSingle(script, motorIndex, motorRotation, motorSpeed);
            },
        },


        byrobot_drone_8_drone_motorsingle_input:
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
                    {type: 'text', params: ['1']},
                    {type: 'text', params: ['3000']},
                    null,
                ],
                type: 'byrobot_drone_8_drone_motorsingle_input',
            },
            paramsKeyMap: {
                MOTORINDEX: 0,
                MOTORSPEED: 1,
            },
            class: 'byrobot_drone_8_motor',
            isNotFor: ['byrobot_drone_8'],
            func: function(sprite, script) {
                var motorIndex =
                    parseInt(script.getNumberValue('MOTORINDEX', script)) - 1;
                var motorRotation = motorIndex % 2 + 1;
                var motorSpeed = parseInt(
                    script.getNumberValue('MOTORSPEED', script)
                );

                return Entry.byrobot_drone_8.setMotorSingle(script, motorIndex, motorRotation, motorSpeed);
            },
        },


        byrobot_drone_8_drone_motorsingle_rotation:
        {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [['1', '0'], ['2', '1']],
                    value: '0',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.byrobot_drone_8_drone_motor_rotation_clockwise,         '1'],
                        [Lang.Blocks.byrobot_drone_8_drone_motor_rotation_counterclockwise,  '2'],
                    ],
                    value: '1',
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
                    {type: 'text', params: ['3000']},
                    null,
                ],
                type: 'byrobot_drone_8_drone_motorsingle_rotation',
            },
            paramsKeyMap: {
                MOTORINDEX: 0,
                MOTORROTATION: 1,
                MOTORSPEED: 2,
            },
            class: 'byrobot_drone_8_motor',
            isNotFor: ['byrobot_drone_8'],
            func: function(sprite, script) {
                var motorIndex = parseInt(script.getField('MOTORINDEX'));
                var motorRotation = parseInt(script.getField('MOTORROTATION'));
                var motorSpeed = parseInt(
                    script.getNumberValue('MOTORSPEED', script)
                );

                return Entry.byrobot_drone_8.setMotorSingle(script, motorIndex, motorRotation, motorSpeed);
            },
        },


        byrobot_drone_8_drone_command_mode_vehicle_drone:
        {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.byrobot_drone_8_drone_vehicle_flight,           '16'],
                        [Lang.Blocks.byrobot_drone_8_drone_vehicle_flight_noguard,   '17'],
                        [Lang.Blocks.byrobot_drone_8_drone_vehicle_flight_fpv,       '18'],
                    ],
                    value: '16',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {type: 'Indicator', img: 'block_icon/hardware_icon.svg', size: 12},
            ],
            events: {},
            def: {
                params: [null, null],
                type: 'byrobot_drone_8_drone_command_mode_vehicle_drone',
            },
            paramsKeyMap: {
                VEHICLE: 0,
            },
            class: 'byrobot_drone_8_control_flight',
            isNotFor: ['byrobot_drone_8'],
            func: function(sprite, script) {
                var vehicle = script.getField('VEHICLE');
                return Entry.byrobot_drone_8.setModeVehicle(script, vehicle);
            },
        },


        byrobot_drone_8_drone_control_drone_takeoff:
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
                type: 'byrobot_drone_8_drone_control_drone_takeoff',
            },
            paramsKeyMap: {},
            class: 'byrobot_drone_8_control_flight',
            isNotFor: ['byrobot_drone_8'],
            func: function(sprite, script) {
                return Entry.byrobot_drone_8.setEventFlight(script, 0x11, 200); // 0x11 : FlightEvent::TakeOff
            },
        },


        byrobot_drone_8_drone_control_drone_landing:
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
                type: 'byrobot_drone_8_drone_control_drone_landing',
            },
            paramsKeyMap: {},
            class: 'byrobot_drone_8_control_flight',
            isNotFor: ['byrobot_drone_8'],
            func: function(sprite, script) {
                return Entry.byrobot_drone_8.setEventFlight(script, 0x12, 200); // 0x12 : FlightEvent::Landing
            },
        },


        byrobot_drone_8_drone_control_drone_stop:
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
                type: 'byrobot_drone_8_drone_control_drone_stop',
            },
            paramsKeyMap: {},
            class: 'byrobot_drone_8_control_flight',
            isNotFor: ['byrobot_drone_8'],
            func: function(sprite, script) {
                return Entry.byrobot_drone_8.sendStop(script);
            },
        },


        byrobot_drone_8_drone_control_headless:
        {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.byrobot_drone_8_drone_headless_headless, '1'],
                        [Lang.Blocks.byrobot_drone_8_drone_headless_normal, '2'],
                    ],
                    value: '1',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {type: 'Indicator', img: 'block_icon/hardware_icon.svg', size: 12},
            ],
            events: {},
            def: {
                params: [null, null],
                type: 'byrobot_drone_8_drone_control_headless',
            },
            paramsKeyMap: {
                COORDINATE: 0,
            },
            class: 'byrobot_drone_8_control_flight',
            isNotFor: ['byrobot_drone_8'],
            func: function(sprite, script) {
                var coordinate = script.getField('COORDINATE');
                return Entry.byrobot_drone_8.sendCommand(script, 0x30, 0x20, coordinate);
            },
        },


        byrobot_drone_8_drone_control_drone_reset_heading:
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
                type: 'byrobot_drone_8_drone_control_drone_reset_heading',
            },
            paramsKeyMap: {},
            class: 'byrobot_drone_8_control_flight',
            isNotFor: ['byrobot_drone_8'],
            func: function(sprite, script) {
                return Entry.byrobot_drone_8.sendCommand(script, 0x30, 0x22, 0xa0); // 0x22 : CommandType::FlightEvent  // 0xA0 : FlightEvent::ResetHeading
            },
        },


        byrobot_drone_8_drone_control_quad_one:
        {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.byrobot_drone_8_drone_control_quad_roll,        'control_roll'],
                        [Lang.Blocks.byrobot_drone_8_drone_control_quad_pitch,       'control_pitch'],
                        [Lang.Blocks.byrobot_drone_8_drone_control_quad_yaw,         'control_yaw'],
                        [Lang.Blocks.byrobot_drone_8_drone_control_quad_throttle,    'control_throttle'],
                    ],
                    value: 'control_throttle',
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
                    {type: 'number', params: ['0']},
                    null,
                ],
                type: 'byrobot_drone_8_drone_control_quad_one',
            },
            paramsKeyMap: {
                CONTROLTARGET: 0,
                VALUE: 1,
            },
            class: 'byrobot_drone_8_control_flight',
            isNotFor: ['byrobot_drone_8'],
            func: function(sprite, script) {
                var controlTarget = script.getField('CONTROLTARGET');
                var value = parseInt(script.getNumberValue('VALUE', script));

                return Entry.byrobot_drone_8.sendControlQuadSingle(script, controlTarget, value, 0, false);
            },
        },


        byrobot_drone_8_drone_control_quad_one_delay:
        {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.byrobot_drone_8_drone_control_quad_roll,        'control_roll'],
                        [Lang.Blocks.byrobot_drone_8_drone_control_quad_pitch,       'control_pitch'],
                        [Lang.Blocks.byrobot_drone_8_drone_control_quad_yaw,         'control_yaw'],
                        [Lang.Blocks.byrobot_drone_8_drone_control_quad_throttle,    'control_throttle'],
                    ],
                    value: 'control_throttle',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {type: 'Block', accept: 'string'},
                {type: 'Block', accept: 'string'},
                {type: 'Indicator', img: 'block_icon/hardware_icon.svg', size: 12},
            ],
            events: {},
            def: {
                params: [
                    null,
                    {type: 'number', params: ['100']},
                    {type: 'number', params: ['1']},
                    null,
                ],
                type: 'byrobot_drone_8_drone_control_quad_one_delay',
            },
            paramsKeyMap: {
                CONTROLTARGET: 0,
                VALUE: 1,
                TIME: 2,
            },
            class: 'byrobot_drone_8_control_flight',
            isNotFor: ['byrobot_drone_8'],
            func: function(sprite, script) {
                var controlTarget = script.getField('CONTROLTARGET');
                var value = parseInt(script.getNumberValue('VALUE', script));
                var time = parseInt(script.getNumberValue('TIME', script) * 1000);

                return Entry.byrobot_drone_8.sendControlQuadSingle(script, controlTarget, value, time, true);
            },
        },


        byrobot_drone_8_drone_control_quad:
        {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {type: 'Block', accept: 'string'},
                {type: 'Block', accept: 'string'},
                {type: 'Block', accept: 'string'},
                {type: 'Block', accept: 'string'},
                {type: 'Indicator', img: 'block_icon/hardware_icon.svg', size: 12},
            ],
            events: {},
            def: {
                params: [
                    {type: 'number', params: ['0']},
                    {type: 'number', params: ['0']},
                    {type: 'number', params: ['0']},
                    {type: 'number', params: ['0']},
                    null,
                ],
                type: 'byrobot_drone_8_drone_control_quad',
            },
            paramsKeyMap: {
                ROLL: 0,
                PITCH: 1,
                YAW: 2,
                THROTTLE: 3,
            },
            class: 'byrobot_drone_8_control_flight',
            isNotFor: ['byrobot_drone_8'],
            func: function(sprite, script) {
                var roll = parseInt(script.getNumberValue('ROLL', script));
                var pitch = parseInt(script.getNumberValue('PITCH', script));
                var yaw = parseInt(script.getNumberValue('YAW', script));
                var throttle = parseInt(script.getNumberValue('THROTTLE', script));

                return Entry.byrobot_drone_8.sendControlQuad(script, roll, pitch, yaw, throttle, 0, false);
            },
        },


        byrobot_drone_8_drone_control_quad_delay:
        {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {type: 'Block', accept: 'string'},
                {type: 'Block', accept: 'string'},
                {type: 'Block', accept: 'string'},
                {type: 'Block', accept: 'string'},
                {type: 'Block', accept: 'string'},
                {type: 'Indicator', img: 'block_icon/hardware_icon.svg', size: 12},
            ],
            events: {},
            def: {
                params: [
                    {type: 'number', params: ['0']},
                    {type: 'number', params: ['0']},
                    {type: 'number', params: ['0']},
                    {type: 'number', params: ['0']},
                    {type: 'number', params: ['1']},
                    null,
                ],
                type: 'byrobot_drone_8_drone_control_quad_delay',
            },
            paramsKeyMap: {
                ROLL: 0,
                PITCH: 1,
                YAW: 2,
                THROTTLE: 3,
                TIME: 4,
            },
            class: 'byrobot_drone_8_control_flight',
            isNotFor: ['byrobot_drone_8'],
            func: function(sprite, script) {
                var roll = parseInt(script.getNumberValue('ROLL', script));
                var pitch = parseInt(script.getNumberValue('PITCH', script));
                var yaw = parseInt(script.getNumberValue('YAW', script));
                var throttle = parseInt(script.getNumberValue('THROTTLE', script));
                var time = parseInt(script.getNumberValue('TIME', script) * 1000);

                return Entry.byrobot_drone_8.sendControlQuad(script, roll, pitch, yaw, throttle, time, true);
            },
        },
    };
};

module.exports = Entry.byrobot_drone_8;

