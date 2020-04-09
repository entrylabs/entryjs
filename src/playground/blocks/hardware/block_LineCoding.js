'use strict';

const DelayTime = 0;
let LmotorSpeed = 0;
let RmotorSpeed = 0;
let LineNum = 20;
let LineCount = 20;
let LineInit = 0;
let LineSaveFlag = 0;
let LineOneFlag = 1;
let serve_angle = [0,0,0,0,0,0,0,0];
let out_port = [0,0,0,0,0,0,0,0];

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
            data:0,
            time: new Date().getTime(),
        };
        Entry.hw.update();
        LmotorSpeed = 0;
        RmotorSpeed = 0;
        LineNum = 20;
        LineInit = 0;
        LineSaveFlag = 0;
        LineOneFlag = 1;
        LineCount = 20;
        serve_angle[0] = 0;
        serve_angle[1] = 0;
        serve_angle[2] = 0;
        serve_angle[3] = 0;
        serve_angle[4] = 0;
        serve_angle[5] = 0;
        serve_angle[6] = 0;
        serve_angle[7] = 0;
        out_port[0] = 0;
        out_port[1] = 0;
        out_port[2] = 0;
        out_port[3] = 0;
        out_port[4] = 0;
        out_port[5] = 0;
        out_port[6] = 0;
        out_port[7] = 0;
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
    'LineCodingBuzzerOnOff',
//    'LineCodingLED',
//    'LineCodingSline',
//    'LineCodingLineFind',
//    'LineCodingLineLost',
//    'LineCodingCline',
//    'LineCodingCline2',
//    'LineCodingFFmotor',
//    'LineCodingBBmotor',
//    'LineCodingMotorStop',
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
//    'LineCodingSetLcdString',
//    'LineCodingSetLcdBacklight',
//    'LineCodingSetLcdClear',
    'LineCodingGetAnalogMapping',
    'LineCodingRemotRx',
    'LineCodingLineDelay',
    'LineCodingABSH',
];

Entry.LineCoding.setLanguage = function() {
    // 블록 이름  번역
    return {
        ko: {
            template: {
                LineCodingStart: '%1 저장하기 시작 %2',
                LineCodingStop: '라인트레이서에 저장하기 종료 %1',
                LineCodingLineEasy: '%1 하기 %2',//직진,회전
                LineCodingEasySet: '%1 %2 로 정하기 %3',
                LineCodingEasyTimeSet: '교차로에서 %1mS 더 직진하도록 설정하기 %2',
                LineCodingEasyMotor: '모터 %1 방향으로  %2mS 이동하기 %3',
                LineCodingRestart: 'restart(%1); %2',
                LineCodingDelay: 'delay(%1); %2',
                LineCodingLine: 'line(%1, %2, %3); %4',
                LineCodingTurn: '%1(%2, %3); %4',
                LineCodingMotor: 'motor(%1, %2, %3);왼,오,시간 %4',
                LineCodingBmotor: '%1(%2, %3, %4);왼,오,센서 %5',
                LineCodingWheel: 'wheel(%1, %2); %3',
                LineCodingServo: 'sservo(%1, %2, %3%);포트,각도,속도 %4',
                LineCodingDigitalOnOff: '디지털 %1 포트 %2 설정하기 %3',
                LineCodingBuzzerOnOff: '스피커 %1 옥타브 %2음 %3 초 연주하기 %4',
                
                LineCodingMotorStop: 'DC모터 정지하기 %1',
                

                
                LineCodingGetDgitalValue: '디지털 %1 포트 읽기',
                LineCodingGetAnalogValue: '아날로그 %1 포트 읽기',
                LineCodingGetUsonicValue: '아날로그형 (US-016)초음파센서 %1포트 읽기',

                LineCodingSetLcdString: 'lcd 세로%1줄,  가로%2줄 에  %3 표시하기 %4',
                LineCodingSetLcdBacklight: 'lcd 후광(백라이트) %1 하기 %2',
                LineCodingSetLcdClear: 'lcd 지우기 %1',

                LineCodingGetAnalogMapping: ' %1 값 %2 ~ %3 에서 %4 ~ %5 으로 변환값',
                LineCodingRemotRx: ' 조종기버튼 %1,  %2 눌리면 실행하는 코드 %3',
                LineCodingLineDelay: 'linedelay(%1, %2, %3);주행시간,속도,더직진시간 %4',
                LineCodingABSH: 'lineabsh(%1, %2, %3, %4, %5, %6); %7',
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
                LineCodingEasyTimeSet: '교차로에서 %1 초 더 직진하기 %2',
                LineCodingEasyMotor: '모터 %1 방향으로  %2 초 이동하기 %3',
                LineCodingRestart: '일시정지 %1회 부저 울리고 출발 %2',
                LineCodingLine: '%1 교차로까지 %2 의 속도로 이동하고 교차로에서 %3 시간만큼 더 이동하기 %3',
                LineCodingTurn: '%1 %2 속도로 이동하고 반대방향으로 %3 초 회전하기 %4',
                LineCodingMotor: '왼쪽모터 %1, 오른쪽모터 %2 속도로 %3 초 이동하기 %4',
                LineCodingBmotor: '%1 왼쪽모터 %2, 오른쪽모터 %3 속도로 %4 센서 감지까지 이동하기 %5',
                LineCodingBuzzerOnOff: 'Speakers Beep %1 Playing Second %2',
                LineCodingWheel: 'Set DC motor left speed %1  right speed %2 %3',
                LineCodingServo: 'Servo motor %1 port angle %2 movement %3',
                LineCodingDigitalOnOff: 'Setting up digital %1 port %2 %3',
                LineCodingMotorStop: 'Stop DC Motor %1',
                

                
                LineCodingGetDgitalValue: 'Read digital %1 port',
                LineCodingGetAnalogValue: 'Analog %1 port read',
                LineCodingGetUsonicValue: 'Analog type (US-016)High sound sensor %1 port read',

                LineCodingSetLcdString: 'lcd Display %3 on line %1 and line %2 %4',
                LineCodingSetLcdBacklight: 'Enter lcd backlight %1 %2',
                LineCodingSetLcdClear: 'Clear lcd %1',

                LineCodingGetAnalogMapping: '%1 value %2 to %3 ; to %4 to %5 conversion value ',
                LineCodingRemotRx: ' 조종기버튼 %1,  %2 눌리면 실행하는 코드 %3',
                LineCodingLineDelay: 'linedelay(%1, %2, %3); %4',
                LineCodingABSH: 'lineabsh(%1, %2, %3, %4, %5, %6); %7',
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

function delay(gap){ /* gap is in millisecs */
    var then,now;
    then=new Date().getTime();
    now=then;
    while((now-then)<gap){
      now=new Date().getTime();
    }
 }

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
            func: (sprite, script) => {
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
            func: (sprite, script) => {
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
                Entry.hw.sendQueue.SET[parseInt(LineNum)] = {
                    type: Entry.LineCoding.sensorTypes.LINE_EASY,
                    data: value,
                    time: new Date().getTime(),
                };
               // delay(100);
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
                    if (LineSaveFlag == 1)
                    ++LineNum;
                    LineInit = Entry.hw.portData.DIGITAL[0];
                    if (!Entry.hw.sendQueue.SET) {
                        Entry.hw.sendQueue.SET = {};
                    }
                    Entry.hw.sendQueue.SET[parseInt(LineNum)] = {
                        type: Entry.LineCoding.sensorTypes.LINE_EASY,
                        data: value,
                        time: new Date().getTime(),
                    };
                    LineOneFlag = 0;
                }
                
                if ((Entry.hw.portData.DIGITAL[0] == LineInit) && (LineSaveFlag == 0)){
                    return script;
                }
                else {
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
                    if (LineSaveFlag == 1)
                        ++LineNum;
                    if (!Entry.hw.sendQueue.SET) {
                        Entry.hw.sendQueue.SET = {};
                    }
                    script.isStart = true;
                    script.timeFlag = 1;
                    if (port == 55) {
                        Entry.hw.sendQueue.SET[parseInt(LineNum)] = {
                            type: Entry.LineCoding.sensorTypes.LINE_FW_SPEED,
                            data: [num],
                            time: new Date().getTime(),
                        };
                    } else {
                        Entry.hw.sendQueue.SET[parseInt(LineNum)] = {
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
                let time = script.getNumberValue('TIME');
                if (!script.isStart) {
                    if (LineSaveFlag == 1)
                    ++LineNum;
                    if (!Entry.hw.sendQueue.SET) {
                        Entry.hw.sendQueue.SET = {};
                    }
                    script.isStart = true;
                    script.timeFlag = 1;
                    Entry.hw.sendQueue.SET[parseInt(LineNum)] = {
                        type: Entry.LineCoding.sensorTypes.LINE_CROSS_TIME,
                        data: { time,},
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
                        type: 'LineCodingEasylineList',
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
                const direction = script.getNumberValue('DIRECTION', script);
                let time = script.getNumberValue('TIME', script);
                if (LineSaveFlag == 1)
                    ++LineNum;
                if (LineOneFlag == 1) {
                    LineInit = Entry.hw.portData.DIGITAL[0];
                    if (!Entry.hw.sendQueue.SET) {
                        Entry.hw.sendQueue.SET = {};
                    }
                    Entry.hw.sendQueue.SET[parseInt(LineNum)] = {
                        type: Entry.LineCoding.sensorTypes.LINE_EASY_MOTOR,
                        data: { direction, time,},
                        time: new Date().getTime(),
                    };
                    LineOneFlag = 0;
                }
                if ((Entry.hw.portData.DIGITAL[0] == LineInit) && (LineSaveFlag == 0))
                    return script;
                else {
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
                if (LineSaveFlag == 1)
                    ++LineNum;
                if (LineOneFlag == 1) {
                    LineInit = Entry.hw.portData.DIGITAL[0]; 
                    if (!Entry.hw.sendQueue.SET) {
                        Entry.hw.sendQueue.SET = {};
                    }
                    Entry.hw.sendQueue.SET[parseInt(LineNum)] = {
                        type: Entry.LineCoding.sensorTypes.LINE_RESTART,
                        data: [num],
                        time: new Date().getTime(),
                    };
                    LineOneFlag = 0;
                }
                if ((Entry.hw.portData.DIGITAL[0] == LineInit) && (LineSaveFlag == 0))
                    return script;
                else {
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
                const time = script.getNumberValue('TIME', script);
                if (LineSaveFlag == 1)
                    ++LineNum;
                if (LineOneFlag == 1) {
                    LineInit = Entry.hw.portData.DIGITAL[0];
                    if (!Entry.hw.sendQueue.SET) {
                        Entry.hw.sendQueue.SET = {};
                    }
                    Entry.hw.sendQueue.SET[parseInt(LineNum)] = {
                        type: Entry.LineCoding.sensorTypes.LINE_DELAY,
                        data: {time,},
                        time: new Date().getTime(),
                    };
                    LineOneFlag = 0;
                }
                if ((Entry.hw.portData.DIGITAL[0] == LineInit) && (LineSaveFlag == 0))
                    return script;
                else {
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
                const cross = script.getNumberValue('CROSS', script);
                let speed = script.getNumberValue('SPEED', script);
                let time = script.getNumberValue('TIME', script);
                if (LineSaveFlag == 1)
                    ++LineNum;
                if (LineOneFlag == 1) {
                    LineInit = Entry.hw.portData.DIGITAL[0];
                    time = Math.min(1000, time);
                    time = Math.max(0, time);
                    speed = Math.min(20, speed);
                    speed = Math.max(0, speed);

                    if (!Entry.hw.sendQueue.SET) {
                        Entry.hw.sendQueue.SET = {};
                    }
                    Entry.hw.sendQueue.SET[parseInt(LineNum)] = {
                        type: Entry.LineCoding.sensorTypes.LINE_LINE,
                        data: {cross, speed, time,},
                        time: new Date().getTime(),
                    };
                    LineOneFlag = 0;
                }
                if ((Entry.hw.portData.DIGITAL[0] == LineInit) && (LineSaveFlag == 0))
                    return script;
                else {
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
                const cross = script.getNumberValue('CROSS', script);
                let speed = script.getNumberValue('SPEED', script);
                let time = script.getNumberValue('TIME', script);
                if (LineSaveFlag == 1)
                    ++LineNum;
                if (LineOneFlag == 1) {
                    LineInit = Entry.hw.portData.DIGITAL[0];
                    time = Math.min(1000, time);
                    time = Math.max(0, time);
                    speed = Math.min(20, speed);
                    speed = Math.max(0, speed);

                    if (!Entry.hw.sendQueue.SET) {
                        Entry.hw.sendQueue.SET = {};
                    }
                    Entry.hw.sendQueue.SET[parseInt(LineNum)] = {
                        type: Entry.LineCoding.sensorTypes.LINE_TURN,
                        data: {cross, speed, time,},
                        time: new Date().getTime(),
                    };
                    LineOneFlag = 0;
                }
                if ((Entry.hw.portData.DIGITAL[0] == LineInit) && (LineSaveFlag == 0))
                    return script;
                else {
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
                let cross = script.getNumberValue('LSPEED', script);
                let speed = script.getNumberValue('RSPEED', script);
                let time = script.getNumberValue('TIME', script);
                if (LineSaveFlag == 1)
                    ++LineNum;
                if (LineOneFlag == 1) {
                    LineInit = Entry.hw.portData.DIGITAL[0];
                    time = Math.min(1000, time);
                    time = Math.max(0, time);
                    cross = Math.min(20, cross);
                    cross = Math.max(-20, cross);
                    speed = Math.min(20, speed);
                    speed = Math.max(-20, speed);

                    if (!Entry.hw.sendQueue.SET) {
                        Entry.hw.sendQueue.SET = {};
                    }
                    Entry.hw.sendQueue.SET[parseInt(LineNum)] = {
                        type: Entry.LineCoding.sensorTypes.LINE_MOTOR,
                        data: {cross, speed, time,},
                        time: new Date().getTime(),
                    };
                    LineOneFlag = 0;
                }
                if ((Entry.hw.portData.DIGITAL[0] == LineInit) && (LineSaveFlag == 0))
                    return script;
                else {
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
                const mode = script.getNumberValue('MODE', script);
                let lspeed = script.getNumberValue('LSPEED', script);
                let rspeed = script.getNumberValue('RSPEED', script);
                let sensor = script.getNumberValue('SENSOR', script);
                if (LineSaveFlag == 1)
                    ++LineNum;
                if (LineOneFlag == 1) {
                    LineInit = Entry.hw.portData.DIGITAL[0];
                    lspeed = Math.min(20, lspeed);
                    lspeed = Math.max(-0, lspeed);
                    rspeed = Math.min(20, rspeed);
                    rspeed = Math.max(-0, rspeed);

                    if (!Entry.hw.sendQueue.SET) {
                        Entry.hw.sendQueue.SET = {};
                    }
                    if (mode == 1) {
                        Entry.hw.sendQueue.SET[parseInt(LineNum)] = {
                            type: Entry.LineCoding.sensorTypes.LINE_BMOTOR,
                            data: {mode, lspeed, rspeed, sensor,},
                            time: new Date().getTime(),
                        };
                    } else {
                        Entry.hw.sendQueue.SET[20] = {
                            type: Entry.LineCoding.sensorTypes.LINE_BWMOTOR,
                            data: {mode, lspeed, rspeed, sensor,},
                            time: new Date().getTime(),
                        };
                    }
                    LineOneFlag = 0;
                }
                if ((Entry.hw.portData.DIGITAL[0] == LineInit) && (LineSaveFlag == 0))
                    return script;
                else {
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
                let rspeed = script.getNumberValue('RSPEED', script);
                let lspeed = script.getNumberValue('LSPEED', script);
                if (LineSaveFlag == 1)
                    ++LineNum;
                lspeed = Math.min(20, lspeed);
                lspeed = Math.max(-20, lspeed);
                rspeed = Math.min(20, rspeed);
                rspeed = Math.max(-20, rspeed);

                if (!(LmotorSpeed === lspeed) || !(RmotorSpeed === rspeed) || (LineSaveFlag == 1)) {
                    if (!Entry.hw.sendQueue.SET) {
                        Entry.hw.sendQueue.SET = {};
                    }
                    Entry.hw.sendQueue.SET[parseInt(LineNum)] = {
                        type: Entry.LineCoding.sensorTypes.LINE_WHEEL,
                        data: {lspeed, rspeed,},
                        time: new Date().getTime(),
                    };
                    LmotorSpeed = lspeed;
                    RmotorSpeed = rspeed;
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
                        params: ['0'],
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
                const sport = script.getNumberValue('PORT', script);
                let angle = script.getNumberValue('ANGLE', script);
                let speed = script.getNumberValue('SPEED', script);
                if (LineSaveFlag == 1)
                    ++LineNum;
                //				port += 2;
                //				var mode = 1;

                angle = Math.min(180, angle);
                angle = Math.max(0, angle);
                speed = Math.min(100, speed);
                speed = Math.max(0, speed);
                //speed *= speed * 255;
                //angle += 1;
                if(serve_angle[sport-1] != angle){
                    serve_angle[sport-1] = angle;
                    if (!Entry.hw.sendQueue.SET) {
                        Entry.hw.sendQueue.SET = {};
                    }
                    Entry.hw.sendQueue.SET[parseInt(sport + 10)] = {
                        type: Entry.LineCoding.sensorTypes.LINE_SERVO,
                        data: {sport, angle, speed,},
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
                const dport = script.getNumberValue('PORT');
                const value = script.getNumberValue('VALUE');
                if(out_port[dport-1] != value){
                    out_port[dport-1] = value;
                    if (!Entry.hw.sendQueue.SET) {
                        Entry.hw.sendQueue.SET = {};
                    }
                    Entry.hw.sendQueue.SET[18] = {
                        type: Entry.LineCoding.sensorTypes.LINE_PORT,
                        /// 출력 디바이스
                        data: {dport,value,},
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
                        type: 'LineCodingOctaveList',						
                    },
                    {
                        type: 'LineCodingToneList',
                    },
                    {
                        type: 'text',
                        params: ['0.5'],
                    },
                    null,
                ],
                type: 'LineCodingBuzzerOnOff',
            },
            paramsKeyMap: {
                OCTAVE: 0,				
                NOTE: 1,
                DURATION: 2,
            },
            class: 'LineCoding_LINE2',
            isNotFor: ['LineCoding'],
            func: (sprite, script) => {
                let duration = script.getNumberValue('DURATION');
                let octave = script.getNumberValue('OCTAVE');
                let value = 0;
                if (LineSaveFlag == 1)
                    ++LineNum;

                if (!script.isStart) {
                    let note = script.getValue('NOTE');
                    if (!Entry.Utils.isNumber(note)) {
                        note = Entry.LineCoding.toneTable[note];
                    }
                    if (note < 0) note = 0;
                    else if (note > 12) note = 12;

                    if (duration < 0) duration = 0;

                    if (!Entry.hw.sendQueue.SET) {
                        Entry.hw.sendQueue.SET = {};
                    }
                    if (duration === 0) {
                        // 음 길이가 0 이면
                        Entry.hw.sendQueue.SET[parseInt(LineNum)] = {
                            type: Entry.LineCoding.sensorTypes.TONE,
                            data: 0,
                            time: new Date().getTime(),
                        };
                        return script.callReturn();
                    }
                    if (octave < 0) octave = 0;
                    else if (octave > 4) octave = 4;
                    if (note != 0) value = Entry.LineCoding.toneMap[note][octave];
                    if (duration > 300) {
                        duration = 300;
                    }
                    duration = duration * 1000;
                    script.isStart = true;
                    // 출력 시작 플래그 셋
                    script.timeFlag = 1;
                    // 시간플래그 셋

                    Entry.hw.sendQueue.SET[parseInt(LineNum)] = {
                        type: Entry.LineCoding.sensorTypes.TONE,
                        data: {
                            value: value,
                            duration: duration ,
                        },
                        time: new Date().getTime(),
                    };

                    setTimeout(() => {
                        script.timeFlag = 0;
                    }, duration + 32);
                    return script;
                } else if (script.timeFlag === 1) {
                    return script;
                } else {
                    delete script.timeFlag;
                    delete script.isStart;
                    Entry.hw.sendQueue.SET[parseInt(LineNum)] = {
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
                const port = script.getNumberValue('PORT');
            //    const DIGITAL = Entry.hw.portData.DIGITAL;

                if (!Entry.hw.sendQueue.GET) {
                    Entry.hw.sendQueue.GET = {};
                }
                Entry.hw.sendQueue.GET[Entry.LineCoding.sensorTypes.DIGITAL] = {
                    port: port,
                    time: new Date().getTime(),
                };
                return Entry.hw.portData.DIGITAL[parseInt(port)];
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
                var BtnIndex = script.getNumberValue('PORT');
                var ANALOG = Entry.hw.portData.ANALOG;

                return ANALOG[parseInt(BtnIndex)];
            },
            syntax: { js: [], py: [] },
        },

        // 15. 초음파 센서 값
        LineCodingGetUsonicValue: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            template: Lang.template.LineCodingGetUsonicValue,
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
                type: 'LineCodingGetUsonicValue',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'LineCoding_LV3',
            isNotFor: ['LineCoding'],
            func: (sprite, script) => {
                const BtnIndex = script.getNumberValue('PORT');
                const ANALOG = Entry.hw.portData.ANALOG;
                return (ANALOG.BtnIndex * 4 * 3) / 10;
            },
            syntax: { js: [], py: [] },
        },

        // 21. LCD글자출력
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
                        params: ['Hello'],
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
            class: 'LineCoding_LV5',
            isNotFor: ['LineCoding'],
            func: (sprite, script) => {
                //var sq = Entry.hw.sendQueue;
                const line2 = script.getValue('LINE', script);
                const column2 = script.getValue('COLUMN', script);
                const string = script.getValue('STRING', script);
                const text = [];
                let buf;

                if (!script.isStart) {
                    if (typeof string === 'string') {
                        for (let i = 0; i < string.length; i++) {
                            buf = Entry.memaker.toByte(string[parseInt(i)]);
                            text[parseInt(i)] = buf;
                            //text[i] = Entry.memaker.toByte(string[i]);
                            //text.i = Entry.memaker.toByte(string.i);
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
                        },
                        time: new Date().getTime(),
                    };

                    setTimeout(() => {
                        script.timeFlag = 0;
                    }, DelayTime);
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

        // . LCD 백라이트
        LineCodingSetLcdBacklight: {
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
                        type: 'LineCodingBacklightOnoffList',
                    },
                    null,
                ],
                type: 'LineCodingSetLcdBacklight',
            },
            paramsKeyMap: {
                VALUE: 0,
            },
            class: 'LineCoding_LV5',
            isNotFor: ['LineCoding'],
            func: (sprite, script) => {
                const value = script.getNumberValue('VALUE');

                if (!Entry.hw.sendQueue.SET) {
                    Entry.hw.sendQueue.SET = {};
                }
                Entry.hw.sendQueue.SET[1] = {
                    type: Entry.LineCoding.sensorTypes.LCD_SET,
                    data: [value, 1, 1],
                    time: new Date().getTime(),
                };
                return script.callReturn();
            },
            syntax: { js: [], py: [] },
        },

        // 23. LCD 지우기
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
            class: 'LineCoding_LV5',
            isNotFor: ['LineCoding'],
            func: (sprite, script) => {
                //var port = 0;

                if (!Entry.hw.sendQueue.SET) {
                    Entry.hw.sendQueue.SET = {};
                }
                Entry.hw.sendQueue.SET[4] = {
                    type: Entry.LineCoding.sensorTypes.LCD_SET,
                    data: [4, 4, 4],
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
                const dport = script.getNumberValue('KEY1');
                const value = script.getNumberValue('KEY2');
                if (LineSaveFlag == 1)
                    ++LineNum;
                if (!Entry.hw.sendQueue.SET) {
                    Entry.hw.sendQueue.SET = {};
                }
                Entry.hw.sendQueue.SET[parseInt(LineNum)] = {
                    type: Entry.LineCoding.sensorTypes.LINE_REMOT,
                        /// 출력 디바이스
                    data: {dport,value,},
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
                const linetime = script.getNumberValue('LINETIME', script);
                let speed = script.getNumberValue('SPEED', script);
                let time = script.getNumberValue('TIME', script);
                if (LineSaveFlag == 1)
                    ++LineNum;
                if (LineOneFlag == 1) {
                    LineInit = Entry.hw.portData.DIGITAL[0];
                    time = Math.min(1000, time);
                    time = Math.max(0, time);
                    speed = Math.min(20, speed);
                    speed = Math.max(0, speed);

                    if (!Entry.hw.sendQueue.SET) {
                        Entry.hw.sendQueue.SET = {};
                    }
                    Entry.hw.sendQueue.SET[parseInt(LineNum)] = {
                        type: Entry.LineCoding.sensorTypes.LINE_LINEDELAY,
                        data: {linetime, speed, time,},
                        time: new Date().getTime(),
                    };
                    LineOneFlag = 0;
                }
                if ((Entry.hw.portData.DIGITAL[0] == LineInit) && (LineSaveFlag == 0))
                    return script;
                else {
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
            func(sprite, script) {
                let absh1 = script.getNumberValue('ABSH1', script);
                let absh2 = script.getNumberValue('ABSH2', script);
                let absh3 = script.getNumberValue('ABSH3', script);
                let absh4 = script.getNumberValue('ABSH4', script);
                let absh5 = script.getNumberValue('ABSH5', script);
                let absh6 = script.getNumberValue('ABSH6', script);
                if (LineSaveFlag == 1)
                    ++LineNum;
                absh1 = Math.min(0, absh1);
                absh1 = Math.max(20, absh1);
                absh2 = Math.min(0, absh2);
                absh2 = Math.max(20, absh2);
                absh3 = Math.min(0, absh3);
                absh3 = Math.max(20, absh3);
                absh4 = Math.min(0, absh4);
                absh4 = Math.max(20, absh4);
                absh5 = Math.min(0, absh5);
                absh5 = Math.max(20, absh5);
                absh6 = Math.min(0, absh6);
                absh6 = Math.max(20, absh6);

                if (!Entry.hw.sendQueue.SET) {
                    Entry.hw.sendQueue.SET = {};
                }
                Entry.hw.sendQueue.SET[parseInt(LineNum)] = {
                    type: Entry.LineCoding.sensorTypes.LINE_ABSH,
                    data: {absh1, absh2, absh3, absh4, absh5, absh6},
                    time: new Date().getTime(),
                };
                return script.callReturn();
            },
            syntax: { js: [], py: [] },
        },
    };
};
module.exports = Entry.LineCoding;