'use strict';

const _set = require('lodash/set');
const _get = require('lodash/get');
const _merge = require('lodash/merge');
const _clamp = require('lodash/clamp');

const functionKeys = {
    GET_ANALOG: 'get-analog',
    GET_DIGITAL: 'get-digital',
    SET_ANALOG: 'set-analog',
    SET_DIGITAL: 'set-digital',
    SET_LED: 'set-pixel',
    GET_LED: 'get-pixel',
    RESET: 'reset',
    PRESET_IMAGE: 'pre-image',
    SET_CUSTOM_IMAGE: 'custom-image',
    SET_STRING: 'print',
    RESET_SCREEN: 'display-clear',
    DISPLAY_ON: 'display-on',
    DISPLAY_OFF: 'display-off',
    SPEAKER_ON: 'speaker-on',
    SPEAKER_OFF: 'speaker-off',
    PLAY_TONE: 'play-tone',
    PLAY_SOUND: 'pre-sound',
    PLAY_MELODY: 'pre-melody',
    GET_BTN: 'get-btn',
    CHANGE_TEMPO: 'change-tempo',
    GET_LOGO: 'get-touch',
    GET_ACC: 'get-acc',
    GET_GESTURE: 'get-gesture',
    GET_DIRECTION: 'direction',
    GET_FIELD_STRENGTH: 'field-strength',
    GET_FIELD_STRENGTH_AXIS: 'field-axis-strength',
    GET_LIGHT_LEVEL: 'light-level',
    GET_TEMPERATURE: 'temperature',
    GET_SOUND_LEVEL: 'sound-level',
    SET_RADIO: 'radio-send',
    GET_RADIO: 'radio-receive',
    RADIO_ON: 'radio-on',
    RADIO_OFF: 'radio-off',
    SETTING_RADIO: 'radio-setting',
    SET_SERVO_MILLI: 'write-period',
    SET_SERVO_MICRO: 'write-micro-period',
    SET_SERVO_ANGLE: 'servo-write',
};

Entry.Microbit2 = new (class Microbit2 {
    constructor() {
        this.id = '22.3';
        this.url = 'http://microbit.org/ko/';
        this.imageName = 'microbit2.png';
        this.title = {
            en: 'Microbit v2',
            ko: '마이크로빗 v2',
        };
        this.name = 'microbit2';
        this.communicationType = 'manual';
        this.blockMenuBlocks = [
            'microbit2_test_set_tone',
            'microbit2_get_analog',
            'microbit2_set_analog',
            'microbit2_get_digital',
            'microbit2_set_digital',
            'microbit2_screen_toggle',
            'microbit2_set_led',
            'microbit2_get_led',
            'microbit2_show_preset_image',
            'microbit2_show_custom_image',
            'microbit2_show_string',
            'microbit2_reset_screen',
            'microbit2_radio_toggle',
            'microbit2_radio_setting',
            'microbit2_radio_send',
            'microbit2_radio_received',
            'microbit2_speaker_toggle',
            'microbit2_change_tempo',
            'microbit2_set_tone',
            'microbit2_play_preset_music',
            'microbit2_play_sound_effect',
            'microbit2_get_btn',
            'microbit2_get_logo',
            'microbit2_get_acc',
            'microbit2_get_gesture',
            'microbit2_get_direction',
            'microbit2_get_field_strength_axis',
            'microbit2_get_light_level',
            'microbit2_get_temperature',
            'microbit2_get_sound_level',
            'microbit2_set_servo',
            'microbit2_set_pwm_milli',
            'microbit2_set_pwm_micro',
        ];
        this.commandStatus = {};
        this.commandValue = {};
        this.digitalPins = [
            ['P8', 8],
            ['P9', 9],
            ['P12', 12],
            ['P13', 13],
            ['P14', 14],
            ['P15', 15],
            ['P16', 16],
        ];
        this.analogPins = [
            ['P0', 0],
            ['P1', 1],
            ['P2', 2],
            ['P3', 3],
            ['P4', 4],
            ['P10', 10],
        ];
        this.ledRows = [
            [0, 0],
            [1, 1],
            [2, 2],
            [3, 3],
            [4, 4],
        ];
        this.defaultLed = [
            [0, 0, 0, 0, 0],
            [0, 9, 0, 9, 0],
            [0, 0, 0, 0, 0],
            [9, 0, 0, 0, 9],
            [0, 9, 9, 9, 0],
        ];
    }

    setZero() {
        // 엔트리 정지시 하드웨어 초기화 로직
        this.requestCommand(functionKeys.RESET);
        this.commandStatus = {};
        this.commandValue = {};
    }

    // will not use in this module
    requestCommand(type, payload) {
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
    requestCommandWithResponse({ id, command: type, payload }) {
        const codeId = this.generateCodeId(id, type, payload);
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
            delete this.commandStatus[codeId];
        }
    }

    generateCodeId(entityId, type, payload) {
        return `${entityId}-${type}${payload ? '-' + payload : ''}`;
    }

    afterReceive(portData) {
        if (portData) {
            let codeId = portData.recentlyWaitDone;
            let value = portData.result;
            if (codeId) {
                if (codeId.indexOf('reset') > -1) {
                    this.commandStatus = {};
                    this.commandValue = {};
                    return;
                }
                this.commandStatus[codeId] = 'completed';
                this.commandValue[codeId] = value || 'DONE';
            }
        }

        if (!Entry.engine.isState('run')) {
            this.commandStatus = {};
        }
    }

    // 언어 적용
    setLanguage() {
        return {
            ko: {
                template: {
                    microbit2_get_analog: '핀 %1 번 아날로그 값',
                    microbit2_set_analog: '핀 %1 에 아날로그 값 %2 를 출력하기 %3',
                    microbit2_get_digital: '핀 %1 번 디지털 값',
                    microbit2_set_digital: '핀 %1 에 디지털 값 %2 를 출력하기 %3',
                    microbit2_screen_toggle: 'LED 기능 %1 %2',
                    microbit2_set_led: 'LED의 X: %1 Y: %2 를 밝기 %3 (으)로 켜기 %4',
                    microbit2_get_led: 'LED의 X: %1 Y: %2 밝기 값',
                    microbit2_show_preset_image: 'LED에 %1 모양 나타내기 %2',
                    microbit2_show_custom_image: 'LED %1 켜기 %2',
                    microbit2_reset_screen: 'LED 모두 지우기 %1',
                    microbit2_show_string: 'LED에 %1 을(를) 나타내기 %2',
                    microbit2_radio_toggle: '라디오 기능 %1 %2',
                    microbit2_radio_setting: '라디오 채널을 %1 (으)로 바꾸기 %2',
                    microbit2_radio_send: '라디오로 %1 송신하기 %2',
                    microbit2_radio_received: '라디오 수신 값',
                    microbit2_speaker_toggle: '스피커 기능 %1 %2',
                    microbit2_change_tempo: '연주 속도를 %1 박에 %2 BPM으로 정하기 %3',
                    microbit2_set_tone: '%1 음을 %2 박만큼 연주하기 %3',
                    microbit2_play_preset_music: '%1 음악을 연주하기 %2',
                    microbit2_play_sound_effect: '%1 효과음을 연주하기 %2',
                    microbit2_get_btn: '%1 버튼이 눌렸는가?',
                    microbit2_get_logo: '로고를 터치했는가?',
                    microbit2_get_gesture: '움직임이 %1 인가?',
                    microbit2_get_acc: '%1 의 가속도 값',
                    microbit2_get_direction: '나침반 방향',
                    microbit2_get_field_strength_axis: '%1 의 자기장 세기 값',
                    microbit2_get_light_level: '빛 센서 값',
                    microbit2_get_temperature: '온도 값',
                    microbit2_get_sound_level: '마이크 소리 크기 값',
                    microbit2_set_servo: '핀 %1 의 서보모터 각도를 %2로 설정하기',
                    microbit2_set_pwm_milli: '핀 %1 에 서보 펄스 폭을 %2 밀리초로 설정하기 %3',
                    microbit2_set_pwm_micro: '핀 %1 에 서보 펄스 폭을 %2 마이크로초로 설정하기 %3',
                },
                Blocks: {
                    scalar: '스칼라',
                    up: '위',
                    down: '아래',
                    left: '왼쪽',
                    right: '오른쪽',
                    face_up: '앞면',
                    face_down: '뒷면',
                    freefall: '자유 낙하',
                    '3g': '3G',
                    '6g': '6G',
                    '8g': '8G',
                    shake: '흔들림',
                    octave: '옥타브',
                    DADADADUM: '운명 교향곡',
                    ENTERTAINER: '엔터테이너',
                    PRELUDE: '바흐 프렐류드 1번',
                    ODE: '합창 교향곡',
                    NYAN: '냥캣',
                    RINGTONE: '벨소리',
                    FUNK: '펑크',
                    BLUES: '블루스',
                    BIRTHDAY: '생일 축하합니다',
                    WEDDING: '결혼 행진곡',
                    FUNERAL: '장례식 노래',
                    PUNCHLINE: '펀치라인',
                    PYTHON: '서커스',
                    BADDY: '악당',
                    CHASE: '추격전',
                    BA_DING: '동전 GET',
                    WAWAWAWAA: '실망',
                    JUMP_UP: '위로 점프',
                    JUMP_DOWN: '아래로 점프',
                    POWER_UP: '켜기',
                    POWER_DOWN: '끄기',
                    GIGGLE: '웃음',
                    HAPPY: '행복',
                    HELLO: '인사',
                    MYSTERIOUS: '신비로움',
                    SAD: '슬픔',
                    SLIDE: '슬라이드',
                    SOARING: '상승',
                    SPRING: '봄',
                    TWINKLE: '반짝반짝',
                    YAWN: '하품',
                    sharp: '#',
                    normal: '평계',
                    flat: 'b',
                    rest: '쉼표',
                    do: '도',
                    re: '레',
                    mi: '미',
                    fa: '파',
                    sol: '솔',
                    la: '라',
                    ti: '시',
                    on: '켜기',
                    off: '끄기',
                    microbit_2_HEART: '하트',
                    microbit_2_HEART_SMALL: '작은 하트',
                    microbit_2_HAPPY: '행복',
                    microbit_2_SMILE: '웃음',
                    microbit_2_SAD: '슬픔',
                    microbit_2_CONFUSED: '혼란',
                    microbit_2_ANGRY: '화남',
                    microbit_2_ASLEEP: '졸림',
                    microbit_2_SURPRISED: '놀람',
                    microbit_2_SILLY: '멍청함',
                    microbit_2_FABULOUS: '환상적인',
                    microbit_2_MEH: '별로',
                    microbit_2_YES: '예스',
                    microbit_2_NO: '노',
                    microbit_2_CLOCK1: '1시',
                    microbit_2_CLOCK2: '2시',
                    microbit_2_CLOCK3: '3시',
                    microbit_2_CLOCK4: '4시',
                    microbit_2_CLOCK5: '5시',
                    microbit_2_CLOCK6: '6시',
                    microbit_2_CLOCK7: '7시',
                    microbit_2_CLOCK8: '8시',
                    microbit_2_CLOCK9: '9시',
                    microbit_2_CLOCK10: '10시',
                    microbit_2_CLOCK11: '11시',
                    microbit_2_CLOCK12: '12시',
                    microbit_2_ARROW_N: '북쪽',
                    microbit_2_ARROW_NE: '북동쪽',
                    microbit_2_ARROW_E: '동쪽',
                    microbit_2_ARROW_SE: '남동쪽',
                    microbit_2_ARROW_S: '남쪽',
                    microbit_2_ARROW_SW: '남서쪽',
                    microbit_2_ARROW_W: '서쪽',
                    microbit_2_ARROW_NW: '북서쪽',
                    microbit_2_TRIANGLE: '삼각형',
                    microbit_2_TRIANGLE_LEFT: '왼쪽 삼각형',
                    microbit_2_CHESSBOARD: '체스판',
                    microbit_2_DIAMOND: '다이아몬드',
                    microbit_2_DIAMOND_SMALL: '작은 다이아몬드',
                    microbit_2_SQUARE: '사각형',
                    microbit_2_SQUARE_SMALL: '작은 사각형',
                    microbit_2_RABBIT: '토끼',
                    microbit_2_COW: '소',
                    microbit_2_MUSIC_CROTCHET: '4분음표',
                    microbit_2_MUSIC_QUAVER: '8분음표',
                    microbit_2_MUSIC_QUAVERS: '8분음표 2개',
                    microbit_2_PITCHFORK: '쇠스랑',
                    microbit_2_XMAS: '크리스마스 트리',
                    microbit_2_PACMAN: '팩맨',
                    microbit_2_TARGET: '목표',
                    microbit_2_TSHIRT: '티셔츠',
                    microbit_2_ROLLERSKATE: '롤러스케이트',
                    microbit_2_DUCK: '오리',
                    microbit_2_HOUSE: '집',
                    microbit_2_TORTOISE: '거북이',
                    microbit_2_BUTTERFLY: '나비',
                    microbit_2_STICKFIGURE: '스틱맨',
                    microbit_2_GHOST: '유령',
                    microbit_2_SWORD: '칼',
                    microbit_2_GIRAFFE: '기린',
                    microbit_2_SKULL: '해골',
                    microbit_2_UMBRELLA: '우산',
                    microbit_2_SNAKE: '뱀',
                },
                Helper: {
                    microbit2_get_analog: '핀 %1 번 아날로그 값',
                    microbit2_set_analog: '핀 %1 에 아날로그 값 %2 를 출력하기 %3',
                    microbit2_get_digital: '핀 %1 번 디지털 값',
                    microbit2_set_digital: '핀 %1 에 디지털 값 %2 를 출력하기 %3',
                    microbit2_screen_toggle: 'LED 기능 %1 %2',
                    microbit2_set_led: 'LED의 X: %1 Y: %2 를 밝기 %3 (으)로 정하기 %4',
                    microbit2_get_led: 'LED의 X: %1 Y: %2 밝기 값',
                    microbit2_show_preset_image: 'LED에 %1 모양 켜기 %2',
                    microbit2_show_custom_image: 'LED %1 켜기 %2',
                    microbit2_reset_screen: 'LED 모두 지우기 %1',
                    microbit2_show_string: 'LED에 %1 을(를) 나타내기 %2',
                    microbit2_radio_toggle: '라디오 기능 %1 %2',
                    microbit2_radio_setting: '라디오 채널을 %1 (으)로 바꾸기 %2',
                    microbit2_radio_send: '라디오로 %1 송신하기 %2',
                    microbit2_radio_received: '라디오 수신 값',
                    microbit2_speaker_toggle: '스피커 기능 %1 %2',
                    microbit2_change_tempo: '연주 속도를 %1 박에 %2 BPM으로 정하기 %3',
                    microbit2_set_tone: '%1 음을 %2 박만큼 연주하기 %3',
                    microbit2_play_preset_music: '%1 음악을 연주하기 %2',
                    microbit2_play_sound_effect: '%1 효과음을 연주하기 %2',
                    microbit2_get_btn: '%1 버튼이 눌렸는가?',
                    microbit2_get_logo: '로고를 터치했는가?',
                    microbit2_get_gesture: '움직임이 %1 인가?',
                    microbit2_get_acc: '%1 의 가속도 값',
                    microbit2_get_direction: '나침반 방향',
                    microbit2_get_field_strength_axis: '%1 의 자기장 세기 값',
                    microbit2_get_light_level: '빛 센서 값',
                    microbit2_get_temperature: '온도 값',
                    microbit2_get_sound_level: '마이크 소리 크기 값',
                    microbit2_set_servo: '핀 %1 의 서보모터 각도를 %2로 설정하기',
                    microbit2_set_pwm_milli: '핀 %1 에 서보 펄스 폭을 %2 밀리초로 설정하기 %3',
                    microbit2_set_pwm_micro: '핀 %1 에 서보 펄스 폭을 %2 마이크로초로 설정하기 %3',
                },
            },
            en: {
                template: {
                    microbit2_get_analog: 'analog read pin %1',
                    microbit2_set_analog: 'analog set pin %1 to %2 %3',
                    microbit2_get_digital: 'digital read pin %1',
                    microbit2_set_digital: 'digital write pin %1 to %2 %3',
                    microbit2_screen_toggle: '%1 LED %2',
                    microbit2_set_led: 'plot X: %1 Y:%2 brightness %3 %4',
                    microbit2_get_led: 'point X: %1 Y: %2 brightness',
                    microbit2_show_preset_image: 'show icon %1 on LED',
                    microbit2_show_custom_image: 'show %1 on LED %2',
                    microbit2_reset_screen: 'clear LED screen %1',
                    microbit2_show_string: 'LED에 %1 을(를) 나타내기 %2',
                    microbit2_radio_toggle: '%1 radio %2',
                    microbit2_radio_setting: '라디오 채널을 %1 (으)로 바꾸기 %2',
                    microbit2_radio_send: '라디오로 %1 송신하기 %2',
                    microbit2_radio_received: '라디오 수신 값',
                    microbit2_speaker_toggle: '스피커 기능 %1 %2',
                    microbit2_change_tempo: '연주 속도를 %1 박에 %2 BPM으로 정하기 %3',
                    microbit2_set_tone: '%1 음을 %2 박만큼 연주하기 %3',
                    microbit2_play_preset_music: '%1 음악을 연주하기 %2',
                    microbit2_play_sound_effect: '%1 효과음을 연주하기 %2',
                    microbit2_get_btn: '%1 버튼이 눌렸는가?',
                    microbit2_get_logo: '로고를 터치했는가?',
                    microbit2_get_gesture: '움직임이 %1 인가?',
                    microbit2_get_acc: '%1 의 가속도 값',
                    microbit2_get_direction: '나침반 방향',
                    microbit2_get_field_strength_axis: '%1 의 자기장 세기 값',
                    microbit2_get_light_level: '빛 센서 값',
                    microbit2_get_temperature: '온도 값',
                    microbit2_get_sound_level: '마이크 소리 크기 값',
                    microbit2_set_servo: '핀 %1 의 서보모터 각도를 %2로 설정하기',
                    microbit2_set_pwm_milli: '핀 %1 에 서보 펄스 폭을 %2 밀리초로 설정하기 %3',
                    microbit2_set_pwm_micro: '핀 %1 에 서보 펄스 폭을 %2 마이크로초로 설정하기 %3',
                },
                Blocks: {
                    scalar: 'Scalar',
                    up: 'Up',
                    down: 'Down',
                    left: 'Left',
                    right: 'Right',
                    face_up: 'Face Up',
                    face_down: 'Face Down',
                    freefall: 'Free Fall',
                    '3g': '3G',
                    '6g': '6G',
                    '8g': '8G',
                    shake: 'Shake',
                    octave: 'octave',
                    DADADADUM: 'Beethoven 5th Symphony',
                    ENTERTAINER: 'The Entertainer',
                    PRELUDE: 'First Prelude, J.S.Bach’s 48 Preludes and Fugues',
                    ODE: 'Beethoven’s 9th Symphony',
                    NYAN: 'Nyan Cat',
                    RINGTONE: 'Ringtone',
                    FUNK: 'Funk',
                    BLUES: 'Blues',
                    BIRTHDAY: 'Happy Birthday',
                    WEDDING: 'Wedding March',
                    FUNERAL: 'Funeral',
                    PUNCHLINE: 'Punch Line',
                    PYTHON: 'Monty Python’s Flying Circus',
                    BADDY: 'Baddy',
                    CHASE: 'Chase',
                    BA_DING: 'Ba-Ding',
                    WAWAWAWAA: 'Sad trombone',
                    JUMP_UP: 'Jump Up',
                    JUMP_DOWN: 'Jump Down',
                    POWER_UP: 'Power Up',
                    POWER_DOWN: 'Power Down',
                    GIGGLE: 'Giggle',
                    HAPPY: 'Happy',
                    HELLO: 'Hello',
                    MYSTERIOUS: 'Mysterious',
                    SAD: 'Sad',
                    SLIDE: 'Slide',
                    SOARING: 'Soaring',
                    SPRING: 'Spring',
                    TWINKLE: 'Twinkle',
                    YAWN: 'Yawn',
                    sharp: '#',
                    normal: 'Normal',
                    flat: 'b',
                    rest: 'Rest',
                    do: 'Do',
                    re: 'Re',
                    mi: 'Mi',
                    fa: 'Fa',
                    sol: 'Sol',
                    la: 'La',
                    ti: 'Ti',
                    on: 'on',
                    off: 'off',
                    microbit_2_HEART: 'Heart',
                    microbit_2_HEART_SMALL: 'Small Heart',
                    microbit_2_HAPPY: 'Happy',
                    microbit_2_SMILE: 'Smile',
                    microbit_2_SAD: 'Sad',
                    microbit_2_CONFUSED: 'Confused',
                    microbit_2_ANGRY: 'Angry',
                    microbit_2_ASLEEP: 'Asleep',
                    microbit_2_SURPRISED: 'Surprised',
                    microbit_2_SILLY: 'Silly',
                    microbit_2_FABULOUS: 'Fabulous',
                    microbit_2_MEH: 'Meh',
                    microbit_2_YES: 'Yes',
                    microbit_2_NO: 'No',
                    microbit_2_CLOCK1: "1'o clock",
                    microbit_2_CLOCK2: "2'o clock",
                    microbit_2_CLOCK3: "3'o clock",
                    microbit_2_CLOCK4: "4'o clock",
                    microbit_2_CLOCK5: "5'o clock",
                    microbit_2_CLOCK6: "6'o clock",
                    microbit_2_CLOCK7: "7'o clock",
                    microbit_2_CLOCK8: "8'o clock",
                    microbit_2_CLOCK9: "9'o clock",
                    microbit_2_CLOCK10: "10'o clock",
                    microbit_2_CLOCK11: "11'o clock",
                    microbit_2_CLOCK12: "12'o clock",
                    microbit_2_ARROW_N: 'North',
                    microbit_2_ARROW_NE: 'North East',
                    microbit_2_ARROW_E: 'East',
                    microbit_2_ARROW_SE: 'South East',
                    microbit_2_ARROW_S: 'South',
                    microbit_2_ARROW_SW: 'South West',
                    microbit_2_ARROW_W: 'West',
                    microbit_2_ARROW_NW: 'North West',
                    microbit_2_TRIANGLE: 'Triangle',
                    microbit_2_TRIANGLE_LEFT: 'Left Triangle',
                    microbit_2_CHESSBOARD: 'Chess Board',
                    microbit_2_DIAMOND: 'Diamond',
                    microbit_2_DIAMOND_SMALL: 'Small Diamond',
                    microbit_2_SQUARE: 'Square',
                    microbit_2_SQUARE_SMALL: 'Small Square',
                    microbit_2_RABBIT: 'Rabbit',
                    microbit_2_COW: 'Cow',
                    microbit_2_MUSIC_CROTCHET: 'Crotchet',
                    microbit_2_MUSIC_QUAVER: 'Quaver',
                    microbit_2_MUSIC_QUAVERS: 'Quavers',
                    microbit_2_PITCHFORK: 'Pitchfork',
                    microbit_2_XMAS: 'X-mas',
                    microbit_2_PACMAN: 'Pacman',
                    microbit_2_TARGET: 'Target',
                    microbit_2_TSHIRT: 'T-shirt',
                    microbit_2_ROLLERSKATE: 'Roller Skate',
                    microbit_2_DUCK: 'Duck',
                    microbit_2_HOUSE: 'Horse',
                    microbit_2_TORTOISE: 'Tortoise',
                    microbit_2_BUTTERFLY: 'Butterfly',
                    microbit_2_STICKFIGURE: 'Stickman',
                    microbit_2_GHOST: 'Ghost',
                    microbit_2_SWORD: 'Sword',
                    microbit_2_GIRAFFE: 'Giraffe',
                    microbit_2_SKULL: 'Skull',
                    microbit_2_UMBRELLA: 'Umbrella',
                    microbit_2_SNAKE: 'Snake',
                },
                Helper: {
                    microbit2_get_analog: '핀 %1 번 아날로그 값',
                    microbit2_set_analog: '핀 %1 에 아날로그 값 %2 를 출력하기 %3',
                    microbit2_get_digital: '핀 %1 번 디지털 값',
                    microbit2_set_digital: '핀 %1 에 디지털 값 %2 를 출력하기 %3',
                    microbit2_screen_toggle: 'LED 기능 %1 %2',
                    microbit2_set_led: 'LED의 X: %1 Y: %2 를 밝기 %3 (으)로 정하기 %4',
                    microbit2_get_led: 'LED의 X: %1 Y: %2 밝기 값',
                    microbit2_show_preset_image: 'LED에 %1 모양 켜기 %2',
                    microbit2_show_custom_image: 'LED %1 켜기 %2',
                    microbit2_reset_screen: 'LED 모두 지우기 %1',
                    microbit2_show_string: 'LED에 %1 을(를) 나타내기 %2',
                    microbit2_radio_toggle: '라디오 기능 %1 %2',
                    microbit2_radio_setting: '라디오 채널을 %1 (으)로 바꾸기 %2',
                    microbit2_radio_send: '라디오로 %1 송신하기 %2',
                    microbit2_radio_received: '라디오 수신 값',
                    microbit2_speaker_toggle: '스피커 기능 %1 %2',
                    microbit2_change_tempo: '연주 속도를 %1 박에 %2 BPM으로 정하기 %3',
                    microbit2_set_tone: '%1 음을 %2 박만큼 연주하기 %3',
                    microbit2_play_preset_music: '%1 음악을 연주하기 %2',
                    microbit2_play_sound_effect: '%1 효과음을 연주하기 %2',
                    microbit2_get_btn: '%1 버튼이 눌렸는가?',
                    microbit2_get_logo: '로고를 터치했는가?',
                    microbit2_get_gesture: '움직임이 %1 인가?',
                    microbit2_get_acc: '%1 의 가속도 값',
                    microbit2_get_direction: '나침반 방향',
                    microbit2_get_field_strength_axis: '%1 의 자기장 세기 값',
                    microbit2_get_light_level: '빛 센서 값',
                    microbit2_get_temperature: '온도 값',
                    microbit2_get_sound_level: '마이크 소리 크기 값',
                    microbit2_set_servo: '핀 %1 의 서보모터 각도를 %2로 설정하기',
                    microbit2_set_pwm_milli: '핀 %1 에 서보 펄스 폭을 %2 밀리초로 설정하기 %3',
                    microbit2_set_pwm_micro: '핀 %1 에 서보 펄스 폭을 %2 마이크로초로 설정하기 %3',
                },
            },
            jp: {
                template: {
                    microbit2_get_analog: '핀 %1 번 아날로그 값',
                    microbit2_set_analog: '핀 %1 에 아날로그 값 %2 를 출력하기 %3',
                    microbit2_get_digital: '핀 %1 번 디지털 값',
                    microbit2_set_digital: '핀 %1 에 디지털 값 %2 를 출력하기 %3',
                    microbit2_screen_toggle: 'LED 기능 %1 %2',
                    microbit2_set_led: 'LED의 X: %1 Y: %2 를 밝기 %3 (으)로 정하기 %4',
                    microbit2_get_led: 'LED의 X: %1 Y: %2 밝기 값',
                    microbit2_show_preset_image: 'LED에 %1 모양 켜기 %2',
                    microbit2_show_custom_image: 'LED %1 켜기 %2',
                    microbit2_reset_screen: 'LED 모두 지우기 %1',
                    microbit2_show_string: 'LED에 %1 을(를) 나타내기 %2',
                    microbit2_radio_toggle: '라디오 기능 %1 %2',
                    microbit2_radio_setting: '라디오 채널을 %1 (으)로 바꾸기 %2',
                    microbit2_radio_send: '라디오로 %1 송신하기 %2',
                    microbit2_radio_received: '라디오 수신 값',
                    microbit2_speaker_toggle: '스피커 기능 %1 %2',
                    microbit2_change_tempo: '연주 속도를 %1 박에 %2 BPM으로 정하기 %3',
                    microbit2_set_tone: '%1 음을 %2 박만큼 연주하기 %3',
                    microbit2_play_preset_music: '%1 음악을 연주하기 %2',
                    microbit2_play_sound_effect: '%1 효과음을 연주하기 %2',
                    microbit2_get_btn: '%1 버튼이 눌렸는가?',
                    microbit2_get_logo: '로고를 터치했는가?',
                    microbit2_get_gesture: '움직임이 %1 인가?',
                    microbit2_get_acc: '%1 의 가속도 값',
                    microbit2_get_direction: '나침반 방향',
                    microbit2_get_field_strength_axis: '%1 의 자기장 세기 값',
                    microbit2_get_light_level: '빛 센서 값',
                    microbit2_get_temperature: '온도 값',
                    microbit2_get_sound_level: '마이크 소리 크기 값',
                    microbit2_set_servo: '핀 %1 의 서보모터 각도를 %2로 설정하기',
                    microbit2_set_pwm_milli: '핀 %1 에 서보 펄스 폭을 %2 밀리초로 설정하기 %3',
                    microbit2_set_pwm_micro: '핀 %1 에 서보 펄스 폭을 %2 마이크로초로 설정하기 %3',
                },
                Blocks: {
                    scalar: 'Scalar',
                    up: 'Up',
                    down: 'Down',
                    left: 'Left',
                    right: 'Right',
                    face_up: 'Face Up',
                    face_down: 'Face Down',
                    freefall: 'Free Fall',
                    '3g': '3G',
                    '6g': '6G',
                    '8g': '8G',
                    shake: 'Shake',
                    octave: 'octave',
                    DADADADUM: 'Beethoven 5th Symphony',
                    ENTERTAINER: 'The Entertainer',
                    PRELUDE: 'First Prelude, J.S.Bach’s 48 Preludes and Fugues',
                    ODE: 'Beethoven’s 9th Symphony',
                    NYAN: 'Nyan Cat',
                    RINGTONE: 'Ringtone',
                    FUNK: 'Funk',
                    BLUES: 'Blues',
                    BIRTHDAY: 'Happy Birthday',
                    WEDDING: 'Wedding March',
                    FUNERAL: 'Funeral',
                    PUNCHLINE: 'Punch Line',
                    PYTHON: 'Monty Python’s Flying Circus',
                    BADDY: 'Baddy',
                    CHASE: 'Chase',
                    BA_DING: 'Ba-Ding',
                    WAWAWAWAA: 'Sad trombone',
                    JUMP_UP: 'Jump Up',
                    JUMP_DOWN: 'Jump Down',
                    POWER_UP: 'Power Up',
                    POWER_DOWN: 'Power Down',
                    GIGGLE: 'Giggle',
                    HAPPY: 'Happy',
                    HELLO: 'Hello',
                    MYSTERIOUS: 'Mysterious',
                    SAD: 'Sad',
                    SLIDE: 'Slide',
                    SOARING: 'Soaring',
                    SPRING: 'Spring',
                    TWINKLE: 'Twinkle',
                    YAWN: 'Yawn',
                    sharp: '#',
                    normal: 'Normal',
                    flat: 'b',
                    rest: 'Rest',
                    do: 'Do',
                    re: 'Re',
                    mi: 'Mi',
                    fa: 'Fa',
                    sol: 'Sol',
                    la: 'La',
                    ti: 'Ti',
                    on: 'on',
                    off: 'off',
                    microbit_2_HEART: 'Heart',
                    microbit_2_HEART_SMALL: 'Small Heart',
                    microbit_2_HAPPY: 'Happy',
                    microbit_2_SMILE: 'Smile',
                    microbit_2_SAD: 'Sad',
                    microbit_2_CONFUSED: 'Confused',
                    microbit_2_ANGRY: 'Angry',
                    microbit_2_ASLEEP: 'Asleep',
                    microbit_2_SURPRISED: 'Surprised',
                    microbit_2_SILLY: 'Silly',
                    microbit_2_FABULOUS: 'Fabulous',
                    microbit_2_MEH: 'Meh',
                    microbit_2_YES: 'Yes',
                    microbit_2_NO: 'No',
                    microbit_2_CLOCK1: "1'o clock",
                    microbit_2_CLOCK2: "2'o clock",
                    microbit_2_CLOCK3: "3'o clock",
                    microbit_2_CLOCK4: "4'o clock",
                    microbit_2_CLOCK5: "5'o clock",
                    microbit_2_CLOCK6: "6'o clock",
                    microbit_2_CLOCK7: "7'o clock",
                    microbit_2_CLOCK8: "8'o clock",
                    microbit_2_CLOCK9: "9'o clock",
                    microbit_2_CLOCK10: "10'o clock",
                    microbit_2_CLOCK11: "11'o clock",
                    microbit_2_CLOCK12: "12'o clock",
                    microbit_2_ARROW_N: 'North',
                    microbit_2_ARROW_NE: 'North East',
                    microbit_2_ARROW_E: 'East',
                    microbit_2_ARROW_SE: 'South East',
                    microbit_2_ARROW_S: 'South',
                    microbit_2_ARROW_SW: 'South West',
                    microbit_2_ARROW_W: 'West',
                    microbit_2_ARROW_NW: 'North West',
                    microbit_2_TRIANGLE: 'Triangle',
                    microbit_2_TRIANGLE_LEFT: 'Left Triangle',
                    microbit_2_CHESSBOARD: 'Chess Board',
                    microbit_2_DIAMOND: 'Diamond',
                    microbit_2_DIAMOND_SMALL: 'Small Diamond',
                    microbit_2_SQUARE: 'Square',
                    microbit_2_SQUARE_SMALL: 'Small Square',
                    microbit_2_RABBIT: 'Rabbit',
                    microbit_2_COW: 'Cow',
                    microbit_2_MUSIC_CROTCHET: 'Crotchet',
                    microbit_2_MUSIC_QUAVER: 'Quaver',
                    microbit_2_MUSIC_QUAVERS: 'Quavers',
                    microbit_2_PITCHFORK: 'Pitchfork',
                    microbit_2_XMAS: 'X-mas',
                    microbit_2_PACMAN: 'Pacman',
                    microbit_2_TARGET: 'Target',
                    microbit_2_TSHIRT: 'T-shirt',
                    microbit_2_ROLLERSKATE: 'Roller Skate',
                    microbit_2_DUCK: 'Duck',
                    microbit_2_HOUSE: 'Horse',
                    microbit_2_TORTOISE: 'Tortoise',
                    microbit_2_BUTTERFLY: 'Butterfly',
                    microbit_2_STICKFIGURE: 'Stickman',
                    microbit_2_GHOST: 'Ghost',
                    microbit_2_SWORD: 'Sword',
                    microbit_2_GIRAFFE: 'Giraffe',
                    microbit_2_SKULL: 'Skull',
                    microbit_2_UMBRELLA: 'Umbrella',
                    microbit_2_SNAKE: 'Snake',
                },
                Helper: {
                    microbit2_get_analog: '핀 %1 번 아날로그 값',
                    microbit2_set_analog: '핀 %1 에 아날로그 값 %2 를 출력하기 %3',
                    microbit2_get_digital: '핀 %1 번 디지털 값',
                    microbit2_set_digital: '핀 %1 에 디지털 값 %2 를 출력하기 %3',
                    microbit2_screen_toggle: 'LED 기능 %1 %2',
                    microbit2_set_led: 'LED의 X: %1 Y: %2 를 밝기 %3 (으)로 정하기 %4',
                    microbit2_get_led: 'LED의 X: %1 Y: %2 밝기 값',
                    microbit2_show_preset_image: 'LED에 %1 모양 켜기 %2',
                    microbit2_show_custom_image: 'LED %1 켜기 %2',
                    microbit2_reset_screen: 'LED 모두 지우기 %1',
                    microbit2_show_string: 'LED에 %1 을(를) 나타내기 %2',
                    microbit2_radio_toggle: '라디오 기능 %1 %2',
                    microbit2_radio_setting: '라디오 채널을 %1 (으)로 바꾸기 %2',
                    microbit2_radio_send: '라디오로 %1 송신하기 %2',
                    microbit2_radio_received: '라디오 수신 값',
                    microbit2_speaker_toggle: '스피커 기능 %1 %2',
                    microbit2_change_tempo: '연주 속도를 %1 박에 %2 BPM으로 정하기 %3',
                    microbit2_set_tone: '%1 음을 %2 박만큼 연주하기 %3',
                    microbit2_play_preset_music: '%1 음악을 연주하기 %2',
                    microbit2_play_sound_effect: '%1 효과음을 연주하기 %2',
                    microbit2_get_btn: '%1 버튼이 눌렸는가?',
                    microbit2_get_logo: '로고를 터치했는가?',
                    microbit2_get_gesture: '움직임이 %1 인가?',
                    microbit2_get_acc: '%1 의 가속도 값',
                    microbit2_get_direction: '나침반 방향',
                    microbit2_get_field_strength_axis: '%1 의 자기장 세기 값',
                    microbit2_get_light_level: '빛 센서 값',
                    microbit2_get_temperature: '온도 값',
                    microbit2_get_sound_level: '마이크 소리 크기 값',
                    microbit2_set_servo: '핀 %1 의 서보모터 각도를 %2로 설정하기',
                    microbit2_set_pwm_milli: '핀 %1 에 서보 펄스 폭을 %2 밀리초로 설정하기 %3',
                    microbit2_set_pwm_micro: '핀 %1 에 서보 펄스 폭을 %2 마이크로초로 설정하기 %3',
                },
            },
        };
    }

    getResponse({ id, command, payload }) {
        const codeId = this.generateCodeId(id, command, payload);
        const parsedResponse = this.commandValue[codeId].split(';');
        return parsedResponse;
    }

    getBlocks = function() {
        return {
            microbit2_get_analog: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                fontColor: '#ffffff',
                skeleton: 'basic_string_field',
                statements: [],
                params: [
                    {
                        type: 'Dropdown',
                        options: this.analogPins,
                        value: 0,
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                ],
                events: {},
                class: 'microbit2Pin',
                isNotFor: ['microbit2'],
                def: {
                    type: 'microbit2_get_analog',
                },
                paramsKeyMap: {
                    VALUE: 0,
                },
                func: (sprite, script) => {
                    const value = script.getValue('VALUE');
                    const reqOptions = {
                        id: script.entity.id,
                        command: functionKeys.GET_ANALOG,
                        payload: value,
                    };
                    this.requestCommandWithResponse(reqOptions);
                    const parsedResponse = this.getResponse(reqOptions);
                    return parsedResponse[1];
                },
            },
            microbit2_get_digital: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                fontColor: '#ffffff',
                skeleton: 'basic_string_field',
                statements: [],
                params: [
                    {
                        type: 'Dropdown',
                        options: this.digitalPins,
                        value: 8,
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                ],
                events: {},
                class: 'microbit2Pin',
                isNotFor: ['microbit2'],
                def: {
                    type: 'microbit2_get_digital',
                },
                paramsKeyMap: { VALUE: 0 },
                func: (sprite, script) => {
                    const value = script.getValue('VALUE');
                    const reqOptions = {
                        id: script.entity.id,
                        command: functionKeys.GET_DIGITAL,
                        payload: value,
                    };
                    this.requestCommandWithResponse(reqOptions);
                    const parsedResponse = this.getResponse(reqOptions);
                    return parsedResponse[1];
                },
            },
            microbit2_set_analog: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                fontColor: '#ffffff',
                skeleton: 'basic',
                statements: [],
                params: [
                    {
                        type: 'Dropdown',
                        options: this.analogPins,
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
                class: 'microbit2Pin',
                isNotFor: ['microbit2'],
                def: {
                    type: 'microbit2_set_analog',
                },
                paramsKeyMap: {
                    PIN: 0,
                    VALUE: 1,
                },
                func: (sprite, script) => {
                    const pin = script.getValue('PIN');
                    const value = Math.round(_clamp(script.getNumberValue('VALUE'), 0, 1023));

                    const parsedPayload = `${pin};${value}`;
                    const reqOptions = {
                        id: script.entity.id,
                        command: functionKeys.SET_ANALOG,
                        payload: parsedPayload,
                    };
                    this.requestCommandWithResponse(reqOptions);
                    const parsedResponse = this.getResponse(reqOptions);
                    return;
                },
            },
            microbit2_set_digital: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                fontColor: '#ffffff',
                skeleton: 'basic',
                statements: [],
                params: [
                    {
                        type: 'Dropdown',
                        options: this.digitalPins,
                        value: 8,
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                    {
                        type: 'Dropdown',
                        options: [
                            [0, 0],
                            [1, 1],
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
                class: 'microbit2Pin',
                isNotFor: ['microbit2'],
                def: {
                    type: 'microbit2_set_digital',
                },
                paramsKeyMap: { PIN: 0, VALUE: 1 },
                func: (sprite, script) => {
                    const pin = script.getValue('PIN');
                    const value = script.getValue('VALUE');
                    const parsedPayload = `${pin};${value}`;
                    const reqOptions = {
                        id: script.entity.id,
                        command: functionKeys.SET_DIGITAL,
                        payload: parsedPayload,
                    };
                    this.requestCommandWithResponse(reqOptions);
                    const parsedResponse = this.getResponse(reqOptions);
                    return;
                },
            },
            microbit2_set_led: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic',
                statements: [],
                params: [
                    {
                        type: 'Block',
                        accept: 'string',
                        defaultType: 'number',
                        value: 0,
                    },
                    {
                        type: 'Block',
                        accept: 'string',
                        defaultType: 'number',
                        value: 0,
                    },
                    {
                        type: 'Block',
                        accept: 'string',
                        defaultType: 'number',
                        value: 9,
                    },
                    {
                        type: 'Indicator',
                        img: 'block_icon/hardware_icon.svg',
                        size: 12,
                    },
                ],
                events: {},
                class: 'microbit2Led',
                isNotFor: ['microbit2'],
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
                        {
                            type: 'text',
                            params: ['9'],
                        },
                    ],
                    type: 'microbit2_set_led',
                },
                paramsKeyMap: {
                    X: 0,
                    Y: 1,
                    VALUE: 2,
                },
                func: (sprite, script) => {
                    const value = script.getNumberValue('VALUE');
                    const x = script.getNumberValue('X');
                    const y = script.getNumberValue('Y');
                    if (x < 0 || y < 0 || x > 4 || y > 4 || value < 0 || value > 9) {
                        return;
                    }
                    const data = {
                        type: functionKeys.SET_LED,
                        data: {
                            x,
                            y,
                            value,
                        },
                    };

                    const parsedPayload = `${x};${y};${value}`;
                    const reqOptions = {
                        id: script.entity.id,
                        command: functionKeys.SET_LED,
                        payload: parsedPayload,
                    };
                    this.requestCommandWithResponse(reqOptions);
                    const parsedResponse = this.getResponse(reqOptions);
                },
            },
            microbit2_get_led: {
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
                        value: 0,
                    },
                    {
                        type: 'Block',
                        accept: 'string',
                        defaultType: 'number',
                        value: 0,
                    },
                ],
                events: {},
                class: 'microbit2Led',
                isNotFor: ['microbit2'],
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
                    type: 'microbit2_get_led',
                },
                paramsKeyMap: {
                    X: 0,
                    Y: 1,
                },
                func: (sprite, script) => {
                    const x = script.getNumberValue('X');
                    const y = script.getNumberValue('Y');
                    if (x < 0 || y < 0 || x > 4 || y > 4) {
                        return;
                    }
                    const parsedPayload = `${x};${y}`;

                    const reqOptions = {
                        id: script.entity.id,
                        command: functionKeys.GET_LED,
                        payload: parsedPayload,
                    };
                    this.requestCommandWithResponse(reqOptions);
                    const parsedResponse = this.getResponse(reqOptions);

                    if (parsedResponse[1] == 0) {
                        return 0;
                    } else if (parsedResponse[1] == 1) {
                        return 1;
                    }

                    return Math.round(Math.log2(parsedResponse[1] * 2));
                },
            },
            microbit2_show_preset_image: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                fontColor: '#ffffff',
                skeleton: 'basic',
                statements: [],
                params: [
                    {
                        type: 'Dropdown',
                        options: [
                            [Lang.Blocks.microbit_2_HEART, 0],
                            [Lang.Blocks.microbit_2_HEART_SMALL, 1],
                            [Lang.Blocks.microbit_2_HAPPY, 2],
                            [Lang.Blocks.microbit_2_SMILE, 3],
                            [Lang.Blocks.microbit_2_SAD, 4],
                            [Lang.Blocks.microbit_2_CONFUSED, 5],
                            [Lang.Blocks.microbit_2_ANGRY, 6],
                            [Lang.Blocks.microbit_2_ASLEEP, 7],
                            [Lang.Blocks.microbit_2_SURPRISED, 8],
                            [Lang.Blocks.microbit_2_SILLY, 9],
                            [Lang.Blocks.microbit_2_FABULOUS, 10],
                            [Lang.Blocks.microbit_2_MEH, 11],
                            [Lang.Blocks.microbit_2_YES, 12],
                            [Lang.Blocks.microbit_2_NO, 13],
                            [Lang.Blocks.microbit_2_TRIANGLE, 34],
                            [Lang.Blocks.microbit_2_TRIANGLE_LEFT, 35],
                            [Lang.Blocks.microbit_2_CHESSBOARD, 36],
                            [Lang.Blocks.microbit_2_DIAMOND, 37],
                            [Lang.Blocks.microbit_2_DIAMOND_SMALL, 38],
                            [Lang.Blocks.microbit_2_SQUARE, 39],
                            [Lang.Blocks.microbit_2_SQUARE_SMALL, 40],
                            [Lang.Blocks.microbit_2_RABBIT, 41],
                            [Lang.Blocks.microbit_2_COW, 42],
                            [Lang.Blocks.microbit_2_MUSIC_CROTCHET, 43],
                            [Lang.Blocks.microbit_2_MUSIC_QUAVER, 44],
                            [Lang.Blocks.microbit_2_MUSIC_QUAVERS, 45],
                            [Lang.Blocks.microbit_2_PITCHFORK, 46],
                            [Lang.Blocks.microbit_2_XMAS, 47],
                            [Lang.Blocks.microbit_2_PACMAN, 48],
                            [Lang.Blocks.microbit_2_TARGET, 49],
                            [Lang.Blocks.microbit_2_TSHIRT, 50],
                            [Lang.Blocks.microbit_2_ROLLERSKATE, 51],
                            [Lang.Blocks.microbit_2_DUCK, 52],
                            [Lang.Blocks.microbit_2_HOUSE, 53],
                            [Lang.Blocks.microbit_2_TORTOISE, 54],
                            [Lang.Blocks.microbit_2_BUTTERFLY, 55],
                            [Lang.Blocks.microbit_2_STICKFIGURE, 56],
                            [Lang.Blocks.microbit_2_GHOST, 57],
                            [Lang.Blocks.microbit_2_SWORD, 58],
                            [Lang.Blocks.microbit_2_GIRAFFE, 59],
                            [Lang.Blocks.microbit_2_SKULL, 60],
                            [Lang.Blocks.microbit_2_UMBRELLA, 61],
                            [Lang.Blocks.microbit_2_SNAKE, 62],
                            [Lang.Blocks.microbit_2_CLOCK1, 14],
                            [Lang.Blocks.microbit_2_CLOCK2, 15],
                            [Lang.Blocks.microbit_2_CLOCK3, 16],
                            [Lang.Blocks.microbit_2_CLOCK4, 17],
                            [Lang.Blocks.microbit_2_CLOCK5, 18],
                            [Lang.Blocks.microbit_2_CLOCK6, 19],
                            [Lang.Blocks.microbit_2_CLOCK7, 20],
                            [Lang.Blocks.microbit_2_CLOCK8, 21],
                            [Lang.Blocks.microbit_2_CLOCK9, 22],
                            [Lang.Blocks.microbit_2_CLOCK10, 23],
                            [Lang.Blocks.microbit_2_CLOCK11, 24],
                            [Lang.Blocks.microbit_2_CLOCK12, 25],
                            [Lang.Blocks.microbit_2_ARROW_N, 26],
                            [Lang.Blocks.microbit_2_ARROW_NE, 27],
                            [Lang.Blocks.microbit_2_ARROW_E, 28],
                            [Lang.Blocks.microbit_2_ARROW_SE, 29],
                            [Lang.Blocks.microbit_2_ARROW_S, 30],
                            [Lang.Blocks.microbit_2_ARROW_SW, 31],
                            [Lang.Blocks.microbit_2_ARROW_W, 32],
                            [Lang.Blocks.microbit_2_ARROW_NW, 33],
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
                class: 'microbit2Led',
                isNotFor: ['microbit2'],
                def: {
                    type: 'microbit2_show_preset_image',
                },
                paramsKeyMap: {
                    VALUE: 0,
                },
                func: (sprite, script) => {
                    const value = _clamp(script.getNumberValue('VALUE'), 0, 62);
                    const parsedPayload = `${value}`;
                    const reqOptions = {
                        id: script.entity.id,
                        command: functionKeys.PRESET_IMAGE,
                        payload: parsedPayload,
                    };
                    this.requestCommandWithResponse(reqOptions);
                    const parsedResponse = this.getResponse(reqOptions);
                },
            },
            microbit2_show_custom_image: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic',
                statements: [],
                params: [
                    {
                        type: 'Led2',
                    },
                    {
                        type: 'Indicator',
                        img: 'block_icon/hardware_icon.svg',
                        size: 12,
                    },
                ],
                events: {},
                class: 'microbit2Led',
                isNotFor: ['microbit2'],
                def: {
                    type: 'microbit2_show_custom_image',
                },
                paramsKeyMap: {
                    VALUE: 0,
                },
                func: (sprite, script) => {
                    const value = script.getField('VALUE');
                    const processedValue = [];
                    for (const i in value) {
                        processedValue[i] = value[i].join();
                    }
                    const parsedPayload = `${processedValue.join(':').replace(/,/gi, '')}`;
                    const reqOptions = {
                        id: script.entity.id,
                        command: functionKeys.SET_CUSTOM_IMAGE,
                        payload: parsedPayload,
                    };
                    this.requestCommandWithResponse(reqOptions);
                    const parsedResponse = this.getResponse(reqOptions);
                },
            },
            microbit2_show_string: {
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
                class: 'microbit2Led',
                isNotFor: ['microbit2'],
                def: {
                    params: [
                        {
                            type: 'text',
                            params: ['Hello!'],
                            accept: 'string',
                        },
                    ],
                    type: 'microbit2_show_string',
                },
                paramsKeyMap: {
                    VALUE: 0,
                },
                func: (sprite, script) => {
                    let payload = script.getStringValue('VALUE');
                    payload = payload.replace(
                        /[^A-Za-z0-9_\`\~\!\@\#\$\%\^\&\*\(\)\-\=\+\\\{\}\[\]\'\"\;\:\<\,\>\.\?\/\s]/gim,
                        ''
                    );
                    const reqOptions = {
                        id: script.entity.id,
                        command: functionKeys.SET_STRING,
                        payload,
                    };
                    this.requestCommandWithResponse(reqOptions);
                    const parsedResponse = this.getResponse(reqOptions);
                },
            },
            microbit2_reset_screen: {
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
                class: 'microbit2Led',
                isNotFor: ['microbit2'],
                def: {
                    type: 'microbit2_reset_screen',
                },
                paramsKeyMap: {},
                func: (sprite, script) => {
                    const reqOptions = {
                        id: script.entity.id,
                        command: functionKeys.RESET_SCREEN,
                    };
                    this.requestCommandWithResponse(reqOptions);
                    const parsedResponse = this.getResponse(reqOptions);
                },
            },
            microbit2_screen_toggle: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic',
                statements: [],
                params: [
                    {
                        type: 'Dropdown',
                        options: [
                            [Lang.Blocks.on, functionKeys.DISPLAY_ON],
                            [Lang.Blocks.off, functionKeys.DISPLAY_OFF],
                        ],
                        value: functionKeys.DISPLAY_ON,
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
                class: 'microbit2Led',
                isNotFor: ['microbit2'],
                def: {
                    type: 'microbit2_screen_toggle',
                },
                paramsKeyMap: { VALUE: 0 },
                func: (sprite, script) => {
                    const command = script.getField('VALUE');
                    const reqOptions = {
                        id: script.entity.id,
                        command,
                    };
                    this.requestCommandWithResponse(reqOptions);
                    const parsedResponse = this.getResponse(reqOptions);
                },
            },
            microbit2_speaker_toggle: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic',
                statements: [],
                params: [
                    {
                        type: 'Dropdown',
                        options: [
                            [Lang.Blocks.on, functionKeys.SPEAKER_ON],
                            [Lang.Blocks.off, functionKeys.SPEAKER_OFF],
                        ],
                        value: functionKeys.SPEAKER_ON,
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
                class: 'microbit2Sound',
                isNotFor: ['microbit2'],
                def: {
                    type: 'microbit2_speaker_toggle',
                },
                paramsKeyMap: { VALUE: 0 },
                func: (sprite, script) => {
                    const command = script.getField('VALUE');
                    const reqOptions = {
                        id: script.entity.id,
                        command,
                    };
                    this.requestCommandWithResponse(reqOptions);
                    const parsedResponse = this.getResponse(reqOptions);
                },
            },
            microbit2_change_tempo: {
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
                class: 'microbit2Sound',
                isNotFor: ['microbit2'],
                def: {
                    params: [
                        {
                            type: 'text',
                            params: ['4'],
                        },
                        {
                            type: 'text',
                            params: ['120'],
                        },
                    ],
                    type: 'microbit2_change_tempo',
                },
                paramsKeyMap: {
                    BEAT: 0,
                    BPM: 1,
                },
                func: (sprite, script) => {
                    const beat = Math.round(_clamp(script.getNumberValue('BEAT'), 0, 4));
                    const bpm = Math.round(_clamp(script.getNumberValue('BPM'), 1, 230));

                    const parsedPayload = `${beat};${bpm}`;
                    const reqOptions = {
                        id: script.entity.id,
                        command: functionKeys.CHANGE_TEMPO,
                        payload: parsedPayload,
                    };
                    this.requestCommandWithResponse(reqOptions);
                    const parsedResponse = this.getResponse(reqOptions);
                },
            },
            microbit2_set_tone: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic',
                statements: [],
                params: [
                    {
                        type: 'MusicScale',
                    },
                    {
                        type: 'Dropdown',
                        options: [
                            ['4', 16],
                            ['2', 8],
                            ['1', 4],
                            ['1/2', 2],
                            ['1/4', 1],
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
                class: 'microbit2Sound',
                isNotFor: ['microbit2'],
                def: {
                    type: 'microbit2_set_tone',
                },
                paramsKeyMap: {
                    SCALE: 0,
                    NOTE: 1,
                },
                func: (sprite, script) => {
                    const scale = script.getField('SCALE');
                    const note = script.getField('NOTE');
                    const parsedPayload = `${scale}:${note}`;

                    const reqOptions = {
                        id: script.entity.id,
                        command: functionKeys.PLAY_TONE,
                        payload: parsedPayload,
                    };
                    this.requestCommandWithResponse(reqOptions);
                    const parsedResponse = this.getResponse(reqOptions);
                },
            },
            microbit2_play_preset_music: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                fontColor: '#ffffff',
                skeleton: 'basic',
                statements: [],
                params: [
                    {
                        type: 'Dropdown',
                        options: [
                            [Lang.Blocks.DADADADUM, 0],
                            [Lang.Blocks.ENTERTAINER, 1],
                            [Lang.Blocks.PRELUDE, 2],
                            [Lang.Blocks.ODE, 3],
                            [Lang.Blocks.NYAN, 4],
                            [Lang.Blocks.RINGTONE, 5],
                            [Lang.Blocks.FUNK, 6],
                            [Lang.Blocks.BLUES, 7],
                            [Lang.Blocks.BIRTHDAY, 8],
                            [Lang.Blocks.WEDDING, 9],
                            [Lang.Blocks.FUNERAL, 10],
                            [Lang.Blocks.PUNCHLINE, 11],
                            [Lang.Blocks.PYTHON, 12],
                            [Lang.Blocks.BADDY, 13],
                            [Lang.Blocks.CHASE, 14],
                            [Lang.Blocks.BA_DING, 15],
                            [Lang.Blocks.WAWAWAWAA, 16],
                            [Lang.Blocks.JUMP_UP, 17],
                            [Lang.Blocks.JUMP_DOWN, 18],
                            [Lang.Blocks.POWER_UP, 19],
                            [Lang.Blocks.POWER_DOWN, 20],
                            [Lang.Blocks.GIGGLE, 21],
                            [Lang.Blocks.HAPPY, 22],
                            [Lang.Blocks.HELLO, 23],
                            [Lang.Blocks.MYSTERIOUS, 24],
                            [Lang.Blocks.SAD, 25],
                            [Lang.Blocks.SLIDE, 26],
                            [Lang.Blocks.SOARING, 27],
                            [Lang.Blocks.SPRING, 28],
                            [Lang.Blocks.TWINKLE, 29],
                            [Lang.Blocks.YAWN, 30],
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
                class: 'microbit2Sound',
                isNotFor: ['microbit2'],
                def: {
                    type: 'microbit2_play_preset_music',
                },
                paramsKeyMap: {
                    VALUE: 0,
                },
                func: (sprite, script) => {
                    const value = _clamp(script.getNumberValue('VALUE'), 0, 20);
                    const parsedPayload = `${value}`;
                    const reqOptions = {
                        id: script.entity.id,
                        command: functionKeys.PLAY_MELODY,
                        payload: parsedPayload,
                    };
                    this.requestCommandWithResponse(reqOptions);
                    const parsedResponse = this.getResponse(reqOptions);
                },
            },
            microbit2_play_sound_effect: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                fontColor: '#ffffff',
                skeleton: 'basic',
                statements: [],
                params: [
                    {
                        type: 'Dropdown',
                        options: [
                            [Lang.Blocks.GIGGLE, 21],
                            [Lang.Blocks.HAPPY, 22],
                            [Lang.Blocks.HELLO, 23],
                            [Lang.Blocks.MYSTERIOUS, 24],
                            [Lang.Blocks.SAD, 25],
                            [Lang.Blocks.SLIDE, 26],
                            [Lang.Blocks.SOARING, 27],
                            [Lang.Blocks.SPRING, 28],
                            [Lang.Blocks.TWINKLE, 29],
                            [Lang.Blocks.YAWN, 30],
                        ],
                        value: 21,
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
                class: 'microbit2Sound',
                isNotFor: ['microbit2'],
                def: {
                    type: 'microbit2_play_sound_effect',
                },
                paramsKeyMap: {
                    VALUE: 0,
                },
                func: (sprite, script) => {
                    const value = _clamp(script.getNumberValue('VALUE'), 21, 30);
                    const parsedPayload = `${value}`;
                    const reqOptions = {
                        id: script.entity.id,
                        command: functionKeys.PLAY_SOUND,
                        payload: parsedPayload,
                    };
                    this.requestCommandWithResponse(reqOptions);
                    const parsedResponse = this.getResponse(reqOptions);
                },
            },
            microbit2_radio_toggle: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic',
                statements: [],
                params: [
                    {
                        type: 'Dropdown',
                        options: [
                            [Lang.Blocks.on, functionKeys.RADIO_ON],
                            [Lang.Blocks.off, functionKeys.RADIO_OFF],
                        ],
                        value: functionKeys.RADIO_ON,
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
                class: 'microbit2Radio',
                isNotFor: ['microbit2'],
                def: {
                    type: 'microbit2_radio_toggle',
                },
                paramsKeyMap: { VALUE: 0 },
                func: (sprite, script) => {
                    const command = script.getField('VALUE');
                    const reqOptions = {
                        id: script.entity.id,
                        command,
                    };
                    this.requestCommandWithResponse(reqOptions);
                    const parsedResponse = this.getResponse(reqOptions);
                },
            },
            microbit2_radio_setting: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic',
                statements: [],
                params: [
                    {
                        type: 'Block',
                        accept: 'string',
                        defaultType: 'number',
                        value: 7,
                    },
                    {
                        type: 'Indicator',
                        img: 'block_icon/hardware_icon.svg',
                        size: 12,
                    },
                ],
                events: {},
                class: 'microbit2Radio',
                isNotFor: ['microbit2'],
                def: {
                    type: 'microbit2_radio_setting',
                },
                paramsKeyMap: { RATE: 0, CHANNEL: 1 },
                func: (sprite, script) => {
                    const channel = Math.round(_clamp(script.getNumberValue('CHANNEL'), 0, 83));
                    const reqOptions = {
                        id: script.entity.id,
                        command: functionKeys.SETTING_RADIO,
                        payload: channel,
                    };
                    this.requestCommandWithResponse(reqOptions);
                    const parsedResponse = this.getResponse(reqOptions);
                },
            },
            microbit2_radio_send: {
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
                class: 'microbit2Radio',
                isNotFor: ['microbit2'],
                def: {
                    type: 'microbit2_radio_send',
                },
                paramsKeyMap: { VALUE: 0 },
                func: (sprite, script) => {
                    const value = script.getStringValue('VALUE');
                    const reqOptions = {
                        id: script.entity.id,
                        command: functionKeys.SET_RADIO,
                        payload: value,
                    };
                    this.requestCommandWithResponse(reqOptions);
                    const parsedResponse = this.getResponse(reqOptions);
                },
            },
            microbit2_radio_received: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                fontColor: '#ffffff',
                skeleton: 'basic_string_field',
                statements: [],
                params: [],
                events: {},
                class: 'microbit2Radio',
                isNotFor: ['microbit2'],
                def: {
                    type: 'microbit2_radio_received',
                },
                paramsKeyMap: {},
                func: (sprite, script) => {
                    const reqOptions = {
                        id: script.entity.id,
                        command: functionKeys.GET_RADIO,
                    };
                    this.requestCommandWithResponse(reqOptions);
                    const parsedResponse = this.getResponse(reqOptions);
                    return parsedResponse[1];
                },
            },
            microbit2_get_btn: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                fontColor: '#ffffff',
                skeleton: 'basic_boolean_field',
                statements: [],
                params: [
                    {
                        type: 'Dropdown',
                        options: [
                            ['A', 'a'],
                            ['B', 'b'],
                            ['A+B', 'ab'],
                        ],
                        value: 'a',
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                ],
                events: {},
                class: 'microbit2Sensor',
                isNotFor: ['microbit2'],
                def: {
                    type: 'microbit2_get_btn',
                },
                paramsKeyMap: {
                    VALUE: 0,
                },
                func: (sprite, script) => {
                    const value = script.getField('VALUE');

                    const reqOptions = {
                        id: script.entity.id,
                        command: functionKeys.GET_BTN,
                    };
                    this.requestCommandWithResponse(reqOptions);
                    const parsedResponse = this.getResponse(reqOptions);

                    if (parsedResponse[1] == '1' && value == 'a') {
                        return 1;
                    } else if (parsedResponse[1] == '2' && value == 'b') {
                        return 1;
                    } else if (parsedResponse[1] == '3' && value == 'ab') {
                        return 1;
                    } else return 0;
                },
            },
            microbit2_get_logo: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                fontColor: '#ffffff',
                skeleton: 'basic_boolean_field',
                statements: [],
                params: [],
                events: {},
                class: 'microbit2Sensor',
                isNotFor: ['microbit2'],
                def: {
                    type: 'microbit2_get_logo',
                },
                paramsKeyMap: {},
                func: (sprite, script) => {
                    const reqOptions = {
                        id: script.entity.id,
                        command: functionKeys.GET_LOGO,
                    };
                    this.requestCommandWithResponse(reqOptions);
                    const parsedResponse = this.getResponse(reqOptions);

                    if (parsedResponse[1] == '1') {
                        return 1;
                    } else return 0;
                },
            },
            microbit2_get_acc: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                fontColor: '#ffffff',
                skeleton: 'basic_string_field',
                statements: [],
                params: [
                    {
                        type: 'Dropdown',
                        options: [
                            ['X', 'x'],
                            ['Y', 'y'],
                            ['Z', 'z'],
                            [Lang.Blocks.scalar, 'mag'],
                        ],
                        value: 'x',
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                ],
                events: {},
                class: 'microbit2Sensor',
                isNotFor: ['microbit2'],
                def: {
                    type: 'microbit2_get_acc',
                },
                paramsKeyMap: {
                    AXIS: 0,
                },
                func: (sprite, script) => {
                    const axis = script.getField('AXIS');
                    const reqOptions = {
                        id: script.entity.id,
                        command: functionKeys.GET_ACC,
                        payload: axis,
                    };
                    this.requestCommandWithResponse(reqOptions);
                    const parsedResponse = this.getResponse(reqOptions);
                    return parsedResponse[1];
                },
            },
            microbit2_get_gesture: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                fontColor: '#ffffff',
                skeleton: 'basic_boolean_field',
                statements: [],
                params: [
                    {
                        type: 'Dropdown',
                        options: [
                            [Lang.Blocks.up, 'up'],
                            [Lang.Blocks.down, 'down'],
                            [Lang.Blocks.left, 'left'],
                            [Lang.Blocks.right, 'right'],
                            [Lang.Blocks.face_up, 'face up'],
                            [Lang.Blocks.face_down, 'face down'],
                            [Lang.Blocks.freefall, 'freefall'],
                            [Lang.Blocks['3g'], '3g'],
                            [Lang.Blocks['6g'], '6g'],
                            [Lang.Blocks['8g'], '8g'],
                            [Lang.Blocks['shake'], 'shake'],
                        ],
                        value: 'up',
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                ],
                events: {},
                class: 'microbit2Sensor',
                isNotFor: ['microbit2'],
                def: {
                    type: 'microbit2_get_gesture',
                },
                paramsKeyMap: { GESTURE: 0 },
                func: (sprite, script) => {
                    const gesture = script.getField('GESTURE');

                    const reqOptions = {
                        id: script.entity.id,
                        command: functionKeys.GET_GESTURE,
                    };
                    this.requestCommandWithResponse(reqOptions);
                    const parsedResponse = this.getResponse(reqOptions);
                    if (gesture === parsedResponse[1]) {
                        return true;
                    }
                    return false;
                },
            },
            microbit2_get_direction: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                fontColor: '#ffffff',
                skeleton: 'basic_string_field',
                statements: [],
                params: [],
                events: {},
                class: 'microbit2Sensor',
                isNotFor: ['microbit2'],
                def: {
                    type: 'microbit2_get_direction',
                },
                paramsKeyMap: {},
                func: (sprite, script) => {
                    const reqOptions = {
                        id: script.entity.id,
                        command: functionKeys.GET_DIRECTION,
                    };
                    this.requestCommandWithResponse(reqOptions);
                    const parsedResponse = this.getResponse(reqOptions);
                    return parsedResponse[1];
                },
            },
            microbit2_get_field_strength_axis: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                fontColor: '#ffffff',
                skeleton: 'basic_string_field',
                statements: [],
                params: [
                    {
                        type: 'Dropdown',
                        options: [
                            ['X', 'x'],
                            ['Y', 'y'],
                            ['Z', 'z'],
                            [Lang.Blocks.scalar, 'mag'],
                        ],
                        value: 'x',
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                ],
                events: {},
                class: 'microbit2Sensor',
                isNotFor: ['microbit2'],
                def: {
                    type: 'microbit2_get_field_strength_axis',
                },
                paramsKeyMap: {
                    AXIS: 0,
                },
                func: (sprite, script) => {
                    const axis = script.getField('AXIS');
                    const reqOptions = {
                        id: script.entity.id,
                        command: functionKeys.GET_FIELD_STRENGTH,
                        payload: axis,
                    };
                    this.requestCommandWithResponse(reqOptions);
                    const parsedResponse = this.getResponse(reqOptions);
                    return parsedResponse[1];
                },
            },
            microbit2_get_light_level: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                fontColor: '#ffffff',
                skeleton: 'basic_string_field',
                statements: [],
                params: [],
                events: {},
                class: 'microbit2Sensor',
                isNotFor: ['microbit2'],
                def: {
                    type: 'microbit2_get_light_level',
                },
                paramsKeyMap: {},
                func: (sprite, script) => {
                    const reqOptions = {
                        id: script.entity.id,
                        command: functionKeys.GET_LIGHT_LEVEL,
                    };
                    this.requestCommandWithResponse(reqOptions);
                    const parsedResponse = this.getResponse(reqOptions);
                    return parsedResponse[1];
                },
            },
            microbit2_get_temperature: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                fontColor: '#ffffff',
                skeleton: 'basic_string_field',
                statements: [],
                params: [],
                events: {},
                class: 'microbit2Sensor',
                isNotFor: ['microbit2'],
                def: {
                    type: 'microbit2_get_temperature',
                },
                paramsKeyMap: {},
                func: (sprite, script) => {
                    const reqOptions = {
                        id: script.entity.id,
                        command: functionKeys.GET_TEMPERATURE,
                    };
                    this.requestCommandWithResponse(reqOptions);
                    const parsedResponse = this.getResponse(reqOptions);
                    return parsedResponse[1];
                },
            },
            microbit2_get_sound_level: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                fontColor: '#ffffff',
                skeleton: 'basic_string_field',
                statements: [],
                params: [],
                events: {},
                class: 'microbit2Sensor',
                isNotFor: ['microbit2'],
                def: {
                    type: 'microbit2_get_sound_level',
                },
                paramsKeyMap: {},
                func: (sprite, script) => {
                    const reqOptions = {
                        id: script.entity.id,
                        command: functionKeys.GET_SOUND_LEVEL,
                    };
                    this.requestCommandWithResponse(reqOptions);
                    const parsedResponse = this.getResponse(reqOptions);
                    return parsedResponse[1];
                },
            },
            microbit2_set_pwm_milli: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                fontColor: '#ffffff',
                skeleton: 'basic',
                statements: [],
                params: [
                    {
                        type: 'Dropdown',
                        options: this.analogPins,
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
                class: 'microbit2Servo',
                isNotFor: ['microbit2'],
                def: {
                    type: 'microbit2_set_pwm_milli',
                },
                paramsKeyMap: {
                    PIN: 0,
                    VALUE: 1,
                },
                func: (sprite, script) => {
                    const pin = script.getValue('PIN');
                    const value = Math.round(_clamp(script.getNumberValue('VALUE'), 0, 1023));

                    const parsedPayload = `${pin};${value}`;
                    const reqOptions = {
                        id: script.entity.id,
                        command: functionKeys.SET_SERVO_MILLI,
                        payload: parsedPayload,
                    };
                    this.requestCommandWithResponse(reqOptions);
                    const parsedResponse = this.getResponse(reqOptions);
                    return;
                },
            },
            microbit2_set_pwm_micro: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                fontColor: '#ffffff',
                skeleton: 'basic',
                statements: [],
                params: [
                    {
                        type: 'Dropdown',
                        options: this.analogPins,
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
                class: 'microbit2Servo',
                isNotFor: ['microbit2'],
                def: {
                    type: 'microbit2_set_pwm_micro',
                },
                paramsKeyMap: {
                    PIN: 0,
                    VALUE: 1,
                },
                func: (sprite, script) => {
                    const pin = script.getValue('PIN');
                    const value = Math.round(_clamp(script.getNumberValue('VALUE'), 0, 1023));

                    const parsedPayload = `${pin};${value}`;
                    const reqOptions = {
                        id: script.entity.id,
                        command: functionKeys.SET_SERVO_MICRO,
                        payload: parsedPayload,
                    };
                    this.requestCommandWithResponse(reqOptions);
                    const parsedResponse = this.getResponse(reqOptions);
                    return;
                },
            },
            microbit2_set_servo: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                fontColor: '#ffffff',
                skeleton: 'basic',
                statements: [],
                params: [
                    {
                        type: 'Dropdown',
                        options: this.analogPins,
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
                class: 'microbit2Servo',
                isNotFor: ['microbit2'],
                def: {
                    type: 'microbit2_set_servo',
                },
                paramsKeyMap: {
                    PIN: 0,
                    VALUE: 1,
                },
                func: (sprite, script) => {
                    const pin = script.getValue('PIN');
                    const value = Math.round(_clamp(script.getNumberValue('VALUE'), 0, 180));

                    const parsedPayload = `${pin};${value}`;
                    const reqOptions = {
                        id: script.entity.id,
                        command: functionKeys.SET_SERVO_ANGLE,
                        payload: parsedPayload,
                    };
                    this.requestCommandWithResponse(reqOptions);
                    const parsedResponse = this.getResponse(reqOptions);
                    return;
                },
            },
        };
    };
})();

module.exports = Entry.Microbit2;
