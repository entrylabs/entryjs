'use strict';

/*
 엔트리에 정의된 블럭 명령어
 엔트리에서 받을 때는 BlockTypes 로 통신하고,
 하드웨어로 전송할 때는 Command 로 변환 후 Pdu 로 Wrapping 하여 전송한다.
 */
const NeoBlockType = {
    // MOTOR 명령어 0x1X
    MOTOR_MOVE: 0x11,
    MOTOR_MOVE_BOTH: 0x12,
    MOTOR_STOP: 0x13,
    ROBOT_MOVE: 0x14,
    ROBOT_STOP: 0x15,
    // SERVO 명령어 0x2X
    SERVO_RESET: 0x21,
    SERVO_ANGLE: 0x22,
    SERVO_ANGLE_WAIT: 0x23,
    SERVO_ROTATE: 0x24,
    SERVO_STOP: 0x25,
    // LINE_TRACER 명령어 0x3X
    LINE_TRACER_START: 0x31,
    LINE_CROSS_MOVE: 0x32,
    LINE_CROSS_TURN: 0x33,
    LINE_CHANGE_START: 0x34,
    LINE_CHANGE_TURN: 0x35,
    // AUTO_DRIVING 명령어 0x4X
    AUTO_DRIVING_START: 0x41,
    AUTO_DRIVING_SENSOR_START: 0x42,
    AUTO_DRIVING_STOP: 0x43,
    AUTO_PARKING_START: 0x44,
    AUTO_DETECT_WALL_START: 0x45,
    AUTO_DETECT_WALL_TURN: 0x46,
    // LED 명령어 0x5X
    LED_ON: 0x51,
    LED_BLINK: 0x52,
    LED_OFF: 0x53,
    COLOR_LED_ON: 0x54,
    COLOR_LED_OFF: 0x55,
    COLOR_LED_ON_SENSOR: 0x56,
    // SET_OUTPUT 명령어 0x6X
    SET_OUTPUT: 0x61,
    // BUZZER 명령어 0x7X
    BUZZER_START: 0x71,
    BUZZER_WITH_SENSOR: 0x72,
    BUZZER_STOP: 0x73,
    // LCD 명령어 0x8X
    LCD_IMAGE: 0x81,
    LCD_TEXT: 0x82,
};

/*
 PDU 정의
 */
const HEADER = [0xaa, 0xaa, 0xcc];

const FrameCode = {
    BASIC: 0x01,
};

const PduCode = {
    SENSOR_DATA: 0x01,
    CONTROLLER_COMMAND: 0x02,
    ACTION_COMMAND: 0x03,
    BASIC: 0x10,
    EXTEND_1: 0x11,
    EXTEND_2: 0x12,
    EXTEND_3: 0x13,
};

const ActorKind = {
    CONTROLLER: 0x00,
    LED: 0x80,
    SERVO: 0x81,
    COLOR_LED: 0x82,
    LCD: 0x83,
};

const ControllerCommand = {
    CONTROLLER_LED: 0x01,
    BUZZER: 0x02,
    MOTOR: 0x03,
    MOTOR_BOTH: 0x04,
    ROBOT: 0x05,
    LINE_TRACER: 0x06,
    AUTO_DRIVING: 0x07,
    AUTO_PARKING: 0x08,
    AUTO_DETECT_WALL: 0x09,
};

const ServoCommand = {
    STOP: 0x01,
    RESET: 0x02,
    ANGLE: 0x03,
    ANGLE_WAIT: 0x04,
    ROTATE: 0x05,
};

const LedCommand = {
    OFF: 0x00,
    ON: 0x01,
};

const LcdCommand = {
    IMAGE: 0x01,
    TEXT: 0x02,
};

const UnitId = {
    CONTROLLER: 0x00,
    CONTROLLER_IN1: 0x01,
    CONTROLLER_IN2: 0x02,
    CONTROLLER_IN3: 0x03,
    SENSOR_STICK: 0x10,
    SENSOR_STICK_IN1: 0x11,
    IOT: 0x80,
    CONTROLLER_OUT1: 0x81,
    CONTROLLER_OUT2: 0x82,
    CONTROLLER_OUT12: 0x83,
    CONTROLLER_OUT3: 0x84,
    CONTROLLER_OUT13: 0x85,
    CONTROLLER_OUT23: 0x86,
    CONTROLLER_OUT123: 0x87,
    CONTROLLER_OUT_ALL: 0x8f,
};

/*
 블럭 실행 단계
 execute: 최초 실행
 pending_response: 최초 실행의 response 대기중인 상태
 set_timeout: 블럭에서 duration 필드에 의거하여 타임아웃을 설정
 wait_timeout: timeout 대기중인 상태
 stop: 파라미터를 0으로 바꿔서 실행
 pending_stop: 파라미터를 0으로 바꾼 실행의 response 대기중인 상태
 end: 실행 종료 단계
 */
const ExecPhase = {
    EXECUTE: 'execute',
    PENDING_RESPONSE: 'pending_response',
    SET_TIMEOUT: 'set_timeout',
    WAIT_TIMEOUT: 'wait_timeout',
    STOP: 'stop',
    PENDING_STOP: 'pending_stop',
    END: 'end',
};

/*
 dropdown params
 양이 많아서 분리함.
 */
Entry.Neo = new (class Neo {
    constructor() {
        this.id = '5.8';
        this.url = 'http://www.neobot.co.kr';
        this.name = 'neo';
        this.imageName = 'neo.png';
        this.title = {
            ko: '네오(NEO)',
            en: 'NEO',
        };
        this.blockMenuBlocks = [
            // motor & robot
            'neo_motor_title',
            'neo_motor_move',
            'neo_motor_move_both',
            'neo_robot_move',
            'neo_motor_stop',
            'neo_robot_stop',
            // servo
            'neo_servo_title',
            'neo_servo_reset',
            'neo_servo_angle',
            'neo_servo_angle_var',
            'neo_servo_angle_wait',
            'neo_servo_rotate',
            'neo_servo_stop',
            // line tracer
            'neo_line_tracer_title',
            'neo_line_tracer_start',
            'neo_line_cross_move',
            'neo_line_cross_turn',
            // auto driving
            'neo_auto_driving_title',
            'neo_auto_driving_start',
            'neo_auto_driving_sensor_start',
            'neo_auto_driving_stop',
            // auto parking
            'neo_auto_parking_title',
            'neo_auto_parking_start',
            /*// line change
            'neo_line_change_title',
            'neo_line_change_start',
            'neo_line_change_turn',
            // auto detect wall
            'neo_auto_detect_wall_title',
            'neo_auto_detect_wall_start',
            'neo_auto_detect_wall_turn',*/
            // led
            'neo_led_title',
            'neo_led_on',
            'neo_led_blink',
            'neo_led_off',
            // color led
            'neo_color_led_title',
            'neo_color_led_on',
            'neo_color_led_off',
            'neo_color_led_on_with_sensor',
            // set output
            'neo_set_output_title',
            'neo_set_output',
            // sensor
            'neo_sensor_title',
            'neo_sensor_in',
            'neo_sensor_digital_in',
            'neo_sensor_convert',
            'neo_sensor_compare',
            'neo_sensor_between',
            'neo_sensor_color_compare',
            'neo_sensor_button_pressed',
            // lcd
            'neo_lcd_title',
            'neo_lcd_image',
            'neo_lcd_text',
            // buzzer
            'neo_buzzer_title',
            'neo_buzzer_start',
            'neo_buzzer_with_sensor',
            'neo_buzzer_stop',
        ];
        this.seqBlockId = 0;
        this.executeList = {};
        this.pendingResponseList = {};
        this.monitorTemplate = {
            imgPath: 'hw/neo.png',
            width: 500,
            height: 500,
            listPorts: {
                IN11: { name: 'IN1 1', type: 'input', pos: { x: 0, y: 0 } },
                IN12: { name: 'IN1 2', type: 'input', pos: { x: 0, y: 0 } },
                IN13: { name: 'IN1 3', type: 'input', pos: { x: 0, y: 0 } },
                IN14: { name: 'IN1 4', type: 'input', pos: { x: 0, y: 0 } },
                IN21: { name: 'IN2 1', type: 'input', pos: { x: 0, y: 0 } },
                IN22: { name: 'IN2 2', type: 'input', pos: { x: 0, y: 0 } },
                IN23: { name: 'IN2 3', type: 'input', pos: { x: 0, y: 0 } },
                IN24: { name: 'IN2 4', type: 'input', pos: { x: 0, y: 0 } },
                IN31: { name: 'IN3 1', type: 'input', pos: { x: 0, y: 0 } },
                IN32: { name: 'IN3 2', type: 'input', pos: { x: 0, y: 0 } },
                IN33: { name: 'IN3 3', type: 'input', pos: { x: 0, y: 0 } },
                IN34: { name: 'IN3 4', type: 'input', pos: { x: 0, y: 0 } },
                IR: { name: 'IR', type: 'input', pos: { x: 0, y: 0 } },
                BAT: { name: 'BAT', type: 'input', pos: { x: 0, y: 0 } },
            },
            mode: 'both',
        };
    }

    setZero() {
        const blockId = this.generateBlockId();
        const pdu = this.makePdu([FrameCode.BASIC, PduCode.CONTROLLER_COMMAND, blockId, 0x04]);
        Entry.hw.sendQueue.executeList = {
            blockId: {
                blockId,
                pdu,
            },
        };
        Entry.hw.update();

        this.pendingResponseList = {};
        this.executeList = {};
    }

    afterReceive(portData) {
        for (let i = 0; i <= 255; i++) {
            if (this.pendingResponseList[i]) {
                if (portData.pendingList[i] && portData.pendingList[i].state === 'completed') {
                    delete this.pendingResponseList[i];
                    delete this.executeList[i];
                }
            }
        }
    }

    generateBlockId() {
        this.seqBlockId += 1;
        if (this.seqBlockId > 255) {
            this.seqBlockId = 1;
        }
        return this.seqBlockId;
    }

    setLanguage() {
        return {
            ko: {
                template: {
                    // motor & robot
                    neo_motor_title: '회전모터',
                    neo_motor_move: '회전모터 제어하기 %1 %2 %3 %4',
                    neo_motor_move_both: '회전모터 동시에 제어하기 L %1 R %2 %3',
                    neo_robot_move: '로봇 제어하기 %1 %2 %3 %4',
                    neo_motor_stop: '회전모터 멈추기 %1 %2',
                    neo_robot_stop: '로봇 멈추기 %1',

                    // servo
                    neo_servo_title: '서보모터',
                    neo_servo_reset: '%1 서보모터 현위치를 0도로 설정하기 %2',
                    neo_servo_angle: '서보모터 각도 바꾸기 %1 %2 %3 %4',
                    neo_servo_angle_var: '서보모터 각도 바꾸기 %1 %2 %3 %4',
                    neo_servo_angle_wait: '각도 바뀔때까지 기다리기 %1 %2 %3 %4',
                    neo_servo_rotate: '서보모터 회전하기 %1 %2 %3 %4',
                    neo_servo_stop: '서보모터 멈추기 %1 %2',

                    // line tracer
                    neo_line_tracer_title: '라인트레이서',
                    neo_line_tracer_start: '검은색 선 따라가기 %1 %2 %3',
                    neo_line_cross_move: '%1 교차로까지 직진하기 %2',
                    neo_line_cross_turn: '다음 교차로에서 방향바꾸기 %1 %2',

                    // auto driving
                    neo_auto_driving_title: '자율주행',
                    neo_auto_driving_start: '자율주행 시작하기 %1 %2 %3',
                    neo_auto_driving_sensor_start: '%1 를 감지하여 자율주행 %2 %3',
                    neo_auto_driving_stop: '자율주행 멈추기 %1',

                    // auto parking
                    neo_auto_parking_title: '자율주차',
                    neo_auto_parking_start: '주차하기 %1 %2 %3',

                    // line change
                    neo_line_change_title: '차선 변경',
                    neo_line_change_start: '%1 차로 변경하기 %2',
                    neo_line_change_turn: '교차로에서 회전하기 %1 %2',

                    // auto detect wall
                    neo_auto_detect_wall_title: '골목주행',
                    neo_auto_detect_wall_start: '벽 탐지하며 주행하기 %1 %2 %3',
                    neo_auto_detect_wall_turn: '골목에서 회전하기 %1 %2',

                    // led
                    neo_led_title: 'LED',
                    neo_led_on: 'LED 켜기 %1 %2 %3',
                    neo_led_blink: 'LED 깜빡이기 %1 %2 %3 %4',
                    neo_led_off: 'LED 끄기 %1 %2',

                    // color led
                    neo_color_led_title: '컬러 LED',
                    neo_color_led_on: '컬러LED 켜기 %1 %2 %3 %4',
                    neo_color_led_off: '컬러LED 끄기 %1 %2',
                    neo_color_led_on_with_sensor: '컬러센서 %1 로 컬러LED %2 제어 %3',

                    // set output
                    neo_set_output_title: '출력',
                    neo_set_output: '값 출력하기 %1 %2 %3 %4',

                    // sensor
                    neo_sensor_title: '센서',
                    neo_sensor_in: '%1',
                    neo_sensor_digital_in: '%1 의 %2',
                    neo_sensor_convert: '%1 %2 %3 → %4 %5',
                    neo_sensor_compare: '%1 %2 %3',
                    neo_sensor_between: '%1 %2 %3 %4 %5',
                    neo_sensor_color_compare: '%1 = %2',
                    neo_sensor_button_pressed: '%1 %2',

                    // buzzer
                    neo_buzzer_title: '버저',
                    neo_buzzer_start: '버저 울리기 %1 %2 %3 %4',
                    neo_buzzer_with_sensor: '센서로 버저 울리기 %1 %2',
                    neo_buzzer_stop: '버저 멈추기 %1',

                    // lcd
                    neo_lcd_title: 'LCD',
                    neo_lcd_image: 'LCD에 이미지 보여주기 %1 %2 %3',
                    neo_lcd_text: 'LCD에 텍스트 보여주기 %1 %2 %3',

                    // args
                    neo_arg_motor_speed: '%1',
                    neo_arg_duration: '%1',
                    neo_arg_robot_speed: '%1',
                    neo_arg_servo_angle: '%1',
                    neo_arg_servo_speed: '%1',
                    neo_arg_auto_driving_speed: '%1',
                    neo_arg_led_brightness: '%1',
                    neo_arg_led_blink_speed: '%1',
                    neo_arg_set_output_value: '%1',
                },
                Blocks: {
                    neo_input_1: 'IN1',
                    neo_input_2: 'IN2',
                    neo_input_3: 'IN3',
                    neo_input_12: 'IN1&2',
                    neo_input_123: 'IN1&2&3',
                    neo_input_1_2: 'IN1&IN2',
                    neo_input_11_12: 'IN1-1&IN1-2',
                    neo_input_13_14: 'IN1-3&IN1-4',
                    neo_input_21_22: 'IN2-1&IN2-2',
                    neo_input_23_24: 'IN2-3&IN2-4',

                    neo_output_1: 'OUT1',
                    neo_output_2: 'OUT2',
                    neo_output_3: 'OUT3',
                    neo_output_12: 'OUT1&2',
                    neo_output_123: 'OUT1&2&3',

                    neo_speed_0: '0%',
                    neo_speed_5: '5%',
                    neo_speed_10: '10%',
                    neo_speed_15: '15%',
                    neo_speed_20: '20%',
                    neo_speed_25: '25%',
                    neo_speed_30: '30%',
                    neo_speed_35: '35%',
                    neo_speed_40: '40%',
                    neo_speed_45: '45%',
                    neo_speed_50: '50%',
                    neo_speed_55: '55%',
                    neo_speed_60: '60%',
                    neo_speed_65: '65%',
                    neo_speed_70: '70%',
                    neo_speed_75: '75%',
                    neo_speed_80: '80%',
                    neo_speed_85: '85%',
                    neo_speed_90: '90%',
                    neo_speed_95: '95%',
                    neo_speed_100: '100%',

                    neo_duration_c: '계속',
                    neo_duration_0: '0초',
                    neo_duration_1: '1초',
                    neo_duration_2: '2초',
                    neo_duration_3: '3초',
                    neo_duration_4: '4초',
                    neo_duration_5: '5초',
                    neo_duration_6: '6초',
                    neo_duration_7: '7초',
                    neo_duration_8: '8초',
                    neo_duration_9: '9초',

                    neo_compare_gt: '≥',
                    neo_compare_g: '>',
                    neo_compare_e: '=',
                    neo_compare_l: '<',
                    neo_compare_lt: '≤',

                    neo_turn_direction_l: '좌회전',
                    neo_turn_direction_r: '우회전',
                    neo_turn_direction_u: 'U턴',

                    neo_motor_out_l: 'L모터',
                    neo_motor_out_r: 'R모터',
                    neo_motor_out_lr: 'L/R모터',

                    neo_motor_speed_n100: '-100%',
                    neo_motor_speed_n95: '-95%',
                    neo_motor_speed_n90: '-90%',
                    neo_motor_speed_n85: '-85%',
                    neo_motor_speed_n80: '-80%',
                    neo_motor_speed_n75: '-75%',
                    neo_motor_speed_n70: '-70%',
                    neo_motor_speed_n65: '-65%',
                    neo_motor_speed_n60: '-60%',
                    neo_motor_speed_n55: '-55%',
                    neo_motor_speed_n50: '-50%',
                    neo_motor_speed_n45: '-45%',
                    neo_motor_speed_n40: '-40%',
                    neo_motor_speed_n35: '-35%',
                    neo_motor_speed_n30: '-30%',
                    neo_motor_speed_n25: '-25%',
                    neo_motor_speed_n20: '-20%',
                    neo_motor_speed_n15: '-15%',
                    neo_motor_speed_n10: '-10%',
                    neo_motor_speed_n5: '-5%',
                    neo_motor_speed_0: '0%',
                    neo_motor_speed_5: '5%',
                    neo_motor_speed_10: '10%',
                    neo_motor_speed_15: '15%',
                    neo_motor_speed_20: '20%',
                    neo_motor_speed_25: '25%',
                    neo_motor_speed_30: '30%',
                    neo_motor_speed_35: '35%',
                    neo_motor_speed_40: '40%',
                    neo_motor_speed_45: '45%',
                    neo_motor_speed_50: '50%',
                    neo_motor_speed_55: '55%',
                    neo_motor_speed_60: '60%',
                    neo_motor_speed_65: '65%',
                    neo_motor_speed_70: '70%',
                    neo_motor_speed_75: '75%',
                    neo_motor_speed_80: '80%',
                    neo_motor_speed_85: '85%',
                    neo_motor_speed_90: '90%',
                    neo_motor_speed_95: '95%',
                    neo_motor_speed_100: '100%',

                    neo_robot_direction_f: '앞으로',
                    neo_robot_direction_b: '뒤로',
                    neo_robot_direction_l: '왼쪽으로',
                    neo_robot_direction_r: '오른쪽으로',
                    neo_robot_direction_tl: '제자리왼쪽',
                    neo_robot_direction_tr: '제자리오른쪽',

                    neo_servo_angle_n360: '-360도',
                    neo_servo_angle_n350: '-350도',
                    neo_servo_angle_n340: '-340도',
                    neo_servo_angle_n330: '-330도',
                    neo_servo_angle_n320: '-320도',
                    neo_servo_angle_n310: '-310도',
                    neo_servo_angle_n300: '-300도',
                    neo_servo_angle_n290: '-290도',
                    neo_servo_angle_n280: '-280도',
                    neo_servo_angle_n270: '-270도',
                    neo_servo_angle_n260: '-260도',
                    neo_servo_angle_n250: '-250도',
                    neo_servo_angle_n240: '-240도',
                    neo_servo_angle_n230: '-230도',
                    neo_servo_angle_n220: '-220도',
                    neo_servo_angle_n210: '-210도',
                    neo_servo_angle_n200: '-200도',
                    neo_servo_angle_n190: '-190도',
                    neo_servo_angle_n180: '-180도',
                    neo_servo_angle_n170: '-170도',
                    neo_servo_angle_n160: '-160도',
                    neo_servo_angle_n150: '-150도',
                    neo_servo_angle_n140: '-140도',
                    neo_servo_angle_n130: '-130도',
                    neo_servo_angle_n120: '-120도',
                    neo_servo_angle_n110: '-110도',
                    neo_servo_angle_n100: '-100도',
                    neo_servo_angle_n90: '-90도',
                    neo_servo_angle_n80: '-80도',
                    neo_servo_angle_n70: '-70도',
                    neo_servo_angle_n60: '-60도',
                    neo_servo_angle_n50: '-50도',
                    neo_servo_angle_n40: '-40도',
                    neo_servo_angle_n30: '-30도',
                    neo_servo_angle_n20: '-20도',
                    neo_servo_angle_n10: '-10도',
                    neo_servo_angle_0: '0도',
                    neo_servo_angle_10: '10도',
                    neo_servo_angle_20: '20도',
                    neo_servo_angle_30: '30도',
                    neo_servo_angle_40: '40도',
                    neo_servo_angle_50: '50도',
                    neo_servo_angle_60: '60도',
                    neo_servo_angle_70: '70도',
                    neo_servo_angle_80: '80도',
                    neo_servo_angle_90: '90도',
                    neo_servo_angle_100: '100도',
                    neo_servo_angle_110: '110도',
                    neo_servo_angle_120: '120도',
                    neo_servo_angle_130: '130도',
                    neo_servo_angle_140: '140도',
                    neo_servo_angle_150: '150도',
                    neo_servo_angle_160: '160도',
                    neo_servo_angle_170: '170도',
                    neo_servo_angle_180: '180도',
                    neo_servo_angle_190: '190도',
                    neo_servo_angle_200: '200도',
                    neo_servo_angle_210: '210도',
                    neo_servo_angle_220: '220도',
                    neo_servo_angle_230: '230도',
                    neo_servo_angle_240: '240도',
                    neo_servo_angle_250: '250도',
                    neo_servo_angle_260: '260도',
                    neo_servo_angle_270: '270도',
                    neo_servo_angle_280: '280도',
                    neo_servo_angle_290: '290도',
                    neo_servo_angle_300: '300도',
                    neo_servo_angle_310: '310도',
                    neo_servo_angle_320: '320도',
                    neo_servo_angle_330: '330도',
                    neo_servo_angle_340: '340도',
                    neo_servo_angle_350: '350도',
                    neo_servo_angle_360: '360도',

                    neo_servo_direction_f: '앞으로',
                    neo_servo_direction_b: '뒤로',

                    neo_line_cross_move_1: '1번째',
                    neo_line_cross_move_2: '2번째',
                    neo_line_cross_move_3: '3번째',
                    neo_line_cross_move_4: '4번째',
                    neo_line_cross_move_5: '5번째',
                    neo_line_cross_move_6: '6번째',
                    neo_line_cross_move_7: '7번째',
                    neo_line_cross_move_8: '8번째',
                    neo_line_cross_move_9: '9번째',
                    neo_line_cross_move_10: '10번째',

                    neo_line_cross_turn_direction_l: '좌회전',
                    neo_line_cross_turn_direction_r: '우회전',
                    neo_line_cross_turn_direction_u: 'U턴',

                    neo_auto_driving_speed_in3: 'IN3',

                    neo_auto_parking_which_l: '왼쪽에',
                    neo_auto_parking_which_r: '오른쪽에',

                    neo_auto_parking_direction_b: '후면주차',
                    neo_auto_parking_direction_s: '평행주차',

                    neo_line_change_direction_l: '왼쪽으로',
                    neo_line_change_direction_r: '오른쪽으로',

                    neo_line_change_turn_direction_l: '좌회전',
                    neo_line_change_turn_direction_r: '우회전',
                    neo_line_change_turn_direction_u: 'U턴',

                    neo_led_brightness_0: '0%',
                    neo_led_brightness_5: '5%',
                    neo_led_brightness_10: '10%',
                    neo_led_brightness_15: '15%',
                    neo_led_brightness_20: '20%',
                    neo_led_brightness_25: '25%',
                    neo_led_brightness_30: '30%',
                    neo_led_brightness_35: '35%',
                    neo_led_brightness_40: '40%',
                    neo_led_brightness_45: '45%',
                    neo_led_brightness_50: '50%',
                    neo_led_brightness_55: '55%',
                    neo_led_brightness_60: '60%',
                    neo_led_brightness_65: '65%',
                    neo_led_brightness_70: '70%',
                    neo_led_brightness_75: '75%',
                    neo_led_brightness_80: '80%',
                    neo_led_brightness_85: '85%',
                    neo_led_brightness_90: '90%',
                    neo_led_brightness_95: '95%',
                    neo_led_brightness_100: '100%',

                    neo_led_blink_speed_1: '1단계',
                    neo_led_blink_speed_2: '2단계',
                    neo_led_blink_speed_3: '3단계',
                    neo_led_blink_speed_4: '4단계',
                    neo_led_blink_speed_5: '5단계',

                    neo_set_output_value_0: '0',
                    neo_set_output_value_5: '5',
                    neo_set_output_value_10: '10',
                    neo_set_output_value_15: '15',
                    neo_set_output_value_20: '20',
                    neo_set_output_value_25: '25',
                    neo_set_output_value_30: '30',
                    neo_set_output_value_35: '35',
                    neo_set_output_value_40: '40',
                    neo_set_output_value_45: '45',
                    neo_set_output_value_50: '50',
                    neo_set_output_value_55: '55',
                    neo_set_output_value_60: '60',
                    neo_set_output_value_65: '65',
                    neo_set_output_value_70: '70',
                    neo_set_output_value_75: '75',
                    neo_set_output_value_80: '80',
                    neo_set_output_value_85: '85',
                    neo_set_output_value_90: '90',
                    neo_set_output_value_95: '95',
                    neo_set_output_value_100: '100',
                    neo_set_output_value_105: '105',
                    neo_set_output_value_110: '110',
                    neo_set_output_value_115: '115',
                    neo_set_output_value_120: '120',
                    neo_set_output_value_125: '125',
                    neo_set_output_value_130: '130',
                    neo_set_output_value_135: '135',
                    neo_set_output_value_140: '140',
                    neo_set_output_value_145: '145',
                    neo_set_output_value_150: '150',
                    neo_set_output_value_155: '155',
                    neo_set_output_value_160: '160',
                    neo_set_output_value_165: '165',
                    neo_set_output_value_170: '170',
                    neo_set_output_value_175: '175',
                    neo_set_output_value_180: '180',
                    neo_set_output_value_185: '185',
                    neo_set_output_value_190: '190',
                    neo_set_output_value_195: '195',
                    neo_set_output_value_200: '200',
                    neo_set_output_value_205: '205',
                    neo_set_output_value_210: '210',
                    neo_set_output_value_215: '215',
                    neo_set_output_value_220: '220',
                    neo_set_output_value_225: '225',
                    neo_set_output_value_230: '230',
                    neo_set_output_value_235: '235',
                    neo_set_output_value_240: '240',
                    neo_set_output_value_245: '245',
                    neo_set_output_value_250: '250',
                    neo_set_output_value_255: '255',

                    neo_sensor_in_digital_1: '1번',
                    neo_sensor_in_digital_2: '2번',
                    neo_sensor_in_digital_3: '3번',
                    neo_sensor_in_digital_4: '4번',

                    neo_color_black: '검정',
                    neo_color_white: '흰색',
                    neo_color_red: '빨강',
                    neo_color_yellow: '노랑',
                    neo_color_green: '녹색',
                    neo_color_blue: '파랑',

                    neo_button_1: '버튼1',
                    neo_button_2: '버튼2',
                    neo_button_3: '버튼3',
                    neo_button_4: '버튼4',

                    neo_button_on: 'ON',
                    neo_button_off: 'OFF',

                    neo_buzzer_octave_1: '1옥타브',
                    neo_buzzer_octave_2: '2옥타브',
                    neo_buzzer_octave_3: '3옥타브',
                    neo_buzzer_octave_4: '4옥타브',
                    neo_buzzer_octave_5: '5옥타브',
                    neo_buzzer_octave_6: '6옥타브',

                    neo_buzzer_do: '도',
                    neo_buzzer_do_sharp: '도#',
                    neo_buzzer_re: '레',
                    neo_buzzer_re_sharp: '레#',
                    neo_buzzer_mi: '미',
                    neo_buzzer_fa: '파',
                    neo_buzzer_fa_sharp: '파#',
                    neo_buzzer_sol: '솔',
                    neo_buzzer_sol_sharp: '솔#',
                    neo_buzzer_la: '라',
                    neo_buzzer_la_sharp: '라#',
                    neo_buzzer_ti: '시',

                    neo_buzzer_whole_note: '온음표',
                    neo_buzzer_half_note: '2분 음표',
                    neo_buzzer_quarter_note: '4분 음표',
                    neo_buzzer_8th_note: '8분 음표',

                    neo_lcd_image_1: '1',
                    neo_lcd_image_2: '2',
                    neo_lcd_image_3: '3',
                    neo_lcd_image_4: '4',
                    neo_lcd_image_5: '5',
                    neo_lcd_image_6: '6',
                    neo_lcd_image_7: '7',
                    neo_lcd_image_8: '8',
                    neo_lcd_image_9: '9',
                    neo_lcd_image_10: '10',
                    neo_lcd_image_11: '11',
                    neo_lcd_image_12: '12',
                    neo_lcd_image_13: '13',
                    neo_lcd_image_14: '14',
                    neo_lcd_image_15: '15',
                },
            },
            en: {
                // en.js에 작성하던 내용
                template: {
                    // motor & robot
                    // motor & robot
                    neo_motor_title: 'Motor',
                    neo_motor_move: 'Move motor %1 %2 %3 %4',
                    neo_motor_move_both: 'Move both motor L %1 R %2 %3',
                    neo_robot_move: 'Move robot %1 %2 %3 %4',
                    neo_motor_stop: 'Stop motor %1 %2',
                    neo_robot_stop: 'Stop robot %1',

                    // servo
                    neo_servo_title: 'Servo motor',
                    neo_servo_reset: 'Reset the current position of %1 servo motor to 0 degree %2',
                    neo_servo_angle: 'Change servo angle %1 %2 %3 %4',
                    neo_servo_angle_var: 'Change servo angle %1 %2 %3 %4',
                    neo_servo_angle_wait: 'Wait to change servo angle %1 %2 %3 %4',
                    neo_servo_rotate: 'Rotate servo motor %1 %2 %3 %4',
                    neo_servo_stop: 'Stop servo motor %1 %2',

                    // line tracer
                    neo_line_tracer_title: 'Line tracer',
                    neo_line_tracer_start: 'Start line tracer with black line %1 %2 %3',
                    neo_line_cross_move: 'Keep moving to the %1 intersection %2',
                    neo_line_cross_turn: 'Turn at the next intersection %1 %2',

                    // auto driving
                    neo_auto_driving_title: 'Self-driving',
                    neo_auto_driving_start: 'Start self-driving %1 %2 %3',
                    neo_auto_driving_sensor_start: 'Start self-driving with %1 %2 %3',
                    neo_auto_driving_stop: 'Stop self-driving %1',

                    // auto parking
                    neo_auto_parking_title: 'Auto parking',
                    neo_auto_parking_start: 'Start auto parking %1 %2 %3',

                    // line change
                    neo_line_change_title: 'Lane change',
                    neo_line_change_start: 'Change Lane %1 %2',
                    neo_line_change_turn: 'Turn at the intersection %1 %2',

                    // auto detect wall
                    neo_auto_detect_wall_title: 'Alley driving',
                    neo_auto_detect_wall_start: 'Start alley driving %1 %2 %3',
                    neo_auto_detect_wall_turn: 'Turn in the alley %1 %2',

                    // led
                    neo_led_title: 'LED',
                    neo_led_on: 'Turn on the LED %1 %2 %3',
                    neo_led_blink: 'Blink the LED %1 %2 %3 %4',
                    neo_led_off: 'Turn off the LED %1 %2',

                    // color led
                    neo_color_led_title: 'Color LED',
                    neo_color_led_on: 'Turn on the color LED %1 %2 %3 %4',
                    neo_color_led_off: 'Turn off the color LED %1 %2',
                    neo_color_led_on_with_sensor: 'Turn on the color LED %2 with color sensor %1 %3',

                    // set output
                    neo_set_output_title: 'Set output',
                    neo_set_output: 'Set output %1 %2 %3 %4',

                    // sensor
                    neo_sensor_title: 'Sensor',
                    neo_sensor_in: '%1',
                    neo_sensor_digital_in: '%1 %2',
                    neo_sensor_convert: '%1 %2 %3 → %4 %5',
                    neo_sensor_compare: '%1 %2 %3',
                    neo_sensor_between: '%1 %2 %3 %4 %5',
                    neo_sensor_color_compare: '%1 = %2',
                    neo_sensor_button_pressed: '%1 %2',

                    // buzzer
                    neo_buzzer_title: 'Buzzer',
                    neo_buzzer_start: 'Buzzer %1 %2 %3 %4',
                    neo_buzzer_with_sensor: 'Buzzer by sensor value %1 %2',
                    neo_buzzer_stop: 'Stop the buzzer %1',

                    // lcd
                    neo_lcd_title: 'LCD',
                    neo_lcd_image: 'Show image on LCD %1 %2 %3',
                    neo_lcd_text: 'Show text on LCD %1 %2 %3',

                    // args
                    neo_arg_motor_speed: '%1',
                    neo_arg_duration: '%1',
                    neo_arg_robot_speed: '%1',
                    neo_arg_servo_angle: '%1',
                    neo_arg_servo_speed: '%1',
                    neo_arg_auto_driving_speed: '%1',
                    neo_arg_led_brightness: '%1',
                    neo_arg_led_blink_speed: '%1',
                    neo_arg_set_output_value: '%1',
                },
                Blocks: {
                    neo_input_1: 'IN1',
                    neo_input_2: 'IN2',
                    neo_input_3: 'IN3',
                    neo_input_12: 'IN1&2',
                    neo_input_123: 'IN1&2&3',
                    neo_input_1_2: 'IN1&IN2',
                    neo_input_11_12: 'IN1-1&IN1-2',
                    neo_input_13_14: 'IN1-3&IN1-4',
                    neo_input_21_22: 'IN2-1&IN2-2',
                    neo_input_23_24: 'IN2-3&IN2-4',

                    neo_output_1: 'OUT1',
                    neo_output_2: 'OUT2',
                    neo_output_3: 'OUT3',
                    neo_output_12: 'OUT1&2',
                    neo_output_123: 'OUT1&2&3',

                    neo_speed_0: '0%',
                    neo_speed_5: '5%',
                    neo_speed_10: '10%',
                    neo_speed_15: '15%',
                    neo_speed_20: '20%',
                    neo_speed_25: '25%',
                    neo_speed_30: '30%',
                    neo_speed_35: '35%',
                    neo_speed_40: '40%',
                    neo_speed_45: '45%',
                    neo_speed_50: '50%',
                    neo_speed_55: '55%',
                    neo_speed_60: '60%',
                    neo_speed_65: '65%',
                    neo_speed_70: '70%',
                    neo_speed_75: '75%',
                    neo_speed_80: '80%',
                    neo_speed_85: '85%',
                    neo_speed_90: '90%',
                    neo_speed_95: '95%',
                    neo_speed_100: '100%',

                    neo_duration_c: 'constantly',
                    neo_duration_0: '0 second',
                    neo_duration_1: '1 second',
                    neo_duration_2: '2 second',
                    neo_duration_3: '3 second',
                    neo_duration_4: '4 second',
                    neo_duration_5: '5 second',
                    neo_duration_6: '6 second',
                    neo_duration_7: '7 second',
                    neo_duration_8: '8 second',
                    neo_duration_9: '9 second',

                    neo_compare_gt: '≥',
                    neo_compare_g: '>',
                    neo_compare_e: '=',
                    neo_compare_l: '<',
                    neo_compare_lt: '≤',

                    neo_turn_direction_l: 'left',
                    neo_turn_direction_r: 'right',
                    neo_turn_direction_u: 'U-turn',

                    neo_motor_out_l: 'left',
                    neo_motor_out_r: 'right',
                    neo_motor_out_lr: 'both',

                    neo_motor_speed_n100: '-100%',
                    neo_motor_speed_n95: '-95%',
                    neo_motor_speed_n90: '-90%',
                    neo_motor_speed_n85: '-85%',
                    neo_motor_speed_n80: '-80%',
                    neo_motor_speed_n75: '-75%',
                    neo_motor_speed_n70: '-70%',
                    neo_motor_speed_n65: '-65%',
                    neo_motor_speed_n60: '-60%',
                    neo_motor_speed_n55: '-55%',
                    neo_motor_speed_n50: '-50%',
                    neo_motor_speed_n45: '-45%',
                    neo_motor_speed_n40: '-40%',
                    neo_motor_speed_n35: '-35%',
                    neo_motor_speed_n30: '-30%',
                    neo_motor_speed_n25: '-25%',
                    neo_motor_speed_n20: '-20%',
                    neo_motor_speed_n15: '-15%',
                    neo_motor_speed_n10: '-10%',
                    neo_motor_speed_n5: '-5%',
                    neo_motor_speed_0: '0%',
                    neo_motor_speed_5: '5%',
                    neo_motor_speed_10: '10%',
                    neo_motor_speed_15: '15%',
                    neo_motor_speed_20: '20%',
                    neo_motor_speed_25: '25%',
                    neo_motor_speed_30: '30%',
                    neo_motor_speed_35: '35%',
                    neo_motor_speed_40: '40%',
                    neo_motor_speed_45: '45%',
                    neo_motor_speed_50: '50%',
                    neo_motor_speed_55: '55%',
                    neo_motor_speed_60: '60%',
                    neo_motor_speed_65: '65%',
                    neo_motor_speed_70: '70%',
                    neo_motor_speed_75: '75%',
                    neo_motor_speed_80: '80%',
                    neo_motor_speed_85: '85%',
                    neo_motor_speed_90: '90%',
                    neo_motor_speed_95: '95%',
                    neo_motor_speed_100: '100%',

                    neo_robot_direction_f: 'forward',
                    neo_robot_direction_b: 'backward',
                    neo_robot_direction_l: 'left',
                    neo_robot_direction_r: 'right',
                    neo_robot_direction_tl: 'left in place',
                    neo_robot_direction_tr: 'right in place',

                    neo_servo_angle_n360: '-360 degree',
                    neo_servo_angle_n350: '-350 degree',
                    neo_servo_angle_n340: '-340 degree',
                    neo_servo_angle_n330: '-330 degree',
                    neo_servo_angle_n320: '-320 degree',
                    neo_servo_angle_n310: '-310 degree',
                    neo_servo_angle_n300: '-300 degree',
                    neo_servo_angle_n290: '-290 degree',
                    neo_servo_angle_n280: '-280 degree',
                    neo_servo_angle_n270: '-270 degree',
                    neo_servo_angle_n260: '-260 degree',
                    neo_servo_angle_n250: '-250 degree',
                    neo_servo_angle_n240: '-240 degree',
                    neo_servo_angle_n230: '-230 degree',
                    neo_servo_angle_n220: '-220 degree',
                    neo_servo_angle_n210: '-210 degree',
                    neo_servo_angle_n200: '-200 degree',
                    neo_servo_angle_n190: '-190 degree',
                    neo_servo_angle_n180: '-180 degree',
                    neo_servo_angle_n170: '-170 degree',
                    neo_servo_angle_n160: '-160 degree',
                    neo_servo_angle_n150: '-150 degree',
                    neo_servo_angle_n140: '-140 degree',
                    neo_servo_angle_n130: '-130 degree',
                    neo_servo_angle_n120: '-120 degree',
                    neo_servo_angle_n110: '-110 degree',
                    neo_servo_angle_n100: '-100 degree',
                    neo_servo_angle_n90: '-90 degree',
                    neo_servo_angle_n80: '-80 degree',
                    neo_servo_angle_n70: '-70 degree',
                    neo_servo_angle_n60: '-60 degree',
                    neo_servo_angle_n50: '-50 degree',
                    neo_servo_angle_n40: '-40 degree',
                    neo_servo_angle_n30: '-30 degree',
                    neo_servo_angle_n20: '-20 degree',
                    neo_servo_angle_n10: '-10 degree',
                    neo_servo_angle_0: '0 degree',
                    neo_servo_angle_10: '10 degree',
                    neo_servo_angle_20: '20 degree',
                    neo_servo_angle_30: '30 degree',
                    neo_servo_angle_40: '40 degree',
                    neo_servo_angle_50: '50 degree',
                    neo_servo_angle_60: '60 degree',
                    neo_servo_angle_70: '70 degree',
                    neo_servo_angle_80: '80 degree',
                    neo_servo_angle_90: '90 degree',
                    neo_servo_angle_100: '100 degree',
                    neo_servo_angle_110: '110 degree',
                    neo_servo_angle_120: '120 degree',
                    neo_servo_angle_130: '130 degree',
                    neo_servo_angle_140: '140 degree',
                    neo_servo_angle_150: '150 degree',
                    neo_servo_angle_160: '160 degree',
                    neo_servo_angle_170: '170 degree',
                    neo_servo_angle_180: '180 degree',
                    neo_servo_angle_190: '190 degree',
                    neo_servo_angle_200: '200 degree',
                    neo_servo_angle_210: '210 degree',
                    neo_servo_angle_220: '220 degree',
                    neo_servo_angle_230: '230 degree',
                    neo_servo_angle_240: '240 degree',
                    neo_servo_angle_250: '250 degree',
                    neo_servo_angle_260: '260 degree',
                    neo_servo_angle_270: '270 degree',
                    neo_servo_angle_280: '280 degree',
                    neo_servo_angle_290: '290 degree',
                    neo_servo_angle_300: '300 degree',
                    neo_servo_angle_310: '310 degree',
                    neo_servo_angle_320: '320 degree',
                    neo_servo_angle_330: '330 degree',
                    neo_servo_angle_340: '340 degree',
                    neo_servo_angle_350: '350 degree',
                    neo_servo_angle_360: '360 degree',

                    neo_servo_direction_f: 'forward',
                    neo_servo_direction_b: 'backward',

                    neo_line_cross_move_1: '1st',
                    neo_line_cross_move_2: '2nd',
                    neo_line_cross_move_3: '3rd',
                    neo_line_cross_move_4: '4th',
                    neo_line_cross_move_5: '5th',
                    neo_line_cross_move_6: '6th',
                    neo_line_cross_move_7: '7th',
                    neo_line_cross_move_8: '8th',
                    neo_line_cross_move_9: '9th',
                    neo_line_cross_move_10: '10th',

                    neo_line_cross_turn_direction_l: 'to left',
                    neo_line_cross_turn_direction_r: 'to right',
                    neo_line_cross_turn_direction_u: 'U-turn',

                    neo_auto_driving_speed_in3: 'IN3',

                    neo_auto_parking_which_l: 'to left',
                    neo_auto_parking_which_r: 'to right',

                    neo_auto_parking_direction_b: 'rear parking',
                    neo_auto_parking_direction_s: 'parallel parking',

                    neo_line_change_direction_l: 'to left',
                    neo_line_change_direction_r: 'to right',

                    neo_line_change_turn_direction_l: 'to left',
                    neo_line_change_turn_direction_r: 'to right',
                    neo_line_change_turn_direction_u: 'U-turn',

                    neo_led_brightness_0: '0%',
                    neo_led_brightness_5: '5%',
                    neo_led_brightness_10: '10%',
                    neo_led_brightness_15: '15%',
                    neo_led_brightness_20: '20%',
                    neo_led_brightness_25: '25%',
                    neo_led_brightness_30: '30%',
                    neo_led_brightness_35: '35%',
                    neo_led_brightness_40: '40%',
                    neo_led_brightness_45: '45%',
                    neo_led_brightness_50: '50%',
                    neo_led_brightness_55: '55%',
                    neo_led_brightness_60: '60%',
                    neo_led_brightness_65: '65%',
                    neo_led_brightness_70: '70%',
                    neo_led_brightness_75: '75%',
                    neo_led_brightness_80: '80%',
                    neo_led_brightness_85: '85%',
                    neo_led_brightness_90: '90%',
                    neo_led_brightness_95: '95%',
                    neo_led_brightness_100: '100%',

                    neo_led_blink_speed_1: '1 step',
                    neo_led_blink_speed_2: '2 step',
                    neo_led_blink_speed_3: '3 step',
                    neo_led_blink_speed_4: '4 step',
                    neo_led_blink_speed_5: '5 step',

                    neo_set_output_value_0: '0',
                    neo_set_output_value_5: '5',
                    neo_set_output_value_10: '10',
                    neo_set_output_value_15: '15',
                    neo_set_output_value_20: '20',
                    neo_set_output_value_25: '25',
                    neo_set_output_value_30: '30',
                    neo_set_output_value_35: '35',
                    neo_set_output_value_40: '40',
                    neo_set_output_value_45: '45',
                    neo_set_output_value_50: '50',
                    neo_set_output_value_55: '55',
                    neo_set_output_value_60: '60',
                    neo_set_output_value_65: '65',
                    neo_set_output_value_70: '70',
                    neo_set_output_value_75: '75',
                    neo_set_output_value_80: '80',
                    neo_set_output_value_85: '85',
                    neo_set_output_value_90: '90',
                    neo_set_output_value_95: '95',
                    neo_set_output_value_100: '100',
                    neo_set_output_value_105: '105',
                    neo_set_output_value_110: '110',
                    neo_set_output_value_115: '115',
                    neo_set_output_value_120: '120',
                    neo_set_output_value_125: '125',
                    neo_set_output_value_130: '130',
                    neo_set_output_value_135: '135',
                    neo_set_output_value_140: '140',
                    neo_set_output_value_145: '145',
                    neo_set_output_value_150: '150',
                    neo_set_output_value_155: '155',
                    neo_set_output_value_160: '160',
                    neo_set_output_value_165: '165',
                    neo_set_output_value_170: '170',
                    neo_set_output_value_175: '175',
                    neo_set_output_value_180: '180',
                    neo_set_output_value_185: '185',
                    neo_set_output_value_190: '190',
                    neo_set_output_value_195: '195',
                    neo_set_output_value_200: '200',
                    neo_set_output_value_205: '205',
                    neo_set_output_value_210: '210',
                    neo_set_output_value_215: '215',
                    neo_set_output_value_220: '220',
                    neo_set_output_value_225: '225',
                    neo_set_output_value_230: '230',
                    neo_set_output_value_235: '235',
                    neo_set_output_value_240: '240',
                    neo_set_output_value_245: '245',
                    neo_set_output_value_250: '250',
                    neo_set_output_value_255: '255',

                    neo_sensor_in_digital_1: '1st',
                    neo_sensor_in_digital_2: '2nd',
                    neo_sensor_in_digital_3: '3rd',
                    neo_sensor_in_digital_4: '4th',

                    neo_color_black: 'black',
                    neo_color_white: 'white',
                    neo_color_red: 'red',
                    neo_color_yellow: 'yellow',
                    neo_color_green: 'green',
                    neo_color_blue: 'blue',

                    neo_button_1: 'button 1',
                    neo_button_2: 'button 2',
                    neo_button_3: 'button 3',
                    neo_button_4: 'button 4',

                    neo_button_on: 'ON',
                    neo_button_off: 'OFF',

                    neo_buzzer_octave_1: '1 octave',
                    neo_buzzer_octave_2: '2 octave',
                    neo_buzzer_octave_3: '3 octave',
                    neo_buzzer_octave_4: '4 octave',
                    neo_buzzer_octave_5: '5 octave',
                    neo_buzzer_octave_6: '6 octave',

                    neo_buzzer_do: 'Do',
                    neo_buzzer_do_sharp: 'Do#',
                    neo_buzzer_re: 'Re',
                    neo_buzzer_re_sharp: 'Re#',
                    neo_buzzer_mi: 'Mi',
                    neo_buzzer_fa: 'Fa',
                    neo_buzzer_fa_sharp: 'Fa#',
                    neo_buzzer_sol: 'So',
                    neo_buzzer_sol_sharp: 'So#',
                    neo_buzzer_la: 'La',
                    neo_buzzer_la_sharp: 'La#',
                    neo_buzzer_ti: 'Si',

                    neo_buzzer_whole_note: 'whole note',
                    neo_buzzer_half_note: 'a half note',
                    neo_buzzer_quarter_note: 'a quarter note',
                    neo_buzzer_8th_note: 'a eighth note',

                    neo_lcd_image_1: '1',
                    neo_lcd_image_2: '2',
                    neo_lcd_image_3: '3',
                    neo_lcd_image_4: '4',
                    neo_lcd_image_5: '5',
                    neo_lcd_image_6: '6',
                    neo_lcd_image_7: '7',
                    neo_lcd_image_8: '8',
                    neo_lcd_image_9: '9',
                    neo_lcd_image_10: '10',
                    neo_lcd_image_11: '11',
                    neo_lcd_image_12: '12',
                    neo_lcd_image_13: '13',
                    neo_lcd_image_14: '14',
                    neo_lcd_image_15: '15',
                },
            }, //
        };
    }

    getBlocks() {
        return {
            /**
             * 회전모터
             */
            neo_motor_title: {
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
                        text: Lang.template.neo_motor_title,
                        color: '#191970',
                        align: 'left',
                    },
                ],
                def: {
                    type: 'neo_motor_title',
                },
                class: 'neo_motor',
                isNotFor: ['neo'],
                events: {},
            },
            neo_motor_move: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic',
                statements: [],
                params: [
                    {
                        type: 'Dropdown',
                        options: [
                            [Lang.Blocks.neo_motor_out_l, 1],
                            [Lang.Blocks.neo_motor_out_r, 2],
                            [Lang.Blocks.neo_motor_out_lr, 0],
                        ],
                        value: 1,
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                    {
                        type: 'Dropdown',
                        options: [
                            [Lang.Blocks.neo_motor_speed_100, '100'],
                            [Lang.Blocks.neo_motor_speed_95, '95'],
                            [Lang.Blocks.neo_motor_speed_90, '90'],
                            [Lang.Blocks.neo_motor_speed_85, '85'],
                            [Lang.Blocks.neo_motor_speed_80, '80'],
                            [Lang.Blocks.neo_motor_speed_75, '75'],
                            [Lang.Blocks.neo_motor_speed_70, '70'],
                            [Lang.Blocks.neo_motor_speed_65, '65'],
                            [Lang.Blocks.neo_motor_speed_60, '60'],
                            [Lang.Blocks.neo_motor_speed_55, '55'],
                            [Lang.Blocks.neo_motor_speed_50, '50'],
                            [Lang.Blocks.neo_motor_speed_45, '45'],
                            [Lang.Blocks.neo_motor_speed_40, '40'],
                            [Lang.Blocks.neo_motor_speed_35, '35'],
                            [Lang.Blocks.neo_motor_speed_30, '30'],
                            [Lang.Blocks.neo_motor_speed_25, '25'],
                            [Lang.Blocks.neo_motor_speed_20, '20'],
                            [Lang.Blocks.neo_motor_speed_15, '15'],
                            [Lang.Blocks.neo_motor_speed_10, '10'],
                            [Lang.Blocks.neo_motor_speed_5, '5'],
                            [Lang.Blocks.neo_motor_speed_0, '0'],
                            [Lang.Blocks.neo_motor_speed_n5, '-5'],
                            [Lang.Blocks.neo_motor_speed_n10, '-10'],
                            [Lang.Blocks.neo_motor_speed_n15, '-15'],
                            [Lang.Blocks.neo_motor_speed_n20, '-20'],
                            [Lang.Blocks.neo_motor_speed_n25, '-25'],
                            [Lang.Blocks.neo_motor_speed_n30, '-30'],
                            [Lang.Blocks.neo_motor_speed_n35, '-35'],
                            [Lang.Blocks.neo_motor_speed_n40, '-40'],
                            [Lang.Blocks.neo_motor_speed_n45, '-45'],
                            [Lang.Blocks.neo_motor_speed_n50, '-50'],
                            [Lang.Blocks.neo_motor_speed_n55, '-55'],
                            [Lang.Blocks.neo_motor_speed_n60, '-60'],
                            [Lang.Blocks.neo_motor_speed_n65, '-65'],
                            [Lang.Blocks.neo_motor_speed_n70, '-70'],
                            [Lang.Blocks.neo_motor_speed_n75, '-75'],
                            [Lang.Blocks.neo_motor_speed_n80, '-80'],
                            [Lang.Blocks.neo_motor_speed_n85, '-85'],
                            [Lang.Blocks.neo_motor_speed_n90, '-90'],
                            [Lang.Blocks.neo_motor_speed_n95, '-95'],
                            [Lang.Blocks.neo_motor_speed_n100, '-100'],
                            [Lang.Blocks.neo_input_1, 'IN1'],
                            [Lang.Blocks.neo_input_2, 'IN2'],
                            [Lang.Blocks.neo_input_3, 'IN3'],
                        ],
                        value: '100',
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
                            type: 'neo_arg_duration',
                        },
                        null,
                    ],
                    type: 'neo_motor_move',
                },
                paramsKeyMap: {
                    DC: 0,
                    SPEED: 1,
                    DURATION: 2,
                },
                class: 'neo_motor',
                isNotFor: ['neo'],
                func: (sprite, script) => {
                    if (!script.exec_phase) {
                        const dc = script.getNumberField('DC', script);
                        const speed = script.getStringField('SPEED', script);
                        const duration = script.getStringValue('DURATION', script);
                        const blockId = this.generateBlockId();
                        if (speed === 'IN1' || speed === 'IN2' || speed === 'IN3') {
                            this.requestExtCommand(blockId, NeoBlockType.MOTOR_MOVE, [dc, speed]);
                        } else {
                            this.requestCommand(blockId, NeoBlockType.MOTOR_MOVE, [dc, speed]);
                        }
                        if (duration === 'c' || !Entry.parseNumber(duration)) {
                            script.block_id = blockId;
                            script.exec_phase = ExecPhase.PENDING_STOP;
                        } else {
                            script.exec_phase = ExecPhase.SET_TIMEOUT;
                        }
                    } else if (script.exec_phase === ExecPhase.SET_TIMEOUT) {
                        script.exec_phase = ExecPhase.WAIT_TIMEOUT;
                        const duration = script.getStringValue('DURATION', script);
                        const durationValue = Entry.parseNumber(duration);
                        setTimeout(function() {
                            script.exec_phase = ExecPhase.STOP;
                        }, durationValue * 1000);
                    } else if (script.exec_phase === ExecPhase.WAIT_TIMEOUT) {
                        return script;
                    } else if (script.exec_phase === ExecPhase.STOP) {
                        script.exec_phase = ExecPhase.PENDING_STOP;
                        const dc = script.getNumberField('DC', script);
                        const blockId = this.generateBlockId();
                        script.block_id = blockId;
                        this.requestCommand(blockId, NeoBlockType.MOTOR_MOVE, [dc, 0]);
                    } else if (script.exec_phase === ExecPhase.PENDING_STOP) {
                        if (!this.pendingResponseList[script.block_id]) {
                            delete script.block_id;
                            delete script.exec_phase;
                            return script.callReturn();
                        }
                    }
                    return script;
                },
            },
            neo_motor_move_both: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic',
                statements: [],
                params: [
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
                        img: 'block_icon/hardware_icon.svg',
                        size: 12,
                    },
                ],
                events: {},
                def: {
                    params: [
                        {
                            type: 'neo_arg_motor_speed',
                        },
                        {
                            type: 'neo_arg_motor_speed',
                        },
                        null,
                    ],
                    type: 'neo_motor_move_both',
                },
                paramsKeyMap: {
                    SPEED_L: 0,
                    SPEED_R: 1,
                },
                class: 'neo_motor',
                isNotFor: ['neo'],
                func: (sprite, script) => {
                    if (!script.exec_phase) {
                        script.exec_phase = ExecPhase.PENDING_STOP;
                        const speedL = script.getNumberValue('SPEED_L', script);
                        const speedR = script.getNumberValue('SPEED_R', script);
                        const blockId = this.generateBlockId();
                        script.block_id = blockId;
                        this.requestCommand(blockId, NeoBlockType.MOTOR_MOVE_BOTH, [speedL, speedR]);
                    } else if (script.exec_phase === ExecPhase.PENDING_STOP) {
                        if (!this.pendingResponseList[script.block_id]) {
                            delete script.block_id;
                            delete script.exec_phase;
                            return script.callReturn();
                        }
                    }
                    return script;
                },
            },
            neo_robot_move: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic',
                statements: [],
                params: [
                    {
                        type: 'Dropdown',
                        options: [
                            [Lang.Blocks.neo_robot_direction_f, 1],
                            [Lang.Blocks.neo_robot_direction_b, 2],
                            [Lang.Blocks.neo_robot_direction_l, 3],
                            [Lang.Blocks.neo_robot_direction_r, 4],
                            [Lang.Blocks.neo_robot_direction_tl, 5],
                            [Lang.Blocks.neo_robot_direction_tr, 6],
                        ],
                        value: 1,
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                    {
                        type: 'Dropdown',
                        options: [
                            [Lang.Blocks.neo_motor_speed_100, '100'],
                            [Lang.Blocks.neo_motor_speed_95, '95'],
                            [Lang.Blocks.neo_motor_speed_90, '90'],
                            [Lang.Blocks.neo_motor_speed_85, '85'],
                            [Lang.Blocks.neo_motor_speed_80, '80'],
                            [Lang.Blocks.neo_motor_speed_75, '75'],
                            [Lang.Blocks.neo_motor_speed_70, '70'],
                            [Lang.Blocks.neo_motor_speed_65, '65'],
                            [Lang.Blocks.neo_motor_speed_60, '60'],
                            [Lang.Blocks.neo_motor_speed_55, '55'],
                            [Lang.Blocks.neo_motor_speed_50, '50'],
                            [Lang.Blocks.neo_motor_speed_45, '45'],
                            [Lang.Blocks.neo_motor_speed_40, '40'],
                            [Lang.Blocks.neo_motor_speed_35, '35'],
                            [Lang.Blocks.neo_motor_speed_30, '30'],
                            [Lang.Blocks.neo_motor_speed_25, '25'],
                            [Lang.Blocks.neo_motor_speed_20, '20'],
                            [Lang.Blocks.neo_motor_speed_15, '15'],
                            [Lang.Blocks.neo_motor_speed_10, '10'],
                            [Lang.Blocks.neo_motor_speed_5, '5'],
                            [Lang.Blocks.neo_motor_speed_0, '0'],
                            [Lang.Blocks.neo_input_1, 'IN1'],
                            [Lang.Blocks.neo_input_2, 'IN2'],
                            [Lang.Blocks.neo_input_3, 'IN3'],
                        ],
                        value: '100',
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
                            type: 'neo_arg_duration',
                        },
                        null,
                    ],
                    type: 'neo_robot_move',
                },
                paramsKeyMap: {
                    DIRECTION: 0,
                    SPEED: 1,
                    DURATION: 2,
                },
                class: 'neo_motor',
                isNotFor: ['neo'],
                func: (sprite, script) => {
                    if (!script.exec_phase) {
                        const direction = script.getNumberField('DIRECTION', script);
                        const speed = script.getStringField('SPEED', script);
                        const duration = script.getStringValue('DURATION', script);
                        const blockId = this.generateBlockId();
                        if (speed === 'IN1' || speed === 'IN2' || speed === 'IN3') {
                            this.requestExtCommand(blockId, NeoBlockType.ROBOT_MOVE, [direction, speed]);
                        } else {
                            this.requestCommand(blockId, NeoBlockType.ROBOT_MOVE, [direction, speed]);
                        }
                        if (duration === 'c' || !Entry.parseNumber(duration)) {
                            script.block_id = blockId;
                            script.exec_phase = ExecPhase.PENDING_STOP;
                        } else {
                            script.exec_phase = ExecPhase.SET_TIMEOUT;
                        }
                    } else if (script.exec_phase === ExecPhase.SET_TIMEOUT) {
                        const duration = script.getStringValue('DURATION', script);
                        const durationValue = Entry.parseNumber(duration);
                        script.exec_phase = ExecPhase.WAIT_TIMEOUT;
                        setTimeout(function() {
                            script.exec_phase = ExecPhase.STOP;
                        }, durationValue * 1000);
                    } else if (script.exec_phase === ExecPhase.WAIT_TIMEOUT) {
                        return script;
                    } else if (script.exec_phase === ExecPhase.STOP) {
                        script.exec_phase = ExecPhase.PENDING_STOP;
                        const direction = script.getNumberField('DIRECTION', script);
                        const blockId = this.generateBlockId();
                        script.block_id = blockId;
                        this.requestCommand(blockId, NeoBlockType.ROBOT_MOVE, [direction, 0]);
                    } else if (script.exec_phase === ExecPhase.PENDING_STOP) {
                        if (!this.pendingResponseList[script.block_id]) {
                            delete script.block_id;
                            delete script.exec_phase;
                            return script.callReturn();
                        }
                    }
                    return script;
                },
            },
            neo_motor_stop: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic',
                statements: [],
                params: [
                    {
                        type: 'Dropdown',
                        options: [
                            [Lang.Blocks.neo_motor_out_l, 1],
                            [Lang.Blocks.neo_motor_out_r, 2],
                            [Lang.Blocks.neo_motor_out_lr, 0],
                        ],
                        value: 1,
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
                    type: 'neo_motor_stop',
                },
                paramsKeyMap: {
                    DC: 0,
                },
                class: 'neo_motor',
                isNotFor: ['neo'],
                func: (sprite, script) => {
                    const dc = script.getStringValue('DC', script);
                    const blockId = this.generateBlockId();
                    this.requestCommand(blockId, NeoBlockType.MOTOR_STOP, [dc]);
                    return script.callReturn();
                },
            },
            neo_robot_stop: {
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
                    type: 'neo_robot_stop',
                },
                paramsKeyMap: {
                    //
                },
                class: 'neo_motor',
                isNotFor: ['neo'],
                func: (sprite, script) => {
                    const blockId = this.generateBlockId();
                    this.requestCommand(blockId, NeoBlockType.ROBOT_STOP, []);
                    return script.callReturn();
                },
            },
            /**
             * 서보모터
             */
            neo_servo_title: {
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
                        text: Lang.template.neo_servo_title,
                        color: '#191970',
                        align: 'left',
                    },
                ],
                def: {
                    type: 'neo_servo_title',
                },
                class: 'neo_servo',
                isNotFor: ['neo'],
                events: {},
            },
            neo_servo_reset: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic',
                statements: [],
                params: [
                    {
                        type: 'Dropdown',
                        options: [
                            [Lang.Blocks.neo_output_1, 'OUT1'],
                            [Lang.Blocks.neo_output_2, 'OUT2'],
                            [Lang.Blocks.neo_output_3, 'OUT3'],
                            [Lang.Blocks.neo_output_12, 'OUT12'],
                            [Lang.Blocks.neo_output_123, 'OUT123'],
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
                    type: 'neo_servo_reset',
                },
                paramsKeyMap: {
                    OUTPUT: 0,
                },
                class: 'neo_servo',
                isNotFor: ['neo'],
                func: (sprite, script) => {
                    if (!script.exec_phase) {
                        script.exec_phase = ExecPhase.PENDING_RESPONSE;
                        const output = script.getStringValue('OUTPUT', script);
                        const blockId = this.generateBlockId();
                        script.block_id = blockId;
                        this.requestCommand(blockId, NeoBlockType.SERVO_RESET, [output]);
                    } else if (script.exec_phase === ExecPhase.PENDING_RESPONSE) {
                        if (!this.pendingResponseList[script.block_id]) {
                            delete script.block_id;
                            delete script.exec_phase;
                            return script.callReturn();
                        }
                    }
                    return script;
                },
            },
            neo_servo_angle: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic',
                statements: [],
                params: [
                    {
                        type: 'Dropdown',
                        options: [
                            [Lang.Blocks.neo_output_1, 'OUT1'],
                            [Lang.Blocks.neo_output_2, 'OUT2'],
                            [Lang.Blocks.neo_output_3, 'OUT3'],
                            [Lang.Blocks.neo_output_12, 'OUT12'],
                            [Lang.Blocks.neo_output_123, 'OUT123'],
                        ],
                        value: 'OUT1',
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                    {
                        type: 'Dropdown',
                        options: [
                            [Lang.Blocks.neo_servo_angle_360, '360'],
                            [Lang.Blocks.neo_servo_angle_350, '350'],
                            [Lang.Blocks.neo_servo_angle_340, '340'],
                            [Lang.Blocks.neo_servo_angle_330, '330'],
                            [Lang.Blocks.neo_servo_angle_320, '320'],
                            [Lang.Blocks.neo_servo_angle_310, '310'],
                            [Lang.Blocks.neo_servo_angle_300, '300'],
                            [Lang.Blocks.neo_servo_angle_290, '290'],
                            [Lang.Blocks.neo_servo_angle_280, '280'],
                            [Lang.Blocks.neo_servo_angle_270, '270'],
                            [Lang.Blocks.neo_servo_angle_260, '260'],
                            [Lang.Blocks.neo_servo_angle_250, '250'],
                            [Lang.Blocks.neo_servo_angle_240, '240'],
                            [Lang.Blocks.neo_servo_angle_230, '230'],
                            [Lang.Blocks.neo_servo_angle_220, '220'],
                            [Lang.Blocks.neo_servo_angle_210, '210'],
                            [Lang.Blocks.neo_servo_angle_200, '200'],
                            [Lang.Blocks.neo_servo_angle_190, '190'],
                            [Lang.Blocks.neo_servo_angle_180, '180'],
                            [Lang.Blocks.neo_servo_angle_170, '170'],
                            [Lang.Blocks.neo_servo_angle_160, '160'],
                            [Lang.Blocks.neo_servo_angle_150, '150'],
                            [Lang.Blocks.neo_servo_angle_140, '140'],
                            [Lang.Blocks.neo_servo_angle_130, '130'],
                            [Lang.Blocks.neo_servo_angle_120, '120'],
                            [Lang.Blocks.neo_servo_angle_110, '110'],
                            [Lang.Blocks.neo_servo_angle_100, '100'],
                            [Lang.Blocks.neo_servo_angle_90, '90'],
                            [Lang.Blocks.neo_servo_angle_80, '80'],
                            [Lang.Blocks.neo_servo_angle_70, '70'],
                            [Lang.Blocks.neo_servo_angle_60, '60'],
                            [Lang.Blocks.neo_servo_angle_50, '50'],
                            [Lang.Blocks.neo_servo_angle_40, '40'],
                            [Lang.Blocks.neo_servo_angle_30, '30'],
                            [Lang.Blocks.neo_servo_angle_20, '20'],
                            [Lang.Blocks.neo_servo_angle_10, '10'],
                            [Lang.Blocks.neo_servo_angle_0, '0'],
                            [Lang.Blocks.neo_servo_angle_n10, '-10'],
                            [Lang.Blocks.neo_servo_angle_n20, '-20'],
                            [Lang.Blocks.neo_servo_angle_n30, '-30'],
                            [Lang.Blocks.neo_servo_angle_n40, '-40'],
                            [Lang.Blocks.neo_servo_angle_n50, '-50'],
                            [Lang.Blocks.neo_servo_angle_n60, '-60'],
                            [Lang.Blocks.neo_servo_angle_n70, '-70'],
                            [Lang.Blocks.neo_servo_angle_n80, '-80'],
                            [Lang.Blocks.neo_servo_angle_n90, '-90'],
                            [Lang.Blocks.neo_servo_angle_n100, '-100'],
                            [Lang.Blocks.neo_servo_angle_n110, '-110'],
                            [Lang.Blocks.neo_servo_angle_n120, '-120'],
                            [Lang.Blocks.neo_servo_angle_n130, '-130'],
                            [Lang.Blocks.neo_servo_angle_n140, '-140'],
                            [Lang.Blocks.neo_servo_angle_n150, '-150'],
                            [Lang.Blocks.neo_servo_angle_n160, '-160'],
                            [Lang.Blocks.neo_servo_angle_n170, '-170'],
                            [Lang.Blocks.neo_servo_angle_n180, '-180'],
                            [Lang.Blocks.neo_servo_angle_n190, '-190'],
                            [Lang.Blocks.neo_servo_angle_n200, '-200'],
                            [Lang.Blocks.neo_servo_angle_n210, '-210'],
                            [Lang.Blocks.neo_servo_angle_n220, '-220'],
                            [Lang.Blocks.neo_servo_angle_n230, '-230'],
                            [Lang.Blocks.neo_servo_angle_n240, '-240'],
                            [Lang.Blocks.neo_servo_angle_n250, '-250'],
                            [Lang.Blocks.neo_servo_angle_n260, '-260'],
                            [Lang.Blocks.neo_servo_angle_n270, '-270'],
                            [Lang.Blocks.neo_servo_angle_n280, '-280'],
                            [Lang.Blocks.neo_servo_angle_n290, '-290'],
                            [Lang.Blocks.neo_servo_angle_n300, '-300'],
                            [Lang.Blocks.neo_servo_angle_n310, '-310'],
                            [Lang.Blocks.neo_servo_angle_n320, '-320'],
                            [Lang.Blocks.neo_servo_angle_n330, '-330'],
                            [Lang.Blocks.neo_servo_angle_n340, '-340'],
                            [Lang.Blocks.neo_servo_angle_n350, '-350'],
                            [Lang.Blocks.neo_servo_angle_n360, '-360'],
                            [Lang.Blocks.neo_input_1, 'IN1'],
                            [Lang.Blocks.neo_input_2, 'IN2'],
                            [Lang.Blocks.neo_input_3, 'IN3'],
                        ],
                        value: '90',
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                    {
                        type: 'Dropdown',
                        options: [
                            [Lang.Blocks.neo_motor_speed_100, '100'],
                            [Lang.Blocks.neo_motor_speed_90, '90'],
                            [Lang.Blocks.neo_motor_speed_80, '80'],
                            [Lang.Blocks.neo_motor_speed_70, '70'],
                            [Lang.Blocks.neo_motor_speed_60, '60'],
                            [Lang.Blocks.neo_motor_speed_50, '50'],
                            [Lang.Blocks.neo_motor_speed_40, '40'],
                            [Lang.Blocks.neo_motor_speed_30, '30'],
                            [Lang.Blocks.neo_motor_speed_20, '20'],
                            [Lang.Blocks.neo_motor_speed_10, '10'],
                            [Lang.Blocks.neo_motor_speed_0, '0'],
                            [Lang.Blocks.neo_input_1, 'IN1'],
                            [Lang.Blocks.neo_input_2, 'IN2'],
                            [Lang.Blocks.neo_input_3, 'IN3'],
                        ],
                        value: '50',
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
                    type: 'neo_servo_angle',
                },
                paramsKeyMap: {
                    OUTPUT: 0,
                    ANGLE: 1,
                    SPEED: 2,
                },
                class: 'neo_servo',
                isNotFor: ['neo'],
                func: (sprite, script) => {
                    if (!script.exec_phase) {
                        script.exec_phase = ExecPhase.PENDING_STOP;
                        const output = script.getStringField('OUTPUT', script);
                        const angle = script.getStringField('ANGLE', script);
                        const speed = script.getStringField('SPEED', script);
                        const blockId = this.generateBlockId();
                        script.block_id = blockId;
                        if (angle === 'IN1' || angle === 'IN2' || angle === 'IN3') {
                            if (speed === 'IN1' || angle === 'IN2' || angle === 'IN3') {
                                this.requestExtCommand(blockId, NeoBlockType.SERVO_ANGLE, [output, angle, speed]);
                            } else {
                                this.requestExtCommand(blockId, NeoBlockType.SERVO_ANGLE, [output, angle, speed]);
                            }
                        } else {
                            this.requestCommand(blockId, NeoBlockType.SERVO_ANGLE, [output, angle, speed]);
                        }
                    } else if (script.exec_phase === ExecPhase.PENDING_STOP) {
                        if (!this.pendingResponseList[script.block_id]) {
                            delete script.block_id;
                            delete script.exec_phase;
                            return script.callReturn();
                        }
                    }
                    return script;
                },
            },
            neo_servo_angle_var: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic',
                statements: [],
                params: [
                    {
                        type: 'Dropdown',
                        options: [
                            [Lang.Blocks.neo_output_1, 'OUT1'],
                            [Lang.Blocks.neo_output_2, 'OUT2'],
                            [Lang.Blocks.neo_output_3, 'OUT3'],
                            [Lang.Blocks.neo_output_12, 'OUT12'],
                            [Lang.Blocks.neo_output_123, 'OUT123'],
                        ],
                        value: 'OUT1',
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
                        type: 'Dropdown',
                        options: [
                            [Lang.Blocks.neo_motor_speed_100, '100'],
                            [Lang.Blocks.neo_motor_speed_90, '90'],
                            [Lang.Blocks.neo_motor_speed_80, '80'],
                            [Lang.Blocks.neo_motor_speed_70, '70'],
                            [Lang.Blocks.neo_motor_speed_60, '60'],
                            [Lang.Blocks.neo_motor_speed_50, '50'],
                            [Lang.Blocks.neo_motor_speed_40, '40'],
                            [Lang.Blocks.neo_motor_speed_30, '30'],
                            [Lang.Blocks.neo_motor_speed_20, '20'],
                            [Lang.Blocks.neo_motor_speed_10, '10'],
                            [Lang.Blocks.neo_motor_speed_0, '0'],
                            [Lang.Blocks.neo_input_1, 'IN1'],
                            [Lang.Blocks.neo_input_2, 'IN2'],
                            [Lang.Blocks.neo_input_3, 'IN3'],
                        ],
                        value: '50',
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
                            type: 'neo_arg_servo_angle',
                        },
                        null,
                        null,
                    ],
                    type: 'neo_servo_angle_var',
                },
                paramsKeyMap: {
                    OUTPUT: 0,
                    ANGLE: 1,
                    SPEED: 2,
                },
                class: 'neo_servo',
                isNotFor: ['neo'],
                func: (sprite, script) => {
                    if (!script.exec_phase) {
                        script.exec_phase = ExecPhase.PENDING_RESPONSE;
                        const output = script.getStringField('OUTPUT', script);
                        const angle = script.getNumberValue('ANGLE', script);
                        const speed = script.getStringField('SPEED', script);
                        const blockId = this.generateBlockId();
                        script.block_id = blockId;
                        this.requestCommand(blockId, NeoBlockType.SERVO_ANGLE, [output, angle, speed]);
                    } else if (script.exec_phase === ExecPhase.PENDING_STOP) {
                        if (!this.pendingResponseList[script.block_id]) {
                            delete script.block_id;
                            delete script.exec_phase;
                            return script.callReturn();
                        }
                    }
                    return script;
                },
            },
            neo_servo_angle_wait: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic',
                statements: [],
                params: [
                    {
                        type: 'Dropdown',
                        options: [
                            [Lang.Blocks.neo_output_1, 'OUT1'],
                            [Lang.Blocks.neo_output_2, 'OUT2'],
                            [Lang.Blocks.neo_output_3, 'OUT3'],
                            [Lang.Blocks.neo_output_12, 'OUT12'],
                            [Lang.Blocks.neo_output_123, 'OUT123'],
                        ],
                        value: 'OUT1',
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                    {
                        type: 'Dropdown',
                        options: [
                            [Lang.Blocks.neo_servo_angle_360, '360'],
                            [Lang.Blocks.neo_servo_angle_350, '350'],
                            [Lang.Blocks.neo_servo_angle_340, '340'],
                            [Lang.Blocks.neo_servo_angle_330, '330'],
                            [Lang.Blocks.neo_servo_angle_320, '320'],
                            [Lang.Blocks.neo_servo_angle_310, '310'],
                            [Lang.Blocks.neo_servo_angle_300, '300'],
                            [Lang.Blocks.neo_servo_angle_290, '290'],
                            [Lang.Blocks.neo_servo_angle_280, '280'],
                            [Lang.Blocks.neo_servo_angle_270, '270'],
                            [Lang.Blocks.neo_servo_angle_260, '260'],
                            [Lang.Blocks.neo_servo_angle_250, '250'],
                            [Lang.Blocks.neo_servo_angle_240, '240'],
                            [Lang.Blocks.neo_servo_angle_230, '230'],
                            [Lang.Blocks.neo_servo_angle_220, '220'],
                            [Lang.Blocks.neo_servo_angle_210, '210'],
                            [Lang.Blocks.neo_servo_angle_200, '200'],
                            [Lang.Blocks.neo_servo_angle_190, '190'],
                            [Lang.Blocks.neo_servo_angle_180, '180'],
                            [Lang.Blocks.neo_servo_angle_170, '170'],
                            [Lang.Blocks.neo_servo_angle_160, '160'],
                            [Lang.Blocks.neo_servo_angle_150, '150'],
                            [Lang.Blocks.neo_servo_angle_140, '140'],
                            [Lang.Blocks.neo_servo_angle_130, '130'],
                            [Lang.Blocks.neo_servo_angle_120, '120'],
                            [Lang.Blocks.neo_servo_angle_110, '110'],
                            [Lang.Blocks.neo_servo_angle_100, '100'],
                            [Lang.Blocks.neo_servo_angle_90, '90'],
                            [Lang.Blocks.neo_servo_angle_80, '80'],
                            [Lang.Blocks.neo_servo_angle_70, '70'],
                            [Lang.Blocks.neo_servo_angle_60, '60'],
                            [Lang.Blocks.neo_servo_angle_50, '50'],
                            [Lang.Blocks.neo_servo_angle_40, '40'],
                            [Lang.Blocks.neo_servo_angle_30, '30'],
                            [Lang.Blocks.neo_servo_angle_20, '20'],
                            [Lang.Blocks.neo_servo_angle_10, '10'],
                            [Lang.Blocks.neo_servo_angle_0, '0'],
                            [Lang.Blocks.neo_servo_angle_n10, '-10'],
                            [Lang.Blocks.neo_servo_angle_n20, '-20'],
                            [Lang.Blocks.neo_servo_angle_n30, '-30'],
                            [Lang.Blocks.neo_servo_angle_n40, '-40'],
                            [Lang.Blocks.neo_servo_angle_n50, '-50'],
                            [Lang.Blocks.neo_servo_angle_n60, '-60'],
                            [Lang.Blocks.neo_servo_angle_n70, '-70'],
                            [Lang.Blocks.neo_servo_angle_n80, '-80'],
                            [Lang.Blocks.neo_servo_angle_n90, '-90'],
                            [Lang.Blocks.neo_servo_angle_n100, '-100'],
                            [Lang.Blocks.neo_servo_angle_n110, '-110'],
                            [Lang.Blocks.neo_servo_angle_n120, '-120'],
                            [Lang.Blocks.neo_servo_angle_n130, '-130'],
                            [Lang.Blocks.neo_servo_angle_n140, '-140'],
                            [Lang.Blocks.neo_servo_angle_n150, '-150'],
                            [Lang.Blocks.neo_servo_angle_n160, '-160'],
                            [Lang.Blocks.neo_servo_angle_n170, '-170'],
                            [Lang.Blocks.neo_servo_angle_n180, '-180'],
                            [Lang.Blocks.neo_servo_angle_n190, '-190'],
                            [Lang.Blocks.neo_servo_angle_n200, '-200'],
                            [Lang.Blocks.neo_servo_angle_n210, '-210'],
                            [Lang.Blocks.neo_servo_angle_n220, '-220'],
                            [Lang.Blocks.neo_servo_angle_n230, '-230'],
                            [Lang.Blocks.neo_servo_angle_n240, '-240'],
                            [Lang.Blocks.neo_servo_angle_n250, '-250'],
                            [Lang.Blocks.neo_servo_angle_n260, '-260'],
                            [Lang.Blocks.neo_servo_angle_n270, '-270'],
                            [Lang.Blocks.neo_servo_angle_n280, '-280'],
                            [Lang.Blocks.neo_servo_angle_n290, '-290'],
                            [Lang.Blocks.neo_servo_angle_n300, '-300'],
                            [Lang.Blocks.neo_servo_angle_n310, '-310'],
                            [Lang.Blocks.neo_servo_angle_n320, '-320'],
                            [Lang.Blocks.neo_servo_angle_n330, '-330'],
                            [Lang.Blocks.neo_servo_angle_n340, '-340'],
                            [Lang.Blocks.neo_servo_angle_n350, '-350'],
                            [Lang.Blocks.neo_servo_angle_n360, '-360'],
                            [Lang.Blocks.neo_input_1, 'IN1'],
                            [Lang.Blocks.neo_input_2, 'IN2'],
                            [Lang.Blocks.neo_input_3, 'IN3'],
                        ],
                        value: '90',
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                    {
                        type: 'Dropdown',
                        options: [
                            [Lang.Blocks.neo_motor_speed_100, '100'],
                            [Lang.Blocks.neo_motor_speed_90, '90'],
                            [Lang.Blocks.neo_motor_speed_80, '80'],
                            [Lang.Blocks.neo_motor_speed_70, '70'],
                            [Lang.Blocks.neo_motor_speed_60, '60'],
                            [Lang.Blocks.neo_motor_speed_50, '50'],
                            [Lang.Blocks.neo_motor_speed_40, '40'],
                            [Lang.Blocks.neo_motor_speed_30, '30'],
                            [Lang.Blocks.neo_motor_speed_20, '20'],
                            [Lang.Blocks.neo_motor_speed_10, '10'],
                            [Lang.Blocks.neo_motor_speed_0, '0'],
                        ],
                        value: '50',
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
                    type: 'neo_servo_angle_wait',
                },
                paramsKeyMap: {
                    OUTPUT: 0,
                    ANGLE: 1,
                    SPEED: 2,
                },
                class: 'neo_servo',
                isNotFor: ['neo'],
                func: (sprite, script) => {
                    if (!script.exec_phase) {
                        script.exec_phase = ExecPhase.PENDING_RESPONSE;
                        const output = script.getStringField('OUTPUT', script);
                        const angle = script.getStringField('ANGLE', script);
                        const speed = script.getStringField('SPEED', script);
                        const blockId = this.generateBlockId();
                        script.block_id = blockId;
                        if (angle === 'IN1' || angle === 'IN2' || angle === 'IN3') {
                            if (speed === 'IN1' || angle === 'IN2' || angle === 'IN3') {
                                this.requestExtCommand(blockId, NeoBlockType.SERVO_ANGLE_WAIT, [output, angle, speed]);
                            } else {
                                this.requestExtCommand(blockId, NeoBlockType.SERVO_ANGLE_WAIT, [output, angle, speed]);
                            }
                        } else {
                            this.requestCommand(blockId, NeoBlockType.SERVO_ANGLE_WAIT, [output, angle, speed]);
                        }
                    } else if (script.exec_phase === ExecPhase.PENDING_RESPONSE) {
                        if (!this.pendingResponseList[script.block_id]) {
                            delete script.block_id;
                            delete script.exec_phase;
                            return script.callReturn();
                        }
                    }
                    return script;
                },
            },
            neo_servo_rotate: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic',
                statements: [],
                params: [
                    {
                        type: 'Dropdown',
                        options: [
                            [Lang.Blocks.neo_output_1, 'OUT1'],
                            [Lang.Blocks.neo_output_2, 'OUT2'],
                            [Lang.Blocks.neo_output_3, 'OUT3'],
                            [Lang.Blocks.neo_output_12, 'OUT12'],
                            [Lang.Blocks.neo_output_123, 'OUT123'],
                        ],
                        value: 'OUT1',
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                    {
                        type: 'Dropdown',
                        options: [
                            [Lang.Blocks.neo_servo_direction_f, 1],
                            [Lang.Blocks.neo_servo_direction_b, 2],
                        ],
                        value: 1,
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                    {
                        type: 'Dropdown',
                        options: [
                            [Lang.Blocks.neo_motor_speed_100, '100'],
                            [Lang.Blocks.neo_motor_speed_90, '90'],
                            [Lang.Blocks.neo_motor_speed_80, '80'],
                            [Lang.Blocks.neo_motor_speed_70, '70'],
                            [Lang.Blocks.neo_motor_speed_60, '60'],
                            [Lang.Blocks.neo_motor_speed_50, '50'],
                            [Lang.Blocks.neo_motor_speed_40, '40'],
                            [Lang.Blocks.neo_motor_speed_30, '30'],
                            [Lang.Blocks.neo_motor_speed_20, '20'],
                            [Lang.Blocks.neo_motor_speed_10, '10'],
                            [Lang.Blocks.neo_motor_speed_0, '0'],
                            [Lang.Blocks.neo_input_1, 'IN1'],
                            [Lang.Blocks.neo_input_2, 'IN2'],
                            [Lang.Blocks.neo_input_3, 'IN3'],
                        ],
                        value: '50',
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
                    type: 'neo_servo_rotate',
                },
                paramsKeyMap: {
                    OUTPUT: 0,
                    DIRECTION: 1,
                    SPEED: 2,
                },
                class: 'neo_servo',
                isNotFor: ['neo'],
                func: (sprite, script) => {
                    if (!script.exec_phase) {
                        script.exec_phase = ExecPhase.PENDING_STOP;
                        const output = script.getStringField('OUTPUT', script);
                        const direction = script.getStringField('DIRECTION', script);
                        const speed = script.getStringField('SPEED', script);
                        const blockId = this.generateBlockId();
                        script.block_id = blockId;
                        if (speed.indexOf('IN') >= 0) {
                            this.requestExtCommand(blockId, NeoBlockType.SERVO_ROTATE, [output, direction, speed]);
                        } else {
                            this.requestCommand(blockId, NeoBlockType.SERVO_ROTATE, [output, direction, speed]);
                        }
                    } else if (script.exec_phase === ExecPhase.PENDING_STOP) {
                        if (!this.pendingResponseList[script.block_id]) {
                            delete script.block_id;
                            delete script.exec_phase;
                            return script.callReturn();
                        }
                    }
                    return script;
                },
            },
            neo_servo_stop: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic',
                statements: [],
                params: [
                    {
                        type: 'Dropdown',
                        options: [
                            [Lang.Blocks.neo_output_1, 'OUT1'],
                            [Lang.Blocks.neo_output_2, 'OUT2'],
                            [Lang.Blocks.neo_output_3, 'OUT3'],
                            [Lang.Blocks.neo_output_12, 'OUT12'],
                            [Lang.Blocks.neo_output_123, 'OUT123'],
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
                    type: 'neo_servo_stop',
                },
                paramsKeyMap: {
                    OUTPUT: 0,
                },
                class: 'neo_servo',
                isNotFor: ['neo'],
                func: (sprite, script) => {
                    if (!script.exec_phase) {
                        script.exec_phase = ExecPhase.PENDING_STOP;
                        const output = script.getStringValue('OUTPUT', script);
                        const blockId = this.generateBlockId();
                        script.block_id = blockId;
                        this.requestCommand(blockId, NeoBlockType.SERVO_STOP, [output]);
                    } else if (script.exec_phase === ExecPhase.PENDING_STOP) {
                        if (!this.pendingResponseList[script.block_id]) {
                            delete script.block_id;
                            delete script.exec_phase;
                            return script.callReturn();
                        }
                    }
                    return script;
                },
            },
            /**
             * 라인트레이서
             */
            neo_line_tracer_title: {
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
                        text: Lang.template.neo_line_tracer_title,
                        color: '#191970',
                        align: 'left',
                    },
                ],
                def: {
                    type: 'neo_line_tracer_title',
                },
                class: 'neo_line_tracer',
                isNotFor: ['neo'],
                events: {},
            },
            neo_line_tracer_start: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic',
                statements: [],
                params: [
                    {
                        type: 'Dropdown',
                        options: [
                            [Lang.Blocks.neo_motor_speed_100, '100'],
                            [Lang.Blocks.neo_motor_speed_90, '90'],
                            [Lang.Blocks.neo_motor_speed_80, '80'],
                            [Lang.Blocks.neo_motor_speed_70, '70'],
                            [Lang.Blocks.neo_motor_speed_60, '60'],
                            [Lang.Blocks.neo_motor_speed_50, '50'],
                            [Lang.Blocks.neo_motor_speed_40, '40'],
                            [Lang.Blocks.neo_motor_speed_30, '30'],
                            [Lang.Blocks.neo_motor_speed_20, '20'],
                            [Lang.Blocks.neo_motor_speed_10, '10'],
                            [Lang.Blocks.neo_motor_speed_0, '0'],
                            [Lang.Blocks.neo_input_3, 'IN3'],
                        ],
                        value: '100',
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
                        img: 'block_icon/hardware_icon.svg',
                        size: 12,
                    },
                ],
                events: {},
                def: {
                    params: [
                        null,
                        {
                            type: 'neo_arg_duration',
                        },
                        null,
                    ],
                    type: 'neo_line_tracer_start',
                },
                paramsKeyMap: {
                    SPEED: 0,
                    DURATION: 1,
                },
                class: 'neo_line_tracer',
                isNotFor: ['neo'],
                func: (sprite, script) => {
                    if (!script.exec_phase) {
                        const speed = script.getStringField('SPEED', script);
                        const blockId = this.generateBlockId();
                        const duration = script.getStringValue('DURATION', script);
                        if (speed === 'IN1' || speed === 'IN2' || speed === 'IN3') {
                            this.requestExtCommand(blockId, NeoBlockType.LINE_TRACER_START, [speed]);
                        } else {
                            this.requestCommand(blockId, NeoBlockType.LINE_TRACER_START, [speed]);
                        }
                        if (duration === 'c' || !Entry.parseNumber(duration)) {
                            script.block_id = blockId;
                            script.exec_phase = ExecPhase.PENDING_STOP;
                        } else {
                            script.exec_phase = ExecPhase.SET_TIMEOUT;
                        }
                    } else if (script.exec_phase === ExecPhase.SET_TIMEOUT) {
                        const duration = script.getStringValue('DURATION', script);
                        const durationValue = Entry.parseNumber(duration);
                        script.exec_phase = ExecPhase.WAIT_TIMEOUT;
                        setTimeout(function() {
                            script.exec_phase = ExecPhase.STOP;
                        }, durationValue * 1000);
                    } else if (script.exec_phase === ExecPhase.WAIT_TIMEOUT) {
                        return script;
                    } else if (script.exec_phase === ExecPhase.STOP) {
                        script.exec_phase = ExecPhase.PENDING_STOP;
                        const blockId = this.generateBlockId();
                        script.block_id = blockId;
                        this.requestCommand(blockId, NeoBlockType.LINE_TRACER_START, [0]);
                    } else if (script.exec_phase === ExecPhase.PENDING_STOP) {
                        if (!this.pendingResponseList[script.block_id]) {
                            delete script.block_id;
                            delete script.exec_phase;
                            return script.callReturn();
                        }
                    }
                    return script;
                },
            },
            neo_line_cross_move: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic',
                statements: [],
                params: [
                    {
                        type: 'Dropdown',
                        options: [
                            [Lang.Blocks.neo_line_cross_move_1, 1],
                            [Lang.Blocks.neo_line_cross_move_2, 2],
                            [Lang.Blocks.neo_line_cross_move_3, 3],
                            [Lang.Blocks.neo_line_cross_move_4, 4],
                            [Lang.Blocks.neo_line_cross_move_5, 5],
                            [Lang.Blocks.neo_line_cross_move_6, 6],
                            [Lang.Blocks.neo_line_cross_move_7, 7],
                            [Lang.Blocks.neo_line_cross_move_8, 8],
                            [Lang.Blocks.neo_line_cross_move_9, 9],
                            [Lang.Blocks.neo_line_cross_move_10, 10],
                        ],
                        value: 1,
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
                    type: 'neo_line_cross_move',
                },
                paramsKeyMap: {
                    COUNT: 0,
                },
                class: 'neo_line_tracer',
                isNotFor: ['neo'],
                func: (sprite, script) => {
                    if (!script.exec_phase) {
                        script.exec_phase = ExecPhase.PENDING_RESPONSE;
                        const count = script.getStringValue('COUNT', script);
                        const blockId = this.generateBlockId();
                        script.block_id = blockId;
                        this.requestCommand(blockId, NeoBlockType.LINE_CROSS_MOVE, [count]);
                    } else if (script.exec_phase === ExecPhase.PENDING_RESPONSE) {
                        if (!this.pendingResponseList[script.block_id]) {
                            delete script.block_id;
                            delete script.exec_phase;
                            return script.callReturn();
                        }
                    }
                    return script;
                },
            },
            neo_line_cross_turn: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic',
                statements: [],
                params: [
                    {
                        type: 'Dropdown',
                        options: [
                            [Lang.Blocks.neo_turn_direction_l, 10],
                            [Lang.Blocks.neo_turn_direction_r, 11],
                            [Lang.Blocks.neo_turn_direction_u, 12],
                        ],
                        value: 10,
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
                    type: 'neo_line_cross_turn',
                },
                paramsKeyMap: {
                    DIRECTION: 0,
                },
                class: 'neo_line_tracer',
                isNotFor: ['neo'],
                func: (sprite, script) => {
                    if (!script.exec_phase) {
                        script.exec_phase = ExecPhase.PENDING_RESPONSE;
                        const direction = script.getStringValue('DIRECTION', script);
                        const blockId = this.generateBlockId();
                        script.block_id = blockId;
                        this.requestCommand(blockId, NeoBlockType.LINE_CROSS_TURN, [direction]);
                    } else if (script.exec_phase === ExecPhase.PENDING_RESPONSE) {
                        if (!this.pendingResponseList[script.block_id]) {
                            delete script.block_id;
                            delete script.exec_phase;
                            return script.callReturn();
                        }
                    }
                    return script;
                },
            },
            /**
             * 자율주행
             */
            neo_auto_driving_title: {
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
                        text: Lang.template.neo_auto_driving_title,
                        color: '#191970',
                        align: 'left',
                    },
                ],
                def: {
                    type: 'neo_auto_driving_title',
                },
                class: 'neo_auto_driving',
                isNotFor: ['neo'],
                events: {},
            },
            neo_auto_driving_start: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic',
                statements: [],
                params: [
                    {
                        type: 'Dropdown',
                        options: [
                            [Lang.Blocks.neo_motor_speed_100, '100'],
                            [Lang.Blocks.neo_motor_speed_90, '90'],
                            [Lang.Blocks.neo_motor_speed_80, '80'],
                            [Lang.Blocks.neo_motor_speed_70, '70'],
                            [Lang.Blocks.neo_motor_speed_60, '60'],
                            [Lang.Blocks.neo_motor_speed_50, '50'],
                            [Lang.Blocks.neo_motor_speed_40, '40'],
                            [Lang.Blocks.neo_motor_speed_30, '30'],
                            [Lang.Blocks.neo_motor_speed_20, '20'],
                            [Lang.Blocks.neo_motor_speed_10, '10'],
                            [Lang.Blocks.neo_motor_speed_0, '0'],
                            [Lang.Blocks.neo_input_1, 'IN1'],
                            [Lang.Blocks.neo_input_2, 'IN2'],
                            [Lang.Blocks.neo_input_3, 'IN3'],
                        ],
                        value: '60',
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
                        img: 'block_icon/hardware_icon.svg',
                        size: 12,
                    },
                ],
                events: {},
                def: {
                    params: [
                        null,
                        {
                            type: 'neo_arg_duration',
                        },
                        null,
                    ],
                    type: 'neo_auto_driving_start',
                },
                paramsKeyMap: {
                    SPEED: 0,
                    DURATION: 1,
                },
                class: 'neo_auto_driving',
                isNotFor: ['neo'],
                func: (sprite, script) => {
                    if (!script.exec_phase) {
                        const speed = script.getStringField('SPEED', script);
                        const duration = script.getStringValue('DURATION', script);
                        const blockId = this.generateBlockId();
                        if (speed.indexOf('IN') >= 0) {
                            this.requestExtCommand(blockId, NeoBlockType.AUTO_DRIVING_START, [speed]);
                        } else {
                            this.requestCommand(blockId, NeoBlockType.AUTO_DRIVING_START, [speed]);
                        }
                        if (duration === 'c' || !Entry.parseNumber(duration)) {
                            script.block_id = blockId;
                            script.exec_phase = ExecPhase.PENDING_STOP;
                        } else {
                            script.exec_phase = ExecPhase.SET_TIMEOUT;
                        }
                    } else if (script.exec_phase === ExecPhase.SET_TIMEOUT) {
                        const duration = script.getStringValue('DURATION', script);
                        const durationValue = Entry.parseNumber(duration);
                        script.exec_phase = ExecPhase.WAIT_TIMEOUT;
                        setTimeout(function() {
                            script.exec_phase = ExecPhase.STOP;
                        }, durationValue * 1000);
                    } else if (script.exec_phase === ExecPhase.WAIT_TIMEOUT) {
                        return script;
                    } else if (script.exec_phase === ExecPhase.STOP) {
                        script.exec_phase = ExecPhase.PENDING_STOP;
                        const blockId = this.generateBlockId();
                        script.block_id = blockId;
                        this.requestCommand(blockId, NeoBlockType.AUTO_DRIVING_START, [0]);
                    } else if (script.exec_phase === ExecPhase.PENDING_STOP) {
                        if (!this.pendingResponseList[script.block_id]) {
                            delete script.block_id;
                            delete script.exec_phase;
                            return script.callReturn();
                        }
                    }
                    return script;
                },
            },
            neo_auto_driving_sensor_start: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic',
                statements: [],
                params: [
                    {
                        type: 'Dropdown',
                        options: [
                            [Lang.Blocks.neo_input_1_2, 0x10],
                            [Lang.Blocks.neo_input_11_12, 0x11],
                            [Lang.Blocks.neo_input_13_14, 0x12],
                            [Lang.Blocks.neo_input_21_22, 0x13],
                            [Lang.Blocks.neo_input_23_24, 0x14],
                        ],
                        value: 0x10,
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                    {
                        type: 'Dropdown',
                        options: [
                            [Lang.Blocks.neo_motor_speed_100, '100'],
                            [Lang.Blocks.neo_motor_speed_90, '90'],
                            [Lang.Blocks.neo_motor_speed_80, '80'],
                            [Lang.Blocks.neo_motor_speed_70, '70'],
                            [Lang.Blocks.neo_motor_speed_60, '60'],
                            [Lang.Blocks.neo_motor_speed_50, '50'],
                            [Lang.Blocks.neo_motor_speed_40, '40'],
                            [Lang.Blocks.neo_motor_speed_30, '30'],
                            [Lang.Blocks.neo_motor_speed_20, '20'],
                            [Lang.Blocks.neo_motor_speed_10, '10'],
                            [Lang.Blocks.neo_motor_speed_0, '0'],
                            [Lang.Blocks.neo_input_1, 'IN1'],
                            [Lang.Blocks.neo_input_2, 'IN2'],
                            [Lang.Blocks.neo_input_3, 'IN3'],
                        ],
                        value: '60',
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
                    params: [null, null, null],
                    type: 'neo_auto_driving_sensor_start',
                },
                paramsKeyMap: {
                    SENSOR: 0,
                    SPEED: 1,
                },
                class: 'neo_auto_driving',
                isNotFor: ['neo'],
                func: (sprite, script) => {
                    if (!script.exec_phase) {
                        script.exec_phase = ExecPhase.PENDING_STOP;
                        const sensor = script.getNumberField('SENSOR', script);
                        const speed = script.getStringField('SPEED', script);
                        const blockId = this.generateBlockId();
                        script.block_id = blockId;
                        if (speed.indexOf('IN') >= 0) {
                            this.requestExtCommand(blockId, NeoBlockType.AUTO_DRIVING_SENSOR_START, [sensor, speed]);
                        } else {
                            this.requestCommand(blockId, NeoBlockType.AUTO_DRIVING_SENSOR_START, [sensor, speed]);
                        }
                    } else if (script.exec_phase === ExecPhase.PENDING_STOP) {
                        if (!this.pendingResponseList[script.block_id]) {
                            delete script.block_id;
                            delete script.exec_phase;
                            return script.callReturn();
                        }
                    }
                    return script;
                },
            },
            neo_auto_driving_stop: {
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
                    type: 'neo_auto_driving_stop',
                },
                paramsKeyMap: {
                    DIRECTION: 0,
                },
                class: 'neo_auto_driving',
                isNotFor: ['neo'],
                func: (sprite, script) => {
                    if (!script.exec_phase) {
                        script.exec_phase = ExecPhase.PENDING_STOP;
                        const blockId = this.generateBlockId();
                        script.block_id = blockId;
                        this.requestCommand(blockId, NeoBlockType.AUTO_DRIVING_STOP, []);
                    } else if (script.exec_phase === ExecPhase.PENDING_STOP) {
                        if (!this.pendingResponseList[script.block_id]) {
                            delete script.block_id;
                            delete script.exec_phase;
                            return script.callReturn();
                        }
                    }
                    return script;
                },
            },
            /**
             * 자율주차
             */
            neo_auto_parking_title: {
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
                        text: Lang.template.neo_auto_parking_title,
                        color: '#191970',
                        align: 'left',
                    },
                ],
                def: {
                    type: 'neo_auto_parking_title',
                },
                class: 'neo_auto_parking',
                isNotFor: ['neo'],
                events: {},
            },
            neo_auto_parking_start: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic',
                statements: [],
                params: [
                    {
                        type: 'Dropdown',
                        options: [
                            [Lang.Blocks.neo_auto_parking_which_l, 1],
                            [Lang.Blocks.neo_auto_parking_which_r, 2],
                        ],
                        value: 1,
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                    {
                        type: 'Dropdown',
                        options: [
                            [Lang.Blocks.neo_auto_parking_direction_b, 1],
                            [Lang.Blocks.neo_auto_parking_direction_s, 2],
                        ],
                        value: 1,
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
                    params: [null, null, null],
                    type: 'neo_auto_parking_start',
                },
                paramsKeyMap: {
                    WHICH: 0,
                    DIRECTION: 1,
                },
                class: 'neo_auto_parking',
                isNotFor: ['neo'],
                func: async (sprite, script) => {
                    const direction = script.getNumberValue('DIRECTION', script);
                    if (direction === 1) {
                        return this.runAutoParkingBackward(script);
                    } else {
                        return this.runAutoParkingSide(script);
                    }
                },
            },
            /**
             * 차선변경
             */
            neo_line_change_title: {
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
                        text: Lang.template.neo_line_change_title,
                        color: '#191970',
                        align: 'left',
                    },
                ],
                def: {
                    type: 'neo_line_change_title',
                },
                class: 'neo_line_change',
                isNotFor: ['neo'],
                events: {},
            },
            neo_line_change_start: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic',
                statements: [],
                params: [
                    {
                        type: 'Dropdown',
                        options: [
                            [Lang.Blocks.neo_line_change_direction_l, 2],
                            [Lang.Blocks.neo_line_change_direction_r, 3],
                        ],
                        value: 2,
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
                    type: 'neo_line_change_start',
                },
                paramsKeyMap: {
                    DIRECTION: 0,
                },
                class: 'neo_line_change',
                isNotFor: ['neo'],
                func: (sprite, script) => {
                    return script.callReturn();
                },
            },
            neo_line_change_turn: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic',
                statements: [],
                params: [
                    {
                        type: 'Dropdown',
                        options: [
                            [Lang.Blocks.neo_turn_direction_l, 4],
                            [Lang.Blocks.neo_turn_direction_r, 5],
                            [Lang.Blocks.neo_turn_direction_u, 6],
                        ],
                        value: 4,
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
                    type: 'neo_line_change_turn',
                },
                paramsKeyMap: {
                    DIRECTION: 0,
                },
                class: 'neo_line_change',
                isNotFor: ['neo'],
                func: (sprite, script) => {
                    return script.callReturn();
                },
            },
            /**
             * 골목주행
             */
            neo_auto_detect_wall_title: {
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
                        text: Lang.template.neo_auto_detect_wall_title,
                        color: '#191970',
                        align: 'left',
                    },
                ],
                def: {
                    type: 'neo_auto_detect_wall_title',
                },
                class: 'neo_auto_detect_wall',
                isNotFor: ['neo'],
                events: {},
            },
            neo_auto_detect_wall_start: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic',
                statements: [],
                params: [
                    {
                        type: 'Dropdown',
                        options: [
                            [Lang.Blocks.neo_motor_speed_100, '100'],
                            [Lang.Blocks.neo_motor_speed_90, '90'],
                            [Lang.Blocks.neo_motor_speed_80, '80'],
                            [Lang.Blocks.neo_motor_speed_70, '70'],
                            [Lang.Blocks.neo_motor_speed_60, '60'],
                            [Lang.Blocks.neo_motor_speed_50, '50'],
                            [Lang.Blocks.neo_motor_speed_40, '40'],
                            [Lang.Blocks.neo_motor_speed_30, '30'],
                            [Lang.Blocks.neo_motor_speed_20, '20'],
                            [Lang.Blocks.neo_motor_speed_10, '10'],
                            [Lang.Blocks.neo_motor_speed_0, '0'],
                            [Lang.Blocks.neo_input_1, 'IN1'],
                            [Lang.Blocks.neo_input_2, 'IN2'],
                            [Lang.Blocks.neo_input_3, 'IN3'],
                        ],
                        value: '60',
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
                        img: 'block_icon/hardware_icon.svg',
                        size: 12,
                    },
                ],
                events: {},
                def: {
                    params: [
                        null,
                        {
                            type: 'neo_arg_duration',
                        },
                        null,
                    ],
                    type: 'neo_auto_detect_wall_start',
                },
                paramsKeyMap: {
                    SPEED: 0,
                    DURATION: 1,
                },
                class: 'neo_auto_detect_wall',
                isNotFor: ['neo'],
                func: (sprite, script) => {
                    return script.callReturn();
                },
            },
            neo_auto_detect_wall_turn: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic',
                statements: [],
                params: [
                    {
                        type: 'Dropdown',
                        options: [
                            [Lang.Blocks.neo_turn_direction_l, 2],
                            [Lang.Blocks.neo_turn_direction_r, 3],
                            [Lang.Blocks.neo_turn_direction_u, 4],
                        ],
                        value: 2,
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
                    type: 'neo_auto_detect_wall_turn',
                },
                paramsKeyMap: {
                    DIRECTION: 0,
                },
                class: 'neo_auto_detect_wall',
                isNotFor: ['neo'],
                func: (sprite, script) => {
                    return script.callReturn();
                },
            },
            /**
             * LED
             */
            neo_led_title: {
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
                        text: Lang.template.neo_led_title,
                        color: '#191970',
                        align: 'left',
                    },
                ],
                def: {
                    type: 'neo_led_title',
                },
                class: 'neo_led',
                isNotFor: ['neo'],
                events: {},
            },
            neo_led_on: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic',
                statements: [],
                params: [
                    {
                        type: 'Dropdown',
                        options: [
                            [Lang.Blocks.neo_output_1, 'OUT1'],
                            [Lang.Blocks.neo_output_2, 'OUT2'],
                            [Lang.Blocks.neo_output_3, 'OUT3'],
                            [Lang.Blocks.neo_output_12, 'OUT12'],
                            [Lang.Blocks.neo_output_123, 'OUT123'],
                        ],
                        value: 'OUT1',
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                    {
                        type: 'Dropdown',
                        options: [
                            [Lang.Blocks.neo_led_brightness_100, '100'],
                            [Lang.Blocks.neo_led_brightness_90, '90'],
                            [Lang.Blocks.neo_led_brightness_80, '80'],
                            [Lang.Blocks.neo_led_brightness_70, '70'],
                            [Lang.Blocks.neo_led_brightness_60, '60'],
                            [Lang.Blocks.neo_led_brightness_50, '50'],
                            [Lang.Blocks.neo_led_brightness_40, '40'],
                            [Lang.Blocks.neo_led_brightness_30, '30'],
                            [Lang.Blocks.neo_led_brightness_20, '20'],
                            [Lang.Blocks.neo_led_brightness_10, '10'],
                            [Lang.Blocks.neo_led_brightness_0, '0'],
                            [Lang.Blocks.neo_input_1, 'IN1'],
                            [Lang.Blocks.neo_input_2, 'IN2'],
                            [Lang.Blocks.neo_input_3, 'IN3'],
                        ],
                        value: '100',
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
                            type: 'neo_arg_duration',
                        },
                        null,
                    ],
                    type: 'neo_led_on',
                },
                paramsKeyMap: {
                    OUTPUT: 0,
                    BRIGHTNESS: 1,
                    DURATION: 2,
                },
                class: 'neo_led',
                isNotFor: ['neo'],
                func: (sprite, script) => {
                    if (!script.exec_phase) {
                        const output = script.getStringValue('OUTPUT', script);
                        const brightness = script.getStringValue('BRIGHTNESS', script);
                        const duration = script.getStringValue('DURATION', script);
                        const blockId = this.generateBlockId();
                        if (brightness.indexOf('IN') >= 0) {
                            this.requestExtCommand(blockId, NeoBlockType.LED_ON, [output, brightness]);
                        } else {
                            this.requestCommand(blockId, NeoBlockType.LED_ON, [output, brightness]);
                        }
                        if (duration === 'c' || !Entry.parseNumber(duration)) {
                            script.block_id = blockId;
                            script.exec_phase = ExecPhase.PENDING_STOP;
                        } else {
                            script.exec_phase = ExecPhase.SET_TIMEOUT;
                        }
                    } else if (script.exec_phase === ExecPhase.SET_TIMEOUT) {
                        const duration = script.getStringValue('DURATION', script);
                        const durationValue = Entry.parseNumber(duration);
                        script.exec_phase = ExecPhase.WAIT_TIMEOUT;
                        setTimeout(function() {
                            script.exec_phase = ExecPhase.STOP;
                        }, durationValue * 1000);
                    } else if (script.exec_phase === ExecPhase.WAIT_TIMEOUT) {
                        return script;
                    } else if (script.exec_phase === ExecPhase.STOP) {
                        script.exec_phase = ExecPhase.PENDING_STOP;
                        const output = script.getStringField('OUTPUT', script);
                        const blockId = this.generateBlockId();
                        script.block_id = blockId;
                        this.requestCommand(blockId, NeoBlockType.LED_ON, [output, 0]);
                    } else if (script.exec_phase === ExecPhase.PENDING_STOP) {
                        if (!this.pendingResponseList[script.block_id]) {
                            delete script.block_id;
                            delete script.exec_phase;
                            return script.callReturn();
                        }
                    }
                    return script;
                },
            },
            neo_led_blink: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic',
                statements: [],
                params: [
                    {
                        type: 'Dropdown',
                        options: [
                            [Lang.Blocks.neo_output_1, 'OUT1'],
                            [Lang.Blocks.neo_output_2, 'OUT2'],
                            [Lang.Blocks.neo_output_3, 'OUT3'],
                            [Lang.Blocks.neo_output_12, 'OUT12'],
                            [Lang.Blocks.neo_output_123, 'OUT123'],
                        ],
                        value: 'OUT1',
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                    {
                        type: 'Dropdown',
                        options: [
                            [Lang.Blocks.neo_led_blink_speed_1, 500],
                            [Lang.Blocks.neo_led_blink_speed_2, 400],
                            [Lang.Blocks.neo_led_blink_speed_3, 300],
                            [Lang.Blocks.neo_led_blink_speed_4, 200],
                            [Lang.Blocks.neo_led_blink_speed_5, 100],
                        ],
                        value: 500,
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
                            type: 'neo_arg_duration',
                        },
                        null,
                    ],
                    type: 'neo_led_blink',
                },
                paramsKeyMap: {
                    OUTPUT: 0,
                    SPEED: 1,
                    DURATION: 2,
                },
                class: 'neo_led',
                isNotFor: ['neo'],
                func: (sprite, script) => {
                    if (!script.exec_phase) {
                        const output = script.getStringValue('OUTPUT', script);
                        const speed = script.getStringValue('SPEED', script);
                        const duration = script.getStringValue('DURATION', script);
                        const blockId = this.generateBlockId();
                        this.requestCommand(blockId, NeoBlockType.LED_BLINK, [output, speed, 100]);
                        if (duration === 'c' || !Entry.parseNumber(duration)) {
                            script.exec_phase = ExecPhase.PENDING_STOP;
                            script.block_id = blockId;
                        } else {
                            script.exec_phase = ExecPhase.SET_TIMEOUT;
                        }
                    } else if (script.exec_phase === ExecPhase.SET_TIMEOUT) {
                        const duration = script.getStringValue('DURATION', script);
                        const durationValue = Entry.parseNumber(duration);
                        script.exec_phase = ExecPhase.WAIT_TIMEOUT;
                        setTimeout(function() {
                            script.exec_phase = ExecPhase.STOP;
                        }, durationValue * 1000);
                    } else if (script.exec_phase === ExecPhase.WAIT_TIMEOUT) {
                        return script;
                    } else if (script.exec_phase === ExecPhase.STOP) {
                        script.exec_phase = ExecPhase.PENDING_STOP;
                        const output = script.getStringValue('OUTPUT', script);
                        const blockId = this.generateBlockId();
                        script.block_id = blockId;
                        this.requestCommand(blockId, NeoBlockType.LED_BLINK, [output, 0, 0]);
                    } else if (script.exec_phase === ExecPhase.PENDING_STOP) {
                        if (!this.pendingResponseList[script.block_id]) {
                            delete script.block_id;
                            delete script.exec_phase;
                            return script.callReturn();
                        }
                    }
                    return script;
                },
            },
            neo_led_off: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic',
                statements: [],
                params: [
                    {
                        type: 'Dropdown',
                        options: [
                            [Lang.Blocks.neo_output_1, 'OUT1'],
                            [Lang.Blocks.neo_output_2, 'OUT2'],
                            [Lang.Blocks.neo_output_3, 'OUT3'],
                            [Lang.Blocks.neo_output_12, 'OUT12'],
                            [Lang.Blocks.neo_output_123, 'OUT123'],
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
                    type: 'neo_led_off',
                },
                paramsKeyMap: {
                    OUTPUT: 0,
                },
                class: 'neo_led',
                isNotFor: ['neo'],
                func: (sprite, script) => {
                    if (!script.exec_phase) {
                        script.exec_phase = ExecPhase.PENDING_STOP;
                        const output = script.getStringValue('OUTPUT', script);
                        const blockId = this.generateBlockId();
                        script.block_id = blockId;
                        this.requestCommand(blockId, NeoBlockType.LED_OFF, [output]);
                    } else if (script.exec_phase === ExecPhase.PENDING_STOP) {
                        if (!this.pendingResponseList[script.block_id]) {
                            delete script.block_id;
                            delete script.exec_phase;
                            return script.callReturn();
                        }
                    }
                    return script;
                },
            },
            /**
             * 컬러 LED
             */
            neo_color_led_title: {
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
                        text: Lang.template.neo_color_led_title,
                        color: '#191970',
                        align: 'left',
                    },
                ],
                def: {
                    type: 'neo_color_led_title',
                },
                class: 'neo_color_led',
                isNotFor: ['neo'],
                events: {},
            },
            neo_color_led_on: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic',
                statements: [],
                params: [
                    {
                        type: 'Dropdown',
                        options: [
                            [Lang.Blocks.neo_output_1, 'OUT1'],
                            [Lang.Blocks.neo_output_2, 'OUT2'],
                            [Lang.Blocks.neo_output_3, 'OUT3'],
                            [Lang.Blocks.neo_output_12, 'OUT12'],
                            [Lang.Blocks.neo_output_123, 'OUT123'],
                        ],
                        value: 'OUT1',
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                    {
                        type: 'Color',
                    },
                    {
                        type: 'Block',
                        accept: 'string',
                        defaultType: 'number',
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
                            type: 'neo_arg_duration',
                        },
                        null,
                    ],
                    type: 'neo_color_led_on',
                },
                paramsKeyMap: {
                    OUTPUT: 0,
                    COLOR: 1,
                    DURATION: 2,
                },
                class: 'neo_color_led',
                isNotFor: ['neo'],
                func: (sprite, script) => {
                    if (!script.exec_phase) {
                        const output = script.getStringValue('OUTPUT', script);
                        const color = script.getStringValue('COLOR', script);
                        const duration = script.getStringValue('DURATION', script);
                        const blockId = this.generateBlockId();
                        this.requestCommand(blockId, NeoBlockType.COLOR_LED_ON, [output, color]);
                        if (duration === 'c' || !Entry.parseNumber(duration)) {
                            script.exec_phase = ExecPhase.PENDING_STOP;
                            script.block_id = blockId;
                        } else {
                            script.exec_phase = ExecPhase.SET_TIMEOUT;
                        }
                    } else if (script.exec_phase === ExecPhase.SET_TIMEOUT) {
                        const duration = script.getStringValue('DURATION', script);
                        const durationValue = Entry.parseNumber(duration);
                        script.exec_phase = ExecPhase.WAIT_TIMEOUT;
                        setTimeout(function() {
                            script.exec_phase = ExecPhase.STOP;
                        }, durationValue * 1000);
                    } else if (script.exec_phase === ExecPhase.WAIT_TIMEOUT) {
                        return script;
                    } else if (script.exec_phase === ExecPhase.STOP) {
                        script.exec_phase = ExecPhase.PENDING_STOP;
                        const output = script.getStringValue('OUTPUT', script);
                        const blockId = this.generateBlockId();
                        script.block_id = blockId;
                        this.requestCommand(blockId, NeoBlockType.COLOR_LED_ON, [output, 0]);
                    } else if (script.exec_phase === ExecPhase.PENDING_STOP) {
                        if (!this.pendingResponseList[script.block_id]) {
                            delete script.block_id;
                            delete script.exec_phase;
                            return script.callReturn();
                        }
                    }
                    return script;
                },
            },
            neo_color_led_off: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic',
                statements: [],
                params: [
                    {
                        type: 'Dropdown',
                        options: [
                            [Lang.Blocks.neo_output_1, 'OUT1'],
                            [Lang.Blocks.neo_output_2, 'OUT2'],
                            [Lang.Blocks.neo_output_3, 'OUT3'],
                            [Lang.Blocks.neo_output_12, 'OUT12'],
                            [Lang.Blocks.neo_output_123, 'OUT123'],
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
                    type: 'neo_color_led_off',
                },
                paramsKeyMap: {
                    OUTPUT: 0,
                },
                class: 'neo_color_led',
                isNotFor: ['neo'],
                func: (sprite, script) => {
                    if (!script.exec_phase) {
                        script.exec_phase = ExecPhase.PENDING_STOP;
                        const output = script.getStringValue('OUTPUT', script);
                        const blockId = this.generateBlockId();
                        script.block_id = blockId;
                        this.requestCommand(blockId, NeoBlockType.COLOR_LED_OFF, [output]);
                    } else if (script.exec_phase === ExecPhase.PENDING_STOP) {
                        if (!this.pendingResponseList[script.block_id]) {
                            delete script.block_id;
                            delete script.exec_phase;
                            return script.callReturn();
                        }
                    }
                    return script;
                },
            },
            neo_color_led_on_with_sensor: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic',
                statements: [],
                params: [
                    {
                        type: 'Dropdown',
                        options: [
                            [Lang.Blocks.neo_input_1, 'IN1'],
                            [Lang.Blocks.neo_input_2, 'IN2'],
                            [Lang.Blocks.neo_input_3, 'IN3'],
                        ],
                        value: 'IN1',
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                    {
                        type: 'Dropdown',
                        options: [
                            [Lang.Blocks.neo_output_1, 'OUT1'],
                            [Lang.Blocks.neo_output_2, 'OUT2'],
                            [Lang.Blocks.neo_output_3, 'OUT3'],
                            [Lang.Blocks.neo_output_12, 'OUT12'],
                            [Lang.Blocks.neo_output_123, 'OUT123'],
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
                    params: [null, null, null],
                    type: 'neo_color_led_on_with_sensor',
                },
                paramsKeyMap: {
                    INPUT: 0,
                    OUTPUT: 1,
                },
                class: 'neo_color_led',
                isNotFor: ['neo'],
                func: (sprite, script) => {
                    if (!script.exec_phase) {
                        script.exec_phase = ExecPhase.PENDING_STOP;
                        const output = script.getStringValue('OUTPUT', script);
                        const input = script.getStringValue('INPUT', script);
                        const blockId = this.generateBlockId();
                        script.block_id = blockId;
                        this.requestExtCommand(blockId, NeoBlockType.COLOR_LED_ON_SENSOR, [output, input]);
                    } else if (script.exec_phase === ExecPhase.PENDING_STOP) {
                        if (!this.pendingResponseList[script.block_id]) {
                            delete script.block_id;
                            delete script.exec_phase;
                            return script.callReturn();
                        }
                    }
                    return script;
                },
            },
            /**
             * 출력
             */
            neo_set_output_title: {
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
                        text: Lang.template.neo_set_output_title,
                        color: '#191970',
                        align: 'left',
                    },
                ],
                def: {
                    type: 'neo_set_output_title',
                },
                class: 'neo_set_output',
                isNotFor: ['neo'],
                events: {},
            },
            neo_set_output: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic',
                statements: [],
                params: [
                    {
                        type: 'Dropdown',
                        options: [
                            [Lang.Blocks.neo_output_1, 'OUT1'],
                            [Lang.Blocks.neo_output_2, 'OUT2'],
                            [Lang.Blocks.neo_output_3, 'OUT3'],
                            [Lang.Blocks.neo_output_12, 'OUT12'],
                            [Lang.Blocks.neo_output_123, 'OUT123'],
                        ],
                        value: 'OUT1',
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                    {
                        type: 'Dropdown',
                        options: [
                            [Lang.Blocks.neo_set_output_value_255, '255'],
                            [Lang.Blocks.neo_set_output_value_250, '250'],
                            [Lang.Blocks.neo_set_output_value_245, '245'],
                            [Lang.Blocks.neo_set_output_value_240, '240'],
                            [Lang.Blocks.neo_set_output_value_235, '235'],
                            [Lang.Blocks.neo_set_output_value_230, '230'],
                            [Lang.Blocks.neo_set_output_value_225, '225'],
                            [Lang.Blocks.neo_set_output_value_220, '220'],
                            [Lang.Blocks.neo_set_output_value_215, '215'],
                            [Lang.Blocks.neo_set_output_value_210, '210'],
                            [Lang.Blocks.neo_set_output_value_205, '205'],
                            [Lang.Blocks.neo_set_output_value_200, '200'],
                            [Lang.Blocks.neo_set_output_value_195, '195'],
                            [Lang.Blocks.neo_set_output_value_190, '190'],
                            [Lang.Blocks.neo_set_output_value_185, '185'],
                            [Lang.Blocks.neo_set_output_value_180, '180'],
                            [Lang.Blocks.neo_set_output_value_175, '175'],
                            [Lang.Blocks.neo_set_output_value_170, '170'],
                            [Lang.Blocks.neo_set_output_value_165, '165'],
                            [Lang.Blocks.neo_set_output_value_160, '160'],
                            [Lang.Blocks.neo_set_output_value_155, '155'],
                            [Lang.Blocks.neo_set_output_value_150, '150'],
                            [Lang.Blocks.neo_set_output_value_145, '145'],
                            [Lang.Blocks.neo_set_output_value_140, '140'],
                            [Lang.Blocks.neo_set_output_value_135, '135'],
                            [Lang.Blocks.neo_set_output_value_130, '130'],
                            [Lang.Blocks.neo_set_output_value_125, '125'],
                            [Lang.Blocks.neo_set_output_value_120, '120'],
                            [Lang.Blocks.neo_set_output_value_115, '115'],
                            [Lang.Blocks.neo_set_output_value_110, '110'],
                            [Lang.Blocks.neo_set_output_value_105, '105'],
                            [Lang.Blocks.neo_set_output_value_100, '100'],
                            [Lang.Blocks.neo_set_output_value_95, '95'],
                            [Lang.Blocks.neo_set_output_value_90, '90'],
                            [Lang.Blocks.neo_set_output_value_85, '85'],
                            [Lang.Blocks.neo_set_output_value_80, '80'],
                            [Lang.Blocks.neo_set_output_value_75, '75'],
                            [Lang.Blocks.neo_set_output_value_70, '70'],
                            [Lang.Blocks.neo_set_output_value_65, '65'],
                            [Lang.Blocks.neo_set_output_value_60, '60'],
                            [Lang.Blocks.neo_set_output_value_55, '55'],
                            [Lang.Blocks.neo_set_output_value_50, '50'],
                            [Lang.Blocks.neo_set_output_value_45, '45'],
                            [Lang.Blocks.neo_set_output_value_40, '40'],
                            [Lang.Blocks.neo_set_output_value_35, '35'],
                            [Lang.Blocks.neo_set_output_value_30, '30'],
                            [Lang.Blocks.neo_set_output_value_25, '25'],
                            [Lang.Blocks.neo_set_output_value_20, '20'],
                            [Lang.Blocks.neo_set_output_value_15, '15'],
                            [Lang.Blocks.neo_set_output_value_10, '10'],
                            [Lang.Blocks.neo_set_output_value_5, '5'],
                            [Lang.Blocks.neo_set_output_value_0, '0'],
                            [Lang.Blocks.neo_input_1, 'IN1'],
                            [Lang.Blocks.neo_input_2, 'IN2'],
                            [Lang.Blocks.neo_input_3, 'IN3'],
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
                            type: 'neo_arg_duration',
                        },
                        null,
                    ],
                    type: 'neo_set_output',
                },
                paramsKeyMap: {
                    OUTPUT: 0,
                    VALUE: 1,
                    DURATION: 2,
                },
                class: 'neo_set_output',
                isNotFor: ['neo'],
                func: (sprite, script) => {
                    if (!script.exec_phase) {
                        const output = script.getStringValue('OUTPUT', script);
                        const value = script.getStringValue('VALUE', script);
                        const duration = script.getStringValue('DURATION', script);
                        const blockId = this.generateBlockId();
                        if (value.indexOf('IN') >= 0) {
                            this.requestExtCommand(blockId, NeoBlockType.SET_OUTPUT, [output, value]);
                        } else {
                            this.requestCommand(blockId, NeoBlockType.SET_OUTPUT, [output, value]);
                        }
                        if (duration === 'c' || !Entry.parseNumber(duration)) {
                            script.exec_phase = ExecPhase.PENDING_STOP;
                            script.block_id = blockId;
                        } else {
                            script.exec_phase = ExecPhase.SET_TIMEOUT;
                        }
                    } else if (script.exec_phase === ExecPhase.SET_TIMEOUT) {
                        const duration = script.getStringValue('DURATION', script);
                        const durationValue = Entry.parseNumber(duration);
                        script.exec_phase = ExecPhase.WAIT_TIMEOUT;
                        setTimeout(function() {
                            script.exec_phase = ExecPhase.STOP;
                        }, durationValue * 1000);
                    } else if (script.exec_phase === ExecPhase.WAIT_TIMEOUT) {
                        return script;
                    } else if (script.exec_phase === ExecPhase.STOP) {
                        script.exec_phase = ExecPhase.PENDING_STOP;
                        const output = script.getStringValue('OUTPUT', script);
                        const blockId = this.generateBlockId();
                        script.block_id = blockId;
                        this.requestCommand(blockId, NeoBlockType.SET_OUTPUT, [output, 0]);
                    } else if (script.exec_phase === ExecPhase.PENDING_STOP) {
                        if (!this.pendingResponseList[script.block_id]) {
                            delete script.block_id;
                            delete script.exec_phase;
                            return script.callReturn();
                        }
                    }
                    return script;
                },
            },
            /**
             * 센서
             */
            neo_sensor_title: {
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
                        text: Lang.template.neo_sensor_title,
                        color: '#191970',
                        align: 'left',
                    },
                ],
                def: {
                    type: 'neo_sensor_title',
                },
                class: 'neo_sensor',
                isNotFor: ['neo'],
                events: {},
            },
            neo_sensor_in: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic_string_field',
                fontColor: '#fff',
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
                ],
                events: {},
                def: {
                    params: [null],
                    type: 'neo_sensor_in',
                },
                paramsKeyMap: {
                    INPUT: 0,
                },
                class: 'neo_sensor',
                isNotFor: ['neo'],
                func: (sprite, script) => {
                    const input = script.getStringField('INPUT');
                    const sensorData = Entry.hw.portData['sensor'];
                    switch (input) {
                        case 'IN1':
                            return sensorData['in1Values'][0];
                        case 'IN2':
                            return sensorData['in2Values'][0];
                        case 'IN3':
                            return sensorData['in3Values'][0];
                    }
                    return 0;
                },
            },
            neo_sensor_digital_in: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic_string_field',
                fontColor: '#fff',
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
                            [Lang.Blocks.neo_sensor_in_digital_1, 0],
                            [Lang.Blocks.neo_sensor_in_digital_2, 1],
                            [Lang.Blocks.neo_sensor_in_digital_3, 2],
                            [Lang.Blocks.neo_sensor_in_digital_4, 3],
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
                    type: 'neo_sensor_digital_in',
                },
                paramsKeyMap: {
                    INPUT: 0,
                    INDEX: 1,
                },
                class: 'neo_sensor',
                isNotFor: ['neo'],
                func: (sprite, script) => {
                    const input = script.getStringField('INPUT');
                    const index = script.getNumberField('INDEX');
                    const sensorData = Entry.hw.portData['sensor'];
                    switch (input) {
                        case 'IN1':
                            return sensorData['in1Values'][index];
                        case 'IN2':
                            return sensorData['in2Values'][index];
                        case 'IN3':
                            return sensorData['in3Values'][index];
                    }
                    return 0;
                },
            },
            neo_sensor_convert: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic_string_field',
                fontColor: '#fff',
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
                            params: ['10'],
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
                    type: 'neo_sensor_convert',
                },
                paramsKeyMap: {
                    INPUT: 0,
                    FROM_MIN: 1,
                    FROM_MAX: 2,
                    TO_MIN: 3,
                    TO_MAX: 4,
                },
                class: 'neo_sensor',
                isNotFor: ['neo'],
                func: (sprite, script) => {
                    const input = script.getStringField('INPUT');
                    const sensorData = Entry.hw.portData['sensor'];
                    let value = 0;
                    switch (input) {
                        case 'IN1':
                            value = sensorData['in1Values'][0];
                            break;
                        case 'IN2':
                            value = sensorData['in2Values'][0];
                            break;
                        case 'IN3':
                            value = sensorData['in3Values'][0];
                            break;
                    }
                    let fromMin = script.getNumberValue('FROM_MIN', script);
                    let fromMax = script.getNumberValue('FROM_MAX', script);
                    let toMin = script.getNumberValue('TO_MIN', script);
                    let toMax = script.getNumberValue('TO_MAX', script);

                    if (fromMin > fromMax) {
                        const temp = fromMin;
                        fromMin = fromMax;
                        fromMax = temp;
                    }

                    if (toMin > toMax) {
                        const temp = toMin;
                        toMin = toMax;
                        toMax = temp;
                    }

                    value -= fromMin;
                    value = value * ((toMax - toMin) / (fromMax - fromMin));
                    value += toMin;
                    value = Math.min(toMax, value);
                    value = Math.max(toMin, value);

                    return Math.round(value);
                },
            },
            neo_sensor_compare: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                fontColor: '#ffffff',
                skeleton: 'basic_boolean_field',
                statements: [],
                params: [
                    {
                        type: 'Dropdown',
                        options: [
                            [Lang.Blocks.neo_input_1, 'IN1'],
                            [Lang.Blocks.neo_input_2, 'IN2'],
                            [Lang.Blocks.neo_input_3, 'IN3'],
                            [Lang.Blocks.neo_input_12, 'IN12'],
                            [Lang.Blocks.neo_input_123, 'IN123'],
                        ],
                        value: 'IN1',
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                    {
                        type: 'Dropdown',
                        options: [
                            [Lang.Blocks.neo_compare_gt, '>='],
                            [Lang.Blocks.neo_compare_g, '>'],
                            [Lang.Blocks.neo_compare_e, '='],
                            [Lang.Blocks.neo_compare_l, '<'],
                            [Lang.Blocks.neo_compare_lt, '<='],
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
                    type: 'neo_sensor_compare',
                },
                paramsKeyMap: {
                    INPUT: 0,
                    SYMBOL: 1,
                    VALUE: 2,
                },
                class: 'neo_sensor',
                isNotFor: ['neo'],
                func: (sprite, script) => {
                    const input = script.getStringField('INPUT');
                    const sensorData = Entry.hw.portData['sensor'];
                    const symbol = script.getStringField('SYMBOL');
                    const value = Entry.parseNumber(script.getStringValue('VALUE'));

                    if (input === 'IN12') {
                        const sensor1 = sensorData['in1Values'][0];
                        const sensor2 = sensorData['in2Values'][0];
                        if (symbol === '=') {
                            return sensor1 === value && sensor2 === value;
                        } else if (symbol === '>') {
                            return sensor1 > value && sensor2 > value;
                        } else if (symbol === '<') {
                            return sensor1 < value && sensor2 < value;
                        } else if (symbol === '>=') {
                            return sensor1 >= value && sensor2 >= value;
                        } else if (symbol === '<=') {
                            return sensor1 <= value && sensor2 <= value;
                        }
                    } else if (input === 'IN123') {
                        const sensor1 = sensorData['in1Values'][0];
                        const sensor2 = sensorData['in2Values'][0];
                        const sensor3 = sensorData['in3Values'][0];
                        if (symbol === '=') {
                            return sensor1 === value && sensor2 === value && sensor3 === value;
                        } else if (symbol === '>') {
                            return sensor1 > value && sensor2 > value && sensor3 > value;
                        } else if (symbol === '<') {
                            return sensor1 < value && sensor2 < value && sensor3 < value;
                        } else if (symbol === '>=') {
                            return sensor1 >= value && sensor2 >= value && sensor3 >= value;
                        } else if (symbol === '<=') {
                            return sensor1 <= value && sensor2 <= value && sensor3 <= value;
                        }
                    } else {
                        let sensorValue = 0;
                        switch (input) {
                            case 'IN1':
                                sensorValue = sensorData['in1Values'][0];
                                break;
                            case 'IN2':
                                sensorValue = sensorData['in2Values'][0];
                                break;
                            case 'IN3':
                                sensorValue = sensorData['in3Values'][0];
                                break;
                        }
                        if (symbol === '=') {
                            return sensorValue === value;
                        } else if (symbol === '>') {
                            return sensorValue > value;
                        } else if (symbol === '<') {
                            return sensorValue < value;
                        } else if (symbol === '>=') {
                            return sensorValue >= value;
                        } else if (symbol === '<=') {
                            return sensorValue <= value;
                        }
                    }
                    return false;
                },
            },
            neo_sensor_between: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                fontColor: '#ffffff',
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
                            [Lang.Blocks.neo_compare_gt, '>='],
                            [Lang.Blocks.neo_compare_g, '>'],
                            [Lang.Blocks.neo_compare_e, '='],
                            [Lang.Blocks.neo_compare_l, '<'],
                            [Lang.Blocks.neo_compare_lt, '<='],
                        ],
                        value: '<',
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                    {
                        type: 'Dropdown',
                        options: [
                            [Lang.Blocks.neo_input_1, 'IN1'],
                            [Lang.Blocks.neo_input_2, 'IN2'],
                            [Lang.Blocks.neo_input_3, 'IN3'],
                            [Lang.Blocks.neo_input_12, 'IN12'],
                            [Lang.Blocks.neo_input_123, 'IN123'],
                        ],
                        value: 'IN1',
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                    {
                        type: 'Dropdown',
                        options: [
                            [Lang.Blocks.neo_compare_gt, '>='],
                            [Lang.Blocks.neo_compare_g, '>'],
                            [Lang.Blocks.neo_compare_e, '='],
                            [Lang.Blocks.neo_compare_l, '<'],
                            [Lang.Blocks.neo_compare_lt, '<='],
                        ],
                        value: '<',
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
                    params: [10, null, null, null, 30],
                    type: 'neo_sensor_between',
                },
                paramsKeyMap: {
                    L_VALUE: 0,
                    L_SYMBOL: 1,
                    INPUT: 2,
                    R_SYMBOL: 3,
                    R_VALUE: 4,
                },
                class: 'neo_sensor',
                isNotFor: ['neo'],
                func: (sprite, script) => {
                    const input = script.getStringField('INPUT');
                    const sensorData = Entry.hw.portData['sensor'];
                    const lSymbol = script.getStringField('L_SYMBOL');
                    const lValue = Entry.parseNumber(script.getStringValue('L_VALUE'));
                    const rSymbol = script.getStringField('R_SYMBOL');
                    const rValue = Entry.parseNumber(script.getStringValue('R_VALUE'));

                    if (input === 'IN12') {
                        const sensor1 = sensorData['in1Values'][0];
                        const sensor2 = sensorData['in2Values'][0];
                        let lResult = false;
                        if (lSymbol === '=') {
                            lResult = lValue === sensor1 && lValue === sensor2;
                        } else if (lSymbol === '>') {
                            lResult = lValue > sensor1 && lValue > sensor2;
                        } else if (lSymbol === '<') {
                            lResult = lValue < sensor1 && lValue < sensor2;
                        } else if (lSymbol === '>=') {
                            lResult = lValue >= sensor1 && lValue >= sensor2;
                        } else if (lSymbol === '<=') {
                            lResult = lValue <= sensor1 && lValue <= sensor2;
                        }
                        let rResult = false;
                        if (rSymbol === '=') {
                            rResult = sensor1 === rValue && sensor2 === rValue;
                        } else if (rSymbol === '>') {
                            rResult = sensor1 > rValue && sensor2 > rValue;
                        } else if (rSymbol === '<') {
                            rResult = sensor1 < rValue && sensor2 < rValue;
                        } else if (rSymbol === '>=') {
                            rResult = sensor1 >= rValue && sensor2 >= rValue;
                        } else if (rSymbol === '<=') {
                            rResult = sensor1 <= rValue && sensor2 <= rValue;
                        }
                        return lResult && rResult;
                    } else if (input === 'IN123') {
                        const sensor1 = sensorData['in1Values'][0];
                        const sensor2 = sensorData['in2Values'][0];
                        const sensor3 = sensorData['in3Values'][0];
                        let lResult = false;
                        if (lSymbol === '=') {
                            lResult = lValue === sensor1 && lValue === sensor2 && lValue === sensor3;
                        } else if (lSymbol === '>') {
                            lResult = lValue > sensor1 && lValue > sensor2 && lValue > sensor3;
                        } else if (lSymbol === '<') {
                            lResult = lValue < sensor1 && lValue < sensor2 && lValue < sensor3;
                        } else if (lSymbol === '>=') {
                            lResult = lValue >= sensor1 && lValue >= sensor2 && lValue >= sensor3;
                        } else if (lSymbol === '<=') {
                            lResult = lValue <= sensor1 && lValue <= sensor2 && lValue <= sensor3;
                        }
                        let rResult = false;
                        if (rSymbol === '=') {
                            rResult = sensor1 === rValue && sensor2 === rValue && sensor3 === rValue;
                        } else if (rSymbol === '>') {
                            rResult = sensor1 > rValue && sensor2 > rValue && sensor3 > rValue;
                        } else if (rSymbol === '<') {
                            rResult = sensor1 < rValue && sensor2 < rValue && sensor3 < rValue;
                        } else if (rSymbol === '>=') {
                            rResult = sensor1 >= rValue && sensor2 >= rValue && sensor3 >= rValue;
                        } else if (rSymbol === '<=') {
                            rResult = sensor1 <= rValue && sensor2 <= rValue && sensor3 <= rValue;
                        }
                        return lResult && rResult;
                    } else {
                        let sensorValue = 0;
                        switch (input) {
                            case 'IN1':
                                sensorValue = sensorData['in1Values'][0];
                                break;
                            case 'IN2':
                                sensorValue = sensorData['in2Values'][0];
                                break;
                            case 'IN3':
                                sensorValue = sensorData['in3Values'][0];
                                break;
                        }
                        let lResult = false;
                        if (lSymbol === '=') {
                            lResult = lValue === sensorValue;
                        } else if (lSymbol === '>') {
                            lResult = lValue > sensorValue;
                        } else if (lSymbol === '<') {
                            lResult = lValue < sensorValue;
                        } else if (lSymbol === '>=') {
                            lResult = lValue >= sensorValue;
                        } else if (lSymbol === '<=') {
                            lResult = lValue <= sensorValue;
                        }
                        let rResult = false;
                        if (rSymbol === '=') {
                            rResult = sensorValue === rValue;
                        } else if (rSymbol === '>') {
                            rResult = sensorValue > rValue;
                        } else if (rSymbol === '<') {
                            rResult = sensorValue < rValue;
                        } else if (rSymbol === '>=') {
                            rResult = sensorValue >= rValue;
                        } else if (rSymbol === '<=') {
                            rResult = sensorValue <= rValue;
                        }
                        return lResult && rResult;
                    }
                },
            },
            neo_sensor_color_compare: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                fontColor: '#ffffff',
                skeleton: 'basic_boolean_field',
                statements: [],
                params: [
                    {
                        type: 'Dropdown',
                        options: [
                            [Lang.Blocks.neo_input_1, 'IN1'],
                            [Lang.Blocks.neo_input_2, 'IN2'],
                            [Lang.Blocks.neo_input_3, 'IN3'],
                            [Lang.Blocks.neo_input_12, 'IN12'],
                            [Lang.Blocks.neo_input_123, 'IN123'],
                        ],
                        value: 'IN1',
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                    {
                        type: 'Dropdown',
                        options: [
                            [Lang.Blocks.neo_color_black, 1],
                            [Lang.Blocks.neo_color_white, 2],
                            [Lang.Blocks.neo_color_red, 3],
                            [Lang.Blocks.neo_color_yellow, 4],
                            [Lang.Blocks.neo_color_green, 5],
                            [Lang.Blocks.neo_color_blue, 6],
                        ],
                        value: '2',
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                ],
                events: {},
                def: {
                    params: [null, null],
                    type: 'neo_sensor_color_compare',
                },
                paramsKeyMap: {
                    INPUT: 0,
                    COLOR: 1,
                },
                class: 'neo_sensor',
                isNotFor: ['neo'],
                func: (sprite, script) => {
                    const input = script.getStringField('INPUT');
                    const sensorData = Entry.hw.portData['sensor'];
                    const color = script.getNumberField('COLOR');
                    let sensorValue = 0;
                    switch (input) {
                        case 'in1':
                            sensorValue = sensorData['in1Values'][0];
                            break;
                        case 'in2':
                            sensorValue = sensorData['in2Values'][0];
                            break;
                        case 'in3':
                            sensorValue = sensorData['in3Values'][0];
                            break;
                    }

                    if (color === 1) {
                        return sensorValue === 0;
                    } else if (color === 2) {
                        return sensorValue === 0;
                    } else if (color === 3) {
                        return sensorValue === 0;
                    } else if (color === 4) {
                        return sensorValue === 0;
                    } else if (color === 5) {
                        return sensorValue === 0;
                    } else if (color === 6) {
                        return sensorValue === 0;
                    }
                    return false;
                },
            },
            neo_sensor_button_pressed: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                fontColor: '#FFFFFF',
                skeleton: 'basic_boolean_field',
                statements: [],
                params: [
                    {
                        type: 'Dropdown',
                        options: [
                            [Lang.Blocks.neo_button_1, '1'],
                            [Lang.Blocks.neo_button_2, '2'],
                            [Lang.Blocks.neo_button_3, '3'],
                            [Lang.Blocks.neo_button_4, '4'],
                        ],
                        value: '1',
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                    {
                        type: 'Dropdown',
                        options: [
                            [Lang.Blocks.neo_button_on, 'ON'],
                            [Lang.Blocks.neo_button_off, 'OFF'],
                        ],
                        value: 'on',
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                ],
                events: {},
                def: {
                    params: [null, null],
                    type: 'neo_sensor_button_pressed',
                },
                paramsKeyMap: {
                    BUTTON: 0,
                    PRESSED: 1,
                },
                class: 'neo_sensor',
                isNotFor: ['neo'],
                func: (sprite, script) => {
                    const button = script.getNumberField('BUTTON');
                    const pressed = script.getStringField('PRESSED');
                    const sensorData = Entry.hw.portData['sensor'];
                    const value = sensorData['IR'];
                    if (button === 1) {
                        if (pressed === 'ON') return value === 10;
                        else return value !== 10;
                    } else if (button === 2) {
                        if (pressed === 'ON') return value === 11;
                        else return value !== 11;
                    } else if (button === 3) {
                        if (pressed === 'ON') return value === 12;
                        else return value !== 12;
                    } else if (button === 4) {
                        if (pressed === 'ON') return value === 13;
                        else return value !== 13;
                    }
                },
            },
            /**
             * 버저
             */
            neo_buzzer_title: {
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
                        text: Lang.template.neo_buzzer_title,
                        color: '#191970',
                        align: 'left',
                    },
                ],
                def: {
                    type: 'neo_buzzer_title',
                },
                class: 'neo_buzzer',
                isNotFor: ['neo'],
                events: {},
            },
            neo_buzzer_start: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic',
                statements: [],
                params: [
                    {
                        type: 'Dropdown',
                        options: [
                            [Lang.Blocks.neo_buzzer_octave_1, '0'],
                            [Lang.Blocks.neo_buzzer_octave_2, '1'],
                            [Lang.Blocks.neo_buzzer_octave_3, '2'],
                            [Lang.Blocks.neo_buzzer_octave_4, '3'],
                            [Lang.Blocks.neo_buzzer_octave_5, '4'],
                            [Lang.Blocks.neo_buzzer_octave_6, '5'],
                        ],
                        value: '2',
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                    {
                        type: 'Dropdown',
                        options: [
                            [Lang.Blocks.neo_buzzer_do, '1'],
                            [Lang.Blocks.neo_buzzer_do_sharp, '2'],
                            [Lang.Blocks.neo_buzzer_re, '3'],
                            [Lang.Blocks.neo_buzzer_re_sharp, '4'],
                            [Lang.Blocks.neo_buzzer_mi, '5'],
                            [Lang.Blocks.neo_buzzer_fa, '6'],
                            [Lang.Blocks.neo_buzzer_fa_sharp, '7'],
                            [Lang.Blocks.neo_buzzer_sol, '8'],
                            [Lang.Blocks.neo_buzzer_sol_sharp, '9'],
                            [Lang.Blocks.neo_buzzer_la, '10'],
                            [Lang.Blocks.neo_buzzer_la_sharp, '11'],
                            [Lang.Blocks.neo_buzzer_ti, '12'],
                        ],
                        value: '1',
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },

                    {
                        type: 'Dropdown',
                        options: [
                            [Lang.Blocks.neo_buzzer_whole_note, '1'],
                            [Lang.Blocks.neo_buzzer_half_note, '2'],
                            [Lang.Blocks.neo_buzzer_quarter_note, '4'],
                            [Lang.Blocks.neo_buzzer_8th_note, '8'],
                        ],
                        value: '4',
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
                    type: 'neo_buzzer_start',
                },
                paramsKeyMap: {
                    OCTAVE: 0,
                    NOTE: 1,
                    DURATION: 2,
                },
                class: 'neo_buzzer',
                isNotFor: ['neo'],
                func: (sprite, script) => {
                    if (!script.exec_phase) {
                        const octave = script.getNumberField('OCTAVE', script);
                        const note = script.getNumberField('NOTE', script);
                        const value = Math.min(note + 12 * octave, 72);
                        const duration = script.getStringValue('DURATION', script);
                        const blockId = this.generateBlockId();
                        this.requestCommand(blockId, NeoBlockType.BUZZER_START, [value]);
                        script.exec_phase = ExecPhase.WAIT_TIMEOUT;
                        setTimeout(function() {
                            script.exec_phase = ExecPhase.STOP;
                        }, (1 / duration) * 2000);
                    } else if (script.exec_phase === ExecPhase.WAIT_TIMEOUT) {
                        return script;
                    } else if (script.exec_phase === ExecPhase.STOP) {
                        script.exec_phase = ExecPhase.PENDING_STOP;
                        const blockId = this.generateBlockId();
                        script.block_id = blockId;
                        this.requestCommand(blockId, NeoBlockType.BUZZER_STOP, []);
                    } else if (script.exec_phase === ExecPhase.PENDING_STOP) {
                        if (!this.pendingResponseList[script.block_id]) {
                            delete script.block_id;
                            delete script.exec_phase;
                            return script.callReturn();
                        }
                    }
                    return script;
                },
            },

            neo_buzzer_with_sensor: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic',
                statements: [],
                params: [
                    {
                        type: 'Dropdown',
                        options: [
                            [Lang.Blocks.neo_input_1, 'IN1'],
                            [Lang.Blocks.neo_input_2, 'IN2'],
                            [Lang.Blocks.neo_input_3, 'IN3'],
                        ],
                        value: 'IN1',
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
                    type: 'neo_buzzer_with_sensor',
                },
                paramsKeyMap: {
                    INPUT: 0,
                },
                class: 'neo_buzzer',
                isNotFor: ['neo'],
                func: (sprite, script) => {
                    if (!script.exec_phase) {
                        script.exec_phase = ExecPhase.PENDING_STOP;
                        const input = script.getStringValue('INPUT', script);
                        const blockId = this.generateBlockId();
                        script.block_id = blockId;
                        this.requestExtCommand(blockId, NeoBlockType.BUZZER_WITH_SENSOR, [input]);
                    } else if (script.exec_phase === ExecPhase.PENDING_STOP) {
                        if (!this.pendingResponseList[script.block_id]) {
                            delete script.block_id;
                            delete script.exec_phase;
                            return script.callReturn();
                        }
                    }
                    return script;
                },
            },

            neo_buzzer_stop: {
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
                    type: 'neo_buzzer_stop',
                },
                paramsKeyMap: {},
                class: 'neo_buzzer',
                isNotFor: ['neo'],
                func: (sprite, script) => {
                    if (!script.exec_phase) {
                        script.exec_phase = ExecPhase.PENDING_STOP;
                        const blockId = this.generateBlockId();
                        script.block_id = blockId;
                        this.requestCommand(blockId, NeoBlockType.BUZZER_STOP, []);
                    } else if (script.exec_phase === ExecPhase.PENDING_STOP) {
                        if (!this.pendingResponseList[script.block_id]) {
                            delete script.block_id;
                            delete script.exec_phase;
                            return script.callReturn();
                        }
                    }
                    return script;
                },
            },
            /**
             * LCD
             */
            neo_lcd_title: {
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
                        text: Lang.template.neo_lcd_title,
                        color: '#191970',
                        align: 'left',
                    },
                ],
                def: {
                    type: 'neo_lcd_title',
                },
                class: 'neo_lcd',
                isNotFor: ['neo'],
                events: {},
            },
            neo_lcd_image: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic',
                statements: [],
                params: [
                    {
                        type: 'Dropdown',
                        options: [
                            [Lang.Blocks.neo_output_1, 'OUT1'],
                            [Lang.Blocks.neo_output_2, 'OUT2'],
                            [Lang.Blocks.neo_output_3, 'OUT3'],
                        ],
                        value: 'OUT1',
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                    {
                        type: 'Dropdown',
                        options: [
                            [Lang.Blocks.neo_lcd_image_1, '1'],
                            [Lang.Blocks.neo_lcd_image_2, '2'],
                            [Lang.Blocks.neo_lcd_image_3, '3'],
                            [Lang.Blocks.neo_lcd_image_4, '4'],
                            [Lang.Blocks.neo_lcd_image_5, '5'],
                            [Lang.Blocks.neo_lcd_image_6, '6'],
                            [Lang.Blocks.neo_lcd_image_7, '7'],
                            [Lang.Blocks.neo_lcd_image_8, '8'],
                            [Lang.Blocks.neo_lcd_image_9, '9'],
                            [Lang.Blocks.neo_lcd_image_10, '10'],
                            [Lang.Blocks.neo_lcd_image_11, '11'],
                            [Lang.Blocks.neo_lcd_image_12, '12'],
                            [Lang.Blocks.neo_lcd_image_13, '13'],
                            [Lang.Blocks.neo_lcd_image_14, '14'],
                            [Lang.Blocks.neo_lcd_image_15, '15'],
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
                    params: [null, null, null],
                    type: 'neo_lcd_image',
                },
                paramsKeyMap: {
                    OUTPUT: 0,
                    IMAGE: 1,
                },
                class: 'neo_lcd',
                isNotFor: ['neo'],
                func: (sprite, script) => {
                    if (!script.exec_phase) {
                        script.exec_phase = ExecPhase.PENDING_RESPONSE;
                        const output = script.getStringValue('OUTPUT', script);
                        const image = script.getStringValue('IMAGE', script);
                        const blockId = this.generateBlockId();
                        script.block_id = blockId;
                        this.requestCommand(blockId, NeoBlockType.LCD_IMAGE, [output, image]);
                    } else if (script.exec_phase === ExecPhase.PENDING_RESPONSE) {
                        if (!this.pendingResponseList[script.block_id]) {
                            delete script.block_id;
                            delete script.exec_phase;
                            return script.callReturn();
                        }
                    }
                    return script;
                },
            },

            neo_lcd_text: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic',
                statements: [],
                params: [
                    {
                        type: 'Dropdown',
                        options: [
                            [Lang.Blocks.neo_output_1, 'OUT1'],
                            [Lang.Blocks.neo_output_2, 'OUT2'],
                            [Lang.Blocks.neo_output_3, 'OUT3'],
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
                    params: [null, 'NEO', null],
                    type: 'neo_lcd_text',
                },
                paramsKeyMap: {
                    OUTPUT: 0,
                    TEXT: 1,
                },
                class: 'neo_lcd',
                isNotFor: ['neo'],
                func: (sprite, script) => {
                    if (!script.exec_phase) {
                        script.exec_phase = ExecPhase.PENDING_RESPONSE;
                        const output = script.getStringValue('OUTPUT', script);
                        const text = script.getStringValue('TEXT', script);
                        const blockId = this.generateBlockId();
                        script.block_id = blockId;
                        this.requestCommand(blockId, NeoBlockType.LCD_TEXT, [output, text]);
                    } else if (script.exec_phase === ExecPhase.PENDING_RESPONSE) {
                        if (!this.pendingResponseList[script.block_id]) {
                            delete script.block_id;
                            delete script.exec_phase;
                            return script.callReturn();
                        }
                    }
                    return script;
                },
            },
            /**
             * ARG Blocks
             */
            neo_arg_motor_speed: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic_string_field',
                statements: [],
                params: [
                    {
                        type: 'Dropdown',
                        options: [
                            [Lang.Blocks.neo_motor_speed_100, '100'],
                            [Lang.Blocks.neo_motor_speed_90, '90'],
                            [Lang.Blocks.neo_motor_speed_80, '80'],
                            [Lang.Blocks.neo_motor_speed_70, '70'],
                            [Lang.Blocks.neo_motor_speed_60, '60'],
                            [Lang.Blocks.neo_motor_speed_50, '50'],
                            [Lang.Blocks.neo_motor_speed_40, '40'],
                            [Lang.Blocks.neo_motor_speed_30, '30'],
                            [Lang.Blocks.neo_motor_speed_20, '20'],
                            [Lang.Blocks.neo_motor_speed_10, '10'],
                            [Lang.Blocks.neo_motor_speed_0, '0'],
                            [Lang.Blocks.neo_motor_speed_n10, '-10'],
                            [Lang.Blocks.neo_motor_speed_n20, '-20'],
                            [Lang.Blocks.neo_motor_speed_n30, '-30'],
                            [Lang.Blocks.neo_motor_speed_n40, '-40'],
                            [Lang.Blocks.neo_motor_speed_n50, '-50'],
                            [Lang.Blocks.neo_motor_speed_n60, '-60'],
                            [Lang.Blocks.neo_motor_speed_n70, '-70'],
                            [Lang.Blocks.neo_motor_speed_n80, '-80'],
                            [Lang.Blocks.neo_motor_speed_n90, '-90'],
                            [Lang.Blocks.neo_motor_speed_n100, '-100'],
                        ],
                        value: '100',
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
                class: 'neo_arg',
                isNotFor: ['neo'],
                func: function(sprite, script) {
                    return script.getStringField('VALUE');
                },
            },
            neo_arg_duration: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic_string_field',
                statements: [],
                params: [
                    {
                        type: 'Dropdown',
                        options: [
                            [Lang.Blocks.neo_duration_c, 'c'],
                            [Lang.Blocks.neo_duration_0, '0'],
                            [Lang.Blocks.neo_duration_1, '1'],
                            [Lang.Blocks.neo_duration_2, '2'],
                            [Lang.Blocks.neo_duration_3, '3'],
                            [Lang.Blocks.neo_duration_4, '4'],
                            [Lang.Blocks.neo_duration_5, '5'],
                            [Lang.Blocks.neo_duration_6, '6'],
                            [Lang.Blocks.neo_duration_7, '7'],
                            [Lang.Blocks.neo_duration_8, '8'],
                            [Lang.Blocks.neo_duration_9, '9'],
                        ],
                        value: 'c',
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
                class: 'neo_arg',
                isNotFor: ['neo'],
                func: function(sprite, script) {
                    return script.getStringField('VALUE');
                },
            },
            neo_arg_robot_speed: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic_string_field',
                statements: [],
                params: [
                    {
                        type: 'Dropdown',
                        options: [
                            [Lang.Blocks.neo_motor_speed_100, '100'],
                            [Lang.Blocks.neo_motor_speed_90, '90'],
                            [Lang.Blocks.neo_motor_speed_80, '80'],
                            [Lang.Blocks.neo_motor_speed_70, '70'],
                            [Lang.Blocks.neo_motor_speed_60, '60'],
                            [Lang.Blocks.neo_motor_speed_50, '50'],
                            [Lang.Blocks.neo_motor_speed_40, '40'],
                            [Lang.Blocks.neo_motor_speed_30, '30'],
                            [Lang.Blocks.neo_motor_speed_20, '20'],
                            [Lang.Blocks.neo_motor_speed_10, '10'],
                            [Lang.Blocks.neo_motor_speed_0, '0'],
                        ],
                        value: '100',
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
                class: 'neo_arg',
                isNotFor: ['neo'],
                func: function(sprite, script) {
                    return script.getStringField('VALUE');
                },
            },
            neo_arg_servo_angle: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic_string_field',
                statements: [],
                params: [
                    {
                        type: 'Dropdown',
                        options: [
                            [Lang.Blocks.neo_servo_angle_360, '360'],
                            [Lang.Blocks.neo_servo_angle_350, '350'],
                            [Lang.Blocks.neo_servo_angle_340, '340'],
                            [Lang.Blocks.neo_servo_angle_330, '330'],
                            [Lang.Blocks.neo_servo_angle_320, '320'],
                            [Lang.Blocks.neo_servo_angle_310, '310'],
                            [Lang.Blocks.neo_servo_angle_300, '300'],
                            [Lang.Blocks.neo_servo_angle_290, '290'],
                            [Lang.Blocks.neo_servo_angle_280, '280'],
                            [Lang.Blocks.neo_servo_angle_270, '270'],
                            [Lang.Blocks.neo_servo_angle_260, '260'],
                            [Lang.Blocks.neo_servo_angle_250, '250'],
                            [Lang.Blocks.neo_servo_angle_240, '240'],
                            [Lang.Blocks.neo_servo_angle_230, '230'],
                            [Lang.Blocks.neo_servo_angle_220, '220'],
                            [Lang.Blocks.neo_servo_angle_210, '210'],
                            [Lang.Blocks.neo_servo_angle_200, '200'],
                            [Lang.Blocks.neo_servo_angle_190, '190'],
                            [Lang.Blocks.neo_servo_angle_180, '180'],
                            [Lang.Blocks.neo_servo_angle_170, '170'],
                            [Lang.Blocks.neo_servo_angle_160, '160'],
                            [Lang.Blocks.neo_servo_angle_150, '150'],
                            [Lang.Blocks.neo_servo_angle_140, '140'],
                            [Lang.Blocks.neo_servo_angle_130, '130'],
                            [Lang.Blocks.neo_servo_angle_120, '120'],
                            [Lang.Blocks.neo_servo_angle_110, '110'],
                            [Lang.Blocks.neo_servo_angle_100, '100'],
                            [Lang.Blocks.neo_servo_angle_90, '90'],
                            [Lang.Blocks.neo_servo_angle_80, '80'],
                            [Lang.Blocks.neo_servo_angle_70, '70'],
                            [Lang.Blocks.neo_servo_angle_60, '60'],
                            [Lang.Blocks.neo_servo_angle_50, '50'],
                            [Lang.Blocks.neo_servo_angle_40, '40'],
                            [Lang.Blocks.neo_servo_angle_30, '30'],
                            [Lang.Blocks.neo_servo_angle_20, '20'],
                            [Lang.Blocks.neo_servo_angle_10, '10'],
                            [Lang.Blocks.neo_servo_angle_0, '0'],
                            [Lang.Blocks.neo_servo_angle_n10, '-10'],
                            [Lang.Blocks.neo_servo_angle_n20, '-20'],
                            [Lang.Blocks.neo_servo_angle_n30, '-30'],
                            [Lang.Blocks.neo_servo_angle_n40, '-40'],
                            [Lang.Blocks.neo_servo_angle_n50, '-50'],
                            [Lang.Blocks.neo_servo_angle_n60, '-60'],
                            [Lang.Blocks.neo_servo_angle_n70, '-70'],
                            [Lang.Blocks.neo_servo_angle_n80, '-80'],
                            [Lang.Blocks.neo_servo_angle_n90, '-90'],
                            [Lang.Blocks.neo_servo_angle_n100, '-100'],
                            [Lang.Blocks.neo_servo_angle_n110, '-110'],
                            [Lang.Blocks.neo_servo_angle_n120, '-120'],
                            [Lang.Blocks.neo_servo_angle_n130, '-130'],
                            [Lang.Blocks.neo_servo_angle_n140, '-140'],
                            [Lang.Blocks.neo_servo_angle_n150, '-150'],
                            [Lang.Blocks.neo_servo_angle_n160, '-160'],
                            [Lang.Blocks.neo_servo_angle_n170, '-170'],
                            [Lang.Blocks.neo_servo_angle_n180, '-180'],
                            [Lang.Blocks.neo_servo_angle_n190, '-190'],
                            [Lang.Blocks.neo_servo_angle_n200, '-200'],
                            [Lang.Blocks.neo_servo_angle_n210, '-210'],
                            [Lang.Blocks.neo_servo_angle_n220, '-220'],
                            [Lang.Blocks.neo_servo_angle_n230, '-230'],
                            [Lang.Blocks.neo_servo_angle_n240, '-240'],
                            [Lang.Blocks.neo_servo_angle_n250, '-250'],
                            [Lang.Blocks.neo_servo_angle_n260, '-260'],
                            [Lang.Blocks.neo_servo_angle_n270, '-270'],
                            [Lang.Blocks.neo_servo_angle_n280, '-280'],
                            [Lang.Blocks.neo_servo_angle_n290, '-290'],
                            [Lang.Blocks.neo_servo_angle_n300, '-300'],
                            [Lang.Blocks.neo_servo_angle_n310, '-310'],
                            [Lang.Blocks.neo_servo_angle_n320, '-320'],
                            [Lang.Blocks.neo_servo_angle_n330, '-330'],
                            [Lang.Blocks.neo_servo_angle_n340, '-340'],
                            [Lang.Blocks.neo_servo_angle_n350, '-350'],
                            [Lang.Blocks.neo_servo_angle_n360, '-360'],
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
                class: 'neo_arg',
                isNotFor: ['neo'],
                func: function(sprite, script) {
                    return script.getStringField('VALUE');
                },
            },
            neo_arg_servo_speed: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic_string_field',
                statements: [],
                params: [
                    {
                        type: 'Dropdown',
                        options: [
                            [Lang.Blocks.neo_motor_speed_100, '100'],
                            [Lang.Blocks.neo_motor_speed_90, '90'],
                            [Lang.Blocks.neo_motor_speed_80, '80'],
                            [Lang.Blocks.neo_motor_speed_70, '70'],
                            [Lang.Blocks.neo_motor_speed_60, '60'],
                            [Lang.Blocks.neo_motor_speed_50, '50'],
                            [Lang.Blocks.neo_motor_speed_40, '40'],
                            [Lang.Blocks.neo_motor_speed_30, '30'],
                            [Lang.Blocks.neo_motor_speed_20, '20'],
                            [Lang.Blocks.neo_motor_speed_10, '10'],
                            [Lang.Blocks.neo_motor_speed_0, '0'],
                        ],
                        value: '50',
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
                class: 'neo_arg',
                isNotFor: ['neo'],
                func: function(sprite, script) {
                    return script.getStringField('VALUE');
                },
            },
            neo_arg_auto_driving_speed: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic_string_field',
                statements: [],
                params: [
                    {
                        type: 'Dropdown',
                        options: [
                            [Lang.Blocks.neo_motor_speed_100, '100'],
                            [Lang.Blocks.neo_motor_speed_90, '90'],
                            [Lang.Blocks.neo_motor_speed_80, '80'],
                            [Lang.Blocks.neo_motor_speed_70, '70'],
                            [Lang.Blocks.neo_motor_speed_60, '60'],
                            [Lang.Blocks.neo_motor_speed_50, '50'],
                            [Lang.Blocks.neo_motor_speed_40, '40'],
                            [Lang.Blocks.neo_motor_speed_30, '30'],
                            [Lang.Blocks.neo_motor_speed_20, '20'],
                            [Lang.Blocks.neo_motor_speed_10, '10'],
                            [Lang.Blocks.neo_motor_speed_0, '0'],
                            [Lang.Blocks.neo_input_3, 'IN3'],
                        ],
                        value: '60',
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
                class: 'neo_arg',
                isNotFor: ['neo'],
                func: function(sprite, script) {
                    return script.getStringField('VALUE');
                },
            },
            neo_arg_led_brightness: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic_string_field',
                statements: [],
                params: [
                    {
                        type: 'Dropdown',
                        options: [
                            [Lang.Blocks.neo_led_brightness_100, '100'],
                            [Lang.Blocks.neo_led_brightness_90, '90'],
                            [Lang.Blocks.neo_led_brightness_80, '80'],
                            [Lang.Blocks.neo_led_brightness_70, '70'],
                            [Lang.Blocks.neo_led_brightness_60, '60'],
                            [Lang.Blocks.neo_led_brightness_50, '50'],
                            [Lang.Blocks.neo_led_brightness_40, '40'],
                            [Lang.Blocks.neo_led_brightness_30, '30'],
                            [Lang.Blocks.neo_led_brightness_20, '20'],
                            [Lang.Blocks.neo_led_brightness_10, '10'],
                            [Lang.Blocks.neo_led_brightness_0, '0'],
                        ],
                        value: '100',
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
                class: 'neo_arg',
                isNotFor: ['neo'],
                func: function(sprite, script) {
                    return script.getStringField('VALUE');
                },
            },
            neo_arg_led_blink_speed: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic_string_field',
                statements: [],
                params: [
                    {
                        type: 'Dropdown',
                        options: [
                            [Lang.Blocks.neo_led_blink_speed_1, '1'],
                            [Lang.Blocks.neo_led_blink_speed_2, '2'],
                            [Lang.Blocks.neo_led_blink_speed_3, '3'],
                            [Lang.Blocks.neo_led_blink_speed_4, '4'],
                            [Lang.Blocks.neo_led_blink_speed_5, '5'],
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
                class: 'neo_arg',
                isNotFor: ['neo'],
                func: function(sprite, script) {
                    return script.getStringField('VALUE');
                },
            },
            neo_arg_set_output_value: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic_string_field',
                statements: [],
                params: [
                    {
                        type: 'Dropdown',
                        options: [
                            [Lang.Blocks.neo_set_output_value_255, '255'],
                            [Lang.Blocks.neo_set_output_value_250, '250'],
                            [Lang.Blocks.neo_set_output_value_245, '245'],
                            [Lang.Blocks.neo_set_output_value_240, '240'],
                            [Lang.Blocks.neo_set_output_value_235, '235'],
                            [Lang.Blocks.neo_set_output_value_230, '230'],
                            [Lang.Blocks.neo_set_output_value_225, '225'],
                            [Lang.Blocks.neo_set_output_value_220, '220'],
                            [Lang.Blocks.neo_set_output_value_215, '215'],
                            [Lang.Blocks.neo_set_output_value_210, '210'],
                            [Lang.Blocks.neo_set_output_value_205, '205'],
                            [Lang.Blocks.neo_set_output_value_200, '200'],
                            [Lang.Blocks.neo_set_output_value_195, '195'],
                            [Lang.Blocks.neo_set_output_value_190, '190'],
                            [Lang.Blocks.neo_set_output_value_185, '185'],
                            [Lang.Blocks.neo_set_output_value_180, '180'],
                            [Lang.Blocks.neo_set_output_value_175, '175'],
                            [Lang.Blocks.neo_set_output_value_170, '170'],
                            [Lang.Blocks.neo_set_output_value_165, '165'],
                            [Lang.Blocks.neo_set_output_value_160, '160'],
                            [Lang.Blocks.neo_set_output_value_155, '155'],
                            [Lang.Blocks.neo_set_output_value_150, '150'],
                            [Lang.Blocks.neo_set_output_value_145, '145'],
                            [Lang.Blocks.neo_set_output_value_140, '140'],
                            [Lang.Blocks.neo_set_output_value_135, '135'],
                            [Lang.Blocks.neo_set_output_value_130, '130'],
                            [Lang.Blocks.neo_set_output_value_125, '125'],
                            [Lang.Blocks.neo_set_output_value_120, '120'],
                            [Lang.Blocks.neo_set_output_value_115, '115'],
                            [Lang.Blocks.neo_set_output_value_110, '110'],
                            [Lang.Blocks.neo_set_output_value_105, '105'],
                            [Lang.Blocks.neo_set_output_value_100, '100'],
                            [Lang.Blocks.neo_set_output_value_95, '95'],
                            [Lang.Blocks.neo_set_output_value_90, '90'],
                            [Lang.Blocks.neo_set_output_value_85, '85'],
                            [Lang.Blocks.neo_set_output_value_80, '80'],
                            [Lang.Blocks.neo_set_output_value_75, '75'],
                            [Lang.Blocks.neo_set_output_value_70, '70'],
                            [Lang.Blocks.neo_set_output_value_65, '65'],
                            [Lang.Blocks.neo_set_output_value_60, '60'],
                            [Lang.Blocks.neo_set_output_value_55, '55'],
                            [Lang.Blocks.neo_set_output_value_50, '50'],
                            [Lang.Blocks.neo_set_output_value_45, '45'],
                            [Lang.Blocks.neo_set_output_value_40, '40'],
                            [Lang.Blocks.neo_set_output_value_35, '35'],
                            [Lang.Blocks.neo_set_output_value_30, '30'],
                            [Lang.Blocks.neo_set_output_value_25, '25'],
                            [Lang.Blocks.neo_set_output_value_20, '20'],
                            [Lang.Blocks.neo_set_output_value_15, '15'],
                            [Lang.Blocks.neo_set_output_value_10, '10'],
                            [Lang.Blocks.neo_set_output_value_5, '5'],
                            [Lang.Blocks.neo_set_output_value_0, '0'],
                        ],
                        value: '255',
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
                class: 'neo_arg',
                isNotFor: ['neo'],
                func: function(sprite, script) {
                    return script.getStringField('VALUE');
                },
            },
        };
    }

    getCheckSum(command) {
        let checkSum = 0;
        for (let i = 0; i < command.length; i++) {
            checkSum += command[i];
        }
        return checkSum & 255;
    }

    getUnitId(port) {
        switch (port) {
            case 'OUT1':
                return UnitId.CONTROLLER_OUT1;
            case 'OUT2':
                return UnitId.CONTROLLER_OUT2;
            case 'OUT3':
                return UnitId.CONTROLLER_OUT3;
            case 'OUT12':
                return UnitId.CONTROLLER_OUT12;
            case 'OUT123':
                return UnitId.CONTROLLER_OUT_ALL;
            case 'IN1':
                return UnitId.CONTROLLER_IN1;
            case 'IN2':
                return UnitId.CONTROLLER_IN2;
            case 'IN3':
                return UnitId.CONTROLLER_IN3;
        }
        return UnitId.CONTROLLER;
    }

    makePdu(command) {
        const pdu = [];
        pdu.push(...HEADER);
        pdu.push(command.length);
        pdu.push(...command);
        pdu.push(this.getCheckSum(command));
        return pdu;
    }

    requestCommand(blockId, type, params) {
        console.log(blockId + ' requested');
        if (this.pendingResponseList[blockId]) {
            delete this.pendingResponseList[blockId];
        }
        this.pendingResponseList[blockId] = 'executed';
        const command = this.makeCommand(blockId, type, params);
        if (!command) return;
        const pdu = this.makePdu(command);
        this.executeList[blockId] = {
            blockId,
            pdu,
        };
        Entry.hw.sendQueue.executeList = { ...this.executeList };
        Entry.hw.update();
    }

    requestExtCommand(blockId, type, params) {
        console.log(blockId + ' requested');
        if (this.pendingResponseList[blockId]) {
            delete this.pendingResponseList[blockId];
        }
        this.pendingResponseList[blockId] = 'executed';
        const command = this.makeCommandExt(blockId, type, params);
        if (!command) return;
        const pdu = this.makePdu(command);
        this.executeList[blockId] = {
            blockId,
            pdu,
        };
        Entry.hw.sendQueue.executeList = { ...this.executeList };
        Entry.hw.update();
    }

    makeCommand(blockId, type, params) {
        //const body = [FrameCode.BASIC, PduCode.ACTION_COMMAND, PduType.REQUEST];
        const body = [FrameCode.BASIC, PduCode.BASIC, blockId];
        if (type === NeoBlockType.MOTOR_MOVE) {
            const which = params[0];
            const speed = Math.abs(params[1]);
            const direction = params[1] < 0 ? 1 : 0;
            body.push(UnitId.CONTROLLER, ActorKind.CONTROLLER, ControllerCommand.MOTOR);
            const data = Buffer.from([0, 0, 0, 0, 0, 0]);
            data.writeInt16LE(speed, 0);
            data.writeInt16LE(which, 2);
            data.writeInt16LE(direction, 4);
            body.push(...data);
        } else if (type === NeoBlockType.MOTOR_MOVE_BOTH) {
            const speedL = params[0];
            const speedR = params[1];
            body.push(UnitId.CONTROLLER, ActorKind.CONTROLLER, ControllerCommand.MOTOR_BOTH);
            const data = Buffer.from([0, 0, 0, 0]);
            data.writeInt16LE(speedL, 0);
            data.writeInt16LE(speedR, 2);
            body.push(...data);
        } else if (type === NeoBlockType.ROBOT_MOVE) {
            const robotCommand = params[0];
            const speed = params[1];
            body.push(UnitId.CONTROLLER, ActorKind.CONTROLLER, ControllerCommand.ROBOT);
            const data = Buffer.from([0, 0, 0, 0]);
            data.writeInt16LE(speed, 0);
            data.writeInt16LE(robotCommand, 2);
            body.push(...data);
        } else if (type === NeoBlockType.MOTOR_STOP || type === NeoBlockType.AUTO_DRIVING_STOP) {
            const which = params[0];
            const direction = 1;
            body.push(UnitId.CONTROLLER, ActorKind.CONTROLLER, ControllerCommand.MOTOR);
            const data = Buffer.from([0, 0, 0, 0, 0, 0]);
            data.writeInt16LE(which, 2);
            data.writeInt16LE(direction, 4);
            body.push(...data);
        } else if (type === NeoBlockType.ROBOT_STOP) {
            body.push(UnitId.CONTROLLER, ActorKind.CONTROLLER, ControllerCommand.ROBOT);
            const data = Buffer.from([0, 0, 0, 0]);
            body.push(...data);
        } else if (type === NeoBlockType.SERVO_RESET) {
            const output = params[0];
            body.push(this.getUnitId(output), ActorKind.SERVO, ServoCommand.RESET);
            const data = Buffer.from([0, 0]);
            body.push(...data);
        } else if (type === NeoBlockType.SERVO_ANGLE) {
            const output = params[0];
            const angle = params[1];
            const speed = params[2];
            body.push(this.getUnitId(output), ActorKind.SERVO, ServoCommand.ANGLE);
            const data = Buffer.from([0, 0, 0, 0, 1, 0]);
            data.writeInt16LE(angle, 0);
            data.writeInt16LE(speed, 2);
            body.push(...data);
        } else if (type === NeoBlockType.SERVO_ANGLE_WAIT) {
            const output = params[0];
            const angle = params[1];
            const speed = params[2];
            body.push(this.getUnitId(output), ActorKind.SERVO, ServoCommand.ANGLE_WAIT);
            const data = Buffer.from([0, 0, 0, 0, 1, 0]);
            data.writeInt16LE(angle, 0);
            data.writeInt16LE(speed, 2);
            body.push(...data);
        } else if (type === NeoBlockType.SERVO_ROTATE) {
            const output = params[0];
            const direction = params[1];
            const speed = params[2];
            body.push(this.getUnitId(output), ActorKind.SERVO, ServoCommand.ROTATE);
            const data = Buffer.from([0, 0, 0, 0]);
            data.writeInt16LE(speed, 0);
            data.writeInt16LE(direction, 2);
            body.push(...data);
        } else if (type === NeoBlockType.SERVO_STOP) {
            const output = params[0];
            body.push(this.getUnitId(output), ActorKind.SERVO, ServoCommand.STOP);
        } else if (
            type === NeoBlockType.LINE_TRACER_START ||
            type === NeoBlockType.AUTO_DRIVING_START ||
            type === NeoBlockType.AUTO_DETECT_WALL_START
        ) {
            const speed = params[0];
            body.push(UnitId.CONTROLLER, ActorKind.CONTROLLER, ControllerCommand.ROBOT);
            const data = Buffer.from([0, 0, 0x10, 0]);
            data.writeInt16LE(speed, 0);
            body.push(...data);
        } else if (type === NeoBlockType.AUTO_DRIVING_SENSOR_START) {
            const sensor = params[0];
            const speed = params[1];
            body.push(UnitId.CONTROLLER, ActorKind.CONTROLLER, ControllerCommand.ROBOT);
            const data = Buffer.from([0, 0, 0, 0]);
            data.writeInt16LE(speed, 0);
            data.writeInt16LE(sensor, 2);
            body.push(...data);
        } else if (type === NeoBlockType.LINE_CROSS_MOVE) {
            const count = params[0];
            body.push(UnitId.CONTROLLER, ActorKind.CONTROLLER, ControllerCommand.LINE_TRACER);
            const data = Buffer.from([0, 0]);
            data.writeInt16LE(count, 0);
            body.push(...data);
        } else if (type === NeoBlockType.LINE_CROSS_TURN) {
            const direction = params[0];
            body.push(UnitId.CONTROLLER, ActorKind.CONTROLLER, ControllerCommand.LINE_TRACER);
            const data = Buffer.from([0, 0]);
            data.writeInt16LE(direction, 0);
            body.push(...data);
        } else if (type === NeoBlockType.AUTO_PARKING_START) {
            // TODO : which 누락
            const which = params[0];
            const direction = params[1];
            body.push(UnitId.CONTROLLER, ActorKind.CONTROLLER, ControllerCommand.AUTO_PARKING);
            const data = Buffer.from([0, 0]);
            data.writeInt16LE(direction, 0);
            body.push(...data);
        } else if (type === NeoBlockType.LINE_CHANGE_START) {
            const direction = params[0];
            body.push(UnitId.CONTROLLER, ActorKind.CONTROLLER, ControllerCommand.AUTO_DRIVING);
            const data = Buffer.from([0, 0, 0, 0]);
            data.writeInt16LE(60, 0);
            data.writeInt16LE(direction, 2);
            body.push(...data);
        } else if (type === NeoBlockType.LINE_CHANGE_TURN) {
            const direction = params[0];
            body.push(UnitId.CONTROLLER, ActorKind.CONTROLLER, ControllerCommand.AUTO_DRIVING);
            const data = Buffer.from([0, 0, 0, 0]);
            data.writeInt16LE(60, 0);
            data.writeInt16LE(direction, 2);
            body.push(...data);
        } else if (type === NeoBlockType.AUTO_DETECT_WALL_TURN) {
            const direction = params[0];
            body.push(UnitId.CONTROLLER, ActorKind.CONTROLLER, ControllerCommand.AUTO_DETECT_WALL);
            const data = Buffer.from([0, 0, 0, 0]);
            data.writeInt16LE(60, 0);
            data.writeInt16LE(direction, 2);
            body.push(...data);
        } else if (type === NeoBlockType.LED_ON) {
            const output = params[0];
            const brightness = params[1];
            body.push(this.getUnitId(output), ActorKind.LED, 0);
            const data = Buffer.from([0, 0, 0, 0]);
            data.writeInt16LE(brightness, 0);
            body.push(...data);
        } else if (type === NeoBlockType.LED_BLINK) {
            const output = params[0];
            const speed = params[1];
            const brightness = params[2];
            body.push(this.getUnitId(output), ActorKind.LED, 0);
            const data = Buffer.from([0, 0, 0, 0]);
            data.writeInt16LE(brightness, 0);
            data.writeInt16LE(speed, 2);
            body.push(...data);
        } else if (type === NeoBlockType.LED_OFF) {
            const output = params[0];
            body.push(this.getUnitId(output), ActorKind.LED, 0);
            const data = Buffer.from([0, 0, 0, 0]);
            body.push(...data);
        } else if (type === NeoBlockType.COLOR_LED_ON) {
            const output = params[0];
            body.push(this.getUnitId(output), ActorKind.COLOR_LED, LedCommand.ON);
            const data = Buffer.from([0, 0, 0, 0, 0, 0]);
            const color = params[1];
            if (color.length === 7 && color[0] === '#') {
                const r = color.substr(1, 2);
                const g = color.substr(3, 2);
                const b = color.substr(5, 2);
                data.writeInt16LE(parseInt(r, 16), 0);
                data.writeInt16LE(parseInt(g, 16), 2);
                data.writeInt16LE(parseInt(b, 16), 4);
            }
            body.push(...data);
        } else if (type === NeoBlockType.COLOR_LED_OFF) {
            const output = params[0];
            body.push(this.getUnitId(output), ActorKind.COLOR_LED, LedCommand.OFF);
        } else if (type === NeoBlockType.SET_OUTPUT) {
            const output = params[0];
            const value = params[1];
            body.push(this.getUnitId(output), ActorKind.LED, 0);
            const data = Buffer.from([0, 0, 0, 0]);
            data.writeInt16LE(value, 0);
            body.push(...data);
        } else if (type === NeoBlockType.BUZZER_START) {
            const value = params[0];
            body.push(UnitId.CONTROLLER, ActorKind.CONTROLLER, ControllerCommand.BUZZER);
            const data = Buffer.from([0, 0]);
            data.writeInt16LE(value, 0);
            body.push(...data);
        } else if (type === NeoBlockType.BUZZER_STOP) {
            const value = params[0];
            body.push(UnitId.CONTROLLER, ActorKind.CONTROLLER, ControllerCommand.BUZZER);
            const data = Buffer.from([0, 0]);
            body.push(...data);
        } else if (type === NeoBlockType.LCD_IMAGE) {
            const output = this.getUnitId(params[0]);
            const value = params[1];
            body.push(output, ActorKind.LCD, LcdCommand.IMAGE);
            const data = Buffer.from([value, 0]);
            body.push(...data);
        } else if (type === NeoBlockType.LCD_TEXT) {
            const output = this.getUnitId(params[0]);
            const value = params[1];
            body.push(output, ActorKind.LCD, LcdCommand.TEXT);
            body.push(0); // 글씨크기 : 지금 안됨.
            if (value.length > 0) {
                for (let idx = 0; idx < value.length; idx++) {
                    body.push(value.charCodeAt(idx));
                }
            }
        }
        return body;
    }

    makeCommandExt(blockId, type, params) {
        const body = [FrameCode.BASIC];
        if (type === NeoBlockType.MOTOR_MOVE) {
            const which = params[0];
            const unitId = this.getUnitId(params[1]);
            body.push(PduCode.EXTEND_1, blockId, UnitId.CONTROLLER, ActorKind.CONTROLLER, ControllerCommand.MOTOR);
            const data = Buffer.from([unitId, 0, which, 0, 0, 0]);
            body.push(...data);
        } else if (type === NeoBlockType.ROBOT_MOVE) {
            const robotCommand = params[0];
            const unitId = this.getUnitId(params[1]);
            body.push(PduCode.EXTEND_1, blockId, UnitId.CONTROLLER, ActorKind.CONTROLLER, ControllerCommand.ROBOT);
            const data = Buffer.from([unitId, 0, 0, 0]);
            data.writeInt16LE(robotCommand, 2);
            body.push(...data);
        } else if (type === NeoBlockType.SERVO_ANGLE || type === NeoBlockType.SERVO_ANGLE_WAIT) {
            const unitId = this.getUnitId(params[0]);
            const inUnitId = this.getUnitId(params[1]);
            const speed = params[2];
            body.push(PduCode.EXTEND_1, blockId, unitId, ActorKind.SERVO, ServoCommand.ANGLE);
            const data = Buffer.from([inUnitId, 0, 0, 0, 1, 0]);
            data.writeInt16LE(speed, 2);
            body.push(...data);
        } else if (type === NeoBlockType.SERVO_ROTATE) {
            const unitId = this.getUnitId(params[0]);
            const direction = params[1];
            const inUnitId = this.getUnitId(params[2]);
            body.push(PduCode.EXTEND_1, blockId, unitId, ActorKind.SERVO, ServoCommand.ROTATE);
            const data = Buffer.from([inUnitId, 0, 0, 0]);
            data.writeInt16LE(direction, 2);
            body.push(...data);
        } else if (
            type === NeoBlockType.LINE_TRACER_START ||
            type === NeoBlockType.AUTO_DRIVING_START ||
            type === NeoBlockType.AUTO_DETECT_WALL_START
        ) {
            const unitId = this.getUnitId(params[0]);
            body.push(PduCode.EXTEND_1, blockId, UnitId.CONTROLLER, ActorKind.CONTROLLER, ControllerCommand.ROBOT);
            const data = Buffer.from([unitId, 0, 0x10, 0]);
            body.push(...data);
        } else if (type === NeoBlockType.AUTO_DRIVING_SENSOR_START) {
            const sensor = params[0];
            const unitId = this.getUnitId(params[1]);
            body.push(PduCode.EXTEND_1, blockId, UnitId.CONTROLLER, ActorKind.CONTROLLER, ControllerCommand.ROBOT);
            const data = Buffer.from([0, 0, 0, 0]);
            data.writeInt16LE(unitId, 0);
            data.writeInt16LE(sensor, 2);
            body.push(...data);
        } else if (type === NeoBlockType.LED_ON) {
            const unitId = this.getUnitId(params[0]);
            const inUnitId = this.getUnitId(params[1]);
            body.push(PduCode.EXTEND_1, blockId, unitId, ActorKind.LED, 0);
            const data = Buffer.from([inUnitId, 0, 0, 0]);
            body.push(...data);
        } else if (type === NeoBlockType.SET_OUTPUT) {
            const unitId = this.getUnitId(params[0]);
            const inUnitId = this.getUnitId(params[1]);
            body.push(PduCode.EXTEND_1, blockId, unitId, ActorKind.LED, 0);
            const data = Buffer.from([inUnitId, 0, 0, 0]);
            body.push(...data);
        } else if (type === NeoBlockType.BUZZER_WITH_SENSOR) {
            const sensorUnitId = this.getUnitId(params[0]);
            body.push(PduCode.EXTEND_1, blockId, UnitId.CONTROLLER, ActorKind.CONTROLLER, ControllerCommand.BUZZER);
            const data = Buffer.from([0, 0]);
            data.writeInt16LE(sensorUnitId, 0);
            body.push(...data);
        } else if (type === NeoBlockType.COLOR_LED_ON_SENSOR) {
            const outUnitId = this.getUnitId(params[0]);
            const inUnitId = this.getUnitId(params[1]);
            body.push(PduCode.EXTEND_3, blockId, outUnitId, ActorKind.COLOR_LED, LedCommand.ON);
            const data = Buffer.from([inUnitId, 1, inUnitId, 2, inUnitId, 3]);
            body.push(...data);
        }
        return body;
    }

    /*
      후면주차 실행 (pending response 하지 않고 바로 다음 단계로 넘어감 : phase 가 너무 많아서 간소화)
      주석은 왼쪽 기준으로 오른쪽에서는 좌우만 바꿔준다.
     */
    runAutoParkingBackward(script) {
        const which = script.getNumberValue('WHICH', script);
        const sensorData = Entry.hw.portData['sensor'];
        console.log(script.exec_phase);
        if (!script.exec_phase) {
            // 1. 로봇 제자리 오른쪽 20%
            script.exec_phase = '2_wait';
            const blockId = this.generateBlockId();
            this.requestCommand(blockId, NeoBlockType.ROBOT_MOVE, [which === 1 ? 6 : 5, 20]);
            setTimeout(() => {
                script.exec_phase = '3_robot_stop';
            }, 3500);
        } else if (script.exec_phase === '2_wait') {
            // 2. 3.5초 기다리기
        } else if (script.exec_phase === '3_robot_stop') {
            // 3. 로봇 정지
            script.exec_phase = '4_robot_rotate';
            const blockId = this.generateBlockId();
            this.requestCommand(blockId, NeoBlockType.ROBOT_STOP);
        } else if (script.exec_phase === '4_robot_rotate') {
            // 4. 로봇 제자리 왼쪽 20%
            script.exec_phase = '5_wait_sensor';
            const blockId = this.generateBlockId();
            this.requestCommand(blockId, NeoBlockType.ROBOT_MOVE, [which === 1 ? 5 : 6, 20]);
        } else if (script.exec_phase === '5_wait_sensor') {
            // 5. IN2 40 초과 기다리기
            const compareValue = which === 1 ? sensorData.in2Values[0] : sensorData.in1Values[0];
            if (compareValue > 40) {
                script.exec_phase = '6_stop_robot';
            }
        } else if (script.exec_phase === '6_stop_robot') {
            // 6. 로봇 멈추기
            script.exec_phase = '7_wait';
            const blockId = this.generateBlockId();
            this.requestCommand(blockId, NeoBlockType.ROBOT_STOP);
            setTimeout(() => {
                script.exec_phase = '8_robot_back';
            }, 1000);
        } else if (script.exec_phase === '7_wait') {
            // 7. 1초 기다리기
        } else if (script.exec_phase === '8_robot_back') {
            // 8. 로봇 후진 20%
            script.exec_phase = '9_wait_sensor';
            const blockId = this.generateBlockId();
            this.requestCommand(blockId, NeoBlockType.ROBOT_MOVE, [2, 20]);
        } else if (script.exec_phase === '9_wait_sensor') {
            // 9. IN1 20초과 기다리기
            const compareValue = which === 1 ? sensorData.in1Values[0] : sensorData.in2Values[0];
            if (compareValue > 20) {
                script.exec_phase = '10_stop_robot';
            }
        } else if (script.exec_phase === '10_stop_robot') {
            // 10. 로봇 멈추기
            script.exec_phase = '11_wait';
            const blockId = this.generateBlockId();
            this.requestCommand(blockId, NeoBlockType.ROBOT_STOP);
            setTimeout(() => {
                script.exec_phase = '12_adjustment';
            }, 1000);
        } else if (script.exec_phase === '11_wait') {
            // 11. 1초 기다리기
        } else if (script.exec_phase === '12_adjustment') {
            // 12. IN2 가 IN1 보다 크면 [-20, 0] 아니면 [0, -20] , IN2 가 60보다 크면 break : 차체 조정시에는 좌우 구분 없음
            if (sensorData.in2Values[0] > sensorData.in1Values[0]) {
                if (script.adjust_direction !== 'left') {
                    script.adjust_direction = 'left';
                    const blockId = this.generateBlockId();
                    this.requestCommand(blockId, NeoBlockType.MOTOR_MOVE_BOTH, [-20, 0]);
                }
            } else {
                if (script.adjust_direction !== 'right') {
                    script.adjust_direction = 'right';
                    const blockId = this.generateBlockId();
                    this.requestCommand(blockId, NeoBlockType.MOTOR_MOVE_BOTH, [0, -20]);
                }
            }
            if (sensorData.in2Values[0] >= 60) {
                script.exec_phase = '13_stop_robot';
            }
        } else if (script.exec_phase === '13_stop_robot') {
            // 13. 로봇 멈추기
            script.exec_phase = '14_wait';
            const blockId = this.generateBlockId();
            this.requestCommand(blockId, NeoBlockType.ROBOT_STOP);
            setTimeout(() => {
                script.exec_phase = '15_robot_back';
            }, 1000);
        } else if (script.exec_phase === '14_wait') {
            // 14. 1초 기다리기
        } else if (script.exec_phase === '15_robot_back') {
            // 15. 로봇 후진 20%
            script.exec_phase = '16_wait';
            const blockId = this.generateBlockId();
            this.requestCommand(blockId, NeoBlockType.ROBOT_MOVE, [2, 20]);
            setTimeout(() => {
                script.exec_phase = '17_stop_robot';
            }, 2000);
        } else if (script.exec_phase === '16_wait') {
            // 16. 2초 기다리기
        } else if (script.exec_phase === '17_stop_robot') {
            // 17. 로봇 멈추기
            script.exec_phase = 'end';
            const blockId = this.generateBlockId();
            this.requestCommand(blockId, NeoBlockType.ROBOT_STOP);
        }
        //
        else if (script.exec_phase === 'end') {
            // 종료
            return script.callReturn();
        }

        return script;
    }

    runAutoParkingSide(script) {
        const which = script.getNumberValue('WHICH', script);
        const sensorData = Entry.hw.portData['sensor'];
        console.log(script.exec_phase);
        if (!script.exec_phase) {
            // 1. 로봇 오른쪽 30%
            script.exec_phase = '2_wait';
            const blockId = this.generateBlockId();
            this.requestCommand(blockId, NeoBlockType.ROBOT_MOVE, [which === 1 ? 4 : 3, 30]);
            setTimeout(() => {
                script.exec_phase = '3_robot_stop';
            }, 2500);
        } else if (script.exec_phase === '2_wait') {
            // 2. 2초 기다리기
        } else if (script.exec_phase === '3_robot_stop') {
            // 3. 로봇 정지
            script.exec_phase = '4_robot_back';
            const blockId = this.generateBlockId();
            this.requestCommand(blockId, NeoBlockType.ROBOT_STOP);
        } else if (script.exec_phase === '4_robot_back') {
            // 4. 로봇 뒤로 30%
            script.exec_phase = '5_wait_sensor';
            const blockId = this.generateBlockId();
            this.requestCommand(blockId, NeoBlockType.ROBOT_MOVE, [2, 30]);
        } else if (script.exec_phase === '5_wait_sensor') {
            // 5. IN1 40 초과 기다리기
            const compareValue = which === 1 ? sensorData.in1Values[0] : sensorData.in2Values[0];
            if (compareValue > 40) {
                script.exec_phase = '6_wait_sensor';
            }
        } else if (script.exec_phase === '6_wait_sensor') {
            // 6. IN2 40 초과 기다리기
            const compareValue = which === 1 ? sensorData.in2Values[0] : sensorData.in1Values[0];
            if (compareValue > 40) {
                script.exec_phase = '7_robot_stop';
            }
        } else if (script.exec_phase === '7_robot_stop') {
            // 7. 로봇 멈추기
            script.exec_phase = '8_wait';
            const blockId = this.generateBlockId();
            this.requestCommand(blockId, NeoBlockType.ROBOT_STOP);
            setTimeout(() => {
                script.exec_phase = '9_robot_rotate';
            }, 1000);
        } else if (script.exec_phase === '8_wait') {
            // 8. 1초 기다리기
        } else if (script.exec_phase === '9_robot_rotate') {
            // 9. 로봇 제자리왼쪽 20%
            script.exec_phase = '10_wait_sensor';
            const blockId = this.generateBlockId();
            this.requestCommand(blockId, NeoBlockType.ROBOT_MOVE, [which === 1 ? 5 : 6, 20]);
        } else if (script.exec_phase === '10_wait_sensor') {
            // 10. IN1 40초과 기다리기
            const compareValue = which === 1 ? sensorData.in1Values[0] : sensorData.in2Values[0];
            if (compareValue > 40) {
                script.exec_phase = '11_stop_robot';
            }
        } else if (script.exec_phase === '11_stop_robot') {
            // 11. 로봇 멈추기
            script.exec_phase = '12_wait';
            const blockId = this.generateBlockId();
            this.requestCommand(blockId, NeoBlockType.ROBOT_STOP);
            setTimeout(() => {
                script.exec_phase = '13_adjustment';
            }, 1000);
        } else if (script.exec_phase === '12_wait') {
            // 12. 1초 기다리기
        } else if (script.exec_phase === '13_adjustment') {
            // 13. 라인트레이서
            script.exec_phase = '14_wait';
            const blockId = this.generateBlockId();
            this.requestCommand(blockId, NeoBlockType.ROBOT_MOVE, [7, 20]);
            setTimeout(() => {
                script.exec_phase = '15_robot_stop';
            }, 1500);
        } else if (script.exec_phase === '14_wait') {
            // 14. 1.5초 기다리기
        } else if (script.exec_phase === '15_robot_stop') {
            // 15. 로봇 멈추기
            script.exec_phase = '16_wait';
            const blockId = this.generateBlockId();
            this.requestCommand(blockId, NeoBlockType.ROBOT_STOP);
            setTimeout(() => {
                script.exec_phase = '17_robot_back';
            }, 1000);
        } else if (script.exec_phase === '16_wait') {
            // 16. 1초 기다리기
        } else if (script.exec_phase === '17_robot_back') {
            // 17. 로봇 후진 20%
            script.exec_phase = '18_wait';
            const blockId = this.generateBlockId();
            this.requestCommand(blockId, NeoBlockType.ROBOT_MOVE, [2, 20]);
            setTimeout(() => {
                script.exec_phase = '19_stop_robot';
            }, 1000);
        } else if (script.exec_phase === '18_wait') {
            // 18. 1초 기다리기
        } else if (script.exec_phase === '19_stop_robot') {
            // 19. 로봇 멈추기
            script.exec_phase = 'end';
            const blockId = this.generateBlockId();
            this.requestCommand(blockId, NeoBlockType.ROBOT_STOP);
        }
        //
        else if (script.exec_phase === 'end') {
            // 종료
            return script.callReturn();
        }

        return script;
    }
})();

module.exports = Entry.Neo;
