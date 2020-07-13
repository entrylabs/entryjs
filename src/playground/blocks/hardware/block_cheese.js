'use strict';

Entry.Cheese = {
    setZero() {
        Entry.Robomation.setZero();
    },
    afterReceive(pd) {
        Entry.Robomation.afterReceive(pd, false);
    },
    afterSend(sq) {
        Entry.Robomation.afterSend(sq);
    },
    getRobot() {
        const robot = Entry.Robomation.getRobot('cheese', 0);
        if (robot) {
            robot.setMotoring(Entry.hw.sendQueue);
        }
        return robot;
    },
    id: '2.D',
    name: 'cheese',
    url: 'http://www.robomation.net',
    imageName: 'cheese.png',
    title: {
        ko: '치즈 스틱',
        en: 'Cheese Stick',
        jp: 'チーズスティック',
        vn: 'Cheese Stick',
    },
    monitorTemplate: () => ({
        imgPath: 'hw/cheese.png',
        width: 444,
        height: 300,
        listPorts: {
            accelerationX: {
                name: Lang.Blocks.ROBOID_sensor_acceleration_x,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            accelerationY: {
                name: Lang.Blocks.ROBOID_sensor_acceleration_y,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            accelerationZ: {
                name: Lang.Blocks.ROBOID_sensor_acceleration_z,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            stepCount: {
                name: Lang.Blocks.ROBOID_sensor_step_count,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            buzzer: {
                name: Lang.Blocks.ROBOID_monitor_buzzer,
                type: 'output',
                pos: { x: 0, y: 0 },
            },
            note: {
                name: Lang.Blocks.ROBOID_monitor_note,
                type: 'output',
                pos: { x: 0, y: 0 },
            },
        },
        ports: {
            inputSa: {
                name: Lang.Blocks.ROBOID_sensor_input_sa,
                type: 'input',
                pos: { x: 199, y: 219 },
            },
            inputSb: {
                name: Lang.Blocks.ROBOID_sensor_input_sb,
                type: 'input',
                pos: { x: 305, y: 169 },
            },
            inputSc: {
                name: Lang.Blocks.ROBOID_sensor_input_sc,
                type: 'input',
                pos: { x: 400, y: 123 },
            },
            inputLa: {
                name: Lang.Blocks.ROBOID_sensor_input_la,
                type: 'input',
                pos: { x: 83, y: 102 },
            },
            inputLb: {
                name: Lang.Blocks.ROBOID_sensor_input_lb,
                type: 'input',
                pos: { x: 100, y: 96 },
            },
            inputLc: {
                name: Lang.Blocks.ROBOID_sensor_input_lc,
                type: 'input',
                pos: { x: 118, y: 89 },
            },
            outputSa: {
                name: Lang.Blocks.ROBOID_monitor_output_sa,
                type: 'output',
                pos: { x: 199, y: 219 },
            },
            outputSb: {
                name: Lang.Blocks.ROBOID_monitor_output_sb,
                type: 'output',
                pos: { x: 305, y: 169 },
            },
            outputSc: {
                name: Lang.Blocks.ROBOID_monitor_output_sc,
                type: 'output',
                pos: { x: 400, y: 123 },
            },
            outputLa: {
                name: Lang.Blocks.ROBOID_monitor_output_la,
                type: 'output',
                pos: { x: 83, y: 102 },
            },
            outputLb: {
                name: Lang.Blocks.ROBOID_monitor_output_lb,
                type: 'output',
                pos: { x: 100, y: 96 },
            },
            outputLc: {
                name: Lang.Blocks.ROBOID_monitor_output_lc,
                type: 'output',
                pos: { x: 118, y: 89 },
            },
            outputMab: {
                name: Lang.Blocks.ROBOID_monitor_output_mab,
                type: 'output',
                pos: { x: 274, y: 26 },
            },
            outputMcd: {
                name: Lang.Blocks.ROBOID_monitor_output_mcd,
                type: 'output',
                pos: { x: 305, y: 15 },
            },
        },
        mode: 'both',
    }),
};

Entry.Cheese.setLanguage = () => ({
    ko: {
        template: {
            cheese_value: '%1',
            cheese_boolean: '%1?',
            cheese_play_sound_times: '%1 소리 %2 번 재생하기 %3',
            cheese_play_sound_times_until_done: '%1 소리 %2 번 재생하고 기다리기 %3',
            cheese_change_buzzer_by: '버저 음을 %1 Hz만큼 바꾸기 %2',
            cheese_set_buzzer_to: '버저 음을 %1 Hz로 정하기 %2',
            cheese_clear_sound: '소리 끄기 %1',
            cheese_play_note: '%1 %2 음을 연주하기 %3',
            cheese_play_note_for: '%1 %2 음을 %3 박자 연주하기 %4',
            cheese_rest_for: '%1 박자 쉬기 %2',
            cheese_change_tempo_by: '연주 속도를 %1 BPM만큼 바꾸기 %2',
            cheese_set_tempo_to: '연주 속도를 %1 BPM으로 정하기 %2',
            cheese_set_sound_port_to: '소리 출력을 %1로 정하기 %2',
            cheese_set_input_mode_to: '포트 %1를 %2 입력으로 정하기 %3',
            cheese_set_input_range_to: '입력 %1의 범위 %2 ~ %3을(를) %4 ~ %5 소수점 %6으로 정하기 %7',
            cheese_set_three_input_ranges_to: '입력 %1의 범위 %2 ~ %3 ~ %4을(를) %5 ~ %6 ~ %7 소수점 %8으로 정하기 %9',
            cheese_analog_input: '입력 %1',
            cheese_digital_input: '입력 %1 %2 ?',
            cheese_button_state: '버튼 %1를 %2?',
            cheese_set_pulse_mode_to: '포트 %1를 %2 입력으로 정하기 %3',
            cheese_pulse_input: '포트 %1에서 펄스 감지?',
            cheese_set_digital_output_to: '디지털 출력 %1를 %2(으)로 정하기 %3',
            cheese_change_pwm_output_by: 'PWM 출력 %1를 %2%만큼 바꾸기 %3',
            cheese_set_pwm_output_to: 'PWM 출력 %1를 %2%로 정하기 %3',
            cheese_change_servo_motor_angle_by: '서보 모터 %1의 각도를 %2도만큼 바꾸기 %3',
            cheese_set_servo_motor_angle_to: '서보 모터 %1의 각도를 %2도로 정하기 %3',
            cheese_turn_off_servo_motor: '서보 모터 %1 전원 끄기 %2',
            cheese_change_dc_motor_velocity_by: 'DC 모터 %1의 속도를 %2%만큼 바꾸기 %3',
            cheese_set_dc_motor_velocity_to: 'DC 모터 %1의 속도를 %2%로 정하기 %3',
            cheese_stop_dc_motor: 'DC 모터 %1 정지하기 %2',
            cheese_rotate_step_motor: '스텝 모터 %1 스텝을 속도 %2 스텝/초로 회전하기 %3',
            cheese_change_step_motor_velocity_by: '스텝 모터의 속도를 %1 스텝/초만큼 바꾸기 %2',
            cheese_set_step_motor_velocity_to: '스텝 모터의 속도를 %1 스텝/초로 정하기 %2',
            cheese_stop_off_step_motor: '스텝 모터 %1 %2',
            cheese_set_step_motor_mode_to: '스텝 모터를 %1 모드로 정하기 %2',
            cheese_step_count: '스텝 수',
            cheese_set_led_to_color: 'RGB LED %1을(를) %2 %3으로 정하기 %4',
            cheese_pick_led_to: 'RGB LED %1을(를) %2로 정하기 %3',
            cheese_change_led_by_rgb: 'RGB LED %1을(를) R: %2 G: %3 B: %4만큼 바꾸기 %5',
            cheese_setLed_to_rgb: 'RGB LED %1을(를) R: %2 G: %3 B: %4(으)로 정하기 %5',
            cheese_clear_led: 'RGB LED %1 끄기 %2',
            cheese_set_led_type_to: 'RGB LED %1을(를) %2형으로 정하기 %3',
            cheese_neopixel_set_number_and_type_to: '네오픽셀 LED %1개, %2로 정하기 %3',
            cheese_neopixel_set_all_leds_to_pattern: '네오픽셀 모든 LED를 %1 패턴으로 정하기 %2',
            cheese_neopixel_set_all_leds_to_color: '네오픽셀 모든 LED를 %1으로 정하기 %2',
            cheese_neopixel_pick_all_leds_to: '네오픽셀 모든 LED를 %1로 정하기 %2',
            cheese_neopixel_change_all_leds_by_rgb: '네오픽셀 모든 LED를 R: %1 G: %2 B: %3만큼 바꾸기 %4',
            cheese_neopixel_set_all_leds_to_rgb: '네오픽셀 모든 LED를 R: %1 G: %2 B: %3(으)로 정하기 %4',
            cheese_neopixel_clear_all_leds: '네오픽셀 모든 LED 끄기 %1',
            cheese_neopixel_set_led_to_color: '네오픽셀 %1번째 LED를 %2으로 정하기 %3',
            cheese_neopixel_pick_led_to: '네오픽셀 %1번째 LED를 %2로 정하기 %3',
            cheese_neopixel_change_led_by_rgb: '네오픽셀 %1번째 LED를 R: %2 G: %3 B: %4만큼 바꾸기 %5',
            cheese_neopixel_set_led_to_rgb: '네오픽셀 %1번째 LED를 R: %2 G: %3 B: %4(으)로 정하기 %5',
            cheese_neopixel_clear_led: '네오픽셀 %1번째 LED 끄기 %2',
            cheese_neopixel_set_led_range_to_pattern: '네오픽셀 %1번째부터 %2번째까지의 LED를 %3 패턴으로 정하기 %4',
            cheese_neopixel_set_led_range_to_color: '네오픽셀 %1번째부터 %2번째까지 %3칸 간격의 LED를 %4으로 정하기 %5',
            cheese_neopixel_pick_led_range_to: '네오픽셀 %1번째부터 %2번째까지 %3칸 간격의 LED를 %4로 정하기 %5',
            cheese_neopixel_change_led_range_by_rgb: '네오픽셀 %1번째부터 %2번째까지 %3칸 간격의 LED를 R: %4 G: %5 B: %6만큼 바꾸기 %7',
            cheese_neopixel_set_led_range_to_rgb: '네오픽셀 %1번째부터 %2번째까지 %3칸 간격의 LED를 R: %4 G: %5 B: %6(으)로 정하기 %7',
            cheese_neopixel_clear_led_range: '네오픽셀 %1번째부터 %2번째까지 %3칸 간격의 LED 끄기 %4',
            cheese_neopixel_shift: '네오픽셀 %1칸 이동하기 %2',
            cheese_neopixel_rotate: '네오픽셀 %1칸 회전하기 %2',
            cheese_neopixel_change_brightness_by: '네오픽셀 밝기를 %1%만큼 바꾸기 %2',
            cheese_neopixel_set_brightness_to: '네오픽셀 밝기를 %1%로 정하기 %2',
            cheese_write_serial: '시리얼 %1 %2 쓰기 %3',
            cheese_read_serial_until: '시리얼 %1 읽기 %2',
            cheese_set_serial_port_to: '시리얼 포트를 %1로 정하기 %2',
            cheese_set_serial_rate_to: '시리얼 속도를 %1Bd로 정하기 %2',
            cheese_serial_input: '시리얼 입력',
            cheese_pid_start: '%1 시작하기 %2',
            cheese_pid_set_range_to: 'PID %1의 범위 %2 ~ %3을(를) %4 ~ %5 소수점 %6으로 정하기 %7',
            cheese_pid_set_three_ranges_to: 'PID %1의 범위 %2 ~ %3 ~ %4을(를) %5 ~ %6 ~ %7 소수점 %8으로 정하기 %9',
            cheese_pid_reset_encoder: 'PID 엔코더 값 초기화하기 %1',
            cheese_pid_input: 'PID %1',
            cheese_pid_button_state: 'PID 버튼 %1을(를) %2?',
            cheese_hat010_start: 'HAT-010 5x5 매트릭스 시작하기 %1',
            cheese_hat010_button: 'HAT-010 버튼 %1',
            cheese_hat010_button_state: 'HAT-010 버튼 %1를 %2?',
            cheese_hat010_background_turn_on_xy: 'HAT-010 배경 x: %1 y: %2 %3으로 켜기 %4',
            cheese_hat010_background_turn_off_xy: 'HAT-010 배경 x: %1 y: %2 끄기 %3',
            cheese_hat010_background_draw_shape_at_xy: 'HAT-010 배경 %1 %2을(를) x: %3 y: %4에 그리기 %5',
            cheese_hat010_background_draw_string_at_xy: 'HAT-010 배경 %1 글자 %2을(를) x: %3 y: %4에 그리기 %5',
            cheese_hat010_background_draw_pattern_at_xy: 'HAT-010 배경 %1 패턴 %2을(를) x: %3 y: %4에 그리기 %5',
            cheese_hat010_clear: 'HAT-010 %1 지우기 %2',
            cheese_hat010_scroll_by_xy: 'HAT-010 %1 x: %2 y: %3만큼 이동하기 %4',
            cheese_hat010_sprite_set_to_shape: 'HAT-010 그림 %1을(를) %2 %3(으)로 정하기 %4',
            cheese_hat010_sprite_set_to_string: 'HAT-010 그림 %1을(를) %2 글자 %3(으)로 정하기 %4',
            cheese_hat010_sprite_set_to_pattern: 'HAT-010 그림 %1을(를) %2 패턴 %3(으)로 정하기 %4',
            cheese_hat010_sprite_clear_show_hide: 'HAT-010 그림 %1 %2 %3',
            cheese_hat010_sprite_change_positions_by_xy: 'HAT-010 그림 %1의 위치를 x: %2 y: %3만큼 바꾸기 %4',
            cheese_hat010_sprite_set_positions_to_xy: 'HAT-010 그림 %1의 위치를 x: %2 y: %3(으)로 정하기 %4',
            cheese_hat010_sprite_change_position_by_value: 'HAT-010 그림 %1의 %2 위치를 %3만큼 바꾸기 %4',
            cheese_hat010_sprite_set_position_to_value: 'HAT-010 그림 %1의 %2 위치를 %3(으)로 정하기 %4',
            cheese_hat010_sprite_rotate: 'HAT-010 그림 %1을(를) %2 방향으로 회전하기 %3',
            cheese_hat010_sprite_flip_in_direction: 'HAT-010 그림 %1을(를) %2 방향으로 뒤집기 %3',
            cheese_hat010_sprite_stamp_to_background: 'HAT-010 그림 %1을(를) 배경에 도장 찍기 %2',
            cheese_hat010_sprite_position: 'HAT-010 그림 %1의 %2 위치',
            cheese_hat010_sprite_touching_sprite: 'HAT-010 그림 %1이(가) 그림 %2에 닿았는가?',
            cheese_hat010_sprite_touching: 'HAT-010 그림 %1이(가) %2에 닿았는가?',
            cheese_hat010_change_brightness_by: 'HAT-010 밝기를 %1%만큼 바꾸기 %2',
            cheese_hat010_set_brightness_to: 'HAT-010 밝기를 %1%로 정하기 %2',
        },
        Helper: {
        },
        Blocks: {
            ROBOID_sensor_signal_strength: '신호 세기',
            ROBOID_sensor_signal_strength_dbm: '신호 세기 (dBm)',
            ROBOID_sensor_acceleration_x: 'x축 가속도',
            ROBOID_sensor_acceleration_y: 'y축 가속도',
            ROBOID_sensor_acceleration_z: 'z축 가속도',
            ROBOID_sensor_input_sa: '입력 Sa',
            ROBOID_sensor_input_sb: '입력 Sb',
            ROBOID_sensor_input_sc: '입력 Sc',
            ROBOID_sensor_input_la: '입력 La',
            ROBOID_sensor_input_lb: '입력 Lb',
            ROBOID_sensor_input_lc: '입력 Lc',
            ROBOID_sensor_step_count: '스텝 수',
            ROBOID_monitor_output_sa: '출력 Sa',
            ROBOID_monitor_output_sb: '출력 Sb',
            ROBOID_monitor_output_sc: '출력 Sc',
            ROBOID_monitor_output_la: '출력 La',
            ROBOID_monitor_output_lb: '출력 Lb',
            ROBOID_monitor_output_lc: '출력 Lc',
            ROBOID_monitor_output_mab: '출력 Mab',
            ROBOID_monitor_output_mcd: '출력 Mcd',
            ROBOID_monitor_buzzer: '버저',
            ROBOID_monitor_note: '음표',
            ROBOID_logo_sky_direction: '로고가 하늘 방향',
            ROBOID_logo_earth_direction: '로고가 땅 방향',
            ROBOID_power_switch_sky_direction: '전원 스위치가 하늘 방향',
            ROBOID_power_switch_earth_direction: '전원 스위치가 땅 방향',
            ROBOID_port_s_sky_direction: '포트 S가 하늘 방향',
            ROBOID_port_s_earth_direction: '포트 S가 땅 방향',
            ROBOID_tap: '두드림',
            ROBOID_free_fall: '자유 낙하',
            ROBOID_battery_normal: '배터리 정상',
            ROBOID_battery_low: '배터리 부족',
            ROBOID_battery_empty: '배터리 없음',
            ROBOID_sound_beep: '삐',
            ROBOID_sound_random_beep: '무작위 삐',
            ROBOID_sound_noise: '지지직',
            ROBOID_sound_siren: '사이렌',
            ROBOID_sound_engine: '엔진',
            ROBOID_sound_chop: '쩝',
            ROBOID_sound_robot: '로봇',
            ROBOID_sound_dibidibidip: '디비디비딥',
            ROBOID_sound_good_job: '잘 했어요',
            ROBOID_sound_happy: '행복',
            ROBOID_sound_angry: '화남',
            ROBOID_sound_sad: '슬픔',
            ROBOID_sound_sleep: '졸림',
            ROBOID_sound_march: '행진',
            ROBOID_sound_birthday: '생일',
            ROBOID_note_c: '도',
            ROBOID_note_c_sharp: '도♯(레♭)',
            ROBOID_note_d: '레',
            ROBOID_note_d_sharp: '레♯(미♭)',
            ROBOID_note_e: '미',
            ROBOID_note_f: '파',
            ROBOID_note_f_sharp: '파♯(솔♭)',
            ROBOID_note_g: '솔',
            ROBOID_note_g_sharp: '솔♯(라♭)',
            ROBOID_note_a: '라',
            ROBOID_note_a_sharp: '라♯(시♭)',
            ROBOID_note_b: '시',
            ROBOID_speaker_internal: '내부 스피커',
            ROBOID_speaker_port_mab: '포트 Mab',
            ROBOID_io_mode_makey: '메이키',
            ROBOID_io_mode_button: '버튼',
            ROBOID_io_mode_digital_pull_up: '디지털 (풀업)',
            ROBOID_io_mode_digital_pull_down: '디지털 (풀다운)',
            ROBOID_io_mode_analog: '아날로그',
            ROBOID_io_mode_voltage: '전압',
            ROBOID_io_mode_pulse: '펄스',
            ROBOID_io_mode_pulse_pull_up: '펄스 (풀업)',
            ROBOID_io_mode_pulse_pull_down: '펄스 (풀다운)',
            ROBOID_io_mode_normal: '기본',
            ROBOID_io_mode_power: '파워',
            ROBOID_io_port_high_current_mab: '고전류 Ma(-)b',
            ROBOID_io_port_high_current_mcd: '고전류 Mc(-)d',
            ROBOID_io_action_stop: '정지하기',
            ROBOID_io_action_turn_off: '전원 끄기',
            ROBOID_range_integer: '없음',
            ROBOID_range_real: '있음',
            ROBOID_led_intensity_dark: '어두운',
            ROBOID_led_intensity_normal: '기본',
            ROBOID_led_intensity_bright: '밝은',
            ROBOID_led_type_default: '기본',
            ROBOID_led_type_crgb: '-RGB',
            ROBOID_led_type_crbg: '-RBG',
            ROBOID_led_type_cgrb: '-GRB',
            ROBOID_led_type_cgbr: '-GBR',
            ROBOID_led_type_cbrg: '-BRG',
            ROBOID_led_type_cbgr: '-BGR',
            ROBOID_led_type_argb: '+RGB',
            ROBOID_led_type_arbg: '+RBG',
            ROBOID_led_type_agrb: '+GRB',
            ROBOID_led_type_agbr: '+GBR',
            ROBOID_led_type_abrg: '+BRG',
            ROBOID_led_type_abgr: '+BGR',
            ROBOID_color_red: '빨간색',
            ROBOID_color_orange: '주황색',
            ROBOID_color_yellow: '노란색',
            ROBOID_color_green: '초록색',
            ROBOID_color_sky_blue: '하늘색',
            ROBOID_color_blue: '파란색',
            ROBOID_color_violet: '보라색',
            ROBOID_color_purple: '자주색',
            ROBOID_color_white: '하얀색',
            ROBOID_neopixel_3_colors: '3색',
            ROBOID_neopixel_6_colors: '6색',
            ROBOID_neopixel_12_colors: '12색',
            ROBOID_neopixel_red_green: '빨간색부터 초록색까지',
            ROBOID_neopixel_red_blue: '빨간색부터 파란색까지',
            ROBOID_neopixel_red_white: '빨간색부터 하얀색까지',
            ROBOID_neopixel_green_red: '초록색부터 빨간색까지',
            ROBOID_neopixel_green_blue: '초록색부터 파란색까지',
            ROBOID_neopixel_green_white: '초록색부터 하얀색까지',
            ROBOID_neopixel_blue_red: '파란색부터 빨간색까지',
            ROBOID_neopixel_blue_green: '파란색부터 초록색까지',
            ROBOID_neopixel_blue_white: '파란색부터 하얀색까지',
            ROBOID_neopixel_white_red: '하얀색부터 빨간색까지',
            ROBOID_neopixel_white_green: '하얀색부터 초록색까지',
            ROBOID_neopixel_white_blue: '하얀색부터 파란색까지',
            ROBOID_neopixel_red_black: '빨간색 점점 어둡게',
            ROBOID_neopixel_green_black: '초록색 점점 어둡게',
            ROBOID_neopixel_blue_black: '파란색 점점 어둡게',
            ROBOID_neopixel_white_black: '하얀색 점점 어둡게',
            ROBOID_neopixel_black_red: '빨간색 점점 밝게',
            ROBOID_neopixel_black_green: '초록색 점점 밝게',
            ROBOID_neopixel_black_blue: '파란색 점점 밝게',
            ROBOID_neopixel_black_white: '하얀색 점점 밝게',
            ROBOID_serial_string: '글자',
            ROBOID_serial_string_line: '글자 한 줄',
            ROBOID_serial_all: '모두',
            ROBOID_serial_until_comma: ',(쉼표)까지',
            ROBOID_serial_until_colon: ':(쌍점)까지',
            ROBOID_serial_until_dollar: '$까지',
            ROBOID_serial_until_sharp: '#까지',
            ROBOID_serial_until_new_line: '줄 바꿈까지',
            ROBOID_serial_port_wa_rb: 'La(쓰기) Lb(읽기)',
            ROBOID_serial_port_ra_wb: 'La(읽기) Lb(쓰기)',
            ROBOID_serial_port_wa: 'La(쓰기)',
            ROBOID_serial_port_ra: 'La(읽기)',
            ROBOID_pid_10: 'PID-10 초음파 센서(HC-SR04+)',
            ROBOID_pid_11_1: 'PID-11-1 온습도 센서(DHT11)',
            ROBOID_pid_11_2: 'PID-11-2 온습도 센서(DHT21)',
            ROBOID_pid_11_3: 'PID-11-3 온습도 센서(DHT22)',
            ROBOID_pid_12: 'PID-12 온도 센서(DS18B20)',
            ROBOID_pid_13: 'PID-13 조이스틱과 버튼',
            ROBOID_pid_14: 'PID-14 듀얼 조이스틱',
            ROBOID_pid_15: 'PID-15 IR 송수신기',
            ROBOID_pid_16: 'PID-16 엔코더',
            ROBOID_pid_distance: '거리 (cm)',
            ROBOID_pid_temperature: '온도 (℃)',
            ROBOID_pid_humidity: '습도 (%RH)',
            ROBOID_pid_x1: 'x1',
            ROBOID_pid_y1: 'y1',
            ROBOID_pid_x2: 'x2',
            ROBOID_pid_y2: 'y2',
            ROBOID_pid_button1: '버튼1',
            ROBOID_pid_button2: '버튼2',
            ROBOID_pid_encoder: '엔코더',
            ROBOID_clicked: '클릭했는가',
            ROBOID_double_clicked: '더블클릭했는가',
            ROBOID_long_pressed: '오래 눌렀는가',
            ROBOID_shape_square: '사각형',
            ROBOID_shape_triangle: '삼각형',
            ROBOID_shape_diamond: '다이아몬드',
            ROBOID_shape_circle: '원',
            ROBOID_shape_x: 'X',
            ROBOID_shape_like: '좋음',
            ROBOID_shape_dislike: '싫음',
            ROBOID_shape_angry: '화남',
            ROBOID_shape_open_mouth: '입 열기',
            ROBOID_shape_close_mouth: '입 닫기',
            ROBOID_shape_walk1: '걷기 1',
            ROBOID_shape_walk2: '걷기 2',
            ROBOID_shape_heart: '하트',
            ROBOID_shape_star: '별',
            ROBOID_shape_airplane: '비행기',
            ROBOID_shape_puppy: '강아지',
            ROBOID_shape_butterfly: '나비',
            ROBOID_shape_quarter_note: '4분 음표',
            ROBOID_shape_eighth_note: '8분 음표',
            ROBOID_shape_left_arrow: '왼쪽 화살표',
            ROBOID_shape_right_arrow: '오른쪽 화살표',
            ROBOID_shape_up_arrow: '위쪽 화살표',
            ROBOID_shape_down_arrow: '아래쪽 화살표',
            ROBOID_hat_background: '배경',
            ROBOID_hat_all: '모두',
            ROBOID_hat_clear: '지우기',
            ROBOID_hat_show: '보이기',
            ROBOID_hat_hide: '숨기기',
            ROBOID_hat_clockwise: '시계',
            ROBOID_hat_counterclockwise: '반시계',
            ROBOID_hat_left_right: '왼쪽-오른쪽',
            ROBOID_hat_up_down: '위-아래',
            ROBOID_hat_auto: '자동',
            ROBOID_hat_manual: '수동',
            ROBOID_hat_other_sprite: '다른 그림',
            ROBOID_hat_left_wall: '왼쪽 벽',
            ROBOID_hat_right_wall: '오른쪽 벽',
            ROBOID_hat_top_wall: '위쪽 벽',
            ROBOID_hat_bottom_wall: '아래쪽 벽',
            ROBOID_hat_any_wall: '아무 벽',
        },
    },
    en: {
        template: {
            cheese_value: '%1',
            cheese_boolean: '%1?',
            cheese_play_sound_times: 'play sound %1 %2 times %3',
            cheese_play_sound_times_until_done: 'play sound %1 %2 times until done %3',
            cheese_change_buzzer_by: 'change buzzer by %1 Hz %2',
            cheese_set_buzzer_to: 'set buzzer to %1 Hz %2',
            cheese_clear_sound: 'clear sound %1',
            cheese_play_note: 'play note %1 %2 %3',
            cheese_play_note_for: 'play note %1 %2 for %3 beats %4',
            cheese_rest_for: 'rest for %1 beats %2',
            cheese_change_tempo_by: 'change tempo by %1 BPM %2',
            cheese_set_tempo_to: 'set tempo to %1 BPM %2',
            cheese_set_sound_port_to: 'set sound output to %1 %2',
            cheese_set_input_mode_to: 'set port %1 to %2 input %3',
            cheese_set_input_range_to: 'set input %1 range %2 - %3 to %4 - %5 %6 decimal point %7',
            cheese_set_three_input_ranges_to: 'set input %1 range %2 - %3 - %4 to %5 - %6 - %7 %8 decimal point %9',
            cheese_analog_input: 'input %1',
            cheese_digital_input: 'input %1 %2 ?',
            cheese_button_state: 'button %1 %2 ?',
            cheese_set_pulse_mode_to: 'set port %1 to %2 input %3',
            cheese_pulse_input: 'pulse detected on port %1 ?',
            cheese_set_digital_output_to: 'set digital output %1 to %2 %3',
            cheese_change_pwm_output_by: 'change pwm output %1 by %2% %3',
            cheese_set_pwm_output_to: 'set pwm output %1 to %2% %3',
            cheese_change_servo_motor_angle_by: 'change servo motor %1 by %2 degrees %3',
            cheese_set_servo_motor_angle_to: 'set servo motor %1 to %2 degrees %3',
            cheese_turn_off_servo_motor: 'turn off servo motor %1 %2',
            cheese_change_dc_motor_velocity_by: 'change dc motor %1 velocity by %2% %3',
            cheese_set_dc_motor_velocity_to: 'set dc motor %1 velocity to %2% %3',
            cheese_stop_dc_motor: 'stop dc motor %1 %2',
            cheese_rotate_step_motor: 'rotate step motor %1 steps with velocity %2 step/sec %3',
            cheese_change_step_motor_velocity_by: 'change step motor velocity by %1 step/sec %2',
            cheese_set_step_motor_velocity_to: 'set step motor velocity to %1 step/sec %2',
            cheese_stop_off_step_motor: '%1 step motor %2',
            cheese_set_step_motor_mode_to: 'set step motor to %1 mode %2',
            cheese_step_count: 'step count',
            cheese_set_led_to_color: 'set rgb led %1 to %2 %3 %4',
            cheese_pick_led_to: 'set rgb led %1 to %2 %3',
            cheese_change_led_by_rgb: 'change rgb led %1 by r: %2 g: %3 b: %4 %5',
            cheese_setLed_to_rgb: 'set rgb led %1 to r: %2 g: %3 b: %4 %5',
            cheese_clear_led: 'clear rgb led %1 %2',
            cheese_set_led_type_to: 'set rgb led %1 to %2 type %3',
            cheese_neopixel_set_number_and_type_to: 'neopixel: set %1 leds as %2 %3',
            cheese_neopixel_set_all_leds_to_color: 'neopixel: set all leds to %1 %2',
            cheese_neopixel_pick_all_leds_to: 'neopixel: set all leds to %1 %2',
            cheese_neopixel_change_all_leds_by_rgb: 'neopixel: change all leds by r: %1 g: %2 b: %3 %4',
            cheese_neopixel_set_all_leds_to_rgb: 'neopixel: set all leds to r: %1 g: %2 b: %3 %4',
            cheese_neopixel_set_all_leds_to_pattern: 'neopixel: set all leds to pattern %1 %2',
            cheese_neopixel_clear_all_leds: 'neopixel: clear all leds %1',
            cheese_neopixel_set_led_to_color: 'neopixel: set led %1 to %2 %3',
            cheese_neopixel_pick_led_to: 'neopixel: set led %1 to %2 %3',
            cheese_neopixel_change_led_by_rgb: 'neopixel: change led %1 by r: %2 g: %3 b: %4 %5',
            cheese_neopixel_set_led_to_rgb: 'neopixel: set led %1 to r: %2 g: %3 b: %4 %5',
            cheese_neopixel_clear_led: 'neopixel: clear led %1 %2',
            cheese_neopixel_set_led_range_to_color: 'neopixel: set leds (from %1 to %2 with %3 increments) to %4 %5',
            cheese_neopixel_pick_led_range_to: 'neopixel: set leds (from %1 to %2 with %3 increments) to %4 %5',
            cheese_neopixel_change_led_range_by_rgb: 'neopixel: change leds (from %1 to %2 with %3 increments) by r: %4 g: %5 b: %6 %7',
            cheese_neopixel_set_led_range_to_rgb: 'neopixel: set leds (from %1 to %2 with %3 increments) to r: %4 g: %5 b: %6 %7',
            cheese_neopixel_set_led_range_to_pattern: 'neopixel: set leds (from %1 to %2) to pattern %3 %4',
            cheese_neopixel_clear_led_range: 'neopixel: clear leds (from %1 to %2 with %3 increments) %4',
            cheese_neopixel_shift: 'neopixel: shift %1 pixels %2',
            cheese_neopixel_rotate: 'neopixel: rotate %1 pixels %2',
            cheese_neopixel_change_brightness_by: 'neopixel: change brightness by %1% %2',
            cheese_neopixel_set_brightness_to: 'neopixel: set brightness to %1% %2',
            cheese_write_serial: 'write %1 %2 to serial %3',
            cheese_read_serial_until: 'read serial %1 %2',
            cheese_set_serial_port_to: 'set serial port to %1 %2',
            cheese_set_serial_rate_to: 'set serial rate to %1Bd %2',
            cheese_serial_input: 'serial input',
            cheese_pid_start: 'start %1 %2',
            cheese_pid_set_range_to: 'PID: set %1 range %2 - %3 to %4 - %5 %6 decimal point %7',
            cheese_pid_set_three_ranges_to: 'PID: set %1 range %2 - %3 - %4 to %5 - %6 - %7 %8 decimal point %9',
            cheese_pid_reset_encoder: 'PID: clear encoder %1',
            cheese_pid_input: 'PID: %1',
            cheese_pid_button_state: 'PID: button %1 %2?',
            cheese_hat010_start: 'start HAT-010 5x5 matrix %1',
            cheese_hat010_button: 'HAT-010: button %1',
            cheese_hat010_button_state: 'HAT-010: button %1 %2?',
            cheese_hat010_background_turn_on_xy: 'HAT-010 background: turn on x: %1 y: %2 in %3 %4',
            cheese_hat010_background_turn_off_xy: 'HAT-010 background: turn off x: %1 y: %2 %3',
            cheese_hat010_background_draw_shape_at_xy: 'HAT-010 background: draw %1 %2 at x: %3 y: %4 %5',
            cheese_hat010_background_draw_string_at_xy: 'HAT-010 background: draw %1 string %2 at x: %3 y: %4 %5',
            cheese_hat010_background_draw_pattern_at_xy: 'HAT-010 background: draw %1 pattern %2 at x: %3 y: %4 %5',
            cheese_hat010_clear: 'HAT-010: clear %1 %2',
            cheese_hat010_scroll_by_xy: 'HAT-010: scroll %1 by x: %2 y: %3 %4',
            cheese_hat010_sprite_set_to_shape: 'HAT-010 sprite %1: set sprite to %2 %3 %4',
            cheese_hat010_sprite_set_to_string: 'HAT-010 sprite %1: set sprite to %2 string %3 %4',
            cheese_hat010_sprite_set_to_pattern: 'HAT-010 sprite %1: set sprite to %2 pattern %3 %4',
            cheese_hat010_sprite_clear_show_hide: 'HAT-010 sprite %1: %2 sprite %3',
            cheese_hat010_sprite_change_positions_by_xy: 'HAT-010 sprite %1: change position by x: %2 y: %3 %4',
            cheese_hat010_sprite_set_positions_to_xy: 'HAT-010 sprite %1: set position to x: %2 y: %3 %4',
            cheese_hat010_sprite_change_position_by_value: 'HAT-010 sprite %1: change %2 position by %3 %4',
            cheese_hat010_sprite_set_position_to_value: 'HAT-010 sprite %1: set %2 position to %3 %4',
            cheese_hat010_sprite_rotate: 'HAT-010 sprite %1: rotate %2 %3',
            cheese_hat010_sprite_flip_in_direction: 'HAT-010 sprite %1: flip in %2 direction %3',
            cheese_hat010_sprite_stamp_to_background: 'HAT-010 sprite %1: stamp to background %2',
            cheese_hat010_sprite_position: 'HAT-010 sprite %1: %2 position',
            cheese_hat010_sprite_touching_sprite: 'HAT-010 sprite %1: touching sprite %2?',
            cheese_hat010_sprite_touching: 'HAT-010 sprite %1: touching %2?',
            cheese_hat010_change_brightness_by: 'HAT-010: change brightness by %1% %2',
            cheese_hat010_set_brightness_to: 'HAT-010: set brightness to %1% %2',
        },
        Helper: {
        },
        Blocks: {
            ROBOID_sensor_signal_strength: 'signal strength',
            ROBOID_sensor_signal_strength_dbm: 'signal strength (dBm)',
            ROBOID_sensor_acceleration_x: 'x acceleration',
            ROBOID_sensor_acceleration_y: 'y acceleration',
            ROBOID_sensor_acceleration_z: 'z acceleration',
            ROBOID_sensor_input_sa: 'input Sa',
            ROBOID_sensor_input_sb: 'input Sb',
            ROBOID_sensor_input_sc: 'input Sc',
            ROBOID_sensor_input_la: 'input La',
            ROBOID_sensor_input_lb: 'input Lb',
            ROBOID_sensor_input_lc: 'input Lc',
            ROBOID_sensor_step_count: 'step count',
            ROBOID_monitor_output_sa: 'output Sa',
            ROBOID_monitor_output_sb: 'output Sb',
            ROBOID_monitor_output_sc: 'output Sc',
            ROBOID_monitor_output_la: 'output La',
            ROBOID_monitor_output_lb: 'output Lb',
            ROBOID_monitor_output_lc: 'output Lc',
            ROBOID_monitor_output_mab: 'output Mab',
            ROBOID_monitor_output_mcd: 'output Mcd',
            ROBOID_monitor_buzzer: 'buzzer',
            ROBOID_monitor_note: 'note',
            ROBOID_logo_sky_direction: 'logo in sky direction',
            ROBOID_logo_earth_direction: 'logo in earth direction',
            ROBOID_power_switch_sky_direction: 'power switch in sky direction',
            ROBOID_power_switch_earth_direction: 'power switch in earth direction',
            ROBOID_port_s_sky_direction: 'port S in sky direction',
            ROBOID_port_s_earth_direction: 'port S in earth direction',
            ROBOID_tap: 'tap',
            ROBOID_free_fall: 'free fall',
            ROBOID_battery_normal: 'battery normal',
            ROBOID_battery_low: 'battery low',
            ROBOID_battery_empty: 'battery empty',
            ROBOID_sound_beep: 'beep',
            ROBOID_sound_random_beep: 'random beep',
            ROBOID_sound_noise: 'noise',
            ROBOID_sound_siren: 'siren',
            ROBOID_sound_engine: 'engine',
            ROBOID_sound_chop: 'chop',
            ROBOID_sound_robot: 'robot',
            ROBOID_sound_dibidibidip: 'dibidibidip',
            ROBOID_sound_good_job: 'good job',
            ROBOID_sound_happy: 'happy',
            ROBOID_sound_angry: 'angry',
            ROBOID_sound_sad: 'sad',
            ROBOID_sound_sleep: 'sleep',
            ROBOID_sound_march: 'march',
            ROBOID_sound_birthday: 'birthday',
            ROBOID_note_c: 'C',
            ROBOID_note_c_sharp: 'C♯(D♭)',
            ROBOID_note_d: 'D',
            ROBOID_note_d_sharp: 'D♯(E♭)',
            ROBOID_note_e: 'E',
            ROBOID_note_f: 'F',
            ROBOID_note_f_sharp: 'F♯(G♭)',
            ROBOID_note_g: 'G',
            ROBOID_note_g_sharp: 'G♯(A♭)',
            ROBOID_note_a: 'A',
            ROBOID_note_a_sharp: 'A♯(B♭)',
            ROBOID_note_b: 'B',
            ROBOID_speaker_internal: 'internal speaker',
            ROBOID_speaker_port_mab: 'port Mab',
            ROBOID_io_mode_makey: 'makey',
            ROBOID_io_mode_button: 'button',
            ROBOID_io_mode_digital_pull_up: 'digital (pull up)',
            ROBOID_io_mode_digital_pull_down: 'digital (pull down)',
            ROBOID_io_mode_analog: 'analog',
            ROBOID_io_mode_voltage: 'voltage',
            ROBOID_io_mode_pulse: 'pulse',
            ROBOID_io_mode_pulse_pull_up: 'pulse (pull up)',
            ROBOID_io_mode_pulse_pull_down: 'pulse (pull down)',
            ROBOID_io_mode_normal: 'normal',
            ROBOID_io_mode_power: 'power',
            ROBOID_io_port_high_current_mab: 'high current Ma(-)b',
            ROBOID_io_port_high_current_mcd: 'high current Mc(-)d',
            ROBOID_io_action_stop: 'stop',
            ROBOID_io_action_turn_off: 'turn off',
            ROBOID_range_integer: 'without',
            ROBOID_range_real: 'with',
            ROBOID_led_intensity_dark: 'dark',
            ROBOID_led_intensity_normal: 'normal',
            ROBOID_led_intensity_bright: 'bright',
            ROBOID_led_type_default: 'default',
            ROBOID_led_type_crgb: '-rgb',
            ROBOID_led_type_crbg: '-rbg',
            ROBOID_led_type_cgrb: '-grb',
            ROBOID_led_type_cgbr: '-gbr',
            ROBOID_led_type_cbrg: '-brg',
            ROBOID_led_type_cbgr: '-bgr',
            ROBOID_led_type_argb: '+rgb',
            ROBOID_led_type_arbg: '+rbg',
            ROBOID_led_type_agrb: '+grb',
            ROBOID_led_type_agbr: '+gbr',
            ROBOID_led_type_abrg: '+brg',
            ROBOID_led_type_abgr: '+bgr',
            ROBOID_color_red: 'red',
            ROBOID_color_orange: 'orange',
            ROBOID_color_yellow: 'yellow',
            ROBOID_color_green: 'green',
            ROBOID_color_sky_blue: 'sky blue',
            ROBOID_color_blue: 'blue',
            ROBOID_color_violet: 'violet',
            ROBOID_color_purple: 'purple',
            ROBOID_color_white: 'white',
            ROBOID_neopixel_3_colors: '3 colors',
            ROBOID_neopixel_6_colors: '6 colors',
            ROBOID_neopixel_12_colors: '12 colors',
            ROBOID_neopixel_red_green: 'red to green',
            ROBOID_neopixel_red_blue: 'red to blue',
            ROBOID_neopixel_red_white: 'red to white',
            ROBOID_neopixel_green_red: 'green to red',
            ROBOID_neopixel_green_blue: 'green to blue',
            ROBOID_neopixel_green_white: 'green to white',
            ROBOID_neopixel_blue_red: 'blue to red',
            ROBOID_neopixel_blue_green: 'blue to green',
            ROBOID_neopixel_blue_white: 'blue to white',
            ROBOID_neopixel_white_red: 'white to red',
            ROBOID_neopixel_white_green: 'white to green',
            ROBOID_neopixel_white_blue: 'white to blue',
            ROBOID_neopixel_red_black: 'red getting darker',
            ROBOID_neopixel_green_black: 'green getting darker',
            ROBOID_neopixel_blue_black: 'blue getting darker',
            ROBOID_neopixel_white_black: 'white getting darker',
            ROBOID_neopixel_black_red: 'red getting brighter',
            ROBOID_neopixel_black_green: 'green getting brighter',
            ROBOID_neopixel_black_blue: 'blue getting brighter',
            ROBOID_neopixel_black_white: 'white getting brighter',
            ROBOID_serial_string: 'string',
            ROBOID_serial_string_line: 'string line',
            ROBOID_serial_all: 'all',
            ROBOID_serial_until_comma: 'until ,(comma)',
            ROBOID_serial_until_colon: 'until :(colon)',
            ROBOID_serial_until_dollar: 'until $',
            ROBOID_serial_until_sharp: 'until #',
            ROBOID_serial_until_new_line: 'until new line',
            ROBOID_serial_port_wa_rb: 'La(write) Lb(read)',
            ROBOID_serial_port_ra_wb: 'La(read) Lb(write)',
            ROBOID_serial_port_wa: 'La(write)',
            ROBOID_serial_port_ra: 'La(read)',
            ROBOID_pid_10: 'PID-10 ultrasonic sensor (HC-SR04+)',
            ROBOID_pid_11_1: 'PID-11-1 humidity/temperature sensor (DHT11)',
            ROBOID_pid_11_2: 'PID-11-2 humidity/temperature sensor (DHT21)',
            ROBOID_pid_11_3: 'PID-11-3 humidity/temperature sensor (DHT22)',
            ROBOID_pid_12: 'PID-12 temperature sensor (DS18B20)',
            ROBOID_pid_13: 'PID-13 joystick and button',
            ROBOID_pid_14: 'PID-14 dual joystick',
            ROBOID_pid_15: 'PID-15 IR transceiver',
            ROBOID_pid_16: 'PID-16 encoder',
            ROBOID_pid_distance: 'distance (cm)',
            ROBOID_pid_temperature: 'temperature (℃)',
            ROBOID_pid_humidity: 'humidity (%RH)',
            ROBOID_pid_x1: 'x1',
            ROBOID_pid_y1: 'y1',
            ROBOID_pid_x2: 'x2',
            ROBOID_pid_y2: 'y2',
            ROBOID_pid_button1: 'button1',
            ROBOID_pid_button2: 'button2',
            ROBOID_pid_encoder: 'encoder',
            ROBOID_clicked: 'clicked',
            ROBOID_double_clicked: 'double-clicked',
            ROBOID_long_pressed: 'long-pressed',
            ROBOID_shape_square: 'square',
            ROBOID_shape_triangle: 'triangle',
            ROBOID_shape_diamond: 'diamond',
            ROBOID_shape_circle: 'circle',
            ROBOID_shape_x: 'X',
            ROBOID_shape_like: 'like',
            ROBOID_shape_dislike: 'dislike',
            ROBOID_shape_angry: 'angry',
            ROBOID_shape_open_mouth: 'open mouth',
            ROBOID_shape_close_mouth: 'close mouth',
            ROBOID_shape_walk1: 'walk 1',
            ROBOID_shape_walk2: 'walk 2',
            ROBOID_shape_heart: 'heart',
            ROBOID_shape_star: 'star',
            ROBOID_shape_airplane: 'airplane',
            ROBOID_shape_puppy: 'puppy',
            ROBOID_shape_butterfly: 'butterfly',
            ROBOID_shape_quarter_note: 'quarter note',
            ROBOID_shape_eighth_note: 'eighth note',
            ROBOID_shape_left_arrow: 'left arrow',
            ROBOID_shape_right_arrow: 'right arrow',
            ROBOID_shape_up_arrow: 'up arrow',
            ROBOID_shape_down_arrow: 'down arrow',
            ROBOID_hat_background: 'background',
            ROBOID_hat_all: 'all',
            ROBOID_hat_clear: 'clear',
            ROBOID_hat_show: 'show',
            ROBOID_hat_hide: 'hide',
            ROBOID_hat_clockwise: 'clockwise',
            ROBOID_hat_counterclockwise: 'counterclockwise',
            ROBOID_hat_left_right: 'left-right',
            ROBOID_hat_up_down: 'up-down',
            ROBOID_hat_auto: 'auto',
            ROBOID_hat_manual: 'manual',
            ROBOID_hat_other_sprite: 'other sprite',
            ROBOID_hat_left_wall: 'left wall',
            ROBOID_hat_right_wall: 'right wall',
            ROBOID_hat_top_wall: 'top wall',
            ROBOID_hat_bottom_wall: 'bottom wall',
            ROBOID_hat_any_wall: 'any wall',
        },
    },
    jp: {
        template: {
            cheese_value: '%1',
            cheese_boolean: '%1?',
            cheese_play_sound_times: '%1 音を %2 回再生する %3',
            cheese_play_sound_times_until_done: '%1 音を %2 回再生して待つ %3',
            cheese_change_buzzer_by: 'ブザー音を %1 Hzずつ変える %2',
            cheese_set_buzzer_to: 'ブザー音を %1 Hzにする %2',
            cheese_clear_sound: '音をオフにする %1',
            cheese_play_note: '%1 %2 音をならす %3',
            cheese_play_note_for: '%1 %2 音を %3 拍子ならす %4',
            cheese_rest_for: '%1 拍子休む %2',
            cheese_change_tempo_by: '演奏のテンポを %1 BPMずつ変える %2',
            cheese_set_tempo_to: '演奏のテンポを %1 BPMにする %2',
            cheese_set_sound_port_to: '音出力を %1にする %2',
            cheese_set_input_mode_to: 'ポート %1を %2 入力にする %3',
            cheese_set_input_range_to: '入力 %1の範囲 %2 ~ %3を %4 ~ %5 小数点 %6にする %7',
            cheese_set_three_input_ranges_to: '入力 %1の範囲 %2 ~ %3 ~ %4を %5 ~ %6 ~ %7 小数点 %8にする %9',
            cheese_analog_input: '入力 %1',
            cheese_digital_input: '入力 %1 %2 ?',
            cheese_button_state: 'ボタン %1を %2?',
            cheese_set_pulse_mode_to: 'ポート %1を %2 入力にする %3',
            cheese_pulse_input: 'ポート %1でパルスが感知されたか?',
            cheese_set_digital_output_to: 'デジタル出力 %1を %2にする %3',
            cheese_change_pwm_output_by: 'PWM出力 %1を %2%ずつ変える %3',
            cheese_set_pwm_output_to: 'PWM出力 %1を %2%にする %3',
            cheese_change_servo_motor_angle_by: 'サーボモータ %1の角度を %2度ずつ変える %3',
            cheese_set_servo_motor_angle_to: 'サーボモータ %1の角度を %2度にする %3',
            cheese_turn_off_servo_motor: 'サーボモータ %1 の電源をオフにする %2',
            cheese_change_dc_motor_velocity_by: 'DCモータ %1の速度を %2%ずつ変える %3',
            cheese_set_dc_motor_velocity_to: 'DCモータ %1の速度を %2%にする %3',
            cheese_stop_dc_motor: 'DCモータ %1 を停止する %2',
            cheese_rotate_step_motor: 'ステップモータ %1 ステップを速度 %2 ステップ/秒に回る %3',
            cheese_change_step_motor_velocity_by: 'ステップモータの速度を %1 ステップ/秒ずつ変える %2',
            cheese_set_step_motor_velocity_to: 'ステップモータの速度を %1 ステップ/秒にする %2',
            cheese_stop_off_step_motor: 'ステップモータを %1 %2',
            cheese_set_step_motor_mode_to: 'ステップモータを %1 モードにする %2',
            cheese_step_count: 'ステップ数',
            cheese_set_led_to_color: 'RGBLED %1を %2 %3にする %4',
            cheese_pick_led_to: 'RGBLED %1を %2にする %3',
            cheese_change_led_by_rgb: 'RGBLED %1を R: %2 G: %3 B: %4ずつ変える %5',
            cheese_setLed_to_rgb: 'RGBLED %1を R: %2 G: %3 B: %4にする %5',
            cheese_clear_led: 'RGBLED %1 をオフにする %2',
            cheese_set_led_type_to: 'RGBLED %1を %2形にする %3',
            cheese_neopixel_set_number_and_type_to: 'ネオピクセル: LED %1個、%2にする %3',
            cheese_neopixel_set_all_leds_to_color: 'ネオピクセル: すべてのLEDを %1にする %2',
            cheese_neopixel_pick_all_leds_to: 'ネオピクセル: すべてのLEDを %1にする %2',
            cheese_neopixel_change_all_leds_by_rgb: 'ネオピクセル: すべてのLEDを R: %1 G: %2 B: %3ずつ変える %4',
            cheese_neopixel_set_all_leds_to_rgb: 'ネオピクセル: すべてのLEDを R: %1 G: %2 B: %3にする %4',
            cheese_neopixel_set_all_leds_to_pattern: 'ネオピクセル: すべてのLEDを %1 パターンにする %2',
            cheese_neopixel_clear_all_leds: 'ネオピクセル: すべてのLEDをオフにする %1',
            cheese_neopixel_set_led_to_color: 'ネオピクセル: %1番目のLEDを %2にする %3',
            cheese_neopixel_pick_led_to: 'ネオピクセル: %1番目のLEDを %2にする %3',
            cheese_neopixel_change_led_by_rgb: 'ネオピクセル: %1番目のLEDを R: %2 G: %3 B: %4ずつ変える %5',
            cheese_neopixel_set_led_to_rgb: 'ネオピクセル: %1番目のLEDを R: %2 G: %3 B: %4にする %5',
            cheese_neopixel_clear_led: 'ネオピクセル: %1番目のLEDをオフにする %2',
            cheese_neopixel_set_led_range_to_color: 'ネオピクセル: %1番目から %2番目まで %3間隔のLEDを %4にする %5',
            cheese_neopixel_pick_led_range_to: 'ネオピクセル: %1番目から %2番目まで %3間隔のLEDを %4にする %5',
            cheese_neopixel_change_led_range_by_rgb: 'ネオピクセル: %1番目から %2番目まで %3間隔のLEDを R: %4 G: %5 B: %6ずつ変える %7',
            cheese_neopixel_set_led_range_to_rgb: 'ネオピクセル: %1番目から %2番目まで %3間隔のLEDを R: %4 G: %5 B: %6にする %7',
            cheese_neopixel_set_led_range_to_pattern: 'ネオピクセル: %1番目から %2番目までのLEDを %3 パターンにする %4',
            cheese_neopixel_clear_led_range: 'ネオピクセル: %1番目から %2番目まで %3間隔のLEDをオフにする %4',
            cheese_neopixel_shift: 'ネオピクセル: %1ピクセル移動する %2',
            cheese_neopixel_rotate: 'ネオピクセル: %1ピクセル回転する %2',
            cheese_neopixel_change_brightness_by: 'ネオピクセル: 明るさを %1%ずつ変える %2',
            cheese_neopixel_set_brightness_to: 'ネオピクセル: 明るさを %1%にする %2',
            cheese_write_serial: 'シリアルに %1 %2 を書き出す %3',
            cheese_read_serial_until: 'シリアルを %1 読み取る %2',
            cheese_set_serial_port_to: 'シリアルポートを %1にする %2',
            cheese_set_serial_rate_to: 'シリアル速度を %1Bdにする %2',
            cheese_serial_input: 'シリアル入力',
            cheese_pid_start: '%1 を開始する %2',
            cheese_pid_set_range_to: 'PID %1の範囲 %2 ~ %3を %4 ~ %5 小数点 %6にする %7',
            cheese_pid_set_three_ranges_to: 'PID %1の範囲 %2 ~ %3 ~ %4を %5 ~ %6 ~ %7 小数点 %8にする %9',
            cheese_pid_reset_encoder: 'PID エンコーダ値を初期化する %1',
            cheese_pid_input: 'PID %1',
            cheese_pid_button_state: 'PID ボタン %1を %2?',
            cheese_hat010_start: 'HAT-010 5x5マトリックスを開始する %1',
            cheese_hat010_button: 'HAT-010 ボタン %1',
            cheese_hat010_button_state: 'HAT-010 ボタン %1を %2?',
            cheese_hat010_background_turn_on_xy: 'HAT-010 背景 x: %1 y: %2を %3に点灯する %4',
            cheese_hat010_background_turn_off_xy: 'HAT-010 背景 x: %1 y: %2をオフにする %3',
            cheese_hat010_background_draw_shape_at_xy: 'HAT-010 背景 %1 %2を x: %3 y: %4に描画する %5',
            cheese_hat010_background_draw_string_at_xy: 'HAT-010 背景 %1 文字列 %2を x: %3 y: %4に描画する %5',
            cheese_hat010_background_draw_pattern_at_xy: 'HAT-010 背景 %1 パターン %2を x: %3 y: %4に描画する %5',
            cheese_hat010_clear: 'HAT-010 %1 を消す %2',
            cheese_hat010_scroll_by_xy: 'HAT-010 %1 x: %2 y: %3だけ移動する %4',
            cheese_hat010_sprite_set_to_shape: 'HAT-010 図 %1を %2 %3にする %4',
            cheese_hat010_sprite_set_to_string: 'HAT-010 図 %1を %2 文字列 %3にする %4',
            cheese_hat010_sprite_set_to_pattern: 'HAT-010 図 %1を %2 パターン %3にする %4',
            cheese_hat010_sprite_clear_show_hide: 'HAT-010 図 %1を %2 %3',
            cheese_hat010_sprite_change_positions_by_xy: 'HAT-010 図 %1の位置を x: %2 y: %3ずつ変える %4',
            cheese_hat010_sprite_set_positions_to_xy: 'HAT-010 図 %1の位置を x: %2 y: %3にする %4',
            cheese_hat010_sprite_change_position_by_value: 'HAT-010 図 %1の %2 位置を %3ずつ変える %4',
            cheese_hat010_sprite_set_position_to_value: 'HAT-010 図 %1の %2 位置を %3にする %4',
            cheese_hat010_sprite_rotate: 'HAT-010 図 %1を %2 方向に回転する %3',
            cheese_hat010_sprite_flip_in_direction: 'HAT-010 図 %1を %2 方向に反転する %3',
            cheese_hat010_sprite_stamp_to_background: 'HAT-010 図 %1を背景にスタンプする %2',
            cheese_hat010_sprite_position: 'HAT-010 図 %1の %2 位置',
            cheese_hat010_sprite_touching_sprite: 'HAT-010 図 %1が 図 %2に着いたか?',
            cheese_hat010_sprite_touching: 'HAT-010 図 %1が %2に着いたか?',
            cheese_hat010_change_brightness_by: 'HAT-010 明るさを %1%ずつ変える %2',
            cheese_hat010_set_brightness_to: 'HAT-010 明るさを %1%にする %2',
        },
        Helper: {
        },
        Blocks: {
            ROBOID_sensor_signal_strength: '信号の強さ',
            ROBOID_sensor_signal_strength_dbm: '信号の強さ(dBm)',
            ROBOID_sensor_acceleration_x: 'x軸の加速度',
            ROBOID_sensor_acceleration_y: 'y軸の加速度',
            ROBOID_sensor_acceleration_z: 'z軸の加速度',
            ROBOID_sensor_input_sa: '入力Sa',
            ROBOID_sensor_input_sb: '入力Sb',
            ROBOID_sensor_input_sc: '入力Sc',
            ROBOID_sensor_input_la: '入力La',
            ROBOID_sensor_input_lb: '入力Lb',
            ROBOID_sensor_input_lc: '入力Lc',
            ROBOID_sensor_step_count: 'ステップ数',
            ROBOID_monitor_output_sa: '出力Sa',
            ROBOID_monitor_output_sb: '出力Sb',
            ROBOID_monitor_output_sc: '出力Sc',
            ROBOID_monitor_output_la: '出力La',
            ROBOID_monitor_output_lb: '出力Lb',
            ROBOID_monitor_output_lc: '出力Lc',
            ROBOID_monitor_output_mab: '出力Mab',
            ROBOID_monitor_output_mcd: '出力Mcd',
            ROBOID_monitor_buzzer: 'ブザー',
            ROBOID_monitor_note: '音符',
            ROBOID_logo_sky_direction: 'ロゴが空の方向か',
            ROBOID_logo_earth_direction: 'ロゴが地の方向か',
            ROBOID_power_switch_sky_direction: '電源スイッチが空の方向か',
            ROBOID_power_switch_earth_direction: '電源スイッチが地の方向か',
            ROBOID_port_s_sky_direction: 'ポートSが空の方向か',
            ROBOID_port_s_earth_direction: 'ポートSが地の方向か',
            ROBOID_tap: '叩いたか',
            ROBOID_free_fall: '落下したか',
            ROBOID_battery_normal: '電池残量が充分か',
            ROBOID_battery_low: '電池残量が足りないか',
            ROBOID_battery_empty: '電池残量がなくなったか',
            ROBOID_sound_beep: 'ビープ',
            ROBOID_sound_random_beep: 'ランダムビープ',
            ROBOID_sound_noise: 'ノイズ',
            ROBOID_sound_siren: 'サイレン',
            ROBOID_sound_engine: 'エンジン',
            ROBOID_sound_chop: 'チョップ',
            ROBOID_sound_robot: 'ロボット',
            ROBOID_sound_dibidibidip: 'ディビディビディ',
            ROBOID_sound_good_job: 'よくできました',
            ROBOID_sound_happy: 'よろこび',
            ROBOID_sound_angry: 'いかり',
            ROBOID_sound_sad: 'かなしみ',
            ROBOID_sound_sleep: 'ねむい',
            ROBOID_sound_march: 'マーチ',
            ROBOID_sound_birthday: 'たんじょうび',
            ROBOID_note_c: 'ド',
            ROBOID_note_c_sharp: 'ド♯(レ♭)',
            ROBOID_note_d: 'レ',
            ROBOID_note_d_sharp: 'レ♯(ミ♭)',
            ROBOID_note_e: 'ミ',
            ROBOID_note_f: 'ファ',
            ROBOID_note_f_sharp: 'ファ♯(ソ♭)',
            ROBOID_note_g: 'ソ',
            ROBOID_note_g_sharp: 'ソ♯(ラ♭)',
            ROBOID_note_a: 'ラ',
            ROBOID_note_a_sharp: 'ラ♯(シ♭)',
            ROBOID_note_b: 'シ',
            ROBOID_speaker_internal: '内蔵スピーカー',
            ROBOID_speaker_port_mab: 'ポートMab',
            ROBOID_io_mode_makey: 'メイキー',
            ROBOID_io_mode_button: 'ボタン',
            ROBOID_io_mode_digital_pull_up: 'デジタル(プルアップ)',
            ROBOID_io_mode_digital_pull_down: 'デジタル(プルダウン)',
            ROBOID_io_mode_analog: 'アナログ',
            ROBOID_io_mode_voltage: '電圧',
            ROBOID_io_mode_pulse: 'パルス',
            ROBOID_io_mode_pulse_pull_up: 'パルス(プルアップ)',
            ROBOID_io_mode_pulse_pull_down: 'パルス(プルダウン)',
            ROBOID_io_mode_normal: '基本',
            ROBOID_io_mode_power: 'パワー',
            ROBOID_io_port_high_current_mab: '大電流Ma(-)b',
            ROBOID_io_port_high_current_mcd: '大電流Mc(-)d',
            ROBOID_io_action_stop: '停止する',
            ROBOID_io_action_turn_off: 'オフにする',
            ROBOID_range_integer: 'なし',
            ROBOID_range_real: 'あり',
            ROBOID_led_intensity_dark: '暗い',
            ROBOID_led_intensity_normal: '基本',
            ROBOID_led_intensity_bright: '明るい',
            ROBOID_led_type_default: '基本',
            ROBOID_led_type_crgb: '-RGB',
            ROBOID_led_type_crbg: '-RBG',
            ROBOID_led_type_cgrb: '-GRB',
            ROBOID_led_type_cgbr: '-GBR',
            ROBOID_led_type_cbrg: '-BRG',
            ROBOID_led_type_cbgr: '-BGR',
            ROBOID_led_type_argb: '+RGB',
            ROBOID_led_type_arbg: '+RBG',
            ROBOID_led_type_agrb: '+GRB',
            ROBOID_led_type_agbr: '+GBR',
            ROBOID_led_type_abrg: '+BRG',
            ROBOID_led_type_abgr: '+BGR',
            ROBOID_color_red: '赤色',
            ROBOID_color_orange: 'オレンジ色',
            ROBOID_color_yellow: '黄色',
            ROBOID_color_green: '緑色',
            ROBOID_color_sky_blue: '水色',
            ROBOID_color_blue: '青色',
            ROBOID_color_violet: '青むらさき色',
            ROBOID_color_purple: 'むらさき色',
            ROBOID_color_white: '白色',
            ROBOID_neopixel_3_colors: '3色',
            ROBOID_neopixel_6_colors: '6色',
            ROBOID_neopixel_12_colors: '12色',
            ROBOID_neopixel_red_green: '赤色から緑色まで',
            ROBOID_neopixel_red_blue: '赤色から青色まで',
            ROBOID_neopixel_red_white: '赤色から白色まで',
            ROBOID_neopixel_green_red: '緑色から赤色まで',
            ROBOID_neopixel_green_blue: '緑色から青色まで',
            ROBOID_neopixel_green_white: '緑色から白色まで',
            ROBOID_neopixel_blue_red: '青色から赤色まで',
            ROBOID_neopixel_blue_green: '青色から緑色まで',
            ROBOID_neopixel_blue_white: '青色から白色まで',
            ROBOID_neopixel_white_red: '白色から赤色まで',
            ROBOID_neopixel_white_green: '白色から緑色まで',
            ROBOID_neopixel_white_blue: '白色から青色まで',
            ROBOID_neopixel_red_black: '赤色ますます暗く',
            ROBOID_neopixel_green_black: '緑色ますます暗く',
            ROBOID_neopixel_blue_black: '青色ますます暗く',
            ROBOID_neopixel_white_black: '白色ますます暗く',
            ROBOID_neopixel_black_red: '赤色ますます明るく',
            ROBOID_neopixel_black_green: '緑色ますます明るく',
            ROBOID_neopixel_black_blue: '青色ますます明るく',
            ROBOID_neopixel_black_white: '白色ますます明るく',
            ROBOID_serial_string: '文字列',
            ROBOID_serial_string_line: '文字列1行',
            ROBOID_serial_all: '全部',
            ROBOID_serial_until_comma: '、(読点)まで',
            ROBOID_serial_until_colon: '：(コロン)まで',
            ROBOID_serial_until_dollar: '$まで',
            ROBOID_serial_until_sharp: '#まで',
            ROBOID_serial_until_new_line: '改行まで',
            ROBOID_serial_port_wa_rb: 'La(書く)Lb(読む)',
            ROBOID_serial_port_ra_wb: 'La(読む)Lb(書く)',
            ROBOID_serial_port_wa: 'La(書く)',
            ROBOID_serial_port_ra: 'La(読む)',
            ROBOID_pid_10: 'PID-10 超音波センサー(HC-SR04+)',
            ROBOID_pid_11_1: 'PID-11-1 温湿度センサー(DHT11)',
            ROBOID_pid_11_2: 'PID-11-2 温湿度センサー(DHT21)',
            ROBOID_pid_11_3: 'PID-11-3 温湿度センサー(DHT22)',
            ROBOID_pid_12: 'PID-12 温度センサー(DS18B20)',
            ROBOID_pid_13: 'PID-13 ジョイスティックとボタン',
            ROBOID_pid_14: 'PID-14 デュアルジョイスティック',
            ROBOID_pid_15: 'PID-15 IRトランシーバー',
            ROBOID_pid_16: 'PID-16 エンコーダ',
            ROBOID_pid_distance: '距離(cm)',
            ROBOID_pid_temperature: '温度(℃)',
            ROBOID_pid_humidity: '湿度(%RH)',
            ROBOID_pid_x1: 'x1',
            ROBOID_pid_y1: 'y1',
            ROBOID_pid_x2: 'x2',
            ROBOID_pid_y2: 'y2',
            ROBOID_pid_button1: 'ボタン1',
            ROBOID_pid_button2: 'ボタン2',
            ROBOID_pid_encoder: 'エンコーダ',
            ROBOID_clicked: 'クリックしたか',
            ROBOID_double_clicked: 'ダブルクリックしたか',
            ROBOID_long_pressed: '長く押したか',
            ROBOID_shape_square: '四角形',
            ROBOID_shape_triangle: '三角形',
            ROBOID_shape_diamond: 'ダイヤモンド',
            ROBOID_shape_circle: '円',
            ROBOID_shape_x: 'X',
            ROBOID_shape_like: 'すき',
            ROBOID_shape_dislike: 'きらい',
            ROBOID_shape_angry: 'いかり',
            ROBOID_shape_open_mouth: '開けた口',
            ROBOID_shape_close_mouth: '閉じた口',
            ROBOID_shape_walk1: '歩く1',
            ROBOID_shape_walk2: '歩く2',
            ROBOID_shape_heart: 'ハート',
            ROBOID_shape_star: '星',
            ROBOID_shape_airplane: '飛行機',
            ROBOID_shape_puppy: '子犬',
            ROBOID_shape_butterfly: '蝶',
            ROBOID_shape_quarter_note: '4分音符',
            ROBOID_shape_eighth_note: '8分音符',
            ROBOID_shape_left_arrow: '左矢印',
            ROBOID_shape_right_arrow: '右矢印',
            ROBOID_shape_up_arrow: '上矢印',
            ROBOID_shape_down_arrow: '下矢印',
            ROBOID_hat_background: '背景',
            ROBOID_hat_all: '全部',
            ROBOID_hat_clear: '消す',
            ROBOID_hat_show: 'みせる',
            ROBOID_hat_hide: 'かくす',
            ROBOID_hat_clockwise: '時計',
            ROBOID_hat_counterclockwise: '反時計',
            ROBOID_hat_left_right: '左-右',
            ROBOID_hat_up_down: '上-下',
            ROBOID_hat_auto: '自動',
            ROBOID_hat_manual: '手動',
            ROBOID_hat_other_sprite: '他の図',
            ROBOID_hat_left_wall: '左壁',
            ROBOID_hat_right_wall: '右壁',
            ROBOID_hat_top_wall: '上壁',
            ROBOID_hat_bottom_wall: '下壁',
            ROBOID_hat_any_wall: '全ての壁',
        },
    },
    vn: {
        template: {
            cheese_value: '%1',
            cheese_boolean: '%1?',
            cheese_play_sound_times: 'play sound %1 %2 times %3',
            cheese_play_sound_times_until_done: 'play sound %1 %2 times until done %3',
            cheese_change_buzzer_by: 'change buzzer by %1 Hz %2',
            cheese_set_buzzer_to: 'set buzzer to %1 Hz %2',
            cheese_clear_sound: 'clear sound %1',
            cheese_play_note: 'play note %1 %2 %3',
            cheese_play_note_for: 'play note %1 %2 for %3 beats %4',
            cheese_rest_for: 'rest for %1 beats %2',
            cheese_change_tempo_by: 'change tempo by %1 BPM %2',
            cheese_set_tempo_to: 'set tempo to %1 BPM %2',
            cheese_set_sound_port_to: 'set sound output to %1 %2',
            cheese_set_input_mode_to: 'set port %1 to %2 input %3',
            cheese_set_input_range_to: 'set input %1 range %2 - %3 to %4 - %5 %6 decimal point %7',
            cheese_set_three_input_ranges_to: 'set input %1 range %2 - %3 - %4 to %5 - %6 - %7 %8 decimal point %9',
            cheese_analog_input: 'input %1',
            cheese_digital_input: 'input %1 %2 ?',
            cheese_button_state: 'button %1 %2 ?',
            cheese_set_pulse_mode_to: 'set port %1 to %2 input %3',
            cheese_pulse_input: 'pulse detected on port %1 ?',
            cheese_set_digital_output_to: 'set digital output %1 to %2 %3',
            cheese_change_pwm_output_by: 'change pwm output %1 by %2% %3',
            cheese_set_pwm_output_to: 'set pwm output %1 to %2% %3',
            cheese_change_servo_motor_angle_by: 'change servo motor %1 by %2 degrees %3',
            cheese_set_servo_motor_angle_to: 'set servo motor %1 to %2 degrees %3',
            cheese_turn_off_servo_motor: 'turn off servo motor %1 %2',
            cheese_change_dc_motor_velocity_by: 'change dc motor %1 velocity by %2% %3',
            cheese_set_dc_motor_velocity_to: 'set dc motor %1 velocity to %2% %3',
            cheese_stop_dc_motor: 'stop dc motor %1 %2',
            cheese_rotate_step_motor: 'rotate step motor %1 steps with velocity %2 step/sec %3',
            cheese_change_step_motor_velocity_by: 'change step motor velocity by %1 step/sec %2',
            cheese_set_step_motor_velocity_to: 'set step motor velocity to %1 step/sec %2',
            cheese_stop_off_step_motor: '%1 step motor %2',
            cheese_set_step_motor_mode_to: 'set step motor to %1 mode %2',
            cheese_step_count: 'step count',
            cheese_set_led_to_color: 'set rgb led %1 to %2 %3 %4',
            cheese_pick_led_to: 'set rgb led %1 to %2 %3',
            cheese_change_led_by_rgb: 'change rgb led %1 by r: %2 g: %3 b: %4 %5',
            cheese_setLed_to_rgb: 'set rgb led %1 to r: %2 g: %3 b: %4 %5',
            cheese_clear_led: 'clear rgb led %1 %2',
            cheese_set_led_type_to: 'set rgb led %1 to %2 type %3',
            cheese_neopixel_set_number_and_type_to: 'neopixel: set %1 leds as %2 %3',
            cheese_neopixel_set_all_leds_to_color: 'neopixel: set all leds to %1 %2',
            cheese_neopixel_pick_all_leds_to: 'neopixel: set all leds to %1 %2',
            cheese_neopixel_change_all_leds_by_rgb: 'neopixel: change all leds by r: %1 g: %2 b: %3 %4',
            cheese_neopixel_set_all_leds_to_rgb: 'neopixel: set all leds to r: %1 g: %2 b: %3 %4',
            cheese_neopixel_set_all_leds_to_pattern: 'neopixel: set all leds to pattern %1 %2',
            cheese_neopixel_clear_all_leds: 'neopixel: clear all leds %1',
            cheese_neopixel_set_led_to_color: 'neopixel: set led %1 to %2 %3',
            cheese_neopixel_pick_led_to: 'neopixel: set led %1 to %2 %3',
            cheese_neopixel_change_led_by_rgb: 'neopixel: change led %1 by r: %2 g: %3 b: %4 %5',
            cheese_neopixel_set_led_to_rgb: 'neopixel: set led %1 to r: %2 g: %3 b: %4 %5',
            cheese_neopixel_clear_led: 'neopixel: clear led %1 %2',
            cheese_neopixel_set_led_range_to_color: 'neopixel: set leds (from %1 to %2 with %3 increments) to %4 %5',
            cheese_neopixel_pick_led_range_to: 'neopixel: set leds (from %1 to %2 with %3 increments) to %4 %5',
            cheese_neopixel_change_led_range_by_rgb: 'neopixel: change leds (from %1 to %2 with %3 increments) by r: %4 g: %5 b: %6 %7',
            cheese_neopixel_set_led_range_to_rgb: 'neopixel: set leds (from %1 to %2 with %3 increments) to r: %4 g: %5 b: %6 %7',
            cheese_neopixel_set_led_range_to_pattern: 'neopixel: set leds (from %1 to %2) to pattern %3 %4',
            cheese_neopixel_clear_led_range: 'neopixel: clear leds (from %1 to %2 with %3 increments) %4',
            cheese_neopixel_shift: 'neopixel: shift %1 pixels %2',
            cheese_neopixel_rotate: 'neopixel: rotate %1 pixels %2',
            cheese_neopixel_change_brightness_by: 'neopixel: change brightness by %1% %2',
            cheese_neopixel_set_brightness_to: 'neopixel: set brightness to %1% %2',
            cheese_write_serial: 'write %1 %2 to serial %3',
            cheese_read_serial_until: 'read serial %1 %2',
            cheese_set_serial_port_to: 'set serial port to %1 %2',
            cheese_set_serial_rate_to: 'set serial rate to %1Bd %2',
            cheese_serial_input: 'serial input',
            cheese_pid_start: 'start %1 %2',
            cheese_pid_set_range_to: 'PID: set %1 range %2 - %3 to %4 - %5 %6 decimal point %7',
            cheese_pid_set_three_ranges_to: 'PID: set %1 range %2 - %3 - %4 to %5 - %6 - %7 %8 decimal point %9',
            cheese_pid_reset_encoder: 'PID: clear encoder %1',
            cheese_pid_input: 'PID: %1',
            cheese_pid_button_state: 'PID: button %1 %2?',
            cheese_hat010_start: 'start HAT-010 5x5 matrix %1',
            cheese_hat010_button: 'HAT-010: button %1',
            cheese_hat010_button_state: 'HAT-010: button %1 %2?',
            cheese_hat010_background_turn_on_xy: 'HAT-010 background: turn on x: %1 y: %2 in %3 %4',
            cheese_hat010_background_turn_off_xy: 'HAT-010 background: turn off x: %1 y: %2 %3',
            cheese_hat010_background_draw_shape_at_xy: 'HAT-010 background: draw %1 %2 at x: %3 y: %4 %5',
            cheese_hat010_background_draw_string_at_xy: 'HAT-010 background: draw %1 string %2 at x: %3 y: %4 %5',
            cheese_hat010_background_draw_pattern_at_xy: 'HAT-010 background: draw %1 pattern %2 at x: %3 y: %4 %5',
            cheese_hat010_clear: 'HAT-010: clear %1 %2',
            cheese_hat010_scroll_by_xy: 'HAT-010: scroll %1 by x: %2 y: %3 %4',
            cheese_hat010_sprite_set_to_shape: 'HAT-010 sprite %1: set sprite to %2 %3 %4',
            cheese_hat010_sprite_set_to_string: 'HAT-010 sprite %1: set sprite to %2 string %3 %4',
            cheese_hat010_sprite_set_to_pattern: 'HAT-010 sprite %1: set sprite to %2 pattern %3 %4',
            cheese_hat010_sprite_clear_show_hide: 'HAT-010 sprite %1: %2 sprite %3',
            cheese_hat010_sprite_change_positions_by_xy: 'HAT-010 sprite %1: change position by x: %2 y: %3 %4',
            cheese_hat010_sprite_set_positions_to_xy: 'HAT-010 sprite %1: set position to x: %2 y: %3 %4',
            cheese_hat010_sprite_change_position_by_value: 'HAT-010 sprite %1: change %2 position by %3 %4',
            cheese_hat010_sprite_set_position_to_value: 'HAT-010 sprite %1: set %2 position to %3 %4',
            cheese_hat010_sprite_rotate: 'HAT-010 sprite %1: rotate %2 %3',
            cheese_hat010_sprite_flip_in_direction: 'HAT-010 sprite %1: flip in %2 direction %3',
            cheese_hat010_sprite_stamp_to_background: 'HAT-010 sprite %1: stamp to background %2',
            cheese_hat010_sprite_position: 'HAT-010 sprite %1: %2 position',
            cheese_hat010_sprite_touching_sprite: 'HAT-010 sprite %1: touching sprite %2?',
            cheese_hat010_sprite_touching: 'HAT-010 sprite %1: touching %2?',
            cheese_hat010_change_brightness_by: 'HAT-010: change brightness by %1% %2',
            cheese_hat010_set_brightness_to: 'HAT-010: set brightness to %1% %2',
        },
        Helper: {
        },
        Blocks: {
            ROBOID_sensor_signal_strength: 'signal strength',
            ROBOID_sensor_signal_strength_dbm: 'signal strength (dBm)',
            ROBOID_sensor_acceleration_x: 'x acceleration',
            ROBOID_sensor_acceleration_y: 'y acceleration',
            ROBOID_sensor_acceleration_z: 'z acceleration',
            ROBOID_sensor_input_sa: 'input Sa',
            ROBOID_sensor_input_sb: 'input Sb',
            ROBOID_sensor_input_sc: 'input Sc',
            ROBOID_sensor_input_la: 'input La',
            ROBOID_sensor_input_lb: 'input Lb',
            ROBOID_sensor_input_lc: 'input Lc',
            ROBOID_sensor_step_count: 'step count',
            ROBOID_monitor_output_sa: 'output Sa',
            ROBOID_monitor_output_sb: 'output Sb',
            ROBOID_monitor_output_sc: 'output Sc',
            ROBOID_monitor_output_la: 'output La',
            ROBOID_monitor_output_lb: 'output Lb',
            ROBOID_monitor_output_lc: 'output Lc',
            ROBOID_monitor_output_mab: 'output Mab',
            ROBOID_monitor_output_mcd: 'output Mcd',
            ROBOID_monitor_buzzer: 'buzzer',
            ROBOID_monitor_note: 'note',
            ROBOID_logo_sky_direction: 'logo in sky direction',
            ROBOID_logo_earth_direction: 'logo in earth direction',
            ROBOID_power_switch_sky_direction: 'power switch in sky direction',
            ROBOID_power_switch_earth_direction: 'power switch in earth direction',
            ROBOID_port_s_sky_direction: 'port S in sky direction',
            ROBOID_port_s_earth_direction: 'port S in earth direction',
            ROBOID_tap: 'tap',
            ROBOID_free_fall: 'free fall',
            ROBOID_battery_normal: 'battery normal',
            ROBOID_battery_low: 'battery low',
            ROBOID_battery_empty: 'battery empty',
            ROBOID_sound_beep: 'beep',
            ROBOID_sound_random_beep: 'random beep',
            ROBOID_sound_noise: 'noise',
            ROBOID_sound_siren: 'siren',
            ROBOID_sound_engine: 'engine',
            ROBOID_sound_chop: 'chop',
            ROBOID_sound_robot: 'robot',
            ROBOID_sound_dibidibidip: 'dibidibidip',
            ROBOID_sound_good_job: 'good job',
            ROBOID_sound_happy: 'happy',
            ROBOID_sound_angry: 'angry',
            ROBOID_sound_sad: 'sad',
            ROBOID_sound_sleep: 'sleep',
            ROBOID_sound_march: 'march',
            ROBOID_sound_birthday: 'birthday',
            ROBOID_note_c: 'C',
            ROBOID_note_c_sharp: 'C♯(D♭)',
            ROBOID_note_d: 'D',
            ROBOID_note_d_sharp: 'D♯(E♭)',
            ROBOID_note_e: 'E',
            ROBOID_note_f: 'F',
            ROBOID_note_f_sharp: 'F♯(G♭)',
            ROBOID_note_g: 'G',
            ROBOID_note_g_sharp: 'G♯(A♭)',
            ROBOID_note_a: 'A',
            ROBOID_note_a_sharp: 'A♯(B♭)',
            ROBOID_note_b: 'B',
            ROBOID_speaker_internal: 'internal speaker',
            ROBOID_speaker_port_mab: 'port Mab',
            ROBOID_io_mode_makey: 'makey',
            ROBOID_io_mode_button: 'button',
            ROBOID_io_mode_digital_pull_up: 'digital (pull up)',
            ROBOID_io_mode_digital_pull_down: 'digital (pull down)',
            ROBOID_io_mode_analog: 'analog',
            ROBOID_io_mode_voltage: 'voltage',
            ROBOID_io_mode_pulse: 'pulse',
            ROBOID_io_mode_pulse_pull_up: 'pulse (pull up)',
            ROBOID_io_mode_pulse_pull_down: 'pulse (pull down)',
            ROBOID_io_mode_normal: 'normal',
            ROBOID_io_mode_power: 'power',
            ROBOID_io_port_high_current_mab: 'high current Ma(-)b',
            ROBOID_io_port_high_current_mcd: 'high current Mc(-)d',
            ROBOID_io_action_stop: 'stop',
            ROBOID_io_action_turn_off: 'turn off',
            ROBOID_range_integer: 'without',
            ROBOID_range_real: 'with',
            ROBOID_led_intensity_dark: 'dark',
            ROBOID_led_intensity_normal: 'normal',
            ROBOID_led_intensity_bright: 'bright',
            ROBOID_led_type_default: 'default',
            ROBOID_led_type_crgb: '-rgb',
            ROBOID_led_type_crbg: '-rbg',
            ROBOID_led_type_cgrb: '-grb',
            ROBOID_led_type_cgbr: '-gbr',
            ROBOID_led_type_cbrg: '-brg',
            ROBOID_led_type_cbgr: '-bgr',
            ROBOID_led_type_argb: '+rgb',
            ROBOID_led_type_arbg: '+rbg',
            ROBOID_led_type_agrb: '+grb',
            ROBOID_led_type_agbr: '+gbr',
            ROBOID_led_type_abrg: '+brg',
            ROBOID_led_type_abgr: '+bgr',
            ROBOID_color_red: 'red',
            ROBOID_color_orange: 'orange',
            ROBOID_color_yellow: 'yellow',
            ROBOID_color_green: 'green',
            ROBOID_color_sky_blue: 'sky blue',
            ROBOID_color_blue: 'blue',
            ROBOID_color_violet: 'violet',
            ROBOID_color_purple: 'purple',
            ROBOID_color_white: 'white',
            ROBOID_neopixel_3_colors: '3 colors',
            ROBOID_neopixel_6_colors: '6 colors',
            ROBOID_neopixel_12_colors: '12 colors',
            ROBOID_neopixel_red_green: 'red to green',
            ROBOID_neopixel_red_blue: 'red to blue',
            ROBOID_neopixel_red_white: 'red to white',
            ROBOID_neopixel_green_red: 'green to red',
            ROBOID_neopixel_green_blue: 'green to blue',
            ROBOID_neopixel_green_white: 'green to white',
            ROBOID_neopixel_blue_red: 'blue to red',
            ROBOID_neopixel_blue_green: 'blue to green',
            ROBOID_neopixel_blue_white: 'blue to white',
            ROBOID_neopixel_white_red: 'white to red',
            ROBOID_neopixel_white_green: 'white to green',
            ROBOID_neopixel_white_blue: 'white to blue',
            ROBOID_neopixel_red_black: 'red getting darker',
            ROBOID_neopixel_green_black: 'green getting darker',
            ROBOID_neopixel_blue_black: 'blue getting darker',
            ROBOID_neopixel_white_black: 'white getting darker',
            ROBOID_neopixel_black_red: 'red getting brighter',
            ROBOID_neopixel_black_green: 'green getting brighter',
            ROBOID_neopixel_black_blue: 'blue getting brighter',
            ROBOID_neopixel_black_white: 'white getting brighter',
            ROBOID_serial_string: 'string',
            ROBOID_serial_string_line: 'string line',
            ROBOID_serial_all: 'all',
            ROBOID_serial_until_comma: 'until ,(comma)',
            ROBOID_serial_until_colon: 'until :(colon)',
            ROBOID_serial_until_dollar: 'until $',
            ROBOID_serial_until_sharp: 'until #',
            ROBOID_serial_until_new_line: 'until new line',
            ROBOID_serial_port_wa_rb: 'La(write) Lb(read)',
            ROBOID_serial_port_ra_wb: 'La(read) Lb(write)',
            ROBOID_serial_port_wa: 'La(write)',
            ROBOID_serial_port_ra: 'La(read)',
            ROBOID_pid_10: 'PID-10 ultrasonic sensor (HC-SR04+)',
            ROBOID_pid_11_1: 'PID-11-1 humidity/temperature sensor (DHT11)',
            ROBOID_pid_11_2: 'PID-11-2 humidity/temperature sensor (DHT21)',
            ROBOID_pid_11_3: 'PID-11-3 humidity/temperature sensor (DHT22)',
            ROBOID_pid_12: 'PID-12 temperature sensor (DS18B20)',
            ROBOID_pid_13: 'PID-13 joystick and button',
            ROBOID_pid_14: 'PID-14 dual joystick',
            ROBOID_pid_15: 'PID-15 IR transceiver',
            ROBOID_pid_16: 'PID-16 encoder',
            ROBOID_pid_distance: 'distance (cm)',
            ROBOID_pid_temperature: 'temperature (℃)',
            ROBOID_pid_humidity: 'humidity (%RH)',
            ROBOID_pid_x1: 'x1',
            ROBOID_pid_y1: 'y1',
            ROBOID_pid_x2: 'x2',
            ROBOID_pid_y2: 'y2',
            ROBOID_pid_button1: 'button1',
            ROBOID_pid_button2: 'button2',
            ROBOID_pid_encoder: 'encoder',
            ROBOID_clicked: 'clicked',
            ROBOID_double_clicked: 'double-clicked',
            ROBOID_long_pressed: 'long-pressed',
            ROBOID_shape_square: 'square',
            ROBOID_shape_triangle: 'triangle',
            ROBOID_shape_diamond: 'diamond',
            ROBOID_shape_circle: 'circle',
            ROBOID_shape_x: 'X',
            ROBOID_shape_like: 'like',
            ROBOID_shape_dislike: 'dislike',
            ROBOID_shape_angry: 'angry',
            ROBOID_shape_open_mouth: 'open mouth',
            ROBOID_shape_close_mouth: 'close mouth',
            ROBOID_shape_walk1: 'walk 1',
            ROBOID_shape_walk2: 'walk 2',
            ROBOID_shape_heart: 'heart',
            ROBOID_shape_star: 'star',
            ROBOID_shape_airplane: 'airplane',
            ROBOID_shape_puppy: 'puppy',
            ROBOID_shape_butterfly: 'butterfly',
            ROBOID_shape_quarter_note: 'quarter note',
            ROBOID_shape_eighth_note: 'eighth note',
            ROBOID_shape_left_arrow: 'left arrow',
            ROBOID_shape_right_arrow: 'right arrow',
            ROBOID_shape_up_arrow: 'up arrow',
            ROBOID_shape_down_arrow: 'down arrow',
            ROBOID_hat_background: 'background',
            ROBOID_hat_all: 'all',
            ROBOID_hat_clear: 'clear',
            ROBOID_hat_show: 'show',
            ROBOID_hat_hide: 'hide',
            ROBOID_hat_clockwise: 'clockwise',
            ROBOID_hat_counterclockwise: 'counterclockwise',
            ROBOID_hat_left_right: 'left-right',
            ROBOID_hat_up_down: 'up-down',
            ROBOID_hat_auto: 'auto',
            ROBOID_hat_manual: 'manual',
            ROBOID_hat_other_sprite: 'other sprite',
            ROBOID_hat_left_wall: 'left wall',
            ROBOID_hat_right_wall: 'right wall',
            ROBOID_hat_top_wall: 'top wall',
            ROBOID_hat_bottom_wall: 'bottom wall',
            ROBOID_hat_any_wall: 'any wall',
        },
    },
});

Entry.Cheese.blockMenuBlocks = [
    'cheese_value',
    'cheese_boolean',
    'cheese_play_sound_times',
    'cheese_play_sound_times_until_done',
    'cheese_change_buzzer_by',
    'cheese_set_buzzer_to',
    'cheese_clear_sound',
    'cheese_play_note',
    'cheese_play_note_for',
    'cheese_rest_for',
    'cheese_change_tempo_by',
    'cheese_set_tempo_to',
    'cheese_set_sound_port_to',
    'cheese_set_input_mode_to',
    'cheese_set_input_range_to',
    'cheese_set_three_input_ranges_to',
    'cheese_analog_input',
    'cheese_digital_input',
    'cheese_button_state',
    'cheese_set_pulse_mode_to',
    'cheese_pulse_input',
    'cheese_set_digital_output_to',
    'cheese_change_pwm_output_by',
    'cheese_set_pwm_output_to',
    'cheese_change_servo_motor_angle_by',
    'cheese_set_servo_motor_angle_to',
    'cheese_turn_off_servo_motor',
    'cheese_change_dc_motor_velocity_by',
    'cheese_set_dc_motor_velocity_to',
    'cheese_stop_dc_motor',
    'cheese_rotate_step_motor',
    'cheese_change_step_motor_velocity_by',
    'cheese_set_step_motor_velocity_to',
    'cheese_stop_off_step_motor',
    'cheese_set_step_motor_mode_to',
    'cheese_step_count',
    'cheese_set_led_to_color',
    'cheese_pick_led_to',
    'cheese_change_led_by_rgb',
    'cheese_setLed_to_rgb',
    'cheese_clear_led',
    'cheese_set_led_type_to',
    'cheese_neopixel_set_number_and_type_to',
    'cheese_neopixel_set_all_leds_to_pattern',
    'cheese_neopixel_set_all_leds_to_color',
    'cheese_neopixel_pick_all_leds_to',
    'cheese_neopixel_change_all_leds_by_rgb',
    'cheese_neopixel_set_all_leds_to_rgb',
    'cheese_neopixel_clear_all_leds',
    'cheese_neopixel_set_led_to_color',
    'cheese_neopixel_pick_led_to',
    'cheese_neopixel_change_led_by_rgb',
    'cheese_neopixel_set_led_to_rgb',
    'cheese_neopixel_clear_led',
    'cheese_neopixel_set_led_range_to_pattern',
    'cheese_neopixel_set_led_range_to_color',
    'cheese_neopixel_pick_led_range_to',
    'cheese_neopixel_change_led_range_by_rgb',
    'cheese_neopixel_set_led_range_to_rgb',
    'cheese_neopixel_clear_led_range',
    'cheese_neopixel_shift',
    'cheese_neopixel_rotate',
    'cheese_neopixel_change_brightness_by',
    'cheese_neopixel_set_brightness_to',
    'cheese_write_serial',
    'cheese_read_serial_until',
    'cheese_set_serial_port_to',
    'cheese_set_serial_rate_to',
    'cheese_serial_input',
    'cheese_pid_start',
    'cheese_pid_set_range_to',
    'cheese_pid_set_three_ranges_to',
    'cheese_pid_reset_encoder',
    'cheese_pid_input',
    'cheese_pid_button_state',
    'cheese_hat010_start',
    'cheese_hat010_button',
    'cheese_hat010_button_state',
    'cheese_hat010_background_turn_on_xy',
    'cheese_hat010_background_turn_off_xy',
    'cheese_hat010_background_draw_shape_at_xy',
    'cheese_hat010_background_draw_string_at_xy',
    'cheese_hat010_background_draw_pattern_at_xy',
    'cheese_hat010_clear',
    'cheese_hat010_scroll_by_xy',
    'cheese_hat010_sprite_set_to_shape',
    'cheese_hat010_sprite_set_to_string',
    'cheese_hat010_sprite_set_to_pattern',
    'cheese_hat010_sprite_clear_show_hide',        
    'cheese_hat010_sprite_change_positions_by_xy',
    'cheese_hat010_sprite_set_positions_to_xy',
    'cheese_hat010_sprite_change_position_by_value',
    'cheese_hat010_sprite_set_position_to_value',
    'cheese_hat010_sprite_rotate',
    'cheese_hat010_sprite_flip_in_direction',
    'cheese_hat010_sprite_stamp_to_background',
    'cheese_hat010_sprite_position',
    'cheese_hat010_sprite_touching_sprite',
    'cheese_hat010_sprite_touching',
    'cheese_hat010_change_brightness_by',
    'cheese_hat010_set_brightness_to',
];

Entry.Cheese.getBlocks = function() {
    return {
        cheese_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.ROBOID_sensor_acceleration_x, 'ACCELERATION_X'],
                        [Lang.Blocks.ROBOID_sensor_acceleration_y, 'ACCELERATION_Y'],
                        [Lang.Blocks.ROBOID_sensor_acceleration_z, 'ACCELERATION_Z'],
                        [Lang.Blocks.ROBOID_sensor_signal_strength_dbm, 'SIGNAL_STRENGTH'],
                    ],
                    value: 'ACCELERATION_X',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'cheese_value',
            },
            paramsKeyMap: {
                DEVICE: 0,
            },
            class: 'cheese_sensor',
            isNotFor: ['cheese'],
            func(sprite, script) {
                const robot = Entry.Cheese.getRobot();
                if (robot) {
                    return robot.getValue(script);
                }
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Cheese.sensor_value(%1)',
                        blockType: 'param',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.ROBOID_sensor_acceleration_x, 'ACCELERATION_X'],
                                    [Lang.Blocks.ROBOID_sensor_acceleration_y, 'ACCELERATION_Y'],
                                    [Lang.Blocks.ROBOID_sensor_acceleration_z, 'ACCELERATION_Z'],
                                    [Lang.Blocks.ROBOID_sensor_signal_strength_dbm, 'SIGNAL_STRENGTH'],
                                ],
                                value: 'ACCELERATION_X',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                        ],
                    },
                ],
            },
        },
        cheese_boolean: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.ROBOID_logo_sky_direction, 'TILT_NOT'],
                        [Lang.Blocks.ROBOID_logo_earth_direction, 'TILT_FLIP'],
                        [Lang.Blocks.ROBOID_power_switch_sky_direction, 'TILT_LEFT'],
                        [Lang.Blocks.ROBOID_power_switch_earth_direction, 'TILT_RIGHT'],
                        [Lang.Blocks.ROBOID_port_s_sky_direction, 'TILT_FORWARD'],
                        [Lang.Blocks.ROBOID_port_s_earth_direction, 'TILT_BACKWARD'],
                        [Lang.Blocks.ROBOID_tap, 'TAP'],
                        [Lang.Blocks.ROBOID_free_fall, 'FREE_FALL'],
                        [Lang.Blocks.ROBOID_battery_normal, 'BATTERY_NORMAL'],
                        [Lang.Blocks.ROBOID_battery_low, 'BATTERY_LOW'],
                        [Lang.Blocks.ROBOID_battery_empty, 'BATTERY_EMPTY'],
                    ],
                    value: 'TILT_NOT',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'cheese_boolean',
            },
            paramsKeyMap: {
                DEVICE: 0,
            },
            class: 'cheese_sensor',
            isNotFor: ['cheese'],
            func(sprite, script) {
                const robot = Entry.Cheese.getRobot();
                return robot ? robot.checkBoolean(script) : false;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Cheese.boolean_value(%1)',
                        blockType: 'param',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.ROBOID_logo_sky_direction, 'TILT_NOT'],
                                    [Lang.Blocks.ROBOID_logo_earth_direction, 'TILT_FLIP'],
                                    [Lang.Blocks.ROBOID_power_switch_sky_direction, 'TILT_LEFT'],
                                    [Lang.Blocks.ROBOID_power_switch_earth_direction, 'TILT_RIGHT'],
                                    [Lang.Blocks.ROBOID_port_s_sky_direction, 'TILT_FORWARD'],
                                    [Lang.Blocks.ROBOID_port_s_earth_direction, 'TILT_BACKWARD'],
                                    [Lang.Blocks.ROBOID_tap, 'TAP'],
                                    [Lang.Blocks.ROBOID_free_fall, 'FREE_FALL'],
                                    [Lang.Blocks.ROBOID_battery_normal, 'BATTERY_NORMAL'],
                                    [Lang.Blocks.ROBOID_battery_low, 'BATTERY_LOW'],
                                    [Lang.Blocks.ROBOID_battery_empty, 'BATTERY_EMPTY'],
                                ],
                                value: 'TILT_NOT',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                        ],
                    },
                ],
            },
        },
        cheese_play_sound_times: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.ROBOID_sound_beep, 'BEEP'],
                        [Lang.Blocks.ROBOID_sound_random_beep, 'RANDOM_BEEP'],
                        [Lang.Blocks.ROBOID_sound_noise, 'NOISE'],
                        [Lang.Blocks.ROBOID_sound_siren, 'SIREN'],
                        [Lang.Blocks.ROBOID_sound_engine, 'ENGINE'],
                        [Lang.Blocks.ROBOID_sound_chop, 'CHOP'],
                        [Lang.Blocks.ROBOID_sound_robot, 'ROBOT'],
                        [Lang.Blocks.ROBOID_sound_dibidibidip, 'DIBIDIBIDIP'],
                        [Lang.Blocks.ROBOID_sound_good_job, 'GOOD_JOB'],
                        [Lang.Blocks.ROBOID_sound_happy, 'HAPPY'],
                        [Lang.Blocks.ROBOID_sound_angry, 'ANGRY'],
                        [Lang.Blocks.ROBOID_sound_sad, 'SAD'],
                        [Lang.Blocks.ROBOID_sound_sleep, 'SLEEP'],
                        [Lang.Blocks.ROBOID_sound_march, 'MARCH'],
                        [Lang.Blocks.ROBOID_sound_birthday, 'BIRTHDAY'],
                    ],
                    value: 'BEEP',
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
                        params: ['1'],
                    },
                    null,
                ],
                type: 'cheese_play_sound_times',
            },
            paramsKeyMap: {
                SOUND: 0,
                COUNT: 1,
            },
            class: 'cheese_sound',
            isNotFor: ['cheese'],
            func(sprite, script) {
                const robot = Entry.Cheese.getRobot();
                return robot ? robot.playSound(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Cheese.play_sound(%1, %2)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.ROBOID_sound_beep, 'BEEP'],
                                    [Lang.Blocks.ROBOID_sound_random_beep, 'RANDOM_BEEP'],
                                    [Lang.Blocks.ROBOID_sound_noise, 'NOISE'],
                                    [Lang.Blocks.ROBOID_sound_siren, 'SIREN'],
                                    [Lang.Blocks.ROBOID_sound_engine, 'ENGINE'],
                                    [Lang.Blocks.ROBOID_sound_chop, 'CHOP'],
                                    [Lang.Blocks.ROBOID_sound_robot, 'ROBOT'],
                                    [Lang.Blocks.ROBOID_sound_dibidibidip, 'DIBIDIBIDIP'],
                                    [Lang.Blocks.ROBOID_sound_good_job, 'GOOD_JOB'],
                                    [Lang.Blocks.ROBOID_sound_happy, 'HAPPY'],
                                    [Lang.Blocks.ROBOID_sound_angry, 'ANGRY'],
                                    [Lang.Blocks.ROBOID_sound_sad, 'SAD'],
                                    [Lang.Blocks.ROBOID_sound_sleep, 'SLEEP'],
                                    [Lang.Blocks.ROBOID_sound_march, 'MARCH'],
                                    [Lang.Blocks.ROBOID_sound_birthday, 'BIRTHDAY'],
                                ],
                                value: 'BEEP',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                            { type: 'Block', accept: 'string' },
                        ],
                    },
                ],
            },
        },
        cheese_play_sound_times_until_done: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.ROBOID_sound_beep, 'BEEP'],
                        [Lang.Blocks.ROBOID_sound_random_beep, 'RANDOM_BEEP'],
                        [Lang.Blocks.ROBOID_sound_noise, 'NOISE'],
                        [Lang.Blocks.ROBOID_sound_siren, 'SIREN'],
                        [Lang.Blocks.ROBOID_sound_engine, 'ENGINE'],
                        [Lang.Blocks.ROBOID_sound_chop, 'CHOP'],
                        [Lang.Blocks.ROBOID_sound_robot, 'ROBOT'],
                        [Lang.Blocks.ROBOID_sound_dibidibidip, 'DIBIDIBIDIP'],
                        [Lang.Blocks.ROBOID_sound_good_job, 'GOOD_JOB'],
                        [Lang.Blocks.ROBOID_sound_happy, 'HAPPY'],
                        [Lang.Blocks.ROBOID_sound_angry, 'ANGRY'],
                        [Lang.Blocks.ROBOID_sound_sad, 'SAD'],
                        [Lang.Blocks.ROBOID_sound_sleep, 'SLEEP'],
                        [Lang.Blocks.ROBOID_sound_march, 'MARCH'],
                        [Lang.Blocks.ROBOID_sound_birthday, 'BIRTHDAY'],
                    ],
                    value: 'BEEP',
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
                        params: ['1'],
                    },
                    null,
                ],
                type: 'cheese_play_sound_times_until_done',
            },
            paramsKeyMap: {
                SOUND: 0,
                COUNT: 1,
            },
            class: 'cheese_sound',
            isNotFor: ['cheese'],
            func(sprite, script) {
                const robot = Entry.Cheese.getRobot();
                return robot ? robot.playSoundUntil(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Cheese.play_sound_until_done(%1, %2)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.ROBOID_sound_beep, 'BEEP'],
                                    [Lang.Blocks.ROBOID_sound_random_beep, 'RANDOM_BEEP'],
                                    [Lang.Blocks.ROBOID_sound_noise, 'NOISE'],
                                    [Lang.Blocks.ROBOID_sound_siren, 'SIREN'],
                                    [Lang.Blocks.ROBOID_sound_engine, 'ENGINE'],
                                    [Lang.Blocks.ROBOID_sound_chop, 'CHOP'],
                                    [Lang.Blocks.ROBOID_sound_robot, 'ROBOT'],
                                    [Lang.Blocks.ROBOID_sound_dibidibidip, 'DIBIDIBIDIP'],
                                    [Lang.Blocks.ROBOID_sound_good_job, 'GOOD_JOB'],
                                    [Lang.Blocks.ROBOID_sound_happy, 'HAPPY'],
                                    [Lang.Blocks.ROBOID_sound_angry, 'ANGRY'],
                                    [Lang.Blocks.ROBOID_sound_sad, 'SAD'],
                                    [Lang.Blocks.ROBOID_sound_sleep, 'SLEEP'],
                                    [Lang.Blocks.ROBOID_sound_march, 'MARCH'],
                                    [Lang.Blocks.ROBOID_sound_birthday, 'BIRTHDAY'],
                                ],
                                value: 'BEEP',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                            { type: 'Block', accept: 'string' },
                        ],
                    },
                ],
            },
        },
        cheese_change_buzzer_by: {
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
                        params: ['10'],
                    },
                    null,
                ],
                type: 'cheese_change_buzzer_by',
            },
            paramsKeyMap: {
                HZ: 0,
            },
            class: 'cheese_sound',
            isNotFor: ['cheese'],
            func(sprite, script) {
                const robot = Entry.Cheese.getRobot();
                return robot ? robot.changeBuzzer(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Cheese.add_buzzer(%1)',
                    },
                ],
            },
        },
        cheese_set_buzzer_to: {
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
                type: 'cheese_set_buzzer_to',
            },
            paramsKeyMap: {
                HZ: 0,
            },
            class: 'cheese_sound',
            isNotFor: ['cheese'],
            func(sprite, script) {
                const robot = Entry.Cheese.getRobot();
                return robot ? robot.setBuzzer(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Cheese.set_buzzer(%1)',
                    },
                ],
            },
        },
        cheese_clear_sound: {
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
                type: 'cheese_clear_sound',
            },
            class: 'cheese_sound',
            isNotFor: ['cheese'],
            func(sprite, script) {
                const robot = Entry.Cheese.getRobot();
                return robot ? robot.clearSound(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Cheese.clear_sound()',
                    },
                ],
            },
        },
        cheese_play_note: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.ROBOID_note_c, 'C'],
                        [Lang.Blocks.ROBOID_note_c_sharp, 'C#'],
                        [Lang.Blocks.ROBOID_note_d, 'D'],
                        [Lang.Blocks.ROBOID_note_d_sharp, 'D#'],
                        [Lang.Blocks.ROBOID_note_e, 'E'],
                        [Lang.Blocks.ROBOID_note_f, 'F'],
                        [Lang.Blocks.ROBOID_note_f_sharp, 'F#'],
                        [Lang.Blocks.ROBOID_note_g, 'G'],
                        [Lang.Blocks.ROBOID_note_g_sharp, 'G#'],
                        [Lang.Blocks.ROBOID_note_a, 'A'],
                        [Lang.Blocks.ROBOID_note_a_sharp, 'A#'],
                        [Lang.Blocks.ROBOID_note_b, 'B'],
                    ],
                    value: 'C',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        ['1', '1'],
                        ['2', '2'],
                        ['3', '3'],
                        ['4', '4'],
                        ['5', '5'],
                        ['6', '6'],
                        ['7', '7'],
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
                params: [null, '4', null],
                type: 'cheese_play_note',
            },
            paramsKeyMap: {
                NOTE: 0,
                OCTAVE: 1,
            },
            class: 'cheese_sound',
            isNotFor: ['cheese'],
            func(sprite, script) {
                const robot = Entry.Cheese.getRobot();
                return robot ? robot.playNote(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Cheese.play_pitch(%1, %2)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.ROBOID_note_c, 'C'],
                                    [Lang.Blocks.ROBOID_note_c_sharp, 'C#'],
                                    [Lang.Blocks.ROBOID_note_d, 'D'],
                                    [Lang.Blocks.ROBOID_note_d_sharp, 'D#'],
                                    [Lang.Blocks.ROBOID_note_e, 'E'],
                                    [Lang.Blocks.ROBOID_note_f, 'F'],
                                    [Lang.Blocks.ROBOID_note_f_sharp, 'F#'],
                                    [Lang.Blocks.ROBOID_note_g, 'G'],
                                    [Lang.Blocks.ROBOID_note_g_sharp, 'G#'],
                                    [Lang.Blocks.ROBOID_note_a, 'A'],
                                    [Lang.Blocks.ROBOID_note_a_sharp, 'A#'],
                                    [Lang.Blocks.ROBOID_note_b, 'B'],
                                ],
                                value: 'C',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                            {
                                type: 'Dropdown',
                                options: [
                                    ['1', '1'],
                                    ['2', '2'],
                                    ['3', '3'],
                                    ['4', '4'],
                                    ['5', '5'],
                                    ['6', '6'],
                                    ['7', '7'],
                                ],
                                value: '1',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringOrNumberByValue,
                            },
                        ],
                    },
                ],
            },
        },
        cheese_play_note_for: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.ROBOID_note_c, 'C'],
                        [Lang.Blocks.ROBOID_note_c_sharp, 'C#'],
                        [Lang.Blocks.ROBOID_note_d, 'D'],
                        [Lang.Blocks.ROBOID_note_d_sharp, 'D#'],
                        [Lang.Blocks.ROBOID_note_e, 'E'],
                        [Lang.Blocks.ROBOID_note_f, 'F'],
                        [Lang.Blocks.ROBOID_note_f_sharp, 'F#'],
                        [Lang.Blocks.ROBOID_note_g, 'G'],
                        [Lang.Blocks.ROBOID_note_g_sharp, 'G#'],
                        [Lang.Blocks.ROBOID_note_a, 'A'],
                        [Lang.Blocks.ROBOID_note_a_sharp, 'A#'],
                        [Lang.Blocks.ROBOID_note_b, 'B'],
                    ],
                    value: 'C',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        ['1', '1'],
                        ['2', '2'],
                        ['3', '3'],
                        ['4', '4'],
                        ['5', '5'],
                        ['6', '6'],
                        ['7', '7'],
                    ],
                    value: '1',
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
                    '4',
                    {
                        type: 'text',
                        params: ['0.5'],
                    },
                    null,
                ],
                type: 'cheese_play_note_for',
            },
            paramsKeyMap: {
                NOTE: 0,
                OCTAVE: 1,
                BEAT: 2,
            },
            class: 'cheese_sound',
            isNotFor: ['cheese'],
            func(sprite, script) {
                const robot = Entry.Cheese.getRobot();
                return robot ? robot.playNoteBeat(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Cheese.play_note(%1, %2, %3)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.ROBOID_note_c, 'C'],
                                    [Lang.Blocks.ROBOID_note_c_sharp, 'C#'],
                                    [Lang.Blocks.ROBOID_note_d, 'D'],
                                    [Lang.Blocks.ROBOID_note_d_sharp, 'D#'],
                                    [Lang.Blocks.ROBOID_note_e, 'E'],
                                    [Lang.Blocks.ROBOID_note_f, 'F'],
                                    [Lang.Blocks.ROBOID_note_f_sharp, 'F#'],
                                    [Lang.Blocks.ROBOID_note_g, 'G'],
                                    [Lang.Blocks.ROBOID_note_g_sharp, 'G#'],
                                    [Lang.Blocks.ROBOID_note_a, 'A'],
                                    [Lang.Blocks.ROBOID_note_a_sharp, 'A#'],
                                    [Lang.Blocks.ROBOID_note_b, 'B'],
                                ],
                                value: 'C',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                            {
                                type: 'Dropdown',
                                options: [
                                    ['1', '1'],
                                    ['2', '2'],
                                    ['3', '3'],
                                    ['4', '4'],
                                    ['5', '5'],
                                    ['6', '6'],
                                    ['7', '7'],
                                ],
                                value: '1',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringOrNumberByValue,
                            },
                            { type: 'Block', accept: 'string' },
                        ],
                    },
                ],
            },
        },
        cheese_rest_for: {
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
                        params: ['0.25'],
                    },
                    null,
                ],
                type: 'cheese_rest_for',
            },
            paramsKeyMap: {
                BEAT: 0,
            },
            class: 'cheese_sound',
            isNotFor: ['cheese'],
            func(sprite, script) {
                const robot = Entry.Cheese.getRobot();
                return robot ? robot.restBeat(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Cheese.rest(%1)',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                        ],
                    },
                ],
            },
        },
        cheese_change_tempo_by: {
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
                        params: ['20'],
                    },
                    null,
                ],
                type: 'cheese_change_tempo_by',
            },
            paramsKeyMap: {
                BPM: 0,
            },
            class: 'cheese_sound',
            isNotFor: ['cheese'],
            func(sprite, script) {
                const robot = Entry.Cheese.getRobot();
                return robot ? robot.changeTempo(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Cheese.add_tempo(%1)',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                        ],
                    },
                ],
            },
        },
        cheese_set_tempo_to: {
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
                        params: ['60'],
                    },
                    null,
                ],
                type: 'cheese_set_tempo_to',
            },
            paramsKeyMap: {
                BPM: 0,
            },
            class: 'cheese_sound',
            isNotFor: ['cheese'],
            func(sprite, script) {
                const robot = Entry.Cheese.getRobot();
                return robot ? robot.setTempo(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Cheese.set_tempo(%1)',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                        ],
                    },
                ],
            },
        },
        cheese_set_sound_port_to: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.ROBOID_speaker_internal, 'INTERNAL'],
                        [Lang.Blocks.ROBOID_speaker_port_mab, 'MAB'],
                    ],
                    value: 'INTERNAL',
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
                params: [
                    null,
                    null,
                ],
                type: 'cheese_set_sound_port_to',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'cheese_sound',
            isNotFor: ['cheese'],
            func(sprite, script) {
                const robot = Entry.Cheese.getRobot();
                return robot ? robot.setSoundPort(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Cheese.set_sound_port(%1)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.ROBOID_speaker_internal, 'INTERNAL'],
                                    [Lang.Blocks.ROBOID_speaker_port_mab, 'MAB'],
                                ],
                                value: 'INTERNAL',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                        ],
                    },
                ],
            },
        },
        cheese_set_input_mode_to: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['Sa', 'SA'],
                        ['Sb', 'SB'],
                        ['Sc', 'SC'],
                        ['La', 'LA'],
                        ['Lb', 'LB'],
                        ['Lc', 'LC'],
                    ],
                    value: 'SA',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.ROBOID_io_mode_makey, 'MAKEY'],
                        [Lang.Blocks.ROBOID_io_mode_button, 'BUTTON'],
                        [Lang.Blocks.ROBOID_io_mode_digital_pull_up, 'DIGITAL_PULL_UP'],
                        [Lang.Blocks.ROBOID_io_mode_digital_pull_down, 'DIGITAL_PULL_DOWN'],
                        [Lang.Blocks.ROBOID_io_mode_analog, 'ANALOG'],
                        [Lang.Blocks.ROBOID_io_mode_voltage, 'VOLTAGE'],
                    ],
                    value: 'MAKEY',
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
                params: [
                    null,
                    null,
                    null,
                ],
                type: 'cheese_set_input_mode_to',
            },
            paramsKeyMap: {
                PORT: 0,
                MODE: 1,
            },
            class: 'cheese_input',
            isNotFor: ['cheese'],
            func(sprite, script) {
                const robot = Entry.Cheese.getRobot();
                return robot ? robot.setInputModeTo(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Cheese.set_input_mode(%1, %2)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    ['Sa', 'SA'],
                                    ['Sb', 'SB'],
                                    ['Sc', 'SC'],
                                    ['La', 'LA'],
                                    ['Lb', 'LB'],
                                    ['Lc', 'LC'],
                                ],
                                value: 'SA',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.ROBOID_io_mode_makey, 'MAKEY'],
                                    [Lang.Blocks.ROBOID_io_mode_button, 'BUTTON'],
                                    [Lang.Blocks.ROBOID_io_mode_digital_pull_up, 'DIGITAL_PULL_UP'],
                                    [Lang.Blocks.ROBOID_io_mode_digital_pull_down, 'DIGITAL_PULL_DOWN'],
                                    [Lang.Blocks.ROBOID_io_mode_analog, 'ANALOG'],
                                    [Lang.Blocks.ROBOID_io_mode_voltage, 'VOLTAGE'],
                                ],
                                value: 'MAKEY',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                        ],
                    },
                ],
            },
        },
        cheese_set_input_range_to: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['Sa', 'SA'],
                        ['Sb', 'SB'],
                        ['Sc', 'SC'],
                        ['La', 'LA'],
                        ['Lb', 'LB'],
                        ['Lc', 'LC'],
                    ],
                    value: 'SA',
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
                        [Lang.Blocks.ROBOID_range_integer, 'INTEGER'],
                        [Lang.Blocks.ROBOID_range_real, 'REAL'],
                    ],
                    value: 'INTEGER',
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
                params: [
                    null,
                    {
                        type: 'text',
                        params: ['0'],
                    },
                    {
                        type: 'text',
                        params: ['255'],
                    },
                    {
                        type: 'text',
                        params: ['0'],
                    },
                    {
                        type: 'text',
                        params: ['100'],
                    },
                    null,
                    null,
                ],
                type: 'cheese_set_input_range_to',
            },
            paramsKeyMap: {
                PORT: 0,
                LOW1: 1,
                HIGH1: 2,
                LOW2: 3,
                HIGH2: 4,
                DECIMAL: 5,
            },
            class: 'cheese_input',
            isNotFor: ['cheese'],
            func(sprite, script) {
                const robot = Entry.Cheese.getRobot();
                return robot ? robot.setInputRangeTo(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Cheese.set_input_range(%1, %2, %3, %4, %5, %6)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    ['Sa', 'SA'],
                                    ['Sb', 'SB'],
                                    ['Sc', 'SC'],
                                    ['La', 'LA'],
                                    ['Lb', 'LB'],
                                    ['Lc', 'LC'],
                                ],
                                value: 'SA',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
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
                                type: 'Block',
                                accept: 'string',
                            },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.ROBOID_range_integer, 'INTEGER'],
                                    [Lang.Blocks.ROBOID_range_real, 'REAL'],
                                ],
                                value: 'INTEGER',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                            },
                        ],
                    },
                ],
            },
        },
        cheese_set_three_input_ranges_to: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['Sa', 'SA'],
                        ['Sb', 'SB'],
                        ['Sc', 'SC'],
                        ['La', 'LA'],
                        ['Lb', 'LB'],
                        ['Lc', 'LC'],
                    ],
                    value: 'SA',
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
                        [Lang.Blocks.ROBOID_range_integer, 'INTEGER'],
                        [Lang.Blocks.ROBOID_range_real, 'REAL'],
                    ],
                    value: 'INTEGER',
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
                params: [
                    null,
                    {
                        type: 'text',
                        params: ['0'],
                    },
                    {
                        type: 'text',
                        params: ['127'],
                    },
                    {
                        type: 'text',
                        params: ['255'],
                    },
                    {
                        type: 'text',
                        params: ['-100'],
                    },
                    {
                        type: 'text',
                        params: ['0'],
                    },
                    {
                        type: 'text',
                        params: ['100'],
                    },
                    null,
                    null,
                ],
                type: 'cheese_set_three_input_ranges_to',
            },
            paramsKeyMap: {
                PORT: 0,
                LOW1: 1,
                MIDDLE1: 2,
                HIGH1: 3,
                LOW2: 4,
                MIDDLE2: 5,
                HIGH2: 6,
                DECIMAL: 7,
            },
            class: 'cheese_input',
            isNotFor: ['cheese'],
            func(sprite, script) {
                const robot = Entry.Cheese.getRobot();
                return robot ? robot.setThreeInputRangesTo(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Cheese.set_input_range_middle(%1, %2, %3, %4, %5, %6, %7, %8)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    ['Sa', 'SA'],
                                    ['Sb', 'SB'],
                                    ['Sc', 'SC'],
                                    ['La', 'LA'],
                                    ['Lb', 'LB'],
                                    ['Lc', 'LC'],
                                ],
                                value: 'SA',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
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
                                    [Lang.Blocks.ROBOID_range_integer, 'INTEGER'],
                                    [Lang.Blocks.ROBOID_range_real, 'REAL'],
                                ],
                                value: 'INTEGER',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                            },
                        ],
                    },
                ],
            },
        },
        cheese_analog_input: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['Sa', 'SA'],
                        ['Sb', 'SB'],
                        ['Sc', 'SC'],
                        ['La', 'LA'],
                        ['Lb', 'LB'],
                        ['Lc', 'LC'],
                    ],
                    value: 'SA',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [
                    null,
                ],
                type: 'cheese_analog_input',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'cheese_input',
            isNotFor: ['cheese'],
            func(sprite, script) {
                const robot = Entry.Cheese.getRobot();
                if (robot) {
                    return robot.getAnalogInput(script);
                }
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Cheese.analog_input(%1)',
                        blockType: 'param',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    ['Sa', 'SA'],
                                    ['Sb', 'SB'],
                                    ['Sc', 'SC'],
                                    ['La', 'LA'],
                                    ['Lb', 'LB'],
                                    ['Lc', 'LC'],
                                ],
                                value: 'SA',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                        ],
                    },
                ],
            },
        },
        cheese_digital_input: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['Sa', 'SA'],
                        ['Sb', 'SB'],
                        ['Sc', 'SC'],
                        ['La', 'LA'],
                        ['Lb', 'LB'],
                        ['Lc', 'LC'],
                    ],
                    value: 'SA',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        ['0', '0'],
                        ['1', '1'],
                    ],
                    value: '1',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [
                    null,
                    null,
                ],
                type: 'cheese_digital_input',
            },
            paramsKeyMap: {
                PORT: 0,
                VALUE: 1,
            },
            class: 'cheese_input',
            isNotFor: ['cheese'],
            func(sprite, script) {
                const robot = Entry.Cheese.getRobot();
                return robot ? robot.checkDigitalInput(script) : false;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Cheese.digital_input(%1)',
                        blockType: 'param',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    ['Sa', 'SA'],
                                    ['Sb', 'SB'],
                                    ['Sc', 'SC'],
                                    ['La', 'LA'],
                                    ['Lb', 'LB'],
                                    ['Lc', 'LC'],
                                ],
                                value: 'SA',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                            {
                                type: 'Dropdown',
                                options: [
                                    ['0', '0'],
                                    ['1', '1'],
                                ],
                                value: '1',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringOrNumberByValue,
                            },
                        ],
                    },
                ],
            },
        },
        cheese_button_state: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['Sa', 'SA'],
                        ['Sb', 'SB'],
                        ['Sc', 'SC'],
                        ['La', 'LA'],
                        ['Lb', 'LB'],
                        ['Lc', 'LC'],
                    ],
                    value: 'SA',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.ROBOID_clicked, 'CLICKED'],
                        [Lang.Blocks.ROBOID_long_pressed, 'LONG_PRESSED'],
                    ],
                    value: 'CLICKED',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [
                    null,
                    null,
                ],
                type: 'cheese_button_state',
            },
            paramsKeyMap: {
                PORT: 0,
                STATE: 1,
            },
            class: 'cheese_input',
            isNotFor: ['cheese'],
            func(sprite, script) {
                const robot = Entry.Cheese.getRobot();
                return robot ? robot.checkButtonState(script) : false;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Cheese.button_state(%1, %2)',
                        blockType: 'param',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    ['Sa', 'SA'],
                                    ['Sb', 'SB'],
                                    ['Sc', 'SC'],
                                    ['La', 'LA'],
                                    ['Lb', 'LB'],
                                    ['Lc', 'LC'],
                                ],
                                value: 'SA',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.ROBOID_clicked, 'CLICKED'],
                                    [Lang.Blocks.ROBOID_long_pressed, 'LONG_PRESSED'],
                                ],
                                value: 'CLICKED',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                        ],
                    },
                ],
            },
        },
        cheese_set_pulse_mode_to: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['Sc', 'SC'],
                        ['Lc', 'LC'],
                    ],
                    value: 'SC',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.ROBOID_io_mode_pulse, 'PULSE'],
                        [Lang.Blocks.ROBOID_io_mode_pulse_pull_up, 'PULSE_PULL_UP'],
                        [Lang.Blocks.ROBOID_io_mode_pulse_pull_down, 'PULSE_PULL_DOWN'],
                    ],
                    value: 'PULSE',
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
                params: [
                    null,
                    null,
                    null,
                ],
                type: 'cheese_set_pulse_mode_to',
            },
            paramsKeyMap: {
                PORT: 0,
                MODE: 1,
            },
            class: 'cheese_input',
            isNotFor: ['cheese'],
            func(sprite, script) {
                const robot = Entry.Cheese.getRobot();
                return robot ? robot.setInputModeTo(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Cheese.set_pulse_mode(%1, %2)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    ['Sc', 'SC'],
                                    ['Lc', 'LC'],
                                ],
                                value: 'SC',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.ROBOID_io_mode_pulse, 'PULSE'],
                                    [Lang.Blocks.ROBOID_io_mode_pulse_pull_up, 'PULSE_PULL_UP'],
                                    [Lang.Blocks.ROBOID_io_mode_pulse_pull_down, 'PULSE_PULL_DOWN'],
                                ],
                                value: 'PULSE',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                        ],
                    },
                ],
            },
        },
        cheese_pulse_input: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['Sc', 'SC'],
                        ['Lc', 'LC'],
                    ],
                    value: 'SC',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [
                    null,
                ],
                type: 'cheese_pulse_input',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'cheese_input',
            isNotFor: ['cheese'],
            func(sprite, script) {
                const robot = Entry.Cheese.getRobot();
                return robot ? robot.checkPulseInput(script) : false;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Cheese.pulse_input(%1)',
                        blockType: 'param',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    ['Sc', 'SC'],
                                    ['Lc', 'LC'],
                                ],
                                value: 'SC',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                        ],
                    },
                ],
            },
        },
        cheese_set_digital_output_to: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['Sa', 'SA'],
                        ['Sb', 'SB'],
                        ['Sc', 'SC'],
                        ['La', 'LA'],
                        ['Lb', 'LB'],
                        ['Lc', 'LC'],
                        [Lang.Blocks.ROBOID_io_port_high_current_mab, 'MAB'],
                        [Lang.Blocks.ROBOID_io_port_high_current_mcd, 'MCD'],
                    ],
                    value: 'SA',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        ['0', '0'],
                        ['1', '1'],
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
                params: [
                    null,
                    null,
                    null,
                ],
                type: 'cheese_set_digital_output_to',
            },
            paramsKeyMap: {
                PORT: 0,
                VALUE: 1,
            },
            class: 'cheese_digital_output',
            isNotFor: ['cheese'],
            func(sprite, script) {
                const robot = Entry.Cheese.getRobot();
                return robot ? robot.setDigitalOutput(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Cheese.set_digital_output(%1, %2)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    ['Sa', 'SA'],
                                    ['Sb', 'SB'],
                                    ['Sc', 'SC'],
                                    ['La', 'LA'],
                                    ['Lb', 'LB'],
                                    ['Lc', 'LC'],
                                    [Lang.Blocks.ROBOID_io_port_high_current_mab, 'MAB'],
                                    [Lang.Blocks.ROBOID_io_port_high_current_mcd, 'MCD'],
                                ],
                                value: 'SA',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                            {
                                type: 'Dropdown',
                                options: [
                                    ['0', '0'],
                                    ['1', '1'],
                                ],
                                value: '1',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringOrNumberByValue,
                            },
                        ],
                    },
                ],
            },
        },
        cheese_change_pwm_output_by: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['Sa', 'SA'],
                        ['Sb', 'SB'],
                        ['Sc', 'SC'],
                        ['La', 'LA'],
                        ['Lb', 'LB'],
                        ['Lc', 'LC'],
                    ],
                    value: 'SA',
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
                        params: ['10'],
                    },
                    null,
                ],
                type: 'cheese_change_pwm_output_by',
            },
            paramsKeyMap: {
                PORT: 0,
                VALUE: 1,
            },
            class: 'cheese_pwm_output',
            isNotFor: ['cheese'],
            func(sprite, script) {
                const robot = Entry.Cheese.getRobot();
                return robot ? robot.changePwmOutput(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Cheese.add_pwm_output(%1, %2)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    ['Sa', 'SA'],
                                    ['Sb', 'SB'],
                                    ['Sc', 'SC'],
                                    ['La', 'LA'],
                                    ['Lb', 'LB'],
                                    ['Lc', 'LC'],
                                ],
                                value: 'SA',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                        ],
                    },
                ],
            },
        },
        cheese_set_pwm_output_to: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['Sa', 'SA'],
                        ['Sb', 'SB'],
                        ['Sc', 'SC'],
                        ['La', 'LA'],
                        ['Lb', 'LB'],
                        ['Lc', 'LC'],
                    ],
                    value: 'SA',
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
                        params: ['50'],
                    },
                    null,
                ],
                type: 'cheese_set_pwm_output_to',
            },
            paramsKeyMap: {
                PORT: 0,
                VALUE: 1,
            },
            class: 'cheese_pwm_output',
            isNotFor: ['cheese'],
            func(sprite, script) {
                const robot = Entry.Cheese.getRobot();
                return robot ? robot.setPwmOutput(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Cheese.set_pwm_output(%1, %2)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    ['Sa', 'SA'],
                                    ['Sb', 'SB'],
                                    ['Sc', 'SC'],
                                    ['La', 'LA'],
                                    ['Lb', 'LB'],
                                    ['Lc', 'LC'],
                                ],
                                value: 'SA',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                        ],
                    },
                ],
            },
        },
        cheese_change_servo_motor_angle_by: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['Sa', 'SA'],
                        ['Sb', 'SB'],
                        ['Sc', 'SC'],
                        ['La', 'LA'],
                        ['Lb', 'LB'],
                        ['Lc', 'LC'],
                        ['Ma(-)b(+)c', 'MABC'],
                        ['Ma(-)b', 'MAB'],
                        ['Mc(-)d', 'MCD'],
                    ],
                    value: 'SA',
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
                        params: ['10'],
                    },
                    null,
                ],
                type: 'cheese_change_servo_motor_angle_by',
            },
            paramsKeyMap: {
                PORT: 0,
                VALUE: 1,
            },
            class: 'cheese_servo_motor',
            isNotFor: ['cheese'],
            func(sprite, script) {
                const robot = Entry.Cheese.getRobot();
                return robot ? robot.changeServoMotorAngle(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Cheese.add_servo_output(%1, %2)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    ['Sa', 'SA'],
                                    ['Sb', 'SB'],
                                    ['Sc', 'SC'],
                                    ['La', 'LA'],
                                    ['Lb', 'LB'],
                                    ['Lc', 'LC'],
                                    ['Ma(-)b(+)c', 'MABC'],
                                    ['Ma(-)b', 'MAB'],
                                    ['Mc(-)d', 'MCD'],
                                ],
                                value: 'SA',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                        ],
                    },
                ],
            },
        },
        cheese_set_servo_motor_angle_to: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['Sa', 'SA'],
                        ['Sb', 'SB'],
                        ['Sc', 'SC'],
                        ['La', 'LA'],
                        ['Lb', 'LB'],
                        ['Lc', 'LC'],
                        ['Ma(-)b(+)c', 'MABC'],
                        ['Ma(-)b', 'MAB'],
                        ['Mc(-)d', 'MCD'],
                    ],
                    value: 'SA',
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
                        params: ['0'],
                    },
                    null,
                ],
                type: 'cheese_set_servo_motor_angle_to',
            },
            paramsKeyMap: {
                PORT: 0,
                VALUE: 1,
            },
            class: 'cheese_servo_motor',
            isNotFor: ['cheese'],
            func(sprite, script) {
                const robot = Entry.Cheese.getRobot();
                return robot ? robot.setServoMotorAngle(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Cheese.set_servo_output(%1, %2)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    ['Sa', 'SA'],
                                    ['Sb', 'SB'],
                                    ['Sc', 'SC'],
                                    ['La', 'LA'],
                                    ['Lb', 'LB'],
                                    ['Lc', 'LC'],
                                    ['Ma(-)b(+)c', 'MABC'],
                                    ['Ma(-)b', 'MAB'],
                                    ['Mc(-)d', 'MCD'],
                                ],
                                value: 'SA',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                        ],
                    },
                ],
            },
        },
        cheese_turn_off_servo_motor: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['Sa', 'SA'],
                        ['Sb', 'SB'],
                        ['Sc', 'SC'],
                        ['La', 'LA'],
                        ['Lb', 'LB'],
                        ['Lc', 'LC'],
                        ['Ma(-)b(+)c', 'MABC'],
                        ['Ma(-)b', 'MAB'],
                        ['Mc(-)d', 'MCD'],
                    ],
                    value: 'SA',
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
                params: [
                    null,
                    null,
                ],
                type: 'cheese_turn_off_servo_motor',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'cheese_servo_motor',
            isNotFor: ['cheese'],
            func(sprite, script) {
                const robot = Entry.Cheese.getRobot();
                return robot ? robot.turnOffServoMotor(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Cheese.release_servo(%1)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    ['Sa', 'SA'],
                                    ['Sb', 'SB'],
                                    ['Sc', 'SC'],
                                    ['La', 'LA'],
                                    ['Lb', 'LB'],
                                    ['Lc', 'LC'],
                                    ['Ma(-)b(+)c', 'MABC'],
                                    ['Ma(-)b', 'MAB'],
                                    ['Mc(-)d', 'MCD'],
                                ],
                                value: 'SA',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                        ],
                    },
                ],
            },
        },
        cheese_change_dc_motor_velocity_by: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['Mab', 'MAB'],
                        ['Mcd', 'MCD'],
                    ],
                    value: 'MAB',
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
                        params: ['10'],
                    },
                    null,
                ],
                type: 'cheese_change_dc_motor_velocity_by',
            },
            paramsKeyMap: {
                PORT: 0,
                VALUE: 1,
            },
            class: 'cheese_dc_motor',
            isNotFor: ['cheese'],
            func(sprite, script) {
                const robot = Entry.Cheese.getRobot();
                return robot ? robot.changeDcMotorVelocity(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Cheese.add_dc_output(%1, %2)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    ['Mab', 'MAB'],
                                    ['Mcd', 'MCD'],
                                ],
                                value: 'MAB',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                        ],
                    },
                ],
            },
        },
        cheese_set_dc_motor_velocity_to: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['Mab', 'MAB'],
                        ['Mcd', 'MCD'],
                    ],
                    value: 'MAB',
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
                        params: ['50'],
                    },
                    null,
                ],
                type: 'cheese_set_dc_motor_velocity_to',
            },
            paramsKeyMap: {
                PORT: 0,
                VALUE: 1,
            },
            class: 'cheese_dc_motor',
            isNotFor: ['cheese'],
            func(sprite, script) {
                const robot = Entry.Cheese.getRobot();
                return robot ? robot.setDcMotorVelocity(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Cheese.set_dc_output(%1, %2)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    ['Mab', 'MAB'],
                                    ['Mcd', 'MCD'],
                                ],
                                value: 'MAB',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                        ],
                    },
                ],
            },
        },
        cheese_stop_dc_motor: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['Mab', 'MAB'],
                        ['Mcd', 'MCD'],
                    ],
                    value: 'MAB',
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
                params: [
                    null,
                    null,
                ],
                type: 'cheese_stop_dc_motor',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'cheese_dc_motor',
            isNotFor: ['cheese'],
            func(sprite, script) {
                const robot = Entry.Cheese.getRobot();
                return robot ? robot.stopDcMotor(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Cheese.stop_dc(%1)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    ['Mab', 'MAB'],
                                    ['Mcd', 'MCD'],
                                ],
                                value: 'MAB',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                        ],
                    },
                ],
            },
        },
        cheese_rotate_step_motor: {
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
                        params: ['100'],
                    },
                    {
                        type: 'text',
                        params: ['300'],
                    },
                    null,
                ],
                type: 'cheese_rotate_step_motor',
            },
            paramsKeyMap: {
                STEP: 0,
                VELOCITY: 1,
            },
            class: 'cheese_step_motor',
            isNotFor: ['cheese'],
            func(sprite, script) {
                const robot = Entry.Cheese.getRobot();
                return robot ? robot.rotateStepMotor(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Cheese.rotate_step(%1, %2)',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                        ],
                    },
                ],
            },
        },
        cheese_change_step_motor_velocity_by: {
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
                        params: ['50'],
                    },
                    null,
                ],
                type: 'cheese_change_step_motor_velocity_by',
            },
            paramsKeyMap: {
                VELOCITY: 0,
            },
            class: 'cheese_step_motor',
            isNotFor: ['cheese'],
            func(sprite, script) {
                const robot = Entry.Cheese.getRobot();
                return robot ? robot.changeStepMotorVelocity(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Cheese.add_step_velocity(%1)',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                        ],
                    },
                ],
            },
        },
        cheese_set_step_motor_velocity_to: {
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
                        params: ['50'],
                    },
                    null,
                ],
                type: 'cheese_set_step_motor_velocity_to',
            },
            paramsKeyMap: {
                VELOCITY: 0,
            },
            class: 'cheese_step_motor',
            isNotFor: ['cheese'],
            func(sprite, script) {
                const robot = Entry.Cheese.getRobot();
                return robot ? robot.setStepMotorVelocity(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Cheese.set_step_velocity(%1)',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                        ],
                    },
                ],
            },
        },
        cheese_stop_off_step_motor: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.ROBOID_io_action_stop, 'STOP'],
                        [Lang.Blocks.ROBOID_io_action_turn_off, 'OFF'],
                    ],
                    value: 'STOP',
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
                params: [
                    null,
                    null,
                ],
                type: 'cheese_stop_off_step_motor',
            },
            paramsKeyMap: {
                ACTION: 0,
            },
            class: 'cheese_step_motor',
            isNotFor: ['cheese'],
            func(sprite, script) {
                const robot = Entry.Cheese.getRobot();
                return robot ? robot.stopOffStepMotor(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Cheese.step_motor(%1)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.ROBOID_io_action_stop, 'STOP'],
                                    [Lang.Blocks.ROBOID_io_action_turn_off, 'OFF'],
                                ],
                                value: 'STOP',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                        ],
                    },
                ],
            },
        },
        cheese_set_step_motor_mode_to: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.ROBOID_io_mode_normal, 'NORMAL'],
                        [Lang.Blocks.ROBOID_io_mode_power, 'POWER'],
                    ],
                    value: 'NORMAL',
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
                params: [
                    null,
                    null,
                ],
                type: 'cheese_set_step_motor_mode_to',
            },
            paramsKeyMap: {
                MODE: 0,
            },
            class: 'cheese_step_motor',
            isNotFor: ['cheese'],
            func(sprite, script) {
                const robot = Entry.Cheese.getRobot();
                return robot ? robot.setStepMotorMode(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Cheese.set_step_mode(%1)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.ROBOID_io_mode_normal, 'NORMAL'],
                                    [Lang.Blocks.ROBOID_io_mode_power, 'POWER'],
                                ],
                                value: 'NORMAL',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                        ],
                    },
                ],
            },
        },
        cheese_step_count: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
            ],
            events: {},
            def: {
                params: [null],
                type: 'cheese_step_count',
            },
            paramsKeyMap: {
            },
            class: 'cheese_step_motor',
            isNotFor: ['cheese'],
            func(sprite, script) {
                const robot = Entry.Cheese.getRobot();
                if (robot) {
                    return robot.getStepCount(script);
                }
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Cheese.step_count()',
                        blockType: 'param',
                    },
                ],
            },
        },
        cheese_set_led_to_color: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['L', 'L'],
                        ['S', 'S'],
                    ],
                    value: 'L',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.ROBOID_led_intensity_dark, 'DARK'],
                        [Lang.Blocks.ROBOID_led_intensity_normal, 'NORMAL'],
                        [Lang.Blocks.ROBOID_led_intensity_bright, 'BRIGHT'],
                    ],
                    value: 'NORMAL',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.ROBOID_color_red, 'RED'],
                        [Lang.Blocks.ROBOID_color_orange, 'ORANGE'],
                        [Lang.Blocks.ROBOID_color_yellow, 'YELLOW'],
                        [Lang.Blocks.ROBOID_color_green, 'GREEN'],
                        [Lang.Blocks.ROBOID_color_sky_blue, 'SKY_BLUE'],
                        [Lang.Blocks.ROBOID_color_blue, 'BLUE'],
                        [Lang.Blocks.ROBOID_color_violet, 'VIOLET'],
                        [Lang.Blocks.ROBOID_color_purple, 'PURPLE'],
                        [Lang.Blocks.ROBOID_color_white, 'WHITE'],
                    ],
                    value: 'RED',
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
                params: [
                    null,
                    null,
                    null,
                    null,
                ],
                type: 'cheese_set_led_to_color',
            },
            paramsKeyMap: {
                PORT: 0,
                INTENSITY: 1,
                COLOR: 2,
            },
            class: 'cheese_led',
            isNotFor: ['cheese'],
            func(sprite, script) {
                const robot = Entry.Cheese.getRobot();
                return robot ? robot.setLedColor(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Cheese.set_led(%1, %2 %3)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    ['L', 'L'],
                                    ['S', 'S'],
                                ],
                                value: 'L',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.ROBOID_led_intensity_dark, 'DARK'],
                                    [Lang.Blocks.ROBOID_led_intensity_normal, 'NORMAL'],
                                    [Lang.Blocks.ROBOID_led_intensity_bright, 'BRIGHT'],
                                ],
                                value: 'NORMAL',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.ROBOID_color_red, 'RED'],
                                    [Lang.Blocks.ROBOID_color_orange, 'ORANGE'],
                                    [Lang.Blocks.ROBOID_color_yellow, 'YELLOW'],
                                    [Lang.Blocks.ROBOID_color_green, 'GREEN'],
                                    [Lang.Blocks.ROBOID_color_sky_blue, 'SKY_BLUE'],
                                    [Lang.Blocks.ROBOID_color_blue, 'BLUE'],
                                    [Lang.Blocks.ROBOID_color_violet, 'VIOLET'],
                                    [Lang.Blocks.ROBOID_color_purple, 'PURPLE'],
                                    [Lang.Blocks.ROBOID_color_white, 'WHITE'],
                                ],
                                value: 'RED',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                        ],
                    },
                ],
            },
        },
        cheese_pick_led_to: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['L', 'L'],
                        ['S', 'S'],
                    ],
                    value: 'L',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Color',
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
                    null,
                ],
                type: 'cheese_pick_led_to',
            },
            paramsKeyMap: {
                PORT: 0,
                COLOR: 1,
            },
            class: 'cheese_led',
            isNotFor: ['cheese'],
            func(sprite, script) {
                const robot = Entry.Cheese.getRobot();
                return robot ? robot.setLedRgbArray(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Cheese.pick_led(%1, %2)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    ['L', 'L'],
                                    ['S', 'S'],
                                ],
                                value: 'L',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                            {
                                type: 'Color',
                                converter: Entry.block.converters.returnStringValue,
                            },
                        ],
                    },
                ],
            },
        },
        cheese_change_led_by_rgb: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['L', 'L'],
                        ['S', 'S'],
                    ],
                    value: 'L',
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
                        params: ['10'],
                    },
                    {
                        type: 'text',
                        params: ['0'],
                    },
                    {
                        type: 'text',
                        params: ['0'],
                    },
                    null,
                ],
                type: 'cheese_change_led_by_rgb',
            },
            paramsKeyMap: {
                PORT: 0,
                RED: 1,
                GREEN: 2,
                BLUE: 3,
            },
            class: 'cheese_led',
            isNotFor: ['cheese'],
            func(sprite, script) {
                const robot = Entry.Cheese.getRobot();
                return robot ? robot.changeLedRgb(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Cheese.add_rgb(%1, %2, %3, %4)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    ['L', 'L'],
                                    ['S', 'S'],
                                ],
                                value: 'L',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
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
                        ],
                    },
                ],
            },
        },
        cheese_setLed_to_rgb: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['L', 'L'],
                        ['S', 'S'],
                    ],
                    value: 'L',
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
                        params: ['255'],
                    },
                    {
                        type: 'text',
                        params: ['0'],
                    },
                    {
                        type: 'text',
                        params: ['0'],
                    },
                    null,
                ],
                type: 'cheese_setLed_to_rgb',
            },
            paramsKeyMap: {
                PORT: 0,
                RED: 1,
                GREEN: 2,
                BLUE: 3,
            },
            class: 'cheese_led',
            isNotFor: ['cheese'],
            func(sprite, script) {
                const robot = Entry.Cheese.getRobot();
                return robot ? robot.setLedRgb(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Cheese.set_rgb(%1, %2, %3, %4)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    ['L', 'L'],
                                    ['S', 'S'],
                                ],
                                value: 'L',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
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
                        ],
                    },
                ],
            },
        },
        cheese_clear_led: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['L', 'L'],
                        ['S', 'S'],
                    ],
                    value: 'L',
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
                params: [
                    null,
                    null,
                ],
                type: 'cheese_clear_led',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'cheese_led',
            isNotFor: ['cheese'],
            func(sprite, script) {
                const robot = Entry.Cheese.getRobot();
                return robot ? robot.clearLed(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Cheese.clear_led(%1)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    ['L', 'L'],
                                    ['S', 'S'],
                                ],
                                value: 'L',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                        ],
                    },
                ],
            },
        },
        cheese_set_led_type_to: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['L', 'L'],
                        ['S', 'S'],
                    ],
                    value: 'L',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.ROBOID_led_type_default, 'DEFAULT'],
                        [Lang.Blocks.ROBOID_led_type_crgb, '-RGB'],
                        [Lang.Blocks.ROBOID_led_type_crbg, '-RBG'],
                        [Lang.Blocks.ROBOID_led_type_cgrb, '-GRB'],
                        [Lang.Blocks.ROBOID_led_type_cgbr, '-GBR'],
                        [Lang.Blocks.ROBOID_led_type_cbrg, '-BRG'],
                        [Lang.Blocks.ROBOID_led_type_cbgr, '-BGR'],
                        [Lang.Blocks.ROBOID_led_type_argb, '+RGB'],
                        [Lang.Blocks.ROBOID_led_type_arbg, '+RBG'],
                        [Lang.Blocks.ROBOID_led_type_agrb, '+GRB'],
                        [Lang.Blocks.ROBOID_led_type_agbr, '+GBR'],
                        [Lang.Blocks.ROBOID_led_type_abrg, '+BRG'],
                        [Lang.Blocks.ROBOID_led_type_abgr, '+BGR'],
                    ],
                    value: 'DEFAULT',
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
                params: [
                    null,
                    null,
                    null,
                ],
                type: 'cheese_set_led_type_to',
            },
            paramsKeyMap: {
                PORT: 0,
                TYPE: 1,
            },
            class: 'cheese_led',
            isNotFor: ['cheese'],
            func(sprite, script) {
                const robot = Entry.Cheese.getRobot();
                return robot ? robot.setLedType(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Cheese.set_led_type(%1, %2)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    ['L', 'L'],
                                    ['S', 'S'],
                                ],
                                value: 'L',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.ROBOID_led_type_default, 'DEFAULT'],
                                    [Lang.Blocks.ROBOID_led_type_crgb, '-RGB'],
                                    [Lang.Blocks.ROBOID_led_type_crbg, '-RBG'],
                                    [Lang.Blocks.ROBOID_led_type_cgrb, '-GRB'],
                                    [Lang.Blocks.ROBOID_led_type_cgbr, '-GBR'],
                                    [Lang.Blocks.ROBOID_led_type_cbrg, '-BRG'],
                                    [Lang.Blocks.ROBOID_led_type_cbgr, '-BGR'],
                                    [Lang.Blocks.ROBOID_led_type_argb, '+RGB'],
                                    [Lang.Blocks.ROBOID_led_type_arbg, '+RBG'],
                                    [Lang.Blocks.ROBOID_led_type_agrb, '+GRB'],
                                    [Lang.Blocks.ROBOID_led_type_agbr, '+GBR'],
                                    [Lang.Blocks.ROBOID_led_type_abrg, '+BRG'],
                                    [Lang.Blocks.ROBOID_led_type_abgr, '+BGR'],
                                ],
                                value: 'DEFAULT',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                        ],
                    },
                ],
            },
        },
        cheese_neopixel_set_number_and_type_to: {
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
                    type: 'Dropdown',
                    options: [
                        ['GRB', 'GRB'],
                        ['GRBW', 'GRBW'],
                    ],
                    value: 'GRB',
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
                params: [
                    {
                        type: 'text',
                        params: ['10'],
                    },
                    null,
                    null,
                ],
                type: 'cheese_neopixel_set_number_and_type_to',
            },
            paramsKeyMap: {
                NUMBER: 0,
                TYPE: 1,
            },
            class: 'cheese_neopixel',
            isNotFor: ['cheese'],
            func(sprite, script) {
                const robot = Entry.Cheese.getRobot();
                return robot ? robot.neopixelSetNumberAndType(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Cheese.set_neopixel_number_type(%1, %2)',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                            {
                                type: 'Dropdown',
                                options: [
                                    ['GRB', 'GRB'],
                                    ['GRBW', 'GRBW'],
                                ],
                                value: 'GRB',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                        ],
                    },
                ],
            },
        },
        cheese_neopixel_set_all_leds_to_pattern: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.ROBOID_neopixel_3_colors, 'FILL_3_COLORS'],
                        [Lang.Blocks.ROBOID_neopixel_6_colors, 'FILL_6_COLORS'],
                        [Lang.Blocks.ROBOID_neopixel_12_colors, 'FILL_12_COLORS'],
                        [Lang.Blocks.ROBOID_neopixel_red_green, 'GRADIENT_RED_GREEN'],
                        [Lang.Blocks.ROBOID_neopixel_red_blue, 'GRADIENT_RED_BLUE'],
                        [Lang.Blocks.ROBOID_neopixel_red_white, 'GRADIENT_RED_WHITE'],
                        [Lang.Blocks.ROBOID_neopixel_green_red, 'GRADIENT_GREEN_RED'],
                        [Lang.Blocks.ROBOID_neopixel_green_blue, 'GRADIENT_GREEN_BLUE'],
                        [Lang.Blocks.ROBOID_neopixel_green_white, 'GRADIENT_GREEN_WHITE'],
                        [Lang.Blocks.ROBOID_neopixel_blue_red, 'GRADIENT_BLUE_RED'],
                        [Lang.Blocks.ROBOID_neopixel_blue_green, 'GRADIENT_BLUE_GREEN'],
                        [Lang.Blocks.ROBOID_neopixel_blue_white, 'GRADIENT_BLUE_WHITE'],
                        [Lang.Blocks.ROBOID_neopixel_white_red, 'GRADIENT_WHITE_RED'],
                        [Lang.Blocks.ROBOID_neopixel_white_green, 'GRADIENT_WHITE_GREEN'],
                        [Lang.Blocks.ROBOID_neopixel_white_blue, 'GRADIENT_WHITE_BLUE'],
                        [Lang.Blocks.ROBOID_neopixel_red_black, 'GRADIENT_RED_BLACK'],
                        [Lang.Blocks.ROBOID_neopixel_green_black, 'GRADIENT_GREEN_BLACK'],
                        [Lang.Blocks.ROBOID_neopixel_blue_black, 'GRADIENT_BLUE_BLACK'],
                        [Lang.Blocks.ROBOID_neopixel_white_black, 'GRADIENT_WHITE_BLACK'],
                        [Lang.Blocks.ROBOID_neopixel_black_red, 'GRADIENT_BLACK_RED'],
                        [Lang.Blocks.ROBOID_neopixel_black_green, 'GRADIENT_BLACK_GREEN'],
                        [Lang.Blocks.ROBOID_neopixel_black_blue, 'GRADIENT_BLACK_BLUE'],
                        [Lang.Blocks.ROBOID_neopixel_black_white, 'GRADIENT_BLACK_WHITE'],
                    ],
                    value: 'FILL_3_COLORS',
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
                params: [
                    null,
                    null,
                ],
                type: 'cheese_neopixel_set_all_leds_to_pattern',
            },
            paramsKeyMap: {
                PATTERN: 0,
            },
            class: 'cheese_neopixel',
            isNotFor: ['cheese'],
            func(sprite, script) {
                const robot = Entry.Cheese.getRobot();
                return robot ? robot.neopixelSetAllPattern(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Cheese.set_all_neopixel_pattern(%1)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.ROBOID_neopixel_3_colors, 'FILL_3_COLORS'],
                                    [Lang.Blocks.ROBOID_neopixel_6_colors, 'FILL_6_COLORS'],
                                    [Lang.Blocks.ROBOID_neopixel_12_colors, 'FILL_12_COLORS'],
                                    [Lang.Blocks.ROBOID_neopixel_red_green, 'GRADIENT_RED_GREEN'],
                                    [Lang.Blocks.ROBOID_neopixel_red_blue, 'GRADIENT_RED_BLUE'],
                                    [Lang.Blocks.ROBOID_neopixel_red_white, 'GRADIENT_RED_WHITE'],
                                    [Lang.Blocks.ROBOID_neopixel_green_red, 'GRADIENT_GREEN_RED'],
                                    [Lang.Blocks.ROBOID_neopixel_green_blue, 'GRADIENT_GREEN_BLUE'],
                                    [Lang.Blocks.ROBOID_neopixel_green_white, 'GRADIENT_GREEN_WHITE'],
                                    [Lang.Blocks.ROBOID_neopixel_blue_red, 'GRADIENT_BLUE_RED'],
                                    [Lang.Blocks.ROBOID_neopixel_blue_green, 'GRADIENT_BLUE_GREEN'],
                                    [Lang.Blocks.ROBOID_neopixel_blue_white, 'GRADIENT_BLUE_WHITE'],
                                    [Lang.Blocks.ROBOID_neopixel_white_red, 'GRADIENT_WHITE_RED'],
                                    [Lang.Blocks.ROBOID_neopixel_white_green, 'GRADIENT_WHITE_GREEN'],
                                    [Lang.Blocks.ROBOID_neopixel_white_blue, 'GRADIENT_WHITE_BLUE'],
                                    [Lang.Blocks.ROBOID_neopixel_red_black, 'GRADIENT_RED_BLACK'],
                                    [Lang.Blocks.ROBOID_neopixel_green_black, 'GRADIENT_GREEN_BLACK'],
                                    [Lang.Blocks.ROBOID_neopixel_blue_black, 'GRADIENT_BLUE_BLACK'],
                                    [Lang.Blocks.ROBOID_neopixel_white_black, 'GRADIENT_WHITE_BLACK'],
                                    [Lang.Blocks.ROBOID_neopixel_black_red, 'GRADIENT_BLACK_RED'],
                                    [Lang.Blocks.ROBOID_neopixel_black_green, 'GRADIENT_BLACK_GREEN'],
                                    [Lang.Blocks.ROBOID_neopixel_black_blue, 'GRADIENT_BLACK_BLUE'],
                                    [Lang.Blocks.ROBOID_neopixel_black_white, 'GRADIENT_BLACK_WHITE'],
                                ],
                                value: 'FILL_3_COLORS',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                        ],
                    },
                ],
            },
        },
        cheese_neopixel_set_all_leds_to_color: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.ROBOID_color_red, 'RED'],
                        [Lang.Blocks.ROBOID_color_orange, 'ORANGE'],
                        [Lang.Blocks.ROBOID_color_yellow, 'YELLOW'],
                        [Lang.Blocks.ROBOID_color_green, 'GREEN'],
                        [Lang.Blocks.ROBOID_color_sky_blue, 'SKY_BLUE'],
                        [Lang.Blocks.ROBOID_color_blue, 'BLUE'],
                        [Lang.Blocks.ROBOID_color_violet, 'VIOLET'],
                        [Lang.Blocks.ROBOID_color_purple, 'PURPLE'],
                        [Lang.Blocks.ROBOID_color_white, 'WHITE'],
                    ],
                    value: 'RED',
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
                params: [
                    null,
                    null,
                ],
                type: 'cheese_neopixel_set_all_leds_to_color',
            },
            paramsKeyMap: {
                COLOR: 0,
            },
            class: 'cheese_neopixel',
            isNotFor: ['cheese'],
            func(sprite, script) {
                const robot = Entry.Cheese.getRobot();
                return robot ? robot.neopixelSetAllColor(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Cheese.set_all_neopixel(%1)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.ROBOID_color_red, 'RED'],
                                    [Lang.Blocks.ROBOID_color_orange, 'ORANGE'],
                                    [Lang.Blocks.ROBOID_color_yellow, 'YELLOW'],
                                    [Lang.Blocks.ROBOID_color_green, 'GREEN'],
                                    [Lang.Blocks.ROBOID_color_sky_blue, 'SKY_BLUE'],
                                    [Lang.Blocks.ROBOID_color_blue, 'BLUE'],
                                    [Lang.Blocks.ROBOID_color_violet, 'VIOLET'],
                                    [Lang.Blocks.ROBOID_color_purple, 'PURPLE'],
                                    [Lang.Blocks.ROBOID_color_white, 'WHITE'],
                                ],
                                value: 'RED',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                        ],
                    },
                ],
            },
        },
        cheese_neopixel_pick_all_leds_to: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Color',
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
                ],
                type: 'cheese_neopixel_pick_all_leds_to',
            },
            paramsKeyMap: {
                COLOR: 0,
            },
            class: 'cheese_neopixel',
            isNotFor: ['cheese'],
            func(sprite, script) {
                const robot = Entry.Cheese.getRobot();
                return robot ? robot.neopixelSetAllRgbArray(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Cheese.pick_all_neopixel(%1)',
                        textParams: [
                            {
                                type: 'Color',
                                converter: Entry.block.converters.returnStringValue,
                            },
                        ],
                    },
                ],
            },
        },
        cheese_neopixel_change_all_leds_by_rgb: {
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
                        params: ['10'],
                    },
                    {
                        type: 'text',
                        params: ['0'],
                    },
                    {
                        type: 'text',
                        params: ['0'],
                    },
                    null,
                ],
                type: 'cheese_neopixel_change_all_leds_by_rgb',
            },
            paramsKeyMap: {
                RED: 0,
                GREEN: 1,
                BLUE: 2,
            },
            class: 'cheese_neopixel',
            isNotFor: ['cheese'],
            func(sprite, script) {
                const robot = Entry.Cheese.getRobot();
                return robot ? robot.neopixelChangeAllRgb(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Cheese.add_all_neopixel_rgb(%1, %2, %3)',
                        textParams: [
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
                        ],
                    },
                ],
            },
        },
        cheese_neopixel_set_all_leds_to_rgb: {
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
                        params: ['255'],
                    },
                    {
                        type: 'text',
                        params: ['0'],
                    },
                    {
                        type: 'text',
                        params: ['0'],
                    },
                    null,
                ],
                type: 'cheese_neopixel_set_all_leds_to_rgb',
            },
            paramsKeyMap: {
                RED: 0,
                GREEN: 1,
                BLUE: 2,
            },
            class: 'cheese_neopixel',
            isNotFor: ['cheese'],
            func(sprite, script) {
                const robot = Entry.Cheese.getRobot();
                return robot ? robot.neopixelSetAllRgb(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Cheese.set_all_neopixel_rgb(%1, %2, %3)',
                        textParams: [
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
                        ],
                    },
                ],
            },
        },
        cheese_neopixel_clear_all_leds: {
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
                params: [
                    null,
                ],
                type: 'cheese_neopixel_clear_all_leds',
            },
            paramsKeyMap: {
            },
            class: 'cheese_neopixel',
            isNotFor: ['cheese'],
            func(sprite, script) {
                const robot = Entry.Cheese.getRobot();
                return robot ? robot.neopixelClearAll(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Cheese.clear_all_neopixel()',
                    },
                ],
            },
        },
        cheese_neopixel_set_led_to_color: {
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
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.ROBOID_color_red, 'RED'],
                        [Lang.Blocks.ROBOID_color_orange, 'ORANGE'],
                        [Lang.Blocks.ROBOID_color_yellow, 'YELLOW'],
                        [Lang.Blocks.ROBOID_color_green, 'GREEN'],
                        [Lang.Blocks.ROBOID_color_sky_blue, 'SKY_BLUE'],
                        [Lang.Blocks.ROBOID_color_blue, 'BLUE'],
                        [Lang.Blocks.ROBOID_color_violet, 'VIOLET'],
                        [Lang.Blocks.ROBOID_color_purple, 'PURPLE'],
                        [Lang.Blocks.ROBOID_color_white, 'WHITE'],
                    ],
                    value: 'RED',
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
                params: [
                    {
                        type: 'text',
                        params: ['1'],
                    },
                    null,
                    null,
                ],
                type: 'cheese_neopixel_set_led_to_color',
            },
            paramsKeyMap: {
                PIXEL: 0,
                COLOR: 1,
            },
            class: 'cheese_neopixel',
            isNotFor: ['cheese'],
            func(sprite, script) {
                const robot = Entry.Cheese.getRobot();
                return robot ? robot.neopixelSetLedColor(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Cheese.set_neopixel(%1, %2)',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.ROBOID_color_red, 'RED'],
                                    [Lang.Blocks.ROBOID_color_orange, 'ORANGE'],
                                    [Lang.Blocks.ROBOID_color_yellow, 'YELLOW'],
                                    [Lang.Blocks.ROBOID_color_green, 'GREEN'],
                                    [Lang.Blocks.ROBOID_color_sky_blue, 'SKY_BLUE'],
                                    [Lang.Blocks.ROBOID_color_blue, 'BLUE'],
                                    [Lang.Blocks.ROBOID_color_violet, 'VIOLET'],
                                    [Lang.Blocks.ROBOID_color_purple, 'PURPLE'],
                                    [Lang.Blocks.ROBOID_color_white, 'WHITE'],
                                ],
                                value: 'RED',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                        ],
                    },
                ],
            },
        },
        cheese_neopixel_pick_led_to: {
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
                    type: 'Color',
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
                    null,
                ],
                type: 'cheese_neopixel_pick_led_to',
            },
            paramsKeyMap: {
                PIXEL: 0,
                COLOR: 1,
            },
            class: 'cheese_neopixel',
            isNotFor: ['cheese'],
            func(sprite, script) {
                const robot = Entry.Cheese.getRobot();
                return robot ? robot.neopixelSetLedRgbArray(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Cheese.pick_neopixel(%1, %2)',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                            {
                                type: 'Color',
                                converter: Entry.block.converters.returnStringValue,
                            },
                        ],
                    },
                ],
            },
        },
        cheese_neopixel_change_led_by_rgb: {
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
                        type: 'text',
                        params: ['1'],
                    },
                    {
                        type: 'text',
                        params: ['10'],
                    },
                    {
                        type: 'text',
                        params: ['0'],
                    },
                    {
                        type: 'text',
                        params: ['0'],
                    },
                    null,
                ],
                type: 'cheese_neopixel_change_led_by_rgb',
            },
            paramsKeyMap: {
                PIXEL: 0,
                RED: 1,
                GREEN: 2,
                BLUE: 3,
            },
            class: 'cheese_neopixel',
            isNotFor: ['cheese'],
            func(sprite, script) {
                const robot = Entry.Cheese.getRobot();
                return robot ? robot.neopixelChangeLedRgb(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Cheese.add_neopixel_rgb(%1, %2, %3, %4)',
                        textParams: [
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
                        ],
                    },
                ],
            },
        },
        cheese_neopixel_set_led_to_rgb: {
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
                        type: 'text',
                        params: ['1'],
                    },
                    {
                        type: 'text',
                        params: ['255'],
                    },
                    {
                        type: 'text',
                        params: ['0'],
                    },
                    {
                        type: 'text',
                        params: ['0'],
                    },
                    null,
                ],
                type: 'cheese_neopixel_set_led_to_rgb',
            },
            paramsKeyMap: {
                PIXEL: 0,
                RED: 1,
                GREEN: 2,
                BLUE: 3,
            },
            class: 'cheese_neopixel',
            isNotFor: ['cheese'],
            func(sprite, script) {
                const robot = Entry.Cheese.getRobot();
                return robot ? robot.neopixelSetLedRgb(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Cheese.set_neopixel_rgb(%1, %2, %3, %4)',
                        textParams: [
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
                        ],
                    },
                ],
            },
        },
        cheese_neopixel_clear_led: {
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
                type: 'cheese_neopixel_clear_led',
            },
            paramsKeyMap: {
                PIXEL: 0,
            },
            class: 'cheese_neopixel',
            isNotFor: ['cheese'],
            func(sprite, script) {
                const robot = Entry.Cheese.getRobot();
                return robot ? robot.neopixelClearLed(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Cheese.clear_neopixel(%1)',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                        ],
                    },
                ],
            },
        },
        cheese_neopixel_set_led_range_to_pattern: {
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
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.ROBOID_neopixel_3_colors, 'FILL_3_COLORS'],
                        [Lang.Blocks.ROBOID_neopixel_6_colors, 'FILL_6_COLORS'],
                        [Lang.Blocks.ROBOID_neopixel_12_colors, 'FILL_12_COLORS'],
                        [Lang.Blocks.ROBOID_neopixel_red_green, 'GRADIENT_RED_GREEN'],
                        [Lang.Blocks.ROBOID_neopixel_red_blue, 'GRADIENT_RED_BLUE'],
                        [Lang.Blocks.ROBOID_neopixel_red_white, 'GRADIENT_RED_WHITE'],
                        [Lang.Blocks.ROBOID_neopixel_green_red, 'GRADIENT_GREEN_RED'],
                        [Lang.Blocks.ROBOID_neopixel_green_blue, 'GRADIENT_GREEN_BLUE'],
                        [Lang.Blocks.ROBOID_neopixel_green_white, 'GRADIENT_GREEN_WHITE'],
                        [Lang.Blocks.ROBOID_neopixel_blue_red, 'GRADIENT_BLUE_RED'],
                        [Lang.Blocks.ROBOID_neopixel_blue_green, 'GRADIENT_BLUE_GREEN'],
                        [Lang.Blocks.ROBOID_neopixel_blue_white, 'GRADIENT_BLUE_WHITE'],
                        [Lang.Blocks.ROBOID_neopixel_white_red, 'GRADIENT_WHITE_RED'],
                        [Lang.Blocks.ROBOID_neopixel_white_green, 'GRADIENT_WHITE_GREEN'],
                        [Lang.Blocks.ROBOID_neopixel_white_blue, 'GRADIENT_WHITE_BLUE'],
                        [Lang.Blocks.ROBOID_neopixel_red_black, 'GRADIENT_RED_BLACK'],
                        [Lang.Blocks.ROBOID_neopixel_green_black, 'GRADIENT_GREEN_BLACK'],
                        [Lang.Blocks.ROBOID_neopixel_blue_black, 'GRADIENT_BLUE_BLACK'],
                        [Lang.Blocks.ROBOID_neopixel_white_black, 'GRADIENT_WHITE_BLACK'],
                        [Lang.Blocks.ROBOID_neopixel_black_red, 'GRADIENT_BLACK_RED'],
                        [Lang.Blocks.ROBOID_neopixel_black_green, 'GRADIENT_BLACK_GREEN'],
                        [Lang.Blocks.ROBOID_neopixel_black_blue, 'GRADIENT_BLACK_BLUE'],
                        [Lang.Blocks.ROBOID_neopixel_black_white, 'GRADIENT_BLACK_WHITE'],
                    ],
                    value: 'FILL_3_COLORS',
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
                params: [
                    {
                        type: 'text',
                        params: ['1'],
                    },
                    {
                        type: 'text',
                        params: ['10'],
                    },
                    null,
                    null,
                ],
                type: 'cheese_neopixel_set_led_range_to_pattern',
            },
            paramsKeyMap: {
                START: 0,
                END: 1,
                PATTERN: 2,
            },
            class: 'cheese_neopixel',
            isNotFor: ['cheese'],
            func(sprite, script) {
                const robot = Entry.Cheese.getRobot();
                return robot ? robot.neopixelSetRangePattern(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Cheese.set_neopixel_range_pattern(%1, %2, %3)',
                        textParams: [
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
                                    [Lang.Blocks.ROBOID_neopixel_3_colors, 'FILL_3_COLORS'],
                                    [Lang.Blocks.ROBOID_neopixel_6_colors, 'FILL_6_COLORS'],
                                    [Lang.Blocks.ROBOID_neopixel_12_colors, 'FILL_12_COLORS'],
                                    [Lang.Blocks.ROBOID_neopixel_red_green, 'GRADIENT_RED_GREEN'],
                                    [Lang.Blocks.ROBOID_neopixel_red_blue, 'GRADIENT_RED_BLUE'],
                                    [Lang.Blocks.ROBOID_neopixel_red_white, 'GRADIENT_RED_WHITE'],
                                    [Lang.Blocks.ROBOID_neopixel_green_red, 'GRADIENT_GREEN_RED'],
                                    [Lang.Blocks.ROBOID_neopixel_green_blue, 'GRADIENT_GREEN_BLUE'],
                                    [Lang.Blocks.ROBOID_neopixel_green_white, 'GRADIENT_GREEN_WHITE'],
                                    [Lang.Blocks.ROBOID_neopixel_blue_red, 'GRADIENT_BLUE_RED'],
                                    [Lang.Blocks.ROBOID_neopixel_blue_green, 'GRADIENT_BLUE_GREEN'],
                                    [Lang.Blocks.ROBOID_neopixel_blue_white, 'GRADIENT_BLUE_WHITE'],
                                    [Lang.Blocks.ROBOID_neopixel_white_red, 'GRADIENT_WHITE_RED'],
                                    [Lang.Blocks.ROBOID_neopixel_white_green, 'GRADIENT_WHITE_GREEN'],
                                    [Lang.Blocks.ROBOID_neopixel_white_blue, 'GRADIENT_WHITE_BLUE'],
                                    [Lang.Blocks.ROBOID_neopixel_red_black, 'GRADIENT_RED_BLACK'],
                                    [Lang.Blocks.ROBOID_neopixel_green_black, 'GRADIENT_GREEN_BLACK'],
                                    [Lang.Blocks.ROBOID_neopixel_blue_black, 'GRADIENT_BLUE_BLACK'],
                                    [Lang.Blocks.ROBOID_neopixel_white_black, 'GRADIENT_WHITE_BLACK'],
                                    [Lang.Blocks.ROBOID_neopixel_black_red, 'GRADIENT_BLACK_RED'],
                                    [Lang.Blocks.ROBOID_neopixel_black_green, 'GRADIENT_BLACK_GREEN'],
                                    [Lang.Blocks.ROBOID_neopixel_black_blue, 'GRADIENT_BLACK_BLUE'],
                                    [Lang.Blocks.ROBOID_neopixel_black_white, 'GRADIENT_BLACK_WHITE'],
                                ],
                                value: 'FILL_3_COLORS',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                        ],
                    },
                ],
            },
        },
        cheese_neopixel_set_led_range_to_color: {
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
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.ROBOID_color_red, 'RED'],
                        [Lang.Blocks.ROBOID_color_orange, 'ORANGE'],
                        [Lang.Blocks.ROBOID_color_yellow, 'YELLOW'],
                        [Lang.Blocks.ROBOID_color_green, 'GREEN'],
                        [Lang.Blocks.ROBOID_color_sky_blue, 'SKY_BLUE'],
                        [Lang.Blocks.ROBOID_color_blue, 'BLUE'],
                        [Lang.Blocks.ROBOID_color_violet, 'VIOLET'],
                        [Lang.Blocks.ROBOID_color_purple, 'PURPLE'],
                        [Lang.Blocks.ROBOID_color_white, 'WHITE'],
                    ],
                    value: 'RED',
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
                params: [
                    {
                        type: 'text',
                        params: ['1'],
                    },
                    {
                        type: 'text',
                        params: ['10'],
                    },
                    {
                        type: 'text',
                        params: ['2'],
                    },
                    null,
                    null,
                ],
                type: 'cheese_neopixel_set_led_range_to_color',
            },
            paramsKeyMap: {
                START: 0,
                END: 1,
                INCREMENT: 2,
                COLOR: 3,
            },
            class: 'cheese_neopixel',
            isNotFor: ['cheese'],
            func(sprite, script) {
                const robot = Entry.Cheese.getRobot();
                return robot ? robot.neopixelSetRangeColor(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Cheese.set_neopixel_range(%1, %2, %3, %4)',
                        textParams: [
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
                                    [Lang.Blocks.ROBOID_color_red, 'RED'],
                                    [Lang.Blocks.ROBOID_color_orange, 'ORANGE'],
                                    [Lang.Blocks.ROBOID_color_yellow, 'YELLOW'],
                                    [Lang.Blocks.ROBOID_color_green, 'GREEN'],
                                    [Lang.Blocks.ROBOID_color_sky_blue, 'SKY_BLUE'],
                                    [Lang.Blocks.ROBOID_color_blue, 'BLUE'],
                                    [Lang.Blocks.ROBOID_color_violet, 'VIOLET'],
                                    [Lang.Blocks.ROBOID_color_purple, 'PURPLE'],
                                    [Lang.Blocks.ROBOID_color_white, 'WHITE'],
                                ],
                                value: 'RED',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                        ],
                    },
                ],
            },
        },
        cheese_neopixel_pick_led_range_to: {
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
                    type: 'Color',
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
                        params: ['10'],
                    },
                    {
                        type: 'text',
                        params: ['2'],
                    },
                    null,
                    null,
                ],
                type: 'cheese_neopixel_pick_led_range_to',
            },
            paramsKeyMap: {
                START: 0,
                END: 1,
                INCREMENT: 2,
                COLOR: 3,
            },
            class: 'cheese_neopixel',
            isNotFor: ['cheese'],
            func(sprite, script) {
                const robot = Entry.Cheese.getRobot();
                return robot ? robot.neopixelSetRangeRgbArray(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Cheese.pick_neopixel_range(%1, %2, %3, %4)',
                        textParams: [
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
                                type: 'Color',
                                converter: Entry.block.converters.returnStringValue,
                            },
                        ],
                    },
                ],
            },
        },
        cheese_neopixel_change_led_range_by_rgb: {
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
                        params: ['10'],
                    },
                    {
                        type: 'text',
                        params: ['2'],
                    },
                    {
                        type: 'text',
                        params: ['10'],
                    },
                    {
                        type: 'text',
                        params: ['0'],
                    },
                    {
                        type: 'text',
                        params: ['0'],
                    },
                    null,
                ],
                type: 'cheese_neopixel_change_led_range_by_rgb',
            },
            paramsKeyMap: {
                START: 0,
                END: 1,
                INCREMENT: 2,
                RED: 3,
                GREEN: 4,
                BLUE: 5,
            },
            class: 'cheese_neopixel',
            isNotFor: ['cheese'],
            func(sprite, script) {
                const robot = Entry.Cheese.getRobot();
                return robot ? robot.neopixelChangeRangeRgb(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Cheese.add_neopixel_range_rgb(%1, %2, %3, %4, %5, %6)',
                        textParams: [
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
                                type: 'Block',
                                accept: 'string',
                            },
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                        ],
                    },
                ],
            },
        },
        cheese_neopixel_set_led_range_to_rgb: {
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
                        params: ['10'],
                    },
                    {
                        type: 'text',
                        params: ['2'],
                    },
                    {
                        type: 'text',
                        params: ['255'],
                    },
                    {
                        type: 'text',
                        params: ['0'],
                    },
                    {
                        type: 'text',
                        params: ['0'],
                    },
                    null,
                ],
                type: 'cheese_neopixel_set_led_range_to_rgb',
            },
            paramsKeyMap: {
                START: 0,
                END: 1,
                INCREMENT: 2,
                RED: 3,
                GREEN: 4,
                BLUE: 5,
            },
            class: 'cheese_neopixel',
            isNotFor: ['cheese'],
            func(sprite, script) {
                const robot = Entry.Cheese.getRobot();
                return robot ? robot.neopixelSetRangeRgb(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Cheese.set_neopixel_range_rgb(%1, %2, %3, %4, %5, %6)',
                        textParams: [
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
                                type: 'Block',
                                accept: 'string',
                            },
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                        ],
                    },
                ],
            },
        },
        cheese_neopixel_clear_led_range: {
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
                        params: ['1'],
                    },
                    {
                        type: 'text',
                        params: ['10'],
                    },
                    {
                        type: 'text',
                        params: ['2'],
                    },
                    null,
                ],
                type: 'cheese_neopixel_clear_led_range',
            },
            paramsKeyMap: {
                START: 0,
                END: 1,
                INCREMENT: 2,
            },
            class: 'cheese_neopixel',
            isNotFor: ['cheese'],
            func(sprite, script) {
                const robot = Entry.Cheese.getRobot();
                return robot ? robot.neopixelClearRange(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Cheese.clear_neopixel_range(%1, %2, %3)',
                        textParams: [
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
                        ],
                    },
                ],
            },
        },
        cheese_neopixel_shift: {
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
                type: 'cheese_neopixel_shift',
            },
            paramsKeyMap: {
                BIT: 0,
            },
            class: 'cheese_neopixel',
            isNotFor: ['cheese'],
            func(sprite, script) {
                const robot = Entry.Cheese.getRobot();
                return robot ? robot.neopixelShift(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Cheese.shift_neopixel(%1)',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                        ],
                    },
                ],
            },
        },
        cheese_neopixel_rotate: {
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
                type: 'cheese_neopixel_rotate',
            },
            paramsKeyMap: {
                BIT: 0,
            },
            class: 'cheese_neopixel',
            isNotFor: ['cheese'],
            func(sprite, script) {
                const robot = Entry.Cheese.getRobot();
                return robot ? robot.neopixelRotate(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Cheese.rotate_neopixel(%1)',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                        ],
                    },
                ],
            },
        },
        cheese_neopixel_change_brightness_by: {
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
                        params: ['10'],
                    },
                    null,
                ],
                type: 'cheese_neopixel_change_brightness_by',
            },
            paramsKeyMap: {
                VALUE: 0,
            },
            class: 'cheese_neopixel',
            isNotFor: ['cheese'],
            func(sprite, script) {
                const robot = Entry.Cheese.getRobot();
                return robot ? robot.neopixelChangeBrightness(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Cheese.add_neopixel_brightness(%1)',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                        ],
                    },
                ],
            },
        },
        cheese_neopixel_set_brightness_to: {
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
                        params: ['50'],
                    },
                    null,
                ],
                type: 'cheese_neopixel_set_brightness_to',
            },
            paramsKeyMap: {
                VALUE: 0,
            },
            class: 'cheese_neopixel',
            isNotFor: ['cheese'],
            func(sprite, script) {
                const robot = Entry.Cheese.getRobot();
                return robot ? robot.neopixelSetBrightness(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Cheese.set_neopixel_brightness(%1)',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                        ],
                    },
                ],
            },
        },
        cheese_write_serial: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.ROBOID_serial_string, 'STRING'],
                        [Lang.Blocks.ROBOID_serial_string_line, 'STRING_LINE'],
                    ],
                    value: 'STRING',
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
                        params: ['abc123'],
                    },
                    null,
                ],
                type: 'cheese_write_serial',
            },
            paramsKeyMap: {
                MODE: 0,
                STRING: 1,
            },
            class: 'cheese_serial',
            isNotFor: ['cheese'],
            func(sprite, script) {
                const robot = Entry.Cheese.getRobot();
                return robot ? robot.writeSerial(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Cheese.write_serial(%1, %2)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.ROBOID_serial_string, 'STRING'],
                                    [Lang.Blocks.ROBOID_serial_string_line, 'STRING_LINE'],
                                ],
                                value: 'STRING',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                        ],
                    },
                ],
            },
        },
        cheese_read_serial_until: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.ROBOID_serial_all, 'ALL'],
                        [Lang.Blocks.ROBOID_serial_until_comma, 'COMMA'],
                        [Lang.Blocks.ROBOID_serial_until_colon, 'COLON'],
                        [Lang.Blocks.ROBOID_serial_until_dollar, 'DOLLAR'],
                        [Lang.Blocks.ROBOID_serial_until_sharp, 'SHARP'],
                        [Lang.Blocks.ROBOID_serial_until_new_line, 'NEW_LINE'],
                    ],
                    value: 'ALL',
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
                params: [
                    null,
                    null,
                ],
                type: 'cheese_read_serial_until',
            },
            paramsKeyMap: {
                DELIMITER: 0,
            },
            class: 'cheese_serial',
            isNotFor: ['cheese'],
            func(sprite, script) {
                const robot = Entry.Cheese.getRobot();
                return robot ? robot.readSerialUntil(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Cheese.read_serial(%1)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.ROBOID_serial_all, 'ALL'],
                                    [Lang.Blocks.ROBOID_serial_until_comma, 'COMMA'],
                                    [Lang.Blocks.ROBOID_serial_until_colon, 'COLON'],
                                    [Lang.Blocks.ROBOID_serial_until_dollar, 'DOLLAR'],
                                    [Lang.Blocks.ROBOID_serial_until_sharp, 'SHARP'],
                                    [Lang.Blocks.ROBOID_serial_until_new_line, 'NEW_LINE'],
                                ],
                                value: 'ALL',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                        ],
                    },
                ],
            },
        },
        cheese_set_serial_port_to: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.ROBOID_serial_port_wa_rb, 'WRITE_READ'],
                        [Lang.Blocks.ROBOID_serial_port_ra_wb, 'READ_WRITE'],
                        [Lang.Blocks.ROBOID_serial_port_wa, 'WRITE'],
                        [Lang.Blocks.ROBOID_serial_port_ra, 'READ'],
                    ],
                    value: 'WRITE_READ',
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
                params: [
                    null,
                    null,
                ],
                type: 'cheese_set_serial_port_to',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'cheese_serial',
            isNotFor: ['cheese'],
            func(sprite, script) {
                const robot = Entry.Cheese.getRobot();
                return robot ? robot.setSerialPort(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Cheese.set_serial_port(%1)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.ROBOID_serial_port_wa_rb, 'WRITE_READ'],
                                    [Lang.Blocks.ROBOID_serial_port_ra_wb, 'READ_WRITE'],
                                    [Lang.Blocks.ROBOID_serial_port_wa, 'WRITE'],
                                    [Lang.Blocks.ROBOID_serial_port_ra, 'READ'],
                                ],
                                value: 'WRITE_READ',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                        ],
                    },
                ],
            },
        },
        cheese_set_serial_rate_to: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['9600', '9600'],
                        ['14400', '14400'],
                        ['19200', '19200'],
                        ['28800', '28800'],
                        ['38400', '38400'],
                        ['57600', '57600'],
                        ['76800', '76800'],
                        ['115200', '115200'],
                    ],
                    value: '9600',
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
                params: [
                    null,
                    null,
                ],
                type: 'cheese_set_serial_rate_to',
            },
            paramsKeyMap: {
                BAUD: 0,
            },
            class: 'cheese_serial',
            isNotFor: ['cheese'],
            func(sprite, script) {
                const robot = Entry.Cheese.getRobot();
                return robot ? robot.setSerialRate(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Cheese.set_serial_rate(%1)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    ['9600', '9600'],
                                    ['14400', '14400'],
                                    ['19200', '19200'],
                                    ['28800', '28800'],
                                    ['38400', '38400'],
                                    ['57600', '57600'],
                                    ['76800', '76800'],
                                    ['115200', '115200'],
                                ],
                                value: '9600',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringOrNumberByValue,
                            },
                        ],
                    },
                ],
            },
        },
        cheese_serial_input: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
            ],
            events: {},
            def: {
                params: [
                ],
                type: 'cheese_serial_input',
            },
            paramsKeyMap: {
            },
            class: 'cheese_serial',
            isNotFor: ['cheese'],
            func(sprite, script) {
                const robot = Entry.Cheese.getRobot();
                if (robot) {
                    return robot.getSerialInput(script);
                }
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Cheese.serial_input()',
                        blockType: 'param',
                    },
                ],
            },
        },
        cheese_pid_start: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.ROBOID_pid_10, '10'],
                        [Lang.Blocks.ROBOID_pid_11_1, '11-1'],
                        [Lang.Blocks.ROBOID_pid_11_2, '11-2'],
                        [Lang.Blocks.ROBOID_pid_11_3, '11-3'],
                        [Lang.Blocks.ROBOID_pid_12, '12'],
                        [Lang.Blocks.ROBOID_pid_13, '13'],
                        [Lang.Blocks.ROBOID_pid_14, '14'],
//                        [Lang.Blocks.ROBOID_pid_15, '15'],
                        [Lang.Blocks.ROBOID_pid_16, '16'],
                    ],
                    value: '10',
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
                params: [
                    null,
                    null,
                ],
                type: 'cheese_pid_start',
            },
            paramsKeyMap: {
                DEVICE: 0,
            },
            class: 'cheese_pid',
            isNotFor: ['cheese'],
            func(sprite, script) {
                const robot = Entry.Cheese.getRobot();
                return robot ? robot.pidStart(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Cheese.pid_start(%1)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.ROBOID_pid_10, '10'],
                                    [Lang.Blocks.ROBOID_pid_11_1, '11-1'],
                                    [Lang.Blocks.ROBOID_pid_11_2, '11-2'],
                                    [Lang.Blocks.ROBOID_pid_11_3, '11-3'],
                                    [Lang.Blocks.ROBOID_pid_12, '12'],
                                    [Lang.Blocks.ROBOID_pid_13, '13'],
                                    [Lang.Blocks.ROBOID_pid_14, '14'],
//                                    [Lang.Blocks.ROBOID_pid_15, '15'],
                                    [Lang.Blocks.ROBOID_pid_16, '16'],
                                ],
                                value: '10',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                        ],
                    },
                ],
            },
        },
        cheese_pid_set_range_to: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.ROBOID_pid_x1, 'X1'],
                        [Lang.Blocks.ROBOID_pid_y1, 'Y1'],
                        [Lang.Blocks.ROBOID_pid_x2, 'X2'],
                        [Lang.Blocks.ROBOID_pid_y2, 'Y2'],
                    ],
                    value: 'X1',
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
                        [Lang.Blocks.ROBOID_range_integer, 'INTEGER'],
                        [Lang.Blocks.ROBOID_range_real, 'REAL'],
                    ],
                    value: 'INTEGER',
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
                params: [
                    null,
                    {
                        type: 'text',
                        params: ['0'],
                    },
                    {
                        type: 'text',
                        params: ['255'],
                    },
                    {
                        type: 'text',
                        params: ['0'],
                    },
                    {
                        type: 'text',
                        params: ['100'],
                    },
                    null,
                    null,
                ],
                type: 'cheese_pid_set_range_to',
            },
            paramsKeyMap: {
                INPUT: 0,
                LOW1: 1,
                HIGH1: 2,
                LOW2: 3,
                HIGH2: 4,
                DECIMAL: 5,
            },
            class: 'cheese_pid',
            isNotFor: ['cheese'],
            func(sprite, script) {
                const robot = Entry.Cheese.getRobot();
                return robot ? robot.pidSetRangeTo(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Cheese.pid_set_input_range(%1, %2, %3, %4, %5, %6)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.ROBOID_pid_x1, 'X1'],
                                    [Lang.Blocks.ROBOID_pid_y1, 'Y1'],
                                    [Lang.Blocks.ROBOID_pid_x2, 'X2'],
                                    [Lang.Blocks.ROBOID_pid_y2, 'Y2'],
                                ],
                                value: 'X1',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
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
                                type: 'Block',
                                accept: 'string',
                            },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.ROBOID_range_integer, 'INTEGER'],
                                    [Lang.Blocks.ROBOID_range_real, 'REAL'],
                                ],
                                value: 'INTEGER',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                            },
                        ],
                    },
                ],
            },
        },
        cheese_pid_set_three_ranges_to: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.ROBOID_pid_x1, 'X1'],
                        [Lang.Blocks.ROBOID_pid_y1, 'Y1'],
                        [Lang.Blocks.ROBOID_pid_x2, 'X2'],
                        [Lang.Blocks.ROBOID_pid_y2, 'Y2'],
                    ],
                    value: 'X1',
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
                        [Lang.Blocks.ROBOID_range_integer, 'INTEGER'],
                        [Lang.Blocks.ROBOID_range_real, 'REAL'],
                    ],
                    value: 'INTEGER',
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
                params: [
                    null,
                    {
                        type: 'text',
                        params: ['0'],
                    },
                    {
                        type: 'text',
                        params: ['127'],
                    },
                    {
                        type: 'text',
                        params: ['255'],
                    },
                    {
                        type: 'text',
                        params: ['-100'],
                    },
                    {
                        type: 'text',
                        params: ['0'],
                    },
                    {
                        type: 'text',
                        params: ['100'],
                    },
                    null,
                    null,
                ],
                type: 'cheese_pid_set_three_ranges_to',
            },
            paramsKeyMap: {
                INPUT: 0,
                LOW1: 1,
                MIDDLE1: 2,
                HIGH1: 3,
                LOW2: 4,
                MIDDLE2: 5,
                HIGH2: 6,
                DECIMAL: 7,
            },
            class: 'cheese_pid',
            isNotFor: ['cheese'],
            func(sprite, script) {
                const robot = Entry.Cheese.getRobot();
                return robot ? robot.pidSetThreeRangesTo(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Cheese.pid_set_input_range_middle(%1, %2, %3, %4, %5, %6, %7, %8)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.ROBOID_pid_x1, 'X1'],
                                    [Lang.Blocks.ROBOID_pid_y1, 'Y1'],
                                    [Lang.Blocks.ROBOID_pid_x2, 'X2'],
                                    [Lang.Blocks.ROBOID_pid_y2, 'Y2'],
                                ],
                                value: 'X1',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
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
                                    [Lang.Blocks.ROBOID_range_integer, 'INTEGER'],
                                    [Lang.Blocks.ROBOID_range_real, 'REAL'],
                                ],
                                value: 'INTEGER',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                            },
                        ],
                    },
                ],
            },
        },
        cheese_pid_reset_encoder: {
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
                params: [
                    null,
                ],
                type: 'cheese_pid_reset_encoder',
            },
            paramsKeyMap: {
            },
            class: 'cheese_pid',
            isNotFor: ['cheese'],
            func(sprite, script) {
                const robot = Entry.Cheese.getRobot();
                return robot ? robot.pidResetEncoder(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Cheese.pid_reset_encoder()',
                    },
                ],
            },
        },
        cheese_pid_input: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.ROBOID_pid_distance, 'DISTANCE'],
                        [Lang.Blocks.ROBOID_pid_temperature, 'TEMPERATURE'],
                        [Lang.Blocks.ROBOID_pid_humidity, 'HUMIDITY'],
                        [Lang.Blocks.ROBOID_pid_x1, 'X1'],
                        [Lang.Blocks.ROBOID_pid_y1, 'Y1'],
                        [Lang.Blocks.ROBOID_pid_x2, 'X2'],
                        [Lang.Blocks.ROBOID_pid_y2, 'Y2'],
                        [Lang.Blocks.ROBOID_pid_button1, 'BUTTON1'],
                        [Lang.Blocks.ROBOID_pid_button2, 'BUTTON2'],
                        [Lang.Blocks.ROBOID_pid_encoder, 'ENCODER'],
                    ],
                    value: 'DISTANCE',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [
                    null,
                ],
                type: 'cheese_pid_input',
            },
            paramsKeyMap: {
                INPUT: 0,
            },
            class: 'cheese_pid',
            isNotFor: ['cheese'],
            func(sprite, script) {
                const robot = Entry.Cheese.getRobot();
                if (robot) {
                    return robot.pidGetInput(script);
                }
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Cheese.pid_input(%1)',
                        blockType: 'param',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.ROBOID_pid_distance, 'DISTANCE'],
                                    [Lang.Blocks.ROBOID_pid_temperature, 'TEMPERATURE'],
                                    [Lang.Blocks.ROBOID_pid_humidity, 'HUMIDITY'],
                                    [Lang.Blocks.ROBOID_pid_x1, 'X1'],
                                    [Lang.Blocks.ROBOID_pid_y1, 'Y1'],
                                    [Lang.Blocks.ROBOID_pid_x2, 'X2'],
                                    [Lang.Blocks.ROBOID_pid_y2, 'Y2'],
                                    [Lang.Blocks.ROBOID_pid_button1, 'BUTTON1'],
                                    [Lang.Blocks.ROBOID_pid_button2, 'BUTTON2'],
                                    [Lang.Blocks.ROBOID_pid_encoder, 'ENCODER'],
                                ],
                                value: 'DISTANCE',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                        ],
                    },
                ],
            },
        },
        cheese_pid_button_state: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['1', '1'],
                        ['2', '2'],
                    ],
                    value: '1',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.ROBOID_clicked, 'CLICKED'],
                        [Lang.Blocks.ROBOID_long_pressed, 'LONG_PRESSED'],
                    ],
                    value: 'CLICKED',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [
                    null,
                    null,
                ],
                type: 'cheese_pid_button_state',
            },
            paramsKeyMap: {
                BUTTON: 0,
                STATE: 1,
            },
            class: 'cheese_pid',
            isNotFor: ['cheese'],
            func(sprite, script) {
                const robot = Entry.Cheese.getRobot();
                return robot ? robot.pidCheckButtonState(script) : false;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Cheese.pid_button_state(%1, %2)',
                        blockType: 'param',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    ['1', '1'],
                                    ['2', '2'],
                                ],
                                value: '1',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.ROBOID_clicked, 'CLICKED'],
                                    [Lang.Blocks.ROBOID_long_pressed, 'LONG_PRESSED'],
                                ],
                                value: 'CLICKED',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                        ],
                    },
                ],
            },
        },
        cheese_hat010_start: {
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
                params: [
                    null,
                ],
                type: 'cheese_hat010_start',
            },
            paramsKeyMap: {
            },
            class: 'cheese_hat010',
            isNotFor: ['cheese'],
            func(sprite, script) {
                const robot = Entry.Cheese.getRobot();
                return robot ? robot.hat010Start(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Cheese.hat010_start()',
                    },
                ],
            },
        },
        cheese_hat010_button: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['A', 'A'],
                        ['B', 'B'],
                    ],
                    value: 'A',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [
                    null,
                ],
                type: 'cheese_hat010_button',
            },
            paramsKeyMap: {
                BUTTON: 0,
            },
            class: 'cheese_hat010',
            isNotFor: ['cheese'],
            func(sprite, script) {
                const robot = Entry.Cheese.getRobot();
                if (robot) {
                    return robot.hat010GetButton(script);
                }
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Cheese.hat010_button(%1)',
                        blockType: 'param',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    ['A', 'A'],
                                    ['B', 'B'],
                                ],
                                value: 'A',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                        ],
                    },
                ],
            },
        },
        cheese_hat010_button_state: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['A', 'A'],
                        ['B', 'B'],
                    ],
                    value: 'A',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.ROBOID_clicked, 'CLICKED'],
                        [Lang.Blocks.ROBOID_long_pressed, 'LONG_PRESSED'],
                    ],
                    value: 'CLICKED',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [
                    null,
                    null,
                ],
                type: 'cheese_hat010_button_state',
            },
            paramsKeyMap: {
                BUTTON: 0,
                STATE: 1,
            },
            class: 'cheese_hat010',
            isNotFor: ['cheese'],
            func(sprite, script) {
                const robot = Entry.Cheese.getRobot();
                return robot ? robot.hat010CheckButtonState(script) : false;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Cheese.hat010_button_state(%1, %2)',
                        blockType: 'param',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    ['A', 'A'],
                                    ['B', 'B'],
                                ],
                                value: 'A',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.ROBOID_clicked, 'CLICKED'],
                                    [Lang.Blocks.ROBOID_double_clicked, 'DOUBLE_CLICKED'],
                                    [Lang.Blocks.ROBOID_long_pressed, 'LONG_PRESSED'],
                                ],
                                value: 'CLICKED',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                        ],
                    },
                ],
            },
        },
        cheese_hat010_background_turn_on_xy: {
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
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.ROBOID_color_red, 'RED'],
                        [Lang.Blocks.ROBOID_color_orange, 'ORANGE'],
                        [Lang.Blocks.ROBOID_color_yellow, 'YELLOW'],
                        [Lang.Blocks.ROBOID_color_green, 'GREEN'],
                        [Lang.Blocks.ROBOID_color_sky_blue, 'SKY_BLUE'],
                        [Lang.Blocks.ROBOID_color_blue, 'BLUE'],
                        [Lang.Blocks.ROBOID_color_violet, 'VIOLET'],
                        [Lang.Blocks.ROBOID_color_purple, 'PURPLE'],
                        [Lang.Blocks.ROBOID_color_white, 'WHITE'],
                    ],
                    value: 'RED',
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
                params: [
                    {
                        type: 'text',
                        params: ['0'],
                    },
                    {
                        type: 'text',
                        params: ['0'],
                    },
                    null,
                    null,
                ],
                type: 'cheese_hat010_background_turn_on_xy',
            },
            paramsKeyMap: {
                X: 0,
                Y: 1,
                COLOR: 2,
            },
            class: 'cheese_hat010',
            isNotFor: ['cheese'],
            func(sprite, script) {
                const robot = Entry.Cheese.getRobot();
                return robot ? robot.hat010BackgroundTurnOnXY(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Cheese.hat010_turn_on_background_pixel(%1, %2, %3)',
                        textParams: [
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
                                    [Lang.Blocks.ROBOID_color_red, 'RED'],
                                    [Lang.Blocks.ROBOID_color_orange, 'ORANGE'],
                                    [Lang.Blocks.ROBOID_color_yellow, 'YELLOW'],
                                    [Lang.Blocks.ROBOID_color_green, 'GREEN'],
                                    [Lang.Blocks.ROBOID_color_sky_blue, 'SKY_BLUE'],
                                    [Lang.Blocks.ROBOID_color_blue, 'BLUE'],
                                    [Lang.Blocks.ROBOID_color_violet, 'VIOLET'],
                                    [Lang.Blocks.ROBOID_color_purple, 'PURPLE'],
                                    [Lang.Blocks.ROBOID_color_white, 'WHITE'],
                                ],
                                value: 'RED',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                        ],
                    },
                ],
            },
        },
        cheese_hat010_background_turn_off_xy: {
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
                        params: ['0'],
                    },
                    {
                        type: 'text',
                        params: ['0'],
                    },
                    null,
                ],
                type: 'cheese_hat010_background_turn_off_xy',
            },
            paramsKeyMap: {
                X: 0,
                Y: 1,
            },
            class: 'cheese_hat010',
            isNotFor: ['cheese'],
            func(sprite, script) {
                const robot = Entry.Cheese.getRobot();
                return robot ? robot.hat010BackgroundTurnOffXY(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Cheese.hat010_turn_off_background_pixel(%1, %2)',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                        ],
                    },
                ],
            },
        },
        cheese_hat010_background_draw_shape_at_xy: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.ROBOID_color_red, 'RED'],
                        [Lang.Blocks.ROBOID_color_orange, 'ORANGE'],
                        [Lang.Blocks.ROBOID_color_yellow, 'YELLOW'],
                        [Lang.Blocks.ROBOID_color_green, 'GREEN'],
                        [Lang.Blocks.ROBOID_color_sky_blue, 'SKY_BLUE'],
                        [Lang.Blocks.ROBOID_color_blue, 'BLUE'],
                        [Lang.Blocks.ROBOID_color_violet, 'VIOLET'],
                        [Lang.Blocks.ROBOID_color_purple, 'PURPLE'],
                        [Lang.Blocks.ROBOID_color_white, 'WHITE'],
                    ],
                    value: 'RED',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.ROBOID_shape_square, 'SQUARE'],
                        [Lang.Blocks.ROBOID_shape_triangle, 'TRIANGLE'],
                        [Lang.Blocks.ROBOID_shape_diamond, 'DIAMOND'],
                        [Lang.Blocks.ROBOID_shape_circle, 'CIRCLE'],
                        [Lang.Blocks.ROBOID_shape_x, 'X'],
                        [Lang.Blocks.ROBOID_shape_like, 'LIKE'],
                        [Lang.Blocks.ROBOID_shape_dislike, 'DISLIKE'],
                        [Lang.Blocks.ROBOID_shape_angry, 'ANGRY'],
                        [Lang.Blocks.ROBOID_shape_open_mouth, 'OPEN_MOUTH'],
                        [Lang.Blocks.ROBOID_shape_close_mouth, 'CLOSE_MOUTH'],
                        [Lang.Blocks.ROBOID_shape_walk1, 'WALK1'],
                        [Lang.Blocks.ROBOID_shape_walk2, 'WALK2'],
                        [Lang.Blocks.ROBOID_shape_heart, 'HEART'],
                        [Lang.Blocks.ROBOID_shape_star, 'STAR'],
                        [Lang.Blocks.ROBOID_shape_airplane, 'AIRPLANE'],
                        [Lang.Blocks.ROBOID_shape_puppy, 'PUPPY'],
                        [Lang.Blocks.ROBOID_shape_butterfly, 'BUTTERFLY'],
                        [Lang.Blocks.ROBOID_shape_quarter_note, 'QUARTER_NOTE'],
                        [Lang.Blocks.ROBOID_shape_eighth_note, 'EIGHTH_NOTE'],
                        [Lang.Blocks.ROBOID_shape_left_arrow, 'LEFT_ARROW'],
                        [Lang.Blocks.ROBOID_shape_right_arrow, 'RIGHT_ARROW'],
                        [Lang.Blocks.ROBOID_shape_up_arrow, 'UP_ARROW'],
                        [Lang.Blocks.ROBOID_shape_down_arrow, 'DOWN_ARRAY'],
                    ],
                    value: 'SQUARE',
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
                    null,
                    {
                        type: 'text',
                        params: ['0'],
                    },
                    {
                        type: 'text',
                        params: ['0'],
                    },
                    null,
                ],
                type: 'cheese_hat010_background_draw_shape_at_xy',
            },
            paramsKeyMap: {
                COLOR: 0,
                SHAPE: 1,
                X: 2,
                Y: 3,
            },
            class: 'cheese_hat010',
            isNotFor: ['cheese'],
            func(sprite, script) {
                const robot = Entry.Cheese.getRobot();
                return robot ? robot.hat010BackgroundDrawShapeAtXY(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Cheese.hat010_draw_background_shape(%1, %2, %3, %4)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.ROBOID_color_red, 'RED'],
                                    [Lang.Blocks.ROBOID_color_orange, 'ORANGE'],
                                    [Lang.Blocks.ROBOID_color_yellow, 'YELLOW'],
                                    [Lang.Blocks.ROBOID_color_green, 'GREEN'],
                                    [Lang.Blocks.ROBOID_color_sky_blue, 'SKY_BLUE'],
                                    [Lang.Blocks.ROBOID_color_blue, 'BLUE'],
                                    [Lang.Blocks.ROBOID_color_violet, 'VIOLET'],
                                    [Lang.Blocks.ROBOID_color_purple, 'PURPLE'],
                                    [Lang.Blocks.ROBOID_color_white, 'WHITE'],
                                ],
                                value: 'RED',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.ROBOID_shape_square, 'SQUARE'],
                                    [Lang.Blocks.ROBOID_shape_triangle, 'TRIANGLE'],
                                    [Lang.Blocks.ROBOID_shape_diamond, 'DIAMOND'],
                                    [Lang.Blocks.ROBOID_shape_circle, 'CIRCLE'],
                                    [Lang.Blocks.ROBOID_shape_x, 'X'],
                                    [Lang.Blocks.ROBOID_shape_like, 'LIKE'],
                                    [Lang.Blocks.ROBOID_shape_dislike, 'DISLIKE'],
                                    [Lang.Blocks.ROBOID_shape_angry, 'ANGRY'],
                                    [Lang.Blocks.ROBOID_shape_open_mouth, 'OPEN_MOUTH'],
                                    [Lang.Blocks.ROBOID_shape_close_mouth, 'CLOSE_MOUTH'],
                                    [Lang.Blocks.ROBOID_shape_walk1, 'WALK1'],
                                    [Lang.Blocks.ROBOID_shape_walk2, 'WALK2'],
                                    [Lang.Blocks.ROBOID_shape_heart, 'HEART'],
                                    [Lang.Blocks.ROBOID_shape_star, 'STAR'],
                                    [Lang.Blocks.ROBOID_shape_airplane, 'AIRPLANE'],
                                    [Lang.Blocks.ROBOID_shape_puppy, 'PUPPY'],
                                    [Lang.Blocks.ROBOID_shape_butterfly, 'BUTTERFLY'],
                                    [Lang.Blocks.ROBOID_shape_quarter_note, 'QUARTER_NOTE'],
                                    [Lang.Blocks.ROBOID_shape_eighth_note, 'EIGHTH_NOTE'],
                                    [Lang.Blocks.ROBOID_shape_left_arrow, 'LEFT_ARROW'],
                                    [Lang.Blocks.ROBOID_shape_right_arrow, 'RIGHT_ARROW'],
                                    [Lang.Blocks.ROBOID_shape_up_arrow, 'UP_ARROW'],
                                    [Lang.Blocks.ROBOID_shape_down_arrow, 'DOWN_ARRAY'],
                                ],
                                value: 'SQUARE',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                        ],
                    },
                ],
            },
        },
        cheese_hat010_background_draw_string_at_xy: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.ROBOID_color_red, 'RED'],
                        [Lang.Blocks.ROBOID_color_orange, 'ORANGE'],
                        [Lang.Blocks.ROBOID_color_yellow, 'YELLOW'],
                        [Lang.Blocks.ROBOID_color_green, 'GREEN'],
                        [Lang.Blocks.ROBOID_color_sky_blue, 'SKY_BLUE'],
                        [Lang.Blocks.ROBOID_color_blue, 'BLUE'],
                        [Lang.Blocks.ROBOID_color_violet, 'VIOLET'],
                        [Lang.Blocks.ROBOID_color_purple, 'PURPLE'],
                        [Lang.Blocks.ROBOID_color_white, 'WHITE'],
                    ],
                    value: 'RED',
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
                        params: ['abc123'],
                    },
                    {
                        type: 'text',
                        params: ['0'],
                    },
                    {
                        type: 'text',
                        params: ['0'],
                    },
                    null,
                ],
                type: 'cheese_hat010_background_draw_string_at_xy',
            },
            paramsKeyMap: {
                COLOR: 0,
                TEXT: 1,
                X: 2,
                Y: 3,
            },
            class: 'cheese_hat010',
            isNotFor: ['cheese'],
            func(sprite, script) {
                const robot = Entry.Cheese.getRobot();
                return robot ? robot.hat010BackgroundDrawStringAtXY(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Cheese.hat010_draw_background_string(%1, %2, %3, %4)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.ROBOID_color_red, 'RED'],
                                    [Lang.Blocks.ROBOID_color_orange, 'ORANGE'],
                                    [Lang.Blocks.ROBOID_color_yellow, 'YELLOW'],
                                    [Lang.Blocks.ROBOID_color_green, 'GREEN'],
                                    [Lang.Blocks.ROBOID_color_sky_blue, 'SKY_BLUE'],
                                    [Lang.Blocks.ROBOID_color_blue, 'BLUE'],
                                    [Lang.Blocks.ROBOID_color_violet, 'VIOLET'],
                                    [Lang.Blocks.ROBOID_color_purple, 'PURPLE'],
                                    [Lang.Blocks.ROBOID_color_white, 'WHITE'],
                                ],
                                value: 'RED',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
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
                        ],
                    },
                ],
            },
        },
        cheese_hat010_background_draw_pattern_at_xy: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.ROBOID_color_red, 'RED'],
                        [Lang.Blocks.ROBOID_color_orange, 'ORANGE'],
                        [Lang.Blocks.ROBOID_color_yellow, 'YELLOW'],
                        [Lang.Blocks.ROBOID_color_green, 'GREEN'],
                        [Lang.Blocks.ROBOID_color_sky_blue, 'SKY_BLUE'],
                        [Lang.Blocks.ROBOID_color_blue, 'BLUE'],
                        [Lang.Blocks.ROBOID_color_violet, 'VIOLET'],
                        [Lang.Blocks.ROBOID_color_purple, 'PURPLE'],
                        [Lang.Blocks.ROBOID_color_white, 'WHITE'],
                    ],
                    value: 'RED',
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
                        params: ['10010'],
                    },
                    {
                        type: 'text',
                        params: ['0'],
                    },
                    {
                        type: 'text',
                        params: ['0'],
                    },
                    null,
                ],
                type: 'cheese_hat010_background_draw_pattern_at_xy',
            },
            paramsKeyMap: {
                COLOR: 0,
                PATTERN: 1,
                X: 2,
                Y: 3,
            },
            class: 'cheese_hat010',
            isNotFor: ['cheese'],
            func(sprite, script) {
                const robot = Entry.Cheese.getRobot();
                return robot ? robot.hat010BackgroundDrawPatternAtXY(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Cheese.hat010_draw_background_pattern(%1, %2, %3, %4)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.ROBOID_color_red, 'RED'],
                                    [Lang.Blocks.ROBOID_color_orange, 'ORANGE'],
                                    [Lang.Blocks.ROBOID_color_yellow, 'YELLOW'],
                                    [Lang.Blocks.ROBOID_color_green, 'GREEN'],
                                    [Lang.Blocks.ROBOID_color_sky_blue, 'SKY_BLUE'],
                                    [Lang.Blocks.ROBOID_color_blue, 'BLUE'],
                                    [Lang.Blocks.ROBOID_color_violet, 'VIOLET'],
                                    [Lang.Blocks.ROBOID_color_purple, 'PURPLE'],
                                    [Lang.Blocks.ROBOID_color_white, 'WHITE'],
                                ],
                                value: 'RED',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
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
                        ],
                    },
                ],
            },
        },
        cheese_hat010_clear: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.ROBOID_hat_background, 'BACKGROUND'],
                        [Lang.Blocks.ROBOID_hat_all, 'ALL'],
                    ],
                    value: 'BACKGROUND',
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
                params: [
                    null,
                    null,
                ],
                type: 'cheese_hat010_clear',
            },
            paramsKeyMap: {
                TARGET: 0,
            },
            class: 'cheese_hat010',
            isNotFor: ['cheese'],
            func(sprite, script) {
                const robot = Entry.Cheese.getRobot();
                return robot ? robot.hat010Clear(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Cheese.hat010_clear(%1)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.ROBOID_hat_background, 'BACKGROUND'],
                                    [Lang.Blocks.ROBOID_hat_all, 'ALL'],
                                ],
                                value: 'BACKGROUND',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                        ],
                    },
                ],
            },
        },
        cheese_hat010_scroll_by_xy: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.ROBOID_hat_background, 'BACKGROUND'],
                        [Lang.Blocks.ROBOID_hat_all, 'ALL'],
                    ],
                    value: 'BACKGROUND',
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
                        type: 'text',
                        params: ['0'],
                    },
                    {
                        type: 'text',
                        params: ['0'],
                    },
                    null,
                ],
                type: 'cheese_hat010_scroll_by_xy',
            },
            paramsKeyMap: {
                TARGET: 0,
                X: 1,
                Y: 2,
                
            },
            class: 'cheese_hat010',
            isNotFor: ['cheese'],
            func(sprite, script) {
                const robot = Entry.Cheese.getRobot();
                return robot ? robot.hat010ScrollByXY(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Cheese.hat010_scroll(%1, %2, %3)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.ROBOID_hat_background, 'BACKGROUND'],
                                    [Lang.Blocks.ROBOID_hat_all, 'ALL'],
                                ],
                                value: 'BACKGROUND',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                        ],
                    },
                ],
            },
        },
        cheese_hat010_sprite_set_to_shape: {
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
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.ROBOID_color_red, 'RED'],
                        [Lang.Blocks.ROBOID_color_orange, 'ORANGE'],
                        [Lang.Blocks.ROBOID_color_yellow, 'YELLOW'],
                        [Lang.Blocks.ROBOID_color_green, 'GREEN'],
                        [Lang.Blocks.ROBOID_color_sky_blue, 'SKY_BLUE'],
                        [Lang.Blocks.ROBOID_color_blue, 'BLUE'],
                        [Lang.Blocks.ROBOID_color_violet, 'VIOLET'],
                        [Lang.Blocks.ROBOID_color_purple, 'PURPLE'],
                        [Lang.Blocks.ROBOID_color_white, 'WHITE'],
                    ],
                    value: 'RED',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.ROBOID_shape_square, 'SQUARE'],
                        [Lang.Blocks.ROBOID_shape_triangle, 'TRIANGLE'],
                        [Lang.Blocks.ROBOID_shape_diamond, 'DIAMOND'],
                        [Lang.Blocks.ROBOID_shape_circle, 'CIRCLE'],
                        [Lang.Blocks.ROBOID_shape_x, 'X'],
                        [Lang.Blocks.ROBOID_shape_like, 'LIKE'],
                        [Lang.Blocks.ROBOID_shape_dislike, 'DISLIKE'],
                        [Lang.Blocks.ROBOID_shape_angry, 'ANGRY'],
                        [Lang.Blocks.ROBOID_shape_open_mouth, 'OPEN_MOUTH'],
                        [Lang.Blocks.ROBOID_shape_close_mouth, 'CLOSE_MOUTH'],
                        [Lang.Blocks.ROBOID_shape_walk1, 'WALK1'],
                        [Lang.Blocks.ROBOID_shape_walk2, 'WALK2'],
                        [Lang.Blocks.ROBOID_shape_heart, 'HEART'],
                        [Lang.Blocks.ROBOID_shape_star, 'STAR'],
                        [Lang.Blocks.ROBOID_shape_airplane, 'AIRPLANE'],
                        [Lang.Blocks.ROBOID_shape_puppy, 'PUPPY'],
                        [Lang.Blocks.ROBOID_shape_butterfly, 'BUTTERFLY'],
                        [Lang.Blocks.ROBOID_shape_quarter_note, 'QUARTER_NOTE'],
                        [Lang.Blocks.ROBOID_shape_eighth_note, 'EIGHTH_NOTE'],
                        [Lang.Blocks.ROBOID_shape_left_arrow, 'LEFT_ARROW'],
                        [Lang.Blocks.ROBOID_shape_right_arrow, 'RIGHT_ARROW'],
                        [Lang.Blocks.ROBOID_shape_up_arrow, 'UP_ARROW'],
                        [Lang.Blocks.ROBOID_shape_down_arrow, 'DOWN_ARRAY'],
                    ],
                    value: 'SQUARE',
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
                params: [
                    {
                        type: 'text',
                        params: ['1'],
                    },
                    null,
                    null,
                    null,
                ],
                type: 'cheese_hat010_sprite_set_to_shape',
            },
            paramsKeyMap: {
                SPRITE: 0,
                COLOR: 1,
                SHAPE: 2,
            },
            class: 'cheese_hat010',
            isNotFor: ['cheese'],
            func(sprite, script) {
                const robot = Entry.Cheese.getRobot();
                return robot ? robot.hat010SpriteSetToShape(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Cheese.hat010_set_sprite_shape(%1, %2, %3)',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.ROBOID_color_red, 'RED'],
                                    [Lang.Blocks.ROBOID_color_orange, 'ORANGE'],
                                    [Lang.Blocks.ROBOID_color_yellow, 'YELLOW'],
                                    [Lang.Blocks.ROBOID_color_green, 'GREEN'],
                                    [Lang.Blocks.ROBOID_color_sky_blue, 'SKY_BLUE'],
                                    [Lang.Blocks.ROBOID_color_blue, 'BLUE'],
                                    [Lang.Blocks.ROBOID_color_violet, 'VIOLET'],
                                    [Lang.Blocks.ROBOID_color_purple, 'PURPLE'],
                                    [Lang.Blocks.ROBOID_color_white, 'WHITE'],
                                ],
                                value: 'RED',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.ROBOID_shape_square, 'SQUARE'],
                                    [Lang.Blocks.ROBOID_shape_triangle, 'TRIANGLE'],
                                    [Lang.Blocks.ROBOID_shape_diamond, 'DIAMOND'],
                                    [Lang.Blocks.ROBOID_shape_circle, 'CIRCLE'],
                                    [Lang.Blocks.ROBOID_shape_x, 'X'],
                                    [Lang.Blocks.ROBOID_shape_like, 'LIKE'],
                                    [Lang.Blocks.ROBOID_shape_dislike, 'DISLIKE'],
                                    [Lang.Blocks.ROBOID_shape_angry, 'ANGRY'],
                                    [Lang.Blocks.ROBOID_shape_open_mouth, 'OPEN_MOUTH'],
                                    [Lang.Blocks.ROBOID_shape_close_mouth, 'CLOSE_MOUTH'],
                                    [Lang.Blocks.ROBOID_shape_walk1, 'WALK1'],
                                    [Lang.Blocks.ROBOID_shape_walk2, 'WALK2'],
                                    [Lang.Blocks.ROBOID_shape_heart, 'HEART'],
                                    [Lang.Blocks.ROBOID_shape_star, 'STAR'],
                                    [Lang.Blocks.ROBOID_shape_airplane, 'AIRPLANE'],
                                    [Lang.Blocks.ROBOID_shape_puppy, 'PUPPY'],
                                    [Lang.Blocks.ROBOID_shape_butterfly, 'BUTTERFLY'],
                                    [Lang.Blocks.ROBOID_shape_quarter_note, 'QUARTER_NOTE'],
                                    [Lang.Blocks.ROBOID_shape_eighth_note, 'EIGHTH_NOTE'],
                                    [Lang.Blocks.ROBOID_shape_left_arrow, 'LEFT_ARROW'],
                                    [Lang.Blocks.ROBOID_shape_right_arrow, 'RIGHT_ARROW'],
                                    [Lang.Blocks.ROBOID_shape_up_arrow, 'UP_ARROW'],
                                    [Lang.Blocks.ROBOID_shape_down_arrow, 'DOWN_ARRAY'],
                                ],
                                value: 'SQUARE',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                        ],
                    },
                ],
            },
        },
        cheese_hat010_sprite_set_to_string: {
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
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.ROBOID_color_red, 'RED'],
                        [Lang.Blocks.ROBOID_color_orange, 'ORANGE'],
                        [Lang.Blocks.ROBOID_color_yellow, 'YELLOW'],
                        [Lang.Blocks.ROBOID_color_green, 'GREEN'],
                        [Lang.Blocks.ROBOID_color_sky_blue, 'SKY_BLUE'],
                        [Lang.Blocks.ROBOID_color_blue, 'BLUE'],
                        [Lang.Blocks.ROBOID_color_violet, 'VIOLET'],
                        [Lang.Blocks.ROBOID_color_purple, 'PURPLE'],
                        [Lang.Blocks.ROBOID_color_white, 'WHITE'],
                    ],
                    value: 'RED',
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
                    {
                        type: 'text',
                        params: ['1'],
                    },
                    null,
                    {
                        type: 'text',
                        params: ['abc123'],
                    },
                    null,
                ],
                type: 'cheese_hat010_sprite_set_to_string',
            },
            paramsKeyMap: {
                SPRITE: 0,
                COLOR: 1,
                TEXT: 2,
            },
            class: 'cheese_hat010',
            isNotFor: ['cheese'],
            func(sprite, script) {
                const robot = Entry.Cheese.getRobot();
                return robot ? robot.hat010SpriteSetToString(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Cheese.hat010_set_sprite_string(%1, %2, %3)',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.ROBOID_color_red, 'RED'],
                                    [Lang.Blocks.ROBOID_color_orange, 'ORANGE'],
                                    [Lang.Blocks.ROBOID_color_yellow, 'YELLOW'],
                                    [Lang.Blocks.ROBOID_color_green, 'GREEN'],
                                    [Lang.Blocks.ROBOID_color_sky_blue, 'SKY_BLUE'],
                                    [Lang.Blocks.ROBOID_color_blue, 'BLUE'],
                                    [Lang.Blocks.ROBOID_color_violet, 'VIOLET'],
                                    [Lang.Blocks.ROBOID_color_purple, 'PURPLE'],
                                    [Lang.Blocks.ROBOID_color_white, 'WHITE'],
                                ],
                                value: 'RED',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                        ],
                    },
                ],
            },
        },
        cheese_hat010_sprite_set_to_pattern: {
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
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.ROBOID_color_red, 'RED'],
                        [Lang.Blocks.ROBOID_color_orange, 'ORANGE'],
                        [Lang.Blocks.ROBOID_color_yellow, 'YELLOW'],
                        [Lang.Blocks.ROBOID_color_green, 'GREEN'],
                        [Lang.Blocks.ROBOID_color_sky_blue, 'SKY_BLUE'],
                        [Lang.Blocks.ROBOID_color_blue, 'BLUE'],
                        [Lang.Blocks.ROBOID_color_violet, 'VIOLET'],
                        [Lang.Blocks.ROBOID_color_purple, 'PURPLE'],
                        [Lang.Blocks.ROBOID_color_white, 'WHITE'],
                    ],
                    value: 'RED',
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
                    {
                        type: 'text',
                        params: ['1'],
                    },
                    null,
                    {
                        type: 'text',
                        params: ['10010'],
                    },
                    null,
                ],
                type: 'cheese_hat010_sprite_set_to_pattern',
            },
            paramsKeyMap: {
                SPRITE: 0,
                COLOR: 1,
                PATTERN: 2,
            },
            class: 'cheese_hat010',
            isNotFor: ['cheese'],
            func(sprite, script) {
                const robot = Entry.Cheese.getRobot();
                return robot ? robot.hat010SpriteSetToPattern(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Cheese.hat010_set_sprite_pattern(%1, %2, %3)',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.ROBOID_color_red, 'RED'],
                                    [Lang.Blocks.ROBOID_color_orange, 'ORANGE'],
                                    [Lang.Blocks.ROBOID_color_yellow, 'YELLOW'],
                                    [Lang.Blocks.ROBOID_color_green, 'GREEN'],
                                    [Lang.Blocks.ROBOID_color_sky_blue, 'SKY_BLUE'],
                                    [Lang.Blocks.ROBOID_color_blue, 'BLUE'],
                                    [Lang.Blocks.ROBOID_color_violet, 'VIOLET'],
                                    [Lang.Blocks.ROBOID_color_purple, 'PURPLE'],
                                    [Lang.Blocks.ROBOID_color_white, 'WHITE'],
                                ],
                                value: 'RED',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                        ],
                    },
                ],
            },
        },
        cheese_hat010_sprite_clear_show_hide: {
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
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.ROBOID_hat_clear, 'CLEAR'],
                        [Lang.Blocks.ROBOID_hat_show, 'SHOW'],
                        [Lang.Blocks.ROBOID_hat_hide, 'HIDE'],
                    ],
                    value: 'CLEAR',
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
                params: [
                    {
                        type: 'text',
                        params: ['1'],
                    },
                    null,
                    null,
                ],
                type: 'cheese_hat010_sprite_clear_show_hide',
            },
            paramsKeyMap: {
                SPRITE: 0,
                ACTION: 1,
            },
            class: 'cheese_hat010',
            isNotFor: ['cheese'],
            func(sprite, script) {
                const robot = Entry.Cheese.getRobot();
                return robot ? robot.hat010SpriteClearShowHide(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Cheese.hat010_sprite(%1, %2)',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.ROBOID_hat_clear, 'CLEAR'],
                                    [Lang.Blocks.ROBOID_hat_show, 'SHOW'],
                                    [Lang.Blocks.ROBOID_hat_hide, 'HIDE'],
                                ],
                                value: 'CLEAR',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                        ],
                    },
                ],
            },
        },
        cheese_hat010_sprite_change_positions_by_xy: {
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
                        params: ['1'],
                    },
                    {
                        type: 'text',
                        params: ['0'],
                    },
                    {
                        type: 'text',
                        params: ['0'],
                    },
                    null,
                ],
                type: 'cheese_hat010_sprite_change_positions_by_xy',
            },
            paramsKeyMap: {
                SPRITE: 0,
                X: 1,
                Y: 2,
            },
            class: 'cheese_hat010',
            isNotFor: ['cheese'],
            func(sprite, script) {
                const robot = Entry.Cheese.getRobot();
                return robot ? robot.hat010SpriteChangePositionsByXY(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Cheese.hat010_add_sprite_positions(%1, %2, %3)',
                        textParams: [
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
                        ],
                    },
                ],
            },
        },
        cheese_hat010_sprite_set_positions_to_xy: {
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
                        params: ['1'],
                    },
                    {
                        type: 'text',
                        params: ['0'],
                    },
                    {
                        type: 'text',
                        params: ['0'],
                    },
                    null,
                ],
                type: 'cheese_hat010_sprite_set_positions_to_xy',
            },
            paramsKeyMap: {
                SPRITE: 0,
                X: 1,
                Y: 2,
            },
            class: 'cheese_hat010',
            isNotFor: ['cheese'],
            func(sprite, script) {
                const robot = Entry.Cheese.getRobot();
                return robot ? robot.hat010SpriteSetPositionsToXY(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Cheese.hat010_set_sprite_positions(%1, %2, %3)',
                        textParams: [
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
                        ],
                    },
                ],
            },
        },
        cheese_hat010_sprite_change_position_by_value: {
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
                    type: 'Dropdown',
                    options: [
                        ['x', 'X'],
                        ['y', 'Y'],
                    ],
                    value: 'X',
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
                    {
                        type: 'text',
                        params: ['1'],
                    },
                    null,
                    {
                        type: 'text',
                        params: ['0'],
                    },
                    null,
                ],
                type: 'cheese_hat010_sprite_change_position_by_value',
            },
            paramsKeyMap: {
                SPRITE: 0,
                POSITION: 1,
                VALUE: 2,
            },
            class: 'cheese_hat010',
            isNotFor: ['cheese'],
            func(sprite, script) {
                const robot = Entry.Cheese.getRobot();
                return robot ? robot.hat010SpriteChangePositionByValue(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Cheese.hat010_add_sprite_position(%1, %2, %3)',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                            {
                                type: 'Dropdown',
                                options: [
                                    ['x', 'X'],
                                    ['y', 'Y'],
                                ],
                                value: 'X',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                        ],
                    },
                ],
            },
        },
        cheese_hat010_sprite_set_position_to_value: {
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
                    type: 'Dropdown',
                    options: [
                        ['x', 'X'],
                        ['y', 'Y'],
                    ],
                    value: 'X',
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
                    {
                        type: 'text',
                        params: ['1'],
                    },
                    null,
                    {
                        type: 'text',
                        params: ['0'],
                    },
                    null,
                ],
                type: 'cheese_hat010_sprite_set_position_to_value',
            },
            paramsKeyMap: {
                SPRITE: 0,
                POSITION: 1,
                VALUE: 2,
            },
            class: 'cheese_hat010',
            isNotFor: ['cheese'],
            func(sprite, script) {
                const robot = Entry.Cheese.getRobot();
                return robot ? robot.hat010SpriteSetPositionToValue(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Cheese.hat010_set_sprite_position(%1, %2, %3)',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                            {
                                type: 'Dropdown',
                                options: [
                                    ['x', 'X'],
                                    ['y', 'Y'],
                                ],
                                value: 'X',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                        ],
                    },
                ],
            },
        },
        cheese_hat010_sprite_rotate: {
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
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.ROBOID_hat_clockwise, 'CLOCKWISE'],
                        [Lang.Blocks.ROBOID_hat_counterclockwise, 'COUNTERCLOCKWISE'],
                    ],
                    value: 'CLOCKWISE',
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
                params: [
                    {
                        type: 'text',
                        params: ['1'],
                    },
                    null,
                    null,
                ],
                type: 'cheese_hat010_sprite_rotate',
            },
            paramsKeyMap: {
                SPRITE: 0,
                DIRECTION: 1,
            },
            class: 'cheese_hat010',
            isNotFor: ['cheese'],
            func(sprite, script) {
                const robot = Entry.Cheese.getRobot();
                return robot ? robot.hat010SpriteRotate(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Cheese.hat010_rotate_sprite(%1, %2)',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.ROBOID_hat_clockwise, 'CLOCKWISE'],
                                    [Lang.Blocks.ROBOID_hat_counterclockwise, 'COUNTERCLOCKWISE'],
                                ],
                                value: 'CLOCKWISE',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                        ],
                    },
                ],
            },
        },
        cheese_hat010_sprite_flip_in_direction: {
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
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.ROBOID_hat_left_right, 'LEFT_RIGHT'],
                        [Lang.Blocks.ROBOID_hat_up_down, 'UP_DOWN'],
                    ],
                    value: 'LEFT_RIGHT',
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
                params: [
                    {
                        type: 'text',
                        params: ['1'],
                    },
                    null,
                    null,
                ],
                type: 'cheese_hat010_sprite_flip_in_direction',
            },
            paramsKeyMap: {
                SPRITE: 0,
                DIRECTION: 1,
            },
            class: 'cheese_hat010',
            isNotFor: ['cheese'],
            func(sprite, script) {
                const robot = Entry.Cheese.getRobot();
                return robot ? robot.hat010SpriteFlipInDirection(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Cheese.hat010_flip_sprite(%1, %2)',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.ROBOID_hat_left_right, 'LEFT_RIGHT'],
                                    [Lang.Blocks.ROBOID_hat_up_down, 'UP_DOWN'],
                                ],
                                value: 'LEFT_RIGHT',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                        ],
                    },
                ],
            },
        },
        cheese_hat010_sprite_stamp_to_background: {
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
                type: 'cheese_hat010_sprite_stamp_to_background',
            },
            paramsKeyMap: {
                SPRITE: 0,
            },
            class: 'cheese_hat010',
            isNotFor: ['cheese'],
            func(sprite, script) {
                const robot = Entry.Cheese.getRobot();
                return robot ? robot.hat010SpriteStampToBackground(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Cheese.hat010_stamp(%1)',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                        ],
                    },
                ],
            },
        },
        cheese_hat010_sprite_position: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                },
                {
                    type: 'Dropdown',
                    options: [
                        ['x', 'X'],
                        ['y', 'Y'],
                    ],
                    value: 'X',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
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
                type: 'cheese_hat010_sprite_position',
            },
            paramsKeyMap: {
                SPRITE: 0,
                POSITION: 1,
            },
            class: 'cheese_hat010',
            isNotFor: ['cheese'],
            func(sprite, script) {
                const robot = Entry.Cheese.getRobot();
                if (robot) {
                    return robot.hat010GetSpritePosition(script);
                }
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Cheese.hat010_sprite_position(%1, %2)',
                        blockType: 'param',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                            {
                                type: 'Dropdown',
                                options: [
                                    ['x', 'X'],
                                    ['y', 'Y'],
                                ],
                                value: 'X',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                        ],
                    },
                ],
            },
        },
        cheese_hat010_sprite_touching_sprite: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
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
                        params: ['2'],
                    },
                ],
                type: 'cheese_hat010_sprite_touching_sprite',
            },
            paramsKeyMap: {
                SPRITE: 0,
                TARGET: 1,
            },
            class: 'cheese_hat010',
            isNotFor: ['cheese'],
            func(sprite, script) {
                const robot = Entry.Cheese.getRobot();
                return robot ? robot.hat010CheckCheckSpriteSpriteTouched(script) : false;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Cheese.hat010_touching_sprite(%1, %2)',
                        blockType: 'param',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                        ],
                    },
                ],
            },
        },
        cheese_hat010_sprite_touching: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.ROBOID_hat_background, 'BACKGROUND'],
                        [Lang.Blocks.ROBOID_hat_other_sprite, 'OTHER_SPRITE'],
                        [Lang.Blocks.ROBOID_hat_left_wall, 'LEFT_WALL'],
                        [Lang.Blocks.ROBOID_hat_right_wall, 'RIGHT_WALL'],
                        [Lang.Blocks.ROBOID_hat_top_wall, 'TOP_WALL'],
                        [Lang.Blocks.ROBOID_hat_bottom_wall, 'BOTTOM_WALL'],
                        [Lang.Blocks.ROBOID_hat_any_wall, 'ANY_WALL'],
                    ],
                    value: 'BACKGROUND',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
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
                type: 'cheese_hat010_sprite_touching',
            },
            paramsKeyMap: {
                SPRITE: 0,
                TARGET: 1,
            },
            class: 'cheese_hat010',
            isNotFor: ['cheese'],
            func(sprite, script) {
                const robot = Entry.Cheese.getRobot();
                return robot ? robot.hat010CheckCheckSpriteTouched(script) : false;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Cheese.hat010_touching(%1, %2)',
                        blockType: 'param',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.ROBOID_hat_background, 'BACKGROUND'],
                                    [Lang.Blocks.ROBOID_hat_other_sprite, 'OTHER_SPRITE'],
                                    [Lang.Blocks.ROBOID_hat_left_wall, 'LEFT_WALL'],
                                    [Lang.Blocks.ROBOID_hat_right_wall, 'RIGHT_WALL'],
                                    [Lang.Blocks.ROBOID_hat_top_wall, 'TOP_WALL'],
                                    [Lang.Blocks.ROBOID_hat_bottom_wall, 'BOTTOM_WALL'],
                                    [Lang.Blocks.ROBOID_hat_any_wall, 'ANY_WALL'],
                                ],
                                value: 'BACKGROUND',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                        ],
                    },
                ],
            },
        },
        cheese_hat010_change_brightness_by: {
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
                        params: ['5'],
                    },
                    null,
                ],
                type: 'cheese_hat010_change_brightness_by',
            },
            paramsKeyMap: {
                BRIGHTNESS: 0,
            },
            class: 'cheese_hat010',
            isNotFor: ['cheese'],
            func(sprite, script) {
                const robot = Entry.Cheese.getRobot();
                return robot ? robot.hat010ChangeBrightnessBy(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Cheese.hat010_add_brightness(%1)',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                        ],
                    },
                ],
            },
        },
        cheese_hat010_set_brightness_to: {
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
                        params: ['20'],
                    },
                    null,
                ],
                type: 'cheese_hat010_set_brightness_to',
            },
            paramsKeyMap: {
                BRIGHTNESS: 0,
            },
            class: 'cheese_hat010',
            isNotFor: ['cheese'],
            func(sprite, script) {
                const robot = Entry.Cheese.getRobot();
                return robot ? robot.hat010SetBrightnessTo(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Cheese.hat010_set_brightness(%1)',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                        ],
                    },
                ],
            },
        },
    };
};

module.exports = Entry.Cheese;
