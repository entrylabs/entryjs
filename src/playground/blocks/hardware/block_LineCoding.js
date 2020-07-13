'use strict';

let LmotorSpeed = 0;
let RmotorSpeed = 0;
let LineNum = 20;
let LineInit = 0;
let LineSaveFlag = 0;
let LineOneFlag = 1;
const ServeAngle = [0, 0, 0, 0, 0, 0, 0, 0];
const OutPort = [0, 0, 0, 0, 0, 0, 0, 0];

Entry.LineCoding = {
    id: '3D.1',
    name: 'LineCoding',
    url: 'http://www.ssmake.co.kr/',
    imageName: 'LineCoding.png',
    title: {
        ko: '라인코딩',
        en: 'LineCoding',
    },

    setZero: () => {
        //  하드웨어 초기화 로직
        /*       if (!Entry.hw.sendQueue.SET) {
            Entry.hw.sendQueue = {
                GET: {},
                SET: {},
            };
        } else {
            const keySet = Object.keys(Entry.hw.sendQueue.SET);
            keySet.forEach((key) => {
                Entry.hw.sendQueue.SET[parseInt(key)].data = 0;
                Entry.hw.sendQueue.SET[parseInt(key)].time = new Date().getTime();
            });
        } */

        Entry.hw.sendQueue = {
            GET: {},
            SET: {},
        };
        Entry.hw.sendQueue.SET[9] = {
            type: Entry.LineCoding.sensorTypes.LINE_EASY,
            data: 0,
            time: new Date().getTime(),
        };
        Entry.hw.update();
        LmotorSpeed = 0;
        RmotorSpeed = 0;
        LineNum = 20;
        LineInit = 0;
        LineSaveFlag = 0;
        LineOneFlag = 1;
        ServeAngle[0] = 0;
        ServeAngle[1] = 0;
        ServeAngle[2] = 0;
        ServeAngle[3] = 0;
        ServeAngle[4] = 0;
        ServeAngle[5] = 0;
        ServeAngle[6] = 0;
        ServeAngle[7] = 0;
        OutPort[0] = 0;
        OutPort[1] = 0;
        OutPort[2] = 0;
        OutPort[3] = 0;
        OutPort[4] = 0;
        OutPort[5] = 0;
        OutPort[6] = 0;
        OutPort[7] = 0;
    },
    Static: {
        //        LineCoding_BLOCK_COLOR: '#00979D', // gray(#848484)
        //        LineCoding_ARROW_COLOR_HW: '#00979D',
    },
    sensorTypes: {
        ALIVE: 0,
        DIGITAL: 1,
        ANALOG: 2,
        BUZZER: 3,
        TONE: 34,
        USONIC: 7,
        USONIC_SET: 33,
        LCD_SET: 40,
        LINE_EASY: 51,
        LINE_FW_SPEED: 55,
        LINE_TURN_SPEED: 56,
        LINE_CROSS_TIME: 57,
        LINE_EASY_MOTOR: 58,
        LINE_RESTART: 60,
        LINE_DELAY: 61,
        LINE_LINE: 62,
        LINE_TURN: 63,
        LINE_MOTOR: 64,
        LINE_BMOTOR: 65,
        LINE_BWMOTOR: 66,
        LINE_WHEEL: 67,
        LINE_SERVO: 70,
        LINE_SSERVO: 71,
        LINE_PORT: 72,
        LINE_BUZZER: 73,
        LINE_LED: 74,
        LINE_LINEDELAY: 75,
        LINE_SLINE: 76,
        LINE_LINEFIND: 77,
        LINE_LINELOST: 78,
        LINE_CLINE: 79,
        LINE_CLINE2: 80,
        LINE_FFMOTOR: 90,
        LINE_BBMOTOR: 91,
        LINE_MOTORSTOP: 92,
        LINE_PLINE: 93,
        LINE_START: 94,
        LINE_TIMER: 95,
        LINE_COLOR: 96,
        LINE_ABSH: 97,
        LINE_BLACKFORWARDF: 98,
        LINE_REMOT: 100,
    },
    toneTable: {
        '0': 0,
        C: 1,
        CS: 2,
        D: 3,
        DS: 4,
        E: 5,
        F: 6,
        FS: 7,
        G: 8,
        GS: 9,
        A: 10,
        AS: 11,
        B: 12,
    },
    toneMap: {
        '1': [7644, 3821, 1910, 955, 477],
        '2': [7214, 3607, 1803, 901, 450],
        '3': [6810, 3404, 1702, 850, 425],
        '4': [6247, 3213, 1606, 803, 401],
        '5': [6066, 3033, 1516, 757, 378],
        '6': [5726, 2862, 1431, 715, 357],
        '7': [5404, 2702, 1350, 675, 337],
        '8': [5101, 2550, 1275, 637, 318],
        '9': [4815, 2407, 1203, 601, 300],
        '10': [4544, 2272, 1135, 567, 283],
        '11': [4289, 2144, 1072, 535, 267],
        '12': [4049, 2024, 1011, 505, 252],
    },
    BlockState: {},
};

Entry.LineCoding.blockMenuBlocks = [
    /// 하드웨어 블록 등록 , 여기에 등록된 블록이 순서대로 나열되며 설정한 이름으로 화면에 보임
    'LineCodingStart',
    'LineCodingStop',
    'LineCodingLineEasy',
    'LineCodingEasySet',
    'LineCodingEasyTimeSet',
    'LineCodingEasyMotor',
    'LineCodingRestart',
    'LineCodingDelay',
    'LineCodingLine',
    'LineCodingTurn',
    'LineCodingMotor',
    'LineCodingBmotor',
    //    'LineCodingBwMotor',
    'LineCodingWheel',
    //    'LineCodingSServo',
    //    'LineCodingBmotor',
    /// 디지털 포트 제어
    'LineCodingGetDgitalValue',
    'LineCodingGetAnalogValue',
    'LineCodingDigitalOnOff',
    'LineCodingServo',
    'LineCodingMelody',
    //    'LineCodingSline',
    //    'LineCodingLineFind',
    //    'LineCodingLineLost',
    //    'LineCodingCline',
    //    'LineCodingCline2',
    //    'LineCodingPline',
    //    'LineCodingStart',
    //    'LineCodingTimer',
    //    'LineCodingLineColor',
    //    'LineCodingMotorStop',
    // DC모터 정지하기

    // 서보모터 제어

    //디지탈 입력

    // 아날로그 입력
    //    'LineCodingGetUsonicValue',
    //초음파센서 읽기
    'LineCodingSetLcdString',
    //    'LineCodingSetLcdBacklight',
    'LineCodingSetLcdClear',
    'LineCodingGetAnalogMapping',
    'LineCodingRemotRx',
    'LineCodingLineDelay',
    'LineCodingBlackForwardF',
    'LineCodingBuzzerOnOff',
    'LineCodingLED',
    'LineCodingABSH',
    'LineCodingFFmotor',
    'LineCodingBBmotor',
    'LineCodingMotorStop',
];

Entry.LineCoding.setLanguage = function() {
    // 블록 이름  번역
    return {
        ko: {
            template: {
                LineCodingStart: '%1 저장하기 시작 %2',
                LineCodingStop: '라인트레이서에 저장하기 종료 %1',
                LineCodingLineEasy: '%1 하기 %2',
                LineCodingEasySet: '%1 %2 로 정하기 %3',
                LineCodingEasyTimeSet: '교차로에서 %1mS 더 직진하도록 설정하기 %2',
                LineCodingEasyMotor: '모터 %1 방향으로  %2mS 이동하기 %3',
                LineCodingRestart: 'restart(%1); %2',
                LineCodingDelay: 'delay(%1); %2',
                LineCodingLine: 'line(%1, %2, %3); %4',
                LineCodingTurn: '%1(%2, %3); %4',
                LineCodingMotor: 'motor(%1, %2, %3); %4',
                LineCodingBmotor: '%1(%2, %3, %4); %5',
                LineCodingWheel: 'wheel(%1, %2); %3',
                LineCodingServo: 'sservo(%1, %2, %3); %4',
                LineCodingDigitalOnOff: '디지털 %1 포트 %2 설정하기 %3',
                LineCodingMelody: '스피커 %1 옥타브 %2음 %3 초 연주하기 %4',
                LineCodingMotorStop: 'DC모터 정지하기 %1',
                LineCodingBlackForwardF: 'blackforwardf(%1,%2,%3,%4,%5); %6',
                LineCodingGetDgitalValue: '디지털 %1 포트 읽기',
                LineCodingGetAnalogValue: '아날로그 %1 포트 읽기',
                LineCodingGetAnalogMapping: ' %1 값 %2 ~ %3 에서 %4 ~ %5 으로 변환값',
                LineCodingRemotRx: ' 조종기버튼 %1,  %2 눌리면 실행하는 코드 %3',
                LineCodingLineDelay: 'linedelay(%1, %2, %3); %4',
                LineCodingABSH: 'lineabsh(%1, %2, %3, %4, %5, %6); %7',
                LineCodingBuzzerOnOff: 'buzzer(%1, %2, %3); %4',
                LineCodingLED: 'led(%1, %2, %3, %4); %5',
                LineCodingSetLcdString: 'lcd 세로%1줄,  가로%2줄 에  %3 표시하기 %4',
                LineCodingSetLcdClear: 'lcd 지우기 %1',
                LineCodingFFmotor: 'ffmotor(%1, %2); %3',
                LineCodingBBmotor: 'bbmotor(%1, %2); %3',
                LineCodingMotorStop: 'motorstop(%1, %2); %3',
            },
            Blocks: {
                OnBlock: '켜짐(HIGH, 5V)',
                OffBlock: '꺼짐(LOW, 0V)',
                AllOnBlock: '모두 켜짐',
                AllOffBlock: '모두 꺼짐',
                BacklightOn: '켜기',
                BacklightOff: '끄기',
                lineForward: '직진',
                Left: '좌회전',
                Right: '우회전',
                LineBack: '후진',
                ForwardSpeed: '직진속도',
                TurnSpeed: '회전속도',
                ForwardOverTime: '교차로 직진시간',
                Tracer: '라인트레이서',
                RemotBit: '조종기(비트수신)',
                RemotPs2: '조종기(PS2)',
            },
        },
        en: {
            template: {
                LineCodingStart: 'Start saving to the %1 %2',
                LineCodingStop: 'End saving to lint racer %1',
                LineCodingLineEasy: 'Go %1 %2',
                LineCodingEasySet: 'To set the %1 %2 %3',
                LineCodingEasyTimeSet: 'Set %1mS to go straight at the intersection %2',
                LineCodingEasyMotor: 'Moving %2mS in the direction of motor %1 %3',
                LineCodingRestart: 'restart(%1); %2 %2',
                LineCodingDelay: 'delay(%1); %2',
                LineCodingLine: 'line(%1, %2, %3); %4',
                LineCodingTurn: '%1(%2, %3); %4',
                LineCodingMotor: 'motor(%1, %2, %3); %4',
                LineCodingBmotor: '%1(%2, %3, %4); %5',
                LineCodingWheel: 'wheel(%1, %2); %3',
                LineCodingServo: 'sservo(%1, %2, %3); %4',
                LineCodingDigitalOnOff: 'Setting up digital %1 port %2 %3',
                LineCodingMelody: 'Play speaker %1 octave %2 sound %3 seconds %4',
                LineCodingMotorStop: 'Stop DC Motor %1',
                LineCodingBlackForwardF: 'blackforwardf(%1,%2,%3,%4);%5',
                LineCodingGetDgitalValue: 'Read digital %1 port',
                LineCodingGetAnalogValue: 'Analog %1 port read',
                LineCodingGetAnalogMapping: '%1 value %2 to %3 ; to %4 to %5 conversion value ',
                LineCodingRemotRx: ' Code that runs when controller button %1, %2 is pressed %3',
                LineCodingLineDelay: 'linedelay(%1, %2, %3); %4',
                LineCodingABSH: 'lineabsh(%1, %2, %3, %4, %5, %6); %7',
                LineCodingBuzzerOnOff: 'buzzer(%1, %2, %3); %4',
                LineCodingLED: 'led(%1, %2, %3, %4); %5',
                LineCodingSetLcdString: 'lcd Display %3 on line %1 and line %2 %4',
                LineCodingSetLcdClear: 'Clear lcd %1',
                LineCodingFFmotor: 'ffmotor(%1, %2); %3',
                LineCodingBBmotor: 'bbmotor(%1, %2); %3',
                LineCodingMotorStop: 'motorstop(%1, %2); %3',
            },
            Blocks: {
                OnBlock: 'On(HIGH, 5V)',
                OffBlock: 'Off(LOW, 0V)',
                AllOnBlock: 'ALL ON',
                AllOffBlock: 'ALL OFF',
                BacklightOn: 'ON',
                BacklightOff: 'OFF',
                lineForward: 'FORWARD',
                Left: 'LEFT',
                Right: 'RIGHT',
                LineBack: 'BACK',
                ForwardSpeed: 'driving speed',
                TurnSpeed: 'rotational speed',
                ForwardOverTime: 'Intersection Driving Time',
                Tracer: 'Line Tracer',
                RemotBit: 'Remot(bit)',
                RemotPs2: 'Remot(PS2)',
            },
        },
    };
};

Entry.LineCoding.getBlocks = function() {
    return {
        LineCodingDigitalPortOnOffList: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.OnBlock, '1'],
                        [Lang.Blocks.OffBlock, '0'],
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
                PORT: 0,
            },
            func(sprite, script) {
                return script.getField('PORT');
            },
        },
        LineCodingBacklightOnoffList: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.BacklightOn, '0'],
                        [Lang.Blocks.BacklightOff, '1'],
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
                PORT: 0,
            },
            func(sprite, script) {
                return script.getField('PORT');
            },
        },
        LineCodingEasylineList: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.lineForward, '3'],
                        [Lang.Blocks.Left, '4'],
                        [Lang.Blocks.Right, '5'],
                    ],
                    value: '3',
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
                PORT: 0,
            },
            func(sprite, script) {
                return script.getField('PORT');
            },
        },
        LineCodingEasyMotorList: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.lineForward, '3'],
                        [Lang.Blocks.Left, '4'],
                        [Lang.Blocks.Right, '5'],
                        [Lang.Blocks.LineBack, '6'],
                    ],
                    value: '3',
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
                PORT: 0,
            },
            func(sprite, script) {
                return script.getField('PORT');
            },
        },
        LineCodingStartList: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.Tracer, '1'],
                        [Lang.Blocks.RemotBit, '10'],
                        [Lang.Blocks.RemotPs2, '11'],
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
                PORT: 0,
            },
            func(sprite, script) {
                return script.getField('PORT');
            },
        },
        LineCodingEasySetList: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.ForwardSpeed, '55'],
                        [Lang.Blocks.TurnSpeed, '56'],
                    ],
                    value: '55',
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
                PORT: 0,
            },
            func(sprite, script) {
                return script.getField('PORT');
            },
        },
        LineCodingCrossroadList: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['T1', '21'],
                        ['L1', '1'],
                        ['R1', '4'],
                        ['LR1', '7'],
                        ['SL1', '11'],
                        ['SR1', '14'],
                    ],
                    value: '21',
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
                PORT: 0,
            },
            func(sprite, script) {
                return script.getField('PORT');
            },
        },
        LineCodingRemotKeyList: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['NONE', '0'],
                        ['L_UP', '1'],
                        ['L_LEFT', '2'],
                        ['L_RIGHT', '3'],
                        ['L_DN', '4'],
                        ['L1', '5'],
                        ['L2', '6'],
                        ['R_UP', '7'],
                        ['R_LEFT', '8'],
                        ['R_RIGHT', '9'],
                        ['R_DN', '10'],
                        ['R1', '11'],
                        ['R2', '12'],
                        ['START', '13'],
                        ['SELECT', '14'],
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
                PORT: 0,
            },
            func(sprite, script) {
                return script.getField('PORT');
            },
        },
        LineCodingOctaveList: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['3', '0'],
                        ['4', '1'],
                        ['5', '2'],
                        ['6', '3'],
                        ['7', '4'],
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
                OCTAVE: 0,
            },
            func(sprite, script) {
                return script.getField('OCTAVE');
            },
        },
        LineCodingToneList: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.silent, '0'],
                        [Lang.Blocks.do_name, 'C'],
                        [Lang.Blocks.do_sharp_name, 'CS'],
                        [Lang.Blocks.re_name, 'D'],
                        [Lang.Blocks.re_sharp_name, 'DS'],
                        [Lang.Blocks.mi_name, 'E'],
                        [Lang.Blocks.fa_name, 'F'],
                        [Lang.Blocks.fa_sharp_name, 'FS'],
                        [Lang.Blocks.sol_name, 'G'],
                        [Lang.Blocks.sol_sharp_name, 'GS'],
                        [Lang.Blocks.la_name, 'A'],
                        [Lang.Blocks.la_sharp_name, 'AS'],
                        [Lang.Blocks.si_name, 'B'],
                    ],
                    value: 'C',
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
                NOTE: 0,
            },
            func(sprite, script) {
                return script.getField('NOTE');
            },
        },
        LineCodingTurnList: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['lt1', '1'],
                        ['rt8', '8'],
                        ['lt2', '2'],
                        ['rt7', '7'],
                        ['lt3', '3'],
                        ['rt6', '6'],
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
                PORT: 0,
            },
            func(sprite, script) {
                return script.getField('PORT');
            },
        },

        LineCodingMotorList: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['B Motor', '1'],
                        ['BW Motor', '2'],
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
                PORT: 0,
            },
            func(sprite, script) {
                return script.getField('PORT');
            },
        },
        LineCodingLineSensortList: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['S1', '1'],
                        ['S2', '2'],
                        ['S3', '4'],
                        ['S4', '8'],
                        ['S5', '16'],
                        ['S6', '32'],
                        ['S7', '64'],
                        ['S8', '128'],
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
                PORT: 0,
            },
            func(sprite, script) {
                return script.getStringField('PORT');
            },
        },
        LineCodingSensorNumtList: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['S1', '0'],
                        ['S2', '1'],
                        ['S3', '2'],
                        ['S4', '3'],
                        ['S5', '4'],
                        ['S6', '5'],
                        ['S7', '6'],
                        ['S8', '7'],
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
                PORT: 0,
            },
            func(sprite, script) {
                return script.getStringField('PORT');
            },
        },

        LineCodingDigitalPortList: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['IN1', '1'],
                        ['IN2', '2'],
                        ['IN3', '3'],
                        ['IN4', '4'],
                        ['IN5', '5'],
                        ['IN6', '6'],
                        ['IN7', '7'],
                        ['IN8', '8'],
                        ['FW1', '9'],
                        ['FW2', '10'],
                        ['FW3', '11'],
                        ['FW4', '12'],
                        ['FW5', '13'],
                        ['FW6', '14'],
                        ['FW7', '15'],
                        ['FW8', '16'],
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
                PORT: 0,
            },
            func(sprite, script) {
                return script.getStringField('PORT');
            },
        },
        LineCodingServoPortList: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['OUT1', '1'],
                        ['OUT2', '2'],
                        ['OUT3', '3'],
                        ['OUT4', '4'],
                        ['OUT5', '5'],
                        ['OUT6', '6'],
                        ['OUT7', '7'],
                        ['OUT8', '8'],
                    ],
                    value: '1', // 기본 표시값
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
                PORT: 0,
            },
            func(sprite, script) {
                return script.getStringField('PORT');
            },
        },

        LineCodingAllOnOffList: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.AllOffBlock, '2'],
                        [Lang.Blocks.AllOnBlock, '3'],
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
                VALUE: 0,
            },
            func(sprite, script) {
                return script.getField('VALUE');
            },
        },
        LineCodingAnalogPortList: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['IN1', '1'],
                        ['IN2', '2'],
                        ['IN3', '3'],
                        ['IN4', '4'],
                        ['IN5', '5'],
                        ['IN6', '6'],
                        ['IN7', '7'],
                        ['IN8', '8'],
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
                PORT: 0,
            },
            func(sprite, script) {
                return script.getField('PORT');
            },
        },
        // 1. 저장 시작하기
        LineCodingStart: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
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
                        type: 'LineCodingStartList',
                    },
                    null,
                ],
                type: 'LineCodingStart',
            },
            paramsKeyMap: {
                STAY: 0,
            },
            class: 'LineCoding_EASY',
            isNotFor: ['LineCoding'],
            func: (sprite, script) => {
                ++LineNum;
                LineSaveFlag = 1;
                // 1 시작
                // delay(100);
                const value = script.getNumberValue('STAY');
                if (!Entry.hw.sendQueue.SET) {
                    Entry.hw.sendQueue.SET = {};
                }
                Entry.hw.sendQueue.SET[parseInt(LineNum, 10)] = {
                    type: Entry.LineCoding.sensorTypes.LINE_EASY,
                    data: value,
                    time: new Date().getTime(),
                };
                return script.callReturn();
            },
            syntax: { js: [], py: [] },
        },
        // 2. 저장 종료
        LineCodingStop: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
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
                type: 'LineCodingStop',
            },
            paramsKeyMap: {
                //PORT: 0,
            },
            class: 'LineCoding_EASY',
            isNotFor: ['LineCoding'],
            func: (sprite, script) => {
                ++LineNum;
                LineSaveFlag = 0;
                // 2 종료

                if (!Entry.hw.sendQueue.SET) {
                    Entry.hw.sendQueue.SET = {};
                }
                Entry.hw.sendQueue.SET[400] = {
                    type: Entry.LineCoding.sensorTypes.LINE_EASY,
                    data: 2,
                    time: new Date().getTime(),
                };
                return script.callReturn();
            },
            syntax: { js: [], py: [] },
        },
        // 3. 쉬운주행
        LineCodingLineEasy: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
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
                        type: 'LineCodingEasylineList',
                    },
                    null,
                ],
                type: 'LineCodingLineEasy',
            },
            paramsKeyMap: {
                VALUE: 0,
            },
            class: 'LineCoding_EASY',
            isNotFor: ['LineCoding'],
            func: (sprite, script) => {
                const value = script.getNumberValue('VALUE');
                if (LineOneFlag == 1) {
                    if (LineSaveFlag == 1) {
                        ++LineNum;
                    }
                    LineInit = Entry.hw.portData.DIGITAL[0];
                    if (!Entry.hw.sendQueue.SET) {
                        Entry.hw.sendQueue.SET = {};
                    }
                    Entry.hw.sendQueue.SET[parseInt(LineNum, 10)] = {
                        type: Entry.LineCoding.sensorTypes.LINE_EASY,
                        data: value,
                        time: new Date().getTime(),
                    };
                    LineOneFlag = 0;
                }
                if (Entry.hw.portData.DIGITAL[0] == LineInit && LineSaveFlag == 0) {
                    return script;
                } else {
                    LineOneFlag = 1;
                    return script.callReturn();
                }
            },
            syntax: { js: [], py: [] },
        },
        // 4. 쉬운주행 설정
        LineCodingEasySet: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
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
                        type: 'LineCodingEasySetList',
                    },
                    {
                        type: 'number',
                        params: ['20'],
                    },
                    null,
                ],
                type: 'LineCodingEasySet',
            },
            paramsKeyMap: {
                PORT: 0,
                NUM: 1,
            },
            class: 'LineCoding_EASY',
            isNotFor: ['LineCoding'],
            func: (sprite, script) => {
                const port = script.getNumberValue('PORT', script);
                const num = script.getNumberValue('NUM', script);
                if (!script.isStart) {
                    if (LineSaveFlag == 1) {
                        ++LineNum;
                    }
                    if (!Entry.hw.sendQueue.SET) {
                        Entry.hw.sendQueue.SET = {};
                    }
                    script.isStart = true;
                    script.timeFlag = 1;
                    if (port == 55) {
                        Entry.hw.sendQueue.SET[parseInt(LineNum, 10)] = {
                            type: Entry.LineCoding.sensorTypes.LINE_FW_SPEED,
                            data: [num],
                            time: new Date().getTime(),
                        };
                    } else {
                        Entry.hw.sendQueue.SET[parseInt(LineNum, 10)] = {
                            type: Entry.LineCoding.sensorTypes.LINE_TURN_SPEED,
                            data: [num],
                            time: new Date().getTime(),
                        };
                    }
                    setTimeout(() => {
                        script.timeFlag = 0;
                    }, 0.1);
                    return script;
                } else if (script.timeFlag === 1) {
                    return script;
                } else {
                    delete script.timeFlag;
                    delete script.isStart;
                    Entry.engine.isContinue = false;
                    return script.callReturn();
                }
            },
            syntax: { js: [], py: [] },
        },
        // 직진시간설정
        LineCodingEasyTimeSet: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
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
                        type: 'number',
                        params: ['0'],
                    },
                    null,
                ],
                type: 'LineCodingEasyTimeSet',
            },
            paramsKeyMap: {
                TIME: 0,
            },
            class: 'LineCoding_EASY',
            isNotFor: ['LineCoding'],
            func: (sprite, script) => {
                let time2 = script.getNumberValue('TIME');
                if (!script.isStart) {
                    if (LineSaveFlag == 1) {
                        ++LineNum;
                    }
                    if (!Entry.hw.sendQueue.SET) {
                        Entry.hw.sendQueue.SET = {};
                    }
                    time2 = Math.min(2500, time2);
                    time2 = Math.max(0, time2);
                    script.isStart = true;
                    script.timeFlag = 1;
                    Entry.hw.sendQueue.SET[parseInt(LineNum, 10)] = {
                        type: Entry.LineCoding.sensorTypes.LINE_CROSS_TIME,
                        data: {
                            time: time2,
                        },
                        time: new Date().getTime(),
                    };
                    setTimeout(() => {
                        script.timeFlag = 0;
                    }, 0.1);
                    return script;
                } else if (script.timeFlag === 1) {
                    return script;
                } else {
                    delete script.timeFlag;
                    delete script.isStart;
                    Entry.engine.isContinue = false;
                    return script.callReturn();
                }
            },
            syntax: { js: [], py: [] },
        },

        // 5.  쉬운 모터이동
        LineCodingEasyMotor: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
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
                        type: 'LineCodingEasyMotorList',
                    },
                    {
                        type: 'number',
                        params: ['0'],
                    },
                    null,
                ],
                type: 'LineCodingEasyMotor',
            },
            paramsKeyMap: {
                DIRECTION: 0,
                TIME: 1,
            },
            class: 'LineCoding_EASY',
            isNotFor: ['LineCoding'],
            func: (sprite, script) => {
                let direction2 = script.getNumberValue('DIRECTION', script);
                let time2 = script.getNumberValue('TIME', script);
                if (LineSaveFlag == 1) {
                    ++LineNum;
                }
                if (LineOneFlag == 1) {
                    time2 = Math.min(10000, time2);
                    time2 = Math.max(0, time2);
                    direction2 = Math.min(6, direction2);
                    direction2 = Math.max(3, direction2);
                    LineInit = Entry.hw.portData.DIGITAL[0];
                    if (!Entry.hw.sendQueue.SET) {
                        Entry.hw.sendQueue.SET = {};
                    }
                    Entry.hw.sendQueue.SET[parseInt(LineNum, 10)] = {
                        type: Entry.LineCoding.sensorTypes.LINE_EASY_MOTOR,
                        data: {
                            direction: direction2,
                            time: time2,
                        },
                        time: new Date().getTime(),
                    };
                    LineOneFlag = 0;
                }
                if (Entry.hw.portData.DIGITAL[0] == LineInit && LineSaveFlag == 0) {
                    return script;
                } else {
                    LineOneFlag = 1;
                    return script.callReturn();
                }
            },
            syntax: { js: [], py: [] },
        },
        // 리스타트
        LineCodingRestart: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
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
                        type: 'number',
                        params: ['1'],
                    },
                    null,
                ],
                type: 'LineCodingRestart',
            },
            paramsKeyMap: {
                NUM: 0,
            },
            class: 'LineCoding_LINE1',
            isNotFor: ['LineCoding'],
            func: (sprite, script) => {
                const num = script.getNumberValue('NUM', script);
                if (LineSaveFlag == 1) {
                    ++LineNum;
                }
                if (LineOneFlag == 1) {
                    LineInit = Entry.hw.portData.DIGITAL[0];
                    if (!Entry.hw.sendQueue.SET) {
                        Entry.hw.sendQueue.SET = {};
                    }
                    Entry.hw.sendQueue.SET[parseInt(LineNum, 10)] = {
                        type: Entry.LineCoding.sensorTypes.LINE_RESTART,
                        data: [num],
                        time: new Date().getTime(),
                    };
                    LineOneFlag = 0;
                }
                if (Entry.hw.portData.DIGITAL[0] == LineInit && LineSaveFlag == 0) {
                    return script;
                } else {
                    LineOneFlag = 1;
                    return script.callReturn();
                }
            },
            syntax: { js: [], py: [] },
        },
        // 딜레이
        LineCodingDelay: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
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
                        type: 'number',
                        params: ['0'],
                    },
                    null,
                ],
                type: 'LineCodingDelay',
            },
            paramsKeyMap: {
                TIME: 0,
            },
            class: 'LineCoding_LINE1',
            isNotFor: ['LineCoding'],
            func: (sprite, script) => {
                let time2 = script.getNumberValue('TIME', script);
                if (LineSaveFlag == 1) {
                    ++LineNum;
                }
                if (LineOneFlag == 1) {
                    time2 = Math.min(10000, time2);
                    time2 = Math.max(0, time2);
                    LineInit = Entry.hw.portData.DIGITAL[0];
                    if (!Entry.hw.sendQueue.SET) {
                        Entry.hw.sendQueue.SET = {};
                    }
                    Entry.hw.sendQueue.SET[parseInt(LineNum, 10)] = {
                        type: Entry.LineCoding.sensorTypes.LINE_DELAY,
                        data: {
                            time: time2,
                        },
                        time: new Date().getTime(),
                    };
                    LineOneFlag = 0;
                }
                if (Entry.hw.portData.DIGITAL[0] == LineInit && LineSaveFlag == 0) {
                    return script;
                } else {
                    LineOneFlag = 1;
                    return script.callReturn();
                }
            },
            syntax: { js: [], py: [] },
        },
        // 5.  line
        LineCodingLine: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
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
                        type: 'LineCodingCrossroadList',
                    },
                    {
                        type: 'number',
                        params: ['20'],
                    },
                    {
                        type: 'number',
                        params: ['0'],
                    },
                    null,
                ],
                type: 'LineCodingLine',
            },
            paramsKeyMap: {
                CROSS: 0,
                SPEED: 1,
                TIME: 2,
            },
            class: 'LineCoding_LINE1',
            isNotFor: ['LineCoding'],
            func: (sprite, script) => {
                const cross2 = script.getNumberValue('CROSS', script);
                let speed2 = script.getNumberValue('SPEED', script);
                let time2 = script.getNumberValue('TIME', script);
                if (LineSaveFlag == 1) {
                    ++LineNum;
                }
                if (LineOneFlag == 1) {
                    LineInit = Entry.hw.portData.DIGITAL[0];
                    time2 = Math.min(10000, time2);
                    time2 = Math.max(0, time2);
                    speed2 = Math.min(20, speed2);
                    speed2 = Math.max(0, speed2);

                    if (!Entry.hw.sendQueue.SET) {
                        Entry.hw.sendQueue.SET = {};
                    }
                    Entry.hw.sendQueue.SET[parseInt(LineNum, 10)] = {
                        type: Entry.LineCoding.sensorTypes.LINE_LINE,
                        data: {
                            cross: cross2,
                            speed: speed2,
                            time: time2,
                        },
                        time: new Date().getTime(),
                    };
                    LineOneFlag = 0;
                }
                if (Entry.hw.portData.DIGITAL[0] == LineInit && LineSaveFlag == 0) {
                    return script;
                } else {
                    LineOneFlag = 1;
                    return script.callReturn();
                }
                //return script.callReturn();
            },
            syntax: { js: [], py: [] },
        },
        //  turn lt rt
        LineCodingTurn: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
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
                        type: 'LineCodingTurnList',
                    },
                    {
                        type: 'number',
                        params: ['20'],
                    },
                    {
                        type: 'number',
                        params: ['0'],
                    },
                    null,
                ],
                type: 'LineCodingTurn',
            },
            paramsKeyMap: {
                CROSS: 0,
                SPEED: 1,
                TIME: 2,
            },
            class: 'LineCoding_LINE1',
            isNotFor: ['LineCoding'],
            func: (sprite, script) => {
                let cross2 = script.getNumberValue('CROSS', script);
                let speed2 = script.getNumberValue('SPEED', script);
                let time2 = script.getNumberValue('TIME', script);
                if (LineSaveFlag == 1) {
                    ++LineNum;
                }
                if (LineOneFlag == 1) {
                    LineInit = Entry.hw.portData.DIGITAL[0];
                    cross2 = Math.min(8, cross2);
                    cross2 = Math.max(1, cross2);
                    time2 = Math.min(1000, time2);
                    time2 = Math.max(0, time2);
                    speed2 = Math.min(20, speed2);
                    speed2 = Math.max(0, speed2);

                    if (!Entry.hw.sendQueue.SET) {
                        Entry.hw.sendQueue.SET = {};
                    }
                    Entry.hw.sendQueue.SET[parseInt(LineNum, 10)] = {
                        type: Entry.LineCoding.sensorTypes.LINE_TURN,
                        data: {
                            cross: cross2,
                            speed: speed2,
                            time: time2,
                        },
                        time: new Date().getTime(),
                    };
                    LineOneFlag = 0;
                }
                if (Entry.hw.portData.DIGITAL[0] == LineInit && LineSaveFlag == 0) {
                    return script;
                } else {
                    LineOneFlag = 1;
                    return script.callReturn();
                }
            },
            syntax: { js: [], py: [] },
        },
        //  motor
        LineCodingMotor: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
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
                        type: 'number',
                        params: ['20'],
                    },
                    {
                        type: 'number',
                        params: ['20'],
                    },
                    {
                        type: 'number',
                        params: ['0'],
                    },
                    null,
                ],
                type: 'LineCodingMotor',
            },
            paramsKeyMap: {
                LSPEED: 0,
                RSPEED: 1,
                TIME: 2,
            },
            class: 'LineCoding_LINE1',
            isNotFor: ['LineCoding'],
            func: (sprite, script) => {
                let cross2 = script.getNumberValue('LSPEED', script);
                let speed2 = script.getNumberValue('RSPEED', script);
                let time2 = script.getNumberValue('TIME', script);
                if (LineSaveFlag == 1) {
                    ++LineNum;
                }
                if (LineOneFlag == 1) {
                    LineInit = Entry.hw.portData.DIGITAL[0];
                    time2 = Math.min(1000, time2);
                    time2 = Math.max(0, time2);
                    cross2 = Math.min(20, cross2);
                    cross2 = Math.max(-20, cross2);
                    speed2 = Math.min(20, speed2);
                    speed2 = Math.max(-20, speed2);

                    if (!Entry.hw.sendQueue.SET) {
                        Entry.hw.sendQueue.SET = {};
                    }
                    Entry.hw.sendQueue.SET[parseInt(LineNum, 10)] = {
                        type: Entry.LineCoding.sensorTypes.LINE_MOTOR,
                        data: {
                            cross: cross2,
                            speed: speed2,
                            time: time2,
                        },
                        time: new Date().getTime(),
                    };
                    LineOneFlag = 0;
                }
                if (Entry.hw.portData.DIGITAL[0] == LineInit && LineSaveFlag == 0) {
                    return script;
                } else {
                    LineOneFlag = 1;
                    return script.callReturn();
                }
            },
            syntax: { js: [], py: [] },
        },
        //  bmotor bwmotor
        LineCodingBmotor: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
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
                        type: 'LineCodingMotorList',
                    },
                    {
                        type: 'number',
                        params: ['20'],
                    },
                    {
                        type: 'number',
                        params: ['20'],
                    },
                    {
                        type: 'LineCodingLineSensortList',
                    },
                    null,
                ],
                type: 'LineCodingBmotor',
            },
            paramsKeyMap: {
                MODE: 0,
                LSPEED: 1,
                RSPEED: 2,
                SENSOR: 3,
            },
            class: 'LineCoding_LINE1',
            isNotFor: ['LineCoding'],
            func: (sprite, script) => {
                let mode2 = script.getNumberValue('MODE', script);
                let lspeed2 = script.getNumberValue('LSPEED', script);
                let rspeed2 = script.getNumberValue('RSPEED', script);
                let sensor2 = script.getNumberValue('SENSOR', script);
                if (LineSaveFlag == 1) {
                    ++LineNum;
                }
                if (LineOneFlag == 1) {
                    LineInit = Entry.hw.portData.DIGITAL[0];
                    mode2 = Math.min(2, mode2);
                    mode2 = Math.max(1, mode2);
                    lspeed2 = Math.min(20, lspeed2);
                    lspeed2 = Math.max(-0, lspeed2);
                    rspeed2 = Math.min(20, rspeed2);
                    rspeed2 = Math.max(-0, rspeed2);
                    sensor2 = Math.min(8, sensor2);
                    sensor2 = Math.max(1, sensor2);

                    if (!Entry.hw.sendQueue.SET) {
                        Entry.hw.sendQueue.SET = {};
                    }
                    if (mode2 == 1) {
                        Entry.hw.sendQueue.SET[parseInt(LineNum, 10)] = {
                            type: Entry.LineCoding.sensorTypes.LINE_BMOTOR,
                            data: {
                                mode: mode2,
                                lspeed: lspeed2,
                                rspeed: rspeed2,
                                sensor: sensor2,
                            },
                            time: new Date().getTime(),
                        };
                    } else {
                        Entry.hw.sendQueue.SET[20] = {
                            type: Entry.LineCoding.sensorTypes.LINE_BWMOTOR,
                            data: {
                                mode: mode2,
                                lspeed: lspeed2,
                                rspeed: rspeed2,
                                sensor: sensor2,
                            },
                            time: new Date().getTime(),
                        };
                    }
                    LineOneFlag = 0;
                }
                if (Entry.hw.portData.DIGITAL[0] == LineInit && LineSaveFlag == 0) {
                    return script;
                } else {
                    LineOneFlag = 1;
                    return script.callReturn();
                }
            },
            syntax: { js: [], py: [] },
        },
        //DC 모터 속도 정하기 wheel
        LineCodingWheel: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
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
                        type: 'number',
                        params: ['0'],
                    },
                    {
                        type: 'number',
                        params: ['0'],
                    },
                    null,
                ],
                type: 'LineCodingWheel',
            },
            paramsKeyMap: {
                LSPEED: 0,
                RSPEED: 1,
            },
            class: 'LineCoding_LINE1',
            isNotFor: ['LineCoding'],
            func(sprite, script) {
                let rspeed2 = script.getNumberValue('RSPEED', script);
                let lspeed2 = script.getNumberValue('LSPEED', script);
                if (LineSaveFlag == 1) {
                    ++LineNum;
                }
                lspeed2 = Math.min(20, lspeed2);
                lspeed2 = Math.max(-20, lspeed2);
                rspeed2 = Math.min(20, rspeed2);
                rspeed2 = Math.max(-20, rspeed2);

                if (!(LmotorSpeed === lspeed2) || !(RmotorSpeed === rspeed2) || LineSaveFlag == 1) {
                    if (!Entry.hw.sendQueue.SET) {
                        Entry.hw.sendQueue.SET = {};
                    }
                    Entry.hw.sendQueue.SET[parseInt(LineNum, 10)] = {
                        type: Entry.LineCoding.sensorTypes.LINE_WHEEL,
                        data: {
                            lspeed: lspeed2,
                            rspeed: rspeed2,
                        },
                        time: new Date().getTime(),
                    };
                    LmotorSpeed = lspeed2;
                    RmotorSpeed = rspeed2;
                    return script.callReturn();
                } else {
                    return script.callReturn();
                }
            },
            syntax: { js: [], py: [] },
        },
        // 5.  서보 모터 각도 설정하기
        LineCodingServo: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
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
                        type: 'LineCodingServoPortList',
                    },
                    {
                        type: 'number',
                        params: ['1'],
                    },
                    {
                        type: 'number',
                        params: ['100'],
                    },
                    null,
                ],
                type: 'LineCodingServo',
            },
            paramsKeyMap: {
                PORT: 0,
                ANGLE: 1,
                SPEED: 2,
            },
            class: 'LineCoding_LINE2',
            isNotFor: ['LineCoding'],
            func: (sprite, script) => {
                const sport2 = script.getNumberValue('PORT', script);
                let angle2 = script.getNumberValue('ANGLE', script);
                let speed2 = script.getNumberValue('SPEED', script);
                if (LineSaveFlag == 1) {
                    ++LineNum;
                }
                //				port += 2;
                //				var mode = 1;

                angle2 = Math.min(180, angle2);
                angle2 = Math.max(0, angle2);
                speed2 = Math.min(100, speed2);
                speed2 = Math.max(0, speed2);
                //speed *= speed * 255;
                //angle += 1;
                if (ServeAngle[sport2 - 1] != angle2) {
                    ServeAngle[sport2 - 1] = angle2;
                    if (!Entry.hw.sendQueue.SET) {
                        Entry.hw.sendQueue.SET = {};
                    }
                    Entry.hw.sendQueue.SET[parseInt(sport2 + 10, 10)] = {
                        type: Entry.LineCoding.sensorTypes.LINE_SERVO,
                        data: {
                            sport: sport2,
                            angle: angle2,
                            speed: speed2,
                        },
                        time: new Date().getTime(),
                    };
                    return script.callReturn();
                } else {
                    return script.callReturn();
                }
            },
            syntax: { js: [], py: [] },
        },
        // 디지털  출력
        LineCodingDigitalOnOff: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
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
                        type: 'LineCodingServoPortList',
                    },
                    {
                        type: 'LineCodingDigitalPortOnOffList',
                    },
                    null,
                ],
                type: 'LineCodingDigitalOnOff',
            },
            paramsKeyMap: {
                PORT: 0,
                VALUE: 1,
            },
            class: 'LineCoding_LINE2', // 블록을 묶는 그룹 이름. 이 값이 다르면 사이에 가로줄이 생깁니다
            isNotFor: ['LineCoding'],
            func: (sprite, script) => {
                const dport2 = script.getNumberValue('PORT');
                const value2 = script.getNumberValue('VALUE');
                if (OutPort[dport2 - 1] != value2) {
                    OutPort[dport2 - 1] = value2;
                    if (!Entry.hw.sendQueue.SET) {
                        Entry.hw.sendQueue.SET = {};
                    }
                    Entry.hw.sendQueue.SET[18] = {
                        type: Entry.LineCoding.sensorTypes.LINE_PORT,
                        /// 출력 디바이스
                        data: {
                            dport: dport2,
                            value: value2,
                        },
                        time: new Date().getTime(),
                    };
                    return script.callReturn();
                } else {
                    return script.callReturn();
                }
            },
            syntax: { js: [], py: [] },
        },
        //  스피커 멜로디
        LineCodingMelody: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
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
                        type: 'LineCodingOctaveList',
                    },
                    {
                        type: 'LineCodingToneList',
                    },
                    {
                        type: 'text',
                        params: ['0.25'],
                    },
                    null,
                ],
                type: 'LineCodingMelody',
            },
            paramsKeyMap: {
                OCTAVE: 0,
                NOTE: 1,
                DURATION: 2,
            },
            class: 'LineCoding_LINE2',
            isNotFor: ['LineCoding'],
            func: (sprite, script) => {
                let duration2 = script.getNumberValue('DURATION');
                let octave = script.getNumberValue('OCTAVE');
                let value2 = 0;
                if (LineSaveFlag == 1) {
                    ++LineNum;
                }
                if (!script.isStart) {
                    let note = script.getValue('NOTE');
                    if (!Entry.Utils.isNumber(note)) {
                        note = Entry.LineCoding.toneTable[note];
                    }
                    if (note < 0) {
                        note = 0;
                    } else if (note > 12) {
                        note = 12;
                    }
                    if (duration2 < 0) {
                        duration2 = 0;
                    }
                    if (!Entry.hw.sendQueue.SET) {
                        Entry.hw.sendQueue.SET = {};
                    }
                    if (duration2 === 0) {
                        // 음 길이가 0 이면
                        Entry.hw.sendQueue.SET[parseInt(LineNum, 10)] = {
                            type: Entry.LineCoding.sensorTypes.TONE,
                            data: 0,
                            time: new Date().getTime(),
                        };
                        return script.callReturn();
                    }
                    if (octave < 0) {
                        octave = 0;
                    } else if (octave > 4) {
                        octave = 4;
                    }
                    if (note != 0) {
                        value2 = Entry.LineCoding.toneMap[note][octave];
                    }
                    if (duration2 > 3000) {
                        duration2 = 3000;
                    }
                    duration2 = duration2 * 1000;
                    script.isStart = true;
                    // 출력 시작 플래그 셋
                    script.timeFlag = 1;
                    // 시간플래그 셋

                    Entry.hw.sendQueue.SET[parseInt(LineNum, 10)] = {
                        type: Entry.LineCoding.sensorTypes.TONE,
                        data: {
                            value: value2,
                            duration: duration2,
                        },
                        time: new Date().getTime(),
                    };

                    setTimeout(() => {
                        script.timeFlag = 0;
                    }, duration2 + 32);
                    return script;
                } else if (script.timeFlag === 1) {
                    return script;
                } else {
                    delete script.timeFlag;
                    delete script.isStart;
                    Entry.hw.sendQueue.SET[parseInt(LineNum, 10)] = {
                        type: Entry.LineCoding.sensorTypes.TONE,
                        data: 0,
                        time: new Date().getTime(),
                    };
                    Entry.engine.isContinue = false;
                    return script.callReturn();
                }
            },
            syntax: { js: [], py: [] },
        },

        // 11. 디지털입력
        LineCodingGetDgitalValue: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            //basic_boolean_field
            statements: [],
            template: Lang.template.LineCodingGetDgitalValue,
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
                        type: 'LineCodingDigitalPortList',
                    },
                ],
                type: 'LineCodingGetDgitalValue',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'LineCoding_LINE3',
            isNotFor: ['LineCoding'],
            func: (sprite, script) => {
                const port2 = script.getNumberValue('PORT');
                //const DIGITAL = Entry.hw.portData.DIGITAL;

                if (!Entry.hw.sendQueue.GET) {
                    Entry.hw.sendQueue.GET = {};
                }
                Entry.hw.sendQueue.GET[Entry.LineCoding.sensorTypes.DIGITAL] = {
                    port: port2,
                    time: new Date().getTime(),
                };
                return Entry.hw.portData.DIGITAL[parseInt(port2, 10)];
            },
            syntax: { js: [], py: [] },
        },

        // 12. 아날로그 읽기
        LineCodingGetAnalogValue: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            template: Lang.template.LineCodingGetAnalogValue,
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
                        type: 'LineCodingAnalogPortList',
                    },
                ],
                type: 'LineCodingGetAnalogValue',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'LineCoding_LINE3',
            isNotFor: ['LineCoding'],
            func: (sprite, script) => {
                const BtnIndex = script.getNumberValue('PORT');
                const ANALOG = Entry.hw.portData.ANALOG;

                return ANALOG[parseInt(BtnIndex, 10)];
            },
            syntax: { js: [], py: [] },
        },
        // LCD글자출력
        LineCodingSetLcdString: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
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
                        type: 'number',
                        params: ['0'],
                    },
                    {
                        type: 'number',
                        params: ['0'],
                    },
                    {
                        type: 'text', 
                        params: ['Hello, Linecoding'],
                    },
                    null,
                ],
                type: 'LineCodingSetLcdString',
            },
            paramsKeyMap: {
                COLUMN: 0,
                LINE: 1,
                STRING: 2,
            },
            class: 'LineCoding_LINE3',
            isNotFor: ['LineCoding'],
            func: (sprite, script) => {
                // var sq = Entry.hw.sendQueue;
                const line2 = script.getValue('LINE', script);
                const column2 = script.getValue('COLUMN', script);
                const string = script.getValue('STRING', script);
                let text = [];
                let buf;

                if (!script.isStart) {
                    if (typeof string === 'string') {
                        for (var i = 0; i < string.length; i++) {
                            buf = Entry.memaker.toByte(string[parseInt(i, 10)]);
                            text[parseInt(i, 10)] = buf;
                        }
                    } else {
                        text[0] = string;
                    }

                    if (!Entry.hw.sendQueue.SET) {
                        Entry.hw.sendQueue.SET = {};
                    }

                    script.isStart = true;
                    script.timeFlag = 1;
                    //var fps = Entry.FPS || 60;
                   // var timeValue = 60 / fps * 50;

                    Entry.hw.sendQueue.SET[3] = {
                        type: Entry.LineCoding.sensorTypes.LCD_SET,
                        data: {
                            line: line2,
                            column: column2,
                            text0: text[0],
                            text1: text[1],
                            text2: text[2],
                            text3: text[3],
                            text4: text[4],
                            text5: text[5],
                            text6: text[6],
                            text7: text[7],
                            text8: text[8],
                            text9: text[9],
                            text10: text[10],
                            text11: text[11],
                            text12: text[12],
                            text13: text[13],
                            text14: text[14],
                            text15: text[15],
                            text15: text[16],
                            text15: text[17],
                            text15: text[18],
                            text15: text[19],
                        },
                        time: new Date().getTime(),
                    };

                    setTimeout(() => {
                        script.timeFlag = 0;
                    }, 0);
                    return script;
                } else if (script.timeFlag === 1) {
                    return script;
                } else {
                    delete script.timeFlag;
                    delete script.isStart;
                    Entry.engine.isContinue = true;
                    return script.callReturn();
                }
                 
            },
            syntax: { js: [], py: [] },
        },

        // LCD 지우기
        LineCodingSetLcdClear: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,	
            fontColor: '#fff',
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
                type: 'LineCodingSetLcdClear',
            },
            paramsKeyMap: {

            },
            class: 'LineCoding_LINE3',
            isNotFor: ['LineCoding'],
            func: (sprite, script) => {
                //var port = 0;

                if (!Entry.hw.sendQueue.SET) {
                    Entry.hw.sendQueue.SET = {};
                }
                Entry.hw.sendQueue.SET[4] = {
                    type: Entry.LineCoding.sensorTypes.LCD_SET,
                    data: [4, 4, 4,],
                    time: new Date().getTime(),
                };
                return script.callReturn();
            },
            syntax: { js: [], py: [] },
        },
        //  mapping 값
        LineCodingGetAnalogMapping: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            template: Lang.template.LineCodingGetAnalogMapping,
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
                type: 'LineCodingGetAnalogMapping',
            },
            paramsKeyMap: {
                IDATA: 0,
                VALUE2: 1,
                VALUE3: 2,
                VALUE4: 3,
                VALUE5: 4,
            },
            class: 'LineCoding_LINE5',
            isNotFor: ['LineCoding'],
            func: (sprite, script) => {
                let result = script.getNumberValue('IDATA', script);
                let value2 = script.getNumberValue('VALUE2', script);
                let value3 = script.getNumberValue('VALUE3', script);
                let value4 = script.getNumberValue('VALUE4', script);
                let value5 = script.getNumberValue('VALUE5', script);
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
                result -= value2;
                result = result * ((value5 - value4) / (value3 - value2));
                result += value4;
                result = Math.min(value5, result);
                result = Math.max(value4, result);

                return Math.round(result);
            },
            syntax: { js: [], py: [] },
        },
        // 조종기 수신
        LineCodingRemotRx: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
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
                        type: 'LineCodingRemotKeyList',
                    },
                    {
                        type: 'LineCodingRemotKeyList',
                    },
                    null,
                ],
                type: 'LineCodingRemotRx',
            },
            paramsKeyMap: {
                KEY1: 0,
                KEY2: 1,
            },
            class: 'LineCoding_LINE5', // 블록을 묶는 그룹 이름. 이 값이 다르면 사이에 가로줄이 생깁니다
            isNotFor: ['LineCoding'],
            func: (sprite, script) => {
                const dport2 = script.getNumberValue('KEY1');
                const value2 = script.getNumberValue('KEY2');
                if (LineSaveFlag == 1) {
                    ++LineNum;
                }
                if (!Entry.hw.sendQueue.SET) {
                    Entry.hw.sendQueue.SET = {};
                }
                Entry.hw.sendQueue.SET[parseInt(LineNum, 10)] = {
                    type: Entry.LineCoding.sensorTypes.LINE_REMOT,
                    data: {
                        dport: dport2,
                        value: value2,
                    },
                    time: new Date().getTime(),
                };
                return script.callReturn();
            },
            syntax: { js: [], py: [] },
        },
        //.  linedelay
        LineCodingLineDelay: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
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
                        type: 'number',
                        params: ['100'],
                    },
                    {
                        type: 'number',
                        params: ['20'],
                    },
                    {
                        type: 'number',
                        params: ['0'],
                    },
                    null,
                ],
                type: 'LineCodingLineDelay',
            },
            paramsKeyMap: {
                LINETIME: 0,
                SPEED: 1,
                TIME: 2,
            },
            class: 'LineCoding_LINE5',
            isNotFor: ['LineCoding'],
            func: (sprite, script) => {
                let linetime2 = script.getNumberValue('LINETIME', script);
                let speed2 = script.getNumberValue('SPEED', script);
                let time2 = script.getNumberValue('TIME', script);
                if (LineSaveFlag == 1) {
                    ++LineNum;
                }
                if (LineOneFlag == 1) {
                    LineInit = Entry.hw.portData.DIGITAL[0];
                    linetime2 = Math.min(10000, linetime2);
                    linetime2 = Math.max(0, linetime2);
                    time2 = Math.min(2550, time2);
                    time2 = Math.max(0, time2);
                    speed2 = Math.min(20, speed2);
                    speed2 = Math.max(0, speed2);

                    if (!Entry.hw.sendQueue.SET) {
                        Entry.hw.sendQueue.SET = {};
                    }
                    Entry.hw.sendQueue.SET[parseInt(LineNum, 10)] = {
                        type: Entry.LineCoding.sensorTypes.LINE_LINEDELAY,
                        data: {
                            linetime: linetime2,
                            speed: speed2,
                            time: time2,
                        },
                        time: new Date().getTime(),
                    };
                    LineOneFlag = 0;
                }
                if (Entry.hw.portData.DIGITAL[0] == LineInit && LineSaveFlag == 0) {
                    return script;
                } else {
                    LineOneFlag = 1;
                    return script.callReturn();
                }
                //return script.callReturn();
            },
            syntax: { js: [], py: [] },
        },
        //absh
        LineCodingABSH: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
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
                        type: 'number',
                        params: ['20'],
                    },
                    {
                        type: 'number',
                        params: ['18'],
                    },
                    {
                        type: 'number',
                        params: ['12'],
                    },
                    {
                        type: 'number',
                        params: ['10'],
                    },
                    {
                        type: 'number',
                        params: ['8'],
                    },
                    {
                        type: 'number',
                        params: ['3'],
                    },
                    null,
                ],
                type: 'LineCodingABSH',
            },
            paramsKeyMap: {
                ABSH1: 0,
                ABSH2: 1,
                ABSH3: 2,
                ABSH4: 3,
                ABSH5: 4,
                ABSH6: 5,
            },
            class: 'LineCoding_LINE5',
            isNotFor: ['LineCoding'],
            func: (sprite, script) => {
                let absh1 = script.getNumberValue('ABSH1', script);
                let absh2 = script.getNumberValue('ABSH2', script);
                let absh3 = script.getNumberValue('ABSH3', script);
                let absh4 = script.getNumberValue('ABSH4', script);
                let absh5 = script.getNumberValue('ABSH5', script);
                let absh6 = script.getNumberValue('ABSH6', script);
                if (!script.isStart) {
                    if (LineSaveFlag == 1) {
                      ++LineNum;
                    }
                    absh1 = Math.min(20, absh1);
                    absh1 = Math.max(0, absh1);
                    absh2 = Math.min(20, absh2);
                    absh2 = Math.max(0, absh2);
                    absh3 = Math.min(20, absh3);
                    absh3 = Math.max(0, absh3);
                    absh4 = Math.min(20, absh4);
                    absh4 = Math.max(0, absh4);
                    absh5 = Math.min(20, absh5);
                    absh5 = Math.max(0, absh5);
                    absh6 = Math.min(20, absh6);
                    absh6 = Math.max(0, absh6);

                    if (!Entry.hw.sendQueue.SET) {
                        Entry.hw.sendQueue.SET = {};
                    }
                    script.isStart = true;
                    script.timeFlag = 1;
                    Entry.hw.sendQueue.SET[parseInt(LineNum, 10)] = {
                        type: Entry.LineCoding.sensorTypes.LINE_ABSH,
                        data: {
                            absh1,
                            absh2,
                            absh3,
                            absh4,
                            absh5,
                            absh6,
                        },
                        time: new Date().getTime(),
                    };
                    setTimeout(() => {
                        script.timeFlag = 0;
                    }, 0.1);
                    return script;
                } else if (script.timeFlag === 1) {
                    return script;
                } else {
                    delete script.timeFlag;
                    delete script.isStart;
                    Entry.engine.isContinue = false;
                    return script.callReturn();
                }
            },
            syntax: { js: [], py: [] },
        },
        //  부저명령
        LineCodingBuzzerOnOff: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
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
                        params: ['2'],
                    },
                    {
                        type: 'text',
                        params: ['300'],
                    },
                    {
                        type: 'text',
                        params: ['300'],
                    },
                    null,
                ],
                type: 'LineCodingBuzzerOnOff',
            },
            paramsKeyMap: {
                COUNT: 0,
                OFFTIME: 1,
                ONTIME: 2,
            },
            class: 'LineCoding_LINE5',
            isNotFor: ['LineCoding'],
            func: (sprite, script) => {
                let ontime = script.getNumberValue('ONTIME');
                let offtime = script.getNumberValue('OFFTIME');
                let count = script.getValue('COUNT');
                if (LineSaveFlag == 1) {
                    ++LineNum;
                }
                if (LineOneFlag == 1) {
                    ontime = Math.min(2550, ontime);
                    ontime = Math.max(0, ontime);
                    offtime = Math.min(2550, offtime);
                    offtime = Math.max(0, offtime);
                    count = Math.min(255, count);
                    count = Math.max(0, count);
                    LineInit = Entry.hw.portData.DIGITAL[0];
                    if (!Entry.hw.sendQueue.SET) {
                        Entry.hw.sendQueue.SET = {};
                    }
                    Entry.hw.sendQueue.SET[parseInt(LineNum, 10)] = {
                        type: Entry.LineCoding.sensorTypes.LINE_BUZZER,
                        data: {
                            linetime: ontime,
                            speed: count,
                            time: offtime,
                        },
                        time: new Date().getTime(),
                    };
                    LineOneFlag = 0;
                }
                if (Entry.hw.portData.DIGITAL[0] == LineInit && LineSaveFlag == 0) {
                    return script;
                } else {
                    LineOneFlag = 1;
                    return script.callReturn();
                }
            },
            syntax: { js: [], py: [] },
        },
        //  LED명령
        LineCodingLED: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
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
                        params: ['2'],
                    },
                    {
                        type: 'text',
                        params: ['300'],
                    },
                    {
                        type: 'text',
                        params: ['300'],
                    },
                    {
                        type: 'LineCodingServoPortList',
                    },
                    null,
                ],
                type: 'LineCodingLED',
            },
            paramsKeyMap: {
                COUNT: 0,
                ONTIME: 1,
                OFFTIME: 2,
                PORT: 3,
            },
            class: 'LineCoding_LINE5',
            isNotFor: ['LineCoding'],
            func: (sprite, script) => {
                let ontime2 = script.getNumberValue('ONTIME');
                let offtime2 = script.getNumberValue('OFFTIME');
                let count2 = script.getValue('COUNT');
                let outport2 = script.getValue('PORT');
                if (LineSaveFlag == 1) {
                    ++LineNum;
                }
                if (LineOneFlag == 1) {
                    ontime2 = Math.min(2550, ontime2);
                    ontime2 = Math.max(0, ontime2);
                    offtime2 = Math.min(2550, offtime2);
                    offtime2 = Math.max(0, offtime2);
                    count2 = Math.min(255, count2);
                    count2 = Math.max(0, count2);
                    outport2 = Math.min(8, outport2);
                    outport2 = Math.max(1, outport2);
                    LineInit = Entry.hw.portData.DIGITAL[0];
                    if (!Entry.hw.sendQueue.SET) {
                        Entry.hw.sendQueue.SET = {};
                    }
                    Entry.hw.sendQueue.SET[parseInt(LineNum, 10)] = {
                        type: Entry.LineCoding.sensorTypes.LINE_LED,
                        data: {
                            ontime: ontime2,
                            offtime: offtime2,
                            count: count2,
                            outport: outport2,
                        },
                        time: new Date().getTime(),
                    };
                    LineOneFlag = 0;
                }
                if (Entry.hw.portData.DIGITAL[0] == LineInit && LineSaveFlag == 0) {
                    return script;
                } else {
                    LineOneFlag = 1;
                    return script.callReturn();
                }
            },
            syntax: { js: [], py: [] },
        },
        LineCodingBlackForwardF: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
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
                        params: ['-8'],
                    },
                    {
                        type: 'text',
                        params: ['3'],
                    },
                    {
                        type: 'LineCodingSensorNumtList',
                        params: ['0'],
                    },
                    {
                        type: 'LineCodingSensorNumtList',
                        params: ['7'],
                    },
                    null,
                ],
                type: 'LineCodingBlackForwardF',
            },
            paramsKeyMap: {
                SP: 0,
                BSP: 1,
                COUNT: 2,
                LSEN: 3,
                RSEN: 4,
            },
            class: 'LineCoding_LINE5',
            isNotFor: ['LineCoding'],
            func: (sprite, script) => {
                let fsp2 = script.getNumberValue('SP');
                let bsp2 = script.getNumberValue('BSP');
                let count2 = script.getValue('COUNT');
                let lsen2 = script.getValue('LSEN');
                let rsen2 = script.getValue('RSEN');
                if (LineSaveFlag == 1) {
                    ++LineNum;
                }
                if (LineOneFlag == 1) {
                    fsp2 = Math.min(20, fsp2);
                    fsp2 = Math.max(0, fsp2);
                    bsp2 = Math.min(20, bsp2);
                    bsp2 = Math.max(-20, bsp2);
                    count2 = Math.min(10, count2);
                    count2 = Math.max(0, count2);
                    lsen2 = Math.min(7, lsen2);
                    lsen2 = Math.max(0, lsen2);
                    rsen2 = Math.min(7, rsen2);
                    rsen2 = Math.max(0, rsen2);
                    LineInit = Entry.hw.portData.DIGITAL[0];
                    if (!Entry.hw.sendQueue.SET) {
                        Entry.hw.sendQueue.SET = {};
                    }
                    Entry.hw.sendQueue.SET[parseInt(LineNum, 10)] = {
                        type: Entry.LineCoding.sensorTypes.LINE_BLACKFORWARDF,
                        data: {
                            fsp: fsp2,
                            bsp: bsp2,
                            count: count2,
                            lsen: lsen2,
                            rsen: rsen2,
                        },
                        time: new Date().getTime(),
                    };
                    LineOneFlag = 0;
                }
                if (Entry.hw.portData.DIGITAL[0] == LineInit && LineSaveFlag == 0) {
                    return script;
                } else {
                    LineOneFlag = 1;
                    return script.callReturn();
                }
            },
            syntax: { js: [], py: [] },
        },
        //DC 모터 직진편차보정 ffmotor
        LineCodingFFmotor: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
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
                        type: 'number',
                        params: ['0'],
                    },
                    {
                        type: 'number',
                        params: ['0'],
                    },
                    null,
                ],
                type: 'LineCodingFFmotor',
            },
            paramsKeyMap: {
                LSPEED: 0,
                RSPEED: 1,
            },
            class: 'LineCoding_LINE5',
            isNotFor: ['LineCoding'],
            func(sprite, script) {
                let rspeed2 = script.getNumberValue('RSPEED', script);
                let lspeed2 = script.getNumberValue('LSPEED', script);
                ++LineNum;
                
                lspeed2 = Math.min(200, lspeed2);
                lspeed2 = Math.max(0, lspeed2);
                rspeed2 = Math.min(200, rspeed2);
                rspeed2 = Math.max(0, rspeed2);

                if (!Entry.hw.sendQueue.SET) {
                    Entry.hw.sendQueue.SET = {};
                }
                Entry.hw.sendQueue.SET[parseInt(LineNum, 10)] = {
                    type: Entry.LineCoding.sensorTypes.LINE_FFMOTOR,
                    data: {
                        lspeed: lspeed2,
                        rspeed: rspeed2,
                    },
                    time: new Date().getTime(),
                };
                LmotorSpeed = lspeed2;
                RmotorSpeed = rspeed2;
                return script.callReturn();
            },
            syntax: { js: [], py: [] },
        },
        //DC 모터 후진편차보정 bbmotor
        LineCodingBBmotor: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
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
                        type: 'number',
                        params: ['0'],
                    },
                    {
                        type: 'number',
                        params: ['0'],
                    },
                    null,
                ],
                type: 'LineCodingBBmotor',
            },
            paramsKeyMap: {
                LSPEED: 0,
                RSPEED: 1,
            },
            class: 'LineCoding_LINE5',
            isNotFor: ['LineCoding'],
            func(sprite, script) {
                let rspeed2 = script.getNumberValue('RSPEED', script);
                let lspeed2 = script.getNumberValue('LSPEED', script);
                ++LineNum;
                
                lspeed2 = Math.min(200, lspeed2);
                lspeed2 = Math.max(0, lspeed2);
                rspeed2 = Math.min(200, rspeed2);
                rspeed2 = Math.max(0, rspeed2);

                if (!Entry.hw.sendQueue.SET) {
                    Entry.hw.sendQueue.SET = {};
                }
                Entry.hw.sendQueue.SET[parseInt(LineNum, 10)] = {
                    type: Entry.LineCoding.sensorTypes.LINE_BBMOTOR,
                    data: {
                        lspeed: lspeed2,
                        rspeed: rspeed2,
                    },
                    time: new Date().getTime(),
                };
                LmotorSpeed = lspeed2;
                RmotorSpeed = rspeed2;
                return script.callReturn();
            },
            syntax: { js: [], py: [] },
        },
        //DC 모터 정지보정 motorstop
        LineCodingMotorStop: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
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
                        type: 'number',
                        params: ['0'],
                    },
                    {
                        type: 'number',
                        params: ['0'],
                    },
                    null,
                ],
                type: 'LineCodingMotorStop',
            },
            paramsKeyMap: {
                LSPEED: 0,
                RSPEED: 1,
            },
            class: 'LineCoding_LINE5',
            isNotFor: ['LineCoding'],
            func(sprite, script) {
                let rspeed2 = script.getNumberValue('RSPEED', script);
                let lspeed2 = script.getNumberValue('LSPEED', script);
                ++LineNum;
                
                lspeed2 = Math.min(200, lspeed2);
                lspeed2 = Math.max(0, lspeed2);
                rspeed2 = Math.min(200, rspeed2);
                rspeed2 = Math.max(0, rspeed2);

                if (!Entry.hw.sendQueue.SET) {
                    Entry.hw.sendQueue.SET = {};
                }
                Entry.hw.sendQueue.SET[parseInt(LineNum, 10)] = {
                    type: Entry.LineCoding.sensorTypes.LINE_MOTORSTOP,
                    data: {
                        lspeed: lspeed2,
                        rspeed: rspeed2,
                    },
                    time: new Date().getTime(),
                };
                LmotorSpeed = lspeed2;
                RmotorSpeed = rspeed2;
                return script.callReturn();
            },
            syntax: { js: [], py: [] },
        },
    };
};
module.exports = Entry.LineCoding;
