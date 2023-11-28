'use strict';
const SERVO_PIN_NUMBERS = [12, 10, 9, 6, 2];
const HAND_MAX_ANGLE = 165;
const HAND_MIN_ANGLE = 0;
const HAND_DELAY = 1000;
const HAND_TYPE = {
    ROCK: 0,
    PAPER: 1,
    SCISSORS: 2,
    THUMBSUP: 3,
    PEACE: 4,
};

function setFinger(idx, angle)
{
    Entry.hw.sendQueue.SET[SERVO_PIN_NUMBERS[idx]] = {
        type: Entry.ArduinoZin.sensorTypes.SERVO_PIN,
        data: angle,
        time: new Date().getTime(),
    };
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
        case HAND_TYPE.THUMBSUP:
            {
                setFinger(0, HAND_MAX_ANGLE);
                setFinger(1, HAND_MIN_ANGLE);
                setFinger(2, HAND_MIN_ANGLE);
                setFinger(3, HAND_MIN_ANGLE);
                setFinger(4, HAND_MIN_ANGLE);
            }break;
        case HAND_TYPE.PEACE:
            {
                setFinger(0, HAND_MAX_ANGLE);
                setFinger(1, HAND_MAX_ANGLE);
                setFinger(2, HAND_MIN_ANGLE);
                setFinger(3, HAND_MIN_ANGLE);
                setFinger(4, HAND_MAX_ANGLE);
            }break;
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
                arduino_ext_set_servo_hand_play_scissors: '가위바위보 하기 %1 %2',
            },
        },
        en: {
            template: {
                arduino_ext_set_servo_hand_scissors: 'Rock Paper Scissors %1 %2',
                arduino_ext_set_servo_hand_count: 'number count %1 %2',
                arduino_ext_set_servo_hand_gesture: 'hand gestur %1 %2',
                arduino_ext_set_servo_hand_finger_updown: '%1 finger %2 %3',
                arduino_ext_set_servo_hand_play_scissors: 'play rock paper scissors %1 %2',
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
                        [ "r", 0 ],
                        [ "p", 1 ],
                        [ "s", 2 ],
                        [ "n", 3 ]
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
                            case 3:
                                {
                                    setHandType(HAND_TYPE.ROCK);
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
                        [ "따봉", HAND_TYPE.THUMBSUP ],
                        [ "피스", HAND_TYPE.PEACE ],
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
                    HAND_TYPE.THUMBSUP,
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
                
                const sq = Entry.hw.sendQueue;
                return delayScriptCallReturn(script, HAND_DELAY, 
                    ()=>{
                        const fingerType = script.getNumberValue('FINGER_TYPE', script);
                        const fingerUpDown = script.getNumberValue('FINGER_UPDOWN', script);
        
                        if (!sq.SET) {
                            sq.SET = {};
                        }
        
                        let angle = fingerUpDown == 0 ? HAND_MIN_ANGLE : HAND_MAX_ANGLE;
                        console.log('asdfasfd', fingerType, angle);
                        setFinger(fingerType, angle);
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
                        [ "r", "0" ],
                        [ "p", "1" ],
                        [ "s", "2" ]
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
    };
};
//endregion ArduinoZin 아두이노 확장모드

module.exports = Entry.ArduinoZin;
