'use strict';

Entry.HamsterS = {
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
        const robot = Entry.Robomation.getRobot('hamster', 0);
        if (robot) {
            robot.setMotoring(Entry.hw.sendQueue);
        }
        return robot;
    },
    id: '2.E',
    name: 'hamsterS',
    url: 'http://www.robomation.net',
    imageName: 'hamster_s.png',
    title: {
        ko: '햄스터S',
        en: 'HamsterS',
        jp: 'ハムスターS',
        vn: 'HamsterS',
    },
    monitorTemplate: {
        imgPath: 'hw/hamster_s.png',
        width: 256,
        height: 256,
        listPorts: {
            temperature: {
                name: Lang.Blocks.HAMSTER_sensor_temperature,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            inputA: {
                name: Lang.Blocks.HAMSTER_sensor_input_a,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            inputB: {
                name: Lang.Blocks.HAMSTER_sensor_input_b,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            accelerationX: {
                name: Lang.Blocks.HAMSTER_sensor_acceleration_x,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            accelerationY: {
                name: Lang.Blocks.HAMSTER_sensor_acceleration_y,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            accelerationZ: {
                name: Lang.Blocks.HAMSTER_sensor_acceleration_z,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            buzzer: {
                name: Lang.Hw.buzzer,
                type: 'output',
                pos: { x: 0, y: 0 },
            },
            note: { name: Lang.Hw.note, type: 'output', pos: { x: 0, y: 0 } },
            outputA: {
                name: `${Lang.Hw.output}A`,
                type: 'output',
                pos: { x: 0, y: 0 },
            },
            outputB: {
                name: `${Lang.Hw.output}B`,
                type: 'output',
                pos: { x: 0, y: 0 },
            },
        },
        ports: {
            leftProximity: {
                name: Lang.Blocks.HAMSTER_sensor_left_proximity,
                type: 'input',
                pos: { x: 246, y: 110 },
            },
            rightProximity: {
                name: Lang.Blocks.HAMSTER_sensor_right_proximity,
                type: 'input',
                pos: { x: 128, y: 156 },
            },
            leftFloor: {
                name: Lang.Blocks.HAMSTER_sensor_left_floor,
                type: 'input',
                pos: { x: 243, y: 186 },
            },
            rightFloor: {
                name: Lang.Blocks.HAMSTER_sensor_right_floor,
                type: 'input',
                pos: { x: 150, y: 236 },
            },
            light: {
                name: Lang.Blocks.HAMSTER_sensor_light,
                type: 'input',
                pos: { x: 195, y: 190 },
            },
            leftWheel: {
                name: Lang.Hw.leftWheel,
                type: 'output',
                pos: { x: 190, y: 30 },
            },
            rightWheel: {
                name: Lang.Hw.rightWheel,
                type: 'output',
                pos: { x: 40, y: 115 },
            },
            leftRgb: {
                name: `${Lang.Hw.left} ${Lang.Hw.led_en}`,
                type: 'output',
                pos: { x: 235, y: 183 },
            },
            rightRgb: {
                name: `${Lang.Hw.right} ${Lang.Hw.led_en}`,
                type: 'output',
                pos: { x: 154, y: 228 },
            },
        },
        mode: 'both',
    },
};

Entry.HamsterS.setLanguage = () => ({
    ko: {
        template: {
            hamster_s_hand_found: '손 찾음?',
            hamster_s_boolean: '%1?',
            hamster_s_value: '%1',
            hamster_s_move_forward_once: '말판 앞으로 한 칸 이동하기 %1',
            hamster_s_turn_once: '말판 %1 으로 한 번 돌기 %2',
            hamster_s_move_forward_unit: '앞으로 %1 %2 이동하기 %3',
            hamster_s_move_backward_unit: '뒤로 %1 %2 이동하기 %3',
            hamster_s_turn_unit_in_place: '%1 으로 %2 %3 제자리 돌기 %4',
            hamster_s_pivot_around_unit_in_direction: '%1 중심으로 %2 %3 %4 방향으로 돌기 %5',
            hamster_s_turn_unit_with_radius_in_direction:
                '%1 %2 으로 %3 %4 반지름 %5 cm를 %6 방향으로 돌기 %7',
            hamster_s_change_both_wheels_by: '왼쪽 바퀴 %1 오른쪽 바퀴 %2 만큼 바꾸기 %3',
            hamster_s_set_both_wheels_to: '왼쪽 바퀴 %1 오른쪽 바퀴 %2 (으)로 정하기 %3',
            hamster_s_change_wheel_by: '%1 바퀴 %2 만큼 바꾸기 %3',
            hamster_s_set_wheel_to: '%1 바퀴 %2 (으)로 정하기 %3',
            hamster_s_follow_line_using: '%1 선을 %2 바닥 센서로 따라가기 %3',
            hamster_s_follow_line_until: '%1 선을 따라 %2 교차로까지 이동하기 %3',
            hamster_s_set_following_speed_to: '선 따라가기 속도를 %1 (으)로 정하기 %2',
            hamster_s_set_following_gain_to: '선 따라가기 방향 변화량을 %1 (으)로 정하기 %2',
            hamster_s_stop: '정지하기 %1',
            hamster_s_set_led_to: '%1 LED를 %2 으로 정하기 %3',
            hamster_s_pick_led: '%1 LED를 %2로 정하기 %3',
            hamster_s_change_led_by_rgb: '%1 LED를 R: %2 G: %3 B: %4 만큼 바꾸기 %5',
            hamster_s_set_led_to_rgb: '%1 LED를 R: %2 G: %3 B: %4 (으)로 정하기 %5',
            hamster_s_clear_led: '%1 LED 끄기 %2',
            hamster_s_play_sound_times: '%1 소리 %2 번 재생하기 %3',
            hamster_s_play_sound_times_until_done: '%1 소리 %2 번 재생하고 기다리기 %3',
            hamster_s_change_buzzer_by: '버저 음을 %1 만큼 바꾸기 %2',
            hamster_s_set_buzzer_to: '버저 음을 %1 (으)로 정하기 %2',
            hamster_s_clear_sound: '소리 끄기 %1',
            hamster_s_play_note: '%1 %2 음을 연주하기 %3',
            hamster_s_play_note_for: '%1 %2 음을 %3 박자 연주하기 %4',
            hamster_s_rest_for: '%1 박자 쉬기 %2',
            hamster_s_change_tempo_by: '연주 속도를 %1 만큼 바꾸기 %2',
            hamster_s_set_tempo_to: '연주 속도를 %1 BPM으로 정하기 %2',
            hamster_s_set_port_to: '포트 %1 를 %2 으로 정하기 %3',
            hamster_s_change_output_by: '출력 %1 를 %2 만큼 바꾸기 %3',
            hamster_s_set_output_to: '출력 %1 를 %2 (으)로 정하기 %3',
            hamster_s_gripper: '집게 %1 %2',
            hamster_s_release_gripper: '집게 끄기 %1',
            hamster_s_write_serial: '시리얼 %1 %2 쓰기 %3',
            hamster_s_read_serial_until: '시리얼 %1 읽기 %2',
            hamster_s_set_serial_rate_to: '시리얼 속도를 %1 Bd로 정하기 %2',
        },
        Helper: {
            hamster_s_hand_found:
                "근접 센서 앞에 손 또는 물체가 있으면 '참'으로 판단하고, 아니면 '거짓'으로 판단합니다.",
            hamster_s_boolean:
                "앞으로 기울임: 앞으로 기울이면 '참'으로 판단하고, 아니면 '거짓'으로 판단합니다.<br/>뒤로 기울임: 뒤로 기울이면 '참'으로 판단하고, 아니면 '거짓'으로 판단합니다.<br/>왼쪽으로 기울임: 왼쪽으로 기울이면 '참'으로 판단하고, 아니면 '거짓'으로 판단합니다.<br/>오른쪽으로 기울임: 오른쪽으로 기울이면 '참'으로 판단하고, 아니면 '거짓'으로 판단합니다.<br/>거꾸로 뒤집음: 거꾸로 뒤집으면 '참'으로 판단하고, 아니면 '거짓'으로 판단합니다.<br/>기울이지 않음: 기울이지 않으면 '참'으로 판단하고, 아니면 '거짓'으로 판단합니다.<br/>배터리 정상: 배터리 잔량이 충분하면 '참'으로 판단하고, 아니면 '거짓'으로 판단합니다.<br/>배터리 부족: 배터리 잔량이 부족하면 '참'으로 판단하고, 아니면 '거짓'으로 판단합니다.<br/>배터리 없음: 배터리 잔량이 없으면 '참'으로 판단하고, 아니면 '거짓'으로 판단합니다.",
            hamster_s_value:
                '왼쪽 근접 센서: 왼쪽 근접 센서의 값 (값의 범위: 0 ~ 255, 초기값: 0)<br/>오른쪽 근접 센서: 오른쪽 근접 센서의 값 (값의 범위: 0 ~ 255, 초기값: 0)<br/>왼쪽 바닥 센서: 왼쪽 바닥 센서의 값 (값의 범위: 0 ~ 100, 초기값: 0)<br/>오른쪽 바닥 센서: 오른쪽 바닥 센서의 값 (값의 범위: 0 ~ 100, 초기값: 0)<br/>x축 가속도: 가속도 센서의 X축 값 (값의 범위: -32768 ~ 32767, 초기값: 0) 로봇이 전진하는 방향이 X축의 양수 방향입니다.<br/>y축 가속도: 가속도 센서의 Y축 값 (값의 범위: -32768 ~ 32767, 초기값: 0) 로봇의 왼쪽 방향이 Y축의 양수 방향입니다.<br/>z축 가속도: 가속도 센서의 Z축 값 (값의 범위: -32768 ~ 32767, 초기값: 0) 로봇의 위쪽 방향이 Z축의 양수 방향입니다.<br/>밝기: 밝기 센서의 값 (값의 범위: 0 ~ 65535, 초기값: 0) 밝을 수록 값이 커집니다.<br/>온도: 로봇 내부의 온도 값 (값의 범위: 섭씨 -40 ~ 88도, 초기값: 0)<br/>신호 세기: 블루투스 무선 통신의 신호 세기 (값의 범위: -128 ~ 0 dBm, 초기값: 0) 신호의 세기가 셀수록 값이 커집니다.<br/>입력 A: 외부 확장 포트 A로 입력되는 신호의 값 (값의 범위: 아날로그 입력 0 ~ 255, 디지털 입력 0 또는 1, 초기값: 0)<br/>입력 B: 외부 확장 포트 B로 입력되는 신호의 값 (값의 범위: 아날로그 입력 0 ~ 255, 디지털 입력 0 또는 1, 초기값: 0)',
            hamster_s_move_forward_once: '말판 위에서 한 칸 앞으로 이동합니다.',
            hamster_s_turn_once: '말판 위에서 왼쪽/오른쪽 방향으로 제자리에서 90도 회전합니다.',
            hamster_s_move_forward_unit: '입력한 거리(cm)/시간(초)/펄스만큼 앞으로 이동합니다.',
            hamster_s_move_backward_unit: '입력한 거리(cm)/시간(초)/펄스만큼 뒤로 이동합니다.',
            hamster_s_turn_unit_in_place:
                '입력한 각도(도)/시간(초)/펄스만큼 왼쪽/오른쪽 방향으로 제자리에서 회전합니다.',
            hamster_s_pivot_around_unit_in_direction:
                '왼쪽/오른쪽 펜/바퀴 중심으로 입력한 각도(도)/시간(초)/펄스만큼 앞쪽/뒤쪽 방향으로 회전합니다.',
            hamster_s_turn_unit_with_radius_in_direction:
                '왼쪽/오른쪽 펜이 입력한 반지름의 원을 왼쪽/오른쪽에 그리면서 입력한 각도(도)/시간(초)/펄스만큼 앞쪽/뒤쪽 방향으로 회전합니다.',
            hamster_s_change_both_wheels_by:
                '왼쪽과 오른쪽 바퀴의 현재 속도 값(%)에 입력한 값을 각각 더합니다. 더한 결과가 양수 값이면 바퀴가 앞으로 회전하고, 음수 값이면 뒤로 회전합니다.',
            hamster_s_set_both_wheels_to:
                '왼쪽과 오른쪽 바퀴의 속도를 입력한 값(-100 ~ 100%)으로 각각 설정합니다. 양수 값을 입력하면 바퀴가 앞으로 회전하고, 음수 값을 입력하면 뒤로 회전합니다. 숫자 0을 입력하면 정지합니다.',
            hamster_s_change_wheel_by:
                '왼쪽/오른쪽/양쪽 바퀴의 현재 속도 값(%)에 입력한 값을 더합니다. 더한 결과가 양수 값이면 바퀴가 앞으로 회전하고, 음수 값이면 뒤로 회전합니다.',
            hamster_s_set_wheel_to:
                '왼쪽/오른쪽/양쪽 바퀴의 속도를 입력한 값(-100 ~ 100%)으로 설정합니다. 양수 값을 입력하면 바퀴가 앞으로 회전하고, 음수 값을 입력하면 뒤로 회전합니다. 숫자 0을 입력하면 정지합니다.',
            hamster_s_follow_line_using:
                '왼쪽/오른쪽/양쪽 바닥 센서를 사용하여 검은색/하얀색 선을 따라 이동합니다.',
            hamster_s_follow_line_until:
                '왼쪽/오른쪽/앞쪽/뒤쪽의 검은색/하얀색 선을 따라 이동하다가 교차로를 만나면 정지합니다.',
            hamster_s_set_following_speed_to:
                '선을 따라 이동하는 속도(1 ~ 8)를 설정합니다. 숫자가 클수록 이동하는 속도가 빠릅니다.',
            hamster_s_set_following_gain_to:
                '선을 따라 이동하는 방향 변화량(1 ~ 8)을 설정합니다. 숫자가 클수록 급커브를 잘 따라가지만 직선에서 좌우로 더 흔들립니다.',
            hamster_s_stop: '양쪽 바퀴를 정지합니다.',
            hamster_s_set_led_to: '왼쪽/오른쪽/양쪽 LED를 선택한 색깔로 켭니다.',
            hamster_s_pick_led: '왼쪽/오른쪽/양쪽 LED를 선택한 색깔로 켭니다.',
            hamster_s_change_led_by_rgb:
                '왼쪽/오른쪽/양쪽 LED의 현재 R, G, B 값에 입력한 값을 각각 더합니다.',
            hamster_s_set_led_to_rgb:
                '왼쪽/오른쪽/양쪽 LED의 R, G, B 값을 입력한 값으로 각각 설정합니다.',
            hamster_s_clear_led: '왼쪽/오른쪽/양쪽 LED를 끕니다.',
            hamster_s_play_sound_times: '선택한 소리를 입력한 횟수만큼 재생합니다.',
            hamster_s_play_sound_times_until_done:
                '선택한 소리를 입력한 횟수만큼 재생하고, 재생이 완료될 때까지 기다립니다.',
            hamster_s_change_buzzer_by:
                '버저 소리의 현재 음 높이(Hz)에 입력한 값을 더합니다. 소수점 둘째 자리까지 입력할 수 있습니다.',
            hamster_s_set_buzzer_to:
                '버저 소리의 음 높이를 입력한 값(Hz)으로 설정합니다. 소수점 둘째 자리까지 입력할 수 있습니다. 숫자 0을 입력하면 버저 소리를 끕니다.',
            hamster_s_clear_sound: '소리를 끕니다.',
            hamster_s_play_note: '선택한 계이름과 옥타브의 음을 소리 냅니다.',
            hamster_s_play_note_for: '선택한 계이름과 옥타브의 음을 입력한 박자만큼 소리 냅니다.',
            hamster_s_rest_for: '입력한 박자만큼 쉽니다.',
            hamster_s_change_tempo_by:
                '연주하거나 쉬는 속도의 현재 BPM(분당 박자 수)에 입력한 값을 더합니다.',
            hamster_s_set_tempo_to:
                '연주하거나 쉬는 속도를 입력한 BPM(분당 박자 수)으로 설정합니다.',
            hamster_s_set_port_to:
                '선택한 외부 확장 포트의 입출력 모드를 선택한 모드로 설정합니다.',
            hamster_s_change_output_by:
                '선택한 외부 확장 포트의 현재 출력 값에 입력한 값을 더합니다. 더한 결과는 외부 확장 포트의 모드에 따라 다음의 범위를 가집니다.<br/>서보 출력: 유효한 값의 범위는 1 ~ 180도, 0이면 PWM 펄스 없이 항상 0을 출력<br/>PWM 출력: 0 ~ 100%, PWM 파형에서 ON 상태의 듀티비(%)<br/>디지털 출력: 0이면 LOW, 0이 아니면 HIGH',
            hamster_s_set_output_to:
                '선택한 외부 확장 포트의 출력 값을 입력한 값으로 설정합니다. 입력하는 값은 외부 확장 포트의 모드에 따라 다음의 범위를 가집니다.<br/>서보 출력: 유효한 값의 범위는 1 ~ 180도, 0이면 PWM 펄스 없이 항상 0을 출력<br/>PWM 출력: 0 ~ 100%, PWM 파형에서 ON 상태의 듀티비(%)<br/>디지털 출력: 0이면 LOW, 0이 아니면 HIGH',
            hamster_s_gripper: '집게를 열거나 닫습니다.',
            hamster_s_release_gripper: '집게의 전원을 끄고 자유롭게 움직일 수 있도록 합니다.',
            hamster_s_write_serial: '시리얼 통신으로 글자를 전송합니다.',
            hamster_s_read_serial_until: '시리얼 통신으로 받은 글자를 읽습니다.',
            hamster_s_set_serial_rate_to: '시리얼 통신의 속도를 설정합니다.',
        },
        Blocks: {
            hamster_s_color_black: '검은색',
            hamster_s_color_blue: '파란색',
            hamster_s_color_green: '초록색',
            hamster_s_color_orange: '주황색',
            hamster_s_color_purple: '자주색',
            hamster_s_color_red: '빨간색',
            hamster_s_color_sky_blue: '하늘색',
            hamster_s_color_violet: '보라색',
            hamster_s_color_white: '하얀색',
            hamster_s_color_yellow: '노란색',
            hamster_s_left: '왼쪽',
            hamster_s_right: '오른쪽',
            hamster_s_both: '양쪽',
            hamster_s_note_c: '도',
            hamster_s_note_c_sharp: '도♯(레♭)',
            hamster_s_note_d: '레',
            hamster_s_note_d_sharp: '레♯(미♭)',
            hamster_s_note_e: '미',
            hamster_s_note_f: '파',
            hamster_s_note_f_sharp: '파♯(솔♭)',
            hamster_s_note_g: '솔',
            hamster_s_note_g_sharp: '솔♯(라♭)',
            hamster_s_note_a: '라',
            hamster_s_note_a_sharp: '라♯(시♭)',
            hamster_s_note_b: '시',
            hamster_s_port_a: 'A',
            hamster_s_port_b: 'B',
            hamster_s_port_ab: 'A와 B',
            hamster_s_tilt_forward: '앞으로 기울임',
            hamster_s_tilt_backward: '뒤로 기울임',
            hamster_s_tilt_left: '왼쪽으로 기울임',
            hamster_s_tilt_right: '오른쪽으로 기울임',
            hamster_s_tilt_flip: '거꾸로 뒤집음',
            hamster_s_tilt_not: '기울이지 않음',
            hamster_s_tap: '두드림',
            hamster_s_free_fall: '자유 낙하',
            hamster_s_battery_normal: '배터리 정상',
            hamster_s_battery_low: '배터리 부족',
            hamster_s_battery_empty: '배터리 없음',
            hamster_s_forward: '앞쪽',
            hamster_s_backward: '뒤쪽',
            hamster_s_front: '앞쪽',
            hamster_s_rear: '뒤쪽',
            hamster_s_left_pen: '왼쪽 펜',
            hamster_s_right_pen: '오른쪽 펜',
            hamster_s_left_wheel: '왼쪽 바퀴',
            hamster_s_right_wheel: '오른쪽 바퀴',
            hamster_s_robot: '로봇',
            hamster_s_gain_default: '기본 값',
            hamster_s_sensor_acceleration_x: 'x축 가속도',
            hamster_s_sensor_acceleration_y: 'y축 가속도',
            hamster_s_sensor_acceleration_z: 'z축 가속도',
            hamster_s_sensor_input_a: '입력 A',
            hamster_s_sensor_input_b: '입력 B',
            hamster_s_sensor_left_floor: '왼쪽 바닥 센서',
            hamster_s_sensor_left_proximity: '왼쪽 근접 센서',
            hamster_s_sensor_light: '밝기',
            hamster_s_sensor_right_floor: '오른쪽 바닥 센서',
            hamster_s_sensor_right_proximity: '오른쪽 근접 센서',
            hamster_s_sensor_signal_strength: '신호 세기',
            hamster_s_sensor_temperature: '온도',
            hamster_s_buzzer: '버저',
            hamster_s_left_led: '왼쪽 LED',
            hamster_s_left_wheel: '왼쪽 바퀴',
            hamster_s_note: '음표',
            hamster_s_output_a: '출력 A',
            hamster_s_output_b: '출력 B',
            hamster_s_right_led: '오른쪽 LED',
            hamster_s_right_wheel: '오른쪽 바퀴',
            hamster_s_sound_angry: '화남',
            hamster_s_sound_beep: '삐',
            hamster_s_sound_birthday: '생일',
            hamster_s_sound_chop: '쩝',
            hamster_s_sound_dibidibidip: '디비디비딥',
            hamster_s_sound_engine: '엔진',
            hamster_s_sound_good_job: '잘 했어요',
            hamster_s_sound_happy: '행복',
            hamster_s_sound_march: '행진',
            hamster_s_sound_noise: '지지직',
            hamster_s_sound_random_beep: '무작위 삐',
            hamster_s_sound_robot: '로봇',
            hamster_s_sound_sad: '슬픔',
            hamster_s_sound_siren: '사이렌',
            hamster_s_sound_sleep: '졸림',
            hamster_s_unit_cm: 'cm',
            hamster_s_unit_deg: '도',
            hamster_s_unit_pulse: '펄스',
            hamster_s_unit_sec: '초',
            hamster_s_analog_input: '아날로그 입력',
            hamster_s_digital_input: '디지털 입력',
            hamster_s_digital_input_pull_down: '디지털 입력 (풀다운)',
            hamster_s_digital_input_pull_up: '디지털 입력 (풀업)',
            hamster_s_digital_output: '디지털 출력',
            hamster_s_pwm_output: 'PWM 출력',
            hamster_s_servo_output: '서보 출력',
            hamster_s_voltage_input: '전압 입력',
            hamster_s_open_gripper: '열기',
            hamster_s_close_gripper: '닫기',
            hamster_s_serial_string: '글자',
            hamster_s_serial_string_line: '글자 한 줄',
            hamster_s_serial_all: '모두',
            hamster_s_serial_until_new_line: '줄 바꿈까지',
            hamster_s_serial_until_comma: ',(쉼표)까지',
            hamster_s_serial_until_colon: ':(쌍점)까지',
            hamster_s_serial_until_dollar: '$까지',
            hamster_s_serial_until_sharp: '#까지',
            hamster_s_serial_input: '시리얼 입력',
        },
    },
    en: {
        template: {
            hamster_s_hand_found: 'hand found?',
            hamster_s_boolean: '%1?',
            hamster_s_value: '%1',
            hamster_s_move_forward_once: 'move forward once on board %1',
            hamster_s_turn_once: 'turn %1 once on board %2',
            hamster_s_move_forward_unit: 'move forward %1 %2 %3',
            hamster_s_move_backward_unit: 'move backward %1 %2 %3',
            hamster_s_turn_unit_in_place: 'turn %1 %2 %3 in place %4',
            hamster_s_pivot_around_unit_in_direction: 'pivot around %1 %2 %3 in %4 direction %5',
            hamster_s_turn_unit_with_radius_in_direction:
                '%1 turn %2 %3 %4 with radius %5 cm in %6 direction %7',
            hamster_s_change_both_wheels_by: 'change wheels by left: %1 right: %2 %3',
            hamster_s_set_both_wheels_to: 'set wheels to left: %1 right: %2 %3',
            hamster_s_change_wheel_by: 'change %1 wheel by %2 %3',
            hamster_s_set_wheel_to: 'set %1 wheel to %2 %3',
            hamster_s_follow_line_using: 'follow %1 line using %2 floor sensor %3',
            hamster_s_follow_line_until: 'follow %1 line until %2 intersection %3',
            hamster_s_set_following_speed_to: 'set following speed to %1 %2',
            hamster_s_set_following_gain_to: 'set following directional variation to %1 %2',
            hamster_s_stop: 'stop %1',
            hamster_s_set_led_to: 'set %1 led to %2 %3',
            hamster_s_pick_led: 'set %1 led to %2 %3',
            hamster_s_change_led_by_rgb: 'change %1 led by r: %2 g: %3 b: %4 %5',
            hamster_s_set_led_to_rgb: 'set %1 led to r: %2 g: %3 b: %4 %5',
            hamster_s_clear_led: 'clear %1 led %2',
            hamster_s_play_sound_times: 'play sound %1 %2 times %3',
            hamster_s_play_sound_times_until_done: 'play sound %1 %2 times until done %3',
            hamster_s_change_buzzer_by: 'change buzzer by %1 %2',
            hamster_s_set_buzzer_to: 'set buzzer to %1 %2',
            hamster_s_clear_sound: 'clear sound %1',
            hamster_s_play_note: 'play note %1 %2 %3',
            hamster_s_play_note_for: 'play note %1 %2 for %3 beats %4',
            hamster_s_rest_for: 'rest for %1 beats %2',
            hamster_s_change_tempo_by: 'change tempo by %1 %2',
            hamster_s_set_tempo_to: 'set tempo to %1 bpm %2',
            hamster_s_set_port_to: 'set port %1 to %2 %3',
            hamster_s_change_output_by: 'change output %1 by %2 %3',
            hamster_s_set_output_to: 'set output %1 to %2 %3',
            hamster_s_gripper: '%1 gripper %2',
            hamster_s_release_gripper: 'release gripper %1',
            hamster_s_write_serial: 'write %1 %2 to serial %3',
            hamster_s_read_serial_until: 'read serial %1 %2',
            hamster_s_set_serial_rate_to: 'set serial rate to %1 Bd %2',
        },
        Helper: {
            hamster_s_hand_found:
                'If there is a hand or object in front of the proximity sensor, true, otherwise false',
            hamster_s_boolean:
                'tilt forward: If tilted forward, true, otherwise false<br/>tilt backward: If tilted backward, true, otherwise false<br/>tilt left: If tilted to the left, true, otherwise false<br/>tilt right: If tilted to the right, true, otherwise false<br/>tilt flip: If upside-down, true, otherwise false<br/>not tilt: If not tilted, true, otherwise false<br/>battery normal: If the battery is enough, true, otherwise false<br/>battery low: If the battery is low, true, otherwise false<br/>battery empty: If the battery is empty, true, otherwise false',
            hamster_s_value:
                'left proximity: value of left proximity sensor (range: 0 to 255, initial value: 0)<br/>right proximity: value of right proximity sensor (range: 0 to 255, initial value: 0)<br/>left floor: value of left floor sensor (range: 0 to 100, initial value: 0)<br/>right floor: value of right floor sensor (range: 0 to 100, initial value: 0)<br/>x acceleration: x-axis value of acceleration sensor (range: -32768 to 32767, initial value: 0) The direction in which the robot moves forward is the positive direction of the x axis.<br/>y acceleration: y-axis value of acceleration sensor (range: -32768 to 32767, initial value: 0) The left direction of the robot is the positive direction of the y axis.<br/>z acceleration: z-axis value of acceleration sensor (range: -32768 to 32767, initial value: 0) The upward direction of the robot is the positive direction of the z axis.<br/>light: value of light sensor (range: 0 to 65535, initial value: 0) The brighter, the larger the value.<br/>temperature: temperature value inside the robot (range: -40 to 88 degrees Celsius, initial value: 0)<br/>signal strength: signal strength of Bluetooth communication (range: -128 to 0 dBm, initial value: 0) As the signal strength increases, the value increases.<br/>input A: value of signal input to external port A (range: analog input 0 to 255, digital input 0 or 1, initial value: 0)<br/>input B: value of signal input to external port B (range: analog input 0 to 255, digital input 0 or 1, initial value: 0)',
            hamster_s_move_forward_once: 'Moves one space forward on the board.',
            hamster_s_turn_once: 'Turns left/right 90 degrees on the board.',
            hamster_s_move_forward_unit:
                'Moves forward for the number of cm/seconds/pulses entered.',
            hamster_s_move_backward_unit:
                'Moves backward for the number of cm/seconds/pulses entered.',
            hamster_s_turn_unit_in_place:
                'Turns left/right in place for the number of degrees/seconds/pulses entered.',
            hamster_s_pivot_around_unit_in_direction:
                'Pivots around the left/right pen/wheel in the forward/backward direction for the number of degrees/seconds/pulses entered.',
            hamster_s_turn_unit_with_radius_in_direction:
                'Turns left/right so that the left/right pen draws the circle of the entered radius in the forward/backward direction for the number of degrees/seconds/pulses entered.',
            hamster_s_change_both_wheels_by:
                'Adds the entered values to the current speed values (%) of the left and right wheels respectively. If the result is positive, the wheel rotates forward; if negative, the wheel rotates backward.',
            hamster_s_set_both_wheels_to:
                'Sets the speed of the left and right wheels to the entered values (-100 to 100%), respectively. If you enter a positive value, the wheel rotates forward. If you enter a negative value, the wheel rotates backward. Entering the number 0 stops it.',
            hamster_s_change_wheel_by:
                'Adds the entered value to the current speed value (%) of the left/right/both wheels. If the result is positive, the wheel rotates forward; if negative, the wheel rotates backward.',
            hamster_s_set_wheel_to:
                'Sets the speed of the left/right/both wheels to the entered value (-100 to 100%). If you enter a positive value, the wheel rotates forward. If you enter a negative value, the wheel rotates backward. Entering the number 0 stops it.',
            hamster_s_follow_line_using:
                'Moves along the black/white line by using the left/right/both floor sensors.',
            hamster_s_follow_line_until:
                'Moves along the black/white line on the left/right/front/back, then stops when the robot meets the intersection.',
            hamster_s_set_following_speed_to:
                'Sets the speed (1 to 8) to move along the line. The larger the number, the faster the movement.',
            hamster_s_set_following_gain_to:
                'Sets the directional variation (1 to 8) 선을 따라 이동하는 방향 변화량(1 ~ 8)을 설정합니다. 숫자가 클수록 급커브를 잘 따라가지만 직선에서 좌우로 더 흔들립니다.',
            hamster_s_stop: 'Stops both wheels.',
            hamster_s_set_led_to: 'Turns left/right/both LEDs to the selected color.',
            hamster_s_pick_led: 'Turns left/right/both LEDs to the selected color.',
            hamster_s_change_led_by_rgb:
                'Adds the entered values to the current R, G, B values of left/right/both LEDs, respectively.',
            hamster_s_set_led_to_rgb:
                'Sets the R, G, B values of left/right/both LEDs to the entered values.',
            hamster_s_clear_led: 'Turns off the left/right/both LEDs.',
            hamster_s_play_sound_times: 'Plays the selected sound as many times as entered.',
            hamster_s_play_sound_times_until_done:
                'Plays the selected sound as many times as entered, and waits for completion.',
            hamster_s_change_buzzer_by:
                'Adds the entered value to the current pitch (Hz) of the buzzer sound. You can enter up to two decimal places.',
            hamster_s_set_buzzer_to:
                'Sets the pitch of the buzzer sound to the entered value (Hz). You can enter up to two decimal places. Entering the number 0 turns off the buzzer sound.',
            hamster_s_clear_sound: 'Turns off sound.',
            hamster_s_play_note: 'It sounds the selected tone and octave.',
            hamster_s_play_note_for:
                'It sounds the selected tone and octave as much as the beat you entered.',
            hamster_s_rest_for: 'Rests as much as the beat you entered.',
            hamster_s_change_tempo_by:
                'Adds the entered value to the current BPM (beats per minute) of the playing or resting speed.',
            hamster_s_set_tempo_to:
                'Sets the playing or resting speed to the entered BPM (beats per minute).',
            hamster_s_set_port_to:
                'Sets the io mode of the selected external port to the selected mode.',
            hamster_s_change_output_by:
                'Adds the entered value to the current output value of the selected external port. The result will be in the following range depending on the mode of the external port.<br/>Servo output: valid range from 1 to 180 degrees; if 0, output 0 without PWM pulse<br/>PWM output: 0 to 100%, duty ratio (%) of ON state in PWM waveform<br/>Digital output: LOW when 0, otherwise HIGH',
            hamster_s_set_output_to:
                'Sets the output value of the selected external port to the entered value. The value has the following range according to the mode of external port.<br/>Servo output: valid range from 1 to 180 degrees; if 0, output 0 without PWM pulse<br/>PWM output: 0 to 100%, duty ratio (%) of ON state in PWM waveform<br/>Digital output: LOW when 0, otherwise HIGH',
            hamster_s_gripper: 'Opens or closes the gripper.',
            hamster_s_release_gripper: 'Turns off the gripper so that it can be moved freely.',
            hamster_s_write_serial: 'Sends strings via serial communication.',
            hamster_s_read_serial_until: 'Read the strings received by serial communication.',
            hamster_s_set_serial_rate_to: 'Sets the speed of serial communication.',
        },
        Blocks: {
            hamster_s_color_black: 'black',
            hamster_s_color_blue: 'blue',
            hamster_s_color_green: 'green',
            hamster_s_color_orange: 'orange',
            hamster_s_color_purple: 'purple',
            hamster_s_color_red: 'red',
            hamster_s_color_sky_blue: 'sky blue',
            hamster_s_color_violet: 'violet',
            hamster_s_color_white: 'white',
            hamster_s_color_yellow: 'yellow',
            hamster_s_left: 'left',
            hamster_s_right: 'right',
            hamster_s_both: 'both',
            hamster_s_note_c: 'C',
            hamster_s_note_c_sharp: 'C♯(D♭)',
            hamster_s_note_d: 'D',
            hamster_s_note_d_sharp: 'D♯(E♭)',
            hamster_s_note_e: 'E',
            hamster_s_note_f: 'F',
            hamster_s_note_f_sharp: 'F♯(G♭)',
            hamster_s_note_g: 'G',
            hamster_s_note_g_sharp: 'G♯(A♭)',
            hamster_s_note_a: 'A',
            hamster_s_note_a_sharp: 'A♯(B♭)',
            hamster_s_note_b: 'B',
            hamster_s_port_a: 'A',
            hamster_s_port_b: 'B',
            hamster_s_port_ab: 'A and B',
            hamster_s_tilt_forward: 'tilt forward',
            hamster_s_tilt_backward: 'tilt backward',
            hamster_s_tilt_left: 'tilt left',
            hamster_s_tilt_right: 'tilt right',
            hamster_s_tilt_flip: 'tilt flip',
            hamster_s_tilt_not: 'not tilt',
            hamster_s_tap: 'tap',
            hamster_s_free_fall: 'free fall',
            hamster_s_battery_normal: 'battery normal',
            hamster_s_battery_low: 'battery low',
            hamster_s_battery_empty: 'battery empty',
            hamster_s_forward: 'forward',
            hamster_s_backward: 'backward',
            hamster_s_front: 'front',
            hamster_s_rear: 'rear',
            hamster_s_left_pen: 'left pen',
            hamster_s_right_pen: 'right pen',
            hamster_s_left_wheel: 'left wheel',
            hamster_s_right_wheel: 'right wheel',
            hamster_s_robot: 'robot',
            hamster_s_gain_default: 'default',
            hamster_s_sensor_acceleration_x: 'x acceleration',
            hamster_s_sensor_acceleration_y: 'y acceleration',
            hamster_s_sensor_acceleration_z: 'z acceleration',
            hamster_s_sensor_input_a: 'input A',
            hamster_s_sensor_input_b: 'input B',
            hamster_s_sensor_left_floor: 'left floor',
            hamster_s_sensor_left_proximity: 'left proximity',
            hamster_s_sensor_light: 'light',
            hamster_s_sensor_right_floor: 'right floor',
            hamster_s_sensor_right_proximity: 'right proximity',
            hamster_s_sensor_signal_strength: 'signal strength',
            hamster_s_sensor_temperature: 'temperature',
            hamster_s_buzzer: 'buzzer',
            hamster_s_left_led: 'left LED',
            hamster_s_left_wheel: 'left wheel',
            hamster_s_note: 'note',
            hamster_s_output_a: 'output A',
            hamster_s_output_b: 'output B',
            hamster_s_right_led: 'right LED',
            hamster_s_right_wheel: 'right wheel',
            hamster_s_sound_angry: 'angry',
            hamster_s_sound_beep: 'beep',
            hamster_s_sound_birthday: 'birthday',
            hamster_s_sound_chop: 'chop',
            hamster_s_sound_dibidibidip: 'dibidibidip',
            hamster_s_sound_engine: 'engine',
            hamster_s_sound_good_job: 'good job',
            hamster_s_sound_happy: 'happy',
            hamster_s_sound_march: 'march',
            hamster_s_sound_noise: 'noise',
            hamster_s_sound_random_beep: 'random beep',
            hamster_s_sound_robot: 'robot',
            hamster_s_sound_sad: 'sad',
            hamster_s_sound_siren: 'siren',
            hamster_s_sound_sleep: 'sleep',
            hamster_s_unit_cm: 'cm',
            hamster_s_unit_deg: 'degrees',
            hamster_s_unit_pulse: 'pulses',
            hamster_s_unit_sec: 'seconds',
            hamster_s_analog_input: 'analog input',
            hamster_s_digital_input: 'digital input',
            hamster_s_digital_input_pull_down: 'digital input (pull down)',
            hamster_s_digital_input_pull_up: 'digital input (pull up)',
            hamster_s_digital_output: 'digital output',
            hamster_s_pwm_output: 'pwm output',
            hamster_s_servo_output: 'servo output',
            hamster_s_voltage_input: 'voltage input',
            hamster_s_open_gripper: 'open',
            hamster_s_close_gripper: 'close',
            hamster_s_serial_string: 'string',
            hamster_s_serial_string_line: 'string line',
            hamster_s_serial_all: 'all',
            hamster_s_serial_until_new_line: 'until new line',
            hamster_s_serial_until_comma: 'until ,(comma)',
            hamster_s_serial_until_colon: 'until :(colon)',
            hamster_s_serial_until_dollar: 'until $',
            hamster_s_serial_until_sharp: 'until #',
            hamster_s_serial_input: 'serial input',
        },
    },
    jp: {
        template: {
            hamster_s_hand_found: '手を見つけたか?',
            hamster_s_boolean: '%1?',
            hamster_s_value: '%1',
            hamster_s_move_forward_once: 'ボード板上で前へ動かす %1',
            hamster_s_turn_once: 'ボード板上で%1に回す %2',
            hamster_s_move_forward_unit: '前へ%1%2動かす %3',
            hamster_s_move_backward_unit: '後ろへ%1%2動かす %3',
            hamster_s_turn_unit_in_place: '所定位置で%1に%2%3回す %4',
            hamster_s_pivot_around_unit_in_direction: '%1を中心に%2%3%4方向に回す %5',
            hamster_s_turn_unit_with_radius_in_direction: '%1%2に%3%4半径%5cmを%6方向に回す %7',
            hamster_s_change_both_wheels_by: '左車輪を%1右車輪を%2ずつ変える %3',
            hamster_s_set_both_wheels_to: '左車輪を%1右車輪を%2にする %3',
            hamster_s_change_wheel_by: '%1車輪を%2ずつ変える %3',
            hamster_s_set_wheel_to: '%1車輪を%2にする %3',
            hamster_s_follow_line_using: '%1線を%2フロアセンサーで追従する %3',
            hamster_s_follow_line_until: '%1線を追従して%2交差点まで動かす %3',
            hamster_s_set_following_speed_to: '線を追従する速度を%1にする %2',
            hamster_s_set_following_gain_to: '線を追従する方向変化量を%1にする %2',
            hamster_s_stop: '停止する %1',
            hamster_s_set_led_to: '%1LEDを%2にする %3',
            hamster_s_pick_led: '%1LEDを%2にする %3',
            hamster_s_change_led_by_rgb: '%1LEDをR:%2G:%3B:%4ずつ変える %5',
            hamster_s_set_led_to_rgb: '%1LEDをR:%2G:%3B:%4にする %5',
            hamster_s_clear_led: '%1LEDをオフ %2',
            hamster_s_play_sound_times: '%1音を%2回鳴らす %3',
            hamster_s_play_sound_times_until_done: '終わるまで%1音を%2回鳴らす %3',
            hamster_s_change_buzzer_by: 'ブザー音を%1ずつ変える %2',
            hamster_s_set_buzzer_to: 'ブザー音を%1にする %2',
            hamster_s_clear_sound: '音を止める %1',
            hamster_s_play_note: '%1%2音を鳴らす %3',
            hamster_s_play_note_for: '%1%2音を%3拍鳴らす %4',
            hamster_s_rest_for: '%1拍休む %2',
            hamster_s_change_tempo_by: 'テンポを%1ずつ変える %2',
            hamster_s_set_tempo_to: 'テンポを%1BPMにする %2',
            hamster_s_set_port_to: 'ポート%1を%2にする %3',
            hamster_s_change_output_by: '出力%1を%2ずつ変える %3',
            hamster_s_set_output_to: '出力%1を%2にする %3',
            hamster_s_gripper: 'グリッパを%1 %2',
            hamster_s_release_gripper: 'グリッパをオフ %1',
            hamster_s_write_serial: 'シリアルに%1%2を書き出す %3',
            hamster_s_read_serial_until: 'シリアルを%1読み取る %2',
            hamster_s_set_serial_rate_to: 'シリアル速度を%1Bdにする %2',
        },
        Helper: {
            hamster_s_hand_found:
                'If there is a hand or object in front of the proximity sensor, true, otherwise false',
            hamster_s_boolean:
                'tilt forward: If tilted forward, true, otherwise false<br/>tilt backward: If tilted backward, true, otherwise false<br/>tilt left: If tilted to the left, true, otherwise false<br/>tilt right: If tilted to the right, true, otherwise false<br/>tilt flip: If upside-down, true, otherwise false<br/>not tilt: If not tilted, true, otherwise false<br/>battery normal: If the battery is enough, true, otherwise false<br/>battery low: If the battery is low, true, otherwise false<br/>battery empty: If the battery is empty, true, otherwise false',
            hamster_s_value:
                'left proximity: value of left proximity sensor (range: 0 to 255, initial value: 0)<br/>right proximity: value of right proximity sensor (range: 0 to 255, initial value: 0)<br/>left floor: value of left floor sensor (range: 0 to 100, initial value: 0)<br/>right floor: value of right floor sensor (range: 0 to 100, initial value: 0)<br/>x acceleration: x-axis value of acceleration sensor (range: -32768 to 32767, initial value: 0) The direction in which the robot moves forward is the positive direction of the x axis.<br/>y acceleration: y-axis value of acceleration sensor (range: -32768 to 32767, initial value: 0) The left direction of the robot is the positive direction of the y axis.<br/>z acceleration: z-axis value of acceleration sensor (range: -32768 to 32767, initial value: 0) The upward direction of the robot is the positive direction of the z axis.<br/>light: value of light sensor (range: 0 to 65535, initial value: 0) The brighter, the larger the value.<br/>temperature: temperature value inside the robot (range: -40 to 88 degrees Celsius, initial value: 0)<br/>signal strength: signal strength of Bluetooth communication (range: -128 to 0 dBm, initial value: 0) As the signal strength increases, the value increases.<br/>input A: value of signal input to external port A (range: analog input 0 to 255, digital input 0 or 1, initial value: 0)<br/>input B: value of signal input to external port B (range: analog input 0 to 255, digital input 0 or 1, initial value: 0)',
            hamster_s_move_forward_once: 'Moves one space forward on the board.',
            hamster_s_turn_once: 'Turns left/right 90 degrees on the board.',
            hamster_s_move_forward_unit:
                'Moves forward for the number of cm/seconds/pulses entered.',
            hamster_s_move_backward_unit:
                'Moves backward for the number of cm/seconds/pulses entered.',
            hamster_s_turn_unit_in_place:
                'Turns left/right in place for the number of degrees/seconds/pulses entered.',
            hamster_s_pivot_around_unit_in_direction:
                'Pivots around the left/right pen/wheel in the forward/backward direction for the number of degrees/seconds/pulses entered.',
            hamster_s_turn_unit_with_radius_in_direction:
                'Turns left/right so that the left/right pen draws the circle of the entered radius in the forward/backward direction for the number of degrees/seconds/pulses entered.',
            hamster_s_change_both_wheels_by:
                'Adds the entered values to the current speed values (%) of the left and right wheels respectively. If the result is positive, the wheel rotates forward; if negative, the wheel rotates backward.',
            hamster_s_set_both_wheels_to:
                'Sets the speed of the left and right wheels to the entered values (-100 to 100%), respectively. If you enter a positive value, the wheel rotates forward. If you enter a negative value, the wheel rotates backward. Entering the number 0 stops it.',
            hamster_s_change_wheel_by:
                'Adds the entered value to the current speed value (%) of the left/right/both wheels. If the result is positive, the wheel rotates forward; if negative, the wheel rotates backward.',
            hamster_s_set_wheel_to:
                'Sets the speed of the left/right/both wheels to the entered value (-100 to 100%). If you enter a positive value, the wheel rotates forward. If you enter a negative value, the wheel rotates backward. Entering the number 0 stops it.',
            hamster_s_follow_line_using:
                'Moves along the black/white line by using the left/right/both floor sensors.',
            hamster_s_follow_line_until:
                'Moves along the black/white line on the left/right/front/back, then stops when the robot meets the intersection.',
            hamster_s_set_following_speed_to:
                'Sets the speed (1 to 8) to move along the line. The larger the number, the faster the movement.',
            hamster_s_set_following_gain_to:
                'Sets the directional variation (1 to 8) 선을 따라 이동하는 방향 변화량(1 ~ 8)을 설정합니다. 숫자가 클수록 급커브를 잘 따라가지만 직선에서 좌우로 더 흔들립니다.',
            hamster_s_stop: 'Stops both wheels.',
            hamster_s_set_led_to: 'Turns left/right/both LEDs to the selected color.',
            hamster_s_pick_led: 'Turns left/right/both LEDs to the selected color.',
            hamster_s_change_led_by_rgb:
                'Adds the entered values to the current R, G, B values of left/right/both LEDs, respectively.',
            hamster_s_set_led_to_rgb:
                'Sets the R, G, B values of left/right/both LEDs to the entered values.',
            hamster_s_clear_led: 'Turns off the left/right/both LEDs.',
            hamster_s_play_sound_times: 'Plays the selected sound as many times as entered.',
            hamster_s_play_sound_times_until_done:
                'Plays the selected sound as many times as entered, and waits for completion.',
            hamster_s_change_buzzer_by:
                'Adds the entered value to the current pitch (Hz) of the buzzer sound. You can enter up to two decimal places.',
            hamster_s_set_buzzer_to:
                'Sets the pitch of the buzzer sound to the entered value (Hz). You can enter up to two decimal places. Entering the number 0 turns off the buzzer sound.',
            hamster_s_clear_sound: 'Turns off sound.',
            hamster_s_play_note: 'It sounds the selected tone and octave.',
            hamster_s_play_note_for:
                'It sounds the selected tone and octave as much as the beat you entered.',
            hamster_s_rest_for: 'Rests as much as the beat you entered.',
            hamster_s_change_tempo_by:
                'Adds the entered value to the current BPM (beats per minute) of the playing or resting speed.',
            hamster_s_set_tempo_to:
                'Sets the playing or resting speed to the entered BPM (beats per minute).',
            hamster_s_set_port_to:
                'Sets the io mode of the selected external port to the selected mode.',
            hamster_s_change_output_by:
                'Adds the entered value to the current output value of the selected external port. The result will be in the following range depending on the mode of the external port.<br/>Servo output: valid range from 1 to 180 degrees; if 0, output 0 without PWM pulse<br/>PWM output: 0 to 100%, duty ratio (%) of ON state in PWM waveform<br/>Digital output: LOW when 0, otherwise HIGH',
            hamster_s_set_output_to:
                'Sets the output value of the selected external port to the entered value. The value has the following range according to the mode of external port.<br/>Servo output: valid range from 1 to 180 degrees; if 0, output 0 without PWM pulse<br/>PWM output: 0 to 100%, duty ratio (%) of ON state in PWM waveform<br/>Digital output: LOW when 0, otherwise HIGH',
            hamster_s_gripper: 'Opens or closes the gripper.',
            hamster_s_release_gripper: 'Turns off the gripper so that it can be moved freely.',
            hamster_s_write_serial: 'Sends strings via serial communication.',
            hamster_s_read_serial_until: 'Read the strings received by serial communication.',
            hamster_s_set_serial_rate_to: 'Sets the speed of serial communication.',
        },
        Blocks: {
            hamster_s_color_black: '黒',
            hamster_s_color_blue: '青',
            hamster_s_color_green: '緑',
            hamster_s_color_orange: 'オレンジ',
            hamster_s_color_purple: '紫',
            hamster_s_color_red: '赤',
            hamster_s_color_sky_blue: '水色',
            hamster_s_color_violet: '赤紫',
            hamster_s_color_white: '白',
            hamster_s_color_yellow: '黄色',
            hamster_s_left: '左',
            hamster_s_right: '右',
            hamster_s_both: '両方',
            hamster_s_note_c: 'ド',
            hamster_s_note_c_sharp: 'ド♯(レ♭)',
            hamster_s_note_d: 'レ',
            hamster_s_note_d_sharp: 'レ♯(ミ♭)',
            hamster_s_note_e: 'ミ',
            hamster_s_note_f: 'ファ',
            hamster_s_note_f_sharp: 'ファ♯(ソ♭)',
            hamster_s_note_g: 'ソ',
            hamster_s_note_g_sharp: 'ソ♯(ラ♭)',
            hamster_s_note_a: 'ラ',
            hamster_s_note_a_sharp: 'ラ♯(シ♭)',
            hamster_s_note_b: 'シ',
            hamster_s_port_a: 'A',
            hamster_s_port_b: 'B',
            hamster_s_port_ab: 'AとB',
            hamster_s_tilt_forward: '前に傾けたか',
            hamster_s_tilt_backward: '後に傾けたか',
            hamster_s_tilt_left: '左に傾けたか',
            hamster_s_tilt_right: '右に傾けたか',
            hamster_s_tilt_flip: '上下裏返したか',
            hamster_s_tilt_not: '傾けなかったか',
            hamster_s_tap: '叩いたか',
            hamster_s_free_fall: '自由落下したか',
            hamster_s_battery_normal: '電池が正常か',
            hamster_s_battery_low: '電池が足りないか',
            hamster_s_battery_empty: '電池がないか',
            hamster_s_forward: '前',
            hamster_s_backward: '後',
            hamster_s_front: '前',
            hamster_s_rear: '後',
            hamster_s_left_pen: '左ペン',
            hamster_s_right_pen: '右ペン',
            hamster_s_left_wheel: '左車輪',
            hamster_s_right_wheel: '右車輪',
            hamster_s_robot: 'ロボット',
            hamster_s_gain_default: '基本値',
            hamster_s_sensor_acceleration_x: '前後の速さ',
            hamster_s_sensor_acceleration_y: '左右の速さ',
            hamster_s_sensor_acceleration_z: '上下の速さ',
            hamster_s_sensor_input_a: '入力A',
            hamster_s_sensor_input_b: '入力B',
            hamster_s_sensor_left_floor: '左床センサー',
            hamster_s_sensor_left_proximity: '左近接センサー',
            hamster_s_sensor_light: '照度',
            hamster_s_sensor_right_floor: '右床センサー',
            hamster_s_sensor_right_proximity: '右近接センサー',
            hamster_s_sensor_signal_strength: '信号強度',
            hamster_s_sensor_temperature: '温度',
            hamster_s_buzzer: 'ブーザー',
            hamster_s_left_led: '左LED',
            hamster_s_left_wheel: '左車輪',
            hamster_s_note: '音符',
            hamster_s_output_a: '出力A',
            hamster_s_output_b: '出力B',
            hamster_s_right_led: '右LED',
            hamster_s_right_wheel: '右車輪',
            hamster_s_sound_angry: '怒った',
            hamster_s_sound_beep: 'ビープ音',
            hamster_s_sound_birthday: '誕生日',
            hamster_s_sound_chop: 'チョップ',
            hamster_s_sound_dibidibidip: 'ディビディビディップ',
            hamster_s_sound_engine: 'エンジン',
            hamster_s_sound_good_job: 'よくできました',
            hamster_s_sound_happy: '幸福',
            hamster_s_sound_march: '行進',
            hamster_s_sound_noise: 'ノイズ',
            hamster_s_sound_random_beep: 'ビープ音のどれか',
            hamster_s_sound_robot: 'ロボット',
            hamster_s_sound_sad: '悲しみ',
            hamster_s_sound_siren: 'サイレン',
            hamster_s_sound_sleep: '睡眠',
            hamster_s_unit_cm: 'cm',
            hamster_s_unit_deg: '°',
            hamster_s_unit_pulse: 'パルス',
            hamster_s_unit_sec: '秒',
            hamster_s_analog_input: 'アナログ入力',
            hamster_s_digital_input: 'デジタル入力',
            hamster_s_digital_input_pull_down: 'デジタル入力 (プルダウン)',
            hamster_s_digital_input_pull_up: 'デジタル入力 (プルアップ)',
            hamster_s_digital_output: 'デジタル出力',
            hamster_s_pwm_output: 'PWM出力',
            hamster_s_servo_output: 'サーボ出力',
            hamster_s_voltage_input: '電圧入力',
            hamster_s_open_gripper: '開く',
            hamster_s_close_gripper: '閉める',
            hamster_s_serial_string: '文字列',
            hamster_s_serial_string_line: '文字列1行',
            hamster_s_serial_all: '全部',
            hamster_s_serial_until_new_line: '改行まで',
            hamster_s_serial_until_comma: '、(読点)まで',
            hamster_s_serial_until_colon: '：(コロン)まで',
            hamster_s_serial_until_dollar: '$まで',
            hamster_s_serial_until_sharp: '#まで',
            hamster_s_serial_input: 'シリアル入力',
        },
    },
    vn: {
        template: {
            hamster_s_hand_found: 'hand found?',
            hamster_s_boolean: '%1?',
            hamster_s_value: '%1',
            hamster_s_move_forward_once: 'move forward once on board %1',
            hamster_s_turn_once: 'turn %1 once on board %2',
            hamster_s_move_forward_unit: 'move forward %1 %2 %3',
            hamster_s_move_backward_unit: 'move backward %1 %2 %3',
            hamster_s_turn_unit_in_place: 'turn %1 %2 %3 in place %4',
            hamster_s_pivot_around_unit_in_direction: 'pivot around %1 %2 %3 in %4 direction %5',
            hamster_s_turn_unit_with_radius_in_direction:
                '%1 turn %2 %3 %4 with radius %5 cm in %6 direction %7',
            hamster_s_change_both_wheels_by: 'change wheels by left: %1 right: %2 %3',
            hamster_s_set_both_wheels_to: 'set wheels to left: %1 right: %2 %3',
            hamster_s_change_wheel_by: 'change %1 wheel by %2 %3',
            hamster_s_set_wheel_to: 'set %1 wheel to %2 %3',
            hamster_s_follow_line_using: 'follow %1 line using %2 floor sensor %3',
            hamster_s_follow_line_until: 'follow %1 line until %2 intersection %3',
            hamster_s_set_following_speed_to: 'set following speed to %1 %2',
            hamster_s_set_following_gain_to: 'set following directional variation to %1 %2',
            hamster_s_stop: 'stop %1',
            hamster_s_set_led_to: 'set %1 led to %2 %3',
            hamster_s_pick_led: 'set %1 led to %2 %3',
            hamster_s_change_led_by_rgb: 'change %1 led by r: %2 g: %3 b: %4 %5',
            hamster_s_set_led_to_rgb: 'set %1 led to r: %2 g: %3 b: %4 %5',
            hamster_s_clear_led: 'clear %1 led %2',
            hamster_s_play_sound_times: 'play sound %1 %2 times %3',
            hamster_s_play_sound_times_until_done: 'play sound %1 %2 times until done %3',
            hamster_s_change_buzzer_by: 'change buzzer by %1 %2',
            hamster_s_set_buzzer_to: 'set buzzer to %1 %2',
            hamster_s_clear_sound: 'clear sound %1',
            hamster_s_play_note: 'play note %1 %2 %3',
            hamster_s_play_note_for: 'play note %1 %2 for %3 beats %4',
            hamster_s_rest_for: 'rest for %1 beats %2',
            hamster_s_change_tempo_by: 'change tempo by %1 %2',
            hamster_s_set_tempo_to: 'set tempo to %1 bpm %2',
            hamster_s_set_port_to: 'set port %1 to %2 %3',
            hamster_s_change_output_by: 'change output %1 by %2 %3',
            hamster_s_set_output_to: 'set output %1 to %2 %3',
            hamster_s_gripper: '%1 gripper %2',
            hamster_s_release_gripper: 'release gripper %1',
            hamster_s_write_serial: 'write %1 %2 to serial %3',
            hamster_s_read_serial_until: 'read serial %1 %2',
            hamster_s_set_serial_rate_to: 'set serial rate to %1 Bd %2',
        },
        Helper: {
            hamster_s_hand_found:
                'If there is a hand or object in front of the proximity sensor, true, otherwise false',
            hamster_s_boolean:
                'tilt forward: If tilted forward, true, otherwise false<br/>tilt backward: If tilted backward, true, otherwise false<br/>tilt left: If tilted to the left, true, otherwise false<br/>tilt right: If tilted to the right, true, otherwise false<br/>tilt flip: If upside-down, true, otherwise false<br/>not tilt: If not tilted, true, otherwise false<br/>battery normal: If the battery is enough, true, otherwise false<br/>battery low: If the battery is low, true, otherwise false<br/>battery empty: If the battery is empty, true, otherwise false',
            hamster_s_value:
                'left proximity: value of left proximity sensor (range: 0 to 255, initial value: 0)<br/>right proximity: value of right proximity sensor (range: 0 to 255, initial value: 0)<br/>left floor: value of left floor sensor (range: 0 to 100, initial value: 0)<br/>right floor: value of right floor sensor (range: 0 to 100, initial value: 0)<br/>x acceleration: x-axis value of acceleration sensor (range: -32768 to 32767, initial value: 0) The direction in which the robot moves forward is the positive direction of the x axis.<br/>y acceleration: y-axis value of acceleration sensor (range: -32768 to 32767, initial value: 0) The left direction of the robot is the positive direction of the y axis.<br/>z acceleration: z-axis value of acceleration sensor (range: -32768 to 32767, initial value: 0) The upward direction of the robot is the positive direction of the z axis.<br/>light: value of light sensor (range: 0 to 65535, initial value: 0) The brighter, the larger the value.<br/>temperature: temperature value inside the robot (range: -40 to 88 degrees Celsius, initial value: 0)<br/>signal strength: signal strength of Bluetooth communication (range: -128 to 0 dBm, initial value: 0) As the signal strength increases, the value increases.<br/>input A: value of signal input to external port A (range: analog input 0 to 255, digital input 0 or 1, initial value: 0)<br/>input B: value of signal input to external port B (range: analog input 0 to 255, digital input 0 or 1, initial value: 0)',
            hamster_s_move_forward_once: 'Moves one space forward on the board.',
            hamster_s_turn_once: 'Turns left/right 90 degrees on the board.',
            hamster_s_move_forward_unit:
                'Moves forward for the number of cm/seconds/pulses entered.',
            hamster_s_move_backward_unit:
                'Moves backward for the number of cm/seconds/pulses entered.',
            hamster_s_turn_unit_in_place:
                'Turns left/right in place for the number of degrees/seconds/pulses entered.',
            hamster_s_pivot_around_unit_in_direction:
                'Pivots around the left/right pen/wheel in the forward/backward direction for the number of degrees/seconds/pulses entered.',
            hamster_s_turn_unit_with_radius_in_direction:
                'Turns left/right so that the left/right pen draws the circle of the entered radius in the forward/backward direction for the number of degrees/seconds/pulses entered.',
            hamster_s_change_both_wheels_by:
                'Adds the entered values to the current speed values (%) of the left and right wheels respectively. If the result is positive, the wheel rotates forward; if negative, the wheel rotates backward.',
            hamster_s_set_both_wheels_to:
                'Sets the speed of the left and right wheels to the entered values (-100 to 100%), respectively. If you enter a positive value, the wheel rotates forward. If you enter a negative value, the wheel rotates backward. Entering the number 0 stops it.',
            hamster_s_change_wheel_by:
                'Adds the entered value to the current speed value (%) of the left/right/both wheels. If the result is positive, the wheel rotates forward; if negative, the wheel rotates backward.',
            hamster_s_set_wheel_to:
                'Sets the speed of the left/right/both wheels to the entered value (-100 to 100%). If you enter a positive value, the wheel rotates forward. If you enter a negative value, the wheel rotates backward. Entering the number 0 stops it.',
            hamster_s_follow_line_using:
                'Moves along the black/white line by using the left/right/both floor sensors.',
            hamster_s_follow_line_until:
                'Moves along the black/white line on the left/right/front/back, then stops when the robot meets the intersection.',
            hamster_s_set_following_speed_to:
                'Sets the speed (1 to 8) to move along the line. The larger the number, the faster the movement.',
            hamster_s_set_following_gain_to:
                'Sets the directional variation (1 to 8) 선을 따라 이동하는 방향 변화량(1 ~ 8)을 설정합니다. 숫자가 클수록 급커브를 잘 따라가지만 직선에서 좌우로 더 흔들립니다.',
            hamster_s_stop: 'Stops both wheels.',
            hamster_s_set_led_to: 'Turns left/right/both LEDs to the selected color.',
            hamster_s_pick_led: 'Turns left/right/both LEDs to the selected color.',
            hamster_s_change_led_by_rgb:
                'Adds the entered values to the current R, G, B values of left/right/both LEDs, respectively.',
            hamster_s_set_led_to_rgb:
                'Sets the R, G, B values of left/right/both LEDs to the entered values.',
            hamster_s_clear_led: 'Turns off the left/right/both LEDs.',
            hamster_s_play_sound_times: 'Plays the selected sound as many times as entered.',
            hamster_s_play_sound_times_until_done:
                'Plays the selected sound as many times as entered, and waits for completion.',
            hamster_s_change_buzzer_by:
                'Adds the entered value to the current pitch (Hz) of the buzzer sound. You can enter up to two decimal places.',
            hamster_s_set_buzzer_to:
                'Sets the pitch of the buzzer sound to the entered value (Hz). You can enter up to two decimal places. Entering the number 0 turns off the buzzer sound.',
            hamster_s_clear_sound: 'Turns off sound.',
            hamster_s_play_note: 'It sounds the selected tone and octave.',
            hamster_s_play_note_for:
                'It sounds the selected tone and octave as much as the beat you entered.',
            hamster_s_rest_for: 'Rests as much as the beat you entered.',
            hamster_s_change_tempo_by:
                'Adds the entered value to the current BPM (beats per minute) of the playing or resting speed.',
            hamster_s_set_tempo_to:
                'Sets the playing or resting speed to the entered BPM (beats per minute).',
            hamster_s_set_port_to:
                'Sets the io mode of the selected external port to the selected mode.',
            hamster_s_change_output_by:
                'Adds the entered value to the current output value of the selected external port. The result will be in the following range depending on the mode of the external port.<br/>Servo output: valid range from 1 to 180 degrees; if 0, output 0 without PWM pulse<br/>PWM output: 0 to 100%, duty ratio (%) of ON state in PWM waveform<br/>Digital output: LOW when 0, otherwise HIGH',
            hamster_s_set_output_to:
                'Sets the output value of the selected external port to the entered value. The value has the following range according to the mode of external port.<br/>Servo output: valid range from 1 to 180 degrees; if 0, output 0 without PWM pulse<br/>PWM output: 0 to 100%, duty ratio (%) of ON state in PWM waveform<br/>Digital output: LOW when 0, otherwise HIGH',
            hamster_s_gripper: 'Opens or closes the gripper.',
            hamster_s_release_gripper: 'Turns off the gripper so that it can be moved freely.',
            hamster_s_write_serial: 'Sends strings via serial communication.',
            hamster_s_read_serial_until: 'Read the strings received by serial communication.',
            hamster_s_set_serial_rate_to: 'Sets the speed of serial communication.',
        },
        Blocks: {
            hamster_s_color_black: 'black',
            hamster_s_color_blue: 'blue',
            hamster_s_color_green: 'green',
            hamster_s_color_orange: 'orange',
            hamster_s_color_purple: 'purple',
            hamster_s_color_red: 'red',
            hamster_s_color_sky_blue: 'sky blue',
            hamster_s_color_violet: 'violet',
            hamster_s_color_white: 'white',
            hamster_s_color_yellow: 'yellow',
            hamster_s_left: 'left',
            hamster_s_right: 'right',
            hamster_s_both: 'both',
            hamster_s_note_c: 'C',
            hamster_s_note_c_sharp: 'C♯(D♭)',
            hamster_s_note_d: 'D',
            hamster_s_note_d_sharp: 'D♯(E♭)',
            hamster_s_note_e: 'E',
            hamster_s_note_f: 'F',
            hamster_s_note_f_sharp: 'F♯(G♭)',
            hamster_s_note_g: 'G',
            hamster_s_note_g_sharp: 'G♯(A♭)',
            hamster_s_note_a: 'A',
            hamster_s_note_a_sharp: 'A♯(B♭)',
            hamster_s_note_b: 'B',
            hamster_s_port_a: 'A',
            hamster_s_port_b: 'B',
            hamster_s_port_ab: 'A and B',
            hamster_s_tilt_forward: 'tilt forward',
            hamster_s_tilt_backward: 'tilt backward',
            hamster_s_tilt_left: 'tilt left',
            hamster_s_tilt_right: 'tilt right',
            hamster_s_tilt_flip: 'tilt flip',
            hamster_s_tilt_not: 'not tilt',
            hamster_s_tap: 'tap',
            hamster_s_free_fall: 'free fall',
            hamster_s_battery_normal: 'battery normal',
            hamster_s_battery_low: 'battery low',
            hamster_s_battery_empty: 'battery empty',
            hamster_s_forward: 'forward',
            hamster_s_backward: 'backward',
            hamster_s_front: 'front',
            hamster_s_rear: 'rear',
            hamster_s_left_pen: 'left pen',
            hamster_s_right_pen: 'right pen',
            hamster_s_left_wheel: 'left wheel',
            hamster_s_right_wheel: 'right wheel',
            hamster_s_robot: 'robot',
            hamster_s_gain_default: 'default',
            hamster_s_sensor_acceleration_x: 'x acceleration',
            hamster_s_sensor_acceleration_y: 'y acceleration',
            hamster_s_sensor_acceleration_z: 'z acceleration',
            hamster_s_sensor_input_a: 'input A',
            hamster_s_sensor_input_b: 'input B',
            hamster_s_sensor_left_floor: 'left floor',
            hamster_s_sensor_left_proximity: 'left proximity',
            hamster_s_sensor_light: 'light',
            hamster_s_sensor_right_floor: 'right floor',
            hamster_s_sensor_right_proximity: 'right proximity',
            hamster_s_sensor_signal_strength: 'signal strength',
            hamster_s_sensor_temperature: 'temperature',
            hamster_s_buzzer: 'buzzer',
            hamster_s_left_led: 'left LED',
            hamster_s_left_wheel: 'left wheel',
            hamster_s_note: 'note',
            hamster_s_output_a: 'output A',
            hamster_s_output_b: 'output B',
            hamster_s_right_led: 'right LED',
            hamster_s_right_wheel: 'right wheel',
            hamster_s_sound_angry: 'angry',
            hamster_s_sound_beep: 'beep',
            hamster_s_sound_birthday: 'birthday',
            hamster_s_sound_chop: 'chop',
            hamster_s_sound_dibidibidip: 'dibidibidip',
            hamster_s_sound_engine: 'engine',
            hamster_s_sound_good_job: 'good job',
            hamster_s_sound_happy: 'happy',
            hamster_s_sound_march: 'march',
            hamster_s_sound_noise: 'noise',
            hamster_s_sound_random_beep: 'random beep',
            hamster_s_sound_robot: 'robot',
            hamster_s_sound_sad: 'sad',
            hamster_s_sound_siren: 'siren',
            hamster_s_sound_sleep: 'sleep',
            hamster_s_unit_cm: 'cm',
            hamster_s_unit_deg: 'degrees',
            hamster_s_unit_pulse: 'pulses',
            hamster_s_unit_sec: 'seconds',
            hamster_s_analog_input: 'analog input',
            hamster_s_digital_input: 'digital input',
            hamster_s_digital_input_pull_down: 'digital input (pull down)',
            hamster_s_digital_input_pull_up: 'digital input (pull up)',
            hamster_s_digital_output: 'digital output',
            hamster_s_pwm_output: 'pwm output',
            hamster_s_servo_output: 'servo output',
            hamster_s_voltage_input: 'voltage input',
            hamster_s_open_gripper: 'open',
            hamster_s_close_gripper: 'close',
            hamster_s_serial_string: 'string',
            hamster_s_serial_string_line: 'string line',
            hamster_s_serial_all: 'all',
            hamster_s_serial_until_new_line: 'until new line',
            hamster_s_serial_until_comma: 'until ,(comma)',
            hamster_s_serial_until_colon: 'until :(colon)',
            hamster_s_serial_until_dollar: 'until $',
            hamster_s_serial_until_sharp: 'until #',
            hamster_s_serial_input: 'serial input',
        },
    },
});

Entry.HamsterS.blockMenuBlocks = [
    'hamster_s_hand_found',
    'hamster_s_boolean',
    'hamster_s_value',
    'hamster_s_move_forward_once',
    'hamster_s_turn_once',
    'hamster_s_move_forward_unit',
    'hamster_s_move_backward_unit',
    'hamster_s_turn_unit_in_place',
    'hamster_s_pivot_around_unit_in_direction',
    'hamster_s_turn_unit_with_radius_in_direction',
    'hamster_s_change_both_wheels_by',
    'hamster_s_set_both_wheels_to',
    'hamster_s_change_wheel_by',
    'hamster_s_set_wheel_to',
    'hamster_s_follow_line_using',
    'hamster_s_follow_line_until',
    'hamster_s_set_following_speed_to',
    'hamster_s_set_following_gain_to',
    'hamster_s_stop',
    'hamster_s_set_led_to',
    'hamster_s_pick_led',
    'hamster_s_change_led_by_rgb',
    'hamster_s_set_led_to_rgb',
    'hamster_s_clear_led',
    'hamster_s_play_sound_times',
    'hamster_s_play_sound_times_until_done',
    'hamster_s_change_buzzer_by',
    'hamster_s_set_buzzer_to',
    'hamster_s_clear_sound',
    'hamster_s_play_note',
    'hamster_s_play_note_for',
    'hamster_s_rest_for',
    'hamster_s_change_tempo_by',
    'hamster_s_set_tempo_to',
    'hamster_s_set_port_to',
    'hamster_s_change_output_by',
    'hamster_s_set_output_to',
    'hamster_s_gripper',
    'hamster_s_release_gripper',
    'hamster_s_write_serial',
    'hamster_s_read_serial_until',
    'hamster_s_set_serial_rate_to',
];

Entry.HamsterS.getBlocks = function() {
    return {
        hamster_s_hand_found: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
            statements: [],
            params: [],
            events: {},
            def: {
                params: [],
                type: 'hamster_s_hand_found',
            },
            class: 'hamster_s_sensor',
            isNotFor: ['hamsterS'],
            func(sprite, script) {
                const robot = Entry.HamsterS.getRobot();
                return robot ? robot.checkHandFound(script) : false;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'HamsterS.hand_found()',
                        blockType: 'param',
                    },
                ],
            },
        },
        hamster_s_boolean: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.hamster_s_tilt_forward, 'TILT_FORWARD'],
                        [Lang.Blocks.hamster_s_tilt_backward, 'TILT_BACKWARD'],
                        [Lang.Blocks.hamster_s_tilt_left, 'TILT_LEFT'],
                        [Lang.Blocks.hamster_s_tilt_right, 'TILT_RIGHT'],
                        [Lang.Blocks.hamster_s_tilt_flip, 'TILT_FLIP'],
                        [Lang.Blocks.hamster_s_tilt_not, 'TILT_NOT'],
                        [Lang.Blocks.hamster_s_tap, 'TAP'],
                        [Lang.Blocks.hamster_s_free_fall, 'FREE_FALL'],
                        [Lang.Blocks.hamster_s_battery_normal, 'BATTERY_NORMAL'],
                        [Lang.Blocks.hamster_s_battery_low, 'BATTERY_LOW'],
                        [Lang.Blocks.hamster_s_battery_empty, 'BATTERY_EMPTY'],
                    ],
                    value: 'TILT_FORWARD',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'hamster_s_boolean',
            },
            paramsKeyMap: {
                DEVICE: 0,
            },
            class: 'hamster_s_sensor',
            isNotFor: ['hamsterS'],
            func(sprite, script) {
                const robot = Entry.HamsterS.getRobot();
                return robot ? robot.checkBoolean(script) : false;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'HamsterS.boolean_value(%1)',
                        blockType: 'param',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.hamster_s_tilt_forward, 'TILT_FORWARD'],
                                    [Lang.Blocks.hamster_s_tilt_backward, 'TILT_BACKWARD'],
                                    [Lang.Blocks.hamster_s_tilt_left, 'TILT_LEFT'],
                                    [Lang.Blocks.hamster_s_tilt_right, 'TILT_RIGHT'],
                                    [Lang.Blocks.hamster_s_tilt_flip, 'TILT_FLIP'],
                                    [Lang.Blocks.hamster_s_tilt_not, 'TILT_NOT'],
                                    [Lang.Blocks.hamster_s_tap, 'TAP'],
                                    [Lang.Blocks.hamster_s_free_fall, 'FREE_FALL'],
                                    [Lang.Blocks.hamster_s_battery_normal, 'BATTERY_NORMAL'],
                                    [Lang.Blocks.hamster_s_battery_low, 'BATTERY_LOW'],
                                    [Lang.Blocks.hamster_s_battery_empty, 'BATTERY_EMPTY'],
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
        hamster_s_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.hamster_s_sensor_left_proximity, 'LEFT_PROXIMITY'],
                        [Lang.Blocks.hamster_s_sensor_right_proximity, 'RIGHT_PROXIMITY'],
                        [Lang.Blocks.hamster_s_sensor_left_floor, 'LEFT_FLOOR'],
                        [Lang.Blocks.hamster_s_sensor_right_floor, 'RIGHT_FLOOR'],
                        [Lang.Blocks.hamster_s_sensor_acceleration_x, 'ACCELERATION_X'],
                        [Lang.Blocks.hamster_s_sensor_acceleration_y, 'ACCELERATION_Y'],
                        [Lang.Blocks.hamster_s_sensor_acceleration_z, 'ACCELERATION_Z'],
                        [Lang.Blocks.hamster_s_sensor_light, 'LIGHT'],
                        [Lang.Blocks.hamster_s_sensor_temperature, 'TEMPERATURE'],
                        [Lang.Blocks.hamster_s_sensor_signal_strength, 'SIGNAL_STRENGTH'],
                        [Lang.Blocks.hamster_s_sensor_input_a, 'INPUT_A'],
                        [Lang.Blocks.hamster_s_sensor_input_b, 'INPUT_B'],
                        [Lang.Blocks.hamster_s_serial_input, 'SERIAL_INPUT'],
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
                type: 'hamster_s_value',
            },
            paramsKeyMap: {
                DEVICE: 0,
            },
            class: 'hamster_s_sensor',
            isNotFor: ['hamsterS'],
            func(sprite, script) {
                const robot = Entry.HamsterS.getRobot();
                if (robot) {
                    return robot.getValue(script);
                }
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'HamsterS.sensor_value(%1)',
                        blockType: 'param',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.hamster_s_sensor_left_proximity, 'LEFT_PROXIMITY'],
                                    [
                                        Lang.Blocks.hamster_s_sensor_right_proximity,
                                        'RIGHT_PROXIMITY',
                                    ],
                                    [Lang.Blocks.hamster_s_sensor_left_floor, 'LEFT_FLOOR'],
                                    [Lang.Blocks.hamster_s_sensor_right_floor, 'RIGHT_FLOOR'],
                                    [Lang.Blocks.hamster_s_sensor_acceleration_x, 'ACCELERATION_X'],
                                    [Lang.Blocks.hamster_s_sensor_acceleration_y, 'ACCELERATION_Y'],
                                    [Lang.Blocks.hamster_s_sensor_acceleration_z, 'ACCELERATION_Z'],
                                    [Lang.Blocks.hamster_s_sensor_light, 'LIGHT'],
                                    [Lang.Blocks.hamster_s_sensor_temperature, 'TEMPERATURE'],
                                    [
                                        Lang.Blocks.hamster_s_sensor_signal_strength,
                                        'SIGNAL_STRENGTH',
                                    ],
                                    [Lang.Blocks.hamster_s_sensor_input_a, 'INPUT_A'],
                                    [Lang.Blocks.hamster_s_sensor_input_b, 'INPUT_B'],
                                    [Lang.Blocks.hamster_s_serial_input, 'SERIAL_INPUT'],
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
        hamster_s_move_forward_once: {
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
                type: 'hamster_s_move_forward_once',
            },
            class: 'hamster_s_board',
            isNotFor: ['hamsterS'],
            func(sprite, script) {
                const robot = Entry.HamsterS.getRobot();
                return robot ? robot.boardForward(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'HamsterS.board_forward()',
                    },
                ],
            },
        },
        hamster_s_turn_once: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.hamster_s_left, 'LEFT'],
                        [Lang.Blocks.hamster_s_right, 'RIGHT'],
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
                type: 'hamster_s_turn_once',
            },
            paramsKeyMap: {
                DIRECTION: 0,
            },
            class: 'hamster_s_board',
            isNotFor: ['hamsterS'],
            func(sprite, script) {
                const robot = Entry.HamsterS.getRobot();
                return robot ? robot.boardTurn(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'HamsterS.board_turn(%1)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.hamster_s_left, 'LEFT'],
                                    [Lang.Blocks.hamster_s_right, 'RIGHT'],
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
        hamster_s_move_forward_unit: {
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
                        [Lang.Blocks.hamster_s_unit_cm, 'CM'],
                        [Lang.Blocks.hamster_s_unit_sec, 'SEC'],
                        [Lang.Blocks.hamster_s_unit_pulse, 'PULSE'],
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
                        params: ['5'],
                    },
                    null,
                    null,
                ],
                type: 'hamster_s_move_forward_unit',
            },
            paramsKeyMap: {
                VALUE: 0,
                UNIT: 1,
            },
            class: 'hamster_s_wheel',
            isNotFor: ['hamsterS'],
            func(sprite, script) {
                const robot = Entry.HamsterS.getRobot();
                return robot ? robot.moveForwardUnit(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'HamsterS.move_forward(%1, %2)',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.hamster_s_unit_cm, 'CM'],
                                    [Lang.Blocks.hamster_s_unit_sec, 'SEC'],
                                    [Lang.Blocks.hamster_s_unit_pulse, 'PULSE'],
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
        hamster_s_move_backward_unit: {
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
                        [Lang.Blocks.hamster_s_unit_cm, 'CM'],
                        [Lang.Blocks.hamster_s_unit_sec, 'SEC'],
                        [Lang.Blocks.hamster_s_unit_pulse, 'PULSE'],
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
                        params: ['5'],
                    },
                    null,
                    null,
                ],
                type: 'hamster_s_move_backward_unit',
            },
            paramsKeyMap: {
                VALUE: 0,
                UNIT: 1,
            },
            class: 'hamster_s_wheel',
            isNotFor: ['hamsterS'],
            func(sprite, script) {
                const robot = Entry.HamsterS.getRobot();
                return robot ? robot.moveBackwardUnit(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'HamsterS.move_backward(%1, %2)',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.hamster_s_unit_cm, 'CM'],
                                    [Lang.Blocks.hamster_s_unit_sec, 'SEC'],
                                    [Lang.Blocks.hamster_s_unit_pulse, 'PULSE'],
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
        hamster_s_turn_unit_in_place: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.hamster_s_left, 'LEFT'],
                        [Lang.Blocks.hamster_s_right, 'RIGHT'],
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
                        [Lang.Blocks.hamster_s_unit_deg, 'DEG'],
                        [Lang.Blocks.hamster_s_unit_sec, 'SEC'],
                        [Lang.Blocks.hamster_s_unit_pulse, 'PULSE'],
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
                type: 'hamster_s_turn_unit_in_place',
            },
            paramsKeyMap: {
                DIRECTION: 0,
                VALUE: 1,
                UNIT: 2,
            },
            class: 'hamster_s_wheel',
            isNotFor: ['hamsterS'],
            func(sprite, script) {
                const robot = Entry.HamsterS.getRobot();
                return robot ? robot.turnUnit(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'HamsterS.turn(%1, %2, %3)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.hamster_s_left, 'LEFT'],
                                    [Lang.Blocks.hamster_s_right, 'RIGHT'],
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
                                    [Lang.Blocks.hamster_s_unit_deg, 'DEG'],
                                    [Lang.Blocks.hamster_s_unit_sec, 'SEC'],
                                    [Lang.Blocks.hamster_s_unit_pulse, 'PULSE'],
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
        hamster_s_pivot_around_unit_in_direction: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.hamster_s_left_pen, 'LEFT_PEN'],
                        [Lang.Blocks.hamster_s_right_pen, 'RIGHT_PEN'],
                        [Lang.Blocks.hamster_s_left_wheel, 'LEFT_WHEEL'],
                        [Lang.Blocks.hamster_s_right_wheel, 'RIGHT_WHEEL'],
                    ],
                    value: 'LEFT_PEN',
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
                        [Lang.Blocks.hamster_s_unit_deg, 'DEG'],
                        [Lang.Blocks.hamster_s_unit_sec, 'SEC'],
                        [Lang.Blocks.hamster_s_unit_pulse, 'PULSE'],
                    ],
                    value: 'DEG',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.hamster_s_forward, 'FORWARD'],
                        [Lang.Blocks.hamster_s_backward, 'BACKWARD'],
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
                type: 'hamster_s_pivot_around_unit_in_direction',
            },
            paramsKeyMap: {
                PART: 0,
                VALUE: 1,
                UNIT: 2,
                TOWARD: 3,
            },
            class: 'hamster_s_wheel',
            isNotFor: ['hamsterS'],
            func(sprite, script) {
                const robot = Entry.HamsterS.getRobot();
                return robot ? robot.pivotUnit(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'HamsterS.pivot(%1, %2, %3, %4)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.hamster_s_left_pen, 'LEFT_PEN'],
                                    [Lang.Blocks.hamster_s_right_pen, 'RIGHT_PEN'],
                                    [Lang.Blocks.hamster_s_left_wheel, 'LEFT_WHEEL'],
                                    [Lang.Blocks.hamster_s_right_wheel, 'RIGHT_WHEEL'],
                                ],
                                value: 'LEFT_PEN',
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
                                    [Lang.Blocks.hamster_s_unit_deg, 'DEG'],
                                    [Lang.Blocks.hamster_s_unit_sec, 'SEC'],
                                    [Lang.Blocks.hamster_s_unit_pulse, 'PULSE'],
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
                                    [Lang.Blocks.hamster_s_forward, 'FORWARD'],
                                    [Lang.Blocks.hamster_s_backward, 'BACKWARD'],
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
        hamster_s_turn_unit_with_radius_in_direction: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.hamster_s_left_pen, 'LEFT_PEN'],
                        [Lang.Blocks.hamster_s_right_pen, 'RIGHT_PEN'],
                        [Lang.Blocks.hamster_s_robot, 'ROBOT'],
                    ],
                    value: 'LEFT_PEN',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.hamster_s_left, 'LEFT'],
                        [Lang.Blocks.hamster_s_right, 'RIGHT'],
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
                        [Lang.Blocks.hamster_s_unit_deg, 'DEG'],
                        [Lang.Blocks.hamster_s_unit_sec, 'SEC'],
                        [Lang.Blocks.hamster_s_unit_pulse, 'PULSE'],
                    ],
                    value: 'DEG',
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
                        [Lang.Blocks.hamster_s_forward, 'FORWARD'],
                        [Lang.Blocks.hamster_s_backward, 'BACKWARD'],
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
                    null,
                    {
                        type: 'text',
                        params: ['90'],
                    },
                    null,
                    {
                        type: 'text',
                        params: ['5'],
                    },
                    null,
                    null,
                ],
                type: 'hamster_s_turn_unit_with_radius_in_direction',
            },
            paramsKeyMap: {
                PART: 0,
                DIRECTION: 1,
                VALUE: 2,
                UNIT: 3,
                RADIUS: 4,
                TOWARD: 5,
            },
            class: 'hamster_s_wheel',
            isNotFor: ['hamsterS'],
            func(sprite, script) {
                const robot = Entry.HamsterS.getRobot();
                return robot ? robot.swingUnit(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'HamsterS.circle(%1, %2, %3, %4, %5, %6)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.hamster_s_left_pen, 'LEFT_PEN'],
                                    [Lang.Blocks.hamster_s_right_pen, 'RIGHT_PEN'],
                                    [Lang.Blocks.hamster_s_robot, 'ROBOT'],
                                ],
                                value: 'LEFT_PEN',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.hamster_s_left, 'LEFT'],
                                    [Lang.Blocks.hamster_s_right, 'RIGHT'],
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
                                    [Lang.Blocks.hamster_s_unit_deg, 'DEG'],
                                    [Lang.Blocks.hamster_s_unit_sec, 'SEC'],
                                    [Lang.Blocks.hamster_s_unit_pulse, 'PULSE'],
                                ],
                                value: 'DEG',
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
                                    [Lang.Blocks.hamster_s_forward, 'FORWARD'],
                                    [Lang.Blocks.hamster_s_backward, 'BACKWARD'],
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
        hamster_s_change_both_wheels_by: {
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
                type: 'hamster_s_change_both_wheels_by',
            },
            paramsKeyMap: {
                LEFT: 0,
                RIGHT: 1,
            },
            class: 'hamster_s_wheel',
            isNotFor: ['hamsterS'],
            func(sprite, script) {
                const robot = Entry.HamsterS.getRobot();
                return robot ? robot.changeWheels(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'HamsterS.add_wheels(%1, %2)',
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
        hamster_s_set_both_wheels_to: {
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
                        params: ['30'],
                    },
                    {
                        type: 'text',
                        params: ['30'],
                    },
                    null,
                ],
                type: 'hamster_s_set_both_wheels_to',
            },
            paramsKeyMap: {
                LEFT: 0,
                RIGHT: 1,
            },
            class: 'hamster_s_wheel',
            isNotFor: ['hamsterS'],
            func(sprite, script) {
                const robot = Entry.HamsterS.getRobot();
                return robot ? robot.setWheels(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'HamsterS.set_wheels(%1, %2)',
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
        hamster_s_change_wheel_by: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.hamster_s_left, 'LEFT'],
                        [Lang.Blocks.hamster_s_right, 'RIGHT'],
                        [Lang.Blocks.hamster_s_both, 'BOTH'],
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
                type: 'hamster_s_change_wheel_by',
            },
            paramsKeyMap: {
                WHEEL: 0,
                VELOCITY: 1,
            },
            class: 'hamster_s_wheel',
            isNotFor: ['hamsterS'],
            func(sprite, script) {
                const robot = Entry.HamsterS.getRobot();
                return robot ? robot.changeWheel(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'HamsterS.add_wheel(%1, %2)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.hamster_s_left, 'LEFT'],
                                    [Lang.Blocks.hamster_s_right, 'RIGHT'],
                                    [Lang.Blocks.hamster_s_both, 'BOTH'],
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
        hamster_s_set_wheel_to: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.hamster_s_left, 'LEFT'],
                        [Lang.Blocks.hamster_s_right, 'RIGHT'],
                        [Lang.Blocks.hamster_s_both, 'BOTH'],
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
                        params: ['30'],
                    },
                    null,
                ],
                type: 'hamster_s_set_wheel_to',
            },
            paramsKeyMap: {
                WHEEL: 0,
                VELOCITY: 1,
            },
            class: 'hamster_s_wheel',
            isNotFor: ['hamsterS'],
            func(sprite, script) {
                const robot = Entry.HamsterS.getRobot();
                return robot ? robot.setWheel(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'HamsterS.set_wheel(%1, %2)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.hamster_s_left, 'LEFT'],
                                    [Lang.Blocks.hamster_s_right, 'RIGHT'],
                                    [Lang.Blocks.hamster_s_both, 'BOTH'],
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
        hamster_s_follow_line_using: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.hamster_s_color_black, 'BLACK'],
                        [Lang.Blocks.hamster_s_color_white, 'WHITE'],
                    ],
                    value: 'BLACK',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.hamster_s_left, 'LEFT'],
                        [Lang.Blocks.hamster_s_right, 'RIGHT'],
                        [Lang.Blocks.hamster_s_both, 'BOTH'],
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
                params: [null, null, null],
                type: 'hamster_s_follow_line_using',
            },
            paramsKeyMap: {
                COLOR: 0,
                SENSOR: 1,
            },
            class: 'hamster_s_wheel',
            isNotFor: ['hamsterS'],
            func(sprite, script) {
                const robot = Entry.HamsterS.getRobot();
                return robot ? robot.followLine(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'HamsterS.follow_line(%1, %2)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.hamster_s_color_black, 'BLACK'],
                                    [Lang.Blocks.hamster_s_color_white, 'WHITE'],
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
                                    [Lang.Blocks.hamster_s_left, 'LEFT'],
                                    [Lang.Blocks.hamster_s_right, 'RIGHT'],
                                    [Lang.Blocks.hamster_s_both, 'BOTH'],
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
        hamster_s_follow_line_until: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.hamster_s_color_black, 'BLACK'],
                        [Lang.Blocks.hamster_s_color_white, 'WHITE'],
                    ],
                    value: 'BLACK',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.hamster_s_left, 'LEFT'],
                        [Lang.Blocks.hamster_s_right, 'RIGHT'],
                        [Lang.Blocks.hamster_s_front, 'FRONT'],
                        [Lang.Blocks.hamster_s_rear, 'REAR'],
                    ],
                    value: 'FRONT',
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
                type: 'hamster_s_follow_line_until',
            },
            paramsKeyMap: {
                COLOR: 0,
                DIRECTION: 1,
            },
            class: 'hamster_s_wheel',
            isNotFor: ['hamsterS'],
            func(sprite, script) {
                const robot = Entry.HamsterS.getRobot();
                return robot ? robot.followLineUntil(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'HamsterS.follow_line_until(%1, %2)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.hamster_s_color_black, 'BLACK'],
                                    [Lang.Blocks.hamster_s_color_white, 'WHITE'],
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
                                    [Lang.Blocks.hamster_s_left, 'LEFT'],
                                    [Lang.Blocks.hamster_s_right, 'RIGHT'],
                                    [Lang.Blocks.hamster_s_front, 'FRONT'],
                                    [Lang.Blocks.hamster_s_rear, 'REAR'],
                                ],
                                value: 'FRONT',
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
        hamster_s_set_following_speed_to: {
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
                params: ['5', null],
                type: 'hamster_s_set_following_speed_to',
            },
            paramsKeyMap: {
                SPEED: 0,
            },
            class: 'hamster_s_wheel',
            isNotFor: ['hamsterS'],
            func(sprite, script) {
                const robot = Entry.HamsterS.getRobot();
                return robot ? robot.setLineTracerSpeed(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'HamsterS.set_line_speed(%1)',
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
        hamster_s_set_following_gain_to: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.hamster_s_gain_default, 'DEFAULT'],
                        ['1', '1'],
                        ['2', '2'],
                        ['3', '3'],
                        ['4', '4'],
                        ['5', '5'],
                        ['6', '6'],
                        ['7', '7'],
                        ['8', '8'],
                    ],
                    value: 'DEFAULT',
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
                type: 'hamster_s_set_following_gain_to',
            },
            paramsKeyMap: {
                GAIN: 0,
            },
            class: 'hamster_s_wheel',
            isNotFor: ['hamsterS'],
            func(sprite, script) {
                const robot = Entry.HamsterS.getRobot();
                return robot ? robot.setLineTracerGain(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'HamsterS.set_line_gain(%1)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.hamster_s_gain_default, 'DEFAULT'],
                                    ['1', '1'],
                                    ['2', '2'],
                                    ['3', '3'],
                                    ['4', '4'],
                                    ['5', '5'],
                                    ['6', '6'],
                                    ['7', '7'],
                                    ['8', '8'],
                                ],
                                value: 'DEFAULT',
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
        hamster_s_stop: {
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
                type: 'hamster_s_stop',
            },
            class: 'hamster_s_wheel',
            isNotFor: ['hamsterS'],
            func(sprite, script) {
                const robot = Entry.HamsterS.getRobot();
                return robot ? robot.stop(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'HamsterS.stop()',
                    },
                ],
            },
        },
        hamster_s_set_led_to: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.hamster_s_left, 'LEFT'],
                        [Lang.Blocks.hamster_s_right, 'RIGHT'],
                        [Lang.Blocks.hamster_s_both, 'BOTH'],
                    ],
                    value: 'LEFT',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.hamster_s_color_red, 'RED'],
                        [Lang.Blocks.hamster_s_color_orange, 'ORANGE'],
                        [Lang.Blocks.hamster_s_color_yellow, 'YELLOW'],
                        [Lang.Blocks.hamster_s_color_green, 'GREEN'],
                        [Lang.Blocks.hamster_s_color_sky_blue, 'SKY_BLUE'],
                        [Lang.Blocks.hamster_s_color_blue, 'BLUE'],
                        [Lang.Blocks.hamster_s_color_violet, 'VIOLET'],
                        [Lang.Blocks.hamster_s_color_purple, 'PURPLE'],
                        [Lang.Blocks.hamster_s_color_white, 'WHITE'],
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
                type: 'hamster_s_set_led_to',
            },
            paramsKeyMap: {
                LED: 0,
                COLOR: 1,
            },
            class: 'hamster_s_led',
            isNotFor: ['hamsterS'],
            func(sprite, script) {
                const robot = Entry.HamsterS.getRobot();
                return robot ? robot.setLed(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'HamsterS.set_led(%1, %2)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.hamster_s_left, 'LEFT'],
                                    [Lang.Blocks.hamster_s_right, 'RIGHT'],
                                    [Lang.Blocks.hamster_s_both, 'BOTH'],
                                ],
                                value: 'LEFT',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.hamster_s_color_red, 'RED'],
                                    [Lang.Blocks.hamster_s_color_orange, 'ORANGE'],
                                    [Lang.Blocks.hamster_s_color_yellow, 'YELLOW'],
                                    [Lang.Blocks.hamster_s_color_green, 'GREEN'],
                                    [Lang.Blocks.hamster_s_color_sky_blue, 'SKY_BLUE'],
                                    [Lang.Blocks.hamster_s_color_blue, 'BLUE'],
                                    [Lang.Blocks.hamster_s_color_violet, 'VIOLET'],
                                    [Lang.Blocks.hamster_s_color_purple, 'PURPLE'],
                                    [Lang.Blocks.hamster_s_color_white, 'WHITE'],
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
        hamster_s_pick_led: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.hamster_s_left, 'LEFT'],
                        [Lang.Blocks.hamster_s_right, 'RIGHT'],
                        [Lang.Blocks.hamster_s_both, 'BOTH'],
                    ],
                    value: 'LEFT',
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
                type: 'hamster_s_pick_led',
            },
            paramsKeyMap: {
                LED: 0,
                COLOR: 1,
            },
            class: 'hamster_s_led',
            isNotFor: ['hamsterS'],
            func(sprite, script) {
                const robot = Entry.HamsterS.getRobot();
                return robot ? robot.pickLed(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'HamsterS.pick_led(%1, %2)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.hamster_s_left, 'LEFT'],
                                    [Lang.Blocks.hamster_s_right, 'RIGHT'],
                                    [Lang.Blocks.hamster_s_both, 'BOTH'],
                                ],
                                value: 'LEFT',
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
        hamster_s_change_led_by_rgb: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.hamster_s_left, 'LEFT'],
                        [Lang.Blocks.hamster_s_right, 'RIGHT'],
                        [Lang.Blocks.hamster_s_both, 'BOTH'],
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
                type: 'hamster_s_change_led_by_rgb',
            },
            paramsKeyMap: {
                LED: 0,
                RED: 1,
                GREEN: 2,
                BLUE: 3,
            },
            class: 'hamster_s_led',
            isNotFor: ['hamsterS'],
            func(sprite, script) {
                const robot = Entry.HamsterS.getRobot();
                return robot ? robot.changeRgb(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'HamsterS.add_rgb(%1, %2, %3, %4)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.hamster_s_left, 'LEFT'],
                                    [Lang.Blocks.hamster_s_right, 'RIGHT'],
                                    [Lang.Blocks.hamster_s_both, 'BOTH'],
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
        hamster_s_set_led_to_rgb: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.hamster_s_left, 'LEFT'],
                        [Lang.Blocks.hamster_s_right, 'RIGHT'],
                        [Lang.Blocks.hamster_s_both, 'BOTH'],
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
                type: 'hamster_s_set_led_to_rgb',
            },
            paramsKeyMap: {
                LED: 0,
                RED: 1,
                GREEN: 2,
                BLUE: 3,
            },
            class: 'hamster_s_led',
            isNotFor: ['hamsterS'],
            func(sprite, script) {
                const robot = Entry.HamsterS.getRobot();
                return robot ? robot.setRgb(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'HamsterS.set_rgb(%1, %2, %3, %4)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.hamster_s_left, 'LEFT'],
                                    [Lang.Blocks.hamster_s_right, 'RIGHT'],
                                    [Lang.Blocks.hamster_s_both, 'BOTH'],
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
        hamster_s_clear_led: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.hamster_s_left, 'LEFT'],
                        [Lang.Blocks.hamster_s_right, 'RIGHT'],
                        [Lang.Blocks.hamster_s_both, 'BOTH'],
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
                type: 'hamster_s_clear_led',
            },
            paramsKeyMap: {
                LED: 0,
            },
            class: 'hamster_s_led',
            isNotFor: ['hamsterS'],
            func(sprite, script) {
                const robot = Entry.HamsterS.getRobot();
                return robot ? robot.clearLed(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'HamsterS.clear_led(%1)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.hamster_s_left, 'LEFT'],
                                    [Lang.Blocks.hamster_s_right, 'RIGHT'],
                                    [Lang.Blocks.hamster_s_both, 'BOTH'],
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
        hamster_s_play_sound_times: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.hamster_s_sound_beep, 'BEEP'],
                        [Lang.Blocks.hamster_s_sound_random_beep, 'RANDOM_BEEP'],
                        [Lang.Blocks.hamster_s_sound_noise, 'NOISE'],
                        [Lang.Blocks.hamster_s_sound_siren, 'SIREN'],
                        [Lang.Blocks.hamster_s_sound_engine, 'ENGINE'],
                        [Lang.Blocks.hamster_s_sound_chop, 'CHOP'],
                        [Lang.Blocks.hamster_s_sound_robot, 'ROBOT'],
                        [Lang.Blocks.hamster_s_sound_dibidibidip, 'DIBIDIBIDIP'],
                        [Lang.Blocks.hamster_s_sound_good_job, 'GOOD_JOB'],
                        [Lang.Blocks.hamster_s_sound_happy, 'HAPPY'],
                        [Lang.Blocks.hamster_s_sound_angry, 'ANGRY'],
                        [Lang.Blocks.hamster_s_sound_sad, 'SAD'],
                        [Lang.Blocks.hamster_s_sound_sleep, 'SLEEP'],
                        [Lang.Blocks.hamster_s_sound_march, 'MARCH'],
                        [Lang.Blocks.hamster_s_sound_birthday, 'BIRTHDAY'],
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
                type: 'hamster_s_play_sound_times',
            },
            paramsKeyMap: {
                SOUND: 0,
                COUNT: 1,
            },
            class: 'hamster_s_sound',
            isNotFor: ['hamsterS'],
            func(sprite, script) {
                const robot = Entry.HamsterS.getRobot();
                return robot ? robot.playSound(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'HamsterS.play_sound(%1, %2)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.hamster_s_sound_beep, 'BEEP'],
                                    [Lang.Blocks.hamster_s_sound_random_beep, 'RANDOM_BEEP'],
                                    [Lang.Blocks.hamster_s_sound_noise, 'NOISE'],
                                    [Lang.Blocks.hamster_s_sound_siren, 'SIREN'],
                                    [Lang.Blocks.hamster_s_sound_engine, 'ENGINE'],
                                    [Lang.Blocks.hamster_s_sound_chop, 'CHOP'],
                                    [Lang.Blocks.hamster_s_sound_robot, 'ROBOT'],
                                    [Lang.Blocks.hamster_s_sound_dibidibidip, 'DIBIDIBIDIP'],
                                    [Lang.Blocks.hamster_s_sound_good_job, 'GOOD_JOB'],
                                    [Lang.Blocks.hamster_s_sound_happy, 'HAPPY'],
                                    [Lang.Blocks.hamster_s_sound_angry, 'ANGRY'],
                                    [Lang.Blocks.hamster_s_sound_sad, 'SAD'],
                                    [Lang.Blocks.hamster_s_sound_sleep, 'SLEEP'],
                                    [Lang.Blocks.hamster_s_sound_march, 'MARCH'],
                                    [Lang.Blocks.hamster_s_sound_birthday, 'BIRTHDAY'],
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
        hamster_s_play_sound_times_until_done: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.hamster_s_sound_beep, 'BEEP'],
                        [Lang.Blocks.hamster_s_sound_random_beep, 'RANDOM_BEEP'],
                        [Lang.Blocks.hamster_s_sound_noise, 'NOISE'],
                        [Lang.Blocks.hamster_s_sound_siren, 'SIREN'],
                        [Lang.Blocks.hamster_s_sound_engine, 'ENGINE'],
                        [Lang.Blocks.hamster_s_sound_chop, 'CHOP'],
                        [Lang.Blocks.hamster_s_sound_robot, 'ROBOT'],
                        [Lang.Blocks.hamster_s_sound_dibidibidip, 'DIBIDIBIDIP'],
                        [Lang.Blocks.hamster_s_sound_good_job, 'GOOD_JOB'],
                        [Lang.Blocks.hamster_s_sound_happy, 'HAPPY'],
                        [Lang.Blocks.hamster_s_sound_angry, 'ANGRY'],
                        [Lang.Blocks.hamster_s_sound_sad, 'SAD'],
                        [Lang.Blocks.hamster_s_sound_sleep, 'SLEEP'],
                        [Lang.Blocks.hamster_s_sound_march, 'MARCH'],
                        [Lang.Blocks.hamster_s_sound_birthday, 'BIRTHDAY'],
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
                type: 'hamster_s_play_sound_times_until_done',
            },
            paramsKeyMap: {
                SOUND: 0,
                COUNT: 1,
            },
            class: 'hamster_s_sound',
            isNotFor: ['hamsterS'],
            func(sprite, script) {
                const robot = Entry.HamsterS.getRobot();
                return robot ? robot.playSoundUntil(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'HamsterS.play_sound_until_done(%1, %2)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.hamster_s_sound_beep, 'BEEP'],
                                    [Lang.Blocks.hamster_s_sound_random_beep, 'RANDOM_BEEP'],
                                    [Lang.Blocks.hamster_s_sound_noise, 'NOISE'],
                                    [Lang.Blocks.hamster_s_sound_siren, 'SIREN'],
                                    [Lang.Blocks.hamster_s_sound_engine, 'ENGINE'],
                                    [Lang.Blocks.hamster_s_sound_chop, 'CHOP'],
                                    [Lang.Blocks.hamster_s_sound_robot, 'ROBOT'],
                                    [Lang.Blocks.hamster_s_sound_dibidibidip, 'DIBIDIBIDIP'],
                                    [Lang.Blocks.hamster_s_sound_good_job, 'GOOD_JOB'],
                                    [Lang.Blocks.hamster_s_sound_happy, 'HAPPY'],
                                    [Lang.Blocks.hamster_s_sound_angry, 'ANGRY'],
                                    [Lang.Blocks.hamster_s_sound_sad, 'SAD'],
                                    [Lang.Blocks.hamster_s_sound_sleep, 'SLEEP'],
                                    [Lang.Blocks.hamster_s_sound_march, 'MARCH'],
                                    [Lang.Blocks.hamster_s_sound_birthday, 'BIRTHDAY'],
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
        hamster_s_change_buzzer_by: {
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
                type: 'hamster_s_change_buzzer_by',
            },
            paramsKeyMap: {
                HZ: 0,
            },
            class: 'hamster_s_sound',
            isNotFor: ['hamsterS'],
            func(sprite, script) {
                const robot = Entry.HamsterS.getRobot();
                return robot ? robot.changeBuzzer(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'HamsterS.add_buzzer(%1)',
                    },
                ],
            },
        },
        hamster_s_set_buzzer_to: {
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
                type: 'hamster_s_set_buzzer_to',
            },
            paramsKeyMap: {
                HZ: 0,
            },
            class: 'hamster_s_sound',
            isNotFor: ['hamsterS'],
            func(sprite, script) {
                const robot = Entry.HamsterS.getRobot();
                return robot ? robot.setBuzzer(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'HamsterS.set_buzzer(%1)',
                    },
                ],
            },
        },
        hamster_s_clear_sound: {
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
                type: 'hamster_s_clear_sound',
            },
            class: 'hamster_s_sound',
            isNotFor: ['hamsterS'],
            func(sprite, script) {
                const robot = Entry.HamsterS.getRobot();
                return robot ? robot.clearSound(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'HamsterS.clear_sound()',
                        params: [null],
                    },
                ],
            },
        },
        hamster_s_play_note: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.hamster_s_note_c, 'C'],
                        [Lang.Blocks.hamster_s_note_c_sharp, 'C#'],
                        [Lang.Blocks.hamster_s_note_d, 'D'],
                        [Lang.Blocks.hamster_s_note_d_sharp, 'D#'],
                        [Lang.Blocks.hamster_s_note_e, 'E'],
                        [Lang.Blocks.hamster_s_note_f, 'F'],
                        [Lang.Blocks.hamster_s_note_f_sharp, 'F#'],
                        [Lang.Blocks.hamster_s_note_g, 'G'],
                        [Lang.Blocks.hamster_s_note_g_sharp, 'G#'],
                        [Lang.Blocks.hamster_s_note_a, 'A'],
                        [Lang.Blocks.hamster_s_note_a_sharp, 'A#'],
                        [Lang.Blocks.hamster_s_note_b, 'B'],
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
                type: 'hamster_s_play_note',
            },
            paramsKeyMap: {
                NOTE: 0,
                OCTAVE: 1,
            },
            class: 'hamster_s_sound',
            isNotFor: ['hamsterS'],
            func(sprite, script) {
                const robot = Entry.HamsterS.getRobot();
                return robot ? robot.playNote(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'HamsterS.play_pitch(%1, %2)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.hamster_s_note_c, 'C'],
                                    [Lang.Blocks.hamster_s_note_c_sharp, 'C#'],
                                    [Lang.Blocks.hamster_s_note_d, 'D'],
                                    [Lang.Blocks.hamster_s_note_d_sharp, 'D#'],
                                    [Lang.Blocks.hamster_s_note_e, 'E'],
                                    [Lang.Blocks.hamster_s_note_f, 'F'],
                                    [Lang.Blocks.hamster_s_note_f_sharp, 'F#'],
                                    [Lang.Blocks.hamster_s_note_g, 'G'],
                                    [Lang.Blocks.hamster_s_note_g_sharp, 'G#'],
                                    [Lang.Blocks.hamster_s_note_a, 'A'],
                                    [Lang.Blocks.hamster_s_note_a_sharp, 'A#'],
                                    [Lang.Blocks.hamster_s_note_b, 'B'],
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
        hamster_s_play_note_for: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.hamster_s_note_c, 'C'],
                        [Lang.Blocks.hamster_s_note_c_sharp, 'C#'],
                        [Lang.Blocks.hamster_s_note_d, 'D'],
                        [Lang.Blocks.hamster_s_note_d_sharp, 'D#'],
                        [Lang.Blocks.hamster_s_note_e, 'E'],
                        [Lang.Blocks.hamster_s_note_f, 'F'],
                        [Lang.Blocks.hamster_s_note_f_sharp, 'F#'],
                        [Lang.Blocks.hamster_s_note_g, 'G'],
                        [Lang.Blocks.hamster_s_note_g_sharp, 'G#'],
                        [Lang.Blocks.hamster_s_note_a, 'A'],
                        [Lang.Blocks.hamster_s_note_a_sharp, 'A#'],
                        [Lang.Blocks.hamster_s_note_b, 'B'],
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
                type: 'hamster_s_play_note_for',
            },
            paramsKeyMap: {
                NOTE: 0,
                OCTAVE: 1,
                BEAT: 2,
            },
            class: 'hamster_s_sound',
            isNotFor: ['hamsterS'],
            func(sprite, script) {
                const robot = Entry.HamsterS.getRobot();
                return robot ? robot.playNoteBeat(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'HamsterS.play_note(%1, %2, %3)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.hamster_s_note_c, 'C'],
                                    [Lang.Blocks.hamster_s_note_c_sharp, 'C#'],
                                    [Lang.Blocks.hamster_s_note_d, 'D'],
                                    [Lang.Blocks.hamster_s_note_d_sharp, 'D#'],
                                    [Lang.Blocks.hamster_s_note_e, 'E'],
                                    [Lang.Blocks.hamster_s_note_f, 'F'],
                                    [Lang.Blocks.hamster_s_note_f_sharp, 'F#'],
                                    [Lang.Blocks.hamster_s_note_g, 'G'],
                                    [Lang.Blocks.hamster_s_note_g_sharp, 'G#'],
                                    [Lang.Blocks.hamster_s_note_a, 'A'],
                                    [Lang.Blocks.hamster_s_note_a_sharp, 'A#'],
                                    [Lang.Blocks.hamster_s_note_b, 'B'],
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
        hamster_s_rest_for: {
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
                type: 'hamster_s_rest_for',
            },
            paramsKeyMap: {
                BEAT: 0,
            },
            class: 'hamster_s_sound',
            isNotFor: ['hamsterS'],
            func(sprite, script) {
                const robot = Entry.HamsterS.getRobot();
                return robot ? robot.restBeat(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'HamsterS.rest(%1)',
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
        hamster_s_change_tempo_by: {
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
                type: 'hamster_s_change_tempo_by',
            },
            paramsKeyMap: {
                BPM: 0,
            },
            class: 'hamster_s_sound',
            isNotFor: ['hamsterS'],
            func(sprite, script) {
                const robot = Entry.HamsterS.getRobot();
                return robot ? robot.changeTempo(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'HamsterS.add_tempo(%1)',
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
        hamster_s_set_tempo_to: {
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
                type: 'hamster_s_set_tempo_to',
            },
            paramsKeyMap: {
                BPM: 0,
            },
            class: 'hamster_s_sound',
            isNotFor: ['hamsterS'],
            func(sprite, script) {
                const robot = Entry.HamsterS.getRobot();
                return robot ? robot.setTempo(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'HamsterS.set_tempo(%1)',
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
        hamster_s_set_port_to: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.hamster_s_port_a, 'A'],
                        [Lang.Blocks.hamster_s_port_b, 'B'],
                        [Lang.Blocks.hamster_s_port_ab, 'AB'],
                    ],
                    value: 'A',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.hamster_s_analog_input, 'ANALOG_INPUT'],
                        [Lang.Blocks.hamster_s_digital_input, 'DIGITAL_INPUT'],
                        [Lang.Blocks.hamster_s_digital_input_pull_up, 'DIGITAL_INPUT_PULL_UP'],
                        [Lang.Blocks.hamster_s_digital_input_pull_down, 'DIGITAL_INPUT_PULL_DOWN'],
                        [Lang.Blocks.hamster_s_voltage_input, 'VOLTAGE_INPUT'],
                        [Lang.Blocks.hamster_s_servo_output, 'SERVO_OUTPUT'],
                        [Lang.Blocks.hamster_s_pwm_output, 'PWM_OUTPUT'],
                        [Lang.Blocks.hamster_s_digital_output, 'DIGITAL_OUTPUT'],
                    ],
                    value: 'ANALOG_INPUT',
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
                type: 'hamster_s_set_port_to',
            },
            paramsKeyMap: {
                PORT: 0,
                MODE: 1,
            },
            class: 'hamster_s_port',
            isNotFor: ['hamsterS'],
            func(sprite, script) {
                const robot = Entry.HamsterS.getRobot();
                return robot ? robot.setIoMode(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'HamsterS.set_io_mode(%1, %2)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.hamster_s_port_a, 'A'],
                                    [Lang.Blocks.hamster_s_port_b, 'B'],
                                    [Lang.Blocks.hamster_s_port_ab, 'AB'],
                                ],
                                value: 'A',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.hamster_s_analog_input, 'ANALOG_INPUT'],
                                    [Lang.Blocks.hamster_s_digital_input, 'DIGITAL_INPUT'],
                                    [
                                        Lang.Blocks.hamster_s_digital_input_pull_up,
                                        'DIGITAL_INPUT_PULL_UP',
                                    ],
                                    [
                                        Lang.Blocks.hamster_s_digital_input_pull_down,
                                        'DIGITAL_INPUT_PULL_DOWN',
                                    ],
                                    [Lang.Blocks.hamster_s_voltage_input, 'VOLTAGE_INPUT'],
                                    [Lang.Blocks.hamster_s_servo_output, 'SERVO_OUTPUT'],
                                    [Lang.Blocks.hamster_s_pwm_output, 'PWM_OUTPUT'],
                                    [Lang.Blocks.hamster_s_digital_output, 'DIGITAL_OUTPUT'],
                                ],
                                value: 'ANALOG_INPUT',
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
        hamster_s_change_output_by: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.hamster_s_port_a, 'A'],
                        [Lang.Blocks.hamster_s_port_b, 'B'],
                        [Lang.Blocks.hamster_s_port_ab, 'AB'],
                    ],
                    value: 'A',
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
                type: 'hamster_s_change_output_by',
            },
            paramsKeyMap: {
                PORT: 0,
                VALUE: 1,
            },
            class: 'hamster_s_port',
            isNotFor: ['hamsterS'],
            func(sprite, script) {
                const robot = Entry.HamsterS.getRobot();
                return robot ? robot.changeOutput(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'HamsterS.add_output(%1, %2)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.hamster_s_port_a, 'A'],
                                    [Lang.Blocks.hamster_s_port_b, 'B'],
                                    [Lang.Blocks.hamster_s_port_ab, 'AB'],
                                ],
                                value: 'A',
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
        hamster_s_set_output_to: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.hamster_s_port_a, 'A'],
                        [Lang.Blocks.hamster_s_port_b, 'B'],
                        [Lang.Blocks.hamster_s_port_ab, 'AB'],
                    ],
                    value: 'A',
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
                        params: ['100'],
                    },
                    null,
                ],
                type: 'hamster_s_set_output_to',
            },
            paramsKeyMap: {
                PORT: 0,
                VALUE: 1,
            },
            class: 'hamster_s_port',
            isNotFor: ['hamsterS'],
            func(sprite, script) {
                const robot = Entry.HamsterS.getRobot();
                return robot ? robot.setOutput(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'HamsterS.set_output(%1, %2)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.hamster_s_port_a, 'A'],
                                    [Lang.Blocks.hamster_s_port_b, 'B'],
                                    [Lang.Blocks.hamster_s_port_ab, 'AB'],
                                ],
                                value: 'A',
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
        hamster_s_gripper: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.hamster_s_open_gripper, 'OPEN'],
                        [Lang.Blocks.hamster_s_close_gripper, 'CLOSE'],
                    ],
                    value: 'OPEN',
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
                type: 'hamster_s_gripper',
            },
            paramsKeyMap: {
                ACTION: 0,
            },
            class: 'hamster_s_port',
            isNotFor: ['hamsterS'],
            func(sprite, script) {
                const robot = Entry.HamsterS.getRobot();
                return robot ? robot.gripper(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'HamsterS.set_gripper(%1)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.hamster_s_open_gripper, 'OPEN'],
                                    [Lang.Blocks.hamster_s_close_gripper, 'CLOSE'],
                                ],
                                value: 'OPEN',
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
        hamster_s_release_gripper: {
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
                type: 'hamster_s_release_gripper',
            },
            class: 'hamster_s_port',
            isNotFor: ['hamsterS'],
            func(sprite, script) {
                const robot = Entry.HamsterS.getRobot();
                return robot ? robot.releaseGripper(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'HamsterS.release_gripper()',
                    },
                ],
            },
        },
        hamster_s_write_serial: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.hamster_s_serial_string, 'STRING'],
                        [Lang.Blocks.hamster_s_serial_string_line, 'STRING_LINE'],
                    ],
                    value: 'STRING',
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
                        params: ['abc123'],
                    },
                    null,
                ],
                type: 'hamster_s_write_serial',
            },
            paramsKeyMap: {
                MODE: 0,
                STRING: 1,
            },
            class: 'hamster_s_port',
            isNotFor: ['hamsterS'],
            func(sprite, script) {
                const robot = Entry.HamsterS.getRobot();
                return robot ? robot.writeSerial(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'HamsterS.write_serial(%1, %2)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.hamster_s_serial_string, 'STRING'],
                                    [Lang.Blocks.hamster_s_serial_string_line, 'STRING_LINE'],
                                ],
                                value: 'STRING',
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
        hamster_s_read_serial_until: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.hamster_s_serial_all, 'ALL'],
                        [Lang.Blocks.hamster_s_serial_until_comma, 'COMMA'],
                        [Lang.Blocks.hamster_s_serial_until_colon, 'COLON'],
                        [Lang.Blocks.hamster_s_serial_until_dollar, 'DOLLAR'],
                        [Lang.Blocks.hamster_s_serial_until_sharp, 'SHARP'],
                        [Lang.Blocks.hamster_s_serial_until_new_line, 'NEW_LINE'],
                    ],
                    value: 'ALL',
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
                type: 'hamster_s_read_serial_until',
            },
            paramsKeyMap: {
                DELIMITER: 0,
            },
            class: 'hamster_s_port',
            isNotFor: ['hamsterS'],
            func(sprite, script) {
                const robot = Entry.HamsterS.getRobot();
                return robot ? robot.readSerialUntil(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'HamsterS.read_serial(%1)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.hamster_s_serial_all, 'ALL'],
                                    [Lang.Blocks.hamster_s_serial_until_comma, 'COMMA'],
                                    [Lang.Blocks.hamster_s_serial_until_colon, 'COLON'],
                                    [Lang.Blocks.hamster_s_serial_until_dollar, 'DOLLAR'],
                                    [Lang.Blocks.hamster_s_serial_until_sharp, 'SHARP'],
                                    [Lang.Blocks.hamster_s_serial_until_new_line, 'NEW_LINE'],
                                ],
                                value: 'ALL',
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
        hamster_s_set_serial_rate_to: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['9600', '9600'],
                        ['14400', '14400'],
                        ['19200', '19200'],
                        ['28800', '28800'],
                        ['38400', '38400'],
                        ['57600', '57600'],
                        ['76800', '76800'],
                        ['115200', '115200'],
                    ],
                    value: '9600',
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
                type: 'hamster_s_set_serial_rate_to',
            },
            paramsKeyMap: {
                BAUD: 0,
            },
            class: 'hamster_s_port',
            isNotFor: ['hamsterS'],
            func(sprite, script) {
                const robot = Entry.HamsterS.getRobot();
                return robot ? robot.setSerialRate(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'HamsterS.set_serial_rate(%1)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    ['9600', '9600'],
                                    ['14400', '14400'],
                                    ['19200', '19200'],
                                    ['28800', '28800'],
                                    ['38400', '38400'],
                                    ['57600', '57600'],
                                    ['76800', '76800'],
                                    ['115200', '115200'],
                                ],
                                value: '9600',
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
    };
};

module.exports = Entry.HamsterS;
