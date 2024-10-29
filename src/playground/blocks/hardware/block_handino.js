'use strict';
const SERVO_PIN_NUMBERS = [12, 10, 9, 6, 2];
const HAND_MAX_ANGLE = 165;
const HAND_HALF_ANGLE = 60;
const HAND_MIN_ANGLE = 0;
const HAND_DELAY = 1000;
const HAND_TYPE = {
    ROCK: 0,
    PAPER: 1,
    SCISSORS: 2,
    GESTURE_THUMBSUP: 3,
    GESTURE_PEACE: 4,
    GESTURE_PROMISE: 5,
    GESTURE_V: 6,
    LANGUAGE_ㄱ:7,
    LANGUAGE_ㄴ:8,
    LANGUAGE_ㄷ:9,
    LANGUAGE_ㄹ:10,
    LANGUAGE_ㅁ:11,
    LANGUAGE_ㅂ:12,
    LANGUAGE_ㅅ:13,
    LANGUAGE_ㅇ:14,
    LANGUAGE_ㅈ:15,
    LANGUAGE_ㅊ:16,
    LANGUAGE_ㅋ:17,
    LANGUAGE_ㅌ:18,
    LANGUAGE_ㅍ:19,
    LANGUAGE_ㅎ:20,
};

function Lerp(a, b, t) {
    return (1 - t) * a + b * t;
}

function sleep(ms) {
    return new Promise((r) => setTimeout(r, ms));
  }

function setFinger(idx, angle)
{
    Entry.hw.sendQueue.SET[SERVO_PIN_NUMBERS[idx]] = {
        type: Entry.ArduinoZin.sensorTypes.SERVO_PIN,
        data: angle,
        time: new Date().getTime(),
    };
}

function setFingerDuration(idx, startAngle, targetAngle, duration)
{
    var delayTime = duration*1000;
    let func = (i, maxIdx) => {
        sleep(i).then(() => {
            setFinger(idx, Lerp(startAngle, targetAngle, i/maxIdx));                                
        });
    };
       
    for (var i = 0; i <= delayTime; i+=delayTime/100)
    {
        func(i, delayTime);
    }
}

function setHandType(type)
{
    switch (type)
    {
        case HAND_TYPE.ROCK:
            {
                setFinger(0, HAND_MIN_ANGLE);
                setFinger(1, HAND_MIN_ANGLE);
                setFinger(2, HAND_MIN_ANGLE);
                setFinger(3, HAND_MIN_ANGLE);
                setFinger(4, HAND_MIN_ANGLE);
            }break;
        case HAND_TYPE.PAPER:
            {
                setFinger(0, HAND_MAX_ANGLE);
                setFinger(1, HAND_MAX_ANGLE);
                setFinger(2, HAND_MAX_ANGLE);
                setFinger(3, HAND_MAX_ANGLE);
                setFinger(4, HAND_MAX_ANGLE);
                
            }break;
        case HAND_TYPE.SCISSORS:
            {
                setFinger(0, HAND_MIN_ANGLE);
                setFinger(1, HAND_MAX_ANGLE);
                setFinger(2, HAND_MAX_ANGLE);
                setFinger(3, HAND_MIN_ANGLE);
                setFinger(4, HAND_MIN_ANGLE);
            }break;
        case HAND_TYPE.GESTURE_THUMBSUP:
            {
                setFinger(0, HAND_MAX_ANGLE);
                setFinger(1, HAND_MIN_ANGLE);
                setFinger(2, HAND_MIN_ANGLE);
                setFinger(3, HAND_MIN_ANGLE);
                setFinger(4, HAND_MIN_ANGLE);
            }break;
        case HAND_TYPE.GESTURE_PEACE:
            {
                setFinger(0, HAND_MAX_ANGLE);
                setFinger(1, HAND_MAX_ANGLE);
                setFinger(2, HAND_MIN_ANGLE);
                setFinger(3, HAND_MIN_ANGLE);
                setFinger(4, HAND_MAX_ANGLE);
            }break;
        case HAND_TYPE.GESTURE_PROMISE:
            {
                setFinger(0, HAND_MIN_ANGLE);
                setFinger(1, HAND_MIN_ANGLE);
                setFinger(2, HAND_MIN_ANGLE);
                setFinger(3, HAND_MIN_ANGLE);
                setFinger(4, HAND_MAX_ANGLE);
            }break;
        case HAND_TYPE.GESTURE_V:
            {
                setFinger(0, HAND_MIN_ANGLE);
                setFinger(1, HAND_MAX_ANGLE);
                setFinger(2, HAND_MAX_ANGLE);
                setFinger(3, HAND_MIN_ANGLE);
                setFinger(4, HAND_MIN_ANGLE);
            }break;
        case HAND_TYPE.LANGUAGE_ㄱ:
            {
                setFinger(0, HAND_MAX_ANGLE);
                setFinger(1, HAND_MAX_ANGLE);
                setFinger(2, HAND_MIN_ANGLE);
                setFinger(3, HAND_MIN_ANGLE);
                setFinger(4, HAND_MIN_ANGLE);
            }break;
        case HAND_TYPE.LANGUAGE_ㄴ:
            {
                setFinger(0, HAND_MAX_ANGLE);
                setFinger(1, HAND_MAX_ANGLE);
                setFinger(2, HAND_MIN_ANGLE);
                setFinger(3, HAND_MIN_ANGLE);
                setFinger(4, HAND_MIN_ANGLE);
            }break;
        case HAND_TYPE.LANGUAGE_ㄷ:
            {
                setFinger(0, HAND_MIN_ANGLE);
                setFinger(1, HAND_MAX_ANGLE);
                setFinger(2, HAND_MAX_ANGLE);
                setFinger(3, HAND_MIN_ANGLE);
                setFinger(4, HAND_MIN_ANGLE);
            }break;
        case HAND_TYPE.LANGUAGE_ㄹ:
            {
                setFinger(0, HAND_MIN_ANGLE);
                setFinger(1, HAND_MAX_ANGLE);
                setFinger(2, HAND_MAX_ANGLE);
                setFinger(3, HAND_MAX_ANGLE);
                setFinger(4, HAND_MIN_ANGLE);
            }break;
        case HAND_TYPE.LANGUAGE_ㅁ:
            {
                setFinger(0, HAND_MIN_ANGLE);
                setFinger(1, HAND_HALF_ANGLE);
                setFinger(2, HAND_HALF_ANGLE);
                setFinger(3, HAND_MIN_ANGLE);
                setFinger(4, HAND_MIN_ANGLE);
            }break;
        case HAND_TYPE.LANGUAGE_ㅂ:
            {
                setFinger(0, HAND_MIN_ANGLE);
                setFinger(1, HAND_MAX_ANGLE);
                setFinger(2, HAND_MAX_ANGLE);
                setFinger(3, HAND_MAX_ANGLE);
                setFinger(4, HAND_MAX_ANGLE);
            }break;
        case HAND_TYPE.LANGUAGE_ㅅ:
            {
                setFinger(0, HAND_MIN_ANGLE);
                setFinger(1, HAND_MAX_ANGLE);
                setFinger(2, HAND_MAX_ANGLE);
                setFinger(3, HAND_MIN_ANGLE);
                setFinger(4, HAND_MIN_ANGLE);
            }break;
        case HAND_TYPE.LANGUAGE_ㅇ:
            {
                setFinger(0, HAND_MIN_ANGLE);
                setFinger(1, HAND_MIN_ANGLE);
                setFinger(2, HAND_MAX_ANGLE);
                setFinger(3, HAND_MAX_ANGLE);
                setFinger(4, HAND_MAX_ANGLE);
            }break;
        case HAND_TYPE.LANGUAGE_ㅈ:
            {
                setFinger(0, HAND_MAX_ANGLE);
                setFinger(1, HAND_MAX_ANGLE);
                setFinger(2, HAND_MAX_ANGLE);
                setFinger(3, HAND_MIN_ANGLE);
                setFinger(4, HAND_MIN_ANGLE);
            }break;
        case HAND_TYPE.LANGUAGE_ㅊ:
            {
                setFinger(0, HAND_MAX_ANGLE);
                setFinger(1, HAND_MAX_ANGLE);
                setFinger(2, HAND_MAX_ANGLE);
                setFinger(3, HAND_MAX_ANGLE);
                setFinger(4, HAND_MIN_ANGLE);
            }break;
        case HAND_TYPE.LANGUAGE_ㅋ:
            {
                setFinger(0, HAND_MAX_ANGLE);
                setFinger(1, HAND_MIN_ANGLE);
                setFinger(2, HAND_MAX_ANGLE);
                setFinger(3, HAND_MIN_ANGLE);
                setFinger(4, HAND_MIN_ANGLE);
            }break;
        case HAND_TYPE.LANGUAGE_ㅌ:
            {
                setFinger(0, HAND_MIN_ANGLE);
                setFinger(1, HAND_MAX_ANGLE);
                setFinger(2, HAND_MAX_ANGLE);
                setFinger(3, HAND_MAX_ANGLE);
                setFinger(4, HAND_HALF_ANGLE);
            }break;
        case HAND_TYPE.LANGUAGE_ㅍ:
            {
                setFinger(0, HAND_MIN_ANGLE);
                setFinger(1, HAND_MIN_ANGLE);
                setFinger(2, HAND_MIN_ANGLE);
                setFinger(3, HAND_MIN_ANGLE);
                setFinger(4, HAND_MIN_ANGLE);
            }break;
        case HAND_TYPE.LANGUAGE_ㅎ:
            {
                setFinger(0, HAND_MAX_ANGLE);
                setFinger(1, HAND_MIN_ANGLE);
                setFinger(2, HAND_MIN_ANGLE);
                setFinger(3, HAND_MIN_ANGLE);
                setFinger(4, HAND_MIN_ANGLE);
            }break;
    }
}

function setFingerNumber(n, duration) 
{
    if (n <= 5)
    {
        for (var i = 0; i < 5; i++)
        {
            let angle = HAND_MIN_ANGLE;
            if (i < n)
                angle = HAND_MAX_ANGLE;

            setFingerDuration(i, HAND_HALF_ANGLE, angle, duration);
        }
    }
    else
    {
        for (var i = 0; i < 5; i++)
        {
            let angle = HAND_MIN_ANGLE;
            if (10 - n <= i)
                angle = HAND_MAX_ANGLE;
            
            setFingerDuration(i, HAND_HALF_ANGLE, angle, duration);
        }
    }    
}

function getRandomArbitraryInt(min, max) {
    return parseInt(Math.random() * (max - min) + min);
}

function delayScriptCallReturn(script, delay, onStart){
    if (!script.isStart) {

        onStart();

        setTimeout(()=>{
            clearInterval(Entry.ArduinoZin.handTimerId);
            script.isLoop = 0;
        }, delay);

        script.isStart = true;
        script.isLoop = true;                    
        return script;
    } else if (script.isLoop == true) {
        return script;
    }

    delete script.isLoop;
    delete script.isStart;
    return script.callReturn();
}
Entry.ArduinoZin = {
    id: '59.1',
    name: 'ArduinoZin',
    url: 'http://www.arduino.cc/',
    imageName: 'arduinoZin.png',
    title: {
        ko: '아두이노 Uno Zin',
        en: 'Arduino Uno Zin',
    },
    handTimerId:-1,
    setZero() {
        if (!Entry.hw.sendQueue.SET) {
            Entry.hw.sendQueue = {
                GET: {},
                SET: {},
            };
        } else {
            clearInterval(Entry.ArduinoZin.handTimerId);
            const keySet = Object.keys(Entry.hw.sendQueue.SET);
            keySet.forEach((key) => {
                Entry.hw.sendQueue.SET[key].data = HAND_MAX_ANGLE;
                Entry.hw.sendQueue.SET[key].time = new Date().getTime();
            });
        }
        Entry.hw.update();
    },
    sensorTypes: {
        ALIVE: 0,
        DIGITAL: 1,
        ANALOG: 2,
        PWM: 3,
        SERVO_PIN: 4,
        TONE: 5,
        PULSEIN: 6,
        ULTRASONIC: 7,
        TIMER: 8,
    },
};

Entry.ArduinoZin.setLanguage = function() {
    return {
        ko: {
            template: {
                arduino_ext_set_servo_hand_scissors: '가위바위보 %1 %2',
                arduino_ext_set_servo_hand_count: '숫자 세기 %1 %2',
                arduino_ext_set_servo_hand_gesture: '손 제스처 %1 %2',
                arduino_ext_set_servo_hand_finger_updown: '%1번째 손가락 %2 %3',
                arduino_ext_set_servo_hand_play_scissors: '랜덤 가위보기하기 %1 %2',
                arduino_ext_set_servo_hand_finger_updown_same_time: '%1번째 %2번째 %3번째 %4번째 %5번째 손가락 %6 %7 %8',
                arduino_ext_set_servo_hand_language: '수어 %1 %2',
                arduino_ext_set_servo_hand_arithmetic: '산수 %1 %2 %3',
            },
        },
        en: {
            template: {
                arduino_ext_set_servo_hand_scissors: 'Rock Paper Scissors %1 %2',
                arduino_ext_set_servo_hand_count: 'number count %1 %2',
                arduino_ext_set_servo_hand_gesture: 'hand gesture %1 %2',
                arduino_ext_set_servo_hand_finger_updown: '%1 finger %2 %3',
                arduino_ext_set_servo_hand_play_scissors: 'play rock paper scissors %1 %2',
                arduino_ext_set_servo_hand_finger_updown_same_time: '%1st %2ed %3rd %4rd %5rd finger %6 %7 %8',
                arduino_ext_set_servo_hand_language: 'hand language %1 %2',
                arduino_ext_set_servo_hand_arithmetic: 'arithmetic %1 %2 %3',
            },
        },
    };
};

Entry.ArduinoZin.blockMenuBlocks = [
    'arduino_ext_set_servo_hand_scissors',
    'arduino_ext_set_servo_hand_count',
    'arduino_ext_set_servo_hand_gesture',
    'arduino_ext_set_servo_hand_finger_updown',
    'arduino_ext_set_servo_hand_play_scissors',
    'arduino_ext_set_servo_hand_finger_updown_same_time',
    'arduino_ext_set_servo_hand_language',
    'arduino_ext_set_servo_hand_arithmetic',
];

//region ArduinoZin 아두이노 확장모드
Entry.ArduinoZin.getBlocks = function() {
    return {        
        arduino_ext_set_servo_hand_scissors: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: "Dropdown",
                    options: [
                        [ "바위", 0 ],
                        [ "보", 1 ],
                        [ "가위", 2 ]
                    ],
                    fontSize: 11
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
                    0,
                    null,
                ],
                type: 'arduino_ext_set_servo_hand_scissors',
            },
            paramsKeyMap: {
                HAND_TYPE: 0
            },
            class: 'ArduinoZin',
            isNotFor: ['ArduinoZin'],
            func(sprite, script) {                
                
                const sq = Entry.hw.sendQueue;
                return delayScriptCallReturn(script, HAND_DELAY,
                    ()=>{
                        const handType = script.getNumberValue('HAND_TYPE', script);

                        if (!sq.SET) {
                            sq.SET = {};
                        }
                        
                        switch(handType) {
                            case 0:
                                {           
                                    setHandType(HAND_TYPE.ROCK);
                                }
                                break;
                            case 1:
                                {
                                    setHandType(HAND_TYPE.PAPER);
                                }
                                break;
                            case 2:
                                {
                                    setHandType(HAND_TYPE.SCISSORS);
                                }
                                break;
                        }     
                    }
                );
            },
        },
        arduino_ext_set_servo_hand_count: {
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
            def: {
                params: [
                    {
                        type: 'number',
                        params: ['0'],
                    },
                ],
                type: 'arduino_ext_set_servo_hand_count',
            },
            paramsKeyMap: {
                VALUE: 0
            },
            class: 'ArduinoZin',
            isNotFor: ['ArduinoZin'],
            func(sprite, script) {                
                const sq = Entry.hw.sendQueue;
                if (!script.isStart) {
                    
                    let value = script.getNumberValue('VALUE', script);
                    value = Math.min(180, value);
                    value = Math.max(0, value);
    
                    if (!sq.SET) {
                        sq.SET = {};
                    }

                    setHandType(HAND_TYPE.PAPER);
                    
                    if (value == 0)
                        return script.callReturn();
                    
                    script.handCount = 0;

                    Entry.ArduinoZin.handTimerId = setInterval(() => { 

                        if (script.handCount%(SERVO_PIN_NUMBERS.length*2) < SERVO_PIN_NUMBERS.length)
                            setFinger(script.handCount%SERVO_PIN_NUMBERS.length, HAND_MIN_ANGLE);
                        else
                            setFinger(script.handCount%SERVO_PIN_NUMBERS.length, HAND_MAX_ANGLE);

                        script.handCount++;

                        if(script.handCount == value) {
                            clearInterval(Entry.ArduinoZin.handTimerId);
                            setTimeout(()=>{                                
                                script.isLoop = 0;
                            }, HAND_DELAY);                            
                        }
                    }, HAND_DELAY);

                    script.isStart = true;
                    script.isLoop = true;
                    return script;
                } else if (script.isLoop == true) {
                    return script;
                } 
                
                delete script.isLoop;
                delete script.isStart;
                delete script.handCount;
                return script.callReturn();
            },
        },
        arduino_ext_set_servo_hand_gesture: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [       
                {
                    type: "Dropdown",
                    options: [
                        [ "따봉", HAND_TYPE.GESTURE_THUMBSUP ],
                        [ "피스", HAND_TYPE.GESTURE_PEACE ],
                        [ "약속", HAND_TYPE.GESTURE_PROMISE ],
                        [ "브이", HAND_TYPE.GESTURE_V ],
                    ],
                    fontSize: 11
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
                    HAND_TYPE.GESTURE_THUMBSUP,
                    null,
                ],        
                type: 'arduino_ext_set_servo_hand_gesture',
            },
            paramsKeyMap: {
                HAND_TYPE: 0
            },
            class: 'ArduinoZin',
            isNotFor: ['ArduinoZin'],
            func(sprite, script) {                
                
                const sq = Entry.hw.sendQueue;
                return delayScriptCallReturn(script, HAND_DELAY, 
                    ()=>{
                        if (!sq.SET) {
                            sq.SET = {};
                        }
    
                        const handType = script.getNumberValue('HAND_TYPE', script);
                        setHandType(handType);
                    }
                );
            },
        },
        arduino_ext_set_servo_hand_finger_updown: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: "Dropdown",
                    options: [
                        [ "1", 0 ],
                        [ "2", 1 ],
                        [ "3", 2 ],
                        [ "4", 3 ],
                        [ "5", 4 ]
                    ],
                    fontSize: 11
                },
                {
                    type: "Dropdown",
                    options: [
                        [ "매우 천천히 접기", 0 ],
                        [ "매우 천천히 펴기", 1 ],
                        [ "천천히 접기", 2 ],
                        [ "천천히 펴기", 3 ],
                        [ "보통 접기", 4 ],
                        [ "보통 펴기", 5 ],
                        [ "빠르게 접기", 6 ],
                        [ "빠르게 펴기", 7 ]
                    ],
                    fontSize: 11
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
                    0,
                    0,
                    null,
                ],           
                type: 'arduino_ext_set_servo_hand_finger_updown',
            },
            paramsKeyMap: {
                FINGER_TYPE: 0,
                FINGER_UPDOWN: 1
            },
            class: 'ArduinoZin',
            isNotFor: ['ArduinoZin'],
            func(sprite, script) {                
                const fingerType = script.getNumberValue('FINGER_TYPE', script);
                const fingerUpDown = script.getNumberValue('FINGER_UPDOWN', script);
                let delayTimes = [10, 2.5, 0.5, 0.1];
                let startAngle = HAND_MIN_ANGLE;
                let targetAngle = HAND_MAX_ANGLE;
                if (fingerUpDown % 2 == 0)
                {
                    startAngle = HAND_MAX_ANGLE;
                    targetAngle = HAND_MIN_ANGLE;
                }
                else if (fingerUpDown % 2 == 1)
                {
                    startAngle = HAND_MIN_ANGLE;
                    targetAngle = HAND_MAX_ANGLE;                    
                }
                let delayTime = delayTimes[parseInt(fingerUpDown/2)];
                const sq = Entry.hw.sendQueue;
                return delayScriptCallReturn(script, HAND_DELAY+delayTime*1000, 
                    ()=>{                        
        
                        if (!sq.SET) {
                            sq.SET = {};
                        }

                        setFingerDuration(fingerType, startAngle, targetAngle, delayTime);
                    }
                );

            },
        },
        arduino_ext_set_servo_hand_play_scissors: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: "Dropdown",
                    options: [
                        [ "바위", "0" ],
                        [ "보", "1" ],
                        [ "가위", "2" ]
                    ],
                    fontSize: 11
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
                "0",
                null,
                ],           
                type: 'arduino_ext_set_servo_hand_play_scissors',
            },
            paramsKeyMap: {
                HAND_TYPE: 0,
            },
            class: 'ArduinoZin',
            isNotFor: ['ArduinoZin'],
            func(sprite, script) {                
                
                const sq = Entry.hw.sendQueue;
                return delayScriptCallReturn(script, HAND_DELAY, 
                    ()=>{
                        const handType = script.getNumberValue('HAND_TYPE', script);
                        const handList = [HAND_TYPE.ROCK, HAND_TYPE.PAPER, HAND_TYPE.SCISSORS];
                        if (!sq.SET) {
                            sq.SET = {};
                        }
        
                        let h = getRandomArbitraryInt(0, handList.length);
                        setHandType(handList[h]);
                    }
                );

            },
        },
        arduino_ext_set_servo_hand_finger_updown_same_time: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: "Dropdown",
                    options: [
                        [ "1", 1 ],
                        [ "-", 0 ],
                    ],
                    fontSize: 11
                },
                {
                    type: "Dropdown",
                    options: [
                        [ "2", 1 ],
                        [ "-", 0 ],
                    ],
                    fontSize: 11
                },
                {
                    type: "Dropdown",
                    options: [
                        [ "3", 1 ],
                        [ "-", 0 ],
                    ],
                    fontSize: 11
                },
                {
                    type: "Dropdown",
                    options: [
                        [ "4", 1 ],
                        [ "-", 0 ],
                    ],
                    fontSize: 11
                },
                {
                    type: "Dropdown",
                    options: [
                        [ "5", 1 ],
                        [ "-", 0 ],
                    ],
                    fontSize: 11
                },
                {
                    type: "Dropdown",
                    options: [
                        [ "동시에", 0 ],
                        [ "하나씩", 1 ]
                    ],
                    fontSize: 11
                },
                {
                    type: "Dropdown",
                    options: [
                        [ "접기", 0 ],
                        [ "펴기", 1 ]
                    ],
                    fontSize: 11
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
                    1,
                    1,
                    1,
                    1,
                    1,
                    0,
                    0,
                    null,
                ],           
                type: 'arduino_ext_set_servo_hand_finger_updown_same_time',
            },
            paramsKeyMap: {
                FINGER_NUMBER1:0,
                FINGER_NUMBER2:1,
                FINGER_NUMBER3:2,
                FINGER_NUMBER4:3,
                FINGER_NUMBER5:4,
                TIME_TYPE: 5,
                FINGER_UPDOWN: 6
            },
            class: 'ArduinoZin',
            isNotFor: ['ArduinoZin'],
            func(sprite, script) {                
                const fingerNumbers = [
                    script.getNumberValue('FINGER_NUMBER1', script),
                    script.getNumberValue('FINGER_NUMBER2', script),
                    script.getNumberValue('FINGER_NUMBER3', script),
                    script.getNumberValue('FINGER_NUMBER4', script),
                    script.getNumberValue('FINGER_NUMBER5', script)
                ];
                
                const fingerUpDown = script.getNumberValue('FINGER_UPDOWN', script);
                let targetAngle = fingerUpDown == 0 ? HAND_MIN_ANGLE :HAND_MAX_ANGLE;
                let delayTime = 0;
                const timeType = script.getNumberValue('TIME_TYPE', script);
                if (timeType == 1)
                {
                    for (var i = 0; i < fingerNumbers.length; i++)
                    {
                        if (fingerNumbers[i] == 1)
                            delayTime += HAND_DELAY;
                    }
                }
                
                const sq = Entry.hw.sendQueue;
                return delayScriptCallReturn(script, HAND_DELAY+delayTime, 
                    ()=>{                        
        
                        if (!sq.SET) {
                            sq.SET = {};
                        }

                        if (timeType == 0)
                        {
                            for (var i = 0; i < fingerNumbers.length; i++)
                            {
                                if (fingerNumbers[i] == 1)
                                    setFinger(i, targetAngle);  
                            }
                        }
                        else
                        {
                            let func = (idx, t) => {
                                sleep(t).then(() => {
                                    setFinger(idx, targetAngle);                                
                                });
                            };
                            
                            var c = 0;
                            for (var i = 0; i < fingerNumbers.length; i++)
                            {
                                if (fingerNumbers[i] == 1)
                                {
                                    func(i, c*HAND_DELAY);
                                    c++;
                                }
                            }
                        }
                        
                    }
                );

            },
        },
        arduino_ext_set_servo_hand_language: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [       
                {
                    type: "Dropdown",
                    options: [
                        [ "ㄱ", HAND_TYPE.LANGUAGE_ㄱ ],
                        [ "ㄴ", HAND_TYPE.LANGUAGE_ㄴ ],
                        [ "ㄷ", HAND_TYPE.LANGUAGE_ㄷ ],
                        [ "ㄹ", HAND_TYPE.LANGUAGE_ㄹ ],
                        [ "ㅁ", HAND_TYPE.LANGUAGE_ㅁ ],
                        [ "ㅂ", HAND_TYPE.LANGUAGE_ㅂ ],
                        [ "ㅅ", HAND_TYPE.LANGUAGE_ㅅ ],
                        [ "ㅇ", HAND_TYPE.LANGUAGE_ㅇ ],
                        [ "ㅈ", HAND_TYPE.LANGUAGE_ㅈ ],
                        [ "ㅊ", HAND_TYPE.LANGUAGE_ㅊ ],
                        [ "ㅋ", HAND_TYPE.LANGUAGE_ㅋ ],
                        [ "ㅌ", HAND_TYPE.LANGUAGE_ㅌ ],
                        [ "ㅍ", HAND_TYPE.LANGUAGE_ㅍ ],
                        [ "ㅎ", HAND_TYPE.LANGUAGE_ㅎ ],
                    ],
                    fontSize: 11
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
                    HAND_TYPE.LANGUAGE_ㄱ,
                    null,
                ],        
                type: 'arduino_ext_set_servo_hand_language',
            },
            paramsKeyMap: {
                HAND_TYPE: 0
            },
            class: 'ArduinoZin',
            isNotFor: ['ArduinoZin'],
            func(sprite, script) {                
                
                const sq = Entry.hw.sendQueue;
                return delayScriptCallReturn(script, HAND_DELAY, 
                    ()=>{
                        if (!sq.SET) {
                            sq.SET = {};
                        }
    
                        const handType = script.getNumberValue('HAND_TYPE', script);
                        setHandType(handType);
                    }
                );
            },
        },
        arduino_ext_set_servo_hand_arithmetic: {
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
                    type: "Dropdown",
                    options: [
                        [ "+", 0 ],
                        [ "-", 1 ],
                        [ "x", 2 ],
                        [ "/", 3 ],
                    ],
                    fontSize: 11
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
                    0,
                    0,
                    0,
                    null,
                ],        
                type: 'arduino_ext_set_servo_hand_arithmetic',
            },
            paramsKeyMap: {
                OPRND1: 0,
                OPTOR: 1,
                OPRND2: 2
            },
            class: 'ArduinoZin',
            isNotFor: ['ArduinoZin'],
            func(sprite, script) {
                const sq = Entry.hw.sendQueue;
                
                if (!script.isStart) {
                    if (!sq.SET) {
                        sq.SET = {};
                    }

                    const oprnd1 = script.getNumberValue('OPRND1', script);
                    const optor = script.getNumberValue('OPTOR', script);
                    const oprnd2 = script.getNumberValue('OPRND2', script);
                    let result = 0;
                    
                    switch (optor)
                    {
                        case 0:
                            result = oprnd1 + oprnd2;
                            break;
                        case 1:
                            result = oprnd1 - oprnd2;
                            break;
                        case 2:
                            result = oprnd1 * oprnd2;
                            break;
                        case 3:
                            result = oprnd1 / oprnd2;
                            break;
                    }
                    
                    // 음수 무시
                    result = Math.abs(result.toFixed());
                    let strResult = result.toString();
                    
                    script.handCount = 0;

                    setFinger(0, HAND_HALF_ANGLE);
                    setFinger(1, HAND_HALF_ANGLE);
                    setFinger(2, HAND_HALF_ANGLE);
                    setFinger(3, HAND_HALF_ANGLE);
                    setFinger(4, HAND_HALF_ANGLE);

                    Entry.ArduinoZin.handTimerId = setInterval(() => { 

                        let number = parseInt(strResult[script.handCount]);
                                                
                        setFingerNumber(number, 0.5);
                        script.handCount++;

                        if(script.handCount == strResult.length) {
                            clearInterval(Entry.ArduinoZin.handTimerId);
                            setTimeout(()=>{                                
                                script.isLoop = 0;
                            }, HAND_DELAY);
                        }
                    }, HAND_DELAY+HAND_DELAY*2);

                    script.isStart = true;
                    script.isLoop = true;
                    return script;
                } else if (script.isLoop == true) {
                    return script;
                } 
                
                delete script.isLoop;
                delete script.isStart;
                delete script.handCount;
                return script.callReturn();
            },
        },
    };
};
//endregion ArduinoZin 아두이노 확장모드

module.exports = Entry.ArduinoZin;
