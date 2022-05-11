'use strict';
(function () {
    Entry.NeobotLite = new (class NeobotLite {
        constructor() {
            this.id = '5.1';
            this.name = 'NeobotLite';
            this.url = 'http://neobot.co.kr/';
            this.imageName = 'neobotlite.png';
            this.portData = {
                baudRate: 115200,
                dataBits: 8,
                parity: 'none',
                stopBits: 1,
                bufferSize: 512,
                constantServing: true,
            };
            this.duration = 100;
            this.LOCAL_MAP = ['IN1', 'IN2', 'IN3', 'IR', 'BAT'];

            this.blockMenuBlocks = [
                // class sensor
                'neobot_lite_sensor_value',
                'neobot_lite_sensor_connect_external',
                'neobot_lite_sensor_convert_scale',
                // class decision
                'neobot_lite_decision_sensor_is_over',
                'neobot_lite_decision_equal_with_sensor',
                // class remote
                'neobot_lite_remote_button',
                // class motor
                'neobot_lite_left_motor',
                'neobot_lite_stop_left_motor',
                'neobot_lite_right_motor',
                'neobot_lite_stop_right_motor',
                'neobot_lite_both_motor',
                'neobot_lite_all_motor',
                // removed by cky 190423
                //'neobot_lite_motor_with_sensor',
                'neobot_lite_stop_all_motor',
                'neobot_lite_robot',
                // class output
                'neobot_lite_output_led_type1',
                'neobot_lite_output_led_on',
                'neobot_lite_output_led_off',
                'neobot_lite_set_output',
                // class servo
                'neobot_lite_servo_init',
                'neobot_lite_servo_change_degree',
                'neobot_lite_servo_rotate',
                'neobot_lite_servo_stop',
                // class note
                'neobot_lite_play_note_for',
                'neobot_lite_play_note_with_sensor',
            ];

            this.setZero();
        }

        get monitorTemplate() {
            return {
                imgPath: 'hw/neobot.png',
                width: 700,
                height: 700,
                listPorts: {
                    IR: { name: '리모컨', type: 'input', pos: { x: 0, y: 0 } },
                    BAT: { name: '배터리', type: 'input', pos: { x: 0, y: 0 } },
                    SND: { name: Lang.Hw.buzzer, type: 'output', pos: { x: 0, y: 0 } },
                    FND: { name: 'FND', type: 'output', pos: { x: 0, y: 0 } },
                },
                ports: {
                    IN1: { name: 'IN1', type: 'input', pos: { x: 270, y: 200 } },
                    IN2: { name: 'IN2', type: 'input', pos: { x: 325, y: 200 } },
                    IN3: { name: 'IN3', type: 'input', pos: { x: 325, y: 500 } },
                    DCL: { name: 'L-Motor', type: 'output', pos: { x: 270, y: 500 } },
                    DCR: { name: 'R-Motor', type: 'output', pos: { x: 435, y: 500 } },
                    OUT1: { name: 'OUT1', type: 'output', pos: { x: 380, y: 200 } },
                    OUT2: { name: 'OUT2', type: 'output', pos: { x: 435, y: 200 } },
                    OUT3: { name: 'OUT3', type: 'output', pos: { x: 380, y: 500 } },
                },
                mode: 'both',
            };
        }

        getMonitorPort() {
            return { ...this.localBuffer, ...this.remoteBuffer };
        }

        setZero() {
            this.localBuffer = {
                IN1: 0,
                IN2: 0,
                IN3: 0,
                IR: 0,
                BAT: 0,
            };
            this.remoteBuffer = {
                OUT1: 0,
                OUT2: 0,
                OUT3: 0,
                DCR: 0,
                DCL: 0,
                SND: 0,
                FND: 0,
                OPT: 0,
            };
        }

        handleLocalData(data) {
            for (var i = 0; i < data.length - 1; i++) {
                if (data[i] === 171 && data[i + 1] === 205) {
                    var dataSet = data.slice(i + 2, i + 7);
                    dataSet.forEach((value, idx) => {
                        this.localBuffer[this.LOCAL_MAP[idx]] = value;
                    });
                    break;
                }
            }
        }

        requestLocalData() {
            const requestData = [];

            // 시작 바이트
            requestData.push(0xcd);
            requestData.push(0xab);

            let checksum = 0;
            var isFnd = false;
            Object.keys(this.remoteBuffer).forEach((key, idx) => {
                let value = this.remoteBuffer[key];
                if (idx === 6 && value > 0) {
                    isFnd = true;
                } else if (idx === 7 && isFnd) {
                    value = value | 8;
                }
                requestData.push(value);
                checksum += value;
            });

            checksum = checksum & 255;
            //체크썸
            requestData.push(checksum);
            return requestData;
        }

        setLanguage() {
            return {
                ko: {
                    template: {
                        neobot_lite_turn_left: '왼쪽모터를 %1 %2 회전 %3',
                        neobot_lite_stop_left: '왼쪽모터 정지 %1',
                        neobot_lite_turn_right: '오른쪽모터를 %1 %2 회전 %3',
                        neobot_lite_stop_right: '오른쪽모터 정지 %1',
                        neobot_lite_run_motor: '%1 모터를  %2 초간 %3 %4 %5',
                        neobot_lite_servo_1: 'SERVO1에 연결된 서보모터를 %1 속도로 %2 로 이동 %3',
                        neobot_lite_servo_2: 'SERVO2에 연결된 서보모터를 %1 속도로 %2 로 이동 %3',
                        neobot_lite_set_sensor_value: '%1 번 포트의 값을 %2 %3',

                        neobot_lite_sensor_value: '%1 값',
                        neobot_lite_sensor_connect_external: '%1 에 연결한 %2 값',
                        neobot_lite_sensor_convert_scale:
                            '%1 센서값 %2 ~ %3 를 %4 ~ %5 (으)로 바꾼 값',

                        neobot_lite_compare_symbol: '%1',
                        neobot_lite_decision_sensor_is_over: '%1 의 센서값이 %2 %3',
                        neobot_lite_decision_equal_with_sensor:
                            '%1 에 연결한 컬러센서가 %2 을 감지함',
                        neobot_lite_remote_button: '리모컨의 %1 버튼을 누름',

                        get_motor_speed: '%1',
                        neobot_lite_left_motor: '왼쪽 모터를 %1 %2 의 속도로 회전 %3',
                        neobot_lite_stop_left_motor: '왼쪽 모터를 정지 %1',
                        neobot_lite_right_motor: '오른쪽 모터를 %1 %2 의 속도로 회전 %3',
                        neobot_lite_stop_right_motor: '오른쪽 모터를 정지 %1',
                        neobot_lite_both_motor:
                            '왼쪽 모터를 %1 %2 & 오른쪽 모터를 %3 %4 의 속도로 회전 %5',
                        neobot_lite_all_motor: '양쪽 모터를 %1 %2의 속도로 %3 회전 %4',
                        neobot_lite_stop_all_motor: '양쪽 모터를 정지 %1',
                        neobot_lite_robot: '로봇 %1 %2',

                        neobot_lite_output_led_type1: '%1 에 연결한 LED를 %2 밝기로 %3 켜기 %4',
                        neobot_lite_output_led_on: '%1 에 연결한 LED 켜기 %2',
                        neobot_lite_output_led_off: '%1 에 연결한 LED 끄기 %2',
                        neobot_lite_set_output: '%1 에 %2값만큼 출력 %3',

                        get_servo_degree: '%1',
                        neobot_lite_servo_init: '%1 Servo모터 리셋 %2',
                        neobot_lite_servo_change_degree: 'Servo모터 각도 바꾸기 : %1 %2 %3 %4 %5',
                        neobot_lite_servo_rotate: 'Servo모터 회전하기 : %1 %2 %3 %4',
                        neobot_lite_servo_stop: '%1 Servo모터 멈추기 %2',

                        neobot_lite_play_note_for:
                            '멜로디 %1 을(를) %2 옥타브로 %3 길이만큼 소리내기 %4',
                        neobot_lite_play_note_with_sensor:
                            '컨트롤러에서 %1 센서의 %2 ~ %3 값으로 멜로디 연주하기 %4',
                    },
                    Helper: {
                        neobot_lite_sensor_value:
                            'IN1 ~ IN3 포트 및 리모컨에서 입력되는 값 그리고 배터리 정보를 0부터 255의 숫자로 표시합니다.',
                        neobot_lite_sensor_convert_scale:
                            '선택한 포트 입력값의 변화를 특정범위의 값으로 표현범위를 조절할 수 있습니다.',
                        neobot_lite_left_motor:
                            'L모터 포트에 연결한 모터의 회전방향 및 속도를 설정합니다.',
                        neobot_lite_stop_left_motor: 'L모터 포트에 연결한 모터를 정지합니다.',
                        neobot_lite_right_motor:
                            'R모터 포트에 연결한 모터의 회전방향 및 속도를 설정합니다.',
                        neobot_lite_stop_right_motor: 'R모터 포트에 연결한 모터를 정지합니다.',
                        neobot_lite_all_motor:
                            'L모터 및 R모터 포트에 2개 모터를 연결하여 바퀴로 활용할 때 전, 후, 좌, 우 이동 방향 및 속도, 시간을 설정할 수 있습니다.',
                        neobot_lite_stop_all_motor:
                            'L모터 및 R모터에 연결한 모터를 모두 정지합니다.',
                        neobot_lite_set_servo:
                            'OUT1 ~ OUT3에 서보모터를 연결했을 때 0도 ~ 180도 범위 내에서 각도를 조절할 수 있습니다.',
                        neobot_lite_set_output:
                            'OUT1 ~ OUT3에 라이팅블록 및 전자회로를 연결했을 때 출력 전압을 설정할 수 있습니다.</br>0은 0V, 1 ~ 255는 2.4 ~ 4.96V의 전압을 나타냅니다.',
                        neobot_lite_set_fnd: 'FND로 0~99 까지의 숫자를 표시할 수 있습니다.',
                        neobot_lite_set_fnd_off: 'FND에 표시한 숫자를 끌 수 있습니다.',
                        neobot_lite_play_note_for:
                            '주파수 발진 방법을 이용해 멜로디에 반음 단위의 멜로디 음을 발생시킬 수 있습니다.',
                    },
                    Blocks: {
                        //for dropdown
                        neobot_lite_port_1: 'IN1',
                        neobot_lite_port_2: 'IN2',
                        neobot_lite_port_3: 'IN3',
                        neobot_lite_port_4: 'IN4',
                        neobot_lite_port_bat: '배터리',
                        neobot_lite_port_remot: '리모컨',
                        neobot_lite_color_white: '흰색',
                        neobot_lite_color_red: '빨간색',
                        neobot_lite_color_yellow: '노란색',
                        neobot_lite_color_green: '초록색(연두색)',
                        neobot_lite_color_blue: '파란색',
                        neobot_lite_direction_forward: '앞으로',
                        neobot_lite_direction_backward: '뒤로',
                        neobot_lite_sound_silent: '무음',
                        neobot_lite_sound_do: '도',
                        neobot_lite_sound_do_shop: '도#',
                        neobot_lite_sound_re: '레',
                        neobot_lite_sound_re_shop: '레#',
                        neobot_lite_sound_mi: '미',
                        neobot_lite_sound_fa: '파',
                        neobot_lite_sound_fa_shop: '파#',
                        neobot_lite_sound_so: '솔',
                        neobot_lite_sound_so_shop: '솔#',
                        neobot_lite_sound_la: '라',
                        neobot_lite_sound_la_shop: '라#',
                        neobot_lite_sound_ti: '시',
                        neobot_lite_sound_half_note: '2분 음표',
                        neobot_lite_sound_quarter_note: '4분 음표',
                        neobot_lite_sound_eighth_note: '8븐 음표',
                        neobot_lite_sound_sixteenth_note: '16분 음표',
                        neobot_lite_sensor_infrared: '적외선센서',
                        neobot_lite_sensor_light: '빛센서',
                        neobot_lite_sensor_sound: '소리센서',
                        neobot_lite_compare_symbol1: '＝',
                        neobot_lite_compare_symbol2: '＞',
                        neobot_lite_compare_symbol3: '＜',
                        neobot_lite_compare_symbol4: '≥',
                        neobot_lite_compare_symbol5: '≤',
                        neobot_lite_remote_btn_a: 'A',
                        neobot_lite_remote_btn_b: 'B',
                        neobot_lite_remote_btn_c: 'C',
                        neobot_lite_remote_btn_d: 'D',
                        neobot_lite_remote_btn_1: '1',
                        neobot_lite_remote_btn_2: '2',
                        neobot_lite_remote_btn_3: '3',
                        neobot_lite_remote_btn_4: '4',
                        neobot_lite_remote_btn_up: '▲',
                        neobot_lite_remote_btn_down: '▼',
                        neobot_lite_remote_btn_left: '◀',
                        neobot_lite_remote_btn_right: '▶',
                        neobot_lite_duration_cont: '계속',
                        neobot_lite_duration_1s: '1초',
                        neobot_lite_duration_2s: '2초',
                        neobot_lite_duration_3s: '3초',
                        neobot_lite_duration_4s: '4초',
                        neobot_lite_duration_5s: '5초',
                        neobot_lite_duration_6s: '6초',
                        neobot_lite_duration_7s: '7초',
                        neobot_lite_duration_8s: '8초',
                        neobot_lite_duration_9s: '9초',
                        neobot_lite_motor_both: '양쪽',
                        neobot_lite_motor_left: '왼쪽',
                        neobot_lite_motor_right: '오른쪽',
                        neobot_lite_motor_move_forward: '전진',
                        neobot_lite_motor_move_backward: '후진',
                        neobot_lite_motor_move_left: '좌회전',
                        neobot_lite_motor_move_right: '우회전',
                        neobot_lite_motor_move_stop: '정지',
                        // modified string by cky 191205
                        neobot_lite_servo_dir_1: '정방향',
                        neobot_lite_servo_dir_2: '역방향',
                        // added by cky 191205
                        neobot_lite_percent_10: '10%속도',
                        neobot_lite_percent_20: '20%속도',
                        neobot_lite_percent_30: '30%속도',
                        neobot_lite_percent_40: '40%속도',
                        neobot_lite_percent_50: '50%속도',
                        neobot_lite_percent_60: '60%속도',
                        neobot_lite_percent_70: '70%속도',
                        neobot_lite_percent_80: '80%속도',
                        neobot_lite_percent_90: '90%속도',
                        neobot_lite_percent_100: '100%속도',

                        neobot_lite_degree_0: '0도',
                        neobot_lite_degree_5: '5도',
                        neobot_lite_degree_10: '10도',
                        neobot_lite_degree_15: '15도',
                        neobot_lite_degree_20: '20도',
                        neobot_lite_degree_25: '25도',
                        neobot_lite_degree_30: '30도',
                        neobot_lite_degree_35: '35도',
                        neobot_lite_degree_40: '40도',
                        neobot_lite_degree_45: '45도',
                        neobot_lite_degree_50: '50도',
                        neobot_lite_degree_55: '55도',
                        neobot_lite_degree_60: '60도',
                        neobot_lite_degree_65: '65도',
                        neobot_lite_degree_70: '70도',
                        neobot_lite_degree_75: '75도',
                        neobot_lite_degree_80: '80도',
                        neobot_lite_degree_85: '85도',
                        neobot_lite_degree_90: '90도',
                        neobot_lite_degree_95: '95도',
                        neobot_lite_degree_100: '100도',
                        neobot_lite_degree_105: '105도',
                        neobot_lite_degree_110: '110도',
                        neobot_lite_degree_115: '115도',
                        neobot_lite_degree_120: '120도',
                        neobot_lite_degree_125: '125도',
                        neobot_lite_degree_130: '130도',
                        neobot_lite_degree_135: '135도',
                        neobot_lite_degree_140: '140도',
                        neobot_lite_degree_145: '145도',
                        neobot_lite_degree_150: '150도',
                        neobot_lite_degree_155: '155도',
                        neobot_lite_degree_160: '160도',
                        neobot_lite_degree_165: '165도',
                        neobot_lite_degree_170: '170도',
                        neobot_lite_degree_175: '175도',
                        neobot_lite_degree_180: '180도',
                    },
                },
                en: {
                    // en.js에 작성하던 내용
                    template: {
                        neobot_lite_turn_left: 'Rotate left motor %1 %2 %3',
                        neobot_lite_stop_left: 'Stop left motor %1',
                        neobot_lite_turn_right: 'Rotate right motor %1 %2 %3',
                        neobot_lite_stop_right: 'Stop right motor %1',
                        neobot_lite_run_motor: 'Run %1 motor for %2 secs',
                        neobot_lite_servo_1:
                            'Move the servo motor connected to SERVO1 to %2 with the speed of %1 %3',
                        neobot_lite_servo_2:
                            'Move the servo motor connected to SERVO2 to %2 with the speed of %1 %3',
                        neobot_lite_set_sensor_value: '%1 value of the port to %2 %3',

                        neobot_lite_sensor_value: '%1 value',
                        neobot_lite_sensor_connect_external: 'the %2 value connected %1',

                        neobot_lite_sensor_convert_scale:
                            'the value that is changed %1 sensor value %2 ~%3 to %4 ~ %5',

                        neobot_lite_compare_symbol: '%1',
                        neobot_lite_decision_sensor_is_over: '%1 sensor value %2 %3',
                        neobot_lite_decision_equal_with_sensor:
                            'being detected %2 by %1 color sensor',
                        neobot_lite_remote_button: 'pressing button %1 of remote controller',

                        get_motor_speed: '%1',
                        neobot_lite_left_motor: 'Rotate the left motor in %2 for speed %1 %3',
                        neobot_lite_stop_left_motor: 'Stop the left motor %1',
                        neobot_lite_right_motor: 'Rotate the right motor in %2 for speed %1 %3',
                        neobot_lite_stop_right_motor: 'Stop right motor %1',
                        neobot_lite_both_motor:
                            'Rotate the left motor in %2 speed %1 & the right motor in %4 for speed %3 %5',
                        neobot_lite_all_motor: 'Rotate both motors %2 speed %1 for %3 second(s) %4',
                        neobot_lite_stop_all_motor: 'Stop both motors %1',
                        neobot_lite_robot: 'Go %1 the robot %2',

                        neobot_lite_output_led_type1:
                            'Turn on the LED connected %1 in %2 brightness for %3 %4',
                        neobot_lite_output_led_on: 'Turn on the LED connected %1 %2',
                        neobot_lite_output_led_off: 'Turn off the LED connected %1 %2',
                        neobot_lite_set_output: 'Output %1 port value to %2 %3',

                        get_servo_degree: '%1',
                        neobot_lite_servo_init: 'Reset the %1 servo motor %2',
                        neobot_lite_servo_change_degree: 'Change servo angle : %1 %2 %3 %4 %5',
                        neobot_lite_servo_rotate: 'Rotate the servo motor : %1 %2 %3 %4',
                        neobot_lite_servo_stop: 'Stop the %1 servo motor %2',

                        neobot_lite_play_note_for:
                            'Make a sound the melody %1 to %2 octave(s) as %3 %4',
                        neobot_lite_play_note_with_sensor:
                            'Play the melody as %2 ~ %3 value of %1 sensor in the controller %4',
                    },
                    Helper: {
                        neobot_lite_sensor_value:
                            'Indicates the input value from ports IN1 - IN3 and the battery information as number from 0 to 255.',
                        neobot_lite_sensor_convert_scale:
                            "The expressed scale of the selected port's change of input value as the value of a particular scale can be adjusted.",
                        neobot_lite_left_motor:
                            'Sets the wheel direction and speed of the motor connected to L motor port.',
                        neobot_lite_stop_left_motor: 'Stops the motor connected to L motor port.',
                        neobot_lite_right_motor:
                            'Sets the wheel direction and speed of the motor connected to R motor port.',
                        neobot_lite_stop_right_motor: 'Stops the motor connected to R motor port.',
                        neobot_lite_all_motor:
                            'The speed, time, and direction towards front, back, left and right, when connecting 2 motors to L and R motor ports can be set and used as wheels. ',
                        neobot_lite_stop_all_motor:
                            'Stops the motor connected to both L and R motor ports.',
                        neobot_lite_set_servo:
                            'The angle within 0 - 180 degrees when connecting servo motor to OUT1 - OUT3 can be adjusted',
                        neobot_lite_set_output:
                            'The output voltage when connecting lighting block and electronic circuit to OUT1 - OUT3 can be set.</br>0 indicates 0V, and 1 ~ 255 indicates 2.4 ~ 4.96V.',
                        neobot_lite_set_fnd: 'Numbers from 0 to 99 with FND can be indicated.',
                        neobot_lite_set_fnd_off: 'Number indicated on FND can be turned off.',
                        neobot_lite_play_note_for:
                            'Notes in semitone units of the melody can be played by utilizing frequency oscillation. ',
                    },
                    Blocks: {
                        //for dropdown
                        neobot_lite_port_1: 'port1',
                        neobot_lite_port_2: 'port2',
                        neobot_lite_port_3: 'port3',
                        neobot_lite_port_4: 'port4',
                        neobot_lite_port_bat: 'battery',
                        neobot_lite_port_remot: 'remote',
                        neobot_lite_color_white: 'white',
                        neobot_lite_color_red: 'red',
                        neobot_lite_color_yellow: 'yellow',
                        neobot_lite_color_green: 'green',
                        neobot_lite_color_blue: 'blue',
                        neobot_lite_direction_forward: 'forward',
                        neobot_lite_direction_backward: 'backward',
                        neobot_lite_sound_silent: 'silent',
                        neobot_lite_sound_do: 'Do',
                        neobot_lite_sound_do_shop: 'Do#',
                        neobot_lite_sound_re: 'Re',
                        neobot_lite_sound_re_shop: 'Re#',
                        neobot_lite_sound_mi: 'Mi',
                        neobot_lite_sound_fa: 'Fa',
                        neobot_lite_sound_fa_shop: 'Fa#',
                        neobot_lite_sound_so: 'So',
                        neobot_lite_sound_so_shop: 'So#',
                        neobot_lite_sound_la: 'La',
                        neobot_lite_sound_la_shop: 'La#',
                        neobot_lite_sound_ti: 'Ti',
                        neobot_lite_sound_half_note: 'a half note',
                        neobot_lite_sound_quarter_note: 'a quarter note',
                        neobot_lite_sound_eighth_note: 'a eighth note',
                        neobot_lite_sound_sixteenth_note: 'a sixteenth note',
                        neobot_lite_sensor_infrared: 'IR sensor',
                        neobot_lite_sensor_light: 'light sensor',
                        neobot_lite_sensor_sound: 'sound sensor',
                        neobot_lite_compare_symbol1: '＝',
                        neobot_lite_compare_symbol2: '＞',
                        neobot_lite_compare_symbol3: '＜',
                        neobot_lite_compare_symbol4: '≥',
                        neobot_lite_compare_symbol5: '≤',
                        neobot_lite_remote_btn_a: 'A',
                        neobot_lite_remote_btn_b: 'B',
                        neobot_lite_remote_btn_c: 'C',
                        neobot_lite_remote_btn_d: 'D',
                        neobot_lite_remote_btn_1: '1',
                        neobot_lite_remote_btn_2: '2',
                        neobot_lite_remote_btn_3: '3',
                        neobot_lite_remote_btn_4: '4',
                        neobot_lite_remote_btn_up: '▲',
                        neobot_lite_remote_btn_down: '▼',
                        neobot_lite_remote_btn_left: '◀',
                        neobot_lite_remote_btn_right: '▶',
                        neobot_lite_duration_cont: 'constantly',
                        neobot_lite_duration_1s: '1 second',
                        neobot_lite_duration_2s: '2 seconds',
                        neobot_lite_duration_3s: '3 seconds',
                        neobot_lite_duration_4s: '4 seconds',
                        neobot_lite_duration_5s: '5 seconds',
                        neobot_lite_duration_6s: '6 seconds',
                        neobot_lite_duration_7s: '7 seconds',
                        neobot_lite_duration_8s: '8 seconds',
                        neobot_lite_duration_9s: '9 seconds',
                        neobot_lite_motor_both: 'both',
                        neobot_lite_motor_left: 'left',
                        neobot_lite_motor_right: 'right',
                        neobot_lite_motor_move_forward: 'go forward',
                        neobot_lite_motor_move_backward: 'go backward',
                        neobot_lite_motor_move_left: 'turn Left',
                        neobot_lite_motor_move_right: 'turn Right',
                        neobot_lite_motor_move_stop: 'stop',
                        // modified string by cky 191205
                        neobot_lite_servo_dir_1: 'forward',
                        neobot_lite_servo_dir_2: 'backward',
                        // added by cky 191205
                        neobot_lite_percent_10: '10% speed',
                        neobot_lite_percent_20: '20% speed',
                        neobot_lite_percent_30: '30% speed',
                        neobot_lite_percent_40: '40% speed',
                        neobot_lite_percent_50: '50% speed',
                        neobot_lite_percent_60: '60% speed',
                        neobot_lite_percent_70: '70% speed',
                        neobot_lite_percent_80: '80% speed',
                        neobot_lite_percent_90: '90% speed',
                        neobot_lite_percent_100: '100% speed',

                        neobot_lite_degree_0: '0 degree',
                        neobot_lite_degree_5: '5 degrees',
                        neobot_lite_degree_10: '10 degrees',
                        neobot_lite_degree_15: '15 degrees',
                        neobot_lite_degree_20: '20 degrees',
                        neobot_lite_degree_25: '25 degrees',
                        neobot_lite_degree_30: '30 degrees',
                        neobot_lite_degree_35: '35 degrees',
                        neobot_lite_degree_40: '40 degrees',
                        neobot_lite_degree_45: '45 degrees',
                        neobot_lite_degree_50: '50 degrees',
                        neobot_lite_degree_55: '55 degrees',
                        neobot_lite_degree_60: '60 degrees',
                        neobot_lite_degree_65: '65 degrees',
                        neobot_lite_degree_70: '70 degrees',
                        neobot_lite_degree_75: '75 degrees',
                        neobot_lite_degree_80: '80 degrees',
                        neobot_lite_degree_85: '85 degrees',
                        neobot_lite_degree_90: '90 degrees',
                        neobot_lite_degree_95: '95 degrees',
                        neobot_lite_degree_100: '100 degrees',
                        neobot_lite_degree_105: '105 degrees',
                        neobot_lite_degree_110: '110 degrees',
                        neobot_lite_degree_115: '115 degrees',
                        neobot_lite_degree_120: '120 degrees',
                        neobot_lite_degree_125: '125 degrees',
                        neobot_lite_degree_130: '130 degrees',
                        neobot_lite_degree_135: '135 degrees',
                        neobot_lite_degree_140: '140 degrees',
                        neobot_lite_degree_145: '145 degrees',
                        neobot_lite_degree_150: '150 degrees',
                        neobot_lite_degree_155: '155 degrees',
                        neobot_lite_degree_160: '160 degrees',
                        neobot_lite_degree_165: '165 degrees',
                        neobot_lite_degree_170: '170 degrees',
                        neobot_lite_degree_175: '175 degrees',
                        neobot_lite_degree_180: '180degrees',
                    },
                }, //
            };
        }

        getBlocks = function () {
            return {
                //region neobot 네오봇
                neobot_lite_sensor_value: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic_string_field',
                    fontColor: '#fff',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.neobot_lite_port_1, 'IN1'],
                                [Lang.Blocks.neobot_lite_port_2, 'IN2'],
                                [Lang.Blocks.neobot_lite_port_3, 'IN3'],
                                [Lang.Blocks.neobot_lite_port_4, 'BAT'],
                                [Lang.Blocks.neobot_lite_port_remot, 'IR'],
                                [Lang.Blocks.neobot_lite_port_bat, 'BAT'],
                            ],
                            value: 'IN1',
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                    ],
                    events: {},
                    def: {
                        params: [null],
                        type: 'neobot_lite_sensor_value',
                    },
                    paramsKeyMap: {
                        PORT: 0,
                    },
                    class: 'neobot_lite_value',
                    isNotFor: ['NeobotLite'],
                    func: function (sprite, script) {
                        return Entry.NeobotLite.localBuffer[script.getStringField('PORT')];
                    },
                    syntax: { js: [], py: ['Neobot.sensor_value(%1)'] },
                },

                neobot_lite_sensor_connect_external: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic_string_field',
                    fontColor: '#fff',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.neobot_lite_port_1, 'IN1'],
                                [Lang.Blocks.neobot_lite_port_2, 'IN2'],
                                [Lang.Blocks.neobot_lite_port_3, 'IN3'],
                            ],
                            value: 'IN1',
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.neobot_lite_sensor_infrared, '1'],
                                [Lang.Blocks.neobot_lite_sensor_light, '2'],
                                [Lang.Blocks.neobot_lite_sensor_sound, '3'],
                            ],
                            value: '1',
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                    ],
                    events: {},
                    def: {
                        params: [null, null],
                        type: 'neobot_lite_sensor_connect_external',
                    },
                    paramsKeyMap: {
                        PORT: 0,
                    },
                    class: 'neobot_lite_value',
                    isNotFor: ['NeobotLite'],
                    func: function (sprite, script) {
                        return Entry.NeobotLite.localBuffer[script.getStringField('PORT')];
                    },
                },

                neobot_lite_sensor_convert_scale: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic_string_field',
                    fontColor: '#fff',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.neobot_lite_port_1, 'IN1'],
                                [Lang.Blocks.neobot_lite_port_2, 'IN2'],
                                [Lang.Blocks.neobot_lite_port_3, 'IN3'],
                            ],
                            value: 'IN1',
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
                    ],
                    events: {},
                    def: {
                        params: [
                            null,
                            {
                                type: 'number',
                                params: ['0'],
                            },
                            {
                                type: 'number',
                                params: ['255'],
                            },
                            {
                                type: 'number',
                                params: ['0'],
                            },
                            {
                                type: 'number',
                                params: ['100'],
                            },
                        ],
                        type: 'neobot_lite_sensor_convert_scale',
                    },
                    paramsKeyMap: {
                        PORT: 0,
                        OMIN: 1,
                        OMAX: 2,
                        MIN: 3,
                        MAX: 4,
                    },
                    class: 'neobot_lite_value',
                    isNotFor: ['NeobotLite'],
                    func: function (sprite, script) {
                        const value = Entry.NeobotLite.localBuffer[script.getStringField('PORT')];
                        const omin = script.getNumberValue('OMIN', script);
                        const omax = script.getNumberValue('OMAX', script);
                        const min = script.getNumberValue('MIN', script);
                        const max = script.getNumberValue('MAX', script);

                        if (omin > omax) {
                            var temp = omin;
                            omin = omax;
                            omax = temp;
                        }

                        if (min > max) {
                            var temp = min;
                            min = max;
                            max = temp;
                        }

                        value -= omin;
                        value = value * ((max - min) / (omax - omin));
                        value += min;
                        value = Math.min(max, value);
                        value = Math.max(min, value);

                        return Math.round(value);
                    },
                },

                neobot_lite_decision_sensor_is_over: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    fontColor: '#ffffff',
                    skeleton: 'basic_boolean_field',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.neobot_lite_port_1, 'IN1'],
                                [Lang.Blocks.neobot_lite_port_2, 'IN2'],
                                [Lang.Blocks.neobot_lite_port_3, 'IN3'],
                            ],
                            value: 'IN1',
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.neobot_lite_compare_symbol1, '='],
                                [Lang.Blocks.neobot_lite_compare_symbol2, '>'],
                                [Lang.Blocks.neobot_lite_compare_symbol3, '<'],
                                [Lang.Blocks.neobot_lite_compare_symbol4, '>='],
                                [Lang.Blocks.neobot_lite_compare_symbol5, '<='],
                            ],
                            value: '>',
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                        {
                            type: 'Block',
                            accept: 'string',
                        },
                    ],
                    events: {},
                    def: {
                        params: [null, null, 10],
                        type: 'neobot_lite_decision_sensor_is_over',
                    },
                    paramsKeyMap: {
                        SENSOR: 0,
                        SYMBOL: 1,
                        VALUE: 2,
                    },
                    class: 'decision',
                    isNotFor: ['NeobotLite'],
                    func: function (sprite, script) {
                        const sensor =
                            Entry.NeobotLite.localBuffer[script.getStringField('SENSOR')];
                        const symbol = script.getStringField('SYMBOL');
                        const value = Entry.parseNumber(script.getStringValue('VALUE'));

                        if (symbol == '=') {
                            if (sensor == value) return true;
                            else return false;
                        } else if (symbol == '>') {
                            if (sensor > value) return true;
                            else return false;
                        } else if (symbol == '<') {
                            if (sensor < value) return true;
                            else return false;
                        } else if (symbol == '>=') {
                            if (sensor >= value) return true;
                            else return false;
                        } else if (symbol == '<=') {
                            if (sensor <= value) return true;
                            else return false;
                        }
                        return false;
                    },
                },

                neobot_lite_decision_equal_with_sensor: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    fontColor: '#ffffff',
                    skeleton: 'basic_boolean_field',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.neobot_lite_port_1, 'IN1'],
                                [Lang.Blocks.neobot_lite_port_2, 'IN2'],
                                [Lang.Blocks.neobot_lite_port_3, 'IN3'],
                                [Lang.Blocks.neobot_lite_port_4, 'BAT'],
                                [Lang.Blocks.neobot_lite_port_remot, 'IR'],
                                [Lang.Blocks.neobot_lite_port_bat, 'BAT'],
                            ],
                            value: 'IN1',
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.neobot_lite_color_white, 0],
                                [Lang.Blocks.neobot_lite_color_red, 1],
                                [Lang.Blocks.neobot_lite_color_yellow, 2],
                                [Lang.Blocks.neobot_lite_color_green, 3],
                                [Lang.Blocks.neobot_lite_color_blue, 4],
                            ],
                            value: '0',
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                    ],
                    events: {},
                    def: {
                        params: [null, null],
                        type: 'neobot_lite_decision_equal_with_sensor',
                    },
                    paramsKeyMap: {
                        SENSOR: 0,
                        COLOR: 1,
                    },
                    class: 'decision',
                    isNotFor: ['NeobotLite'],
                    func: function (sprite, script) {
                        var sensor = Entry.NeobotLite.localBuffer[script.getStringField('SENSOR')];
                        var color = script.getNumberField('COLOR');

                        if (sensor >= 10 && sensor <= 50) {
                            if (color == 0) return true;
                            else return false;
                        } else if (sensor >= 51 && sensor <= 90) {
                            if (color == 1) return true;
                            else return false;
                        } else if (sensor >= 91 && sensor <= 130) {
                            if (color == 2) return true;
                            else return false;
                        } else if (sensor >= 131 && sensor <= 170) {
                            if (color == 3) return true;
                            else return false;
                        } else if (sensor >= 171 && sensor <= 210) {
                            if (color == 4) return true;
                            else return false;
                        }
                        return false;
                    },
                    syntax: { js: [], py: ['Entry.neobot_lite_equal_check()'] },
                },
                neobot_lite_remote_button: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    fontColor: '#FFFFFF',
                    skeleton: 'basic_boolean_field',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.neobot_lite_remote_btn_a, '1'],
                                [Lang.Blocks.neobot_lite_remote_btn_b, '2'],
                                [Lang.Blocks.neobot_lite_remote_btn_c, '3'],
                                [Lang.Blocks.neobot_lite_remote_btn_d, '4'],
                                [Lang.Blocks.neobot_lite_remote_btn_1, '5'],
                                [Lang.Blocks.neobot_lite_remote_btn_2, '6'],
                                [Lang.Blocks.neobot_lite_remote_btn_3, '7'],
                                [Lang.Blocks.neobot_lite_remote_btn_4, '8'],
                                [Lang.Blocks.neobot_lite_remote_btn_up, '11'],
                                [Lang.Blocks.neobot_lite_remote_btn_down, '12'],
                                [Lang.Blocks.neobot_lite_remote_btn_left, '14'],
                                [Lang.Blocks.neobot_lite_remote_btn_right, '13'],
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
                        type: 'neobot_lite_remote_button',
                    },
                    paramsKeyMap: {
                        KEY: 0,
                    },
                    class: 'remote',
                    isNotFor: ['NeobotLite'],
                    func: function (sprite, script) {
                        var key = script.getNumberField('KEY');
                        var value = Entry.NeobotLite.localBuffer['IR'];
                        if (key >= 5 && key <= 8) key -= 4;
                        if (key == value) {
                            return true;
                        } else {
                            return false;
                        }
                    },
                },

                get_motor_speed: {
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
                                ['7', '7'],
                                ['8', '8'],
                                ['9', '9'],
                                ['10', '10'],
                                ['11', '11'],
                                ['12', '12'],
                                ['13', '13'],
                                ['14', '14'],
                                ['15', '15'],
                            ],
                            value: '5',
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
                        VALUE: 0,
                    },
                    func: function (sprite, script) {
                        return script.getStringField('VALUE');
                    },
                    syntax: { js: [], py: ['%1get_motor_speed#'] },
                },
                neobot_lite_left_motor: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.neobot_lite_direction_forward, '16'],
                                [Lang.Blocks.neobot_lite_direction_backward, '32'],
                            ],
                            value: '16',
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
                                type: 'get_motor_speed',
                                id: 'm111',
                            },
                            null,
                        ],
                        type: 'neobot_lite_left_motor',
                    },
                    paramsKeyMap: {
                        DIRECTION: 0,
                        SPEED: 1,
                    },
                    class: 'neobot_lite_motor',
                    isNotFor: ['NeobotLite'],
                    func: function (sprite, script) {
                        var speed = Entry.parseNumber(script.getStringValue('SPEED'));
                        var direction = script.getNumberField('DIRECTION');

                        // added 210324
                        if (speed === '0') speed = 0;
                        speed = Math.max(speed, 0);
                        speed = Math.min(speed, 15);

                        Entry.NeobotLite.remoteBuffer['DCL'] = direction + speed;
                        return script.callReturn();
                    },
                    syntax: { js: [], py: ['Neobot.turn_left(%1, %2)'] },
                },
                neobot_lite_stop_left_motor: {
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
                        type: 'neobot_lite_stop_left_motor',
                    },
                    class: 'neobot_lite_motor',
                    isNotFor: ['NeobotLite'],
                    func: function (sprite, script) {
                        Entry.NeobotLite.remoteBuffer['DCL'] = 0;
                        return script.callReturn();
                    },
                    syntax: { js: [], py: ['Neobot.stop_left()'] },
                },
                neobot_lite_right_motor: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.neobot_lite_direction_forward, '16'],
                                [Lang.Blocks.neobot_lite_direction_backward, '32'],
                            ],
                            value: '16',
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
                                type: 'get_motor_speed',
                                id: 'm112',
                            },
                            null,
                        ],
                        type: 'neobot_lite_right_motor',
                    },
                    paramsKeyMap: {
                        DIRECTION: 0,
                        SPEED: 1,
                    },
                    class: 'neobot_lite_motor',
                    isNotFor: ['NeobotLite'],
                    func: function (sprite, script) {
                        var speed = Entry.parseNumber(script.getStringValue('SPEED'));
                        var direction = script.getNumberField('DIRECTION');

                        // added 210324
                        if (speed === '0') speed = 0;
                        speed = Math.max(speed, 0);
                        speed = Math.min(speed, 15);

                        Entry.NeobotLite.remoteBuffer['DCR'] = speed + direction;
                        return script.callReturn();
                    },
                    syntax: { js: [], py: ['Neobot.turn_right(%1, %2)'] },
                },
                neobot_lite_stop_right_motor: {
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
                        type: 'neobot_lite_stop_right_motor',
                    },
                    class: 'neobot_lite_motor',
                    isNotFor: ['NeobotLite'],
                    func: function (sprite, script) {
                        Entry.NeobotLite.remoteBuffer['DCR'] = 0;
                        return script.callReturn();
                    },
                    syntax: { js: [], py: ['Neobot.stop_right()'] },
                },
                neobot_lite_both_motor: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.neobot_lite_direction_forward, '16'],
                                [Lang.Blocks.neobot_lite_direction_backward, '32'],
                            ],
                            value: '16',
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                        {
                            type: 'Block',
                            accept: 'string',
                        },
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.neobot_lite_direction_forward, '16'],
                                [Lang.Blocks.neobot_lite_direction_backward, '32'],
                            ],
                            value: '16',
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
                            '16',
                            {
                                type: 'get_motor_speed',
                                id: 'm113',
                            },
                            '16',
                            {
                                type: 'get_motor_speed',
                                id: 'm114',
                            },
                            null,
                        ],
                        type: 'neobot_lite_both_motor',
                    },
                    paramsKeyMap: {
                        DIRECTION_LEFT: 0,
                        SPEED_LEFT: 1,
                        DIRECTION_RIGHT: 2,
                        SPEED_RIGHT: 3,
                    },
                    class: 'neobot_lite_motor',
                    isNotFor: ['NeobotLite'],
                    func: function (sprite, script) {
                        var speed_left = Entry.parseNumber(script.getStringValue('SPEED_LEFT'));
                        var direction_left = script.getNumberField('DIRECTION_LEFT');
                        var speed_right = Entry.parseNumber(script.getStringValue('SPEED_RIGHT'));
                        var direction_right = script.getNumberField('DIRECTION_RIGHT');

                        // added 210324
                        if (speed_left === '0') speed_left = 0;
                        speed_left = Math.max(speed_left, 0);
                        speed_left = Math.min(speed_left, 15);

                        if (speed_right === '0') speed_right = 0;
                        speed_right = Math.max(speed_right, 0);
                        speed_right = Math.min(speed_right, 15);

                        Entry.NeobotLite.remoteBuffer['DCL'] = speed_left + direction_left;
                        Entry.NeobotLite.remoteBuffer['DCR'] = speed_right + direction_right;
                        return script.callReturn();
                    },
                },
                neobot_lite_all_motor: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.neobot_lite_direction_forward, '1'],
                                [Lang.Blocks.neobot_lite_direction_backward, '2'],
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
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.neobot_lite_duration_cont, '0'],
                                [Lang.Blocks.neobot_lite_duration_1s, '1'],
                                [Lang.Blocks.neobot_lite_duration_2s, '2'],
                                [Lang.Blocks.neobot_lite_duration_3s, '3'],
                                [Lang.Blocks.neobot_lite_duration_4s, '4'],
                                [Lang.Blocks.neobot_lite_duration_5s, '5'],
                                [Lang.Blocks.neobot_lite_duration_6s, '6'],
                                [Lang.Blocks.neobot_lite_duration_7s, '7'],
                                [Lang.Blocks.neobot_lite_duration_8s, '8'],
                                [Lang.Blocks.neobot_lite_duration_9s, '9'],
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
                            '1',
                            {
                                type: 'get_motor_speed',
                                id: 'm115',
                            },
                            '0',
                            null,
                        ],
                        type: 'neobot_lite_all_motor',
                    },
                    paramsKeyMap: {
                        DIRECTION: 0,
                        SPEED: 1,
                        DURATION: 2,
                    },
                    class: 'neobot_lite_motor',
                    isNotFor: ['NeobotLite'],
                    func: function (sprite, script) {
                        if (!script.isStart) {
                            var speed = Entry.parseNumber(script.getStringValue('SPEED'));
                            var direction = script.getNumberField('DIRECTION');
                            var duration = script.getNumberField('DURATION');

                            // added 210324
                            if (speed === '0') speed = 0;
                            speed = Math.max(speed, 0);
                            speed = Math.min(speed, 15);

                            switch (direction) {
                                case 1:
                                    Entry.NeobotLite.remoteBuffer['DCL'] = 0x10 + speed;
                                    Entry.NeobotLite.remoteBuffer['DCR'] = 0x10 + speed;
                                    break;
                                case 2:
                                    Entry.NeobotLite.remoteBuffer['DCL'] = 0x20 + speed;
                                    Entry.NeobotLite.remoteBuffer['DCR'] = 0x20 + speed;
                                    break;
                            }

                            if (duration == 0) return script.callReturn();

                            script.isStart = true;
                            script.timeFlag = 1;
                            setTimeout(function () {
                                script.timeFlag = 0;
                            }, duration * 1000);
                            return script;
                        } else if (script.timeFlag == 1) {
                            return script;
                        } else {
                            delete script.timeFlag;
                            delete script.isStart;
                            Entry.NeobotLite.remoteBuffer['DCL'] = 0;
                            Entry.NeobotLite.remoteBuffer['DCR'] = 0;
                            Entry.engine.isContinue = false;
                            return script.callReturn();
                        }
                    },
                },

                neobot_lite_stop_all_motor: {
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
                        type: 'neobot_lite_stop_all_motor',
                    },
                    class: 'neobot_lite_motor',
                    isNotFor: ['NeobotLite'],
                    func: function (sprite, script) {
                        Entry.NeobotLite.remoteBuffer['DCL'] = 0;
                        Entry.NeobotLite.remoteBuffer['DCR'] = 0;
                        return script.callReturn();
                    },
                    syntax: { js: [], py: ['Neobot.run_motor(%1, %2, %3, %4)'] },
                },
                neobot_lite_robot: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.neobot_lite_motor_move_forward, '1'],
                                [Lang.Blocks.neobot_lite_motor_move_backward, '2'],
                                [Lang.Blocks.neobot_lite_motor_move_left, '3'],
                                [Lang.Blocks.neobot_lite_motor_move_right, '4'],
                                [Lang.Blocks.neobot_lite_motor_move_stop, '5'],
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
                        params: [null, null],
                        type: 'neobot_lite_robot',
                    },
                    paramsKeyMap: {
                        MOVE: 0,
                    },
                    class: 'neobot_lite_motor',
                    isNotFor: ['NeobotLite'],
                    func: function (sprite, script) {
                        var move = script.getNumberField('MOVE');
                        switch (move) {
                            case 1:
                                Entry.NeobotLite.remoteBuffer['DCL'] = 0x10 + 10;
                                Entry.NeobotLite.remoteBuffer['DCR'] = 0x10 + 10;
                                break;
                            case 2:
                                Entry.NeobotLite.remoteBuffer['DCL'] = 0x20 + 10;
                                Entry.NeobotLite.remoteBuffer['DCR'] = 0x20 + 10;
                                break;
                            case 3:
                                Entry.NeobotLite.remoteBuffer['DCL'] = 0x20 + 5;
                                Entry.NeobotLite.remoteBuffer['DCR'] = 0x10 + 5;
                                break;
                            case 4:
                                Entry.NeobotLite.remoteBuffer['DCL'] = 0x10 + 5;
                                Entry.NeobotLite.remoteBuffer['DCR'] = 0x20 + 5;
                                break;
                            case 5:
                                Entry.NeobotLite.remoteBuffer['DCL'] = 0;
                                Entry.NeobotLite.remoteBuffer['DCR'] = 0;
                                break;
                        }
                        return script.callReturn();
                    },
                },

                neobot_lite_output_led_type1: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                ['OUT1', 'OUT1'],
                                ['OUT2', 'OUT2'],
                                ['OUT3', 'OUT3'],
                            ],
                            value: 'OUT1',
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                        {
                            type: 'Dropdown',
                            options: [
                                ['100%', '255'],
                                ['90%', '230'],
                                ['80%', '204'],
                                ['70%', '179'],
                                ['60%', '153'],
                                ['50%', '128'],
                                ['40%', '102'],
                                ['30%', '77'],
                                ['20%', '51'],
                                ['10%', '26'],
                            ],
                            value: '255',
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.neobot_lite_duration_cont, '0'],
                                [Lang.Blocks.neobot_lite_duration_1s, '1'],
                                [Lang.Blocks.neobot_lite_duration_2s, '2'],
                                [Lang.Blocks.neobot_lite_duration_3s, '3'],
                                [Lang.Blocks.neobot_lite_duration_4s, '4'],
                                [Lang.Blocks.neobot_lite_duration_5s, '5'],
                                [Lang.Blocks.neobot_lite_duration_6s, '6'],
                                [Lang.Blocks.neobot_lite_duration_7s, '7'],
                                [Lang.Blocks.neobot_lite_duration_8s, '8'],
                                [Lang.Blocks.neobot_lite_duration_9s, '9'],
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
                        params: [null, null, null, null],
                        type: 'neobot_lite_output_led_type1',
                    },
                    paramsKeyMap: {
                        PORT: 0,
                        VALUE: 1,
                        DURATION: 2,
                    },
                    class: 'neobot_lite_output',
                    isNotFor: ['NeobotLite'],
                    func: function (sprite, script) {
                        if (!script.isStart) {
                            var port = script.getStringField('PORT', script);
                            var value = script.getNumberField('VALUE', script);
                            var duration = script.getNumberField('DURATION', script);

                            Entry.NeobotLite.remoteBuffer[port] = value;
                            if (duration == 0) {
                                return script.callReturn();
                            }

                            script.isStart = true;
                            script.timeFlag = 1;
                            setTimeout(function () {
                                Entry.NeobotLite.remoteBuffer[port] = 0;
                                script.timeFlag = 0;
                            }, duration * 1000);
                            return script;
                        } else if (script.timeFlag == 1) {
                            return script;
                        } else {
                            delete script.timeFlag;
                            delete script.isStart;
                            Entry.engine.isContinue = false;
                            return script.callReturn();
                        }
                    },
                },
                neobot_lite_output_led_on: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                ['OUT1', 'OUT1'],
                                ['OUT2', 'OUT2'],
                                ['OUT3', 'OUT3'],
                            ],
                            value: 'OUT1',
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
                        params: [null, null],
                        type: 'neobot_lite_output_led_on',
                    },
                    paramsKeyMap: {
                        PORT: 0,
                    },
                    class: 'neobot_lite_output',
                    isNotFor: ['NeobotLite'],
                    func: function (sprite, script) {
                        var port = script.getStringField('PORT', script);
                        Entry.NeobotLite.remoteBuffer[port] = 255;
                        return script.callReturn();
                    },
                },
                neobot_lite_output_led_off: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                ['OUT1', 'OUT1'],
                                ['OUT2', 'OUT2'],
                                ['OUT3', 'OUT3'],
                            ],
                            value: 'OUT1',
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
                        params: [null, null],
                        type: 'neobot_lite_output_led_off',
                    },
                    paramsKeyMap: {
                        PORT: 0,
                    },
                    class: 'neobot_lite_output',
                    isNotFor: ['NeobotLite'],
                    func: function (sprite, script) {
                        var port = script.getStringField('PORT', script);
                        var option = port;
                        Entry.NeobotLite.remoteBuffer[port] = 0;
                        return script.callReturn();
                    },
                },
                neobot_lite_set_output: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                ['OUT1', 'OUT1'],
                                ['OUT2', 'OUT2'],
                                ['OUT3', 'OUT3'],
                            ],
                            value: 'OUT1',
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
                                type: 'number',
                                params: ['255'],
                            },
                            null,
                        ],
                        type: 'neobot_lite_set_output',
                    },
                    paramsKeyMap: {
                        PORT: 0,
                        VALUE: 1,
                    },
                    class: 'neobot_lite_output',
                    isNotFor: ['NeobotLite'],
                    func: function (sprite, script) {
                        var port = script.getStringField('PORT', script);
                        var value = script.getNumberValue('VALUE', script);
                        var option = port;
                        if (value < 0) {
                            value = 0;
                        } else if (value > 255) {
                            value = 255;
                        }
                        Entry.NeobotLite.remoteBuffer[port] = value;
                        return script.callReturn();
                    },
                },

                // class note
                neobot_lite_play_note_for: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.neobot_lite_sound_silent, '0'],
                                [Lang.Blocks.neobot_lite_sound_do, '1'],
                                [Lang.Blocks.neobot_lite_sound_do_shop, '2'],
                                [Lang.Blocks.neobot_lite_sound_re, '3'],
                                [Lang.Blocks.neobot_lite_sound_re_shop, '4'],
                                [Lang.Blocks.neobot_lite_sound_mi, '5'],
                                [Lang.Blocks.neobot_lite_sound_fa, '6'],
                                [Lang.Blocks.neobot_lite_sound_fa_shop, '7'],
                                [Lang.Blocks.neobot_lite_sound_so, '8'],
                                [Lang.Blocks.neobot_lite_sound_so_shop, '9'],
                                [Lang.Blocks.neobot_lite_sound_la, '10'],
                                [Lang.Blocks.neobot_lite_sound_la_shop, '11'],
                                [Lang.Blocks.neobot_lite_sound_ti, '12'],
                            ],
                            value: '0',
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                        {
                            type: 'Dropdown',
                            options: [
                                ['1', '0'],
                                ['2', '1'],
                                ['3', '2'],
                                ['4', '3'],
                                ['5', '4'],
                                ['6', '5'],
                            ],
                            value: '0',
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.neobot_lite_sound_half_note, '2'],
                                [Lang.Blocks.neobot_lite_sound_quarter_note, '4'],
                                [Lang.Blocks.neobot_lite_sound_eighth_note, '8'],
                                [Lang.Blocks.neobot_lite_sound_sixteenth_note, '16'],
                            ],
                            value: '2',
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
                        params: ['1', '2', '4', null],
                        type: 'neobot_lite_play_note_for',
                    },
                    paramsKeyMap: {
                        NOTE: 0,
                        OCTAVE: 1,
                        DURATION: 2,
                    },
                    class: 'neobot_lite_note',
                    isNotFor: ['NeobotLite'],
                    func: function (sprite, script) {
                        var sq = Entry.NeobotLite.remoteBuffer;

                        if (!script.isStart) {
                            var note = script.getNumberField('NOTE', script);
                            var octave = script.getNumberField('OCTAVE', script);
                            var duration = script.getNumberField('DURATION', script);
                            var value = note > 0 ? note + 12 * octave : 0;

                            script.isStart = true;
                            script.timeFlag = 1;
                            if (value > 65) {
                                value = 65;
                            }
                            sq.SND = value;
                            setTimeout(function () {
                                script.timeFlag = 0;
                            }, (1 / duration) * 2000);
                            return script;
                        } else if (script.timeFlag == 1) {
                            return script;
                        } else {
                            delete script.timeFlag;
                            delete script.isStart;
                            Entry.NeobotLite.remoteBuffer['SND'] = 0;
                            Entry.engine.isContinue = false;
                            return script.callReturn();
                        }
                    },
                    syntax: { js: [], py: ['Neobot.play_note(%1, %2, %3)'] },
                },
                neobot_lite_play_note_with_sensor: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.neobot_lite_port_1, 'IN1'],
                                [Lang.Blocks.neobot_lite_port_2, 'IN2'],
                                [Lang.Blocks.neobot_lite_port_3, 'IN3'],
                                [Lang.Blocks.neobot_lite_port_remot, 'IR'],
                                [Lang.Blocks.neobot_lite_port_bat, 'BAT'],
                            ],
                            value: 'IN1',
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
                                type: 'number',
                                params: ['0'],
                            },
                            {
                                type: 'number',
                                params: ['255'],
                            },
                            null,
                        ],
                        type: 'neobot_lite_play_note_with_sensor',
                    },
                    paramsKeyMap: {
                        PORT: 0,
                        MIN_VALUE: 1,
                        MAX_VALUE: 2,
                        VALUE: 3,
                    },
                    class: 'neobot_lite_note',
                    isNotFor: ['NeobotLite'],
                    func: function (sprite, script) {
                        var sq = Entry.NeobotLite.remoteBuffer;

                        var port = script.getStringField('PORT', script);
                        var value = Entry.NeobotLite.localBuffer[port];
                        var omin = script.getNumberValue('MIN_VALUE', script);
                        var omax = script.getNumberValue('MAX_VALUE', script);
                        var min = 0;
                        var max = 72;

                        if (omin > omax) {
                            var temp = omin;
                            omin = omax;
                            omax = temp;
                        }

                        if (min > max) {
                            var temp = min;
                            min = max;
                            max = temp;
                        }

                        value -= omin;
                        value = value * ((max - min) / (omax - omin));
                        value += min;
                        value = Math.min(max, value);
                        value = Math.max(min, value);

                        value = Math.round(value);

                        if (!script.isStart) {
                            script.isStart = true;
                            script.timeFlag = 1;
                            if (value > 72) {
                                value = 72;
                            }
                            sq.SND = value;
                            setTimeout(function () {
                                script.timeFlag = 0;
                            }, (1 / 4) * 2000);
                            return script;
                        } else if (script.timeFlag == 1) {
                            return script;
                        } else {
                            delete script.timeFlag;
                            delete script.isStart;
                            Entry.NeobotLite.remoteBuffer['SND'] = 0;
                            Entry.engine.isContinue = false;
                            return script.callReturn();
                        }
                    },
                    syntax: {
                        js: [],
                        py: ['Neobot.play_note_with_sensor(%1, %2, %3)'],
                    },
                },

                // class servo
                get_servo_degree: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic_string_field',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.neobot_lite_degree_0, '0'],
                                [Lang.Blocks.neobot_lite_degree_5, '5'],
                                [Lang.Blocks.neobot_lite_degree_10, '10'],
                                [Lang.Blocks.neobot_lite_degree_15, '15'],
                                [Lang.Blocks.neobot_lite_degree_20, '20'],
                                [Lang.Blocks.neobot_lite_degree_25, '25'],
                                [Lang.Blocks.neobot_lite_degree_30, '30'],
                                [Lang.Blocks.neobot_lite_degree_35, '35'],
                                [Lang.Blocks.neobot_lite_degree_40, '40'],
                                [Lang.Blocks.neobot_lite_degree_45, '45'],
                                [Lang.Blocks.neobot_lite_degree_50, '50'],
                                [Lang.Blocks.neobot_lite_degree_55, '55'],
                                [Lang.Blocks.neobot_lite_degree_60, '60'],
                                [Lang.Blocks.neobot_lite_degree_65, '65'],
                                [Lang.Blocks.neobot_lite_degree_70, '70'],
                                [Lang.Blocks.neobot_lite_degree_75, '75'],
                                [Lang.Blocks.neobot_lite_degree_80, '80'],
                                [Lang.Blocks.neobot_lite_degree_85, '85'],
                                [Lang.Blocks.neobot_lite_degree_90, '90'],
                                [Lang.Blocks.neobot_lite_degree_95, '95'],
                                [Lang.Blocks.neobot_lite_degree_100, '100'],
                                [Lang.Blocks.neobot_lite_degree_105, '105'],
                                [Lang.Blocks.neobot_lite_degree_110, '110'],
                                [Lang.Blocks.neobot_lite_degree_115, '115'],
                                [Lang.Blocks.neobot_lite_degree_120, '120'],
                                [Lang.Blocks.neobot_lite_degree_125, '125'],
                                [Lang.Blocks.neobot_lite_degree_130, '130'],
                                [Lang.Blocks.neobot_lite_degree_135, '135'],
                                [Lang.Blocks.neobot_lite_degree_140, '140'],
                                [Lang.Blocks.neobot_lite_degree_145, '145'],
                                [Lang.Blocks.neobot_lite_degree_150, '150'],
                                [Lang.Blocks.neobot_lite_degree_155, '155'],
                                [Lang.Blocks.neobot_lite_degree_160, '160'],
                                [Lang.Blocks.neobot_lite_degree_165, '165'],
                                [Lang.Blocks.neobot_lite_degree_170, '170'],
                                [Lang.Blocks.neobot_lite_degree_175, '175'],
                                [Lang.Blocks.neobot_lite_degree_180, '180'],
                            ],
                            value: '90',
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
                        VALUE: 0,
                    },
                    func: function (sprite, script) {
                        return script.getStringField('VALUE');
                    },
                    syntax: { js: [], py: ['%1get_servo_degree#'] },
                },
                neobot_lite_servo_init: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                ['OUT1', 'OUT1'],
                                ['OUT2', 'OUT2'],
                                ['OUT1&2', 'ALL'],
                            ],
                            value: 'OUT1',
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
                        params: [null, null],
                        type: 'neobot_lite_servo_init',
                    },
                    paramsKeyMap: {
                        PORT: 0,
                    },
                    class: 'neobot_lite_servo',
                    isNotFor: ['NeobotLite'],
                    func: function (sprite, script) {
                        if (!script.isStart) {
                            var port = script.getStringField('PORT', script);
                            if (port == 'ALL') {
                                Entry.NeobotLite.remoteBuffer['OUT1'] = 0xba;
                                Entry.NeobotLite.remoteBuffer['OUT2'] = 0xba;

                                script.isStart = true;
                                script.timeFlag = 1;
                                setTimeout(function () {
                                    Entry.NeobotLite.remoteBuffer['OUT1'] = 0x01;
                                    Entry.NeobotLite.remoteBuffer['OUT2'] = 0x01;
                                    script.timeFlag = 0;
                                }, 200);
                            } else {
                                Entry.NeobotLite.remoteBuffer[port] = 0xba;

                                script.isStart = true;
                                script.timeFlag = 1;
                                setTimeout(function () {
                                    Entry.NeobotLite.remoteBuffer[port] = 0x01;
                                    script.timeFlag = 0;
                                }, 200);
                            }
                            return script;
                        } else if (script.timeFlag == 1) {
                            return script;
                        } else {
                            delete script.timeFlag;
                            delete script.isStart;
                            Entry.engine.isContinue = false;
                            return script.callReturn();
                        }
                    },
                },

                // integrated by cky 191205 from neobot_lite_servo_turn_typeX
                neobot_lite_servo_change_degree: {
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
                                ['OUT1', 'OUT1'],
                                ['OUT2', 'OUT2'],
                                ['OUT1&2', 'ALL'],
                            ],
                            value: 'OUT1',
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.neobot_lite_servo_dir_1, '1'],
                                [Lang.Blocks.neobot_lite_servo_dir_2, '2'],
                            ],
                            value: '1',
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.neobot_lite_percent_10, '9'],
                                [Lang.Blocks.neobot_lite_percent_20, '8'],
                                [Lang.Blocks.neobot_lite_percent_30, '7'],
                                [Lang.Blocks.neobot_lite_percent_40, '6'],
                                [Lang.Blocks.neobot_lite_percent_50, '5'],
                                [Lang.Blocks.neobot_lite_percent_60, '4'],
                                [Lang.Blocks.neobot_lite_percent_70, '3'],
                                [Lang.Blocks.neobot_lite_percent_80, '2'],
                                [Lang.Blocks.neobot_lite_percent_90, '1'],
                                [Lang.Blocks.neobot_lite_percent_100, '0'],
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
                                type: 'get_servo_degree',
                                id: 'm211',
                            },
                            null,
                            null,
                            null,
                            null,
                        ],
                        type: 'neobot_lite_servo_change_degree',
                    },
                    paramsKeyMap: {
                        DEGREE: 0,
                        PORT: 1,
                        DIRECTION: 2,
                        SPEED: 3,
                    },
                    class: 'neobot_lite_servo',
                    isNotFor: ['NeobotLite'],
                    func: function (sprite, script) {
                        if (!script.isStart) {
                            var degree = Entry.parseNumber(script.getStringValue('DEGREE'));
                            var port = script.getStringField('PORT', script);
                            var direction = script.getNumberField('DIRECTION');
                            var speed = script.getNumberField('SPEED');

                            if (port == 'ALL') {
                                switch (direction) {
                                    case 1:
                                        Entry.NeobotLite.remoteBuffer['OUT1'] = 0xbc;
                                        Entry.NeobotLite.remoteBuffer['OUT2'] = 0xbc;
                                        break;
                                    case 2:
                                        Entry.NeobotLite.remoteBuffer['OUT1'] = 0xbd;
                                        Entry.NeobotLite.remoteBuffer['OUT2'] = 0xbd;
                                        break;
                                }

                                script.isStart = true;
                                script.timeFlag = 1;
                                setTimeout(function () {
                                    // for speed
                                    Entry.NeobotLite.remoteBuffer['OUT1'] = 0xfa - speed;
                                    Entry.NeobotLite.remoteBuffer['OUT2'] = 0xfa - speed;
                                    setTimeout(function () {
                                        // for degree
                                        if (degree > 180) {
                                            degree = 180;
                                        }
                                        if (degree < 0) {
                                            degree = 0;
                                        }
                                        degree = degree + 0x01;
                                        degree *= 1;
                                        Entry.NeobotLite.remoteBuffer['OUT1'] = degree;
                                        Entry.NeobotLite.remoteBuffer['OUT2'] = degree;
                                        script.timeFlag = 0;
                                    }, 200);
                                }, 200);
                            } else {
                                switch (direction) {
                                    case 1:
                                        Entry.NeobotLite.remoteBuffer[port] = 0xbc;
                                        break;
                                    case 2:
                                        Entry.NeobotLite.remoteBuffer[port] = 0xbd;
                                        break;
                                }

                                script.isStart = true;
                                script.timeFlag = 1;
                                setTimeout(function () {
                                    // for speed
                                    Entry.NeobotLite.remoteBuffer[port] = 0xfa - speed;
                                    setTimeout(function () {
                                        // for degree
                                        if (degree > 180) {
                                            degree = 180;
                                        }
                                        if (degree < 0) {
                                            degree = 0;
                                        }
                                        degree = degree + 0x01;
                                        degree *= 1;
                                        Entry.NeobotLite.remoteBuffer[port] = degree;
                                        script.timeFlag = 0;
                                    }, 200);
                                }, 200);
                            }

                            return script;
                        } else if (script.timeFlag == 1) {
                            return script;
                        } else {
                            delete script.timeFlag;
                            delete script.isStart;
                            Entry.engine.isContinue = false;
                            return script.callReturn();
                        }
                    },
                },
                neobot_lite_servo_rotate: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                ['OUT1', 'OUT1'],
                                ['OUT2', 'OUT2'],
                                ['OUT1&2', 'ALL'],
                            ],
                            value: 'OUT1',
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.neobot_lite_servo_dir_1, '1'],
                                [Lang.Blocks.neobot_lite_servo_dir_2, '2'],
                            ],
                            value: '1',
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.neobot_lite_percent_10, '0'],
                                [Lang.Blocks.neobot_lite_percent_20, '1'],
                                [Lang.Blocks.neobot_lite_percent_30, '2'],
                                [Lang.Blocks.neobot_lite_percent_40, '3'],
                                [Lang.Blocks.neobot_lite_percent_50, '4'],
                                [Lang.Blocks.neobot_lite_percent_60, '5'],
                                [Lang.Blocks.neobot_lite_percent_70, '6'],
                                [Lang.Blocks.neobot_lite_percent_80, '7'],
                                [Lang.Blocks.neobot_lite_percent_90, '8'],
                                [Lang.Blocks.neobot_lite_percent_100, '9'],
                            ],
                            value: '9',
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
                        params: [null, null, null, null],
                        type: 'neobot_lite_servo_rotate',
                    },
                    paramsKeyMap: {
                        PORT: 0,
                        DIRECTION: 1,
                        SPEED: 2,
                    },
                    class: 'neobot_lite_servo',
                    isNotFor: ['NeobotLite'],
                    func: function (sprite, script) {
                        var port = script.getStringField('PORT', script);
                        var direction = script.getNumberField('DIRECTION');
                        var speed = script.getNumberField('SPEED');

                        if (port == 'ALL') {
                            switch (direction) {
                                case 1:
                                    Entry.NeobotLite.remoteBuffer['OUT1'] = 0xc0 + (speed + 0x01);
                                    Entry.NeobotLite.remoteBuffer['OUT2'] = 0xc0 + (speed + 0x01);
                                    break;
                                case 2:
                                    Entry.NeobotLite.remoteBuffer['OUT1'] = 0xd0 + (speed + 0x01);
                                    Entry.NeobotLite.remoteBuffer['OUT2'] = 0xd0 + (speed + 0x01);
                                    break;
                            }
                        } else {
                            switch (direction) {
                                case 1:
                                    Entry.NeobotLite.remoteBuffer[port] = 0xc0 + (speed + 0x01);
                                    break;
                                case 2:
                                    Entry.NeobotLite.remoteBuffer[port] = 0xd0 + (speed + 0x01);
                                    break;
                            }
                        }
                        return script.callReturn();
                    },
                },
                neobot_lite_servo_stop: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                ['OUT1', 'OUT1'],
                                ['OUT2', 'OUT2'],
                                ['OUT1&2', 'ALL'],
                            ],
                            value: 'OUT1',
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
                        params: [null, null],
                        type: 'neobot_lite_servo_stop',
                    },
                    paramsKeyMap: {
                        PORT: 0,
                    },
                    class: 'neobot_lite_servo',
                    isNotFor: ['NeobotLite'],
                    func: function (sprite, script) {
                        var port = script.getStringField('PORT', script);
                        if (port == 'ALL') {
                            Entry.NeobotLite.remoteBuffer['OUT1'] = 0xfe;
                            Entry.NeobotLite.remoteBuffer['OUT2'] = 0xfe;
                        } else {
                            Entry.NeobotLite.remoteBuffer[port] = 0xfe;
                        }
                        return script.callReturn();
                    },
                },
            };
        };
    })();
})();

module.exports = Entry.NeobotLite;