/* eslint-disable prettier/prettier */
/* eslint-disable brace-style */
/* eslint-disable max-len */
/* jshint esversion: 6 */
'use strict';


/***************************************************************************************
 *  장치 사용 함수
 ***************************************************************************************/

 Entry.robolink_base = 
 {
     /***************************************************************************************
      *  시간 지연 함수
      ***************************************************************************************/
 
     // 시간 지연
     checkFinish(script, ms)
     {
         const _ms = this.fit(0, ms, 60000);
 
         if (!script.isStart)
         {
             script.isStart  = true;
             script.timeFlag = 1;
 
             const fps       = Entry.FPS || 60;
             const timeValue = (60 / fps) * _ms;
 
             setTimeout(() => {
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
 
     transferBufferClear()
     {
         Entry.hw.sendQueue.buffer_clear = 0;
         Entry.hw.update();
         delete Entry.hw.sendQueue.buffer_clear;
     },
 
 
     fit(min, value, max)
     {
         return Math.max(Math.min(value, max), min);
     },
 
 
     /***************************************************************************************
      *  데이터 전송 함수 (Entry -> Hardware)
      ***************************************************************************************/
 
     // -- IR -----------------------------------------------------------------------------
     transferIrMessage(target, irmessage)
     {
         // 전송
         Entry.hw.sendQueue.target            = target;
         Entry.hw.sendQueue.battle_ir_message = irmessage;
 
         Entry.hw.update();
 
         delete Entry.hw.sendQueue.target;
         delete Entry.hw.sendQueue.battle_ir_message;
     },
 
 
     // -- Light -----------------------------------------------------------------------------
     transferLightManual(target, flags, brightness)
     {
         Entry.hw.sendQueue.target                  = target;
         Entry.hw.sendQueue.light_manual_flags      = flags;
         Entry.hw.sendQueue.light_manual_brightness = brightness;
 
         Entry.hw.update();
 
         delete Entry.hw.sendQueue.target;
         delete Entry.hw.sendQueue.light_manual_flags;
         delete Entry.hw.sendQueue.light_manual_brightness;
     },
 
 
     transferLightMode(target, mode, interval)
     {
         Entry.hw.sendQueue.target              = target;
         Entry.hw.sendQueue.light_mode_mode     = mode;
         Entry.hw.sendQueue.light_mode_interval = interval;
 
         Entry.hw.update();
 
         delete Entry.hw.sendQueue.target;
         delete Entry.hw.sendQueue.light_mode_mode;
         delete Entry.hw.sendQueue.light_mode_interval;
     },
 
 
     transferLightModeColor(target, mode, interval, red, green, blue)
     {
         Entry.hw.sendQueue.target              = target;
         Entry.hw.sendQueue.light_mode_mode     = mode;
         Entry.hw.sendQueue.light_mode_interval = interval;
         Entry.hw.sendQueue.light_color_r       = red;
         Entry.hw.sendQueue.light_color_g       = green;
         Entry.hw.sendQueue.light_color_b       = blue;
 
         Entry.hw.update();
 
         delete Entry.hw.sendQueue.target;
         delete Entry.hw.sendQueue.light_mode_mode;
         delete Entry.hw.sendQueue.light_mode_interval;
         delete Entry.hw.sendQueue.light_color_r;
         delete Entry.hw.sendQueue.light_color_g;
         delete Entry.hw.sendQueue.light_color_b;
     },
 
 
     transferLightEvent(target, event, interval, repeat)
     {
         Entry.hw.sendQueue.target               = target;
         Entry.hw.sendQueue.light_event_event    = event;
         Entry.hw.sendQueue.light_event_interval = interval;
         Entry.hw.sendQueue.light_event_repeat   = repeat;
 
         Entry.hw.update();
 
         delete Entry.hw.sendQueue.target;
         delete Entry.hw.sendQueue.light_event_event;
         delete Entry.hw.sendQueue.light_event_interval;
         delete Entry.hw.sendQueue.light_event_repeat;
     },
 
 
     transferLightEventColor(target, event, interval, repeat, red, green, blue)
     {
         Entry.hw.sendQueue.target               = target;
         Entry.hw.sendQueue.light_event_event    = event;
         Entry.hw.sendQueue.light_event_interval = interval;
         Entry.hw.sendQueue.light_event_repeat   = repeat;
         Entry.hw.sendQueue.light_color_r        = red;
         Entry.hw.sendQueue.light_color_g        = green;
         Entry.hw.sendQueue.light_color_b        = blue;
 
         Entry.hw.update();
 
         delete Entry.hw.sendQueue.target;
         delete Entry.hw.sendQueue.light_event_event;
         delete Entry.hw.sendQueue.light_event_interval;
         delete Entry.hw.sendQueue.light_event_repeat;
         delete Entry.hw.sendQueue.light_color_r;
         delete Entry.hw.sendQueue.light_color_g;
         delete Entry.hw.sendQueue.light_color_b;
     },
 
 
     // -- Display -----------------------------------------------------------------------------
     transferDisplayClearAll(target, pixel)
     {
         Entry.hw.sendQueue.target                  = target;
         Entry.hw.sendQueue.display_clear_all_pixel = pixel;
 
         Entry.hw.update();
 
         delete Entry.hw.sendQueue.target;
         delete Entry.hw.sendQueue.display_clear_all_pixel;
     },
 
 
     transferDisplayClear(target, pixel, x, y, width, height)
     {
         Entry.hw.sendQueue.target               = target;
         Entry.hw.sendQueue.display_clear_x      = x;
         Entry.hw.sendQueue.display_clear_y      = y;
         Entry.hw.sendQueue.display_clear_width  = width;
         Entry.hw.sendQueue.display_clear_height = height;
         Entry.hw.sendQueue.display_clear_pixel  = pixel;
 
         Entry.hw.update();
 
         delete Entry.hw.sendQueue.target;
         delete Entry.hw.sendQueue.display_clear_x;
         delete Entry.hw.sendQueue.display_clear_y;
         delete Entry.hw.sendQueue.display_clear_width;
         delete Entry.hw.sendQueue.display_clear_height;
         delete Entry.hw.sendQueue.display_clear_pixel;
     },
 
 
     transferDisplayInvert(target, x, y, width, height)
     {
         Entry.hw.sendQueue.target                = target;
         Entry.hw.sendQueue.display_invert_x      = x;
         Entry.hw.sendQueue.display_invert_y      = y;
         Entry.hw.sendQueue.display_invert_width  = width;
         Entry.hw.sendQueue.display_invert_height = height;
 
         Entry.hw.update();
 
         delete Entry.hw.sendQueue.target;
         delete Entry.hw.sendQueue.display_invert_x;
         delete Entry.hw.sendQueue.display_invert_y;
         delete Entry.hw.sendQueue.display_invert_width;
         delete Entry.hw.sendQueue.display_invert_height;
     },
 
 
     transferDisplayDrawPoint(target, x, y, pixel)
     {
         Entry.hw.sendQueue.target                   = target;
         Entry.hw.sendQueue.display_draw_point_x     = x;
         Entry.hw.sendQueue.display_draw_point_y     = y;
         Entry.hw.sendQueue.display_draw_point_pixel = pixel;
 
         Entry.hw.update();
 
         delete Entry.hw.sendQueue.target;
         delete Entry.hw.sendQueue.display_draw_point_x;
         delete Entry.hw.sendQueue.display_draw_point_y;
         delete Entry.hw.sendQueue.display_draw_point_pixel;
     },
 
 
     transferDisplayDrawLine(target, x1, y1, x2, y2, pixel, line)
     {
         Entry.hw.sendQueue.target                  = target;
         Entry.hw.sendQueue.display_draw_line_x1    = x1;
         Entry.hw.sendQueue.display_draw_line_y1    = y1;
         Entry.hw.sendQueue.display_draw_line_x2    = x2;
         Entry.hw.sendQueue.display_draw_line_y2    = y2;
         Entry.hw.sendQueue.display_draw_line_pixel = pixel;
         Entry.hw.sendQueue.display_draw_line_line  = line;
 
         Entry.hw.update();
 
         delete Entry.hw.sendQueue.target;
         delete Entry.hw.sendQueue.display_draw_line_x1;
         delete Entry.hw.sendQueue.display_draw_line_y1;
         delete Entry.hw.sendQueue.display_draw_line_x2;
         delete Entry.hw.sendQueue.display_draw_line_y2;
         delete Entry.hw.sendQueue.display_draw_line_pixel;
         delete Entry.hw.sendQueue.display_draw_line_line;
     },
 
 
     transferDisplayDrawRect(target, x, y, width, height, pixel, flagFill, line)
     {
         Entry.hw.sendQueue.target                     = target;
         Entry.hw.sendQueue.display_draw_rect_x        = x;
         Entry.hw.sendQueue.display_draw_rect_y        = y;
         Entry.hw.sendQueue.display_draw_rect_width    = width;
         Entry.hw.sendQueue.display_draw_rect_height   = height;
         Entry.hw.sendQueue.display_draw_rect_pixel    = pixel;
         Entry.hw.sendQueue.display_draw_rect_flagfill = flagFill;
         Entry.hw.sendQueue.display_draw_rect_line     = line;
 
         Entry.hw.update();
 
         delete Entry.hw.sendQueue.target;
         delete Entry.hw.sendQueue.display_draw_rect_x;
         delete Entry.hw.sendQueue.display_draw_rect_y;
         delete Entry.hw.sendQueue.display_draw_rect_width;
         delete Entry.hw.sendQueue.display_draw_rect_height;
         delete Entry.hw.sendQueue.display_draw_rect_pixel;
         delete Entry.hw.sendQueue.display_draw_rect_flagfill;
         delete Entry.hw.sendQueue.display_draw_rect_line;
     },
 
 
     transferDisplayDrawCircle(target, x, y, radius, pixel, flagFill)
     {
         Entry.hw.sendQueue.target                       = target;
         Entry.hw.sendQueue.display_draw_circle_x        = x;
         Entry.hw.sendQueue.display_draw_circle_y        = y;
         Entry.hw.sendQueue.display_draw_circle_radius   = radius;
         Entry.hw.sendQueue.display_draw_circle_pixel    = pixel;
         Entry.hw.sendQueue.display_draw_circle_flagfill = flagFill;
 
         Entry.hw.update();
 
         delete Entry.hw.sendQueue.target;
         delete Entry.hw.sendQueue.display_draw_circle_x;
         delete Entry.hw.sendQueue.display_draw_circle_y;
         delete Entry.hw.sendQueue.display_draw_circle_radius;
         delete Entry.hw.sendQueue.display_draw_circle_pixel;
         delete Entry.hw.sendQueue.display_draw_circle_flagfill;
     },
 
 
     transferDisplayDrawString(target, x, y, font, pixel, string)
     {
         Entry.hw.sendQueue.target                     = target;
         Entry.hw.sendQueue.display_draw_string_x      = x;
         Entry.hw.sendQueue.display_draw_string_y      = y;
         Entry.hw.sendQueue.display_draw_string_font   = font;
         Entry.hw.sendQueue.display_draw_string_pixel  = pixel;
         Entry.hw.sendQueue.display_draw_string_string = string;
 
         Entry.hw.update();
 
         delete Entry.hw.sendQueue.target;
         delete Entry.hw.sendQueue.display_draw_string_x;
         delete Entry.hw.sendQueue.display_draw_string_y;
         delete Entry.hw.sendQueue.display_draw_string_font;
         delete Entry.hw.sendQueue.display_draw_string_pixel;
         delete Entry.hw.sendQueue.display_draw_string_string;
     },
 
 
     transferDisplayDrawStringAlign(target, xStart, xEnd, y, align, font, pixel, string)
     {
         Entry.hw.sendQueue.target                            = target;
         Entry.hw.sendQueue.display_draw_string_align_x_start = xStart;
         Entry.hw.sendQueue.display_draw_string_align_x_end   = xEnd;
         Entry.hw.sendQueue.display_draw_string_align_y       = y;
         Entry.hw.sendQueue.display_draw_string_align_align   = align;
         Entry.hw.sendQueue.display_draw_string_align_font    = font;
         Entry.hw.sendQueue.display_draw_string_align_pixel   = pixel;
         Entry.hw.sendQueue.display_draw_string_align_string  = string;
 
         Entry.hw.update();
 
         delete Entry.hw.sendQueue.target;
         delete Entry.hw.sendQueue.display_draw_string_align_x_start;
         delete Entry.hw.sendQueue.display_draw_string_align_x_end;
         delete Entry.hw.sendQueue.display_draw_string_align_y;
         delete Entry.hw.sendQueue.display_draw_string_align_align;
         delete Entry.hw.sendQueue.display_draw_string_align_font;
         delete Entry.hw.sendQueue.display_draw_string_align_pixel;
         delete Entry.hw.sendQueue.display_draw_string_align_string;
     },
 
 
     // -- Buzzer -----------------------------------------------------------------------------
     transferBuzzer(target, mode, value, time)
     {
         Entry.hw.sendQueue.target       = target;
         Entry.hw.sendQueue.buzzer_mode  = mode;
         Entry.hw.sendQueue.buzzer_value = value;
         Entry.hw.sendQueue.buzzer_time  = time;
 
         Entry.hw.update();
 
         delete Entry.hw.sendQueue.target;
         delete Entry.hw.sendQueue.buzzer_mode;
         delete Entry.hw.sendQueue.buzzer_value;
         delete Entry.hw.sendQueue.buzzer_time;
     },
 
 
     // -- Vibrator -----------------------------------------------------------------------------
     transferVibrator(target, mode, timeOn, timeOff, timeRun)
     {
         Entry.hw.sendQueue.target         = target;
         Entry.hw.sendQueue.vibrator_mode  = mode;
         Entry.hw.sendQueue.vibrator_on    = timeOn;
         Entry.hw.sendQueue.vibrator_off   = timeOff;
         Entry.hw.sendQueue.vibrator_total = timeRun;
 
         Entry.hw.update();
 
         delete Entry.hw.sendQueue.target;
         delete Entry.hw.sendQueue.vibrator_mode;
         delete Entry.hw.sendQueue.vibrator_on;
         delete Entry.hw.sendQueue.vibrator_off;
         delete Entry.hw.sendQueue.vibrator_total;
     },
 
 
     // -- MotorSingle -----------------------------------------------------------------------------
     transferMotorSingleRV(target, motorIndex, motorRotation, motorSpeed)
     {
         Entry.hw.sendQueue.target               = target;
         Entry.hw.sendQueue.motorsingle_target   = motorIndex;
         Entry.hw.sendQueue.motorsingle_rotation = motorRotation;
         Entry.hw.sendQueue.motorsingle_value    = motorSpeed;
 
         Entry.hw.update();
 
         delete Entry.hw.sendQueue.target;
         delete Entry.hw.sendQueue.motorsingle_target;
         delete Entry.hw.sendQueue.motorsingle_rotation;
         delete Entry.hw.sendQueue.motorsingle_value;
     },
 
 
     transferMotorSingleV(target, motorIndex, motorSpeed)
     {
         Entry.hw.sendQueue.target             = target;
         Entry.hw.sendQueue.motorsingle_target = motorIndex;
         Entry.hw.sendQueue.motorsingle_value  = motorSpeed;
 
         Entry.hw.update();
 
         delete Entry.hw.sendQueue.target;
         delete Entry.hw.sendQueue.motorsingle_target;
         delete Entry.hw.sendQueue.motorsingle_value;
     },
 
 
     // -- Command -----------------------------------------------------------------------------
     transferCommand(target, command, option)
     {
         Entry.hw.sendQueue.target          = target;
         Entry.hw.sendQueue.command_command = command;
         Entry.hw.sendQueue.command_option  = option;
 
         Entry.hw.update();
 
         delete Entry.hw.sendQueue.target;
         delete Entry.hw.sendQueue.command_command;
         delete Entry.hw.sendQueue.command_option;
     },
 
 
     // -- Trim -----------------------------------------------------------------------------
     transferTrim(target, roll, pitch, yaw, throttle)
     {
         Entry.hw.sendQueue.target        = target;
         Entry.hw.sendQueue.trim_roll     = roll;
         Entry.hw.sendQueue.trim_pitch    = pitch;
         Entry.hw.sendQueue.trim_yaw      = yaw;
         Entry.hw.sendQueue.trim_throttle = throttle;
 
         Entry.hw.update();
 
         delete Entry.hw.sendQueue.target;
         delete Entry.hw.sendQueue.trim_roll;
         delete Entry.hw.sendQueue.trim_pitch;
         delete Entry.hw.sendQueue.trim_yaw;
         delete Entry.hw.sendQueue.trim_throttle;
     },
 
 
     // -- Control -----------------------------------------------------------------------------
     transferControlQuad(target, roll, pitch, yaw, throttle)
     {
         Entry.hw.sendQueue.target                 = target;
         Entry.hw.sendQueue.control_quad8_roll     = roll;
         Entry.hw.sendQueue.control_quad8_pitch    = pitch;
         Entry.hw.sendQueue.control_quad8_yaw      = yaw;
         Entry.hw.sendQueue.control_quad8_throttle = throttle;
 
         Entry.hw.update();
 
         delete Entry.hw.sendQueue.target;
         delete Entry.hw.sendQueue.control_quad8_roll;
         delete Entry.hw.sendQueue.control_quad8_pitch;
         delete Entry.hw.sendQueue.control_quad8_yaw;
         delete Entry.hw.sendQueue.control_quad8_throttle;
     },
 
 
     transferControlPosition(target, x, y, z, velocity, heading, rotationalVelocity)
     {
         Entry.hw.sendQueue.target                               = target;
         Entry.hw.sendQueue.control_position_x                   = x;
         Entry.hw.sendQueue.control_position_y                   = y;
         Entry.hw.sendQueue.control_position_z                   = z;
         Entry.hw.sendQueue.control_position_velocity            = velocity;
         Entry.hw.sendQueue.control_position_heading             = heading;
         Entry.hw.sendQueue.control_position_rotational_velocity = rotationalVelocity;
 
         Entry.hw.update();
 
         delete Entry.hw.sendQueue.target;
         delete Entry.hw.sendQueue.control_position_x;
         delete Entry.hw.sendQueue.control_position_y;
         delete Entry.hw.sendQueue.control_position_z;
         delete Entry.hw.sendQueue.control_position_velocity;
         delete Entry.hw.sendQueue.control_position_heading;
         delete Entry.hw.sendQueue.control_position_rotational_velocity;
     },
 
 
     /***************************************************************************************
      *  기능
      ***************************************************************************************/
 
     // 데이터 읽기
     getData(script, device)
     {
         return Entry.hw.portData[device];
     },
 
 
     getRgbFromString(stringColor)
     {
         let red   = 0;
         let green = 0;
         let blue  = 0;
 
         switch (stringColor)
         {
             case 'red'           : { red = 255;  green = 0;    blue = 0;   }   break;
             case 'green'         : { red = 0;    green = 255;  blue = 0;   }   break;
             case 'blue'          : { red = 0;    green = 0;    blue = 255; }   break;
             case 'cyan'          : { red = 0;    green = 255;  blue = 255; }   break;
             case 'magenta'       : { red = 255;  green = 0;    blue = 255; }   break;
             case 'yellow'        : { red = 255;  green = 255;  blue = 0;   }   break;
             case 'white'         : { red = 255;  green = 255;  blue = 255; }   break;
             case 'sunset'        : { red = 255;  green = 100;  blue = 0;   }   break;
             case 'cottonCandy'   : { red = 20;   green = 250;  blue = 150; }   break;
             case 'muscat'        : { red = 70;   green = 255;  blue = 0;   }   break;
             case 'strawberryMilk': { red = 150;  green = 60;   blue = 20;  }   break;
             case 'emerald'       : { red = 0;    green = 255;  blue = 30;  }   break;
             case 'lavender'      : { red = 80;   green = 0;    blue = 200; }   break;
         }
 
         return { r:red, g:green, b:blue };
     },
 
 
 
     /***************************************************************************************
      *  블럭 연동 함수
      ***************************************************************************************/
 
     // -- IR -----------------------------------------------------------------------------
     // IR 데이터 송신
     setIrMessage(script, target, irmessage)
     {
         switch (this.checkFinish(script, 40))
         {
             case 'Start': 
                 {
                     this.transferIrMessage(target, irmessage);
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
 
 
     // -- Light -----------------------------------------------------------------------------
     // LED 수동 설정
     setLightManual(script, target, flags, brightness)
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
     setLightMode(script, target, mode, interval)
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
     setLightModeColor(script, target, mode, interval, red, green, blue)
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
 
 
     // LED 모드 설정, RGB
     setLightModeColorString(script, target, mode, interval, stringColor)
     {
         switch (this.checkFinish(script, 40))
         {
             case 'Start': 
                 {
                     const color = this.getRgbFromString(stringColor);
                     this.transferLightModeColor(target, mode, interval, color.r, color.g, color.b);
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
     setLightEvent(script, target, mode, interval, repeat)
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
     setLightEventColor(script, target, mode, interval, repeat, red, green, blue)
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
 
 
     // LED 이벤트 설정, RGB
     setLightEventColorString(script, target, mode, interval, repeat, stringColor)
     {
         switch (this.checkFinish(script, 40))
         {
             case 'Start': 
                 {
                     const color = this.getRgbFromString(stringColor);
                     this.transferLightEventColor(target, mode, interval, repeat, color.r, color.g, color.b);
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
 
 
     // -- Display -----------------------------------------------------------------------------
     // 화면 전체 지우기, 선택 영역 지우기
     setDisplayClearAll(script, target, pixel)
     {
         switch (this.checkFinish(script, 40))
         {
             case 'Start': 
                 {
                     this.transferDisplayClearAll(target, pixel);
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
     setDisplayClear(script, target, pixel, x, y, width, height)
     {
         switch (this.checkFinish(script, 40))
         {
             case 'Start': 
                 {
                     this.transferDisplayClear(target, pixel, x, y, width, height);
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
     setDisplayInvert(script, target, x, y, width, height)
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
     setDisplayDrawPoint(script, target, x, y, pixel)
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
     setDisplayDrawLine(script, target, x1, y1, x2, y2, pixel, line)
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
     setDisplayDrawRect(script, target, x, y, width, height, pixel, flagFill, line)
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
     setDisplayDrawCircle(script, target, x, y, radius, pixel, flagFill)
     {
         switch (this.checkFinish(script, 40)) {
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
     setDisplayDrawString(script, target, x, y, font, pixel, string)
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
     setDisplayDrawStringAlign(script, target, xStart, xEnd, y, align, font, pixel, string)
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
 
 
     // -- Buzzer -----------------------------------------------------------------------------
     // 버저 설정(함수 호출 시 시간은 모두 ms 단위 사용)
     /*
         MuteInstantally = 1,   // 묵음 즉시 적용
         MuteContinually = 2,   // 묵음 예약
 
         ScaleInstantally = 3,   // 음계 즉시 적용
         ScaleContinually = 4,   // 음계 예약
 
         HzInstantally = 5,   // 주파수 즉시 적용
         HzContinually = 6,   // 주파수 예약
      */
     // 정지
     setBuzzerStop(script, target)
     {
         switch (this.checkFinish(script, 40))
         {
             case 'Start': 
                 {
                     this.transferBuzzer(target, 0, 0, 0);
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
     setBuzzerMute(script, target, time, flagDelay, flagInstantly)
     {
         let timeDelay = 40;
         if (flagDelay)
         {
             timeDelay = Math.max(timeDelay, time);
         }
 
         switch (this.checkFinish(script, timeDelay))
         {
             case 'Start': 
                 {
                     let mode = 2;  // 묵음 연속
                     if (flagInstantly)
                     {
                         mode = 1;
                     } // 묵음 즉시
 
                     this.transferBuzzer(target, mode, 0xee, time);
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
 
 
     setBuzzerScale(script, target, octave, scale, time, flagDelay, flagInstantly)
     {
         let timeDelay = 40;
         if (flagDelay)
         {
             timeDelay = Math.max(timeDelay, time);
         }
 
         switch (this.checkFinish(script, timeDelay))
         {
             case 'Start': 
                 {
                     let mode = 4;  // Scale 연속
                     if (flagInstantly)
                     {
                         mode = 3;
                     } // Scale 즉시
 
                     const scale_index = octave * 12 + scale;
 
                     this.transferBuzzer(target, mode, scale_index, time);
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
 
 
     setBuzzerHz(script, target, hz, time, flagDelay, flagInstantly)
     {
         let timeDelay = 40;
         if (flagDelay)
         {
             timeDelay = Math.max(timeDelay, time);
         }
 
         switch (this.checkFinish(script, timeDelay))
         {
             case 'Start': 
                 {
                     let mode = 6;  // Hz 연속
                     if (flagInstantly)
                     {
                         mode = 5;
                     } // Hz 즉시
                     this.transferBuzzer(target, mode, hz, time);
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
 
 
     // -- Vibrator -----------------------------------------------------------------------------
     // 진동 제어
     /*
         Stop        = 0,   // 정지
         Instantally = 1,   // 즉시 적용
         Continually = 2,   // 예약
      */
     setVibratorStop(script, target)
     {
         switch (this.checkFinish(script, 40))
         {
             case 'Start': 
                 {
                     this.transferVibrator(target, 0, 0, 0, 0);
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
 
 
     setVibrator(script, target, timeOn, timeOff, timeRun, flagDelay, flagInstantly)
     {
         let timeDelay = 40;
         if (flagDelay)
         {
             timeDelay = Math.max(timeDelay, timeRun);
         }
 
         switch (this.checkFinish(script, timeDelay))
         {
             case 'Start': 
                 {
                     let mode = 2;  // 예약
                     if (flagInstantly)
                     {
                         mode = 1;  // 즉시
                     }
 
                     this.transferVibrator(target, mode, timeOn, timeOff, timeRun);
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
 
 
     // -- Command -----------------------------------------------------------------------------
     sendStop(script, target)
     {
         return this.sendCommand(script, target, 0x01);
     },
 
 
     sendCommand(script, target, command, option = 0, timeDelay = 40)
     {
         switch (this.checkFinish(script, timeDelay))
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
 
 
     // -- MotorSingle -----------------------------------------------------------------------------
     setMotorSingleRV(script, target, motorIndex, motorRotation, motorSpeed)
     {
         switch (this.checkFinish(script, 40))
         {
             case 'Start': 
                 {
                     this.transferMotorSingleRV(target, motorIndex, motorRotation, motorSpeed);
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
 
 
     setMotorSingleV(script, target, motorIndex, motorSpeed)
     {
         switch (this.checkFinish(script, 40))
         {
             case 'Start': 
                 {
                     this.transferMotorSingleV(target, motorIndex, motorSpeed);
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
 
 
     // -- EventFlight -----------------------------------------------------------------------------
     setEventFlight(script, target, eventFlight, time)
     {
         switch (this.checkFinish(script, time))
         {
             case 'Start': 
                 {
                     this.transferControlQuad(0, 0, 0, 0); // 기존 입력되었던 조종기 방향 초기화 (수직으로 이륙, 착륙 하도록)
                     this.transferCommand(target, 0x07, eventFlight); // 0x07 : CommandType::FlightEvent
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
 
 
     // -- Trim -----------------------------------------------------------------------------
     sendTrim(script, target, roll, pitch, yaw, throttle)
     {
         let timeDelay = 40;
 
         switch (this.checkFinish(script, timeDelay))
         {
             case 'Start': 
                 {
                     this.transferTrim(target, roll, pitch, yaw, throttle);
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
 
 
     // -- Control -----------------------------------------------------------------------------
     sendControlQuadSingle(script, target, controlTarget, value, time = 40, flagDelay = false)
     {
         let timeDelay = 40;
         if (flagDelay)
         {
             timeDelay = Math.max(timeDelay, time);
         }
 
         switch (this.checkFinish(script, timeDelay))
         {
             case 'Start': 
                 {
                     Entry.hw.sendQueue.target           = target;
                     Entry.hw.sendQueue[controlTarget]   = value;
 
                     Entry.hw.update();
 
                     delete Entry.hw.sendQueue.target;
                     delete Entry.hw.sendQueue[controlTarget];
                 }
                 return script;
 
             case 'Running': 
                 return script;
 
             case 'Finish': 
                 if (flagDelay)
                 {
                     // 블럭을 빠져나갈 때 변경했던 값을 초기화
                     Entry.hw.sendQueue.target           = target;
                     Entry.hw.sendQueue[controlTarget]   = 0;
 
                     Entry.hw.update();
 
                     delete Entry.hw.sendQueue.target;
                     delete Entry.hw.sendQueue[controlTarget];
                 }
                 return script.callReturn();
 
             default: 
                 return script.callReturn();
         }
     },
 
 
     sendControlQuad(script, target, roll, pitch, yaw, throttle, time = 40, flagDelay = false)
     {
         let timeDelay = 40;
         if (flagDelay)
         {
             timeDelay = Math.max(timeDelay, time);
         }
 
         switch (this.checkFinish(script, timeDelay))
         {
             case 'Start': 
                 {
                     this.transferControlQuad(target, roll, pitch, yaw, throttle);
                 }
                 return script;
 
             case 'Running': 
                 return script;
 
             case 'Finish': 
                 if (flagDelay)
                 {
                     this.transferControlQuad(target, 0, 0, 0, 0);
                 }
                 return script.callReturn();
 
             default: 
                 return script.callReturn();
         }
     },
 
 
     sendControlPosition(script, target, x, y, z, velocity, heading, rotationalVelocity, time = 40, flagDelay = false)
     {
         let timeDelay = 40;
         if (flagDelay)
         {
             timeDelay = Math.max(timeDelay, time);
         }
 
         switch (this.checkFinish(script, timeDelay))
         {
             case 'Start': 
                 {
                     this.transferControlQuad(target, 0, 0, 0, 0);
                     this.transferControlPosition(target, x, y, z, velocity, heading, rotationalVelocity);
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
  
 module.exports = Entry.robolink_base;
 

/***************************************************************************************
 *  장치 기본 정의
 ***************************************************************************************/

Entry.robolink_codrone_edu = 
{
    id       : '4A.4',
    name     : 'robolink_codrone_edu',
    url      : 'http://www.robolink.co.kr',
    imageName: 'robolink_codrone_edu.png',
    title    : {
        en: 'Robolink CoDrone EDU',
        ko: '로보링크 코드론 EDU',
    },

    // 엔트리 정지시 하드웨어 초기화 로직
    setZero()
    {
        // 초기화
        Entry.robolink_base.transferBufferClear();

        // 한 번에 명령을 전송하면 hw까지 제대로 전달되지 않는 경우가 있어
        // 명령을 각각 분리하여 전송하게 함(2017.01.03)
        for (let i = 0; i < 1; i++)
        {
            if( Entry.hw.portData['state_modeFlight'] == 0x10 )
            {
                Entry.robolink_base.transferCommand(0x10, 0x01, 0); // 드론, command = 0x01 (Stop)
            }
            else
            {
                Entry.robolink_base.transferCommand(0x10, 0x07, 0x12); // 0x12 : FlightEvent::Landing
            }

            Entry.robolink_base.transferBuzzer(0x10, 0, 0, 0);
            Entry.robolink_base.transferBuzzer(0x20, 0, 0, 0);
            Entry.robolink_base.transferVibrator(0x20, 0, 0, 0, 0);
            Entry.robolink_base.transferLightManual(0x10, 0xffff, 0); // LED 초기화(모두 꺼짐)
            Entry.robolink_base.transferLightManual(0x20, 0xffff, 0); // LED 초기화(모두 꺼짐)
            Entry.robolink_base.transferLightModeColor(0x10, 0x22, 200, 255, 0, 0); // LED 초기화(드론)
            Entry.robolink_base.transferLightModeColor(0x20, 0x22, 200, 255, 0, 0); // LED 초기화(조종기)
        }
    },
};


/***************************************************************************************
 *  언어 적용
 ***************************************************************************************/
Entry.robolink_codrone_edu.setLanguage = function() {
    return {
        ko: {
            // ko.js에 작성하던 내용
            Blocks: {
                // 정보창
                monitor_state_modeFlight                        : '비행 모드',
                monitor_state_modeControlFlight                 : '비행 제어기 모드',
                monitor_state_modeMovement                      : '이동 상태',
                monitor_state_headless                          : '헤드리스',
                monitor_state_controlSpeed                      : '제어 속도',
                monitor_state_sensorOrientation                 : '센서 방향',
                monitor_state_battery                           : '배터리',
                monitor_motion_accelX                           : '가속도 X',
                monitor_motion_accelY                           : '가속도 Y',
                monitor_motion_accelZ                           : '가속도 Z',
                monitor_motion_gyroRoll                         : '자이로 Roll',
                monitor_motion_gyroPitch                        : '자이로 Pitch',
                monitor_motion_gyroYaw                          : '자이로 Yaw',
                monitor_motion_angleRoll                        : '자세 Roll',
                monitor_motion_anglePitch                       : '자세 Pitch',
                monitor_motion_angleYaw                         : '자세 Yaw',
                monitor_range_front                             : '정면 거리 센서',
                monitor_range_bottom                            : '바닥 거리 센서',
                monitor_cardColor_frontHue                      : '카드 위 색상',
                monitor_cardColor_frontSaturation               : '카드 위 채도',
                monitor_cardColor_frontValue                    : '카드 위 명도',
                monitor_cardColor_frontLightness                : '카드 위 밝기',
                monitor_cardColor_rearHue                       : '카드 아래 색상',
                monitor_cardColor_rearSaturation                : '카드 아래 채도',
                monitor_cardColor_rearValue                     : '카드 아래 명도',
                monitor_cardColor_rearLightness                 : '카드 아래 밝기',
                monitor_cardColor_frontColor                    : '카드 위 색',
                monitor_cardColor_rearColor                     : '카드 아래 색',
                monitor_cardColor_card                          : '카드',
                monitor_informationAssembledForEntry_positionX  : '위치 X',
                monitor_informationAssembledForEntry_positionY  : '위치 Y',
                monitor_informationAssembledForEntry_positionZ  : '위치 Z',
                monitor_informationAssembledForEntry_altitude   : '고도',
                monitor_informationAssembledForEntry_rangeHeight: '거리 센서의 높이',
                monitor_joystick_left_x                         : '왼쪽 조이스틱 X',
                monitor_joystick_left_y                         : '왼쪽 조이스틱 Y',
                monitor_joystick_left_direction                 : '왼쪽 조이스틱 방향',
                monitor_joystick_left_event                     : '왼쪽 조이스틱 이벤트',
                monitor_joystick_right_x                        : '오른쪽 조이스틱 X',
                monitor_joystick_right_y                        : '오른쪽 조이스틱 Y',
                monitor_joystick_right_direction                : '오른쪽 조이스틱 방향',
                monitor_joystick_right_event                    : '오른쪽 조이스틱 이벤트',
                monitor_button_button                           : '버튼',
                monitor_button_event                            : '버튼 이벤트',
                monitor_entryhw_countTransferReserved           : '전송 예정 데이터',

                // 일반 블럭
                common_light_color_red                  : '빨강',
                common_light_color_yellow               : '노랑',
                common_light_color_green                : '초록',
                common_light_color_cyan                 : '하늘색',
                common_light_color_blue                 : '파랑',
                common_light_color_magenta              : '자홍',
                common_light_color_white                : '흰색',
                common_light_color_black                : '검정',
                common_light_color_cottoncandy          : '구름솜사탕',
                common_light_color_emerald              : '에메랄드',
                common_light_color_lavender             : '라벤더',
                common_light_color_muscat               : '청포도',
                common_light_color_strawberrymilk       : '딸기우유',
                common_light_color_sunset               : '저녁노을',
                common_light_mode_hold                  : '켜짐',
                common_light_mode_flicker               : '깜빡임',
                common_light_mode_flicker_double        : '2번 연속 깜빡임',
                common_light_mode_dimming               : '천천히 깜빡임',
                common_light_mode_sunrise               : '점점 밝아짐',
                common_light_mode_sunset                : '점점 어두워짐',
                common_light_mode_rainbow               : '무지개',
                common_light_mode_rainbow2              : '무지개2',
                common_light_brightness_all             : '전체',
                common_light_brightness_b100            : '밝기 100%',
                common_light_brightness_b25             : '밝기 25%',
                common_light_brightness_b50             : '밝기 50%',
                common_light_brightness_b75             : '밝기 75%',
                common_light_brightness_off             : '끄기',
                common_light_brightness_on              : '켜기',
                common_left                             : '왼쪽',
                common_right                            : '오른쪽',
                common_roll                             : 'Roll',
                common_pitch                            : 'Pitch',
                common_yaw                              : 'Yaw',
                common_throttle                         : 'Throttle',
                common_drone                            : '드론',
                common_controller                       : '조종기',                
                controller_button                       : '버튼',
                controller_button_event                 : '버튼 이벤트',
                controller_button_front_left_top        : '전면 왼쪽 상단 버튼',
                controller_button_front_left_bottom     : '전면 왼쪽 하단 버튼',
                controller_button_front_right_top       : '전면 오른쪽 상단 버튼',
                controller_button_front_right_bottom    : '전면 오른쪽 하단 버튼',
                controller_button_top_left              : '상단 왼쪽 버튼',
                controller_button_top_right             : '상단 오른쪽 버튼',
                controller_button_center_up             : '중앙 위 버튼',
                controller_button_center_left           : '중앙 왼쪽 버튼',
                controller_button_center_right          : '중앙 오른쪽 버튼',
                controller_button_center_down           : '중앙 아래쪽 버튼',
                controller_button_bottom_left           : '하단 왼쪽 버튼',
                controller_button_bottom_right          : '하단 오른쪽 버튼',
                controller_buzzer                       : '버저',
                controller_buzzer_a                     : '라',
                controller_buzzer_as                    : '라#',
                controller_buzzer_b                     : '시',
                controller_buzzer_c                     : '도',
                controller_buzzer_cs                    : '도#',
                controller_buzzer_d                     : '레',
                controller_buzzer_ds                    : '레#',
                controller_buzzer_e                     : '미',
                controller_buzzer_f                     : '파',
                controller_buzzer_fs                    : '파#',
                controller_buzzer_g                     : '솔',
                controller_buzzer_gs                    : '솔#',
                controller_buzzer_mute                  : '쉼',
                controller_display_align_center         : '가운데',
                controller_display_align_left           : '왼쪽',
                controller_display_align_right          : '오른쪽',
                controller_display_flagfill_off         : '채우지 않음',
                controller_display_flagfill_on          : '채움',
                controller_display_font_10x16           : '큼',
                controller_display_font_5x8             : '작음',
                controller_display_line_dashed          : '파선',
                controller_display_line_dotted          : '점선',
                controller_display_line_solid           : '실선',
                controller_display_pixel_black          : '검은색',
                controller_display_pixel_white          : '흰색',
                controller_display_pixel_inverse        : '반전',
                controller_joystick_direction_left_up   : '왼쪽 위',
                controller_joystick_direction_up        : '위',
                controller_joystick_direction_right_up  : '오른쪽 위',
                controller_joystick_direction_left      : '왼쪽',
                controller_joystick_direction_center    : '중앙',
                controller_joystick_direction_right     : '오른쪽',
                controller_joystick_direction_left_down : '왼쪽 아래',
                controller_joystick_direction_down      : '아래',
                controller_joystick_direction_right_down: '오른쪽 아래',
                controller_joystick_left_direction      : '왼쪽 조이스틱 방향',
                controller_joystick_left_event          : '왼쪽 조이스틱 이벤트',
                controller_joystick_left_x              : '왼쪽 조이스틱 가로축',
                controller_joystick_left_y              : '왼쪽 조이스틱 세로축',
                controller_joystick_right_direction     : '오른쪽 조이스틱 방향',
                controller_joystick_right_event         : '오른쪽 조이스틱 이벤트',
                controller_joystick_right_x             : '오른쪽 조이스틱 가로축',
                controller_joystick_right_y             : '오른쪽 조이스틱 세로축',
                drone_accel_x                           : '가속도 x',
                drone_accel_y                           : '가속도 y',
                drone_accel_z                           : '가속도 z',
                drone_gyro_pitch                        : '각속도 Pitch',
                drone_gyro_roll                         : '각속도 Roll',
                drone_gyro_yaw                          : '각속도 Yaw',
                drone_attitude_pitch                    : '자세 Pitch',
                drone_attitude_roll                     : '자세 Roll',
                drone_attitude_yaw                      : '자세 Yaw',
                drone_positionX                         : '위치 X',
                drone_positionY                         : '위치 Y',
                drone_positionZ                         : '위치 Z',
                drone_control_quad_roll                 : 'Roll',
                drone_control_quad_pitch                : 'Pitch',
                drone_control_quad_yaw                  : 'Yaw',
                drone_control_quad_throttle             : 'Throttle',
                drone_control_quad_pitch_backward       : '뒤',
                drone_control_quad_pitch_forward        : '앞',
                drone_control_quad_roll_left            : '왼쪽',
                drone_control_quad_roll_right           : '오른쪽',
                drone_control_quad_throttle_down        : '아래',
                drone_control_quad_throttle_up          : '위',
                drone_control_quad_yaw_ccw              : '반시계 방향',
                drone_control_quad_yaw_cw               : '시계 방향',
                drone_headless_normal                   : 'off (숙련자용)',
                drone_headless_headless                 : 'on (초보자용)',
                drone_light_color_body                  : '몸체',
                drone_light_manual_body_blue            : '파랑',
                drone_light_manual_body_green           : '초록',
                drone_light_manual_body_red             : '빨강',
                drone_motor_rotation_clockwise          : '시계 방향',
                drone_motor_rotation_counterclockwise   : '반시계 방향',
                drone_altitude                          : '해발고도',
                drone_range_height                      : '바닥과의 거리',
                drone_range_front                       : '정면과의 거리',
                drone_cardcolor_front_hue               : '앞 색상 H',
                drone_cardcolor_front_saturation        : '앞 채도 S',
                drone_cardcolor_front_value             : '앞 명도 V',
                drone_cardcolor_front_lightness         : '앞 밝기 L',
                drone_cardcolor_rear_hue                : '뒤 색상 H',
                drone_cardcolor_rear_saturation         : '뒤 채도 S',
                drone_cardcolor_rear_value              : '뒤 명도 V',
                drone_cardcolor_rear_lightness          : '뒤 밝기 L',
                drone_cardcolor_front_color             : '앞 카드 색',
                drone_cardcolor_rear_color              : '뒤 카드 색',
                drone_cardcolor_card                    : '카드',
                drone_state_mode_system                 : '시스템 모드',
                drone_state_mode_flight                 : '비행 동작 상태',
                drone_state_mode_control_flight         : '비행 제어 모드',
                drone_state_mode_movement               : '이동 상태',
                drone_state_headless                    : 'Headless',
                drone_state_control_speed               : '제어 속도',
                drone_state_sensor_orientation          : '센서 방향',
                drone_state_battery                     : '배터리',
                entryhw_count_transfer_reserved         : '전송 예약된 데이터 수',
                drone_state_mode_flight_ready           : '대기 상태',
                drone_state_mode_flight_start           : '시동 상태',
                drone_state_mode_flight_takeoff         : '이륙 상태',
                drone_state_mode_flight_flight          : '비행 상태',
                drone_state_mode_flight_landing         : '착륙 상태',
                drone_state_mode_flight_stop            : '정지 상태',
                controller_display_shape_line           : '직선',
                controller_display_shape_square         : '사각형',
                controller_display_shape_ellipse        : '타원',
                drone_control_flip_front                : '앞으로 뒤집기',
                drone_control_flip_rear                 : '뒤로 뒤집기',
                drone_control_flip_left                 : '왼쪽으로 뒤집기',
                drone_control_flip_right                : '오른쪽으로 뒤집기',
                common_wait                             : '기다리기',
                common_next                             : '넘어가기',
                common_instant                          : '즉시',
                common_reserve                          : '예약',


            },

            template: {
                robolink_codrone_edu_controller_buzzer_hz                : '%1 %2Hz 소리를 %3초 %4연주 %5',
                robolink_codrone_edu_controller_buzzer_hz_delay          : '%1 %2Hz 소리를 %3초 연주 %4',
                robolink_codrone_edu_controller_buzzer_hz_reserve        : '%1 %2Hz 소리를 %3초 예약 %4',
                robolink_codrone_edu_controller_buzzer_off               : '%1 버저 끄기 %2',
                robolink_codrone_edu_controller_buzzer_scale             : '%1 %2 옥타브 %3을(를) %4초 %5연주 %6',
                robolink_codrone_edu_controller_buzzer_scale_delay       : '%1 %2 옥타브 %3을(를) %4초 연주 %5',
                robolink_codrone_edu_controller_buzzer_scale_reserve     : '%1 %2 옥타브 %3을(를) %4초 예약 %5',
                robolink_codrone_edu_controller_display_clear            : '지우기 x %1, y %2, 너비 %3, 높이 %4 %5 %6',
                robolink_codrone_edu_controller_display_clear_all        : '화면 전체 지우기%1 %2',
                robolink_codrone_edu_controller_display_draw_shape       : '%1 x1 %2, y1 %3, x2(너비,반지름) %4, y2(높이) %5 %6 %7 %8 %9',
                robolink_codrone_edu_controller_display_draw_circle      : '타원 x %1, y %2, 반지름 %3 %4 %5 %6',                
                robolink_codrone_edu_controller_display_draw_line        : '선 x1 %1, y1 %2, x2 %3, y2 %4 %5 %6 %7',
                robolink_codrone_edu_controller_display_draw_point       : '점 그리기 x %1, y %2 %3 %4',
                robolink_codrone_edu_controller_display_draw_rect        : '사각형 x %1, y %2, 너비 %3, 높이 %4 %5 %6 %7 %8',
                robolink_codrone_edu_controller_display_draw_string      : '문자열 x %1, y %2 %3 %4 입력 %5 %6',
                robolink_codrone_edu_controller_display_draw_string_align: '문자열 정렬 x1 %1, x2 %2, y %3 %4 %5 %6 입력 %7 %8',
                robolink_codrone_edu_drone_if_state                      : '드론 비행 상태가 %1 일 때',
                robolink_codrone_edu_controller_if_button_press          : '조종기 %1 눌렀을 때',
                robolink_codrone_edu_controller_if_joystick_direction    : '조종기 %1 조이스틱 %2 (으)로 움직였을 때',
                robolink_codrone_edu_light_manual_single_off             : '%1 LED 끄기 %2',
                robolink_codrone_edu_light_color_input                   : '%1 LED R %2, G %3, B %4 %5 %6 %7',
                robolink_codrone_edu_light_color_select                  : '%1 LED %2 %3 %4 %5',
                robolink_codrone_edu_light_color_preset                  : '%1 LED %2 %3 %4',
                robolink_codrone_edu_light_manual_single_input           : '%1 LED %2 밝기 %3 %4',
                robolink_codrone_edu_controller_light_color_input        : '조종기 LED R %1, G %2, B %3 %4 %5 %6',
                robolink_codrone_edu_controller_light_color_select       : '조종기 LED %1 %2 %3 %4',
                robolink_codrone_edu_controller_light_color_preset       : '조종기 LED %1 %2 %3',
                robolink_codrone_edu_controller_light_manual_single_input: '조종기 LED %1 밝기 %2 %3',
                robolink_codrone_edu_controller_light_manual_single_off  : '조종기 LED 끄기 %1',
                robolink_codrone_edu_controller_value_button             : '%1',
                robolink_codrone_edu_controller_value_joystick           : '%1',
                robolink_codrone_edu_controller_vibrator_delay           : '조종기 진동 %1초 켜기, %2초 끄기를 %3초 실행 %4',
                robolink_codrone_edu_controller_vibrator_off             : '조종기 진동 끄기 %1',
                robolink_codrone_edu_controller_vibrator_on_delay        : '조종기 진동 %1초 켜기 %2',
                robolink_codrone_edu_controller_vibrator_on_reserve      : '조종기 진동 %1초 실행 %2',
                robolink_codrone_edu_controller_vibrator_reserve         : '조종기 진동 %1초 켜기, %2초 끄기를 %3초 예약 %4',
                robolink_codrone_edu_drone_control_headless              : '헤드리스 모드 %1 %2',
                robolink_codrone_edu_drone_control_drone_landing         : '드론 착륙 %1',
                robolink_codrone_edu_drone_control_drone_reset_heading   : '드론 방향 초기화 %1',
                robolink_codrone_edu_drone_control_drone_stop            : '드론 정지 %1',
                robolink_codrone_edu_drone_control_drone_takeoff         : '드론 이륙 %1',
                robolink_codrone_edu_drone_control_drone_return_home     : '리턴 홈 %1',
                robolink_codrone_edu_drone_control_flip                  : '플립 %1 %2',
                robolink_codrone_edu_drone_control_quad_one              : '드론 %1 %2% 정하기 %3',
                robolink_codrone_edu_drone_control_quad_one_delay        : '드론 %1 %2% %3 초 실행 %4',
                robolink_codrone_edu_drone_control_quad                  : '드론 Roll %1%, Pitch %2%, Yaw %3%, Throttle %4% 정하기 %5',
                robolink_codrone_edu_drone_control_quad_delay            : '드론 Roll %1%, Pitch %2%, Yaw %3%, Throttle %4% %5초 실행 %6',
                robolink_codrone_edu_drone_control_position_one          : '드론 %1(으)로 %2m를 %3m/s로 이동 %4 %5',
                robolink_codrone_edu_drone_control_position_turn         : '드론 %1(으)로 %2도를 %3deg/s로 회전 %4 %5',
                robolink_codrone_edu_drone_control_position_location     : '드론 %1 %2m, %3 %4m, %5 %6m를 %7m/s로 이동 %8 %9',
                robolink_codrone_edu_drone_control_position_location_turn: '드론 %1 %2m, %3 %4m, %5 %6m를 %7m/s로 이동, %8 %9도를 %10deg/s로 회전 %11',
                robolink_codrone_edu_drone_light_color_input             : '드론 LED R %1, G %2, B %3 %4 %5 %6',
                robolink_codrone_edu_drone_light_color_select            : '드론 LED %1 %2 %3 %4',
                robolink_codrone_edu_drone_light_color_preset            : '드론 LED %1 %2 %3',
                robolink_codrone_edu_drone_light_manual_single_input     : '드론 LED %1 밝기 %2 %3',
                robolink_codrone_edu_drone_light_manual_single_off       : '드론 LED 끄기 %1',
                robolink_codrone_edu_drone_motor_stop                    : '드론 모터 정지 %1',
                robolink_codrone_edu_drone_motorsingle                   : '드론 %1번 모터를 %2(으)로 회전 %3',
                robolink_codrone_edu_drone_motorsingle_input             : '드론 %1번 모터를 %2(으)로 회전 %3',
                robolink_codrone_edu_drone_value_attitude                : '%1',
                robolink_codrone_edu_drone_value_motion                  : '%1',
                robolink_codrone_edu_drone_value_position                : '%1',
                robolink_codrone_edu_drone_value_sensor                  : '%1',
                robolink_codrone_edu_drone_value_card                    : '%1',
                robolink_codrone_edu_drone_value_etc                     : '%1',
            },

            Helper: {
                robolink_codrone_edu_controller_buzzer_hz                : "지정한 주파수의 소리를 연주합니다. <br><br>즉시로 선택한 경우 계속해서 연주합니다.(최대 60초) 이 블럭을 만났을 경우 소리가 켜져있거나 예약된 소리가 있다면 모두 삭제합니다. 이 블럭은 연주 명령을 실행 후 바로 다음 블럭으로 넘어갑니다.<br><br>예약으로 선택한경우 이 블럭을 만났을 경우 소리가 켜져있거나 예약된 소리가 있다면 모두 삭제합니다. 이 블럭을 사용하면 소리가 끝날때까지 다음 블럭으로 넘어가지 않습니다.<br><br>권장 사용 hz 범위는 250 ~ 8000 입니다. 4옥타브를 기준으로 도(261), 도#(277), 레(293), 레#(311), 미(329), 파(349), 파#(370), 솔(392), 솔#(415), 라(440), 라#(466), 시(493)입니다. <br><br><font color='dodgerblue'>#버저</font> <font color='forestgreen'>#주파수</font>",
                robolink_codrone_edu_controller_buzzer_hz_delay          : "지정한 주파수의 소리를 지정한 시간동안 연주합니다. 권장 사용 범위는 250 ~ 8000 입니다. 4옥타브를 기준으로 도(261), 도#(277), 레(293), 레#(311), 미(329), 파(349), 파#(370), 솔(392), 솔#(415), 라(440), 라#(466), 시(493)입니다. 여기에서 한 옥타브를 올라갈 때마다 주파수 값이 두 배가 됩니다. 한 옥타브를 내려갈 때에는 주파수 값이 절반이 됩니다. 예를 들면 3옥타브의 도는 130.8128Hz, 4옥타브의 도는 261.6256Hz, 5옥타브의 도는 523.2511Hz 입니다. 이 블럭을 만났을 경우 소리가 켜져있거나 예약된 소리가 있다면 모두 삭제합니다. 이 블럭을 사용하면 소리가 끝날때까지 다음 블럭으로 넘어가지 않습니다.<br><br><font color='crimson'>#조종기</font> <font color='dodgerblue'>#버저</font> <font color='forestgreen'>#음계</font> <font color='peru'>#즉시</font> <font color='blueviolet'>#시간지연</font>",
                robolink_codrone_edu_controller_buzzer_hz_reserve        : "지정한 주파수의 소리를 지정한 시간동안 연주하도록 예약합니다. 권장 사용 범위는 250 ~ 8000 입니다. 4옥타브를 기준으로 도(261), 도#(277), 레(293), 레#(311), 미(329), 파(349), 파#(370), 솔(392), 솔#(415), 라(440), 라#(466), 시(493)입니다. 여기에서 한 옥타브를 올라갈 때마다 주파수 값이 두 배가 됩니다. 한 옥타브를 내려갈 때에는 주파수 값이 절반이 됩니다. 예를 들면 3옥타브의 도는 130.8128Hz, 4옥타브의 도는 261.6256Hz, 5옥타브의 도는 523.2511Hz 입니다. 이 블럭은 소리가 나도록 예약하고, 바로 다음 블럭으로 넘어갑니다. 예약은 최대 12개까지 누적할 수 있습니다. 이 블럭은 주로 버저 소리와 함께 다른 행동을 동시에 할 때 사용합니다.<br><br><font color='crimson'>#조종기</font> <font color='dodgerblue'>#버저</font> <font color='forestgreen'>#주파수</font> <font color='peru'>#예약</font>",
                robolink_codrone_edu_controller_buzzer_off               : "버저 작동을 중단합니다. 예약된 소리가 있다면 모두 삭제합니다.<br><br><font color='dodgerblue'>#버저끄기</font>",
                robolink_codrone_edu_controller_buzzer_scale             : "지정한 옥타브의 음을 연주합니다.<br><br>즉시로 선택한 경우 계속해서 연주합니다.(최대 60초) 이 블럭을 만났을 경우 소리가 켜져있거나 예약된 소리가 있다면 모두 삭제합니다. 이 블럭은 연주 명령을 실행 후 바로 다음 블럭으로 넘어갑니다.<br><br>예약으로 선택한경우 이 블럭은 소리가 나도록 예약하고 바로 다음 블럭으로 넘어갑니다. 예약은 최대 12개까지 누적할 수 있습니다. 이 블럭은 주로 버저 소리와 함께 다른 행동을 동시에 할 때 사용합니다.<br><br><font color='dodgerblue'>#버저</font> <font color='forestgreen'>#음계</font>",
                robolink_codrone_edu_controller_buzzer_scale_delay       : "지정한 옥타브의 음을 지정한 시간동안 연주합니다. 이 블럭을 만났을 경우 소리가 켜져있거나 예약된 소리가 있다면 모두 삭제합니다. 이 블럭을 사용하면 소리가 끝날때까지 다음 블럭으로 넘어가지 않습니다.<br><br><font color='crimson'>#조종기</font> <font color='dodgerblue'>#버저</font> <font color='forestgreen'>#음계</font> <font color='peru'>#즉시</font> <font color='blueviolet'>#시간지연</font>",
                robolink_codrone_edu_controller_buzzer_scale_reserve     : "지정한 옥타브의 음을 지정한 시간동안 연주하도록 예약합니다. 이 블럭은 소리가 나도록 예약하고 바로 다음 블럭으로 넘어갑니다. 예약은 최대 12개까지 누적할 수 있습니다. 이 블럭은 주로 버저 소리와 함께 다른 행동을 동시에 할 때 사용합니다.<br><br><font color='crimson'>#조종기</font> <font color='dodgerblue'>#버저</font> <font color='forestgreen'>#음계</font> <font color='peru'>#예약</font>",
                robolink_codrone_edu_controller_display_clear            : "조종기 OLED 화면의 선택한 영역을 지웁니다.<br>x, y 좌표값과 너비, 높이를 지정합니다. 좌표(x, y) = (가로, 세로) 화면상의 위치입니다. 사용 가능한 값의 범위는 x값과 너비는 (0~128), y값과 높이는 (0~64)입니다.<br><br><font color='crimson'>#조종기</font> <font color='dodgerblue'>#Display</font>",
                robolink_codrone_edu_controller_display_clear_all        : "조종기 OLED 화면 전체를 지웁니다.<br> 흰색/검은색 중에서 원하는 색을 선택할 수 있습니다.<br><br><font color='crimson'>#조종기</font> <font color='dodgerblue'>#Display</font>",
                robolink_codrone_edu_controller_display_draw_shape       : "조종기 OLED 화면에서 지정한 위치에 선택한 모양을 그립니다.<br>모양에 따라 파라미터가 다르게 사용됩니다.<br>(x, y)좌표에 관한 설명은 [점 그리기]블럭을 참조해주세요.<br><br>*직선 그리기는 시작점과 끝나는점을 이어주는 기능입니다.<br>시작점 = (x1, y1), 끝나는점 = (x2, y2)<br>사용 가능한 x값은 (0~128), y값은 (0~64)입니다. <br>선의 색과 선의 종류를 선택할 수 있습니다.<br><br>*사각형 그리기는 x, y 좌표값과 너비, 높이를 지정합니다. <br>시작점 = (x, y), 사용 가능한 x값과 너비는 (0~128), y값과 높이는 (0~64)입니다.<br>선의 색과 선의 종류, 채움을 선택할 수 있습니다.<br><br>*타원 그리기는 x, y 좌표값과 반지름을 지정합니다.<br>원의 중심은 (x, y), 반지름은 원의 크기를 결정합니다.<br>사용 가능한 x값은 (-50~178), y값은 (-50~114), 반지름은 (1~200)입니다.<br>선의 색과 채움을 선택할 수 있습니다.<br><br><font color='crimson'>#조종기</font> <font color='dodgerblue'>#Display</font>",
                robolink_codrone_edu_controller_display_draw_circle      : "조종기 OLED 화면에서 지정한 위치에 원을 그립니다.<br><br>☆★ (x, y)좌표에 관한 설명은 [조종기 화면 점 찍기]블럭을 참조해주세요. ★☆<br><br>x, y 좌표값과 반지름을 지정합니다. 원의 중심 = (x, y),<br>반지름은 원의 크기를 결정합니다.<br><br>★☆사용 가능한 값의 범위는 x값은 (-50~178), y값은 (-50~114), 반지름은 (1~200)입니다.☆★<br><br><font color='crimson'>#조종기</font> <font color='dodgerblue'>#Display</font>",
                robolink_codrone_edu_controller_display_draw_line        : "조종기 OLED 화면에서 지정한 위치에 선을 그립니다.<br><br>☆★ (x, y)좌표에 관한 설명은 [조종기 화면 점 찍기]블럭을 참조해주세요. ★☆<br><br>시작점 = (x1, y1), 끝나는점 = (x2, y2)<br>선 그리기는 시작점과 끝나는점을 이어주는 기능입니다.<br>사용 가능한 값의 범위는 x값은 (0~128), y값은 (0~64)입니다.<br><br><font color='crimson'>#조종기</font> <font color='dodgerblue'>#Display</font>",
                robolink_codrone_edu_controller_display_draw_point       : "조종기 OLED 화면에서 지정한 위치에 점을 찍습니다.<br>흰색/검은색 중에서 원하는 색을 선택할 수 있습니다.<br>x, y 좌표값으로 지정합니다. <br>좌표(x, y) = (가로, 세로) 화면상의 위치입니다.<br>사용 가능한 값의 범위는 x값은 (0~128), y값은 (0~64)입니다.<br><br><font color='crimson'>#조종기</font> <font color='dodgerblue'>#Display</font>",
                robolink_codrone_edu_controller_display_draw_rect        : "조종기 OLED 화면에서 지정한 위치에 사각형을 그립니다.<br><br>☆★ (x, y)좌표에 관한 설명은 [조종기 화면 점 찍기]블럭을 참조해주세요. ★☆<br><br>x, y 좌표값과 너비, 높이를 지정합니다. 시작점 = (x, y), 사용 가능한 값의 범위는 x값과 너비는 (0~128), y값과 높이는 (0~64)입니다.<br><br><font color='crimson'>#조종기</font> <font color='dodgerblue'>#Display</font>",
                robolink_codrone_edu_controller_display_draw_string      : "조종기 OLED 화면에서 지정한 위치에 문자열을 씁니다.<br><br>☆★ (x, y)좌표에 관한 설명은 [조종기 화면 점 찍기]블럭을 참조해주세요. ★☆<br><br>글자 입력은 영문자 알파벳 대문자, 소문자와 숫자, 공백(space), 특수문자만 가능합니다.(한글은 아직 지원되지 않습니다.)<br>x, y 좌표값과 글자 크기, 색을 지정합니다. 시작점 = (x, y), 사용 가능한 값의 범위는 x값은 (0~120), y값과 높이는 (0~60)입니다.<br><br><font color='crimson'>#조종기</font> <font color='dodgerblue'>#Display</font>",
                robolink_codrone_edu_controller_display_draw_string_align: "조종기 OLED 화면에서 지정한 위치에 문자열을 정렬하여 그립니다.<br><br>☆★ (x, y)좌표에 관한 설명은 [조종기 화면 점 찍기]블럭을 참조해주세요. ★☆<br><br>글자 입력은 영문자 알파벳 대문자, 소문자와 숫자, 공백(space), 특수문자만 가능합니다.(한글은 아직 지원되지 않습니다.)<br>x, y 좌표값과 정렬 방향, 글자 크기, 색을 지정합니다. 시작점 = (x1, y), 끝나는점 = (x2, y), 사용 가능한 값의 범위는 x값은 (0~128), y값은 (0~60)입니다.<br><br><font color='crimson'>#조종기</font> <font color='dodgerblue'>#Display</font>",
                robolink_codrone_edu_drone_if_state                      : "드론의 비행 상태에 따라 true를 반환합니다.<br><br><font color='crimson'>#조건</font> <font color='dodgerblue'>#드론</font> <font color='forestgreen'>#상태</font>",
                robolink_codrone_edu_controller_if_button_press          : "조종기의 지정한 버튼이 눌러졌을 때 true를 반환합니다.<br><br><font color='crimson'>#조건</font> <font color='dodgerblue'>#조종기</font> <font color='forestgreen'>#버튼</font>",
                robolink_codrone_edu_controller_if_joystick_direction    : "조종기의 조이스틱을 지정한 방향으로 움직였을 때 true를 반환합니다.<br><br><font color='crimson'>#조건</font> <font color='dodgerblue'>#조종기</font> <font color='forestgreen'>#조이스틱</font>",
                robolink_codrone_edu_light_manual_single_off             : "선택한 장치의 모든 LED를 끕니다.<br><br><font color='dodgerblue'>#LED끄기</font>",
                robolink_codrone_edu_light_color_input                   : "빛의 삼원색인 Red, Green, Blue 값을 지정하여 선택한 장치의 LED의 색상을 원하는대로 만들 수 있습니다.10진수(0 ~ 255) 값을 사용합니다.<br>LED패턴을 사용하는 경우에는 갱신되는 주기 값을 변경할 수 있습니다.10진수 (0 ~ 65535)값을 사용합니다.<br><br><font color='dodgerblue'>#LED제어</font>",
                robolink_codrone_edu_light_color_select                  : "RGB 색지정 블록을 이용해서 만들 수 있는<br> 선택한 장치의 LED 예시입니다.<br>RGB 색지정 블록을 이용해서 멋진 색깔을<br> 다양하게 만들어보세요.<br><br><font color='dodgerblue'>#LED제어</font>",
                robolink_codrone_edu_light_color_preset                  : "선택한 장치의 LED를 조작하는데 사용합니다.<br><br><font color='dodgerblue'>#LED제어</font>",
                robolink_codrone_edu_light_manual_single_input           : "선택한 장치의 LED를 조작하는데 사용합니다.<br>10진수(0 ~ 255) 또는 16진수(0x00 ~ 0xFF) 값을 사용할 수 있습니다.<br>2진수로 표현한 값에서 각각의 비트는 LED의 Red, Green, Blue 색을 선택하는 스위치 역할을 합니다.<br>밝기 값은 0 ~ 255 사이의 값을 사용할 수 있습니다.<br>값이 커질수록 더 밝아집니다. <br><br><font color='dodgerblue'>#LED제어</font>",
                robolink_codrone_edu_controller_light_color_input        : "빛의 삼원색인 Red, Green, Blue 값을 지정하여 조종기 LED의 색상을 원하는대로 만들 수 있습니다.<br>10진수(0 ~ 255) 값을 사용합니다.<br><br><font color='crimson'>#조종기</font> <font color='dodgerblue'>#LED제어</font>",
                robolink_codrone_edu_controller_light_color_select       : "RGB 색지정 블록을 이용해서 만들 수 있는<br> 조종기 LED 예시입니다.<br>RGB 색지정 블록을 이용해서 멋진 색깔을<br> 다양하게 만들어보세요.<br><br><font color='crimson'>#조종기</font> <font color='dodgerblue'>#LED제어</font>",
                robolink_codrone_edu_controller_light_color_preset       : "조종기 LED를 조작하는데 사용합니다.<br><br><font color='crimson'>#조종기</font> <font color='dodgerblue'>#LED제어</font>",
                robolink_codrone_edu_controller_light_manual_single_input: "조종기 LED를 조작하는데 사용합니다.<br>10진수(0 ~ 255) 또는 16진수(0x00 ~ 0xFF) 값을 사용할 수 있습니다.<br>2진수로 표현한 값에서 각각의 비트는 LED의 Red, Green, Blue 색을 선택하는 스위치 역할을 합니다.<br>밝기 값은 0 ~ 255 사이의 값을 사용할 수 있습니다.<br>값이 커질수록 더 밝아집니다. <br><br><font color='crimson'>#조종기</font> <font color='dodgerblue'>#LED제어</font>",
                robolink_codrone_edu_controller_light_manual_single_off  : "조종기의 모든 LED를 끕니다.<br><br><font color='crimson'>#조종기</font> <font color='dodgerblue'>#LED끄기</font>",
                robolink_codrone_edu_controller_value_button             : "조종기에서 눌러진 버튼과 관련된 이벤트를 반환합니다.<br><br><font color='crimson'>#값</font> <font color='dodgerblue'>#조종기</font> <font color='forestgreen'>#버튼</font>",
                robolink_codrone_edu_controller_value_joystick           : "조종기의 조이스틱과 관련된 입력 값을 반환합니다.<br>각 축의 범위는 -100 ~ 100 입니다.<br><br>조이스틱 방향은 가로x세로 = 3x3 = 총9방향입니다.<br>위(왼쪽=17, 가운데=18, 오른쪽=20)<br>중간(왼쪽=33, 센터=34, 오른쪽=36)<br>아래(왼쪽=65, 가운데=66, 오른쪽=68)<br>기본값은 센터=34입니다.<br><br>조이스틱 이벤트는 값이 있을때 2, 없으면 0, 진입 1, 벗어남 3입니다.<br><br><font color='crimson'>#값</font> <font color='dodgerblue'>#조종기</font> <font color='forestgreen'>#조이스틱</font>",
                robolink_codrone_edu_controller_vibrator_delay           : "진동을 지정한 시간동안 켜고 끄는 것을 지정한 시간동안 반복합니다. 이 블럭을 만났을 경우 진동이 켜져있거나 예약된 진동이 있다면 모두 삭제합니다. 이 블럭은 지정한 시간이 끝날 때까지 다음 블럭으로 넘어가지 않습니다.<br><br><font color='crimson'>#조종기</font> <font color='dodgerblue'>#진동</font> <font color='forestgreen'>#즉시</font> <font color='peru'>#시간지연</font>",
                robolink_codrone_edu_controller_vibrator_off             : "진동을 끕니다. 예약된 진동이 있다면 모두 삭제합니다.<br><br><font color='crimson'>#조종기</font> <font color='dodgerblue'>#진동끄기</font>",
                robolink_codrone_edu_controller_vibrator_on_delay        : "진동을 지정한 시간동안 켭니다. 이 블럭을 만났을 경우 진동이 켜져있거나 예약된 진동이 있다면 모두 삭제합니다. 이 블럭은 지정한 시간이 끝날 때까지 다음 블럭으로 넘어가지 않습니다.<br><br><font color='crimson'>#조종기</font> <font color='dodgerblue'>#진동</font> <font color='forestgreen'>#즉시</font> <font color='peru'>#시간지연</font>",
                robolink_codrone_edu_controller_vibrator_on_reserve      : "진동을 지정한 시간동안 켜는 것을 예약합니다. <br>이 블럭은 명령을 전달 후 바로 다음 블럭으로 넘어갑니다.<br><br><font color='crimson'>#조종기</font> <font color='dodgerblue'>#진동</font> <font color='forestgreen'>#예약</font>",
                robolink_codrone_edu_controller_vibrator_reserve         : "진동을 지정한 시간동안 켜고 끄는 것을 지정한 시간동안 반복하도록 예약합니다. 이 블럭은 명령을 전달 후 바로 다음 블럭으로 넘어갑니다.<br><br><font color='crimson'>#조종기</font> <font color='dodgerblue'>#진동</font> <font color='forestgreen'>#예약</font>",
                robolink_codrone_edu_drone_control_headless              : "드론 좌표 기준을 변경합니다.<br>헤드리스 모드를 on으로 하면 이륙 시와 '방향초기화'를 했을 때 드론이 바라보는 방향을 기준으로 앞뒤좌우가 고정됩니다.<br>이 때에는 Yaw를 조작하여 드론이 다른 방향을 보게 하여도 처음 지정한 방향을 기준으로 앞뒤좌우로 움직입니다.<br>사용자가 바라보는 방향과 드론의 기준 방향이 같을 때 조작하기 편리한 장점이 있습니다.<br>Headless mode를 off로 선택하면 현재 드론이 바라보는 방향을 기준으로 앞뒤좌우가 결정됩니다. 드론의 움직임에 따라 앞뒤좌우가 계속 바뀌기 때문에 익숙해지기 전까지는 사용하기 어려울 수 있습니다.<br><br><font color='crimson'>#드론</font> <font color='dodgerblue'>#좌표기준</font>",
                robolink_codrone_edu_drone_control_drone_landing         : "드론을 착륙시킵니다.<br><br>5초간 작동합니다.<br><br><font color='crimson'>#드론</font> <font color='dodgerblue'>#착륙</font>",
                robolink_codrone_edu_drone_control_drone_reset_heading   : "드론의 방향을 초기화합니다.<br>헤드리스 모드가 off 인 경우 현재 드론이 바라보는 방향을 0도로 변경합니다.<br>일반 모드에서는 아무런 영향이 없습니다.<br><br><font color='crimson'>#드론</font> <font color='dodgerblue'>#방향초기화</font>",
                robolink_codrone_edu_drone_control_drone_stop            : "드론 작동을 정지합니다.<br><br><font color='crimson'>#드론</font> <font color='dodgerblue'>#정지</font>",
                robolink_codrone_edu_drone_control_drone_takeoff         : "드론을 이륙시킵니다.<br><br>5초간 작동합니다.<br><br><font color='crimson'>#드론</font> <font color='dodgerblue'>#이륙</font>",
                robolink_codrone_edu_drone_control_drone_return_home     : "비행 중에 드론이 최초 이륙했던 위치로 돌아올 수 있습니다.<br><br> 주변 환경에 따라 오차가 발생할 수 있습니다.<br> 리턴홈 명령전에 주변의 장애물이 없는지 확인해주세요.<br><br><font color='crimson'>#드론</font> <font color='dodgerblue'>#리턴홈</font>",
                robolink_codrone_edu_drone_control_flip                  : "드론을 지정한 방향으로 공중 회전합니다.<br><br>배터리가 낮은 경우 작동하지 않을 수 있습니다.<br>드론의 높이가 낮거나 주변에 장애물이 있는 경우에는 사용에 주의해주세요.<br><br><font color='crimson'>#드론</font> <font color='dodgerblue'>#플립</font>",
                robolink_codrone_edu_drone_control_quad                  : "드론 조종 값을 지정합니다. <br><br>Roll : 좌측, 우측이동<br>Pitch : 전진, 후진이동<br>Yaw : 좌회전, 우회전이동<br>Throttle : 상하수직이동<br><br>입력 가능한 값의 범위는 -100 ~ 100입니다. <br>정지 상태에서 Throttle 값을 50이상으로 지정하면 드론이 이륙합니다. <br>명령 전달 후 바로 다음 블럭으로 넘어갑니다.<br><br><font color='crimson'>#드론</font> <font color='dodgerblue'>#조종</font>",
                robolink_codrone_edu_drone_control_quad_delay            : "지정한 시간동안 작동하는 드론 조종 값을 지정합니다.<br>지정한 시간이 지나면 해당 조종 값을 0으로 변경합니다.<br><br>Roll : 좌측, 우측이동<br>Pitch : 전진, 후진이동<br>Yaw : 좌회전, 우회전이동<br>Throttle : 상하수직이동<br><br>입력 가능한 값의 범위는 -100 ~ 100입니다. <br>정지 상태에서 Throttle 값을 50이상으로 지정하면 드론이 이륙합니다.<br>지정한 시간이 끝날 때까지 다음 블럭으로 넘어가지 않습니다.<br><br><font color='crimson'>#드론</font> <font color='dodgerblue'>#조종</font> <font color='forestgreen'>#시간지연</font>",
                robolink_codrone_edu_drone_control_quad_one              : "드론 조종 값을 지정합니다. <br><br>Roll : 좌측, 우측이동<br>Pitch : 전진, 후진이동<br>Yaw : 좌회전, 우회전이동<br>Throttle : 상하수직이동<br><br>입력 가능한 값의 범위는 -100 ~ 100입니다. <br>정지 상태에서 Throttle 값을 50이상으로 지정하면 드론이 이륙합니다. <br>명령 전달 후 바로 다음 블럭으로 넘어갑니다.<br><br><font color='crimson'>#드론</font> <font color='dodgerblue'>#조종</font>",
                robolink_codrone_edu_drone_control_quad_one_delay        : "지정한 시간동안 작동하는 드론 조종 값을 지정합니다.<br>지정한 시간이 지나면 해당 조종 값을 0으로 변경합니다.<br><br>Roll : 좌측, 우측이동<br>Pitch : 전진, 후진이동<br>Yaw : 좌회전, 우회전이동<br>Throttle : 상하수직이동<br><br>입력 가능한 값의 범위는 -100 ~ 100입니다. <br>정지 상태에서 Throttle 값을 50이상으로 지정하면 드론이 이륙합니다. <br>지정한 시간이 끝날 때까지 다음 블럭으로 넘어가지 않습니다.<br><br><font color='crimson'>#드론</font> <font color='dodgerblue'>#조종</font> <font color='forestgreen'>#시간지연</font>",
                robolink_codrone_edu_drone_control_position_one          : "드론의 방향과 거리, 이동 속도를 지정하여 지정한 위치로 이동합니다. <br><br>'기다리기'를 선택한 경우 거리를 속도로 나누어 얻은 시간에 1.2를 곱한 시간만큼 해당 블럭에서 기다립니다. <br><br><font color='crimson'>#드론</font> <font color='dodgerblue'>#이동</font> <font color='forestgreen'>#시간지연</font>",
                robolink_codrone_edu_drone_control_position_turn         : "드론의 회전 방향과 각도, 회전 속도를 지정하여 지정한 각도로 회전합니다. <br><br>'기다리기'를 선택한 경우 목표 각도를 회전 속도로 나누어 얻은 시간에 1.2를 곱한 시간만큼 해당 블럭블럭에서 기다립니다. <br><br><font color='crimson'>#드론</font> <font color='dodgerblue'>#회전</font> <font color='forestgreen'>#시간지연</font>",
                robolink_codrone_edu_drone_control_position_location     : "드론의 X, Y, Z 축의 방향과 거리, 이동 속도를 설정하여 지정한 위치로 이동합니다. <br><br>'기다리기'를 선택한 경우 거리를 속도로 나누어 얻은 시간에 1.2를 곱한 시간만큼 해당 블럭에서 기다립니다. <br><br><font color='crimson'>#드론</font> <font color='dodgerblue'>#이동</font> <font color='forestgreen'>#시간지연</font>",
                robolink_codrone_edu_drone_control_position_location_turn: "드론의 X, Y, Z 축의 방향과 거리, 이동 속도, 회전 방향과 목표 각도, 회전 속도를 설정하여 지정한 위치로의 이동과 회전을 실행합니다. <br>거리를 속도로 나누어 얻은 시간에 1.2를 곱한 시간 또는 목표 각도를 회전 속도로 나누어 얻은 시간에 1.2를 곱한 시간 중에 긴 시간만큼 해당 블럭에 머뭅니다. <br><br><font color='crimson'>#드론</font> <font color='dodgerblue'>#이동</font> <font color='forestgreen'>#시간지연</font>",
                robolink_codrone_edu_drone_light_color_input             : "빛의 삼원색인 Red, Green, Blue 값을 지정하여 드론의 눈 또는 팔 LED의 색상을 원하는대로 만들 수 있습니다.<br>10진수(0 ~ 255) 값을 사용합니다.<br><br><font color='crimson'>#드론</font> <font color='dodgerblue'>#LED제어</font>",
                robolink_codrone_edu_drone_light_color_select            : "RGB 색지정 블록을 이용해서 만들 수 있는<br> 드론 LED 예시입니다.<br>RGB 색지정 블록을 이용해서 멋진 색깔을<br> 다양하게 만들어보세요.<br><br><font color='crimson'>#드론</font> <font color='dodgerblue'>#LED제어</font>",
                robolink_codrone_edu_drone_light_color_preset            : "드론의 LED를 조작하는데 사용합니다.<br><br><font color='crimson'>#드론</font> <font color='dodgerblue'>#LED제어</font>",
                robolink_codrone_edu_drone_light_manual_single_input     : "드론 LED를 조작하는데 사용합니다.<br>10진수(0 ~ 255), 16진수(0x00 ~ 0xFF) 값을 사용할 수 있습니다.<br>2진수로 표현한 값에서 각각의 비트는 LED를 선택하는 스위치 역할을 합니다.<br>밝기 값은 0 ~ 255 사이의 값을 사용할 수 있습니다.<br>값이 커질수록 더 밝아집니다.<br><br><font color='crimson'>#드론</font> <font color='dodgerblue'>#LED제어</font>",
                robolink_codrone_edu_drone_light_manual_single_off       : "드론의 모든 LED를 끕니다.<br><br><font color='crimson'>#드론</font> <font color='dodgerblue'>#LED끄기</font>",
                robolink_codrone_edu_drone_motor_stop                    : "모든 모터의 작동을 정지합니다.<br><br><font color='crimson'>#드론</font> <font color='dodgerblue'>#모터정지</font>",
                robolink_codrone_edu_drone_motorsingle                   : "모터 제어 블럭입니다.<br>모터의 순서는 12시 방향부터 차례대로 1(앞 오른쪽), 2(뒤 오른쪽), 3(뒤 왼쪽), 4(앞 왼쪽) 입니다.<br>모터 회전에 사용 가능한 값의 범위는 0 ~ 4095입니다. <br><br><font color='crimson'>#드론</font> <font color='dodgerblue'>#모터제어</font>",
                robolink_codrone_edu_drone_motorsingle_input             : "모터 제어 블럭입니다.<br>모터의 순서는 12시 방향부터 차례대로 1(앞 오른쪽), 2(뒤 오른쪽), 3(뒤 왼쪽), 4(앞 왼쪽) 입니다.<br>모터 회전에 사용 가능한 값의 범위는 0 ~ 4095입니다. <br><br><font color='crimson'>#드론</font> <font color='dodgerblue'>#모터제어</font>",
                robolink_codrone_edu_drone_value_attitude                : "드론의 현재 자세를 각도로 반환합니다.<br><br>Roll은 좌우 기울기(-90 ~ 90), <br>Pitch는 앞뒤 기울기(-90 ~ 90), <br>Yaw는 회전 각도(-180 ~ 180) 입니다.<br><br><font color='crimson'>#값</font> <font color='dodgerblue'>#드론</font> <font color='forestgreen'>#자세</font>",
                robolink_codrone_edu_drone_value_etc                     : "드론의 비행 상태 및 설정과 배터리 등의 상태 값들을 반환합니다.<br><br><font color='crimson'>#값</font> <font color='dodgerblue'>#드론</font> <font color='forestgreen'>#기타</font>",
                robolink_codrone_edu_drone_value_motion                  : "드론 IMU센서와 관련된 값들을 반환합니다.<br>(병진운동) 가속도는 x, y, z축에 대한 중력가속도입니다. 1g = 9.8m/s^2<br>(회전운동) 각속도는 x, y, z축을 기준으로 회전하는 속력을 나타내는 벡터입니다.(pitch, roll, yaw) <br><br><font color='crimson'>#값</font> <font color='dodgerblue'>#드론</font> <font color='forestgreen'>#IMU센서</font> <font color='crimson'>#가속도</font> <font color='dodgerblue'>#병진운동</font> <font color='crimson'>#각속도</font> <font color='dodgerblue'>#회전운동</font>",
                robolink_codrone_edu_drone_value_position                : "드론 위치와 관련된 값들을 반환합니다.(단위:m)<br><br><font color='crimson'>#값</font> <font color='dodgerblue'>#드론</font> <font color='forestgreen'>#위치</font>",
                robolink_codrone_edu_drone_value_sensor                  : "드론 거리 및 고도 센서와 관련된 값들을 반환합니다(단위:m)<br>거리 센서의 유효 측정 거리는 2m입니다.<br><br>해발고도는 기압계와 고도계를 사용하여 측정된 값입니다.<br><br><font color='crimson'>#값</font> <font color='dodgerblue'>#드론</font> <font color='forestgreen'>#센서</font> <font color='crimson'>#거리센서</font> <font color='dodgerblue'>#대기압</font>",
                robolink_codrone_edu_drone_value_card                    : "드론 카드 센서와 관련된 값들을 반환합니다.<br><br>카드 : 드론에서 판단한 색상 카드 값을 반환합니다. 먼저 드론에서 컬러 캘리브레이션을 진행해야 사용 가능합니다.<br><br>센서의 색 공간 값 : HSVL 형식으로 앞면과 뒷면의 센서에서 Hue(색상), Saturation(채도), Value(명도), Light(밝기) 값을 반환합니다.<br><br><font color='crimson'>#드론</font> <font color='dodgerblue'>#카드</font>",
            },
        },

        en: {
            Blocks: {
                // 정보창
                monitor_state_modeFlight                        : 'Flight Mode',
                monitor_state_modeControlFlight                 : 'Control Flight Mode',
                monitor_state_modeMovement                      : 'Movement Mode',
                monitor_state_headless                          : 'Headless',
                monitor_state_controlSpeed                      : 'Control Speed',
                monitor_state_sensorOrientation                 : 'Sensor Orientation',
                monitor_state_battery                           : 'Battery',
                monitor_motion_accelX                           : 'Accel X',
                monitor_motion_accelY                           : 'Accel Y',
                monitor_motion_accelZ                           : 'Accel Z',
                monitor_motion_gyroRoll                         : 'Gyro Roll',
                monitor_motion_gyroPitch                        : 'Gyro Pitch',
                monitor_motion_gyroYaw                          : 'Gyro Yaw',
                monitor_motion_angleRoll                        : 'Roll',
                monitor_motion_anglePitch                       : 'Pitch',
                monitor_motion_angleYaw                         : 'Yaw',
                monitor_range_front                             : 'Range Front',
                monitor_range_bottom                            : 'Range Bottom',
                monitor_cardColor_frontHue                      : 'Front Hue',
                monitor_cardColor_frontSaturation               : 'Front Saturation',
                monitor_cardColor_frontValue                    : 'Front Value',
                monitor_cardColor_frontLightness                : 'Front Lightness',
                monitor_cardColor_rearHue                       : 'Rear Hue',
                monitor_cardColor_rearSaturation                : 'Rear Saturation',
                monitor_cardColor_rearValue                     : 'Rear Value',
                monitor_cardColor_rearLightness                 : 'Rear Lightness',
                monitor_cardColor_frontColor                    : 'Front Color',
                monitor_cardColor_rearColor                     : 'Rear Color',
                monitor_cardColor_card                          : 'Card',
                monitor_informationAssembledForEntry_positionX  : 'Position X',
                monitor_informationAssembledForEntry_positionY  : 'Position Y',
                monitor_informationAssembledForEntry_positionZ  : 'Position Z',
                monitor_informationAssembledForEntry_altitude   : 'Altitude',
                monitor_informationAssembledForEntry_rangeHeight: 'Height',
                monitor_joystick_left_x                         : 'Left Joystick X',
                monitor_joystick_left_y                         : 'Left Joystick Y',
                monitor_joystick_left_direction                 : 'Left Joystick Direction',
                monitor_joystick_left_event                     : 'Left Joystick Event',
                monitor_joystick_right_x                        : 'Right Joystick X',
                monitor_joystick_right_y                        : 'Right Joystick Y',
                monitor_joystick_right_direction                : 'Right Joystick Direction',
                monitor_joystick_right_event                    : 'Right Joystick Event',
                monitor_button_button                           : 'Button',
                monitor_button_event                            : 'Button Event',
                monitor_entryhw_countTransferReserved           : 'Transfer Buffer',
                drone_state_mode_flight_ready                   : 'ready state',
                drone_state_mode_flight_start                   : 'start state',
                drone_state_mode_flight_takeoff                 : 'takeoff state',
                drone_state_mode_flight_flight                  : 'flight state',
                drone_state_mode_flight_landing                 : 'landing state',
                drone_state_mode_flight_stop                    : 'stop state',
                controller_display_shape_line                   : 'line',
                controller_display_shape_square                 : 'square',
                controller_display_shape_ellipse                : 'ellipse',
                drone_control_flip_front                        : 'flip forward',
                drone_control_flip_rear                         : 'flip back',
                drone_control_flip_left                         : 'flip left',
                drone_control_flip_right                        : 'flip right',
                common_wait                                     : 'wait',
                common_next                                     : 'next',
                common_instant                                  : 'instant',
                common_reserve                                  : 'reserve',

                // 일반 블럭
                common_light_color_red                  : 'red',
                common_light_color_yellow               : 'yellow',
                common_light_color_green                : 'green',
                common_light_color_cyan                 : 'cyan',
                common_light_color_blue                 : 'blue',
                common_light_color_magenta              : 'magenta',
                common_light_color_white                : 'white',
                common_light_color_cottoncandy          : 'cotton candy',
                common_light_color_emerald              : 'emerald',
                common_light_color_lavender             : 'lavender',
                common_light_color_muscat               : 'muscat',
                common_light_color_strawberrymilk       : 'strawberry milk',
                common_light_color_sunset               : 'sunset',
                common_light_mode_hold                  : 'hold',
                common_light_mode_flicker               : 'flicker',
                common_light_mode_flicker_double        : 'flicker double',
                common_light_mode_dimming               : 'dimming',
                common_light_mode_sunrise               : 'sunrise',
                common_light_mode_sunset                : 'sunset',
                common_light_mode_rainbow               : 'rainbow',
                common_light_mode_rainbow2              : 'rainbow2',
                common_light_brightness_all             : 'all',
                common_light_brightness_b100            : 'brightness 100%',
                common_light_brightness_b25             : 'brightness 25%',
                common_light_brightness_b50             : 'brightness 50%',
                common_light_brightness_b75             : 'brightness 75%',
                common_light_brightness_off             : 'off',
                common_light_brightness_on              : 'on',
                common_left                             : 'left',
                common_right                            : 'right',
                common_roll                             : 'Roll',
                common_pitch                            : 'Pitch',
                common_yaw                              : 'Yaw',
                common_throttle                         : 'Throttle',
                common_drone                            : 'drone',
                common_controller                       : 'controller',
                controller_button                       : 'button',
                controller_button_event                 : 'button event',
                controller_button_front_left_top        : 'Front left top button',
                controller_button_front_left_bottom     : 'Front left bottom button',
                controller_button_front_right_top       : 'Front right top button',
                controller_button_front_right_bottom    : 'Front right bottom button',
                controller_button_top_left              : 'Top left button',
                controller_button_top_right             : 'Top right button',
                controller_button_center_up             : 'Trim up button',
                controller_button_center_left           : 'Trim left button',
                controller_button_center_right          : 'Trim right button',
                controller_button_center_down           : 'Trim down button',
                controller_button_bottom_left           : 'Bottom left button',
                controller_button_bottom_right          : 'Bottom right button',
                controller_buzzer                       : 'buzzer',
                controller_buzzer_a                     : 'A',
                controller_buzzer_as                    : 'A#',
                controller_buzzer_b                     : 'B',
                controller_buzzer_c                     : 'C',
                controller_buzzer_cs                    : 'C#',
                controller_buzzer_d                     : 'D',
                controller_buzzer_ds                    : 'D#',
                controller_buzzer_e                     : 'E',
                controller_buzzer_f                     : 'F',
                controller_buzzer_fs                    : 'F#',
                controller_buzzer_g                     : 'G',
                controller_buzzer_gs                    : 'G#',
                controller_buzzer_mute                  : 'mute',
                controller_display_align_center         : 'center',
                controller_display_align_left           : 'left',
                controller_display_align_right          : 'right',
                controller_display_flagfill_off         : 'not fill',
                controller_display_flagfill_on          : 'fill',
                controller_display_font_10x16           : 'big',
                controller_display_font_5x8             : 'small',
                controller_display_line_dashed          : 'dashed',
                controller_display_line_dotted          : 'dotted',
                controller_display_line_solid           : 'solid',
                controller_display_pixel_black          : 'black',
                controller_display_pixel_white          : 'white',
                controller_display_pixel_inverse        : 'inverse',
                controller_joystick_direction_left_up   : 'Left top',
                controller_joystick_direction_up        : 'Top',
                controller_joystick_direction_right_up  : 'Right top',
                controller_joystick_direction_left      : 'Left',
                controller_joystick_direction_center    : 'Center',
                controller_joystick_direction_right     : 'Right',
                controller_joystick_direction_left_down : 'Left Bottom',
                controller_joystick_direction_down      : 'Bottom',
                controller_joystick_direction_right_down: 'Right Bottom',
                controller_joystick_left_direction      : 'left joystick direction',
                controller_joystick_left_event          : 'left joystick event',
                controller_joystick_left_x              : 'left joystick X',
                controller_joystick_left_y              : 'left joystick Y',
                controller_joystick_right_direction     : 'right joystick direction',
                controller_joystick_right_event         : 'right joystick event',
                controller_joystick_right_x             : 'right joystick X',
                controller_joystick_right_y             : 'right joystick Y',
                drone_accel_x                           : 'Accel x',
                drone_accel_y                           : 'Accel y',
                drone_accel_z                           : 'Accel z',
                drone_gyro_pitch                        : 'Gyro Pitch',
                drone_gyro_roll                         : 'Gyro Roll',
                drone_gyro_yaw                          : 'Gyro Yaw',
                drone_attitude_pitch                    : 'Attitude Pitch',
                drone_attitude_roll                     : 'Attitude Roll',
                drone_attitude_yaw                      : 'Attitude Yaw',
                drone_positionX                         : 'Position X',
                drone_positionY                         : 'Position Y',
                drone_positionZ                         : 'Position Z',
                drone_control_quad_roll                 : 'Roll',
                drone_control_quad_pitch                : 'Pitch',
                drone_control_quad_yaw                  : 'Yaw',
                drone_control_quad_throttle             : 'Throttle',
                drone_control_quad_pitch_backward       : 'Backward',
                drone_control_quad_pitch_forward        : 'Forward',
                drone_control_quad_roll_left            : 'Left',
                drone_control_quad_roll_right           : 'Right',
                drone_control_quad_throttle_down        : 'Down',
                drone_control_quad_throttle_up          : 'Up',
                drone_control_quad_yaw_ccw              : 'Counterclockwise',
                drone_control_quad_yaw_cw               : 'clockwise',
                drone_headless_normal                   : 'Normal',
                drone_headless_headless                 : 'Headless',
                drone_light_color_body                  : 'Body',
                drone_light_manual_body_blue            : 'Blue',
                drone_light_manual_body_green           : 'Green',
                drone_light_manual_body_red             : 'Red',
                drone_motor_rotation_clockwise          : 'Clockwise',
                drone_motor_rotation_counterclockwise   : 'Counterclockwise',
                drone_altitude                          : 'Altitude',
                drone_range_height                      : 'Height',
                drone_range_front                       : 'Distance from front obstacle',
                drone_cardcolor_front_hue               : 'Front Hue',
                drone_cardcolor_front_saturation        : 'Front Saturation',
                drone_cardcolor_front_value             : 'Front Value',
                drone_cardcolor_front_lightness         : 'Front Lightness',
                drone_cardcolor_rear_hue                : 'Rear Hue',
                drone_cardcolor_rear_saturation         : 'Rear Saturation',
                drone_cardcolor_rear_value              : 'Rear Value',
                drone_cardcolor_rear_lightness          : 'Rear Lightness',
                drone_cardcolor_front_color             : 'Front Card Color',
                drone_cardcolor_rear_color              : 'Rear Card Color',
                drone_cardcolor_card                    : 'Card',
                drone_state_mode_system                 : 'System Mode',
                drone_state_mode_flight                 : 'Flight Mode',
                drone_state_mode_control_flight         : 'Flight Control Mode',
                drone_state_mode_movement               : 'mode movement',
                drone_state_headless                    : 'Headless',
                drone_state_control_speed               : 'Speed',
                drone_state_sensor_orientation          : 'Sensor direction',
                drone_state_battery                     : 'Battery',
                entryhw_count_transfer_reserved         : 'Reserved data for transfer',
            },

            template: {
                robolink_codrone_edu_controller_buzzer_hz                : '%1 play Buzzer %2 Hz for %3 second %4sound %5',
                robolink_codrone_edu_controller_buzzer_hz_delay          : '%1 play Buzzer %2 Hz sound for %3 second %4',
                robolink_codrone_edu_controller_buzzer_hz_reserve        : '%1 reserve to play Buzzer %2 Hz for %3 second %4',
                robolink_codrone_edu_controller_buzzer_off               : '%1 turn off the buzzer %2',
                robolink_codrone_edu_controller_buzzer_scale             : '%1 play %2 octave %3 for %4 second %5 %6',
                robolink_codrone_edu_controller_buzzer_scale_delay       : '%1 play %2 octave %3 for %4 second %5',
                robolink_codrone_edu_controller_buzzer_scale_reserve     : '%1 reserve to play %2 octave %3 for %4 second %5',
                robolink_codrone_edu_controller_display_clear            : 'clear controller display x:%1, y:%2, width:%3, height:%4, color:%5 %6',
                robolink_codrone_edu_controller_display_clear_all        : 'clear controller display with %1 color %2',
                robolink_codrone_edu_controller_display_draw_shape       : 'draw a shape %1 x1 %2, y1 %3, x2 %4, y2 %5 %6 %7 %8 %9',  
                robolink_codrone_edu_controller_display_draw_circle      : 'draw a ellipse x:%1, y:%2, radius:%3, %4, %5, %6',
                robolink_codrone_edu_controller_display_draw_line        : 'draw a line x1:%1, y1:%2, x2:%3, y2:%4, %5, %6 %7',
                robolink_codrone_edu_controller_display_draw_point       : 'draw a point x:%1, y:%2, color:%3 %4',
                robolink_codrone_edu_controller_display_draw_rect        : 'draw a rectangle x:%1, y:%2, width:%3, height:%4, %5, %6, %7 %8',
                robolink_codrone_edu_controller_display_draw_string      : 'draw a string x:%1, y:%2, font size:%3, %4, input:%5, %6',
                robolink_codrone_edu_controller_display_draw_string_align: 'draw aligned string x1:%1, x2:%2, y:%3, align:%4, font size:%5, %6, input:%7, %8',
                robolink_codrone_edu_drone_if_state                      : 'drone flight state %1',
                robolink_codrone_edu_controller_if_button_press          : 'when press %1',
                robolink_codrone_edu_controller_if_joystick_direction    : 'when %1 stick move to %2',
                robolink_codrone_edu_light_manual_single_off             : '%1 turn off the LED %2',
                robolink_codrone_edu_light_color_input                   : '%1 LED R %2, G %3, B %4 %5 %6 %7',
                robolink_codrone_edu_light_color_select                  : '%1 LED %2 %3 %4 %5',
                robolink_codrone_edu_light_color_preset                  : '%1 LED %2 %3 %4',
                robolink_codrone_edu_light_manual_single_input           : '%1 LED %2 bright %3 %4',
                robolink_codrone_edu_controller_light_color_input        : 'Controller LED R %1, G %2, B %3 %4 %5 %6',
                robolink_codrone_edu_controller_light_color_select       : 'Controller LED Preset %1 %2 %3 %4',
                robolink_codrone_edu_controller_light_color_preset       : 'Controller LED %1 %2 %3',
                robolink_codrone_edu_controller_light_manual_single_input: 'Controller LED %1 Lightness %2 %3',
                robolink_codrone_edu_controller_light_manual_single_off  : 'Controller LED Off %1',
                robolink_codrone_edu_controller_value_button             : '%1',
                robolink_codrone_edu_controller_value_joystick           : '%1',
                robolink_codrone_edu_controller_vibrator_delay           : 'Controller vibrator %1 sec On, %2 sec Off for %3 sec run %4',
                robolink_codrone_edu_controller_vibrator_off             : 'Controller vibrator Off %1',
                robolink_codrone_edu_controller_vibrator_on_delay        : 'Controller vibrator %1 sec on %2',
                robolink_codrone_edu_controller_vibrator_on_reserve      : 'Controller vibrator %1 sec reserve %2',
                robolink_codrone_edu_controller_vibrator_reserve         : 'Controller vibrator %1 sec On, %2 sec Off for %3 sec reserve %4',
                robolink_codrone_edu_drone_control_headless              : 'Headless mode %1 %2',
                robolink_codrone_edu_drone_control_drone_landing         : 'Landing %1',
                robolink_codrone_edu_drone_control_drone_reset_heading   : 'Reset heading %1',
                robolink_codrone_edu_drone_control_drone_stop            : 'Stop flight %1',
                robolink_codrone_edu_drone_control_drone_takeoff         : 'Takeoff %1',
                robolink_codrone_edu_drone_control_drone_return_home     : 'Return Home %1',
                robolink_codrone_edu_drone_control_flip                  : 'Flip %1 %2',
                robolink_codrone_edu_drone_control_quad_one              : 'Set %1 %2% %3',
                robolink_codrone_edu_drone_control_quad_one_delay        : 'Set %1 %2% %3 sec %4',
                robolink_codrone_edu_drone_control_quad                  : 'Set Roll %1%, Pitch %2%, Yaw %3%, Throttle %4% %5',
                robolink_codrone_edu_drone_control_quad_delay            : 'Set Roll %1%, Pitch %2%, Yaw %3%, Throttle %4% for %5sec %6',
                robolink_codrone_edu_drone_control_position_one          : 'Move %2 meter(s) %1 to %3 m/s %4 %5',
                robolink_codrone_edu_drone_control_position_turn         : 'Rotate %2 degree(s) %1 to %3 deg/s %4 %5',
                robolink_codrone_edu_drone_control_position_location     : 'Move %2 meter(s) %1, %4 meter(s) %3, %6 meter(s) %5 to %7 m/s %8 %9',
                robolink_codrone_edu_drone_control_position_location_turn: 'Move %2 meter(s) %1, %4 meter(s) %3, %6 meter(s) %5 to %7 m/s, Rotate %9 degree(s) %8 to %10 deg/s %11',
                robolink_codrone_edu_drone_light_color_input             : 'Drone LED R %1, G %2, B %3 %4 %5 %6',
                robolink_codrone_edu_drone_light_color_select            : 'Drone LED Preset %1 %2 %3 %4',
                robolink_codrone_edu_drone_light_color_preset            : 'Drone LED %1 %2 %3',
                robolink_codrone_edu_drone_light_manual_single_input     : 'Drone LED %1 lightness %2 %3',
                robolink_codrone_edu_drone_light_manual_single_off       : 'Drone LED Off %1',
                robolink_codrone_edu_drone_motor_stop                    : 'Motor stop %1',
                robolink_codrone_edu_drone_motorsingle                   : 'No. %1 Motor rotate for %2 %3',
                robolink_codrone_edu_drone_motorsingle_input             : 'No. %1 Motor rotate for %2 %3',
                robolink_codrone_edu_drone_value_attitude                : '%1',
                robolink_codrone_edu_drone_value_motion                  : '%1',
                robolink_codrone_edu_drone_value_position                : '%1',
                robolink_codrone_edu_drone_value_sensor                  : '%1',
                robolink_codrone_edu_drone_value_card                    : '%1',
                robolink_codrone_edu_drone_value_etc                     : '%1',
            },

            Helper: {
                robolink_codrone_edu_controller_buzzer_hz                : '',
                robolink_codrone_edu_controller_buzzer_hz_delay          : '',
                robolink_codrone_edu_controller_buzzer_hz_reserve        : '',
                robolink_codrone_edu_controller_buzzer_off               : '',
                robolink_codrone_edu_controller_buzzer_scale             : '',
                robolink_codrone_edu_controller_buzzer_scale_delay       : '',
                robolink_codrone_edu_controller_buzzer_scale_reserve     : '',
                robolink_codrone_edu_controller_display_clear            : '',
                robolink_codrone_edu_controller_display_clear_all        : '',
                robolink_codrone_edu_controller_display_draw_shape       : '',
                robolink_codrone_edu_controller_display_draw_circle      : '',
                robolink_codrone_edu_controller_display_draw_line        : '',
                robolink_codrone_edu_controller_display_draw_point       : '',
                robolink_codrone_edu_controller_display_draw_rect        : '',
                robolink_codrone_edu_controller_display_draw_string      : '',
                robolink_codrone_edu_controller_display_draw_string_align: '',
                robolink_codrone_edu_drone_if_state                      : '',
                robolink_codrone_edu_controller_if_button_press          : '',
                robolink_codrone_edu_controller_if_joystick_direction    : '',
                robolink_codrone_edu_light_manual_single_off             : '',
                robolink_codrone_edu_light_color_input                   : '',
                robolink_codrone_edu_light_color_select                  : '',
                robolink_codrone_edu_light_color_preset                  : '',
                robolink_codrone_edu_light_manual_single_input           : '',
                robolink_codrone_edu_controller_light_color_input        : '',
                robolink_codrone_edu_controller_light_color_select       : '',
                robolink_codrone_edu_controller_light_color_preset       : '',
                robolink_codrone_edu_controller_light_manual_single_input: '',
                robolink_codrone_edu_controller_light_manual_single_off  : '',
                robolink_codrone_edu_controller_value_button             : '',
                robolink_codrone_edu_controller_value_joystick           : '',
                robolink_codrone_edu_controller_vibrator_delay           : '',
                robolink_codrone_edu_controller_vibrator_off             : '',
                robolink_codrone_edu_controller_vibrator_on_delay        : '',
                robolink_codrone_edu_controller_vibrator_on_reserve      : '',
                robolink_codrone_edu_controller_vibrator_reserve         : '',
                robolink_codrone_edu_drone_control_headless              : '',
                robolink_codrone_edu_drone_control_drone_landing         : '',
                robolink_codrone_edu_drone_control_drone_reset_heading   : '',
                robolink_codrone_edu_drone_control_drone_stop            : '',
                robolink_codrone_edu_drone_control_drone_takeoff         : '',
                robolink_codrone_edu_drone_control_drone_return_home     : '',
                robolink_codrone_edu_drone_control_flip                  : '',
                robolink_codrone_edu_drone_control_quad                  : '',
                robolink_codrone_edu_drone_control_quad_delay            : '',
                robolink_codrone_edu_drone_control_quad_one              : '',
                robolink_codrone_edu_drone_control_quad_one_delay        : '',
                robolink_codrone_edu_drone_control_position_one          : '',
                robolink_codrone_edu_drone_control_position_turn         : '',
                robolink_codrone_edu_drone_control_position_location     : '',
                robolink_codrone_edu_drone_control_position_location_turn: '',
                robolink_codrone_edu_drone_light_color_input             : '',
                robolink_codrone_edu_drone_light_color_select            : '',
                robolink_codrone_edu_drone_light_color_preset            : '',
                robolink_codrone_edu_drone_light_manual_single_input     : '',
                robolink_codrone_edu_drone_light_manual_single_off       : '',
                robolink_codrone_edu_drone_motor_stop                    : '',
                robolink_codrone_edu_drone_motorsingle                   : '',
                robolink_codrone_edu_drone_motorsingle_input             : '',
                robolink_codrone_edu_drone_value_attitude                : '',
                robolink_codrone_edu_drone_value_etc                     : '',
                robolink_codrone_edu_drone_value_motion                  : '',
                robolink_codrone_edu_drone_value_position                : '',
                robolink_codrone_edu_drone_value_sensor                  : '',
                robolink_codrone_edu_drone_value_card                    : '',
            },
        },
    };
};


// Entry 좌측 하단 하드웨어 모니터 화면에 표시하는 속성
// listPorts와 ports 두 곳 동시에 동일한 속성을 표시할 수는 없음
Entry.robolink_codrone_edu.monitorTemplate = function()
{
    return {
        /* 센서창 가림 현상을 해결하기 위해서 주석 처리함(2017.11.06)
        imgPath: "hw/robolink_codrone_edu.png",   // 배경 이미지
        width  : 256,                        // 이미지의 폭
        height : 256,                        // 이미지의 높이
        */

        // 모니터 화면 상단에 차례대로 나열하는 값
        listPorts: {
            state_modeFlight                        : { name: Lang.Blocks.monitor_state_modeFlight,                          type: 'input', pos: { x: 0, y: 0 } },
            state_modeControlFlight                 : { name: Lang.Blocks.monitor_state_modeControlFlight,                   type: 'input', pos: { x: 0, y: 0 } },
            state_modeMovement                      : { name: Lang.Blocks.monitor_state_modeMovement,                        type: 'input', pos: { x: 0, y: 0 } },
            state_headless                          : { name: Lang.Blocks.monitor_state_headless,                            type: 'input', pos: { x: 0, y: 0 } },
            state_controlSpeed                      : { name: Lang.Blocks.monitor_state_controlSpeed,                        type: 'input', pos: { x: 0, y: 0 } },
            state_sensorOrientation                 : { name: Lang.Blocks.monitor_state_sensorOrientation,                   type: 'input', pos: { x: 0, y: 0 } },
            state_battery                           : { name: Lang.Blocks.monitor_state_battery,                             type: 'input', pos: { x: 0, y: 0 } },
            motion_accelX                           : { name: Lang.Blocks.monitor_motion_accelX,                             type: 'input', pos: { x: 0, y: 0 } },
            motion_accelY                           : { name: Lang.Blocks.monitor_motion_accelY,                             type: 'input', pos: { x: 0, y: 0 } },
            motion_accelZ                           : { name: Lang.Blocks.monitor_motion_accelZ,                             type: 'input', pos: { x: 0, y: 0 } },
            motion_gyroRoll                         : { name: Lang.Blocks.monitor_motion_gyroRoll,                           type: 'input', pos: { x: 0, y: 0 } },
            motion_gyroPitch                        : { name: Lang.Blocks.monitor_motion_gyroPitch,                          type: 'input', pos: { x: 0, y: 0 } },
            motion_gyroYaw                          : { name: Lang.Blocks.monitor_motion_gyroYaw,                            type: 'input', pos: { x: 0, y: 0 } },
            motion_angleRoll                        : { name: Lang.Blocks.monitor_motion_angleRoll,                          type: 'input', pos: { x: 0, y: 0 } },
            motion_anglePitch                       : { name: Lang.Blocks.monitor_motion_anglePitch,                         type: 'input', pos: { x: 0, y: 0 } },
            motion_angleYaw                         : { name: Lang.Blocks.monitor_motion_angleYaw,                           type: 'input', pos: { x: 0, y: 0 } },
            range_front                             : { name: Lang.Blocks.monitor_range_front,                               type: 'input', pos: { x: 0, y: 0 } },
            range_bottom                            : { name: Lang.Blocks.monitor_range_bottom,                              type: 'input', pos: { x: 0, y: 0 } },
            cardColor_frontHue                      : { name: Lang.Blocks.monitor_cardColor_frontHue,                        type: 'input', pos: { x: 0, y: 0 } },
            cardColor_frontSaturation               : { name: Lang.Blocks.monitor_cardColor_frontSaturation,                 type: 'input', pos: { x: 0, y: 0 } },
            cardColor_frontValue                    : { name: Lang.Blocks.monitor_cardColor_frontValue,                      type: 'input', pos: { x: 0, y: 0 } },
            cardColor_frontLightness                : { name: Lang.Blocks.monitor_cardColor_frontLightness,                  type: 'input', pos: { x: 0, y: 0 } },
            cardColor_rearHue                       : { name: Lang.Blocks.monitor_cardColor_rearHue,                         type: 'input', pos: { x: 0, y: 0 } },
            cardColor_rearSaturation                : { name: Lang.Blocks.monitor_cardColor_rearSaturation,                  type: 'input', pos: { x: 0, y: 0 } },
            cardColor_rearValue                     : { name: Lang.Blocks.monitor_cardColor_rearValue,                       type: 'input', pos: { x: 0, y: 0 } },
            cardColor_rearLightness                 : { name: Lang.Blocks.monitor_cardColor_rearLightness,                   type: 'input', pos: { x: 0, y: 0 } },
            cardColor_frontColor                    : { name: Lang.Blocks.monitor_cardColor_frontColor,                      type: 'input', pos: { x: 0, y: 0 } },
            cardColor_rearColor                     : { name: Lang.Blocks.monitor_cardColor_rearColor,                       type: 'input', pos: { x: 0, y: 0 } },
            cardColor_card                          : { name: Lang.Blocks.monitor_cardColor_card,                            type: 'input', pos: { x: 0, y: 0 } },
            informationAssembledForEntry_positionX  : { name: Lang.Blocks.monitor_informationAssembledForEntry_positionX,    type: 'input', pos: { x: 0, y: 0 } },
            informationAssembledForEntry_positionY  : { name: Lang.Blocks.monitor_informationAssembledForEntry_positionY,    type: 'input', pos: { x: 0, y: 0 } },
            informationAssembledForEntry_positionZ  : { name: Lang.Blocks.monitor_informationAssembledForEntry_positionZ,    type: 'input', pos: { x: 0, y: 0 } },
            informationAssembledForEntry_altitude   : { name: Lang.Blocks.monitor_informationAssembledForEntry_altitude,     type: 'input', pos: { x: 0, y: 0 } },
            informationAssembledForEntry_rangeHeight: { name: Lang.Blocks.monitor_informationAssembledForEntry_rangeHeight,  type: 'input', pos: { x: 0, y: 0 } },
            joystick_left_x                         : { name: Lang.Blocks.monitor_joystick_left_x,                           type: 'input', pos: { x: 0, y: 0 } },
            joystick_left_y                         : { name: Lang.Blocks.monitor_joystick_left_y,                           type: 'input', pos: { x: 0, y: 0 } },
            joystick_left_direction                 : { name: Lang.Blocks.monitor_joystick_left_direction,                   type: 'input', pos: { x: 0, y: 0 } },
            joystick_left_event                     : { name: Lang.Blocks.monitor_joystick_left_event,                       type: 'input', pos: { x: 0, y: 0 } },
            joystick_right_x                        : { name: Lang.Blocks.monitor_joystick_right_x,                          type: 'input', pos: { x: 0, y: 0 } },
            joystick_right_y                        : { name: Lang.Blocks.monitor_joystick_right_y,                          type: 'input', pos: { x: 0, y: 0 } },
            joystick_right_direction                : { name: Lang.Blocks.monitor_joystick_right_direction,                  type: 'input', pos: { x: 0, y: 0 } },
            joystick_right_event                    : { name: Lang.Blocks.monitor_joystick_right_event,                      type: 'input', pos: { x: 0, y: 0 } },
            button_button                           : { name: Lang.Blocks.monitor_button_button,                             type: 'input', pos: { x: 0, y: 0 } },
            button_event                            : { name: Lang.Blocks.monitor_button_event,                              type: 'input', pos: { x: 0, y: 0 } },
            entryhw_countTransferReserved           : { name: Lang.Blocks.monitor_entryhw_countTransferReserved,             type: 'output', pos: { x: 0, y: 0 } },
        },

        // 모니터 화면 지정 위치와 선으로 연결하여 표시하는 값
        ports: {},

        mode: 'both',   // 표시 모드
    };
};


/***************************************************************************************
 *  엔트리에 등록할 블록들의 블록명(다른 장치의 블록 이름과 달라야 함)
 ***************************************************************************************/
Entry.robolink_codrone_edu.blockMenuBlocks = [
    'robolink_codrone_edu_drone_control_drone_takeoff',
    'robolink_codrone_edu_drone_control_drone_landing',
    'robolink_codrone_edu_drone_control_drone_stop',
    'robolink_codrone_edu_drone_control_drone_return_home',
    'robolink_codrone_edu_drone_control_flip',
    'robolink_codrone_edu_drone_control_headless',
    'robolink_codrone_edu_drone_control_drone_reset_heading',
    'robolink_codrone_edu_drone_control_quad_one',
    'robolink_codrone_edu_drone_control_quad_one_delay',
    'robolink_codrone_edu_drone_control_quad',
    'robolink_codrone_edu_drone_control_quad_delay',
    'robolink_codrone_edu_drone_control_position_one',
    'robolink_codrone_edu_drone_control_position_turn',
    'robolink_codrone_edu_drone_control_position_location',
    //'robolink_codrone_edu_drone_control_position_location_turn',
    'robolink_codrone_edu_light_manual_single_off',
    'robolink_codrone_edu_light_color_preset',
    //'robolink_codrone_edu_light_color_select',
    'robolink_codrone_edu_light_color_input',
    //'robolink_codrone_edu_light_manual_single_input',
    //'robolink_codrone_edu_drone_light_manual_single_off',
    //'robolink_codrone_edu_drone_light_manual_single_input',
    //'robolink_codrone_edu_drone_light_color_preset',
    //'robolink_codrone_edu_drone_light_color_input',
    //'robolink_codrone_edu_drone_light_color_select',
    //'robolink_codrone_edu_controller_light_manual_single_off',
    //'robolink_codrone_edu_controller_light_manual_single_input',
    //'robolink_codrone_edu_controller_light_color_preset',
    //'robolink_codrone_edu_controller_light_color_input',
    //'robolink_codrone_edu_controller_light_color_select',
    'robolink_codrone_edu_controller_buzzer_off',
    'robolink_codrone_edu_controller_buzzer_scale',
    //'robolink_codrone_edu_controller_buzzer_scale_delay',
    //'robolink_codrone_edu_controller_buzzer_scale_reserve',
    'robolink_codrone_edu_controller_buzzer_hz',
    //'robolink_codrone_edu_controller_buzzer_hz_delay',
    //'robolink_codrone_edu_controller_buzzer_hz_reserve',
    'robolink_codrone_edu_controller_display_clear_all',
    //'robolink_codrone_edu_controller_display_clear',
    'robolink_codrone_edu_controller_display_draw_point',
    'robolink_codrone_edu_controller_display_draw_shape',
    //'robolink_codrone_edu_controller_display_draw_line',
    //'robolink_codrone_edu_controller_display_draw_rect',
    //'robolink_codrone_edu_controller_display_draw_circle',
    'robolink_codrone_edu_controller_display_draw_string',
    //'robolink_codrone_edu_controller_display_draw_string_align',
    'robolink_codrone_edu_controller_vibrator_off',
    //'robolink_codrone_edu_controller_vibrator_on_delay',
    'robolink_codrone_edu_controller_vibrator_on_reserve',
    //'robolink_codrone_edu_controller_vibrator_delay',
    //'robolink_codrone_edu_controller_vibrator_reserve',
    //'robolink_codrone_edu_drone_motor_stop',
    //'robolink_codrone_edu_drone_motorsingle',
    //'robolink_codrone_edu_drone_motorsingle_input',
    'robolink_codrone_edu_drone_value_attitude',
    'robolink_codrone_edu_drone_value_motion',
    'robolink_codrone_edu_drone_value_position',
    'robolink_codrone_edu_drone_value_sensor',
    'robolink_codrone_edu_drone_value_card',
    'robolink_codrone_edu_drone_value_etc',
    'robolink_codrone_edu_controller_value_button',
    'robolink_codrone_edu_controller_value_joystick',
    'robolink_codrone_edu_drone_if_state',
    'robolink_codrone_edu_controller_if_button_press',
    'robolink_codrone_edu_controller_if_joystick_direction',
];


/***************************************************************************************
 *  엔트리 블록 정의
 ***************************************************************************************/
Entry.robolink_codrone_edu.getBlocks = function()
{
    return {
        robolink_codrone_edu_drone_value_attitude: {
            color     : EntryStatic.colorSet.block.default.HARDWARE,
            outerLine : EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton  : 'basic_string_field',
            statements: [],
            params    : [
                {
                    type   : 'Dropdown',
                    options: [
                        [Lang.Blocks.drone_attitude_roll,   'motion_angleRoll'],
                        [Lang.Blocks.drone_attitude_pitch,  'motion_anglePitch'],
                        [Lang.Blocks.drone_attitude_yaw,    'motion_angleYaw'],
                    ],
                    value     : 'motion_angleRoll',                            // 초기 선택항목 지정
                    fontSize  : 11,
                    bgColor   : EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def   : {
                params: [null],
                type  : 'robolink_codrone_edu_drone_value_attitude',
            },
            paramsKeyMap: {
                DEVICE: 0,
            },
            class   : 'monitor',             // 같은 이름인 객체들이 그룹으로 형성됨
            isNotFor: ['robolink_codrone_edu'],
            func(sprite, script)
            {
                return Entry.hw.portData[script.getField('DEVICE')];
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax    : 'Drone.attitude(%1)',
                        blockType : 'param',
                        textParams: [
                            {
                                type   : 'Dropdown',
                                options: [
                                    [Lang.Blocks.drone_attitude_roll,   'motion_angleRoll'],
                                    [Lang.Blocks.drone_attitude_pitch,  'motion_anglePitch'],
                                    [Lang.Blocks.drone_attitude_yaw,    'motion_angleYaw'],
                                ],
                                value     : 'motion_angleRoll',
                                fontSize  : 11,
                                bgColor   : EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter : Entry.block.converters.returnStringValue,
                            },
                        ],
                    },
                ],
            },
        },

        robolink_codrone_edu_drone_value_motion: {
            color     : EntryStatic.colorSet.block.default.HARDWARE,
            outerLine : EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton  : 'basic_string_field',
            statements: [],
            params    : [
                {
                    type   : 'Dropdown',
                    options: [
                        [Lang.Blocks.drone_accel_x,     'motion_accelX'],
                        [Lang.Blocks.drone_accel_y,     'motion_accelY'],
                        [Lang.Blocks.drone_accel_z,     'motion_accelZ'],
                        [Lang.Blocks.drone_gyro_roll,   'motion_gyroRoll'],
                        [Lang.Blocks.drone_gyro_pitch,  'motion_gyroPitch'],
                        [Lang.Blocks.drone_gyro_yaw,    'motion_gyroYaw'],
                    ],
                    value     : 'motion_accelX',                               // 초기 선택항목 지정
                    fontSize  : 11,
                    bgColor   : EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def   : {
                params: [null],
                type  : 'robolink_codrone_edu_drone_value_motion',
            },
            paramsKeyMap: {
                DEVICE: 0,
            },
            class   : 'monitor',             // 같은 이름인 객체들이 그룹으로 형성됨
            isNotFor: ['robolink_codrone_edu'],
            func(sprite, script)
            {
                return Entry.hw.portData[script.getField('DEVICE')];
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax    : 'Drone.motion(%1)',
                        blockType : 'param',
                        textParams: [
                            {
                                type   : 'Dropdown',
                                options: [
                                    [Lang.Blocks.drone_accel_x,     'motion_accelX'],
                                    [Lang.Blocks.drone_accel_y,     'motion_accelY'],
                                    [Lang.Blocks.drone_accel_z,     'motion_accelZ'],
                                    [Lang.Blocks.drone_gyro_roll,   'motion_gyroRoll'],
                                    [Lang.Blocks.drone_gyro_pitch,  'motion_gyroPitch'],
                                    [Lang.Blocks.drone_gyro_yaw,    'motion_gyroYaw'],
                                ],
                                value     : 'motion_accelX',                               // 초기 선택항목 지정
                                fontSize  : 11,
                                bgColor   : EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter : Entry.block.converters.returnStringValue,
                            },
                        ],
                    },
                ],
            },
        },

        robolink_codrone_edu_drone_value_position: {
            color     : EntryStatic.colorSet.block.default.HARDWARE,
            outerLine : EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton  : 'basic_string_field',
            statements: [],
            params    : [
                {
                    type   : 'Dropdown',
                    options: [
                        [Lang.Blocks.drone_positionX,       'informationAssembledForEntry_positionX'],
                        [Lang.Blocks.drone_positionY,       'informationAssembledForEntry_positionY'],
                        [Lang.Blocks.drone_positionZ,       'informationAssembledForEntry_positionZ'],
                    ],
                    value     : 'informationAssembledForEntry_positionX',      // 초기 선택항목 지정
                    fontSize  : 11,
                    bgColor   : EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def   : {
                params: [null],
                type  : 'robolink_codrone_edu_drone_value_position',
            },
            paramsKeyMap: {
                DEVICE: 0,
            },
            class   : 'monitor',             // 같은 이름인 객체들이 그룹으로 형성됨
            isNotFor: ['robolink_codrone_edu'],
            func(sprite, script)
            {
                return Entry.hw.portData[script.getField('DEVICE')];
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax    : 'Drone.position(%1)',
                        blockType : 'param',
                        textParams: [
                            {
                                type   : 'Dropdown',
                                options: [
                                    [Lang.Blocks.drone_positionX,       'informationAssembledForEntry_positionX'],
                                    [Lang.Blocks.drone_positionY,       'informationAssembledForEntry_positionY'],
                                    [Lang.Blocks.drone_positionZ,       'informationAssembledForEntry_positionZ'],
                                ],
                                value     : 'informationAssembledForEntry_positionX',      // 초기 선택항목 지정
                                fontSize  : 11,
                                bgColor   : EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter : Entry.block.converters.returnStringValue,
                            },
                        ],
                    },
                ],
            },
        },

        robolink_codrone_edu_drone_value_sensor: {
            color     : EntryStatic.colorSet.block.default.HARDWARE,
            outerLine : EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton  : 'basic_string_field',
            statements: [],
            params    : [
                {
                    type   : 'Dropdown',
                    options: [
                        [Lang.Blocks.drone_range_front,     'range_front'],
                        [Lang.Blocks.drone_range_height,    'informationAssembledForEntry_rangeHeight'],
                        [Lang.Blocks.drone_altitude,        'informationAssembledForEntry_altitude'],
                    ],
                    value     : 'range_front',                                 // 초기 선택항목 지정
                    fontSize  : 11,
                    bgColor   : EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def   : {
                params: [null],
                type  : 'robolink_codrone_edu_drone_value_sensor',
            },
            paramsKeyMap: {
                DEVICE: 0,
            },
            class   : 'monitor',             // 같은 이름인 객체들이 그룹으로 형성됨
            isNotFor: ['robolink_codrone_edu'],
            func(sprite, script)
            {
                return Entry.hw.portData[script.getField('DEVICE')];
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax    : 'Drone.sensor(%1)',
                        blockType : 'param',
                        textParams: [
                            {
                                type   : 'Dropdown',
                                options: [
                                    [Lang.Blocks.drone_range_front,     'range_front'],
                                    [Lang.Blocks.drone_range_height,    'informationAssembledForEntry_rangeHeight'],
                                    [Lang.Blocks.drone_altitude,        'informationAssembledForEntry_altitude'],
                                ],
                                value     : 'range_front',                                 // 초기 선택항목 지정
                                fontSize  : 11,
                                bgColor   : EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter : Entry.block.converters.returnStringValue,
                            },
                        ],
                    },
                ],
            },
        },

        robolink_codrone_edu_drone_value_card: {
            color     : EntryStatic.colorSet.block.default.HARDWARE,
            outerLine : EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton  : 'basic_string_field',
            statements: [],
            params    : [
                {
                    type   : 'Dropdown',
                    options: [
                        [Lang.Blocks.drone_cardcolor_front_color,            'cardColor_frontColor'],
                        [Lang.Blocks.drone_cardcolor_rear_color,             'cardColor_rearColor'],
                        [Lang.Blocks.drone_cardcolor_card,                   'cardColor_card'],
                        [Lang.Blocks.drone_cardcolor_front_hue,              'cardColor_frontHue'],
                        [Lang.Blocks.drone_cardcolor_front_saturation,       'cardColor_frontSaturation'],
                        [Lang.Blocks.drone_cardcolor_front_value,            'cardColor_frontValue'],
                        [Lang.Blocks.drone_cardcolor_front_lightness,        'cardColor_frontLightness'],
                        [Lang.Blocks.drone_cardcolor_rear_hue,               'cardColor_rearHue'],
                        [Lang.Blocks.drone_cardcolor_rear_saturation,        'cardColor_rearSaturation'],
                        [Lang.Blocks.drone_cardcolor_rear_value,             'cardColor_rearValue'],
                        [Lang.Blocks.drone_cardcolor_rear_lightness,         'cardColor_rearLightness'],
                    ],
                    value     : 'cardColor_frontColor',                        // 초기 선택항목 지정
                    fontSize  : 11,
                    bgColor   : EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def   : {
                params: [null],
                type  : 'robolink_codrone_edu_drone_value_card',
            },
            paramsKeyMap: {
                DEVICE: 0,
            },
            class   : 'monitor',             // 같은 이름인 객체들이 그룹으로 형성됨
            isNotFor: ['robolink_codrone_edu'],
            func(sprite, script)
            {
                return Entry.hw.portData[script.getField('DEVICE')];
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax    : 'Drone.card(%1)',
                        blockType : 'param',
                        textParams: [
                            {
                                type   : 'Dropdown',
                                options: [
                                    [Lang.Blocks.drone_cardcolor_front_color,            'cardColor_frontColor'],
                                    [Lang.Blocks.drone_cardcolor_rear_color,             'cardColor_rearColor'],
                                    [Lang.Blocks.drone_cardcolor_card,                   'cardColor_card'],
                                    [Lang.Blocks.drone_cardcolor_front_hue,              'cardColor_frontHue'],
                                    [Lang.Blocks.drone_cardcolor_front_saturation,       'cardColor_frontSaturation'],
                                    [Lang.Blocks.drone_cardcolor_front_value,            'cardColor_frontValue'],
                                    [Lang.Blocks.drone_cardcolor_front_lightness,        'cardColor_frontLightness'],
                                    [Lang.Blocks.drone_cardcolor_rear_hue,               'cardColor_rearHue'],
                                    [Lang.Blocks.drone_cardcolor_rear_saturation,        'cardColor_rearSaturation'],
                                    [Lang.Blocks.drone_cardcolor_rear_value,             'cardColor_rearValue'],
                                    [Lang.Blocks.drone_cardcolor_rear_lightness,         'cardColor_rearLightness'],
                                ],
                                value     : 'cardColor_frontColor',                        // 초기 선택항목 지정
                                fontSize  : 11,
                                bgColor   : EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter : Entry.block.converters.returnStringValue,
                            },
                        ],
                    },
                ],
            },
        },

        robolink_codrone_edu_drone_value_etc: {
            color     : EntryStatic.colorSet.block.default.HARDWARE,
            outerLine : EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton  : 'basic_string_field',
            statements: [],
            params    : [
                {
                    type   : 'Dropdown',
                    options: [
                        [Lang.Blocks.drone_state_mode_flight,           'state_modeFlight'],
                        [Lang.Blocks.drone_state_mode_control_flight,   'state_modeControlFlight'],
                        [Lang.Blocks.drone_state_mode_movement,         'state_modeMovement'],
                        [Lang.Blocks.drone_state_headless,              'state_headless'],
                        [Lang.Blocks.drone_state_control_speed,         'state_controlSpeed'],
                        [Lang.Blocks.drone_state_sensor_orientation,    'state_sensorOrientation'],
                        [Lang.Blocks.drone_state_battery,               'state_battery'],
                    ],
                    value     : 'state_battery',                               // 초기 선택항목 지정
                    fontSize  : 11,
                    bgColor   : EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def   : {
                params: [null],
                type  : 'robolink_codrone_edu_drone_value_etc',
            },
            paramsKeyMap: {
                DEVICE: 0,
            },
            class   : 'monitor',             // 같은 이름인 객체들이 그룹으로 형성됨
            isNotFor: ['robolink_codrone_edu'],
            func(sprite, script)
            {
                return Entry.hw.portData[script.getField('DEVICE')];
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax    : 'Drone.state(%1)',
                        blockType : 'param',
                        textParams: [
                            {
                                type   : 'Dropdown',
                                options: [
                                    [Lang.Blocks.drone_state_mode_flight,           'state_modeFlight'],
                                    [Lang.Blocks.drone_state_mode_control_flight,   'state_modeControlFlight'],
                                    [Lang.Blocks.drone_state_mode_movement,         'state_modeMovement'],
                                    [Lang.Blocks.drone_state_headless,              'state_headless'],
                                    [Lang.Blocks.drone_state_control_speed,         'state_controlSpeed'],
                                    [Lang.Blocks.drone_state_sensor_orientation,    'state_sensorOrientation'],
                                    [Lang.Blocks.drone_state_battery,               'state_battery'],
                                ],
                                value     : 'state_battery',                               // 초기 선택항목 지정
                                fontSize  : 11,
                                bgColor   : EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter : Entry.block.converters.returnStringValue,
                            },
                        ],
                    },
                ],
            },
        },

        robolink_codrone_edu_controller_value_button: {
            color     : EntryStatic.colorSet.block.default.HARDWARE,
            outerLine : EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton  : 'basic_string_field',
            statements: [],
            params    : [
                {
                    type   : 'Dropdown',
                    options: [
                        [Lang.Blocks.controller_button,         'button_button'],
                        [Lang.Blocks.controller_button_event,   'button_event'],
                    ],
                    value     : 'button_button',                               // 초기 선택항목 지정
                    fontSize  : 11,
                    bgColor   : EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def   : {
                params: [null],
                type  : 'robolink_codrone_edu_controller_value_button',
            },
            paramsKeyMap: {
                DEVICE: 0,
            },
            class   : 'monitor',             // 같은 이름인 객체들이 그룹으로 형성됨
            isNotFor: ['robolink_codrone_edu'],
            func(sprite, script)
            {
                return Entry.hw.portData[script.getField('DEVICE')];
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax    : 'Drone.button(%1)',
                        blockType : 'param',
                        textParams: [
                            {
                                type   : 'Dropdown',
                                options: [
                                    [Lang.Blocks.controller_button,         'button_button'],
                                    [Lang.Blocks.controller_button_event,   'button_event'],
                                ],
                                value     : 'button_button',                               // 초기 선택항목 지정
                                fontSize  : 11,
                                bgColor   : EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter : Entry.block.converters.returnStringValue,
                            },
                        ],
                    },
                ],
            },
        },

        robolink_codrone_edu_controller_value_joystick: {
            color     : EntryStatic.colorSet.block.default.HARDWARE,
            outerLine : EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton  : 'basic_string_field',
            statements: [],
            params    : [
                {
                    type   : 'Dropdown',
                    options: [
                        [Lang.Blocks.controller_joystick_left_x,            'joystick_left_x'],
                        [Lang.Blocks.controller_joystick_left_y,            'joystick_left_y'],
                        [Lang.Blocks.controller_joystick_left_direction,    'joystick_left_direction'],
                        [Lang.Blocks.controller_joystick_left_event,        'joystick_left_event'],
                        [Lang.Blocks.controller_joystick_right_x,           'joystick_right_x'],
                        [Lang.Blocks.controller_joystick_right_y,           'joystick_right_y'],
                        [Lang.Blocks.controller_joystick_right_direction,   'joystick_right_direction'],
                        [Lang.Blocks.controller_joystick_right_event,       'joystick_right_event'],
                    ],
                    value     : 'joystick_left_x',                             // 초기 선택항목 지정
                    fontSize  : 11,
                    bgColor   : EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def   : {
                params: [null],
                type  : 'robolink_codrone_edu_controller_value_joystick',
            },
            paramsKeyMap: {
                DEVICE: 0,
            },
            class   : 'monitor',             // 같은 이름인 객체들이 그룹으로 형성됨
            isNotFor: ['robolink_codrone_edu'],
            func(sprite, script)
            {
                return Entry.hw.portData[script.getField('DEVICE')];
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax    : 'Drone.joystick(%1)',
                        blockType : 'param',
                        textParams: [
                            {
                                type   : 'Dropdown',
                                options: [
                                    [Lang.Blocks.controller_joystick_left_x,            'joystick_left_x'],
                                    [Lang.Blocks.controller_joystick_left_y,            'joystick_left_y'],
                                    [Lang.Blocks.controller_joystick_left_direction,    'joystick_left_direction'],
                                    [Lang.Blocks.controller_joystick_left_event,        'joystick_left_event'],
                                    [Lang.Blocks.controller_joystick_right_x,           'joystick_right_x'],
                                    [Lang.Blocks.controller_joystick_right_y,           'joystick_right_y'],
                                    [Lang.Blocks.controller_joystick_right_direction,   'joystick_right_direction'],
                                    [Lang.Blocks.controller_joystick_right_event,       'joystick_right_event'],
                                ],
                                value     : 'joystick_left_x',                             // 초기 선택항목 지정
                                fontSize  : 11,
                                bgColor   : EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter : Entry.block.converters.returnStringValue,
                            },
                        ],
                    },
                ],
            },
        },

        robolink_codrone_edu_drone_if_state: {
            color     : EntryStatic.colorSet.block.default.HARDWARE,
            outerLine : EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor : '#fff',
            skeleton  : 'basic_boolean_field',
            statements: [],
            params    : [
                {
                    type   : 'Dropdown',
                    options: [
                        [Lang.Blocks.drone_state_mode_flight_ready,     '16'],
                        [Lang.Blocks.drone_state_mode_flight_start,     '17'],
                        [Lang.Blocks.drone_state_mode_flight_takeoff,   '18'],
                        [Lang.Blocks.drone_state_mode_flight_flight,    '19'],
                        [Lang.Blocks.drone_state_mode_flight_landing,   '20'],
                        [Lang.Blocks.drone_state_mode_flight_stop,      '32'],
                    ],
                    value     : '16',
                    fontSize  : 11,
                    bgColor   : EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def   : {
                params: [null],
                type  : 'robolink_codrone_edu_drone_if_state',
            },
            paramsKeyMap: {
                STATE: 0,
            },
            class   : 'boolean_input',
            isNotFor: ['robolink_codrone_edu'],
            func(sprite, script)
            {
                const read        = Entry.hw.portData;
                const state_fligh = 'state_modeFlight';    // paramsKeyMap에 정의된 이름 사용
                const buttonevent = 'button_event';     // paramsKeyMap에 정의된 이름 사용

                //if (read[state_flight] == script.getField('STATE') && read[state_flight] == 16) {
                //if (read[state_flight] == 0x10) {
                if (Entry.hw.portData['state_modeFlight'] == script.getField('STATE')){
                    return true;
                } else {
                    return false;
                }
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax    : 'Drone.state(%1)',
                        blockType : 'param',
                        textParams: [
                            {
                                type   : 'Dropdown',
                                options: [
                                    [Lang.Blocks.drone_state_mode_flight_ready,     '16'],
                                    [Lang.Blocks.drone_state_mode_flight_start,     '17'],
                                    [Lang.Blocks.drone_state_mode_flight_takeoff,   '18'],
                                    [Lang.Blocks.drone_state_mode_flight_flight,    '19'],
                                    [Lang.Blocks.drone_state_mode_flight_landing,   '20'],
                                    [Lang.Blocks.drone_state_mode_flight_stop,      '32'],
                                ],
                                value     : '16',
                                fontSize  : 16,
                                bgColor   : EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter : Entry.block.converters.returnStringValue,
                            },
                        ],
                    },
                ],
            },
        },

        robolink_codrone_edu_controller_if_button_press: {
            color     : EntryStatic.colorSet.block.default.HARDWARE,
            outerLine : EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor : '#fff',
            skeleton  : 'basic_boolean_field',
            statements: [],
            params    : [
                {
                    type   : 'Dropdown',
                    options: [
                        [Lang.Blocks.controller_button_front_left_top,      '1'],
                        [Lang.Blocks.controller_button_front_left_bottom,   '2'],
                        [Lang.Blocks.controller_button_front_right_top,     '4'],
                        [Lang.Blocks.controller_button_front_right_bottom,  '8'],
                        [Lang.Blocks.controller_button_top_left,            '16'],
                        [Lang.Blocks.controller_button_top_right,           '32'],
                        [Lang.Blocks.controller_button_center_up,           '64'],
                        [Lang.Blocks.controller_button_center_left,         '128'],
                        [Lang.Blocks.controller_button_center_right,        '256'],
                        [Lang.Blocks.controller_button_center_down,         '512'],
                        [Lang.Blocks.controller_button_bottom_left,         '1024'],
                        [Lang.Blocks.controller_button_bottom_right,        '2048'],
                    ],
                    value     : '1',
                    fontSize  : 11,
                    bgColor   : EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def   : {
                params: [null],
                type  : 'robolink_codrone_edu_controller_if_button_press',
            },
            paramsKeyMap: {
                BUTTON: 0,
            },
            class   : 'boolean_input',
            isNotFor: ['robolink_codrone_edu'],
            func(sprite, script)
            {
                const read        = Entry.hw.portData;
                const button      = 'button_button';    // paramsKeyMap에 정의된 이름 사용
                const buttonevent = 'button_event';     // paramsKeyMap에 정의된 이름 사용

                if (read[button] == script.getField('BUTTON') && read[buttonevent] == 2) {
                    return true;
                } else {
                    return false;
                }
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax    : 'Drone.button_pressed(%1)',
                        blockType : 'param',
                        textParams: [
                            {
                                type   : 'Dropdown',
                                options: [
                                    [Lang.Blocks.controller_button_front_left_top,      '1'],
                                    [Lang.Blocks.controller_button_front_left_bottom,   '2'],
                                    [Lang.Blocks.controller_button_front_right_top,     '4'],
                                    [Lang.Blocks.controller_button_front_right_bottom,  '8'],
                                    [Lang.Blocks.controller_button_top_left,            '16'],
                                    [Lang.Blocks.controller_button_top_right,           '32'],
                                    [Lang.Blocks.controller_button_center_up,           '64'],
                                    [Lang.Blocks.controller_button_center_left,         '128'],
                                    [Lang.Blocks.controller_button_center_right,        '256'],
                                    [Lang.Blocks.controller_button_center_down,         '512'],
                                    [Lang.Blocks.controller_button_bottom_left,         '1024'],
                                    [Lang.Blocks.controller_button_bottom_right,        '2048'],
                                ],
                                value     : '1',                                           // 초기 선택항목 지정
                                fontSize  : 11,
                                bgColor   : EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter : Entry.block.converters.returnStringValue,
                            },
                        ],
                    },
                ],
            },
        },

        robolink_codrone_edu_controller_if_joystick_direction: {
            color     : EntryStatic.colorSet.block.default.HARDWARE,
            outerLine : EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor : '#fff',
            skeleton  : 'basic_boolean_field',
            statements: [],
            params    : [
                {
                    type   : 'Dropdown',
                    options: [
                        [Lang.Blocks.common_left, 'joystick_left_direction'],
                        [Lang.Blocks.common_right, 'joystick_right_direction'],
                    ],
                    value     : 'joystick_left_direction',
                    fontSize  : 11,
                    bgColor   : EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type   : 'Dropdown',
                    options: [
                        [Lang.Blocks.controller_joystick_direction_left_up,     '17'],
                        [Lang.Blocks.controller_joystick_direction_up,          '18'],
                        [Lang.Blocks.controller_joystick_direction_right_up,    '20'],
                        [Lang.Blocks.controller_joystick_direction_left,        '33'],
                        [Lang.Blocks.controller_joystick_direction_center,      '34'],
                        [Lang.Blocks.controller_joystick_direction_right,       '36'],
                        [Lang.Blocks.controller_joystick_direction_left_down,   '65'],
                        [Lang.Blocks.controller_joystick_direction_down,        '66'],
                        [Lang.Blocks.controller_joystick_direction_right_down,  '68'],
                    ],
                    value     : '34',
                    fontSize  : 11,
                    bgColor   : EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def   : {
                params: [null, null],
                type  : 'robolink_codrone_edu_controller_if_joystick_direction',
            },
            paramsKeyMap: {
                DEVICE   : 0,
                DIRECTION: 1,
            },
            class   : 'boolean_input',
            isNotFor: ['robolink_codrone_edu'],
            func(sprite, script)
            {
                const read   = Entry.hw.portData;
                const device = script.getField('DEVICE');  // paramsKeyMap에 정의된 이름 사용

                if (read[device] == script.getField('DIRECTION'))
                {
                    return true;
                }
                else
                {
                    return false;
                }
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax    : 'Drone.joystick_direction(%1, %2)',
                        blockType : 'param',
                        textParams: [
                            {
                                type   : 'Dropdown',
                                options: [
                                    [Lang.Blocks.common_left, 'joystick_left_direction'],
                                    [Lang.Blocks.common_right, 'joystick_right_direction'],
                                ],
                                value     : 'joystick_left_direction',                     // 초기 선택항목 지정
                                fontSize  : 11,
                                bgColor   : EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter : Entry.block.converters.returnStringValue,
                            },
                            {
                                type   : 'Dropdown',
                                options: [
                                    [Lang.Blocks.controller_joystick_direction_left_up,     '17'],
                                    [Lang.Blocks.controller_joystick_direction_up,          '18'],
                                    [Lang.Blocks.controller_joystick_direction_right_up,    '20'],
                                    [Lang.Blocks.controller_joystick_direction_left,        '33'],
                                    [Lang.Blocks.controller_joystick_direction_center,      '34'],
                                    [Lang.Blocks.controller_joystick_direction_right,       '36'],
                                    [Lang.Blocks.controller_joystick_direction_left_down,   '65'],
                                    [Lang.Blocks.controller_joystick_direction_down,        '66'],
                                    [Lang.Blocks.controller_joystick_direction_right_down,  '68'],
                                ],
                                value     : '34',                                          // 초기 선택항목 지정
                                fontSize  : 11,
                                bgColor   : EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter : Entry.block.converters.returnStringValue,
                            },
                        ],
                    },
                ],
            },
        },





        robolink_codrone_edu_light_manual_single_off: {
            color     : EntryStatic.colorSet.block.default.HARDWARE,
            outerLine : EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton  : 'basic',
            statements: [],
            params    : [
                {
                    type   : 'Dropdown',
                    options: [
                        [Lang.Blocks.common_drone, '0x10'],
                        [Lang.Blocks.common_controller, '0x20'],
                    ],
                    value     : '0x20',
                    fontSize  : 11,
                    bgColor   : EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                { type: 'Indicator', img: 'block_icon/hardware_icon.svg', size: 12 }
            ],
            events: {},
            def   : {
                params: [null, null],
                type  : 'robolink_codrone_edu_light_manual_single_off',
            },
            paramsKeyMap: {
                TARGET: 0
            },
            class   : 'light',
            isNotFor: ['robolink_codrone_edu'],
            func(sprite, script)
            {
                const target = parseInt(script.getStringValue('TARGET'));
                return Entry.robolink_base.setLightManual(script, target, 0xffff, 0);
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax    : 'LED_off(%1)',
                        textParams: [
                            {
                                type   : 'Dropdown',
                                options: [
                                    [Lang.Blocks.common_drone, '0x10'],
                                    [Lang.Blocks.common_controller, '0x20'],
                                ],
                                value     : '0x20',
                                fontSize  : 11,
                                bgColor   : EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter : Entry.block.converters.returnStringValue,
                            },
                        ],
                    },
                ],
            },
        },

        robolink_codrone_edu_light_color_preset: {
            color     : EntryStatic.colorSet.block.default.HARDWARE,
            outerLine : EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton  : 'basic',
            statements: [],
            params    : [
                {
                    type   : 'Dropdown',
                    options: [
                        [Lang.Blocks.common_drone, '0x10'],
                        [Lang.Blocks.common_controller, '0x20'],
                    ],
                    value     : '0x20',
                    fontSize  : 11,
                    bgColor   : EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type   : 'Dropdown',
                    options: [
                        [Lang.Blocks.common_light_color_red,            'red'],
                        [Lang.Blocks.common_light_color_green,          'green'],
                        [Lang.Blocks.common_light_color_blue,           'blue'],
                        [Lang.Blocks.common_light_color_yellow,         'yellow'],
                        [Lang.Blocks.common_light_color_magenta,        'magenta'],
                        [Lang.Blocks.common_light_color_cyan,           'cyan'],
                        [Lang.Blocks.common_light_color_white,          'white'],
                        [Lang.Blocks.common_light_color_sunset,         'sunset'],
                        [Lang.Blocks.common_light_color_cottoncandy,    'cottonCandy'],
                        [Lang.Blocks.common_light_color_muscat,         'muscat'],
                        [Lang.Blocks.common_light_color_strawberrymilk, 'strawberryMilk'],
                        [Lang.Blocks.common_light_color_emerald,        'emerald'],
                        [Lang.Blocks.common_light_color_lavender,       'lavender'],
                    ],
                    value     : 'red',
                    fontSize  : 11,
                    bgColor   : EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type   : 'Dropdown',
                    options: [
                        [Lang.Blocks.common_light_brightness_on,    '220'],
                        [Lang.Blocks.common_light_brightness_off,   '0'],
                        [Lang.Blocks.common_light_brightness_b25,   '75'],
                        [Lang.Blocks.common_light_brightness_b50,   '125'],
                        [Lang.Blocks.common_light_brightness_b75,   '200'],
                        [Lang.Blocks.common_light_brightness_b100,  '255'],
                    ],
                    value     : '220',
                    fontSize  : 11,
                    bgColor   : EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                { type: 'Indicator', img: 'block_icon/hardware_icon.svg', size: 12 },
            ],
            events: {},
            def   : {
                params: [null, null, null, null],
                type  : 'robolink_codrone_edu_light_color_preset',
            },
            paramsKeyMap: {
                TARGET    : 0,
                COLOR     : 1,
                BRIGHTNESS: 2,
            },
            class   : 'light',
            isNotFor: ['robolink_codrone_edu'],
            func(sprite, script)
            {
                const mode        = 0x22;
                const interval    = parseInt(script.getField('BRIGHTNESS'), 10);
                const colorString = script.getField('COLOR');
                const target = parseInt(script.getStringValue('TARGET'));
                //return Entry.robolink_base.setLightModeColorString(script, target, mode, interval, colorString);
                return Entry.robolink_base.setLightModeColorString(script, target, mode, interval, colorString);
            },
            
            syntax: {
                js: [],
                py: [
                    {
                        syntax    : 'Drone.light_color_preset(%1, %2, %3)',
                        textParams: [
                            {
                                type   : 'Dropdown',
                                options: [
                                    [Lang.Blocks.common_drone, '0x10'],
                                    [Lang.Blocks.common_controller, '0x20'],
                                ],
                                value     : '0x20',
                                fontSize  : 11,
                                bgColor   : EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                            },
                            {
                                type   : 'Dropdown',
                                options: [
                                    [Lang.Blocks.common_light_color_red,            'red'],
                                    [Lang.Blocks.common_light_color_green,          'green'],
                                    [Lang.Blocks.common_light_color_blue,           'blue'],
                                    [Lang.Blocks.common_light_color_yellow,         'yellow'],
                                    [Lang.Blocks.common_light_color_magenta,        'magenta'],
                                    [Lang.Blocks.common_light_color_cyan,           'cyan'],
                                    [Lang.Blocks.common_light_color_white,          'white'],
                                    [Lang.Blocks.common_light_color_sunset,         'sunset'],
                                    [Lang.Blocks.common_light_color_cottoncandy,    'cottonCandy'],
                                    [Lang.Blocks.common_light_color_muscat,         'muscat'],
                                    [Lang.Blocks.common_light_color_strawberrymilk, 'strawberryMilk'],
                                    [Lang.Blocks.common_light_color_emerald,        'emerald'],
                                    [Lang.Blocks.common_light_color_lavender,       'lavender'],
                                ],
                                value     : 'red',
                                fontSize  : 11,
                                bgColor   : EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter : Entry.block.converters.returnStringValue,
                            },
                            {
                                type   : 'Dropdown',
                                options: [
                                    [Lang.Blocks.common_light_brightness_on,    '220'],
                                    [Lang.Blocks.common_light_brightness_off,   '0'],
                                    [Lang.Blocks.common_light_brightness_b25,   '75'],
                                    [Lang.Blocks.common_light_brightness_b50,   '125'],
                                    [Lang.Blocks.common_light_brightness_b75,   '200'],
                                    [Lang.Blocks.common_light_brightness_b100,  '255'],
                                ],
                                value     : '220',
                                fontSize  : 11,
                                bgColor   : EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter : Entry.block.converters.returnStringValue,
                            },
                        ],
                    },
                ],
            },            
        },

        robolink_codrone_edu_light_manual_single_input: {
            color     : EntryStatic.colorSet.block.default.HARDWARE,
            outerLine : EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton  : 'basic',
            statements: [],
            params    : [
                {
                    type   : 'Dropdown',
                    options: [
                        [Lang.Blocks.common_drone, '0x10'],
                        [Lang.Blocks.common_controller, '0x20'],
                    ],
                    value     : '0x20',
                    fontSize  : 11,
                    bgColor   : EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                { type: 'Block', accept: 'string' },
                { type: 'Block', accept: 'string' },
                { type: 'Indicator', img: 'block_icon/hardware_icon.svg', size: 12 },
            ],
            events: {},
            def   : {
                params: [
                    null,
                    { type: 'text', params: ['0x07'] },
                    { type: 'text', params: ['255'] },
                    null,
                ],
                type: 'robolink_codrone_edu_light_manual_single_input',
            },
            paramsKeyMap: {
                TARGET    : 0,
                FLAGS     : 1,
                BRIGHTNESS: 2,
            },
            class   : 'light',
            isNotFor: ['robolink_codrone_edu'],
            func(sprite, script)
            {
                const flags      = parseInt(script.getStringValue('FLAGS'));
                const brightness = script.getNumberValue('BRIGHTNESS');
                const target = parseInt(script.getStringValue('TARGET'));
                return Entry.robolink_base.setLightManual(script, target, flags, brightness);
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax    : 'light_color_manual(%1, %2, %3)',
                        textParams: [
                            {
                                type   : 'Dropdown',
                                options: [
                                    [Lang.Blocks.common_drone, '0x10'],
                                    [Lang.Blocks.common_controller, '0x20'],
                                ],
                                value     : '0x20',
                                fontSize  : 11,
                                bgColor   : EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                            },
                            {
                                type  : 'Block',
                                accept: 'string',
                            },
                            {
                                type  : 'Block',
                                accept: 'string',
                            },
                        ],
                    },
                ],
            },
        },

        robolink_codrone_edu_light_color_input: {
            color     : EntryStatic.colorSet.block.default.HARDWARE,
            outerLine : EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton  : 'basic',
            statements: [],
            params    : [
                {
                    type   : 'Dropdown',
                    options: [
                        [Lang.Blocks.common_drone, '0x10'],
                        [Lang.Blocks.common_controller, '0x20'],
                    ],
                    value     : '0x20',
                    fontSize  : 11,
                    bgColor   : EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                { type: 'Block', accept: 'string' },
                { type: 'Block', accept: 'string' },
                { type: 'Block', accept: 'string' },
                {
                    type   : 'Dropdown',
                    options: [
                        [Lang.Blocks.common_light_mode_hold,            '2'],   // BodyHold            = 0x22
                        [Lang.Blocks.common_light_mode_flicker,         '3'],   // BodyFlicker         = 0x23
                        [Lang.Blocks.common_light_mode_flicker_double,  '4'],   // BodyFlickerDouble   = 0x24
                        [Lang.Blocks.common_light_mode_dimming,         '5'],   // BodyDimming         = 0x25
                        [Lang.Blocks.common_light_mode_sunrise,         '6'],   // BodyS8unrise        = 0x26
                        [Lang.Blocks.common_light_mode_sunset,          '7'],   // BodySunset          = 0x27
                        [Lang.Blocks.common_light_mode_rainbow,         '8'],   // BodyRainbow         = 0x28
                        [Lang.Blocks.common_light_mode_rainbow2,        '9'],   // BodyRainbow2        = 0x29
                    ],
                    value     : '2',
                    fontSize  : 11,
                    bgColor   : EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                { type: 'Block', accept: 'string' },
                { type: 'Indicator', img: 'block_icon/hardware_icon.svg', size: 12 },
            ],
            events: {},
            def   : {
                params: [
                    null,
                    { type: 'text', params: ['255'] },
                    { type: 'text', params: ['255'] },
                    { type: 'text', params: ['255'] },
                    null,
                    { type: 'text', params: ['250'] },
                    null,
                ],
                type: 'robolink_codrone_edu_light_color_input',
            },
            paramsKeyMap: {
                TARGET  : 0,
                RED     : 1,
                GREEN   : 2,
                BLUE    : 3,
                MODE    : 4,
                INTERVAL: 5,
            },
            class   : 'light',
            isNotFor: ['robolink_codrone_edu'],
            func(sprite, script)
            {
                const mode     = 0x20 + parseInt(script.getField('MODE'), 10);
                const interval = script.getNumberValue('INTERVAL');
                const red      = script.getNumberValue('RED');
                const green    = script.getNumberValue('GREEN');
                const blue     = script.getNumberValue('BLUE');
                const target = parseInt(script.getStringValue('TARGET'));
                return Entry.robolink_base.setLightModeColor(script, target, mode, interval, red, green, blue);
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax    : 'light_color_input(%1, %2, %3, %4, %5, %6)',
                        textParams: [
                            {
                                type   : 'Dropdown',
                                options: [
                                    [Lang.Blocks.common_drone, '0x10'],
                                    [Lang.Blocks.common_controller, '0x20'],
                                ],
                                value     : '0x20',
                                fontSize  : 11,
                                bgColor   : EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                            },
                            {
                                type  : 'Block',
                                accept: 'string',
                            },
                            {
                                type  : 'Block',
                                accept: 'string',
                            },
                            {
                                type  : 'Block',
                                accept: 'string',
                            },
                            {
                                type   : 'Dropdown',
                                options: [
                                    [Lang.Blocks.common_light_mode_hold,            '2'],   // BodyHold            = 0x22
                                    [Lang.Blocks.common_light_mode_flicker,         '3'],   // BodyFlicker         = 0x23
                                    [Lang.Blocks.common_light_mode_flicker_double,  '4'],   // BodyFlickerDouble   = 0x24
                                    [Lang.Blocks.common_light_mode_dimming,         '5'],   // BodyDimming         = 0x25
                                    [Lang.Blocks.common_light_mode_sunrise,         '6'],   // BodyS8unrise        = 0x26
                                    [Lang.Blocks.common_light_mode_sunset,          '7'],   // BodySunset          = 0x27
                                    [Lang.Blocks.common_light_mode_rainbow,         '8'],   // BodyRainbow         = 0x28
                                    [Lang.Blocks.common_light_mode_rainbow2,        '9'],   // BodyRainbow2        = 0x29
                                ],
                                value     : '2',
                                fontSize  : 11,
                                bgColor   : EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter : Entry.block.converters.returnStringValue,
                            },
                            {
                                type  : 'Block',
                                accept: 'string',
                            },
                        ],
                    },
                ],
            },
        },

        robolink_codrone_edu_light_color_select: {
            color     : EntryStatic.colorSet.block.default.HARDWARE,
            outerLine : EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton  : 'basic',
            statements: [],
            params    : [
                {
                    type   : 'Dropdown',
                    options: [
                        [Lang.Blocks.common_drone, '0x10'],
                        [Lang.Blocks.common_controller, '0x20'],
                    ],
                    value     : '0x20',
                    fontSize  : 11,
                    bgColor   : EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type   : 'Dropdown',
                    options: [
                        [Lang.Blocks.common_light_color_red,            'red'],
                        [Lang.Blocks.common_light_color_green,          'green'],
                        [Lang.Blocks.common_light_color_blue,           'blue'],
                        [Lang.Blocks.common_light_color_yellow,         'yellow'],
                        [Lang.Blocks.common_light_color_magenta,        'magenta'],
                        [Lang.Blocks.common_light_color_cyan,           'cyan'],
                        [Lang.Blocks.common_light_color_white,          'white'],
                        [Lang.Blocks.common_light_color_sunset,         'sunset'],
                        [Lang.Blocks.common_light_color_cottoncandy,    'cottonCandy'],
                        [Lang.Blocks.common_light_color_muscat,         'muscat'],
                        [Lang.Blocks.common_light_color_strawberrymilk, 'strawberryMilk'],
                        [Lang.Blocks.common_light_color_emerald,        'emerald'],
                        [Lang.Blocks.common_light_color_lavender,       'lavender'],
                    ],
                    value     : 'red',
                    fontSize  : 11,
                    bgColor   : EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type   : 'Dropdown',
                    options: [
                        [Lang.Blocks.common_light_mode_hold,            '2'],   // BodyHold            = 0x22
                        [Lang.Blocks.common_light_mode_flicker,         '3'],   // BodyFlicker         = 0x23
                        [Lang.Blocks.common_light_mode_flicker_double,  '4'],   // BodyFlickerDouble   = 0x24
                        [Lang.Blocks.common_light_mode_dimming,         '5'],   // BodyDimming         = 0x25
                        [Lang.Blocks.common_light_mode_sunrise,         '6'],   // BodyS8unrise        = 0x26
                        [Lang.Blocks.common_light_mode_sunset,          '7'],   // BodySunset          = 0x27
                        [Lang.Blocks.common_light_mode_rainbow,         '8'],   // BodyRainbow         = 0x28
                        [Lang.Blocks.common_light_mode_rainbow2,        '9'],   // BodyRainbow2        = 0x29
                    ],
                    value     : '2',
                    fontSize  : 11,
                    bgColor   : EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                { type: 'Block', accept: 'string' },
                { type: 'Indicator', img: 'block_icon/hardware_icon.svg', size: 12 },
            ],
            events: {},
            def   : {
                params: [null, null, null, { type: 'text', params: ['250'] }, null],
                type  : 'robolink_codrone_edu_light_color_select',
            },
            paramsKeyMap: {
                TARGET  : 0,
                COLOR   : 1,
                MODE    : 2,
                INTERVAL: 3,
            },
            class   : 'light',
            isNotFor: ['robolink_codrone_edu'],
            func(sprite, script)
            {
                const mode        = 0x20 + parseInt(script.getField('MODE'), 10);
                const interval    = script.getNumberValue('INTERVAL');
                const colorString = script.getField('COLOR');
                const target = parseInt(script.getStringValue('TARGET'));
                return Entry.robolink_base.setLightModeColorString(script, target, mode, interval, colorString);
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax    : 'light_color_select(%1, %2, %3, %4)',
                        textParams: [
                            {
                                type   : 'Dropdown',
                                options: [
                                    [Lang.Blocks.common_drone, '0x10'],
                                    [Lang.Blocks.common_controller, '0x20'],
                                ],
                                value     : '0x20',
                                fontSize  : 11,
                                bgColor   : EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                            },
                            {
                                type   : 'Dropdown',
                                options: [
                                    [Lang.Blocks.common_light_color_red,            'red'],
                                    [Lang.Blocks.common_light_color_green,          'green'],
                                    [Lang.Blocks.common_light_color_blue,           'blue'],
                                    [Lang.Blocks.common_light_color_yellow,         'yellow'],
                                    [Lang.Blocks.common_light_color_magenta,        'magenta'],
                                    [Lang.Blocks.common_light_color_cyan,           'cyan'],
                                    [Lang.Blocks.common_light_color_white,          'white'],
                                    [Lang.Blocks.common_light_color_sunset,         'sunset'],
                                    [Lang.Blocks.common_light_color_cottoncandy,    'cottonCandy'],
                                    [Lang.Blocks.common_light_color_muscat,         'muscat'],
                                    [Lang.Blocks.common_light_color_strawberrymilk, 'strawberryMilk'],
                                    [Lang.Blocks.common_light_color_emerald,        'emerald'],
                                    [Lang.Blocks.common_light_color_lavender,       'lavender'],
                                ],
                                value     : 'red',
                                fontSize  : 11,
                                bgColor   : EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter : Entry.block.converters.returnStringValue,
                            },
                            {
                                type   : 'Dropdown',
                                options: [
                                    [Lang.Blocks.common_light_mode_hold,            '2'],   // BodyHold            = 0x22
                                    [Lang.Blocks.common_light_mode_flicker,         '3'],   // BodyFlicker         = 0x23
                                    [Lang.Blocks.common_light_mode_flicker_double,  '4'],   // BodyFlickerDouble   = 0x24
                                    [Lang.Blocks.common_light_mode_dimming,         '5'],   // BodyDimming         = 0x25
                                    [Lang.Blocks.common_light_mode_sunrise,         '6'],   // BodyS8unrise        = 0x26
                                    [Lang.Blocks.common_light_mode_sunset,          '7'],   // BodySunset          = 0x27
                                    [Lang.Blocks.common_light_mode_rainbow,         '8'],   // BodyRainbow         = 0x28
                                    [Lang.Blocks.common_light_mode_rainbow2,        '9'],   // BodyRainbow2        = 0x29
                                ],
                                value     : '2',
                                fontSize  : 11,
                                bgColor   : EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter : Entry.block.converters.returnStringValue,
                            },
                            {
                                type  : 'Block',
                                accept: 'string',
                            },
                        ],
                    },
                ],
            },
        },





        robolink_codrone_edu_controller_light_manual_single_off: {
            color     : EntryStatic.colorSet.block.default.HARDWARE,
            outerLine : EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton  : 'basic',
            statements: [],
            params    : [{ type: 'Indicator', img: 'block_icon/hardware_icon.svg', size: 12 }],
            events    : {},
            def       : {
                params: [null],
                type  : 'robolink_codrone_edu_controller_light_manual_single_off',
            },
            paramsKeyMap: {},
            class       : 'controller_light',
            isNotFor    : ['robolink_codrone_edu'],
            func(sprite, script)
            {
                return Entry.robolink_base.setLightManual(script, 0x20, 0xffff, 0);
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Controller.light_off()',
                    },
                ],
            },
        },        

        robolink_codrone_edu_controller_light_color_preset: {
            color     : EntryStatic.colorSet.block.default.HARDWARE,
            outerLine : EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton  : 'basic',
            statements: [],
            params    : [
                {
                    type   : 'Dropdown',
                    options: [
                        [Lang.Blocks.common_light_color_red,            'red'],
                        [Lang.Blocks.common_light_color_green,          'green'],
                        [Lang.Blocks.common_light_color_blue,           'blue'],
                        [Lang.Blocks.common_light_color_yellow,         'yellow'],
                        [Lang.Blocks.common_light_color_magenta,        'magenta'],
                        [Lang.Blocks.common_light_color_cyan,           'cyan'],
                        [Lang.Blocks.common_light_color_white,          'white'],
                        [Lang.Blocks.common_light_color_sunset,         'sunset'],
                        [Lang.Blocks.common_light_color_cottoncandy,    'cottonCandy'],
                        [Lang.Blocks.common_light_color_muscat,         'muscat'],
                        [Lang.Blocks.common_light_color_strawberrymilk, 'strawberryMilk'],
                        [Lang.Blocks.common_light_color_emerald,        'emerald'],
                        [Lang.Blocks.common_light_color_lavender,       'lavender'],
                    ],
                    value     : 'red',
                    fontSize  : 11,
                    bgColor   : EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type   : 'Dropdown',
                    options: [
                        [Lang.Blocks.common_light_brightness_on,    '220'],
                        [Lang.Blocks.common_light_brightness_off,   '0'],
                        [Lang.Blocks.common_light_brightness_b25,   '75'],
                        [Lang.Blocks.common_light_brightness_b50,   '125'],
                        [Lang.Blocks.common_light_brightness_b75,   '200'],
                        [Lang.Blocks.common_light_brightness_b100,  '255'],
                    ],
                    value     : '220',
                    fontSize  : 11,
                    bgColor   : EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                { type: 'Indicator', img: 'block_icon/hardware_icon.svg', size: 12 },
            ],
            events: {},
            def   : {
                params: [null, null, null],
                type  : 'robolink_codrone_edu_controller_light_color_preset',
            },
            paramsKeyMap: {
                COLOR     : 0,
                BRIGHTNESS: 1,
            },
            class   : 'controller_light',
            isNotFor: ['robolink_codrone_edu'],
            func(sprite, script)
            {
                const mode        = 0x22;
                const interval    = parseInt(script.getField('BRIGHTNESS'), 10);
                const colorString = script.getField('COLOR');
                return Entry.robolink_base.setLightModeColorString(script, 0x20, mode, interval, colorString);
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax    : 'Controller.light_color_preset(%1, %2)',
                        textParams: [
                            {
                                type   : 'Dropdown',
                                options: [
                                    [Lang.Blocks.common_light_color_red,            'red'],
                                    [Lang.Blocks.common_light_color_green,          'green'],
                                    [Lang.Blocks.common_light_color_blue,           'blue'],
                                    [Lang.Blocks.common_light_color_yellow,         'yellow'],
                                    [Lang.Blocks.common_light_color_magenta,        'magenta'],
                                    [Lang.Blocks.common_light_color_cyan,           'cyan'],
                                    [Lang.Blocks.common_light_color_white,          'white'],
                                    [Lang.Blocks.common_light_color_sunset,         'sunset'],
                                    [Lang.Blocks.common_light_color_cottoncandy,    'cottonCandy'],
                                    [Lang.Blocks.common_light_color_muscat,         'muscat'],
                                    [Lang.Blocks.common_light_color_strawberrymilk, 'strawberryMilk'],
                                    [Lang.Blocks.common_light_color_emerald,        'emerald'],
                                    [Lang.Blocks.common_light_color_lavender,       'lavender'],
                                ],
                                value     : 'red',
                                fontSize  : 11,
                                bgColor   : EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter : Entry.block.converters.returnStringValue,
                            },
                            {
                                type   : 'Dropdown',
                                options: [
                                    [Lang.Blocks.common_light_brightness_on,    '220'],
                                    [Lang.Blocks.common_light_brightness_off,   '0'],
                                    [Lang.Blocks.common_light_brightness_b25,   '75'],
                                    [Lang.Blocks.common_light_brightness_b50,   '125'],
                                    [Lang.Blocks.common_light_brightness_b75,   '200'],
                                    [Lang.Blocks.common_light_brightness_b100,  '255'],
                                ],
                                value     : '220',
                                fontSize  : 11,
                                bgColor   : EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter : Entry.block.converters.returnStringValue,
                            },
                        ],
                    },
                ],
            },
        },

        robolink_codrone_edu_controller_light_manual_single_input: {
            color     : EntryStatic.colorSet.block.default.HARDWARE,
            outerLine : EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton  : 'basic',
            statements: [],
            params    : [
                { type: 'Block', accept: 'string' },
                { type: 'Block', accept: 'string' },
                { type: 'Indicator', img: 'block_icon/hardware_icon.svg', size: 12 },
            ],
            events: {},
            def   : {
                params: [
                    { type: 'text', params: ['0x07'] },
                    { type: 'text', params: ['255'] },
                    null,
                ],
                type: 'robolink_codrone_edu_controller_light_manual_single_input',
            },
            paramsKeyMap: {
                FLAGS     : 0,
                BRIGHTNESS: 1,
            },
            class   : 'controller_light',
            isNotFor: ['robolink_codrone_edu'],
            func(sprite, script)
            {
                const flags      = parseInt(script.getStringValue('FLAGS'));
                const brightness = script.getNumberValue('BRIGHTNESS');
                return Entry.robolink_base.setLightManual(script, 0x20, flags, brightness);
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax    : 'Controller.light_color_manual(%1, %2)',
                        textParams: [
                            {
                                type  : 'Block',
                                accept: 'string',
                            },
                            {
                                type  : 'Block',
                                accept: 'string',
                            },
                        ],
                    },
                ],
            },
        },

        robolink_codrone_edu_controller_light_color_input: {
            color     : EntryStatic.colorSet.block.default.HARDWARE,
            outerLine : EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton  : 'basic',
            statements: [],
            params    : [
                { type: 'Block', accept: 'string' },
                { type: 'Block', accept: 'string' },
                { type: 'Block', accept: 'string' },
                {
                    type   : 'Dropdown',
                    options: [
                        [Lang.Blocks.common_light_mode_hold,            '2'],   // BodyHold            = 0x22
                        [Lang.Blocks.common_light_mode_flicker,         '3'],   // BodyFlicker         = 0x23
                        [Lang.Blocks.common_light_mode_flicker_double,  '4'],   // BodyFlickerDouble   = 0x24
                        [Lang.Blocks.common_light_mode_dimming,         '5'],   // BodyDimming         = 0x25
                        [Lang.Blocks.common_light_mode_sunrise,         '6'],   // BodyS8unrise        = 0x26
                        [Lang.Blocks.common_light_mode_sunset,          '7'],   // BodySunset          = 0x27
                        [Lang.Blocks.common_light_mode_rainbow,         '8'],   // BodyRainbow         = 0x28
                        [Lang.Blocks.common_light_mode_rainbow2,        '9'],   // BodyRainbow2        = 0x29
                    ],
                    value     : '2',
                    fontSize  : 11,
                    bgColor   : EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                { type: 'Block', accept: 'string' },
                { type: 'Indicator', img: 'block_icon/hardware_icon.svg', size: 12 },
            ],
            events: {},
            def   : {
                params: [
                    { type: 'text', params: ['255'] },
                    { type: 'text', params: ['255'] },
                    { type: 'text', params: ['255'] },
                    null,
                    { type: 'text', params: ['250'] },
                    null,
                ],
                type: 'robolink_codrone_edu_controller_light_color_input',
            },
            paramsKeyMap: {
                RED     : 0,
                GREEN   : 1,
                BLUE    : 2,
                MODE    : 3,
                INTERVAL: 4,
            },
            class   : 'controller_light',
            isNotFor: ['robolink_codrone_edu'],
            func(sprite, script)
            {
                const mode     = 0x20 + parseInt(script.getField('MODE'), 10);
                const interval = script.getNumberValue('INTERVAL');
                const red      = script.getNumberValue('RED');
                const green    = script.getNumberValue('GREEN');
                const blue     = script.getNumberValue('BLUE');
                return Entry.robolink_base.setLightModeColor(script, 0x20, mode, interval, red, green, blue);
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax    : 'Controller.light_color_input(%1, %2, %3, %4, %5)',
                        textParams: [
                            {
                                type  : 'Block',
                                accept: 'string',
                            },
                            {
                                type  : 'Block',
                                accept: 'string',
                            },
                            {
                                type  : 'Block',
                                accept: 'string',
                            },
                            {
                                type   : 'Dropdown',
                                options: [
                                    [Lang.Blocks.common_light_mode_hold,            '2'],   // BodyHold            = 0x22
                                    [Lang.Blocks.common_light_mode_flicker,         '3'],   // BodyFlicker         = 0x23
                                    [Lang.Blocks.common_light_mode_flicker_double,  '4'],   // BodyFlickerDouble   = 0x24
                                    [Lang.Blocks.common_light_mode_dimming,         '5'],   // BodyDimming         = 0x25
                                    [Lang.Blocks.common_light_mode_sunrise,         '6'],   // BodyS8unrise        = 0x26
                                    [Lang.Blocks.common_light_mode_sunset,          '7'],   // BodySunset          = 0x27
                                    [Lang.Blocks.common_light_mode_rainbow,         '8'],   // BodyRainbow         = 0x28
                                    [Lang.Blocks.common_light_mode_rainbow2,        '9'],   // BodyRainbow2        = 0x29
                                ],
                                value     : '2',
                                fontSize  : 11,
                                bgColor   : EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter : Entry.block.converters.returnStringValue,
                            },
                            {
                                type  : 'Block',
                                accept: 'string',
                            },
                        ],
                    },
                ],
            },
        },

        robolink_codrone_edu_controller_light_color_select: {
            color     : EntryStatic.colorSet.block.default.HARDWARE,
            outerLine : EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton  : 'basic',
            statements: [],
            params    : [
                {
                    type   : 'Dropdown',
                    options: [
                        [Lang.Blocks.common_light_color_red,            'red'],
                        [Lang.Blocks.common_light_color_green,          'green'],
                        [Lang.Blocks.common_light_color_blue,           'blue'],
                        [Lang.Blocks.common_light_color_yellow,         'yellow'],
                        [Lang.Blocks.common_light_color_magenta,        'magenta'],
                        [Lang.Blocks.common_light_color_cyan,           'cyan'],
                        [Lang.Blocks.common_light_color_white,          'white'],
                        [Lang.Blocks.common_light_color_sunset,         'sunset'],
                        [Lang.Blocks.common_light_color_cottoncandy,    'cottonCandy'],
                        [Lang.Blocks.common_light_color_muscat,         'muscat'],
                        [Lang.Blocks.common_light_color_strawberrymilk, 'strawberryMilk'],
                        [Lang.Blocks.common_light_color_emerald,        'emerald'],
                        [Lang.Blocks.common_light_color_lavender,       'lavender'],
                    ],
                    value     : 'red',
                    fontSize  : 11,
                    bgColor   : EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type   : 'Dropdown',
                    options: [
                        [Lang.Blocks.common_light_mode_hold,            '2'],   // BodyHold            = 0x22
                        [Lang.Blocks.common_light_mode_flicker,         '3'],   // BodyFlicker         = 0x23
                        [Lang.Blocks.common_light_mode_flicker_double,  '4'],   // BodyFlickerDouble   = 0x24
                        [Lang.Blocks.common_light_mode_dimming,         '5'],   // BodyDimming         = 0x25
                        [Lang.Blocks.common_light_mode_sunrise,         '6'],   // BodyS8unrise        = 0x26
                        [Lang.Blocks.common_light_mode_sunset,          '7'],   // BodySunset          = 0x27
                        [Lang.Blocks.common_light_mode_rainbow,         '8'],   // BodyRainbow         = 0x28
                        [Lang.Blocks.common_light_mode_rainbow2,        '9'],   // BodyRainbow2        = 0x29
                    ],
                    value     : '2',
                    fontSize  : 11,
                    bgColor   : EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                { type: 'Block', accept: 'string' },
                { type: 'Indicator', img: 'block_icon/hardware_icon.svg', size: 12 },
            ],
            events: {},
            def   : {
                params: [null, null, { type: 'text', params: ['250'] }, null],
                type  : 'robolink_codrone_edu_controller_light_color_select',
            },
            paramsKeyMap: {
                COLOR   : 0,
                MODE    : 1,
                INTERVAL: 2,
            },
            class   : 'controller_light',
            isNotFor: ['robolink_codrone_edu'],
            func(sprite, script)
            {
                const mode        = 0x20 + parseInt(script.getField('MODE'), 10);
                const interval    = script.getNumberValue('INTERVAL');
                const colorString = script.getField('COLOR');
                return Entry.robolink_base.setLightModeColorString(script, 0x20, mode, interval, colorString);
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax    : 'Controller.light_color_select(%1, %2, %3)',
                        textParams: [
                            {
                                type   : 'Dropdown',
                                options: [
                                    [Lang.Blocks.common_light_color_red,            'red'],
                                    [Lang.Blocks.common_light_color_green,          'green'],
                                    [Lang.Blocks.common_light_color_blue,           'blue'],
                                    [Lang.Blocks.common_light_color_yellow,         'yellow'],
                                    [Lang.Blocks.common_light_color_magenta,        'magenta'],
                                    [Lang.Blocks.common_light_color_cyan,           'cyan'],
                                    [Lang.Blocks.common_light_color_white,          'white'],
                                    [Lang.Blocks.common_light_color_sunset,         'sunset'],
                                    [Lang.Blocks.common_light_color_cottoncandy,    'cottonCandy'],
                                    [Lang.Blocks.common_light_color_muscat,         'muscat'],
                                    [Lang.Blocks.common_light_color_strawberrymilk, 'strawberryMilk'],
                                    [Lang.Blocks.common_light_color_emerald,        'emerald'],
                                    [Lang.Blocks.common_light_color_lavender,       'lavender'],
                                ],
                                value     : 'red',
                                fontSize  : 11,
                                bgColor   : EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter : Entry.block.converters.returnStringValue,
                            },
                            {
                                type   : 'Dropdown',
                                options: [
                                    [Lang.Blocks.common_light_mode_hold,            '2'],   // BodyHold            = 0x22
                                    [Lang.Blocks.common_light_mode_flicker,         '3'],   // BodyFlicker         = 0x23
                                    [Lang.Blocks.common_light_mode_flicker_double,  '4'],   // BodyFlickerDouble   = 0x24
                                    [Lang.Blocks.common_light_mode_dimming,         '5'],   // BodyDimming         = 0x25
                                    [Lang.Blocks.common_light_mode_sunrise,         '6'],   // BodyS8unrise        = 0x26
                                    [Lang.Blocks.common_light_mode_sunset,          '7'],   // BodySunset          = 0x27
                                    [Lang.Blocks.common_light_mode_rainbow,         '8'],   // BodyRainbow         = 0x28
                                    [Lang.Blocks.common_light_mode_rainbow2,        '9'],   // BodyRainbow2        = 0x29
                                ],
                                value     : '2',
                                fontSize  : 11,
                                bgColor   : EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter : Entry.block.converters.returnStringValue,
                            },
                            {
                                type  : 'Block',
                                accept: 'string',
                            },
                        ],
                    },
                ],
            },
        },

        robolink_codrone_edu_drone_light_manual_single_off: {
            color     : EntryStatic.colorSet.block.default.HARDWARE,
            outerLine : EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton  : 'basic',
            statements: [],
            params    : [{ type: 'Indicator', img: 'block_icon/hardware_icon.svg', size: 12 }],
            events    : {},
            def       : {
                params: [null],
                type  : 'robolink_codrone_edu_drone_light_manual_single_off',
            },
            paramsKeyMap: {},
            class       : 'drone_light',
            isNotFor    : ['robolink_codrone_edu'],
            func(sprite, script)
            {
                return Entry.robolink_base.setLightManual(script, 0x10, 0xff, 0);
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Drone.light_off()',
                    },
                ],
            },
        },

        robolink_codrone_edu_drone_light_color_preset: {
            color     : EntryStatic.colorSet.block.default.HARDWARE,
            outerLine : EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton  : 'basic',
            statements: [],
            params    : [
                {
                    type   : 'Dropdown',
                    options: [
                        [Lang.Blocks.common_light_color_red,            'red'],
                        [Lang.Blocks.common_light_color_green,          'green'],
                        [Lang.Blocks.common_light_color_blue,           'blue'],
                        [Lang.Blocks.common_light_color_yellow,         'yellow'],
                        [Lang.Blocks.common_light_color_magenta,        'magenta'],
                        [Lang.Blocks.common_light_color_cyan,           'cyan'],
                        [Lang.Blocks.common_light_color_white,          'white'],
                        [Lang.Blocks.common_light_color_sunset,         'sunset'],
                        [Lang.Blocks.common_light_color_cottoncandy,    'cottonCandy'],
                        [Lang.Blocks.common_light_color_muscat,         'muscat'],
                        [Lang.Blocks.common_light_color_strawberrymilk, 'strawberryMilk'],
                        [Lang.Blocks.common_light_color_emerald,        'emerald'],
                        [Lang.Blocks.common_light_color_lavender,       'lavender'],
                    ],
                    value     : 'red',
                    fontSize  : 11,
                    bgColor   : EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type   : 'Dropdown',
                    options: [
                        [Lang.Blocks.common_light_brightness_on,    '220'],
                        [Lang.Blocks.common_light_brightness_off,   '0'],
                        [Lang.Blocks.common_light_brightness_b25,   '75'],
                        [Lang.Blocks.common_light_brightness_b50,   '125'],
                        [Lang.Blocks.common_light_brightness_b75,   '200'],
                        [Lang.Blocks.common_light_brightness_b100,  '255'],
                    ],
                    value     : '220',
                    fontSize  : 11,
                    bgColor   : EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                { type: 'Indicator', img: 'block_icon/hardware_icon.svg', size: 12 },
            ],
            events: {},
            def   : {
                params: [null, null, null],
                type  : 'robolink_codrone_edu_drone_light_color_preset',
            },
            paramsKeyMap: {
                COLOR     : 0,
                BRIGHTNESS: 1,
            },
            class   : 'drone_light',
            isNotFor: ['robolink_codrone_edu'],
            func(sprite, script)
            {
                const mode        = 0x22;
                const interval    = parseInt(script.getField('BRIGHTNESS'), 10);
                const colorString = script.getField('COLOR');
                return Entry.robolink_base.setLightModeColorString(script, 0x10, mode, interval, colorString);
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax    : 'Drone.light_color_preset(%1, %2)',
                        textParams: [
                            {
                                type   : 'Dropdown',
                                options: [
                                    [Lang.Blocks.common_light_color_red,            'red'],
                                    [Lang.Blocks.common_light_color_green,          'green'],
                                    [Lang.Blocks.common_light_color_blue,           'blue'],
                                    [Lang.Blocks.common_light_color_yellow,         'yellow'],
                                    [Lang.Blocks.common_light_color_magenta,        'magenta'],
                                    [Lang.Blocks.common_light_color_cyan,           'cyan'],
                                    [Lang.Blocks.common_light_color_white,          'white'],
                                    [Lang.Blocks.common_light_color_sunset,         'sunset'],
                                    [Lang.Blocks.common_light_color_cottoncandy,    'cottonCandy'],
                                    [Lang.Blocks.common_light_color_muscat,         'muscat'],
                                    [Lang.Blocks.common_light_color_strawberrymilk, 'strawberryMilk'],
                                    [Lang.Blocks.common_light_color_emerald,        'emerald'],
                                    [Lang.Blocks.common_light_color_lavender,       'lavender'],
                                ],
                                value     : 'red',
                                fontSize  : 11,
                                bgColor   : EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter : Entry.block.converters.returnStringValue,
                            },
                            {
                                type   : 'Dropdown',
                                options: [
                                    [Lang.Blocks.common_light_brightness_on,    '220'],
                                    [Lang.Blocks.common_light_brightness_off,   '0'],
                                    [Lang.Blocks.common_light_brightness_b25,   '75'],
                                    [Lang.Blocks.common_light_brightness_b50,   '125'],
                                    [Lang.Blocks.common_light_brightness_b75,   '200'],
                                    [Lang.Blocks.common_light_brightness_b100,  '255'],
                                ],
                                value     : '200',
                                fontSize  : 11,
                                bgColor   : EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter : Entry.block.converters.returnStringValue,
                            },
                        ],
                    },
                ],
            },
        },

        robolink_codrone_edu_drone_light_manual_single_input: {
            color     : EntryStatic.colorSet.block.default.HARDWARE,
            outerLine : EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton  : 'basic',
            statements: [],
            params    : [
                { type: 'Block', accept: 'string' },
                { type: 'Block', accept: 'string' },
                { type: 'Indicator', img: 'block_icon/hardware_icon.svg', size: 12 },
            ],
            events: {},
            def   : {
                params: [
                    { type: 'text', params: ['0x3F'] },
                    { type: 'text', params: ['255'] },
                    null,
                ],
                type: 'robolink_codrone_edu_drone_light_manual_single_input',
            },
            paramsKeyMap: {
                FLAGS     : 0,
                BRIGHTNESS: 1,
            },
            class   : 'drone_light',
            isNotFor: ['robolink_codrone_edu'],
            func(sprite, script)
            {
                const flags      = parseInt(script.getStringValue('FLAGS'));
                const brightness = script.getNumberValue('BRIGHTNESS');
                return Entry.robolink_base.setLightManual(script, 0x10, flags, brightness);
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax    : 'Drone.light_color_manual(%1, %2)',
                        textParams: [
                            {
                                type  : 'Block',
                                accept: 'string',
                            },
                            {
                                type  : 'Block',
                                accept: 'string',
                            },
                        ],
                    },
                ],
            },
        },

        robolink_codrone_edu_drone_light_color_input: {
            color     : EntryStatic.colorSet.block.default.HARDWARE,
            outerLine : EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton  : 'basic',
            statements: [],
            params    : [
                { type: 'Block', accept: 'string' },
                { type: 'Block', accept: 'string' },
                { type: 'Block', accept: 'string' },
                {
                    type   : 'Dropdown',
                    options: [
                        [Lang.Blocks.common_light_mode_hold,            '2'],   // BodyHold            = 0x22
                        [Lang.Blocks.common_light_mode_flicker,         '3'],   // BodyFlicker         = 0x23
                        [Lang.Blocks.common_light_mode_flicker_double,  '4'],   // BodyFlickerDouble   = 0x24
                        [Lang.Blocks.common_light_mode_dimming,         '5'],   // BodyDimming         = 0x25
                        [Lang.Blocks.common_light_mode_sunrise,         '6'],   // BodyS8unrise        = 0x26
                        [Lang.Blocks.common_light_mode_sunset,          '7'],   // BodySunset          = 0x27
                        [Lang.Blocks.common_light_mode_rainbow,         '8'],   // BodyRainbow         = 0x28
                        [Lang.Blocks.common_light_mode_rainbow2,        '9'],   // BodyRainbow2        = 0x29
                    ],
                    value     : '2',
                    fontSize  : 11,
                    bgColor   : EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                { type: 'Block', accept: 'string' },
                { type: 'Indicator', img: 'block_icon/hardware_icon.svg', size: 12 },
            ],
            events: {},
            def   : {
                params: [
                    { type: 'text', params: ['255'] },
                    { type: 'text', params: ['255'] },
                    { type: 'text', params: ['255'] },
                    null,
                    { type: 'text', params: ['250'] },
                    null,
                ],
                type: 'robolink_codrone_edu_drone_light_color_input',
            },
            paramsKeyMap: {
                RED     : 0,
                GREEN   : 1,
                BLUE    : 2,
                MODE    : 3,
                INTERVAL: 4,
            },
            class   : 'drone_light',
            isNotFor: ['robolink_codrone_edu'],
            func(sprite, script)
            {
                const mode     = 0x20 + parseInt(script.getField('MODE'), 10);
                const red      = script.getNumberValue('RED');
                const green    = script.getNumberValue('GREEN');
                const blue     = script.getNumberValue('BLUE');
                const interval = script.getNumberValue('INTERVAL');
                return Entry.robolink_base.setLightModeColor(script, 0x10, mode, interval, red, green, blue);
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax    : 'Drone.light_color_input(%1, %2, %3, %4, %5)',
                        textParams: [
                            {
                                type  : 'Block',
                                accept: 'string',
                            },
                            {
                                type  : 'Block',
                                accept: 'string',
                            },
                            {
                                type  : 'Block',
                                accept: 'string',
                            },
                            {
                                type   : 'Dropdown',
                                options: [
                                    [Lang.Blocks.common_light_mode_hold,            '2'],   // BodyHold            = 0x22
                                    [Lang.Blocks.common_light_mode_flicker,         '3'],   // BodyFlicker         = 0x23
                                    [Lang.Blocks.common_light_mode_flicker_double,  '4'],   // BodyFlickerDouble   = 0x24
                                    [Lang.Blocks.common_light_mode_dimming,         '5'],   // BodyDimming         = 0x25
                                    [Lang.Blocks.common_light_mode_sunrise,         '6'],   // BodyS8unrise        = 0x26
                                    [Lang.Blocks.common_light_mode_sunset,          '7'],   // BodySunset          = 0x27
                                    [Lang.Blocks.common_light_mode_rainbow,         '8'],   // BodyRainbow         = 0x28
                                    [Lang.Blocks.common_light_mode_rainbow2,        '9'],   // BodyRainbow2        = 0x29
                                ],
                                value     : '2',
                                fontSize  : 11,
                                bgColor   : EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter : Entry.block.converters.returnStringValue,
                            },
                            {
                                type  : 'Block',
                                accept: 'string',
                            },
                        ],
                    },
                ],
            },
        },

        robolink_codrone_edu_drone_light_color_select: {
            color     : EntryStatic.colorSet.block.default.HARDWARE,
            outerLine : EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton  : 'basic',
            statements: [],
            params    : [
                {
                    type   : 'Dropdown',
                    options: [
                        [Lang.Blocks.common_light_color_red,            'red'],
                        [Lang.Blocks.common_light_color_green,          'green'],
                        [Lang.Blocks.common_light_color_blue,           'blue'],
                        [Lang.Blocks.common_light_color_yellow,         'yellow'],
                        [Lang.Blocks.common_light_color_magenta,        'magenta'],
                        [Lang.Blocks.common_light_color_cyan,           'cyan'],
                        [Lang.Blocks.common_light_color_white,          'white'],
                        [Lang.Blocks.common_light_color_sunset,         'sunset'],
                        [Lang.Blocks.common_light_color_cottoncandy,    'cottonCandy'],
                        [Lang.Blocks.common_light_color_muscat,         'muscat'],
                        [Lang.Blocks.common_light_color_strawberrymilk, 'strawberryMilk'],
                        [Lang.Blocks.common_light_color_emerald,        'emerald'],
                        [Lang.Blocks.common_light_color_lavender,       'lavender'],
                    ],
                    value     : 'red',
                    fontSize  : 11,
                    bgColor   : EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type   : 'Dropdown',
                    options: [
                        [Lang.Blocks.common_light_mode_hold,            '2'],   // BodyHold            = 0x22
                        [Lang.Blocks.common_light_mode_flicker,         '3'],   // BodyFlicker         = 0x23
                        [Lang.Blocks.common_light_mode_flicker_double,  '4'],   // BodyFlickerDouble   = 0x24
                        [Lang.Blocks.common_light_mode_dimming,         '5'],   // BodyDimming         = 0x25
                        [Lang.Blocks.common_light_mode_sunrise,         '6'],   // BodyS8unrise        = 0x26
                        [Lang.Blocks.common_light_mode_sunset,          '7'],   // BodySunset          = 0x27
                        [Lang.Blocks.common_light_mode_rainbow,         '8'],   // BodyRainbow         = 0x28
                        [Lang.Blocks.common_light_mode_rainbow2,        '9'],   // BodyRainbow2        = 0x29
                    ],
                    value     : '2',
                    fontSize  : 11,
                    bgColor   : EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                { type: 'Block', accept: 'string' },
                { type: 'Indicator', img: 'block_icon/hardware_icon.svg', size: 12 },
            ],
            events: {},
            def   : {
                params: [null, null, { type: 'text', params: ['250'] }, null],
                type  : 'robolink_codrone_edu_drone_light_color_select',
            },
            paramsKeyMap: {
                COLOR   : 0,
                MODE    : 1,
                INTERVAL: 2,
            },
            class   : 'drone_light',
            isNotFor: ['robolink_codrone_edu'],
            func(sprite, script)
            {
                const mode        = 0x20 + parseInt(script.getField('MODE'), 10);
                const interval    = script.getNumberValue('INTERVAL');
                const colorString = script.getField('COLOR');
                return Entry.robolink_base.setLightModeColorString(script, 0x10, mode, interval, colorString);
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax    : 'Drone.light_color_select(%1, %2, %3)',
                        textParams: [
                            {
                                type   : 'Dropdown',
                                options: [
                                    [Lang.Blocks.common_light_color_red,            'red'],
                                    [Lang.Blocks.common_light_color_green,          'green'],
                                    [Lang.Blocks.common_light_color_blue,           'blue'],
                                    [Lang.Blocks.common_light_color_yellow,         'yellow'],
                                    [Lang.Blocks.common_light_color_magenta,        'magenta'],
                                    [Lang.Blocks.common_light_color_cyan,           'cyan'],
                                    [Lang.Blocks.common_light_color_white,          'white'],
                                    [Lang.Blocks.common_light_color_sunset,         'sunset'],
                                    [Lang.Blocks.common_light_color_cottoncandy,    'cottonCandy'],
                                    [Lang.Blocks.common_light_color_muscat,         'muscat'],
                                    [Lang.Blocks.common_light_color_strawberrymilk, 'strawberryMilk'],
                                    [Lang.Blocks.common_light_color_emerald,        'emerald'],
                                    [Lang.Blocks.common_light_color_lavender,       'lavender'],
                                ],
                                value     : 'red',
                                fontSize  : 11,
                                bgColor   : EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter : Entry.block.converters.returnStringValue,
                            },
                            {
                                type   : 'Dropdown',
                                options: [
                                    [Lang.Blocks.common_light_mode_hold,            '2'],   // BodyHold            = 0x22
                                    [Lang.Blocks.common_light_mode_flicker,         '3'],   // BodyFlicker         = 0x23
                                    [Lang.Blocks.common_light_mode_flicker_double,  '4'],   // BodyFlickerDouble   = 0x24
                                    [Lang.Blocks.common_light_mode_dimming,         '5'],   // BodyDimming         = 0x25
                                    [Lang.Blocks.common_light_mode_sunrise,         '6'],   // BodyS8unrise        = 0x26
                                    [Lang.Blocks.common_light_mode_sunset,          '7'],   // BodySunset          = 0x27
                                    [Lang.Blocks.common_light_mode_rainbow,         '8'],   // BodyRainbow         = 0x28
                                    [Lang.Blocks.common_light_mode_rainbow2,        '9'],   // BodyRainbow2        = 0x29
                                ],
                                value     : '2',
                                fontSize  : 11,
                                bgColor   : EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter : Entry.block.converters.returnStringValue,
                            },
                            {
                                type  : 'Block',
                                accept: 'string',
                            },
                        ],
                    },
                ],
            },
        },

        robolink_codrone_edu_controller_display_clear_all: {
            color     : EntryStatic.colorSet.block.default.HARDWARE,
            outerLine : EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton  : 'basic',
            statements: [],
            params    : [
                {
                    type   : 'Dropdown',
                    options: [
                        [Lang.Blocks.controller_display_pixel_black, '0'],
                        [Lang.Blocks.controller_display_pixel_white, '1'],
                    ],
                    value     : '1',
                    fontSize  : 11,
                    bgColor   : EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                { type: 'Indicator', img: 'block_icon/hardware_icon.svg', size: 12 },
            ],
            events: {},
            def   : {
                params: [null, null],
                type  : 'robolink_codrone_edu_controller_display_clear_all',
            },
            paramsKeyMap: {
                PIXEL: 0,
            },
            class   : 'controller_display',
            isNotFor: ['robolink_codrone_edu'],
            func(sprite, script)
            {
                const pixel = parseInt(script.getField('PIXEL'), 10);
                return Entry.robolink_base.setDisplayClearAll(script, 0x20, pixel);
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax    : 'Controller.display_clear_all(%1)',
                        textParams: [
                            {
                                type   : 'Dropdown',
                                options: [
                                    [Lang.Blocks.controller_display_pixel_black, '0'],
                                    [Lang.Blocks.controller_display_pixel_white, '1'],
                                ],
                                value     : '1',
                                fontSize  : 11,
                                bgColor   : EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter : Entry.block.converters.returnStringValue,
                            },
                        ],
                    },
                ],
            },
        },

        robolink_codrone_edu_controller_display_clear: {
            color     : EntryStatic.colorSet.block.default.HARDWARE,
            outerLine : EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton  : 'basic',
            statements: [],
            params    : [
                { type: 'Block', accept: 'string' },
                { type: 'Block', accept: 'string' },
                { type: 'Block', accept: 'string' },
                { type: 'Block', accept: 'string' },
                {
                    type   : 'Dropdown',
                    options: [
                        [Lang.Blocks.controller_display_pixel_black, '0'],
                        [Lang.Blocks.controller_display_pixel_white, '1'],
                    ],
                    value     : '1',
                    fontSize  : 11,
                    bgColor   : EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                { type: 'Indicator', img: 'block_icon/hardware_icon.svg', size: 12 },
            ],
            events: {},
            def   : {
                params: [
                    { type: 'text', params: ['64'] },
                    { type: 'text', params: ['32'] },
                    { type: 'text', params: ['32'] },
                    { type: 'text', params: ['16'] },
                    null,
                    null,
                ],
                type: 'robolink_codrone_edu_controller_display_clear',
            },
            paramsKeyMap: {
                X     : 0,
                Y     : 1,
                WIDTH : 2,
                HEIGHT: 3,
                PIXEL : 4,
            },
            class   : 'controller_display',
            isNotFor: ['robolink_codrone_edu'],
            func(sprite, script)
            {
                const x      = script.getNumberValue('X');
                const y      = script.getNumberValue('Y');
                const width  = script.getNumberValue('WIDTH');
                const height = script.getNumberValue('HEIGHT');
                const pixel  = parseInt(script.getField('PIXEL'), 10);
                return Entry.robolink_base.setDisplayClear(script, 0x20, pixel, x, y, width, height);
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax    : 'Controller.display_clear(%1, %2, %3, %4, %5)',
                        textParams: [
                            {
                                type  : 'Block',
                                accept: 'string',
                            },
                            {
                                type  : 'Block',
                                accept: 'string',
                            },
                            {
                                type  : 'Block',
                                accept: 'string',
                            },
                            {
                                type  : 'Block',
                                accept: 'string',
                            },
                            {
                                type   : 'Dropdown',
                                options: [
                                    [Lang.Blocks.controller_display_pixel_black, '0'],
                                    [Lang.Blocks.controller_display_pixel_white, '1'],
                                ],
                                value     : '1',
                                fontSize  : 11,
                                bgColor   : EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter : Entry.block.converters.returnStringValue,
                            },
                        ],
                    },
                ],
            },
        },

        robolink_codrone_edu_controller_display_draw_point: {
            color     : EntryStatic.colorSet.block.default.HARDWARE,
            outerLine : EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton  : 'basic',
            statements: [],
            params    : [
                { type: 'Block', accept: 'string' },
                { type: 'Block', accept: 'string' },
                {
                    type   : 'Dropdown',
                    options: [
                        [Lang.Blocks.controller_display_pixel_black, '0'],
                        [Lang.Blocks.controller_display_pixel_white, '1'],
                    ],
                    value     : '0',
                    fontSize  : 11,
                    bgColor   : EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                { type: 'Indicator', img: 'block_icon/hardware_icon.svg', size: 12 },
            ],
            events: {},
            def   : {
                params: [
                    { type: 'text', params: ['64'] },
                    { type: 'text', params: ['32'] },
                    null,
                    null,
                ],
                type: 'robolink_codrone_edu_controller_display_draw_point',
            },
            paramsKeyMap: {
                X    : 0,
                Y    : 1,
                PIXEL: 2,
            },
            class   : 'controller_display',
            isNotFor: ['robolink_codrone_edu'],
            func(sprite, script)
            {
                const x     = script.getNumberValue('X');
                const y     = script.getNumberValue('Y');
                const pixel = parseInt(script.getField('PIXEL'), 10);
                return Entry.robolink_base.setDisplayDrawPoint(script, 0x20, x, y, pixel);
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax    : 'Controller.display_draw_point(%1, %2, %3)',
                        textParams: [
                            {
                                type  : 'Block',
                                accept: 'string',
                            },
                            {
                                type  : 'Block',
                                accept: 'string',
                            },
                            {
                                type   : 'Dropdown',
                                options: [
                                    [Lang.Blocks.controller_display_pixel_black, '0'],
                                    [Lang.Blocks.controller_display_pixel_white, '1'],
                                ],
                                value     : '0',
                                fontSize  : 11,
                                bgColor   : EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter : Entry.block.converters.returnStringValue,
                            },
                        ],
                    },
                ],
            },
        },

        robolink_codrone_edu_controller_display_draw_shape: {
            color     : EntryStatic.colorSet.block.default.HARDWARE,
            outerLine : EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton  : 'basic',
            statements: [],
            params    : [
                {
                    type   : 'Dropdown',
                    options: [
                        [Lang.Blocks.controller_display_shape_line, '1'],
                        [Lang.Blocks.controller_display_shape_square, '2'],
                        [Lang.Blocks.controller_display_shape_ellipse, '3'],
                    ],
                    value     : '1',
                    fontSize  : 11,
                    bgColor   : EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                { type: 'Block', accept: 'string' },
                { type: 'Block', accept: 'string' },
                { type: 'Block', accept: 'string' },
                { type: 'Block', accept: 'string' },
                {
                    type   : 'Dropdown',
                    options: [
                        [Lang.Blocks.controller_display_pixel_black, '0'],
                        [Lang.Blocks.controller_display_pixel_white, '1'],
                    ],
                    value     : '0',
                    fontSize  : 11,
                    bgColor   : EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type   : 'Dropdown',
                    options: [
                        [Lang.Blocks.controller_display_line_solid, '0'],
                        [Lang.Blocks.controller_display_line_dotted, '1'],
                        [Lang.Blocks.controller_display_line_dashed, '2'],
                    ],
                    value     : '0',
                    fontSize  : 11,
                    bgColor   : EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type   : 'Dropdown',
                    options: [
                        [Lang.Blocks.controller_display_flagfill_off, '0'],
                        [Lang.Blocks.controller_display_flagfill_on, '1'],
                    ],
                    value     : '1',
                    fontSize  : 11,
                    bgColor   : EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                

                { type: 'Indicator', img: 'block_icon/hardware_icon.svg', size: 12 },
            ],
            events: {},
            def   : {
                params: [
                    null,
                    { type: 'text', params: ['54'] },
                    { type: 'text', params: ['32'] },
                    { type: 'text', params: ['20'] },
                    { type: 'text', params: ['20'] },
                    null,
                    null,
                    null,
                    null,
                ],
                type: 'robolink_codrone_edu_controller_display_draw_shape',
            },
            paramsKeyMap: {
                SHAPE   : 0,
                X1      : 1,
                Y1      : 2,
                X2      : 3,
                Y2      : 4,
                PIXEL   : 5,
                LINE    : 6,
                FLAGFILL: 7,
            },
            class   : 'controller_display',
            isNotFor: ['robolink_codrone_edu'],
            func(sprite, script)
            {
                const shape = parseInt(script.getField('SHAPE'), 10);
                const x1    = script.getNumberValue('X1');
                const y1    = script.getNumberValue('Y1');
                const x2    = script.getNumberValue('X2');
                const y2    = script.getNumberValue('Y2');
                const pixel = parseInt(script.getField('PIXEL'), 10);
                const line  = parseInt(script.getField('LINE'), 10);
                const flagFill = parseInt(script.getField('FLAGFILL'), 10);

                if(shape == 1)
                {
                    return Entry.robolink_base.setDisplayDrawLine(script, 0x20, x1, y1, x2, y2, pixel, line);
                }
                else if(shape == 2)
                {
                    return Entry.robolink_base.setDisplayDrawRect(script, 0x20, x1, y1, x2, y2, pixel, flagFill, line);
                    //return Entry.robolink_base.setDisplayDrawRect(script, 0x20, x, y, width, height, pixel, flagFill, line);
                }
                else if(shape == 3)
                {
                    return Entry.robolink_base.setDisplayDrawCircle(script, 0x20, x1, y1, x2, pixel, flagFill);
                    //return Entry.robolink_base.setDisplayDrawCircle(script, 0x20, x, y, radius, pixel, flagFill);
                }    

            },
            /*
            syntax: {
                js: [],
                py: [
                    {
                        syntax    : 'Controller.display_draw_line(%1, %2, %3, %4, %5, %6)',
                        textParams: [
                            {
                                type  : 'Block',
                                accept: 'string',
                            },
                            {
                                type  : 'Block',
                                accept: 'string',
                            },
                            {
                                type  : 'Block',
                                accept: 'string',
                            },
                            {
                                type  : 'Block',
                                accept: 'string',
                            },
                            {
                                type   : 'Dropdown',
                                options: [
                                    [Lang.Blocks.controller_display_pixel_black, '0'],
                                    [Lang.Blocks.controller_display_pixel_white, '1'],
                                ],
                                value     : '0',
                                fontSize  : 11,
                                bgColor   : EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter : Entry.block.converters.returnStringValue,
                            },
                            {
                                type   : 'Dropdown',
                                options: [
                                    [Lang.Blocks.controller_display_line_solid, '0'],
                                    [Lang.Blocks.controller_display_line_dotted, '1'],
                                    [Lang.Blocks.controller_display_line_dashed, '2'],
                                ],
                                value     : '0',
                                fontSize  : 11,
                                bgColor   : EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter : Entry.block.converters.returnStringValue,
                            },
                        ],
                    },
                ],
            },
            */
        },

        robolink_codrone_edu_controller_display_draw_line: {
            color     : EntryStatic.colorSet.block.default.HARDWARE,
            outerLine : EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton  : 'basic',
            statements: [],
            params    : [
                { type: 'Block', accept: 'string' },
                { type: 'Block', accept: 'string' },
                { type: 'Block', accept: 'string' },
                { type: 'Block', accept: 'string' },
                {
                    type   : 'Dropdown',
                    options: [
                        [Lang.Blocks.controller_display_pixel_black, '0'],
                        [Lang.Blocks.controller_display_pixel_white, '1'],
                    ],
                    value     : '0',
                    fontSize  : 11,
                    bgColor   : EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type   : 'Dropdown',
                    options: [
                        [Lang.Blocks.controller_display_line_solid, '0'],
                        [Lang.Blocks.controller_display_line_dotted, '1'],
                        [Lang.Blocks.controller_display_line_dashed, '2'],
                    ],
                    value     : '0',
                    fontSize  : 11,
                    bgColor   : EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                { type: 'Indicator', img: 'block_icon/hardware_icon.svg', size: 12 },
            ],
            events: {},
            def   : {
                params: [
                    { type: 'text', params: ['32'] },
                    { type: 'text', params: ['16'] },
                    { type: 'text', params: ['96'] },
                    { type: 'text', params: ['48'] },
                    null,
                    null,
                    null,
                ],
                type: 'robolink_codrone_edu_controller_display_draw_line',
            },
            paramsKeyMap: {
                X1   : 0,
                Y1   : 1,
                X2   : 2,
                Y2   : 3,
                PIXEL: 4,
                LINE : 5,
            },
            class   : 'controller_display',
            isNotFor: ['robolink_codrone_edu'],
            func(sprite, script)
            {
                const x1    = script.getNumberValue('X1');
                const y1    = script.getNumberValue('Y1');
                const x2    = script.getNumberValue('X2');
                const y2    = script.getNumberValue('Y2');
                const pixel = parseInt(script.getField('PIXEL'), 10);
                const line  = parseInt(script.getField('LINE'), 10);
                return Entry.robolink_base.setDisplayDrawLine(script, 0x20, x1, y1, x2, y2, pixel, line);
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax    : 'Controller.display_draw_line(%1, %2, %3, %4, %5, %6)',
                        textParams: [
                            {
                                type  : 'Block',
                                accept: 'string',
                            },
                            {
                                type  : 'Block',
                                accept: 'string',
                            },
                            {
                                type  : 'Block',
                                accept: 'string',
                            },
                            {
                                type  : 'Block',
                                accept: 'string',
                            },
                            {
                                type   : 'Dropdown',
                                options: [
                                    [Lang.Blocks.controller_display_pixel_black, '0'],
                                    [Lang.Blocks.controller_display_pixel_white, '1'],
                                ],
                                value     : '0',
                                fontSize  : 11,
                                bgColor   : EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter : Entry.block.converters.returnStringValue,
                            },
                            {
                                type   : 'Dropdown',
                                options: [
                                    [Lang.Blocks.controller_display_line_solid, '0'],
                                    [Lang.Blocks.controller_display_line_dotted, '1'],
                                    [Lang.Blocks.controller_display_line_dashed, '2'],
                                ],
                                value     : '0',
                                fontSize  : 11,
                                bgColor   : EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter : Entry.block.converters.returnStringValue,
                            },
                        ],
                    },
                ],
            },
        },

        robolink_codrone_edu_controller_display_draw_rect: {
            color     : EntryStatic.colorSet.block.default.HARDWARE,
            outerLine : EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton  : 'basic',
            statements: [],
            params    : [
                { type: 'Block', accept: 'string' },
                { type: 'Block', accept: 'string' },
                { type: 'Block', accept: 'string' },
                { type: 'Block', accept: 'string' },
                {
                    type   : 'Dropdown',
                    options: [
                        [Lang.Blocks.controller_display_pixel_black, '0'],
                        [Lang.Blocks.controller_display_pixel_white, '1'],
                    ],
                    value     : '0',
                    fontSize  : 11,
                    bgColor   : EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type   : 'Dropdown',
                    options: [
                        [Lang.Blocks.controller_display_flagfill_off, '0'],
                        [Lang.Blocks.controller_display_flagfill_on, '1'],
                    ],
                    value     : '1',
                    fontSize  : 11,
                    bgColor   : EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type   : 'Dropdown',
                    options: [
                        [Lang.Blocks.controller_display_line_solid, '0'],
                        [Lang.Blocks.controller_display_line_dotted, '1'],
                        [Lang.Blocks.controller_display_line_dashed, '2'],
                    ],
                    value     : '2',
                    fontSize  : 11,
                    bgColor   : EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                { type: 'Indicator', img: 'block_icon/hardware_icon.svg', size: 12 },
            ],
            events: {},
            def   : {
                params: [
                    { type: 'text', params: ['64'] },
                    { type: 'text', params: ['32'] },
                    { type: 'text', params: ['32'] },
                    { type: 'text', params: ['16'] },
                    null,
                    null,
                    null,
                    null,
                ],
                type: 'robolink_codrone_edu_controller_display_draw_rect',
            },
            paramsKeyMap: {
                X       : 0,
                Y       : 1,
                WIDTH   : 2,
                HEIGHT  : 3,
                PIXEL   : 4,
                FLAGFILL: 5,
                LINE    : 6,
            },
            class   : 'controller_display',
            isNotFor: ['robolink_codrone_edu'],
            func(sprite, script)
            {
                const x        = script.getNumberValue('X');
                const y        = script.getNumberValue('Y');
                const width    = script.getNumberValue('WIDTH');
                const height   = script.getNumberValue('HEIGHT');
                const pixel    = parseInt(script.getField('PIXEL'), 10);
                const flagFill = parseInt(script.getField('FLAGFILL'), 10);
                const line     = parseInt(script.getField('LINE'), 10);
                return Entry.robolink_base.setDisplayDrawRect(script, 0x20, x, y, width, height, pixel, flagFill, line);
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax    : 'Controller.display_draw_rect(%1, %2, %3, %4, %5, %6)',
                        textParams: [
                            {
                                type  : 'Block',
                                accept: 'string',
                            },
                            {
                                type  : 'Block',
                                accept: 'string',
                            },
                            {
                                type  : 'Block',
                                accept: 'string',
                            },
                            {
                                type  : 'Block',
                                accept: 'string',
                            },
                            {
                                type   : 'Dropdown',
                                options: [
                                    [Lang.Blocks.controller_display_pixel_black, '0'],
                                    [Lang.Blocks.controller_display_pixel_white, '1'],
                                ],
                                value     : '0',
                                fontSize  : 11,
                                bgColor   : EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter : Entry.block.converters.returnStringValue,
                            },
                            {
                                type   : 'Dropdown',
                                options: [
                                    [Lang.Blocks.controller_display_flagfill_off, '0'],
                                    [Lang.Blocks.controller_display_flagfill_on, '1'],
                                ],
                                value     : '1',
                                fontSize  : 11,
                                bgColor   : EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter : Entry.block.converters.returnStringValue,
                            },
                            {
                                type   : 'Dropdown',
                                options: [
                                    [Lang.Blocks.controller_display_line_solid, '0'],
                                    [Lang.Blocks.controller_display_line_dotted, '1'],
                                    [Lang.Blocks.controller_display_line_dashed, '2'],
                                ],
                                value     : '0',
                                fontSize  : 11,
                                bgColor   : EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter : Entry.block.converters.returnStringValue,
                            },
                        ],
                    },
                ],
            },
        },

        robolink_codrone_edu_controller_display_draw_circle: {
            color     : EntryStatic.colorSet.block.default.HARDWARE,
            outerLine : EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton  : 'basic',
            statements: [],
            params    : [
                { type: 'Block', accept: 'string' },
                { type: 'Block', accept: 'string' },
                { type: 'Block', accept: 'string' },
                {
                    type   : 'Dropdown',
                    options: [
                        [Lang.Blocks.controller_display_pixel_black, '0'],
                        [Lang.Blocks.controller_display_pixel_white, '1'],
                    ],
                    value     : '0',
                    fontSize  : 11,
                    bgColor   : EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type   : 'Dropdown',
                    options: [
                        [Lang.Blocks.controller_display_flagfill_off, '0'],
                        [Lang.Blocks.controller_display_flagfill_on, '1'],
                    ],
                    value     : '1',
                    fontSize  : 11,
                    bgColor   : EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                { type: 'Indicator', img: 'block_icon/hardware_icon.svg', size: 12 },
            ],
            events: {},
            def   : {
                params: [
                    { type: 'text', params: ['64'] },
                    { type: 'text', params: ['32'] },
                    { type: 'text', params: ['24'] },
                    null,
                    null,
                    null,
                ],
                type: 'robolink_codrone_edu_controller_display_draw_circle',
            },
            paramsKeyMap: {
                X       : 0,
                Y       : 1,
                RADIUS  : 2,
                PIXEL   : 3,
                FLAGFILL: 4,
            },
            class   : 'controller_display',
            isNotFor: ['robolink_codrone_edu'],
            func(sprite, script)
            {
                const x        = script.getNumberValue('X');
                const y        = script.getNumberValue('Y');
                const radius   = script.getNumberValue('RADIUS');
                const pixel    = parseInt(script.getField('PIXEL'), 10);
                const flagFill = parseInt(script.getField('FLAGFILL'), 10);
                return Entry.robolink_base.setDisplayDrawCircle(script, 0x20, x, y, radius, pixel, flagFill);
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax    : 'Controller.display_draw_circle(%1, %2, %3, %4, %5)',
                        textParams: [
                            {
                                type  : 'Block',
                                accept: 'string',
                            },
                            {
                                type  : 'Block',
                                accept: 'string',
                            },
                            {
                                type  : 'Block',
                                accept: 'string',
                            },
                            {
                                type   : 'Dropdown',
                                options: [
                                    [Lang.Blocks.controller_display_pixel_black, '0'],
                                    [Lang.Blocks.controller_display_pixel_white, '1'],
                                ],
                                value     : '0',
                                fontSize  : 11,
                                bgColor   : EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter : Entry.block.converters.returnStringValue,
                            },
                            {
                                type   : 'Dropdown',
                                options: [
                                    [Lang.Blocks.controller_display_flagfill_off, '0'],
                                    [Lang.Blocks.controller_display_flagfill_on, '1'],
                                ],
                                value     : '1',
                                fontSize  : 11,
                                bgColor   : EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter : Entry.block.converters.returnStringValue,
                            },
                        ],
                    },
                ],
            },
        },

        robolink_codrone_edu_controller_display_draw_string: {
            color     : EntryStatic.colorSet.block.default.HARDWARE,
            outerLine : EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton  : 'basic',
            statements: [],
            params    : [
                { type: 'Block', accept: 'string' },
                { type: 'Block', accept: 'string' },
                {
                    type   : 'Dropdown',
                    options: [
                        [Lang.Blocks.controller_display_font_5x8, '0'],
                        [Lang.Blocks.controller_display_font_10x16, '1'],
                    ],
                    value     : '1',
                    fontSize  : 11,
                    bgColor   : EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type   : 'Dropdown',
                    options: [
                        [Lang.Blocks.controller_display_pixel_black, '0'],
                        [Lang.Blocks.controller_display_pixel_white, '1'],
                    ],
                    value     : '0',
                    fontSize  : 11,
                    bgColor   : EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                { type: 'Block', accept: 'string' },
                { type: 'Indicator', img: 'block_icon/hardware_icon.svg', size: 12 },
            ],
            events: {},
            def   : {
                params: [
                    { type: 'text', params: ['39'] },
                    { type: 'text', params: ['16'] },
                    null,
                    null,
                    { type: 'text', params: ['HELLO'] },
                    null,
                ],
                type: 'robolink_codrone_edu_controller_display_draw_string',
            },
            paramsKeyMap: {
                X     : 0,
                Y     : 1,
                FONT  : 2,
                PIXEL : 3,
                STRING: 4,
            },
            class   : 'controller_display',
            isNotFor: ['robolink_codrone_edu'],
            func(sprite, script)
            {
                const x      = script.getNumberValue('X');
                const y      = script.getNumberValue('Y');
                const font   = parseInt(script.getField('FONT'), 10);
                const pixel  = parseInt(script.getField('PIXEL'), 10);
                const string = script.getStringValue('STRING');
                return Entry.robolink_base.setDisplayDrawString(script, 0x20, x, y, font, pixel, string);
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax    : 'Controller.display_draw_string(%1, %2, %3, %4, %5)',
                        textParams: [
                            {
                                type  : 'Block',
                                accept: 'string',
                            },
                            {
                                type  : 'Block',
                                accept: 'string',
                            },
                            {
                                type   : 'Dropdown',
                                options: [
                                    [Lang.Blocks.controller_display_font_5x8, '0'],
                                    [Lang.Blocks.controller_display_font_10x16, '1'],
                                ],
                                value     : '1',
                                fontSize  : 11,
                                bgColor   : EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter : Entry.block.converters.returnStringValue,
                            },
                            {
                                type   : 'Dropdown',
                                options: [
                                    [Lang.Blocks.controller_display_pixel_black, '0'],
                                    [Lang.Blocks.controller_display_pixel_white, '1'],
                                ],
                                value     : '0',
                                fontSize  : 11,
                                bgColor   : EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter : Entry.block.converters.returnStringValue,
                            },
                            {
                                type  : 'Block',
                                accept: 'string',
                            },
                        ],
                    },
                ],
            },
        },

        robolink_codrone_edu_controller_display_draw_string_align: {
            color     : EntryStatic.colorSet.block.default.HARDWARE,
            outerLine : EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton  : 'basic',
            statements: [],
            params    : [
                { type: 'Block', accept: 'string' },
                { type: 'Block', accept: 'string' },
                { type: 'Block', accept: 'string' },
                {
                    type   : 'Dropdown',
                    options: [
                        [Lang.Blocks.controller_display_align_left, '0'],
                        [Lang.Blocks.controller_display_align_center, '1'],
                        [Lang.Blocks.controller_display_align_right, '2'],
                    ],
                    value     : '1',
                    fontSize  : 11,
                    bgColor   : EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type   : 'Dropdown',
                    options: [
                        [Lang.Blocks.controller_display_font_5x8, '0'],
                        [Lang.Blocks.controller_display_font_10x16, '1'],
                    ],
                    value     : '1',
                    fontSize  : 11,
                    bgColor   : EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type   : 'Dropdown',
                    options: [
                        [Lang.Blocks.controller_display_pixel_black, '0'],
                        [Lang.Blocks.controller_display_pixel_white, '1'],
                    ],
                    value     : '0',
                    fontSize  : 11,
                    bgColor   : EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                { type: 'Block', accept: 'string' },
                { type: 'Indicator', img: 'block_icon/hardware_icon.svg', size: 12 },
            ],
            events: {},
            def   : {
                params: [
                    { type: 'text', params: ['0'] },
                    { type: 'text', params: ['128'] },
                    { type: 'text', params: ['42'] },
                    null,
                    null,
                    null,
                    { type: 'text', params: ['DRONE'] },
                    null,
                ],
                type: 'robolink_codrone_edu_controller_display_draw_string_align',
            },
            paramsKeyMap: {
                XSTART: 0,
                XEND  : 1,
                Y     : 2,
                ALIGN : 3,
                FONT  : 4,
                PIXEL : 5,
                STRING: 6,
            },
            class   : 'controller_display',
            isNotFor: ['robolink_codrone_edu'],
            func(sprite, script)
            {
                const xStart = script.getNumberValue('XSTART');
                const xEnd   = script.getNumberValue('XEND');
                const y      = script.getNumberValue('Y');
                const align  = parseInt(script.getField('ALIGN'), 10);
                const font   = parseInt(script.getField('FONT'), 10);
                const pixel  = parseInt(script.getField('PIXEL'), 10);
                const string = script.getStringValue('STRING');
                return Entry.robolink_base.setDisplayDrawStringAlign(script, 0x20, xStart, xEnd, y, align, font, pixel, string);
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax    : 'Controller.display_draw_string_align(%1, %2, %3, %4, %5, %6, %7)',
                        textParams: [
                            {
                                type  : 'Block',
                                accept: 'string',
                            },
                            {
                                type  : 'Block',
                                accept: 'string',
                            },
                            {
                                type  : 'Block',
                                accept: 'string',
                            },
                            {
                                type   : 'Dropdown',
                                options: [
                                    [Lang.Blocks.controller_display_align_left, '0'],
                                    [Lang.Blocks.controller_display_align_center, '1'],
                                    [Lang.Blocks.controller_display_align_right, '2'],
                                ],
                                value     : '1',
                                fontSize  : 11,
                                bgColor   : EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter : Entry.block.converters.returnStringValue,
                            },
                            {
                                type   : 'Dropdown',
                                options: [
                                    [Lang.Blocks.controller_display_font_5x8, '0'],
                                    [Lang.Blocks.controller_display_font_10x16, '1'],
                                ],
                                value     : '1',
                                fontSize  : 11,
                                bgColor   : EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter : Entry.block.converters.returnStringValue,
                            },
                            {
                                type   : 'Dropdown',
                                options: [
                                    [Lang.Blocks.controller_display_pixel_black, '0'],
                                    [Lang.Blocks.controller_display_pixel_white, '1'],
                                ],
                                value     : '0',
                                fontSize  : 11,
                                bgColor   : EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter : Entry.block.converters.returnStringValue,
                            },
                            {
                                type  : 'Block',
                                accept: 'string',
                            },
                        ],
                    },
                ],
            },
        },

        robolink_codrone_edu_controller_buzzer_off: {
            color     : EntryStatic.colorSet.block.default.HARDWARE,
            outerLine : EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton  : 'basic',
            statements: [],
            params    : [
                {
                    type   : 'Dropdown',
                    options: [
                        [Lang.Blocks.common_drone, '0x10'],
                        [Lang.Blocks.common_controller, '0x20'],
                    ],
                    value     : '0x20',
                    fontSize  : 11,
                    bgColor   : EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                { type: 'Indicator', img: 'block_icon/hardware_icon.svg', size: 12 }
            ],
            events: {},
            def   : {
                params: [null, null],
                type  : 'robolink_codrone_edu_controller_buzzer_off',
            },
            paramsKeyMap: {
                TARGET: 0
            },
            class   : 'buzzer',
            isNotFor: ['robolink_codrone_edu'],
            func(sprite, script)
            {
                const target = parseInt(script.getStringValue('TARGET'));
                return Entry.robolink_base.setBuzzerStop(script, target);
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax    : 'Controller.buzzer_off(%1)',
                        textParams: [
                            {
                                type   : 'Dropdown',
                                options: [
                                    [Lang.Blocks.common_drone, '0x10'],
                                    [Lang.Blocks.common_controller, '0x20'],
                                ],
                                value     : '0x20',
                                fontSize  : 11,
                                bgColor   : EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter : Entry.block.converters.returnStringValue,
                            },
                        ],
                    },
                ],
            },
        },

        robolink_codrone_edu_controller_buzzer_scale: {
            color     : EntryStatic.colorSet.block.default.HARDWARE,
            outerLine : EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton  : 'basic',
            statements: [],
            params    : [
                {
                    type   : 'Dropdown',
                    options: [
                        [Lang.Blocks.common_drone, '0x10'],
                        [Lang.Blocks.common_controller, '0x20'],
                    ],
                    value     : '0x20',
                    fontSize  : 11,
                    bgColor   : EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type   : 'Dropdown',
                    options: [
                        ['1', '0'],
                        ['2', '1'],
                        ['3', '2'],
                        ['4', '3'],
                        ['5', '4'],
                        ['6', '5'],
                        ['7', '6'],
                        ['8', '7'],
                    ],
                    value     : '4',
                    fontSize  : 11,
                    bgColor   : EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type   : 'Dropdown',
                    options: [
                        [Lang.Blocks.controller_buzzer_mute, '-1'],
                        [Lang.Blocks.controller_buzzer_c,    '0'],
                        [Lang.Blocks.controller_buzzer_cs,   '1'],
                        [Lang.Blocks.controller_buzzer_d,    '2'],
                        [Lang.Blocks.controller_buzzer_ds,   '3'],
                        [Lang.Blocks.controller_buzzer_e,    '4'],
                        [Lang.Blocks.controller_buzzer_f,    '5'],
                        [Lang.Blocks.controller_buzzer_fs,   '6'],
                        [Lang.Blocks.controller_buzzer_g,    '7'],
                        [Lang.Blocks.controller_buzzer_gs,   '8'],
                        [Lang.Blocks.controller_buzzer_a,    '9'],
                        [Lang.Blocks.controller_buzzer_as,   '10'],
                        [Lang.Blocks.controller_buzzer_b,    '11'],
                    ],
                    value     : '0',
                    fontSize  : 11,
                    bgColor   : EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                { type: 'Block', accept: 'string' },
                {
                    type   : 'Dropdown',
                    options: [
                        [Lang.Blocks.common_instant, '1'],
                        [Lang.Blocks.common_reserve, '2'],
                    ],
                    value     : '1',
                    fontSize  : 11,
                    bgColor   : EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },                
                { type: 'Indicator', img: 'block_icon/hardware_icon.svg', size: 12 },
            ],
            events: {},
            def   : {
                params: [null, null, null, { type: 'text', params: ['1'] }, null, null],
                type  : 'robolink_codrone_edu_controller_buzzer_scale',
            },
            paramsKeyMap: {
                TARGET: 0,
                OCTAVE: 1,
                SCALE : 2,
                TIME  : 3,
                MODE  : 4,
            },
            class   : 'buzzer',
            isNotFor: ['robolink_codrone_edu'],
            func(sprite, script)
            {
                const target = parseInt(script.getStringValue('TARGET'));
                const octave = parseInt(script.getField('OCTAVE'), 10);
                const scale  = parseInt(script.getField('SCALE'), 10);
                const time   = script.getNumberValue('TIME') * 1000;
                const mode  = parseInt(script.getField('MODE'), 10);

                if(mode == 1)
                {
                    if (scale == -1) {
                        return Entry.robolink_base.setBuzzerMute(script, target, time, true, true);                    
                    } else {
                        return Entry.robolink_base.setBuzzerScale(script, target, octave, scale, time, true, true);
                    }
                }
                else if(mode == 2)
                {
                    if (scale == -1) {
                        return Entry.robolink_base.setBuzzerMute(script, target, time, false, false);
                    } else {
                        return Entry.robolink_base.setBuzzerScale(script, target, octave, scale, time, false, false);
                    }
                }
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax    : 'Controller.buzzer_scale(%1, %2, %3)',
                        textParams: [
                            {
                                type   : 'Dropdown',
                                options: [
                                    [Lang.Blocks.common_drone, '0x10'],
                                    [Lang.Blocks.common_controller, '0x20'],
                                ],
                                value     : '0x20',
                                fontSize  : 11,
                                bgColor   : EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter : Entry.block.converters.returnStringValue,
                            },
                            {
                                type   : 'Dropdown',
                                options: [
                                    ['1', '0'],
                                    ['2', '1'],
                                    ['3', '2'],
                                    ['4', '3'],
                                    ['5', '4'],
                                    ['6', '5'],
                                    ['7', '6'],
                                    ['8', '7'],
                                ],
                                value     : '4',
                                fontSize  : 11,
                                bgColor   : EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter : Entry.block.converters.returnStringValue,
                            },
                            {
                                type   : 'Dropdown',
                                options: [
                                    [Lang.Blocks.controller_buzzer_mute, '-1'],
                                    [Lang.Blocks.controller_buzzer_c,    '0'],
                                    [Lang.Blocks.controller_buzzer_cs,   '1'],
                                    [Lang.Blocks.controller_buzzer_d,    '2'],
                                    [Lang.Blocks.controller_buzzer_ds,   '3'],
                                    [Lang.Blocks.controller_buzzer_e,    '4'],
                                    [Lang.Blocks.controller_buzzer_f,    '5'],
                                    [Lang.Blocks.controller_buzzer_fs,   '6'],
                                    [Lang.Blocks.controller_buzzer_g,    '7'],
                                    [Lang.Blocks.controller_buzzer_gs,   '8'],
                                    [Lang.Blocks.controller_buzzer_a,    '9'],
                                    [Lang.Blocks.controller_buzzer_as,   '10'],
                                    [Lang.Blocks.controller_buzzer_b,    '11'],
                                ],
                                value     : '0',
                                fontSize  : 11,
                                bgColor   : EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter : Entry.block.converters.returnStringValue,
                            },
                        ],
                    },
                ],
            },
        },

        robolink_codrone_edu_controller_buzzer_scale_delay: {
            color     : EntryStatic.colorSet.block.default.HARDWARE,
            outerLine : EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton  : 'basic',
            statements: [],
            params    : [
                {
                    type   : 'Dropdown',
                    options: [
                        [Lang.Blocks.common_drone, '0x10'],
                        [Lang.Blocks.common_controller, '0x20'],
                    ],
                    value     : '0x20',
                    fontSize  : 11,
                    bgColor   : EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type   : 'Dropdown',
                    options: [
                        ['1', '0'],
                        ['2', '1'],
                        ['3', '2'],
                        ['4', '3'],
                        ['5', '4'],
                        ['6', '5'],
                        ['7', '6'],
                        ['8', '7'],
                    ],
                    value     : '4',
                    fontSize  : 11,
                    bgColor   : EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type   : 'Dropdown',
                    options: [
                        [Lang.Blocks.controller_buzzer_mute, '-1'],
                        [Lang.Blocks.controller_buzzer_c,    '0'],
                        [Lang.Blocks.controller_buzzer_cs,   '1'],
                        [Lang.Blocks.controller_buzzer_d,    '2'],
                        [Lang.Blocks.controller_buzzer_ds,   '3'],
                        [Lang.Blocks.controller_buzzer_e,    '4'],
                        [Lang.Blocks.controller_buzzer_f,    '5'],
                        [Lang.Blocks.controller_buzzer_fs,   '6'],
                        [Lang.Blocks.controller_buzzer_g,    '7'],
                        [Lang.Blocks.controller_buzzer_gs,   '8'],
                        [Lang.Blocks.controller_buzzer_a,    '9'],
                        [Lang.Blocks.controller_buzzer_as,   '10'],
                        [Lang.Blocks.controller_buzzer_b,    '11'],
                    ],
                    value     : '0',
                    fontSize  : 11,
                    bgColor   : EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                { type: 'Block', accept: 'string' },
                { type: 'Indicator', img: 'block_icon/hardware_icon.svg', size: 12 },
            ],
            events: {},
            def   : {
                params: [
                    null,
                    null,
                    null,
                    { type: 'text', params: ['1'] },
                    null,
                ],
                type: 'robolink_codrone_edu_controller_buzzer_scale_delay',
            },
            paramsKeyMap: {
                TARGET: 0,
                OCTAVE: 1,
                SCALE : 2,
                TIME  : 3,
            },
            class   : 'buzzer',
            isNotFor: ['robolink_codrone_edu'],
            func(sprite, script)
            {
                const target = parseInt(script.getStringValue('TARGET'));
                const octave = parseInt(script.getField('OCTAVE'), 10);
                const scale  = parseInt(script.getField('SCALE'), 10);
                const time   = script.getNumberValue('TIME') * 1000;

                if (scale == -1) {
                    return Entry.robolink_base.setBuzzerMute(script, target, time, true, true);
                } else {
                    return Entry.robolink_base.setBuzzerScale(script, target, octave, scale, time, true, true);
                }
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax    : 'Controller.buzzer_scale_delay(%1, %2, %3, %4)',
                        textParams: [
                            {
                                type   : 'Dropdown',
                                options: [
                                    [Lang.Blocks.common_drone, '0x10'],
                                    [Lang.Blocks.common_controller, '0x20'],
                                ],
                                value     : '0x20',
                                fontSize  : 11,
                                bgColor   : EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter : Entry.block.converters.returnStringValue,
                            },
                            {
                                type   : 'Dropdown',
                                options: [
                                    ['1', '0'],
                                    ['2', '1'],
                                    ['3', '2'],
                                    ['4', '3'],
                                    ['5', '4'],
                                    ['6', '5'],
                                    ['7', '6'],
                                    ['8', '7'],
                                ],
                                value     : '4',
                                fontSize  : 11,
                                bgColor   : EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter : Entry.block.converters.returnStringValue,
                            },
                            {
                                type   : 'Dropdown',
                                options: [
                                    [Lang.Blocks.controller_buzzer_mute, '-1'],
                                    [Lang.Blocks.controller_buzzer_c,    '0'],
                                    [Lang.Blocks.controller_buzzer_cs,   '1'],
                                    [Lang.Blocks.controller_buzzer_d,    '2'],
                                    [Lang.Blocks.controller_buzzer_ds,   '3'],
                                    [Lang.Blocks.controller_buzzer_e,    '4'],
                                    [Lang.Blocks.controller_buzzer_f,    '5'],
                                    [Lang.Blocks.controller_buzzer_fs,   '6'],
                                    [Lang.Blocks.controller_buzzer_g,    '7'],
                                    [Lang.Blocks.controller_buzzer_gs,   '8'],
                                    [Lang.Blocks.controller_buzzer_a,    '9'],
                                    [Lang.Blocks.controller_buzzer_as,   '10'],
                                    [Lang.Blocks.controller_buzzer_b,    '11'],
                                ],
                                value     : '0',
                                fontSize  : 11,
                                bgColor   : EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter : Entry.block.converters.returnStringValue,
                            },
                            {
                                type  : 'Block',
                                accept: 'string',
                            },
                        ],
                    },
                ],
            },
        },

        robolink_codrone_edu_controller_buzzer_scale_reserve: {
            color     : EntryStatic.colorSet.block.default.HARDWARE,
            outerLine : EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton  : 'basic',
            statements: [],
            params    : [
                {
                    type   : 'Dropdown',
                    options: [
                        [Lang.Blocks.common_drone, '0x10'],
                        [Lang.Blocks.common_controller, '0x20'],
                    ],
                    value     : '0x20',
                    fontSize  : 11,
                    bgColor   : EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type   : 'Dropdown',
                    options: [
                        ['1', '0'],
                        ['2', '1'],
                        ['3', '2'],
                        ['4', '3'],
                        ['5', '4'],
                        ['6', '5'],
                        ['7', '6'],
                        ['8', '7'],
                    ],
                    value     : '4',
                    fontSize  : 11,
                    bgColor   : EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type   : 'Dropdown',
                    options: [
                        [Lang.Blocks.controller_buzzer_mute, '-1'],
                        [Lang.Blocks.controller_buzzer_c,    '0'],
                        [Lang.Blocks.controller_buzzer_cs,   '1'],
                        [Lang.Blocks.controller_buzzer_d,    '2'],
                        [Lang.Blocks.controller_buzzer_ds,   '3'],
                        [Lang.Blocks.controller_buzzer_e,    '4'],
                        [Lang.Blocks.controller_buzzer_f,    '5'],
                        [Lang.Blocks.controller_buzzer_fs,   '6'],
                        [Lang.Blocks.controller_buzzer_g,    '7'],
                        [Lang.Blocks.controller_buzzer_gs,   '8'],
                        [Lang.Blocks.controller_buzzer_a,    '9'],
                        [Lang.Blocks.controller_buzzer_as,   '10'],
                        [Lang.Blocks.controller_buzzer_b,    '11'],
                    ],
                    value     : '0',
                    fontSize  : 11,
                    bgColor   : EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                { type: 'Block', accept: 'string' },
                { type: 'Indicator', img: 'block_icon/hardware_icon.svg', size: 12 },
            ],
            events: {},
            def   : {
                params: [
                    null,
                    null,
                    null,
                    { type: 'text', params: ['1'] },
                    null,
                ],
                type: 'robolink_codrone_edu_controller_buzzer_scale_reserve',
            },
            paramsKeyMap: {
                TARGET: 0,
                OCTAVE: 1,
                SCALE : 2,
                TIME  : 3,
            },
            class   : 'buzzer',
            isNotFor: ['robolink_codrone_edu'],
            func(sprite, script)
            {
                const target = parseInt(script.getStringValue('TARGET'));
                const octave = parseInt(script.getField('OCTAVE'), 10);
                const scale  = parseInt(script.getField('SCALE'), 10);
                const time   = script.getNumberValue('TIME') * 1000;

                if (scale == -1) {
                    return Entry.robolink_base.setBuzzerMute(script, target, time, false, false);
                } else {
                    return Entry.robolink_base.setBuzzerScale(script, target, octave, scale, time, false, false);
                }
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax    : 'Controller.buzzer_scale_reserve(%1, %2, %3, %4)',
                        textParams: [
                            {
                                type   : 'Dropdown',
                                options: [
                                    [Lang.Blocks.common_drone, '0x10'],
                                    [Lang.Blocks.common_controller, '0x20'],
                                ],
                                value     : '0x20',
                                fontSize  : 11,
                                bgColor   : EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter : Entry.block.converters.returnStringValue,
                            },
                            {
                                type   : 'Dropdown',
                                options: [
                                    ['1', '0'],
                                    ['2', '1'],
                                    ['3', '2'],
                                    ['4', '3'],
                                    ['5', '4'],
                                    ['6', '5'],
                                    ['7', '6'],
                                    ['8', '7'],
                                ],
                                value     : '4',
                                fontSize  : 11,
                                bgColor   : EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter : Entry.block.converters.returnStringValue,
                            },
                            {
                                type   : 'Dropdown',
                                options: [
                                    [Lang.Blocks.controller_buzzer_mute, '-1'],
                                    [Lang.Blocks.controller_buzzer_c,    '0'],
                                    [Lang.Blocks.controller_buzzer_cs,   '1'],
                                    [Lang.Blocks.controller_buzzer_d,    '2'],
                                    [Lang.Blocks.controller_buzzer_ds,   '3'],
                                    [Lang.Blocks.controller_buzzer_e,    '4'],
                                    [Lang.Blocks.controller_buzzer_f,    '5'],
                                    [Lang.Blocks.controller_buzzer_fs,   '6'],
                                    [Lang.Blocks.controller_buzzer_g,    '7'],
                                    [Lang.Blocks.controller_buzzer_gs,   '8'],
                                    [Lang.Blocks.controller_buzzer_a,    '9'],
                                    [Lang.Blocks.controller_buzzer_as,   '10'],
                                    [Lang.Blocks.controller_buzzer_b,    '11'],
                                ],
                                value     : '0',
                                fontSize  : 11,
                                bgColor   : EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter : Entry.block.converters.returnStringValue,
                            },
                            {
                                type  : 'Block',
                                accept: 'string',
                            },
                        ],
                    },
                ],
            },
        },

        robolink_codrone_edu_controller_buzzer_hz: {
            color     : EntryStatic.colorSet.block.default.HARDWARE,
            outerLine : EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton  : 'basic',
            statements: [],
            params    : [
                {
                    type   : 'Dropdown',
                    options: [
                        [Lang.Blocks.common_drone, '0x10'],
                        [Lang.Blocks.common_controller, '0x20'],
                    ],
                    value     : '0x20',
                    fontSize  : 11,
                    bgColor   : EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                { type: 'Block', accept: 'string' },
                { type: 'Block', accept: 'string' },
                {
                    type   : 'Dropdown',
                    options: [
                        [Lang.Blocks.common_instant, '1'],
                        [Lang.Blocks.common_reserve, '2'],
                    ],
                    value     : '1',
                    fontSize  : 11,
                    bgColor   : EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },                
                { type: 'Indicator', img: 'block_icon/hardware_icon.svg', size: 12 },
            ],
            events: {},
            def   : {
                params: [null, { type: 'text', params: ['1000'] }, { type: 'text', params: ['1'] }, null, null],
                type  : 'robolink_codrone_edu_controller_buzzer_hz',
            },
            paramsKeyMap: {
                TARGET: 0,
                HZ    : 1,
                TIME  : 2,
                MODE  : 3,
            },
            class   : 'buzzer',
            isNotFor: ['robolink_codrone_edu'],
            func(sprite, script)
            {
                const target = parseInt(script.getStringValue('TARGET'));
                const hz     = script.getNumberValue('HZ');
                const time   = script.getNumberValue('TIME') * 1000;
                const mode  = parseInt(script.getField('MODE'), 10);
                
                if(mode == 1)
                {              
                    return Entry.robolink_base.setBuzzerHz(script, target, hz, time, true, true);
                }
                else if(mode == 2)
                {
                    return Entry.robolink_base.setBuzzerHz(script, target, hz, time, false, false);
                }
            
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax    : 'Controller.buzzer_hz(%1, %2)',
                        textParams: [
                            {
                                type   : 'Dropdown',
                                options: [
                                    [Lang.Blocks.common_drone, '0x10'],
                                    [Lang.Blocks.common_controller, '0x20'],
                                ],
                                value     : '0x20',
                                fontSize  : 11,
                                bgColor   : EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter : Entry.block.converters.returnStringValue,
                            },
                            {
                                type  : 'Block',
                                accept: 'string',
                            },
                        ],
                    },
                ],
            },
        },

        robolink_codrone_edu_controller_buzzer_hz_delay: {
            color     : EntryStatic.colorSet.block.default.HARDWARE,
            outerLine : EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton  : 'basic',
            statements: [],
            params    : [
                {
                    type   : 'Dropdown',
                    options: [
                        [Lang.Blocks.common_drone, '0x10'],
                        [Lang.Blocks.common_controller, '0x20'],
                    ],
                    value     : '0x20',
                    fontSize  : 11,
                    bgColor   : EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                { type: 'Block', accept: 'string' },
                { type: 'Block', accept: 'string' },
                { type: 'Indicator', img: 'block_icon/hardware_icon.svg', size: 12 },
            ],
            events: {},
            def   : {
                params: [null, { type: 'text', params: ['1000'] }, { type: 'text', params: ['1'] }, null],
                type  : 'robolink_codrone_edu_controller_buzzer_hz_delay',
            },
            paramsKeyMap: {
                TARGET: 0,
                HZ    : 1,
                TIME  : 2,
            },
            class   : 'buzzer',
            isNotFor: ['robolink_codrone_edu'],
            func(sprite, script)
            {
                const target = parseInt(script.getStringValue('TARGET'));
                const hz     = script.getNumberValue('HZ');
                const time   = script.getNumberValue('TIME') * 1000;
                return Entry.robolink_base.setBuzzerHz(script, target, hz, time, true, true);
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax    : 'Controller.buzzer_hz_delay(%1, %2, %3)',
                        textParams: [
                            {
                                type   : 'Dropdown',
                                options: [
                                    [Lang.Blocks.common_drone, '0x10'],
                                    [Lang.Blocks.common_controller, '0x20'],
                                ],
                                value     : '0x20',
                                fontSize  : 11,
                                bgColor   : EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter : Entry.block.converters.returnStringValue,
                            },
                            {
                                type  : 'Block',
                                accept: 'string',
                            },
                            {
                                type  : 'Block',
                                accept: 'string',
                            },
                        ],
                    },
                ],
            },
        },

        robolink_codrone_edu_controller_buzzer_hz_reserve: {
            color     : EntryStatic.colorSet.block.default.HARDWARE,
            outerLine : EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton  : 'basic',
            statements: [],
            params    : [
                {
                    type   : 'Dropdown',
                    options: [
                        [Lang.Blocks.common_drone, '0x10'],
                        [Lang.Blocks.common_controller, '0x20'],
                    ],
                    value     : '0x20',
                    fontSize  : 11,
                    bgColor   : EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                { type: 'Block', accept: 'string' },
                { type: 'Block', accept: 'string' },
                { type: 'Indicator', img: 'block_icon/hardware_icon.svg', size: 12 },
            ],
            events: {},
            def   : {
                params: [
                    null,
                    { type: 'text', params: ['1000'] },
                    { type: 'text', params: ['1'] },
                    null,
                ],
                type: 'robolink_codrone_edu_controller_buzzer_hz_reserve',
            },
            paramsKeyMap: {
                TARGET: 0,
                HZ    : 1,
                TIME  : 2,
            },
            class   : 'buzzer',
            isNotFor: ['robolink_codrone_edu'],
            func(sprite, script)
            {
                const target = parseInt(script.getStringValue('TARGET'));
                const hz     = script.getNumberValue('HZ');
                const time   = script.getNumberValue('TIME') * 1000;
                return Entry.robolink_base.setBuzzerHz(script, target, hz, time, false, false);
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax    : 'Controller.buzzer_hz_reserve(%1, %2, %3)',
                        textParams: [
                            {
                                type   : 'Dropdown',
                                options: [
                                    [Lang.Blocks.common_drone, '0x10'],
                                    [Lang.Blocks.common_controller, '0x20'],
                                ],
                                value     : '0x20',
                                fontSize  : 11,
                                bgColor   : EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter : Entry.block.converters.returnStringValue,
                            },
                            {
                                type  : 'Block',
                                accept: 'string',
                            },
                            {
                                type  : 'Block',
                                accept: 'string',
                            },
                        ],
                    },
                ],
            },
        },

        robolink_codrone_edu_controller_vibrator_off: {
            color     : EntryStatic.colorSet.block.default.HARDWARE,
            outerLine : EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton  : 'basic',
            statements: [],
            params    : [{ type: 'Indicator', img: 'block_icon/hardware_icon.svg', size: 12 }],
            events    : {},
            def       : {
                params: [null],
                type  : 'robolink_codrone_edu_controller_vibrator_off',
            },
            paramsKeyMap: {},
            class       : 'vibrator',
            isNotFor    : ['robolink_codrone_edu'],
            func(sprite, script)
            {
                return Entry.robolink_base.setVibratorStop(script, 0x20);
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Controller.vibrator_off()',
                    },
                ],
            },
        },

        robolink_codrone_edu_controller_vibrator_on_delay: {
            color     : EntryStatic.colorSet.block.default.HARDWARE,
            outerLine : EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton  : 'basic',
            statements: [],
            params    : [
                { type: 'Block', accept: 'string' },
                { type: 'Indicator', img: 'block_icon/hardware_icon.svg', size: 12 },
            ],
            events: {},
            def   : {
                params: [{ type: 'text', params: ['1'] }, null],
                type  : 'robolink_codrone_edu_controller_vibrator_on_delay',
            },
            paramsKeyMap: {
                TIMEON: 0,
            },
            class   : 'vibrator',
            isNotFor: ['robolink_codrone_edu'],
            func(sprite, script)
            {
                const timeOn = script.getNumberValue('TIMEON') * 1000;
                return Entry.robolink_base.setVibrator(script, 0x20, timeOn, 0, timeOn, true, true);
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax    : 'Controller.vibrator_on_delay(%1)',
                        textParams: [
                            {
                                type  : 'Block',
                                accept: 'string',
                            },
                        ],
                    },
                ],
            },
        },

        robolink_codrone_edu_controller_vibrator_on_reserve: {
            color     : EntryStatic.colorSet.block.default.HARDWARE,
            outerLine : EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton  : 'basic',
            statements: [],
            params    : [
                { type: 'Block', accept: 'string' },
                { type: 'Indicator', img: 'block_icon/hardware_icon.svg', size: 12 },
            ],
            events: {},
            def   : {
                params: [{ type: 'text', params: ['1'] }, null],
                type  : 'robolink_codrone_edu_controller_vibrator_on_reserve',
            },
            paramsKeyMap: {
                TIMEON: 0,
            },
            class   : 'vibrator',
            isNotFor: ['robolink_codrone_edu'],
            func(sprite, script)
            {
                const timeOn = script.getNumberValue('TIMEON') * 1000;
                return Entry.robolink_base.setVibrator(script, 0x20, timeOn, 0, timeOn, false, false);
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax    : 'Controller.vibrator_on_reserve(%1)',
                        textParams: [
                            {
                                type  : 'Block',
                                accept: 'string',
                            },
                        ],
                    },
                ],
            },
        },

        robolink_codrone_edu_controller_vibrator_delay: {
            color     : EntryStatic.colorSet.block.default.HARDWARE,
            outerLine : EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton  : 'basic',
            statements: [],
            params    : [
                { type: 'Block', accept: 'string' },
                { type: 'Block', accept: 'string' },
                { type: 'Block', accept: 'string' },
                { type: 'Indicator', img: 'block_icon/hardware_icon.svg', size: 12 },
            ],
            events: {},
            def   : {
                params: [
                    { type: 'text', params: ['0.3'] },
                    { type: 'text', params: ['0.3'] },
                    { type: 'text', params: ['1'] },
                    null,
                ],
                type: 'robolink_codrone_edu_controller_vibrator_delay',
            },
            paramsKeyMap: {
                TIMEON : 0,
                TIMEOFF: 1,
                TIMERUN: 2,
            },
            class   : 'vibrator',
            isNotFor: ['robolink_codrone_edu'],
            func(sprite, script)
            {
                const timeOn  = script.getNumberValue('TIMEON') * 1000;
                const timeOff = script.getNumberValue('TIMEOFF') * 1000;
                const timeRun = script.getNumberValue('TIMERUN') * 1000;
                return Entry.robolink_base.setVibrator(script, 0x20, timeOn, timeOff, timeRun, true, true);
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax    : 'Controller.vibrator_delay(%1, %2, %3)',
                        textParams: [
                            {
                                type  : 'Block',
                                accept: 'string',
                            },
                            {
                                type  : 'Block',
                                accept: 'string',
                            },
                            {
                                type  : 'Block',
                                accept: 'string',
                            },
                        ],
                    },
                ],
            },
        },

        robolink_codrone_edu_controller_vibrator_reserve: {
            color     : EntryStatic.colorSet.block.default.HARDWARE,
            outerLine : EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton  : 'basic',
            statements: [],
            params    : [
                { type: 'Block', accept: 'string' },
                { type: 'Block', accept: 'string' },
                { type: 'Block', accept: 'string' },
                { type: 'Indicator', img: 'block_icon/hardware_icon.svg', size: 12 },
            ],
            events: {},
            def   : {
                params: [
                    { type: 'text', params: ['0.3'] },
                    { type: 'text', params: ['0.3'] },
                    { type: 'text', params: ['1'] },
                    null,
                ],
                type: 'robolink_codrone_edu_controller_vibrator_reserve',
            },
            paramsKeyMap: {
                TIMEON : 0,
                TIMEOFF: 1,
                TIMERUN: 2,
            },
            class   : 'vibrator',
            isNotFor: ['robolink_codrone_edu'],
            func(sprite, script)
            {
                const timeOn  = script.getNumberValue('TIMEON') * 1000;
                const timeOff = script.getNumberValue('TIMEOFF') * 1000;
                const timeRun = script.getNumberValue('TIMERUN') * 1000;
                return Entry.robolink_base.setVibrator(script, 0x20, timeOn, timeOff, timeRun, false, false);
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax    : 'Controller.vibrator_reserve(%1, %2, %3)',
                        textParams: [
                            {
                                type  : 'Block',
                                accept: 'string',
                            },
                            {
                                type  : 'Block',
                                accept: 'string',
                            },
                            {
                                type  : 'Block',
                                accept: 'string',
                            },
                        ],
                    },
                ],
            },
        },

        robolink_codrone_edu_drone_motor_stop: {
            color     : EntryStatic.colorSet.block.default.HARDWARE,
            outerLine : EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton  : 'basic',
            statements: [],
            params    : [{ type: 'Indicator', img: 'block_icon/hardware_icon.svg', size: 12 }],
            events    : {},
            def       : {
                params: [null],
                type  : 'robolink_codrone_edu_drone_motor_stop',
            },
            paramsKeyMap: {},
            class       : 'motor',
            isNotFor    : ['robolink_codrone_edu'],
            func(sprite, script)
            {
                return Entry.robolink_base.sendStop(script, 0x10);
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Drone.motor_stop()',
                    },
                ],
            },
        },

        robolink_codrone_edu_drone_motorsingle: {
            color     : EntryStatic.colorSet.block.default.HARDWARE,
            outerLine : EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton  : 'basic',
            statements: [],
            params    : [
                {
                    type      : 'Dropdown',
                    options   : [['1(FR)', '0'], ['2(RR)', '1'], ['3(RL)', '2'], ['4(FL)', '3']],
                    value     : '0',
                    fontSize  : 11,
                    bgColor   : EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                { type: 'Block', accept: 'string' },
                { type: 'Indicator', img: 'block_icon/hardware_icon.svg', size: 12 },
            ],
            events: {},
            def   : {
                params: [null, { type: 'text', params: ['120'] }, null],
                type  : 'robolink_codrone_edu_drone_motorsingle',
            },
            paramsKeyMap: {
                MOTORINDEX: 0,
                MOTORSPEED: 1,
            },
            class   : 'motor',
            isNotFor: ['robolink_codrone_edu'],
            func(sprite, script)
            {
                const motorIndex = parseInt(script.getField('MOTORINDEX'), 10);
                const motorSpeed = script.getNumberValue('MOTORSPEED');

                return Entry.robolink_base.setMotorSingleV(script, 0x10, motorIndex, motorSpeed);
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax    : 'Drone.motor_single(%1, %2)',
                        textParams: [
                            {
                                type      : 'Dropdown',
                                options   : [['1(FR)', '0'], ['2(RR)', '1'], ['3(RL)', '2'], ['4(FL)', '3']],
                                value     : '0',
                                fontSize  : 11,
                                bgColor   : EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter : Entry.block.converters.returnStringValue,
                            },
                            {
                                type  : 'Block',
                                accept: 'string',
                            },
                        ],
                    },
                ],
            },
        },

        robolink_codrone_edu_drone_motorsingle_input: {
            color     : EntryStatic.colorSet.block.default.HARDWARE,
            outerLine : EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton  : 'basic',
            statements: [],
            params    : [
                { type: 'Block', accept: 'string' },
                { type: 'Block', accept: 'string' },
                { type: 'Indicator', img: 'block_icon/hardware_icon.svg', size: 12 },
            ],
            events: {},
            def   : {
                params: [{ type: 'text', params: ['1'] }, { type: 'text', params: ['120'] }, null],
                type  : 'robolink_codrone_edu_drone_motorsingle_input',
            },
            paramsKeyMap: {
                MOTORINDEX: 0,
                MOTORSPEED: 1,
            },
            class   : 'motor',
            isNotFor: ['robolink_codrone_edu'],
            func(sprite, script)
            {
                const motorIndex = script.getNumberValue('MOTORINDEX') - 1;
                const motorSpeed = script.getNumberValue('MOTORSPEED');

                return Entry.robolink_base.setMotorSingleV(script, 0x10, motorIndex, motorSpeed);
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax    : 'Drone.motor_single_input(%1, %2)',
                        textParams: [
                            {
                                type  : 'Block',
                                accept: 'string',
                            },
                            {
                                type  : 'Block',
                                accept: 'string',
                            },
                        ],
                    },
                ],
            },
        },


        robolink_codrone_edu_drone_control_flip: {
            color     : EntryStatic.colorSet.block.default.HARDWARE,
            outerLine : EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton  : 'basic',
            statements: [],
            params    : [
                {
                    type   : 'Dropdown',
                    options: [
                        [Lang.Blocks.drone_control_flip_front, '0x14'],
                        [Lang.Blocks.drone_control_flip_rear,  '0x15'],
                        [Lang.Blocks.drone_control_flip_left,  '0x16'],
                        [Lang.Blocks.drone_control_flip_right, '0x17'],
                    ],
                    value     : '0x14',
                    fontSize  : 11,
                    bgColor   : EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                { type: 'Indicator', img: 'block_icon/hardware_icon.svg', size: 12 },
            ],
            events: {},
            def   : {
                params: [null, null],
                type  : 'robolink_codrone_edu_drone_control_flip',
            },
            paramsKeyMap: {
                FLIP: 0,
            },
            class   : 'control_flight',
            isNotFor: ['robolink_codrone_edu'],
            func(sprite, script)
            {
                //const headless = script.getField('HEADLESS');
                //return Entry.robolink_base.sendCommand(script, 0x10, 0x03, headless);
                const flip = parseInt(script.getStringValue('FLIP'));
                //transferCommand(target, 0x07, eventFlight); // 0x07 : CommandType::FlightEvent
                //return Entry.robolink_base.setEventFlight(script, 0x10, flip, 0); // 0x18 : FlightEvent::return
                return Entry.robolink_base.sendCommand(script, 0x10, 0x07, flip); // 0x18 : FlightEvent::return
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax    : 'Drone.headless(%1)',
                        textParams: [
                            {
                                type   : 'Dropdown',
                                options: [
                                    [Lang.Blocks.drone_headless_headless, '1'],
                                    [Lang.Blocks.drone_headless_normal,   '2'],
                                ],
                                value     : '2',
                                fontSize  : 11,
                                bgColor   : EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter : Entry.block.converters.returnStringValue,
                            },
                        ],
                    },
                ],
            },
        },


        robolink_codrone_edu_drone_control_drone_return_home: {
            color     : EntryStatic.colorSet.block.default.HARDWARE,
            outerLine : EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton  : 'basic',
            statements: [],
            params    : [{ type: 'Indicator', img: 'block_icon/hardware_icon.svg', size: 12 }],
            events    : {},
            def       : {
                params: [null],
                type  : 'robolink_codrone_edu_drone_control_drone_return_home',
            },
            paramsKeyMap: {},
            class       : 'control_flight',
            isNotFor    : ['robolink_codrone_edu'],
            func(sprite, script)
            {
              //  return Entry.robolink_base.setEventFlight(script, 0x10, 0x18, 5000); // 0x11 : FlightEvent::TakeOff
             
              return Entry.robolink_base.setEventFlight(script, 0x10, 0x18, 0); // 0x18 : FlightEvent::return
              //return Entry.robolink_base.sendCommand(script, 0x10, 0x07, 0x18); // 0x18 : FlightEvent::return
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Drone.takeoff()',
                    },
                ],
            },
        },

        robolink_codrone_edu_drone_control_drone_takeoff: {
            color     : EntryStatic.colorSet.block.default.HARDWARE,
            outerLine : EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton  : 'basic',
            statements: [],
            params    : [{ type: 'Indicator', img: 'block_icon/hardware_icon.svg', size: 12 }],
            events    : {},
            def       : {
                params: [null],
                type  : 'robolink_codrone_edu_drone_control_drone_takeoff',
            },
            paramsKeyMap: {},
            class       : 'control_flight',
            isNotFor    : ['robolink_codrone_edu'],
            func(sprite, script)
            {
                return Entry.robolink_base.setEventFlight(script, 0x10, 0x11, 5000); // 0x11 : FlightEvent::TakeOff
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Drone.takeoff()',
                    },
                ],
            },
        },

        robolink_codrone_edu_drone_control_drone_landing: {
            color     : EntryStatic.colorSet.block.default.HARDWARE,
            outerLine : EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton  : 'basic',
            statements: [],
            params    : [{ type: 'Indicator', img: 'block_icon/hardware_icon.svg', size: 12 }],
            events    : {},
            def       : {
                params: [null],
                type  : 'robolink_codrone_edu_drone_control_drone_landing',
            },
            paramsKeyMap: {},
            class       : 'control_flight',
            isNotFor    : ['robolink_codrone_edu'],
            func(sprite, script)
            {
                return Entry.robolink_base.setEventFlight(script, 0x10, 0x12, 5000); // 0x12 : FlightEvent::Landing
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Drone.landing()',
                    },
                ],
            },
        },

        robolink_codrone_edu_drone_control_drone_stop: {
            color     : EntryStatic.colorSet.block.default.HARDWARE,
            outerLine : EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton  : 'basic',
            statements: [],
            params    : [{ type: 'Indicator', img: 'block_icon/hardware_icon.svg', size: 12 }],
            events    : {},
            def       : {
                params: [null],
                type  : 'robolink_codrone_edu_drone_control_drone_stop',
            },
            paramsKeyMap: {},
            class       : 'control_flight',
            isNotFor    : ['robolink_codrone_edu'],
            func(sprite, script)
            {
                return Entry.robolink_base.sendStop(script, 0x10);
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Drone.stop()',
                    },
                ],
            },
        },

        robolink_codrone_edu_drone_control_headless: {
            color     : EntryStatic.colorSet.block.default.HARDWARE,
            outerLine : EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton  : 'basic',
            statements: [],
            params    : [
                {
                    type   : 'Dropdown',
                    options: [
                        [Lang.Blocks.drone_headless_headless, '1'],
                        [Lang.Blocks.drone_headless_normal,   '2'],
                    ],
                    value     : '2',
                    fontSize  : 11,
                    bgColor   : EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                { type: 'Indicator', img: 'block_icon/hardware_icon.svg', size: 12 },
            ],
            events: {},
            def   : {
                params: [null, null],
                type  : 'robolink_codrone_edu_drone_control_headless',
            },
            paramsKeyMap: {
                HEADLESS: 0,
            },
            class   : 'control_flight',
            isNotFor: ['robolink_codrone_edu'],
            func(sprite, script)
            {
                const headless = script.getField('HEADLESS');
                return Entry.robolink_base.sendCommand(script, 0x10, 0x03, headless);
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax    : 'Drone.headless(%1)',
                        textParams: [
                            {
                                type   : 'Dropdown',
                                options: [
                                    [Lang.Blocks.drone_headless_headless, '1'],
                                    [Lang.Blocks.drone_headless_normal,   '2'],
                                ],
                                value     : '2',
                                fontSize  : 11,
                                bgColor   : EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter : Entry.block.converters.returnStringValue,
                            },
                        ],
                    },
                ],
            },
        },

        robolink_codrone_edu_drone_control_drone_reset_heading: {
            color     : EntryStatic.colorSet.block.default.HARDWARE,
            outerLine : EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton  : 'basic',
            statements: [],
            params    : [{ type: 'Indicator', img: 'block_icon/hardware_icon.svg', size: 12 }],
            events    : {},
            def       : {
                params: [null],
                type  : 'robolink_codrone_edu_drone_control_drone_reset_heading',
            },
            paramsKeyMap: {},
            class       : 'control_flight',
            isNotFor    : ['robolink_codrone_edu'],
            func(sprite, script)
            {
                return Entry.robolink_base.sendCommand(script, 0x10, 0x07, 0xA0); // 0x22 : CommandType::FlightEvent  // 0xA0 : FlightEvent::ResetHeading
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Drone.reset_heading()',
                    },
                ],
            },
        },

        robolink_codrone_edu_drone_control_quad_one: {
            color     : EntryStatic.colorSet.block.default.HARDWARE,
            outerLine : EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton  : 'basic',
            statements: [],
            params    : [
                {
                    type   : 'Dropdown',
                    options: [
                        [Lang.Blocks.drone_control_quad_roll,     'control_quad8_roll'],
                        [Lang.Blocks.drone_control_quad_pitch,    'control_quad8_pitch'],
                        [Lang.Blocks.drone_control_quad_yaw,      'control_quad8_yaw'],
                        [Lang.Blocks.drone_control_quad_throttle, 'control_quad8_throttle'],
                    ],
                    value     : 'control_quad8_pitch',
                    fontSize  : 11,
                    bgColor   : EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                { type: 'Block', accept: 'string' },
                { type: 'Indicator', img: 'block_icon/hardware_icon.svg', size: 12 },
            ],
            events: {},
            def   : {
                params: [null, { type: 'number', params: ['0'] }, null],
                type  : 'robolink_codrone_edu_drone_control_quad_one',
            },
            paramsKeyMap: {
                CONTROLTARGET: 0,
                VALUE        : 1,
            },
            class   : 'control_quad',
            isNotFor: ['robolink_codrone_edu'],
            func(sprite, script)
            {
                const controlTarget = script.getField('CONTROLTARGET');
                const value         = script.getNumberValue('VALUE');

                return Entry.robolink_base.sendControlQuadSingle(script, 0x10, controlTarget, value, 0, false);
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax    : 'Drone.control_quad_one(%1, %2)',
                        textParams: [
                            {
                                type   : 'Dropdown',
                                options: [
                                    [Lang.Blocks.drone_control_quad_roll,     'control_quad8_roll'],
                                    [Lang.Blocks.drone_control_quad_pitch,    'control_quad8_pitch'],
                                    [Lang.Blocks.drone_control_quad_yaw,      'control_quad8_yaw'],
                                    [Lang.Blocks.drone_control_quad_throttle, 'control_quad8_throttle'],
                                ],
                                value     : 'control_quad8_pitch',
                                fontSize  : 11,
                                bgColor   : EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter : Entry.block.converters.returnStringValue,
                            },
                            {
                                type  : 'Block',
                                accept: 'string',
                            },
                        ],
                    },
                ],
            },
        },

        robolink_codrone_edu_drone_control_quad_one_delay: {
            color     : EntryStatic.colorSet.block.default.HARDWARE,
            outerLine : EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton  : 'basic',
            statements: [],
            params    : [
                {
                    type   : 'Dropdown',
                    options: [
                        [Lang.Blocks.drone_control_quad_roll,     'control_quad8_roll'],
                        [Lang.Blocks.drone_control_quad_pitch,    'control_quad8_pitch'],
                        [Lang.Blocks.drone_control_quad_yaw,      'control_quad8_yaw'],
                        [Lang.Blocks.drone_control_quad_throttle, 'control_quad8_throttle'],
                    ],
                    value     : 'control_quad8_pitch',
                    fontSize  : 11,
                    bgColor   : EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                { type: 'Block', accept: 'string' },
                { type: 'Block', accept: 'string' },
                { type: 'Indicator', img: 'block_icon/hardware_icon.svg', size: 12 },
            ],
            events: {},
            def   : {
                params: [
                    null,
                    { type: 'number', params: ['100'] },
                    { type: 'number', params: ['1'] },
                    null,
                ],
                type: 'robolink_codrone_edu_drone_control_quad_one_delay',
            },
            paramsKeyMap: {
                CONTROLTARGET: 0,
                VALUE        : 1,
                TIME         : 2,
            },
            class   : 'control_quad',
            isNotFor: ['robolink_codrone_edu'],
            func(sprite, script)
            {
                const controlTarget = script.getField('CONTROLTARGET');
                const value         = script.getNumberValue('VALUE');
                const time          = script.getNumberValue('TIME') * 1000;

                return Entry.robolink_base.sendControlQuadSingle(script, 0x10, controlTarget, value, time, true);
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax    : 'Drone.control_quad_one_delay(%1, %2, %3)',
                        textParams: [
                            {
                                type   : 'Dropdown',
                                options: [
                                    [Lang.Blocks.drone_control_quad_roll,     'control_quad8_roll'],
                                    [Lang.Blocks.drone_control_quad_pitch,    'control_quad8_pitch'],
                                    [Lang.Blocks.drone_control_quad_yaw,      'control_quad8_yaw'],
                                    [Lang.Blocks.drone_control_quad_throttle, 'control_quad8_throttle'],
                                ],
                                value     : 'control_quad8_pitch',
                                fontSize  : 11,
                                bgColor   : EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter : Entry.block.converters.returnStringValue,
                            },
                            {
                                type  : 'Block',
                                accept: 'string',
                            },
                            {
                                type  : 'Block',
                                accept: 'string',
                            },
                        ],
                    },
                ],
            },
        },

        robolink_codrone_edu_drone_control_quad: {
            color     : EntryStatic.colorSet.block.default.HARDWARE,
            outerLine : EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton  : 'basic',
            statements: [],
            params    : [
                { type: 'Block', accept: 'string' },
                { type: 'Block', accept: 'string' },
                { type: 'Block', accept: 'string' },
                { type: 'Block', accept: 'string' },
                { type: 'Indicator', img: 'block_icon/hardware_icon.svg', size: 12 },
            ],
            events: {},
            def   : {
                params: [
                    { type: 'number', params: ['0'] },
                    { type: 'number', params: ['0'] },
                    { type: 'number', params: ['0'] },
                    { type: 'number', params: ['0'] },
                    null,
                ],
                type: 'robolink_codrone_edu_drone_control_quad',
            },
            paramsKeyMap: {
                ROLL    : 0,
                PITCH   : 1,
                YAW     : 2,
                THROTTLE: 3,
            },
            class   : 'control_quad',
            isNotFor: ['robolink_codrone_edu'],
            func(sprite, script)
            {
                const roll     = script.getNumberValue('ROLL');
                const pitch    = script.getNumberValue('PITCH');
                const yaw      = script.getNumberValue('YAW');
                const throttle = script.getNumberValue('THROTTLE');

                return Entry.robolink_base.sendControlQuad(script, 0x10, roll, pitch, yaw, throttle, 0, false);
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax    : 'Drone.control_quad(%1, %2, %3, %4)',
                        textParams: [
                            {
                                type  : 'Block',
                                accept: 'string',
                            },
                            {
                                type  : 'Block',
                                accept: 'string',
                            },
                            {
                                type  : 'Block',
                                accept: 'string',
                            },
                            {
                                type  : 'Block',
                                accept: 'string',
                            },
                        ],
                    },
                ],
            },
        },

        robolink_codrone_edu_drone_control_quad_delay: {
            color     : EntryStatic.colorSet.block.default.HARDWARE,
            outerLine : EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton  : 'basic',
            statements: [],
            params    : [
                { type: 'Block', accept: 'string' },
                { type: 'Block', accept: 'string' },
                { type: 'Block', accept: 'string' },
                { type: 'Block', accept: 'string' },
                { type: 'Block', accept: 'string' },
                { type: 'Indicator', img: 'block_icon/hardware_icon.svg', size: 12 },
            ],
            events: {},
            def   : {
                params: [
                    { type: 'number', params: ['0'] },
                    { type: 'number', params: ['0'] },
                    { type: 'number', params: ['0'] },
                    { type: 'number', params: ['0'] },
                    { type: 'number', params: ['1'] },
                    null,
                ],
                type: 'robolink_codrone_edu_drone_control_quad_delay',
            },
            paramsKeyMap: {
                ROLL    : 0,
                PITCH   : 1,
                YAW     : 2,
                THROTTLE: 3,
                TIME    : 4,
            },
            class   : 'control_quad',
            isNotFor: ['robolink_codrone_edu'],
            func(sprite, script)
            {
                const roll     = script.getNumberValue('ROLL');
                const pitch    = script.getNumberValue('PITCH');
                const yaw      = script.getNumberValue('YAW');
                const throttle = script.getNumberValue('THROTTLE');
                const time     = script.getNumberValue('TIME') * 1000;

                return Entry.robolink_base.sendControlQuad(script, 0x10, roll, pitch, yaw, throttle, time, true);
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax    : 'Drone.control_quad_delay(%1, %2, %3, %4, %5)',
                        textParams: [
                            {
                                type  : 'Block',
                                accept: 'string',
                            },
                            {
                                type  : 'Block',
                                accept: 'string',
                            },
                            {
                                type  : 'Block',
                                accept: 'string',
                            },
                            {
                                type  : 'Block',
                                accept: 'string',
                            },
                            {
                                type  : 'Block',
                                accept: 'string',
                            },
                        ],
                    },
                ],
            },
        },

        robolink_codrone_edu_drone_control_position_one: {
            color     : EntryStatic.colorSet.block.default.HARDWARE,
            outerLine : EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton  : 'basic',
            statements: [],
            params    : [
                {
                    type   : 'Dropdown',
                    options: [
                        [Lang.Blocks.drone_control_quad_pitch_forward,  'pitch_forward'],
                        [Lang.Blocks.drone_control_quad_pitch_backward, 'pitch_backward'],
                        [Lang.Blocks.drone_control_quad_roll_left,      'roll_left'],
                        [Lang.Blocks.drone_control_quad_roll_right,     'roll_right'],
                        [Lang.Blocks.drone_control_quad_throttle_up,    'throttle_up'],
                        [Lang.Blocks.drone_control_quad_throttle_down,  'throttle_down'],
                    ],
                    value     : 'pitch_forward',
                    fontSize  : 11,
                    bgColor   : EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                { type: 'Block', accept: 'string' },
                { type: 'Block', accept: 'string' },
                {
                    type   : 'Dropdown',
                    options: [
                        [Lang.Blocks.common_next, 0],
                        [Lang.Blocks.common_wait, 1],
                    ],
                    value     : 1,
                    fontSize  : 11,
                    bgColor   : EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                { type: 'Indicator', img: 'block_icon/hardware_icon.svg', size: 12 },
            ],
            events: {},
            def   : {
                params: [null, { type: 'number', params: ['1'] }, { type: 'number', params: ['1'] }, null, null],
                type  : 'robolink_codrone_edu_drone_control_position_one',
            },
            paramsKeyMap: {
                CONTROLDIRECTION: 0,
                DISTANCE        : 1,
                SPEED           : 2,
                WAIT            : 3,
            },
            class   : 'control_position',
            isNotFor: ['robolink_codrone_edu'],
            func(sprite, script)
            {
                const controlDirection = script.getField('CONTROLDIRECTION');
                const distance         = script.getNumberValue('DISTANCE');
                const speed            = script.getNumberValue('SPEED');
                let   time             = 40;
                const wait             = script.getNumberValue('WAIT');
                
                if( speed > 0 && wait == 1)
                {
                    time = Math.abs(distance / speed) * 1000 + Math.min(1000 * speed, 3000) + 3000;
                }

                let x = 0;
                let y = 0;
                let z = 0;

                switch( controlDirection )
                {
                    case    'pitch_forward':   x = distance;   break;
                    case    'pitch_backward':  x = -distance;  break;
                    case    'roll_left':       y = distance;   break;
                    case    'roll_right':      y = -distance;  break;
                    case    'throttle_up':     z = distance;   break;
                    default:                z    = -distance;  break;
                }

                return Entry.robolink_base.sendControlPosition(script, 0x10, x, y, z, speed, 0, 0, time, true);
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax    : 'Drone.control_position_one(%1, %2, %3)',
                        textParams: [
                            {
                                type   : 'Dropdown',
                                options: [
                                    [Lang.Blocks.drone_control_quad_pitch_forward,  'pitch_forward'],
                                    [Lang.Blocks.drone_control_quad_pitch_backward, 'pitch_backward'],
                                    [Lang.Blocks.drone_control_quad_roll_left,      'roll_left'],
                                    [Lang.Blocks.drone_control_quad_roll_right,     'roll_right'],
                                    [Lang.Blocks.drone_control_quad_throttle_up,    'throttle_up'],
                                    [Lang.Blocks.drone_control_quad_throttle_down,  'throttle_down'],
                                ],
                                value     : 'pitch_forward',
                                fontSize  : 11,
                                bgColor   : EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter : Entry.block.converters.returnStringValue,
                            },
                            {
                                type  : 'Block',
                                accept: 'string',
                            },
                            {
                                type  : 'Block',
                                accept: 'string',
                            },
                        ],
                    },
                ],
            },
        },

        robolink_codrone_edu_drone_control_position_turn: {
            color     : EntryStatic.colorSet.block.default.HARDWARE,
            outerLine : EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton  : 'basic',
            statements: [],
            params    : [
                {
                    type   : 'Dropdown',
                    options: [
                        [Lang.Blocks.drone_control_quad_yaw_cw,  '-1'],
                        [Lang.Blocks.drone_control_quad_yaw_ccw, '+1'],
                    ],
                    value     : '+1',
                    fontSize  : 11,
                    bgColor   : EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                { type: 'Block', accept: 'string' },
                { type: 'Block', accept: 'string' },
                {
                    type   : 'Dropdown',
                    options: [
                        [Lang.Blocks.common_next, 0],
                        [Lang.Blocks.common_wait, 1],
                    ],
                    value     : 1,
                    fontSize  : 11,
                    bgColor   : EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                { type: 'Indicator', img: 'block_icon/hardware_icon.svg', size: 12 },
            ],
            events: {},
            def   : {
                params: [
                    null,
                    { type: 'number', params: ['90'] },
                    { type: 'number', params: ['45'] },
                    null,
                    null
                ],
                type: 'robolink_codrone_edu_drone_control_position_turn',
            },
            paramsKeyMap: {
                DIRECTION_YAW: 0,
                DEGREE_YAW   : 1,
                SPEED_YAW    : 2,
                WAIT         : 3,
            },
            class   : 'control_position',
            isNotFor: ['robolink_codrone_edu'],
            func(sprite, script)
            {
                const directionYaw = script.getNumberValue('DIRECTION_YAW');
                const degree       = script.getNumberValue('DEGREE_YAW');
                const yaw          = directionYaw * degree;
                const speedYaw     = script.getNumberValue('SPEED_YAW');
                const wait             = script.getNumberValue('WAIT');

                let time = 40;

                if( speedYaw > 0 && wait == 1)
                {
                    time = Math.abs(degree / speedYaw) * 2 * 1000 + 3000;
                }

                return Entry.robolink_base.sendControlPosition(script, 0x10, 0, 0, 0, 0, yaw, speedYaw, time, true);
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax    : 'Drone.control_position_turn(%1, %2, %3)',
                        textParams: [
                            {
                                type   : 'Dropdown',
                                options: [
                                    [Lang.Blocks.drone_control_quad_yaw_cw,  '-1'],
                                    [Lang.Blocks.drone_control_quad_yaw_ccw, '+1'],
                                ],
                                value     : '+1',
                                fontSize  : 11,
                                bgColor   : EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter : Entry.block.converters.returnStringValue,
                            },
                            {
                                type  : 'Block',
                                accept: 'string',
                            },
                            {
                                type  : 'Block',
                                accept: 'string',
                            },
                        ],
                    },
                ],
            },
        },

        robolink_codrone_edu_drone_control_position_location: {
            color     : EntryStatic.colorSet.block.default.HARDWARE,
            outerLine : EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton  : 'basic',
            statements: [],
            params    : [
                {
                    type   : 'Dropdown',
                    options: [
                        [Lang.Blocks.drone_control_quad_pitch_forward,  '+1'],
                        [Lang.Blocks.drone_control_quad_pitch_backward, '-1'],
                    ],
                    value     : '+1',
                    fontSize  : 11,
                    bgColor   : EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                { type: 'Block', accept: 'string' },
                {
                    type   : 'Dropdown',
                    options: [
                        [Lang.Blocks.drone_control_quad_roll_left,      '+1'],
                        [Lang.Blocks.drone_control_quad_roll_right,     '-1'],
                    ],
                    value     : '+1',
                    fontSize  : 11,
                    bgColor   : EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                { type: 'Block', accept: 'string' },
                {
                    type   : 'Dropdown',
                    options: [
                        [Lang.Blocks.drone_control_quad_throttle_up,    '+1'],
                        [Lang.Blocks.drone_control_quad_throttle_down,  '-1'],
                    ],
                    value     : '+1',
                    fontSize  : 11,
                    bgColor   : EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                { type: 'Block', accept: 'string' },
                { type: 'Block', accept: 'string' },
                {
                    type   : 'Dropdown',
                    options: [
                        [Lang.Blocks.common_next, 0],
                        [Lang.Blocks.common_wait, 1],
                    ],
                    value     : 1,
                    fontSize  : 11,
                    bgColor   : EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                { type: 'Indicator', img: 'block_icon/hardware_icon.svg', size: 12 },
            ],
            events: {},
            def   : {
                params: [
                    null,
                    { type: 'number', params: ['1'] },
                    null,
                    { type: 'number', params: ['0'] },
                    null,
                    { type: 'number', params: ['0'] },
                    { type: 'number', params: ['1'] },
                    null,
                    null],
                type: 'robolink_codrone_edu_drone_control_position_location',
            },
            paramsKeyMap: {
                DIRECTION_PITCH   : 0,
                DISTANCE_PITCH    : 1,
                DIRECTION_ROLL    : 2,
                DISTANCE_ROLL     : 3,
                DIRECTION_THROTTLE: 4,
                DISTANCE_THROTTLE : 5,
                SPEED             : 6,
                WAIT              : 7,
            },
            class   : 'control_position',
            isNotFor: ['robolink_codrone_edu'],
            func(sprite, script)
            {
                const directionPitch    = script.getNumberValue('DIRECTION_PITCH');
                const directionRoll     = script.getNumberValue('DIRECTION_ROLL');
                const directionThrottle = script.getNumberValue('DIRECTION_THROTTLE');
                
                const x = directionPitch     * script.getNumberValue('DISTANCE_PITCH');
                const y = directionRoll      * script.getNumberValue('DISTANCE_ROLL');
                const z = directionThrottle  * script.getNumberValue('DISTANCE_THROTTLE');

                const distance = Math.sqrt((x * x) + (y * y) + (z * z));

                const speed = script.getNumberValue('SPEED');

                const wait             = script.getNumberValue('WAIT');

                let time = 40;

                if( speed > 0 && wait == 1) 
                {
                    time = Math.abs(distance / speed) * 1000 + Math.min(1000 * speed, 3000) + 3000;
                }

                return Entry.robolink_base.sendControlPosition(script, 0x10, x, y, z, speed, 0, 0, time, true);
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax    : 'Drone.control_position_location(%1, %2, %3, %4, %5, %6, %7)',
                        textParams: [
                            {
                                type   : 'Dropdown',
                                options: [
                                    [Lang.Blocks.drone_control_quad_pitch_forward,  '+1'],
                                    [Lang.Blocks.drone_control_quad_pitch_backward, '-1'],
                                ],
                                value     : '+1',
                                fontSize  : 11,
                                bgColor   : EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter : Entry.block.converters.returnStringValue,
                            },
                            {
                                type  : 'Block',
                                accept: 'string',
                            },
                            {
                                type   : 'Dropdown',
                                options: [
                                    [Lang.Blocks.drone_control_quad_roll_left,      '+1'],
                                    [Lang.Blocks.drone_control_quad_roll_right,     '-1'],
                                ],
                                value     : '+1',
                                fontSize  : 11,
                                bgColor   : EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter : Entry.block.converters.returnStringValue,
                            },
                            {
                                type  : 'Block',
                                accept: 'string',
                            },
                            {
                                type   : 'Dropdown',
                                options: [
                                    [Lang.Blocks.drone_control_quad_throttle_up,    '+1'],
                                    [Lang.Blocks.drone_control_quad_throttle_down,  '-1'],
                                ],
                                value     : '+1',
                                fontSize  : 11,
                                bgColor   : EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter : Entry.block.converters.returnStringValue,
                            },
                            {
                                type  : 'Block',
                                accept: 'string',
                            },
                            {
                                type  : 'Block',
                                accept: 'string',
                            },
                        ],
                    },
                ],
            },
        },

        robolink_codrone_edu_drone_control_position_location_turn: {
            color     : EntryStatic.colorSet.block.default.HARDWARE,
            outerLine : EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton  : 'basic',
            statements: [],
            params    : [
                {
                    type   : 'Dropdown',
                    options: [
                        [Lang.Blocks.drone_control_quad_pitch_forward,  '+1'],
                        [Lang.Blocks.drone_control_quad_pitch_backward, '-1'],
                    ],
                    value     : '+1',
                    fontSize  : 11,
                    bgColor   : EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                { type: 'Block', accept: 'string' },
                {
                    type   : 'Dropdown',
                    options: [
                        [Lang.Blocks.drone_control_quad_roll_left,      '+1'],
                        [Lang.Blocks.drone_control_quad_roll_right,     '-1'],
                    ],
                    value     : '+1',
                    fontSize  : 11,
                    bgColor   : EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                { type: 'Block', accept: 'string' },
                {
                    type   : 'Dropdown',
                    options: [
                        [Lang.Blocks.drone_control_quad_throttle_up,    '+1'],
                        [Lang.Blocks.drone_control_quad_throttle_down,  '-1'],
                    ],
                    value     : '+1',
                    fontSize  : 11,
                    bgColor   : EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                { type: 'Block', accept: 'string' },
                { type: 'Block', accept: 'string' },
                {
                    type   : 'Dropdown',
                    options: [
                        [Lang.Blocks.drone_control_quad_yaw_cw,  '-1'],
                        [Lang.Blocks.drone_control_quad_yaw_ccw, '+1'],
                    ],
                    value     : '+1',
                    fontSize  : 11,
                    bgColor   : EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                { type: 'Block', accept: 'string' },
                { type: 'Block', accept: 'string' },
                { type: 'Indicator', img: 'block_icon/hardware_icon.svg', size: 12 },
            ],
            events: {},
            def   : {
                params: [
                    null,
                    { type: 'number', params: ['1'] },
                    null,
                    { type: 'number', params: ['0'] },
                    null,
                    { type: 'number', params: ['0'] },
                    { type: 'number', params: ['1'] },
                    null,
                    { type: 'number', params: ['90'] },
                    { type: 'number', params: ['45'] },
                    null],
                type: 'robolink_codrone_edu_drone_control_position_location_turn',
            },
            paramsKeyMap: {
                DIRECTION_PITCH   : 0,
                DISTANCE_PITCH    : 1,
                DIRECTION_ROLL    : 2,
                DISTANCE_ROLL     : 3,
                DIRECTION_THROTTLE: 4,
                DISTANCE_THROTTLE : 5,
                SPEED             : 6,
                DIRECTION_YAW     : 7,
                DEGREE_YAW        : 8,
                SPEED_YAW         : 9,
            },
            class   : 'control_position',
            isNotFor: ['robolink_codrone_edu'],
            func(sprite, script)
            {
                const directionPitch    = script.getNumberValue('DIRECTION_PITCH');
                const directionRoll     = script.getNumberValue('DIRECTION_ROLL');
                const directionThrottle = script.getNumberValue('DIRECTION_THROTTLE');
                
                const x = directionPitch     * script.getNumberValue('DISTANCE_PITCH');
                const y = directionRoll      * script.getNumberValue('DISTANCE_ROLL');
                const z = directionThrottle  * script.getNumberValue('DISTANCE_THROTTLE');

                const distance = Math.sqrt((x * x) + (y * y) + (z * z));
                const speed    = script.getNumberValue('SPEED');

                const directionYaw = script.getNumberValue('DIRECTION_YAW');
                const degree       = script.getNumberValue('DEGREE_YAW');
                const yaw          = directionYaw * degree;
                const speedYaw     = script.getNumberValue('SPEED_YAW');

                let timePosition = 0;
                let timeRotation = 0;

                if( speed > 0 )
                {
                    timePosition = Math.abs(distance / speed) * 1000 + Math.min(1000 * speed, 3000) + 3000;
                }

                if( speedYaw > 0 )
                {
                    timeRotation = Math.abs(degree / speedYaw) * 2 * 1000 + 3000;
                }

                const time = Math.max(timePosition, timeRotation);

                return Entry.robolink_base.sendControlPosition(script, 0x10, x, y, z, speed, yaw, speedYaw, time, true);
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax    : 'Drone.control_position_location_turn(%1, %2, %3, %4, %5, %6, %7, %8, %9, %10)',
                        textParams: [
                            {
                                type   : 'Dropdown',
                                options: [
                                    [Lang.Blocks.drone_control_quad_pitch_forward,  '+1'],
                                    [Lang.Blocks.drone_control_quad_pitch_backward, '-1'],
                                ],
                                value     : '+1',
                                fontSize  : 11,
                                bgColor   : EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter : Entry.block.converters.returnStringValue,
                            },
                            {
                                type  : 'Block',
                                accept: 'string',
                            },
                            {
                                type   : 'Dropdown',
                                options: [
                                    [Lang.Blocks.drone_control_quad_roll_left,      '+1'],
                                    [Lang.Blocks.drone_control_quad_roll_right,     '-1'],
                                ],
                                value     : '+1',
                                fontSize  : 11,
                                bgColor   : EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter : Entry.block.converters.returnStringValue,
                            },
                            {
                                type  : 'Block',
                                accept: 'string',
                            },
                            {
                                type   : 'Dropdown',
                                options: [
                                    [Lang.Blocks.drone_control_quad_throttle_up,    '+1'],
                                    [Lang.Blocks.drone_control_quad_throttle_down,  '-1'],
                                ],
                                value     : '+1',
                                fontSize  : 11,
                                bgColor   : EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter : Entry.block.converters.returnStringValue,
                            },
                            {
                                type  : 'Block',
                                accept: 'string',
                            },
                            {
                                type  : 'Block',
                                accept: 'string',
                            },
                            {
                                type   : 'Dropdown',
                                options: [
                                    [Lang.Blocks.drone_control_quad_yaw_cw,  '-1'],
                                    [Lang.Blocks.drone_control_quad_yaw_ccw, '+1'],
                                ],
                                value     : '-1',
                                fontSize  : 11,
                                bgColor   : EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter : Entry.block.converters.returnStringValue,
                            },
                            {
                                type  : 'Block',
                                accept: 'string',
                            },
                            {
                                type  : 'Block',
                                accept: 'string',
                            },
                        ],
                    },
                ],
            },
        },
    };
};


module.exports = Entry.robolink_codrone_edu;

