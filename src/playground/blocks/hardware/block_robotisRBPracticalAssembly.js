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
        Entry.Robotis_carCont.setRobotisData([
            [Entry.Robotis_rb.INSTRUCTION.WRITE, 2100, 1, 1], // PracticeBot Finish
        ]);
        camera_id_for_use = 0;
        Entry.Robotis_carCont.update();
    },
    id: ['7.A', '7.B'],
    name: 'Robotis_rb_P_Assembly',
    url: 'http://www.robotis.com/index/product.php?cate_code=111310',
    imageName: 'robotis_RB100_Practical_Assembly.png',
    title: {
        "ko": "로봇아이(AI)",
        "en": "Robot AI"
    },
    delay: 30,
    readDelay: 30,
};

Entry.Robotis_rb_P_Assembly.blockMenuBlocks = [
    // 주행 제어
    'robotis_Practice_drive_simple',
    'robotis_Practice_drive_advanced',
    'robotis_Practice_drive_seperate',
    'robotis_Practice_drive_angle',
    'robotis_Practice_go_distance',
    'robotis_Practice_turn_angle',
    'robotis_Practice_follow_line',
    'robotis_Practice_stop_at_cross',
    'robotis_Practice_turn_at_line',
    'robotis_Practice_drive_stop',

    'robotis_Practice_securitybot_init',
    'robotis_Practice_securitybot_hi',
    'robotis_Practice_securitybot_alert',

    'robotis_Practice_petbot_happy',
    'robotis_Practice_petbot_sad',

    'robotis_Practice_farmbot_init',
    'robotis_Practice_farmbot_seek',
    'robotis_Practice_farmbot_plant_type',
    'robotis_Practice_farmbot_harvest_or_not_and_go',

    // 값 블록
    'robotis_Practice_cm_ir_value',
    'robotis_Practice_detectFrontObj',
    'robotis_Practice_cm_ir_compare',
    'robotis_Practice_cm_btn_value',
    'robotis_Practice_cm_joystick_value',
    'robotis_Practice_mic',
    'robotis_Practice_detectSound_compare',
    'robotis_Practice_imu',
    'robotis_Practice_roll_pitch', 
    //'robotis_Practice_distance_value',
    'robotis_Practice_environment_value',
    'robotis_Practice_line_cross_compare',
    //'robotis_Practice_distance_compare',
    'robotis_Practice_environment_compare',
    'robotis_Practice_dxl_value',

    // 소리
    'robotis_Practice_scale_simple',
    'robotis_Practice_scale_advanced',
    'robotis_Practice_rest_simple',
    'robotis_Practice_rest_advanced',
    'robotis_Practice_beat_per_minute',
    'robotis_Practice_Hello',
    'robotis_Practice_effectSound',
    'robotis_Practice_record',
    'robotis_Practice_playRecord',

    // LCD 제어
    'robotis_Practice_screen',
    'robotis_Practice_anim_screen',
    'robotis_Practice_icon_screen_food_plant',
    'robotis_Practice_icon_screen_animal_human',
    'robotis_Practice_icon_screen_object_tool',
    'robotis_Practice_icon_screen_vehicle_number',
    'robotis_Practice_text_screen',
    'robotis_Practice_text_screen_redraw',
    'robotis_Practice_pixel',
    'robotis_Practice_LCDColor',
    'robotis_Practice_LCD_Flash',
    'robotis_Practice_LCDBright',

    // LED 제어
    'robotis_Practice_cm_led',
    'robotis_Practice_cm_led_pattern',

    // 다이나믹셀 제어
    'robotis_Practice_dxl_set_mode',
    'robotis_Practice_dxl_each_control',
    'robotis_Practice_dxl_set_position',
    'robotis_Practice_dxl_set_rotate',
    'robotis_Practice_dxl_set_multiturn_round',

    // 인공지능 카메라 값 블록
    'robotis_Practice_huskylens_connection_status',
    'robotis_Practice_huskylens_if_detected',

    'robotis_Practice_huskylens_block_value_closest_to_center',
    'robotis_Practice_huskylens_arrow_value_closest_to_center',
    'robotis_Practice_huskylens_number_of_learned_id',
    'robotis_Practice_huskylens_block_value_of_id',
    'robotis_Practice_huskylens_arrow_value_of_id',

    'robotis_Practice_huskylens_if_learned_id',
    'robotis_Practice_huskylens_if_detected_id_type',

    // AI Camera 제어
    'robotis_Practice_huskylens_set_mode',
    'robotis_Practice_huskylens_print_custom_text',
    'robotis_Practice_huskylens_clear_custom_text',
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
                // 주행 제어
                robotis_Practice_drive_simple: "속도 %1 (으)로 %2 하기 %3",
                robotis_Practice_drive_advanced: "왼쪽바퀴 %1 속도로 %2 하기, 오른쪽바퀴 %3 속도로 %4 하기 %5",
                robotis_Practice_drive_seperate: "%1 바퀴 %2 속도로 %3 으로 회전하기 %4",
                robotis_Practice_drive_angle: "%1 바퀴 %2 도만큼 %3 으로 회전하기 %4",
                robotis_Practice_go_distance:"%1 cm %2 하기 %3",
                robotis_Practice_turn_angle:"%1 도 %2 하기%3",
                robotis_Practice_follow_line: "%1 속도로 라인 따라가기 %2",
                robotis_Practice_stop_at_cross: "교차로 %1 에서 멈추기 %2",
                robotis_Practice_turn_at_line: "교차로에서 %1 하고 멈추기 %2",
                robotis_Practice_drive_stop: "정지하기 %1",

                robotis_Practice_securitybot_init: "보안 로봇 초기화 %1",
                robotis_Practice_securitybot_hi: "보안 로봇 긍정적 행동하기 %1",
                robotis_Practice_securitybot_alert: "보안 로봇 부정적 행동하기 %1",

                robotis_Practice_petbot_happy: "반려 로봇 행복한 행동하기 %1",
                robotis_Practice_petbot_sad: "반려 로봇 화난 행동하기 %1",

                robotis_Practice_farmbot_init: "스마트팜 로봇 초기화 %1",
                robotis_Practice_farmbot_seek: "농작물 찾기 %1",
                robotis_Practice_farmbot_plant_type: "%1 농작물이면",
                robotis_Practice_farmbot_harvest_or_not_and_go: "농작물 %1 돌아가기 %2",


                // 값 블록
                robotis_Practice_cm_ir_value: "%1 적외선센서 값",
                robotis_Practice_cm_ir_compare: "%1 적외선센서 값이 %2 보다 %3",
                //robotis_Practice_detectFrontObj: "%1의 %2에 물체가 있으면",  // 거리센서도 사용할 경우
                robotis_Practice_detectFrontObj: "적외선센서의 %2에 물체가 있으면",  // 거리센서를 사용하지 않을 경우
                robotis_Practice_cm_btn_value: "제어기의 %1 버튼을 클릭했을때",
                robotis_Practice_cm_joystick_value: "제어기의 노랑 조이스틱 위치가 %1 이면",
                robotis_Practice_mic: "소리의 크기(dB)",
                robotis_Practice_detectSound_compare: "소리가 제어기의 %1에서 들리면",
                robotis_Practice_imu: "%1축의 %2 값",
                robotis_Practice_roll_pitch: "제어기의 %1 값",
                robotis_Practice_line_cross_compare: "교차로 모양이 %1이면",
                robotis_Practice_distance_value: "%1 값",
                robotis_Practice_distance_compare: "%1 값이 %2보다 %3",
                robotis_Practice_environment_value: "%1 값",
                robotis_Practice_environment_compare: "%1 값이 %2보다 %3",
                robotis_Practice_dxl_value: "%1의 각도값",


                // 소리
                robotis_Practice_scale_simple: "옥타브%1 로 %2 음을 %3로 연주하기 %4",
                robotis_Practice_scale_advanced: "옥타브%1 로 %2 음을 %3박자 연주하기 %4",
                robotis_Practice_rest_simple: "%1 %2",
                robotis_Practice_rest_advanced: "쉼표 %1 박자 %2",
                robotis_Practice_beat_per_minute: "연주 빠르기를 %1 (으)로 정하기 %2",
                robotis_Practice_Hello: "로봇 %1 말하기 %2",
                robotis_Practice_effectSound: "효과음 %1 재생하기 %2",
                robotis_Practice_record: "소리 %1번에 녹음하기 %2",
                robotis_Practice_playRecord: "소리 %1번을 재생하기 %2",

                
                // LCD 제어
                robotis_Practice_screen: "화면 표정을 %1 %2 (으)로 정하기 %3",
                robotis_Practice_anim_screen: "화면 애니메이션을 %1 %2 (으)로 정하기 %3",
                robotis_Practice_icon_screen_food_plant: "화면에 [음식/식물]중 %1를 (%2, %3)위치에 %4 크기로 표시 %5",
                robotis_Practice_icon_screen_animal_human: "화면에 [동물/사람]중 %1를 (%2, %3)위치에 %4 크기로 표시 %5",
                robotis_Practice_icon_screen_object_tool: "화면에 [물건/도구]중 %1를 (%2, %3)위치에 %4 크기로 표시 %5",
                robotis_Practice_icon_screen_vehicle_number: "화면에 [탈것/숫자]중 %1를 (%2, %3)위치에 %4 크기로 표시 %5",
                robotis_Practice_text_screen: "화면에 %1를 (%2, %3)위치에 %4 로 %5으로 표시 %6",
                robotis_Practice_pixel: "화면 (%1, %2)위치에 %3 색 점 표시 %4",
                robotis_Practice_text_screen_redraw: "화면에 %1를 (%2, %3)위치에 %4으로 새로 표시 %5",
                robotis_Practice_LCDColor: "화면 색상을 %1 (으)로 정하기 %2",
                robotis_Practice_LCD_Flash: "화면을 %1과 %2으로 %3초 간격으로 깜박이기 %4",
                robotis_Practice_LCDBright: "화면 밝기를 %1 (으)로 정하기 %2",
                
                
                // LED 제어
                robotis_Practice_cm_led: "로봇 %1 LED %2 %3",
                robotis_Practice_cm_led_pattern: "LED %1 %2로 깜박이기 %3",
                

                // DXL 제어
                robotis_Practice_dxl_set_mode: "%1 모터 %2 모드로 설정 %3",
                robotis_Practice_dxl_each_control: "%1 모터 %2°로 %3 초 동안 움직이기 %4",
                robotis_Practice_dxl_set_position: "%1 모터 %2 속도로 %3° 위치로 회전 %4",
                robotis_Practice_dxl_set_rotate: "%1 모터 %2 속도로 %3 으로 %4 %5",
                robotis_Practice_dxl_set_multiturn_round: "%1 모터 %2 속도로 %3 바퀴 %4으로 회전 %5",
                

                
                // 인공지능 카메라 값 블록
                robotis_Practice_huskylens_connection_status: "인공지능 카메라가 %1이면",
                robotis_Practice_huskylens_if_detected: "인공지능 카메라에 %1 이/가 표시되면",

                robotis_Practice_huskylens_block_value_closest_to_center: "인공지능 카메라가 인식한 %1의 %2",
                robotis_Practice_huskylens_arrow_value_closest_to_center: "인공지능 카메라가 인식한 화살표의 %1",
                robotis_Practice_huskylens_number_of_learned_id: "인공지능 카메라가 학습한 클래스의 갯수",
                robotis_Practice_huskylens_block_value_of_id: "인공지능 카메라가 감지한 클래스가 %1인 %2의 %3",
                robotis_Practice_huskylens_arrow_value_of_id: "인공지능 카메라가 감지한 클래스가 %1인 화살표의 %2",

                robotis_Practice_huskylens_if_learned_id: "인공지능 카메라가 클래스가 %1인 데이터를 학습하였으면",
                robotis_Practice_huskylens_if_detected_id_type: "인공지능 카메라가 클래스가 %1인 %2데이터를 인식하였으면",
                

                // 인공지능 카메라 제어
                robotis_Practice_huskylens_set_mode: "인공지능 카메라의 작동방식을 %1(으)로 설정 %2",
                robotis_Practice_huskylens_print_custom_text: "인공지능 카메라의 화면 위치 (%1,%2)에 %3를 보여주기%4",
                robotis_Practice_huskylens_clear_custom_text: "인공지능 카메라의 화면의 글 지우기 %1",
            },
            Helper: {
                // 주행 제어
                robotis_Practice_drive_simple: "로봇아이를 지정한 속도와 방향으로 주행\n속도범위: -100 ~ 100\n속도단위: %",
                robotis_Practice_drive_advanced: "로봇아이의 좌,우 바퀴를 각각 지정한 속도와 방향으로 회전\n속도범위: -100 ~ 100\n속도단위: %",
                robotis_Practice_drive_seperate: "로봇아이의 지정한 바퀴를 지정한 속도와 방향으로 회전\n속도범위: -100 ~ 100\n속도단위: %",
                robotis_Practice_drive_angle: "로봇아이의 두 바퀴를 지정한 방향과 지정한 각도만큼 회전\n각도범위: -5760 ~ 5760\n각도단위: 도",
                robotis_Practice_go_distance: "지정거리만큼 앞 또는 뒤로 이동\n거리범위: -1000 ~ 1000\n거리단위: mm",
                robotis_Practice_turn_angle: "지정한 각도와 방향으로 제자리회전\n각도범위: -360 ~ 360\n각도단위: 도",
                robotis_Practice_follow_line: "지정한 수준의 속도로 라인 따라가기 시작",
                robotis_Practice_stop_at_cross: "지정한 교차로에서 멈추기",
                robotis_Practice_turn_at_line: "교차로에서 지정한 회전을 하고 멈추기",
                robotis_Practice_drive_stop: "로봇아이 정지하기",

                robotis_robotai_lite_securitybot_init:
                    '보안 로봇을 초기화합니다. 두 모터를 관절모드로 설정하고 카메라를 얼굴인식모드로 설정합니다.',
                robotis_robotai_lite_securitybot_hi:
                    '보안 로봇이 "사용자를 확인하였습니다." 문구를 화면에 표시하고 팔을 위아래로 흔듭니다.',
                robotis_robotai_lite_securitybot_alert:
                    '보안 로봇이 "사용자가 아닙니다." 문구를 화면에 표시하고 몸을 좌우로 흔듭니다.',

                robotis_robotai_lite_petbot_happy:
                    '반려 로봇이 웃는 표정을 하고 "즐거워요" 라고 말을 하면서 제자리에서 한바퀴 회전합니다.',
                robotis_robotai_lite_petbot_sad:
                    '반려 로봇이 화난 표정을 하고 "무서워요" 라고 말을 하면서 뒤로 5cm 후진합니다.',

                robotis_robotai_lite_farmbot_init:
                    '스마트팜 로봇을 초기화 합니다. 1번 모터를 시작위치로 이동시키고 카메라를 색상인식모드로 설정합니다.',
                robotis_robotai_lite_farmbot_seek: '농작물을 발견하면 가까이로 이동합니다.',
                robotis_robotai_lite_farmbot_plant_type: '농작물의 유형을 판단합니다.',
                robotis_robotai_lite_farmbot_harvest_or_not_and_go:
                    '농작물을 수확하거나 수확하지 않습니다. 그 이후 우측으로 회전합니다.',

                // 값 블록
                robotis_Practice_cm_ir_value: "지정한 번호의 IR 센서 값(범위: 0 ~ 200)",
                robotis_Practice_cm_ir_compare: "지정한 번호의 IR 센서 값과 지정한 값의 비교식이 맞으면 '참', 아니면 '거짓'으로 판단합니다.",
                robotis_Practice_detectFrontObj: "지정한 방향의 적외선센서에 물체가 감지되면 '참', 아니면 '거짓'으로 판단합니다.",
                robotis_Practice_cm_btn_value: "지정한 버튼이 지정한 상태이면 '참', 아니면 '거짓'으로 판단합니다.",
                robotis_Practice_cm_joystick_value: "조이스틱 위치가 지정한 상태이면 '참', 아니면 '거짓'으로 판단합니다.",
                robotis_Practice_mic: "마이크로 감지된 소리의 세기를 데시벨(dB)로 표시합니다.",
                robotis_Practice_detectSound_compare: "소리가 나는 방향이 지정한 방향과 동일하면 '참', 아니면 '거짓'으로 판단합니다.",
                robotis_Practice_imu: "지정한 축의 지정한 가속도센서/자이로센서의 값\n범위: -100 ~ 100",
                robotis_Practice_roll_pitch: "roll/pitch 값\nroll: -180° ~ 180°, pitch: -90° ~ 90°",
                robotis_Practice_distance_value: "지정한 센서값\n거리범위: 0 ~ 1000mm\n조도범위: 0 ~ 100%\n버튼센서: 0(눌리지 않음) / 1(눌림)",
                robotis_Practice_distance_compare: "지정한 센서값의 지정한 수식이 맞으면 '참', 아니면 '거짓'으로 판단합니다.",
                robotis_Practice_environment_value: "지정한 센서값\n움직임센서: 0(움직임 없음) / 1(움직임 있음)\n밝기범위: 0 ~ 100%\n온도범위: -25°C ~ 85°C",
                robotis_Practice_environment_compare: "지정한 센서값의 지정한 수식이 맞으면 '참', 아니면 '거짓'으로 판단합니다.",
                robotis_Practice_line_cross_compare: "지정한 교차로 모양이면 '참', 아니면 '거짓'으로 판단합니다.",
                robotis_Practice_dxl_value: "지정한 모터의 위치 각도값\n범위: -180° ~ 180°",


                // 소리
                robotis_Practice_scale_simple: "지정한 옥타브, 음계, 음표로 연주하기",
                robotis_Practice_scale_advanced: "지정한 옥타브, 음계, 박자로 연주하기",
                robotis_Practice_rest_simple: "지정한 쉼표 쉬기",
                robotis_Practice_rest_advanced: "지정한 박자 쉬기",
                robotis_Practice_beat_per_minute: "연주 빠르기를 지정하기 (BPM)\n범위: 10 ~ 600",
                robotis_Practice_Hello: "로봇이 지정한 말소리를 재생하기",
                robotis_Practice_effectSound: "로봇이 지정한 효과음을 재생하기",
                robotis_Practice_record: "지정번호 보관함에 녹음하여 저장하기",
                robotis_Practice_playRecord: "지정번호 보관함의 녹음음성을 재생하기",

                
                // LCD 제어
                robotis_Practice_screen: "제어기 화면배경의 캐릭터와 표정을 설정",
                robotis_Practice_anim_screen: "제어기 화면 애니메이션의 캐릭터와 표정을 설정",
                robotis_Practice_icon_screen_food_plant: "화면에 [음식/식물]중 특정 아이콘을 표시할 위치와 크기를 설정\nX좌표: -160 ~ 160\nY좌표: -120 ~ 120\n크기: 0 ~ 200",
                robotis_Practice_icon_screen_animal_human: "화면에 [동물/사람]중 특정 아이콘을 표시할 위치와 크기를 설정\nX좌표: -160 ~ 160\nY좌표: -120 ~ 120\n크기: 0 ~ 200",
                robotis_Practice_icon_screen_object_tool: "화면에 [물건/도구]중 특정 아이콘을 표시할 위치와 크기를 설정\nX좌표: -160 ~ 160\nY좌표: -120 ~ 120\n크기: 0 ~ 200",
                robotis_Practice_icon_screen_vehicle_number: "화면에 [탈것/숫자]중 특정 아이콘을 표시할 위치와 크기를 설정\nX좌표: -160 ~ 160\nY좌표: -120 ~ 120\n크기: 0 ~ 200",
                robotis_Practice_text_screen: "화면에 지정한 문구를 표시할 위치와 폰트크기, 색상을 설정\nX좌표: -160 ~ 160\nY좌표: -120 ~ 120",
                robotis_Practice_text_screen_redraw: "화면에 지정한 문구를 새롭게(문구의 배경 지움) 표시할 위치와 색상을 설정\nX좌표: -160 ~ 160\nY좌표: -120 ~ 120\n크기: 0 ~ 200",
                robotis_Practice_pixel: "화면에 표시할 점의 위치와 색상을 설정\nX좌표: -160 ~ 160\nY좌표: -120 ~ 120",
                robotis_Practice_LCDBright: "화면 밝기를 설정\n밝기범위: 1% ~ 100%",
                robotis_Practice_LCDColor: "화면 색상을 설정",
                robotis_Practice_LCD_Flash: "화면이 깜박이는 2가지 색상과 간격을 지정",

                // LED 제어
                robotis_Practice_cm_led: "제어기의 지정한 LED를 켜거나 끄기",
                robotis_Practice_cm_led_pattern: "제어기의 LED의 깜박임 패턴 설정",
                
                // DXL 제어
                robotis_Practice_dxl_set_mode: "지정한 ID의 모터의 동작모드를 설정",
                robotis_Practice_dxl_each_control: "지정한 ID의 모터가 지정한 각도로 지정한 시간(초)동안 움직이도록 설정",
                robotis_Practice_dxl_set_position: "지정한 ID의 모터가 지정한 속도로 지정한 각도로 움직이도록 설정",
                robotis_Practice_dxl_set_rotate: "지정한 ID의 모터의 회전 속도와 방향을 설정",
                robotis_Practice_dxl_set_multiturn_round: "지정한 ID의 모터가 지정한 속도와 방향으로 지정한 바퀴만큼 회전",
                
                // AI Camera 값 블록
                robotis_Practice_huskylens_connection_status: "인공지능 카메라가 연결된 상태이면 '참', 아니면 '거짓'으로 판단합니다.",
                robotis_Practice_huskylens_if_detected: "인공지능 카메라의 LCD화면에 선택한 기호(사각형/화살표)가 표시되면 '참', 아니면 '거짓'으로 판단합니다.",

                robotis_Practice_huskylens_block_value_closest_to_center: "인공지능 카메라 화면 중앙과 가장 가까운 사각형의 X좌표/Y좌표/너비/높이/클래스",
                robotis_Practice_huskylens_arrow_value_closest_to_center: "인공지능 카메라 화면 중앙과 가장 가까운 화살표의 시작점X좌표/시작점Y좌표/끝점X좌표/끝점Y좌표/클래스",
                robotis_Practice_huskylens_number_of_learned_id: "인공지능 카메라가 학습한 번호의 갯수",
                robotis_Practice_huskylens_block_value_of_id: "인공지능 카메라가 감지한 사각형중 지정한 번호의 사각형의 X좌표/Y좌표/너비/높이",
                robotis_Practice_huskylens_arrow_value_of_id: "인공지능 카메라가 감지한 화살표중 지정한 번호의 화살표의 시작점X좌표/시작점Y좌표/끝점X좌표/끝점Y좌표",

                robotis_Practice_huskylens_if_learned_id: "인공지능 카메라가 지정한 번호인 데이터를 학습하였으면 '참', 아니면 '거짓'으로 판단합니다.",
                robotis_Practice_huskylens_if_detected_id_type: "인공지능 카메라가 지정한 번호인 지정한 데이터(사각형/화살표)를 학습하였으면 '참', 아니면 '거짓'으로 판단합니다.",

                // 인공지능 카메라 제어
                robotis_Practice_huskylens_set_mode: "인공지능 카메라의 모드를 설정",
                robotis_Practice_huskylens_print_custom_text: "인공지능 카메라 화면의 지정한 위치에 지정한 문구 출력\nX좌표: -160 ~ 160\nY좌표: -120 ~ 120",
                robotis_Practice_huskylens_clear_custom_text: "인공지능 카메라 화면에 표시한 모든 문구 지우기",
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
                robotis_rgee: "알쥐",
                robotis_rla: "알라",
                robotis_kkokdu: "꼭두",
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

                robotis_flashing1: "깜박임1",
                robotis_flashing2: "깜박임2",
                robotis_flashing3: "깜박임3",
                robotis_flashing4: "깜박임4",
                robotis_flashing5: "깜박임5",
                robotis_flashing6: "깜박임6",
                robotis_flashing7: "깜박임7",
                robotis_flashing8: "깜박임8",
                robotis_flashing9: "깜박임9",
                robotis_moveF: "전진",
                robotis_moveB: "후진",
                robotis_moveL: "좌회전",
                robotis_moveR: "우회전",
                robotis_moveU: "U턴",
                robotis_moveL_in_place: "제자리 좌회전",
                robotis_moveR_in_place: "제자리 우회전",
                robotis_moveU_in_place: "제자리 U턴",
                robotis_moveRG1: "일어서기",
                robotis_moveRG2: "앉기",
                robotis_moveRG3: "발버둥",
                robotis_moveRG4: "발들기",
                robotis_fast: '빠른',
                robotis_normal: '보통',
                robotis_slow: '느린',
                robotis_stop: "정지",
                robotis_roll: "좌우 회전각 (roll)",
                robotis_pitch: "앞뒤 회전각 (pitch)",
                robotis_direction_forward: "전진방향",
                robotis_direction_backward: "후진방향",
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
                robotis_icon_food_plant_1: "우유",
                robotis_icon_food_plant_2: "나무",
                robotis_icon_food_plant_3: "스프",
                robotis_icon_food_plant_4: "케익",
                robotis_icon_food_plant_5: "물",
                robotis_icon_food_plant_6: "주스",
                robotis_icon_food_plant_7: "당근",
                robotis_icon_food_plant_8: "사과",
                robotis_icon_food_plant_9: "오렌지",
                robotis_icon_food_plant_10: "고기",
                robotis_icon_food_plant_11: "화분",
                robotis_icon_food_plant_12: "장미",
                robotis_icon_food_plant_13: "포도",
                robotis_icon_food_plant_14: "감자",
                robotis_icon_food_plant_15: "사탕",
                robotis_icon_food_plant_16: "치즈",
                robotis_icon_food_plant_17: "식빵",
                robotis_icon_food_plant_18: "꽃들",
                robotis_icon_food_plant_19: "커피",
                robotis_icon_food_plant_20: "튤립",
                robotis_icon_food_plant_21: "바나나",
                robotis_icon_food_plant_22: "과일들",
                robotis_icon_food_plant_23: "햄버거",
                robotis_icon_food_plant_24: "피자",
                robotis_icon_animal_human_1: "시바견",
                robotis_icon_animal_human_2: "강아지",
                robotis_icon_animal_human_3: "곰",
                robotis_icon_animal_human_4: "새",
                robotis_icon_animal_human_5: "오리",
                robotis_icon_animal_human_6: "사자",
                robotis_icon_animal_human_7: "호랑이",
                robotis_icon_animal_human_8: "말",
                robotis_icon_animal_human_9: "양",
                robotis_icon_animal_human_10: "상어1(왼쪽)",
                robotis_icon_animal_human_11: "상어1(오른쪽)",
                robotis_icon_animal_human_12: "상어2(왼쪽)",
                robotis_icon_animal_human_13: "상어2(오른쪽)",
                robotis_icon_animal_human_14: "물고기1",
                robotis_icon_animal_human_15: "물고기2",
                robotis_icon_animal_human_16: "물고기3",
                robotis_icon_animal_human_17: "문어",
                robotis_icon_animal_human_18: "원숭이",
                robotis_icon_animal_human_19: "닭",
                robotis_icon_animal_human_20: "돼지",
                robotis_icon_animal_human_21: "사람(살찐)",
                robotis_icon_animal_human_22: "사람(수영복)",
                robotis_icon_animal_human_23: "아기",
                robotis_icon_animal_human_24: "사람(달리는)",
                robotis_icon_animal_human_25: "사람(노래하는)",
                robotis_icon_animal_human_26: "사람(앉은)",
                robotis_icon_animal_human_27: "사람(화난)",
                robotis_icon_animal_human_28: "사람(만세)",
                robotis_icon_animal_human_29: "왕",
                robotis_icon_animal_human_30: "왕자",
                robotis_icon_animal_human_31: "공주",
                robotis_icon_animal_human_32: "요리사",
                robotis_icon_animal_human_33: "의사",
                robotis_icon_animal_human_34: "간호사",
                robotis_icon_object_tool_1: "가방",
                robotis_icon_object_tool_2: "상자",
                robotis_icon_object_tool_3: "머그컵",
                robotis_icon_object_tool_4: "모자(중절모)",
                robotis_icon_object_tool_5: "모자(캡모자)",
                robotis_icon_object_tool_6: "열쇠",
                robotis_icon_object_tool_7: "장난감",
                robotis_icon_object_tool_8: "책",
                robotis_icon_object_tool_9: "곰인형",
                robotis_icon_object_tool_10: "드럼",
                robotis_icon_object_tool_11: "메모장",
                robotis_icon_object_tool_12: "볼펜",
                robotis_icon_object_tool_13: "책상",
                robotis_icon_object_tool_14: "테이블",
                robotis_icon_object_tool_15: "의자",
                robotis_icon_object_tool_16: "침대",
                robotis_icon_object_tool_17: "텐트",
                robotis_icon_object_tool_18: "접시",
                robotis_icon_object_tool_19: "축구공",
                robotis_icon_object_tool_20: "종",
                robotis_icon_object_tool_21: "손목시계",
                robotis_icon_object_tool_22: "신발",
                robotis_icon_object_tool_23: "전등",
                robotis_icon_object_tool_24: "라디오",
                robotis_icon_object_tool_25: "지폐",
                robotis_icon_object_tool_26: "자",
                robotis_icon_object_tool_27: "카메라",
                robotis_icon_object_tool_28: "스푼",
                robotis_icon_object_tool_29: "건반",
                robotis_icon_object_tool_30: "달력",
                robotis_icon_object_tool_31: "칼",
                robotis_icon_object_tool_32: "풍선",
                robotis_icon_object_tool_33: "물통",
                robotis_icon_object_tool_34: "나무막대(세로)",
                robotis_icon_object_tool_35: "나무막대(가로)",
                robotis_icon_object_tool_36: "낚시바늘",
                robotis_icon_vehicle_number_1: "자동차",
                robotis_icon_vehicle_number_2: "버스",
                robotis_icon_vehicle_number_3: "트럭",
                robotis_icon_vehicle_number_4: "지프",
                robotis_icon_vehicle_number_5: "자전거",
                robotis_icon_vehicle_number_6: "전철",
                robotis_icon_vehicle_number_7: "기차",
                robotis_icon_vehicle_number_8: "비행기",
                robotis_icon_vehicle_number_9: "전투기(세로)",
                robotis_icon_vehicle_number_10: "전투기(가로)",
                robotis_icon_vehicle_number_11: "로켓",
                robotis_icon_vehicle_number_12: "어선",
                robotis_icon_vehicle_number_13: "여객선",
                robotis_icon_vehicle_number_14: "잠수항(왼쪽)",
                robotis_icon_vehicle_number_15: "잠수함(오른쪽)",
                robotis_icon_vehicle_number_16: "비행기(왼쪽)",
                robotis_icon_vehicle_number_17: "비행기(오른쪽)",
                robotis_icon_vehicle_number_18: "비행기(윗쪽)",
                robotis_icon_vehicle_number_19: "우주선(왼쪽)",
                robotis_icon_vehicle_number_20: "우주선(오른쪽)",
                robotis_icon_vehicle_number_21: "우주선(윗쪽)",
                robotis_icon_vehicle_number_22: "주사위(1)",
                robotis_icon_vehicle_number_23: "주사위(2)",
                robotis_icon_vehicle_number_24: "주사위(3)",
                robotis_icon_vehicle_number_25: "주사위(4)",
                robotis_icon_vehicle_number_26: "주사위(5)",
                robotis_icon_vehicle_number_27: "주사위(6)",
                robotis_icon_vehicle_number_28: "0",
                robotis_icon_vehicle_number_29: "1",
                robotis_icon_vehicle_number_30: "2",
                robotis_icon_vehicle_number_31: "3",
                robotis_icon_vehicle_number_32: "4",
                robotis_icon_vehicle_number_33: "5",
                robotis_icon_vehicle_number_34: "6",
                robotis_icon_vehicle_number_35: "7",
                robotis_icon_vehicle_number_36: "8",
                robotis_icon_vehicle_number_37: "9",
                robotis_icon_vehicle_number_38: "10",
                robotis_clockwise: "시계방향",
                robotis_counterclockwise: "반시계방향",
                robotis_up: "들기",
                robotis_down: "내리기",
                robotis_if_greater: "크면",
                robotis_if_smaller: "작으면",
                robotis_if_equal: "같으면",
                robotis_front_right: "앞 오른쪽",
                robotis_front_left: "앞 왼쪽",
                robotis_bottom_right: "아래 오른쪽",
                robotis_bottom_left: "아래 왼쪽",
                robotis_side_right: "우측",
                robotis_side_left: "좌측",
                robotis_front_ir_sensor: "적외선센서",
                robotis_distance_sensor: "거리센서",
                robotis_front: "앞",
                robotis_right: "오른쪽",
                robotis_left_wheel: "왼쪽바퀴(52)",
                robotis_right_wheel: "오른쪽바퀴(51)",
                // https://namu.wiki/w/%EC%9D%8C%ED%91%9C
                robotis_beat_sound_8th_note: "8분음표 (♪)",
                robotis_beat_sound_dotted_8th_note: "점8분음표 (♪.)",
                robotis_beat_sound_quarter_note: "4분음표 (♩)",
                robotis_beat_sound_dotted_quarter_note: "점4분음표 (♩.)",
                robotis_beat_sound_half_note: "2분음표 (𝅗𝅥)",
                robotis_beat_sound_dotted_half_note: "점2분음표 (𝅗𝅥.)",
                robotis_beat_sound_whole_note: "온음표 (𝅝)",
                robotis_beat_sound_dotted_note: "점온음표 (𝅝.)",
                robotis_beat_rest_8th_note: "8분쉼표 (𝄾)",
                robotis_beat_rest_dotted_8th_note: "점8분쉼표 (𝄾.)",
                robotis_beat_rest_quarter_note: "4분쉼표 (𝄽)",
                robotis_beat_rest_dotted_quarter_note: "점4분쉼표 (𝄽.)",
                robotis_beat_rest_half_note: "2분쉼표 (𝄼)",
                robotis_beat_rest_dotted_half_note: "점2분쉼표 (𝄼˙)",
                robotis_beat_rest_whole_note: "온쉼표 (𝄻)",
                robotis_beat_rest_dotted_note: "점온쉼표 (𝄻˙)",
                robotis_line_cross_type_0: "|",
                robotis_line_cross_type_1: " (공백)",
                robotis_line_cross_type_5: "🞣",
                robotis_line_cross_type_6: "⏉",
                robotis_line_cross_type_7: "⊣",
                robotis_line_cross_type_8: "⊢",
                robotis_line_cross_type_9: "⏋",
                robotis_line_cross_type_10: "⎾",
                robotis_line_cross_type_11: "¦",
                robotis_line_cross_type_12: "︙",

                robotis_dxl_mode_joint: "관절",
                robotis_dxl_mode_wheel: "바퀴",
                robotis_dxl_mode_multi_turn: "여러바퀴회전",
                robotis_dxl_move_rotate: "회전",
                robotis_dxl_move_stop: "정지",
                robotis_dxl_rotate_cw: "시계방향",
                robotis_dxl_rotate_ccw: "반시계방향",
                robotis_dxl_value_angle: "각도",
                robotis_dxl_value_velocity: "속도",
                robotis_dxl_value_moving: "움직임",

                robotis_connected: "연결",
                robotis_disconnected: "없음",
                robotis_huskylens_mode_face_recognition: "얼굴 인식",
                robotis_huskylens_mode_line_tracking: "라인 인식",
                robotis_huskylens_mode_color_recognition: "색상 인식",
                robotis_huskylens_mode_tag_recognition: "태그 인식",
                robotis_huskylens_mode_object_classification: "사물 분류",
                robotis_huskylens_mode_expression_recognition: '표정 인식',
                robotis_huskylens_target_face: "얼굴",
                robotis_huskylens_target_expression: "표정",
                robotis_huskylens_target_object: "사물",
                robotis_huskylens_target_color: "색상",
                robotis_huskylens_target_tag: "태그",
                robotis_huskylens_target_qr: "QR코드",
                robotis_huskylens_target_block: "사각형",
                robotis_huskylens_target_arrow: "화살표",
                robotis_huskylens_center_block_center_x: "중심 X좌표",
                robotis_huskylens_center_block_center_y: "중심 Y좌표",
                robotis_huskylens_center_block_width: "너비",
                robotis_huskylens_center_block_height: "높이",
                robotis_huskylens_center_leared_id: "클래스",
                robotis_huskylens_center_arrow_origin_x: "시작점 X좌표",
                robotis_huskylens_center_arrow_origin_y: "시작점 Y좌표",
                robotis_huskylens_center_arrow_target_x: "끝점 X좌표",
                robotis_huskylens_center_arrow_target_y: "끝점 Y좌표",

                robotis_plant_ripe: "빨간색으로 잘 익은",
                robotis_plant_unripe: "초록색으로 덜 익은",
                robotis_harvest: "수확하고",
                robotis_not_harvest: "수확하지 않고",
            },
        },
        en: {
            template: {
                // 주행 제어
                robotis_Practice_drive_simple: "Move %2 with velocity %1 %3",
                robotis_Practice_drive_advanced: "Left wheel %2 with velocity %1, right wheel %4 with velocity %3 %5",
                robotis_Practice_drive_seperate: "%1 wheel rotate %3 with velocity %2 %4",
                robotis_Practice_drive_angle: "Both wheels rotate %1 degree %2 %3",
                robotis_Practice_go_distance: "Moves %2 %1 cm %3",
                robotis_Practice_turn_angle: "Rotates %1 degree(s) %2 in place %3",
                robotis_Practice_follow_line: "Follow line with %1 speed %2",
                robotis_Practice_stop_at_cross: "Stop at cross %1 %2",
                robotis_Practice_turn_at_line: "%1 at cross and stop %2",
                robotis_Practice_drive_stop: "Stop %1",

                robotis_Practice_securitybot_init: "Security robot init %1",
                robotis_Practice_securitybot_hi: "Security robot shake up and down %1",
                robotis_Practice_securitybot_alert: "Security robot shake left and right %1",

                robotis_Practice_petbot_happy: "Petbot laugh %1",
                robotis_Practice_petbot_sad: "Petbot angry %1",

                robotis_Practice_farmbot_init: "SmartFarm Robot init %1",
                robotis_Practice_farmbot_seek: "Look for plant %1",
                robotis_Practice_farmbot_plant_type: "If it is %1 plant",
                robotis_Practice_farmbot_harvest_or_not_and_go: "%1 the plant and go back %2",
        
        
        
                // 값 블록
                robotis_Practice_cm_ir_value: "Value of %1 IR Sensor",
                robotis_Practice_cm_ir_compare: "If the number %1 IR sensor value is %3 than %2",
                robotis_Practice_detectFrontObj: "If %2 IR sensor detected an object",
                robotis_Practice_cm_btn_value: "When the controller's %1 button is clicked",
                robotis_Practice_cm_joystick_value: "If the controller's yellow joystick position is %1",
                robotis_Practice_mic: "MIC volume(dB)",
                robotis_Practice_detectSound_compare: "If sound is detected from %1 of the robot",
                robotis_Practice_imu: "%1 axis' %2 value",
                robotis_Practice_roll_pitch: "%1 value of the controller",
                robotis_Practice_environment_value: "%1 value",
                robotis_Practice_environment_compare: "If %1 value is %3 than %2",
                robotis_Practice_line_cross_compare: "If the type of cross is %1",
                robotis_Practice_dxl_value: "The angle of ID %1",

                // 소리
                robotis_Practice_scale_simple: "Play the note %2 as %3 in octave %1 %4",
                robotis_Practice_scale_advanced: "Play the note %2 in octave %1 for %3 beat %4",
                robotis_Practice_rest_simple: "%1 %2",
                robotis_Practice_rest_advanced: "Rest %1 beat %2",
                robotis_Practice_beat_per_minute: "Set playing speed to %1 %2",
                robotis_Practice_Hello: "Robot speaks %1 %2",
                robotis_Practice_effectSound: "Play sound effect %1 %2",
                robotis_Practice_record: "Record to sound slot %1 %2",
                robotis_Practice_playRecord: "Play sound from slot %1 %2",

                
                // LCD 제어
                robotis_Practice_screen: "Set screen expression to %1 %2 %3",
                robotis_Practice_anim_screen: "Set screen animation to %1 %2 %3",
                robotis_Practice_icon_screen_food_plant: "Display %1 from [Food/Plants] at position (%2, %3) in size %4 %5",
                robotis_Practice_icon_screen_animal_human: "Display %1 from [Animal/Human] at position (%2, %3) in size %4 %5",
                robotis_Practice_icon_screen_object_tool: "Display %1 from [Object/Tool] at position (%2, %3) in size %4 %5",
                robotis_Practice_icon_screen_vehicle_number: "Display %1 from [Vehicle/Number] at position (%2, %3) in size %4 %5",
                robotis_Practice_text_screen: "Display %1 in %5 in %4 at (%2, %3) on the screen %6",
                robotis_Practice_text_screen_redraw: "Newly display %1 in %4 at (%2, %3) %5",
                robotis_Practice_pixel: "Display %3 colored dot at (%1, %2) %4",
                robotis_Practice_LCDColor: "Set screen color as %1 %2",
                robotis_Practice_LCD_Flash: "Blink the screen with %1 and %2 at intervals of %3 seconds %4",
                robotis_Practice_LCDBright: "Set screen brightness as %1 %2",

                // LED 제어
                robotis_Practice_cm_led: "%2 the robot's %1 LED %3",
                robotis_Practice_cm_led_pattern: "LED %1 blinks at a %2 speed %3",


                // DXL 제어
                robotis_Practice_dxl_set_mode: "Set ID %1 motor as %2 mode %3",
                robotis_Practice_dxl_each_control: "Move %1th motor %2° for %3 second",
                robotis_Practice_dxl_set_position: "Rotate ID %1 motor to angle %3° at speed %2 %4",
                robotis_Practice_dxl_set_rotate: "%4 ID %1 motor %3 at speed %2 %4",
                robotis_Practice_dxl_set_multiturn_round: "Rotate ID %1 motor %3 times %4 at speed %2 %5",

                
                // AI Camera 값 블록
                robotis_Practice_huskylens_connection_status: "AI Camera: If %1",
                robotis_Practice_huskylens_if_detected: "AI Camera: If %1 is displayed",
        
                robotis_Practice_huskylens_block_value_closest_to_center: "AI Camera: %2 of the %1 closest to the center of the screen",
                robotis_Practice_huskylens_arrow_value_closest_to_center: "AI Camera: %1 of the arrow closest to the center of the screen",
                robotis_Practice_huskylens_number_of_learned_id: "AI Camera: the number of learned ID",
                robotis_Practice_huskylens_block_value_of_id: "AI Camera: %3 of %2 with detected ID %1",
                robotis_Practice_huskylens_arrow_value_of_id: "AI Camera: %2 of arrow with detected ID %1",
        
                robotis_Practice_huskylens_if_learned_id: "AI Camera: If learned data with ID %1",
                robotis_Practice_huskylens_if_detected_id_type: "AI Camera: If learned %2 data with ID %1",
        
                // 인공지능 카메라 제어
                robotis_Practice_huskylens_set_mode: "AI Camera: Set mode to %1 %2",
                robotis_Practice_huskylens_print_custom_text: "AI Camera: Display %3 at screen position (%1, %2) %4",
                robotis_Practice_huskylens_clear_custom_text: "AI Camera: Clear screen text %1",
            },            
            Helper: {
                // 주행 제어
                robotis_Practice_drive_simple: "Drive the robot at the specified speed and direction\nSpeed range: -100 ~ 100\nSpeed unit: %", 
                robotis_Practice_drive_advanced: "Rotate the left and right wheels of the robot at the specified speed and direction\nSpeed range: -100 ~ 100\nSpeed unit: %", 
                robotis_Practice_drive_seperate: "Rotate the specified wheel of the robot at the specified speed and direction\nSpeed range: -100 ~ 100\nSpeed unit: %", 
                robotis_Practice_drive_angle: "Rotate the two wheels of the robot in the specified direction and by the specified angle\nAngle range: -5760 ~ 5760\nAngle unit: degrees", 
                robotis_Practice_go_distance: "Move forward or backward by the specified distance\nDistance range: -1000 ~ 1000\nDistance unit: mm", 
                robotis_Practice_turn_angle: "Rotate in place by the specified angle and direction\nAngle range: -360 ~ 360\nAngle unit: degrees", 
                robotis_Practice_follow_line: "Start following the line at the specified speed", 
                robotis_Practice_stop_at_cross: "Stop at the specified intersection", 
                robotis_Practice_turn_at_line: "Make the specified turn at the intersection and stop", 
                robotis_Practice_drive_stop: "Stop the robot", 

                // 값 블록
                robotis_Practice_cm_ir_value: "IR sensor value of the specified number (range: 0 ~ 200)", 
                robotis_Practice_cm_ir_compare: "If the IR sensor value of the specified number matches the specified value, it is determined as 'true'; otherwise, 'false'.", 
                robotis_Practice_detectFrontObj: "It returns 'true' if an object is detected by the infrared sensor in the specified direction; otherwise, it returns 'false'.", 
                robotis_Practice_cm_btn_value: "If the specified button is clicked, it is determined as 'true'; otherwise, 'false'.", 
                robotis_Practice_cm_joystick_value: "If the joystick position is in the specified state, it is determined as 'true'; otherwise, 'false'.", 
                robotis_Practice_mic: "Displays the intensity of the sound detected by the microphone in decibels (dB).", 
                robotis_Practice_detectSound_compare: "If the direction of the sound matches the specified direction, it is determined as 'true'; otherwise, 'false'.", 
                robotis_Practice_imu: "Value of the specified accelerometer/gyro sensor on the specified axis\nRange: -100 ~ 100", 
                robotis_Practice_roll_pitch: "roll/pitch value\nroll: -180° ~ 180°, pitch: -90° ~ 90°", 
                robotis_Practice_distance_value: "Value of the specified sensor\nDistance range: 0 ~ 1000mm\nIlluminance range: 0 ~ 100%\nButton sensor: 0 (not pressed) / 1 (pressed)", 
                robotis_Practice_distance_compare: "If the specified equation of the specified sensor value is correct, it is determined as 'true'; otherwise, 'false'.", 
                robotis_Practice_environment_value: "Value of the specified sensor\nMotion sensor: 0 (no movement) / 1 (movement)\nBrightness range: 0 ~ 100%\nTemperature range: -25°C ~ 85°C", 
                robotis_Practice_environment_compare: "If the specified equation of the specified sensor value is correct, it is determined as 'true'; otherwise, 'false'.", 
                robotis_Practice_line_cross_compare: "If the specified intersection shape is correct, it is determined as 'true'; otherwise, 'false'.", 
                robotis_Practice_dxl_value: "Position angle value of the specified motor\nRange: -180° ~ 180°", 

                // 소리
                robotis_Practice_scale_simple: "Play with the specified octave, scale, and note", 
                robotis_Practice_scale_advanced: "Play with the specified octave, scale, and beat", 
                robotis_Practice_rest_simple: "Rest for the specified rest note", 
                robotis_Practice_rest_advanced: "Rest for the specified beat", 
                robotis_Practice_beat_per_minute: "Set the playing speed (BPM)\nRange: 10 ~ 600", 
                robotis_Practice_Hello: "Play the specified voice of the robot", 
                robotis_Practice_effectSound: "Play the specified sound effect of the robot", 
                robotis_Practice_record: "Record and save to the specified number storage", 
                robotis_Practice_playRecord: "Play the recorded voice in the specified number storage", 

                // LCD 제어
                robotis_Practice_screen: "Set the character and expression of the controller screen background", 
                robotis_Practice_anim_screen: "Set the character and expression of the controller screen animation", 
                robotis_Practice_icon_screen_food_plant: "Set the position and size of a specific icon in [food/plant] on the screen\nX coordinate: -160 ~ 160\nY coordinate: -120 ~ 120\nSize: 0 ~ 200", 
                robotis_Practice_icon_screen_animal_human: "Set the position and size of a specific icon in [animal/human] on the screen\nX coordinate: -160 ~ 160\nY coordinate: -120 ~ 120\nSize: 0 ~ 200", 
                robotis_Practice_icon_screen_object_tool: "Set the position and size of a specific icon in [object/tool] on the screen\nX coordinate: -160 ~ 160\nY coordinate: -120 ~ 120\nSize: 0 ~ 200", 
                robotis_Practice_icon_screen_vehicle_number: "Set the position and size of a specific icon in [vehicle/number] on the screen\nX coordinate: -160 ~ 160\nY coordinate: -120 ~ 120\nSize: 0 ~ 200", 
                robotis_Practice_text_screen: "Set the position, font size, and color of the specified text on the screen\nX coordinate: -160 ~ 160\nY coordinate: -120 ~ 120", 
                robotis_Practice_text_screen_redraw: "Set the position and color of the specified text to be newly displayed (clearing the background of the text) on the screen\nX coordinate: -160 ~ 160\nY coordinate: -120 ~ 120\nSize: 0 ~ 200", 
                robotis_Practice_pixel: "Set the position and color of the dot to be displayed on the screen\nX coordinate: -160 ~ 160\nY coordinate: -120 ~ 120", 
                robotis_Practice_LCDBright: "Set the screen brightness\nBrightness range: 0% ~ 100%", 
                robotis_Practice_LCDColor: "Set the screen color", 
                robotis_Practice_LCD_Flash: "Specify two colors and the interval for the screen to blink.",

                // LED 제어
                robotis_Practice_cm_led: "Turn the specified LED of the controller on or off", 
                robotis_Practice_cm_led_pattern: "Set the blinking pattern of LEDs of the controller", 

                // DXL 제어
                robotis_Practice_dxl_set_mode: "Set the operating mode of the motor with the specified ID",
                robotis_Practice_dxl_each_control: "Set the motor with the specified ID to move to the specified angle for the specified time (seconds)",
                robotis_Practice_dxl_set_position: "Set the motor with the specified ID to move to the specified angle at the specified speed",
                robotis_Practice_dxl_set_rotate: "Set the rotation speed and direction of the motor with the specified ID",
                robotis_Practice_dxl_set_multiturn_round: "Set the motor with the specified ID to rotate the specified number of turns at the specified speed and direction",

                // AI Camera 값 블록
                robotis_Practice_huskylens_connection_status: "If the AI camera is connected, it is determined as 'true'; otherwise, 'false'.", 
                robotis_Practice_huskylens_if_detected: "If the selected symbol (rectangle/arrow) is displayed on the LCD screen of the AI camera, it is determined as 'true'; otherwise, 'false'.", 

                robotis_Practice_huskylens_block_value_closest_to_center: "X coordinate/Y coordinate/width/height/learning ID of the rectangle closest to the center of the AI camera screen", 
                robotis_Practice_huskylens_arrow_value_closest_to_center: "Starting point X coordinate/starting point Y coordinate/end point X coordinate/end point Y coordinate/learning ID of the arrow closest to the center of the AI camera screen", 
                robotis_Practice_huskylens_number_of_learned_id: "Number of IDs learned by the AI camera", 
                robotis_Practice_huskylens_block_value_of_id: "X coordinate/Y coordinate/width/height of the rectangle with the specified ID detected by the AI camera", 
                robotis_Practice_huskylens_arrow_value_of_id: "Starting point X coordinate/starting point Y coordinate/end point X coordinate/end point Y coordinate of the arrow with the specified ID detected by the AI camera", 

                robotis_Practice_huskylens_if_learned_id: "If the AI camera has learned the data of the specified ID, it is determined as 'true'; otherwise, 'false'.", 
                robotis_Practice_huskylens_if_detected_id_type: "If the AI camera has learned the specified data (rectangle/arrow) of the specified ID, it is determined as 'true'; otherwise, 'false'.", 

                // 인공지능 카메라 제어
                robotis_Practice_huskylens_set_mode: "Set the mode of the AI camera", 
                robotis_Practice_huskylens_print_custom_text: "Print the specified text at the specified position on the AI camera screen\nX coordinate: -160 ~ 160\nY coordinate: -120 ~ 120", 
                robotis_Practice_huskylens_clear_custom_text: "Clear all the text displayed on the AI camera screen", 
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
                robotis_fast: 'Fast',
                robotis_normal: 'Normal',
                robotis_slow: 'Slow',
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
                robotis_huskylens_mode_line_recognition: "Line tracking",
                robotis_huskylens_mode_color_recognition: "Color recognition",
                robotis_huskylens_mode_tag_recognition: "Tag recognition",
                robotis_huskylens_mode_object_classification: "Object classification",
                robotis_huskylens_mode_expression_recognition: 'Expression recognition',
                robotis_huskylens_target_face: "Face",
                robotis_huskylens_target_expression: "Expression",
                robotis_huskylens_target_object: "Object",
                robotis_huskylens_target_color: "Color",
                robotis_huskylens_target_tag: "Tag",
                robotis_huskylens_target_qr: "QR",
                robotis_huskylens_target_block: "Rectangle",
                robotis_huskylens_target_arrow: "Arrow",
                robotis_huskylens_center_block_center_x: "Center X",
                robotis_huskylens_center_block_center_y: "Center Y",
                robotis_huskylens_center_block_width: "Width",
                robotis_huskylens_center_block_height: "Height",
                robotis_huskylens_center_leared_id: "Learned ID",
                robotis_huskylens_center_arrow_origin_x: "Origin X",
                robotis_huskylens_center_arrow_origin_y: "Origin Y",
                robotis_huskylens_center_arrow_target_x: "Target X",
                robotis_huskylens_center_arrow_target_y: "Target Y",

                robotis_plant_ripe: "ripe in red",
                robotis_plant_unripe: "green and unripe",
                robotis_harvest: "Harvest",
                robotis_not_harvest: "Skip harvesting",
            },
        }
    }
};

let dxl_last_valid_value = [];
let rb100_last_valid_value = [];
let bg_color = 0;
let beat_per_minute = 75;
let camera_id_for_use = 0;

const _doevent = ms => new Promise(res => setTimeout(res, ms));
async function wait(nTime) { await _doevent(nTime); }

Entry.Robotis_rb_P_Assembly.getBlocks = function () {
    return {
        robotis_Practice_drive_simple: {
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
                        [Lang.Blocks.robotis_moveL_in_place, '3'],
                        [Lang.Blocks.robotis_moveR_in_place, '4'],

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
                    5,
                    null,
                    null,
                ],
                type: 'robotis_Practice_drive_simple',
            },
            paramsKeyMap: {
                SPEED: 0,
                DIRECTION: 1,
            },
            class: 'robotis_rb100_move',
            isNotFor: ['Robotis_rb_P_Assembly'],
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
                py: ['Robotis.opencm70_RCar_go_simple(%1, %2)'],
            },
        },
        robotis_Practice_drive_stop: {
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
                    null,
                ],
                type: 'robotis_Practice_drive_stop',
            },
            paramsKeyMap: {
                DIRECTION: 0,
            },
            class: 'robotis_rb100_move',
            isNotFor: ['Robotis_rb_P_Assembly'],
            func: function (sprite, script) {
                // instruction / address / length / value / default length
                
                var data_instruction = Entry.Robotis_rb.INSTRUCTION.WRITE;
                var data_address = 710;
                var data_length = 2;
                var data_value = 0;

                var data_sendqueue = [
                    [
                        data_instruction,
                        5200,
                        1,
                        0,
                    ],
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
                py: ['Robotis.opencm70_RCar_stop(%1, %2)'],
            },
        },
        robotis_Practice_drive_advanced: {
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
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.robotis_moveF, '1'],
                        [Lang.Blocks.robotis_moveB, '2'],
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
                        params: ['5'],
                    },
                    null,
                    {
                        type: 'number',
                        params: ['5'],
                    },
                    null,
                ],
                type: 'robotis_Practice_drive_advanced',
            },
            paramsKeyMap: {
                LEFT_SPEED: 0,
                LEFT_DIRECTION: 1,
                RIGHT_SPEED: 2,
                RIGHT_DIRECTION: 3,
            },
            class: 'robotis_rb100_move',
            isNotFor: ['Robotis_rb_P_Assembly'],
            func: function (sprite, script) {
                // instruction / address / length / value / default length
                let leftSpeed = script.getNumberValue('LEFT_SPEED', script);
                let leftDirection = script.getField('LEFT_DIRECTION', script);
                let rightSpeed = script.getNumberValue('RIGHT_SPEED', script);
                let rightDirection = script.getField('RIGHT_DIRECTION', script);
                
                var data_instruction = Entry.Robotis_rb.INSTRUCTION.WRITE;
                var data_address = 710;
                var data_length = 2;
                var data_value = 0;

                if (leftSpeed < -100) leftSpeed = -100;
                else if (leftSpeed > 100) leftSpeed = 100;

                if (rightSpeed < -100) rightSpeed = -100;
                else if (rightSpeed > 100) rightSpeed = 100;

                if (leftDirection == '2') {
                    leftSpeed = -leftSpeed;
                }
                if (rightDirection == '2') {
                    rightSpeed = -rightSpeed;
                }

                if (leftSpeed < 0) {
                    leftSpeed = 256 + leftSpeed;
                }
                if (rightSpeed < 0) {
                    rightSpeed = 256 + rightSpeed;
                }
                
                data_value = leftSpeed + rightSpeed * 256;

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
                py: ['Robotis.opencm70_RCar_go_advanced(%1, %2)'],
            },
        },
        robotis_Practice_drive_seperate: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.robotis_left, '1'],
                        [Lang.Blocks.robotis_right, '0'],
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
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.robotis_direction_forward, '1'],
                        [Lang.Blocks.robotis_direction_backward, '2'],
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
                    {
                        type: 'number',
                        params: ['5'],
                    },
                    null,
                ],
                type: 'robotis_Practice_drive_seperate',
            },
            paramsKeyMap: {
                WHEEL_SIDE: 0,
                WHEEL_SPEED: 1,
                WHEEL_DIRECTION: 2,
            },
            class: 'robotis_rb100_move',
            isNotFor: ['Robotis_rb_P_Assembly'],
            func: function (sprite, script) {
                // instruction / address / length / value / default length
                let wheelSide = script.getNumberValue('WHEEL_SIDE', script);
                let wheelSpeed = script.getNumberValue('WHEEL_SPEED', script);
                let wheelDirection = script.getNumberValue('WHEEL_DIRECTION', script);

                let leftSpeed = 0;
                let rightSpeed = 0;
                var data_instruction = Entry.Robotis_rb.INSTRUCTION.WRITE;
                var data_address = 710;
                var data_length = 2;
                var data_value = 0;
                

                if (wheelSpeed < -100) wheelSpeed = -100;
                else if (wheelSpeed > 100) wheelSpeed = 100;

                wheelSpeed = (wheelSpeed + 256) % 256;
                if (wheelDirection == '2') {
                    wheelSpeed = (256 - wheelSpeed) % 256;
                }

                if (wheelSide == 1) {
                    leftSpeed = wheelSpeed;
                    rightSpeed = 127; // 속도제어 안함
                } else {
                    leftSpeed = 127; // 속도제어 안함
                    rightSpeed = wheelSpeed;
                }

                data_value = leftSpeed + rightSpeed * 256;

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
                    25, //Entry.Robotis_openCM70.delay
                );
            },
            syntax: {
                js: [],
                py: ['Robotis.opencm70_RCar_go_seperate(%1, %2)'],
            },
        },
        robotis_Practice_drive_angle: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.robotis_left, '1'],
                        [Lang.Blocks.robotis_right, '0'],
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
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.robotis_direction_forward, '1'],
                        [Lang.Blocks.robotis_direction_backward, '2'],
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
                    {
                        type: 'number',
                        params: ['15'],
                    },
                    null,
                ],
                type: 'robotis_Practice_drive_angle',
            },
            paramsKeyMap: {
                WHEEL_SIDE: 0,
                WHEEL_ANGLE: 1,
                WHEEL_DIRECTION: 2,
            },
            class: 'robotis_rb100_move',
            isNotFor: ['Robotis_rb_P_Assembly'],
            func: function (sprite, script) {
                // instruction / address / length / value / default length
                let wheelSide = script.getNumberValue('WHEEL_SIDE', script);
                let wheelAngle = script.getNumberValue('WHEEL_ANGLE', script);
                let wheelDirection = script.getNumberValue('WHEEL_DIRECTION', script);
                
                const data_instruction = Entry.Robotis_rb.INSTRUCTION.WRITE;
                let data_address = 580;
                let data_length = 8;
                let angleValue = 0;
                let id = 51 + wheelSide;
                let data_buf = [];
                let i = 0;
                let speed = 150;

                if (wheelDirection == '2') {
                    wheelAngle = -wheelAngle;
                }

                wheelAngle = Math.round(wheelAngle * 4096 / 360);

                if (wheelAngle > 65535) wheelAngle = 65535;
                else if (wheelAngle < -65535) wheelAngle = -65535;

                angleValue = wheelAngle;
                if (wheelAngle < 0) angleValue = 65536 + angleValue;
                
                data_buf.push(id);
                data_buf.push(0);
                data_buf.push(speed % 256);
                data_buf.push(Math.floor(speed/256));
                data_buf.push(angleValue % 256);
                data_buf.push(Math.floor(angleValue/256) % 256);
                if (wheelAngle >= 0) {
                    data_buf.push(0);
                    data_buf.push(0);
                } else {
                    data_buf.push(0xFF);
                    data_buf.push(0xFF);
                }

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
                py: ['Robotis.opencm70_RCar_go_angle(%1, %2)'],
            },
        },
        robotis_Practice_go_distance: {
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
                type: 'robotis_Practice_go_distance',
            },
            
            paramsKeyMap: {
                DISTANCE: 0,
                DIRECTION: 1,
            },
            class: 'robotis_rb100_move',
            isNotFor: ['Robotis_rb_P_Assembly'],
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
                    Entry.Robotis_openCM70.delay + 150 * Math.abs(distance) + 1200
                    //Entry.Robotis_openCM70.delay
                );
            },
            syntax: { js: [], py: ['Robotis.robotis_dxl_each_control(%1)'] },
        },

        robotis_Practice_turn_angle:{
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
                        [Lang.Blocks.robotis_moveL_in_place, '1'],
                        [Lang.Blocks.robotis_moveR_in_place, '-1'],

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
                        params: ['90'],
                    },
                    null,
                ],
                type: 'robotis_Practice_turn_angle',
            },
            
            paramsKeyMap: {
                ANGLE: 0,
                DIRECTION: 1,
            },
            class: 'robotis_rb100_move',
            isNotFor: ['Robotis_rb_P_Assembly'],
            func(entity, script) {
                var angle = script.getNumberValue('ANGLE', script);
                var direction = script.getNumberValue('DIRECTION', script);

                angle *= direction;

                if(angle > 720) {
                    angle = 720;
                } else if(angle < -720) {
                    angle = -720;
                }

                var data_instruction = Entry.Robotis_rb.INSTRUCTION.WRITE;
                var data_address = 270;
                var data_length = 4;
                var data_value = Math.floor(angle);
        
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
                    Entry.Robotis_openCM70.delay + Math.abs(angle) * 16 + 1500
                    //Entry.Robotis_openCM70.delay
                );
            },
            syntax: { js: [], py: ['Robotis.robotis_dxl_each_control(%1)'] },
        },
        robotis_Practice_follow_line: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.robotis_slow, '1'],
                        [Lang.Blocks.robotis_normal, '2'],
                        [Lang.Blocks.robotis_fast, '3'],
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
                type: 'robotis_Practice_follow_line',
            },
            paramsKeyMap: {
                SPEED: 0,
            },
            class: 'robotis_rb100_move',
            isNotFor: ['Robotis_rb_P_Assembly'],
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
        robotis_Practice_stop_at_cross: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.robotis_line_cross_type_5, '5'],
                        [Lang.Blocks.robotis_line_cross_type_6, '6'],
                        [Lang.Blocks.robotis_line_cross_type_7, '7'],
                        [Lang.Blocks.robotis_line_cross_type_8, '8'],
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
                params: [
                    null,
                    null,
                ],
                type: 'robotis_Practice_stop_at_cross',
            },
            paramsKeyMap: {
                CROSS: 0,
            },
            class: 'robotis_rb100_move',
            isNotFor: ['Robotis_rb_P_Assembly'],
            func: async function (sprite, script) {
                // instruction / address / length / value / default length
                var cross_type = script.getNumberValue('CROSS', script);
                var data_address = 5201;

                // max 10 seconds
                for (let i = 0; i < 100; i++) {
                    await Entry.Utils.sleep(100);
                    console.log(Entry.hw.portData[data_address]);
                    if (Entry.hw.portData[data_address] == cross_type) {
                        break;
                    }
                    if (Entry.engine.isState('stop') == true) {
                        break;
                    }
                }

                var data_sendqueue = [
                    [
                        Entry.Robotis_rb.INSTRUCTION.WRITE,
                        5200,
                        1,
                        0,
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
                py: ['Robotis.rb100_stop_at_cross(%1)'],
            },
        },
        robotis_Practice_turn_at_line: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.robotis_moveL_in_place, '0'],
                        [Lang.Blocks.robotis_moveR_in_place, '1'],
                        [Lang.Blocks.robotis_moveU_in_place, '2'],

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
                    null,
                ],
                type: 'robotis_Practice_turn_at_line',
            },
            paramsKeyMap: {
                TURN_TYPE: 0,
            },
            class: 'robotis_rb100_move',
            isNotFor: ['Robotis_rb_P_Assembly'],
            func: function (sprite, script) {
                // instruction / address / length / value / default length
                var turn_type = script.getNumberValue('TURN_TYPE', script);
                
                var data_instruction = Entry.Robotis_rb.INSTRUCTION.WRITE;
                var data_address = 66;
                var data_length = 2;

                var data_sendqueue = [
                    [
                        data_instruction,
                        data_address,
                        data_length,
                        50045 + turn_type,
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
        robotis_Practice_securitybot_init: {
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
                    null,
                ],
                type: 'robotis_Practice_securitybot_init',
            },
            paramsKeyMap: {
            },
            class: 'robotis_rb100_practice_special',
            isNotFor: ['Robotis_rb_P_Assembly'],
            func: function (sprite, script) {
                // instruction / address / length / value / default length
                
                var data_sendqueue = [
                    [
                        Entry.Robotis_rb.INSTRUCTION.WRITE, 2110, 1, 1
                    ]
                ];
                return Entry.Robotis_carCont.postCallReturn(
                    script,
                    data_sendqueue,
                    1100
                );
            },
            syntax: {
                js: [],
                py: ['Robotis.securitybot_init()'],
            },
        },
        robotis_Practice_securitybot_hi: {
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
                    null,
                ],
                type: 'robotis_Practice_securitybot_hi',
            },
            paramsKeyMap: {
            },
            class: 'robotis_rb100_practice_special',
            isNotFor: ['Robotis_rb_P_Assembly'],
            func: function (sprite, script) {
                // instruction / address / length / value / default length
                
                var data_sendqueue = [
                    [
                        Entry.Robotis_rb.INSTRUCTION.WRITE, 2111, 1, 1
                    ]
                ];
                return Entry.Robotis_carCont.postCallReturn(
                    script,
                    data_sendqueue,
                    3000
                );
            },
            syntax: {
                js: [],
                py: ['Robotis.securitybot_hi()'],
            },
        },
        robotis_Practice_securitybot_alert: {
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
                    null,
                ],
                type: 'robotis_Practice_securitybot_alert',
            },
            paramsKeyMap: {
            },
            class: 'robotis_rb100_practice_special',
            isNotFor: ['Robotis_rb_P_Assembly'],
            func: function (sprite, script) {
                // instruction / address / length / value / default length
                
                var data_sendqueue = [
                    [
                        Entry.Robotis_rb.INSTRUCTION.WRITE, 2112, 1, 1
                    ]
                ];
                return Entry.Robotis_carCont.postCallReturn(
                    script,
                    data_sendqueue,
                    3000
                );
            },
            syntax: {
                js: [],
                py: ['Robotis.securitybot_alert()'],
            },
        },
        robotis_Practice_petbot_happy: {
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
                    null,
                ],
                type: 'robotis_Practice_petbot_happy',
            },
            paramsKeyMap: {
            },
            class: 'robotis_rb100_practice_special',
            isNotFor: ['Robotis_rb_P_Assembly'],
            func: function (sprite, script) {
                // instruction / address / length / value / default length
                
                var data_sendqueue = [
                    [
                        Entry.Robotis_rb.INSTRUCTION.WRITE, 2121, 1, 1
                    ]
                ];
                return Entry.Robotis_carCont.postCallReturn(
                    script,
                    data_sendqueue,
                    7100
                );
            },
            syntax: {
                js: [],
                py: ['Robotis.petbot_happy()'],
            },
        },
        robotis_Practice_petbot_sad: {
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
                    null,
                ],
                type: 'robotis_Practice_petbot_sad',
            },
            paramsKeyMap: {
            },
            class: 'robotis_rb100_practice_special',
            isNotFor: ['Robotis_rb_P_Assembly'],
            func: function (sprite, script) {
                // instruction / address / length / value / default length
                
                var data_sendqueue = [
                    [
                        Entry.Robotis_rb.INSTRUCTION.WRITE, 2122, 1, 1
                    ]
                ];
                return Entry.Robotis_carCont.postCallReturn(
                    script,
                    data_sendqueue,
                    2500
                );
            },
            syntax: {
                js: [],
                py: ['Robotis.petbot_sad()'],
            },
        },

        
        robotis_Practice_farmbot_init: {
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
                    null,
                ],
                type: 'robotis_Practice_farmbot_init',
            },
            paramsKeyMap: {
            },
            class: 'robotis_rb100_practice_special',
            isNotFor: ['Robotis_rb_P_Assembly'],
            func: function (sprite, script) {
                // instruction / address / length / value / default length
                
                var data_sendqueue = [
                    [
                        Entry.Robotis_rb.INSTRUCTION.WRITE, 2130, 1, 1
                    ]
                ];
                return Entry.Robotis_carCont.postCallReturn(
                    script,
                    data_sendqueue,
                    3000
                );
            },
            syntax: {
                js: [],
                py: ['Robotis.farmbot_init()'],
            },
        },
        robotis_Practice_farmbot_seek: {
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
                    null,
                ],
                type: 'robotis_Practice_farmbot_seek',
            },
            paramsKeyMap: {
            },
            class: 'robotis_rb100_practice_special',
            isNotFor: ['Robotis_rb_P_Assembly'],
            func: function (sprite, script) {
                // instruction / address / length / value / default length
                
                var data_sendqueue = [
                    [
                        Entry.Robotis_rb.INSTRUCTION.WRITE, 2131, 1, 1
                    ]
                ];
                return Entry.Robotis_carCont.postCallReturn(
                    script,
                    data_sendqueue,
                    200
                );
            },
            syntax: {
                js: [],
                py: ['Robotis.farmbot_seek()'],
            },
        },
        robotis_Practice_farmbot_plant_type: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.robotis_plant_ripe, '1'],
                        [Lang.Blocks.robotis_plant_unripe, '2'],
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
                type: 'robotis_Practice_farmbot_plant_type',
            },
            paramsKeyMap: {
                TYPE: 0,
            },
            class: 'robotis_rb100_practice_special',
            isNotFor: ['Robotis_rb_P_Assembly'],
            func: function (sprite, script) {
                var scope = script.executor.scope;
                var compareValue = script.getNumberValue('TYPE');

                var result = Entry.hw.portData[2134];

                if(result == undefined) {
                    return false;
                }

                return (result == compareValue);
            },
            syntax: {
                js: [],
                py: ['Robotis.farmbot_is_type(%1)'],
            },
        },
        robotis_Practice_farmbot_harvest_or_not_and_go: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.robotis_harvest, '1'],
                        [Lang.Blocks.robotis_not_harvest, '2'],
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
                type: 'robotis_Practice_farmbot_harvest_or_not_and_go',
            },
            paramsKeyMap: {
                ACTION: 0,
            },
            class: 'robotis_rb100_practice_special',
            isNotFor: ['Robotis_rb_P_Assembly'],
            func: function (sprite, script) {
                // instruction / address / length / value / default length

                let action = script.getNumberValue('ACTION', script);
                let address = 2132;
                let wait_time = 6000;

                switch (action)
                {
                    case 1:
                        address = 2132;
                        wait_time = 6500;
                        break;

                    case 2:
                        address = 2133;
                        wait_time = 2100;
                        break;
                }
                
                var data_sendqueue = [
                    [
                        Entry.Robotis_rb.INSTRUCTION.WRITE, address, 1, 1
                    ]
                ];
                return Entry.Robotis_carCont.postCallReturn(
                    script,
                    data_sendqueue,
                    wait_time
                );
            },
            syntax: {
                js: [],
                py: ['Robotis.farmbot_harvest_or_not_and_go(%1)'],
            },
        },

        


        robotis_Practice_cm_ir_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.robotis_front_right, '360'],
                        [Lang.Blocks.robotis_front_left, '362'],
                        [Lang.Blocks.robotis_bottom_right, '364'],
                        [Lang.Blocks.robotis_bottom_left, '366'],
                        [Lang.Blocks.robotis_side_right, '368'],
                        [Lang.Blocks.robotis_side_left, '370'],
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
                type: 'robotis_Practice_cm_ir_value',
            },
            paramsKeyMap: {
                VALUE: 0,
            },
            class: 'robotis_rb100_custom',
            isNotFor: ['Robotis_rb_P_Assembly'],
            func: function (sprite, script) {
                var scope = script.executor.scope;

                var data_default_address = script.getNumberValue('VALUE');

                var result = Entry.hw.portData[data_default_address];
                if (result == undefined)
                {
                    result = rb100_last_valid_value[data_default_address];
                }
                else
                {
                    rb100_last_valid_value[data_default_address] = result;
                }
                if(typeof result == 'undefined') {
                    return 0;
                }
                return Math.round((result % 65536) / 2);
            },
            syntax: {
                js: [],
                py: ['Robotis.opencm70_cm_ir_value(%1)'],
            },
        },
        robotis_Practice_cm_ir_compare: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.robotis_front_right, '360'],
                        [Lang.Blocks.robotis_front_left, '362'],
                        [Lang.Blocks.robotis_bottom_right, '364'],
                        [Lang.Blocks.robotis_bottom_left, '366'],
                        [Lang.Blocks.robotis_side_right, '368'],
                        [Lang.Blocks.robotis_side_left, '370'],
                    ],
                    value: '360',
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
                        [Lang.Blocks.robotis_if_greater, '0'],
                        [Lang.Blocks.robotis_if_smaller, '1'],
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
                    50,
                    null,
                ],
                type: 'robotis_Practice_cm_ir_compare',
            },
            paramsKeyMap: {
                VALUE: 0,
                COMPARE_VAL: 1,
                COMPARE_OP: 2,
            },
            class: 'robotis_rb100_custom',
            isNotFor: ['Robotis_rb_P_Assembly'],
            func: function (sprite, script) {
                var scope = script.executor.scope;
                var data_address = script.getNumberValue('VALUE');
                var compareValue = script.getNumberValue('COMPARE_VAL');
                var compareOP = script.getNumberValue('COMPARE_OP');
                
                var result = Entry.hw.portData[data_address];

                if(result == undefined) {
                    return false;
                }

                result = Math.round((result % 65536) / 2);

                switch(compareOP) {
                    case 0:
                        return result > compareValue;
                    case 1:
                        return result < compareValue;
                    default:
                        return false;
                }
               
            },
            syntax: {
                js: [],
                py: ['Robotis.robotis_RB_cm_ir_compare(%1)'],
            },
        },
        robotis_Practice_detectFrontObj:{
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.robotis_front_ir_sensor, '0'],
                        [Lang.Blocks.robotis_distance_sensor, '1'],
                    ],
                    value: '0',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.robotis_front, '0'],
                        [Lang.Blocks.robotis_right, '1'],
                        [Lang.Blocks.robotis_left, '2'],
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
                type: 'robotis_Practice_detectFrontObj',
            },
            paramsKeyMap: {
                SENSOR: 0,
                DIRECTION: 1,
            },
            class: 'robotis_rb100_custom',
            isNotFor: ['Robotis_rb_P_Assembly'],
            func: function (sprite, script) {
                var scope = script.executor.scope;

                // instruction / address / length / value / default length
                var data_instruction = Entry.Robotis_rb.INSTRUCTION.READ;
                var data_address = 360;
                var data_length = 4;
                var data_value = 0;

                var data_default_address = 0;
                var data_default_length = 0;
                let sensorType = script.getNumberValue('SENSOR');
                let direction = script.getNumberValue('DIRECTION');
                let ir_1 = 0;
                let ir_2 = 0;

                if (sensorType == 0)
                {
                    if (direction == 0) {
                        ir_1 = Entry.hw.portData[360];
                        ir_2 = Entry.hw.portData[362];
                        if (ir_1 == undefined) ir_1 = 0;
                        if (ir_2 == undefined) ir_2 = 0;
                        return ir_1 > 100 || ir_2 > 100;
                    } else if (direction == 1) {
                        ir_1 = Entry.hw.portData[368];
                        if (ir_1 == undefined) ir_1 = 0;
                        return ir_1 > 100;
                    } else if (direction == 2) {
                        ir_1 = Entry.hw.portData[370];
                        if (ir_1 == undefined) ir_1 = 0;
                        return ir_1 > 100;
                    }
                } else if (sensorType == 1) {
                    data_instruction = Entry.Robotis_rb.INSTRUCTION.BYPASS_READ;
                    data_address = 25;
                    data_length = 2;
                    data_value = 110; // id
                    
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
                                return false;
                            }
                            return Entry.hw.sendQueue.prevResult < 200;
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
                        return false;
                    } else {
                        return result < 200;
                    }
                }
            },
            syntax: {
                js: [],
                py: ['Robotis.RB_detectFrontObj()'],
            },
        },
        robotis_Practice_cm_btn_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.robotis_blue, '47'],
                        [Lang.Blocks.robotis_red, '44'],
                    ],
                    value: '47',
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
                type: 'robotis_Practice_cm_btn_value',
            },
            paramsKeyMap: {
                VALUE: 0,
            },
            class: 'robotis_rb100_custom',
            isNotFor: ['Robotis_rb_P_Assembly'],
            func: function (sprite, script) {
                var scope = script.executor.scope;
                var data_address = script.getNumberValue('VALUE');
                var compareValue = 1;

                var result = Entry.hw.portData[data_address];
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
        robotis_Practice_cm_joystick_value: {
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
                type: 'robotis_Practice_cm_joystick_value',
            },
            paramsKeyMap: {
                COMPARE_VAL: 0,
            },
            class: 'robotis_rb100_custom',
            isNotFor: ['Robotis_rb_P_Assembly'],
            func: function (sprite, script) {
                var scope = script.executor.scope;
                var data_address = 50;
                var compareValue = script.getNumberValue('COMPARE_VAL', script);

                var result = Entry.hw.portData[data_address];
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
        robotis_Practice_mic:{
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
                type: 'robotis_Practice_mic',
            },
            paramsKeyMap: {
                VALUE: 0,
            },
            class: 'robotis_rb100_custom',
            isNotFor: ['Robotis_rb_P_Assembly'],
            func: async function (sprite, script) {
                var scope = script.executor.scope;
                var data_address = 119;

                var result = Entry.hw.portData[data_address];

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
        robotis_Practice_detectSound_compare:{
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
                type: 'robotis_Practice_detectSound_compare',
            },
            paramsKeyMap: {
                VALUE: 0,
            },
            class: 'robotis_rb100_custom',
            isNotFor: ['Robotis_rb_P_Assembly'],
            func: function (sprite, script) {
                var scope = script.executor.scope;
                var data_address = 5031;
                var compareValue = script.getNumberValue('VALUE');


                var result = Entry.hw.portData[data_address];
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
        robotis_Practice_imu:{
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
                type: 'robotis_Practice_imu',
            },
            paramsKeyMap: {
                AXIS: 0,
                MODE: 1,
            },
            class: 'robotis_rb100_custom',
            isNotFor: ['Robotis_rb_P_Assembly'],
            func: function (sprite, script) {
                var scope = script.executor.scope;
                var data_address = script.getField('AXIS', script) - script.getField('MODE', script);

                var result = Entry.hw.portData[data_address];

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
        robotis_Practice_roll_pitch:{
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.robotis_roll, '70'],//72
                        [Lang.Blocks.robotis_pitch, '88'],//74
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
                type: 'robotis_Practice_roll_pitch',
            },
            paramsKeyMap: {
                AXIS: 0,
            },
            class: 'robotis_rb100_custom',
            isNotFor: ['Robotis_rb_P_Assembly'],
            func: function (sprite, script) {
                var scope = script.executor.scope;
                var data_address = script.getNumberValue('AXIS');

                var result = Entry.hw.portData[data_address];

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
        robotis_Practice_distance_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.robotis_sensing_distance, '25'],
                        [Lang.Blocks.robotis_sensing_button, '24'],
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
                ],
                type: 'robotis_Practice_distance_value',
            },
            paramsKeyMap: {
                ADDR: 0,
            },
            class: 'robotis_rb100_custom',
            isNotFor: ['Robotis_rb_P_Assembly'],
            func: function (sprite, script) {
                var scope = script.executor.scope;

                // instruction / address / length / value / default length
                var data_instruction = Entry.Robotis_rb.INSTRUCTION.BYPASS_READ;
                var data_address = 0;
                var data_length = 2;
                var data_value = 110;

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
        robotis_Practice_distance_compare: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.robotis_sensing_distance, '25'],
                        [Lang.Blocks.robotis_sensing_button, '24'],
                    ],
                    value: '25',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Block',
                    accept: 'string',
                    value: '',
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.robotis_if_greater, '0'],
                        [Lang.Blocks.robotis_if_smaller, '1'],
                        [Lang.Blocks.robotis_if_equal, '2'],
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
                    {
                        type: 'number',
                        params: [0]
                    },
                    null,
                ],
                type: 'robotis_Practice_distance_compare',
            },
            paramsKeyMap: {
                ADDR: 0,
                COMPARE_VAL: 1,
                COMPARE_OP: 2,
            },
            class: 'robotis_rb100_custom',
            isNotFor: ['Robotis_rb_P_Assembly'],
            func: function (sprite, script) {
                var scope = script.executor.scope;

                // instruction / address / length / value / default length
                var data_instruction = Entry.Robotis_rb.INSTRUCTION.BYPASS_READ;
                var data_address = 0;
                var data_length = 2;
                var data_id = 110;

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
        robotis_Practice_environment_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
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
                    null
                ],
                type: 'robotis_Practice_environment_value',
            },
            paramsKeyMap: {
                ADDR: 0,
            },
            class: 'robotis_rb100_custom',
            isNotFor: ['Robotis_rb_P_Assembly'],
            func: function (sprite, script) {
                var scope = script.executor.scope;
                var data_address = script.getNumberValue('ADDR');
                let device_id_name = "";

                switch (data_address) {
                    case 28:
                        device_id_name = "PIR_100_TEMPERATURE";
                        break;
                    
                    case 29:
                        device_id_name = "PIR_100_HUMIDITY";
                        break;
                        
                    case 30:
                        device_id_name = "PIR_100_BRIGHTNESS";
                        break;

                    case 27:
                        device_id_name = "PIR_100_PIR";
                        break;
                }

                var result = Entry.hw.portData[device_id_name];

                if(typeof result == 'undefined') {

                    return 0;
                }
                else {
                    if (device_id_name == "PIR_100_TEMPERATURE") {
                        result = result % 256;
                        if (result > 128) {
                            result = result - 256;
                        }
                    }
                }
                return result;
            },
            syntax: {
                js: [],
                py: ['Robotis.opencm70_cm_environment_value(%1)'],
            },
        },
        robotis_Practice_environment_compare: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
            statements: [],
            params: [
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
                    type: 'Block',
                    accept: 'string',
                    value: 'asdfasdf',
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.robotis_if_greater, '0'],
                        [Lang.Blocks.robotis_if_smaller, '1'],
                        [Lang.Blocks.robotis_if_equal, '2'],
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
                    {
                        type: 'number',
                        params: [0]
                    },
                    null,
                ],
                type: 'robotis_Practice_environment_compare',
            },
            paramsKeyMap: {
                ADDR: 0,
                COMPARE_VAL: 1,
                COMPARE_OP: 2,
            },
            class: 'robotis_rb100_custom',
            isNotFor: ['Robotis_rb_P_Assembly'],
            func: function (sprite, script) {
                var scope = script.executor.scope;

                var data_address = script.getNumberValue('ADDR');
                var compareValue = script.getNumberValue('COMPARE_VAL');
                var compareOP = script.getNumberValue('COMPARE_OP');

                let device_id_name = "";

                switch (data_address) {
                    case 28:
                        device_id_name = "PIR_100_TEMPERATURE";
                        break;
                    
                    case 29:
                        device_id_name = "PIR_100_HUMIDITY";
                        break;
                        
                    case 30:
                        device_id_name = "PIR_100_BRIGHTNESS";
                        break;

                    case 27:
                        device_id_name = "PIR_100_PIR";
                        break;
                }

                var result = Entry.hw.portData[device_id_name];
                if (typeof result == 'undefined') {
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
        robotis_Practice_dxl_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.robotis_left_wheel, '52'],
                        [Lang.Blocks.robotis_right_wheel, '51'],
                        ["ID 1", '1'],
                        ["ID 2", '2'],
                        ["ID 3", '3'],
                        ["ID 4", '4'],
                        ["ID 5", '5'],
                        ["ID 6", '6'],
                        ["ID 7", '7'],
                        ["ID 8", '8'],
                    ],
                    value: '52',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.robotis_dxl_value_angle, '1'],
                        [Lang.Blocks.robotis_dxl_value_velocity, '2'],
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
                    52,
                    null,
                ],
                type: 'robotis_Practice_dxl_value',
            },
            paramsKeyMap: {
                ID: 0,
                TYPE: 1,
            },
            class: 'robotis_rb100_custom',
            isNotFor: ['Robotis_rb_P_Assembly'],
            func: function (sprite, script) {
                var scope = script.executor.scope;

                var dxl_id = script.getNumberValue('ID');
                //var data_type = script.getNumberValue('TYPE');
                let device_id_name = `DXL_POS_${dxl_id}`;

                var result = Entry.hw.portData[device_id_name];

                if (typeof result == 'undefined') {
                    return 0;
                }
                result = 180 - Math.round(result * 360 / 4096);
                while (result < -180) result += 360;
                while (result > 180) result -= 360;

                return result;
            },
            syntax: {
                js: [],
                py: ['Robotis.get_dxl_value(%1)'],
            },
        },
        robotis_Practice_line_cross_compare:{
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.robotis_line_cross_type_5, '5'],
                        [Lang.Blocks.robotis_line_cross_type_6, '6'],
                        [Lang.Blocks.robotis_line_cross_type_7, '7'],
                        [Lang.Blocks.robotis_line_cross_type_8, '8'],
                    ],
                    value: '5',
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
                type: 'robotis_Practice_line_cross_compare',
            },
            paramsKeyMap: {
                VALUE: 0,
            },
            class: 'robotis_rb100_custom',
            isNotFor: ['Robotis_rb_P_Assembly'],
            func: function (sprite, script) {
                var scope = script.executor.scope;
                var data_address = 5201;
                var compareValue = script.getNumberValue('VALUE');

                var result = Entry.hw.portData[data_address];

                if(result == undefined) {
                    return false;
                }


                return result == compareValue;
            },
            syntax: {
                js: [],
                py: ['Robotis.RB_line_cross_compare(%1)'],
            },
        },



        
        robotis_Practice_screen: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.robotis_kkokdu, '3'],
                        [Lang.Blocks.robotis_rla, '2'],
                        [Lang.Blocks.robotis_rgee, '0'],
                    ],
                    value: '3',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.robotis_car_anim01, '2817'],
                        [Lang.Blocks.robotis_car_anim02, '2818'],
                        [Lang.Blocks.robotis_car_anim03, '2819'],
                        [Lang.Blocks.robotis_car_anim04, '2820'],
                        [Lang.Blocks.robotis_car_anim05, '2821'],

                        [Lang.Blocks.robotis_car_anim06, '2822'],
                        //[Lang.Blocks.robotis_car_anim07, '2823'], 
                        [Lang.Blocks.robotis_car_anim08, '2824'],
                        [Lang.Blocks.robotis_car_anim09, '2825'],
                        [Lang.Blocks.robotis_car_anim10, '2826'],

                        [Lang.Blocks.robotis_car_anim11, '2827'],
                        [Lang.Blocks.robotis_car_anim12, '2828'], 
                        //[Lang.Blocks.robotis_car_anim13, '2829'],
                        [Lang.Blocks.robotis_car_anim14, '2830'],
                        [Lang.Blocks.robotis_car_anim15, '2831'],

                        [Lang.Blocks.robotis_car_anim16, '2832'],
                        [Lang.Blocks.robotis_car_anim17, '2833'], 
                        [Lang.Blocks.robotis_car_anim18, '2834'],
                        [Lang.Blocks.robotis_car_anim19, '2835'],
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
                params: [
                    null,
                    null,
                ],
                type: 'robotis_Practice_screen',
            },
            paramsKeyMap: {
                ROBOT_TYPE: 0,
                BACKGROUND: 1,
            },
            class: 'robotis_rb100_lcd',
            isNotFor: ['Robotis_rb_P_Assembly'],
            func: function (sprite, script) {
                // instruction / address / length / value / default length
                var robotType = script.getNumberValue('ROBOT_TYPE', script);
                var screenValue = script.getNumberValue('BACKGROUND', script);
                
                var data_instruction = Entry.Robotis_rb.INSTRUCTION.WRITE;
                var data_address = 163;
                var data_length = 2;
                var data_value = screenValue + robotType * 256;

                if (robotType == 0) {
                    switch (screenValue) {
                        case 2817:
                            data_value = 2841;
                            break;
                        
                        case 2818:
                            data_value = 2842;
                            break;
                        
                        case 2819:
                            data_value = 2820;
                            break;
                            
                        case 2820:
                            data_value = 2817;
                            break;
                        
                        case 2821:
                            data_value = 2819;
                            break;
                        
                        case 2822:
                            data_value = 2818;
                            break;
                        
                        //case 2823:
                        //    break;
                        
                        case 2824:
                            data_value = 2826;
                            break;
                        
                        case 2825:
                            data_value = 2836;
                            break;
                        
                        case 2826:
                            data_value = 2837;
                            break;
                        
                        case 2827:
                            data_value = 2843;
                            break;
                        
                        case 2828:
                            data_value = 2831;
                            break;
                        
                        //case 2829:
                        //    break;
                        
                        case 2830:
                            data_value = 2833;
                            break;
                            
                        case 2831:
                            data_value = 2834;
                            break;
                            
                        case 2832:
                            data_value = 2828;
                            break;
                            
                        case 2833:
                            data_value = 2827;
                            break;
                            
                        case 2834:
                            data_value = 2829;
                            break;
                            
                        case 2835:
                            data_value = 2840;
                            break;
                        
                        default:
                            data_value = 2841;
                            break;
                    }
                }

                var data_sendqueue = [
                    [data_instruction, data_address, data_length, data_value],
                    [Entry.Robotis_rb.INSTRUCTION.WRITE, 162, 1, 1]
                ];
              


                return Entry.Robotis_carCont.postCallReturn(
                    script,
                    data_sendqueue,
                    Entry.Robotis_openCM70.delay + 200
                );
            },
            syntax: { js: [], py: ['Robotis.opencm70_cm_screen(%1)'] },
        },

        robotis_Practice_anim_screen: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.robotis_kkokdu, '1'],
                        [Lang.Blocks.robotis_rla, '0'],
                        [Lang.Blocks.robotis_rgee, '-1'],
                    ],
                    value: '1',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.robotis_car_anim01, '30978'],
                        [Lang.Blocks.robotis_car_anim02, '30981'],
                        //[Lang.Blocks.robotis_car_anim03, '30982'],
                        [Lang.Blocks.robotis_car_anim04, '30983'],
                        [Lang.Blocks.robotis_car_anim05, '30984'],

                        [Lang.Blocks.robotis_car_anim06, '30985'],
                        [Lang.Blocks.robotis_car_anim07, '30986'], 
                        [Lang.Blocks.robotis_car_anim08, '30987'],
                        [Lang.Blocks.robotis_car_anim09, '30988'],
                        [Lang.Blocks.robotis_car_anim10, '30989'],

                        [Lang.Blocks.robotis_car_anim11, '30990'],
                        [Lang.Blocks.robotis_car_anim12, '30991'], 
                        //[Lang.Blocks.robotis_car_anim13, '30992'],
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
                params: [
                    null,
                    null,
                ],
                type: 'robotis_Practice_anim_screen',
            },
            paramsKeyMap: {
                ROBOT_TYPE: 0,
                BACKGROUND: 1,
            },
            class: 'robotis_rb100_lcd',
            isNotFor: ['Robotis_rb_P_Assembly'],
            func: function (sprite, script) {
                // instruction / address / length / value / default length
                var robotType = script.getNumberValue('ROBOT_TYPE', script);
                var screenValue = script.getNumberValue('BACKGROUND', script);
                
                var data_instruction = Entry.Robotis_rb.INSTRUCTION.WRITE;
                var data_address = 163;
                var data_length = 2;
                var data_value = screenValue;

                if (robotType >= 0) {
                    data_value += 256 * robotType;
                } else {
                    switch (screenValue) {
                        case 30978:
                            data_value = 30724;
                            break;
                        
                        case 30981:
                            data_value = 30761;
                            break;
                        
                        //case 30982:
                        //    break;
                            
                        case 30983:
                            data_value = 30748;
                            break;
                        
                        case 30984:
                            data_value = 30750;
                            break;
                        
                        case 30985:
                            data_value = 30749;
                            break;
                        
                        //case 30986:
                        //    break;
                        
                        case 30987:
                            data_value = 30739;
                            break;
                        
                        case 30988:
                            data_value = 30751;
                            break;
                        
                        case 30989:
                            data_value = 30752;
                            break;
                        
                        case 30990:
                            data_value = 30762;
                            break;
                        
                        case 30991:
                            data_value = 30736;
                            break;
                        
                        //case 30992:
                        //    break;
                        
                        case 30993:
                            data_value = 30742;
                            break;
                            
                        case 30994:
                            data_value = 30743;
                            break;
                            
                        case 30995:
                            data_value = 30734;
                            break;
                            
                        case 30996:
                            data_value = 30733;
                            break;
                            
                        case 30997:
                            data_value = 30732;
                            break;
                            
                        case 30998:
                            data_value = 30760;
                            break;
                        
                        default:
                            data_value = 30724;
                            break;
                    }
                }

                var data_sendqueue = [
                    [data_instruction, data_address, data_length, data_value],
                    [Entry.Robotis_rb.INSTRUCTION.WRITE, 162, 1, 1]
                ];
              


                return Entry.Robotis_carCont.postCallReturn(
                    script,
                    data_sendqueue,
                    Entry.Robotis_openCM70.delay //+ 1000
                );
            },
            syntax: { js: [], py: ['Robotis.opencm70_cm_screen(%1)'] },
        },
        robotis_Practice_icon_screen_food_plant: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.robotis_icon_food_plant_1, '10496'],
                        [Lang.Blocks.robotis_icon_food_plant_2, '10497'],
                        [Lang.Blocks.robotis_icon_food_plant_3, '10498'],
                        [Lang.Blocks.robotis_icon_food_plant_4, '10499'],
                        [Lang.Blocks.robotis_icon_food_plant_5, '10500'],
                        [Lang.Blocks.robotis_icon_food_plant_6, '10501'],
                        [Lang.Blocks.robotis_icon_food_plant_7, '10502'],
                        [Lang.Blocks.robotis_icon_food_plant_8, '10503'],
                        [Lang.Blocks.robotis_icon_food_plant_9, '10504'],
                        [Lang.Blocks.robotis_icon_food_plant_10, '10505'],
                        [Lang.Blocks.robotis_icon_food_plant_11, '10506'],
                        [Lang.Blocks.robotis_icon_food_plant_12, '10507'],
                        [Lang.Blocks.robotis_icon_food_plant_13, '10508'],
                        [Lang.Blocks.robotis_icon_food_plant_14, '10509'],
                        [Lang.Blocks.robotis_icon_food_plant_15, '10510'],
                        [Lang.Blocks.robotis_icon_food_plant_16, '10511'],
                        [Lang.Blocks.robotis_icon_food_plant_17, '10512'],
                        [Lang.Blocks.robotis_icon_food_plant_18, '10513'],
                        [Lang.Blocks.robotis_icon_food_plant_19, '10514'],
                        [Lang.Blocks.robotis_icon_food_plant_20, '10515'],
                        [Lang.Blocks.robotis_icon_food_plant_21, '10516'],
                        [Lang.Blocks.robotis_icon_food_plant_22, '10517'],
                        [Lang.Blocks.robotis_icon_food_plant_23, '10518'],
                        [Lang.Blocks.robotis_icon_food_plant_24, '10519'],
                    ],
                    value: '10496',
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
                    50,
                    null,
                ],
                type: 'robotis_Practice_icon_screen_food_plant',
            },
            paramsKeyMap: {
                ICON: 0,
                X: 1,
                Y: 2,
                SIZE: 3,
            },
            class: 'robotis_rb100_lcd',
            isNotFor: ['Robotis_rb_P_Assembly'],
            func: function (sprite, script) {
                // instruction / address / length / value / default length
                var iconNum = script.getField('ICON', script);
                var x = script.getNumberValue('X', script);
                var y = script.getNumberValue('Y', script);
                var size = script.getNumberValue('SIZE', script) * 2;
                
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
                    Entry.Robotis_openCM70.delay + 200
                );
            },
            syntax: {
                js: [],
                py: ['Robotis.RB_rsp_screen(%1,%2,%3,%4)'],
            },
        },
        robotis_Practice_icon_screen_animal_human: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.robotis_icon_animal_human_1, '10752'],
                        [Lang.Blocks.robotis_icon_animal_human_2, '10753'],
                        [Lang.Blocks.robotis_icon_animal_human_3, '10754'],
                        [Lang.Blocks.robotis_icon_animal_human_4, '10755'],
                        [Lang.Blocks.robotis_icon_animal_human_5, '10756'],
                        [Lang.Blocks.robotis_icon_animal_human_6, '10757'],
                        [Lang.Blocks.robotis_icon_animal_human_7, '10758'],
                        [Lang.Blocks.robotis_icon_animal_human_8, '10759'],
                        [Lang.Blocks.robotis_icon_animal_human_9, '10760'],
                        [Lang.Blocks.robotis_icon_animal_human_10, '11787'],
                        [Lang.Blocks.robotis_icon_animal_human_11, '11788'],
                        [Lang.Blocks.robotis_icon_animal_human_12, '11789'],
                        [Lang.Blocks.robotis_icon_animal_human_13, '11790'],
                        [Lang.Blocks.robotis_icon_animal_human_14, '11805'],
                        [Lang.Blocks.robotis_icon_animal_human_15, '11806'],
                        [Lang.Blocks.robotis_icon_animal_human_16, '11807'],
                        [Lang.Blocks.robotis_icon_animal_human_17, '11808'],
                        [Lang.Blocks.robotis_icon_animal_human_18, '10761'],
                        [Lang.Blocks.robotis_icon_animal_human_19, '10762'],
                        [Lang.Blocks.robotis_icon_animal_human_20, '10763'],
                        [Lang.Blocks.robotis_icon_animal_human_21, '10764'],
                        [Lang.Blocks.robotis_icon_animal_human_22, '10765'],
                        [Lang.Blocks.robotis_icon_animal_human_23, '10766'],
                        [Lang.Blocks.robotis_icon_animal_human_24, '10767'],
                        [Lang.Blocks.robotis_icon_animal_human_25, '10768'],
                        [Lang.Blocks.robotis_icon_animal_human_26, '10769'],
                        [Lang.Blocks.robotis_icon_animal_human_27, '10770'],
                        [Lang.Blocks.robotis_icon_animal_human_28, '10771'],
                        [Lang.Blocks.robotis_icon_animal_human_29, '10772'],
                        [Lang.Blocks.robotis_icon_animal_human_30, '10773'],
                        [Lang.Blocks.robotis_icon_animal_human_31, '10774'],
                        [Lang.Blocks.robotis_icon_animal_human_32, '10775'],
                        [Lang.Blocks.robotis_icon_animal_human_33, '10776'],
                        [Lang.Blocks.robotis_icon_animal_human_34, '10777'],
                    ],
                    value: '10752',
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
                    50,
                    null,
                ],
                type: 'robotis_Practice_icon_screen_animal_human',
            },
            paramsKeyMap: {
                ICON: 0,
                X: 1,
                Y: 2,
                SIZE: 3,
            },
            class: 'robotis_rb100_lcd',
            isNotFor: ['Robotis_rb_P_Assembly'],
            func: function (sprite, script) {
                // instruction / address / length / value / default length
                var iconNum = script.getField('ICON', script);
                var x = script.getNumberValue('X', script);
                var y = script.getNumberValue('Y', script);
                var size = script.getNumberValue('SIZE', script) * 2;
                
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
                    Entry.Robotis_openCM70.delay + 200
                );
            },
            syntax: {
                js: [],
                py: ['Robotis.RB_rsp_screen(%1,%2,%3,%4)'],
            },
        },
        robotis_Practice_icon_screen_object_tool: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.robotis_icon_object_tool_1, '11008'],
                        [Lang.Blocks.robotis_icon_object_tool_2, '11009'],
                        [Lang.Blocks.robotis_icon_object_tool_3, '11010'],
                        [Lang.Blocks.robotis_icon_object_tool_4, '11011'],
                        [Lang.Blocks.robotis_icon_object_tool_5, '11012'],
                        [Lang.Blocks.robotis_icon_object_tool_6, '11013'],
                        [Lang.Blocks.robotis_icon_object_tool_7, '11014'],
                        [Lang.Blocks.robotis_icon_object_tool_8, '11015'],
                        [Lang.Blocks.robotis_icon_object_tool_9, '11016'],
                        [Lang.Blocks.robotis_icon_object_tool_10, '11017'],
                        [Lang.Blocks.robotis_icon_object_tool_11, '11018'],
                        [Lang.Blocks.robotis_icon_object_tool_12, '11019'],
                        [Lang.Blocks.robotis_icon_object_tool_13, '11020'],
                        [Lang.Blocks.robotis_icon_object_tool_14, '11021'],
                        [Lang.Blocks.robotis_icon_object_tool_15, '11022'],
                        [Lang.Blocks.robotis_icon_object_tool_16, '11023'],
                        [Lang.Blocks.robotis_icon_object_tool_17, '11024'],
                        [Lang.Blocks.robotis_icon_object_tool_18, '11025'],
                        [Lang.Blocks.robotis_icon_object_tool_19, '11026'],
                        [Lang.Blocks.robotis_icon_object_tool_20, '11027'],
                        [Lang.Blocks.robotis_icon_object_tool_21, '11028'],
                        [Lang.Blocks.robotis_icon_object_tool_22, '11029'],
                        [Lang.Blocks.robotis_icon_object_tool_23, '11030'],
                        [Lang.Blocks.robotis_icon_object_tool_24, '11031'],
                        [Lang.Blocks.robotis_icon_object_tool_25, '11032'],
                        [Lang.Blocks.robotis_icon_object_tool_26, '11033'],
                        [Lang.Blocks.robotis_icon_object_tool_27, '11034'],
                        [Lang.Blocks.robotis_icon_object_tool_28, '11035'],
                        [Lang.Blocks.robotis_icon_object_tool_29, '11036'],
                        [Lang.Blocks.robotis_icon_object_tool_30, '11037'],
                        [Lang.Blocks.robotis_icon_object_tool_31, '11038'],
                        [Lang.Blocks.robotis_icon_object_tool_32, '11039'],
                        [Lang.Blocks.robotis_icon_object_tool_33, '11040'],
                        [Lang.Blocks.robotis_icon_object_tool_34, '11801'],
                        [Lang.Blocks.robotis_icon_object_tool_35, '11802'],
                        [Lang.Blocks.robotis_icon_object_tool_36, '11809'],
                    ],
                    value: '11008',
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
                    50,
                    null,
                ],
                type: 'robotis_Practice_icon_screen_object_tool',
            },
            paramsKeyMap: {
                ICON: 0,
                X: 1,
                Y: 2,
                SIZE: 3,
            },
            class: 'robotis_rb100_lcd',
            isNotFor: ['Robotis_rb_P_Assembly'],
            func: function (sprite, script) {
                // instruction / address / length / value / default length
                var iconNum = script.getField('ICON', script);
                var x = script.getNumberValue('X', script);
                var y = script.getNumberValue('Y', script);
                var size = script.getNumberValue('SIZE', script) * 2;
                
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
                    Entry.Robotis_openCM70.delay + 200
                );
            },
            syntax: {
                js: [],
                py: ['Robotis.RB_rsp_screen(%1,%2,%3,%4)'],
            },
        },
        robotis_Practice_icon_screen_vehicle_number: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.robotis_icon_vehicle_number_1, '11264'],
                        [Lang.Blocks.robotis_icon_vehicle_number_2, '11265'],
                        [Lang.Blocks.robotis_icon_vehicle_number_3, '11266'],
                        [Lang.Blocks.robotis_icon_vehicle_number_4, '11267'],
                        [Lang.Blocks.robotis_icon_vehicle_number_5, '11268'],
                        [Lang.Blocks.robotis_icon_vehicle_number_6, '11269'],
                        [Lang.Blocks.robotis_icon_vehicle_number_7, '11270'],
                        [Lang.Blocks.robotis_icon_vehicle_number_8, '11271'],
                        [Lang.Blocks.robotis_icon_vehicle_number_9, '11272'],
                        [Lang.Blocks.robotis_icon_vehicle_number_10, '11273'],
                        [Lang.Blocks.robotis_icon_vehicle_number_11, '11274'],
                        [Lang.Blocks.robotis_icon_vehicle_number_12, '11275'],
                        [Lang.Blocks.robotis_icon_vehicle_number_13, '11276'],
                        [Lang.Blocks.robotis_icon_vehicle_number_14, '11776'],
                        [Lang.Blocks.robotis_icon_vehicle_number_15, '11777'],
                        [Lang.Blocks.robotis_icon_vehicle_number_16, '11778'],
                        [Lang.Blocks.robotis_icon_vehicle_number_17, '11779'],
                        [Lang.Blocks.robotis_icon_vehicle_number_18, '11780'],
                        [Lang.Blocks.robotis_icon_vehicle_number_19, '11781'],
                        [Lang.Blocks.robotis_icon_vehicle_number_20, '11782'],
                        [Lang.Blocks.robotis_icon_vehicle_number_21, '11783'],
                        [Lang.Blocks.robotis_icon_vehicle_number_22, '11277'],
                        [Lang.Blocks.robotis_icon_vehicle_number_23, '11278'],
                        [Lang.Blocks.robotis_icon_vehicle_number_24, '11279'],
                        [Lang.Blocks.robotis_icon_vehicle_number_25, '11280'],
                        [Lang.Blocks.robotis_icon_vehicle_number_26, '11281'],
                        [Lang.Blocks.robotis_icon_vehicle_number_27, '11282'],
                        [Lang.Blocks.robotis_icon_vehicle_number_28, '11283'],
                        [Lang.Blocks.robotis_icon_vehicle_number_29, '11284'],
                        [Lang.Blocks.robotis_icon_vehicle_number_30, '11285'],
                        [Lang.Blocks.robotis_icon_vehicle_number_31, '11286'],
                        [Lang.Blocks.robotis_icon_vehicle_number_32, '11287'],
                        [Lang.Blocks.robotis_icon_vehicle_number_33, '11288'],
                        [Lang.Blocks.robotis_icon_vehicle_number_34, '11289'],
                        [Lang.Blocks.robotis_icon_vehicle_number_35, '11290'],
                        [Lang.Blocks.robotis_icon_vehicle_number_36, '11291'],
                        [Lang.Blocks.robotis_icon_vehicle_number_37, '11292'],
                        [Lang.Blocks.robotis_icon_vehicle_number_38, '11293'],
                    ],
                    value: '11264',
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
                    50,
                    null,
                ],
                type: 'robotis_Practice_icon_screen_vehicle_number',
            },
            paramsKeyMap: {
                ICON: 0,
                X: 1,
                Y: 2,
                SIZE: 3,
            },
            class: 'robotis_rb100_lcd',
            isNotFor: ['Robotis_rb_P_Assembly'],
            func: function (sprite, script) {
                // instruction / address / length / value / default length
                var iconNum = script.getField('ICON', script);
                var x = script.getNumberValue('X', script);
                var y = script.getNumberValue('Y', script);
                var size = script.getNumberValue('SIZE', script) * 2;
                
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
                    Entry.Robotis_openCM70.delay + 200
                );
            },
            syntax: {
                js: [],
                py: ['Robotis.RB_rsp_screen(%1,%2,%3,%4)'],
            },
        },
        robotis_Practice_text_screen: {
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
                        [Lang.Blocks.robotis_screen_text_font_small, '0'],
                        [Lang.Blocks.robotis_screen_text_font_big, '1'],
                    ],
                    value: '0',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.robotis_red, '224'],
                        [Lang.Blocks.robotis_orange, '244'],
                        [Lang.Blocks.robotis_yellow, '252'],
                        [Lang.Blocks.robotis_green, '28'],
                        [Lang.Blocks.robotis_blue, '3'],
                        [Lang.Blocks.robotis_darkblue, '2'],
                        [Lang.Blocks.robotis_purple, '130'],
                        [Lang.Blocks.robotis_brown, '173'],
                        [Lang.Blocks.robotis_black, '0'],
                        [Lang.Blocks.robotis_white, '255'],
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
                    " ",
                    {
                        type: 'number',
                        params: ['0'],
                    },
                    {
                        type: 'number',
                        params: ['0'],
                    },
                    null,
                    null,
                ],
                type: 'robotis_Practice_text_screen',
            },
            paramsKeyMap: {
                TEXT: 0,
                X: 1,
                Y: 2,
                FONT: 3,
                COLOR: 4,
            },
            class: 'robotis_rb100_lcd',
            isNotFor: ['Robotis_rb_P_Assembly'],
            func: function (sprite, script) {
                // instruction / address / length / value / default length
                var text = script.getStringValue('TEXT', script);
                var x = script.getNumberValue('X', script);
                var y = script.getNumberValue('Y', script);
                var font = script.getNumberValue('FONT', script);
                var color = script.getNumberValue('COLOR', script);
                var data_buf = [];
                var i = 0;
                
                var data_instruction = Entry.Robotis_rb.INSTRUCTION.WRITE;
                var data_address = 900;
                var data_length = 2;
            
                if (x < -160) x = -160;
                else if (x > 160) x = 160;
                
                if (y < -120) y = -120;
                else if (y > 120) y = 120;
                
                var encoder = new TextEncoder('utf-8');
                var byteArray = encoder.encode(text);

                data_buf.push(x % 256);
                data_buf.push(Math.floor(x/256));
                data_buf.push(y % 256);
                data_buf.push(Math.floor(y/256));
                data_buf.push(font);
                data_buf.push(0);
                data_buf.push(0);
                data_buf.push(color);
                data_buf.push(byteArray.length);
                for (i = 0; i < byteArray.length; i++) {
                    data_buf.push(byteArray[i]);
                }
               
                data_length = 9 + byteArray.length;

                var data_sendqueue = [
                    [
                        data_instruction,
                        data_address,
                        data_length,
                        data_buf,
                    ],
                    [
                        Entry.Robotis_rb.INSTRUCTION.WRITE, 162, 1, 1
                    ]
                ];
                
                return Entry.Robotis_carCont.postCallReturn(
                    script,
                    data_sendqueue,
                    Entry.Robotis_openCM70.delay + 200
                );
            },
            syntax: {
                js: [],
                py: ['Robotis.RB_text_screen(%1,%2,%3,%4)'],
            },
        },
        robotis_Practice_pixel: {
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
                        [Lang.Blocks.robotis_red, '224'],
                        [Lang.Blocks.robotis_orange, '244'],
                        [Lang.Blocks.robotis_yellow, '252'],
                        [Lang.Blocks.robotis_green, '28'],
                        [Lang.Blocks.robotis_blue, '3'],
                        [Lang.Blocks.robotis_darkblue, '2'],
                        [Lang.Blocks.robotis_purple, '130'],
                        [Lang.Blocks.robotis_brown, '173'],
                        [Lang.Blocks.robotis_black, '0'],
                        [Lang.Blocks.robotis_white, '255'],
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
                type: 'robotis_Practice_pixel',
            },
            paramsKeyMap: {
                X: 0,
                Y: 1,
                COLOR: 2,
            },
            class: 'robotis_rb100_lcd',
            isNotFor: ['Robotis_rb_P_Assembly'],
            func: function (sprite, script) {
                // instruction / address / length / value / default length
                var x = script.getNumberValue('X', script);
                var y = script.getNumberValue('Y', script);
                var color = script.getNumberValue('COLOR', script);
                var data_buf = [];
                
                var data_instruction = Entry.Robotis_rb.INSTRUCTION.WRITE;
                var data_address = 130;
                var data_length = 11;
            
                if (x < -160) x = -160;
                else if (x > 160) x = 160;
                
                if (y < -120) y = -120;
                else if (y > 120) y = 120;

                data_buf.push(x % 256);
                data_buf.push(Math.floor(x/256));
                data_buf.push(y % 256);
                data_buf.push(Math.floor(y/256));
                data_buf.push(0);
                data_buf.push(0);
                data_buf.push(0);
                data_buf.push(0);
                data_buf.push(0);
                data_buf.push(0);
                data_buf.push(color);

                var data_sendqueue = [
                    [
                        data_instruction,
                        data_address,
                        data_length,
                        data_buf,
                    ],
                    [
                        Entry.Robotis_rb.INSTRUCTION.WRITE, 161, 2, 1 * 256 + 8
                    ]
                ];
                
                return Entry.Robotis_carCont.postCallReturn(
                    script,
                    data_sendqueue,
                    Entry.Robotis_openCM70.delay + 100
                );
            },
            syntax: {
                js: [],
                py: ['Robotis.RB_text_screen(%1,%2,%3,%4)'],
            },
        },
        robotis_Practice_text_screen_redraw: {
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
                        [Lang.Blocks.robotis_red, '224'],
                        [Lang.Blocks.robotis_orange, '244'],
                        [Lang.Blocks.robotis_yellow, '252'],
                        [Lang.Blocks.robotis_green, '28'],
                        [Lang.Blocks.robotis_blue, '3'],
                        [Lang.Blocks.robotis_darkblue, '2'],
                        [Lang.Blocks.robotis_purple, '130'],
                        [Lang.Blocks.robotis_brown, '173'],
                        [Lang.Blocks.robotis_black, '0'],
                        [Lang.Blocks.robotis_white, '255'],
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
                    " ",
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
                type: 'robotis_Practice_text_screen_redraw',
            },
            paramsKeyMap: {
                TEXT: 0,
                X: 1,
                Y: 2,
                COLOR: 3,
            },
            class: 'robotis_rb100_lcd',
            isNotFor: ['Robotis_rb_P_Assembly'],
            func: function (sprite, script) {
                // instruction / address / length / value / default length
                var text = script.getStringValue('TEXT', script);
                var x = script.getNumberValue('X', script);
                var y = script.getNumberValue('Y', script);
                var font = 0;
                var color = script.getNumberValue('COLOR', script);
                var data_buf = [];
                var i = 0;
            
                if (x < -160) x = -160;
                else if (x > 160) x = 160;
                
                if (y < -120) y = -120;
                else if (y > 120) y = 120;
                
                var encoder = new TextEncoder('utf-8');
                var byteArray = encoder.encode(text);

                data_buf.push(x % 256);
                data_buf.push(Math.floor(x/256));
                data_buf.push(y % 256);
                data_buf.push(Math.floor(y/256));
                data_buf.push(font);
                data_buf.push(1);
                data_buf.push(bg_color);
                data_buf.push(color);
                data_buf.push(byteArray.length);
                for (i = 0; i < byteArray.length; i++) {
                    data_buf.push(byteArray[i]);
                }
               
                var data_instruction = Entry.Robotis_rb.INSTRUCTION.WRITE;
                var data_address = 900;
                var data_length = 9 + byteArray.length;

                var data_sendqueue = [
                    [
                        data_instruction,
                        data_address,
                        data_length,
                        data_buf,
                    ],
                    [
                        Entry.Robotis_rb.INSTRUCTION.WRITE, 162, 1, 1
                    ]
                ];
                
                return Entry.Robotis_carCont.postCallReturn(
                    script,
                    data_sendqueue,
                    Entry.Robotis_openCM70.delay + 100
                );
            },
            syntax: {
                js: [],
                py: ['Robotis.RB_text_screen(%1,%2,%3,%4)'],
            },
        },
        robotis_Practice_LCDBright: {
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
                    50,
                ],
                type: 'robotis_Practice_LCDBright',
            },
            paramsKeyMap: {
                BRIGHT: 0,
            },
            class: 'robotis_rb100_lcd',
            isNotFor: ['Robotis_rb_P_Assembly'],
            func: function (sprite, script) {
                // instruction / address / length / value / default length
                var bright = script.getNumberValue('BRIGHT', script);
                
                var data_instruction = Entry.Robotis_rb.INSTRUCTION.WRITE;
                var data_address = 180;
                var data_length = 1;
                var data_value = 0;

                bright = Math.min(Math.max(bright, 0), 100);
                
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
        robotis_Practice_LCDColor: {
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
                        [Lang.Blocks.robotis_darkblue, '2'],
                        [Lang.Blocks.robotis_purple, '130'],
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
                type: 'robotis_Practice_LCDColor',
            },
            paramsKeyMap: {
                COLOR: 0,
            },
            class: 'robotis_rb100_lcd',
            isNotFor: ['Robotis_rb_P_Assembly'],
            func: function (sprite, script) {
                // instruction / address / length / value / default length
                var color = script.getNumberValue('COLOR', script);
                
                var data_instruction = Entry.Robotis_rb.INSTRUCTION.WRITE;
                var data_address = 163;
                var data_length = 2;
                var data_value = 0;
                
                data_value = color;
                bg_color = color;
                
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
                    [Entry.Robotis_rb.INSTRUCTION.WRITE, 162, 1, 1]
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
        robotis_Practice_LCD_Flash: {
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
                        [Lang.Blocks.robotis_darkblue, '2'],
                        [Lang.Blocks.robotis_purple, '130'],
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
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.robotis_red, '224'],
                        [Lang.Blocks.robotis_orange, '244'],
                        [Lang.Blocks.robotis_yellow, '252'],
                        [Lang.Blocks.robotis_green, '28'],
                        [Lang.Blocks.robotis_blue, '3'],
                        [Lang.Blocks.robotis_darkblue, '2'],
                        [Lang.Blocks.robotis_purple, '130'],
                        [Lang.Blocks.robotis_brown, '173'],
                        [Lang.Blocks.robotis_black, '0'],
                        [Lang.Blocks.robotis_white, '255'],
                    ],
                    value: '0',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [0.3, '3'],
                        [0.4, '4'],
                        [0.5, '5'],
                        [0.6, '6'],
                        [0.7, '7'],
                        [0.8, '8'],
                        [0.9, '9'],
                        [1.0, '10'],
                        [1.1, '11'],
                        [1.2, '12'],
                        [1.3, '13'],
                        [1.4, '14'],
                        [1.5, '15'],
                        [1.6, '16'],
                        [1.7, '17'],
                        [1.8, '18'],
                        [1.9, '19'],
                        [2.0, '20'],
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
                params: [
                    null,
                ],
                type: 'robotis_Practice_LCD_Flash',
            },
            paramsKeyMap: {
                COLOR_ON: 0,
                COLOR_OFF: 1,
                PERIOD: 2,
            },
            class: 'robotis_rb100_lcd',
            isNotFor: ['Robotis_rb_P_Assembly'],
            func: function (sprite, script) {
                // instruction / address / length / value / default length
                const color_on = script.getNumberValue('COLOR_ON', script);
                const color_off = script.getNumberValue('COLOR_OFF', script);
                const period = script.getNumberValue('PERIOD', script);
                const colors = color_on + (color_off << 8);

                // 0x8000: use flashing mode, 
                // (period << 8): on time (0.1 sec)
                // period: off time (0.1 sec)
                const time_parameter = 0x8000 + (period << 8) + period; 
                
                var data_sendqueue = [
                    [
                        Entry.Robotis_rb.INSTRUCTION.WRITE, 158, 2, colors
                    ],
                    [
                        Entry.Robotis_rb.INSTRUCTION.WRITE, 163, 2, time_parameter
                    ],
                ];
                return Entry.Robotis_carCont.postCallReturn(
                    script,
                    data_sendqueue,
                    Entry.Robotis_openCM70.delay + 100
                );
            },
            syntax: {
                js: [],
                py: ['Robotis.RB_LCD_Flash(%1, %2, %3)'],
            },
        },

        
        robotis_Practice_cm_led: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.robotis_left, '1'],
                        [Lang.Blocks.robotis_right, '2'],
                        [Lang.Blocks.robotis_both, '3'],
                    ],
                    value: '1',
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
                type: 'robotis_Practice_cm_led',
            },
            paramsKeyMap: {
                RB_LED: 0,
                VALUE: 1,
            },
            class: 'robotis_rb100_led',
            isNotFor: ['Robotis_rb_P_Assembly'],
            func: function (sprite, script) {
                // instruction / address / length / value / default length
                var cmLed = script.getField('RB_LED', script);
                var value = script.getField('VALUE', script);

                var data_instruction = Entry.Robotis_rb.INSTRUCTION.WRITE;
                var data_address = 40;
                var data_length = 1;
                var data_value = 0;

                if (cmLed == 1) {
                    data_value = 200 * value;
                } else if (cmLed == 2) {
                    data_address = 41;
                    data_value = 200 * value;
                } else if (cmLed == 3) {
                    data_address = 40;
                    data_length = 2;
                    data_value = 200 * 257 * value;
                } else {
                    data_value = value * cmLed;
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
            syntax: { js: [], py: ['Robotis.RB100_led(%1, %2)'] },
        },
        robotis_Practice_cm_led_pattern: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.robotis_pattern1, '11'],
                        [Lang.Blocks.robotis_pattern2, '21'],
                        [Lang.Blocks.robotis_pattern3, '31'],
                    ],
                    value: '11',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.robotis_speed_fast, '0'],
                        [Lang.Blocks.robotis_speed_midium, '1'],
                        [Lang.Blocks.robotis_speed_slow, '2'],
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
                params: [null, null, null],
                type: 'robotis_Practice_cm_led_pattern',
            },
            paramsKeyMap: {
                PATTERN: 0,
                SPEED: 1,
            },
            class: 'robotis_rb100_led',
            isNotFor: ['Robotis_rb_P_Assembly'],
            func: function (sprite, script) {
                // instruction / address / length / value / default length
                var pattern = script.getNumberValue('PATTERN', script);
                var speed = script.getNumberValue('SPEED', script);

                var data_instruction = Entry.Robotis_rb.INSTRUCTION.WRITE;
                var data_address = 40;
                var data_length = 1;
                var data_value = 0;

                
                data_value = pattern + speed;
              
                var data_sendqueue = [
                    [data_instruction, data_address, data_length, data_value],
                ];
                
                return Entry.Robotis_carCont.postCallReturn(
                    script,
                    data_sendqueue,
                    Entry.Robotis_openCM70.delay
                );
            },
            syntax: { js: [], py: ['Robotis.RB100_led_pattern(%1, %2)'] },
        },


        
        robotis_Practice_dxl_set_mode: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.robotis_left_wheel, '52'],
                        [Lang.Blocks.robotis_right_wheel, '51'],
                        ["ID 1", '1'],
                        ["ID 2", '2'],
                        ["ID 3", '3'],
                        ["ID 4", '4'],
                        ["ID 5", '5'],
                        ["ID 6", '6'],
                        ["ID 7", '7'],
                        ["ID 8", '8'],
                    ],
                    value: '52',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
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
                    '52',
                    null,
                    null,
                ],
                type: 'robotis_Practice_dxl_set_mode',
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
        robotis_Practice_dxl_each_control: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.robotis_left_wheel, '52'],
                        [Lang.Blocks.robotis_right_wheel, '51'],
                        ["ID 1", '1'],
                        ["ID 2", '2'],
                        ["ID 3", '3'],
                        ["ID 4", '4'],
                        ["ID 5", '5'],
                        ["ID 6", '6'],
                        ["ID 7", '7'],
                        ["ID 8", '8'],
                    ],
                    value: '52',
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
                    '52',
                    {
                        type: 'number',
                        params: ['0'],
                    },
                    {
                        type: 'number',
                        params: ['1'],
                    },
                ],
                type: 'robotis_Practice_dxl_each_control',
            },

            paramsKeyMap: {
                DXLNUM: 0,
                ANGLE: 1,
                TIME: 2,
            },
            class: 'robotis_openCM70_cm',
            isNotFor: ['Robotis_rb_P_Assembly'],
            func(entity, script) {
                var data_instruction = Entry.Robotis_rb.INSTRUCTION.BYPASS_WRITE;
                var data_address = 0;
                var data_length = 0;

                data_address =
                    Entry.Robotis_rb.CONTROL_TABLE.DXL_PROFILE_VELOCITY[0];
                data_length =
                    Entry.Robotis_rb.CONTROL_TABLE.DXL_PROFILE_VELOCITY[1] + Entry.Robotis_rb.CONTROL_TABLE.DXL_GOAL_POSITION[1];


                var dxlID = script.getField('DXLNUM', script);
                var angle = script.getNumberValue('ANGLE', script);
                var time = script.getNumberValue('TIME', script) * 1000;
                var data_buf = [];

                var engValue = 2048;
                engValue = Math.floor(2048 - Math.round(angle * 4096) / 360);
                var velocity = 0;

                if (time == 0) {
                    velocity = 0;
                } else {
                    velocity = Math.round(Math.floor(60 * Math.abs(angle - Entry.Robotis_rb.DXL_POSITION.values[dxlID - 1]) * 1000 / 360 / time) / 0.229);
                }
                Entry.Robotis_rb.DXL_POSITION.values[dxlID - 1] = angle;

                data_buf.push(velocity%256);
                data_buf.push(Math.floor(velocity/256));
                data_buf.push(0);
                data_buf.push(0);

                data_buf.push(engValue%256);
                data_buf.push(Math.floor(engValue/256));
                data_buf.push(0);
                data_buf.push(0);

                var data_sendqueue = [
                    [
                        data_instruction,
                        data_address,
                        data_length,
                        dxlID,
                        data_buf
                    ],
                ];

                return Entry.Robotis_carCont.postCallReturn(
                    script,
                    data_sendqueue,
                    time + Entry.Robotis_openCM70.delay
                    //Entry.Robotis_openCM70.delay
                );
            },
            syntax: { js: [], py: ['Robotis.robotis_dxl_each_control(%1)'] },
        },
        robotis_Practice_dxl_set_position: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.robotis_left_wheel, '52'],
                        [Lang.Blocks.robotis_right_wheel, '51'],
                        ["ID 1", '1'],
                        ["ID 2", '2'],
                        ["ID 3", '3'],
                        ["ID 4", '4'],
                        ["ID 5", '5'],
                        ["ID 6", '6'],
                        ["ID 7", '7'],
                        ["ID 8", '8'],
                    ],
                    value: '52',
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
                    '52',
                    '50',
                    '0',
                    null,
                ],
                type: 'robotis_Practice_dxl_set_position',
            },
            paramsKeyMap: {
                DXL_ID: 0,
                DXL_SPEED: 1,
                DXL_ANGLE: 2,
            },
            class: 'robotis_openCM70_cm',
            isNotFor: ['Robotis_rb_H', 'Robotis_rb_P_Assembly'],
            func: function (sprite, script) {
                // instruction / address / length / value / default length
                var dxl_id = script.getNumberValue('DXL_ID', script);
                var dxl_speed = script.getNumberValue('DXL_SPEED', script);
                var dxl_angle = script.getNumberValue('DXL_ANGLE', script);

                var data_instruction = Entry.Robotis_rb.INSTRUCTION.BYPASS_WRITE;
                var data_address = 0;
                var data_length = 0;
                var data_buf = [];

                data_address =
                    Entry.Robotis_rb.CONTROL_TABLE.DXL_PROFILE_VELOCITY[0];
                data_length =
                    Entry.Robotis_rb.CONTROL_TABLE.DXL_PROFILE_VELOCITY[1] + Entry.Robotis_rb.CONTROL_TABLE.DXL_GOAL_POSITION[1];

                if (dxl_speed < 0) dxl_speed = 0;
                else if (dxl_speed > 100) dxl_speed = 100;

                data_buf.push((dxl_speed*10)%256);
                data_buf.push(Math.floor(dxl_speed*10/256));
                data_buf.push(0);
                data_buf.push(0);

                if (dxl_angle < -179) dxl_angle = -179;
                else if (dxl_angle > 180) dxl_angle = 180;

                dxl_angle = 180 - dxl_angle;

                data_buf.push(Math.floor(dxl_angle*4096/360)%256);
                data_buf.push(Math.floor(dxl_angle*4096/360/256));
                data_buf.push(0);
                data_buf.push(0);

                var data_sendqueue = [
                    [
                        data_instruction,
                        data_address,
                        data_length,
                        dxl_id,
                        data_buf
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
        robotis_Practice_dxl_set_rotate: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.robotis_left_wheel, '52'],
                        [Lang.Blocks.robotis_right_wheel, '51'],
                        ["ID 1", '1'],
                        ["ID 2", '2'],
                        ["ID 3", '3'],
                        ["ID 4", '4'],
                        ["ID 5", '5'],
                        ["ID 6", '6'],
                        ["ID 7", '7'],
                        ["ID 8", '8'],
                    ],
                    value: '52',
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
                    '52',
                    '50',
                    null,
                    null,
                    null,
                ],
                type: 'robotis_Practice_dxl_set_rotate',
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

                // 바퀴형 로봇인 경우 reverse mode이므로 방향 반대
                if (dxl_id == 33 || dxl_id == 35 || dxl_id == 51) data_value = -data_value;

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
        robotis_Practice_dxl_set_multiturn_round: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.robotis_left_wheel, '52'],
                        [Lang.Blocks.robotis_right_wheel, '51'],
                        ["ID 1", '1'],
                        ["ID 2", '2'],
                        ["ID 3", '3'],
                        ["ID 4", '4'],
                        ["ID 5", '5'],
                        ["ID 6", '6'],
                        ["ID 7", '7'],
                        ["ID 8", '8'],
                    ],
                    value: '52',
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
                    '52',
                    '50',
                    '1',
                    null,
                    null,
                ],
                type: 'robotis_Practice_dxl_set_multiturn_round',
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

                // 바퀴형 로봇 우측 바퀴인 경우 reverse mode이므로 방향 반대
                if (dxl_id == 33 || dxl_id == 35 || dxl_id == 51) {
                    dxl_round = -dxl_round;
                }

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






        
        robotis_Practice_scale_simple: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['2', '2'],
                        ['3', '3'],
                        ['4', '4'],
                        ['5', '5'],
                        ['6', '6'],
                    ],
                    value: '4',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.General.note_c + '', '1'],
                        [Lang.General.note_c + '#', '2'],
                        [Lang.General.note_d + '', '3'],
                        [Lang.General.note_d + '#', '4'],
                        [Lang.General.note_e + '', '5'],
                        [Lang.General.note_f + '', '6'],
                        [Lang.General.note_f + '#', '7'],
                        [Lang.General.note_g + '', '8'],
                        [Lang.General.note_g + '#', '9'],
                        [Lang.General.note_a + '', '10'],
                        [Lang.General.note_a + '#', '11'],
                        [Lang.General.note_b + '', '12'],
                    ],
                    value: '1',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.robotis_beat_sound_8th_note, '3'],
                        [Lang.Blocks.robotis_beat_sound_dotted_8th_note, '4'],
                        [Lang.Blocks.robotis_beat_sound_quarter_note, '5'],
                        [Lang.Blocks.robotis_beat_sound_dotted_quarter_note, '6'],
                        [Lang.Blocks.robotis_beat_sound_half_note, '7'],
                        [Lang.Blocks.robotis_beat_sound_dotted_half_note, '8'],
                        [Lang.Blocks.robotis_beat_sound_whole_note, '9'],
                        [Lang.Blocks.robotis_beat_sound_dotted_note, '10'],
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
                params: [
                    null,
                    null,
                    null,
                    null,
                ],
                type: 'robotis_Practice_scale_simple',
            },
            paramsKeyMap: {
                CM_BUZZER_OCTAV: 0,
                CM_BUZZER_INDEX: 1,
                CM_BUZZER_NOTE: 2,
            },
            class: 'robotis_rb100_sound',
            isNotFor: ['Robotis_rb_P_Assembly'],
            func: function (sprite, script) {
                // instruction / address / length / value / default length
                var cmBuzzerIndex = script.getNumberValue('CM_BUZZER_INDEX', script);
                var cmBuzzerOffset = script.getNumberValue('CM_BUZZER_OCTAV', script);
                var cmBuzzerNote = script.getNumberValue('CM_BUZZER_NOTE', script);
                let cmBuzzerTime = 0;

                var data_instruction = Entry.Robotis_rb.INSTRUCTION.WRITE;
                var data_address_1 = 0;
                var data_length_1 = 0;
                var data_value_1 = 0;
                var data_address_2 = 0;
                var data_length_2 = 0;
                var data_value_2 = 0;
                var interval = 0;

                switch (cmBuzzerNote) {
                    case 3:
                        cmBuzzerTime = Math.round(60 * 1000 / beat_per_minute / 2);
                        break;

                    case 4:
                        cmBuzzerTime = Math.round(60 * 1000 / beat_per_minute / 2 * 1.5);
                        break;

                    case 5:
                        cmBuzzerTime = Math.round(60 * 1000 / beat_per_minute);
                        break;

                    case 6:
                        cmBuzzerTime = Math.round(60 * 1000 / beat_per_minute * 1.5);
                        break;

                    case 7:
                        cmBuzzerTime = Math.round(60 * 1000 / beat_per_minute * 2);
                        break;

                    case 8:
                        cmBuzzerTime = Math.round(60 * 1000 / beat_per_minute * 2 * 1.5);
                        break;

                    case 9:
                        cmBuzzerTime = Math.round(60 * 1000 / beat_per_minute * 4);
                        break;
    
                    case 10:
                        cmBuzzerTime = Math.round(60 * 1000 / beat_per_minute * 4 * 1.5);
                        break;
                }

                data_address_1 = 740;
                data_length_1 = 2;
                // data_value_1 = cmBuzzerTime * 10;
                // TODO 텍스트 입력으로 바꾸고 최대는 5초 : 0.5 초 하려면 5를 입력  - console.log(parseInt(0.59 * 10)); max 는 5초
                data_value_1 = cmBuzzerTime;
                if (data_value_1 < 0) {
                    data_value_1 = 0;
                }
                if (data_value_1 > 50000) {
                    data_value_1 = 50000;
                }

                data_address_2 = 742;
                data_length_2 = 1;
                data_value_2 = cmBuzzerIndex + (cmBuzzerOffset - 1) * 12;

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

                return Entry.Robotis_carCont.postCallReturn(
                    script,
                    data_sendqueue,
                    cmBuzzerTime + interval
                );
            },
            syntax: {
                js: [],
                py: ['Robotis.opencm70_cm_buzzer_index(%1, %2)'],
            },
        }, 
        robotis_Practice_scale_advanced: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['2', '2'],
                        ['3', '3'],
                        ['4', '4'],
                        ['5', '5'],
                        ['6', '6'],
                    ],
                    value: '4',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.General.note_c + '', '1'],
                        [Lang.General.note_c + '#', '2'],
                        [Lang.General.note_d + '', '3'],
                        [Lang.General.note_d + '#', '4'],
                        [Lang.General.note_e + '', '5'],
                        [Lang.General.note_f + '', '6'],
                        [Lang.General.note_f + '#', '7'],
                        [Lang.General.note_g + '', '8'],
                        [Lang.General.note_g + '#', '9'],
                        [Lang.General.note_a + '', '10'],
                        [Lang.General.note_a + '#', '11'],
                        [Lang.General.note_b + '', '12'],
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
                    1,
                    null,
                ],
                type: 'robotis_Practice_scale_advanced',
            },
            paramsKeyMap: {
                CM_BUZZER_OCTAV: 0,
                CM_BUZZER_INDEX: 1,
                CM_BUZZER_BEAT: 2,
            },
            class: 'robotis_rb100_sound',
            isNotFor: ['Robotis_rb_P_Assembly'],
            func: function (sprite, script) {
                // instruction / address / length / value / default length
                var cmBuzzerIndex = script.getNumberValue('CM_BUZZER_INDEX', script);
                var cmBuzzerOffset = script.getNumberValue('CM_BUZZER_OCTAV', script);
                var cmBuzzerBeat = script.getNumberValue('CM_BUZZER_BEAT', script);
                let cmBuzzerTime = 0;

                cmBuzzerBeat = Math.min(Math.max(cmBuzzerBeat, 0), 100);

                var data_instruction = Entry.Robotis_rb.INSTRUCTION.WRITE;
                var data_address_1 = 0;
                var data_length_1 = 0;
                var data_value_1 = 0;
                var data_address_2 = 0;
                var data_length_2 = 0;
                var data_value_2 = 0;
                var interval = 0;

                cmBuzzerTime = Math.round(60 * 1000 / beat_per_minute * cmBuzzerBeat);

                data_address_1 = 740;
                data_length_1 = 2;
                // data_value_1 = cmBuzzerTime * 10;
                // TODO 텍스트 입력으로 바꾸고 최대는 5초 : 0.5 초 하려면 5를 입력  - console.log(parseInt(0.59 * 10)); max 는 5초
                data_value_1 = cmBuzzerTime;
                if (data_value_1 < 0) {
                    data_value_1 = 0;
                }
                if (data_value_1 > 50000) {
                    data_value_1 = 50000;
                }

                data_address_2 = 742;
                data_length_2 = 1;
                data_value_2 = cmBuzzerIndex + (cmBuzzerOffset - 1) * 12;

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

                return Entry.Robotis_carCont.postCallReturn(
                    script,
                    data_sendqueue,
                    cmBuzzerTime + interval
                );
            },
            syntax: {
                js: [],
                py: ['Robotis.opencm70_cm_buzzer_index(%1, %2)'],
            },
        }, 
        robotis_Practice_rest_simple: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.robotis_beat_rest_8th_note, '3'],
                        [Lang.Blocks.robotis_beat_rest_quarter_note, '5'],
                        [Lang.Blocks.robotis_beat_rest_half_note, '7'],
                        [Lang.Blocks.robotis_beat_rest_whole_note, '9'],
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
                params: [
                    null,
                    null,
                ],
                type: 'robotis_Practice_rest_simple',
            },
            paramsKeyMap: {
                CM_BUZZER_NOTE: 0,
            },
            class: 'robotis_rb100_sound',
            isNotFor: ['Robotis_rb_P_Assembly'],
            func: function (sprite, script) {
                // instruction / address / length / value / default length
                var cmBuzzerNote = script.getNumberValue('CM_BUZZER_NOTE', script);
                let cmBuzzerTime = 0;

                var interval = 0;

                switch (cmBuzzerNote) {
                    case 3:
                        cmBuzzerTime = Math.round(60 * 1000 / beat_per_minute / 2);
                        break;

                    case 5:
                        cmBuzzerTime = Math.round(60 * 1000 / beat_per_minute);
                        break;

                    case 7:
                        cmBuzzerTime = Math.round(60 * 1000 / beat_per_minute * 2);
                        break;

                    case 9:
                        cmBuzzerTime = Math.round(60 * 1000 / beat_per_minute * 4);
                        break;
                }
                
                var data_sendqueue = [
                ];

                return Entry.Robotis_carCont.postCallReturn(
                    script,
                    data_sendqueue,
                    cmBuzzerTime + interval
                );
            },
            syntax: {
                js: [],
                py: ['Robotis.opencm70_cm_buzzer_index(%1, %2)'],
            },
        }, 
        robotis_Practice_rest_advanced: {
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
                    1,
                    null,
                ],
                type: 'robotis_Practice_rest_advanced',
            },
            paramsKeyMap: {
                CM_BUZZER_BEAT: 0,
            },
            class: 'robotis_rb100_sound',
            isNotFor: ['Robotis_rb_P_Assembly'],
            func: function (sprite, script) {
                // instruction / address / length / value / default length
                var cmBuzzerBeat = script.getNumberValue('CM_BUZZER_BEAT', script);
                let cmBuzzerTime = 0;

                var interval = 0;
                
                cmBuzzerBeat = Math.min(Math.max(cmBuzzerBeat, 0), 100);

                cmBuzzerTime = Math.round(60 * 1000 / beat_per_minute * cmBuzzerBeat);
                
                var data_sendqueue = [
                ];

                return Entry.Robotis_carCont.postCallReturn(
                    script,
                    data_sendqueue,
                    cmBuzzerTime + interval
                );
            },
            syntax: {
                js: [],
                py: ['Robotis.opencm70_cm_buzzer_index(%1, %2)'],
            },
        }, 
        robotis_Practice_beat_per_minute: {
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
                    75,
                    null,
                ],
                type: 'robotis_Practice_beat_per_minute',
            },
            paramsKeyMap: {
                CM_BUZZER_BPM: 0,
            },
            class: 'robotis_rb100_sound',
            isNotFor: ['Robotis_rb_P_Assembly'],
            func: function (sprite, script) {
                // instruction / address / length / value / default length
                var cmBuzzerBpm = script.getNumberValue('CM_BUZZER_BPM', script);

                beat_per_minute = Math.min(Math.max(cmBuzzerBpm, 10), 600);

                // console.log("buzzer send");
                var data_sendqueue = [
                ];

                return Entry.Robotis_carCont.postCallReturn(
                    script,
                    data_sendqueue,
                    0,
                );
            },
            syntax: {
                js: [],
                py: ['Robotis.opencm70_cm_buzzer_index(%1, %2)'],
            },
        }, 
        
        robotis_Practice_Hello: {
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
                type: 'robotis_Practice_Hello',
            },
            paramsKeyMap: {
                HELLO: 0,
            },
            class: 'robotis_rb100_sound',
            isNotFor: ['Robotis_rb_P_Assembly'],
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
        robotis_Practice_effectSound:{
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
                type: 'robotis_Practice_effectSound',
            },
            paramsKeyMap: {
                HELLO: 0,
            },
            class: 'robotis_rb100_sound',
            isNotFor: ['Robotis_rb_P_Assembly'],
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
        robotis_Practice_record:{
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
                type: 'robotis_Practice_record',
            },
            paramsKeyMap: {
                ROOM: 0,
            },
            class: 'robotis_rb100_sound',
            isNotFor: ['Robotis_rb_P_Assembly'],
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
        robotis_Practice_playRecord:{
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
                type: 'robotis_Practice_playRecord',
            },
            paramsKeyMap: {
                ROOM: 0,
            },
            class: 'robotis_rb100_sound',
            isNotFor: ['Robotis_rb_P_Assembly'],
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





        
        robotis_Practice_huskylens_block_value_closest_to_center: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.robotis_huskylens_target_face, '0'],
                        [Lang.Blocks.robotis_huskylens_target_expression, '1'],
                        [Lang.Blocks.robotis_huskylens_target_object, '2'],
                        [Lang.Blocks.robotis_huskylens_target_color, '3'],
                        [Lang.Blocks.robotis_huskylens_target_tag, '4'],
                        [Lang.Blocks.robotis_huskylens_target_qr, '5'],
                    ],
                    value: '0',
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
                    null,
                ],
                type: 'robotis_Practice_huskylens_block_value_closest_to_center',
            },
            paramsKeyMap: {
                TARGET: 0,
                DATA_TYPE: 1,
            },
            class: 'robotis_rb100_custom_huskylens',
            isNotFor: ['Robotis_rb_P_Assembly'],
            func: function (sprite, script) {
                var scope = script.executor.scope;
                var data_address = 4009;
                var data_type = script.getNumberValue('DATA_TYPE');
                data_address += data_type * 2;
                var result = Entry.hw.portData[data_address];
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
        robotis_Practice_huskylens_arrow_value_closest_to_center: {
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
                type: 'robotis_Practice_huskylens_arrow_value_closest_to_center',
            },
            paramsKeyMap: {
                DATA_TYPE: 0,
            },
            class: 'robotis_rb100_custom_huskylens',
            isNotFor: ['Robotis_rb_P_Assembly'],
            func: function (sprite, script) {
                var scope = script.executor.scope;
                var data_address = 4019;
                var data_type = script.getNumberValue('DATA_TYPE');
                data_address += data_type * 2;
                var result = Entry.hw.portData[data_address];

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
        robotis_Practice_huskylens_number_of_learned_id: {
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
                type: 'robotis_Practice_huskylens_number_of_learned_id',
            },
            paramsKeyMap: {
            },
            class: 'robotis_rb100_custom_huskylens',
            isNotFor: ['Robotis_rb_P_Assembly'],
            func: function (sprite, script) {
                var scope = script.executor.scope;
                var data_address = 4003;
                var result = Entry.hw.portData[data_address];
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
        robotis_Practice_huskylens_block_value_of_id: {
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
                            [Lang.Blocks.robotis_huskylens_target_face, '0'],
                            [Lang.Blocks.robotis_huskylens_target_expression, '1'],
                            [Lang.Blocks.robotis_huskylens_target_object, '2'],
                            [Lang.Blocks.robotis_huskylens_target_color, '3'],
                            [Lang.Blocks.robotis_huskylens_target_tag, '4'],
                            [Lang.Blocks.robotis_huskylens_target_qr, '5'],
                        ],
                        value: '0',
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
                    null,
                ],
                type: 'robotis_Practice_huskylens_block_value_of_id',
            },
            paramsKeyMap: {
                ID: 0,
                TARGET: 1,
                TYPE: 2,
            },
            class: 'robotis_rb100_custom_huskylens',
            isNotFor: ['Robotis_rb_P_Assembly'],
            func: function (sprite, script) {
                var scope = script.executor.scope;

                // instruction / address / length / value / default length
                var data_instruction = Entry.Robotis_rb.INSTRUCTION.WRITE;
                var data_address = 4029; // ID_FOR_USE
                var data_length = 2;
                var data_value = script.getNumberValue('ID');

                if (camera_id_for_use != data_value) {
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
                    camera_id_for_use = data_value;
                }

                data_address = 4036; // BLOCK_RESULT_BY_ID_X_CENTER

                data_address += script.getNumberValue('TYPE') * 2;

                var result = Entry.hw.portData[data_address];

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
        robotis_Practice_huskylens_arrow_value_of_id: {
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
                type: 'robotis_Practice_huskylens_arrow_value_of_id',
            },
            paramsKeyMap: {
                ID: 0,
                TYPE: 1,
            },
            class: 'robotis_rb100_custom_huskylens',
            isNotFor: ['Robotis_rb_P_Assembly'],
            func: function (sprite, script) {
                var scope = script.executor.scope;

                // instruction / address / length / value / default length
                var data_instruction = Entry.Robotis_rb.INSTRUCTION.WRITE;
                var data_address = 4029; // ID_FOR_USE
                var data_length = 2;
                var data_value = script.getNumberValue('ID');

                if (camera_id_for_use != data_value) {
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
                    camera_id_for_use = data_value;
                }

                data_address = 4044; // ARROW_RESULT_BY_ID_X_ORIGIN

                data_address += script.getNumberValue('TYPE') * 2;
                var result = Entry.hw.portData[data_address];

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
        robotis_Practice_huskylens_connection_status: {
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
                type: 'robotis_Practice_huskylens_connection_status',
            },
            paramsKeyMap: {
                STATUS: 0,
            },
            class: 'robotis_rb100_custom_huskylens',
            isNotFor: ['Robotis_rb_P_Assembly'],
            func: function (sprite, script) {
                var scope = script.executor.scope;
                var data_address = 4000;
                var compareValue = script.getNumberValue('STATUS');
                var result = Entry.hw.portData[data_address];

                if(result == undefined) {
                    return false;
                }

                return (result == compareValue);
               
            },
            syntax: {
                js: [],
                py: ['Robotis.robotis_huskylens_connection_status(%1)'],
            },
        },
        robotis_Practice_huskylens_if_detected: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.robotis_huskylens_target_face, '0'],
                        [Lang.Blocks.robotis_huskylens_target_expression, '1'],
                        [Lang.Blocks.robotis_huskylens_target_object, '2'],
                        [Lang.Blocks.robotis_huskylens_target_color, '3'],
                        [Lang.Blocks.robotis_huskylens_target_tag, '4'],
                        [Lang.Blocks.robotis_huskylens_target_qr, '5'],
                        [Lang.Blocks.robotis_huskylens_target_arrow, '6'],
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
                type: 'robotis_Practice_huskylens_if_detected',
            },
            paramsKeyMap: {
                DETECT_TYPE: 0,
            },
            class: 'robotis_rb100_custom_huskylens',
            isNotFor: ['Robotis_rb_P_Assembly'],
            func: function (sprite, script) {
                var scope = script.executor.scope;
                var data_address = 4005; // block
                var detect_type = script.getNumberValue('DETECT_TYPE');

                if (detect_type == 6) data_address = 4006; // arrow

                var result = Entry.hw.portData[data_address];

                if(result == undefined) {
                    return false;
                }

                return (result == 1);
               
            },
            syntax: {
                js: [],
                py: ['Robotis.robotis_huskylens_if_detected(%1)'],
            },
        },
        robotis_Practice_huskylens_set_mode: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.robotis_huskylens_mode_face_recognition, '0'],
                        [Lang.Blocks.robotis_huskylens_mode_expression_recognition, '9'],
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
                type: 'robotis_Practice_huskylens_set_mode',
            },
            paramsKeyMap: {
                AI_CAMERA_MODE: 0,
            },
            class: 'robotis_openCM70_cm',
            isNotFor: ['Robotis_rb_P_Assembly'],
            func: function (sprite, script) {
                // instruction / address / length / value / default length
                var huskylens_mode = script.getField('AI_CAMERA_MODE', script);

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
        robotis_Practice_huskylens_print_custom_text: {
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
                    {
                        type: 'number',
                        params: ['0'],
                    },
                    {
                        type: 'number',
                        params: ['0'],
                    },
                    "Hello!"
                ],
                type: 'robotis_Practice_huskylens_print_custom_text',
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
                var data_buf = [];
                var i = 0;

                // Encode the text as UTF-8
                let encoder = new TextEncoder();
                let utf8Array = encoder.encode(text);

                // utf8Array is now a Uint8Array containing the UTF-8 bytes of the text
                let text_len = utf8Array.length;

                if (text_len > 45) text_len = 45;
                
                if (x < -160) x = 160;
                else if (x > 160) x = 160;

                if (y < -120) y = 120;
                else if (y > 120) y = 120;

                if (x < 0) x = 65536 + x;
                if (y < 0) y = 65536 + y;
                
                data_buf.push(x % 256);
                data_buf.push(Math.floor(x/256));
                data_buf.push(y % 256);
                data_buf.push(Math.floor(y/256));
                data_buf.push(0);
                data_buf.push(0);
                for (i = 0; i < text_len; i++) {
                    data_buf.push(utf8Array[i]);
                }

                var data_instruction = Entry.Robotis_rb.INSTRUCTION.WRITE;
                var data_address = 4200;
                var data_length = 6 + text_len;

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
        robotis_Practice_huskylens_clear_custom_text: {
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
                type: 'robotis_Practice_huskylens_clear_custom_text',
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



