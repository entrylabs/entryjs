'use strict';

const _clamp = require('lodash/clamp');
const _get = require('lodash/get');

const functionKeys = {
    TEST_MESSAGE: 0xfa,
    RESET: 0xfe,
    CHECK_READY: 0xff,
    SET_LED: 0x01,
    SET_STRING: 0x02,
    SET_IMAGE: 0x03,
    SET_TONE: 0x04,
    SET_TEMPO: 0x05,
    SET_RELATIVE_TEMPO: 0x06,
    SET_DIGITAL: 0x07,
    SET_ANALOG: 0x08,
    RESET_SCREEN: 0x09,
    SET_ANALOG_PERIOD: 0x10,
    SET_SERVO: 0x11,
    SET_SERVO_PERIOD: 0x12,
    SET_CUSTOM_IMAGE: 0x13,

    GET_LED: 0x31,
    GET_ANALOG: 0x32,
    GET_DIGITAL: 0x33,
    GET_BUTTON: 0x34,
    GET_LIGHT_LEVEL: 0x35,
    GET_TEMPERATURE: 0x36,
    GET_COMPASS_HEADING: 0x37,
    GET_ACCELEROMETER: 0x38,
    GET_PITCH: 0x39,
    GET_ROLL: 0x40,
    GET_GESTURE: 0x41,
};

const microbitGestures = {
    TILT_UP: 1,
    TILT_DOWN: 2,
    TILT_LEFT: 3,
    TILT_RIGHT: 4,
    FACE_UP: 5,
    FACE_DOWN: 6,
    FREEFALL: 7,
    THREE_G: 8,
    SIX_G: 9,
    EIGHT_G: 10,
    SHAKE: 11,
};

Entry.MicrobitExt = new (class MicrobitExt {
    constructor() {
        this.id = '22.2';
        this.url = 'http://microbit.org/ko/';
        this.imageName = 'microbit_ext.png';
        this.title = {
            en: 'MicrobitExt',
            ko: '마이크로빗 확장',
        };
        this.name = 'microbitExt';
        this.communicationType = 'manual';
        this.lastGesture = -1;
        this.blockMenuBlocks = [
            'microbit_ext_led_toggle',
            'microbit_ext_get_led',
            'microbit_ext_show_string',
            'microbit_ext_show_image',
            'microbit_ext_set_led_image',
            'microbit_ext_reset_screen',
            'microbit_ext_set_analog',
            'microbit_ext_set_analog_period',
            'microbit_ext_get_analog',
            'microbit_ext_get_analog_map',
            'microbit_ext_set_digital',
            'microbit_ext_get_digital',
            'microbit_ext_set_tone',
            'microbit_ext_set_tempo',
            'microbit_ext_set_relative_tempo',
            'microbit_ext_get_button',
            'microbit_ext_is_tilt',
            'microbit_ext_get_tilt',
            'microbit_ext_get_gesture',
            'microbit_ext_get_sensor',
            'microbit_ext_get_accelerometer',
            'microbit_ext_set_servo',
            'microbit_ext_set_servo_period',
        ];
        this.commandStatus = {};
    }

    setZero() {
        this.requestCommand(functionKeys.RESET);
        this.lastGesture = -1;
        this.commandStatus = {};
        this.isEngineStop = true;
        delete Entry.hw.portData.sensorData;
    }

    requestCommand(type, payload) {
        this.isEngineStop = false;
        Entry.hw.sendQueue = {
            type,
            payload,
        };
        Entry.hw.update();
    }

    /**
     * command 요청 후 데이터 송수신이 끝날 때까지 대기한다.
     * @param type
     * @param payload
     */
    requestCommandWithResponse(entityId, type, payload) {
        this.isEngineStop = false;
        const codeId = `${entityId}-${type}`;
        if (!this.commandStatus[codeId]) {
            // 첫 진입시 무조건 AsyncError
            Entry.hw.sendQueue = {
                type,
                payload,
            };
            this.commandStatus[codeId] = 'pending';
            Entry.hw.sendQueue.codeId = codeId;
            Entry.hw.update();
            throw new Entry.Utils.AsyncError();
        } else if (this.commandStatus[codeId] === 'pending') {
            // 두 번째 이상의 진입시도이며 작업이 아직 끝나지 않은 경우
            throw new Entry.Utils.AsyncError();
        } else if (this.commandStatus[codeId] === 'completed') {
            // 두 번째 이상의 진입시도이며 pending 도 아닌 경우
            // 블록 func 로직에서 다음 데이터를 처리한다.
            this.commandStatus[codeId] = null;
        }
    }

    afterReceive(portData) {
        if (this.isEngineStop) {
            return;
        }
        if (!portData.payload) {
            return;
        }
        if (portData.payload.isSensorMap) {
            return;
        }
        if (portData.payload.codeId) {
            this.commandStatus[portData.payload.codeId] = 'completed';
        }
        if (portData.payload.codeIdMiss) {
            this.commandStatus[portData.payload.codeIdMiss] = 'completed';
        }
    }
    setLanguage() {
        return {
            ko: {
                template: {
                    microbit_ext_led_toggle: 'LED의 X:%1 Y:%2 %3 %4',
                    microbit_ext_get_led: 'LED의 X:%1 Y:%2 상태값',
                    microbit_ext_show_string: '%1 출력하기 %2',
                    microbit_ext_show_image: '%1 아이콘 출력하기 %2',
                    microbit_ext_set_led_image: 'LED %1 으로 출력하기 %2',
                    microbit_ext_reset_screen: '화면 지우기 %1',
                    microbit_ext_set_tone: '%1 음을 %2 박자 연주하기 %3',
                    microbit_ext_set_tempo: '연주 속도를 %1 BPM 으로 정하기 %2',
                    microbit_ext_set_relative_tempo: '연주 속도를 %1 BPM 만큼 바꾸기 %2',
                    microbit_ext_set_analog: '%1 에 아날로그 값 %2 출력 %3',
                    microbit_ext_set_analog_period:
                        '%1 에 아날로그 PWM 출력 주기를 %2 마이크로초 로 설정 %3',
                    microbit_ext_get_analog: '아날로그 핀 %1번 센서값',
                    microbit_ext_get_analog_map:
                        '아날로그 핀 %1번 센서값의 범위를 %2~%3 에서 %4~%5 (으)로 바꾼값',
                    microbit_ext_set_digital: '%1 에 디지털 값 %2 출력 %3',
                    microbit_ext_get_digital: '디지털 핀 %1번 센서값',
                    microbit_ext_get_button: '%1 버튼을 눌렀는가?',
                    microbit_ext_get_sensor: '%1 센서값',
                    microbit_ext_is_tilt: '%1 방향으로 기울었는가?',
                    microbit_ext_get_tilt: '%1 방향으로 기울어진 각도값',
                    microbit_ext_get_accelerometer: '가속도 센서 %1의 값',
                    microbit_ext_set_servo: '%1 에 서보 값 %2 출력 %3',
                    microbit_ext_set_servo_period: '%1 에 서보 펄스 폭을 %2 마이크로초로 설정 %3',
                    microbit_ext_get_gesture: '%1 이 감지되는가?',
                },
                Blocks: {
                    microbit_ext_acc_xaxis: 'x축',
                    microbit_ext_acc_yaxis: 'y축',
                    microbit_ext_acc_zaxis: 'z축',
                    microbit_ext_acc_strength: '크기',
                    microbit_ext_tilt_right: '오른쪽',
                    microbit_ext_tilt_left: '왼쪽',
                    microbit_ext_tilt_rear: '뒤쪽',
                    microbit_ext_tilt_front: '앞쪽',
                    microbit_ext_sensor_temperature: '온도',
                    microbit_ext_sensor_compass: '자기',
                    microbit_ext_sensor_light: '빛',
                    microbit_ext_tone_b: '시',
                    microbit_ext_tone_a_sharp: '라#',
                    microbit_ext_tone_a: '라',
                    microbit_ext_tone_g_sharp: '솔#',
                    microbit_ext_tone_g: '솔',
                    microbit_ext_tone_f_sharp: '파#',
                    microbit_ext_tone_f: '파',
                    microbit_ext_tone_e: '미',
                    microbit_ext_tone_d_sharp: '레#',
                    microbit_ext_tone_d: '레',
                    microbit_ext_tone_c_sharp: '도#',
                    microbit_ext_tone_c: '도',
                    microbit_ext_tone_high: '높은',
                    microbit_ext_tone_middle: '',
                    microbit_ext_tone_low: '낮은',
                    microbit_ext_image_target: '표적',
                    microbit_ext_image_rake: '갈퀴',
                    microbit_ext_image_eighth_note: '8분 음표',
                    microbit_ext_image_quarter_note: '4분 음표',
                    microbit_ext_image_ox: '소',
                    microbit_ext_image_rabbit: '토끼',
                    microbit_ext_image_snake: '뱀',
                    microbit_ext_image_umbrella: '우산',
                    microbit_ext_image_skull: '해골',
                    microbit_ext_image_giraffe: '기린',
                    microbit_ext_image_sword: '칼',
                    microbit_ext_image_ghost: '유령',
                    microbit_ext_image_stickman: '스틱맨',
                    microbit_ext_image_butterfly: '나비',
                    microbit_ext_image_turtle: '거북이',
                    microbit_ext_image_house: '집',
                    microbit_ext_image_duck: '오리',
                    microbit_ext_image_rollerskate: '롤러스케이트',
                    microbit_ext_image_tshirt: '티셔츠',
                    microbit_ext_image_scissors: '가위',
                    microbit_ext_image_small_square: '작은 사각형',
                    microbit_ext_image_square: '사각형',
                    microbit_ext_image_small_diamond: '작은 다이아몬드',
                    microbit_ext_image_diamond: '다이아몬드',
                    microbit_ext_image_chessboard: '체스판',
                    microbit_ext_image_left_triangle: '왼쪽 삼각형',
                    microbit_ext_image_triangle: '삼각형',
                    microbit_ext_image_no: '노놉',
                    microbit_ext_image_yes: '예스',
                    microbit_ext_image_not_good: '별로',
                    microbit_ext_image_fantastic: '환상적인',
                    microbit_ext_image_fool: '바보',
                    microbit_ext_image_surprised: '놀람',
                    microbit_ext_image_sleepy: '졸림',
                    microbit_ext_image_angry: '화남',
                    microbit_ext_image_confused: '혼란',
                    microbit_ext_image_sadness: '슬픔',
                    microbit_ext_image_happiness: '행복함',
                    microbit_ext_image_small_heart: '작은 하트',
                    microbit_ext_image_heart: '하트',
                    microbit_ext_led_toggle_on: '켜기',
                    microbit_ext_led_toggle_off: '끄기',
                    microbit_ext_led_toggle_toggle: '반전',
                    microbit_ext_gesture_shake: '흔들림',
                    microbit_ext_gesture_portrait_top: '세워서 위쪽 방향',
                    microbit_ext_gesture_portrait_bottom: '세워서 아래쪽 방향',
                    microbit_ext_gesture_portrait_right: '세워서 오른쪽 방향',
                    microbit_ext_gesture_portrait_left: '세워서 왼쪽 방향',
                    microbit_ext_gesture_horizontal_top: '눕혀서 위쪽 방향',
                    microbit_ext_gesture_horizontal_bottom: '눕혀서 아래쪽 방향',
                    microbit_ext_gesture_horizontal_right: '눕혀서 오른쪽 방향',
                    microbit_ext_gesture_horizontal_left: '눕혀서 왼쪽 방향',
                },
            },
            en: {
                template: {
                    microbit_ext_led_toggle: 'LED X:%1 Y:%2 %3 %4',
                    microbit_ext_get_led: 'LED X:%1 Y:%2 Value',
                    microbit_ext_show_string: '%1 appear %2',
                    microbit_ext_show_image: '%1 icon appear %2',
                    microbit_ext_set_led_image: 'Show %1 leds %2',
                    microbit_ext_reset_screen: 'Clear screen %1',
                    microbit_ext_set_tone: 'Play %1 for %2 beat %3',
                    microbit_ext_set_tempo: 'Set tempo to %1 BPM %2',
                    microbit_ext_set_relative_tempo: 'Change tempo by %1 BPM %2',
                    microbit_ext_set_analog: 'Analog writen pin %1 to %2 %3',
                    microbit_ext_set_analog_period: 'Analog set period pin %1 to microsecond %2 %3',
                    microbit_ext_get_analog: 'Analog %1 Sensor Value',
                    microbit_ext_get_analog_map:
                        'Change analog %1 Sensor Value from %2 ~ %3 to %4 ~ %5',
                    microbit_ext_set_digital: 'Analog writen pin %1 to %2 %3',
                    microbit_ext_get_digital: 'Digital %1 Sensor Value',
                    microbit_ext_get_button: 'Button %1 is pressed?',
                    microbit_ext_get_sensor: 'value of %1 sensor',
                    microbit_ext_is_tilt: 'Tilted to the %1?',
                    microbit_ext_get_tilt: 'Angle value tilted to the %1',
                    microbit_ext_get_accelerometer: 'Acceleration %1',
                    microbit_ext_set_servo: 'Servo write pin %1 to %2 %3',
                    microbit_ext_set_servo_period: 'Set servo %1 pulse to %2 microsecond %3',
                    microbit_ext_get_gesture: '%1 Sensor Value?',
                },
                Blocks: {
                    microbit_ext_acc_xaxis: 'x',
                    microbit_ext_acc_yaxis: 'y',
                    microbit_ext_acc_zaxis: 'z',
                    microbit_ext_acc_strength: 'Strength',
                    microbit_ext_tilt_right: 'Right',
                    microbit_ext_tilt_left: 'Left',
                    microbit_ext_tilt_rear: 'Rear',
                    microbit_ext_tilt_front: 'Front',
                    microbit_ext_sensor_temperature: 'Temperature',
                    microbit_ext_sensor_compass: 'Compass',
                    microbit_ext_sensor_light: 'Light',
                    microbit_ext_tone_high: 'HIGH',
                    microbit_ext_tone_middle: 'MIDDLE',
                    microbit_ext_tone_low: 'Low',
                    microbit_ext_tone_b: 'B',
                    microbit_ext_tone_a_sharp: 'A#',
                    microbit_ext_tone_a: 'A',
                    microbit_ext_tone_g_sharp: 'G#',
                    microbit_ext_tone_g: 'G',
                    microbit_ext_tone_f_sharp: 'F#',
                    microbit_ext_tone_f: 'F',
                    microbit_ext_tone_e: 'E',
                    microbit_ext_tone_d_sharp: 'D#',
                    microbit_ext_tone_d: 'D',
                    microbit_ext_tone_c_sharp: 'C#',
                    microbit_ext_tone_c: 'C',
                    microbit_ext_image_target: 'Target',
                    microbit_ext_image_rake: 'Rake',
                    microbit_ext_image_eighth_note: 'Eighth note',
                    microbit_ext_image_quarter_note: 'Quarter note',
                    microbit_ext_image_ox: 'Ox',
                    microbit_ext_image_rabbit: 'Rabbit',
                    microbit_ext_image_snake: 'Snake',
                    microbit_ext_image_umbrella: 'Umbrella',
                    microbit_ext_image_skull: 'Skull',
                    microbit_ext_image_giraffe: 'Giraffe',
                    microbit_ext_image_sword: 'Sword',
                    microbit_ext_image_ghost: 'Ghost',
                    microbit_ext_image_stickman: 'Stickfigure',
                    microbit_ext_image_butterfly: 'Butterfly',
                    microbit_ext_image_turtle: 'Turtle',
                    microbit_ext_image_house: 'House',
                    microbit_ext_image_duck: 'Duck',
                    microbit_ext_image_rollerskate: 'Rollerskate',
                    microbit_ext_image_tshirt: 'T-shirt',
                    microbit_ext_image_scissors: 'Scissors',
                    microbit_ext_image_small_square: 'Small Square',
                    microbit_ext_image_square: 'Square',
                    microbit_ext_image_small_diamond: 'Small Diamond',
                    microbit_ext_image_diamond: 'Diamond',
                    microbit_ext_image_chessboard: 'Chessboard',
                    microbit_ext_image_left_triangle: 'Left Triangle',
                    microbit_ext_image_triangle: 'Triangle',
                    microbit_ext_image_no: 'Nope',
                    microbit_ext_image_yes: 'Yes',
                    microbit_ext_image_not_good: 'Not Good',
                    microbit_ext_image_fantastic: 'fantastic',
                    microbit_ext_image_fool: 'Fool',
                    microbit_ext_image_surprised: 'Surpriesd',
                    microbit_ext_image_sleepy: 'Sleepy',
                    microbit_ext_image_angry: 'Angry',
                    microbit_ext_image_confused: 'Confused',
                    microbit_ext_image_sadness: 'Sadness',
                    microbit_ext_image_happiness: 'Happiness',
                    microbit_ext_image_small_heart: 'Small Heart',
                    microbit_ext_image_heart: 'Heart',
                    microbit_ext_led_toggle_on: 'On',
                    microbit_ext_led_toggle_off: 'Off',
                    microbit_ext_led_toggle_toggle: 'Reverse',
                    microbit_ext_gesture_shake: 'Shake',
                    microbit_ext_gesture_portrait_top: 'Portrait Top',
                    microbit_ext_gesture_portrait_bottom: 'Portrait Bottom',
                    microbit_ext_gesture_portrait_right: 'Portrait Right',
                    microbit_ext_gesture_portrait_left: 'Portrait Left',
                    microbit_ext_gesture_horizontal_top: 'Horizontal Top',
                    microbit_ext_gesture_horizontal_bottom: 'Horizontal Bottom',
                    microbit_ext_gesture_horizontal_right: 'Horizontal Right',
                    microbit_ext_gesture_horizontal_left: 'Horizontal Left',
                },
            },
            jp: {
                template: {
                    microbit_ext_led_toggle: 'LED X:%1 Y:%2 %3 %4',
                    microbit_ext_get_led: 'LED X:%1 Y:%2 が点灯している',
                    microbit_ext_show_string: '%1 文字列を表示 %2',
                    microbit_ext_show_image: '%1 アイコンを表示 %2',
                    microbit_ext_set_led_image: '%1 LED画面に表示 %2',
                    microbit_ext_reset_screen: '表示のクリア %1',
                    microbit_ext_set_tone: '%1 音を %2 拍子演奏する %3',
                    microbit_ext_set_tempo: '演奏スピードを %1 BPM に決める %2',
                    microbit_ext_set_relative_tempo: '演奏スピードを %1 BPM変更する %2',
                    microbit_ext_set_analog: 'アナログで出力する 端子 %1 値 %2 %3',
                    microbit_ext_set_analog_period:
                        'アナログ出力 パルス周期を設定する 端子 %1 周期（マイクロ秒）%2 %3',
                    microbit_ext_get_analog: 'アナログピン %1 番のセンサー値',
                    microbit_ext_get_analog_map:
                        'アナログピン %1 番のセンサー値の範囲を %2 ～ %3 から %4 ～ %5 に変更した値',
                    microbit_ext_set_digital: 'アナログで出力する 端子 %1 値 %2 %3',
                    microbit_ext_get_digital: 'デジタルピン %1 番のセンサー値',
                    microbit_ext_get_button: '%1 ボタンを押したか？',
                    microbit_ext_get_sensor: '%1 センサー値',
                    microbit_ext_is_tilt: '%1 に傾いているか？',
                    microbit_ext_get_tilt: '%1 に傾いた角度',
                    microbit_ext_get_accelerometer: '加速度センサー %1 の値',
                    microbit_ext_set_servo: 'サーボ 出力する 端子 %1 角度 %2 %3',
                    microbit_ext_set_servo_period: 'Servo %1 パルス幅の設定（マイクロ秒） %2 %3',
                    microbit_ext_get_gesture: '%1 があるか？',
                },
                Blocks: {
                    microbit_ext_acc_xaxis: 'x軸',
                    microbit_ext_acc_yaxis: 'y軸',
                    microbit_ext_acc_zaxis: 'z軸',
                    microbit_ext_acc_strength: '大きさ',
                    microbit_ext_tilt_right: '右',
                    microbit_ext_tilt_left: '左',
                    microbit_ext_tilt_rear: '後ろ',
                    microbit_ext_tilt_front: '前方',
                    microbit_ext_sensor_temperature: '温度',
                    microbit_ext_sensor_compass: '磁気',
                    microbit_ext_sensor_light: '光',
                    microbit_ext_tone_high: '高い',
                    microbit_ext_tone_middle: '',
                    microbit_ext_tone_low: '低い',

                    microbit_ext_tone_b: 'シ',
                    microbit_ext_tone_a_sharp: 'ラ#',
                    microbit_ext_tone_a: 'ラ',
                    microbit_ext_tone_g_sharp: 'ソ#',
                    microbit_ext_tone_g: 'ソ',
                    microbit_ext_tone_f_sharp: 'ファ#',
                    microbit_ext_tone_f: 'ファ',
                    microbit_ext_tone_e: 'ミ',
                    microbit_ext_tone_d_sharp: 'レ#',
                    microbit_ext_tone_d: 'レ',
                    microbit_ext_tone_c_sharp: 'ド#',
                    microbit_ext_tone_c: 'ド',
                    microbit_ext_image_target: '目標',
                    microbit_ext_image_rake: 'レーキ',
                    microbit_ext_image_eighth_note: '8分音符',
                    microbit_ext_image_quarter_note: '4分音符',
                    microbit_ext_image_ox: '牛',
                    microbit_ext_image_rabbit: 'ウサギ',
                    microbit_ext_image_snake: 'ヘビ',
                    microbit_ext_image_umbrella: '傘',
                    microbit_ext_image_skull: '頭蓋骨',
                    microbit_ext_image_giraffe: 'キリン',
                    microbit_ext_image_sword: '剣',
                    microbit_ext_image_ghost: '幽霊',
                    microbit_ext_image_stickman: '棒人間',
                    microbit_ext_image_butterfly: 'バタフライ',
                    microbit_ext_image_turtle: 'カメ',
                    microbit_ext_image_house: '家',
                    microbit_ext_image_duck: 'アヒル',
                    microbit_ext_image_rollerskate: 'ローラースケート',
                    microbit_ext_image_tshirt: 'Tシャツ',
                    microbit_ext_image_scissors: 'はさみ',
                    microbit_ext_image_small_square: '小さな四角形',
                    microbit_ext_image_square: '四角形',
                    microbit_ext_image_small_diamond: '小さなダイヤモンド',
                    microbit_ext_image_diamond: 'ダイヤモンド',
                    microbit_ext_image_chessboard: 'チェス盤',
                    microbit_ext_image_left_triangle: '左の三角形',
                    microbit_ext_image_triangle: '三角形',
                    microbit_ext_image_no: 'いや',
                    microbit_ext_image_yes: '良かった',
                    microbit_ext_image_not_good: '良くない',
                    microbit_ext_image_fantastic: '素晴らしい',
                    microbit_ext_image_fool: 'バカ',
                    microbit_ext_image_surprised: 'びっくり',
                    microbit_ext_image_sleepy: '眠いです',
                    microbit_ext_image_angry: '怒り',
                    microbit_ext_image_confused: '混乱した',
                    microbit_ext_image_sadness: '悲しみ',
                    microbit_ext_image_happiness: '幸せ',
                    microbit_ext_image_small_heart: '小さな心',
                    microbit_ext_image_heart: 'ハート',
                    microbit_ext_led_toggle_on: '点灯',
                    microbit_ext_led_toggle_off: '消灯',
                    microbit_ext_led_toggle_toggle: '反転',
                    microbit_ext_gesture_shake: '揺れ',
                    microbit_ext_gesture_portrait_top: '立て上方向',
                    microbit_ext_gesture_portrait_bottom: '立て下向き',
                    microbit_ext_gesture_portrait_right: '立て右方向',
                    microbit_ext_gesture_portrait_left: '立て左方向',
                    microbit_ext_gesture_horizontal_top: '寝かせ上方向',
                    microbit_ext_gesture_horizontal_bottom: '寝かせ、下方向',
                    microbit_ext_gesture_horizontal_right: '寝かせ右方向',
                    microbit_ext_gesture_horizontal_left: '寝かせ左方向',
                },
            },
        };
    }

    getBlocks() {
        return {
            microbit_ext_led_toggle: {
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
                        type: 'Dropdown',
                        options: [
                            [Lang.Blocks.microbit_ext_led_toggle_on, 'on'],
                            [Lang.Blocks.microbit_ext_led_toggle_off, 'off'],
                            [Lang.Blocks.microbit_ext_led_toggle_toggle, 'toggle'],
                        ],
                        value: 'on',
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
                class: 'microbitExtLed',
                isNotFor: ['microbitExt'],
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
                    ],
                    type: 'microbit_ext_led_toggle',
                },
                paramsKeyMap: {
                    X: 0,
                    Y: 1,
                    VALUE: 2,
                },
                func: (sprite, script) => {
                    const value = script.getField('VALUE');
                    const x = _clamp(script.getNumberValue('X'), 0, 4);
                    const y = _clamp(script.getNumberValue('Y'), 0, 4);
                    this.requestCommandWithResponse(script.entity.id, functionKeys.SET_LED, {
                        x,
                        y,
                        value,
                    });
                },
            },
            microbit_ext_get_led: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                fontColor: '#ffffff',
                skeleton: 'basic_string_field',
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
                ],
                events: {},
                class: 'microbitExtLed',
                isNotFor: ['microbitExt'],
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
                    ],
                    type: 'microbit_ext_get_led',
                },
                paramsKeyMap: {
                    X: 0,
                    Y: 1,
                },
                func: (sprite, script) => {
                    const x = _clamp(script.getNumberValue('X'), 0, 4);
                    const y = _clamp(script.getNumberValue('Y'), 0, 4);
                    this.requestCommandWithResponse(script.entity.id, functionKeys.GET_LED, {
                        x,
                        y,
                    });
                    return _get(Entry.hw.portData, ['payload', 'sensorData', 'led', x, y]);
                },
            },
            microbit_ext_show_string: {
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
                class: 'microbitExtLed',
                isNotFor: ['microbitExt'],
                def: {
                    params: [
                        {
                            type: 'text',
                            params: ['Hello!'],
                        },
                    ],
                    type: 'microbit_ext_show_string',
                },
                paramsKeyMap: {
                    VALUE: 0,
                },
                func: (sprite, script) => {
                    let value = script.getStringValue('VALUE');
                    value = value.replace(
                        /[^A-Za-z0-9_\`\~\!\@\#\$\%\^\&\*\(\)\-\=\+\\\{\}\[\]\'\"\;\:\<\,\>\.\?\/\s]/gim,
                        ''
                    );
                    this.requestCommandWithResponse(
                        script.entity.id,
                        functionKeys.SET_STRING,
                        value
                    );
                },
            },
            microbit_ext_show_image: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic',
                statements: [],
                params: [
                    {
                        type: 'Dropdown',
                        options: [
                            [Lang.Blocks.microbit_ext_image_heart, 0],
                            [Lang.Blocks.microbit_ext_image_small_heart, 1],
                            [Lang.Blocks.microbit_ext_image_happiness, 2],
                            [Lang.Blocks.microbit_ext_image_sadness, 3],
                            [Lang.Blocks.microbit_ext_image_confused, 4],
                            [Lang.Blocks.microbit_ext_image_angry, 5],
                            [Lang.Blocks.microbit_ext_image_sleepy, 6],
                            [Lang.Blocks.microbit_ext_image_surprised, 7],
                            [Lang.Blocks.microbit_ext_image_fool, 8],
                            [Lang.Blocks.microbit_ext_image_fantastic, 9],
                            [Lang.Blocks.microbit_ext_image_not_good, 10],
                            [Lang.Blocks.microbit_ext_image_yes, 11],
                            [Lang.Blocks.microbit_ext_image_no, 12],
                            [Lang.Blocks.microbit_ext_image_triangle, 13],
                            [Lang.Blocks.microbit_ext_image_left_triangle, 14],
                            [Lang.Blocks.microbit_ext_image_chessboard, 15],
                            [Lang.Blocks.microbit_ext_image_diamond, 17],
                            [Lang.Blocks.microbit_ext_image_small_diamond, 18],
                            [Lang.Blocks.microbit_ext_image_square, 19],
                            [Lang.Blocks.microbit_ext_image_small_square, 20],
                            [Lang.Blocks.microbit_ext_image_scissors, 21],
                            [Lang.Blocks.microbit_ext_image_tshirt, 22],
                            [Lang.Blocks.microbit_ext_image_rollerskate, 23],
                            [Lang.Blocks.microbit_ext_image_duck, 24],
                            [Lang.Blocks.microbit_ext_image_house, 25],
                            [Lang.Blocks.microbit_ext_image_turtle, 26],
                            [Lang.Blocks.microbit_ext_image_butterfly, 27],
                            [Lang.Blocks.microbit_ext_image_stickman, 28],
                            [Lang.Blocks.microbit_ext_image_ghost, 29],
                            [Lang.Blocks.microbit_ext_image_sword, 30],
                            [Lang.Blocks.microbit_ext_image_giraffe, 31],
                            [Lang.Blocks.microbit_ext_image_skull, 32],
                            [Lang.Blocks.microbit_ext_image_umbrella, 33],
                            [Lang.Blocks.microbit_ext_image_snake, 34],
                            [Lang.Blocks.microbit_ext_image_rabbit, 35],
                            [Lang.Blocks.microbit_ext_image_ox, 36],
                            [Lang.Blocks.microbit_ext_image_quarter_note, 37],
                            [Lang.Blocks.microbit_ext_image_eighth_note, 38],
                            [Lang.Blocks.microbit_ext_image_rake, 39],
                            [Lang.Blocks.microbit_ext_image_target, 40],
                        ],
                        value: 0,
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
                class: 'microbitExtLed',
                isNotFor: ['microbitExt'],
                def: {
                    type: 'microbit_ext_show_image',
                },
                paramsKeyMap: {
                    VALUE: 0,
                },
                func: (sprite, script) => {
                    const value = script.getField('VALUE');
                    this.requestCommandWithResponse(script.entity.id, functionKeys.SET_IMAGE, {
                        value,
                    });
                },
            },
            microbit_ext_set_led_image: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic',
                statements: [],
                params: [
                    {
                        type: 'Led',
                    },
                    {
                        type: 'Indicator',
                        img: 'block_icon/hardware_icon.svg',
                        size: 12,
                    },
                ],
                events: {},
                class: 'microbitExtLed',
                isNotFor: ['microbitExt'],
                def: {
                    type: 'microbit_ext_set_led_image',
                },
                paramsKeyMap: {
                    VALUE: 0,
                },
                func: (sprite, script) => {
                    const value = script.getField('VALUE');
                    this.requestCommand(functionKeys.SET_CUSTOM_IMAGE, { value });
                },
            },
            microbit_ext_reset_screen: {
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
                class: 'microbitExtLed',
                isNotFor: ['microbitExt'],
                def: {
                    type: 'microbit_ext_reset_screen',
                },
                paramsKeyMap: {},
                func: (sprite, script) => {
                    this.requestCommand(functionKeys.RESET_SCREEN);
                },
            },
            microbit_ext_set_tone: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic',
                statements: [],
                params: [
                    {
                        type: 'Dropdown',
                        options: [
                            [
                                Lang.Blocks.microbit_ext_tone_low + Lang.Blocks.microbit_ext_tone_c,
                                131,
                            ],
                            [
                                Lang.Blocks.microbit_ext_tone_low +
                                    Lang.Blocks.microbit_ext_tone_c_sharp,
                                139,
                            ],
                            [
                                Lang.Blocks.microbit_ext_tone_low + Lang.Blocks.microbit_ext_tone_d,
                                147,
                            ],
                            [
                                Lang.Blocks.microbit_ext_tone_low +
                                    Lang.Blocks.microbit_ext_tone_d_sharp,
                                156,
                            ],
                            [
                                Lang.Blocks.microbit_ext_tone_low + Lang.Blocks.microbit_ext_tone_e,
                                165,
                            ],
                            [
                                Lang.Blocks.microbit_ext_tone_low + Lang.Blocks.microbit_ext_tone_f,
                                175,
                            ],
                            [
                                Lang.Blocks.microbit_ext_tone_low +
                                    Lang.Blocks.microbit_ext_tone_f_sharp,
                                185,
                            ],
                            [
                                Lang.Blocks.microbit_ext_tone_low + Lang.Blocks.microbit_ext_tone_g,
                                196,
                            ],
                            [
                                Lang.Blocks.microbit_ext_tone_low +
                                    Lang.Blocks.microbit_ext_tone_g_sharp,
                                208,
                            ],
                            [
                                Lang.Blocks.microbit_ext_tone_low + Lang.Blocks.microbit_ext_tone_a,
                                220,
                            ],
                            [
                                Lang.Blocks.microbit_ext_tone_low +
                                    Lang.Blocks.microbit_ext_tone_a_sharp,
                                233,
                            ],
                            [
                                Lang.Blocks.microbit_ext_tone_low + Lang.Blocks.microbit_ext_tone_b,
                                247,
                            ],
                            [Lang.Blocks.microbit_ext_tone_c, 262],
                            [Lang.Blocks.microbit_ext_tone_c_sharp, 277],
                            [Lang.Blocks.microbit_ext_tone_d, 294],
                            [Lang.Blocks.microbit_ext_tone_d_sharp, 311],
                            [Lang.Blocks.microbit_ext_tone_e, 330],
                            [Lang.Blocks.microbit_ext_tone_f, 349],
                            [Lang.Blocks.microbit_ext_tone_f_sharp, 370],
                            [Lang.Blocks.microbit_ext_tone_g, 392],
                            [Lang.Blocks.microbit_ext_tone_g_sharp, 415],
                            [Lang.Blocks.microbit_ext_tone_a, 440],
                            [Lang.Blocks.microbit_ext_tone_a_sharp, 466],
                            [Lang.Blocks.microbit_ext_tone_b, 494],
                            [
                                Lang.Blocks.microbit_ext_tone_high +
                                    Lang.Blocks.microbit_ext_tone_c,
                                523,
                            ],
                            [
                                Lang.Blocks.microbit_ext_tone_high +
                                    Lang.Blocks.microbit_ext_tone_c_sharp,
                                554,
                            ],
                            [
                                Lang.Blocks.microbit_ext_tone_high +
                                    Lang.Blocks.microbit_ext_tone_d,
                                587,
                            ],
                            [
                                Lang.Blocks.microbit_ext_tone_high +
                                    Lang.Blocks.microbit_ext_tone_d_sharp,
                                622,
                            ],
                            [
                                Lang.Blocks.microbit_ext_tone_high +
                                    Lang.Blocks.microbit_ext_tone_e,
                                659,
                            ],
                            [
                                Lang.Blocks.microbit_ext_tone_high +
                                    Lang.Blocks.microbit_ext_tone_f,
                                698,
                            ],
                            [
                                Lang.Blocks.microbit_ext_tone_high +
                                    Lang.Blocks.microbit_ext_tone_f_sharp,
                                740,
                            ],
                            [
                                Lang.Blocks.microbit_ext_tone_high +
                                    Lang.Blocks.microbit_ext_tone_g,
                                784,
                            ],
                            [
                                Lang.Blocks.microbit_ext_tone_high +
                                    Lang.Blocks.microbit_ext_tone_g_sharp,
                                831,
                            ],
                            [
                                Lang.Blocks.microbit_ext_tone_high +
                                    Lang.Blocks.microbit_ext_tone_a,
                                880,
                            ],
                            [
                                Lang.Blocks.microbit_ext_tone_high +
                                    Lang.Blocks.microbit_ext_tone_a_sharp,
                                932,
                            ],
                            [
                                Lang.Blocks.microbit_ext_tone_high +
                                    Lang.Blocks.microbit_ext_tone_b,
                                988,
                            ],
                        ],
                        value: 131,
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                    {
                        type: 'Dropdown',
                        options: [
                            ['4', 1],
                            ['2', 2],
                            ['1', 4],
                            ['1/2', 8],
                            ['1/4', 16],
                            ['1/8', 32],
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
                class: 'microbitExtSound',
                isNotFor: ['microbitExt'],
                def: {
                    type: 'microbit_ext_set_tone',
                },
                paramsKeyMap: {
                    NOTE_VALUE: 0,
                    BEAT_VALUE: 1,
                },
                func: (sprite, script) => {
                    const noteValue = script.getField('NOTE_VALUE');
                    const beatValue = script.getField('BEAT_VALUE');
                    this.requestCommandWithResponse(script.entity.id, functionKeys.SET_TONE, {
                        noteValue,
                        beatValue,
                    });
                },
            },
            microbit_ext_set_tempo: {
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
                        type: 'Indicator',
                        img: 'block_icon/hardware_icon.svg',
                        size: 12,
                    },
                ],
                events: {},
                class: 'microbitExtSound',
                isNotFor: ['microbitExt'],
                def: {
                    params: [
                        null,
                        {
                            type: 'number',
                            params: ['120'],
                        },
                    ],
                    type: 'microbit_ext_set_tempo',
                },
                paramsKeyMap: {
                    VALUE: 0,
                },
                func: (sprite, script) => {
                    const pinNumber = script.getField('PIN');
                    const value = _clamp(script.getNumberValue('VALUE'), 0, 255);
                    this.requestCommand(functionKeys.SET_TEMPO, { value });
                },
            },
            microbit_ext_set_relative_tempo: {
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
                        type: 'Indicator',
                        img: 'block_icon/hardware_icon.svg',
                        size: 12,
                    },
                ],
                events: {},
                class: 'microbitExtSound',
                isNotFor: ['microbitExt'],
                def: {
                    params: [
                        null,
                        {
                            type: 'number',
                            params: ['20'],
                        },
                    ],
                    type: 'microbit_ext_set_relative_tempo',
                },
                paramsKeyMap: {
                    VALUE: 0,
                },
                func: (sprite, script) => {
                    const pinNumber = script.getField('PIN');
                    const value = _clamp(script.getNumberValue('VALUE'), -127, 127) + 128; // offset for uint8_t payload
                    this.requestCommand(functionKeys.SET_RELATIVE_TEMPO, { value });
                },
            },

            microbit_ext_set_analog: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic',
                statements: [],
                params: [
                    {
                        type: 'Dropdown',
                        options: [
                            ['P0', 0],
                            ['P1', 1],
                            ['P2', 2],
                            ['P3', 3],
                            ['P4', 4],
                            ['P10', 10],
                        ],
                        value: 0,
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
                class: 'microbitExtAnalog',
                isNotFor: ['microbitExt'],
                def: {
                    params: [
                        null,
                        {
                            type: 'number',
                            params: ['1023'],
                        },
                    ],
                    type: 'microbit_ext_set_analog',
                },
                paramsKeyMap: {
                    PIN: 0,
                    VALUE: 1,
                },
                func: (sprite, script) => {
                    const pinNumber = script.getField('PIN');
                    const value = _clamp(script.getNumberValue('VALUE'), 0, 1023);
                    this.requestCommand(functionKeys.SET_ANALOG, { pinNumber, value });
                },
            },
            microbit_ext_set_analog_period: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic',
                statements: [],
                params: [
                    {
                        type: 'Dropdown',
                        options: [
                            ['P0', 0],
                            ['P1', 1],
                            ['P2', 2],
                            ['P3', 3],
                            ['P4', 4],
                            ['P10', 10],
                        ],
                        value: 0,
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
                class: 'microbitExtAnalog',
                isNotFor: ['microbitExt'],
                def: {
                    params: [
                        null,
                        {
                            type: 'number',
                            params: ['20000'],
                        },
                    ],
                    type: 'microbit_ext_set_analog_period',
                },
                paramsKeyMap: {
                    PIN: 0,
                    VALUE: 1,
                },
                func: (sprite, script) => {
                    const pinNumber = script.getField('PIN');
                    const value = script.getNumberValue('VALUE');
                    this.requestCommand(functionKeys.SET_ANALOG_PERIOD, { pinNumber, value });
                },
            },
            microbit_ext_get_analog: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                fontColor: '#ffffff',
                skeleton: 'basic_string_field',
                statements: [],
                params: [
                    {
                        type: 'Dropdown',
                        options: [
                            ['P0', 0],
                            ['P1', 1],
                            ['P2', 2],
                            ['P3', 3],
                            ['P4', 4],
                            ['P10', 10],
                        ],
                        value: 0,
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                ],
                events: {},
                class: 'microbitExtAnalog',
                isNotFor: ['microbitExt'],
                def: {
                    type: 'microbit_ext_get_analog',
                },
                paramsKeyMap: {
                    VALUE: 0,
                },
                func: (sprite, script) => {
                    const value = script.getField('VALUE');
                    this.requestCommandWithResponse(script.entity.id, functionKeys.GET_ANALOG, [
                        value,
                    ]);
                    return _get(Entry.hw.portData, ['payload', 'sensorData', 'analog', value], 0);
                },
            },
            microbit_ext_get_analog_map: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                fontColor: '#ffffff',
                skeleton: 'basic_string_field',
                statements: [],
                params: [
                    {
                        type: 'Dropdown',
                        options: [
                            ['P0', 0],
                            ['P1', 1],
                            ['P2', 2],
                            ['P3', 3],
                            ['P4', 4],
                            ['P10', 10],
                        ],
                        value: 0,
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
                        type: 'Block',
                        accept: 'string',
                        defaultType: 'number',
                    },
                    {
                        type: 'Block',
                        accept: 'string',
                        defaultType: 'number',
                    },
                ],
                events: {},
                class: 'microbitExtAnalog',
                isNotFor: ['microbitExt'],
                def: {
                    params: [
                        null,
                        {
                            type: 'number',
                            params: ['0'],
                        },
                        {
                            type: 'number',
                            params: ['1023'],
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
                    type: 'microbit_ext_get_analog_map',
                },
                paramsKeyMap: {
                    PORT: 0,
                    VALUE2: 1,
                    VALUE3: 2,
                    VALUE4: 3,
                    VALUE5: 4,
                },
                func: (sprite, script) => {
                    const value = script.getField('VALUE');
                    this.requestCommandWithResponse(script.entity.id, functionKeys.GET_ANALOG, [
                        value,
                    ]);
                    let returnData = _get(
                        Entry.hw.portData,
                        ['payload', 'sensorData', 'analog', value],
                        0
                    );

                    let value2 = script.getNumberValue('VALUE2', script);
                    let value3 = script.getNumberValue('VALUE3', script);
                    let value4 = script.getNumberValue('VALUE4', script);
                    let value5 = script.getNumberValue('VALUE5', script);
                    const stringValue4 = script.getValue('VALUE4', script);
                    const stringValue5 = script.getValue('VALUE5', script);
                    let isFloat = false;

                    if (
                        (Entry.Utils.isNumber(stringValue4) && stringValue4.indexOf('.') > -1) ||
                        (Entry.Utils.isNumber(stringValue5) && stringValue5.indexOf('.') > -1)
                    ) {
                        isFloat = true;
                    }
                    let swap;
                    if (value2 > value3) {
                        swap = value2;
                        value2 = value3;
                        value3 = swap;
                    }
                    if (value4 > value5) {
                        swap = value4;
                        value4 = value5;
                        value5 = swap;
                    }
                    returnData -= value2;
                    returnData = returnData * ((value5 - value4) / (value3 - value2));
                    returnData += value4;
                    returnData = Math.min(value5, returnData);
                    returnData = Math.max(value4, returnData);

                    if (isFloat) {
                        returnData = Math.round(returnData * 100) / 100;
                    } else {
                        returnData = Math.round(returnData);
                    }
                    return returnData;
                },
            },
            microbit_ext_set_digital: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic',
                statements: [],
                params: [
                    {
                        type: 'Dropdown',
                        options: [
                            ['P0', 0],
                            ['P1', 1],
                            ['P2', 2],
                            ['P3', 3],
                            ['P4', 4],
                            ['P5', 5],
                            ['P6', 6],
                            ['P7', 7],
                            ['P8', 8],
                            ['P9', 9],
                            ['P10', 10],
                            ['P11', 11],
                            ['P12', 12],
                            ['P13', 13],
                            ['P14', 14],
                            ['P15', 15],
                            ['P16', 16],
                            ['P19', 19],
                            ['P20', 20],
                        ],
                        value: 0,
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                    {
                        type: 'Dropdown',
                        options: [['0', 0], ['1', 1]],
                        value: 0,
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
                class: 'microbitExtDigital',
                isNotFor: ['microbitExt'],
                def: {
                    params: [],
                    type: 'microbit_ext_set_digital',
                },
                paramsKeyMap: {
                    PIN: 0,
                    VALUE: 1,
                },
                func: (sprite, script) => {
                    const pinNumber = script.getField('PIN');
                    const value = script.getNumberField('VALUE');
                    this.requestCommandWithResponse(script.entity.id, functionKeys.SET_DIGITAL, {
                        pinNumber,
                        value,
                    });
                },
            },
            microbit_ext_get_digital: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                fontColor: '#ffffff',
                skeleton: 'basic_boolean_field',
                statements: [],
                params: [
                    {
                        type: 'Dropdown',
                        options: [
                            ['P0', 0],
                            ['P1', 1],
                            ['P2', 2],
                            ['P3', 3],
                            ['P4', 4],
                            ['P5', 5],
                            ['P6', 6],
                            ['P7', 7],
                            ['P8', 8],
                            ['P9', 9],
                            ['P10', 10],
                            ['P11', 11],
                            ['P12', 12],
                            ['P13', 13],
                            ['P14', 14],
                            ['P15', 15],
                            ['P16', 16],
                            ['P19', 19],
                            ['P20', 20],
                        ],
                        value: 0,
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                ],
                events: {},
                class: 'microbitExtDigital',
                isNotFor: ['microbitExt'],
                def: {
                    type: 'microbit_ext_get_digital',
                },
                paramsKeyMap: {
                    VALUE: 0,
                },
                func: (sprite, script) => {
                    const value = script.getField('VALUE');
                    this.requestCommandWithResponse(script.entity.id, functionKeys.GET_DIGITAL, [
                        value,
                    ]);
                    return _get(Entry.hw.portData, ['payload', 'sensorData', 'digital', value], 0);
                },
            },
            microbit_ext_get_button: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                fontColor: '#ffffff',
                skeleton: 'basic_boolean_field',
                statements: [],
                params: [
                    {
                        type: 'Dropdown',
                        options: [['A', 1], ['B', 2], ['A+B', 3]],
                        value: 1,
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                ],
                events: {},
                class: 'microbitExtButton',
                isNotFor: ['microbitExt'],
                def: {
                    type: 'microbit_ext_get_button',
                },
                paramsKeyMap: {
                    VALUE: 0,
                },
                func: (sprite, script) => {
                    const value = script.getField('VALUE');
                    const buttonState = _get(
                        Entry.hw.portData,
                        ['payload', 'sensorData', 'button'],
                        -1
                    );

                    // double equal 은 의도한 것임.
                    // noinspection EqualityComparisonWithCoercionJS
                    return buttonState == value;
                },
            },
            microbit_ext_get_sensor: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                fontColor: '#ffffff',
                skeleton: 'basic_string_field',
                statements: [],
                params: [
                    {
                        type: 'Dropdown',
                        options: [
                            [Lang.Blocks.microbit_ext_sensor_light, 'lightLevel'],
                            [Lang.Blocks.microbit_ext_sensor_temperature, 'temperature'],
                            [Lang.Blocks.microbit_ext_sensor_compass, 'compassHeading'],
                        ],
                        value: 'temperature',
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                ],
                events: {},
                class: 'microbitExtSensor',
                isNotFor: ['microbitExt'],
                def: {
                    type: 'microbit_ext_get_sensor',
                },
                paramsKeyMap: {
                    VALUE: 0,
                },
                func: (sprite, script) => {
                    const value = script.getField('VALUE');
                    if (value === 'lightLevel') {
                        let commandType = functionKeys.GET_LIGHT_LEVEL;
                        this.requestCommandWithResponse(script.entity.id, commandType);
                    } else if (value === 'compassHeading') {
                        let commandType = functionKeys.GET_COMPASS_HEADING;
                        this.requestCommandWithResponse(script.entity.id, commandType);
                    }
                    return _get(Entry.hw.portData, ['payload', 'sensorData', value], -1);
                },
            },
            microbit_ext_is_tilt: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                fontColor: '#ffffff',
                skeleton: 'basic_boolean_field',
                statements: [],
                params: [
                    {
                        type: 'Dropdown',
                        options: [
                            [Lang.Blocks.microbit_ext_tilt_left, 0],
                            [Lang.Blocks.microbit_ext_tilt_right, 1],
                            [Lang.Blocks.microbit_ext_tilt_front, 2],
                            [Lang.Blocks.microbit_ext_tilt_rear, 3],
                        ],
                        value: 0,
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                ],
                events: {},
                class: 'microbitExtMove',
                isNotFor: ['microbitExt'],
                def: {
                    type: 'microbit_ext_is_tilt',
                },
                paramsKeyMap: {
                    DIRECTION: 0,
                },
                func: (sprite, script) => {
                    const direction = script.getField('DIRECTION');

                    let command;
                    const sensorDataMap = ['payload', 'sensorData', 'tilt'];
                    switch (direction) {
                        case 0:
                        case 1: {
                            command = functionKeys.GET_ROLL;
                            sensorDataMap.push('roll');
                            break;
                        }
                        case 2:
                        case 3:
                        default: {
                            command = functionKeys.GET_PITCH;
                            sensorDataMap.push('pitch');
                            break;
                        }
                    }

                    const value = _get(Entry.hw.portData, sensorDataMap, -1);
                    // 기획팀 의도에 따라 30도 이내는 기울지 않았다고 판단

                    /*
                    좌우 = 우측으로 기울일수록 +
                    앞뒤 = 뒤로 기울일수록 +
                     */
                    switch (direction) {
                        case 0: // 왼쪽
                        case 2: // 앞쪽
                            return value <= -30 && value >= -180;
                        case 1: // 오른쪽
                        case 3: // 뒤쪽
                            return value >= 30 && value <= 180;
                        default:
                            return false;
                    }
                },
            },
            microbit_ext_get_tilt: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                fontColor: '#ffffff',
                skeleton: 'basic_string_field',
                statements: [],
                params: [
                    {
                        type: 'Dropdown',
                        options: [
                            [Lang.Blocks.microbit_ext_tilt_left, 0],
                            [Lang.Blocks.microbit_ext_tilt_right, 1],
                            [Lang.Blocks.microbit_ext_tilt_front, 2],
                            [Lang.Blocks.microbit_ext_tilt_rear, 3],
                        ],
                        value: 0,
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                ],
                events: {},
                class: 'microbitExtMove',
                isNotFor: ['microbitExt'],
                def: {
                    type: 'microbit_ext_get_tilt',
                },
                paramsKeyMap: {
                    DIRECTION: 0,
                },
                func: (sprite, script) => {
                    const direction = script.getField('DIRECTION');

                    let command;
                    const sensorDataMap = ['payload', 'sensorData', 'tilt'];
                    switch (direction) {
                        case 0:
                        case 1: {
                            command = functionKeys.GET_ROLL;
                            sensorDataMap.push('roll');
                            break;
                        }
                        case 2:
                        case 3:
                        default: {
                            command = functionKeys.GET_PITCH;
                            sensorDataMap.push('pitch');
                            break;
                        }
                    }

                    const value = _get(Entry.hw.portData, sensorDataMap, -1);
                    /*
                    좌우 = 우측으로 기울일수록 +
                    앞뒤 = 뒤로 기울일수록 +
                     */
                    switch (direction) {
                        case 1: // 오른쪽
                        case 3: // 뒤쪽
                            return value;
                        case 0: // 왼쪽
                        case 2: // 앞쪽
                        default:
                            return -value;
                    }
                },
            },
            microbit_ext_get_accelerometer: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                fontColor: '#ffffff',
                skeleton: 'basic_string_field',
                statements: [],
                params: [
                    {
                        type: 'Dropdown',
                        options: [
                            [Lang.Blocks.microbit_ext_acc_xaxis, 0],
                            [Lang.Blocks.microbit_ext_acc_yaxis, 1],
                            [Lang.Blocks.microbit_ext_acc_zaxis, 2],
                            [Lang.Blocks.microbit_ext_acc_strength, 3],
                        ],
                        value: 0,
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                ],
                events: {},
                class: 'microbitExtSensor',
                isNotFor: ['microbitExt'],
                def: {
                    type: 'microbit_ext_get_accelerometer',
                },
                paramsKeyMap: {
                    VALUE: 0,
                },
                func: (sprite, script) => {
                    const value = script.getField('VALUE');
                    let whole = _get(Entry.hw.portData, 'payload.sensorData.accelerometer', -1);
                    if (whole instanceof Object) {
                        switch (value) {
                            case 0:
                                whole = whole.x;
                                break;
                            case 1:
                                whole = whole.y;
                                break;
                            case 2:
                                whole = whole.z;
                                break;
                            case 3:
                                whole = whole.strength;
                                break;
                            default:
                                whole = whole;
                                break;
                        }
                    }
                    return whole;
                },
            },
            microbit_ext_get_gesture: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                fontColor: '#ffffff',
                skeleton: 'basic_boolean_field',
                statements: [],
                params: [
                    {
                        type: 'Dropdown',
                        options: [
                            [Lang.Blocks.microbit_ext_gesture_shake, 11],
                            [Lang.Blocks.microbit_ext_gesture_portrait_top, 1],
                            [Lang.Blocks.microbit_ext_gesture_portrait_bottom, 2],
                            [Lang.Blocks.microbit_ext_gesture_portrait_right, 4],
                            [Lang.Blocks.microbit_ext_gesture_portrait_left, 3],
                            [Lang.Blocks.microbit_ext_gesture_horizontal_top, 5],
                            [Lang.Blocks.microbit_ext_gesture_horizontal_bottom, 6],
                            [Lang.Blocks.microbit_ext_gesture_horizontal_right, 14],
                            [Lang.Blocks.microbit_ext_gesture_horizontal_left, 13],
                        ],
                        value: 11,
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                ],
                events: {},
                class: 'microbitExtMove',
                isNotFor: ['microbitExt'],
                def: {
                    type: 'microbit_ext_get_gesture',
                },
                paramsKeyMap: {
                    VALUE: 0,
                },
                func: (sprite, script) => {
                    let value = script.getField('VALUE');
                    const gesture = _get(Entry.hw.portData, 'payload.sensorData.gesture', -1);
                    // 밸류 중복으로 인해서 생기는 문제로 인해 +10을 오프셋으로 사용
                    if (value > 11) {
                        value = value - 10;
                    }
                    /**
                     * 제스쳐는 단 한번만 검사하기 위해 제스쳐가 이전과 다르게 변경된 경우만 검사한다.
                     * 달라진 경우,
                     * '흔들림' 이 있는가? = SHAKE event 인지만 검사
                     * '움직임' 이 있는가? = 제스쳐의 변경 -> 움직임이기 때문에 무조건 true
                     */
                    if (this.lastGesture === gesture) {
                        return false;
                    } else {
                        this.lastGesture = gesture;
                        if (value === 0) {
                            return this.lastGesture === microbitGestures.SHAKE;
                        } else if (value == gesture) {
                            return true;
                        }
                        //

                        // } else if (value === 1) {
                        //     return true;
                        // }
                    }
                },
            },
            microbit_ext_set_servo: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic',
                statements: [],
                params: [
                    {
                        type: 'Dropdown',
                        options: [['P0', 0], ['P1', 1], ['P2', 2]],
                        value: 0,
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
                class: 'microbitExtServo',
                isNotFor: ['microbitExt'],
                def: {
                    params: [
                        null,
                        {
                            type: 'number',
                            params: ['180'],
                        },
                    ],
                    type: 'microbit_ext_set_servo',
                },
                paramsKeyMap: {
                    PIN: 0,
                    VALUE: 1,
                },
                func: (sprite, script) => {
                    const pinNumber = script.getField('PIN');
                    const value = _clamp(script.getNumberValue('VALUE'), 0, 180);
                    this.requestCommand(functionKeys.SET_SERVO, { pinNumber, value });
                },
            },
            microbit_ext_set_servo_period: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic',
                statements: [],
                params: [
                    {
                        type: 'Dropdown',
                        options: [['P0', 0], ['P1', 1], ['P2', 2]],
                        value: 0,
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
                class: 'microbitExtServo',
                isNotFor: ['microbitExt'],
                def: {
                    params: [
                        null,
                        {
                            type: 'number',
                            params: ['1500'],
                        },
                    ],
                    type: 'microbit_ext_set_servo_period',
                },
                paramsKeyMap: {
                    PIN: 0,
                    VALUE: 1,
                },
                func: (sprite, script) => {
                    const pinNumber = script.getField('PIN');
                    const value = script.getNumberValue('VALUE');
                    this.requestCommand(functionKeys.SET_SERVO_PERIOD, { pinNumber, value });
                },
            },
        };
    }
})();

module.exports = Entry.MicrobitExt;
