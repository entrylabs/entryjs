'use strict';

const _throttle = require('lodash/throttle');

(function() {
    const CONNECT_INDEX = 0x32; //50
    const RELEASE_VERSION = 17;
    const SERIAL_INTERVAL = 32;
    const EVENT_INTERVAL = 16;
    const SEND_PACKET_LENGTH = 22;
    const RECEIVED_PACKET_LENGTH = 26;
    Entry.ProboConnectLite = new (class ProboConnectLite {
        constructor()  {
            this.id = '270101';
            this.name = 'ProboConnectLite';
            this.url = 'https://imssam.me';
            this.imageName = 'alux_proboconnect_lite.png';
            this.title = {
                ko: '프로보 커넥트',
                en: 'Probo Connect',
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

            this.Color = {
                Red:    { Min: 13, Max: 37 },
                Green:  { Min: 38, Max: 62 },
                Blue:   { Min: 63, Max: 87 },
                Yellow: { Min: 88, Max: 112 },
                Black:  { Min: 113, Max: 137 },
                White:  { Min: 138, Max: 162 },
            };
            this.MultiSwitch = {
                Key1: {  Min: 1, Max: 19 },
                Key2: { Min: 26, Max: 44 },
                Key3: { Min: 53, Max: 77 },
                Key4: { Min: 83, Max: 101 },
                Key5: { Min: 107, Max: 125 },
                Key6: { Min: 139, Max: 157 },
                Key7: { Min: 160, Max: 178 },
                Key8: { Min: 191, Max: 209 }
            };
            this.Note = {
                n32: 48,
                n16: 96,  n16d: 144,  n16t: 64,
                n8:  192, n8d:  288,  n8t:  128,
                n4:  384, n4d:  576,  n4t:  256,
                n2:  768, n2d:  1152, n2t:  512,
                n1:  1536,
            };
            this.Rgb = {
                Off: 0,
                On: { Red: 1, Yellow: 12, Green: 23, Cyan: 34, Blue: 45, Magenta: 56, White:   67 },
                Dimming: {
                    Red:     90,
                    Yellow:  91,
                    Green:   92,
                    Cyan:    93,
                    Blue:    94,
                    Magenta: 95,
                    White:   96
                }
            };
            this.Melody = [0, 35391, 33405, 31530, 29760, 28090, 26513, 25025, 23621, 22295, 21044, 19863, 18748];
            this.Track = [
                [0x451F, 0x3D95, 0x36DD, 0x33C8, 0x2E22, 0x291A, 0x249E], // Start : size 7,
                [0x228F, 0x249E, 0x291A, 0x2E22, 0x33C8, 0x36DD, 0x3D95, 0x451F], // End : size 8,
                [0x228F, 0x1B6E, 0x1711, 0x1147 ], // LevelUp : size 4,
                [0x1147, 0x1711, 0x1B6E, 0x228F ], // LevelDwon : size 4,
            ];

            const eventSetting = {
                leading: true,
                trailing: false
            }
            this.remoteEvent = _throttle(
                () => {
                    Entry.engine.fireEvent('connectlite_event_remote_input');
                },
                EVENT_INTERVAL,
                eventSetting
            );
            this.digitalEvent = _throttle(
                () => {
                    Entry.engine.fireEvent('connectlite_event_digital_input');
                }
                ,
                EVENT_INTERVAL,
                eventSetting
            );

            this.qRear = 0;
            this.qFront = 0;
            this.qSize = 128;
            this.qBuffer = new Uint8Array(this.qSize + 2).fill(-1);            
            this.inputPacket = new Uint8Array(RECEIVED_PACKET_LENGTH).fill(-1);
            this.pLength = 0; // packet length
            this.process = false; // packet process

            this.version = 0;
            this.sendFlag = true;            

            this.blockMenuBlocks = [
                //dropdown
                'connectlite_dropdown_remote_key',
                'connectlite_dropdown_digital_key',
                'connectlite_dropdown_analog_key',
                'connectlite_dropdown_setting_sensor_key',
                'connectlite_dropdown_inNcom_sensor_key',
                'connectlite_dropdown_sensor_color_key',
                'connectlite_dropdown_rgb_color_key',
                'connectlite_dropdown_sensor_angle_key',
                'connectlite_dropdown_multikey_key',
                'connectlite_dropdown_extension_digital_key',
                'connectlite_dropdown_extension_analog_key',
                'connectlite_dropdown_dc_1_all_key',
                'connectlite_dropdown_port_1_4_key',
                'connectlite_dropdown_on_off_key',
                'connectlite_dropdown_velocity_key',
                'connectlite_dropdown_servo_position_key',
                'connectlite_dropdown_note_key',
                'connectlite_dropdown_time_1_key',
                'connectlite_dropdown_time_2_key',
                'connectlite_dropdown_time_3',
                'connectlite_dropdown_pitch_key',
                'connectlite_dropdown_melody_key',

                //event
                'connectlite_when_press_remote_key',
                'connectlite_when_input_digital_value',

                //setting
                'connectlite_set_sensor_setting',

                //input
                'connectlite_is_remote_key',
                'connectlite_is_digital_value',
                'connectlite_is_extension_digital_input',
                'connectlite_get_analog_value',
                'connectlite_get_extension_analog_input',
                'connectlite_get_tri_axis_acceler_x',
                'connectlite_get_tri_axis_acceler_y',
                'connectlite_get_tri_axis_acceler_z',
                'connectlite_get_value_mapping',
                'connectlite_is_color_value',
                'connectlite_get_color_value',
                'connectlite_set_infinite_setting',
                'connectlite_get_infinite_mm_diameter',
                'connectlite_get_infinite_transform_input',
                'connectlite_is_multi_sensor',
                'connectlite_is_multi_switch',
                'connectlite_set_eeprom_call',
                'connectlite_get_eeprom_address_value',

                //output
                'connectlite_set_dc_output',
                'connectlite_set_servo_output',
                'connectlite_set_s_dc_output',
                'connectlite_set_port_output',
                'connectlite_play_melody_note_output',
                'connectlite_play_melody_sec_output',
                'connectlite_play_melody_output',
                'connectlite_play_value_sec_output',
                'connectlite_play_value_output',    
                'connectlite_play_melody_track_output',
                'connectlite_play_melody_off',
                'connectlite_set_rgbled_on_output',
                'connectlite_set_rgbled_off_output',
                'connectlite_set_rgbled_flashing_output',
                'connectlite_set_rgbled_dimming_output',
                'connectlite_set_fnd_output',
                'connectlite_set_fnd_off',

                //EEPROM
                'connectlite_set_eeprom_write',
            ];
        }        

        setLanguage() {
            return {
                ko: {
                    template: {
                        connectlite_item_switch: '스위치',
                        connectlite_item_infrared: '적외선',
                        connectlite_item_magnetic: '자석',
                        connectlite_item_rotation: '회전',
                        connectlite_item_color: '컬러',
                        connectlite_item_acceleration: '가속도',
                        connectlite_item_ultrasonic: '초음파',
                        connectlite_item_heart_rate: '심박',
                        connectlite_item_illuminance: '조도',
                        connectlite_item_temperature: '온도',
                        connectlite_item_sound: '소리',
                        connectlite_item_tilt: '기울기',
                        connectlite_item_pressure: '압력',
                        connectlite_item_multi_touch: '멀티키',
                        connectlite_item_compass: '나침반',
                        connectlite_item_tri_acceleration: '3가속',
                        connectlite_item_multi_switch: '분배기',
                        connectlite_item_infinite_rotation: '무한회전',
                        connectlite_item_extension_input: '확장입력',
                        connectlite_item_color_red: '빨간색',
                        connectlite_item_color_green: '초록색',
                        connectlite_item_color_blue: '파란색',
                        connectlite_item_color_cyan: '청녹색',
                        connectlite_item_color_magenta: '자홍색',
                        connectlite_item_color_yellow: '노란색',
                        connectlite_item_color_black: '검정색',
                        connectlite_item_color_white: '하얀색',
                        connectlite_item_value: '값',
                        connectlite_item_angle: '각도',
                        connectlite_item_absolute_angle: '절대각도',
                        connectlite_item_number_of_rotations: '회전 수',
                        connectlite_item_key_1: '키1',
                        connectlite_item_key_2: '키2',
                        connectlite_item_key_3: '키3',
                        connectlite_item_key_4: '키4',
                        connectlite_item_key_5: '키5',
                        connectlite_item_key_6: '키6',
                        connectlite_item_key_7: '키7',
                        connectlite_item_key_8: '키8',
                        connectlite_item_all: '모두',
                        connectlite_item_on: '켜기',
                        connectlite_item_off: '끄기',
                        connectlite_item_note_whole: '온',
                        connectlite_item_note_half: '2분',
                        connectlite_item_note_quarter: '4분',
                        connectlite_item_note_eighth: '8분',
                        connectlite_item_note_sixteenth: '16분',
                        connectlite_item_note_thirty_second: '32분',
                        connectlite_item_pitch_do: '도',
                        connectlite_item_pitch_do_sharp: '도#',
                        connectlite_item_pitch_re: '레',
                        connectlite_item_pitch_re_sharp: '레#',
                        connectlite_item_pitch_mi: '미',
                        connectlite_item_pitch_fa: '파',
                        connectlite_item_pitch_fa_sharp: '파#',
                        connectlite_item_pitch_sol: '솔',
                        connectlite_item_pitch_sol_sharp: '솔#',
                        connectlite_item_pitch_ra: '라',
                        connectlite_item_pitch_ra_sharp: '라#',
                        connectlite_item_pitch_si: '시',
                        connectlite_item_melody_start: '시작음',
                        connectlite_item_melody_end: '종료음',
                        connectlite_item_melody_level_up: '레벨 업',
                        connectlite_item_melody_level_down: '레벨 다운',

                        connectlite_item_error: '오류',
                        connectlite_item_nothing: '없음',
        
                        connectlite_when_press_remote_key: '%1 리모컨 %2 키를 눌렀을 때',
                        connectlite_when_input_digital_value: '%1 디지털 입력 %2 이(가) 들어왔을 때',
        
                        connectlite_set_sensor_setting: '입력포트 %1 을(를) %2 센서로 설정 %3',
        
                        connectlite_is_remote_key: '리모컨 입력 %1',
                        connectlite_is_digital_value: '디지털 입력 %1',
                        connectlite_is_extension_digital_input: '확장 디지털 입력 %1 의 %2',
                        connectlite_get_analog_value: '아날로그 입력 %1',
                        connectlite_get_extension_analog_input: '확장 아날로그 입력 %1 의 %2',
                        connectlite_get_tri_axis_acceler_x: '3가속도 %1의 X축',
                        connectlite_get_tri_axis_acceler_y: '3가속도 %1의 Y축',
                        connectlite_get_tri_axis_acceler_z: '3가속도 %1의 Z축',
                        connectlite_get_value_mapping: '%1 의 %2 ~ %3 값을 %4 ~ %5 (으)로 변환',
                        connectlite_is_color_value: '컬러 센서 %1 이(가) %2 인가?',
                        connectlite_get_color_value: '컬러 센서 %1 의 색상',
                        connectlite_set_infinite_setting: '%1 센서 %2 을 %3 값으로 정하기 %4',
                        connectlite_get_infinite_mm_diameter: '%1 센서 %2 지름 %3 의 mm 값',
                        connectlite_get_infinite_transform_input: '%1 센서 %2 의  %3',
                        connectlite_is_multi_sensor: '멀티키 센서 %1의 %2',
                        connectlite_is_multi_switch: '분배 스위치 %1의 %2',
                        connectlite_set_eeprom_call: 'EEPROM %1 주소의 값 호출하기 %2',
                        connectlite_get_eeprom_address_value: 'EEPROM 주소의 값',      
        
                        connectlite_set_port_output: '출력핀 %1 을(를) %2 %3',
                        connectlite_set_servo_output: '서보 모터 %1 의 위치를 %2 로 이동 %3',
                        connectlite_set_s_dc_output: 'S 모터 %1 을(를) %2 속도로 회전 %3',
                        connectlite_set_dc_output: 'DC 모터 %1 을(를) %2 속도로 회전 %3',
                        connectlite_play_melody_note_output: '%1 을(를) %2 음표로 연주하기 %3',
                        connectlite_play_melody_sec_output: '%1 을(를) %2 초 동안 연주하기 %3',
                        connectlite_play_melody_output: '%1 을(를) 연주하기 %2',
                        connectlite_play_value_sec_output: '%1 값을(를) %2 초 동안 연주하기 %3',
                        connectlite_play_value_output: '%1 값을(를) 연주하기 %2',
                        connectlite_play_melody_track_output: '%1 을(를) %2초 간격으로 재생하기 %3',
                        connectlite_play_melody_off: '멜로디 중지 %1',
                        connectlite_set_rgbled_on_output: 'RGB LED %1 을(를) %2 으로 켜기 %3',
                        connectlite_set_rgbled_off_output: 'RGB LED %1 을(를) 끄기 %2',
                        connectlite_set_rgbled_dimming_output: 'RGB LED %1 을(를) %2 으로 디밍 %3',
                        connectlite_set_rgbled_flashing_output: 'RGB LED %1 %2 으로 %3 초 간격 %4',
                        connectlite_set_fnd_output: 'FND를 %1 (으)로 설정 %2',
                        connectlite_set_fnd_off: 'FND 끄기 %1',
                        connectlite_set_eeprom_write: 'EEPROM %1 주소에 %2 값 설정하기 %3',
                    },
                    Device: {
                        probo_connect_lite: '프로보 커넥트',
                    },
                    Menus: {
                        probo_connect_lite: '프로보 커넥트',
                    },
                },
                en: {

                    template: {
                        connectlite_item_switch: 'Switch',
                        connectlite_item_infrared: 'Infrared',
                        connectlite_item_magnetic: 'Magnetic',
                        connectlite_item_rotation: 'Rotation',
                        connectlite_item_color: 'Color',
                        connectlite_item_acceleration: 'Acceleration',
                        connectlite_item_ultrasonic: 'Ultrasonic',
                        connectlite_item_heart_rate: 'Heart Rate',
                        connectlite_item_illuminance: 'Illuminance',
                        connectlite_item_temperature: 'Temperature',
                        connectlite_item_sound: 'Sound',
                        connectlite_item_tilt: 'Tilt',
                        connectlite_item_pressure: 'Pressure',
                        connectlite_item_multi_touch: 'Multi Touch',
                        connectlite_item_compass: 'Compass',
                        connectlite_item_tri_acceleration: '3Acceleration',
                        connectlite_item_multi_switch: 'Multi Switch',
                        connectlite_item_infinite_rotation: 'Infinite Rotation',
                        connectlite_item_extension_input: 'Extension Input',
                        connectlite_item_color_red: 'Red',
                        connectlite_item_color_green: 'Green',
                        connectlite_item_color_blue: 'Blue',
                        connectlite_item_color_cyan: 'Cyan',
                        connectlite_item_color_magenta: 'Magenta',
                        connectlite_item_color_yellow: 'Yellow',
                        connectlite_item_color_black: 'Black',
                        connectlite_item_color_white: 'White',
                        connectlite_item_value: 'Value',
                        connectlite_item_angle: 'Angle',
                        connectlite_item_absolute_angle: 'Absolute Angle',
                        connectlite_item_number_of_rotations: 'Number of Rotations',
                        connectlite_item_key_1: 'Key1',
                        connectlite_item_key_2: 'Key2',
                        connectlite_item_key_3: 'Key3',
                        connectlite_item_key_4: 'Key4',
                        connectlite_item_key_5: 'Key5',
                        connectlite_item_key_6: 'Key6',
                        connectlite_item_key_7: 'Key7',
                        connectlite_item_key_8: 'Key8',
                        connectlite_item_all: 'All',
                        connectlite_item_on: 'On',
                        connectlite_item_off: 'Off',
                        connectlite_item_note_whole: 'Whole',
                        connectlite_item_note_half: 'Half',
                        connectlite_item_note_quarter: 'Quarter',
                        connectlite_item_note_eighth: 'Eighth',
                        connectlite_item_note_sixteenth: 'Sixteenth',
                        connectlite_item_note_thirty_second: 'Thirty-Second',
                        connectlite_item_pitch_do: 'do',
                        connectlite_item_pitch_do_sharp: 'xdo',
                        connectlite_item_pitch_re: 're',
                        connectlite_item_pitch_re_sharp: 'xre',
                        connectlite_item_pitch_mi: 'mi',
                        connectlite_item_pitch_fa: 'fa',
                        connectlite_item_pitch_fa_sharp: 'xfa',
                        connectlite_item_pitch_sol: 'sol',
                        connectlite_item_pitch_sol_sharp: 'xsol',
                        connectlite_item_pitch_ra: 'ra',
                        connectlite_item_pitch_ra_sharp: 'xra',
                        connectlite_item_pitch_si: 'si',
                        connectlite_item_melody_start: 'Start',
                        connectlite_item_melody_end: 'End',
                        connectlite_item_melody_level_up: 'Level up',
                        connectlite_item_melody_level_down: 'Level down',
                        
                        connectlite_item_error: 'error',
                        connectlite_item_nothing: 'nothing',

                        connectlite_when_press_remote_key: '%1 When %2 remote control key pressed',
                        connectlite_when_input_digital_value: '%1 When %2 digital pin input',

                        connectlite_set_sensor_setting: 'Set input port %1 to %2 sensor %3',

                        connectlite_is_remote_key: 'Remote control %1',
                        connectlite_is_digital_value: 'Read digital pin %1',
                        connectlite_is_extension_digital_input: 'Extension digital input %1 to %2',
                        connectlite_get_analog_value: 'Read analog pin %1',
                        connectlite_get_extension_analog_input: 'Extension analog input %1 to %2',
                        connectlite_get_tri_axis_acceler_x: '3acceleration %1 and X',
                        connectlite_get_tri_axis_acceler_y: '3acceleration %1 and Y',
                        connectlite_get_tri_axis_acceler_z: '3acceleration %1 and Z',
                        connectlite_get_value_mapping: '%1 to value %2 ~ %3 change %4 ~ %5',
                        connectlite_is_color_value: 'Is color sensor %1 %2 ?',
                        connectlite_get_color_value: 'Color of color sensor %1',
                        connectlite_set_infinite_setting: 'Set %1 sensor %2 to %3 value %4',
                        connectlite_get_infinite_mm_diameter: 'The move distance(in mm) when the %1 sensor %2 is %3 mm in diameter',
                        connectlite_get_infinite_transform_input: '%1 rotation sensor %2 to %3',
                        connectlite_is_multi_sensor: 'Multi sensor %1 key %2',
                        connectlite_is_multi_switch: 'A key number of the multi-switch sensor %1 = %2',
                        connectlite_set_eeprom_call:'Calling the value of EEPROM %1 address',
                        connectlite_get_eeprom_address_value: 'Value of EEPROM address',

                        connectlite_set_dc_output: 'DC motor %1 velocity %2 %3',
                        connectlite_set_servo_output: 'Servo motor %1 position %2 %3',
                        connectlite_set_s_dc_output: 'Servo motor %1 speed %2 %3',
                        connectlite_set_port_output: 'Set digital pin %1 as %2 %3',
                        connectlite_play_melody_note_output: 'Play key %1 for %2 note %3',
                        connectlite_play_melody_sec_output: 'Play key %1 for %2 secs %3',
                        connectlite_play_melody_output: 'Play key %1 %2',
                        connectlite_play_value_sec_output: 'Play value %1 for %2 secs %3',
                        connectlite_play_value_output: 'Play value %1 %2',
                        connectlite_play_melody_track_output: 'Play sound %1 for %2 secs %3',
                        connectlite_play_melody_off: 'Stop tone %1',
                        connectlite_set_rgbled_on_output: 'Turn on RGB LED %1 to %2 %3',
                        connectlite_set_rgbled_off_output: 'Turn off RGB LED %1 %2',
                        connectlite_set_rgbled_dimming_output: 'Dimming RGB LED %1 to %2 %3',
                        connectlite_set_rgbled_flashing_output: 'RGB LED %1 Blinking %2 at %3 second intervals %4',
                        connectlite_set_fnd_output: 'Set FND to %1 %2',
                        connectlite_set_fnd_off: 'Turn off FND %1',
                        connectlite_set_eeprom_write: 'Set EEPROM %1 address to %2 %3',
                    },
                    Device: {
                        probo_connect_lite: 'Probo Connect',
                    },
                    Menus: {
                        probo_connect_lite: 'Probo Connect',
                    },
                },
            };
        }

        // 시작하기 및 정지하기 시 기기상태를 초기화한다.
        setZero() {
            this.Infinite = {
                Buff: {
                    AA1: 0,
                    AA2: 0,
                    AA3: 0,
                    AA4: 0
                },
                Count: {
                    AA1: 0,
                    AA2: 0,
                    AA3: 0,
                    AA4: 0
                },
                Start: {                    
                    AA1: 0,
                    AA2: 0,
                    AA3: 0,
                    AA4: 0
                }
            };
            this.SensorSet = {
                AA1: 0,
                AA2: 0,
                AA3: 0,
                AA4: 0
            };
            this.InputData = {
                Analog: {
                    AA1: 0,
                    AA2: 0,
                    AA3: 0,
                    AA4: 0
                },
                Digital: {
                    A1: 0,
                    A2: 0,
                    A3: 0,
                    A4: 0,
                    FEA1: 0,
                    FEA2: 0,
                    FEA3: 0,
                    FEA4: 0,
                    REA1: 0,
                    REA2: 0,
                    REA3: 0,
                    REA4: 0,
                    BEA1: 0,
                    BEA2: 0,
                    BEA3: 0,
                    BEA4: 0
                },
                Remote: {
                    R_1: 0,
                    R_2: 0,
                    R_3: 0,
                    R_4: 0,
                    R_5: 0,
                    R_6: 0,
                    R_7: 0,
                    R_8: 0,
                    R_L1: 0,
                    R_L2: 0,
                    R_R1: 0,
                    R_R2: 0
                },
                EEPROM: {
                    EC: 0,
                    EEPR2: 0,
                    EEPR1: 0
                },
                Infinite:{
                    ROTATION_1: 0,
                    ROTATION_2: 0,
                    ROTATION_3: 0,
                    ROTATION_4: 0
                },
                Acceler:{
                    AXIS_X1: 0,
                    AXIS_X2: 0,
                    AXIS_X3: 0,
                    AXIS_X4: 0,
                    AXIS_Y1: 0,
                    AXIS_Y2: 0,
                    AXIS_Y3: 0,
                    AXIS_Y4: 0,
                    AXIS_Z1: 0,
                    AXIS_Z2: 0,
                    AXIS_Z3: 0,
                    AXIS_Z4: 0
                }
            };
            this.RemoteData = {
                B1: 0,
                B2: 0,
                B3: 0,
                B4: 0,
                Servo1: 0,
                Servo2: 0,
                Servo3: 0,
                Servo4: 0,
                DC1: 0,
                DC2: 0,
                DC3: 0,
                DC4: 0,
                MEL2: 0,
                MEL1: 0,
                FND: 100,
                EEPR4: 0,
                EEPR3: 0,
                EEPR2: 0,
                EEPR1: 0,
                ASET2: 0,
                ASET1: 0
            };
            this.EdgeFlag = {
                FEA1: 0,
                FEA2: 0,
                FEA3: 0,
                FEA4: 0,
                REA1: 0,
                REA2: 0,
                REA3: 0,
                REA4: 0,
                BEA1: 0,
                BEA2: 0,
                BEA3: 0,
                BEA4: 0
            };
            this.EEPROM = {
                Buff: 0,
                Count: 0
            };
            
            if (Entry.hwLite && Entry.hwLite.serial) {
                Entry.hwLite.serial.update();
            };
        }

        // 하드웨어 연결 후 초기화한다.
        async initialHandshake() {
            const modePacket = new Uint8Array(2).fill(0);
            modePacket[0] = 0x63;
            modePacket[1] = 0x36;

            while(true) {
                const response = await Entry.hwLite.serial.sendAsyncWithThrottle(modePacket);
                if (response[0] !== CONNECT_INDEX) {
                    modePacket[0] = 0x24;
                    modePacket[1] = 0x42;
                } else {
                    this.version = (response.length === 1)
                        ? 0
                        : response[1];
                    await Entry.Utils.sleep(1000);
                    break;
                }
                await Entry.Utils.sleep(100);
            }

            Entry.addEventListener('run', this.handleRemoteEventInterval.bind(this));
            Entry.addEventListener('run', this.handleDigitalEventInterval.bind(this));
            Entry.addEventListener('beforeStop', clearInterval(this.remoteEventIntervalId));
            Entry.addEventListener('beforeStop', clearInterval(this.digitalEventIntervalId));

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

        handleRemoteEventInterval() {
            this.remoteEventIntervalId = setInterval(this.remoteEvent.bind(this), EVENT_INTERVAL);
        }

        handleDigitalEventInterval() {
            this.digitalEventIntervalId = setInterval(this.digitalEvent.bind(this), EVENT_INTERVAL);
        }

        // 디바이스에서 값을 읽어온다.
        handleLocalData(buffer) {
            buffer.forEach(b => this.qEnqueue(b));
            
            while(this.qCount() >= this.inputPacket.length) {
                if (!this.process) {
                    while(this.qCount() > 0) {
                        if (this.inputPacket[0] !== 0xCD) {
                            this.inputPacket[0] = this.qDequeue();
                        } else if (this.inputPacket[1] !== 0xDA) {
                            this.inputPacket[1] = this.qDequeue();
                        } else {
                            this.inputPacket[2] = this.qDequeue();
                            this.pLength = this.inputPacket[2] + 3;
                            this.process = true;
                            break;
                        }
                    }
                }
    
                if (this.process && (this.qCount() >= this.pLength)) {
                    for (let i = 3; i < this.pLength; i++) {
                        this.inputPacket[i] = this.qDequeue();
                    }
                    if (this.checksumHandle(this.inputPacket)) {
                        this.processInputPacket(this.inputPacket);
                    }

                    this.inputPacket = new Uint8Array(RECEIVED_PACKET_LENGTH).fill(-1);
                    this.process = false;
                    this.sendFlag = true;
                    this.pLength = 0;
                }
            }

            if (this.sendFlag) {
                setTimeout(
                    () => {                    
                        if (Entry.hwLite && Entry.hwLite.serial) {
                            Entry.hwLite.serial.update();
                            this.sendFlag = false;
                        }
                    },
                    SERIAL_INTERVAL
                );
            };
        }

        //디바이스에 값을 쓴다.
        requestLocalData() {
            if (this.sendFlag) {
                return this.generateOutputPacket(this.RemoteData);
            }
        }

        qEnqueue(data) {
            this.qBuffer[this.qRear] = data;
            this.qRear = (this.qRear + 1) % this.qSize
        }

        qDequeue() {
            const data = this.qBuffer[this.qFront];
            this.qBuffer[this.qFront] = -1;
            this.qFront = (this.qFront + 1) % this.qSize;
            return data;
        }

        qCount() {
            return (this.qFront <= this.qRear)
                ? (this.qRear - this.qFront)
                : (this.qSize - this.qFront + this.qRear);
        }

        checksumRequest(packet) {
            const length = packet[2] + 2;
            let checker = 0;
            for(let i = 3; i < length; i++) {
                checker += packet[i];
            }
            return (checker & 0xFF);

        }
        
        checksumHandle(packet) {
            let checker = 0;
            const length = packet[2] + 2;
            for(let i = 3; i < length ; i++ ) {
                checker += packet[i];
            }
            return (packet[length] === (checker & 0xFF))
        }

        processInputPacket(packet) {
            const digitalByte1 = packet[8];
            const digitalByte2 = packet[9];
            const remoteByte1 = packet[10];
            const remoteByte2 = packet[11];
            const rotationByte = packet[16];

            this.InputData.Analog.AA1 = packet[4];
            this.InputData.Analog.AA2 = packet[5];
            this.InputData.Analog.AA3 = packet[6];
            this.InputData.Analog.AA4 = packet[7];

            this.InputData.Digital.A4 = (digitalByte1 >> 7) & 0x01;
            this.InputData.Digital.A3 = (digitalByte1 >> 6) & 0x01;
            this.InputData.Digital.A2 = (digitalByte1 >> 5) & 0x01;
            this.InputData.Digital.A1 = (digitalByte1 >> 4) & 0x01;
            this.InputData.Digital.FEA4 = (digitalByte1 >> 3) & 0x01;
            this.InputData.Digital.FEA3 = (digitalByte1 >> 2) & 0x01;
            this.InputData.Digital.FEA2 = (digitalByte1 >> 1) & 0x01;
            this.InputData.Digital.FEA1 = digitalByte1 & 0x01;
            this.InputData.Digital.REA4 = (digitalByte2 >> 7) & 0x01;
            this.InputData.Digital.REA3 = (digitalByte2 >> 6) & 0x01;
            this.InputData.Digital.REA2 = (digitalByte2 >> 5) & 0x01;
            this.InputData.Digital.REA1 = (digitalByte2 >> 4) & 0x01;
            this.InputData.Digital.BEA4 = (digitalByte2 >> 3) & 0x01;
            this.InputData.Digital.BEA3 = (digitalByte2 >> 2) & 0x01;
            this.InputData.Digital.BEA2 = (digitalByte2 >> 1) & 0x01;
            this.InputData.Digital.BEA1 = digitalByte2 & 0x01;

            this.InputData.Remote.R_3 = (remoteByte1 >> 7) & 0x01;
            this.InputData.Remote.R_2 = (remoteByte1 >> 6) & 0x01;
            this.InputData.Remote.R_4 = (remoteByte1 >> 5) & 0x01;
            this.InputData.Remote.R_1 = (remoteByte1 >> 4) & 0x01;                    
            this.InputData.Remote.R_7 = (remoteByte2 >> 7) & 0x01;
            this.InputData.Remote.R_6 = (remoteByte2 >> 6) & 0x01;
            this.InputData.Remote.R_8 = (remoteByte2 >> 5) & 0x01;
            this.InputData.Remote.R_5 = (remoteByte2 >> 4) & 0x01;
            this.InputData.Remote.R_R1 = (remoteByte2 >> 3) & 0x01;
            this.InputData.Remote.R_L1 = (remoteByte2 >> 2) & 0x01;
            this.InputData.Remote.R_R2 = (remoteByte2 >> 1) & 0x01;
            this.InputData.Remote.R_L2 = remoteByte2 & 0x01;

            this.InputData.EEPROM.EC = packet[13];
            this.InputData.EEPROM.EEPR2 = packet[14];
            this.InputData.EEPROM.EEPR1 = packet[15];

            this.InputData.Infinite.ROTATION_1 = (rotationByte >> 6) & 0x0C;
            this.InputData.Infinite.ROTATION_2 = (rotationByte >> 4) & 0x0C;
            this.InputData.Infinite.ROTATION_3 = (rotationByte >> 2) & 0x0C;
            this.InputData.Infinite.ROTATION_4 = rotationByte & 0x03;

            this.InputData.Acceler.AXIS_X1 = packet[4];
            this.InputData.Acceler.AXIS_X2 = packet[5];
            this.InputData.Acceler.AXIS_X3 = packet[6];
            this.InputData.Acceler.AXIS_X4 = packet[7];

            this.InputData.Acceler.AXIS_Y1 = packet[17];
            this.InputData.Acceler.AXIS_Y2 = packet[19];
            this.InputData.Acceler.AXIS_Y3 = packet[21];
            this.InputData.Acceler.AXIS_Y4 = packet[23];

            this.InputData.Acceler.AXIS_Z1 = packet[18];
            this.InputData.Acceler.AXIS_Z2 = packet[20];
            this.InputData.Acceler.AXIS_Z3 = packet[22];
            this.InputData.Acceler.AXIS_Z4 = packet[24];
        }

        generateOutputPacket(remoteData) {           

            const outputPacket = new Uint8Array(SEND_PACKET_LENGTH).fill(-1);

            outputPacket[0] = 0xAD;
            outputPacket[1] = 0xDA;
            outputPacket[2] = outputPacket.length - 3;

            outputPacket[3] = 0xF0 | (remoteData.B4 << 3) | (remoteData.B3 << 2) | (remoteData.B2 << 1) | remoteData.B1;

            outputPacket[4] = remoteData.Servo1;
            outputPacket[5] = remoteData.Servo2;
            outputPacket[6] = remoteData.Servo3;
            outputPacket[7] = remoteData.Servo4;

            outputPacket[8] = remoteData.DC1;
            outputPacket[9] = remoteData.DC2;
            outputPacket[10] = remoteData.DC3;
            outputPacket[11] = remoteData.DC4;

            outputPacket[12] = remoteData.MEL2;
            outputPacket[13] = remoteData.MEL1;

            outputPacket[14] = remoteData.FND; 

            outputPacket[15] = remoteData.EEPR4;
            outputPacket[16] = remoteData.EEPR3;
            outputPacket[17] = remoteData.EEPR2;
            outputPacket[18] = remoteData.EEPR1;

            outputPacket[19] = remoteData.ASET2;
            outputPacket[20] = remoteData.ASET1;

            outputPacket[21] = this.checksumRequest(outputPacket);

            return outputPacket;
        }
        
        getMonitorPort() {
            return { ...this.InputData.Analog };
        }

        getRemoteKey(data) {
            const num = Number(data);            
            
            if (1 <= num && num <= 8) {
                return `R_${num}`;
            } else if (9 <= num && num <= 10) {
                return `R_L${(num - 8)}`;
            } else if (11 <= num && num <= 12) {
                return `R_R${(num - 10)}`;
            } else {
                return data;
            }
        }

        getDigitalKey(data) {
            const num = Number(data);

            if (1 <= num && num <= 4) {
                return `A${num}`;
            } else if (5 <= num && num <= 8) {
                return `FEA${num - 4}`;
            } else if (9 <= num && num <= 12) {
                return `REA${num - 8}`;
            } else if (13 <= num && num <= 16) {
                return `BEA${num - 12}`;
            } else {
                return data;
            }
        }

        getDigitalStateValue(key) {
            let value = false;
            switch(key) {
                case 'A1':
                case 'A2':
                case 'A3':
                case 'A4':
                    value = (Entry.ProboConnectLite.InputData.Digital[key] === 1);
                    break;
                default:
                    if (Entry.ProboConnectLite.InputData.Digital[key] === 1) {
                        if (Entry.ProboConnectLite.EdgeFlag[key] === 0) {
                            Entry.ProboConnectLite.EdgeFlag[key] = 1;
                            value = true;
                        }
                    } else {
                        Entry.ProboConnectLite.EdgeFlag[key] = 0;
                    }
                    break;
            }

            return value;
        }

        getAnalogKey(data) {
            const num = Number(data);

            if (1 <= num && num <= 4) {
                return `AA${num}`;
            } else {
                return data;
            }
        }

        getSettingSensorValue(key) {
            switch (key) {
                case '1':  // 스위치
                case '2':  // 적외선
                case '3':  // 자석
                case '16': // 분배기
                case Lang.template.connectlite_item_switch:       // 스위치
                case Lang.template.connectlite_item_infrared:     // 적외선
                case Lang.template.connectlite_item_magnetic:     // 자석
                case Lang.template.connectlite_item_multi_switch: // 분배기
                    return 1;
                case '4': // 회전
                case '7': // 조도
                case '9': // 초음파
                case Lang.template.connectlite_item_rotation:    // 회전
                case Lang.template.connectlite_item_illuminance: // 조도            
                case Lang.template.connectlite_item_ultrasonic:  // 초음파
                    return 2;
                case '10': // 소리
                case Lang.template.connectlite_item_sound: // 소리
                    return 3;
                case '11': // 기울기
                case Lang.template.connectlite_item_tilt: // 기울기
                    return 4;
                case '12': // 압력
                case Lang.template.connectlite_item_pressure: // 압력
                    return 5;
                case '8': // 심박
                case Lang.template.connectlite_item_heart_rate: // 심박
                    return 6;
                case '5': // 컬러
                case Lang.template.connectlite_item_color: // 컬러
                    return 7;
                case '6': // 가속도
                case Lang.template.connectlite_item_acceleration: // 가속도
                    return 8;
                case '14': // 나침반
                case '15': // 3축 가속도
                case '17': // 확장 입력  
                case Lang.template.connectlite_item_compass:
                case Lang.template.connectlite_item_tri_acceleration:
                case Lang.template.connectlite_item_extension_input:
                    return 9;
                case '13': // 멀티터치(멀티키)
                case Lang.template.connectlite_item_multi_touch: // 멀티터치(멀티키)
                    return 11;
                default:
                    return key;
            }
        }

        getAxisKey(data, axis) {
            switch (data) {
                case 'AA1':
                case 'AA2':
                case 'AA3':
                case 'AA4':
                    data = data.substr(2, 2);
                    break;
            }

            return `AXIS_${axis}${data}`;
        }

        getMultiKeyValue(key) {
            const num = Number(key);

            if (1 <= num && num <= 8) {
                return (num - 1);
            } else {
                switch (key) {
                    case Lang.template.connectlite_item_key_1:
                        return 0;
                    case Lang.template.connectlite_item_key_2:
                        return 1;
                    case Lang.template.connectlite_item_key_3:
                        return 2;
                    case Lang.template.connectlite_item_key_4:
                        return 3;
                    case Lang.template.connectlite_item_key_5:
                        return 4;
                    case Lang.template.connectlite_item_key_6:
                        return 5;
                    case Lang.template.connectlite_item_key_7:
                        return 6;
                    case Lang.template.connectlite_item_key_8:
                        return 7;
                    default:
                        return key;
                }
            }
        }

        getExtentionDigitalValue(key) {
            const num = Number(key);
            if (1 <= num && num <= 8) {
                return (num - 1);
            } else if (9 <= num && num <= 16) {                
                return (num - 9);
            } else {
                switch (key) {
                    case 'EA1':
                    case 'ET1':
                        return 0;
                    case 'EA2':
                    case 'ET2':
                        return 1;
                    case 'EA3':
                    case 'ET3':
                        return 2;
                    case 'EA4':
                    case 'ET4':
                        return 3;
                    case 'EA5':
                    case 'ET5':
                        return 4;
                    case 'EA6':
                    case 'ET6':
                        return 5;
                    case 'EA7':
                    case 'ET7':
                        return 6;
                    case 'EA8':
                    case 'ET8':
                        return 7;
                    default:
                        return key;
                }
            }
        }

        getExtentionAnalogKey(data) {
            switch (data) {
                case '1':
                case 'EAA1':
                    return 'Y';
                case '2':
                case 'EAA2':
                    return 'Z';
                default:
                    return data;
            }
        }

        getDckey(data) {
            const num = Number(data);

            if (1 <= num && num <= 7) {
                return `DC${num}`;
            } else {
                return data;
            }
        }

        getServoKey(data) {
            const num = Number(data);

            if (1 <= num && num <= 4) {
                return `Servo${num}`;
            } else {
                return data;
            }
        }

        getPortKey(data) {
            const num = Number(data);

            if (1 <= num && num <= 4) {
                return `B${num}`;
            } else {
                return data;
            }
        }

        getPortToggleValue(key) {
            switch (key) {
                case '1':
                case Lang.template.connectlite_item_on:
                    return 1;
                case '0':
                case Lang.template.connectlite_item_off:
                    return 0;
                default:
                    return key;
            }
        }

        getSensorAngleKey(data) {
            switch (data) {
                case '1':
                case Lang.template.connectlite_item_value:
                    return 'IS1';
                case '2':
                case Lang.template.connectlite_item_angle:
                    return 'IS2';
                case '3':
                case Lang.template.connectlite_item_absolute_angle:
                    return 'IS3';
                case '4':
                case Lang.template.connectlite_item_number_of_rotations:
                    return 'IS4';
                default:
                    return data;
            }
        }

        getPitchValue(pitch) {
            // 배열의 인덱스 1번부터 음표
            const index = (pitch % 12) + 1;

            if (36 <= pitch && pitch <= 47) {
                return Entry.ProboConnectLite.Melody[index];
            } else if (48 <= pitch && pitch <= 59) {
                return Entry.ProboConnectLite.Melody[index] >> 1;
            } else if (60 <= pitch && pitch <= 71) {
                return Entry.ProboConnectLite.Melody[index] >> 2;
            } else if (72 <= pitch && pitch <= 83) {
                return Entry.ProboConnectLite.Melody[index] >> 3;
            } else {
                return Entry.ProboConnectLite.Melody[0];
            }
        }

        getNoteKey(data) {
            switch (data) {
                case '1':
                case Lang.template.connectlite_item_note_whole:
                    return 'n1';
                case '2':
                case Lang.template.connectlite_item_note_half:
                    return 'n2';
                case '4':
                case Lang.template.connectlite_item_note_quarter:
                    return 'n4';
                case '8':
                case Lang.template.connectlite_item_note_eighth:
                    return 'n8';
                case '16':
                case Lang.template.connectlite_item_note_sixteenth:
                    return 'n16';
                case '32':
                case Lang.template.connectlite_item_note_thirty_second:
                    return 'n32';
                default:
                    return data;
            }
        }

        getMelodyValue(key) {
            switch (key) {
                case '1':
                case Lang.template.connectlite_item_melody_start:
                    return 0;
                case '2':
                case Lang.template.connectlite_item_melody_end:
                    return 1;
                case '3':
                case Lang.template.connectlite_item_melody_level_up:
                    return 2;
                case '4':
                case Lang.template.connectlite_item_melody_level_down:
                    return 3;
                default:
                    return key;
            }
        }

        getColorSensorKey(data) {
            switch (data) {
                case '1':
                case Lang.template.connectlite_item_color_red:
                    return 'Red';
                case '2':
                case Lang.template.connectlite_item_color_green:
                    return 'Green';
                case '3':
                case Lang.template.connectlite_item_color_blue:
                    return 'Blue';
                case '4':
                case Lang.template.connectlite_item_color_yellow:
                    return 'Yellow';
                case '5':
                case Lang.template.connectlite_item_color_black:
                    return 'Black';
                case '6':
                case Lang.template.connectlite_item_color_white:
                    return 'White';
                default:
                    return data;
            }
        }

        getRgbToggleValue(key) {
            switch (key) {
                case '0':
                    return this.Rgb.Off;
                case '1':
                case Lang.template.technicpowerlite_item_color_red:
                    return this.Rgb.On.Red;
                case '2':
                case Lang.template.technicpowerlite_item_color_green:
                    return this.Rgb.On.Green;
                case '3':
                case Lang.template.technicpowerlite_item_color_blue:
                    return this.Rgb.On.Blue;
                case '4':
                case Lang.template.technicpowerlite_item_color_cyan:
                    return this.Rgb.On.Cyan;
                case '5':
                case Lang.template.technicpowerlite_item_color_magenta:
                    return this.Rgb.On.Magenta;
                case '6':
                case Lang.template.technicpowerlite_item_color_yellow:
                    return this.Rgb.On.Yellow;
                case '7':
                case Lang.template.technicpowerlite_item_color_white:
                    return this.Rgb.On.White;
                default:
                    return key;
            }
        }

        getRgbTwinkleValue(key, sec) {
            let twinkle = 0;
            switch (sec) {
                case 0.05:
                    twinkle += 1;
                    break;
                case 0.1:
                    twinkle += 2;
                    break;
                case 0.2:
                    twinkle += 3;
                    break;
                case 0.5:
                    twinkle += 4;
                    break;
                case 1:
                    twinkle += 5;
                    break;
            }

            return this.getRgbToggleValue(key) + twinkle;
        }

        getRgbDimmingValue(key) {
            switch (key) {
                case '1':
                case Lang.template.technicpowerlite_item_color_red:
                    return this.Rgb.Dimming.Red;
                case '2':
                case Lang.template.technicpowerlite_item_color_green:
                    return this.Rgb.Dimming.Green;
                case '3':
                case Lang.template.technicpowerlite_item_color_blue:
                    return this.Rgb.Dimming.Blue;
                case '4':
                case Lang.template.technicpowerlite_item_color_cyan:
                    return this.Rgb.Dimming.Cyan;        
                case '5':
                case Lang.template.technicpowerlite_item_color_magenta:
                    return this.Rgb.Dimming.Magenta;
                case '6':
                case Lang.template.technicpowerlite_item_color_yellow:
                    return this.Rgb.Dimming.Yellow;
                case '7':
                case Lang.template.technicpowerlite_item_color_white:
                    return this.Rgb.Dimming.White;
                default:
                    return key;
            }
        }

        getBlocks() {
            return {
                ///========================================================================================
                /// Dropdown block
                ///========================================================================================
                connectlite_dropdown_remote_key: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic_string_field',
                    statements: [],
                    template: '%1',
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                ['R_1', '1'],
                                ['R_2', '2'],
                                ['R_3', '3'],
                                ['R_4', '4'],
                                ['R_5', '5'],
                                ['R_6', '6'],
                                ['R_7', '7'],
                                ['R_8', '8'],
                                ['R_L1', '9'],
                                ['R_L2', '10'],
                                ['R_R1', '11'],
                                ['R_R2', '12'],
                            ],
                            value: 1,
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                    ],
                    events: {},
                    def: {
                        params: [ null ],
                    },
                    paramsKeyMap: {
                        PARAM0: 0,
                    },
                    func: function(sprite, script) {
                        return script.getStringValue('PARAM0');
                    },
                    syntax: {
                        js: [],
                        py: [
                            {
                                syntax: '%1',
                                blockType: 'param',
                                textParams: [
                                    {
                                        type: 'Dropdown',
                                        options: [
                                            ['R_1', '1'],
                                            ['R_2', '2'],
                                            ['R_3', '3'],
                                            ['R_4', '4'],
                                            ['R_5', '5'],
                                            ['R_6', '6'],
                                            ['R_7', '7'],
                                            ['R_8', '8'],
                                            ['R_L1', '9'],
                                            ['R_L2', '10'],
                                            ['R_R1', '11'],
                                            ['R_R2', '12'],
                                        ],
                                        value: 1,
                                        fontSize: 11,
                                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                        converter: Entry.block.converters.returnStringValue,
                                    },
                                ],
                                keyOption: 'connectlite_dropdown_remote_key',
                            },
                        ],
                    },
                },
                connectlite_dropdown_digital_key: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic_string_field',
                    statements: [],
                    template: '%1',
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                ['A1', '1'],
                                ['A2', '2'],
                                ['A3', '3'],
                                ['A4', '4'],
                                ['FEA1', '5'],
                                ['FEA2', '6'],
                                ['FEA3', '7'],
                                ['FEA4', '8'],
                                ['REA1', '9'],
                                ['REA2', '10'],
                                ['REA3', '11'],
                                ['REA4', '12'],
                                ['BEA1', '13'],
                                ['BEA2', '14'],
                                ['BEA3', '15'],
                                ['BEA4', '16'],
                            ],
                            value: '1',
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                    ],
                    events: {},
                    def: {
                        params: [ null ],
                    },
                    paramsKeyMap: {
                        PARAM0: 0,
                    },
                    func: function(sprite, script) {
                        return script.getStringField('PARAM0');
                    },
                    syntax: {
                        js: [],
                        py: [
                            {
                                syntax: '%1',
                                blockType: 'param',
                                textParams: [
                                    {
                                        type: 'Dropdown',
                                        options: [
                                            ['A1', '1'],
                                            ['A2', '2'],
                                            ['A3', '3'],
                                            ['A4', '4'],
                                            ['FEA1', '5'],
                                            ['FEA2', '6'],
                                            ['FEA3', '7'],
                                            ['FEA4', '8'],
                                            ['REA1', '9'],
                                            ['REA2', '10'],
                                            ['REA3', '11'],
                                            ['REA4', '12'],
                                            ['BEA1', '13'],
                                            ['BEA2', '14'],
                                            ['BEA3', '15'],
                                            ['BEA4', '16'],
                                        ],
                                        value: '1',
                                        fontSize: 11,
                                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                        converter: Entry.block.converters.returnStringValue,
                                    },
                                ],
                                keyOption: 'connectlite_dropdown_digital_key',
                            },
                        ],
                    }
                },
                connectlite_dropdown_analog_key: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic_string_field',
                    statements: [],
                    template: '%1',
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                ['AA1', '1'],
                                ['AA2', '2'],
                                ['AA3', '3'],
                                ['AA4', '4'],
                            ],
                            value: '1',
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                    ],
                    events: {},
                    def: {
                        params: [ null ],
                    },
                    paramsKeyMap: {
                        PARAM0: 0,
                    },
                    func: function(sprite, script) {
                        return script.getStringField('PARAM0');
                    },
                    syntax: {
                        js: [],
                        py: [
                            {
                                syntax: '%1',
                                blockType: 'param',
                                textParams: [
                                    {
                                        type: 'Dropdown',
                                        options: [
                                            ['AA1', '1'],
                                            ['AA2', '2'],
                                            ['AA3', '3'],
                                            ['AA4', '4'],
                                        ],
                                        value: '1',
                                        fontSize: 11,
                                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                        converter: Entry.block.converters.returnStringValue,
                                    },
                                ],
                                keyOption: 'connectlite_dropdown_analog_key',
                            },
                        ],
                    },
                },
                connectlite_dropdown_setting_sensor_key: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic_string_field',
                    statements: [],
                    template: '%1',
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.template.connectlite_item_switch, '1'],
                                [Lang.template.connectlite_item_infrared, '2'],
                                [Lang.template.connectlite_item_magnetic, '3'],
                                [Lang.template.connectlite_item_rotation, '4'],
                                [Lang.template.connectlite_item_color, '5'],
                                [Lang.template.connectlite_item_acceleration, '6'],
                                [Lang.template.connectlite_item_ultrasonic, '7'],
                                [Lang.template.connectlite_item_heart_rate, '8'],
                                [Lang.template.connectlite_item_illuminance, '9'],
                                [Lang.template.connectlite_item_sound, '10'],
                                [Lang.template.connectlite_item_tilt, '11'],
                                [Lang.template.connectlite_item_pressure, '12'],
                                [Lang.template.connectlite_item_multi_touch, '13'],
                                [Lang.template.connectlite_item_compass, '14'],
                                [Lang.template.connectlite_item_tri_acceleration, '15'],
                                [Lang.template.connectlite_item_multi_switch, '16'],
                                [Lang.template.connectlite_item_extension_input, '17'],
                            ],
                            value: '1',
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                    ],
                    events: {},
                    def: {
                        params: [ null ],
                    },
                    paramsKeyMap: {
                        PARAM0: 0,
                    },
                    func: function(sprite, script) {
                        return script.getStringField('PARAM0');
                    },
                    syntax: {
                        js: [],
                        py: [
                            {
                                syntax: '%1',
                                blockType: 'param',
                                textParams: [
                                    {
                                        type: 'Dropdown',
                                        options: [
                                            [Lang.template.connectlite_item_switch, '1'],
                                            [Lang.template.connectlite_item_infrared, '2'],
                                            [Lang.template.connectlite_item_magnetic, '3'],
                                            [Lang.template.connectlite_item_rotation, '4'],
                                            [Lang.template.connectlite_item_color, '5'],
                                            [Lang.template.connectlite_item_acceleration, '6'],
                                            [Lang.template.connectlite_item_ultrasonic, '7'],
                                            [Lang.template.connectlite_item_heart_rate, '8'],
                                            [Lang.template.connectlite_item_illuminance, '9'],
                                            [Lang.template.connectlite_item_sound, '10'],
                                            [Lang.template.connectlite_item_tilt, '11'],
                                            [Lang.template.connectlite_item_pressure, '12'],
                                            [Lang.template.connectlite_item_multi_touch, '13'],
                                            [Lang.template.connectlite_item_compass, '14'],
                                            [Lang.template.connectlite_item_tri_acceleration, '15'],
                                            [Lang.template.connectlite_item_multi_switch, '16'],
                                            [Lang.template.connectlite_item_extension_input, '17'],
                                        ],
                                        value: '1',
                                        fontSize: 11,
                                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                        converter: Entry.block.converters.returnStringValue,
                                    },
                                ],
                                keyOption: 'connectlite_dropdown_setting_sensor_key',
                            },
                        ],
                    },
                },
                connectlite_dropdown_inNcom_sensor_key: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic_string_field',
                    statements: [],
                    template: '%1',
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.template.connectlite_item_infinite_rotation, '1'],
                                [Lang.template.connectlite_item_compass, '2'],
                            ],
                            value: '1',
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                    ],
                    events: {},
                    def: {
                        params: [ null ],
                    },
                    paramsKeyMap: {
                        PARAM0: 0,
                    },
                    func: function(sprite, script) {
                        return script.getStringField('PARAM0');
                    },
                    syntax: {
                        js: [],
                        py: [
                            {
                                syntax: '%1',
                                blockType: 'param',
                                textParams: [
                                    {
                                        type: 'Dropdown',
                                        options: [
                                            [Lang.template.connectlite_item_infinite_rotation, '1'],
                                            [Lang.template.connectlite_item_compass, '2'],
                                        ],
                                        value: '1',
                                        fontSize: 11,
                                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                        converter: Entry.block.converters.returnStringValue,
                                    },
                                ],
                                keyOption: 'connectlite_dropdown_inNcom_sensor_key',
                            },
                        ],
                    },
                },
                connectlite_dropdown_sensor_color_key: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic_string_field',
                    statements: [],
                    template: '%1',
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.template.connectlite_item_color_red, '1'],
                                [Lang.template.connectlite_item_color_green, '2'],
                                [Lang.template.connectlite_item_color_blue, '3'],
                                [Lang.template.connectlite_item_color_yellow, '4'],
                                [Lang.template.connectlite_item_color_black, '5'],
                                [Lang.template.connectlite_item_color_white, '6'],
                            ],
                            value: '1',
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                    ],
                    events: {},
                    def: {
                        params: [ null ],
                    },
                    paramsKeyMap: {
                        PARAM0: 0,
                    },
                    func: function(sprite, script) {
                        return script.getStringField('PARAM0');
                    },
                    syntax: {
                        js: [],
                        py: [
                            {
                                syntax: '%1',
                                blockType: 'param',
                                textParams: [
                                    {
                                        type: 'Dropdown',
                                        options: [
                                            [Lang.template.connectlite_item_color_red, '1'],
                                            [Lang.template.connectlite_item_color_green, '2'],
                                            [Lang.template.connectlite_item_color_blue, '3'],
                                            [Lang.template.connectlite_item_color_yellow, '4'],
                                            [Lang.template.connectlite_item_color_black, '5'],
                                            [Lang.template.connectlite_item_color_white, '6'],
                                        ],
                                        value: '1',
                                        fontSize: 11,
                                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                        converter: Entry.block.converters.returnStringValue,
                                    },
                                ],
                                keyOption: 'connectlite_dropdown_sensor_color_key',
                            },
                        ],
                    },
                },
                connectlite_dropdown_rgb_color_key: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic_string_field',
                    statements: [],
                    template: '%1',
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.template.connectlite_item_color_red, '1'],
                                [Lang.template.connectlite_item_color_green, '2'],
                                [Lang.template.connectlite_item_color_blue, '3'],
                                [Lang.template.connectlite_item_color_cyan, '4'],
                                [Lang.template.connectlite_item_color_magenta, '5'],
                                [Lang.template.connectlite_item_color_yellow, '6'],
                                [Lang.template.connectlite_item_color_white, '7'],
                            ],
                            value: '1',
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                    ],
                    events: {},
                    def: {
                        params: [ null ],
                    },
                    paramsKeyMap: {
                        PARAM0: 0,
                    },
                    func: function(sprite, script) {
                        return script.getStringField('PARAM0');
                    },
                    syntax: {
                        js: [],
                        py: [
                            {
                                syntax: '%1',
                                blockType: 'param',
                                textParams: [
                                    {
                                        type: 'Dropdown',
                                        options: [
                                            [Lang.template.connectlite_item_color_red, '1'],
                                            [Lang.template.connectlite_item_color_green, '2'],
                                            [Lang.template.connectlite_item_color_blue, '3'],
                                            [Lang.template.connectlite_item_color_cyan, '4'],
                                            [Lang.template.connectlite_item_color_magenta, '5'],
                                            [Lang.template.connectlite_item_color_yellow, '6'],
                                            [Lang.template.connectlite_item_color_white, '7'],
                                        ],
                                        value: '1',
                                        fontSize: 11,
                                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                        converter: Entry.block.converters.returnStringValue,
                                    },
                                ],
                                keyOption: 'connectlite_dropdown_rgb_color_key',
                            },
                        ],
                    },
                },
                connectlite_dropdown_sensor_angle_key: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic_string_field',
                    statements: [],
                    template: '%1',
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.template.connectlite_item_value, '1'],
                                [Lang.template.connectlite_item_angle, '2'],
                                [Lang.template.connectlite_item_absolute_angle, '3'],
                                [Lang.template.connectlite_item_number_of_rotations, '4'],
                            ],
                            value: '1',
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                    ],
                    events: {},
                    def: {
                        params: [ null ],
                    },
                    paramsKeyMap: {
                        PARAM0: 0,
                    },
                    func: function(sprite, script) {
                        return script.getStringField('PARAM0');
                    },
                    syntax: {
                        js: [],
                        py: [
                            {
                                syntax: '%1',
                                blockType: 'param',
                                textParams: [
                                    {
                                        type: 'Dropdown',
                                        options: [
                                            [Lang.template.connectlite_item_value, '1'],
                                            [Lang.template.connectlite_item_angle, '2'],
                                            [Lang.template.connectlite_item_absolute_angle, '3'],
                                            [Lang.template.connectlite_item_number_of_rotations, '4'],
                                        ],
                                        value: '1',
                                        fontSize: 11,
                                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                        converter: Entry.block.converters.returnStringValue,
                                    },
                                ],
                                keyOption: 'connectlite_dropdown_sensor_angle_key',
                            },
                        ],
                    },
                },
                connectlite_dropdown_multikey_key: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic_string_field',
                    statements: [],
                    template: '%1',
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.template.connectlite_item_key_1, '1'],
                                [Lang.template.connectlite_item_key_2, '2'],
                                [Lang.template.connectlite_item_key_3, '3'],
                                [Lang.template.connectlite_item_key_4, '4'],
                                [Lang.template.connectlite_item_key_5, '5'],
                                [Lang.template.connectlite_item_key_6, '6'],
                                [Lang.template.connectlite_item_key_7, '7'],
                                [Lang.template.connectlite_item_key_8, '8'],
                            ],
                            value: '1',
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                    ],
                    events: {},
                    def: {
                        params: [ null ],
                    },
                    paramsKeyMap: {
                        PARAM0: 0,
                    },
                    func: function(sprite, script) {
                        return script.getStringField('PARAM0');
                    },
                    syntax: {
                        js: [],
                        py: [
                            {
                                syntax: '%1',
                                blockType: 'param',
                                textParams: [
                                    {
                                        type: 'Dropdown',
                                        options: [
                                            [Lang.template.connectlite_item_key_1, '1'],
                                            [Lang.template.connectlite_item_key_2, '2'],
                                            [Lang.template.connectlite_item_key_3, '3'],
                                            [Lang.template.connectlite_item_key_4, '4'],
                                            [Lang.template.connectlite_item_key_5, '5'],
                                            [Lang.template.connectlite_item_key_6, '6'],
                                            [Lang.template.connectlite_item_key_7, '7'],
                                            [Lang.template.connectlite_item_key_8, '8'],
                                        ],
                                        value: '1',
                                        fontSize: 11,
                                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                        converter: Entry.block.converters.returnStringValue,
                                    },
                                ],
                                keyOption: 'connectlite_dropdown_multikey_key',
                            },
                        ],
                    },
                },
                connectlite_dropdown_extension_digital_key: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic_string_field',
                    statements: [],
                    template: '%1',
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                ['EA1', '1'],
                                ['EA2', '2'],
                                ['EA3', '3'],
                                ['EA4', '4'],
                                ['EA5', '5'],
                                ['EA6', '6'],
                                ['EA7', '7'],
                                ['EA8', '8'],
                                ['ET1', '9'],
                                ['ET2', '10'],
                                ['ET3', '11'],
                                ['ET4', '12'],
                                ['ET5', '13'],
                                ['ET6', '14'],
                                ['ET7', '15'],
                                ['ET8', '16'],
                            ],
                            value: '1',
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                    ],
                    events: {},
                    def: {
                        params: [ null ],
                    },
                    paramsKeyMap: {
                        PARAM0: 0,
                    },
                    func: function(sprite, script) {
                        return script.getStringField('PARAM0');
                    },
                    syntax: {
                        js: [],
                        py: [
                            {
                                syntax: '%1',
                                blockType: 'param',
                                textParams: [
                                    {
                                        type: 'Dropdown',
                                        options: [
                                            ['EA1', '1'],
                                            ['EA2', '2'],
                                            ['EA3', '3'],
                                            ['EA4', '4'],
                                            ['EA5', '5'],
                                            ['EA6', '6'],
                                            ['EA7', '7'],
                                            ['EA8', '8'],
                                        ],
                                        value: '1',
                                        fontSize: 11,
                                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                        converter: Entry.block.converters.returnStringValue,
                                    },
                                ],
                                keyOption: 'connectlite_dropdown_extension_digital_key',
                            },
                        ],
                    },
                },                
                connectlite_dropdown_extension_analog_key: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic_string_field',
                    statements: [],
                    template: '%1',
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                ['EAA1', '1'],
                                ['EAA2', '2'],
                            ],
                            value: '1',
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                    ],
                    events: {},
                    def: {
                        params: [ null ],
                    },
                    paramsKeyMap: {
                        PARAM0: 0,
                    },
                    func: function(sprite, script) {
                        return script.getStringField('PARAM0');
                    },
                    syntax: {
                        js: [],
                        py: [
                            {
                                syntax: '%1',
                                blockType: 'param',
                                textParams: [
                                    {
                                        type: 'Dropdown',
                                        options: [
                                            ['EAA1', '1'],
                                            ['EAA2', '2'],
                                        ],
                                        value: '1',
                                        fontSize: 11,
                                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                        converter: Entry.block.converters.returnStringValue,
                                    },
                                ],
                                keyOption: 'connectlite_dropdown_extension_analog_key',
                            },
                        ],
                    },
                },
                connectlite_dropdown_dc_1_all_key: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic_string_field',
                    statements: [],
                    template: '%1',
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                ['1', '1'],
                                ['2', '2'],
                                ['3', '3'],
                                ['4', '4'],
                                ['1,2', '5'],
                                ['3,4', '6'],
                                [Lang.template.connectlite_item_all, '7'],
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
                            null
                        ],
                    },
                    paramsKeyMap: {
                        PARAM0: 0,
                    },
                    func: function(sprite, script) {
                        return script.getStringField('PARAM0');
                    },
                    syntax: {
                        js: [],
                        py: [
                            {
                                syntax: '%1',
                                blockType: 'param',
                                textParams: [
                                    {
                                        type: 'Dropdown',
                                        options: [
                                            ['1', '1'],
                                            ['2', '2'],
                                            ['3', '3'],
                                            ['4', '4'],
                                            ['1,2', '5'],
                                            ['3,4', '6'],
                                            [Lang.template.connectlite_item_all, '7'],
                                        ],
                                        value: '1',
                                        fontSize: 11,
                                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                        converter: Entry.block.converters.returnStringValue,
                                    },
                                ],
                                keyOption: 'connectlite_dropdown_dc_1_all_key',
                            },
                        ],
                    },
                },
                connectlite_dropdown_velocity_key: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic_string_field',
                    statements: [],
                    template: '%1',
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                ['20', '20'],
                                ['15', '15'],
                                ['10', '10'],
                                ['5', '5'],
                                ['0', '0'],
                                ['-5', '-5'],
                                ['-10', '-10'],
                                ['-15', '-15'],
                                ['-20', '-20'],
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
                            null
                        ],
                    },
                    paramsKeyMap: {
                        PARAM0: 0,
                    },
                    func: function(sprite, script) {
                        return script.getStringField('PARAM0');
                    },
                    syntax: {
                        js: [],
                        py: [
                            {
                                syntax: '%1',
                                blockType: 'param',
                                textParams: [
                                    {
                                        type: 'Dropdown',
                                        options: [
                                            ['20', '20'],
                                            ['15', '15'],
                                            ['10', '10'],
                                            ['5', '5'],
                                            ['0', '0'],
                                            ['-5', '-5'],
                                            ['-10', '-10'],
                                            ['-15', '-15'],
                                            ['-20', '-20'],
                                        ],
                                        value: '0',
                                        fontSize: 11,
                                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                        converter: Entry.block.converters.returnStringValue,
                                    },
                                ],
                                keyOption: 'connectlite_dropdown_velocity_key',
                            },
                        ],
                    },
                },
                connectlite_dropdown_servo_position_key: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic_string_field',
                    statements: [],
                    template: '%1',
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                ['1', '1'],
                                ['20', '20'],
                                ['40', '40'],
                                ['60', '60'],
                                ['80', '80'],
                                ['100', '100'],
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
                            null
                        ],
                    },
                    paramsKeyMap: {
                        PARAM0: 0,
                    },
                    func: function(sprite, script) {
                        return script.getStringField('PARAM0');
                    },                    
                    syntax: {
                        js: [],
                        py: [
                            {
                                syntax: '%1',
                                blockType: 'param',
                                textParams: [
                                    {
                                        type: 'Dropdown',
                                        options: [
                                            ['1', '1'],
                                            ['20', '20'],
                                            ['40', '40'],
                                            ['60', '60'],
                                            ['80', '80'],
                                            ['100', '100'],
                                        ],
                                        value: '1',
                                        fontSize: 11,
                                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                        converter: Entry.block.converters.returnStringValue,
                                    },
                                ],
                                keyOption: 'connectlite_dropdown_servo_position_key',
                            },
                        ],
                    },
                },
                connectlite_dropdown_port_1_4_key: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic_string_field',
                    statements: [],
                    template: '%1',
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                ['1', '1'],
                                ['2', '2'],
                                ['3', '3'],
                                ['4', '4'],
                            ],
                            value: '1',
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                    ],
                    events: {},
                    def: {
                        params: [ null ],
                    },
                    paramsKeyMap: {
                        PARAM0: 0,
                    },
                    func: function(sprite, script) {
                        return script.getStringField('PARAM0');
                    },
                    syntax: {
                        js: [],
                        py: [
                            {
                                syntax: '%1',
                                blockType: 'param',
                                textParams: [
                                    {
                                        type: 'Dropdown',
                                        options: [
                                            ['1', '1'],
                                            ['2', '2'],
                                            ['3', '3'],
                                            ['4', '4'],
                                        ],
                                        value: '1',
                                        fontSize: 11,
                                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                        converter: Entry.block.converters.returnStringValue,
                                    },
                                ],
                                keyOption: 'connectlite_dropdown_port_1_4_key',
                            },
                        ],
                    },
                },           
                connectlite_dropdown_on_off_key: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic_string_field',
                    statements: [],
                    template: '%1',
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.template.connectlite_item_on, '1'],
                                [Lang.template.connectlite_item_off, '0'],
                            ],
                            value: '1',
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                    ],
                    events: {},
                    def: {
                        params: [ null ],
                    },
                    paramsKeyMap: {
                        PARAM0: 0,
                    },
                    events: {},
                    func: function(sprite, script) {
                        return script.getStringField('PARAM0');
                    },
                    syntax: {
                        js: [],
                        py: [
                            {
                                syntax: '%1',
                                blockType: 'param',
                                textParams: [
                                    {
                                        type: 'Dropdown',
                                        options: [
                                            [Lang.template.connectlite_item_on, '1'],
                                            [Lang.template.connectlite_item_off, '0'],
                                        ],
                                        value: '1',
                                        fontSize: 11,
                                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                        converter: Entry.block.converters.returnStringValue,
                                    },
                                ],
                                keyOption: 'connectlite_dropdown_on_off_key',
                            },
                        ],
                    },
                },
                connectlite_dropdown_note_key: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic_string_field',
                    statements: [],
                    template: '%1',
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.template.connectlite_item_note_whole, '1'],
                                [Lang.template.connectlite_item_note_half, '2'],
                                [Lang.template.connectlite_item_note_quarter, '4'],
                                [Lang.template.connectlite_item_note_eighth, '8'],
                                [Lang.template.connectlite_item_note_sixteenth, '16'],
                                [Lang.template.connectlite_item_note_thirty_second, '32'],
                            ],
                            value: '4',
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                    ],
                    events: {},
                    def: {
                        params: [ null ],
                    },
                    paramsKeyMap: {
                        PARAM0: 0,
                    },
                    func: function(sprite, script) {
                        return script.getStringField('PARAM0');
                    },
                    syntax: {
                        js: [],
                        py: [
                            {
                                syntax: '%1',
                                blockType: 'param',
                                textParams: [
                                    {
                                        type: 'Dropdown',
                                        options: [
                                            [Lang.template.connectlite_item_note_whole, '1'],
                                            [Lang.template.connectlite_item_note_half, '2'],
                                            [Lang.template.connectlite_item_note_quarter, '4'],
                                            [Lang.template.connectlite_item_note_eighth, '8'],
                                            [Lang.template.connectlite_item_note_sixteenth, '16'],
                                            [Lang.template.connectlite_item_note_thirty_second, '32'],
                                        ],
                                        value: '4',
                                        fontSize: 11,
                                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                        converter: Entry.block.converters.returnStringValue,
                                    },
                                ],
                                keyOption: 'connectlite_dropdown_note_key',
                            },
                        ],
                    },
                },
                connectlite_dropdown_time_1_key: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic_string_field',
                    statements: [],
                    template: '%1',
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                ['0.1', '0.1'],
                                ['0.3', '0.3'],
                                ['0.5', '0.5'],
                                ['0.7', '0.7'],
                                ['1', '1'],
                                ['2', '2'],
                            ],
                            value: '0.5',
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
                    },
                    paramsKeyMap: {
                        PARAM0: 0,
                    },
                    func: function(sprite, script) {
                        return script.getStringField('PARAM0');
                    },
                    syntax: {
                        js: [],
                        py: [
                            {
                                syntax: '%1',
                                blockType: 'param',
                                textParams: [
                                    {
                                        type: 'Dropdown',
                                        options: [
                                            ['0.1', '0.1'],
                                            ['0.3', '0.3'],
                                            ['0.5', '0.5'],
                                            ['0.7', '0.7'],
                                            ['1', '1'],
                                            ['2', '2'],
                                        ],
                                        value: '0.5',
                                        fontSize: 11,
                                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                        converter: Entry.block.converters.returnStringValue,
                                    },
                                ],
                                keyOption: 'connectlite_dropdown_time_1_key',
                            },
                        ],
                    },
                },
                connectlite_dropdown_time_2_key: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic_string_field',
                    statements: [],
                    template: '%1',
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                ['0.1', '0.1'],
                                ['0.3', '0.3'],
                                ['0.5', '0.5'],
                                ['0.7', '0.7'],
                                ['1', '1'],
                                ['2', '2'],
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
                            null
                        ],
                    },
                    paramsKeyMap: {
                        PARAM0: 0,
                    },
                    func: function(sprite, script) {
                        return script.getStringField('PARAM0');
                    },
                    syntax: {
                        js: [],
                        py: [
                            {
                                syntax: '%1',
                                blockType: 'param',
                                textParams: [
                                    {
                                        type: 'Dropdown',
                                        options: [
                                            ['0.1', '0.1'],
                                            ['0.3', '0.3'],
                                            ['0.5', '0.5'],
                                            ['0.7', '0.7'],
                                            ['1', '1'],
                                            ['2', '2'],
                                        ],
                                        value: '1',
                                        fontSize: 11,
                                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                        converter: Entry.block.converters.returnStringValue,
                                    },
                                ],
                                keyOption: 'connectlite_dropdown_time_2_key',
                            },
                        ],
                    },
                },
                connectlite_dropdown_time_3: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic_string_field',
                    statements: [],
                    template: '%1',
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                ['0.05', '0.05'],
                                ['0.1', '0.1'],
                                ['0.2', '0.2'],
                                ['0.5', '0.5'],
                                ['1', '1'],
                            ],
                            value: '0.5',
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
                    },
                    paramsKeyMap: {
                        PARAM0: 0,
                    },
                    func: function(sprite, script) {
                        return script.getStringField('PARAM0');
                    },
                    syntax: {
                        js: [],
                        py: [
                            {
                                syntax: '%1',
                                blockType: 'param',
                                textParams: [
                                    {
                                        type: 'Dropdown',
                                        options: [
                                            ['0.05', '0.05'],
                                            ['0.1', '0.1'],
                                            ['0.2', '0.2'],
                                            ['0.5', '0.5'],
                                            ['1', '1'],
                                        ],
                                        value: '0.5',
                                        fontSize: 11,
                                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                        converter: Entry.block.converters.returnStringValue,
                                    },
                                ],
                                keyOption: 'connectlite_dropdown_time_3',
                            },
                        ],
                    },
                },
                connectlite_dropdown_pitch_key: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic_string_field',
                    statements: [],
                    template: '%1',
                    params: [
                        {
                            type: 'DropdownExtra',
                            options: [
                                [Lang.template.connectlite_item_pitch_do + ' (36)', '36'],
                                [Lang.template.connectlite_item_pitch_do_sharp + ' (37)', '37'],
                                [Lang.template.connectlite_item_pitch_re + ' (38)', '38'],
                                [Lang.template.connectlite_item_pitch_re_sharp + ' (39)', '39'],
                                [Lang.template.connectlite_item_pitch_mi + ' (40)', '40'],
                                [Lang.template.connectlite_item_pitch_fa + ' (41)', '41'],
                                [Lang.template.connectlite_item_pitch_fa_sharp + ' (42)', '42'],
                                [Lang.template.connectlite_item_pitch_sol + ' (43)', '43'],
                                [Lang.template.connectlite_item_pitch_sol_sharp + ' (44)', '44'],
                                [Lang.template.connectlite_item_pitch_ra + ' (45)', '45'],
                                [Lang.template.connectlite_item_pitch_ra_sharp + ' (46)', '46'],
                                [Lang.template.connectlite_item_pitch_si + ' (47)', '47'],
        
                                [Lang.template.connectlite_item_pitch_do + ' (48)', '48'],
                                [Lang.template.connectlite_item_pitch_do_sharp + ' (49)', '49'],
                                [Lang.template.connectlite_item_pitch_re + ' (50)', '50'],
                                [Lang.template.connectlite_item_pitch_re_sharp + ' (51)', '51'],
                                [Lang.template.connectlite_item_pitch_mi + ' (52)', '52'],
                                [Lang.template.connectlite_item_pitch_fa + ' (53)', '53'],
                                [Lang.template.connectlite_item_pitch_fa_sharp + ' (54)', '54'],
                                [Lang.template.connectlite_item_pitch_sol + ' (55)', '55'],
                                [Lang.template.connectlite_item_pitch_sol_sharp + ' (56)', '56'],
                                [Lang.template.connectlite_item_pitch_ra + ' (57)', '57'],
                                [Lang.template.connectlite_item_pitch_ra_sharp + ' (58)', '58'],
                                [Lang.template.connectlite_item_pitch_si + ' (59)', '59'],
        
                                [Lang.template.connectlite_item_pitch_do + ' (60)', '60'],
                                [Lang.template.connectlite_item_pitch_do_sharp + ' (61)', '61'],
                                [Lang.template.connectlite_item_pitch_re + ' (62)', '62'],
                                [Lang.template.connectlite_item_pitch_re_sharp + ' (63)', '63'],
                                [Lang.template.connectlite_item_pitch_mi + ' (64)', '64'],
                                [Lang.template.connectlite_item_pitch_fa + ' (65)', '65'],
                                [Lang.template.connectlite_item_pitch_fa_sharp + ' (66)', '66'],
                                [Lang.template.connectlite_item_pitch_sol + ' (67)', '67'],
                                [Lang.template.connectlite_item_pitch_sol_sharp + ' (68)', '68'],
                                [Lang.template.connectlite_item_pitch_ra + ' (69)', '69'],
                                [Lang.template.connectlite_item_pitch_ra_sharp + ' (70)', '70'],
                                [Lang.template.connectlite_item_pitch_si + ' (71)', '71'],
        
                                [Lang.template.connectlite_item_pitch_do + ' (72)', '72'],
                                [Lang.template.connectlite_item_pitch_do_sharp + ' (73)', '73'],
                                [Lang.template.connectlite_item_pitch_re + ' (74)', '74'],
                                [Lang.template.connectlite_item_pitch_re_sharp + ' (75)', '75'],
                                [Lang.template.connectlite_item_pitch_mi + ' (76)', '76'],
                                [Lang.template.connectlite_item_pitch_fa + ' (77)', '77'],
                                [Lang.template.connectlite_item_pitch_fa_sharp + ' (78)', '78'],
                                [Lang.template.connectlite_item_pitch_sol + ' (79)', '79'],
                                [Lang.template.connectlite_item_pitch_sol_sharp + ' (80)', '80'],
                                [Lang.template.connectlite_item_pitch_ra + ' (81)', '81'],
                                [Lang.template.connectlite_item_pitch_ra_sharp + ' (82)', '82'],
                                [Lang.template.connectlite_item_pitch_si + ' (83)', '83'],
                            ],
                            value: '60',
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
                    },
                    paramsKeyMap: {
                        PARAM0: 0,
                    },
                    func: function(sprite, script) {
                        const value = script.getStringField('PARAM0');
                        return value;
                    },
                    syntax: {
                        js: [],
                        py: [
                            {
                                syntax: '%1',
                                blockType: 'param',
                                textParams: [
                                    {
                                        type: 'Dropdown',
                                        options: [
                                            [Lang.template.connectlite_item_pitch_do + ' (36)', '36'],
                                            [Lang.template.connectlite_item_pitch_do_sharp + ' (37)', '37'],
                                            [Lang.template.connectlite_item_pitch_re + ' (38)', '38'],
                                            [Lang.template.connectlite_item_pitch_re_sharp + ' (39)', '39'],
                                            [Lang.template.connectlite_item_pitch_mi + ' (40)', '40'],
                                            [Lang.template.connectlite_item_pitch_fa + ' (41)', '41'],
                                            [Lang.template.connectlite_item_pitch_fa_sharp + ' (42)', '42'],
                                            [Lang.template.connectlite_item_pitch_sol + ' (43)', '43'],
                                            [Lang.template.connectlite_item_pitch_sol_sharp + ' (44)', '44'],
                                            [Lang.template.connectlite_item_pitch_ra + ' (45)', '45'],
                                            [Lang.template.connectlite_item_pitch_ra_sharp + ' (46)', '46'],
                                            [Lang.template.connectlite_item_pitch_si + ' (47)', '47'],
                    
                                            [Lang.template.connectlite_item_pitch_do + ' (48)', '48'],
                                            [Lang.template.connectlite_item_pitch_do_sharp + ' (49)', '49'],
                                            [Lang.template.connectlite_item_pitch_re + ' (50)', '50'],
                                            [Lang.template.connectlite_item_pitch_re_sharp + ' (51)', '51'],
                                            [Lang.template.connectlite_item_pitch_mi + ' (52)', '52'],
                                            [Lang.template.connectlite_item_pitch_fa + ' (53)', '53'],
                                            [Lang.template.connectlite_item_pitch_fa_sharp + ' (54)', '54'],
                                            [Lang.template.connectlite_item_pitch_sol + ' (55)', '55'],
                                            [Lang.template.connectlite_item_pitch_sol_sharp + ' (56)', '56'],
                                            [Lang.template.connectlite_item_pitch_ra + ' (57)', '57'],
                                            [Lang.template.connectlite_item_pitch_ra_sharp + ' (58)', '58'],
                                            [Lang.template.connectlite_item_pitch_si + ' (59)', '59'],
                    
                                            [Lang.template.connectlite_item_pitch_do + ' (60)', '60'],
                                            [Lang.template.connectlite_item_pitch_do_sharp + ' (61)', '61'],
                                            [Lang.template.connectlite_item_pitch_re + ' (62)', '62'],
                                            [Lang.template.connectlite_item_pitch_re_sharp + ' (63)', '63'],
                                            [Lang.template.connectlite_item_pitch_mi + ' (64)', '64'],
                                            [Lang.template.connectlite_item_pitch_fa + ' (65)', '65'],
                                            [Lang.template.connectlite_item_pitch_fa_sharp + ' (66)', '66'],
                                            [Lang.template.connectlite_item_pitch_sol + ' (67)', '67'],
                                            [Lang.template.connectlite_item_pitch_sol_sharp + ' (68)', '68'],
                                            [Lang.template.connectlite_item_pitch_ra + ' (69)', '69'],
                                            [Lang.template.connectlite_item_pitch_ra_sharp + ' (70)', '70'],
                                            [Lang.template.connectlite_item_pitch_si + ' (71)', '71'],
                    
                                            [Lang.template.connectlite_item_pitch_do + ' (72)', '72'],
                                            [Lang.template.connectlite_item_pitch_do_sharp + ' (73)', '73'],
                                            [Lang.template.connectlite_item_pitch_re + ' (74)', '74'],
                                            [Lang.template.connectlite_item_pitch_re_sharp + ' (75)', '75'],
                                            [Lang.template.connectlite_item_pitch_mi + ' (76)', '76'],
                                            [Lang.template.connectlite_item_pitch_fa + ' (77)', '77'],
                                            [Lang.template.connectlite_item_pitch_fa_sharp + ' (78)', '78'],
                                            [Lang.template.connectlite_item_pitch_sol + ' (79)', '79'],
                                            [Lang.template.connectlite_item_pitch_sol_sharp + ' (80)', '80'],
                                            [Lang.template.connectlite_item_pitch_ra + ' (81)', '81'],
                                            [Lang.template.connectlite_item_pitch_ra_sharp + ' (82)', '82'],
                                            [Lang.template.connectlite_item_pitch_si + ' (83)', '83'],
                                        ],
                                        value: '60',
                                        fontSize: 11,
                                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                        converter: Entry.block.converters.returnStringValue,
                                    },
                                ],
                                keyOption: 'connectlite_dropdown_pitch_key',
                            },
                        ],
                    },
                },
                connectlite_dropdown_melody_key: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic_string_field',
                    statements: [],
                    template: '%1',
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.template.connectlite_item_melody_start, '1'],
                                [Lang.template.connectlite_item_melody_end, '2'],
                                [Lang.template.connectlite_item_melody_level_up, '3'],
                                [Lang.template.connectlite_item_melody_level_down, '4'],
                            ],
                            value: '1',
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                    ],
                    events: {},
                    def: {
                        params: [ null ],
                    },
                    paramsKeyMap: {
                        PARAM0: 0,
                    },
                    func: function(sprite, script) {
                        return script.getStringField('PARAM0');
                    },
                    syntax: {
                        js: [],
                        py: [
                            {
                                syntax: '%1',
                                blockType: 'param',
                                textParams: [
                                    {
                                        type: 'Dropdown',
                                        options: [
                                            [Lang.template.connectlite_item_melody_start, '1'],
                                            [Lang.template.connectlite_item_melody_end, '2'],
                                            [Lang.template.connectlite_item_melody_level_up, '3'],
                                            [Lang.template.connectlite_item_melody_level_down, '4'],
                                        ],
                                        value: '1',
                                        fontSize: 11,
                                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                        converter: Entry.block.converters.returnStringValue,
                                    },
                                ],
                                keyOption: 'connectlite_dropdown_melody_key',
                            },
                        ],
                    },
                },
                ///========================================================================================
                /// Event block
                ///========================================================================================                
                // %1 리모컨 %2 키를 눌렀을 때
                connectlite_when_press_remote_key: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    fontColor: '#fff',
                    skeleton: 'basic_event',
                    statements: [],
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
                        },
                    ],
                    events: {},
                    def: {
                        params: [
                            null,
                            {
                                type: 'connectlite_dropdown_remote_key',
                            },
                        ],
                        type: 'connectlite_when_press_remote_key',
                    },
                    paramsKeyMap: {
                        PARAM1: 1,
                    },
                    class: 'connectlite_event',
                    isNotFor: ['ProboConnectLite'],
                    event: 'connectlite_event_remote_input',
                    func(sprite, script) {
                        const key = Entry.ProboConnectLite.getRemoteKey(script.getStringValue('PARAM1'));
                        return (Entry.ProboConnectLite.InputData.Remote[key] === 1)
                            ? script.callReturn()
                            : this.die();
                    },
                    syntax: {
                        js: [],
                        py: [
                            {
                                syntax: 'ProboConnectLite.when_press_remote_key(%2)',
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
                // %1 디지털 입력 %2 이(가) 들어왔을 때
                connectlite_when_input_digital_value: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    fontColor: '#fff',
                    skeleton: 'basic_event',
                    statements: [],
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
                        },
                    ],
                    events: {},
                    def: {
                        params: [
                            null,
                            {
                                type: 'connectlite_dropdown_digital_key',
                            },
                        ],
                        type: 'connectlite_when_input_digital_value',
                    },
                    paramsKeyMap: {
                        PARAM1: 1,
                    },
                    class: 'connectlite_event',
                    isNotFor: ['ProboConnectLite'],
                    event: 'connectlite_event_digital_input',
                    func(sprite, script) {
                        const key = Entry.ProboConnectLite.getDigitalKey(script.getStringValue('PARAM1'));
                        const value = Entry.ProboConnectLite.getDigitalStateValue(key);
                        return (value)
                            ? script.callReturn()
                            : this.die();
                    },
                    syntax: {
                        js: [],
                        py: [
                            {
                                syntax: 'ProboConnectLite.when_input_digital_value(%2)',
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
                ///========================================================================================
                /// Setting Block
                ///========================================================================================               
                // 입력포트 %1 을(를) %2 센서로 설정 %3
                connectlite_set_sensor_setting: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    fontColor: '#fff',
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
                            img: 'block_icon/hardwarelite_icon.svg',
                            size: 12,
                        },
                    ],
                    events: {},
                    def: {
                        params: [
                            {
                                type: 'connectlite_dropdown_analog_key',
                            },
                            {
                                type: 'connectlite_dropdown_setting_sensor_key',
                            },
                            null,
                        ],
                        type: 'connectlite_set_sensor_setting',
                    },
                    paramsKeyMap: {
                        PARAM0: 0,
                        PARAM1: 1,
                    },
                    class: 'connectlite_setting',
                    isNotFor: ['ProboConnectLite'],
                    func: function(sprite, script) {
                        const key = Entry.ProboConnectLite.getAnalogKey(script.getStringValue('PARAM0'));
                        const value = Entry.ProboConnectLite.getSettingSensorValue(script.getStringValue('PARAM1'));
                        const sensorSet = Entry.ProboConnectLite.SensorSet;
                        sensorSet[key] = value;
                        Entry.ProboConnectLite.RemoteData.ASET2 = ((sensorSet.AA1 << 4) | sensorSet.AA2) & 0xFF;
                        Entry.ProboConnectLite.RemoteData.ASET1 = ((sensorSet.AA3 << 4) | sensorSet.AA4) & 0xFF;
                        return script.callReturn();
                    },
                    syntax: {
                        js: [],
                        py: [
                            {
                                syntax: 'ProboConnectLite.set_sensor_setting(%1, %2)',
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
                ///========================================================================================
                /// Input block
                ///========================================================================================
                // 리모컨 입력 %1
                connectlite_is_remote_key: {
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
                                type: 'connectlite_dropdown_remote_key',
                            },
                        ],
                        type: 'connectlite_is_remote_key',
                    },
                    paramsKeyMap: {
                        PARAM0: 0,
                    },
                    class: 'connectlite_input',
                    isNotFor: ['ProboConnectLite'],
                    func: function(sprite, script) {
                        const key = Entry.ProboConnectLite.getRemoteKey(script.getStringValue('PARAM0'));
                        return (Entry.ProboConnectLite.InputData.Remote[key] === 1);
                    },
                    syntax: {
                        js: [],
                        py: [
                            {
                                syntax: 'ProboConnectLite.is_remote_key(%1)',
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
                // 디지털 입력 %1
                connectlite_is_digital_value: {
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
                                type: 'connectlite_dropdown_digital_key',
                            },
                        ],
                        type: 'connectlite_is_digital_value',
                    },
                    paramsKeyMap: {
                        PARAM0: 0,
                    },
                    class: 'connectlite_input',
                    isNotFor: ['ProboConnectLite'],
                    func: function(sprite, script) {
                        const key = Entry.ProboConnectLite.getDigitalKey(script.getStringValue('PARAM0'));
                        return Entry.ProboConnectLite.getDigitalStateValue(key);;
                    },
                    syntax: {
                        js: [],
                        py: [
                            {
                                syntax: 'ProboConnectLite.is_digital_value(%1)',
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
                // 아날로그 입력 %1
                connectlite_get_analog_value: {
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
                    ],
                    events: {},
                    def: {
                        params: [
                            {
                                type: 'connectlite_dropdown_analog_key',
                            },
                        ],
                        type: 'connectlite_get_analog_value',
                    },
                    paramsKeyMap: {
                        PARAM0: 0,
                    },
                    class: 'connectlite_input',
                    isNotFor: ['ProboConnectLite'],
                    func: function(sprite, script) {
                        const key = Entry.ProboConnectLite.getAnalogKey(script.getStringValue('PARAM0'));
                        return  (Entry.ProboConnectLite.SensorSet[key] === 5)  // 5: 압력
                            ? 255 - Entry.ProboConnectLite.InputData.Analog[key]
                            : Entry.ProboConnectLite.InputData.Analog[key];
                    },
                    syntax: {
                        js: [],
                        py: [
                            {
                                syntax: 'ProboConnectLite.get_analog_value(%1)',
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
                // 3가속도 %1의 X축
                connectlite_get_tri_axis_acceler_x: {
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
                    ],
                    events: {},
                    def: {
                        params: [
                            {
                                type: 'connectlite_dropdown_analog_key',
                            },
                        ],
                        type: 'connectlite_get_tri_axis_acceler_x',
                    },
                    paramsKeyMap: {
                        PARAM0: 0,
                    },
                    class: 'connectlite_input',
                    isNotFor: ['ProboConnectLite'],
                    func: function(sprite, script) {
                        const key = Entry.ProboConnectLite.getAxisKey(script.getStringValue('PARAM0'), "X");
                        const value = Entry.ProboConnectLite.InputData.Acceler[key];
                        return (value & 0x80)
                            ? Number((value - 255) / 10).toFixed(1)
                            : Number(value / 10).toFixed(1);
                    },
                    syntax: {
                        js: [],
                        py: [
                            {
                                syntax: 'ProboConnectLite.get_tri_axis_acceler_x(%1)',
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
                // 3가속도 %1의 Y축
                connectlite_get_tri_axis_acceler_y: {
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
                    ],
                    events: {},
                    def: {
                        params: [
                            {
                                type: 'connectlite_dropdown_analog_key',
                            },
                        ],
                        type: 'connectlite_get_tri_axis_acceler_y',
                    },
                    paramsKeyMap: {
                        PARAM0: 0,
                    },
                    class: 'connectlite_input',
                    isNotFor: ['ProboConnectLite'],
                    func: function(sprite, script) {
                        const key = Entry.ProboConnectLite.getAxisKey(script.getStringValue('PARAM0'),"Y");
                        const value = Entry.ProboConnectLite.InputData.Acceler[key];
                        return (value & 0x80)
                            ? Number((value - 255) / 10).toFixed(1)
                            : Number(value / 10).toFixed(1);
                    },
                    syntax: {
                        js: [],
                        py: [
                            {
                                syntax: 'ProboConnectLite.get_tri_axis_acceler_y(%1)',
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
                // 3가속도 %1의 Z축
                connectlite_get_tri_axis_acceler_z: {
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
                    ],
                    events: {},
                    def: {
                        params: [
                            {
                                type: 'connectlite_dropdown_analog_key',
                            },
                        ],
                        type: 'connectlite_get_tri_axis_acceler_z',
                    },
                    paramsKeyMap: {
                        PARAM0: 0,
                    },
                    class: 'connectlite_input',
                    isNotFor: ['ProboConnectLite'],
                    func: function(sprite, script) {
                        const key = Entry.ProboConnectLite.getAxisKey(script.getStringValue('PARAM0'), "Z");
                        const value = Entry.ProboConnectLite.InputData.Acceler[key];
                        return (value & 0x80)
                            ? Number((value - 255) / 10).toFixed(1)
                            : Number(value / 10).toFixed(1);
                    },
                    syntax: {
                        js: [],
                        py: [
                            {
                                syntax: 'ProboConnectLite.get_tri_axis_acceler_z(%1)',
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
                
                // %1 의 %2 ~ %3 값을 %4 ~ %5 (으)로 변환
                connectlite_get_value_mapping: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    fontColor: '#fff',
                    skeleton: 'basic_string_field',
                    statements: [],
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
                                type: 'connectlite_dropdown_analog_key',
                            },
                            {
                                type: 'number',
                                params: [ 0 ],
                            },
                            {
                                type: 'number',
                                params: [ 255 ],
                            },
                            {
                                type: 'number',
                                params: [ 0 ],
                            },
                            {
                                type: 'number',
                                params: [ 100 ],
                            },
                        ],
                        type: 'connectlite_get_value_mapping',
                    },
                    paramsKeyMap: {
                        PARAM0: 0,
                        PARAM1: 1,
                        PARAM2: 2,
                        PARAM3: 3,
                        PARAM4: 4,
                    },
                    class: 'connectlite_input',
                    isNotFor: ['ProboConnectLite'],
                    func: function(sprite, script) {
                        const key = Entry.ProboConnectLite.getAnalogKey(script.getStringValue('PARAM0'));
                        const inMin = script.getNumberValue('PARAM1');
                        const inMax = script.getNumberValue('PARAM2');
                        const outMin = script.getNumberValue('PARAM3');
                        const outMax = script.getNumberValue('PARAM4');
                        const data = (Entry.ProboConnectLite.SensorSet[key] === 5) // 5: 압력
                            ? 255 - Entry.ProboConnectLite.InputData.Analog[key]
                            : Entry.ProboConnectLite.InputData.Analog[key];
                        return (data - inMin) * (outMax-outMin) / (inMax - inMin) + outMin;
                    },
                    syntax: {
                        js: [],
                        py: [
                            {
                                syntax: 'ProboConnectLite.get_value_mapping(%1, %2, %3, %4, %5)',
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
                },                
                // 컬러 센서 %1 이(가) %2 인가?
                connectlite_is_color_value: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    fontColor: '#fff',
                    skeleton: 'basic_boolean_field',
                    statements: [],
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
                                type: 'connectlite_dropdown_analog_key',
                            },
                            {
                                type: 'connectlite_dropdown_sensor_color_key',
                            },
                        ],
                        type: 'connectlite_is_color_value',
                    },
                    paramsKeyMap: {
                        PARAM0: 0,
                        PARAM1: 1,
                    },
                    class: 'connectlite_input',
                    isNotFor: ['ProboConnectLite'],
                    func: function(sprite, script) {
                        const key0 = Entry.ProboConnectLite.getAnalogKey(script.getStringValue('PARAM0'));
                        const key1 = Entry.ProboConnectLite.getColorSensorKey(script.getStringValue('PARAM1'));
                        const value = Entry.ProboConnectLite.InputData.Analog[key0];
                        const color = Entry.ProboConnectLite.Color;
                        return ((color[key1].Min <= value) && (value <= color[key1].Max));
                    },
                    syntax: {
                        js: [],
                        py: [
                            {
                                syntax: 'ProboConnectLite.is_color_value(%1, %2)',
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
                // 컬러 센서 %1 의 색상
                connectlite_get_color_value: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    fontColor: '#fff',
                    skeleton: 'basic_string_field',
                    statements: [],
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
                                type: 'connectlite_dropdown_analog_key',
                            },
                        ],
                        type: 'connectlite_get_color_value',
                    },
                    paramsKeyMap: {
                        PARAM0: 0,
                    },
                    class: 'connectlite_input',
                    isNotFor: ['ProboConnectLite'],
                    func: function(sprite, script) {
                        const key0 = Entry.ProboConnectLite.getAnalogKey(script.getStringValue('PARAM0'));
                        const value = Entry.ProboConnectLite.InputData.Analog[key0];
                        const color = Entry.ProboConnectLite.Color;
                        
                        for (let i = 1; i < 7; i++) {
                            const key1 =  Entry.ProboConnectLite.getColorSensorKey(i.toString());
                            if ((color[key1].Min <= value) && (value <= color[key1].Max)) {
                                switch (i) {
                                    case 1:
                                        return Lang.template.connectlite_item_color_red;
                                    case 2:
                                        return Lang.template.connectlite_item_color_green;
                                    case 3:
                                        return Lang.template.connectlite_item_color_blue;
                                    case 4:
                                        return Lang.template.connectlite_item_color_yellow;
                                    case 5:
                                        return Lang.template.connectlite_item_color_black;
                                    case 6:
                                        return Lang.template.connectlite_item_color_white;
                                    default:
                                        return Lang.template.connectlite_item_error;
                                }
                            }
                        }

                        return Lang.template.connectlite_item_nothing;
                    },
                    syntax: {
                        js: [],
                        py: [
                            {
                                syntax: 'ProboConnectLite.get_color_value(%1)',
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
                // %1 센서 %2 을 %3 값으로 정하기 %4
                connectlite_set_infinite_setting: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    fontColor: '#fff',
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
                            img: 'block_icon/hardwarelite_icon.svg',
                            size: 12,
                        }
                    ],
                    events: {},
                    def: {
                        params: [
                            {
                                type: 'connectlite_dropdown_inNcom_sensor_key',
                            },
                            {
                                type: 'connectlite_dropdown_analog_key',
                            },
                            {
                                type: 'number',
                                params: [ 0 ],
                            },
                            null
                        ],
                        type: 'connectlite_set_infinite_setting',
                    },
                    paramsKeyMap: {
                        PARAM1: 1,
                        PARAM2: 2,
                    },
                    class: 'connectlite_input',
                    isNotFor: ['ProboConnectLite'],
                    func: function(sprite, script) {
                        const key = Entry.ProboConnectLite.getAnalogKey(script.getStringValue('PARAM1'));
                        let count = 0;
                        let value = script.getNumberValue('PARAM2');
                        
                        if (value != 0) {
                            count = Number(value / 255).toFixed(0);
                            value = value % 255;
                        } else {
                            count = 0;
                            value = 0;
                        }
                        
                        Entry.ProboConnectLite.Infinite.Buff[key] = Entry.ProboConnectLite.InputData.Analog[key];
                        Entry.ProboConnectLite.Infinite.Start[key] = Entry.ProboConnectLite.InputData.Analog[key] - value;
                        Entry.ProboConnectLite.Infinite.Count[key] = count;

                        return script.callReturn();
                    },
                    syntax: {
                        js: [],
                        py: [
                            {
                                syntax: 'ProboConnectLite.set_infinite_setting(%1, %2, %3)',
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
                // %1 센서 %2 지름 %3 의 mm 값
                connectlite_get_infinite_mm_diameter: {
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
                            type: 'Block',
                            accept: 'string',
                        },
                        {
                            type: 'Block',
                            accept: 'string',
                        },
                    ],
                    events: {},
                    def: {
                        params: [
                            {
                                type: 'connectlite_dropdown_inNcom_sensor_key',
                            },
                            {
                                type: 'connectlite_dropdown_analog_key',
                            },
                            {
                                type: 'number',
                                params: [ 53.5 ],
                            },
                        ],
                        type: 'connectlite_get_infinite_mm_diameter',
                    },
                    paramsKeyMap: {
                        PARAM1: 1,
                        PARAM2: 2,
                    },
                    class: 'connectlite_input',
                    isNotFor: ['ProboConnectLite'],
                    func: function(sprite, script) {
                        const key = Entry.ProboConnectLite.getAnalogKey(script.getStringValue('PARAM1'));
                        const radius = script.getNumberValue('PARAM2') / 2;
                        const pi = 3.141592;
                        const infinite = Entry.ProboConnectLite.Infinite;
                        let value = Entry.ProboConnectLite.InputData.Analog[key];

                        if (value < infinite.Buff[key] - 150) {
                            infinite.Count[key]++;
                        } else if (value > infinite.Buff[key] + 150) {
                            infinite.Count[key]--;
                        }                    
                        infinite.Buff[key] = value;
                        value = (infinite.Buff[key] - infinite.Start[key]) + (infinite.Count[key] * 255);

                        return Number((2 * pi * radius) / 255 * value).toFixed(3);
                    },
                    syntax: {
                        js: [],
                        py: [
                            {
                                syntax: 'ProboConnectLite.get_infinite_mm_diameter(%1, %2, %3)',
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
                                ],
                            },
                        ],
                    },
                },
                // %1 센서 %2 의  %3
                connectlite_get_infinite_transform_input: {
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
                            type: 'Block',
                            accept: 'string',
                        },
                        {
                            type: 'Block',
                            accept: 'string',
                        },
                    ],
                    events: {},
                    def: {
                        params: [                    
                            {
                                type: 'connectlite_dropdown_inNcom_sensor_key',
                            },
                            {
                                type: 'connectlite_dropdown_analog_key',
                            },
                            {
                                type: 'connectlite_dropdown_sensor_angle_key',
                            },
                        ],
                        type: 'connectlite_get_infinite_transform_input',
                    },
                    paramsKeyMap: {
                        PARAM1: 1,
                        PARAM2: 2,
                    },
                    class: 'connectlite_input',
                    isNotFor: ['ProboConnectLite'],
                    func: function(sprite, script) {
                        const key1 = Entry.ProboConnectLite.getAnalogKey(script.getStringValue('PARAM1'));
                        const key2 = Entry.ProboConnectLite.getSensorAngleKey(script.getStringValue('PARAM2'));
                        const anlogValue = Entry.ProboConnectLite.InputData.Analog[key1];
                        const infinite = Entry.ProboConnectLite.Infinite;

                        if (anlogValue < (infinite.Buff[key1] - 150)) {
                            infinite.Count[key1]++;
                        } else if (anlogValue > (infinite.Buff[key1] + 150)) {
                            infinite.Count[key1]--;
                        }
                        infinite.Buff[key1] = anlogValue;
                        const value = (infinite.Buff[key1] - infinite.Start[key1]) + (infinite.Count[key1] * 255);

                        switch (key2) {
                            case 'IS1':
                                return value;
                            case 'IS2':
                                return (value > 0)
                                    ? Math.floor((value % 255) * 1.41732)
                                    : Math.ceil((value % 255) * 1.41732)
                            case 'IS3':
                                return Number((360 / 255) * anlogValue).toFixed(0);
                            case 'IS4':
                                return (value > 0)
                                    ? Math.floor(value / 255)
                                    : Math.ceil(value / 255);
                            default:
                                return Lang.template.connectlite_item_nothing;

                        }
                    },
                    syntax: {
                        js: [],
                        py: [
                            {
                                syntax: 'ProboConnectLite.get_infinite_transform_input(%1, %2, %3)',
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
                                ],
                            },
                        ],
                    },
                },
                // 멀티키 센서 %1의 %2
                connectlite_is_multi_sensor: {
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
                            type: 'Block',
                            accept: 'string',
                        },
                    ],
                    events: {},
                    def: {
                        params: [
                            {
                                type: 'connectlite_dropdown_analog_key',
                            },
                            {
                                type: 'connectlite_dropdown_multikey_key',
                            },
                        ],
                        type: 'connectlite_is_multi_sensor',
                    },
                    paramsKeyMap: {
                        PARAM0: 0,
                        PARAM1: 1,
                    },
                    class: 'connectlite_input',
                    isNotFor: ['ProboConnectLite'],
                    func: function(sprite, script) {
                        const key = Entry.ProboConnectLite.getAnalogKey(script.getStringValue('PARAM0'));
                        const value = Entry.ProboConnectLite.getMultiKeyValue(script.getStringValue('PARAM1'));
                        return (Entry.ProboConnectLite.InputData.Analog[key] >> value) & 0x01;
                    },
                    syntax: {
                        js: [],
                        py: [
                            {
                                syntax: 'ProboConnectLite.is_multi_sensor(%1, %2)',
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
                // 분배 스위치 %1의 %2
                connectlite_is_multi_switch: {
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
                            type: 'Block',
                            accept: 'string',
                        },
                    ],
                    events: {},
                    def: {
                        params: [
                            {
                                type: 'connectlite_dropdown_analog_key',
                            },
                            {
                                type: 'connectlite_dropdown_multikey_key',
                            },
                        ],
                        type: 'connectlite_is_multi_switch',
                    },
                    paramsKeyMap: {
                        PARAM0: 0,
                        PARAM1: 1,
                    },
                    class: 'connectlite_input',
                    isNotFor: ['ProboConnectLite'],
                    func: function(sprite, script) {
                        const key0 = Entry.ProboConnectLite.getAnalogKey(script.getStringValue('PARAM0'));
                        const value = Entry.ProboConnectLite.getMultiKeyValue(script.getStringValue('PARAM1'));
                        const analog = Entry.ProboConnectLite.InputData.Analog[key0];
                        const multySwitch = Entry.ProboConnectLite.MultiSwitch;
                        
                        for (let i = 0; i < 8; i++) {
                            const key = 'Key' + (i + 1).toString();
                            if (multySwitch[key].Min <= analog && analog <= multySwitch[key].Max) {
                                return (value === i);
                            }
                        }
                        
                        return false;
                    },
                    syntax: {
                        js: [],
                        py: [
                            {
                                syntax: 'ProboConnectLite.is_multi_switch(%1, %2)',
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
                // 확장 디지털 입력 %1 의 %2
                connectlite_is_extension_digital_input: {
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
                            type: 'Block',
                            accept: 'string',
                        },
                    ],
                    events: {},
                    def: {
                        params: [
                            {
                                type: 'connectlite_dropdown_analog_key',
                            },
                            {
                                type: 'connectlite_dropdown_extension_digital_key',
                            },
                        ],
                        type: 'connectlite_is_extension_digital_input',
                    },
                    paramsKeyMap: {
                        PARAM0: 0,
                        PARAM1: 1,
                    },
                    class: 'connectlite_input',
                    isNotFor: ['ProboConnectLite'],
                    func: function(sprite, script) {
                        const key = Entry.ProboConnectLite.getAxisKey(script.getStringValue('PARAM0'), 'X');
                        const shift = Entry.ProboConnectLite.getExtentionDigitalValue(script.getStringValue('PARAM1'));
                        const value = Entry.ProboConnectLite.InputData.Acceler[key];
                        return ((value >> shift) === 1);
                    },
                    syntax: {
                        js: [],
                        py: [
                            {
                                syntax: 'ProboConnectLite.is_extension_digital_input(%1, %2)',
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
                // 확장 아날로그 입력 %1 의 %2
                connectlite_get_extension_analog_input: {
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
                            type: 'Block',
                            accept: 'string',
                        },
                    ],
                    events: {},
                    def: {
                        params: [
                            {
                                type: 'connectlite_dropdown_analog_key',
                            },
                            {
                                type: 'connectlite_dropdown_extension_analog_key',
                            },
                        ],
                        type: 'connectlite_get_extension_analog_input',
                    },
                    paramsKeyMap: {
                        PARAM0: 0,
                        PARAM1: 1,
                    },
                    class: 'connectlite_input',
                    isNotFor: ['ProboConnectLite'],
                    func: function(sprite, script) {                        
                        const key = Entry.ProboConnectLite.getAxisKey(
                            script.getStringValue('PARAM0'),
                            Entry.ProboConnectLite.getExtentionAnalogKey(script.getStringValue('PARAM1'))
                        );
                        const value = Entry.ProboConnectLite.InputData.Acceler[key];
                        return value;
                    },
                    syntax: {
                        js: [],
                        py: [
                            {
                                syntax: 'ProboConnectLite.get_extension_analog_input(%1, %2)',
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
                // EEPROM %1 주소의 값 호출하기 %2
                connectlite_set_eeprom_call: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    fontColor: '#fff',
                    skeleton: 'basic',                    
                    statements: [],
                    params: [
                        {
                            type: 'Block',
                            accept: 'string',
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
                                params: ['0']
                            },
                            null
                        ],
                        type: 'connectlite_set_eeprom_call',
                    },
                    paramsKeyMap: {
                        ADDRESS: 0,
                    },
                    class: 'connectlite_input',
                    isNotFor: ['ProboConnectLite'],
                    func: function(sprite, script) {
                        const address = script.getNumberValue('ADDRESS', script);
                        if (!script.isStart) {
                            script.isStart = true;
                            script.timeFlag = 1;

                            const ms = 50;
                            const fps = Entry.FPS || 60;

                            Entry.ProboConnectLite.EEPROM.Count = Entry.ProboConnectLite.InputData.EEPROM.EC;
                            Entry.ProboConnectLite.RemoteData['EEPR4'] = 0x40;
                            Entry.ProboConnectLite.RemoteData['EEPR3'] = address;
                            Entry.TimeWaitManager.add(
                                script.block.id,
                                function() {
                                    script.timeFlag = 0;
                                },
                                60 / fps * ms
                            );

                            return script;
                        } else if (script.timeFlag == 1) {
                            return script;
                        } else {
                            Entry.ProboConnectLite.EEPROM.Buff =
                                (Entry.ProboConnectLite.InputData.EEPROM.EEPR2 << 8) + 
                                Entry.ProboConnectLite.InputData.EEPROM.EEPR1;
                            Entry.ProboConnectLite.RemoteData['EEPR4'] = 0;
                            Entry.ProboConnectLite.RemoteData['EEPR3'] = 0;

                            delete script.timeFlag;
                            delete script.isStart;
                            Entry.engine.isContinue = false;
                            return script.callReturn();
                        }
                    },
                    syntax: {
                        js: [],
                        py: [
                            {
                                syntax: 'ProboConnectLite.set_eeprom_call(%1)',
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
                // EEPROM 주소의 값
                connectlite_get_eeprom_address_value: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    fontColor: '#fff',
                    skeleton: 'basic_string_field',
                    statements: [],
                    params: [],
                    events: {},
                    def: {
                        type: 'connectlite_get_eeprom_address_value',
                    },
                    class: 'connectlite_input',
                    isNotFor: ['ProboConnectLite'],
                    func: function(sprite, script) {
                        const count = Entry.ProboConnectLite.EEPROM.Count;

                        return (Entry.ProboConnectLite.InputData.EEPROM.EC != count)
                            ? Entry.ProboConnectLite.EEPROM.Buff
                            : 0;
                    },
                    syntax: {
                        js: [],
                        py: [
                            {
                                syntax: 'ProboConnectLite.get_eeprom_address_value',
                                blockType: 'param',
                                textParams: [ null ],
                            },
                        ],
                    },
                },
                
                ///========================================================================================
                /// output block
                ///========================================================================================
                // DC 모터 %1 을(를) %2 속도로 회전 %3
                connectlite_set_dc_output: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    fontColor: '#fff',
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
                            img: 'block_icon/hardwarelite_icon.svg',
                            size: 12,
                        },
                    ],
                    events: {},
                    def: {
                        params: [
                            { 
                                type: 'connectlite_dropdown_dc_1_all_key',
                            },
                            {
                                type: 'connectlite_dropdown_velocity_key',
                            },
                            null,
                        ],
                        type: 'connectlite_set_dc_output',
                    },
                    paramsKeyMap: {
                        PARAM0: 0,
                        PARAM1: 1,
                    },
                    class: 'connectlite_output',
                    isNotFor: ['ProboConnectLite'],
                    func: function(sprite, script) {
                        const key = Entry.ProboConnectLite.getDckey(script.getStringValue('PARAM0')); 
                        const value = script.getNumberValue('PARAM1');

                        switch (key) {
                            case 'DC5':
                                Entry.ProboConnectLite.RemoteData['DC1'] = value;
                                Entry.ProboConnectLite.RemoteData['DC2'] = value;
                                break;
                            case 'DC6':
                                Entry.ProboConnectLite.RemoteData['DC3'] = value;
                                Entry.ProboConnectLite.RemoteData['DC4'] = value;
                                break;
                            case 'DC7':
                                Entry.ProboConnectLite.RemoteData['DC1'] = value;
                                Entry.ProboConnectLite.RemoteData['DC2'] = value;
                                Entry.ProboConnectLite.RemoteData['DC3'] = value;
                                Entry.ProboConnectLite.RemoteData['DC4'] = value;
                                break;
                            default:
                                Entry.ProboConnectLite.RemoteData[key] = value;
                                break;
                        }

                        return script.callReturn();
                    },
                    syntax: {
                        js: [],
                        py: [
                            {
                                syntax: 'ProboConnectLite.set_dc_output(%1, %2)',
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
                // 서보 모터 %1 의 위치를 %2 로 이동 %3
                connectlite_set_servo_output: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    fontColor: '#fff',
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
                            img: 'block_icon/hardwarelite_icon.svg',
                            size: 12,
                        },
                    ],
                    events: {},
                    def: {
                        params: [
                            { 
                                type: 'connectlite_dropdown_port_1_4_key',
                            },
                            {
                                type: 'connectlite_dropdown_servo_position_key',
                            },
                            null,
                        ],
                        type: 'connectlite_set_servo_output',
                    },
                    paramsKeyMap: {
                        PARAM0: 0,
                        PARAM1: 1,
                    },
                    class: 'connectlite_output',
                    isNotFor: ['ProboConnectLite'],
                    func: function(sprite, script) {
                        const key = Entry.ProboConnectLite.getServoKey(script.getStringValue('PARAM0'));
                        const value = script.getNumberValue('PARAM1');
                        Entry.ProboConnectLite.RemoteData[key] = Math.min(Math.max(value, 0), 100);
                        return script.callReturn();
                    },
                    syntax: {
                        js: [],
                        py: [
                            {
                                syntax: 'ProboConnectLite.set_servo_output(%1, %2)',
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
                // S 모터 %1 을(를) %2 속도로 회전 %3
                connectlite_set_s_dc_output: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    fontColor: '#fff',
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
                            img: 'block_icon/hardwarelite_icon.svg',
                            size: 12,
                        },
                    ],
                    events: {},
                    def: {
                        params: [
                            { 
                                type: 'connectlite_dropdown_port_1_4_key',
                            },
                            {
                                type: 'connectlite_dropdown_velocity_key',
                            },
                            null,
                        ],
                        type: 'connectlite_set_s_dc_output',
                    },
                    paramsKeyMap: {
                        PARAM0: 0,
                        PARAM1: 1,
                    },
                    class: 'connectlite_output',
                    isNotFor: ['ProboConnectLite'],
                    func: function(sprite, script) {
                        const key = Entry.ProboConnectLite.getServoKey(script.getStringValue('PARAM0'));
                        const speed = script.getNumberValue('PARAM1');
                        const value = Math.min(Math.max(speed, -20), 20) + 148;

                        switch (key) {
                            case 'Servo5':
                                Entry.ProboConnectLite.RemoteData['Servo1'] = value;
                                Entry.ProboConnectLite.RemoteData['Servo2'] = value;
                                break;
                            case 'Servo6':
                                Entry.ProboConnectLite.RemoteData['Servo3'] = value;
                                Entry.ProboConnectLite.RemoteData['Servo4'] = value;
                                break;
                            default:
                                Entry.ProboConnectLite.RemoteData[key] = value;
                                break;
                        }

                        return script.callReturn();
                    },
                    syntax: {
                        js: [],
                        py: [
                            {
                                syntax: 'ProboConnectLite.set_s_dc_output(%1, %2)',
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
                // 출력핀 %1 을(를) %2 %3
                connectlite_set_port_output: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    fontColor: '#fff',
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
                            img: 'block_icon/hardwarelite_icon.svg',
                            size: 12,
                        },
                    ],
                    events: {},
                    def: {
                        params: [
                            { 
                                type: 'connectlite_dropdown_port_1_4_key',
                            },
                            {
                                type: 'connectlite_dropdown_on_off_key',
                            },
                            null
                        ],
                        type: 'connectlite_set_port_output',
                    },
                    paramsKeyMap: {
                        PARAM0: 0,
                        PARAM1: 1,
                    },
                    class: 'connectlite_output',
                    isNotFor: ['ProboConnectLite'],
                    func: function(sprite, script) {
                        const key = Entry.ProboConnectLite.getPortKey(script.getStringValue('PARAM0'));
                        const value = Entry.ProboConnectLite.getPortToggleValue(script.getStringValue('PARAM1'));
        
                        Entry.ProboConnectLite.RemoteData[key] = value;

                        return script.callReturn();
                    },
                    syntax: {
                        js: [],
                        py: [
                            {
                                syntax: 'ProboConnectLite.set_port_output(%1, %2)',
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
                // %1 을(를) %2 음표로 연주하기 %3
                connectlite_play_melody_note_output: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    fontColor: '#fff',
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
                            img: 'block_icon/hardwarelite_icon.svg',
                            size: 12,
                        },
                    ],
                    events: {},
                    def: {
                        params: [
                            { 
                                type: 'connectlite_dropdown_pitch_key',
                            },
                            {
                                type: 'connectlite_dropdown_note_key',
                            },
                            null
                        ],
                        type: 'connectlite_play_melody_note_output',
                    },
                    paramsKeyMap: {
                        PARAM0: 0,
                        PARAM1: 1,
                    },
                    class: 'connectlite_output',
                    isNotFor: ['ProboConnectLite'],
                    func: function(sprite, script) {
                        if (!script.isStart) {
                            script.isStart = true;
                            script.timeFlag = 1;
                            const pitch = Entry.ProboConnectLite.getPitchValue(script.getNumberValue('PARAM0'));
                            const note = Entry.ProboConnectLite.getNoteKey(script.getStringValue('PARAM1'));
                            const ms = Entry.ProboConnectLite.Note[note];
                            const fps = Entry.FPS || 60;
        
                            Entry.ProboConnectLite.RemoteData['MEL2'] = pitch >> 8;
                            Entry.ProboConnectLite.RemoteData['MEL1'] = pitch;        
                            Entry.TimeWaitManager.add(
                                script.block.id,
                                function() {
                                    script.timeFlag = 0;
                                },
                                60 / fps * ms
                            );
                            return script;
                        } else if (script.timeFlag == 1) {
                            return script;
                        } else {
                            Entry.ProboConnectLite.RemoteData['MEL2'] = 0;
                            Entry.ProboConnectLite.RemoteData['MEL1'] = 0;
        
                            delete script.timeFlag;
                            delete script.isStart;
                            Entry.engine.isContinue = false;

                            return script.callReturn();
                        }
                    },
                    syntax: {
                        js: [],
                        py: [
                            {
                                syntax: 'ProboConnectLite.play_melody_note_output(%1, %2)',
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
                // %1 을(를) %2 초 동안 연주하기 %3
                connectlite_play_melody_sec_output: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    fontColor: '#fff',
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
                            img: 'block_icon/hardwarelite_icon.svg',
                            size: 12,
                        },
                    ],
                    events: {},
                    def: {
                        params: [
                            { 
                                type: 'connectlite_dropdown_pitch_key',
                            },
                            {
                                type: 'connectlite_dropdown_time_1_key',
                            },
                            null
                        ],
                        type: 'connectlite_play_melody_sec_output',
                    },
                    paramsKeyMap: {
                        PARAM0: 0,
                        PARAM1: 1,
                    },
                    class: 'connectlite_output',
                    isNotFor: ['ProboConnectLite'],
                    func: function(sprite, script) {
                        if (!script.isStart) {
                            script.isStart = true;
                            script.timeFlag = 1;
                            const pitch = Entry.ProboConnectLite.getPitchValue(script.getNumberValue('PARAM0'));
                            const sec = script.getNumberValue('PARAM1');        
                            const fps = Entry.FPS || 60;
                           
                            Entry.ProboConnectLite.RemoteData['MEL2'] = pitch >> 8;
                            Entry.ProboConnectLite.RemoteData['MEL1'] = pitch;        
                            Entry.TimeWaitManager.add(
                                script.block.id,
                                function() {
                                    script.timeFlag = 0;
                                },
                                60 / fps * sec * 1000
                            );

                            return script;
                        } else if (script.timeFlag == 1) {
                            return script;
                        } else {
                            Entry.ProboConnectLite.RemoteData['MEL2'] = 0;
                            Entry.ProboConnectLite.RemoteData['MEL1'] = 0;
        
                            delete script.timeFlag;
                            delete script.isStart;
                            Entry.engine.isContinue = false;

                            return script.callReturn();
                        }
                    },
                    syntax: {
                        js: [],
                        py: [
                            {
                                syntax: 'ProboConnectLite.play_melody_sec_output(%1, %2)',
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
                // %1 을(를) 연주하기 %2
                connectlite_play_melody_output: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    fontColor: '#fff',
                    skeleton: 'basic',
                    statements: [],
                    params: [                
                        {
                            type: 'Block',
                            accept: 'string',
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
                                type: 'connectlite_dropdown_pitch_key',
                            },
                            null
                        ],
                        type: 'connectlite_play_melody_output',
                    },
                    paramsKeyMap: {
                        PARAM0: 0,
                    },
                    class: 'connectlite_output',
                    isNotFor: ['ProboConnectLite'],
                    func: function(sprite, script) {
                        const pitch = Entry.ProboConnectLite.getPitchValue(script.getNumberValue('PARAM0'));        
                        Entry.ProboConnectLite.RemoteData['MEL2'] = pitch >> 8;
                        Entry.ProboConnectLite.RemoteData['MEL1'] = pitch;
                        return script.callReturn();
                    },
                    syntax: {
                        js: [],
                        py: [
                            {
                                syntax: 'ProboConnectLite.play_melody_output(%1)',
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
                // %1 값을(를) %2 초 동안 연주하기 %3
                connectlite_play_value_sec_output: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    fontColor: '#fff',
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
                            img: 'block_icon/hardwarelite_icon.svg',
                            size: 12,
                        },
                    ],
                    events: {},
                    def: {
                        params: [
                            {
                                type: 'number',
                                params: [ 35391 ],
                            },
                            {
                                type: 'connectlite_dropdown_time_1_key',
                            },
                            null
                        ],
                        type: 'connectlite_play_value_sec_output',
                    },
                    paramsKeyMap: {
                        PARAM0: 0,
                        PARAM1: 1,
                    },
                    class: 'connectlite_output',
                    isNotFor: ['ProboConnectLite'],
                    func: function(sprite, script) {
                        if (!script.isStart) {
                            script.isStart = true;
                            script.timeFlag = 1;
        
                            const melody = script.getNumberValue('PARAM0');
                            const sec = script.getNumberValue('PARAM1');
                            const fps = Entry.FPS || 60;
        
                            Entry.ProboConnectLite.RemoteData['MEL2'] = (melody >> 8) & 0xff;
                            Entry.ProboConnectLite.RemoteData['MEL1'] = melody & 0xff;        
                            Entry.TimeWaitManager.add(
                                script.block.id,
                                function() {
                                    script.timeFlag = 0;
                                },
                                60 / fps * sec * 1000
                            );
                            return script;
                        } else if (script.timeFlag == 1) {
                            return script;
                        } else {
                            Entry.ProboConnectLite.RemoteData['MEL2'] = 0;
                            Entry.ProboConnectLite.RemoteData['MEL1'] = 0;
        
                            delete script.timeFlag;
                            delete script.isStart;
                            Entry.engine.isContinue = false;
                            return script.callReturn();
                        }
                    },
                    syntax: {
                        js: [],
                        py: [
                            {
                                syntax: 'ProboConnectLite.play_melody_output(%1, %2)',
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
                // 1 값을(를) 연주하기 %2
                connectlite_play_value_output: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    fontColor: '#fff',
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Block',
                            accept: 'string',
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
                                params: [ 35391 ],
                            },
                            null
                        ],
                        type: 'connectlite_play_value_output',
                    },
                    paramsKeyMap: {
                        PARAM0: 0,
                    },
                    class: 'connectlite_output',
                    isNotFor: ['ProboConnectLite'],
                    func: function(sprite, script) {
                        const melody = script.getNumberValue('PARAM0');
                        Entry.ProboConnectLite.RemoteData['MEL2'] = (melody >> 8) & 0xff;
                        Entry.ProboConnectLite.RemoteData['MEL1'] = melody & 0xff;
                        return script.callReturn();
                    },
                    syntax: {
                        js: [],
                        py: [
                            {
                                syntax: 'ProboConnectLite.play_melody_output(%1)',
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
                // %1 을(를) %2초 간격으로 재생하기 %3
                connectlite_play_melody_track_output: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    fontColor: '#fff',
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
                            img: 'block_icon/hardwarelite_icon.svg',
                            size: 12,
                        },
                    ],
                    events: {},
                    def: {
                        params: [
                            { 
                                type: 'connectlite_dropdown_melody_key',
                            },
                            { 
                                type: 'connectlite_dropdown_time_2_key',
                            },
                            null
                        ],
                        type: 'connectlite_play_melody_track_output',
                    },
                    paramsKeyMap: {
                        PARAM0: 0,
                        PARAM1: 1,
                    },
                    class: 'connectlite_output',
                    isNotFor: ['ProboConnectLite'],
                    func: function(sprite, script) {
                        function getTrackStep(track,script){
                            if(!script.isStart){
                                script.isStart = true;
                                script.trackStep = 0;
                            }
                            else {
                                script.trackStep++;
                            }
                            const sec = script.getNumberValue('PARAM1');
                            const fps = Entry.FPS || 60;
                            const melody = Entry.ProboConnectLite.Track[track][script.trackStep];

                            Entry.ProboConnectLite.RemoteData['MEL2'] = (melody >> 8) & 0xff;
                            Entry.ProboConnectLite.RemoteData['MEL1'] = melody & 0xff;        
                            script.timeFlag = 1;        
                            Entry.TimeWaitManager.add(
                                script.block.id,
                                function() {
                                    script.timeFlag = 0;
                                },
                                60 / fps * sec * 1000
                            );
                        }
                        const TR = Entry.ProboConnectLite.getMelodyValue(
                            script.getStringValue('PARAM0')
                        );
                        if (!script.isStart) {
                            switch(TR) {
                                case 0 :
                                    script.maxStep = 6;
                                    break;
                                case 1 :
                                    script.maxStep = 7;
                                    break;
                                case 2 :
                                    script.maxStep = 3;
                                    break;
                                case 3 :
                                    script.maxStep = 3;
                                    break;
                            }
                            getTrackStep(TR,script);
                            return script;
                        } else if (script.timeFlag == 1) {
                            return script;
                        } else if (script.trackStep < script.maxStep){
                            getTrackStep(TR,script);
                            return script;
                        } else {
                            Entry.ProboConnectLite.RemoteData['MEL2'] = 0;
                            Entry.ProboConnectLite.RemoteData['MEL1'] = 0;
        
                            delete script.trackStep;
                            delete script.maxStep;
                            delete script.timeFlag;
                            delete script.isStart;
                            Entry.engine.isContinue = false;
                            return script.callReturn();
                        }
                    },
                    syntax: {
                        js: [],
                        py: [
                            {
                                syntax: 'ProboConnectLite.play_melody_track_output(%1, %2)',
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
                // 멜로디 중지 %1
                connectlite_play_melody_off: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    fontColor: '#fff',
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Indicator',
                            img: 'block_icon/hardwarelite_icon.svg',
                            size: 12,
                        },
                    ],
                    events: {},
                    def: {
                        params: [ null ],
                        type: 'connectlite_play_melody_off',
                    },
                    class: 'connectlite_output',
                    isNotFor: ['ProboConnectLite'],
                    func: function(sprite, script) {
                        Entry.ProboConnectLite.RemoteData['MEL2'] = 0;
                        Entry.ProboConnectLite.RemoteData['MEL1'] = 0;
                        return script.callReturn();
                    },
                    syntax: {
                        js: [],
                        py: [
                            {
                                syntax: 'ProboConnectLite.play_melody_track_output',
                                textParams: [ null ],
                            },
                        ],
                    },
                },
                // RGB LED %1 을(를) %2 으로 켜기 %3
                connectlite_set_rgbled_on_output: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    fontColor: '#fff',
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
                            img: 'block_icon/hardwarelite_icon.svg',
                            size: 12,
                        },
                    ],
                    events: {},
                    def: {
                        params: [
                            { 
                                type: 'connectlite_dropdown_port_1_4_key',
                            },
                            {
                                type: 'connectlite_dropdown_rgb_color_key',
                            },
                            null
                        ],
                        type: 'connectlite_set_rgbled_on_output',
                    },
                    paramsKeyMap: {
                        PARAM0: 0,
                        PARAM1: 1,
                    },
                    class: 'connectlite_output',
                    isNotFor: ['ProboConnectLite'],
                    func: function(sprite, script) {
                        const key = Entry.ProboConnectLite.getServoKey(script.getStringValue('PARAM0'));
                        const value = Entry.ProboConnectLite.getRgbToggleValue(script.getStringValue('PARAM1'));
                        Entry.ProboConnectLite.RemoteData[key] = value;
                        return script.callReturn();
                    },
                    syntax: {
                        js: [],
                        py: [
                            {
                                syntax: 'ProboConnectLite.set_rgbled_on_output(%1, %2)',
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
                // RGB LED %1 을(를) 끄기 %2
                connectlite_set_rgbled_off_output: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    fontColor: '#fff',
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Block',
                            accept: 'string',
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
                                type: 'connectlite_dropdown_port_1_4_key',
                            },
                            null
                        ],
                        type: 'connectlite_set_rgbled_off_output',
                    },
                    paramsKeyMap: {
                        PARAM0: 0,
                    },
                    class: 'connectlite_output',
                    isNotFor: ['ProboConnectLite'],
                    func: function(sprite, script) {
                        const key = Entry.ProboConnectLite.getServoKey(script.getStringValue('PARAM0'));
                        const value = Entry.ProboConnectLite.getRgbToggleValue('0');
                        Entry.ProboConnectLite.RemoteData[key] = value;
                    },
                    syntax: {
                        js: [],
                        py: [
                            {
                                syntax: 'ProboConnectLite.set_rgbled_off_output(%1)',
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
                // RGB LED %1 %2 으로 %3 초 간격 %4
                connectlite_set_rgbled_flashing_output: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    fontColor: '#fff',
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
                            img: 'block_icon/hardwarelite_icon.svg',
                            size: 12,
                        },
                    ],
                    events: {},
                    def: {
                        params: [
                            { 
                                type: 'connectlite_dropdown_port_1_4_key',
                            },
                            { 
                                type: 'connectlite_dropdown_rgb_color_key',
                            },
                            { 
                                type: 'connectlite_dropdown_time_3',
                            },
                            null
                        ],
                        type: 'connectlite_set_rgbled_flashing_output',
                    },
                    paramsKeyMap: {
                        PARAM0: 0,
                        PARAM1: 1,
                        PARAM2: 2,
                    },
                    class: 'connectlite_output',
                    isNotFor: ['ProboConnectLite'],
                    func: function(sprite, script) {
                        const key = Entry.ProboConnectLite.getServoKey(script.getStringValue('PARAM0'));
                        const value = Entry.ProboConnectLite.getRgbTwinkleValue(
                            script.getStringValue('PARAM1'),
                            script.getNumberValue('PARAM2')
                        );
                        Entry.ProboConnectLite.RemoteData[key] = value;
                        return script.callReturn();
                    },
                    syntax: {
                        js: [],
                        py: [
                            {
                                syntax: 'ProboConnectLite.set_rgbled_flashing_output(%1, %2, %3)',
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
                // RGB LED %1 을(를) %2 으로 디밍 %3
                connectlite_set_rgbled_dimming_output: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    fontColor: '#fff',
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
                            img: 'block_icon/hardwarelite_icon.svg',
                            size: 12,
                        },
                    ],
                    events: {},
                    def: {
                        params: [
                            { 
                                type: 'connectlite_dropdown_port_1_4_key',
                            },
                            { 
                                type: 'connectlite_dropdown_rgb_color_key',
                            },
                            null
                        ],
                        type: 'connectlite_set_rgbled_dimming_output',
                    },
                    paramsKeyMap: {
                        PARAM0: 0,
                        PARAM1: 1,
                    },
                    class: 'connectlite_output',
                    isNotFor: ['ProboConnectLite'],
                    func: function(sprite, script) {
                        const key = Entry.ProboConnectLite.getServoKey(script.getStringValue('PARAM0'));
                        const color = Entry.ProboConnectLite.getRgbDimmingValue(script.getStringValue('PARAM1'));
                        Entry.ProboConnectLite.RemoteData[key] = color;
                        return script.callReturn();
                    },
                    syntax: {
                        js: [],
                        py: [
                            {
                                syntax: 'ProboConnectLite.set_rgbled_dimming_output(%1, %2)',
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
                // FND를 %1 (으)로 설정 %2
                connectlite_set_fnd_output: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    fontColor: '#fff',
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Block',
                            accept: 'string',
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
                                params: [ 0 ],
                            },
                            null
                        ],
                        type: 'connectlite_set_fnd_output',
                    },
                    paramsKeyMap: {
                        PARAM0: 0,
                    },
                    class: 'connectlite_output',
                    isNotFor: ['ProboConnectLite'],
                    func: function(sprite, script) {
                        const value = script.getNumberValue('PARAM0');
                        Entry.ProboConnectLite.RemoteData['FND'] = value;
                        return script.callReturn();
                    },
                    syntax: {
                        js: [],
                        py: [
                            {
                                syntax: 'ProboConnectLite.set_fnd_output(%1)',
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
                // FND 끄기 %1
                connectlite_set_fnd_off: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    fontColor: '#fff',
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Indicator',
                            img: 'block_icon/hardwarelite_icon.svg',
                            size: 12,
                        },
                    ],
                    events: {},
                    def: {
                        params: [
                            null
                        ],
                        type: 'connectlite_set_fnd_off',
                    },
                    class: 'connectlite_output',
                    isNotFor: ['ProboConnectLite'],
                    func: function(sprite, script) {
                        Entry.ProboConnectLite.RemoteData['FND'] = 100;
                        return script.callReturn();
                    },
                    syntax: {
                        js: [],
                        py: [
                            {
                                syntax: 'ProboConnectLite.set_fnd_off',
                                textParams: [ null ],
                            },
                        ],
                    },
                },
                // EEPROM %1 주소에 %2 값 설정하기 %3
                connectlite_set_eeprom_write: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    fontColor: '#fff',
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
                            img: 'block_icon/hardwarelite_icon.svg',
                            size: 12,
                        },
                    ],
                    events: {},
                    def: {
                        params: [
                            { 
                                type: 'number',
                                params: [ 0 ]
                            },
                            {
                                type: 'number',
                                params: [ 0 ]
                            },
                            null,
                        ],
                        type: 'connectlite_set_eeprom_write',
                    },
                    paramsKeyMap: {
                        PARAM0: 0,
                        PARAM1: 1,
                    },
                    class: 'connectlite_output',
                    isNotFor: ['ProboConnectLite'],
                    func: function(sprite, script) {
                        const address = script.getNumberValue('PARAM0');
                        const value = script.getNumberValue('PARAM1');

                        if (!script.isStart) {        
                            script.isStart = true;
                            script.timeFlag = 1;

                            const ms = 50;
                            const fps = Entry.FPS || 60;

                            Entry.ProboConnectLite.RemoteData['EEPR4'] = 0x80;
                            Entry.ProboConnectLite.RemoteData['EEPR3'] = address;
                            Entry.ProboConnectLite.RemoteData['EEPR2'] = (value >> 8) & 0xff;
                            Entry.ProboConnectLite.RemoteData['EEPR1'] = value & 0xff;
                            Entry.TimeWaitManager.add(
                                script.block.id,
                                function() {
                                    script.timeFlag = 0;
                                },
                                60 / fps * ms
                            );
                            return script;
                        } else if (script.timeFlag == 1) {
                            return script;
                        } else {
                            Entry.ProboConnectLite.RemoteData['EEPR4'] = 0x40;
                            Entry.ProboConnectLite.RemoteData['EEPR3'] = address;
                            Entry.ProboConnectLite.RemoteData['EEPR2'] = 0;
                            Entry.ProboConnectLite.RemoteData['EEPR1'] = 0;
        
                            setTimeout(function() {
                                Entry.ProboConnectLite.RemoteData['EEPR4'] = 0;
                                Entry.ProboConnectLite.RemoteData['EEPR3'] = 0;
                                Entry.ProboConnectLite.RemoteData['EEPR2'] = 0;
                                Entry.ProboConnectLite.RemoteData['EEPR1'] = 0;
                            }, 100);
                            
                            delete script.timeFlag;
                            delete script.isStart;
                            Entry.engine.isContinue = false;
                            return script.callReturn();
                        }
                    },
                    syntax: {
                        js: [],
                        py: [
                            {
                                syntax: 'ProboConnectLite.set_eeprom_write(%1, %2)',
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
            }; // getBlock() return;
        }
    })();
})();

module.exports = Entry.ProboConnectLite;