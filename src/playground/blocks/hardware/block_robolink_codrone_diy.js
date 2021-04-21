/* eslint-disable prettier/prettier */
/* eslint-disable brace-style */
/* eslint-disable max-len */
/* jshint esversion: 6 */
'use strict';

/***************************************************************************************
 *  장치 기본 정의
 ***************************************************************************************/

Entry.robolink_codrone_diy = 
{
    id       : '4A.1',
    name     : 'robolink_codrone_diy',
    url      : 'http://www.robolink.co.kr',
    imageName: 'robolink_codrone_diy.png',
    title    : {
        en: 'ROBOLINK CODRONE DIY',
        ko: '로보링크 코드론 DIY',
    },

    // 엔트리 정지시 하드웨어 초기화 로직
    setZero() {
        // 초기화
        Entry.byrobot_base.transferBufferClear();

        // 한 번에 명령을 전송하면 hw까지 제대로 전달되지 않는 경우가 있어
        // 명령을 각각 분리하여 전송하게 함(2017.01.03)
        for (let i = 0; i < 1; i++) {
            if (Entry.hw.portData['state_modeFlight'] == 0x10)
            {
                Entry.byrobot_base.transferCommand(0x10, 0x01, 0); // 드론, command = 0x01 (Stop)
            }
            else
            {
                Entry.byrobot_base.transferCommand(0x10, 0x07, 0x12); // 0x12 : FlightEvent::Landing
            }
            Entry.byrobot_base.transferBuzzer(0x20, 0, 0, 0);
            Entry.byrobot_base.transferLightManual(0x10, 0xffff, 0); // LED 초기화(모두 꺼짐)
            Entry.byrobot_base.transferLightManual(0x20, 0xffff, 0); // LED 초기화(모두 꺼짐)
            Entry.byrobot_base.transferLightModeColor(0x10, 0x22, 200, 255, 0, 0); // LED 초기화(드론)
            Entry.byrobot_base.transferLightModeColor(0x20, 0x22, 200, 255, 0, 0); // LED 초기화(조종기)
        }
    },
};


/***************************************************************************************
 *  언어 적용
 ***************************************************************************************/
Entry.robolink_codrone_diy.setLanguage = function () {
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
                monitor_altitude_temperature                    : '온도',
                monitor_altitude_pressure                       : '기압',
                monitor_altitude_altitude                       : '해발 고도',
                monitor_altitude_rangeHeight                    : '지면과의 거리',
                monitor_position_x                              : '위치 X',
                monitor_position_y                              : '위치 Y',
                monitor_position_z                              : '위치 Z',
                monitor_motion_accelX                           : '가속도 X',
                monitor_motion_accelY                           : '가속도 Y',
                monitor_motion_accelZ                           : '가속도 Z',
                monitor_motion_gyroRoll                         : '자이로 Roll',
                monitor_motion_gyroPitch                        : '자이로 Pitch',
                monitor_motion_gyroYaw                          : '자이로 Yaw',
                monitor_motion_angleRoll                        : '자세 Roll',
                monitor_motion_anglePitch                       : '자세 Pitch',
                monitor_motion_angleYaw                         : '자세 Yaw',
                monitor_trim_roll                               : '미세 조정 Roll',
                monitor_trim_pitch                              : '미세 조정 Pitch',
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
                monitor_entry_hw_count_transfer_reserved        : '전송 예정 데이터',

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
                common_light_mode_hold                  : '유지하기',
                common_light_mode_flicker               : '깜빡이기',
                common_light_mode_flicker_double        : '두번 깜빡이기',
                common_light_mode_dimming               : '천천히 점멸',
                common_light_mode_sunrise               : '천천히 밝아짐',
                common_light_mode_sunset                : '천천히 어두워짐',
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
                common_button_button                    : '버튼 입력',
                common_button_event                     : '버튼 상태',
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
                controller_joystick_direction_left_up   : '왼쪽 위',
                controller_joystick_direction_up        : '위',
                controller_joystick_direction_right_up  : '오른쪽 위',
                controller_joystick_direction_left      : '왼쪽',
                controller_joystick_direction_center    : '중앙',
                controller_joystick_direction_right     : '오른쪽',
                controller_joystick_direction_left_down : '왼쪽 아래',
                controller_joystick_direction_down      : '아래',
                controller_joystick_direction_right_down: '오른쪽 아래',
                controller_joystick_direction           : '방향',
                controller_joystick_event               : '이벤트',
                controller_joystick_x                   : '가로축',
                controller_joystick_y                   : '세로축',
                drone_information_state                 : '비행 상태',
                drone_information_control               : '제어 방식',
                drone_information_movement              : '동작 상태',
                drone_information_headless              : '방향 기준',
                drone_information_speed                 : '속도',
                drone_information_trim_pitch            : '미세조정 피치값',
                drone_information_trim_roll             : '미세조정 롤값',
                drone_information_sensor_orientation    : '센서 방향',
                drone_information_battery               : '배터리 잔량(%)',
                drone_sensor_accel_x                    : 'X방향 가속도',
                drone_sensor_accel_y                    : 'Y방향 가속도',
                drone_sensor_accel_z                    : 'Z방향 가속도',
                drone_sensor_gyro_roll                  : '롤 각속도',
                drone_sensor_gyro_pitch                 : '피치 각속도',
                drone_sensor_gyro_yaw                   : '요우 각속도',
                drone_sensor_temperature                : '드론의 온도',
                drone_sensor_pressure                   : '기압',
                drone_sensor_altitude                   : '해발 고도',
                drone_accel_x                           : 'X방향 가속도',
                drone_accel_y                           : 'Y방향 가속도',
                drone_accel_z                           : 'Z방향 가속도',
                drone_gyro_pitch                        : '피치 각속도',
                drone_gyro_roll                         : '롤 각속도',
                drone_gyro_yaw                          : '요우 각속도',
                drone_attitude_pitch                    : '피치',
                drone_attitude_roll                     : '롤',
                drone_attitude_yaw                      : '요우',
                drone_positionX                         : 'X',
                drone_positionY                         : 'Y',
                drone_positionZ                         : 'Z',
                drone_level_1                           : '레벨 1',
                drone_level_2                           : '레벨 2',
                drone_level_3                           : '레벨 3',
                drone_flip_forward                      : '앞',
                drone_flip_rear                         : '뒤',
                drone_flip_left                         : '왼쪽',
                drone_flip_right                        : '오른쪽',
                drone_trim_roll_increase                : '롤 증가',
                drone_trim_roll_decrease                : '롤 감소',
                drone_trim_pitch_increase               : '피치 증가',
                drone_trim_pitch_decrease               : '피치 감소',
                drone_trim_yaw_increase                 : '요 증가',
                drone_trim_yaw_decrease                 : '요 감소',
                drone_trim_throttle_increase            : '쓰로틀 증가',
                drone_trim_throttle_decrease            : '쓰로틀 감소',
                drone_trim_reset                        : '초기화',
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
                drone_headless_off                      : '끄기',
                drone_headless_on                       : '켜기',
                drone_light_color_body                  : '몸체',
                drone_light_manual_body_blue            : '파랑',
                drone_light_manual_body_green           : '초록',
                drone_light_manual_body_red             : '빨강',
                drone_motor_rotation_clockwise          : '시계 방향',
                drone_motor_rotation_counterclockwise   : '반시계 방향',
                drone_altitude                          : '해발고도',
                drone_range_height                      : '바닥과의 거리',
                drone_state_mode_system                 : '시스템 모드',
                drone_state_mode_flight                 : '비행 동작 상태',
                drone_state_mode_control_flight         : '비행 제어 모드',
                drone_state_mode_movement               : '이동 상태',
                drone_state_headless                    : 'Headless',
                drone_state_control_speed               : '제어 속도',
                drone_state_sensor_orientation          : '센서 방향',
                drone_state_battery                     : '배터리',
                entry_hw_count_transfer_reserved        : '전송 예약된 데이터 수',
            },

            template: {
                robolink_codrone_diy_controller_buzzer_hz                : '%1Hz 소리를 연주 %2',
                robolink_codrone_diy_controller_buzzer_hz_delay          : '%1Hz 소리를 %2초 연주 %3',
                robolink_codrone_diy_controller_buzzer_hz_reserve        : '%1Hz 소리를 %2초 예약 %3',
                robolink_codrone_diy_controller_buzzer_off               : '버저 끄기 %1',
                robolink_codrone_diy_controller_buzzer_scale             : '%1 옥타브 %2을(를) 연주 %3',
                robolink_codrone_diy_controller_buzzer_scale_delay       : '%1 옥타브 %2을(를) %3초 연주 %4',
                robolink_codrone_diy_controller_buzzer_scale_reserve     : '%1 옥타브 %2을(를) %3초 예약 %4',
                robolink_codrone_diy_controller_if_button_press          : '조종기 %1 눌렀을 때',
                robolink_codrone_diy_controller_if_joystick_direction    : '조종기 %1 조이스틱 %2 (으)로 움직였을 때',
                robolink_codrone_diy_controller_value_button             : '버튼 입력',
                robolink_codrone_diy_controller_value_button_event       : '버튼 상태',
                robolink_codrone_diy_controller_value_joystick_left      : '왼쪽 조이스틱 %1',
                robolink_codrone_diy_controller_value_joystick_right     : '오른쪽 조이스틱 %1',
                robolink_codrone_diy_drone_trim_direction                : '미세조정 %1 %2',
                robolink_codrone_diy_drone_trim                          : '미세조정 롤 %1, 피치 %2 %3',
                robolink_codrone_diy_drone_speed                         : '속도 %1 %2',
                robolink_codrone_diy_drone_flip                          : '재주넘기 %1 %2',
                robolink_codrone_diy_drone_sensor_reset                  : '센서 초기화 %1',
                robolink_codrone_diy_drone_control_headless              : '헤드리스 %1 %2',
                robolink_codrone_diy_drone_control_drone_landing         : '착륙하기 %1',
                robolink_codrone_diy_drone_control_drone_reset_heading   : '드론 방향 초기화 %1',
                robolink_codrone_diy_drone_control_drone_stop            : '멈춤 %1',
                robolink_codrone_diy_drone_control_drone_takeoff         : '이륙하기 %1',
                robolink_codrone_diy_drone_control_quad_one              : '드론 %1 %2% 정하기 %3',
                robolink_codrone_diy_drone_control_quad_one_delay        : '드론 %1 %2% %3 초 실행 %4',
                robolink_codrone_diy_drone_control_quad                  : '드론 Roll %1%, Pitch %2%, Yaw %3%, Throttle %4% 정하기 %5',
                robolink_codrone_diy_drone_control_quad_delay            : '드론 Roll %1%, Pitch %2%, Yaw %3%, Throttle %4% %5초 실행 %6',
                robolink_codrone_diy_drone_control_position_one          : '드론 %1(으)로 %2m를 %3m/s로 이동 %4',
                robolink_codrone_diy_drone_control_position_turn         : '드론 %1(으)로 %2도를 %3deg/s로 회전 %4',
                robolink_codrone_diy_drone_control_position_location     : '드론 %1 %2m, %3 %4m, %5 %6m를 %7m/s로 이동 %8',
                robolink_codrone_diy_drone_control_position_location_turn: '드론 %1 %2m, %3 %4m, %5 %6m를 %7m/s로 이동, %8 %9도를 %10deg/s로 회전 %11',
                robolink_codrone_diy_drone_light_color_input             : '드론 LED R %1, G %2, B %3 %4 %5 %6',
                robolink_codrone_diy_drone_light_color_select            : '드론 LED %1 %2 %3 %4',
                robolink_codrone_diy_drone_light_color_preset            : '드론 LED %1 %2 %3',
                robolink_codrone_diy_drone_light_manual_single_input     : '드론 LED %1 밝기 %2 %3',
                robolink_codrone_diy_drone_light_manual_single_off       : '드론 LED 끄기 %1',
                robolink_codrone_diy_drone_motor_stop                    : '드론 모터 정지 %1',
                robolink_codrone_diy_drone_motorsingle_input             : '드론 %1번 모터를 %2(으)로 회전 %3',
                robolink_codrone_diy_drone_information                   : '드론 정보 %1',
                robolink_codrone_diy_drone_sensor                        : '센서값 %1',
                robolink_codrone_diy_drone_value_position                : '위치 %1',
            },

            Helper: {
                robolink_codrone_diy_controller_buzzer_hz                : "<br>지정한 주파수의 소리를 계속해서 연주합니다(최대 60초). 권장 사용 범위는 250 ~ 8000 입니다. 4옥타브를 기준으로 도(261), 도#(277), 레(293), 레#(311), 미(329), 파(349), 파#(370), 솔(392), 솔#(415), 라(440), 라#(466), 시(493)입니다. 여기에서 한 옥타브를 올라갈 때마다 주파수 값이 두 배가 됩니다. 한 옥타브를 내려갈 때에는 주파수 값이 절반이 됩니다. 예를 들면 3옥타브의 도는 130.8128Hz, 4옥타브의 도는 261.6256Hz, 5옥타브의 도는 523.2511Hz 입니다. 이 블럭을 만났을 경우 소리가 켜져있거나 예약된 소리가 있다면 모두 삭제합니다. 이 블럭은 연주 명령을 실행 후 바로 다음 블럭으로 넘어갑니다.<br><br><font color='crimson'>#조종기</font> <font color='dodgerblue'>#버저</font> <font color='forestgreen'>#주파수</font> <font color='peru'>#즉시</font>",
                robolink_codrone_diy_controller_buzzer_hz_delay          : "<br>지정한 주파수의 소리를 지정한 시간동안 연주합니다. 권장 사용 범위는 250 ~ 8000 입니다. 4옥타브를 기준으로 도(261), 도#(277), 레(293), 레#(311), 미(329), 파(349), 파#(370), 솔(392), 솔#(415), 라(440), 라#(466), 시(493)입니다. 여기에서 한 옥타브를 올라갈 때마다 주파수 값이 두 배가 됩니다. 한 옥타브를 내려갈 때에는 주파수 값이 절반이 됩니다. 예를 들면 3옥타브의 도는 130.8128Hz, 4옥타브의 도는 261.6256Hz, 5옥타브의 도는 523.2511Hz 입니다. 이 블럭을 만났을 경우 소리가 켜져있거나 예약된 소리가 있다면 모두 삭제합니다. 이 블럭을 사용하면 소리가 끝날때까지 다음 블럭으로 넘어가지 않습니다.<br><br><font color='crimson'>#조종기</font> <font color='dodgerblue'>#버저</font> <font color='forestgreen'>#음계</font> <font color='peru'>#즉시</font> <font color='blueviolet'>#시간지연</font>",
                robolink_codrone_diy_controller_buzzer_hz_reserve        : "<br>지정한 주파수의 소리를 지정한 시간동안 연주하도록 예약합니다. 권장 사용 범위는 250 ~ 8000 입니다. 4옥타브를 기준으로 도(261), 도#(277), 레(293), 레#(311), 미(329), 파(349), 파#(370), 솔(392), 솔#(415), 라(440), 라#(466), 시(493)입니다. 여기에서 한 옥타브를 올라갈 때마다 주파수 값이 두 배가 됩니다. 한 옥타브를 내려갈 때에는 주파수 값이 절반이 됩니다. 예를 들면 3옥타브의 도는 130.8128Hz, 4옥타브의 도는 261.6256Hz, 5옥타브의 도는 523.2511Hz 입니다. 이 블럭은 소리가 나도록 예약하고, 바로 다음 블럭으로 넘어갑니다. 예약은 최대 12개까지 누적할 수 있습니다. 이 블럭은 주로 버저 소리와 함께 다른 행동을 동시에 할 때 사용합니다.<br><br><font color='crimson'>#조종기</font> <font color='dodgerblue'>#버저</font> <font color='forestgreen'>#주파수</font> <font color='peru'>#예약</font>",
                robolink_codrone_diy_controller_buzzer_off               : "<br>버저 작동을 중단합니다. 예약된 소리가 있다면 모두 삭제합니다.<br><br><font color='crimson'>#조종기</font> <font color='dodgerblue'>#버저끄기</font>",
                robolink_codrone_diy_controller_buzzer_scale             : "<br>지정한 옥타브의 음을 계속해서 연주합니다(최대 60초). 이 블럭을 만났을 경우 소리가 켜져있거나 예약된 소리가 있다면 모두 삭제합니다. 이 블럭은 연주 명령을 실행 후 바로 다음 블럭으로 넘어갑니다.<br><br><font color='crimson'>#조종기</font> <font color='dodgerblue'>#버저</font> <font color='forestgreen'>#음계</font> <font color='peru'>#즉시</font>",
                robolink_codrone_diy_controller_buzzer_scale_delay       : "<br>지정한 옥타브의 음을 지정한 시간동안 연주합니다. 이 블럭을 만났을 경우 소리가 켜져있거나 예약된 소리가 있다면 모두 삭제합니다. 이 블럭을 사용하면 소리가 끝날때까지 다음 블럭으로 넘어가지 않습니다.<br><br><font color='crimson'>#조종기</font> <font color='dodgerblue'>#버저</font> <font color='forestgreen'>#음계</font> <font color='peru'>#즉시</font> <font color='blueviolet'>#시간지연</font>",
                robolink_codrone_diy_controller_buzzer_scale_reserve     : "<br>지정한 옥타브의 음을 지정한 시간동안 연주하도록 예약합니다. 이 블럭은 소리가 나도록 예약하고 바로 다음 블럭으로 넘어갑니다. 예약은 최대 12개까지 누적할 수 있습니다. 이 블럭은 주로 버저 소리와 함께 다른 행동을 동시에 할 때 사용합니다.<br><br><font color='crimson'>#조종기</font> <font color='dodgerblue'>#버저</font> <font color='forestgreen'>#음계</font> <font color='peru'>#예약</font>",
                robolink_codrone_diy_controller_if_button_press          : "<br>지정한 조종기의 버튼이 눌러졌을 때 true를 반환합니다.<br><br><font color='crimson'>#조건</font> <font color='dodgerblue'>#조종기</font> <font color='forestgreen'>#버튼</font>",
                robolink_codrone_diy_controller_if_joystick_direction    : "<br>조종기의 조이스틱을 지정한 방향으로 움직였을 때 true를 반환합니다.<br><br><font color='crimson'>#조건</font> <font color='dodgerblue'>#조종기</font> <font color='forestgreen'>#조이스틱</font>",
                robolink_codrone_diy_controller_value_button             : "<br>조종기 전체 버튼 입력 상태를 비트 플래그로 반환합니다.<br><br><font color='crimson'>#값</font> <font color='dodgerblue'>#조종기</font> <font color='forestgreen'>#버튼</font>",
                robolink_codrone_diy_controller_value_button_event       : "<br>조종기 버튼 중 현재 사용 중인 버튼의 입력 상태를 반환합니다.<br><br><font color='crimson'>#값</font> <font color='dodgerblue'>#조종기</font> <font color='forestgreen'>#버튼</font>",
                robolink_codrone_diy_controller_value_joystick_left      : "<br>조종기의 조이스틱과 관련된 입력 값을 반환합니다. 각 축의 범위는 -100 ~ 100 입니다.<br><br>조이스틱 방향은 가로x세로 = 3x3 = 총9방향입니다.<br>위(왼쪽=17, 가운데=18, 오른쪽=20)<br>중간(왼쪽=33, 센터=34, 오른쪽=36)<br>아래(왼쪽=65, 가운데=66, 오른쪽=68)<br>기본값은 센터=34입니다.<br><br>조이스틱 이벤트는 값이 있을때 2, 없으면 0, 진입 1, 벗어남 3입니다.<br><br><font color='crimson'>#값</font> <font color='dodgerblue'>#조종기</font> <font color='forestgreen'>#조이스틱</font>",
                robolink_codrone_diy_controller_value_joystick_right     : "<br>조종기의 조이스틱과 관련된 입력 값을 반환합니다. 각 축의 범위는 -100 ~ 100 입니다.<br><br>조이스틱 방향은 가로x세로 = 3x3 = 총9방향입니다.<br>위(왼쪽=17, 가운데=18, 오른쪽=20)<br>중간(왼쪽=33, 센터=34, 오른쪽=36)<br>아래(왼쪽=65, 가운데=66, 오른쪽=68)<br>기본값은 센터=34입니다.<br><br>조이스틱 이벤트는 값이 있을때 2, 없으면 0, 진입 1, 벗어남 3입니다.<br><br><font color='crimson'>#값</font> <font color='dodgerblue'>#조종기</font> <font color='forestgreen'>#조이스틱</font>",
                robolink_codrone_diy_drone_trim_direction                : "<br>드론 미세 조정 설정을 현재 값에서 5단위로 증가시키거나 감소시킵니다.<br><br><font color='crimson'>#드론</font> <font color='dodgerblue'>#초기화/font>",
                robolink_codrone_diy_drone_trim                          : "<br>드론 미세 조정 설정을 변경합니다.<br><br><font color='crimson'>#드론</font> <font color='dodgerblue'>#초기화/font>",
                robolink_codrone_diy_drone_speed                         : "<br>드론 이동 속도를 변경합니다.<br><br><font color='crimson'>#드론</font> <font color='dodgerblue'>#초기화/font>",
                robolink_codrone_diy_drone_flip                          : "<br>드론을 지정한 방향으로 공중 회전합니다.<br><br><font color='crimson'>#드론</font> <font color='dodgerblue'>#재주넘/font>",
                robolink_codrone_diy_drone_sensor_reset                  : "<br>드론의 자이로 바이어스와 트림 설정을 초기화합니다.<br><br><font color='crimson'>#드론</font> <font color='dodgerblue'>#초기화/font>",
                robolink_codrone_diy_drone_control_headless              : "<br>드론 좌표 기준을 변경합니다. 헤드리스 켜기로 하면 '이륙 시'와 '방향초기화'를 했을 때 드론이 바라보는 방향이 0도로 고정됩니다. 이 때에는 Yaw를 조작하여 드론이 다른 방향을 보게 하여도 처음 지정한 방향을 기준으로 움직입니다. 사용자가 바라보는 방향과 드론의 기준 방향이 같을 때 조작하기 편리한 장점이 있습니다.<br>헤드리스 끄기를 선택하면 드론이 바라보는 방향이 0도가 됩니다. 드론의 움직임에 따라 방향이 계속 바뀌기 때문에 익숙해지기 전까지는 사용하기 어려울 수 있습니다.<br><br><font color='crimson'>#드론</font> <font color='dodgerblue'>#좌표기준</font>",
                robolink_codrone_diy_drone_control_drone_landing         : "<br>드론을 착륙시킵니다.<br><br><font color='crimson'>#드론</font> <font color='dodgerblue'>#착륙</font>",
                robolink_codrone_diy_drone_control_drone_reset_heading   : "<br>드론의 방향을 초기화합니다. 앱솔루트 모드인 경우 현재 드론이 바라보는 방향을 0도로 변경합니다. 일반 모드에서는 아무런 영향이 없습니다.<br><br><font color='crimson'>#드론</font> <font color='dodgerblue'>#방향초기화</font>",
                robolink_codrone_diy_drone_control_drone_stop            : "<br>드론 작동을 정지합니다.<br><br><font color='crimson'>#드론</font> <font color='dodgerblue'>#정지</font>",
                robolink_codrone_diy_drone_control_drone_takeoff         : "<br>드론을 이륙시킵니다.<br><br><font color='crimson'>#드론</font> <font color='dodgerblue'>#이륙</font>",
                robolink_codrone_diy_drone_control_quad                  : "<br>드론 조종 값을 지정합니다. 입력 가능한 값의 범위는 -100 ~ 100입니다. 정지 상태에서 Throttle 값을 50이상으로 지정하면 드론이 이륙합니다. 명령 전달 후 바로 다음 블럭으로 넘어갑니다.<br><br><font color='crimson'>#드론</font> <font color='dodgerblue'>#조종</font>",
                robolink_codrone_diy_drone_control_quad_delay            : "<br>드론 조종 값을 지정합니다. 입력 가능한 값의 범위는 -100 ~ 100입니다. 정지 상태에서 Throttle 값을 50이상으로 지정하면 드론이 이륙합니다. 지정한 시간이 지나면 해당 조종 값을 0으로 변경합니다. 지정한 시간이 끝날 때까지 다음 블럭으로 넘어가지 않습니다.<br><br><font color='crimson'>#드론</font> <font color='dodgerblue'>#조종</font> <font color='forestgreen'>#시간지연</font>",
                robolink_codrone_diy_drone_control_quad_one              : "<br>드론 조종 값을 지정합니다. 입력 가능한 값의 범위는 -100 ~ 100입니다. 정지 상태에서 Throttle 값을 50이상으로 지정하면 드론이 이륙합니다. 명령 전달 후 바로 다음 블럭으로 넘어갑니다.<br><br><font color='crimson'>#드론</font> <font color='dodgerblue'>#조종</font>",
                robolink_codrone_diy_drone_control_quad_one_delay        : "<br>드론 조종 값을 지정합니다. 입력 가능한 값의 범위는 -100 ~ 100입니다. 정지 상태에서 Throttle 값을 50이상으로 지정하면 드론이 이륙합니다. 지정한 시간이 지나면 해당 조종 값을 0으로 변경합니다. 지정한 시간이 끝날 때까지 다음 블럭으로 넘어가지 않습니다.<br><br><font color='crimson'>#드론</font> <font color='dodgerblue'>#조종</font> <font color='forestgreen'>#시간지연</font>",
                robolink_codrone_diy_drone_control_position_one          : "<br>드론의 방향과 거리, 이동 속도를 지정하여 지정한 위치로 이동합니다. 거리를 속도로 나누어 얻은 시간에 1.2를 곱한 시간만큼 해당 블럭에 머뭅니다. <br><br><font color='crimson'>#드론</font> <font color='dodgerblue'>#이동</font> <font color='forestgreen'>#시간지연</font>",
                robolink_codrone_diy_drone_control_position_turn         : "<br>드론의 회전 방향과 각도, 회전 속도를 지정하여 지정한 각도로 회전합니다. 목표 각도를 회전 속도로 나누어 얻은 시간에 1.2를 곱한 시간만큼 해당 블럭에 머뭅니다. <br><br><font color='crimson'>#드론</font> <font color='dodgerblue'>#회전</font> <font color='forestgreen'>#시간지연</font>",
                robolink_codrone_diy_drone_control_position_location     : "<br>드론의 X, Y, Z 축의 방향과 거리, 이동 속도를 설정하여 지정한 위치로 이동합니다. 거리를 속도로 나누어 얻은 시간에 1.2를 곱한 시간만큼 해당 블럭에 머뭅니다. <br><br><font color='crimson'>#드론</font> <font color='dodgerblue'>#이동</font> <font color='forestgreen'>#시간지연</font>",
                robolink_codrone_diy_drone_control_position_location_turn: "<br>드론의 X, Y, Z 축의 방향과 거리, 이동 속도, 회전 방향과 목표 각도, 회전 속도를 설정하여 지정한 위치로의 이동과 회전을 실행합니다. 거리를 속도로 나누어 얻은 시간에 1.2를 곱한 시간 또는 목표 각도를 회전 속도로 나누어 얻은 시간에 1.2를 곱한 시간 중에 긴 시간만큼 해당 블럭에 머뭅니다. <br><br><font color='crimson'>#드론</font> <font color='dodgerblue'>#이동</font> <font color='forestgreen'>#시간지연</font>",
                robolink_codrone_diy_drone_light_color_input             : "<br>빛의 삼원색인 Red, Green, Blue 값을 지정하여 드론의 눈 또는 팔 LED의 색상을 원하는대로 만들 수 있습니다.<br>10진수(0 ~ 255) 값을 사용합니다.<br><br><font color='crimson'>#드론</font> <font color='dodgerblue'>#LED제어</font>",
                robolink_codrone_diy_drone_light_color_select            : "<br>RGB 색지정 블록을 이용해서 만들 수 있는<br> 드론 LED 예시입니다.<br>RGB 색지정 블록을 이용해서 멋진 색깔을<br> 다양하게 만들어보세요.<br><br><font color='crimson'>#드론</font> <font color='dodgerblue'>#LED제어</font>",
                robolink_codrone_diy_drone_light_color_preset            : "<br>드론의 LED를 조작하는데 사용합니다.<br><br><font color='crimson'>#드론</font> <font color='dodgerblue'>#LED제어</font>",
                robolink_codrone_diy_drone_light_manual_single_input     : "<br>드론 LED를 조작하는데 사용합니다.<br>10진수(0 ~ 255) 또는 16진수(0x00 ~ 0xFF) 값을 사용할 수 있습니다.<br>각각의 비트는 LED를 선택하는 스위치 역할을 합니다.<br>밝기 값은 0 ~ 255 사이의 값을 사용할 수 있습니다.<br>값이 커질수록 더 밝아집니다.<br><br><font color='crimson'>#드론</font> <font color='dodgerblue'>#LED제어</font>",
                robolink_codrone_diy_drone_light_manual_single_off       : "<br>드론의 모든 LED를 끕니다.<br><br><font color='crimson'>#드론</font> <font color='dodgerblue'>#LED끄기</font>",
                robolink_codrone_diy_drone_motor_stop                    : "<br>모든 모터의 작동을 정지합니다.<br><br><font color='crimson'>#드론</font> <font color='dodgerblue'>#모터정지</font>",
                robolink_codrone_diy_drone_motorsingle_input             : "<br>모터 제어 블럭입니다.<br>모터의 순서는 12시 방향부터 차례대로 1(앞 오른쪽), 2(뒤 오른쪽), 3(뒤 왼쪽), 4(앞 왼쪽) 입니다.<br>모터 회전에 사용 가능한 값의 범위는 0 ~ 4095입니다. <br><br><font color='crimson'>#드론</font> <font color='dodgerblue'>#모터제어</font>",
                robolink_codrone_diy_drone_information                   : "<br>드론의 현재 자세를 각도로 반환합니다. Roll은 좌우 기울기(-90 ~ 90), Pitch는 앞뒤 기울기(-90 ~ 90), Yaw는 회전 각도(-180 ~ 180) 입니다.<br><br><font color='crimson'>#값</font> <font color='dodgerblue'>#드론</font> <font color='forestgreen'>#자세</font>",
                robolink_codrone_diy_drone_sensor                        : "<br>드론 IMU센서와 관련된 값들을 반환합니다.<br>(병진운동) 가속도는 x, y, z축에 대한 중력가속도입니다. 1g = 9.8m/s^2<br>(회전운동) 각속도는 x, y, z축을 기준으로 회전하는 속력을 나타내는 벡터입니다.(pitch, roll, yaw) <br><br><font color='crimson'>#값</font> <font color='dodgerblue'>#드론</font> <font color='forestgreen'>#IMU센서</font> <font color='crimson'>#가속도</font> <font color='dodgerblue'>#병진운동</font> <font color='crimson'>#각속도</font> <font color='dodgerblue'>#회전운동</font>",
                robolink_codrone_diy_drone_value_position                : "<br>드론 위치와 관련된 값들을 반환합니다.(단위:m)<br><br><font color='crimson'>#값</font> <font color='dodgerblue'>#드론</font> <font color='forestgreen'>#위치</font>",
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
                monitor_altitude_temperature                    : 'Temperature',
                monitor_altitude_pressure                       : 'Pressure',
                monitor_altitude_altitude                       : 'Altitude',
                monitor_altitude_rangeHeight                    : 'Distance from ground',
                monitor_position_x                              : 'Position X',
                monitor_position_y                              : 'Position Y',
                monitor_position_z                              : 'Position Z',
                monitor_motion_accelX                           : 'Accel X',
                monitor_motion_accelY                           : 'Accel Y',
                monitor_motion_accelZ                           : 'Accel Z',
                monitor_motion_gyroRoll                         : 'Gyro Roll',
                monitor_motion_gyroPitch                        : 'Gyro Pitch',
                monitor_motion_gyroYaw                          : 'Gyro Yaw',
                monitor_motion_angleRoll                        : 'Roll',
                monitor_motion_anglePitch                       : 'Pitch',
                monitor_motion_angleYaw                         : 'Yaw',
                monitor_trim_roll                               : 'Trim Roll',
                monitor_trim_pitch                              : 'Trim Pitch',
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
                monitor_entry_hw_count_transfer_reserved        : 'Count of data to transfer',

                // 일반 블럭
                common_light_color_red                  : 'red',
                common_light_color_yellow               : 'yellow',
                common_light_color_green                : 'green',
                common_light_color_cyan                 : 'cyan',
                common_light_color_blue                 : 'blue',
                common_light_color_magenta              : 'magenta',
                common_light_color_white                : 'white',
                common_light_color_black                : 'black',
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
                common_button_button                    : 'button input',
                common_button_event                     : 'button state',
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
                controller_joystick_direction_left_up   : 'Left top',
                controller_joystick_direction_up        : 'Top',
                controller_joystick_direction_right_up  : 'Right top',
                controller_joystick_direction_left      : 'Left',
                controller_joystick_direction_center    : 'Center',
                controller_joystick_direction_right     : 'Right',
                controller_joystick_direction_left_down : 'Left Bottom',
                controller_joystick_direction_down      : 'Bottom',
                controller_joystick_direction_right_down: 'Right Bottom',
                controller_joystick_direction           : 'direction',
                controller_joystick_event               : 'event',
                controller_joystick_x                   : 'X',
                controller_joystick_y                   : 'Y',
                drone_information_state                 : 'State',
                drone_information_control               : 'Control mode',
                drone_information_movement              : 'Movement',
                drone_information_headless              : 'Headless',
                drone_information_speed                 : 'Speed',
                drone_information_trim_pitch            : 'Trim pitch',
                drone_information_trim_roll             : 'Trim roll',
                drone_information_sensor_orientation    : 'Sensor orientation',
                drone_information_battery               : 'Battery(%)',
                drone_sensor_accel_x                    : 'Accel X',
                drone_sensor_accel_y                    : 'Accel Y',
                drone_sensor_accel_z                    : 'Accel Z',
                drone_sensor_gyro_roll                  : 'Gyro roll',
                drone_sensor_gyro_pitch                 : 'Gyro pitch',
                drone_sensor_gyro_yaw                   : 'Gyro Yaw',
                drone_sensor_temperature                : 'Temperature of drone',
                drone_sensor_pressure                   : 'Pressure',
                drone_sensor_altitude                   : 'Altitude',
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
                drone_level_1                           : 'Level 1',
                drone_level_2                           : 'Level 2',
                drone_level_3                           : 'Level 2',
                drone_flip_forward                      : 'Forward',
                drone_flip_rear                         : 'Rear',
                drone_flip_left                         : 'Left',
                drone_flip_right                        : 'Right',
                drone_trim_roll_increase                : 'Roll increase',
                drone_trim_roll_decrease                : 'Roll decrease',
                drone_trim_pitch_increase               : 'Pitch increase',
                drone_trim_pitch_decrease               : 'Pitch decrease',
                drone_trim_yaw_increase                 : 'Yaw increase',
                drone_trim_yaw_decrease                 : 'Yaw decrease',
                drone_trim_throttle_increase            : 'Throttle increase',
                drone_trim_throttle_decrease            : 'Throttle decrease',
                drone_trim_reset                        : 'Reset Trim',
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
                drone_headless_off                      : 'Off',
                drone_headless_on                       : 'On',
                drone_light_color_body                  : 'Body',
                drone_light_manual_body_blue            : 'Blue',
                drone_light_manual_body_green           : 'Green',
                drone_light_manual_body_red             : 'Red',
                drone_motor_rotation_clockwise          : 'Clockwise',
                drone_motor_rotation_counterclockwise   : 'Counterclockwise',
                drone_altitude                          : 'Altitude',
                drone_range_height                      : 'Height',
                drone_state_mode_system                 : 'System Mode',
                drone_state_mode_flight                 : 'Flight Mode',
                drone_state_mode_control_flight         : 'Flight Control Mode',
                drone_state_mode_movement               : 'mode movement',
                drone_state_headless                    : 'Headless',
                drone_state_control_speed               : 'Speed',
                drone_state_sensor_orientation          : 'Sensor direction',
                drone_state_battery                     : 'Battery',
                entry_hw_count_transfer_reserved        : 'Reserved data for transfer',
            },

            template: {
                robolink_codrone_diy_controller_buzzer_hz                : 'play %1 Hz sound %2',
                robolink_codrone_diy_controller_buzzer_hz_delay          : 'play %1 Hz sound for %2 second %3',
                robolink_codrone_diy_controller_buzzer_hz_reserve        : 'reserve to play %1 Hz for %2 second %3',
                robolink_codrone_diy_controller_buzzer_off               : 'turn off the buzzer %1',
                robolink_codrone_diy_controller_buzzer_scale             : 'play %1 octave %2 %3',
                robolink_codrone_diy_controller_buzzer_scale_delay       : 'play %1 octave %2 for %3 second %4',
                robolink_codrone_diy_controller_buzzer_scale_reserve     : 'reserve to play %1 octave %2 for %3 second %4',
                robolink_codrone_diy_controller_if_button_press          : 'when press %1',
                robolink_codrone_diy_controller_if_joystick_direction    : 'when %1 stick move to %2',
                robolink_codrone_diy_controller_value_button             : 'button input',
                robolink_codrone_diy_controller_value_button_event       : 'button state',
                robolink_codrone_diy_controller_value_joystick_left      : 'Left joystick %1',
                robolink_codrone_diy_controller_value_joystick_right     : 'Right joystick %1',
                robolink_codrone_diy_drone_trim_direction                : 'Trim %1 %2',
                robolink_codrone_diy_drone_trim                          : 'Trim Roll %1%, Pitch %2% %3',
                robolink_codrone_diy_drone_speed                         : 'Speed %1 %2',
                robolink_codrone_diy_drone_flip                          : 'Flip %1 %2',
                robolink_codrone_diy_drone_sensor_reset                  : 'Sensor reset %1',
                robolink_codrone_diy_drone_control_headless              : 'Headless %1 %2',
                robolink_codrone_diy_drone_control_drone_landing         : 'Landing %1',
                robolink_codrone_diy_drone_control_drone_reset_heading   : 'Reset heading %1',
                robolink_codrone_diy_drone_control_drone_stop            : 'Stop %1',
                robolink_codrone_diy_drone_control_drone_takeoff         : 'Takeoff %1',
                robolink_codrone_diy_drone_control_quad_one              : 'Set %1 %2% %3',
                robolink_codrone_diy_drone_control_quad_one_delay        : 'Set %1 %2% %3 sec %4',
                robolink_codrone_diy_drone_control_quad                  : 'Set Roll %1%, Pitch %2%, Yaw %3%, Throttle %4% %5',
                robolink_codrone_diy_drone_control_quad_delay            : 'Set Roll %1%, Pitch %2%, Yaw %3%, Throttle %4% for %5sec %6',
                robolink_codrone_diy_drone_control_position_one          : 'Move %2 meter(s) %1 to %3 m/s %4',
                robolink_codrone_diy_drone_control_position_turn         : 'Rotate %2 degree(s) %1 to %3 deg/s %4',
                robolink_codrone_diy_drone_control_position_location     : 'Move %2 meter(s) %1, %4 meter(s) %3, %6 meter(s) %5 to %7 m/s %8',
                robolink_codrone_diy_drone_control_position_location_turn: 'Move %2 meter(s) %1, %4 meter(s) %3, %6 meter(s) %5 to %7 m/s, Rotate %9 degree(s) %8 to %10 deg/s %11',
                robolink_codrone_diy_drone_light_color_input             : 'Drone LED R %1, G %2, B %3 %4 %5 %6',
                robolink_codrone_diy_drone_light_color_select            : 'Drone LED %1 %2 %3 %4',
                robolink_codrone_diy_drone_light_color_preset            : 'Drone LED %1 %2 %3',
                robolink_codrone_diy_drone_light_manual_single_input     : 'Drone LED %1 lightness %2 %3',
                robolink_codrone_diy_drone_light_manual_single_off       : 'Drone LED Off %1',
                robolink_codrone_diy_drone_motor_stop                    : 'Motor stop %1',
                robolink_codrone_diy_drone_motorsingle_input             : 'No. %1 Motor rotate for %2 %3',
                robolink_codrone_diy_drone_information                   : 'Drone information %1',
                robolink_codrone_diy_drone_sensor                        : 'Sensor %1',
                robolink_codrone_diy_drone_value_position                : 'Position %1',
            },

            Helper: {
                robolink_codrone_diy_controller_buzzer_hz                : '',
                robolink_codrone_diy_controller_buzzer_hz_delay          : '',
                robolink_codrone_diy_controller_buzzer_hz_reserve        : '',
                robolink_codrone_diy_controller_buzzer_off               : '',
                robolink_codrone_diy_controller_buzzer_scale             : '',
                robolink_codrone_diy_controller_buzzer_scale_delay       : '',
                robolink_codrone_diy_controller_buzzer_scale_reserve     : '',
                robolink_codrone_diy_controller_if_button_press          : '',
                robolink_codrone_diy_controller_if_joystick_direction    : '',
                robolink_codrone_diy_controller_value_button             : '',
                robolink_codrone_diy_controller_value_button_event       : '',
                robolink_codrone_diy_controller_value_joystick_left      : '',
                robolink_codrone_diy_controller_value_joystick_right     : '',
                robolink_codrone_diy_drone_trim_direction                : '',
                robolink_codrone_diy_drone_trim                          : '',
                robolink_codrone_diy_drone_speed                         : '',
                robolink_codrone_diy_drone_flip                          : '',
                robolink_codrone_diy_drone_sensor_reset                  : '',
                robolink_codrone_diy_drone_control_headless              : '',
                robolink_codrone_diy_drone_control_drone_landing         : '',
                robolink_codrone_diy_drone_control_drone_reset_heading   : '',
                robolink_codrone_diy_drone_control_drone_stop            : '',
                robolink_codrone_diy_drone_control_drone_takeoff         : '',
                robolink_codrone_diy_drone_control_quad                  : '',
                robolink_codrone_diy_drone_control_quad_delay            : '',
                robolink_codrone_diy_drone_control_quad_one              : '',
                robolink_codrone_diy_drone_control_quad_one_delay        : '',
                robolink_codrone_diy_drone_control_position_one          : '',
                robolink_codrone_diy_drone_control_position_turn         : '',
                robolink_codrone_diy_drone_control_position_location     : '',
                robolink_codrone_diy_drone_control_position_location_turn: '',
                robolink_codrone_diy_drone_light_color_input             : '',
                robolink_codrone_diy_drone_light_color_select            : '',
                robolink_codrone_diy_drone_light_color_preset            : '',
                robolink_codrone_diy_drone_light_manual_single_input     : '',
                robolink_codrone_diy_drone_light_manual_single_off       : '',
                robolink_codrone_diy_drone_motor_stop                    : '',
                robolink_codrone_diy_drone_motorsingle_input             : '',
                robolink_codrone_diy_drone_information                   : '',
                robolink_codrone_diy_drone_sensor                        : '',
                robolink_codrone_diy_drone_value_position                : '',
            },
        },
    };
};


// Entry 좌측 하단 하드웨어 모니터 화면에 표시하는 속성
// listPorts와 ports 두 곳 동시에 동일한 속성을 표시할 수는 없음
Entry.robolink_codrone_diy.monitorTemplate = function () {
    return {
        /* 센서창 가림 현상을 해결하기 위해서 주석 처리함(2017.11.06)
        imgPath: "hw/robolink_codrone_diy.png",   // 배경 이미지
        width  : 256,                             // 이미지의 폭
        height : 256,                             // 이미지의 높이
        */

        // 모니터 화면 상단에 차례대로 나열하는 값
        listPorts: {
            state_modeFlight             : { name: Lang.Blocks.monitor_state_modeFlight, type: 'input', pos: { x: 0, y: 0 } },
            state_modeControlFlight      : { name: Lang.Blocks.monitor_state_modeControlFlight, type: 'input', pos: { x: 0, y: 0 } },
            state_modeMovement           : { name: Lang.Blocks.monitor_state_modeMovement, type: 'input', pos: { x: 0, y: 0 } },
            state_headless               : { name: Lang.Blocks.monitor_state_headless, type: 'input', pos: { x: 0, y: 0 } },
            state_controlSpeed           : { name: Lang.Blocks.monitor_state_controlSpeed, type: 'input', pos: { x: 0, y: 0 } },
            state_sensorOrientation      : { name: Lang.Blocks.monitor_state_sensorOrientation, type: 'input', pos: { x: 0, y: 0 } },
            state_battery                : { name: Lang.Blocks.monitor_state_battery, type: 'input', pos: { x: 0, y: 0 } },
            altitude_temperature         : { name: Lang.Blocks.monitor_altitude_temperature, type: 'input', pos: { x: 0, y: 0 } },
            altitude_pressure            : { name: Lang.Blocks.monitor_altitude_pressure, type: 'input', pos: { x: 0, y: 0 } },
            altitude_altitude            : { name: Lang.Blocks.monitor_altitude_altitude, type: 'input', pos: { x: 0, y: 0 } },
            altitude_rangeHeight         : { name: Lang.Blocks.monitor_altitude_rangeHeight, type: 'input', pos: { x: 0, y: 0 } },
            motion_accelX                : { name: Lang.Blocks.monitor_motion_accelX, type: 'input', pos: { x: 0, y: 0 } },
            motion_accelY                : { name: Lang.Blocks.monitor_motion_accelY, type: 'input', pos: { x: 0, y: 0 } },
            motion_accelZ                : { name: Lang.Blocks.monitor_motion_accelZ, type: 'input', pos: { x: 0, y: 0 } },
            motion_gyroRoll              : { name: Lang.Blocks.monitor_motion_gyroRoll, type: 'input', pos: { x: 0, y: 0 } },
            motion_gyroPitch             : { name: Lang.Blocks.monitor_motion_gyroPitch, type: 'input', pos: { x: 0, y: 0 } },
            motion_gyroYaw               : { name: Lang.Blocks.monitor_motion_gyroYaw, type: 'input', pos: { x: 0, y: 0 } },
            motion_angleRoll             : { name: Lang.Blocks.monitor_motion_angleRoll, type: 'input', pos: { x: 0, y: 0 } },
            motion_anglePitch            : { name: Lang.Blocks.monitor_motion_anglePitch, type: 'input', pos: { x: 0, y: 0 } },
            motion_angleYaw              : { name: Lang.Blocks.monitor_motion_angleYaw, type: 'input', pos: { x: 0, y: 0 } },
            trim_roll                    : { name: Lang.Blocks.monitor_trim_roll, type: 'input', pos: { x: 0, y: 0 } },
            trim_pitch                   : { name: Lang.Blocks.monitor_trim_pitch, type: 'input', pos: { x: 0, y: 0 } },
            position_x                   : { name: Lang.Blocks.monitor_position_x, type: 'input', pos: { x: 0, y: 0 } },
            position_y                   : { name: Lang.Blocks.monitor_position_y, type: 'input', pos: { x: 0, y: 0 } },
            position_z                   : { name: Lang.Blocks.monitor_position_z, type: 'input', pos: { x: 0, y: 0 } },
            joystick_left_x              : { name: Lang.Blocks.monitor_joystick_left_x, type: 'input', pos: { x: 0, y: 0 } },
            joystick_left_y              : { name: Lang.Blocks.monitor_joystick_left_y, type: 'input', pos: { x: 0, y: 0 } },
            joystick_left_direction      : { name: Lang.Blocks.monitor_joystick_left_direction, type: 'input', pos: { x: 0, y: 0 } },
            joystick_left_event          : { name: Lang.Blocks.monitor_joystick_left_event, type: 'input', pos: { x: 0, y: 0 } },
            joystick_right_x             : { name: Lang.Blocks.monitor_joystick_right_x, type: 'input', pos: { x: 0, y: 0 } },
            joystick_right_y             : { name: Lang.Blocks.monitor_joystick_right_y, type: 'input', pos: { x: 0, y: 0 } },
            joystick_right_direction     : { name: Lang.Blocks.monitor_joystick_right_direction, type: 'input', pos: { x: 0, y: 0 } },
            joystick_right_event         : { name: Lang.Blocks.monitor_joystick_right_event, type: 'input', pos: { x: 0, y: 0 } },
            button_button                : { name: Lang.Blocks.monitor_button_button, type: 'input', pos: { x: 0, y: 0 } },
            button_event                 : { name: Lang.Blocks.monitor_button_event, type: 'input', pos: { x: 0, y: 0 } },
            entryhw_countTransferReserved: { name: Lang.Blocks.monitor_entry_hw_count_transfer_reserved, type: 'output', pos: { x: 0, y: 0 } },
        },

        // 모니터 화면 지정 위치와 선으로 연결하여 표시하는 값
        ports: {},

        mode: 'both',   // 표시 모드
    };
};


/***************************************************************************************
 *  엔트리에 등록할 블록들의 블록명(다른 장치의 블록 이름과 달라야 함)
 ***************************************************************************************/
Entry.robolink_codrone_diy.blockMenuBlocks = [
    'robolink_codrone_diy_drone_information',
    'robolink_codrone_diy_drone_sensor',
    'robolink_codrone_diy_drone_value_position',
    'robolink_codrone_diy_controller_value_button',
    'robolink_codrone_diy_controller_value_button_event',
    'robolink_codrone_diy_controller_value_joystick_left',
    'robolink_codrone_diy_controller_value_joystick_right',
    'robolink_codrone_diy_controller_if_button_press',
    'robolink_codrone_diy_controller_if_joystick_direction',
    'robolink_codrone_diy_drone_control_drone_takeoff',
    'robolink_codrone_diy_drone_control_drone_landing',
    'robolink_codrone_diy_drone_control_drone_stop',
    'robolink_codrone_diy_drone_trim_direction',
    'robolink_codrone_diy_drone_trim',
    'robolink_codrone_diy_drone_speed',
    'robolink_codrone_diy_drone_flip',
    'robolink_codrone_diy_drone_sensor_reset',
    'robolink_codrone_diy_drone_control_headless',
    'robolink_codrone_diy_drone_control_drone_reset_heading',
    'robolink_codrone_diy_drone_control_quad_one',
    'robolink_codrone_diy_drone_control_quad_one_delay',
    'robolink_codrone_diy_drone_control_quad',
    'robolink_codrone_diy_drone_control_quad_delay',
    'robolink_codrone_diy_drone_control_position_one',
    'robolink_codrone_diy_drone_control_position_turn',
    'robolink_codrone_diy_drone_control_position_location',
    'robolink_codrone_diy_drone_control_position_location_turn',
    'robolink_codrone_diy_drone_motor_stop',
    'robolink_codrone_diy_drone_motorsingle_input',
    'robolink_codrone_diy_drone_light_manual_single_off',
    'robolink_codrone_diy_drone_light_manual_single_input',
    'robolink_codrone_diy_drone_light_color_preset',
    'robolink_codrone_diy_drone_light_color_select',
    'robolink_codrone_diy_drone_light_color_input',
    'robolink_codrone_diy_controller_buzzer_off',
    'robolink_codrone_diy_controller_buzzer_scale',
    'robolink_codrone_diy_controller_buzzer_scale_delay',
    'robolink_codrone_diy_controller_buzzer_scale_reserve',
    'robolink_codrone_diy_controller_buzzer_hz',
    'robolink_codrone_diy_controller_buzzer_hz_delay',
    'robolink_codrone_diy_controller_buzzer_hz_reserve',
];


/***************************************************************************************
 *  엔트리 블록 정의
 ***************************************************************************************/
Entry.robolink_codrone_diy.getBlocks = function () {
    return {
        robolink_codrone_diy_drone_information: {
            color     : EntryStatic.colorSet.block.default.HARDWARE,
            outerLine : EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton  : 'basic_string_field',
            statements: [],
            params    : [
                {
                    type   : 'Dropdown',
                    options: [
                        [Lang.Blocks.drone_information_state, 'state_modeFlight'],
                        [Lang.Blocks.drone_information_control, 'state_modeControlFlight'],
                        [Lang.Blocks.drone_information_movement, 'state_modeMovement'],
                        [Lang.Blocks.drone_information_headless, 'state_headless'],
                        [Lang.Blocks.drone_information_speed, 'state_controlSpeed'],
                        [Lang.Blocks.drone_information_trim_pitch, 'trim_pitch'],
                        [Lang.Blocks.drone_information_trim_roll, 'trim_roll'],
                        [Lang.Blocks.drone_information_sensor_orientation, 'state_sensorOrientation'],
                        [Lang.Blocks.drone_information_battery, 'state_battery'],
                    ],
                    value     : 'state_modeFlight',                     // 초기 선택항목 지정
                    fontSize  : 11,
                    bgColor   : EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def   : {
                params: [null],
                type  : 'robolink_codrone_diy_drone_information',
            },
            paramsKeyMap: {
                DEVICE: 0,
            },
            class   : 'monitor',                  // 같은 이름인 객체들이 그룹으로 형성됨
            isNotFor: ['robolink_codrone_diy'],
            func(sprite, script) {
                return Entry.hw.portData[script.getField('DEVICE')];
            },
        },


        robolink_codrone_diy_drone_sensor: {
            color     : EntryStatic.colorSet.block.default.HARDWARE,
            outerLine : EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton  : 'basic_string_field',
            statements: [],
            params    : [
                {
                    type   : 'Dropdown',
                    options: [
                        [Lang.Blocks.drone_accel_x, 'motion_accelX'],
                        [Lang.Blocks.drone_accel_y, 'motion_accelY'],
                        [Lang.Blocks.drone_accel_z, 'motion_accelZ'],
                        [Lang.Blocks.drone_gyro_roll, 'motion_gyroRoll'],
                        [Lang.Blocks.drone_gyro_pitch, 'motion_gyroPitch'],
                        [Lang.Blocks.drone_gyro_yaw, 'motion_gyroYaw'],
                        [Lang.Blocks.drone_attitude_roll, 'motion_angleRoll'],
                        [Lang.Blocks.drone_attitude_pitch, 'motion_anglePitch'],
                        [Lang.Blocks.drone_attitude_yaw, 'motion_angleYaw'],
                        [Lang.Blocks.drone_sensor_temperature, 'altitude_temperature'],
                        [Lang.Blocks.drone_range_height, 'altitude_rangeHeight'],
                        [Lang.Blocks.drone_sensor_pressure, 'altitude_pressure'],
                        [Lang.Blocks.drone_sensor_altitude, 'altitude_altitude'],
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
                type  : 'robolink_codrone_diy_drone_sensor',
            },
            paramsKeyMap: {
                DEVICE: 0,
            },
            class   : 'monitor',                  // 같은 이름인 객체들이 그룹으로 형성됨
            isNotFor: ['robolink_codrone_diy'],
            func(sprite, script) {
                return Entry.hw.portData[script.getField('DEVICE')];
            },
        },


        robolink_codrone_diy_drone_value_position: {
            color     : EntryStatic.colorSet.block.default.HARDWARE,
            outerLine : EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton  : 'basic_string_field',
            statements: [],
            params    : [
                {
                    type   : 'Dropdown',
                    options: [
                        [Lang.Blocks.drone_positionX, 'informationAssembledForEntry_positionX'],
                        [Lang.Blocks.drone_positionY, 'informationAssembledForEntry_positionY'],
                        [Lang.Blocks.drone_positionZ, 'informationAssembledForEntry_positionZ'],
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
                type  : 'robolink_codrone_diy_drone_value_position',
            },
            paramsKeyMap: {
                DEVICE: 0,
            },
            class   : 'monitor',                  // 같은 이름인 객체들이 그룹으로 형성됨
            isNotFor: ['robolink_codrone_diy'],
            func(sprite, script) {
                return Entry.hw.portData[script.getField('DEVICE')];
            },
        },


        robolink_codrone_diy_controller_value_button: {
            color     : EntryStatic.colorSet.block.default.HARDWARE,
            outerLine : EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton  : 'basic_string_field',
            statements: [],
            params    : [
            ],
            events: {},
            def   : {
                params: [],
                type  : 'robolink_codrone_diy_controller_value_button',
            },
            paramsKeyMap: {
            },
            class   : 'monitor',                  // 같은 이름인 객체들이 그룹으로 형성됨
            isNotFor: ['robolink_codrone_diy'],
            func(sprite, script) {
                const button = Entry.hw.portData['button_button'];
                if( button == undefined )
                {
                    button = 0;
                }
                return button;
            },
        },


        robolink_codrone_diy_controller_value_button_event: {
            color     : EntryStatic.colorSet.block.default.HARDWARE,
            outerLine : EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton  : 'basic_string_field',
            statements: [],
            params    : [
            ],
            events: {},
            def   : {
                params: [],
                type  : 'robolink_codrone_diy_controller_value_button_event',
            },
            paramsKeyMap: {
            },
            class   : 'monitor',                  // 같은 이름인 객체들이 그룹으로 형성됨
            isNotFor: ['robolink_codrone_diy'],
            func(sprite, script) {
                const button_event = Entry.hw.portData['button_event'];
                if( button_event == undefined )
                {
                    button_event = 0;
                }
                return button_event;
            },
        },


        robolink_codrone_diy_controller_value_joystick_left: {
            color     : EntryStatic.colorSet.block.default.HARDWARE,
            outerLine : EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton  : 'basic_string_field',
            statements: [],
            params    : [
                {
                    type   : 'Dropdown',
                    options: [
                        [Lang.Blocks.controller_joystick_x, 'joystick_left_x'],
                        [Lang.Blocks.controller_joystick_y, 'joystick_left_y'],
                        [Lang.Blocks.controller_joystick_direction, 'joystick_left_direction'],
                        [Lang.Blocks.controller_joystick_event, 'joystick_left_event'],
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
                type  : 'robolink_codrone_diy_controller_value_joystick_left',
            },
            paramsKeyMap: {
                DEVICE: 0,
            },
            class   : 'monitor',                  // 같은 이름인 객체들이 그룹으로 형성됨
            isNotFor: ['robolink_codrone_diy'],
            func(sprite, script) {
                return Entry.hw.portData[script.getField('DEVICE')];
            },
        },


        robolink_codrone_diy_controller_value_joystick_right: {
            color     : EntryStatic.colorSet.block.default.HARDWARE,
            outerLine : EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton  : 'basic_string_field',
            statements: [],
            params    : [
                {
                    type   : 'Dropdown',
                    options: [
                        [Lang.Blocks.controller_joystick_x, 'joystick_right_x'],
                        [Lang.Blocks.controller_joystick_y, 'joystick_right_y'],
                        [Lang.Blocks.controller_joystick_direction, 'joystick_right_direction'],
                        [Lang.Blocks.controller_joystick_event, 'joystick_right_event'],
                    ],
                    value     : 'joystick_right_x',                             // 초기 선택항목 지정
                    fontSize  : 11,
                    bgColor   : EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def   : {
                params: [null],
                type  : 'robolink_codrone_diy_controller_value_joystick_right',
            },
            paramsKeyMap: {
                DEVICE: 0,
            },
            class   : 'monitor',                  // 같은 이름인 객체들이 그룹으로 형성됨
            isNotFor: ['robolink_codrone_diy'],
            func(sprite, script) {
                return Entry.hw.portData[script.getField('DEVICE')];
            },
        },


        robolink_codrone_diy_controller_if_button_press: {
            color     : EntryStatic.colorSet.block.default.HARDWARE,
            outerLine : EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor : '#fff',
            skeleton  : 'basic_boolean_field',
            statements: [],
            params    : [
                {
                    type   : 'Dropdown',
                    options: [
                        [Lang.Blocks.controller_button_front_left_top, '1'],
                        [Lang.Blocks.controller_button_front_left_bottom, '2'],
                        [Lang.Blocks.controller_button_front_right_top, '4'],
                        [Lang.Blocks.controller_button_front_right_bottom, '8'],
                        [Lang.Blocks.controller_button_top_left, '16'],
                        [Lang.Blocks.controller_button_top_right, '32'],
                        [Lang.Blocks.controller_button_center_up, '64'],
                        [Lang.Blocks.controller_button_center_left, '128'],
                        [Lang.Blocks.controller_button_center_right, '256'],
                        [Lang.Blocks.controller_button_center_down, '512'],
                        [Lang.Blocks.controller_button_bottom_left, '1024'],
                        [Lang.Blocks.controller_button_bottom_right, '2048'],
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
                type  : 'robolink_codrone_diy_controller_if_button_press',
            },
            paramsKeyMap: {
                BUTTON: 0,
            },
            class   : 'boolean_input',
            isNotFor: ['robolink_codrone_diy'],
            func(sprite, script) {
                const read        = Entry.hw.portData;
                const button      = 'button_button';    // paramsKeyMap에 정의된 이름 사용
                const button_event = 'button_event';     // paramsKeyMap에 정의된 이름 사용
                
                if (read[button] == script.getField('BUTTON') && read[button_event] == 2) {
                    return true;
                } else {
                    return false;
                }
            },
            syntax: { js: [], py: [] },
        },


        robolink_codrone_diy_controller_if_joystick_direction: {
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
                        [Lang.Blocks.controller_joystick_direction_left_up, '17'],
                        [Lang.Blocks.controller_joystick_direction_up, '18'],
                        [Lang.Blocks.controller_joystick_direction_right_up, '20'],
                        [Lang.Blocks.controller_joystick_direction_left, '33'],
                        [Lang.Blocks.controller_joystick_direction_center, '34'],
                        [Lang.Blocks.controller_joystick_direction_right, '36'],
                        [Lang.Blocks.controller_joystick_direction_left_down, '65'],
                        [Lang.Blocks.controller_joystick_direction_down, '66'],
                        [Lang.Blocks.controller_joystick_direction_right_down, '68'],
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
                type  : 'robolink_codrone_diy_controller_if_joystick_direction',
            },
            paramsKeyMap: {
                DEVICE   : 0,
                DIRECTION: 1,
            },
            class   : 'boolean_input',
            isNotFor: ['robolink_codrone_diy'],
            func(sprite, script) {
                const read   = Entry.hw.portData;
                const device = script.getField('DEVICE');  // paramsKeyMap에 정의된 이름 사용

                if (read[device] == script.getField('DIRECTION')) {
                    return true;
                }
                else {
                    return false;
                }
            },
        },



        robolink_codrone_diy_drone_light_manual_single_off: {
            color     : EntryStatic.colorSet.block.default.HARDWARE,
            outerLine : EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton  : 'basic',
            statements: [],
            params    : [{ type: 'Indicator', img: 'block_icon/hardware_icon.svg', size: 12 }],
            events    : {},
            def       : {
                params: [null],
                type  : 'robolink_codrone_diy_drone_light_manual_single_off',
            },
            paramsKeyMap: {},
            class       : 'drone_light',
            isNotFor    : ['robolink_codrone_diy'],
            func(sprite, script) {
                return Entry.byrobot_base.setLightManual(script, 0x10, 0xff, 0);
            },
        },


        robolink_codrone_diy_drone_light_color_preset: {
            color     : EntryStatic.colorSet.block.default.HARDWARE,
            outerLine : EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton  : 'basic',
            statements: [],
            params    : [
                {
                    type   : 'Dropdown',
                    options: [
                        [Lang.Blocks.common_light_color_red, 'red'],
                        [Lang.Blocks.common_light_color_green, 'green'],
                        [Lang.Blocks.common_light_color_blue, 'blue'],
                        [Lang.Blocks.common_light_color_yellow, 'yellow'],
                        [Lang.Blocks.common_light_color_magenta, 'magenta'],
                        [Lang.Blocks.common_light_color_cyan, 'cyan'],
                        [Lang.Blocks.common_light_color_white, 'white'],
                        [Lang.Blocks.common_light_color_sunset, 'sunset'],
                        [Lang.Blocks.common_light_color_cottoncandy, 'cottonCandy'],
                        [Lang.Blocks.common_light_color_muscat, 'muscat'],
                        [Lang.Blocks.common_light_color_strawberrymilk, 'strawberryMilk'],
                        [Lang.Blocks.common_light_color_emerald, 'emerald'],
                        [Lang.Blocks.common_light_color_lavender, 'lavender'],
                    ],
                    value     : 'red',
                    fontSize  : 11,
                    bgColor   : EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type   : 'Dropdown',
                    options: [
                        [Lang.Blocks.common_light_brightness_on, '220'],
                        [Lang.Blocks.common_light_brightness_off, '0'],
                        [Lang.Blocks.common_light_brightness_b25, '75'],
                        [Lang.Blocks.common_light_brightness_b50, '125'],
                        [Lang.Blocks.common_light_brightness_b75, '200'],
                        [Lang.Blocks.common_light_brightness_b100, '255'],
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
                type  : 'robolink_codrone_diy_drone_light_color_preset',
            },
            paramsKeyMap: {
                COLOR     : 0,
                BRIGHTNESS: 1,
            },
            class   : 'drone_light',
            isNotFor: ['robolink_codrone_diy'],
            func(sprite, script) {
                const mode        = 0x22;
                const interval    = parseInt(script.getField('BRIGHTNESS'), 10);
                const colorString = script.getField('COLOR');
                return Entry.byrobot_base.setLightModeColorString(script, 0x10, mode, interval, colorString);
            },
        },


        robolink_codrone_diy_drone_light_manual_single_input: {
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
                type: 'robolink_codrone_diy_drone_light_manual_single_input',
            },
            paramsKeyMap: {
                FLAGS     : 0,
                BRIGHTNESS: 1,
            },
            class   : 'drone_light',
            isNotFor: ['robolink_codrone_diy'],
            func(sprite, script) {
                const flags      = parseInt(script.getStringValue('FLAGS'));
                const brightness = script.getNumberValue('BRIGHTNESS');
                return Entry.byrobot_base.setLightManual(script, 0x10, flags, brightness);
            },
        },


        robolink_codrone_diy_drone_light_color_input: {
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
                        [Lang.Blocks.common_light_mode_hold, '2'],              // BodyHold            = 0x22
                        [Lang.Blocks.common_light_mode_flicker, '3'],           // BodyFlicker         = 0x23
                        [Lang.Blocks.common_light_mode_flicker_double, '4'],    // BodyFlickerDouble   = 0x24
                        [Lang.Blocks.common_light_mode_dimming, '5'],           // BodyDimming         = 0x25
                        [Lang.Blocks.common_light_mode_sunrise, '6'],           // BodyS8unrise        = 0x26
                        [Lang.Blocks.common_light_mode_sunset, '7'],            // BodySunset          = 0x27
                        [Lang.Blocks.common_light_mode_rainbow, '8'],           // BodyRainbow         = 0x28
                        [Lang.Blocks.common_light_mode_rainbow2, '9'],          // BodyRainbow2        = 0x29
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
                type: 'robolink_codrone_diy_drone_light_color_input',
            },
            paramsKeyMap: {
                RED     : 0,
                GREEN   : 1,
                BLUE    : 2,
                MODE    : 3,
                INTERVAL: 4,
            },
            class   : 'drone_light',
            isNotFor: ['robolink_codrone_diy'],
            func(sprite, script) {
                const mode     = 0x20 + parseInt(script.getField('MODE'), 10);
                const red      = script.getNumberValue('RED');
                const green    = script.getNumberValue('GREEN');
                const blue     = script.getNumberValue('BLUE');
                const interval = script.getNumberValue('INTERVAL');
                return Entry.byrobot_base.setLightModeColor(script, 0x10, mode, interval, red, green, blue);
            },
        },


        robolink_codrone_diy_drone_light_color_select: {
            color     : EntryStatic.colorSet.block.default.HARDWARE,
            outerLine : EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton  : 'basic',
            statements: [],
            params    : [
                {
                    type   : 'Dropdown',
                    options: [
                        [Lang.Blocks.common_light_color_red, 'red'],
                        [Lang.Blocks.common_light_color_green, 'green'],
                        [Lang.Blocks.common_light_color_blue, 'blue'],
                        [Lang.Blocks.common_light_color_yellow, 'yellow'],
                        [Lang.Blocks.common_light_color_magenta, 'magenta'],
                        [Lang.Blocks.common_light_color_cyan, 'cyan'],
                        [Lang.Blocks.common_light_color_white, 'white'],
                        [Lang.Blocks.common_light_color_sunset, 'sunset'],
                        [Lang.Blocks.common_light_color_cottoncandy, 'cottonCandy'],
                        [Lang.Blocks.common_light_color_muscat, 'muscat'],
                        [Lang.Blocks.common_light_color_strawberrymilk, 'strawberryMilk'],
                        [Lang.Blocks.common_light_color_emerald, 'emerald'],
                        [Lang.Blocks.common_light_color_lavender, 'lavender'],
                    ],
                    value     : 'red',
                    fontSize  : 11,
                    bgColor   : EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type   : 'Dropdown',
                    options: [
                        [Lang.Blocks.common_light_mode_hold, '2'],              // BodyHold            = 0x22
                        [Lang.Blocks.common_light_mode_flicker, '3'],           // BodyFlicker         = 0x23
                        [Lang.Blocks.common_light_mode_flicker_double, '4'],    // BodyFlickerDouble   = 0x24
                        [Lang.Blocks.common_light_mode_dimming, '5'],           // BodyDimming         = 0x25
                        [Lang.Blocks.common_light_mode_sunrise, '6'],           // BodyS8unrise        = 0x26
                        [Lang.Blocks.common_light_mode_sunset, '7'],            // BodySunset          = 0x27
                        [Lang.Blocks.common_light_mode_rainbow, '8'],           // BodyRainbow         = 0x28
                        [Lang.Blocks.common_light_mode_rainbow2, '9'],          // BodyRainbow2        = 0x29
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
                type  : 'robolink_codrone_diy_drone_light_color_select',
            },
            paramsKeyMap: {
                COLOR   : 0,
                MODE    : 1,
                INTERVAL: 2,
            },
            class   : 'drone_light',
            isNotFor: ['robolink_codrone_diy'],
            func(sprite, script) {
                const mode        = 0x20 + parseInt(script.getField('MODE'), 10);
                const interval    = script.getNumberValue('INTERVAL');
                const colorString = script.getField('COLOR');
                return Entry.byrobot_base.setLightModeColorString(script, 0x10, mode, interval, colorString);
            },
        },


        robolink_codrone_diy_controller_buzzer_off: {
            color     : EntryStatic.colorSet.block.default.HARDWARE,
            outerLine : EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton  : 'basic',
            statements: [],
            params    : [{ type: 'Indicator', img: 'block_icon/hardware_icon.svg', size: 12 }],
            events    : {},
            def       : {
                params: [null],
                type  : 'robolink_codrone_diy_controller_buzzer_off',
            },
            paramsKeyMap: {},
            class       : 'buzzer',
            isNotFor    : ['robolink_codrone_diy'],
            func(sprite, script) {
                return Entry.byrobot_base.setBuzzerStop(script, 0x20);
            },
        },


        robolink_codrone_diy_controller_buzzer_scale: {
            color     : EntryStatic.colorSet.block.default.HARDWARE,
            outerLine : EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton  : 'basic',
            statements: [],
            params    : [
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
                        [Lang.Blocks.controller_buzzer_c, '0'],
                        [Lang.Blocks.controller_buzzer_cs, '1'],
                        [Lang.Blocks.controller_buzzer_d, '2'],
                        [Lang.Blocks.controller_buzzer_ds, '3'],
                        [Lang.Blocks.controller_buzzer_e, '4'],
                        [Lang.Blocks.controller_buzzer_f, '5'],
                        [Lang.Blocks.controller_buzzer_fs, '6'],
                        [Lang.Blocks.controller_buzzer_g, '7'],
                        [Lang.Blocks.controller_buzzer_gs, '8'],
                        [Lang.Blocks.controller_buzzer_a, '9'],
                        [Lang.Blocks.controller_buzzer_as, '10'],
                        [Lang.Blocks.controller_buzzer_b, '11'],
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
                params: [null, null, null],
                type  : 'robolink_codrone_diy_controller_buzzer_scale',
            },
            paramsKeyMap: {
                OCTAVE: 0,
                SCALE : 1,
            },
            class   : 'buzzer',
            isNotFor: ['robolink_codrone_diy'],
            func(sprite, script) {
                const octave = parseInt(script.getField('OCTAVE'), 10);
                const scale  = parseInt(script.getField('SCALE'), 10);

                if (scale == -1) {
                    return Entry.byrobot_base.setBuzzerMute(script, 0x20, 60000, false, true);
                } else {
                    return Entry.byrobot_base.setBuzzerScale(script, 0x20, octave, scale, 60000, false, true);
                }
            },
        },


        robolink_codrone_diy_controller_buzzer_scale_delay: {
            color     : EntryStatic.colorSet.block.default.HARDWARE,
            outerLine : EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton  : 'basic',
            statements: [],
            params    : [
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
                        [Lang.Blocks.controller_buzzer_c, '0'],
                        [Lang.Blocks.controller_buzzer_cs, '1'],
                        [Lang.Blocks.controller_buzzer_d, '2'],
                        [Lang.Blocks.controller_buzzer_ds, '3'],
                        [Lang.Blocks.controller_buzzer_e, '4'],
                        [Lang.Blocks.controller_buzzer_f, '5'],
                        [Lang.Blocks.controller_buzzer_fs, '6'],
                        [Lang.Blocks.controller_buzzer_g, '7'],
                        [Lang.Blocks.controller_buzzer_gs, '8'],
                        [Lang.Blocks.controller_buzzer_a, '9'],
                        [Lang.Blocks.controller_buzzer_as, '10'],
                        [Lang.Blocks.controller_buzzer_b, '11'],
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
                    { type: 'text', params: ['1'] },
                    null,
                ],
                type: 'robolink_codrone_diy_controller_buzzer_scale_delay',
            },
            paramsKeyMap: {
                OCTAVE: 0,
                SCALE : 1,
                TIME  : 2,
            },
            class   : 'buzzer',
            isNotFor: ['robolink_codrone_diy'],
            func(sprite, script) {
                const octave = parseInt(script.getField('OCTAVE'), 10);
                const scale  = parseInt(script.getField('SCALE'), 10);
                const time   = script.getNumberValue('TIME') * 1000;

                if (scale == -1) {
                    return Entry.byrobot_base.setBuzzerMute(script, 0x20, time, true, true);
                } else {
                    return Entry.byrobot_base.setBuzzerScale(script, 0x20, octave, scale, time, true, true);
                }
            },
        },


        robolink_codrone_diy_controller_buzzer_scale_reserve: {
            color     : EntryStatic.colorSet.block.default.HARDWARE,
            outerLine : EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton  : 'basic',
            statements: [],
            params    : [
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
                        [Lang.Blocks.controller_buzzer_c, '0'],
                        [Lang.Blocks.controller_buzzer_cs, '1'],
                        [Lang.Blocks.controller_buzzer_d, '2'],
                        [Lang.Blocks.controller_buzzer_ds, '3'],
                        [Lang.Blocks.controller_buzzer_e, '4'],
                        [Lang.Blocks.controller_buzzer_f, '5'],
                        [Lang.Blocks.controller_buzzer_fs, '6'],
                        [Lang.Blocks.controller_buzzer_g, '7'],
                        [Lang.Blocks.controller_buzzer_gs, '8'],
                        [Lang.Blocks.controller_buzzer_a, '9'],
                        [Lang.Blocks.controller_buzzer_as, '10'],
                        [Lang.Blocks.controller_buzzer_b, '11'],
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
                    { type: 'text', params: ['1'] },
                    null,
                ],
                type: 'robolink_codrone_diy_controller_buzzer_scale_reserve',
            },
            paramsKeyMap: {
                OCTAVE: 0,
                SCALE : 1,
                TIME  : 2,
            },
            class   : 'buzzer',
            isNotFor: ['robolink_codrone_diy'],
            func(sprite, script) {
                const octave = parseInt(script.getField('OCTAVE'), 10);
                const scale  = parseInt(script.getField('SCALE'), 10);
                const time   = script.getNumberValue('TIME') * 1000;

                if (scale == -1) {
                    return Entry.byrobot_base.setBuzzerMute(script, 0x20, time, false, false);
                } else {
                    return Entry.byrobot_base.setBuzzerScale(script, 0x20, octave, scale, time, false, false);
                }
            },
        },


        robolink_codrone_diy_controller_buzzer_hz: {
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
                params: [{ type: 'text', params: ['1000'] }, null],
                type  : 'robolink_codrone_diy_controller_buzzer_hz',
            },
            paramsKeyMap: {
                HZ: 0,
            },
            class   : 'buzzer',
            isNotFor: ['robolink_codrone_diy'],
            func(sprite, script) {
                const hz = script.getNumberValue('HZ');
                return Entry.byrobot_base.setBuzzerHz(script, 0x20, hz, 60000, false, true);
            },
        },


        robolink_codrone_diy_controller_buzzer_hz_delay: {
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
                params: [{ type: 'text', params: ['1000'] }, { type: 'text', params: ['1'] }, null],
                type  : 'robolink_codrone_diy_controller_buzzer_hz_delay',
            },
            paramsKeyMap: {
                HZ  : 0,
                TIME: 1,
            },
            class   : 'buzzer',
            isNotFor: ['robolink_codrone_diy'],
            func(sprite, script) {
                const hz   = script.getNumberValue('HZ');
                const time = script.getNumberValue('TIME') * 1000;
                return Entry.byrobot_base.setBuzzerHz(script, 0x20, hz, time, true, true);
            },
        },


        robolink_codrone_diy_controller_buzzer_hz_reserve: {
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
                    { type: 'text', params: ['1000'] },
                    { type: 'text', params: ['1'] },
                    null,
                ],
                type: 'robolink_codrone_diy_controller_buzzer_hz_reserve',
            },
            paramsKeyMap: {
                HZ  : 0,
                TIME: 1,
            },
            class   : 'buzzer',
            isNotFor: ['robolink_codrone_diy'],
            func(sprite, script) {
                const hz   = script.getNumberValue('HZ');
                const time = script.getNumberValue('TIME') * 1000;
                return Entry.byrobot_base.setBuzzerHz(script, 0x20, hz, time, false, false);
            },
        },


        robolink_codrone_diy_drone_motor_stop: {
            color     : EntryStatic.colorSet.block.default.HARDWARE,
            outerLine : EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton  : 'basic',
            statements: [],
            params    : [{ type: 'Indicator', img: 'block_icon/hardware_icon.svg', size: 12 }],
            events    : {},
            def       : {
                params: [null],
                type  : 'robolink_codrone_diy_drone_motor_stop',
            },
            paramsKeyMap: {},
            class       : 'motor',
            isNotFor    : ['robolink_codrone_diy'],
            func(sprite, script) {
                return Entry.byrobot_base.sendStop(script, 0x10);
            },
        },


        robolink_codrone_diy_drone_motorsingle_input: {
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
                type  : 'robolink_codrone_diy_drone_motorsingle_input',
            },
            paramsKeyMap: {
                MOTORINDEX: 0,
                MOTORSPEED: 1,
            },
            class   : 'motor',
            isNotFor: ['robolink_codrone_diy'],
            func(sprite, script) {
                const motorIndex = script.getNumberValue('MOTORINDEX') - 1;
                const motorSpeed = script.getNumberValue('MOTORSPEED');

                return Entry.byrobot_base.setMotorSingleV(script, 0x10, motorIndex, motorSpeed);
            },
        },


        robolink_codrone_diy_drone_control_drone_takeoff: {
            color     : EntryStatic.colorSet.block.default.HARDWARE,
            outerLine : EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton  : 'basic',
            statements: [],
            params    : [{ type: 'Indicator', img: 'block_icon/hardware_icon.svg', size: 12 }],
            events    : {},
            def       : {
                params: [null],
                type  : 'robolink_codrone_diy_drone_control_drone_takeoff',
            },
            paramsKeyMap: {},
            class       : 'control_flight',
            isNotFor    : ['robolink_codrone_diy'],
            func(sprite, script) {
                return Entry.byrobot_base.setEventFlight(script, 0x10, 0x11, 5000); // 0x11 : FlightEvent::TakeOff
            },
        },


        robolink_codrone_diy_drone_control_drone_landing: {
            color     : EntryStatic.colorSet.block.default.HARDWARE,
            outerLine : EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton  : 'basic',
            statements: [],
            params    : [{ type: 'Indicator', img: 'block_icon/hardware_icon.svg', size: 12 }],
            events    : {},
            def       : {
                params: [null],
                type  : 'robolink_codrone_diy_drone_control_drone_landing',
            },
            paramsKeyMap: {},
            class       : 'control_flight',
            isNotFor    : ['robolink_codrone_diy'],
            func(sprite, script) {
                return Entry.byrobot_base.setEventFlight(script, 0x10, 0x12, 5000); // 0x12 : FlightEvent::Landing
            },
        },

        robolink_codrone_diy_drone_control_drone_stop: {
            color     : EntryStatic.colorSet.block.default.HARDWARE,
            outerLine : EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton  : 'basic',
            statements: [],
            params    : [{ type: 'Indicator', img: 'block_icon/hardware_icon.svg', size: 12 }],
            events    : {},
            def       : {
                params: [null],
                type  : 'robolink_codrone_diy_drone_control_drone_stop',
            },
            paramsKeyMap: {},
            class       : 'control_flight',
            isNotFor    : ['robolink_codrone_diy'],
            func(sprite, script) {
                return Entry.byrobot_base.sendStop(script, 0x10);
            },
        },


        robolink_codrone_diy_drone_control_headless: {
            color     : EntryStatic.colorSet.block.default.HARDWARE,
            outerLine : EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton  : 'basic',
            statements: [],
            params    : [
                {
                    type   : 'Dropdown',
                    options: [
                        [Lang.Blocks.drone_headless_on, '1'],
                        [Lang.Blocks.drone_headless_off, '2'],
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
                type  : 'robolink_codrone_diy_drone_control_headless',
            },
            paramsKeyMap: {
                HEADLESS: 0,
            },
            class   : 'control_flight',
            isNotFor: ['robolink_codrone_diy'],
            func(sprite, script) {
                const headless = script.getField('HEADLESS');
                return Entry.byrobot_base.sendCommand(script, 0x10, 0x03, headless);
            },
        },


        robolink_codrone_diy_drone_control_drone_reset_heading: {
            color     : EntryStatic.colorSet.block.default.HARDWARE,
            outerLine : EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton  : 'basic',
            statements: [],
            params    : [{ type: 'Indicator', img: 'block_icon/hardware_icon.svg', size: 12 }],
            events    : {},
            def       : {
                params: [null],
                type  : 'robolink_codrone_diy_drone_control_drone_reset_heading',
            },
            paramsKeyMap: {},
            class       : 'control_flight',
            isNotFor    : ['robolink_codrone_diy'],
            func(sprite, script) {
                return Entry.byrobot_base.sendCommand(script, 0x10, 0x07, 0xA0); // 0x22 : CommandType::FlightEvent  // 0xA0 : FlightEvent::ResetHeading
            },
        },


        robolink_codrone_diy_drone_trim_direction: {
            color     : EntryStatic.colorSet.block.default.HARDWARE,
            outerLine : EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton  : 'basic',
            statements: [],
            params    : [
                {
                    type   : 'Dropdown',
                    options: [
                        [Lang.Blocks.drone_trim_pitch_increase, 'pitch_inc'],
                        [Lang.Blocks.drone_trim_pitch_decrease, 'pitch_dec'],
                        [Lang.Blocks.drone_trim_roll_increase, 'roll_inc'],
                        [Lang.Blocks.drone_trim_roll_decrease, 'roll_dec'],
                        [Lang.Blocks.drone_trim_reset, 'reset'],
                    ],
                    value     : 'pitch_inc',
                    fontSize  : 11,
                    bgColor   : EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                { type: 'Indicator', img: 'block_icon/hardware_icon.svg', size: 12 },
            ],
            events: {},
            def   : {
                params: [null, null],
                type  : 'robolink_codrone_diy_drone_trim_direction',
            },
            paramsKeyMap: {
                DIRECTION: 0,
            },
            class   : 'trim',
            isNotFor: ['robolink_codrone_diy'],
            func(sprite, script) {
                const direction = script.getField('DIRECTION');

                let r = Entry.hw.portData['trim_roll'];
                let p = Entry.hw.portData['trim_pitch'];
                let y = Entry.hw.portData['trim_yaw'];
                let t = Entry.hw.portData['trim_throttle'];

                const interval = 5;

                switch (direction)
                {
                    case    'pitch_inc': { p = p + interval; } break;
                    case    'pitch_dec': { p = p - interval; } break;
                    case    'roll_inc':  { r = r + interval; } break;
                    case    'roll_dec':  { r = r - interval; } break;
                    case    'reset':     { r=0; p=0; y=0; t=0; } break;
                    default: break;
                }

                return Entry.byrobot_base.sendTrim(script, 0x10, r, p, y, t);
            },
        },


        robolink_codrone_diy_drone_trim: {
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
                    { type: 'number', params: ['0'] },
                    { type: 'number', params: ['0'] },
                    null,
                ],
                type: 'robolink_codrone_diy_drone_trim',
            },
            paramsKeyMap: {
                ROLL    : 0,
                PITCH   : 1,
            },
            class   : 'trim',
            isNotFor: ['robolink_codrone_diy'],
            func(sprite, script) {
                const r = script.getNumberValue('ROLL');
                const p = script.getNumberValue('PITCH');
                const y = Entry.hw.portData['trim_yaw'];
                const t = Entry.hw.portData['trim_throttle'];

                return Entry.byrobot_base.sendTrim(script, 0x10, r, p, y, t);
            },
        },


        robolink_codrone_diy_drone_speed: {
            color     : EntryStatic.colorSet.block.default.HARDWARE,
            outerLine : EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton  : 'basic',
            statements: [],
            params    : [
                {
                    type   : 'Dropdown',
                    options: [
                        [Lang.Blocks.drone_level_1, 1],
                        [Lang.Blocks.drone_level_2, 2],
                        [Lang.Blocks.drone_level_3, 3],
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
                params: [null, null],
                type  : 'robolink_codrone_diy_drone_speed',
            },
            paramsKeyMap: {
                LEVEL: 0,
            },
            class   : 'trim',
            isNotFor: ['robolink_codrone_diy'],
            func(sprite, script) {
                const level = script.getField('LEVEL');
                return Entry.byrobot_base.sendCommand(script, 0x10, 0x04, level);
            },
        },


        robolink_codrone_diy_drone_flip: {
            color     : EntryStatic.colorSet.block.default.HARDWARE,
            outerLine : EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton  : 'basic',
            statements: [],
            params    : [
                {
                    type   : 'Dropdown',
                    options: [
                        [Lang.Blocks.drone_flip_forward, 0x14],
                        [Lang.Blocks.drone_flip_rear,    0x15],
                        [Lang.Blocks.drone_flip_left,    0x16],
                        [Lang.Blocks.drone_flip_right,   0x17],
                    ],
                    value     : 0x14,
                    fontSize  : 11,
                    bgColor   : EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                { type: 'Indicator', img: 'block_icon/hardware_icon.svg', size: 12 },
            ],
            events: {},
            def   : {
                params: [null, null],
                type  : 'robolink_codrone_diy_drone_flip',
            },
            paramsKeyMap: {
                DIRECTION: 0,
            },
            class   : 'flip',
            isNotFor: ['robolink_codrone_diy'],
            func(sprite, script) {
                const direction = script.getField('DIRECTION');
                return Entry.byrobot_base.sendCommand(script, 0x10, 0x07, direction);
            },
        },


        robolink_codrone_diy_drone_sensor_reset: {
            color     : EntryStatic.colorSet.block.default.HARDWARE,
            outerLine : EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton  : 'basic',
            statements: [],
            params    : [
                { type: 'Indicator', img: 'block_icon/hardware_icon.svg', size: 12 },
            ],
            events: {},
            def   : {
                params: [null],
                type  : 'robolink_codrone_diy_drone_sensor_reset',
            },
            paramsKeyMap: {
            },
            class   : 'sensor',
            isNotFor: ['robolink_codrone_diy'],
            func(sprite, script) {
                return Entry.byrobot_base.sendCommand(script, 0x10, 0x05, 0, 3000);
            },
        },


        robolink_codrone_diy_drone_control_quad_one: {
            color     : EntryStatic.colorSet.block.default.HARDWARE,
            outerLine : EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton  : 'basic',
            statements: [],
            params    : [
                {
                    type   : 'Dropdown',
                    options: [
                        [Lang.Blocks.drone_control_quad_roll, 'control_quad8_roll'],
                        [Lang.Blocks.drone_control_quad_pitch, 'control_quad8_pitch'],
                        [Lang.Blocks.drone_control_quad_yaw, 'control_quad8_yaw'],
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
                type  : 'robolink_codrone_diy_drone_control_quad_one',
            },
            paramsKeyMap: {
                CONTROLTARGET: 0,
                VALUE        : 1,
            },
            class   : 'control_quad',
            isNotFor: ['robolink_codrone_diy'],
            func(sprite, script) {
                const controlTarget = script.getField('CONTROLTARGET');
                const value         = script.getNumberValue('VALUE');

                return Entry.byrobot_base.sendControlQuadSingle(script, 0x10, controlTarget, value, 0, false);
            },
        },


        robolink_codrone_diy_drone_control_quad_one_delay: {
            color     : EntryStatic.colorSet.block.default.HARDWARE,
            outerLine : EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton  : 'basic',
            statements: [],
            params    : [
                {
                    type   : 'Dropdown',
                    options: [
                        [Lang.Blocks.drone_control_quad_roll, 'control_quad8_roll'],
                        [Lang.Blocks.drone_control_quad_pitch, 'control_quad8_pitch'],
                        [Lang.Blocks.drone_control_quad_yaw, 'control_quad8_yaw'],
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
                type: 'robolink_codrone_diy_drone_control_quad_one_delay',
            },
            paramsKeyMap: {
                CONTROLTARGET: 0,
                VALUE        : 1,
                TIME         : 2,
            },
            class   : 'control_quad',
            isNotFor: ['robolink_codrone_diy'],
            func(sprite, script) {
                const controlTarget = script.getField('CONTROLTARGET');
                const value         = script.getNumberValue('VALUE');
                const time          = script.getNumberValue('TIME') * 1000;

                return Entry.byrobot_base.sendControlQuadSingle(script, 0x10, controlTarget, value, time, true);
            },
        },


        robolink_codrone_diy_drone_control_quad: {
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
                type: 'robolink_codrone_diy_drone_control_quad',
            },
            paramsKeyMap: {
                ROLL    : 0,
                PITCH   : 1,
                YAW     : 2,
                THROTTLE: 3,
            },
            class   : 'control_quad',
            isNotFor: ['robolink_codrone_diy'],
            func(sprite, script) {
                const roll     = script.getNumberValue('ROLL');
                const pitch    = script.getNumberValue('PITCH');
                const yaw      = script.getNumberValue('YAW');
                const throttle = script.getNumberValue('THROTTLE');

                return Entry.byrobot_base.sendControlQuad(script, 0x10, roll, pitch, yaw, throttle, 0, false);
            },
        },


        robolink_codrone_diy_drone_control_quad_delay: {
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
                type: 'robolink_codrone_diy_drone_control_quad_delay',
            },
            paramsKeyMap: {
                ROLL    : 0,
                PITCH   : 1,
                YAW     : 2,
                THROTTLE: 3,
                TIME    : 4,
            },
            class   : 'control_quad',
            isNotFor: ['robolink_codrone_diy'],
            func(sprite, script) {
                const roll     = script.getNumberValue('ROLL');
                const pitch    = script.getNumberValue('PITCH');
                const yaw      = script.getNumberValue('YAW');
                const throttle = script.getNumberValue('THROTTLE');
                const time     = script.getNumberValue('TIME') * 1000;

                return Entry.byrobot_base.sendControlQuad(script, 0x10, roll, pitch, yaw, throttle, time, true);
            },
        },


        robolink_codrone_diy_drone_control_position_one: {
            color     : EntryStatic.colorSet.block.default.HARDWARE,
            outerLine : EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton  : 'basic',
            statements: [],
            params    : [
                {
                    type   : 'Dropdown',
                    options: [
                        [Lang.Blocks.drone_control_quad_pitch_forward, 'pitch_forward'],
                        [Lang.Blocks.drone_control_quad_pitch_backward, 'pitch_backward'],
                        [Lang.Blocks.drone_control_quad_roll_left, 'roll_left'],
                        [Lang.Blocks.drone_control_quad_roll_right, 'roll_right'],
                        [Lang.Blocks.drone_control_quad_throttle_up, 'throttle_up'],
                        [Lang.Blocks.drone_control_quad_throttle_down, 'throttle_down'],
                    ],
                    value     : 'pitch_forward',
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
                params: [null, { type: 'number', params: ['1'] }, { type: 'number', params: ['1'] }, null],
                type  : 'robolink_codrone_diy_drone_control_position_one',
            },
            paramsKeyMap: {
                CONTROLDIRECTION: 0,
                DISTANCE        : 1,
                SPEED           : 2,
            },
            class   : 'control_position',
            isNotFor: ['robolink_codrone_diy'],
            func(sprite, script) {
                const controlDirection = script.getField('CONTROLDIRECTION');
                const distance         = script.getNumberValue('DISTANCE');
                const speed            = script.getNumberValue('SPEED');
                let   time             = 0;

                if (speed > 0) {
                    time = Math.abs(distance / speed) * 1000 + Math.min(1000 * speed, 3000) + 3000;
                }

                let x = 0;
                let y = 0;
                let z = 0;

                switch (controlDirection) {
                    case    'pitch_forward': x  = distance; break;
                    case    'pitch_backward': x = -distance; break;
                    case    'roll_left': y      = distance; break;
                    case    'roll_right': y     = -distance; break;
                    case    'throttle_up': z    = distance; break;
                    default: z                  = -distance; break;
                }

                return Entry.byrobot_base.sendControlPosition(script, 0x10, x, y, z, speed, 0, 0, time, true);
            },
        },


        robolink_codrone_diy_drone_control_position_turn: {
            color     : EntryStatic.colorSet.block.default.HARDWARE,
            outerLine : EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton  : 'basic',
            statements: [],
            params    : [
                {
                    type   : 'Dropdown',
                    options: [
                        [Lang.Blocks.drone_control_quad_yaw_cw, '-1'],
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
                    { type: 'number', params: ['90'] },
                    { type: 'number', params: ['45'] },
                    null
                ],
                type: 'robolink_codrone_diy_drone_control_position_turn',
            },
            paramsKeyMap: {
                DIRECTION_YAW: 0,
                DEGREE_YAW   : 1,
                SPEED_YAW    : 2,
            },
            class   : 'control_position',
            isNotFor: ['robolink_codrone_diy'],
            func(sprite, script) {
                const directionYaw = script.getNumberValue('DIRECTION_YAW');
                const degree       = script.getNumberValue('DEGREE_YAW');
                const yaw          = directionYaw * degree;
                const speedYaw     = script.getNumberValue('SPEED_YAW');

                let time = 0;

                if (speedYaw > 0) {
                    time = Math.abs(degree / speedYaw) * 2 * 1000 + 3000;
                }

                return Entry.byrobot_base.sendControlPosition(script, 0x10, 0, 0, 0, 0, yaw, speedYaw, time, true);
            },
        },


        robolink_codrone_diy_drone_control_position_location: {
            color     : EntryStatic.colorSet.block.default.HARDWARE,
            outerLine : EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton  : 'basic',
            statements: [],
            params    : [
                {
                    type   : 'Dropdown',
                    options: [
                        [Lang.Blocks.drone_control_quad_pitch_forward, '+1'],
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
                        [Lang.Blocks.drone_control_quad_roll_left, '+1'],
                        [Lang.Blocks.drone_control_quad_roll_right, '-1'],
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
                        [Lang.Blocks.drone_control_quad_throttle_up, '+1'],
                        [Lang.Blocks.drone_control_quad_throttle_down, '-1'],
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
                    null],
                type: 'robolink_codrone_diy_drone_control_position_location',
            },
            paramsKeyMap: {
                DIRECTION_PITCH   : 0,
                DISTANCE_PITCH    : 1,
                DIRECTION_ROLL    : 2,
                DISTANCE_ROLL     : 3,
                DIRECTION_THROTTLE: 4,
                DISTANCE_THROTTLE : 5,
                SPEED             : 6
            },
            class   : 'control_position',
            isNotFor: ['robolink_codrone_diy'],
            func(sprite, script) {
                const directionPitch    = script.getNumberValue('DIRECTION_PITCH');
                const directionRoll     = script.getNumberValue('DIRECTION_ROLL');
                const directionThrottle = script.getNumberValue('DIRECTION_THROTTLE');

                const x = directionPitch * script.getNumberValue('DISTANCE_PITCH');
                const y = directionRoll * script.getNumberValue('DISTANCE_ROLL');
                const z = directionThrottle * script.getNumberValue('DISTANCE_THROTTLE');

                const distance = Math.sqrt((x * x) + (y * y) + (z * z));

                const speed = script.getNumberValue('SPEED');

                let time = 0;

                if (speed > 0) {
                    time = Math.abs(distance / speed) * 1000 + Math.min(1000 * speed, 3000) + 3000;
                }

                return Entry.byrobot_base.sendControlPosition(script, 0x10, x, y, z, speed, 0, 0, time, true);
            },
        },


        robolink_codrone_diy_drone_control_position_location_turn: {
            color     : EntryStatic.colorSet.block.default.HARDWARE,
            outerLine : EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton  : 'basic',
            statements: [],
            params    : [
                {
                    type   : 'Dropdown',
                    options: [
                        [Lang.Blocks.drone_control_quad_pitch_forward, '+1'],
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
                        [Lang.Blocks.drone_control_quad_roll_left, '+1'],
                        [Lang.Blocks.drone_control_quad_roll_right, '-1'],
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
                        [Lang.Blocks.drone_control_quad_throttle_up, '+1'],
                        [Lang.Blocks.drone_control_quad_throttle_down, '-1'],
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
                        [Lang.Blocks.drone_control_quad_yaw_cw, '-1'],
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
                type: 'robolink_codrone_diy_drone_control_position_location_turn',
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
            isNotFor: ['robolink_codrone_diy'],
            func(sprite, script) {
                const directionPitch    = script.getNumberValue('DIRECTION_PITCH');
                const directionRoll     = script.getNumberValue('DIRECTION_ROLL');
                const directionThrottle = script.getNumberValue('DIRECTION_THROTTLE');

                const x = directionPitch * script.getNumberValue('DISTANCE_PITCH');
                const y = directionRoll * script.getNumberValue('DISTANCE_ROLL');
                const z = directionThrottle * script.getNumberValue('DISTANCE_THROTTLE');

                const distance = Math.sqrt((x * x) + (y * y) + (z * z));
                const speed    = script.getNumberValue('SPEED');

                const directionYaw = script.getNumberValue('DIRECTION_YAW');
                const degree       = script.getNumberValue('DEGREE_YAW');
                const yaw          = directionYaw * degree;
                const speedYaw     = script.getNumberValue('SPEED_YAW');

                let timePosition = 0;
                let timeRotation = 0;

                if (speed > 0) {
                    timePosition = Math.abs(distance / speed) * 1000 + Math.min(1000 * speed, 3000) + 3000;
                }

                if (speedYaw > 0) {
                    timeRotation = Math.abs(degree / speedYaw) * 2 * 1000 + 3000;
                }

                const time = Math.max(timePosition, timeRotation);

                return Entry.byrobot_base.sendControlPosition(script, 0x10, x, y, z, speed, yaw, speedYaw, time, true);
            },
        },
    };
};


module.exports = Entry.robolink_codrone_diy;

