'use strict';

var firstRun = false;
var exCnt = 0, tempCnt = 0;

Entry.ZumiMini = {
    id: '4A.5',
    name: 'zumi_mini', // isNotFor 속성과 대소문자까지 정확하게 매치되어야 합니다.
    url: 'http://www.robolink.co.kr/', // 생략 가능합니다. 엔트리 사이트에서 홍보시 사용됩니다.
    imageName: 'robolink_zumiMini.png', // images/hardware 폴더 내에 존재하는 이미지입니다. 엔트리 사이트에서 홍보시 사용됩니다.
    title: {
        ko: '로보링크 주미미니',
        en: 'Robolink zumi mini',
    },
       
    setZero: function() {

        console.log("engine set Zero..");  
        Entry.hw.sendQueue['req'] = 0x00;
        Entry.hw.sendQueue['com'] = 0x00;  
        Entry.hw.sendQueue['speed'] = 0x00;
        Entry.hw.sendQueue['dir'] = 0x00;     
        Entry.hw.update(); 
        exCnt = tempCnt;
        //console.log("exCnt:" + exCnt);      
    },

    afterReceive(pd) {
        
        const Z_WAIT = 0;
        const Z_SEND_PACKET = 1;
        const Z_MOVING = 2;

        const READY = 0;
        const PROCESS = 1;

        const COMMAND_MOTION_STOP = 25;

        var pStep = Z_WAIT;
        var iter = 0;

        //temCnt = Entry.hw.portData.inputData.euler['ROLL'];
        //console.log("exCnt: " + exCnt);
        
        
        if (Entry.engine.isState('run')) {
            //console.log("engine running..");  
            firstRun = false;
            tempCnt++;
            //console.log("tempCnt: " + tempCnt);             
        }
        else if (Entry.engine.isState('stop')) {
            //Entry.hw.sendQueue['req'] = 0x00;
            //Entry.hw.sendQueue['com'] = 0xF0;
            //Entry.hw.update();
            //console.log("engine stop..");
            if(firstRun == false)
            {
                var _stat = Entry.hw.portData.inputData['pStat'];
              
                if ((pStep == Z_WAIT) && (_stat == READY)) {
                    pStep = Z_SEND_PACKET;
                    console.log("ready start");                   
                    firstRun = true;
                }
                else if ((pStep == Z_WAIT) && (_stat == PROCESS)) {
                    pStep = Z_WAIT;    //wait until other action ends.
                    console.log("not ready");
                }                       

                if ((pStep == Z_SEND_PACKET) && (_stat == READY)) {    //send command until hardware start to action.

                    if (iter < 5) {
                        Entry.hw.sendQueue['com'] = COMMAND_MOTION_STOP;
                        Entry.hw.update();
                        console.log("send protocol");        
                    }
                    else {
                        Entry.hw.sendQueue['com'] = 0x00;
                        Entry.hw.update();
                    }
                    pStep = Z_SEND_PACKET;
                    //iter++;                  
                }                    
            }
            else {
                Entry.hw.sendQueue['com'] = 0x00;
                Entry.hw.update();
            }         
        }        
    }
};

// 언어 적용
Entry.ZumiMini.setLanguage = function () {
    return {
        ko: {
            Blocks: {
                FL: '왼쪽',
                FR: '오른쪽',
                BL: '왼쪽',
                BM: '가운데',
                BR: '오른쪽',
                COLOR: '색상',
                AI_RED: '빨강',
                AI_ORANGE: '주황',
                AI_YELLOW: '노랑',
                AI_GREEN: '녹색',
                AI_CYAN: '청록',
                AI_BLUE: '파랑',
                AI_PURPLE: '보라',
                RED: '빨강',
                GREEN: '녹색',
                BLUE: '파랑',
                YELLOW: '노랑',
                SKY_BLUE: '청록',
                PINK: '분홍',
                WHITE: '하양',
                LED_NORMAL: '기본',
                LED_BLINK: '깜빡임',
                LED_FLICKER: '깜빡임2',
                LED_DIMMING: '디밍',
                LED_SUNRISE: '서서히 밝아짐',
                LED_SUNSET: '서서히 어두워짐',
                LED_RAINBOW: '무지개',
                ON: '켜기',
                OFF: '끄기',
                CAT: '고양이얼굴',
                HUMAN: '사람얼굴',
                DETECT: '감지',
                CX: 'X좌표',
                CY: 'Y좌표',
                ID: '번호',
                PITCH: '피치',
                ROLL: '롤',
                YAW: '요우', 
                FORWARD: '전진',
                BACKWARD: '후진',
                RAPID: '빠르게',
                MID: '보통',
                SLOW: '느리게', 
                LEFT: '왼쪽',
                RIGHT: '오른쪽', 
                CAMERA: '카메라',
                EMOTION: '표정', 
                EMO_CHAOS: '혼란',
                EMO_SMILE: '미소',
                EMO_LOVE: '사랑',
                EMO_CRASH: '안돼!',
                EMO_SURPRISE: '놀람',
                EMO_NICE: '신남',
                EMO_CANTBELIEVE: '미심쩍음',
                EMO_SLEEP: '졸림',
                EMO_CRY: '슬픔',
                EMO_WINK: '윙크',
                EMO_BLINK: '깜빡깜빡',
                EMO_STOP: '무표정',
                SND_USER: '사용자 녹음',
                SND_CAT: '고양이',
                SND_SHUTTER: '셔터',
                SND_FAIL: '실패',
                SND_SUCCESS: '성공',
                SND_FAIL2: '경고',
                SND_HONK: '경적',
                SND_HONK2: '경적2',
                SND_SIREN: '사이렌',
                M1: '왼쪽 모터',
                M2: '오른쪽 모터',
                CW: '전진방향',
                CCW: '후진방향',
                STOP: '멈춤', 
                RED_BTN: '빨강버튼',
                BLUE_BTN: '파랑버튼',
                YELLOW_BTN: '노랑버튼',
                GREEN_BTN: '녹색버튼',
                PRESSED: '눌렀을 때',
                RELEASED: '눌리지 않았을 때',               
            },
            template: {
                go_forward:'앞으로 가기(10cm) %1',
                go_back: '뒤로 가기(10cm) %1',
                turn_left: '왼쪽으로 회전 %1',
                turn_right: '오른쪽으로 회전 %1',
                going_forward_until_sensing : '물체 감지할 때까지 앞으로 가기 %1',
                following_line_until_sensing : '교차로 만날 때까지 선 따라가기 %1',
                front_sensor:  '앞 센서 %1 %2',
                bottom_sensor: '바닥 센서 %1 %2',
                button_input: '버튼 입력 %1',
                button_boolean_input: '%1 이 %2',
                face_detector: 'AI 얼굴 %1 %2',
                cat_face_detector: 'AI 고양이 얼굴 %1 %2',
                face_boolean_detector: '%1 이 감지 되었을 때',
                color_detector: 'AI 컬러 감지 %1 %2',
                color_boolean_detector:'%1 이 감지되었을 때', 
                april_detector: '마커 감지 %1 %2',
                april_boolean_detector: '마커 %1 이 감지되었을 때',
                IMU_sensor: '자세 측정 %1 %2',
                move_straight: '이동하기 방향 %1 속도 %2 거리 %3cm %4',
                move_turn: '회전하기 방향 %1 속도 %2 각도 %3도 %4',
                following_line_dist: '선 따라가기 속도 %1 거리 %2cm %3',
                move_straight_infinite: '계속 이동하기 방향 %1 속도 %2 %3',
                following_line_infinite: '계속 선 따라가기 속도 %1 %2',
                motion_stop: '이동 멈추기 %1',
                screen_toggle: '화면 바꾸기 %1 %2',
                emotion: '표정 변화 %1 %2', 
                play_sound: '소리내기 %1 %2',  
                LED_control: 'LED 불빛 %1 효과 %2 동작 %3 %4',
                motor_control: '모터 %1 방향 %2 속도 %3 %4',
                power_info: '배터리 %1',           
            },
        },       

        en: {
            Blocks: {
                FL: 'left',
                FR: 'right',
                BL: 'left',
                BM: 'middle',
                BR: 'right',
                COLOR: 'color',
                AI_RED: 'red',
                AI_ORANGE: 'orange',
                AI_YELLOW: 'yellow',
                AI_GREEN: 'green',
                AI_CYAN: 'cyan',
                AI_BLUE: 'blue',
                AI_PURPLE: 'purple',
                RED: 'red',
                GREEN: 'green',
                BLUE: 'blue',
                YELLOW: 'yellow',
                SKY_BLUE: 'skyblue',
                PINK: 'pink',
                WHITE: 'white',
                LED_NORMAL: 'normal',
                LED_BLINK: 'blink',
                LED_FLICKER: 'flicker',
                LED_DIMMING: 'dimming',
                LED_SUNRISE: 'sunrise',
                LED_SUNSET: 'sunset',
                LED_RAINBOW: 'rainbow',
                ON: 'on',
                OFF: 'off',
                CAT: 'cat',
                HUMAN: 'human',
                DETECT: 'detection',
                CX: 'X_coordinate',
                CY: 'Y_coordinate',
                ID: 'ID',
                PITCH: 'pitch',
                ROLL: 'roll',
                YAW: 'yaw',
                FORWARD: 'forward',
                BACKWARD: 'backward',
                RAPID: 'rapid',
                MID: 'medium',
                SLOW: 'slow',
                LEFT: 'left',
                RIGHT: 'right',  
                CAMERA: 'camera',
                EMOTION: 'emotion',
                EMO_CHAOS: 'chaos',
                EMO_SMILE: 'smile',
                EMO_LOVE: 'love',
                EMO_CRASH: 'no!',
                EMO_SURPRISE: 'surprise',
                EMO_NICE: 'joy',
                EMO_CANTBELIEVE: 'cant believe',
                EMO_SLEEP: 'sleep',
                EMO_CRY: 'cry',
                EMO_WINK: 'wink',
                EMO_BLINK: 'blink', 
                EMO_STOP: 'default',
                SND_CAT: 'meow',
                SND_SHUTTER: 'shutter',
                SND_FAIL: 'fail',
                SND_SUCCESS: 'success',
                SND_FAIL2: 'alarm',
                SND_HONK: 'horn',
                SND_HONK2: 'horn2',
                SND_SIREN: 'siren',
                M1: 'left motor',
                M2: 'right motor',
                CW: 'forward',
                CCW: 'backward', 
                STOP: 'stop', 
                RED_BTN: 'red button',
                BLUE_BTN: 'blue button',
                YELLOW_BTN: 'yellow button',
                GREEN_BTN: 'green button',
                PRESSED: 'pressed',
                RELEASED: 'released',                      
            },
            template: {
                go_forward:'going forward(10cm) %1',
                go_back : 'going back(10cm) %1',
                turn_left : 'turning left %1',
                turn_right : 'turning right %1',
                going_forward_until_sensing: 'going forward until sensing the object %1',
                following_line_until_sensing: 'following the line until meet the intersection %1',
                front_sensor: 'front sensor %1 %2',
                bottom_sensor: 'bottom sensor %1 %2',
                button_inpput: 'button input %1',
                button_boolean_input: 'when %1 %2',
                face_detector: 'AI face %1 %2',
                cat_face_detector: 'AI cat face %1 %2',
                face_boolean_detector: 'when %1 is detected',
                color_detector: 'AI color detection %1 %2',
                color_boolean_detector:'when %1 is detected',
                april_detector: 'apriltag detection %1 %2',
                april_boolean_detector: 'when apriltag %1 is detected', 
                IMU_sensor: ' inertial mesurement %1 %2',
                move_straight: 'move direction %1 speed %2 distance %3 cm %4',
                move_turn: 'turn %1 speed %2 degree %3 %4',
                following_line_dist: 'line following speed %1 distance %2 %3',
                move_straight_infinite: 'keep moving direction %1 speed %2 %3',
                following_line_infinite: 'keep following line %1 %2',
                motion_stop: 'stop moving %1',
                screen_toggle: 'toggle screen %1 %2',
                emotion: 'change emotion  %1 %2',
                play_sound: 'play sound %1 %2', 
                LED_control: 'LED light %1 effect %2 acttion %3 %4', 
                motor_control: 'motor %1 direction %2 speed %3 %4',  
                power_info: 'battery %1',   
            },
        },        
    };
};

Entry.ZumiMini.blockMenuBlocks = [
         
    'motor_control',     
    'move_straight',       
    'move_straight_infinite',    
    'move_turn', 
    'motion_stop',

    'going_forward_until_sensing',
    'following_line_until_sensing',     
    'following_line_dist',
    'following_line_infinite',            
    
    'LED_control',

    'button_boolean_input',

    'screen_toggle',
    'emotion', 
    
    'face_boolean_detector',
    'color_boolean_detector',
    'april_boolean_detector',    


    'front_sensor',
    'bottom_sensor',
    'button_input',
    'face_detector',
    'cat_face_detector',
    'color_detector',
    'april_detector',
    'power_info',   
];


Entry.ZumiMini.getBlocks = function() {
    return {    
        motion_stop: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#ffffff',
            skeleton: 'basic',
            params: [
                {
                    type: "Indicator",
                    img: 'block_icon/hardware_icon.svg',
                    size: 14,
                }
            ],
            def: {
                type: "motion_stop"
            },
            class: "move",
            isNotFor: ['zumi_mini'],
            func: function (sprite, script) {

                const Z_WAIT = 0;
                const Z_SEND_PACKET = 1;
                const Z_MOVING = 2;

                const READY = 0;
                const PROCESS = 1;

                const COMMAND_MOTION_STOP = 25;

                var pStep = Z_WAIT;
                var iter = 0;
                var _exit = false;

                console.log("going turn block Start!");

                return new Promise(resolve => {

                    new Promise(resolve => {
                        setTimeout(function () {
                            console.log("exCnt: " + exCnt + " tempCnt:" + tempCnt);
                            if (exCnt == tempCnt) {
                                _exit = true;

                            }
                            resolve();
                        }, 200);
                    })
                    .then(() => {

                        return new Promise(resolve => { 
                            
                            var ttt = setInterval(() => {

                                if (_exit == true) {
                                    console.log("block skip!");
                                    resolve();
                                    clearInterval(ttt);
                                }

                                var _stat = Entry.hw.portData.inputData['pStat'];

                                if ((pStep == Z_WAIT) && (_stat == READY)) pStep = Z_SEND_PACKET;
                                else if ((pStep == Z_WAIT) && (_stat == PROCESS)) pStep = Z_WAIT;    //wait until other action ends.                       

                                if ((pStep == Z_SEND_PACKET) && (_stat == READY)) {    //send command until hardware start to action.

                                    if (iter < 5) {
                                        Entry.hw.sendQueue['com'] = COMMAND_MOTION_STOP;
                                        console.log("send protocol!");
                                    }
                                    else Entry.hw.sendQueue['com'] = 0x00;
                                    pStep = Z_SEND_PACKET;
                                    //iter++;
                                }
                                else if ((pStep == Z_SEND_PACKET) && (_stat == PROCESS)) {
                                    pStep = Z_MOVING;
                                    Entry.hw.sendQueue['com'] = 0x00;
                                }

                                if ((pStep == Z_MOVING) && (_stat == READY)) {

                                    console.log("block exit!");
                                    Entry.hw.sendQueue['com'] = 0x00;
                                    pStep = Z_WAIT;
                                    resolve();
                                    clearInterval(ttt);
                                }
                                else if ((pStep == Z_MOVING) && (_stat == PROCESS)) pStep = Z_MOVING;  //wait until the action ends.                     

                            }, 50); 

                        });
                               
                    })
                    .then(() => {
                        resolve();
                    })                    

                });
            },
        },
        
        move_straight: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#ffffff',
            skeleton: 'basic',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.FORWARD, 'FORWARD'],
                        [Lang.Blocks.BACKWARD, 'BACKWARD'],                        
                    ],
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
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {               
                    type: 'Block',
                    accept: 'string',
                },               
                {
                    type: "Indicator",
                    img: 'block_icon/hardware_icon.svg',
                    size: 14
                },
            ],
            def: {
                params: ['FORWARD', 'MID', 10, null],
                type: 'move_straight',
            },
            paramsKeyMap: {
                DIR: 0,
                SPD: 1,
                DIST: 2,
            },
            class: "move",
            isNotFor: ['zumi_mini'],
            func: function (sprite, script) {

                const Z_WAIT = 0;
                const Z_SEND_PACKET = 1;
                const Z_MOVING = 2;

                const READY = 0;
                const PROCESS = 1;

                const COMMAND_GO_UNTIL_DIST = 26;
                const DIR_FORWARD = 0;
                const DIR_BACKWARD = 1;
                const SPEED_RAPID = 3;
                const SPEED_MID = 2;
                const SPEED_LOW = 1

                //var exTime = new Date();
                //var firstCheck = true;
                var pStep = Z_WAIT;
                var iter = 0;
                var _exit = false;


                console.log("go until distance block Start!");

                var _dir = script.getStringField('DIR', script)
                var _spd = script.getStringField('SPD', script);
                var _dist = script.getNumberValue('DIST');

                return new Promise(resolve => {
                    
                    new Promise(resolve => {
                        setTimeout(function () {
                            console.log("exCnt: " + exCnt + " tempCnt:" + tempCnt);
                            if (exCnt == tempCnt) {
                                _exit = true;
                            }
                            resolve();
                        }, 200);
                    })
                    .then(() => {

                        return new Promise(resolve => {

                            var ttt = setInterval(() => {

                                if (_exit == true) {
                                    console.log("block skip!");
                                    resolve();
                                    clearInterval(ttt);
                                }

                                var _stat = Entry.hw.portData.inputData['pStat'];

                                if ((pStep == Z_WAIT) && (_stat == READY)) pStep = Z_SEND_PACKET;
                                else if ((pStep == Z_WAIT) && (_stat == PROCESS)) pStep = Z_WAIT;    //wait until other action ends.                       

                                if ((pStep == Z_SEND_PACKET) && (_stat == READY)) {    //send command until hardware start to action.

                                    if (iter < 5) {
                                        Entry.hw.sendQueue['com'] = COMMAND_GO_UNTIL_DIST;

                                        if (_dir == 'FORWARD') Entry.hw.sendQueue['dir'] = DIR_FORWARD;
                                        else if (_dir == 'BACKWARD') Entry.hw.sendQueue['dir'] = DIR_BACKWARD;

                                        if (_spd == 'RAPID') Entry.hw.sendQueue['speed'] = SPEED_RAPID;
                                        else if (_spd == 'MID') Entry.hw.sendQueue['speed'] = SPEED_MID;
                                        else if (_spd == 'SLOW') Entry.hw.sendQueue['speed'] = SPEED_LOW;

                                      //  if (_dist < 20) _dist = 20; else if (_dist > 200) _dist = 200;
                                        Entry.hw.sendQueue['dist'] = _dist;

                                        console.log("send protocol!");
                                    }
                                    else Entry.hw.sendQueue['com'] = 0x00;

                                    pStep = Z_SEND_PACKET;
                                    //iter++;
                                }
                                else if ((pStep == Z_SEND_PACKET) && (_stat == PROCESS)) {
                                    pStep = Z_MOVING;
                                    Entry.hw.sendQueue['com'] = 0x00;
                                }

                                if ((pStep == Z_MOVING) && (_stat == READY)) {

                                    console.log("block exit!");
                                    Entry.hw.sendQueue['com'] = 0x00;
                                    Entry.hw.sendQueue['dir'] = 0x00;
                                    Entry.hw.sendQueue['speed'] = 0x00;
                                    Entry.hw.sendQueue['dist'] = 0x00;

                                    pStep = Z_WAIT;
                                    resolve();
                                    clearInterval(ttt);
                                }
                                else if ((pStep == Z_MOVING) && (_stat == PROCESS)) pStep = Z_MOVING;  //wait until the action ends.

                            }, 50);

                        });
                    })
                    .then(() => {
                        resolve();
                    })       

                });
            },
        },

        following_line_infinite: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#ffffff',
            skeleton: 'basic',
            params: [               
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.RAPID, 'RAPID'],
                        [Lang.Blocks.MID, 'MID'],
                        [Lang.Blocks.SLOW, 'SLOW']
                    ],
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: "Indicator",
                    img: 'block_icon/hardware_icon.svg',
                    size: 14,
                },
            ],
            def: {
                params: ['MID', null],
                type: 'following_line_infinite',
            },
            paramsKeyMap: {
                SPD: 0,
            },
            class: "sense",
            isNotFor: ['zumi_mini'],
            func: function (sprite, script) {

                const COMMAND_TRACE_INFINITE = 30;
                const SPEED_RAPID = 3;
                const SPEED_MID = 2;
                const SPEED_LOW = 1;

                console.log("go move straight infinite block Start!");

                var _spd = script.getStringField('SPD', script);

                Entry.hw.sendQueue['com'] = COMMAND_TRACE_INFINITE;

                if (_spd == 'RAPID') Entry.hw.sendQueue['speed'] = SPEED_RAPID;
                else if (_spd == 'MID') Entry.hw.sendQueue['speed'] = SPEED_MID;
                else if (_spd == 'SLOW') Entry.hw.sendQueue['speed'] = SPEED_LOW;

                console.log("send protocol!");
            },
        },

        move_straight_infinite: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#ffffff',
            skeleton: 'basic',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.FORWARD, 'FORWARD'],
                        [Lang.Blocks.BACKWARD, 'BACKWARD'],
                    ],
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
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },              
                {
                    type: "Indicator",
                    img: 'block_icon/hardware_icon.svg',
                    size: 14,
                },
            ],
            def: {
                params: ['FORWARD', 'MID', null],
                type: 'move_straight_infinite',
            },
            paramsKeyMap: {
                DIR: 0,
                SPD: 1,
            },
            class: "move",
            isNotFor: ['zumi_mini'],
            func: function (sprite, script) {

                const COMMAND_GO_INFINITE = 29;
                const DIR_FORWARD = 0;
                const DIR_BACKWARD = 1;
                const SPEED_RAPID = 3;
                const SPEED_MID = 2;
                const SPEED_LOW = 1;
              
                console.log("go move straight infinite block Start!");

                var _dir = script.getStringField('DIR', script);
                var _spd = script.getStringField('SPD', script);

                Entry.hw.sendQueue['com'] = COMMAND_GO_INFINITE;

                if (_dir == 'FORWARD') Entry.hw.sendQueue['dir'] = DIR_FORWARD;
                else if (_dir == 'BACKWARD') Entry.hw.sendQueue['dir'] = DIR_BACKWARD;

                if (_spd == 'RAPID') Entry.hw.sendQueue['speed'] = SPEED_RAPID;
                else if (_spd == 'MID') Entry.hw.sendQueue['speed'] = SPEED_MID;
                else if (_spd == 'SLOW') Entry.hw.sendQueue['speed'] = SPEED_LOW;

                console.log("send protocol!");            
            },
        },

        following_line_dist: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#ffffff',
            skeleton: 'basic',
            params: [               
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.RAPID, 'RAPID'],
                        [Lang.Blocks.MID, 'MID'],
                        [Lang.Blocks.SLOW, 'SLOW']
                    ],
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Block',
                    accept: 'string',
                },
                {
                    type: "Indicator",
                    img: 'block_icon/hardware_icon.svg',
                    size: 14
                },
            ],
            def: {
                params: ['MID', 30, null],
                type: 'following_line_dist',
            },
            paramsKeyMap: {
                SPD: 0,
                DIST: 1,
            },
            class: "sense",
            isNotFor: ['zumi_mini'],
            func: function (sprite, script) {

                const Z_WAIT = 0;
                const Z_SEND_PACKET = 1;
                const Z_MOVING = 2;

                const READY = 0;
                const PROCESS = 1;

                const COMMAND_LINE_TRACE_DIST = 28;
                const SPEED_RAPID = 3;
                const SPEED_MID = 2;
                const SPEED_LOW = 1

                //var exTime = new Date();
                //var firstCheck = true;
                var pStep = Z_WAIT;
                var iter = 0;
                var _exit = false;

                console.log("go following line dist block Start!");

                var _spd = script.getStringField('SPD', script);
                var _dist = script.getNumberValue('DIST');

                return new Promise(resolve => {

                    new Promise(resolve => {
                        setTimeout(function () {
                            console.log("exCnt: " + exCnt + " tempCnt:" + tempCnt);
                            if (exCnt == tempCnt) {
                                _exit = true;
                            }
                            resolve();
                        }, 200);
                    })
                    .then(() => { 

                        return new Promise(resolve => { 
                            
                            var ttt = setInterval(() => {

                                if (_exit == true) {
                                    console.log("block skip!");
                                    resolve();
                                    clearInterval(ttt);
                                }

                                var _stat = Entry.hw.portData.inputData['pStat'];

                                if ((pStep == Z_WAIT) && (_stat == READY)) pStep = Z_SEND_PACKET;
                                else if ((pStep == Z_WAIT) && (_stat == PROCESS)) pStep = Z_WAIT;    //wait until other action ends.                       

                                if ((pStep == Z_SEND_PACKET) && (_stat == READY)) {    //send command until hardware start to action.

                                    if (iter < 5) {
                                        Entry.hw.sendQueue['com'] = COMMAND_LINE_TRACE_DIST;

                                        if (_spd == 'RAPID') Entry.hw.sendQueue['speed'] = SPEED_RAPID;
                                        else if (_spd == 'MID') Entry.hw.sendQueue['speed'] = SPEED_MID;
                                        else if (_spd == 'SLOW') Entry.hw.sendQueue['speed'] = SPEED_LOW;

                                        if (_dist < 10) _dist = 10; else if (_dist > 200) _dist = 200;
                                        Entry.hw.sendQueue['dist'] = _dist;

                                        console.log("send protocol!");
                                    }
                                    else Entry.hw.sendQueue['com'] = 0x00;

                                    pStep = Z_SEND_PACKET;
                                    //iter++;
                                }
                                else if ((pStep == Z_SEND_PACKET) && (_stat == PROCESS)) {
                                    pStep = Z_MOVING;
                                    Entry.hw.sendQueue['com'] = 0x00;
                                }

                                if ((pStep == Z_MOVING) && (_stat == READY)) {

                                    console.log("block exit!");
                                    Entry.hw.sendQueue['com'] = 0x00;
                                    Entry.hw.sendQueue['dir'] = 0x00;
                                    Entry.hw.sendQueue['speed'] = 0x00;
                                    Entry.hw.sendQueue['dist'] = 0x00;

                                    pStep = Z_WAIT;
                                    resolve();
                                    clearInterval(ttt);
                                }
                                else if ((pStep == Z_MOVING) && (_stat == PROCESS)) pStep = Z_MOVING;  //wait until the action ends.

                            }, 50);

                        });
                    })
                    .then(() => {
                        resolve();
                    })
                });
            },
        },
        
        move_turn: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#ffffff',
            skeleton: 'basic',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.LEFT, 'LEFT'],
                        [Lang.Blocks.RIGHT, 'RIGHT'],
                    ],
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
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Block',
                    accept: 'string',
                },
                {
                    type: "Indicator",
                    img: 'block_icon/hardware_icon.svg',
                    size: 14
                },
            ],
            def: {
                params: ['RIGHT', 'MID', 90, null],
                type: 'move_turn',
            },
            paramsKeyMap: {
                DIR: 0,
                SPD: 1,
                DEG: 2,
            },
            class: "move",
            isNotFor: ['zumi_mini'],
            func: function (sprite, script) {

                const Z_WAIT = 0;
                const Z_SEND_PACKET = 1;
                const Z_MOVING = 2;

                const READY = 0;
                const PROCESS = 1;

                const COMMAND_FREE_TURN = 27;
                const DIR_LEFT = 0;
                const DIR_RIGHT = 1;
                const SPEED_RAPID = 3;
                const SPEED_MID = 2;
                const SPEED_LOW = 1;

                //var exTime = new Date();
                //var firstCheck = true;
                var pStep = Z_WAIT;
                var iter = 0;
                var _exit = false;

                console.log("go turning block Start!");

                var _dir = script.getStringField('DIR', script)
                var _spd = script.getStringField('SPD', script);
                var _deg = script.getNumberValue('DEG');

                return new Promise(resolve => {

                    new Promise(resolve => {
                        setTimeout(function () {
                            console.log("exCnt: " + exCnt + " tempCnt:" + tempCnt);
                            if (exCnt == tempCnt) {
                                _exit = true;
                            }
                            resolve();
                        }, 200);
                    })
                    .then(() => {
                        return new Promise(resolve => { 
                            
                            var ttt = setInterval(() => {

                                if (_exit == true) {
                                    console.log("skip block!");
                                    resolve();
                                    clearInterval(ttt);
                                }
                                
                                var _stat = Entry.hw.portData.inputData['pStat'];

                                if ((pStep == Z_WAIT) && (_stat == READY)) pStep = Z_SEND_PACKET;
                                else if ((pStep == Z_WAIT) && (_stat == PROCESS)) pStep = Z_WAIT;    //wait until other action ends.                       

                                if ((pStep == Z_SEND_PACKET) && (_stat == READY)) {    //send command until hardware start to action.

                                    if (iter < 5) {
                                        Entry.hw.sendQueue['com'] = COMMAND_FREE_TURN;

                                        if (_dir == 'LEFT') Entry.hw.sendQueue['dir'] = DIR_LEFT;
                                        else if (_dir == 'RIGHT') Entry.hw.sendQueue['dir'] = DIR_RIGHT;

                                        if (_spd == 'RAPID') Entry.hw.sendQueue['speed'] = SPEED_RAPID;
                                        else if (_spd == 'MID') Entry.hw.sendQueue['speed'] = SPEED_MID;
                                        else if (_spd == 'SLOW') Entry.hw.sendQueue['speed'] = SPEED_LOW;

                                        if (_deg < 5) _deg = 5; else if (_deg > 359) _deg = 359;
                                        var degree = _deg * 0.5; //avoid overflow(8bit)

                                        //console.log("degree:", degree);
                                        Entry.hw.sendQueue['dist'] = degree;  //따로 deg를 위한 딕셔너리는 존재하지 않는다.

                                        console.log("send protocol!");
                                    }
                                    else Entry.hw.sendQueue['com'] = 0x00;

                                    pStep = Z_SEND_PACKET;
                                    //iter++;
                                }
                                else if ((pStep == Z_SEND_PACKET) && (_stat == PROCESS)) {
                                    pStep = Z_MOVING;
                                    Entry.hw.sendQueue['com'] = 0x00;
                                }

                                if ((pStep == Z_MOVING) && (_stat == READY)) {

                                    console.log("exit block!");
                                    Entry.hw.sendQueue['com'] = 0x00;
                                    Entry.hw.sendQueue['dir'] = 0x00;
                                    Entry.hw.sendQueue['speed'] = 0x00;
                                    Entry.hw.sendQueue['dist'] = 0x00;

                                    pStep = Z_WAIT;
                                    resolve();
                                    clearInterval(ttt);
                                }
                                else if ((pStep == Z_MOVING) && (_stat == PROCESS)) pStep = Z_MOVING;  //wait until the action ends.

                            }, 50);

                        });
                    })
                    .then(() => {
                        resolve();
                    })
                });
            },
        },      
        
        go_forward: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#ffffff',
            skeleton: 'basic',
            params: [
                {
                    type: "Indicator",                
                    img: 'block_icon/hardware_icon.svg',
                    size: 14
                }
            ],
            def: {
                type: "go_forward"
            },
            class: "base",
            isNotFor: ['zumi_mini'],
            func: function (sprite, script) {
                
                const Z_WAIT = 0;
                const Z_SEND_PACKET = 1;
                const Z_MOVING = 2;

                const READY = 0;
                const PROCESS = 1; 
                
                const COMMAND_GOGO = 1;
                
                //var exTime = new Date();
                //var firstCheck = true;
                var pStep = Z_WAIT;
                var iter = 0;
                var _exit = false;
               
                console.log("going forward block Start!");

                return new Promise(resolve => {
                    
                    new Promise(resolve => {
                        setTimeout(function () {
                            console.log("exCnt: " + exCnt + " tempCnt:" + tempCnt);
                            if (exCnt == tempCnt) {
                                _exit = true;
                            }
                            resolve();
                        }, 200);
                    })
                    .then(() => {
                        return new Promise(resolve => {  
                            
                            var ttt = setInterval(() => {

                                if (_exit == true) {
                                    console.log("skip block!");
                                    resolve();
                                    clearInterval(ttt);
                                }
                                
                                var _stat = Entry.hw.portData.inputData['pStat'];

                                if ((pStep == Z_WAIT) && (_stat == READY)) pStep = Z_SEND_PACKET;
                                else if ((pStep == Z_WAIT) && (_stat == PROCESS)) pStep = Z_WAIT;    //wait until other action ends.                       

                                if ((pStep == Z_SEND_PACKET) && (_stat == READY)) {    //send command until hardware start to action.

                                    if (iter < 5) {
                                        Entry.hw.sendQueue['com'] = COMMAND_GOGO;
                                        console.log("send protocol!");
                                    }
                                    else Entry.hw.sendQueue['com'] = 0x00;
                                    pStep = Z_SEND_PACKET;
                                    //iter++;
                                }
                                else if ((pStep == Z_SEND_PACKET) && (_stat == PROCESS)) {
                                    pStep = Z_MOVING;
                                    Entry.hw.sendQueue['com'] = 0x00;
                                }

                                if ((pStep == Z_MOVING) && (_stat == READY)) {

                                    console.log("block exit!");
                                    Entry.hw.sendQueue['com'] = 0x00;
                                    pStep = Z_WAIT;
                                    resolve();
                                    clearInterval(ttt);
                                }
                                else if ((pStep == Z_MOVING) && (_stat == PROCESS)) pStep = Z_MOVING;  //wait until the action ends.

                            }, 50);

                        });
                    })
                    .then(() => {
                        resolve();
                    })
                });
            },
        },      

        go_back: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#ffffff',
            skeleton: 'basic',
            params: [
                {
                    type: "Indicator",
                    img: 'block_icon/hardware_icon.svg',
                    size: 14
                }
            ],
            def: {
                type: "go_back"
            },
            class: "base",
            isNotFor: ['zumi_mini'],
            func: function (sprite, script) {

                const Z_WAIT = 0;
                const Z_SEND_PACKET = 1;
                const Z_MOVING = 2;

                const READY = 0;
                const PROCESS = 1;

                const COMMAND_BACK = 4;
               
                var pStep = Z_WAIT;
                var iter = 0;
                var _exit = false;

                console.log("going back block Start!");

                return new Promise(resolve => {
                    
                    new Promise(resolve => {
                        setTimeout(function () {
                            console.log("exCnt: " + exCnt + " tempCnt:" + tempCnt);
                            if (exCnt == tempCnt) {
                                _exit = true;
                            }
                            resolve();
                        }, 200);
                    })
                    .then(() => {
                        return new Promise(resolve => {  

                            var ttt = setInterval(() => {

                                if (_exit == true) {
                                    console.log("skip block!");
                                    resolve();
                                    clearInterval(ttt);
                                }

                                var _stat = Entry.hw.portData.inputData['pStat'];

                                if ((pStep == Z_WAIT) && (_stat == READY)) pStep = Z_SEND_PACKET;
                                else if ((pStep == Z_WAIT) && (_stat == PROCESS)) pStep = Z_WAIT;    //wait until other action ends.                       

                                if ((pStep == Z_SEND_PACKET) && (_stat == READY)) {    //send command until hardware start to action.

                                    if (iter < 5) {
                                        Entry.hw.sendQueue['com'] = COMMAND_BACK;
                                        console.log("send protocol!");
                                    }
                                    else Entry.hw.sendQueue['com'] = 0x00;
                                    pStep = Z_SEND_PACKET;
                                    //iter++;
                                }
                                else if ((pStep == Z_SEND_PACKET) && (_stat == PROCESS)) {
                                    pStep = Z_MOVING;
                                    Entry.hw.sendQueue['com'] = 0x00;
                                }

                                if ((pStep == Z_MOVING) && (_stat == READY)) {

                                    console.log("block exit!");
                                    Entry.hw.sendQueue['com'] = 0x00;
                                    pStep = Z_WAIT;
                                    resolve();
                                    clearInterval(ttt);
                                }
                                else if ((pStep == Z_MOVING) && (_stat == PROCESS)) pStep = Z_MOVING;  //wait until the action ends.                     

                            }, 50);

                        });                    
                    })
                    .then(() => {
                        resolve();
                    })                    
                });
            },
        },

        turn_left: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#ffffff',
            skeleton: 'basic',
            params: [
                {
                    type: "Indicator",
                    img: 'block_icon/hardware_icon.svg',
                    size: 14
                }
            ],
            def: {
                type: "turn_left"
            },
            class: "base",
            isNotFor: ['zumi_mini'],
            func: function (sprite, script) {

                const Z_WAIT = 0;
                const Z_SEND_PACKET = 1;
                const Z_MOVING = 2;

                const READY = 0;
                const PROCESS = 1;

                const COMMAND_LEFT = 2;

                var pStep = Z_WAIT;
                var iter = 0;
                var _exit = false;

                console.log("turning left block Start!");

                return new Promise(resolve => {

                    new Promise(resolve => {                        
                        setTimeout(function () {
                            console.log("exCnt: " + exCnt + " tempCnt:" + tempCnt);
                            if (exCnt == tempCnt) {
                                _exit = true;
                            }
                            resolve();
                        }, 200);
                    })
                    .then(() => { 
                        
                        return new Promise(resolve => {  
                            
                            var ttt = setInterval(() => {

                                if (_exit == true) {
                                    console.log("skip block!");
                                    resolve();
                                    clearInterval(ttt);
                                }                                        

                                var _stat = Entry.hw.portData.inputData['pStat'];

                                if ((pStep == Z_WAIT) && (_stat == READY)) pStep = Z_SEND_PACKET;
                                else if ((pStep == Z_WAIT) && (_stat == PROCESS)) pStep = Z_WAIT;    //wait until other action ends.                       

                                if ((pStep == Z_SEND_PACKET) && (_stat == READY)) {    //send command until hardware start to action.

                                    if (iter < 5) {
                                        Entry.hw.sendQueue['com'] = COMMAND_LEFT;
                                        console.log("send protocol!");
                                    }
                                    else Entry.hw.sendQueue['com'] = 0x00;
                                    pStep = Z_SEND_PACKET;
                                    //iter++;
                                }
                                else if ((pStep == Z_SEND_PACKET) && (_stat == PROCESS)) {
                                    pStep = Z_MOVING;
                                    Entry.hw.sendQueue['com'] = 0x00;
                                }

                                if ((pStep == Z_MOVING) && (_stat == READY)) {

                                    console.log("exit block!");
                                    Entry.hw.sendQueue['com'] = 0x00;
                                    pStep = Z_WAIT;
                                    resolve();
                                    clearInterval(ttt);
                                }
                                else if ((pStep == Z_MOVING) && (_stat == PROCESS)) pStep = Z_MOVING;  //wait until the action ends.

                            }, 50);                                                
                        
                        });
                    })
                    .then(() => {
                        resolve();
                    })                 

                });
            },
        },

        turn_right: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#ffffff',
            skeleton: 'basic',
            params: [
                {
                    type: "Indicator",
                    img: 'block_icon/hardware_icon.svg',
                    size: 14
                }
            ],
            def: {
                type: "turn_right"
            },
            class: "base",
            isNotFor: ['zumi_mini'],
            func: function (sprite, script) {

                const Z_WAIT = 0;
                const Z_SEND_PACKET = 1;
                const Z_MOVING = 2;

                const READY = 0;
                const PROCESS = 1;

                const COMMAND_RIGHT = 3;

                var pStep = Z_WAIT;
                var iter = 0;
                var _exit = false;

                console.log("turning right block Start!");

                return new Promise(resolve => {

                    new Promise(resolve => {
                        setTimeout(function () {
                            console.log("exCnt: " + exCnt + " tempCnt:" + tempCnt);
                            if (exCnt == tempCnt) {
                                _exit = true;
                            }
                            resolve();
                        }, 200);
                    })
                    .then(() => { 

                        return new Promise(resolve => {                                                       
                            
                            var ttt = setInterval(() => {

                                if (_exit == true) {
                                    console.log("skip block!");
                                    resolve();
                                    clearInterval(ttt);
                                }                               
                               
                                var _stat = Entry.hw.portData.inputData['pStat'];

                                if ((pStep == Z_WAIT) && (_stat == READY)) pStep = Z_SEND_PACKET;
                                else if ((pStep == Z_WAIT) && (_stat == PROCESS)) pStep = Z_WAIT;    //wait until other action ends.                       

                                if ((pStep == Z_SEND_PACKET) && (_stat == READY)) {    //send command until hardware start to action.

                                    if (iter < 5) {
                                        Entry.hw.sendQueue['com'] = COMMAND_RIGHT;
                                        console.log("send protocol!");
                                    }
                                    else Entry.hw.sendQueue['com'] = 0x00;
                                    pStep = Z_SEND_PACKET;
                                    //iter++;
                                }
                                else if ((pStep == Z_SEND_PACKET) && (_stat == PROCESS)) {
                                    pStep = Z_MOVING;
                                    Entry.hw.sendQueue['com'] = 0x00;
                                }

                                if ((pStep == Z_MOVING) && (_stat == READY)) {

                                    console.log("exit block!");
                                    Entry.hw.sendQueue['com'] = 0x00;
                                    pStep = Z_WAIT;
                                    resolve();
                                    clearInterval(ttt);
                                }
                                else if ((pStep == Z_MOVING) && (_stat == PROCESS)) pStep = Z_MOVING;  //wait until the action ends.

                            }, 50);

                        });

                    })
                    .then(() => {
                        resolve();
                    })   

                });
            },
        },

        going_forward_until_sensing: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#ffffff',
            skeleton: 'basic',
            params: [
                {
                    type: "Indicator",
                    img: 'block_icon/hardware_icon.svg',
                    size: 14
                }
            ],
            def: {
                type: "going_forward_until_sensing"
            },
            class: "sense",
            isNotFor: ['zumi_mini'],
            func: function (sprite, script) {

                const Z_WAIT = 0;
                const Z_SEND_PACKET = 1;
                const Z_MOVING = 2;

                const READY = 0;
                const PROCESS = 1;

                const COMMAND_GOSENSOR = 100;

                var pStep = Z_WAIT;
                var iter = 0;
                var _exit = false;

                console.log("going forward until sensing block Start!");

                return new Promise(resolve => {

                    new Promise(resolve => {
                        setTimeout(function () {
                            console.log("exCnt: " + exCnt + " tempCnt:" + tempCnt);
                            if (exCnt == tempCnt) {
                                _exit = true;
                            }
                            resolve();
                        }, 200);
                    })
                    .then(() => { 
                        return new Promise(resolve => { 

                            var ttt = setInterval(() => {

                                if (_exit == true) {
                                    console.log("skip block!");
                                    resolve();
                                    clearInterval(ttt);
                                } 

                                var _stat = Entry.hw.portData.inputData['pStat'];

                                if ((pStep == Z_WAIT) && (_stat == READY)) pStep = Z_SEND_PACKET;
                                else if ((pStep == Z_WAIT) && (_stat == PROCESS)) pStep = Z_WAIT;    //wait until other action ends.                       

                                if ((pStep == Z_SEND_PACKET) && (_stat == READY)) {    //send command until hardware start to action.

                                    if (iter < 5) {
                                        Entry.hw.sendQueue['com'] = COMMAND_GOSENSOR;
                                        console.log("send protocol!");
                                    }
                                    else Entry.hw.sendQueue['com'] = 0x00;
                                    pStep = Z_SEND_PACKET;
                                    //iter++;
                                }
                                else if ((pStep == Z_SEND_PACKET) && (_stat == PROCESS)) {
                                    pStep = Z_MOVING;
                                    Entry.hw.sendQueue['com'] = 0x00;
                                }

                                if ((pStep == Z_MOVING) && (_stat == READY)) {

                                    console.log("block exit!");
                                    Entry.hw.sendQueue['com'] = 0x00;
                                    pStep = Z_WAIT;
                                    resolve();
                                    clearInterval(ttt);
                                }
                                else if ((pStep == Z_MOVING) && (_stat == PROCESS)) pStep = Z_MOVING;  //wait until the action ends.

                            }, 50);

                        });                    
                    })
                    .then(() => {
                        resolve();
                    }) 
                });
            },
        },

        following_line_until_sensing: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#ffffff',
            skeleton: 'basic',
            params: [
                {
                    type: "Indicator", 
                    img: 'block_icon/hardware_icon.svg',
                    size: 14,
                }
            ],
            def: {
                type: "following_line_until_sensing"
            },
            class: "sense",
            isNotFor: ['zumi_mini'],
            func: function (sprite, script) {

                const Z_WAIT = 0;
                const Z_SEND_PACKET = 1;
                const Z_MOVING = 2;

                const READY = 0;
                const PROCESS = 1;

                const COMMAND_LINE_TRACING = 101;

                var pStep = Z_WAIT;
                var iter = 0;
                var _exit = false;

                console.log("following line until sensing block Start!");

                return new Promise(resolve => {

                    new Promise(resolve => {
                        setTimeout(function () {
                            console.log("exCnt: " + exCnt + " tempCnt:" + tempCnt);
                            if (exCnt == tempCnt) {
                                _exit = true;
                            }
                            resolve();
                        }, 200);
                    })
                    .then(() => { 
                        return new Promise(resolve => { 

                            var ttt = setInterval(() => {

                                if (_exit == true) {
                                    console.log("skip block!");
                                    resolve();
                                    clearInterval(ttt);
                                }

                                var _stat = Entry.hw.portData.inputData['pStat'];

                                if ((pStep == Z_WAIT) && (_stat == READY)) pStep = Z_SEND_PACKET;
                                else if ((pStep == Z_WAIT) && (_stat == PROCESS)) pStep = Z_WAIT;    //wait until other action ends.                       

                                if ((pStep == Z_SEND_PACKET) && (_stat == READY)) {    //send command until hardware start to action.

                                    if (iter < 5) {
                                        Entry.hw.sendQueue['com'] = COMMAND_LINE_TRACING;
                                        console.log("send protocol!");
                                    }
                                    else Entry.hw.sendQueue['com'] = 0x00;
                                    pStep = Z_SEND_PACKET;
                                    //iter++;
                                }
                                else if ((pStep == Z_SEND_PACKET) && (_stat == PROCESS)) {
                                    pStep = Z_MOVING;
                                    Entry.hw.sendQueue['com'] = 0x00;
                                }

                                if ((pStep == Z_MOVING) && (_stat == READY)) {

                                    console.log("block exit!");
                                    Entry.hw.sendQueue['com'] = 0x00;
                                    pStep = Z_WAIT;
                                    resolve();
                                    clearInterval(ttt);
                                }
                                else if ((pStep == Z_MOVING) && (_stat == PROCESS)) pStep = Z_MOVING;  //wait until the action ends.

                            }, 50); 
                        });        

                    })
                    .then(() => {
                        resolve();
                    })                

                });
            },
        },

        
        front_sensor: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#ffffff',
            skeleton: 'basic_string_field',
            params: [                
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.FL, 'FL'],
                        [Lang.Blocks.FR, 'FR'],                                           
                    ],
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 14,
                },
            ],
            def: {
                params: ['FL', null],
                type: 'front_sensor',
            },
            paramsKeyMap: {
                DIR: 0,
            },
            class: 'info',
            isNotFor: ['zumi_mini'],
            func: function(sprite, script) {
                const sen = script.getStringField('DIR', script);
                return Entry.hw.portData.inputData.irSensor[sen];
            },
        },

        bottom_sensor: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#ffffff',
            skeleton: 'basic_string_field',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.BL, 'BL'],
                        [Lang.Blocks.BM, 'BM'],
                        [Lang.Blocks.BR, 'BR'],
                    ],
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 14,
                },
            ],
            def: {
                params: ['BL', null],
                type: 'bottom_sensor',
            },
            paramsKeyMap: {
                B_DIR: 0,
            },
            class: 'info',
            isNotFor: ['zumi_mini'],
            func: function (sprite, script) {
                const sen = script.getStringField('B_DIR', script);
                return Entry.hw.portData.inputData.irSensor[sen];
            },
        },

        power_info: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#ffffff',
            skeleton: 'basic_string_field',
            params: [
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            def: {
                type: 'power_info',
            },
            class: 'info',
            isNotFor: ['zumi_mini'],
            func: function (sprite, script) {                
                var vol = Entry.hw.portData.inputData.euler['PITCH'];
                return vol;
            },
        },

        button_input: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#ffffff',
            skeleton: 'basic_string_field',
            params: [               
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            def: {
                type: 'button_input',
            },           
            class: 'info',
            isNotFor: ['zumi_mini'],
            func: function (sprite, script) {                
                
                var bStat =  Entry.hw.portData.inputData.euler['ROLL'];
                if(bStat == 8) bStat = 'R';
                else if(bStat == 4) bStat = 'B';
                else if(bStat == 2) bStat = 'G';
                else if(bStat == 1) bStat = 'Y';
                else bStat = 'N';
                
                return bStat;
            },
        },

        button_boolean_input: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#ffffff',
            skeleton: 'basic_boolean_field',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.RED_BTN, 'RED_BTN'],
                        [Lang.Blocks.BLUE_BTN, 'BLUE_BTN'],
                        [Lang.Blocks.GREEN_BTN, 'GREEN_BTN'],
                        [Lang.Blocks.YELLOW_BTN, 'YELLOW_BTN'],
                    ],
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.PRESSED, 'PRESS'],
                        [Lang.Blocks.RELEASED, 'RELEASE'],                       
                    ],
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },               
            ],
            def: {
                params: ['RED_BTN','PRESS'],
                type: 'button_boolean_input',
            },
            paramsKeyMap: {
                BUTTON: 0,
                STATUS: 1,
            },
            class: 'boolean',
            isNotFor: ['zumi_mini'],
            func: function (sprite, script) {

                const btn = script.getStringField('BUTTON', script);
                const stat = script.getStringField('STATUS', script);
                var bStat = Entry.hw.portData.inputData.euler['ROLL'];
                var result = false;
                
                if (stat == 'PRESS') 
                {
                    if((btn == 'RED_BTN')&&(bStat == 8)) result = true;
                    else if((btn == 'BLUE_BTN') && (bStat == 4)) result = true;
                    else if((btn == 'GREEN_BTN') && (bStat == 2)) result = true;
                    else if((btn == 'YELLOW_BTN') && (bStat == 1)) result = true;
                    else result = false;
                }
                else if (stat == 'RELEASE') 
                {
                    if ((btn == 'RED_BTN') && (bStat == 8)) result = false;
                    else if ((btn == 'BLUE_BTN') && (bStat == 4)) result = false;
                    else if ((btn == 'GREEN_BTN') && (bStat == 2)) result = false;
                    else if ((btn == 'YELLOW_BTN') && (bStat == 1)) result = false;
                    else result = true;
                }              
               
                return result;
            },
        },

        face_detector: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#ffffff',
            skeleton: 'basic_string_field',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.DETECT, 'DETECT'],
                        [Lang.Blocks.CX, 'CX'],
                        [Lang.Blocks.CY, 'CY'],
                    ],
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 14,
                },
            ],
            def: {
                params: ['DETECT', null],
                type: 'face_detector',
            },
            paramsKeyMap: {
                PARAM: 0,
            },
            class: 'info',
            isNotFor: ['zumi_mini'],
            func: function (sprite, script) {
                
                const REQUEST_FACE_DETECTION = 0x01;
                Entry.hw.sendQueue['req'] |= REQUEST_FACE_DETECTION;
                const sen = script.getStringField('PARAM', script);
                var result =  Entry.hw.portData.inputData.faceDetect[sen];

                var Xg = Entry.hw.portData.inputData.faceDetect['CX'];
                var Yg = Entry.hw.portData.inputData.faceDetect['CY'];

                if (sen == 'CX') {
                    if (result == 0x00) result = -999;
                    else result = ((200 / 2) - Xg) + 10;
                }
                else if (sen == 'CY') {
                    if (result == 0x00) result = -999;
                    else result = (200 / 2) - Yg;
                }             
               
                return result;
            },
        },

        cat_face_detector: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#ffffff',
            skeleton: 'basic_string_field',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.DETECT, 'DETECT'],
                        [Lang.Blocks.CX, 'CX'],
                        [Lang.Blocks.CY, 'CY'],
                    ],
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 14,
                },
            ],
            def: {
                params: ['DETECT', null],
                type: 'cat_face_detector',
            },
            paramsKeyMap: {
                PARAM: 0,
            },
            class: 'info',
            isNotFor: ['zumi_mini'],
            func: function (sprite, script) {           
                
                const REQUEST_USER_DEFINED = 0x10;
                Entry.hw.sendQueue['req'] |= REQUEST_USER_DEFINED;
                const sen = script.getStringField('PARAM', script);
                var result = Entry.hw.portData.inputData.userDefined[sen];

                var Xg = Entry.hw.portData.inputData.userDefined['CX'];
                var Yg = Entry.hw.portData.inputData.userDefined['CY'];

                if (sen == 'CX') {
                    if (result == 0x00) result = -999;
                    else result = ((200 / 2) - Xg) + 20;
                }
                else if (sen == 'CY') {
                    if (result == 0x00) result = -999;
                    else result = ((200 / 2) - Yg) + 20;
                }

                return result;                
            },
        },

        face_boolean_detector: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#ffffff',
            skeleton: 'basic_boolean_field',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.HUMAN, 'HUMAN'],
                        [Lang.Blocks.CAT, 'CAT'],
                    ],
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },               
            ],
            def: {
                params: ['HUMAN'],
                type: 'face_boolean_detector',
            },
            paramsKeyMap: {
                FACE: 0,
            },
            class: 'boolean',
            isNotFor: ['zumi_mini'],
            func: function (sprite, script) {

                var result = false;

                const REQUEST_FACE_DETECTION = 0x01;   //humanface
                const REQUEST_USER_DEFINED = 0x10;     //catface         
                               
                const sen = script.getStringField('FACE', script);
                
                if(sen == 'HUMAN')
                {
                    Entry.hw.sendQueue['req'] |= REQUEST_FACE_DETECTION;
                    var humanResult = Entry.hw.portData.inputData.faceDetect['DETECT'];
                    if(humanResult != 0) result = true;
                    else result = false;                   
                }
                else if(sen == 'CAT')
                {
                    Entry.hw.sendQueue['req'] |= REQUEST_USER_DEFINED;
                    var catResult = Entry.hw.portData.inputData.userDefined['DETECT'];
                    if(catResult != 0) result = true;
                    else result = false;                   
                }      

                return result;
            },
        },


        color_detector: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#ffffff',
            skeleton: 'basic_string_field',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.COLOR, 'COLOR'],
                        [Lang.Blocks.CX, 'CX'],
                        [Lang.Blocks.CY, 'CY'],
                    ],
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 14,
                },
            ],
            def: {
                params: ['COLOR', null],
                type: 'color_detector',
            },
            paramsKeyMap: {
                PARAM: 0,
            },
            class: 'info',
            isNotFor: ['zumi_mini'],
            func: function (sprite, script) { 

                const REQUEST_COLOR_DETECTION = 0x02;
                Entry.hw.sendQueue['req'] |= REQUEST_COLOR_DETECTION;
                
                const sen = script.getStringField('PARAM', script);
                var result = Entry.hw.portData.inputData.colorDetect[sen];

                if((result == 0xFE) && (sen == 'COLOR')) result = 'NONE';
                else if ((result == 0x00) && (sen == 'COLOR')) result = 'RED';
                else if ((result == 0x01) && (sen == 'COLOR')) result = 'ORANGE';
                else if ((result == 0x02) && (sen == 'COLOR')) result = 'YELLOW';
                else if ((result == 0x03) && (sen == 'COLOR')) result = 'GREEN';
                else if ((result == 0x04) && (sen == 'COLOR')) result = 'CYAN';
                else if ((result == 0x05) && (sen == 'COLOR')) result = 'BLUE';
                else if ((result == 0x06) && (sen == 'COLOR')) result = 'PURPLE';                

                var Xg = Entry.hw.portData.inputData.colorDetect['CX'];
                var Yg = Entry.hw.portData.inputData.colorDetect['CY'];

                if (sen == 'CX') {
                    if (result == 0x00) result = -999;
                    else result = ((200 / 2) - Xg);
                }
                else if (sen == 'CY') {
                    if (result == 0x00) result = -999;
                    else result = ((200 / 2) - Yg);
                }             

                return result;
            },
        },

        color_boolean_detector: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#ffffff',
            skeleton: 'basic_boolean_field',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.AI_RED, 'RED'],
                        [Lang.Blocks.AI_ORANGE, 'ORANGE'],
                        [Lang.Blocks.AI_YELLOW, 'YELLOW'],
                        [Lang.Blocks.AI_GREEN, 'GREEN'],
                        [Lang.Blocks.AI_CYAN, 'CYAN'],
                        [Lang.Blocks.AI_BLUE, 'BLUE'],
                        [Lang.Blocks.AI_PURPLE, 'PURPLE'],
                    ],
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },             
            ],
            def: {
                params: ['RED'],
                type: 'color_boolean_detector',
            },
            paramsKeyMap: {
                PARAM: 0,
            },
            class: 'boolean',
            isNotFor: ['zumi_mini'],
            func: function (sprite, script) { 

                var result = false;
                
                const REQUEST_COLOR_DETECTION = 0x02;
                Entry.hw.sendQueue['req'] |= REQUEST_COLOR_DETECTION;
                
                const sen = script.getStringField('PARAM', script);
                var result = Entry.hw.portData.inputData.colorDetect['COLOR'];

                //if(result == 0xFE) result = false;

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
        

        april_detector: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#ffffff',
            skeleton: 'basic_string_field',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.ID, 'ID'],
                        [Lang.Blocks.CX, 'CX'],
                        [Lang.Blocks.CY, 'CY'],                       
                    ],
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 14,
                },
            ],
            def: {
                params: ['ID', null],
                type: 'april_detector',
            },
            paramsKeyMap: {
                A_INFO: 0,
            },
            class: 'info',
            isNotFor: ['zumi_mini'],
            func: function (sprite, script) {

                var result = 0;

                const REQUEST_APRIL_DETECTION = 0x04;
                Entry.hw.sendQueue['req'] |= REQUEST_APRIL_DETECTION;

                const sen = script.getStringField('A_INFO', script);
                var result = Entry.hw.portData.inputData.aprilDetect[sen];

                var Xg = Entry.hw.portData.inputData.aprilDetect['CX'];
                var Yg = Entry.hw.portData.inputData.aprilDetect['CY'];

                
                if(sen == 'ID')
                {
                    if(result == 0xFE) result = -1;
                }                
                else if(sen == 'CX')
                {
                    if(result == 0x00) result = -999;
                    else result = (200 / 2) - Xg;
                }
                else if (sen == 'CY') 
                {
                    if (result == 0x00) result = -999;
                    else result = (100 / 2) - Yg;
                }                
              
                return result;
            },
        },

        april_boolean_detector: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#ffffff',
            skeleton: 'basic_boolean_field',
            params: [               
                {
                    type: 'Block',
                    accept: 'string',
                },
            ],
            def: {
                params: [18],
                type: 'april_boolean_detector',
            },
            paramsKeyMap: {
                NUM: 0,
            },
            class: 'boolean',
            isNotFor: ['zumi_mini'],
            func: function (sprite, script) {

                var result = false;

                const REQUEST_APRIL_DETECTION = 0x04;
                Entry.hw.sendQueue['req'] |= REQUEST_APRIL_DETECTION;

                var _num = script.getNumberValue('NUM');                
                var result = Entry.hw.portData.inputData.aprilDetect['ID'];

                if(_num == result) result = true;
                else result = false;              

                return result;
            },
        },

        IMU_sensor: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#ffffff',
            skeleton: 'basic_string_field',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.ROLL, 'ROLL'],
                        [Lang.Blocks.PITCH, 'PITCH'],
                        [Lang.Blocks.YAW, 'YAW'],
                    ],
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 14,
                },
            ],
            def: {
                params: ['PITCH', null],
                type: 'IMU_sensor',
            },
            paramsKeyMap: {
                EULER: 0,
            },
            class: 'info',
            isNotFor: ['zumi_mini'],
            func: function (sprite, script) {

                const REQUEST_IMU_DETECTION = 0x08;
                Entry.hw.sendQueue['req'] |= REQUEST_IMU_DETECTION;
                const sen = script.getStringField('EULER', script);
                const angle = Entry.hw.portData.inputData.euler[sen];
                return angle;
                
            },
        },

        screen_toggle: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#ffffff',
            skeleton: 'basic',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.CAMERA, 'CAMERA'],
                        [Lang.Blocks.EMOTION, 'EMOTION'],                      
                    ],
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 14,
                },
            ],
            def: {
                params: ['CAMERA', null],
                type: 'screen_toggle',
            },
            paramsKeyMap: {
                TYPE: 0,
            },
            class: 'screen',
            isNotFor: ['zumi_mini'],
            func: function (sprite, script) {

                const COMMAND_SCREEN_TOGGLE = 240;
                const SCREEN_CAMERA = 1;
                const SCREEN_EMOTION = 2;
                               
                var _type = script.getStringField('TYPE', script);

                Entry.hw.sendQueue['com'] = COMMAND_SCREEN_TOGGLE;

                if (_type == 'CAMERA') Entry.hw.sendQueue['speed'] = SCREEN_CAMERA;
                else if (_type == 'EMOTION') Entry.hw.sendQueue['speed'] = SCREEN_EMOTION;               

                console.log("send protocol!");
            },
        },

        emotion: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#ffffff',
            skeleton: 'basic',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.EMO_SMILE, 'SMILE'],
                        [Lang.Blocks.EMO_LOVE, 'LOVE'],
                        [Lang.Blocks.EMO_SURPRISE, 'SURP'],
                        [Lang.Blocks.EMO_NICE, 'NICE'],
                        [Lang.Blocks.EMO_CHAOS, 'CHAOS'],
                        [Lang.Blocks.EMO_CRASH, 'CRASH'],
                        [Lang.Blocks.EMO_CANTBELIEVE, 'CANTBELIEVE'],
                        [Lang.Blocks.EMO_SLEEP, 'SLEEP'],
                        [Lang.Blocks.EMO_CRY, 'CRY'],
                        [Lang.Blocks.EMO_WINK, 'WINK'],
                        [Lang.Blocks.EMO_BLINK, 'BLINK'],
                        [Lang.Blocks.EMO_STOP, 'STOP'],
                    ],
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 14,
                },
            ],
            def: {
                params: ['SMILE', null],
                type: 'emotion',
            },
            paramsKeyMap: {
                TYPE: 0,
            },
            class: 'screen',
            isNotFor: ['zumi_mini'],
            func: function (sprite, script) {

                const COMMAND_EMOTION_CHANGE = 241;
                const EMO_BLINK = 1;
                const EMO_STOP = 2;
                const EMO_SMILE = 3;
                const EMO_LOVE = 4;
                const EMO_CRASH = 5;
                const EMO_SURPRISE = 6;
                const EMO_NICE = 7;
                const EMO_CANTBELIEVE = 8;
                const EMO_SLEEP = 9;
                const EMO_CRY = 10;
                const EMO_CHAOS = 11;               
                const EMO_WINK = 14;               

                var _type = script.getStringField('TYPE', script);

                Entry.hw.sendQueue['com'] = COMMAND_EMOTION_CHANGE;

                if (_type == 'SMILE') Entry.hw.sendQueue['speed'] = EMO_SMILE;
                else if (_type == 'LOVE') Entry.hw.sendQueue['speed'] = EMO_LOVE;
                else if (_type == 'SURP') Entry.hw.sendQueue['speed'] = EMO_SURPRISE;
                else if (_type == 'NICE') Entry.hw.sendQueue['speed'] = EMO_NICE;
                else if (_type == 'CHAOS') Entry.hw.sendQueue['speed'] = EMO_CHAOS;
                else if (_type == 'CRASH') Entry.hw.sendQueue['speed'] = EMO_CRASH;
                else if (_type == 'CANTBELIEVE') Entry.hw.sendQueue['speed'] = EMO_CANTBELIEVE;
                else if (_type == 'SLEEP') Entry.hw.sendQueue['speed'] = EMO_SLEEP;
                else if (_type == 'CRY') Entry.hw.sendQueue['speed'] = EMO_CRY;
                else if (_type == 'WINK') Entry.hw.sendQueue['speed'] = EMO_WINK;
                else if (_type == 'BLINK') Entry.hw.sendQueue['speed'] = EMO_BLINK;
                else if (_type == 'STOP') Entry.hw.sendQueue['speed'] = EMO_STOP;

                console.log("send protocol!");
            },
        },
        
        play_sound: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#ffffff',
            skeleton: 'basic',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.SND_USER, 'USER'],
                        [Lang.Blocks.SND_CAT, 'CAT'],
                        [Lang.Blocks.SND_SHUTTER, 'SHUTTER'],
                        [Lang.Blocks.SND_FAIL, 'FAIL'],
                        [Lang.Blocks.SND_SUCCESS, 'SUCCESS'],   
                        [Lang.Blocks.SND_FAIL2, 'FAIL2'],
                        [Lang.Blocks.SND_HONK, 'HONK'],
                        [Lang.Blocks.SND_HONK2, 'HONK2'],                       
                        [Lang.Blocks.SND_SIREN, 'SIREN'],                      
                    ],
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 14,
                },
            ],
            def: {
                params: ['USER', null],
                type: 'play_sound',
            },
            paramsKeyMap: {
                TYPE: 0,
            },
            class: 'base',
            isNotFor: ['zumi_mini'],
            func: function (sprite, script) {

                const COMMAND_PLAY_SOUND = 242;
                const SND_USER = 0;
                const SND_CAT = 4;
                const SND_SHUTTER = 5;
                const SND_FAIL = 1;
                const SND_SUCCESS = 3;
                const SND_FAIL2 = 2;
                const SND_HONK = 6;
                const SND_HONK2 = 7;
                const SND_SIREN = 8;               

                var _type = script.getStringField('TYPE', script);

                Entry.hw.sendQueue['com'] = COMMAND_PLAY_SOUND;

                if (_type == 'USER') Entry.hw.sendQueue['speed'] = SND_USER;
                else if (_type == 'CAT') Entry.hw.sendQueue['speed'] = SND_CAT;
                else if (_type == 'SHUTTER') Entry.hw.sendQueue['speed'] = SND_SHUTTER;
                else if (_type == 'FAIL') Entry.hw.sendQueue['speed'] = SND_FAIL;
                else if (_type == 'SUCCESS') Entry.hw.sendQueue['speed'] = SND_SUCCESS;
                else if (_type == 'FAIL2') Entry.hw.sendQueue['speed'] = SND_FAIL2;
                else if (_type == 'HONK') Entry.hw.sendQueue['speed'] = SND_HONK;
                else if (_type == 'HONK2') Entry.hw.sendQueue['speed'] = SND_HONK2;
                else if (_type == 'SIREN') Entry.hw.sendQueue['speed'] = SND_SIREN;
                console.log("send protocol!");
            },
        },
        
        LED_control: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#ffffff',
            skeleton: 'basic',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.RED, 'RED'],
                        [Lang.Blocks.GREEN, 'GREEN'],
                        [Lang.Blocks.BLUE, 'BLUE'],
                        [Lang.Blocks.YELLOW, 'YELLOW'],
                        [Lang.Blocks.SKY_BLUE, 'SKY_BLUE'],
                        [Lang.Blocks.PINK, 'PINK'], 
                        [Lang.Blocks.WHITE, 'WHITE'],
                    ],
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.LED_NORMAL, 'NORMAL'],
                        [Lang.Blocks.LED_BLINK, 'BLINK'],
                        [Lang.Blocks.LED_DIMMING, 'DIMMING'],
                        [Lang.Blocks.LED_SUNRISE, 'SUNRISE'],
                        [Lang.Blocks.LED_SUNSET, 'SUNSET'],
                        [Lang.Blocks.LED_FLICKER, 'FLICKER'],
                        [Lang.Blocks.LED_RAINBOW, 'RAINBOW'],                     
                    ],
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
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                { type: 'Indicator', img: 'block_icon/hardware_icon.svg', size: 14 },
            ],
            def: {
                params: ['WHITE', 'NORMAL', 'ON', null],
                type: 'LED_control',
            },
            paramsKeyMap: {
                COLOR: 0,
                EFFECT: 1,
                ACTION: 2,
            },
            class: "led",
            isNotFor: ['zumi_mini'],
            func: function (sprite, script) {

                const Z_WAIT = 0;
                const Z_SEND_PACKET = 1;
                const Z_MOVING = 2;

                const READY = 0;
                const PROCESS = 1;

                const COMMAND_LED_CONTROL = 31;

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
                
                const LED_OFF = 0;
                const LED_ON = 1;

                //var exTime = new Date();
                //var firstCheck = true;
                var pStep = Z_WAIT;
                var iter = 0;
                var _exit = false;

                console.log("LED block Start!");

                var _col = script.getStringField('COLOR', script);
                var _eff = script.getStringField('EFFECT', script);
                var _act = script.getStringField('ACTION', script);

                return new Promise(resolve => {

                    new Promise(resolve => {
                        setTimeout(function () {
                            console.log("exCnt: " + exCnt + " tempCnt:" + tempCnt);
                            if (exCnt == tempCnt) {
                                _exit = true;

                            }
                            resolve();
                        }, 200);
                    })
                    .then(() => {

                        return new Promise(resolve => {
                            var ttt = setInterval(() => {

                                if (_exit == true) {
                                    console.log("block skip!");
                                    resolve();
                                    clearInterval(ttt);
                                }

                                var _stat = Entry.hw.portData.inputData['pStat'];

                                if ((pStep == Z_WAIT) && (_stat == READY)) pStep = Z_SEND_PACKET;
                                else if ((pStep == Z_WAIT) && (_stat == PROCESS)) pStep = Z_WAIT;    //wait until other action ends.                       

                                if ((pStep == Z_SEND_PACKET) && (_stat == READY)) {    //send command until hardware start to action.

                                    if (iter < 5) {

                                        Entry.hw.sendQueue['com'] = COMMAND_LED_CONTROL;

                                        if ((_col == 'RED') && (_act == 'ON')) Entry.hw.sendQueue['speed'] = LED_RED;
                                        else if ((_col == 'BLUE') && (_act == 'ON')) Entry.hw.sendQueue['speed'] = LED_BLUE;
                                        else if ((_col == 'GREEN') && (_act == 'ON')) Entry.hw.sendQueue['speed'] = LED_GREEN;
                                        else if ((_col == 'SKY_BLUE') && (_act == 'ON')) Entry.hw.sendQueue['speed'] = LED_SKY_BLUE;
                                        else if ((_col == 'PINK') && (_act == 'ON')) Entry.hw.sendQueue['speed'] = LED_PINK;
                                        else if ((_col == 'YELLOW') && (_act == 'ON')) Entry.hw.sendQueue['speed'] = LED_YELLOW;
                                        else if ((_col == 'WHITE') && (_act == 'ON')) Entry.hw.sendQueue['speed'] = LED_WHITE;
                                       
                                        if (_eff == 'NORMAL') Entry.hw.sendQueue['dist'] = LED_NORMAL;
                                        else if (_eff == 'BLINK') Entry.hw.sendQueue['dist'] = LED_BLINK;
                                        else if (_eff == 'FLICKER') Entry.hw.sendQueue['dist'] = LED_FLICKER;
                                        else if (_eff == 'DIMMING') Entry.hw.sendQueue['dist'] = LED_DIMMING;
                                        else if (_eff == 'SUNRISE') Entry.hw.sendQueue['dist'] = LED_SUNRISE;
                                        else if (_eff == 'SUNSET') Entry.hw.sendQueue['dist'] = LED_SUNSET;
                                        else if (_eff == 'RAINBOW') Entry.hw.sendQueue['dist'] = LED_RAINBOW;
                                        
                                        if (_act == 'OFF') Entry.hw.sendQueue['dir'] = LED_OFF;
                                        else Entry.hw.sendQueue['dir'] = LED_ON;

                                        console.log("send protocol!");
                                    }
                                    else Entry.hw.sendQueue['com'] = 0x00;

                                    pStep = Z_SEND_PACKET;
                                    //iter++;
                                }
                                else if ((pStep == Z_SEND_PACKET) && (_stat == PROCESS)) {
                                    pStep = Z_MOVING;
                                    Entry.hw.sendQueue['com'] = 0x00;
                                }

                                if ((pStep == Z_MOVING) && (_stat == READY)) {

                                    console.log("block exit!");
                                    Entry.hw.sendQueue['com'] = 0x00;
                                    pStep = Z_WAIT;
                                    resolve();
                                    clearInterval(ttt);
                                }
                                else if ((pStep == Z_MOVING) && (_stat == PROCESS)) pStep = Z_MOVING;  //wait until the action ends.                     

                            }, 50);

                        });

                    })
                    .then(() => {
                        resolve();
                    })

                });
            },
        },

        motor_control: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#ffffff',
            skeleton: 'basic',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.M1, 'LEFT'],
                        [Lang.Blocks.M2, 'RIGHT'],
                    ],
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.CW, 'CW'],
                        [Lang.Blocks.CCW, 'CCW'],
                        [Lang.Blocks.STOP, 'STOP'],
                    ],
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Block',
                    accept: 'string',
                },
                {
                    type: "Indicator",
                    img: 'block_icon/hardware_icon.svg',
                    size: 14
                },
            ],
            def: {
                params: ['LEFT', 'CW', 5, null],
                type: 'motor_control',
            },
            paramsKeyMap: {
                NUM: 0,
                DIR: 1,
                SPD: 2,
            },
            class: "move",
            isNotFor: ['zumi_mini'],
            func: function (sprite, script) {

                const Z_WAIT = 0;
                const Z_SEND_PACKET = 1;
                const Z_MOVING = 2;

                const READY = 0;
                const PROCESS = 1;

                const COMMAND_MOTOR1_INFINITE = 32;
                const COMMAND_MOTOR2_INFINITE = 33;
                const DIR_LEFT = 1;
                const DIR_RIGHT = 2;
                const DIR_STOP = 3;
              
                var pStep = Z_WAIT;
                var iter = 0;
                var _exit = false;

                console.log("go motor control block Start!");

                var _num = script.getStringField('NUM', script)
                var _dir = script.getStringField('DIR', script);
                var _spd = script.getNumberValue('SPD');

                var tSpd = Entry.hw.sendQueue['speed'];
                var tDir = Entry.hw.sendQueue['dir'];

                var ex_com = Entry.hw.sendQueue['com'];

                //if ((ex_com != COMMAND_MOTOR1_INFINITE)|| (ex_com != COMMAND_MOTOR2_INFINITE)) {
                    //tSpd = 0x00; tDir = 0x00;
                //}              

                var _dirInt = 0;

                if(_num == 'LEFT') {
                    if (_dir == 'CW') _dirInt = DIR_RIGHT;
                    else if (_dir == 'CCW') _dirInt = DIR_LEFT;
                    else if (_dir == 'STOP') _dirInt = DIR_STOP;
                }
                if (_num == 'RIGHT') {
                    if (_dir == 'CW') _dirInt = DIR_LEFT;
                    else if (_dir == 'CCW') _dirInt = DIR_RIGHT;
                    else if (_dir == 'STOP') _dirInt = DIR_STOP;
                }                

                if (_spd < 0) _spd = 0; else if (_spd > 10) _spd = 10;
                
                if (_num == 'LEFT') { 
                    Entry.hw.sendQueue['com'] = COMMAND_MOTOR1_INFINITE;                  
                    
                    tSpd = tSpd & 0b11110000;
                    tSpd = tSpd | _spd;
                    Entry.hw.sendQueue['speed'] = tSpd;

                    tDir = tDir & 0b11110000;
                    tDir = tDir | _dirInt;
                    Entry.hw.sendQueue['dir'] = tDir;                    
                }
                else if (_num == 'RIGHT') {
                    Entry.hw.sendQueue['com'] = COMMAND_MOTOR2_INFINITE;

                    tSpd = tSpd & 0b00001111;
                    tSpd = tSpd | (_spd << 4);
                    Entry.hw.sendQueue['speed'] = tSpd;

                    tDir = tDir & 0b00001111;
                    tDir = tDir | (_dirInt << 4);
                    Entry.hw.sendQueue['dir'] = tDir;
                }            

                console.log("send protocol!");
                
            },
        },       

    };
};

module.exports = Entry.ZumiMini;