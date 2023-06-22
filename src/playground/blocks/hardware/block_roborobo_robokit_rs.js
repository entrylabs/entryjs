'use strict';
const {ArduinoBase, PinMode} = require('./block_roborobo_base.js');

class RobokitRS extends ArduinoBase {
    constructor () {
        super();

        this.id = '10.3';
        this.name = 'roborobo_robokit_rs';
        this.url = 'http://www.roborobo.co.kr';
        this.imageName = 'roborobo_robokit_rs.png';
        this.title = {
            ko: '로보키트 RS',
            en: 'Robokit RS',
        }
        this.blockMenuBlocks = this.getBlockMenuBlocks();
    }

    /**
     * 언어 번역 사용을 위해 함수 형태로 유지
     */
    monitorTemplate () {
        return {
            //imgPath: 'hw/~~.png',
            //width: 256,
            //height: 256,
            // 모니터 화면 상단에 차례대로 나열하는 값
            listPorts: {
                digital_2: {name: (Lang.Blocks.monitor_digital + ': 2'), type: 'input', pos: {x: 0, y: 0, }},
                digital_3: {name: (Lang.Blocks.monitor_digital + ': 3'), type: 'input', pos: {x: 0, y: 0, }},
                digital_4: {name: (Lang.Blocks.monitor_digital + ': 4'), type: 'input', pos: {x: 0, y: 0, }},
                digital_5: {name: (Lang.Blocks.monitor_digital + ': 5'), type: 'input', pos: {x: 0, y: 0, }},
                digital_6: {name: (Lang.Blocks.monitor_digital + ': 6'), type: 'input', pos: {x: 0, y: 0, }},
                digital_7: {name: (Lang.Blocks.monitor_digital + ': 7'), type: 'input', pos: {x: 0, y: 0, }},
                digital_8: {name: (Lang.Blocks.monitor_digital + ': 8'), type: 'input', pos: {x: 0, y: 0, }},
                digital_9: {name: (Lang.Blocks.monitor_digital + ': 9'), type: 'input', pos: {x: 0, y: 0, }},
                digital_10: {name: (Lang.Blocks.monitor_digital + ': 10'), type: 'input', pos: {x: 0, y: 0, }},
                digital_11: {name: (Lang.Blocks.monitor_digital + ': 11'), type: 'input', pos: {x: 0, y: 0, }},
                digital_12: {name: (Lang.Blocks.monitor_digital + ': 12'), type: 'input', pos: {x: 0, y: 0, }},
                digital_13: {name: (Lang.Blocks.monitor_digital + ': 13'), type: 'input', pos: {x: 0, y: 0, }},
                analog_0: {name: (Lang.Blocks.monitor_analog + ': A0'), type: 'input', pos: {x: 0, y: 0, }},
                analog_1: {name: (Lang.Blocks.monitor_analog + ': A1'), type: 'input', pos: {x: 0, y: 0, }},
                analog_2: {name: (Lang.Blocks.monitor_analog + ': A2'), type: 'input', pos: {x: 0, y: 0, }},
                analog_3: {name: (Lang.Blocks.monitor_analog + ': A3'), type: 'input', pos: {x: 0, y: 0, }},
                analog_4: {name: (Lang.Blocks.monitor_analog + ': A4'), type: 'input', pos: {x: 0, y: 0, }},
                analog_5: {name: (Lang.Blocks.monitor_analog + ': A5'), type: 'input', pos: {x: 0, y: 0, }},
                sensor_gyroscope_angle_x: {name: Lang.Blocks.monitor_gyroscope_angle_x, type: 'input', pos: {x: 0, y: 0, }},
                sensor_gyroscope_angle_y: {name: Lang.Blocks.monitor_gyroscope_angle_y, type: 'input', pos: {x: 0, y: 0, }},
                sensor_gyroscope_angle_z: {name: Lang.Blocks.monitor_gyroscope_angle_z, type: 'input', pos: {x: 0, y: 0, }},
                sensor_gyroscope_gyro_x: {name: Lang.Blocks.monitor_gyroscope_x, type: 'input', pos: {x: 0, y: 0, }},
                sensor_gyroscope_gyro_y: {name: Lang.Blocks.monitor_gyroscope_y, type: 'input', pos: {x: 0, y: 0, }},
                sensor_gyroscope_gyro_z: {name: Lang.Blocks.monitor_gyroscope_z, type: 'input', pos: {x: 0, y: 0, }},
                sensor_gyroscope_shake: {name: Lang.Blocks.monitor_gyroscope_shake, type: 'input', pos: {x: 0, y: 0, }},
            },
            // 모니터 화면 지정 위치와 선으로 연결하여 표시하는 값
            ports: {},
            mode: 'both',
        }
    }

    getBlockMenuBlocks () {
        return [
            'robokit_rs_menu_digital_pin',
            'robokit_rs_menu_analog_pin',
            'robokit_rs_menu_pin',
            'robokit_rs_menu_digital_value',
            'robokit_rs_menu_motor_number',

            'robokit_rs_set_digital',
            'robokit_rs_set_motor',
            'robokit_rs_set_motors',
            'robokit_rs_set_mecanumwheels',
            'robokit_rs_set_servo_angle',
            'robokit_rs_set_rgbled_color',
            'robokit_rs_change_rgbled_brightness_by',
            'robokit_rs_set_rgbled_brightness_to',
            'robokit_rs_set_dot_state_of_dotmatrix',
            'robokit_rs_set_dotmatrix_row',
            'robokit_rs_set_dotmatrix',
            'robokit_rs_clear_dotmatrix',
            'robokit_rs_play_piezobuzzer',
            'robokit_rs_play_piezobuzzer_until_done',
            'robokit_rs_get_digital_value',
            'robokit_rs_get_analog_value',
            'robokit_rs_get_sensor_value',
            'robokit_rs_is_digital_detected',
            'robokit_rs_compare_analog_value',
            'robokit_rs_compare_sensor_value',
            'robokit_rs_get_gyro_sensor_value',
            'robokit_rs_is_shaken_gyro_sensor',
            'robokit_rs_reset_gyro_sensor',
            'robokit_rs_get_rotary_position_sensor_value',
            'robokit_rs_reset_rotary_position_sensor',
        ];
    }

    setLanguage () {
        return {
            ko: {
                template: {
                    robokit_rs_menu_digital_pin: '%1',
                    robokit_rs_menu_analog_pin: '%1',
                    robokit_rs_menu_pin: '%1',
                    robokit_rs_menu_digital_value: '%1',
                    robokit_rs_menu_motor_number: '%1',
                    robokit_rs_menu_dotmatrix_row: '%1',

                    robokit_rs_set_digital: '%1 번 핀 디지털 값을 %2 (으)로 정하기 %3',
                    robokit_rs_set_motor: '%1 번 모터를 속도 %2 (으)로 %3 %4',
                    robokit_rs_set_motors: '%1 번 모터, 속도 %2, %3 (으)로 로봇을 %4 %5',
                    robokit_rs_set_mecanumwheels: '메카넘 휠 로봇을 속도 %1 (으)로 %2 %3',
                    robokit_rs_set_servo_angle: '%1 번 핀 서보 모터를 %2 도로 회전하기 %3',
                    robokit_rs_set_rgbled_color: '%1 번 핀 RGB LED 색상을 %2 색으로 정하기 %3',
                    robokit_rs_change_rgbled_brightness_by: '%1 번 핀 RGB LED 밝기를 %2 만큼 바꾸기 %3',
                    robokit_rs_set_rgbled_brightness_to: '%1 번 핀 RGB LED 밝기를 %2 %로 정하기 %3',
                    robokit_rs_set_dot_state_of_dotmatrix: '도트 매트릭스 x: %1 y: %2 좌표를 %3 (으)로 정하기 %4',
                    robokit_rs_set_dotmatrix_row: '도트 매트릭스 y: %1 행에 %2 %3 %4 %5 %6 %7 %8 %9 %10 %11 %12 %13 %14 %15 %16 그리기 %17',
                    robokit_rs_set_dotmatrix: '도트 매트릭스에 %1 그리기 %2',
                    robokit_rs_clear_dotmatrix: '도트 매트릭스 모두 지우기 %1',
                    robokit_rs_play_piezobuzzer: '%1 번 핀 피에조 버저로 %2 옥타브 %3 음을 %4 초 소리내기 %5',
                    robokit_rs_play_piezobuzzer_until_done: '%1 번 핀 피에조 버저로 %2 옥타브 %3 음을 %4 초 소리내며 기다리기 %5',
                    robokit_rs_get_digital_value: '%1 번 핀 디지털 값',
                    robokit_rs_get_analog_value: '%1 번 핀 아날로그 값',
                    robokit_rs_get_sensor_value: '%1 번 핀 %2 값',
                    robokit_rs_is_digital_detected: '%1 번 핀이 감지되었는가?',
                    robokit_rs_compare_analog_value: '%1 번 핀 아날로그 값 %2 %3',
                    robokit_rs_compare_sensor_value: '%1 번 핀 %2 값 %3 %4',
                    robokit_rs_get_gyro_sensor_value: '자이로 센서 %1 값',
                    robokit_rs_is_shaken_gyro_sensor: '자이로 센서를 흔들었는가?',
                    robokit_rs_reset_gyro_sensor: '자이로 센서 기본 자세의 방향을 %1 정하기 %2',
                    robokit_rs_get_rotary_position_sensor_value: '%1 번 핀 회전 위치 센서 %2 값',
                    robokit_rs_reset_rotary_position_sensor: '%1 번 핀 회전 위치 센서 %2 값을 %3 (으)로 정하기 %4'
                },
                Blocks: {
                    monitor_digital: '디지털',
                    monitor_analog: '아날로그',
                    monitor_gyroscope_angle_x: '자이로 센서 : 기울기 x',
                    monitor_gyroscope_angle_y: '자이로 센서 : 기울기 y',
                    monitor_gyroscope_angle_z: '자이로 센서 : 기울기 z',
                    monitor_gyroscope_x: '자이로 센서 : 각속도 x',
                    monitor_gyroscope_y: '자이로 센서 : 각속도 y',
                    monitor_gyroscope_z: '자이로 센서 : 각속도 z',
                    monitor_gyroscope_shake: '자이로 센서 : 흔들림',

                    robokit_rs_motor_state_cw: '시계 방향 회전',
                    robokit_rs_motor_state_ccw: '시계 반대 방향 회전',
                    robokit_rs_motor_state_stop: '정지',

                    robokit_rs_motors_state_forward: '앞으로 이동',
                    robokit_rs_motors_state_backward: '뒤로 이동',
                    robokit_rs_motors_state_turn_left: '왼쪽으로 회전',
                    robokit_rs_motors_state_turn_right: '오른쪽으로 회전',
                    robokit_rs_motors_state_stop: '정지',

                    robokit_rs_mecanumwheels_state_0: '앞으로 이동',
                    robokit_rs_mecanumwheels_state_180: '뒤로 이동',
                    robokit_rs_mecanumwheels_state_270: '왼쪽으로 이동',
                    robokit_rs_mecanumwheels_state_90: '오른쪽으로 이동',
                    robokit_rs_mecanumwheels_state_45: '45도 방향으로 이동',
                    robokit_rs_mecanumwheels_state_135: '135도 방향으로 이동',
                    robokit_rs_mecanumwheels_state_315: '-45도 방향으로 이동',
                    robokit_rs_mecanumwheels_state_225: '-135도 방향으로 이동',
                    robokit_rs_mecanumwheels_state_cw: '시계 방향 회전',
                    robokit_rs_mecanumwheels_state_ccw: '시계 반대 방향 회전',
                    robokit_rs_mecanumwheels_state_stop: '정지',

                    robokit_rs_dotmatrix_example_all: '모두',
                    robokit_rs_dotmatrix_example_eighth_note: '8분 음표',
                    robokit_rs_dotmatrix_example_sixteenth_note: '16분 음표',
                    robokit_rs_dotmatrix_example_square: '네모',
                    robokit_rs_dotmatrix_example_triangle: '세모',
                    robokit_rs_dotmatrix_example_circle: '동그라미',
                    robokit_rs_dotmatrix_example_heart: '하트',
                    robokit_rs_dotmatrix_example_ga: '가',
                    robokit_rs_dotmatrix_example_na: '나',
                    robokit_rs_dotmatrix_example_speech_bubble: '말풍선',
                    robokit_rs_dotmatrix_example_looking_at_top_right: '오른쪽 위 보기',
                    robokit_rs_dotmatrix_example_looking_at_bottom_right: '오른쪽 아래 보기',
                    robokit_rs_dotmatrix_example_looking_at_top_left: '왼쪽 위 보기',
                    robokit_rs_dotmatrix_example_looking_at_bottom_left: '왼쪽 아래 보기',
                    robokit_rs_dotmatrix_example_square_basic: '네모 기본',
                    robokit_rs_dotmatrix_example_square_basic_2: '네모 기본2',
                    robokit_rs_dotmatrix_example_square_square_eyes: '네모 네모 눈',
                    robokit_rs_dotmatrix_example_square_surprised_mouth: '네모 놀란 입',
                    robokit_rs_dotmatrix_example_big_round_eyes: '크고 둥근 눈',
                    robokit_rs_dotmatrix_example_small_round_eyes: '작고 둥근 눈',
                    robokit_rs_dotmatrix_example_wink_right_eye: '오른쪽 윙크',
                    robokit_rs_dotmatrix_example_wink_left_eye: '왼쪽 윙크',
                    robokit_rs_dotmatrix_example_eyebrow_eye_right: '오른쪽 눈썹 눈',
                    robokit_rs_dotmatrix_example_eyebrow_eye_left: '왼쪽 눈썹 눈',
                    robokit_rs_dotmatrix_example_expressionless: '무표정',
                    robokit_rs_dotmatrix_example_cutie: '귀요미',
                    robokit_rs_dotmatrix_example_cute: '깜찍이',
                    robokit_rs_dotmatrix_example_small_eyes_smile: '작은 눈 웃는 표정',
                    robokit_rs_dotmatrix_example_half_moon_shape_eyes: '반달 눈',
                    robokit_rs_dotmatrix_example_half_moon_shape_eyes_smiling: '반달 눈 웃기',
                    robokit_rs_dotmatrix_example_half_moon_shape_eyes_closed: '반달 눈 감기',
                    robokit_rs_dotmatrix_example_sad_expression: '슬픈 표정',
                    robokit_rs_dotmatrix_example_sullen: '시무룩',
                    robokit_rs_dotmatrix_example_crying_eyes: '우는 눈',
                    robokit_rs_dotmatrix_example_melancholy_look: '우울한 표정',
                    robokit_rs_dotmatrix_example_angry_eyes: '화난 눈',
                    robokit_rs_dotmatrix_example_o_shape_mouth: '오모양 입',
                    robokit_rs_dotmatrix_example_yo_shape_mouth: '요모양 입',

                    robokit_rs_piezobuzzer_tone_c: '도',
                    robokit_rs_piezobuzzer_tone_c_sharp: '도♯(레♭)',
                    robokit_rs_piezobuzzer_tone_d: '레',
                    robokit_rs_piezobuzzer_tone_d_sharp: '레♯(미♭)',
                    robokit_rs_piezobuzzer_tone_e: '미',
                    robokit_rs_piezobuzzer_tone_f: '파',
                    robokit_rs_piezobuzzer_tone_f_sharp: '파♯(솔♭)',
                    robokit_rs_piezobuzzer_tone_g: '솔',
                    robokit_rs_piezobuzzer_tone_g_sharp: '솔♯(라♭)',
                    robokit_rs_piezobuzzer_tone_a: '라',
                    robokit_rs_piezobuzzer_tone_a_sharp: '라♯(시♭)',
                    robokit_rs_piezobuzzer_tone_b: '시',

                    robokit_rs_sensor_temperutre: '온도 센서',
                    robokit_rs_sensor_joystick_x: '조이스틱 x',
                    robokit_rs_sensor_joystick_y: '조이스틱 y',
                    robokit_rs_sensor_light: '빛 센서',
                    robokit_rs_sensor_dial: '다이얼',
                    robokit_rs_sensor_a_keypad: 'A 키패드',
                    robokit_rs_sensor_rotaryposition: '회전 위치 센서',
                    robokit_rs_sensor_magnetic: '자기 센서',
                    robokit_rs_sensor_ultrasonic: '초음파 센서',

                    robokit_rs_sensor_gyroscope_angle_x: '기울기 x',
                    robokit_rs_sensor_gyroscope_angle_y: '기울기 y',
                    robokit_rs_sensor_gyroscope_angle_z: '기울기 z',
                    robokit_rs_sensor_gyroscope_x: '각속도 x',
                    robokit_rs_sensor_gyroscope_y: '각속도 y',
                    robokit_rs_sensor_gyroscope_z: '각속도 z',
                    robokit_rs_sensor_gyroscope_shake: '흔들림',

                    robokit_rs_sensor_gyroscope_direction_up: '위로',
                    robokit_rs_sensor_gyroscope_direction_forward: '앞으로',
                    robokit_rs_sensor_gyroscope_direction_right: '오른쪽으로',
                    robokit_rs_sensor_gyroscope_direction_backward: '뒤로',
                    robokit_rs_sensor_gyroscope_direction_left: '왼쪽으로',

                    robokit_rs_sensor_rotaryposition_rotation: '회전',
                    robokit_rs_sensor_rotaryposition_position: '위치',
                    robokit_rs_sensor_rotaryposition_angle: '각도',
                },
            },
            en: {
                template: {
                    robokit_rs_menu_digital_pin: '%1',
                    robokit_rs_menu_analog_pin: '%1',
                    robokit_rs_menu_pin: '%1',
                    robokit_rs_menu_digital_value: '%1',
                    robokit_rs_menu_motor_number: '%1',
                    robokit_rs_menu_dotmatrix_row: '%1',

                    robokit_rs_set_digital: 'set pin %1 digital value to %2 %3',
                    robokit_rs_set_motor: 'set motor %1 speed to %2 %3 %4',
                    robokit_rs_set_motors: '%4 a robot with motor %1 at speed %2 %3 %5',
                    robokit_rs_set_mecanumwheels: 'mecanum wheel robot %1 at speed %2 %3',
                    robokit_rs_set_servo_angle: 'rotate pin %1 servo motor to %2 degree %3',
                    robokit_rs_set_rgbled_color: 'set %1 pin RGB LED color to the %2 color %3',
                    robokit_rs_change_rgbled_brightness_by: 'change pin %1 RGB LED brightness by %2 %3',
                    robokit_rs_set_rgbled_brightness_to: 'set pin %1 RGB LED brightness to %2 % %3',
                    robokit_rs_set_dot_state_of_dotmatrix: 'Set dot matrix X: %1  Y: %2  to %3 %4',
                    robokit_rs_set_dotmatrix_row: 'Draw %2 %3 %4 %5 %6 %7 %8 %9 %10 %11 %12 %13 %14 %15 %16 on dot matrix y:%1 column %17',
                    robokit_rs_set_dotmatrix: 'draw %1 on dotmatrix %2',
                    robokit_rs_clear_dotmatrix: 'Clear all dot matrix %1',
                    robokit_rs_play_piezobuzzer: 'Play pin %1 peizo buzzer with %2 otave %3 note for %4 sec %5',
                    robokit_rs_play_piezobuzzer_until_done: 'Play pin %1 peizo buzzer with %2 otave %3 note for %4 sec and wait %5',
                    robokit_rs_get_digital_value: 'pin %1 digital value',
                    robokit_rs_get_analog_value: 'pin %1 analog value',
                    robokit_rs_get_sensor_value: 'pin %1 %2 value',
                    robokit_rs_is_digital_detected: 'pin %1 detected?',
                    robokit_rs_compare_analog_value: 'pin %1 analog value %2 %3',
                    robokit_rs_compare_sensor_value: 'pin %1 %2 value %3 %4',
                    robokit_rs_get_gyro_sensor_value: '%1 value of gyrosensor',
                    robokit_rs_is_shaken_gyro_sensor: 'is gyrosensor shaken?',
                    robokit_rs_reset_gyro_sensor: 'set basic position of gyrosensor %1 %2',
                    robokit_rs_get_rotary_position_sensor_value: 'rotary position sensor of pin %1 %2 value',
                    robokit_rs_reset_rotary_position_sensor: 'rotary position sensor of pin %1 set %2 value to %3 %4'
                },
                Blocks: {
                    monitor_digital: 'Digital',
                    monitor_analog: 'Analog',
                    monitor_gyroscope_angle_x: 'Gyroscope sensor : angle x',
                    monitor_gyroscope_angle_y: 'Gyroscope sensor : angle y',
                    monitor_gyroscope_angle_z: 'Gyroscope sensor : angle z',
                    monitor_gyroscope_x: 'Gyroscope sensor : angular velocity x',
                    monitor_gyroscope_y: 'Gyroscope sensor : angular velocity y',
                    monitor_gyroscope_z: 'Gyroscope sensor : angular velocity z',
                    monitor_gyroscope_shake: 'Gyroscope sensor : shake',

                    robokit_rs_motor_state_cw: 'rotate clockwise',
                    robokit_rs_motor_state_ccw: 'rotate counterclockwise',
                    robokit_rs_motor_state_stop: 'stop',

                    robokit_rs_motors_state_forward: 'move forward',
                    robokit_rs_motors_state_backward: 'move backword',
                    robokit_rs_motors_state_turn_left: 'turn left',
                    robokit_rs_motors_state_turn_right: 'turn right',
                    robokit_rs_motors_state_stop: 'stop',

                    robokit_rs_mecanumwheels_state_0: 'move forward',
                    robokit_rs_mecanumwheels_state_180: 'move backward',
                    robokit_rs_mecanumwheels_state_270: 'move left',
                    robokit_rs_mecanumwheels_state_90: 'move right',
                    robokit_rs_mecanumwheels_state_45: 'move 45 degree',
                    robokit_rs_mecanumwheels_state_135: 'move 135 degree',
                    robokit_rs_mecanumwheels_state_315: 'move -45 degree',
                    robokit_rs_mecanumwheels_state_225: 'move -135 degree',
                    robokit_rs_mecanumwheels_state_cw: 'rotate clockwise',
                    robokit_rs_mecanumwheels_state_ccw: 'rotate counterclockwise',
                    robokit_rs_mecanumwheels_state_stop: 'stop',

                    robokit_rs_dotmatrix_example_all: 'all',
                    robokit_rs_dotmatrix_example_eighth_note: 'eighth note',
                    robokit_rs_dotmatrix_example_sixteenth_note: 'sixteenth note',
                    robokit_rs_dotmatrix_example_square: 'square',
                    robokit_rs_dotmatrix_example_triangle: 'triangle',
                    robokit_rs_dotmatrix_example_circle: 'circle',
                    robokit_rs_dotmatrix_example_heart: 'heart',
                    robokit_rs_dotmatrix_example_ga: 'ga',
                    robokit_rs_dotmatrix_example_ga: 'na',
                    robokit_rs_dotmatrix_example_speech_bubble: 'speech bubble',
                    robokit_rs_dotmatrix_example_looking_at_top_right: 'looking at top right',
                    robokit_rs_dotmatrix_example_looking_at_bottom_right: 'looking at bottom right',
                    robokit_rs_dotmatrix_example_looking_at_top_left: 'looking at top left',
                    robokit_rs_dotmatrix_example_looking_at_bottom_left: 'looking at bottom left',
                    robokit_rs_dotmatrix_example_square_basic: 'square basic',
                    robokit_rs_dotmatrix_example_square_basic_2: 'square basic2',
                    robokit_rs_dotmatrix_example_square_square_eyes: 'square square eyes',
                    robokit_rs_dotmatrix_example_square_surprised_mouth: 'square surprised mouth',
                    robokit_rs_dotmatrix_example_big_round_eyes: 'big round eyes',
                    robokit_rs_dotmatrix_example_small_round_eyes: 'small round eyes',
                    robokit_rs_dotmatrix_example_wink_right_eye: 'wink right eye',
                    robokit_rs_dotmatrix_example_wink_left_eye: 'wink left eye',
                    robokit_rs_dotmatrix_example_eyebrow_eye_right: 'eyebrow eye to the right',
                    robokit_rs_dotmatrix_example_eyebrow_eye_left: 'eyebrow eye to the left',
                    robokit_rs_dotmatrix_example_expressionless: 'expressionless',
                    robokit_rs_dotmatrix_example_cutie: 'cutie',
                    robokit_rs_dotmatrix_example_cute: 'cute',
                    robokit_rs_dotmatrix_example_small_eyes_smile: 'small eyes smile',
                    robokit_rs_dotmatrix_example_half_moon_shape_eyes: 'half moon shape eyes',
                    robokit_rs_dotmatrix_example_half_moon_shape_eyes_smiling: 'half moon shape eyes smiling',
                    robokit_rs_dotmatrix_example_half_moon_shape_eyes_closed: 'half moon shape eyes closed',
                    robokit_rs_dotmatrix_example_sad_expression: 'sad expression',
                    robokit_rs_dotmatrix_example_sullen: 'sullen',
                    robokit_rs_dotmatrix_example_crying_eyes: 'crying eyes',
                    robokit_rs_dotmatrix_example_melancholy_look: 'melancholy look',
                    robokit_rs_dotmatrix_example_angry_eyes: 'angry eyes',
                    robokit_rs_dotmatrix_example_o_shape_mouth: 'o shape mouth',
                    robokit_rs_dotmatrix_example_yo_shape_mouth: 'yo shape mouth',

                    robokit_rs_piezobuzzer_tone_c: 'C',
                    robokit_rs_piezobuzzer_tone_c_sharp: 'C♯(D♭)',
                    robokit_rs_piezobuzzer_tone_d: 'D',
                    robokit_rs_piezobuzzer_tone_d_sharp: 'D♯(E♭)',
                    robokit_rs_piezobuzzer_tone_e: 'E',
                    robokit_rs_piezobuzzer_tone_f: 'F',
                    robokit_rs_piezobuzzer_tone_f_sharp: 'F♯(G♭)',
                    robokit_rs_piezobuzzer_tone_g: 'G',
                    robokit_rs_piezobuzzer_tone_g_sharp: 'G♯(A♭)',
                    robokit_rs_piezobuzzer_tone_a: 'A',
                    robokit_rs_piezobuzzer_tone_a_sharp: 'A♯(B♭)',
                    robokit_rs_piezobuzzer_tone_b: 'B',

                    robokit_rs_sensor_temperutre: 'temperature sensor',
                    robokit_rs_sensor_joystick_x: 'joystick x',
                    robokit_rs_sensor_joystick_y: 'joystick y',
                    robokit_rs_sensor_light: 'light sensor',
                    robokit_rs_sensor_dial: 'dial',
                    robokit_rs_sensor_a_keypad: 'A keypad',
                    robokit_rs_sensor_rotaryposition: 'rotary position sensor',
                    robokit_rs_sensor_magnetic: 'magnetic sensor',
                    robokit_rs_sensor_ultrasonic: 'ultrasonic sensor',

                    robokit_rs_sensor_gyroscope_angle_x: 'angle x',
                    robokit_rs_sensor_gyroscope_angle_y: 'angle y',
                    robokit_rs_sensor_gyroscope_angle_z: 'angle z',
                    robokit_rs_sensor_gyroscope_x: 'angular velocity x',
                    robokit_rs_sensor_gyroscope_y: 'angular velocity y',
                    robokit_rs_sensor_gyroscope_z: 'angular velocity z',
                    robokit_rs_sensor_gyroscope_shake: 'shake',

                    robokit_rs_sensor_gyroscope_direction_up: 'up',
                    robokit_rs_sensor_gyroscope_direction_forward: 'forward',
                    robokit_rs_sensor_gyroscope_direction_right: 'right',
                    robokit_rs_sensor_gyroscope_direction_backward: 'backward',
                    robokit_rs_sensor_gyroscope_direction_left: 'left',

                    robokit_rs_sensor_rotaryposition_rotation: 'rotation',
                    robokit_rs_sensor_rotaryposition_position: 'position',
                    robokit_rs_sensor_rotaryposition_angle: 'angle',
                },
            },
        };
    };

    getBlocks () {
        return {
            robokit_rs_menu_digital_pin: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic_string_field',
                statements: [],
                params: [
                    {
                        type: 'Dropdown',
                        options: [
                            ['2', '2'],
                            ['3', '3'],
                            ['4', '4'],
                            ['5', '5'],
                            ['6', '6'],
                            ['7', '7'],
                            ['8', '8'],
                            ['9', '9'],
                            ['10', '10'],
                            ['11', '11'],
                            ['12', '12'],
                            ['13', '13']
                        ],
                        value: '2',
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                ],
                events: {},
                def: {
                    params: [null],
                },
                paramsKeyMap: {
                    PIN: 0,
                },
                func: (sprite, script) => {
                    return script.getStringField('PIN');
                },
            },
            robokit_rs_menu_analog_pin: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic_string_field',
                statements: [],
                params: [
                    {
                        type: 'Dropdown',
                        options: [
                            ['A0', '14'],
                            ['A1', '15'],
                            ['A2', '16'],
                            ['A3', '17'],
                            ['A4', '18'],
                            ['A5', '19'],
                        ],
                        value: '14',
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                ],
                events: {},
                def: {
                    params: [null],
                },
                paramsKeyMap: {
                    PIN: 0,
                },
                func: (sprite, script) => {
                    return script.getStringField('PIN');
                },
            },
            robokit_rs_menu_pin: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic_string_field',
                statements: [],
                params: [
                    {
                        type: 'Dropdown',
                        options: [
                            ['A0', '14'],
                            ['A1', '15'],
                            ['A2', '16'],
                            ['A3', '17'],
                            ['A4', '18'],
                            ['A5', '19'],
                            ['2', '2'],
                            ['3', '3'],
                            ['4', '4'],
                            ['5', '5'],
                            ['6', '6'],
                            ['7', '7'],
                            ['8', '8'],
                            ['9', '9'],
                            ['10', '10'],
                            ['11', '11'],
                            ['12', '12'],
                            ['13', '13'],
                        ],
                        value: '14',
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                ],
                events: {},
                def: {
                    params: [null],
                },
                paramsKeyMap: {
                    PIN: 0,
                },
                func: (sprite, script) => {
                    return script.getStringField('PIN');
                },
            },
            robokit_rs_menu_digital_value: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic_string_field',
                statements: [],
                params: [
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
                    params: [null],
                },
                paramsKeyMap: {
                    NUM: 0,
                },
                func: (sprite, script) => {
                    return script.getStringField('NUM');
                },
            },
            robokit_rs_menu_motor_number: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic_string_field',
                statements: [],
                params: [
                    {
                        type: 'Dropdown',
                        options: [
                            ['1', '1'],
                            ['2', '2'],
                            ['3', '3'],
                            ['4', '4'],
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
                },
                paramsKeyMap: {
                    NUM: 0,
                },
                func: (sprite, script) => {
                    return script.getStringField('NUM');
                },
            },
            robokit_rs_menu_dotmatrix_row: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic_string_field',
                statements: [],
                params: [
                    {
                        type: 'Dropdown',
                        options: [
                            ['0', '0'],
                            ['1', '1'],
                            ['2', '2'],
                            ['3', '3'],
                            ['4', '4'],
                            ['5', '5'],
                            ['6', '6'],
                        ],
                        value: '0',
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                ],
                events: {},
                def: {
                    params: [null],
                },
                paramsKeyMap: {
                    Y: 0,
                },
                func: (sprite, script) => {
                    return script.getStringField('Y');
                },
            },
            robokit_rs_set_digital: {
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
                        defualtType: 'number',
                    },
                    {
                        type: 'Indicator',
                        img: 'block_icon/hardware_icon.svg',
                        size: 12,
                    }
                ],
                events: {},
                def: {
                    params: [
                        {
                            type: 'robokit_rs_menu_digital_pin',
                        },
                        {
                            type: 'robokit_rs_menu_digital_value',
                        },
                        null,
                    ],
                    type: 'robokit_rs_set_digital',
                },
                paramsKeyMap: {
                    PIN: 0,
                    VALUE: 1,
                },
                class: 'motion',
                isNotFor: ['roborobo_robokit_rs'],
                func: (sprite, script) => this.set_digital(sprite, script),
            },
            robokit_rs_set_motor: {
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
                        defualtType: 'number',
                    },
                    {
                        type: 'Dropdown',
                        options: [
                            [Lang.Blocks.robokit_rs_motor_state_cw, 'cw'],
                            [Lang.Blocks.robokit_rs_motor_state_ccw, 'ccw'],
                            [Lang.Blocks.robokit_rs_motor_state_stop, 'stop'],
                        ],
                        value: 'cw',
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
                            type: 'robokit_rs_menu_motor_number'
                        },
                        {
                            type: 'number',
                            params: ['15'],
                        },
                        null,
                        null,

                    ],
                    type: 'robokit_rs_set_motor',
                },
                paramsKeyMap: {
                    MOTOR: 0,
                    SPEED: 1,
                    STATE: 2,
                },
                class: 'motion',
                isNotFor: ['roborobo_robokit_rs'],
                func: (sprite, script) => this.set_motor(sprite, script)
            },
            robokit_rs_set_motors: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic',
                statements: [],
                params: [
                    {
                        type: 'Dropdown',
                        options: [
                            ['1, 2', '12'],
                            ['3, 4', '34']
                        ],
                        value: '12',
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                    {
                        type: 'Block',
                        accept: 'string',
                        defualtType: 'number',
                    },
                    {
                        type: 'Block',
                        accept: 'string',
                        defualtType: 'number',
                    },
                    {
                        type: 'Dropdown',
                        options: [
                            [Lang.Blocks.robokit_rs_motors_state_forward, 'forward'],
                            [Lang.Blocks.robokit_rs_motors_state_backward, 'backward'],
                            [Lang.Blocks.robokit_rs_motors_state_turn_left, 'turn-left'],
                            [Lang.Blocks.robokit_rs_motors_state_turn_right, 'turn-right'],
                            [Lang.Blocks.robokit_rs_motors_state_stop, 'stop'],
                        ],
                        value: 'forward',
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
                            type: 'number',
                            params: ['15'],
                        },
                        {
                            type: 'number',
                            params: ['15'],
                        },
                        null,
                        null,

                    ],
                    type: 'robokit_rs_set_motors',
                },
                paramsKeyMap: {
                    MOTORS: 0,
                    SPEED1: 1,
                    SPEED2: 2,
                    STATE: 3,
                },
                class: 'motion',
                isNotFor: ['roborobo_robokit_rs'],
                func: (sprite, script) => this.set_motors(sprite, script)
            },
            robokit_rs_set_mecanumwheels: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic',
                statements: [],
                params: [
                    {
                        type: 'Block',
                        accept: 'string',
                        defualtType: 'number',
                    },
                    {
                        type: 'Dropdown',
                        options: [
                            [Lang.Blocks.robokit_rs_mecanumwheels_state_0, '0'],
                            [Lang.Blocks.robokit_rs_mecanumwheels_state_180, '180'],
                            [Lang.Blocks.robokit_rs_mecanumwheels_state_270, '270'],
                            [Lang.Blocks.robokit_rs_mecanumwheels_state_90, '90'],
                            [Lang.Blocks.robokit_rs_mecanumwheels_state_45, '45'],
                            [Lang.Blocks.robokit_rs_mecanumwheels_state_135, '135'],
                            [Lang.Blocks.robokit_rs_mecanumwheels_state_315, '315'],
                            [Lang.Blocks.robokit_rs_mecanumwheels_state_225, '225'],
                            [Lang.Blocks.robokit_rs_mecanumwheels_state_cw, 'cw'],
                            [Lang.Blocks.robokit_rs_mecanumwheels_state_ccw, 'ccw'],
                            [Lang.Blocks.robokit_rs_mecanumwheels_state_stop, 'stop'],
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
                    params: [
                        {
                            type: 'number',
                            params: ['15'],
                        },
                        null,
                        null,

                    ],
                    type: 'robokit_rs_set_mecanumwheels',
                },
                paramsKeyMap: {
                    SPEED: 0,
                    STATE: 1,
                },
                class: 'motion',
                isNotFor: ['roborobo_robokit_rs'],
                func: (sprite, script) => this.set_mecanumwheels(sprite, script)
            },
            robokit_rs_set_servo_angle: {
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
                        defualtType: 'number',
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
                            type: 'robokit_rs_menu_digital_pin'
                        },
                        {
                            type: 'number',
                            params: ['0'],
                        },
                        null,

                    ],
                    type: 'robokit_rs_set_servo_angle',
                },
                paramsKeyMap: {
                    PIN: 0,
                    ANGLE: 1,
                },
                class: 'motion',
                isNotFor: ['roborobo_robokit_rs'],
                func: (sprite, script) => this.set_servo_angle(sprite, script)
            },
            robokit_rs_set_rgbled_color: {
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
                            type: 'robokit_rs_menu_digital_pin'
                        },
                        null,
                        null,

                    ],
                    type: 'robokit_rs_set_rgbled_color',
                },
                paramsKeyMap: {
                    PIN: 0,
                    COLOR: 1,
                },
                class: 'looks',
                isNotFor: ['roborobo_robokit_rs'],
                func: (sprite, script) => this.set_rgbled_color(sprite, script)
            },
            robokit_rs_change_rgbled_brightness_by: {
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
                        defualtType: 'number',
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
                            type: 'robokit_rs_menu_digital_pin'
                        },
                        {
                            type: 'number',
                            params: ['10'],
                        },
                        null,

                    ],
                    type: 'robokit_rs_change_rgbled_brightness_by',
                },
                paramsKeyMap: {
                    PIN: 0,
                    BRIGHTNESS: 1,
                },
                class: 'looks',
                isNotFor: ['roborobo_robokit_rs'],
                func: (sprite, script) => this.change_rgbled_brightness_by(sprite, script)
            },
            robokit_rs_set_rgbled_brightness_to: {
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
                        defualtType: 'number',
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
                            type: 'robokit_rs_menu_digital_pin'
                        },
                        {
                            type: 'number',
                            params: ['100'],
                        },
                        null,

                    ],
                    type: 'robokit_rs_set_rgbled_brightness_to',
                },
                paramsKeyMap: {
                    PIN: 0,
                    BRIGHTNESS: 1,
                },
                class: 'looks',
                isNotFor: ['roborobo_robokit_rs'],
                func: (sprite, script) => this.set_rgbled_brightness_to(sprite, script)
            },
            robokit_rs_set_dot_state_of_dotmatrix: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic',
                statements: [],
                params: [
                    {
                        type: 'Block',
                        accept: 'string',
                        defualtType: 'number',
                    },
                    {
                        type: 'Block',
                        accept: 'string',
                        defualtType: 'number',
                    },
                    {
                        type: 'Block',
                        accept: 'string',
                        defualtType: 'number',
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
                            type: 'robokit_rs_menu_digital_value',
                        },
                        null,
                    ],
                    type: 'robokit_rs_set_dot_state_of_dotmatrix',
                },
                paramsKeyMap: {
                    X: 0,
                    Y: 1,
                    STATE: 2,
                },
                class: 'looks_dot_matrix',
                isNotFor: ['roborobo_robokit_rs'],
                func: (sprite, script) => this.set_dot_state_of_dotmatrix(sprite, script)
            },
            robokit_rs_set_dotmatrix_row: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic',
                statements: [],
                params: [
                    {
                        type: 'Block',
                        accept: 'string',
                        defualtType: 'number',
                    },
                    {
                        type: 'Block',
                        accept: 'string',
                        defualtType: 'number',
                    },
                    {
                        type: 'Block',
                        accept: 'string',
                        defualtType: 'number',
                    },
                    {
                        type: 'Block',
                        accept: 'string',
                        defualtType: 'number',
                    },
                    {
                        type: 'Block',
                        accept: 'string',
                        defualtType: 'number',
                    },
                    {
                        type: 'Block',
                        accept: 'string',
                        defualtType: 'number',
                    },
                    {
                        type: 'Block',
                        accept: 'string',
                        defualtType: 'number',
                    },
                    {
                        type: 'Block',
                        accept: 'string',
                        defualtType: 'number',
                    },
                    {
                        type: 'Block',
                        accept: 'string',
                        defualtType: 'number',
                    },
                    {
                        type: 'Block',
                        accept: 'string',
                        defualtType: 'number',
                    },
                    {
                        type: 'Block',
                        accept: 'string',
                        defualtType: 'number',
                    },
                    {
                        type: 'Block',
                        accept: 'string',
                        defualtType: 'number',
                    },
                    {
                        type: 'Block',
                        accept: 'string',
                        defualtType: 'number',
                    },
                    {
                        type: 'Block',
                        accept: 'string',
                        defualtType: 'number',
                    },
                    {
                        type: 'Block',
                        accept: 'string',
                        defualtType: 'number',
                    },
                    {
                        type: 'Block',
                        accept: 'string',
                        defualtType: 'number',
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
                            type: 'robokit_rs_menu_dotmatrix_row'
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
                    type: 'robokit_rs_set_dotmatrix_row',
                },
                paramsKeyMap: {
                    Y: 0,
                    X0: 1, X1: 2, X2: 3, X3: 4, X4: 5, X5: 6, X6: 7, X7: 8, X8: 9, X9: 10, X10: 11, X11: 12, X12: 13, X13: 14, X14: 15, X15: 16,
                },
                class: 'looks_dot_matrix',
                isNotFor: ['roborobo_robokit_rs'],
                func: (sprite, script) => this.set_dotmatrix_row(sprite, script)
            },
            robokit_rs_set_dotmatrix: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic',
                statements: [],
                params: [
                    {
                        type: 'Dropdown',
                        options: [
                            [Lang.Blocks.robokit_rs_dotmatrix_example_all, '111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111'],
                            [Lang.Blocks.robokit_rs_dotmatrix_example_eighth_note, '000000000000000000000011000000000000010100000000000010100000000001110100000000011110000000000001100000000'],
                            [Lang.Blocks.robokit_rs_dotmatrix_example_sixteenth_note, '000000001111000000000011001000000000010001000000000010011000000001110111000000011110111000000001100000000'],
                            [Lang.Blocks.robokit_rs_dotmatrix_example_square, '000111111111000000111111111000000110000011000000110000011000000110000011000000111111111000000111111111000'],
                            [Lang.Blocks.robokit_rs_dotmatrix_example_triangle, '000000010000000000000111000000000001101100000000011000110000000110000011000001100000001100001111111111100'],
                            [Lang.Blocks.robokit_rs_dotmatrix_example_circle, '000001111100000000011000110000000110000011000000100000001000000110000011000000011000110000000001111100000'],
                            [Lang.Blocks.robokit_rs_dotmatrix_example_heart, '000011000110000000111101111000001111111111100001111111111100000111111111000000001111100000000000010000000'],
                            ['X', '000110000011000000011000110000000001111100000000000111000000000001111100000000011000110000000110000011000'],
                            ['A', '000000111000000000001000100000000001000100000000001111100000000001000100000000001000100000000001000100000'],
                            ['B', '000001111000000000001000100000000001000100000000001111100000000001000100000000001000100000000001111000000'],
                            ['C', '000000111000000000001000100000000001000000000000001000000000000001000000000000001000100000000000111000000'],
                            [Lang.Blocks.robokit_rs_dotmatrix_example_ga, '000000000000000000011101000000000000101000000000000101100000000001001000000000000001000000000000000000000'],
                            [Lang.Blocks.robokit_rs_dotmatrix_example_na, '000000000000000000010001000000000010001000000000010001100000000011101000000000000001000000000000000000000'],
                            ['!', '000000010000000000000010000000000000010000000000000010000000000000010000000000000000000000000000010000000'],
                            ['?', '000000111000000000001000100000000000000100000000000001000000000000010000000000000000000000000000010000000'],
                            ['0', '000001111100000000001000100000000001000100000000001000100000000001000100000000001000100000000001111100000'],
                            ['1', '000000010000000000000110000000000001010000000000000010000000000000010000000000000010000000000001111100000'],
                            ['2', '000001111100000000000000100000000000000100000000001111100000000001000000000000001000000000000001111100000'],
                            ['3', '000001111100000000000000100000000000000100000000001111100000000000000100000000000000100000000001111100000'],
                            ['4', '000001000100000000001000100000000001000100000000001000100000000001111110000000000000100000000000000100000'],
                            ['5', '000001111100000000001000000000000001000000000000001111100000000000000100000000000000100000000001111100000'],
                            ['6', '000001111100000000001000000000000001000000000000001111100000000001000100000000001000100000000001111100000'],
                            ['7', '000001111100000000001000100000000001000100000000000000100000000000000100000000000000100000000000000100000'],
                            ['8', '000001111100000000001000100000000001000100000000001111100000000001000100000000001000100000000001111100000'],
                            ['9', '000001111100000000001000100000000001000100000000001111100000000000000100000000000000100000000001111100000'],
                            ['10', '000010001111100000110001000100001010001000100000010001000100000010001000100000010001000100001111101111100'],
                            [Lang.Blocks.robokit_rs_dotmatrix_example_speech_bubble, '111111111111111100000000000001100111111111001100000000000001111110011111111000010100000000000011000000000'],
                            [Lang.Blocks.robokit_rs_dotmatrix_example_looking_at_top_right, '011111000111110111100101111001111100101111001111111101111111111111101111111111111101111111011111000111110'],
                            [Lang.Blocks.robokit_rs_dotmatrix_example_looking_at_bottom_right, '011111000111110111111101111111111111101111111111111101111111111100101111001111100101111001011111000111110'],
                            [Lang.Blocks.robokit_rs_dotmatrix_example_looking_at_top_left, '011111000111110100111101001111100111101001111111111101111111111111101111111111111101111111011111000111110'],
                            [Lang.Blocks.robokit_rs_dotmatrix_example_looking_at_bottom_left, '011111000111110111111101111111111111101111111111111101111111100111101001111100111101001111011111000111110'],
                            [Lang.Blocks.robokit_rs_dotmatrix_example_square_basic, '111111111111111100000000000001100100000001001100000000000001100111111111001100000000000001111111111111111'],
                            [Lang.Blocks.robokit_rs_dotmatrix_example_square_basic_2, '111111111111111100000000000001101111000111101100110000011001100110010011001100000000000001111111111111111'],
                            [Lang.Blocks.robokit_rs_dotmatrix_example_square_square_eyes, '111111111111111100000000000001101111000111101101001000100101101111010111101100000000000001111111111111111'],
                            [Lang.Blocks.robokit_rs_dotmatrix_example_square_surprised_mouth, '111111111111111100000000000001100100111001001100000101000001100000101000001100000111000001111111111111111'],
                            [Lang.Blocks.robokit_rs_dotmatrix_example_big_round_eyes, '001111000111100011111101111110011111101111110011111101111110011111101111110011111101111110001111000111100'],
                            [Lang.Blocks.robokit_rs_dotmatrix_example_small_round_eyes, '000000000000000001111000111100011111101111110011111101111110011111101111110001111000111100000000000000000'],
                            [Lang.Blocks.robokit_rs_dotmatrix_example_wink_right_eye, '000000000000000001111000000000011111100000000011111100111100011111101111110001111000111100000000000000000'],
                            [Lang.Blocks.robokit_rs_dotmatrix_example_wink_left_eye, '000000000000000000000000111100000000001111110001111001111110011111101111110001111000111100000000000000000'],
                            [Lang.Blocks.robokit_rs_dotmatrix_example_eyebrow_eye_right, '111111000111111000000000000000111111000111111011101000111010011111000111110011110000011110000000000000000'],
                            [Lang.Blocks.robokit_rs_dotmatrix_example_eyebrow_eye_left, '111111000111111000000000000000111111000111111010111000101110011111000111110011110000011110000000000000000'],
                            [Lang.Blocks.robokit_rs_dotmatrix_example_expressionless, '000000000000000011111000111110000000000000000000111000111000000111000111000000111000111000000111000111000'],
                            [Lang.Blocks.robokit_rs_dotmatrix_example_cutie, '000000000000000001110000011100001110000011100001010010010100001110010011100000000101000000000011000110000'],
                            [Lang.Blocks.robokit_rs_dotmatrix_example_cute, '001000000000100000100000001000000010000010000000100000001000001000010000100000000000000000000111111111000'],
                            [Lang.Blocks.robokit_rs_dotmatrix_example_small_eyes_smile, '000000000000000000100000001000000100000001000000000000000000001111111111100001111111111100000111111111000'],
                            [Lang.Blocks.robokit_rs_dotmatrix_example_half_moon_shape_eyes, '000000000000000001111000111100011111101111110010000101000010000000000000000000000000000000000000000000000'],
                            [Lang.Blocks.robokit_rs_dotmatrix_example_half_moon_shape_eyes_smiling, '001111000111100011111101111110010000101000010000000000000000001100000001100000110000011000000011111110000'],
                            [Lang.Blocks.robokit_rs_dotmatrix_example_half_moon_shape_eyes_closed, '000000000000000000000000000000000000000000000010000101000010011111101111110001111000111100000000000000000'],
                            [Lang.Blocks.robokit_rs_dotmatrix_example_sad_expression, '000000000000000000010000010000000100000001000001000000000100010110000011010000110000011000000110000011000'],
                            [Lang.Blocks.robokit_rs_dotmatrix_example_sullen, '000000000000000001100000001100011110000011110011110000011110001100111001100000001111100000000011000110000'],
                            [Lang.Blocks.robokit_rs_dotmatrix_example_crying_eyes, '000000000000000000000000000000011111000111110001010000010100001010000010100001010000010100000000000000000'],
                            [Lang.Blocks.robokit_rs_dotmatrix_example_melancholy_look, '011111000111110001100000001100001100000001100000001111100000000011000110000000110000011000000100000001000'],
                            [Lang.Blocks.robokit_rs_dotmatrix_example_angry_eyes, '100000000000001010000000000010001000000000100000100000001000011010000010110011001000100110011000000000110'],
                            [Lang.Blocks.robokit_rs_dotmatrix_example_o_shape_mouth, '000000000000000001100000001100011010000011010011110000011110001100010001100000000010000000000001111100000'],
                            [Lang.Blocks.robokit_rs_dotmatrix_example_yo_shape_mouth, '000000000000000010001000100010010001000100010001110000011100000000000000000000000101000000000000111000000'],
                            ['↑', '000000010000000000000111000000000001010100000000000010000000000000010000000000000010000000000000010000000'],
                            ['↗', '000000011110000000000000110000000000001010000000000010010000000000100000000000001000000000000010000000000'],
                            ['→', '000000000000000000000001000000000000000100000000011111110000000000000100000000000001000000000000000000000'],
                            ['↘', '000010000000000000001000000000000000100000000000000010010000000000001010000000000000110000000000011110000'],
                            ['↓', '000000010000000000000010000000000000010000000000000010000000000001010100000000000111000000000000010000000'],
                            ['↙', '000000000010000000000000100000000000001000000000010010000000000010100000000000011000000000000011110000000'],
                            ['←', '000000000000000000000100000000000001000000000000011111110000000001000000000000000100000000000000000000000'],
                            ['↖', '000011110000000000011000000000000010100000000000010010000000000000001000000000000000100000000000000010000'],
                        ],
                        value: '111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111',
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
                    type: 'robokit_rs_set_dotmatrix',
                },
                paramsKeyMap: {
                    MATRIX: 0
                },
                class: 'looks_dot_matrix',
                isNotFor: ['roborobo_robokit_rs'],
                func: (sprite, script) => this.set_dotmatrix(sprite, script)
            },
            robokit_rs_clear_dotmatrix: {
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
                    type: 'robokit_rs_clear_dotmatrix',
                },
                paramsKeyMap: {},
                class: 'looks_dot_matrix',
                isNotFor: ['roborobo_robokit_rs'],
                func: (sprite, script) => this.clear_dotmatrix(sprite, script)
            },
            robokit_rs_play_piezobuzzer: {
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
                            ['1', '1'],
                            ['2', '2'],
                            ['3', '3'],
                            ['4', '4'],
                            ['5', '5'],
                            ['6', '6'],
                            ['7', '7'],
                            ['8', '8'],
                        ],
                        value: '4',
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                    {
                        type: 'Dropdown',
                        options: [
                            [Lang.Blocks.robokit_rs_piezobuzzer_tone_c, '0'],
                            [Lang.Blocks.robokit_rs_piezobuzzer_tone_c_sharp, '1'],
                            [Lang.Blocks.robokit_rs_piezobuzzer_tone_d, '2'],
                            [Lang.Blocks.robokit_rs_piezobuzzer_tone_d_sharp, '3'],
                            [Lang.Blocks.robokit_rs_piezobuzzer_tone_e, '4'],
                            [Lang.Blocks.robokit_rs_piezobuzzer_tone_f, '5'],
                            [Lang.Blocks.robokit_rs_piezobuzzer_tone_f_sharp, '6'],
                            [Lang.Blocks.robokit_rs_piezobuzzer_tone_g, '7'],
                            [Lang.Blocks.robokit_rs_piezobuzzer_tone_g_sharp, '8'],
                            [Lang.Blocks.robokit_rs_piezobuzzer_tone_a, '9'],
                            [Lang.Blocks.robokit_rs_piezobuzzer_tone_a_sharp, '10'],
                            [Lang.Blocks.robokit_rs_piezobuzzer_tone_b, '11'],
                        ],
                        value: '0',
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                    {
                        type: 'Block',
                        accept: 'string',
                        defualtType: 'number',
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
                            type: 'robokit_rs_menu_digital_pin'
                        },
                        null,
                        null,
                        {
                            type: 'number',
                            params: ['0.5'],
                        },
                        null,

                    ],
                    type: 'robokit_rs_play_piezobuzzer',
                },
                paramsKeyMap: {
                    PIN: 0,
                    OCTAVE: 1,
                    NOTE: 2,
                    DURATION: 3,
                },
                class: 'sound',
                isNotFor: ['roborobo_robokit_rs'],
                func: (sprite, script) => this.play_piezobuzzer(sprite, script)
            },
            robokit_rs_play_piezobuzzer_until_done: {
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
                            ['1', '1'],
                            ['2', '2'],
                            ['3', '3'],
                            ['4', '4'],
                            ['5', '5'],
                            ['6', '6'],
                            ['7', '7'],
                            ['8', '8'],
                        ],
                        value: '4',
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                    {
                        type: 'Dropdown',
                        options: [
                            [Lang.Blocks.robokit_rs_piezobuzzer_tone_c, '0'],
                            [Lang.Blocks.robokit_rs_piezobuzzer_tone_c_sharp, '1'],
                            [Lang.Blocks.robokit_rs_piezobuzzer_tone_d, '2'],
                            [Lang.Blocks.robokit_rs_piezobuzzer_tone_d_sharp, '3'],
                            [Lang.Blocks.robokit_rs_piezobuzzer_tone_e, '4'],
                            [Lang.Blocks.robokit_rs_piezobuzzer_tone_f, '5'],
                            [Lang.Blocks.robokit_rs_piezobuzzer_tone_f_sharp, '6'],
                            [Lang.Blocks.robokit_rs_piezobuzzer_tone_g, '7'],
                            [Lang.Blocks.robokit_rs_piezobuzzer_tone_g_sharp, '8'],
                            [Lang.Blocks.robokit_rs_piezobuzzer_tone_a, '9'],
                            [Lang.Blocks.robokit_rs_piezobuzzer_tone_a_sharp, '10'],
                            [Lang.Blocks.robokit_rs_piezobuzzer_tone_b, '11'],
                        ],
                        value: '0',
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                    {
                        type: 'Block',
                        accept: 'string',
                        defualtType: 'number',
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
                            type: 'robokit_rs_menu_digital_pin'
                        },
                        null,
                        null,
                        {
                            type: 'number',
                            params: ['0.5'],
                        },
                        null,

                    ],
                    type: 'robokit_rs_play_piezobuzzer_until_done',
                },
                paramsKeyMap: {
                    PIN: 0,
                    OCTAVE: 1,
                    NOTE: 2,
                    DURATION: 3,
                },
                class: 'sound',
                isNotFor: ['roborobo_robokit_rs'],
                func: (sprite, script) => this.play_piezobuzzer_until_done(sprite, script)
            },
            robokit_rs_get_digital_value: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic_string_field',
                statements: [],
                params: [
                    {
                        type: 'Block',
                        accept: 'string',
                    },
                ],
                events: {},
                def: {
                    params: [
                        {
                            type: 'robokit_rs_menu_digital_pin',
                        },
                    ],
                    type: 'robokit_rs_get_digital_value',
                },
                paramsKeyMap: {
                    PIN: 0,
                },
                class: 'sensing',
                isNotFor: ['roborobo_robokit_rs'],
                func: (sprite, script) => this.get_digital_value(sprite, script),
            },
            robokit_rs_get_analog_value: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic_string_field',
                statements: [],
                params: [
                    {
                        type: 'Block',
                        accept: 'string',
                    },
                ],
                events: {},
                def: {
                    params: [
                        {
                            type: 'robokit_rs_menu_analog_pin',
                        },
                    ],
                    type: 'robokit_rs_get_analog_value',
                },
                paramsKeyMap: {
                    PIN: 0,
                },
                class: 'sensing',
                isNotFor: ['roborobo_robokit_rs'],
                func: (sprite, script) => this.get_analog_value(sprite, script),
            },
            robokit_rs_get_sensor_value: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
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
                            [Lang.Blocks.robokit_rs_sensor_temperutre, 'temperature'],
                            [Lang.Blocks.robokit_rs_sensor_joystick_x, 'joystickx'],
                            [Lang.Blocks.robokit_rs_sensor_joystick_y, 'joysticky'],
                            [Lang.Blocks.robokit_rs_sensor_light, 'light'],
                            [Lang.Blocks.robokit_rs_sensor_dial, 'dial'],
                            [Lang.Blocks.robokit_rs_sensor_a_keypad, 'akeypad'],
                            [Lang.Blocks.robokit_rs_sensor_rotaryposition, 'rotaryposition'],
                            [Lang.Blocks.robokit_rs_sensor_magnetic, 'magnetic'],
                            [Lang.Blocks.robokit_rs_sensor_ultrasonic, 'ultrasonic'],
                        ],
                        value: 'temperature',
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                ],
                events: {},
                def: {
                    params: [
                        {
                            type: 'robokit_rs_menu_pin',
                        },
                        null,
                    ],
                    type: 'robokit_rs_get_sensor_value',
                },
                paramsKeyMap: {
                    PIN: 0,
                    SENSOR: 1,
                },
                class: 'sensing',
                isNotFor: ['roborobo_robokit_rs'],
                func: (sprite, script) => this.get_sensor_value(sprite, script)
            },
            robokit_rs_is_digital_detected: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic_boolean_field',
                statements: [],
                params: [
                    {
                        type: 'Block',
                        accept: 'string',
                    },
                ],
                events: {},
                def: {
                    params: [
                        {
                            type: 'robokit_rs_menu_digital_pin',
                        },
                    ],
                    type: 'robokit_rs_is_digital_detected',
                },
                paramsKeyMap: {
                    PIN: 0,
                },
                class: 'sensing',
                isNotFor: ['roborobo_robokit_rs'],
                func: (sprite, script) => this.is_digital_detected(sprite, script),
            },
            robokit_rs_compare_analog_value: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
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
                            ['>', 'greater-than'],
                            ['=', 'equal'],
                            ['<', 'less-than'],
                        ],
                        value: 'greater-than',
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                    {
                        type: 'Block',
                        accept: 'string',
                        defualtType: 'number',
                    },
                ],
                events: {},
                def: {
                    params: [
                        {
                            type: 'robokit_rs_menu_analog_pin',
                        },
                        null,
                        {
                            type: 'number',
                            params: ['512'],
                        },
                    ],
                    type: 'robokit_rs_compare_analog_value',
                },
                paramsKeyMap: {
                    PIN: 0,
                    SYMBOL: 1,
                    VALUE: 2,
                },
                class: 'sensing',
                isNotFor: ['roborobo_robokit_rs'],
                func: (sprite, script) => this.compare_analog_value(sprite, script),
            },
            robokit_rs_compare_sensor_value: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
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
                            [Lang.Blocks.robokit_rs_sensor_temperutre, 'temperature'],
                            [Lang.Blocks.robokit_rs_sensor_joystick_x, 'joystickx'],
                            [Lang.Blocks.robokit_rs_sensor_joystick_y, 'joysticky'],
                            [Lang.Blocks.robokit_rs_sensor_light, 'light'],
                            [Lang.Blocks.robokit_rs_sensor_dial, 'dial'],
                            [Lang.Blocks.robokit_rs_sensor_a_keypad, 'akeypad'],
                            [Lang.Blocks.robokit_rs_sensor_rotaryposition, 'rotaryposition'],
                            [Lang.Blocks.robokit_rs_sensor_magnetic, 'magnetic'],
                            [Lang.Blocks.robokit_rs_sensor_ultrasonic, 'ultrasonic'],
                        ],
                        value: 'temperature',
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                    {
                        type: 'Dropdown',
                        options: [
                            ['>', 'greater-than'],
                            ['=', 'equal'],
                            ['<', 'less-than'],
                        ],
                        value: 'greater-than',
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                    {
                        type: 'Block',
                        accept: 'string',
                        defualtType: 'number',
                    },
                ],
                events: {},
                def: {
                    params: [
                        {
                            type: 'robokit_rs_menu_pin',
                        },
                        null,
                        null,
                        {
                            type: 'number',
                            params: ['0'],
                        },
                    ],
                    type: 'robokit_rs_compare_sensor_value',
                },
                paramsKeyMap: {
                    PIN: 0,
                    SENSOR: 1,
                    SYMBOL: 2,
                    VALUE: 3,
                },
                class: 'sensing',
                isNotFor: ['roborobo_robokit_rs'],
                func: (sprite, script) => this.compare_sensor_value(sprite, script),
            },
            robokit_rs_get_gyro_sensor_value: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic_string_field',
                statements: [],
                params: [
                    {
                        type: 'Dropdown',
                        options: [
                            [Lang.Blocks.robokit_rs_sensor_gyroscope_angle_x, "anglex"],
                            [Lang.Blocks.robokit_rs_sensor_gyroscope_angle_y, "angley"],
                            [Lang.Blocks.robokit_rs_sensor_gyroscope_angle_z, "anglez"],
                            [Lang.Blocks.robokit_rs_sensor_gyroscope_x, "gyrox"],
                            [Lang.Blocks.robokit_rs_sensor_gyroscope_y, "gyroy"],
                            [Lang.Blocks.robokit_rs_sensor_gyroscope_z, "gyroz"],
                            [Lang.Blocks.robokit_rs_sensor_gyroscope_shake, "shake"]
                        ],
                        value: 'anglex',
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
                    type: 'robokit_rs_get_gyro_sensor_value',
                },
                paramsKeyMap: {
                    PROPERTY: 0,
                },
                class: 'sensing_gyro_sensor',
                isNotFor: ['roborobo_robokit_rs'],

                func: (sprite, script) => this.get_gyro_sensor_value(sprite, script),
            },
            robokit_rs_is_shaken_gyro_sensor: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic_boolean_field',
                statements: [],
                params: [],
                events: {},
                def: {
                    params: [],
                    type: 'robokit_rs_is_shaken_gyro_sensor',
                },
                paramsKeyMap: {},
                class: 'sensing_gyro_sensor',
                isNotFor: ['roborobo_robokit_rs'],
                func: (sprite, script) => this.is_shaken_gyro_sensor(sprite, script)
            },
            robokit_rs_reset_gyro_sensor: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic',
                statements: [],
                params: [
                    {
                        type: 'Dropdown',
                        options: [
                            [Lang.Blocks.robokit_rs_sensor_gyroscope_direction_up, 'up'],
                            [Lang.Blocks.robokit_rs_sensor_gyroscope_direction_forward, 'forward'],
                            [Lang.Blocks.robokit_rs_sensor_gyroscope_direction_right, 'right'],
                            [Lang.Blocks.robokit_rs_sensor_gyroscope_direction_backward, 'backward'],
                            [Lang.Blocks.robokit_rs_sensor_gyroscope_direction_left, 'left']
                        ],
                        value: 'up',
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
                    type: 'robokit_rs_reset_gyro_sensor',
                },
                paramsKeyMap: {
                    DIRECTION: 0,
                },
                class: 'sensing_gyro_sensor',
                isNotFor: ['roborobo_robokit_rs'],
                func: (sprite, script) => this.reset_gyro_sensor(sprite, script)
            },

            robokit_rs_get_rotary_position_sensor_value: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
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
                            [Lang.Blocks.robokit_rs_sensor_rotaryposition_rotation, 'rotation'],
                            [Lang.Blocks.robokit_rs_sensor_rotaryposition_position, 'position'],
                            [Lang.Blocks.robokit_rs_sensor_rotaryposition_angle, 'angle']
                        ],
                        value: 'rotation',
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                ],
                events: {},
                def: {
                    params: [
                        {
                            type: 'robokit_rs_menu_analog_pin',
                        },
                        null,
                    ],
                    type: 'robokit_rs_get_rotary_position_sensor_value',
                },
                paramsKeyMap: {
                    PIN: 0,
                    PROPERTY: 1,
                },
                class: 'sensing_rotary_position_sensor',
                isNotFor: ['roborobo_robokit_rs'],
                func: (sprite, script) => this.get_rotary_position_sensor_value(sprite, script)
            },

            robokit_rs_reset_rotary_position_sensor: {
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
                            [Lang.Blocks.robokit_rs_sensor_rotaryposition_rotation, 'rotation'],
                            [Lang.Blocks.robokit_rs_sensor_rotaryposition_position, 'position'],
                            [Lang.Blocks.robokit_rs_sensor_rotaryposition_angle, 'angle']
                        ],
                        value: 'rotation',
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                    {
                        type: 'Block',
                        accept: 'string',
                        defualtType: 'number',
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
                            type: 'robokit_rs_menu_analog_pin',
                        },
                        null,
                        {
                            type: 'number',
                            params: ['0'],
                        },
                        null,
                    ],
                    type: 'robokit_rs_reset_rotary_position_sensor',
                },
                paramsKeyMap: {
                    PIN: 0,
                    PROPERTY: 1,
                    VALUE: 2,
                },
                class: 'sensing_rotary_position_sensor',
                isNotFor: ['roborobo_robokit_rs'],
                func: (sprite, script) => this.reset_rotary_position_sensor(sprite, script)
            },
        };
    };

    setZero () {
        super.setZero();
    }

    afterReceive (data) {
        super.afterReceive(data);
    }

    afterSend () {
        super.afterSend();
    }

    request (func, subkey, value, updateNow = false) {
        super.request(func, subkey, value, updateNow);
    }

     resetState () {
        super.resetState();
    }

    /**
     * -----------------------------------block execute-----------------------------------
     * 공통 사용 함수를 제외한 나머지 블록 동작을 작성
     * -----------------------------------------------------------------------------------
     */

    set_mecanumwheels (sprite, script) {
        const speed = script.getNumberValue('SPEED');
        const state = script.getStringValue('STATE');

        let data = []
        for (let i = 0; i < 4; i++) {
            data[i] = {motor: i + 1, speed: speed, state: 0}
        }

        switch (state) {
            case '0': {
                data[0].state = 2;
                data[1].state = 1;
                data[2].state = 2;
                data[3].state = 1;
            }
                break;
            case '45': {
                data[0].state = 2;
                data[3].state = 1;
            }
                break;
            case '90': {
                data[0].state = 2;
                data[1].state = 2;
                data[2].state = 1;
                data[3].state = 1;
            }
                break;
            case '135': {
                data[1].state = 2;
                data[2].state = 1;
            }
                break;
            case '180': {
                data[0].state = 1;
                data[1].state = 2;
                data[2].state = 1;
                data[3].state = 2;
            }
                break;
            case '225': {
                data[0].state = 1;
                data[3].state = 2;
            }
                break;
            case '270': {
                data[0].state = 1;
                data[1].state = 1;
                data[2].state = 2;
                data[3].state = 2;
            }
                break;
            case '315': {
                data[1].state = 1;
                data[2].state = 2;
            }
                break;
            case 'cw': {
                data[0].state = 2;
                data[1].state = 2;
                data[2].state = 2;
                data[3].state = 2;
            }
                break;
            case 'ccw': {
                data[0].state = 1;
                data[1].state = 1;
                data[2].state = 1;
                data[3].state = 1;
            }
                break;
            case 'stop':
                break;
        }

        for (let i = 0; i < 4; i++) {
            this.request('setMotor', i + 1, data[i]);
        }
        return script.callReturn();
    }

    set_dot_state_of_dotmatrix (sprite, script) {
        const x = script.getNumberValue('X');
        const y = script.getNumberValue('Y');
        const state = script.getNumberValue('STATE');
        if (x < 0 || x > 14 || y < 0 || y > 6) return script.callReturn();

        this.request('setDotMatrix', null, {type: 'dot', x, y, dot: Math.min(1, Math.max(0, state)).toString()}, true);
        return script.callReturn();
    }

    set_dotmatrix_row (sprite, script) {
        const y = script.getNumberValue('Y');
        if (y < 0 || y > 6) return script.callReturn();

        let dots = '';
        for (let i = 0; i < 16; i++) {
            const value = script.getNumberValue('X' + i);
            dots += Math.max(0, Math.min(1, value)).toString();
        }

        this.request('setDotMatrix', null, {type: 'row', y, dots}, true);
        return script.callReturn();
    }

    set_dotmatrix (sprite, script) {
        const example = script.getStringValue('MATRIX')
        this.request('setDotMatrix', null, {type: 'all', dots: example}, true);
        return script.callReturn();
    }

    clear_dotmatrix (sprite, script) {
        const length = 15 * 7;
        let dots = '';
        for (let i = 0; i < length; i++) {dots += 0;}

        this.request('setDotMatrix', null, {type: 'all', dots});
        return script.callReturn();
    }

    get_gyro_sensor_value (sprite, script) {
        const type = script.getStringValue('PROPERTY');

        const obj = this.state.rx.gyro;
        if (!this.isEqualsPinMode(18, PinMode.I2C) || !this.isEqualsPinMode(19, PinMode.I2C) || !obj || !obj.enable) {
            this.request('enableGyroSensor', null, null, true);
        }

        if (!obj) return 0;
        switch (type) {
            case 'anglex': return obj.angle.x;
            case 'angley': return obj.angle.y;
            case 'anglez': return obj.angle.z;
            case 'gyrox': return obj.gyro.x;
            case 'gyroy': return obj.gyro.y;
            case 'gyroz': return obj.gyro.z;
            case 'shake': return obj.shake;
            default: return 0;
        }
    }

    is_shaken_gyro_sensor (sprite, script) {
        const obj = this.state.rx.gyro;

        if (!this.isEqualsPinMode(18, PinMode.I2C) || !this.isEqualsPinMode(19, PinMode.I2C) || !obj || !obj.enable) {
            this.request('enableGyroSensor', null, null, true);
        }

        return obj ? obj.shake == 1 : false;
    }

    reset_gyro_sensor (sprite, script) {
        const dir = script.getStringValue('DIRECTION');
        let dirNum = 0;
        switch (dir) {
            case 'up':
                dirNum = 0;
                break;
            case 'forward':
                dirNum = 1;
                break;
            case 'right':
                dirNum = 2;
                break;
            case 'backward':
                dirNum = 3;
                break;
            case 'left':
                dirNum = 4;
                break;
        }
        this.request('resetGyroSensor', null, {direction: dirNum}, true);
        return new Promise(resolve => setTimeout(() => resolve(), 500));
    }
}

module.exports = new RobokitRS();