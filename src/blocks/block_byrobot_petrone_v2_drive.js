"use strict";

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

Entry.byrobot_petrone_v2_drive =
{
    name: 'byrobot_petrone_v2_drive',
    
    // 초기화
    setZero: function()
    {
        // 초기화
        this.transferBufferClear();
        
        // 한 번에 명령을 전송하면 hw까지 제대로 전달되지 않는 경우가 있어
        // 명령을 각각 분리하여 전송하게 함(2017.01.03)
        for (var i = 0; i < 1; i++)
        {
            this.transferCommand(0x30, 0x24, 0);        // 드론, command = 0x24 (Stop)
            this.transferVibrator(0, 0, 0, 0);
            this.transferbuzzer(0, 0, 0);
            this.transferLightManual(0x30, 0xFF, 0);    // LED 초기화(모두 꺼짐)
            this.transferLightManual(0x31, 0xFF, 0);    // LED 초기화(모두 꺼짐)
            this.transferLightManual(0x30, 0x80, 200);  // LED 초기화(눈 빨강)
            this.transferLightManual(0x30, 0x10, 200);  // LED 초기화(팔 빨강)
            this.transferMotorSingle(0, 1, 0);          // 1번 모터방향 초기화(시계방향)
            this.transferMotorSingle(1, 2, 0);          // 2번 모터방향 초기화(반시계방향)
        }
    },
    
    // Entry 좌측 하단 하드웨어 모니터 화면에 표시하는 속성 
    // listPorts와 ports 두 곳 동시에 동일한 속성을 표시할 수는 없음
    monitorTemplate:
    {
        /* 센서창 가림 현상을 해결하기 위해서 주석 처리함(2017.11.06)
        imgPath: "hw/byrobot_petrone_v2_drive.png",      // 배경 이미지
        width: 256,     // 이미지의 폭
        height: 256,    // 이미지의 높이
        */
        
        // 모니터 화면 상단에 차례대로 나열하는 값
        listPorts:
        {
            // 팀 상태 보여주기
            "state_modeVehicle"             :{name: Lang.Blocks.byrobot_petrone_v2_drone_state_mode_vehicle,              type: "input", pos: {x: 0, y: 0}},
            "state_modeDrive"               :{name: Lang.Blocks.byrobot_petrone_v2_drone_state_mode_drive,                type: "input", pos: {x: 0, y: 0}},
            "state_battery"                 :{name: Lang.Blocks.byrobot_petrone_v2_drone_state_battery,                   type: "input", pos: {x: 0, y: 0}},
            "imu_angleRoll"                 :{name: Lang.Blocks.byrobot_petrone_v2_drone_attitude_roll,                   type: "input", pos: {x: 0, y: 0}},
            "imu_anglePitch"                :{name: Lang.Blocks.byrobot_petrone_v2_drone_attitude_pitch,                  type: "input", pos: {x: 0, y: 0}},
            "imu_angleYaw"                  :{name: Lang.Blocks.byrobot_petrone_v2_drone_attitude_yaw,                    type: "input", pos: {x: 0, y: 0}},
            "imu_accX"                      :{name: Lang.Blocks.byrobot_petrone_v2_drone_accel_x,                         type: "input", pos: {x: 0, y: 0}},
            "imu_accY"                      :{name: Lang.Blocks.byrobot_petrone_v2_drone_accel_y,                         type: "input", pos: {x: 0, y: 0}},
            "imu_accZ"                      :{name: Lang.Blocks.byrobot_petrone_v2_drone_accel_z,                         type: "input", pos: {x: 0, y: 0}},
            "imu_gyroRoll"                  :{name: Lang.Blocks.byrobot_petrone_v2_drone_gyro_roll,                       type: "input", pos: {x: 0, y: 0}},
            "imu_gyroPitch"                 :{name: Lang.Blocks.byrobot_petrone_v2_drone_gyro_pitch,                      type: "input", pos: {x: 0, y: 0}},
            "imu_gyroYaw"                   :{name: Lang.Blocks.byrobot_petrone_v2_drone_gyro_yaw,                        type: "input", pos: {x: 0, y: 0}},
            "pressure_temperature"          :{name: Lang.Blocks.byrobot_petrone_v2_drone_pressure_temperature,            type: "input", pos: {x: 0, y: 0}},
            "pressure_pressure"             :{name: Lang.Blocks.byrobot_petrone_v2_drone_pressure_pressure,               type: "input", pos: {x: 0, y: 0}},
            "imageflow_positionX"           :{name: Lang.Blocks.byrobot_petrone_v2_drone_imageflow_positionX,             type: "input", pos: {x: 0, y: 0}},
            "imageflow_positionY"           :{name: Lang.Blocks.byrobot_petrone_v2_drone_imageflow_positionY,             type: "input", pos: {x: 0, y: 0}},
            "range_bottom"                  :{name: Lang.Blocks.byrobot_petrone_v2_drone_range_bottom,                    type: "input", pos: {x: 0, y: 0}},
            "irmessage_direction"           :{name: Lang.Blocks.byrobot_petrone_v2_drone_irmessage_direction,             type: "input", pos: {x: 0, y: 0}},
            "irmessage_irdata"              :{name: Lang.Blocks.byrobot_petrone_v2_drone_irmessage,                       type: "input", pos: {x: 0, y: 0}},
            "joystick_left_x"               :{name: Lang.Blocks.byrobot_petrone_v2_controller_joystick_left_x,            type: "input", pos: {x: 0, y: 0}},
            "joystick_left_y"               :{name: Lang.Blocks.byrobot_petrone_v2_controller_joystick_left_y,            type: "input", pos: {x: 0, y: 0}},
            "joystick_left_direction"       :{name: Lang.Blocks.byrobot_petrone_v2_controller_joystick_left_direction,    type: "input", pos: {x: 0, y: 0}},
            "joystick_left_event"           :{name: Lang.Blocks.byrobot_petrone_v2_controller_joystick_left_event,        type: "input", pos: {x: 0, y: 0}},
            "joystick_right_x"              :{name: Lang.Blocks.byrobot_petrone_v2_controller_joystick_right_x,           type: "input", pos: {x: 0, y: 0}},
            "joystick_right_y"              :{name: Lang.Blocks.byrobot_petrone_v2_controller_joystick_right_y,           type: "input", pos: {x: 0, y: 0}},
            "joystick_right_direction"      :{name: Lang.Blocks.byrobot_petrone_v2_controller_joystick_right_direction,   type: "input", pos: {x: 0, y: 0}},
            "joystick_right_event"          :{name: Lang.Blocks.byrobot_petrone_v2_controller_joystick_right_event,       type: "input", pos: {x: 0, y: 0}},
            "button_button"                 :{name: Lang.Blocks.byrobot_petrone_v2_controller_button_button,              type: "input", pos: {x: 0, y: 0}},
            "button_event"                  :{name: Lang.Blocks.byrobot_petrone_v2_controller_button_event,               type: "input", pos: {x: 0, y: 0}},
            "entryhw_countTransferReserved" :{name: Lang.Blocks.byrobot_petrone_v2_entryhw_count_transfer_reserved,       type: "output", pos: {x: 0, y: 0}},
        },

        // 모니터 화면 지정 위치와 선으로 연결하여 표시하는 값
        ports:
        {
            
        },

        mode : 'both'   // 표시 모드
    },
    
    // functions
    
    // 시간 지연
    checkFinish: function(script, ms)
    {
        if (!script.isStart)
        {
            script.isStart = true;
            script.timeFlag = 1;
            
            var fps = Entry.FPS || 60;
            var timeValue = (60 / fps) * ms;
            
            setTimeout(function()
            {
                script.timeFlag = 0;
            }, timeValue);
            
            return "Start";
        }
        else if (script.timeFlag == 1)
        {
            return "Running";
        }
        else
        {
            delete script.timeFlag;
            delete script.isStart;
            Entry.engine.isContinue = false;
            return "Finish";
        }
    },

    transferBufferClear: function ()
    {
        Entry.hw.setDigitalPortValue("buffer_clear", 0);

        Entry.hw.update();

        delete Entry.hw.sendQueue["buffer_clear"];
    },
    
    // 데이터 전송
    transferLightManual: function(target, flags, brightness)
    {
        // 범위 조정
        target = Math.max(target, 0);
        target = Math.min(target, 255);
        flags = Math.max(flags, 0);
        flags = Math.min(flags, 255);
        brightness = Math.max(brightness, 0);
        brightness = Math.min(brightness, 255);
        
        // 전송
        Entry.hw.setDigitalPortValue("target", target);
        Entry.hw.setDigitalPortValue("light_manual_flags", flags);
        Entry.hw.setDigitalPortValue("light_manual_brightness", brightness);

        Entry.hw.update();

        delete Entry.hw.sendQueue["target"];
        delete Entry.hw.sendQueue["light_manual_flags"];
        delete Entry.hw.sendQueue["light_manual_brightness"];
    },

    transferLightMode: function(target, mode, interval)
    {
        // 범위 조정
        target = Math.max(target, 0);
        target = Math.min(target, 255);
        mode = Math.max(mode, 0);
        mode = Math.min(mode, 255);
        interval = Math.max(interval, 0);
        interval = Math.min(interval, 65535);
        
        // 전송
        Entry.hw.setDigitalPortValue("target", target);
        Entry.hw.setDigitalPortValue("light_mode_mode", mode);
        Entry.hw.setDigitalPortValue("light_mode_interval", interval);

        Entry.hw.update();

        delete Entry.hw.sendQueue["target"];
        delete Entry.hw.sendQueue["light_mode_mode"];
        delete Entry.hw.sendQueue["light_mode_interval"];
    },

    transferLightColorRgb: function (target, mode, red, green, blue) 
    {
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
        Entry.hw.setDigitalPortValue("target", target);
        Entry.hw.setDigitalPortValue("light_mode_mode", mode);
        Entry.hw.setDigitalPortValue("light_color_r", red);
        Entry.hw.setDigitalPortValue("light_color_g", green);
        Entry.hw.setDigitalPortValue("light_color_b", blue);

        Entry.hw.update();

        delete Entry.hw.sendQueue["target"];
        delete Entry.hw.sendQueue["light_mode_mode"];
        delete Entry.hw.sendQueue["light_color_r"];
        delete Entry.hw.sendQueue["light_color_g"];
        delete Entry.hw.sendQueue["light_color_b"];
    },

    transferDisplayClear: function(target, pixel, clearAll, x, y, width, height)
    {
        if( clearAll )
        {
            // 전송
            Entry.hw.setDigitalPortValue("target", target);
            Entry.hw.setDigitalPortValue("display_clearall_pixel", pixel);

            Entry.hw.update();

            delete Entry.hw.sendQueue["target"];
            delete Entry.hw.sendQueue["display_clearall_pixel"];
        }
        else 
        {
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
            Entry.hw.setDigitalPortValue("target", target);
            Entry.hw.setDigitalPortValue("display_clear_x", x);
            Entry.hw.setDigitalPortValue("display_clear_y", y);
            Entry.hw.setDigitalPortValue("display_clear_width", width);
            Entry.hw.setDigitalPortValue("display_clear_height", height);
            Entry.hw.setDigitalPortValue("display_clear_pixel", pixel);

            Entry.hw.update();

            delete Entry.hw.sendQueue["target"];
            delete Entry.hw.sendQueue["display_clear_x"];
            delete Entry.hw.sendQueue["display_clear_y"];
            delete Entry.hw.sendQueue["display_clear_width"];
            delete Entry.hw.sendQueue["display_clear_height"];
            delete Entry.hw.sendQueue["display_clear_pixel"];
        }
    },

    transferDisplayInvert: function(target, x, y, width, height)
    {
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
        Entry.hw.setDigitalPortValue("target", target);
        Entry.hw.setDigitalPortValue("display_invert_x", x);
        Entry.hw.setDigitalPortValue("display_invert_y", y);
        Entry.hw.setDigitalPortValue("display_invert_width", width);
        Entry.hw.setDigitalPortValue("display_invert_height", height);

        Entry.hw.update();

        delete Entry.hw.sendQueue["target"];
        delete Entry.hw.sendQueue["display_invert_x"];
        delete Entry.hw.sendQueue["display_invert_y"];
        delete Entry.hw.sendQueue["display_invert_width"];
        delete Entry.hw.sendQueue["display_invert_height"];
    },

    transferDisplayDrawPoint: function(target, x, y, pixel)
    {
        // 범위 조정
        x = Math.max(x, 0);
        x = Math.min(x, 128);
        y = Math.max(y, 0);
        y = Math.min(y, 64);

        // 전송
        Entry.hw.setDigitalPortValue("target", target);
        Entry.hw.setDigitalPortValue("display_draw_point_x", x);
        Entry.hw.setDigitalPortValue("display_draw_point_y", y);
        Entry.hw.setDigitalPortValue("display_draw_point_pixel", pixel);

        Entry.hw.update();

        delete Entry.hw.sendQueue["target"];
        delete Entry.hw.sendQueue["display_draw_point_x"];
        delete Entry.hw.sendQueue["display_draw_point_y"];
        delete Entry.hw.sendQueue["display_draw_point_pixel"];
    },

    transferDisplayDrawLine: function(target, x1, y1, x2, y2, pixel, line)
    {
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
        Entry.hw.setDigitalPortValue("target", target);
        Entry.hw.setDigitalPortValue("display_draw_line_x1", x1);
        Entry.hw.setDigitalPortValue("display_draw_line_y1", y1);
        Entry.hw.setDigitalPortValue("display_draw_line_x2", x2);
        Entry.hw.setDigitalPortValue("display_draw_line_y2", y2);
        Entry.hw.setDigitalPortValue("display_draw_line_pixel", pixel);
        Entry.hw.setDigitalPortValue("display_draw_line_line", line);

        Entry.hw.update();

        delete Entry.hw.sendQueue["target"];
        delete Entry.hw.sendQueue["display_draw_line_x1"];
        delete Entry.hw.sendQueue["display_draw_line_y1"];
        delete Entry.hw.sendQueue["display_draw_line_x2"];
        delete Entry.hw.sendQueue["display_draw_line_y2"];
        delete Entry.hw.sendQueue["display_draw_line_pixel"];
        delete Entry.hw.sendQueue["display_draw_line_line"];
    },

    transferDisplayDrawRect: function(target, x, y, width, height, pixel, flagFill, line)
    {
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
        Entry.hw.setDigitalPortValue("target", target);
        Entry.hw.setDigitalPortValue("display_draw_rect_x", x);
        Entry.hw.setDigitalPortValue("display_draw_rect_y", y);
        Entry.hw.setDigitalPortValue("display_draw_rect_width", width);
        Entry.hw.setDigitalPortValue("display_draw_rect_height", height);
        Entry.hw.setDigitalPortValue("display_draw_rect_pixel", pixel);
        Entry.hw.setDigitalPortValue("display_draw_rect_flagfill", flagFill);
        Entry.hw.setDigitalPortValue("display_draw_rect_line", line);

        Entry.hw.update();

        delete Entry.hw.sendQueue["target"];
        delete Entry.hw.sendQueue["display_draw_rect_x"];
        delete Entry.hw.sendQueue["display_draw_rect_y"];
        delete Entry.hw.sendQueue["display_draw_rect_width"];
        delete Entry.hw.sendQueue["display_draw_rect_height"];
        delete Entry.hw.sendQueue["display_draw_rect_pixel"];
        delete Entry.hw.sendQueue["display_draw_rect_flagfill"];
        delete Entry.hw.sendQueue["display_draw_rect_line"];
    },

    transferDisplayDrawCircle: function(target, x, y, radius, pixel, flagFill)
    {
        // 범위 조정
        x = Math.max(x, -50);
        x = Math.min(x, 178);
        y = Math.max(y, -50);
        y = Math.min(y, 114);
        radius = Math.max(radius, 1);
        radius = Math.min(radius, 200);
        
        // 전송
        Entry.hw.setDigitalPortValue("target", target);
        Entry.hw.setDigitalPortValue("display_draw_circle_x", x);
        Entry.hw.setDigitalPortValue("display_draw_circle_y", y);
        Entry.hw.setDigitalPortValue("display_draw_circle_radius", radius);
        Entry.hw.setDigitalPortValue("display_draw_circle_pixel", pixel);
        Entry.hw.setDigitalPortValue("display_draw_circle_flagfill", flagFill);

        Entry.hw.update();

        delete Entry.hw.sendQueue["target"];
        delete Entry.hw.sendQueue["display_draw_circle_x"];
        delete Entry.hw.sendQueue["display_draw_circle_y"];
        delete Entry.hw.sendQueue["display_draw_circle_radius"];
        delete Entry.hw.sendQueue["display_draw_circle_pixel"];
        delete Entry.hw.sendQueue["display_draw_circle_flagfill"];
    },

    transferDisplayDrawString: function(target, x, y, font, pixel, string)
    {
        // 범위 조정
        x = Math.max(x, 0);
        x = Math.min(x, 120);
        y = Math.max(y, 0);
        y = Math.min(y, 60);

        // 전송
        Entry.hw.setDigitalPortValue("target", target);
        Entry.hw.setDigitalPortValue("display_draw_string_x", x);
        Entry.hw.setDigitalPortValue("display_draw_string_y", y);
        Entry.hw.setDigitalPortValue("display_draw_string_font", font);
        Entry.hw.setDigitalPortValue("display_draw_string_pixel", pixel);
        Entry.hw.setDigitalPortValue("display_draw_string_string", string);

        Entry.hw.update();

        delete Entry.hw.sendQueue["target"];
        delete Entry.hw.sendQueue["display_draw_string_x"];
        delete Entry.hw.sendQueue["display_draw_string_y"];
        delete Entry.hw.sendQueue["display_draw_string_font"];
        delete Entry.hw.sendQueue["display_draw_string_pixel"];
        delete Entry.hw.sendQueue["display_draw_string_string"];
    },

    transferDisplayDrawStringAlign: function(target, xStart, xEnd, y, align, font, pixel, string)
    {
        // 범위 조정
        xStart = Math.max(xStart, 0);
        xStart = Math.min(xStart, 124);
        xEnd = Math.max(xEnd, 4);
        xEnd = Math.min(xEnd, 128);
        y = Math.max(y, 0);
        y = Math.min(y, 60);

        // 전송
        Entry.hw.setDigitalPortValue("target", target);
        Entry.hw.setDigitalPortValue("display_draw_string_align_x_start", xStart);
        Entry.hw.setDigitalPortValue("display_draw_string_align_x_end", xEnd);
        Entry.hw.setDigitalPortValue("display_draw_string_align_y", y);
        Entry.hw.setDigitalPortValue("display_draw_string_align_align", align);
        Entry.hw.setDigitalPortValue("display_draw_string_align_font", font);
        Entry.hw.setDigitalPortValue("display_draw_string_align_pixel", pixel);
        Entry.hw.setDigitalPortValue("display_draw_string_align_string", string);

        Entry.hw.update();

        delete Entry.hw.sendQueue["target"];
        delete Entry.hw.sendQueue["display_draw_string_align_x_start"];
        delete Entry.hw.sendQueue["display_draw_string_align_x_end"];
        delete Entry.hw.sendQueue["display_draw_string_align_y"];
        delete Entry.hw.sendQueue["display_draw_string_align_align"];
        delete Entry.hw.sendQueue["display_draw_string_align_font"];
        delete Entry.hw.sendQueue["display_draw_string_align_pixel"];
        delete Entry.hw.sendQueue["display_draw_string_align_string"];
    },

    transferbuzzer: function(mode, value, time)
    {
        // 전송
        Entry.hw.setDigitalPortValue("target", 0x31);
        Entry.hw.setDigitalPortValue("buzzer_mode", mode);
        Entry.hw.setDigitalPortValue("buzzer_value", value);
        Entry.hw.setDigitalPortValue("buzzer_time", time);

        Entry.hw.update();

        delete Entry.hw.sendQueue["target"];
        delete Entry.hw.sendQueue["buzzer_mode"];
        delete Entry.hw.sendQueue["buzzer_value"];
        delete Entry.hw.sendQueue["buzzer_time"];
    },
    
    transferVibrator: function(mode, timeOn, timeOff, timeRun)
    {
        // 범위 조정
        timeOn = Math.max(timeOn, 1);
        timeOn = Math.min(timeOn, 60000);
        timeOff = Math.max(timeOff, 1);
        timeOff = Math.min(timeOff, 60000);
        
        // 전송
        Entry.hw.setDigitalPortValue("target", 0x31);
        Entry.hw.setDigitalPortValue("vibrator_mode", mode);
        Entry.hw.setDigitalPortValue("vibrator_on", timeOn);
        Entry.hw.setDigitalPortValue("vibrator_off", timeOff);
        Entry.hw.setDigitalPortValue("vibrator_total", timeRun);

        Entry.hw.update();

        delete Entry.hw.sendQueue["target"];
        delete Entry.hw.sendQueue["vibrator_mode"];
        delete Entry.hw.sendQueue["vibrator_on"];
        delete Entry.hw.sendQueue["vibrator_off"];
        delete Entry.hw.sendQueue["vibrator_total"];
    },
    
    transferIrMessage: function(irdirection, irmessage)
    {
        // 범위 조정
        irmessage = Math.max(irmessage, -2147483647);
        irmessage = Math.min(irmessage, 2147483647);
        
        // 전송
        Entry.hw.setDigitalPortValue("target", 0x30);
        Entry.hw.setDigitalPortValue("irmessage_direction", irdirection);
        Entry.hw.setDigitalPortValue("irmessage_irdata", irmessage);

        Entry.hw.update();

        delete Entry.hw.sendQueue["target"];
        delete Entry.hw.sendQueue["irmessage_direction"];
        delete Entry.hw.sendQueue["irmessage_irdata"];
    },
    
    transferMotorSingle: function(motorIndex, motorRotation, motorSpeed)
    {
        // 범위 조정
        motorSpeed = Math.max(motorSpeed, 0);
        motorSpeed = Math.min(motorSpeed, 4096);
        
        // 전송
        Entry.hw.setDigitalPortValue("target", 0x30);
        Entry.hw.setDigitalPortValue("motorsingle_target", motorIndex);
        Entry.hw.setDigitalPortValue("motorsingle_rotation", motorRotation);
        Entry.hw.setDigitalPortValue("motorsingle_value", motorSpeed);

        Entry.hw.update();

        delete Entry.hw.sendQueue["target"];
        delete Entry.hw.sendQueue["motorsingle_target"];
        delete Entry.hw.sendQueue["motorsingle_rotation"];
        delete Entry.hw.sendQueue["motorsingle_value"];
    },
    
    transferCommand: function(target, command, option)
    {
        // 전송
        Entry.hw.setDigitalPortValue("target", target);
        Entry.hw.setDigitalPortValue("command_command", command);
        Entry.hw.setDigitalPortValue("command_option", option);

        Entry.hw.update();

        delete Entry.hw.sendQueue["target"];
        delete Entry.hw.sendQueue["command_command"];
        delete Entry.hw.sendQueue["command_option"];
    },
    
    transferControlDouble: function(wheel, accel)
    {
        // 범위 조정
        wheel       = Math.max(wheel, -100);
        wheel       = Math.min(wheel, 100);
        accel       = Math.max(accel, -100);
        accel       = Math.min(accel, 100);
        
        // 전송
        Entry.hw.setDigitalPortValue("target", 0x30);
        Entry.hw.setDigitalPortValue("control_wheel", wheel);
        Entry.hw.setDigitalPortValue("control_accel", accel);

        Entry.hw.update();

        delete Entry.hw.sendQueue["target"];
        delete Entry.hw.sendQueue["control_wheel"];
        delete Entry.hw.sendQueue["control_accel"];
    },
    
    transferControlQuad: function(roll, pitch, yaw, throttle)
    {
        // 범위 조정
        roll        = Math.max(roll,        -100);
        roll        = Math.min(roll,         100);
        pitch       = Math.max(pitch,       -100);
        pitch       = Math.min(pitch,        100);
        yaw         = Math.max(yaw,         -100);
        yaw         = Math.min(yaw,          100);
        throttle    = Math.max(throttle,    -100);
        throttle    = Math.min(throttle,     100);
        
        // 전송
        Entry.hw.setDigitalPortValue("target", 0x30);
        Entry.hw.setDigitalPortValue("control_roll",        roll);
        Entry.hw.setDigitalPortValue("control_pitch",       pitch);
        Entry.hw.setDigitalPortValue("control_yaw",         yaw);
        Entry.hw.setDigitalPortValue("control_throttle",    throttle);

        Entry.hw.update();

        delete Entry.hw.sendQueue["target"];
        delete Entry.hw.sendQueue["control_roll"];
        delete Entry.hw.sendQueue["control_pitch"];
        delete Entry.hw.sendQueue["control_yaw"];
        delete Entry.hw.sendQueue["control_throttle"];
    },
    
    // functions for block
    
    // 데이터 읽기
    getData: function(script, device)
    {
        return Entry.hw.portData[device];
    },
    
    // LED 수동 설정
    setLightManual: function(script, target, flags, brightness)
    {
        switch( this.checkFinish(script, 40) )
        {
        case "Start":
            {
                this.transferLightManual(target, flags, brightness);
            }
            return script;
            
        case "Running":
            return script;
        
        case "Finish":
            return script.callReturn();
            
        default:
            return script.callReturn();
        }
    },

    // LED 수동 설정 - RGB 값 직접 지정
    setLightColorRgb: function (script, target, mode, red, green, blue)
    {
        switch (this.checkFinish(script, 40))
        {
        case "Start":
            {
                this.transferLightColorRgb(target, mode, red, green, blue);
            }
            return script;

        case "Running":
            return script;

        case "Finish":
            return script.callReturn();

        default:
            return script.callReturn();
        }
    },

    // OLED - 화면 전체 지우기, 선택 영역 지우기
    setDisplayClear: function(script, target, pixel, clearAll, x, y, width, height)
    {
        switch( this.checkFinish(script, 40) )
        {
        case "Start":
            {
                this.transferDisplayClear(target, pixel, clearAll, x, y, width, height);
            }
            return script;

        case "Running":
            return script;

        case "Finish":
            return script.callReturn();

        default:
            return script.callReturn();
        }
    },

    // OLED - 선택 영역 반전
    setDisplayInvert: function(script, target, x, y, width, height)
    {
        switch( this.checkFinish(script, 40) )
        {
        case "Start":
            {
                this.transferDisplayInvert(target, x, y, width, height);
            }
            return script;

        case "Running":
            return script;

        case "Finish":
            return script.callReturn();

        default:
            return script.callReturn();
        }
    },

    // OLED - 화면에 점 찍기
    setDisplayDrawPoint: function(script, target, x, y, pixel)
    {
        switch( this.checkFinish(script, 40) )
        {
        case "Start":
            {
                this.transferDisplayDrawPoint(target, x, y, pixel);
            }
            return script;

        case "Running":
            return script;

        case "Finish":
            return script.callReturn();

        default:
            return script.callReturn();
        }
    },

    // OLED - 화면에 선 그리기
    setDisplayDrawLine: function(script, target, x1, y1, x2, y2, pixel, line)
    {
        switch( this.checkFinish(script, 40) )
        {
        case "Start":
            {
                this.transferDisplayDrawLine(target, x1, y1, x2, y2, pixel, line);
            }
            return script;

        case "Running":
            return script;

        case "Finish":
            return script.callReturn();

        default:
            return script.callReturn();
        }
    },

    // OLED - 화면에 사각형 그리기
    setDisplayDrawRect: function(script, target, x, y, width, height, pixel, flagFill, line)
    {
        switch( this.checkFinish(script, 40) )
        {
        case "Start":
            {
                this.transferDisplayDrawRect(target, x, y, width, height, pixel, flagFill, line);
            }
            return script;

        case "Running":
            return script;

        case "Finish":
            return script.callReturn();

        default:
            return script.callReturn();
        }
    },

    // OLED - 화면에 원 그리기
    setDisplayDrawCircle: function(script, target, x, y, radius, pixel, flagFill)
    {
        switch( this.checkFinish(script, 40) )
        {
        case "Start":
            {
                this.transferDisplayDrawCircle(target, x, y, radius, pixel, flagFill);
            }
            return script;

        case "Running":
            return script;

        case "Finish":
            return script.callReturn();

        default:
            return script.callReturn();
        }
    },

    // OLED - 화면에 문자열 쓰기
    setDisplayDrawString: function(script, target, x, y, font, pixel, string)
    {
        switch( this.checkFinish(script, 40) )
        {
        case "Start":
            {
                this.transferDisplayDrawString(target, x, y, font, pixel, string);
            }
            return script;

        case "Running":
            return script;

        case "Finish":
            return script.callReturn();

        default:
            return script.callReturn();
        }
    },

    // OLED - 화면에 문자열 정렬하여 그리기
    setDisplayDrawStringAlign: function(script, target, xStart, xEnd, y, align, font, pixel, string)
    {
        switch( this.checkFinish(script, 40) )
        {
        case "Start":
            {
                this.transferDisplayDrawStringAlign(target, xStart, xEnd, y, align, font, pixel, string);
            }
            return script;

        case "Running":
            return script;

        case "Finish":
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
        switch( this.checkFinish(script, 40) )
        {
        case "Start":
            {
                this.transferbuzzer(0, 0, 0);
            }
            return script;
            
        case "Running":
            return script;
        
        case "Finish":
            return script.callReturn();
            
        default:
            return script.callReturn();
        }
    },
    
     // 묵음
    setBuzzerMute: function(script, time, flagDelay, flagInstantly)
    {
        time = Math.max(time, 0);
        time = Math.min(time, 60000);
        
        var timeDelay = 40;
        if( flagDelay )
            timeDelay = time;
        
        switch( this.checkFinish(script, timeDelay) )
        {
        case "Start":
            {
                var mode = 2;   // 묵음 연속
                if( flagInstantly )
                    mode = 1;   // 묵음 즉시
                
                this.transferbuzzer(mode, 0xEE, time);
            }
            return script;
            
        case "Running":
            return script;
        
        case "Finish":
            return script.callReturn();
            
        default:
            return script.callReturn();
        }
    },
    
    setBuzzerScale: function(script, octave, scale, time, flagDelay, flagInstantly)
    {
        time = Math.max(time, 0);
        time = Math.min(time, 60000);
        
        var timeDelay = 40;
        if( flagDelay )
            timeDelay = time;
        
        switch( this.checkFinish(script, timeDelay) )
        {
        case "Start":
            {
                var mode = 4;   // Scale 연속
                if( flagInstantly )
                    mode = 3;   // Scale 즉시
                
                var scalecalc = (octave * 12) + scale;
                
                this.transferbuzzer(mode, scalecalc, time);
            }
            return script;
            
        case "Running":
            return script;
        
        case "Finish":
            return script.callReturn();
            
        default:
            return script.callReturn();
        }
    },

    setBuzzerHz: function(script, hz, time, flagDelay, flagInstantly)
    {
        time = Math.max(time, 0);
        time = Math.min(time, 60000);
        
        var timeDelay = 40;
        if( flagDelay )
            timeDelay = time;
        
        switch( this.checkFinish(script, timeDelay) )
        {
        case "Start":
            {
                var mode = 6;   // Hz 연속
                if( flagInstantly )
                    mode = 5;   // Hz 즉시
                
                // 범위 조정
                hz = Math.max(hz, 1);
                hz = Math.min(hz, 63999);
                
                this.transferbuzzer(mode, hz, time);
            }
            return script;
            
        case "Running":
            return script;
        
        case "Finish":
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
        switch( this.checkFinish(script, 40) )
        {
        case "Start":
            {
                this.transferVibrator(0, 0, 0, 0);
            }
            return script;
            
        case "Running":
            return script;
        
        case "Finish":
            return script.callReturn();
            
        default:
            return script.callReturn();
        }
    },

    setVibrator: function(script, timeOn, timeOff, timeRun, flagDelay, flagInstantly)
    {
        timeRun = Math.max(timeRun, 0);
        timeRun = Math.min(timeRun, 60000);
        
        var timeDelay = 40;
        if( flagDelay )
            timeDelay = timeRun;
        
        switch( this.checkFinish(script, timeDelay) )
        {
        case "Start":
            {
                var mode = 2;   // 예약
                if( flagInstantly )
                    mode = 1;   // 즉시
                
                this.transferVibrator(mode, timeOn, timeOff, timeRun);
            }
            return script;
            
        case "Running":
            return script;
        
        case "Finish":
            return script.callReturn();
            
        default:
            return script.callReturn();
        }
    },
    
    sendIrMessage: function(script, irdirection, irmessage)
    {
        switch( this.checkFinish(script, 40) )
        {
        case "Start":
            {
                this.transferIrMessage(irdirection, irmessage);
                // Light Event (transferLightEvent 만들어야 할 듯)
            }
            return script;
            
        case "Running":
            return script;
        
        case "Finish":
            return script.callReturn();
            
        default:
            return script.callReturn();
        }
    },
    
    sendStop: function(script)
    {
        return this.sendCommand(script, 0x30, 0x24, 0);
    },

    sendCommand: function(script, target, command, option)
    {
        switch( this.checkFinish(script, 40) )
        {
        case "Start":
            {
                this.transferCommand(target, command, option);
            }
            return script;
            
        case "Running":
            return script;
        
        case "Finish":
            return script.callReturn();
            
        default:
            return script.callReturn();
        }
    },

    setMotorSingle: function(script, motorIndex, motorRotation, motorSpeed)
    {
        switch( this.checkFinish(script, 40) )
        {
        case "Start":
            {
                this.transferMotorSingle(motorIndex, motorRotation, motorSpeed);
            }
            return script;
            
        case "Running":
            return script;
        
        case "Finish":
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
    setModeVehicle: function(script, modeVehicle)
    {
        switch( this.checkFinish(script, 40) )
        {
        case "Start":
            {
                this.transferCommand(0x30, 0x10, modeVehicle);
        
                this.transferControlDouble(0, 0);
                this.transferControlQuad(0, 0, 0, 0);
            }
            return script;
            
        case "Running":
            return script;
        
        case "Finish":
            return script.callReturn();
            
        default:
            return script.callReturn();
        }
    },
    
    sendControlDoubleSingle: function(script, controlTarget, value, time, flagDelay)
    {
        var timeDelay = 40;
        if( flagDelay )
            timeDelay = time;
        
        switch( this.checkFinish(script, timeDelay) )
        {
        case "Start":
            {
                switch(controlTarget)
                {
                case "control_wheel":
                    {
                        // 범위 조정
                        value = Math.max(value, -100);
                        value = Math.min(value, 100);
                    }
                    break;
                    
                case "control_accel":
                    {
                        // 범위 조정
                        value = Math.max(value, -100);
                        value = Math.min(value, 100);
                    }
                    break;
                }
                
                // 전송
                Entry.hw.setDigitalPortValue("target", 0x30);
                Entry.hw.setDigitalPortValue(controlTarget, value);

                Entry.hw.update();

                delete Entry.hw.sendQueue["target"];
                delete Entry.hw.sendQueue[controlTarget];
            }
            return script;
            
        case "Running":
            return script;
        
        case "Finish":
            if( flagDelay )
            {
                // 블럭을 빠져나갈 때 변경했던 값을 초기화
                
                // 전송
                Entry.hw.setDigitalPortValue("target", 0x30);
                Entry.hw.setDigitalPortValue(controlTarget, 0);

                Entry.hw.update();

                delete Entry.hw.sendQueue["target"];
                delete Entry.hw.sendQueue[controlTarget];
            }
            return script.callReturn();
            
        default:
            return script.callReturn();
        }
    },

    sendControlDouble: function(script, wheel, accel, time, flagDelay)
    {
        var timeDelay = 40;
        if( flagDelay )
            timeDelay = time;
        
        switch( this.checkFinish(script, timeDelay) )
        {
        case "Start":
            {
                this.transferControlDouble(wheel, accel);
            }
            return script;
            
        case "Running":
            return script;
        
        case "Finish":
            if( flagDelay )
            {
                this.transferControlDouble(0, 0);
            }
            return script.callReturn();
            
        default:
            return script.callReturn();
        }
    },
};
