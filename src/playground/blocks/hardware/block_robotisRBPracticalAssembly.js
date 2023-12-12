'use strict';

Entry.Robotis_rb_P_Assembly = {
    INSTRUCTION: {
        NONE: 0,
        WRITE: 3,
        READ: 2,
        SYNCWRITE: 4,
        REGWRITE: 5,
        ACTION: 6,
        BYPASS_READ: 0xA2,
        BYPASS_WRITE: 0xA3
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
        values: [0, 0, 0, 0, 0, 0, 0, 0]
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
            [Entry.Robotis_rb.INSTRUCTION.BYPASS_WRITE, 64, 1, 0xFE, 0], // torque off
            // [Entry.Robotis_rb.INSTRUCTION.WRITE, 163, 2, 30759],
            // [Entry.Robotis_rb.INSTRUCTION.WRITE, 162, 1, 1],
        ]);

        Entry.Robotis_carCont.update();
    },
    id: ['7.A', '7.B'],
    name: 'Robotis_rb_P_Assembly',
    url: 'http://www.robotis.com/index/product.php?cate_code=111310',
    imageName: 'robotis_RB100_Practical_Assembly.png',
    title: {
        "ko": "로보티즈 실과 2025",
        "en": "ROBOTIS Practical Course 2025"
    },
    delay: 30,
    readDelay: 30,
};

Entry.Robotis_rb_P_Assembly.blockMenuBlocks = [
    //robotis_openCM70
    // 'robotis_openCM70_sensor_value',

    //입력
    'robotis_RB_cm_ir_value',
    'robotis_RB_cm_ir_compare',
    'robotis_RB_detectFrontObj',
    'robotis_RB_cm_btn_value',
    'robotis_RB_cm_joystick_value',
    'robotis_RB_mic',
    'robotis_RB_detectSound_compare',
    'robotis_RB_imu',
    'robotis_RB_roll_pitch',
    'robotis_RB_environment_value',
    'robotis_RB_environment_compare',
    'robotis_RB_distance_value',
    'robotis_RB_distance_compare',
    'robotis_dxl_value',

    //'robotis_RB_detectPose',

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

    'robotis_dxl_control',
    'robotis_dxl_each_control',
    'robotis_dxl_set_mode',
    'robotis_dxl_set_position',
    'robotis_dxl_set_rotate',
    'robotis_dxl_set_multiturn_round',
    
    'robotis_huskylens_block_value_closest_to_center',
    'robotis_huskylens_arrow_value_closest_to_center',
    'robotis_huskylens_number_of_learned_id',
    'robotis_huskylens_block_value_of_id',
    'robotis_huskylens_arrow_value_of_id',

    'robotis_huskylens_connection_status',
    'robotis_huskylens_if_detected',
    'robotis_huskylens_if_learned_id',
    'robotis_huskylens_if_detected_id_type',

    'robotis_huskylens_set_mode',
    'robotis_huskylens_save_result',
    'robotis_huskylens_print_custom_text',
    'robotis_huskylens_clear_custom_text',

    // 'robotis_RB_cm_custom_value2',
    // 'robotis_RB_cm_custom2',
];

function sleepBlocking(milliseconds) {
    const start = new Date().getTime();
    while (true) {
        if (new Date().getTime() - start > milliseconds) {
            break;
        }
    }
}

Entry.Robotis_rb_P_Assembly.setLanguage = function () {
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
                robotis_dxl_value: "%1 번 모터 %2값",
                //robotis_RB_detectPose: "로봇이 %1 넘어지면",

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

                robotis_dxl_control: "1번 모터 %1° 2번 모터 %2° 3번 모터 %3° 4번 모터 %4° 5번 모터 %5° 6번 모터 %6° 7번 모터 %7° 8번 모터 %8° %9초 동안 움직이기 %10",
                robotis_dxl_each_control: "%1 모터 %2° %3 초 동안 움직이기 %4",
                robotis_dxl_set_mode: "%1 번 모터 %2 모드로 설정 %3",
                robotis_dxl_set_position: "%1 번 모터 %2 속도로 %3 도 위치로 회전 %4",
                robotis_dxl_set_rotate: "%1 번 모터 %2 속도로 %3 으로 %4 %5",
                robotis_dxl_set_multiturn_round: "%1 번 모터 %2 속도로 %3 바퀴 %4 회전 %5",
                
                robotis_huskylens_block_value_closest_to_center: "화면 중앙과 가장 가까운 사각형의 %1",
                robotis_huskylens_arrow_value_closest_to_center: "화면 중앙과 가장 가까운 화살표의 %1",
                robotis_huskylens_number_of_learned_id: "학습한 ID의 갯수",
                robotis_huskylens_block_value_of_id: "감지된 ID가 %1인 사각형의 %2",
                robotis_huskylens_arrow_value_of_id: "감지된 ID가 %1인 화살표의 %2",

                robotis_huskylens_connection_status: "📷가 %1이면",
                robotis_huskylens_if_detected: "📷 %1 이/가 표시되면",
                robotis_huskylens_if_learned_id: "📷 ID가 %1인 데이터를 학습하였으면",
                robotis_huskylens_if_detected_id_type: "📷 ID가 %1인 %2데이터를 인식하였으면",

                robotis_huskylens_set_mode: "📷의 모드를 %1로 설정 %2",
                robotis_huskylens_save_result: "📷 데이터 요청 (반복호출필요) %1",
                robotis_huskylens_print_custom_text: "📷 화면 위치 (%1,%2)에 %3출력%4",
                robotis_huskylens_clear_custom_text: "📷 화면 텍스트 지우기 %1",
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
                robotis_dxl_mode_joint: "관절",
                robotis_dxl_mode_wheel: "바퀴",
                robotis_dxl_mode_multi_turn: "멀티턴",
                robotis_dxl_move_rotate: "회전",
                robotis_dxl_move_stop: "정지",
                robotis_dxl_rotate_cw: "시계방향",
                robotis_dxl_rotate_ccw: "반시계방향",
                robotis_dxl_value_angle: "각도",
                robotis_dxl_value_velocity: "속도",
                robotis_dxl_value_moving: "움직임",
                robotis_connected: "연결",
                robotis_disconnected: "없음",
                robotis_huskylens_mode_face_recognition: "얼굴인식",
                robotis_huskylens_mode_object_tracking: "물체추적",
                robotis_huskylens_mode_object_recognition: "물체인식",
                robotis_huskylens_mode_line_tracking: "라인인식",
                robotis_huskylens_mode_color_recognition: "색상인식",
                robotis_huskylens_mode_tag_recognition: "태그인식",
                robotis_huskylens_mode_object_classification: "물체분류",
                robotis_huskylens_block: "사각형",
                robotis_huskylens_arrow: "화살표",
                robotis_huskylens_center_block_center_x: "중심 X좌표",
                robotis_huskylens_center_block_center_y: "중심 Y좌표",
                robotis_huskylens_center_block_width: "너비",
                robotis_huskylens_center_block_height: "높이",
                robotis_huskylens_center_leared_id: "학습ID",
                robotis_huskylens_center_arrow_origin_x: "시작점 X좌표",
                robotis_huskylens_center_arrow_origin_y: "시작점 Y좌표",
                robotis_huskylens_center_arrow_target_x: "끝점 X좌표",
                robotis_huskylens_center_arrow_target_y: "끝점 Y좌표",
            },
        },
        en: {
            template: {
                robotis_RB_cm_ir_value: "IR sensor value of %1 Value of IR Sensor",
                robotis_RB_cm_ir_compare: "If IR sensor value of %1 is %2 %3",
                robotis_RB_detectFrontObj: "If there is an object in front",
                robotis_RB_cm_btn_value: "If %1 button is %2",
                robotis_RB_cm_joystick_value: "If the joystick location is %1",
                robotis_RB_mic: "MIC volume(dB)",
                robotis_RB_detectSound_compare: "If sound is detected from %1",
                robotis_RB_imu: "%1 axis' %2 value",
                robotis_RB_roll_pitch: "%1 Controller position ",
                robotis_RB_environment_value: "%1 %2 value",
                robotis_RB_environment_compare: "If %1 %2 value is %3 %4",
                robotis_RB_distance_value: "%1 %2 value",
                robotis_RB_distance_compare: "If %1 %2 value is %3 %4",
                robotis_dxl_value: "ID %1 motor %2 value",
                //robotis_RB_detectPose:"If robot falls %1",

                robotis_RB_cm_buzzer_index: "%1 at %2 octaves for %3 second(s) -> %4 %5",
                robotis_RB_cm_screen: "Choose %1 as a screen background %2",
                robotis_RB_cm_anim_screen: "Choose %1 as a screen animation %2",
                robotis_RB_rsp_screen: "Print %1 on the screen %2",

                robotis_RB_LCDBright: "Adjust screen brightness to %1 %2",
                robotis_RB_LCDColor: "Set screen color to %1 %2",

                robotis_RB_LEDBright: "Set the brightness of the %1 LED to %2 %3",
                robotis_RB_cm_led: "%1 LED %2 %3",

                robotis_RB_Hello: "Say %1 %2",
                robotis_RB_effectSound: "Play the sound of %1 %2",
                robotis_RB_record: "Record in room %1 %2",
                robotis_RB_playRecord: "Play recorded sound in room %1 %2",

                robotis_dxl_control: "Move 1st motor %1°, 2nd motor %2°, 3rd motor %3°, 4th motor %4°, 5th motor %5°, 6th motor %6°, 7th motor %7°, 8th motor %8° for  second %9 %10",
                robotis_dxl_each_control: "Move %1th motor %2° for %3 second",
                robotis_dxl_set_mode: "Set ID %1 motor as %2 mode %3",
                robotis_dxl_set_position: "Rotate ID %1 motor to angle %3 at speed %2 %4",
                robotis_dxl_set_rotate: "%4 ID %1 motor %3 at speed %2 %4",
                robotis_dxl_set_multiturn_round: "Rotate ID %1 motor %3 round %4 at speed %2 %5",

                robotis_huskylens_block_value_closest_to_center: "%1 of the rectangle closest to the center",
                robotis_huskylens_arrow_value_closest_to_center: "%1 of the arrow closest to the center",
                robotis_huskylens_number_of_learned_id: "The number of learned ID",
                robotis_huskylens_block_value_of_id: "%2 of the rectangle of ID %1",
                robotis_huskylens_arrow_value_of_id: "%2 of the arrow of ID %1",

                robotis_huskylens_connection_status: "📷 If %1",
                robotis_huskylens_if_detected: "📷 If %1 is shown",
                robotis_huskylens_if_learned_id: "📷 If object of ID %1 is learned",
                robotis_huskylens_if_detected_id_type: "📷 If detected %2 of ID %1",

                robotis_huskylens_set_mode: "📷 Set mode to %1 %2",
                robotis_huskylens_save_result: "📷 Do recognition (use repeatedly) %1 ",
                robotis_huskylens_print_custom_text: "📷 Print %3 at location (%1,%2)%4",
                robotis_huskylens_clear_custom_text: "📷 Clear text %1",


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
                robotis_dxl_mode_joint: "Joint",
                robotis_dxl_mode_wheel: "Wheel",
                robotis_dxl_mode_multi_turn: "Multi-turn",
                robotis_dxl_move_rotate: "Rotate",
                robotis_dxl_move_stop: "Stop",
                robotis_dxl_rotate_cw: "clockwise",
                robotis_dxl_rotate_ccw: "counter clockwise",
                robotis_dxl_value_angle: "angle",
                robotis_dxl_value_velocity: "velocity",
                robotis_dxl_value_moving: "moving",
                robotis_connected: "connected",
                robotis_disconnected: "NOT connected",
                robotis_huskylens_mode_face_recognition: "Face recognition",
                robotis_huskylens_mode_object_tracking: "Object tracking",
                robotis_huskylens_mode_object_recognition: "Object recognition",
                robotis_huskylens_mode_line_recognition: "Line tracking",
                robotis_huskylens_mode_color_recognition: "Color recognition",
                robotis_huskylens_mode_tag_recognition: "Tag recognition",
                robotis_huskylens_mode_object_classification: "Object classification",
                robotis_huskylens_block: "Rectangle",
                robotis_huskylens_arrow: "Arrow",
                robotis_huskylens_center_block_center_x: "Center X",
                robotis_huskylens_center_block_center_y: "Center Y",
                robotis_huskylens_center_block_width: "Width",
                robotis_huskylens_center_block_height: "Height",
                robotis_huskylens_center_leared_id: "Learned ID",
                robotis_huskylens_center_arrow_origin_x: "Origin X",
                robotis_huskylens_center_arrow_origin_y: "Origin Y",
                robotis_huskylens_center_arrow_target_x: "Target X",
                robotis_huskylens_center_arrow_target_y: "Target Y",
            },
        }
    }
};

let dxl_last_valid_value = [];
let rb100_last_valid_value = [];

Entry.Robotis_rb_P_Assembly.getBlocks = function () {
    return {
        robotis_dxl_control: {
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
                        type: 'number',
                        params: ['0'],
                    },
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
                        params: ['0'],
                    },
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
                        params: ['1'],
                    },
                ],
                type: 'robotis_dxl_control',
            },

            paramsKeyMap: {
                ANGLE1: 0,
                ANGLE2: 1,
                ANGLE3: 2,
                ANGLE4: 3,

                ANGLE5: 4,
                ANGLE6: 5,
                ANGLE7: 6,
                ANGLE8: 7,
                TIME: 8
            },
            class: 'robotis_openCM70_cm',
            isNotFor: ['Robotis_rb_P_Assembly'],
            func(entity, script) {
                var data_instruction = Entry.Robotis_rb.INSTRUCTION.WRITE;
                var data_address = 19;
                var data_length = 1;
                var data_value = 1;

                var data_sendqueue = [
                    [data_instruction, data_address, data_length, data_value],
                    [Entry.Robotis_rb.INSTRUCTION.REGWRITE, 64, 1, 1, [1]],
                    [Entry.Robotis_rb.INSTRUCTION.REGWRITE, 64, 1, 1, [2]],
                    [Entry.Robotis_rb.INSTRUCTION.REGWRITE, 64, 1, 1, [3]],
                    [Entry.Robotis_rb.INSTRUCTION.REGWRITE, 64, 1, 1, [4]],
                    [Entry.Robotis_rb.INSTRUCTION.REGWRITE, 64, 1, 1, [5]],
                    [Entry.Robotis_rb.INSTRUCTION.REGWRITE, 64, 1, 1, [6]],
                    [Entry.Robotis_rb.INSTRUCTION.REGWRITE, 64, 1, 1, [7]],
                    [Entry.Robotis_rb.INSTRUCTION.REGWRITE, 64, 1, 1, [8]],
                    [Entry.Robotis_rb.INSTRUCTION.ACTION, 0, 0, 0],
                ]

                var keyWord = 'ANGLE';
                for (let i = 1; i < 9; i++) {
                    keyWord = 'ANGLE' + i;
                    var value = script.getNumberValue('ANGLE' + i, script);

                    var engValue = 2048;
                    engValue = Math.floor(Math.round(value * 4096) / 360 + 2048);

                    var time = script.getNumberValue('TIME', script) * 1000;

                    var velocity = 0;

                    if (time == 0) {
                        velocity = 0;
                    } else {
                        velocity = Math.round(Math.floor(60 * Math.abs(value - Entry.Robotis_rb.DXL_POSITION.values[i - 1]) * 1000 / 360 / time) / 0.229);
                    }

                    Entry.Robotis_rb.DXL_POSITION.values[i - 1] = value;

                    data_sendqueue.push([Entry.Robotis_rb.INSTRUCTION.REGWRITE, 112, 8, velocity * 4294967296 + engValue, [i]]);

                }

                data_sendqueue.push([Entry.Robotis_rb.INSTRUCTION.ACTION, 0, 0, 0]);

                for (let j = 1; j < 9; j++) {
                    data_sendqueue.push([Entry.Robotis_rb.INSTRUCTION.REGWRITE, 112, 4, 0, [j]]);

                }
                data_sendqueue.push([Entry.Robotis_rb.INSTRUCTION.ACTION, 0, 0, 0]);

                return Entry.Robotis_carCont.postCallReturn(
                    script,
                    data_sendqueue,
                    time + Entry.Robotis_openCM70.delay
                    //Entry.Robotis_openCM70.delay
                );
            },
            syntax: { js: [], py: ['Robotis.robotis_dxl_control(%1)'] },
        },

        robotis_dxl_each_control: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ["1", '1'],
                        ["2", '2'], //Lang.Blocks.robotis_common_green_color
                        ["3", '3'],
                        ["4", '4'],
                        ["5", '5'],
                        ["6", '6'],
                        ["7", '7'],
                        ["8", '8'],
                    ],
                    value: '1',
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
                ],
                type: 'robotis_dxl_each_control',
            },

            paramsKeyMap: {
                DXLNUM: 0,
                ANGLE: 1,
                TIME: 2,
            },
            class: 'robotis_openCM70_cm',
            isNotFor: ['Robotis_rb_P_Assembly'],
            func(entity, script) {
                var data_instruction = Entry.Robotis_rb.INSTRUCTION.WRITE;
                var data_address = 19;
                var data_length = 1;
                var data_value = 1;

                var data_sendqueue = [
                    [data_instruction, data_address, data_length, data_value],
                    [Entry.Robotis_rb.INSTRUCTION.REGWRITE, 64, 1, 1, [1]],
                    [Entry.Robotis_rb.INSTRUCTION.REGWRITE, 64, 1, 1, [2]],
                    [Entry.Robotis_rb.INSTRUCTION.REGWRITE, 64, 1, 1, [3]],
                    [Entry.Robotis_rb.INSTRUCTION.REGWRITE, 64, 1, 1, [4]],
                    [Entry.Robotis_rb.INSTRUCTION.REGWRITE, 64, 1, 1, [5]],
                    [Entry.Robotis_rb.INSTRUCTION.REGWRITE, 64, 1, 1, [6]],
                    [Entry.Robotis_rb.INSTRUCTION.REGWRITE, 64, 1, 1, [7]],
                    [Entry.Robotis_rb.INSTRUCTION.REGWRITE, 64, 1, 1, [8]],
                    [Entry.Robotis_rb.INSTRUCTION.ACTION, 0, 0, 0],


                ]

                var dxlID = script.getField('DXLNUM', script);
                var angle = script.getNumberValue('ANGLE', script);
                var time = script.getNumberValue('TIME', script) * 1000;

                var engValue = 2048;
                engValue = Math.floor(Math.round(angle * 4096) / 360 + 2048);
                var velocity = 0;

                if (time == 0) {
                    velocity = 0;
                } else {
                    velocity = Math.round(Math.floor(60 * Math.abs(angle - Entry.Robotis_rb.DXL_POSITION.values[dxlID - 1]) * 1000 / 360 / time) / 0.229);
                }

                Entry.Robotis_rb.DXL_POSITION.values[dxlID - 1] = angle;
                data_sendqueue.push([Entry.Robotis_rb.INSTRUCTION.REGWRITE, 112, 8, velocity * 4294967296 + engValue, [dxlID]]);

                data_sendqueue.push([Entry.Robotis_rb.INSTRUCTION.ACTION, 0, 0, 0]);

                for (let j = 1; j < 9; j++) {
                    data_sendqueue.push([Entry.Robotis_rb.INSTRUCTION.REGWRITE, 112, 4, 0, [j]]);

                }
                data_sendqueue.push([Entry.Robotis_rb.INSTRUCTION.ACTION, 0, 0, 0]);

                return Entry.Robotis_carCont.postCallReturn(
                    script,
                    data_sendqueue,
                    time + Entry.Robotis_openCM70.delay
                    //Entry.Robotis_openCM70.delay
                );
            },
            syntax: { js: [], py: ['Robotis.robotis_dxl_each_control(%1)'] },
        },
        robotis_dxl_set_mode: {
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
                        [Lang.Blocks.robotis_dxl_mode_joint, '3'],
                        [Lang.Blocks.robotis_dxl_mode_wheel, '1'],
                        [Lang.Blocks.robotis_dxl_mode_multi_turn, '4'],
                    ],
                    value: '3',
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
                    '1',
                    null,
                    null,
                ],
                type: 'robotis_dxl_set_mode',
            },
            paramsKeyMap: {
                DXL_ID: 0,
                DXL_MODE: 1,
            },
            class: 'robotis_openCM70_cm',
            isNotFor: ['Robotis_rb_H', 'Robotis_rb_P_Assembly'],
            func: function (sprite, script) {
                // instruction / address / length / value / default length
                var dxl_id = script.getNumberValue('DXL_ID', script);
                var dxl_mode = script.getField('DXL_MODE', script);

                var data_instruction = Entry.Robotis_rb.INSTRUCTION.BYPASS_WRITE;
                var data_address = 0;
                var data_length = 0;
                var data_value = 0;

                data_address =
                    Entry.Robotis_rb.CONTROL_TABLE.DXL_OPERATING_MODE[0];
                data_length =
                    Entry.Robotis_rb.CONTROL_TABLE.DXL_OPERATING_MODE[1];

                data_value = dxl_mode;

                var data_sendqueue = [
                    [
                        data_instruction,
                        Entry.Robotis_rb.CONTROL_TABLE.DXL_TORQUE_ENABLE[0],
                        Entry.Robotis_rb.CONTROL_TABLE.DXL_TORQUE_ENABLE[1],
                        dxl_id,
                        0
                    ],
                    [
                        data_instruction,
                        data_address,
                        data_length,
                        dxl_id,
                        data_value
                    ],
                    [
                        data_instruction,
                        Entry.Robotis_rb.CONTROL_TABLE.DXL_TORQUE_ENABLE[0],
                        Entry.Robotis_rb.CONTROL_TABLE.DXL_TORQUE_ENABLE[1],
                        dxl_id,
                        1
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
                py: ['Robotis.set_dxl_mode(%1, %2)'],
            },
        },
        robotis_dxl_set_position: {
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
                    '1',
                    '50',
                    '0',
                    null,
                ],
                type: 'robotis_dxl_set_position',
            },
            paramsKeyMap: {
                DXL_ID: 0,
                DXL_SPEED: 1,
                DXL_ANGLE: 2,
            },
            class: 'robotis_openCM70_cm',
            isNotFor: ['Robotis_rb_H', 'Robotis_rb_P_Assembly'],
            func: function (sprite, script) {
                console.log("robotis_dxl_set_position  " + new Date().getSeconds() + ':' + new Date().getMilliseconds());
                // instruction / address / length / value / default length
                var dxl_id = script.getNumberValue('DXL_ID', script);
                var dxl_speed = script.getNumberValue('DXL_SPEED', script);
                var dxl_angle = script.getNumberValue('DXL_ANGLE', script);

                var data_instruction = Entry.Robotis_rb.INSTRUCTION.BYPASS_WRITE;
                var data_address_1 = 0;
                var data_length_1 = 0;
                var data_value_1 = 0;
                var data_address_2 = 0;
                var data_length_2 = 0;
                var data_value_2 = 0;

                data_address_1 =
                    Entry.Robotis_rb.CONTROL_TABLE.DXL_PROFILE_VELOCITY[0];
                data_length_1 =
                    Entry.Robotis_rb.CONTROL_TABLE.DXL_PROFILE_VELOCITY[1];

                if (dxl_speed < 0) dxl_speed = 0;
                else if (dxl_speed > 100) dxl_speed = 100;

                data_value_1 = dxl_speed * 10;

                data_address_2 =
                    Entry.Robotis_rb.CONTROL_TABLE.DXL_GOAL_POSITION[0];
                data_length_2 =
                    Entry.Robotis_rb.CONTROL_TABLE.DXL_GOAL_POSITION[1];

                if (dxl_angle < -179) dxl_angle = -179;
                else if (dxl_angle > 180) dxl_angle = 180;

                dxl_angle = 180 - dxl_angle;

                data_value_2 = Math.floor(dxl_angle * 4096 / 360);

                var data_sendqueue = [
                    [
                        data_instruction,
                        data_address_1,
                        data_length_1,
                        dxl_id,
                        data_value_1
                    ],
                    [
                        data_instruction,
                        data_address_2,
                        data_length_2,
                        dxl_id,
                        data_value_2
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
                py: ['Robotis.set_dxl_position(%1, %2, %3)'],
            },
        },
        robotis_dxl_set_rotate: {
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
                    type: 'Block',
                    accept: 'string',
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.robotis_dxl_rotate_cw, '1'],
                        [Lang.Blocks.robotis_dxl_rotate_ccw, '2'],
                    ],
                    value: '1',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.robotis_dxl_move_rotate, '1'],
                        [Lang.Blocks.robotis_dxl_move_stop, '0'],
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
                    '1',
                    '50',
                    null,
                    null,
                    null,
                ],
                type: 'robotis_dxl_set_rotate',
            },
            paramsKeyMap: {
                DXL_ID: 0,
                DXL_SPEED: 1,
                DXL_DIRECTION: 2,
                DXL_MOVE: 3,
            },
            class: 'robotis_openCM70_cm',
            isNotFor: ['Robotis_rb_H', 'Robotis_rb_P_Assembly'],
            func: function (sprite, script) {
                // instruction / address / length / value / default length
                var dxl_id = script.getNumberValue('DXL_ID', script);
                var dxl_speed = script.getNumberValue('DXL_SPEED', script);
                var dxl_direction = script.getNumberValue('DXL_DIRECTION', script);
                var dxl_move = script.getNumberValue('DXL_MOVE', script);

                var data_instruction = Entry.Robotis_rb.INSTRUCTION.BYPASS_WRITE;
                var data_address = 0;
                var data_length = 0;
                var data_value = 0;

                data_address =
                    Entry.Robotis_rb.CONTROL_TABLE.DXL_GOAL_VELOCITY[0];
                data_length =
                    Entry.Robotis_rb.CONTROL_TABLE.DXL_GOAL_VELOCITY[1];

                if (dxl_speed < 0) dxl_speed = 0;
                else if (dxl_speed > 100) dxl_speed = 100;

                data_value = dxl_speed * 10;

                // cw일 경우 음수처리
                if (dxl_direction == 1) data_value = -data_value;

                // 알쥐나 알라 우측 바퀴인 경우 reverse mode이므로 방향 반대
                if (dxl_id == 33 || dxl_id == 35) data_value = -data_value;

                data_value = data_value * dxl_move;

                var data_sendqueue = [
                    [
                        data_instruction,
                        data_address,
                        data_length,
                        dxl_id,
                        data_value
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
                py: ['Robotis.set_dxl_rotate(%1, %2, %3)'],
            },
        },
        robotis_dxl_set_multiturn_round: {
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
                    type: 'Block',
                    accept: 'string',
                },
                {
                    type: 'Block',
                    accept: 'string',
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.robotis_dxl_rotate_cw, '1'],
                        [Lang.Blocks.robotis_dxl_rotate_ccw, '2'],
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
                    '1',
                    '50',
                    '1',
                    null,
                    null,
                ],
                type: 'robotis_dxl_set_multiturn_round',
            },
            paramsKeyMap: {
                DXL_ID: 0,
                DXL_SPEED: 1,
                DXL_ROUND: 2,
                DXL_DIRECTION: 3,
            },
            class: 'robotis_openCM70_cm',
            isNotFor: ['Robotis_rb_H', 'Robotis_rb_P_Assembly'],
            func: function (sprite, script) {
                console.log("robotis_dxl_set_multiturn_round  " + new Date().getSeconds() + ':' + new Date().getMilliseconds());
                // instruction / address / length / value / default length
                var dxl_id = script.getNumberValue('DXL_ID', script);
                var dxl_speed = script.getNumberValue('DXL_SPEED', script);
                var dxl_round = script.getNumberValue('DXL_ROUND', script);
                var dxl_direction = script.getNumberValue('DXL_DIRECTION', script);


                var data_instruction = Entry.Robotis_rb.INSTRUCTION.WRITE;
                var data_address_1 = 0;
                var data_length_1 = 0;
                var data_value_1 = 0;
                var data_address_2 = 0;
                var data_length_2 = 0;
                var data_value_2 = 0;
                var data_address_3 = 0;
                var data_length_3 = 0;
                var data_value_3 = 0;

                var data_sendqueue = [];
                var result = undefined;

                if (dxl_id == 0 || dxl_speed == 0 || dxl_round == 0) {
                    return;
                }

                data_address_1 =
                    Entry.Robotis_rb.CONTROL_TABLE.CM_DXL_MULTITURN_ID[0];
                data_length_1 =
                    Entry.Robotis_rb.CONTROL_TABLE.CM_DXL_MULTITURN_ID[1];

                data_address_2 =
                    Entry.Robotis_rb.CONTROL_TABLE.CM_DXL_MULTITURN_SPEED[0];
                data_length_2 =
                    Entry.Robotis_rb.CONTROL_TABLE.CM_DXL_MULTITURN_SPEED[1];

                if (dxl_speed < 0) dxl_speed = 0;
                else if (dxl_speed > 100) dxl_speed = 100;

                data_value_2 = dxl_speed * 10;

                data_address_3 =
                    Entry.Robotis_rb.CONTROL_TABLE.CM_DXL_MULTITURN_DISTANCE[0];
                data_length_3 =
                    Entry.Robotis_rb.CONTROL_TABLE.CM_DXL_MULTITURN_DISTANCE[1];

                if (dxl_round < 0) dxl_round = 0;
                else if (dxl_round > 100) dxl_round = 100;

                data_value_3 = dxl_round * 4096;

                if (dxl_direction == 1) data_value_3 = -data_value_3;

                data_sendqueue = [
                    [
                        data_instruction,
                        data_address_1,
                        data_length_1,
                        dxl_id,
                    ],
                    [
                        data_instruction,
                        data_address_2,
                        data_length_2,
                        data_value_2,
                    ],
                    [
                        data_instruction,
                        data_address_3,
                        data_length_3,
                        data_value_3,
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
                py: ['Robotis.set_dxl_rotate(%1, %2, %3)'],
            },
        },
        robotis_dxl_value: {
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
                        [Lang.Blocks.robotis_dxl_value_angle, '1'],
                        [Lang.Blocks.robotis_dxl_value_velocity, '2'],
                        [Lang.Blocks.robotis_dxl_value_moving, '3'],
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
                    1,
                    null,
                ],
                type: 'robotis_dxl_value',
            },
            paramsKeyMap: {
                ID: 0,
                TYPE: 1,
            },
            class: 'robotis_openCM70_custom',
            isNotFor: ['Robotis_rb_H', 'Robotis_rb_car', 'Robotis_rb_P_Assembly'],
            func: function (sprite, script) {
                var scope = script.executor.scope;

                // instruction / address / length / value / default length
                var data_instruction = Entry.Robotis_rb.INSTRUCTION.BYPASS_READ;
                var data_address = 0;
                var data_length = 1;
                var dxl_id = script.getNumberValue('ID');
                var data_type = script.getNumberValue('TYPE');

                var data_default_address = 0;
                var data_default_length = 0;

                if (data_type == 1) {
                    data_address = Entry.Robotis_rb.CONTROL_TABLE.DXL_PRESENT_POSITION[0];
                    data_length = Entry.Robotis_rb.CONTROL_TABLE.DXL_PRESENT_POSITION[1];
                } else if (data_type == 2) {
                    data_address = Entry.Robotis_rb.CONTROL_TABLE.DXL_PRESENT_VELOCITY[0];
                    data_length = Entry.Robotis_rb.CONTROL_TABLE.DXL_PRESENT_VELOCITY[1];
                } else if (data_type == 3) {
                    data_address = Entry.Robotis_rb.CONTROL_TABLE.DXL_IS_MOVING[0];
                    data_length = Entry.Robotis_rb.CONTROL_TABLE.DXL_IS_MOVING[1];
                }

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
                        if (typeof Entry.hw.sendQueue.prevResult == 'undefined') {
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
                        dxl_id,
                        data_default_length,
                    ],
                ]);
                // Entry.hw.socket.send(JSON.stringify(Entry.hw.sendQueue));
                Entry.Robotis_carCont.update();

                // 통합센서의 컨트롤 테이블 주소는 RB-100블록에서 사용하지 않는 주소를 사용
                // 주소 겹침 방지
                var result = Entry.hw.portData[data_default_address];
                if (result == undefined) {
                    result = dxl_last_valid_value[data_default_address];
                }
                else {
                    dxl_last_valid_value[data_default_address] = result;
                }
                Entry.hw.sendQueue.prevAddress = data_default_address;
                Entry.hw.sendQueue.prevTime = new Date();
                Entry.hw.sendQueue.prevResult = result;

                if (typeof result == 'undefined') {

                    return 0;
                }

                if (data_type == 1) {
                    result = 180 - Math.floor(result * 360 / 4096);
                }
                else if (data_type == 2) {
                    if (result < -1000) result = -1000;
                    else if (result > 1000) result = 1000;
                    result = Math.floor(result / 10);
                }

                return result;
            },
            syntax: {
                js: [],
                py: ['Robotis.get_dxl_value(%1, %2)'],
            },
        },
        robotis_huskylens_block_value_closest_to_center: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.robotis_huskylens_center_block_center_x, '0'],
                        [Lang.Blocks.robotis_huskylens_center_block_center_y, '1'],
                        [Lang.Blocks.robotis_huskylens_center_block_width, '2'],
                        [Lang.Blocks.robotis_huskylens_center_block_height, '3'],
                        [Lang.Blocks.robotis_huskylens_center_leared_id, '4'],
                    ],
                    value: '0',
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
                type: 'robotis_huskylens_block_value_closest_to_center',
            },
            paramsKeyMap: {
                DATA_TYPE: 0,
            },
            class: 'robotis_openCM70_custom',
            isNotFor: ['Robotis_rb_P_Assembly'],
            func: function (sprite, script) {
                var scope = script.executor.scope;

                // instruction / address / length / value / default length
                var data_instruction = Entry.Robotis_rb.INSTRUCTION.READ;
                var data_address = 4009;
                var data_length = 2;
                var data_type = script.getNumberValue('DATA_TYPE');
                var data_value = 0;

                var data_default_address = 0;
                var data_default_length = 0;

                data_address += data_type * 2;

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
                        if (typeof Entry.hw.sendQueue.prevResult == 'undefined') {
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
                if (result == undefined) {
                    result = dxl_last_valid_value[data_default_address];
                }
                else {
                    dxl_last_valid_value[data_default_address] = result;
                }
                Entry.hw.sendQueue.prevAddress = data_default_address;
                Entry.hw.sendQueue.prevTime = new Date();
                Entry.hw.sendQueue.prevResult = result;

                if (typeof result == 'undefined') {

                    return 0;
                }

                return result;
            },
            syntax: {
                js: [],
                py: ['Robotis.robotis_huskylens_block_value_closest_to_center(%1)'],
            },
        },
        robotis_huskylens_arrow_value_closest_to_center: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.robotis_huskylens_center_arrow_origin_x, '0'],
                        [Lang.Blocks.robotis_huskylens_center_arrow_origin_y, '1'],
                        [Lang.Blocks.robotis_huskylens_center_arrow_target_x, '2'],
                        [Lang.Blocks.robotis_huskylens_center_arrow_target_y, '3'],
                        [Lang.Blocks.robotis_huskylens_center_leared_id, '4'],
                    ],
                    value: '0',
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
                type: 'robotis_huskylens_arrow_value_closest_to_center',
            },
            paramsKeyMap: {
                DATA_TYPE: 0,
            },
            class: 'robotis_openCM70_custom',
            isNotFor: ['Robotis_rb_P_Assembly'],
            func: function (sprite, script) {
                var scope = script.executor.scope;

                // instruction / address / length / value / default length
                var data_instruction = Entry.Robotis_rb.INSTRUCTION.READ;
                var data_address = 4019;
                var data_length = 2;
                var data_type = script.getNumberValue('DATA_TYPE');
                var data_value = 0;

                var data_default_address = 0;
                var data_default_length = 0;

                data_address += data_type * 2;

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
                        if (typeof Entry.hw.sendQueue.prevResult == 'undefined') {
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
                if (result == undefined) {
                    result = dxl_last_valid_value[data_default_address];
                }
                else {
                    dxl_last_valid_value[data_default_address] = result;
                }
                Entry.hw.sendQueue.prevAddress = data_default_address;
                Entry.hw.sendQueue.prevTime = new Date();
                Entry.hw.sendQueue.prevResult = result;

                if (typeof result == 'undefined') {

                    return 0;
                }

                return result;
            },
            syntax: {
                js: [],
                py: ['Robotis.robotis_huskylens_arrow_value_closest_to_center(%1)'],
            },
        },
        robotis_huskylens_number_of_learned_id: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
            ],
            events: {},
            def: {
                params: [
                ],
                type: 'robotis_huskylens_number_of_learned_id',
            },
            paramsKeyMap: {
            },
            class: 'robotis_openCM70_custom',
            isNotFor: ['Robotis_rb_P_Assembly'],
            func: function (sprite, script) {
                var scope = script.executor.scope;

                // instruction / address / length / value / default length
                var data_instruction = Entry.Robotis_rb.INSTRUCTION.READ;
                var data_address = 4003;
                var data_length = 2;
                var data_value = 0;

                var data_default_address = 0;
                var data_default_length = 0;

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
                        if (typeof Entry.hw.sendQueue.prevResult == 'undefined') {
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
                if (result == undefined) {
                    result = dxl_last_valid_value[data_default_address];
                }
                else {
                    dxl_last_valid_value[data_default_address] = result;
                }
                Entry.hw.sendQueue.prevAddress = data_default_address;
                Entry.hw.sendQueue.prevTime = new Date();
                Entry.hw.sendQueue.prevResult = result;

                if (typeof result == 'undefined') {

                    return 0;
                }

                return result;
            },
            syntax: {
                js: [],
                py: ['Robotis.robotis_huskylens_number_of_learned_id()'],
            },
        },
        robotis_huskylens_block_value_of_id: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                    {
                        type: 'Dropdown',
                        options: [
                            ["1", '1'],
                            ["2", '2'],
                            ["3", '3'],
                            ["4", '4'],
                            ["5", '5'],
                            ["6", '6'],
                            ["7", '7'],
                            ["8", '8'],
                        ],
                        value: '1',
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                    {
                        type: 'Dropdown',
                        options: [
                            [Lang.Blocks.robotis_huskylens_center_block_center_x, '0'],
                            [Lang.Blocks.robotis_huskylens_center_block_center_y, '1'],
                            [Lang.Blocks.robotis_huskylens_center_block_width, '2'],
                            [Lang.Blocks.robotis_huskylens_center_block_height, '3'],
                        ],
                        value: '0',
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
            ],
            events: {},
            def: {
                params: [
                    null,
                    null,
                ],
                type: 'robotis_huskylens_block_value_of_id',
            },
            paramsKeyMap: {
                ID: 0,
                TYPE: 1,
            },
            class: 'robotis_openCM70_custom',
            isNotFor: ['Robotis_rb_P_Assembly'],
            func: function (sprite, script) {
                var scope = script.executor.scope;

                // instruction / address / length / value / default length
                var data_instruction = Entry.Robotis_rb.INSTRUCTION.WRITE;
                var data_address = 4029; // ID_FOR_USE
                var data_length = 2;
                var data_value = script.getNumberValue('ID');

                var data_sendqueue = [
                    [
                        data_instruction,
                        data_address,
                        data_length,
                        data_value,
                    ],
                ];

                Entry.Robotis_carCont.postCallReturn(
                    script,
                    data_sendqueue,
                    Entry.Robotis_openCM70.delay
                );

                data_instruction = Entry.Robotis_rb.INSTRUCTION.READ;
                data_address = 4036; // BLOCK_RESULT_BY_ID_X_CENTER
                data_length = 2;

                data_address += script.getNumberValue('TYPE') * 2;

                var data_default_address = 0;
                var data_default_length = 0;

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
                        if (typeof Entry.hw.sendQueue.prevResult == 'undefined') {
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
                if (result == undefined) {
                    result = dxl_last_valid_value[data_default_address];
                }
                else {
                    dxl_last_valid_value[data_default_address] = result;
                }
                Entry.hw.sendQueue.prevAddress = data_default_address;
                Entry.hw.sendQueue.prevTime = new Date();
                Entry.hw.sendQueue.prevResult = result;

                if (typeof result == 'undefined') {

                    return 0;
                }

                return result;
            },
            syntax: {
                js: [],
                py: ['Robotis.robotis_huskylens_block_value_of_id(%1, %2)'],
            },
        },
        robotis_huskylens_arrow_value_of_id: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                    {
                        type: 'Dropdown',
                        options: [
                            ["1", '1'],
                            ["2", '2'],
                            ["3", '3'],
                            ["4", '4'],
                            ["5", '5'],
                            ["6", '6'],
                            ["7", '7'],
                            ["8", '8'],
                        ],
                        value: '1',
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                    {
                        type: 'Dropdown',
                        options: [
                            [Lang.Blocks.robotis_huskylens_center_arrow_origin_x, '0'],
                            [Lang.Blocks.robotis_huskylens_center_arrow_origin_y, '1'],
                            [Lang.Blocks.robotis_huskylens_center_arrow_target_x, '2'],
                            [Lang.Blocks.robotis_huskylens_center_arrow_target_y, '3'],
                        ],
                        value: '0',
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
            ],
            events: {},
            def: {
                params: [
                    null,
                    null,
                ],
                type: 'robotis_huskylens_arrow_value_of_id',
            },
            paramsKeyMap: {
                ID: 0,
                TYPE: 1,
            },
            class: 'robotis_openCM70_custom',
            isNotFor: ['Robotis_rb_P_Assembly'],
            func: function (sprite, script) {
                var scope = script.executor.scope;

                // instruction / address / length / value / default length
                var data_instruction = Entry.Robotis_rb.INSTRUCTION.WRITE;
                var data_address = 4029; // ID_FOR_USE
                var data_length = 2;
                var data_value = script.getNumberValue('ID');

                var data_sendqueue = [
                    [
                        data_instruction,
                        data_address,
                        data_length,
                        data_value,
                    ],
                ];

                Entry.Robotis_carCont.postCallReturn(
                    script,
                    data_sendqueue,
                    Entry.Robotis_openCM70.delay
                );

                data_instruction = Entry.Robotis_rb.INSTRUCTION.READ;
                data_address = 4044; // ARROW_RESULT_BY_ID_X_ORIGIN
                data_length = 2;

                data_address += script.getNumberValue('TYPE') * 2;

                var data_default_address = 0;
                var data_default_length = 0;

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
                        if (typeof Entry.hw.sendQueue.prevResult == 'undefined') {
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
                if (result == undefined) {
                    result = dxl_last_valid_value[data_default_address];
                }
                else {
                    dxl_last_valid_value[data_default_address] = result;
                }
                Entry.hw.sendQueue.prevAddress = data_default_address;
                Entry.hw.sendQueue.prevTime = new Date();
                Entry.hw.sendQueue.prevResult = result;

                if (typeof result == 'undefined') {

                    return 0;
                }

                return result;
            },
            syntax: {
                js: [],
                py: ['Robotis.robotis_huskylens_arrow_value_of_id(%1, %2)'],
            },
        },
        robotis_huskylens_connection_status: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.robotis_connected, '1'],
                        [Lang.Blocks.robotis_disconnected, '0'],
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
                ],
                type: 'robotis_huskylens_connection_status',
            },
            paramsKeyMap: {
                STATUS: 0,
            },
            class: 'robotis_openCM70_custom',
            isNotFor: ['Robotis_rb_P_Assembly'],
            func: function (sprite, script) {
                var scope = script.executor.scope;

                // instruction / address / length / value / default length
                var data_instruction = Entry.Robotis_rb.INSTRUCTION.READ;
                var data_address = 4000;
                var data_length = 1;
                var data_value = 0;

                var data_default_address = 0;
                var data_default_length = 0;
                var compareValue = script.getNumberValue('STATUS');

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

                return (Entry.hw.sendQueue.prevResult == compareValue);
               
            },
            syntax: {
                js: [],
                py: ['Robotis.robotis_huskylens_connection_status(%1)'],
            },
        },
        robotis_huskylens_if_detected: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.robotis_huskylens_block, '0'],
                        [Lang.Blocks.robotis_huskylens_arrow, '1'],
                    ],
                    value: '0',
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
                type: 'robotis_huskylens_if_detected',
            },
            paramsKeyMap: {
                DETECT_TYPE: 0,
            },
            class: 'robotis_openCM70_custom',
            isNotFor: ['Robotis_rb_P_Assembly'],
            func: function (sprite, script) {
                var scope = script.executor.scope;

                // instruction / address / length / value / default length
                var data_instruction = Entry.Robotis_rb.INSTRUCTION.READ;
                var data_address = 4005; // block
                var data_length = 1;
                var data_value = 0;

                var data_default_address = 0;
                var data_default_length = 0;
                var detect_type = script.getNumberValue('DETECT_TYPE');

                if (detect_type == 1) data_address = 4006; // arrow

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
                        return (Entry.hw.sendQueue.prevResult == 1);
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

                return (Entry.hw.sendQueue.prevResult == 1);
               
            },
            syntax: {
                js: [],
                py: ['Robotis.robotis_huskylens_if_detected(%1)'],
            },
        },
        robotis_huskylens_set_mode: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.robotis_huskylens_mode_face_recognition, '0'],
                        [Lang.Blocks.robotis_huskylens_mode_object_tracking, '1'],
                        [Lang.Blocks.robotis_huskylens_mode_object_recognition, '2'],
                        [Lang.Blocks.robotis_huskylens_mode_line_tracking, '3'],
                        [Lang.Blocks.robotis_huskylens_mode_color_recognition, '4'],
                        [Lang.Blocks.robotis_huskylens_mode_tag_recognition, '5'],
                        [Lang.Blocks.robotis_huskylens_mode_object_classification, '6'],
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
                type: 'robotis_huskylens_set_mode',
            },
            paramsKeyMap: {
                HUSKYLENS_MODE: 0,
            },
            class: 'robotis_openCM70_cm',
            isNotFor: ['Robotis_rb_P_Assembly'],
            func: function (sprite, script) {
                // instruction / address / length / value / default length
                var huskylens_mode = script.getField('HUSKYLENS_MODE', script);

                var data_instruction = Entry.Robotis_rb.INSTRUCTION.WRITE;
                var data_address = 4001;
                var data_length = 1;

                var data_sendqueue = [
                    [
                        data_instruction,
                        data_address,
                        data_length,
                        huskylens_mode,
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
                py: ['Robotis.set_huskylens_mode(%1)'],
            },
        },
        robotis_huskylens_save_result: {
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
                ],
                type: 'robotis_huskylens_save_result',
            },
            paramsKeyMap: {
            },
            class: 'robotis_openCM70_cm',
            isNotFor: ['Robotis_rb_P_Assembly'],
            func: function (sprite, script) {
                // instruction / address / length / value / default length

                var data_instruction = Entry.Robotis_rb.INSTRUCTION.WRITE;
                var data_address = 4002;
                var data_length = 1;
                var data_value = 1;

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
                py: ['Robotis.robotis_huskylens_save_result()'],
            },
        },
        robotis_huskylens_print_custom_text: {
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
                    0,
                    0,
                    "Hello!"
                ],
                type: 'robotis_huskylens_print_custom_text',
            },
            paramsKeyMap: {
                X: 0,
                Y: 1,
                TEXT: 2,
            },
            class: 'robotis_openCM70_cm',
            isNotFor: ['Robotis_rb_P_Assembly'],
            func: function (sprite, script) {
                // instruction / address / length / value / default length
                var x = script.getNumberValue('X', script);
                var y = script.getNumberValue('Y', script);
                var text = script.getStringValue('TEXT', script);
                var text_len = text.length;
                var data_buf = [];
                var i = 0;

                data_buf.push(x % 256);
                data_buf.push(Math.floor(x/256));
                data_buf.push(y % 256);
                data_buf.push(Math.floor(y/256));
                data_buf.push(0);
                data_buf.push(0);
                for (i = 0; i < text_len; i++) {
                    data_buf.push(text[i]);
                }

                var data_instruction = Entry.Robotis_rb.INSTRUCTION.WRITE;
                var data_address = 4200;
                var data_length = 6 + text_len;

                //console.log("x: " + x + "y: " + y + "text: " + text + " " + data_buf);

                var data_sendqueue = [
                    [
                        data_instruction,
                        data_address,
                        data_length,
                        data_buf,
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
                py: ['Robotis.robotis_huskylens_print_custom_text(%1,%2,%3)'],
            },
        },
        robotis_huskylens_clear_custom_text: {
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
                ],
                type: 'robotis_huskylens_clear_custom_text',
            },
            paramsKeyMap: {
            },
            class: 'robotis_openCM70_cm',
            isNotFor: ['Robotis_rb_P_Assembly'],
            func: function (sprite, script) {
                // instruction / address / length / value / default length

                var data_instruction = Entry.Robotis_rb.INSTRUCTION.WRITE;
                var data_address = 4250;
                var data_length = 1;

                var data_sendqueue = [
                    [
                        data_instruction,
                        data_address,
                        data_length,
                        1,
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
                py: ['Robotis.robotis_huskylens_clear_custom_text()'],
            },
        },


    };
};

module.exports = [Entry.Robotis_rb_P_Assembly];



