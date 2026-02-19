'use strict';
let headLED_Backup = new Int8Array(16);
let bodyLED_Backup = new Int8Array(16);
let mp3ID = 0;
Entry.RoboDog = {


    Cmd: {
        CMD_CHECKSUM: 5,
        CMD_MP3TRACK: 7,
        CMD_MP3VOLUME: 8,
        CMD_EXTSERVO: 12,
        CMD_SERVOSPEED: 13,
        CMD_LEDTYPE: 14,
        CMD_TYPE: 15,
        CMD_GESTURE: 16,
        CMD_LEG0: 16,
        CMD_LEG1: 17,
        CMD_LEG2: 18,
        CMD_LEG3: 19,
        CMD_MOVEVEL: 20,
        CMD_DEG_VEL:21,
        CMD_DEG_LOW:22,
        CMD_DEG_HIGH:23,
        CMD_LEDDRAW: 24,
        CMD_BODYLED0: 24,
        CMD_BODYLED1: 28,
        CMD_BODYLED2: 32,
        CMD_BODYLED3: 36,
        CMD_SERVOSPEED_EXT: 40,
    },
    Sensor: {
        SENSOR_BATTERY: 6,
        SENSOR_TOF: 7,
        SENSOR_TILT_LR: 8,
        SENSOR_TILT_FB: 9,
        SENSOR_YAW_LOW: 10,
        SENSOR_YAW_HIGH: 11,
        SENSOR_RB_DATA: 12,
        SENSOR_BUTTON: 16,
        SENSOR_RB_WATHDOG: 17,
    },
    setZero: function() {
        Entry.hw.sendQueue.CMD = [
            0x26, 0xA8, 0x14, 0x81, 0x30, 0x20, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 100, 100, 100, 100, 100, 100, 100, 100
        ];
        for (let n=0; n<16; n++){
            headLED_Backup[n] = 0;
            bodyLED_Backup[n] = 0;
        }
        Entry.hw.update();
    },
    id: '1D.5',
    name: 'RoboDog',
    url: 'http://www.junilab.co.kr',
    imageName: 'robodog.png',
    title: {
        'en': 'RoboDog',
        'ko': '로보독',
    },
    monitorTemplate: {
        width: 1500,
        height: 600,
        listPorts: {
            'BATTERY': {
                name: '배터리(%)',
                type: 'input',
                pos: {
                    x: 0,
                    y: 0,
                },
            },
            'TOF': {
                name: '거리센서',
                type: 'input',
                pos: {
                    x: 0,
                    y: 20,
                },
            },
            'BUTTON': {
                name: '버튼',
                type: 'input',
                pos: {
                    x: 0,
                    y: 40,
                },
            },
            'ROLL': {
                name: '좌/우 기울기',
                type: 'input',
                pos: {
                    x: 0,
                    y: 60,
                },
            },
            'PITCH': {
                name: '앞/뒤 기울기',
                type: 'input',
                pos: {
                    x: 0,
                    y: 80,
                },
            },

            'YAW': {
                name: '회전',
                type: 'input',
                pos: {
                    x: 0,
                    y: 100,
                },
            },
            'RB_WATCHDOG': {
                name: '라즈베리파이 준비상태',
                type: 'input',
                pos: {
                    x: 0,
                    y: 40,
                },
            },
            'RB0': {
                name: '라즈베리파이D1',
                type: 'input',
                pos: {
                    x: 0,
                    y: 120,
                },
            },
            'RB1': {
                name: '라즈베리파이D2',
                type: 'input',
                pos: {
                    x: 0,
                    y: 140,
                },
            },
            'RB2': {
                name: '라즈베리파이D3',
                type: 'input',
                pos: {
                    x: 0,
                    y: 160,
                },
            },
            'RB3': {
                name: '라즈베리파이D4',
                type: 'input',
                pos: {
                    x: 0,
                    y: 160,
                },
            },
            'RB4': {
                name: '라즈베리파이D5',
                type: 'input',
                pos: {
                    x: 0,
                    y: 160,
                },
            },
            'RB5': {
                name: '라즈베리파이D6',
                type: 'input',
                pos: {
                    x: 0,
                    y: 160,
                },
            },
        },
        ports: {  
        },
        mode: 'both',
    },
};

function checksum(cmd){
    let sum = 0;

    cmd.forEach(function (value, idx) {
        if(idx > 5)
            sum += value;
    });
    return sum&0xFF;
}

function check_cmdInit(){
    if (typeof Entry.hw.sendQueue.CMD == 'undefined') {
        Entry.hw.sendQueue.CMD = [
            0x26, 0xA8, 0x14, 0x81, 0x30, 0x20, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 100, 100, 100, 100, 100, 100, 100, 100
        ];
    }
}


function set_option(cmd, option, initValue) {
    console.log("set option : "+cmd[Entry.RoboDog.Cmd.CMD_TYPE]+" "+option)
    if(cmd[Entry.RoboDog.Cmd.CMD_TYPE] != option){
        for (let n = 0; n < 8; n++){
            cmd[Entry.RoboDog.Cmd.CMD_LEG0+n] = initValue;
        }
    }
    cmd[Entry.RoboDog.Cmd.CMD_TYPE] = option;
}

Entry.RoboDog.setLanguage = function() {
    return {
        ko: {
            template: {
                'robodog_gesture': '%1 자세 취하기 %2',
                'robodog_gesture0': '준비',
                'robodog_gesture1': '앉기',
                'robodog_gesture2': '물구나무서기',
                'robodog_gesture3': '기지개 켜기',
                'robodog_gesture4': '인사하기',

                'robodog_legact': '%1를 %2높이로 설정하기 %3',
                'robodog_legact0': '네다리',
                'robodog_legact1': '앞다리',
                'robodog_legact2': '뒷다리',
                'robodog_legact3': '왼쪽다리',
                'robodog_legact4': '오른쪽다리',

                'robodog_move': '%1(으)로 %2빠르기로 이동하기 %3',
                'robodog_move0': '앞',
                'robodog_move1': '뒤',

                'robodog_leg': '%1다리높이 %2, 발끝앞뒤%3로 설정하기 %4',
                'robodog_leg0': '왼쪽 위',
                'robodog_leg1': '왼쪽 아래',
                'robodog_leg2': '오른쪽 아래',
                'robodog_leg3': '오른쪽 위',
                'robodog_leg4': '앞다리',
                'robodog_leg5': '뒷다리',
                'robodog_leg6': '왼쪽다리',
                'robodog_leg7': '오른쪽다리',
                'robodog_leg8': '네다리',

                'robodog_motor': '%1어깨 %2도, 무릎%3도 설정하기 %4',

                'robodog_rotation': '%1으로 %2도를 %3각속도로 회전하기 %4',
                'robodog_rotation0': '시계방향',
                'robodog_rotation1': '반시계방향',

                'robodog_servospeed': '%1 회전속도를 어깨 %2, 무릎 %3(으)로 설정하기 %4',

                'robodog_headledexp': '%1 표정을 헤드LED에 표현하기 %2',
                'robodog_headledexp0': '초롱초롱',
                'robodog_headledexp1': 'I❤U',
                'robodog_headledexp2': '눈감기',
                'robodog_headledexp3': '감사',
                'robodog_headledexp4': '고마워요',
                'robodog_headledexp5': '뱁새',
                'robodog_headledexp6': '좌우굴리기',
                'robodog_headledexp7': '찢눈',
                'robodog_headledexp8': '찢눈 깜박임',
                'robodog_headledexp9': '곤충',
                'robodog_headledexp10': '깜박',
                'robodog_headledexp11': '뱀눈',
                'robodog_headledexp12': '바람개비',
                'robodog_headledexp13': '왕눈이',

                'robodog_headledprint': '%1 헤드LED에 %2 문자 출력하기 %3',
                'robodog_headledprint0': '왼쪽',
                'robodog_headledprint1': '오른쪽',

                'robodog_bodyled': '%1번 바디LED를 R:%2, G:%3, B:%4색상 출력하기 %5',

                'robodog_mp3play': '%1소리를 %2출력하기 %3',
                'robodog_mp3play01': '멍멍',
                'robodog_mp3play02': '으르렁',
                'robodog_mp3play03': '화난',
                'robodog_mp3play04': '신음',
                'robodog_mp3play05': '거친숨',
                'robodog_mp3play11': '안녕',
                'robodog_mp3play12': '기다려',
                'robodog_mp3play13': '비켜',
                'robodog_mp3play14': '출발',
                'robodog_mp3play21': '레이저',
                'robodog_mp3play22': '모터회전',
                'robodog_mp3play23': '띠리리',
                'robodog_mp3play24': '외계신호',
                'robodog_mp3play25': '동작',
                'robodog_mp3play26': '충돌',
                'robodog_mp3play31': '도',
                'robodog_mp3play32': '레',
                'robodog_mp3play33': '미',
                'robodog_mp3play34': '파',
                'robodog_mp3play35': '솔',
                'robodog_mp3play36': '라',
                'robodog_mp3play37': '시',
                'robodog_mp3play38': '#도',

                'robodog_mp3playvol0': '작게',
                'robodog_mp3playvol1': '중간으로',
                'robodog_mp3playvol2': '크게',

                'robodog_expservo': '확장 서보모터를 %1도 설정하기 %2',

                'robodog_button': '버튼',
                'robodog_battery': '배터리(%)',
                'robodog_getalt': '거리센서',
                'robodog_gettilt': '%1기울기',
                'robodog_tilt0': '좌우',
                'robodog_tilt1': '앞뒤',
                'robodog_getrot': '회전',

                'robodog_isrbalive': '라즈베리파이 준비상태',
                'robodog_getrbdata': '라즈베리파이 %1번 값',
                'robodog_getrbstr': '라즈베리파이 문자열',
            },
        },
        en: {
            template: {
                'robodog_gesture': '%1 자세 취하기 %2',
                'robodog_gesture0': '준비',
                'robodog_gesture1': '앉기',
                'robodog_gesture2': '물구나무서기',
                'robodog_gesture3': '기지개 켜기',
                'robodog_gesture4': '인사하기',

                'robodog_legact': '%1를 %2높이로 설정하기 %3',
                'robodog_legact0': '네다리',
                'robodog_legact1': '앞다리',
                'robodog_legact2': '뒷다리',
                'robodog_legact3': '왼쪽다리',
                'robodog_legact4': '오른쪽다리',

                'robodog_move': '%1(으)로 %2빠르기로 이동하기 %3',
                'robodog_move0': '앞',
                'robodog_move1': '뒤',

                'robodog_leg': '%1다리높이 %2, 발끝앞뒤%3로 설정하기 %4',
                'robodog_leg0': '왼쪽 위',
                'robodog_leg1': '왼쪽 아래',
                'robodog_leg2': '오른쪽 아래',
                'robodog_leg3': '오른쪽 위',
                'robodog_leg4': '앞다리',
                'robodog_leg5': '뒷다리',
                'robodog_leg6': '왼쪽다리',
                'robodog_leg7': '오른쪽다리',
                'robodog_leg8': '네다리',

                'robodog_motor': '%1어깨 %2도, 무릎%3도 설정하기 %4',

                'robodog_rotation': '%1으로 %2도를 %3각속도로 회전하기 %4',
                'robodog_rotation0': '시계방향',
                'robodog_rotation1': '반시계방향',

                'robodog_servospeed': '%1 회전속도를 어깨 %2, 무릎 %3(으)로 설정하기 %4',

                'robodog_headledexp': '%1 표정을 헤드LED에 표현하기 %2',
                'robodog_headledexp0': '초롱초롱',
                'robodog_headledexp1': 'I❤U',
                'robodog_headledexp2': '눈감기',
                'robodog_headledexp3': '감사',
                'robodog_headledexp4': '고마워요',
                'robodog_headledexp5': '뱁새',
                'robodog_headledexp6': '좌우굴리기',
                'robodog_headledexp7': '찢눈',
                'robodog_headledexp8': '찢눈 깜박임',
                'robodog_headledexp9': '곤충',
                'robodog_headledexp10': '깜박',
                'robodog_headledexp11': '뱀눈',
                'robodog_headledexp12': '바람개비',
                'robodog_headledexp13': '왕눈이',

                'robodog_headledprint': '%1 헤드LED에 %2 문자 출력하기',
                'robodog_headledprint0': '왼쪽',
                'robodog_headledprint1': '오른쪽',

                'robodog_bodyled': '%1번 바디LED를 R:%2, G:%3, B:%4색상 출력하기 %5',

                'robodog_mp3play': '%1소리를 %2출력하기 %3',
                'robodog_mp3play01': '멍멍',
                'robodog_mp3play02': '으르렁',
                'robodog_mp3play03': '화난',
                'robodog_mp3play04': '신음',
                'robodog_mp3play05': '거친숨',
                'robodog_mp3play11': '안녕',
                'robodog_mp3play12': '기다려',
                'robodog_mp3play13': '비켜',
                'robodog_mp3play14': '출발',
                'robodog_mp3play21': '레이저',
                'robodog_mp3play22': '모터회전',
                'robodog_mp3play23': '띠리리',
                'robodog_mp3play24': '외계신호',
                'robodog_mp3play25': '동작',
                'robodog_mp3play26': '충돌',
                'robodog_mp3play31': '도',
                'robodog_mp3play32': '레',
                'robodog_mp3play33': '미',
                'robodog_mp3play34': '파',
                'robodog_mp3play35': '솔',
                'robodog_mp3play36': '라',
                'robodog_mp3play37': '시',
                'robodog_mp3play38': '#도',

                'robodog_mp3playvol0': '작게',
                'robodog_mp3playvol1': '중간으로',
                'robodog_mp3playvol2': '크게',

                'robodog_expservo': '확장 서보모터를 %1도 설정하기 %2',

                'robodog_button': '버튼',
                'robodog_battery': '배터리(%)',
                'robodog_getalt': '거리센서',
                'robodog_gettilt': '%1기울기',
                'robodog_tilt0': '좌우',
                'robodog_tilt1': '앞뒤',
                'robodog_getrot': '회전',

                'robodog_isrbalive': '라즈베리파이 준비상태',
                'robodog_getrbdata': '라즈베리파이 %1번 값',
                'robodog_getrbstr': '라즈베리파이 문자열',
            },
        },
    };
};


Entry.RoboDog.blockMenuBlocks = [
    'robodog_gesture',
    'robodog_legact',
    'robodog_move',
    'robodog_leg',
    'robodog_motor',
    'robodog_rotation',
    'robodog_servospeed',
    'robodog_headledexp',
    'robodog_headledprint',
    'robodog_bodyled',
    'robodog_mp3play',
    'robodog_expservo',
    'robodog_button',
    'robodog_battery',
    'robodog_getalt',
    'robodog_gettilt',
    'robodog_getrot',
    'robodog_isrbalive',
    'robodog_getrbdata',
    'robodog_getrbstr'
];



Entry.RoboDog.getBlocks = function() {
    return {
        //region RoboDog
        robodog_gesture: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.template.robodog_gesture0, 0],
                        [Lang.template.robodog_gesture1, 1],
                        [Lang.template.robodog_gesture2, 2],
                        [Lang.template.robodog_gesture3, 3],
                        [Lang.template.robodog_gesture4, 4],
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
            def: {
                params: [null],
                type: 'robodog_gesture',
            },
            paramsKeyMap: {
                MOTION: 0
            },
            class: 'RoboDog_Action',
            isNotFor: ['RoboDog'],

            func: function(sprite, script) {
                check_cmdInit();
                let motion = script.getField('MOTION', script);
                let cmd = Entry.hw.sendQueue.CMD;

                set_option(cmd, 0x04, 0);
                cmd[Entry.RoboDog.Cmd.CMD_GESTURE] = motion;
                cmd[Entry.RoboDog.Cmd.CMD_CHECKSUM] = checksum(cmd);
                Entry.hw.update();
                return script.callReturn();
            },
            syntax: { js: [], py: [] },
        },
        robodog_legact: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.template.robodog_legact0, 0],
                        [Lang.template.robodog_legact1, 1],
                        [Lang.template.robodog_legact2, 2],
                        [Lang.template.robodog_legact3, 3],
                        [Lang.template.robodog_legact4, 4],
                    ],
                    value: 0,
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Block',
                    accept: 'string',
                    value: '60',
                    fontSize: 11,
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'robodog_legact',
            },
            paramsKeyMap: {
                WHAT_LEG: 0,
                LEG_ALT: 1
            },
            class: 'RoboDog_Action',
            isNotFor: ['RoboDog'],

            func: function(sprite, script) {
                check_cmdInit();
                let what_leg = script.getField('WHAT_LEG', script);
                let alt_leg = script.getNumberValue('LEG_ALT', script);
                let cmd = Entry.hw.sendQueue.CMD;

                set_option(cmd, 0x01, 0);

                if(what_leg == 0) {
                    for (let n = 0; n < 4; n++)
                        cmd[Entry.RoboDog.Cmd.CMD_LEG0 + n] = alt_leg;
                }
                if(what_leg == 1)
                    cmd[Entry.RoboDog.Cmd.CMD_LEG0] = cmd[Entry.RoboDog.Cmd.CMD_LEG0+3] = alt_leg;
                if(what_leg == 2)
                    cmd[Entry.RoboDog.Cmd.CMD_LEG0+1] = cmd[Entry.RoboDog.Cmd.CMD_LEG0+2] = alt_leg;
                if(what_leg == 3)
                    cmd[Entry.RoboDog.Cmd.CMD_LEG0] = cmd[Entry.RoboDog.Cmd.CMD_LEG0+1] = alt_leg;
                if(what_leg == 4)
                    cmd[Entry.RoboDog.Cmd.CMD_LEG0+2] = cmd[Entry.RoboDog.Cmd.CMD_LEG0+3] = alt_leg;
                cmd[Entry.RoboDog.Cmd.CMD_CHECKSUM] = checksum(cmd);
                Entry.hw.update();
                return script.callReturn();
            },
            syntax: { js: [], py: [] },
        },

        robodog_move: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.template.robodog_move0, 0],
                        [Lang.template.robodog_move1, 1],
                    ],
                    value: 0,
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Block',
                    accept: 'string',
                    value: '50',
                    fontSize: 11,
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'robodog_move',
            },
            paramsKeyMap: {
                DIRECTION: 0,
                VELOCITY: 1
            },
            class: 'RoboDog_Action',
            isNotFor: ['RoboDog'],

            func: function(sprite, script) {
                check_cmdInit();
                let direction = script.getField('DIRECTION', script);
                let velocity = script.getNumberValue('VELOCITY', script);
                let cmd = Entry.hw.sendQueue.CMD;
                set_option(cmd, 0x01, 0);

                velocity = velocity>100? 100 : velocity<-100? -100 : velocity;
                if(direction == 1)
                    velocity = -1*velocity;
                cmd[Entry.RoboDog.Cmd.CMD_MOVEVEL] = velocity;

                cmd[Entry.RoboDog.Cmd.CMD_CHECKSUM] = checksum(cmd);
                Entry.hw.update();
                return script.callReturn();
            },
            syntax: { js: [], py: [] },
        },



        robodog_leg: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.template.robodog_leg0, 0],
                        [Lang.template.robodog_leg1, 1],
                        [Lang.template.robodog_leg2, 2],
                        [Lang.template.robodog_leg3, 3],
                        [Lang.template.robodog_leg4, 4],
                        [Lang.template.robodog_leg5, 5],
                        [Lang.template.robodog_leg6, 6],
                        [Lang.template.robodog_leg7, 7],
                        [Lang.template.robodog_leg8, 8],
                    ],
                    value: 0,
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Block',
                    accept: 'string',
                    value: '60',
                    fontSize: 11,
                },
                {
                    type: 'Block',
                    accept: 'string',
                    value: '0',
                    fontSize: 11,
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'robodog_leg',
            },
            paramsKeyMap: {
                WHAT_LEG: 0,
                LEG_ALT: 1,
                LEG_FB: 2
            },
            class: 'RoboDog_Action',
            isNotFor: ['RoboDog'],

            func: function(sprite, script) {
                check_cmdInit();
                let what_leg = script.getField('WHAT_LEG', script);
                let leg_alt = script.getNumberValue('LEG_ALT', script);
                let leg_fb = script.getNumberValue('LEG_FB', script);
                let cmd = Entry.hw.sendQueue.CMD;

                set_option(cmd, 0x02, -127);

                const pos = [[1, 0, 0, 0],[0, 1, 0, 0],[0, 0, 1, 0],[0, 0, 0, 1],[1, 0, 0, 1],[0, 1, 1, 0],[1, 1, 0, 0],[0, 0, 1, 1],[1, 1, 1, 1]];
                leg_alt = leg_alt>90? 90 : leg_alt<20? 20 : leg_alt;
                leg_fb = leg_fb>90? 90 : leg_fb<-90? -90 : leg_fb;
                let _pos = pos[what_leg];
                for(let n=0; n<4; n++){
                    if(_pos[n] == 1){
                        cmd[Entry.RoboDog.Cmd.CMD_LEG0+n*2] = leg_alt;
                        cmd[Entry.RoboDog.Cmd.CMD_LEG0+n*2+1] = leg_fb;
                    }
                }
                
                cmd[Entry.RoboDog.Cmd.CMD_CHECKSUM] = checksum(cmd);
                Entry.hw.update();
                return script.callReturn();
            },
            syntax: { js: [], py: [] },
        },



        robodog_motor: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.template.robodog_leg0, 0],
                        [Lang.template.robodog_leg1, 1],
                        [Lang.template.robodog_leg2, 2],
                        [Lang.template.robodog_leg3, 3],
                        [Lang.template.robodog_leg4, 4],
                        [Lang.template.robodog_leg5, 5],
                        [Lang.template.robodog_leg6, 6],
                        [Lang.template.robodog_leg7, 7],
                        [Lang.template.robodog_leg8, 8],
                    ],
                    value: 0,
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Block',
                    accept: 'string',
                    value: '0',
                    fontSize: 11,
                },
                {
                    type: 'Block',
                    accept: 'string',
                    value: '0',
                    fontSize: 11,
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'robodog_motor',
            },
            paramsKeyMap: {
                WHAT_LEG: 0,
                MOTOR_DEG0: 1,
                MOTOR_DEG1: 2
            },
            class: 'RoboDog_Action',
            isNotFor: ['RoboDog'],

            func: function(sprite, script) {
                check_cmdInit();
                let what_leg = script.getField('WHAT_LEG', script);
                let motor_deg0 = script.getNumberValue('MOTOR_DEG0', script);
                let motor_deg1 = script.getNumberValue('MOTOR_DEG1', script);
                let cmd = Entry.hw.sendQueue.CMD;
                const pos = [[1, 0, 0, 0],[0, 1, 0, 0],[0, 0, 1, 0],[0, 0, 0, 1],[1, 0, 0, 1],[0, 1, 1, 0],[1, 1, 0, 0],[0, 0, 1, 1],[1, 1, 1, 1]];
                set_option(cmd, 0x03, -127);

                motor_deg0 = motor_deg0>90? 90 : motor_deg0<-90? -90 : motor_deg0;
                motor_deg1 = motor_deg1>70? 70 : motor_deg1<-90? -90 : motor_deg1;

                let _pos = pos[what_leg];
                for(let n=0; n<4; n++){
                    if(_pos[n] == 1){
                        cmd[Entry.RoboDog.Cmd.CMD_LEG0+n*2] = motor_deg0;
                        cmd[Entry.RoboDog.Cmd.CMD_LEG0+n*2+1] = motor_deg1;
                    }
                }

                cmd[Entry.RoboDog.Cmd.CMD_CHECKSUM] = checksum(cmd);
                Entry.hw.update();
                return script.callReturn();
            },
            syntax: { js: [], py: [] },
        },


        robodog_rotation: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.template.robodog_rotation0, 0],
                        [Lang.template.robodog_rotation1, 1],
                    ],
                    value: 0,
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Block',
                    accept: 'string',
                    value: '90',
                    fontSize: 11,
                },
                {
                    type: 'Block',
                    accept: 'string',
                    value: '100',
                    fontSize: 11,
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'robodog_rotation',
            },
            paramsKeyMap: {
                ROT_DIR: 0,
                DEGREE: 1,
                DEG_VEL: 2
            },
            class: 'RoboDog_Action',
            isNotFor: ['RoboDog'],

            func: function(sprite, script) {
                check_cmdInit();
                let rot_dir = script.getField('ROT_DIR', script);
                let degree = script.getNumberValue('DEGREE', script);
                let deg_vel = script.getNumberValue('DEG_VEL', script);
                let cmd = Entry.hw.sendQueue.CMD;

                set_option(cmd, 0x01, 0)

                degree = degree>1000? 1000 : degree<-1000? -1000 : degree;
                deg_vel = deg_vel>100? 100 : deg_vel<10? 10 : deg_vel;
                if(rot_dir == 1)
                    degree = -1*degree;
                cmd[Entry.RoboDog.Cmd.CMD_DEG_VEL] = deg_vel;
                cmd[Entry.RoboDog.Cmd.CMD_DEG_LOW] = degree&0xFF;
                cmd[Entry.RoboDog.Cmd.CMD_DEG_HIGH] = (degree>>8)&0xFF;

                cmd[Entry.RoboDog.Cmd.CMD_CHECKSUM] = checksum(cmd);
                Entry.hw.update();
                return script.callReturn();
            },
            syntax: { js: [], py: [] },
        },


        robodog_servospeed: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.template.robodog_leg0, 0],
                        [Lang.template.robodog_leg1, 1],
                        [Lang.template.robodog_leg2, 2],
                        [Lang.template.robodog_leg3, 3],
                        [Lang.template.robodog_leg4, 4],
                        [Lang.template.robodog_leg5, 5],
                        [Lang.template.robodog_leg6, 6],
                        [Lang.template.robodog_leg7, 7],
                        [Lang.template.robodog_leg8, 8],
                    ],
                    value: 8,
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Block',
                    accept: 'string',
                    value: '50',
                    fontSize: 11,
                },
                {
                    type: 'Block',
                    accept: 'string',
                    value: '50',
                    fontSize: 11,
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'robodog_servospeed',
            },
            paramsKeyMap: {
                WHAT_LEG: 0,
                MOTOR1: 1,
                MOTOR2: 2,
            },
            class: 'RoboDog_Action',
            isNotFor: ['RoboDog'],

            func: function(sprite, script) {
                check_cmdInit();
                let what_leg = script.getField('WHAT_LEG', script);
                let motor1_speed = script.getNumberValue('MOTOR1', script);
                let motor2_speed = script.getNumberValue('MOTOR2', script);
                let cmd = Entry.hw.sendQueue.CMD;
                console.log(typeof motor1_speed + " "+motor1_speed)
                motor1_speed = motor1_speed>100? 100 : motor1_speed<10? 10 : motor1_speed;
                motor2_speed = motor2_speed>100? 100 : motor2_speed<10? 10 : motor2_speed;

                const pos = [[1, 0, 0, 0],[0, 1, 0, 0],[0, 0, 1, 0],[0, 0, 0, 1],[1, 0, 0, 1],[0, 1, 1, 0],[1, 1, 0, 0],[0, 0, 1, 1],[1, 1, 1, 1]];
                let _pos = pos[what_leg];
                for(let n=0; n<4; n++){
                    if(_pos[n] == 1){
                        cmd[Entry.RoboDog.Cmd.CMD_SERVOSPEED_EXT+n*2] = motor1_speed;
                        cmd[Entry.RoboDog.Cmd.CMD_SERVOSPEED_EXT+n*2+1] = motor2_speed;
                    }
                }
                cmd[Entry.RoboDog.Cmd.CMD_CHECKSUM] = checksum(cmd);
                Entry.hw.update();
                return script.callReturn();
            },
            syntax: { js: [], py: [] },
        },


        robodog_headledexp: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.template.robodog_headledexp0, 0],
                        [Lang.template.robodog_headledexp1, 1],
                        [Lang.template.robodog_headledexp2, 2],
                        [Lang.template.robodog_headledexp3, 3],
                        [Lang.template.robodog_headledexp4, 4],
                        [Lang.template.robodog_headledexp5, 5],
                        [Lang.template.robodog_headledexp6, 6],
                        [Lang.template.robodog_headledexp7, 7],
                        [Lang.template.robodog_headledexp8, 8],
                        [Lang.template.robodog_headledexp9, 9],
                        [Lang.template.robodog_headledexp10, 10],
                        [Lang.template.robodog_headledexp11, 11],
                        [Lang.template.robodog_headledexp12, 12],
                        [Lang.template.robodog_headledexp13, 13],
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
            def: {
                params: [null],
                type: 'robodog_headledexp',
            },
            paramsKeyMap: {
                LED_EXP: 0
            },
            class: 'RoboDog_LED',
            isNotFor: ['RoboDog'],

            func: function(sprite, script) {
                check_cmdInit();
                let led_exp = script.getField('LED_EXP', script);
                let cmd = Entry.hw.sendQueue.CMD;
                for (let n=0; n<16; n++)
                    cmd[Entry.RoboDog.Cmd.CMD_LEDDRAW+n] = headLED_Backup[n];

                cmd[Entry.RoboDog.Cmd.CMD_LEDDRAW] = led_exp;
                cmd[Entry.RoboDog.Cmd.CMD_LEDTYPE] = 0x02;
                cmd[Entry.RoboDog.Cmd.CMD_CHECKSUM] = checksum(cmd);

                for (let n=0; n<16; n++)
                    headLED_Backup[n] = cmd[Entry.RoboDog.Cmd.CMD_LEDDRAW+n];
                Entry.hw.update();
                return script.callReturn();
            },
            syntax: { js: [], py: [] },
        },


        robodog_headledprint: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.template.robodog_headledprint0, 0],
                        [Lang.template.robodog_headledprint1, 1],
                    ],
                    value: 0,
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Block',
                    accept: 'string',
                    value: 'A',
                    fontSize: 11,
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'robodog_headledprint',
            },
            paramsKeyMap: {
                WHAT_LED: 0,
                WHAT_CHAR: 1,
            },
            class: 'RoboDog_LED',
            isNotFor: ['RoboDog'],

            func: function(sprite, script) {
                check_cmdInit();
                let what_led = script.getField('WHAT_LED', script);
                let what_char = script.getStringValue('WHAT_CHAR', script);
                let cmd = Entry.hw.sendQueue.CMD;
                
                for (let n=0; n<16; n++)
                    cmd[Entry.RoboDog.Cmd.CMD_LEDDRAW+n] = headLED_Backup[n];

                cmd[Entry.RoboDog.Cmd.CMD_LEDDRAW+what_led*8] = what_char.charCodeAt(0)

                cmd[Entry.RoboDog.Cmd.CMD_LEDTYPE] = 0x03;
                cmd[Entry.RoboDog.Cmd.CMD_CHECKSUM] = checksum(cmd);
                for (let n=0; n<16; n++)
                    headLED_Backup[n] = cmd[Entry.RoboDog.Cmd.CMD_LEDDRAW+n];
                Entry.hw.update();
                return script.callReturn();
            },
            syntax: { js: [], py: [] },
        },


        robodog_bodyled: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ["1~4", 0],
                        ["1", 1],
                        ["2", 2],
                        ["3", 3],
                        ["4", 4],
                    ],
                    value: 0,
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Block',
                    accept: 'string',
                    value: '255',
                    fontSize: 11,
                },
                {
                    type: 'Block',
                    accept: 'string',
                    value: '255',
                    fontSize: 11,
                },
                {
                    type: 'Block',
                    accept: 'string',
                    value: '255',
                    fontSize: 11,
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'robodog_bodyled',
            },
            paramsKeyMap: {
                WHAT_LED: 0,
                RED: 1,
                GREEN: 2,
                BLUE: 3
            },
            class: 'RoboDog_LED',
            isNotFor: ['RoboDog'],

            func: function(sprite, script) {
                check_cmdInit();
                script.get
                let what = script.getField('WHAT_LED', script);
                let red = script.getNumberValue('RED', script);
                let green = script.getNumberValue('GREEN', script);
                let blue = script.getNumberValue('BLUE', script);
                let cmd = Entry.hw.sendQueue.CMD;

                for (let n=0; n<16; n++)
                    cmd[Entry.RoboDog.Cmd.CMD_BODYLED0+n] = bodyLED_Backup[n];

                const pos = [[1, 1, 1, 1], [1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]];
                let _pos = pos[what];

                for(let n=0; n<4; n++){
                    if(_pos[n] == 1){
                        cmd[Entry.RoboDog.Cmd.CMD_BODYLED0+n*4] = red;
                        cmd[Entry.RoboDog.Cmd.CMD_BODYLED0+n*4+1] = green;
                        cmd[Entry.RoboDog.Cmd.CMD_BODYLED0+n*4+2] = blue;
                    }
                }
                cmd[Entry.RoboDog.Cmd.CMD_LEDTYPE] = 0x04;
                cmd[Entry.RoboDog.Cmd.CMD_CHECKSUM] = checksum(cmd);

                for (let n=0; n<16; n++)
                    bodyLED_Backup[n] = cmd[Entry.RoboDog.Cmd.CMD_BODYLED0+n];

                Entry.hw.update();
                return script.callReturn();
            },
            syntax: { js: [], py: [] },
        },



        robodog_mp3play: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.template.robodog_mp3play01, 1],
                        [Lang.template.robodog_mp3play02, 2],
                        [Lang.template.robodog_mp3play03, 3],
                        [Lang.template.robodog_mp3play04, 4],
                        [Lang.template.robodog_mp3play05, 5],
                        [Lang.template.robodog_mp3play11, 11],
                        [Lang.template.robodog_mp3play12, 12],
                        [Lang.template.robodog_mp3play13, 13],
                        [Lang.template.robodog_mp3play14, 14],
                        [Lang.template.robodog_mp3play21, 21],
                        [Lang.template.robodog_mp3play22, 22],
                        [Lang.template.robodog_mp3play23, 23],
                        [Lang.template.robodog_mp3play24, 24],
                        [Lang.template.robodog_mp3play25, 25],
                        [Lang.template.robodog_mp3play26, 26],
                        [Lang.template.robodog_mp3play31, 31],
                        [Lang.template.robodog_mp3play32, 32],
                        [Lang.template.robodog_mp3play33, 33],
                        [Lang.template.robodog_mp3play34, 34],
                        [Lang.template.robodog_mp3play35, 35],
                        [Lang.template.robodog_mp3play36, 36],
                        [Lang.template.robodog_mp3play37, 37],
                        [Lang.template.robodog_mp3play38, 38],
                    ],
                    value: 1,
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.template.robodog_mp3playvol0, 1],
                        [Lang.template.robodog_mp3playvol1, 2],
                        [Lang.template.robodog_mp3playvol2, 3],
                    ],
                    value: 3,
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
                params: [null],
                type: 'robodog_mp3play',
            },
            paramsKeyMap: {
                WHAT_MP3: 0,
                VOLUME: 1,
            },
            class: 'RoboDog_ETC',
            isNotFor: ['RoboDog'],

            func: function(sprite, script) {
                check_cmdInit();
                script.get
                let what_mp3 = script.getField('WHAT_MP3', script);
                let volume = script.getField('VOLUME', script);
                let cmd = Entry.hw.sendQueue.CMD;
                mp3ID = (mp3ID&0x80)==0x80? 0 : 0x80;
                cmd[Entry.RoboDog.Cmd.CMD_MP3TRACK] = what_mp3 | mp3ID;
                cmd[Entry.RoboDog.Cmd.CMD_MP3VOLUME] = volume;
                cmd[Entry.RoboDog.Cmd.CMD_CHECKSUM] = checksum(cmd);

                Entry.hw.update();
                return script.callReturn();
            },
            syntax: { js: [], py: [] },
        },

        robodog_expservo: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                    value: '45',
                    fontSize: 11,
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'robodog_expservo',
            },
            paramsKeyMap: {
                SERVO_DEG: 0,
            },
            class: 'RoboDog_ETC',
            isNotFor: ['RoboDog'],

            func: function(sprite, script) {
                check_cmdInit();
                let servo_deg = script.getNumberValue('SERVO_DEG', script);
                let cmd = Entry.hw.sendQueue.CMD;

                servo_deg = servo_deg>90? 90 : servo_deg<-90? -90 : servo_deg;
                cmd[Entry.RoboDog.Cmd.CMD_EXTSERVO] = servo_deg;

                cmd[Entry.RoboDog.Cmd.CMD_CHECKSUM] = checksum(cmd);
                Entry.hw.update();
                return script.callReturn();
            },
            syntax: { js: [], py: [] },
        },


        robodog_button: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [],
            events: {},
            def: {
                params: [null],
                type: 'robodog_button',
            },
            class: 'RoboDog_Sensor',
            isNotFor: ['RoboDog'],
            func: function(sprite, script) {
                let sensorData = Entry.hw.portData.SENSORDATA;
                return sensorData[Entry.RoboDog.Sensor.SENSOR_BUTTON];
            },
            syntax: { js: [], py: [] },
        },

        robodog_battery: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [],
            events: {},
            def: {
                params: [null],
                type: 'robodog_battery',
            },
            class: 'RoboDog_Sensor',
            isNotFor: ['RoboDog'],
            func: function(sprite, script) {
                let sensorData = Entry.hw.portData.SENSORDATA;
                console.log("battery:" + sensorData[6], " len:"+sensorData.length);
                return sensorData[Entry.RoboDog.Sensor.SENSOR_BATTERY];
            },
            syntax: { js: [], py: [] },
        },
        robodog_getalt: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [],
            events: {},
            def: {
                params: [null],
                type: 'robodog_getalt',
            },
            class: 'RoboDog_Sensor',
            isNotFor: ['RoboDog'],
            func: function(sprite, script) {
                let sensorData = Entry.hw.portData.SENSORDATA;
                console.log("tof:" + sensorData[7], " len:"+sensorData.length);
                return sensorData[Entry.RoboDog.Sensor.SENSOR_TOF];
            },
            syntax: { js: [], py: [] },
        },

        robodog_gettilt: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.template.robodog_tilt0, 0],
                        [Lang.template.robodog_tilt1, 1],
                    ],
                    value: 0,
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'robodog_gettilt',
            },
            class: 'RoboDog_Sensor',
            paramsKeyMap: {
                TILT_DIR: 0,
            },
            isNotFor: ['RoboDog'],
            func: function(sprite, script) {
                let tilt_dir = script.getField('TILT_DIR', script);
                let sensorData = Entry.hw.portData.SENSORDATA;
                console.log("tilt:" + sensorData[Entry.RoboDog.Sensor.SENSOR_TILT_LR], " FB:"+sensorData[Entry.RoboDog.Sensor.SENSOR_TILT_FB]);
                let val = tilt_dir==0? sensorData[Entry.RoboDog.Sensor.SENSOR_TILT_LR] : sensorData[Entry.RoboDog.Sensor.SENSOR_TILT_FB];
                val = val>127? val-256 : val;
                return val;
            },
            syntax: { js: [], py: [] },
        },

        robodog_getrot: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [],
            events: {},
            def: {
                params: [null],
                type: 'robodog_getrot',
            },
            class: 'RoboDog_Sensor',
            isNotFor: ['RoboDog'],
            func: function(sprite, script) {
                let sensorData = Entry.hw.portData.SENSORDATA;
                let yaw = sensorData[Entry.RoboDog.Sensor.SENSOR_YAW_LOW];
                yaw |= (sensorData[Entry.RoboDog.Sensor.SENSOR_YAW_HIGH]<<8); 
                yaw = yaw>0x7FFF? yaw-0x10000 : yaw;
                return yaw;
            },
            syntax: { js: [], py: [] },
        },

        robodog_isrbalive: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [],
            events: {},
            def: {
                params: [null],
                type: 'robodog_isrbalive',
            },
            class: 'RoboDog_Sensor',
            isNotFor: ['RoboDog'],
            func: function(sprite, script) {
                let sensorData = Entry.hw.portData.SENSORDATA;
                return sensorData[Entry.RoboDog.Sensor.SENSOR_RB_WATHDOG];
            },
            syntax: { js: [], py: [] },
        },

        robodog_getrbdata: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ["0", 0],
                        ["1", 1],
                        ["2", 2],
                        ["3", 3],
                    ],
                    value: 0,
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'robodog_getrbdata',
            },
            class: 'RoboDog_Sensor',
            paramsKeyMap: {
                WHAT_RB: 0,
            },
            isNotFor: ['RoboDog'],
            func: function(sprite, script) {
                let what_rb = script.getField('WHAT_RB', script);

                let sensorData = Entry.hw.portData.SENSORDATA;
                let val = sensorData[Entry.RoboDog.Sensor.SENSOR_RB_DATA + what_rb];
                val = val>127? val-256 : val;
                return val;
            },
            syntax: { js: [], py: [] },
        },

        
        robodog_getrbstr: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [],
            events: {},
            def: {
                params: [null],
                type: 'robodog_getrbstr',
            },
            class: 'RoboDog_Sensor',
            isNotFor: ['RoboDog'],
            func: function(sprite, script) {
                let sensorData = Entry.hw.portData.SENSORDATA;
                let tmp = new Int8Array(6)
                for( let n=0; n<4; n++)
                    tmp[n] = sensorData[Entry.RoboDog.Sensor.SENSOR_RB_DATA+n];
                tmp[4] = sensorData[Entry.RoboDog.Sensor.SENSOR_RB_DATA+6];
                tmp[5] = sensorData[Entry.RoboDog.Sensor.SENSOR_RB_DATA+7];

                let stop = 5;
                for(; stop>=0; stop--){
                    if(tmp[stop] != 0)
                        break;
                }
        
                const slicedArray = tmp.slice(0, stop+1);
                const decoder = new TextDecoder();
                return decoder.decode(slicedArray);
            },
            syntax: { js: [], py: [] },
        },
        //endregion RoboDog
    };
};

module.exports = Entry.RoboDog;
