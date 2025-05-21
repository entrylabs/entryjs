'use strict';

const _throttle = require('lodash/throttle');

(function () {
    const NEMOLITE_INDEX = 0x42; //66
    const RELEASE_VERSION = 1;
    const SERIAL_INTERVAL = 32;
    const EVENT_INTERVAL = 16;
    const SEND_PACKET_LENGTH = 27; // 패킷 전송전 text + checksum 길이가 더해져야 한다.
    const RECEIVED_PACKET_LENGTH = 24;
    Entry.ProboNemoLite = new (class ProboNemoLite {
        //region constructor
        constructor() {
            this.id = '630101';
            this.name = 'ProboNemoLite';
            this.url = 'https://imssam.me';
            this.imageName = 'alux_nemo_lite.png';
            this.title = {
                ko: '네모',
                en: 'Nemo',
            };
            this.portData = {
                baudRate: 115200,
                duration: SERIAL_INTERVAL,
                dataBits: 8,
                parity: 'none',
                stopBits: 1,
                bufferSize: 128,
                connectionType: 'bytestream',
                constantServing: 'ReadOnly',
            };

            const eventSetting = {
                leading: true,
                trailing: false,
            };
            this.buttonEvent = _throttle(
                () => {
                    const prevFlag = this.sendFlag;
                    try {
                        Entry.engine.fireEvent('nemolite_event_button');
                    } catch (e) {
                    } finally {
                        this.sendFlag = prevFlag;
                    }
                },
                EVENT_INTERVAL,
                eventSetting
            );
            this.motionEvent = _throttle(
                () => {
                    const prevFlag = this.sendFlag;
                    try {
                        Entry.engine.fireEvent('nemolite_event_motion');
                    } catch (e) {
                    } finally {
                        this.sendFlag = prevFlag;
                    }
                },
                EVENT_INTERVAL,
                eventSetting
            );

            this.qRear = 0;
            this.qFront = 0;
            this.qSize = 128;
            this.qBuffer = new Uint8Array(this.qSize + 2).fill(-1);
            this.receivedPacket = new Uint8Array(RECEIVED_PACKET_LENGTH).fill(-1);
            this.sendPacket = new Uint8Array(SEND_PACKET_LENGTH).fill(0);
            this.textPacket = new Uint8Array(0).fill(0);
            this.pLength = 0; // packet length
            this.process = false; // packet process

            this.version = 0;
            this.sendFlag = true;

            this.soundKeyArray = [
                30578, 28861, 27241, 25713, 24270, 22908, 21622, 20408, 19263, 18182, 17161, 16198,
            ];
            this.sendIndex = {
                cmd0: 0,
                cmd1: 1,
                size: 2,
                led7x1: 3,
                led7x2: 4,
                led7x3: 5,
                led7x4: 6,
                led7x5: 7,
                led7x6: 8,
                led7x7: 9,
                led7x8: 10,
                led7x9: 11,
                led7x10: 12,
                led7x11: 13,
                led7x12: 14,
                led7x13: 15,
                led7x14: 16,
                ledMs0: 17,
                ledMs1: 18,
                ledPixel: 19,
                ledSet: 20,
                portSet: 21,
                melody: 22,
                buzzer0: 23,
                buzzer1: 24,
                ledRead: 25,
                textSize: 26, // 텍스트 크기는 따로 계산하여 입력한다.
            };
            this.receivedIndex = {
                cmd0: 0,
                cmd1: 1,
                size: 2,
                accelAx0: 3,
                accelAx1: 4,
                accelAy0: 5,
                accelAy1: 6,
                accelAz0: 7,
                accelAz1: 8,
                accelALi: 9, // Linear
                accelD: 10, // Motion
                illuminance: 11,
                extensionAnalog: 12,
                extensionDigital: 13,
                switchAnalog1: 14,
                switchAnalog2: 15,
                switchAnalog3: 16,
                switchAnalog4: 17,
                switchDigitalAB: 18,
                switchDigitalCD: 19,
                ledRead: 20,
                compass: 21,
                timeCheck: 22,
                checksum: 23,
            };

            this.blockMenuBlocks = [
                'nemolite_dropdown_button',
                'nemolite_dropdown_button_now_state',
                'nemolite_dropdown_button_state_question',
                'nemolite_dropdown_motion',
                'nemolite_dropdown_coordinate_acceleration',
                'nemolite_dropdown_led_icon',
                'nemolite_dropdown_switch',
                'nemolite_dropdown_melody',
                'nemolite_dropdown_keyboard',
                'nemolite_dropdown_extension_sensor',
                'nemolite_dropdown_sensor_mode',
                'nemolite_dropdown_direction',
                'nemolite_dropdown_index_0_5',
                'nemolite_dropdown_index_1_5',
                'nemolite_dropdown_led_columm',

                'nemolite_title_namo_input',
                'nemolite_when_button_state',
                'nemolite_when_motion_sensing',
                'nemolite_is_button_state',
                'nemolite_is_motion_sensing',
                'nemolite_is_led_state_value',
                'nemolite_get_button_analog_value',
                'nemolite_get_acceleration_value',
                'nemolite_get_illuminance_value',
                'nemolite_get_convert_value',

                'nemolite_title_namo_output',
                'nemolite_set_display_led_icon',
                'nemolite_set_display_led_custom_columm',
                'nemolite_set_display_led_text',
                'nemolite_set_delete_all_led',
                'nemolite_set_toggle_led_pixel',
                'nemolite_set_play_melody',
                'nemolite_set_play_melody_until_the_end',
                'nemolite_set_play_note',
                'nemolite_set_play_note_for_seconds',
                'nemolite_set_stop_all_sound',

                'nemolite_title_namo_extension',
                'nemolite_ext_set_extension',
                'nemolite_ext_set_extension_value',
                'nemolite_ext_is_extension_state',
                'nemolite_ext_get_extension_anlog_value',
                'nemolite_ext_get_extension_custom_value',
                'nemolite_ext_set_compass_value',
                'nemolite_ext_get_compass_analog_value',
                'nemolite_ext_get_compass_custom_value',
                'memolite_ext_is_compass_direction',
            ];
        }
        //endregion

        //region setlanguage
        setLanguage() {
            return {
                ko: {
                    template: {
                        nemolite_line_emtpy: ' ',
                        nemolite_namo_input: '네모 입력',
                        nemolite_namo_output: '네모 출력',
                        nemolite_namo_extension: '네모 확장',

                        nemolite_item_s1: 'S1',
                        nemolite_item_s2: 'S2',
                        nemolite_item_s3: 'S3',
                        nemolite_item_s4: 'S4',
                        nemolite_item_motion_1: '앞으로 기울임',
                        nemolite_item_motion_2: '뒤로 기울임',
                        nemolite_item_motion_3: '왼쪽으로 기울임',
                        nemolite_item_motion_4: '오른쪽으로 기울임',
                        nemolite_item_motion_5: '위로 놓음',
                        nemolite_item_motion_6: '아래로 놓음',
                        nemolite_item_motion_7: '세워 놓음',
                        nemolite_item_motion_8: '충격 받음',
                        nemolite_item_smile: '웃음',
                        nemolite_item_not_much: '별로',
                        nemolite_item_good: '좋음',
                        nemolite_item_bad: '나쁨',
                        nemolite_item_wink: '윙크',
                        nemolite_item_cry: '울음',
                        nemolite_item_absurd: '어이없음',
                        nemolite_item_peck: '뽀뽀',
                        nemolite_item_arrow_1: '화살표 1',
                        nemolite_item_arrow_2: '화살표 2',
                        nemolite_item_arrow_3: '화살표 3',
                        nemolite_item_arrow_4: '화살표 4',
                        nemolite_item_arrow_5: '화살표 5',
                        nemolite_item_arrow_6: '화살표 6',
                        nemolite_item_arrow_7: '화살표 7',
                        nemolite_item_arrow_8: '화살표 8',
                        nemolite_item_spade: '스페이드',
                        nemolite_item_club: '클럽',
                        nemolite_item_diamond: '다이아몬드',
                        nemolite_item_heart: '하트',
                        nemolite_item_circle: '원',
                        nemolite_item_x: '엑스',
                        nemolite_item_triangle: '세모',
                        nemolite_item_square: '네모',
                        nemolite_item_note_1: '음표 1',
                        nemolite_item_note_2: '음표 2',
                        nemolite_item_note_3: '음표 3',
                        nemolite_item_dice_1: '주사위 1',
                        nemolite_item_dice_2: '주사위 2',
                        nemolite_item_dice_3: '주사위 3',
                        nemolite_item_dice_4: '주사위 4',
                        nemolite_item_dice_5: '주사위 5',
                        nemolite_item_dice_6: '주사위 6',
                        nemolite_item_first: '첫번째',
                        nemolite_item_second: '두번째',
                        nemolite_item_third: '세번째',
                        nemolite_item_fourth: '네번째',
                        nemolite_item_fifth: '다섯번째',
                        nemolite_item_sixth: '여섯번째',
                        nemolite_item_seventh: '일곱번째',
                        nemolite_item_eighth: '여덟번째',
                        nemolite_item_ninth: '아홉번째',
                        nemolite_item_tenth: '열번째',
                        nemolite_itme_eleventh: '열한번째',
                        nemolite_item_twelfth: '열두번째',
                        nemolite_item_thirteenth: '열세번째',
                        nemolite_itme_fourteenth: '열네번째',
                        nemolite_item_is_press: '눌려 있을 때',
                        nemolite_item_is_fall: '눌렀을 때',
                        nemolite_item_is_rise: '뗐을 때',
                        nemolite_item_is_both: '누르거나 뗐을 때',
                        nemolite_item_has_press: '눌려 있는가',
                        nemolite_item_has_fall: '눌렀는가',
                        nemolite_item_has_rise: '뗐는가',
                        nemolite_item_has_both: '누르거나 뗐는가',
                        nemolite_item_axis_x: 'X축',
                        nemolite_item_axis_y: 'Y축',
                        nemolite_item_axis_z: 'Z축',
                        nemolite_item_linear_acceleration: '선형 가속도',
                        nemolite_item_off_text: '끄기',
                        nemolite_item_on_text: '켜기',
                        nemolite_item_off_icon: '□',
                        nemolite_item_on_icon: '■',
                        nemolite_item_toggle: '토글',
                        nemolite_item_do_re_mi_song: '도레미송',
                        nemolite_item_an_island_baby: '섬집아기',
                        nemolite_item_twinkle_twinkle_little_star: '작은별',
                        nemolite_item_spring_in_my_hometown: '고향의 봄',
                        nemolite_item_for_elise: '엘리제를 위하여',
                        nemolite_item_celebrated_chop_waltz: '젓가락 행진곡',
                        nemolite_item_happy_birthday_to_you: '생일 축하곡',
                        nemolite_item_lc: 'C(0)',
                        nemolite_item_lcs: 'C#(1)',
                        nemolite_item_ld: 'D(2)',
                        nemolite_item_lds: 'D#(3)',
                        nemolite_item_le: 'E(4)',
                        nemolite_item_lf: 'F(5)',
                        nemolite_item_lfs: 'F#(6)',
                        nemolite_item_lg: 'G(7)',
                        nemolite_item_lgs: 'G#(8)',
                        nemolite_item_la: 'A(9)',
                        nemolite_item_las: 'A#(10)',
                        nemolite_item_lb: 'B(11)',
                        nemolite_item_mc: 'C(12)',
                        nemolite_item_mcs: 'C#(13)',
                        nemolite_item_md: 'D(14)',
                        nemolite_item_mds: 'D#(15)',
                        nemolite_item_me: 'E(16)',
                        nemolite_item_mf: 'F(17)',
                        nemolite_item_mfs: 'F#(18)',
                        nemolite_item_mg: 'G(19)',
                        nemolite_item_mgs: 'G#(20)',
                        nemolite_item_ma: 'A(21)',
                        nemolite_item_mas: 'A#(22)',
                        nemolite_item_mb: 'B(23)',
                        nemolite_item_hc: 'C(24)',
                        nemolite_item_switch: '스위치',
                        nemolite_item_infrared_ray: '적외선',
                        nemolite_item_magnet: '자석',
                        nemolite_item_rotary: '회전',
                        nemolite_item_illuminance: '조도',
                        nemolite_item_sound: '소리',
                        nemolite_item_tilt: '기울기',
                        nemolite_item_pressure: '압력',
                        nemolite_item_heart_rate: '심박',
                        nemolite_item_touch: '터치',
                        nemolite_item_value: '값',
                        nemolite_item_angle: '각도',
                        nemolite_item_absolute_angle: '절대 각도',
                        nemolite_item_turn_value: '회전 수',
                        nemolite_item_east: '동쪽',
                        nemolite_item_west: '서쪽',
                        nemolite_item_south: '남쪽',
                        nemolite_item_north: '북쪽',

                        nemolite_event_button_state: '%1 %2 버튼을 %3',
                        nemolite_event_motion: '%1 %2 이 감지되었을 때',
                        nemolite_is_button_state: '%1 버튼이 %2 ?',
                        nemolite_is_motion_sensing: '%1 이 감지되었는가?',
                        nemolite_is_led_state_value: 'LED X: %1 Y: %2 상태값',
                        nemolite_get_button_analog_value: '%1 버튼의 아날로그 값',
                        nemolite_get_acceleration_value: '가속도 센서 %1 의 값',
                        nemolite_get_illuminance_value: '조도 센서의 값',
                        nemolite_get_convert_value: '%1 의 값 %2 ~ %3 을 %4 ~ %5 으(로) 변환',

                        nemolite_set_display_led_icon: 'LED 아이콘 %1 을 %2 속도로 출력 %3',
                        nemolite_set_display_led_custom_columm:
                            'LED %1 열의 %2%3%4%5%6%7%8 을 %9 속도로 출력 %10',
                        nemolite_set_display_led_text: 'LED %1 문자열을 %2 속도로 출력 %3',
                        nemolite_set_delete_all_led: 'LED 출력 지우기 %1',
                        nemolite_set_toggle_led_pixel: 'LED X: %1 Y: %2 %3 %4',
                        nemolite_set_play_melody: '멜로디 %1 재생하기 %2',
                        nemolite_set_play_melody_until_the_end: '멜로디 %1 끝까지 재생하기 %2',
                        nemolite_set_play_note: '%1 음을 재생하기 %2',
                        nemolite_set_play_note_for_seconds: '%1 음을 %2 초 동안 재생하기 %3',
                        nemolite_set_stop_all_sound: '모든 소리 정지 %1',

                        nemolite_ext_set_extension: '확장센서를 %1 (으)로 설정 %2',
                        nemolite_ext_set_extension_value: '확장센서를 %1 값으로 정하기',
                        nemolite_ext_is_extension_state: '확장센서 %1 ? %2',
                        nemolite_ext_get_extension_anlog_value: '확장센서의 아날로그 값 %1',
                        nemolite_ext_get_extension_custom_value: '확장센서의 %1',
                        nemolite_ext_set_compass_value: '나침반센서를 %1 값으로 정하기',
                        nemolite_ext_get_compass_analog_value: '나침반센서의 아날로그 값 %1',
                        nemolite_ext_get_compass_custom_value: '나침반센서의 %1',
                        memolite_ext_is_compass_direction: '나침반센서의 방향이 %1 인가 ?',
                    },
                    Device: {
                        probo_nemolite_lite: '네모',
                    },
                    Menus: {
                        probo_nemolite_lite: '네모',
                    },
                },
                en: {
                    template: {
                        nemolite_line_emtpy: ' ',
                        nemolite_namo_input: 'NAMO INPUT',
                        nemolite_namo_output: 'NAMO OUTPUT',
                        nemolite_namo_extension: 'NAMO EXTENSION',

                        nemolite_item_s1: 'S1',
                        nemolite_item_s2: 'S2',
                        nemolite_item_s3: 'S3',
                        nemolite_item_s4: 'S4',
                        nemolite_item_motion_1: 'Tilting forward',
                        nemolite_item_motion_2: 'Tilting back',
                        nemolite_item_motion_3: 'Tilting to the left',
                        nemolite_item_motion_4: 'Tilting to the right',
                        nemolite_item_motion_5: 'Put it up',
                        nemolite_item_motion_6: 'Put it down',
                        nemolite_item_motion_7: 'Standing up',
                        nemolite_item_motion_8: 'Impacted',
                        nemolite_item_smile: 'Smile',
                        nemolite_item_not_much: 'Not much',
                        nemolite_item_good: 'Good',
                        nemolite_item_bad: 'Bad',
                        nemolite_item_wink: 'Wink',
                        nemolite_item_cry: 'Cry',
                        nemolite_item_absurd: 'Absurd',
                        nemolite_item_peck: 'Peck',
                        nemolite_item_arrow_1: 'Arrow 1',
                        nemolite_item_arrow_2: 'Arrow 2',
                        nemolite_item_arrow_3: 'Arrow 3',
                        nemolite_item_arrow_4: 'Arrow 4',
                        nemolite_item_arrow_5: 'Arrow 5',
                        nemolite_item_arrow_6: 'Arrow 6',
                        nemolite_item_arrow_7: 'Arrow 7',
                        nemolite_item_arrow_8: 'Arrow 8',
                        nemolite_item_spade: 'Spade',
                        nemolite_item_club: 'Club',
                        nemolite_item_diamond: 'Diamond',
                        nemolite_item_heart: 'Heart',
                        nemolite_item_circle: 'Circle',
                        nemolite_item_x: 'X',
                        nemolite_item_triangle: 'Triangle',
                        nemolite_item_square: 'Square',
                        nemolite_item_note_1: 'note 1',
                        nemolite_item_note_2: 'note 2',
                        nemolite_item_note_3: 'note 3',
                        nemolite_item_dice_1: 'dice 1',
                        nemolite_item_dice_2: 'dice 2',
                        nemolite_item_dice_3: 'dice 3',
                        nemolite_item_dice_4: 'dice 4',
                        nemolite_item_dice_5: 'dice 5',
                        nemolite_item_dice_6: 'dice 6',
                        nemolite_item_first: 'first',
                        nemolite_item_second: 'second',
                        nemolite_item_third: 'third',
                        nemolite_item_fourth: 'fourth',
                        nemolite_item_fifth: 'fifth',
                        nemolite_item_sixth: 'sixth',
                        nemolite_item_seventh: 'seventh',
                        nemolite_item_eighth: 'eighth',
                        nemolite_item_ninth: 'ninth',
                        nemolite_item_tenth: 'tenth',
                        nemolite_itme_eleventh: 'eleventh',
                        nemolite_item_twelfth: 'twelfth',
                        nemolite_item_thirteenth: 'thirteenth',
                        nemolite_itme_fourteenth: 'fourteenth',
                        nemolite_item_is_press: 'is pressing',
                        nemolite_item_is_fall: 'pressed',
                        nemolite_item_is_rise: 'released',
                        nemolite_item_is_both: 'pressed or released',
                        nemolite_item_has_press: 'has be pressing',
                        nemolite_item_has_fall: 'has pressed',
                        nemolite_item_has_rise: 'has released',
                        nemolite_item_has_both: 'has pressed or has released',
                        nemolite_item_axis_x: 'X axis',
                        nemolite_item_axis_y: 'Y axis',
                        nemolite_item_axis_z: 'Z axis',
                        nemolite_item_linear_acceleration: 'linear acceleration',
                        nemolite_item_off_text: 'off',
                        nemolite_item_on_text: 'on',
                        nemolite_item_off_icon: '□',
                        nemolite_item_on_icon: '■',
                        nemolite_item_toggle: 'toggle',
                        nemolite_item_do_re_mi_song: 'Do Re Mi Song',
                        nemolite_item_an_island_baby: 'An Island Baby',
                        nemolite_item_twinkle_twinkle_little_star: 'Twinkle Twinkle Little Star',
                        nemolite_item_spring_in_my_hometown: 'Spring in My Hometwon',
                        nemolite_item_for_elise: 'For Elise',
                        nemolite_item_celebrated_chop_waltz: 'Celebrate Chop Waltz',
                        nemolite_item_happy_birthday_to_you: 'Happy Birthday To You',
                        nemolite_item_lc: 'C(0)',
                        nemolite_item_lcs: 'C#(1)',
                        nemolite_item_ld: 'D(2)',
                        nemolite_item_lds: 'D#(3)',
                        nemolite_item_le: 'E(4)',
                        nemolite_item_lf: 'F(5)',
                        nemolite_item_lfs: 'F#(6)',
                        nemolite_item_lg: 'G(7)',
                        nemolite_item_lgs: 'G#(8)',
                        nemolite_item_la: 'A(9)',
                        nemolite_item_las: 'A#(10)',
                        nemolite_item_lb: 'B(11)',
                        nemolite_item_mc: 'C(12)',
                        nemolite_item_mcs: 'C#(13)',
                        nemolite_item_md: 'D(14)',
                        nemolite_item_mds: 'D#(15)',
                        nemolite_item_me: 'E(16)',
                        nemolite_item_mf: 'F(17)',
                        nemolite_item_mfs: 'F#(18)',
                        nemolite_item_mg: 'G(19)',
                        nemolite_item_mgs: 'G#(20)',
                        nemolite_item_ma: 'A(21)',
                        nemolite_item_mas: 'A#(22)',
                        nemolite_item_mb: 'B(23)',
                        nemolite_item_hc: 'C(24)',
                        nemolite_item_switch: 'switch',
                        nemolite_item_infrared_ray: 'infrared ray',
                        nemolite_item_magnet: 'magnet',
                        nemolite_item_rotary: 'rotary',
                        nemolite_item_illuminance: 'illuminance',
                        nemolite_item_sound: 'sound',
                        nemolite_item_tilt: 'tilt',
                        nemolite_item_pressure: 'pressure',
                        nemolite_item_heart_rate: 'heart rate',
                        nemolite_item_touch: 'touch',
                        nemolite_item_value: 'value',
                        nemolite_item_angle: 'angle',
                        nemolite_item_absolute_angle: 'absolute angle',
                        nemolite_item_turn_value: 'rotary value',
                        nemolite_item_east: 'East',
                        nemolite_item_west: 'West',
                        nemolite_item_south: 'South',
                        nemolite_item_north: 'North',

                        nemolite_event_button_state: 'When %1 button %2',
                        nemolite_event_motion: 'When %1 motion is detected',
                        nemolite_is_button_state: 'Is %1 button %2 ?',
                        nemolite_is_motion_sensing: 'Is %1 motion detected',
                        nemolite_is_led_state_value: ' LED X: %1 Y: %2 state',
                        nemolite_get_button_analog_value: 'Analog value of %1 button',
                        nemolite_get_acceleration_value: 'Acceleration sensor %1 value',
                        nemolite_get_illuminance_value: 'Value of illuminance sensor',
                        nemolite_get_convert_value:
                            'change the value of %1 from %2 ~ %3 to %4 ~ %5',

                        nemolite_set_display_led_icon: 'LED icon %1 output %2 speed %3',
                        nemolite_set_display_led_custom_columm:
                            'LED %1 columm %2%3%4%5%6%7%8 at %9 speed %10',
                        nemolite_set_display_led_text: 'LED %1 string output %2 speed %3',
                        nemolite_set_delete_all_led: 'Clear LED output %1',
                        nemolite_set_toggle_led_pixel: 'LED X: %1 Y: %2 %3 %4',
                        nemolite_set_play_melody: 'Play melody %1 %2',
                        nemolite_set_play_melody_until_the_end: 'melody %1 play to the end %2',
                        nemolite_set_play_note: 'Playing note %1 %2',
                        nemolite_set_play_note_for_seconds: 'Play note %1 for %2 second(s) %3',
                        nemolite_set_stop_all_sound: 'Stop all sound %1',

                        nemolite_ext_set_extension: 'Extension type set %1 %2',
                        nemolite_ext_set_extension_value: 'Extension sensor set %1 value ? %2',
                        nemolite_ext_is_extension_state: 'Is extended sensor %1',
                        nemolite_ext_get_extension_anlog_value: 'Value of extended sensor %1',
                        nemolite_ext_get_extension_custom_value: 'Exansion sensor value of %1',
                        nemolite_ext_set_compass_value: 'Compass sensor value Set %1',
                        nemolite_ext_get_compass_analog_value: 'Value of compass sensor %1',
                        nemolite_ext_get_compass_custom_value: 'compass sensor value of %1',
                        memolite_ext_is_compass_direction: 'Does the rotation sensor point %1 ?',
                    },
                    Device: {
                        probo_nemolite_lite: 'Nemo',
                    },
                    Menus: {
                        probo_nemolite_lite: 'Nemo',
                    },
                },
            };
        }
        //endregion

        // 시작하기 및 정지하기 시 기기상태를 초기화한다.
        //region setZero
        setZero() {
            this.sendPacket = new Uint8Array(SEND_PACKET_LENGTH).fill(0);
            this.getData = {
                accel: {
                    x: 0,
                    y: 0,
                    z: 0,
                    linear: 0,
                },
                motion: {
                    front: 0,
                    back: 0,
                    left: 0,
                    right: 0,
                    up: 0,
                    down: 0,
                    standup: 0,
                    impact: 0,
                },
                illuminance: 0,
                extension: {
                    analog: 0,
                    digital: 0, // logic
                    fall: 0, // falling edge
                    rise: 0, // rising edge
                    both: 0, // change edge
                },
                switch: {
                    s1: {
                        analog: 0,
                        digital: 0,
                        fall: 0,
                        rise: 0,
                        both: 0,
                    },
                    s2: {
                        analog: 0,
                        digital: 0,
                        fall: 0,
                        rise: 0,
                        both: 0,
                    },
                    s3: {
                        analog: 0,
                        digital: 0,
                        fall: 0,
                        rise: 0,
                        both: 0,
                    },
                    s4: {
                        analog: 0,
                        digital: 0,
                        fall: 0,
                        rise: 0,
                        both: 0,
                    },
                },
                ledRead: {
                    state: 0,
                    count: 0,
                },
                compass: 0,
                timeCheck: {
                    led: 0,
                    sound: 0,
                    extCount: 0,
                },
            };

            this.setData = {
                ledColumm: {
                    pixel: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    speed: 0,
                },
                ledPixel: {
                    index: 0,
                    state: 0,
                },
                ledIcon: {
                    index: 0,
                    speed: 0,
                },
                ledText: {
                    text: '',
                    speed: 0,
                },
                ledClear: 1,
                extension: 0,
                melody: {
                    play: 1,
                    title: 0,
                },
                note: {
                    play: 1,
                    pitch: 0,
                },
                ledRead: 0,
            };

            this.lastData = {
                ledColumm: {
                    pixel: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    speed: 0,
                },
                ledIcon: {
                    index: 0,
                    speed: 0,
                },
                ledRead: {
                    state: 0,
                    count: 0,
                },
                ledText: {
                    text: '',
                    speed: 0,
                },
                timeCheck: {
                    led: 0,
                    sound: 0,
                    extCount: 0,
                },
            };

            this.state = {
                led: 0,
                sound: 'm'.charCodeAt(),
                note: 0,
                soundBlockId: 0,
                noteBlockId: 0,
                extCount: 0,
            };

            this.extension = {
                bias: 0,
                value: 0,
                angle: 0,
                absolutAngle: 0,
                turnCount: 0,
            };

            this.compass = {
                lastAnalog: 0,
                bias: 0,
                value: 0,
                angle: 0,
                absolutAngle: 0,
                absolutTurnCount: 0,
                turnCount: 0,
                direction: 0,
            };

            this.setZeroFlag = true;

            if (Entry.hwLite && Entry.hwLite.serial) {
                Entry.hwLite.serial.update();
                this.state.sound = 0;
            }
        }
        //endregion

        // 하드웨어 연결 후 초기화한다.
        //region initalHandshake
        async initialHandshake() {
            const modePacket = new Uint8Array(2).fill(0);
            modePacket[0] = 0x63;
            modePacket[1] = 0x36;

            while (true) {
                const response = await Entry.hwLite.serial.sendAsyncWithThrottle(modePacket);

                if (response[0] !== NEMOLITE_INDEX) {
                    modePacket[0] = 0x24;
                    modePacket[1] = 0x42;
                } else {
                    this.version = response.length === 1 ? 0 : response[1];
                    break;
                }
                await Entry.Utils.sleep(100);
            }

            Entry.addEventListener('run', this.handleButtonEventInterval.bind(this));
            Entry.addEventListener('run', this.handleMotionlEventInterval.bind(this));
            Entry.addEventListener('beforeStop', () => {
                if (this.buttonEventIntervalId) {
                    clearInterval(this.buttonEventIntervalId);
                    this.buttonEventIntervalId = null;
                }
                if (this.motionEventIntervalId) {
                    clearInterval(this.motionEventIntervalId);
                    this.motionEventIntervalId = null;
                }
            });

            this.setZero();

            if (this.version === 0) {
                const packet = await Entry.hwLite.serial.reader.read();
                this.version = packet.value[0];
                if (this.version !== RELEASE_VERSION) {
                    const ko = `펌웨어를 업데이트 하세요.\n`;
                    const en = `(Please, Update your firmware.)\n`;
                    const version = ` - 현재(now): v.${this.version}\n - 최신(latest): v.${RELEASE_VERSION}`;
                    alert(`${ko}${en}${version}`);
                }
            }

            return true;
        }
        //endregion

        handleButtonEventInterval() {
            if (this.buttonEventIntervalId) {
                clearInterval(this.buttonEventIntervalId);
            }
            this.buttonEventIntervalId = setInterval(() => {
                const currentState = this.buttonEvent.bind(this);
                currentState();
            }, EVENT_INTERVAL);
        }

        handleMotionlEventInterval() {
            if (this.motionEventIntervalId) {
                clearInterval(this.motionEventIntervalId);
            }
            this.motionEventIntervalId = setInterval(() => {
                const currentState = this.motionEvent.bind(this);
                currentState();
            }, EVENT_INTERVAL);
        }

        // 디바이스에서 값을 읽어온다.
        //region handleLocalData
        handleLocalData(buffer) {
            buffer.forEach((b) => this.qEnqueue(b));

            if (this._recoverTimeoutId) {
                clearTimeout(this._recoverTimeoutId);
            }

            while (this.qCount() >= this.receivedPacket.length) {
                if (!this.process) {
                    while (this.qCount() > 0) {
                        if (this.receivedPacket[0] !== 0xcd) {
                            this.receivedPacket[0] = this.qDequeue();
                        } else if (this.receivedPacket[1] !== 0xda) {
                            this.receivedPacket[1] = this.qDequeue();
                        } else {
                            this.receivedPacket[2] = this.qDequeue();
                            this.pLength = this.receivedPacket[2] + 3;
                            this.process = true;
                            break;
                        }
                    }
                }

                if (this.process && this.qCount() >= this.pLength) {
                    for (let i = 3; i < this.pLength; i++) {
                        this.receivedPacket[i] = this.qDequeue();
                    }

                    if (
                        this.receivedPacket[this.pLength - 1] === this.checksum(this.receivedPacket)
                    ) {
                        // 상태 확인 코드이므로 가장 먼저 해석
                        this.parsingTimeCheck(this.receivedPacket);

                        this.pasingAccelA(this.receivedPacket);
                        this.pasingAccelD(this.receivedPacket);
                        this.pasingIllumination(this.receivedPacket);
                        this.parsingExtensionAnalog(this.receivedPacket);
                        this.parsingExtensionDigital(this.receivedPacket);
                        this.pasingSwitchAnalog(this.receivedPacket);
                        this.parsingSwitchDigital(this.receivedPacket);
                        this.parsingLedRead(this.receivedPacket);
                        this.parsingCompass(this.receivedPacket);
                    }

                    this.receivedPacket = new Uint8Array(RECEIVED_PACKET_LENGTH).fill(-1);
                    this.process = false;
                    this.sendFlag = true;
                    this.pLength = 0;

                    if (this.setZeroFlag) {
                        this.setZeroFlag = false;
                    }
                }
            }

            if (this.sendFlag) {
                if (this._requestTimeoutId) {
                    clearTimeout(this._requestTimeoutId);
                }
                this._requestTimeoutId = setTimeout(
                    () => {
                        if (Entry.hwLite && Entry.hwLite.serial) {
                            Entry.hwLite.serial.update();
                            this.sendFlag = false;
                            this._recoverTimeoutId = setTimeout(() => {
                                this.sendFlag = true;
                            }, SERIAL_INTERVAL * 3);
                        }
                    },
                    SERIAL_INTERVAL
                );
            }
        } //endregion

        //디바이스에 값을 쓴다.
        //region requestLocalData
        requestLocalData() {
            if (this.sendFlag) {
                const led = this.addLedClear();
                if (!led) {
                    this.addLedColumm();
                    this.addLedPixel();
                    this.addLedSet();
                    this.addText();
                }
                this.addSetExtension();
                this.addMelody();
                this.addBuzzer();
                this.addLedRead();

                const packet = this.PreparePacket();
                const sendSize = this.sendPacket.length;
                const textSize = this.textPacket.length;

                for (let i = 0; i < sendSize; i++) {
                    packet[i] = this.sendPacket[i];
                }
                for (let i = 0; i < textSize; i++) {
                    const index = sendSize + i;
                    packet[index] = this.textPacket[i];
                }
                packet[packet.length - 1] = this.checksum(packet);

                this.sendPacket = new Uint8Array(sendSize).fill(0);
                this.textPacket = new Uint8Array(0).fill(0);

                return packet;
            }
        } //endregion

        qEnqueue(data) {
            this.qBuffer[this.qRear] = data;
            this.qRear = (this.qRear + 1) % this.qSize;
        }

        qDequeue() {
            const data = this.qBuffer[this.qFront];
            this.qBuffer[this.qFront] = -1;
            this.qFront = (this.qFront + 1) % this.qSize;
            return data;
        }

        qCount() {
            return this.qFront <= this.qRear
                ? this.qRear - this.qFront
                : this.qSize - this.qFront + this.qRear;
        }

        checksum(packet) {
            let checker = 0;
            const length = packet[2] + 2;
            for (let i = 3; i < length; i++) {
                checker += packet[i];
            }
            return checker & 0xff;
        }

        getMonitorPort() {
            const monitor = {
                AA1: this.device.switch.s1.analog,
                AA2: this.device.switch.s2.analog,
                AA3: this.device.switch.s3.analog,
                AA4: this.device.switch.s4.analog,
            };

            return { ...monitor };
        }

        pasingAccelA(buffer) {
            for (let i = 0; i < 3; i++) {
                const lowData = buffer[i * 2 + 3];
                const highData = buffer[i * 2 + 4];
                const temp =
                    (lowData & 0x80) === 0x80
                        ? (0x10000 - ((lowData << 8) | highData)) * -1
                        : (lowData << 8) | highData;
                const key = this.getAccelNameKey(i);
                this.getData.accel[key] = temp / 10.0;
            }
            this.getData.accel.linear = buffer[this.receivedIndex.accelALi];
        }

        pasingAccelD(buffer) {
            const data = buffer[this.receivedIndex.accelD];
            for (let i = 0; i < 8; i++) {
                const key = this.getMotionNameKey(i);
                this.getData.motion[key] = (data >> (7 - i)) & 0x01;
            }
        }

        pasingIllumination(buffer) {
            this.getData.illuminance = buffer[this.receivedIndex.illuminance];
        }

        parsingExtensionAnalog(buffer) {
            const analog = buffer[this.receivedIndex.extensionAnalog];

            this.getData.extension.analog = analog;

            this.extension.value = analog + this.state.extCount * 255 + this.extension.bias;
            this.extension.angle = this.getConvertMap(this.extension.value % 255, 0, 255, 0, 360);
            this.extension.absolutAngle = this.getConvertMap(analog, 0, 255, 0, 360);
            this.extension.turnCount = Math.round(this.extension.value / 255);
        }

        parsingExtensionDigital(buffer) {
            for (let i = 0; i < 4; i++) {
                const key = this.getButtonStateKey(i);
                this.getData.extension[key] =
                    (buffer[this.receivedIndex.extensionDigital] >> (7 - i)) & 0x01;
            }
        }

        pasingSwitchAnalog(buffer) {
            for (let i = 0; i < 4; i++) {
                const nameKey = this.getButtonNameKey(i);
                this.getData.switch[nameKey].analog = buffer[this.receivedIndex.switchAnalog1 + i];
            }
        }

        parsingSwitchDigital(buffer) {
            for (let i = 0; i < 4; i++) {
                const nameKey = this.getButtonNameKey(i);
                const value = [
                    (buffer[this.receivedIndex.switchDigitalAB] >> (i + 4)) & 0x01,
                    (buffer[this.receivedIndex.switchDigitalAB] >> i) & 0x01,
                    (buffer[this.receivedIndex.switchDigitalCD] >> (i + 4)) & 0x01,
                    (buffer[this.receivedIndex.switchDigitalCD] >> i) & 0x01,
                ];
                for (let j = 0; j < 4; j++) {
                    const stateKey = this.getButtonStateKey(j);
                    this.getData.switch[nameKey][stateKey] = value[j];
                }
            }
        }

        parsingLedRead(buffer) {
            const state = (buffer[this.receivedIndex.ledRead] >> 7) & 0x01;
            const counter = buffer[this.receivedIndex.ledRead] & 0x7f;

            if (this.lastData.ledRead.count != counter) {
                this.getData.ledRead.state = state;
                this.getData.ledRead.count = counter;

                this.lastData.ledRead.state = state;
                this.lastData.ledRead.count = counter;
            }
        }

        parsingCompass(buffer) {
            const analog = buffer[this.receivedIndex.compass];
            this.getData.compass = analog;
            // 회전수를 먼저 구한다.
            if (analog < this.compass.lastAnalog - 150) {
                this.compass.absolutTurnCount++;
            } else if (analog > this.compass.lastAnalog + 150) {
                this.compass.absolutTurnCount--;
            }
            this.compass.value = analog + this.compass.absolutTurnCount * 255 + this.compass.bias;
            this.compass.angle = this.getConvertMap(this.compass.value % 255, 0, 255, 0, 360);
            this.compass.absolutAngle = this.getConvertMap(analog, 0, 255, 0, 360);
            this.compass.turnCount = Math.round(this.compass.value / 255);
            if (35 <= analog && analog < 99) {
                this.compass.direction = 0; // 동
            } else if (99 <= analog && analog < 163) {
                this.compass.direction = 2; // 남
            } else if (163 <= analog && analog < 227) {
                this.compass.direction = 1; // 서
            } else {
                // 227-34
                this.compass.direction = 3; // 북
            }

            this.compass.lastAnalog = analog;
        }

        parsingTimeCheck(buffer) {
            const key = ['led', 'sound', 'extCount'];

            for (let i = 0; i < 3; i++) {
                this.getData.timeCheck[key[i]] =
                    (buffer[this.receivedIndex.timeCheck] >> (6 - i * 2)) & 0x03;

                if (this.setZeroFlag) {
                    this.lastData.timeCheck[key[i]] = this.getData.timeCheck[key[i]];
                    if (i === 2) {
                        this.state[key[i]] = 0;
                    }
                } else {
                    if (this.getData.timeCheck[key[i]] !== this.lastData.timeCheck[key[i]]) {
                        if (i === 2) {
                            //+방향 일 때: 0->1->2->3->0->...
                            //-방향 일 때: 0->3->2->1->0->...
                            const diff =
                                this.getData.timeCheck[key[i]] - this.lastData.timeCheck[key[i]];
                            if (diff === 1 || diff === -3) {
                                this.state[key[i]]++;
                            } else if (diff === -1 || diff === 3) {
                                this.state[key[i]]--;
                            }
                        } else {
                            this.state[key[i]] = 0;
                        }
                        this.lastData.timeCheck[key[i]] = this.getData.timeCheck[key[i]];
                    }
                }
            }
        }

        PreparePacket() {
            const sendSize = this.sendPacket.length;
            const textSize = this.textPacket.length;
            const packetSize = sendSize + textSize + 1;

            this.sendPacket[0] = 0xad;
            this.sendPacket[1] = 0xda;
            this.sendPacket[2] = packetSize - 3;

            return new Uint8Array(packetSize).fill(0);
        }

        addLedColumm() {
            if (this.state.led === 'c'.charCodeAt()) {
                let nextPage = false;
                this.state.led = 2;

                for (let i = 0; i < 14; i++) {
                    const index = this.sendIndex.led7x1 + i;
                    this.sendPacket[index] = this.setData.ledColumm.pixel[i];
                    if (index > 7 && this.sendPacket[index] > 0) {
                        nextPage = true;
                    }
                }
                this.sendPacket[this.sendIndex.ledMs0] = (this.setData.ledColumm.speed >> 8) & 0x7f;
                this.sendPacket[this.sendIndex.ledMs1] = this.setData.ledColumm.speed & 0xff;

                this.sendPacket[this.sendIndex.led7x1] |= 0x80;
                if (nextPage) {
                    this.sendPacket[this.sendIndex.led7x8] |= 0x80;
                }

                this.lastData.ledColumm.pixel = this.setData.ledColumm.pixel;
                this.lastData.ledColumm.speed = this.setData.ledColumm.speed;
            }
        }

        addLedClear() {
            if (this.setData.ledClear === 1) {
                this.setData.ledClear = 0;
                this.sendPacket[this.sendIndex.led7x1] = 0x80;
                return true;
            } else {
                return false;
            }
        }

        addLedPixel() {
            const state = this.setData.ledPixel.state;
            if (state) {
                const index = this.setData.ledPixel.index;
                this.sendPacket[this.sendIndex.ledPixel] = ((state & 0x03) << 6) | (index & 0x3f);
                this.setData.ledPixel.index = 0;
                this.setData.ledPixel.state = 0;
            }
        }

        addLedSet() {
            if (this.state.led === 'i'.charCodeAt()) {
                this.state.led = 2;
                this.sendPacket[this.sendIndex.ledMs0] = (this.setData.ledIcon.speed >> 8) & 0xff;
                this.sendPacket[this.sendIndex.ledMs1] = this.setData.ledIcon.speed & 0xff;
                this.sendPacket[this.sendIndex.ledSet] = this.setData.ledIcon.index;
                this.lastData.ledIcon.index = this.setData.ledIcon.index;
                this.lastData.ledIcon.speed = this.setData.ledIcon.speed;
            }
        }

        addSetExtension() {
            this.sendPacket[this.sendIndex.portSet] = this.setData.extension;
        }

        addMelody() {
            if (this.state.sound === 'm'.charCodeAt()) {
                this.state.sound = 2;
                this.sendPacket[this.sendIndex.melody] =
                    (this.setData.melody.play << 7) | (this.setData.melody.title & 0x7f);
            }
        }

        addBuzzer() {
            if (this.state.note === 1) {
                this.state.note = 2;
                const pitch = this.setData.note.pitch;
                if (0 <= pitch && pitch <= 47) {
                    const n = (pitch / 12) & 0xff;
                    const v = pitch % 12;
                    let r = 2;
                    for (let i = 0; i < n; i++) {
                        r *= 2;
                    }
                    const hertz = this.soundKeyArray[v] / r;
                    this.sendPacket[this.sendIndex.buzzer0] =
                        (this.setData.note.play << 7) | ((hertz >> 8) & 0x7f);
                    this.sendPacket[this.sendIndex.buzzer1] = hertz & 0xff;
                }
            }
        }

        addLedRead() {
            this.sendPacket[this.sendIndex.ledRead] = this.setData.ledRead;
            this.setData.ledRead = 0;
        }

        addText() {
            if (this.state.led === 't'.charCodeAt()) {
                this.state.led = 2;
                const size = this.setData.ledText.text.length;
                const text = this.setData.ledText.text;

                this.textPacket = new Uint8Array(size);

                for (let i = 0; i < size; i++) {
                    this.textPacket[i] = text[i].charCodeAt();
                }
                this.sendPacket[this.sendIndex.textSize] = size;
                this.sendPacket[this.sendIndex.ledMs0] = (this.setData.ledText.speed >> 8) & 0x7f;
                this.sendPacket[this.sendIndex.ledMs1] = this.setData.ledText.speed & 0xff;

                this.lastData.ledText.text = text;
                this.lastData.ledText.speed = this.setData.ledText.speed;
                this.setData.ledText.text = '';
            }
        }

        getButtonNameKey(data) {
            const key = ['s1', 's2', 's3', 's4'];
            const num = Number(data);
            if (0 <= num && num <= 3) {
                return key[num];
            } else {
                switch (data) {
                    case Lang.template.nemolite_item_s1:
                        return key[0];
                    case Lang.template.nemolite_item_s2:
                        return key[1];
                    case Lang.template.nemolite_item_s3:
                        return key[2];
                    case Lang.template.nemolite_item_s4:
                        return key[3];
                    default:
                        return data;
                }
            }
        }

        getButtonStateKey(data) {
            const key = ['digital', 'fall', 'rise', 'both'];
            const num = Number(data);
            if (0 <= num && num <= 3) {
                return key[num];
            } else {
                switch (data) {
                    case Lang.template.nemolite_item_is_press:
                    case Lang.template.nemolite_item_has_press:
                        return key[0];
                    case Lang.template.nemolite_item_is_fall:
                    case Lang.template.nemolite_item_has_fall:
                        return key[1];
                    case Lang.template.nemolite_item_is_rise:
                    case Lang.template.nemolite_item_has_rise:
                        return key[2];
                    case Lang.template.nemolite_item_is_both:
                    case Lang.template.nemolite_item_has_both:
                        return key[3];
                    default:
                        return data;
                }
            }
        }

        getMotionNameKey(data) {
            const key = ['front', 'back', 'left', 'right', 'up', 'down', 'standup', 'impact'];
            const num = Number(data);
            if (0 <= num && num <= 7) {
                return key[num];
            } else {
                switch (data) {
                    case Lang.template.nemolite_item_motion_1:
                        return key[0];
                    case Lang.template.nemolite_item_motion_2:
                        return key[1];
                    case Lang.template.nemolite_item_motion_3:
                        return key[2];
                    case Lang.template.nemolite_item_motion_4:
                        return key[3];
                    case Lang.template.nemolite_item_motion_5:
                        return key[4];
                    case Lang.template.nemolite_item_motion_6:
                        return key[5];
                    case Lang.template.nemolite_item_motion_7:
                        return key[6];
                    case Lang.template.nemolite_item_motion_8:
                        return key[7];
                    default:
                        return data;
                }
            }
        }

        getAccelNameKey(data) {
            const key = ['x', 'y', 'z', 'linear'];
            const num = Number(data);
            if (0 <= num && num <= 3) {
                return key[num];
            } else {
                switch (data) {
                    case Lang.template.nemolite_item_axis_x:
                        return key[0];
                    case Lang.template.nemolite_item_axis_y:
                        return key[1];
                    case Lang.template.nemolite_item_axis_z:
                        return key[2];
                    case Lang.template.nemolite_item_linear_acceleration:
                        return key[3];
                    default:
                        return data;
                }
            }
        }

        getLedSpeedValue(data) {
            const num = Number(data);
            switch (num) {
                case 0:
                    return 0;
                case 1:
                    return 500;
                case 2:
                    return 200;
                case 3:
                    return 100;
                case 4:
                    return 50;
                case 5:
                    return 20;
                default:
                    return num < 0 ? 0 : 500;
            }
        }

        getLedIconIndexValue(data) {
            const num = Number(data);
            if (0 <= num && num <= 32) {
                return num + 1;
            } else {
                switch (data) {
                    case Lang.template.nemolite_item_smile:
                        return 1;
                    case Lang.template.nemolite_item_not_much:
                        return 2;
                    case Lang.template.nemolite_item_good:
                        return 3;
                    case Lang.template.nemolite_item_bad:
                        return 4;
                    case Lang.template.nemolite_item_wink:
                        return 5;
                    case Lang.template.nemolite_item_cry:
                        return 6;
                    case Lang.template.nemolite_item_absurd:
                        return 7;
                    case Lang.template.nemolite_item_peck:
                        return 8;
                    case Lang.template.nemolite_item_arrow_1:
                        return 9;
                    case Lang.template.nemolite_item_arrow_2:
                        return 10;
                    case Lang.template.nemolite_item_arrow_3:
                        return 11;
                    case Lang.template.nemolite_item_arrow_4:
                        return 12;
                    case Lang.template.nemolite_item_arrow_5:
                        return 13;
                    case Lang.template.nemolite_item_arrow_6:
                        return 14;
                    case Lang.template.nemolite_item_arrow_7:
                        return 15;
                    case Lang.template.nemolite_item_arrow_8:
                        return 16;
                    case Lang.template.nemolite_item_spade:
                        return 17;
                    case Lang.template.nemolite_item_club:
                        return 18;
                    case Lang.template.nemolite_item_diamond:
                        return 19;
                    case Lang.template.nemolite_item_heart:
                        return 20;
                    case Lang.template.nemolite_item_circle:
                        return 21;
                    case Lang.template.nemolite_item_x:
                        return 22;
                    case Lang.template.nemolite_item_triangle:
                        return 23;
                    case Lang.template.nemolite_item_square:
                        return 24;
                    case Lang.template.nemolite_item_note_1:
                        return 25;
                    case Lang.template.nemolite_item_note_2:
                        return 26;
                    case Lang.template.nemolite_item_note_3:
                        return 27;
                    case Lang.template.nemolite_item_dice_1:
                        return 28;
                    case Lang.template.nemolite_item_dice_2:
                        return 29;
                    case Lang.template.nemolite_item_dice_3:
                        return 30;
                    case Lang.template.nemolite_item_dice_4:
                        return 31;
                    case Lang.template.nemolite_item_dice_5:
                        return 32;
                    case Lang.template.nemolite_item_dice_6:
                        return 33;
                    default:
                        return data;
                }
            }
        }

        getLedColummKey(data) {
            const num = Number(data);
            if (0 <= num && num <= 13) {
                return num;
            } else {
                switch (data) {
                    case Lang.template.nemolite_item_first:
                        return 0;
                    case Lang.template.nemolite_item_second:
                        return 1;
                    case Lang.template.nemolite_item_third:
                        return 2;
                    case Lang.template.nemolite_item_fourth:
                        return 3;
                    case Lang.template.nemolite_item_fifth:
                        return 4;
                    case Lang.template.nemolite_item_sixth:
                        return 5;
                    case Lang.template.nemolite_item_seventh:
                        return 6;
                    case Lang.template.nemolite_item_eighth:
                        return 7;
                    case Lang.template.nemolite_item_ninth:
                        return 8;
                    case Lang.template.nemolite_item_tenth:
                        return 9;
                    case Lang.template.nemolite_itme_eleventh:
                        return 10;
                    case Lang.template.nemolite_item_twelfth:
                        return 11;
                    case Lang.template.nemolite_item_thirteenth:
                        return 12;
                    case Lang.template.nemolite_itme_fourteenth:
                        return 13;
                    default:
                        return data;
                }
            }
        }

        getPitchKey(data) {
            const num = Number(data);
            if (0 <= num && num <= 32) {
                return num + 1;
            } else {
                switch (data) {
                    case Lang.template.nemolite_item_lc:
                        return 0;
                    case Lang.template.nemolite_item_lcs:
                        return 1;
                    case Lang.template.nemolite_item_ld:
                        return 2;
                    case Lang.template.nemolite_item_lds:
                        return 3;
                    case Lang.template.nemolite_item_le:
                        return 4;
                    case Lang.template.nemolite_item_lf:
                        return 5;
                    case Lang.template.nemolite_item_lfs:
                        return 6;
                    case Lang.template.nemolite_item_lg:
                        return 7;
                    case Lang.template.nemolite_item_lgs:
                        return 8;
                    case Lang.template.nemolite_item_la:
                        return 9;
                    case Lang.template.nemolite_item_las:
                        return 10;
                    case Lang.template.nemolite_item_lb:
                        return 11;
                    case Lang.template.nemolite_item_mc:
                        return 12;
                    case Lang.template.nemolite_item_mcs:
                        return 13;
                    case Lang.template.nemolite_item_md:
                        return 14;
                    case Lang.template.nemolite_item_mds:
                        return 15;
                    case Lang.template.nemolite_item_me:
                        return 16;
                    case Lang.template.nemolite_item_mf:
                        return 17;
                    case Lang.template.nemolite_item_mfs:
                        return 18;
                    case Lang.template.nemolite_item_mg:
                        return 19;
                    case Lang.template.nemolite_item_mgs:
                        return 20;
                    case Lang.template.nemolite_item_ma:
                        return 21;
                    case Lang.template.nemolite_item_mas:
                        return 22;
                    case Lang.template.nemolite_item_mb:
                        return 23;
                    case Lang.template.nemolite_item_hc:
                        return 24;
                    default:
                        return data;
                }
            }
        }

        getSwitchValue(data) {
            const num = Number(data);
            if (0 <= num && num <= 2) {
                return num + 1;
            } else {
                switch (data) {
                    case Lang.template.nemolite_item_off_text:
                    case Lang.template.nemolite_item_off_icon:
                        return 1;
                    case Lang.template.nemolite_item_on_text:
                    case Lang.template.nemolite_item_on_icon:
                        return 2;
                    case Lang.template.nemolite_item_toggle:
                        return 3;
                    default:
                        return data;
                }
            }
        }

        getMelodyKey(data) {
            const num = Number(data);
            if (0 <= num && num <= 6) {
                return num + 1;
            } else {
                switch (data) {
                    case Lang.template.nemolite_item_do_re_mi_song:
                        return 1;
                    case Lang.template.nemolite_item_an_island_baby:
                        return 2;
                    case Lang.template.nemolite_item_twinkle_twinkle_little_star:
                        return 2;
                    case Lang.template.nemolite_item_spring_in_my_hometown:
                        return 4;
                    case Lang.template.nemolite_item_for_elise:
                        return 5;
                    case Lang.template.nemolite_item_celebrated_chop_waltz:
                        return 6;
                    case Lang.template.nemolite_item_happy_birthday_to_you:
                        return 7;
                    default:
                        return data;
                }
            }
        }

        getExtensionKey(data) {
            switch (data) {
                case '0': // 스위치
                case '1': // 적외선
                case '2': // 자석
                case Lang.template.nemolite_item_switch:
                case Lang.template.nemolite_item_infrared_ray:
                case Lang.template.nemolite_item_magnet:
                    return 1;
                case '3': // 회전
                case Lang.template.nemolite_item_rotary:
                    return 7;
                case '4': // 조도
                case Lang.template.nemolite_item_illuminance:
                    return 2;
                case '5': // 소리
                case Lang.template.nemolite_item_sound:
                    return 8;
                case '6': // 기울기
                case Lang.template.nemolite_item_tilt:
                    return 4;
                case '7': // 압력
                case Lang.template.nemolite_item_pressure:
                    return 5;
                case '8': // 심박
                case Lang.template.nemolite_item_heart_rate:
                    return 6;
                default:
                    return data;
            }
        }

        getSensorModeKey(data) {
            const key = ['value', 'angle', 'absolutAngle', 'turnCount'];
            const num = Number(data);
            if (0 <= num && num <= 3) {
                return key[num];
            } else {
                switch (data) {
                    case Lang.template.nemolite_item_value:
                        return key[0];
                    case Lang.template.nemolite_item_angle:
                        return key[1];
                    case Lang.template.nemolite_item_absolute_angle:
                        return key[2];
                    case Lang.template.nemolite_item_rotation_value:
                        return key[3];
                    default:
                        return data;
                }
            }
        }

        getDirectionKey(data) {
            const num = Number(data);
            if (0 <= num && num <= 3) {
                return num;
            } else {
                switch (data) {
                    case Lang.template.nemolite_item_east:
                        return 0;
                    case Lang.template.nemolite_item_west:
                        return 1;
                    case Lang.template.nemolite_item_south:
                        return 2;
                    case Lang.template.nemolite_item_north:
                        return 3;
                    default:
                        return data;
                }
            }
        }

        getConvertMap(value, inMin, inMax, outMin, outMax) {
            return Math.round(((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin);
        }

        delayCallReturnUsingTime(script, ms, startCode, stopCode) {
            if (!script.isStart) {
                script.isStart = true;
                script.timeFlag = 1;
                const fps = Entry.FPS || 60;
                const delay = (60 / fps) * ms;
                Entry.TimeWaitManager.add(
                    Math.random(),
                    () => {
                        script.timeFlag = 0;
                    },
                    delay
                );
                startCode();
                return script;
            } else if (script.timeFlag == 1) {
                return script;
            } else {
                stopCode();
                delete script.timeFlag;
                delete script.isStart;
                Entry.engine.isContinue = false;
                return script.callReturn();
            }
        }

        delayCallReturnUsingFlag(script, startCode, callReturnFlag) {
            if (!script.isStart) {
                script.isStart = true;
                script.timeFlag = 1;
                startCode();
                return script;
            } else if (script.timeFlag == 1) {
                if (callReturnFlag) {
                    script.timeFlag = 2;
                }
                return script;
            } else {
                delete script.timeFlag;
                delete script.isStart;
                Entry.engine.isContinue = false;
                return script.callReturn();
            }
        }

        getBlocks() {
            return {
                //========================================================================================
                //region Dropdown block
                //========================================================================================
                nemolite_dropdown_button: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic_string_field',
                    statements: [],
                    template: '%1',
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.template.nemolite_item_s1, 0],
                                [Lang.template.nemolite_item_s2, 1],
                                [Lang.template.nemolite_item_s3, 2],
                                [Lang.template.nemolite_item_s4, 3],
                            ],
                            value: 0,
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                    ],
                    def: {
                        params: [],
                    },
                    paramsKeyMap: {
                        INDEX: 0,
                    },
                    events: {},
                    func: function (sprite, script) {
                        return script.getField('INDEX');
                    },
                    syntax: {
                        js: [],
                        py: [
                            {
                                syntax: '%1',
                                textParams: [
                                    {
                                        type: 'Dropdown',
                                        options: [
                                            [Lang.template.nemolite_item_s1, 0],
                                            [Lang.template.nemolite_item_s2, 1],
                                            [Lang.template.nemolite_item_s3, 2],
                                            [Lang.template.nemolite_item_s4, 3],
                                        ],
                                        value: 0,
                                        fontSize: 11,
                                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                        converter: Entry.block.converters.returnStringValue,
                                    },
                                ],
                                keyOption: 'nemolite_dropdown_button',
                            },
                        ],
                    },
                },
                nemolite_dropdown_button_now_state: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic_string_field',
                    statements: [],
                    template: '%1',
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.template.nemolite_item_is_press, 0],
                                [Lang.template.nemolite_item_is_fall, 1],
                                [Lang.template.nemolite_item_is_rise, 2],
                                [Lang.template.nemolite_item_is_both, 3],
                            ],
                            value: 0,
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                    ],
                    def: {
                        params: [],
                    },
                    paramsKeyMap: {
                        INDEX: 0,
                    },
                    events: {},
                    func: function (sprite, script) {
                        return script.getField('INDEX');
                    },
                    syntax: {
                        js: [],
                        py: [
                            {
                                syntax: '%1',
                                textParams: [
                                    {
                                        type: 'Dropdown',
                                        options: [
                                            [Lang.template.nemolite_item_is_press, 0],
                                            [Lang.template.nemolite_item_is_fall, 1],
                                            [Lang.template.nemolite_item_is_rise, 2],
                                            [Lang.template.nemolite_item_is_both, 3],
                                        ],
                                        value: 0,
                                        fontSize: 11,
                                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                        converter: Entry.block.converters.returnStringValue,
                                    },
                                ],
                                keyOption: 'nemolite_dropdown_button_now_state',
                            },
                        ],
                    },
                },
                nemolite_dropdown_button_state_question: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic_string_field',
                    statements: [],
                    template: '%1',
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.template.nemolite_item_has_press, 0],
                                [Lang.template.nemolite_item_has_fall, 1],
                                [Lang.template.nemolite_item_has_rise, 2],
                                [Lang.template.nemolite_item_has_both, 3],
                            ],
                            value: 0,
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                    ],
                    def: {
                        params: [],
                    },
                    paramsKeyMap: {
                        INDEX: 0,
                    },
                    events: {},
                    func: function (sprite, script) {
                        return script.getField('INDEX');
                    },
                    syntax: {
                        js: [],
                        py: [
                            {
                                syntax: '%1',
                                textParams: [
                                    {
                                        type: 'Dropdown',
                                        options: [
                                            [Lang.template.nemolite_item_has_press, 0],
                                            [Lang.template.nemolite_item_has_fall, 1],
                                            [Lang.template.nemolite_item_has_rise, 2],
                                            [Lang.template.nemolite_item_has_both, 3],
                                        ],
                                        value: 0,
                                        fontSize: 11,
                                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                        converter: Entry.block.converters.returnStringValue,
                                    },
                                ],
                                keyOption: 'nemolite_dropdown_button_state_question',
                            },
                        ],
                    },
                },
                nemolite_dropdown_motion: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic_string_field',
                    statements: [],
                    template: '%1',
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.template.nemolite_item_motion_1, 0],
                                [Lang.template.nemolite_item_motion_2, 1],
                                [Lang.template.nemolite_item_motion_3, 2],
                                [Lang.template.nemolite_item_motion_4, 3],
                                [Lang.template.nemolite_item_motion_5, 4],
                                [Lang.template.nemolite_item_motion_6, 5],
                                [Lang.template.nemolite_item_motion_7, 6],
                                [Lang.template.nemolite_item_motion_8, 7],
                            ],
                            value: 0,
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                    ],
                    def: {
                        params: [],
                    },
                    paramsKeyMap: {
                        INDEX: 0,
                    },
                    events: {},
                    func: function (sprite, script) {
                        return script.getField('INDEX');
                    },
                    syntax: {
                        js: [],
                        py: [
                            {
                                syntax: '%1',
                                textParams: [
                                    {
                                        type: 'Dropdown',
                                        options: [
                                            [Lang.template.nemolite_item_motion_1, 0],
                                            [Lang.template.nemolite_item_motion_2, 1],
                                            [Lang.template.nemolite_item_motion_3, 2],
                                            [Lang.template.nemolite_item_motion_4, 3],
                                            [Lang.template.nemolite_item_motion_5, 4],
                                            [Lang.template.nemolite_item_motion_6, 5],
                                            [Lang.template.nemolite_item_motion_7, 6],
                                            [Lang.template.nemolite_item_motion_8, 7],
                                        ],
                                        value: 0,
                                        fontSize: 11,
                                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                        converter: Entry.block.converters.returnStringValue,
                                    },
                                ],
                                keyOption: 'nemolite_dropdown_motion',
                            },
                        ],
                    },
                },
                nemolite_dropdown_coordinate_acceleration: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic_string_field',
                    statements: [],
                    template: '%1',
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.template.nemolite_item_axis_x, 0],
                                [Lang.template.nemolite_item_axis_y, 1],
                                [Lang.template.nemolite_item_axis_z, 2],
                                [Lang.template.nemolite_item_linear_acceleration, 3],
                            ],
                            value: 0,
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                    ],
                    def: {
                        params: [],
                    },
                    paramsKeyMap: {
                        INDEX: 0,
                    },
                    events: {},
                    func: function (sprite, script) {
                        return script.getField('INDEX');
                    },
                    syntax: {
                        js: [],
                        py: [
                            {
                                syntax: '%1',
                                textParams: [
                                    {
                                        type: 'Dropdown',
                                        options: [
                                            [Lang.template.nemolite_item_axis_x, 0],
                                            [Lang.template.nemolite_item_axis_y, 1],
                                            [Lang.template.nemolite_item_axis_z, 2],
                                            [Lang.template.nemolite_item_linear_acceleration, 3],
                                        ],
                                        value: 0,
                                        fontSize: 11,
                                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                        converter: Entry.block.converters.returnStringValue,
                                    },
                                ],
                                keyOption: 'nemolite_dropdown_coordinate_acceleration',
                            },
                        ],
                    },
                },
                nemolite_dropdown_led_icon: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic_string_field',
                    statements: [],
                    template: '%1',
                    params: [
                        {
                            type: 'DropdownExtra',
                            options: [
                                [Lang.template.nemolite_item_smile, 0],
                                [Lang.template.nemolite_item_not_much, 1],
                                [Lang.template.nemolite_item_good, 2],
                                [Lang.template.nemolite_item_bad, 3],
                                [Lang.template.nemolite_item_wink, 4],
                                [Lang.template.nemolite_item_cry, 5],
                                [Lang.template.nemolite_item_absurd, 6],
                                [Lang.template.nemolite_item_peck, 7],
                                [Lang.template.nemolite_item_arrow_1, 8],
                                [Lang.template.nemolite_item_arrow_2, 9],
                                [Lang.template.nemolite_item_arrow_3, 10],
                                [Lang.template.nemolite_item_arrow_4, 11],
                                [Lang.template.nemolite_item_arrow_5, 12],
                                [Lang.template.nemolite_item_arrow_6, 13],
                                [Lang.template.nemolite_item_arrow_7, 14],
                                [Lang.template.nemolite_item_arrow_8, 15],
                                [Lang.template.nemolite_item_spade, 16],
                                [Lang.template.nemolite_item_club, 17],
                                [Lang.template.nemolite_item_diamond, 18],
                                [Lang.template.nemolite_item_heart, 19],
                                [Lang.template.nemolite_item_circle, 20],
                                [Lang.template.nemolite_item_x, 21],
                                [Lang.template.nemolite_item_triangle, 22],
                                [Lang.template.nemolite_item_square, 23],
                                [Lang.template.nemolite_item_note_1, 24],
                                [Lang.template.nemolite_item_note_2, 25],
                                [Lang.template.nemolite_item_note_3, 26],
                                [Lang.template.nemolite_item_dice_1, 27],
                                [Lang.template.nemolite_item_dice_2, 28],
                                [Lang.template.nemolite_item_dice_3, 29],
                                [Lang.template.nemolite_item_dice_4, 30],
                                [Lang.template.nemolite_item_dice_5, 31],
                                [Lang.template.nemolite_item_dice_6, 32],
                            ],
                            value: 0,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                    ],
                    def: {
                        params: [],
                    },
                    paramsKeyMap: {
                        INDEX: 0,
                    },
                    events: {},
                    func: function (sprite, script) {
                        return script.getField('INDEX');
                    },
                    syntax: {
                        js: [],
                        py: [
                            {
                                syntax: '%1',
                                textParams: [
                                    {
                                        type: 'Dropdown',
                                        options: [
                                            [Lang.template.nemolite_item_smile, 0],
                                            [Lang.template.nemolite_item_not_much, 1],
                                            [Lang.template.nemolite_item_good, 2],
                                            [Lang.template.nemolite_item_bad, 3],
                                            [Lang.template.nemolite_item_wink, 4],
                                            [Lang.template.nemolite_item_cry, 5],
                                            [Lang.template.nemolite_item_absurd, 6],
                                            [Lang.template.nemolite_item_peck, 7],
                                            [Lang.template.nemolite_item_arrow_1, 8],
                                            [Lang.template.nemolite_item_arrow_2, 9],
                                            [Lang.template.nemolite_item_arrow_3, 10],
                                            [Lang.template.nemolite_item_arrow_4, 11],
                                            [Lang.template.nemolite_item_arrow_5, 12],
                                            [Lang.template.nemolite_item_arrow_6, 13],
                                            [Lang.template.nemolite_item_arrow_7, 14],
                                            [Lang.template.nemolite_item_arrow_8, 15],
                                            [Lang.template.nemolite_item_spade, 16],
                                            [Lang.template.nemolite_item_club, 17],
                                            [Lang.template.nemolite_item_diamond, 18],
                                            [Lang.template.nemolite_item_heart, 19],
                                            [Lang.template.nemolite_item_circle, 20],
                                            [Lang.template.nemolite_item_x, 21],
                                            [Lang.template.nemolite_item_triangle, 22],
                                            [Lang.template.nemolite_item_square, 23],
                                            [Lang.template.nemolite_item_note_1, 24],
                                            [Lang.template.nemolite_item_note_2, 25],
                                            [Lang.template.nemolite_item_note_3, 26],
                                            [Lang.template.nemolite_item_dice_1, 27],
                                            [Lang.template.nemolite_item_dice_2, 28],
                                            [Lang.template.nemolite_item_dice_3, 29],
                                            [Lang.template.nemolite_item_dice_4, 30],
                                            [Lang.template.nemolite_item_dice_5, 31],
                                            [Lang.template.nemolite_item_dice_6, 32],
                                        ],
                                        value: 0,
                                        fontSize: 11,
                                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                        converter: Entry.block.converters.returnStringValue,
                                    },
                                ],
                                keyOption: 'nemolite_dropdown_led_icon',
                            },
                        ],
                    },
                },
                nemolite_dropdown_switch: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic_string_field',
                    statements: [],
                    template: '%1',
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.template.nemolite_item_off_text, 0],
                                [Lang.template.nemolite_item_on_text, 1],
                                [Lang.template.nemolite_item_toggle, 2],
                            ],
                            value: 0,
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                    ],
                    def: {
                        params: [],
                    },
                    paramsKeyMap: {
                        INDEX: 0,
                    },
                    events: {},
                    func: function (sprite, script) {
                        return script.getField('INDEX');
                    },
                    syntax: {
                        js: [],
                        py: [
                            {
                                syntax: '%1',
                                textParams: [
                                    {
                                        type: 'Dropdown',
                                        options: [
                                            [Lang.template.nemolite_item_off_text, 0],
                                            [Lang.template.nemolite_item_on_text, 1],
                                            [Lang.template.nemolite_item_toggle, 2],
                                        ],
                                        value: 0,
                                        fontSize: 11,
                                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                        converter: Entry.block.converters.returnStringValue,
                                    },
                                ],
                                keyOption: 'nemolite_dropdown_switch',
                            },
                        ],
                    },
                },
                nemolite_dropdown_melody: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic_string_field',
                    statements: [],
                    template: '%1',
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.template.nemolite_item_do_re_mi_song, 0],
                                [Lang.template.nemolite_item_an_island_baby, 1],
                                [Lang.template.nemolite_item_twinkle_twinkle_little_star, 2],
                                [Lang.template.nemolite_item_spring_in_my_hometown, 3],
                                [Lang.template.nemolite_item_for_elise, 4],
                                [Lang.template.nemolite_item_celebrated_chop_waltz, 5],
                                [Lang.template.nemolite_item_happy_birthday_to_you, 6],
                            ],
                            value: 0,
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                    ],
                    def: {
                        params: [],
                    },
                    paramsKeyMap: {
                        INDEX: 0,
                    },
                    events: {},
                    func: function (sprite, script) {
                        return script.getField('INDEX');
                    },
                    syntax: {
                        js: [],
                        py: [
                            {
                                syntax: '%1',
                                textParams: [
                                    {
                                        type: 'Dropdown',
                                        options: [
                                            [Lang.template.nemolite_item_do_re_mi_song, 0],
                                            [Lang.template.nemolite_item_an_island_baby, 1],
                                            [
                                                Lang.template
                                                    .nemolite_item_twinkle_twinkle_little_star,
                                                2,
                                            ],
                                            [Lang.template.nemolite_item_spring_in_my_hometown, 3],
                                            [Lang.template.nemolite_item_for_elise, 4],
                                            [Lang.template.nemolite_item_celebrated_chop_waltz, 5],
                                            [Lang.template.nemolite_item_happy_birthday_to_you, 6],
                                        ],
                                        value: 0,
                                        fontSize: 11,
                                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                        converter: Entry.block.converters.returnStringValue,
                                    },
                                ],
                                keyOption: 'nemolite_dropdown_melody',
                            },
                        ],
                    },
                },
                nemolite_dropdown_keyboard: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic_string_field',
                    statements: [],
                    template: '%1',
                    params: [
                        {
                            type: 'DropdownExtra',
                            options: [
                                [Lang.template.nemolite_item_lc, 0],
                                [Lang.template.nemolite_item_lcs, 1],
                                [Lang.template.nemolite_item_ld, 2],
                                [Lang.template.nemolite_item_lds, 3],
                                [Lang.template.nemolite_item_le, 4],
                                [Lang.template.nemolite_item_lf, 5],
                                [Lang.template.nemolite_item_lfs, 6],
                                [Lang.template.nemolite_item_lg, 7],
                                [Lang.template.nemolite_item_lgs, 8],
                                [Lang.template.nemolite_item_la, 9],
                                [Lang.template.nemolite_item_las, 10],
                                [Lang.template.nemolite_item_lb, 11],
                                [Lang.template.nemolite_item_mc, 12],
                                [Lang.template.nemolite_item_mcs, 13],
                                [Lang.template.nemolite_item_md, 14],
                                [Lang.template.nemolite_item_mds, 15],
                                [Lang.template.nemolite_item_me, 16],
                                [Lang.template.nemolite_item_mf, 17],
                                [Lang.template.nemolite_item_mfs, 18],
                                [Lang.template.nemolite_item_mg, 19],
                                [Lang.template.nemolite_item_mgs, 20],
                                [Lang.template.nemolite_item_ma, 21],
                                [Lang.template.nemolite_item_mas, 22],
                                [Lang.template.nemolite_item_mb, 23],
                                [Lang.template.nemolite_item_hc, 24],
                            ],
                            value: 0,
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                    ],
                    def: {
                        params: [],
                    },
                    paramsKeyMap: {
                        INDEX: 0,
                    },
                    events: {},
                    func: function (sprite, script) {
                        return script.getField('INDEX');
                    },
                    syntax: {
                        js: [],
                        py: [
                            {
                                syntax: '%1',
                                textParams: [
                                    {
                                        type: 'Dropdown',
                                        options: [
                                            [Lang.template.nemolite_item_lc, 0],
                                            [Lang.template.nemolite_item_lcs, 1],
                                            [Lang.template.nemolite_item_ld, 2],
                                            [Lang.template.nemolite_item_lds, 3],
                                            [Lang.template.nemolite_item_le, 4],
                                            [Lang.template.nemolite_item_lf, 5],
                                            [Lang.template.nemolite_item_lfs, 6],
                                            [Lang.template.nemolite_item_lg, 7],
                                            [Lang.template.nemolite_item_lgs, 8],
                                            [Lang.template.nemolite_item_la, 9],
                                            [Lang.template.nemolite_item_las, 10],
                                            [Lang.template.nemolite_item_lb, 11],
                                            [Lang.template.nemolite_item_mc, 12],
                                            [Lang.template.nemolite_item_mcs, 13],
                                            [Lang.template.nemolite_item_md, 14],
                                            [Lang.template.nemolite_item_mds, 15],
                                            [Lang.template.nemolite_item_me, 16],
                                            [Lang.template.nemolite_item_mf, 17],
                                            [Lang.template.nemolite_item_mfs, 18],
                                            [Lang.template.nemolite_item_mg, 19],
                                            [Lang.template.nemolite_item_mgs, 20],
                                            [Lang.template.nemolite_item_ma, 21],
                                            [Lang.template.nemolite_item_mas, 22],
                                            [Lang.template.nemolite_item_mb, 23],
                                            [Lang.template.nemolite_item_hc, 24],
                                        ],
                                        value: 0,
                                        fontSize: 11,
                                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                        converter: Entry.block.converters.returnStringValue,
                                    },
                                ],
                                keyOption: 'nemolite_dropdown_keyboard',
                            },
                        ],
                    },
                },
                nemolite_dropdown_extension_sensor: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic_string_field',
                    statements: [],
                    template: '%1',
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.template.nemolite_item_switch, 0],
                                [Lang.template.nemolite_item_infrared_ray, 1],
                                [Lang.template.nemolite_item_magnet, 2],
                                [Lang.template.nemolite_item_rotary, 3],
                                [Lang.template.nemolite_item_illuminance, 4],
                                [Lang.template.nemolite_item_sound, 5],
                                [Lang.template.nemolite_item_tilt, 6],
                                [Lang.template.nemolite_item_pressure, 7],
                                [Lang.template.nemolite_item_heart_rate, 8],
                                [Lang.template.nemolite_item_touch, 9],
                            ],
                            value: 0,
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                    ],
                    def: {
                        params: [null],
                    },
                    paramsKeyMap: {
                        INDEX: 0,
                    },
                    events: {},
                    func: function (sprite, script) {
                        return script.getField('INDEX');
                    },
                    syntax: {
                        js: [],
                        py: [
                            {
                                syntax: '%1',
                                textParams: [
                                    {
                                        type: 'Dropdown',
                                        options: [
                                            [Lang.template.nemolite_item_switch, 0],
                                            [Lang.template.nemolite_item_infrared_ray, 1],
                                            [Lang.template.nemolite_item_magnet, 2],
                                            [Lang.template.nemolite_item_rotary, 3],
                                            [Lang.template.nemolite_item_illuminance, 4],
                                            [Lang.template.nemolite_item_sound, 5],
                                            [Lang.template.nemolite_item_tilt, 6],
                                            [Lang.template.nemolite_item_pressure, 7],
                                            [Lang.template.nemolite_item_heart_rate, 8],
                                            [Lang.template.nemolite_item_touch, 9],
                                        ],
                                        value: 0,
                                        fontSize: 11,
                                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                        converter: Entry.block.converters.returnStringValue,
                                    },
                                ],
                                keyOption: 'nemolite_dropdown_extension_sensor',
                            },
                        ],
                    },
                },

                nemolite_dropdown_sensor_mode: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic_string_field',
                    statements: [],
                    template: '%1',
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.template.nemolite_item_value, 0],
                                [Lang.template.nemolite_item_angle, 1],
                                [Lang.template.nemolite_item_absolute_angle, 2],
                                [Lang.template.nemolite_item_turn_value, 3],
                            ],
                            value: 0,
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                    ],
                    def: {
                        params: [null],
                    },
                    paramsKeyMap: {
                        INDEX: 0,
                    },
                    events: {},
                    func: function (sprite, script) {
                        return script.getField('INDEX');
                    },
                    syntax: {
                        js: [],
                        py: [
                            {
                                syntax: '%1',
                                textParams: [
                                    {
                                        type: 'Dropdown',
                                        options: [
                                            [Lang.template.nemolite_item_value, 0],
                                            [Lang.template.nemolite_item_angle, 1],
                                            [Lang.template.nemolite_item_absolute_angle, 2],
                                            [Lang.template.nemolite_item_rotation_value, 3],
                                        ],
                                        value: 0,
                                        fontSize: 11,
                                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                        converter: Entry.block.converters.returnStringValue,
                                    },
                                ],
                                keyOption: 'nemolite_dropdown_sensor_mode',
                            },
                        ],
                    },
                },
                nemolite_dropdown_direction: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic_string_field',
                    statements: [],
                    template: '%1',
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.template.nemolite_item_east, 0],
                                [Lang.template.nemolite_item_west, 1],
                                [Lang.template.nemolite_item_south, 2],
                                [Lang.template.nemolite_item_north, 3],
                            ],
                            value: 0,
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                    ],
                    def: {
                        params: [null],
                    },
                    paramsKeyMap: {
                        INDEX: 0,
                    },
                    events: {},
                    func: function (sprite, script) {
                        return script.getField('INDEX');
                    },
                    syntax: {
                        js: [],
                        py: [
                            {
                                syntax: '%1',
                                textParams: [
                                    {
                                        type: 'Dropdown',
                                        options: [
                                            [Lang.template.nemolite_item_east, 0],
                                            [Lang.template.nemolite_item_west, 1],
                                            [Lang.template.nemolite_item_south, 2],
                                            [Lang.template.nemolite_item_north, 3],
                                        ],
                                        value: 0,
                                        fontSize: 11,
                                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                        converter: Entry.block.converters.returnStringValue,
                                    },
                                ],
                                keyOption: 'nemolite_dropdown_direction',
                            },
                        ],
                    },
                },
                nemolite_dropdown_index_0_5: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic_string_field',
                    statements: [],
                    template: '%1',
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                ['0', 0],
                                ['1', 1],
                                ['2', 2],
                                ['3', 3],
                                ['4', 4],
                                ['5', 5],
                            ],
                            value: 0,
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                    ],
                    def: {
                        params: [],
                    },
                    paramsKeyMap: {
                        INDEX: 0,
                    },
                    events: {},
                    func: function (sprite, script) {
                        return script.getField('INDEX');
                    },
                    syntax: {
                        js: [],
                        py: [
                            {
                                syntax: '%1',
                                textParams: [
                                    {
                                        type: 'Dropdown',
                                        options: [
                                            ['0', 0],
                                            ['1', 1],
                                            ['2', 2],
                                            ['3', 3],
                                            ['4', 4],
                                            ['5', 5],
                                        ],
                                        value: 0,
                                        fontSize: 11,
                                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                        converter: Entry.block.converters.returnStringValue,
                                    },
                                ],
                                keyOption: 'nemolite_dropdown_index_0_5',
                            },
                        ],
                    },
                },
                nemolite_dropdown_index_1_5: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic_string_field',
                    statements: [],
                    template: '%1',
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                ['1', 1],
                                ['2', 2],
                                ['3', 3],
                                ['4', 4],
                                ['5', 5],
                            ],
                            value: 1,
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                    ],
                    def: {
                        params: [],
                    },
                    paramsKeyMap: {
                        INDEX: 0,
                    },
                    events: {},
                    func: function (sprite, script) {
                        return script.getField('INDEX');
                    },
                    syntax: {
                        js: [],
                        py: [
                            {
                                syntax: '%1',
                                textParams: [
                                    {
                                        type: 'Dropdown',
                                        options: [
                                            ['1', 1],
                                            ['2', 2],
                                            ['3', 3],
                                            ['4', 4],
                                            ['5', 5],
                                        ],
                                        value: 1,
                                        fontSize: 11,
                                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                        converter: Entry.block.converters.returnStringValue,
                                    },
                                ],
                                keyOption: 'nemolite_dropdown_index_1_5',
                            },
                        ],
                    },
                },
                nemolite_dropdown_led_columm: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic_string_field',
                    statements: [],
                    template: '%1',
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.template.nemolite_item_first, 0],
                                [Lang.template.nemolite_item_second, 1],
                                [Lang.template.nemolite_item_third, 2],
                                [Lang.template.nemolite_item_fourth, 3],
                                [Lang.template.nemolite_item_fifth, 4],
                                [Lang.template.nemolite_item_sixth, 5],
                                [Lang.template.nemolite_item_seventh, 6],
                                [Lang.template.nemolite_item_eighth, 7],
                                [Lang.template.nemolite_item_ninth, 8],
                                [Lang.template.nemolite_item_tenth, 9],
                                [Lang.template.nemolite_itme_eleventh, 10],
                                [Lang.template.nemolite_item_twelfth, 11],
                                [Lang.template.nemolite_item_thirteenth, 12],
                                [Lang.template.nemolite_itme_fourteenth, 13],
                            ],
                            value: 0,
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                    ],
                    def: {
                        params: [],
                    },
                    paramsKeyMap: {
                        INDEX: 0,
                    },
                    events: {},
                    func: function (sprite, script) {
                        return script.getField('INDEX');
                    },
                    syntax: {
                        js: [],
                        py: [
                            {
                                syntax: '%1',
                                textParams: [
                                    {
                                        type: 'Dropdown',
                                        options: [
                                            [Lang.template.nemolite_item_first, 0],
                                            [Lang.template.nemolite_item_second, 1],
                                            [Lang.template.nemolite_item_third, 2],
                                            [Lang.template.nemolite_item_fourth, 3],
                                            [Lang.template.nemolite_item_fifth, 4],
                                            [Lang.template.nemolite_item_sixth, 5],
                                            [Lang.template.nemolite_item_seventh, 6],
                                            [Lang.template.nemolite_item_eighth, 7],
                                            [Lang.template.nemolite_item_ninth, 8],
                                            [Lang.template.nemolite_item_tenth, 9],
                                            [Lang.template.nemolite_itme_eleventh, 10],
                                            [Lang.template.nemolite_item_twelfth, 11],
                                            [Lang.template.nemolite_item_thirteenth, 12],
                                            [Lang.template.nemolite_itme_fourteenth, 13],
                                        ],
                                        value: 0,
                                        fontSize: 11,
                                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                        converter: Entry.block.converters.returnStringValue,
                                    },
                                ],
                                keyOption: 'nemolite_dropdown_led_columm',
                            },
                        ],
                    },
                }, // endregion
                //========================================================================================
                //region Input block
                //========================================================================================
                nemolite_title_namo_input: {
                    skeleton: 'basic_text',
                    color: EntryStatic.colorSet.common.TRANSPARENT,
                    fontColor: '#333333',
                    template: Lang.template.title_namo_input,
                    skeletonOptions: {
                        box: {
                            offsetX: 20,
                        },
                    },
                    def: {
                        type: 'nemolite_title_namo_input',
                    },
                    class: 'nemolite_input',
                    isNotFor: ['ProboNemoLite'],
                },
                // %1 %2 버튼 %3
                nemolite_when_button_state: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    fontColor: '#fff',
                    skeleton: 'basic_event',
                    statements: [],
                    template: Lang.template.nemolite_event_button_state,
                    params: [
                        {
                            type: 'Indicator',
                            img: 'block_icon/start_icon_hardwarelite.svg',
                            size: 14,
                            position: {
                                x: 0,
                                y: -2,
                            },
                        },
                        {
                            type: 'Block',
                            accept: 'string',
                            defaultType: 'number',
                        },
                        {
                            type: 'Block',
                            accept: 'string',
                            defaultType: 'number',
                        },
                    ],
                    events: {},
                    def: {
                        params: [
                            null,
                            {
                                type: 'nemolite_dropdown_button',
                            },
                            {
                                type: 'nemolite_dropdown_button_now_state',
                            },
                        ],
                        type: 'nemolite_when_button_state',
                    },
                    paramsKeyMap: {
                        DUMMY: 0,
                        INDEX: 1,
                        STATE: 2,
                    },
                    event: 'nemolite_event_button',
                    class: 'nemolite_input',
                    isNotFor: ['ProboNemoLite'],
                    func: function (sprite, script) {
                        const nameKey = Entry.ProboNemoLite.getButtonNameKey(
                            script.getStringValue('INDEX')
                        );
                        const stateKey = Entry.ProboNemoLite.getButtonStateKey(
                            script.getStringValue('STATE')
                        );
                        const value = Entry.ProboNemoLite.getData.switch[nameKey][stateKey];

                        return value === 1 ? script.callReturn() : this.die();
                    },
                    syntax: {
                        js: [],
                        py: [
                            {
                                syntax: 'NemoLite.when_button_state(%2, %3)',
                                blockType: 'event',
                                passTest: true,
                                textParams: [
                                    undefined,
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
                // %1 %2 이 감지되었을 때
                nemolite_when_motion_sensing: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    fontColor: '#fff',
                    skeleton: 'basic_event',
                    statements: [],
                    template: Lang.template.nemolite_event_motion,
                    params: [
                        {
                            type: 'Indicator',
                            img: 'block_icon/start_icon_hardwarelite.svg',
                            size: 14,
                            position: {
                                x: 0,
                                y: -2,
                            },
                        },
                        {
                            type: 'Block',
                            accept: 'string',
                            defaultType: 'number',
                        },
                    ],
                    events: {},
                    def: {
                        params: [
                            null,
                            {
                                type: 'nemolite_dropdown_motion',
                            },
                        ],
                        type: 'nemolite_when_motion_sensing',
                    },
                    paramsKeyMap: {
                        DUMMY: 0,
                        INDEX: 1,
                    },
                    event: 'nemolite_event_motion',
                    class: 'nemolite_input',
                    isNotFor: ['ProboNemoLite'],
                    func: function (sprite, script) {
                        const nameKey = Entry.ProboNemoLite.getMotionNameKey(
                            script.getStringValue('INDEX')
                        );
                        const value = Entry.ProboNemoLite.getData.motion[nameKey];

                        return value === 1 ? script.callReturn() : this.die();
                    },
                    syntax: {
                        js: [],
                        py: [
                            {
                                syntax: 'NemoLite.when_motion_sensing(%2)',
                                blockType: 'event',
                                passTest: true,
                                textParams: [
                                    undefined,
                                    {
                                        type: 'Block',
                                        accept: 'string',
                                    },
                                ],
                            },
                        ],
                    },
                },
                // %1 버튼 %2 ?
                nemolite_is_button_state: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    fontColor: '#fff',
                    skeleton: 'basic_boolean_field',
                    statements: [],
                    template: Lang.template.nemolite_is_button_state,
                    params: [
                        {
                            type: 'Block',
                            accept: 'string',
                            defaultType: 'number',
                        },
                        {
                            type: 'Block',
                            accept: 'string',
                            defaultType: 'number',
                        },
                    ],
                    events: {},
                    def: {
                        params: [
                            {
                                type: 'nemolite_dropdown_button',
                            },
                            {
                                type: 'nemolite_dropdown_button_state_question',
                            },
                        ],
                        type: 'nemolite_is_button_state',
                    },
                    paramsKeyMap: {
                        INDEX: 0,
                        STATE: 1,
                    },
                    class: 'nemolite_input',
                    isNotFor: ['ProboNemoLite'],
                    func: function (sprite, script) {
                        const nameKey = Entry.ProboNemoLite.getButtonNameKey(
                            script.getStringValue('INDEX')
                        );
                        const stateKey = Entry.ProboNemoLite.getButtonStateKey(
                            script.getStringValue('STATE')
                        );
                        const value = Entry.ProboNemoLite.getData.switch[nameKey][stateKey];

                        return value;
                    },
                    syntax: {
                        js: [],
                        py: [
                            {
                                syntax: 'NemoLite.is_button_state(%1, %2)',
                                blockType: 'param',
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
                // %1 이 감지되었는가?
                nemolite_is_motion_sensing: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    fontColor: '#fff',
                    skeleton: 'basic_boolean_field',
                    statements: [],
                    template: Lang.template.nemolite_is_motion_sensing,
                    params: [
                        {
                            type: 'Block',
                            accept: 'string',
                            defaultType: 'number',
                        },
                    ],
                    events: {},
                    def: {
                        params: [
                            {
                                type: 'nemolite_dropdown_motion',
                            },
                        ],
                        type: 'nemolite_is_motion_sensing',
                    },
                    paramsKeyMap: {
                        INDEX: 0,
                    },
                    class: 'nemolite_input',
                    isNotFor: ['ProboNemoLite'],
                    func: function (sprite, script) {
                        const nameKey = Entry.ProboNemoLite.getMotionNameKey(
                            script.getStringValue('INDEX')
                        );
                        const value = Entry.ProboNemoLite.getData.motion[nameKey];

                        return value;
                    },
                    syntax: {
                        js: [],
                        py: [
                            {
                                syntax: 'NemoLite.is_motion_sensing(%1)',
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
                // LED X: %1 Y: %2 상태값
                nemolite_is_led_state_value: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    fontColor: '#fff',
                    skeleton: 'basic_boolean_field',
                    statements: [],
                    template: Lang.template.nemolite_is_led_state_value,
                    params: [
                        {
                            type: 'Block',
                            accept: 'string',
                            defaultType: 'number',
                        },
                        {
                            type: 'Block',
                            accept: 'string',
                            defaultType: 'number',
                        },
                    ],
                    events: {},
                    def: {
                        params: [
                            {
                                type: 'number',
                                params: [0],
                            },
                            {
                                type: 'number',
                                params: [0],
                            },
                        ],
                        type: 'nemolite_is_led_state_value',
                    },
                    paramsKeyMap: {
                        X: 0,
                        Y: 1,
                    },
                    class: 'nemolite_input',
                    isNotFor: ['ProboNemoLite'],
                    func: function (sprite, script) {
                        const x = script.getNumberValue('X');
                        const y = script.getNumberValue('Y');
                        const index = x * 7 + y + 1; // 1 ~ 49
                        let value = false;
                        Entry.ProboNemoLite.setData.ledRead = index;

                        return Entry.ProboNemoLite.getData.ledRead.state;
                    },
                    syntax: {
                        js: [],
                        py: [
                            {
                                syntax: 'NemoLite.is_led_state_value(%1, %2)',
                                blockType: 'param',
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
                // %1 버튼의 아날로그 값
                nemolite_get_button_analog_value: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    fontColor: '#fff',
                    skeleton: 'basic_string_field',
                    statements: [],
                    template: Lang.template.nemolite_get_button_analog_value,
                    params: [
                        {
                            type: 'Block',
                            accept: 'string',
                            defaultType: 'number',
                        },
                    ],
                    events: {},
                    def: {
                        params: [
                            {
                                type: 'nemolite_dropdown_button',
                            },
                        ],
                        type: 'nemolite_get_button_analog_value',
                    },
                    paramsKeyMap: {
                        INDEX: 0,
                    },
                    class: 'nemolite_input',
                    isNotFor: ['ProboNemoLite'],
                    func: function (sprite, script) {
                        const nameKey = Entry.ProboNemoLite.getButtonNameKey(
                            script.getStringValue('INDEX')
                        );
                        const value = Entry.ProboNemoLite.getData.switch[nameKey]['analog'];
                        return value;
                    },
                    syntax: {
                        js: [],
                        py: [
                            {
                                syntax: 'NemoLite.button_analog_value(%1)',
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
                // 가속도 센서 %1 의 값
                nemolite_get_acceleration_value: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    fontColor: '#fff',
                    skeleton: 'basic_string_field',
                    statements: [],
                    template: Lang.template.nemolite_get_acceleration_value,
                    params: [
                        {
                            type: 'Block',
                            accept: 'string',
                            defaultType: 'number',
                        },
                    ],
                    events: {},
                    def: {
                        params: [
                            {
                                type: 'nemolite_dropdown_coordinate_acceleration',
                            },
                        ],
                        type: 'nemolite_get_acceleration_value',
                    },
                    paramsKeyMap: {
                        INDEX: 0,
                    },
                    class: 'nemolite_input',
                    isNotFor: ['ProboNemoLite'],
                    func: function (sprite, script) {
                        const nameKey = Entry.ProboNemoLite.getAccelNameKey(
                            script.getStringValue('INDEX')
                        );
                        const value = Entry.ProboNemoLite.getData.accel[nameKey];
                        return value;
                    },
                    syntax: {
                        js: [],
                        py: [
                            {
                                syntax: 'NemoLite.acceleration_value(%1)',
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
                // 조도 센서의 값
                nemolite_get_illuminance_value: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    fontColor: '#fff',
                    skeleton: 'basic_string_field',
                    statements: [],
                    template: Lang.template.nemolite_get_illuminance_value,
                    params: [],
                    events: {},
                    def: {
                        params: [],
                        type: 'nemolite_get_illuminance_value',
                    },
                    paramsKeyMap: {},
                    class: 'nemolite_input',
                    isNotFor: ['ProboNemoLite'],
                    func: function (sprite, script) {
                        const illuminance = Entry.ProboNemoLite.getData.illuminance;
                        return illuminance;
                    },
                    syntax: {
                        js: [],
                        py: [
                            {
                                syntax: 'NemoLite.illuminance_value()',
                                blockType: 'param',
                                textParams: [],
                            },
                        ],
                    },
                },
                // %1 의 값 %2 ~ %3 을 %4 ~ %5 으(로) 변환
                nemolite_get_convert_value: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    fontColor: '#fff',
                    skeleton: 'basic_string_field',
                    statements: [],
                    template: Lang.template.nemolite_get_convert_value,
                    params: [
                        {
                            type: 'Block',
                            accept: 'string',
                            defaultType: 'number',
                        },
                        {
                            type: 'Block',
                            accept: 'string',
                            defaultType: 'number',
                        },
                        {
                            type: 'Block',
                            accept: 'string',
                            defaultType: 'number',
                        },
                        {
                            type: 'Block',
                            accept: 'string',
                            defaultType: 'number',
                        },
                        {
                            type: 'Block',
                            accept: 'string',
                            defaultType: 'number',
                        },
                    ],
                    events: {},
                    def: {
                        params: [
                            {
                                type: 'number',
                                params: [0],
                            },
                            {
                                type: 'number',
                                params: [0],
                            },
                            {
                                type: 'number',
                                params: [0],
                            },
                            {
                                type: 'number',
                                params: [0],
                            },
                            {
                                type: 'number',
                                params: [0],
                            },
                        ],
                        type: 'nemolite_get_convert_value',
                    },
                    paramsKeyMap: {
                        VALUE: 0,
                        IN_MIN: 1,
                        IN_MAX: 2,
                        OUT_MIN: 3,
                        OUT_MAX: 4,
                    },
                    class: 'nemolite_input',
                    isNotFor: ['ProboNemoLite'],
                    func: function (sprite, script) {
                        const value = script.getNumberValue('VALUE');
                        const inMin = script.getNumberValue('IN_MIN');
                        const inMax = script.getNumberValue('IN_MAX');
                        const outMin = script.getNumberValue('OUT_MIN');
                        const outMax = script.getNumberValue('OUT_MAX');
                        return Entry.ProboNemoLite.getConvertMap(
                            value,
                            inMin,
                            inMax,
                            outMin,
                            outMax
                        );
                    },
                    syntax: {
                        js: [],
                        py: [
                            {
                                syntax: 'NemoLite.convert_value(%1, %2, %3, %4, %5)',
                                blockType: 'param',
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
                                    {
                                        type: 'Block',
                                        accept: 'string',
                                    },
                                ],
                            },
                        ],
                    },
                }, //endregion
                //========================================================================================
                //region Output block
                //========================================================================================
                nemolite_title_namo_output: {
                    skeleton: 'basic_text',
                    color: EntryStatic.colorSet.common.TRANSPARENT,
                    fontColor: '#333333',
                    template: Lang.template.title_namo_output,
                    skeletonOptions: {
                        box: {
                            offsetX: 20,
                        },
                    },
                    def: {
                        type: 'nemolite_title_namo_output',
                    },
                    class: 'nemolite_output',
                    isNotFor: ['ProboNemoLite'],
                },
                // LED 아이콘 %1 을 %2 속도로 출력 %3
                nemolite_set_display_led_icon: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    fontColor: '#fff',
                    skeleton: 'basic',
                    statements: [],
                    template: Lang.template.nemolite_set_display_led_icon,
                    params: [
                        {
                            type: 'Block',
                            accept: 'string',
                            defaultType: 'number',
                        },
                        {
                            type: 'Block',
                            accept: 'string',
                            defaultType: 'number',
                        },
                        {
                            type: 'Indicator',
                            img: 'block_icon/hardwarelite_icon.svg',
                            size: 12,
                        },
                    ],
                    events: {},
                    def: {
                        params: [
                            {
                                type: 'nemolite_dropdown_led_icon',
                            },
                            {
                                type: 'nemolite_dropdown_index_0_5',
                            },
                            null,
                        ],
                        type: 'nemolite_set_display_led_icon',
                    },
                    paramsKeyMap: {
                        INDEX: 0,
                        SPEED: 1,
                    },
                    class: 'nemolite_output',
                    isNotFor: ['ProboNemoLite'],
                    func: function (sprite, script) {
                        const index = Entry.ProboNemoLite.getLedIconIndexValue(
                            script.getStringValue('INDEX')
                        );
                        const speed = Entry.ProboNemoLite.getLedSpeedValue(
                            script.getStringValue('SPEED')
                        );

                        if (
                            Entry.ProboNemoLite.state.led === 0 ||
                            Entry.ProboNemoLite.lastData.ledIcon.index !== index ||
                            Entry.ProboNemoLite.lastData.ledIcon.speed !== speed
                        ) {
                            Entry.ProboNemoLite.setData.ledIcon.index = index;
                            Entry.ProboNemoLite.setData.ledIcon.speed = speed;

                            Entry.ProboNemoLite.state.led = 'i'.charCodeAt();
                        }

                        return script.callReturn();
                    },
                    syntax: {
                        js: [],
                        py: [
                            {
                                syntax: 'NemoLite.display_led_icon(%1, %2)',
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
                // LED %1 줄의 %2%3%4%5%6%7%8 을 %9 속도로 출력 %10
                nemolite_set_display_led_custom_columm: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    fontColor: '#fff',
                    skeleton: 'basic',
                    statements: [],
                    template: Lang.template.nemolite_set_display_led_custom_columm,
                    params: [
                        {
                            type: 'Block',
                            accept: 'string',
                            defaultType: 'number',
                        },
                        {
                            type: 'Block',
                            accept: 'string',
                            defaultType: 'number',
                        },
                        {
                            type: 'Block',
                            accept: 'string',
                            defaultType: 'number',
                        },
                        {
                            type: 'Block',
                            accept: 'string',
                            defaultType: 'number',
                        },
                        {
                            type: 'Block',
                            accept: 'string',
                            defaultType: 'number',
                        },
                        {
                            type: 'Block',
                            accept: 'string',
                            defaultType: 'number',
                        },
                        {
                            type: 'Block',
                            accept: 'string',
                            defaultType: 'number',
                        },
                        {
                            type: 'Block',
                            accept: 'string',
                            defaultType: 'number',
                        },
                        {
                            type: 'Block',
                            accept: 'string',
                            defaultType: 'number',
                        },
                        {
                            type: 'Indicator',
                            img: 'block_icon/hardwarelite_icon.svg',
                            size: 12,
                        },
                    ],
                    events: {},
                    def: {
                        params: [
                            {
                                type: 'nemolite_dropdown_led_columm',
                            },
                            {
                                type: 'number',
                                params: [0],
                            },
                            {
                                type: 'number',
                                params: [0],
                            },
                            {
                                type: 'number',
                                params: [0],
                            },
                            {
                                type: 'number',
                                params: [0],
                            },
                            {
                                type: 'number',
                                params: [0],
                            },
                            {
                                type: 'number',
                                params: [0],
                            },
                            {
                                type: 'number',
                                params: [0],
                            },
                            {
                                type: 'nemolite_dropdown_index_0_5',
                            },
                            null,
                        ],
                        type: 'nemolite_set_display_led_custom_columm',
                    },
                    paramsKeyMap: {
                        INDEX: 0,
                        VALUE1: 1,
                        VALUE2: 2,
                        VALUE3: 3,
                        VALUE4: 4,
                        VALUE5: 5,
                        VALUE6: 6,
                        VALUE7: 7,
                        SPEED: 8,
                    },
                    class: 'nemolite_output',
                    isNotFor: ['ProboNemoLite'],
                    func: function (sprite, script) {
                        const index = Entry.ProboNemoLite.getLedColummKey(
                            script.getStringValue('INDEX')
                        );
                        const value = [
                            script.getNumberValue('VALUE1'),
                            script.getNumberValue('VALUE2'),
                            script.getNumberValue('VALUE3'),
                            script.getNumberValue('VALUE4'),
                            script.getNumberValue('VALUE5'),
                            script.getNumberValue('VALUE6'),
                            script.getNumberValue('VALUE7'),
                        ];
                        const speed = Entry.ProboNemoLite.getLedSpeedValue(
                            script.getStringValue('SPEED')
                        );
                        let pixel = 0;
                        for (let i = 0; i < 7; i++) {
                            if (value[i] > 0) {
                                pixel |= 1 << i;
                            } else {
                                pixel &= ~(1 << i);
                            }
                        }

                        if (
                            Entry.ProboNemoLite.state.led === 0 ||
                            Entry.ProboNemoLite.lastData.ledColumm.pixel[index] !== pixel ||
                            Entry.ProboNemoLite.lastData.ledColumm.speed !== speed
                        ) {
                            Entry.ProboNemoLite.state.led = 'c'.charCodeAt();
                            Entry.ProboNemoLite.setData.ledColumm.pixel[index] = pixel;
                            Entry.ProboNemoLite.setData.ledColumm.speed = speed;
                        }

                        return script.callReturn();
                    },
                    syntax: {
                        js: [],
                        py: [
                            {
                                syntax: 'NemoLite.display_led_custom_columm(%1, %2, %3, %4, %5, %6, %7, %8, %9)',
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
                                ],
                            },
                        ],
                    },
                },
                // LED %1 문자열을 %2 속도로 출력 %3
                nemolite_set_display_led_text: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    fontColor: '#fff',
                    skeleton: 'basic',
                    statements: [],
                    template: Lang.template.nemolite_set_display_led_text,
                    params: [
                        {
                            type: 'Block',
                            accept: 'string',
                            defaultType: 'number',
                        },
                        {
                            type: 'Block',
                            accept: 'string',
                            defaultType: 'number',
                        },
                        {
                            type: 'Indicator',
                            img: 'block_icon/hardwarelite_icon.svg',
                            size: 12,
                        },
                    ],
                    events: {},
                    def: {
                        params: [
                            {
                                type: 'text',
                                params: ['Hello'],
                            },
                            {
                                type: 'nemolite_dropdown_index_1_5',
                            },
                            null,
                        ],
                        type: 'nemolite_set_display_led_text',
                    },
                    paramsKeyMap: {
                        TEXT: 0,
                        SPEED: 1,
                    },
                    class: 'nemolite_output',
                    isNotFor: ['ProboNemoLite'],
                    func: function (sprite, script) {
                        const text = script.getStringValue('TEXT');
                        const speed = Entry.ProboNemoLite.getLedSpeedValue(
                            script.getStringValue('SPEED')
                        );

                        if (
                            Entry.ProboNemoLite.state.led === 0 ||
                            Entry.ProboNemoLite.lastData.ledText.text !== text ||
                            Entry.ProboNemoLite.lastData.ledText.speed !== speed
                        ) {
                            Entry.ProboNemoLite.state.led = 't'.charCodeAt();
                            Entry.ProboNemoLite.setData.ledText.text = text;
                            Entry.ProboNemoLite.setData.ledText.speed = speed;
                        }

                        return script.callReturn();
                    },
                    syntax: {
                        js: [],
                        py: [
                            {
                                syntax: 'NemoLite.display_led_text(%1, %2)',
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

                nemolite_set_delete_all_led: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    fontColor: '#fff',
                    skeleton: 'basic',
                    statements: [],
                    template: Lang.template.nemolite_set_delete_all_led,
                    params: [
                        {
                            type: 'Indicator',
                            img: 'block_icon/hardwarelite_icon.svg',
                            size: 12,
                        },
                    ],
                    events: {},
                    def: {
                        params: [],
                        type: 'nemolite_set_delete_all_led',
                    },
                    paramsKeyMap: {},
                    class: 'nemolite_output',
                    isNotFor: ['ProboNemoLite'],
                    func: function (sprite, script) {
                        Entry.ProboNemoLite.setData.ledClear = 1;

                        return script.callReturn();
                    },
                    syntax: {
                        js: [],
                        py: [
                            {
                                syntax: 'NemoLite.delete_all_led()',
                                textParams: [],
                            },
                        ],
                    },
                },
                // LED X: %1 Y: %2 %3 %4
                nemolite_set_toggle_led_pixel: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    fontColor: '#fff',
                    skeleton: 'basic',
                    statements: [],
                    template: Lang.template.nemolite_set_toggle_led_pixel,
                    params: [
                        {
                            type: 'Block',
                            accept: 'string',
                            defaultType: 'number',
                        },
                        {
                            type: 'Block',
                            accept: 'string',
                            defaultType: 'number',
                        },
                        {
                            type: 'Block',
                            accept: 'string',
                            defaultType: 'number',
                        },
                        {
                            type: 'Indicator',
                            img: 'block_icon/hardwarelite_icon.svg',
                            size: 12,
                        },
                    ],
                    events: {},
                    def: {
                        params: [
                            {
                                type: 'number',
                                params: [0],
                            },
                            {
                                type: 'number',
                                params: [0],
                            },
                            {
                                type: 'nemolite_dropdown_switch',
                            },
                            null,
                        ],
                        type: 'nemolite_set_toggle_led_pixel',
                    },
                    paramsKeyMap: {
                        X: 0,
                        Y: 1,
                        STATE: 2,
                    },
                    class: 'nemolite_output',
                    isNotFor: ['ProboNemoLite'],
                    func: function (sprite, script) {
                        const x = script.getNumberValue('X');
                        const y = script.getNumberValue('Y');

                        if (0 <= x && x <= 6 && 0 <= y && y <= 6) {
                            const index = x * 7 + y + 1; // 1 ~ 49
                            const state = Entry.ProboNemoLite.getSwitchValue(
                                script.getNumberValue('STATE')
                            );

                            Entry.ProboNemoLite.setData.ledPixel.state = state;
                            Entry.ProboNemoLite.setData.ledPixel.index = index;
                        }
                        return script.callReturn();
                    },
                    syntax: {
                        js: [],
                        py: [
                            {
                                syntax: 'NemoLite.toggle_led_pixel(%1, %2, %3)',
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
                // 멜로디 %1 재생하기 %2
                nemolite_set_play_melody: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    fontColor: '#fff',
                    skeleton: 'basic',
                    statements: [],
                    template: Lang.template.nemolite_set_play_melody,
                    params: [
                        {
                            type: 'Block',
                            accept: 'string',
                            defaultType: 'number',
                        },
                        {
                            type: 'Indicator',
                            img: 'block_icon/hardwarelite_icon.svg',
                            size: 12,
                        },
                    ],
                    events: {},
                    def: {
                        params: [
                            {
                                type: 'nemolite_dropdown_melody',
                            },
                            null,
                        ],
                        type: 'nemolite_set_play_melody',
                    },
                    paramsKeyMap: {
                        TITLE: 0,
                    },
                    class: 'nemolite_output',
                    isNotFor: ['ProboNemoLite'],
                    func: function (sprite, script) {
                        const title = Entry.ProboNemoLite.getMelodyKey(
                            script.getNumberValue('TITLE')
                        );

                        if (Entry.ProboNemoLite.state.sound === 0) {
                            Entry.ProboNemoLite.state.sound = 'm'.charCodeAt();
                            Entry.ProboNemoLite.setData.melody.play = 1;
                            Entry.ProboNemoLite.setData.melody.title = title;
                        }

                        return script.callReturn();
                    },
                    syntax: {
                        js: [],
                        py: [
                            {
                                syntax: 'NemoLite.play_melody(%1)',
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
                // '멜로디 %1 끝까지 재생하기 %2'
                nemolite_set_play_melody_until_the_end: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    fontColor: '#fff',
                    skeleton: 'basic',
                    statements: [],
                    template: Lang.template.nemolite_set_play_melody_until_the_end,
                    params: [
                        {
                            type: 'Block',
                            accept: 'string',
                            defaultType: 'number',
                        },
                        {
                            type: 'Indicator',
                            img: 'block_icon/hardwarelite_icon.svg',
                            size: 12,
                        },
                    ],
                    events: {},
                    def: {
                        params: [
                            {
                                type: 'nemolite_dropdown_melody',
                            },
                            null,
                        ],
                        type: 'nemolite_set_play_melody_until_the_end',
                    },
                    paramsKeyMap: {
                        TITLE: 0,
                    },
                    class: 'nemolite_output',
                    isNotFor: ['ProboNemoLite'],
                    func: function (sprite, script) {
                        const title = Entry.ProboNemoLite.getMelodyKey(
                            script.getNumberValue('TITLE')
                        );
                        let flag = false;
                        const startCode = function () {
                            if (Entry.ProboNemoLite.state.sound === 0) {
                                Entry.ProboNemoLite.state.soundBlockId = script.executor.id;
                                Entry.ProboNemoLite.state.sound = 'm'.charCodeAt();
                                Entry.ProboNemoLite.setData.melody.play = 1;
                                Entry.ProboNemoLite.setData.melody.title = title;
                            }
                        };

                        if (
                            Entry.ProboNemoLite.state.soundBlockId === script.executor.id &&
                            Entry.ProboNemoLite.state.sound === 0
                        ) {
                            flag = true;
                        }

                        return Entry.ProboNemoLite.delayCallReturnUsingFlag(
                            script,
                            startCode,
                            flag
                        );
                    },
                    syntax: {
                        js: [],
                        py: [
                            {
                                syntax: 'NemoLite.play_melody_until_the_end(%1)',
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
                // %1 음을 %2 재생하기 %3
                nemolite_set_play_note: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    fontColor: '#fff',
                    skeleton: 'basic',
                    statements: [],
                    template: Lang.template.nemolite_set_play_note,
                    params: [
                        {
                            type: 'Block',
                            accept: 'string',
                            defaultType: 'number',
                        },
                        {
                            type: 'Indicator',
                            img: 'block_icon/hardwarelite_icon.svg',
                            size: 12,
                        },
                    ],
                    events: {},
                    def: {
                        params: [
                            {
                                type: 'nemolite_dropdown_keyboard',
                            },
                            null,
                        ],
                        type: 'nemolite_set_play_note',
                    },
                    paramsKeyMap: {
                        PITCH: 0,
                    },
                    class: 'nemolite_output',
                    isNotFor: ['ProboNemoLite'],
                    func: function (sprite, script) {
                        const pitch = Entry.ProboNemoLite.getPitchKey(
                            script.getNumberValue('PITCH')
                        );

                        Entry.ProboNemoLite.state.note = 1;
                        Entry.ProboNemoLite.setData.note.play = 1;
                        Entry.ProboNemoLite.setData.note.pitch = pitch;

                        return script.callReturn();
                    },
                    syntax: {
                        js: [],
                        py: [
                            {
                                syntax: 'NemoLite.nemolite_set_play_note(%1)',
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
                // %1 음을 %2 초동안 재생하기 %3
                nemolite_set_play_note_for_seconds: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    fontColor: '#fff',
                    skeleton: 'basic',
                    statements: [],
                    template: Lang.template.nemolite_set_play_note_for_seconds,
                    params: [
                        {
                            type: 'Block',
                            accept: 'string',
                            defaultType: 'number',
                        },
                        {
                            type: 'Block',
                            accept: 'string',
                            defaultType: 'number',
                        },
                        {
                            type: 'Indicator',
                            img: 'block_icon/hardwarelite_icon.svg',
                            size: 12,
                        },
                    ],
                    events: {},
                    def: {
                        params: [
                            {
                                type: 'nemolite_dropdown_keyboard',
                            },
                            {
                                type: 'number',
                                params: ['1'],
                            },
                            null,
                        ],
                        type: 'nemolite_set_play_note_for_seconds',
                    },
                    paramsKeyMap: {
                        PITCH: 0,
                        TIME: 1,
                    },
                    class: 'nemolite_output',
                    isNotFor: ['ProboNemoLite'],
                    func: function (sprite, script) {
                        const pitch = Entry.ProboNemoLite.getPitchKey(
                            script.getNumberValue('PITCH')
                        );
                        const time = script.getNumberValue('TIME') * 1000;
                        const startCode = function () {
                            if (Entry.ProboNemoLite.state.note === 0) {
                                Entry.ProboNemoLite.state.noteBlockId = script.executor.id;
                                Entry.ProboNemoLite.state.note = 1;
                                Entry.ProboNemoLite.setData.note.play = 1;
                                Entry.ProboNemoLite.setData.note.pitch = pitch;
                            }
                        };
                        const stopCode = function () {
                            if (Entry.ProboNemoLite.state.noteBlockId === script.executor.id) {
                                Entry.ProboNemoLite.state.note = 0;
                            }
                        };

                        return Entry.ProboNemoLite.delayCallReturnUsingTime(
                            script,
                            time,
                            startCode,
                            stopCode
                        );
                    },
                    syntax: {
                        js: [],
                        py: [
                            {
                                syntax: 'NemoLite.play_note_for_seconds(%1, %2)',
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
                // 모든 소리 정지 %1
                nemolite_set_stop_all_sound: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    fontColor: '#fff',
                    skeleton: 'basic',
                    statements: [],
                    template: Lang.template.nemolite_set_stop_all_sound,
                    params: [
                        {
                            type: 'Indicator',
                            img: 'block_icon/hardware_icon.svg',
                            size: 12,
                        },
                    ],
                    events: {},
                    def: {
                        params: [],
                        type: 'nemolite_set_stop_all_sound',
                    },
                    paramsKeyMap: {},
                    class: 'nemolite_output',
                    isNotFor: ['ProboNemoLite'],
                    func: function (sprite, script) {
                        Entry.ProboNemoLite.state.sound = 'm'.charCodeAt();
                        Entry.ProboNemoLite.setData.melody.play = 1;
                        Entry.ProboNemoLite.setData.melody.title = 0;
                        Entry.ProboNemoLite.state.note = 1;
                        Entry.ProboNemoLite.setData.note.play = 0;
                        Entry.ProboNemoLite.setData.note.pitch = 0;

                        return script.callReturn();
                    },
                    syntax: {
                        js: [],
                        py: [
                            {
                                syntax: 'NemoLite.stop_all_sound()',
                                textParams: [],
                            },
                        ],
                    },
                },
                //endregion Output block
                //========================================================================================
                //region Extension block
                //========================================================================================
                nemolite_title_namo_extension: {
                    skeleton: 'basic_text',
                    color: EntryStatic.colorSet.common.TRANSPARENT,
                    fontColor: '#333333',
                    template: Lang.template.nemolite_namo_extension,
                    skeletonOptions: {
                        box: {
                            offsetX: 20,
                        },
                    },
                    def: {
                        type: 'nemolite_title_namo_extension',
                    },
                    class: 'nemolite_extension',
                    isNotFor: ['ProboNemoLite'],
                },
                nemolite_ext_set_extension: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    fontColor: '#fff',
                    skeleton: 'basic',
                    statements: [],
                    template: Lang.template.nemolite_ext_set_extension,
                    params: [
                        {
                            type: 'Block',
                            accept: 'string',
                            defaultType: 'number',
                        },
                        {
                            type: 'Indicator',
                            img: 'block_icon/hardwarelite_icon.svg',
                            size: 12,
                        },
                    ],
                    events: {},
                    def: {
                        params: [
                            {
                                type: 'nemolite_dropdown_extension_sensor',
                            },
                            null,
                        ],
                        type: 'nemolite_ext_set_extension',
                    },
                    paramsKeyMap: {
                        TYPE: 0,
                    },
                    class: 'nemolite_extension',
                    isNotFor: ['ProboNemoLite'],
                    func: function (sprite, script) {
                        const type = Entry.ProboNemoLite.getExtensionKey(
                            script.getStringValue('TYPE')
                        );
                        Entry.ProboNemoLite.setData.extension = type;
                        return script.callReturn();
                    },
                    syntax: {
                        js: [],
                        py: [
                            {
                                syntax: 'NemoLite.set_extension(%1)',
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
                nemolite_ext_get_extension_anlog_value: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    fontColor: '#fff',
                    skeleton: 'basic_string_field',
                    statements: [],
                    template: Lang.template.nemolite_ext_get_extension_anlog_value,
                    params: [],
                    events: {},
                    def: {
                        params: [],
                        type: 'nemolite_ext_get_extension_anlog_value',
                    },
                    paramsKeyMap: {},
                    class: 'nemolite_extension',
                    isNotFor: ['ProboNemoLite'],
                    func: function (sprite, script) {
                        const value = Entry.ProboNemoLite.getData.extension.analog;
                        return value;
                    },
                    syntax: {
                        js: [],
                        py: [
                            {
                                syntax: 'NemoLite.get_extension_anlog_value(%1)',
                                textParams: [],
                            },
                        ],
                    },
                },
                nemolite_ext_set_extension_value: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    fontColor: '#fff',
                    skeleton: 'basic',
                    statements: [],
                    template: Lang.template.nemolite_ext_set_extension_value,
                    params: [
                        {
                            type: 'Block',
                            accept: 'string',
                            defaultType: 'number',
                        },
                        {
                            type: 'Indicator',
                            img: 'block_icon/hardwarelite_icon.svg',
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
                        ],
                        type: 'nemolite_ext_set_extension_value',
                    },
                    paramsKeyMap: {
                        VALUE: 0,
                    },
                    class: 'nemolite_extension',
                    isNotFor: ['ProboNemoLite'],
                    func: function (sprite, script) {
                        const value = script.getNumberValue('VALUE');
                        const analog = Entry.ProboNemoLite.getData.extension.analog;
                        const count = Entry.ProboNemoLite.state.extCount;
                        Entry.ProboNemoLite.extension.bias = value - (analog + count * 255);
                        return script.callReturn();
                    },
                    syntax: {
                        js: [],
                        py: [
                            {
                                syntax: 'NemoLite.set_extension_value(%1)',
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
                nemolite_ext_is_extension_state: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    fontColor: '#fff',
                    skeleton: 'basic_boolean_field',
                    statements: [],
                    template: Lang.template.nemolite_ext_is_extension_state,
                    params: [
                        {
                            type: 'Block',
                            accept: 'string',
                            defaultType: 'number',
                        },
                    ],
                    events: {},
                    def: {
                        params: [
                            {
                                type: 'nemolite_dropdown_button_state_question',
                            },
                            null,
                        ],
                        type: 'nemolite_ext_is_extension_state',
                    },
                    paramsKeyMap: {
                        STATE: 0,
                    },
                    class: 'nemolite_extension',
                    isNotFor: ['ProboNemoLite'],
                    func: function (sprite, script) {
                        const stateKey = Entry.ProboNemoLite.getButtonStateKey(
                            script.getStringValue('STATE')
                        );
                        const value = Entry.ProboNemoLite.getData.extension[stateKey];
                        return value;
                    },
                    syntax: {
                        js: [],
                        py: [
                            {
                                syntax: 'NemoLite.is_extension_state(%1)',
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
                nemolite_ext_get_extension_custom_value: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    fontColor: '#fff',
                    skeleton: 'basic_string_field',
                    statements: [],
                    template: Lang.template.nemolite_ext_get_extension_custom_value,
                    params: [
                        {
                            type: 'Block',
                            accept: 'string',
                            defaultType: 'number',
                        },
                    ],
                    events: {},
                    def: {
                        params: [
                            {
                                type: 'nemolite_dropdown_sensor_mode',
                            },
                        ],
                        type: 'nemolite_ext_get_extension_custom_value',
                    },
                    paramsKeyMap: {
                        TYPE: 0,
                    },
                    class: 'nemolite_extension',
                    isNotFor: ['ProboNemoLite'],
                    func: function (sprite, script) {
                        const modeKey = Entry.ProboNemoLite.getSensorModeKey(
                            script.getStringValue('TYPE')
                        );
                        const value = Entry.ProboNemoLite.extension[modeKey];
                        return value;
                    },
                    syntax: {
                        js: [],
                        py: [
                            {
                                syntax: 'NemoLite.get_extension_custom_value(%1)',
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
                nemolite_ext_set_compass_value: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    fontColor: '#fff',
                    skeleton: 'basic',
                    statements: [],
                    template: Lang.template.nemolite_ext_set_compass_value,
                    params: [
                        {
                            type: 'Block',
                            accept: 'string',
                            defaultType: 'number',
                        },
                    ],
                    events: {},
                    def: {
                        params: [
                            {
                                type: 'number',
                                params: ['0'],
                            },
                        ],
                        type: 'nemolite_ext_set_compass_value',
                    },
                    paramsKeyMap: {
                        VALUE: 0,
                    },
                    class: 'nemolite_extension',
                    isNotFor: ['ProboNemoLite'],
                    func: function (sprite, script) {
                        const value = script.getNumberValue('VALUE');
                        const analog = Entry.ProboNemoLite.getData.compass;
                        const count = Entry.ProboNemoLite.compass.absolutTurnCount;
                        Entry.ProboNemoLite.compass.bias = value - (analog + count * 255);
                        return script.callReturn();
                    },
                    syntax: {
                        js: [],
                        py: [
                            {
                                syntax: 'NemoLite.set_compass_value(%1)',
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
                nemolite_ext_get_compass_analog_value: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    fontColor: '#fff',
                    skeleton: 'basic_string_field',
                    statements: [],
                    template: Lang.template.nemolite_ext_get_compass_analog_value,
                    params: [],
                    events: {},
                    def: {
                        params: [],
                        type: 'nemolite_ext_get_compass_analog_value',
                    },
                    paramsKeyMap: {},
                    class: 'nemolite_extension',
                    isNotFor: ['ProboNemoLite'],
                    func: function (sprite, script) {
                        const value = Entry.ProboNemoLite.getData.compass;
                        return value;
                    },
                    syntax: {
                        js: [],
                        py: [
                            {
                                syntax: 'NemoLite.compass_analog_value(%1)',
                                textParams: [],
                            },
                        ],
                    },
                },
                nemolite_ext_get_compass_custom_value: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    fontColor: '#fff',
                    skeleton: 'basic_string_field',
                    statements: [],
                    template: Lang.template.nemolite_ext_get_compass_custom_value,
                    params: [
                        {
                            type: 'Block',
                            accept: 'string',
                            defaultType: 'number',
                        },
                    ],
                    events: {},
                    def: {
                        params: [
                            {
                                type: 'nemolite_dropdown_sensor_mode',
                            },
                        ],
                        type: 'nemolite_ext_get_compass_custom_value',
                    },
                    paramsKeyMap: {
                        TYPE: 0,
                    },
                    class: 'nemolite_extension',
                    isNotFor: ['ProboNemoLite'],
                    func: function (sprite, script) {
                        const modeKey = Entry.ProboNemoLite.getSensorModeKey(
                            script.getStringValue('TYPE')
                        );
                        const value = Entry.ProboNemoLite.compass[modeKey];
                        return value;
                    },
                    syntax: {
                        js: [],
                        py: [
                            {
                                syntax: 'NemoLite.compass_custom_value(%1)',
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
                memolite_ext_is_compass_direction: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    fontColor: '#fff',
                    skeleton: 'basic_boolean_field',
                    statements: [],
                    template: Lang.template.memolite_ext_is_compass_direction,
                    params: [
                        {
                            type: 'Block',
                            accept: 'string',
                            defaultType: 'number',
                        },
                    ],
                    events: {},
                    def: {
                        params: [
                            {
                                type: 'nemolite_dropdown_direction',
                            },
                        ],
                        type: 'memolite_ext_is_compass_direction',
                    },
                    paramsKeyMap: {
                        DIRECTION: 0,
                    },
                    class: 'nemolite_extension',
                    isNotFor: ['ProboNemoLite'],
                    func: function (sprite, script) {
                        const key = Entry.ProboNemoLite.getDirectionKey(
                            script.getStringValue('DIRECTION')
                        );
                        const value = Entry.ProboNemoLite.compass.direction;
                        return value === key;
                    },
                    syntax: {
                        js: [],
                        py: [
                            {
                                syntax: 'NemoLite.is_compass_direction(%1)',
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
                //endregion
            }; // getBlock() return;
        }
    })();
})();

module.exports = Entry.ProboNemoLite;
