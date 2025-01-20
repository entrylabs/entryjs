'use strict';

Entry.Zerone = {
    setZero() {
        Entry.Robomation.setZero();
    },
    afterReceive(pd) {
        Entry.Robomation.afterReceive(pd, false);
    },
    afterSend(sq) {
        Entry.Robomation.afterSend(sq);
    },
    getRobot() {
        const robot = Entry.Robomation.getRobot('zerone', 0);
        if (robot) {
            robot.setMotoring(Entry.hw.sendQueue);
        }
        return robot;
    },
    id: '2.F',
    name: 'zerone',
    url: 'http://www.toytron.co.kr',
    imageName: 'zerone.png',
    title: {
        ko: '제론',
        en: 'Zerone',
        jp: 'ゼロン',
        vn: 'Zerone',
    },
    monitorTemplate: () => ({
        imgPath: 'hw/zerone.png',
        width: 414,
        height: 300,
        listPorts: {
            colorNumber: {
                name: Lang.Blocks.ROBOID_sensor_color_number,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            colorRed: {
                name: Lang.Blocks.ROBOID_sensor_color_r,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            colorGreen: {
                name: Lang.Blocks.ROBOID_sensor_color_g,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            colorBlue: {
                name: Lang.Blocks.ROBOID_sensor_color_b,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            button: {
                name: Lang.Blocks.ROBOID_sensor_button,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            buzzer: {
                name: Lang.Blocks.ROBOID_monitor_buzzer,
                type: 'output',
                pos: { x: 0, y: 0 },
            },
            note: {
                name: Lang.Blocks.ROBOID_monitor_note,
                type: 'output',
                pos: { x: 0, y: 0 },
            },
        },
        ports: {
            leftProximity: {
                name: Lang.Blocks.ROBOID_sensor_left_proximity,
                type: 'input',
                pos: { x: 213, y: 115 },
            },
            rightProximity: {
                name: Lang.Blocks.ROBOID_sensor_right_proximity,
                type: 'input',
                pos: { x: 211, y: 115 },
            },
            frontProximity: {
                name: Lang.Blocks.ROBOID_sensor_front_proximity,
                type: 'input',
                pos: { x: 212, y: 116 },
            },
            rearProximity: {
                name: Lang.Blocks.ROBOID_sensor_rear_proximity,
                type: 'input',
                pos: { x: 212, y: 114 },
            },
            floor: {
                name: Lang.Blocks.ROBOID_sensor_floor,
                type: 'input',
                pos: { x: 207, y: 288 },
            },
            leftWheel: {
                name: Lang.Blocks.ROBOID_monitor_left_wheel,
                type: 'output',
                pos: { x: 407, y: 206 },
            },
            rightWheel: {
                name: Lang.Blocks.ROBOID_monitor_right_wheel,
                type: 'output',
                pos: { x: 7, y: 206 },
            },
            leftHeadRgb: {
                name: Lang.Blocks.ROBOID_monitor_left_head_led,
                type: 'output',
                pos: { x: 333, y: 141 },
            },
            rightHeadRgb: {
                name: Lang.Blocks.ROBOID_monitor_right_head_led,
                type: 'output',
                pos: { x: 71, y: 141 },
            },
            leftTailRgb: {
                name: Lang.Blocks.ROBOID_monitor_left_tail_led,
                type: 'output',
                pos: { x: 376, y: 70 },
            },
            rightTailRgb: {
                name: Lang.Blocks.ROBOID_monitor_right_tail_led,
                type: 'output',
                pos: { x: 37, y: 70 },
            },
        },
        mode: 'both',
    }),
};

Entry.Zerone.setLanguage = () => ({
    ko: {
        template: {
            zerone_is_gesture: '제스처가 %1 인가?',
            zerone_touching_color: '%1 에 닿았는가?',
            zerone_is_color_pattern: '색깔 패턴이 %1 %2 인가?',
            zerone_button_state: '버튼을 %1 ?',
            zerone_boolean: '배터리 %1?',
            zerone_value: '%1',
            zerone_move_forward_unit: '앞으로 %1 %2 이동하기 %3',
            zerone_move_backward_unit: '뒤로 %1 %2 이동하기 %3',
            zerone_turn_unit_in_place: '%1 으로 %2 %3 제자리 돌기 %4',
            zerone_change_both_wheels_by: '왼쪽 바퀴 %1 오른쪽 바퀴 %2 만큼 바꾸기 %3',
            zerone_set_both_wheels_to: '왼쪽 바퀴 %1 오른쪽 바퀴 %2 (으)로 정하기 %3',
            zerone_change_wheel_by: '%1 바퀴 %2 만큼 바꾸기 %3',
            zerone_set_wheel_to: '%1 바퀴 %2 (으)로 정하기 %3',
            zerone_follow_line: '선 따라가기 %1',
            zerone_follow_line_until: '선을 따라 %1 까지 이동하기 %2',
            zerone_follow_line_until_intersection: '선을 따라 교차로까지 이동하기 %1',
            zerone_cross_intersection: '교차로 건너가기 %1',
            zerone_turn_at_intersection: '교차로에서 %1 으로 돌기 %2',
            zerone_jump_line: '%1 선으로 건너가기 %2',
            zerone_set_following_speed_to: '선 따라가기 속도를 %1 (으)로 정하기 %2',
            zerone_stop: '정지하기 %1',
            zerone_set_led_to: '%1 LED를 %2 으로 정하기 %3',
            zerone_pick_led: '%1 LED를 %2로 정하기 %3',
            zerone_change_led_by_rgb: '%1 LED를 R: %2 G: %3 B: %4 만큼 바꾸기 %5',
            zerone_set_led_to_rgb: '%1 LED를 R: %2 G: %3 B: %4 (으)로 정하기 %5',
            zerone_clear_led: '%1 LED 끄기 %2',
            zerone_play_sound_times: '%1 소리 %2 번 재생하기 %3',
            zerone_play_sound_times_until_done: '%1 소리 %2 번 재생하고 기다리기 %3',
            zerone_change_buzzer_by: '버저 음을 %1 만큼 바꾸기 %2',
            zerone_set_buzzer_to: '버저 음을 %1 (으)로 정하기 %2',
            zerone_clear_sound: '소리 끄기 %1',
            zerone_play_note: '%1 %2 음을 연주하기 %3',
            zerone_play_note_for: '%1 %2 음을 %3 박자 연주하기 %4',
            zerone_rest_for: '%1 박자 쉬기 %2',
            zerone_change_tempo_by: '연주 속도를 %1 만큼 바꾸기 %2',
            zerone_set_tempo_to: '연주 속도를 %1 BPM으로 정하기 %2',
        },
        Helper: {
            zerone_is_gesture:
                "선택한 제스처를 제스처 센서가 감지하였으면 '참'으로 판단하고, 아니면 '거짓'으로 판단합니다.",
            zerone_touching_color:
                "선택한 색깔을 컬러 센서가 감지하였으면 '참'으로 판단하고, 아니면 '거짓'으로 판단합니다.",
            zerone_is_color_pattern: "선택한 색깔 패턴을 컬러 센서가 감지하였으면 '참'으로 판단하고, 아니면 '거짓'으로 판단합니다.",
            zerone_button_state: "버튼을 클릭했으면/더블클릭했으면/길게 눌렀으면 '참'으로 판단하고, 아니면 '거짓'으로 판단합니다.",
            zerone_boolean:
                "배터리 정상: 배터리 잔량이 충분하면 '참'으로 판단하고, 아니면 '거짓'으로 판단합니다.<br/>배터리 부족: 배터리 잔량이 부족하면 '참'으로 판단하고, 아니면 '거짓'으로 판단합니다.<br/>배터리 없음: 배터리 잔량이 없으면 '참'으로 판단하고, 아니면 '거짓'으로 판단합니다.",
            zerone_value:
                '왼쪽 근접 센서: 왼쪽 근접 센서의 값 (값의 범위: 0 ~ 255, 초기값: 0)<br/>오른쪽 근접 센서: 오른쪽 근접 센서의 값 (값의 범위: 0 ~ 255, 초기값: 0)<br/>앞쪽 근접 센서: 앞쪽 근접 센서의 값 (값의 범위: 0 ~ 255, 초기값: 0)<br/>뒤쪽 근접 센서: 뒤쪽 근접 센서의 값 (값의 범위: 0 ~ 255, 초기값: 0)<br/>제스처: 제스처 센서가 감지한 제스처의 번호 (값의 범위: -1 ~ 6, 초기값: -1)<br/>색깔 번호: 컬러 센서가 감지한 색깔의 번호 (값의 범위: -1 ~ 6, 초기값: -1)<br/>색깔 R: 컬러 센서가 감지한 색깔의 빨간색(R) 성분 (값의 범위: 0 ~ 255, 초기값: 0)<br/>색깔 G: 컬러 센서가 감지한 색깔의 초록색(G) 성분 (값의 범위: 0 ~ 255, 초기값: 0)<br/>색깔 B: 컬러 센서가 감지한 색깔의 파란색(B) 성분 (값의 범위: 0 ~ 255, 초기값: 0)<br/>신호 세기: 블루투스 무선 통신의 신호 세기 (값의 범위: -128 ~ 0 dBm, 초기값: 0) 신호의 세기가 셀수록 값이 커집니다.',
            zerone_move_forward_unit: '입력한 거리(cm)/시간(초)/펄스만큼 앞으로 이동합니다.',
            zerone_move_backward_unit: '입력한 거리(cm)/시간(초)/펄스만큼 뒤로 이동합니다.',
            zerone_turn_unit_in_place:
                '입력한 각도(도)/시간(초)/펄스만큼 왼쪽/오른쪽 방향으로 제자리에서 회전합니다.',
            zerone_change_both_wheels_by:
                '왼쪽과 오른쪽 바퀴의 현재 속도 값(%)에 입력한 값을 각각 더합니다. 더한 결과가 양수 값이면 바퀴가 앞으로 회전하고, 음수 값이면 뒤로 회전합니다.',
            zerone_set_both_wheels_to:
                '왼쪽과 오른쪽 바퀴의 속도를 입력한 값(-100 ~ 100%)으로 각각 설정합니다. 양수 값을 입력하면 바퀴가 앞으로 회전하고, 음수 값을 입력하면 뒤로 회전합니다. 숫자 0을 입력하면 정지합니다.',
            zerone_change_wheel_by:
                '왼쪽/오른쪽/양쪽 바퀴의 현재 속도 값(%)에 입력한 값을 더합니다. 더한 결과가 양수 값이면 바퀴가 앞으로 회전하고, 음수 값이면 뒤로 회전합니다.',
            zerone_set_wheel_to:
                '왼쪽/오른쪽/양쪽 바퀴의 속도를 입력한 값(-100 ~ 100%)으로 설정합니다. 양수 값을 입력하면 바퀴가 앞으로 회전하고, 음수 값을 입력하면 뒤로 회전합니다. 숫자 0을 입력하면 정지합니다.',
            zerone_follow_line: '하얀색 바탕 위에서 검은색 선을 따라 이동합니다.',
            zerone_follow_line_until: '하얀색 바탕 위에서 검은색 선을 따라 이동하다가 선택한 색깔을 컬러 센서가 감지하면 정지합니다.',
            zerone_follow_line_until_intersection: '하얀색 바탕 위에서 검은색 선을 따라 이동하다가 검은색 교차로를 컬러 센서가 감지하면 정지합니다.',
            zerone_cross_intersection: '검은색 교차로에서 잠시 앞으로 이동한 후 검은색 선을 찾습니다.',
            zerone_turn_at_intersection: '검은색 교차로에서 잠시 앞으로 이동한 후 제자리에서 왼쪽/오른쪽/뒤쪽으로 회전하고 검은색 선을 찾습니다.',
            zerone_jump_line: '제자리에서 왼쪽/오른쪽으로 90도 회전한 후 앞으로 이동하다가 컬러 센서가 검은색 선을 감지하면 원래 방향으로 다시 회전합니다.',
            zerone_set_following_speed_to: '선을 따라 이동하는 속도(1 ~ 8)를 설정합니다. 숫자가 클수록 이동하는 속도가 빠릅니다.',
            zerone_stop: '양쪽 바퀴를 정지합니다.',
            zerone_set_led_to: '선택한 LED를 선택한 색깔로 켭니다.',
            zerone_pick_led: '선택한 LED를 선택한 색깔로 켭니다.',
            zerone_change_led_by_rgb: '선택한 LED의 현재 R, G, B 값에 입력한 값을 각각 더합니다.',
            zerone_set_led_to_rgb: '선택한 LED의 R, G, B 값을 입력한 값으로 각각 설정합니다.',
            zerone_clear_led: '선택한 LED를 끕니다.',
            zerone_play_sound_times: '선택한 소리를 입력한 횟수만큼 재생합니다.',
            zerone_play_sound_times_until_done:
                '선택한 소리를 입력한 횟수만큼 재생하고, 재생이 완료될 때까지 기다립니다.',
            zerone_change_buzzer_by:
                '버저 소리의 현재 음 높이(Hz)에 입력한 값을 더합니다. 소수점 첫째 자리까지 입력할 수 있습니다.',
            zerone_set_buzzer_to:
                '버저 소리의 음 높이를 입력한 값(Hz)으로 설정합니다. 소수점 첫째 자리까지 입력할 수 있습니다. 숫자 0을 입력하면 소리를 끕니다.',
            zerone_clear_sound: '소리를 끕니다.',
            zerone_play_note: '선택한 계이름과 옥타브의 음을 계속 소리 냅니다.',
            zerone_play_note_for: '선택한 계이름과 옥타브의 음을 입력한 박자만큼 소리 냅니다.',
            zerone_rest_for: '입력한 박자만큼 쉽니다.',
            zerone_change_tempo_by:
                '연주하거나 쉬는 속도의 현재 BPM(분당 박자 수)에 입력한 값을 더합니다.',
            zerone_set_tempo_to: '연주하거나 쉬는 속도를 입력한 BPM(분당 박자 수)으로 설정합니다.',
        },
        Blocks: {
            ROBOID_monitor_buzzer: '버저',
            ROBOID_monitor_note: '음표',
            ROBOID_monitor_left_wheel: '왼쪽 바퀴',
            ROBOID_monitor_right_wheel: '오른쪽 바퀴',
            ROBOID_monitor_left_head_led: '왼쪽 앞 LED',
            ROBOID_monitor_right_head_led: '오른쪽 앞 LED',
            ROBOID_monitor_left_tail_led: '왼쪽 뒤 LED',
            ROBOID_monitor_right_tail_led: '오른쪽 뒤 LED',
            ROBOID_gesture_forward: '앞으로',
            ROBOID_gesture_backward: '뒤로',
            ROBOID_gesture_leftward: '왼쪽으로',
            ROBOID_gesture_rightward: '오른쪽으로',
            ROBOID_gesture_near: '가까이',
            ROBOID_gesture_far: '멀리',
            ROBOID_gesture_click: '클릭',
            ROBOID_gesture_long_touch: '오래 터치',
            ROBOID_color_red: '빨간색',
            ROBOID_color_orange: '주황색',
            ROBOID_color_yellow: '노란색',
            ROBOID_color_green: '초록색',
            ROBOID_color_sky_blue: '하늘색',
            ROBOID_color_blue: '파란색',
            ROBOID_color_violet: '보라색',
            ROBOID_color_purple: '자주색',
            ROBOID_color_white: '하얀색',
            ROBOID_color_black: '검은색',
            ROBOID_color_any: '아무 색',
            ROBOID_clicked: '클릭했는가',
            ROBOID_double_clicked: '더블클릭했는가',
            ROBOID_long_pressed: '오래 눌렀는가',
            ROBOID_battery_state_normal: '정상',
            ROBOID_battery_state_low: '부족',
            ROBOID_battery_state_empty: '없음',
            ROBOID_sensor_left_proximity: '왼쪽 근접 센서',
            ROBOID_sensor_right_proximity: '오른쪽 근접 센서',
            ROBOID_sensor_front_proximity: '앞쪽 근접 센서',
            ROBOID_sensor_rear_proximity: '뒤쪽 근접 센서',
            ROBOID_sensor_gesture: '제스처',
            ROBOID_sensor_color_number: '색깔 번호',
            ROBOID_sensor_color_pattern: '색깔 패턴',
            ROBOID_sensor_color_r: '색깔 R',
            ROBOID_sensor_color_g: '색깔 G',
            ROBOID_sensor_color_b: '색깔 B',
            ROBOID_sensor_floor: '바닥 센서',
            ROBOID_sensor_button: '버튼',
            ROBOID_sensor_signal_strength: '신호 세기',
            ROBOID_gesture: '제스처',
            ROBOID_color: '색깔',
            ROBOID_unit_cm: 'cm',
            ROBOID_unit_sec: '초',
            ROBOID_unit_pulse: '펄스',
            ROBOID_unit_deg: '도',
            ROBOID_left: '왼쪽',
            ROBOID_right: '오른쪽',
            ROBOID_both: '양쪽',
            ROBOID_head: '앞쪽',
            ROBOID_tail: '뒤쪽',
            ROBOID_all: '모든',
            ROBOID_led_left_head: '왼쪽 앞',
            ROBOID_led_right_head: '오른쪽 앞',
            ROBOID_led_left_tail: '왼쪽 뒤',
            ROBOID_led_right_tail: '오른쪽 뒤',
            ROBOID_sound_beep: '삐',
            ROBOID_sound_random_beep: '무작위 삐',
            ROBOID_sound_noise: '지지직',
            ROBOID_sound_siren: '사이렌',
            ROBOID_sound_engine: '엔진',
            ROBOID_sound_chop: '쩝',
            ROBOID_sound_robot: '로봇',
            ROBOID_sound_dibidibidip: '디비디비딥',
            ROBOID_sound_good_job: '잘 했어요',
            ROBOID_sound_happy: '행복',
            ROBOID_sound_angry: '화남',
            ROBOID_sound_sad: '슬픔',
            ROBOID_sound_sleep: '졸림',
            ROBOID_sound_march: '행진',
            ROBOID_sound_birthday: '생일',
            ROBOID_note_c: '도',
            ROBOID_note_c_sharp: '도♯(레♭)',
            ROBOID_note_d: '레',
            ROBOID_note_d_sharp: '레♯(미♭)',
            ROBOID_note_e: '미',
            ROBOID_note_f: '파',
            ROBOID_note_f_sharp: '파♯(솔♭)',
            ROBOID_note_g: '솔',
            ROBOID_note_g_sharp: '솔♯(라♭)',
            ROBOID_note_a: '라',
            ROBOID_note_a_sharp: '라♯(시♭)',
            ROBOID_note_b: '시',
        },
    },
    en: {
        template: {
            zerone_is_gesture: 'gesture %1?',
            zerone_touching_color: 'touching %1?',
            zerone_is_color_pattern: 'color pattern %1 %2 ?',
            zerone_button_state: 'button %1 ?',
            zerone_boolean: 'battery %1?',
            zerone_value: '%1',
            zerone_move_forward_unit: 'move forward %1 %2 %3',
            zerone_move_backward_unit: 'move backward %1 %2 %3',
            zerone_turn_unit_in_place: 'turn %1 %2 %3 in place %4',
            zerone_change_both_wheels_by: 'change wheels by left: %1 right: %2 %3',
            zerone_set_both_wheels_to: 'set wheels to left: %1 right: %2 %3',
            zerone_change_wheel_by: 'change %1 wheel by %2 %3',
            zerone_set_wheel_to: 'set %1 wheel to %2 %3',
            zerone_follow_line: 'follow line %1',
            zerone_follow_line_until: 'follow line until %1 %2',
            zerone_follow_line_until_intersection: 'follow line until intersection %1',
            zerone_cross_intersection: 'cross intersection %1',
            zerone_turn_at_intersection: 'turn %1 at intersection %2',
            zerone_jump_line: 'jump to %1 line %2',
            zerone_set_following_speed_to: 'set following speed to %1 %2',
            zerone_stop: 'stop %1',
            zerone_set_led_to: 'set %1 led to %2 %3',
            zerone_pick_led: 'set %1 led to %2 %3',
            zerone_change_led_by_rgb: 'change %1 led by r: %2 g: %3 b: %4 %5',
            zerone_set_led_to_rgb: 'set %1 led to r: %2 g: %3 b: %4 %5',
            zerone_clear_led: 'clear %1 led %2',
            zerone_play_sound_times: 'play sound %1 %2 times %3',
            zerone_play_sound_times_until_done: 'play sound %1 %2 times until done %3',
            zerone_change_buzzer_by: 'change buzzer by %1 %2',
            zerone_set_buzzer_to: 'set buzzer to %1 %2',
            zerone_clear_sound: 'clear sound %1',
            zerone_play_note: 'play note %1 %2 %3',
            zerone_play_note_for: 'play note %1 %2 for %3 beats %4',
            zerone_rest_for: 'rest for %1 beats %2',
            zerone_change_tempo_by: 'change tempo by %1 %2',
            zerone_set_tempo_to: 'set tempo to %1 bpm %2',
        },
        Helper: {
            zerone_is_gesture:
                'If the gesture sensor detects the selected gesture, true, otherwise false.',
            zerone_touching_color:
                'If the color sensor detects the selected color, true, otherwise false.',
            zerone_is_color_pattern: 'If the color sensor detects the selected color pattern, true, otherwise false.',
            zerone_button_state: 'If the button clicked/double-clicked/long-pressed, true, otherwise false.',
            zerone_boolean:
                'battery normal: If the battery is enough, true, otherwise false<br/>battery low: If the battery is low, true, otherwise false<br/>battery empty: If the battery is empty, true, otherwise false',
            zerone_value:
                'left proximity: value of left proximity sensor (range: 0 to 255, initial value: 0)<br/>right proximity: value of right proximity sensor (range: 0 to 255, initial value: 0)<br/>front proximity: value of front proximity sensor (range: 0 to 255, initial value: 0)<br/>rear proximity: value of rear proximity sensor (range: 0 to 255, initial value: 0)<br/>gesture: gesture number detected by the gesture sensor (range: -1 ~ 6, initial value: -1)<br/>color number: color number detected by the color sensor (range: -1 to 6, initial value: -1)<br/>color r: red component of color detected by the color sensor (range: 0 ~ 255, initial value: 0)<br/>color g: green component of color detected by the color sensor (range: 0 ~ 255, initial value: 0)<br/>color b: blue component of color detected by the color sensor (range: 0 ~ 255, initial value: 0)<br/>signal strength: signal strength of Bluetooth communication (range: -128 to 0 dBm, initial value: 0) As the signal strength increases, the value increases.',
            zerone_move_forward_unit: 'Moves forward for the number of cm/seconds/pulses entered.',
            zerone_move_backward_unit:
                'Moves backward for the number of cm/seconds/pulses entered.',
            zerone_turn_unit_in_place:
                'Turns left/right in place for the number of degrees/seconds/pulses entered.',
            zerone_change_both_wheels_by:
                'Adds the entered values to the current velocity values (%) of the left and right wheels respectively. If the result is positive, the wheel rotates forward; if negative, the wheel rotates backward.',
            zerone_set_both_wheels_to:
                'Sets the velocity of the left and right wheels to the entered values (-100 to 100%), respectively. If you enter a positive value, the wheel rotates forward. If you enter a negative value, the wheel rotates backward. Entering the number 0 stops it.',
            zerone_change_wheel_by:
                'Adds the entered value to the current velocity value (%) of the left/right/both wheels. If the result is positive, the wheel rotates forward; if negative, the wheel rotates backward.',
            zerone_set_wheel_to:
                'Sets the velocity of the left/right/both wheels to the entered value (-100 to 100%). If you enter a positive value, the wheel rotates forward. If you enter a negative value, the wheel rotates backward. Entering the number 0 stops it.',
            zerone_follow_line: 'Moves along the black line on a white background.',
            zerone_follow_line_until: 'Moves along the black line on a white background and stops when the color sensor detects the selected color.',
            zerone_follow_line_until_intersection: 'Moves along the black line on a white background and stops when the color sensor detects the black intersection.',
            zerone_cross_intersection: 'Moves forward for a moment at the black intersection, then finds the black line.',
            zerone_turn_at_intersection: 'Moves forward for a moment at the black intersection, then turns left/right/back in place and finds the black line.',
            zerone_jump_line: 'Turns left/right 90 degrees in place and moves forward. Stops when the color sensor detects the black line and turns to its original direction.',
            zerone_set_following_speed_to: 'Sets the speed (1 to 8) to move along the line. The larger the number, the faster the movement.',
            zerone_stop: 'Stops both wheels.',
            zerone_set_led_to: 'Turns the selected LED to the selected color.',
            zerone_pick_led: 'Turns the selected LED to the selected color.',
            zerone_change_led_by_rgb:
                'Adds the entered values to the current R, G, B values of the selected LED, respectively.',
            zerone_set_led_to_rgb:
                'Sets the R, G, B values of the selected LED to the entered values.',
            zerone_clear_led: 'Turns off the selected LED.',
            zerone_play_sound_times: 'Plays the selected sound as many times as entered.',
            zerone_play_sound_times_until_done:
                'Plays the selected sound as many times as entered, and waits for completion.',
            zerone_change_buzzer_by:
                'Adds the entered value to the current pitch (Hz) of the buzzer sound. You can enter up to one decimal place.',
            zerone_set_buzzer_to:
                'Sets the pitch of the buzzer sound to the entered value (Hz). You can enter up to one decimal place. Entering the number 0 turns off the buzzer sound.',
            zerone_clear_sound: 'Turns off sound.',
            zerone_play_note: 'It sounds the selected tone and octave.',
            zerone_play_note_for:
                'It sounds the selected tone and octave as much as the beat you entered.',
            zerone_rest_for: 'Rests as much as the beat you entered.',
            zerone_change_tempo_by:
                'Adds the entered value to the current BPM (beats per minute) of the playing or resting speed.',
            zerone_set_tempo_to:
                'Sets the playing or resting speed to the entered BPM (beats per minute).',
        },
        Blocks: {
            ROBOID_monitor_buzzer: 'buzzer',
            ROBOID_monitor_note: 'note',
            ROBOID_monitor_left_wheel: 'left wheel',
            ROBOID_monitor_right_wheel: 'right wheel',
            ROBOID_monitor_left_head_led: 'left head led',
            ROBOID_monitor_right_head_led: 'right head led',
            ROBOID_monitor_left_tail_led: 'left tail led',
            ROBOID_monitor_right_tail_led: 'right tail led',
            ROBOID_gesture_forward: 'forward',
            ROBOID_gesture_backward: 'backward',
            ROBOID_gesture_leftward: 'leftward',
            ROBOID_gesture_rightward: 'rightward',
            ROBOID_gesture_near: 'near',
            ROBOID_gesture_far: 'far',
            ROBOID_gesture_click: 'click',
            ROBOID_gesture_long_touch: 'long touch',
            ROBOID_color_red: 'red',
            ROBOID_color_orange: 'orange',
            ROBOID_color_yellow: 'yellow',
            ROBOID_color_green: 'green',
            ROBOID_color_sky_blue: 'sky blue',
            ROBOID_color_blue: 'blue',
            ROBOID_color_violet: 'violet',
            ROBOID_color_purple: 'purple',
            ROBOID_color_white: 'white',
            ROBOID_color_black: 'black',
            ROBOID_color_any: 'any color',
            ROBOID_clicked: 'clicked',
            ROBOID_double_clicked: 'double-clicked',
            ROBOID_long_pressed: 'long-pressed',
            ROBOID_battery_state_normal: 'normal',
            ROBOID_battery_state_low: 'low',
            ROBOID_battery_state_empty: 'empty',
            ROBOID_sensor_left_proximity: 'left proximity',
            ROBOID_sensor_right_proximity: 'right proximity',
            ROBOID_sensor_front_proximity: 'front proximity',
            ROBOID_sensor_rear_proximity: 'rear proximity',
            ROBOID_sensor_gesture: 'gesture',
            ROBOID_sensor_color_number: 'color number',
            ROBOID_sensor_color_pattern: 'color pattern',
            ROBOID_sensor_color_r: 'color r',
            ROBOID_sensor_color_g: 'color g',
            ROBOID_sensor_color_b: 'color b',
            ROBOID_sensor_floor: 'floor',
            ROBOID_sensor_button: 'button',
            ROBOID_sensor_signal_strength: 'signal strength',
            ROBOID_gesture: 'gesture',
            ROBOID_color: 'color',
            ROBOID_unit_cm: 'cm',
            ROBOID_unit_sec: 'seconds',
            ROBOID_unit_pulse: 'pulses',
            ROBOID_unit_deg: 'degrees',
            ROBOID_left: 'left',
            ROBOID_right: 'right',
            ROBOID_both: 'both',
            ROBOID_head: 'head',
            ROBOID_tail: 'tail',
            ROBOID_all: 'all',
            ROBOID_led_left_head: 'left head',
            ROBOID_led_right_head: 'right head',
            ROBOID_led_left_tail: 'left tail',
            ROBOID_led_right_tail: 'right tail',
            ROBOID_sound_beep: 'beep',
            ROBOID_sound_random_beep: 'random beep',
            ROBOID_sound_noise: 'noise',
            ROBOID_sound_siren: 'siren',
            ROBOID_sound_engine: 'engine',
            ROBOID_sound_chop: 'chop',
            ROBOID_sound_robot: 'robot',
            ROBOID_sound_dibidibidip: 'dibidibidip',
            ROBOID_sound_good_job: 'good job',
            ROBOID_sound_happy: 'happy',
            ROBOID_sound_angry: 'angry',
            ROBOID_sound_sad: 'sad',
            ROBOID_sound_sleep: 'sleep',
            ROBOID_sound_march: 'march',
            ROBOID_sound_birthday: 'birthday',
            ROBOID_note_c: 'C',
            ROBOID_note_c_sharp: 'C♯(D♭)',
            ROBOID_note_d: 'D',
            ROBOID_note_d_sharp: 'D♯(E♭)',
            ROBOID_note_e: 'E',
            ROBOID_note_f: 'F',
            ROBOID_note_f_sharp: 'F♯(G♭)',
            ROBOID_note_g: 'G',
            ROBOID_note_g_sharp: 'G♯(A♭)',
            ROBOID_note_a: 'A',
            ROBOID_note_a_sharp: 'A♯(B♭)',
            ROBOID_note_b: 'B',
        },
    },
    jp: {
        template: {
            zerone_is_gesture: 'ジェスチャーが %1 ですか?',
            zerone_touching_color: '%1 に触れたか?',
            zerone_is_color_pattern: '色パターンが %1 %2 ですか?',
            zerone_button_state: 'ボタンを %1 ?',
            zerone_boolean: '電池が%1?',
            zerone_value: '%1',
            zerone_move_forward_unit: '前へ%1%2動かす %3',
            zerone_move_backward_unit: '後ろへ%1%2動かす %3',
            zerone_turn_unit_in_place: '所定位置で%1に%2%3回す %4',
            zerone_change_both_wheels_by: '左車輪を%1右車輪を%2ずつ変える %3',
            zerone_set_both_wheels_to: '左車輪を%1右車輪を%2にする %3',
            zerone_change_wheel_by: '%1車輪を%2ずつ変える %3',
            zerone_set_wheel_to: '%1車輪を%2にする %3',
            zerone_follow_line: '線に沿って移動する %1',
            zerone_follow_line_until: '線に沿って %1 まで移動する %2',
            zerone_follow_line_until_intersection: '線にそって交差点まで移動する %1',
            zerone_cross_intersection: '交差点を渡る %1',
            zerone_turn_at_intersection: '交差点で %1 へ回る %2',
            zerone_jump_line: '%1 線へ渡り行く %2',
            zerone_set_following_speed_to: '線に沿って移動する速さを %1 にする %2',
            zerone_stop: '停止する %1',
            zerone_set_led_to: '%1LEDを%2にする %3',
            zerone_pick_led: '%1LEDを%2にする %3',
            zerone_change_led_by_rgb: '%1LEDをR:%2G:%3B:%4ずつ変える %5',
            zerone_set_led_to_rgb: '%1LEDをR:%2G:%3B:%4にする %5',
            zerone_clear_led: '%1LEDを消す %2',
            zerone_play_sound_times: '%1音を%2回鳴らす %3',
            zerone_play_sound_times_until_done: '終わるまで%1音を%2回鳴らす %3',
            zerone_change_buzzer_by: 'ブザー音を%1ずつ変える %2',
            zerone_set_buzzer_to: 'ブザー音を%1にする %2',
            zerone_clear_sound: '音を止める %1',
            zerone_play_note: '%1%2音を鳴らす %3',
            zerone_play_note_for: '%1%2音を%3拍鳴らす %4',
            zerone_rest_for: '%1拍休む %2',
            zerone_change_tempo_by: 'テンポを%1ずつ変える %2',
            zerone_set_tempo_to: 'テンポを%1BPMにする %2',
        },
        Helper: {
            zerone_is_gesture:
                'If the gesture sensor detects the selected gesture, true, otherwise false.',
            zerone_touching_color:
                'If the color sensor detects the selected color, true, otherwise false.',
            zerone_is_color_pattern: '選択された色パターンをカラーセンサーが感知したら「正しい」と判断して、それ以外の場合は｢正しくない｣と判断します。',
            zerone_button_state: 'ボタンをクリックしたら、/ダブルクリックしたら、/長く押したら「正しい」と判断して、それ以外の場合は｢正しくない｣と判断します。',
            zerone_boolean:
                'battery normal: If the battery is enough, true, otherwise false<br/>battery low: If the battery is low, true, otherwise false<br/>battery empty: If the battery is empty, true, otherwise false',
            zerone_value:
                'left proximity: value of left proximity sensor (range: 0 to 255, initial value: 0)<br/>right proximity: value of right proximity sensor (range: 0 to 255, initial value: 0)<br/>front proximity: value of front proximity sensor (range: 0 to 255, initial value: 0)<br/>rear proximity: value of rear proximity sensor (range: 0 to 255, initial value: 0)<br/>gesture: gesture number detected by the gesture sensor (range: -1 ~ 6, initial value: -1)<br/>color number: color number detected by the color sensor (range: -1 to 6, initial value: -1)<br/>color r: red component of color detected by the color sensor (range: 0 ~ 255, initial value: 0)<br/>color g: green component of color detected by the color sensor (range: 0 ~ 255, initial value: 0)<br/>color b: blue component of color detected by the color sensor (range: 0 ~ 255, initial value: 0)<br/>signal strength: signal strength of Bluetooth communication (range: -128 to 0 dBm, initial value: 0) As the signal strength increases, the value increases.',
            zerone_move_forward_unit: 'Moves forward for the number of cm/seconds/pulses entered.',
            zerone_move_backward_unit:
                'Moves backward for the number of cm/seconds/pulses entered.',
            zerone_turn_unit_in_place:
                'Turns left/right in place for the number of degrees/seconds/pulses entered.',
            zerone_change_both_wheels_by:
                'Adds the entered values to the current velocity values (%) of the left and right wheels respectively. If the result is positive, the wheel rotates forward; if negative, the wheel rotates backward.',
            zerone_set_both_wheels_to:
                'Sets the velocity of the left and right wheels to the entered values (-100 to 100%), respectively. If you enter a positive value, the wheel rotates forward. If you enter a negative value, the wheel rotates backward. Entering the number 0 stops it.',
            zerone_change_wheel_by:
                'Adds the entered value to the current velocity value (%) of the left/right/both wheels. If the result is positive, the wheel rotates forward; if negative, the wheel rotates backward.',
            zerone_set_wheel_to:
                'Sets the velocity of the left/right/both wheels to the entered value (-100 to 100%). If you enter a positive value, the wheel rotates forward. If you enter a negative value, the wheel rotates backward. Entering the number 0 stops it.',
            zerone_follow_line: '下地が白色の上、黒色線に沿って移動します。',
            zerone_follow_line_until: '下地が白色の上で黒の線に沿って移動している途中、選択した色をカラーセンサーが感知すると停止します。',
            zerone_follow_line_until_intersection: '下地が白色の上で黒の線に沿って移動している途中、黒色交差点をカラーセンサーが感知すると停止します。',
            zerone_cross_intersection: '黒色交差点でしばらく前に移動した後、黒線を探します。',
            zerone_turn_at_intersection: '黒色交差点でしばらく前に移動した後、その場で左/右/後ろに回転して黒線を探します。',
            zerone_jump_line: 'その場で左/右に90度回転した後、前方に移動している途中のカラーセンサーが黒線を検出すると元の方向に戻って回転します。',
            zerone_set_following_speed_to: '線に沿って移動する速度(1〜8)を設定します。数字が大きいほど移動速度が速くなります。',
            zerone_stop: 'Stops both wheels.',
            zerone_set_led_to: 'Turns the selected LED to the selected color.',
            zerone_pick_led: 'Turns the selected LED to the selected color.',
            zerone_change_led_by_rgb:
                'Adds the entered values to the current R, G, B values of the selected LED, respectively.',
            zerone_set_led_to_rgb:
                'Sets the R, G, B values of the selected LED to the entered values.',
            zerone_clear_led: 'Turns off the selected LED.',
            zerone_play_sound_times: 'Plays the selected sound as many times as entered.',
            zerone_play_sound_times_until_done:
                'Plays the selected sound as many times as entered, and waits for completion.',
            zerone_change_buzzer_by:
                'Adds the entered value to the current pitch (Hz) of the buzzer sound. You can enter up to one decimal place.',
            zerone_set_buzzer_to:
                'Sets the pitch of the buzzer sound to the entered value (Hz). You can enter up to one decimal place. Entering the number 0 turns off the buzzer sound.',
            zerone_clear_sound: 'Turns off sound.',
            zerone_play_note: 'It sounds the selected tone and octave.',
            zerone_play_note_for:
                'It sounds the selected tone and octave as much as the beat you entered.',
            zerone_rest_for: 'Rests as much as the beat you entered.',
            zerone_change_tempo_by:
                'Adds the entered value to the current BPM (beats per minute) of the playing or resting speed.',
            zerone_set_tempo_to:
                'Sets the playing or resting speed to the entered BPM (beats per minute).',
        },
        Blocks: {
            ROBOID_monitor_buzzer: 'ブザー',
            ROBOID_monitor_note: '音符',
            ROBOID_monitor_left_wheel: '左車輪',
            ROBOID_monitor_right_wheel: '右車輪',
            ROBOID_monitor_left_head_led: '左前LED',
            ROBOID_monitor_right_head_led: '右前LED',
            ROBOID_monitor_left_tail_led: '左後LED',
            ROBOID_monitor_right_tail_led: '右後LED',
            ROBOID_gesture_forward: '前へ',
            ROBOID_gesture_backward: '後ろへ',
            ROBOID_gesture_leftward: '左へ',
            ROBOID_gesture_rightward: '右へ',
            ROBOID_gesture_near: '近く',
            ROBOID_gesture_far: '遠く',
            ROBOID_gesture_click: 'クリック',
            ROBOID_gesture_long_touch: '長くタッチ',
            ROBOID_color_red: '赤色',
            ROBOID_color_orange: '橙色',
            ROBOID_color_yellow: '黄色',
            ROBOID_color_green: '緑色',
            ROBOID_color_sky_blue: '水色',
            ROBOID_color_blue: '青色',
            ROBOID_color_violet: '青紫色',
            ROBOID_color_purple: '紫色',
            ROBOID_color_white: '白色',
            ROBOID_color_black: '黒色',
            ROBOID_color_any: '全ての色',
            ROBOID_clicked: 'クリックしたか',
            ROBOID_double_clicked: 'ダブルクリックしたか',
            ROBOID_long_pressed: '長く押したか',
            ROBOID_battery_state_normal: '正常か',
            ROBOID_battery_state_low: '足りないか',
            ROBOID_battery_state_empty: 'ないか',
            ROBOID_sensor_left_proximity: '左近接センサー',
            ROBOID_sensor_right_proximity: '右近接センサー',
            ROBOID_sensor_front_proximity: '前近接センサー',
            ROBOID_sensor_rear_proximity: '後近接センサー',
            ROBOID_sensor_gesture: 'ジェスチャー',
            ROBOID_sensor_color_number: '色番号',
            ROBOID_sensor_color_pattern: '色パターン',
            ROBOID_sensor_color_r: '色R',
            ROBOID_sensor_color_g: '色G',
            ROBOID_sensor_color_b: '色B',
            ROBOID_sensor_floor: '床底センサー',
            ROBOID_sensor_button: 'ボタン',
            ROBOID_sensor_signal_strength: '信号強度',
            ROBOID_gesture: 'ジェスチャー',
            ROBOID_color: '色',
            ROBOID_unit_cm: 'cm',
            ROBOID_unit_sec: '秒',
            ROBOID_unit_pulse: 'パルス',
            ROBOID_unit_deg: '度',
            ROBOID_left: '左',
            ROBOID_right: '右',
            ROBOID_both: '両',
            ROBOID_head: '前',
            ROBOID_tail: '後',
            ROBOID_all: 'すべて',
            ROBOID_led_left_head: '左前',
            ROBOID_led_right_head: '右前',
            ROBOID_led_left_tail: '左後',
            ROBOID_led_right_tail: '右後',
            ROBOID_sound_beep: 'ビープ',
            ROBOID_sound_random_beep: 'ランダムビープ',
            ROBOID_sound_noise: 'ノイズ',
            ROBOID_sound_siren: 'サイレン',
            ROBOID_sound_engine: 'エンジン',
            ROBOID_sound_chop: 'チョップ',
            ROBOID_sound_robot: 'ロボット',
            ROBOID_sound_dibidibidip: 'ディバディバディップ',
            ROBOID_sound_good_job: 'よくやった',
            ROBOID_sound_happy: '幸福',
            ROBOID_sound_angry: '怒った',
            ROBOID_sound_sad: '悲しみ',
            ROBOID_sound_sleep: '睡眠',
            ROBOID_sound_march: '行進',
            ROBOID_sound_birthday: '誕生',
            ROBOID_note_c: 'ド',
            ROBOID_note_c_sharp: 'ド♯(レ♭)',
            ROBOID_note_d: 'レ',
            ROBOID_note_d_sharp: 'レ♯(ミ♭)',
            ROBOID_note_e: 'ミ',
            ROBOID_note_f: 'ファ',
            ROBOID_note_f_sharp: 'ファ♯(ソ♭)',
            ROBOID_note_g: 'ソ',
            ROBOID_note_g_sharp: 'ソ♯(ラ♭)',
            ROBOID_note_a: 'ラ',
            ROBOID_note_a_sharp: 'ラ♯(シ♭)',
            ROBOID_note_b: 'シ',
        },
    },
    vn: {
        template: {
            zerone_is_gesture: 'gesture %1?',
            zerone_touching_color: 'touching %1?',
            zerone_is_color_pattern: 'color pattern %1 %2 ?',
            zerone_button_state: 'button %1 ?',
            zerone_boolean: 'battery %1?',
            zerone_value: '%1',
            zerone_move_forward_unit: 'move forward %1 %2 %3',
            zerone_move_backward_unit: 'move backward %1 %2 %3',
            zerone_turn_unit_in_place: 'turn %1 %2 %3 in place %4',
            zerone_change_both_wheels_by: 'change wheels by left: %1 right: %2 %3',
            zerone_set_both_wheels_to: 'set wheels to left: %1 right: %2 %3',
            zerone_change_wheel_by: 'change %1 wheel by %2 %3',
            zerone_set_wheel_to: 'set %1 wheel to %2 %3',
            zerone_follow_line: 'follow line %1',
            zerone_follow_line_until: 'follow line until %1 %2',
            zerone_follow_line_until_intersection: 'follow line until intersection %1',
            zerone_cross_intersection: 'cross intersection %1',
            zerone_turn_at_intersection: 'turn %1 at intersection %2',
            zerone_jump_line: 'jump to %1 line %2',
            zerone_set_following_speed_to: 'set following speed to %1 %2',
            zerone_stop: 'stop %1',
            zerone_set_led_to: 'set %1 led to %2 %3',
            zerone_pick_led: 'set %1 led to %2 %3',
            zerone_change_led_by_rgb: 'change %1 led by r: %2 g: %3 b: %4 %5',
            zerone_set_led_to_rgb: 'set %1 led to r: %2 g: %3 b: %4 %5',
            zerone_clear_led: 'clear %1 led %2',
            zerone_play_sound_times: 'play sound %1 %2 times %3',
            zerone_play_sound_times_until_done: 'play sound %1 %2 times until done %3',
            zerone_change_buzzer_by: 'change buzzer by %1 %2',
            zerone_set_buzzer_to: 'set buzzer to %1 %2',
            zerone_clear_sound: 'clear sound %1',
            zerone_play_note: 'play note %1 %2 %3',
            zerone_play_note_for: 'play note %1 %2 for %3 beats %4',
            zerone_rest_for: 'rest for %1 beats %2',
            zerone_change_tempo_by: 'change tempo by %1 %2',
            zerone_set_tempo_to: 'set tempo to %1 bpm %2',
        },
        Helper: {
            zerone_is_gesture:
                'If the gesture sensor detects the selected gesture, true, otherwise false.',
            zerone_touching_color:
                'If the color sensor detects the selected color, true, otherwise false.',
            zerone_is_color_pattern: 'If the color sensor detects the selected color pattern, true, otherwise false.',
            zerone_button_state: 'If the button clicked/double-clicked/long-pressed, true, otherwise false.',
            zerone_boolean:
                'battery normal: If the battery is enough, true, otherwise false<br/>battery low: If the battery is low, true, otherwise false<br/>battery empty: If the battery is empty, true, otherwise false',
            zerone_value:
                'left proximity: value of left proximity sensor (range: 0 to 255, initial value: 0)<br/>right proximity: value of right proximity sensor (range: 0 to 255, initial value: 0)<br/>front proximity: value of front proximity sensor (range: 0 to 255, initial value: 0)<br/>rear proximity: value of rear proximity sensor (range: 0 to 255, initial value: 0)<br/>gesture: gesture number detected by the gesture sensor (range: -1 ~ 6, initial value: -1)<br/>color number: color number detected by the color sensor (range: -1 to 6, initial value: -1)<br/>color r: red component of color detected by the color sensor (range: 0 ~ 255, initial value: 0)<br/>color g: green component of color detected by the color sensor (range: 0 ~ 255, initial value: 0)<br/>color b: blue component of color detected by the color sensor (range: 0 ~ 255, initial value: 0)<br/>signal strength: signal strength of Bluetooth communication (range: -128 to 0 dBm, initial value: 0) As the signal strength increases, the value increases.',
            zerone_move_forward_unit: 'Moves forward for the number of cm/seconds/pulses entered.',
            zerone_move_backward_unit:
                'Moves backward for the number of cm/seconds/pulses entered.',
            zerone_turn_unit_in_place:
                'Turns left/right in place for the number of degrees/seconds/pulses entered.',
            zerone_change_both_wheels_by:
                'Adds the entered values to the current velocity values (%) of the left and right wheels respectively. If the result is positive, the wheel rotates forward; if negative, the wheel rotates backward.',
            zerone_set_both_wheels_to:
                'Sets the velocity of the left and right wheels to the entered values (-100 to 100%), respectively. If you enter a positive value, the wheel rotates forward. If you enter a negative value, the wheel rotates backward. Entering the number 0 stops it.',
            zerone_change_wheel_by:
                'Adds the entered value to the current velocity value (%) of the left/right/both wheels. If the result is positive, the wheel rotates forward; if negative, the wheel rotates backward.',
            zerone_set_wheel_to:
                'Sets the velocity of the left/right/both wheels to the entered value (-100 to 100%). If you enter a positive value, the wheel rotates forward. If you enter a negative value, the wheel rotates backward. Entering the number 0 stops it.',
            zerone_follow_line: 'Moves along the black line on a white background.',
            zerone_follow_line_until: 'Moves along the black line on a white background and stops when the color sensor detects the selected color.',
            zerone_follow_line_until_intersection: 'Moves along the black line on a white background and stops when the color sensor detects the black intersection.',
            zerone_cross_intersection: 'Moves forward for a moment at the black intersection, then finds the black line.',
            zerone_turn_at_intersection: 'Moves forward for a moment at the black intersection, then turns left/right/back in place and finds the black line.',
            zerone_jump_line: 'Turns left/right 90 degrees in place and moves forward. Stops when the color sensor detects the black line and turns to its original direction.',
            zerone_set_following_speed_to: 'Sets the speed (1 to 8) to move along the line. The larger the number, the faster the movement.',
            zerone_stop: 'Stops both wheels.',
            zerone_set_led_to: 'Turns the selected LED to the selected color.',
            zerone_pick_led: 'Turns the selected LED to the selected color.',
            zerone_change_led_by_rgb:
                'Adds the entered values to the current R, G, B values of the selected LED, respectively.',
            zerone_set_led_to_rgb:
                'Sets the R, G, B values of the selected LED to the entered values.',
            zerone_clear_led: 'Turns off the selected LED.',
            zerone_play_sound_times: 'Plays the selected sound as many times as entered.',
            zerone_play_sound_times_until_done:
                'Plays the selected sound as many times as entered, and waits for completion.',
            zerone_change_buzzer_by:
                'Adds the entered value to the current pitch (Hz) of the buzzer sound. You can enter up to one decimal place.',
            zerone_set_buzzer_to:
                'Sets the pitch of the buzzer sound to the entered value (Hz). You can enter up to one decimal place. Entering the number 0 turns off the buzzer sound.',
            zerone_clear_sound: 'Turns off sound.',
            zerone_play_note: 'It sounds the selected tone and octave.',
            zerone_play_note_for:
                'It sounds the selected tone and octave as much as the beat you entered.',
            zerone_rest_for: 'Rests as much as the beat you entered.',
            zerone_change_tempo_by:
                'Adds the entered value to the current BPM (beats per minute) of the playing or resting speed.',
            zerone_set_tempo_to:
                'Sets the playing or resting speed to the entered BPM (beats per minute).',
        },
        Blocks: {
            ROBOID_monitor_buzzer: 'buzzer',
            ROBOID_monitor_note: 'note',
            ROBOID_monitor_left_wheel: 'left wheel',
            ROBOID_monitor_right_wheel: 'right wheel',
            ROBOID_monitor_left_head_led: 'left head led',
            ROBOID_monitor_right_head_led: 'right head led',
            ROBOID_monitor_left_tail_led: 'left tail led',
            ROBOID_monitor_right_tail_led: 'right tail led',
            ROBOID_gesture_forward: 'forward',
            ROBOID_gesture_backward: 'backward',
            ROBOID_gesture_leftward: 'leftward',
            ROBOID_gesture_rightward: 'rightward',
            ROBOID_gesture_near: 'near',
            ROBOID_gesture_far: 'far',
            ROBOID_gesture_click: 'click',
            ROBOID_gesture_long_touch: 'long touch',
            ROBOID_color_red: 'red',
            ROBOID_color_orange: 'orange',
            ROBOID_color_yellow: 'yellow',
            ROBOID_color_green: 'green',
            ROBOID_color_sky_blue: 'sky blue',
            ROBOID_color_blue: 'blue',
            ROBOID_color_violet: 'violet',
            ROBOID_color_purple: 'purple',
            ROBOID_color_white: 'white',
            ROBOID_color_black: 'black',
            ROBOID_color_any: 'any color',
            ROBOID_clicked: 'clicked',
            ROBOID_double_clicked: 'double-clicked',
            ROBOID_long_pressed: 'long-pressed',
            ROBOID_battery_state_normal: 'normal',
            ROBOID_battery_state_low: 'low',
            ROBOID_battery_state_empty: 'empty',
            ROBOID_sensor_left_proximity: 'left proximity',
            ROBOID_sensor_right_proximity: 'right proximity',
            ROBOID_sensor_front_proximity: 'front proximity',
            ROBOID_sensor_rear_proximity: 'rear proximity',
            ROBOID_sensor_gesture: 'gesture',
            ROBOID_sensor_color_number: 'color number',
            ROBOID_sensor_color_pattern: 'color pattern',
            ROBOID_sensor_color_r: 'color r',
            ROBOID_sensor_color_g: 'color g',
            ROBOID_sensor_color_b: 'color b',
            ROBOID_sensor_floor: 'floor',
            ROBOID_sensor_button: 'button',
            ROBOID_sensor_signal_strength: 'signal strength',
            ROBOID_gesture: 'gesture',
            ROBOID_color: 'color',
            ROBOID_unit_cm: 'cm',
            ROBOID_unit_sec: 'seconds',
            ROBOID_unit_pulse: 'pulses',
            ROBOID_unit_deg: 'degrees',
            ROBOID_left: 'left',
            ROBOID_right: 'right',
            ROBOID_both: 'both',
            ROBOID_head: 'head',
            ROBOID_tail: 'tail',
            ROBOID_all: 'all',
            ROBOID_led_left_head: 'left head',
            ROBOID_led_right_head: 'right head',
            ROBOID_led_left_tail: 'left tail',
            ROBOID_led_right_tail: 'right tail',
            ROBOID_sound_beep: 'beep',
            ROBOID_sound_random_beep: 'random beep',
            ROBOID_sound_noise: 'noise',
            ROBOID_sound_siren: 'siren',
            ROBOID_sound_engine: 'engine',
            ROBOID_sound_chop: 'chop',
            ROBOID_sound_robot: 'robot',
            ROBOID_sound_dibidibidip: 'dibidibidip',
            ROBOID_sound_good_job: 'good job',
            ROBOID_sound_happy: 'happy',
            ROBOID_sound_angry: 'angry',
            ROBOID_sound_sad: 'sad',
            ROBOID_sound_sleep: 'sleep',
            ROBOID_sound_march: 'march',
            ROBOID_sound_birthday: 'birthday',
            ROBOID_note_c: 'C',
            ROBOID_note_c_sharp: 'C♯(D♭)',
            ROBOID_note_d: 'D',
            ROBOID_note_d_sharp: 'D♯(E♭)',
            ROBOID_note_e: 'E',
            ROBOID_note_f: 'F',
            ROBOID_note_f_sharp: 'F♯(G♭)',
            ROBOID_note_g: 'G',
            ROBOID_note_g_sharp: 'G♯(A♭)',
            ROBOID_note_a: 'A',
            ROBOID_note_a_sharp: 'A♯(B♭)',
            ROBOID_note_b: 'B',
        },
    },
});

Entry.Zerone.blockMenuBlocks = [
    'zerone_value',
    'zerone_is_gesture',
    'zerone_touching_color',
    'zerone_is_color_pattern',
    'zerone_button_state',
    'zerone_boolean',
    'zerone_move_forward_unit',
    'zerone_move_backward_unit',
    'zerone_turn_unit_in_place',
    'zerone_change_both_wheels_by',
    'zerone_set_both_wheels_to',
    'zerone_change_wheel_by',
    'zerone_set_wheel_to',
    'zerone_follow_line',
    'zerone_follow_line_until',
    'zerone_follow_line_until_intersection',
    'zerone_cross_intersection',
    'zerone_turn_at_intersection',
    'zerone_jump_line',
    'zerone_set_following_speed_to',
    'zerone_stop',
    'zerone_set_led_to',
    'zerone_pick_led',
    'zerone_change_led_by_rgb',
    'zerone_set_led_to_rgb',
    'zerone_clear_led',
    'zerone_play_sound_times',
    'zerone_play_sound_times_until_done',
    'zerone_change_buzzer_by',
    'zerone_set_buzzer_to',
    'zerone_clear_sound',
    'zerone_play_note',
    'zerone_play_note_for',
    'zerone_rest_for',
    'zerone_change_tempo_by',
    'zerone_set_tempo_to',
];

Entry.Zerone.getBlocks = function() {
    return {
        zerone_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.ROBOID_sensor_left_proximity, 'LEFT_PROXIMITY'],
                        [Lang.Blocks.ROBOID_sensor_right_proximity, 'RIGHT_PROXIMITY'],
                        [Lang.Blocks.ROBOID_sensor_front_proximity, 'FRONT_PROXIMITY'],
                        [Lang.Blocks.ROBOID_sensor_rear_proximity, 'REAR_PROXIMITY'],
                        [Lang.Blocks.ROBOID_sensor_gesture, 'GESTURE'],
                        [Lang.Blocks.ROBOID_sensor_color_number, 'COLOR_NUMBER'],
                        [Lang.Blocks.ROBOID_sensor_color_pattern, 'COLOR_PATTERN'],
                        [Lang.Blocks.ROBOID_sensor_color_r, 'COLOR_R'],
                        [Lang.Blocks.ROBOID_sensor_color_g, 'COLOR_G'],
                        [Lang.Blocks.ROBOID_sensor_color_b, 'COLOR_B'],
                        [Lang.Blocks.ROBOID_sensor_floor, 'FLOOR'],
                        [Lang.Blocks.ROBOID_sensor_button, 'BUTTON'],
                        [Lang.Blocks.ROBOID_sensor_signal_strength, 'SIGNAL_STRENGTH'],
                    ],
                    value: 'LEFT_PROXIMITY',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'zerone_value',
            },
            paramsKeyMap: {
                DEVICE: 0,
            },
            class: 'zerone_sensor',
            isNotFor: ['zerone'],
            func(sprite, script) {
                const robot = Entry.Zerone.getRobot();
                if (robot) {
                    return robot.getValue(script);
                }
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Zerone.sensor_value(%1)',
                        blockType: 'param',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.ROBOID_sensor_left_proximity, 'LEFT_PROXIMITY'],
                                    [Lang.Blocks.ROBOID_sensor_right_proximity, 'RIGHT_PROXIMITY'],
                                    [Lang.Blocks.ROBOID_sensor_front_proximity, 'FRONT_PROXIMITY'],
                                    [Lang.Blocks.ROBOID_sensor_rear_proximity, 'REAR_PROXIMITY'],
                                    [Lang.Blocks.ROBOID_sensor_gesture, 'GESTURE'],
                                    [Lang.Blocks.ROBOID_sensor_color_number, 'COLOR_NUMBER'],
                                    [Lang.Blocks.ROBOID_sensor_color_pattern, 'COLOR_PATTERN'],
                                    [Lang.Blocks.ROBOID_sensor_color_r, 'COLOR_R'],
                                    [Lang.Blocks.ROBOID_sensor_color_g, 'COLOR_G'],
                                    [Lang.Blocks.ROBOID_sensor_color_b, 'COLOR_B'],
                                    [Lang.Blocks.ROBOID_sensor_floor, 'FLOOR'],
                                    [Lang.Blocks.ROBOID_sensor_button, 'BUTTON'],
                                    [Lang.Blocks.ROBOID_sensor_signal_strength, 'SIGNAL_STRENGTH'],
                                ],
                                value: 'LEFT_PROXIMITY',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                        ],
                    },
                ],
            },
        },
        zerone_is_gesture: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.ROBOID_gesture_forward, 'FORWARD'],
                        [Lang.Blocks.ROBOID_gesture_backward, 'BACKWARD'],
                        [Lang.Blocks.ROBOID_gesture_leftward, 'LEFTWARD'],
                        [Lang.Blocks.ROBOID_gesture_rightward, 'RIGHTWARD'],
                        [Lang.Blocks.ROBOID_gesture_near, 'NEAR'],
                        [Lang.Blocks.ROBOID_gesture_far, 'FAR'],
                        [Lang.Blocks.ROBOID_gesture_long_touch, 'LONG_TOUCH'],
                    ],
                    value: 'FORWARD',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'zerone_is_gesture',
            },
            paramsKeyMap: {
                GESTURE: 0,
            },
            class: 'zerone_sensor',
            isNotFor: ['zerone'],
            func(sprite, script) {
                const robot = Entry.Zerone.getRobot();
                return robot ? robot.checkGesture(script) : false;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Zerone.is_gesture(%1)',
                        blockType: 'param',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.ROBOID_gesture_forward, 'FORWARD'],
                                    [Lang.Blocks.ROBOID_gesture_backward, 'BACKWARD'],
                                    [Lang.Blocks.ROBOID_gesture_leftward, 'LEFTWARD'],
                                    [Lang.Blocks.ROBOID_gesture_rightward, 'RIGHTWARD'],
                                    [Lang.Blocks.ROBOID_gesture_near, 'NEAR'],
                                    [Lang.Blocks.ROBOID_gesture_far, 'FAR'],
                                    [Lang.Blocks.ROBOID_gesture_long_touch, 'LONG_TOUCH'],
                                ],
                                value: 'FORWARD',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                        ],
                    },
                ],
            },
        },
        zerone_touching_color: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.ROBOID_color_red, 'RED'],
                        [Lang.Blocks.ROBOID_color_orange, 'ORANGE'],
                        [Lang.Blocks.ROBOID_color_yellow, 'YELLOW'],
                        [Lang.Blocks.ROBOID_color_green, 'GREEN'],
                        [Lang.Blocks.ROBOID_color_sky_blue, 'SKY_BLUE'],
                        [Lang.Blocks.ROBOID_color_blue, 'BLUE'],
                        [Lang.Blocks.ROBOID_color_purple, 'PURPLE'],
                        [Lang.Blocks.ROBOID_color_black, 'BLACK'],
                        [Lang.Blocks.ROBOID_color_white, 'WHITE'],
                    ],
                    value: 'RED',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'zerone_touching_color',
            },
            paramsKeyMap: {
                COLOR: 0,
            },
            class: 'zerone_sensor',
            isNotFor: ['zerone'],
            func(sprite, script) {
                const robot = Entry.Zerone.getRobot();
                return robot ? robot.checkTouchingColor(script) : false;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Zerone.is_color(%1)',
                        blockType: 'param',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.ROBOID_color_red, 'RED'],
                                    [Lang.Blocks.ROBOID_color_orange, 'ORANGE'],
                                    [Lang.Blocks.ROBOID_color_yellow, 'YELLOW'],
                                    [Lang.Blocks.ROBOID_color_green, 'GREEN'],
                                    [Lang.Blocks.ROBOID_color_sky_blue, 'SKY_BLUE'],
                                    [Lang.Blocks.ROBOID_color_blue, 'BLUE'],
                                    [Lang.Blocks.ROBOID_color_purple, 'PURPLE'],
                                    [Lang.Blocks.ROBOID_color_black, 'BLACK'],
                                    [Lang.Blocks.ROBOID_color_white, 'WHITE'],
                                ],
                                value: 'RED',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                        ],
                    },
                ],
            },
        },
        zerone_is_color_pattern: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.ROBOID_color_black, 'BLACK'],
                        [Lang.Blocks.ROBOID_color_red, 'RED'],
                        [Lang.Blocks.ROBOID_color_yellow, 'YELLOW'],
                        [Lang.Blocks.ROBOID_color_green, 'GREEN'],
                        [Lang.Blocks.ROBOID_color_sky_blue, 'SKY_BLUE'],
                        [Lang.Blocks.ROBOID_color_blue, 'BLUE'],
                        [Lang.Blocks.ROBOID_color_purple, 'PURPLE'],
                    ],
                    value: 'BLACK',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.ROBOID_color_black, 'BLACK'],
                        [Lang.Blocks.ROBOID_color_red, 'RED'],
                        [Lang.Blocks.ROBOID_color_yellow, 'YELLOW'],
                        [Lang.Blocks.ROBOID_color_green, 'GREEN'],
                        [Lang.Blocks.ROBOID_color_sky_blue, 'SKY_BLUE'],
                        [Lang.Blocks.ROBOID_color_blue, 'BLUE'],
                        [Lang.Blocks.ROBOID_color_purple, 'PURPLE'],
                    ],
                    value: 'RED',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [null, null],
                type: 'zerone_is_color_pattern',
            },
            paramsKeyMap: {
                COLOR1: 0,
                COLOR2: 1,
            },
            class: 'zerone_sensor',
            isNotFor: ['zerone'],
            func(sprite, script) {
                const robot = Entry.Zerone.getRobot();
                return robot ? robot.checkColorPattern(script) : false;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Zerone.is_color_pattern(%1, %2)',
                        blockType: 'param',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.ROBOID_color_black, 'BLACK'],
                                    [Lang.Blocks.ROBOID_color_red, 'RED'],
                                    [Lang.Blocks.ROBOID_color_yellow, 'YELLOW'],
                                    [Lang.Blocks.ROBOID_color_green, 'GREEN'],
                                    [Lang.Blocks.ROBOID_color_sky_blue, 'SKY_BLUE'],
                                    [Lang.Blocks.ROBOID_color_blue, 'BLUE'],
                                    [Lang.Blocks.ROBOID_color_purple, 'PURPLE'],
                                ],
                                value: 'BLACK',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.ROBOID_color_black, 'BLACK'],
                                    [Lang.Blocks.ROBOID_color_red, 'RED'],
                                    [Lang.Blocks.ROBOID_color_yellow, 'YELLOW'],
                                    [Lang.Blocks.ROBOID_color_green, 'GREEN'],
                                    [Lang.Blocks.ROBOID_color_sky_blue, 'SKY_BLUE'],
                                    [Lang.Blocks.ROBOID_color_blue, 'BLUE'],
                                    [Lang.Blocks.ROBOID_color_purple, 'PURPLE'],
                                ],
                                value: 'RED',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                        ],
                    },
                ],
            },
        },
        zerone_button_state: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.ROBOID_clicked, 'CLICKED'],
                        [Lang.Blocks.ROBOID_double_clicked, 'DOUBLE_CLICKED'],
                        [Lang.Blocks.ROBOID_long_pressed, 'LONG_PRESSED'],
                    ],
                    value: 'CLICKED',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'zerone_button_state',
            },
            paramsKeyMap: {
                STATE: 0,
            },
            class: 'zerone_sensor',
            isNotFor: ['zerone'],
            func(sprite, script) {
                const robot = Entry.Zerone.getRobot();
                return robot ? robot.checkButtonState(script) : false;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Zerone.is_button(%1)',
                        blockType: 'param',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.ROBOID_clicked, 'CLICKED'],
                                    [Lang.Blocks.ROBOID_double_clicked, 'DOUBLE_CLICKED'],
                                    [Lang.Blocks.ROBOID_long_pressed, 'LONG_PRESSED'],
                                ],
                                value: 'CLICKED',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                        ],
                    },
                ],
            },
        },
        zerone_boolean: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.ROBOID_battery_state_normal, 'BATTERY_NORMAL'],
                        [Lang.Blocks.ROBOID_battery_state_low, 'BATTERY_LOW'],
                        [Lang.Blocks.ROBOID_battery_state_empty, 'BATTERY_EMPTY'],
                    ],
                    value: 'BATTERY_NORMAL',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [],
                type: 'zerone_boolean',
            },
            paramsKeyMap: {
                STATE: 0,
            },
            class: 'zerone_sensor',
            isNotFor: ['zerone'],
            func(sprite, script) {
                const robot = Entry.Zerone.getRobot();
                return robot ? robot.checkBoolean(script) : false;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Zerone.boolean_value(%1)',
                        blockType: 'param',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.ROBOID_battery_state_normal, 'BATTERY_NORMAL'],
                                    [Lang.Blocks.ROBOID_battery_state_low, 'BATTERY_LOW'],
                                    [Lang.Blocks.ROBOID_battery_state_empty, 'BATTERY_EMPTY'],
                                ],
                                value: 'BATTERY_NORMAL',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                        ],
                    },
                ],
            },
        },
        zerone_move_forward_unit: {
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
                        [Lang.Blocks.ROBOID_unit_cm, 'CM'],
                        [Lang.Blocks.ROBOID_unit_sec, 'SEC'],
                        [Lang.Blocks.ROBOID_unit_pulse, 'PULSE'],
                    ],
                    value: 'CM',
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
                        type: 'text',
                        params: ['6'],
                    },
                    null,
                    null,
                ],
                type: 'zerone_move_forward_unit',
            },
            paramsKeyMap: {
                VALUE: 0,
                UNIT: 1,
            },
            class: 'zerone_wheel',
            isNotFor: ['zerone'],
            func(sprite, script) {
                const robot = Entry.Zerone.getRobot();
                return robot ? robot.moveForwardUnit(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Zerone.move_forward(%1, %2)',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.ROBOID_unit_cm, 'CM'],
                                    [Lang.Blocks.ROBOID_unit_sec, 'SEC'],
                                    [Lang.Blocks.ROBOID_unit_pulse, 'PULSE'],
                                ],
                                value: 'CM',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                        ],
                    },
                ],
            },
        },
        zerone_move_backward_unit: {
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
                        [Lang.Blocks.ROBOID_unit_cm, 'CM'],
                        [Lang.Blocks.ROBOID_unit_sec, 'SEC'],
                        [Lang.Blocks.ROBOID_unit_pulse, 'PULSE'],
                    ],
                    value: 'CM',
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
                        type: 'text',
                        params: ['6'],
                    },
                    null,
                    null,
                ],
                type: 'zerone_move_backward_unit',
            },
            paramsKeyMap: {
                VALUE: 0,
                UNIT: 1,
            },
            class: 'zerone_wheel',
            isNotFor: ['zerone'],
            func(sprite, script) {
                const robot = Entry.Zerone.getRobot();
                return robot ? robot.moveBackwardUnit(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Zerone.move_backward(%1, %2)',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.ROBOID_unit_cm, 'CM'],
                                    [Lang.Blocks.ROBOID_unit_sec, 'SEC'],
                                    [Lang.Blocks.ROBOID_unit_pulse, 'PULSE'],
                                ],
                                value: 'CM',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                        ],
                    },
                ],
            },
        },
        zerone_turn_unit_in_place: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.ROBOID_left, 'LEFT'],
                        [Lang.Blocks.ROBOID_right, 'RIGHT'],
                    ],
                    value: 'LEFT',
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
                        [Lang.Blocks.ROBOID_unit_deg, 'DEG'],
                        [Lang.Blocks.ROBOID_unit_sec, 'SEC'],
                        [Lang.Blocks.ROBOID_unit_pulse, 'PULSE'],
                    ],
                    value: 'DEG',
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
                        type: 'text',
                        params: ['90'],
                    },
                    null,
                    null,
                ],
                type: 'zerone_turn_unit_in_place',
            },
            paramsKeyMap: {
                DIRECTION: 0,
                VALUE: 1,
                UNIT: 2,
            },
            class: 'zerone_wheel',
            isNotFor: ['zerone'],
            func(sprite, script) {
                const robot = Entry.Zerone.getRobot();
                return robot ? robot.turnUnit(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Zerone.turn(%1, %2, %3)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.ROBOID_left, 'LEFT'],
                                    [Lang.Blocks.ROBOID_right, 'RIGHT'],
                                ],
                                value: 'LEFT',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.ROBOID_unit_deg, 'DEG'],
                                    [Lang.Blocks.ROBOID_unit_sec, 'SEC'],
                                    [Lang.Blocks.ROBOID_unit_pulse, 'PULSE'],
                                ],
                                value: 'DEG',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                        ],
                    },
                ],
            },
        },
        zerone_change_both_wheels_by: {
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
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'text',
                        params: ['10'],
                    },
                    {
                        type: 'text',
                        params: ['10'],
                    },
                    null,
                ],
                type: 'zerone_change_both_wheels_by',
            },
            paramsKeyMap: {
                LEFT: 0,
                RIGHT: 1,
            },
            class: 'zerone_wheel',
            isNotFor: ['zerone'],
            func(sprite, script) {
                const robot = Entry.Zerone.getRobot();
                return robot ? robot.changeWheels(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Zerone.add_wheels(%1, %2)',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                        ],
                    },
                ],
            },
        },
        zerone_set_both_wheels_to: {
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
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'text',
                        params: ['50'],
                    },
                    {
                        type: 'text',
                        params: ['50'],
                    },
                    null,
                ],
                type: 'zerone_set_both_wheels_to',
            },
            paramsKeyMap: {
                LEFT: 0,
                RIGHT: 1,
            },
            class: 'zerone_wheel',
            isNotFor: ['zerone'],
            func(sprite, script) {
                const robot = Entry.Zerone.getRobot();
                return robot ? robot.setWheels(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Zerone.set_wheels(%1, %2)',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                        ],
                    },
                ],
            },
        },
        zerone_change_wheel_by: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.ROBOID_left, 'LEFT'],
                        [Lang.Blocks.ROBOID_right, 'RIGHT'],
                        [Lang.Blocks.ROBOID_both, 'BOTH'],
                    ],
                    value: 'LEFT',
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
                        type: 'text',
                        params: ['10'],
                    },
                    null,
                ],
                type: 'zerone_change_wheel_by',
            },
            paramsKeyMap: {
                WHEEL: 0,
                VELOCITY: 1,
            },
            class: 'zerone_wheel',
            isNotFor: ['zerone'],
            func(sprite, script) {
                const robot = Entry.Zerone.getRobot();
                return robot ? robot.changeWheel(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Zerone.add_wheel(%1, %2)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.ROBOID_left, 'LEFT'],
                                    [Lang.Blocks.ROBOID_right, 'RIGHT'],
                                    [Lang.Blocks.ROBOID_both, 'BOTH'],
                                ],
                                value: 'LEFT',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                        ],
                    },
                ],
            },
        },
        zerone_set_wheel_to: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.ROBOID_left, 'LEFT'],
                        [Lang.Blocks.ROBOID_right, 'RIGHT'],
                        [Lang.Blocks.ROBOID_both, 'BOTH'],
                    ],
                    value: 'LEFT',
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
                        type: 'text',
                        params: ['50'],
                    },
                    null,
                ],
                type: 'zerone_set_wheel_to',
            },
            paramsKeyMap: {
                WHEEL: 0,
                VELOCITY: 1,
            },
            class: 'zerone_wheel',
            isNotFor: ['zerone'],
            func(sprite, script) {
                const robot = Entry.Zerone.getRobot();
                return robot ? robot.setWheel(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Zerone.set_wheel(%1, %2)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.ROBOID_left, 'LEFT'],
                                    [Lang.Blocks.ROBOID_right, 'RIGHT'],
                                    [Lang.Blocks.ROBOID_both, 'BOTH'],
                                ],
                                value: 'LEFT',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                        ],
                    },
                ],
            },
        },
        zerone_follow_line: {
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
                params: [null],
                type: 'zerone_follow_line',
            },
            class: 'zerone_wheel',
            isNotFor: ['zerone'],
            func(sprite, script) {
                const robot = Entry.Zerone.getRobot();
                return robot ? robot.followLine(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Zerone.follow_line()',
                    },
                ],
            },
        },
        zerone_follow_line_until: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.ROBOID_color_red, 'RED'],
                        [Lang.Blocks.ROBOID_color_yellow, 'YELLOW'],
                        [Lang.Blocks.ROBOID_color_green, 'GREEN'],
                        [Lang.Blocks.ROBOID_color_sky_blue, 'SKY_BLUE'],
                        [Lang.Blocks.ROBOID_color_blue, 'BLUE'],
                        [Lang.Blocks.ROBOID_color_purple, 'PURPLE'],
                        [Lang.Blocks.ROBOID_color_any, 'ANY'],
                    ],
                    value: 'RED',
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
                type: 'zerone_follow_line_until',
            },
            paramsKeyMap: {
                COLOR: 0,
            },
            class: 'zerone_wheel',
            isNotFor: ['zerone'],
            func(sprite, script) {
                const robot = Entry.Zerone.getRobot();
                return robot ? robot.followLineUntil(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Zerone.follow_line_until(%1)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.ROBOID_color_red, 'RED'],
                                    [Lang.Blocks.ROBOID_color_yellow, 'YELLOW'],
                                    [Lang.Blocks.ROBOID_color_green, 'GREEN'],
                                    [Lang.Blocks.ROBOID_color_sky_blue, 'SKY_BLUE'],
                                    [Lang.Blocks.ROBOID_color_blue, 'BLUE'],
                                    [Lang.Blocks.ROBOID_color_purple, 'PURPLE'],
                                    [Lang.Blocks.ROBOID_color_any, 'ANY'],
                                ],
                                value: 'RED',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                        ],
                    },
                ],
            },
        },
        zerone_follow_line_until_intersection: {
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
                params: [null],
                type: 'zerone_follow_line_until_intersection',
            },
            class: 'zerone_wheel',
            isNotFor: ['zerone'],
            func(sprite, script) {
                const robot = Entry.Zerone.getRobot();
                return robot ? robot.followLineUntilIntersection(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Zerone.follow_line_until_cross()',
                    },
                ],
            },
        },
        zerone_cross_intersection: {
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
                params: [null],
                type: 'zerone_cross_intersection',
            },
            class: 'zerone_wheel',
            isNotFor: ['zerone'],
            func(sprite, script) {
                const robot = Entry.Zerone.getRobot();
                return robot ? robot.crossIntersection(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Zerone.cross_forward()',
                    },
                ],
            },
        },
        zerone_turn_at_intersection: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.ROBOID_left, 'LEFT'],
                        [Lang.Blocks.ROBOID_right, 'RIGHT'],
                        [Lang.Blocks.ROBOID_back, 'BACK'],
                    ],
                    value: 'LEFT',
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
                type: 'zerone_turn_at_intersection',
            },
            paramsKeyMap: {
                DIRECTION: 0,
            },
            class: 'zerone_wheel',
            isNotFor: ['zerone'],
            func(sprite, script) {
                const robot = Entry.Zerone.getRobot();
                return robot ? robot.turnAtIntersection(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Zerone.cross_turn(%1)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.ROBOID_left, 'LEFT'],
                                    [Lang.Blocks.ROBOID_right, 'RIGHT'],
                                    [Lang.Blocks.ROBOID_back, 'BACK'],
                                ],
                                value: 'LEFT',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                        ],
                    },
                ],
            },
        },
        zerone_jump_line: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.ROBOID_left, 'LEFT'],
                        [Lang.Blocks.ROBOID_right, 'RIGHT'],
                    ],
                    value: 'LEFT',
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
                type: 'zerone_jump_line',
            },
            paramsKeyMap: {
                DIRECTION: 0,
            },
            class: 'zerone_wheel',
            isNotFor: ['zerone'],
            func(sprite, script) {
                const robot = Entry.Zerone.getRobot();
                return robot ? robot.jumpLine(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Zerone.jump_line(%1)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.ROBOID_left, 'LEFT'],
                                    [Lang.Blocks.ROBOID_right, 'RIGHT'],
                                ],
                                value: 'LEFT',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                        ],
                    },
                ],
            },
        },
        zerone_set_following_speed_to: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
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
                params: ['4', null],
                type: 'zerone_set_following_speed_to',
            },
            paramsKeyMap: {
                SPEED: 0,
            },
            class: 'zerone_wheel',
            isNotFor: ['zerone'],
            func(sprite, script) {
                const robot = Entry.Zerone.getRobot();
                return robot ? robot.setLineTracerSpeed(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Zerone.set_line_speed(%1)',
                        textParams: [
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
                                ],
                                value: '1',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringOrNumberByValue,
                            },
                        ],
                    },
                ],
            },
        },
        zerone_stop: {
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
                params: [null],
                type: 'zerone_stop',
            },
            class: 'zerone_wheel',
            isNotFor: ['zerone'],
            func(sprite, script) {
                const robot = Entry.Zerone.getRobot();
                return robot ? robot.stop(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Zerone.stop()',
                    },
                ],
            },
        },
        zerone_set_led_to: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.ROBOID_led_left_head, 'LEFT_HEAD'],
                        [Lang.Blocks.ROBOID_led_right_head, 'RIGHT_HEAD'],
                        [Lang.Blocks.ROBOID_led_left_tail, 'LEFT_TAIL'],
                        [Lang.Blocks.ROBOID_led_right_tail, 'RIGHT_TAIL'],
                        [Lang.Blocks.ROBOID_left, 'LEFT'],
                        [Lang.Blocks.ROBOID_right, 'RIGHT'],
                        [Lang.Blocks.ROBOID_head, 'HEAD'],
                        [Lang.Blocks.ROBOID_tail, 'TAIL'],
                        [Lang.Blocks.ROBOID_all, 'ALL'],
                    ],
                    value: 'HEAD',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.ROBOID_color_red, 'RED'],
                        [Lang.Blocks.ROBOID_color_orange, 'ORANGE'],
                        [Lang.Blocks.ROBOID_color_yellow, 'YELLOW'],
                        [Lang.Blocks.ROBOID_color_green, 'GREEN'],
                        [Lang.Blocks.ROBOID_color_sky_blue, 'SKY_BLUE'],
                        [Lang.Blocks.ROBOID_color_blue, 'BLUE'],
                        [Lang.Blocks.ROBOID_color_violet, 'VIOLET'],
                        [Lang.Blocks.ROBOID_color_purple, 'PURPLE'],
                        [Lang.Blocks.ROBOID_color_white, 'WHITE'],
                    ],
                    value: 'RED',
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
                type: 'zerone_set_led_to',
            },
            paramsKeyMap: {
                LED: 0,
                COLOR: 1,
            },
            class: 'zerone_led',
            isNotFor: ['zerone'],
            func(sprite, script) {
                const robot = Entry.Zerone.getRobot();
                return robot ? robot.setLed(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Zerone.set_led(%1, %2)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.ROBOID_led_left_head, 'LEFT_HEAD'],
                                    [Lang.Blocks.ROBOID_led_right_head, 'RIGHT_HEAD'],
                                    [Lang.Blocks.ROBOID_led_left_tail, 'LEFT_TAIL'],
                                    [Lang.Blocks.ROBOID_led_right_tail, 'RIGHT_TAIL'],
                                    [Lang.Blocks.ROBOID_left, 'LEFT'],
                                    [Lang.Blocks.ROBOID_right, 'RIGHT'],
                                    [Lang.Blocks.ROBOID_head, 'HEAD'],
                                    [Lang.Blocks.ROBOID_tail, 'TAIL'],
                                    [Lang.Blocks.ROBOID_all, 'ALL'],
                                ],
                                value: 'HEAD',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.ROBOID_color_red, 'RED'],
                                    [Lang.Blocks.ROBOID_color_orange, 'ORANGE'],
                                    [Lang.Blocks.ROBOID_color_yellow, 'YELLOW'],
                                    [Lang.Blocks.ROBOID_color_green, 'GREEN'],
                                    [Lang.Blocks.ROBOID_color_sky_blue, 'SKY_BLUE'],
                                    [Lang.Blocks.ROBOID_color_blue, 'BLUE'],
                                    [Lang.Blocks.ROBOID_color_violet, 'VIOLET'],
                                    [Lang.Blocks.ROBOID_color_purple, 'PURPLE'],
                                    [Lang.Blocks.ROBOID_color_white, 'WHITE'],
                                ],
                                value: 'RED',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                        ],
                    },
                ],
            },
        },
        zerone_pick_led: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.ROBOID_led_left_head, 'LEFT_HEAD'],
                        [Lang.Blocks.ROBOID_led_right_head, 'RIGHT_HEAD'],
                        [Lang.Blocks.ROBOID_led_left_tail, 'LEFT_TAIL'],
                        [Lang.Blocks.ROBOID_led_right_tail, 'RIGHT_TAIL'],
                        [Lang.Blocks.ROBOID_left, 'LEFT'],
                        [Lang.Blocks.ROBOID_right, 'RIGHT'],
                        [Lang.Blocks.ROBOID_head, 'HEAD'],
                        [Lang.Blocks.ROBOID_tail, 'TAIL'],
                        [Lang.Blocks.ROBOID_all, 'ALL'],
                    ],
                    value: 'HEAD',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Color',
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
                type: 'zerone_pick_led',
            },
            paramsKeyMap: {
                LED: 0,
                COLOR: 1,
            },
            class: 'zerone_led',
            isNotFor: ['zerone'],
            func(sprite, script) {
                const robot = Entry.Zerone.getRobot();
                return robot ? robot.pickLed(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Zerone.pick_led(%1, %2)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.ROBOID_led_left_head, 'LEFT_HEAD'],
                                    [Lang.Blocks.ROBOID_led_right_head, 'RIGHT_HEAD'],
                                    [Lang.Blocks.ROBOID_led_left_tail, 'LEFT_TAIL'],
                                    [Lang.Blocks.ROBOID_led_right_tail, 'RIGHT_TAIL'],
                                    [Lang.Blocks.ROBOID_left, 'LEFT'],
                                    [Lang.Blocks.ROBOID_right, 'RIGHT'],
                                    [Lang.Blocks.ROBOID_head, 'HEAD'],
                                    [Lang.Blocks.ROBOID_tail, 'TAIL'],
                                    [Lang.Blocks.ROBOID_all, 'ALL'],
                                ],
                                value: 'HEAD',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                            {
                                type: 'Color',
                                converter: Entry.block.converters.returnStringValue,
                            },
                        ],
                    },
                ],
            },
        },
        zerone_change_led_by_rgb: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.ROBOID_led_left_head, 'LEFT_HEAD'],
                        [Lang.Blocks.ROBOID_led_right_head, 'RIGHT_HEAD'],
                        [Lang.Blocks.ROBOID_led_left_tail, 'LEFT_TAIL'],
                        [Lang.Blocks.ROBOID_led_right_tail, 'RIGHT_TAIL'],
                        [Lang.Blocks.ROBOID_left, 'LEFT'],
                        [Lang.Blocks.ROBOID_right, 'RIGHT'],
                        [Lang.Blocks.ROBOID_head, 'HEAD'],
                        [Lang.Blocks.ROBOID_tail, 'TAIL'],
                        [Lang.Blocks.ROBOID_all, 'ALL'],
                    ],
                    value: 'HEAD',
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
                        type: 'text',
                        params: ['10'],
                    },
                    {
                        type: 'text',
                        params: ['0'],
                    },
                    {
                        type: 'text',
                        params: ['0'],
                    },
                    null,
                ],
                type: 'zerone_change_led_by_rgb',
            },
            paramsKeyMap: {
                LED: 0,
                RED: 1,
                GREEN: 2,
                BLUE: 3,
            },
            class: 'zerone_led',
            isNotFor: ['zerone'],
            func(sprite, script) {
                const robot = Entry.Zerone.getRobot();
                return robot ? robot.changeRgb(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Zerone.add_rgb(%1, %2, %3, %4)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.ROBOID_led_left_head, 'LEFT_HEAD'],
                                    [Lang.Blocks.ROBOID_led_right_head, 'RIGHT_HEAD'],
                                    [Lang.Blocks.ROBOID_led_left_tail, 'LEFT_TAIL'],
                                    [Lang.Blocks.ROBOID_led_right_tail, 'RIGHT_TAIL'],
                                    [Lang.Blocks.ROBOID_left, 'LEFT'],
                                    [Lang.Blocks.ROBOID_right, 'RIGHT'],
                                    [Lang.Blocks.ROBOID_head, 'HEAD'],
                                    [Lang.Blocks.ROBOID_tail, 'TAIL'],
                                    [Lang.Blocks.ROBOID_all, 'ALL'],
                                ],
                                value: 'HEAD',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
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
                    },
                ],
            },
        },
        zerone_set_led_to_rgb: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.ROBOID_led_left_head, 'LEFT_HEAD'],
                        [Lang.Blocks.ROBOID_led_right_head, 'RIGHT_HEAD'],
                        [Lang.Blocks.ROBOID_led_left_tail, 'LEFT_TAIL'],
                        [Lang.Blocks.ROBOID_led_right_tail, 'RIGHT_TAIL'],
                        [Lang.Blocks.ROBOID_left, 'LEFT'],
                        [Lang.Blocks.ROBOID_right, 'RIGHT'],
                        [Lang.Blocks.ROBOID_head, 'HEAD'],
                        [Lang.Blocks.ROBOID_tail, 'TAIL'],
                        [Lang.Blocks.ROBOID_all, 'ALL'],
                    ],
                    value: 'HEAD',
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
                        type: 'text',
                        params: ['255'],
                    },
                    {
                        type: 'text',
                        params: ['0'],
                    },
                    {
                        type: 'text',
                        params: ['0'],
                    },
                    null,
                ],
                type: 'zerone_set_led_to_rgb',
            },
            paramsKeyMap: {
                LED: 0,
                RED: 1,
                GREEN: 2,
                BLUE: 3,
            },
            class: 'zerone_led',
            isNotFor: ['zerone'],
            func(sprite, script) {
                const robot = Entry.Zerone.getRobot();
                return robot ? robot.setRgb(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Zerone.set_rgb(%1, %2, %3, %4)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.ROBOID_led_left_head, 'LEFT_HEAD'],
                                    [Lang.Blocks.ROBOID_led_right_head, 'RIGHT_HEAD'],
                                    [Lang.Blocks.ROBOID_led_left_tail, 'LEFT_TAIL'],
                                    [Lang.Blocks.ROBOID_led_right_tail, 'RIGHT_TAIL'],
                                    [Lang.Blocks.ROBOID_left, 'LEFT'],
                                    [Lang.Blocks.ROBOID_right, 'RIGHT'],
                                    [Lang.Blocks.ROBOID_head, 'HEAD'],
                                    [Lang.Blocks.ROBOID_tail, 'TAIL'],
                                    [Lang.Blocks.ROBOID_all, 'ALL'],
                                ],
                                value: 'HEAD',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
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
                    },
                ],
            },
        },
        zerone_clear_led: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.ROBOID_led_left_head, 'LEFT_HEAD'],
                        [Lang.Blocks.ROBOID_led_right_head, 'RIGHT_HEAD'],
                        [Lang.Blocks.ROBOID_led_left_tail, 'LEFT_TAIL'],
                        [Lang.Blocks.ROBOID_led_right_tail, 'RIGHT_TAIL'],
                        [Lang.Blocks.ROBOID_left, 'LEFT'],
                        [Lang.Blocks.ROBOID_right, 'RIGHT'],
                        [Lang.Blocks.ROBOID_head, 'HEAD'],
                        [Lang.Blocks.ROBOID_tail, 'TAIL'],
                        [Lang.Blocks.ROBOID_all, 'ALL'],
                    ],
                    value: 'HEAD',
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
                type: 'zerone_clear_led',
            },
            paramsKeyMap: {
                LED: 0,
            },
            class: 'zerone_led',
            isNotFor: ['zerone'],
            func(sprite, script) {
                const robot = Entry.Zerone.getRobot();
                return robot ? robot.clearLed(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Zerone.clear_led(%1)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.ROBOID_led_left_head, 'LEFT_HEAD'],
                                    [Lang.Blocks.ROBOID_led_right_head, 'RIGHT_HEAD'],
                                    [Lang.Blocks.ROBOID_led_left_tail, 'LEFT_TAIL'],
                                    [Lang.Blocks.ROBOID_led_right_tail, 'RIGHT_TAIL'],
                                    [Lang.Blocks.ROBOID_left, 'LEFT'],
                                    [Lang.Blocks.ROBOID_right, 'RIGHT'],
                                    [Lang.Blocks.ROBOID_head, 'HEAD'],
                                    [Lang.Blocks.ROBOID_tail, 'TAIL'],
                                    [Lang.Blocks.ROBOID_all, 'ALL'],
                                ],
                                value: 'HEAD',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                        ],
                    },
                ],
            },
        },
        zerone_play_sound_times: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.ROBOID_sound_beep, 'BEEP'],
                        [Lang.Blocks.ROBOID_sound_random_beep, 'RANDOM_BEEP'],
                        [Lang.Blocks.ROBOID_sound_noise, 'NOISE'],
                        [Lang.Blocks.ROBOID_sound_siren, 'SIREN'],
                        [Lang.Blocks.ROBOID_sound_engine, 'ENGINE'],
                        [Lang.Blocks.ROBOID_sound_chop, 'CHOP'],
                        [Lang.Blocks.ROBOID_sound_robot, 'ROBOT'],
                        [Lang.Blocks.ROBOID_sound_dibidibidip, 'DIBIDIBIDIP'],
                        [Lang.Blocks.ROBOID_sound_good_job, 'GOOD_JOB'],
                        [Lang.Blocks.ROBOID_sound_happy, 'HAPPY'],
                        [Lang.Blocks.ROBOID_sound_angry, 'ANGRY'],
                        [Lang.Blocks.ROBOID_sound_sad, 'SAD'],
                        [Lang.Blocks.ROBOID_sound_sleep, 'SLEEP'],
                        [Lang.Blocks.ROBOID_sound_march, 'MARCH'],
                        [Lang.Blocks.ROBOID_sound_birthday, 'BIRTHDAY'],
                    ],
                    value: 'BEEP',
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
                        type: 'text',
                        params: ['1'],
                    },
                    null,
                ],
                type: 'zerone_play_sound_times',
            },
            paramsKeyMap: {
                SOUND: 0,
                COUNT: 1,
            },
            class: 'zerone_sound',
            isNotFor: ['zerone'],
            func(sprite, script) {
                const robot = Entry.Zerone.getRobot();
                return robot ? robot.playSound(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Zerone.play_sound(%1, %2)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.ROBOID_sound_beep, 'BEEP'],
                                    [Lang.Blocks.ROBOID_sound_random_beep, 'RANDOM_BEEP'],
                                    [Lang.Blocks.ROBOID_sound_noise, 'NOISE'],
                                    [Lang.Blocks.ROBOID_sound_siren, 'SIREN'],
                                    [Lang.Blocks.ROBOID_sound_engine, 'ENGINE'],
                                    [Lang.Blocks.ROBOID_sound_chop, 'CHOP'],
                                    [Lang.Blocks.ROBOID_sound_robot, 'ROBOT'],
                                    [Lang.Blocks.ROBOID_sound_dibidibidip, 'DIBIDIBIDIP'],
                                    [Lang.Blocks.ROBOID_sound_good_job, 'GOOD_JOB'],
                                    [Lang.Blocks.ROBOID_sound_happy, 'HAPPY'],
                                    [Lang.Blocks.ROBOID_sound_angry, 'ANGRY'],
                                    [Lang.Blocks.ROBOID_sound_sad, 'SAD'],
                                    [Lang.Blocks.ROBOID_sound_sleep, 'SLEEP'],
                                    [Lang.Blocks.ROBOID_sound_march, 'MARCH'],
                                    [Lang.Blocks.ROBOID_sound_birthday, 'BIRTHDAY'],
                                ],
                                value: 'BEEP',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                        ],
                    },
                ],
            },
        },
        zerone_play_sound_times_until_done: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.ROBOID_sound_beep, 'BEEP'],
                        [Lang.Blocks.ROBOID_sound_random_beep, 'RANDOM_BEEP'],
                        [Lang.Blocks.ROBOID_sound_noise, 'NOISE'],
                        [Lang.Blocks.ROBOID_sound_siren, 'SIREN'],
                        [Lang.Blocks.ROBOID_sound_engine, 'ENGINE'],
                        [Lang.Blocks.ROBOID_sound_chop, 'CHOP'],
                        [Lang.Blocks.ROBOID_sound_robot, 'ROBOT'],
                        [Lang.Blocks.ROBOID_sound_dibidibidip, 'DIBIDIBIDIP'],
                        [Lang.Blocks.ROBOID_sound_good_job, 'GOOD_JOB'],
                        [Lang.Blocks.ROBOID_sound_happy, 'HAPPY'],
                        [Lang.Blocks.ROBOID_sound_angry, 'ANGRY'],
                        [Lang.Blocks.ROBOID_sound_sad, 'SAD'],
                        [Lang.Blocks.ROBOID_sound_sleep, 'SLEEP'],
                        [Lang.Blocks.ROBOID_sound_march, 'MARCH'],
                        [Lang.Blocks.ROBOID_sound_birthday, 'BIRTHDAY'],
                    ],
                    value: 'BEEP',
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
                        type: 'text',
                        params: ['1'],
                    },
                    null,
                ],
                type: 'zerone_play_sound_times_until_done',
            },
            paramsKeyMap: {
                SOUND: 0,
                COUNT: 1,
            },
            class: 'zerone_sound',
            isNotFor: ['zerone'],
            func(sprite, script) {
                const robot = Entry.Zerone.getRobot();
                return robot ? robot.playSoundUntil(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Zerone.play_sound_until_done(%1, %2)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.ROBOID_sound_beep, 'BEEP'],
                                    [Lang.Blocks.ROBOID_sound_random_beep, 'RANDOM_BEEP'],
                                    [Lang.Blocks.ROBOID_sound_noise, 'NOISE'],
                                    [Lang.Blocks.ROBOID_sound_siren, 'SIREN'],
                                    [Lang.Blocks.ROBOID_sound_engine, 'ENGINE'],
                                    [Lang.Blocks.ROBOID_sound_chop, 'CHOP'],
                                    [Lang.Blocks.ROBOID_sound_robot, 'ROBOT'],
                                    [Lang.Blocks.ROBOID_sound_dibidibidip, 'DIBIDIBIDIP'],
                                    [Lang.Blocks.ROBOID_sound_good_job, 'GOOD_JOB'],
                                    [Lang.Blocks.ROBOID_sound_happy, 'HAPPY'],
                                    [Lang.Blocks.ROBOID_sound_angry, 'ANGRY'],
                                    [Lang.Blocks.ROBOID_sound_sad, 'SAD'],
                                    [Lang.Blocks.ROBOID_sound_sleep, 'SLEEP'],
                                    [Lang.Blocks.ROBOID_sound_march, 'MARCH'],
                                    [Lang.Blocks.ROBOID_sound_birthday, 'BIRTHDAY'],
                                ],
                                value: 'BEEP',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                        ],
                    },
                ],
            },
        },
        zerone_change_buzzer_by: {
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
                        type: 'text',
                        params: ['10'],
                    },
                    null,
                ],
                type: 'zerone_change_buzzer_by',
            },
            paramsKeyMap: {
                HZ: 0,
            },
            class: 'zerone_sound',
            isNotFor: ['zerone'],
            func(sprite, script) {
                const robot = Entry.Zerone.getRobot();
                return robot ? robot.changeBuzzer(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Zerone.add_buzzer(%1)',
                    },
                ],
            },
        },
        zerone_set_buzzer_to: {
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
                        type: 'text',
                        params: ['1000'],
                    },
                    null,
                ],
                type: 'zerone_set_buzzer_to',
            },
            paramsKeyMap: {
                HZ: 0,
            },
            class: 'zerone_sound',
            isNotFor: ['zerone'],
            func(sprite, script) {
                const robot = Entry.Zerone.getRobot();
                return robot ? robot.setBuzzer(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Zerone.set_buzzer(%1)',
                    },
                ],
            },
        },
        zerone_clear_sound: {
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
                params: [null],
                type: 'zerone_clear_sound',
            },
            class: 'zerone_sound',
            isNotFor: ['zerone'],
            func(sprite, script) {
                const robot = Entry.Zerone.getRobot();
                return robot ? robot.clearSound(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Zerone.clear_sound()',
                        params: [null],
                    },
                ],
            },
        },
        zerone_play_note: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.ROBOID_note_c, 'C'],
                        [Lang.Blocks.ROBOID_note_c_sharp, 'C#'],
                        [Lang.Blocks.ROBOID_note_d, 'D'],
                        [Lang.Blocks.ROBOID_note_d_sharp, 'D#'],
                        [Lang.Blocks.ROBOID_note_e, 'E'],
                        [Lang.Blocks.ROBOID_note_f, 'F'],
                        [Lang.Blocks.ROBOID_note_f_sharp, 'F#'],
                        [Lang.Blocks.ROBOID_note_g, 'G'],
                        [Lang.Blocks.ROBOID_note_g_sharp, 'G#'],
                        [Lang.Blocks.ROBOID_note_a, 'A'],
                        [Lang.Blocks.ROBOID_note_a_sharp, 'A#'],
                        [Lang.Blocks.ROBOID_note_b, 'B'],
                    ],
                    value: 'C',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
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
                params: [null, '4', null],
                type: 'zerone_play_note',
            },
            paramsKeyMap: {
                NOTE: 0,
                OCTAVE: 1,
            },
            class: 'zerone_sound',
            isNotFor: ['zerone'],
            func(sprite, script) {
                const robot = Entry.Zerone.getRobot();
                return robot ? robot.playNote(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Zerone.play_pitch(%1, %2)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.ROBOID_note_c, 'C'],
                                    [Lang.Blocks.ROBOID_note_c_sharp, 'C#'],
                                    [Lang.Blocks.ROBOID_note_d, 'D'],
                                    [Lang.Blocks.ROBOID_note_d_sharp, 'D#'],
                                    [Lang.Blocks.ROBOID_note_e, 'E'],
                                    [Lang.Blocks.ROBOID_note_f, 'F'],
                                    [Lang.Blocks.ROBOID_note_f_sharp, 'F#'],
                                    [Lang.Blocks.ROBOID_note_g, 'G'],
                                    [Lang.Blocks.ROBOID_note_g_sharp, 'G#'],
                                    [Lang.Blocks.ROBOID_note_a, 'A'],
                                    [Lang.Blocks.ROBOID_note_a_sharp, 'A#'],
                                    [Lang.Blocks.ROBOID_note_b, 'B'],
                                ],
                                value: 'C',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
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
                                ],
                                value: '1',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringOrNumberByValue,
                            },
                        ],
                    },
                ],
            },
        },
        zerone_play_note_for: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.ROBOID_note_c, 'C'],
                        [Lang.Blocks.ROBOID_note_c_sharp, 'C#'],
                        [Lang.Blocks.ROBOID_note_d, 'D'],
                        [Lang.Blocks.ROBOID_note_d_sharp, 'D#'],
                        [Lang.Blocks.ROBOID_note_e, 'E'],
                        [Lang.Blocks.ROBOID_note_f, 'F'],
                        [Lang.Blocks.ROBOID_note_f_sharp, 'F#'],
                        [Lang.Blocks.ROBOID_note_g, 'G'],
                        [Lang.Blocks.ROBOID_note_g_sharp, 'G#'],
                        [Lang.Blocks.ROBOID_note_a, 'A'],
                        [Lang.Blocks.ROBOID_note_a_sharp, 'A#'],
                        [Lang.Blocks.ROBOID_note_b, 'B'],
                    ],
                    value: 'C',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
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
                    '4',
                    {
                        type: 'text',
                        params: ['0.5'],
                    },
                    null,
                ],
                type: 'zerone_play_note_for',
            },
            paramsKeyMap: {
                NOTE: 0,
                OCTAVE: 1,
                BEAT: 2,
            },
            class: 'zerone_sound',
            isNotFor: ['zerone'],
            func(sprite, script) {
                const robot = Entry.Zerone.getRobot();
                return robot ? robot.playNoteBeat(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Zerone.play_note(%1, %2, %3)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.ROBOID_note_c, 'C'],
                                    [Lang.Blocks.ROBOID_note_c_sharp, 'C#'],
                                    [Lang.Blocks.ROBOID_note_d, 'D'],
                                    [Lang.Blocks.ROBOID_note_d_sharp, 'D#'],
                                    [Lang.Blocks.ROBOID_note_e, 'E'],
                                    [Lang.Blocks.ROBOID_note_f, 'F'],
                                    [Lang.Blocks.ROBOID_note_f_sharp, 'F#'],
                                    [Lang.Blocks.ROBOID_note_g, 'G'],
                                    [Lang.Blocks.ROBOID_note_g_sharp, 'G#'],
                                    [Lang.Blocks.ROBOID_note_a, 'A'],
                                    [Lang.Blocks.ROBOID_note_a_sharp, 'A#'],
                                    [Lang.Blocks.ROBOID_note_b, 'B'],
                                ],
                                value: 'C',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
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
                                ],
                                value: '1',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringOrNumberByValue,
                            },
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                        ],
                    },
                ],
            },
        },
        zerone_rest_for: {
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
                        type: 'text',
                        params: ['0.25'],
                    },
                    null,
                ],
                type: 'zerone_rest_for',
            },
            paramsKeyMap: {
                BEAT: 0,
            },
            class: 'zerone_sound',
            isNotFor: ['zerone'],
            func(sprite, script) {
                const robot = Entry.Zerone.getRobot();
                return robot ? robot.restBeat(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Zerone.rest(%1)',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                        ],
                    },
                ],
            },
        },
        zerone_change_tempo_by: {
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
                        type: 'text',
                        params: ['20'],
                    },
                    null,
                ],
                type: 'zerone_change_tempo_by',
            },
            paramsKeyMap: {
                BPM: 0,
            },
            class: 'zerone_sound',
            isNotFor: ['zerone'],
            func(sprite, script) {
                const robot = Entry.Zerone.getRobot();
                return robot ? robot.changeTempo(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Zerone.add_tempo(%1)',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                        ],
                    },
                ],
            },
        },
        zerone_set_tempo_to: {
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
                        type: 'text',
                        params: ['60'],
                    },
                    null,
                ],
                type: 'zerone_set_tempo_to',
            },
            paramsKeyMap: {
                BPM: 0,
            },
            class: 'zerone_sound',
            isNotFor: ['zerone'],
            func(sprite, script) {
                const robot = Entry.Zerone.getRobot();
                return robot ? robot.setTempo(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Zerone.set_tempo(%1)',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                        ],
                    },
                ],
            },
        },
    };
};

module.exports = Entry.Zerone;
