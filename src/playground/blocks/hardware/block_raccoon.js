'use strict';

Entry.Raccoon = {
    id: '2.30',
    name: 'raccoon',
    url: 'http://www.robomation.net',
    imageName: 'raccoon.png',
    title: {
        ko: '라쿤',
        en: 'Raccoon',
        jp: 'ラクーン',
        vn: 'Raccoon',
    },
    setZero() {
        Entry.Robomation.setZero();
    },
    afterReceive(pd) {
        Entry.Robomation.afterReceive(pd, false);
        const robot = Entry.Robomation.getRobot('raccoon', 0);
        if (robot && robot.hasButtonEvent && robot.hasButtonEvent()) {
            Entry.engine.fireEvent('raccoonWhenButtonState');
        }
        if (robot && robot.hasConveyorButtonEvent && robot.hasConveyorButtonEvent()) {
            Entry.engine.fireEvent('raccoonConveyorWhenButtonState');
        }
    },
    afterSend(sq) {
        Entry.Robomation.afterSend(sq);
    },
    getRobot() {
        const robot = Entry.Robomation.getRobot('raccoon', 0);
        if (robot) {
            robot.setMotoring(Entry.hw.sendQueue);
        }
        return robot;
    },
    monitorTemplate: {
        imgPath: 'hw/raccoon.png',
        width: 256,
        height: 256,
        listPorts: {
            signalStrength: {
                name: Lang.Blocks.raccoon_sensor_signal_strength,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            batteryState: {
                name: Lang.Blocks.raccoon_sensor_battery,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            encoder1: {
                name: Lang.Blocks.raccoon_sensor_encoder1,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            encoder2: {
                name: Lang.Blocks.raccoon_sensor_encoder2,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            encoder3: {
                name: Lang.Blocks.raccoon_sensor_encoder3,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            encoder4: {
                name: Lang.Blocks.raccoon_sensor_encoder4,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
        },
        ports: {},
        mode: 'both',
    },
};

Entry.Raccoon.setLanguage = () => ({
    ko: {
        template: {
            raccoon_return_to_basic_pose: '기본 자세로 돌아가기 %1',
            raccoon_change_joint_angles_by: '관절 각도를 1: %1 2: %2 3: %3 4: %4 만큼 바꾸기 %5',
            raccoon_change_joint_angles_by_until:
                '관절 각도를 1: %1 2: %2 3: %3 4: %4 만큼 바꾸고 기다리기 %5',
            raccoon_set_joint_angles_to: '관절 각도를 1: %1 2: %2 3: %3 4: %4 도로 정하기 %5',
            raccoon_set_joint_angles_to_until:
                '관절 각도를 1: %1 2: %2 3: %3 4: %4 도로 정하고 기다리기 %5',
            raccoon_change_angle_by: '%1 관절 각도를 %2 만큼 바꾸기 %3',
            raccoon_change_angle_by_until: '%1 관절 각도를 %2 만큼 바꾸고 기다리기 %3',
            raccoon_set_angle_to: '%1 관절 각도를 %2 도로 정하기 %3',
            raccoon_set_angle_to_until: '%1 관절 각도를 %2 도로 정하고 기다리기 %3',
            raccoon_change_position_by_xyz: '위치를 x: %1 y: %2 z: %3 %4 만큼 바꾸기 %5',
            raccoon_change_position_by_xyz_until:
                '위치를 x: %1 y: %2 z: %3 %4 만큼 바꾸고 기다리기 %5',
            raccoon_set_position_to_xyz: '위치를 x: %1 y: %2 z: %3 %4 로 정하기 %5',
            raccoon_set_position_to_xyz_until:
                '위치를 x: %1 y: %2 z: %3 %4 로 정하고 기다리기 %5',
            raccoon_change_position_by: '위치 %1 를 %2 %3 만큼 바꾸고 기다리기 %4',
            raccoon_set_position_to: '위치 %1 를 %2 %3 로 정하고 기다리기 %4',
            raccoon_set_position_ref_to: '위치 기준을 %1 (으)로 정하기 %2',
            raccoon_change_position_ref_by_front_up: '위치 기준을 %1 %2 %3 %4 %5 만큼 바꾸기 %6',
            raccoon_set_position_ref_to_front_up: '위치 기준을 %1 %2 %3 %4 %5 로 정하기 %6',
            raccoon_change_joint_velocities_by:
                '관절 속도를 1: %1 2: %2 3: %3 4: %4 만큼 바꾸기 %5',
            raccoon_set_joint_velocities_to: '관절 속도를 1: %1 2: %2 3: %3 4: %4 %로 정하기 %5',
            raccoon_change_velocity_by: '%1 관절 속도를 %2 만큼 바꾸기 %3',
            raccoon_set_velocity_to: '%1 관절 속도를 %2 %로 정하기 %3',
            raccoon_stop: '%1 관절 정지하기 %2',
            raccoon_turn_off: '%1 관절 전원 끄기 %2',
            raccoon_turn_precision_mode: '정밀 모드 %1 %2',
            raccoon_is_moving: '움직이는 중인가?',
            raccoon_with_gripper: '그리퍼 %1 %2',
            raccoon_lock_gripper: '그리퍼 %1 으로 고정하기 %2',
            raccoon_lock_gripper_until: '그리퍼 %1 으로 고정하고 기다리기 %2',
            raccoon_unlock_gripper: '그리퍼 고정 해제하기 %1',
            raccoon_gripper_state: '그리퍼 상태',
            raccoon_play_sound: '%1 소리 재생하기 %2',
            raccoon_play_sound_times: '%1 소리 %2 번 재생하기 %3',
            raccoon_play_sound_until: '%1 소리 %2 번 재생하고 기다리기 %3',
            raccoon_clear_sound: '소리 끄기 %1',
            raccoon_play_note: '%1 %2 음을 연주하기 %3',
            raccoon_play_note_beat: '%1 %2 음을 %3 박자 연주하기 %4',
            raccoon_rest_beat: '%1 박자 쉬기 %2',
            raccoon_change_tempo: '연주 속도를 %1 만큼 바꾸기 %2',
            raccoon_set_tempo: '연주 속도를 %1 BPM으로 정하기 %2',
            raccoon_is_sound_playing: '소리 내는 중인가?',
            raccoon_encoder1: '1번째 관절 각도',
            raccoon_encoder2: '2번째 관절 각도',
            raccoon_encoder3: '3번째 관절 각도',
            raccoon_encoder4: '4번째 관절 각도',
            raccoon_position_x: '위치 x (cm)',
            raccoon_position_y: '위치 y (cm)',
            raccoon_position_z: '위치 z (cm)',
            raccoon_position_x_inch: '위치 x (인치)',
            raccoon_position_y_inch: '위치 y (인치)',
            raccoon_position_z_inch: '위치 z (인치)',
            raccoon_teach_button: '티치 버튼',
            raccoon_play_button: '재생 버튼',
            raccoon_delete_button: '삭제 버튼',
            raccoon_signal_strength: '신호 세기',
            raccoon_when_button_state: '%1 %2 버튼을 %3 때',
            raccoon_button_state: '%1 버튼을 %2?',
            raccoon_battery_state: '배터리 %1?',
            raccoon_charging: '충전 중?',
            raccoon_conveyor_move: '컨베이어 %1 % 속도로 %2 %3 이동하기 %4',
            raccoon_conveyor_change_velocity: '컨베이어 속도를 %1 만큼 바꾸기 %2',
            raccoon_conveyor_set_velocity: '컨베이어 속도를 %1 %로 정하기 %2',
            raccoon_conveyor_stop: '컨베이어 정지하기 %1',
            raccoon_conveyor_moving: '컨베이어 움직이는 중인가?',
            raccoon_conveyor_button: '컨베이어 버튼',
            raccoon_conveyor_when_button_state: '%1 컨베이어 버튼을 %2 때',
            raccoon_conveyor_button_state: '컨베이어 버튼을 %1?',
        },
        Blocks: {
            raccoon_joint_1: '1번째',
            raccoon_joint_2: '2번째',
            raccoon_joint_3: '3번째',
            raccoon_joint_4: '4번째',
            raccoon_joint_all: '모든',
            raccoon_unit_cm: 'cm',
            raccoon_unit_inches: '인치',
            raccoon_axis_x: 'x',
            raccoon_axis_y: 'y',
            raccoon_axis_z: 'z',
            raccoon_ref_wrist: '손목',
            raccoon_ref_gripper: '그리퍼',
            raccoon_front: '앞쪽',
            raccoon_rear: '뒤쪽',
            raccoon_up: '위쪽',
            raccoon_down: '아래쪽',
            raccoon_on: '켜기',
            raccoon_off: '끄기',
            raccoon_gripper_place: '놓기 (열기)',
            raccoon_gripper_pick: '집기 (닫기)',
            raccoon_horizontal: '수평',
            raccoon_vertical: '수직',
            raccoon_sound_beep: '삐',
            raccoon_sound_random_beep: '무작위 삐',
            raccoon_sound_noise: '지지직',
            raccoon_sound_siren: '사이렌',
            raccoon_sound_engine: '엔진',
            raccoon_sound_chop: '쩝',
            raccoon_sound_robot: '로봇',
            raccoon_sound_dibidibidip: '디비디비딥',
            raccoon_sound_good_job: '잘 했어요',
            raccoon_sound_random_melody: '무작위 멜로디',
            raccoon_sound_wake_up: '일어나요',
            raccoon_sound_start: '시작',
            raccoon_sound_bye: '잘가요',
            raccoon_note_c: '도',
            raccoon_note_cs: '도♯ (레♭)',
            raccoon_note_d: '레',
            raccoon_note_ds: '레♯ (미♭)',
            raccoon_note_e: '미',
            raccoon_note_f: '파',
            raccoon_note_fs: '파♯ (솔♭)',
            raccoon_note_g: '솔',
            raccoon_note_gs: '솔♯ (라♭)',
            raccoon_note_a: '라',
            raccoon_note_as: '라♯ (시♭)',
            raccoon_note_b: '시',
            raccoon_button_teach: '티치',
            raccoon_button_play: '재생',
            raccoon_button_delete: '삭제',
            raccoon_state_pressed: '눌렀을',
            raccoon_state_released: '떼었을',
            raccoon_state_clicked: '클릭했을',
            raccoon_state_long_pressed: '오래 눌렀을',
            raccoon_bstate_pressed: '눌렀는가',
            raccoon_bstate_released: '떼었는가',
            raccoon_bstate_clicked: '클릭했는가',
            raccoon_bstate_long_pressed: '오래 눌렀는가',
            raccoon_battery_normal: '정상',
            raccoon_battery_low: '부족',
            raccoon_battery_empty: '없음',
            raccoon_sensor_signal_strength: '신호 세기',
            raccoon_sensor_battery: '배터리',
            raccoon_sensor_encoder1: '1번째 관절 각도',
            raccoon_sensor_encoder2: '2번째 관절 각도',
            raccoon_sensor_encoder3: '3번째 관절 각도',
            raccoon_sensor_encoder4: '4번째 관절 각도',
            raccoon_conveyor_unit_cm: 'cm',
            raccoon_conveyor_unit_mm: 'mm',
            raccoon_conveyor_unit_inches: '인치',
            raccoon_conveyor_unit_seconds: '초',
        },
        Msgs: {
            raccoon_unreachable_pose_title: '라쿤: 팔이 갈 수 없는 자세입니다',
            raccoon_unreachable_pose:
                '팔이 그 자세에 도달할 수 없어서 이 블록을 건너뛰었습니다. 값을 줄여 다시 시도해 보세요.',
            raccoon_delay_too_long_title: '라쿤: 기다리는 시간이 너무 깁니다',
            raccoon_delay_too_long: '입력한 값만큼 기다릴 수 없어 최대 시간으로 조정되었습니다. 값을 줄여 주세요.',
        },
    },
    en: {
        template: {
            raccoon_return_to_basic_pose: 'return to basic pose %1',
            raccoon_change_joint_angles_by: 'change joint angles by 1: %1 2: %2 3: %3 4: %4 %5',
            raccoon_change_joint_angles_by_until:
                'change and wait joint angles by 1: %1 2: %2 3: %3 4: %4 %5',
            raccoon_set_joint_angles_to:
                'set joint angles to 1: %1 2: %2 3: %3 4: %4 degrees %5',
            raccoon_set_joint_angles_to_until:
                'set and wait joint angles to 1: %1 2: %2 3: %3 4: %4 degrees %5',
            raccoon_change_angle_by: 'change %1 angle by %2 %3',
            raccoon_change_angle_by_until: 'change and wait %1 angle by %2 %3',
            raccoon_set_angle_to: 'set %1 angle to %2 degrees %3',
            raccoon_set_angle_to_until: 'set and wait %1 angle to %2 degrees %3',
            raccoon_change_position_by_xyz: 'change position by x: %1 y: %2 z: %3 %4 %5',
            raccoon_change_position_by_xyz_until:
                'change and wait position by x: %1 y: %2 z: %3 %4 %5',
            raccoon_set_position_to_xyz: 'set position to x: %1 y: %2 z: %3 %4 %5',
            raccoon_set_position_to_xyz_until:
                'set and wait position to x: %1 y: %2 z: %3 %4 %5',
            raccoon_change_position_by: 'change and wait position %1 by %2 %3 %4',
            raccoon_set_position_to: 'set and wait position %1 to %2 %3 %4',
            raccoon_set_position_ref_to: 'set position reference to %1 %2',
            raccoon_change_position_ref_by_front_up:
                'change position reference by %1 %2 %3 %4 %5 %6',
            raccoon_set_position_ref_to_front_up:
                'set position reference to %1 %2 %3 %4 %5 %6',
            raccoon_change_joint_velocities_by:
                'change joint velocities by 1: %1 2: %2 3: %3 4: %4 %5',
            raccoon_set_joint_velocities_to:
                'set joint velocities to 1: %1 2: %2 3: %3 4: %4 % %5',
            raccoon_change_velocity_by: 'change %1 velocity by %2 %3',
            raccoon_set_velocity_to: 'set %1 velocity to %2 % %3',
            raccoon_stop: 'stop %1 %2',
            raccoon_turn_off: 'turn off %1 %2',
            raccoon_turn_precision_mode: '%1 precision mode %2',
            raccoon_is_moving: 'moving?',
            raccoon_with_gripper: '%1 gripper %2',
            raccoon_lock_gripper: 'lock gripper %1 %2',
            raccoon_lock_gripper_until: 'lock and wait gripper %1 %2',
            raccoon_unlock_gripper: 'unlock gripper %1',
            raccoon_gripper_state: 'gripper state',
            raccoon_play_sound: 'play sound %1 %2',
            raccoon_play_sound_times: 'play sound %1 %2 times %3',
            raccoon_play_sound_until: 'play and wait sound %1 %2 times %3',
            raccoon_clear_sound: 'stop sound %1',
            raccoon_play_note: 'play note %1 %2 %3',
            raccoon_play_note_beat: 'play note %1 %2 for %3 beats %4',
            raccoon_rest_beat: 'rest for %1 beats %2',
            raccoon_change_tempo: 'change tempo by %1 %2',
            raccoon_set_tempo: 'set tempo to %1 bpm %2',
            raccoon_is_sound_playing: 'sound playing?',
            raccoon_encoder1: 'joint 1 angle',
            raccoon_encoder2: 'joint 2 angle',
            raccoon_encoder3: 'joint 3 angle',
            raccoon_encoder4: 'joint 4 angle',
            raccoon_position_x: 'position x (cm)',
            raccoon_position_y: 'position y (cm)',
            raccoon_position_z: 'position z (cm)',
            raccoon_position_x_inch: 'position x (inches)',
            raccoon_position_y_inch: 'position y (inches)',
            raccoon_position_z_inch: 'position z (inches)',
            raccoon_teach_button: 'teach button',
            raccoon_play_button: 'play button',
            raccoon_delete_button: 'delete button',
            raccoon_signal_strength: 'signal strength',
            raccoon_when_button_state: '%1 when %2 button %3',
            raccoon_button_state: '%1 button %2?',
            raccoon_battery_state: 'battery %1?',
            raccoon_charging: 'charging?',
            raccoon_conveyor_move: 'move conveyor %2 %3 at %1 % speed %4',
            raccoon_conveyor_change_velocity: 'change conveyor velocity by %1 %2',
            raccoon_conveyor_set_velocity: 'set conveyor velocity to %1 % %2',
            raccoon_conveyor_stop: 'stop conveyor %1',
            raccoon_conveyor_moving: 'conveyor moving?',
            raccoon_conveyor_button: 'conveyor button',
            raccoon_conveyor_when_button_state: '%1 when conveyor button %2',
            raccoon_conveyor_button_state: 'conveyor button %1?',
        },
        Blocks: {
            raccoon_joint_1: 'joint 1',
            raccoon_joint_2: 'joint 2',
            raccoon_joint_3: 'joint 3',
            raccoon_joint_4: 'joint 4',
            raccoon_joint_all: 'all joint',
            raccoon_unit_cm: 'cm',
            raccoon_unit_inches: 'inches',
            raccoon_axis_x: 'x',
            raccoon_axis_y: 'y',
            raccoon_axis_z: 'z',
            raccoon_ref_wrist: 'wrist',
            raccoon_ref_gripper: 'gripper',
            raccoon_front: 'front',
            raccoon_rear: 'rear',
            raccoon_up: 'up',
            raccoon_down: 'down',
            raccoon_on: 'turn on',
            raccoon_off: 'turn off',
            raccoon_gripper_place: 'place (open)',
            raccoon_gripper_pick: 'pick (close)',
            raccoon_horizontal: 'horizontally',
            raccoon_vertical: 'vertically',
            raccoon_sound_beep: 'beep',
            raccoon_sound_random_beep: 'random beep',
            raccoon_sound_noise: 'noise',
            raccoon_sound_siren: 'siren',
            raccoon_sound_engine: 'engine',
            raccoon_sound_chop: 'chop',
            raccoon_sound_robot: 'robot',
            raccoon_sound_dibidibidip: 'dibidibidip',
            raccoon_sound_good_job: 'good job',
            raccoon_sound_random_melody: 'random melody',
            raccoon_sound_wake_up: 'wake up',
            raccoon_sound_start: 'start',
            raccoon_sound_bye: 'bye',
            raccoon_note_c: 'C',
            raccoon_note_cs: 'C♯ (D♭)',
            raccoon_note_d: 'D',
            raccoon_note_ds: 'D♯ (E♭)',
            raccoon_note_e: 'E',
            raccoon_note_f: 'F',
            raccoon_note_fs: 'F♯ (G♭)',
            raccoon_note_g: 'G',
            raccoon_note_gs: 'G♯ (A♭)',
            raccoon_note_a: 'A',
            raccoon_note_as: 'A♯ (B♭)',
            raccoon_note_b: 'B',
            raccoon_button_teach: 'teach',
            raccoon_button_play: 'play',
            raccoon_button_delete: 'delete',
            raccoon_state_pressed: 'pressed',
            raccoon_state_released: 'released',
            raccoon_state_clicked: 'clicked',
            raccoon_state_long_pressed: 'long-pressed',
            raccoon_bstate_pressed: 'pressed',
            raccoon_bstate_released: 'released',
            raccoon_bstate_clicked: 'clicked',
            raccoon_bstate_long_pressed: 'long-pressed',
            raccoon_battery_normal: 'normal',
            raccoon_battery_low: 'low',
            raccoon_battery_empty: 'empty',
            raccoon_sensor_signal_strength: 'signal strength',
            raccoon_sensor_battery: 'battery',
            raccoon_sensor_encoder1: 'joint 1 angle',
            raccoon_sensor_encoder2: 'joint 2 angle',
            raccoon_sensor_encoder3: 'joint 3 angle',
            raccoon_sensor_encoder4: 'joint 4 angle',
            raccoon_conveyor_unit_cm: 'cm',
            raccoon_conveyor_unit_mm: 'mm',
            raccoon_conveyor_unit_inches: 'inches',
            raccoon_conveyor_unit_seconds: 'seconds',
        },
        Msgs: {
            raccoon_unreachable_pose_title: 'Raccoon: the arm cannot reach this pose',
            raccoon_unreachable_pose:
                'This block was skipped because the arm cannot reach that pose. Try a smaller value.',
            raccoon_delay_too_long_title: 'Raccoon: the wait is too long',
            raccoon_delay_too_long: 'The wait you asked for is longer than possible, so it was shortened. Try a smaller value.',
        },
    },
    jp: {
        template: {
            raccoon_return_to_basic_pose: '基本姿勢に戻る %1',
            raccoon_change_joint_angles_by: '関節の角度を 1:%1 2:%2 3:%3 4:%4 ずつ変える %5',
            raccoon_change_joint_angles_by_until:
                '関節の角度を 1:%1 2:%2 3:%3 4:%4 ずつ変えて待つ %5',
            raccoon_set_joint_angles_to: '関節の角度を 1:%1 2:%2 3:%3 4:%4 度にする %5',
            raccoon_set_joint_angles_to_until:
                '関節の角度を 1:%1 2:%2 3:%3 4:%4 度にして待つ %5',
            raccoon_change_angle_by: '%1 関節の角度を %2 ずつ変える %3',
            raccoon_change_angle_by_until: '%1 関節の角度を %2 ずつ変えて待つ %3',
            raccoon_set_angle_to: '%1 関節の角度を %2 度にする %3',
            raccoon_set_angle_to_until: '%1 関節の角度を %2 度にして待つ %3',
            raccoon_change_position_by_xyz: '位置を x:%1 y:%2 z:%3 %4 ずつ変える %5',
            raccoon_change_position_by_xyz_until:
                '位置を x:%1 y:%2 z:%3 %4 ずつ変えて待つ %5',
            raccoon_set_position_to_xyz: '位置を x:%1 y:%2 z:%3 %4 にする %5',
            raccoon_set_position_to_xyz_until: '位置を x:%1 y:%2 z:%3 %4 にして待つ %5',
            raccoon_change_position_by: '位置 %1 を %2 %3 ずつ変えて待つ %4',
            raccoon_set_position_to: '位置 %1 を %2 %3 にして待つ %4',
            raccoon_set_position_ref_to: '位置基準を %1 にする %2',
            raccoon_change_position_ref_by_front_up: '位置基準を %1 %2 %3 %4 %5 ずつ変える %6',
            raccoon_set_position_ref_to_front_up: '位置基準を %1 %2 %3 %4 %5 にする %6',
            raccoon_change_joint_velocities_by:
                '関節の速さを 1:%1 2:%2 3:%3 4:%4 ずつ変える %5',
            raccoon_set_joint_velocities_to: '関節の速さを 1:%1 2:%2 3:%3 4:%4 %にする %5',
            raccoon_change_velocity_by: '%1 関節の速さを %2 ずつ変える %3',
            raccoon_set_velocity_to: '%1 関節の速さを %2 %にする %3',
            raccoon_stop: '%1 関節を停止する %2',
            raccoon_turn_off: '%1 関節の電源をオフにする %2',
            raccoon_turn_precision_mode: '精密モードを %1 %2',
            raccoon_is_moving: '動かしているか?',
            raccoon_with_gripper: 'グリッパー %1 %2',
            raccoon_lock_gripper: 'グリッパーを %1 方向に固定する %2',
            raccoon_lock_gripper_until: 'グリッパーを %1 方向に固定して待つ %2',
            raccoon_unlock_gripper: 'グリッパーの固定を解除する %1',
            raccoon_gripper_state: 'グリッパーの状態',
            raccoon_play_sound: '%1 音を再生する %2',
            raccoon_play_sound_times: '%1 音を %2 回再生する %3',
            raccoon_play_sound_until: '%1 音を %2 回再生して待つ %3',
            raccoon_clear_sound: '音をオフにする %1',
            raccoon_play_note: '%1 %2 音を奏でる %3',
            raccoon_play_note_beat: '%1 %2 音を %3 拍子奏でる %4',
            raccoon_rest_beat: '%1 拍子止める %2',
            raccoon_change_tempo: '演奏の速さを %1 ずつ変える %2',
            raccoon_set_tempo: '演奏の速さを %1 BPMにする %2',
            raccoon_is_sound_playing: '音を出しているか?',
            raccoon_encoder1: '1番目の関節角度',
            raccoon_encoder2: '2番目の関節角度',
            raccoon_encoder3: '3番目の関節角度',
            raccoon_encoder4: '4番目の関節角度',
            raccoon_position_x: '位置x(cm)',
            raccoon_position_y: '位置y(cm)',
            raccoon_position_z: '位置z(cm)',
            raccoon_position_x_inch: '位置x(インチ)',
            raccoon_position_y_inch: '位置y(インチ)',
            raccoon_position_z_inch: '位置z(インチ)',
            raccoon_teach_button: 'ティーチボタン',
            raccoon_play_button: '再生ボタン',
            raccoon_delete_button: '削除ボタン',
            raccoon_signal_strength: '信号強度',
            raccoon_when_button_state: '%1 %2 ボタンを %3 とき',
            raccoon_button_state: '%1 ボタンを %2?',
            raccoon_battery_state: '電池充電が %1?',
            raccoon_charging: '充電中?',
            raccoon_conveyor_move: 'コンベヤーを %1 %速度に %2 %3 移動する %4',
            raccoon_conveyor_change_velocity: 'コンベヤーの速さを %1 ずつ変える %2',
            raccoon_conveyor_set_velocity: 'コンベヤーの速さを %1 %にする %2',
            raccoon_conveyor_stop: 'コンベヤーを停止する %1',
            raccoon_conveyor_moving: 'コンベヤーを動かしているか?',
            raccoon_conveyor_button: 'コンベヤーボタン',
            raccoon_conveyor_when_button_state: '%1 コンベヤーボタンを %2 とき',
            raccoon_conveyor_button_state: 'コンベヤーボタンを %1?',
        },
        Blocks: {
            raccoon_joint_1: '1番目',
            raccoon_joint_2: '2番目',
            raccoon_joint_3: '3番目',
            raccoon_joint_4: '4番目',
            raccoon_joint_all: 'すべて',
            raccoon_unit_cm: 'cm',
            raccoon_unit_inches: 'インチ',
            raccoon_axis_x: 'x',
            raccoon_axis_y: 'y',
            raccoon_axis_z: 'z',
            raccoon_ref_wrist: '手首',
            raccoon_ref_gripper: 'グリッパー',
            raccoon_front: '前',
            raccoon_rear: '後',
            raccoon_up: '上',
            raccoon_down: '下',
            raccoon_on: 'オンにする',
            raccoon_off: 'オフにする',
            raccoon_gripper_place: 'おく(開く)',
            raccoon_gripper_pick: 'ひろう(閉める)',
            raccoon_horizontal: '水平',
            raccoon_vertical: '垂直',
            raccoon_sound_beep: 'ビープ',
            raccoon_sound_random_beep: 'ランダムビープ',
            raccoon_sound_noise: 'ノイズ',
            raccoon_sound_siren: 'サイレン',
            raccoon_sound_engine: 'エンジン',
            raccoon_sound_chop: 'チョップ',
            raccoon_sound_robot: 'ロボット',
            raccoon_sound_dibidibidip: 'ディバディバディップ',
            raccoon_sound_good_job: 'よくできました',
            raccoon_sound_random_melody: 'ランダムメロディ',
            raccoon_sound_wake_up: '起きろ',
            raccoon_sound_start: '再開',
            raccoon_sound_bye: 'さよなら',
            raccoon_note_c: 'ド',
            raccoon_note_cs: 'ド♯ (レ♭)',
            raccoon_note_d: 'レ',
            raccoon_note_ds: 'レ♯ (ミ♭)',
            raccoon_note_e: 'ミ',
            raccoon_note_f: 'ファ',
            raccoon_note_fs: 'ファ♯ (ソ♭)',
            raccoon_note_g: 'ソ',
            raccoon_note_gs: 'ソ♯ (ラ♭)',
            raccoon_note_a: 'ラ',
            raccoon_note_as: 'ラ♯ (シ♭)',
            raccoon_note_b: 'シ',
            raccoon_button_teach: 'ティーチ',
            raccoon_button_play: '再生',
            raccoon_button_delete: '削除',
            raccoon_state_pressed: '押した',
            raccoon_state_released: '離した',
            raccoon_state_clicked: 'クリックした',
            raccoon_state_long_pressed: '長く押した',
            raccoon_bstate_pressed: '押したか',
            raccoon_bstate_released: '離したか',
            raccoon_bstate_clicked: 'クリックしたか',
            raccoon_bstate_long_pressed: '長く押したか',
            raccoon_battery_normal: '正常か',
            raccoon_battery_low: '不足しているか',
            raccoon_battery_empty: 'なくなったか',
            raccoon_sensor_signal_strength: '信号強度',
            raccoon_sensor_battery: '電池',
            raccoon_sensor_encoder1: '1番目の関節角度',
            raccoon_sensor_encoder2: '2番目の関節角度',
            raccoon_sensor_encoder3: '3番目の関節角度',
            raccoon_sensor_encoder4: '4番目の関節角度',
            raccoon_conveyor_unit_cm: 'cm',
            raccoon_conveyor_unit_mm: 'mm',
            raccoon_conveyor_unit_inches: 'インチ',
            raccoon_conveyor_unit_seconds: '秒',
        },
        Msgs: {
            raccoon_unreachable_pose_title: 'ラクーン: アームが届かない姿勢です',
            raccoon_unreachable_pose:
                'アームがその姿勢に届かないため、このブロックをとばしました。値を小さくしてもう一度試してください。',
            raccoon_delay_too_long_title: 'ラクーン: 待ち時間が長すぎます',
            raccoon_delay_too_long: '入力した分だけ待てないため、最大時間に調整されました。値を小さくしてください。',
        },
    },
    vn: {
        template: {
            raccoon_return_to_basic_pose: 'return to basic pose %1',
            raccoon_change_joint_angles_by: 'change joint angles by 1: %1 2: %2 3: %3 4: %4 %5',
            raccoon_change_joint_angles_by_until:
                'change and wait joint angles by 1: %1 2: %2 3: %3 4: %4 %5',
            raccoon_set_joint_angles_to:
                'set joint angles to 1: %1 2: %2 3: %3 4: %4 degrees %5',
            raccoon_set_joint_angles_to_until:
                'set and wait joint angles to 1: %1 2: %2 3: %3 4: %4 degrees %5',
            raccoon_change_angle_by: 'change %1 angle by %2 %3',
            raccoon_change_angle_by_until: 'change and wait %1 angle by %2 %3',
            raccoon_set_angle_to: 'set %1 angle to %2 degrees %3',
            raccoon_set_angle_to_until: 'set and wait %1 angle to %2 degrees %3',
            raccoon_change_position_by_xyz: 'change position by x: %1 y: %2 z: %3 %4 %5',
            raccoon_change_position_by_xyz_until:
                'change and wait position by x: %1 y: %2 z: %3 %4 %5',
            raccoon_set_position_to_xyz: 'set position to x: %1 y: %2 z: %3 %4 %5',
            raccoon_set_position_to_xyz_until:
                'set and wait position to x: %1 y: %2 z: %3 %4 %5',
            raccoon_change_position_by: 'change and wait position %1 by %2 %3 %4',
            raccoon_set_position_to: 'set and wait position %1 to %2 %3 %4',
            raccoon_set_position_ref_to: 'set position reference to %1 %2',
            raccoon_change_position_ref_by_front_up:
                'change position reference by %1 %2 %3 %4 %5 %6',
            raccoon_set_position_ref_to_front_up:
                'set position reference to %1 %2 %3 %4 %5 %6',
            raccoon_change_joint_velocities_by:
                'change joint velocities by 1: %1 2: %2 3: %3 4: %4 %5',
            raccoon_set_joint_velocities_to:
                'set joint velocities to 1: %1 2: %2 3: %3 4: %4 % %5',
            raccoon_change_velocity_by: 'change %1 velocity by %2 %3',
            raccoon_set_velocity_to: 'set %1 velocity to %2 % %3',
            raccoon_stop: 'stop %1 %2',
            raccoon_turn_off: 'turn off %1 %2',
            raccoon_turn_precision_mode: '%1 precision mode %2',
            raccoon_is_moving: 'moving?',
            raccoon_with_gripper: '%1 gripper %2',
            raccoon_lock_gripper: 'lock gripper %1 %2',
            raccoon_lock_gripper_until: 'lock and wait gripper %1 %2',
            raccoon_unlock_gripper: 'unlock gripper %1',
            raccoon_gripper_state: 'gripper state',
            raccoon_play_sound: 'play sound %1 %2',
            raccoon_play_sound_times: 'play sound %1 %2 times %3',
            raccoon_play_sound_until: 'play and wait sound %1 %2 times %3',
            raccoon_clear_sound: 'stop sound %1',
            raccoon_play_note: 'play note %1 %2 %3',
            raccoon_play_note_beat: 'play note %1 %2 for %3 beats %4',
            raccoon_rest_beat: 'rest for %1 beats %2',
            raccoon_change_tempo: 'change tempo by %1 %2',
            raccoon_set_tempo: 'set tempo to %1 bpm %2',
            raccoon_is_sound_playing: 'sound playing?',
            raccoon_encoder1: 'joint 1 angle',
            raccoon_encoder2: 'joint 2 angle',
            raccoon_encoder3: 'joint 3 angle',
            raccoon_encoder4: 'joint 4 angle',
            raccoon_position_x: 'position x (cm)',
            raccoon_position_y: 'position y (cm)',
            raccoon_position_z: 'position z (cm)',
            raccoon_position_x_inch: 'position x (inches)',
            raccoon_position_y_inch: 'position y (inches)',
            raccoon_position_z_inch: 'position z (inches)',
            raccoon_teach_button: 'teach button',
            raccoon_play_button: 'play button',
            raccoon_delete_button: 'delete button',
            raccoon_signal_strength: 'signal strength',
            raccoon_when_button_state: '%1 when %2 button %3',
            raccoon_button_state: '%1 button %2?',
            raccoon_battery_state: 'battery %1?',
            raccoon_charging: 'charging?',
            raccoon_conveyor_move: 'move conveyor %2 %3 at %1 % speed %4',
            raccoon_conveyor_change_velocity: 'change conveyor velocity by %1 %2',
            raccoon_conveyor_set_velocity: 'set conveyor velocity to %1 % %2',
            raccoon_conveyor_stop: 'stop conveyor %1',
            raccoon_conveyor_moving: 'conveyor moving?',
            raccoon_conveyor_button: 'conveyor button',
            raccoon_conveyor_when_button_state: '%1 when conveyor button %2',
            raccoon_conveyor_button_state: 'conveyor button %1?',
        },
        Blocks: {
            raccoon_joint_1: 'joint 1',
            raccoon_joint_2: 'joint 2',
            raccoon_joint_3: 'joint 3',
            raccoon_joint_4: 'joint 4',
            raccoon_joint_all: 'all joint',
            raccoon_unit_cm: 'cm',
            raccoon_unit_inches: 'inches',
            raccoon_axis_x: 'x',
            raccoon_axis_y: 'y',
            raccoon_axis_z: 'z',
            raccoon_ref_wrist: 'wrist',
            raccoon_ref_gripper: 'gripper',
            raccoon_front: 'front',
            raccoon_rear: 'rear',
            raccoon_up: 'up',
            raccoon_down: 'down',
            raccoon_on: 'turn on',
            raccoon_off: 'turn off',
            raccoon_gripper_place: 'place (open)',
            raccoon_gripper_pick: 'pick (close)',
            raccoon_horizontal: 'horizontally',
            raccoon_vertical: 'vertically',
            raccoon_sound_beep: 'beep',
            raccoon_sound_random_beep: 'random beep',
            raccoon_sound_noise: 'noise',
            raccoon_sound_siren: 'siren',
            raccoon_sound_engine: 'engine',
            raccoon_sound_chop: 'chop',
            raccoon_sound_robot: 'robot',
            raccoon_sound_dibidibidip: 'dibidibidip',
            raccoon_sound_good_job: 'good job',
            raccoon_sound_random_melody: 'random melody',
            raccoon_sound_wake_up: 'wake up',
            raccoon_sound_start: 'start',
            raccoon_sound_bye: 'bye',
            raccoon_note_c: 'C',
            raccoon_note_cs: 'C♯ (D♭)',
            raccoon_note_d: 'D',
            raccoon_note_ds: 'D♯ (E♭)',
            raccoon_note_e: 'E',
            raccoon_note_f: 'F',
            raccoon_note_fs: 'F♯ (G♭)',
            raccoon_note_g: 'G',
            raccoon_note_gs: 'G♯ (A♭)',
            raccoon_note_a: 'A',
            raccoon_note_as: 'A♯ (B♭)',
            raccoon_note_b: 'B',
            raccoon_button_teach: 'teach',
            raccoon_button_play: 'play',
            raccoon_button_delete: 'delete',
            raccoon_state_pressed: 'pressed',
            raccoon_state_released: 'released',
            raccoon_state_clicked: 'clicked',
            raccoon_state_long_pressed: 'long-pressed',
            raccoon_bstate_pressed: 'pressed',
            raccoon_bstate_released: 'released',
            raccoon_bstate_clicked: 'clicked',
            raccoon_bstate_long_pressed: 'long-pressed',
            raccoon_battery_normal: 'normal',
            raccoon_battery_low: 'low',
            raccoon_battery_empty: 'empty',
            raccoon_sensor_signal_strength: 'signal strength',
            raccoon_sensor_battery: 'battery',
            raccoon_sensor_encoder1: 'joint 1 angle',
            raccoon_sensor_encoder2: 'joint 2 angle',
            raccoon_sensor_encoder3: 'joint 3 angle',
            raccoon_sensor_encoder4: 'joint 4 angle',
            raccoon_conveyor_unit_cm: 'cm',
            raccoon_conveyor_unit_mm: 'mm',
            raccoon_conveyor_unit_inches: 'inches',
            raccoon_conveyor_unit_seconds: 'seconds',
        },
        Msgs: {
            raccoon_unreachable_pose_title: 'Raccoon: cánh tay không thể đến tư thế này',
            raccoon_unreachable_pose:
                'Khối này đã bị bỏ qua vì cánh tay không thể đến tư thế đó. Hãy thử giá trị nhỏ hơn.',
            raccoon_delay_too_long_title: 'Raccoon: thời gian chờ quá dài',
            raccoon_delay_too_long: 'Không thể chờ lâu như vậy nên đã rút ngắn về mức tối đa. Hãy thử giá trị nhỏ hơn.',
        },
    },
});

Entry.Raccoon.blockMenuBlocks = [
    'raccoon_return_to_basic_pose',
    'raccoon_change_joint_angles_by',
    'raccoon_change_joint_angles_by_until',
    'raccoon_set_joint_angles_to',
    'raccoon_set_joint_angles_to_until',
    'raccoon_change_angle_by',
    'raccoon_change_angle_by_until',
    'raccoon_set_angle_to',
    'raccoon_set_angle_to_until',
    'raccoon_change_position_by_xyz',
    'raccoon_change_position_by_xyz_until',
    'raccoon_set_position_to_xyz',
    'raccoon_set_position_to_xyz_until',
    'raccoon_change_position_by',
    'raccoon_set_position_to',
    'raccoon_set_position_ref_to',
    'raccoon_change_position_ref_by_front_up',
    'raccoon_set_position_ref_to_front_up',
    'raccoon_change_joint_velocities_by',
    'raccoon_set_joint_velocities_to',
    'raccoon_change_velocity_by',
    'raccoon_set_velocity_to',
    'raccoon_stop',
    'raccoon_turn_off',
    'raccoon_turn_precision_mode',
    'raccoon_is_moving',
    'raccoon_with_gripper',
    'raccoon_lock_gripper',
    'raccoon_lock_gripper_until',
    'raccoon_unlock_gripper',
    'raccoon_gripper_state',
    'raccoon_play_sound',
    'raccoon_play_sound_times',
    'raccoon_play_sound_until',
    'raccoon_clear_sound',
    'raccoon_play_note',
    'raccoon_play_note_beat',
    'raccoon_rest_beat',
    'raccoon_change_tempo',
    'raccoon_set_tempo',
    'raccoon_is_sound_playing',
    'raccoon_encoder1',
    'raccoon_encoder2',
    'raccoon_encoder3',
    'raccoon_encoder4',
    'raccoon_position_x',
    'raccoon_position_y',
    'raccoon_position_z',
    'raccoon_position_x_inch',
    'raccoon_position_y_inch',
    'raccoon_position_z_inch',
    'raccoon_teach_button',
    'raccoon_play_button',
    'raccoon_delete_button',
    'raccoon_signal_strength',
    'raccoon_when_button_state',
    'raccoon_button_state',
    'raccoon_battery_state',
    'raccoon_charging',
    'raccoon_conveyor_move',
    'raccoon_conveyor_change_velocity',
    'raccoon_conveyor_set_velocity',
    'raccoon_conveyor_stop',
    'raccoon_conveyor_moving',
    'raccoon_conveyor_button',
    'raccoon_conveyor_when_button_state',
    'raccoon_conveyor_button_state',
];

Entry.Raccoon.getBlocks = function() {
    const HW = EntryStatic.colorSet.block.default.HARDWARE;
    const HW_LINE = EntryStatic.colorSet.block.darken.HARDWARE;
    const HW_ARROW = EntryStatic.colorSet.arrow.default.HARDWARE;

    const dropdown = (options, value) => ({
        type: 'Dropdown',
        options,
        value,
        fontSize: 11,
        bgColor: HW_LINE,
        arrowColor: HW_ARROW,
    });
    const indicator = () => ({
        type: 'Indicator',
        img: 'block_icon/hardware_icon.svg',
        size: 12,
    });
    const numberInput = () => ({
        type: 'Block',
        accept: 'string',
    });
    const text = (value) => ({
        type: 'text',
        params: [`${value}`],
    });

    // 이 값 문자열들은 block_robomation.js RaccoonRobot.__JOINTS의 조회 키다.
    // 한쪽만 이름을 바꾸면 관절 선택이 어긋난다.
    const OPT_JOINT = [
        [Lang.Blocks.raccoon_joint_1, 'JOINT1'],
        [Lang.Blocks.raccoon_joint_2, 'JOINT2'],
        [Lang.Blocks.raccoon_joint_3, 'JOINT3'],
        [Lang.Blocks.raccoon_joint_4, 'JOINT4'],
        [Lang.Blocks.raccoon_joint_all, 'ALL'],
    ];
    const OPT_UNIT = [
        [Lang.Blocks.raccoon_unit_cm, 'CM'],
        [Lang.Blocks.raccoon_unit_inches, 'INCHES'],
    ];
    const OPT_XYZ = [
        [Lang.Blocks.raccoon_axis_x, 'X'],
        [Lang.Blocks.raccoon_axis_y, 'Y'],
        [Lang.Blocks.raccoon_axis_z, 'Z'],
    ];
    const OPT_REF = [
        [Lang.Blocks.raccoon_ref_wrist, 'WRIST'],
        [Lang.Blocks.raccoon_ref_gripper, 'GRIPPER'],
    ];
    const OPT_FRONT_REAR = [
        [Lang.Blocks.raccoon_front, 'FRONT'],
        [Lang.Blocks.raccoon_rear, 'REAR'],
    ];
    const OPT_UP_DOWN = [
        [Lang.Blocks.raccoon_up, 'UP'],
        [Lang.Blocks.raccoon_down, 'DOWN'],
    ];
    const OPT_ON_OFF = [
        [Lang.Blocks.raccoon_on, 'ON'],
        [Lang.Blocks.raccoon_off, 'OFF'],
    ];
    const OPT_PICK_PLACE = [
        [Lang.Blocks.raccoon_gripper_place, 'PLACE'],
        [Lang.Blocks.raccoon_gripper_pick, 'PICK'],
    ];
    const OPT_HORZ_VERT = [
        [Lang.Blocks.raccoon_horizontal, 'HORIZONTAL'],
        [Lang.Blocks.raccoon_vertical, 'VERTICAL'],
    ];
    const OPT_SOUND = [
        [Lang.Blocks.raccoon_sound_beep, 'BEEP'],
        [Lang.Blocks.raccoon_sound_random_beep, 'RANDOM_BEEP'],
        [Lang.Blocks.raccoon_sound_noise, 'NOISE'],
        [Lang.Blocks.raccoon_sound_siren, 'SIREN'],
        [Lang.Blocks.raccoon_sound_engine, 'ENGINE'],
        [Lang.Blocks.raccoon_sound_chop, 'CHOP'],
        [Lang.Blocks.raccoon_sound_robot, 'ROBOT'],
        [Lang.Blocks.raccoon_sound_dibidibidip, 'DIBIDIBIDIP'],
        [Lang.Blocks.raccoon_sound_good_job, 'GOOD_JOB'],
        [Lang.Blocks.raccoon_sound_random_melody, 'RANDOM_MELODY'],
        [Lang.Blocks.raccoon_sound_wake_up, 'WAKE_UP'],
        [Lang.Blocks.raccoon_sound_start, 'START'],
        [Lang.Blocks.raccoon_sound_bye, 'BYE'],
    ];
    const OPT_NOTE = [
        [Lang.Blocks.raccoon_note_c, 'C'],
        [Lang.Blocks.raccoon_note_cs, 'CS'],
        [Lang.Blocks.raccoon_note_d, 'D'],
        [Lang.Blocks.raccoon_note_ds, 'DS'],
        [Lang.Blocks.raccoon_note_e, 'E'],
        [Lang.Blocks.raccoon_note_f, 'F'],
        [Lang.Blocks.raccoon_note_fs, 'FS'],
        [Lang.Blocks.raccoon_note_g, 'G'],
        [Lang.Blocks.raccoon_note_gs, 'GS'],
        [Lang.Blocks.raccoon_note_a, 'A'],
        [Lang.Blocks.raccoon_note_as, 'AS'],
        [Lang.Blocks.raccoon_note_b, 'B'],
    ];
    const OPT_OCTAVE = [
        ['1', '1'],
        ['2', '2'],
        ['3', '3'],
        ['4', '4'],
        ['5', '5'],
        ['6', '6'],
        ['7', '7'],
    ];
    const OPT_BUTTON = [
        [Lang.Blocks.raccoon_button_teach, 'TEACH'],
        [Lang.Blocks.raccoon_button_play, 'PLAY'],
        [Lang.Blocks.raccoon_button_delete, 'DELETE'],
    ];
    const OPT_WHEN_STATE = [
        [Lang.Blocks.raccoon_state_pressed, 'PRESSED'],
        [Lang.Blocks.raccoon_state_released, 'RELEASED'],
        [Lang.Blocks.raccoon_state_clicked, 'CLICKED'],
        [Lang.Blocks.raccoon_state_long_pressed, 'LONG_PRESSED'],
    ];
    const OPT_BUTTON_STATE = [
        [Lang.Blocks.raccoon_bstate_pressed, 'PRESSED'],
        [Lang.Blocks.raccoon_bstate_released, 'RELEASED'],
        [Lang.Blocks.raccoon_bstate_clicked, 'CLICKED'],
        [Lang.Blocks.raccoon_bstate_long_pressed, 'LONG_PRESSED'],
    ];
    const OPT_BATTERY = [
        [Lang.Blocks.raccoon_battery_normal, 'NORMAL'],
        [Lang.Blocks.raccoon_battery_low, 'LOW'],
        [Lang.Blocks.raccoon_battery_empty, 'EMPTY'],
    ];

    const OPT_CONVEYOR_UNIT = [
        [Lang.Blocks.raccoon_conveyor_unit_cm, 'CM'],
        [Lang.Blocks.raccoon_conveyor_unit_mm, 'MM'],
        [Lang.Blocks.raccoon_conveyor_unit_inches, 'INCHES'],
        [Lang.Blocks.raccoon_conveyor_unit_seconds, 'SECONDS'],
    ];

    const command = (type, params, def, paramsKeyMap, klass, method) => ({
        color: HW,
        outerLine: HW_LINE,
        skeleton: 'basic',
        statements: [],
        params,
        events: {},
        def: { params: def, type },
        paramsKeyMap,
        class: klass,
        isNotFor: ['raccoon'],
        func(sprite, script) {
            const robot = Entry.Raccoon.getRobot();
            return robot ? robot[method](script) : script;
        },
    });
    const booleanField = (type, params, def, paramsKeyMap, klass, method) => ({
        color: HW,
        outerLine: HW_LINE,
        fontColor: '#fff',
        skeleton: 'basic_boolean_field',
        statements: [],
        params,
        events: {},
        def: { params: def, type },
        paramsKeyMap,
        class: klass,
        isNotFor: ['raccoon'],
        func(sprite, script) {
            const robot = Entry.Raccoon.getRobot();
            return robot ? robot[method](script) : false;
        },
    });
    const stringField = (type, params, def, paramsKeyMap, klass, method) => ({
        color: HW,
        outerLine: HW_LINE,
        fontColor: '#fff',
        skeleton: 'basic_string_field',
        statements: [],
        params,
        events: {},
        def: { params: def, type },
        paramsKeyMap,
        class: klass,
        isNotFor: ['raccoon'],
        func(sprite, script) {
            const robot = Entry.Raccoon.getRobot();
            return robot ? robot[method](script) : 0;
        },
    });

    const anglesParams = [numberInput(), numberInput(), numberInput(), numberInput(), indicator()];
    const anglesDef = [text('0'), text('0'), text('0'), text('0'), null];
    const anglesKeyMap = { DEGREE1: 0, DEGREE2: 1, DEGREE3: 2, DEGREE4: 3 };
    const xyzParams = [
        numberInput(),
        numberInput(),
        numberInput(),
        dropdown(OPT_UNIT, 'CM'),
        indicator(),
    ];
    const xyzDef = [text('0'), text('0'), text('0'), null, null];
    const xyzKeyMap = { X: 0, Y: 1, Z: 2, UNIT: 3 };

    return {
        // -------- motion --------
        raccoon_return_to_basic_pose: command(
            'raccoon_return_to_basic_pose',
            [indicator()],
            [null],
            {},
            'raccoon_joint',
            'returnToBasicPose'
        ),
        raccoon_change_joint_angles_by: command(
            'raccoon_change_joint_angles_by',
            anglesParams,
            anglesDef,
            anglesKeyMap,
            'raccoon_joint',
            'changeJointAnglesBy'
        ),
        raccoon_change_joint_angles_by_until: command(
            'raccoon_change_joint_angles_by_until',
            anglesParams,
            anglesDef,
            anglesKeyMap,
            'raccoon_joint',
            'changeJointAnglesByUntil'
        ),
        raccoon_set_joint_angles_to: command(
            'raccoon_set_joint_angles_to',
            anglesParams,
            anglesDef,
            anglesKeyMap,
            'raccoon_joint',
            'setJointAnglesTo'
        ),
        raccoon_set_joint_angles_to_until: command(
            'raccoon_set_joint_angles_to_until',
            anglesParams,
            anglesDef,
            anglesKeyMap,
            'raccoon_joint',
            'setJointAnglesToUntil'
        ),
        raccoon_change_angle_by: command(
            'raccoon_change_angle_by',
            [dropdown(OPT_JOINT, 'JOINT1'), numberInput(), indicator()],
            [null, text('10'), null],
            { JOINT: 0, DEGREE: 1 },
            'raccoon_joint',
            'changeAngleBy'
        ),
        raccoon_change_angle_by_until: command(
            'raccoon_change_angle_by_until',
            [dropdown(OPT_JOINT, 'JOINT1'), numberInput(), indicator()],
            [null, text('10'), null],
            { JOINT: 0, DEGREE: 1 },
            'raccoon_joint',
            'changeAngleByUntil'
        ),
        raccoon_set_angle_to: command(
            'raccoon_set_angle_to',
            [dropdown(OPT_JOINT, 'JOINT1'), numberInput(), indicator()],
            [null, text('0'), null],
            { JOINT: 0, DEGREE: 1 },
            'raccoon_joint',
            'setAngleTo'
        ),
        raccoon_set_angle_to_until: command(
            'raccoon_set_angle_to_until',
            [dropdown(OPT_JOINT, 'JOINT1'), numberInput(), indicator()],
            [null, text('0'), null],
            { JOINT: 0, DEGREE: 1 },
            'raccoon_joint',
            'setAngleToUntil'
        ),
        raccoon_change_position_by_xyz: command(
            'raccoon_change_position_by_xyz',
            xyzParams,
            xyzDef,
            xyzKeyMap,
            'raccoon_position',
            'changePositionByXYZ'
        ),
        raccoon_change_position_by_xyz_until: command(
            'raccoon_change_position_by_xyz_until',
            xyzParams,
            xyzDef,
            xyzKeyMap,
            'raccoon_position',
            'changePositionByXYZUntil'
        ),
        raccoon_set_position_to_xyz: command(
            'raccoon_set_position_to_xyz',
            xyzParams,
            xyzDef,
            xyzKeyMap,
            'raccoon_position',
            'setPositionToXYZ'
        ),
        raccoon_set_position_to_xyz_until: command(
            'raccoon_set_position_to_xyz_until',
            xyzParams,
            xyzDef,
            xyzKeyMap,
            'raccoon_position',
            'setPositionToXYZUntil'
        ),
        raccoon_change_position_by: command(
            'raccoon_change_position_by',
            [dropdown(OPT_XYZ, 'X'), numberInput(), dropdown(OPT_UNIT, 'CM'), indicator()],
            [null, text('10'), null, null],
            { XYZ: 0, VALUE: 1, UNIT: 2 },
            'raccoon_position',
            'changePositionBy'
        ),
        raccoon_set_position_to: command(
            'raccoon_set_position_to',
            [dropdown(OPT_XYZ, 'X'), numberInput(), dropdown(OPT_UNIT, 'CM'), indicator()],
            [null, text('0'), null, null],
            { XYZ: 0, VALUE: 1, UNIT: 2 },
            'raccoon_position',
            'setPositionTo'
        ),
        raccoon_set_position_ref_to: command(
            'raccoon_set_position_ref_to',
            [dropdown(OPT_REF, 'GRIPPER'), indicator()],
            [null, null],
            { REF: 0 },
            'raccoon_position',
            'setPositionRefTo'
        ),
        raccoon_change_position_ref_by_front_up: command(
            'raccoon_change_position_ref_by_front_up',
            [
                dropdown(OPT_FRONT_REAR, 'FRONT'),
                numberInput(),
                dropdown(OPT_UP_DOWN, 'UP'),
                numberInput(),
                dropdown(OPT_UNIT, 'CM'),
                indicator(),
            ],
            [null, text('0'), null, text('0'), null, null],
            { FRONT_REAR: 0, Y: 1, UP_DOWN: 2, Z: 3, UNIT: 4 },
            'raccoon_position',
            'changePositionRefByFrontUp'
        ),
        raccoon_set_position_ref_to_front_up: command(
            'raccoon_set_position_ref_to_front_up',
            [
                dropdown(OPT_FRONT_REAR, 'FRONT'),
                numberInput(),
                dropdown(OPT_UP_DOWN, 'UP'),
                numberInput(),
                dropdown(OPT_UNIT, 'CM'),
                indicator(),
            ],
            [null, text('0'), null, text('0'), null, null],
            { FRONT_REAR: 0, Y: 1, UP_DOWN: 2, Z: 3, UNIT: 4 },
            'raccoon_position',
            'setPositionRefToFrontUp'
        ),
        raccoon_change_joint_velocities_by: command(
            'raccoon_change_joint_velocities_by',
            anglesParams,
            anglesDef,
            { VELOCITY1: 0, VELOCITY2: 1, VELOCITY3: 2, VELOCITY4: 3 },
            'raccoon_joint',
            'changeJointVelocitiesBy'
        ),
        raccoon_set_joint_velocities_to: command(
            'raccoon_set_joint_velocities_to',
            anglesParams,
            anglesDef,
            { VELOCITY1: 0, VELOCITY2: 1, VELOCITY3: 2, VELOCITY4: 3 },
            'raccoon_joint',
            'setJointVelocitiesTo'
        ),
        raccoon_change_velocity_by: command(
            'raccoon_change_velocity_by',
            [dropdown(OPT_JOINT, 'JOINT1'), numberInput(), indicator()],
            [null, text('10'), null],
            { JOINT: 0, VELOCITY: 1 },
            'raccoon_joint',
            'changeVelocityBy'
        ),
        raccoon_set_velocity_to: command(
            'raccoon_set_velocity_to',
            [dropdown(OPT_JOINT, 'JOINT1'), numberInput(), indicator()],
            [null, text('0'), null],
            { JOINT: 0, VELOCITY: 1 },
            'raccoon_joint',
            'setVelocityTo'
        ),
        raccoon_stop: command(
            'raccoon_stop',
            [dropdown(OPT_JOINT, 'ALL'), indicator()],
            [null, null],
            { JOINT: 0 },
            'raccoon_joint',
            'stop'
        ),
        raccoon_turn_off: command(
            'raccoon_turn_off',
            [dropdown(OPT_JOINT, 'ALL'), indicator()],
            [null, null],
            { JOINT: 0 },
            'raccoon_joint',
            'turnOff'
        ),
        raccoon_turn_precision_mode: command(
            'raccoon_turn_precision_mode',
            [dropdown(OPT_ON_OFF, 'OFF'), indicator()],
            [null, null],
            { ON_OFF: 0 },
            'raccoon_joint',
            'turnPrecisionMode'
        ),
        raccoon_is_moving: booleanField(
            'raccoon_is_moving',
            [],
            [],
            {},
            'raccoon_joint',
            'isMoving'
        ),
        // -------- gripper --------
        raccoon_with_gripper: command(
            'raccoon_with_gripper',
            [dropdown(OPT_PICK_PLACE, 'PLACE'), indicator()],
            [null, null],
            { ACTION: 0 },
            'raccoon_gripper',
            'withGripper'
        ),
        raccoon_lock_gripper: command(
            'raccoon_lock_gripper',
            [dropdown(OPT_HORZ_VERT, 'HORIZONTAL'), indicator()],
            [null, null],
            { DIRECTION: 0 },
            'raccoon_gripper',
            'lockGripper'
        ),
        raccoon_lock_gripper_until: command(
            'raccoon_lock_gripper_until',
            [dropdown(OPT_HORZ_VERT, 'HORIZONTAL'), indicator()],
            [null, null],
            { DIRECTION: 0 },
            'raccoon_gripper',
            'lockGripperUntil'
        ),
        raccoon_unlock_gripper: command(
            'raccoon_unlock_gripper',
            [indicator()],
            [null],
            {},
            'raccoon_gripper',
            'unlockGripper'
        ),
        raccoon_gripper_state: stringField(
            'raccoon_gripper_state',
            [],
            [],
            {},
            'raccoon_gripper',
            'getGripperState'
        ),
        // -------- sound --------
        raccoon_play_sound: command(
            'raccoon_play_sound',
            [dropdown(OPT_SOUND, 'BEEP'), indicator()],
            [null, null],
            { SOUND: 0 },
            'raccoon_sound',
            'playSound'
        ),
        raccoon_play_sound_times: command(
            'raccoon_play_sound_times',
            [dropdown(OPT_SOUND, 'BEEP'), numberInput(), indicator()],
            [null, text('1'), null],
            { SOUND: 0, REPEAT: 1 },
            'raccoon_sound',
            'playSoundTimes'
        ),
        raccoon_play_sound_until: command(
            'raccoon_play_sound_until',
            [dropdown(OPT_SOUND, 'BEEP'), numberInput(), indicator()],
            [null, text('1'), null],
            { SOUND: 0, REPEAT: 1 },
            'raccoon_sound',
            'playSoundTimesUntil'
        ),
        raccoon_clear_sound: command(
            'raccoon_clear_sound',
            [indicator()],
            [null],
            {},
            'raccoon_sound',
            'clearSound'
        ),
        raccoon_play_note: command(
            'raccoon_play_note',
            [dropdown(OPT_NOTE, 'C'), dropdown(OPT_OCTAVE, '4'), indicator()],
            [null, null, null],
            { NOTE: 0, OCTAVE: 1 },
            'raccoon_sound',
            'playNote'
        ),
        raccoon_play_note_beat: command(
            'raccoon_play_note_beat',
            [dropdown(OPT_NOTE, 'C'), dropdown(OPT_OCTAVE, '4'), numberInput(), indicator()],
            [null, null, text('0.5'), null],
            { NOTE: 0, OCTAVE: 1, BEAT: 2 },
            'raccoon_sound',
            'playNoteBeat'
        ),
        raccoon_rest_beat: command(
            'raccoon_rest_beat',
            [numberInput(), indicator()],
            [text('0.25'), null],
            { BEAT: 0 },
            'raccoon_sound',
            'restBeat'
        ),
        raccoon_change_tempo: command(
            'raccoon_change_tempo',
            [numberInput(), indicator()],
            [text('20'), null],
            { BPM: 0 },
            'raccoon_sound',
            'changeTempo'
        ),
        raccoon_set_tempo: command(
            'raccoon_set_tempo',
            [numberInput(), indicator()],
            [text('60'), null],
            { BPM: 0 },
            'raccoon_sound',
            'setTempo'
        ),
        raccoon_is_sound_playing: booleanField(
            'raccoon_is_sound_playing',
            [],
            [],
            {},
            'raccoon_sound',
            'isSoundPlaying'
        ),
        // -------- sensing --------
        raccoon_encoder1: stringField(
            'raccoon_encoder1',
            [],
            [],
            {},
            'raccoon_sensor',
            'getEncoder1'
        ),
        raccoon_encoder2: stringField(
            'raccoon_encoder2',
            [],
            [],
            {},
            'raccoon_sensor',
            'getEncoder2'
        ),
        raccoon_encoder3: stringField(
            'raccoon_encoder3',
            [],
            [],
            {},
            'raccoon_sensor',
            'getEncoder3'
        ),
        raccoon_encoder4: stringField(
            'raccoon_encoder4',
            [],
            [],
            {},
            'raccoon_sensor',
            'getEncoder4'
        ),
        raccoon_position_x: stringField(
            'raccoon_position_x',
            [],
            [],
            {},
            'raccoon_sensor',
            'getPositionX'
        ),
        raccoon_position_y: stringField(
            'raccoon_position_y',
            [],
            [],
            {},
            'raccoon_sensor',
            'getPositionY'
        ),
        raccoon_position_z: stringField(
            'raccoon_position_z',
            [],
            [],
            {},
            'raccoon_sensor',
            'getPositionZ'
        ),
        raccoon_position_x_inch: stringField(
            'raccoon_position_x_inch',
            [],
            [],
            {},
            'raccoon_sensor',
            'getPositionXInch'
        ),
        raccoon_position_y_inch: stringField(
            'raccoon_position_y_inch',
            [],
            [],
            {},
            'raccoon_sensor',
            'getPositionYInch'
        ),
        raccoon_position_z_inch: stringField(
            'raccoon_position_z_inch',
            [],
            [],
            {},
            'raccoon_sensor',
            'getPositionZInch'
        ),
        raccoon_teach_button: stringField(
            'raccoon_teach_button',
            [],
            [],
            {},
            'raccoon_sensor',
            'getTeachButton'
        ),
        raccoon_play_button: stringField(
            'raccoon_play_button',
            [],
            [],
            {},
            'raccoon_sensor',
            'getPlayButton'
        ),
        raccoon_delete_button: stringField(
            'raccoon_delete_button',
            [],
            [],
            {},
            'raccoon_sensor',
            'getDeleteButton'
        ),
        raccoon_signal_strength: stringField(
            'raccoon_signal_strength',
            [],
            [],
            {},
            'raccoon_sensor',
            'getSignalStrength'
        ),
        raccoon_when_button_state: {
            color: HW,
            outerLine: HW_LINE,
            fontColor: '#fff',
            skeleton: 'basic_event',
            statements: [],
            params: [
                {
                    type: 'Indicator',
                    img: 'block_icon/start_icon_hardware.svg',
                    size: 14,
                    position: { x: 0, y: -2 },
                },
                dropdown(OPT_BUTTON, 'TEACH'),
                dropdown(OPT_WHEN_STATE, 'PRESSED'),
            ],
            events: {},
            def: {
                params: [null, null, null],
                type: 'raccoon_when_button_state',
            },
            paramsKeyMap: { DUMMY: 0, BUTTON: 1, STATE: 2 },
            event: 'raccoonWhenButtonState',
            class: 'raccoon_sensor',
            isNotFor: ['raccoon'],
            func(sprite, script) {
                const robot = Entry.Raccoon.getRobot();
                if (robot && robot.checkButtonEvent(script)) {
                    return script.callReturn();
                }
                return this.die();
            },
        },
        raccoon_button_state: booleanField(
            'raccoon_button_state',
            [dropdown(OPT_BUTTON, 'TEACH'), dropdown(OPT_BUTTON_STATE, 'PRESSED')],
            [null, null],
            { BUTTON: 0, STATE: 1 },
            'raccoon_sensor',
            'isButtonState'
        ),
        raccoon_battery_state: booleanField(
            'raccoon_battery_state',
            [dropdown(OPT_BATTERY, 'NORMAL')],
            [null],
            { BATTERY: 0 },
            'raccoon_sensor',
            'checkBatteryState'
        ),
        raccoon_charging: booleanField(
            'raccoon_charging',
            [],
            [],
            {},
            'raccoon_sensor',
            'isCharging'
        ),
        // -------- conveyor (peripheral on the raccoon connection) --------
        raccoon_conveyor_move: command(
            'raccoon_conveyor_move',
            [numberInput(), numberInput(), dropdown(OPT_CONVEYOR_UNIT, 'CM'), indicator()],
            [text('100'), text('10'), null, null],
            { SPEED: 0, VALUE: 1, UNIT: 2 },
            'raccoon_conveyor',
            'conveyorMove'
        ),
        raccoon_conveyor_change_velocity: command(
            'raccoon_conveyor_change_velocity',
            [numberInput(), indicator()],
            [text('10'), null],
            { VELOCITY: 0 },
            'raccoon_conveyor',
            'conveyorChangeVelocity'
        ),
        raccoon_conveyor_set_velocity: command(
            'raccoon_conveyor_set_velocity',
            [numberInput(), indicator()],
            [text('0'), null],
            { VELOCITY: 0 },
            'raccoon_conveyor',
            'conveyorSetVelocity'
        ),
        raccoon_conveyor_stop: command(
            'raccoon_conveyor_stop',
            [indicator()],
            [null],
            {},
            'raccoon_conveyor',
            'conveyorStop'
        ),
        raccoon_conveyor_moving: booleanField(
            'raccoon_conveyor_moving',
            [],
            [],
            {},
            'raccoon_conveyor',
            'isConveyorMoving'
        ),
        raccoon_conveyor_button: stringField(
            'raccoon_conveyor_button',
            [],
            [],
            {},
            'raccoon_conveyor',
            'getConveyorButton'
        ),
        raccoon_conveyor_when_button_state: {
            color: HW,
            outerLine: HW_LINE,
            fontColor: '#fff',
            skeleton: 'basic_event',
            statements: [],
            params: [
                {
                    type: 'Indicator',
                    img: 'block_icon/start_icon_hardware.svg',
                    size: 14,
                    position: { x: 0, y: -2 },
                },
                dropdown(OPT_WHEN_STATE, 'PRESSED'),
            ],
            events: {},
            def: {
                params: [null, null],
                type: 'raccoon_conveyor_when_button_state',
            },
            paramsKeyMap: { DUMMY: 0, STATE: 1 },
            event: 'raccoonConveyorWhenButtonState',
            class: 'raccoon_conveyor',
            isNotFor: ['raccoon'],
            func(sprite, script) {
                const robot = Entry.Raccoon.getRobot();
                if (robot && robot.checkConveyorButtonEvent(script)) {
                    return script.callReturn();
                }
                return this.die();
            },
        },
        raccoon_conveyor_button_state: booleanField(
            'raccoon_conveyor_button_state',
            [dropdown(OPT_BUTTON_STATE, 'PRESSED')],
            [null],
            { STATE: 0 },
            'raccoon_conveyor',
            'isConveyorButtonState'
        ),
    };
};

module.exports = Entry.Raccoon;
