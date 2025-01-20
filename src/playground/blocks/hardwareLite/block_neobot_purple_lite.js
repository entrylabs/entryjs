'use strict';
(function() {
    const HEADER = [0xab, 0xcd];
    Entry.NeobotPurpleLite = new (class NeobotPurpleLite {
        constructor() {
            this.id = '050501';
            this.name = 'NeobotPurpleLite';
            this.url = 'http://neobot.co.kr/';
            this.imageName = 'neobot_purple_lite.png';
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
                DCL: 0,
                DCR: 0,
                SND: 0,
                FND: 0,
                OPT: 0,
            };
            this.log_to_console = false;

            this.blockMenuBlocks = [
                // sensor
                'neobot_purple_lite_sensor_title',
                'neobot_purple_lite_sensor_value',
                'neobot_purple_lite_sensor_convert_scale',
                'neobot_purple_lite_decision_sensor_is_over',
                'neobot_purple_lite_decision_equal_with_sensor',
                'neobot_purple_lite_decision_sensor_angle',
                'neobot_purple_lite_remote_button',

                // led
                'neobot_purple_lite_led_title',
                'neobot_purple_lite_led_on',
                'neobot_purple_lite_led_brightness_with_sensor',
                'neobot_purple_lite_color_led_on',
                'neobot_purple_lite_output_led_off',

                // output
                'neobot_purple_lite_output_title',
                'neobot_purple_lite_set_output',

                //  motor
                'neobot_purple_lite_motor_title',
                'neobot_purple_lite_robot',
                'neobot_purple_lite_motor_start',
                'neobot_purple_lite_motor_stop',

                // servo
                'neobot_purple_lite_servo_title',
                'neobot_purple_lite_servo_init',
                'neobot_purple_lite_servo_rotate',
                'neobot_purple_lite_servo_stop',
                'neobot_purple_lite_servo_change_degree',

                // melody
                'neobot_purple_lite_buzzer_title',
                'neobot_purple_lite_play_note_for',
                'neobot_purple_lite_melody_play_with_sensor',
                'neobot_purple_lite_melody_stop',
            ];

            this.setZero();
        }

        get monitorTemplate() {
            return {
                imgPath: 'hw/neobot_purple.png',
                width: 700,
                height: 700,
                listPorts: {
                    IR: { name: '리모컨', type: 'input', pos: { x: 0, y: 0 } },
                    BAT: { name: '배터리', type: 'input', pos: { x: 0, y: 0 } },
                    SND: {
                        name: Lang.Hw.buzzer,
                        type: 'output',
                        pos: { x: 0, y: 0 },
                    },
                    FND: { name: 'FND', type: 'output', pos: { x: 0, y: 0 } },
                },
                ports: {
                    IN1: {
                        name: 'IN1',
                        type: 'input',
                        pos: { x: 270, y: 200 },
                    },
                    IN2: {
                        name: 'IN2',
                        type: 'input',
                        pos: { x: 325, y: 200 },
                    },
                    IN3: {
                        name: 'IN3',
                        type: 'input',
                        pos: { x: 325, y: 500 },
                    },
                    DCL: {
                        name: 'L-Motor',
                        type: 'output',
                        pos: { x: 270, y: 500 },
                    },
                    DCR: {
                        name: 'R-Motor',
                        type: 'output',
                        pos: { x: 435, y: 500 },
                    },
                    OUT1: {
                        name: 'OUT1',
                        type: 'output',
                        pos: { x: 380, y: 200 },
                    },
                    OUT2: {
                        name: 'OUT2',
                        type: 'output',
                        pos: { x: 435, y: 200 },
                    },
                    OUT3: {
                        name: 'OUT3',
                        type: 'output',
                        pos: { x: 380, y: 500 },
                    },
                },
                mode: 'both',
            };
        }

        getMonitorPort() {
            return { ...this.localBuffer, ...this.remoteBuffer };
        }

        setZero() {
            this.remoteBuffer = {
                OUT1: 0,
                OUT2: 0,
                OUT3: 0,
                DCL: 0,
                DCR: 0,
                SND: 0,
                FND: 0,
                OPT: 0,
            };
            if (Entry.hwLite && Entry.hwLite.serial) {
                Entry.hwLite.serial.update();
            }
        }

        handleLocalData(data) {
            let validPdu = this.getValidPdu(data);
            while (validPdu) {
                this.onReceivePdu(validPdu);
                if (!this.remainingPdu || this.remainingPdu.length <= 0) {
                    break;
                }
                validPdu = this.getValidPdu([]);
            }
        }

        onReceivePdu(pdu) {
            if (pdu[0] === HEADER[0] && pdu[1] === HEADER[1]) {
                this.localBuffer['IN1'] = pdu[2];
                this.localBuffer['IN2'] = pdu[3];
                this.localBuffer['IN3'] = pdu[4];
                this.localBuffer['IR'] = pdu[5];
                this.localBuffer['BAT'] = pdu[6];
            }
        }

        getValidPdu(pdu) {
            const mergedPdu = [];
            if (this.remainingPdu) {
                mergedPdu.push(...this.remainingPdu);
                this.remainingPdu = null;
            }
            mergedPdu.push(...pdu);
            if (mergedPdu.length < 2) {
                this.remainingPdu = [...mergedPdu];
                return null;
            }

            // 헤더 불일치는 버림
            if (!this.checkHeader(mergedPdu)) {
                return null;
            }

            // 유효 데이터 길이는 header 2 + body 5 + checksum 1 = 8
            const validDataLength = 8;
            /*
            전체 길이가 유효 데이터 길이보다 작을 경우
            아직 도착하지 않은 부분이 있으므로 병합을 위해 remainingPdu 에 저장
             */
            if (mergedPdu.length < validDataLength) {
                this.remainingPdu = [...mergedPdu];
                return null;
            }

            /*
            전체 길이가 유효 데이터 길이보다 클 경우
            유효한 부분만 잘라내고 나머지는 remainingPdu 에 저장
             */
            if (mergedPdu.length > validDataLength) {
                this.remainingPdu = mergedPdu.slice(validDataLength, mergedPdu.length);
            }

            const validPdu = mergedPdu.slice(0, validDataLength);

            /*
            유효 Pdu 의 checksum 확인
             */
            const dataLength = 5;
            let checkSum = 0;
            for (let i = 0; i < dataLength; i++) {
                checkSum += validPdu[i + 2];
            }
            checkSum = checkSum & 255;
            const pduCheckSum = validPdu[7];
            if (pduCheckSum !== checkSum) {
                return null;
            }

            return validPdu;
        }

        checkHeader(pdu) {
            if (pdu.length < HEADER.length) {
                return false;
            }

            for (let i = 0; i < HEADER.length; i++) {
                if (HEADER[i] !== pdu[i]) {
                    return false;
                }
            }

            return true;
        }

        requestLocalData() {
            const requestData = [];

            // 시작 바이트
            requestData.push(0xcd);
            requestData.push(0xab);

            let checksum = 0;
            let isFnd = false;
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
                        // sensor
                        neobot_purple_lite_sensor_title: '센서',
                        neobot_purple_lite_sensor_value: '%1',
                        neobot_purple_lite_sensor_convert_scale: '%1 %2 ~ %3 를 %4 ~ %5 으로 변환',
                        neobot_purple_lite_decision_sensor_is_over: '%1 %2 %3',
                        neobot_purple_lite_decision_equal_with_sensor: '%1 컬러가 %2',
                        neobot_purple_lite_decision_sensor_angle: '%1 각도 %2 %3',
                        neobot_purple_lite_remote_button: '리모컨 버튼 %1 을 누름',

                        // LED
                        neobot_purple_lite_led_title: 'LED',
                        neobot_purple_lite_arg_led_duration: '%1',
                        neobot_purple_lite_led_on: 'LED 켜기   %1 %2 %3 %4',
                        neobot_purple_lite_output_led_off: '%1 LED 끄기 %2',
                        neobot_purple_lite_led_brightness_with_sensor: '%1 로 %2 LED 제어 %3',
                        neobot_purple_lite_color_led_on: '%1 컬러LED 켜기   R %2 G %3 B %4 %5',

                        // output
                        neobot_purple_lite_output_title: '출력',
                        neobot_purple_lite_set_output: '%1 에 %2 값 출력하기 %3',

                        // motor
                        neobot_purple_lite_motor_title: '회전모터',
                        neobot_purple_lite_robot: '로봇 %1 %2',
                        neobot_purple_lite_motor_start: '모터 회전하기   %1 %2 %3 %4 %5',
                        neobot_purple_lite_motor_stop: '%1 모터 멈추기 %2',
                        neobot_purple_lite_arg_motor_speed: '%1',
                        neobot_purple_lite_arg_motor_duration: '%1',

                        // melody
                        neobot_purple_lite_buzzer_title: '버저',
                        neobot_purple_lite_play_note_for:
                            '버저 울리기   옥타브: %2 음: %1 길이: %3 %4',
                        neobot_purple_lite_melody_play_with_sensor: '%1 센서로 버저 울리기 %2',
                        neobot_purple_lite_melody_stop: '버저 멈추기 %1',

                        // servo
                        neobot_purple_lite_servo_title: '서보모터',
                        get_servo_degree: '%1',
                        neobot_purple_lite_servo_init: '%1 서보모터 리셋 %2',
                        neobot_purple_lite_servo_rotate: '서보모터 회전하기   %1 %2 %3 %4',
                        neobot_purple_lite_servo_stop: '%1 서보모터 멈추기 %2',
                        neobot_purple_lite_servo_change_degree:
                            '서보모터 각도 바꾸기   %2 %3 %4 %1 %5',
                    },
                    Blocks: {
                        //for dropdown
                        neobot_purple_lite_port_1: 'IN1',
                        neobot_purple_lite_port_2: 'IN2',
                        neobot_purple_lite_port_3: 'IN3',
                        neobot_purple_lite_port_4: 'IN4',
                        neobot_purple_lite_port_12: 'IN1 & IN2',
                        neobot_purple_lite_port_bat: '배터리',
                        neobot_purple_lite_port_remot: '리모컨',
                        neobot_purple_lite_color_white: '흰색',
                        neobot_purple_lite_color_red: '빨강',
                        neobot_purple_lite_color_yellow: '노랑',
                        neobot_purple_lite_color_green: '녹색',
                        neobot_purple_lite_color_blue: '파랑',
                        neobot_purple_lite_direction_forward: '앞으로',
                        neobot_purple_lite_direction_backward: '뒤로',
                        neobot_purple_lite_sound_silent: '무음',
                        neobot_purple_lite_sound_do: '도',
                        neobot_purple_lite_sound_do_shop: '도#',
                        neobot_purple_lite_sound_re: '레',
                        neobot_purple_lite_sound_re_shop: '레#',
                        neobot_purple_lite_sound_mi: '미',
                        neobot_purple_lite_sound_fa: '파',
                        neobot_purple_lite_sound_fa_shop: '파#',
                        neobot_purple_lite_sound_so: '솔',
                        neobot_purple_lite_sound_so_shop: '솔#',
                        neobot_purple_lite_sound_la: '라',
                        neobot_purple_lite_sound_la_shop: '라#',
                        neobot_purple_lite_sound_ti: '시',
                        neobot_purple_lite_sound_half_note: '2분 음표',
                        neobot_purple_lite_sound_quarter_note: '4분 음표',
                        neobot_purple_lite_sound_eighth_note: '8분 음표',
                        neobot_purple_lite_sound_sixteenth_note: '16분 음표',
                        neobot_purple_lite_sensor_infrared: '적외선센서',
                        neobot_purple_lite_sensor_light: '빛센서',
                        neobot_purple_lite_sensor_sound: '소리센서',
                        neobot_purple_lite_compare_symbol1: '＝',
                        neobot_purple_lite_compare_symbol2: '＞',
                        neobot_purple_lite_compare_symbol3: '＜',
                        neobot_purple_lite_compare_symbol4: '≥',
                        neobot_purple_lite_compare_symbol5: '≤',
                        neobot_purple_lite_remote_btn_a: 'A',
                        neobot_purple_lite_remote_btn_b: 'B',
                        neobot_purple_lite_remote_btn_c: 'C',
                        neobot_purple_lite_remote_btn_d: 'D',
                        neobot_purple_lite_remote_btn_1: '1',
                        neobot_purple_lite_remote_btn_2: '2',
                        neobot_purple_lite_remote_btn_3: '3',
                        neobot_purple_lite_remote_btn_4: '4',
                        neobot_purple_lite_remote_btn_up: '▲',
                        neobot_purple_lite_remote_btn_down: '▼',
                        neobot_purple_lite_remote_btn_left: '◀',
                        neobot_purple_lite_remote_btn_right: '▶',
                        neobot_purple_lite_duration_cont: '계속',
                        neobot_purple_lite_duration_1s: '1초',
                        neobot_purple_lite_duration_2s: '2초',
                        neobot_purple_lite_duration_3s: '3초',
                        neobot_purple_lite_duration_4s: '4초',
                        neobot_purple_lite_duration_5s: '5초',
                        neobot_purple_lite_duration_6s: '6초',
                        neobot_purple_lite_duration_7s: '7초',
                        neobot_purple_lite_duration_8s: '8초',
                        neobot_purple_lite_duration_9s: '9초',
                        neobot_purple_lite_motor_both: '양쪽',
                        neobot_purple_lite_motor_left: '왼쪽',
                        neobot_purple_lite_motor_right: '오른쪽',
                        neobot_purple_lite_motor_move_forward: '전진',
                        neobot_purple_lite_motor_move_backward: '후진',
                        neobot_purple_lite_motor_move_left: '좌회전',
                        neobot_purple_lite_motor_move_right: '우회전',
                        neobot_purple_lite_motor_move_stop: '정지',

                        neobot_purple_lite_servo_dir_1: '정방향',
                        neobot_purple_lite_servo_dir_2: '역방향',

                        neobot_purple_lite_percent_10: '10%속도',
                        neobot_purple_lite_percent_20: '20%속도',
                        neobot_purple_lite_percent_30: '30%속도',
                        neobot_purple_lite_percent_40: '40%속도',
                        neobot_purple_lite_percent_50: '50%속도',
                        neobot_purple_lite_percent_60: '60%속도',
                        neobot_purple_lite_percent_70: '70%속도',
                        neobot_purple_lite_percent_80: '80%속도',
                        neobot_purple_lite_percent_90: '90%속도',
                        neobot_purple_lite_percent_100: '100%속도',

                        neobot_purple_lite_angle_0: '0도',
                        neobot_purple_lite_angle_5: '5도',
                        neobot_purple_lite_angle_10: '10도',
                        neobot_purple_lite_angle_15: '15도',
                        neobot_purple_lite_angle_20: '20도',
                        neobot_purple_lite_angle_25: '25도',
                        neobot_purple_lite_angle_30: '30도',
                        neobot_purple_lite_angle_35: '35도',
                        neobot_purple_lite_angle_40: '40도',
                        neobot_purple_lite_angle_45: '45도',
                        neobot_purple_lite_angle_50: '50도',
                        neobot_purple_lite_angle_55: '55도',
                        neobot_purple_lite_angle_60: '60도',
                        neobot_purple_lite_angle_65: '65도',
                        neobot_purple_lite_angle_70: '70도',
                        neobot_purple_lite_angle_75: '75도',
                        neobot_purple_lite_angle_80: '80도',
                        neobot_purple_lite_angle_85: '85도',
                        neobot_purple_lite_angle_90: '90도',
                        neobot_purple_lite_angle_95: '95도',
                        neobot_purple_lite_angle_100: '100도',
                        neobot_purple_lite_angle_105: '105도',
                        neobot_purple_lite_angle_110: '110도',
                        neobot_purple_lite_angle_115: '115도',
                        neobot_purple_lite_angle_120: '120도',
                        neobot_purple_lite_angle_125: '125도',
                        neobot_purple_lite_angle_130: '130도',
                        neobot_purple_lite_angle_135: '135도',
                        neobot_purple_lite_angle_140: '140도',
                        neobot_purple_lite_angle_145: '145도',
                        neobot_purple_lite_angle_150: '150도',
                        neobot_purple_lite_angle_155: '155도',
                        neobot_purple_lite_angle_160: '160도',
                        neobot_purple_lite_angle_165: '165도',
                        neobot_purple_lite_angle_170: '170도',
                        neobot_purple_lite_angle_175: '175도',
                        neobot_purple_lite_angle_180: '180도',

                        neobot_purple_lite_out_all: '모든',
                        neobot_purple_lite_direction_left: '왼쪽으로',
                        neobot_purple_lite_direction_right: '오른쪽으로',
                    },
                },
                en: {
                    // en.js에 작성하던 내용
                    template: {
                        // sensor
                        neobot_purple_lite_sensor_title: 'Sensor',
                        neobot_purple_lite_sensor_value: '%1',
                        neobot_purple_lite_sensor_convert_scale:
                            "%1 's changed value   range: %2 ~ %3 conversion: %4 ~ %5",
                        neobot_purple_lite_decision_sensor_is_over: '%1 %2 %3',
                        neobot_purple_lite_decision_equal_with_sensor: "%1 's color is %2",
                        neobot_purple_lite_decision_sensor_angle: '%1 angle %2 %3',
                        neobot_purple_lite_remote_button: 'pressing button %1 of remote controller',

                        // LED
                        neobot_purple_lite_led_title: 'LED',
                        neobot_purple_lite_arg_led_duration: '%1',
                        neobot_purple_lite_led_on: 'Turn on the LED    %1 %2 %3 %4',
                        neobot_purple_lite_output_led_off: 'Turn off the %1 LED %2',
                        neobot_purple_lite_led_brightness_with_sensor:
                            "Control %2 LED's brightness with %1 sensor %3",
                        neobot_purple_lite_color_led_on:
                            'Turn on the %1 color LED   R %2 G %3 B %4 %5',

                        // output
                        neobot_purple_lite_output_title: 'Set output',
                        neobot_purple_lite_set_output: 'Output %2 value to %1 port %3',

                        // motor
                        neobot_purple_lite_motor_title: 'Motor',
                        neobot_purple_lite_robot: 'Robot %1 %2',
                        neobot_purple_lite_motor_start: 'Motor operation   %1 %2 %3 %4 %5',
                        neobot_purple_lite_motor_stop: 'Stop the %1 motor(s) %2',
                        neobot_purple_lite_arg_motor_speed: '%1',
                        neobot_purple_lite_arg_motor_duration: '%1',

                        // melody
                        neobot_purple_lite_buzzer_title: 'Buzzer',
                        neobot_purple_lite_play_note_for:
                            'Buzzer   octave: %1 scale: %2 note: %3 %4',
                        neobot_purple_lite_melody_play_with_sensor:
                            'Buzzer rings by %1 sensor value %2',
                        neobot_purple_lite_melody_stop: 'Stop the buzzer %1',

                        // servo
                        neobot_purple_lite_servo_title: 'Servo motor',
                        neobot_purple_lite_servo_init: 'Reset the %1 servo motor %2',
                        neobot_purple_lite_servo_rotate: 'Rotate the servo motor   %1 %2 %3 %4',
                        neobot_purple_lite_servo_stop: 'Stop the %1 servo motor %2',
                        neobot_purple_lite_servo_change_degree:
                            'Change servo angle   %1 %2 %3 %4 %5',
                    },
                    Blocks: {
                        //for dropdown
                        neobot_purple_lite_port_1: 'IN1',
                        neobot_purple_lite_port_2: 'IN2',
                        neobot_purple_lite_port_3: 'IN3',
                        neobot_purple_lite_port_4: 'IN4',
                        neobot_purple_lite_port_12: 'IN1 & IN2',
                        neobot_purple_lite_port_bat: 'battery',
                        neobot_purple_lite_port_remot: 'remote',
                        neobot_purple_lite_color_white: 'white',
                        neobot_purple_lite_color_red: 'red',
                        neobot_purple_lite_color_yellow: 'yellow',
                        neobot_purple_lite_color_green: 'green',
                        neobot_purple_lite_color_blue: 'blue',
                        neobot_purple_lite_direction_forward: 'forward',
                        neobot_purple_lite_direction_backward: 'backward',
                        neobot_purple_lite_sound_silent: 'silent',
                        neobot_purple_lite_sound_do: 'Do',
                        neobot_purple_lite_sound_do_shop: 'Do#',
                        neobot_purple_lite_sound_re: 'Re',
                        neobot_purple_lite_sound_re_shop: 'Re#',
                        neobot_purple_lite_sound_mi: 'Mi',
                        neobot_purple_lite_sound_fa: 'Fa',
                        neobot_purple_lite_sound_fa_shop: 'Fa#',
                        neobot_purple_lite_sound_so: 'So',
                        neobot_purple_lite_sound_so_shop: 'So#',
                        neobot_purple_lite_sound_la: 'La',
                        neobot_purple_lite_sound_la_shop: 'La#',
                        neobot_purple_lite_sound_ti: 'Si',
                        neobot_purple_lite_sound_half_note: 'a half note',
                        neobot_purple_lite_sound_quarter_note: 'a quarter note',
                        neobot_purple_lite_sound_eighth_note: 'a eighth note',
                        neobot_purple_lite_sound_sixteenth_note: 'a sixteenth note',
                        neobot_purple_lite_sensor_infrared: 'IR sensor',
                        neobot_purple_lite_sensor_light: 'light sensor',
                        neobot_purple_lite_sensor_sound: 'sound sensor',
                        neobot_purple_lite_compare_symbol1: '＝',
                        neobot_purple_lite_compare_symbol2: '＞',
                        neobot_purple_lite_compare_symbol3: '＜',
                        neobot_purple_lite_compare_symbol4: '≥',
                        neobot_purple_lite_compare_symbol5: '≤',
                        neobot_purple_lite_remote_btn_a: 'A',
                        neobot_purple_lite_remote_btn_b: 'B',
                        neobot_purple_lite_remote_btn_c: 'C',
                        neobot_purple_lite_remote_btn_d: 'D',
                        neobot_purple_lite_remote_btn_1: '1',
                        neobot_purple_lite_remote_btn_2: '2',
                        neobot_purple_lite_remote_btn_3: '3',
                        neobot_purple_lite_remote_btn_4: '4',
                        neobot_purple_lite_remote_btn_up: '▲',
                        neobot_purple_lite_remote_btn_down: '▼',
                        neobot_purple_lite_remote_btn_left: '◀',
                        neobot_purple_lite_remote_btn_right: '▶',
                        neobot_purple_lite_duration_cont: 'constantly',
                        neobot_purple_lite_duration_1s: '1 second',
                        neobot_purple_lite_duration_2s: '2 seconds',
                        neobot_purple_lite_duration_3s: '3 seconds',
                        neobot_purple_lite_duration_4s: '4 seconds',
                        neobot_purple_lite_duration_5s: '5 seconds',
                        neobot_purple_lite_duration_6s: '6 seconds',
                        neobot_purple_lite_duration_7s: '7 seconds',
                        neobot_purple_lite_duration_8s: '8 seconds',
                        neobot_purple_lite_duration_9s: '9 seconds',
                        neobot_purple_lite_motor_both: 'both',
                        neobot_purple_lite_motor_left: 'left',
                        neobot_purple_lite_motor_right: 'right',
                        neobot_purple_lite_motor_move_forward: 'go forward',
                        neobot_purple_lite_motor_move_backward: 'go backward',
                        neobot_purple_lite_motor_move_left: 'turn Left',
                        neobot_purple_lite_motor_move_right: 'turn Right',
                        neobot_purple_lite_motor_move_stop: 'stop',

                        neobot_purple_lite_servo_dir_1: 'forward',
                        neobot_purple_lite_servo_dir_2: 'backward',

                        neobot_purple_lite_percent_10: '10% speed',
                        neobot_purple_lite_percent_20: '20% speed',
                        neobot_purple_lite_percent_30: '30% speed',
                        neobot_purple_lite_percent_40: '40% speed',
                        neobot_purple_lite_percent_50: '50% speed',
                        neobot_purple_lite_percent_60: '60% speed',
                        neobot_purple_lite_percent_70: '70% speed',
                        neobot_purple_lite_percent_80: '80% speed',
                        neobot_purple_lite_percent_90: '90% speed',
                        neobot_purple_lite_percent_100: '100% speed',

                        neobot_purple_lite_angle_0: '0 degree',
                        neobot_purple_lite_angle_5: '5 degrees',
                        neobot_purple_lite_angle_10: '10 degrees',
                        neobot_purple_lite_angle_15: '15 degrees',
                        neobot_purple_lite_angle_20: '20 degrees',
                        neobot_purple_lite_angle_25: '25 degrees',
                        neobot_purple_lite_angle_30: '30 degrees',
                        neobot_purple_lite_angle_35: '35 degrees',
                        neobot_purple_lite_angle_40: '40 degrees',
                        neobot_purple_lite_angle_45: '45 degrees',
                        neobot_purple_lite_angle_50: '50 degrees',
                        neobot_purple_lite_angle_55: '55 degrees',
                        neobot_purple_lite_angle_60: '60 degrees',
                        neobot_purple_lite_angle_65: '65 degrees',
                        neobot_purple_lite_angle_70: '70 degrees',
                        neobot_purple_lite_angle_75: '75 degrees',
                        neobot_purple_lite_angle_80: '80 degrees',
                        neobot_purple_lite_angle_85: '85 degrees',
                        neobot_purple_lite_angle_90: '90 degrees',
                        neobot_purple_lite_angle_95: '95 degrees',
                        neobot_purple_lite_angle_100: '100 degrees',
                        neobot_purple_lite_angle_105: '105 degrees',
                        neobot_purple_lite_angle_110: '110 degrees',
                        neobot_purple_lite_angle_115: '115 degrees',
                        neobot_purple_lite_angle_120: '120 degrees',
                        neobot_purple_lite_angle_125: '125 degrees',
                        neobot_purple_lite_angle_130: '130 degrees',
                        neobot_purple_lite_angle_135: '135 degrees',
                        neobot_purple_lite_angle_140: '140 degrees',
                        neobot_purple_lite_angle_145: '145 degrees',
                        neobot_purple_lite_angle_150: '150 degrees',
                        neobot_purple_lite_angle_155: '155 degrees',
                        neobot_purple_lite_angle_160: '160 degrees',
                        neobot_purple_lite_angle_165: '165 degrees',
                        neobot_purple_lite_angle_170: '170 degrees',
                        neobot_purple_lite_angle_175: '175 degrees',
                        neobot_purple_lite_angle_180: '180degrees',

                        neobot_purple_lite_out_all: 'ALL',
                        neobot_purple_lite_direction_left: 'to the left',
                        neobot_purple_lite_direction_right: 'to the right',
                    },
                }, //
            };
        }

        getBlocks = function() {
            return {
                /*************************
                 * class neobot_purple_lite_sensor
                 *************************/
                neobot_purple_lite_sensor_title: {
                    color: EntryStatic.colorSet.common.TRANSPARENT,
                    fontColor: '#191970',
                    skeleton: 'basic_text',
                    skeletonOptions: {
                        contentPos: {
                            x: 5,
                        },
                    },
                    params: [
                        {
                            type: 'Text',
                            text: Lang.template.neobot_purple_lite_sensor_title,
                            color: '#191970',
                            align: 'left',
                        },
                    ],
                    def: {
                        type: 'neobot_purple_lite_sensor_title',
                    },
                    class: 'neobot_purple_lite_sensor',
                    isNotFor: ['NeobotPurpleLite'],
                    events: {},
                },
                neobot_purple_lite_sensor_value: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic_string_field',
                    fontColor: '#fff',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.neobot_purple_lite_port_1, 'IN1'],
                                [Lang.Blocks.neobot_purple_lite_port_2, 'IN2'],
                                [Lang.Blocks.neobot_purple_lite_port_3, 'IN3'],
                                [Lang.Blocks.neobot_purple_lite_port_remot, 'IR'],
                                [Lang.Blocks.neobot_purple_lite_port_bat, 'BAT'],
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
                        type: 'neobot_purple_lite_sensor_value',
                    },
                    paramsKeyMap: {
                        PORT: 0,
                    },
                    class: 'neobot_purple_lite_sensor',
                    isNotFor: ['NeobotPurpleLite'],
                    func(sprite, script) {
                        const port = script.getStringField('PORT');
                        return Entry.NeobotPurpleLite.localBuffer[port];
                    },
                },

                neobot_purple_lite_sensor_convert_scale: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic_string_field',
                    fontColor: '#fff',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.neobot_purple_lite_port_1, 'IN1'],
                                [Lang.Blocks.neobot_purple_lite_port_2, 'IN2'],
                                [Lang.Blocks.neobot_purple_lite_port_3, 'IN3'],
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
                        type: 'neobot_purple_lite_sensor_convert_scale',
                    },
                    paramsKeyMap: {
                        PORT: 0,
                        OMIN: 1,
                        OMAX: 2,
                        MIN: 3,
                        MAX: 4,
                    },
                    class: 'neobot_purple_lite_sensor',
                    isNotFor: ['NeobotPurpleLite'],
                    func(sprite, script) {
                        const port = script.getStringField('PORT');
                        let value = Entry.NeobotPurpleLite.localBuffer[port];
                        let omin = script.getNumberValue('OMIN', script);
                        let omax = script.getNumberValue('OMAX', script);
                        let min = script.getNumberValue('MIN', script);
                        let max = script.getNumberValue('MAX', script);

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
                neobot_purple_lite_decision_sensor_is_over: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    fontColor: '#ffffff',
                    skeleton: 'basic_boolean_field',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.neobot_purple_lite_port_1, 'IN1'],
                                [Lang.Blocks.neobot_purple_lite_port_2, 'IN2'],
                                [Lang.Blocks.neobot_purple_lite_port_3, 'IN3'],
                                [Lang.Blocks.neobot_purple_lite_port_12, 'IN12'],
                            ],
                            value: 'IN1',
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.neobot_purple_lite_compare_symbol1, '='],
                                [Lang.Blocks.neobot_purple_lite_compare_symbol2, '>'],
                                [Lang.Blocks.neobot_purple_lite_compare_symbol3, '<'],
                                [Lang.Blocks.neobot_purple_lite_compare_symbol4, '>='],
                                [Lang.Blocks.neobot_purple_lite_compare_symbol5, '<='],
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
                        type: 'neobot_purple_lite_decision_sensor_is_over',
                    },
                    paramsKeyMap: {
                        SENSOR: 0,
                        SYMBOL: 1,
                        VALUE: 2,
                    },
                    class: 'neobot_purple_lite_sensor',
                    isNotFor: ['NeobotPurpleLite'],
                    func(sprite, script) {
                        const sensorTemp = script.getStringField('SENSOR');
                        const symbol = script.getStringField('SYMBOL');
                        const value = Entry.parseNumber(script.getStringValue('VALUE'));

                        if (sensorTemp == 'IN12') {
                            const sensor1 = Entry.NeobotPurpleLite.localBuffer.IN1;
                            const sensor2 = Entry.NeobotPurpleLite.localBuffer.IN2;
                            if (symbol == '=') {
                                return sensor1 == value && sensor2 == value;
                            } else if (symbol == '>') {
                                return sensor1 > value && sensor2 > value;
                            } else if (symbol == '<') {
                                return sensor1 < value && sensor2 < value;
                            } else if (symbol == '>=') {
                                return sensor1 >= value && sensor2 >= value;
                            } else if (symbol == '<=') {
                                return sensor1 <= value && sensor2 <= value;
                            }
                        } else {
                            const sensor = Entry.NeobotPurpleLite.localBuffer[sensorTemp];
                            if (symbol == '=') {
                                if (sensor == value) {
                                    return true;
                                } else {
                                    return false;
                                }
                            } else if (symbol == '>') {
                                if (sensor > value) {
                                    return true;
                                } else {
                                    return false;
                                }
                            } else if (symbol == '<') {
                                if (sensor < value) {
                                    return true;
                                } else {
                                    return false;
                                }
                            } else if (symbol == '>=') {
                                if (sensor >= value) {
                                    return true;
                                } else {
                                    return false;
                                }
                            } else if (symbol == '<=') {
                                if (sensor <= value) {
                                    return true;
                                } else {
                                    return false;
                                }
                            }
                        }
                        return false;
                    },
                },

                neobot_purple_lite_decision_equal_with_sensor: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    fontColor: '#ffffff',
                    skeleton: 'basic_boolean_field',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.neobot_purple_lite_port_1, 'IN1'],
                                [Lang.Blocks.neobot_purple_lite_port_2, 'IN2'],
                                [Lang.Blocks.neobot_purple_lite_port_3, 'IN3'],
                            ],
                            value: 'IN1',
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.neobot_purple_lite_color_white, 0],
                                [Lang.Blocks.neobot_purple_lite_color_red, 1],
                                [Lang.Blocks.neobot_purple_lite_color_yellow, 2],
                                [Lang.Blocks.neobot_purple_lite_color_green, 3],
                                [Lang.Blocks.neobot_purple_lite_color_blue, 4],
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
                        type: 'neobot_purple_lite_decision_equal_with_sensor',
                    },
                    paramsKeyMap: {
                        SENSOR: 0,
                        COLOR: 1,
                    },
                    class: 'neobot_purple_lite_sensor',
                    isNotFor: ['NeobotPurpleLite'],
                    func(sprite, script) {
                        const sensorTemp = script.getStringField('SENSOR');
                        const sensor = Entry.NeobotPurpleLite.localBuffer[sensorTemp];
                        const color = script.getNumberField('COLOR');

                        if (sensor >= 10 && sensor <= 50) {
                            if (color == 0) {
                                return true;
                            } else {
                                return false;
                            }
                        } else if (sensor >= 51 && sensor <= 90) {
                            if (color == 1) {
                                return true;
                            } else {
                                return false;
                            }
                        } else if (sensor >= 91 && sensor <= 130) {
                            if (color == 2) {
                                return true;
                            } else {
                                return false;
                            }
                        } else if (sensor >= 131 && sensor <= 170) {
                            if (color == 3) {
                                return true;
                            } else {
                                return false;
                            }
                        } else if (sensor >= 171 && sensor <= 210) {
                            if (color == 4) {
                                return true;
                            } else {
                                return false;
                            }
                        }
                        return false;
                    },
                },

                neobot_purple_lite_decision_sensor_angle: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    fontColor: '#FFFFFF',
                    skeleton: 'basic_boolean_field',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.neobot_purple_lite_port_1, 'IN1'],
                                [Lang.Blocks.neobot_purple_lite_port_2, 'IN2'],
                                [Lang.Blocks.neobot_purple_lite_port_3, 'IN3'],
                            ],
                            value: 'IN1',
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.neobot_purple_lite_compare_symbol1, '='],
                                [Lang.Blocks.neobot_purple_lite_compare_symbol2, '>'],
                                [Lang.Blocks.neobot_purple_lite_compare_symbol3, '<'],
                                [Lang.Blocks.neobot_purple_lite_compare_symbol4, '>='],
                                [Lang.Blocks.neobot_purple_lite_compare_symbol5, '<='],
                            ],
                            value: '>',
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.neobot_purple_lite_angle_0, '0'],
                                [Lang.Blocks.neobot_purple_lite_angle_10, '10'],
                                [Lang.Blocks.neobot_purple_lite_angle_20, '20'],
                                [Lang.Blocks.neobot_purple_lite_angle_30, '30'],
                                [Lang.Blocks.neobot_purple_lite_angle_40, '40'],
                                [Lang.Blocks.neobot_purple_lite_angle_50, '50'],
                                [Lang.Blocks.neobot_purple_lite_angle_60, '60'],
                                [Lang.Blocks.neobot_purple_lite_angle_70, '70'],
                                [Lang.Blocks.neobot_purple_lite_angle_80, '80'],
                                [Lang.Blocks.neobot_purple_lite_angle_90, '90'],
                                [Lang.Blocks.neobot_purple_lite_angle_100, '100'],
                                [Lang.Blocks.neobot_purple_lite_angle_110, '110'],
                                [Lang.Blocks.neobot_purple_lite_angle_120, '120'],
                                [Lang.Blocks.neobot_purple_lite_angle_130, '130'],
                                [Lang.Blocks.neobot_purple_lite_angle_140, '140'],
                                [Lang.Blocks.neobot_purple_lite_angle_150, '150'],
                                [Lang.Blocks.neobot_purple_lite_angle_160, '160'],
                                [Lang.Blocks.neobot_purple_lite_angle_170, '170'],
                                [Lang.Blocks.neobot_purple_lite_angle_180, '180'],
                            ],
                            value: '90',
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                    ],
                    events: {},
                    def: {
                        params: [null, null, null],
                        type: 'neobot_purple_lite_decision_sensor_angle',
                    },
                    paramsKeyMap: {
                        SENSOR: 0,
                        SYMBOL: 1,
                        VALUE: 2,
                    },
                    class: 'neobot_purple_lite_sensor',
                    isNotFor: ['NeobotPurpleLite'],
                    func(sprite, script) {
                        const sensorTemp = script.getStringField('SENSOR');
                        const sensor = Entry.NeobotPurpleLite.localBuffer[sensorTemp];
                        const symbol = script.getStringField('SYMBOL');
                        const value = Entry.parseNumber(script.getStringValue('VALUE'));

                        if (symbol == '=') {
                            if (sensor == value) {
                                return true;
                            } else {
                                return false;
                            }
                        } else if (symbol == '>') {
                            if (sensor > value) {
                                return true;
                            } else {
                                return false;
                            }
                        } else if (symbol == '<') {
                            if (sensor < value) {
                                return true;
                            } else {
                                return false;
                            }
                        } else if (symbol == '>=') {
                            if (sensor >= value) {
                                return true;
                            } else {
                                return false;
                            }
                        } else if (symbol == '<=') {
                            if (sensor <= value) {
                                return true;
                            } else {
                                return false;
                            }
                        }
                        return false;
                    },
                },
                neobot_purple_lite_remote_button: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    fontColor: '#FFFFFF',
                    skeleton: 'basic_boolean_field',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.neobot_purple_lite_remote_btn_1, '10'],
                                [Lang.Blocks.neobot_purple_lite_remote_btn_2, '11'],
                                [Lang.Blocks.neobot_purple_lite_remote_btn_3, '12'],
                                [Lang.Blocks.neobot_purple_lite_remote_btn_4, '13'],
                                [Lang.Blocks.neobot_purple_lite_remote_btn_up, '1'],
                                [Lang.Blocks.neobot_purple_lite_remote_btn_down, '2'],
                                [Lang.Blocks.neobot_purple_lite_remote_btn_left, '3'],
                                [Lang.Blocks.neobot_purple_lite_remote_btn_right, '4'],
                            ],
                            value: '10',
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                    ],
                    events: {},
                    def: {
                        params: [null],
                        type: 'neobot_purple_lite_remote_button',
                    },
                    paramsKeyMap: {
                        KEY: 0,
                    },
                    class: 'neobot_purple_lite_sensor',
                    isNotFor: ['NeobotPurpleLite'],
                    func(sprite, script) {
                        const key = script.getNumberField('KEY');
                        const value = Entry.NeobotPurpleLite.localBuffer.IR;
                        if (key == value) {
                            return true;
                        } else {
                            return false;
                        }
                    },
                },

                /*************************
                 * class neobot_purple_lite_led
                 *************************/
                neobot_purple_lite_led_title: {
                    color: EntryStatic.colorSet.common.TRANSPARENT,
                    fontColor: '#191970',
                    skeleton: 'basic_text',
                    skeletonOptions: {
                        contentPos: {
                            x: 5,
                        },
                    },
                    params: [
                        {
                            type: 'Text',
                            text: Lang.template.neobot_purple_lite_led_title,
                            color: '#191970',
                            align: 'left',
                        },
                    ],
                    def: {
                        type: 'neobot_purple_lite_led_title',
                    },
                    class: 'neobot_purple_lite_led',
                    isNotFor: ['NeobotPurpleLite'],
                    events: {},
                },
                neobot_purple_lite_led_on: {
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
                                [Lang.Blocks.neobot_purple_lite_out_all, 'ALL'],
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
                            type: 'Block',
                            accept: 'string',
                            defaultType: 'number',
                        },
                        {
                            type: 'Indicator',
                            img: 'block_icon/hardwarelite_icon.svg',
                            size: 12,
                        },
                    ],
                    events: {},
                    def: {
                        params: [
                            null,
                            null,
                            {
                                type: 'neobot_purple_lite_arg_led_duration',
                                id: 'm311',
                            },
                            null,
                        ],
                        type: 'neobot_purple_lite_led_on',
                    },
                    paramsKeyMap: {
                        PORT: 0,
                        VALUE: 1,
                        DURATION: 2,
                    },
                    class: 'neobot_purple_lite_led',
                    isNotFor: ['NeobotPurpleLite'],
                    func(sprite, script) {
                        if (!script.isStart) {
                            const port = script.getStringField('PORT', script);
                            const value = script.getNumberField('VALUE', script);
                            const duration = script.getStringValue('DURATION', script);

                            if (Entry.NeobotPurpleLite.log_to_console) {
                                Entry.console.print('=== neobot_purple_lite_led_on ===', 'speak');
                                Entry.console.print(`port : ${port}`, 'speak');
                                Entry.console.print(`brightness : ${value}`, 'speak');
                                Entry.console.print(`duration : ${duration}`, 'speak');
                                Entry.console.print('==========================', 'speak');
                            }

                            if (
                                duration != '계속' &&
                                duration != 'constantly' &&
                                Entry.parseNumber(duration) <= 0
                            ) {
                                return script.callReturn();
                            }

                            if (port == 'ALL') {
                                Entry.NeobotPurpleLite.remoteBuffer.OUT1 = value;
                                Entry.NeobotPurpleLite.remoteBuffer.OUT2 = value;
                                Entry.NeobotPurpleLite.remoteBuffer.OUT3 = value;
                            } else {
                                Entry.NeobotPurpleLite.remoteBuffer[port] = value;
                            }

                            if (duration == '계속' || duration == 'constantly') {
                                return script.callReturn();
                            }

                            const durationValue = Entry.parseNumber(duration);
                            script.isStart = true;
                            script.timeFlag = 1;
                            setTimeout(() => {
                                if (port == 'ALL') {
                                    Entry.NeobotPurpleLite.remoteBuffer.OUT1 = 0;
                                    Entry.NeobotPurpleLite.remoteBuffer.OUT2 = 0;
                                    Entry.NeobotPurpleLite.remoteBuffer.OUT3 = 0;
                                } else {
                                    Entry.NeobotPurpleLite.remoteBuffer[port] = 0;
                                }
                                if (Entry.NeobotPurpleLite.log_to_console) {
                                    Entry.console.print('neobot_purple_lite_led_on : 0', 'speak');
                                }
                                script.timeFlag = 0;
                            }, durationValue * 1000);
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

                neobot_purple_lite_output_led_off: {
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
                                [Lang.Blocks.neobot_purple_lite_out_all, 'ALL'],
                            ],
                            value: 'OUT1',
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                        {
                            type: 'Indicator',
                            img: 'block_icon/hardwarelite_icon.svg',
                            size: 12,
                        },
                    ],
                    events: {},
                    def: {
                        params: [null, null],
                        type: 'neobot_purple_lite_output_led_off',
                    },
                    paramsKeyMap: {
                        PORT: 0,
                    },
                    class: 'neobot_purple_lite_led',
                    isNotFor: ['NeobotPurpleLite'],
                    func(sprite, script) {
                        const port = script.getStringField('PORT', script);

                        if (Entry.NeobotPurpleLite.log_to_console) {
                            Entry.console.print(
                                '=== neobot_purple_lite_output_led_off ===',
                                'speak'
                            );
                            Entry.console.print(`port : ${port}`, 'speak');
                            Entry.console.print('==========================', 'speak');
                        }

                        if (port == 'ALL') {
                            Entry.NeobotPurpleLite.remoteBuffer.OUT1 = 0;
                            Entry.NeobotPurpleLite.remoteBuffer.OUT2 = 0;
                            Entry.NeobotPurpleLite.remoteBuffer.OUT3 = 0;
                        } else {
                            Entry.NeobotPurpleLite.remoteBuffer[port] = 0;
                        }
                        return script.callReturn();
                    },
                },

                neobot_purple_lite_led_brightness_with_sensor: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                ['IN1', 'IN1'],
                                ['IN2', 'IN2'],
                                ['IN3', 'IN3'],
                            ],
                            value: 'IN1',
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                        {
                            type: 'Dropdown',
                            options: [
                                ['OUT1', 'OUT1'],
                                ['OUT2', 'OUT2'],
                                ['OUT3', 'OUT3'],
                                [Lang.Blocks.neobot_purple_lite_out_all, 'ALL'],
                            ],
                            value: 'OUT1',
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                        {
                            type: 'Indicator',
                            img: 'block_icon/hardwarelite_icon.svg',
                            size: 12,
                        },
                    ],
                    events: {},
                    def: {
                        params: [null, null, null],
                        type: 'neobot_purple_lite_led_brightness_with_sensor',
                    },
                    paramsKeyMap: {
                        IN: 0,
                        OUT: 1,
                    },
                    class: 'neobot_purple_lite_led',
                    isNotFor: ['NeobotPurpleLite'],
                    func(sprite, script) {
                        const inPort = script.getStringField('IN', script);
                        const outPort = script.getStringField('OUT', script);
                        let value = Entry.NeobotPurpleLite.localBuffer[inPort];

                        // edited 210421, IN 값 0~100 을 0~255로 변경, 센서 100 이상은 최대값으로 처리함.
                        value = Math.max(value, 0);
                        value = Math.min(value, 100);
                        value = Math.ceil((value / 100) * 255);

                        if (Entry.NeobotPurpleLite.log_to_console) {
                            Entry.console.print(
                                '=== neobot_purple_lite_led_brightness_with_sensor ===',
                                'speak'
                            );
                            Entry.console.print(`out port : ${outPort}`, 'speak');
                            Entry.console.print(`in port : ${inPort}`, 'speak');
                            Entry.console.print(
                                `sensor value : ${Entry.NeobotPurpleLite.localBuffer[inPort]}`,
                                'speak'
                            );
                            Entry.console.print(`output value : ${value}`, 'speak');
                            Entry.console.print('==========================', 'speak');
                        }

                        if (outPort == 'ALL') {
                            Entry.NeobotPurpleLite.remoteBuffer.OUT1 = value;
                            Entry.NeobotPurpleLite.remoteBuffer.OUT2 = value;
                            Entry.NeobotPurpleLite.remoteBuffer.OUT3 = value;
                        } else {
                            Entry.NeobotPurpleLite.remoteBuffer[outPort] = value;
                        }
                        return script.callReturn();
                    },
                },

                neobot_purple_lite_color_led_on: {
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
                                [Lang.Blocks.neobot_purple_lite_out_all, 'ALL'],
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
                            type: 'Block',
                            accept: 'string',
                        },
                        {
                            type: 'Block',
                            accept: 'string',
                        },
                        {
                            type: 'Indicator',
                            img: 'block_icon/hardwarelite_icon.svg',
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
                            {
                                type: 'number',
                                params: ['255'],
                            },
                            {
                                type: 'number',
                                params: ['255'],
                            },
                            null,
                        ],
                        type: 'neobot_purple_lite_color_led_on',
                    },
                    paramsKeyMap: {
                        PORT: 0,
                        RED: 1,
                        GREEN: 2,
                        BLUE: 3,
                    },
                    class: 'neobot_purple_lite_led',
                    isNotFor: ['NeobotPurpleLite'],
                    func(sprite, script) {
                        if (!script.isStart) {
                            const port = script.getStringField('PORT');
                            let red = script.getNumberValue('RED');
                            let green = script.getNumberValue('GREEN');
                            let blue = script.getNumberValue('BLUE');

                            let out1 = false;
                            let out2 = false;
                            let out3 = false;
                            if (port == 'ALL') {
                                out1 = true;
                                out2 = true;
                                out3 = true;
                            } else {
                                out1 = port == 'OUT1';
                                out2 = port == 'OUT2';
                                out3 = port == 'OUT3';
                            }

                            red = Math.max(red, 1);
                            red = Math.min(red, 251);
                            green = Math.max(green, 1);
                            green = Math.min(green, 251);
                            blue = Math.max(blue, 1);
                            blue = Math.min(blue, 251);

                            if (Entry.NeobotPurpleLite.log_to_console) {
                                Entry.console.print(
                                    '=== neobot_purple_lite_color_led_on ===',
                                    'speak'
                                );
                                Entry.console.print(`port : ${port}`, 'speak');
                                Entry.console.print(`red : ${red}`, 'speak');
                                Entry.console.print(`green : ${green}`, 'speak');
                                Entry.console.print(`blue : ${blue}`, 'speak');
                                Entry.console.print('==========================', 'speak');
                            }

                            const valRed = 252;
                            const valGreen = 253;
                            const valBlue = 254;
                            const valAccept = 255;

                            script.isStart = true;
                            script.timeFlag = 1;

                            if (out1) {
                                Entry.NeobotPurpleLite.remoteBuffer.OUT1 = valRed;
                            }
                            if (out2) {
                                Entry.NeobotPurpleLite.remoteBuffer.OUT2 = valRed;
                            }
                            if (out3) {
                                Entry.NeobotPurpleLite.remoteBuffer.OUT3 = valRed;
                            }
                            if (Entry.NeobotPurpleLite.log_to_console) {
                                Entry.console.print(
                                    `neobot_purple_lite_color_led_on : ${valRed}`,
                                    'speak'
                                );
                            }
                            setTimeout(() => {
                                // set red
                                if (out1) {
                                    Entry.NeobotPurpleLite.remoteBuffer.OUT1 = red;
                                }
                                if (out2) {
                                    Entry.NeobotPurpleLite.remoteBuffer.OUT2 = red;
                                }
                                if (out3) {
                                    Entry.NeobotPurpleLite.remoteBuffer.OUT3 = red;
                                }
                                if (Entry.NeobotPurpleLite.log_to_console) {
                                    Entry.console.print(
                                        `neobot_purple_lite_color_led_on : ${red}`,
                                        'speak'
                                    );
                                }
                                setTimeout(() => {
                                    // choose green
                                    if (out1) {
                                        Entry.NeobotPurpleLite.remoteBuffer.OUT1 = valGreen;
                                    }
                                    if (out2) {
                                        Entry.NeobotPurpleLite.remoteBuffer.OUT2 = valGreen;
                                    }
                                    if (out3) {
                                        Entry.NeobotPurpleLite.remoteBuffer.OUT3 = valGreen;
                                    }
                                    if (Entry.NeobotPurpleLite.log_to_console) {
                                        Entry.console.print(
                                            `neobot_purple_lite_color_led_on : ${valGreen}`,
                                            'speak'
                                        );
                                    }
                                    setTimeout(() => {
                                        // set green
                                        if (out1) {
                                            Entry.NeobotPurpleLite.remoteBuffer.OUT1 = green;
                                        }
                                        if (out2) {
                                            Entry.NeobotPurpleLite.remoteBuffer.OUT2 = green;
                                        }
                                        if (out3) {
                                            Entry.NeobotPurpleLite.remoteBuffer.OUT3 = green;
                                        }
                                        if (Entry.NeobotPurpleLite.log_to_console) {
                                            Entry.console.print(
                                                `neobot_purple_lite_color_led_on : ${green}`,
                                                'speak'
                                            );
                                        }
                                        setTimeout(() => {
                                            // choose blue
                                            if (out1) {
                                                Entry.NeobotPurpleLite.remoteBuffer.OUT1 = valBlue;
                                            }
                                            if (out2) {
                                                Entry.NeobotPurpleLite.remoteBuffer.OUT2 = valBlue;
                                            }
                                            if (out3) {
                                                Entry.NeobotPurpleLite.remoteBuffer.OUT3 = valBlue;
                                            }
                                            if (Entry.NeobotPurpleLite.log_to_console) {
                                                Entry.console.print(
                                                    `neobot_purple_lite_color_led_on : ${valBlue}`,
                                                    'speak'
                                                );
                                            }
                                            setTimeout(() => {
                                                // set blue
                                                if (out1) {
                                                    Entry.NeobotPurpleLite.remoteBuffer.OUT1 = blue;
                                                }
                                                if (out2) {
                                                    Entry.NeobotPurpleLite.remoteBuffer.OUT2 = blue;
                                                }
                                                if (out3) {
                                                    Entry.NeobotPurpleLite.remoteBuffer.OUT3 = blue;
                                                }
                                                if (Entry.NeobotPurpleLite.log_to_console) {
                                                    Entry.console.print(
                                                        `neobot_purple_lite_color_led_on : ${blue}`,
                                                        'speak'
                                                    );
                                                }
                                                setTimeout(() => {
                                                    // accept
                                                    if (out1) {
                                                        Entry.NeobotPurpleLite.remoteBuffer.OUT1 = valAccept;
                                                    }
                                                    if (out2) {
                                                        Entry.NeobotPurpleLite.remoteBuffer.OUT2 = valAccept;
                                                    }
                                                    if (out3) {
                                                        Entry.NeobotPurpleLite.remoteBuffer.OUT3 = valAccept;
                                                    }
                                                    if (Entry.NeobotPurpleLite.log_to_console) {
                                                        Entry.console.print(
                                                            `neobot_purple_lite_color_led_on : ${valAccept}`,
                                                            'speak'
                                                        );
                                                    }
                                                    setTimeout(() => {
                                                        // final delay
                                                        script.timeFlag = 0;
                                                    }, 200);
                                                }, 200);
                                            }, 200);
                                        }, 200);
                                    }, 200);
                                }, 200);
                            }, 200);
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

                /*************************
                 * class neobot_purple_lite_output
                 *************************/
                neobot_purple_lite_output_title: {
                    color: EntryStatic.colorSet.common.TRANSPARENT,
                    fontColor: '#191970',
                    skeleton: 'basic_text',
                    skeletonOptions: {
                        contentPos: {
                            x: 5,
                        },
                    },
                    params: [
                        {
                            type: 'Text',
                            text: Lang.template.neobot_purple_lite_output_title,
                            color: '#191970',
                            align: 'left',
                        },
                    ],
                    def: {
                        type: 'neobot_purple_lite_output_title',
                    },
                    class: 'neobot_purple_lite_output',
                    isNotFor: ['NeobotPurpleLite'],
                    events: {},
                },
                neobot_purple_lite_set_output: {
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
                                [Lang.Blocks.neobot_purple_lite_out_all, 'ALL'],
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
                            img: 'block_icon/hardwarelite_icon.svg',
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
                        type: 'neobot_purple_lite_set_output',
                    },
                    paramsKeyMap: {
                        PORT: 0,
                        VALUE: 1,
                    },
                    class: 'neobot_purple_lite_output',
                    isNotFor: ['NeobotPurpleLite'],
                    func(sprite, script) {
                        const port = script.getStringField('PORT', script);
                        let value = script.getNumberValue('VALUE', script);
                        if (value < 0) {
                            value = 0;
                        } else if (value > 255) {
                            value = 255;
                        }

                        if (Entry.NeobotPurpleLite.log_to_console) {
                            Entry.console.print('=== neobot_purple_lite_set_output ===', 'speak');
                            Entry.console.print(`port : ${port}`, 'speak');
                            Entry.console.print(`value : ${value}`, 'speak');
                            Entry.console.print('==========================', 'speak');
                        }

                        if (port == 'ALL') {
                            Entry.NeobotPurpleLite.remoteBuffer.OUT1 = value;
                            Entry.NeobotPurpleLite.remoteBuffer.OUT2 = value;
                            Entry.NeobotPurpleLite.remoteBuffer.OUT3 = value;
                        } else {
                            Entry.NeobotPurpleLite.remoteBuffer[port] = value;
                        }
                        return script.callReturn();
                    },
                },

                /*************************
                 * class neobot_purple_lite_motor
                 *************************/
                neobot_purple_lite_motor_title: {
                    color: EntryStatic.colorSet.common.TRANSPARENT,
                    fontColor: '#191970',
                    skeleton: 'basic_text',
                    skeletonOptions: {
                        contentPos: {
                            x: 5,
                        },
                    },
                    params: [
                        {
                            type: 'Text',
                            text: Lang.template.neobot_purple_lite_motor_title,
                            color: '#191970',
                            align: 'left',
                        },
                    ],
                    def: {
                        type: 'neobot_purple_lite_motor_title',
                    },
                    class: 'neobot_purple_lite_motor',
                    isNotFor: ['NeobotPurpleLite'],
                    events: {},
                },
                neobot_purple_lite_robot: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.neobot_purple_lite_motor_move_forward, '1'],
                                [Lang.Blocks.neobot_purple_lite_motor_move_backward, '2'],
                                [Lang.Blocks.neobot_purple_lite_motor_move_left, '3'],
                                [Lang.Blocks.neobot_purple_lite_motor_move_right, '4'],
                                [Lang.Blocks.neobot_purple_lite_motor_move_stop, '5'],
                            ],
                            value: '1',
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                        {
                            type: 'Indicator',
                            img: 'block_icon/hardwarelite_icon.svg',
                            size: 12,
                        },
                    ],
                    events: {},
                    def: {
                        params: [null, null],
                        type: 'neobot_purple_lite_robot',
                    },
                    paramsKeyMap: {
                        MOVE: 0,
                    },
                    class: 'neobot_purple_lite_motor',
                    isNotFor: ['NeobotPurpleLite'],
                    func(sprite, script) {
                        const move = script.getNumberField('MOVE');
                        let leftValue;
                        let rightValue;
                        switch (move) {
                            case 1:
                                leftValue = 0x10 + 10;
                                rightValue = 0x10 + 10;
                                break;
                            case 2:
                                leftValue = 0x20 + 10;
                                rightValue = 0x20 + 10;
                                break;
                            case 3:
                                leftValue = 0x20 + 5;
                                rightValue = 0x10 + 5;
                                break;
                            case 4:
                                leftValue = 0x10 + 5;
                                rightValue = 0x20 + 5;
                                break;
                            case 5:
                                leftValue = 0;
                                rightValue = 0;
                                break;
                        }

                        if (Entry.NeobotPurpleLite.log_to_console) {
                            Entry.console.print('=== neobot_purple_lite_robot ===', 'speak');
                            Entry.console.print(`move : ${move}`, 'speak');
                            Entry.console.print(`left value : ${leftValue}`, 'speak');
                            Entry.console.print(`right value : ${rightValue}`, 'speak');
                            Entry.console.print('==========================', 'speak');
                        }

                        Entry.NeobotPurpleLite.remoteBuffer.DCL = leftValue;
                        Entry.NeobotPurpleLite.remoteBuffer.DCR = rightValue;
                        return script.callReturn();
                    },
                },

                neobot_purple_lite_motor_start: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.neobot_purple_lite_motor_both, '1'],
                                [Lang.Blocks.neobot_purple_lite_motor_left, '2'],
                                [Lang.Blocks.neobot_purple_lite_motor_right, '3'],
                            ],
                            value: '1',
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.neobot_purple_lite_direction_forward, '1'],
                                [Lang.Blocks.neobot_purple_lite_direction_backward, '2'],
                                [Lang.Blocks.neobot_purple_lite_direction_left, '3'],
                                [Lang.Blocks.neobot_purple_lite_direction_right, '4'],
                            ],
                            value: '1',
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                        {
                            type: 'Block',
                            accept: 'string',
                            defaultType: 'number',
                        },
                        {
                            type: 'Block',
                            accept: 'string',
                            defaultType: 'number',
                        },
                        {
                            type: 'Indicator',
                            img: 'block_icon/hardwarelite_icon.svg',
                            size: 12,
                        },
                    ],
                    events: {},
                    def: {
                        params: [
                            null,
                            null,
                            {
                                type: 'neobot_purple_lite_arg_motor_speed',
                                id: 'm411',
                            },
                            {
                                type: 'neobot_purple_lite_arg_motor_duration',
                                id: 'm412',
                            },
                            null,
                        ],
                        type: 'neobot_purple_lite_motor_start',
                    },
                    paramsKeyMap: {
                        MOTOR: 0,
                        DIRECTION: 1,
                        SPEED: 2,
                        DURATION: 3,
                    },
                    class: 'neobot_purple_lite_motor',
                    isNotFor: ['NeobotPurpleLite'],
                    func(sprite, script) {
                        if (!script.isStart) {
                            const motor = script.getStringField('MOTOR', script);
                            const direction = script.getStringField('DIRECTION', script);
                            const speed = script.getStringValue('SPEED', script);
                            const duration = script.getStringValue('DURATION', script);

                            if (
                                duration != '계속' &&
                                duration != 'constantly' &&
                                Entry.parseNumber(duration) <= 0
                            ) {
                                return script.callReturn();
                            }

                            let moveLeft = false;
                            let moveRight = false;
                            if (motor == 1) {
                                moveLeft = true;
                                moveRight = true;
                            } else if (motor == 2) {
                                moveLeft = true;
                            } else {
                                moveRight = true;
                            }

                            let leftDirectionValue;
                            let rightDirectionValue;
                            if (direction == 1) {
                                leftDirectionValue = 0x10;
                                rightDirectionValue = 0x10;
                            } else if (direction == 2) {
                                leftDirectionValue = 0x20;
                                rightDirectionValue = 0x20;
                            } else if (direction == 3) {
                                leftDirectionValue = 0x20;
                                rightDirectionValue = 0x10;
                            } else {
                                leftDirectionValue = 0x10;
                                rightDirectionValue = 0x20;
                            }

                            // edited 210421, 0~100 을 0~15로 변환, 100 이상은 최대값(15)으로 처리함.
                            let speedValue = 0;
                            if (Entry.Utils.isNumber(speed)) {
                                speedValue = Entry.parseNumber(speed);
                            } else {
                                speedValue = Entry.NeobotPurpleLite.localBuffer[speed];
                            }
                            speedValue = Math.max(speedValue, 0);
                            speedValue = Math.min(speedValue, 100);
                            speedValue = Math.ceil((speedValue / 100) * 15);

                            const leftOutValue = leftDirectionValue + speedValue;
                            const rightOutValue = rightDirectionValue + speedValue;

                            if (Entry.NeobotPurpleLite.log_to_console) {
                                Entry.console.print(
                                    '=== neobot_purple_lite_motor_start ===',
                                    'speak'
                                );
                                Entry.console.print(`motor : ${motor}`, 'speak');
                                Entry.console.print(`direction : ${direction}`, 'speak');
                                Entry.console.print(`speed : ${speed}`, 'speak');
                                Entry.console.print(`duration : ${duration}`, 'speak');
                                Entry.console.print(
                                    `left direction value : ${leftDirectionValue}`,
                                    'speak'
                                );
                                Entry.console.print(
                                    `right direction value : ${rightDirectionValue}`,
                                    'speak'
                                );
                                Entry.console.print(`speed value : ${speedValue}`, 'speak');
                                Entry.console.print(`left output value : ${leftOutValue}`, 'speak');
                                Entry.console.print(
                                    `right output value : ${rightOutValue}`,
                                    'speak'
                                );
                                Entry.console.print('==========================', 'speak');
                            }

                            if (moveLeft) {
                                Entry.NeobotPurpleLite.remoteBuffer.DCL = leftOutValue;
                            }
                            if (moveRight) {
                                Entry.NeobotPurpleLite.remoteBuffer.DCR = rightOutValue;
                            }

                            if (duration == '계속' || duration == 'constantly') {
                                return script.callReturn();
                            }

                            const durationValue = Entry.parseNumber(duration);
                            script.isStart = true;
                            script.timeFlag = 1;
                            setTimeout(() => {
                                Entry.NeobotPurpleLite.remoteBuffer.DCL = 0;
                                Entry.NeobotPurpleLite.remoteBuffer.DCR = 0;
                                if (Entry.NeobotPurpleLite.log_to_console) {
                                    Entry.console.print(
                                        'neobot_purple_lite_motor_start : 0',
                                        'speak'
                                    );
                                }
                                script.timeFlag = 0;
                            }, durationValue * 1000);
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

                neobot_purple_lite_motor_stop: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.neobot_purple_lite_motor_both, '1'],
                                [Lang.Blocks.neobot_purple_lite_motor_left, '2'],
                                [Lang.Blocks.neobot_purple_lite_motor_right, '3'],
                            ],
                            value: '1',
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                        {
                            type: 'Indicator',
                            img: 'block_icon/hardwarelite_icon.svg',
                            size: 12,
                        },
                    ],
                    events: {},
                    def: {
                        params: [null, null],
                        type: 'neobot_purple_lite_motor_stop',
                    },
                    paramsKeyMap: {
                        MOTOR: 0,
                    },
                    class: 'neobot_purple_lite_motor',
                    isNotFor: ['NeobotPurpleLite'],
                    func(sprite, script) {
                        const motor = script.getNumberField('MOTOR');

                        if (Entry.NeobotPurpleLite.log_to_console) {
                            Entry.console.print('=== neobot_purple_lite_motor_stop ===', 'speak');
                            Entry.console.print(`motor : ${motor}`, 'speak');
                            Entry.console.print('==========================', 'speak');
                        }

                        if (motor == 1) {
                            Entry.NeobotPurpleLite.remoteBuffer.DCL = 0;
                            Entry.NeobotPurpleLite.remoteBuffer.DCR = 0;
                        } else if (motor == 2) {
                            Entry.NeobotPurpleLite.remoteBuffer.DCL = 0;
                        } else {
                            Entry.NeobotPurpleLite.remoteBuffer.DCR = 0;
                        }
                        return script.callReturn();
                    },
                },

                /*************************
                 * class neobot_purple_lite_melody
                 *************************/
                neobot_purple_lite_buzzer_title: {
                    color: EntryStatic.colorSet.common.TRANSPARENT,
                    fontColor: '#191970',
                    skeleton: 'basic_text',
                    skeletonOptions: {
                        contentPos: {
                            x: 5,
                        },
                    },
                    params: [
                        {
                            type: 'Text',
                            text: Lang.template.neobot_purple_lite_buzzer_title,
                            color: '#191970',
                            align: 'left',
                        },
                    ],
                    def: {
                        type: 'neobot_purple_lite_buzzer_title',
                    },
                    class: 'neobot_purple_lite_buzzer',
                    isNotFor: ['NeobotPurpleLite'],
                    events: {},
                },
                neobot_purple_lite_play_note_for: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.neobot_purple_lite_sound_silent, '0'],
                                [Lang.Blocks.neobot_purple_lite_sound_do, '1'],
                                [Lang.Blocks.neobot_purple_lite_sound_do_shop, '2'],
                                [Lang.Blocks.neobot_purple_lite_sound_re, '3'],
                                [Lang.Blocks.neobot_purple_lite_sound_re_shop, '4'],
                                [Lang.Blocks.neobot_purple_lite_sound_mi, '5'],
                                [Lang.Blocks.neobot_purple_lite_sound_fa, '6'],
                                [Lang.Blocks.neobot_purple_lite_sound_fa_shop, '7'],
                                [Lang.Blocks.neobot_purple_lite_sound_so, '8'],
                                [Lang.Blocks.neobot_purple_lite_sound_so_shop, '9'],
                                [Lang.Blocks.neobot_purple_lite_sound_la, '10'],
                                [Lang.Blocks.neobot_purple_lite_sound_la_shop, '11'],
                                [Lang.Blocks.neobot_purple_lite_sound_ti, '12'],
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
                                [Lang.Blocks.neobot_purple_lite_sound_half_note, '2'],
                                [Lang.Blocks.neobot_purple_lite_sound_quarter_note, '4'],
                                [Lang.Blocks.neobot_purple_lite_sound_eighth_note, '8'],
                                [Lang.Blocks.neobot_purple_lite_sound_sixteenth_note, '16'],
                            ],
                            value: '2',
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                        {
                            type: 'Indicator',
                            img: 'block_icon/hardwarelite_icon.svg',
                            size: 12,
                        },
                    ],
                    events: {},
                    def: {
                        params: ['1', '2', '4', null],
                        type: 'neobot_purple_lite_play_note_for',
                    },
                    paramsKeyMap: {
                        NOTE: 0,
                        OCTAVE: 1,
                        DURATION: 2,
                    },
                    class: 'neobot_purple_lite_buzzer',
                    isNotFor: ['NeobotPurpleLite'],
                    func(sprite, script) {
                        if (!script.isStart) {
                            const note = script.getNumberField('NOTE', script);
                            const octave = script.getNumberField('OCTAVE', script);
                            const duration = script.getNumberField('DURATION', script);
                            let value = note > 0 ? note + 12 * octave : 0;

                            value = Math.min(value, 72);

                            if (Entry.NeobotPurpleLite.log_to_console) {
                                Entry.console.print(
                                    '=== neobot_purple_lite_play_note_for ===',
                                    'speak'
                                );
                                Entry.console.print(`note : ${note}`, 'speak');
                                Entry.console.print(`octave : ${octave}`, 'speak');
                                Entry.console.print(`duration : ${duration}`, 'speak');
                                Entry.console.print(`value : ${value}`, 'speak');
                                Entry.console.print('==========================', 'speak');
                            }

                            script.isStart = true;
                            script.timeFlag = 1;

                            Entry.NeobotPurpleLite.remoteBuffer.SND = value;
                            setTimeout(() => {
                                Entry.NeobotPurpleLite.remoteBuffer.SND = 0;
                                if (Entry.NeobotPurpleLite.log_to_console) {
                                    Entry.console.print(
                                        'neobot_purple_lite_play_note_for : 0',
                                        'speak'
                                    );
                                }
                                script.timeFlag = 0;
                            }, (1 / duration) * 2000);
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

                neobot_purple_lite_melody_play_with_sensor: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.neobot_purple_lite_port_1, 'IN1'],
                                [Lang.Blocks.neobot_purple_lite_port_2, 'IN2'],
                                [Lang.Blocks.neobot_purple_lite_port_3, 'IN3'],
                            ],
                            value: 'IN1',
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                        {
                            type: 'Indicator',
                            img: 'block_icon/hardwarelite_icon.svg',
                            size: 12,
                        },
                    ],
                    events: {},
                    def: {
                        params: [null, null],
                        type: 'neobot_purple_lite_melody_play_with_sensor',
                    },
                    paramsKeyMap: {
                        INPUT: 0,
                    },
                    class: 'neobot_purple_lite_buzzer',
                    isNotFor: ['NeobotPurpleLite'],
                    func(sprite, script) {
                        const input = script.getStringField('INPUT');
                        let value = Entry.NeobotPurpleLite.localBuffer[input];

                        // edited 210421, 0~100 을 0~65로 변환, 100 이상은 최대값으로 처리함.
                        value = Math.max(value, 0);
                        value = Math.min(value, 100);
                        value = Math.ceil((value / 100) * 65);

                        if (Entry.NeobotPurpleLite.log_to_console) {
                            Entry.console.print(
                                '=== neobot_purple_lite_melody_play_with_sensor ===',
                                'speak'
                            );
                            Entry.console.print(`input : ${input}`, 'speak');
                            Entry.console.print(`value : ${value}`, 'speak');
                            Entry.console.print('==========================', 'speak');
                        }

                        Entry.NeobotPurpleLite.remoteBuffer.SND = value;
                        return script.callReturn();
                    },
                },

                neobot_purple_lite_melody_stop: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Indicator',
                            img: 'block_icon/hardwarelite_icon.svg',
                            size: 12,
                        },
                    ],
                    events: {},
                    def: {
                        params: [null],
                        type: 'neobot_purple_lite_melody_stop',
                    },
                    paramsKeyMap: {},
                    class: 'neobot_purple_lite_buzzer',
                    isNotFor: ['NeobotPurpleLite'],
                    func(sprite, script) {
                        if (Entry.NeobotPurpleLite.log_to_console) {
                            Entry.console.print('=== neobot_purple_lite_melody_stop ===', 'speak');
                            Entry.console.print('value : 0', 'speak');
                            Entry.console.print('==========================', 'speak');
                        }

                        Entry.NeobotPurpleLite.remoteBuffer.SND = 0;
                        return script.callReturn();
                    },
                },

                /*************************
                 * class neobot_purple_lite_servo
                 *************************/
                neobot_purple_lite_servo_title: {
                    color: EntryStatic.colorSet.common.TRANSPARENT,
                    fontColor: '#191970',
                    skeleton: 'basic_text',
                    skeletonOptions: {
                        contentPos: {
                            x: 5,
                        },
                    },
                    params: [
                        {
                            type: 'Text',
                            text: Lang.template.neobot_purple_lite_servo_title,
                            color: '#191970',
                            align: 'left',
                        },
                    ],
                    def: {
                        type: 'neobot_purple_lite_servo_title',
                    },
                    class: 'neobot_purple_lite_servo',
                    isNotFor: ['NeobotPurpleLite'],
                    events: {},
                },
                neobot_purple_lite_servo_init: {
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
                                [Lang.Blocks.neobot_purple_lite_out_all, 'ALL'],
                            ],
                            value: 'OUT1',
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                        {
                            type: 'Indicator',
                            img: 'block_icon/hardwarelite_icon.svg',
                            size: 12,
                        },
                    ],
                    events: {},
                    def: {
                        params: [null, null],
                        type: 'neobot_purple_lite_servo_init',
                    },
                    paramsKeyMap: {
                        PORT: 0,
                    },
                    class: 'neobot_purple_lite_servo',
                    isNotFor: ['NeobotPurpleLite'],
                    func(sprite, script) {
                        if (!script.isStart) {
                            const port = script.getStringField('PORT', script);
                            const resetValue = 186;
                            const initValue = 1;

                            if (Entry.NeobotPurpleLite.log_to_console) {
                                Entry.console.print(
                                    '=== neobot_purple_lite_servo_init ===',
                                    'speak'
                                );
                                Entry.console.print(`port : ${port}`, 'speak');
                                Entry.console.print('==========================', 'speak');
                            }

                            let out1 = port == 'OUT1';
                            let out2 = port == 'OUT2';
                            let out3 = port == 'OUT3';
                            if (port == 'ALL') {
                                out1 = true;
                                out2 = true;
                                out3 = true;
                            }

                            script.isStart = true;
                            script.timeFlag = 1;

                            if (out1) {
                                Entry.NeobotPurpleLite.remoteBuffer.OUT1 = resetValue;
                            }
                            if (out2) {
                                Entry.NeobotPurpleLite.remoteBuffer.OUT2 = resetValue;
                            }
                            if (out3) {
                                Entry.NeobotPurpleLite.remoteBuffer.OUT3 = resetValue;
                            }
                            if (Entry.NeobotPurpleLite.log_to_console) {
                                Entry.console.print(
                                    `neobot_purple_lite_servo_init : ${resetValue}`,
                                    'speak'
                                );
                            }
                            setTimeout(() => {
                                if (out1) {
                                    Entry.NeobotPurpleLite.remoteBuffer.OUT1 = initValue;
                                }
                                if (out2) {
                                    Entry.NeobotPurpleLite.remoteBuffer.OUT2 = initValue;
                                }
                                if (out3) {
                                    Entry.NeobotPurpleLite.remoteBuffer.OUT3 = initValue;
                                }
                                if (Entry.NeobotPurpleLite.log_to_console) {
                                    Entry.console.print(
                                        `neobot_purple_lite_servo_init : ${initValue}`,
                                        'speak'
                                    );
                                }
                                setTimeout(() => {
                                    script.timeFlag = 0;
                                }, 100);
                            }, 200);

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

                neobot_purple_lite_servo_rotate: {
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
                                [Lang.Blocks.neobot_purple_lite_out_all, 'ALL'],
                            ],
                            value: 'OUT1',
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.neobot_purple_lite_servo_dir_1, '1'],
                                [Lang.Blocks.neobot_purple_lite_servo_dir_2, '2'],
                            ],
                            value: '1',
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                        {
                            type: 'Dropdown',
                            options: [
                                ['IN1', 'IN1'],
                                ['IN2', 'IN2'],
                                ['IN3', 'IN3'],
                                ['0%', 0],
                                ['10%', 10],
                                ['20%', 20],
                                ['30%', 30],
                                ['40%', 40],
                                ['50%', 50],
                                ['60%', 60],
                                ['70%', 70],
                                ['80%', 80],
                                ['90%', 90],
                                ['100%', 100],
                            ],
                            value: 50,
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                        {
                            type: 'Indicator',
                            img: 'block_icon/hardwarelite_icon.svg',
                            size: 12,
                        },
                    ],
                    events: {},
                    def: {
                        params: [null, null, null, null],
                        type: 'neobot_purple_lite_servo_rotate',
                    },
                    paramsKeyMap: {
                        PORT: 0,
                        DIRECTION: 1,
                        SPEED: 2,
                    },
                    class: 'neobot_purple_lite_servo',
                    isNotFor: ['NeobotPurpleLite'],
                    func(sprite, script) {
                        const port = script.getStringField('PORT', script);
                        const direction = script.getNumberField('DIRECTION');
                        const speed = script.getStringField('SPEED');

                        let directionValue = 192; // 정방향
                        if (direction == 2) {
                            directionValue = 208; // 역방향
                        }
                        let speedValue;
                        if (Entry.Utils.isNumber(speed)) {
                            speedValue = Entry.parseNumber(speed);
                        } else {
                            speedValue = Entry.NeobotPurpleLite.localBuffer[speed];
                        }

                        // edited 210421, 0~100 을 0~10 으로 변환
                        speedValue = Math.max(speedValue, 0);
                        speedValue = Math.min(speedValue, 100);
                        speedValue = Math.ceil(speedValue / 10);

                        let outValue = directionValue + speedValue;
                        if (outValue == directionValue) {
                            outValue = 254;
                        } else {
                            outValue = outValue - 1;
                        }

                        if (Entry.NeobotPurpleLite.log_to_console) {
                            Entry.console.print('=== neobot_purple_lite_servo_rotate ===');
                            Entry.console.print(`port : ${port}`, 'speak');
                            Entry.console.print(`direction : ${direction}`, 'speak');
                            Entry.console.print(`speed : ${speed}`, 'speak');
                            Entry.console.print(`direction value : ${directionValue}`, 'speak');
                            Entry.console.print(`speed value : ${speedValue}`, 'speak');
                            Entry.console.print(`output value : ${outValue}`, 'speak');
                            Entry.console.print('==========================', 'speak');
                        }

                        if (port == 'ALL') {
                            Entry.NeobotPurpleLite.remoteBuffer.OUT1 = outValue;
                            Entry.NeobotPurpleLite.remoteBuffer.OUT2 = outValue;
                            Entry.NeobotPurpleLite.remoteBuffer.OUT3 = outValue;
                        } else {
                            Entry.NeobotPurpleLite.remoteBuffer[port] = outValue;
                        }
                        return script.callReturn();
                    },
                },
                neobot_purple_lite_servo_stop: {
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
                                [Lang.Blocks.neobot_purple_lite_out_all, 'ALL'],
                            ],
                            value: 'OUT1',
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                        {
                            type: 'Indicator',
                            img: 'block_icon/hardwarelite_icon.svg',
                            size: 12,
                        },
                    ],
                    events: {},
                    def: {
                        params: [null, null],
                        type: 'neobot_purple_lite_servo_stop',
                    },
                    paramsKeyMap: {
                        PORT: 0,
                    },
                    class: 'neobot_purple_lite_servo',
                    isNotFor: ['NeobotPurpleLite'],
                    func(sprite, script) {
                        const port = script.getStringField('PORT', script);
                        const outValue = 254;

                        if (Entry.NeobotPurpleLite.log_to_console) {
                            Entry.console.print('=== neobot_purple_lite_servo_stop ===', 'speak');
                            Entry.console.print(`port : ${port}`, 'speak');
                            Entry.console.print(`output value: ${outValue}`, 'speak');
                            Entry.console.print('==========================', 'speak');
                        }

                        if (port == 'ALL') {
                            Entry.NeobotPurpleLite.remoteBuffer.OUT1 = outValue;
                            Entry.NeobotPurpleLite.remoteBuffer.OUT2 = outValue;
                            Entry.NeobotPurpleLite.remoteBuffer.OUT3 = outValue;
                        } else {
                            Entry.NeobotPurpleLite.remoteBuffer[port] = outValue;
                        }
                        return script.callReturn();
                    },
                },

                neobot_purple_lite_servo_change_degree: {
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
                                ['OUT3', 'OUT3'],
                                [Lang.Blocks.neobot_purple_lite_out_all, 'ALL'],
                            ],
                            value: 'OUT1',
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.neobot_purple_lite_servo_dir_1, '1'],
                                [Lang.Blocks.neobot_purple_lite_servo_dir_2, '2'],
                            ],
                            value: '1',
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                        {
                            type: 'Dropdown',
                            options: [
                                ['IN1', 'IN1'],
                                ['IN2', 'IN2'],
                                ['IN3', 'IN3'],
                                ['0%', 0],
                                ['10%', 10],
                                ['20%', 20],
                                ['30%', 30],
                                ['40%', 40],
                                ['50%', 50],
                                ['60%', 60],
                                ['70%', 70],
                                ['80%', 80],
                                ['90%', 90],
                                ['100%', 100],
                            ],
                            value: 50,
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                        {
                            type: 'Indicator',
                            img: 'block_icon/hardwarelite_icon.svg',
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
                        type: 'neobot_purple_lite_servo_change_degree',
                    },
                    paramsKeyMap: {
                        DEGREE: 0,
                        PORT: 1,
                        DIRECTION: 2,
                        SPEED: 3,
                    },
                    class: 'neobot_purple_lite_servo',
                    isNotFor: ['NeobotPurpleLite'],
                    func(sprite, script) {
                        if (!script.isStart) {
                            const port = script.getStringField('PORT', script);
                            const direction = script.getNumberField('DIRECTION');
                            const speed = script.getStringValue('SPEED');
                            const degree = script.getStringValue('DEGREE');

                            let out1 = port == 'OUT1';
                            let out2 = port == 'OUT2';
                            let out3 = port == 'OUT3';
                            if (port == 'ALL') {
                                out1 = true;
                                out2 = true;
                                out3 = true;
                            }

                            let directionValue = 188;
                            if (direction == 2) {
                                directionValue = 189;
                            }

                            let speedValue;
                            if (Entry.Utils.isNumber(speed)) {
                                speedValue = Entry.parseNumber(speed);
                            } else {
                                speedValue = Entry.NeobotPurpleLite.localBuffer[speed];
                            }

                            // edited 210421, 0~100 을 240~250 으로 변환
                            speedValue = Math.max(speedValue, 0);
                            speedValue = Math.min(speedValue, 100);
                            speedValue = Math.ceil(speedValue / 10) + 240;

                            let degreeValue;
                            if (Entry.Utils.isNumber(degree)) {
                                degreeValue = Entry.parseNumber(degree);
                            } else {
                                if (degree == 'IN1' || degree == 'IN2' || degree == 'IN3') {
                                    degreeValue = Entry.NeobotPurpleLite.localBuffer[degree];
                                } else {
                                    degreeValue = 0;
                                }
                            }
                            // edited 210421, 별도의 변환없이 그대로 사용함
                            degreeValue = Math.max(degreeValue, 0);
                            degreeValue = Math.min(degreeValue, 180);
                            degreeValue = degreeValue + 1;

                            if (Entry.NeobotPurpleLite.log_to_console) {
                                Entry.console.print(
                                    '=== neobot_purple_lite_servo_change_degree ===',
                                    'speak'
                                );
                                Entry.console.print(`port : ${port}`, 'speak');
                                Entry.console.print(`direction : ${direction}`, 'speak');
                                Entry.console.print(`speed : ${speed}`, 'speak');
                                Entry.console.print(`degree : ${degree}`, 'speak');
                                Entry.console.print(`directionValue : ${directionValue}`, 'speak');
                                Entry.console.print(`speedValue : ${speedValue}`, 'speak');
                                Entry.console.print(`degreeValue : ${degreeValue}`, 'speak');
                                Entry.console.print('==========================', 'speak');
                            }

                            script.isStart = true;
                            script.timeFlag = 1;

                            // direction
                            if (out1) {
                                Entry.NeobotPurpleLite.remoteBuffer.OUT1 = directionValue;
                            }
                            if (out2) {
                                Entry.NeobotPurpleLite.remoteBuffer.OUT2 = directionValue;
                            }
                            if (out3) {
                                Entry.NeobotPurpleLite.remoteBuffer.OUT3 = directionValue;
                            }
                            if (Entry.NeobotPurpleLite.log_to_console) {
                                Entry.console.print(
                                    `neobot_purple_lite_servo_change_degree : ${directionValue}`,
                                    'speak'
                                );
                            }
                            setTimeout(() => {
                                // speed
                                if (out1) {
                                    Entry.NeobotPurpleLite.remoteBuffer.OUT1 = speedValue;
                                }
                                if (out2) {
                                    Entry.NeobotPurpleLite.remoteBuffer.OUT2 = speedValue;
                                }
                                if (out3) {
                                    Entry.NeobotPurpleLite.remoteBuffer.OUT3 = speedValue;
                                }
                                if (Entry.NeobotPurpleLite.log_to_console) {
                                    Entry.console.print(
                                        `neobot_purple_lite_servo_change_degree : ${speedValue}`,
                                        'speak'
                                    );
                                }
                                setTimeout(() => {
                                    // degree
                                    if (out1) {
                                        Entry.NeobotPurpleLite.remoteBuffer.OUT1 = degreeValue;
                                    }
                                    if (out2) {
                                        Entry.NeobotPurpleLite.remoteBuffer.OUT2 = degreeValue;
                                    }
                                    if (out3) {
                                        Entry.NeobotPurpleLite.remoteBuffer.OUT3 = degreeValue;
                                    }
                                    if (Entry.NeobotPurpleLite.log_to_console) {
                                        Entry.console.print(
                                            `neobot_purple_lite_servo_change_degree : ${degreeValue}`,
                                            'speak'
                                        );
                                    }
                                    setTimeout(() => {
                                        // final delay
                                        script.timeFlag = 0;
                                    }, 200);
                                }, 200);
                            }, 200);

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

                /*****************
                 * ARG Blocks
                 *****************/
                neobot_purple_lite_arg_led_duration: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic_string_field',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.neobot_purple_lite_duration_cont, '계속'],
                                [Lang.Blocks.neobot_purple_lite_duration_1s, '1'],
                                [Lang.Blocks.neobot_purple_lite_duration_2s, '2'],
                                [Lang.Blocks.neobot_purple_lite_duration_3s, '3'],
                                [Lang.Blocks.neobot_purple_lite_duration_4s, '4'],
                                [Lang.Blocks.neobot_purple_lite_duration_5s, '5'],
                                [Lang.Blocks.neobot_purple_lite_duration_6s, '6'],
                                [Lang.Blocks.neobot_purple_lite_duration_7s, '7'],
                                [Lang.Blocks.neobot_purple_lite_duration_8s, '8'],
                                [Lang.Blocks.neobot_purple_lite_duration_9s, '9'],
                            ],
                            value: '계속',
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
                    class: 'neobot_purple_lite_led',
                    isNotFor: ['NeobotPurpleLite'],
                    func(sprite, script) {
                        return script.getStringField('VALUE');
                    },
                },

                neobot_purple_lite_arg_motor_speed: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic_string_field',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                ['IN1', 'IN1'],
                                ['IN2', 'IN2'],
                                ['IN3', 'IN3'],
                                ['100%', 100],
                                ['90%', 90],
                                ['80%', 80],
                                ['70%', 70],
                                ['60%', 60],
                                ['50%', 50],
                                ['40%', 40],
                                ['30%', 30],
                                ['20%', 20],
                                ['10%', 10],
                                ['0%', 0],
                            ],
                            value: 100,
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
                    class: 'neobot_purple_lite_motor',
                    isNotFor: ['NeobotPurpleLite'],
                    func(sprite, script) {
                        return script.getStringField('VALUE');
                    },
                },

                neobot_purple_lite_arg_motor_duration: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic_string_field',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.neobot_purple_lite_duration_cont, '계속'],
                                [Lang.Blocks.neobot_purple_lite_duration_1s, '1'],
                                [Lang.Blocks.neobot_purple_lite_duration_2s, '2'],
                                [Lang.Blocks.neobot_purple_lite_duration_3s, '3'],
                                [Lang.Blocks.neobot_purple_lite_duration_4s, '4'],
                                [Lang.Blocks.neobot_purple_lite_duration_5s, '5'],
                                [Lang.Blocks.neobot_purple_lite_duration_6s, '6'],
                                [Lang.Blocks.neobot_purple_lite_duration_7s, '7'],
                                [Lang.Blocks.neobot_purple_lite_duration_8s, '8'],
                                [Lang.Blocks.neobot_purple_lite_duration_9s, '9'],
                            ],
                            value: '계속',
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
                    class: 'neobot_purple_lite_motor',
                    isNotFor: ['NeobotPurpleLite'],
                    func(sprite, script) {
                        return script.getStringField('VALUE');
                    },
                },

                get_servo_degree: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic_string_field',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.neobot_purple_lite_port_1, 'IN1'],
                                [Lang.Blocks.neobot_purple_lite_port_2, 'IN2'],
                                [Lang.Blocks.neobot_purple_lite_port_3, 'IN3'],
                                [Lang.Blocks.neobot_purple_lite_angle_0, '0'],
                                [Lang.Blocks.neobot_purple_lite_angle_5, '5'],
                                [Lang.Blocks.neobot_purple_lite_angle_10, '10'],
                                [Lang.Blocks.neobot_purple_lite_angle_15, '15'],
                                [Lang.Blocks.neobot_purple_lite_angle_20, '20'],
                                [Lang.Blocks.neobot_purple_lite_angle_25, '25'],
                                [Lang.Blocks.neobot_purple_lite_angle_30, '30'],
                                [Lang.Blocks.neobot_purple_lite_angle_35, '35'],
                                [Lang.Blocks.neobot_purple_lite_angle_40, '40'],
                                [Lang.Blocks.neobot_purple_lite_angle_45, '45'],
                                [Lang.Blocks.neobot_purple_lite_angle_50, '50'],
                                [Lang.Blocks.neobot_purple_lite_angle_55, '55'],
                                [Lang.Blocks.neobot_purple_lite_angle_60, '60'],
                                [Lang.Blocks.neobot_purple_lite_angle_65, '65'],
                                [Lang.Blocks.neobot_purple_lite_angle_70, '70'],
                                [Lang.Blocks.neobot_purple_lite_angle_75, '75'],
                                [Lang.Blocks.neobot_purple_lite_angle_80, '80'],
                                [Lang.Blocks.neobot_purple_lite_angle_85, '85'],
                                [Lang.Blocks.neobot_purple_lite_angle_90, '90'],
                                [Lang.Blocks.neobot_purple_lite_angle_95, '95'],
                                [Lang.Blocks.neobot_purple_lite_angle_100, '100'],
                                [Lang.Blocks.neobot_purple_lite_angle_105, '105'],
                                [Lang.Blocks.neobot_purple_lite_angle_110, '110'],
                                [Lang.Blocks.neobot_purple_lite_angle_115, '115'],
                                [Lang.Blocks.neobot_purple_lite_angle_120, '120'],
                                [Lang.Blocks.neobot_purple_lite_angle_125, '125'],
                                [Lang.Blocks.neobot_purple_lite_angle_130, '130'],
                                [Lang.Blocks.neobot_purple_lite_angle_135, '135'],
                                [Lang.Blocks.neobot_purple_lite_angle_140, '140'],
                                [Lang.Blocks.neobot_purple_lite_angle_145, '145'],
                                [Lang.Blocks.neobot_purple_lite_angle_150, '150'],
                                [Lang.Blocks.neobot_purple_lite_angle_155, '155'],
                                [Lang.Blocks.neobot_purple_lite_angle_160, '160'],
                                [Lang.Blocks.neobot_purple_lite_angle_165, '165'],
                                [Lang.Blocks.neobot_purple_lite_angle_170, '170'],
                                [Lang.Blocks.neobot_purple_lite_angle_175, '175'],
                                [Lang.Blocks.neobot_purple_lite_angle_180, '180'],
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
                    class: 'neobot_purple_lite_servo',
                    isNotFor: ['NeobotPurpleLite'],
                    func(sprite, script) {
                        return script.getStringField('VALUE');
                    },
                },
            };
        };
    })();
})();

module.exports = Entry.NeobotPurpleLite;
