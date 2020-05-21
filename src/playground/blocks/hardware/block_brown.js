'use strict';

Entry.Brown = {
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
        const robot = Entry.Robomation.getRobot('line', 0);
        if (robot) {
            robot.setMotoring(Entry.hw.sendQueue);
        }
        return robot;
    },
    id: '2.10',
    name: 'brown',
    url: 'http://lf.robomation.jp',
    imageName: 'brown.png',
    title: {
        en: 'Brown',
        ko: '브라운',
        jp: 'ブラウン',
        vn: 'Brown',
    },
    monitorTemplate: () => ({
        imgPath: 'hw/brown.png',
        width: 300,
        height: 387,
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
            accelerationX: {
                name: Lang.Blocks.ROBOID_sensor_acceleration_x,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            accelerationY: {
                name: Lang.Blocks.ROBOID_sensor_acceleration_y,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            accelerationZ: {
                name: Lang.Blocks.ROBOID_sensor_acceleration_z,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            temperature: {
                name: Lang.Blocks.ROBOID_sensor_temperature,
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
            floor: {
                name: Lang.Blocks.ROBOID_sensor_floor,
                type: 'input',
                pos: { x: 95, y: 383 },
            },
            ledRed: {
                name: `LED R`,
                type: 'output',
                pos: { x: 93, y: 278 },
            },
            ledGreen: {
                name: `LED G`,
                type: 'output',
                pos: { x: 93, y: 278 },
            },
            ledBlue: {
                name: `LED B`,
                type: 'output',
                pos: { x: 93, y: 278 },
            },
            leftWheel: {
                name: Lang.Blocks.ROBOID_monitor_left_wheel,
                type: 'output',
                pos: { x: 288, y: 322 },
            },
            rightWheel: {
                name: Lang.Blocks.ROBOID_monitor_right_wheel,
                type: 'output',
                pos: { x: 10, y: 322 },
            },
        },
        mode: 'both',
    }),
};

Entry.Brown.setLanguage = () => ({
    ko: {
        template: {
            brown_touching_color: '%1 에 닿았는가?',
            brown_is_color_pattern: '색깔 패턴이 %1 %2 인가?',
            brown_button_state: '버튼을 %1 ?',
            brown_boolean: '%1?',
            brown_value: '%1',
            brown_move_forward_unit: '앞으로 %1 %2 이동하기 %3',
            brown_move_backward_unit: '뒤로 %1 %2 이동하기 %3',
            brown_turn_unit_in_place: '%1 으로 %2 %3 제자리 돌기 %4',
            brown_pivot_around_wheel_unit_in_direction: '%1 바퀴 중심으로 %2 %3 %4 방향으로 돌기 %5',
            brown_change_wheels_by_left_right: '왼쪽 바퀴 %1 오른쪽 바퀴 %2 만큼 바꾸기 %3',
            brown_set_wheels_to_left_right: '왼쪽 바퀴 %1 오른쪽 바퀴 %2 (으)로 정하기 %3',
            brown_change_wheel_by: '%1 바퀴 %2 만큼 바꾸기 %3',
            brown_set_wheel_to: '%1 바퀴 %2 (으)로 정하기 %3',
            brown_follow_line: '선 따라가기 %1',
            brown_follow_line_until: '선을 따라 %1 까지 이동하기 %2',
            brown_cross_intersection: '교차로 건너가기 %1',
            brown_turn_at_intersection: '교차로에서 %1 으로 돌기 %2',
            brown_jump_line: '%1 선으로 건너가기 %2',
            brown_set_following_speed_to: '선 따라가기 속도를 %1 (으)로 정하기 %2',
            brown_stop: '정지하기 %1',
            brown_set_led_to: 'LED를 %1 으로 정하기 %2',
            brown_pick_led: 'LED를 %1로 정하기 %2',
            brown_change_led_by_rgb: 'LED를 R: %1 G: %2 B: %3 만큼 바꾸기 %4',
            brown_set_led_to_rgb: 'LED를 R: %1 G: %2 B: %3 (으)로 정하기 %4',
            brown_clear_led: 'LED 끄기 %1',
            brown_play_sound_times: '%1 소리 %2 번 재생하기 %3',
            brown_play_sound_times_until_done: '%1 소리 %2 번 재생하고 기다리기 %3',
            brown_change_buzzer_by: '버저 음을 %1 만큼 바꾸기 %2',
            brown_set_buzzer_to: '버저 음을 %1 (으)로 정하기 %2',
            brown_clear_sound: '소리 끄기 %1',
            brown_play_note: '%1 %2 음을 연주하기 %3',
            brown_play_note_for_beats: '%1 %2 음을 %3 박자 연주하기 %4',
            brown_rest_for_beats: '%1 박자 쉬기 %2',
            brown_change_tempo_by: '연주 속도를 %1 만큼 바꾸기 %2',
            brown_set_tempo_to: '연주 속도를 %1 BPM으로 정하기 %2',
        },
        Helper: {
            brown_touching_color: "선택한 색깔을 컬러 센서가 감지하였으면 '참'으로 판단하고, 아니면 '거짓'으로 판단합니다.",
            brown_is_color_pattern: "선택한 색깔 패턴을 컬러 센서가 감지하였으면 '참'으로 판단하고, 아니면 '거짓'으로 판단합니다.",
            brown_button_state: "버튼을 클릭했으면/더블클릭했으면/길게 눌렀으면 '참'으로 판단하고, 아니면 '거짓'으로 판단합니다.",
            brown_boolean: "앞으로 기울임: 앞으로 기울였으면 '참'으로 판단하고, 아니면 '거짓'으로 판단합니다.<br/>뒤로 기울임: 뒤로 기울였으면 '참'으로 판단하고, 아니면 '거짓'으로 판단합니다.<br/>왼쪽으로 기울임: 왼쪽으로 기울였으면 '참'으로 판단하고, 아니면 '거짓'으로 판단합니다.<br/>오른쪽으로 기울임: 오른쪽으로 기울였으면 '참'으로 판단하고, 아니면 '거짓'으로 판단합니다.<br/>거꾸로 뒤집음: 거꾸로 뒤집었으면 '참'으로 판단하고, 아니면 '거짓'으로 판단합니다.<br/>기울이지 않음: 기울이지 않았으면 '참'으로 판단하고, 아니면 '거짓'으로 판단합니다.<br/>두드림: 두드렸으면 '참'으로 판단하고, 아니면 '거짓'으로 판단합니다.<br/>자유 낙하: 자유 낙하했으면 '참'으로 판단하고, 아니면 '거짓'으로 판단합니다.<br/>배터리 정상: 배터리 잔량이 충분하면 '참'으로 판단하고, 아니면 '거짓'으로 판단합니다.<br/>배터리 부족: 배터리 잔량이 부족하면 '참'으로 판단하고, 아니면 '거짓'으로 판단합니다.<br/>배터리 없음: 배터리 잔량이 없으면 '참'으로 판단하고, 아니면 '거짓'으로 판단합니다.",
            brown_value: '색깔 번호: 컬러 센서가 감지한 색깔의 번호 (값의 범위: -2 ~ 8, 초기값: -1)<br/>색깔 패턴: 컬러 센서가 감지한 색깔 패턴의 값 (값의 범위: -1 ~ 88, 초기값: -1)<br/>색깔 R: 컬러 센서가 감지한 색깔의 빨간색(R) 성분 (값의 범위: 0 ~ 255, 초기값: 0)<br/>색깔 G: 컬러 센서가 감지한 색깔의 초록색(G) 성분 (값의 범위: 0 ~ 255, 초기값: 0)<br/>색깔 B: 컬러 센서가 감지한 색깔의 파란색(B) 성분 (값의 범위: 0 ~ 255, 초기값: 0)<br/>바닥 센서: 바닥 센서의 값 (값의 범위: 0 ~ 100, 초기값: 0)<br/>버튼: 버튼의 상태 값 (누르면 1, 아니면 0, 초기값: 0)<br/>x축 가속도: 가속도 센서의 X축 값 (값의 범위: -32768 ~ 32767, 초기값: 0) 로봇이 전진하는 방향이 X축의 양수 방향입니다.<br/>y축 가속도: 가속도 센서의 Y축 값 (값의 범위: -32768 ~ 32767, 초기값: 0) 로봇의 왼쪽 방향이 Y축의 양수 방향입니다.<br/>z축 가속도: 가속도 센서의 Z축 값 (값의 범위: -32768 ~ 32767, 초기값: 0) 로봇의 위쪽 방향이 Z축의 양수 방향입니다.<br/>온도: 로봇 내부의 온도 값 (값의 범위: 섭씨 -41 ~ 87도, 초기값: 0)<br/>신호 세기: 블루투스 무선 통신의 신호 세기 (값의 범위: -128 ~ 0 dBm, 초기값: 0) 신호의 세기가 셀수록 값이 커집니다.',
            brown_move_forward_unit: '입력한 거리(cm)/시간(초)/펄스만큼 앞으로 이동합니다.',
            brown_move_backward_unit: '입력한 거리(cm)/시간(초)/펄스만큼 뒤로 이동합니다.',
            brown_turn_unit_in_place: '입력한 각도(도)/시간(초)/펄스만큼 왼쪽/오른쪽 방향으로 제자리에서 회전합니다.',
            brown_pivot_around_wheel_unit_in_direction: '왼쪽/오른쪽 바퀴 중심으로 입력한 각도(도)/시간(초)/펄스만큼 앞쪽/뒤쪽 방향으로 회전합니다.',
            brown_change_wheels_by_left_right: '왼쪽과 오른쪽 바퀴의 현재 속도 값(%)에 입력한 값을 각각 더합니다. 더한 결과가 양수 값이면 바퀴가 앞으로 회전하고, 음수 값이면 뒤로 회전합니다.',
            brown_set_wheels_to_left_right: '왼쪽과 오른쪽 바퀴의 속도를 입력한 값(-100 ~ 100%)으로 각각 설정합니다. 양수 값을 입력하면 바퀴가 앞으로 회전하고, 음수 값을 입력하면 뒤로 회전합니다. 숫자 0을 입력하면 정지합니다.',
            brown_change_wheel_by: '왼쪽/오른쪽/양쪽 바퀴의 현재 속도 값(%)에 입력한 값을 더합니다. 더한 결과가 양수 값이면 바퀴가 앞으로 회전하고, 음수 값이면 뒤로 회전합니다.',
            brown_set_wheel_to: '왼쪽/오른쪽/양쪽 바퀴의 속도를 입력한 값(-100 ~ 100%)으로 설정합니다. 양수 값을 입력하면 바퀴가 앞으로 회전하고, 음수 값을 입력하면 뒤로 회전합니다. 숫자 0을 입력하면 정지합니다.',
            brown_follow_line: '하얀색 바탕 위에서 검은색 선을 따라 이동합니다.',
            brown_follow_line_until: '하얀색 바탕 위에서 검은색 선을 따라 이동하다가 선택한 색깔을 컬러 센서가 감지하면 정지합니다.',
            brown_cross_intersection: '검은색 교차로에서 잠시 앞으로 이동한 후 검은색 선을 찾습니다.',
            brown_turn_at_intersection: '검은색 교차로에서 잠시 앞으로 이동한 후 제자리에서 왼쪽/오른쪽/뒤쪽으로 회전하고 검은색 선을 찾습니다.',
            brown_jump_line: '제자리에서 왼쪽/오른쪽으로 90도 회전한 후 앞으로 이동하다가 컬러 센서가 검은색 선을 감지하면 원래 방향으로 다시 회전합니다.',
            brown_set_following_speed_to: '선을 따라 이동하는 속도(1 ~ 8)를 설정합니다. 숫자가 클수록 이동하는 속도가 빠릅니다.',
            brown_stop: '양쪽 바퀴를 정지합니다.',
            brown_set_led_to: 'LED를 선택한 색깔로 켭니다.',
            brown_pick_led: 'LED를 선택한 색깔로 켭니다.',
            brown_change_led_by_rgb: 'LED의 현재 R, G, B 값에 입력한 값을 각각 더합니다.',
            brown_set_led_to_rgb: 'LED의 R, G, B 값을 입력한 값으로 각각 설정합니다.',
            brown_clear_led: 'LED를 끕니다.',
            brown_play_sound_times: '선택한 소리를 입력한 횟수만큼 재생합니다.',
            brown_play_sound_times_until_done: '선택한 소리를 입력한 횟수만큼 재생하고, 재생이 완료될 때까지 기다립니다.',
            brown_change_buzzer_by: '버저 소리의 현재 음 높이(Hz)에 입력한 값을 더합니다. 소수점 둘째 자리까지 입력할 수 있습니다.',
            brown_set_buzzer_to: '버저 소리의 음 높이를 입력한 값(Hz)으로 설정합니다. 소수점 둘째 자리까지 입력할 수 있습니다. 숫자 0을 입력하면 소리를 끕니다.',
            brown_clear_sound: '소리를 끕니다.',
            brown_play_note: '선택한 계이름과 옥타브의 음을 계속 소리 냅니다.',
            brown_play_note_for_beats: '선택한 계이름과 옥타브의 음을 입력한 박자만큼 소리 냅니다.',
            brown_rest_for_beats: '입력한 박자만큼 쉽니다.',
            brown_change_tempo_by: '연주하거나 쉬는 속도의 현재 BPM(분당 박자 수)에 입력한 값을 더합니다.',
            brown_set_tempo_to: '연주하거나 쉬는 속도를 입력한 BPM(분당 박자 수)으로 설정합니다.',
        },
        Blocks: {
            ROBOID_monitor_buzzer: '버저',
            ROBOID_monitor_note: '음표',
            ROBOID_monitor_left_wheel: '왼쪽 바퀴',
            ROBOID_monitor_right_wheel: '오른쪽 바퀴',
            ROBOID_sensor_signal_strength: '신호 세기',
            ROBOID_sensor_color_r: '색깔 R',
            ROBOID_sensor_color_g: '색깔 G',
            ROBOID_sensor_color_b: '색깔 B',
            ROBOID_sensor_floor: '바닥 센서',
            ROBOID_sensor_acceleration_x: 'x축 가속도',
            ROBOID_sensor_acceleration_y: 'y축 가속도',
            ROBOID_sensor_acceleration_z: 'z축 가속도',
            ROBOID_sensor_temperature: '온도',
            ROBOID_sensor_button: '버튼',
            ROBOID_sensor_color_number: '색깔 번호',
            ROBOID_sensor_color_pattern: '색깔 패턴',
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
            ROBOID_tilt_forward: '앞으로 기울임',
            ROBOID_tilt_backward: '뒤로 기울임',
            ROBOID_tilt_left: '왼쪽으로 기울임',
            ROBOID_tilt_right: '오른쪽으로 기울임',
            ROBOID_tilt_flip: '거꾸로 뒤집음',
            ROBOID_tilt_not: '기울이지 않음',
            ROBOID_battery_normal: '배터리 정상',
            ROBOID_battery_low: '배터리 부족',
            ROBOID_battery_empty: '배터리 없음',
            ROBOID_free_fall: '자유 낙하',
            ROBOID_tap: '두드림',
            ROBOID_unit_cm: 'cm',
            ROBOID_unit_sec: '초',
            ROBOID_unit_pulse: '펄스',
            ROBOID_unit_deg: '도',
            ROBOID_left: '왼쪽',
            ROBOID_right: '오른쪽',
            ROBOID_both: '양쪽',
            ROBOID_back: '뒤쪽',
            ROBOID_forward: '앞쪽',
            ROBOID_backward: '뒤쪽',
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
            brown_touching_color: 'touching %1 ?',
            brown_is_color_pattern: 'color pattern %1 %2 ?',
            brown_button_state: 'button %1 ?',
            brown_boolean: '%1?',
            brown_value: '%1',
            brown_move_forward_unit: 'move forward %1 %2 %3',
            brown_move_backward_unit: 'move backward %1 %2 %3',
            brown_turn_unit_in_place: 'turn %1 %2 %3 in place %4',
            brown_pivot_around_wheel_unit_in_direction: 'pivot around %1 wheel %2 %3 in %4 direction %5',
            brown_change_wheels_by_left_right: 'change wheels by left: %1 right: %2 %3',
            brown_set_wheels_to_left_right: 'set wheels to left: %1 right: %2 %3',
            brown_change_wheel_by: 'change %1 wheel by %2 %3',
            brown_set_wheel_to: 'set %1 wheel to %2 %3',
            brown_follow_line: 'follow line %1',
            brown_follow_line_until: 'follow line until %1 %2',
            brown_cross_intersection: 'cross intersection %1',
            brown_turn_at_intersection: 'turn %1 at intersection %2',
            brown_jump_line: 'jump to %1 line %2',
            brown_set_following_speed_to: 'set following speed to %1 %2',
            brown_stop: 'stop %1',
            brown_set_led_to: 'set led to %1 %2',
            brown_pick_led: 'set led to %1 %2',
            brown_change_led_by_rgb: 'change led by r: %1 g: %2 b: %3 %4',
            brown_set_led_to_rgb: 'set led to r: %1 g: %2 b: %3 %4',
            brown_clear_led: 'clear led %1',
            brown_play_sound_times: 'play sound %1 %2 times %3',
            brown_play_sound_times_until_done: 'play sound %1 %2 times until done %3',
            brown_change_buzzer_by: 'change buzzer by %1 %2',
            brown_set_buzzer_to: 'set buzzer to %1 %2',
            brown_clear_sound: 'clear sound %1',
            brown_play_note: 'play note %1 %2 %3',
            brown_play_note_for_beats: 'play note %1 %2 for %3 beats %4',
            brown_rest_for_beats: 'rest for %1 beats %2',
            brown_change_tempo_by: 'change tempo by %1 %2',
            brown_set_tempo_to: 'set tempo to %1 bpm %2',
        },
        Helper: {
            brown_touching_color: 'If the color sensor detects the selected color, true, otherwise false.',
            brown_is_color_pattern: 'If the color sensor detects the selected color pattern, true, otherwise false.',
            brown_button_state: 'If the button clicked/double-clicked/long-pressed, true, otherwise false.',
            brown_boolean: "tilt forward: If tilted forward, true, otherwise false<br/>tilt backward: If tilted backward, true, otherwise false<br/>tilt left: If tilted to the left, true, otherwise false<br/>tilt right: If tilted to the right, true, otherwise false<br/>tilt flip: If upside-down, true, otherwise false<br/>not tilt: If not tilted, true, otherwise false<br/>tap: If tapped, true, otherwise false<br/>free fall: If free fall, true, otherwise false<br/>battery normal: If the battery is enough, true, otherwise false<br/>battery low: If the battery is low, true, otherwise false<br/>battery empty: If the battery is empty, true, otherwise false",
            brown_value: 'color number: color number detected by the color sensor (range: -2 to 8, initial value: -1)<br/>color pattern: value of the color pattern detected by the color sensor (range: -1 ~ 88, initial value: -1)<br/>color r: red component of color detected by the color sensor (range: 0 ~ 255, initial value: 0)<br/>color g: green component of color detected by the color sensor (range: 0 ~ 255, initial value: 0)<br/>color b: blue component of color detected by the color sensor (range: 0 ~ 255, initial value: 0)<br/>floor: value of floor sensor (range: 0 to 100, initial value: 0)<br/>button: status of the button (when pressed 1, otherwise 0, initial value: 0)<br/>x acceleration: x-axis value of acceleration sensor (range: -32768 to 32767, initial value: 0) The direction in which the robot moves forward is the positive direction of the x axis.<br/>y acceleration: y-axis value of acceleration sensor (range: -32768 to 32767, initial value: 0) The left direction of the robot is the positive direction of the y axis.<br/>z acceleration: z-axis value of acceleration sensor (range: -32768 to 32767, initial value: 0) The upward direction of the robot is the positive direction of the z axis.<br/>temperature: temperature value inside the robot (range: -41 to 87 degrees Celsius, initial value: 0)<br/>signal strength: signal strength of Bluetooth communication (range: -128 to 0 dBm, initial value: 0) As the signal strength increases, the value increases.',
            brown_move_forward_unit: 'Moves forward for the number of cm/seconds/pulses entered.',
            brown_move_backward_unit: 'Moves backward for the number of cm/seconds/pulses entered.',
            brown_turn_unit_in_place: 'Turns left/right in place for the number of degrees/seconds/pulses entered.',
            brown_pivot_around_wheel_unit_in_direction: 'Pivots around the left/right wheel in the forward/backward direction for the number of degrees/seconds/pulses entered.',
            brown_change_wheels_by_left_right: 'Adds the entered values to the current velocity values (%) of the left and right wheels respectively. If the result is positive, the wheel rotates forward; if negative, the wheel rotates backward.',
            brown_set_wheels_to_left_right: 'Sets the velocity of the left and right wheels to the entered values (-100 to 100%), respectively. If you enter a positive value, the wheel rotates forward. If you enter a negative value, the wheel rotates backward. Entering the number 0 stops it.',
            brown_change_wheel_by: 'Adds the entered value to the current velocity value (%) of the left/right/both wheels. If the result is positive, the wheel rotates forward; if negative, the wheel rotates backward.',
            brown_set_wheel_to: 'Sets the velocity of the left/right/both wheels to the entered value (-100 to 100%). If you enter a positive value, the wheel rotates forward. If you enter a negative value, the wheel rotates backward. Entering the number 0 stops it.',
            brown_follow_line: 'Moves along the black line on a white background.',
            brown_follow_line_until: 'Moves along the black line on a white background and stops when the color sensor detects the selected color.',
            brown_cross_intersection: 'Moves forward for a moment at the black intersection, then finds the black line.',
            brown_turn_at_intersection: 'Moves forward for a moment at the black intersection, then turns left/right/back in place and finds the black line.',
            brown_jump_line: 'Turns left/right 90 degrees in place and moves forward. Stops when the color sensor detects the black line and turns to its original direction.',
            brown_set_following_speed_to: 'Sets the speed (1 to 8) to move along the line. The larger the number, the faster the movement.',
            brown_stop: 'Stops both wheels.',
            brown_set_led_to: 'Turns the LED to the selected color.',
            brown_pick_led: 'Turns the LED to the selected color.',
            brown_change_led_by_rgb: 'Adds the entered values to the current R, G, B values of the LED, respectively.',
            brown_set_led_to_rgb: 'Sets the R, G, B values of the LED to the entered values.',
            brown_clear_led: 'Turns off the LED.',
            brown_play_sound_times: 'Plays the selected sound as many times as entered.',
            brown_play_sound_times_until_done: 'Plays the selected sound as many times as entered, and waits for completion.',
            brown_change_buzzer_by: 'Adds the entered value to the current pitch (Hz) of the buzzer sound. You can enter up to two decimal places.',
            brown_set_buzzer_to: 'Sets the pitch of the buzzer sound to the entered value (Hz). You can enter up to two decimal places. Entering the number 0 turns off the buzzer sound.',
            brown_clear_sound: 'Turns off sound.',
            brown_play_note: 'It sounds the selected tone and octave.',
            brown_play_note_for_beats: 'It sounds the selected tone and octave as much as the beat you entered.',
            brown_rest_for_beats: 'Rests as much as the beat you entered.',
            brown_change_tempo_by: 'Adds the entered value to the current BPM (beats per minute) of the playing or resting speed.',
            brown_set_tempo_to: 'Sets the playing or resting speed to the entered BPM (beats per minute).',
        },
        Blocks: {
            ROBOID_monitor_buzzer: 'buzzer',
            ROBOID_monitor_note: 'note',
            ROBOID_monitor_left_wheel: 'left wheel',
            ROBOID_monitor_right_wheel: 'right wheel',
            ROBOID_sensor_signal_strength: 'signal strength',
            ROBOID_sensor_color_r: 'color r',
            ROBOID_sensor_color_g: 'color g',
            ROBOID_sensor_color_b: 'color b',
            ROBOID_sensor_floor: 'floor',
            ROBOID_sensor_acceleration_x: 'x acceleration',
            ROBOID_sensor_acceleration_y: 'y acceleration',
            ROBOID_sensor_acceleration_z: 'z acceleration',
            ROBOID_sensor_temperature: 'temperature',
            ROBOID_sensor_button: 'button',
            ROBOID_sensor_color_number: 'color number',
            ROBOID_sensor_color_pattern: 'color pattern',
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
            ROBOID_tilt_forward: 'tilt forward',
            ROBOID_tilt_backward: 'tilt backward',
            ROBOID_tilt_left: 'tilt left',
            ROBOID_tilt_right: 'tilt right',
            ROBOID_tilt_flip: 'tilt flip',
            ROBOID_tilt_not: 'not tilt',
            ROBOID_battery_normal: 'battery normal',
            ROBOID_battery_low: 'battery low',
            ROBOID_battery_empty: 'battery empty',
            ROBOID_free_fall: 'free fall',
            ROBOID_tap: 'tap',
            ROBOID_unit_cm: 'cm',
            ROBOID_unit_sec: 'seconds',
            ROBOID_unit_pulse: 'pulses',
            ROBOID_unit_deg: 'degrees',
            ROBOID_left: 'left',
            ROBOID_right: 'right',
            ROBOID_both: 'both',
            ROBOID_back: 'back',
            ROBOID_forward: 'forward',
            ROBOID_backward: 'backward',
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
            brown_touching_color: '%1 に着いたか？',
            brown_is_color_pattern: '色パターンが %1 %2 か？',
            brown_button_state: 'ボタンを %1 ?',
            brown_boolean: '%1?',
            brown_value: '%1',
            brown_move_forward_unit: '前へ %1 %2 移動する %3',
            brown_move_backward_unit: '後ろへ %1 %2 移動する %3',
            brown_turn_unit_in_place: '%1 へ %2 %3 その場で回る %4',
            brown_pivot_around_wheel_unit_in_direction: '%1 車輪を中心に %2 %3 %4 方向に回る %5',
            brown_change_wheels_by_left_right: '左車輪を %1 右車輪を %2 ずつ変える %3',
            brown_set_wheels_to_left_right: '左車輪を %1 右車輪を %2 にする %3',
            brown_change_wheel_by: '%1 車輪を %2 ずつ変える %3',
            brown_set_wheel_to: '%1 車輪を %2 にする %3',
            brown_follow_line: '線にそって移動する %1',
            brown_follow_line_until: '線にそって %1 まで移動する %2',
            brown_cross_intersection: '交差点を渡る %1',
            brown_turn_at_intersection: '交差点で %1 へ回る %2',
            brown_jump_line: '%1 線へわたる %2',
            brown_set_following_speed_to: '線にそって移動する速さを %1 にする %2',
            brown_stop: '停止する %1',
            brown_set_led_to: 'LEDを %1 にする %2',
            brown_pick_led: 'LEDを %1 にする %2',
            brown_change_led_by_rgb: 'LEDをR: %1 G: %2 B: %3 ずつ変える %4',
            brown_set_led_to_rgb: 'LEDをR: %1 G: %2 B: %3 にする %4',
            brown_clear_led: 'LEDをオフにする %1',
            brown_play_sound_times: '%1 音を %2 回再生する %3',
            brown_play_sound_times_until_done: '%1 音を %2 回再生して待つ %3',
            brown_change_buzzer_by: 'ブザー音を %1 ずつ変える %2',
            brown_set_buzzer_to: 'ブザー音を %1 にする %2',
            brown_clear_sound: '音をオフにする %1',
            brown_play_note: '%1 %2 音をならす %3',
            brown_play_note_for_beats: '%1 %2 音を %3 拍子ならす %4',
            brown_rest_for_beats: '%1 拍子休む %2',
            brown_change_tempo_by: '演奏のテンポを %1 ずつ変える %2',
            brown_set_tempo_to: '演奏のテンポを %1 BPMにする %2',
        },
        Helper: {
            brown_touching_color: '選択した色をカラーセンサーが感知したら「正しい」と判断してその他は｢正しくない｣と判断します。',
            brown_is_color_pattern: '選択した色パターンをカラーセンサーが感知したら「正しい」と判断してその他は｢正しくない｣と判断します。',
            brown_button_state: 'ボタンをクリックしたら、/ダブルクリックしたら、/長く押したら「正しい」と判断してその他は｢正しくない｣と判断します。',
            brown_boolean: "前にかたむけたか：前にかたむいたら「正しい」と判断してその他は「正しくない」と判断します。<br/>後にかたむけたか: 後ろにかたむいたら「正しい」と判断してその他は「正しくない」と判断します。<br/>左にかたむけたか：左にかたむいたら「正しい」と判断してその他は「正しくない」と判断します。<br/>右にかたむけたか：右にかたむいたら「正しい」と判断してその他は「正しくない」と判断します。<br/>うら返したか: うら裏返しになったら「正しい」と判断してその他は「正しくない」と判断します。<br/>かたむいてないか：かたむいてなかったら「正しい」と判断してその他は「正しくない」と判断します。<br/>叩いたか：叩いたら「正しい」と判断してその他は「正しくない」と判断します。<br/>落下したか：落下したら「正しい」と判断してその他は「正しくない」と判断します。<br/>電池残量が充分か：電池の残量が充分であれば「正しい」と判断してその他は「正しくない」と判断します。<br/>電池残量が足りないか：電池の残量が不足すると「正しい」と判断してその他は「正しくない」と判断します。<br/>電池残量がなくなったか：電池の残量がない場合「正しい」と判断してその他は「正しくない」と判断します。",
            brown_value: '色番号：カラーセンサーが感知した色の番号（値の範囲：-2〜8、初期値：-1）<br/>色パターン：カラーセンサーが感知した色パターンの値（値の範囲：-1〜88、初期値：-1）<br/>色R：カラーセンサーが感知した色の赤（R）成分（値の範囲：0〜255、初期値：0）<br/>色G：カラーセンサーが感知した色の緑（G）成分（値の範囲：0〜255、初期値：0）<br/>色B：カラーセンサーが感知した色の青色（B）成分（値の範囲：0〜255、初期値：0）<br/>床面センサー：床面センサーの値（値の範囲：0〜100、初期値：0）<br/>ボタン：ボタンの状態値（押すと1、違うと0、初期値：0）<br/>x軸の加速度：加速度センサーのX軸の値（値の範囲：-32768〜32767、初期値：0）ロボットが前進する方向がX軸の正の値方向です。<br/>y軸の加速度：加速度センサーのY軸の値（値の範囲：-32768〜32767、初期値：0）ロボットの左方向がY軸の正の値方向です。<br/>z軸の加速度：加速度センサーのZ軸の値（値の範囲：-32768〜32767、初期値：0）ロボットの上部方向がZ軸の正の値方向です。<br/>温度：ロボット内部の温度値（値の範囲：摂氏-41〜87度、初期値：0）<br/>信号の強さ：Bluetoothワイヤレス通信の信号強度（値の範囲：-128〜0 dBm、初期値：0）信号の強度が強いほど値が大きくなります。',
            brown_move_forward_unit: '入力された距離(cm)/時間(秒)/パルスだけ前方に移動します。',
            brown_move_backward_unit: '入力された距離(cm)/時間(秒)/パルスだけ後方に移動します。',
            brown_turn_unit_in_place: '入力した角度(度)/時間(秒)/パルスだけ左/右方向にその場で回転します。',
            brown_pivot_around_wheel_unit_in_direction: '左/右の車輪中心に入力した角度(度)/時間(秒)/パルスだけ前方/後方の方向に回転します。',
            brown_change_wheels_by_left_right: '左と右の車輪の現在の速度値(％)で入力した値をそれぞれ加算します。加算した結果が正の値であれば、車輪が前方に回転し、負の値であれば後ろに回転します。',
            brown_set_wheels_to_left_right: '左と右の車輪の速度を入力した値(-100〜100％)でそれぞれ設定します。正の値を入力すると車輪が前方に回転し、負の値を入力すると後ろに回転します。「0」を入力すると停止します。',
            brown_change_wheel_by: '左/右/両方車輪の現在速度値(％)で入力した値を加算します。加算した結果が正の値であれば車輪が前方に回転し、負の値であれば後ろに回転します。',
            brown_set_wheel_to: '左/右/両方車輪の速度を入力した値(-100〜100％)に設定します。正の値を入力すると車輪が前方に回転し、負の値を入力すると後ろに回転します。「0」を入力すると停止します。',
            brown_follow_line: '白地にある黒い線にそって移動します。',
            brown_follow_line_until: '白地にある黒い線にそって移動している途中で、選択した色をカラーセンサーが感知すると停止します。',
            brown_cross_intersection: '黒い線の交差点で少し前に移動した後、黒い線を探します。',
            brown_turn_at_intersection: '黒い線の交差点で少し前に移動した後、その場で左/右/後ろに回転して黒い線を探します。',
            brown_jump_line: 'その場で左/右に90度回転した後、前方に移動している途中で、黒い線をカラーセンサーが感知すると停止し、元の方向に回転します。',
            brown_set_following_speed_to: '線にそって移動する速度(1〜8)を設定します。数字が大きいほど移動速度が速くなります。',
            brown_stop: '両方の車輪を停止します。',
            brown_set_led_to: 'LEDの色を選択した色に設定します。',
            brown_pick_led: 'LEDの色を選択した色に設定します。',
            brown_change_led_by_rgb: '現在のLEDの色に入力したR・G・Bの値をそれぞれ加算します。',
            brown_set_led_to_rgb: 'LEDの色を入力したR・G・Bの値に設定します。',
            brown_clear_led: 'LEDをオフにします。',
            brown_play_sound_times: '選択された音を入力した回数だけ再生し、再生が完了するまで待ちます。',
            brown_play_sound_times_until_done: '選択された音を入力した回数だけ再生し、再生が完了するまで待ちます。',
            brown_change_buzzer_by: '現在のブザー音の高さ（Hz)に入力した値を加算します。 小数点以下2桁まで入力できます。',
            brown_set_buzzer_to: 'ブザー音の高さを入力した値（Hz）に設定します。 小数点以下2桁まで入力できます。「0」を入力すると音がオフになります。',
            brown_clear_sound: '音をオフにします。',
            brown_play_note: '選択した音階（音名、オクターブ）の音をならします。',
            brown_play_note_for_beats: '選択した音階（音名、オクターブ）の音を入力した拍子だけならします。',
            brown_rest_for_beats: '入力した拍子だけ止めます。',
            brown_change_tempo_by: '現在の演奏のBPM(毎分拍数)に入力した値を加算します。',
            brown_set_tempo_to: '演奏の速度を入力したBPM(毎分拍数)に設定します。',
        },
        Blocks: {
            ROBOID_monitor_buzzer: 'ブザー',
            ROBOID_monitor_note: '音符',
            ROBOID_monitor_left_wheel: '左車輪',
            ROBOID_monitor_right_wheel: '右車輪',
            ROBOID_sensor_signal_strength: '信号の強さ',
            ROBOID_sensor_color_r: '色R',
            ROBOID_sensor_color_g: '色G',
            ROBOID_sensor_color_b: '色B',
            ROBOID_sensor_floor: '床面センサー',
            ROBOID_sensor_acceleration_x: 'x軸の加速度',
            ROBOID_sensor_acceleration_y: 'y軸の加速度',
            ROBOID_sensor_acceleration_z: 'z軸の加速度',
            ROBOID_sensor_temperature: '温度',
            ROBOID_sensor_button: 'ボタン',
            ROBOID_sensor_color_number: '色番号',
            ROBOID_sensor_color_pattern: '色パターン',
            ROBOID_color_red: '赤色',
            ROBOID_color_orange: 'オレンジ色',
            ROBOID_color_yellow: '黄色',
            ROBOID_color_green: '緑色',
            ROBOID_color_sky_blue: '水色',
            ROBOID_color_blue: '青色',
            ROBOID_color_violet: '青むらさき色',
            ROBOID_color_purple: 'むらさき色',
            ROBOID_color_white: '白色',
            ROBOID_color_black: '黒色',
            ROBOID_color_any: '全ての色',
            ROBOID_clicked: 'クリックしたか',
            ROBOID_double_clicked: 'ダブルクリックしたか',
            ROBOID_long_pressed: '長く押したか',
            ROBOID_tilt_forward: '前にかたむけたか',
            ROBOID_tilt_backward: '後にかたむけたか',
            ROBOID_tilt_left: '左にかたむけたか',
            ROBOID_tilt_right: '右にかたむけたか',
            ROBOID_tilt_flip: 'うら返したか',
            ROBOID_tilt_not: 'かたむいてないか',
            ROBOID_battery_normal: '電池残量が充分か',
            ROBOID_battery_low: '電池残量が足りないか',
            ROBOID_battery_empty: '電池残量がなくなったか',
            ROBOID_free_fall: '落下したか',
            ROBOID_tap: '叩いたか',
            ROBOID_unit_cm: 'cm',
            ROBOID_unit_sec: '秒',
            ROBOID_unit_pulse: 'パルス',
            ROBOID_unit_deg: '度',
            ROBOID_left: '左',
            ROBOID_right: '右',
            ROBOID_both: '両方',
            ROBOID_back: '後ろ',
            ROBOID_forward: '前',
            ROBOID_backward: '後',
            ROBOID_sound_beep: 'ビープ',
            ROBOID_sound_random_beep: 'ランダムビープ',
            ROBOID_sound_noise: 'ノイズ',
            ROBOID_sound_siren: 'サイレン',
            ROBOID_sound_engine: 'エンジン',
            ROBOID_sound_chop: 'チョップ',
            ROBOID_sound_robot: 'ロボット',
            ROBOID_sound_dibidibidip: 'ディビディビディ',
            ROBOID_sound_good_job: 'よくできました',
            ROBOID_sound_happy: 'よろこび',
            ROBOID_sound_angry: 'いかり',
            ROBOID_sound_sad: 'かなしみ',
            ROBOID_sound_sleep: 'ねむい',
            ROBOID_sound_march: 'マーチ',
            ROBOID_sound_birthday: 'たんじょうび',
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
            brown_touching_color: 'touching %1 ?',
            brown_is_color_pattern: 'color pattern %1 %2 ?',
            brown_button_state: 'button %1 ?',
            brown_boolean: '%1?',
            brown_value: '%1',
            brown_move_forward_unit: 'move forward %1 %2 %3',
            brown_move_backward_unit: 'move backward %1 %2 %3',
            brown_turn_unit_in_place: 'turn %1 %2 %3 in place %4',
            brown_pivot_around_wheel_unit_in_direction: 'pivot around %1 wheel %2 %3 in %4 direction %5',
            brown_change_wheels_by_left_right: 'change wheels by left: %1 right: %2 %3',
            brown_set_wheels_to_left_right: 'set wheels to left: %1 right: %2 %3',
            brown_change_wheel_by: 'change %1 wheel by %2 %3',
            brown_set_wheel_to: 'set %1 wheel to %2 %3',
            brown_follow_line: 'follow line %1',
            brown_follow_line_until: 'follow line until %1 %2',
            brown_cross_intersection: 'cross intersection %1',
            brown_turn_at_intersection: 'turn %1 at intersection %2',
            brown_jump_line: 'jump to %1 line %2',
            brown_set_following_speed_to: 'set following speed to %1 %2',
            brown_stop: 'stop %1',
            brown_set_led_to: 'set led to %1 %2',
            brown_pick_led: 'set led to %1 %2',
            brown_change_led_by_rgb: 'change led by r: %1 g: %2 b: %3 %4',
            brown_set_led_to_rgb: 'set led to r: %1 g: %2 b: %3 %4',
            brown_clear_led: 'clear led %1',
            brown_play_sound_times: 'play sound %1 %2 times %3',
            brown_play_sound_times_until_done: 'play sound %1 %2 times until done %3',
            brown_change_buzzer_by: 'change buzzer by %1 %2',
            brown_set_buzzer_to: 'set buzzer to %1 %2',
            brown_clear_sound: 'clear sound %1',
            brown_play_note: 'play note %1 %2 %3',
            brown_play_note_for_beats: 'play note %1 %2 for %3 beats %4',
            brown_rest_for_beats: 'rest for %1 beats %2',
            brown_change_tempo_by: 'change tempo by %1 %2',
            brown_set_tempo_to: 'set tempo to %1 bpm %2',
        },
        Helper: {
            brown_touching_color: 'If the color sensor detects the selected color, true, otherwise false.',
            brown_is_color_pattern: 'If the color sensor detects the selected color pattern, true, otherwise false.',
            brown_button_state: 'If the button clicked/double-clicked/long-pressed, true, otherwise false.',
            brown_boolean: "tilt forward: If tilted forward, true, otherwise false<br/>tilt backward: If tilted backward, true, otherwise false<br/>tilt left: If tilted to the left, true, otherwise false<br/>tilt right: If tilted to the right, true, otherwise false<br/>tilt flip: If upside-down, true, otherwise false<br/>not tilt: If not tilted, true, otherwise false<br/>tap: If tapped, true, otherwise false<br/>free fall: If free fall, true, otherwise false<br/>battery normal: If the battery is enough, true, otherwise false<br/>battery low: If the battery is low, true, otherwise false<br/>battery empty: If the battery is empty, true, otherwise false",
            brown_value: 'color number: color number detected by the color sensor (range: -2 to 8, initial value: -1)<br/>color pattern: value of the color pattern detected by the color sensor (range: -1 ~ 88, initial value: -1)<br/>color r: red component of color detected by the color sensor (range: 0 ~ 255, initial value: 0)<br/>color g: green component of color detected by the color sensor (range: 0 ~ 255, initial value: 0)<br/>color b: blue component of color detected by the color sensor (range: 0 ~ 255, initial value: 0)<br/>floor: value of floor sensor (range: 0 to 100, initial value: 0)<br/>button: status of the button (when pressed 1, otherwise 0, initial value: 0)<br/>x acceleration: x-axis value of acceleration sensor (range: -32768 to 32767, initial value: 0) The direction in which the robot moves forward is the positive direction of the x axis.<br/>y acceleration: y-axis value of acceleration sensor (range: -32768 to 32767, initial value: 0) The left direction of the robot is the positive direction of the y axis.<br/>z acceleration: z-axis value of acceleration sensor (range: -32768 to 32767, initial value: 0) The upward direction of the robot is the positive direction of the z axis.<br/>temperature: temperature value inside the robot (range: -41 to 87 degrees Celsius, initial value: 0)<br/>signal strength: signal strength of Bluetooth communication (range: -128 to 0 dBm, initial value: 0) As the signal strength increases, the value increases.',
            brown_move_forward_unit: 'Moves forward for the number of cm/seconds/pulses entered.',
            brown_move_backward_unit: 'Moves backward for the number of cm/seconds/pulses entered.',
            brown_turn_unit_in_place: 'Turns left/right in place for the number of degrees/seconds/pulses entered.',
            brown_pivot_around_wheel_unit_in_direction: 'Pivots around the left/right wheel in the forward/backward direction for the number of degrees/seconds/pulses entered.',
            brown_change_wheels_by_left_right: 'Adds the entered values to the current velocity values (%) of the left and right wheels respectively. If the result is positive, the wheel rotates forward; if negative, the wheel rotates backward.',
            brown_set_wheels_to_left_right: 'Sets the velocity of the left and right wheels to the entered values (-100 to 100%), respectively. If you enter a positive value, the wheel rotates forward. If you enter a negative value, the wheel rotates backward. Entering the number 0 stops it.',
            brown_change_wheel_by: 'Adds the entered value to the current velocity value (%) of the left/right/both wheels. If the result is positive, the wheel rotates forward; if negative, the wheel rotates backward.',
            brown_set_wheel_to: 'Sets the velocity of the left/right/both wheels to the entered value (-100 to 100%). If you enter a positive value, the wheel rotates forward. If you enter a negative value, the wheel rotates backward. Entering the number 0 stops it.',
            brown_follow_line: 'Moves along the black line on a white background.',
            brown_follow_line_until: 'Moves along the black line on a white background and stops when the color sensor detects the selected color.',
            brown_cross_intersection: 'Moves forward for a moment at the black intersection, then finds the black line.',
            brown_turn_at_intersection: 'Moves forward for a moment at the black intersection, then turns left/right/back in place and finds the black line.',
            brown_jump_line: 'Turns left/right 90 degrees in place and moves forward. Stops when the color sensor detects the black line and turns to its original direction.',
            brown_set_following_speed_to: 'Sets the speed (1 to 8) to move along the line. The larger the number, the faster the movement.',
            brown_stop: 'Stops both wheels.',
            brown_set_led_to: 'Turns the LED to the selected color.',
            brown_pick_led: 'Turns the LED to the selected color.',
            brown_change_led_by_rgb: 'Adds the entered values to the current R, G, B values of the LED, respectively.',
            brown_set_led_to_rgb: 'Sets the R, G, B values of the LED to the entered values.',
            brown_clear_led: 'Turns off the LED.',
            brown_play_sound_times: 'Plays the selected sound as many times as entered.',
            brown_play_sound_times_until_done: 'Plays the selected sound as many times as entered, and waits for completion.',
            brown_change_buzzer_by: 'Adds the entered value to the current pitch (Hz) of the buzzer sound. You can enter up to two decimal places.',
            brown_set_buzzer_to: 'Sets the pitch of the buzzer sound to the entered value (Hz). You can enter up to two decimal places. Entering the number 0 turns off the buzzer sound.',
            brown_clear_sound: 'Turns off sound.',
            brown_play_note: 'It sounds the selected tone and octave.',
            brown_play_note_for_beats: 'It sounds the selected tone and octave as much as the beat you entered.',
            brown_rest_for_beats: 'Rests as much as the beat you entered.',
            brown_change_tempo_by: 'Adds the entered value to the current BPM (beats per minute) of the playing or resting speed.',
            brown_set_tempo_to: 'Sets the playing or resting speed to the entered BPM (beats per minute).',
        },
        Blocks: {
            ROBOID_monitor_buzzer: 'buzzer',
            ROBOID_monitor_note: 'note',
            ROBOID_monitor_left_wheel: 'left wheel',
            ROBOID_monitor_right_wheel: 'right wheel',
            ROBOID_sensor_signal_strength: 'signal strength',
            ROBOID_sensor_color_r: 'color r',
            ROBOID_sensor_color_g: 'color g',
            ROBOID_sensor_color_b: 'color b',
            ROBOID_sensor_floor: 'floor',
            ROBOID_sensor_acceleration_x: 'x acceleration',
            ROBOID_sensor_acceleration_y: 'y acceleration',
            ROBOID_sensor_acceleration_z: 'z acceleration',
            ROBOID_sensor_temperature: 'temperature',
            ROBOID_sensor_button: 'button',
            ROBOID_sensor_color_number: 'color number',
            ROBOID_sensor_color_pattern: 'color pattern',
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
            ROBOID_tilt_forward: 'tilt forward',
            ROBOID_tilt_backward: 'tilt backward',
            ROBOID_tilt_left: 'tilt left',
            ROBOID_tilt_right: 'tilt right',
            ROBOID_tilt_flip: 'tilt flip',
            ROBOID_tilt_not: 'not tilt',
            ROBOID_battery_normal: 'battery normal',
            ROBOID_battery_low: 'battery low',
            ROBOID_battery_empty: 'battery empty',
            ROBOID_free_fall: 'free fall',
            ROBOID_tap: 'tap',
            ROBOID_unit_cm: 'cm',
            ROBOID_unit_sec: 'seconds',
            ROBOID_unit_pulse: 'pulses',
            ROBOID_unit_deg: 'degrees',
            ROBOID_left: 'left',
            ROBOID_right: 'right',
            ROBOID_both: 'both',
            ROBOID_back: 'back',
            ROBOID_forward: 'forward',
            ROBOID_backward: 'backward',
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

Entry.Brown.blockMenuBlocks = [
    'brown_value',
    'brown_touching_color',
    'brown_is_color_pattern',
    'brown_button_state',
    'brown_boolean',
    'brown_move_forward_unit',
    'brown_move_backward_unit',
    'brown_turn_unit_in_place',
    'brown_pivot_around_wheel_unit_in_direction',
    'brown_change_wheels_by_left_right',
    'brown_set_wheels_to_left_right',
    'brown_change_wheel_by',
    'brown_set_wheel_to',
    'brown_follow_line',
    'brown_follow_line_until',
    'brown_cross_intersection',
    'brown_turn_at_intersection',
    'brown_jump_line',
    'brown_set_following_speed_to',
    'brown_stop',
    'brown_set_led_to',
    'brown_pick_led',
    'brown_change_led_by_rgb',
    'brown_set_led_to_rgb',
    'brown_clear_led',
    'brown_play_sound_times',
    'brown_play_sound_times_until_done',
    'brown_change_buzzer_by',
    'brown_set_buzzer_to',
    'brown_clear_sound',
    'brown_play_note',
    'brown_play_note_for_beats',
    'brown_rest_for_beats',
    'brown_change_tempo_by',
    'brown_set_tempo_to',
];

Entry.Brown.getBlocks = function() {
    return {
        brown_touching_color: {
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
                type: 'brown_touching_color',
            },
            paramsKeyMap: {
                COLOR: 0,
            },
            class: 'brown_sensor',
            isNotFor: ['brown'],
            func(sprite, script) {
                const robot = Entry.Brown.getRobot();
                return robot ? robot.checkTouchingColor(script) : false;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Brown.is_color(%1)',
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
        brown_is_color_pattern: {
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
                type: 'brown_is_color_pattern',
            },
            paramsKeyMap: {
                COLOR1: 0,
                COLOR2: 1,
            },
            class: 'brown_sensor',
            isNotFor: ['brown'],
            func(sprite, script) {
                const robot = Entry.Brown.getRobot();
                return robot ? robot.checkColorPattern(script) : false;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Brown.is_color_pattern(%1, %2)',
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
        brown_button_state: {
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
                type: 'brown_button_state',
            },
            paramsKeyMap: {
                STATE: 0,
            },
            class: 'brown_sensor',
            isNotFor: ['brown'],
            func(sprite, script) {
                const robot = Entry.Brown.getRobot();
                return robot ? robot.checkButtonState(script) : false;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Brown.is_button(%1)',
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
        brown_boolean: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.ROBOID_tilt_forward, 'TILT_FORWARD'],
                        [Lang.Blocks.ROBOID_tilt_backward, 'TILT_BACKWARD'],
                        [Lang.Blocks.ROBOID_tilt_left, 'TILT_LEFT'],
                        [Lang.Blocks.ROBOID_tilt_right, 'TILT_RIGHT'],
                        [Lang.Blocks.ROBOID_tilt_flip, 'TILT_FLIP'],
                        [Lang.Blocks.ROBOID_tilt_not, 'TILT_NOT'],
                        [Lang.Blocks.ROBOID_tap, 'TAP'],
                        [Lang.Blocks.ROBOID_free_fall, 'FREE_FALL'],
                        [Lang.Blocks.ROBOID_battery_normal, 'BATTERY_NORMAL'],
                        [Lang.Blocks.ROBOID_battery_low, 'BATTERY_LOW'],
                        [Lang.Blocks.ROBOID_battery_empty, 'BATTERY_EMPTY'],
                    ],
                    value: 'TILT_FORWARD',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [],
                type: 'brown_boolean',
            },
            paramsKeyMap: {
                DEVICE: 0,
            },
            class: 'brown_sensor',
            isNotFor: ['brown'],
            func(sprite, script) {
                const robot = Entry.Brown.getRobot();
                return robot ? robot.checkBoolean(script) : false;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Brown.boolean_value(%1)',
                        blockType: 'param',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.ROBOID_tilt_forward, 'TILT_FORWARD'],
                                    [Lang.Blocks.ROBOID_tilt_backward, 'TILT_BACKWARD'],
                                    [Lang.Blocks.ROBOID_tilt_left, 'TILT_LEFT'],
                                    [Lang.Blocks.ROBOID_tilt_right, 'TILT_RIGHT'],
                                    [Lang.Blocks.ROBOID_tilt_flip, 'TILT_FLIP'],
                                    [Lang.Blocks.ROBOID_tilt_not, 'TILT_NOT'],
                                    [Lang.Blocks.ROBOID_tap, 'TAP'],
                                    [Lang.Blocks.ROBOID_free_fall, 'FREE_FALL'],
                                    [Lang.Blocks.ROBOID_battery_normal, 'BATTERY_NORMAL'],
                                    [Lang.Blocks.ROBOID_battery_low, 'BATTERY_LOW'],
                                    [Lang.Blocks.ROBOID_battery_empty, 'BATTERY_EMPTY'],
                                ],
                                value: 'TILT_FORWARD',
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
        brown_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.ROBOID_sensor_color_number, 'COLOR_NUMBER'],
                        [Lang.Blocks.ROBOID_sensor_color_pattern, 'COLOR_PATTERN'],
                        [Lang.Blocks.ROBOID_sensor_color_r, 'COLOR_R'],
                        [Lang.Blocks.ROBOID_sensor_color_g, 'COLOR_G'],
                        [Lang.Blocks.ROBOID_sensor_color_b, 'COLOR_B'],
                        [Lang.Blocks.ROBOID_sensor_floor, 'FLOOR'],
                        [Lang.Blocks.ROBOID_sensor_button, 'BUTTON'],
                        [Lang.Blocks.ROBOID_sensor_acceleration_x, 'ACCELERATION_X'],
                        [Lang.Blocks.ROBOID_sensor_acceleration_y, 'ACCELERATION_Y'],
                        [Lang.Blocks.ROBOID_sensor_acceleration_z, 'ACCELERATION_Z'],
                        [Lang.Blocks.ROBOID_sensor_temperature, 'TEMPERATURE'],
                        [Lang.Blocks.ROBOID_sensor_signal_strength, 'SIGNAL_STRENGTH'],
                    ],
                    value: 'COLOR_NUMBER',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'brown_value',
            },
            paramsKeyMap: {
                DEVICE: 0,
            },
            class: 'brown_sensor',
            isNotFor: ['brown'],
            func(sprite, script) {
                const robot = Entry.Brown.getRobot();
                if (robot) {
                    return robot.getValue(script);
                }
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Brown.sensor_value(%1)',
                        blockType: 'param',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.ROBOID_sensor_color_number, 'COLOR_NUMBER'],
                                    [Lang.Blocks.ROBOID_sensor_color_pattern, 'COLOR_PATTERN'],
                                    [Lang.Blocks.ROBOID_sensor_color_r, 'COLOR_R'],
                                    [Lang.Blocks.ROBOID_sensor_color_g, 'COLOR_G'],
                                    [Lang.Blocks.ROBOID_sensor_color_b, 'COLOR_B'],
                                    [Lang.Blocks.ROBOID_sensor_floor, 'FLOOR'],
                                    [Lang.Blocks.ROBOID_sensor_button, 'BUTTON'],
                                    [Lang.Blocks.ROBOID_sensor_acceleration_x, 'ACCELERATION_X'],
                                    [Lang.Blocks.ROBOID_sensor_acceleration_y, 'ACCELERATION_Y'],
                                    [Lang.Blocks.ROBOID_sensor_acceleration_z, 'ACCELERATION_Z'],
                                    [Lang.Blocks.ROBOID_sensor_temperature, 'TEMPERATURE'],
                                    [Lang.Blocks.ROBOID_sensor_signal_strength, 'SIGNAL_STRENGTH'],
                                ],
                                value: 'COLOR_NUMBER',
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
        brown_move_forward_unit: {
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
                type: 'brown_move_forward_unit',
            },
            paramsKeyMap: {
                VALUE: 0,
                UNIT: 1,
            },
            class: 'brown_wheel',
            isNotFor: ['brown'],
            func(sprite, script) {
                const robot = Entry.Brown.getRobot();
                return robot ? robot.moveForwardUnit(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Brown.move_forward(%1, %2)',
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
        brown_move_backward_unit: {
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
                type: 'brown_move_backward_unit',
            },
            paramsKeyMap: {
                VALUE: 0,
                UNIT: 1,
            },
            class: 'brown_wheel',
            isNotFor: ['brown'],
            func(sprite, script) {
                const robot = Entry.Brown.getRobot();
                return robot ? robot.moveBackwardUnit(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Brown.move_backward(%1, %2)',
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
        brown_turn_unit_in_place: {
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
                type: 'brown_turn_unit_in_place',
            },
            paramsKeyMap: {
                DIRECTION: 0,
                VALUE: 1,
                UNIT: 2,
            },
            class: 'brown_wheel',
            isNotFor: ['brown'],
            func(sprite, script) {
                const robot = Entry.Brown.getRobot();
                return robot ? robot.turnUnit(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Brown.turn(%1, %2, %3)',
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
        brown_pivot_around_wheel_unit_in_direction: {
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
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.ROBOID_forward, 'FORWARD'],
                        [Lang.Blocks.ROBOID_backward, 'BACKWARD']
                    ],
                    value: 'FORWARD',
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
                    null,
                ],
                type: 'brown_pivot_around_wheel_unit_in_direction',
            },
            paramsKeyMap: {
                WHEEL: 0,
                VALUE: 1,
                UNIT: 2,
                TOWARD: 3,
            },
            class: 'brown_wheel',
            isNotFor: ['brown'],
            func(sprite, script) {
                const robot = Entry.Brown.getRobot();
                return robot ? robot.pivotUnit(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Brown.pivot(%1, %2, %3, %4)',
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
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.ROBOID_forward, 'FORWARD'],
                                    [Lang.Blocks.ROBOID_backward, 'BACKWARD']
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
        brown_change_wheels_by_left_right: {
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
                type: 'brown_change_wheels_by_left_right',
            },
            paramsKeyMap: {
                LEFT: 0,
                RIGHT: 1,
            },
            class: 'brown_wheel',
            isNotFor: ['brown'],
            func(sprite, script) {
                const robot = Entry.Brown.getRobot();
                return robot ? robot.changeWheels(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Brown.add_wheels(%1, %2)',
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
        brown_set_wheels_to_left_right: {
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
                        params: ['40'],
                    },
                    {
                        type: 'text',
                        params: ['40'],
                    },
                    null,
                ],
                type: 'brown_set_wheels_to_left_right',
            },
            paramsKeyMap: {
                LEFT: 0,
                RIGHT: 1,
            },
            class: 'brown_wheel',
            isNotFor: ['brown'],
            func(sprite, script) {
                const robot = Entry.Brown.getRobot();
                return robot ? robot.setWheels(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Brown.set_wheels(%1, %2)',
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
        brown_change_wheel_by: {
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
                type: 'brown_change_wheel_by',
            },
            paramsKeyMap: {
                WHEEL: 0,
                VELOCITY: 1,
            },
            class: 'brown_wheel',
            isNotFor: ['brown'],
            func(sprite, script) {
                const robot = Entry.Brown.getRobot();
                return robot ? robot.changeWheel(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Brown.add_wheel(%1, %2)',
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
        brown_set_wheel_to: {
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
                        params: ['40'],
                    },
                    null,
                ],
                type: 'brown_set_wheel_to',
            },
            paramsKeyMap: {
                WHEEL: 0,
                VELOCITY: 1,
            },
            class: 'brown_wheel',
            isNotFor: ['brown'],
            func(sprite, script) {
                const robot = Entry.Brown.getRobot();
                return robot ? robot.setWheel(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Brown.set_wheel(%1, %2)',
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
        brown_follow_line: {
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
                type: 'brown_follow_line',
            },
            class: 'brown_wheel',
            isNotFor: ['brown'],
            func(sprite, script) {
                const robot = Entry.Brown.getRobot();
                return robot ? robot.followLine(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Brown.follow_line()',
                    },
                ],
            },
        },
        brown_follow_line_until: {
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
                type: 'brown_follow_line_until',
            },
            paramsKeyMap: {
                COLOR: 0,
            },
            class: 'brown_wheel',
            isNotFor: ['brown'],
            func(sprite, script) {
                const robot = Entry.Brown.getRobot();
                return robot ? robot.followLineUntil(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Brown.follow_line_until(%1)',
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
        brown_cross_intersection: {
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
                type: 'brown_cross_intersection',
            },
            class: 'brown_wheel',
            isNotFor: ['brown'],
            func(sprite, script) {
                const robot = Entry.Brown.getRobot();
                return robot ? robot.crossIntersection(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Brown.cross_forward()',
                    },
                ],
            },
        },
        brown_turn_at_intersection: {
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
                type: 'brown_turn_at_intersection',
            },
            paramsKeyMap: {
                DIRECTION: 0,
            },
            class: 'brown_wheel',
            isNotFor: ['brown'],
            func(sprite, script) {
                const robot = Entry.Brown.getRobot();
                return robot ? robot.turnAtIntersection(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Brown.cross_turn(%1)',
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
        brown_jump_line: {
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
                type: 'brown_jump_line',
            },
            paramsKeyMap: {
                DIRECTION: 0,
            },
            class: 'brown_wheel',
            isNotFor: ['brown'],
            func(sprite, script) {
                const robot = Entry.Brown.getRobot();
                return robot ? robot.jumpLine(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Brown.jump_line(%1)',
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
        brown_set_following_speed_to: {
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
                type: 'brown_set_following_speed_to',
            },
            paramsKeyMap: {
                SPEED: 0,
            },
            class: 'brown_wheel',
            isNotFor: ['brown'],
            func(sprite, script) {
                const robot = Entry.Brown.getRobot();
                return robot ? robot.setLineTracerSpeed(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Brown.set_line_speed(%1)',
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
        brown_stop: {
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
                type: 'brown_stop',
            },
            class: 'brown_wheel',
            isNotFor: ['brown'],
            func(sprite, script) {
                const robot = Entry.Brown.getRobot();
                return robot ? robot.stop(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Brown.stop()',
                    },
                ],
            },
        },
        brown_set_led_to: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
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
                params: [null, null],
                type: 'brown_set_led_to',
            },
            paramsKeyMap: {
                COLOR: 0,
            },
            class: 'brown_led',
            isNotFor: ['brown'],
            func(sprite, script) {
                const robot = Entry.Brown.getRobot();
                return robot ? robot.setLedColor(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Brown.set_led(%1)',
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
        brown_pick_led: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
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
                params: [null, null],
                type: 'brown_pick_led',
            },
            paramsKeyMap: {
                COLOR: 0,
            },
            class: 'brown_led',
            isNotFor: ['brown'],
            func(sprite, script) {
                const robot = Entry.Brown.getRobot();
                return robot ? robot.pickLedColor(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Brown.pick_led(%1)',
                        textParams: [
                            {
                                type: 'Color',
                                converter: Entry.block.converters.returnStringValue,
                            },
                        ],
                    },
                ],
            },
        },
        brown_change_led_by_rgb: {
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
                type: 'brown_change_led_by_rgb',
            },
            paramsKeyMap: {
                RED: 0,
                GREEN: 1,
                BLUE: 2,
            },
            class: 'brown_led',
            isNotFor: ['brown'],
            func(sprite, script) {
                const robot = Entry.Brown.getRobot();
                return robot ? robot.changeLedRgb(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Brown.add_rgb(%1, %2, %3)',
                        textParams: [
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
        brown_set_led_to_rgb: {
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
                type: 'brown_set_led_to_rgb',
            },
            paramsKeyMap: {
                RED: 0,
                GREEN: 1,
                BLUE: 2,
            },
            class: 'brown_led',
            isNotFor: ['brown'],
            func(sprite, script) {
                const robot = Entry.Brown.getRobot();
                return robot ? robot.setLedRgb(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Brown.set_rgb(%1, %2, %3)',
                        textParams: [
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
        brown_clear_led: {
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
                type: 'brown_clear_led',
            },
            class: 'brown_led',
            isNotFor: ['brown'],
            func(sprite, script) {
                const robot = Entry.Brown.getRobot();
                return robot ? robot.clearLed(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Brown.clear_led()',
                    },
                ],
            },
        },
        brown_play_sound_times: {
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
                type: 'brown_play_sound_times',
            },
            paramsKeyMap: {
                SOUND: 0,
                COUNT: 1,
            },
            class: 'brown_sound',
            isNotFor: ['brown'],
            func(sprite, script) {
                const robot = Entry.Brown.getRobot();
                return robot ? robot.playSound(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Brown.play_sound(%1, %2)',
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
                            { type: 'Block', accept: 'string' },
                        ],
                    },
                ],
            },
        },
        brown_play_sound_times_until_done: {
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
                type: 'brown_play_sound_times_until_done',
            },
            paramsKeyMap: {
                SOUND: 0,
                COUNT: 1,
            },
            class: 'brown_sound',
            isNotFor: ['brown'],
            func(sprite, script) {
                const robot = Entry.Brown.getRobot();
                return robot ? robot.playSoundUntil(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Brown.play_sound_until_done(%1, %2)',
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
                            { type: 'Block', accept: 'string' },
                        ],
                    },
                ],
            },
        },
        brown_change_buzzer_by: {
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
                type: 'brown_change_buzzer_by',
            },
            paramsKeyMap: {
                HZ: 0,
            },
            class: 'brown_sound',
            isNotFor: ['brown'],
            func(sprite, script) {
                const robot = Entry.Brown.getRobot();
                return robot ? robot.changeBuzzer(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Brown.add_buzzer(%1)',
                    },
                ],
            },
        },
        brown_set_buzzer_to: {
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
                type: 'brown_set_buzzer_to',
            },
            paramsKeyMap: {
                HZ: 0,
            },
            class: 'brown_sound',
            isNotFor: ['brown'],
            func(sprite, script) {
                const robot = Entry.Brown.getRobot();
                return robot ? robot.setBuzzer(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Brown.set_buzzer(%1)',
                    },
                ],
            },
        },
        brown_clear_sound: {
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
                type: 'brown_clear_sound',
            },
            class: 'brown_sound',
            isNotFor: ['brown'],
            func(sprite, script) {
                const robot = Entry.Brown.getRobot();
                return robot ? robot.clearSound(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Brown.clear_sound()',
                    },
                ],
            },
        },
        brown_play_note: {
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
                type: 'brown_play_note',
            },
            paramsKeyMap: {
                NOTE: 0,
                OCTAVE: 1,
            },
            class: 'brown_sound',
            isNotFor: ['brown'],
            func(sprite, script) {
                const robot = Entry.Brown.getRobot();
                return robot ? robot.playNote(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Brown.play_pitch(%1, %2)',
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
        brown_play_note_for_beats: {
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
                type: 'brown_play_note_for_beats',
            },
            paramsKeyMap: {
                NOTE: 0,
                OCTAVE: 1,
                BEAT: 2,
            },
            class: 'brown_sound',
            isNotFor: ['brown'],
            func(sprite, script) {
                const robot = Entry.Brown.getRobot();
                return robot ? robot.playNoteBeat(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Brown.play_note(%1, %2, %3)',
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
                            { type: 'Block', accept: 'string' },
                        ],
                    },
                ],
            },
        },
        brown_rest_for_beats: {
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
                type: 'brown_rest_for_beats',
            },
            paramsKeyMap: {
                BEAT: 0,
            },
            class: 'brown_sound',
            isNotFor: ['brown'],
            func(sprite, script) {
                const robot = Entry.Brown.getRobot();
                return robot ? robot.restBeat(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Brown.rest(%1)',
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
        brown_change_tempo_by: {
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
                type: 'brown_change_tempo_by',
            },
            paramsKeyMap: {
                BPM: 0,
            },
            class: 'brown_sound',
            isNotFor: ['brown'],
            func(sprite, script) {
                const robot = Entry.Brown.getRobot();
                return robot ? robot.changeTempo(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Brown.add_tempo(%1)',
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
        brown_set_tempo_to: {
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
                type: 'brown_set_tempo_to',
            },
            paramsKeyMap: {
                BPM: 0,
            },
            class: 'brown_sound',
            isNotFor: ['brown'],
            func(sprite, script) {
                const robot = Entry.Brown.getRobot();
                return robot ? robot.setTempo(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Brown.set_tempo(%1)',
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

module.exports = Entry.Brown;
