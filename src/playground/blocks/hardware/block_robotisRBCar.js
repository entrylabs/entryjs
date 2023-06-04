'use strict';

Entry.Robotis_rb_car = {
    INSTRUCTION: {
        NONE: 0,
        WRITE: 3,
        READ: 2,
        SYNCWRITE: 4,
        REGWRITE: 5,
        ACTION: 6
    },
    CONTROL_TABLE: {
        // [default address, default length, address (when reads together), length (when reads together)]
        CM_LED_R: [79, 1],
        CM_LED_G: [80, 1],
        CM_LED_B: [81, 1],

        RB_LED_L: [40, 1],
        RB_LED_R: [41, 1],
        RB_LED_B: [40, 2],

        CM_BUZZER_INDEX: [60, 1], //[84, 1]
        CM_BUZZER_TIME: [63, 1], //[85, 1]
        CM_SOUND_DETECTED: [86, 1],
        CM_SOUND_DETECTING: [87, 1],
        CM_USER_BUTTON: [26, 1],
        CM_MOTION: [66, 2], //[66,1]

        AUX_SERVO_POSITION: [152, 2],
        
        AUX_CUSTOM: [216, 2],
        
        AUX_SERVO_MODE: [126, 1],
        AUX_SERVO_SPEED: [136, 2],
        AUX_MOTOR_SPEED: [136, 2],
        AUX_LED_MODULE: [210, 1],
    },
    DXL_POSITION: {
        values: [0,0,0,0,0,0,0,0]
    },
    setZero: function () {
        // instruction / address / length / value / default length
        Entry.hw.sendQueue['setZero'] = [1];
        Entry.Robotis_carCont.update();
        Entry.Robotis_carCont.setRobotisData(null);
        Entry.hw.sendQueue['setZero'] = null;
        Entry.Robotis_carCont.update();
        Entry.Robotis_carCont.setRobotisData([
            [Entry.Robotis_rb.INSTRUCTION.WRITE, 21, 2, 20],
            [Entry.Robotis_rb.INSTRUCTION.WRITE, 40, 2, 0],
            [Entry.Robotis_rb.INSTRUCTION.WRITE, 66, 2, 0],
            [Entry.Robotis_rb.INSTRUCTION.WRITE, 710, 2, 0],
            // [Entry.Robotis_rb.INSTRUCTION.WRITE, 163, 2, 30759],
            // [Entry.Robotis_rb.INSTRUCTION.WRITE, 162, 1, 1],
        ]);
        Entry.Robotis_carCont.update();
    },
    id: ['7.9'],
    name: 'Robotis_rb_car',
    url: 'http://www.robotis.com/index/product.php?cate_code=111310',
    imageName: 'robotis_RB100im_Rla.png',
    title: {
        "ko": "로보티즈 알라",
        "en": "ROBOTIS RLa"
    },
    delay: 30,
    readDelay: 30,
};

Entry.Robotis_rb_car.blockMenuBlocks = [
    'robotis_RB_cm_ir_value',
    'robotis_RB_cm_ir_compare',
    'robotis_RB_detectFrontObj',
    'robotis_RB_cm_btn_value',
    'robotis_RB_cm_joystick_value',
    'robotis_RB_mic',
    'robotis_RB_detectSound_compare',
    'robotis_RB_imu',
    'robotis_RB_roll_pitch', 
    'robotis_RB_cm_buzzer_index',

    
    //알라표정 
    //화면 애니메이션 
    'robotis_RB_car_screen',
    'robotis_RB_car_anim_screen',
    'robotis_RB_rsp_screen',

    'robotis_RB_LCDBright',
    'robotis_RB_LCDColor',

    'robotis_RB_LEDBright',
    'robotis_RB_cm_led',

    'robotis_RB_Hello',
    'robotis_RB_effectSound',
    'robotis_RB_record',
    'robotis_RB_playRecord',

    'robotis_RB_cm_screen',
    'robotis_RB_cm_anim_screen',
 
    'robotis_openCM70_RLa_go',
    'robotis_openCM70_RLa_stop',

    'robotis_RB_rotate',
    'robotis_RB_rotate_stop',

    'robotis_RB_go_distance',
    'robotis_RB_turn',
    'robotis_RB_pen'
];

Entry.Robotis_rb_car.setLanguage = function() {
    return {
        ko: {
            template: {
                robotis_RB_cm_ir_value: "%1 번 IR 센서 값",
                robotis_RB_cm_ir_compare: "%1 번 IR 센서 값이 %2  %3이면",
                robotis_RB_detectFrontObj: "앞에 물체가 있으면",
                robotis_RB_cm_btn_value: "%1 버튼이 %2 이면",
                robotis_RB_cm_joystick_value: "조이스틱 위치가 %1 이면",
                robotis_RB_mic: "마이크 음량(dB)",
                robotis_RB_detectSound_compare: "소리가 %1에서 나면",
                robotis_RB_imu: "%1축의 %2 값",
                robotis_RB_roll_pitch: "제어기 각도 %1 값",

                robotis_RB_cm_buzzer_index: "제어기 음계값 %1 을(를) %2 옥타브로 %3 초 동안 %4 %5",
                robotis_RB_cm_screen: "제어기 화면 배경을 알쥐 %1 로 선택 %2",
                robotis_RB_cm_anim_screen: "제어기 화면 애니메이션을 알쥐 %1 로 선택 %2",
                robotis_RB_rsp_screen: "제어기 화면에 %1 출력하기 %2",

                robotis_RB_LCDBright: "제어기 화면 밝기를 %1로 정하기 %2",
                robotis_RB_LCDColor: "제어기 화면 색상을 %1 으로 정하기 %2",
                
                robotis_RB_LEDBright: "제어기 %1 LED 밝기를 %2로 정하기 %3",
                robotis_RB_cm_led: "제어기 %1 LED %2 %3",

                robotis_RB_Hello: "%1 말하기 %2",
                robotis_RB_effectSound: "효과음 %1 재생하기 %2",
                robotis_RB_record: "%1 번 방에 녹음하기 %2",
                robotis_RB_playRecord: "%1 번 방 소리 재생하기 %2",

                robotis_openCM70_RLa_go: "알라 %1 속도로 %2 하기 %3",
                robotis_openCM70_RLa_stop: "알라 정지하기 %1",

                robotis_RB_rotate:"%1 모터 %2의 속도로 %3 회전하기%4",
                robotis_RB_rotate_stop:"%1 모터 정지하기 %2",

                robotis_RB_go_distance:"알라 로봇 %1 cm %2 하기 %3",
                robotis_RB_turn:"알라 로봇 제자리 %1 도 회전하기%2",
                robotis_RB_pen:"알라 로봇 펜 %1 %2",

            },
            Blocks: {
                robotis_red: "빨강",
                robotis_orange: "주황",
                robotis_yellow: "노랑",
                robotis_green: "초록",
                robotis_blue: "파랑",
                robotis_brown: "갈색",
                robotis_black: "검정",
                robotis_white: "흰색",
                robotis_left: "왼쪽",
                robotis_center: "중앙",
                robotis_right: "오른쪽",
                robotis_both: "양쪽",
                robotis_korean1: "안녕하세요",
                robotis_korean2: "반가워요",
                robotis_korean3: "알겠어요",
                robotis_korean4: "아니에요",
                robotis_korean5: "모르겠어요",
                robotis_korean6: "좋아요",
                robotis_korean7: "싫어요",
                robotis_korean8: "이름을말하세요",
                robotis_korean9: "무엇을도와줄까?",
                robotis_korean10: "잘했어",
                robotis_korean11: "괜찮아",
                robotis_korean12: "다시해보자",
                robotis_korean13: "고마워",
                robotis_korean14: "다시말해줄래?",
                robotis_korean15: "최고야!",
                robotis_korean16: "신나요",
                robotis_korean17: "즐거워요",
                robotis_korean18: "미안해요",
                robotis_korean19: "화나요",
                robotis_korean20: "부끄러워요",
                robotis_korean21: "무서워요",
                robotis_korean22: "속상해요",
                robotis_korean23: "사랑해요",
                robotis_korean24: "예뻐요",
                robotis_korean25: "신기해요",
                robotis_korean26: "초조해요",
                robotis_korean27: "앞으로가자",
                robotis_korean28: "뒤로가자",
                robotis_korean29: "일어나자",
                robotis_korean30: "넘어졌네?",
                robotis_korean31: "오예",
                robotis_korean32: "아싸",
                robotis_korean33: "어머",
                robotis_korean34: "이런",
                robotis_korean35: "오호",
                robotis_korean36: "하하하",
                robotis_korean37: "호호호",
                robotis_korean38: "졸려",
                robotis_korean39: "자장가를들려줘",
                robotis_korean40: "안녕",
                robotis_korean41: "배고프다",
                robotis_korean42: "도토리땡긴다",
                robotis_korean43: "아.씻고싶어",
                robotis_korean44: "비누목욕시간이야",
                robotis_korean45: "심심한데",
                robotis_korean46: "간식먹을까",
                robotis_korean47: "아파요",
                robotis_korean48: "약은없나요?",
                robotis_korean49: "어디로가야하지?",
                robotis_korean50: "와아도착이다",
                robotis_korean51: "왼쪽으로가자",
                robotis_korean52: "오른쪽으로가자",
                robotis_korean53: "깜짝이야",
                robotis_korean54: "찾았다",
                robotis_korean55: "여긴없네",
                robotis_korean56: "혹시나불렀어?",
                robotis_korean57: "내려주세요",
                robotis_korean58: "앗",
                robotis_korean59: "힝",
                robotis_korean60: "이익",
                robotis_dog: "개",
                robotis_frog: "개구리",
                robotis_cat: "고양이",
                robotis_chicken: "닭",
                robotis_tiger: "호랑이",
                robotis_mouse: "쥐",
                robotis_ambul: "앰뷸런스",
                robotis_Horn: "경적(빵빵)",
                robotis_siren: "사이렌(경찰차)",
                robotis_whistle: "호루라기",
                robotis_gun: "총소리",
                robotis_clap: "박수소리",
                robotis_melody1: "멜로디1",
                robotis_melody2: "멜로디2",
                robotis_melody3: "멜로디3",
                robotis_melody4: "멜로디4",
                robotis_forward: "앞으로",
                robotis_backward: "뒤로",
                robotis_acceleration: "가속도",
                robotis_gyro: "자이로",
                robotis_run: "실행",
                robotis_cancel: "취소",
                robotis_push: "눌림",
                robotis_notPush: "안눌림",
                robotis_play: "연주",
                robotis_rest: "쉼표",
                robotis_face01: "와하하",
                robotis_face02: "싱글벙글",
                robotis_face03: "큭큭큭",
                robotis_face04: "냠냠",
                robotis_face05: "겁먹음",
                robotis_face06: "답답",
                robotis_face07: "갸우뚱",
                robotis_face08: "어벙벙",
                robotis_face09: "고함",
                robotis_face10: "화남",
                robotis_face11: "킁킁(왼쪽)",
                robotis_face12: "킁킁(오른쪽)",
                robotis_face13: "킁킁(아래)",
                robotis_face14: "안심",
                robotis_face15: "기절",
                robotis_face16: "헤롱헤롱",
                robotis_face17: "하품",
                robotis_face18: "졸림",
                robotis_face19: "잠듦",
                robotis_face20: "마음앓이",
                robotis_face21: "폭풍눈물",
                robotis_face22: "목욕",
                robotis_face23: "햐트뿅뿅",

                robotis_flashing1: "점멸1",
                robotis_flashing2: "점멸2",
                robotis_flashing3: "점멸3",
                robotis_flashing4: "점멸4",
                robotis_flashing5: "점멸5",
                robotis_flashing6: "점멸6",
                robotis_flashing7: "점멸7",
                robotis_flashing8: "점멸8",
                robotis_flashing9: "점멸9",
                robotis_moveF: "전진",
                robotis_moveB: "후진",
                robotis_moveL: "좌회전",
                robotis_moveR: "우회전",
                robotis_moveRG1: "일어서기",
                robotis_moveRG2: "앉기",
                robotis_moveRG3: "발버둥",
                robotis_moveRG4: "발들기",
                robotis_stMotion1: "기본자세",
                robotis_stMotion2: "전진",
                robotis_stMotion3: "우전진",
                robotis_stMotion4: "좌전진",
                robotis_stMotion5: "후진",
                robotis_stMotion6: "오른쪽으로",
                robotis_stMotion7: "왼쪽으로",
                robotis_stMotion8: "우회전",
                robotis_stMotion9: "좌회전",
                robotis_spMotion1: "오른손 들기",
                robotis_spMotion2: "오른손 내리기",
                robotis_spMotion3: "왼손 들기",
                robotis_spMotion4: "왼손 내리기",
                robotis_spMotion5: "양손 들기",
                robotis_spMotion6: "양손 내리기",
                robotis_spMotion7: "뒤로 넘어지기",
                robotis_spMotion8: "앞으로 넘어지기",
                robotis_spMotion9: "앞으로 일어서기",
                robotis_spMotion10: "뒤로 일어서기",
                robotis_spMotion11: "방어",
                robotis_spMotion12: "공격1",
                robotis_spMotion13: "공격2",
                robotis_spMotion14: "공격3",
                robotis_spMotion15: "공격4",
                robotis_screen1: "가위",
                robotis_screen2: "바위",
                robotis_screen3: "보",
                robotis_clockwise: "시계방향",
                robotis_counterclockwise: "반시계방향",
                robotis_up: "들기",
                robotis_down: "내리기",
            },
        },
        en: {
            template: {
                robotis_RB_cm_ir_value:"IR sensor value of %1 Value of IR Sensor",
                robotis_RB_cm_ir_compare:"If IR sensor value of %1 is %2 %3",
                robotis_RB_detectFrontObj:"If there is an object in front",
                robotis_RB_cm_btn_value:"If %1 button is %2",
                robotis_RB_cm_joystick_value:"If the joystick location is %1",
                robotis_RB_mic:"MIC volume(dB)",
                robotis_RB_detectSound_compare:"If sound is detected from %1",
                robotis_RB_imu:"%1 axis' %2 value",
                robotis_RB_roll_pitch:"%1 Controller position ",
                robotis_RB_detectPose:"If robot falls %1",
                
                robotis_RB_cm_buzzer_index:"%1 at %2 octaves for %3 second(s) -> %4 %5",
                robotis_RB_cm_screen:"Choose %1 as a screen background %2",
                robotis_RB_cm_anim_screen: "Choose %1 as a screen animation %2",
                robotis_RB_rsp_screen:"Print %1 on the screen %2",
                
                robotis_RB_LCDBright:"Adjust screen brightness to %1 %2",
                robotis_RB_LCDColor:"Set screen color to %1 %2",
                
                robotis_RB_LEDBright:"Set the brightness of the %1 LED to %2 %3",
                robotis_RB_cm_led:"%1 LED %2 %3",
                
                robotis_RB_Hello:"Say %1 %2",
                robotis_RB_effectSound:"Play the sound of %1 %2",
                robotis_RB_record:"Record in room %1 %2",
                robotis_RB_playRecord:"Play recorded sound in room %1 %2",

                robotis_openCM70_RLa_go:"With %1 velocity, move R-La %2 %3",
                robotis_openCM70_RLa_stop:"R-La STOP",

                robotis_RB_rotate:"%1 motor with %2 velocity %3 rotate%4",
                robotis_RB_rotate_stop:"%1 motor stop%2",
                robotis_RB_go_distance:"Rla robot %1 cm %2 moving %3",
                robotis_RB_turn:"Rla robot turn %1 degree %2",
                robotis_RB_pen:"Rla robot %1 pen %2",

                
            },
            Blocks: {
                robotis_red: "Red",
                robotis_orange: "Orange",
                robotis_yellow: "Yellow",
                robotis_green: "Green",
                robotis_blue: "Blue",
                robotis_brown: "Brown",
                robotis_black: "Black",
                robotis_white: "White",
                robotis_left: "Left",
                robotis_center: "Center",
                robotis_right: "Right",
                robotis_both: "Both",
                robotis_korean1: "Hello!",
                robotis_korean2: "Great to see you.",
                robotis_korean3: "Okay ~",
                robotis_korean4: "No!",
                robotis_korean5: "I don't know.",
                robotis_korean6: "I like it.",
                robotis_korean7: "I don't like it.",
                robotis_korean8: "What is your name? ",
                robotis_korean9: "How can I help you? ",
                robotis_korean10: "Great job! ",
                robotis_korean11: "It's alright.",
                robotis_korean12: "Let's do it again! ",
                robotis_korean13: "Thank you! ",
                robotis_korean14: "Can you say that one more time?",
                robotis_korean15: "Awesome!",
                robotis_korean16: "I'm excited! ",
                robotis_korean17: "I'm having a great time! ",
                robotis_korean18: "I'm sorry.",
                robotis_korean19: "I'm angry! ",
                robotis_korean20: "I'm embarassed.",
                robotis_korean21: "I'm scared.",
                robotis_korean22: "I'm upset.",
                robotis_korean23: "I love you.",
                robotis_korean24: "Very pretty! ",
                robotis_korean25: "Interesting.",
                robotis_korean26: "I'm nervous.",
                robotis_korean27: "Let's move forward! ",
                robotis_korean28: "Let's move backward! ",
                robotis_korean29: "Let's stand up! ",
                robotis_korean30: "Did you fall down? ",
                robotis_korean31: "Oh Yeah~",
                robotis_korean32: "Sweet! ",
                robotis_korean33: "Oh no",
                robotis_korean34: "My My ",
                robotis_korean35: "Whoo hoo! ",
                robotis_korean36: "Ha Ha Ha",
                robotis_korean37: "Ho Ho Ho ",
                robotis_korean38: "I'm sleepy.",
                robotis_korean39: "Sing me a bedtime song! ",
                robotis_korean40: "Hello!",
                robotis_korean41: "I'm hungry.",
                robotis_korean42: "I'm craving an acorn! ",
                robotis_korean43: "I want to take a bath! ",
                robotis_korean44: "Time for a bath! ",
                robotis_korean45: "I'm bored. ",
                robotis_korean46: "Do you want a snack? ",
                robotis_korean47: "I'm sick.",
                robotis_korean48: "Do you have any medicine? ",
                robotis_korean49: "Where do we have to go? ",
                robotis_korean50: "We're here! ",
                robotis_korean51: "Let's go to the left side! ",
                robotis_korean52: "Let's go to the right side! ",
                robotis_korean53: "Oh my, you scared me! ",
                robotis_korean54: "Found you! ",
                robotis_korean55: "There's nothing here. ",
                robotis_korean56: "Did you call me?",
                robotis_korean57: "Please let me down. ",
                robotis_korean58: "Oops! ",
                robotis_korean59: "Hmmph! ",
                robotis_korean60: "Eek! ",
                robotis_dog: "Dog",
                robotis_frog: "Frog",
                robotis_cat: "Cat",
                robotis_chicken: "Rooster",
                robotis_tiger: "Tiger",
                robotis_mouse: "Mouse",
                robotis_ambul: "Ambulance",
                robotis_Horn: "CarHorn",
                robotis_siren: "Siren",
                robotis_whistle: "Whistle",
                robotis_gun: "Gunshot",
                robotis_clap: "Clap",
                robotis_melody1: "Melody1",
                robotis_melody2: "Melody2",
                robotis_melody3: "Melody3",
                robotis_melody4: "Melody4",
                robotis_forward: "Forward",
                robotis_backward: "Backward",
                robotis_acceleration: "acceleration",
                robotis_gyro: "gyro",
                robotis_run: "Run",
                robotis_cancel: "Cancel",
                robotis_push: "Pressed",
                robotis_notPush: "Unpressed",
                robotis_play: "Play",
                robotis_rest: "Rest",
                robotis_face01: "Haha",
                robotis_face02: "Smile",
                robotis_face03: "Laugh",
                robotis_face04: "Yum Yum",
                robotis_face05: "Scared",
                robotis_face06: "Uncomfortable",
                robotis_face07: "Confused",
                robotis_face08: "Dazed",
                robotis_face09: "Yell",
                robotis_face10: "Angry",
                robotis_face11: "Sniff (Left)",
                robotis_face12: "Sniff (Right)",
                robotis_face13: "Sniff (Down)",
                robotis_face14: "Whew",
                robotis_face15: "Faint",
                robotis_face16: "Dizzy",
                robotis_face17: "Yawn",
                robotis_face18: "Sleepy",
                robotis_face19: "Sleep",
                robotis_face20: "Sad",
                robotis_face21: "Cry",
                robotis_face22: "Bath",
                robotis_face23: "Heart-Eyes",       

                robotis_flashing1: "Flashing1",
                robotis_flashing2: "Flashing2",
                robotis_flashing3: "Flashing3",
                robotis_flashing4: "Flashing4",
                robotis_flashing5: "Flashing5",
                robotis_flashing6: "Flashing6",
                robotis_flashing7: "Flashing7",
                robotis_flashing8: "Flashing8",
                robotis_flashing9: "Flashing9",
                robotis_moveF: "Forward",
                robotis_moveB: "Backward",
                robotis_moveL: "LeftTurn",
                robotis_moveR: "RightTurn",
                robotis_moveRG1: "Stand",
                robotis_moveRG2: "Sit",
                robotis_moveRG3: "Struggle",
                robotis_moveRG4: "RaiseFeet",
                robotis_stMotion1: "Standard",
                robotis_stMotion2: "Forward",
                robotis_stMotion3: "TurnRight",
                robotis_stMotion4: "TurnLeft",
                robotis_stMotion5: "Backward",
                robotis_stMotion6: "ToRight",
                robotis_stMotion7: "ToLeft",
                robotis_stMotion8: "TurnAroundRight",
                robotis_stMotion9: "TurnAroundLeft",
                robotis_spMotion1: "RightHandUp",
                robotis_spMotion2: "RightHandDown",
                robotis_spMotion3: "LeftHandUp",
                robotis_spMotion4: "LeftHandDown",
                robotis_spMotion5: "BothHandsUp",
                robotis_spMotion6: "BothHandsDown",
                robotis_spMotion7: "FallBackward",
                robotis_spMotion8: "FallForward",
                robotis_spMotion9: "StandForward",
                robotis_spMotion10: "StandBackward",
                robotis_spMotion11: "Defence",
                robotis_spMotion12: "Offense1",
                robotis_spMotion13: "Offense2",
                robotis_spMotion14: "Offense3",
                robotis_spMotion15: "Offense4",
                robotis_screen1: "Sissor",
                robotis_screen2: "Rock",
                robotis_screen3: "Paper",
                robotis_clockwise: "clockwise",
                robotis_counterclockwise: "counterclockwise",
                robotis_up: "up",
                robotis_down: "down",
            },
        }
    }
};

Entry.Robotis_rb_car.getBlocks = function() {
    return {
        robotis_openCM70_RLa_go: {
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
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.robotis_moveF, '1'],
                        [Lang.Blocks.robotis_moveB, '2'],
                        [Lang.Blocks.robotis_moveL, '3'],
                        [Lang.Blocks.robotis_moveR, '4'],

                    ],
                    value: '1',
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
                    null,
                    null,
                ],
                type: 'robotis_openCM70_RLa_go',
            },
            paramsKeyMap: {
                SPEED: 0,
                DIRECTION: 1,
            },
            class: 'robotis_openCM70_cm',
            isNotFor: ['Robotis_rb_car'],
            func: function (sprite, script) {
                // instruction / address / length / value / default length
                var speed = script.getNumberValue('SPEED', script);
                var direction = script.getField('DIRECTION', script);
                
                var data_instruction = Entry.Robotis_rb.INSTRUCTION.WRITE;
                var data_address = 710;
                var data_length = 2;
                var data_value = 0;
                
                if(speed > 100) {
                    speed = 100;
                } else if(speed < -100) {
                    speed = -100;
                }

                switch(direction) {
                    case '1':
                        data_value = speed * 256 + speed;
                        break;
                    case '2':
                        data_value = (256 - speed) * 256 + (256 - speed);
                        break;
                    case '3':
                        data_value = speed * 256 + (256 - speed);
                        break;
                    case '4':
                        data_value = (256 - speed) * 256 + speed;
                        break;
                    default:
                        data_value = 0;
                        break;
                }
                console.log(speed);
                var data_sendqueue = [
                    [
                        data_instruction,
                        data_address,
                        data_length,
                        data_value,
                    ],
                ];
                return Entry.Robotis_carCont.postCallReturn(
                    script,
                    data_sendqueue,
                    Entry.Robotis_openCM70.delay
                );
            },
            syntax: {
                js: [],
                py: ['Robotis.openCM70_RLa_go(%1, %2)'],
            },
        },

        robotis_openCM70_RLa_stop:{
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
            def: {
                params: [
                   null
                ],
                type: 'robotis_openCM70_RLa_stop',
            },
            paramsKeyMap: {
                
            },
            class: 'robotis_openCM70_cm',
            isNotFor: ['Robotis_rb_car'],
            func: function (sprite, script) {
                
                var data_instruction = Entry.Robotis_rb.INSTRUCTION.WRITE;
                var data_address = 710;
                var data_length = 2;
                var data_value = 0;
            
                console.log("rg stop send");
                var data_sendqueue = [
                    [
                        data_instruction,
                        data_address,
                        data_length,
                        data_value,
                    ],
                ];
                return Entry.Robotis_carCont.postCallReturn(
                    script,
                    data_sendqueue,
                    Entry.Robotis_openCM70.delay
                );
            },
            syntax: {
                js: [],
                py: ['Robotis.opencm70_RLa_stop()'],
            },
        },

        robotis_RB_rotate: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.robotis_left, '36'],
                        [Lang.Blocks.robotis_right, '35'], //Lang.Blocks.robotis_common_green_color
                    ],
                    value: '36',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Block',
                    accept: 'string',
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.robotis_clockwise, '-10'],
                        [Lang.Blocks.robotis_counterclockwise, '10'], //Lang.Blocks.robotis_common_green_color
                    ],
                    value: '-10',
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
                    {
                        type: 'number',
                        params: ['10'],
                    },
                    null
                ],
                type: 'robotis_RB_rotate',
            },
            
            paramsKeyMap: {
                DXLNUM: 0,
                VEL: 1,
                DIRECTION: 2,
            },
            class: 'robotis_openCM70_cm',
            isNotFor: ['Robotis_rb_car'],
            func(entity, script) {
                var data_instruction = Entry.Robotis_rb.INSTRUCTION.WRITE;
                var data_address = 19;
                var data_length = 1;
                var data_value = 1;
        
                var data_sendqueue = [
                     [data_instruction, data_address, data_length, data_value],
                    [Entry.Robotis_rb.INSTRUCTION.REGWRITE, 64, 1, 1, [36]],
                    [Entry.Robotis_rb.INSTRUCTION.REGWRITE, 64, 1, 1, [35]],
                ]
                
                var dxlID = script.getField('DXLNUM', script);
                var velocity = script.getNumberValue('VEL', script);
                var direction = script.getNumberValue('DIRECTION', script);
        
                if(velocity > 100) {
                    velocity = 100;
                } else if(velocity < -100) {
                    velocity = -100;
                }
                
                var dxlPosition = dxlID == 35 ? -1 : 1;
                velocity = Math.floor(velocity * direction * dxlPosition);
                
                data_sendqueue.push([Entry.Robotis_rb.INSTRUCTION.REGWRITE, 104, 4, velocity, [dxlID]]);
                
                data_sendqueue.push([Entry.Robotis_rb.INSTRUCTION.ACTION, 0, 0, 0]);
        
                
        
                return Entry.Robotis_carCont.postCallReturn(
                    script,
                    data_sendqueue,
                    Entry.Robotis_openCM70.delay
                    //Entry.Robotis_openCM70.delay
                );
            },
            syntax: { js: [], py: ['Robotis.robotis_dxl_each_control(%1)'] },
        },

        robotis_RB_rotate_stop: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.robotis_left, '36'],
                        [Lang.Blocks.robotis_right, '35'], //Lang.Blocks.robotis_common_green_color
                    ],
                    value: '36',
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
                type: 'robotis_RB_rotate_stop',
            },
            
            paramsKeyMap: {
                DXLNUM: 0,
            },
            class: 'robotis_openCM70_cm',
            isNotFor: ['Robotis_rb_car'],
            func(entity, script) {
                var data_instruction = Entry.Robotis_rb.INSTRUCTION.WRITE;
                var data_address = 19;
                var data_length = 1;
                var data_value = 1;
        
                var data_sendqueue = [
                     [data_instruction, data_address, data_length, data_value],
                    [Entry.Robotis_rb.INSTRUCTION.REGWRITE, 64, 1, 1, [36]],
                    [Entry.Robotis_rb.INSTRUCTION.REGWRITE, 64, 1, 1, [35]],
                ]
                
                var dxlID = script.getField('DXLNUM', script);
                
                data_sendqueue.push([Entry.Robotis_rb.INSTRUCTION.REGWRITE, 104, 4, 0, [dxlID]]);
                
                data_sendqueue.push([Entry.Robotis_rb.INSTRUCTION.ACTION, 0, 0, 0]);
        
                
        
                return Entry.Robotis_carCont.postCallReturn(
                    script,
                    data_sendqueue,
                    Entry.Robotis_openCM70.delay
                    //Entry.Robotis_openCM70.delay
                );
            },
            syntax: { js: [], py: ['Robotis.robotis_dxl_each_control(%1)'] },
        },

        robotis_RB_go_distance: {
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
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.robotis_moveF, '1'],
                        [Lang.Blocks.robotis_moveB, '-1'], //Lang.Blocks.robotis_common_green_color
                    ],
                    value: '1',
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
                    {
                        type: 'number',
                        params: ['10'],
                    },
                    null,
                ],
                type: 'robotis_RB_go_distance',
            },
            
            paramsKeyMap: {
                DISTANCE: 0,
                DIRECTION: 1,
            },
            class: 'robotis_openCM70_cm',
            isNotFor: ['Robotis_rb_car'],
            func(entity, script) {
                var distance = script.getNumberValue('DISTANCE', script);
                var direction = script.getField('DIRECTION', script);

                if(distance > 1000) {
                    distance = 1000;
                } else if(distance < -1000) {
                    distance = -1000;
                }

                var data_instruction = Entry.Robotis_rb.INSTRUCTION.WRITE;
                var data_address = 270;
                var data_length = 4;
                var data_value = Math.floor(10 * distance * direction);
        
                var data_sendqueue = [
                    [
                        data_instruction,
                        data_address,
                        data_length,
                        data_value,
                    ],
                ];
                
                data_sendqueue.push([data_instruction, 66, 2, 50491]);
        
                return Entry.Robotis_carCont.postCallReturn(
                    script,
                    data_sendqueue,
                    Entry.Robotis_openCM70.delay + 500 * Math.abs(distance)
                    //Entry.Robotis_openCM70.delay
                );
            },
            syntax: { js: [], py: ['Robotis.robotis_dxl_each_control(%1)'] },
        },

        robotis_RB_turn:{
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
            def: {
                params: [
                    {
                        type: 'number',
                        params: ['90'],
                    },
                ],
                type: 'robotis_RB_turn',
            },
            
            paramsKeyMap: {
                ANGLE: 0,
            },
            class: 'robotis_openCM70_cm',
            isNotFor: ['Robotis_rb_car'],
            func(entity, script) {
                var angle = script.getNumberValue('ANGLE', script);

                if(angle > 180) {
                    angle = 180;
                } else if(angle < -180) {
                    angle = -180;
                }

                var data_instruction = Entry.Robotis_rb.INSTRUCTION.WRITE;
                var data_address = 270;
                var data_length = 4;
                var data_value = Math.floor(-angle);
        
                var data_sendqueue = [
                    [
                        data_instruction,
                        data_address,
                        data_length,
                        data_value,
                    ],
                ];
                
            
                data_sendqueue.push([data_instruction, 66, 2, 50492]);
        
                return Entry.Robotis_carCont.postCallReturn(
                    script,
                    data_sendqueue,
                    Entry.Robotis_openCM70.delay + 2000*(Math.abs(angle) / 90) + 1000
                    //Entry.Robotis_openCM70.delay
                );
            },
            syntax: { js: [], py: ['Robotis.robotis_dxl_each_control(%1)'] },
        },

        robotis_RB_pen:{
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.robotis_up, '50007'],
                        [Lang.Blocks.robotis_down, '50008'], //Lang.Blocks.robotis_common_green_color
                    ],
                    value: '50007',
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
                    null
                ],
                type: 'robotis_RB_pen',
            },
            
            paramsKeyMap: {
                MOTION: 0,
            },
            class: 'robotis_openCM70_cm',
            isNotFor: ['Robotis_rb_car'],
            func(entity, script) {
                var motion = script.getNumberValue('MOTION', script);

                var data_instruction = Entry.Robotis_rb.INSTRUCTION.WRITE;
                var data_address = 66;
                var data_length = 2;
                var data_value = motion;
        
                var data_sendqueue = [
                    [
                        data_instruction,
                        data_address,
                        data_length,
                        data_value,
                    ],
                ];
                
                
                return Entry.Robotis_carCont.postCallReturn(
                    script,
                    data_sendqueue,
                    Entry.Robotis_openCM70.delay
                    //Entry.Robotis_openCM70.delay
                );
            },
            syntax: { js: [], py: ['Robotis.robotis_dxl_each_control(%1)'] },
        }
    };
}

module.exports = [Entry.Robotis_rb_car];





