'use strict';

Entry.Turtle = {
    PORT_MAP: {
        module: 'turtle',
        leftWheel: 0,
        rightWheel: 0,
        ledRed: 0,
        ledGreen: 0,
        ledBlue: 0,
        buzzer: 0,
        pulse: 0,
        pulseId: 0,
        note: 0,
        sound: 0,
        soundRepeat: 1,
        soundId: 0,
        lineTracerMode: 0,
        lineTracerModeId: 0,
        lineTracerGain: 5,
        lineTracerSpeed: 5,
        motionId: 0,
        motionType: 0,
        motionUnit: 0,
        motionSpeed: 0,
        motionValue: 0,
        motionRadius: 0,
    },
    setZero() {
        const portMap = Entry.Turtle.PORT_MAP;
        const sq = Entry.hw.sendQueue;
        for (const port in portMap) {
            sq[port] = portMap[port];
        }
        Entry.hw.update();
        const turtle = Entry.Turtle;
        turtle.pulseId = 0;
        turtle.soundId = 0;
        turtle.lineTracerModeId = 0;
        turtle.motionId = 0;
        turtle.clickedId = -1;
        turtle.doubleClickedId = -1;
        turtle.longPressedId = -1;
        turtle.colorPatternId = -1;
        turtle.wheelStateId = -1;
        turtle.soundStateId = -1;
        turtle.lineTracerStateId = -1;
        turtle.tempo = 60;
        turtle.removeAllTimeouts();
    },
    pulseId: 0,
    soundId: 0,
    lineTracerModeId: 0,
    motionId: 0,
    clickedId: -1,
    doubleClickedId: -1,
    longPressedId: -1,
    colorPatternId: -1,
    wheelStateId: -1,
    soundStateId: -1,
    lineTracerStateId: -1,
    tempo: 60,
    timeouts: [],
    removeTimeout(id) {
        clearTimeout(id);
        const timeouts = this.timeouts;
        const index = timeouts.indexOf(id);
        if (index >= 0) {
            timeouts.splice(index, 1);
        }
    },
    removeAllTimeouts() {
        const timeouts = this.timeouts;
        for (const i in timeouts) {
            clearTimeout(timeouts[i]);
        }
        this.timeouts = [];
    },
    setModule(sq) {
        sq.module = 'turtle';
    },
    setPulse(sq, pulse) {
        this.pulseId = (this.pulseId % 255) + 1;
        sq.pulse = pulse;
        sq.pulseId = this.pulseId;
    },
    setSound(sq, sound, count) {
        if (typeof count != 'number') {
            count = 1;
        }
        if (count < 0) {
            count = -1;
        }
        if (count) {
            this.soundId = (this.soundId % 255) + 1;
            sq.sound = sound;
            sq.soundRepeat = count;
            sq.soundId = this.soundId;
        }
    },
    setLineTracerMode(sq, mode) {
        this.lineTracerModeId = (this.lineTracerModeId % 255) + 1;
        sq.lineTracerMode = mode;
        sq.lineTracerModeId = this.lineTracerModeId;
    },
    setMotion(sq, type, unit, speed, value, radius) {
        this.motionId = (this.motionId % 255) + 1;
        sq.motionType = type;
        sq.motionUnit = unit;
        sq.motionSpeed = speed;
        sq.motionValue = value;
        sq.motionRadius = radius;
        sq.motionId = this.motionId;
    },
    setLedColor(sq, color) {
        if (color == 'RED') {
            sq.ledRed = 255;
            sq.ledGreen = 0;
            sq.ledBlue = 0;
        } else if (color == 'ORANGE') {
            sq.ledRed = 255;
            sq.ledGreen = 63;
            sq.ledBlue = 0;
        } else if (color == 'YELLOW') {
            sq.ledRed = 255;
            sq.ledGreen = 255;
            sq.ledBlue = 0;
        } else if (color == 'GREEN') {
            sq.ledRed = 0;
            sq.ledGreen = 255;
            sq.ledBlue = 0;
        } else if (color == 'CYAN') {
            sq.ledRed = 0;
            sq.ledGreen = 255;
            sq.ledBlue = 255;
        } else if (color == 'BLUE') {
            sq.ledRed = 0;
            sq.ledGreen = 0;
            sq.ledBlue = 255;
        } else if (color == 'VIOLET') {
            sq.ledRed = 63;
            sq.ledGreen = 0;
            sq.ledBlue = 255;
        } else if (color == 'MAGENTA') {
            sq.ledRed = 255;
            sq.ledGreen = 0;
            sq.ledBlue = 255;
        } else if (color == 'WHITE') {
            sq.ledRed = 255;
            sq.ledGreen = 255;
            sq.ledBlue = 255;
        }
    },
    id: '2.9',
    name: 'turtle',
    url: 'http://turtle.school',
    imageName: 'turtle.png',
    title: {
        en: 'Turtle',
        ko: '거북이',
    },
    monitorTemplate: () => ({
        imgPath: 'hw/turtle.png',
        width: 480,
        height: 354,
        listPorts: {
            colorNumber: {
                name: Lang.Blocks.turtle_color_number,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            accelerationX: {
                name: Lang.Blocks.turtle_acceleration_x,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            accelerationY: {
                name: Lang.Blocks.turtle_acceleration_y,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            accelerationZ: {
                name: Lang.Blocks.turtle_acceleration_z,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            buzzer: {
                name: Lang.Blocks.turtle_buzzer,
                type: 'output',
                pos: { x: 0, y: 0 },
            },
            note: {
                name: Lang.Blocks.turtle_note,
                type: 'output',
                pos: { x: 0, y: 0 },
            },
        },
        ports: {
            floor: {
                name: Lang.Blocks.turtle_floor,
                type: 'input',
                pos: { x: 193, y: 342 },
            },
            button: {
                name: Lang.Blocks.turtle_button,
                type: 'input',
                pos: { x: 290, y: 30 },
            },
            ledRed: {
                name: `${Lang.Blocks.turtle_head_color} R`,
                type: 'output',
                pos: { x: 140, y: 280 },
            },
            ledGreen: {
                name: `${Lang.Blocks.turtle_head_color} G`,
                type: 'output',
                pos: { x: 140, y: 280 },
            },
            ledBlue: {
                name: `${Lang.Blocks.turtle_head_color} B`,
                type: 'output',
                pos: { x: 140, y: 280 },
            },
            leftWheel: {
                name: Lang.Blocks.turtle_left_wheel,
                type: 'output',
                pos: { x: 363, y: 319 },
            },
            rightWheel: {
                name: Lang.Blocks.turtle_right_wheel,
                type: 'output',
                pos: { x: 120, y: 86 },
            },
        },
        mode: 'both',
    }),
};

Entry.Turtle.setLanguage = () => ({
    ko: {
        template: {
            turtle_button_state: '버튼을 %1 ?',
            turtle_change_buzzer_by: '버저 음을 %1 만큼 바꾸기 %2',
            turtle_change_head_led_by_rgb: '머리 LED를 R: %1 G: %2 B: %3 만큼 바꾸기 %4',
            turtle_change_tempo_by: '연주 속도를 %1 만큼 바꾸기 %2',
            turtle_change_wheel_by: '%1 바퀴 %2 만큼 바꾸기 %3',
            turtle_change_wheels_by_left_right: '왼쪽 바퀴 %1 오른쪽 바퀴 %2 만큼 바꾸기 %3',
            turtle_clear_head_led: '머리 LED 끄기 %1',
            turtle_clear_sound: '소리 끄기 %1',
            turtle_cross_intersection: '검은색 교차로 건너가기 %1',
            turtle_follow_line: '%1 선을 따라가기 %2',
            turtle_follow_line_until: '검은색 선을 따라 %1 까지 이동하기 %2',
            turtle_follow_line_until_black: '%1 선을 따라 검은색까지 이동하기 %2',
            turtle_is_color_pattern: '색깔 패턴이 %1 %2 인가?',
            turtle_move_backward_unit: '뒤로 %1 %2 이동하기 %3',
            turtle_move_forward_unit: '앞으로 %1 %2 이동하기 %3',
            turtle_pivot_around_wheel_unit_in_direction:
                '%1 바퀴 중심으로 %2 %3 %4 방향으로 돌기 %5',
            turtle_play_note: '%1 %2 음을 연주하기 %3',
            turtle_play_note_for_beats: '%1 %2 음을 %3 박자 연주하기 %4',
            turtle_play_sound_times: '%1 소리 %2 번 재생하기 %3',
            turtle_play_sound_times_until_done: '%1 소리 %2 번 재생하고 기다리기 %3',
            turtle_rest_for_beats: '%1 박자 쉬기 %2',
            turtle_set_buzzer_to: '버저 음을 %1 (으)로 정하기 %2',
            turtle_set_following_speed_to: '선 따라가기 속도를 %1 (으)로 정하기 %2',
            turtle_set_head_led_to: '머리 LED를 %1 으로 정하기 %2',
            turtle_set_head_led_to_rgb: '머리 LED를 R: %1 G: %2 B: %3 (으)로 정하기 %4',
            turtle_set_tempo_to: '연주 속도를 %1 BPM으로 정하기 %2',
            turtle_set_wheel_to: '%1 바퀴 %2 (으)로 정하기 %3',
            turtle_set_wheels_to_left_right: '왼쪽 바퀴 %1 오른쪽 바퀴 %2 (으)로 정하기 %3',
            turtle_stop: '정지하기 %1',
            turtle_touching_color: '%1 에 닿았는가?',
            turtle_turn_at_intersection: '검은색 교차로에서 %1 으로 돌기 %2',
            turtle_turn_unit_in_place: '%1 으로 %2 %3 제자리 돌기 %4',
            turtle_turn_unit_with_radius_in_direction:
                '%1 으로 %2 %3 반지름 %4 cm를 %5 방향으로 돌기 %6',
            turtle_value: '%1',
        },
        Helper: {
            turtle_button_state:
                "등 버튼을 클릭했으면/더블클릭했으면/길게 눌렀으면 '참'으로 판단하고, 아니면 '거짓'으로 판단합니다.",
            turtle_change_buzzer_by:
                '버저 소리의 현재 음 높이(Hz)에 입력한 값을 더합니다. 소수점 둘째 자리까지 입력할 수 있습니다.',
            turtle_change_head_led_by_rgb:
                '머리 LED의 현재 R, G, B 값에 입력한 값을 각각 더합니다.',
            turtle_change_tempo_by:
                '연주하거나 쉬는 속도의 현재 BPM(분당 박자 수)에 입력한 값을 더합니다.',
            turtle_change_wheel_by:
                '왼쪽/오른쪽/양쪽 바퀴의 현재 속도 값(%)에 입력한 값을 더합니다. 더한 결과가 양수 값이면 바퀴가 앞으로 회전하고, 음수 값이면 뒤로 회전합니다.',
            turtle_change_wheels_by_left_right:
                '왼쪽과 오른쪽 바퀴의 현재 속도 값(%)에 입력한 값을 각각 더합니다. 더한 결과가 양수 값이면 바퀴가 앞으로 회전하고, 음수 값이면 뒤로 회전합니다.',
            turtle_clear_head_led: '머리 LED를 끕니다.',
            turtle_clear_sound: '소리를 끕니다.',
            turtle_cross_intersection:
                '검은색 교차로에서 잠시 앞으로 이동한 후 검은색 선을 찾아 다시 이동합니다.',
            turtle_follow_line: '하얀색 바탕 위에서 선택한 색깔의 선을 따라 이동합니다.',
            turtle_follow_line_until:
                '하얀색 바탕 위에서 검은색 선을 따라 이동하다가 선택한 색깔을 컬러 센서가 감지하면 정지합니다.',
            turtle_follow_line_until_black:
                '하얀색 바탕 위에서 선택한 색깔의 선을 따라 이동하다가 컬러 센서가 검은색을 감지하면 정지합니다.',
            turtle_is_color_pattern:
                "선택한 색깔 패턴을 컬러 센서가 감지하였으면 '참'으로 판단하고, 아니면 '거짓'으로 판단합니다.",
            turtle_move_backward_unit: '입력한 거리(cm)/시간(초)/펄스만큼 뒤로 이동합니다.',
            turtle_move_forward_unit: '입력한 거리(cm)/시간(초)/펄스만큼 앞으로 이동합니다.',
            turtle_pivot_around_wheel_unit_in_direction:
                '왼쪽/오른쪽 바퀴 중심으로 입력한 각도(도)/시간(초)/펄스만큼 머리/꼬리 방향으로 회전합니다.',
            turtle_play_note: '선택한 계이름과 옥타브의 음을 계속 소리 냅니다.',
            turtle_play_note_for_beats:
                '선택한 계이름과 옥타브의 음을 입력한 박자만큼 소리 냅니다.',
            turtle_play_sound_times: '선택한 소리를 입력한 횟수만큼 재생합니다.',
            turtle_play_sound_times_until_done:
                '선택한 소리를 입력한 횟수만큼 재생하고, 재생이 완료될 때까지 기다립니다.',
            turtle_rest_for_beats: '입력한 박자만큼 쉽니다.',
            turtle_set_buzzer_to:
                '버저 소리의 음 높이를 입력한 값(Hz)으로 설정합니다. 소수점 둘째 자리까지 입력할 수 있습니다. 숫자 0을 입력하면 소리를 끕니다.',
            turtle_set_following_speed_to:
                '선을 따라 이동하는 속도(1 ~ 8)를 설정합니다. 숫자가 클수록 이동하는 속도가 빠릅니다.',
            turtle_set_head_led_to: '머리 LED를 선택한 색깔로 켭니다.',
            turtle_set_head_led_to_rgb: '머리 LED의 R, G, B 값을 입력한 값으로 각각 설정합니다.',
            turtle_set_tempo_to: '연주하거나 쉬는 속도를 입력한 BPM(분당 박자 수)으로 설정합니다.',
            turtle_set_wheel_to:
                '왼쪽/오른쪽/양쪽 바퀴의 속도를 입력한 값(-400 ~ 400%)으로 설정합니다. 양수 값을 입력하면 바퀴가 앞으로 회전하고, 음수 값을 입력하면 뒤로 회전합니다. 숫자 0을 입력하면 정지합니다.',
            turtle_set_wheels_to_left_right:
                '왼쪽과 오른쪽 바퀴의 속도를 입력한 값(-400 ~ 400%)으로 각각 설정합니다. 양수 값을 입력하면 바퀴가 앞으로 회전하고, 음수 값을 입력하면 뒤로 회전합니다. 숫자 0을 입력하면 정지합니다.',
            turtle_stop: '양쪽 바퀴를 정지합니다.',
            turtle_touching_color:
                "선택한 색깔을 컬러 센서가 감지하였으면 '참'으로 판단하고, 아니면 '거짓'으로 판단합니다.",
            turtle_turn_at_intersection:
                '검은색 교차로에서 잠시 앞으로 이동한 후 제자리에서 왼쪽/오른쪽/뒤쪽으로 회전하고 검은색 선을 찾아 다시 이동합니다.',
            turtle_turn_unit_in_place:
                '입력한 각도(도)/시간(초)/펄스만큼 왼쪽/오른쪽 방향으로 제자리에서 회전합니다.',
            turtle_turn_unit_with_radius_in_direction:
                '입력한 반지름의 원을 그리면서 입력한 각도(도)/시간(초)/펄스만큼 왼쪽/오른쪽, 머리/꼬리 방향으로 회전합니다.',
            turtle_value:
                '색깔 번호: 컬러 센서가 감지한 색깔의 번호 (값의 범위: -1 ~ 8, 초기값: -1)<br/>색깔 패턴: 컬러 센서가 감지한 색깔 패턴의 값 (값의 범위: -1 ~ 88, 초기값: -1)<br/>바닥 센서: 바닥 센서의 값 (값의 범위: 0 ~ 100, 초기값: 0)<br/>버튼: 거북이 등 버튼의 상태 값 (누르면 1, 아니면 0, 초기값: 0)<br/>x축 가속도: 가속도 센서의 X축 값 (값의 범위: -32768 ~ 32767, 초기값: 0) 로봇이 전진하는 방향이 X축의 양수 방향입니다.<br/>y축 가속도: 가속도 센서의 Y축 값 (값의 범위: -32768 ~ 32767, 초기값: 0) 로봇의 왼쪽 방향이 Y축의 양수 방향입니다.<br/>z축 가속도: 가속도 센서의 Z축 값 (값의 범위: -32768 ~ 32767, 초기값: 0) 로봇의 위쪽 방향이 Z축의 양수 방향입니다.',
        },
        Blocks: {
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
            turtle_note_d: '레',
            turtle_note_e: '미',
            turtle_note_f: '파',
            turtle_note_g: '솔',
            turtle_note_a: '라',
            turtle_note_b: '시',
        },
    },
    en: {
        template: {
            turtle_button_state: 'button %1 ?',
            turtle_change_buzzer_by: 'change buzzer by %1 %2',
            turtle_change_head_led_by_rgb: 'change head led by r: %1 g: %2 b: %3 %4',
            turtle_change_tempo_by: 'change tempo by %1 %2',
            turtle_change_wheel_by: 'change %1 wheel by %2 %3',
            turtle_change_wheels_by_left_right: 'change wheels by left: %1 right: %2 %3',
            turtle_clear_head_led: 'clear head led %1',
            turtle_clear_sound: 'clear sound %1',
            turtle_cross_intersection: 'cross black intersection %1',
            turtle_follow_line: 'follow %1 line %2',
            turtle_follow_line_until: 'follow black line until %1 %2',
            turtle_follow_line_until_black: 'follow %1 line until black %2',
            turtle_is_color_pattern: 'color pattern %1 %2 ?',
            turtle_move_backward_unit: 'move backward %1 %2 %3',
            turtle_move_forward_unit: 'move forward %1 %2 %3',
            turtle_pivot_around_wheel_unit_in_direction:
                'pivot around %1 wheel %2 %3 in %4 direction %5',
            turtle_play_note: 'play note %1 %2 %3',
            turtle_play_note_for_beats: 'play note %1 %2 for %3 beats %4',
            turtle_play_sound_times: 'play sound %1 %2 times %3',
            turtle_play_sound_times_until_done: 'play sound %1 %2 times until done %3',
            turtle_rest_for_beats: 'rest for %1 beats %2',
            turtle_set_buzzer_to: 'set buzzer to %1 %2',
            turtle_set_following_speed_to: 'set following speed to %1 %2',
            turtle_set_head_led_to: 'set head led to %1 %2',
            turtle_set_head_led_to_rgb: 'set head led to r: %1 g: %2 b: %3 %4',
            turtle_set_tempo_to: 'set tempo to %1 bpm %2',
            turtle_set_wheel_to: 'set %1 wheel to %2 %3',
            turtle_set_wheels_to_left_right: 'set wheels to left: %1 right: %2 %3',
            turtle_stop: 'stop %1',
            turtle_touching_color: 'touching %1 ?',
            turtle_turn_at_intersection: 'turn %1 at black intersection %2',
            turtle_turn_unit_in_place: 'turn %1 %2 %3 in place %4',
            turtle_turn_unit_with_radius_in_direction:
                'turn %1 %2 %3 with radius %4 cm in %5 direction %6',
            turtle_value: '%1',
        },
        Helper: {
            turtle_button_state:
                'If the button clicked/double-clicked/long-pressed, true, otherwise false.',
            turtle_change_buzzer_by:
                'Adds the entered value to the current pitch (Hz) of the buzzer sound. You can enter up to two decimal places.',
            turtle_change_head_led_by_rgb:
                'Adds the entered values to the current R, G, B values of the head LED, respectively.',
            turtle_change_tempo_by:
                'Adds the entered value to the current BPM (beats per minute) of the playing or resting speed.',
            turtle_change_wheel_by:
                'Adds the entered value to the current speed value (%) of the left/right/both wheels. If the result is positive, the wheel rotates forward; if negative, the wheel rotates backward.',
            turtle_change_wheels_by_left_right:
                'Adds the entered values to the current speed values (%) of the left and right wheels respectively. If the result is positive, the wheel rotates forward; if negative, the wheel rotates backward.',
            turtle_clear_head_led: 'Turns off the head LED.',
            turtle_clear_sound: 'Turns off sound.',
            turtle_cross_intersection:
                'Moves forward for a moment at the black intersection, then finds the black line and moves again.',
            turtle_follow_line: 'Moves along the selected color line on a white background.',
            turtle_follow_line_until:
                'Moves along the black line on a white background and stops when the color sensor detects the selected color.',
            turtle_follow_line_until_black:
                'Moves along the selected color line on a white background and stops when the color sensor detects black.',
            turtle_is_color_pattern:
                'If the color sensor detects the selected color pattern, true, otherwise false.',
            turtle_move_backward_unit:
                'Moves backward for the number of cm/seconds/pulses entered.',
            turtle_move_forward_unit: 'Moves forward for the number of cm/seconds/pulses entered.',
            turtle_pivot_around_wheel_unit_in_direction:
                'Pivots around the left/right wheel in the head/tail direction for the number of degrees/seconds/pulses entered.',
            turtle_play_note: 'It sounds the selected tone and octave.',
            turtle_play_note_for_beats:
                'It sounds the selected tone and octave as much as the beat you entered.',
            turtle_play_sound_times: 'Plays the selected sound as many times as entered.',
            turtle_play_sound_times_until_done:
                'Plays the selected sound as many times as entered, and waits for completion.',
            turtle_rest_for_beats: 'Rests as much as the beat you entered.',
            turtle_set_buzzer_to:
                'Sets the pitch of the buzzer sound to the entered value (Hz). You can enter up to two decimal places. Entering the number 0 turns off the buzzer sound.',
            turtle_set_following_speed_to:
                'Sets the speed (1 to 8) to move along the line. The larger the number, the faster the movement.',
            turtle_set_head_led_to: 'Turns the head LED to the selected color.',
            turtle_set_head_led_to_rgb:
                'Sets the R, G, B values of the head LED to the entered values.',
            turtle_set_tempo_to:
                'Sets the playing or resting speed to the entered BPM (beats per minute).',
            turtle_set_wheel_to:
                'Sets the speed of the left/right/both wheels to the entered value (-400 to 400%). If you enter a positive value, the wheel rotates forward. If you enter a negative value, the wheel rotates backward. Entering the number 0 stops it.',
            turtle_set_wheels_to_left_right:
                'Sets the speed of the left and right wheels to the entered values (-400 to 400%), respectively. If you enter a positive value, the wheel rotates forward. If you enter a negative value, the wheel rotates backward. Entering the number 0 stops it.',
            turtle_stop: 'Stops both wheels.',
            turtle_touching_color:
                'If the color sensor detects the selected color, true, otherwise false.',
            turtle_turn_at_intersection:
                'Moves forward for a moment at the black intersection, then turns left/right/back in place, finds the black line and moves again.',
            turtle_turn_unit_in_place:
                'Turns left/right in place for the number of degrees/seconds/pulses entered.',
            turtle_turn_unit_with_radius_in_direction:
                'Turns left/right drawing the circle of the entered radius in the head/tail direction for the number of degrees/seconds/pulses entered.',
            turtle_value:
                'color number: color number detected by the color sensor (range: -1 to 8, initial value: -1)<br/>color pattern: value of the color pattern detected by the color sensor (range: -1 ~ 88, initial value: -1) <br/>floor: value of floor sensor (range: 0 to 100, initial value: 0)<br/>button: status of the button (when pressed 1, otherwise 0, initial value: 0)<br/>x acceleration: x-axis value of acceleration sensor (range: -32768 to 32767, initial value: 0) The direction in which the robot moves forward is the positive direction of the x axis.<br/>y acceleration: y-axis value of acceleration sensor (range: -32768 to 32767, initial value: 0) The left direction of the robot is the positive direction of the y axis.<br/>z acceleration: z-axis value of acceleration sensor (range: -32768 to 32767, initial value: 0) The upward direction of the robot is the positive direction of the z axis.',
        },
        Blocks: {
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
            turtle_note_d: 'D',
            turtle_note_e: 'E',
            turtle_note_f: 'F',
            turtle_note_g: 'G',
            turtle_note_a: 'A',
            turtle_note_b: 'B',
        },
    },
    jp: {
        template: {
            turtle_button_state: '背中を %1 した？',
            turtle_change_buzzer_by: 'ブザー音の高さを %1 だけ変えて鳴らす %2',
            turtle_change_head_led_by_rgb:
                '頭のLEDの色をR（赤：あか） %1  G（緑：みどり） %2  B（青：あお） %3 だけ変える %4',
            turtle_change_tempo_by: '演奏の速さを %1 だけ変える %2',
            turtle_change_wheel_by: '%1 の車輪（しゃりん）の速さを %2 だけ変える %3',
            turtle_change_wheels_by_left_right: '車輪（しゃりん）の速さを左 %1 右 %2 だけ変える %3',
            turtle_clear_head_led: '頭のLEDを消す %1',
            turtle_clear_sound: '音を消す %1',
            turtle_cross_intersection: '黒の線が交わる点を渡る %1',
            turtle_follow_line: '%1 の線にそって移動する %2',
            turtle_follow_line_until: '黒の線にそって %1 まで移動する %2',
            turtle_follow_line_until_black: '%1 の線にそって黒まで移動する %2',
            turtle_is_color_pattern: '色の順番 %1 %2 を感知した?',
            turtle_move_backward_unit: '後ろへ %1 %2 移動する %3',
            turtle_move_forward_unit: '前へ %1 %2 移動する %3',
            turtle_pivot_around_wheel_unit_in_direction: '%1 の車輪を中心に %2 %3 %4 方向に回る %5',
            turtle_play_note: '%1 %2 を演奏する %3',
            turtle_play_note_for_beats: '%1 %2 を %3 拍演奏する %4',
            turtle_play_sound_times: '音 %1 を %2 回鳴らす %3',
            turtle_play_sound_times_until_done: '音 %1 を %2 回鳴らして終わるまで待つ %3',
            turtle_rest_for_beats: '%1 拍休む %2',
            turtle_set_buzzer_to: 'ブザー音の高さを %1 にして鳴らす %2',
            turtle_set_following_speed_to: '線にそって移動する速さを %1 にする %2',
            turtle_set_head_led_to: '頭のLEDの色を %1 にする %2',
            turtle_set_head_led_to_rgb:
                '頭のLEDの色をR（赤：あか） %1  G（緑：みどり） %2  B（青：あお） %3 にする %4',
            turtle_set_tempo_to: '演奏の速さを1分間に %1 拍にする %2',
            turtle_set_wheel_to: '%1 の車輪（しゃりん）の速さを %2 にする %3',
            turtle_set_wheels_to_left_right: '車輪（しゃりん）の速さを左 %1 右 %2 にする %3',
            turtle_stop: '移動を停止する %1',
            turtle_touching_color: '%1 を感知した？',
            turtle_turn_at_intersection: '黒の線が交わる点で %1 へ方向を変える %2',
            turtle_turn_unit_in_place: '%1 へ %2 %3 その場で回る %4',
            turtle_turn_unit_with_radius_in_direction: '%1 へ %2 %3 半径 %4 cmで %5 方向に回る %6',
            turtle_value: '%1',
        },
        Helper: {
            turtle_button_state:
                '背中（ボタン）が[クリック/ダブルクリック/長押し]された場合は｢正しい｣と判断します。それ以外の場合は｢正しくない｣と判断します。',
            turtle_change_buzzer_by:
                'ブザーの現在の音の高さ（ヘルツ）に入力された数値を足して鳴らします。小数点以下2桁まで入力できます。',
            turtle_change_head_led_by_rgb:
                '頭のLEDライトの色に、入力されたR（赤：あか）、G（緑：みどり）、B（青：あお）の数値（範囲:0～255）を足します。',
            turtle_change_tempo_by:
                '入力された数値を現在の演奏速度（１分あたりの拍数）に足します。',
            turtle_change_wheel_by:
                '[左/右]の車輪（しゃりん）の速さ（%）に入力された数値を足します。足した結果が、正の数の場合は前方向に、負の数の場合は後方向に、車輪が回転します。',
            turtle_change_wheels_by_left_right:
                '左右の車輪（しゃりん）の速さ（%）にそれぞれ入力された数値を足します。足した結果が、正の数の場合は前方向に、負の数の場合は後方向に、車輪が回転します。',
            turtle_clear_head_led: '頭のLEDライトを消します。',
            turtle_clear_sound: '音を消します。',
            turtle_cross_intersection: '黒の線が交わる点を越えて、前方の黒の線にそって移動します。',
            turtle_follow_line: '白地の上の選択された色の線にそって移動します。',
            turtle_follow_line_until:
                '白地の上の黒の線にそって移動し、カラーセンサーが選択された色を感知したら停止します。',
            turtle_follow_line_until_black:
                '白地の上の選択された色の線にそって移動し、カラーセンサーが黒を感知したら停止します。',
            turtle_is_color_pattern:
                'カラーセンサーが選択された色の順番（パターン）を感知した場合は｢正しい｣と判断します。それ以外の場合は｢正しくない｣と判断します。',
            turtle_move_backward_unit: '入力された数値[cm/秒/パルス]だけ後方向に移動します。',
            turtle_move_forward_unit: '入力された数値[cm/秒/パルス]だけ前方向に移動します。',
            turtle_pivot_around_wheel_unit_in_direction:
                '[左/右]の車輪を中心に、入力された数値[角度/秒/パルス]だけ、[前/後]方向に回転します。',
            turtle_play_note: '選択された音階（音名、オクターブ）が鳴ります。',
            turtle_play_note_for_beats:
                '選択された音階（音名、オクターブ）が、入力された拍数分鳴ります。',
            turtle_play_sound_times: '選択された音を入力された回数だけ再生します。',
            turtle_play_sound_times_until_done:
                '選択された音を入力された回数だけ再生します。再生が終わってから次の命令を実行します。',
            turtle_rest_for_beats: '入力された拍数分だけ音を鳴らすのを休みます。',
            turtle_set_buzzer_to:
                'ブザーの現在の音の高さ（ヘルツ）を入力された数値にして鳴らします。小数点以下2桁まで入力できます。',
            turtle_set_following_speed_to:
                '線にそって移動する速度（範囲：1〜8）を入力された数値にします。数字が大きいほど動きが速くなります。',
            turtle_set_head_led_to: '頭のLEDライトを選択された色にします。',
            turtle_set_head_led_to_rgb:
                '頭のLEDライトを入力されたR（赤：あか）、G（緑：みどり）、B（青：あお）の数値（範囲:0～255）の色にします。',
            turtle_set_tempo_to: '入力された数値を現在の演奏速度（１分あたりの拍数）にします。',
            turtle_set_wheel_to:
                '[左/右]の車輪（しゃりん）の速さ（範囲：-400～400%）を入力された数値にします。正の数の場合は前方向に、負の数の場合は後方向に、車輪が回転します。0を入力すると車輪が停止します。',
            turtle_set_wheels_to_left_right:
                '左右の車輪（しゃりん）の速さ（範囲：-400～400%）をそれぞれ入力された数値にします。正の数の場合は前方向に、負の数の場合は後方向に、車輪が回転します。0を入力すると車輪が停止します。',
            turtle_stop: '移動を停止します。',
            turtle_touching_color:
                'カラーセンサーが選択された色を感知した場合は｢正しい｣と判断します。それ以外の場合は｢正しくない｣と判断します。',
            turtle_turn_at_intersection:
                '黒の線が交わる点で[左/右/後]方向に回転して、黒い線にそって移動します。',
            turtle_turn_unit_in_place:
                '入力された数値[角度/秒/パルス]だけ、その場で[左/右]に回転します。',
            turtle_turn_unit_with_radius_in_direction:
                '入力された数値[角度/秒/パルス]だけ、入力された半径（cm）で、[前/後]方向に回転します。',
            turtle_value:
                '色番号：カラーセンサーが感知した色の番号（範囲：-1〜8、初期値：-1）<br/>色のパターン：カラーセンサーが感知した色のパターンの値（範囲：-1〜88、初期値：-1）<br/>床センサー：床センサーの値（範囲：0〜100、初期値：0）<br/>ボタン：ボタンの状態（クリックした時：1、それ以外：0、初期値：0）<br/>前後の速さ：加速度センサーの前後（x軸）の速さの値（範囲：-32768〜32767、初期値：0）タートルが前進する方向はx軸の正方向です。<br/>左右の速さ：加速度センサーの左右（y軸）の速さの値（範囲：-32768〜32767、初期値：0）タートルの左方向がy軸の正方向です。<br/>上下の速さ：加速度センサーの上下（z軸）の速さの値（範囲：-32768〜32767、初期値：0）タートルの上方向がz軸の正方向です。<br/>',
        },
        Blocks: {
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
            turtle_note_d: 'レ',
            turtle_note_e: 'ミ',
            turtle_note_f: 'ファ',
            turtle_note_g: 'ソ',
            turtle_note_a: 'ラ',
            turtle_note_b: 'シ',
        },
    },
    vn: {
        template: {
            turtle_button_state: '버튼을 %1 ?',
            turtle_change_buzzer_by: '버저 음을 %1 만큼 바꾸기 %2',
            turtle_change_head_led_by_rgb: '머리 LED를 R: %1 G: %2 B: %3 만큼 바꾸기 %4',
            turtle_change_tempo_by: '연주 속도를 %1 만큼 바꾸기 %2',
            turtle_change_wheel_by: '%1 바퀴 %2 만큼 바꾸기 %3',
            turtle_change_wheels_by_left_right: '왼쪽 바퀴 %1 오른쪽 바퀴 %2 만큼 바꾸기 %3',
            turtle_clear_head_led: '머리 LED 끄기 %1',
            turtle_clear_sound: '소리 끄기 %1',
            turtle_cross_intersection: '검은색 교차로 건너가기 %1',
            turtle_follow_line: '%1 선을 따라가기 %2',
            turtle_follow_line_until: '검은색 선을 따라 %1 까지 이동하기 %2',
            turtle_follow_line_until_black: '%1 선을 따라 검은색까지 이동하기 %2',
            turtle_is_color_pattern: '색깔 패턴이 %1 %2 인가?',
            turtle_move_backward_unit: '뒤로 %1 %2 이동하기 %3',
            turtle_move_forward_unit: '앞으로 %1 %2 이동하기 %3',
            turtle_pivot_around_wheel_unit_in_direction:
                '%1 바퀴 중심으로 %2 %3 %4 방향으로 돌기 %5',
            turtle_play_note: '%1 %2 음을 연주하기 %3',
            turtle_play_note_for_beats: '%1 %2 음을 %3 박자 연주하기 %4',
            turtle_play_sound_times: '%1 소리 %2 번 재생하기 %3',
            turtle_play_sound_times_until_done: '%1 소리 %2 번 재생하고 기다리기 %3',
            turtle_rest_for_beats: '%1 박자 쉬기 %2',
            turtle_set_buzzer_to: '버저 음을 %1 (으)로 정하기 %2',
            turtle_set_following_speed_to: '선 따라가기 속도를 %1 (으)로 정하기 %2',
            turtle_set_head_led_to: '머리 LED를 %1 으로 정하기 %2',
            turtle_set_head_led_to_rgb: '머리 LED를 R: %1 G: %2 B: %3 (으)로 정하기 %4',
            turtle_set_tempo_to: '연주 속도를 %1 BPM으로 정하기 %2',
            turtle_set_wheel_to: '%1 바퀴 %2 (으)로 정하기 %3',
            turtle_set_wheels_to_left_right: '왼쪽 바퀴 %1 오른쪽 바퀴 %2 (으)로 정하기 %3',
            turtle_stop: '정지하기 %1',
            turtle_touching_color: '%1 에 닿았는가?',
            turtle_turn_at_intersection: '검은색 교차로에서 %1 으로 돌기 %2',
            turtle_turn_unit_in_place: '%1 으로 %2 %3 제자리 돌기 %4',
            turtle_turn_unit_with_radius_in_direction:
                '%1 으로 %2 %3 반지름 %4 cm를 %5 방향으로 돌기 %6',
            turtle_value: '%1',
        },
        Helper: {
            turtle_button_state:
                "등 버튼을 클릭했으면/더블클릭했으면/길게 눌렀으면 '참'으로 판단하고, 아니면 '거짓'으로 판단합니다.",
            turtle_change_buzzer_by:
                '버저 소리의 현재 음 높이(Hz)에 입력한 값을 더합니다. 소수점 둘째 자리까지 입력할 수 있습니다.',
            turtle_change_head_led_by_rgb:
                '머리 LED의 현재 R, G, B 값에 입력한 값을 각각 더합니다.',
            turtle_change_tempo_by:
                '연주하거나 쉬는 속도의 현재 BPM(분당 박자 수)에 입력한 값을 더합니다.',
            turtle_change_wheel_by:
                '왼쪽/오른쪽/양쪽 바퀴의 현재 속도 값(%)에 입력한 값을 더합니다. 더한 결과가 양수 값이면 바퀴가 앞으로 회전하고, 음수 값이면 뒤로 회전합니다.',
            turtle_change_wheels_by_left_right:
                '왼쪽과 오른쪽 바퀴의 현재 속도 값(%)에 입력한 값을 각각 더합니다. 더한 결과가 양수 값이면 바퀴가 앞으로 회전하고, 음수 값이면 뒤로 회전합니다.',
            turtle_clear_head_led: '머리 LED를 끕니다.',
            turtle_clear_sound: '소리를 끕니다.',
            turtle_cross_intersection:
                '검은색 교차로에서 잠시 앞으로 이동한 후 검은색 선을 찾아 다시 이동합니다.',
            turtle_follow_line: '하얀색 바탕 위에서 선택한 색깔의 선을 따라 이동합니다.',
            turtle_follow_line_until:
                '하얀색 바탕 위에서 검은색 선을 따라 이동하다가 선택한 색깔을 컬러 센서가 감지하면 정지합니다.',
            turtle_follow_line_until_black:
                '하얀색 바탕 위에서 선택한 색깔의 선을 따라 이동하다가 컬러 센서가 검은색을 감지하면 정지합니다.',
            turtle_is_color_pattern:
                "선택한 색깔 패턴을 컬러 센서가 감지하였으면 '참'으로 판단하고, 아니면 '거짓'으로 판단합니다.",
            turtle_move_backward_unit: '입력한 거리(cm)/시간(초)/펄스만큼 뒤로 이동합니다.',
            turtle_move_forward_unit: '입력한 거리(cm)/시간(초)/펄스만큼 앞으로 이동합니다.',
            turtle_pivot_around_wheel_unit_in_direction:
                '왼쪽/오른쪽 바퀴 중심으로 입력한 각도(도)/시간(초)/펄스만큼 머리/꼬리 방향으로 회전합니다.',
            turtle_play_note: '선택한 계이름과 옥타브의 음을 계속 소리 냅니다.',
            turtle_play_note_for_beats:
                '선택한 계이름과 옥타브의 음을 입력한 박자만큼 소리 냅니다.',
            turtle_play_sound_times: '선택한 소리를 입력한 횟수만큼 재생합니다.',
            turtle_play_sound_times_until_done:
                '선택한 소리를 입력한 횟수만큼 재생하고, 재생이 완료될 때까지 기다립니다.',
            turtle_rest_for_beats: '입력한 박자만큼 쉽니다.',
            turtle_set_buzzer_to:
                '버저 소리의 음 높이를 입력한 값(Hz)으로 설정합니다. 소수점 둘째 자리까지 입력할 수 있습니다. 숫자 0을 입력하면 소리를 끕니다.',
            turtle_set_following_speed_to:
                '선을 따라 이동하는 속도(1 ~ 8)를 설정합니다. 숫자가 클수록 이동하는 속도가 빠릅니다.',
            turtle_set_head_led_to: '머리 LED를 선택한 색깔로 켭니다.',
            turtle_set_head_led_to_rgb: '머리 LED의 R, G, B 값을 입력한 값으로 각각 설정합니다.',
            turtle_set_tempo_to: '연주하거나 쉬는 속도를 입력한 BPM(분당 박자 수)으로 설정합니다.',
            turtle_set_wheel_to:
                '왼쪽/오른쪽/양쪽 바퀴의 속도를 입력한 값(-400 ~ 400%)으로 설정합니다. 양수 값을 입력하면 바퀴가 앞으로 회전하고, 음수 값을 입력하면 뒤로 회전합니다. 숫자 0을 입력하면 정지합니다.',
            turtle_set_wheels_to_left_right:
                '왼쪽과 오른쪽 바퀴의 속도를 입력한 값(-400 ~ 400%)으로 각각 설정합니다. 양수 값을 입력하면 바퀴가 앞으로 회전하고, 음수 값을 입력하면 뒤로 회전합니다. 숫자 0을 입력하면 정지합니다.',
            turtle_stop: '양쪽 바퀴를 정지합니다.',
            turtle_touching_color:
                "선택한 색깔을 컬러 센서가 감지하였으면 '참'으로 판단하고, 아니면 '거짓'으로 판단합니다.",
            turtle_turn_at_intersection:
                '검은색 교차로에서 잠시 앞으로 이동한 후 제자리에서 왼쪽/오른쪽/뒤쪽으로 회전하고 검은색 선을 찾아 다시 이동합니다.',
            turtle_turn_unit_in_place:
                '입력한 각도(도)/시간(초)/펄스만큼 왼쪽/오른쪽 방향으로 제자리에서 회전합니다.',
            turtle_turn_unit_with_radius_in_direction:
                '입력한 반지름의 원을 그리면서 입력한 각도(도)/시간(초)/펄스만큼 왼쪽/오른쪽, 머리/꼬리 방향으로 회전합니다.',
            turtle_value:
                '색깔 번호: 컬러 센서가 감지한 색깔의 번호 (값의 범위: -1 ~ 8, 초기값: -1)<br/>색깔 패턴: 컬러 센서가 감지한 색깔 패턴의 값 (값의 범위: -1 ~ 88, 초기값: -1)<br/>바닥 센서: 바닥 센서의 값 (값의 범위: 0 ~ 100, 초기값: 0)<br/>버튼: 거북이 등 버튼의 상태 값 (누르면 1, 아니면 0, 초기값: 0)<br/>x축 가속도: 가속도 센서의 X축 값 (값의 범위: -32768 ~ 32767, 초기값: 0) 로봇이 전진하는 방향이 X축의 양수 방향입니다.<br/>y축 가속도: 가속도 센서의 Y축 값 (값의 범위: -32768 ~ 32767, 초기값: 0) 로봇의 왼쪽 방향이 Y축의 양수 방향입니다.<br/>z축 가속도: 가속도 센서의 Z축 값 (값의 범위: -32768 ~ 32767, 초기값: 0) 로봇의 위쪽 방향이 Z축의 양수 방향입니다.',
        },
        Blocks: {
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
            turtle_note_c: {
                ko: '도',
                en: 'C',
                code: 'C',
            },
            turtle_note_d: {
                ko: '레',
                en: 'D',
                code: 'D',
            },
            turtle_note_e: {
                ko: '미',
                en: 'E',
                code: 'E',
            },
            turtle_note_f: {
                ko: '파',
                en: 'F',
                code: 'F',
            },
            turtle_note_g: {
                ko: '솔',
                en: 'G',
                code: 'G',
            },
            turtle_note_a: {
                ko: '라',
                en: 'A',
                code: 'A',
            },
            turtle_note_b: {
                ko: '시',
                en: 'B',
                code: 'B',
            },
        },
    },
});

Entry.Turtle.blockMenuBlocks = [
    'turtle_touching_color',
    'turtle_is_color_pattern',
    'turtle_button_state',
    'turtle_value',
    'turtle_move_forward_unit',
    'turtle_move_backward_unit',
    'turtle_turn_unit_in_place',
    'turtle_turn_unit_with_radius_in_direction',
    'turtle_pivot_around_wheel_unit_in_direction',
    'turtle_change_wheels_by_left_right',
    'turtle_set_wheels_to_left_right',
    'turtle_change_wheel_by',
    'turtle_set_wheel_to',
    'turtle_follow_line',
    'turtle_follow_line_until',
    'turtle_follow_line_until_black',
    'turtle_cross_intersection',
    'turtle_turn_at_intersection',
    'turtle_set_following_speed_to',
    'turtle_stop',
    'turtle_set_head_led_to',
    'turtle_change_head_led_by_rgb',
    'turtle_set_head_led_to_rgb',
    'turtle_clear_head_led',
    'turtle_play_sound_times',
    'turtle_play_sound_times_until_done',
    'turtle_change_buzzer_by',
    'turtle_set_buzzer_to',
    'turtle_clear_sound',
    'turtle_play_note',
    'turtle_play_note_for_beats',
    'turtle_rest_for_beats',
    'turtle_change_tempo_by',
    'turtle_set_tempo_to',
];

Entry.Turtle.getBlocks = function() {
    return {
        //region turtle 터틀
        turtle_touching_color: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
            statements: [],
            params: [
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
                params: [null],
                type: 'turtle_touching_color',
            },
            paramsKeyMap: {
                COLOR: 0,
            },
            class: 'turtle_sensor',
            isNotFor: ['turtle'],
            func(sprite, script) {
                const pd = Entry.hw.portData;
                return Number(script.getField('COLOR')) - 1 == pd.colorNumber;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Turtle.touching(%1)',
                        blockType: 'param',
                        textParams: [
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
                                converter: Entry.block.converters.returnValuePartialUpperCase,
                                codeMap: 'Entry.CodeMap.Turtle.touching_colors',
                            },
                        ],
                    },
                ],
            },
        },
        turtle_is_color_pattern: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
            statements: [],
            params: [
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
                params: [null, null],
                type: 'turtle_is_color_pattern',
            },
            paramsKeyMap: {
                COLOR1: 0,
                COLOR2: 1,
            },
            class: 'turtle_sensor',
            isNotFor: ['turtle'],
            func(sprite, script) {
                const pd = Entry.hw.portData;
                return (
                    Number(script.getField('COLOR1')) * 10 + Number(script.getField('COLOR2')) ==
                    pd.colorPattern
                );
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Turtle.match_color_pattern(%1, %2)',
                        blockType: 'param',
                        textParams: [
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
                                converter: Entry.block.converters.returnValuePartialUpperCase,
                                codeMap: 'Entry.CodeMap.Turtle.pattern_colors',
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
                                converter: Entry.block.converters.returnValuePartialUpperCase,
                                codeMap: 'Entry.CodeMap.Turtle.pattern_colors',
                            },
                        ],
                    },
                ],
            },
        },
        turtle_button_state: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
            statements: [],
            params: [
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
                params: [null],
                type: 'turtle_button_state',
            },
            paramsKeyMap: {
                EVENT: 0,
            },
            class: 'turtle_sensor',
            isNotFor: ['turtle'],
            func(sprite, script) {
                const pd = Entry.hw.portData;
                const event = script.getField('EVENT');
                return pd[event] == 1;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Turtle.clicked()',
                        blockType: 'param',
                        textParams: [
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
                        params: ['clicked'],
                    },
                    {
                        syntax: 'Turtle.double_clicked()',
                        blockType: 'param',
                        textParams: [
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
                        params: ['doubleClicked'],
                    },
                    {
                        syntax: 'Turtle.long_pressed()',
                        blockType: 'param',
                        textParams: [
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
                        params: ['longPressed'],
                    },
                ],
            },
        },
        turtle_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
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
                params: [null],
                type: 'turtle_value',
            },
            paramsKeyMap: {
                DEVICE: 0,
            },
            class: 'turtle_sensor',
            isNotFor: ['turtle'],
            func(sprite, script) {
                const pd = Entry.hw.portData;
                const dev = script.getField('DEVICE');
                return pd[dev];
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Turtle.color_number()',
                        blockType: 'param',
                        textParams: [
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
                        params: ['colorNumber'],
                    },
                    {
                        syntax: 'Turtle.color_pattern()',
                        blockType: 'param',
                        textParams: [
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
                        params: ['colorPattern'],
                    },
                    {
                        syntax: 'Turtle.floor()',
                        blockType: 'param',
                        textParams: [
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
                        params: ['floor'],
                    },
                    {
                        syntax: 'Turtle.button()',
                        blockType: 'param',
                        textParams: [
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
                        params: ['button'],
                    },
                    {
                        syntax: 'Turtle.acceleration_x()',
                        blockType: 'param',
                        textParams: [
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
                        params: ['accelerationX'],
                    },
                    {
                        syntax: 'Turtle.acceleration_y()',
                        blockType: 'param',
                        textParams: [
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
                        params: ['accelerationY'],
                    },
                    {
                        syntax: 'Turtle.acceleration_z()',
                        blockType: 'param',
                        textParams: [
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
                        params: ['accelerationZ'],
                    },
                ],
            },
        },
        turtle_move_forward_unit: {
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
                        params: ['6'],
                    },
                    null,
                    null,
                ],
                type: 'turtle_move_forward_unit',
            },
            paramsKeyMap: {
                VALUE: 0,
                UNIT: 1,
            },
            class: 'turtle_wheel',
            isNotFor: ['turtle'],
            func(sprite, script) {
                const sq = Entry.hw.sendQueue;
                const pd = Entry.hw.portData;
                const turtle = Entry.Turtle;
                turtle.setModule(sq);
                if (!script.isStart) {
                    script.isStart = true;
                    sq.leftWheel = 0;
                    sq.rightWheel = 0;
                    turtle.setPulse(sq, 0);
                    turtle.setLineTracerMode(sq, 0);
                    const field = script.getField('UNIT');
                    let unit = 1;
                    if (field == 'SEC') {
                        unit = 2;
                    } else if (field == 'PULSE') {
                        unit = 3;
                    }
                    const value = script.getNumberValue('VALUE');
                    turtle.setMotion(sq, 1, unit, 0, value, 0);
                    return script;
                } else {
                    if (pd.wheelStateId != turtle.wheelStateId) {
                        turtle.wheelStateId = pd.wheelStateId;
                        if (pd.wheelState == 0) {
                            delete script.isStart;
                            Entry.engine.isContinue = false;
                            sq.leftWheel = 0;
                            sq.rightWheel = 0;
                            return script.callReturn();
                        }
                    }
                    return script;
                }
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Turtle.move_forward(%1, %2)',
                        textParams: [
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
                                converter: Entry.block.converters.returnValuePartialUpperCase,
                                codeMap: 'Entry.CodeMap.Turtle.units',
                            },
                        ],
                    },
                ],
            },
        },
        turtle_move_backward_unit: {
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
                        params: ['6'],
                    },
                    null,
                    null,
                ],
                type: 'turtle_move_backward_unit',
            },
            paramsKeyMap: {
                VALUE: 0,
                UNIT: 1,
            },
            class: 'turtle_wheel',
            isNotFor: ['turtle'],
            func(sprite, script) {
                const sq = Entry.hw.sendQueue;
                const pd = Entry.hw.portData;
                const turtle = Entry.Turtle;
                turtle.setModule(sq);
                if (!script.isStart) {
                    script.isStart = true;
                    sq.leftWheel = 0;
                    sq.rightWheel = 0;
                    turtle.setPulse(sq, 0);
                    turtle.setLineTracerMode(sq, 0);
                    const field = script.getField('UNIT');
                    let unit = 1;
                    if (field == 'SEC') {
                        unit = 2;
                    } else if (field == 'PULSE') {
                        unit = 3;
                    }
                    const value = script.getNumberValue('VALUE');
                    turtle.setMotion(sq, 2, unit, 0, value, 0);
                    return script;
                } else {
                    if (pd.wheelStateId != turtle.wheelStateId) {
                        turtle.wheelStateId = pd.wheelStateId;
                        if (pd.wheelState == 0) {
                            delete script.isStart;
                            Entry.engine.isContinue = false;
                            sq.leftWheel = 0;
                            sq.rightWheel = 0;
                            return script.callReturn();
                        }
                    }
                    return script;
                }
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Turtle.move_backward(%1, %2)',
                        textParams: [
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
                                converter: Entry.block.converters.returnValuePartialUpperCase,
                                codeMap: 'Entry.CodeMap.Turtle.units',
                            },
                        ],
                    },
                ],
            },
        },
        turtle_turn_unit_in_place: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
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
                    null,
                    {
                        type: 'text',
                        params: ['90'],
                    },
                    null,
                    null,
                ],
                type: 'turtle_turn_unit_in_place',
            },
            paramsKeyMap: {
                DIRECTION: 0,
                VALUE: 1,
                UNIT: 2,
            },
            class: 'turtle_wheel',
            isNotFor: ['turtle'],
            func(sprite, script) {
                const sq = Entry.hw.sendQueue;
                const pd = Entry.hw.portData;
                const turtle = Entry.Turtle;
                turtle.setModule(sq);
                if (!script.isStart) {
                    script.isStart = true;
                    sq.leftWheel = 0;
                    sq.rightWheel = 0;
                    turtle.setPulse(sq, 0);
                    turtle.setLineTracerMode(sq, 0);
                    const direction = script.getField('DIRECTION');
                    const field = script.getField('UNIT');
                    let unit = 1;
                    if (field == 'SEC') {
                        unit = 2;
                    } else if (field == 'PULSE') {
                        unit = 3;
                    }
                    const value = script.getNumberValue('VALUE');
                    if (direction == 'LEFT') {
                        turtle.setMotion(sq, 3, unit, 0, value, 0);
                    } else {
                        turtle.setMotion(sq, 4, unit, 0, value, 0);
                    }
                    return script;
                } else {
                    if (pd.wheelStateId != turtle.wheelStateId) {
                        turtle.wheelStateId = pd.wheelStateId;
                        if (pd.wheelState == 0) {
                            delete script.isStart;
                            Entry.engine.isContinue = false;
                            sq.leftWheel = 0;
                            sq.rightWheel = 0;
                            return script.callReturn();
                        }
                    }
                    return script;
                }
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Turtle.turn_left(%2, %3)',
                        textParams: [
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
                                converter: Entry.block.converters.returnValuePartialUpperCase,
                                codeMap: 'Entry.CodeMap.Turtle.units',
                            },
                        ],
                        params: ['LEFT'],
                    },
                    {
                        syntax: 'Turtle.turn_right(%2, %3)',
                        textParams: [
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
                                converter: Entry.block.converters.returnValuePartialUpperCase,
                                codeMap: 'Entry.CodeMap.Turtle.units',
                            },
                        ],
                        params: ['RIGHT'],
                    },
                ],
            },
        },
        turtle_turn_unit_with_radius_in_direction: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
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
                type: 'turtle_turn_unit_with_radius_in_direction',
            },
            paramsKeyMap: {
                DIRECTION: 0,
                VALUE: 1,
                UNIT: 2,
                RADIUS: 3,
                HEAD: 4,
            },
            class: 'turtle_wheel',
            isNotFor: ['turtle'],
            func(sprite, script) {
                const sq = Entry.hw.sendQueue;
                const pd = Entry.hw.portData;
                const turtle = Entry.Turtle;
                turtle.setModule(sq);
                if (!script.isStart) {
                    script.isStart = true;
                    sq.leftWheel = 0;
                    sq.rightWheel = 0;
                    turtle.setPulse(sq, 0);
                    turtle.setLineTracerMode(sq, 0);
                    const direction = script.getField('DIRECTION');
                    const field = script.getField('UNIT');
                    let unit = 1;
                    if (field == 'SEC') {
                        unit = 2;
                    } else if (field == 'PULSE') {
                        unit = 3;
                    }
                    const value = script.getNumberValue('VALUE');
                    const head = script.getField('HEAD');
                    const radius = script.getNumberValue('RADIUS');
                    if (direction == 'LEFT') {
                        if (head == 'HEAD') {
                            turtle.setMotion(sq, 9, unit, 0, value, radius);
                        } else {
                            turtle.setMotion(sq, 10, unit, 0, value, radius);
                        }
                    } else {
                        if (head == 'HEAD') {
                            turtle.setMotion(sq, 11, unit, 0, value, radius);
                        } else {
                            turtle.setMotion(sq, 12, unit, 0, value, radius);
                        }
                    }
                    return script;
                } else {
                    if (pd.wheelStateId != turtle.wheelStateId) {
                        turtle.wheelStateId = pd.wheelStateId;
                        if (pd.wheelState == 0) {
                            delete script.isStart;
                            Entry.engine.isContinue = false;
                            sq.leftWheel = 0;
                            sq.rightWheel = 0;
                            return script.callReturn();
                        }
                    }
                    return script;
                }
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Turtle.swing_left(%2, %3, %4, %5)',
                        textParams: [
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
                                converter: Entry.block.converters.returnValuePartialUpperCase,
                                codeMap: 'Entry.CodeMap.Turtle.units',
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
                                converter: Entry.block.converters.returnValuePartialUpperCase,
                                codeMap: 'Entry.CodeMap.Turtle.head_tail',
                            },
                        ],
                        params: ['LEFT'],
                    },
                    {
                        syntax: 'Turtle.swing_right(%2, %3, %4, %5)',
                        textParams: [
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
                                converter: Entry.block.converters.returnValuePartialUpperCase,
                                codeMap: 'Entry.CodeMap.Turtle.units',
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
                                converter: Entry.block.converters.returnValuePartialUpperCase,
                                codeMap: 'Entry.CodeMap.Turtle.head_tail',
                            },
                        ],
                        params: ['RIGHT'],
                    },
                ],
            },
        },
        turtle_pivot_around_wheel_unit_in_direction: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
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
                    null,
                    {
                        type: 'text',
                        params: ['90'],
                    },
                    null,
                    null,
                    null,
                ],
                type: 'turtle_pivot_around_wheel_unit_in_direction',
            },
            paramsKeyMap: {
                DIRECTION: 0,
                VALUE: 1,
                UNIT: 2,
                HEAD: 3,
            },
            class: 'turtle_wheel',
            isNotFor: ['turtle'],
            func(sprite, script) {
                const sq = Entry.hw.sendQueue;
                const pd = Entry.hw.portData;
                const turtle = Entry.Turtle;
                turtle.setModule(sq);
                if (!script.isStart) {
                    script.isStart = true;
                    sq.leftWheel = 0;
                    sq.rightWheel = 0;
                    turtle.setPulse(sq, 0);
                    turtle.setLineTracerMode(sq, 0);
                    const direction = script.getField('DIRECTION');
                    const field = script.getField('UNIT');
                    let unit = 1;
                    if (field == 'SEC') {
                        unit = 2;
                    } else if (field == 'PULSE') {
                        unit = 3;
                    }
                    const value = script.getNumberValue('VALUE');
                    const head = script.getField('HEAD');
                    if (direction == 'LEFT') {
                        if (head == 'HEAD') {
                            turtle.setMotion(sq, 5, unit, 0, value, 0);
                        } else {
                            turtle.setMotion(sq, 6, unit, 0, value, 0);
                        }
                    } else {
                        if (head == 'HEAD') {
                            turtle.setMotion(sq, 7, unit, 0, value, 0);
                        } else {
                            turtle.setMotion(sq, 8, unit, 0, value, 0);
                        }
                    }
                    return script;
                } else {
                    if (pd.wheelStateId != turtle.wheelStateId) {
                        turtle.wheelStateId = pd.wheelStateId;
                        if (pd.wheelState == 0) {
                            delete script.isStart;
                            Entry.engine.isContinue = false;
                            sq.leftWheel = 0;
                            sq.rightWheel = 0;
                            return script.callReturn();
                        }
                    }
                    return script;
                }
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Turtle.pivot_left(%2, %3, %4)',
                        textParams: [
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
                                converter: Entry.block.converters.returnValuePartialUpperCase,
                                codeMap: 'Entry.CodeMap.Turtle.units',
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
                                converter: Entry.block.converters.returnValuePartialUpperCase,
                                codeMap: 'Entry.CodeMap.Turtle.head_tail',
                            },
                        ],
                        params: ['LEFT'],
                    },
                    {
                        syntax: 'Turtle.pivot_right(%2, %3, %4)',
                        textParams: [
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
                                converter: Entry.block.converters.returnValuePartialUpperCase,
                                codeMap: 'Entry.CodeMap.Turtle.units',
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
                                converter: Entry.block.converters.returnValuePartialUpperCase,
                                codeMap: 'Entry.CodeMap.Turtle.head_tail',
                            },
                        ],
                        params: ['RIGHT'],
                    },
                ],
            },
        },
        turtle_change_wheels_by_left_right: {
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
                type: 'turtle_change_wheels_by_left_right',
            },
            paramsKeyMap: {
                LEFT: 0,
                RIGHT: 1,
            },
            class: 'turtle_wheel',
            isNotFor: ['turtle'],
            func(sprite, script) {
                const sq = Entry.hw.sendQueue;
                const left = script.getNumberValue('LEFT');
                const right = script.getNumberValue('RIGHT');
                const turtle = Entry.Turtle;
                turtle.setModule(sq);
                turtle.setPulse(sq, 0);
                turtle.setLineTracerMode(sq, 0);
                turtle.setMotion(sq, 0, 0, 0, 0, 0);
                sq.leftWheel = sq.leftWheel != undefined ? sq.leftWheel + left : left;
                sq.rightWheel = sq.rightWheel != undefined ? sq.rightWheel + right : right;
                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Turtle.wheels_by(%1, %2)',
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
        turtle_set_wheels_to_left_right: {
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
                type: 'turtle_set_wheels_to_left_right',
            },
            paramsKeyMap: {
                LEFT: 0,
                RIGHT: 1,
            },
            class: 'turtle_wheel',
            isNotFor: ['turtle'],
            func(sprite, script) {
                const sq = Entry.hw.sendQueue;
                const turtle = Entry.Turtle;
                turtle.setModule(sq);
                turtle.setPulse(sq, 0);
                turtle.setLineTracerMode(sq, 0);
                turtle.setMotion(sq, 0, 0, 0, 0, 0);
                sq.leftWheel = script.getNumberValue('LEFT');
                sq.rightWheel = script.getNumberValue('RIGHT');
                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Turtle.wheels(%1, %2)',
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
        turtle_change_wheel_by: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
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
                    null,
                    {
                        type: 'text',
                        params: ['10'],
                    },
                    null,
                ],
                type: 'turtle_change_wheel_by',
            },
            paramsKeyMap: {
                DIRECTION: 0,
                VALUE: 1,
            },
            class: 'turtle_wheel',
            isNotFor: ['turtle'],
            func(sprite, script) {
                const sq = Entry.hw.sendQueue;
                const direction = script.getField('DIRECTION');
                const value = script.getNumberValue('VALUE');
                const turtle = Entry.Turtle;
                turtle.setModule(sq);
                turtle.setPulse(sq, 0);
                turtle.setLineTracerMode(sq, 0);
                turtle.setMotion(sq, 0, 0, 0, 0, 0);
                if (direction == 'LEFT') {
                    sq.leftWheel = sq.leftWheel != undefined ? sq.leftWheel + value : value;
                } else if (direction == 'RIGHT') {
                    sq.rightWheel = sq.rightWheel != undefined ? sq.rightWheel + value : value;
                } else {
                    sq.leftWheel = sq.leftWheel != undefined ? sq.leftWheel + value : value;
                    sq.rightWheel = sq.rightWheel != undefined ? sq.rightWheel + value : value;
                }
                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Turtle.left_wheel_by(%2)',
                        textParams: [
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
                        params: ['LEFT'],
                    },
                    {
                        syntax: 'Turtle.right_wheel_by(%2)',
                        textParams: [
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
                        params: ['RIGHT'],
                    },
                    {
                        syntax: 'Turtle.wheels_by(%2)',
                        textParams: [
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
                        params: ['BOTH'],
                        keyOption: 'SAME',
                    },
                ],
            },
        },
        turtle_set_wheel_to: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
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
                    null,
                    {
                        type: 'text',
                        params: ['50'],
                    },
                    null,
                ],
                type: 'turtle_set_wheel_to',
            },
            paramsKeyMap: {
                DIRECTION: 0,
                VALUE: 1,
            },
            class: 'turtle_wheel',
            isNotFor: ['turtle'],
            func(sprite, script) {
                const sq = Entry.hw.sendQueue;
                const direction = script.getField('DIRECTION');
                const value = script.getNumberValue('VALUE');
                const turtle = Entry.Turtle;
                turtle.setModule(sq);
                turtle.setPulse(sq, 0);
                turtle.setLineTracerMode(sq, 0);
                turtle.setMotion(sq, 0, 0, 0, 0, 0);
                if (direction == 'LEFT') {
                    sq.leftWheel = value;
                } else if (direction == 'RIGHT') {
                    sq.rightWheel = value;
                } else {
                    sq.leftWheel = value;
                    sq.rightWheel = value;
                }
                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Turtle.left_wheel(%2)',
                        textParams: [
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
                        params: ['LEFT'],
                    },
                    {
                        syntax: 'Turtle.right_wheel(%2)',
                        textParams: [
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
                        params: ['RIGHT'],
                    },
                    {
                        syntax: 'Turtle.wheels(%2)',
                        textParams: [
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
                        params: ['BOTH'],
                        keyOption: 'SAME',
                    },
                ],
            },
        },
        turtle_follow_line: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
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
                params: [null, null],
                type: 'turtle_follow_line',
            },
            paramsKeyMap: {
                COLOR: 0,
            },
            class: 'turtle_wheel',
            isNotFor: ['turtle'],
            func(sprite, script) {
                const sq = Entry.hw.sendQueue;
                const turtle = Entry.Turtle;
                turtle.setModule(sq);
                sq.leftWheel = 0;
                sq.rightWheel = 0;
                turtle.setPulse(sq, 0);
                turtle.setMotion(sq, 0, 0, 0, 0, 0);
                const mode = Number(script.getField('COLOR'));
                turtle.setLineTracerMode(sq, mode);
                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Turtle.follow_line(%1)',
                        textParams: [
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
                                converter: Entry.block.converters.returnValuePartialUpperCase,
                                codeMap: 'Entry.CodeMap.Turtle.line_colors',
                            },
                        ],
                    },
                ],
            },
        },
        turtle_follow_line_until: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
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
                params: [null, null],
                type: 'turtle_follow_line_until',
            },
            paramsKeyMap: {
                COLOR: 0,
            },
            class: 'turtle_wheel',
            isNotFor: ['turtle'],
            func(sprite, script) {
                const sq = Entry.hw.sendQueue;
                const pd = Entry.hw.portData;
                const turtle = Entry.Turtle;
                turtle.setModule(sq);
                if (!script.isStart) {
                    script.isStart = true;
                    sq.leftWheel = 0;
                    sq.rightWheel = 0;
                    turtle.setPulse(sq, 0);
                    turtle.setMotion(sq, 0, 0, 0, 0, 0);
                    const mode = Number(script.getField('COLOR'));
                    turtle.setLineTracerMode(sq, mode);
                    return script;
                } else {
                    if (pd.lineTracerStateId != turtle.lineTracerStateId) {
                        turtle.lineTracerStateId = pd.lineTracerStateId;
                        if (pd.lineTracerState == 0x02) {
                            delete script.isStart;
                            Entry.engine.isContinue = false;
                            turtle.setLineTracerMode(sq, 0);
                            return script.callReturn();
                        }
                    }
                    return script;
                }
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Turtle.follow_black_line_until(%1)',
                        textParams: [
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
                                converter: Entry.block.converters.returnValuePartialUpperCase,
                                codeMap: 'Entry.CodeMap.Turtle.target_colors',
                            },
                        ],
                    },
                ],
            },
        },
        turtle_follow_line_until_black: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
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
                params: [null, null],
                type: 'turtle_follow_line_until_black',
            },
            paramsKeyMap: {
                COLOR: 0,
            },
            class: 'turtle_wheel',
            isNotFor: ['turtle'],
            func(sprite, script) {
                const sq = Entry.hw.sendQueue;
                const pd = Entry.hw.portData;
                const turtle = Entry.Turtle;
                turtle.setModule(sq);
                if (!script.isStart) {
                    script.isStart = true;
                    sq.leftWheel = 0;
                    sq.rightWheel = 0;
                    turtle.setPulse(sq, 0);
                    turtle.setMotion(sq, 0, 0, 0, 0, 0);
                    const mode = Number(script.getField('COLOR'));
                    turtle.setLineTracerMode(sq, mode);
                    return script;
                } else {
                    if (pd.lineTracerStateId != turtle.lineTracerStateId) {
                        turtle.lineTracerStateId = pd.lineTracerStateId;
                        if (pd.lineTracerState == 0x02) {
                            delete script.isStart;
                            Entry.engine.isContinue = false;
                            turtle.setLineTracerMode(sq, 0);
                            return script.callReturn();
                        }
                    }
                    return script;
                }
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Turtle.follow_line_until_black(%1)',
                        textParams: [
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
                                converter: Entry.block.converters.returnValuePartialUpperCase,
                                codeMap: 'Entry.CodeMap.Turtle.color_lines',
                            },
                        ],
                    },
                ],
            },
        },
        turtle_cross_intersection: {
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
                type: 'turtle_cross_intersection',
            },
            class: 'turtle_wheel',
            isNotFor: ['turtle'],
            func(sprite, script) {
                const sq = Entry.hw.sendQueue;
                const pd = Entry.hw.portData;
                const turtle = Entry.Turtle;
                turtle.setModule(sq);
                if (!script.isStart) {
                    script.isStart = true;
                    sq.leftWheel = 0;
                    sq.rightWheel = 0;
                    turtle.setPulse(sq, 0);
                    turtle.setMotion(sq, 0, 0, 0, 0, 0);
                    turtle.setLineTracerMode(sq, 40);
                    return script;
                } else {
                    if (pd.lineTracerStateId != turtle.lineTracerStateId) {
                        turtle.lineTracerStateId = pd.lineTracerStateId;
                        if (pd.lineTracerState == 0x02) {
                            delete script.isStart;
                            Entry.engine.isContinue = false;
                            turtle.setLineTracerMode(sq, 0);
                            return script.callReturn();
                        }
                    }
                    return script;
                }
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Turtle.intersection_forward()',
                    },
                ],
            },
        },
        turtle_turn_at_intersection: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
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
                params: [null, null],
                type: 'turtle_turn_at_intersection',
            },
            paramsKeyMap: {
                DIRECTION: 0,
            },
            class: 'turtle_wheel',
            isNotFor: ['turtle'],
            func(sprite, script) {
                const sq = Entry.hw.sendQueue;
                const pd = Entry.hw.portData;
                const turtle = Entry.Turtle;
                turtle.setModule(sq);
                if (!script.isStart) {
                    script.isStart = true;
                    sq.leftWheel = 0;
                    sq.rightWheel = 0;
                    turtle.setPulse(sq, 0);
                    turtle.setMotion(sq, 0, 0, 0, 0, 0);
                    const mode = Number(script.getField('DIRECTION'));
                    Entry.Turtle.setLineTracerMode(sq, mode);
                    return script;
                } else {
                    if (pd.lineTracerStateId != turtle.lineTracerStateId) {
                        turtle.lineTracerStateId = pd.lineTracerStateId;
                        if (pd.lineTracerState == 0x02) {
                            delete script.isStart;
                            Entry.engine.isContinue = false;
                            turtle.setLineTracerMode(sq, 0);
                            return script.callReturn();
                        }
                    }
                    return script;
                }
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Turtle.intersection_left()',
                        textParams: [
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
                        params: ['20'],
                    },
                    {
                        syntax: 'Turtle.intersection_right()',
                        textParams: [
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
                        params: ['30'],
                    },
                    {
                        syntax: 'Turtle.intersection_uturn()',
                        textParams: [
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
                        params: ['50'],
                    },
                ],
            },
        },
        turtle_set_following_speed_to: {
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
                type: 'turtle_set_following_speed_to',
            },
            paramsKeyMap: {
                SPEED: 0,
            },
            class: 'turtle_wheel',
            isNotFor: ['turtle'],
            func(sprite, script) {
                const sq = Entry.hw.sendQueue;
                Entry.Turtle.setModule(sq);
                const speed = Number(script.getField('SPEED'));
                sq.lineTracerSpeed = speed;
                sq.lineTracerGain = speed;
                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Turtle.line_tracer_speed(%1)',
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
        turtle_stop: {
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
                type: 'turtle_stop',
            },
            class: 'turtle_wheel',
            isNotFor: ['turtle'],
            func(sprite, script) {
                const sq = Entry.hw.sendQueue;
                const turtle = Entry.Turtle;
                turtle.setModule(sq);
                sq.leftWheel = 0;
                sq.rightWheel = 0;
                turtle.setPulse(sq, 0);
                turtle.setLineTracerMode(sq, 0);
                turtle.setMotion(sq, 0, 0, 0, 0, 0);
                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Turtle.stop()',
                    },
                ],
            },
        },
        turtle_set_head_led_to: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
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
                params: [null, null],
                type: 'turtle_set_head_led_to',
            },
            paramsKeyMap: {
                COLOR: 0,
            },
            class: 'turtle_led',
            isNotFor: ['turtle'],
            func(sprite, script) {
                const sq = Entry.hw.sendQueue;
                const color = script.getField('COLOR');
                Entry.Turtle.setModule(sq);
                Entry.Turtle.setLedColor(sq, color);
                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Turtle.led_color(%1)',
                        textParams: [
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
                                converter: Entry.block.converters.returnValuePartialUpperCase,
                                codeMap: 'Entry.CodeMap.Turtle.led_colors',
                            },
                        ],
                    },
                ],
            },
        },
        turtle_change_head_led_by_rgb: {
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
                type: 'turtle_change_head_led_by_rgb',
            },
            paramsKeyMap: {
                RED: 0,
                GREEN: 1,
                BLUE: 2,
            },
            class: 'turtle_led',
            isNotFor: ['turtle'],
            func(sprite, script) {
                const sq = Entry.hw.sendQueue;
                Entry.Turtle.setModule(sq);
                const red = script.getNumberValue('RED');
                const green = script.getNumberValue('GREEN');
                const blue = script.getNumberValue('BLUE');
                sq.ledRed = sq.ledRed != undefined ? sq.ledRed + red : red;
                sq.ledGreen = sq.ledGreen != undefined ? sq.ledGreen + green : green;
                sq.ledBlue = sq.ledBlue != undefined ? sq.ledBlue + blue : blue;
                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Turtle.led_by(%1, %2, %3)',
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
        turtle_set_head_led_to_rgb: {
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
                type: 'turtle_set_head_led_to_rgb',
            },
            paramsKeyMap: {
                RED: 0,
                GREEN: 1,
                BLUE: 2,
            },
            class: 'turtle_led',
            isNotFor: ['turtle'],
            func(sprite, script) {
                const sq = Entry.hw.sendQueue;
                Entry.Turtle.setModule(sq);
                sq.ledRed = script.getNumberValue('RED');
                sq.ledGreen = script.getNumberValue('GREEN');
                sq.ledBlue = script.getNumberValue('BLUE');
                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Turtle.led(%1, %2, %3)',
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
        turtle_clear_head_led: {
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
                type: 'turtle_clear_head_led',
            },
            class: 'turtle_led',
            isNotFor: ['turtle'],
            func(sprite, script) {
                const sq = Entry.hw.sendQueue;
                Entry.Turtle.setModule(sq);
                sq.ledRed = 0;
                sq.ledGreen = 0;
                sq.ledBlue = 0;
                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Turtle.led(0)',
                    },
                ],
            },
        },
        turtle_play_sound_times: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
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
                    null,
                    {
                        type: 'text',
                        params: ['1'],
                    },
                    null,
                ],
                type: 'turtle_play_sound_times',
            },
            paramsKeyMap: {
                SOUND: 0,
                COUNT: 1,
            },
            class: 'turtle_sound',
            isNotFor: ['turtle'],
            func(sprite, script) {
                const sq = Entry.hw.sendQueue;
                Entry.Turtle.setModule(sq);
                sq.buzzer = 0;
                sq.note = 0;
                const sound = Number(script.getField('SOUND'));
                const count = script.getNumberValue('COUNT');
                if (count) {
                    Entry.Turtle.setSound(sq, sound, count);
                }
                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Turtle.sound(%1, %2)',
                        textParams: [
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
                                converter: Entry.block.converters.returnValuePartialUpperCase,
                                codeMap: 'Entry.CodeMap.Turtle.sounds',
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
        turtle_play_sound_times_until_done: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
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
                    null,
                    {
                        type: 'text',
                        params: ['1'],
                    },
                    null,
                ],
                type: 'turtle_play_sound_times_until_done',
            },
            paramsKeyMap: {
                SOUND: 0,
                COUNT: 1,
            },
            class: 'turtle_sound',
            isNotFor: ['turtle'],
            func(sprite, script) {
                const sq = Entry.hw.sendQueue;
                const pd = Entry.hw.portData;
                const turtle = Entry.Turtle;
                turtle.setModule(sq);
                if (!script.isStart) {
                    script.isStart = true;
                    sq.buzzer = 0;
                    sq.note = 0;
                    const sound = Number(script.getField('SOUND'));
                    const count = script.getNumberValue('COUNT');
                    if (count) {
                        turtle.setSound(sq, sound, count);
                        return script;
                    } else {
                        turtle.sound = 0;
                        turtle.soundRepeat = 1;
                        delete script.isStart;
                        Entry.engine.isContinue = false;
                        return script.callReturn();
                    }
                } else {
                    if (pd.soundStateId != turtle.soundStateId) {
                        turtle.soundStateId = pd.soundStateId;
                        if (pd.soundState == 0) {
                            delete script.isStart;
                            Entry.engine.isContinue = false;
                            return script.callReturn();
                        }
                    }
                    return script;
                }
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Turtle.sound_until_done(%1, %2)',
                        textParams: [
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
                                converter: Entry.block.converters.returnValuePartialUpperCase,
                                codeMap: 'Entry.CodeMap.Turtle.sounds',
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
        turtle_change_buzzer_by: {
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
                type: 'turtle_change_buzzer_by',
            },
            paramsKeyMap: {
                VALUE: 0,
            },
            class: 'turtle_sound',
            isNotFor: ['turtle'],
            func(sprite, script) {
                const sq = Entry.hw.sendQueue;
                Entry.Turtle.setModule(sq);
                const value = script.getNumberValue('VALUE');
                sq.buzzer = sq.buzzer != undefined ? sq.buzzer + value : value;
                sq.note = 0;
                Entry.Turtle.setSound(sq, 0);
                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Turtle.buzzer_by(%1)',
                    },
                ],
            },
        },
        turtle_set_buzzer_to: {
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
                type: 'turtle_set_buzzer_to',
            },
            paramsKeyMap: {
                VALUE: 0,
            },
            class: 'turtle_sound',
            isNotFor: ['turtle'],
            func(sprite, script) {
                const sq = Entry.hw.sendQueue;
                Entry.Turtle.setModule(sq);
                sq.buzzer = script.getNumberValue('VALUE');
                sq.note = 0;
                Entry.Turtle.setSound(sq, 0);
                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Turtle.buzzer(%1)',
                    },
                ],
            },
        },
        turtle_clear_sound: {
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
                type: 'turtle_clear_sound',
            },
            class: 'turtle_sound',
            isNotFor: ['turtle'],
            func(sprite, script) {
                const sq = Entry.hw.sendQueue;
                Entry.Turtle.setModule(sq);
                sq.buzzer = 0;
                sq.note = 0;
                Entry.Turtle.setSound(sq, 0);
                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Turtle.sound(0)',
                        params: [null],
                    },
                    {
                        syntax: 'Turtle.sound(Turtle.SOUND_OFF)',
                        params: [null],
                    },
                    {
                        syntax: 'Turtle.buzzer(0)',
                        params: [null],
                    },
                ],
            },
        },
        turtle_play_note: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [`${Lang.Blocks.turtle_note_c}`, '4'],
                        [`${Lang.Blocks.turtle_note_c}#`, '5'],
                        [`${Lang.Blocks.turtle_note_d}`, '6'],
                        [`${Lang.Blocks.turtle_note_e}b`, '7'],
                        [`${Lang.Blocks.turtle_note_e}`, '8'],
                        [`${Lang.Blocks.turtle_note_f}`, '9'],
                        [`${Lang.Blocks.turtle_note_f}#`, '10'],
                        [`${Lang.Blocks.turtle_note_g}`, '11'],
                        [`${Lang.Blocks.turtle_note_g}#`, '12'],
                        [`${Lang.Blocks.turtle_note_a}`, '13'],
                        [`${Lang.Blocks.turtle_note_b}b`, '14'],
                        [`${Lang.Blocks.turtle_note_b}`, '15'],
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
                params: [null, '4', null],
                type: 'turtle_play_note',
            },
            paramsKeyMap: {
                NOTE: 0,
                OCTAVE: 1,
            },
            class: 'turtle_sound',
            isNotFor: ['turtle'],
            func(sprite, script) {
                const sq = Entry.hw.sendQueue;
                let note = script.getNumberField('NOTE', script);
                const octave = script.getNumberField('OCTAVE', script);
                Entry.Turtle.setModule(sq);
                sq.buzzer = 0;
                note += (octave - 1) * 12;
                sq.note = note;
                Entry.Turtle.setSound(sq, 0);
                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Turtle.pitch(%1, %2)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [`${Lang.Blocks.turtle_note_c}`, '4'],
                                    [`${Lang.Blocks.turtle_note_c}#`, '5'],
                                    [`${Lang.Blocks.turtle_note_d}`, '6'],
                                    [`${Lang.Blocks.turtle_note_e}b`, '7'],
                                    [`${Lang.Blocks.turtle_note_e}`, '8'],
                                    [`${Lang.Blocks.turtle_note_f}`, '9'],
                                    [`${Lang.Blocks.turtle_note_f}#`, '10'],
                                    [`${Lang.Blocks.turtle_note_g}`, '11'],
                                    [`${Lang.Blocks.turtle_note_g}#`, '12'],
                                    [`${Lang.Blocks.turtle_note_a}`, '13'],
                                    [`${Lang.Blocks.turtle_note_b}b`, '14'],
                                    [`${Lang.Blocks.turtle_note_b}`, '15'],
                                ],
                                value: '4',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnValuePartialUpperCase,
                                codeMap: 'Entry.CodeMap.Turtle.notes',
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
        turtle_play_note_for_beats: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [`${Lang.Blocks.turtle_note_c}`, '4'],
                        [`${Lang.Blocks.turtle_note_c}#`, '5'],
                        [`${Lang.Blocks.turtle_note_d}`, '6'],
                        [`${Lang.Blocks.turtle_note_e}b`, '7'],
                        [`${Lang.Blocks.turtle_note_e}`, '8'],
                        [`${Lang.Blocks.turtle_note_f}`, '9'],
                        [`${Lang.Blocks.turtle_note_f}#`, '10'],
                        [`${Lang.Blocks.turtle_note_g}`, '11'],
                        [`${Lang.Blocks.turtle_note_g}#`, '12'],
                        [`${Lang.Blocks.turtle_note_a}`, '13'],
                        [`${Lang.Blocks.turtle_note_b}b`, '14'],
                        [`${Lang.Blocks.turtle_note_b}`, '15'],
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
                    null,
                    '4',
                    {
                        type: 'text',
                        params: ['0.5'],
                    },
                    null,
                ],
                type: 'turtle_play_note_for_beats',
            },
            paramsKeyMap: {
                NOTE: 0,
                OCTAVE: 1,
                VALUE: 2,
            },
            class: 'turtle_sound',
            isNotFor: ['turtle'],
            func(sprite, script) {
                const sq = Entry.hw.sendQueue;
                const turtle = Entry.Turtle;
                turtle.setModule(sq);
                if (!script.isStart) {
                    let note = script.getNumberField('NOTE', script);
                    const octave = script.getNumberField('OCTAVE', script);
                    const beat = script.getNumberValue('VALUE', script);
                    note += (octave - 1) * 12;
                    const timeValue = (beat * 60 * 1000) / turtle.tempo;
                    script.isStart = true;
                    script.timeFlag = 1;
                    sq.buzzer = 0;
                    sq.note = note;
                    turtle.setSound(sq, 0);
                    if (timeValue > 100) {
                        var timer1 = setTimeout(() => {
                            sq.note = 0;
                            turtle.removeTimeout(timer1);
                        }, timeValue - 100);
                        turtle.timeouts.push(timer1);
                    }
                    var timer2 = setTimeout(() => {
                        script.timeFlag = 0;
                        turtle.removeTimeout(timer2);
                    }, timeValue);
                    turtle.timeouts.push(timer2);
                    return script;
                } else if (script.timeFlag == 1) {
                    return script;
                } else {
                    delete script.isStart;
                    delete script.timeFlag;
                    Entry.engine.isContinue = false;
                    sq.note = 0;
                    return script.callReturn();
                }
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Turtle.note(%1, %2, %3)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [`${Lang.Blocks.turtle_note_c}`, '4'],
                                    [`${Lang.Blocks.turtle_note_c}#`, '5'],
                                    [`${Lang.Blocks.turtle_note_d}`, '6'],
                                    [`${Lang.Blocks.turtle_note_e}b`, '7'],
                                    [`${Lang.Blocks.turtle_note_e}`, '8'],
                                    [`${Lang.Blocks.turtle_note_f}`, '9'],
                                    [`${Lang.Blocks.turtle_note_f}#`, '10'],
                                    [`${Lang.Blocks.turtle_note_g}`, '11'],
                                    [`${Lang.Blocks.turtle_note_g}#`, '12'],
                                    [`${Lang.Blocks.turtle_note_a}`, '13'],
                                    [`${Lang.Blocks.turtle_note_b}b`, '14'],
                                    [`${Lang.Blocks.turtle_note_b}`, '15'],
                                ],
                                value: '4',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnValuePartialUpperCase,
                                codeMap: 'Entry.CodeMap.Turtle.notes',
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
        turtle_rest_for_beats: {
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
                type: 'turtle_rest_for_beats',
            },
            paramsKeyMap: {
                VALUE: 0,
            },
            class: 'turtle_sound',
            isNotFor: ['turtle'],
            func(sprite, script) {
                const sq = Entry.hw.sendQueue;
                const turtle = Entry.Turtle;
                turtle.setModule(sq);
                if (!script.isStart) {
                    script.isStart = true;
                    script.timeFlag = 1;
                    let timeValue = script.getNumberValue('VALUE');
                    timeValue = (timeValue * 60 * 1000) / turtle.tempo;
                    sq.buzzer = 0;
                    sq.note = 0;
                    turtle.setSound(sq, 0);
                    var timer = setTimeout(() => {
                        script.timeFlag = 0;
                        turtle.removeTimeout(timer);
                    }, timeValue);
                    turtle.timeouts.push(timer);
                    return script;
                } else if (script.timeFlag == 1) {
                    return script;
                } else {
                    delete script.isStart;
                    delete script.timeFlag;
                    Entry.engine.isContinue = false;
                    return script.callReturn();
                }
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Turtle.note(0, %1)',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                        ],
                        keyOption: '0',
                    },
                    {
                        syntax: 'Turtle.note(Turtle.NOTE_OFF, %1)',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                        ],
                        keyOption: 'Turtle.NOTE_OFF',
                    },
                ],
            },
        },
        turtle_change_tempo_by: {
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
                type: 'turtle_change_tempo_by',
            },
            paramsKeyMap: {
                VALUE: 0,
            },
            class: 'turtle_sound',
            isNotFor: ['turtle'],
            func(sprite, script) {
                const turtle = Entry.Turtle;
                turtle.setModule(Entry.hw.sendQueue);
                turtle.tempo += script.getNumberValue('VALUE');
                if (turtle.tempo < 1) {
                    turtle.tempo = 1;
                }
                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Turtle.tempo_by(%1)',
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
        turtle_set_tempo_to: {
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
                type: 'turtle_set_tempo_to',
            },
            paramsKeyMap: {
                VALUE: 0,
            },
            class: 'turtle_sound',
            isNotFor: ['turtle'],
            func(sprite, script) {
                const turtle = Entry.Turtle;
                turtle.setModule(Entry.hw.sendQueue);
                turtle.tempo = script.getNumberValue('VALUE');
                if (turtle.tempo < 1) {
                    turtle.tempo = 1;
                }
                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Turtle.tempo(%1)',
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
        //endregion turtle 터틀
    };
};

module.exports = Entry.Turtle;
