'use strict';
let ack = 1 ;
let count =0;
let lastData = [];
let first = false;
let music ={
    tempo: 100,
}

const distanceError = (2 * 1000 * 0.81) / (3.141592 * 3.2 * 1.25);
// this.runtime = runtime;
const STEPPER_RATE = {
    SLOW: 900,
    NORMAL: 950,
    FAST: 1000,
};

const motion = {
    stepRate: STEPPER_RATE.NORMAL,
    distanceMultiplier: distanceError,
    angleMultiplier: (distanceError * 3.141592 * 5.0 * 1.01 / 360),
};

function countNoteLength(noteId) {
    const noteBPM = [240, 120, 180, 60, 90, 30, 45, 15]; // Beat per miniutes
    return noteBPM[noteId] ? (noteBPM[noteId] / music.tempo) : 2.4; // Duration in seconds
}

function arraysEqual(a, b) {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length !== b.length) return false;

    // If you don't care about the order of the elements inside
    // the array, you should sort both arrays here.
    // Please note that calling sort on an array will modify that array.
    // you might want to clone your array first.

    for (var i = 0; i < a.length; ++i) {
        if (a[i] !== b[i]) return false;
    }
    return true;
}

function getDistanceStepTime(distance){
    let step = (distance * motion.distanceMultiplier / (Math.abs(motion.stepRate) / (Math.abs(motion.stepRate) * -0.01 + 11)))  * 1000;
    return step;
}

function getAngleStepTime(angle){
    let stepTime = (angle * motion.angleMultiplier / (Math.abs(motion.stepRate) / (Math.abs(motion.stepRate) * -0.01 + 11)))  * 1000;
    return stepTime;
}

Entry.GENIBOT = {
    id: '44.1',
    name: 'genibot',
    url: 'https://www.arduino.cc/',
    imageName: 'arduino.png',
    title: {
        ko: '지니봇',
        en: 'Genibot',
    },
    eventState: {
        'BUTTON': false,
    },
    postDelayBlockHandler(script, myfunc) {
        if (myfunc == undefined) {
            return script.callReturn();
        }
        
        if (script.is_start == undefined) {
            script.is_start = true;
            const waitTime = myfunc();
            let today = new Date(); 
            let hours = today.getHours(); // 시
            let minutes = today.getMinutes();  // 분
            let seconds = today.getSeconds();  // 초
            let milliseconds = today.getMilliseconds();

            setTimeout(() => {
                script.is_start = false;
                let today = new Date();   
    
                let hours = today.getHours(); // 시
                let minutes = today.getMinutes();  // 분
                let seconds = today.getSeconds();  // 초
                let milliseconds = today.getMilliseconds();
            }, waitTime);
    
            return script;
        } else if (script.is_start == true) {
            return script;
        } else {
            delete script.is_start;
    
            return script.callReturn();
        }
    },setZero() {

    },
    afterReceive: async function(pd) {
        if(pd['log']){
            const a = pd['log'];
            if(!arraysEqual(a.data,lastData)){
                lastData = a.data;
            }

        }
        if (pd['BUTTON']) {
            Entry.engine.fireEvent('buttonPressed');
        }
        if(pd['LOGGER'] && pd['LOGGER'].list.length > 0){
            console.log("pd['LOGGER']",pd['LOGGER']);
        }
    },
};
const ko = {
    'genibot.speed': '속력을 %1 (으)로 정하기',
    'genibot.moveDistance': '%1 (으)로 %2cm 가기 %3', // "[DIRECTION] (으)로 [DISTANCE]cm 가기"
    'genibot.turnAngle': '%1 으로 %2도 돌기 %3', // "[DIRECTION] 으로 [ANGLE]도 돌기",
    'genibot.motionGoDistance': '%1 속도로 %2cm 가기 %3', //"[VELOCITY] 속도로 [DISTANCE]cm 가기",
    'genibot.motionRotateAngle': '%1 속도로 %2도 돌기 %3', // "[VELOCITY] 속도로 [ANGLE]도 돌기",
    'genibot.startMoving': '왼쪽: %1 오른쪽: %2 속도로 움직이기 %3',//"왼쪽: [VELOCITY1] 오른쪽: [VELOCITY2] 속도로 움직이기"
    'genibot.stopMoving': '멈추기 %1',
    'genibot.move.forward': '앞',
    'genibot.move.backward': '뒤',
    'genibot.rotate.left': '왼쪽',
    'genibot.rotate.right': '오른쪽',
    'genibot.ledColor': '%1 LED 색을 %2 로 나타내기',
    'genibot.ledColorName': '%1 LED 색을 색상: %2 밝기: %3 (으)로 나타내기 %4', //"[LED] LED 색을 색상: [COLOR_NAME] 밝기: [COLOR_BRIGHTNESS] (으)로 나타내기",
    'genibot.ledColor.left': '왼쪽',
    'genibot.ledColor.right': '오른쪽',
    'genibot.ledColor.front': '앞쪽',
    'genibot.ledColor.back': '뒤쪽',
    'genibot.ledColor.all': '모든',
    'genibot.ledColorName.white': '하양',
    'genibot.ledColorName.red': '빨강',
    'genibot.ledColorName.green': '초록',
    'genibot.ledColorName.blue': '파랑',
    'genibot.ledColorName.cyan': '연파랑',
    'genibot.ledColorName.magenta': '분홍',
    'genibot.ledColorName.yellow': '노랑',
    'genibot.ledColorName.violet': '보라',
    'genibot.ledColorName.orange': '오렌지',
    'genibot.ledColorName.springgreen': '연두',
    'genibot.ledColorName.lightpink': '연분홍',
    'genibot.lineFollower': '라인트레이싱 %1 %2', //[ACTION]
    'genibot.lineFollower.start': '시작하기',
    'genibot.lineFollower.stop': '멈추기',
    'genibot.setInstrument': '악기를 %1 (으)로 정하기',
    'genibot.setTempo': '빠르기를 %1 (으)로 정하기',
    'genibot.playNote': '%1 %2 소리내기',
    'genibot.playNoteKey': '%1 %2 소리내기',
    'genibot.setSpeakerVolume': '소리 세기를 %1 (으)로 정하기 %2', // [VOLUME]
    'genibot.acceleration': '가속도 %1 축',
    'genibot.tiltAngle': '기울기',
    'genibot.oidCode': 'OID 코드',
    'genibot.getButtonPressed': '%1 버튼을 눌렀을 때',
    'genibot.steppersSpeed.slow': '느리게',
    'genibot.steppersSpeed.normal': '보통',
    'genibot.steppersSpeed.fast': '빠르게',
    'genibot.instrument.piano': '피아노',
    'genibot.instrument.flute': '플룻',
    'genibot.instrument.string': '기타',
    'genibot.instrument.note.lowTi': '시 (B3)',
    'genibot.instrument.note.do': '도 (C4)',
    'genibot.instrument.note.doSharp': '도#',
    'genibot.instrument.note.re': '레',
    'genibot.instrument.note.reSharp': '레#',
    'genibot.instrument.note.mi': '미',
    'genibot.instrument.note.fa': '파',
    'genibot.instrument.note.faSharp': '파#',
    'genibot.instrument.note.sol': '솔',
    'genibot.instrument.note.solSharp': '솔#',
    'genibot.instrument.note.la': '라',
    'genibot.instrument.note.laSharp': '라#',
    'genibot.instrument.note.ti': '시',
    'genibot.instrument.note.highDo': '도 (C5)',
    'genibot.instrument.note.highDoSharp': '도# (C#5)',
    'genibot.instrument.note.highRe': '레 (D5)',
    'genibot.instrument.note.highReSharp': '레# (D#5)',
    'genibot.instrument.note.highMi': '미 (E5)',
    'genibot.instrument.note.highFa': '파 (F5)',
    'genibot.instrument.beat.whole': '온음표',
    'genibot.instrument.beat.half': '2분음표',
    'genibot.instrument.beat.dottedHalf': '점2분음표',
    'genibot.instrument.beat.quarter': '4분음표',
    'genibot.instrument.beat.dottedQuarter': '점4분음표',
    'genibot.instrument.beat.eight': '8분음표',
    'genibot.instrument.beat.dottedEight': '점8분음표',
    'genibot.instrument.beat.sixteenth': '16분음표',
};
const en = {
    'genibot.speed': 'set speed %1',
    'genibot.moveDistance': 'move [DIRECTION] [DISTANCE]cm',
    'genibot.turnAngle': 'turn [DIRECTION] [ANGLE]degrees',
    'genibot.motionGoDistance': 'go [DISTANCE]cm at velocity of [VELOCITY]',
    'genibot.motionRotateAngle': 'rotate [ANGLE]degrees at velocity of [VELOCITY]',
    'genibot.startMoving': 'start moving at velocity of left: [VELOCITY1] right: [VELOCITY2]',
    'genibot.stopMoving': 'stop moving',
    'genibot.move.forward': 'front',
    'genibot.move.backward': 'back',
    'genibot.rotate.left': 'left',
    'genibot.rotate.right': 'right',
    'genibot.ledColor': 'set %1 led color to %2',
    'genibot.ledColorName': 'set [LED] led color to hue: [COLOR_NAME] brightness: [COLOR_BRIGHTNESS]',
    'genibot.ledColor.left': 'left',
    'genibot.ledColor.right': 'right',
    'genibot.ledColor.front': 'front',
    'genibot.ledColor.back': 'back',
    'genibot.ledColor.all': 'all',
    'genibot.ledColorName.white': 'white',
    'genibot.ledColorName.red': 'red',
    'genibot.ledColorName.green': 'green',
    'genibot.ledColorName.blue': 'blue',
    'genibot.ledColorName.cyan': 'cyan',
    'genibot.ledColorName.magenta': 'magenta',
    'genibot.ledColorName.yellow': 'yellow',
    'genibot.ledColorName.violet': 'violet',
    'genibot.ledColorName.orange': 'orange',
    'genibot.ledColorName.springgreen': 'spring green',
    'genibot.ledColorName.lightpink': 'light pink',
    'genibot.lineFollower': '[ACTION] line follower',
    'genibot.lineFollower.start': 'start',
    'genibot.lineFollower.stop': 'stop',
    'genibot.setInstrument': 'set instrument to [INSTRUMENT]',
    'genibot.setTempo': 'set tempo to [TEMPO]',
    'genibot.playNote': 'play %1 note %2',//'play [BEATS] note [NOTE]',
    'genibot.playNoteKey': 'play %1 note %2', // "play [BEATS] note [NOTE]"
    'genibot.setSpeakerVolume': 'set speaker volume to [VOLUME]',
    'genibot.acceleration': 'acceleration of %1 axis',
    'genibot.tiltAngle': 'tilt angle',
    'genibot.oidCode': 'oid code',
    'genibot.getButtonPressed': 'when button pressed',
    'genibot.steppersSpeed.slow': 'slow',
    'genibot.steppersSpeed.normal': 'normal',
    'genibot.steppersSpeed.fast': 'fast',
    'genibot.instrument.piano': 'piano',
    'genibot.instrument.flute': 'flute',
    'genibot.instrument.string': 'string',
    'genibot.instrument.note.lowTi': 'Ti (B3)',
    'genibot.instrument.note.do': 'Do (C4)',
    'genibot.instrument.note.doSharp': 'DO#',
    'genibot.instrument.note.re': 'Re',
    'genibot.instrument.note.reSharp': 'Re#',
    'genibot.instrument.note.mi': 'Mi',
    'genibot.instrument.note.fa': 'Fa',
    'genibot.instrument.note.faSharp': 'Fa#',
    'genibot.instrument.note.sol': 'Sol',
    'genibot.instrument.note.solSharp': 'Sol#',
    'genibot.instrument.note.la': 'La',
    'genibot.instrument.note.laSharp': 'La#',
    'genibot.instrument.note.ti': 'Ti',
    'genibot.instrument.note.highDo': 'Do (C5)',
    'genibot.instrument.note.highDoSharp': 'DO# (C#5)',
    'genibot.instrument.note.highRe': 'Re (D5)',
    'genibot.instrument.note.highReSharp': 'Re# (D#5)',
    'genibot.instrument.note.highMi': 'Mi (E5)',
    'genibot.instrument.note.highFa': 'Fa (F5)',

    'genibot.instrument.note.code.lowTi': 'lowTi',
    'genibot.instrument.note.code.do': 'do',
    'genibot.instrument.note.code.doSharp': 'doSharp',
    'genibot.instrument.note.code.re': 're',
    'genibot.instrument.note.code.reSharp': 'reSharp',
    'genibot.instrument.note.code.mi': 'mi',
    'genibot.instrument.note.code.fa': 'fa',
    'genibot.instrument.note.code.faSharp': 'faSharp',
    'genibot.instrument.note.code.sol': 'sol',
    'genibot.instrument.note.code.solSharp': 'solSharp',
    'genibot.instrument.note.code.la': 'la',
    'genibot.instrument.note.code.laSharp': 'laSharp',
    'genibot.instrument.note.code.ti': 'ti',
    'genibot.instrument.note.code.highDo': 'highDo',
    'genibot.instrument.note.code.highDoSharp': 'highDoSharp',
    'genibot.instrument.note.code.highRe': 'highRe',
    'genibot.instrument.note.code.highReSharp': 'highReSharp',
    'genibot.instrument.note.code.highMi': 'highMi',
    'genibot.instrument.note.code.highFa': 'highFa',
    'genibot.instrument.beat.whole': 'whole',
    'genibot.instrument.beat.half': 'half',
    'genibot.instrument.beat.dottedHalf': 'dottedHalf',
    'genibot.instrument.beat.quarter': 'quarter',
    'genibot.instrument.beat.dottedQuarter': 'dottedQuarter',
    'genibot.instrument.beat.eight': 'eight',
    'genibot.instrument.beat.dottedEight': 'dottedEight',
    'genibot.instrument.beat.sixteenth': 'sixteenth',
};
Entry.GENIBOT.setLanguage = function() {
    return {
        ko: {
            template: {
                getButtonPressed: ko['genibot.getButtonPressed'],
                setRobotSpeedItem: ko['genibot.speed'],
                moveDistance: ko['genibot.moveDistance'],
                turnAngle: ko['genibot.turnAngle'],
                startMoving: ko['genibot.startMoving'],
                stopMoving: ko['genibot.stopMoving'],
                motionGoDistance: ko['genibot.motionGoDistance'],
                motionRotateAngle: ko['genibot.motionRotateAngle'],
                startLineFollower: ko['genibot.lineFollower'],
                setLedColor: ko['genibot.ledColor'],
                setLedColorName: ko['genibot.ledColorName'],
                setSpeakerVolume: ko['genibot.setSpeakerVolume'],
                setTempo: ko['genibot.setTempo'],
                setInstrument: ko['genibot.setInstrument'],
                playNote: ko['genibot.playNote'],
                playNoteKey: ko['genibot.playNoteKey'],
                getAcceleration: ko['genibot.acceleration'],
                getTilt: ko['genibot.tiltAngle'],
                getOidCode: ko['genibot.oidCode'],
            },
        },
        en: {
            template: {
                getButtonPressed: en['genibot.getButtonPressed'],
                setRobotSpeedItem: en['genibot.speed'],
                moveDistance: en['genibot.moveDistance'],
                turnAngle: en['genibot.turnAngle'],
                startMoving: en['genibot.startMoving'],
                stopMoving: en['genibot.stopMoving'],
                motionGoDistance: en['genibot.motionGoDistance'],
                motionRotateAngle: en['genibot.motionRotateAngle'],
                startLineFollower: en['genibot.lineFollower'],
                setLedColor: en['genibot.ledColor'],
                setLedColorName: en['genibot.ledColorName'],
                setSpeakerVolume: en['genibot.setSpeakerVolume'],
                setTempo: en['genibot.setTempo'],
                setInstrument: en['genibot.setInstrument'],
                playNote: en['genibot.playNote'],
                playNoteKey: en['genibot.playNoteKey'],
                getAcceleration: en['genibot.acceleration'],
                getTilt: en['genibot.tiltAngle'],
                getOidCode: en['genibot.oidCode'],
            },
        },
    };
};

Entry.GENIBOT.blockMenuBlocks = [
    'getButtonPressed',
    'setRobotSpeedItem',
    'moveDistance',
    'turnAngle',
    'startMoving',
    'stopMoving',
    'motionGoDistance',
    'motionRotateAngle',
    'startLineFollower',
    'setLedColor',
    'setLedColorName',
    'setSpeakerVolume',
    'setTempo',
    'setInstrument',
    'playNote',
    'playNoteKey',
    'getAcceleration',
    'getTilt',
    'getOidCode',
];



Entry.GENIBOT.getBlocks = function() {
    return {
        //region arduino 아두이노
        getButtonPressed: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_event',
            // skeleton: 'basic_boolean_field',
            statements: [],
            params: [
                {
                    type: 'Indicator',
                    img: 'block_icon/genibot_icon.png',
                    size: 14,
                    position: {
                        x: 0,
                        y: -2,
                    },
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'getButtonPressed',
            },
            paramsKeyMap: {},
            class: 'geni_input',
            isNotFor: ['genibot'],
            func(sprite, script) {
                var portData = Entry.hw.portData['BUTTON'];
                
                if (portData) {
                    portData = '0';
                    return script.callReturn();
                } else {
                    return false;
                }
            },
            event: 'buttonPressed',
        },
        setRobotSpeedItem: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [ko['genibot.steppersSpeed.slow'], en['genibot.steppersSpeed.slow']],
                        [ko['genibot.steppersSpeed.normal'], en['genibot.steppersSpeed.normal']],
                        [ko['genibot.steppersSpeed.fast'], en['genibot.steppersSpeed.fast']],
                    ],
                    value: en['genibot.steppersSpeed.normal'],
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
                type: 'setRobotSpeedItem',
            },
            paramsKeyMap: {
                SPEED: 0,
            },

            class: 'geni_output',
            isNotFor:['genibot'],
            func(sprite, script) {
                return Entry.GENIBOT.postDelayBlockHandler(script, () => {
                    const speed = script.getStringField('SPEED', script);
                    if (speed) {
                        Entry.hw.sendQueue.SET_ROBOT_SPEED_ITEM = {
                            'SPEED': speed,
                            'ACK': ack++,
                        };
                        Entry.hw.update();
                    }
                    let speedInt = STEPPER_RATE.NORMAL;
                    switch (speed) {
                        case 'slow':
                            speedInt = STEPPER_RATE.SLOW;
                            break;
                        case 'normal':
                            speedInt = STEPPER_RATE.NORMAL;
                            break;
                        case 'fast':
                            speedInt = STEPPER_RATE.FAST;
                            break;
                    }
                    motion.stepRate = speedInt;
                    return 100;
                });
            }
        },
        moveDistance: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [ko['genibot.move.forward'], en['genibot.move.forward']],
                        [ko['genibot.move.backward'], en['genibot.move.backward']],
                    ],
                    value: en['genibot.move.forward'],
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
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
                    value: '6',
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
                type: 'moveDistance',
            },
            paramsKeyMap: {
                DIRECTION: 0,
                DISTANCE: 1,
            },

            class: 'geni_output',
            isNotFor:['genibot'],
            func(sprite, script){
                return Entry.GENIBOT.postDelayBlockHandler(script, () => {
                    const direction = script.getStringField('DIRECTION', script);
                    const distance = script.getStringField('DISTANCE', script);
                  
                    if (direction && distance) {
                        Entry.hw.sendQueue.MOVE_DISTANCE = {
                            'DIRECTION': direction,
                            'DISTANCE': distance,
                            'ACK': ack++,
                        };
                        Entry.hw.update();
                    }
    
                    let stepRate =  motion.stepRate;
                    if (direction == 'front') {
                        stepRate *= 1;
                    } else {
                        stepRate *= -1;
                    }
                    const waitTime = getDistanceStepTime(distance);
                    return waitTime;
                });
            }
        },
        turnAngle: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [ko['genibot.rotate.left'], en['genibot.rotate.left']],
                        [ko['genibot.rotate.right'], en['genibot.rotate.right']],
                    ],
                    value: en['genibot.rotate.right'],
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        ['180', '180'],
                        ['120', '120'],
                        ['90', '90'],
                        ['60', '60'],
                        ['45', '45'],
                        ['30', '30'],
                        ['15', '15'],
                    ],
                    value: '90',
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
                type: 'turnAngle',
            },
            paramsKeyMap: {
                DIRECTION: 0,
                ANGLE: 1,
            },

            class: 'geni_output',
            isNotFor:['genibot'],
            func(sprite, script) {
                return Entry.GENIBOT.postDelayBlockHandler(script, () => {
                    const direction = script.getStringField('DIRECTION', script);
                    const angle = script.getStringField('ANGLE', script);
                
                    if (direction && angle) {
                        Entry.hw.sendQueue.TURN_ANGLE = {
                            'DIRECTION': direction,
                            'ANGLE': angle,
                            'ACK': ack++,
                        };
                        Entry.hw.update();
                    }
                    return getAngleStepTime(angle);
                });
            }
        },
        startMoving: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['-5', '-5'],
                        ['-4', '-4'],
                        ['-3', '-3'],
                        ['-2', '-2'],
                        ['-1', '-1'],
                        ['0', '0'],
                        ['1', '1'],
                        ['2', '2'],
                        ['3', '3'],
                        ['4', '4'],
                        ['5', '5'],
                    ],
                    value: '5',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        ['-5', '-5'],
                        ['-4', '-4'],
                        ['-3', '-3'],
                        ['-2', '-2'],
                        ['-1', '-1'],
                        ['0', '0'],
                        ['1', '1'],
                        ['2', '2'],
                        ['3', '3'],
                        ['4', '4'],
                        ['5', '5'],
                    ],
                    value: '5',
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
                type: 'startMoving',
            },
            paramsKeyMap: {
                VELOCITY1: 0,
                VELOCITY2: 1,
            },

            class: 'geni_output',
            isNotFor:['genibot'],
            func(sprite, script) {
                return Entry.GENIBOT.postDelayBlockHandler(script, () => {
                    const VELOCITY1 = script.getStringField('VELOCITY1', script);
                    const VELOCITY2 = script.getStringField('VELOCITY2', script);
                    if (VELOCITY1 && VELOCITY2) {
                        Entry.hw.sendQueue.START_MOVING = {
                            'VELOCITY1': VELOCITY1,
                            'VELOCITY2': VELOCITY2,
                            'ACK': ack++,
                        };
                        Entry.hw.update();
                    }
                    return 100;
                });
            }
        },
        stopMoving: {
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
                params: [],
                type: 'stopMoving',
            },
            paramsKeyMap: {},

            class: 'geni_output',
            isNotFor:['genibot'],
            func(sprite, script) {
                return Entry.GENIBOT.postDelayBlockHandler(script, () => {
                    Entry.hw.sendQueue.STOP_MOVING = {
                        'ACK': ack++,
                    };
                    Entry.hw.update();
                    return 100;
                });
            }
        },
        motionGoDistance: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['-5', '-5'],
                        ['-4', '-4'],
                        ['-3', '-3'],
                        ['-2', '-2'],
                        ['-1', '-1'],
                        ['0', '0'],
                        ['1', '1'],
                        ['2', '2'],
                        ['3', '3'],
                        ['4', '4'],
                        ['5', '5'],
                    ],
                    value: '5',
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
                params: [null,
                    {
                        type: 'number',
                        params: ['0~30'],
                    },
                ],
                type: 'motionGoDistance',
            },
            paramsKeyMap: {
                VELOCITY: 0,
                DISTANCE: 1,
            },

            class: 'geni_output',
            isNotFor:['genibot'],
            func(sprite, script) {
                return Entry.GENIBOT.postDelayBlockHandler(script, () => {
     
                    const VELOCITY = script.getStringField('VELOCITY', script);
                    const DISTANCE_ANY = script.getValue('DISTANCE')
                    const DISTANCE = script.getNumberValue('DISTANCE')//Field('DISTANCE', script);

                    if(isNaN(String(DISTANCE_ANY)) || Number(DISTANCE) < 0 || Number(DISTANCE)>30) {
                        alert("0~30 사이에 값만 입력할수 있습니다.")
                        throw "error"
                    }
                    if (VELOCITY && DISTANCE) {
                        Entry.hw.sendQueue.MOTION_GO_DISTANCE = {
                            'VELOCITY': VELOCITY,
                            'DISTANCE': DISTANCE,
                            'ACK': ack++,
                        };
                        Entry.hw.update();
                    }
                    return getDistanceStepTime(DISTANCE);
                });
            },
        },
        motionRotateAngle: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['-5', '-5'],
                        ['-4', '-4'],
                        ['-3', '-3'],
                        ['-2', '-2'],
                        ['-1', '-1'],
                        ['0', '0'],
                        ['1', '1'],
                        ['2', '2'],
                        ['3', '3'],
                        ['4', '4'],
                        ['5', '5'],
                    ],
                    value: '5',
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
                params: [null,
                    {
                        type: 'number',
                        params: ['0~360'],
                    },
                ],
                type: 'motionRotateAngle',
            },
            paramsKeyMap: {
                VELOCITY: 0,
                ANGLE: 1,
            },

            class: 'geni_output',
            isNotFor:['genibot'],
            func(sprite, script) {
                return Entry.GENIBOT.postDelayBlockHandler(script, () => {
         
                    const VELOCITY = script.getStringField('VELOCITY', script);
                    const ANGLE_ANY = script.getValue('ANGLE')
                    const ANGLE = script.getNumberValue('ANGLE', script);

                    if(isNaN(ANGLE_ANY) || Number(ANGLE) < 0 || Number(ANGLE) > 360){
                        alert("0~360 사이에 값만 입력할수 있습니다.");
                        throw 'error'
                    }
                    if (VELOCITY && ANGLE) {
                        Entry.hw.sendQueue.MOTION_ROTATE_ANGLE = {
                            'VELOCITY': VELOCITY,
                            'ANGLE': ANGLE,
                            'ACK': ack++,
                        };
                        Entry.hw.update();
                    }
                    return getAngleStepTime(ANGLE);
                });
            },
        },
        startLineFollower: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [ko['genibot.lineFollower.start'], en['genibot.lineFollower.start']],
                        [ko['genibot.lineFollower.stop'], en['genibot.lineFollower.stop']],
                    ],
                    value: en['genibot.lineFollower.start'],
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
                type: 'startLineFollower',
            },
            paramsKeyMap: {
                ACTION: 0,
            },

            class: 'geni_output',
            isNotFor:['genibot'],
            func(sprite, script){
                return Entry.GENIBOT.postDelayBlockHandler(script, () => {
                    const ACTION = script.getStringField('ACTION', script);
                    // const speed = script.getStringField('SPEED',script);
                    if (ACTION) {
                        Entry.hw.sendQueue.START_LINE_FOLLOWER = {
                            'ACTION': ACTION,
                            'ACK': ack++,
                        };
                        Entry.hw.update();
                    }
                    return 100;
                });
            },
        },
        setLedColor: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [ko['genibot.ledColor.left'], en['genibot.ledColor.left']],
                        [ko['genibot.ledColor.right'], en['genibot.ledColor.right']],
                        [ko['genibot.ledColor.front'], en['genibot.ledColor.front']],
                        [ko['genibot.ledColor.back'], en['genibot.ledColor.back']],
                        [ko['genibot.ledColor.all'], en['genibot.ledColor.all']],
                    ],
                    value: en['genibot.ledColor.all'],
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Color',
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
                type: 'setLedColor',
            },
            paramsKeyMap: {
                SIDE: 0,
                COLOR: 1,
            },

            class: 'geni_output',
            isNotFor:['genibot'],
            func(sprite, script) {
                return Entry.GENIBOT.postDelayBlockHandler(script, () => {
                    const side = script.getStringField('SIDE', script);
                    let ledId = 0xff;
                    switch (side) {
                        case en['genibot.ledColor.left']:
                            ledId = 0x02;
                            break;
                        case en['genibot.ledColor.right']:
                            ledId = 0x00;
                            break;
                        case en['genibot.ledColor.front']:
                            ledId = 0x03;
                            break;
                        case en['genibot.ledColor.back']:
                            ledId = 0x01;
                            break;
                        default:
                            ledId = 0xff;
                    }
                    const color = script.getStringField('COLOR', script);
                    const rgb = Entry.hex2rgb(color);

                    Entry.hw.sendQueue.SET_LED_COLOR = {
                        'SIDE': ledId,
                        'COLOR': [rgb.r, rgb.g, rgb.b],
                        'ACK': ack++,
                    };
                    Entry.hw.update();
                    return 100;
                });
            },

        },
        setLedColorName: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [ko['genibot.ledColor.left'], en['genibot.ledColor.left']],
                        [ko['genibot.ledColor.right'], en['genibot.ledColor.right']],
                        [ko['genibot.ledColor.front'], en['genibot.ledColor.front']],
                        [ko['genibot.ledColor.back'], en['genibot.ledColor.back']],
                        [ko['genibot.ledColor.all'], en['genibot.ledColor.all']],
                    ],
                    value: en['genibot.ledColor.all'],
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [ko['genibot.ledColorName.white'], en['genibot.ledColorName.white']],
                        [ko['genibot.ledColorName.red'], en['genibot.ledColorName.red']],
                        [ko['genibot.ledColorName.green'], en['genibot.ledColorName.green']],
                        [ko['genibot.ledColorName.blue'], en['genibot.ledColorName.blue']],
                        [ko['genibot.ledColorName.cyan'], en['genibot.ledColorName.cyan']],
                        [ko['genibot.ledColorName.magenta'], en['genibot.ledColorName.magenta']],
                        [ko['genibot.ledColorName.yellow'], en['genibot.ledColorName.yellow']],
                        [ko['genibot.ledColorName.violet'], en['genibot.ledColorName.violet']],
                        [ko['genibot.ledColorName.orange'], en['genibot.ledColorName.orange']],
                        [ko['genibot.ledColorName.springgreen'], en['genibot.ledColorName.springgreen']],
                        [ko['genibot.ledColorName.lightpink'], en['genibot.ledColorName.lightpink']],
                    ],
                    value: en['genibot.ledColorName.white'],
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [['1','1'],
                        ['2','2'],
                        ['3','3'],
                        ['4','4'],
                        ['5','5'],
                        ['6','6'],
                        ['7','7'],
                        ['8','8'],
                        ['9','9'],
                        ['10','10'],
                        ['11','11'],
                        ['12','12'],
                        ['13','13'],
                        ['14','14'],
                        ['15','15'],
                        ['16','16'],
                        ['17','17'],
                        ['18','18'],
                        ['19','19'],
                        ['20','20'],
                        ['21','21'],
                        ['22','22'],
                        ['23','23'],
                        ['24','24'],
                        ['25','25'],
                        ['26','26'],
                        ['27','27'],
                        ['28','28'],
                        ['29','29'],
                        ['30','30'],
                        ['31','31'],
                        ['32','32'],
                        ['33','33'],
                        ['34','34'],
                        ['35','35'],
                        ['36','36'],
                        ['37','37'],
                        ['38','38'],
                        ['39','39'],
                        ['40','40'],
                        ['41','41'],
                        ['42','42'],
                        ['43','43'],
                        ['44','44'],
                        ['45','45'],
                        ['46','46'],
                        ['47','47'],
                        ['48','48'],
                        ['49','49'],
                        ['50','50'],
                        ['51','51'],
                        ['52','52'],
                        ['53','53'],
                        ['54','54'],
                        ['55','55'],
                        ['56','56'],
                        ['57','57'],
                        ['58','58'],
                        ['59','59'],
                        ['60','60'],
                        ['61','61'],
                        ['62','62'],
                        ['63','63'],
                        ['64','64'],
                        ['65','65'],
                        ['66','66'],
                        ['67','67'],
                        ['68','68'],
                        ['69','69'],
                        ['70','70'],
                        ['71','71'],
                        ['72','72'],
                        ['73','73'],
                        ['74','74'],
                        ['75','75'],
                        ['76','76'],
                        ['77','77'],
                        ['78','78'],
                        ['79','79'],
                        ['80','80'],
                        ['81','81'],
                        ['82','82'],
                        ['83','83'],
                        ['84','84'],
                        ['85','85'],
                        ['86','86'],
                        ['87','87'],
                        ['88','88'],
                        ['89','89'],
                        ['90','90'],
                        ['91','91'],
                        ['92','92'],
                        ['93','93'],
                        ['94','94'],
                        ['95','95'],
                        ['96','96'],
                        ['97','97'],
                        ['98','98'],
                        ['99','99'],
                        ['100','100'],
                    ],
                    value: '100',
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
                type: 'setLedColorName',
            },
            paramsKeyMap: {
                SIDE: 0,
                COLOR: 1,
                COLOR_BRIGHTNESS: 2,
            },

            class: 'geni_output',
            isNotFor:['genibot'],
            func(sprite, script) {
                return Entry.GENIBOT.postDelayBlockHandler(script, () => {
                    const SIDE = script.getStringField('SIDE', script);
                    const COLOR = script.getStringField('COLOR', script);
                    const COLOR_BRIGHTNESS = script.getStringField('COLOR_BRIGHTNESS', script);
                    
                    if (SIDE && COLOR && COLOR_BRIGHTNESS) {
                        

                        Entry.hw.sendQueue.SET_LED_COLOR_NAME = {
                            'LED': SIDE,
                            'COLOR_NAME': COLOR,
                            'COLOR_BRIGHTNESS': Number(COLOR_BRIGHTNESS),
                            'ACK': ack++,
                        };
                        Entry.hw.update();
                    }
                    return 100;
                });
            }
        },
        setSpeakerVolume: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
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
                    ],
                    value: '10',
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
                type: 'setSpeakerVolume',
            },
            paramsKeyMap: {
                VOLUME: 0,
            },

            class: 'geni_output',
            isNotFor:['genibot'],
            func(sprite, script) {
                return Entry.GENIBOT.postDelayBlockHandler(script, () => {
                    const VOLUME = script.getStringField('VOLUME', script);
                    if (VOLUME) {
                        Entry.hw.sendQueue.SET_SPEAKER_VOLUME = {
                            'VOLUME': VOLUME,
                            'ACK': ack++,
                        };
                        Entry.hw.update();
                    }
                    return 100;
                });
            }
        },
        setTempo: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
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
            def: {
                params: [
                    {
                        type: 'number',
                        params: ['100'],
                    },
                ],
                type: 'setTempo',
            },
            paramsKeyMap: {
                TEMPO: 0,
            },

            class: 'geni_output',
            isNotFor:['genibot'],
            func(sprite, script) {
                return Entry.GENIBOT.postDelayBlockHandler(script, () => {
                    const TEMPO = script.getNumberValue('TEMPO', script);
                    if (TEMPO) {
                        Entry.hw.sendQueue.SET_TEMPO = {
                            'TEMPO': TEMPO,
                            'ACK': ack++,
                        };
                        Entry.hw.update();
                    }
                    music.tempo = TEMPO;
                    return 100;
                });
            }
        },
        setInstrument: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [ko['genibot.instrument.piano'], en['genibot.instrument.piano']],
                        [ko['genibot.instrument.flute'], en['genibot.instrument.flute']],
                        [ko['genibot.instrument.string'], en['genibot.instrument.string']],
                    ],
                    value: en['genibot.instrument.piano'],
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
                ],
                type: 'setInstrument',
            },
            paramsKeyMap: {
                INSTRUMENT: 0,
            },
            class: 'geni_output',
            isNotFor:['genibot'],
            func(sprite, script) {
                return Entry.GENIBOT.postDelayBlockHandler(script, () => {
                    const INSTRUMENT = script.getStringField('INSTRUMENT', script);
                    if (INSTRUMENT) {          
                        Entry.hw.sendQueue.SET_INSTRUMENT = {
                            'INSTRUMENT': INSTRUMENT,
                            'ACK': ack++,
                        };
                        Entry.hw.update();

                    }
                    return 100;
                });
            }

        },
        playNote: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [ko['genibot.instrument.beat.whole'], en['genibot.instrument.beat.whole']],
                        [ko['genibot.instrument.beat.half'], en['genibot.instrument.beat.half']],
                        [ko['genibot.instrument.beat.dottedHalf'], en['genibot.instrument.beat.dottedHalf']],
                        [ko['genibot.instrument.beat.quarter'], en['genibot.instrument.beat.quarter']],
                        [ko['genibot.instrument.beat.dottedQuarter'], en['genibot.instrument.beat.dottedQuarter']],
                        [ko['genibot.instrument.beat.eight'], en['genibot.instrument.beat.eight']],
                        [ko['genibot.instrument.beat.dottedEight'], en['genibot.instrument.beat.dottedEight']],
                        [ko['genibot.instrument.beat.sixteenth'], en['genibot.instrument.beat.sixteenth']],
                    ],
                    value: en['genibot.instrument.beat.whole'],
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                }, {
                    type: 'Dropdown',
                    options: [
                        [ko['genibot.instrument.note.lowTi'], en['genibot.instrument.note.code.lowTi']],
                        [ko['genibot.instrument.note.do'], en['genibot.instrument.note.code.do']],
                        [ko['genibot.instrument.note.doSharp'], en['genibot.instrument.note.code.doSharp']],
                        [ko['genibot.instrument.note.re'], en['genibot.instrument.note.code.re']],
                        [ko['genibot.instrument.note.reSharp'], en['genibot.instrument.note.code.reSharp']],
                        [ko['genibot.instrument.note.mi'], en['genibot.instrument.note.code.mi']],
                        [ko['genibot.instrument.note.fa'], en['genibot.instrument.note.code.fa']],
                        [ko['genibot.instrument.note.faSharp'], en['genibot.instrument.note.code.faSharp']],
                        [ko['genibot.instrument.note.sol'], en['genibot.instrument.note.code.sol']],
                        [ko['genibot.instrument.note.solSharp'], en['genibot.instrument.note.code.solSharp']],
                        [ko['genibot.instrument.note.la'], en['genibot.instrument.note.code.la']],
                        [ko['genibot.instrument.note.laSharp'], en['genibot.instrument.note.code.laSharp']],
                        [ko['genibot.instrument.note.ti'], en['genibot.instrument.note.code.ti']],
                        [ko['genibot.instrument.note.highDo'], en['genibot.instrument.note.code.highDo']],
                        [ko['genibot.instrument.note.highDoSharp'], en['genibot.instrument.note.code.highDoSharp']],
                        [ko['genibot.instrument.note.highRe'], en['genibot.instrument.note.code.highRe']],
                        [ko['genibot.instrument.note.highReSharp'], en['genibot.instrument.note.code.highReSharp']],
                        [ko['genibot.instrument.note.highMi'], en['genibot.instrument.note.code.highMi']],
                        [ko['genibot.instrument.note.highFa'], en['genibot.instrument.note.code.highFa']],
                    ],
                    value: en['genibot.instrument.note.code.lowTi'],
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
                    null, null,
                ],
                type: 'playNote',
            },
            paramsKeyMap: {
                BEATS: 0,
                NOTE: 1,
            },
            class: 'geni_output',
            isNotFor:['genibot'],
            func(sprite, script) {
                return Entry.GENIBOT.postDelayBlockHandler(script, () => {
                    const BEATS = script.getStringField('BEATS', script);
                    const NOTE = script.getStringField('NOTE', script);
                    const noteLabel = ['whole', 'half', 'dottedHalf', 'quarter', 'dottedQuarter', 'eight', 'dottedEight', 'sixteenth'];
                    const noteId = noteLabel.findIndex(element => element === BEATS);

                    if (BEATS && NOTE) {
                        Entry.hw.sendQueue.PLAY_NOTE = {
                            'BEATS': BEATS,
                            'NOTE': NOTE,
                            'ACK': ack++,
                        };
                        Entry.hw.update();
                    }
                    return (countNoteLength(noteId) * 1000)+100;
                });
            }
        },
        getAcceleration: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [['x', 'x'], ['y', 'y'], ['z', 'z']],
                    value: 'x',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'getAcceleration',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'geni_input',
            isNotFor: ['genibot'],
            func(sprite, script){
                let port = script.getStringField('PORT');
                const ACC_TILT = Entry.hw.getDigitalPortValue('ACC_TILT');
                const value = ACC_TILT['a' + port.toUpperCase()];

                return value || 0;
            },
        },
        getTilt: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [],
            events: {},
            def: {
                params: [],
                type: 'getTilt',
            },
            paramsKeyMap: {},
            class: 'geni_input',
            isNotFor: ['genibot'],
            func: function(sprite, script) {
                const ACC_TILT = Entry.hw.getDigitalPortValue('ACC_TILT');
                const tilt = ACC_TILT['tilt'];
                const tiltStatusKo = {'3':'위', '-3':'아래', '1':'오른쪽', '-1':'왼쪽', '2':'앞', '-2':'뒤'};
                
                return tiltStatusKo[tilt] || "0";
            },
        },
        getOidCode: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {},
            ],
            events: {},
            def: {
                params: [],
                type: 'getOidCode',
            },
            paramsKeyMap: {},
            class: 'geni_input',
            isNotFor: ['genibot'],
            func: function(sprite, script) {
                var OIDCODE = Entry.hw.getDigitalPortValue('OIDCODE');
                const ROBOT_VERSION = Entry.hw.getDigitalPortValue('ROBOT_VERSION');
                if(OIDCODE == 65535){
                    OIDCODE = -1;
                    if(ROBOT_VERSION < 8){
                        OIDCODE = -8;
                    }
                }
                return OIDCODE;
            },
        },
    };
};

module.exports = Entry.GENIBOT;
