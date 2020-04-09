'use strict';

Entry.Roboid = {
    setZero() {
        Entry.Robomation.setZero();
    },
    afterReceive(pd) {
        Entry.Robomation.afterReceive(pd, true);
    },
    afterSend(sq) {
        Entry.Robomation.afterSend(sq);
    },
    getHamster(index) {
        return Entry.Robomation.getRobot('hamster', index);
    },
    getHamsterS(index) {
        return Entry.Robomation.getRobot('hamster', index);
    },
    getTurtle(index) {
        return Entry.Robomation.getRobot('turtle', index);
    },
    id: '2.FF',
    name: 'roboid',
    url: 'http://www.robomation.net',
    imageName: 'block_roboid.png',
    title: {
        en: 'Roboid',
        ko: '로보이드',
        jp: 'ロボイド',
        vn: 'Roboid',
    },
    monitorTemplate: {
        imgPath: 'hw/transparent.png',
        width: 2,
        height: 2,
        listPorts: {
            hamster0leftProximity: {
                name: `${Lang.Menus.hamster} 0: ${Lang.Blocks.HAMSTER_sensor_left_proximity}`,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            hamster0rightProximity: {
                name: `${Lang.Menus.hamster} 0: ${Lang.Blocks.HAMSTER_sensor_right_proximity}`,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            hamster0leftFloor: {
                name: `${Lang.Menus.hamster} 0: ${Lang.Blocks.HAMSTER_sensor_left_floor}`,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            hamster0rightFloor: {
                name: `${Lang.Menus.hamster} 0: ${Lang.Blocks.HAMSTER_sensor_right_floor}`,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            hamster0accelerationX: {
                name: `${Lang.Menus.hamster} 0: ${Lang.Blocks.HAMSTER_sensor_acceleration_x}`,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            hamster0accelerationY: {
                name: `${Lang.Menus.hamster} 0: ${Lang.Blocks.HAMSTER_sensor_acceleration_y}`,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            hamster0accelerationZ: {
                name: `${Lang.Menus.hamster} 0: ${Lang.Blocks.HAMSTER_sensor_acceleration_z}`,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            hamster0light: {
                name: `${Lang.Menus.hamster} 0: ${Lang.Blocks.HAMSTER_sensor_light}`,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            hamster0temperature: {
                name: `${Lang.Menus.hamster} 0: ${Lang.Blocks.HAMSTER_sensor_temperature}`,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            hamster0inputA: {
                name: `${Lang.Menus.hamster} 0: ${Lang.Blocks.HAMSTER_sensor_input_a}`,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            hamster0inputB: {
                name: `${Lang.Menus.hamster} 0: ${Lang.Blocks.HAMSTER_sensor_input_b}`,
                type: 'input',
                pos: { x: 0, y: 0 },
            },

            turtle0colorNumber: {
                name: `${Lang.Menus.turtle} 0: ${Lang.Blocks.ROBOID_color_number}`,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            turtle0floor: {
                name: `${Lang.Menus.turtle} 0: ${Lang.Blocks.ROBOID_floor}`,
                type: 'input',
                pos: { x: 193, y: 342 },
            },
            turtle0button: {
                name: `${Lang.Menus.turtle} 0: ${Lang.Blocks.ROBOID_button}`,
                type: 'input',
                pos: { x: 290, y: 30 },
            },
            turtle0accelerationX: {
                name: `${Lang.Menus.turtle} 0: ${Lang.Blocks.ROBOID_acceleration_x}`,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            turtle0accelerationY: {
                name: `${Lang.Menus.turtle} 0: ${Lang.Blocks.ROBOID_acceleration_y}`,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            turtle0accelerationZ: {
                name: `${Lang.Menus.turtle} 0: ${Lang.Blocks.ROBOID_acceleration_z}`,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
        },
        mode: 'both',
    },
};

Entry.Roboid.setLanguage = () => ({
    ko: {
        template: {
            roboid_hamster_gripper: '햄스터 %1: 집게 %2 %3',
            roboid_hamster_release_gripper: '햄스터 %1: 집게 끄기 %2',
            roboid_hamster_boolean: '햄스터 %1: %2?',
            roboid_hamster_play_note: '햄스터 %1: %2 %3 음을 연주하기 %4',
            roboid_hamster_s_hand_found: '햄스터S %1: 손 찾음?',
            roboid_hamster_s_boolean: '햄스터S %1: %2?',
            roboid_hamster_s_value: '햄스터S %1: %2',
            roboid_hamster_s_move_forward_once: '햄스터S %1: 말판 앞으로 한 칸 이동하기 %2',
            roboid_hamster_s_turn_once: '햄스터S %1: 말판 %2 으로 한 번 돌기 %3',
            roboid_hamster_s_move_forward_unit: '햄스터S %1: 앞으로 %2 %3 이동하기 %4',
            roboid_hamster_s_move_backward_unit: '햄스터S %1: 뒤로 %2 %3 이동하기 %4',
            roboid_hamster_s_turn_unit_in_place: '햄스터S %1: %2 으로 %3 %4 제자리 돌기 %5',
            roboid_hamster_s_pivot_around_unit_in_direction:
                '햄스터S %1: %2 중심으로 %3 %4 %5 방향으로 돌기 %6',
            roboid_hamster_s_turn_unit_with_radius_in_direction:
                '햄스터S %1: %2 %3 으로 %4 %5 반지름 %6 cm를 %7 방향으로 돌기 %8',
            roboid_hamster_s_change_both_wheels_by:
                '햄스터S %1: 왼쪽 바퀴 %2 오른쪽 바퀴 %3 만큼 바꾸기 %4',
            roboid_hamster_s_set_both_wheels_to:
                '햄스터S %1: 왼쪽 바퀴 %2 오른쪽 바퀴 %3 (으)로 정하기 %4',
            roboid_hamster_s_change_wheel_by: '햄스터S %1: %2 바퀴 %3 만큼 바꾸기 %4',
            roboid_hamster_s_set_wheel_to: '햄스터S %1: %2 바퀴 %3 (으)로 정하기 %4',
            roboid_hamster_s_follow_line_using: '햄스터S %1: %2 선을 %3 바닥 센서로 따라가기 %4',
            roboid_hamster_s_follow_line_until:
                '햄스터S %1: %2 선을 따라 %3 교차로까지 이동하기 %4',
            roboid_hamster_s_set_following_speed_to:
                '햄스터S %1: 선 따라가기 속도를 %2 (으)로 정하기 %3',
            roboid_hamster_s_set_following_gain_to:
                '햄스터S %1: 선 따라가기 방향 변화량을 %2 (으)로 정하기 %3',
            roboid_hamster_s_stop: '햄스터S %1: 정지하기 %2',
            roboid_hamster_s_set_led_to: '햄스터S %1: %2 LED를 %3 으로 정하기 %4',
            roboid_hamster_s_pick_led: '햄스터S %1: %2 LED를 %3로 정하기 %4',
            roboid_hamster_s_change_led_by_rgb:
                '햄스터S %1: %2 LED를 R: %3 G: %4 B: %5 만큼 바꾸기 %6',
            roboid_hamster_s_set_led_to_rgb:
                '햄스터S %1: %2 LED를 R: %3 G: %4 B: %5 (으)로 정하기 %6',
            roboid_hamster_s_clear_led: '햄스터S %1: %2 LED 끄기 %3',
            roboid_hamster_s_play_sound_times: '햄스터S %1: %2 소리 %3 번 재생하기 %4',
            roboid_hamster_s_play_sound_times_until_done:
                '햄스터S %1: %2 소리 %3 번 재생하고 기다리기 %4',
            roboid_hamster_s_change_buzzer_by: '햄스터S %1: 버저 음을 %2 만큼 바꾸기 %3',
            roboid_hamster_s_set_buzzer_to: '햄스터S %1: 버저 음을 %2 (으)로 정하기 %3',
            roboid_hamster_s_clear_sound: '햄스터S %1: 소리 끄기 %2',
            roboid_hamster_s_play_note: '햄스터S %1: %2 %3 음을 연주하기 %4',
            roboid_hamster_s_play_note_for: '햄스터S %1: %2 %3 음을 %4 박자 연주하기 %5',
            roboid_hamster_s_rest_for: '햄스터S %1: %2 박자 쉬기 %3',
            roboid_hamster_s_change_tempo_by: '햄스터S %1: 연주 속도를 %2 만큼 바꾸기 %3',
            roboid_hamster_s_set_tempo_to: '햄스터S %1: 연주 속도를 %2 BPM으로 정하기 %3',
            roboid_hamster_s_set_port_to: '햄스터S %1: 포트 %2 를 %3 으로 정하기 %4',
            roboid_hamster_s_change_output_by: '햄스터S %1: 출력 %2 를 %3 만큼 바꾸기 %4',
            roboid_hamster_s_set_output_to: '햄스터S %1: 출력 %2 를 %3 (으)로 정하기 %4',
            roboid_hamster_s_gripper: '햄스터S %1: 집게 %2 %3',
            roboid_hamster_s_release_gripper: '햄스터S %1: 집게 끄기 %2',
            roboid_hamster_s_write_serial: '햄스터S %1: 시리얼 %2 %3 쓰기 %4',
            roboid_hamster_s_read_serial_until: '햄스터S %1: 시리얼 %2 읽기 %3',
            roboid_hamster_s_set_serial_rate_to: '햄스터S %1: 시리얼 속도를 %2 Bd로 정하기 %3',
            roboid_turtle_button_state: '거북이 %1: 버튼을 %2 ?',
            roboid_turtle_change_buzzer_by: '거북이 %1: 버저 음을 %2 만큼 바꾸기 %3',
            roboid_turtle_change_head_led_by_rgb:
                '거북이 %1: 머리 LED를 R: %2 G: %3 B: %4 만큼 바꾸기 %5',
            roboid_turtle_change_tempo_by: '거북이 %1: 연주 속도를 %2 만큼 바꾸기 %3',
            roboid_turtle_change_wheel_by: '거북이 %1: %2 바퀴 %3 만큼 바꾸기 %4',
            roboid_turtle_change_wheels_by_left_right:
                '거북이 %1: 왼쪽 바퀴 %2 오른쪽 바퀴 %3 만큼 바꾸기 %4',
            roboid_turtle_clear_head_led: '거북이 %1: 머리 LED 끄기 %2',
            roboid_turtle_clear_sound: '거북이 %1: 소리 끄기 %2',
            roboid_turtle_cross_intersection: '거북이 %1: 검은색 교차로 건너가기 %2',
            roboid_turtle_follow_line: '거북이 %1: %2 선을 따라가기 %3',
            roboid_turtle_follow_line_until: '거북이 %1: 검은색 선을 따라 %2 까지 이동하기 %3',
            roboid_turtle_follow_line_until_black: '거북이 %1: %2 선을 따라 검은색까지 이동하기 %3',
            roboid_turtle_is_color_pattern: '거북이 %1: 색깔 패턴이 %2 %3 인가?',
            roboid_turtle_move_backward_unit: '거북이 %1: 뒤로 %2 %3 이동하기 %4',
            roboid_turtle_move_forward_unit: '거북이 %1: 앞으로 %2 %3 이동하기 %4',
            roboid_turtle_pivot_around_wheel_unit_in_direction:
                '거북이 %1: %2 바퀴 중심으로 %3 %4 %5 방향으로 돌기 %6',
            roboid_turtle_play_note: '거북이 %1: %2 %3 음을 연주하기 %4',
            roboid_turtle_play_note_for_beats: '거북이 %1: %2 %3 음을 %4 박자 연주하기 %5',
            roboid_turtle_play_sound_times: '거북이 %1: %2 소리 %3 번 재생하기 %4',
            roboid_turtle_play_sound_times_until_done:
                '거북이 %1: %2 소리 %3 번 재생하고 기다리기 %4',
            roboid_turtle_rest_for_beats: '거북이 %1: %2 박자 쉬기 %3',
            roboid_turtle_set_buzzer_to: '거북이 %1: 버저 음을 %2 (으)로 정하기 %3',
            roboid_turtle_set_following_speed_to:
                '거북이 %1: 선 따라가기 속도를 %2 (으)로 정하기 %3',
            roboid_turtle_set_head_led_to: '거북이 %1: 머리 LED를 %2 으로 정하기 %3',
            roboid_turtle_set_head_led_to_rgb:
                '거북이 %1: 머리 LED를 R: %2 G: %3 B: %4 (으)로 정하기 %5',
            roboid_turtle_set_tempo_to: '거북이 %1: 연주 속도를 %2 BPM으로 정하기 %3',
            roboid_turtle_set_wheel_to: '거북이 %1: %2 바퀴 %3 (으)로 정하기 %4',
            roboid_turtle_set_wheels_to_left_right:
                '거북이 %1: 왼쪽 바퀴 %2 오른쪽 바퀴 %3 (으)로 정하기 %4',
            roboid_turtle_stop: '거북이 %1: 정지하기 %2',
            roboid_turtle_touching_color: '거북이 %1: %2 에 닿았는가?',
            roboid_turtle_turn_at_intersection: '거북이 %1: 검은색 교차로에서 %2 으로 돌기 %3',
            roboid_turtle_turn_unit_in_place: '거북이 %1: %2 으로 %3 %4 제자리 돌기 %5',
            roboid_turtle_turn_unit_with_radius_in_direction:
                '거북이 %1: %2 으로 %3 %4 반지름 %5 cm를 %6 방향으로 돌기 %7',
            roboid_turtle_value: '거북이 %1: %2',
            roboid_turtle_boolean: '거북이 %1: %2?',
            roboid_turtle_pick_head_led: '거북이 %1: 머리 LED를 %2로 정하기 %3',
        },
        Helper: {
            roboid_hamster_gripper: '집게를 열거나 닫습니다.',
            roboid_hamster_release_gripper: '집게의 전원을 끄고 자유롭게 움직일 수 있도록 합니다.',
            roboid_hamster_boolean:
                "앞으로 기울임: 앞으로 기울이면 '참'으로 판단하고, 아니면 '거짓'으로 판단합니다.<br/>뒤로 기울임: 뒤로 기울이면 '참'으로 판단하고, 아니면 '거짓'으로 판단합니다.<br/>왼쪽으로 기울임: 왼쪽으로 기울이면 '참'으로 판단하고, 아니면 '거짓'으로 판단합니다.<br/>오른쪽으로 기울임: 오른쪽으로 기울이면 '참'으로 판단하고, 아니면 '거짓'으로 판단합니다.<br/>거꾸로 뒤집음: 거꾸로 뒤집으면 '참'으로 판단하고, 아니면 '거짓'으로 판단합니다.<br/>기울이지 않음: 기울이지 않으면 '참'으로 판단하고, 아니면 '거짓'으로 판단합니다.<br/>배터리 정상: 배터리 잔량이 충분하면 '참'으로 판단하고, 아니면 '거짓'으로 판단합니다.<br/>배터리 부족: 배터리 잔량이 부족하면 '참'으로 판단하고, 아니면 '거짓'으로 판단합니다.<br/>배터리 없음: 배터리 잔량이 없으면 '참'으로 판단하고, 아니면 '거짓'으로 판단합니다.",
            roboid_hamster_play_note: '선택한 계이름과 옥타브의 음을 소리 냅니다.',
            roboid_hamster_s_hand_found:
                "근접 센서 앞에 손 또는 물체가 있으면 '참'으로 판단하고, 아니면 '거짓'으로 판단합니다.",
            roboid_hamster_s_boolean:
                "앞으로 기울임: 앞으로 기울이면 '참'으로 판단하고, 아니면 '거짓'으로 판단합니다.<br/>뒤로 기울임: 뒤로 기울이면 '참'으로 판단하고, 아니면 '거짓'으로 판단합니다.<br/>왼쪽으로 기울임: 왼쪽으로 기울이면 '참'으로 판단하고, 아니면 '거짓'으로 판단합니다.<br/>오른쪽으로 기울임: 오른쪽으로 기울이면 '참'으로 판단하고, 아니면 '거짓'으로 판단합니다.<br/>거꾸로 뒤집음: 거꾸로 뒤집으면 '참'으로 판단하고, 아니면 '거짓'으로 판단합니다.<br/>기울이지 않음: 기울이지 않으면 '참'으로 판단하고, 아니면 '거짓'으로 판단합니다.<br/>배터리 정상: 배터리 잔량이 충분하면 '참'으로 판단하고, 아니면 '거짓'으로 판단합니다.<br/>배터리 부족: 배터리 잔량이 부족하면 '참'으로 판단하고, 아니면 '거짓'으로 판단합니다.<br/>배터리 없음: 배터리 잔량이 없으면 '참'으로 판단하고, 아니면 '거짓'으로 판단합니다.",
            roboid_hamster_s_value:
                '왼쪽 근접 센서: 왼쪽 근접 센서의 값 (값의 범위: 0 ~ 255, 초기값: 0)<br/>오른쪽 근접 센서: 오른쪽 근접 센서의 값 (값의 범위: 0 ~ 255, 초기값: 0)<br/>왼쪽 바닥 센서: 왼쪽 바닥 센서의 값 (값의 범위: 0 ~ 100, 초기값: 0)<br/>오른쪽 바닥 센서: 오른쪽 바닥 센서의 값 (값의 범위: 0 ~ 100, 초기값: 0)<br/>x축 가속도: 가속도 센서의 X축 값 (값의 범위: -32768 ~ 32767, 초기값: 0) 로봇이 전진하는 방향이 X축의 양수 방향입니다.<br/>y축 가속도: 가속도 센서의 Y축 값 (값의 범위: -32768 ~ 32767, 초기값: 0) 로봇의 왼쪽 방향이 Y축의 양수 방향입니다.<br/>z축 가속도: 가속도 센서의 Z축 값 (값의 범위: -32768 ~ 32767, 초기값: 0) 로봇의 위쪽 방향이 Z축의 양수 방향입니다.<br/>밝기: 밝기 센서의 값 (값의 범위: 0 ~ 65535, 초기값: 0) 밝을 수록 값이 커집니다.<br/>온도: 로봇 내부의 온도 값 (값의 범위: 섭씨 -40 ~ 88도, 초기값: 0)<br/>신호 세기: 블루투스 무선 통신의 신호 세기 (값의 범위: -128 ~ 0 dBm, 초기값: 0) 신호의 세기가 셀수록 값이 커집니다.<br/>입력 A: 외부 확장 포트 A로 입력되는 신호의 값 (값의 범위: 아날로그 입력 0 ~ 255, 디지털 입력 0 또는 1, 초기값: 0)<br/>입력 B: 외부 확장 포트 B로 입력되는 신호의 값 (값의 범위: 아날로그 입력 0 ~ 255, 디지털 입력 0 또는 1, 초기값: 0)',
            roboid_hamster_s_move_forward_once: '말판 위에서 한 칸 앞으로 이동합니다.',
            roboid_hamster_s_turn_once:
                '말판 위에서 왼쪽/오른쪽 방향으로 제자리에서 90도 회전합니다.',
            roboid_hamster_s_move_forward_unit:
                '입력한 거리(cm)/시간(초)/펄스만큼 앞으로 이동합니다.',
            roboid_hamster_s_move_backward_unit:
                '입력한 거리(cm)/시간(초)/펄스만큼 뒤로 이동합니다.',
            roboid_hamster_s_turn_unit_in_place:
                '입력한 각도(도)/시간(초)/펄스만큼 왼쪽/오른쪽 방향으로 제자리에서 회전합니다.',
            roboid_hamster_s_pivot_around_unit_in_direction:
                '왼쪽/오른쪽 펜/바퀴 중심으로 입력한 각도(도)/시간(초)/펄스만큼 앞쪽/뒤쪽 방향으로 회전합니다.',
            roboid_hamster_s_turn_unit_with_radius_in_direction:
                '왼쪽/오른쪽 펜이 입력한 반지름의 원을 왼쪽/오른쪽에 그리면서 입력한 각도(도)/시간(초)/펄스만큼 앞쪽/뒤쪽 방향으로 회전합니다.',
            roboid_hamster_s_change_both_wheels_by:
                '왼쪽과 오른쪽 바퀴의 현재 속도 값(%)에 입력한 값을 각각 더합니다. 더한 결과가 양수 값이면 바퀴가 앞으로 회전하고, 음수 값이면 뒤로 회전합니다.',
            roboid_hamster_s_set_both_wheels_to:
                '왼쪽과 오른쪽 바퀴의 속도를 입력한 값(-100 ~ 100%)으로 각각 설정합니다. 양수 값을 입력하면 바퀴가 앞으로 회전하고, 음수 값을 입력하면 뒤로 회전합니다. 숫자 0을 입력하면 정지합니다.',
            roboid_hamster_s_change_wheel_by:
                '왼쪽/오른쪽/양쪽 바퀴의 현재 속도 값(%)에 입력한 값을 더합니다. 더한 결과가 양수 값이면 바퀴가 앞으로 회전하고, 음수 값이면 뒤로 회전합니다.',
            roboid_hamster_s_set_wheel_to:
                '왼쪽/오른쪽/양쪽 바퀴의 속도를 입력한 값(-100 ~ 100%)으로 설정합니다. 양수 값을 입력하면 바퀴가 앞으로 회전하고, 음수 값을 입력하면 뒤로 회전합니다. 숫자 0을 입력하면 정지합니다.',
            roboid_hamster_s_follow_line_using:
                '왼쪽/오른쪽/양쪽 바닥 센서를 사용하여 검은색/하얀색 선을 따라 이동합니다.',
            roboid_hamster_s_follow_line_until:
                '왼쪽/오른쪽/앞쪽/뒤쪽의 검은색/하얀색 선을 따라 이동하다가 교차로를 만나면 정지합니다.',
            roboid_hamster_s_set_following_speed_to:
                '선을 따라 이동하는 속도(1 ~ 8)를 설정합니다. 숫자가 클수록 이동하는 속도가 빠릅니다.',
            roboid_hamster_s_set_following_gain_to:
                '선을 따라 이동하는 방향 변화량(1 ~ 8)을 설정합니다. 숫자가 클수록 급커브를 잘 따라가지만 직선에서 좌우로 더 흔들립니다.',
            roboid_hamster_s_stop: '양쪽 바퀴를 정지합니다.',
            roboid_hamster_s_set_led_to: '왼쪽/오른쪽/양쪽 LED를 선택한 색깔로 켭니다.',
            roboid_hamster_s_pick_led: '왼쪽/오른쪽/양쪽 LED를 선택한 색깔로 켭니다.',
            roboid_hamster_s_change_led_by_rgb:
                '왼쪽/오른쪽/양쪽 LED의 현재 R, G, B 값에 입력한 값을 각각 더합니다.',
            roboid_hamster_s_set_led_to_rgb:
                '왼쪽/오른쪽/양쪽 LED의 R, G, B 값을 입력한 값으로 각각 설정합니다.',
            roboid_hamster_s_clear_led: '왼쪽/오른쪽/양쪽 LED를 끕니다.',
            roboid_hamster_s_play_sound_times: '선택한 소리를 입력한 횟수만큼 재생합니다.',
            roboid_hamster_s_play_sound_times_until_done:
                '선택한 소리를 입력한 횟수만큼 재생하고, 재생이 완료될 때까지 기다립니다.',
            roboid_hamster_s_change_buzzer_by:
                '버저 소리의 현재 음 높이(Hz)에 입력한 값을 더합니다. 소수점 둘째 자리까지 입력할 수 있습니다.',
            roboid_hamster_s_set_buzzer_to:
                '버저 소리의 음 높이를 입력한 값(Hz)으로 설정합니다. 소수점 둘째 자리까지 입력할 수 있습니다. 숫자 0을 입력하면 버저 소리를 끕니다.',
            roboid_hamster_s_clear_sound: '소리를 끕니다.',
            roboid_hamster_s_play_note: '선택한 계이름과 옥타브의 음을 소리 냅니다.',
            roboid_hamster_s_play_note_for:
                '선택한 계이름과 옥타브의 음을 입력한 박자만큼 소리 냅니다.',
            roboid_hamster_s_rest_for: '입력한 박자만큼 쉽니다.',
            roboid_hamster_s_change_tempo_by:
                '연주하거나 쉬는 속도의 현재 BPM(분당 박자 수)에 입력한 값을 더합니다.',
            roboid_hamster_s_set_tempo_to:
                '연주하거나 쉬는 속도를 입력한 BPM(분당 박자 수)으로 설정합니다.',
            roboid_hamster_s_set_port_to:
                '선택한 외부 확장 포트의 입출력 모드를 선택한 모드로 설정합니다.',
            roboid_hamster_s_change_output_by:
                '선택한 외부 확장 포트의 현재 출력 값에 입력한 값을 더합니다. 더한 결과는 외부 확장 포트의 모드에 따라 다음의 범위를 가집니다.<br/>서보 출력: 유효한 값의 범위는 1 ~ 180도, 0이면 PWM 펄스 없이 항상 0을 출력<br/>PWM 출력: 0 ~ 100%, PWM 파형에서 ON 상태의 듀티비(%)<br/>디지털 출력: 0이면 LOW, 0이 아니면 HIGH',
            roboid_hamster_s_set_output_to:
                '선택한 외부 확장 포트의 출력 값을 입력한 값으로 설정합니다. 입력하는 값은 외부 확장 포트의 모드에 따라 다음의 범위를 가집니다.<br/>서보 출력: 유효한 값의 범위는 1 ~ 180도, 0이면 PWM 펄스 없이 항상 0을 출력<br/>PWM 출력: 0 ~ 100%, PWM 파형에서 ON 상태의 듀티비(%)<br/>디지털 출력: 0이면 LOW, 0이 아니면 HIGH',
            roboid_hamster_s_gripper: '집게를 열거나 닫습니다.',
            roboid_hamster_s_release_gripper:
                '집게의 전원을 끄고 자유롭게 움직일 수 있도록 합니다.',
            roboid_hamster_s_write_serial: '시리얼 통신으로 글자를 전송합니다.',
            roboid_hamster_s_read_serial_until: '시리얼 통신으로 받은 글자를 읽습니다.',
            roboid_hamster_s_set_serial_rate_to: '시리얼 통신의 속도를 설정합니다.',
            roboid_turtle_button_state:
                "등 버튼을 클릭했으면/더블클릭했으면/길게 눌렀으면 '참'으로 판단하고, 아니면 '거짓'으로 판단합니다.",
            roboid_turtle_change_buzzer_by:
                '버저 소리의 현재 음 높이(Hz)에 입력한 값을 더합니다. 소수점 둘째 자리까지 입력할 수 있습니다.',
            roboid_turtle_change_head_led_by_rgb:
                '머리 LED의 현재 R, G, B 값에 입력한 값을 각각 더합니다.',
            roboid_turtle_change_tempo_by:
                '연주하거나 쉬는 속도의 현재 BPM(분당 박자 수)에 입력한 값을 더합니다.',
            roboid_turtle_change_wheel_by:
                '왼쪽/오른쪽/양쪽 바퀴의 현재 속도 값(%)에 입력한 값을 더합니다. 더한 결과가 양수 값이면 바퀴가 앞으로 회전하고, 음수 값이면 뒤로 회전합니다.',
            roboid_turtle_change_wheels_by_left_right:
                '왼쪽과 오른쪽 바퀴의 현재 속도 값(%)에 입력한 값을 각각 더합니다. 더한 결과가 양수 값이면 바퀴가 앞으로 회전하고, 음수 값이면 뒤로 회전합니다.',
            roboid_turtle_clear_head_led: '머리 LED를 끕니다.',
            roboid_turtle_clear_sound: '소리를 끕니다.',
            roboid_turtle_cross_intersection:
                '검은색 교차로에서 잠시 앞으로 이동한 후 검은색 선을 찾아 다시 이동합니다.',
            roboid_turtle_follow_line: '하얀색 바탕 위에서 선택한 색깔의 선을 따라 이동합니다.',
            roboid_turtle_follow_line_until:
                '하얀색 바탕 위에서 검은색 선을 따라 이동하다가 선택한 색깔을 컬러 센서가 감지하면 정지합니다.',
            roboid_turtle_follow_line_until_black:
                '하얀색 바탕 위에서 선택한 색깔의 선을 따라 이동하다가 컬러 센서가 검은색을 감지하면 정지합니다.',
            roboid_turtle_is_color_pattern:
                "선택한 색깔 패턴을 컬러 센서가 감지하였으면 '참'으로 판단하고, 아니면 '거짓'으로 판단합니다.",
            roboid_turtle_move_backward_unit: '입력한 거리(cm)/시간(초)/펄스만큼 뒤로 이동합니다.',
            roboid_turtle_move_forward_unit: '입력한 거리(cm)/시간(초)/펄스만큼 앞으로 이동합니다.',
            roboid_turtle_pivot_around_wheel_unit_in_direction:
                '왼쪽/오른쪽 바퀴 중심으로 입력한 각도(도)/시간(초)/펄스만큼 머리/꼬리 방향으로 회전합니다.',
            roboid_turtle_play_note: '선택한 계이름과 옥타브의 음을 계속 소리 냅니다.',
            roboid_turtle_play_note_for_beats:
                '선택한 계이름과 옥타브의 음을 입력한 박자만큼 소리 냅니다.',
            roboid_turtle_play_sound_times: '선택한 소리를 입력한 횟수만큼 재생합니다.',
            roboid_turtle_play_sound_times_until_done:
                '선택한 소리를 입력한 횟수만큼 재생하고, 재생이 완료될 때까지 기다립니다.',
            roboid_turtle_rest_for_beats: '입력한 박자만큼 쉽니다.',
            roboid_turtle_set_buzzer_to:
                '버저 소리의 음 높이를 입력한 값(Hz)으로 설정합니다. 소수점 둘째 자리까지 입력할 수 있습니다. 숫자 0을 입력하면 소리를 끕니다.',
            roboid_turtle_set_following_speed_to:
                '선을 따라 이동하는 속도(1 ~ 8)를 설정합니다. 숫자가 클수록 이동하는 속도가 빠릅니다.',
            roboid_turtle_set_head_led_to: '머리 LED를 선택한 색깔로 켭니다.',
            roboid_turtle_set_head_led_to_rgb:
                '머리 LED의 R, G, B 값을 입력한 값으로 각각 설정합니다.',
            roboid_turtle_set_tempo_to:
                '연주하거나 쉬는 속도를 입력한 BPM(분당 박자 수)으로 설정합니다.',
            roboid_turtle_set_wheel_to:
                '왼쪽/오른쪽/양쪽 바퀴의 속도를 입력한 값(-400 ~ 400%)으로 설정합니다. 양수 값을 입력하면 바퀴가 앞으로 회전하고, 음수 값을 입력하면 뒤로 회전합니다. 숫자 0을 입력하면 정지합니다.',
            roboid_turtle_set_wheels_to_left_right:
                '왼쪽과 오른쪽 바퀴의 속도를 입력한 값(-400 ~ 400%)으로 각각 설정합니다. 양수 값을 입력하면 바퀴가 앞으로 회전하고, 음수 값을 입력하면 뒤로 회전합니다. 숫자 0을 입력하면 정지합니다.',
            roboid_turtle_stop: '양쪽 바퀴를 정지합니다.',
            roboid_turtle_touching_color:
                "선택한 색깔을 컬러 센서가 감지하였으면 '참'으로 판단하고, 아니면 '거짓'으로 판단합니다.",
            roboid_turtle_turn_at_intersection:
                '검은색 교차로에서 잠시 앞으로 이동한 후 제자리에서 왼쪽/오른쪽/뒤쪽으로 회전하고 검은색 선을 찾아 다시 이동합니다.',
            roboid_turtle_turn_unit_in_place:
                '입력한 각도(도)/시간(초)/펄스만큼 왼쪽/오른쪽 방향으로 제자리에서 회전합니다.',
            roboid_turtle_turn_unit_with_radius_in_direction:
                '입력한 반지름의 원을 그리면서 입력한 각도(도)/시간(초)/펄스만큼 왼쪽/오른쪽, 머리/꼬리 방향으로 회전합니다.',
            roboid_turtle_value:
                '색깔 번호: 컬러 센서가 감지한 색깔의 번호 (값의 범위: -1 ~ 8, 초기값: -1)<br/>색깔 패턴: 컬러 센서가 감지한 색깔 패턴의 값 (값의 범위: -1 ~ 88, 초기값: -1)<br/>바닥 센서: 바닥 센서의 값 (값의 범위: 0 ~ 100, 초기값: 0)<br/>버튼: 거북이 등 버튼의 상태 값 (누르면 1, 아니면 0, 초기값: 0)<br/>x축 가속도: 가속도 센서의 X축 값 (값의 범위: -32768 ~ 32767, 초기값: 0) 로봇이 전진하는 방향이 X축의 양수 방향입니다.<br/>y축 가속도: 가속도 센서의 Y축 값 (값의 범위: -32768 ~ 32767, 초기값: 0) 로봇의 왼쪽 방향이 Y축의 양수 방향입니다.<br/>z축 가속도: 가속도 센서의 Z축 값 (값의 범위: -32768 ~ 32767, 초기값: 0) 로봇의 위쪽 방향이 Z축의 양수 방향입니다.',
            roboid_turtle_boolean:
                "앞으로 기울임: 앞으로 기울이면 '참'으로 판단하고, 아니면 '거짓'으로 판단합니다.<br/>뒤로 기울임: 뒤로 기울이면 '참'으로 판단하고, 아니면 '거짓'으로 판단합니다.<br/>왼쪽으로 기울임: 왼쪽으로 기울이면 '참'으로 판단하고, 아니면 '거짓'으로 판단합니다.<br/>오른쪽으로 기울임: 오른쪽으로 기울이면 '참'으로 판단하고, 아니면 '거짓'으로 판단합니다.<br/>거꾸로 뒤집음: 거꾸로 뒤집으면 '참'으로 판단하고, 아니면 '거짓'으로 판단합니다.<br/>기울이지 않음: 기울이지 않으면 '참'으로 판단하고, 아니면 '거짓'으로 판단합니다.<br/>배터리 정상: 배터리 잔량이 충분하면 '참'으로 판단하고, 아니면 '거짓'으로 판단합니다.<br/>배터리 부족: 배터리 잔량이 부족하면 '참'으로 판단하고, 아니면 '거짓'으로 판단합니다.<br/>배터리 없음: 배터리 잔량이 없으면 '참'으로 판단하고, 아니면 '거짓'으로 판단합니다.",
            roboid_turtle_pick_head_led: '머리 LED를 선택한 색깔로 켭니다.',
        },
        Blocks: {
            hamster_note_c: '도',
            hamster_note_c_sharp: '도♯(레♭)',
            hamster_note_d: '레',
            hamster_note_d_sharp: '레♯(미♭)',
            hamster_note_e: '미',
            hamster_note_f: '파',
            hamster_note_f_sharp: '파♯(솔♭)',
            hamster_note_g: '솔',
            hamster_note_g_sharp: '솔♯(라♭)',
            hamster_note_a: '라',
            hamster_note_a_sharp: '라♯(시♭)',
            hamster_note_b: '시',
            hamster_tilt_forward: '앞으로 기울임',
            hamster_tilt_backward: '뒤로 기울임',
            hamster_tilt_left: '왼쪽으로 기울임',
            hamster_tilt_right: '오른쪽으로 기울임',
            hamster_tilt_flip: '거꾸로 뒤집음',
            hamster_tilt_not: '기울이지 않음',
            hamster_battery_normal: '배터리 정상',
            hamster_battery_low: '배터리 부족',
            hamster_battery_empty: '배터리 없음',
            hamster_open_gripper: '열기',
            hamster_close_gripper: '닫기',
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
            turtle_acceleration_x: 'x축 가속도',
            turtle_acceleration_y: 'y축 가속도',
            turtle_acceleration_z: 'z축 가속도',
            turtle_back: '뒤쪽',
            turtle_both: '양쪽',
            turtle_button: '버튼',
            turtle_buzzer: '버저',
            turtle_clicked: '클릭했는가',
            turtle_color_any: '아무 색',
            turtle_color_black: '검은색',
            turtle_color_blue: '파란색',
            turtle_color_green: '초록색',
            turtle_color_number: '색깔 번호',
            turtle_color_orange: '주황색',
            turtle_color_pattern: '색깔 패턴',
            turtle_color_purple: '자주색',
            turtle_color_red: '빨간색',
            turtle_color_sky_blue: '하늘색',
            turtle_color_violet: '보라색',
            turtle_color_white: '하얀색',
            turtle_color_yellow: '노란색',
            turtle_double_clicked: '더블클릭했는가',
            turtle_floor: '바닥 센서',
            turtle_head: '머리',
            turtle_head_color: '머리 색깔',
            turtle_left: '왼쪽',
            turtle_left_wheel: '왼쪽 바퀴',
            turtle_long_pressed: '길게~눌렀는가',
            turtle_note: '음표',
            turtle_right: '오른쪽',
            turtle_right_wheel: '오른쪽 바퀴',
            turtle_sound_beep: '삐',
            turtle_sound_birthday: '생일',
            turtle_sound_dibidibidip: '디비디비딥',
            turtle_sound_engine: '엔진',
            turtle_sound_good_job: '잘 했어요',
            turtle_sound_march: '행진',
            turtle_sound_random_beep: '무작위 삐',
            turtle_sound_robot: '로봇',
            turtle_sound_siren: '사이렌',
            turtle_tail: '꼬리',
            turtle_unit_cm: 'cm',
            turtle_unit_deg: '도',
            turtle_unit_pulse: '펄스',
            turtle_unit_sec: '초',
            turtle_note_c: '도',
            turtle_note_c_sharp: '도♯(레♭)',
            turtle_note_d: '레',
            turtle_note_d_sharp: '레♯(미♭)',
            turtle_note_e: '미',
            turtle_note_f: '파',
            turtle_note_f_sharp: '파♯(솔♭)',
            turtle_note_g: '솔',
            turtle_note_g_sharp: '솔♯(라♭)',
            turtle_note_a: '라',
            turtle_note_a_sharp: '라♯(시♭)',
            turtle_note_b: '시',
            turtle_tilt_forward: '앞으로 기울임',
            turtle_tilt_backward: '뒤로 기울임',
            turtle_tilt_left: '왼쪽으로 기울임',
            turtle_tilt_right: '오른쪽으로 기울임',
            turtle_tilt_flip: '거꾸로 뒤집음',
            turtle_tilt_not: '기울이지 않음',
            turtle_battery_normal: '배터리 정상',
            turtle_battery_low: '배터리 부족',
            turtle_battery_empty: '배터리 없음',
        },
    },
    en: {
        template: {
            roboid_hamster_gripper: 'Hamster %1: %2 gripper %3',
            roboid_hamster_release_gripper: 'Hamster %1: release gripper %2',
            roboid_hamster_boolean: 'Hamster %1: %2?',
            roboid_hamster_play_note: 'Hamster %1: play note %2 %3 %4',
            roboid_hamster_s_hand_found: 'HamsterS %1: hand found?',
            roboid_hamster_s_boolean: 'HamsterS %1: %2?',
            roboid_hamster_s_value: 'HamsterS %1: %2',
            roboid_hamster_s_move_forward_once: 'HamsterS %1: move forward once on board %2',
            roboid_hamster_s_turn_once: 'HamsterS %1: turn %2 once on board %3',
            roboid_hamster_s_move_forward_unit: 'HamsterS %1: move forward %2 %3 %4',
            roboid_hamster_s_move_backward_unit: 'HamsterS %1: move backward %2 %3 %4',
            roboid_hamster_s_turn_unit_in_place: 'HamsterS %1: turn %2 %3 %4 in place %5',
            roboid_hamster_s_pivot_around_unit_in_direction:
                'HamsterS %1: pivot around %2 %3 %4 in %5 direction %6',
            roboid_hamster_s_turn_unit_with_radius_in_direction:
                'HamsterS %1: %2 turn %3 %4 %5 with radius %6 cm in %7 direction %8',
            roboid_hamster_s_change_both_wheels_by:
                'HamsterS %1: change wheels by left: %2 right: %3 %4',
            roboid_hamster_s_set_both_wheels_to: 'HamsterS %1: set wheels to left: %2 right: %3 %4',
            roboid_hamster_s_change_wheel_by: 'HamsterS %1: change %2 wheel by %3 %4',
            roboid_hamster_s_set_wheel_to: 'HamsterS %1: set %2 wheel to %3 %4',
            roboid_hamster_s_follow_line_using:
                'HamsterS %1: follow %2 line using %3 floor sensor %4',
            roboid_hamster_s_follow_line_until:
                'HamsterS %1: follow %2 line until %3 intersection %4',
            roboid_hamster_s_set_following_speed_to: 'HamsterS %1: set following speed to %2 %3',
            roboid_hamster_s_set_following_gain_to:
                'HamsterS %1: set following directional variation to %2 %3',
            roboid_hamster_s_stop: 'HamsterS %1: stop %2',
            roboid_hamster_s_set_led_to: 'HamsterS %1: set %2 led to %3 %4',
            roboid_hamster_s_pick_led: 'HamsterS %1: set %2 led to %3 %4',
            roboid_hamster_s_change_led_by_rgb:
                'HamsterS %1: change %2 led by r: %3 g: %4 b: %5 %6',
            roboid_hamster_s_set_led_to_rgb: 'HamsterS %1: set %2 led to r: %3 g: %4 b: %5 %6',
            roboid_hamster_s_clear_led: 'HamsterS %1: clear %2 led %3',
            roboid_hamster_s_play_sound_times: 'HamsterS %1: play sound %2 %3 times %4',
            roboid_hamster_s_play_sound_times_until_done:
                'HamsterS %1: play sound %2 %3 times until done %4',
            roboid_hamster_s_change_buzzer_by: 'HamsterS %1: change buzzer by %2 %3',
            roboid_hamster_s_set_buzzer_to: 'HamsterS %1: set buzzer to %2 %3',
            roboid_hamster_s_clear_sound: 'HamsterS %1: clear sound %2',
            roboid_hamster_s_play_note: 'HamsterS %1: play note %2 %3 %4',
            roboid_hamster_s_play_note_for: 'HamsterS %1: play note %2 %3 for %4 beats %5',
            roboid_hamster_s_rest_for: 'HamsterS %1: rest for %2 beats %3',
            roboid_hamster_s_change_tempo_by: 'HamsterS %1: change tempo by %2 %3',
            roboid_hamster_s_set_tempo_to: 'HamsterS %1: set tempo to %2 bpm %3',
            roboid_hamster_s_set_port_to: 'HamsterS %1: set port %2 to %3 %4',
            roboid_hamster_s_change_output_by: 'HamsterS %1: change output %2 by %3 %4',
            roboid_hamster_s_set_output_to: 'HamsterS %1: set output %2 to %3 %4',
            roboid_hamster_s_gripper: 'HamsterS %1: %2 gripper %3',
            roboid_hamster_s_release_gripper: 'HamsterS %1: release gripper %2',
            roboid_hamster_s_write_serial: 'HamsterS %1: write %2 %3 to serial %4',
            roboid_hamster_s_read_serial_until: 'HamsterS %1: read serial %2 %3',
            roboid_hamster_s_set_serial_rate_to: 'HamsterS %1: set serial rate to %2 Bd %3',
            roboid_turtle_button_state: 'Turtle %1: button %2 ?',
            roboid_turtle_change_buzzer_by: 'Turtle %1: change buzzer by %2 %3',
            roboid_turtle_change_head_led_by_rgb:
                'Turtle %1: change head led by r: %2 g: %3 b: %4 %5',
            roboid_turtle_change_tempo_by: 'Turtle %1: change tempo by %2 %3',
            roboid_turtle_change_wheel_by: 'Turtle %1: change %2 wheel by %3 %4',
            roboid_turtle_change_wheels_by_left_right:
                'Turtle %1: change wheels by left: %2 right: %3 %4',
            roboid_turtle_clear_head_led: 'Turtle %1: clear head led %2',
            roboid_turtle_clear_sound: 'Turtle %1: clear sound %2',
            roboid_turtle_cross_intersection: 'Turtle %1: cross black intersection %2',
            roboid_turtle_follow_line: 'Turtle %1: follow %2 line %3',
            roboid_turtle_follow_line_until: 'Turtle %1: follow black line until %2 %3',
            roboid_turtle_follow_line_until_black: 'Turtle %1: follow %2 line until black %3',
            roboid_turtle_is_color_pattern: 'Turtle %1: color pattern %2 %3 ?',
            roboid_turtle_move_backward_unit: 'Turtle %1: move backward %2 %3 %4',
            roboid_turtle_move_forward_unit: 'Turtle %1: move forward %2 %3 %4',
            roboid_turtle_pivot_around_wheel_unit_in_direction:
                'Turtle %1: pivot around %2 wheel %3 %4 in %5 direction %6',
            roboid_turtle_play_note: 'Turtle %1: play note %2 %3 %4',
            roboid_turtle_play_note_for_beats: 'Turtle %1: play note %2 %3 for %4 beats %5',
            roboid_turtle_play_sound_times: 'Turtle %1: play sound %2 %3 times %4',
            roboid_turtle_play_sound_times_until_done:
                'Turtle %1: play sound %2 %3 times until done %4',
            roboid_turtle_rest_for_beats: 'Turtle %1: rest for %2 beats %3',
            roboid_turtle_set_buzzer_to: 'Turtle %1: set buzzer to %2 %3',
            roboid_turtle_set_following_speed_to: 'Turtle %1: set following speed to %2 %3',
            roboid_turtle_set_head_led_to: 'Turtle %1: set head led to %2 %3',
            roboid_turtle_set_head_led_to_rgb: 'Turtle %1: set head led to r: %2 g: %3 b: %4 %5',
            roboid_turtle_set_tempo_to: 'Turtle %1: set tempo to %2 bpm %3',
            roboid_turtle_set_wheel_to: 'Turtle %1: set %2 wheel to %3 %4',
            roboid_turtle_set_wheels_to_left_right:
                'Turtle %1: set wheels to left: %2 right: %3 %4',
            roboid_turtle_stop: 'Turtle %1: stop %2',
            roboid_turtle_touching_color: 'Turtle %1: touching %2 ?',
            roboid_turtle_turn_at_intersection: 'Turtle %1: turn %2 at black intersection %3',
            roboid_turtle_turn_unit_in_place: 'Turtle %1: turn %2 %3 %4 in place %5',
            roboid_turtle_turn_unit_with_radius_in_direction:
                'Turtle %1: turn %2 %3 %4 with radius %5 cm in %6 direction %7',
            roboid_turtle_value: 'Turtle %1: %2',
            roboid_turtle_boolean: 'Turtle %1: %2?',
            roboid_turtle_pick_head_led: 'Turtle %1: set head led to %2 %3',
        },
        Helper: {
            roboid_hamster_gripper: 'Opens or closes the gripper.',
            roboid_hamster_release_gripper: 'Turns off the gripper so that it can be moved freely.',
            roboid_hamster_boolean:
                'tilt forward: If tilted forward, true, otherwise false<br/>tilt backward: If tilted backward, true, otherwise false<br/>tilt left: If tilted to the left, true, otherwise false<br/>tilt right: If tilted to the right, true, otherwise false<br/>tilt flip: If upside-down, true, otherwise false<br/>not tilt: If not tilted, true, otherwise false<br/>battery normal: If the battery is enough, true, otherwise false<br/>battery low: If the battery is low, true, otherwise false<br/>battery empty: If the battery is empty, true, otherwise false',
            roboid_hamster_play_note: 'It sounds the selected tone and octave.',
            roboid_hamster_s_hand_found:
                'If there is a hand or object in front of the proximity sensor, true, otherwise false',
            roboid_hamster_s_boolean:
                'tilt forward: If tilted forward, true, otherwise false<br/>tilt backward: If tilted backward, true, otherwise false<br/>tilt left: If tilted to the left, true, otherwise false<br/>tilt right: If tilted to the right, true, otherwise false<br/>tilt flip: If upside-down, true, otherwise false<br/>not tilt: If not tilted, true, otherwise false<br/>battery normal: If the battery is enough, true, otherwise false<br/>battery low: If the battery is low, true, otherwise false<br/>battery empty: If the battery is empty, true, otherwise false',
            roboid_hamster_s_value:
                'left proximity: value of left proximity sensor (range: 0 to 255, initial value: 0)<br/>right proximity: value of right proximity sensor (range: 0 to 255, initial value: 0)<br/>left floor: value of left floor sensor (range: 0 to 100, initial value: 0)<br/>right floor: value of right floor sensor (range: 0 to 100, initial value: 0)<br/>x acceleration: x-axis value of acceleration sensor (range: -32768 to 32767, initial value: 0) The direction in which the robot moves forward is the positive direction of the x axis.<br/>y acceleration: y-axis value of acceleration sensor (range: -32768 to 32767, initial value: 0) The left direction of the robot is the positive direction of the y axis.<br/>z acceleration: z-axis value of acceleration sensor (range: -32768 to 32767, initial value: 0) The upward direction of the robot is the positive direction of the z axis.<br/>light: value of light sensor (range: 0 to 65535, initial value: 0) The brighter, the larger the value.<br/>temperature: temperature value inside the robot (range: -40 to 88 degrees Celsius, initial value: 0)<br/>signal strength: signal strength of Bluetooth communication (range: -128 to 0 dBm, initial value: 0) As the signal strength increases, the value increases.<br/>input A: value of signal input to external port A (range: analog input 0 to 255, digital input 0 or 1, initial value: 0)<br/>input B: value of signal input to external port B (range: analog input 0 to 255, digital input 0 or 1, initial value: 0)',
            roboid_hamster_s_move_forward_once: 'Moves one space forward on the board.',
            roboid_hamster_s_turn_once: 'Turns left/right 90 degrees on the board.',
            roboid_hamster_s_move_forward_unit:
                'Moves forward for the number of cm/seconds/pulses entered.',
            roboid_hamster_s_move_backward_unit:
                'Moves backward for the number of cm/seconds/pulses entered.',
            roboid_hamster_s_turn_unit_in_place:
                'Turns left/right in place for the number of degrees/seconds/pulses entered.',
            roboid_hamster_s_pivot_around_unit_in_direction:
                'Pivots around the left/right pen/wheel in the forward/backward direction for the number of degrees/seconds/pulses entered.',
            roboid_hamster_s_turn_unit_with_radius_in_direction:
                'Turns left/right so that the left/right pen draws the circle of the entered radius in the forward/backward direction for the number of degrees/seconds/pulses entered.',
            roboid_hamster_s_change_both_wheels_by:
                'Adds the entered values to the current speed values (%) of the left and right wheels respectively. If the result is positive, the wheel rotates forward; if negative, the wheel rotates backward.',
            roboid_hamster_s_set_both_wheels_to:
                'Sets the speed of the left and right wheels to the entered values (-100 to 100%), respectively. If you enter a positive value, the wheel rotates forward. If you enter a negative value, the wheel rotates backward. Entering the number 0 stops it.',
            roboid_hamster_s_change_wheel_by:
                'Adds the entered value to the current speed value (%) of the left/right/both wheels. If the result is positive, the wheel rotates forward; if negative, the wheel rotates backward.',
            roboid_hamster_s_set_wheel_to:
                'Sets the speed of the left/right/both wheels to the entered value (-100 to 100%). If you enter a positive value, the wheel rotates forward. If you enter a negative value, the wheel rotates backward. Entering the number 0 stops it.',
            roboid_hamster_s_follow_line_using:
                'Moves along the black/white line by using the left/right/both floor sensors.',
            roboid_hamster_s_follow_line_until:
                'Moves along the black/white line on the left/right/front/back, then stops when the robot meets the intersection.',
            roboid_hamster_s_set_following_speed_to:
                'Sets the speed (1 to 8) to move along the line. The larger the number, the faster the movement.',
            roboid_hamster_s_set_following_gain_to:
                'Sets the directional variation (1 to 8) 선을 따라 이동하는 방향 변화량(1 ~ 8)을 설정합니다. 숫자가 클수록 급커브를 잘 따라가지만 직선에서 좌우로 더 흔들립니다.',
            roboid_hamster_s_stop: 'Stops both wheels.',
            roboid_hamster_s_set_led_to: 'Turns left/right/both LEDs to the selected color.',
            roboid_hamster_s_pick_led: 'Turns left/right/both LEDs to the selected color.',
            roboid_hamster_s_change_led_by_rgb:
                'Adds the entered values to the current R, G, B values of left/right/both LEDs, respectively.',
            roboid_hamster_s_set_led_to_rgb:
                'Sets the R, G, B values of left/right/both LEDs to the entered values.',
            roboid_hamster_s_clear_led: 'Turns off the left/right/both LEDs.',
            roboid_hamster_s_play_sound_times: 'Plays the selected sound as many times as entered.',
            roboid_hamster_s_play_sound_times_until_done:
                'Plays the selected sound as many times as entered, and waits for completion.',
            roboid_hamster_s_change_buzzer_by:
                'Adds the entered value to the current pitch (Hz) of the buzzer sound. You can enter up to two decimal places.',
            roboid_hamster_s_set_buzzer_to:
                'Sets the pitch of the buzzer sound to the entered value (Hz). You can enter up to two decimal places. Entering the number 0 turns off the buzzer sound.',
            roboid_hamster_s_clear_sound: 'Turns off sound.',
            roboid_hamster_s_play_note: 'It sounds the selected tone and octave.',
            roboid_hamster_s_play_note_for:
                'It sounds the selected tone and octave as much as the beat you entered.',
            roboid_hamster_s_rest_for: 'Rests as much as the beat you entered.',
            roboid_hamster_s_change_tempo_by:
                'Adds the entered value to the current BPM (beats per minute) of the playing or resting speed.',
            roboid_hamster_s_set_tempo_to:
                'Sets the playing or resting speed to the entered BPM (beats per minute).',
            roboid_hamster_s_set_port_to:
                'Sets the io mode of the selected external port to the selected mode.',
            roboid_hamster_s_change_output_by:
                'Adds the entered value to the current output value of the selected external port. The result will be in the following range depending on the mode of the external port.<br/>Servo output: valid range from 1 to 180 degrees; if 0, output 0 without PWM pulse<br/>PWM output: 0 to 100%, duty ratio (%) of ON state in PWM waveform<br/>Digital output: LOW when 0, otherwise HIGH',
            roboid_hamster_s_set_output_to:
                'Sets the output value of the selected external port to the entered value. The value has the following range according to the mode of external port.<br/>Servo output: valid range from 1 to 180 degrees; if 0, output 0 without PWM pulse<br/>PWM output: 0 to 100%, duty ratio (%) of ON state in PWM waveform<br/>Digital output: LOW when 0, otherwise HIGH',
            roboid_hamster_s_gripper: 'Opens or closes the gripper.',
            roboid_hamster_s_release_gripper:
                'Turns off the gripper so that it can be moved freely.',
            roboid_hamster_s_write_serial: 'Sends strings via serial communication.',
            roboid_hamster_s_read_serial_until:
                'Read the strings received by serial communication.',
            roboid_hamster_s_set_serial_rate_to: 'Sets the speed of serial communication.',
            roboid_turtle_button_state:
                'If the button clicked/double-clicked/long-pressed, true, otherwise false.',
            roboid_turtle_change_buzzer_by:
                'Adds the entered value to the current pitch (Hz) of the buzzer sound. You can enter up to two decimal places.',
            roboid_turtle_change_head_led_by_rgb:
                'Adds the entered values to the current R, G, B values of the head LED, respectively.',
            roboid_turtle_change_tempo_by:
                'Adds the entered value to the current BPM (beats per minute) of the playing or resting speed.',
            roboid_turtle_change_wheel_by:
                'Adds the entered value to the current speed value (%) of the left/right/both wheels. If the result is positive, the wheel rotates forward; if negative, the wheel rotates backward.',
            roboid_turtle_change_wheels_by_left_right:
                'Adds the entered values to the current speed values (%) of the left and right wheels respectively. If the result is positive, the wheel rotates forward; if negative, the wheel rotates backward.',
            roboid_turtle_clear_head_led: 'Turns off the head LED.',
            roboid_turtle_clear_sound: 'Turns off sound.',
            roboid_turtle_cross_intersection:
                'Moves forward for a moment at the black intersection, then finds the black line and moves again.',
            roboid_turtle_follow_line: 'Moves along the selected color line on a white background.',
            roboid_turtle_follow_line_until:
                'Moves along the black line on a white background and stops when the color sensor detects the selected color.',
            roboid_turtle_follow_line_until_black:
                'Moves along the selected color line on a white background and stops when the color sensor detects black.',
            roboid_turtle_is_color_pattern:
                'If the color sensor detects the selected color pattern, true, otherwise false.',
            roboid_turtle_move_backward_unit:
                'Moves backward for the number of cm/seconds/pulses entered.',
            roboid_turtle_move_forward_unit:
                'Moves forward for the number of cm/seconds/pulses entered.',
            roboid_turtle_pivot_around_wheel_unit_in_direction:
                'Pivots around the left/right wheel in the head/tail direction for the number of degrees/seconds/pulses entered.',
            roboid_turtle_play_note: 'It sounds the selected tone and octave.',
            roboid_turtle_play_note_for_beats:
                'It sounds the selected tone and octave as much as the beat you entered.',
            roboid_turtle_play_sound_times: 'Plays the selected sound as many times as entered.',
            roboid_turtle_play_sound_times_until_done:
                'Plays the selected sound as many times as entered, and waits for completion.',
            roboid_turtle_rest_for_beats: 'Rests as much as the beat you entered.',
            roboid_turtle_set_buzzer_to:
                'Sets the pitch of the buzzer sound to the entered value (Hz). You can enter up to two decimal places. Entering the number 0 turns off the buzzer sound.',
            roboid_turtle_set_following_speed_to:
                'Sets the speed (1 to 8) to move along the line. The larger the number, the faster the movement.',
            roboid_turtle_set_head_led_to: 'Turns the head LED to the selected color.',
            roboid_turtle_set_head_led_to_rgb:
                'Sets the R, G, B values of the head LED to the entered values.',
            roboid_turtle_set_tempo_to:
                'Sets the playing or resting speed to the entered BPM (beats per minute).',
            roboid_turtle_set_wheel_to:
                'Sets the speed of the left/right/both wheels to the entered value (-400 to 400%). If you enter a positive value, the wheel rotates forward. If you enter a negative value, the wheel rotates backward. Entering the number 0 stops it.',
            roboid_turtle_set_wheels_to_left_right:
                'Sets the speed of the left and right wheels to the entered values (-400 to 400%), respectively. If you enter a positive value, the wheel rotates forward. If you enter a negative value, the wheel rotates backward. Entering the number 0 stops it.',
            roboid_turtle_stop: 'Stops both wheels.',
            roboid_turtle_touching_color:
                'If the color sensor detects the selected color, true, otherwise false.',
            roboid_turtle_turn_at_intersection:
                'Moves forward for a moment at the black intersection, then turns left/right/back in place, finds the black line and moves again.',
            roboid_turtle_turn_unit_in_place:
                'Turns left/right in place for the number of degrees/seconds/pulses entered.',
            roboid_turtle_turn_unit_with_radius_in_direction:
                'Turns left/right drawing the circle of the entered radius in the head/tail direction for the number of degrees/seconds/pulses entered.',
            roboid_turtle_value:
                'color number: color number detected by the color sensor (range: -1 to 8, initial value: -1)<br/>color pattern: value of the color pattern detected by the color sensor (range: -1 ~ 88, initial value: -1) <br/>floor: value of floor sensor (range: 0 to 100, initial value: 0)<br/>button: status of the button (when pressed 1, otherwise 0, initial value: 0)<br/>x acceleration: x-axis value of acceleration sensor (range: -32768 to 32767, initial value: 0) The direction in which the robot moves forward is the positive direction of the x axis.<br/>y acceleration: y-axis value of acceleration sensor (range: -32768 to 32767, initial value: 0) The left direction of the robot is the positive direction of the y axis.<br/>z acceleration: z-axis value of acceleration sensor (range: -32768 to 32767, initial value: 0) The upward direction of the robot is the positive direction of the z axis.',
            roboid_turtle_boolean:
                'tilt forward: If tilted forward, true, otherwise false<br/>tilt backward: If tilted backward, true, otherwise false<br/>tilt left: If tilted to the left, true, otherwise false<br/>tilt right: If tilted to the right, true, otherwise false<br/>tilt flip: If upside-down, true, otherwise false<br/>not tilt: If not tilted, true, otherwise false<br/>battery normal: If the battery is enough, true, otherwise false<br/>battery low: If the battery is low, true, otherwise false<br/>battery empty: If the battery is empty, true, otherwise false',
            roboid_turtle_pick_head_led: 'Turns the head LED to the selected color.',
        },
        Blocks: {
            hamster_note_c: 'C',
            hamster_note_c_sharp: 'C♯(D♭)',
            hamster_note_d: 'D',
            hamster_note_d_sharp: 'D♯(E♭)',
            hamster_note_e: 'E',
            hamster_note_f: 'F',
            hamster_note_f_sharp: 'F♯(G♭)',
            hamster_note_g: 'G',
            hamster_note_g_sharp: 'G♯(A♭)',
            hamster_note_a: 'A',
            hamster_note_a_sharp: 'A♯(B♭)',
            hamster_note_b: 'B',
            hamster_tilt_forward: 'tilt forward',
            hamster_tilt_backward: 'tilt backward',
            hamster_tilt_left: 'tilt left',
            hamster_tilt_right: 'tilt right',
            hamster_tilt_flip: 'tilt flip',
            hamster_tilt_not: 'not tilt',
            hamster_battery_normal: 'battery normal',
            hamster_battery_low: 'battery low',
            hamster_battery_empty: 'battery empty',
            hamster_open_gripper: 'open',
            hamster_close_gripper: 'close',
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
            turtle_acceleration_x: 'x acceleration',
            turtle_acceleration_y: 'y acceleration',
            turtle_acceleration_z: 'z acceleration',
            turtle_back: 'back',
            turtle_both: 'both',
            turtle_button: 'button',
            turtle_buzzer: 'buzzer',
            turtle_clicked: 'clicked',
            turtle_color_any: 'any color',
            turtle_color_black: 'black',
            turtle_color_blue: 'blue',
            turtle_color_green: 'green',
            turtle_color_number: 'color number',
            turtle_color_orange: 'orange',
            turtle_color_pattern: 'color pattern',
            turtle_color_purple: 'purple',
            turtle_color_red: 'red',
            turtle_color_sky_blue: 'sky blue',
            turtle_color_violet: 'violet',
            turtle_color_white: 'white',
            turtle_color_yellow: 'yellow',
            turtle_double_clicked: 'double-clicked',
            turtle_floor: 'floor',
            turtle_head: 'head',
            turtle_head_color: 'head color',
            turtle_left: 'left',
            turtle_left_wheel: 'left wheel',
            turtle_long_pressed: 'long-pressed',
            turtle_note: 'note',
            turtle_right: 'right',
            turtle_right_wheel: 'right wheel',
            turtle_sound_beep: 'beep',
            turtle_sound_birthday: 'birthday',
            turtle_sound_dibidibidip: 'dibidibidip',
            turtle_sound_engine: 'engine',
            turtle_sound_good_job: 'good job',
            turtle_sound_march: 'march',
            turtle_sound_random_beep: 'random beep',
            turtle_sound_robot: 'robot',
            turtle_sound_siren: 'siren',
            turtle_tail: 'tail',
            turtle_unit_cm: 'cm',
            turtle_unit_deg: 'degrees',
            turtle_unit_pulse: 'pulses',
            turtle_unit_sec: 'seconds',
            turtle_note_c: 'C',
            turtle_note_c_sharp: 'C♯(D♭)',
            turtle_note_d: 'D',
            turtle_note_d_sharp: 'D♯(E♭)',
            turtle_note_e: 'E',
            turtle_note_f: 'F',
            turtle_note_f_sharp: 'F♯(G♭)',
            turtle_note_g: 'G',
            turtle_note_g_sharp: 'G♯(A♭)',
            turtle_note_a: 'A',
            turtle_note_a_sharp: 'A♯(B♭)',
            turtle_note_b: 'B',
            turtle_tilt_forward: 'tilt forward',
            turtle_tilt_backward: 'tilt backward',
            turtle_tilt_left: 'tilt left',
            turtle_tilt_right: 'tilt right',
            turtle_tilt_flip: 'tilt flip',
            turtle_tilt_not: 'not tilt',
            turtle_battery_normal: 'battery normal',
            turtle_battery_low: 'battery low',
            turtle_battery_empty: 'battery empty',
        },
    },
    jp: {
        template: {
            roboid_hamster_gripper: 'ハムスター %1: グリッパを %2 %3',
            roboid_hamster_release_gripper: 'ハムスター %1: グリッパをオフ %2',
            roboid_hamster_boolean: 'ハムスター %1: %2?',
            roboid_hamster_play_note: 'ハムスター %1: %2 %3 を演奏する %4',
            roboid_hamster_s_hand_found: 'ハムスターS %1: 手を見つけたか?',
            roboid_hamster_s_boolean: 'ハムスターS %1: %2?',
            roboid_hamster_s_value: 'ハムスターS %1: %2',
            roboid_hamster_s_move_forward_once: 'ハムスターS %1: ボード板上で前へ動かす %2',
            roboid_hamster_s_turn_once: 'ハムスターS %1: ボード板上で%2に回す %3',
            roboid_hamster_s_move_forward_unit: 'ハムスターS %1: 前へ%2%3動かす %4',
            roboid_hamster_s_move_backward_unit: 'ハムスターS %1: 後ろへ%2%3動かす %4',
            roboid_hamster_s_turn_unit_in_place: 'ハムスターS %1: 所定位置で%2に%3%4回す %5',
            roboid_hamster_s_pivot_around_unit_in_direction:
                'ハムスターS %1: %2を中心に%3%4%5方向に回す %6',
            roboid_hamster_s_turn_unit_with_radius_in_direction:
                'ハムスターS %1: %2%3に%4%5半径%6cmを%7方向に回す %8',
            roboid_hamster_s_change_both_wheels_by:
                'ハムスターS %1: 左車輪を%2右車輪を%3ずつ変える %4',
            roboid_hamster_s_set_both_wheels_to: 'ハムスターS %1: 左車輪を%2右車輪を%3にする %4',
            roboid_hamster_s_change_wheel_by: 'ハムスターS %1: %2車輪を%3ずつ変える %4',
            roboid_hamster_s_set_wheel_to: 'ハムスターS %1: %2車輪を%3にする %4',
            roboid_hamster_s_follow_line_using:
                'ハムスターS %1: %2線を%3フロアセンサーで追従する %4',
            roboid_hamster_s_follow_line_until:
                'ハムスターS %1: %2線を追従して%3交差点まで動かす %4',
            roboid_hamster_s_set_following_speed_to:
                'ハムスターS %1: 線を追従する速度を%2にする %3',
            roboid_hamster_s_set_following_gain_to:
                'ハムスターS %1: 線を追従する方向変化量を%2にする %3',
            roboid_hamster_s_stop: 'ハムスターS %1: 停止する %2',
            roboid_hamster_s_set_led_to: 'ハムスターS %1: %2LEDを%3にする %4',
            roboid_hamster_s_pick_led: 'ハムスターS %1: %2LEDを%3にする %4',
            roboid_hamster_s_change_led_by_rgb: 'ハムスターS %1: %2LEDをR:%3G:%4B:%5ずつ変える %6',
            roboid_hamster_s_set_led_to_rgb: 'ハムスターS %1: %2LEDをR:%3G:%4B:%5にする %6',
            roboid_hamster_s_clear_led: 'ハムスターS %1: %2LEDをオフ %3',
            roboid_hamster_s_play_sound_times: 'ハムスターS %1: %2音を%3回鳴らす %4',
            roboid_hamster_s_play_sound_times_until_done:
                'ハムスターS %1: 終わるまで%2音を%3回鳴らす %4',
            roboid_hamster_s_change_buzzer_by: 'ハムスターS %1: ブザー音を%2ずつ変える %3',
            roboid_hamster_s_set_buzzer_to: 'ハムスターS %1: ブザー音を%2にする %3',
            roboid_hamster_s_clear_sound: 'ハムスターS %1: 音を止める %2',
            roboid_hamster_s_play_note: 'ハムスターS %1: %2%3音を鳴らす %4',
            roboid_hamster_s_play_note_for: 'ハムスターS %1: %2%3音を%4拍鳴らす %5',
            roboid_hamster_s_rest_for: 'ハムスターS %1: %2拍休む %3',
            roboid_hamster_s_change_tempo_by: 'ハムスターS %1: テンポを%2ずつ変える %3',
            roboid_hamster_s_set_tempo_to: 'ハムスターS %1: テンポを%2BPMにする %3',
            roboid_hamster_s_set_port_to: 'ハムスターS %1: ポート%2を%3にする %4',
            roboid_hamster_s_change_output_by: 'ハムスターS %1: 出力%2を%3ずつ変える %4',
            roboid_hamster_s_set_output_to: 'ハムスターS %1: 出力%2を%3にする %4',
            roboid_hamster_s_gripper: 'ハムスターS %1: グリッパを%2 %3',
            roboid_hamster_s_release_gripper: 'ハムスターS %1: グリッパをオフ %2',
            roboid_hamster_s_write_serial: 'ハムスターS %1: シリアルに%2%3を書き出す %4',
            roboid_hamster_s_read_serial_until: 'ハムスターS %1: シリアルを%2読み取る %3',
            roboid_hamster_s_set_serial_rate_to: 'ハムスターS %1: シリアル速度を%2Bdにする %3',
            roboid_turtle_button_state: 'カメ %1: 背中を %2 した？',
            roboid_turtle_change_buzzer_by: 'カメ %1: ブザー音の高さを %2 だけ変えて鳴らす %3',
            roboid_turtle_change_head_led_by_rgb:
                'カメ %1: 頭のLEDの色をR（赤：あか） %2  G（緑：みどり） %3  B（青：あお） %4 だけ変える %5',
            roboid_turtle_change_tempo_by: 'カメ %1: 演奏の速さを %2 だけ変える %3',
            roboid_turtle_change_wheel_by:
                'カメ %1: %2 の車輪（しゃりん）の速さを %3 だけ変える %4',
            roboid_turtle_change_wheels_by_left_right:
                'カメ %1: 車輪（しゃりん）の速さを左 %2 右 %3 だけ変える %4',
            roboid_turtle_clear_head_led: 'カメ %1: 頭のLEDを消す %2',
            roboid_turtle_clear_sound: 'カメ %1: 音を消す %2',
            roboid_turtle_cross_intersection: 'カメ %1: 黒の線が交わる点を渡る %2',
            roboid_turtle_follow_line: 'カメ %1: %2 の線にそって移動する %3',
            roboid_turtle_follow_line_until: 'カメ %1: 黒の線にそって %2 まで移動する %3',
            roboid_turtle_follow_line_until_black: 'カメ %1: %2 の線にそって黒まで移動する %3',
            roboid_turtle_is_color_pattern: 'カメ %1: 色の順番 %2 %3 を感知した?',
            roboid_turtle_move_backward_unit: 'カメ %1: 後ろへ %2 %3 移動する %4',
            roboid_turtle_move_forward_unit: 'カメ %1: 前へ %2 %3 移動する %4',
            roboid_turtle_pivot_around_wheel_unit_in_direction:
                'カメ %1: %2 の車輪を中心に %3 %4 %5 方向に回る %6',
            roboid_turtle_play_note: 'カメ %1: %2 %3 を演奏する %4',
            roboid_turtle_play_note_for_beats: 'カメ %1: %2 %3 を %4 拍演奏する %5',
            roboid_turtle_play_sound_times: 'カメ %1: 音 %2 を %3 回鳴らす %4',
            roboid_turtle_play_sound_times_until_done:
                'カメ %1: 音 %2 を %3 回鳴らして終わるまで待つ %4',
            roboid_turtle_rest_for_beats: 'カメ %1: %2 拍休む %3',
            roboid_turtle_set_buzzer_to: 'カメ %1: ブザー音の高さを %2 にして鳴らす %3',
            roboid_turtle_set_following_speed_to: 'カメ %1: 線にそって移動する速さを %2 にする %3',
            roboid_turtle_set_head_led_to: 'カメ %1: 頭のLEDの色を %2 にする %3',
            roboid_turtle_set_head_led_to_rgb:
                'カメ %1: 頭のLEDの色をR（赤：あか） %2  G（緑：みどり） %3  B（青：あお） %4 にする %5',
            roboid_turtle_set_tempo_to: 'カメ %1: 演奏の速さを1分間に %2 拍にする %3',
            roboid_turtle_set_wheel_to: 'カメ %1: %2 の車輪（しゃりん）の速さを %3 にする %4',
            roboid_turtle_set_wheels_to_left_right:
                'カメ %1: 車輪（しゃりん）の速さを左 %2 右 %3 にする %4',
            roboid_turtle_stop: 'カメ %1: 移動を停止する %2',
            roboid_turtle_touching_color: 'カメ %1: %2 を感知した？',
            roboid_turtle_turn_at_intersection: 'カメ %1: 黒の線が交わる点で %2 へ方向を変える %3',
            roboid_turtle_turn_unit_in_place: 'カメ %1: %2 へ %3 %4 その場で回る %5',
            roboid_turtle_turn_unit_with_radius_in_direction:
                'カメ %1: %2 へ %3 %4 半径 %5 cmで %6 方向に回る %7',
            roboid_turtle_value: 'カメ %1: %2',
            roboid_turtle_boolean: 'カメ %1: %2?',
            roboid_turtle_pick_head_led: 'カメ %1: 頭のLEDの色を %2 にする %3',
        },
        Helper: {
            roboid_hamster_gripper: 'Opens or closes the gripper.',
            roboid_hamster_release_gripper: 'Turns off the gripper so that it can be moved freely.',
            roboid_hamster_boolean:
                'tilt forward: If tilted forward, true, otherwise false<br/>tilt backward: If tilted backward, true, otherwise false<br/>tilt left: If tilted to the left, true, otherwise false<br/>tilt right: If tilted to the right, true, otherwise false<br/>tilt flip: If upside-down, true, otherwise false<br/>not tilt: If not tilted, true, otherwise false<br/>battery normal: If the battery is enough, true, otherwise false<br/>battery low: If the battery is low, true, otherwise false<br/>battery empty: If the battery is empty, true, otherwise false',
            roboid_hamster_play_note: '選択された音階（音名、オクターブ）が鳴ります。',
            roboid_hamster_s_hand_found:
                'If there is a hand or object in front of the proximity sensor, true, otherwise false',
            roboid_hamster_s_boolean:
                'tilt forward: If tilted forward, true, otherwise false<br/>tilt backward: If tilted backward, true, otherwise false<br/>tilt left: If tilted to the left, true, otherwise false<br/>tilt right: If tilted to the right, true, otherwise false<br/>tilt flip: If upside-down, true, otherwise false<br/>not tilt: If not tilted, true, otherwise false<br/>battery normal: If the battery is enough, true, otherwise false<br/>battery low: If the battery is low, true, otherwise false<br/>battery empty: If the battery is empty, true, otherwise false',
            roboid_hamster_s_value:
                'left proximity: value of left proximity sensor (range: 0 to 255, initial value: 0)<br/>right proximity: value of right proximity sensor (range: 0 to 255, initial value: 0)<br/>left floor: value of left floor sensor (range: 0 to 100, initial value: 0)<br/>right floor: value of right floor sensor (range: 0 to 100, initial value: 0)<br/>x acceleration: x-axis value of acceleration sensor (range: -32768 to 32767, initial value: 0) The direction in which the robot moves forward is the positive direction of the x axis.<br/>y acceleration: y-axis value of acceleration sensor (range: -32768 to 32767, initial value: 0) The left direction of the robot is the positive direction of the y axis.<br/>z acceleration: z-axis value of acceleration sensor (range: -32768 to 32767, initial value: 0) The upward direction of the robot is the positive direction of the z axis.<br/>light: value of light sensor (range: 0 to 65535, initial value: 0) The brighter, the larger the value.<br/>temperature: temperature value inside the robot (range: -40 to 88 degrees Celsius, initial value: 0)<br/>signal strength: signal strength of Bluetooth communication (range: -128 to 0 dBm, initial value: 0) As the signal strength increases, the value increases.<br/>input A: value of signal input to external port A (range: analog input 0 to 255, digital input 0 or 1, initial value: 0)<br/>input B: value of signal input to external port B (range: analog input 0 to 255, digital input 0 or 1, initial value: 0)',
            roboid_hamster_s_move_forward_once: 'Moves one space forward on the board.',
            roboid_hamster_s_turn_once: 'Turns left/right 90 degrees on the board.',
            roboid_hamster_s_move_forward_unit:
                'Moves forward for the number of cm/seconds/pulses entered.',
            roboid_hamster_s_move_backward_unit:
                'Moves backward for the number of cm/seconds/pulses entered.',
            roboid_hamster_s_turn_unit_in_place:
                'Turns left/right in place for the number of degrees/seconds/pulses entered.',
            roboid_hamster_s_pivot_around_unit_in_direction:
                'Pivots around the left/right pen/wheel in the forward/backward direction for the number of degrees/seconds/pulses entered.',
            roboid_hamster_s_turn_unit_with_radius_in_direction:
                'Turns left/right so that the left/right pen draws the circle of the entered radius in the forward/backward direction for the number of degrees/seconds/pulses entered.',
            roboid_hamster_s_change_both_wheels_by:
                'Adds the entered values to the current speed values (%) of the left and right wheels respectively. If the result is positive, the wheel rotates forward; if negative, the wheel rotates backward.',
            roboid_hamster_s_set_both_wheels_to:
                'Sets the speed of the left and right wheels to the entered values (-100 to 100%), respectively. If you enter a positive value, the wheel rotates forward. If you enter a negative value, the wheel rotates backward. Entering the number 0 stops it.',
            roboid_hamster_s_change_wheel_by:
                'Adds the entered value to the current speed value (%) of the left/right/both wheels. If the result is positive, the wheel rotates forward; if negative, the wheel rotates backward.',
            roboid_hamster_s_set_wheel_to:
                'Sets the speed of the left/right/both wheels to the entered value (-100 to 100%). If you enter a positive value, the wheel rotates forward. If you enter a negative value, the wheel rotates backward. Entering the number 0 stops it.',
            roboid_hamster_s_follow_line_using:
                'Moves along the black/white line by using the left/right/both floor sensors.',
            roboid_hamster_s_follow_line_until:
                'Moves along the black/white line on the left/right/front/back, then stops when the robot meets the intersection.',
            roboid_hamster_s_set_following_speed_to:
                'Sets the speed (1 to 8) to move along the line. The larger the number, the faster the movement.',
            roboid_hamster_s_set_following_gain_to:
                'Sets the directional variation (1 to 8) 선을 따라 이동하는 방향 변화량(1 ~ 8)을 설정합니다. 숫자가 클수록 급커브를 잘 따라가지만 직선에서 좌우로 더 흔들립니다.',
            roboid_hamster_s_stop: 'Stops both wheels.',
            roboid_hamster_s_set_led_to: 'Turns left/right/both LEDs to the selected color.',
            roboid_hamster_s_pick_led: 'Turns left/right/both LEDs to the selected color.',
            roboid_hamster_s_change_led_by_rgb:
                'Adds the entered values to the current R, G, B values of left/right/both LEDs, respectively.',
            roboid_hamster_s_set_led_to_rgb:
                'Sets the R, G, B values of left/right/both LEDs to the entered values.',
            roboid_hamster_s_clear_led: 'Turns off the left/right/both LEDs.',
            roboid_hamster_s_play_sound_times: 'Plays the selected sound as many times as entered.',
            roboid_hamster_s_play_sound_times_until_done:
                'Plays the selected sound as many times as entered, and waits for completion.',
            roboid_hamster_s_change_buzzer_by:
                'Adds the entered value to the current pitch (Hz) of the buzzer sound. You can enter up to two decimal places.',
            roboid_hamster_s_set_buzzer_to:
                'Sets the pitch of the buzzer sound to the entered value (Hz). You can enter up to two decimal places. Entering the number 0 turns off the buzzer sound.',
            roboid_hamster_s_clear_sound: 'Turns off sound.',
            roboid_hamster_s_play_note: 'It sounds the selected tone and octave.',
            roboid_hamster_s_play_note_for:
                'It sounds the selected tone and octave as much as the beat you entered.',
            roboid_hamster_s_rest_for: 'Rests as much as the beat you entered.',
            roboid_hamster_s_change_tempo_by:
                'Adds the entered value to the current BPM (beats per minute) of the playing or resting speed.',
            roboid_hamster_s_set_tempo_to:
                'Sets the playing or resting speed to the entered BPM (beats per minute).',
            roboid_hamster_s_set_port_to:
                'Sets the io mode of the selected external port to the selected mode.',
            roboid_hamster_s_change_output_by:
                'Adds the entered value to the current output value of the selected external port. The result will be in the following range depending on the mode of the external port.<br/>Servo output: valid range from 1 to 180 degrees; if 0, output 0 without PWM pulse<br/>PWM output: 0 to 100%, duty ratio (%) of ON state in PWM waveform<br/>Digital output: LOW when 0, otherwise HIGH',
            roboid_hamster_s_set_output_to:
                'Sets the output value of the selected external port to the entered value. The value has the following range according to the mode of external port.<br/>Servo output: valid range from 1 to 180 degrees; if 0, output 0 without PWM pulse<br/>PWM output: 0 to 100%, duty ratio (%) of ON state in PWM waveform<br/>Digital output: LOW when 0, otherwise HIGH',
            roboid_hamster_s_gripper: 'Opens or closes the gripper.',
            roboid_hamster_s_release_gripper:
                'Turns off the gripper so that it can be moved freely.',
            roboid_hamster_s_write_serial: 'Sends strings via serial communication.',
            roboid_hamster_s_read_serial_until:
                'Read the strings received by serial communication.',
            roboid_hamster_s_set_serial_rate_to: 'Sets the speed of serial communication.',
            roboid_turtle_button_state:
                '背中（ボタン）が[クリック/ダブルクリック/長押し]された場合は｢正しい｣と判断します。それ以外の場合は｢正しくない｣と判断します。',
            roboid_turtle_change_buzzer_by:
                'ブザーの現在の音の高さ（ヘルツ）に入力された数値を足して鳴らします。小数点以下2桁まで入力できます。',
            roboid_turtle_change_head_led_by_rgb:
                '頭のLEDライトの色に、入力されたR（赤：あか）、G（緑：みどり）、B（青：あお）の数値（範囲:0～255）を足します。',
            roboid_turtle_change_tempo_by:
                '入力された数値を現在の演奏速度（１分あたりの拍数）に足します。',
            roboid_turtle_change_wheel_by:
                '[左/右]の車輪（しゃりん）の速さ（%）に入力された数値を足します。足した結果が、正の数の場合は前方向に、負の数の場合は後方向に、車輪が回転します。',
            roboid_turtle_change_wheels_by_left_right:
                '左右の車輪（しゃりん）の速さ（%）にそれぞれ入力された数値を足します。足した結果が、正の数の場合は前方向に、負の数の場合は後方向に、車輪が回転します。',
            roboid_turtle_clear_head_led: '頭のLEDライトを消します。',
            roboid_turtle_clear_sound: '音を消します。',
            roboid_turtle_cross_intersection:
                '黒の線が交わる点を越えて、前方の黒の線にそって移動します。',
            roboid_turtle_follow_line: '白地の上の選択された色の線にそって移動します。',
            roboid_turtle_follow_line_until:
                '白地の上の黒の線にそって移動し、カラーセンサーが選択された色を感知したら停止します。',
            roboid_turtle_follow_line_until_black:
                '白地の上の選択された色の線にそって移動し、カラーセンサーが黒を感知したら停止します。',
            roboid_turtle_is_color_pattern:
                'カラーセンサーが選択された色の順番（パターン）を感知した場合は｢正しい｣と判断します。それ以外の場合は｢正しくない｣と判断します。',
            roboid_turtle_move_backward_unit:
                '入力された数値[cm/秒/パルス]だけ後方向に移動します。',
            roboid_turtle_move_forward_unit: '入力された数値[cm/秒/パルス]だけ前方向に移動します。',
            roboid_turtle_pivot_around_wheel_unit_in_direction:
                '[左/右]の車輪を中心に、入力された数値[角度/秒/パルス]だけ、[前/後]方向に回転します。',
            roboid_turtle_play_note: '選択された音階（音名、オクターブ）が鳴ります。',
            roboid_turtle_play_note_for_beats:
                '選択された音階（音名、オクターブ）が、入力された拍数分鳴ります。',
            roboid_turtle_play_sound_times: '選択された音を入力された回数だけ再生します。',
            roboid_turtle_play_sound_times_until_done:
                '選択された音を入力された回数だけ再生します。再生が終わってから次の命令を実行します。',
            roboid_turtle_rest_for_beats: '入力された拍数分だけ音を鳴らすのを休みます。',
            roboid_turtle_set_buzzer_to:
                'ブザーの現在の音の高さ（ヘルツ）を入力された数値にして鳴らします。小数点以下2桁まで入力できます。',
            roboid_turtle_set_following_speed_to:
                '線にそって移動する速度（範囲：1〜8）を入力された数値にします。数字が大きいほど動きが速くなります。',
            roboid_turtle_set_head_led_to: '頭のLEDライトを選択された色にします。',
            roboid_turtle_set_head_led_to_rgb:
                '頭のLEDライトを入力されたR（赤：あか）、G（緑：みどり）、B（青：あお）の数値（範囲:0～255）の色にします。',
            roboid_turtle_set_tempo_to:
                '入力された数値を現在の演奏速度（１分あたりの拍数）にします。',
            roboid_turtle_set_wheel_to:
                '[左/右]の車輪（しゃりん）の速さ（範囲：-400～400%）を入力された数値にします。正の数の場合は前方向に、負の数の場合は後方向に、車輪が回転します。0を入力すると車輪が停止します。',
            roboid_turtle_set_wheels_to_left_right:
                '左右の車輪（しゃりん）の速さ（範囲：-400～400%）をそれぞれ入力された数値にします。正の数の場合は前方向に、負の数の場合は後方向に、車輪が回転します。0を入力すると車輪が停止します。',
            roboid_turtle_stop: '移動を停止します。',
            roboid_turtle_touching_color:
                'カラーセンサーが選択された色を感知した場合は｢正しい｣と判断します。それ以外の場合は｢正しくない｣と判断します。',
            roboid_turtle_turn_at_intersection:
                '黒の線が交わる点で[左/右/後]方向に回転して、黒い線にそって移動します。',
            roboid_turtle_turn_unit_in_place:
                '入力された数値[角度/秒/パルス]だけ、その場で[左/右]に回転します。',
            roboid_turtle_turn_unit_with_radius_in_direction:
                '入力された数値[角度/秒/パルス]だけ、入力された半径（cm）で、[前/後]方向に回転します。',
            roboid_turtle_value:
                '色番号：カラーセンサーが感知した色の番号（範囲：-1〜8、初期値：-1）<br/>色のパターン：カラーセンサーが感知した色のパターンの値（範囲：-1〜88、初期値：-1）<br/>床センサー：床センサーの値（範囲：0〜100、初期値：0）<br/>ボタン：ボタンの状態（クリックした時：1、それ以外：0、初期値：0）<br/>前後の速さ：加速度センサーの前後（x軸）の速さの値（範囲：-32768〜32767、初期値：0）タートルが前進する方向はx軸の正方向です。<br/>左右の速さ：加速度センサーの左右（y軸）の速さの値（範囲：-32768〜32767、初期値：0）タートルの左方向がy軸の正方向です。<br/>上下の速さ：加速度センサーの上下（z軸）の速さの値（範囲：-32768〜32767、初期値：0）タートルの上方向がz軸の正方向です。<br/>',
            roboid_turtle_boolean:
                'tilt forward: If tilted forward, true, otherwise false<br/>tilt backward: If tilted backward, true, otherwise false<br/>tilt left: If tilted to the left, true, otherwise false<br/>tilt right: If tilted to the right, true, otherwise false<br/>tilt flip: If upside-down, true, otherwise false<br/>not tilt: If not tilted, true, otherwise false<br/>battery normal: If the battery is enough, true, otherwise false<br/>battery low: If the battery is low, true, otherwise false<br/>battery empty: If the battery is empty, true, otherwise false',
            roboid_turtle_pick_head_led: '頭のLEDライトを選択された色にします。',
        },
        Blocks: {
            hamster_note_c: 'ド',
            hamster_note_c_sharp: 'ド♯(レ♭)',
            hamster_note_d: 'レ',
            hamster_note_d_sharp: 'レ♯(ミ♭)',
            hamster_note_e: 'ミ',
            hamster_note_f: 'ファ',
            hamster_note_f_sharp: 'ファ♯(ソ♭)',
            hamster_note_g: 'ソ',
            hamster_note_g_sharp: 'ソ♯(ラ♭)',
            hamster_note_a: 'ラ',
            hamster_note_a_sharp: 'ラ♯(シ♭)',
            hamster_note_b: 'シ',
            hamster_tilt_forward: '前に傾けたか',
            hamster_tilt_backward: '後に傾けたか',
            hamster_tilt_left: '左に傾けたか',
            hamster_tilt_right: '右に傾けたか',
            hamster_tilt_flip: '上下裏返したか',
            hamster_tilt_not: '傾けなかったか',
            hamster_battery_normal: '電池が正常か',
            hamster_battery_low: '電池が足りないか',
            hamster_battery_empty: '電池がないか',
            hamster_open_gripper: '開く',
            hamster_close_gripper: '閉める',
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
            turtle_acceleration_x: '前後の速さ',
            turtle_acceleration_y: '左右の速さ',
            turtle_acceleration_z: '上下の速さ',
            turtle_back: '後',
            turtle_both: '両方',
            turtle_button: 'ボタン',
            turtle_buzzer: 'ブザー',
            turtle_clicked: 'クリック',
            turtle_color_any: 'すべての色',
            turtle_color_black: '黒',
            turtle_color_blue: '青',
            turtle_color_green: '緑',
            turtle_color_number: '色番号',
            turtle_color_orange: 'オレンジ',
            turtle_color_pattern: '色のパターン',
            turtle_color_purple: '紫',
            turtle_color_red: '赤',
            turtle_color_sky_blue: '水色',
            turtle_color_violet: '赤紫',
            turtle_color_white: '白',
            turtle_color_yellow: '黄色',
            turtle_double_clicked: 'ダブルクリック',
            turtle_floor: '床センサー',
            turtle_head: '前',
            turtle_head_color: '頭のLEDの色',
            turtle_left: '左',
            turtle_left_wheel: '左の車輪',
            turtle_long_pressed: '長押し',
            turtle_note: '音符',
            turtle_right: '右',
            turtle_right_wheel: '右の車輪',
            turtle_sound_beep: 'ビープ音',
            turtle_sound_birthday: '誕生日',
            turtle_sound_dibidibidip: 'ディビディビディップ',
            turtle_sound_engine: 'エンジン',
            turtle_sound_good_job: 'よくできました',
            turtle_sound_march: '行進',
            turtle_sound_random_beep: 'ビープ音のどれか',
            turtle_sound_robot: 'ロボット',
            turtle_sound_siren: 'サイレン',
            turtle_tail: '後',
            turtle_unit_cm: 'cm',
            turtle_unit_deg: '°',
            turtle_unit_pulse: 'パルス',
            turtle_unit_sec: '秒',
            turtle_note_c: 'ド',
            turtle_note_c_sharp: 'ド♯(レ♭)',
            turtle_note_d: 'レ',
            turtle_note_d_sharp: 'レ♯(ミ♭)',
            turtle_note_e: 'ミ',
            turtle_note_f: 'ファ',
            turtle_note_f_sharp: 'ファ♯(ソ♭)',
            turtle_note_g: 'ソ',
            turtle_note_g_sharp: 'ソ♯(ラ♭)',
            turtle_note_a: 'ラ',
            turtle_note_a_sharp: 'ラ♯(シ♭)',
            turtle_note_b: 'シ',
            turtle_tilt_forward: '前に傾けたか',
            turtle_tilt_backward: '後に傾けたか',
            turtle_tilt_left: '左に傾けたか',
            turtle_tilt_right: '右に傾けたか',
            turtle_tilt_flip: '上下裏返したか',
            turtle_tilt_not: '傾けなかったか',
            turtle_battery_normal: '電池が正常か',
            turtle_battery_low: '電池が足りないか',
            turtle_battery_empty: '電池がないか',
        },
    },
    vn: {
        template: {
            roboid_hamster_gripper: 'Hamster %1: %2 gripper %3',
            roboid_hamster_release_gripper: 'Hamster %1: release gripper %2',
            roboid_hamster_boolean: 'Hamster %1: %2?',
            roboid_hamster_play_note: 'Hamster %1: play note %2 %3 %4',
            roboid_hamster_s_hand_found: 'HamsterS %1: hand found?',
            roboid_hamster_s_boolean: 'HamsterS %1: %2?',
            roboid_hamster_s_value: 'HamsterS %1: %2',
            roboid_hamster_s_move_forward_once: 'HamsterS %1: move forward once on board %2',
            roboid_hamster_s_turn_once: 'HamsterS %1: turn %2 once on board %3',
            roboid_hamster_s_move_forward_unit: 'HamsterS %1: move forward %2 %3 %4',
            roboid_hamster_s_move_backward_unit: 'HamsterS %1: move backward %2 %3 %4',
            roboid_hamster_s_turn_unit_in_place: 'HamsterS %1: turn %2 %3 %4 in place %5',
            roboid_hamster_s_pivot_around_unit_in_direction:
                'HamsterS %1: pivot around %2 %3 %4 in %5 direction %6',
            roboid_hamster_s_turn_unit_with_radius_in_direction:
                'HamsterS %1: %2 turn %3 %4 %5 with radius %6 cm in %7 direction %8',
            roboid_hamster_s_change_both_wheels_by:
                'HamsterS %1: change wheels by left: %2 right: %3 %4',
            roboid_hamster_s_set_both_wheels_to: 'HamsterS %1: set wheels to left: %2 right: %3 %4',
            roboid_hamster_s_change_wheel_by: 'HamsterS %1: change %2 wheel by %3 %4',
            roboid_hamster_s_set_wheel_to: 'HamsterS %1: set %2 wheel to %3 %4',
            roboid_hamster_s_follow_line_using:
                'HamsterS %1: follow %2 line using %3 floor sensor %4',
            roboid_hamster_s_follow_line_until:
                'HamsterS %1: follow %2 line until %3 intersection %4',
            roboid_hamster_s_set_following_speed_to: 'HamsterS %1: set following speed to %2 %3',
            roboid_hamster_s_set_following_gain_to:
                'HamsterS %1: set following directional variation to %2 %3',
            roboid_hamster_s_stop: 'HamsterS %1: stop %2',
            roboid_hamster_s_set_led_to: 'HamsterS %1: set %2 led to %3 %4',
            roboid_hamster_s_pick_led: 'HamsterS %1: set %2 led to %3 %4',
            roboid_hamster_s_change_led_by_rgb:
                'HamsterS %1: change %2 led by r: %3 g: %4 b: %5 %6',
            roboid_hamster_s_set_led_to_rgb: 'HamsterS %1: set %2 led to r: %3 g: %4 b: %5 %6',
            roboid_hamster_s_clear_led: 'HamsterS %1: clear %2 led %3',
            roboid_hamster_s_play_sound_times: 'HamsterS %1: play sound %2 %3 times %4',
            roboid_hamster_s_play_sound_times_until_done:
                'HamsterS %1: play sound %2 %3 times until done %4',
            roboid_hamster_s_change_buzzer_by: 'HamsterS %1: change buzzer by %2 %3',
            roboid_hamster_s_set_buzzer_to: 'HamsterS %1: set buzzer to %2 %3',
            roboid_hamster_s_clear_sound: 'HamsterS %1: clear sound %2',
            roboid_hamster_s_play_note: 'HamsterS %1: play note %2 %3 %4',
            roboid_hamster_s_play_note_for: 'HamsterS %1: play note %2 %3 for %4 beats %5',
            roboid_hamster_s_rest_for: 'HamsterS %1: rest for %2 beats %3',
            roboid_hamster_s_change_tempo_by: 'HamsterS %1: change tempo by %2 %3',
            roboid_hamster_s_set_tempo_to: 'HamsterS %1: set tempo to %2 bpm %3',
            roboid_hamster_s_set_port_to: 'HamsterS %1: set port %2 to %3 %4',
            roboid_hamster_s_change_output_by: 'HamsterS %1: change output %2 by %3 %4',
            roboid_hamster_s_set_output_to: 'HamsterS %1: set output %2 to %3 %4',
            roboid_hamster_s_gripper: 'HamsterS %1: %2 gripper %3',
            roboid_hamster_s_release_gripper: 'HamsterS %1: release gripper %2',
            roboid_hamster_s_write_serial: 'HamsterS %1: write %2 %3 to serial %4',
            roboid_hamster_s_read_serial_until: 'HamsterS %1: read serial %2 %3',
            roboid_hamster_s_set_serial_rate_to: 'HamsterS %1: set serial rate to %2 Bd %3',
            roboid_turtle_button_state: 'Turtle %1: button %2 ?',
            roboid_turtle_change_buzzer_by: 'Turtle %1: change buzzer by %2 %3',
            roboid_turtle_change_head_led_by_rgb:
                'Turtle %1: change head led by r: %2 g: %3 b: %4 %5',
            roboid_turtle_change_tempo_by: 'Turtle %1: change tempo by %2 %3',
            roboid_turtle_change_wheel_by: 'Turtle %1: change %2 wheel by %3 %4',
            roboid_turtle_change_wheels_by_left_right:
                'Turtle %1: change wheels by left: %2 right: %3 %4',
            roboid_turtle_clear_head_led: 'Turtle %1: clear head led %2',
            roboid_turtle_clear_sound: 'Turtle %1: clear sound %2',
            roboid_turtle_cross_intersection: 'Turtle %1: cross black intersection %2',
            roboid_turtle_follow_line: 'Turtle %1: follow %2 line %3',
            roboid_turtle_follow_line_until: 'Turtle %1: follow black line until %2 %3',
            roboid_turtle_follow_line_until_black: 'Turtle %1: follow %2 line until black %3',
            roboid_turtle_is_color_pattern: 'Turtle %1: color pattern %2 %3 ?',
            roboid_turtle_move_backward_unit: 'Turtle %1: move backward %2 %3 %4',
            roboid_turtle_move_forward_unit: 'Turtle %1: move forward %2 %3 %4',
            roboid_turtle_pivot_around_wheel_unit_in_direction:
                'Turtle %1: pivot around %2 wheel %3 %4 in %5 direction %6',
            roboid_turtle_play_note: 'Turtle %1: play note %2 %3 %4',
            roboid_turtle_play_note_for_beats: 'Turtle %1: play note %2 %3 for %4 beats %5',
            roboid_turtle_play_sound_times: 'Turtle %1: play sound %2 %3 times %4',
            roboid_turtle_play_sound_times_until_done:
                'Turtle %1: play sound %2 %3 times until done %4',
            roboid_turtle_rest_for_beats: 'Turtle %1: rest for %2 beats %3',
            roboid_turtle_set_buzzer_to: 'Turtle %1: set buzzer to %2 %3',
            roboid_turtle_set_following_speed_to: 'Turtle %1: set following speed to %2 %3',
            roboid_turtle_set_head_led_to: 'Turtle %1: set head led to %2 %3',
            roboid_turtle_set_head_led_to_rgb: 'Turtle %1: set head led to r: %2 g: %3 b: %4 %5',
            roboid_turtle_set_tempo_to: 'Turtle %1: set tempo to %2 bpm %3',
            roboid_turtle_set_wheel_to: 'Turtle %1: set %2 wheel to %3 %4',
            roboid_turtle_set_wheels_to_left_right:
                'Turtle %1: set wheels to left: %2 right: %3 %4',
            roboid_turtle_stop: 'Turtle %1: stop %2',
            roboid_turtle_touching_color: 'Turtle %1: touching %2 ?',
            roboid_turtle_turn_at_intersection: 'Turtle %1: turn %2 at black intersection %3',
            roboid_turtle_turn_unit_in_place: 'Turtle %1: turn %2 %3 %4 in place %5',
            roboid_turtle_turn_unit_with_radius_in_direction:
                'Turtle %1: turn %2 %3 %4 with radius %5 cm in %6 direction %7',
            roboid_turtle_value: 'Turtle %1: %2',
            roboid_turtle_boolean: 'Turtle %1: %2?',
            roboid_turtle_pick_head_led: 'Turtle %1: set head led to %2 %3',
        },
        Helper: {
            roboid_hamster_gripper: 'Opens or closes the gripper.',
            roboid_hamster_release_gripper: 'Turns off the gripper so that it can be moved freely.',
            roboid_hamster_boolean:
                'tilt forward: If tilted forward, true, otherwise false<br/>tilt backward: If tilted backward, true, otherwise false<br/>tilt left: If tilted to the left, true, otherwise false<br/>tilt right: If tilted to the right, true, otherwise false<br/>tilt flip: If upside-down, true, otherwise false<br/>not tilt: If not tilted, true, otherwise false<br/>battery normal: If the battery is enough, true, otherwise false<br/>battery low: If the battery is low, true, otherwise false<br/>battery empty: If the battery is empty, true, otherwise false',
            roboid_hamster_play_note: 'It sounds the selected tone and octave.',
            roboid_hamster_s_hand_found:
                'If there is a hand or object in front of the proximity sensor, true, otherwise false',
            roboid_hamster_s_boolean:
                'tilt forward: If tilted forward, true, otherwise false<br/>tilt backward: If tilted backward, true, otherwise false<br/>tilt left: If tilted to the left, true, otherwise false<br/>tilt right: If tilted to the right, true, otherwise false<br/>tilt flip: If upside-down, true, otherwise false<br/>not tilt: If not tilted, true, otherwise false<br/>battery normal: If the battery is enough, true, otherwise false<br/>battery low: If the battery is low, true, otherwise false<br/>battery empty: If the battery is empty, true, otherwise false',
            roboid_hamster_s_value:
                'left proximity: value of left proximity sensor (range: 0 to 255, initial value: 0)<br/>right proximity: value of right proximity sensor (range: 0 to 255, initial value: 0)<br/>left floor: value of left floor sensor (range: 0 to 100, initial value: 0)<br/>right floor: value of right floor sensor (range: 0 to 100, initial value: 0)<br/>x acceleration: x-axis value of acceleration sensor (range: -32768 to 32767, initial value: 0) The direction in which the robot moves forward is the positive direction of the x axis.<br/>y acceleration: y-axis value of acceleration sensor (range: -32768 to 32767, initial value: 0) The left direction of the robot is the positive direction of the y axis.<br/>z acceleration: z-axis value of acceleration sensor (range: -32768 to 32767, initial value: 0) The upward direction of the robot is the positive direction of the z axis.<br/>light: value of light sensor (range: 0 to 65535, initial value: 0) The brighter, the larger the value.<br/>temperature: temperature value inside the robot (range: -40 to 88 degrees Celsius, initial value: 0)<br/>signal strength: signal strength of Bluetooth communication (range: -128 to 0 dBm, initial value: 0) As the signal strength increases, the value increases.<br/>input A: value of signal input to external port A (range: analog input 0 to 255, digital input 0 or 1, initial value: 0)<br/>input B: value of signal input to external port B (range: analog input 0 to 255, digital input 0 or 1, initial value: 0)',
            roboid_hamster_s_move_forward_once: 'Moves one space forward on the board.',
            roboid_hamster_s_turn_once: 'Turns left/right 90 degrees on the board.',
            roboid_hamster_s_move_forward_unit:
                'Moves forward for the number of cm/seconds/pulses entered.',
            roboid_hamster_s_move_backward_unit:
                'Moves backward for the number of cm/seconds/pulses entered.',
            roboid_hamster_s_turn_unit_in_place:
                'Turns left/right in place for the number of degrees/seconds/pulses entered.',
            roboid_hamster_s_pivot_around_unit_in_direction:
                'Pivots around the left/right pen/wheel in the forward/backward direction for the number of degrees/seconds/pulses entered.',
            roboid_hamster_s_turn_unit_with_radius_in_direction:
                'Turns left/right so that the left/right pen draws the circle of the entered radius in the forward/backward direction for the number of degrees/seconds/pulses entered.',
            roboid_hamster_s_change_both_wheels_by:
                'Adds the entered values to the current speed values (%) of the left and right wheels respectively. If the result is positive, the wheel rotates forward; if negative, the wheel rotates backward.',
            roboid_hamster_s_set_both_wheels_to:
                'Sets the speed of the left and right wheels to the entered values (-100 to 100%), respectively. If you enter a positive value, the wheel rotates forward. If you enter a negative value, the wheel rotates backward. Entering the number 0 stops it.',
            roboid_hamster_s_change_wheel_by:
                'Adds the entered value to the current speed value (%) of the left/right/both wheels. If the result is positive, the wheel rotates forward; if negative, the wheel rotates backward.',
            roboid_hamster_s_set_wheel_to:
                'Sets the speed of the left/right/both wheels to the entered value (-100 to 100%). If you enter a positive value, the wheel rotates forward. If you enter a negative value, the wheel rotates backward. Entering the number 0 stops it.',
            roboid_hamster_s_follow_line_using:
                'Moves along the black/white line by using the left/right/both floor sensors.',
            roboid_hamster_s_follow_line_until:
                'Moves along the black/white line on the left/right/front/back, then stops when the robot meets the intersection.',
            roboid_hamster_s_set_following_speed_to:
                'Sets the speed (1 to 8) to move along the line. The larger the number, the faster the movement.',
            roboid_hamster_s_set_following_gain_to:
                'Sets the directional variation (1 to 8) 선을 따라 이동하는 방향 변화량(1 ~ 8)을 설정합니다. 숫자가 클수록 급커브를 잘 따라가지만 직선에서 좌우로 더 흔들립니다.',
            roboid_hamster_s_stop: 'Stops both wheels.',
            roboid_hamster_s_set_led_to: 'Turns left/right/both LEDs to the selected color.',
            roboid_hamster_s_pick_led: 'Turns left/right/both LEDs to the selected color.',
            roboid_hamster_s_change_led_by_rgb:
                'Adds the entered values to the current R, G, B values of left/right/both LEDs, respectively.',
            roboid_hamster_s_set_led_to_rgb:
                'Sets the R, G, B values of left/right/both LEDs to the entered values.',
            roboid_hamster_s_clear_led: 'Turns off the left/right/both LEDs.',
            roboid_hamster_s_play_sound_times: 'Plays the selected sound as many times as entered.',
            roboid_hamster_s_play_sound_times_until_done:
                'Plays the selected sound as many times as entered, and waits for completion.',
            roboid_hamster_s_change_buzzer_by:
                'Adds the entered value to the current pitch (Hz) of the buzzer sound. You can enter up to two decimal places.',
            roboid_hamster_s_set_buzzer_to:
                'Sets the pitch of the buzzer sound to the entered value (Hz). You can enter up to two decimal places. Entering the number 0 turns off the buzzer sound.',
            roboid_hamster_s_clear_sound: 'Turns off sound.',
            roboid_hamster_s_play_note: 'It sounds the selected tone and octave.',
            roboid_hamster_s_play_note_for:
                'It sounds the selected tone and octave as much as the beat you entered.',
            roboid_hamster_s_rest_for: 'Rests as much as the beat you entered.',
            roboid_hamster_s_change_tempo_by:
                'Adds the entered value to the current BPM (beats per minute) of the playing or resting speed.',
            roboid_hamster_s_set_tempo_to:
                'Sets the playing or resting speed to the entered BPM (beats per minute).',
            roboid_hamster_s_set_port_to:
                'Sets the io mode of the selected external port to the selected mode.',
            roboid_hamster_s_change_output_by:
                'Adds the entered value to the current output value of the selected external port. The result will be in the following range depending on the mode of the external port.<br/>Servo output: valid range from 1 to 180 degrees; if 0, output 0 without PWM pulse<br/>PWM output: 0 to 100%, duty ratio (%) of ON state in PWM waveform<br/>Digital output: LOW when 0, otherwise HIGH',
            roboid_hamster_s_set_output_to:
                'Sets the output value of the selected external port to the entered value. The value has the following range according to the mode of external port.<br/>Servo output: valid range from 1 to 180 degrees; if 0, output 0 without PWM pulse<br/>PWM output: 0 to 100%, duty ratio (%) of ON state in PWM waveform<br/>Digital output: LOW when 0, otherwise HIGH',
            roboid_hamster_s_gripper: 'Opens or closes the gripper.',
            roboid_hamster_s_release_gripper:
                'Turns off the gripper so that it can be moved freely.',
            roboid_hamster_s_write_serial: 'Sends strings via serial communication.',
            roboid_hamster_s_read_serial_until:
                'Read the strings received by serial communication.',
            roboid_hamster_s_set_serial_rate_to: 'Sets the speed of serial communication.',
            roboid_turtle_button_state:
                'If the button clicked/double-clicked/long-pressed, true, otherwise false.',
            roboid_turtle_change_buzzer_by:
                'Adds the entered value to the current pitch (Hz) of the buzzer sound. You can enter up to two decimal places.',
            roboid_turtle_change_head_led_by_rgb:
                'Adds the entered values to the current R, G, B values of the head LED, respectively.',
            roboid_turtle_change_tempo_by:
                'Adds the entered value to the current BPM (beats per minute) of the playing or resting speed.',
            roboid_turtle_change_wheel_by:
                'Adds the entered value to the current speed value (%) of the left/right/both wheels. If the result is positive, the wheel rotates forward; if negative, the wheel rotates backward.',
            roboid_turtle_change_wheels_by_left_right:
                'Adds the entered values to the current speed values (%) of the left and right wheels respectively. If the result is positive, the wheel rotates forward; if negative, the wheel rotates backward.',
            roboid_turtle_clear_head_led: 'Turns off the head LED.',
            roboid_turtle_clear_sound: 'Turns off sound.',
            roboid_turtle_cross_intersection:
                'Moves forward for a moment at the black intersection, then finds the black line and moves again.',
            roboid_turtle_follow_line: 'Moves along the selected color line on a white background.',
            roboid_turtle_follow_line_until:
                'Moves along the black line on a white background and stops when the color sensor detects the selected color.',
            roboid_turtle_follow_line_until_black:
                'Moves along the selected color line on a white background and stops when the color sensor detects black.',
            roboid_turtle_is_color_pattern:
                'If the color sensor detects the selected color pattern, true, otherwise false.',
            roboid_turtle_move_backward_unit:
                'Moves backward for the number of cm/seconds/pulses entered.',
            roboid_turtle_move_forward_unit:
                'Moves forward for the number of cm/seconds/pulses entered.',
            roboid_turtle_pivot_around_wheel_unit_in_direction:
                'Pivots around the left/right wheel in the head/tail direction for the number of degrees/seconds/pulses entered.',
            roboid_turtle_play_note: 'It sounds the selected tone and octave.',
            roboid_turtle_play_note_for_beats:
                'It sounds the selected tone and octave as much as the beat you entered.',
            roboid_turtle_play_sound_times: 'Plays the selected sound as many times as entered.',
            roboid_turtle_play_sound_times_until_done:
                'Plays the selected sound as many times as entered, and waits for completion.',
            roboid_turtle_rest_for_beats: 'Rests as much as the beat you entered.',
            roboid_turtle_set_buzzer_to:
                'Sets the pitch of the buzzer sound to the entered value (Hz). You can enter up to two decimal places. Entering the number 0 turns off the buzzer sound.',
            roboid_turtle_set_following_speed_to:
                'Sets the speed (1 to 8) to move along the line. The larger the number, the faster the movement.',
            roboid_turtle_set_head_led_to: 'Turns the head LED to the selected color.',
            roboid_turtle_set_head_led_to_rgb:
                'Sets the R, G, B values of the head LED to the entered values.',
            roboid_turtle_set_tempo_to:
                'Sets the playing or resting speed to the entered BPM (beats per minute).',
            roboid_turtle_set_wheel_to:
                'Sets the speed of the left/right/both wheels to the entered value (-400 to 400%). If you enter a positive value, the wheel rotates forward. If you enter a negative value, the wheel rotates backward. Entering the number 0 stops it.',
            roboid_turtle_set_wheels_to_left_right:
                'Sets the speed of the left and right wheels to the entered values (-400 to 400%), respectively. If you enter a positive value, the wheel rotates forward. If you enter a negative value, the wheel rotates backward. Entering the number 0 stops it.',
            roboid_turtle_stop: 'Stops both wheels.',
            roboid_turtle_touching_color:
                'If the color sensor detects the selected color, true, otherwise false.',
            roboid_turtle_turn_at_intersection:
                'Moves forward for a moment at the black intersection, then turns left/right/back in place, finds the black line and moves again.',
            roboid_turtle_turn_unit_in_place:
                'Turns left/right in place for the number of degrees/seconds/pulses entered.',
            roboid_turtle_turn_unit_with_radius_in_direction:
                'Turns left/right drawing the circle of the entered radius in the head/tail direction for the number of degrees/seconds/pulses entered.',
            roboid_turtle_value:
                'color number: color number detected by the color sensor (range: -1 to 8, initial value: -1)<br/>color pattern: value of the color pattern detected by the color sensor (range: -1 ~ 88, initial value: -1) <br/>floor: value of floor sensor (range: 0 to 100, initial value: 0)<br/>button: status of the button (when pressed 1, otherwise 0, initial value: 0)<br/>x acceleration: x-axis value of acceleration sensor (range: -32768 to 32767, initial value: 0) The direction in which the robot moves forward is the positive direction of the x axis.<br/>y acceleration: y-axis value of acceleration sensor (range: -32768 to 32767, initial value: 0) The left direction of the robot is the positive direction of the y axis.<br/>z acceleration: z-axis value of acceleration sensor (range: -32768 to 32767, initial value: 0) The upward direction of the robot is the positive direction of the z axis.',
            roboid_turtle_boolean:
                'tilt forward: If tilted forward, true, otherwise false<br/>tilt backward: If tilted backward, true, otherwise false<br/>tilt left: If tilted to the left, true, otherwise false<br/>tilt right: If tilted to the right, true, otherwise false<br/>tilt flip: If upside-down, true, otherwise false<br/>not tilt: If not tilted, true, otherwise false<br/>battery normal: If the battery is enough, true, otherwise false<br/>battery low: If the battery is low, true, otherwise false<br/>battery empty: If the battery is empty, true, otherwise false',
            roboid_turtle_pick_head_led: 'Turns the head LED to the selected color.',
        },
        Blocks: {
            hamster_note_c: 'C',
            hamster_note_c_sharp: 'C♯(D♭)',
            hamster_note_d: 'D',
            hamster_note_d_sharp: 'D♯(E♭)',
            hamster_note_e: 'E',
            hamster_note_f: 'F',
            hamster_note_f_sharp: 'F♯(G♭)',
            hamster_note_g: 'G',
            hamster_note_g_sharp: 'G♯(A♭)',
            hamster_note_a: 'A',
            hamster_note_a_sharp: 'A♯(B♭)',
            hamster_note_b: 'B',
            hamster_tilt_forward: 'tilt forward',
            hamster_tilt_backward: 'tilt backward',
            hamster_tilt_left: 'tilt left',
            hamster_tilt_right: 'tilt right',
            hamster_tilt_flip: 'tilt flip',
            hamster_tilt_not: 'not tilt',
            hamster_battery_normal: 'battery normal',
            hamster_battery_low: 'battery low',
            hamster_battery_empty: 'battery empty',
            hamster_open_gripper: 'open',
            hamster_close_gripper: 'close',
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
            turtle_acceleration_x: 'x acceleration',
            turtle_acceleration_y: 'y acceleration',
            turtle_acceleration_z: 'z acceleration',
            turtle_back: 'back',
            turtle_both: 'both',
            turtle_button: 'button',
            turtle_buzzer: 'buzzer',
            turtle_clicked: 'clicked',
            turtle_color_any: 'any color',
            turtle_color_black: 'black',
            turtle_color_blue: 'blue',
            turtle_color_green: 'green',
            turtle_color_number: 'color number',
            turtle_color_orange: 'orange',
            turtle_color_pattern: 'color pattern',
            turtle_color_purple: 'purple',
            turtle_color_red: 'red',
            turtle_color_sky_blue: 'sky blue',
            turtle_color_violet: 'violet',
            turtle_color_white: 'white',
            turtle_color_yellow: 'yellow',
            turtle_double_clicked: 'double-clicked',
            turtle_floor: 'floor',
            turtle_head: 'head',
            turtle_head_color: 'head color',
            turtle_left: 'left',
            turtle_left_wheel: 'left wheel',
            turtle_long_pressed: 'long-pressed',
            turtle_note: 'note',
            turtle_right: 'right',
            turtle_right_wheel: 'right wheel',
            turtle_sound_beep: 'beep',
            turtle_sound_birthday: 'birthday',
            turtle_sound_dibidibidip: 'dibidibidip',
            turtle_sound_engine: 'engine',
            turtle_sound_good_job: 'good job',
            turtle_sound_march: 'march',
            turtle_sound_random_beep: 'random beep',
            turtle_sound_robot: 'robot',
            turtle_sound_siren: 'siren',
            turtle_tail: 'tail',
            turtle_unit_cm: 'cm',
            turtle_unit_deg: 'degrees',
            turtle_unit_pulse: 'pulses',
            turtle_unit_sec: 'seconds',
            turtle_note_c: 'C',
            turtle_note_c_sharp: 'C♯(D♭)',
            turtle_note_d: 'D',
            turtle_note_d_sharp: 'D♯(E♭)',
            turtle_note_e: 'E',
            turtle_note_f: 'F',
            turtle_note_f_sharp: 'F♯(G♭)',
            turtle_note_g: 'G',
            turtle_note_g_sharp: 'G♯(A♭)',
            turtle_note_a: 'A',
            turtle_note_a_sharp: 'A♯(B♭)',
            turtle_note_b: 'B',
            turtle_tilt_forward: 'tilt forward',
            turtle_tilt_backward: 'tilt backward',
            turtle_tilt_left: 'tilt left',
            turtle_tilt_right: 'tilt right',
            turtle_tilt_flip: 'tilt flip',
            turtle_tilt_not: 'not tilt',
            turtle_battery_normal: 'battery normal',
            turtle_battery_low: 'battery low',
            turtle_battery_empty: 'battery empty',
        },
    },
});

Entry.Roboid.blockMenuBlocks = [
    'roboid_hamster_hand_found',
    'roboid_hamster_boolean',
    'roboid_hamster_value',
    'roboid_hamster_move_forward_once',
    'roboid_hamster_turn_once',
    'roboid_hamster_move_forward_for_secs',
    'roboid_hamster_move_backward_for_secs',
    'roboid_hamster_turn_for_secs',
    'roboid_hamster_change_both_wheels_by',
    'roboid_hamster_set_both_wheels_to',
    'roboid_hamster_change_wheel_by',
    'roboid_hamster_set_wheel_to',
    'roboid_hamster_follow_line_using',
    'roboid_hamster_follow_line_until',
    'roboid_hamster_set_following_speed_to',
    'roboid_hamster_stop',
    'roboid_hamster_set_led_to',
    'roboid_hamster_clear_led',
    'roboid_hamster_beep',
    'roboid_hamster_change_buzzer_by',
    'roboid_hamster_set_buzzer_to',
    'roboid_hamster_clear_buzzer',
    'roboid_hamster_play_note',
    'roboid_hamster_play_note_for',
    'roboid_hamster_rest_for',
    'roboid_hamster_change_tempo_by',
    'roboid_hamster_set_tempo_to',
    'roboid_hamster_set_port_to',
    'roboid_hamster_change_output_by',
    'roboid_hamster_set_output_to',
    'roboid_hamster_gripper',
    'roboid_hamster_release_gripper',
    'roboid_hamster_s_hand_found',
    'roboid_hamster_s_boolean',
    'roboid_hamster_s_value',
    'roboid_hamster_s_move_forward_once',
    'roboid_hamster_s_turn_once',
    'roboid_hamster_s_move_forward_unit',
    'roboid_hamster_s_move_backward_unit',
    'roboid_hamster_s_turn_unit_in_place',
    'roboid_hamster_s_pivot_around_unit_in_direction',
    'roboid_hamster_s_turn_unit_with_radius_in_direction',
    'roboid_hamster_s_change_both_wheels_by',
    'roboid_hamster_s_set_both_wheels_to',
    'roboid_hamster_s_change_wheel_by',
    'roboid_hamster_s_set_wheel_to',
    'roboid_hamster_s_follow_line_using',
    'roboid_hamster_s_follow_line_until',
    'roboid_hamster_s_set_following_speed_to',
    'roboid_hamster_s_set_following_gain_to',
    'roboid_hamster_s_stop',
    'roboid_hamster_s_set_led_to',
    'roboid_hamster_s_pick_led',
    'roboid_hamster_s_change_led_by_rgb',
    'roboid_hamster_s_set_led_to_rgb',
    'roboid_hamster_s_clear_led',
    'roboid_hamster_s_play_sound_times',
    'roboid_hamster_s_play_sound_times_until_done',
    'roboid_hamster_s_change_buzzer_by',
    'roboid_hamster_s_set_buzzer_to',
    'roboid_hamster_s_clear_sound',
    'roboid_hamster_s_play_note',
    'roboid_hamster_s_play_note_for',
    'roboid_hamster_s_rest_for',
    'roboid_hamster_s_change_tempo_by',
    'roboid_hamster_s_set_tempo_to',
    'roboid_hamster_s_set_port_to',
    'roboid_hamster_s_change_output_by',
    'roboid_hamster_s_set_output_to',
    'roboid_hamster_s_gripper',
    'roboid_hamster_s_release_gripper',
    'roboid_hamster_s_write_serial',
    'roboid_hamster_s_read_serial_until',
    'roboid_hamster_s_set_serial_rate_to',
    'roboid_turtle_touching_color',
    'roboid_turtle_is_color_pattern',
    'roboid_turtle_button_state',
    'roboid_turtle_boolean',
    'roboid_turtle_value',
    'roboid_turtle_move_forward_unit',
    'roboid_turtle_move_backward_unit',
    'roboid_turtle_turn_unit_in_place',
    'roboid_turtle_pivot_around_wheel_unit_in_direction',
    'roboid_turtle_turn_unit_with_radius_in_direction',
    'roboid_turtle_change_wheels_by_left_right',
    'roboid_turtle_set_wheels_to_left_right',
    'roboid_turtle_change_wheel_by',
    'roboid_turtle_set_wheel_to',
    'roboid_turtle_follow_line',
    'roboid_turtle_follow_line_until',
    'roboid_turtle_follow_line_until_black',
    'roboid_turtle_cross_intersection',
    'roboid_turtle_turn_at_intersection',
    'roboid_turtle_set_following_speed_to',
    'roboid_turtle_stop',
    'roboid_turtle_set_head_led_to',
    'roboid_turtle_pick_head_led',
    'roboid_turtle_change_head_led_by_rgb',
    'roboid_turtle_set_head_led_to_rgb',
    'roboid_turtle_clear_head_led',
    'roboid_turtle_play_sound_times',
    'roboid_turtle_play_sound_times_until_done',
    'roboid_turtle_change_buzzer_by',
    'roboid_turtle_set_buzzer_to',
    'roboid_turtle_clear_sound',
    'roboid_turtle_play_note',
    'roboid_turtle_play_note_for_beats',
    'roboid_turtle_rest_for_beats',
    'roboid_turtle_change_tempo_by',
    'roboid_turtle_set_tempo_to',
];

Entry.Roboid.getBlocks = function() {
    return {
        roboid_hamster_hand_found: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'text',
                        params: ['0'],
                    },
                ],
                type: 'roboid_hamster_hand_found',
            },
            paramsKeyMap: {
                INDEX: 0,
            },
            class: 'hamster_sensor',
            isNotFor: ['roboid'],
            func(sprite, script) {
                const index = script.getNumberValue('INDEX');
                const robot = Entry.Roboid.getHamster(index);
                return robot ? robot.checkHandFound(script) : false;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Roboid.hamster_hand_found(%1)',
                        blockType: 'param',
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
        roboid_hamster_boolean: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.hamster_tilt_forward, 'TILT_FORWARD'],
                        [Lang.Blocks.hamster_tilt_backward, 'TILT_BACKWARD'],
                        [Lang.Blocks.hamster_tilt_left, 'TILT_LEFT'],
                        [Lang.Blocks.hamster_tilt_right, 'TILT_RIGHT'],
                        [Lang.Blocks.hamster_tilt_flip, 'TILT_FLIP'],
                        [Lang.Blocks.hamster_tilt_not, 'TILT_NOT'],
                        [Lang.Blocks.hamster_battery_normal, 'BATTERY_NORMAL'],
                        [Lang.Blocks.hamster_battery_low, 'BATTERY_LOW'],
                        [Lang.Blocks.hamster_battery_empty, 'BATTERY_EMPTY'],
                    ],
                    value: 'TILT_FORWARD',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'text',
                        params: ['0'],
                    },
                    null,
                ],
                type: 'roboid_hamster_boolean',
            },
            paramsKeyMap: {
                INDEX: 0,
                DEVICE: 1,
            },
            class: 'hamster_sensor',
            isNotFor: ['roboid'],
            func(sprite, script) {
                const index = script.getNumberValue('INDEX');
                const robot = Entry.Roboid.getHamster(index);
                return robot ? robot.checkBoolean(script) : false;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Roboid.hamster_boolean_value(%1, %2)',
                        blockType: 'param',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.hamster_tilt_forward, 'TILT_FORWARD'],
                                    [Lang.Blocks.hamster_tilt_backward, 'TILT_BACKWARD'],
                                    [Lang.Blocks.hamster_tilt_left, 'TILT_LEFT'],
                                    [Lang.Blocks.hamster_tilt_right, 'TILT_RIGHT'],
                                    [Lang.Blocks.hamster_tilt_flip, 'TILT_FLIP'],
                                    [Lang.Blocks.hamster_tilt_not, 'TILT_NOT'],
                                    [Lang.Blocks.hamster_battery_normal, 'BATTERY_NORMAL'],
                                    [Lang.Blocks.hamster_battery_low, 'BATTERY_LOW'],
                                    [Lang.Blocks.hamster_battery_empty, 'BATTERY_EMPTY'],
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
        roboid_hamster_value: {
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
                        [Lang.Blocks.HAMSTER_sensor_left_proximity, 'leftProximity'],
                        [Lang.Blocks.HAMSTER_sensor_right_proximity, 'rightProximity'],
                        [Lang.Blocks.HAMSTER_sensor_left_floor, 'leftFloor'],
                        [Lang.Blocks.HAMSTER_sensor_right_floor, 'rightFloor'],
                        [Lang.Blocks.HAMSTER_sensor_acceleration_x, 'accelerationX'],
                        [Lang.Blocks.HAMSTER_sensor_acceleration_y, 'accelerationY'],
                        [Lang.Blocks.HAMSTER_sensor_acceleration_z, 'accelerationZ'],
                        [Lang.Blocks.HAMSTER_sensor_light, 'light'],
                        [Lang.Blocks.HAMSTER_sensor_temperature, 'temperature'],
                        [Lang.Blocks.HAMSTER_sensor_signal_strength, 'signalStrength'],
                        [Lang.Blocks.HAMSTER_sensor_input_a, 'inputA'],
                        [Lang.Blocks.HAMSTER_sensor_input_b, 'inputB'],
                    ],
                    value: 'leftProximity',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'text',
                        params: ['0'],
                    },
                    null,
                ],
                type: 'roboid_hamster_value',
            },
            paramsKeyMap: {
                INDEX: 0,
                DEVICE: 1,
            },
            class: 'hamster_sensor',
            isNotFor: ['roboid'],
            func(sprite, script) {
                const index = script.getNumberValue('INDEX');
                const robot = Entry.Roboid.getHamster(index);
                if (robot) {
                    return robot.getValue(script);
                }
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Roboid.hamster_sensor_value(%1, %2)',
                        blockType: 'param',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.HAMSTER_sensor_left_proximity, 'leftProximity'],
                                    [Lang.Blocks.HAMSTER_sensor_right_proximity, 'rightProximity'],
                                    [Lang.Blocks.HAMSTER_sensor_left_floor, 'leftFloor'],
                                    [Lang.Blocks.HAMSTER_sensor_right_floor, 'rightFloor'],
                                    [Lang.Blocks.HAMSTER_sensor_acceleration_x, 'accelerationX'],
                                    [Lang.Blocks.HAMSTER_sensor_acceleration_y, 'accelerationY'],
                                    [Lang.Blocks.HAMSTER_sensor_acceleration_z, 'accelerationZ'],
                                    [Lang.Blocks.HAMSTER_sensor_light, 'light'],
                                    [Lang.Blocks.HAMSTER_sensor_temperature, 'temperature'],
                                    [Lang.Blocks.HAMSTER_sensor_signal_strength, 'signalStrength'],
                                    [Lang.Blocks.HAMSTER_sensor_input_a, 'inputA'],
                                    [Lang.Blocks.HAMSTER_sensor_input_b, 'inputB'],
                                ],
                                value: 'leftProximity',
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
        roboid_hamster_move_forward_once: {
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
                        params: ['0'],
                    },
                    null,
                ],
                type: 'roboid_hamster_move_forward_once',
            },
            paramsKeyMap: {
                INDEX: 0,
            },
            class: 'hamster_board',
            isNotFor: ['roboid'],
            func(sprite, script) {
                const index = script.getNumberValue('INDEX');
                const robot = Entry.Roboid.getHamster(index);
                return robot ? robot.boardForward(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Roboid.hamster_board_forward(%1)',
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
        roboid_hamster_turn_once: {
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
                        [Lang.Blocks.HAMSTER_turn_once_left, 'LEFT'],
                        [Lang.Blocks.HAMSTER_turn_right, 'RIGHT'],
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
                params: [
                    {
                        type: 'text',
                        params: ['0'],
                    },
                    null,
                    null,
                ],
                type: 'roboid_hamster_turn_once',
            },
            paramsKeyMap: {
                INDEX: 0,
                DIRECTION: 1,
            },
            class: 'hamster_board',
            isNotFor: ['roboid'],
            func(sprite, script) {
                const index = script.getNumberValue('INDEX');
                const robot = Entry.Roboid.getHamster(index);
                return robot ? robot.boardTurn(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Roboid.hamster_board_turn(%1, %2)',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.HAMSTER_turn_once_left, 'LEFT'],
                                    [Lang.Blocks.HAMSTER_turn_right, 'RIGHT'],
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
        roboid_hamster_move_forward_for_secs: {
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
                        params: ['0'],
                    },
                    {
                        type: 'text',
                        params: ['1'],
                    },
                    null,
                ],
                type: 'roboid_hamster_move_forward_for_secs',
            },
            paramsKeyMap: {
                INDEX: 0,
                SECS: 1,
            },
            class: 'hamster_wheel',
            isNotFor: ['roboid'],
            func(sprite, script) {
                const index = script.getNumberValue('INDEX');
                const robot = Entry.Roboid.getHamster(index);
                return robot ? robot.moveForwardSecs(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Roboid.hamster_move_forward(%1, %2)',
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
        roboid_hamster_move_backward_for_secs: {
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
                        params: ['0'],
                    },
                    {
                        type: 'text',
                        params: ['1'],
                    },
                    null,
                ],
                type: 'roboid_hamster_move_backward_for_secs',
            },
            paramsKeyMap: {
                INDEX: 0,
                SECS: 1,
            },
            class: 'hamster_wheel',
            isNotFor: ['roboid'],
            func(sprite, script) {
                const index = script.getNumberValue('INDEX');
                const robot = Entry.Roboid.getHamster(index);
                return robot ? robot.moveBackwardSecs(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Roboid.hamster_move_backward(%1, %2)',
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
        roboid_hamster_turn_for_secs: {
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
                        [Lang.Blocks.HAMSTER_turn_once_left, 'LEFT'],
                        [Lang.Blocks.HAMSTER_turn_right, 'RIGHT'],
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
                    {
                        type: 'text',
                        params: ['0'],
                    },
                    null,
                    {
                        type: 'text',
                        params: ['1'],
                    },
                    null,
                ],
                type: 'roboid_hamster_turn_for_secs',
            },
            paramsKeyMap: {
                INDEX: 0,
                DIRECTION: 1,
                SECS: 2,
            },
            class: 'hamster_wheel',
            isNotFor: ['roboid'],
            func(sprite, script) {
                const index = script.getNumberValue('INDEX');
                const robot = Entry.Roboid.getHamster(index);
                return robot ? robot.turnSecs(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Roboid.hamster_turn(%1, %2, %3)',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.HAMSTER_turn_once_left, 'LEFT'],
                                    [Lang.Blocks.HAMSTER_turn_right, 'RIGHT'],
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
        roboid_hamster_change_both_wheels_by: {
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
                        params: ['0'],
                    },
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
                type: 'roboid_hamster_change_both_wheels_by',
            },
            paramsKeyMap: {
                INDEX: 0,
                LEFT: 1,
                RIGHT: 2,
            },
            class: 'hamster_wheel',
            isNotFor: ['roboid'],
            func(sprite, script) {
                const index = script.getNumberValue('INDEX');
                const robot = Entry.Roboid.getHamster(index);
                return robot ? robot.changeWheels(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Roboid.hamster_add_wheels(%1, %2, %3)',
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
        roboid_hamster_set_both_wheels_to: {
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
                        params: ['0'],
                    },
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
                type: 'roboid_hamster_set_both_wheels_to',
            },
            paramsKeyMap: {
                INDEX: 0,
                LEFT: 1,
                RIGHT: 2,
            },
            class: 'hamster_wheel',
            isNotFor: ['roboid'],
            func(sprite, script) {
                const index = script.getNumberValue('INDEX');
                const robot = Entry.Roboid.getHamster(index);
                return robot ? robot.setWheels(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Roboid.hamster_set_wheels(%1, %2, %3)',
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
        roboid_hamster_change_wheel_by: {
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
                        [Lang.Blocks.HAMSTER_left_wheel, 'LEFT'],
                        [Lang.Blocks.HAMSTER_right_wheel, 'RIGHT'],
                        [Lang.Blocks.HAMSTER_both_wheels, 'BOTH'],
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
                    {
                        type: 'text',
                        params: ['0'],
                    },
                    null,
                    {
                        type: 'text',
                        params: ['10'],
                    },
                    null,
                ],
                type: 'roboid_hamster_change_wheel_by',
            },
            paramsKeyMap: {
                INDEX: 0,
                WHEEL: 1,
                VELOCITY: 2,
            },
            class: 'hamster_wheel',
            isNotFor: ['roboid'],
            func(sprite, script) {
                const index = script.getNumberValue('INDEX');
                const robot = Entry.Roboid.getHamster(index);
                return robot ? robot.changeWheel(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Roboid.hamster_add_wheel(%1, %2, %3)',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.HAMSTER_left_wheel, 'LEFT'],
                                    [Lang.Blocks.HAMSTER_right_wheel, 'RIGHT'],
                                    [Lang.Blocks.HAMSTER_both_wheels, 'BOTH'],
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
        roboid_hamster_set_wheel_to: {
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
                        [Lang.Blocks.HAMSTER_left_wheel, 'LEFT'],
                        [Lang.Blocks.HAMSTER_right_wheel, 'RIGHT'],
                        [Lang.Blocks.HAMSTER_both_wheels, 'BOTH'],
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
                    {
                        type: 'text',
                        params: ['0'],
                    },
                    null,
                    {
                        type: 'text',
                        params: ['30'],
                    },
                    null,
                ],
                type: 'roboid_hamster_set_wheel_to',
            },
            paramsKeyMap: {
                INDEX: 0,
                WHEEL: 1,
                VELOCITY: 2,
            },
            class: 'hamster_wheel',
            isNotFor: ['roboid'],
            func(sprite, script) {
                const index = script.getNumberValue('INDEX');
                const robot = Entry.Roboid.getHamster(index);
                return robot ? robot.setWheel(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Roboid.hamster_set_wheel(%1, %2, %3)',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.HAMSTER_left_wheel, 'LEFT'],
                                    [Lang.Blocks.HAMSTER_right_wheel, 'RIGHT'],
                                    [Lang.Blocks.HAMSTER_both_wheels, 'BOTH'],
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
        roboid_hamster_follow_line_using: {
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
                        [Lang.Blocks.HAMSTER_color_black, 'BLACK'],
                        [Lang.Blocks.HAMSTER_color_white, 'WHITE'],
                    ],
                    value: 'BLACK',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.HAMSTER_left_floor_sensor, 'LEFT'],
                        [Lang.Blocks.HAMSTER_right_floor_sensor, 'RIGHT'],
                        [Lang.Blocks.HAMSTER_both_floor_sensors, 'BOTH'],
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
                params: [
                    {
                        type: 'text',
                        params: ['0'],
                    },
                    null,
                    null,
                    null,
                ],
                type: 'roboid_hamster_follow_line_using',
            },
            paramsKeyMap: {
                INDEX: 0,
                COLOR: 1,
                SENSOR: 2,
            },
            class: 'hamster_wheel',
            isNotFor: ['roboid'],
            func(sprite, script) {
                const index = script.getNumberValue('INDEX');
                const robot = Entry.Roboid.getHamster(index);
                return robot ? robot.followLine(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Roboid.hamster_follow_line(%1, %2, %3)',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.HAMSTER_color_black, 'BLACK'],
                                    [Lang.Blocks.HAMSTER_color_white, 'WHITE'],
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
                                    [Lang.Blocks.HAMSTER_left_floor_sensor, 'LEFT'],
                                    [Lang.Blocks.HAMSTER_right_floor_sensor, 'RIGHT'],
                                    [Lang.Blocks.HAMSTER_both_floor_sensors, 'BOTH'],
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
        roboid_hamster_follow_line_until: {
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
                        [Lang.Blocks.HAMSTER_color_black, 'BLACK'],
                        [Lang.Blocks.HAMSTER_color_white, 'WHITE'],
                    ],
                    value: 'BLACK',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.HAMSTER_left_floor_sensor, 'LEFT'],
                        [Lang.Blocks.HAMSTER_right_floor_sensor, 'RIGHT'],
                        [Lang.Blocks.HAMSTER_front, 'FRONT'],
                        [Lang.Blocks.HAMSTER_rear, 'REAR'],
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
                params: [
                    {
                        type: 'text',
                        params: ['0'],
                    },
                    null,
                    null,
                    null,
                ],
                type: 'roboid_hamster_follow_line_until',
            },
            paramsKeyMap: {
                INDEX: 0,
                COLOR: 1,
                DIRECTION: 2,
            },
            class: 'hamster_wheel',
            isNotFor: ['roboid'],
            func(sprite, script) {
                const index = script.getNumberValue('INDEX');
                const robot = Entry.Roboid.getHamster(index);
                return robot ? robot.followLineUntil(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Roboid.hamster_follow_line_until(%1, %2, %3)',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.HAMSTER_color_black, 'BLACK'],
                                    [Lang.Blocks.HAMSTER_color_white, 'WHITE'],
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
                                    [Lang.Blocks.HAMSTER_left_floor_sensor, 'LEFT'],
                                    [Lang.Blocks.HAMSTER_right_floor_sensor, 'RIGHT'],
                                    [Lang.Blocks.HAMSTER_front, 'FRONT'],
                                    [Lang.Blocks.HAMSTER_rear, 'REAR'],
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
        roboid_hamster_set_following_speed_to: {
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
                params: [
                    {
                        type: 'text',
                        params: ['0'],
                    },
                    '5',
                    null,
                ],
                type: 'roboid_hamster_set_following_speed_to',
            },
            paramsKeyMap: {
                INDEX: 0,
                SPEED: 1,
            },
            class: 'hamster_wheel',
            isNotFor: ['roboid'],
            func(sprite, script) {
                const index = script.getNumberValue('INDEX');
                const robot = Entry.Roboid.getHamster(index);
                return robot ? robot.setLineTracerSpeed(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Roboid.hamster_set_line_speed(%1, %2)',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
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
        roboid_hamster_stop: {
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
                        params: ['0'],
                    },
                    null,
                ],
                type: 'roboid_hamster_stop',
            },
            paramsKeyMap: {
                INDEX: 0,
            },
            class: 'hamster_wheel',
            isNotFor: ['roboid'],
            func(sprite, script) {
                const index = script.getNumberValue('INDEX');
                const robot = Entry.Roboid.getHamster(index);
                return robot ? robot.stop(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Roboid.hamster_stop(%1)',
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
        roboid_hamster_set_led_to: {
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
                        [Lang.Blocks.HAMSTER_left_led, 'LEFT'],
                        [Lang.Blocks.HAMSTER_right_led, 'RIGHT'],
                        [Lang.Blocks.HAMSTER_both_leds, 'BOTH'],
                    ],
                    value: 'LEFT',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.HAMSTER_color_red, '4'],
                        [Lang.Blocks.HAMSTER_color_yellow, '6'],
                        [Lang.Blocks.HAMSTER_color_green, '2'],
                        [Lang.Blocks.HAMSTER_color_cyan, '3'],
                        [Lang.Blocks.HAMSTER_color_blue, '1'],
                        [Lang.Blocks.HAMSTER_color_magenta, '5'],
                        [Lang.Blocks.HAMSTER_color_white, '7'],
                    ],
                    value: '4',
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
                        params: ['0'],
                    },
                    null,
                    null,
                    null,
                ],
                type: 'roboid_hamster_set_led_to',
            },
            paramsKeyMap: {
                INDEX: 0,
                LED: 1,
                COLOR: 2,
            },
            class: 'hamster_led',
            isNotFor: ['roboid'],
            func(sprite, script) {
                const index = script.getNumberValue('INDEX');
                const robot = Entry.Roboid.getHamster(index);
                return robot ? robot.setLed(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Roboid.hamster_set_led_red(%1, %2)',
                        textParams: [
                            { type: 'Block', accept: 'string' },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.HAMSTER_left_led, 'LEFT'],
                                    [Lang.Blocks.HAMSTER_right_led, 'RIGHT'],
                                    [Lang.Blocks.HAMSTER_both_leds, 'BOTH'],
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
                                    [Lang.Blocks.HAMSTER_color_red, '4'],
                                    [Lang.Blocks.HAMSTER_color_yellow, '6'],
                                    [Lang.Blocks.HAMSTER_color_green, '2'],
                                    [Lang.Blocks.HAMSTER_color_cyan, '3'],
                                    [Lang.Blocks.HAMSTER_color_blue, '1'],
                                    [Lang.Blocks.HAMSTER_color_magenta, '5'],
                                    [Lang.Blocks.HAMSTER_color_white, '7'],
                                ],
                                value: '4',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                        ],
                        params: [null, null, '4'],
                    },
                    {
                        syntax: 'Roboid.hamster_set_led_yellow(%1, %2)',
                        textParams: [
                            { type: 'Block', accept: 'string' },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.HAMSTER_left_led, 'LEFT'],
                                    [Lang.Blocks.HAMSTER_right_led, 'RIGHT'],
                                    [Lang.Blocks.HAMSTER_both_leds, 'BOTH'],
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
                                    [Lang.Blocks.HAMSTER_color_red, '4'],
                                    [Lang.Blocks.HAMSTER_color_yellow, '6'],
                                    [Lang.Blocks.HAMSTER_color_green, '2'],
                                    [Lang.Blocks.HAMSTER_color_cyan, '3'],
                                    [Lang.Blocks.HAMSTER_color_blue, '1'],
                                    [Lang.Blocks.HAMSTER_color_magenta, '5'],
                                    [Lang.Blocks.HAMSTER_color_white, '7'],
                                ],
                                value: '4',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                        ],
                        params: [null, null, '6'],
                    },
                    {
                        syntax: 'Roboid.hamster_set_led_green(%1, %2)',
                        textParams: [
                            { type: 'Block', accept: 'string' },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.HAMSTER_left_led, 'LEFT'],
                                    [Lang.Blocks.HAMSTER_right_led, 'RIGHT'],
                                    [Lang.Blocks.HAMSTER_both_leds, 'BOTH'],
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
                                    [Lang.Blocks.HAMSTER_color_red, '4'],
                                    [Lang.Blocks.HAMSTER_color_yellow, '6'],
                                    [Lang.Blocks.HAMSTER_color_green, '2'],
                                    [Lang.Blocks.HAMSTER_color_cyan, '3'],
                                    [Lang.Blocks.HAMSTER_color_blue, '1'],
                                    [Lang.Blocks.HAMSTER_color_magenta, '5'],
                                    [Lang.Blocks.HAMSTER_color_white, '7'],
                                ],
                                value: '4',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                        ],
                        params: [null, null, '2'],
                    },
                    {
                        syntax: 'Roboid.hamster_set_led_sky_blue(%1, %2)',
                        textParams: [
                            { type: 'Block', accept: 'string' },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.HAMSTER_left_led, 'LEFT'],
                                    [Lang.Blocks.HAMSTER_right_led, 'RIGHT'],
                                    [Lang.Blocks.HAMSTER_both_leds, 'BOTH'],
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
                                    [Lang.Blocks.HAMSTER_color_red, '4'],
                                    [Lang.Blocks.HAMSTER_color_yellow, '6'],
                                    [Lang.Blocks.HAMSTER_color_green, '2'],
                                    [Lang.Blocks.HAMSTER_color_cyan, '3'],
                                    [Lang.Blocks.HAMSTER_color_blue, '1'],
                                    [Lang.Blocks.HAMSTER_color_magenta, '5'],
                                    [Lang.Blocks.HAMSTER_color_white, '7'],
                                ],
                                value: '4',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                        ],
                        params: [null, null, '3'],
                    },
                    {
                        syntax: 'Roboid.hamster_set_led_blue(%1, %2)',
                        textParams: [
                            { type: 'Block', accept: 'string' },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.HAMSTER_left_led, 'LEFT'],
                                    [Lang.Blocks.HAMSTER_right_led, 'RIGHT'],
                                    [Lang.Blocks.HAMSTER_both_leds, 'BOTH'],
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
                                    [Lang.Blocks.HAMSTER_color_red, '4'],
                                    [Lang.Blocks.HAMSTER_color_yellow, '6'],
                                    [Lang.Blocks.HAMSTER_color_green, '2'],
                                    [Lang.Blocks.HAMSTER_color_cyan, '3'],
                                    [Lang.Blocks.HAMSTER_color_blue, '1'],
                                    [Lang.Blocks.HAMSTER_color_magenta, '5'],
                                    [Lang.Blocks.HAMSTER_color_white, '7'],
                                ],
                                value: '4',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                        ],
                        params: [null, null, '1'],
                    },
                    {
                        syntax: 'Roboid.hamster_set_led_purple(%1, %2)',
                        textParams: [
                            { type: 'Block', accept: 'string' },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.HAMSTER_left_led, 'LEFT'],
                                    [Lang.Blocks.HAMSTER_right_led, 'RIGHT'],
                                    [Lang.Blocks.HAMSTER_both_leds, 'BOTH'],
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
                                    [Lang.Blocks.HAMSTER_color_red, '4'],
                                    [Lang.Blocks.HAMSTER_color_yellow, '6'],
                                    [Lang.Blocks.HAMSTER_color_green, '2'],
                                    [Lang.Blocks.HAMSTER_color_cyan, '3'],
                                    [Lang.Blocks.HAMSTER_color_blue, '1'],
                                    [Lang.Blocks.HAMSTER_color_magenta, '5'],
                                    [Lang.Blocks.HAMSTER_color_white, '7'],
                                ],
                                value: '4',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                        ],
                        params: [null, null, '5'],
                    },
                    {
                        syntax: 'Roboid.hamster_set_led_white(%1, %2)',
                        textParams: [
                            { type: 'Block', accept: 'string' },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.HAMSTER_left_led, 'LEFT'],
                                    [Lang.Blocks.HAMSTER_right_led, 'RIGHT'],
                                    [Lang.Blocks.HAMSTER_both_leds, 'BOTH'],
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
                                    [Lang.Blocks.HAMSTER_color_red, '4'],
                                    [Lang.Blocks.HAMSTER_color_yellow, '6'],
                                    [Lang.Blocks.HAMSTER_color_green, '2'],
                                    [Lang.Blocks.HAMSTER_color_cyan, '3'],
                                    [Lang.Blocks.HAMSTER_color_blue, '1'],
                                    [Lang.Blocks.HAMSTER_color_magenta, '5'],
                                    [Lang.Blocks.HAMSTER_color_white, '7'],
                                ],
                                value: '4',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                        ],
                        params: [null, null, '7'],
                    },
                ],
            },
        },
        roboid_hamster_clear_led: {
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
                        [Lang.Blocks.HAMSTER_left_led, 'LEFT'],
                        [Lang.Blocks.HAMSTER_right_led, 'RIGHT'],
                        [Lang.Blocks.HAMSTER_both_leds, 'BOTH'],
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
                params: [
                    {
                        type: 'text',
                        params: ['0'],
                    },
                    null,
                    null,
                ],
                type: 'roboid_hamster_clear_led',
            },
            paramsKeyMap: {
                INDEX: 0,
                LED: 1,
            },
            class: 'hamster_led',
            isNotFor: ['roboid'],
            func(sprite, script) {
                const index = script.getNumberValue('INDEX');
                const robot = Entry.Roboid.getHamster(index);
                return robot ? robot.clearLed(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Roboid.hamster_clear_led(%1, %2)',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.HAMSTER_left_led, 'LEFT'],
                                    [Lang.Blocks.HAMSTER_right_led, 'RIGHT'],
                                    [Lang.Blocks.HAMSTER_both_leds, 'BOTH'],
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
        roboid_hamster_beep: {
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
                        params: ['0'],
                    },
                    null,
                ],
                type: 'roboid_hamster_beep',
            },
            paramsKeyMap: {
                INDEX: 0,
            },
            class: 'hamster_buzzer',
            isNotFor: ['roboid'],
            func(sprite, script) {
                const index = script.getNumberValue('INDEX');
                const robot = Entry.Roboid.getHamster(index);
                return robot ? robot.beep(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Roboid.hamster_beep(%1)',
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
        roboid_hamster_change_buzzer_by: {
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
                        params: ['0'],
                    },
                    {
                        type: 'text',
                        params: ['10'],
                    },
                    null,
                ],
                type: 'roboid_hamster_change_buzzer_by',
            },
            paramsKeyMap: {
                INDEX: 0,
                HZ: 1,
            },
            class: 'hamster_buzzer',
            isNotFor: ['roboid'],
            func(sprite, script) {
                const index = script.getNumberValue('INDEX');
                const robot = Entry.Roboid.getHamster(index);
                return robot ? robot.changeBuzzer(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Roboid.hamster_add_buzzer(%1, %2)',
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
        roboid_hamster_set_buzzer_to: {
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
                        params: ['0'],
                    },
                    {
                        type: 'text',
                        params: ['1000'],
                    },
                    null,
                ],
                type: 'roboid_hamster_set_buzzer_to',
            },
            paramsKeyMap: {
                INDEX: 0,
                HZ: 1,
            },
            class: 'hamster_buzzer',
            isNotFor: ['roboid'],
            func(sprite, script) {
                const index = script.getNumberValue('INDEX');
                const robot = Entry.Roboid.getHamster(index);
                return robot ? robot.setBuzzer(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Roboid.hamster_set_buzzer(%1, %2)',
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
        roboid_hamster_clear_buzzer: {
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
                        params: ['0'],
                    },
                    null,
                ],
                type: 'roboid_hamster_clear_buzzer',
            },
            paramsKeyMap: {
                INDEX: 0,
            },
            class: 'hamster_buzzer',
            isNotFor: ['roboid'],
            func(sprite, script) {
                const index = script.getNumberValue('INDEX');
                const robot = Entry.Roboid.getHamster(index);
                return robot ? robot.clearBuzzer(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Roboid.hamster_clear_buzzer(%1)',
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
        roboid_hamster_play_note: {
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
                        [Lang.Blocks.hamster_note_c, '4'],
                        [Lang.Blocks.hamster_note_c_sharp, '5'],
                        [Lang.Blocks.hamster_note_d, '6'],
                        [Lang.Blocks.hamster_note_d_sharp, '7'],
                        [Lang.Blocks.hamster_note_e, '8'],
                        [Lang.Blocks.hamster_note_f, '9'],
                        [Lang.Blocks.hamster_note_f_sharp, '10'],
                        [Lang.Blocks.hamster_note_g, '11'],
                        [Lang.Blocks.hamster_note_g_sharp, '12'],
                        [Lang.Blocks.hamster_note_a, '13'],
                        [Lang.Blocks.hamster_note_a_sharp, '14'],
                        [Lang.Blocks.hamster_note_b, '15'],
                    ],
                    value: '4',
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
                params: [
                    {
                        type: 'text',
                        params: ['0'],
                    },
                    null,
                    '4',
                    null,
                ],
                type: 'roboid_hamster_play_note',
            },
            paramsKeyMap: {
                INDEX: 0,
                NOTE: 1,
                OCTAVE: 2,
            },
            class: 'hamster_buzzer',
            isNotFor: ['roboid'],
            func(sprite, script) {
                const index = script.getNumberValue('INDEX');
                const robot = Entry.Roboid.getHamster(index);
                return robot ? robot.playNote(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Roboid.hamster_play_pitch_c(%1, %3)',
                        textParams: [
                            { type: 'Block', accept: 'string' },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.hamster_note_c, '4'],
                                    [Lang.Blocks.hamster_note_c_sharp, '5'],
                                    [Lang.Blocks.hamster_note_d, '6'],
                                    [Lang.Blocks.hamster_note_d_sharp, '7'],
                                    [Lang.Blocks.hamster_note_e, '8'],
                                    [Lang.Blocks.hamster_note_f, '9'],
                                    [Lang.Blocks.hamster_note_f_sharp, '10'],
                                    [Lang.Blocks.hamster_note_g, '11'],
                                    [Lang.Blocks.hamster_note_g_sharp, '12'],
                                    [Lang.Blocks.hamster_note_a, '13'],
                                    [Lang.Blocks.hamster_note_a_sharp, '14'],
                                    [Lang.Blocks.hamster_note_b, '15'],
                                ],
                                value: '4',
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
                        params: [null, '4'],
                    },
                    {
                        syntax: 'Roboid.hamster_play_pitch_c_sharp(%1, %3)',
                        textParams: [
                            { type: 'Block', accept: 'string' },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.hamster_note_c, '4'],
                                    [Lang.Blocks.hamster_note_c_sharp, '5'],
                                    [Lang.Blocks.hamster_note_d, '6'],
                                    [Lang.Blocks.hamster_note_d_sharp, '7'],
                                    [Lang.Blocks.hamster_note_e, '8'],
                                    [Lang.Blocks.hamster_note_f, '9'],
                                    [Lang.Blocks.hamster_note_f_sharp, '10'],
                                    [Lang.Blocks.hamster_note_g, '11'],
                                    [Lang.Blocks.hamster_note_g_sharp, '12'],
                                    [Lang.Blocks.hamster_note_a, '13'],
                                    [Lang.Blocks.hamster_note_a_sharp, '14'],
                                    [Lang.Blocks.hamster_note_b, '15'],
                                ],
                                value: '4',
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
                        params: [null, '5'],
                    },
                    {
                        syntax: 'Roboid.hamster_play_pitch_d(%1, %3)',
                        textParams: [
                            { type: 'Block', accept: 'string' },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.hamster_note_c, '4'],
                                    [Lang.Blocks.hamster_note_c_sharp, '5'],
                                    [Lang.Blocks.hamster_note_d, '6'],
                                    [Lang.Blocks.hamster_note_d_sharp, '7'],
                                    [Lang.Blocks.hamster_note_e, '8'],
                                    [Lang.Blocks.hamster_note_f, '9'],
                                    [Lang.Blocks.hamster_note_f_sharp, '10'],
                                    [Lang.Blocks.hamster_note_g, '11'],
                                    [Lang.Blocks.hamster_note_g_sharp, '12'],
                                    [Lang.Blocks.hamster_note_a, '13'],
                                    [Lang.Blocks.hamster_note_a_sharp, '14'],
                                    [Lang.Blocks.hamster_note_b, '15'],
                                ],
                                value: '4',
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
                        params: [null, '6'],
                    },
                    {
                        syntax: 'Roboid.hamster_play_pitch_d_sharp(%1, %3)',
                        textParams: [
                            { type: 'Block', accept: 'string' },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.hamster_note_c, '4'],
                                    [Lang.Blocks.hamster_note_c_sharp, '5'],
                                    [Lang.Blocks.hamster_note_d, '6'],
                                    [Lang.Blocks.hamster_note_d_sharp, '7'],
                                    [Lang.Blocks.hamster_note_e, '8'],
                                    [Lang.Blocks.hamster_note_f, '9'],
                                    [Lang.Blocks.hamster_note_f_sharp, '10'],
                                    [Lang.Blocks.hamster_note_g, '11'],
                                    [Lang.Blocks.hamster_note_g_sharp, '12'],
                                    [Lang.Blocks.hamster_note_a, '13'],
                                    [Lang.Blocks.hamster_note_a_sharp, '14'],
                                    [Lang.Blocks.hamster_note_b, '15'],
                                ],
                                value: '4',
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
                        params: [null, '7'],
                    },
                    {
                        syntax: 'Roboid.hamster_play_pitch_e(%1, %3)',
                        textParams: [
                            { type: 'Block', accept: 'string' },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.hamster_note_c, '4'],
                                    [Lang.Blocks.hamster_note_c_sharp, '5'],
                                    [Lang.Blocks.hamster_note_d, '6'],
                                    [Lang.Blocks.hamster_note_d_sharp, '7'],
                                    [Lang.Blocks.hamster_note_e, '8'],
                                    [Lang.Blocks.hamster_note_f, '9'],
                                    [Lang.Blocks.hamster_note_f_sharp, '10'],
                                    [Lang.Blocks.hamster_note_g, '11'],
                                    [Lang.Blocks.hamster_note_g_sharp, '12'],
                                    [Lang.Blocks.hamster_note_a, '13'],
                                    [Lang.Blocks.hamster_note_a_sharp, '14'],
                                    [Lang.Blocks.hamster_note_b, '15'],
                                ],
                                value: '4',
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
                        params: [null, '8'],
                    },
                    {
                        syntax: 'Roboid.hamster_play_pitch_f(%1, %3)',
                        textParams: [
                            { type: 'Block', accept: 'string' },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.hamster_note_c, '4'],
                                    [Lang.Blocks.hamster_note_c_sharp, '5'],
                                    [Lang.Blocks.hamster_note_d, '6'],
                                    [Lang.Blocks.hamster_note_d_sharp, '7'],
                                    [Lang.Blocks.hamster_note_e, '8'],
                                    [Lang.Blocks.hamster_note_f, '9'],
                                    [Lang.Blocks.hamster_note_f_sharp, '10'],
                                    [Lang.Blocks.hamster_note_g, '11'],
                                    [Lang.Blocks.hamster_note_g_sharp, '12'],
                                    [Lang.Blocks.hamster_note_a, '13'],
                                    [Lang.Blocks.hamster_note_a_sharp, '14'],
                                    [Lang.Blocks.hamster_note_b, '15'],
                                ],
                                value: '4',
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
                        params: [null, '9'],
                    },
                    {
                        syntax: 'Roboid.hamster_play_pitch_f_sharp(%1, %3)',
                        textParams: [
                            { type: 'Block', accept: 'string' },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.hamster_note_c, '4'],
                                    [Lang.Blocks.hamster_note_c_sharp, '5'],
                                    [Lang.Blocks.hamster_note_d, '6'],
                                    [Lang.Blocks.hamster_note_d_sharp, '7'],
                                    [Lang.Blocks.hamster_note_e, '8'],
                                    [Lang.Blocks.hamster_note_f, '9'],
                                    [Lang.Blocks.hamster_note_f_sharp, '10'],
                                    [Lang.Blocks.hamster_note_g, '11'],
                                    [Lang.Blocks.hamster_note_g_sharp, '12'],
                                    [Lang.Blocks.hamster_note_a, '13'],
                                    [Lang.Blocks.hamster_note_a_sharp, '14'],
                                    [Lang.Blocks.hamster_note_b, '15'],
                                ],
                                value: '4',
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
                        params: [null, '10'],
                    },
                    {
                        syntax: 'Roboid.hamster_play_pitch_g(%1, %3)',
                        textParams: [
                            { type: 'Block', accept: 'string' },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.hamster_note_c, '4'],
                                    [Lang.Blocks.hamster_note_c_sharp, '5'],
                                    [Lang.Blocks.hamster_note_d, '6'],
                                    [Lang.Blocks.hamster_note_d_sharp, '7'],
                                    [Lang.Blocks.hamster_note_e, '8'],
                                    [Lang.Blocks.hamster_note_f, '9'],
                                    [Lang.Blocks.hamster_note_f_sharp, '10'],
                                    [Lang.Blocks.hamster_note_g, '11'],
                                    [Lang.Blocks.hamster_note_g_sharp, '12'],
                                    [Lang.Blocks.hamster_note_a, '13'],
                                    [Lang.Blocks.hamster_note_a_sharp, '14'],
                                    [Lang.Blocks.hamster_note_b, '15'],
                                ],
                                value: '4',
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
                        params: [null, '11'],
                    },
                    {
                        syntax: 'Roboid.hamster_play_pitch_g_sharp(%1, %3)',
                        textParams: [
                            { type: 'Block', accept: 'string' },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.hamster_note_c, '4'],
                                    [Lang.Blocks.hamster_note_c_sharp, '5'],
                                    [Lang.Blocks.hamster_note_d, '6'],
                                    [Lang.Blocks.hamster_note_d_sharp, '7'],
                                    [Lang.Blocks.hamster_note_e, '8'],
                                    [Lang.Blocks.hamster_note_f, '9'],
                                    [Lang.Blocks.hamster_note_f_sharp, '10'],
                                    [Lang.Blocks.hamster_note_g, '11'],
                                    [Lang.Blocks.hamster_note_g_sharp, '12'],
                                    [Lang.Blocks.hamster_note_a, '13'],
                                    [Lang.Blocks.hamster_note_a_sharp, '14'],
                                    [Lang.Blocks.hamster_note_b, '15'],
                                ],
                                value: '4',
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
                        params: [null, '12'],
                    },
                    {
                        syntax: 'Roboid.hamster_play_pitch_a(%1, %3)',
                        textParams: [
                            { type: 'Block', accept: 'string' },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.hamster_note_c, '4'],
                                    [Lang.Blocks.hamster_note_c_sharp, '5'],
                                    [Lang.Blocks.hamster_note_d, '6'],
                                    [Lang.Blocks.hamster_note_d_sharp, '7'],
                                    [Lang.Blocks.hamster_note_e, '8'],
                                    [Lang.Blocks.hamster_note_f, '9'],
                                    [Lang.Blocks.hamster_note_f_sharp, '10'],
                                    [Lang.Blocks.hamster_note_g, '11'],
                                    [Lang.Blocks.hamster_note_g_sharp, '12'],
                                    [Lang.Blocks.hamster_note_a, '13'],
                                    [Lang.Blocks.hamster_note_a_sharp, '14'],
                                    [Lang.Blocks.hamster_note_b, '15'],
                                ],
                                value: '4',
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
                        params: [null, '13'],
                    },
                    {
                        syntax: 'Roboid.hamster_play_pitch_a_sharp(%1, %3)',
                        textParams: [
                            { type: 'Block', accept: 'string' },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.hamster_note_c, '4'],
                                    [Lang.Blocks.hamster_note_c_sharp, '5'],
                                    [Lang.Blocks.hamster_note_d, '6'],
                                    [Lang.Blocks.hamster_note_d_sharp, '7'],
                                    [Lang.Blocks.hamster_note_e, '8'],
                                    [Lang.Blocks.hamster_note_f, '9'],
                                    [Lang.Blocks.hamster_note_f_sharp, '10'],
                                    [Lang.Blocks.hamster_note_g, '11'],
                                    [Lang.Blocks.hamster_note_g_sharp, '12'],
                                    [Lang.Blocks.hamster_note_a, '13'],
                                    [Lang.Blocks.hamster_note_a_sharp, '14'],
                                    [Lang.Blocks.hamster_note_b, '15'],
                                ],
                                value: '4',
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
                        params: [null, '14'],
                    },
                    {
                        syntax: 'Roboid.hamster_play_pitch_b(%1, %3)',
                        textParams: [
                            { type: 'Block', accept: 'string' },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.hamster_note_c, '4'],
                                    [Lang.Blocks.hamster_note_c_sharp, '5'],
                                    [Lang.Blocks.hamster_note_d, '6'],
                                    [Lang.Blocks.hamster_note_d_sharp, '7'],
                                    [Lang.Blocks.hamster_note_e, '8'],
                                    [Lang.Blocks.hamster_note_f, '9'],
                                    [Lang.Blocks.hamster_note_f_sharp, '10'],
                                    [Lang.Blocks.hamster_note_g, '11'],
                                    [Lang.Blocks.hamster_note_g_sharp, '12'],
                                    [Lang.Blocks.hamster_note_a, '13'],
                                    [Lang.Blocks.hamster_note_a_sharp, '14'],
                                    [Lang.Blocks.hamster_note_b, '15'],
                                ],
                                value: '4',
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
                        params: [null, '15'],
                    },
                ],
            },
        },
        roboid_hamster_play_note_for: {
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
                        [Lang.Blocks.hamster_note_c, '4'],
                        [Lang.Blocks.hamster_note_c_sharp, '5'],
                        [Lang.Blocks.hamster_note_d, '6'],
                        [Lang.Blocks.hamster_note_d_sharp, '7'],
                        [Lang.Blocks.hamster_note_e, '8'],
                        [Lang.Blocks.hamster_note_f, '9'],
                        [Lang.Blocks.hamster_note_f_sharp, '10'],
                        [Lang.Blocks.hamster_note_g, '11'],
                        [Lang.Blocks.hamster_note_g_sharp, '12'],
                        [Lang.Blocks.hamster_note_a, '13'],
                        [Lang.Blocks.hamster_note_a_sharp, '14'],
                        [Lang.Blocks.hamster_note_b, '15'],
                    ],
                    value: '4',
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
                    {
                        type: 'text',
                        params: ['0'],
                    },
                    null,
                    '4',
                    {
                        type: 'text',
                        params: ['0.5'],
                    },
                    null,
                ],
                type: 'roboid_hamster_play_note_for',
            },
            paramsKeyMap: {
                INDEX: 0,
                NOTE: 1,
                OCTAVE: 2,
                BEAT: 3,
            },
            class: 'hamster_buzzer',
            isNotFor: ['roboid'],
            func(sprite, script) {
                const index = script.getNumberValue('INDEX');
                const robot = Entry.Roboid.getHamster(index);
                return robot ? robot.playNoteBeat(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Roboid.hamster_play_note_c(%1, %3, %4)',
                        textParams: [
                            { type: 'Block', accept: 'string' },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.hamster_note_c, '4'],
                                    [Lang.Blocks.hamster_note_c_sharp, '5'],
                                    [Lang.Blocks.hamster_note_d, '6'],
                                    [Lang.Blocks.hamster_note_d_sharp, '7'],
                                    [Lang.Blocks.hamster_note_e, '8'],
                                    [Lang.Blocks.hamster_note_f, '9'],
                                    [Lang.Blocks.hamster_note_f_sharp, '10'],
                                    [Lang.Blocks.hamster_note_g, '11'],
                                    [Lang.Blocks.hamster_note_g_sharp, '12'],
                                    [Lang.Blocks.hamster_note_a, '13'],
                                    [Lang.Blocks.hamster_note_a_sharp, '14'],
                                    [Lang.Blocks.hamster_note_b, '15'],
                                ],
                                value: '4',
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
                        params: [null, '4'],
                    },
                    {
                        syntax: 'Roboid.hamster_play_note_c_sharp(%1, %3, %4)',
                        textParams: [
                            { type: 'Block', accept: 'string' },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.hamster_note_c, '4'],
                                    [Lang.Blocks.hamster_note_c_sharp, '5'],
                                    [Lang.Blocks.hamster_note_d, '6'],
                                    [Lang.Blocks.hamster_note_d_sharp, '7'],
                                    [Lang.Blocks.hamster_note_e, '8'],
                                    [Lang.Blocks.hamster_note_f, '9'],
                                    [Lang.Blocks.hamster_note_f_sharp, '10'],
                                    [Lang.Blocks.hamster_note_g, '11'],
                                    [Lang.Blocks.hamster_note_g_sharp, '12'],
                                    [Lang.Blocks.hamster_note_a, '13'],
                                    [Lang.Blocks.hamster_note_a_sharp, '14'],
                                    [Lang.Blocks.hamster_note_b, '15'],
                                ],
                                value: '4',
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
                        params: [null, '5'],
                    },
                    {
                        syntax: 'Roboid.hamster_play_note_d(%1, %3, %4)',
                        textParams: [
                            { type: 'Block', accept: 'string' },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.hamster_note_c, '4'],
                                    [Lang.Blocks.hamster_note_c_sharp, '5'],
                                    [Lang.Blocks.hamster_note_d, '6'],
                                    [Lang.Blocks.hamster_note_d_sharp, '7'],
                                    [Lang.Blocks.hamster_note_e, '8'],
                                    [Lang.Blocks.hamster_note_f, '9'],
                                    [Lang.Blocks.hamster_note_f_sharp, '10'],
                                    [Lang.Blocks.hamster_note_g, '11'],
                                    [Lang.Blocks.hamster_note_g_sharp, '12'],
                                    [Lang.Blocks.hamster_note_a, '13'],
                                    [Lang.Blocks.hamster_note_a_sharp, '14'],
                                    [Lang.Blocks.hamster_note_b, '15'],
                                ],
                                value: '4',
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
                        params: [null, '6'],
                    },
                    {
                        syntax: 'Roboid.hamster_play_note_d_sharp(%1, %3, %4)',
                        textParams: [
                            { type: 'Block', accept: 'string' },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.hamster_note_c, '4'],
                                    [Lang.Blocks.hamster_note_c_sharp, '5'],
                                    [Lang.Blocks.hamster_note_d, '6'],
                                    [Lang.Blocks.hamster_note_d_sharp, '7'],
                                    [Lang.Blocks.hamster_note_e, '8'],
                                    [Lang.Blocks.hamster_note_f, '9'],
                                    [Lang.Blocks.hamster_note_f_sharp, '10'],
                                    [Lang.Blocks.hamster_note_g, '11'],
                                    [Lang.Blocks.hamster_note_g_sharp, '12'],
                                    [Lang.Blocks.hamster_note_a, '13'],
                                    [Lang.Blocks.hamster_note_a_sharp, '14'],
                                    [Lang.Blocks.hamster_note_b, '15'],
                                ],
                                value: '4',
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
                        params: [null, '7'],
                    },
                    {
                        syntax: 'Roboid.hamster_play_note_e(%1, %3, %4)',
                        textParams: [
                            { type: 'Block', accept: 'string' },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.hamster_note_c, '4'],
                                    [Lang.Blocks.hamster_note_c_sharp, '5'],
                                    [Lang.Blocks.hamster_note_d, '6'],
                                    [Lang.Blocks.hamster_note_d_sharp, '7'],
                                    [Lang.Blocks.hamster_note_e, '8'],
                                    [Lang.Blocks.hamster_note_f, '9'],
                                    [Lang.Blocks.hamster_note_f_sharp, '10'],
                                    [Lang.Blocks.hamster_note_g, '11'],
                                    [Lang.Blocks.hamster_note_g_sharp, '12'],
                                    [Lang.Blocks.hamster_note_a, '13'],
                                    [Lang.Blocks.hamster_note_a_sharp, '14'],
                                    [Lang.Blocks.hamster_note_b, '15'],
                                ],
                                value: '4',
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
                        params: [null, '8'],
                    },
                    {
                        syntax: 'Roboid.hamster_play_note_f(%1, %3, %4)',
                        textParams: [
                            { type: 'Block', accept: 'string' },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.hamster_note_c, '4'],
                                    [Lang.Blocks.hamster_note_c_sharp, '5'],
                                    [Lang.Blocks.hamster_note_d, '6'],
                                    [Lang.Blocks.hamster_note_d_sharp, '7'],
                                    [Lang.Blocks.hamster_note_e, '8'],
                                    [Lang.Blocks.hamster_note_f, '9'],
                                    [Lang.Blocks.hamster_note_f_sharp, '10'],
                                    [Lang.Blocks.hamster_note_g, '11'],
                                    [Lang.Blocks.hamster_note_g_sharp, '12'],
                                    [Lang.Blocks.hamster_note_a, '13'],
                                    [Lang.Blocks.hamster_note_a_sharp, '14'],
                                    [Lang.Blocks.hamster_note_b, '15'],
                                ],
                                value: '4',
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
                        params: [null, '9'],
                    },
                    {
                        syntax: 'Roboid.hamster_play_note_f_sharp(%1, %3, %4)',
                        textParams: [
                            { type: 'Block', accept: 'string' },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.hamster_note_c, '4'],
                                    [Lang.Blocks.hamster_note_c_sharp, '5'],
                                    [Lang.Blocks.hamster_note_d, '6'],
                                    [Lang.Blocks.hamster_note_d_sharp, '7'],
                                    [Lang.Blocks.hamster_note_e, '8'],
                                    [Lang.Blocks.hamster_note_f, '9'],
                                    [Lang.Blocks.hamster_note_f_sharp, '10'],
                                    [Lang.Blocks.hamster_note_g, '11'],
                                    [Lang.Blocks.hamster_note_g_sharp, '12'],
                                    [Lang.Blocks.hamster_note_a, '13'],
                                    [Lang.Blocks.hamster_note_a_sharp, '14'],
                                    [Lang.Blocks.hamster_note_b, '15'],
                                ],
                                value: '4',
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
                        params: [null, '10'],
                    },
                    {
                        syntax: 'Roboid.hamster_play_note_g(%1, %3, %4)',
                        textParams: [
                            { type: 'Block', accept: 'string' },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.hamster_note_c, '4'],
                                    [Lang.Blocks.hamster_note_c_sharp, '5'],
                                    [Lang.Blocks.hamster_note_d, '6'],
                                    [Lang.Blocks.hamster_note_d_sharp, '7'],
                                    [Lang.Blocks.hamster_note_e, '8'],
                                    [Lang.Blocks.hamster_note_f, '9'],
                                    [Lang.Blocks.hamster_note_f_sharp, '10'],
                                    [Lang.Blocks.hamster_note_g, '11'],
                                    [Lang.Blocks.hamster_note_g_sharp, '12'],
                                    [Lang.Blocks.hamster_note_a, '13'],
                                    [Lang.Blocks.hamster_note_a_sharp, '14'],
                                    [Lang.Blocks.hamster_note_b, '15'],
                                ],
                                value: '4',
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
                        params: [null, '11'],
                    },
                    {
                        syntax: 'Roboid.hamster_play_note_g_sharp(%1, %3, %4)',
                        textParams: [
                            { type: 'Block', accept: 'string' },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.hamster_note_c, '4'],
                                    [Lang.Blocks.hamster_note_c_sharp, '5'],
                                    [Lang.Blocks.hamster_note_d, '6'],
                                    [Lang.Blocks.hamster_note_d_sharp, '7'],
                                    [Lang.Blocks.hamster_note_e, '8'],
                                    [Lang.Blocks.hamster_note_f, '9'],
                                    [Lang.Blocks.hamster_note_f_sharp, '10'],
                                    [Lang.Blocks.hamster_note_g, '11'],
                                    [Lang.Blocks.hamster_note_g_sharp, '12'],
                                    [Lang.Blocks.hamster_note_a, '13'],
                                    [Lang.Blocks.hamster_note_a_sharp, '14'],
                                    [Lang.Blocks.hamster_note_b, '15'],
                                ],
                                value: '4',
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
                        params: [null, '12'],
                    },
                    {
                        syntax: 'Roboid.hamster_play_note_a(%1, %3, %4)',
                        textParams: [
                            { type: 'Block', accept: 'string' },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.hamster_note_c, '4'],
                                    [Lang.Blocks.hamster_note_c_sharp, '5'],
                                    [Lang.Blocks.hamster_note_d, '6'],
                                    [Lang.Blocks.hamster_note_d_sharp, '7'],
                                    [Lang.Blocks.hamster_note_e, '8'],
                                    [Lang.Blocks.hamster_note_f, '9'],
                                    [Lang.Blocks.hamster_note_f_sharp, '10'],
                                    [Lang.Blocks.hamster_note_g, '11'],
                                    [Lang.Blocks.hamster_note_g_sharp, '12'],
                                    [Lang.Blocks.hamster_note_a, '13'],
                                    [Lang.Blocks.hamster_note_a_sharp, '14'],
                                    [Lang.Blocks.hamster_note_b, '15'],
                                ],
                                value: '4',
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
                        params: [null, '13'],
                    },
                    {
                        syntax: 'Roboid.hamster_play_note_a_sharp(%1, %3, %4)',
                        textParams: [
                            { type: 'Block', accept: 'string' },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.hamster_note_c, '4'],
                                    [Lang.Blocks.hamster_note_c_sharp, '5'],
                                    [Lang.Blocks.hamster_note_d, '6'],
                                    [Lang.Blocks.hamster_note_d_sharp, '7'],
                                    [Lang.Blocks.hamster_note_e, '8'],
                                    [Lang.Blocks.hamster_note_f, '9'],
                                    [Lang.Blocks.hamster_note_f_sharp, '10'],
                                    [Lang.Blocks.hamster_note_g, '11'],
                                    [Lang.Blocks.hamster_note_g_sharp, '12'],
                                    [Lang.Blocks.hamster_note_a, '13'],
                                    [Lang.Blocks.hamster_note_a_sharp, '14'],
                                    [Lang.Blocks.hamster_note_b, '15'],
                                ],
                                value: '4',
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
                        params: [null, '14'],
                    },
                    {
                        syntax: 'Roboid.hamster_play_note_b(%1, %3, %4)',
                        textParams: [
                            { type: 'Block', accept: 'string' },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.hamster_note_c, '4'],
                                    [Lang.Blocks.hamster_note_c_sharp, '5'],
                                    [Lang.Blocks.hamster_note_d, '6'],
                                    [Lang.Blocks.hamster_note_d_sharp, '7'],
                                    [Lang.Blocks.hamster_note_e, '8'],
                                    [Lang.Blocks.hamster_note_f, '9'],
                                    [Lang.Blocks.hamster_note_f_sharp, '10'],
                                    [Lang.Blocks.hamster_note_g, '11'],
                                    [Lang.Blocks.hamster_note_g_sharp, '12'],
                                    [Lang.Blocks.hamster_note_a, '13'],
                                    [Lang.Blocks.hamster_note_a_sharp, '14'],
                                    [Lang.Blocks.hamster_note_b, '15'],
                                ],
                                value: '4',
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
                        params: [null, '15'],
                    },
                ],
            },
        },
        roboid_hamster_rest_for: {
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
                        params: ['0'],
                    },
                    {
                        type: 'text',
                        params: ['0.25'],
                    },
                    null,
                ],
                type: 'roboid_hamster_rest_for',
            },
            paramsKeyMap: {
                INDEX: 0,
                BEAT: 1,
            },
            class: 'hamster_buzzer',
            isNotFor: ['roboid'],
            func(sprite, script) {
                const index = script.getNumberValue('INDEX');
                const robot = Entry.Roboid.getHamster(index);
                return robot ? robot.restBeat(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Roboid.hamster_rest(%1, %2)',
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
        roboid_hamster_change_tempo_by: {
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
                        params: ['0'],
                    },
                    {
                        type: 'text',
                        params: ['20'],
                    },
                    null,
                ],
                type: 'roboid_hamster_change_tempo_by',
            },
            paramsKeyMap: {
                INDEX: 0,
                BPM: 1,
            },
            class: 'hamster_buzzer',
            isNotFor: ['roboid'],
            func(sprite, script) {
                const index = script.getNumberValue('INDEX');
                const robot = Entry.Roboid.getHamster(index);
                return robot ? robot.changeTempo(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Roboid.hamster_add_tempo(%1, %2)',
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
        roboid_hamster_set_tempo_to: {
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
                        params: ['0'],
                    },
                    {
                        type: 'text',
                        params: ['60'],
                    },
                    null,
                ],
                type: 'roboid_hamster_set_tempo_to',
            },
            paramsKeyMap: {
                INDEX: 0,
                BPM: 1,
            },
            class: 'hamster_buzzer',
            isNotFor: ['roboid'],
            func(sprite, script) {
                const index = script.getNumberValue('INDEX');
                const robot = Entry.Roboid.getHamster(index);
                return robot ? robot.setTempo(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Roboid.hamster_set_tempo(%1, %2)',
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
        roboid_hamster_set_port_to: {
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
                        [Lang.Blocks.HAMSTER_port_a, 'A'],
                        [Lang.Blocks.HAMSTER_port_b, 'B'],
                        [Lang.Blocks.HAMSTER_port_ab, 'AB'],
                    ],
                    value: 'A',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.HAMSTER_analog_input, '0'],
                        [Lang.Blocks.HAMSTER_digital_input, '1'],
                        [Lang.Blocks.HAMSTER_servo_output, '8'],
                        [Lang.Blocks.HAMSTER_pwm_output, '9'],
                        [Lang.Blocks.HAMSTER_digital_output, '10'],
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
                        type: 'text',
                        params: ['0'],
                    },
                    null,
                    null,
                    null,
                ],
                type: 'roboid_hamster_set_port_to',
            },
            paramsKeyMap: {
                INDEX: 0,
                PORT: 1,
                MODE: 2,
            },
            class: 'hamster_port',
            isNotFor: ['roboid'],
            func(sprite, script) {
                const index = script.getNumberValue('INDEX');
                const robot = Entry.Roboid.getHamster(index);
                return robot ? robot.setIoMode(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Roboid.hamster_set_io_mode_analog_input(%1, %2)',
                        textParams: [
                            { type: 'Block', accept: 'string' },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.HAMSTER_port_a, 'A'],
                                    [Lang.Blocks.HAMSTER_port_b, 'B'],
                                    [Lang.Blocks.HAMSTER_port_ab, 'AB'],
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
                                    [Lang.Blocks.HAMSTER_analog_input, '0'],
                                    [Lang.Blocks.HAMSTER_digital_input, '1'],
                                    [Lang.Blocks.HAMSTER_servo_output, '8'],
                                    [Lang.Blocks.HAMSTER_pwm_output, '9'],
                                    [Lang.Blocks.HAMSTER_digital_output, '10'],
                                ],
                                value: '0',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                        ],
                        params: [null, null, '0'],
                    },
                    {
                        syntax: 'Roboid.hamster_set_io_mode_digital_input(%1, %2)',
                        textParams: [
                            { type: 'Block', accept: 'string' },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.HAMSTER_port_a, 'A'],
                                    [Lang.Blocks.HAMSTER_port_b, 'B'],
                                    [Lang.Blocks.HAMSTER_port_ab, 'AB'],
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
                                    [Lang.Blocks.HAMSTER_analog_input, '0'],
                                    [Lang.Blocks.HAMSTER_digital_input, '1'],
                                    [Lang.Blocks.HAMSTER_servo_output, '8'],
                                    [Lang.Blocks.HAMSTER_pwm_output, '9'],
                                    [Lang.Blocks.HAMSTER_digital_output, '10'],
                                ],
                                value: '0',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                        ],
                        params: [null, null, '1'],
                    },
                    {
                        syntax: 'Roboid.hamster_set_io_mode_servo_output(%1, %2)',
                        textParams: [
                            { type: 'Block', accept: 'string' },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.HAMSTER_port_a, 'A'],
                                    [Lang.Blocks.HAMSTER_port_b, 'B'],
                                    [Lang.Blocks.HAMSTER_port_ab, 'AB'],
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
                                    [Lang.Blocks.HAMSTER_analog_input, '0'],
                                    [Lang.Blocks.HAMSTER_digital_input, '1'],
                                    [Lang.Blocks.HAMSTER_servo_output, '8'],
                                    [Lang.Blocks.HAMSTER_pwm_output, '9'],
                                    [Lang.Blocks.HAMSTER_digital_output, '10'],
                                ],
                                value: '0',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                        ],
                        params: [null, null, '8'],
                    },
                    {
                        syntax: 'Roboid.hamster_set_io_mode_pwm_output(%1, %2)',
                        textParams: [
                            { type: 'Block', accept: 'string' },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.HAMSTER_port_a, 'A'],
                                    [Lang.Blocks.HAMSTER_port_b, 'B'],
                                    [Lang.Blocks.HAMSTER_port_ab, 'AB'],
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
                                    [Lang.Blocks.HAMSTER_analog_input, '0'],
                                    [Lang.Blocks.HAMSTER_digital_input, '1'],
                                    [Lang.Blocks.HAMSTER_servo_output, '8'],
                                    [Lang.Blocks.HAMSTER_pwm_output, '9'],
                                    [Lang.Blocks.HAMSTER_digital_output, '10'],
                                ],
                                value: '0',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                        ],
                        params: [null, null, '9'],
                    },
                    {
                        syntax: 'Roboid.hamster_set_io_mode_digital_output(%1, %2)',
                        textParams: [
                            { type: 'Block', accept: 'string' },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.HAMSTER_port_a, 'A'],
                                    [Lang.Blocks.HAMSTER_port_b, 'B'],
                                    [Lang.Blocks.HAMSTER_port_ab, 'AB'],
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
                                    [Lang.Blocks.HAMSTER_analog_input, '0'],
                                    [Lang.Blocks.HAMSTER_digital_input, '1'],
                                    [Lang.Blocks.HAMSTER_servo_output, '8'],
                                    [Lang.Blocks.HAMSTER_pwm_output, '9'],
                                    [Lang.Blocks.HAMSTER_digital_output, '10'],
                                ],
                                value: '0',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                        ],
                        params: [null, null, '10'],
                    },
                ],
            },
        },
        roboid_hamster_change_output_by: {
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
                        [Lang.Blocks.HAMSTER_port_a, 'A'],
                        [Lang.Blocks.HAMSTER_port_b, 'B'],
                        [Lang.Blocks.HAMSTER_port_ab, 'AB'],
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
                    {
                        type: 'text',
                        params: ['0'],
                    },
                    null,
                    {
                        type: 'text',
                        params: ['10'],
                    },
                    null,
                ],
                type: 'roboid_hamster_change_output_by',
            },
            paramsKeyMap: {
                INDEX: 0,
                PORT: 1,
                VALUE: 2,
            },
            class: 'hamster_port',
            isNotFor: ['roboid'],
            func(sprite, script) {
                const index = script.getNumberValue('INDEX');
                const robot = Entry.Roboid.getHamster(index);
                return robot ? robot.changeOutput(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Roboid.hamster_add_output(%1, %2, %3)',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.HAMSTER_port_a, 'A'],
                                    [Lang.Blocks.HAMSTER_port_b, 'B'],
                                    [Lang.Blocks.HAMSTER_port_ab, 'AB'],
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
        roboid_hamster_set_output_to: {
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
                        [Lang.Blocks.HAMSTER_port_a, 'A'],
                        [Lang.Blocks.HAMSTER_port_b, 'B'],
                        [Lang.Blocks.HAMSTER_port_ab, 'AB'],
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
                    {
                        type: 'text',
                        params: ['0'],
                    },
                    null,
                    {
                        type: 'text',
                        params: ['100'],
                    },
                    null,
                ],
                type: 'roboid_hamster_set_output_to',
            },
            paramsKeyMap: {
                INDEX: 0,
                PORT: 1,
                VALUE: 2,
            },
            class: 'hamster_port',
            isNotFor: ['roboid'],
            func(sprite, script) {
                const index = script.getNumberValue('INDEX');
                const robot = Entry.Roboid.getHamster(index);
                return robot ? robot.setOutput(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Roboid.hamster_set_output(%1, %2, %3)',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.HAMSTER_port_a, 'A'],
                                    [Lang.Blocks.HAMSTER_port_b, 'B'],
                                    [Lang.Blocks.HAMSTER_port_ab, 'AB'],
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
        roboid_hamster_gripper: {
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
                        [Lang.Blocks.hamster_open_gripper, 'OPEN'],
                        [Lang.Blocks.hamster_close_gripper, 'CLOSE'],
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
                params: [
                    {
                        type: 'text',
                        params: ['0'],
                    },
                    null,
                    null,
                ],
                type: 'roboid_hamster_gripper',
            },
            paramsKeyMap: {
                INDEX: 0,
                ACTION: 1,
            },
            class: 'hamster_port',
            isNotFor: ['roboid'],
            func(sprite, script) {
                const index = script.getNumberValue('INDEX');
                const robot = Entry.Roboid.getHamster(index);
                return robot ? robot.gripper(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Roboid.hamster_set_gripper(%1, %2)',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.hamster_open_gripper, 'OPEN'],
                                    [Lang.Blocks.hamster_close_gripper, 'CLOSE'],
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
        roboid_hamster_release_gripper: {
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
                        params: ['0'],
                    },
                    null,
                ],
                type: 'roboid_hamster_release_gripper',
            },
            paramsKeyMap: {
                INDEX: 0,
            },
            class: 'hamster_port',
            isNotFor: ['roboid'],
            func(sprite, script) {
                const index = script.getNumberValue('INDEX');
                const robot = Entry.Roboid.getHamster(index);
                return robot ? robot.releaseGripper(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Roboid.hamster_release_gripper(%1)',
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
        roboid_hamster_s_hand_found: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'text',
                        params: ['0'],
                    },
                ],
                type: 'roboid_hamster_s_hand_found',
            },
            paramsKeyMap: {
                INDEX: 0,
            },
            class: 'hamster_s_sensor',
            isNotFor: ['roboid'],
            func(sprite, script) {
                const index = script.getNumberValue('INDEX');
                const robot = Entry.Roboid.getHamsterS(index);
                return robot ? robot.checkHandFound(script) : false;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Roboid.hamster_s_hand_found(%1)',
                        blockType: 'param',
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
        roboid_hamster_s_boolean: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                },
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
                params: [
                    {
                        type: 'text',
                        params: ['0'],
                    },
                    null,
                ],
                type: 'roboid_hamster_s_boolean',
            },
            paramsKeyMap: {
                INDEX: 0,
                DEVICE: 1,
            },
            class: 'hamster_s_sensor',
            isNotFor: ['roboid'],
            func(sprite, script) {
                const index = script.getNumberValue('INDEX');
                const robot = Entry.Roboid.getHamsterS(index);
                return robot ? robot.checkBoolean(script) : false;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Roboid.hamster_s_boolean_value(%1, %2)',
                        blockType: 'param',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
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
        roboid_hamster_s_value: {
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
                params: [
                    {
                        type: 'text',
                        params: ['0'],
                    },
                    null,
                ],
                type: 'roboid_hamster_s_value',
            },
            paramsKeyMap: {
                INDEX: 0,
                DEVICE: 1,
            },
            class: 'hamster_s_sensor',
            isNotFor: ['roboid'],
            func(sprite, script) {
                const index = script.getNumberValue('INDEX');
                const robot = Entry.Roboid.getHamsterS(index);
                if (robot) {
                    return robot.getValue(script);
                }
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Roboid.hamster_s_sensor_value(%1, %2)',
                        blockType: 'param',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
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
        roboid_hamster_s_move_forward_once: {
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
                        params: ['0'],
                    },
                    null,
                ],
                type: 'roboid_hamster_s_move_forward_once',
            },
            paramsKeyMap: {
                INDEX: 0,
            },
            class: 'hamster_s_board',
            isNotFor: ['roboid'],
            func(sprite, script) {
                const index = script.getNumberValue('INDEX');
                const robot = Entry.Roboid.getHamsterS(index);
                return robot ? robot.boardForward(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Roboid.hamster_s_board_forward(%1)',
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
        roboid_hamster_s_turn_once: {
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
                params: [
                    {
                        type: 'text',
                        params: ['0'],
                    },
                    null,
                    null,
                ],
                type: 'roboid_hamster_s_turn_once',
            },
            paramsKeyMap: {
                INDEX: 0,
                DIRECTION: 1,
            },
            class: 'hamster_s_board',
            isNotFor: ['roboid'],
            func(sprite, script) {
                const index = script.getNumberValue('INDEX');
                const robot = Entry.Roboid.getHamsterS(index);
                return robot ? robot.boardTurn(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Roboid.hamster_s_board_turn(%1, %2)',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
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
                        ],
                    },
                ],
            },
        },
        roboid_hamster_s_move_forward_unit: {
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
                        params: ['0'],
                    },
                    {
                        type: 'text',
                        params: ['5'],
                    },
                    null,
                    null,
                ],
                type: 'roboid_hamster_s_move_forward_unit',
            },
            paramsKeyMap: {
                INDEX: 0,
                VALUE: 1,
                UNIT: 2,
            },
            class: 'hamster_s_wheel',
            isNotFor: ['roboid'],
            func(sprite, script) {
                const index = script.getNumberValue('INDEX');
                const robot = Entry.Roboid.getHamsterS(index);
                return robot ? robot.moveForwardUnit(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Roboid.hamster_s_move_forward(%1, %2, %3)',
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
        roboid_hamster_s_move_backward_unit: {
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
                        params: ['0'],
                    },
                    {
                        type: 'text',
                        params: ['5'],
                    },
                    null,
                    null,
                ],
                type: 'roboid_hamster_s_move_backward_unit',
            },
            paramsKeyMap: {
                INDEX: 0,
                VALUE: 1,
                UNIT: 2,
            },
            class: 'hamster_s_wheel',
            isNotFor: ['roboid'],
            func(sprite, script) {
                const index = script.getNumberValue('INDEX');
                const robot = Entry.Roboid.getHamsterS(index);
                return robot ? robot.moveBackwardUnit(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Roboid.hamster_s_move_backward(%1, %2, %3)',
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
        roboid_hamster_s_turn_unit_in_place: {
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
                    {
                        type: 'text',
                        params: ['0'],
                    },
                    null,
                    {
                        type: 'text',
                        params: ['90'],
                    },
                    null,
                    null,
                ],
                type: 'roboid_hamster_s_turn_unit_in_place',
            },
            paramsKeyMap: {
                INDEX: 0,
                DIRECTION: 1,
                VALUE: 2,
                UNIT: 3,
            },
            class: 'hamster_s_wheel',
            isNotFor: ['roboid'],
            func(sprite, script) {
                const index = script.getNumberValue('INDEX');
                const robot = Entry.Roboid.getHamsterS(index);
                return robot ? robot.turnUnit(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Roboid.hamster_s_turn(%1, %2, %3, %4)',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
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
                        ],
                    },
                ],
            },
        },
        roboid_hamster_s_pivot_around_unit_in_direction: {
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
                    {
                        type: 'text',
                        params: ['0'],
                    },
                    null,
                    {
                        type: 'text',
                        params: ['90'],
                    },
                    null,
                    null,
                    null,
                ],
                type: 'roboid_hamster_s_pivot_around_unit_in_direction',
            },
            paramsKeyMap: {
                INDEX: 0,
                PART: 1,
                VALUE: 2,
                UNIT: 3,
                TOWARD: 4,
            },
            class: 'hamster_s_wheel',
            isNotFor: ['roboid'],
            func(sprite, script) {
                const index = script.getNumberValue('INDEX');
                const robot = Entry.Roboid.getHamsterS(index);
                return robot ? robot.pivotUnit(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Roboid.hamster_s_pivot(%1, %2, %3, %4, %5)',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
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
        roboid_hamster_s_turn_unit_with_radius_in_direction: {
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
                    {
                        type: 'text',
                        params: ['0'],
                    },
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
                type: 'roboid_hamster_s_turn_unit_with_radius_in_direction',
            },
            paramsKeyMap: {
                INDEX: 0,
                PART: 1,
                DIRECTION: 2,
                VALUE: 3,
                UNIT: 4,
                RADIUS: 5,
                TOWARD: 6,
            },
            class: 'hamster_s_wheel',
            isNotFor: ['roboid'],
            func(sprite, script) {
                const index = script.getNumberValue('INDEX');
                const robot = Entry.Roboid.getHamsterS(index);
                return robot ? robot.swingUnit(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Roboid.hamster_s_circle(%1, %2, %3, %4, %5, %6, %7)',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
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
        roboid_hamster_s_change_both_wheels_by: {
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
                        params: ['0'],
                    },
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
                type: 'roboid_hamster_s_change_both_wheels_by',
            },
            paramsKeyMap: {
                INDEX: 0,
                LEFT: 1,
                RIGHT: 2,
            },
            class: 'hamster_s_wheel',
            isNotFor: ['roboid'],
            func(sprite, script) {
                const index = script.getNumberValue('INDEX');
                const robot = Entry.Roboid.getHamsterS(index);
                return robot ? robot.changeWheels(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Roboid.hamster_s_add_wheels(%1, %2, %3)',
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
        roboid_hamster_s_set_both_wheels_to: {
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
                        params: ['0'],
                    },
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
                type: 'roboid_hamster_s_set_both_wheels_to',
            },
            paramsKeyMap: {
                INDEX: 0,
                LEFT: 1,
                RIGHT: 2,
            },
            class: 'hamster_s_wheel',
            isNotFor: ['roboid'],
            func(sprite, script) {
                const index = script.getNumberValue('INDEX');
                const robot = Entry.Roboid.getHamsterS(index);
                return robot ? robot.setWheels(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Roboid.hamster_s_set_wheels(%1, %2, %3)',
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
        roboid_hamster_s_change_wheel_by: {
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
                    {
                        type: 'text',
                        params: ['0'],
                    },
                    null,
                    {
                        type: 'text',
                        params: ['10'],
                    },
                    null,
                ],
                type: 'roboid_hamster_s_change_wheel_by',
            },
            paramsKeyMap: {
                INDEX: 0,
                WHEEL: 1,
                VELOCITY: 2,
            },
            class: 'hamster_s_wheel',
            isNotFor: ['roboid'],
            func(sprite, script) {
                const index = script.getNumberValue('INDEX');
                const robot = Entry.Roboid.getHamsterS(index);
                return robot ? robot.changeWheel(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Roboid.hamster_s_add_wheel(%1, %2, %3)',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
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
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                        ],
                    },
                ],
            },
        },
        roboid_hamster_s_set_wheel_to: {
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
                    {
                        type: 'text',
                        params: ['0'],
                    },
                    null,
                    {
                        type: 'text',
                        params: ['30'],
                    },
                    null,
                ],
                type: 'roboid_hamster_s_set_wheel_to',
            },
            paramsKeyMap: {
                INDEX: 0,
                WHEEL: 1,
                VELOCITY: 2,
            },
            class: 'hamster_s_wheel',
            isNotFor: ['roboid'],
            func(sprite, script) {
                const index = script.getNumberValue('INDEX');
                const robot = Entry.Roboid.getHamsterS(index);
                return robot ? robot.setWheel(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Roboid.hamster_s_set_wheel(%1, %2, %3)',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
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
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                        ],
                    },
                ],
            },
        },
        roboid_hamster_s_follow_line_using: {
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
                params: [
                    {
                        type: 'text',
                        params: ['0'],
                    },
                    null,
                    null,
                    null,
                ],
                type: 'roboid_hamster_s_follow_line_using',
            },
            paramsKeyMap: {
                INDEX: 0,
                COLOR: 1,
                SENSOR: 2,
            },
            class: 'hamster_s_wheel',
            isNotFor: ['roboid'],
            func(sprite, script) {
                const index = script.getNumberValue('INDEX');
                const robot = Entry.Roboid.getHamsterS(index);
                return robot ? robot.followLine(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Roboid.hamster_s_follow_line(%1, %2, %3)',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
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
        roboid_hamster_s_follow_line_until: {
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
                params: [
                    {
                        type: 'text',
                        params: ['0'],
                    },
                    null,
                    null,
                    null,
                ],
                type: 'roboid_hamster_s_follow_line_until',
            },
            paramsKeyMap: {
                INDEX: 0,
                COLOR: 1,
                DIRECTION: 2,
            },
            class: 'hamster_s_wheel',
            isNotFor: ['roboid'],
            func(sprite, script) {
                const index = script.getNumberValue('INDEX');
                const robot = Entry.Roboid.getHamsterS(index);
                return robot ? robot.followLineUntil(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Roboid.hamster_s_follow_line_until(%1, %2, %3)',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
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
        roboid_hamster_s_set_following_speed_to: {
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
                params: [
                    {
                        type: 'text',
                        params: ['0'],
                    },
                    '5',
                    null,
                ],
                type: 'roboid_hamster_s_set_following_speed_to',
            },
            paramsKeyMap: {
                INDEX: 0,
                SPEED: 1,
            },
            class: 'hamster_s_wheel',
            isNotFor: ['roboid'],
            func(sprite, script) {
                const index = script.getNumberValue('INDEX');
                const robot = Entry.Roboid.getHamsterS(index);
                return robot ? robot.setLineTracerSpeed(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Roboid.hamster_s_set_line_speed(%1, %2)',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
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
        roboid_hamster_s_set_following_gain_to: {
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
                params: [
                    {
                        type: 'text',
                        params: ['0'],
                    },
                    null,
                    null,
                ],
                type: 'roboid_hamster_s_set_following_gain_to',
            },
            paramsKeyMap: {
                INDEX: 0,
                GAIN: 1,
            },
            class: 'hamster_s_wheel',
            isNotFor: ['roboid'],
            func(sprite, script) {
                const index = script.getNumberValue('INDEX');
                const robot = Entry.Roboid.getHamsterS(index);
                return robot ? robot.setLineTracerGain(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Roboid.hamster_s_set_line_gain(%1, %2)',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
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
        roboid_hamster_s_stop: {
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
                        params: ['0'],
                    },
                    null,
                ],
                type: 'roboid_hamster_s_stop',
            },
            paramsKeyMap: {
                INDEX: 0,
            },
            class: 'hamster_s_wheel',
            isNotFor: ['roboid'],
            func(sprite, script) {
                const index = script.getNumberValue('INDEX');
                const robot = Entry.Roboid.getHamsterS(index);
                return robot ? robot.stop(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Roboid.hamster_s_stop(%1)',
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
        roboid_hamster_s_set_led_to: {
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
                params: [
                    {
                        type: 'text',
                        params: ['0'],
                    },
                    null,
                    null,
                    null,
                ],
                type: 'roboid_hamster_s_set_led_to',
            },
            paramsKeyMap: {
                INDEX: 0,
                LED: 1,
                COLOR: 2,
            },
            class: 'hamster_s_led',
            isNotFor: ['roboid'],
            func(sprite, script) {
                const index = script.getNumberValue('INDEX');
                const robot = Entry.Roboid.getHamsterS(index);
                return robot ? robot.setLed(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Roboid.hamster_s_set_led(%1, %2, %3)',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
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
        roboid_hamster_s_pick_led: {
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
                params: [
                    {
                        type: 'text',
                        params: ['0'],
                    },
                    null,
                    null,
                    null,
                ],
                type: 'roboid_hamster_s_pick_led',
            },
            paramsKeyMap: {
                INDEX: 0,
                LED: 1,
                COLOR: 2,
            },
            class: 'hamster_s_led',
            isNotFor: ['roboid'],
            func(sprite, script) {
                const index = script.getNumberValue('INDEX');
                const robot = Entry.Roboid.getHamsterS(index);
                return robot ? robot.pickLed(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Roboid.hamster_s_pick_led(%1, %2, %3)',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
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
                            {
                                type: 'Color',
                                converter: Entry.block.converters.returnStringValue,
                            },
                        ],
                    },
                ],
            },
        },
        roboid_hamster_s_change_led_by_rgb: {
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
                    {
                        type: 'text',
                        params: ['0'],
                    },
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
                type: 'roboid_hamster_s_change_led_by_rgb',
            },
            paramsKeyMap: {
                INDEX: 0,
                LED: 1,
                RED: 2,
                GREEN: 3,
                BLUE: 4,
            },
            class: 'hamster_s_led',
            isNotFor: ['roboid'],
            func(sprite, script) {
                const index = script.getNumberValue('INDEX');
                const robot = Entry.Roboid.getHamsterS(index);
                return robot ? robot.changeRgb(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Roboid.hamster_s_add_rgb(%1, %2, %3, %4, %5)',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
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
        roboid_hamster_s_set_led_to_rgb: {
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
                    {
                        type: 'text',
                        params: ['0'],
                    },
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
                type: 'roboid_hamster_s_set_led_to_rgb',
            },
            paramsKeyMap: {
                INDEX: 0,
                LED: 1,
                RED: 2,
                GREEN: 3,
                BLUE: 4,
            },
            class: 'hamster_s_led',
            isNotFor: ['roboid'],
            func(sprite, script) {
                const index = script.getNumberValue('INDEX');
                const robot = Entry.Roboid.getHamsterS(index);
                return robot ? robot.setRgb(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Roboid.hamster_s_set_rgb(%1, %2, %3, %4, %5)',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
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
        roboid_hamster_s_clear_led: {
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
                params: [
                    {
                        type: 'text',
                        params: ['0'],
                    },
                    null,
                    null,
                ],
                type: 'roboid_hamster_s_clear_led',
            },
            paramsKeyMap: {
                INDEX: 0,
                LED: 1,
            },
            class: 'hamster_s_led',
            isNotFor: ['roboid'],
            func(sprite, script) {
                const index = script.getNumberValue('INDEX');
                const robot = Entry.Roboid.getHamsterS(index);
                return robot ? robot.clearLed(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Roboid.hamster_s_clear_led(%1, %2)',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
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
        roboid_hamster_s_play_sound_times: {
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
                    {
                        type: 'text',
                        params: ['0'],
                    },
                    null,
                    {
                        type: 'text',
                        params: ['1'],
                    },
                    null,
                ],
                type: 'roboid_hamster_s_play_sound_times',
            },
            paramsKeyMap: {
                INDEX: 0,
                SOUND: 1,
                COUNT: 2,
            },
            class: 'hamster_s_sound',
            isNotFor: ['roboid'],
            func(sprite, script) {
                const index = script.getNumberValue('INDEX');
                const robot = Entry.Roboid.getHamsterS(index);
                return robot ? robot.playSound(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Roboid.hamster_s_play_sound(%1, %2, %3)',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
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
        roboid_hamster_s_play_sound_times_until_done: {
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
                    {
                        type: 'text',
                        params: ['0'],
                    },
                    null,
                    {
                        type: 'text',
                        params: ['1'],
                    },
                    null,
                ],
                type: 'roboid_hamster_s_play_sound_times_until_done',
            },
            paramsKeyMap: {
                INDEX: 0,
                SOUND: 1,
                COUNT: 2,
            },
            class: 'hamster_s_sound',
            isNotFor: ['roboid'],
            func(sprite, script) {
                const index = script.getNumberValue('INDEX');
                const robot = Entry.Roboid.getHamsterS(index);
                return robot ? robot.playSoundUntil(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Roboid.hamster_s_play_sound_until_done(%1, %2, %3)',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
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
        roboid_hamster_s_change_buzzer_by: {
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
                        params: ['0'],
                    },
                    {
                        type: 'text',
                        params: ['10'],
                    },
                    null,
                ],
                type: 'roboid_hamster_s_change_buzzer_by',
            },
            paramsKeyMap: {
                INDEX: 0,
                HZ: 1,
            },
            class: 'hamster_s_sound',
            isNotFor: ['roboid'],
            func(sprite, script) {
                const index = script.getNumberValue('INDEX');
                const robot = Entry.Roboid.getHamsterS(index);
                return robot ? robot.changeBuzzer(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Roboid.hamster_s_add_buzzer(%1, %2)',
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
        roboid_hamster_s_set_buzzer_to: {
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
                        params: ['0'],
                    },
                    {
                        type: 'text',
                        params: ['1000'],
                    },
                    null,
                ],
                type: 'roboid_hamster_s_set_buzzer_to',
            },
            paramsKeyMap: {
                INDEX: 0,
                HZ: 1,
            },
            class: 'hamster_s_sound',
            isNotFor: ['roboid'],
            func(sprite, script) {
                const index = script.getNumberValue('INDEX');
                const robot = Entry.Roboid.getHamsterS(index);
                return robot ? robot.setBuzzer(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Roboid.hamster_s_set_buzzer(%1, %2)',
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
        roboid_hamster_s_clear_sound: {
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
                        params: ['0'],
                    },
                    null,
                ],
                type: 'roboid_hamster_s_clear_sound',
            },
            paramsKeyMap: {
                INDEX: 0,
            },
            class: 'hamster_s_sound',
            isNotFor: ['roboid'],
            func(sprite, script) {
                const index = script.getNumberValue('INDEX');
                const robot = Entry.Roboid.getHamsterS(index);
                return robot ? robot.clearSound(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Roboid.hamster_s_clear_sound(%1)',
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
        roboid_hamster_s_play_note: {
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
                params: [
                    {
                        type: 'text',
                        params: ['0'],
                    },
                    null,
                    '4',
                    null,
                ],
                type: 'roboid_hamster_s_play_note',
            },
            paramsKeyMap: {
                INDEX: 0,
                NOTE: 1,
                OCTAVE: 2,
            },
            class: 'hamster_s_sound',
            isNotFor: ['roboid'],
            func(sprite, script) {
                const index = script.getNumberValue('INDEX');
                const robot = Entry.Roboid.getHamsterS(index);
                return robot ? robot.playNote(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Roboid.hamster_s_play_pitch(%1, %2, %3)',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
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
        roboid_hamster_s_play_note_for: {
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
                    {
                        type: 'text',
                        params: ['0'],
                    },
                    null,
                    '4',
                    {
                        type: 'text',
                        params: ['0.5'],
                    },
                    null,
                ],
                type: 'roboid_hamster_s_play_note_for',
            },
            paramsKeyMap: {
                INDEX: 0,
                NOTE: 1,
                OCTAVE: 2,
                BEAT: 3,
            },
            class: 'hamster_s_sound',
            isNotFor: ['roboid'],
            func(sprite, script) {
                const index = script.getNumberValue('INDEX');
                const robot = Entry.Roboid.getHamsterS(index);
                return robot ? robot.playNoteBeat(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Roboid.hamster_s_play_note(%1, %2, %3, %4)',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
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
        roboid_hamster_s_rest_for: {
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
                        params: ['0'],
                    },
                    {
                        type: 'text',
                        params: ['0.25'],
                    },
                    null,
                ],
                type: 'roboid_hamster_s_rest_for',
            },
            paramsKeyMap: {
                INDEX: 0,
                BEAT: 1,
            },
            class: 'hamster_s_sound',
            isNotFor: ['roboid'],
            func(sprite, script) {
                const index = script.getNumberValue('INDEX');
                const robot = Entry.Roboid.getHamsterS(index);
                return robot ? robot.restBeat(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Roboid.hamster_s_rest(%1, %2)',
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
        roboid_hamster_s_change_tempo_by: {
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
                        params: ['0'],
                    },
                    {
                        type: 'text',
                        params: ['20'],
                    },
                    null,
                ],
                type: 'roboid_hamster_s_change_tempo_by',
            },
            paramsKeyMap: {
                INDEX: 0,
                BPM: 1,
            },
            class: 'hamster_s_sound',
            isNotFor: ['roboid'],
            func(sprite, script) {
                const index = script.getNumberValue('INDEX');
                const robot = Entry.Roboid.getHamsterS(index);
                return robot ? robot.changeTempo(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Roboid.hamster_s_add_tempo(%1, %2)',
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
        roboid_hamster_s_set_tempo_to: {
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
                        params: ['0'],
                    },
                    {
                        type: 'text',
                        params: ['60'],
                    },
                    null,
                ],
                type: 'roboid_hamster_s_set_tempo_to',
            },
            paramsKeyMap: {
                INDEX: 0,
                BPM: 1,
            },
            class: 'hamster_s_sound',
            isNotFor: ['roboid'],
            func(sprite, script) {
                const index = script.getNumberValue('INDEX');
                const robot = Entry.Roboid.getHamsterS(index);
                return robot ? robot.setTempo(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Roboid.hamster_s_set_tempo(%1, %2)',
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
        roboid_hamster_s_set_port_to: {
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
                params: [
                    {
                        type: 'text',
                        params: ['0'],
                    },
                    null,
                    null,
                    null,
                ],
                type: 'roboid_hamster_s_set_port_to',
            },
            paramsKeyMap: {
                INDEX: 0,
                PORT: 1,
                MODE: 2,
            },
            class: 'hamster_s_port',
            isNotFor: ['roboid'],
            func(sprite, script) {
                const index = script.getNumberValue('INDEX');
                const robot = Entry.Roboid.getHamsterS(index);
                return robot ? robot.setIoMode(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Roboid.hamster_s_set_io_mode(%1, %2, %3)',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
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
        roboid_hamster_s_change_output_by: {
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
                    {
                        type: 'text',
                        params: ['0'],
                    },
                    null,
                    {
                        type: 'text',
                        params: ['10'],
                    },
                    null,
                ],
                type: 'roboid_hamster_s_change_output_by',
            },
            paramsKeyMap: {
                INDEX: 0,
                PORT: 1,
                VALUE: 2,
            },
            class: 'hamster_s_port',
            isNotFor: ['roboid'],
            func(sprite, script) {
                const index = script.getNumberValue('INDEX');
                const robot = Entry.Roboid.getHamsterS(index);
                return robot ? robot.changeOutput(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Roboid.hamster_s_add_output(%1, %2, %3)',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
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
        roboid_hamster_s_set_output_to: {
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
                    {
                        type: 'text',
                        params: ['0'],
                    },
                    null,
                    {
                        type: 'text',
                        params: ['100'],
                    },
                    null,
                ],
                type: 'roboid_hamster_s_set_output_to',
            },
            paramsKeyMap: {
                INDEX: 0,
                PORT: 1,
                VALUE: 2,
            },
            class: 'hamster_s_port',
            isNotFor: ['roboid'],
            func(sprite, script) {
                const index = script.getNumberValue('INDEX');
                const robot = Entry.Roboid.getHamsterS(index);
                return robot ? robot.setOutput(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Roboid.hamster_s_set_output(%1, %2, %3)',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
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
        roboid_hamster_s_gripper: {
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
                params: [
                    {
                        type: 'text',
                        params: ['0'],
                    },
                    null,
                    null,
                ],
                type: 'roboid_hamster_s_gripper',
            },
            paramsKeyMap: {
                INDEX: 0,
                ACTION: 1,
            },
            class: 'hamster_s_port',
            isNotFor: ['roboid'],
            func(sprite, script) {
                const index = script.getNumberValue('INDEX');
                const robot = Entry.Roboid.getHamsterS(index);
                return robot ? robot.gripper(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Roboid.hamster_s_set_gripper(%1, %2)',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
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
        roboid_hamster_s_release_gripper: {
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
                        params: ['0'],
                    },
                    null,
                ],
                type: 'roboid_hamster_s_release_gripper',
            },
            paramsKeyMap: {
                INDEX: 0,
            },
            class: 'hamster_s_port',
            isNotFor: ['roboid'],
            func(sprite, script) {
                const index = script.getNumberValue('INDEX');
                const robot = Entry.Roboid.getHamsterS(index);
                return robot ? robot.releaseGripper(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Roboid.hamster_s_release_gripper(%1)',
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
        roboid_hamster_s_write_serial: {
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
                    {
                        type: 'text',
                        params: ['0'],
                    },
                    null,
                    {
                        type: 'text',
                        params: ['abc123'],
                    },
                    null,
                ],
                type: 'roboid_hamster_s_write_serial',
            },
            paramsKeyMap: {
                INDEX: 0,
                MODE: 1,
                STRING: 2,
            },
            class: 'hamster_s_port',
            isNotFor: ['roboid'],
            func(sprite, script) {
                const index = script.getNumberValue('INDEX');
                const robot = Entry.Roboid.getHamsterS(index);
                return robot ? robot.writeSerial(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Roboid.hamster_s_write_serial(%1, %2, %3)',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
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
        roboid_hamster_s_read_serial_until: {
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
                params: [
                    {
                        type: 'text',
                        params: ['0'],
                    },
                    null,
                    null,
                ],
                type: 'roboid_hamster_s_read_serial_until',
            },
            paramsKeyMap: {
                INDEX: 0,
                DELIMITER: 1,
            },
            class: 'hamster_s_port',
            isNotFor: ['roboid'],
            func(sprite, script) {
                const index = script.getNumberValue('INDEX');
                const robot = Entry.Roboid.getHamsterS(index);
                return robot ? robot.readSerialUntil(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Roboid.hamster_s_read_serial(%1, %2)',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
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
        roboid_hamster_s_set_serial_rate_to: {
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
                params: [
                    {
                        type: 'text',
                        params: ['0'],
                    },
                    null,
                    null,
                ],
                type: 'roboid_hamster_s_set_serial_rate_to',
            },
            paramsKeyMap: {
                INDEX: 0,
                BAUD: 1,
            },
            class: 'hamster_s_port',
            isNotFor: ['roboid'],
            func(sprite, script) {
                const index = script.getNumberValue('INDEX');
                const robot = Entry.Roboid.getHamsterS(index);
                return robot ? robot.setSerialRate(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Roboid.hamster_s_set_serial_rate(%1, %2)',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
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
        roboid_turtle_touching_color: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.turtle_color_red, '2'],
                        [Lang.Blocks.turtle_color_orange, '3'],
                        [Lang.Blocks.turtle_color_yellow, '4'],
                        [Lang.Blocks.turtle_color_green, '5'],
                        [Lang.Blocks.turtle_color_sky_blue, '6'],
                        [Lang.Blocks.turtle_color_blue, '7'],
                        [Lang.Blocks.turtle_color_purple, '8'],
                        [Lang.Blocks.turtle_color_black, '1'],
                        [Lang.Blocks.turtle_color_white, '9'],
                    ],
                    value: '2',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'text',
                        params: ['0'],
                    },
                    null,
                ],
                type: 'roboid_turtle_touching_color',
            },
            paramsKeyMap: {
                INDEX: 0,
                COLOR: 1,
            },
            class: 'turtle_sensor',
            isNotFor: ['roboid'],
            func(sprite, script) {
                const index = script.getNumberValue('INDEX');
                const robot = Entry.Roboid.getTurtle(index);
                return robot ? robot.checkTouchingColor(script) : false;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Roboid.turtle_is_color_red(%1)',
                        blockType: 'param',
                        textParams: [
                            { type: 'Block', accept: 'string' },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.turtle_color_red, '2'],
                                    [Lang.Blocks.turtle_color_orange, '3'],
                                    [Lang.Blocks.turtle_color_yellow, '4'],
                                    [Lang.Blocks.turtle_color_green, '5'],
                                    [Lang.Blocks.turtle_color_sky_blue, '6'],
                                    [Lang.Blocks.turtle_color_blue, '7'],
                                    [Lang.Blocks.turtle_color_purple, '8'],
                                    [Lang.Blocks.turtle_color_black, '1'],
                                    [Lang.Blocks.turtle_color_white, '9'],
                                ],
                                value: '2',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                        ],
                        params: [null, '2'],
                    },
                    {
                        syntax: 'Roboid.turtle_is_color_orange(%1)',
                        blockType: 'param',
                        textParams: [
                            { type: 'Block', accept: 'string' },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.turtle_color_red, '2'],
                                    [Lang.Blocks.turtle_color_orange, '3'],
                                    [Lang.Blocks.turtle_color_yellow, '4'],
                                    [Lang.Blocks.turtle_color_green, '5'],
                                    [Lang.Blocks.turtle_color_sky_blue, '6'],
                                    [Lang.Blocks.turtle_color_blue, '7'],
                                    [Lang.Blocks.turtle_color_purple, '8'],
                                    [Lang.Blocks.turtle_color_black, '1'],
                                    [Lang.Blocks.turtle_color_white, '9'],
                                ],
                                value: '2',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                        ],
                        params: [null, '3'],
                    },
                    {
                        syntax: 'Roboid.turtle_is_color_yellow(%1)',
                        blockType: 'param',
                        textParams: [
                            { type: 'Block', accept: 'string' },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.turtle_color_red, '2'],
                                    [Lang.Blocks.turtle_color_orange, '3'],
                                    [Lang.Blocks.turtle_color_yellow, '4'],
                                    [Lang.Blocks.turtle_color_green, '5'],
                                    [Lang.Blocks.turtle_color_sky_blue, '6'],
                                    [Lang.Blocks.turtle_color_blue, '7'],
                                    [Lang.Blocks.turtle_color_purple, '8'],
                                    [Lang.Blocks.turtle_color_black, '1'],
                                    [Lang.Blocks.turtle_color_white, '9'],
                                ],
                                value: '2',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                        ],
                        params: [null, '4'],
                    },
                    {
                        syntax: 'Roboid.turtle_is_color_green(%1)',
                        blockType: 'param',
                        textParams: [
                            { type: 'Block', accept: 'string' },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.turtle_color_red, '2'],
                                    [Lang.Blocks.turtle_color_orange, '3'],
                                    [Lang.Blocks.turtle_color_yellow, '4'],
                                    [Lang.Blocks.turtle_color_green, '5'],
                                    [Lang.Blocks.turtle_color_sky_blue, '6'],
                                    [Lang.Blocks.turtle_color_blue, '7'],
                                    [Lang.Blocks.turtle_color_purple, '8'],
                                    [Lang.Blocks.turtle_color_black, '1'],
                                    [Lang.Blocks.turtle_color_white, '9'],
                                ],
                                value: '2',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                        ],
                        params: [null, '5'],
                    },
                    {
                        syntax: 'Roboid.turtle_is_color_sky_blue(%1)',
                        blockType: 'param',
                        textParams: [
                            { type: 'Block', accept: 'string' },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.turtle_color_red, '2'],
                                    [Lang.Blocks.turtle_color_orange, '3'],
                                    [Lang.Blocks.turtle_color_yellow, '4'],
                                    [Lang.Blocks.turtle_color_green, '5'],
                                    [Lang.Blocks.turtle_color_sky_blue, '6'],
                                    [Lang.Blocks.turtle_color_blue, '7'],
                                    [Lang.Blocks.turtle_color_purple, '8'],
                                    [Lang.Blocks.turtle_color_black, '1'],
                                    [Lang.Blocks.turtle_color_white, '9'],
                                ],
                                value: '2',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                        ],
                        params: [null, '6'],
                    },
                    {
                        syntax: 'Roboid.turtle_is_color_blue(%1)',
                        blockType: 'param',
                        textParams: [
                            { type: 'Block', accept: 'string' },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.turtle_color_red, '2'],
                                    [Lang.Blocks.turtle_color_orange, '3'],
                                    [Lang.Blocks.turtle_color_yellow, '4'],
                                    [Lang.Blocks.turtle_color_green, '5'],
                                    [Lang.Blocks.turtle_color_sky_blue, '6'],
                                    [Lang.Blocks.turtle_color_blue, '7'],
                                    [Lang.Blocks.turtle_color_purple, '8'],
                                    [Lang.Blocks.turtle_color_black, '1'],
                                    [Lang.Blocks.turtle_color_white, '9'],
                                ],
                                value: '2',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                        ],
                        params: [null, '7'],
                    },
                    {
                        syntax: 'Roboid.turtle_is_color_purple(%1)',
                        blockType: 'param',
                        textParams: [
                            { type: 'Block', accept: 'string' },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.turtle_color_red, '2'],
                                    [Lang.Blocks.turtle_color_orange, '3'],
                                    [Lang.Blocks.turtle_color_yellow, '4'],
                                    [Lang.Blocks.turtle_color_green, '5'],
                                    [Lang.Blocks.turtle_color_sky_blue, '6'],
                                    [Lang.Blocks.turtle_color_blue, '7'],
                                    [Lang.Blocks.turtle_color_purple, '8'],
                                    [Lang.Blocks.turtle_color_black, '1'],
                                    [Lang.Blocks.turtle_color_white, '9'],
                                ],
                                value: '2',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                        ],
                        params: [null, '8'],
                    },
                    {
                        syntax: 'Roboid.turtle_is_color_black(%1)',
                        blockType: 'param',
                        textParams: [
                            { type: 'Block', accept: 'string' },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.turtle_color_red, '2'],
                                    [Lang.Blocks.turtle_color_orange, '3'],
                                    [Lang.Blocks.turtle_color_yellow, '4'],
                                    [Lang.Blocks.turtle_color_green, '5'],
                                    [Lang.Blocks.turtle_color_sky_blue, '6'],
                                    [Lang.Blocks.turtle_color_blue, '7'],
                                    [Lang.Blocks.turtle_color_purple, '8'],
                                    [Lang.Blocks.turtle_color_black, '1'],
                                    [Lang.Blocks.turtle_color_white, '9'],
                                ],
                                value: '2',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                        ],
                        params: [null, '1'],
                    },
                    {
                        syntax: 'Roboid.turtle_is_color_white(%1)',
                        blockType: 'param',
                        textParams: [
                            { type: 'Block', accept: 'string' },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.turtle_color_red, '2'],
                                    [Lang.Blocks.turtle_color_orange, '3'],
                                    [Lang.Blocks.turtle_color_yellow, '4'],
                                    [Lang.Blocks.turtle_color_green, '5'],
                                    [Lang.Blocks.turtle_color_sky_blue, '6'],
                                    [Lang.Blocks.turtle_color_blue, '7'],
                                    [Lang.Blocks.turtle_color_purple, '8'],
                                    [Lang.Blocks.turtle_color_black, '1'],
                                    [Lang.Blocks.turtle_color_white, '9'],
                                ],
                                value: '2',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                        ],
                        params: [null, '9'],
                    },
                ],
            },
        },
        roboid_turtle_is_color_pattern: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.turtle_color_red, '1'],
                        [Lang.Blocks.turtle_color_yellow, '3'],
                        [Lang.Blocks.turtle_color_green, '4'],
                        [Lang.Blocks.turtle_color_sky_blue, '5'],
                        [Lang.Blocks.turtle_color_blue, '6'],
                        [Lang.Blocks.turtle_color_purple, '7'],
                    ],
                    value: '1',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.turtle_color_red, '1'],
                        [Lang.Blocks.turtle_color_yellow, '3'],
                        [Lang.Blocks.turtle_color_green, '4'],
                        [Lang.Blocks.turtle_color_sky_blue, '5'],
                        [Lang.Blocks.turtle_color_blue, '6'],
                        [Lang.Blocks.turtle_color_purple, '7'],
                    ],
                    value: '3',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'text',
                        params: ['0'],
                    },
                    null,
                    null,
                ],
                type: 'roboid_turtle_is_color_pattern',
            },
            paramsKeyMap: {
                INDEX: 0,
                COLOR1: 1,
                COLOR2: 2,
            },
            class: 'turtle_sensor',
            isNotFor: ['roboid'],
            func(sprite, script) {
                const index = script.getNumberValue('INDEX');
                const robot = Entry.Roboid.getTurtle(index);
                return robot ? robot.checkColorPattern(script) : false;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Roboid.turtle_is_color_pattern_red_red(%1)',
                        blockType: 'param',
                        textParams: [
                            { type: 'Block', accept: 'string' },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.turtle_color_red, '1'],
                                    [Lang.Blocks.turtle_color_yellow, '3'],
                                    [Lang.Blocks.turtle_color_green, '4'],
                                    [Lang.Blocks.turtle_color_sky_blue, '5'],
                                    [Lang.Blocks.turtle_color_blue, '6'],
                                    [Lang.Blocks.turtle_color_purple, '7'],
                                ],
                                value: '1',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.turtle_color_red, '1'],
                                    [Lang.Blocks.turtle_color_yellow, '3'],
                                    [Lang.Blocks.turtle_color_green, '4'],
                                    [Lang.Blocks.turtle_color_sky_blue, '5'],
                                    [Lang.Blocks.turtle_color_blue, '6'],
                                    [Lang.Blocks.turtle_color_purple, '7'],
                                ],
                                value: '3',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                        ],
                        params: [null, '1', '1'],
                    },
                    {
                        syntax: 'Roboid.turtle_is_color_pattern_red_yellow(%1)',
                        blockType: 'param',
                        textParams: [
                            { type: 'Block', accept: 'string' },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.turtle_color_red, '1'],
                                    [Lang.Blocks.turtle_color_yellow, '3'],
                                    [Lang.Blocks.turtle_color_green, '4'],
                                    [Lang.Blocks.turtle_color_sky_blue, '5'],
                                    [Lang.Blocks.turtle_color_blue, '6'],
                                    [Lang.Blocks.turtle_color_purple, '7'],
                                ],
                                value: '1',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.turtle_color_red, '1'],
                                    [Lang.Blocks.turtle_color_yellow, '3'],
                                    [Lang.Blocks.turtle_color_green, '4'],
                                    [Lang.Blocks.turtle_color_sky_blue, '5'],
                                    [Lang.Blocks.turtle_color_blue, '6'],
                                    [Lang.Blocks.turtle_color_purple, '7'],
                                ],
                                value: '3',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                        ],
                        params: [null, '1', '3'],
                    },
                    {
                        syntax: 'Roboid.turtle_is_color_pattern_red_green(%1)',
                        blockType: 'param',
                        textParams: [
                            { type: 'Block', accept: 'string' },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.turtle_color_red, '1'],
                                    [Lang.Blocks.turtle_color_yellow, '3'],
                                    [Lang.Blocks.turtle_color_green, '4'],
                                    [Lang.Blocks.turtle_color_sky_blue, '5'],
                                    [Lang.Blocks.turtle_color_blue, '6'],
                                    [Lang.Blocks.turtle_color_purple, '7'],
                                ],
                                value: '1',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.turtle_color_red, '1'],
                                    [Lang.Blocks.turtle_color_yellow, '3'],
                                    [Lang.Blocks.turtle_color_green, '4'],
                                    [Lang.Blocks.turtle_color_sky_blue, '5'],
                                    [Lang.Blocks.turtle_color_blue, '6'],
                                    [Lang.Blocks.turtle_color_purple, '7'],
                                ],
                                value: '3',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                        ],
                        params: [null, '1', '4'],
                    },
                    {
                        syntax: 'Roboid.turtle_is_color_pattern_red_sky_blue(%1)',
                        blockType: 'param',
                        textParams: [
                            { type: 'Block', accept: 'string' },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.turtle_color_red, '1'],
                                    [Lang.Blocks.turtle_color_yellow, '3'],
                                    [Lang.Blocks.turtle_color_green, '4'],
                                    [Lang.Blocks.turtle_color_sky_blue, '5'],
                                    [Lang.Blocks.turtle_color_blue, '6'],
                                    [Lang.Blocks.turtle_color_purple, '7'],
                                ],
                                value: '1',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.turtle_color_red, '1'],
                                    [Lang.Blocks.turtle_color_yellow, '3'],
                                    [Lang.Blocks.turtle_color_green, '4'],
                                    [Lang.Blocks.turtle_color_sky_blue, '5'],
                                    [Lang.Blocks.turtle_color_blue, '6'],
                                    [Lang.Blocks.turtle_color_purple, '7'],
                                ],
                                value: '3',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                        ],
                        params: [null, '1', '5'],
                    },
                    {
                        syntax: 'Roboid.turtle_is_color_pattern_red_blue(%1)',
                        blockType: 'param',
                        textParams: [
                            { type: 'Block', accept: 'string' },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.turtle_color_red, '1'],
                                    [Lang.Blocks.turtle_color_yellow, '3'],
                                    [Lang.Blocks.turtle_color_green, '4'],
                                    [Lang.Blocks.turtle_color_sky_blue, '5'],
                                    [Lang.Blocks.turtle_color_blue, '6'],
                                    [Lang.Blocks.turtle_color_purple, '7'],
                                ],
                                value: '1',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.turtle_color_red, '1'],
                                    [Lang.Blocks.turtle_color_yellow, '3'],
                                    [Lang.Blocks.turtle_color_green, '4'],
                                    [Lang.Blocks.turtle_color_sky_blue, '5'],
                                    [Lang.Blocks.turtle_color_blue, '6'],
                                    [Lang.Blocks.turtle_color_purple, '7'],
                                ],
                                value: '3',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                        ],
                        params: [null, '1', '6'],
                    },
                    {
                        syntax: 'Roboid.turtle_is_color_pattern_red_purple(%1)',
                        blockType: 'param',
                        textParams: [
                            { type: 'Block', accept: 'string' },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.turtle_color_red, '1'],
                                    [Lang.Blocks.turtle_color_yellow, '3'],
                                    [Lang.Blocks.turtle_color_green, '4'],
                                    [Lang.Blocks.turtle_color_sky_blue, '5'],
                                    [Lang.Blocks.turtle_color_blue, '6'],
                                    [Lang.Blocks.turtle_color_purple, '7'],
                                ],
                                value: '1',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.turtle_color_red, '1'],
                                    [Lang.Blocks.turtle_color_yellow, '3'],
                                    [Lang.Blocks.turtle_color_green, '4'],
                                    [Lang.Blocks.turtle_color_sky_blue, '5'],
                                    [Lang.Blocks.turtle_color_blue, '6'],
                                    [Lang.Blocks.turtle_color_purple, '7'],
                                ],
                                value: '3',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                        ],
                        params: [null, '1', '7'],
                    },
                    {
                        syntax: 'Roboid.turtle_is_color_pattern_yellow_red(%1)',
                        blockType: 'param',
                        textParams: [
                            { type: 'Block', accept: 'string' },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.turtle_color_red, '1'],
                                    [Lang.Blocks.turtle_color_yellow, '3'],
                                    [Lang.Blocks.turtle_color_green, '4'],
                                    [Lang.Blocks.turtle_color_sky_blue, '5'],
                                    [Lang.Blocks.turtle_color_blue, '6'],
                                    [Lang.Blocks.turtle_color_purple, '7'],
                                ],
                                value: '1',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.turtle_color_red, '1'],
                                    [Lang.Blocks.turtle_color_yellow, '3'],
                                    [Lang.Blocks.turtle_color_green, '4'],
                                    [Lang.Blocks.turtle_color_sky_blue, '5'],
                                    [Lang.Blocks.turtle_color_blue, '6'],
                                    [Lang.Blocks.turtle_color_purple, '7'],
                                ],
                                value: '3',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                        ],
                        params: [null, '3', '1'],
                    },
                    {
                        syntax: 'Roboid.turtle_is_color_pattern_yellow_yellow(%1)',
                        blockType: 'param',
                        textParams: [
                            { type: 'Block', accept: 'string' },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.turtle_color_red, '1'],
                                    [Lang.Blocks.turtle_color_yellow, '3'],
                                    [Lang.Blocks.turtle_color_green, '4'],
                                    [Lang.Blocks.turtle_color_sky_blue, '5'],
                                    [Lang.Blocks.turtle_color_blue, '6'],
                                    [Lang.Blocks.turtle_color_purple, '7'],
                                ],
                                value: '1',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.turtle_color_red, '1'],
                                    [Lang.Blocks.turtle_color_yellow, '3'],
                                    [Lang.Blocks.turtle_color_green, '4'],
                                    [Lang.Blocks.turtle_color_sky_blue, '5'],
                                    [Lang.Blocks.turtle_color_blue, '6'],
                                    [Lang.Blocks.turtle_color_purple, '7'],
                                ],
                                value: '3',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                        ],
                        params: [null, '3', '3'],
                    },
                    {
                        syntax: 'Roboid.turtle_is_color_pattern_yellow_green(%1)',
                        blockType: 'param',
                        textParams: [
                            { type: 'Block', accept: 'string' },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.turtle_color_red, '1'],
                                    [Lang.Blocks.turtle_color_yellow, '3'],
                                    [Lang.Blocks.turtle_color_green, '4'],
                                    [Lang.Blocks.turtle_color_sky_blue, '5'],
                                    [Lang.Blocks.turtle_color_blue, '6'],
                                    [Lang.Blocks.turtle_color_purple, '7'],
                                ],
                                value: '1',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.turtle_color_red, '1'],
                                    [Lang.Blocks.turtle_color_yellow, '3'],
                                    [Lang.Blocks.turtle_color_green, '4'],
                                    [Lang.Blocks.turtle_color_sky_blue, '5'],
                                    [Lang.Blocks.turtle_color_blue, '6'],
                                    [Lang.Blocks.turtle_color_purple, '7'],
                                ],
                                value: '3',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                        ],
                        params: [null, '3', '4'],
                    },
                    {
                        syntax: 'Roboid.turtle_is_color_pattern_yellow_sky_blue(%1)',
                        blockType: 'param',
                        textParams: [
                            { type: 'Block', accept: 'string' },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.turtle_color_red, '1'],
                                    [Lang.Blocks.turtle_color_yellow, '3'],
                                    [Lang.Blocks.turtle_color_green, '4'],
                                    [Lang.Blocks.turtle_color_sky_blue, '5'],
                                    [Lang.Blocks.turtle_color_blue, '6'],
                                    [Lang.Blocks.turtle_color_purple, '7'],
                                ],
                                value: '1',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.turtle_color_red, '1'],
                                    [Lang.Blocks.turtle_color_yellow, '3'],
                                    [Lang.Blocks.turtle_color_green, '4'],
                                    [Lang.Blocks.turtle_color_sky_blue, '5'],
                                    [Lang.Blocks.turtle_color_blue, '6'],
                                    [Lang.Blocks.turtle_color_purple, '7'],
                                ],
                                value: '3',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                        ],
                        params: [null, '3', '5'],
                    },
                    {
                        syntax: 'Roboid.turtle_is_color_pattern_yellow_blue(%1)',
                        blockType: 'param',
                        textParams: [
                            { type: 'Block', accept: 'string' },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.turtle_color_red, '1'],
                                    [Lang.Blocks.turtle_color_yellow, '3'],
                                    [Lang.Blocks.turtle_color_green, '4'],
                                    [Lang.Blocks.turtle_color_sky_blue, '5'],
                                    [Lang.Blocks.turtle_color_blue, '6'],
                                    [Lang.Blocks.turtle_color_purple, '7'],
                                ],
                                value: '1',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.turtle_color_red, '1'],
                                    [Lang.Blocks.turtle_color_yellow, '3'],
                                    [Lang.Blocks.turtle_color_green, '4'],
                                    [Lang.Blocks.turtle_color_sky_blue, '5'],
                                    [Lang.Blocks.turtle_color_blue, '6'],
                                    [Lang.Blocks.turtle_color_purple, '7'],
                                ],
                                value: '3',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                        ],
                        params: [null, '3', '6'],
                    },
                    {
                        syntax: 'Roboid.turtle_is_color_pattern_yellow_purple(%1)',
                        blockType: 'param',
                        textParams: [
                            { type: 'Block', accept: 'string' },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.turtle_color_red, '1'],
                                    [Lang.Blocks.turtle_color_yellow, '3'],
                                    [Lang.Blocks.turtle_color_green, '4'],
                                    [Lang.Blocks.turtle_color_sky_blue, '5'],
                                    [Lang.Blocks.turtle_color_blue, '6'],
                                    [Lang.Blocks.turtle_color_purple, '7'],
                                ],
                                value: '1',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.turtle_color_red, '1'],
                                    [Lang.Blocks.turtle_color_yellow, '3'],
                                    [Lang.Blocks.turtle_color_green, '4'],
                                    [Lang.Blocks.turtle_color_sky_blue, '5'],
                                    [Lang.Blocks.turtle_color_blue, '6'],
                                    [Lang.Blocks.turtle_color_purple, '7'],
                                ],
                                value: '3',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                        ],
                        params: [null, '3', '7'],
                    },
                    {
                        syntax: 'Roboid.turtle_is_color_pattern_green_red(%1)',
                        blockType: 'param',
                        textParams: [
                            { type: 'Block', accept: 'string' },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.turtle_color_red, '1'],
                                    [Lang.Blocks.turtle_color_yellow, '3'],
                                    [Lang.Blocks.turtle_color_green, '4'],
                                    [Lang.Blocks.turtle_color_sky_blue, '5'],
                                    [Lang.Blocks.turtle_color_blue, '6'],
                                    [Lang.Blocks.turtle_color_purple, '7'],
                                ],
                                value: '1',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.turtle_color_red, '1'],
                                    [Lang.Blocks.turtle_color_yellow, '3'],
                                    [Lang.Blocks.turtle_color_green, '4'],
                                    [Lang.Blocks.turtle_color_sky_blue, '5'],
                                    [Lang.Blocks.turtle_color_blue, '6'],
                                    [Lang.Blocks.turtle_color_purple, '7'],
                                ],
                                value: '3',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                        ],
                        params: [null, '4', '1'],
                    },
                    {
                        syntax: 'Roboid.turtle_is_color_pattern_green_yellow(%1)',
                        blockType: 'param',
                        textParams: [
                            { type: 'Block', accept: 'string' },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.turtle_color_red, '1'],
                                    [Lang.Blocks.turtle_color_yellow, '3'],
                                    [Lang.Blocks.turtle_color_green, '4'],
                                    [Lang.Blocks.turtle_color_sky_blue, '5'],
                                    [Lang.Blocks.turtle_color_blue, '6'],
                                    [Lang.Blocks.turtle_color_purple, '7'],
                                ],
                                value: '1',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.turtle_color_red, '1'],
                                    [Lang.Blocks.turtle_color_yellow, '3'],
                                    [Lang.Blocks.turtle_color_green, '4'],
                                    [Lang.Blocks.turtle_color_sky_blue, '5'],
                                    [Lang.Blocks.turtle_color_blue, '6'],
                                    [Lang.Blocks.turtle_color_purple, '7'],
                                ],
                                value: '3',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                        ],
                        params: [null, '4', '3'],
                    },
                    {
                        syntax: 'Roboid.turtle_is_color_pattern_green_green(%1)',
                        blockType: 'param',
                        textParams: [
                            { type: 'Block', accept: 'string' },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.turtle_color_red, '1'],
                                    [Lang.Blocks.turtle_color_yellow, '3'],
                                    [Lang.Blocks.turtle_color_green, '4'],
                                    [Lang.Blocks.turtle_color_sky_blue, '5'],
                                    [Lang.Blocks.turtle_color_blue, '6'],
                                    [Lang.Blocks.turtle_color_purple, '7'],
                                ],
                                value: '1',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.turtle_color_red, '1'],
                                    [Lang.Blocks.turtle_color_yellow, '3'],
                                    [Lang.Blocks.turtle_color_green, '4'],
                                    [Lang.Blocks.turtle_color_sky_blue, '5'],
                                    [Lang.Blocks.turtle_color_blue, '6'],
                                    [Lang.Blocks.turtle_color_purple, '7'],
                                ],
                                value: '3',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                        ],
                        params: [null, '4', '4'],
                    },
                    {
                        syntax: 'Roboid.turtle_is_color_pattern_green_sky_blue(%1)',
                        blockType: 'param',
                        textParams: [
                            { type: 'Block', accept: 'string' },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.turtle_color_red, '1'],
                                    [Lang.Blocks.turtle_color_yellow, '3'],
                                    [Lang.Blocks.turtle_color_green, '4'],
                                    [Lang.Blocks.turtle_color_sky_blue, '5'],
                                    [Lang.Blocks.turtle_color_blue, '6'],
                                    [Lang.Blocks.turtle_color_purple, '7'],
                                ],
                                value: '1',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.turtle_color_red, '1'],
                                    [Lang.Blocks.turtle_color_yellow, '3'],
                                    [Lang.Blocks.turtle_color_green, '4'],
                                    [Lang.Blocks.turtle_color_sky_blue, '5'],
                                    [Lang.Blocks.turtle_color_blue, '6'],
                                    [Lang.Blocks.turtle_color_purple, '7'],
                                ],
                                value: '3',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                        ],
                        params: [null, '4', '5'],
                    },
                    {
                        syntax: 'Roboid.turtle_is_color_pattern_green_blue(%1)',
                        blockType: 'param',
                        textParams: [
                            { type: 'Block', accept: 'string' },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.turtle_color_red, '1'],
                                    [Lang.Blocks.turtle_color_yellow, '3'],
                                    [Lang.Blocks.turtle_color_green, '4'],
                                    [Lang.Blocks.turtle_color_sky_blue, '5'],
                                    [Lang.Blocks.turtle_color_blue, '6'],
                                    [Lang.Blocks.turtle_color_purple, '7'],
                                ],
                                value: '1',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.turtle_color_red, '1'],
                                    [Lang.Blocks.turtle_color_yellow, '3'],
                                    [Lang.Blocks.turtle_color_green, '4'],
                                    [Lang.Blocks.turtle_color_sky_blue, '5'],
                                    [Lang.Blocks.turtle_color_blue, '6'],
                                    [Lang.Blocks.turtle_color_purple, '7'],
                                ],
                                value: '3',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                        ],
                        params: [null, '4', '6'],
                    },
                    {
                        syntax: 'Roboid.turtle_is_color_pattern_green_purple(%1)',
                        blockType: 'param',
                        textParams: [
                            { type: 'Block', accept: 'string' },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.turtle_color_red, '1'],
                                    [Lang.Blocks.turtle_color_yellow, '3'],
                                    [Lang.Blocks.turtle_color_green, '4'],
                                    [Lang.Blocks.turtle_color_sky_blue, '5'],
                                    [Lang.Blocks.turtle_color_blue, '6'],
                                    [Lang.Blocks.turtle_color_purple, '7'],
                                ],
                                value: '1',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.turtle_color_red, '1'],
                                    [Lang.Blocks.turtle_color_yellow, '3'],
                                    [Lang.Blocks.turtle_color_green, '4'],
                                    [Lang.Blocks.turtle_color_sky_blue, '5'],
                                    [Lang.Blocks.turtle_color_blue, '6'],
                                    [Lang.Blocks.turtle_color_purple, '7'],
                                ],
                                value: '3',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                        ],
                        params: [null, '4', '7'],
                    },
                    {
                        syntax: 'Roboid.turtle_is_color_pattern_sky_blue_red(%1)',
                        blockType: 'param',
                        textParams: [
                            { type: 'Block', accept: 'string' },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.turtle_color_red, '1'],
                                    [Lang.Blocks.turtle_color_yellow, '3'],
                                    [Lang.Blocks.turtle_color_green, '4'],
                                    [Lang.Blocks.turtle_color_sky_blue, '5'],
                                    [Lang.Blocks.turtle_color_blue, '6'],
                                    [Lang.Blocks.turtle_color_purple, '7'],
                                ],
                                value: '1',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.turtle_color_red, '1'],
                                    [Lang.Blocks.turtle_color_yellow, '3'],
                                    [Lang.Blocks.turtle_color_green, '4'],
                                    [Lang.Blocks.turtle_color_sky_blue, '5'],
                                    [Lang.Blocks.turtle_color_blue, '6'],
                                    [Lang.Blocks.turtle_color_purple, '7'],
                                ],
                                value: '3',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                        ],
                        params: [null, '5', '1'],
                    },
                    {
                        syntax: 'Roboid.turtle_is_color_pattern_sky_blue_yellow(%1)',
                        blockType: 'param',
                        textParams: [
                            { type: 'Block', accept: 'string' },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.turtle_color_red, '1'],
                                    [Lang.Blocks.turtle_color_yellow, '3'],
                                    [Lang.Blocks.turtle_color_green, '4'],
                                    [Lang.Blocks.turtle_color_sky_blue, '5'],
                                    [Lang.Blocks.turtle_color_blue, '6'],
                                    [Lang.Blocks.turtle_color_purple, '7'],
                                ],
                                value: '1',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.turtle_color_red, '1'],
                                    [Lang.Blocks.turtle_color_yellow, '3'],
                                    [Lang.Blocks.turtle_color_green, '4'],
                                    [Lang.Blocks.turtle_color_sky_blue, '5'],
                                    [Lang.Blocks.turtle_color_blue, '6'],
                                    [Lang.Blocks.turtle_color_purple, '7'],
                                ],
                                value: '3',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                        ],
                        params: [null, '5', '3'],
                    },
                    {
                        syntax: 'Roboid.turtle_is_color_pattern_sky_blue_green(%1)',
                        blockType: 'param',
                        textParams: [
                            { type: 'Block', accept: 'string' },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.turtle_color_red, '1'],
                                    [Lang.Blocks.turtle_color_yellow, '3'],
                                    [Lang.Blocks.turtle_color_green, '4'],
                                    [Lang.Blocks.turtle_color_sky_blue, '5'],
                                    [Lang.Blocks.turtle_color_blue, '6'],
                                    [Lang.Blocks.turtle_color_purple, '7'],
                                ],
                                value: '1',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.turtle_color_red, '1'],
                                    [Lang.Blocks.turtle_color_yellow, '3'],
                                    [Lang.Blocks.turtle_color_green, '4'],
                                    [Lang.Blocks.turtle_color_sky_blue, '5'],
                                    [Lang.Blocks.turtle_color_blue, '6'],
                                    [Lang.Blocks.turtle_color_purple, '7'],
                                ],
                                value: '3',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                        ],
                        params: [null, '5', '4'],
                    },
                    {
                        syntax: 'Roboid.turtle_is_color_pattern_sky_blue_sky_blue(%1)',
                        blockType: 'param',
                        textParams: [
                            { type: 'Block', accept: 'string' },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.turtle_color_red, '1'],
                                    [Lang.Blocks.turtle_color_yellow, '3'],
                                    [Lang.Blocks.turtle_color_green, '4'],
                                    [Lang.Blocks.turtle_color_sky_blue, '5'],
                                    [Lang.Blocks.turtle_color_blue, '6'],
                                    [Lang.Blocks.turtle_color_purple, '7'],
                                ],
                                value: '1',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.turtle_color_red, '1'],
                                    [Lang.Blocks.turtle_color_yellow, '3'],
                                    [Lang.Blocks.turtle_color_green, '4'],
                                    [Lang.Blocks.turtle_color_sky_blue, '5'],
                                    [Lang.Blocks.turtle_color_blue, '6'],
                                    [Lang.Blocks.turtle_color_purple, '7'],
                                ],
                                value: '3',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                        ],
                        params: [null, '5', '5'],
                    },
                    {
                        syntax: 'Roboid.turtle_is_color_pattern_sky_blue_blue(%1)',
                        blockType: 'param',
                        textParams: [
                            { type: 'Block', accept: 'string' },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.turtle_color_red, '1'],
                                    [Lang.Blocks.turtle_color_yellow, '3'],
                                    [Lang.Blocks.turtle_color_green, '4'],
                                    [Lang.Blocks.turtle_color_sky_blue, '5'],
                                    [Lang.Blocks.turtle_color_blue, '6'],
                                    [Lang.Blocks.turtle_color_purple, '7'],
                                ],
                                value: '1',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.turtle_color_red, '1'],
                                    [Lang.Blocks.turtle_color_yellow, '3'],
                                    [Lang.Blocks.turtle_color_green, '4'],
                                    [Lang.Blocks.turtle_color_sky_blue, '5'],
                                    [Lang.Blocks.turtle_color_blue, '6'],
                                    [Lang.Blocks.turtle_color_purple, '7'],
                                ],
                                value: '3',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                        ],
                        params: [null, '5', '6'],
                    },
                    {
                        syntax: 'Roboid.turtle_is_color_pattern_sky_blue_purple(%1)',
                        blockType: 'param',
                        textParams: [
                            { type: 'Block', accept: 'string' },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.turtle_color_red, '1'],
                                    [Lang.Blocks.turtle_color_yellow, '3'],
                                    [Lang.Blocks.turtle_color_green, '4'],
                                    [Lang.Blocks.turtle_color_sky_blue, '5'],
                                    [Lang.Blocks.turtle_color_blue, '6'],
                                    [Lang.Blocks.turtle_color_purple, '7'],
                                ],
                                value: '1',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.turtle_color_red, '1'],
                                    [Lang.Blocks.turtle_color_yellow, '3'],
                                    [Lang.Blocks.turtle_color_green, '4'],
                                    [Lang.Blocks.turtle_color_sky_blue, '5'],
                                    [Lang.Blocks.turtle_color_blue, '6'],
                                    [Lang.Blocks.turtle_color_purple, '7'],
                                ],
                                value: '3',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                        ],
                        params: [null, '5', '7'],
                    },
                    {
                        syntax: 'Roboid.turtle_is_color_pattern_blue_red(%1)',
                        blockType: 'param',
                        textParams: [
                            { type: 'Block', accept: 'string' },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.turtle_color_red, '1'],
                                    [Lang.Blocks.turtle_color_yellow, '3'],
                                    [Lang.Blocks.turtle_color_green, '4'],
                                    [Lang.Blocks.turtle_color_sky_blue, '5'],
                                    [Lang.Blocks.turtle_color_blue, '6'],
                                    [Lang.Blocks.turtle_color_purple, '7'],
                                ],
                                value: '1',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.turtle_color_red, '1'],
                                    [Lang.Blocks.turtle_color_yellow, '3'],
                                    [Lang.Blocks.turtle_color_green, '4'],
                                    [Lang.Blocks.turtle_color_sky_blue, '5'],
                                    [Lang.Blocks.turtle_color_blue, '6'],
                                    [Lang.Blocks.turtle_color_purple, '7'],
                                ],
                                value: '3',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                        ],
                        params: [null, '6', '1'],
                    },
                    {
                        syntax: 'Roboid.turtle_is_color_pattern_blue_yellow(%1)',
                        blockType: 'param',
                        textParams: [
                            { type: 'Block', accept: 'string' },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.turtle_color_red, '1'],
                                    [Lang.Blocks.turtle_color_yellow, '3'],
                                    [Lang.Blocks.turtle_color_green, '4'],
                                    [Lang.Blocks.turtle_color_sky_blue, '5'],
                                    [Lang.Blocks.turtle_color_blue, '6'],
                                    [Lang.Blocks.turtle_color_purple, '7'],
                                ],
                                value: '1',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.turtle_color_red, '1'],
                                    [Lang.Blocks.turtle_color_yellow, '3'],
                                    [Lang.Blocks.turtle_color_green, '4'],
                                    [Lang.Blocks.turtle_color_sky_blue, '5'],
                                    [Lang.Blocks.turtle_color_blue, '6'],
                                    [Lang.Blocks.turtle_color_purple, '7'],
                                ],
                                value: '3',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                        ],
                        params: [null, '6', '3'],
                    },
                    {
                        syntax: 'Roboid.turtle_is_color_pattern_blue_green(%1)',
                        blockType: 'param',
                        textParams: [
                            { type: 'Block', accept: 'string' },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.turtle_color_red, '1'],
                                    [Lang.Blocks.turtle_color_yellow, '3'],
                                    [Lang.Blocks.turtle_color_green, '4'],
                                    [Lang.Blocks.turtle_color_sky_blue, '5'],
                                    [Lang.Blocks.turtle_color_blue, '6'],
                                    [Lang.Blocks.turtle_color_purple, '7'],
                                ],
                                value: '1',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.turtle_color_red, '1'],
                                    [Lang.Blocks.turtle_color_yellow, '3'],
                                    [Lang.Blocks.turtle_color_green, '4'],
                                    [Lang.Blocks.turtle_color_sky_blue, '5'],
                                    [Lang.Blocks.turtle_color_blue, '6'],
                                    [Lang.Blocks.turtle_color_purple, '7'],
                                ],
                                value: '3',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                        ],
                        params: [null, '6', '4'],
                    },
                    {
                        syntax: 'Roboid.turtle_is_color_pattern_blue_sky_blue(%1)',
                        blockType: 'param',
                        textParams: [
                            { type: 'Block', accept: 'string' },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.turtle_color_red, '1'],
                                    [Lang.Blocks.turtle_color_yellow, '3'],
                                    [Lang.Blocks.turtle_color_green, '4'],
                                    [Lang.Blocks.turtle_color_sky_blue, '5'],
                                    [Lang.Blocks.turtle_color_blue, '6'],
                                    [Lang.Blocks.turtle_color_purple, '7'],
                                ],
                                value: '1',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.turtle_color_red, '1'],
                                    [Lang.Blocks.turtle_color_yellow, '3'],
                                    [Lang.Blocks.turtle_color_green, '4'],
                                    [Lang.Blocks.turtle_color_sky_blue, '5'],
                                    [Lang.Blocks.turtle_color_blue, '6'],
                                    [Lang.Blocks.turtle_color_purple, '7'],
                                ],
                                value: '3',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                        ],
                        params: [null, '6', '5'],
                    },
                    {
                        syntax: 'Roboid.turtle_is_color_pattern_blue_blue(%1)',
                        blockType: 'param',
                        textParams: [
                            { type: 'Block', accept: 'string' },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.turtle_color_red, '1'],
                                    [Lang.Blocks.turtle_color_yellow, '3'],
                                    [Lang.Blocks.turtle_color_green, '4'],
                                    [Lang.Blocks.turtle_color_sky_blue, '5'],
                                    [Lang.Blocks.turtle_color_blue, '6'],
                                    [Lang.Blocks.turtle_color_purple, '7'],
                                ],
                                value: '1',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.turtle_color_red, '1'],
                                    [Lang.Blocks.turtle_color_yellow, '3'],
                                    [Lang.Blocks.turtle_color_green, '4'],
                                    [Lang.Blocks.turtle_color_sky_blue, '5'],
                                    [Lang.Blocks.turtle_color_blue, '6'],
                                    [Lang.Blocks.turtle_color_purple, '7'],
                                ],
                                value: '3',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                        ],
                        params: [null, '6', '6'],
                    },
                    {
                        syntax: 'Roboid.turtle_is_color_pattern_blue_purple(%1)',
                        blockType: 'param',
                        textParams: [
                            { type: 'Block', accept: 'string' },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.turtle_color_red, '1'],
                                    [Lang.Blocks.turtle_color_yellow, '3'],
                                    [Lang.Blocks.turtle_color_green, '4'],
                                    [Lang.Blocks.turtle_color_sky_blue, '5'],
                                    [Lang.Blocks.turtle_color_blue, '6'],
                                    [Lang.Blocks.turtle_color_purple, '7'],
                                ],
                                value: '1',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.turtle_color_red, '1'],
                                    [Lang.Blocks.turtle_color_yellow, '3'],
                                    [Lang.Blocks.turtle_color_green, '4'],
                                    [Lang.Blocks.turtle_color_sky_blue, '5'],
                                    [Lang.Blocks.turtle_color_blue, '6'],
                                    [Lang.Blocks.turtle_color_purple, '7'],
                                ],
                                value: '3',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                        ],
                        params: [null, '6', '7'],
                    },
                    {
                        syntax: 'Roboid.turtle_is_color_pattern_purple_red(%1)',
                        blockType: 'param',
                        textParams: [
                            { type: 'Block', accept: 'string' },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.turtle_color_red, '1'],
                                    [Lang.Blocks.turtle_color_yellow, '3'],
                                    [Lang.Blocks.turtle_color_green, '4'],
                                    [Lang.Blocks.turtle_color_sky_blue, '5'],
                                    [Lang.Blocks.turtle_color_blue, '6'],
                                    [Lang.Blocks.turtle_color_purple, '7'],
                                ],
                                value: '1',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.turtle_color_red, '1'],
                                    [Lang.Blocks.turtle_color_yellow, '3'],
                                    [Lang.Blocks.turtle_color_green, '4'],
                                    [Lang.Blocks.turtle_color_sky_blue, '5'],
                                    [Lang.Blocks.turtle_color_blue, '6'],
                                    [Lang.Blocks.turtle_color_purple, '7'],
                                ],
                                value: '3',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                        ],
                        params: [null, '7', '1'],
                    },
                    {
                        syntax: 'Roboid.turtle_is_color_pattern_purple_yellow(%1)',
                        blockType: 'param',
                        textParams: [
                            { type: 'Block', accept: 'string' },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.turtle_color_red, '1'],
                                    [Lang.Blocks.turtle_color_yellow, '3'],
                                    [Lang.Blocks.turtle_color_green, '4'],
                                    [Lang.Blocks.turtle_color_sky_blue, '5'],
                                    [Lang.Blocks.turtle_color_blue, '6'],
                                    [Lang.Blocks.turtle_color_purple, '7'],
                                ],
                                value: '1',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.turtle_color_red, '1'],
                                    [Lang.Blocks.turtle_color_yellow, '3'],
                                    [Lang.Blocks.turtle_color_green, '4'],
                                    [Lang.Blocks.turtle_color_sky_blue, '5'],
                                    [Lang.Blocks.turtle_color_blue, '6'],
                                    [Lang.Blocks.turtle_color_purple, '7'],
                                ],
                                value: '3',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                        ],
                        params: [null, '7', '3'],
                    },
                    {
                        syntax: 'Roboid.turtle_is_color_pattern_purple_green(%1)',
                        blockType: 'param',
                        textParams: [
                            { type: 'Block', accept: 'string' },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.turtle_color_red, '1'],
                                    [Lang.Blocks.turtle_color_yellow, '3'],
                                    [Lang.Blocks.turtle_color_green, '4'],
                                    [Lang.Blocks.turtle_color_sky_blue, '5'],
                                    [Lang.Blocks.turtle_color_blue, '6'],
                                    [Lang.Blocks.turtle_color_purple, '7'],
                                ],
                                value: '1',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.turtle_color_red, '1'],
                                    [Lang.Blocks.turtle_color_yellow, '3'],
                                    [Lang.Blocks.turtle_color_green, '4'],
                                    [Lang.Blocks.turtle_color_sky_blue, '5'],
                                    [Lang.Blocks.turtle_color_blue, '6'],
                                    [Lang.Blocks.turtle_color_purple, '7'],
                                ],
                                value: '3',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                        ],
                        params: [null, '7', '4'],
                    },
                    {
                        syntax: 'Roboid.turtle_is_color_pattern_purple_sky_blue(%1)',
                        blockType: 'param',
                        textParams: [
                            { type: 'Block', accept: 'string' },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.turtle_color_red, '1'],
                                    [Lang.Blocks.turtle_color_yellow, '3'],
                                    [Lang.Blocks.turtle_color_green, '4'],
                                    [Lang.Blocks.turtle_color_sky_blue, '5'],
                                    [Lang.Blocks.turtle_color_blue, '6'],
                                    [Lang.Blocks.turtle_color_purple, '7'],
                                ],
                                value: '1',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.turtle_color_red, '1'],
                                    [Lang.Blocks.turtle_color_yellow, '3'],
                                    [Lang.Blocks.turtle_color_green, '4'],
                                    [Lang.Blocks.turtle_color_sky_blue, '5'],
                                    [Lang.Blocks.turtle_color_blue, '6'],
                                    [Lang.Blocks.turtle_color_purple, '7'],
                                ],
                                value: '3',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                        ],
                        params: [null, '7', '5'],
                    },
                    {
                        syntax: 'Roboid.turtle_is_color_pattern_purple_blue(%1)',
                        blockType: 'param',
                        textParams: [
                            { type: 'Block', accept: 'string' },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.turtle_color_red, '1'],
                                    [Lang.Blocks.turtle_color_yellow, '3'],
                                    [Lang.Blocks.turtle_color_green, '4'],
                                    [Lang.Blocks.turtle_color_sky_blue, '5'],
                                    [Lang.Blocks.turtle_color_blue, '6'],
                                    [Lang.Blocks.turtle_color_purple, '7'],
                                ],
                                value: '1',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.turtle_color_red, '1'],
                                    [Lang.Blocks.turtle_color_yellow, '3'],
                                    [Lang.Blocks.turtle_color_green, '4'],
                                    [Lang.Blocks.turtle_color_sky_blue, '5'],
                                    [Lang.Blocks.turtle_color_blue, '6'],
                                    [Lang.Blocks.turtle_color_purple, '7'],
                                ],
                                value: '3',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                        ],
                        params: [null, '7', '6'],
                    },
                    {
                        syntax: 'Roboid.turtle_is_color_pattern_purple_purple(%1)',
                        blockType: 'param',
                        textParams: [
                            { type: 'Block', accept: 'string' },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.turtle_color_red, '1'],
                                    [Lang.Blocks.turtle_color_yellow, '3'],
                                    [Lang.Blocks.turtle_color_green, '4'],
                                    [Lang.Blocks.turtle_color_sky_blue, '5'],
                                    [Lang.Blocks.turtle_color_blue, '6'],
                                    [Lang.Blocks.turtle_color_purple, '7'],
                                ],
                                value: '1',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.turtle_color_red, '1'],
                                    [Lang.Blocks.turtle_color_yellow, '3'],
                                    [Lang.Blocks.turtle_color_green, '4'],
                                    [Lang.Blocks.turtle_color_sky_blue, '5'],
                                    [Lang.Blocks.turtle_color_blue, '6'],
                                    [Lang.Blocks.turtle_color_purple, '7'],
                                ],
                                value: '3',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                        ],
                        params: [null, '7', '7'],
                    },
                ],
            },
        },
        roboid_turtle_button_state: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.turtle_clicked, 'clicked'],
                        [Lang.Blocks.turtle_double_clicked, 'doubleClicked'],
                        [Lang.Blocks.turtle_long_pressed, 'longPressed'],
                    ],
                    value: 'clicked',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'text',
                        params: ['0'],
                    },
                    null,
                ],
                type: 'roboid_turtle_button_state',
            },
            paramsKeyMap: {
                INDEX: 0,
                STATE: 1,
            },
            class: 'turtle_sensor',
            isNotFor: ['roboid'],
            func(sprite, script) {
                const index = script.getNumberValue('INDEX');
                const robot = Entry.Roboid.getTurtle(index);
                return robot ? robot.checkButtonState(script) : false;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Roboid.turtle_is_button(%1, %2)',
                        blockType: 'param',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.turtle_clicked, 'clicked'],
                                    [Lang.Blocks.turtle_double_clicked, 'doubleClicked'],
                                    [Lang.Blocks.turtle_long_pressed, 'longPressed'],
                                ],
                                value: 'clicked',
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
        roboid_turtle_boolean: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.turtle_tilt_forward, 'TILT_FORWARD'],
                        [Lang.Blocks.turtle_tilt_backward, 'TILT_BACKWARD'],
                        [Lang.Blocks.turtle_tilt_left, 'TILT_LEFT'],
                        [Lang.Blocks.turtle_tilt_right, 'TILT_RIGHT'],
                        [Lang.Blocks.turtle_tilt_flip, 'TILT_FLIP'],
                        [Lang.Blocks.turtle_tilt_not, 'TILT_NOT'],
                        [Lang.Blocks.turtle_battery_normal, 'BATTERY_NORMAL'],
                        [Lang.Blocks.turtle_battery_low, 'BATTERY_LOW'],
                        [Lang.Blocks.turtle_battery_empty, 'BATTERY_EMPTY'],
                    ],
                    value: 'TILT_FORWARD',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'text',
                        params: ['0'],
                    },
                ],
                type: 'roboid_turtle_boolean',
            },
            paramsKeyMap: {
                INDEX: 0,
                DEVICE: 1,
            },
            class: 'turtle_sensor',
            isNotFor: ['roboid'],
            func(sprite, script) {
                const index = script.getNumberValue('INDEX');
                const robot = Entry.Roboid.getTurtle(index);
                return robot ? robot.checkBoolean(script) : false;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Roboid.turtle_boolean_value(%1, %2)',
                        blockType: 'param',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.turtle_tilt_forward, 'TILT_FORWARD'],
                                    [Lang.Blocks.turtle_tilt_backward, 'TILT_BACKWARD'],
                                    [Lang.Blocks.turtle_tilt_left, 'TILT_LEFT'],
                                    [Lang.Blocks.turtle_tilt_right, 'TILT_RIGHT'],
                                    [Lang.Blocks.turtle_tilt_flip, 'TILT_FLIP'],
                                    [Lang.Blocks.turtle_tilt_not, 'TILT_NOT'],
                                    [Lang.Blocks.turtle_battery_normal, 'BATTERY_NORMAL'],
                                    [Lang.Blocks.turtle_battery_low, 'BATTERY_LOW'],
                                    [Lang.Blocks.turtle_battery_empty, 'BATTERY_EMPTY'],
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
        roboid_turtle_value: {
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
                        [Lang.Blocks.turtle_color_number, 'colorNumber'],
                        [Lang.Blocks.turtle_color_pattern, 'colorPattern'],
                        [Lang.Blocks.turtle_floor, 'floor'],
                        [Lang.Blocks.turtle_button, 'button'],
                        [Lang.Blocks.turtle_acceleration_x, 'accelerationX'],
                        [Lang.Blocks.turtle_acceleration_y, 'accelerationY'],
                        [Lang.Blocks.turtle_acceleration_z, 'accelerationZ'],
                    ],
                    value: 'colorNumber',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'text',
                        params: ['0'],
                    },
                    null,
                ],
                type: 'roboid_turtle_value',
            },
            paramsKeyMap: {
                INDEX: 0,
                DEVICE: 1,
            },
            class: 'turtle_sensor',
            isNotFor: ['roboid'],
            func(sprite, script) {
                const index = script.getNumberValue('INDEX');
                const robot = Entry.Roboid.getTurtle(index);
                if (robot) {
                    return robot.getValue(script);
                }
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Roboid.turtle_sensor_value(%1, %2)',
                        blockType: 'param',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.turtle_color_number, 'colorNumber'],
                                    [Lang.Blocks.turtle_color_pattern, 'colorPattern'],
                                    [Lang.Blocks.turtle_floor, 'floor'],
                                    [Lang.Blocks.turtle_button, 'button'],
                                    [Lang.Blocks.turtle_acceleration_x, 'accelerationX'],
                                    [Lang.Blocks.turtle_acceleration_y, 'accelerationY'],
                                    [Lang.Blocks.turtle_acceleration_z, 'accelerationZ'],
                                ],
                                value: 'colorNumber',
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
        roboid_turtle_move_forward_unit: {
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
                        [Lang.Blocks.turtle_unit_cm, 'CM'],
                        [Lang.Blocks.turtle_unit_sec, 'SEC'],
                        [Lang.Blocks.turtle_unit_pulse, 'PULSE'],
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
                        params: ['0'],
                    },
                    {
                        type: 'text',
                        params: ['6'],
                    },
                    null,
                    null,
                ],
                type: 'roboid_turtle_move_forward_unit',
            },
            paramsKeyMap: {
                INDEX: 0,
                VALUE: 1,
                UNIT: 2,
            },
            class: 'turtle_wheel',
            isNotFor: ['roboid'],
            func(sprite, script) {
                const index = script.getNumberValue('INDEX');
                const robot = Entry.Roboid.getTurtle(index);
                return robot ? robot.moveForwardUnit(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Roboid.turtle_move_forward(%1, %2, %3)',
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
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.turtle_unit_cm, 'CM'],
                                    [Lang.Blocks.turtle_unit_sec, 'SEC'],
                                    [Lang.Blocks.turtle_unit_pulse, 'PULSE'],
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
        roboid_turtle_move_backward_unit: {
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
                        [Lang.Blocks.turtle_unit_cm, 'CM'],
                        [Lang.Blocks.turtle_unit_sec, 'SEC'],
                        [Lang.Blocks.turtle_unit_pulse, 'PULSE'],
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
                        params: ['0'],
                    },
                    {
                        type: 'text',
                        params: ['6'],
                    },
                    null,
                    null,
                ],
                type: 'roboid_turtle_move_backward_unit',
            },
            paramsKeyMap: {
                INDEX: 0,
                VALUE: 1,
                UNIT: 2,
            },
            class: 'turtle_wheel',
            isNotFor: ['roboid'],
            func(sprite, script) {
                const index = script.getNumberValue('INDEX');
                const robot = Entry.Roboid.getTurtle(index);
                return robot ? robot.moveBackwardUnit(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Roboid.turtle_move_backward(%1, %2, %3)',
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
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.turtle_unit_cm, 'CM'],
                                    [Lang.Blocks.turtle_unit_sec, 'SEC'],
                                    [Lang.Blocks.turtle_unit_pulse, 'PULSE'],
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
        roboid_turtle_turn_unit_in_place: {
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
                        [Lang.Blocks.turtle_left, 'LEFT'],
                        [Lang.Blocks.turtle_right, 'RIGHT'],
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
                        [Lang.Blocks.turtle_unit_deg, 'DEG'],
                        [Lang.Blocks.turtle_unit_sec, 'SEC'],
                        [Lang.Blocks.turtle_unit_pulse, 'PULSE'],
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
                    {
                        type: 'text',
                        params: ['0'],
                    },
                    null,
                    {
                        type: 'text',
                        params: ['90'],
                    },
                    null,
                    null,
                ],
                type: 'roboid_turtle_turn_unit_in_place',
            },
            paramsKeyMap: {
                INDEX: 0,
                DIRECTION: 1,
                VALUE: 2,
                UNIT: 3,
            },
            class: 'turtle_wheel',
            isNotFor: ['roboid'],
            func(sprite, script) {
                const index = script.getNumberValue('INDEX');
                const robot = Entry.Roboid.getTurtle(index);
                return robot ? robot.turnUnit(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Roboid.turtle_turn(%1, %2, %3, %4)',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.turtle_left, 'LEFT'],
                                    [Lang.Blocks.turtle_right, 'RIGHT'],
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
                                    [Lang.Blocks.turtle_unit_deg, 'DEG'],
                                    [Lang.Blocks.turtle_unit_sec, 'SEC'],
                                    [Lang.Blocks.turtle_unit_pulse, 'PULSE'],
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
        roboid_turtle_turn_unit_with_radius_in_direction: {
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
                        [Lang.Blocks.turtle_left, 'LEFT'],
                        [Lang.Blocks.turtle_right, 'RIGHT'],
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
                        [Lang.Blocks.turtle_unit_deg, 'DEG'],
                        [Lang.Blocks.turtle_unit_sec, 'SEC'],
                        [Lang.Blocks.turtle_unit_pulse, 'PULSE'],
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
                    options: [[Lang.Blocks.turtle_head, 'HEAD'], [Lang.Blocks.turtle_tail, 'TAIL']],
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
                params: [
                    {
                        type: 'text',
                        params: ['0'],
                    },
                    null,
                    {
                        type: 'text',
                        params: ['90'],
                    },
                    null,
                    {
                        type: 'text',
                        params: ['6'],
                    },
                    null,
                    null,
                ],
                type: 'roboid_turtle_turn_unit_with_radius_in_direction',
            },
            paramsKeyMap: {
                INDEX: 0,
                DIRECTION: 1,
                VALUE: 2,
                UNIT: 3,
                RADIUS: 4,
                TOWARD: 5,
            },
            class: 'turtle_wheel',
            isNotFor: ['roboid'],
            func(sprite, script) {
                const index = script.getNumberValue('INDEX');
                const robot = Entry.Roboid.getTurtle(index);
                return robot ? robot.swingUnit(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Roboid.turtle_circle(%1, %2, %3, %4, %5, %6)',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.turtle_left, 'LEFT'],
                                    [Lang.Blocks.turtle_right, 'RIGHT'],
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
                                    [Lang.Blocks.turtle_unit_deg, 'DEG'],
                                    [Lang.Blocks.turtle_unit_sec, 'SEC'],
                                    [Lang.Blocks.turtle_unit_pulse, 'PULSE'],
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
                                    [Lang.Blocks.turtle_head, 'HEAD'],
                                    [Lang.Blocks.turtle_tail, 'TAIL'],
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
        roboid_turtle_pivot_around_wheel_unit_in_direction: {
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
                        [Lang.Blocks.turtle_left, 'LEFT'],
                        [Lang.Blocks.turtle_right, 'RIGHT'],
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
                        [Lang.Blocks.turtle_unit_deg, 'DEG'],
                        [Lang.Blocks.turtle_unit_sec, 'SEC'],
                        [Lang.Blocks.turtle_unit_pulse, 'PULSE'],
                    ],
                    value: 'DEG',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [[Lang.Blocks.turtle_head, 'HEAD'], [Lang.Blocks.turtle_tail, 'TAIL']],
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
                params: [
                    {
                        type: 'text',
                        params: ['0'],
                    },
                    null,
                    {
                        type: 'text',
                        params: ['90'],
                    },
                    null,
                    null,
                    null,
                ],
                type: 'roboid_turtle_pivot_around_wheel_unit_in_direction',
            },
            paramsKeyMap: {
                INDEX: 0,
                WHEEL: 1,
                VALUE: 2,
                UNIT: 3,
                TOWARD: 4,
            },
            class: 'turtle_wheel',
            isNotFor: ['roboid'],
            func(sprite, script) {
                const index = script.getNumberValue('INDEX');
                const robot = Entry.Roboid.getTurtle(index);
                return robot ? robot.pivotUnit(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Roboid.turtle_pivot(%1, %2, %3, %4, %5)',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.turtle_left, 'LEFT'],
                                    [Lang.Blocks.turtle_right, 'RIGHT'],
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
                                    [Lang.Blocks.turtle_unit_deg, 'DEG'],
                                    [Lang.Blocks.turtle_unit_sec, 'SEC'],
                                    [Lang.Blocks.turtle_unit_pulse, 'PULSE'],
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
                                    [Lang.Blocks.turtle_head, 'HEAD'],
                                    [Lang.Blocks.turtle_tail, 'TAIL'],
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
        roboid_turtle_change_wheels_by_left_right: {
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
                        params: ['0'],
                    },
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
                type: 'roboid_turtle_change_wheels_by_left_right',
            },
            paramsKeyMap: {
                INDEX: 0,
                LEFT: 1,
                RIGHT: 2,
            },
            class: 'turtle_wheel',
            isNotFor: ['roboid'],
            func(sprite, script) {
                const index = script.getNumberValue('INDEX');
                const robot = Entry.Roboid.getTurtle(index);
                return robot ? robot.changeWheels(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Roboid.turtle_add_wheels(%1, %2, %3)',
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
        roboid_turtle_set_wheels_to_left_right: {
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
                        params: ['0'],
                    },
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
                type: 'roboid_turtle_set_wheels_to_left_right',
            },
            paramsKeyMap: {
                INDEX: 0,
                LEFT: 1,
                RIGHT: 2,
            },
            class: 'turtle_wheel',
            isNotFor: ['roboid'],
            func(sprite, script) {
                const index = script.getNumberValue('INDEX');
                const robot = Entry.Roboid.getTurtle(index);
                return robot ? robot.setWheels(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Roboid.turtle_set_wheels(%1, %2, %3)',
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
        roboid_turtle_change_wheel_by: {
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
                        [Lang.Blocks.turtle_left, 'LEFT'],
                        [Lang.Blocks.turtle_right, 'RIGHT'],
                        [Lang.Blocks.turtle_both, 'BOTH'],
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
                    {
                        type: 'text',
                        params: ['0'],
                    },
                    null,
                    {
                        type: 'text',
                        params: ['10'],
                    },
                    null,
                ],
                type: 'roboid_turtle_change_wheel_by',
            },
            paramsKeyMap: {
                INDEX: 0,
                WHEEL: 1,
                VELOCITY: 2,
            },
            class: 'turtle_wheel',
            isNotFor: ['roboid'],
            func(sprite, script) {
                const index = script.getNumberValue('INDEX');
                const robot = Entry.Roboid.getTurtle(index);
                return robot ? robot.changeWheel(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Roboid.turtle_add_wheel(%1, %2, %3)',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.turtle_left, 'LEFT'],
                                    [Lang.Blocks.turtle_right, 'RIGHT'],
                                    [Lang.Blocks.turtle_both, 'BOTH'],
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
        roboid_turtle_set_wheel_to: {
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
                        [Lang.Blocks.turtle_left, 'LEFT'],
                        [Lang.Blocks.turtle_right, 'RIGHT'],
                        [Lang.Blocks.turtle_both, 'BOTH'],
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
                    {
                        type: 'text',
                        params: ['0'],
                    },
                    null,
                    {
                        type: 'text',
                        params: ['50'],
                    },
                    null,
                ],
                type: 'roboid_turtle_set_wheel_to',
            },
            paramsKeyMap: {
                INDEX: 0,
                WHEEL: 1,
                VELOCITY: 2,
            },
            class: 'turtle_wheel',
            isNotFor: ['roboid'],
            func(sprite, script) {
                const index = script.getNumberValue('INDEX');
                const robot = Entry.Roboid.getTurtle(index);
                return robot ? robot.setWheel(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Roboid.turtle_set_wheel(%1, %2, %3)',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.turtle_left, 'LEFT'],
                                    [Lang.Blocks.turtle_right, 'RIGHT'],
                                    [Lang.Blocks.turtle_both, 'BOTH'],
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
        roboid_turtle_follow_line: {
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
                        [Lang.Blocks.turtle_color_black, '10'],
                        [Lang.Blocks.turtle_color_red, '11'],
                        [Lang.Blocks.turtle_color_green, '13'],
                        [Lang.Blocks.turtle_color_blue, '15'],
                        [Lang.Blocks.turtle_color_any, '17'],
                    ],
                    value: '10',
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
                        params: ['0'],
                    },
                    null,
                    null,
                ],
                type: 'roboid_turtle_follow_line',
            },
            paramsKeyMap: {
                INDEX: 0,
                COLOR: 1,
            },
            class: 'turtle_wheel',
            isNotFor: ['roboid'],
            func(sprite, script) {
                const index = script.getNumberValue('INDEX');
                const robot = Entry.Roboid.getTurtle(index);
                return robot ? robot.followLine(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Roboid.turtle_follow_black_line(%1)',
                        textParams: [
                            { type: 'Block', accept: 'string' },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.turtle_color_black, '10'],
                                    [Lang.Blocks.turtle_color_red, '11'],
                                    [Lang.Blocks.turtle_color_green, '13'],
                                    [Lang.Blocks.turtle_color_blue, '15'],
                                    [Lang.Blocks.turtle_color_any, '17'],
                                ],
                                value: '10',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                        ],
                        params: [null, '10'],
                    },
                    {
                        syntax: 'Roboid.turtle_follow_red_line(%1)',
                        textParams: [
                            { type: 'Block', accept: 'string' },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.turtle_color_black, '10'],
                                    [Lang.Blocks.turtle_color_red, '11'],
                                    [Lang.Blocks.turtle_color_green, '13'],
                                    [Lang.Blocks.turtle_color_blue, '15'],
                                    [Lang.Blocks.turtle_color_any, '17'],
                                ],
                                value: '10',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                        ],
                        params: [null, '11'],
                    },
                    {
                        syntax: 'Roboid.turtle_follow_green_line(%1)',
                        textParams: [
                            { type: 'Block', accept: 'string' },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.turtle_color_black, '10'],
                                    [Lang.Blocks.turtle_color_red, '11'],
                                    [Lang.Blocks.turtle_color_green, '13'],
                                    [Lang.Blocks.turtle_color_blue, '15'],
                                    [Lang.Blocks.turtle_color_any, '17'],
                                ],
                                value: '10',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                        ],
                        params: [null, '13'],
                    },
                    {
                        syntax: 'Roboid.turtle_follow_blue_line(%1)',
                        textParams: [
                            { type: 'Block', accept: 'string' },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.turtle_color_black, '10'],
                                    [Lang.Blocks.turtle_color_red, '11'],
                                    [Lang.Blocks.turtle_color_green, '13'],
                                    [Lang.Blocks.turtle_color_blue, '15'],
                                    [Lang.Blocks.turtle_color_any, '17'],
                                ],
                                value: '10',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                        ],
                        params: [null, '15'],
                    },
                    {
                        syntax: 'Roboid.turtle_follow_any_line(%1)',
                        textParams: [
                            { type: 'Block', accept: 'string' },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.turtle_color_black, '10'],
                                    [Lang.Blocks.turtle_color_red, '11'],
                                    [Lang.Blocks.turtle_color_green, '13'],
                                    [Lang.Blocks.turtle_color_blue, '15'],
                                    [Lang.Blocks.turtle_color_any, '17'],
                                ],
                                value: '10',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                        ],
                        params: [null, '17'],
                    },
                ],
            },
        },
        roboid_turtle_follow_line_until: {
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
                        [Lang.Blocks.turtle_color_red, '61'],
                        [Lang.Blocks.turtle_color_yellow, '62'],
                        [Lang.Blocks.turtle_color_green, '63'],
                        [Lang.Blocks.turtle_color_sky_blue, '64'],
                        [Lang.Blocks.turtle_color_blue, '65'],
                        [Lang.Blocks.turtle_color_purple, '66'],
                        [Lang.Blocks.turtle_color_any, '67'],
                    ],
                    value: '61',
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
                        params: ['0'],
                    },
                    null,
                    null,
                ],
                type: 'roboid_turtle_follow_line_until',
            },
            paramsKeyMap: {
                INDEX: 0,
                COLOR: 1,
            },
            class: 'turtle_wheel',
            isNotFor: ['roboid'],
            func(sprite, script) {
                const index = script.getNumberValue('INDEX');
                const robot = Entry.Roboid.getTurtle(index);
                return robot ? robot.followLineUntil(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Roboid.turtle_follow_black_line_until_red(%1)',
                        textParams: [
                            { type: 'Block', accept: 'string' },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.turtle_color_red, '61'],
                                    [Lang.Blocks.turtle_color_yellow, '62'],
                                    [Lang.Blocks.turtle_color_green, '63'],
                                    [Lang.Blocks.turtle_color_sky_blue, '64'],
                                    [Lang.Blocks.turtle_color_blue, '65'],
                                    [Lang.Blocks.turtle_color_purple, '66'],
                                    [Lang.Blocks.turtle_color_any, '67'],
                                ],
                                value: '61',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                        ],
                        params: [null, '61'],
                    },
                    {
                        syntax: 'Roboid.turtle_follow_black_line_until_yellow(%1)',
                        textParams: [
                            { type: 'Block', accept: 'string' },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.turtle_color_red, '61'],
                                    [Lang.Blocks.turtle_color_yellow, '62'],
                                    [Lang.Blocks.turtle_color_green, '63'],
                                    [Lang.Blocks.turtle_color_sky_blue, '64'],
                                    [Lang.Blocks.turtle_color_blue, '65'],
                                    [Lang.Blocks.turtle_color_purple, '66'],
                                    [Lang.Blocks.turtle_color_any, '67'],
                                ],
                                value: '61',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                        ],
                        params: [null, '62'],
                    },
                    {
                        syntax: 'Roboid.turtle_follow_black_line_until_green(%1)',
                        textParams: [
                            { type: 'Block', accept: 'string' },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.turtle_color_red, '61'],
                                    [Lang.Blocks.turtle_color_yellow, '62'],
                                    [Lang.Blocks.turtle_color_green, '63'],
                                    [Lang.Blocks.turtle_color_sky_blue, '64'],
                                    [Lang.Blocks.turtle_color_blue, '65'],
                                    [Lang.Blocks.turtle_color_purple, '66'],
                                    [Lang.Blocks.turtle_color_any, '67'],
                                ],
                                value: '61',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                        ],
                        params: [null, '63'],
                    },
                    {
                        syntax: 'Roboid.turtle_follow_black_line_until_sky_blue(%1)',
                        textParams: [
                            { type: 'Block', accept: 'string' },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.turtle_color_red, '61'],
                                    [Lang.Blocks.turtle_color_yellow, '62'],
                                    [Lang.Blocks.turtle_color_green, '63'],
                                    [Lang.Blocks.turtle_color_sky_blue, '64'],
                                    [Lang.Blocks.turtle_color_blue, '65'],
                                    [Lang.Blocks.turtle_color_purple, '66'],
                                    [Lang.Blocks.turtle_color_any, '67'],
                                ],
                                value: '61',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                        ],
                        params: [null, '64'],
                    },
                    {
                        syntax: 'Roboid.turtle_follow_black_line_until_blue(%1)',
                        textParams: [
                            { type: 'Block', accept: 'string' },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.turtle_color_red, '61'],
                                    [Lang.Blocks.turtle_color_yellow, '62'],
                                    [Lang.Blocks.turtle_color_green, '63'],
                                    [Lang.Blocks.turtle_color_sky_blue, '64'],
                                    [Lang.Blocks.turtle_color_blue, '65'],
                                    [Lang.Blocks.turtle_color_purple, '66'],
                                    [Lang.Blocks.turtle_color_any, '67'],
                                ],
                                value: '61',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                        ],
                        params: [null, '65'],
                    },
                    {
                        syntax: 'Roboid.turtle_follow_black_line_until_purple(%1)',
                        textParams: [
                            { type: 'Block', accept: 'string' },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.turtle_color_red, '61'],
                                    [Lang.Blocks.turtle_color_yellow, '62'],
                                    [Lang.Blocks.turtle_color_green, '63'],
                                    [Lang.Blocks.turtle_color_sky_blue, '64'],
                                    [Lang.Blocks.turtle_color_blue, '65'],
                                    [Lang.Blocks.turtle_color_purple, '66'],
                                    [Lang.Blocks.turtle_color_any, '67'],
                                ],
                                value: '61',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                        ],
                        params: [null, '66'],
                    },
                    {
                        syntax: 'Roboid.turtle_follow_black_line_until_any(%1)',
                        textParams: [
                            { type: 'Block', accept: 'string' },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.turtle_color_red, '61'],
                                    [Lang.Blocks.turtle_color_yellow, '62'],
                                    [Lang.Blocks.turtle_color_green, '63'],
                                    [Lang.Blocks.turtle_color_sky_blue, '64'],
                                    [Lang.Blocks.turtle_color_blue, '65'],
                                    [Lang.Blocks.turtle_color_purple, '66'],
                                    [Lang.Blocks.turtle_color_any, '67'],
                                ],
                                value: '61',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                        ],
                        params: [null, '67'],
                    },
                ],
            },
        },
        roboid_turtle_follow_line_until_black: {
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
                        [Lang.Blocks.turtle_color_red, '71'],
                        [Lang.Blocks.turtle_color_green, '73'],
                        [Lang.Blocks.turtle_color_blue, '75'],
                        [Lang.Blocks.turtle_color_any, '77'],
                    ],
                    value: '71',
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
                        params: ['0'],
                    },
                    null,
                    null,
                ],
                type: 'roboid_turtle_follow_line_until_black',
            },
            paramsKeyMap: {
                INDEX: 0,
                COLOR: 1,
            },
            class: 'turtle_wheel',
            isNotFor: ['roboid'],
            func(sprite, script) {
                const index = script.getNumberValue('INDEX');
                const robot = Entry.Roboid.getTurtle(index);
                return robot ? robot.followLineUntilBlack(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Roboid.turtle_follow_red_line_until_black(%1)',
                        textParams: [
                            { type: 'Block', accept: 'string' },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.turtle_color_red, '71'],
                                    [Lang.Blocks.turtle_color_green, '73'],
                                    [Lang.Blocks.turtle_color_blue, '75'],
                                    [Lang.Blocks.turtle_color_any, '77'],
                                ],
                                value: '71',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                        ],
                        params: [null, '71'],
                    },
                    {
                        syntax: 'Roboid.turtle_follow_green_line_until_black(%1)',
                        textParams: [
                            { type: 'Block', accept: 'string' },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.turtle_color_red, '71'],
                                    [Lang.Blocks.turtle_color_green, '73'],
                                    [Lang.Blocks.turtle_color_blue, '75'],
                                    [Lang.Blocks.turtle_color_any, '77'],
                                ],
                                value: '71',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                        ],
                        params: [null, '73'],
                    },
                    {
                        syntax: 'Roboid.turtle_follow_blue_line_until_black(%1)',
                        textParams: [
                            { type: 'Block', accept: 'string' },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.turtle_color_red, '71'],
                                    [Lang.Blocks.turtle_color_green, '73'],
                                    [Lang.Blocks.turtle_color_blue, '75'],
                                    [Lang.Blocks.turtle_color_any, '77'],
                                ],
                                value: '71',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                        ],
                        params: [null, '75'],
                    },
                    {
                        syntax: 'Roboid.turtle_follow_any_line_until_black(%1)',
                        textParams: [
                            { type: 'Block', accept: 'string' },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.turtle_color_red, '71'],
                                    [Lang.Blocks.turtle_color_green, '73'],
                                    [Lang.Blocks.turtle_color_blue, '75'],
                                    [Lang.Blocks.turtle_color_any, '77'],
                                ],
                                value: '71',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                        ],
                        params: [null, '77'],
                    },
                ],
            },
        },
        roboid_turtle_cross_intersection: {
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
                        params: ['0'],
                    },
                    null,
                ],
                type: 'roboid_turtle_cross_intersection',
            },
            paramsKeyMap: {
                INDEX: 0,
            },
            class: 'turtle_wheel',
            isNotFor: ['roboid'],
            func(sprite, script) {
                const index = script.getNumberValue('INDEX');
                const robot = Entry.Roboid.getTurtle(index);
                return robot ? robot.crossIntersection(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Roboid.turtle_cross_forward(%1)',
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
        roboid_turtle_turn_at_intersection: {
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
                        [Lang.Blocks.turtle_left, '20'],
                        [Lang.Blocks.turtle_right, '30'],
                        [Lang.Blocks.turtle_back, '50'],
                    ],
                    value: '20',
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
                        params: ['0'],
                    },
                    null,
                    null,
                ],
                type: 'roboid_turtle_turn_at_intersection',
            },
            paramsKeyMap: {
                INDEX: 0,
                DIRECTION: 1,
            },
            class: 'turtle_wheel',
            isNotFor: ['roboid'],
            func(sprite, script) {
                const index = script.getNumberValue('INDEX');
                const robot = Entry.Roboid.getTurtle(index);
                return robot ? robot.turnAtIntersection(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Roboid.turtle_cross_left(%1)',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.turtle_left, '20'],
                                    [Lang.Blocks.turtle_right, '30'],
                                    [Lang.Blocks.turtle_back, '50'],
                                ],
                                value: '20',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                        ],
                        params: [null, '20'],
                    },
                    {
                        syntax: 'Roboid.turtle_cross_right(%1)',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.turtle_left, '20'],
                                    [Lang.Blocks.turtle_right, '30'],
                                    [Lang.Blocks.turtle_back, '50'],
                                ],
                                value: '20',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                        ],
                        params: [null, '30'],
                    },
                    {
                        syntax: 'Roboid.turtle_cross_uturn(%1)',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.turtle_left, '20'],
                                    [Lang.Blocks.turtle_right, '30'],
                                    [Lang.Blocks.turtle_back, '50'],
                                ],
                                value: '20',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                        ],
                        params: [null, '50'],
                    },
                ],
            },
        },
        roboid_turtle_set_following_speed_to: {
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
                params: [
                    {
                        type: 'text',
                        params: ['0'],
                    },
                    '5',
                    null,
                ],
                type: 'roboid_turtle_set_following_speed_to',
            },
            paramsKeyMap: {
                INDEX: 0,
                SPEED: 1,
            },
            class: 'turtle_wheel',
            isNotFor: ['roboid'],
            func(sprite, script) {
                const index = script.getNumberValue('INDEX');
                const robot = Entry.Roboid.getTurtle(index);
                return robot ? robot.setLineTracerSpeed(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Roboid.turtle_set_line_speed(%1, %2)',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
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
        roboid_turtle_stop: {
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
                        params: ['0'],
                    },
                    null,
                ],
                type: 'roboid_turtle_stop',
            },
            paramsKeyMap: {
                INDEX: 0,
            },
            class: 'turtle_wheel',
            isNotFor: ['roboid'],
            func(sprite, script) {
                const index = script.getNumberValue('INDEX');
                const robot = Entry.Roboid.getTurtle(index);
                return robot ? robot.stop(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Roboid.turtle_stop(%1)',
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
        roboid_turtle_set_head_led_to: {
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
                        [Lang.Blocks.turtle_color_red, 'RED'],
                        [Lang.Blocks.turtle_color_orange, 'ORANGE'],
                        [Lang.Blocks.turtle_color_yellow, 'YELLOW'],
                        [Lang.Blocks.turtle_color_green, 'GREEN'],
                        [Lang.Blocks.turtle_color_sky_blue, 'CYAN'],
                        [Lang.Blocks.turtle_color_blue, 'BLUE'],
                        [Lang.Blocks.turtle_color_violet, 'VIOLET'],
                        [Lang.Blocks.turtle_color_purple, 'MAGENTA'],
                        [Lang.Blocks.turtle_color_white, 'WHITE'],
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
                params: [
                    {
                        type: 'text',
                        params: ['0'],
                    },
                    null,
                    null,
                ],
                type: 'roboid_turtle_set_head_led_to',
            },
            paramsKeyMap: {
                INDEX: 0,
                COLOR: 1,
            },
            class: 'turtle_led',
            isNotFor: ['roboid'],
            func(sprite, script) {
                const index = script.getNumberValue('INDEX');
                const robot = Entry.Roboid.getTurtle(index);
                return robot ? robot.setHeadColor(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Roboid.turtle_set_led(%1, %2)',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.turtle_color_red, 'RED'],
                                    [Lang.Blocks.turtle_color_orange, 'ORANGE'],
                                    [Lang.Blocks.turtle_color_yellow, 'YELLOW'],
                                    [Lang.Blocks.turtle_color_green, 'GREEN'],
                                    [Lang.Blocks.turtle_color_sky_blue, 'CYAN'],
                                    [Lang.Blocks.turtle_color_blue, 'BLUE'],
                                    [Lang.Blocks.turtle_color_violet, 'VIOLET'],
                                    [Lang.Blocks.turtle_color_purple, 'MAGENTA'],
                                    [Lang.Blocks.turtle_color_white, 'WHITE'],
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
        roboid_turtle_pick_head_led: {
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
                params: [
                    {
                        type: 'text',
                        params: ['0'],
                    },
                    null,
                    null,
                ],
                type: 'roboid_turtle_pick_head_led',
            },
            paramsKeyMap: {
                INDEX: 0,
                COLOR: 1,
            },
            class: 'turtle_led',
            isNotFor: ['roboid'],
            func(sprite, script) {
                const index = script.getNumberValue('INDEX');
                const robot = Entry.Roboid.getTurtle(index);
                return robot ? robot.pickHeadColor(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Roboid.turtle_pick_led(%1, %2)',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
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
        roboid_turtle_change_head_led_by_rgb: {
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
                        params: ['0'],
                    },
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
                type: 'roboid_turtle_change_head_led_by_rgb',
            },
            paramsKeyMap: {
                INDEX: 0,
                RED: 1,
                GREEN: 2,
                BLUE: 3,
            },
            class: 'turtle_led',
            isNotFor: ['roboid'],
            func(sprite, script) {
                const index = script.getNumberValue('INDEX');
                const robot = Entry.Roboid.getTurtle(index);
                return robot ? robot.changeHeadRgb(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Roboid.turtle_add_rgb(%1, %2, %3, %4)',
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
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                        ],
                    },
                ],
            },
        },
        roboid_turtle_set_head_led_to_rgb: {
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
                        params: ['0'],
                    },
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
                type: 'roboid_turtle_set_head_led_to_rgb',
            },
            paramsKeyMap: {
                INDEX: 0,
                RED: 1,
                GREEN: 2,
                BLUE: 3,
            },
            class: 'turtle_led',
            isNotFor: ['roboid'],
            func(sprite, script) {
                const index = script.getNumberValue('INDEX');
                const robot = Entry.Roboid.getTurtle(index);
                return robot ? robot.setHeadRgb(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Roboid.turtle_set_rgb(%1, %2, %3, %4)',
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
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                        ],
                    },
                ],
            },
        },
        roboid_turtle_clear_head_led: {
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
                        params: ['0'],
                    },
                    null,
                ],
                type: 'roboid_turtle_clear_head_led',
            },
            paramsKeyMap: {
                INDEX: 0,
            },
            class: 'turtle_led',
            isNotFor: ['roboid'],
            func(sprite, script) {
                const index = script.getNumberValue('INDEX');
                const robot = Entry.Roboid.getTurtle(index);
                return robot ? robot.clearHead(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Roboid.turtle_clear_led(%1)',
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
        roboid_turtle_play_sound_times: {
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
                        [Lang.Blocks.turtle_sound_beep, '1'],
                        [Lang.Blocks.turtle_sound_random_beep, '2'],
                        [Lang.Blocks.turtle_sound_siren, '3'],
                        [Lang.Blocks.turtle_sound_engine, '4'],
                        [Lang.Blocks.turtle_sound_robot, '5'],
                        [Lang.Blocks.turtle_sound_march, '6'],
                        [Lang.Blocks.turtle_sound_birthday, '7'],
                        [Lang.Blocks.turtle_sound_dibidibidip, '8'],
                        [Lang.Blocks.turtle_sound_good_job, '9'],
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
                    {
                        type: 'text',
                        params: ['0'],
                    },
                    null,
                    {
                        type: 'text',
                        params: ['1'],
                    },
                    null,
                ],
                type: 'roboid_turtle_play_sound_times',
            },
            paramsKeyMap: {
                INDEX: 0,
                SOUND: 1,
                COUNT: 2,
            },
            class: 'turtle_sound',
            isNotFor: ['roboid'],
            func(sprite, script) {
                const index = script.getNumberValue('INDEX');
                const robot = Entry.Roboid.getTurtle(index);
                return robot ? robot.playSound(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Roboid.turtle_play_sound_beep(%1, %3)',
                        textParams: [
                            { type: 'Block', accept: 'string' },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.turtle_sound_beep, '1'],
                                    [Lang.Blocks.turtle_sound_random_beep, '2'],
                                    [Lang.Blocks.turtle_sound_siren, '3'],
                                    [Lang.Blocks.turtle_sound_engine, '4'],
                                    [Lang.Blocks.turtle_sound_robot, '5'],
                                    [Lang.Blocks.turtle_sound_march, '6'],
                                    [Lang.Blocks.turtle_sound_birthday, '7'],
                                    [Lang.Blocks.turtle_sound_dibidibidip, '8'],
                                    [Lang.Blocks.turtle_sound_good_job, '9'],
                                ],
                                value: '1',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                            { type: 'Block', accept: 'string' },
                        ],
                        params: [null, '1'],
                    },
                    {
                        syntax: 'Roboid.turtle_play_sound_random_beep(%1, %3)',
                        textParams: [
                            { type: 'Block', accept: 'string' },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.turtle_sound_beep, '1'],
                                    [Lang.Blocks.turtle_sound_random_beep, '2'],
                                    [Lang.Blocks.turtle_sound_siren, '3'],
                                    [Lang.Blocks.turtle_sound_engine, '4'],
                                    [Lang.Blocks.turtle_sound_robot, '5'],
                                    [Lang.Blocks.turtle_sound_march, '6'],
                                    [Lang.Blocks.turtle_sound_birthday, '7'],
                                    [Lang.Blocks.turtle_sound_dibidibidip, '8'],
                                    [Lang.Blocks.turtle_sound_good_job, '9'],
                                ],
                                value: '1',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                            { type: 'Block', accept: 'string' },
                        ],
                        params: [null, '2'],
                    },
                    {
                        syntax: 'Roboid.turtle_play_sound_siren(%1, %3)',
                        textParams: [
                            { type: 'Block', accept: 'string' },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.turtle_sound_beep, '1'],
                                    [Lang.Blocks.turtle_sound_random_beep, '2'],
                                    [Lang.Blocks.turtle_sound_siren, '3'],
                                    [Lang.Blocks.turtle_sound_engine, '4'],
                                    [Lang.Blocks.turtle_sound_robot, '5'],
                                    [Lang.Blocks.turtle_sound_march, '6'],
                                    [Lang.Blocks.turtle_sound_birthday, '7'],
                                    [Lang.Blocks.turtle_sound_dibidibidip, '8'],
                                    [Lang.Blocks.turtle_sound_good_job, '9'],
                                ],
                                value: '1',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                            { type: 'Block', accept: 'string' },
                        ],
                        params: [null, '3'],
                    },
                    {
                        syntax: 'Roboid.turtle_play_sound_engine(%1, %3)',
                        textParams: [
                            { type: 'Block', accept: 'string' },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.turtle_sound_beep, '1'],
                                    [Lang.Blocks.turtle_sound_random_beep, '2'],
                                    [Lang.Blocks.turtle_sound_siren, '3'],
                                    [Lang.Blocks.turtle_sound_engine, '4'],
                                    [Lang.Blocks.turtle_sound_robot, '5'],
                                    [Lang.Blocks.turtle_sound_march, '6'],
                                    [Lang.Blocks.turtle_sound_birthday, '7'],
                                    [Lang.Blocks.turtle_sound_dibidibidip, '8'],
                                    [Lang.Blocks.turtle_sound_good_job, '9'],
                                ],
                                value: '1',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                            { type: 'Block', accept: 'string' },
                        ],
                        params: [null, '4'],
                    },
                    {
                        syntax: 'Roboid.turtle_play_sound_robot(%1, %3)',
                        textParams: [
                            { type: 'Block', accept: 'string' },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.turtle_sound_beep, '1'],
                                    [Lang.Blocks.turtle_sound_random_beep, '2'],
                                    [Lang.Blocks.turtle_sound_siren, '3'],
                                    [Lang.Blocks.turtle_sound_engine, '4'],
                                    [Lang.Blocks.turtle_sound_robot, '5'],
                                    [Lang.Blocks.turtle_sound_march, '6'],
                                    [Lang.Blocks.turtle_sound_birthday, '7'],
                                    [Lang.Blocks.turtle_sound_dibidibidip, '8'],
                                    [Lang.Blocks.turtle_sound_good_job, '9'],
                                ],
                                value: '1',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                            { type: 'Block', accept: 'string' },
                        ],
                        params: [null, '5'],
                    },
                    {
                        syntax: 'Roboid.turtle_play_sound_march(%1, %3)',
                        textParams: [
                            { type: 'Block', accept: 'string' },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.turtle_sound_beep, '1'],
                                    [Lang.Blocks.turtle_sound_random_beep, '2'],
                                    [Lang.Blocks.turtle_sound_siren, '3'],
                                    [Lang.Blocks.turtle_sound_engine, '4'],
                                    [Lang.Blocks.turtle_sound_robot, '5'],
                                    [Lang.Blocks.turtle_sound_march, '6'],
                                    [Lang.Blocks.turtle_sound_birthday, '7'],
                                    [Lang.Blocks.turtle_sound_dibidibidip, '8'],
                                    [Lang.Blocks.turtle_sound_good_job, '9'],
                                ],
                                value: '1',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                            { type: 'Block', accept: 'string' },
                        ],
                        params: [null, '6'],
                    },
                    {
                        syntax: 'Roboid.turtle_play_sound_birthday(%1, %3)',
                        textParams: [
                            { type: 'Block', accept: 'string' },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.turtle_sound_beep, '1'],
                                    [Lang.Blocks.turtle_sound_random_beep, '2'],
                                    [Lang.Blocks.turtle_sound_siren, '3'],
                                    [Lang.Blocks.turtle_sound_engine, '4'],
                                    [Lang.Blocks.turtle_sound_robot, '5'],
                                    [Lang.Blocks.turtle_sound_march, '6'],
                                    [Lang.Blocks.turtle_sound_birthday, '7'],
                                    [Lang.Blocks.turtle_sound_dibidibidip, '8'],
                                    [Lang.Blocks.turtle_sound_good_job, '9'],
                                ],
                                value: '1',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                            { type: 'Block', accept: 'string' },
                        ],
                        params: [null, '7'],
                    },
                    {
                        syntax: 'Roboid.turtle_play_sound_dibidibidip(%1, %3)',
                        textParams: [
                            { type: 'Block', accept: 'string' },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.turtle_sound_beep, '1'],
                                    [Lang.Blocks.turtle_sound_random_beep, '2'],
                                    [Lang.Blocks.turtle_sound_siren, '3'],
                                    [Lang.Blocks.turtle_sound_engine, '4'],
                                    [Lang.Blocks.turtle_sound_robot, '5'],
                                    [Lang.Blocks.turtle_sound_march, '6'],
                                    [Lang.Blocks.turtle_sound_birthday, '7'],
                                    [Lang.Blocks.turtle_sound_dibidibidip, '8'],
                                    [Lang.Blocks.turtle_sound_good_job, '9'],
                                ],
                                value: '1',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                            { type: 'Block', accept: 'string' },
                        ],
                        params: [null, '8'],
                    },
                    {
                        syntax: 'Roboid.turtle_play_sound_good_job(%1, %3)',
                        textParams: [
                            { type: 'Block', accept: 'string' },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.turtle_sound_beep, '1'],
                                    [Lang.Blocks.turtle_sound_random_beep, '2'],
                                    [Lang.Blocks.turtle_sound_siren, '3'],
                                    [Lang.Blocks.turtle_sound_engine, '4'],
                                    [Lang.Blocks.turtle_sound_robot, '5'],
                                    [Lang.Blocks.turtle_sound_march, '6'],
                                    [Lang.Blocks.turtle_sound_birthday, '7'],
                                    [Lang.Blocks.turtle_sound_dibidibidip, '8'],
                                    [Lang.Blocks.turtle_sound_good_job, '9'],
                                ],
                                value: '1',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                            { type: 'Block', accept: 'string' },
                        ],
                        params: [null, '9'],
                    },
                ],
            },
        },
        roboid_turtle_play_sound_times_until_done: {
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
                        [Lang.Blocks.turtle_sound_beep, '1'],
                        [Lang.Blocks.turtle_sound_random_beep, '2'],
                        [Lang.Blocks.turtle_sound_siren, '3'],
                        [Lang.Blocks.turtle_sound_engine, '4'],
                        [Lang.Blocks.turtle_sound_robot, '5'],
                        [Lang.Blocks.turtle_sound_march, '6'],
                        [Lang.Blocks.turtle_sound_birthday, '7'],
                        [Lang.Blocks.turtle_sound_dibidibidip, '8'],
                        [Lang.Blocks.turtle_sound_good_job, '9'],
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
                    {
                        type: 'text',
                        params: ['0'],
                    },
                    null,
                    {
                        type: 'text',
                        params: ['1'],
                    },
                    null,
                ],
                type: 'roboid_turtle_play_sound_times_until_done',
            },
            paramsKeyMap: {
                INDEX: 0,
                SOUND: 1,
                COUNT: 2,
            },
            class: 'turtle_sound',
            isNotFor: ['roboid'],
            func(sprite, script) {
                const index = script.getNumberValue('INDEX');
                const robot = Entry.Roboid.getTurtle(index);
                return robot ? robot.playSoundUntil(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Roboid.turtle_play_sound_until_done_beep(%1, %3)',
                        textParams: [
                            { type: 'Block', accept: 'string' },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.turtle_sound_beep, '1'],
                                    [Lang.Blocks.turtle_sound_random_beep, '2'],
                                    [Lang.Blocks.turtle_sound_siren, '3'],
                                    [Lang.Blocks.turtle_sound_engine, '4'],
                                    [Lang.Blocks.turtle_sound_robot, '5'],
                                    [Lang.Blocks.turtle_sound_march, '6'],
                                    [Lang.Blocks.turtle_sound_birthday, '7'],
                                    [Lang.Blocks.turtle_sound_dibidibidip, '8'],
                                    [Lang.Blocks.turtle_sound_good_job, '9'],
                                ],
                                value: '1',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                            { type: 'Block', accept: 'string' },
                        ],
                        params: [null, '1'],
                    },
                    {
                        syntax: 'Roboid.turtle_play_sound_until_done_random_beep(%1, %3)',
                        textParams: [
                            { type: 'Block', accept: 'string' },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.turtle_sound_beep, '1'],
                                    [Lang.Blocks.turtle_sound_random_beep, '2'],
                                    [Lang.Blocks.turtle_sound_siren, '3'],
                                    [Lang.Blocks.turtle_sound_engine, '4'],
                                    [Lang.Blocks.turtle_sound_robot, '5'],
                                    [Lang.Blocks.turtle_sound_march, '6'],
                                    [Lang.Blocks.turtle_sound_birthday, '7'],
                                    [Lang.Blocks.turtle_sound_dibidibidip, '8'],
                                    [Lang.Blocks.turtle_sound_good_job, '9'],
                                ],
                                value: '1',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                            { type: 'Block', accept: 'string' },
                        ],
                        params: [null, '2'],
                    },
                    {
                        syntax: 'Roboid.turtle_play_sound_until_done_siren(%1, %3)',
                        textParams: [
                            { type: 'Block', accept: 'string' },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.turtle_sound_beep, '1'],
                                    [Lang.Blocks.turtle_sound_random_beep, '2'],
                                    [Lang.Blocks.turtle_sound_siren, '3'],
                                    [Lang.Blocks.turtle_sound_engine, '4'],
                                    [Lang.Blocks.turtle_sound_robot, '5'],
                                    [Lang.Blocks.turtle_sound_march, '6'],
                                    [Lang.Blocks.turtle_sound_birthday, '7'],
                                    [Lang.Blocks.turtle_sound_dibidibidip, '8'],
                                    [Lang.Blocks.turtle_sound_good_job, '9'],
                                ],
                                value: '1',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                            { type: 'Block', accept: 'string' },
                        ],
                        params: [null, '3'],
                    },
                    {
                        syntax: 'Roboid.turtle_play_sound_until_done_engine(%1, %3)',
                        textParams: [
                            { type: 'Block', accept: 'string' },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.turtle_sound_beep, '1'],
                                    [Lang.Blocks.turtle_sound_random_beep, '2'],
                                    [Lang.Blocks.turtle_sound_siren, '3'],
                                    [Lang.Blocks.turtle_sound_engine, '4'],
                                    [Lang.Blocks.turtle_sound_robot, '5'],
                                    [Lang.Blocks.turtle_sound_march, '6'],
                                    [Lang.Blocks.turtle_sound_birthday, '7'],
                                    [Lang.Blocks.turtle_sound_dibidibidip, '8'],
                                    [Lang.Blocks.turtle_sound_good_job, '9'],
                                ],
                                value: '1',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                            { type: 'Block', accept: 'string' },
                        ],
                        params: [null, '4'],
                    },
                    {
                        syntax: 'Roboid.turtle_play_sound_until_done_robot(%1, %3)',
                        textParams: [
                            { type: 'Block', accept: 'string' },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.turtle_sound_beep, '1'],
                                    [Lang.Blocks.turtle_sound_random_beep, '2'],
                                    [Lang.Blocks.turtle_sound_siren, '3'],
                                    [Lang.Blocks.turtle_sound_engine, '4'],
                                    [Lang.Blocks.turtle_sound_robot, '5'],
                                    [Lang.Blocks.turtle_sound_march, '6'],
                                    [Lang.Blocks.turtle_sound_birthday, '7'],
                                    [Lang.Blocks.turtle_sound_dibidibidip, '8'],
                                    [Lang.Blocks.turtle_sound_good_job, '9'],
                                ],
                                value: '1',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                            { type: 'Block', accept: 'string' },
                        ],
                        params: [null, '5'],
                    },
                    {
                        syntax: 'Roboid.turtle_play_sound_until_done_march(%1, %3)',
                        textParams: [
                            { type: 'Block', accept: 'string' },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.turtle_sound_beep, '1'],
                                    [Lang.Blocks.turtle_sound_random_beep, '2'],
                                    [Lang.Blocks.turtle_sound_siren, '3'],
                                    [Lang.Blocks.turtle_sound_engine, '4'],
                                    [Lang.Blocks.turtle_sound_robot, '5'],
                                    [Lang.Blocks.turtle_sound_march, '6'],
                                    [Lang.Blocks.turtle_sound_birthday, '7'],
                                    [Lang.Blocks.turtle_sound_dibidibidip, '8'],
                                    [Lang.Blocks.turtle_sound_good_job, '9'],
                                ],
                                value: '1',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                            { type: 'Block', accept: 'string' },
                        ],
                        params: [null, '6'],
                    },
                    {
                        syntax: 'Roboid.turtle_play_sound_until_done_birthday(%1, %3)',
                        textParams: [
                            { type: 'Block', accept: 'string' },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.turtle_sound_beep, '1'],
                                    [Lang.Blocks.turtle_sound_random_beep, '2'],
                                    [Lang.Blocks.turtle_sound_siren, '3'],
                                    [Lang.Blocks.turtle_sound_engine, '4'],
                                    [Lang.Blocks.turtle_sound_robot, '5'],
                                    [Lang.Blocks.turtle_sound_march, '6'],
                                    [Lang.Blocks.turtle_sound_birthday, '7'],
                                    [Lang.Blocks.turtle_sound_dibidibidip, '8'],
                                    [Lang.Blocks.turtle_sound_good_job, '9'],
                                ],
                                value: '1',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                            { type: 'Block', accept: 'string' },
                        ],
                        params: [null, '7'],
                    },
                    {
                        syntax: 'Roboid.turtle_play_sound_until_done_dibidibidip(%1, %3)',
                        textParams: [
                            { type: 'Block', accept: 'string' },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.turtle_sound_beep, '1'],
                                    [Lang.Blocks.turtle_sound_random_beep, '2'],
                                    [Lang.Blocks.turtle_sound_siren, '3'],
                                    [Lang.Blocks.turtle_sound_engine, '4'],
                                    [Lang.Blocks.turtle_sound_robot, '5'],
                                    [Lang.Blocks.turtle_sound_march, '6'],
                                    [Lang.Blocks.turtle_sound_birthday, '7'],
                                    [Lang.Blocks.turtle_sound_dibidibidip, '8'],
                                    [Lang.Blocks.turtle_sound_good_job, '9'],
                                ],
                                value: '1',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                            { type: 'Block', accept: 'string' },
                        ],
                        params: [null, '8'],
                    },
                    {
                        syntax: 'Roboid.turtle_play_sound_until_done_good_job(%1, %3)',
                        textParams: [
                            { type: 'Block', accept: 'string' },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.turtle_sound_beep, '1'],
                                    [Lang.Blocks.turtle_sound_random_beep, '2'],
                                    [Lang.Blocks.turtle_sound_siren, '3'],
                                    [Lang.Blocks.turtle_sound_engine, '4'],
                                    [Lang.Blocks.turtle_sound_robot, '5'],
                                    [Lang.Blocks.turtle_sound_march, '6'],
                                    [Lang.Blocks.turtle_sound_birthday, '7'],
                                    [Lang.Blocks.turtle_sound_dibidibidip, '8'],
                                    [Lang.Blocks.turtle_sound_good_job, '9'],
                                ],
                                value: '1',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                            { type: 'Block', accept: 'string' },
                        ],
                        params: [null, '9'],
                    },
                ],
            },
        },
        roboid_turtle_change_buzzer_by: {
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
                        params: ['0'],
                    },
                    {
                        type: 'text',
                        params: ['10'],
                    },
                    null,
                ],
                type: 'roboid_turtle_change_buzzer_by',
            },
            paramsKeyMap: {
                INDEX: 0,
                HZ: 1,
            },
            class: 'turtle_sound',
            isNotFor: ['roboid'],
            func(sprite, script) {
                const index = script.getNumberValue('INDEX');
                const robot = Entry.Roboid.getTurtle(index);
                return robot ? robot.changeBuzzer(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Roboid.turtle_add_buzzer(%1, %2)',
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
        roboid_turtle_set_buzzer_to: {
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
                        params: ['0'],
                    },
                    {
                        type: 'text',
                        params: ['1000'],
                    },
                    null,
                ],
                type: 'roboid_turtle_set_buzzer_to',
            },
            paramsKeyMap: {
                INDEX: 0,
                HZ: 1,
            },
            class: 'turtle_sound',
            isNotFor: ['roboid'],
            func(sprite, script) {
                const index = script.getNumberValue('INDEX');
                const robot = Entry.Roboid.getTurtle(index);
                return robot ? robot.setBuzzer(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Roboid.turtle_set_buzzer(%1, %2)',
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
        roboid_turtle_clear_sound: {
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
                        params: ['0'],
                    },
                    null,
                ],
                type: 'roboid_turtle_clear_sound',
            },
            paramsKeyMap: {
                INDEX: 0,
            },
            class: 'turtle_sound',
            isNotFor: ['roboid'],
            func(sprite, script) {
                const index = script.getNumberValue('INDEX');
                const robot = Entry.Roboid.getTurtle(index);
                return robot ? robot.clearSound(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Roboid.turtle_clear_sound(%1)',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                        ],
                        params: [null],
                    },
                ],
            },
        },
        roboid_turtle_play_note: {
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
                        [Lang.Blocks.turtle_note_c, '4'],
                        [Lang.Blocks.turtle_note_c_sharp, '5'],
                        [Lang.Blocks.turtle_note_d, '6'],
                        [Lang.Blocks.turtle_note_d_sharp, '7'],
                        [Lang.Blocks.turtle_note_e, '8'],
                        [Lang.Blocks.turtle_note_f, '9'],
                        [Lang.Blocks.turtle_note_f_sharp, '10'],
                        [Lang.Blocks.turtle_note_g, '11'],
                        [Lang.Blocks.turtle_note_g_sharp, '12'],
                        [Lang.Blocks.turtle_note_a, '13'],
                        [Lang.Blocks.turtle_note_a_sharp, '14'],
                        [Lang.Blocks.turtle_note_b, '15'],
                    ],
                    value: '4',
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
                params: [
                    {
                        type: 'text',
                        params: ['0'],
                    },
                    null,
                    '4',
                    null,
                ],
                type: 'roboid_turtle_play_note',
            },
            paramsKeyMap: {
                INDEX: 0,
                NOTE: 1,
                OCTAVE: 2,
            },
            class: 'turtle_sound',
            isNotFor: ['roboid'],
            func(sprite, script) {
                const index = script.getNumberValue('INDEX');
                const robot = Entry.Roboid.getTurtle(index);
                return robot ? robot.playNote(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Roboid.turtle_play_pitch_c(%1, %3)',
                        textParams: [
                            { type: 'Block', accept: 'string' },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.turtle_note_c, '4'],
                                    [Lang.Blocks.turtle_note_c_sharp, '5'],
                                    [Lang.Blocks.turtle_note_d, '6'],
                                    [Lang.Blocks.turtle_note_d_sharp, '7'],
                                    [Lang.Blocks.turtle_note_e, '8'],
                                    [Lang.Blocks.turtle_note_f, '9'],
                                    [Lang.Blocks.turtle_note_f_sharp, '10'],
                                    [Lang.Blocks.turtle_note_g, '11'],
                                    [Lang.Blocks.turtle_note_g_sharp, '12'],
                                    [Lang.Blocks.turtle_note_a, '13'],
                                    [Lang.Blocks.turtle_note_a_sharp, '14'],
                                    [Lang.Blocks.turtle_note_b, '15'],
                                ],
                                value: '4',
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
                        params: [null, '4'],
                    },
                    {
                        syntax: 'Roboid.turtle_play_pitch_c_sharp(%1, %3)',
                        textParams: [
                            { type: 'Block', accept: 'string' },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.turtle_note_c, '4'],
                                    [Lang.Blocks.turtle_note_c_sharp, '5'],
                                    [Lang.Blocks.turtle_note_d, '6'],
                                    [Lang.Blocks.turtle_note_d_sharp, '7'],
                                    [Lang.Blocks.turtle_note_e, '8'],
                                    [Lang.Blocks.turtle_note_f, '9'],
                                    [Lang.Blocks.turtle_note_f_sharp, '10'],
                                    [Lang.Blocks.turtle_note_g, '11'],
                                    [Lang.Blocks.turtle_note_g_sharp, '12'],
                                    [Lang.Blocks.turtle_note_a, '13'],
                                    [Lang.Blocks.turtle_note_a_sharp, '14'],
                                    [Lang.Blocks.turtle_note_b, '15'],
                                ],
                                value: '4',
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
                        params: [null, '5'],
                    },
                    {
                        syntax: 'Roboid.turtle_play_pitch_d(%1, %3)',
                        textParams: [
                            { type: 'Block', accept: 'string' },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.turtle_note_c, '4'],
                                    [Lang.Blocks.turtle_note_c_sharp, '5'],
                                    [Lang.Blocks.turtle_note_d, '6'],
                                    [Lang.Blocks.turtle_note_d_sharp, '7'],
                                    [Lang.Blocks.turtle_note_e, '8'],
                                    [Lang.Blocks.turtle_note_f, '9'],
                                    [Lang.Blocks.turtle_note_f_sharp, '10'],
                                    [Lang.Blocks.turtle_note_g, '11'],
                                    [Lang.Blocks.turtle_note_g_sharp, '12'],
                                    [Lang.Blocks.turtle_note_a, '13'],
                                    [Lang.Blocks.turtle_note_a_sharp, '14'],
                                    [Lang.Blocks.turtle_note_b, '15'],
                                ],
                                value: '4',
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
                        params: [null, '6'],
                    },
                    {
                        syntax: 'Roboid.turtle_play_pitch_d_sharp(%1, %3)',
                        textParams: [
                            { type: 'Block', accept: 'string' },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.turtle_note_c, '4'],
                                    [Lang.Blocks.turtle_note_c_sharp, '5'],
                                    [Lang.Blocks.turtle_note_d, '6'],
                                    [Lang.Blocks.turtle_note_d_sharp, '7'],
                                    [Lang.Blocks.turtle_note_e, '8'],
                                    [Lang.Blocks.turtle_note_f, '9'],
                                    [Lang.Blocks.turtle_note_f_sharp, '10'],
                                    [Lang.Blocks.turtle_note_g, '11'],
                                    [Lang.Blocks.turtle_note_g_sharp, '12'],
                                    [Lang.Blocks.turtle_note_a, '13'],
                                    [Lang.Blocks.turtle_note_a_sharp, '14'],
                                    [Lang.Blocks.turtle_note_b, '15'],
                                ],
                                value: '4',
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
                        params: [null, '7'],
                    },
                    {
                        syntax: 'Roboid.turtle_play_pitch_e(%1, %3)',
                        textParams: [
                            { type: 'Block', accept: 'string' },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.turtle_note_c, '4'],
                                    [Lang.Blocks.turtle_note_c_sharp, '5'],
                                    [Lang.Blocks.turtle_note_d, '6'],
                                    [Lang.Blocks.turtle_note_d_sharp, '7'],
                                    [Lang.Blocks.turtle_note_e, '8'],
                                    [Lang.Blocks.turtle_note_f, '9'],
                                    [Lang.Blocks.turtle_note_f_sharp, '10'],
                                    [Lang.Blocks.turtle_note_g, '11'],
                                    [Lang.Blocks.turtle_note_g_sharp, '12'],
                                    [Lang.Blocks.turtle_note_a, '13'],
                                    [Lang.Blocks.turtle_note_a_sharp, '14'],
                                    [Lang.Blocks.turtle_note_b, '15'],
                                ],
                                value: '4',
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
                        params: [null, '8'],
                    },
                    {
                        syntax: 'Roboid.turtle_play_pitch_f(%1, %3)',
                        textParams: [
                            { type: 'Block', accept: 'string' },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.turtle_note_c, '4'],
                                    [Lang.Blocks.turtle_note_c_sharp, '5'],
                                    [Lang.Blocks.turtle_note_d, '6'],
                                    [Lang.Blocks.turtle_note_d_sharp, '7'],
                                    [Lang.Blocks.turtle_note_e, '8'],
                                    [Lang.Blocks.turtle_note_f, '9'],
                                    [Lang.Blocks.turtle_note_f_sharp, '10'],
                                    [Lang.Blocks.turtle_note_g, '11'],
                                    [Lang.Blocks.turtle_note_g_sharp, '12'],
                                    [Lang.Blocks.turtle_note_a, '13'],
                                    [Lang.Blocks.turtle_note_a_sharp, '14'],
                                    [Lang.Blocks.turtle_note_b, '15'],
                                ],
                                value: '4',
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
                        params: [null, '9'],
                    },
                    {
                        syntax: 'Roboid.turtle_play_pitch_f_sharp(%1, %3)',
                        textParams: [
                            { type: 'Block', accept: 'string' },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.turtle_note_c, '4'],
                                    [Lang.Blocks.turtle_note_c_sharp, '5'],
                                    [Lang.Blocks.turtle_note_d, '6'],
                                    [Lang.Blocks.turtle_note_d_sharp, '7'],
                                    [Lang.Blocks.turtle_note_e, '8'],
                                    [Lang.Blocks.turtle_note_f, '9'],
                                    [Lang.Blocks.turtle_note_f_sharp, '10'],
                                    [Lang.Blocks.turtle_note_g, '11'],
                                    [Lang.Blocks.turtle_note_g_sharp, '12'],
                                    [Lang.Blocks.turtle_note_a, '13'],
                                    [Lang.Blocks.turtle_note_a_sharp, '14'],
                                    [Lang.Blocks.turtle_note_b, '15'],
                                ],
                                value: '4',
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
                        params: [null, '10'],
                    },
                    {
                        syntax: 'Roboid.turtle_play_pitch_g(%1, %3)',
                        textParams: [
                            { type: 'Block', accept: 'string' },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.turtle_note_c, '4'],
                                    [Lang.Blocks.turtle_note_c_sharp, '5'],
                                    [Lang.Blocks.turtle_note_d, '6'],
                                    [Lang.Blocks.turtle_note_d_sharp, '7'],
                                    [Lang.Blocks.turtle_note_e, '8'],
                                    [Lang.Blocks.turtle_note_f, '9'],
                                    [Lang.Blocks.turtle_note_f_sharp, '10'],
                                    [Lang.Blocks.turtle_note_g, '11'],
                                    [Lang.Blocks.turtle_note_g_sharp, '12'],
                                    [Lang.Blocks.turtle_note_a, '13'],
                                    [Lang.Blocks.turtle_note_a_sharp, '14'],
                                    [Lang.Blocks.turtle_note_b, '15'],
                                ],
                                value: '4',
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
                        params: [null, '11'],
                    },
                    {
                        syntax: 'Roboid.turtle_play_pitch_g_sharp(%1, %3)',
                        textParams: [
                            { type: 'Block', accept: 'string' },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.turtle_note_c, '4'],
                                    [Lang.Blocks.turtle_note_c_sharp, '5'],
                                    [Lang.Blocks.turtle_note_d, '6'],
                                    [Lang.Blocks.turtle_note_d_sharp, '7'],
                                    [Lang.Blocks.turtle_note_e, '8'],
                                    [Lang.Blocks.turtle_note_f, '9'],
                                    [Lang.Blocks.turtle_note_f_sharp, '10'],
                                    [Lang.Blocks.turtle_note_g, '11'],
                                    [Lang.Blocks.turtle_note_g_sharp, '12'],
                                    [Lang.Blocks.turtle_note_a, '13'],
                                    [Lang.Blocks.turtle_note_a_sharp, '14'],
                                    [Lang.Blocks.turtle_note_b, '15'],
                                ],
                                value: '4',
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
                        params: [null, '12'],
                    },
                    {
                        syntax: 'Roboid.turtle_play_pitch_a(%1, %3)',
                        textParams: [
                            { type: 'Block', accept: 'string' },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.turtle_note_c, '4'],
                                    [Lang.Blocks.turtle_note_c_sharp, '5'],
                                    [Lang.Blocks.turtle_note_d, '6'],
                                    [Lang.Blocks.turtle_note_d_sharp, '7'],
                                    [Lang.Blocks.turtle_note_e, '8'],
                                    [Lang.Blocks.turtle_note_f, '9'],
                                    [Lang.Blocks.turtle_note_f_sharp, '10'],
                                    [Lang.Blocks.turtle_note_g, '11'],
                                    [Lang.Blocks.turtle_note_g_sharp, '12'],
                                    [Lang.Blocks.turtle_note_a, '13'],
                                    [Lang.Blocks.turtle_note_a_sharp, '14'],
                                    [Lang.Blocks.turtle_note_b, '15'],
                                ],
                                value: '4',
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
                        params: [null, '13'],
                    },
                    {
                        syntax: 'Roboid.turtle_play_pitch_a_sharp(%1, %3)',
                        textParams: [
                            { type: 'Block', accept: 'string' },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.turtle_note_c, '4'],
                                    [Lang.Blocks.turtle_note_c_sharp, '5'],
                                    [Lang.Blocks.turtle_note_d, '6'],
                                    [Lang.Blocks.turtle_note_d_sharp, '7'],
                                    [Lang.Blocks.turtle_note_e, '8'],
                                    [Lang.Blocks.turtle_note_f, '9'],
                                    [Lang.Blocks.turtle_note_f_sharp, '10'],
                                    [Lang.Blocks.turtle_note_g, '11'],
                                    [Lang.Blocks.turtle_note_g_sharp, '12'],
                                    [Lang.Blocks.turtle_note_a, '13'],
                                    [Lang.Blocks.turtle_note_a_sharp, '14'],
                                    [Lang.Blocks.turtle_note_b, '15'],
                                ],
                                value: '4',
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
                        params: [null, '14'],
                    },
                    {
                        syntax: 'Roboid.turtle_play_pitch_b(%1, %3)',
                        textParams: [
                            { type: 'Block', accept: 'string' },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.turtle_note_c, '4'],
                                    [Lang.Blocks.turtle_note_c_sharp, '5'],
                                    [Lang.Blocks.turtle_note_d, '6'],
                                    [Lang.Blocks.turtle_note_d_sharp, '7'],
                                    [Lang.Blocks.turtle_note_e, '8'],
                                    [Lang.Blocks.turtle_note_f, '9'],
                                    [Lang.Blocks.turtle_note_f_sharp, '10'],
                                    [Lang.Blocks.turtle_note_g, '11'],
                                    [Lang.Blocks.turtle_note_g_sharp, '12'],
                                    [Lang.Blocks.turtle_note_a, '13'],
                                    [Lang.Blocks.turtle_note_a_sharp, '14'],
                                    [Lang.Blocks.turtle_note_b, '15'],
                                ],
                                value: '4',
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
                        params: [null, '15'],
                    },
                ],
            },
        },
        roboid_turtle_play_note_for_beats: {
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
                        [Lang.Blocks.turtle_note_c, '4'],
                        [Lang.Blocks.turtle_note_c_sharp, '5'],
                        [Lang.Blocks.turtle_note_d, '6'],
                        [Lang.Blocks.turtle_note_d_sharp, '7'],
                        [Lang.Blocks.turtle_note_e, '8'],
                        [Lang.Blocks.turtle_note_f, '9'],
                        [Lang.Blocks.turtle_note_f_sharp, '10'],
                        [Lang.Blocks.turtle_note_g, '11'],
                        [Lang.Blocks.turtle_note_g_sharp, '12'],
                        [Lang.Blocks.turtle_note_a, '13'],
                        [Lang.Blocks.turtle_note_a_sharp, '14'],
                        [Lang.Blocks.turtle_note_b, '15'],
                    ],
                    value: '4',
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
                    {
                        type: 'text',
                        params: ['0'],
                    },
                    null,
                    '4',
                    {
                        type: 'text',
                        params: ['0.5'],
                    },
                    null,
                ],
                type: 'roboid_turtle_play_note_for_beats',
            },
            paramsKeyMap: {
                INDEX: 0,
                NOTE: 1,
                OCTAVE: 2,
                BEAT: 3,
            },
            class: 'turtle_sound',
            isNotFor: ['roboid'],
            func(sprite, script) {
                const index = script.getNumberValue('INDEX');
                const robot = Entry.Roboid.getTurtle(index);
                return robot ? robot.playNoteBeat(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Roboid.turtle_play_note_c(%1, %3, %4)',
                        textParams: [
                            { type: 'Block', accept: 'string' },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.turtle_note_c, '4'],
                                    [Lang.Blocks.turtle_note_c_sharp, '5'],
                                    [Lang.Blocks.turtle_note_d, '6'],
                                    [Lang.Blocks.turtle_note_d_sharp, '7'],
                                    [Lang.Blocks.turtle_note_e, '8'],
                                    [Lang.Blocks.turtle_note_f, '9'],
                                    [Lang.Blocks.turtle_note_f_sharp, '10'],
                                    [Lang.Blocks.turtle_note_g, '11'],
                                    [Lang.Blocks.turtle_note_g_sharp, '12'],
                                    [Lang.Blocks.turtle_note_a, '13'],
                                    [Lang.Blocks.turtle_note_a_sharp, '14'],
                                    [Lang.Blocks.turtle_note_b, '15'],
                                ],
                                value: '4',
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
                        params: [null, '4'],
                    },
                    {
                        syntax: 'Roboid.turtle_play_note_c_sharp(%1, %3, %4)',
                        textParams: [
                            { type: 'Block', accept: 'string' },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.turtle_note_c, '4'],
                                    [Lang.Blocks.turtle_note_c_sharp, '5'],
                                    [Lang.Blocks.turtle_note_d, '6'],
                                    [Lang.Blocks.turtle_note_d_sharp, '7'],
                                    [Lang.Blocks.turtle_note_e, '8'],
                                    [Lang.Blocks.turtle_note_f, '9'],
                                    [Lang.Blocks.turtle_note_f_sharp, '10'],
                                    [Lang.Blocks.turtle_note_g, '11'],
                                    [Lang.Blocks.turtle_note_g_sharp, '12'],
                                    [Lang.Blocks.turtle_note_a, '13'],
                                    [Lang.Blocks.turtle_note_a_sharp, '14'],
                                    [Lang.Blocks.turtle_note_b, '15'],
                                ],
                                value: '4',
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
                        params: [null, '5'],
                    },
                    {
                        syntax: 'Roboid.turtle_play_note_d(%1, %3, %4)',
                        textParams: [
                            { type: 'Block', accept: 'string' },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.turtle_note_c, '4'],
                                    [Lang.Blocks.turtle_note_c_sharp, '5'],
                                    [Lang.Blocks.turtle_note_d, '6'],
                                    [Lang.Blocks.turtle_note_d_sharp, '7'],
                                    [Lang.Blocks.turtle_note_e, '8'],
                                    [Lang.Blocks.turtle_note_f, '9'],
                                    [Lang.Blocks.turtle_note_f_sharp, '10'],
                                    [Lang.Blocks.turtle_note_g, '11'],
                                    [Lang.Blocks.turtle_note_g_sharp, '12'],
                                    [Lang.Blocks.turtle_note_a, '13'],
                                    [Lang.Blocks.turtle_note_a_sharp, '14'],
                                    [Lang.Blocks.turtle_note_b, '15'],
                                ],
                                value: '4',
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
                        params: [null, '6'],
                    },
                    {
                        syntax: 'Roboid.turtle_play_note_d_sharp(%1, %3, %4)',
                        textParams: [
                            { type: 'Block', accept: 'string' },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.turtle_note_c, '4'],
                                    [Lang.Blocks.turtle_note_c_sharp, '5'],
                                    [Lang.Blocks.turtle_note_d, '6'],
                                    [Lang.Blocks.turtle_note_d_sharp, '7'],
                                    [Lang.Blocks.turtle_note_e, '8'],
                                    [Lang.Blocks.turtle_note_f, '9'],
                                    [Lang.Blocks.turtle_note_f_sharp, '10'],
                                    [Lang.Blocks.turtle_note_g, '11'],
                                    [Lang.Blocks.turtle_note_g_sharp, '12'],
                                    [Lang.Blocks.turtle_note_a, '13'],
                                    [Lang.Blocks.turtle_note_a_sharp, '14'],
                                    [Lang.Blocks.turtle_note_b, '15'],
                                ],
                                value: '4',
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
                        params: [null, '7'],
                    },
                    {
                        syntax: 'Roboid.turtle_play_note_e(%1, %3, %4)',
                        textParams: [
                            { type: 'Block', accept: 'string' },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.turtle_note_c, '4'],
                                    [Lang.Blocks.turtle_note_c_sharp, '5'],
                                    [Lang.Blocks.turtle_note_d, '6'],
                                    [Lang.Blocks.turtle_note_d_sharp, '7'],
                                    [Lang.Blocks.turtle_note_e, '8'],
                                    [Lang.Blocks.turtle_note_f, '9'],
                                    [Lang.Blocks.turtle_note_f_sharp, '10'],
                                    [Lang.Blocks.turtle_note_g, '11'],
                                    [Lang.Blocks.turtle_note_g_sharp, '12'],
                                    [Lang.Blocks.turtle_note_a, '13'],
                                    [Lang.Blocks.turtle_note_a_sharp, '14'],
                                    [Lang.Blocks.turtle_note_b, '15'],
                                ],
                                value: '4',
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
                        params: [null, '8'],
                    },
                    {
                        syntax: 'Roboid.turtle_play_note_f(%1, %3, %4)',
                        textParams: [
                            { type: 'Block', accept: 'string' },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.turtle_note_c, '4'],
                                    [Lang.Blocks.turtle_note_c_sharp, '5'],
                                    [Lang.Blocks.turtle_note_d, '6'],
                                    [Lang.Blocks.turtle_note_d_sharp, '7'],
                                    [Lang.Blocks.turtle_note_e, '8'],
                                    [Lang.Blocks.turtle_note_f, '9'],
                                    [Lang.Blocks.turtle_note_f_sharp, '10'],
                                    [Lang.Blocks.turtle_note_g, '11'],
                                    [Lang.Blocks.turtle_note_g_sharp, '12'],
                                    [Lang.Blocks.turtle_note_a, '13'],
                                    [Lang.Blocks.turtle_note_a_sharp, '14'],
                                    [Lang.Blocks.turtle_note_b, '15'],
                                ],
                                value: '4',
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
                        params: [null, '9'],
                    },
                    {
                        syntax: 'Roboid.turtle_play_note_f_sharp(%1, %3, %4)',
                        textParams: [
                            { type: 'Block', accept: 'string' },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.turtle_note_c, '4'],
                                    [Lang.Blocks.turtle_note_c_sharp, '5'],
                                    [Lang.Blocks.turtle_note_d, '6'],
                                    [Lang.Blocks.turtle_note_d_sharp, '7'],
                                    [Lang.Blocks.turtle_note_e, '8'],
                                    [Lang.Blocks.turtle_note_f, '9'],
                                    [Lang.Blocks.turtle_note_f_sharp, '10'],
                                    [Lang.Blocks.turtle_note_g, '11'],
                                    [Lang.Blocks.turtle_note_g_sharp, '12'],
                                    [Lang.Blocks.turtle_note_a, '13'],
                                    [Lang.Blocks.turtle_note_a_sharp, '14'],
                                    [Lang.Blocks.turtle_note_b, '15'],
                                ],
                                value: '4',
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
                        params: [null, '10'],
                    },
                    {
                        syntax: 'Roboid.turtle_play_note_g(%1, %3, %4)',
                        textParams: [
                            { type: 'Block', accept: 'string' },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.turtle_note_c, '4'],
                                    [Lang.Blocks.turtle_note_c_sharp, '5'],
                                    [Lang.Blocks.turtle_note_d, '6'],
                                    [Lang.Blocks.turtle_note_d_sharp, '7'],
                                    [Lang.Blocks.turtle_note_e, '8'],
                                    [Lang.Blocks.turtle_note_f, '9'],
                                    [Lang.Blocks.turtle_note_f_sharp, '10'],
                                    [Lang.Blocks.turtle_note_g, '11'],
                                    [Lang.Blocks.turtle_note_g_sharp, '12'],
                                    [Lang.Blocks.turtle_note_a, '13'],
                                    [Lang.Blocks.turtle_note_a_sharp, '14'],
                                    [Lang.Blocks.turtle_note_b, '15'],
                                ],
                                value: '4',
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
                        params: [null, '11'],
                    },
                    {
                        syntax: 'Roboid.turtle_play_note_g_sharp(%1, %3, %4)',
                        textParams: [
                            { type: 'Block', accept: 'string' },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.turtle_note_c, '4'],
                                    [Lang.Blocks.turtle_note_c_sharp, '5'],
                                    [Lang.Blocks.turtle_note_d, '6'],
                                    [Lang.Blocks.turtle_note_d_sharp, '7'],
                                    [Lang.Blocks.turtle_note_e, '8'],
                                    [Lang.Blocks.turtle_note_f, '9'],
                                    [Lang.Blocks.turtle_note_f_sharp, '10'],
                                    [Lang.Blocks.turtle_note_g, '11'],
                                    [Lang.Blocks.turtle_note_g_sharp, '12'],
                                    [Lang.Blocks.turtle_note_a, '13'],
                                    [Lang.Blocks.turtle_note_a_sharp, '14'],
                                    [Lang.Blocks.turtle_note_b, '15'],
                                ],
                                value: '4',
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
                        params: [null, '12'],
                    },
                    {
                        syntax: 'Roboid.turtle_play_note_a(%1, %3, %4)',
                        textParams: [
                            { type: 'Block', accept: 'string' },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.turtle_note_c, '4'],
                                    [Lang.Blocks.turtle_note_c_sharp, '5'],
                                    [Lang.Blocks.turtle_note_d, '6'],
                                    [Lang.Blocks.turtle_note_d_sharp, '7'],
                                    [Lang.Blocks.turtle_note_e, '8'],
                                    [Lang.Blocks.turtle_note_f, '9'],
                                    [Lang.Blocks.turtle_note_f_sharp, '10'],
                                    [Lang.Blocks.turtle_note_g, '11'],
                                    [Lang.Blocks.turtle_note_g_sharp, '12'],
                                    [Lang.Blocks.turtle_note_a, '13'],
                                    [Lang.Blocks.turtle_note_a_sharp, '14'],
                                    [Lang.Blocks.turtle_note_b, '15'],
                                ],
                                value: '4',
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
                        params: [null, '13'],
                    },
                    {
                        syntax: 'Roboid.turtle_play_note_a_sharp(%1, %3, %4)',
                        textParams: [
                            { type: 'Block', accept: 'string' },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.turtle_note_c, '4'],
                                    [Lang.Blocks.turtle_note_c_sharp, '5'],
                                    [Lang.Blocks.turtle_note_d, '6'],
                                    [Lang.Blocks.turtle_note_d_sharp, '7'],
                                    [Lang.Blocks.turtle_note_e, '8'],
                                    [Lang.Blocks.turtle_note_f, '9'],
                                    [Lang.Blocks.turtle_note_f_sharp, '10'],
                                    [Lang.Blocks.turtle_note_g, '11'],
                                    [Lang.Blocks.turtle_note_g_sharp, '12'],
                                    [Lang.Blocks.turtle_note_a, '13'],
                                    [Lang.Blocks.turtle_note_a_sharp, '14'],
                                    [Lang.Blocks.turtle_note_b, '15'],
                                ],
                                value: '4',
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
                        params: [null, '14'],
                    },
                    {
                        syntax: 'Roboid.turtle_play_note_b(%1, %3, %4)',
                        textParams: [
                            { type: 'Block', accept: 'string' },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.turtle_note_c, '4'],
                                    [Lang.Blocks.turtle_note_c_sharp, '5'],
                                    [Lang.Blocks.turtle_note_d, '6'],
                                    [Lang.Blocks.turtle_note_d_sharp, '7'],
                                    [Lang.Blocks.turtle_note_e, '8'],
                                    [Lang.Blocks.turtle_note_f, '9'],
                                    [Lang.Blocks.turtle_note_f_sharp, '10'],
                                    [Lang.Blocks.turtle_note_g, '11'],
                                    [Lang.Blocks.turtle_note_g_sharp, '12'],
                                    [Lang.Blocks.turtle_note_a, '13'],
                                    [Lang.Blocks.turtle_note_a_sharp, '14'],
                                    [Lang.Blocks.turtle_note_b, '15'],
                                ],
                                value: '4',
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
                        params: [null, '15'],
                    },
                ],
            },
        },
        roboid_turtle_rest_for_beats: {
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
                        params: ['0'],
                    },
                    {
                        type: 'text',
                        params: ['0.25'],
                    },
                    null,
                ],
                type: 'roboid_turtle_rest_for_beats',
            },
            paramsKeyMap: {
                INDEX: 0,
                BEAT: 1,
            },
            class: 'turtle_sound',
            isNotFor: ['roboid'],
            func(sprite, script) {
                const index = script.getNumberValue('INDEX');
                const robot = Entry.Roboid.getTurtle(index);
                return robot ? robot.restBeat(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Roboid.turtle_rest(%1, %2)',
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
        roboid_turtle_change_tempo_by: {
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
                        params: ['0'],
                    },
                    {
                        type: 'text',
                        params: ['20'],
                    },
                    null,
                ],
                type: 'roboid_turtle_change_tempo_by',
            },
            paramsKeyMap: {
                INDEX: 0,
                BPM: 1,
            },
            class: 'turtle_sound',
            isNotFor: ['roboid'],
            func(sprite, script) {
                const index = script.getNumberValue('INDEX');
                const robot = Entry.Roboid.getTurtle(index);
                return robot ? robot.changeTempo(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Roboid.turtle_add_tempo(%1, %2)',
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
        roboid_turtle_set_tempo_to: {
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
                        params: ['0'],
                    },
                    {
                        type: 'text',
                        params: ['60'],
                    },
                    null,
                ],
                type: 'roboid_turtle_set_tempo_to',
            },
            paramsKeyMap: {
                INDEX: 0,
                BPM: 1,
            },
            class: 'turtle_sound',
            isNotFor: ['roboid'],
            func(sprite, script) {
                const index = script.getNumberValue('INDEX');
                const robot = Entry.Roboid.getTurtle(index);
                return robot ? robot.setTempo(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Roboid.turtle_set_tempo(%1, %2)',
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
    };
};

module.exports = Entry.Roboid;
