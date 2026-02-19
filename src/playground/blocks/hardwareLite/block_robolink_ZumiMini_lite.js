'use strict';

const CommandType = {
    COMMAND_NONE: 0,
    COMMAND_GOGO: 1,
    COMMAND_LEFT: 2,
    COMMAND_RIGHT: 3,
    COMMAND_GOBACK: 4,
    COMMAND_WAIT: 5,
    COMMAND_WAIT1: 6,
    COMMAND_SPEAK: 7,
    COMMAND_HUMAN: 8,
    COMMAND_HAND: 9,
    COMMAND_LED: 10,

    COMMAND_COLOR_RED: 19,
    COMMAND_COLOR_GREEN: 20,
    COMMAND_CARD_NUM1: 21,
    COMMAND_CARD_NUM2: 22,
    COMMAND_CARD_NUM3: 23,
    COMMAND_MOTION_STOP: 25,

    COMMAND_GO_UNTIL_DIST: 26,
    COMMAND_FREE_TURN: 27,
    COMMAND_LINE_TRACE_DIST: 28,
    COMMAND_GO_INFINITE: 29,
    COMMAND_TRACE_INFINITE: 30,

    COMMAND_LED_CONTROL: 31,
    COMMAND_MOTOR1_INFINITE: 32,
    COMMAND_MOTOR2_INFINITE: 33,
    COMMAND_LED_INFINITE: 34,

    COMMAND_CONTROL_MODE1: 35,

    COMMAND_LINE_LEFT: 39,
    COMMAND_LINE_RIGHT: 40,

    COMMAND_MOTOR_TIME: 41,

    COMMAND_QUICK_GOGO: 50,
    COMMAND_QUICK_GOBACK: 51,
    COMMAND_QUICK_LEFT: 52,
    COMMAND_QUICK_RIGHT: 53,

    COMMAND_FREE_TURN_PYTHON: 70,

    COMMAND_GOSENSOR: 100,
    COMMAND_LINE_TRACING: 101,
    COMMAND_COLOR_TRACKING: 102,

    COMMAND_ROBOT_LINE: 103,
    COMMAND_ROBOT_AVOIDANCE: 104,
    COMMAND_ROBOT_FOLLOWER: 105,
    COMMAND_ROBOT_CLIFF: 106,

    COMMAND_SET_IR_THREADHOLD: 150,
    COMMAND_SET_MOTOR_DEGREE: 151,

    COMMAND_CONTROL_LED: 200,
    COMMAND_PATTERN_LED: 201,

    COMMAND_COLOR_TRACKING2: 211,
    COMMAND_COLOR_TRACKING3: 212,

    COMMAND_TEXT_INPUT: 230,
    COMMAND_TEXT_SET: 231,
    COMMAND_TEXT_ADD: 232,

    COMMAND_SCREEN_TOGGLE: 240,
    COMMAND_EMOTION_CHANGE: 241,
    COMMAND_PLAY_SOUND: 242,

    COMMAND_MOTOR_CALIBRATION_READ: 245,
    COMMAND_MOTOR_CALIBRATION_START: 247,
};

const CommandType_DATA_LENGTH = {
    COMMAND_NONE: 0,
    COMMAND_GOGO: 1,
    COMMAND_LEFT: 1,
    COMMAND_RIGHT: 1,
    COMMAND_GOBACK: 1,
    COMMAND_WAIT: 4,
    COMMAND_WAIT1: 5,
    COMMAND_SPEAK: 8,
    COMMAND_HUMAN: 4,
    COMMAND_HAND: 9,
    COMMAND_LED: 3,

    COMMAND_COLOR_RED: 19,
    COMMAND_COLOR_GREEN: 20,
    COMMAND_CARD_NUM1: 21,
    COMMAND_CARD_NUM2: 22,
    COMMAND_CARD_NUM3: 23,
    COMMAND_MOTION_STOP: 0,

    COMMAND_GO_UNTIL_DIST: 3,
    COMMAND_FREE_TURN: 27,
    COMMAND_LINE_TRACE_DIST: 2,
    COMMAND_GO_INFINITE: 3,
    COMMAND_TRACE_INFINITE: 1,

    COMMAND_LED_CONTROL: 3,
    COMMAND_MOTOR1_INFINITE: 3,
    COMMAND_MOTOR2_INFINITE: 3,
    COMMAND_LED_INFINITE: 34,

    COMMAND_CONTROL_MODE1: 35,

    COMMAND_LINE_LEFT: 39,
    COMMAND_LINE_RIGHT: 40,

    COMMAND_MOTOR_TIME: 41,

    COMMAND_QUICK_GOGO: 1,
    COMMAND_QUICK_GOBACK: 1,
    COMMAND_QUICK_LEFT: 1,
    COMMAND_QUICK_RIGHT: 1,

    COMMAND_FREE_TURN_PYTHON: 4,

    COMMAND_GOSENSOR: 3,
    COMMAND_LINE_TRACING: 5,
    COMMAND_COLOR_TRACKING: 102,

    COMMAND_ROBOT_LINE: 103,
    COMMAND_ROBOT_AVOIDANCE: 104,
    COMMAND_ROBOT_FOLLOWER: 105,
    COMMAND_ROBOT_CLIFF: 106,

    COMMAND_SET_IR_THREADHOLD: 150,
    COMMAND_SET_MOTOR_DEGREE: 151,

    COMMAND_CONTROL_LED: 200,
    COMMAND_PATTERN_LED: 3,

    COMMAND_COLOR_TRACKING2: 211,
    COMMAND_COLOR_TRACKING3: 212,

    COMMAND_TEXT_INPUT: 1,
    COMMAND_TEXT_SET: 5,
    COMMAND_TEXT_ADD: 1,

    COMMAND_SCREEN_TOGGLE: 1,
    COMMAND_EMOTION_CHANGE: 1,
    COMMAND_PLAY_SOUND: 1,
};


const RequestType = {
    REQUEST_ENTRY_FACE_DETECT: 0x01,
    REQUEST_ENTRY_COLOR_DETECT: 0x02,
    REQUEST_ENTRY_APRIL_DETECT: 0x04,
    REQUEST_ENTRY_CAT_DETECT: 0x10,
};

const PacketIndex = {
    DATA_COM: 2,
    DATA_INFO: 2,
    DATA_REQ: 3,
    DATA_PSTAT: 4,
    DATA_SEN_FR: 5,
    DATA_SEN_FL: 6,
    DATA_SEN_BR: 7,
    DATA_SEN_BC: 8,
    DATA_SEN_BL: 9,

    DATA_DETECT_FACE: 10,
    DATA_DETECT_FACE_X: 11,
    DATA_DETECT_FACE_Y: 12,

    DATA_DETECT_COLOR: 13,
    DATA_DETECT_COLOR_X: 14,
    DATA_DETECT_COLOR_Y: 15,

    DATA_DETECT_MARKER: 16,
    DATA_DETECT_MARKER_X: 17,
    DATA_DETECT_MARKER_Y: 18,

    DATA_BTN_INPUT: 19,
    DATA_BATTERY: 20,

    DATA_DETECT_CAT: 23,
    DATA_DETECT_CAT_X: 24,
    DATA_DETECT_CAT_Y: 25
};

(function() {
    Entry.ZumiMiniLite = new (class ZumiMiniLite {
        constructor() {
            this.id = '4A0501';
            this.name = 'ZumiMiniLite';
            this.url = 'http://www.robolink.co.kr/';
            this.imageName = 'robolink_ZumiMini_lite.png';
            this.title = {
                ko: '로보링크 주미 미니',
                en: 'Robolink zumi mini',
            };

            this.duration = 50;

            this.blockMenuBlocks = [
                'zumiMiniLite_motor_control',
                'zumiMiniLite_move_straight',
                'zumiMiniLite_move_straight_infinite',
                'zumiMiniLite_move_turn',
                'zumiMiniLite_motion_stop',

                'zumiMiniLite_going_forward_until_sensing',
                'zumiMiniLite_following_line_until_sensing',
                'zumiMiniLite_following_line_dist',
                'zumiMiniLite_following_line_infinite',

                'zumiMiniLite_LED_control',
                'zumiMiniLite_button_boolean_input',

                'zumiMiniLite_screen_toggle',
                'zumiMiniLite_emotion',

                'zumiMiniLite_face_boolean_detector',
                'zumiMiniLite_color_boolean_detector',
                'zumiMiniLite_april_boolean_detector',

                'zumiMiniLite_front_sensor',
                'zumiMiniLite_bottom_sensor',
                'zumiMiniLite_button_input',
                'zumiMiniLite_face_detector',
                'zumiMiniLite_cat_face_detector',
                'zumiMiniLite_color_detector',
                'zumiMiniLite_april_detector',
                'zumiMiniLite_power_info'
            ];

            this.portData = {
                baudRate: 115200,
                dataBits: 8,
                parity: 'none',
                stopBits: 1,
                //connectionType: 'bytestream',
                bufferSize: 1024,
                constantServing: true,
                connectionType: 'bytestream',
            };

            this.StateLoading = {
                Ready: 0x00,
                Receiving: 0x01,
                Loaded: 0x02,
                Failure: 0x03
            };

            this.Section = {
                Start: 0x00,
                Header:0x01,
                Data: 0x02,
                End: 0x03
            };

            this.PACKET_DATA_LENGTH = 24;
            this.PACKET_START_BYTE1 = 0x24;
            this.PACKET_START_BYTE2 = 0x52;
            this.HEADER_LENGTH = 2;

            this.receiverState = this.StateLoading.Ready;
            this.receiverSection = this.Section.Start;
            this.receiverIndex = 0;
            this.receiverBuffer = [];
            this.receiverData = [];
            this.receiverMessage = null;
            this.receiverSectionOld = this.Section.End;

            this.reqINFO = 0;
            this.reqREQ = 0;
            this.reqPSTAT = 0;
            this.btn = 0;
            this.battery = 0;

            this.senFL = 0;
            this.senFR = 0;
            this.senBL = 0;
            this.senBC = 0;
            this.senBR = 0;

            this.zumiFaceDetected = false;
            this.zumiFaceCenter = [0, 0];
            this.zumiColorDetected = 0;
            this.zumiColorCenter = [0, 0];
            this.zumiMarkerDetected = 0;
            this.zumiMarkerCenter = [0, 0];
            this.zumiCatDetected = 0;
            this.zumiCatCenter = [0, 0];

            this.current_request = 0;
            this.sendBuffers = [];

            this.tSpd = 0;
            this.tDir = 0;
            this.motorTrigger = false;

            this.setZero();
        }

        // get monitorTemplate() {
        //     return {
        //     };
        // }
        // getMonitorPort() {
        //     return {
        //     }
        // }

        setZero() {
            this.current_request = 0;

            this.sendBuffers = [];

            this.motorTrigger = false;

            if (Entry.hwLite && Entry.hwLite.serial) {
                Entry.hwLite.serial.update();
            }
        }
        async initialHandshake() {
            //console.log("initialHandshake");
            const runApp0 = [0x24, 0x52, 0x19, 0x00]; //stop
            await Entry.hwLite.serial.sendAsync(runApp0);

            return true;
        }


        handleLocalData(data) {
            if (!this.bufferHandler) {
                this.bufferHandler = [];
            }

            for (const byte of data) {
                this.bufferHandler.push(byte);
            }

            while (this.bufferHandler.length > 0) {
                const byte = this.bufferHandler.shift();
                const stateLoading = this._processReceiverByte(byte);
                if (stateLoading === this.StateLoading.Loaded) {
                    this._updateDataStore(this.receiverData);
                    this._resetReceiverState();
                    continue;
                }
                if (stateLoading === this.StateLoading.Failure) {
                    this._resetReceiverState();
                }
            }
        }

        requestLocalData() {
            const dataToSend = Entry.ZumiMiniLite.sendBuffers;

            if(Entry.ZumiMiniLite.sendBuffers.length === 0)
            {
                if(this.motorTrigger == true)
                {
                    const sendACK= [0x24,0x52,CommandType.COMMAND_MOTOR1_INFINITE,this.current_request,this.tSpd,0x00,this.tDir]; //motor infinite
                    return sendACK;
                }
                else
                {
                    const sendACK= [0x24,0x52,0x00,this.current_request,0x00,0x00,0x00,0x00,0x00,0xFF,0xFF]; //stop
                    return sendACK;
                }
            }
            else
            {
                if((dataToSend[2] == CommandType.COMMAND_MOTOR1_INFINITE) || (dataToSend[2] == CommandType.COMMAND_MOTOR2_INFINITE))
                {
                   this.motorTrigger = true;
                }
                else
                {
                    this.motorTrigger = false;
                }
            }

            Entry.ZumiMiniLite.sendBuffers = [];
            return dataToSend;
        }

        // requestLocalData() {
        //     const dataToSend = Entry.ZumiMiniLite.sendBuffers;
        //     if(Entry.ZumiMiniLite.sendBuffers.length === 0)
        //     {
        //        // console.log("null data");
        //         const sendACK= [0x24,0x52,0x00,this.current_request,0x00,0x00,0x00,0x00,0x00,0xFF,0xFF]; //stop
        //         return sendACK;
        //     }
        //     Entry.ZumiMiniLite.sendBuffers = [];
        //     return dataToSend;
        // }

        setLanguage() {
            return {
                ko: {
                    template: {
                        zumiMiniLite_go_forward: '앞으로 가기(10cm) %1',
                        zumiMiniLite_go_back: '뒤로 가기(10cm) %1',
                        zumiMiniLite_turn_left: '왼쪽으로 회전 %1',
                        zumiMiniLite_turn_right: '오른쪽으로 회전 %1',
                        zumiMiniLite_going_forward_until_sensing: '물체 감지할 때까지 앞으로 가기 %1',
                        zumiMiniLite_following_line_until_sensing: '교차로 만날 때까지 선 따라가기 %1',
                        zumiMiniLite_front_sensor: '앞 센서 %1 %2',
                        zumiMiniLite_bottom_sensor: '바닥 센서 %1 %2',
                        zumiMiniLite_button_input: '버튼 입력 %1',
                        zumiMiniLite_button_boolean_input: '%1 이 %2',
                        zumiMiniLite_face_detector: 'AI 얼굴 %1 %2',
                        zumiMiniLite_cat_face_detector: 'AI 고양이 얼굴 %1 %2',
                        zumiMiniLite_face_boolean_detector: '%1 이 감지 되었을 때',
                        zumiMiniLite_color_detector: 'AI 컬러 감지 %1 %2',
                        zumiMiniLite_color_boolean_detector: '%1 이 감지되었을 때',
                        zumiMiniLite_april_detector: '마커 감지 %1 %2',
                        zumiMiniLite_april_boolean_detector: '마커 %1 이 감지되었을 때',
                        zumiMiniLite_IMU_sensor: '자세 측정 %1 %2',
                        zumiMiniLite_move_straight: '이동하기 방향 %1 속도 %2 거리 %3cm %4',
                        zumiMiniLite_move_turn: '회전하기 방향 %1 속도 %2 각도 %3도 %4',
                        zumiMiniLite_following_line_dist: '선 따라가기 속도 %1 거리 %2cm %3',
                        zumiMiniLite_move_straight_infinite: '계속 이동하기 방향 %1 속도 %2 %3',
                        zumiMiniLite_following_line_infinite: '계속 선 따라가기 속도 %1 %2',
                        zumiMiniLite_motion_stop: '이동 멈추기 %1',
                        zumiMiniLite_screen_toggle: '화면 바꾸기 %1 %2',
                        zumiMiniLite_emotion: '표정 변화 %1 %2',
                        zumiMiniLite_play_sound: '소리내기 %1 %2',
                        zumiMiniLite_LED_control: 'LED 불빛 %1 효과 %2 동작 %3 %4',
                        zumiMiniLite_motor_control: '모터 %1 방향 %2 속도 %3 %4',
                        zumiMiniLite_power_info: '배터리 %1',
                    },
                    Blocks: {
                        zumiMiniLite_fl: '왼쪽',
                        zumiMiniLite_fr: '오른쪽',
                        zumiMiniLite_bl: '왼쪽',
                        zumiMiniLite_bm: '가운데',
                        zumiMiniLite_br: '오른쪽',
                        zumiMiniLite_color: '색상',
                        zumiMiniLite_ai_red: '빨강',
                        zumiMiniLite_ai_orange: '주황',
                        zumiMiniLite_ai_yellow: '노랑',
                        zumiMiniLite_ai_green: '녹색',
                        zumiMiniLite_ai_cyan: '청록',
                        zumiMiniLite_ai_blue: '파랑',
                        zumiMiniLite_ai_purple: '보라',
                        zumiMiniLite_red: '빨강',
                        zumiMiniLite_green: '녹색',
                        zumiMiniLite_blue: '파랑',
                        zumiMiniLite_yellow: '노랑',
                        zumiMiniLite_sky_blue: '청록',
                        zumiMiniLite_pink: '분홍',
                        zumiMiniLite_white: '하양',
                        zumiMiniLite_led_normal: '기본',
                        zumiMiniLite_led_blink: '깜빡임',
                        zumiMiniLite_led_flicker: '깜빡임2',
                        zumiMiniLite_led_dimming: '디밍',
                        zumiMiniLite_led_sunrise: '서서히 밝아짐',
                        zumiMiniLite_led_sunset: '서서히 어두워짐',
                        zumiMiniLite_led_rainbow: '무지개',
                        zumiMiniLite_on: '켜기',
                        zumiMiniLite_off: '끄기',
                        zumiMiniLite_cat: '고양이얼굴',
                        zumiMiniLite_human: '사람얼굴',
                        zumiMiniLite_detect: '감지',
                        zumiMiniLite_cx: 'x좌표',
                        zumiMiniLite_cy: 'y좌표',
                        zumiMiniLite_id: '번호',
                        zumiMiniLite_pitch: '피치',
                        zumiMiniLite_roll: '롤',
                        zumiMiniLite_yaw: '요우',
                        zumiMiniLite_forward: '전진',
                        zumiMiniLite_backward: '후진',
                        zumiMiniLite_rapid: '빠르게',
                        zumiMiniLite_mid: '보통',
                        zumiMiniLite_slow: '느리게',
                        zumiMiniLite_left: '왼쪽',
                        zumiMiniLite_right: '오른쪽',
                        zumiMiniLite_camera: '카메라',
                        zumiMiniLite_emotion: '표정',
                        zumiMiniLite_emo_chaos: '혼란',
                        zumiMiniLite_emo_smile: '미소',
                        zumiMiniLite_emo_love: '사랑',
                        zumiMiniLite_emo_crash: '안돼!',
                        zumiMiniLite_emo_surprise: '놀람',
                        zumiMiniLite_emo_nice: '신남',
                        zumiMiniLite_emo_cantbelieve: '미심쩍음',
                        zumiMiniLite_emo_sleep: '졸림',
                        zumiMiniLite_emo_cry: '슬픔',
                        zumiMiniLite_emo_wink: '윙크',
                        zumiMiniLite_emo_blink: '깜빡깜빡',
                        zumiMiniLite_emo_sleeping: '잠듬',
                        zumiMiniLite_snd_user: '사용자 녹음',
                        zumiMiniLite_snd_cat: '고양이',
                        zumiMiniLite_snd_shutter: '셔터',
                        zumiMiniLite_snd_fail: '실패',
                        zumiMiniLite_snd_success: '성공',
                        zumiMiniLite_snd_fail2: '경고',
                        zumiMiniLite_snd_honk: '경적',
                        zumiMiniLite_snd_honk2: '경적2',
                        zumiMiniLite_snd_siren: '사이렌',
                        zumiMiniLite_m1: '왼쪽 모터',
                        zumiMiniLite_m2: '오른쪽 모터',
                        zumiMiniLite_cw: '전진방향',
                        zumiMiniLite_ccw: '후진방향',
                        zumiMiniLite_stop: '멈춤',
                        zumiMiniLite_red_btn: '빨강버튼',
                        zumiMiniLite_blue_btn: '파랑버튼',
                        zumiMiniLite_yellow_btn: '노랑버튼',
                        zumiMiniLite_green_btn: '녹색버튼',
                        zumiMiniLite_pressed: '눌렀을 때',
                        zumiMiniLite_released: '눌리지 않았을 때',
                    }
                },
                en: {
                    template: {
                        zumiMiniLite_go_forward: 'going forward(10cm) %1',
                        zumiMiniLite_go_back: 'going back(10cm) %1',
                        zumiMiniLite_turn_left: 'turning left %1',
                        zumiMiniLite_turn_right: 'turning right %1',
                        zumiMiniLite_going_forward_until_sensing: 'going forward until sensing the object %1',
                        zumiMiniLite_following_line_until_sensing: 'following the line until meet the intersection %1',
                        zumiMiniLite_front_sensor: 'front sensor %1 %2',
                        zumiMiniLite_bottom_sensor: 'bottom sensor %1 %2',
                        zumiMiniLite_button_inpput: 'button input %1',
                        zumiMiniLite_button_boolean_input: 'when %1 %2',
                        zumiMiniLite_face_detector: 'AI face %1 %2',
                        zumiMiniLite_cat_face_detector: 'AI cat face %1 %2',
                        zumiMiniLite_face_boolean_detector: 'when %1 is detected',
                        zumiMiniLite_color_detector: 'AI color detection %1 %2',
                        zumiMiniLite_color_boolean_detector: 'when %1 is detected',
                        zumiMiniLite_april_detector: 'apriltag detection %1 %2',
                        zumiMiniLite_april_boolean_detector: 'when apriltag %1 is detected',
                        zumiMiniLite_IMU_sensor: ' inertial mesurement %1 %2',
                        zumiMiniLite_move_straight: 'move direction %1 speed %2 distance %3 cm %4',
                        zumiMiniLite_move_turn: 'turn %1 speed %2 degree %3 %4',
                        zumiMiniLite_following_line_dist: 'line following speed %1 distance %2 %3',
                        zumiMiniLite_move_straight_infinite: 'keep moving direction %1 speed %2 %3',
                        zumiMiniLite_following_line_infinite: 'keep following line %1 %2',
                        zumiMiniLite_motion_stop: 'stop moving %1',
                        zumiMiniLite_screen_toggle: 'toggle screen %1 %2',
                        zumiMiniLite_emotion: 'change emotion %1 %2',
                        zumiMiniLite_play_sound: 'play sound %1 %2',
                        zumiMiniLite_LED_control: 'LED light %1 effect %2 acttion %3 %4',
                        zumiMiniLite_motor_control: 'motor %1 direction %2 speed %3 %4',
                        zumiMiniLite_power_info: 'battery %1',
                    },
                    Blocks: {
                        zumiMiniLite_fl: 'left',
                        zumiMiniLite_fr: 'right',
                        zumiMiniLite_bl: 'left',
                        zumiMiniLite_bm: 'middle',
                        zumiMiniLite_br: 'right',
                        zumiMiniLite_color: 'color',
                        zumiMiniLite_ai_red: 'red',
                        zumiMiniLite_ai_orange: 'orange',
                        zumiMiniLite_ai_yellow: 'yellow',
                        zumiMiniLite_ai_green: 'green',
                        zumiMiniLite_ai_cyan: 'cyan',
                        zumiMiniLite_ai_blue: 'blue',
                        zumiMiniLite_ai_purple: 'purple',
                        zumiMiniLite_red: 'red',
                        zumiMiniLite_green: 'green',
                        zumiMiniLite_blue: 'blue',
                        zumiMiniLite_yellow: 'yellow',
                        zumiMiniLite_sky_blue: 'skyblue',
                        zumiMiniLite_pink: 'pink',
                        zumiMiniLite_white: 'white',
                        zumiMiniLite_led_normal: 'normal',
                        zumiMiniLite_led_blink: 'blink',
                        zumiMiniLite_led_flicker: 'flicker',
                        zumiMiniLite_led_dimming: 'dimming',
                        zumiMiniLite_led_sunrise: 'sunrise',
                        zumiMiniLite_led_sunset: 'sunset',
                        zumiMiniLite_led_rainbow: 'rainbow',
                        zumiMiniLite_on: 'on',
                        zumiMiniLite_off: 'off',
                        zumiMiniLite_cat: 'cat',
                        zumiMiniLite_human: 'human',
                        zumiMiniLite_detect: 'detection',
                        zumiMiniLite_cx: 'x_coordinate',
                        zumiMiniLite_cy: 'y_coordinate',
                        zumiMiniLite_id: 'id',
                        zumiMiniLite_pitch: 'pitch',
                        zumiMiniLite_roll: 'roll',
                        zumiMiniLite_yaw: 'yaw',
                        zumiMiniLite_forward: 'forward',
                        zumiMiniLite_backward: 'backward',
                        zumiMiniLite_rapid: 'rapid',
                        zumiMiniLite_mid: 'medium',
                        zumiMiniLite_slow: 'slow',
                        zumiMiniLite_left: 'left',
                        zumiMiniLite_right: 'right',
                        zumiMiniLite_camera: 'camera',
                        zumiMiniLite_emotion: 'emotion',
                        zumiMiniLite_emo_chaos: 'chaos',
                        zumiMiniLite_emo_smile: 'smile',
                        zumiMiniLite_emo_love: 'love',
                        zumiMiniLite_emo_crash: 'no!',
                        zumiMiniLite_emo_surprise: 'surprise',
                        zumiMiniLite_emo_nice: 'joy',
                        zumiMiniLite_emo_cantbelieve: 'cant believe',
                        zumiMiniLite_emo_sleep: 'sleep',
                        zumiMiniLite_emo_cry: 'cry',
                        zumiMiniLite_emo_wink: 'wink',
                        zumiMiniLite_emo_blink: 'blink',
                        zumiMiniLite_emo_sleeping: 'sleeping',
                        zumiMiniLite_snd_cat: 'meow',
                        zumiMiniLite_snd_shutter: 'shutter',
                        zumiMiniLite_snd_fail: 'fail',
                        zumiMiniLite_snd_success: 'success',
                        zumiMiniLite_snd_fail2: 'alarm',
                        zumiMiniLite_snd_honk: 'horn',
                        zumiMiniLite_snd_honk2: 'horn2',
                        zumiMiniLite_snd_siren: 'siren',
                        zumiMiniLite_m1: 'left motor',
                        zumiMiniLite_m2: 'right motor',
                        zumiMiniLite_cw: 'forward',
                        zumiMiniLite_ccw: 'backward',
                        zumiMiniLite_stop: 'stop',
                        zumiMiniLite_red_btn: 'red button',
                        zumiMiniLite_blue_btn: 'blue button',
                        zumiMiniLite_yellow_btn: 'yellow button',
                        zumiMiniLite_green_btn: 'green button',
                        zumiMiniLite_pressed: 'pressed',
                        zumiMiniLite_released: 'released',
                    }
                },
            };
        }

        getBlocks() {
            return {

                zumiMiniLite_motor_control: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    fontColor: '#ffffff',
                    skeleton: 'basic',
                    statements: [],//
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.zumiMiniLite_m1, 'LEFT'],
                                [Lang.Blocks.zumiMiniLite_m2, 'RIGHT'],
                            ],
                            value: 'LEFT',//
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.zumiMiniLite_cw, 'CW'],
                                [Lang.Blocks.zumiMiniLite_ccw, 'CCW'],
                                [Lang.Blocks.zumiMiniLite_stop, 'STOP'],
                            ],
                            value: 'CW',//
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                        {
                            type: 'Block',
                            accept: 'string',
                            value: '5',//
                        },
                        {
                            type: "Indicator",
                            img: 'block_icon/hardwarelite_icon.svg',
                            size: 14
                        },
                    ],
                    def: {
                        params: ['LEFT', 'CW', 5, null],
                        type: 'zumiMiniLite_motor_control',
                    },
                    paramsKeyMap: {
                        SEL: 0,
                        DIR: 1,
                        SPD: 2,
                    },
                    class: "zumiMiniLite_move",
                    isNotFor: ['ZumiMiniLite'],
                    func(sprite, script) {

                        const DIR_LEFT = 1;
                        const DIR_RIGHT = 2;
                        const DIR_STOP = 3;

                        const _sel = script.getValue('SEL');
                        const _dir = script.getValue('DIR');
                        const _spd = script.getValue('SPD');

                        var _dirInt = 0;

                        if(_sel == 'LEFT') {
                            if (_dir == 'CW') _dirInt = DIR_RIGHT;
                            else if (_dir == 'CCW') _dirInt = DIR_LEFT;
                            else if (_dir == 'STOP') _dirInt = DIR_STOP;
                        }
                        if (_sel == 'RIGHT') {
                            if (_dir == 'CW') _dirInt = DIR_LEFT;
                            else if (_dir == 'CCW') _dirInt = DIR_RIGHT;
                            else if (_dir == 'STOP') _dirInt = DIR_STOP;
                        }

                        if (_spd < 0) _spd = 0;
                        else if (_spd > 10) _spd = 10;

                        if (_sel == 'LEFT') {
                            Entry.ZumiMiniLite.tSpd = Entry.ZumiMiniLite.tSpd & 0b11110000;
                            Entry.ZumiMiniLite.tSpd = Entry.ZumiMiniLite.tSpd | _spd;
                            Entry.ZumiMiniLite.tDir = Entry.ZumiMiniLite.tDir & 0b11110000;
                            Entry.ZumiMiniLite.tDir = Entry.ZumiMiniLite.tDir | _dirInt;

                            Entry.ZumiMiniLite.sendCommand(
                            CommandType.COMMAND_MOTOR1_INFINITE,
                            Entry.ZumiMiniLite.tSpd,
                            Entry.ZumiMiniLite.tSpd,
                            Entry.ZumiMiniLite.tDir
                            );
                        }

                        else if (_sel == 'RIGHT') {
                            Entry.ZumiMiniLite.tSpd = Entry.ZumiMiniLite.tSpd & 0b00001111;
                            Entry.ZumiMiniLite.tSpd = Entry.ZumiMiniLite.tSpd | (_spd << 4);
                            Entry.ZumiMiniLite.tDir = Entry.ZumiMiniLite.tDir & 0b00001111;
                            Entry.ZumiMiniLite.tDir = Entry.ZumiMiniLite.tDir | (_dirInt << 4);

                           Entry.ZumiMiniLite.sendCommand(
                            CommandType.COMMAND_MOTOR2_INFINITE,
                            Entry.ZumiMiniLite.tSpd,
                            Entry.ZumiMiniLite.tSpd,
                            Entry.ZumiMiniLite.tDir
                           );
                        }

                        return script.callReturn();
                    },
                },

                zumiMiniLite_move_straight: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    fontColor: '#ffffff',
                    skeleton: 'basic',
                    statements: [],//
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.zumiMiniLite_forward, 'FORWARD'],
                                [Lang.Blocks.zumiMiniLite_backward, 'BACKWARD'],
                            ],
                            value: 'FORWARD',//
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.zumiMiniLite_rapid, 'RAPID'],
                                [Lang.Blocks.zumiMiniLite_mid, 'MID'],
                                [Lang.Blocks.zumiMiniLite_slow, 'SLOW']
                            ],
                            value: 'MID',//
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                        {
                            type: 'Block',
                            accept: 'string',
                            value: '10',//
                        },
                        {
                            type: "Indicator",
                            img: 'block_icon/hardwarelite_icon.svg',
                            size: 14
                        },
                    ],
                    def: {
                        params: ['FORWARD', 'MID', 10, null],
                        type: 'zumiMiniLite_move_straight',
                    },
                    paramsKeyMap: {
                        DIR: 0,
                        SPD: 1,
                        DIST: 2,
                    },
                    class: "zumiMiniLite_move",
                    isNotFor: ['ZumiMiniLite'],
                    async func(sprite, script) {

                        const DIR_FORWARD = 0;
                        const DIR_BACKWARD = 1;
                        const SPEED_RAPID = 3;

                        const SPEED_MID = 2;
                        const SPEED_LOW = 1;

                        const _dir = script.getStringField('DIR', script)
                        const _spd = script.getStringField('SPD', script);
                        const _dist = script.getNumberValue('DIST');

                        let _dirV = (_dir === 'FORWARD') ? DIR_FORWARD : DIR_BACKWARD;
                        let _spdV = (_spd === 'RAPID') ? SPEED_RAPID : (_spd === 'MID') ? SPEED_MID : SPEED_LOW;
                        let _distV = parseInt(_dist);

                        await Entry.ZumiMiniLite.runCommandBlock(() => {
                            Entry.ZumiMiniLite.sendCommand(
                                CommandType.COMMAND_GO_UNTIL_DIST,
                                _spdV,
                                _distV,
                                _dirV
                            );
                        });
                    },
                },

                zumiMiniLite_move_straight_infinite: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    fontColor: '#ffffff',
                    skeleton: 'basic',
                    statements: [],//
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.zumiMiniLite_forward, 'FORWARD'],
                                [Lang.Blocks.zumiMiniLite_backward, 'BACKWARD'],
                            ],
                            value: 'FORWARD',//
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.zumiMiniLite_rapid, 'RAPID'],
                                [Lang.Blocks.zumiMiniLite_mid, 'MID'],
                                [Lang.Blocks.zumiMiniLite_slow, 'SLOW']
                            ],
                            value: 'MID',//
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                        {
                            type: "Indicator",
                            img: 'block_icon/hardwarelite_icon.svg',
                            size: 14,
                        },
                    ],
                    def: {
                        params: ['FORWARD', 'MID', null],
                        type: 'zumiMiniLite_move_straight_infinite',
                    },
                    paramsKeyMap: {
                        DIR: 0,
                        SPD: 1,
                    },
                    class: "zumiMiniLite_move",
                    isNotFor: ['ZumiMiniLite'],
                    func(sprite, script) {
                        const DIR_FORWARD = 0;
                        const DIR_BACKWARD = 1;

                        const SPEED_RAPID = 3;
                        const SPEED_MID = 2;
                        const SPEED_LOW = 1;

                        const _dir = script.getStringField('DIR', script)
                        const _spd = script.getStringField('SPD', script);

                        let _dirV = (_dir === 'FORWARD') ? DIR_FORWARD : DIR_BACKWARD;
                        let _spdV = (_spd === 'RAPID') ? SPEED_RAPID : (_spd === 'MID') ? SPEED_MID : SPEED_LOW;

                        Entry.ZumiMiniLite.sendCommand(
                            CommandType.COMMAND_GO_INFINITE,
                            _spdV,
                            0,
                            _dirV
                        );
                    },
                },

                zumiMiniLite_move_turn: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    fontColor: '#ffffff',
                    skeleton: 'basic',
                    statements: [],//
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.zumiMiniLite_left, 'LEFT'],
                                [Lang.Blocks.zumiMiniLite_right, 'RIGHT'],
                            ],
                            value: 'RIGHT',//
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.RAPID, 'RAPID'],
                                [Lang.Blocks.MID, 'MID'],
                                [Lang.Blocks.SLOW, 'SLOW']
                            ],
                            value: 'MID',//
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                        {
                            type: 'Block',
                            accept: 'string',
                            value: '90',//
                        },
                        {
                            type: "Indicator",
                            img: 'block_icon/hardwarelite_icon.svg',
                            size: 14
                        },
                    ],
                    def: {
                        params: ['RIGHT', 'MID', 90, null],
                        type: 'zumiMiniLite_move_turn',
                    },
                    paramsKeyMap: {
                        DIR: 0,
                        SPD: 1,
                        DEG: 2,
                    },
                    class: "zumiMiniLite_move",
                    isNotFor: ['ZumiMiniLite'],
                    async func(sprite, script) {

                        const DIR_LEFT = 0;
                        const DIR_RIGHT = 1;
                        const SPEED_RAPID = 3;
                        const SPEED_MID = 2;
                        const SPEED_LOW = 1;

                        const _dir = script.getStringField('DIR', script)
                        const _spd = script.getStringField('SPD', script);
                        const _deg = script.getNumberValue('DEG');

                        let _dirV = (_dir === 'LEFT') ? DIR_LEFT : DIR_RIGHT;
                        let _spdV = (_spd === 'RAPID') ? SPEED_RAPID : (_spd === 'MID') ? SPEED_MID : SPEED_LOW;
                        let _degV = parseFloat(_deg);
                        if (_degV < 5) _degV = 5; else if (_degV > 359) _degV = 359;
                        var _degree = _degV * 0.5;

                        await Entry.ZumiMiniLite.runCommandBlock(() => {
                            Entry.ZumiMiniLite.sendCommand(
                                CommandType.COMMAND_FREE_TURN,
                                _spdV,
                                _degree,
                                _dirV
                            );
                        });
                    },
                },

                zumiMiniLite_motion_stop: {
                        color: EntryStatic.colorSet.block.default.HARDWARE,
                        outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                        fontColor: '#ffffff',
                        skeleton: 'basic',
                        statements: [],//
                        params: [
                            {
                                type: "Indicator",
                                img: 'block_icon/hardwarelite_icon.svg',
                                size: 14,
                            }
                        ],
                        def: {
                            type: "zumiMiniLite_motion_stop"
                        },
                        class: "zumiMiniLite_move",
                        isNotFor: ['ZumiMiniLite'],
                        async func(sprite, script) {

                            await Entry.ZumiMiniLite.runCommandBlock(() => {
                                Entry.ZumiMiniLite.sendCommand(
                                    CommandType.COMMAND_MOTION_STOP
                                );
                            });

                        },
                },

                zumiMiniLite_going_forward_until_sensing: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    fontColor: '#ffffff',
                    skeleton: 'basic',
                    statements: [],//
                    params: [
                        {
                            type: "Indicator",
                            img: 'block_icon/hardwarelite_icon.svg',
                            size: 14
                        }
                    ],
                    def: {
                        type: "zumiMiniLite_going_forward_until_sensing"
                    },
                    class: "zumiMiniLite_sense",
                    isNotFor: ['ZumiMiniLite'],
                    async func(sprite, script) {

                        await Entry.ZumiMiniLite.runCommandBlock(() => {
                            Entry.ZumiMiniLite.sendCommand(
                                CommandType.COMMAND_GOSENSOR
                            );
                        });

                    },
                },

                // -- line
                zumiMiniLite_following_line_until_sensing: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    fontColor: '#ffffff',
                    skeleton: 'basic',
                    params: [
                        {
                            type: "Indicator",
                            img: 'block_icon/hardwarelite_icon.svg',
                            size: 14,
                        }
                    ],
                    def: {
                        type: "zumiMiniLite_following_line_until_sensing"
                    },
                    class: "zumiMiniLite_sense",
                    isNotFor: ['ZumiMiniLite'],
                    async func(sprite, script) {

                        await Entry.ZumiMiniLite.runCommandBlock(() => {
                            Entry.ZumiMiniLite.sendCommand(
                                CommandType.COMMAND_LINE_TRACING,
                                0,
                                0,
                                0,
                                0x8B,
                                0x3A
                            );
                        });

                    },
                },

                zumiMiniLite_following_line_dist: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    fontColor: '#ffffff',
                    skeleton: 'basic',
                    statements: [],//
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.zumiMiniLite_rapid, 'RAPID'],
                                [Lang.Blocks.zumiMiniLite_mid, 'MID'],
                                [Lang.Blocks.zumiMiniLite_slow, 'SLOW']
                            ],
                            value: 'MID',//
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                        {
                            type: 'Block',
                            accept: 'string',
                            value: '30',//
                        },
                        {
                            type: "Indicator",
                            img: 'block_icon/hardwarelite_icon.svg',
                            size: 14
                        },
                    ],
                    def: {
                        params: ['MID', 30, null],
                        type: 'zumiMiniLite_following_line_dist',
                    },
                    paramsKeyMap: {
                        SPD: 0,
                        DIST: 1,
                    },
                    class: "zumiMiniLite_sense",
                    isNotFor: ['ZumiMiniLite'],
                    async func(sprite, script) {

                        const SPEED_RAPID = 3;
                        const SPEED_MID = 2;
                        const SPEED_LOW = 1;

                        const _spd = script.getStringField('SPD', script);
                        const _dist = script.getNumberValue('DIST');

                        let _spdV = (_spd === 'RAPID') ? SPEED_RAPID : (_spd === 'MID') ? SPEED_MID : SPEED_LOW;
                        let _distV = parseInt(_dist);
                        if (_dist < 10) _distV = 10;
                        else if (_dist > 200) _distV = 200;

                        await Entry.ZumiMiniLite.runCommandBlock(() => {
                            Entry.ZumiMiniLite.sendCommand(
                                CommandType.COMMAND_LINE_TRACE_DIST,
                                _spdV,
                                _distV
                            );
                        });

                    },
                },

                zumiMiniLite_following_line_infinite: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    fontColor: '#ffffff',
                    skeleton: 'basic',
                    statements: [],//
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.zumiMiniLite_rapid, 'RAPID'],
                                [Lang.Blocks.zumiMiniLite_mid, 'MID'],
                                [Lang.Blocks.zumiMiniLite_slow, 'SLOW']
                            ],
                            value: 'MID',//
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                        {
                            type: "Indicator",
                            img: 'block_icon/hardwarelite_icon.svg',
                            size: 14,
                        },
                    ],
                    def: {
                        params: ['MID', null],
                        type: 'zumiMiniLite_following_line_infinite',
                    },
                    paramsKeyMap: {
                        SPD: 0,
                    },
                    class: "zumiMiniLite_sense",
                    isNotFor: ['ZumiMiniLite'],
                    func(sprite, script) {

                        const SPEED_RAPID = 3;
                        const SPEED_MID = 2;
                        const SPEED_LOW = 1;

                        const _spd = script.getStringField('SPD', script);

                        let _spdV = (_spd === 'RAPID') ? SPEED_RAPID : (_spd === 'MID') ? SPEED_MID : SPEED_LOW;

                        Entry.ZumiMiniLite.sendCommand(
                            CommandType.COMMAND_TRACE_INFINITE,
                            _spdV
                        );

                    },
                },
//-----------------------------------------------------------------------------------//
                zumiMiniLite_LED_control: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    fontColor: '#ffffff',//
                    skeleton: 'basic',
                    statements: [],//
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.zumiMiniLite_red, 'RED'],
                                [Lang.Blocks.zumiMiniLite_green, 'GREEN'],
                                [Lang.Blocks.zumiMiniLite_blue, 'BLUE'],
                                [Lang.Blocks.zumiMiniLite_yellow, 'YELLOW'],
                                [Lang.Blocks.zumiMiniLite_sky_blue, 'SKY_BLUE'],
                                [Lang.Blocks.zumiMiniLite_pink, 'PINK'],
                                [Lang.Blocks.zumiMiniLite_white, 'WHITE'],
                            ],
                            value: 'WHITE',//
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.zumiMiniLite_led_normal, 'NORMAL'],
                                [Lang.Blocks.zumiMiniLite_led_blink, 'BLINK'],
                                [Lang.Blocks.zumiMiniLite_led_dimming, 'DIMMING'],
                                [Lang.Blocks.zumiMiniLite_led_sunrise, 'SUNRISE'],
                                [Lang.Blocks.zumiMiniLite_led_sunset, 'SUNSET'],
                                [Lang.Blocks.zumiMiniLite_led_flicker, 'FLICKER'],
                                [Lang.Blocks.zumiMiniLite_led_rainbow, 'RAINBOW'],
                            ],
                            value: 'NORMAL',//
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.ON, 'ON'],
                                [Lang.Blocks.OFF, 'OFF'],
                            ],
                            value: 'ON',//
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
                        params: ['WHITE', 'NORMAL', 'ON', null],
                        type: 'zumiMiniLite_LED_control',
                    },
                    paramsKeyMap: {
                        COLOR: 0,
                        EFFECT: 1,
                        ACTION: 2,
                    },
                    class: 'zumiMiniLite_led',
                    isNotFor: ['ZumiMiniLite'],
                    async func(sprite, script) {

                        const _col = script.getValue('COLOR');
                        const _eff = script.getValue('EFFECT');
                        const _act = script.getValue('ACTION');

                        const LED_RED = 1;
                        const LED_BLUE = 2;
                        const LED_GREEN = 3;
                        const LED_YELLOW = 4;
                        const LED_SKY_BLUE = 5;
                        const LED_PINK = 6;
                        const LED_WHITE = 7;

                        const LED_NORMAL = 0;
                        const LED_BLINK = 1;
                        const LED_FLICKER = 2;
                        const LED_DIMMING = 3;
                        const LED_SUNRISE = 4;
                        const LED_SUNSET = 5;
                        const LED_RAINBOW = 6;

                        let _colorSend = 0;
                        let _effectSend = 0;
                        let _actSend = 0;

                        if ((_col == 'RED') && (_act == 'ON')) _colorSend = LED_RED;
                        else if ((_col == 'BLUE') && (_act == 'ON')) _colorSend = LED_BLUE;
                        else if ((_col == 'GREEN') && (_act == 'ON')) _colorSend = LED_GREEN;
                        else if ((_col == 'SKY_BLUE') && (_act == 'ON')) _colorSend = LED_SKY_BLUE;
                        else if ((_col == 'PINK') && (_act == 'ON')) _colorSend = LED_PINK;
                        else if ((_col == 'YELLOW') && (_act == 'ON')) _colorSend = LED_YELLOW;
                        else if ((_col == 'WHITE') && (_act == 'ON')) _colorSend = LED_WHITE;

                        if (_eff == 'NORMAL') _effectSend = LED_NORMAL;
                        else if (_eff == 'BLINK') _effectSend = LED_BLINK;
                        else if (_eff == 'FLICKER') _effectSend = LED_FLICKER;
                        else if (_eff == 'DIMMING') _effectSend = LED_DIMMING;
                        else if (_eff == 'SUNRISE') _effectSend = LED_SUNRISE;
                        else if (_eff == 'SUNSET') _effectSend = LED_SUNSET;
                        else if (_eff == 'RAINBOW') _effectSend = LED_RAINBOW;

                        if(_act == 'ON') _actSend = 1;
                        else if(_act == 'OFF') _actSend = 0;

                        await Entry.ZumiMiniLite.runCommandBlock(() => {
                        Entry.ZumiMiniLite.sendCommand(
                            CommandType.COMMAND_LED_CONTROL,
                            _colorSend,
                            _effectSend,
                            _actSend
                        );
                        });

                        return script.callReturn();
                    },
                    //syntax: { js: [], py: ['Sensorboard.led(%1, %2)'] },
                },

                zumiMiniLite_button_boolean_input: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    fontColor: '#ffffff',
                    skeleton: 'basic_boolean_field',
                    statements: [],//
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.zumiMiniLite_red_btn, 'RED_BTN'],
                                [Lang.Blocks.zumiMiniLite_blue_btn, 'BLUE_BTN'],
                                [Lang.Blocks.zumiMiniLite_green_btn, 'GREEN_BTN'],
                                [Lang.Blocks.zumiMiniLite_yellow_btn, 'YELLOW_BTN'],
                            ],
                            value: 'RED_BTN',//
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.zumiMiniLite_pressed, 'PRESS'],
                                [Lang.Blocks.zumiMiniLite_released, 'RELEASE'],
                            ],
                            value: 'PRESS',//
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                    ],
                    def: {
                        params: ['RED_BTN','PRESS'],
                        type: 'zumiMiniLite_button_boolean_input',
                    },
                    paramsKeyMap: {
                        BUTTON: 0,
                        STATUS: 1,
                    },
                    class: 'zumiMiniLite_boolean',
                    isNotFor: ['ZumiMiniLite'],
                    func(sprite, script) {

                        var result = false;

                        const _btn = script.getValue('BUTTON');
                        const _stat = script.getValue('STATUS');
                        var bStat = Entry.ZumiMiniLite.btn;

                        if (_stat == 'PRESS')
                        {
                            if((_btn == 'RED_BTN')&&(bStat == 8)) result = true;
                            else if((_btn == 'BLUE_BTN') && (bStat == 4)) result = true;
                            else if((_btn == 'GREEN_BTN') && (bStat == 2)) result = true;
                            else if((_btn == 'YELLOW_BTN') && (bStat == 1)) result = true;
                            else result = false;
                        }
                        else if (_stat == 'RELEASE')
                        {
                            if ((_btn == 'RED_BTN') && (bStat == 8)) result = false;
                            else if ((_btn == 'BLUE_BTN') && (bStat == 4)) result = false;
                            else if ((_btn == 'GREEN_BTN') && (bStat == 2)) result = false;
                            else if ((_btn == 'YELLOW_BTN') && (bStat == 1)) result = false;
                            else result = true;
                        }

                        return result;
                    },
                },
//-----------------------------------------------------------------------------------//
                zumiMiniLite_screen_toggle: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    fontColor: '#ffffff',
                    skeleton: 'basic',
                    statements: [],//
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.zumiMiniLite_camera, 'CAMERA'],
                                [Lang.Blocks.zumiMiniLite_emotion, 'EMOTION'],
                            ],
                            value: 'CAMERA',//
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                        {
                            type: 'Indicator',
                            img: 'block_icon/hardwarelite_icon.svg',
                            size: 14,
                        },
                    ],
                    def: {
                        params: ['CAMERA', null],
                        type: 'zumiMiniLite_screen_toggle',
                    },
                    paramsKeyMap: {
                        TYPE: 0,
                    },
                    class: 'zumiMiniLite_screen',
                    isNotFor: ['ZumiMiniLite'],
                    func(sprite, script) {

                        const SCREEN_CAMERA = 1;
                        const SCREEN_EMOTION = 2;

                        const _type = script.getStringField('TYPE', script)

                        let _typeV = (_type === 'CAMERA') ? SCREEN_CAMERA : SCREEN_EMOTION;

                            Entry.ZumiMiniLite.sendCommand(
                                CommandType.COMMAND_SCREEN_TOGGLE,
                                _typeV
                            );
                    },
                },

                zumiMiniLite_emotion: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    fontColor: '#ffffff',
                    skeleton: 'basic',
                    statements: [],//
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.zumiMiniLite_emo_smile, 'SMILE'],
                                [Lang.Blocks.zumiMiniLite_emo_love, 'LOVE'],
                                [Lang.Blocks.zumiMiniLite_emo_surprise, 'SURP'],
                                [Lang.Blocks.zumiMiniLite_emo_nice, 'NICE'],
                                [Lang.Blocks.zumiMiniLite_emo_chaos, 'CHAOS'],
                                [Lang.Blocks.zumiMiniLite_emo_crash, 'CRASH'],
                                [Lang.Blocks.zumiMiniLite_emo_cantbelieve, 'CANTBELIEVE'],
                                [Lang.Blocks.zumiMiniLite_emo_sleep, 'SLEEP'],
                                [Lang.Blocks.zumiMiniLite_emo_cry, 'CRY'],
                                [Lang.Blocks.zumiMiniLite_emo_wink, 'WINK'],
                                [Lang.Blocks.zumiMiniLite_emo_blink, 'BLINK'],
                                [Lang.Blocks.zumiMiniLite_emo_sleeping, 'SLEEPING'],
                            ],
                            value: 'SMILE',//
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                        {
                            type: 'Indicator',
                            img: 'block_icon/hardwarelite_icon.svg',
                            size: 14,
                        },
                    ],
                    def: {
                        params: ['SMILE', null],
                        type: 'zumiMiniLite_emotion',
                    },
                    paramsKeyMap: {
                        TYPE: 0,
                    },
                    class: 'zumiMiniLite_screen',
                    isNotFor: ['ZumiMiniLite'],
                    func(sprite, script) {

                        const EMO_BLINK = 3;
                        const EMO_STOP = 2;

                        const EMO_SMILE = 4;
                        const EMO_LOVE = 5;

                        const EMO_CRASH = 6;
                        const EMO_SURPRISE = 7;
                        const EMO_NICE = 8;
                        const EMO_CANTBELIEVE = 9;
                        const EMO_SLEEP = 10;
                        const EMO_CRY = 11;
                        const EMO_CHAOS = 12;
                        const EMO_SLEEPING = 13;
                        const EMO_WINK = 14;

                        const _type = script.getStringField('TYPE', script)
                        let _typeV = 0;

                        if (_type == 'SMILE') _typeV = EMO_SMILE;
                        else if (_type == 'LOVE') _typeV = EMO_LOVE;
                        else if (_type == 'SURP') _typeV = EMO_SURPRISE;
                        else if (_type == 'NICE') _typeV = EMO_NICE;
                        else if (_type == 'CHAOS') _typeV = EMO_CHAOS;
                        else if (_type == 'CRASH') _typeV = EMO_CRASH;
                        else if (_type == 'CANTBELIEVE') _typeV = EMO_CANTBELIEVE;
                        else if (_type == 'SLEEP') _typeV = EMO_SLEEP;
                        else if (_type == 'CRY') _typeV = EMO_CRY;
                        else if (_type == 'WINK') _typeV = EMO_WINK;
                        else if (_type == 'BLINK') _typeV = EMO_BLINK;
                        else if (_type == 'SLEEPING') _typeV = EMO_SLEEPING;

                            Entry.ZumiMiniLite.sendCommand(
                                CommandType.COMMAND_EMOTION_CHANGE,
                                _typeV
                            );
                    },
                },

//-----------------------------------------------------------------------------------//
                // AI 인식 판단
                zumiMiniLite_face_boolean_detector: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    fontColor: '#ffffff',
                    skeleton: 'basic_boolean_field',
                    statements: [],//
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.zumiMiniLite_human, 'HUMAN'],
                                [Lang.Blocks.zumiMiniLite_cat, 'CAT'],
                            ],
                            value: 'HUMAN',//
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                    ],
                    def: {
                        params: ['HUMAN'],
                        type: 'zumiMiniLite_face_boolean_detector',
                    },
                    paramsKeyMap: {
                        FACE: 0,
                    },
                    class: 'zumiMiniLite_boolean',
                    isNotFor: ['ZumiMiniLite'],
                    func(sprite, script) {

                        var result = false;

                        const sel_detect = script.getValue('FACE');

                        if(sel_detect == 'HUMAN')
                        {
                            Entry.ZumiMiniLite.current_request |= RequestType.REQUEST_ENTRY_FACE_DETECT;

                            if(Entry.ZumiMiniLite.zumiFaceDetected != 0) result = true;
                            else result = false;
                        }
                        else if(sel_detect == 'CAT')
                        {
                            Entry.ZumiMiniLite.current_request |= RequestType.REQUEST_ENTRY_CAT_DETECT;

                            if(Entry.ZumiMiniLite.zumiCatDetected != 0) result = true;
                            else result = false;
                        }

                        // Entry.ZumiMiniLite.sendCommand(
                        //     CommandType.COMMAND_NONE
                        // );

                        return result;
                    },
                },

                zumiMiniLite_color_boolean_detector: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    fontColor: '#ffffff',
                    skeleton: 'basic_boolean_field',
                    statements: [],//
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.zumiMiniLite_ai_red, 'RED'],
                                [Lang.Blocks.zumiMiniLite_ai_orange, 'ORANGE'],
                                [Lang.Blocks.zumiMiniLite_ai_yellow, 'YELLOW'],
                                [Lang.Blocks.zumiMiniLite_ai_green, 'GREEN'],
                                [Lang.Blocks.zumiMiniLite_ai_cyan, 'CYAN'],
                                [Lang.Blocks.zumiMiniLite_ai_blue, 'BLUE'],
                                [Lang.Blocks.zumiMiniLite_ai_purple, 'PURPLE'],
                            ],
                            value: 'RED',//
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                    ],
                    def: {
                        params: ['RED'],
                        type: 'zumiMiniLite_color_boolean_detector',
                    },
                    paramsKeyMap: {
                        PARAM: 0,
                    },
                    class: 'zumiMiniLite_boolean',
                    isNotFor: ['ZumiMiniLite'],
                    func(sprite, script) {

                        const sen = script.getValue('PARAM');
                        Entry.ZumiMiniLite.current_request |= RequestType.REQUEST_ENTRY_COLOR_DETECT;

                        // Entry.ZumiMiniLite.sendCommand(
                        //     CommandType.COMMAND_NONE
                        // );

                        var result = Entry.ZumiMiniLite.zumiColorDetected;

                        if ((result == 0x00) && (sen == 'RED')) result = true;
                        else if ((result == 0x01) && (sen == 'ORANGE')) result = true;
                        else if ((result == 0x02) && (sen == 'YELLOW')) result = true;
                        else if ((result == 0x03) && (sen == 'GREEN')) result = true;
                        else if ((result == 0x04) && (sen == 'CYAN')) result = true;
                        else if ((result == 0x05) && (sen == 'BLUE')) result = true;
                        else if ((result == 0x06) && (sen == 'PURPLE')) result = true;
                        else result = false;

                        return result;
                    },
                },

                zumiMiniLite_april_boolean_detector: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    fontColor: '#ffffff',
                    skeleton: 'basic_boolean_field',
                    statements: [],//
                    params: [
                        {
                            type: 'Block',
                            accept: 'string',
                            value: '15',//
                        },
                    ],
                    def: {
                        params: [15],
                        type: 'zumiMiniLite_april_boolean_detector',
                    },
                    paramsKeyMap: {
                        NUM: 0,
                    },
                    class: 'zumiMiniLite_boolean',
                    isNotFor: ['ZumiMiniLite'],
                    func(sprite, script) {

                        const _num = script.getValue('NUM');
                        Entry.ZumiMiniLite.current_request |= RequestType.REQUEST_ENTRY_APRIL_DETECT;

                        // Entry.ZumiMiniLite.sendCommand(
                        //     CommandType.COMMAND_NONE
                        // );

                        var result = Entry.ZumiMiniLite.zumiMarkerDetected;

                        if(result <11) result +=1;
                        else if(result == 14) result = 12;
                        else if(result == 15) result = 13;
                        else if(result == 16) result = 14;
                        else if(result == 18) result = 15;
                        else if(result == 19) result = 16;
                        else if(result == 20) result = 17;

                        if(_num == result) result = true;
                        else result = false;

                        return result;
                    },
                },
//-----------------------------------------------------------------------------------//

                zumiMiniLite_front_sensor: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    fontColor: '#ffffff',//
                    skeleton: 'basic_string_field',
                    statements: [],//
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.zumiMiniLite_fl, 'FL'],
                                [Lang.Blocks.zumiMiniLite_fr, 'FR'],
                            ],
                            value: 'FL',//
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                        {
                            type: 'Indicator',
                            img: 'block_icon/hardwarelite_icon.svg',
                            size: 14,
                        },
                    ],
                    def: {
                        params: ['FL', null],
                        type: 'zumiMiniLite_front_sensor',
                    },
                    paramsKeyMap: {
                        DIR: 0,
                    },
                    class: 'info',
                    isNotFor: ['ZumiMiniLite'],
                    func(sprite, script) {
                        const _dir = script.getValue('DIR');
                        if(_dir == 'FL') return Entry.ZumiMiniLite.senFL;
                        else return Entry.ZumiMiniLite.senFR;
                    },
                },
                zumiMiniLite_bottom_sensor: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    fontColor: '#ffffff',//
                    skeleton: 'basic_string_field',
                    statements: [],//
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.zumiMiniLite_bl, 'BL'],
                                [Lang.Blocks.zumiMiniLite_bm, 'BM'],
                                [Lang.Blocks.zumiMiniLite_br, 'BR'],
                            ],
                            value: 'BL',//
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                        {
                            type: 'Indicator',
                            img: 'block_icon/hardwarelite_icon.svg',
                            size: 14,
                        },
                    ],
                    def: {
                        params: ['BL', null],
                        type: 'zumiMiniLite_bottom_sensor',
                    },
                    paramsKeyMap: {
                        DIR: 0,
                    },
                    class: 'info',
                    isNotFor: ['ZumiMiniLite'],
                    func(sprite, script) {
                        const _dir = script.getValue('DIR');
                        if(_dir == 'BL') return Entry.ZumiMiniLite.senBL;
                        else if(_dir == 'BR') return Entry.ZumiMiniLite.senBR;
                        else return Entry.ZumiMiniLite.senBC;
                    },
                },
                zumiMiniLite_button_input: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    fontColor: '#ffffff',
                    skeleton: 'basic_string_field',
                    statements: [],//
                    params: [
                        {
                            type: 'Indicator',
                            img: 'block_icon/hardwarelite_icon.svg',
                            size: 12,
                        },
                    ],
                    def: {
                        type: 'zumiMiniLite_button_input',
                    },
                    class: 'info',
                    isNotFor: ['ZumiMiniLite'],
                    func(sprite, script) {

                        var bStat = Entry.ZumiMiniLite.btn;
                        if(bStat == 8) bStat = 'R';
                        else if(bStat == 4) bStat = 'B';
                        else if(bStat == 2) bStat = 'G';
                        else if(bStat == 1) bStat = 'Y';
                        else bStat = 'N';

                        return bStat;
                    },
                },
                zumiMiniLite_power_info: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                fontColor: '#ffffff',
                skeleton: 'basic_string_field',
                statements: [],//
                params: [
                    {
                        type: 'Indicator',
                        img: 'block_icon/hardwarelite_icon.svg',
                        size: 12,
                    },
                ],
                def: {
                    type: 'zumiMiniLite_power_info',
                },
                class: 'info',
                isNotFor: ['ZumiMiniLite'],
                func(sprite, script) {
                    return Entry.ZumiMiniLite.battery;
                },
                },

                zumiMiniLite_face_detector: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    fontColor: '#ffffff',
                    skeleton: 'basic_string_field',
                    statements: [],//
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.zumiMiniLite_detect, 'DETECT'],
                                [Lang.Blocks.zumiMiniLite_cx, 'CX'],
                                [Lang.Blocks.zumiMiniLite_cy, 'CY'],
                            ],
                            value: 'DETECT',//
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                        {
                            type: 'Indicator',
                            img: 'block_icon/hardwarelite_icon.svg',
                            size: 14,
                        },
                    ],
                    def: {
                        params: ['DETECT', null],
                        type: 'zumiMiniLite_face_detector',
                    },
                    paramsKeyMap: {
                        PARAM: 0,
                    },
                    class: 'info',
                    isNotFor: ['ZumiMiniLite'],
                    func(sprite, script) {

                        const sel_detect = script.getValue('PARAM');

                        Entry.ZumiMiniLite.current_request |= RequestType.REQUEST_ENTRY_FACE_DETECT;

                        // Entry.ZumiMiniLite.sendCommand(
                        //     CommandType.COMMAND_NONE
                        // );

                        if(Entry.ZumiMiniLite.zumiFaceDetected == 0x00)
                        {
                            if(sel_detect == 'DETECT') return false;
                            else if(sel_detect == 'CX') return parseInt(-999);
                            else if(sel_detect == 'CY') return parseInt(-999);
                        }
                        else
                        {
                            if(sel_detect == 'DETECT')  return true;

                            else if(sel_detect == 'CX')
                            {
                                var Xg = Entry.ZumiMiniLite.zumiFaceCenter[0];
                                return ((200 / 2) - Xg) + 10;
                            }
                            else if(sel_detect == 'CY')
                            {
                                var Yg = Entry.ZumiMiniLite.zumiFaceCenter[1];
                                return  ((200 / 2) - Yg) + 35;
                            }
                        }
                    },
                },
                zumiMiniLite_cat_face_detector: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    fontColor: '#ffffff',
                    skeleton: 'basic_string_field',
                    statements: [],//
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.zumiMiniLite_detect, 'DETECT'],
                                [Lang.Blocks.zumiMiniLite_cx, 'CX'],
                                [Lang.Blocks.zumiMiniLite_cy, 'CY'],
                            ],
                            value: 'DETECT',//
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                        {
                            type: 'Indicator',
                            img: 'block_icon/hardwarelite_icon.svg',
                            size: 14,
                        },
                    ],
                    def: {
                        params: ['DETECT', null],
                        type: 'zumiMiniLite_cat_face_detector',
                    },
                    paramsKeyMap: {
                        PARAM: 0,
                    },
                    class: 'info',
                    isNotFor: ['ZumiMiniLite'],
                    func(sprite, script) {

                        const sel_detect = script.getValue('PARAM');
                        Entry.ZumiMiniLite.current_request |= RequestType.REQUEST_ENTRY_CAT_DETECT;

                        // Entry.ZumiMiniLite.sendCommand(
                        //     CommandType.COMMAND_NONE
                        // );

                        if(Entry.ZumiMiniLite.zumiCatDetected == 0x00)
                        {
                            if(sel_detect == 'DETECT') return false;
                            else if(sel_detect == 'CX') return parseInt(-999);
                            else if(sel_detect == 'CY') return parseInt(-999);
                        }
                        else
                        {
                            if(sel_detect == 'DETECT')  return true;

                            else if(sel_detect == 'CX')
                            {
                                var Xg = Entry.ZumiMiniLite.zumiCatCenter[0];
                                return ((200 / 2) - Xg) + 20;
                            }
                            else if(sel_detect == 'CY')
                            {
                                var Yg = Entry.ZumiMiniLite.zumiCatCenter[1];
                                return  ((200 / 2) - Yg) + 30;
                            }
                        }
                    },
                },
                zumiMiniLite_color_detector: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    fontColor: '#ffffff',
                    skeleton: 'basic_string_field',
                    statements: [],//
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.zumiMiniLite_color, 'COLOR'],
                                [Lang.Blocks.zumiMiniLite_cx, 'CX'],
                                [Lang.Blocks.zumiMiniLite_cy, 'CY'],
                            ],
                            value: 'COLOR',//
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                        {
                            type: 'Indicator',
                            img: 'block_icon/hardwarelite_icon.svg',
                            size: 14,
                        },
                    ],
                    def: {
                        params: ['COLOR', null],
                        type: 'zumiMiniLite_color_detector',
                    },
                    paramsKeyMap: {
                        PARAM: 0,
                    },
                    class: 'info',
                    isNotFor: ['ZumiMiniLite'],
                    func(sprite, script) {

                        const sen = script.getValue('PARAM');
                        Entry.ZumiMiniLite.current_request |= RequestType.REQUEST_ENTRY_COLOR_DETECT;

                        // Entry.ZumiMiniLite.sendCommand(
                        //     CommandType.COMMAND_NONE
                        // );

                        var result = Entry.ZumiMiniLite.zumiColorDetected;

                        if((result == 0xFE) && (sen == 'COLOR')) result = 'NONE';
                        else if ((result == 0x00) && (sen == 'COLOR')) result = 'RED';
                        else if ((result == 0x01) && (sen == 'COLOR')) result = 'ORANGE';
                        else if ((result == 0x02) && (sen == 'COLOR')) result = 'YELLOW';
                        else if ((result == 0x03) && (sen == 'COLOR')) result = 'GREEN';
                        else if ((result == 0x04) && (sen == 'COLOR')) result = 'CYAN';
                        else if ((result == 0x05) && (sen == 'COLOR')) result = 'BLUE';
                        else if ((result == 0x06) && (sen == 'COLOR')) result = 'PURPLE';

                        var Xg = Entry.ZumiMiniLite.zumiColorCenter[0];
                        var Yg = Entry.ZumiMiniLite.zumiColorCenter[1];

                        if (sen == 'CX') {
                            if (result == 0xFE) result = -999;
                            else result = ((200 / 2) - Xg) +20;
                        }
                        else if (sen == 'CY') {
                            if (result == 0xFE) result = -999;
                            else result = ((200 / 2) - Yg) +35;
                        }

                        return result;
                    },
                },
                zumiMiniLite_april_detector: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    fontColor: '#ffffff',
                    skeleton: 'basic_string_field',
                    statements: [],//
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.zumiMiniLite_id, 'ID'],
                                [Lang.Blocks.zumiMiniLite_cx, 'CX'],
                                [Lang.Blocks.zumiMiniLite_cy, 'CY'],
                            ],
                            value: 'ID',//
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                        {
                            type: 'Indicator',
                            img: 'block_icon/hardwarelite_icon.svg',
                            size: 14,
                        },
                    ],
                    def: {
                        params: ['ID', null],
                        type: 'zumiMiniLite_april_detector',
                    },
                    paramsKeyMap: {
                        PARAM: 0,
                    },
                    class: 'info',
                    isNotFor: ['ZumiMiniLite'],
                    func(sprite, script) {

                        const sen = script.getValue('PARAM');

                        Entry.ZumiMiniLite.current_request |= RequestType.REQUEST_ENTRY_APRIL_DETECT;

                        // Entry.ZumiMiniLite.sendCommand(
                        //     CommandType.COMMAND_NONE
                        // );

                        var result = Entry.ZumiMiniLite.zumiMarkerDetected;
                        var Xg = Entry.ZumiMiniLite.zumiMarkerCenter[0];
                        var Yg = Entry.ZumiMiniLite.zumiMarkerCenter[1];


                        if(sen == 'ID')
                        {
                            if(result == 0xFE) result = -1;
                            else
                            {
                                if(result <11) result +=1;
                                else if(result == 14) result = 12;
                                else if(result == 15) result = 13;
                                else if(result == 16) result = 14;
                                else if(result == 18) result = 15;
                                else if(result == 19) result = 16;
                                else if(result == 20) result = 17;
                            }
                        }
                        else if(sen == 'CX')
                        {
                            if(result == 0xFE) result = -999;
                            else result = (200 / 2) - Xg;
                        }
                        else if (sen == 'CY')
                        {
                            if (result == 0xFE) result = -999;
                            else result = (100 / 2) - Yg;
                        }

                        return result;
                    },
                },
            };
        }
        /***************************************************************************************
         *  프로토롤 제어 함수 (데이터 송신)
        ***************************************************************************************/
        makeData(msg){
            console.log(msg);
        }

        sendCommand(commandType, ...params) {

            const commandName = Object.keys(CommandType).find(key => CommandType[key] === commandType);
            if (!commandName) {
                console.error(`Unknown commandType: ${commandType}`);
                return;
            }
            //console.log(commandName);

            const paramLength = CommandType_DATA_LENGTH[commandName] || 0;

            const payloadBytes = new Uint8Array(1 + paramLength);

            payloadBytes[0] = commandType;

            for (let i = 0; i < params.length && i < paramLength; i++) {
                payloadBytes[i + 1] = params[i] & 0xFF;
            }

            Entry.ZumiMiniLite.transferData(payloadBytes);
        }

        transferData(payloadBytes) {

            const HEADER1 = 0x24; // '$'
            const HEADER2 = 0x52; // 'R'

            const fullMessageLength = 4 + payloadBytes.length-1;

            const dataArray = new Uint8Array(fullMessageLength);
            let index = 0;

            dataArray[index++] = HEADER1;
            dataArray[index++] = HEADER2;
            dataArray[index++] = payloadBytes[0];
            dataArray[index++] = Entry.ZumiMiniLite.current_request;

            dataArray.set(payloadBytes.slice(1), index);

            Entry.ZumiMiniLite.sendBuffers = [];
            Entry.ZumiMiniLite.sendBuffers.push(...dataArray);
        }

        /***************************************************************************************
         *  데이터 수신
        ***************************************************************************************/
        _updateDataStore(dataArray) {

            const offset = this.HEADER_LENGTH;

            this.reqINFO = dataArray[PacketIndex.DATA_INFO - offset];
            this.reqREQ = dataArray[PacketIndex.DATA_REQ - offset];
            this.reqPSTAT = dataArray[PacketIndex.DATA_PSTAT - offset];
            this.btn = dataArray[PacketIndex.DATA_BTN_INPUT - offset];
            this.battery = dataArray[PacketIndex.DATA_BATTERY - offset];

            this.senFR = dataArray[PacketIndex.DATA_SEN_FR - offset];
            this.senFL = dataArray[PacketIndex.DATA_SEN_FL - offset];
            this.senBR = dataArray[PacketIndex.DATA_SEN_BR - offset];
            this.senBC = dataArray[PacketIndex.DATA_SEN_BC - offset];
            this.senBL = dataArray[PacketIndex.DATA_SEN_BL - offset];

            this.zumiFaceDetected = dataArray[PacketIndex.DATA_DETECT_FACE - offset] === 1;
            this.zumiFaceCenter[0] = dataArray[PacketIndex.DATA_DETECT_FACE_X - offset];
            this.zumiFaceCenter[1] = dataArray[PacketIndex.DATA_DETECT_FACE_Y - offset];

            this.zumiColorDetected = dataArray[PacketIndex.DATA_DETECT_COLOR - offset];
            this.zumiColorCenter[0] = dataArray[PacketIndex.DATA_DETECT_COLOR_X - offset];
            this.zumiColorCenter[1] = dataArray[PacketIndex.DATA_DETECT_COLOR_Y - offset];

            this.zumiMarkerDetected = dataArray[PacketIndex.DATA_DETECT_MARKER - offset];
            this.zumiMarkerCenter[0] = dataArray[PacketIndex.DATA_DETECT_MARKER_X - offset];
            this.zumiMarkerCenter[1] = dataArray[PacketIndex.DATA_DETECT_MARKER_Y - offset];

            this.zumiCatDetected = dataArray[PacketIndex.DATA_DETECT_CAT - offset] === 1;
            this.zumiCatCenter[0] = dataArray[PacketIndex.DATA_DETECT_CAT_X - offset];
            this.zumiCatCenter[1] = dataArray[PacketIndex.DATA_DETECT_CAT_Y - offset];
        }

        _processReceiverByte(data) {
            if (this.receiverState === this.StateLoading.Failure) {
                this.receiverState = this.StateLoading.Ready;
            }

            if (this.receiverState === this.StateLoading.Ready) {
                this.receiverSection = this.Section.Start;
                this.receiverIndex = 0;
            }

            else if (this.receiverState === this.StateLoading.Loaded){
                return this.receiverState;
            }

            if (this.receiverSection !== this.receiverSectionOld) {
                this.receiverIndex = 0;
                this.receiverSectionOld = this.receiverSection;
            }

            if (this.receiverSection === this.Section.Start) {
                if (this.receiverIndex === 0) {
                    if (data === this.PACKET_START_BYTE1) {
                        this.receiverState = this.StateLoading.Receiving;
                    } else {
                        this.receiverState = this.StateLoading.Failure;
                        this.receiverMessage = "Error: Invalid Start Byte 1";
                        console.log(receiverMessage);
                        return this.receiverState;
                    }
                } else if (this.receiverIndex === 1) {
                    if (data === this.PACKET_START_BYTE2) {
                        this.receiverSection = this.Section.Data;
                        this.receiverBuffer = [];
                    } else {
                        this.receiverState = this.StateLoading.Failure;
                        this.receiverMessage = "Error: Invalid Start Byte 2";
                        console.log(receiverMessage);
                        return this.receiverState;
                    }
                }
            }

            else if (this.receiverSection === this.Section.Data) {
                this.receiverBuffer.push(data);
                if (this.receiverIndex === (this.PACKET_DATA_LENGTH - 1)) {
                    this.receiverSection = this.Section.End;
                }
            }

            else if (this.receiverSection === this.Section.End) {
                if (this.receiverIndex === 1) {
                    this.receiverData = [...this.receiverBuffer];
                    this.receiverState = this.StateLoading.Loaded;
                    this.receiverMessage = "Success: Receive complete";

                    return this.receiverState;
                }
            }

            if (this.receiverState === this.StateLoading.Receiving) {
                this.receiverIndex++;
            }

            return this.receiverState;
        }

        _resetReceiverState() {
            this.receiverState = this.StateLoading.Ready;
            this.receiverSection = this.Section.Start;
            this.receiverIndex = 0;
            this.receiverBuffer = []; // 수신 버퍼 클리어
            this.receiverMessage = null;
        }

        runCommandBlock = async function(sendCommandFunc) {
            const STATUS_WAIT = 0;
            const STATUS_SENDING = 1;
            const STATUS_MOVING = 2;
            const HW_READY = 0;
            const HW_PROCESSING = 1;
            var exCnt = 1, tempCnt = 0;

            let currentStep = STATUS_WAIT;
            let iter = 0;
            let shouldExitBlock = false;

            await new Promise(resolve => {
                setTimeout(() => {
                    if (exCnt === tempCnt) {
                        shouldExitBlock = true;
                       // console.log(" Block Skip Condition Met");
                    }
                    else
                    {
                       // console.log(" not Block Skip Condition");
                    }
                    resolve();
                }, 200);
            });

            await new Promise(resolve => {
                const pollingInterval = setInterval(() => {
                    if (shouldExitBlock) {
                        clearInterval(pollingInterval);
                        return resolve();
                    }

                    const hardwareStatus = Entry.ZumiMiniLite.reqPSTAT;

                    if((currentStep == STATUS_WAIT) && (hardwareStatus === HW_READY))
                        {
                            currentStep = STATUS_SENDING;
                        }
                    else if ((currentStep == STATUS_WAIT) && (hardwareStatus == HW_PROCESSING))
                        {
                            currentStep = STATUS_WAIT;
                        }

                    switch (currentStep) {
                        // case STATUS_WAIT:
                        //     if (hardwareStatus === HW_READY) currentStep = STATUS_SENDING;
                        //     break;

                        case STATUS_SENDING:

                            if (hardwareStatus === HW_READY)
                            {
                                if (iter < 5) {
                                    sendCommandFunc();  // ← 여기만 명령 함수 주입
                                    iter++;
                                }
                                else {
                                    Entry.ZumiMiniLite.sendBuffers = [];
                                    clearInterval(pollingInterval);
                                    return resolve();
                                }
                            }
                            else if (hardwareStatus === HW_PROCESSING)
                            {
                                currentStep = STATUS_MOVING;
                                Entry.ZumiMiniLite.sendBuffers = [];
                            }
                            break;

                        case STATUS_MOVING:
                            if (hardwareStatus === HW_READY) {
                                clearInterval(pollingInterval);
                                return resolve();
                            }
                            break;
                    }
                }, 50);//650
            });
        };

    })();
})();

module.exports = Entry.ZumiMiniLite;
