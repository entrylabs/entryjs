/* eslint-disable prettier/prettier */
/* eslint-disable brace-style */
/* eslint-disable max-len */
/* jshint esversion: 6 */
'use strict';

/***************************************************************************************
 *  장치 기본 정의
 ***************************************************************************************/

Entry.robolink_codrone_mini = 
{
    id       : '4A.2',
    name     : 'robolink_codrone_mini',
    url      : 'http://www.robolink.co.kr',
    imageName: 'robolink_codrone_mini.png',
    title    : {
        en: 'ROBOLINK CODRONE MINI',
        ko: '로보링크 코드론 미니',
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
Entry.robolink_codrone_mini.setLanguage = function () {
    return {
        ko: {
            // ko.js에 작성하던 내용
            Blocks: {
                // 정보창
                value_state_mode_system               : '시스템 모드',
                value_state_mode_flight               : '비행 상태',
                value_state_mode_control_flight       : '제어 방식',
                value_state_mode_movement             : '동작 상태',
                value_state_headless                  : '방향 기준',
                value_state_control_speed             : '속도',
                value_state_sensor_orientation        : '센서 방향',
                value_state_battery                   : '배터리 잔량(%)',
                value_altitude_temperature            : '드론의 온도',
                value_altitude_pressure               : '기압',
                value_altitude_altitude               : '해발 고도',
                value_motion_accel_x                  : 'X방향 가속도',
                value_motion_accel_y                  : 'Y방향 가속도',
                value_motion_accel_z                  : 'Z방향 가속도',
                value_motion_gyro_roll                : '롤 각속도',
                value_motion_gyro_pitch               : '피치 각속도',
                value_motion_gyro_yaw                 : '요우 각속도',
                value_motion_angle_roll               : '롤',
                value_motion_angle_pitch              : '피치',
                value_motion_angle_yaw                : '요우',
                value_trim_roll                       : '미세조정 롤값',
                value_trim_pitch                      : '미세조정 피치값',
                value_joystick_left_x                 : '왼쪽 조이스틱 X',
                value_joystick_left_y                 : '왼쪽 조이스틱 Y',
                value_joystick_left_direction         : '왼쪽 조이스틱 방향',
                value_joystick_left_event             : '왼쪽 조이스틱 이벤트',
                value_joystick_right_x                : '오른쪽 조이스틱 X',
                value_joystick_right_y                : '오른쪽 조이스틱 Y',
                value_joystick_right_direction        : '오른쪽 조이스틱 방향',
                value_joystick_right_event            : '오른쪽 조이스틱 이벤트',
                value_button_button                   : '버튼 입력',
                value_button_event                    : '버튼 상태',
                value_entry_hw_count_transfer_reserved: '전송 예정 데이터',

                // 일반 블럭
                common_light_color_red                  : '빨강',
                common_light_color_yellow               : '노랑',
                common_light_color_green                : '초록',
                common_light_color_cyan                 : '하늘색',
                common_light_color_blue                 : '파랑',
                common_light_color_magenta              : '자홍',
                common_light_color_white                : '흰색',
                common_light_color_black                : '검정',
                common_light_color_cotton_candy         : '구름솜사탕',
                common_light_color_emerald              : '에메랄드',
                common_light_color_lavender             : '라벤더',
                common_light_color_muscat               : '청포도',
                common_light_color_strawberry_milk      : '딸기우유',
                common_light_color_sunset               : '저녁노을',
                common_light_mode_hold                  : '유지하기',
                common_light_mode_flicker               : '깜빡이기',
                common_light_mode_flicker_double        : '두번 깜빡이기',
                common_light_mode_dimming               : '천천히 점멸',
                common_light_mode_sunrise               : '천천히 밝아짐',
                common_light_mode_sunset                : '천천히 어두워짐',
                common_light_mode_rainbow               : '무지개',
                common_light_mode_rainbow2              : '무지개2',
                common_left                             : '왼쪽',
                common_right                            : '오른쪽',
                common_drone                            : '드론',
                common_controller                       : '조종기',
                controller_button_front_left            : '전면 왼쪽 버튼',
                controller_button_front_right           : '전면 오른쪽 버튼',
                controller_button_top_left              : '상단 왼쪽 버튼',
                controller_button_top_right             : '상단 오른쪽 버튼',
                controller_button_center_up             : '중앙 위 버튼',
                controller_button_center_left           : '중앙 왼쪽 버튼',
                controller_button_center_right          : '중앙 오른쪽 버튼',
                controller_button_center_down           : '중앙 아래쪽 버튼',
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
                controller_buzzer_play                  : '연주',
                controller_buzzer_reserve               : '예약',
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
            },

            template: {
                robolink_codrone_mini_drone_information                   : '드론 정보 %1',
                robolink_codrone_mini_drone_sensor                        : '센서값 %1',
                robolink_codrone_mini_controller_value_button             : '%1',
                robolink_codrone_mini_controller_value_button_event       : '%1',
                robolink_codrone_mini_controller_value_joystick_left      : '왼쪽 조이스틱 %1',
                robolink_codrone_mini_controller_value_joystick_right     : '오른쪽 조이스틱 %1',
                robolink_codrone_mini_controller_if_button_press          : '조종기 %1 눌렀을 때',
                robolink_codrone_mini_controller_if_joystick_direction    : '조종기 %1 조이스틱 %2 (으)로 움직였을 때',
                robolink_codrone_mini_drone_control_drone_takeoff         : '이륙하기 %1',
                robolink_codrone_mini_drone_control_drone_landing         : '착륙하기 %1',
                robolink_codrone_mini_drone_control_drone_stop            : '멈춤 %1',
                robolink_codrone_mini_drone_trim_direction                : '미세조정 %1 %2',
                robolink_codrone_mini_drone_trim                          : '미세조정 롤 %1, 피치 %2 %3',
                robolink_codrone_mini_drone_speed                         : '속도 %1 %2',
                robolink_codrone_mini_drone_flip                          : '재주넘기 %1 %2',
                robolink_codrone_mini_drone_sensor_reset                  : '센서 초기화 %1',
                robolink_codrone_mini_drone_control_headless              : '방향 고정 %1 %2',
                robolink_codrone_mini_drone_control_drone_reset_heading   : '방향 초기화 %1',
                robolink_codrone_mini_drone_control_quad_one              : '드론 %1 %2% 정하기 %3',
                robolink_codrone_mini_drone_control_quad_one_delay        : '드론 %1 %2% %3 초 실행 %4',
                robolink_codrone_mini_drone_control_quad                  : '드론 Roll %1%, Pitch %2%, Yaw %3%, Throttle %4% 정하기 %5',
                robolink_codrone_mini_drone_control_quad_delay            : '드론 Roll %1%, Pitch %2%, Yaw %3%, Throttle %4% %5초 실행 %6',
                robolink_codrone_mini_drone_motor_stop                    : '드론 모터 정지 %1',
                robolink_codrone_mini_drone_motor_single                  : '드론 %1번 모터를 %2(으)로 회전 %3',
                robolink_codrone_mini_drone_light_manual_single_input     : '드론 LED %1 밝기 %2 %3',
                robolink_codrone_mini_drone_light_manual_single_off       : '드론 LED 끄기 %1',
                robolink_codrone_mini_drone_light_color_select            : '드론 LED %1 %2 %3 %4',
                robolink_codrone_mini_drone_light_color_input             : '드론 LED R %1, G %2, B %3 %4 %5 %6',
                robolink_codrone_mini_controller_buzzer_off               : '버저 끄기 %1',
                robolink_codrone_mini_controller_buzzer_hz                : '%1Hz 소리를 %2초 %3 %4',
                robolink_codrone_mini_controller_buzzer_scale             : '%1 옥타브 %2을(를) %3초 %4 %5',
            },

            Helper: {
                robolink_codrone_mini_drone_information                   : "드론의 정보를 반환합니다.",
                robolink_codrone_mini_drone_sensor                        : "드론 센서와 관련된 값들을 반환합니다.<br><br><font color='crimson'>롤</font> : 좌우 기울기(-90 ~ 90)<br><font color='crimson'>피치</font> : 앞뒤 기울기(-90 ~ 90)<br><font color='crimson'>요우</font> : 방향(-180 ~ 180)",
                robolink_codrone_mini_controller_value_button             : "조종기 전체 버튼 입력 상태를 비트 플래그로 반환합니다.",
                robolink_codrone_mini_controller_value_button_event       : "조종기 버튼 중 현재 사용 중인 버튼의 입력 상태를 반환합니다.",
                robolink_codrone_mini_controller_value_joystick_left      : "조종기의 왼쪽 조이스틱과 관련된 값을 반환합니다.",
                robolink_codrone_mini_controller_value_joystick_right     : "조종기의 오른쪽 조이스틱과 관련된 값을 반환합니다.",
                robolink_codrone_mini_controller_if_button_press          : "지정한 조종기의 버튼이 눌러졌을 때 true를 반환합니다.",
                robolink_codrone_mini_controller_if_joystick_direction    : "조종기의 조이스틱이 지정한 방향으로 움직였을 때 true를 반환합니다.",
                robolink_codrone_mini_drone_control_drone_takeoff         : "드론을 이륙시킵니다.",
                robolink_codrone_mini_drone_control_drone_landing         : "드론을 착륙시킵니다.",
                robolink_codrone_mini_drone_control_drone_stop            : "드론 작동을 정지합니다.",
                robolink_codrone_mini_drone_trim_direction                : "드론 미세 조정 설정을 현재 값에서 5단위로 증가시키거나 감소시킵니다.",
                robolink_codrone_mini_drone_trim                          : "드론 미세 조정 설정을 변경합니다.",
                robolink_codrone_mini_drone_speed                         : "드론 이동 속도를 변경합니다.",
                robolink_codrone_mini_drone_flip                          : "드론을 지정한 방향으로 공중 회전합니다.",
                robolink_codrone_mini_drone_sensor_reset                  : "드론의 자이로 바이어스와 트림 설정을 초기화합니다.",
                robolink_codrone_mini_drone_control_headless              : "드론 좌표 기준을 변경합니다.<br><br><font color='dodgerblue'>방향 고정 켜기</font>를 하면 '이륙 시'와 '방향초기화'를 했을 때 드론이 바라보는 방향이 0도로 고정됩니다. 이 때에는 Yaw를 조작하여 드론이 다른 방향을 보게 하여도 처음 지정한 방향을 기준으로 움직입니다.<br><font color='crimson'>방향 고정 끄기</font>를 선택하면 드론이 바라보는 방향이 0도가 됩니다.",
                robolink_codrone_mini_drone_control_drone_reset_heading   : "드론의 방향을 초기화합니다.<br><br><font color='dodgerblue'>방향 고정 켜기</font> 설정이 되어 있는 경우 이 블럭을 실행하면 드론이 바라보는 방향을 0으로 초기화합니다.",
                robolink_codrone_mini_drone_control_quad_one              : "드론 조종 값을 지정합니다.<br><br>입력 가능한 값의 범위는 -100 ~ 100입니다. 정지 상태에서 Throttle 값을 50이상으로 지정하면 드론이 이륙합니다. 명령 전달 후 바로 다음 블럭으로 넘어갑니다.",
                robolink_codrone_mini_drone_control_quad_one_delay        : "드론 조종 값을 지정합니다.<br><br>입력 가능한 값의 범위는 -100 ~ 100입니다. 정지 상태에서 Throttle 값을 50이상으로 지정하면 드론이 이륙합니다. 지정한 시간이 지나면 해당 조종 값을 0으로 변경합니다. 지정한 시간이 끝날 때까지 다음 블럭으로 넘어가지 않습니다.",
                robolink_codrone_mini_drone_control_quad                  : "드론 조종 값을 지정합니다.<br><br>입력 가능한 값의 범위는 -100 ~ 100입니다. 정지 상태에서 Throttle 값을 50이상으로 지정하면 드론이 이륙합니다. 명령 전달 후 바로 다음 블럭으로 넘어갑니다.",
                robolink_codrone_mini_drone_control_quad_delay            : "드론 조종 값을 지정합니다.<br><br>입력 가능한 값의 범위는 -100 ~ 100입니다. 정지 상태에서 Throttle 값을 50이상으로 지정하면 드론이 이륙합니다. 지정한 시간이 지나면 해당 조종 값을 0으로 변경합니다. 지정한 시간이 끝날 때까지 다음 블럭으로 넘어가지 않습니다.",
                robolink_codrone_mini_drone_motor_stop                    : "모든 모터의 작동을 정지합니다.",
                robolink_codrone_mini_drone_motor_single                  : "모터 제어 블럭입니다.<br><br>모터의 순서는 12시 방향부터 차례대로 1(앞 오른쪽), 2(뒤 오른쪽), 3(뒤 왼쪽), 4(앞 왼쪽) 입니다.<br>모터 회전에 사용 가능한 값의 범위는 0 ~ 4095입니다.",
                robolink_codrone_mini_drone_light_manual_single_off       : "드론의 모든 LED를 끕니다.",
                robolink_codrone_mini_drone_light_manual_single_input     : "드론 LED를 조작하는데 사용합니다.<br><br>10진수(0 ~ 65535) 또는 16진수(0x00 ~ 0xFFFF) 값을 사용할 수 있습니다.<br>각각의 비트는 LED를 선택하는 스위치 역할을 합니다.<br>밝기 값은 0 ~ 255 사이의 값을 사용할 수 있습니다.<br>값이 커질수록 더 밝아집니다.",
                robolink_codrone_mini_drone_light_color_select            : "미리 설정된 색상을 선택하여 드론의 LED를 제어하는 블럭입니다.",
                robolink_codrone_mini_drone_light_color_input             : "Red, Green, Blue 값을 지정하여 드론의 LED를 제어하는 블럭입니다.",
                robolink_codrone_mini_controller_buzzer_off               : "버저 작동을 중단합니다. 예약된 소리가 있다면 모두 삭제합니다.",
                robolink_codrone_mini_controller_buzzer_scale             : "지정한 옥타브의 음을 지정한 시간동안 연주하거나 예약합니다.<br><br><font color='dodgerblue'>연주</font>를 선택할 경우 소리를 즉시 연주하고, 연주를 명령한 시간동안 기다립니다. <font color='crimson'>예약</font>을 선택한 경우에는 소리를 예약하고, 바로 다음 블럭으로 넘어갑니다. 예약은 최대 12개까지 누적할 수 있습니다.",
                robolink_codrone_mini_controller_buzzer_hz                : "지정한 주파수의 소리를 지정한 시간동안 연주하거나 예약합니다.<br><br>권장 사용 범위는 250 ~ 8000 입니다.<br><br>4옥타브를 기준으로 도(261), 도#(277), 레(293), 레#(311), 미(329), 파(349), 파#(370), 솔(392), 솔#(415), 라(440), 라#(466), 시(493)입니다. 여기에서 한 옥타브 올라갈 때마다 주파수 값이 두 배가 됩니다. 한 옥타브 내려갈 때에는 주파수 값이 절반이 됩니다. 예를 들면 3옥타브의 도는 130.8128Hz, 4옥타브의 도는 261.6256Hz, 5옥타브의 도는 523.2511Hz 입니다.<br><br><font color='dodgerblue'>연주</font>를 선택할 경우 소리를 즉시 연주하고, 연주를 명령한 시간동안 기다립니다. <font color='crimson'>예약</font>을 선택한 경우에는 소리를 예약하고, 바로 다음 블럭으로 넘어갑니다. 예약은 최대 12개까지 누적할 수 있습니다.",
            },
        },

        en: {
            Blocks: {
                // 정보창
                value_state_mode_flight               : 'Flight Mode',
                value_state_mode_control_flight       : 'Control Mode',
                value_state_mode_movement             : 'Movement',
                value_state_headless                  : 'Headless',
                value_state_control_speed             : 'Control Speed',
                value_state_sensor_orientation        : 'Sensor Orientation',
                value_state_battery                   : 'Battery',
                value_altitude_temperature            : 'Temperature',
                value_altitude_pressure               : 'Pressure',
                value_altitude_altitude               : 'Altitude',
                value_motion_accel_x                  : 'Accel X',
                value_motion_accel_y                  : 'Accel Y',
                value_motion_accel_z                  : 'Accel Z',
                value_motion_gyro_roll                : 'Gyro Roll',
                value_motion_gyro_pitch               : 'Gyro Pitch',
                value_motion_gyro_yaw                 : 'Gyro Yaw',
                value_motion_angle_roll               : 'Roll',
                value_motion_angle_pitch              : 'Pitch',
                value_motion_angle_yaw                : 'Yaw',
                value_trim_roll                       : 'Trim Roll',
                value_trim_pitch                      : 'Trim Pitch',
                value_joystick_left_x                 : 'Left Joystick X',
                value_joystick_left_y                 : 'Left Joystick Y',
                value_joystick_left_direction         : 'Left Joystick Direction',
                value_joystick_left_event             : 'Left Joystick Event',
                value_joystick_right_x                : 'Right Joystick X',
                value_joystick_right_y                : 'Right Joystick Y',
                value_joystick_right_direction        : 'Right Joystick Direction',
                value_joystick_right_event            : 'Right Joystick Event',
                value_button_button                   : 'Button',
                value_button_event                    : 'Button Event',
                value_entry_hw_count_transfer_reserved: 'Count of data to transfer',

                // 일반 블럭
                common_light_color_red                  : 'red',
                common_light_color_yellow               : 'yellow',
                common_light_color_green                : 'green',
                common_light_color_cyan                 : 'cyan',
                common_light_color_blue                 : 'blue',
                common_light_color_magenta              : 'magenta',
                common_light_color_white                : 'white',
                common_light_color_black                : 'black',
                common_light_color_cotton_candy         : 'cotton candy',
                common_light_color_emerald              : 'emerald',
                common_light_color_lavender             : 'lavender',
                common_light_color_muscat               : 'muscat',
                common_light_color_strawberry_milk      : 'strawberry milk',
                common_light_color_sunset               : 'sunset',
                common_light_mode_hold                  : 'hold',
                common_light_mode_flicker               : 'flicker',
                common_light_mode_flicker_double        : 'flicker double',
                common_light_mode_dimming               : 'dimming',
                common_light_mode_sunrise               : 'sunrise',
                common_light_mode_sunset                : 'sunset',
                common_light_mode_rainbow               : 'rainbow',
                common_light_mode_rainbow2              : 'rainbow2',
                common_left                             : 'left',
                common_right                            : 'right',
                common_drone                            : 'drone',
                common_controller                       : 'controller',
                controller_button_front_left            : 'Front left button',
                controller_button_front_right           : 'Front right button',
                controller_button_top_left              : 'Top left button',
                controller_button_top_right             : 'Top right button',
                controller_button_center_up             : 'Trim up button',
                controller_button_center_left           : 'Trim left button',
                controller_button_center_right          : 'Trim right button',
                controller_button_center_down           : 'Trim down button',
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
                controller_buzzer_play                  : 'play',
                controller_buzzer_reserve               : 'reserve',
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
                drone_control_quad_yaw_cw               : 'Clockwise',
                drone_headless_off                      : 'Off',
                drone_headless_on                       : 'On',
                drone_light_color_body                  : 'Body',
                drone_light_manual_body_blue            : 'Blue',
                drone_light_manual_body_green           : 'Green',
                drone_light_manual_body_red             : 'Red',
                drone_motor_rotation_clockwise          : 'Clockwise',
                drone_motor_rotation_counterclockwise   : 'Counterclockwise',
            },

            template: {
                robolink_codrone_mini_drone_information                : 'Drone information %1',
                robolink_codrone_mini_drone_sensor                     : 'Sensor %1',
                robolink_codrone_mini_controller_value_button          : '%1',
                robolink_codrone_mini_controller_value_button_event    : '%1',
                robolink_codrone_mini_controller_value_joystick_left   : 'Left joystick %1',
                robolink_codrone_mini_controller_value_joystick_right  : 'Right joystick %1',
                robolink_codrone_mini_controller_if_button_press       : 'when press %1',
                robolink_codrone_mini_controller_if_joystick_direction : 'when %1 stick move to %2',
                robolink_codrone_mini_drone_control_drone_takeoff      : 'Takeoff %1',
                robolink_codrone_mini_drone_control_drone_landing      : 'Landing %1',
                robolink_codrone_mini_drone_control_drone_stop         : 'Stop %1',
                robolink_codrone_mini_drone_trim_direction             : 'Trim %1 %2',
                robolink_codrone_mini_drone_trim                       : 'Trim Roll %1%, Pitch %2% %3',
                robolink_codrone_mini_drone_speed                      : 'Speed %1 %2',
                robolink_codrone_mini_drone_flip                       : 'Flip %1 %2',
                robolink_codrone_mini_drone_sensor_reset               : 'Sensor reset %1',
                robolink_codrone_mini_drone_control_headless           : 'Headless %1 %2',
                robolink_codrone_mini_drone_control_drone_reset_heading: 'Reset heading %1',
                robolink_codrone_mini_drone_control_quad_one           : 'Set %1 %2% %3',
                robolink_codrone_mini_drone_control_quad_one_delay     : 'Set %1 %2% %3 sec %4',
                robolink_codrone_mini_drone_control_quad               : 'Set Roll %1%, Pitch %2%, Yaw %3%, Throttle %4% %5',
                robolink_codrone_mini_drone_control_quad_delay         : 'Set Roll %1%, Pitch %2%, Yaw %3%, Throttle %4% for %5sec %6',
                robolink_codrone_mini_drone_motor_stop                 : 'Motor stop %1',
                robolink_codrone_mini_drone_motor_single               : 'No. %1 Motor rotate for %2 %3',
                robolink_codrone_mini_drone_light_manual_single_off    : 'Drone LED Off %1',
                robolink_codrone_mini_drone_light_manual_single_input  : 'Drone LED %1 lightness %2 %3',
                robolink_codrone_mini_drone_light_color_select         : 'Drone LED %1 %2 %3 %4',
                robolink_codrone_mini_drone_light_color_input          : 'Drone LED R %1, G %2, B %3 %4 %5 %6',
                robolink_codrone_mini_controller_buzzer_off            : 'turn off the buzzer %1',
                robolink_codrone_mini_controller_buzzer_scale          : '%4 %1 octave %2 for %3 second %5',
                robolink_codrone_mini_controller_buzzer_hz             : '%3 %1 Hz for %2 second %4',
            },

            Helper: {
                robolink_codrone_mini_drone_information                : '',
                robolink_codrone_mini_drone_sensor                     : '',
                robolink_codrone_mini_controller_value_button          : '',
                robolink_codrone_mini_controller_value_button_event    : '',
                robolink_codrone_mini_controller_value_joystick_left   : '',
                robolink_codrone_mini_controller_value_joystick_right  : '',
                robolink_codrone_mini_controller_if_button_press       : '',
                robolink_codrone_mini_controller_if_joystick_direction : '',
                robolink_codrone_mini_drone_control_drone_takeoff      : '',
                robolink_codrone_mini_drone_control_drone_landing      : '',
                robolink_codrone_mini_drone_control_drone_stop         : '',
                robolink_codrone_mini_drone_trim_direction             : '',
                robolink_codrone_mini_drone_trim                       : '',
                robolink_codrone_mini_drone_speed                      : '',
                robolink_codrone_mini_drone_flip                       : '',
                robolink_codrone_mini_drone_sensor_reset               : '',
                robolink_codrone_mini_drone_control_headless           : '',
                robolink_codrone_mini_drone_control_drone_reset_heading: '',
                robolink_codrone_mini_drone_control_quad_one           : '',
                robolink_codrone_mini_drone_control_quad_one_delay     : '',
                robolink_codrone_mini_drone_control_quad               : '',
                robolink_codrone_mini_drone_control_quad_delay         : '',
                robolink_codrone_mini_drone_motor_stop                 : '',
                robolink_codrone_mini_drone_motor_single               : '',
                robolink_codrone_mini_drone_light_manual_single_off    : '',
                robolink_codrone_mini_drone_light_manual_single_input  : '',
                robolink_codrone_mini_drone_light_color_select         : '',
                robolink_codrone_mini_drone_light_color_input          : '',
                robolink_codrone_mini_controller_buzzer_off            : '',
                robolink_codrone_mini_controller_buzzer_scale          : '',
                robolink_codrone_mini_controller_buzzer_hz             : '',
            },
        },
    };
};


// Entry 좌측 하단 하드웨어 모니터 화면에 표시하는 속성
// listPorts와 ports 두 곳 동시에 동일한 속성을 표시할 수는 없음
Entry.robolink_codrone_mini.monitorTemplate = function () {
    return {
        /* 센서창 가림 현상을 해결하기 위해서 주석 처리함(2017.11.06)
        imgPath: "hw/robolink_codrone_mini.png",   // 배경 이미지
        width  : 256,                             // 이미지의 폭
        height : 256,                             // 이미지의 높이
        */

        // 모니터 화면 상단에 차례대로 나열하는 값
        listPorts: {
            state_modeFlight             : { name: Lang.Blocks.value_state_mode_flight, type: 'input', pos: { x: 0, y: 0 } },
            state_modeControlFlight      : { name: Lang.Blocks.value_state_mode_control_flight, type: 'input', pos: { x: 0, y: 0 } },
            state_modeMovement           : { name: Lang.Blocks.value_state_mode_movement, type: 'input', pos: { x: 0, y: 0 } },
            state_headless               : { name: Lang.Blocks.value_state_headless, type: 'input', pos: { x: 0, y: 0 } },
            state_controlSpeed           : { name: Lang.Blocks.value_state_control_speed, type: 'input', pos: { x: 0, y: 0 } },
            state_sensorOrientation      : { name: Lang.Blocks.value_state_sensor_orientation, type: 'input', pos: { x: 0, y: 0 } },
            state_battery                : { name: Lang.Blocks.value_state_battery, type: 'input', pos: { x: 0, y: 0 } },
            altitude_temperature         : { name: Lang.Blocks.value_altitude_temperature, type: 'input', pos: { x: 0, y: 0 } },
            altitude_pressure            : { name: Lang.Blocks.value_altitude_pressure, type: 'input', pos: { x: 0, y: 0 } },
            altitude_altitude            : { name: Lang.Blocks.value_altitude_altitude, type: 'input', pos: { x: 0, y: 0 } },
            motion_accelX                : { name: Lang.Blocks.value_motion_accel_x, type: 'input', pos: { x: 0, y: 0 } },
            motion_accelY                : { name: Lang.Blocks.value_motion_accel_y, type: 'input', pos: { x: 0, y: 0 } },
            motion_accelZ                : { name: Lang.Blocks.value_motion_accel_z, type: 'input', pos: { x: 0, y: 0 } },
            motion_gyroRoll              : { name: Lang.Blocks.value_motion_gyro_roll, type: 'input', pos: { x: 0, y: 0 } },
            motion_gyroPitch             : { name: Lang.Blocks.value_motion_gyro_pitch, type: 'input', pos: { x: 0, y: 0 } },
            motion_gyroYaw               : { name: Lang.Blocks.value_motion_gyro_yaw, type: 'input', pos: { x: 0, y: 0 } },
            motion_angleRoll             : { name: Lang.Blocks.value_motion_angle_roll, type: 'input', pos: { x: 0, y: 0 } },
            motion_anglePitch            : { name: Lang.Blocks.value_motion_angle_pitch, type: 'input', pos: { x: 0, y: 0 } },
            motion_angleYaw              : { name: Lang.Blocks.value_motion_angle_yaw, type: 'input', pos: { x: 0, y: 0 } },
            trim_roll                    : { name: Lang.Blocks.value_trim_roll, type: 'input', pos: { x: 0, y: 0 } },
            trim_pitch                   : { name: Lang.Blocks.value_trim_pitch, type: 'input', pos: { x: 0, y: 0 } },
            joystick_left_x              : { name: Lang.Blocks.value_joystick_left_x, type: 'input', pos: { x: 0, y: 0 } },
            joystick_left_y              : { name: Lang.Blocks.value_joystick_left_y, type: 'input', pos: { x: 0, y: 0 } },
            joystick_left_direction      : { name: Lang.Blocks.value_joystick_left_direction, type: 'input', pos: { x: 0, y: 0 } },
            joystick_left_event          : { name: Lang.Blocks.value_joystick_left_event, type: 'input', pos: { x: 0, y: 0 } },
            joystick_right_x             : { name: Lang.Blocks.value_joystick_right_x, type: 'input', pos: { x: 0, y: 0 } },
            joystick_right_y             : { name: Lang.Blocks.value_joystick_right_y, type: 'input', pos: { x: 0, y: 0 } },
            joystick_right_direction     : { name: Lang.Blocks.value_joystick_right_direction, type: 'input', pos: { x: 0, y: 0 } },
            joystick_right_event         : { name: Lang.Blocks.value_joystick_right_event, type: 'input', pos: { x: 0, y: 0 } },
            button_button                : { name: Lang.Blocks.value_button_button, type: 'input', pos: { x: 0, y: 0 } },
            button_event                 : { name: Lang.Blocks.value_button_event, type: 'input', pos: { x: 0, y: 0 } },
            entryhw_countTransferReserved: { name: Lang.Blocks.value_entry_hw_count_transfer_reserved, type: 'output', pos: { x: 0, y: 0 } },
        },

        // 모니터 화면 지정 위치와 선으로 연결하여 표시하는 값
        ports: {},

        mode: 'both',   // 표시 모드
    };
};


/***************************************************************************************
 *  엔트리에 등록할 블록들의 블록명(다른 장치의 블록 이름과 달라야 함)
 ***************************************************************************************/
Entry.robolink_codrone_mini.blockMenuBlocks = [
    'robolink_codrone_mini_drone_information',
    'robolink_codrone_mini_drone_sensor',
    'robolink_codrone_mini_controller_value_button',
    'robolink_codrone_mini_controller_value_button_event',
    'robolink_codrone_mini_controller_value_joystick_left',
    'robolink_codrone_mini_controller_value_joystick_right',
    'robolink_codrone_mini_controller_if_button_press',
    'robolink_codrone_mini_controller_if_joystick_direction',
    'robolink_codrone_mini_drone_control_drone_takeoff',
    'robolink_codrone_mini_drone_control_drone_landing',
    'robolink_codrone_mini_drone_control_drone_stop',
    'robolink_codrone_mini_drone_trim_direction',
    'robolink_codrone_mini_drone_trim',
    'robolink_codrone_mini_drone_speed',
    'robolink_codrone_mini_drone_flip',
    'robolink_codrone_mini_drone_sensor_reset',
    'robolink_codrone_mini_drone_control_headless',
    'robolink_codrone_mini_drone_control_drone_reset_heading',
    'robolink_codrone_mini_drone_control_quad_one',
    'robolink_codrone_mini_drone_control_quad_one_delay',
    'robolink_codrone_mini_drone_control_quad',
    'robolink_codrone_mini_drone_control_quad_delay',
    'robolink_codrone_mini_drone_motor_stop',
    'robolink_codrone_mini_drone_motor_single',
    'robolink_codrone_mini_drone_light_manual_single_off',
    'robolink_codrone_mini_drone_light_manual_single_input',
    'robolink_codrone_mini_drone_light_color_select',
    'robolink_codrone_mini_drone_light_color_input',
    'robolink_codrone_mini_controller_buzzer_off',
    'robolink_codrone_mini_controller_buzzer_scale',
    'robolink_codrone_mini_controller_buzzer_hz',
];


/***************************************************************************************
 *  엔트리 블록 정의
 ***************************************************************************************/
Entry.robolink_codrone_mini.getBlocks = function () {
    return {
        robolink_codrone_mini_drone_information: {
            color     : EntryStatic.colorSet.block.default.HARDWARE,
            outerLine : EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton  : 'basic_string_field',
            statements: [],
            params    : [
                {
                    type   : 'Dropdown',
                    options: [
                        [Lang.Blocks.value_state_mode_flight, 'state_modeFlight'],
                        [Lang.Blocks.value_state_mode_control_flight, 'state_modeControlFlight'],
                        [Lang.Blocks.value_state_mode_movement, 'state_modeMovement'],
                        [Lang.Blocks.value_state_headless, 'state_headless'],
                        [Lang.Blocks.value_state_control_speed, 'state_controlSpeed'],
                        [Lang.Blocks.value_trim_pitch, 'trim_pitch'],
                        [Lang.Blocks.value_trim_roll, 'trim_roll'],
                        [Lang.Blocks.value_state_sensor_orientation, 'state_sensorOrientation'],
                        [Lang.Blocks.value_state_battery, 'state_battery'],
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
                type  : 'robolink_codrone_mini_drone_information',
            },
            paramsKeyMap: {
                DEVICE: 0,
            },
            class   : 'monitor',                  // 같은 이름인 객체들이 그룹으로 형성됨
            isNotFor: ['robolink_codrone_mini'],
            func(sprite, script) {
                return Entry.hw.portData[script.getField('DEVICE')];
            },
        },


        robolink_codrone_mini_drone_sensor: {
            color     : EntryStatic.colorSet.block.default.HARDWARE,
            outerLine : EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton  : 'basic_string_field',
            statements: [],
            params    : [
                {
                    type   : 'Dropdown',
                    options: [
                        [Lang.Blocks.value_motion_accel_x, 'motion_accelX'],
                        [Lang.Blocks.value_motion_accel_y, 'motion_accelY'],
                        [Lang.Blocks.value_motion_accel_z, 'motion_accelZ'],
                        [Lang.Blocks.value_motion_gyro_roll, 'motion_gyroRoll'],
                        [Lang.Blocks.value_motion_gyro_pitch, 'motion_gyroPitch'],
                        [Lang.Blocks.value_motion_gyro_yaw, 'motion_gyroYaw'],
                        [Lang.Blocks.value_motion_angle_roll, 'motion_angleRoll'],
                        [Lang.Blocks.value_motion_angle_pitch, 'motion_anglePitch'],
                        [Lang.Blocks.value_motion_angle_yaw, 'motion_angleYaw'],
                        [Lang.Blocks.value_altitude_temperature, 'altitude_temperature'],
                        [Lang.Blocks.value_altitude_pressure, 'altitude_pressure'],
                        [Lang.Blocks.value_altitude_altitude, 'altitude_altitude'],
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
                type  : 'robolink_codrone_mini_drone_sensor',
            },
            paramsKeyMap: {
                DEVICE: 0,
            },
            class   : 'monitor',                  // 같은 이름인 객체들이 그룹으로 형성됨
            isNotFor: ['robolink_codrone_mini'],
            func(sprite, script) {
                return Entry.hw.portData[script.getField('DEVICE')];
            },
        },

        
        robolink_codrone_mini_controller_value_button: {
            color     : EntryStatic.colorSet.block.default.HARDWARE,
            outerLine : EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton  : 'basic_string_field',
            statements: [],
            params    : [
                {
                    type: 'Text',
                    text: Lang.Blocks.value_button_button,
                },
            ],
            events: {},
            def   : {
                params: [null],
                type  : 'robolink_codrone_mini_controller_value_button',
            },
            paramsKeyMap: {
            },
            class   : 'monitor',                  // 같은 이름인 객체들이 그룹으로 형성됨
            isNotFor: ['robolink_codrone_mini'],
            func(sprite, script) {
                const button = Entry.hw.portData['button_button'];
                if( button == undefined )
                {
                    return 0;
                }
                return button;
            },
        },


        robolink_codrone_mini_controller_value_button_event: {
            color     : EntryStatic.colorSet.block.default.HARDWARE,
            outerLine : EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton  : 'basic_string_field',
            statements: [],
            params    : [
                {
                    type: 'Text',
                    text: Lang.Blocks.value_button_event,
                },
            ],
            events: {},
            def   : {
                params: [null],
                type  : 'robolink_codrone_mini_controller_value_button_event',
            },
            paramsKeyMap: {
            },
            class   : 'monitor',                  // 같은 이름인 객체들이 그룹으로 형성됨
            isNotFor: ['robolink_codrone_mini'],
            func(sprite, script) {
                const button_event = Entry.hw.portData['button_event'];
                if( button_event == undefined )
                {
                    return 0;
                }
                return button_event;
            },
        },


        robolink_codrone_mini_controller_value_joystick_left: {
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
                type  : 'robolink_codrone_mini_controller_value_joystick_left',
            },
            paramsKeyMap: {
                DEVICE: 0,
            },
            class   : 'monitor',                  // 같은 이름인 객체들이 그룹으로 형성됨
            isNotFor: ['robolink_codrone_mini'],
            func(sprite, script) {
                return Entry.hw.portData[script.getField('DEVICE')];
            },
        },


        robolink_codrone_mini_controller_value_joystick_right: {
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
                type  : 'robolink_codrone_mini_controller_value_joystick_right',
            },
            paramsKeyMap: {
                DEVICE: 0,
            },
            class   : 'monitor',                  // 같은 이름인 객체들이 그룹으로 형성됨
            isNotFor: ['robolink_codrone_mini'],
            func(sprite, script) {
                return Entry.hw.portData[script.getField('DEVICE')];
            },
        },


        robolink_codrone_mini_controller_if_button_press: {
            color     : EntryStatic.colorSet.block.default.HARDWARE,
            outerLine : EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor : '#fff',
            skeleton  : 'basic_boolean_field',
            statements: [],
            params    : [
                {
                    type   : 'Dropdown',
                    options: [
                        [Lang.Blocks.controller_button_front_left, '1'],
                        [Lang.Blocks.controller_button_front_right, '2'],
                        [Lang.Blocks.controller_button_top_left, '4'],
                        [Lang.Blocks.controller_button_top_right, '8'],
                        [Lang.Blocks.controller_button_center_up, '16'],
                        [Lang.Blocks.controller_button_center_left, '32'],
                        [Lang.Blocks.controller_button_center_right, '128'],
                        [Lang.Blocks.controller_button_center_down, '256'],
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
                type  : 'robolink_codrone_mini_controller_if_button_press',
            },
            paramsKeyMap: {
                BUTTON: 0,
            },
            class   : 'boolean_input',
            isNotFor: ['robolink_codrone_mini'],
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


        robolink_codrone_mini_controller_if_joystick_direction: {
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
                type  : 'robolink_codrone_mini_controller_if_joystick_direction',
            },
            paramsKeyMap: {
                DEVICE   : 0,
                DIRECTION: 1,
            },
            class   : 'boolean_input',
            isNotFor: ['robolink_codrone_mini'],
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


        robolink_codrone_mini_drone_light_manual_single_off: {
            color     : EntryStatic.colorSet.block.default.HARDWARE,
            outerLine : EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton  : 'basic',
            statements: [],
            params    : [{ type: 'Indicator', img: 'block_icon/hardware_icon.svg', size: 12 }],
            events    : {},
            def       : {
                params: [null],
                type  : 'robolink_codrone_mini_drone_light_manual_single_off',
            },
            paramsKeyMap: {},
            class       : 'drone_light',
            isNotFor    : ['robolink_codrone_mini'],
            func(sprite, script) {
                return Entry.byrobot_base.setLightManual(script, 0x10, 0xff, 0);
            },
        },


        robolink_codrone_mini_drone_light_manual_single_input: {
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
                type: 'robolink_codrone_mini_drone_light_manual_single_input',
            },
            paramsKeyMap: {
                FLAGS     : 0,
                BRIGHTNESS: 1,
            },
            class   : 'drone_light',
            isNotFor: ['robolink_codrone_mini'],
            func(sprite, script) {
                const flags      = parseInt(script.getStringValue('FLAGS'));
                const brightness = script.getNumberValue('BRIGHTNESS');
                return Entry.byrobot_base.setLightManual(script, 0x10, flags, brightness);
            },
        },


        robolink_codrone_mini_drone_light_color_input: {
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
                        [Lang.Blocks.common_light_mode_sunrise, '6'],           // BodySunrise         = 0x26
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
                type: 'robolink_codrone_mini_drone_light_color_input',
            },
            paramsKeyMap: {
                RED     : 0,
                GREEN   : 1,
                BLUE    : 2,
                MODE    : 3,
                INTERVAL: 4,
            },
            class   : 'drone_light',
            isNotFor: ['robolink_codrone_mini'],
            func(sprite, script) {
                const mode     = 0x20 + parseInt(script.getField('MODE'), 10);
                const red      = script.getNumberValue('RED');
                const green    = script.getNumberValue('GREEN');
                const blue     = script.getNumberValue('BLUE');
                const interval = script.getNumberValue('INTERVAL');
                return Entry.byrobot_base.setLightModeColor(script, 0x10, mode, interval, red, green, blue);
            },
        },


        robolink_codrone_mini_drone_light_color_select: {
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
                        [Lang.Blocks.common_light_color_cotton_candy, 'cottonCandy'],
                        [Lang.Blocks.common_light_color_muscat, 'muscat'],
                        [Lang.Blocks.common_light_color_strawberry_milk, 'strawberryMilk'],
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
                        [Lang.Blocks.common_light_mode_sunrise, '6'],           // BodySunrise         = 0x26
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
                type  : 'robolink_codrone_mini_drone_light_color_select',
            },
            paramsKeyMap: {
                COLOR   : 0,
                MODE    : 1,
                INTERVAL: 2,
            },
            class   : 'drone_light',
            isNotFor: ['robolink_codrone_mini'],
            func(sprite, script) {
                const mode        = 0x20 + parseInt(script.getField('MODE'), 10);
                const interval    = script.getNumberValue('INTERVAL');
                const colorString = script.getField('COLOR');
                return Entry.byrobot_base.setLightModeColorString(script, 0x10, mode, interval, colorString);
            },
        },


        robolink_codrone_mini_controller_buzzer_off: {
            color     : EntryStatic.colorSet.block.default.HARDWARE,
            outerLine : EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton  : 'basic',
            statements: [],
            params    : [{ type: 'Indicator', img: 'block_icon/hardware_icon.svg', size: 12 }],
            events    : {},
            def       : {
                params: [null],
                type  : 'robolink_codrone_mini_controller_buzzer_off',
            },
            paramsKeyMap: {},
            class       : 'buzzer',
            isNotFor    : ['robolink_codrone_mini'],
            func(sprite, script) {
                return Entry.byrobot_base.setBuzzerStop(script, 0x20);
            },
        },


        robolink_codrone_mini_controller_buzzer_scale: {
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
                        [Lang.Blocks.controller_buzzer_c,  '0'],
                        [Lang.Blocks.controller_buzzer_cs, '1'],
                        [Lang.Blocks.controller_buzzer_d,  '2'],
                        [Lang.Blocks.controller_buzzer_ds, '3'],
                        [Lang.Blocks.controller_buzzer_e,  '4'],
                        [Lang.Blocks.controller_buzzer_f,  '5'],
                        [Lang.Blocks.controller_buzzer_fs, '6'],
                        [Lang.Blocks.controller_buzzer_g,  '7'],
                        [Lang.Blocks.controller_buzzer_gs, '8'],
                        [Lang.Blocks.controller_buzzer_a,  '9'],
                        [Lang.Blocks.controller_buzzer_as, '10'],
                        [Lang.Blocks.controller_buzzer_b,  '11'],
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
                        [Lang.Blocks.controller_buzzer_play,    1],
                        [Lang.Blocks.controller_buzzer_reserve, 0],
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
                    null,
                    { type: 'text', params: ['1'] },
                    null,
                    null
                ],
                type: 'robolink_codrone_mini_controller_buzzer_scale',
            },
            paramsKeyMap: {
                OCTAVE: 0,
                SCALE : 1,
                TIME  : 2,
                WAIT  : 3,
            },
            class   : 'buzzer',
            isNotFor: ['robolink_codrone_mini'],
            func(sprite, script) {
                const octave = parseInt(script.getField('OCTAVE'), 10);
                const scale  = parseInt(script.getField('SCALE'), 10);
                const time   = script.getNumberValue('TIME') * 1000;
                const wait   = script.getNumberValue('WAIT');

                if (scale == -1) {
                    if (wait == 1)
                    {
                        return Entry.byrobot_base.setBuzzerMute(script, 0x20, time, true, true);
                    }
                    else
                    {
                        return Entry.byrobot_base.setBuzzerMute(script, 0x20, time, false, false);
                    }
                } else {
                    if (wait == 1)
                    {
                        return Entry.byrobot_base.setBuzzerScale(script, 0x20, octave, scale, time, true, true);
                    }
                    else
                    {
                        return Entry.byrobot_base.setBuzzerScale(script, 0x20, octave, scale, time, false, false);
                    }
                }
            },
        },


        robolink_codrone_mini_controller_buzzer_hz: {
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
                        [Lang.Blocks.controller_buzzer_play,    1],
                        [Lang.Blocks.controller_buzzer_reserve, 0],
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
                    { type: 'text', params: ['1000'] },
                    { type: 'text', params: ['1'] },
                    null,
                    null,
                ],
                type: 'robolink_codrone_mini_controller_buzzer_hz',
            },
            paramsKeyMap: {
                HZ   : 0,
                TIME : 1,
                WAIT : 2,
            },
            class   : 'buzzer',
            isNotFor: ['robolink_codrone_mini'],
            func(sprite, script) {
                const hz   = script.getNumberValue('HZ');
                const time = script.getNumberValue('TIME') * 1000;
                const wait   = script.getNumberValue('WAIT');
                
                if (wait == 1)
                {
                    return Entry.byrobot_base.setBuzzerHz(script, 0x20, hz, time, true, true);
                }
                else
                {
                    return Entry.byrobot_base.setBuzzerHz(script, 0x20, hz, time, false, false);
                }
            },
        },


        robolink_codrone_mini_drone_motor_stop: {
            color     : EntryStatic.colorSet.block.default.HARDWARE,
            outerLine : EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton  : 'basic',
            statements: [],
            params    : [{ type: 'Indicator', img: 'block_icon/hardware_icon.svg', size: 12 }],
            events    : {},
            def       : {
                params: [null],
                type  : 'robolink_codrone_mini_drone_motor_stop',
            },
            paramsKeyMap: {},
            class       : 'motor',
            isNotFor    : ['robolink_codrone_mini'],
            func(sprite, script) {
                return Entry.byrobot_base.sendStop(script, 0x10);
            },
        },


        robolink_codrone_mini_drone_motor_single: {
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
                type  : 'robolink_codrone_mini_drone_motor_single',
            },
            paramsKeyMap: {
                MOTORINDEX: 0,
                MOTORSPEED: 1,
            },
            class   : 'motor',
            isNotFor: ['robolink_codrone_mini'],
            func(sprite, script) {
                const motorIndex = script.getNumberValue('MOTORINDEX') - 1;
                const motorSpeed = script.getNumberValue('MOTORSPEED');

                return Entry.byrobot_base.setMotorSingleV(script, 0x10, motorIndex, motorSpeed);
            },
        },


        robolink_codrone_mini_drone_control_drone_takeoff: {
            color     : EntryStatic.colorSet.block.default.HARDWARE,
            outerLine : EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton  : 'basic',
            statements: [],
            params    : [{ type: 'Indicator', img: 'block_icon/hardware_icon.svg', size: 12 }],
            events    : {},
            def       : {
                params: [null],
                type  : 'robolink_codrone_mini_drone_control_drone_takeoff',
            },
            paramsKeyMap: {},
            class       : 'control_flight',
            isNotFor    : ['robolink_codrone_mini'],
            func(sprite, script) {
                return Entry.byrobot_base.setEventFlight(script, 0x10, 0x11, 5000); // 0x11 : FlightEvent::TakeOff
            },
        },


        robolink_codrone_mini_drone_control_drone_landing: {
            color     : EntryStatic.colorSet.block.default.HARDWARE,
            outerLine : EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton  : 'basic',
            statements: [],
            params    : [{ type: 'Indicator', img: 'block_icon/hardware_icon.svg', size: 12 }],
            events    : {},
            def       : {
                params: [null],
                type  : 'robolink_codrone_mini_drone_control_drone_landing',
            },
            paramsKeyMap: {},
            class       : 'control_flight',
            isNotFor    : ['robolink_codrone_mini'],
            func(sprite, script) {
                return Entry.byrobot_base.setEventFlight(script, 0x10, 0x12, 5000); // 0x12 : FlightEvent::Landing
            },
        },


        robolink_codrone_mini_drone_control_drone_stop: {
            color     : EntryStatic.colorSet.block.default.HARDWARE,
            outerLine : EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton  : 'basic',
            statements: [],
            params    : [{ type: 'Indicator', img: 'block_icon/hardware_icon.svg', size: 12 }],
            events    : {},
            def       : {
                params: [null],
                type  : 'robolink_codrone_mini_drone_control_drone_stop',
            },
            paramsKeyMap: {},
            class       : 'control_flight',
            isNotFor    : ['robolink_codrone_mini'],
            func(sprite, script) {
                return Entry.byrobot_base.sendStop(script, 0x10);
            },
        },


        robolink_codrone_mini_drone_control_headless: {
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
                type  : 'robolink_codrone_mini_drone_control_headless',
            },
            paramsKeyMap: {
                HEADLESS: 0,
            },
            class   : 'control_flight',
            isNotFor: ['robolink_codrone_mini'],
            func(sprite, script) {
                const headless = script.getField('HEADLESS');
                return Entry.byrobot_base.sendCommand(script, 0x10, 0x03, headless);
            },
        },


        robolink_codrone_mini_drone_control_drone_reset_heading: {
            color     : EntryStatic.colorSet.block.default.HARDWARE,
            outerLine : EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton  : 'basic',
            statements: [],
            params    : [{ type: 'Indicator', img: 'block_icon/hardware_icon.svg', size: 12 }],
            events    : {},
            def       : {
                params: [null],
                type  : 'robolink_codrone_mini_drone_control_drone_reset_heading',
            },
            paramsKeyMap: {},
            class       : 'control_flight',
            isNotFor    : ['robolink_codrone_mini'],
            func(sprite, script) {
                return Entry.byrobot_base.sendCommand(script, 0x10, 0x07, 0xA0); // 0x22 : CommandType::FlightEvent  // 0xA0 : FlightEvent::ResetHeading
            },
        },


        robolink_codrone_mini_drone_trim_direction: {
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
                type  : 'robolink_codrone_mini_drone_trim_direction',
            },
            paramsKeyMap: {
                DIRECTION: 0,
            },
            class   : 'trim',
            isNotFor: ['robolink_codrone_mini'],
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


        robolink_codrone_mini_drone_trim: {
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
                type: 'robolink_codrone_mini_drone_trim',
            },
            paramsKeyMap: {
                ROLL    : 0,
                PITCH   : 1,
            },
            class   : 'trim',
            isNotFor: ['robolink_codrone_mini'],
            func(sprite, script) {
                const r = script.getNumberValue('ROLL');
                const p = script.getNumberValue('PITCH');
                const y = Entry.hw.portData['trim_yaw'];
                const t = Entry.hw.portData['trim_throttle'];

                return Entry.byrobot_base.sendTrim(script, 0x10, r, p, y, t);
            },
        },


        robolink_codrone_mini_drone_speed: {
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
                type  : 'robolink_codrone_mini_drone_speed',
            },
            paramsKeyMap: {
                LEVEL: 0,
            },
            class   : 'trim',
            isNotFor: ['robolink_codrone_mini'],
            func(sprite, script) {
                const level = script.getField('LEVEL');
                return Entry.byrobot_base.sendCommand(script, 0x10, 0x04, level);
            },
        },


        robolink_codrone_mini_drone_flip: {
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
                type  : 'robolink_codrone_mini_drone_flip',
            },
            paramsKeyMap: {
                DIRECTION: 0,
            },
            class   : 'flip',
            isNotFor: ['robolink_codrone_mini'],
            func(sprite, script) {
                const direction = script.getField('DIRECTION');
                return Entry.byrobot_base.sendCommand(script, 0x10, 0x07, direction);
            },
        },


        robolink_codrone_mini_drone_sensor_reset: {
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
                type  : 'robolink_codrone_mini_drone_sensor_reset',
            },
            paramsKeyMap: {
            },
            class   : 'sensor',
            isNotFor: ['robolink_codrone_mini'],
            func(sprite, script) {
                return Entry.byrobot_base.sendCommand(script, 0x10, 0x05, 0, 3000);
            },
        },


        robolink_codrone_mini_drone_control_quad_one: {
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
                type  : 'robolink_codrone_mini_drone_control_quad_one',
            },
            paramsKeyMap: {
                CONTROLTARGET: 0,
                VALUE        : 1,
            },
            class   : 'control_quad',
            isNotFor: ['robolink_codrone_mini'],
            func(sprite, script) {
                const controlTarget = script.getField('CONTROLTARGET');
                const value         = script.getNumberValue('VALUE');

                return Entry.byrobot_base.sendControlQuadSingle(script, 0x10, controlTarget, value, 0, false);
            },
        },


        robolink_codrone_mini_drone_control_quad_one_delay: {
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
                type: 'robolink_codrone_mini_drone_control_quad_one_delay',
            },
            paramsKeyMap: {
                CONTROLTARGET: 0,
                VALUE        : 1,
                TIME         : 2,
            },
            class   : 'control_quad',
            isNotFor: ['robolink_codrone_mini'],
            func(sprite, script) {
                const controlTarget = script.getField('CONTROLTARGET');
                const value         = script.getNumberValue('VALUE');
                const time          = script.getNumberValue('TIME') * 1000;

                return Entry.byrobot_base.sendControlQuadSingle(script, 0x10, controlTarget, value, time, true);
            },
        },


        robolink_codrone_mini_drone_control_quad: {
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
                type: 'robolink_codrone_mini_drone_control_quad',
            },
            paramsKeyMap: {
                ROLL    : 0,
                PITCH   : 1,
                YAW     : 2,
                THROTTLE: 3,
            },
            class   : 'control_quad',
            isNotFor: ['robolink_codrone_mini'],
            func(sprite, script) {
                const roll     = script.getNumberValue('ROLL');
                const pitch    = script.getNumberValue('PITCH');
                const yaw      = script.getNumberValue('YAW');
                const throttle = script.getNumberValue('THROTTLE');

                return Entry.byrobot_base.sendControlQuad(script, 0x10, roll, pitch, yaw, throttle, 0, false);
            },
        },


        robolink_codrone_mini_drone_control_quad_delay: {
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
                type: 'robolink_codrone_mini_drone_control_quad_delay',
            },
            paramsKeyMap: {
                ROLL    : 0,
                PITCH   : 1,
                YAW     : 2,
                THROTTLE: 3,
                TIME    : 4,
            },
            class   : 'control_quad',
            isNotFor: ['robolink_codrone_mini'],
            func(sprite, script) {
                const roll     = script.getNumberValue('ROLL');
                const pitch    = script.getNumberValue('PITCH');
                const yaw      = script.getNumberValue('YAW');
                const throttle = script.getNumberValue('THROTTLE');
                const time     = script.getNumberValue('TIME') * 1000;

                return Entry.byrobot_base.sendControlQuad(script, 0x10, roll, pitch, yaw, throttle, time, true);
            },
        },


    };
};


module.exports = Entry.robolink_codrone_mini;

