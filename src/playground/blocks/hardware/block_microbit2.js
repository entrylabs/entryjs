'use strict';

const _set = require('lodash/set');
const _get = require('lodash/get');
const _merge = require('lodash/merge');
const _clamp = require('lodash/clamp');

const functionKeys = {
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
            'microbit2_screen_toggle',
            'microbit2_set_led',
            'microbit2_get_led',
            'microbit2_show_preset_image',
            'microbit2_show_custom_image',
            'microbit2_show_full_brightness_custom_image',
            'microbit2_show_string',
            'microbit2_reset_screen',
            'microbit2_speaker_toggle',
            'microbit2_set_tone',
            'microbit2_play_preset_music',
            'microbit2_play_sound_effect',
            'microbit2_get_btn',
        ];
        this.commandStatus = {};
        this.commandValue = {};
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
    requestCommandWithResponse({ id, command, payload }) {
        const codeId = this.generateCodeId(id, command, payload);
        if (!this.commandStatus[codeId]) {
            // 첫 진입시 무조건 AsyncError
            console.log('SEND TO HW : ', {
                type: command,
                payload,
            });
            Entry.hw.sendQueue = {
                type: command,
                payload,
            };
            this.commandStatus[codeId] = 'pending';
            Entry.hw.sendQueue.codeId = codeId;
            Entry.hw.update();
            throw new Entry.Utils.AsyncError();
        } else if (this.commandStatus[codeId] === 'pending' && !this.commandValue[codeId]) {
            // 두 번째 이상의 진입시도이며 작업이 아직 끝나지 않은 경우
            throw new Entry.Utils.AsyncError();
        } else if (this.commandStatus[codeId] === 'completed') {
            // 두 번째 이상의 진입시도이며 pending 도 아닌 경우
            // 블록 func 로직에서 다음 데이터를 처리한다.
            console.log('remove :', codeId);
            delete this.commandStatus[codeId];
            console.log(this.commandStatus);
        }
    }

    generateCodeId(entityId, type, payload) {
        return `${entityId}-${type}${payload ? '-' + payload : ''}`;
    }

    afterReceive(portData) {
        if (portData.recentlyWaitDone) {
            console.log('RECEIVE FROM HW ,', portData);
        }

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
                    microbit2_set_led: 'LED X:%1 Y:%2 밝기 %3 로 세팅 %4',
                    microbit2_get_led: 'LED X:%1 Y:%2 값',
                    microbit2_show_preset_image: '%1 모양 보여주기 %2',
                    microbit2_show_custom_image: '밝기를 포함하여 LED %1 로 출력하기 %2',
                    microbit2_show_full_brightness_custom_image: '가장 밝게 LED %1 로 출력하기 %2',
                    microbit2_show_string: '%1 출력하기 %2',
                    microbit2_reset_screen: '화면 지우기 %1',
                    microbit2_screen_toggle: '화면 %1 %2',
                    microbit2_speaker_toggle: '스피커 %1 %2',
                    microbit2_set_tone: '%1옥타브 %2%3 음을 %4 박자 연주하기 %5',
                    microbit2_play_preset_music: '%1 음악 재생하기 %2',
                    microbit2_play_sound_effect: ' %1 효과음 재생하기 %2',
                    microbit2_get_btn: '%1 버튼이 눌렸는가?',
                },
                Blocks: {
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
                    microbit_2_ARROW_SE: '동남쪽',
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
                    microbit_2_PITCHFORK: '포크',
                    microbit_2_XMAS: '크리스마스',
                    microbit_2_PACMAN: '팩맨',
                    microbit_2_TARGET: '목표',
                    microbit_2_TSHIRT: '티셔츠',
                    microbit_2_ROLLERSKATE: '롤러스케이트',
                    microbit_2_DUCK: '오리',
                    microbit_2_HOUSE: '말',
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
            },
            en: {
                template: {
                    microbit2_set_led: 'SET LED at X:%1 Y:%2 as brightness %3 %4',
                    microbit2_get_led: 'Get LED X:%1 Y:%2 brightness',
                    microbit2_show_preset_image: 'Show %1 shape %2',
                    microbit2_show_custom_image: 'Show %1 shape with brightness %2',
                    microbit2_show_full_brightness_custom_image:
                        'Show %1 shape with full brightness %2',
                    microbit2_show_string: '%1 appear %2',
                    microbit2_reset_screen: 'Reset Screen %1',
                    microbit2_screen_toggle: 'Screen %1 %2',
                    microbit2_speaker_toggle: 'Speaker %1 %2',
                    microbit2_set_tone: 'Play %2 at octave %1 for %3 beat %4',
                    microbit2_play_preset_music: 'Play %1 %2',
                    microbit2_play_sound_effect: 'Play effect %1 %2',
                    microbit2_get_btn: 'is %1 button pressed?',
                },
                Blocks: {
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
                            params: ['0'],
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
                    const value = Math.round(_clamp(script.getNumberValue('VALUE'), 0, 9));
                    const x = Math.round(_clamp(script.getNumberValue('X'), 0, 4));
                    const y = Math.round(_clamp(script.getNumberValue('Y'), 0, 4));
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
                    },
                    {
                        type: 'Block',
                        accept: 'string',
                        defaultType: 'number',
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
                    const x = _clamp(script.getNumberValue('X'), 0, 4);
                    const y = _clamp(script.getNumberValue('Y'), 0, 4);
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
            microbit2_show_full_brightness_custom_image: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic',
                statements: [],
                params: [
                    {
                        type: 'Led',
                        defaultStatus: [
                            [0, 0, 0, 0, 0],
                            [0, 9, 0, 9, 0],
                            [0, 0, 0, 0, 0],
                            [9, 0, 0, 0, 9],
                            [0, 9, 9, 9, 0],
                        ],
                        maxBrightness: 9,
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
                    type: 'microbit2_show_full_brightness_custom_image',
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
            microbit2_set_tone: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic',
                statements: [],
                params: [
                    {
                        type: 'Dropdown',
                        options: [
                            [1, 1],
                            [2, 2],
                            [3, 3],
                            [4, 4],
                            [5, 5],
                        ],
                        value: 1,
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                    {
                        type: 'Dropdown',
                        options: [
                            [Lang.Blocks.rest, 'R'],
                            [Lang.Blocks.do, 'C'],
                            [Lang.Blocks.re, 'D'],
                            [Lang.Blocks.mi, 'E'],
                            [Lang.Blocks.fa, 'F'],
                            [Lang.Blocks.sol, 'G'],
                            [Lang.Blocks.la, 'A'],
                            [Lang.Blocks.ti, 'B'],
                        ],
                        value: 'C',
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                    {
                        type: 'Dropdown',
                        options: [
                            [Lang.Blocks.sharp, '#'],
                            [Lang.Blocks.normal, 'normal'],
                            [Lang.Blocks.flat, 'b'],
                        ],
                        value: 'normal',
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
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
                paramsKeyMap: { OCTAVE: 0, TONE: 1, ADDITIONAL: 2, DURATION: 3 },
                func: (sprite, script) => {
                    const octave = script.getField('OCTAVE');
                    let tone = script.getField('TONE');
                    const duration = script.getField('DURATION');
                    const additional = script.getField('ADDITIONAL');
                    if (additional !== 'normal') {
                        tone += additional;
                    }
                    const parsedPayload = `${tone}${octave}:${duration}`;

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
        };
    };
})();

module.exports = Entry.Microbit2;
