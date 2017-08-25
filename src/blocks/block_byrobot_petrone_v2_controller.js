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

Entry.byrobot_petrone_v2_controller =
{
    name: 'byrobot_petrone_v2_controller',

    // 초기화
    setZero: function()
    {
        // 초기화
        
        // 한 번에 명령을 전송하면 hw까지 제대로 전달되지 않는 경우가 있어
        // 명령을 각각 분리하여 전송하게 함(2017.01.03)
        for (var i = 0; i < 1; i++)
        {
            this.transferVibrator(0, 0, 0, 0);
            this.transferbuzzer(0, 0, 0);
            this.transferLightManual(0x31, 0xFF, 0);        // 조종기, flags = 0xFF (전체선택)
            this.transferCommand(0x31, 0x80, 0);            // 조종기, command = 0x80 (DataStorageWrite)
        }
    },
    
    // Entry 좌측 하단 하드웨어 모니터 화면에 표시하는 속성 
    // listPorts와 ports 두 곳 동시에 동일한 속성을 표시할 수는 없음
    monitorTemplate:
    {
        imgPath: "hw/byrobot_petrone_v2_controller.png",      // 배경 이미지
        width: 500,     // 이미지의 폭
        height: 500,    // 이미지의 높이
        
        // 모니터 화면 상단에 차례대로 나열하는 값
        listPorts:
        {
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

    transferLightColorRgb: function(target, red, green, blue) 
    {
        // 범위 조정
        target = Math.max(target, 0);
        target = Math.min(target, 255);
        red = Math.max(red, 0);
        red = Math.min(red, 255);
        green = Math.max(green, 0);
        green = Math.min(green, 255);
        blue = Math.max(blue, 0);
        blue = Math.min(blue, 255);

        // 전송
        Entry.hw.setDigitalPortValue("target", target);
        Entry.hw.setDigitalPortValue("light_color_r", red);
        Entry.hw.setDigitalPortValue("light_color_g", green);
        Entry.hw.setDigitalPortValue("light_color_b", blue);

        Entry.hw.update();

        delete Entry.hw.sendQueue["target"];
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

    transferDisplayDrawLine: function(target, x1, y1, x2, y2, pixel)
    {
        // 범위 조정
        x1 = Math.max(x, 0);
        x1 = Math.min(x, 128);
        y1 = Math.max(y, 0);
        y1 = Math.min(y, 64);
        x2 = Math.max(x, 0);
        x2 = Math.min(x, 128);
        y2 = Math.max(y, 0);
        y2 = Math.min(y, 64);

        // 전송
        Entry.hw.setDigitalPortValue("target", target);
        Entry.hw.setDigitalPortValue("display_draw_line_x1", x1);
        Entry.hw.setDigitalPortValue("display_draw_line_y1", y1);
        Entry.hw.setDigitalPortValue("display_draw_line_x2", x2);
        Entry.hw.setDigitalPortValue("display_draw_line_y2", y2);
        Entry.hw.setDigitalPortValue("display_draw_line_pixel", pixel);

        Entry.hw.update();

        delete Entry.hw.sendQueue["target"];
        delete Entry.hw.sendQueue["display_draw_line_x1"];
        delete Entry.hw.sendQueue["display_draw_line_y1"];
        delete Entry.hw.sendQueue["display_draw_line_x2"];
        delete Entry.hw.sendQueue["display_draw_line_y2"];
        delete Entry.hw.sendQueue["display_draw_line_pixel"];
    },

    transferDisplayDrawRect: function(target, x, y, width, height, pixel, flagFill)
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

        Entry.hw.update();

        delete Entry.hw.sendQueue["target"];
        delete Entry.hw.sendQueue["display_draw_rect_x"];
        delete Entry.hw.sendQueue["display_draw_rect_y"];
        delete Entry.hw.sendQueue["display_draw_rect_width"];
        delete Entry.hw.sendQueue["display_draw_rect_height"];
        delete Entry.hw.sendQueue["display_draw_rect_pixel"];
        delete Entry.hw.sendQueue["display_draw_rect_flagfill"];
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

    // 작업중..

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
    setLightColorRgb: function(script, target, red, green, blue)
    {
        switch( this.checkFinish(script, 40) )
        {
        case "Start":
            {
                this.transferLightColorRgb(target, red, green, blue);
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
    setDisplayDrawLine: function(script, target, x1, y1, x2, y2, pixel)
    {
        switch( this.checkFinish(script, 40) )
        {
        case "Start":
            {
                this.transferDisplayDrawLine(target, x1, y1, x2, y2, pixel);
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
    setDisplayDrawRect: function(script, target, x, y, width, height, pixel, flagFill)
    {
        switch( this.checkFinish(script, 40) )
        {
        case "Start":
            {
                this.transferDisplayDrawRect(target, x, y, width, height, pixel, flagFill);
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

    // 작업중..
    
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

};
