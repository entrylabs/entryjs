'use strict';
Entry.Robotis_rb = {
    INSTRUCTION: {
        NONE: 0,
        WRITE: 3,
        READ: 2,
        SYNCWRITE: 4,
        REGWRITE: 5,
        ACTION: 6,
        BYPASS_READ: 0xA2,
        BYPASS_WRITE: 0xA3,
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

        CM_DXL_MULTITURN_ID: [580, 1],
        CM_DXL_MULTITURN_SPEED: [582, 2],
        CM_DXL_MULTITURN_DISTANCE: [584, 4],

        DXL_OPERATING_MODE: [11, 1],
        DXL_TORQUE_ENABLE: [64, 1],
        DXL_GOAL_VELOCITY: [104, 4],
        DXL_PROFILE_VELOCITY: [112, 4],
        DXL_GOAL_POSITION: [116, 4],
        DXL_IS_MOVING: [122, 1],
        DXL_PRESENT_VELOCITY: [128, 4],
        DXL_PRESENT_POSITION: [132, 4],
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
            [Entry.Robotis_rb.INSTRUCTION.WRITE, 19, 1, 1], // bypass 모드 켜기
            // [Entry.Robotis_rb.INSTRUCTION.WRITE, 163, 2, 30759],
            // [Entry.Robotis_rb.INSTRUCTION.WRITE, 162, 1, 1],
        ]);
        Entry.Robotis_carCont.update();
    },
    id: ['7.5', '7.6'],
    name: 'Robotis_rb',
    url: 'http://www.robotis.com/index/product.php?cate_code=111310',
    imageName: 'robotis_RB100im_RGee.png',
    title: {
        "ko": "로보티즈 알쥐",
        "en": "ROBOTIS RGee"
    },
    delay: 30,
    readDelay: 30,
};

Entry.Robotis_rb.blockMenuBlocks = [
    
    'robotis_RB_cm_ir_value',
    'robotis_RB_cm_ir_compare',
    'robotis_RB_detectFrontObj',
    'robotis_RB_cm_btn_value',
    'robotis_RB_cm_joystick_value',
    'robotis_RB_mic',
    'robotis_RB_detectSound_compare',
    'robotis_RB_imu',
    'robotis_RB_roll_pitch', // 값 안나옴.
    /*
    'robotis_RB_environment_value',
    'robotis_RB_environment_compare',
    'robotis_RB_distance_value',
    'robotis_RB_distance_compare',
   */
    'robotis_RB_cm_buzzer_index',

    'robotis_RB_cm_screen',
    'robotis_RB_cm_anim_screen',
    'robotis_RB_rsp_screen',

    'robotis_RB_LCDBright',
    'robotis_RB_LCDColor',
    
    'robotis_RB_LEDBright',
    'robotis_RB_cm_led',
    'robotis_RB_Hello',
    'robotis_RB_effectSound',
    'robotis_RB_record',
    'robotis_RB_playRecord',

    'robotis_RB_car_screen',
    'robotis_RB_car_anim_screen',
    'robotis_RB_kkokdu_screen',
    'robotis_RB_kkokdu_anim_screen',
    
    'robotis_openCM70_RGee_go',
    'robotis_openCM70_RGee_stop',
    'robotis_openCM70_RGee_motion',

    
    'robotis_RB_follow_line',
    'robotis_RB_follow_line_stop',
    
    'robotis_dxl_control',
    'robotis_dxl_each_control',

    // 'robotis_RB_cm_custom_value',
    // 'robotis_RB_cm_custom',
];

Entry.Robotis_rb.setLanguage = function() {
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
                robotis_RB_environment_value: "%1 %2 값",
                robotis_RB_environment_compare: "%1 %2 값이 %3 %4이면",
                robotis_RB_distance_value: "%1 %2 값",
                robotis_RB_distance_compare: "%1 %2 값이 %3 %4이면",

                //robotis_RB_detectPose: "로봇이 %1 넘어지면",

                robotis_RB_cm_buzzer_index: "제어기 음계값 %1 을(를) %2 옥타브로 %3 초 동안 %4 %5",

                robotis_RB_kkokdu_screen: "제어기 화면 배경을 꼭두 %1 로 선택 %2",
                robotis_RB_kkokdu_anim_screen: "제어기 화면 애니메이션을 꼭두 %1 로 선택 %2",

                robotis_RB_rsp_screen: "제어기 화면에 %1를 (%2, %3)위치에 %4 크기로 출력하기 %5",

                robotis_RB_LCDBright: "제어기 화면 밝기를 %1로 정하기 %2",
                robotis_RB_LCDColor: "제어기 화면 색상을 %1 으로 정하기 %2",
                
                robotis_RB_LEDBright: "제어기 %1 LED 밝기를 %2로 정하기 %3",
                robotis_RB_cm_led: "제어기 %1 LED %2 %3",

                robotis_RB_Hello: "%1 말하기 %2",
                robotis_RB_effectSound: "효과음 %1 재생하기 %2",
                robotis_RB_record: "%1 번 방에 녹음하기 %2",
                robotis_RB_playRecord: "%1 번 방 소리 재생하기 %2",
                robotis_openCM70_RGee_go: "알쥐 %1 속도로 %2 하기 %3",
                robotis_openCM70_RGee_stop: "알쥐 정지하기 %1",
                robotis_openCM70_RGee_motion: "알쥐 %1 %2",
                
                robotis_RB_follow_line: "%1 속도로 라인 따라가기 %2",
                robotis_RB_follow_line_stop: "라인 따라가기 종료 %1",

                robotis_RB_cm_screen: "제어기 화면 배경을 알쥐 %1 로 선택 %2",
                robotis_RB_cm_anim_screen: "제어기 화면 애니메이션을 알쥐 %1 로 선택 %2",

                robotis_RB_car_screen: "제어기 화면 배경을 알라 %1 로 선택 %2",
                robotis_RB_car_anim_screen: "제어기 화면 애니메이션을 알라 %1 로 선택 %2",
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

                robotis_car_anim01: "기본표정",
                robotis_car_anim02: "감동",
                robotis_car_anim03: "미소",
                robotis_car_anim04: "웃음",
                robotis_car_anim05: "기쁨",
                robotis_car_anim06: "행복",
                robotis_car_anim07: "자신감",
                robotis_car_anim08: "화남",
                robotis_car_anim09: "우울",
                robotis_car_anim10: "슬픔",
                robotis_car_anim11: "고통",
                robotis_car_anim12: "기절",
                robotis_car_anim13: "공포",
                robotis_car_anim14: "하품",
                robotis_car_anim15: "졸림",
                robotis_car_anim16: "오른쪽보기",
                robotis_car_anim17: "왼쪽보기",
                robotis_car_anim18: "앞쪽보기",
                robotis_car_anim19: "깜짝놀람",

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
                robotis_sensing_temperature: "온도센서",
                robotis_sensing_humidity: "습도센서",
                robotis_sensing_brightness: "밝기센서",
                robotis_sensing_motion: "움직임센서",
                robotis_sensing_button: "버튼센서",
                robotis_sensing_distance: "거리센서",
                robotis_sensing_ir_left: "왼쪽 적외선센서",
                robotis_sensing_ir_right: "오른쪽 적외선센서",
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
                robotis_RB_environment_value: "%1 %2 value",
                robotis_RB_environment_compare: "If %1 %2 value is %3 %4",
                robotis_RB_distance_value: "%1 %2 value",
                robotis_RB_distance_compare: "If %1 %2 value is %3 %4",
                //robotis_RB_detectPose:"If robot falls %1",
                
                robotis_RB_cm_buzzer_index:"%1 at %2 octaves for %3 second(s) -> %4 %5",

                robotis_RB_kkokdu_screen: "Choose %1 Tiger as a screen background %2",
                robotis_RB_kkokdu_anim_screen: "Choose %1 Tiger as a screen animation %2",

                robotis_RB_rsp_screen: "Display %1 on the controller screen at position (%2, %3) with a size of %4 %5",
                
                robotis_RB_LCDBright:"Adjust screen brightness to %1 %2",
                robotis_RB_LCDColor:"Set screen color to %1 %2",
                
                robotis_RB_LEDBright:"Set the brightness of the %1 LED to %2 %3",
                robotis_RB_cm_led:"%1 LED %2 %3",
                
                robotis_RB_Hello:"Say %1 %2",
                robotis_RB_effectSound:"Play the sound of %1 %2",
                robotis_RB_record:"Record in room %1 %2",
                robotis_RB_playRecord:"Play recorded sound in room %1 %2",
                robotis_openCM70_RGee_go:"With %1 velocity, move R-G %2",
                robotis_openCM70_RGee_stop:"R-G STOP",
                robotis_openCM70_RGee_motion:"Do %1",
                
                robotis_RB_follow_line: "Follow line with speed level %1 %2",
                robotis_RB_follow_line_stop: "Stop following line %1",

                robotis_RB_cm_screen:"Choose %1 R-Gee as a screen background %2",
                robotis_RB_cm_anim_screen: "Choose %1 R-Gee as a screen animation %2",

                robotis_RB_car_screen: "Choose %1 R-La as a screen background %2",
                robotis_RB_car_anim_screen: "Choose %1 R-La as a screen animation %2",
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

                robotis_car_anim01: "anim01",
                robotis_car_anim02: "anim02",
                robotis_car_anim03: "anim03",
                robotis_car_anim04: "anim04",
                robotis_car_anim05: "anim05",
                robotis_car_anim06: "anim06",
                robotis_car_anim07: "anim07",
                robotis_car_anim08: "anim08",
                robotis_car_anim09: "anim09",
                robotis_car_anim10: "anim10",
                robotis_car_anim11: "anim11",
                robotis_car_anim12: "anim12",
                robotis_car_anim13: "anim13",
                robotis_car_anim14: "anim14",
                robotis_car_anim15: "anim15",
                robotis_car_anim16: "anim16",
                robotis_car_anim17: "anim17",
                robotis_car_anim18: "anim18",
                robotis_car_anim19: "anim19",

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
                robotis_sensing_temperature: "Temperature",
                robotis_sensing_humidity: "Humidity",
                robotis_sensing_brightness: "Brightness",
                robotis_sensing_motion: "Motion",
                robotis_sensing_button: "Button",
                robotis_sensing_distance: "Distance",
                robotis_sensing_ir_left: "Left IR",
                robotis_sensing_ir_right: "Right IR",
                
            },
        }
    }
};

let rb100_last_valid_value = [];

Entry.Robotis_rb.getBlocks = function () {
    return {
        //region robotis 로보티즈 openCM70
        robotis_RB_rsp_screen: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.robotis_screen1, '11545'],
                        [Lang.Blocks.robotis_screen2, '11546'],
                        [Lang.Blocks.robotis_screen3, '11547'],
                        ['0', '11283'],
                        ['1', '11284'],
                        ['2', '11285'],
                        ['3', '11286'],
                        ['4', '11287'],
                        ['5', '11288'],
                        ['6', '11289'],
                        ['7', '11290'],
                        ['8', '11291'],
                        ['9', '11292'],
                        ['10', '11293'],
                    ],
                    value: '11545',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
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
                    null,
                    {
                        type: 'number',
                        params: ['0'],
                    },
                    {
                        type: 'number',
                        params: ['0'],
                    },
                    100,
                    null,
                ],
                type: 'robotis_RB_rsp_screen',
            },
            paramsKeyMap: {
                ICON: 0,
                X: 1,
                Y: 2,
                SIZE: 3,
            },
            class: 'robotis_rb100_lcd',
            isNotFor: ['Robotis_rb', 'Robotis_rb_H', 'Robotis_rb_car', 'Robotis_rb_P_Assembly'],
            func: function (sprite, script) {
                // instruction / address / length / value / default length
                var iconNum = script.getField('ICON', script);
                var x = script.getNumberValue('X', script);
                var y = script.getNumberValue('Y', script);
                var size = script.getNumberValue('SIZE', script);
                
                var data_instruction = Entry.Robotis_rb.INSTRUCTION.WRITE;
                var data_address = 166;
                var data_length = 2;
                var data_value = 10496;
            
                if (x < -160) x = -160;
                else if (x > 160) x = 160;
                
                if (y < -120) y = -120;
                else if (y > 120) y = 120;
                
                if (size < 0) size = 0;
                else if (size > 400) size = 400;
               
                data_value = iconNum;

                var data_sendqueue = [
                    // [
                    //     Entry.Robotis_rb.INSTRUCTION.WRITE, 163, 2, 2817
                    // ],
                    [
                        Entry.Robotis_rb.INSTRUCTION.WRITE, 163, 2, 255
                    ],
                    [
                        Entry.Robotis_rb.INSTRUCTION.WRITE, 130, 2, x
                    ],
                    [
                        Entry.Robotis_rb.INSTRUCTION.WRITE, 132, 2, y
                    ],
                    [
                        Entry.Robotis_rb.INSTRUCTION.WRITE, 149, 2, size
                    ],
                    [
                        data_instruction,
                        data_address,
                        data_length,
                        data_value,
                    ],
                    [
                        Entry.Robotis_rb.INSTRUCTION.WRITE, 162, 1, 1
                    ]
                ];
                
                return Entry.Robotis_carCont.postCallReturn(
                    script,
                    data_sendqueue,
                    Entry.Robotis_openCM70.delay + 1000
                );
            },
            syntax: {
                js: [],
                py: ['Robotis.RB_rsp_screen(%1)'],
            },
        },
        robotis_RB_cm_custom_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                },
                {
                    type: 'Dropdown',
                    options: [
                        ['BYTE', 'BYTE'],
                        ['WORD', 'WORD'],
                        ['DWORD', 'DWORD'],
                    ],
                    value: 'BYTE',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
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
                type: 'robotis_RB_cm_custom_value',
            },
            paramsKeyMap: {
                VALUE: 0,
                SIZE: 1,
            },
            class: 'robotis_rb100_custom',
            isNotFor: ['Robotis_rb'],
            func: function (sprite, script) {
                var scope = script.executor.scope;

                // instruction / address / length / value / default length
                var data_instruction = Entry.Robotis_rb.INSTRUCTION.READ;
                var data_address = 0;
                var data_length = 0;
                var data_value = 0;

                var data_default_address = 0;
                var data_default_length = 0;

                var size = script.getStringField('SIZE');

                if (size == 'BYTE') {
                    data_length = 1;
                } else if (size == 'WORD') {
                    data_length = 2;
                } else if (size == 'DWORD') {
                    data_length = 4;
                }

                data_address = script.getNumberValue('VALUE');

                data_default_address = data_address;
                data_default_length = data_length;

                if (
                    Entry.hw.sendQueue.prevAddress &&
                    Entry.hw.sendQueue.prevAddress == data_default_address
                ) {
                    if (
                        Entry.hw.sendQueue.prevTime &&
                        new Date() - Entry.hw.sendQueue.prevTime < Entry.Robotis_openCM70.readDelay
                    ) {
                        //throw new Entry.Utils.AsyncError();
                        if(typeof Entry.hw.sendQueue.prevResult == 'undefined') {
                            return 0;
                        }
                        return Entry.hw.sendQueue.prevResult;
                    }
                }

                Entry.Robotis_carCont.setRobotisData([
                    [
                        data_instruction,
                        data_address,
                        data_length,
                        data_value,
                        data_default_length,
                    ],
                ]);
                // Entry.hw.socket.send(JSON.stringify(Entry.hw.sendQueue));
                Entry.Robotis_carCont.update();

                var result = Entry.hw.portData[data_default_address];
                if (result == undefined)
                {
                    result = rb100_last_valid_value[data_default_address];
                }
                else
                {
                    rb100_last_valid_value[data_default_address] = result;
                }
                Entry.hw.sendQueue.prevAddress = data_default_address;
                Entry.hw.sendQueue.prevTime = new Date();
                Entry.hw.sendQueue.prevResult = result;

                if(typeof result == 'undefined') {
                    return 0;
                }
                return result;
            },
            syntax: {
                js: [],
                py: ['Robotis.opencm70_cm_custom_value(%1, %2)'],
            },
        },
        robotis_RB_cm_custom_value2: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                },
                {
                    type: 'Dropdown',
                    options: [
                        ['BYTE', 'BYTE'],
                        ['WORD', 'WORD'],
                        ['DWORD', 'DWORD'],
                    ],
                    value: 'BYTE',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
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
                type: 'robotis_RB_cm_custom_value2',
            },
            paramsKeyMap: {
                VALUE: 0,
                SIZE: 1,
            },
            class: 'robotis_rb100_custom',
            isNotFor: ['Robotis_rb_H', 'Robotis_rb_P_Assembly'],
            func: function (sprite, script) {
                var scope = script.executor.scope;

                // instruction / address / length / value / default length
                var data_instruction = Entry.Robotis_rb.INSTRUCTION.READ;
                var data_address = 0;
                var data_length = 0;
                var data_value = 0;

                var data_default_address = 0;
                var data_default_length = 0;

                var size = script.getStringField('SIZE');

                if (size == 'BYTE') {
                    data_length = 1;
                } else if (size == 'WORD') {
                    data_length = 2;
                } else if (size == 'DWORD') {
                    data_length = 4;
                }

                data_address = script.getNumberValue('VALUE');

                data_default_address = data_address;
                data_default_length = data_length;

                if (
                    Entry.hw.sendQueue.prevAddress &&
                    Entry.hw.sendQueue.prevAddress == data_default_address
                ) {
                    if (
                        Entry.hw.sendQueue.prevTime &&
                        new Date() - Entry.hw.sendQueue.prevTime < Entry.Robotis_openCM70.readDelay
                    ) {
                        //throw new Entry.Utils.AsyncError();
                        if(typeof Entry.hw.sendQueue.prevResult == 'undefined') {
                            return 0;
                        }
                        return Entry.hw.sendQueue.prevResult;
                    }
                }

                Entry.Robotis_carCont.setRobotisData([
                    [
                        data_instruction,
                        data_address,
                        data_length,
                        data_value,
                        data_default_length,
                    ],
                ]);
                // Entry.hw.socket.send(JSON.stringify(Entry.hw.sendQueue));
                Entry.Robotis_carCont.update();

                var result = Entry.hw.portData[data_default_address];
                if (result == undefined)
                {
                    result = rb100_last_valid_value[data_default_address];
                }
                else
                {
                    rb100_last_valid_value[data_default_address] = result;
                }

                Entry.hw.sendQueue.prevAddress = data_default_address;
                Entry.hw.sendQueue.prevTime = new Date();
                Entry.hw.sendQueue.prevResult = result;

                if(typeof result == 'undefined') {

                    return 0;
                }
                return result;
            },
            syntax: {
                js: [],
                py: ['Robotis.opencm70_cm_custom_value(%1, %2)'],
            },
        },
        robotis_RB_cm_ir_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['1', '360'],
                        ['2', '362'],
                        ['3', '364'],
                        ['4', '366'],
                        ['5', '368'],
                        ['6', '370'],
                    ],
                    value: '360',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [
                    null
                ],
                type: 'robotis_RB_cm_ir_value',
            },
            paramsKeyMap: {
                VALUE: 0,
            },
            class: 'robotis_rb100_custom',
            isNotFor: ['Robotis_rb', 'Robotis_rb_H', 'Robotis_rb_car', 'Robotis_rb_P_Assembly'],
            func: function (sprite, script) {
                var scope = script.executor.scope;

                // instruction / address / length / value / default length
                var data_instruction = Entry.Robotis_rb.INSTRUCTION.READ;
                var data_address = 0;
                var data_length = 2;
                var data_value = 0;

                var data_default_address = 0;
                var data_default_length = 0;

                
                data_address = script.getNumberValue('VALUE');

                data_default_address = data_address;
                data_default_length = data_length;

                if (
                    Entry.hw.sendQueue.prevAddress &&
                    Entry.hw.sendQueue.prevAddress == data_default_address
                ) {
                    if (
                        Entry.hw.sendQueue.prevTime &&
                        new Date() - Entry.hw.sendQueue.prevTime < Entry.Robotis_openCM70.readDelay
                    ) {
                        //throw new Entry.Utils.AsyncError();
                        if(typeof Entry.hw.sendQueue.prevResult == 'undefined') {
                            return 0;
                        }
                        return Entry.hw.sendQueue.prevResult;
                    }
                }

                Entry.Robotis_carCont.setRobotisData([
                    [
                        data_instruction,
                        data_address,
                        data_length,
                        data_value,
                        data_default_length,
                    ],
                ]);
                // Entry.hw.socket.send(JSON.stringify(Entry.hw.sendQueue));
                Entry.Robotis_carCont.update();

                var result = Entry.hw.portData[data_default_address];
                if (result == undefined)
                {
                    result = rb100_last_valid_value[data_default_address];
                }
                else
                {
                    rb100_last_valid_value[data_default_address] = result;
                }
                Entry.hw.sendQueue.prevAddress = data_default_address;
                Entry.hw.sendQueue.prevTime = new Date();
                Entry.hw.sendQueue.prevResult = result;

                if(typeof result == 'undefined') {

                    return 0;
                }
                return result;
            },
            syntax: {
                js: [],
                py: ['Robotis.opencm70_cm_ir_value(%1)'],
            },
        },
        robotis_RB_cm_ir_compare: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['1', '360'],
                        ['2', '362'],
                        ['3', '364'],
                        ['4', '366'],
                        ['5', '368'],
                        ['6', '370'],
                    ],
                    value: '360',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        ['>', '0'],
                        ['<', '1'],
                        ['=', '2'],
                    ],
                    value: '0',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Block',
                    accept: 'string',
                },
            ],
            events: {},
            def: {
                params: [
                    null,
                    null,
                    200
                ],
                type: 'robotis_RB_cm_ir_compare',
            },
            paramsKeyMap: {
                VALUE: 0,
                COMPARE_OP: 1,
                COMPARE_VAL: 2,
            },
            class: 'robotis_rb100_custom',
            isNotFor: ['Robotis_rb', 'Robotis_rb_H', 'Robotis_rb_car', 'Robotis_rb_P_Assembly'],
            func: function (sprite, script) {
                var scope = script.executor.scope;

                // instruction / address / length / value / default length
                var data_instruction = Entry.Robotis_rb.INSTRUCTION.READ;
                var data_address = 0;
                var data_length = 2;
                var data_value = 0;

                var data_default_address = 0;
                var data_default_length = 0;
                var compareValue = script.getNumberValue('COMPARE_VAL');
                var compareOP = script.getNumberValue('COMPARE_OP');

                data_address = script.getNumberValue('VALUE');

                data_default_address = data_address;
                data_default_length = data_length;

                if (
                    Entry.hw.sendQueue.prevAddress &&
                    Entry.hw.sendQueue.prevAddress == data_default_address
                ) {
                    if (
                        Entry.hw.sendQueue.prevTime &&
                        new Date() - Entry.hw.sendQueue.prevTime < 200//Entry.Robotis_openCM70.readDelay//200
                    ) {
                        //throw new Entry.Utils.AsyncError();
                
                        //  return false;
                        switch(compareOP) {
                            case 0:
                                return Entry.hw.sendQueue.prevResult > compareValue;
                            case 1:
                                return Entry.hw.sendQueue.prevResult < compareValue;
                            case 2:
                                return Entry.hw.sendQueue.prevResult == compareValue;
                            default:
                                return false;
                        }
                    }
                }

                Entry.Robotis_carCont.setRobotisData([
                    [
                        data_instruction,
                        data_address,
                        data_length,
                        data_value,
                        data_default_length,
                    ],
                ]);
                
                
                Entry.Robotis_carCont.update();

                
                var result = Entry.hw.portData[data_default_address];
                if (result == undefined)
                {
                    result = rb100_last_valid_value[data_default_address];
                }
                else
                {
                    rb100_last_valid_value[data_default_address] = result;
                }
                Entry.hw.sendQueue.prevAddress = data_default_address;
                Entry.hw.sendQueue.prevTime = new Date();
                Entry.hw.sendQueue.prevResult = result;

                if(result == undefined) {
                    return false;
                }

                switch(compareOP) {
                    case 0:
                        return result > compareValue;
                    case 1:
                        return result < compareValue;
                    case 2:
                        return result == compareValue;
                    default:
                        return false;
                }
               
            },
            syntax: {
                js: [],
                py: ['Robotis.robotis_RB_cm_ir_compare(%1)'],
            },
        },
        robotis_RB_LCDBright: {
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
                    null,
                ],
                type: 'robotis_RB_LCDBright',
            },
            paramsKeyMap: {
                BRIGHT: 0,
            },
            class: 'robotis_rb100_lcd',
            isNotFor: ['Robotis_rb', 'Robotis_rb_H', 'Robotis_rb_car', 'Robotis_rb_P_Assembly'],
            func: function (sprite, script) {
                // instruction / address / length / value / default length
                var bright = script.getNumberValue('BRIGHT', script);
                
                var data_instruction = Entry.Robotis_rb.INSTRUCTION.WRITE;
                var data_address = 180;
                var data_length = 1;
                var data_value = 0;
                
                data_value = bright;
                
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
                py: ['Robotis.RB_LCDBright(%1)'],
            },
        },
        robotis_RB_LCDColor: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.robotis_red, '224'],
                        [Lang.Blocks.robotis_orange, '244'],
                        [Lang.Blocks.robotis_yellow, '252'],
                        [Lang.Blocks.robotis_green, '28'],
                        [Lang.Blocks.robotis_blue, '3'],
                        [Lang.Blocks.robotis_brown, '173'],
                        [Lang.Blocks.robotis_black, '0'],
                        [Lang.Blocks.robotis_white, '255'],
                    ],
                    value: '224',
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
                type: 'robotis_RB_LCDColor',
            },
            paramsKeyMap: {
                COLOR: 0,
            },
            class: 'robotis_rb100_lcd',
            isNotFor: ['Robotis_rb', 'Robotis_rb_H', 'Robotis_rb_car', 'Robotis_rb_P_Assembly'],
            func: function (sprite, script) {
                // instruction / address / length / value / default length
                var color = script.getField('COLOR', script);
                
                var data_instruction = Entry.Robotis_rb.INSTRUCTION.WRITE;
                var data_address = 163;
                var data_length = 2;
                var data_value = 0;
                
                data_value = color;
                
                var data_sendqueue = [
                    [
                        Entry.Robotis_rb.INSTRUCTION.WRITE, 163, 2, 2817
                    ],
                    [
                        data_instruction,
                        data_address,
                        data_length,
                        data_value,
                    ],
                    [3, 162, 1, 1]
                ];
                return Entry.Robotis_carCont.postCallReturn(
                    script,
                    data_sendqueue,
                    Entry.Robotis_openCM70.delay + 100
                );
            },
            syntax: {
                js: [],
                py: ['Robotis.RB_LCDColor(%1)'],
            },
        },
        robotis_RB_detectSound_compare:{
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.robotis_left, '1'],
                        [Lang.Blocks.robotis_center, '0'],
                        [Lang.Blocks.robotis_right, '255'],
                    ],
                    value: '255',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [
                    null,
                ],
                type: 'robotis_RB_detectSound_compare',
            },
            paramsKeyMap: {
                VALUE: 0,
            },
            class: 'robotis_rb100_custom',
            isNotFor: ['Robotis_rb', 'Robotis_rb_H', 'Robotis_rb_car', 'Robotis_rb_P_Assembly'],
            func: function (sprite, script) {
                var scope = script.executor.scope;

                // instruction / address / length / value / default length
                var data_instruction = Entry.Robotis_rb.INSTRUCTION.READ;
                var data_address = 5031;
                var data_length = 1;
                var data_value = 0;

                var data_default_address = 0;
                var data_default_length = 0;
                var compareValue = script.getNumberValue('VALUE');


                data_default_address = data_address;
                data_default_length = data_length;

                if (
                    Entry.hw.sendQueue.prevAddress &&
                    Entry.hw.sendQueue.prevAddress == data_default_address
                ) {
                    if (
                        Entry.hw.sendQueue.prevTime &&
                        new Date() - Entry.hw.sendQueue.prevTime < Entry.Robotis_openCM70.readDelay//200
                    ) {
                        //throw new Entry.Utils.AsyncError();

                        // return false;
                        return Entry.hw.sendQueue.prevResult == compareValue;
                    }
                }

                Entry.Robotis_carCont.setRobotisData([
                    [
                        data_instruction,
                        data_address,
                        data_length,
                        data_value,
                        data_default_length,
                    ],
                ]);
                // Entry.hw.socket.send(JSON.stringify(Entry.hw.sendQueue));
                Entry.Robotis_carCont.update();

                var result = Entry.hw.portData[data_default_address];
                if (result == undefined)
                {
                    result = rb100_last_valid_value[data_default_address];
                }
                else
                {
                    rb100_last_valid_value[data_default_address] = result;
                }
                Entry.hw.sendQueue.prevAddress = data_default_address;
                Entry.hw.sendQueue.prevTime = new Date();
                Entry.hw.sendQueue.prevResult = result;

                if(result == undefined) {
                    return false;
                }


                return result == compareValue;
            },
            syntax: {
                js: [],
                py: ['Robotis.RB_detectSound_compare(%1)'],
            },
        },
        robotis_RB_LEDBright: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.robotis_left, 'RB_LED_L'],
                        [Lang.Blocks.robotis_right, 'RB_LED_R'],
                        [Lang.Blocks.robotis_both, 'RB_LED_B'],
                    ],
                    value: 'RB_LED_L',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
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
                    null,
                    {
                        type: 'number',
                        params: [100]
                    }
                ],
                type: 'robotis_RB_LEDBright',
            },
            paramsKeyMap: {
                CMLED: 0,
                BRIGHT: 1,
            },
            class: 'robotis_rb100_led',
            isNotFor: ['Robotis_rb', 'Robotis_rb_H', 'Robotis_rb_car', 'Robotis_rb_P_Assembly'],
            func: function (sprite, script) {
                // instruction / address / length / value / default length
                var cmLed = script.getField('CMLED', script);
                var bright = script.getNumberValue('BRIGHT', script);
                
                var data_instruction = Entry.Robotis_rb.INSTRUCTION.WRITE;
                var data_address = 0;
                var data_length = 1;
                var data_value = 0;
            
                if(bright < 0){ 
                    bright = 0;
                } else if(bright > 100) {
                    bright = 100
                }
                data_value = 100+bright;
            

                if (cmLed == 'RB_LED_L') {
                    data_address =
                        Entry.Robotis_rb.CONTROL_TABLE.RB_LED_L[0];
                    data_length =
                        Entry.Robotis_rb.CONTROL_TABLE.RB_LED_L[1];
                } else if (cmLed == 'RB_LED_R') {
                    data_address =
                        Entry.Robotis_rb.CONTROL_TABLE.RB_LED_R[0];
                    data_length =
                        Entry.Robotis_rb.CONTROL_TABLE.RB_LED_R[1];
                } else if (cmLed == 'RB_LED_B') {
                    data_address =
                        Entry.Robotis_rb.CONTROL_TABLE.RB_LED_B[0];
                    data_length =
                        Entry.Robotis_rb.CONTROL_TABLE.RB_LED_B[1];
                    if(bright != 0){
                        data_value = 257*(bright+100);
                    }
                }

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
                py: ['Robotis.RB_LEDBright(%1, %2)'],
            },
        },
        robotis_RB_Hello: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.robotis_korean1,'0'],
                        [Lang.Blocks.robotis_korean2,'1'],
                        [Lang.Blocks.robotis_korean3,'2'],
                        [Lang.Blocks.robotis_korean4,'3'],
                        [Lang.Blocks.robotis_korean5,'4'],
                        [Lang.Blocks.robotis_korean6,'5'],
                        [Lang.Blocks.robotis_korean7,'6'],
                        [Lang.Blocks.robotis_korean8,'7'],
                        [Lang.Blocks.robotis_korean9,'8'],
                        [Lang.Blocks.robotis_korean10,'9'],
                        [Lang.Blocks.robotis_korean11,'10'],
                        [Lang.Blocks.robotis_korean12,'11'],
                        [Lang.Blocks.robotis_korean13,'12'],
                        [Lang.Blocks.robotis_korean14,'13'],
                        [Lang.Blocks.robotis_korean15,'14'],
                        [Lang.Blocks.robotis_korean16,'15'],
                        [Lang.Blocks.robotis_korean17,'16'],
                        [Lang.Blocks.robotis_korean18,'17'],
                        [Lang.Blocks.robotis_korean19,'18'],
                        [Lang.Blocks.robotis_korean20,'19'],
                        [Lang.Blocks.robotis_korean21,'20'],
                        [Lang.Blocks.robotis_korean22,'21'],
                        [Lang.Blocks.robotis_korean23,'22'],
                        [Lang.Blocks.robotis_korean24,'23'],
                        [Lang.Blocks.robotis_korean25,'24'],
                        [Lang.Blocks.robotis_korean26,'25'],
                        [Lang.Blocks.robotis_korean27,'26'],
                        [Lang.Blocks.robotis_korean28,'27'],
                        [Lang.Blocks.robotis_korean29,'28'],
                        [Lang.Blocks.robotis_korean30,'29'],
                        [Lang.Blocks.robotis_korean31,'30'],
                        [Lang.Blocks.robotis_korean32,'31'],
                        [Lang.Blocks.robotis_korean33,'32'],
                        [Lang.Blocks.robotis_korean34,'33'],
                        [Lang.Blocks.robotis_korean35,'34'],
                        [Lang.Blocks.robotis_korean36,'35'],
                        [Lang.Blocks.robotis_korean37,'36'],
                        [Lang.Blocks.robotis_korean38,'37'],
                        [Lang.Blocks.robotis_korean39,'38'],
                        [Lang.Blocks.robotis_korean40,'39'],
                        [Lang.Blocks.robotis_korean41,'40'],
                        [Lang.Blocks.robotis_korean42,'41'],
                        [Lang.Blocks.robotis_korean43,'42'],
                        [Lang.Blocks.robotis_korean44,'43'],
                        [Lang.Blocks.robotis_korean45,'44'],
                        [Lang.Blocks.robotis_korean46,'45'],
                        [Lang.Blocks.robotis_korean47,'46'],
                        [Lang.Blocks.robotis_korean48,'47'],
                        [Lang.Blocks.robotis_korean49,'48'],
                        [Lang.Blocks.robotis_korean50,'49'],
                        [Lang.Blocks.robotis_korean51,'50'],
                        [Lang.Blocks.robotis_korean52,'51'],
                        [Lang.Blocks.robotis_korean53,'52'],
                        [Lang.Blocks.robotis_korean54,'53'],
                        [Lang.Blocks.robotis_korean55,'54'],
                        [Lang.Blocks.robotis_korean56,'55'],
                        [Lang.Blocks.robotis_korean57,'56'],
                        [Lang.Blocks.robotis_korean58,'57'],
                        [Lang.Blocks.robotis_korean59,'58'],
                        [Lang.Blocks.robotis_korean60,'59'],
                    ],
                    value: '0',
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
                type: 'robotis_RB_Hello',
            },
            paramsKeyMap: {
                HELLO: 0,
            },
            class: 'robotis_rb100_sound',
            isNotFor: ['Robotis_rb', 'Robotis_rb_H', 'Robotis_rb_car', 'Robotis_rb_P_Assembly'],
            func: function (sprite, script) {
                // instruction / address / length / value / default length
                var cmHello = script.getField('HELLO', script);
                
                var data_instruction = Entry.Robotis_rb.INSTRUCTION.WRITE;
                var data_address = 110;
                var data_length = 2;
                var data_value = 0;
            
               
                data_value = 25601+Number(cmHello);

                var data_sendqueue = [
                    [
                        data_instruction,
                        data_address,
                        data_length,
                        data_value,
                    ],
                    [
                        data_instruction,
                        0,
                        2,
                        0
                    ]
                ];


                let extraTime = 0; 
                
                if(cmHello == '38' || cmHello == '55') {
                    extraTime = 2000;
                }

                return Entry.Robotis_carCont.postCallReturn(
                    script,
                    data_sendqueue,
                    2000 + extraTime
                );
            },
            syntax: {
                js: [],
                py: ['Robotis.RB_Hello(%1)'],
            },
        },
        robotis_RB_effectSound:{
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.robotis_dog, '0'],
                        [Lang.Blocks.robotis_frog, '1'],
                        [Lang.Blocks.robotis_cat, '2'],
                        [Lang.Blocks.robotis_chicken, '7'],
                        [Lang.Blocks.robotis_tiger, '19'],
                        [Lang.Blocks.robotis_mouse, '17'],

                        [Lang.Blocks.robotis_ambul, '773'],
                        [Lang.Blocks.robotis_Horn, '781'],
                        [Lang.Blocks.robotis_siren, '774'],
                        [Lang.Blocks.robotis_whistle, '274'],
                        [Lang.Blocks.robotis_gun, '775'],
                        [Lang.Blocks.robotis_clap, '260'],

                        [Lang.Blocks.robotis_melody1, '786'],
                        [Lang.Blocks.robotis_melody2, '787'],
                        [Lang.Blocks.robotis_melody3, '788'],
                        [Lang.Blocks.robotis_melody4, '789'],
                    ],
                    value: '0',
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
                type: 'robotis_RB_effectSound',
            },
            paramsKeyMap: {
                HELLO: 0,
            },
            class: 'robotis_rb100_sound',
            isNotFor: ['Robotis_rb', 'Robotis_rb_H', 'Robotis_rb_car', 'Robotis_rb_P_Assembly'],
            func: function (sprite, script) {
                // instruction / address / length / value / default length
                var cmHello = script.getField('HELLO', script);
                
                var data_instruction = Entry.Robotis_rb.INSTRUCTION.WRITE;
                var data_address = 110;
                var data_length = 2;
                var data_value = 0;
            
               
                data_value = Number(cmHello);

                var data_sendqueue = [
                    [
                        data_instruction,
                        data_address,
                        data_length,
                        data_value,
                    ],
                    [
                        data_instruction,
                        0,
                        2,
                        0
                    ]
                ];
                
                let extraTime = 0;
                if(cmHello == '272' || cmHello == '786' || cmHello == '787' || cmHello == '788' || cmHello == '789') { //오리
                    extraTime = 0;
                    if(cmHello == '788' || cmHello == '789') {
                        extraTime += 500;
                    }
                }
                return Entry.Robotis_carCont.postCallReturn(
                    script,
                    data_sendqueue,
                    3000 + extraTime
                );
            },
            syntax: {
                js: [],
                py: ['Robotis.RB_Hello(%1)'],
            },
        },
        robotis_RB_record:{
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['1', '0'],
                        ['2', '1'],
                        ['3', '2'],
                        ['4', '3'],
                        ['5', '4'],
                    ],
                    value: '0',
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
                type: 'robotis_RB_record',
            },
            paramsKeyMap: {
                ROOM: 0,
            },
            class: 'robotis_rb100_sound',
            isNotFor: ['Robotis_rb', 'Robotis_rb_H', 'Robotis_rb_car', 'Robotis_rb_P_Assembly'],
            func: function (sprite, script) {
                // instruction / address / length / value / default length
                var roomNum = script.getField('ROOM', script);
                
                var data_instruction = Entry.Robotis_rb.INSTRUCTION.WRITE;
                var data_address = 115;
                var data_length = 1;
                var data_value = 0;
            
               
                data_value = roomNum;

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
                    6000
                );
            },
            syntax: {
                js: [],
                py: ['Robotis.RB_record(%1)'],
            },
        },
        robotis_RB_playRecord:{
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['1', '0'],
                        ['2', '1'],
                        ['3', '2'],
                        ['4', '3'],
                        ['5', '4'],
                    ],
                    value: '0',
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
                type: 'robotis_RB_playRecord',
            },
            paramsKeyMap: {
                ROOM: 0,
            },
            class: 'robotis_rb100_sound',
            isNotFor: ['Robotis_rb', 'Robotis_rb_H', 'Robotis_rb_car', 'Robotis_rb_P_Assembly'],
            func: function (sprite, script) {
                // instruction / address / length / value / default length
                var roomNum = script.getField('ROOM', script);
                
                var data_instruction = Entry.Robotis_rb.INSTRUCTION.WRITE;
                var data_address = 116;
                var data_length = 1;
                var data_value = 0;
            
               
                data_value = roomNum;

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
                    6000
                );
            },
            syntax: {
                js: [],
                py: ['Robotis.RB_playRecord(%1)'],
            },
        },
        robotis_RB_detectFrontObj:{
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
            statements: [],
            params: [
                
            ],
            events: {},
            def: {
                params: [
                  
                ],
                type: 'robotis_RB_detectFrontObj',
            },
            paramsKeyMap: {
                VALUE: 0,
            },
            class: 'robotis_rb100_custom',
            isNotFor: ['Robotis_rb', 'Robotis_rb_H', 'Robotis_rb_car', 'Robotis_rb_P_Assembly'],
            func: function (sprite, script) {
                var scope = script.executor.scope;

                // instruction / address / length / value / default length
                var data_instruction = Entry.Robotis_rb.INSTRUCTION.READ;
                var data_address = 360;
                var data_length = 4;
                var data_value = 0;

                var data_default_address = 0;
                var data_default_length = 0;
                var compareValue = script.getNumberValue('VALUE');


                data_default_address = data_address;
                data_default_length = data_length;

                if (
                    Entry.hw.sendQueue.prevAddress &&
                    Entry.hw.sendQueue.prevAddress == data_default_address
                ) {
                    if (
                        Entry.hw.sendQueue.prevTime &&
                        new Date() - Entry.hw.sendQueue.prevTime < Entry.Robotis_openCM70.readDelay//200
                    ) {
                        // return false;
                        let ir_1 = Entry.hw.sendQueue.prevResult & 0xffff;
                        let ir_2 =  Entry.hw.sendQueue.prevResult >> 16;
                        
                        return ir_1 > 100 || ir_2 > 100//Entry.hw.sendQueue.prevResult// > 10000000;
                    }
                }

                Entry.Robotis_carCont.setRobotisData([
                    [
                        data_instruction,
                        data_address,
                        data_length,
                        data_value,
                        data_default_length,
                    ],
                ]);
                Entry.Robotis_carCont.update();

                var result = Entry.hw.portData[data_default_address];
                if (result == undefined)
                {
                    result = rb100_last_valid_value[data_default_address];
                }
                else
                {
                    rb100_last_valid_value[data_default_address] = result;
                }
                Entry.hw.sendQueue.prevAddress = data_default_address;
                Entry.hw.sendQueue.prevTime = new Date();
                Entry.hw.sendQueue.prevResult = result;

                if(result == undefined) {
                    return false;
                }


                let ir_1 = Entry.hw.sendQueue.prevResult & 0xffff;
                let ir_2 =  Entry.hw.sendQueue.prevResult >> 16;
                

                return ir_1 > 100 || ir_2 > 100
                return result// > 10000000;
            },
            syntax: {
                js: [],
                py: ['Robotis.RB_detectFrontObj()'],
            },
        },
        /*
        robotis_RB_detectPose:{
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.robotis_forward, '1'],//72
                        [Lang.Blocks.robotis_backward, '2'],//74
                    ],
                    value: '1',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                }
            ],
            events: {},
            def: {
                params: [
                  null
                ],
                type: 'robotis_RB_detectPose',
            },
            paramsKeyMap: {
                VALUE: 0,
            },
            class: 'robotis_rb100_custom',
            isNotFor: ['Robotis_rb_H', 'Robotis_rb_P_Assembly'],
            func: function (sprite, script) {
                var scope = script.executor.scope;

                // instruction / address / length / value / default length
                var data_instruction = Entry.Robotis_rb.INSTRUCTION.READ;
                var data_address = 78;
                var data_length = 2;
                var data_value = 0;

                var data_default_address = 0;
                var data_default_length = 0;
                var compareValue = script.getNumberValue('VALUE');


                data_default_address = data_address;
                data_default_length = data_length;

                if (
                    Entry.hw.sendQueue.prevAddress &&
                    Entry.hw.sendQueue.prevAddress == data_default_address
                ) {
                    if (
                        Entry.hw.sendQueue.prevTime &&
                        new Date() - Entry.hw.sendQueue.prevTime < Entry.Robotis_openCM70.readDelay//200
                    ) {
                        // return false;
                        switch(compareValue) {
                            case 1:
                                return Entry.hw.sendQueue.prevResult > 30;
                            case 2:
                                return Entry.hw.sendQueue.prevResult < -30;
                        }                        

                    }
                }

                Entry.Robotis_carCont.setRobotisData([
                    [
                        data_instruction,
                        data_address,
                        data_length,
                        data_value,
                        data_default_length,
                    ],
                ]);
                Entry.Robotis_carCont.update();

                var result = Entry.hw.portData[data_default_address];
                if (result == undefined)
                {
                    result = rb100_last_valid_value[data_default_address];
                }
                else
                {
                    rb100_last_valid_value[data_default_address] = result;
                }
                Entry.hw.sendQueue.prevAddress = data_default_address;
                Entry.hw.sendQueue.prevTime = new Date();
                Entry.hw.sendQueue.prevResult = result;

                switch(compareValue) {
                    case 1:
                        return result > 30;
                    case 2:
                        return result < -30;
                }
            },
            syntax: {
                js: [],
                py: ['Robotis.RB_detectFrontObj()'],
            },
        },*/
        robotis_RB_mic:{
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [],
            events: {},
            def: {
                params: [
                    null
                ],
                type: 'robotis_RB_mic',
            },
            paramsKeyMap: {
                VALUE: 0,
            },
            class: 'robotis_rb100_custom',
            isNotFor: ['Robotis_rb', 'Robotis_rb_H', 'Robotis_rb_car', 'Robotis_rb_P_Assembly'],
            func: function (sprite, script) {
                var scope = script.executor.scope;

                // instruction / address / length / value / default length
                var data_instruction = Entry.Robotis_rb.INSTRUCTION.READ;
                var data_address = 0;
                var data_length = 1;
                var data_value = 0;

                var data_default_address = 0;
                var data_default_length = 0;

                
                data_address = 119;

                data_default_address = data_address;
                data_default_length = data_length;

                if (
                    Entry.hw.sendQueue.prevAddress &&
                    Entry.hw.sendQueue.prevAddress == data_default_address
                ) {
                    if (
                        Entry.hw.sendQueue.prevTime &&
                        new Date() - Entry.hw.sendQueue.prevTime < Entry.Robotis_openCM70.readDelay
                    ) {
                        //throw new Entry.Utils.AsyncError();
                        if(typeof Entry.hw.sendQueue.prevResult == 'undefined') {
                            return 0;
                        }
                        return Entry.hw.sendQueue.prevResult;
                    }
                }

                Entry.Robotis_carCont.setRobotisData([
                    [
                        data_instruction,
                        data_address,
                        data_length,
                        data_value,
                        data_default_length,
                    ],
                ]);
                // Entry.hw.socket.send(JSON.stringify(Entry.hw.sendQueue));
                Entry.Robotis_carCont.update();

                var result = Entry.hw.portData[data_default_address];
                if (result == undefined)
                {
                    result = rb100_last_valid_value[data_default_address];
                }
                else
                {
                    rb100_last_valid_value[data_default_address] = result;
                }
                Entry.hw.sendQueue.prevAddress = data_default_address;
                Entry.hw.sendQueue.prevTime = new Date();
                Entry.hw.sendQueue.prevResult = result;

                if(typeof result == 'undefined') {

                    return 0;
                }
                return result;
            },
            syntax: {
                js: [],
                py: ['Robotis.robotis_RB_mic()'],
            },
        },
        robotis_RB_imu:{
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['x', '78'],//72
                        ['y', '80'],//74
                        ['z', '82']//76
                    ],
                    value: '78',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.robotis_acceleration, '0'],//72
                        [Lang.Blocks.robotis_gyro, '6'],//74
                    ],
                    value: '0',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                }
            ],
            events: {},
            def: {
                params: [
                    null,
                    null
                ],
                type: 'robotis_RB_imu',
            },
            paramsKeyMap: {
                AXIS: 0,
                MODE: 1,
            },
            class: 'robotis_rb100_custom',
            isNotFor: ['Robotis_rb', 'Robotis_rb_H', 'Robotis_rb_car', 'Robotis_rb_P_Assembly'],
            func: function (sprite, script) {
                var scope = script.executor.scope;

                // instruction / address / length / value / default length
                var data_instruction = Entry.Robotis_rb.INSTRUCTION.READ;
                var data_address = 0;
                var data_length = 2;
                var data_value = 0;

                var data_default_address = 0;
                var data_default_length = 0;

                
                data_address = script.getField('AXIS', script) - script.getField('MODE', script);
                
                data_default_address = data_address;
                data_default_length = data_length;

                if (
                    Entry.hw.sendQueue.prevAddress &&
                    Entry.hw.sendQueue.prevAddress == data_default_address
                ) {
                    if (
                        Entry.hw.sendQueue.prevTime &&
                        new Date() - Entry.hw.sendQueue.prevTime < Entry.Robotis_openCM70.readDelay
                    ) {
                        //throw new Entry.Utils.AsyncError();
                        if(typeof Entry.hw.sendQueue.prevResult == 'undefined') {
                            return 0;
                        }
                        return Entry.hw.sendQueue.prevResult;
                    }
                }

                Entry.Robotis_carCont.setRobotisData([
                    [
                        data_instruction,
                        data_address,
                        data_length,
                        data_value,
                        data_default_length,
                    ],
                ]);
                // Entry.hw.socket.send(JSON.stringify(Entry.hw.sendQueue));
                Entry.Robotis_carCont.update();

                var result = Entry.hw.portData[data_default_address];
                if (result == undefined)
                {
                    result = rb100_last_valid_value[data_default_address];
                }
                else
                {
                    rb100_last_valid_value[data_default_address] = result;
                }
                Entry.hw.sendQueue.prevAddress = data_default_address;
                Entry.hw.sendQueue.prevTime = new Date();
                Entry.hw.sendQueue.prevResult = result;

                if(typeof result == 'undefined') {
                    
                    return 0;
                }
                return result;
            },
            syntax: {
                js: [],
                py: ['Robotis.robotis_RB_imu()'],
            },
        },
        robotis_RB_roll_pitch:{
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['Roll', '70'],//72
                        ['Pitch', '88'],//74
                    ],
                    value: '70',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                }
            ],
            events: {},
            def: {
                params: [
                    null,
                ],
                type: 'robotis_RB_roll_pitch',
            },
            paramsKeyMap: {
                AXIS: 0,
            },
            class: 'robotis_rb100_custom',
            isNotFor: ['Robotis_rb', 'Robotis_rb_H', 'Robotis_rb_car', 'Robotis_rb_P_Assembly'],
            func: function (sprite, script) {
                var scope = script.executor.scope;

                // instruction / address / length / value / default length
                var data_instruction = Entry.Robotis_rb.INSTRUCTION.READ;
                var data_address = 0;
                var data_length = 2;
                var data_value = 0;

                var data_default_address = 0;
                var data_default_length = 0;

                
                data_address = script.getNumberValue('AXIS');
                
                data_default_address = data_address;
                data_default_length = data_length;

                if (
                    Entry.hw.sendQueue.prevAddress &&
                    Entry.hw.sendQueue.prevAddress == data_default_address
                ) {
                    if (
                        Entry.hw.sendQueue.prevTime &&
                        new Date() - Entry.hw.sendQueue.prevTime < Entry.Robotis_openCM70.readDelay
                    ) {
                        //throw new Entry.Utils.AsyncError();
                        if(typeof Entry.hw.sendQueue.prevResult == 'undefined') {
                            return 0;
                        }
                        return Entry.hw.sendQueue.prevResult;
                    }
                }

                Entry.Robotis_carCont.setRobotisData([
                    [
                        data_instruction,
                        data_address,
                        data_length,
                        data_value,
                        data_default_length,
                    ],
                ]);
                // Entry.hw.socket.send(JSON.stringify(Entry.hw.sendQueue));
                Entry.Robotis_carCont.update();

                var result = Entry.hw.portData[data_default_address];
                if (result == undefined)
                {
                    result = rb100_last_valid_value[data_default_address];
                }
                else
                {
                    rb100_last_valid_value[data_default_address] = result;
                }
                Entry.hw.sendQueue.prevAddress = data_default_address;
                Entry.hw.sendQueue.prevTime = new Date();
                Entry.hw.sendQueue.prevResult = result;

                if(typeof result == 'undefined') {

                    return 0;
                }
                return result;
            },
            syntax: {
                js: [],
                py: ['Robotis.robotis_RB_roll_pitch(%1)'],
            },
        },
        robotis_RB_environment_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['ID 100', '100'],
                        ['ID 101', '101'],
                        ['ID 102', '102'],
                        ['ID 103', '103'],
                        ['ID 104', '104'],
                    ],
                    value: '100',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.robotis_sensing_temperature, '28'],
                        [Lang.Blocks.robotis_sensing_humidity, '29'],
                        [Lang.Blocks.robotis_sensing_brightness, '30'],
                        [Lang.Blocks.robotis_sensing_motion, '27'],
                    ],
                    value: '28',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [
                    null,
                    null
                ],
                type: 'robotis_RB_environment_value',
            },
            paramsKeyMap: {
                ID: 0,
                ADDR: 1,
            },
            class: 'robotis_rb100_custom',
            isNotFor: ['Robotis_rb_H', 'Robotis_rb_car', 'Robotis_rb_P_Assembly'],
            func: function (sprite, script) {
                var scope = script.executor.scope;

                // instruction / address / length / value / default length
                var data_instruction = Entry.Robotis_rb.INSTRUCTION.BYPASS_READ;
                var data_address = 0;
                var data_length = 1;
                var data_value = script.getNumberValue('ID');;

                var data_default_address = 0;
                var data_default_length = 0;

                
                data_address = script.getNumberValue('ADDR');

                data_default_address = data_address;
                data_default_length = data_length;

                if (
                    Entry.hw.sendQueue.prevAddress &&
                    Entry.hw.sendQueue.prevAddress == data_default_address
                ) {
                    if (
                        Entry.hw.sendQueue.prevTime &&
                        new Date() - Entry.hw.sendQueue.prevTime < Entry.Robotis_openCM70.readDelay
                    ) {
                        //throw new Entry.Utils.AsyncError();
                        if(typeof Entry.hw.sendQueue.prevResult == 'undefined') {
                            return 0;
                        }
                        return Entry.hw.sendQueue.prevResult;
                    }
                }

                Entry.Robotis_carCont.setRobotisData([
                    [
                        data_instruction,
                        data_address,
                        data_length,
                        data_value,
                        data_default_length,
                    ],
                ]);
                // Entry.hw.socket.send(JSON.stringify(Entry.hw.sendQueue));
                Entry.Robotis_carCont.update();

                // 통합센서의 컨트롤 테이블 주소는 RB-100블록에서 사용하지 않는 주소를 사용
                // 주소 겹침 방지
                var result = Entry.hw.portData[data_default_address];
                if (result == undefined)
                {
                    result = rb100_last_valid_value[data_default_address];
                }
                else
                {
                    rb100_last_valid_value[data_default_address] = result;
                }
                Entry.hw.sendQueue.prevAddress = data_default_address;
                Entry.hw.sendQueue.prevTime = new Date();
                Entry.hw.sendQueue.prevResult = result;

                if(typeof result == 'undefined') {

                    return 0;
                }
                return result;
            },
            syntax: {
                js: [],
                py: ['Robotis.opencm70_cm_environment_value(%1)'],
            },
        },
        robotis_RB_environment_compare: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['ID 100', '100'],
                        ['ID 101', '101'],
                        ['ID 102', '102'],
                        ['ID 103', '103'],
                        ['ID 104', '104'],
                    ],
                    value: '100',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.robotis_sensing_temperature, '28'],
                        [Lang.Blocks.robotis_sensing_humidity, '29'],
                        [Lang.Blocks.robotis_sensing_brightness, '30'],
                        [Lang.Blocks.robotis_sensing_motion, '27'],
                    ],
                    value: '28',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        ['>', '0'],
                        ['<', '1'],
                        ['=', '2'],
                    ],
                    value: '0',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Block',
                    accept: 'string',
                    value: 'asdfasdf',
                },
            ],
            events: {},
            def: {
                params: [
                    null,
                    null,
                    null,
                    {
                        type: 'number',
                        params: [0]
                    }
                ],
                type: 'robotis_RB_environment_compare',
            },
            paramsKeyMap: {
                ID: 0,
                ADDR: 1,
                COMPARE_OP: 2,
                COMPARE_VAL: 3,
            },
            class: 'robotis_rb100_custom',
            isNotFor: ['Robotis_rb_H', 'Robotis_rb_car', 'Robotis_rb_P_Assembly'],
            func: function (sprite, script) {
                var scope = script.executor.scope;

                // instruction / address / length / value / default length
                var data_instruction = Entry.Robotis_rb.INSTRUCTION.BYPASS_READ;
                var data_address = 0;
                var data_length = 1;
                var data_id = script.getNumberValue('ID');

                var data_default_address = 0;
                var data_default_length = 0;
                var compareValue = script.getNumberValue('COMPARE_VAL');
                var compareOP = script.getNumberValue('COMPARE_OP');

                data_address = script.getNumberValue('ADDR');

                data_default_address = data_address;
                data_default_length = data_length;

                if (
                    Entry.hw.sendQueue.prevAddress &&
                    Entry.hw.sendQueue.prevAddress == data_default_address
                ) {
                    if (
                        Entry.hw.sendQueue.prevTime &&
                        new Date() - Entry.hw.sendQueue.prevTime < 200//Entry.Robotis_openCM70.readDelay//200
                    ) {
                        //throw new Entry.Utils.AsyncError();
                
                        //  return false;
                        switch(compareOP) {
                            case 0:
                                return Entry.hw.sendQueue.prevResult > compareValue;
                            case 1:
                                return Entry.hw.sendQueue.prevResult < compareValue;
                            case 2:
                                return Entry.hw.sendQueue.prevResult == compareValue;
                            default:
                                return false;
                        }
                    }
                }

                Entry.Robotis_carCont.setRobotisData([
                    [
                        data_instruction,
                        data_address,
                        data_length,
                        data_id,
                        data_default_length,
                    ],
                ]);
                
                
                Entry.Robotis_carCont.update();

                
                // 통합센서의 컨트롤 테이블 주소는 RB-100블록에서 사용하지 않는 주소를 사용
                // 주소 겹침 방지
                var result = Entry.hw.portData[data_default_address];
                if (result == undefined)
                {
                    result = rb100_last_valid_value[data_default_address];
                }
                else
                {
                    rb100_last_valid_value[data_default_address] = result;
                }
                Entry.hw.sendQueue.prevAddress = data_default_address;
                Entry.hw.sendQueue.prevTime = new Date();
                Entry.hw.sendQueue.prevResult = result;

                if(result == undefined) {
                    return false;
                }

                switch(compareOP) {
                    case 0:
                        return result > compareValue;
                    case 1:
                        return result < compareValue;
                    case 2:
                        return result == compareValue;
                    default:
                        return false;
                }
               
            },
            syntax: {
                js: [],
                py: ['Robotis.robotis_RB_cm_environment_compare(%1)'],
            },
        },
        robotis_RB_distance_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['ID 110', '110'],
                        ['ID 111', '111'],
                        ['ID 112', '112'],
                        ['ID 113', '113'],
                        ['ID 114', '114'],
                    ],
                    value: '110',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.robotis_sensing_distance, '25'],
                        [Lang.Blocks.robotis_sensing_button, '24'],
                        [Lang.Blocks.robotis_sensing_ir_left, '31'],
                        [Lang.Blocks.robotis_sensing_ir_right, '33'],
                    ],
                    value: '25',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [
                    null,
                    null
                ],
                type: 'robotis_RB_distance_value',
            },
            paramsKeyMap: {
                ID: 0,
                ADDR: 1,
            },
            class: 'robotis_rb100_custom',
            isNotFor: ['Robotis_rb', 'Robotis_rb_H', 'Robotis_rb_car', 'Robotis_rb_P_Assembly'],
            func: function (sprite, script) {
                var scope = script.executor.scope;

                // instruction / address / length / value / default length
                var data_instruction = Entry.Robotis_rb.INSTRUCTION.BYPASS_READ;
                var data_address = 0;
                var data_length = 2;
                var data_value = script.getNumberValue('ID');;

                var data_default_address = 0;
                var data_default_length = 0;
                
                data_address = script.getNumberValue('ADDR');

                if (data_address == 24) data_length = 1;

                data_default_address = data_address;
                data_default_length = data_length;

                if (
                    Entry.hw.sendQueue.prevAddress &&
                    Entry.hw.sendQueue.prevAddress == data_default_address
                ) {
                    if (
                        Entry.hw.sendQueue.prevTime &&
                        new Date() - Entry.hw.sendQueue.prevTime < Entry.Robotis_openCM70.readDelay
                    ) {
                        //throw new Entry.Utils.AsyncError();
                        if(typeof Entry.hw.sendQueue.prevResult == 'undefined') {
                            return 0;
                        }
                        return Entry.hw.sendQueue.prevResult;
                    }
                }

                Entry.Robotis_carCont.setRobotisData([
                    [
                        data_instruction,
                        data_address,
                        data_length,
                        data_value,
                        data_default_length,
                    ],
                ]);
                // Entry.hw.socket.send(JSON.stringify(Entry.hw.sendQueue));
                Entry.Robotis_carCont.update();

                // 통합센서의 컨트롤 테이블 주소는 RB-100블록에서 사용하지 않는 주소를 사용
                // 주소 겹침 방지
                var result = Entry.hw.portData[data_default_address];
                if (result == undefined)
                {
                    result = rb100_last_valid_value[data_default_address];
                }
                else
                {
                    rb100_last_valid_value[data_default_address] = result;
                }
                Entry.hw.sendQueue.prevAddress = data_default_address;
                Entry.hw.sendQueue.prevTime = new Date();
                Entry.hw.sendQueue.prevResult = result;

                if(typeof result == 'undefined') {

                    return 0;
                }
                return result;
            },
            syntax: {
                js: [],
                py: ['Robotis.opencm70_cm_distance_value(%1)'],
            },
        },
        robotis_RB_distance_compare: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['ID 110', '110'],
                        ['ID 111', '111'],
                        ['ID 112', '112'],
                        ['ID 113', '113'],
                        ['ID 114', '114'],
                    ],
                    value: '110',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.robotis_sensing_distance, '25'],
                        [Lang.Blocks.robotis_sensing_button, '24'],
                        [Lang.Blocks.robotis_sensing_ir_left, '31'],
                        [Lang.Blocks.robotis_sensing_ir_right, '33'],
                    ],
                    value: '25',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        ['>', '0'],
                        ['<', '1'],
                        ['=', '2'],
                    ],
                    value: '0',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Block',
                    accept: 'string',
                    value: 'asdfasdf',
                },
            ],
            events: {},
            def: {
                params: [
                    null,
                    null,
                    null,
                    {
                        type: 'number',
                        params: [0]
                    }
                ],
                type: 'robotis_RB_distance_compare',
            },
            paramsKeyMap: {
                ID: 0,
                ADDR: 1,
                COMPARE_OP: 2,
                COMPARE_VAL: 3,
            },
            class: 'robotis_rb100_custom',
            isNotFor: ['Robotis_rb', 'Robotis_rb_H', 'Robotis_rb_car', 'Robotis_rb_P_Assembly'],
            func: function (sprite, script) {
                var scope = script.executor.scope;

                // instruction / address / length / value / default length
                var data_instruction = Entry.Robotis_rb.INSTRUCTION.BYPASS_READ;
                var data_address = 0;
                var data_length = 2;
                var data_id = script.getNumberValue('ID');

                var data_default_address = 0;
                var data_default_length = 0;
                var compareValue = script.getNumberValue('COMPARE_VAL');
                var compareOP = script.getNumberValue('COMPARE_OP');

                data_address = script.getNumberValue('ADDR');

                if (data_address == 24) data_length = 1;

                data_default_address = data_address;
                data_default_length = data_length;

                if (
                    Entry.hw.sendQueue.prevAddress &&
                    Entry.hw.sendQueue.prevAddress == data_default_address
                ) {
                    if (
                        Entry.hw.sendQueue.prevTime &&
                        new Date() - Entry.hw.sendQueue.prevTime < 200//Entry.Robotis_openCM70.readDelay//200
                    ) {
                        //throw new Entry.Utils.AsyncError();
                
                        //  return false;
                        switch(compareOP) {
                            case 0:
                                return Entry.hw.sendQueue.prevResult > compareValue;
                            case 1:
                                return Entry.hw.sendQueue.prevResult < compareValue;
                            case 2:
                                return Entry.hw.sendQueue.prevResult == compareValue;
                            default:
                                return false;
                        }
                    }
                }

                Entry.Robotis_carCont.setRobotisData([
                    [
                        data_instruction,
                        data_address,
                        data_length,
                        data_id,
                        data_default_length,
                    ],
                ]);
                
                
                Entry.Robotis_carCont.update();

                
                // 통합센서의 컨트롤 테이블 주소는 RB-100블록에서 사용하지 않는 주소를 사용
                // 주소 겹침 방지
                var result = Entry.hw.portData[data_default_address];
                if (result == undefined)
                {
                    result = rb100_last_valid_value[data_default_address];
                }
                else
                {
                    rb100_last_valid_value[data_default_address] = result;
                }
                Entry.hw.sendQueue.prevAddress = data_default_address;
                Entry.hw.sendQueue.prevTime = new Date();
                Entry.hw.sendQueue.prevResult = result;

                if(result == undefined) {
                    return false;
                }

                switch(compareOP) {
                    case 0:
                        return result > compareValue;
                    case 1:
                        return result < compareValue;
                    case 2:
                        return result == compareValue;
                    default:
                        return false;
                }
               
            },
            syntax: {
                js: [],
                py: ['Robotis.robotis_RB_cm_distance_compare(%1)'],
            },
        },
        robotis_RB_cm_joystick_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [ 
                        [Lang.Blocks.robotis_center, '0'],
                        ['←', '1'],
                        ['→', '2'],
                        ['↑', '3'],
                        ['↓', '4'],
                        ['↖', '5'],
                        ['↗', '6'],
                        ['↙', '7'],
                        ['↘', '8'],
                    ],
                    value: '0',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                }
            ],
            events: {},
            def: {
                params: [
                    null
                ],
                type: 'robotis_RB_cm_joystick_value',
            },
            paramsKeyMap: {
                COMPARE_VAL: 0,
            },
            class: 'robotis_rb100_custom',
            isNotFor: ['Robotis_rb', 'Robotis_rb_H', 'Robotis_rb_car', 'Robotis_rb_P_Assembly'],
            func: function (sprite, script) {
                var scope = script.executor.scope;

                // instruction / address / length / value / default length
                var data_instruction = Entry.Robotis_rb.INSTRUCTION.READ;
                var data_address = 0;
                var data_length = 1;
                var data_value = 0;

                var data_default_address = 0;
                var data_default_length = 0;

                
                data_address = 50;

                data_default_address = data_address;
                data_default_length = data_length;

                var compareValue = script.getNumberValue('COMPARE_VAL', script);

                if (
                    Entry.hw.sendQueue.prevAddress &&
                    Entry.hw.sendQueue.prevAddress == data_default_address
                ) {
                    if (
                        Entry.hw.sendQueue.prevTime &&
                        new Date() - Entry.hw.sendQueue.prevTime < 200
                    ) {
                        //throw new Entry.Utils.AsyncError();
                         
                        return (Entry.hw.sendQueue.prevResult == compareValue);
                    }
                }

                Entry.Robotis_carCont.setRobotisData([
                    [
                        data_instruction,
                        data_address,
                        data_length,
                        data_value,
                        data_default_length,
                    ],
                ]);
                // Entry.hw.socket.send(JSON.stringify(Entry.hw.sendQueue));
                Entry.Robotis_carCont.update();

                var result = Entry.hw.portData[data_default_address];
                if (result == undefined)
                {
                    result = rb100_last_valid_value[data_default_address];
                }
                else
                {
                    rb100_last_valid_value[data_default_address] = result;
                }
                Entry.hw.sendQueue.prevAddress = data_default_address;
                Entry.hw.sendQueue.prevTime = new Date();
                Entry.hw.sendQueue.prevResult = result;
                
                if(result == undefined) {
                    return false;
                }

                return (result == compareValue);
            },
            syntax: {
                js: [],
                py: ['Robotis.openCM70_cm_joystick_value()'],
            },
        },
        robotis_RB_cm_btn_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.robotis_run, '45'],
                        [Lang.Blocks.robotis_cancel, '42'],
                    ],
                    value: '45',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.robotis_push, '1'],
                        [Lang.Blocks.robotis_notPush, '0'],

                    ],
                    value: '1',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [
                    null,
                    null
                ],
                type: 'robotis_RB_cm_btn_value',
            },
            paramsKeyMap: {
                VALUE: 0,
                COMPARE_VAL: 1
            },
            class: 'robotis_rb100_custom',
            isNotFor: ['Robotis_rb', 'Robotis_rb_H', 'Robotis_rb_car', 'Robotis_rb_P_Assembly'],
            func: function (sprite, script) {
                var scope = script.executor.scope;

                // instruction / address / length / value / default length
                var data_instruction = Entry.Robotis_rb.INSTRUCTION.READ;
                var data_address = 0;
                var data_length = 1;
                var data_value = 0;

                var data_default_address = 0;
                var data_default_length = 0;

                
                data_address = script.getNumberValue('VALUE');

                data_default_address = data_address;
                data_default_length = data_length;

                var compareValue = script.getNumberValue('COMPARE_VAL');
                if (
                    Entry.hw.sendQueue.prevAddress &&
                    Entry.hw.sendQueue.prevAddress == data_default_address
                ) {
                    if (
                        Entry.hw.sendQueue.prevTime &&
                        new Date() - Entry.hw.sendQueue.prevTime < 200
                    ) {
                        
                        //throw new Entry.Utils.AsyncError();
                        return (Entry.hw.sendQueue.prevResult == compareValue);
                    }
                }

                Entry.Robotis_carCont.setRobotisData([
                    [
                        data_instruction,
                        data_address,
                        data_length,
                        data_value,
                        data_default_length,
                    ],
                ]);
                // Entry.hw.socket.send(JSON.stringify(Entry.hw.sendQueue));
                Entry.Robotis_carCont.update();

                var result = Entry.hw.portData[data_default_address];
                if (result == undefined)
                {
                    result = rb100_last_valid_value[data_default_address];
                }
                else
                {
                    rb100_last_valid_value[data_default_address] = result;
                }
                Entry.hw.sendQueue.prevAddress = data_default_address;
                Entry.hw.sendQueue.prevTime = new Date();
                Entry.hw.sendQueue.prevResult = result;
                if(result == undefined) {
                    return false;
                }

                return (result == compareValue);
            },
            syntax: {
                js: [],
                py: ['Robotis.opencm70_cm_btn_value(%1)'],
            },
        },
        robotis_RB_cm_buzzer_index: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.General.note_c + '', '37'],
                        [Lang.General.note_c + '#', '38'],
                        [Lang.General.note_d + '', '39'],
                        [Lang.General.note_d + '#', '40'],
                        [Lang.General.note_e + '', '41'],
                        [Lang.General.note_f + '', '42'],
                        [Lang.General.note_f + '#', '43'],
                        [Lang.General.note_g + '', '44'],
                        [Lang.General.note_g + '#', '45'],
                        [Lang.General.note_a + '', '46'],
                        [Lang.General.note_a + '#', '47'],
                        [Lang.General.note_b + '', '48'],
                    ],
                    value: '47',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        ['1', '-1'],
                        ['2', '0'],
                        ['3', '1'],
                    ],
                    value: '0',
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
                        [Lang.Blocks.robotis_play, '1'],
                        [Lang.Blocks.robotis_rest, '2'],
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
                    '1',
                    null,
                    null,
                ],
                type: 'robotis_RB_cm_buzzer_index',
            },
            paramsKeyMap: {
                CM_BUZZER_INDEX: 0,
                CM_BUZZER_OCTAV: 1,
                CM_BUZZER_DELAY: 2,
                CM_BUZZER_PLAY: 3
            },
            class: 'robotis_rb100_sound',
            isNotFor: ['Robotis_rb', 'Robotis_rb_H', 'Robotis_rb_car', 'Robotis_rb_P_Assembly'],
            func: function (sprite, script) {
                // instruction / address / length / value / default length
                var cmBuzzerIndex = script.getField('CM_BUZZER_INDEX', script);
                var cmBuzzerOffset = script.getField('CM_BUZZER_OCTAV', script);
                var cmBuzzerTime = script.getNumberValue('CM_BUZZER_DELAY', script);
                var cmBuzzerPlay = script.getField('CM_BUZZER_PLAY', script);

                var data_instruction = Entry.Robotis_rb.INSTRUCTION.WRITE;
                var data_address_1 = 0;
                var data_length_1 = 0;
                var data_value_1 = 0;
                var data_address_2 = 0;
                var data_length_2 = 0;
                var data_value_2 = 0;
                var interval = 500;

                data_address_1 =
                    Entry.Robotis_rb.CONTROL_TABLE.CM_BUZZER_TIME[0];
                data_length_1 =
                    Entry.Robotis_rb.CONTROL_TABLE.CM_BUZZER_TIME[1];
                // data_value_1 = cmBuzzerTime * 10;
                // TODO 텍스트 입력으로 바꾸고 최대는 5초 : 0.5 초 하려면 5를 입력  - console.log(parseInt(0.59 * 10)); max 는 5초
                data_value_1 = parseInt(cmBuzzerTime * 10);
                if (data_value_2 < 0) {
                    data_value_1 = 0;
                }
                if (data_value_1 > 50) {
                    data_value_1 = 50;
                }

                data_address_2 =
                    Entry.Robotis_rb.CONTROL_TABLE.CM_BUZZER_INDEX[0];
                data_length_2 =
                    Entry.Robotis_rb.CONTROL_TABLE.CM_BUZZER_INDEX[1];
                data_value_2 = Number(cmBuzzerIndex) + Number(cmBuzzerOffset * 12);

                // console.log("buzzer send");
                var data_sendqueue = [
                    [
                        data_instruction,
                        data_address_1,
                        data_length_1,
                        data_value_1,
                    ],
                    [
                        data_instruction,
                        data_address_2,
                        data_length_2,
                        data_value_2,
                    ],
                ];

                if(cmBuzzerPlay == '2') {
                    data_sendqueue = [];
                }
                return Entry.Robotis_carCont.postCallReturn(
                    script,
                    data_sendqueue,
                    cmBuzzerTime * 1000+ interval
                );
            },
            syntax: {
                js: [],
                py: ['Robotis.opencm70_cm_buzzer_index(%1, %2)'],
            },
        }, 
        

        robotis_RB_kkokdu_screen: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.robotis_car_anim01, '3585'],
                        [Lang.Blocks.robotis_car_anim02, '3586'],
                        [Lang.Blocks.robotis_car_anim03, '3587'],
                        [Lang.Blocks.robotis_car_anim04, '3588'],
                        [Lang.Blocks.robotis_car_anim05, '3589'],

                        [Lang.Blocks.robotis_car_anim06, '3590'],
                        [Lang.Blocks.robotis_car_anim07, '3591'], 
                        [Lang.Blocks.robotis_car_anim08, '3592'],
                        [Lang.Blocks.robotis_car_anim09, '3593'],
                        [Lang.Blocks.robotis_car_anim10, '3594'],

                        [Lang.Blocks.robotis_car_anim11, '3595'],
                        [Lang.Blocks.robotis_car_anim12, '3596'], 
                        [Lang.Blocks.robotis_car_anim13, '3597'],
                        [Lang.Blocks.robotis_car_anim14, '3598'],
                        [Lang.Blocks.robotis_car_anim15, '3599'],

                        [Lang.Blocks.robotis_car_anim16, '3600'],
                        [Lang.Blocks.robotis_car_anim17, '3601'], 
                        [Lang.Blocks.robotis_car_anim18, '3602'],
                        [Lang.Blocks.robotis_car_anim19, '3603'],
                    ],
                    value: '3585',
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
                type: 'robotis_RB_kkokdu_screen',
            },
            paramsKeyMap: {
                BACKGROUND: 0,
            },
            class: 'robotis_rb100_lcd',
            isNotFor: ['Robotis_rb', 'Robotis_rb_H', 'Robotis_rb_car', 'Robotis_rb_P_Assembly'],
            func: function (sprite, script) {
                // instruction / address / length / value / default length
                var screenValue = script.getNumberValue('BACKGROUND', script);
                
                var data_instruction = Entry.Robotis_rb.INSTRUCTION.WRITE;
                var data_address = 163;
                var data_length = 2;
                var data_value = screenValue;

                var data_sendqueue = [
                    [data_instruction, data_address, data_length, data_value],
                    [3, 162, 1, 1]
                ];
              


                return Entry.Robotis_carCont.postCallReturn(
                    script,
                    data_sendqueue,
                    Entry.Robotis_openCM70.delay + 1000
                );
            },
            syntax: { js: [], py: ['Robotis.opencm70_cm_screen(%1)'] },
        },

        robotis_RB_kkokdu_anim_screen: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.robotis_car_anim01, '31234'],
                        [Lang.Blocks.robotis_car_anim02, '31237'],
                        [Lang.Blocks.robotis_car_anim03, '31238'],
                        [Lang.Blocks.robotis_car_anim04, '31239'],
                        [Lang.Blocks.robotis_car_anim05, '31240'],

                        [Lang.Blocks.robotis_car_anim06, '31241'],
                        [Lang.Blocks.robotis_car_anim07, '31242'], 
                        [Lang.Blocks.robotis_car_anim08, '31243'],
                        [Lang.Blocks.robotis_car_anim09, '31244'],
                        [Lang.Blocks.robotis_car_anim10, '31245'],

                        [Lang.Blocks.robotis_car_anim11, '31246'],
                        [Lang.Blocks.robotis_car_anim12, '31247'], 
                        [Lang.Blocks.robotis_car_anim13, '31248'],
                        [Lang.Blocks.robotis_car_anim14, '31249'],
                        [Lang.Blocks.robotis_car_anim15, '31250'],

                        [Lang.Blocks.robotis_car_anim16, '31251'],
                        [Lang.Blocks.robotis_car_anim17, '31252'], 
                        [Lang.Blocks.robotis_car_anim18, '31253'],
                        [Lang.Blocks.robotis_car_anim19, '31254'],
                    ],
                    value: '31234',
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
                type: 'robotis_RB_kkokdu_anim_screen',
            },
            paramsKeyMap: {
                BACKGROUND: 0,
            },
            class: 'robotis_rb100_lcd',
            isNotFor: ['Robotis_rb', 'Robotis_rb_H', 'Robotis_rb_car', 'Robotis_rb_P_Assembly'],
            func: function (sprite, script) {
                // instruction / address / length / value / default length
                var screenValue = script.getNumberValue('BACKGROUND', script);
                
                var data_instruction = Entry.Robotis_rb.INSTRUCTION.WRITE;
                var data_address = 163;
                var data_length = 2;
                var data_value = screenValue;

                var data_sendqueue = [
                    [data_instruction, data_address, data_length, data_value],
                    [3, 162, 1, 1]
                ];
              


                return Entry.Robotis_carCont.postCallReturn(
                    script,
                    data_sendqueue,
                    Entry.Robotis_openCM70.delay //+ 1000
                );
            },
            syntax: { js: [], py: ['Robotis.opencm70_cm_screen(%1)'] },
        },
        robotis_RB_cm_screen: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        // ["센서 로그", '30759'],
                        // ["다이나믹셀 로그", '30760'],
                        [Lang.Blocks.robotis_face01, '2817'],
                        [Lang.Blocks.robotis_face02, '2818'], //Lang.Blocks.robotis_robotis_common_green_color
                        [Lang.Blocks.robotis_face03, '2819'],
                        [Lang.Blocks.robotis_face04, '2820'],
                        [Lang.Blocks.robotis_face05, '2821'],

                        [Lang.Blocks.robotis_face06, '2822'],
                        [Lang.Blocks.robotis_face07, '2823'], //Lang.Blocks.robotis_robotis_common_green_color
                        [Lang.Blocks.robotis_face08, '2824'],
                        [Lang.Blocks.robotis_face09, '2825'],
                        [Lang.Blocks.robotis_face10, '2826'],

                        [Lang.Blocks.robotis_face11, '2827'],
                        [Lang.Blocks.robotis_face12, '2828'], //Lang.Blocks.robotis_robotis_common_green_color
                        [Lang.Blocks.robotis_face13, '2829'],
                        
                        [Lang.Blocks.robotis_face14, '2830'],
                        [Lang.Blocks.robotis_face15, '2831'],
                        [Lang.Blocks.robotis_face16, '2832'],
                        [Lang.Blocks.robotis_face17, '2833'],
                        [Lang.Blocks.robotis_face18, '2834'],

                        [Lang.Blocks.robotis_face19, '2835'],
                        [Lang.Blocks.robotis_face20, '2836'],
                        [Lang.Blocks.robotis_face21, '2837'],
                        [Lang.Blocks.robotis_face22, '2838'],
                        [Lang.Blocks.robotis_face23, '2839'],
                    ],
                    value: '2817',
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
                type: 'robotis_RB_cm_screen',
            },
            paramsKeyMap: {
                BACKGROUND: 0,
            },
            class: 'robotis_rb100_lcd',
            isNotFor: ['Robotis_rb', 'Robotis_rb_H', 'Robotis_rb_car', 'Robotis_rb_P_Assembly'],
            func: function (sprite, script) {
                // instruction / address / length / value / default length
                var screenValue = script.getField('BACKGROUND', script);
                
                var data_instruction = Entry.Robotis_rb.INSTRUCTION.WRITE;
                var data_address = 163;
                var data_length = 2;
                var data_value = screenValue;

                var data_sendqueue = [
                    [data_instruction, data_address, data_length, data_value],
                    [3, 162, 1, 1]
                ];
              


                return Entry.Robotis_carCont.postCallReturn(
                    script,
                    data_sendqueue,
                    Entry.Robotis_openCM70.delay + 1000
                );
            },
            syntax: { js: [], py: ['Robotis.opencm70_cm_screen(%1)'] },
        },
        robotis_RB_cm_anim_screen: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        // ["센서 로그", '30759'],
                        // ["다이나믹셀 로그", '30760'],
                        [Lang.Blocks.robotis_face01, '30748'],
                        [Lang.Blocks.robotis_face02, '30749'], //Lang.Blocks.robotis_robotis_common_green_color
                        [Lang.Blocks.robotis_face03, '30750'],
                        [Lang.Blocks.robotis_face04, '30756'],
                        [Lang.Blocks.robotis_face05, '30754'],

                        [Lang.Blocks.robotis_face06, '30741'],
                        [Lang.Blocks.robotis_face07, '30747'], //Lang.Blocks.robotis_robotis_common_green_color
                        [Lang.Blocks.robotis_face08, '30738'],
                        [Lang.Blocks.robotis_face09, '30740'],
                        [Lang.Blocks.robotis_face10, '30739'],

                        [Lang.Blocks.robotis_face11, '30733'],
                        [Lang.Blocks.robotis_face12, '30734'], //Lang.Blocks.robotis_robotis_common_green_color
                        [Lang.Blocks.robotis_face13, '30732'],
                        
                        [Lang.Blocks.robotis_face14, '30757'],
                        [Lang.Blocks.robotis_face15, '30736'],
                        [Lang.Blocks.robotis_face16, '30731'],
                        [Lang.Blocks.robotis_face17, '30742'],
                        [Lang.Blocks.robotis_face18, '30743'],

                        [Lang.Blocks.robotis_face19, '30744'],
                        [Lang.Blocks.robotis_face20, '30751'],
                        [Lang.Blocks.robotis_face21, '30752'],
                        [Lang.Blocks.robotis_face22, '30755'],
                        [Lang.Blocks.robotis_face23, '30758'],
                    ],
                    value: '30748',
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
                type: 'robotis_RB_cm_anim_screen',
            },
            paramsKeyMap: {
                BACKGROUND: 0,
            },
            class: 'robotis_rb100_lcd',
            isNotFor: ['Robotis_rb', 'Robotis_rb_H', 'Robotis_rb_car', 'Robotis_rb_P_Assembly'],
            func: function (sprite, script) {
                // instruction / address / length / value / default length
                var screenValue = script.getField('BACKGROUND', script);
                
                var data_instruction = Entry.Robotis_rb.INSTRUCTION.WRITE;
                var data_address = 163;
                var data_length = 2;
                var data_value = screenValue;

                var data_sendqueue = [
                    [data_instruction, data_address, data_length, data_value],
                    [3, 162, 1, 1]
                ];
              


                return Entry.Robotis_carCont.postCallReturn(
                    script,
                    data_sendqueue,
                    Entry.Robotis_openCM70.delay + 1000
                );
            },
            syntax: { js: [], py: ['Robotis.opencm70_cm_screen(%1)'] },
        },

        robotis_RB_car_screen: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.robotis_car_anim01, '3329'],
                        [Lang.Blocks.robotis_car_anim02, '3330'],
                        [Lang.Blocks.robotis_car_anim03, '3331'],
                        [Lang.Blocks.robotis_car_anim04, '3332'],
                        [Lang.Blocks.robotis_car_anim05, '3333'],

                        [Lang.Blocks.robotis_car_anim06, '3334'],
                        [Lang.Blocks.robotis_car_anim07, '3335'], 
                        [Lang.Blocks.robotis_car_anim08, '3336'],
                        [Lang.Blocks.robotis_car_anim09, '3337'],
                        [Lang.Blocks.robotis_car_anim10, '3338'],

                        [Lang.Blocks.robotis_car_anim11, '3339'],
                        [Lang.Blocks.robotis_car_anim12, '3340'], 
                        [Lang.Blocks.robotis_car_anim13, '3341'],
                        [Lang.Blocks.robotis_car_anim14, '3342'],
                        [Lang.Blocks.robotis_car_anim15, '3343'],

                        [Lang.Blocks.robotis_car_anim16, '3344'],
                        [Lang.Blocks.robotis_car_anim17, '3345'], 
                        [Lang.Blocks.robotis_car_anim18, '3346'],
                        [Lang.Blocks.robotis_car_anim19, '3347'],
                    ],
                    value: '3329',
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
                type: 'robotis_RB_car_screen',
            },
            paramsKeyMap: {
                BACKGROUND: 0,
            },
            class: 'robotis_rb100_lcd',
            isNotFor: ['Robotis_rb', 'Robotis_rb_H', 'Robotis_rb_car', 'Robotis_rb_P_Assembly'],
            func: function (sprite, script) {
                // instruction / address / length / value / default length
                var screenValue = script.getNumberValue('BACKGROUND', script);
                
                var data_instruction = Entry.Robotis_rb.INSTRUCTION.WRITE;
                var data_address = 163;
                var data_length = 2;
                var data_value = screenValue;

                var data_sendqueue = [
                    [data_instruction, data_address, data_length, data_value],
                    [3, 162, 1, 1]
                ];
              


                return Entry.Robotis_carCont.postCallReturn(
                    script,
                    data_sendqueue,
                    Entry.Robotis_openCM70.delay + 1000
                );
            },
            syntax: { js: [], py: ['Robotis.opencm70_cm_screen(%1)'] },
        },

        robotis_RB_car_anim_screen: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.robotis_car_anim01, '30978'],
                        [Lang.Blocks.robotis_car_anim02, '30981'],
                        [Lang.Blocks.robotis_car_anim03, '30982'],
                        [Lang.Blocks.robotis_car_anim04, '30983'],
                        [Lang.Blocks.robotis_car_anim05, '30984'],

                        [Lang.Blocks.robotis_car_anim06, '30985'],
                        [Lang.Blocks.robotis_car_anim07, '30986'], 
                        [Lang.Blocks.robotis_car_anim08, '30987'],
                        [Lang.Blocks.robotis_car_anim09, '30988'],
                        [Lang.Blocks.robotis_car_anim10, '30989'],

                        [Lang.Blocks.robotis_car_anim11, '30990'],
                        [Lang.Blocks.robotis_car_anim12, '30991'], 
                        [Lang.Blocks.robotis_car_anim13, '30992'],
                        [Lang.Blocks.robotis_car_anim14, '30993'],
                        [Lang.Blocks.robotis_car_anim15, '30994'],

                        [Lang.Blocks.robotis_car_anim16, '30995'],
                        [Lang.Blocks.robotis_car_anim17, '30996'], 
                        [Lang.Blocks.robotis_car_anim18, '30997'],
                        [Lang.Blocks.robotis_car_anim19, '30998'],
                    ],
                    value: '30978',
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
                type: 'robotis_RB_car_anim_screen',
            },
            paramsKeyMap: {
                BACKGROUND: 0,
            },
            class: 'robotis_rb100_lcd',
            isNotFor: ['Robotis_rb', 'Robotis_rb_H', 'Robotis_rb_car', 'Robotis_rb_P_Assembly'],
            func: function (sprite, script) {
                // instruction / address / length / value / default length
                var screenValue = script.getNumberValue('BACKGROUND', script);
                
                var data_instruction = Entry.Robotis_rb.INSTRUCTION.WRITE;
                var data_address = 163;
                var data_length = 2;
                var data_value = screenValue;

                var data_sendqueue = [
                    [data_instruction, data_address, data_length, data_value],
                    [3, 162, 1, 1]
                ];
              


                return Entry.Robotis_carCont.postCallReturn(
                    script,
                    data_sendqueue,
                    Entry.Robotis_openCM70.delay //+ 1000
                );
            },
            syntax: { js: [], py: ['Robotis.opencm70_cm_screen(%1)'] },
        },

        robotis_RB_cm_led: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.robotis_flashing1, '11'],
                        [Lang.Blocks.robotis_flashing2, '12'], //Lang.Blocks.robotis_robotis_common_green_color
                        [Lang.Blocks.robotis_flashing3, '13'],

                        [Lang.Blocks.robotis_flashing4, '21'],
                        [Lang.Blocks.robotis_flashing5, '22'], //Lang.Blocks.robotis_robotis_common_green_color
                        [Lang.Blocks.robotis_flashing6, '23'],

                        [Lang.Blocks.robotis_flashing7, '31'],
                        [Lang.Blocks.robotis_flashing8, '32'], //Lang.Blocks.robotis_robotis_common_green_color
                        [Lang.Blocks.robotis_flashing9, '33'],

                    ],
                    value: '11',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.robotis_common_on, '1'],
                        [Lang.Blocks.robotis_common_off, '0'],
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
                params: [null, null, null],
                type: 'robotis_RB_cm_led',
            },
            paramsKeyMap: {
                RB_LED: 0,
                VALUE: 1,
            },
            class: 'robotis_rb100_led',
            isNotFor: ['Robotis_rb', 'Robotis_rb_H', 'Robotis_rb_car', 'Robotis_rb_P_Assembly'],
            func: function (sprite, script) {
                // instruction / address / length / value / default length
                var cmLed = script.getField('RB_LED', script);
                var value = script.getField('VALUE', script);

                var data_instruction = Entry.Robotis_rb.INSTRUCTION.WRITE;
                var data_address = 40;
                var data_length = 1;
                var data_value = 0;

                
                data_value = value * cmLed;
              
                var data_sendqueue = [
                    [data_instruction, data_address, data_length, data_value],
                ];
                
                return Entry.Robotis_carCont.postCallReturn(
                    script,
                    data_sendqueue,
                    Entry.Robotis_openCM70.delay
                );
            },
            syntax: { js: [], py: ['Robotis.opencm70_cm_led(%1, %2)'] },
        },
        robotis_dxl_test: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                
            ],
            events: {},
            def: {
                params: [],
                type: 'robotis_dxl_test',
            },
            paramsKeyMap: {
                
            },
            class: 'robotis_rb100_dxl',
            isNotFor: ['Robotis_rb', 'Robotis_rb_H', 'Robotis_rb_P_Assembly'],
            func: function (sprite, script) {
                // instruction / address / length / value / default length
                //19번지에 1바이트로 1 설정 

                var data_instruction = Entry.Robotis_rb.INSTRUCTION.WRITE;
                var data_address = 19;
                var data_length = 1;
                var data_value = 1;

                var data_sendqueue = [
                    [data_instruction, data_address, data_length, data_value],
                    // [Entry.Robotis_rb.INSTRUCTION.REGWRITE, 64, 1, 1, [1]],
                    // [Entry.Robotis_rb.INSTRUCTION.REGWRITE, 64, 1, 1, [2]],
                    // [Entry.Robotis_rb.INSTRUCTION.REGWRITE, 64, 1, 1, [3]],
                    // [Entry.Robotis_rb.INSTRUCTION.REGWRITE, 64, 1, 1, [4]],
                    // [Entry.Robotis_rb.INSTRUCTION.REGWRITE, 64, 1, 1, [5]],
                    // [Entry.Robotis_rb.INSTRUCTION.REGWRITE, 64, 1, 1, [6]],
                    // [Entry.Robotis_rb.INSTRUCTION.REGWRITE, 64, 1, 1, [7]],
                    // [Entry.Robotis_rb.INSTRUCTION.REGWRITE, 64, 1, 1, [8]],
                    [Entry.Robotis_rb.INSTRUCTION.REGWRITE, 64, 1, 1, [33]],
                    [Entry.Robotis_rb.INSTRUCTION.REGWRITE, 64, 1, 1, [34]],
                    [Entry.Robotis_rb.INSTRUCTION.ACTION, 0, 0, 0],
               

                    [Entry.Robotis_rb.INSTRUCTION.REGWRITE, 116, 4, 2048, [1]],
                    [Entry.Robotis_rb.INSTRUCTION.REGWRITE, 116, 4, 2048, [2]],
                    [Entry.Robotis_rb.INSTRUCTION.REGWRITE, 116, 4, 2048, [3]],
                    [Entry.Robotis_rb.INSTRUCTION.REGWRITE, 116, 4, 2048, [4]],
                    [Entry.Robotis_rb.INSTRUCTION.REGWRITE, 116, 4, 2048, [5]],
                    [Entry.Robotis_rb.INSTRUCTION.REGWRITE, 116, 4, 2048, [6]],
                    [Entry.Robotis_rb.INSTRUCTION.REGWRITE, 116, 4, 2048, [7]],
                    [Entry.Robotis_rb.INSTRUCTION.REGWRITE, 116, 4, 2048, [8]],
                    [Entry.Robotis_rb.INSTRUCTION.ACTION, 0, 0, 0],

                    [Entry.Robotis_rb.INSTRUCTION.REGWRITE, 116, 4, 2548, [1]],
                    [Entry.Robotis_rb.INSTRUCTION.REGWRITE, 116, 4, 1548, [2]],
                    [Entry.Robotis_rb.INSTRUCTION.REGWRITE, 116, 4, 2048, [3]],
                    [Entry.Robotis_rb.INSTRUCTION.REGWRITE, 116, 4, 2048, [4]],
                    [Entry.Robotis_rb.INSTRUCTION.REGWRITE, 116, 4, 2048, [5]],
                    [Entry.Robotis_rb.INSTRUCTION.REGWRITE, 116, 4, 2048, [6]],
                    [Entry.Robotis_rb.INSTRUCTION.REGWRITE, 116, 4, 2248, [7]],
                    [Entry.Robotis_rb.INSTRUCTION.REGWRITE, 116, 4, 1848, [8]],
                    [Entry.Robotis_rb.INSTRUCTION.ACTION, 0, 0, 0],
                    
                    /*[Entry.Robotis_rb.INSTRUCTION.SYNCWRITE, 64, 1, 60, [1,2], [1,1]],
                    [Entry.Robotis_rb.INSTRUCTION.SYNCWRITE, 64, 1, 60, [3,4], [1,1]],
                    [Entry.Robotis_rb.INSTRUCTION.SYNCWRITE, 64, 1, 60, [5,6], [1,1]],
                    [Entry.Robotis_rb.INSTRUCTION.SYNCWRITE, 64, 1, 60, [7,8], [1,1]],
                    [Entry.Robotis_rb.INSTRUCTION.SYNCWRITE, 116, 4, 60, [1], [2048]],
                    [Entry.Robotis_rb.INSTRUCTION.SYNCWRITE, 116, 4, 60, [2], [2048]],
                    [Entry.Robotis_rb.INSTRUCTION.SYNCWRITE, 116, 4, 60, [3], [2048]],
                    [Entry.Robotis_rb.INSTRUCTION.SYNCWRITE, 116, 4, 60, [4], [2048]],
                    [Entry.Robotis_rb.INSTRUCTION.SYNCWRITE, 116, 4, 60, [5], [2048]],
                    [Entry.Robotis_rb.INSTRUCTION.SYNCWRITE, 116, 4, 60, [6], [2048]],
                    [Entry.Robotis_rb.INSTRUCTION.SYNCWRITE, 116, 4, 60, [7], [2048]],
                    [Entry.Robotis_rb.INSTRUCTION.SYNCWRITE, 116, 4, 60, [8], [2048]],
                    [Entry.Robotis_rb.INSTRUCTION.SYNCWRITE, 116, 4, 60, [1], [1948]],
                    [Entry.Robotis_rb.INSTRUCTION.SYNCWRITE, 116, 4, 60, [2], [1948]],
                    [Entry.Robotis_rb.INSTRUCTION.SYNCWRITE, 116, 4, 60, [3], [1948]],
                    [Entry.Robotis_rb.INSTRUCTION.SYNCWRITE, 116, 4, 60, [4], [1948]],
                    [Entry.Robotis_rb.INSTRUCTION.SYNCWRITE, 116, 4, 60, [5], [1948]],
                    [Entry.Robotis_rb.INSTRUCTION.SYNCWRITE, 116, 4, 60, [6], [1948]],
                    [Entry.Robotis_rb.INSTRUCTION.SYNCWRITE, 116, 4, 60, [7], [1948]],
                    [Entry.Robotis_rb.INSTRUCTION.SYNCWRITE, 116, 4, 60, [8], [1948]],*/

                ];
               
                return Entry.Robotis_carCont.postCallReturn(
                    script,
                    data_sendqueue,
                    100
                    //Entry.Robotis_openCM70.delay
                );
            },
            syntax: { js: [], py: ['Robotis.opencm70_cm_led(%1, %2)'] },
        },
        robotis_openCM70_RGee_go: {
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
                type: 'robotis_openCM70_RGee_go',
            },
            paramsKeyMap: {
                SPEED: 0,
                DIRECTION: 1,
            },
            class: 'robotis_rb100_move',
            isNotFor: ['Robotis_rb'],
            func: function (sprite, script) {
                // instruction / address / length / value / default length
                var speed = script.getNumberValue('SPEED', script);
                var direction = script.getField('DIRECTION', script);
                
                var data_instruction = Entry.Robotis_rb.INSTRUCTION.WRITE;
                var data_address = 710;
                var data_length = 2;
                var data_value = 0;
                
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
                py: ['Robotis.opencm70_RGee_go(%1, %2)'],
            },
        },
        robotis_openCM70_RGee_stop: {
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
                type: 'robotis_openCM70_RGee_stop',
            },
            paramsKeyMap: {
                SPEED: 0,
                DIRECTION: 1,
            },
            class: 'robotis_rb100_move',
            isNotFor: ['Robotis_rb'],
            func: function (sprite, script) {
                // instruction / address / length / value / default length
                var speed = script.getNumberValue('SPEED', script);
                var direction = script.getField('DIRECTION', script);
                
                var data_instruction = Entry.Robotis_rb.INSTRUCTION.WRITE;
                var data_address = 710;
                var data_length = 2;
                var data_value = 0;
            

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
                py: ['Robotis.opencm70_RGee_stop()'],
            },
        },
        robotis_openCM70_RGee_motion: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.robotis_moveRG1, '50007'],
                        [Lang.Blocks.robotis_moveRG2, '50008'], //Lang.Blocks.robotis_robotis_common_green_color
                        [Lang.Blocks.robotis_moveRG3, '50071'],
                        [Lang.Blocks.robotis_moveRG4, '50072'],
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
                params: [null],
                type: 'robotis_openCM70_RGee_motion',
            },
            paramsKeyMap: {
                MotionNumber: 0,
            },
            class: 'robotis_rb100_move',
            isNotFor: ['Robotis_rb'],
            func: function (sprite, script) {
                // instruction / address / length / value / default length
                var data_instruction = Entry.Robotis_rb.INSTRUCTION.WRITE;
                var data_address = 0;
                var data_length = 0;
                var data_value = 0;

                data_address =
                    Entry.Robotis_rb.CONTROL_TABLE.CM_MOTION[0];
                data_length = Entry.Robotis_rb.CONTROL_TABLE.CM_MOTION[1];
                data_value = script.getField('MotionNumber', script);


                var data_sendqueue = [
                    [data_instruction, data_address, data_length, data_value],
                    //[data_instruction, data_address, data_length, 0],
                ];
                
                //console.log(script);
                return Entry.Robotis_carCont.postCallReturn(
                    script,
                    data_sendqueue,
                    
                    data_value > 50070 ? 2000 : 1000 
                    //Entry.Robotis_openCM70.delay
                );
            },
            syntax: { js: [], py: ['Robotis.opencm70_RGee_motion(%1)'] },
        }, 
        robotis_RB_follow_line: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['1단계', '1'],
                        ['2단계', '2'],
                        ['3단계', '3'],

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
                ],
                type: 'robotis_RB_follow_line',
            },
            paramsKeyMap: {
                SPEED: 0,
            },
            class: 'robotis_rb100_move',
            isNotFor: ['Robotis_rb', 'Robotis_rb_car', 'Robotis_rb_P_Assembly'],
            func: function (sprite, script) {
                // instruction / address / length / value / default length
                var speed_level = script.getNumberValue('SPEED', script);
                
                var data_instruction = Entry.Robotis_rb.INSTRUCTION.WRITE;
                var data_address = 5200;
                var data_length = 1;

                var data_sendqueue = [
                    [
                        data_instruction,
                        data_address,
                        data_length,
                        speed_level,
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
                py: ['Robotis.rb100_follow_line(%1)'],
            },
        },
        robotis_RB_follow_line_stop: {
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
                type: 'robotis_RB_follow_line_stop',
            },
            paramsKeyMap: {
            },
            class: 'robotis_rb100_move',
            isNotFor: ['Robotis_rb', 'Robotis_rb_car', 'Robotis_rb_P_Assembly'],
            func: function (sprite, script) {
                // instruction / address / length / value / default length
                
                var data_instruction = Entry.Robotis_rb.INSTRUCTION.WRITE;
                var data_address = 5200;
                var data_length = 1;
                var data_value = 0;
            

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
                py: ['Robotis.rb100_follow_line_stop()'],
            },
        },
        robotis_RB_cm_custom: {
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
                        ['BYTE', 'BYTE'],
                        ['WORD', 'WORD'],
                        ['DWORD', 'DWORD'],
                    ],
                    value: 'BYTE',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
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
                    null,
                    {
                        type: 'number',
                        params: ['0'],
                    },
                    null,
                ],
                type: 'robotis_RB_cm_custom',
            },
            paramsKeyMap: {
                ADDRESS: 0,
                LENGTH: 1,
                VALUE: 2,
            },
            class: 'robotis_rb100_custom',
            isNotFor: ['Robotis_rb'],
            func: function (sprite, script) {
                // instruction / address / length / value / default length
                var data_instruction = Entry.Robotis_rb.INSTRUCTION.WRITE;
                var data_address = 0;
                var data_length = 0;
                var data_value = 0;

                data_address = script.getNumberValue('ADDRESS');
                data_value = script.getNumberValue('VALUE');
               
                switch(script.getField('LENGTH')){
                    case 'BYTE':
                        data_length = 1;
                        break;
                    case 'WORD':
                        data_length = 2;
                        break;
                    case 'DWORD':
                        data_length = 4;
                        break;
                    default:
                        break;
                }

                var data_sendqueue = [
                    [data_instruction, data_address, data_length, data_value],
                ];
                return Entry.Robotis_carCont.postCallReturn(
                    script,
                    data_sendqueue,
                    Entry.Robotis_openCM70.delay
                );
            },
            syntax: { js: [], py: ['Robotis.opencm70_cm_custom(%1, %2)'] },
        },
        robotis_RB_cm_custom2: {
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
                        ['BYTE', 'BYTE'],
                        ['WORD', 'WORD'],
                        ['DWORD', 'DWORD'],
                    ],
                    value: 'BYTE',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
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
                    null,
                    {
                        type: 'number',
                        params: ['0'],
                    },
                    null,
                ],
                type: 'robotis_RB_cm_custom2',
            },
            paramsKeyMap: {
                ADDRESS: 0,
                LENGTH: 1,
                VALUE: 2,
            },
            class: 'robotis_rb100_custom',
            isNotFor: ['Robotis_rb_H', 'Robotis_rb_P_Assembly'],
            func: function (sprite, script) {
                // instruction / address / length / value / default length
                var data_instruction = Entry.Robotis_rb.INSTRUCTION.WRITE;
                var data_address = 0;
                var data_length = 0;
                var data_value = 0;

                data_address = script.getNumberValue('ADDRESS');
                data_value = script.getNumberValue('VALUE');
               
                switch(script.getField('LENGTH')){
                    case 'BYTE':
                        data_length = 1;
                        break;
                    case 'WORD':
                        data_length = 2;
                        break;
                    case 'DWORD':
                        data_length = 4;
                        break;
                    default:
                        break;
                }

                var data_sendqueue = [
                    [data_instruction, data_address, data_length, data_value],
                ];
                return Entry.Robotis_carCont.postCallReturn(
                    script,
                    data_sendqueue,
                    Entry.Robotis_openCM70.delay
                );
            },
            syntax: { js: [], py: ['Robotis.opencm70_cm_custom(%1, %2)'] },
        },
        //endregion robotis 로보티즈
    };
};


module.exports = [Entry.Robotis_rb];