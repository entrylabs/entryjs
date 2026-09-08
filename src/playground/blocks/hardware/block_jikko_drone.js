'use strict';

/**
 * 직코 드론 EntryJS 하드웨어 블록 모듈
 *
 * 명령 전송 흐름:
 * 엔트리 블록 -> sendProtocol() -> Entry.hw.sendQueue.SET
 * -> Entry Hardware -> 드론 펌웨어
 *
 * 데이터 수신 흐름:
 * 드론 펌웨어 -> Entry Hardware -> Entry.hw.portData
 * -> afterReceive() 및 값 읽기 블록
 */
Entry.JIKKO_DRONE = new (class JIKKO_DRONE {
    // 하드웨어 정보, 통신 규격과 드론 제어 상태를 준비한다.
    constructor() {
        this.id = '47.7';
        this.name = 'JIKKO_DRONE';
        this.url = 'https://www.makeitall.co.kr/';
        this.imageName = 'jikko.png';
        this.title = { ko: '직코 드론', en: 'JIKKO DRONE' };

        // 통신 프로토콜 V2.0.1 정의
        this.protocol = {
            version: '2.0.1',
            HEADER_1: 0xff,
            HEADER_2: 0xfd,
            instruction: {
                WRITE_MASK: 0x00,
                READ_MASK: 0x40,
                I2C_MASK: 0x80,
                ETC: 0xff,
            },
            device: {
                DIGITAL: 0x01,
                ANALOG: 0x02,
                SUBSCRIBE: 0x03,
                NEOPIXEL: 0x04,
                DF_PLAYER: 0x05,
                BUZZER: 0x06,
                SERVO: 0x07,
                DOT_MATRIX: 0x08,
                DHT11: 0x09,
                ULTRASONIC: 0x0a,
                DUST: 0x0b,
                LINE_TRACER: 0x0c,
                WIFI: 0x0d,
                DRONE: 0x20,
            },
            drone: {
                PING: 0x01,
                TARGET_SLAVE: 0x02,
                COMMAND_LINK_TEST: 0x01,
                CONTROL: 0x10,
                ARM: 0x11,
                DISARM: 0x12,
                EMERGENCY_STOP: 0x13,
                STATUS: 0x14,
            },
            droneCommand: {
                CALIBRATE: 0x01,
                ARM: 0x03,
                DISARM: 0x05,
                MOVE_TIME: 0x10,
                MOVE_DISTANCE: 0x20,
                TAKEOFF: 0x30,
                LANDING: 0x35,
            },
            droneDirection: {
                FRONT: 0x10,
                BACK: 0x12,
                LEFT: 0x14,
                RIGHT: 0x16,
                COUNTER_CLOCKWISE: 0x18,
                CLOCKWISE: 0x19,
                UP: 0x1a,
                DOWN: 0x1c,
            },
            action: {
                INIT: 0x01,
                CLEAR: 0x02,
                WRITE: 0x03,
                READ: 0x04,
                OUTPUT: 0x05,
                INPUT: 0x06,
                BRIGHTNESS: 0x07,
                VOLUME: 0x08,
                TEMPERATURE: 0x09,
                HUMIDITY: 0x0a,
                PRESSURE: 0x0b,
                ALL: 0xff,
            },
            response: {
                OK: 0xa0,
                CRC_ERROR: 0xf0,
                UNSUPPORTED_COMMAND: 0xf1,
                INVALID_PARAMETER: 0xf2,
            },
        };

        // 보드별 고정 배선 정보를 통신 프로토콜과 분리해 관리한다.
        this.pins = {
            LED: 2,
            BUZZER: 27,
            NEOPIXEL: 23,
            DOT_MATRIX: { DIN: 23, CS: 5, CLK: 18 },
        };
        this.droneHwSequence = 0;
        this.blockMenuBlocks = [
            'jikko_drone_flight_title',
            'jikko_drone_calibrate',
            'jikko_drone_flight_arm',
            'jikko_drone_flight_disarm',
            'jikko_drone_takeoff',
            'jikko_drone_landing',
            'jikko_drone_move_front_time',
            'jikko_drone_move_back_time',
            'jikko_drone_move_left_time',
            'jikko_drone_move_right_time',
            'jikko_drone_move_ccw_time',
            'jikko_drone_move_cw_time',
            'jikko_drone_move_up_time',
            'jikko_drone_move_down_time',
            'jikko_drone_move_front_distance',
            'jikko_drone_move_back_distance',
            'jikko_drone_move_left_distance',
            'jikko_drone_move_right_distance',
            'jikko_drone_rotate_ccw_angle',
            'jikko_drone_rotate_cw_angle',
            'jikko_drone_move_up_distance',
            'jikko_drone_move_down_distance',
        ];
    }

    // FF FD 패킷을 만들고 CRC-16/MODBUS를 계산하는 공통 처리
    clampByte(value) {
        return Math.max(0, Math.min(255, Math.round(Number(value) || 0)));
    }

    /**
     * CRC-16/MODBUS 체크섬을 계산한다.
     * 명령 바이트부터 마지막 매개변수까지를 계산 범위로 사용한다.
     */
    calculateCrc(bytes) {
        let crc = 0xffff;
        bytes.forEach((value) => {
            crc ^= this.clampByte(value);
            for (let bit = 0; bit < 8; bit++) {
                crc = crc & 1 ? (crc >>> 1) ^ 0xa001 : crc >>> 1;
            }
        });
        return crc & 0xffff;
    }

    /**
     * 패킷 구성: FF FD | 매개변수 길이 | 명령 | 매개변수... | CRC 하위 | CRC 상위
     */
    buildPacket(instruction, parameters = []) {
        const normalizedInstruction = this.clampByte(instruction);
        const normalizedParameters = parameters.map((value) => this.clampByte(value));
        const crc = this.calculateCrc([normalizedInstruction].concat(normalizedParameters));

        return [
            this.protocol.HEADER_1,
            this.protocol.HEADER_2,
            normalizedParameters.length,
            normalizedInstruction,
        ].concat(normalizedParameters, [crc & 0xff, (crc >>> 8) & 0xff]);
    }

    /**
     * 애니멀 키링과 동일한 EntryJS -> Entry Hardware SET 메시지 형식을 사용한다.
     */
    // EntryJS 블록 명령을 Entry Hardware 전송 큐에 기록한다.
    sendProtocol(instruction, parameters = [], options = {}) {
        const normalizedInstruction = this.clampByte(instruction);
        const normalizedParameters = parameters.map((value) => this.clampByte(value));
        const packet = this.buildPacket(normalizedInstruction, normalizedParameters);

        Entry.hw.sendQueue = Entry.hw.sendQueue || {};
        Entry.hw.sendQueue.SET = {
            protocol: this.protocol.version,
            instruction: normalizedInstruction,
            parameters: normalizedParameters,
            packet,
            time: options.time || Date.now(),
        };
        Entry.hw.update();
        return packet;
    }

    sendEntryHwDroneCommand(command, value1 = 0, value2 = 0, value3 = 0) {
        this.droneHwSequence += 1;
        const data = {
            sequence: this.droneHwSequence,
            command: this.clampByte(command),
            value1: this.clampByte(value1),
            value2: this.clampByte(value2),
            value3: this.clampByte(value3),
        };

        Entry.hw.sendQueue = Entry.hw.sendQueue || {};
        Entry.hw.sendQueue.DRONE_COMMAND = data;
        Entry.hw.update();
        return data;
    }

    sendDroneMoveTime(direction, speed, seconds) {
        const safeSpeed = Math.max(0, Math.min(100, Math.round(Number(speed) || 0)));
        const duration = Math.max(1, Math.min(255, Math.round((Number(seconds) || 0) * 10)));
        return this.sendEntryHwDroneCommand(
            this.protocol.droneCommand.MOVE_TIME,
            direction,
            safeSpeed,
            duration
        );
    }

    sendDroneMoveDistance(direction, value) {
        return this.sendEntryHwDroneCommand(
            this.protocol.droneCommand.MOVE_DISTANCE,
            direction,
            this.clampByte(value),
            0
        );
    }

    writePin(pin, device, value) {
        return this.sendProtocol(pin, [device, value]);
    }

    // 작품 정지 시 출력 장치와 내부 상태를 안전하게 초기화한다.
    setZero() {
        this.writePin(this.pins.LED, this.protocol.device.DIGITAL, 0);
        this.sendProtocol(this.pins.NEOPIXEL, [
            this.protocol.device.NEOPIXEL,
            this.protocol.action.CLEAR,
        ]);
    }

    // 블록 화면에 표시할 한국어와 영어 문구를 정의한다.
    setLanguage() {
        return {
            ko: {
                template: {
                    jikko_drone_comm_title: '통신 테스트',
                    jikko_drone_master_slave_ping: '마스터-슬레이브 통신 확인',
                    jikko_drone_led_title: 'LED',
                    jikko_drone_led: 'LED %1 핀 %2',
                    jikko_drone_led_brightness: 'LED ( %1 핀) 밝기 %2 출력 (0~255)',
                    jikko_drone_rgb_start: 'RGB LED 시작하기',
                    jikko_drone_rgb_color: 'RGB LED %1 %2 색 출력',
                    jikko_drone_rgb_clear: 'RGB LED 모든 LED 끄기',
                    jikko_drone_input_title: '입력',
                    jikko_drone_switch_pull_down: '스위치 %1 핀 눌림 상태(풀다운)',
                    jikko_drone_switch_pull_up: '스위치 %1 핀 눌림 상태(풀업)',
                    jikko_drone_variable_resistor: '가변저항 %1 핀 값',
                    jikko_drone_gyro_acceleration: '자이로센서 %1 %2 축 값',
                    jikko_drone_gyro_angle: '자이로센서 각도 %1 축 값',
                    jikko_drone_gyro_temperature: '자이로센서 온도 값',
                    jikko_drone_optical: '옵티컬 센서 %1 축 감지값',
                    jikko_drone_ir_distance: 'IR 센서 거리(mm) 값',
                    jikko_drone_motor_title: '모터',
                    jikko_drone_dc_motor_power: 'DC 모터 ( %1 핀) 세기 %2 출력 (0~5)',
                    jikko_drone_dc_motor_switch: 'DC 모터 %1 핀 %2',
                    jikko_drone_wifi_title: '와이파이',
                    jikko_drone_wifi_start: '와이파이 모듈 시작하기',
                    jikko_drone_wifi_check: 'Master-Slave 와이파이 연결 확인',
                    jikko_drone_wifi_connected: '와이파이 연결됨?',
                    jikko_drone_wifi_rtt: '와이파이 응답 시간(ms)',
                    jikko_drone_target: '제어할 드론 번호를 %1 로 정하기',
                    jikko_drone_arm: '드론 시동 걸기',
                    jikko_drone_disarm: '드론 시동 끄기',
                    jikko_drone_emergency_stop: '드론 비상 정지',
                    jikko_drone_control: '드론 롤 %1 피치 %2 요 %3 스로틀 %4 로 제어하기',
                    jikko_drone_wifi_roll: 'Roll(롤) 값 읽기',
                    jikko_drone_wifi_pitch: 'Pitch(피치) 값 읽기',
                    jikko_drone_wifi_yaw: 'Yaw(요) 값 읽기',
                    jikko_drone_wifi_throttle: 'Throttle(쓰로틀) 값 읽기',
                    jikko_drone_wifi_arming: '시동 값 읽기',
                    jikko_drone_wifi_rgb_pin: '조종기 RGB 핀 값 읽기',
                    jikko_drone_wifi_rgb_r: '조종기 R 값 읽기',
                    jikko_drone_wifi_rgb_g: '조종기 G 값 읽기',
                    jikko_drone_wifi_rgb_b: '조종기 B 값 읽기',
                    jikko_drone_keyboard_title: '키보드',
                    jikko_drone_keyboard_start: '키보드 제어 시작하기',
                    jikko_drone_keyboard_stop: '키보드 제어 종료하기',
                    jikko_drone_keyboard_char: '키보드 문자 (하나) %1 입력하기',
                    jikko_drone_keyboard_text: '키보드 문자 (여러 개) %1 입력하기',
                    jikko_drone_keyboard_special: '키보드 특수키 %1 입력하기',
                    jikko_drone_keyboard_pressed: '%1 키보드 눌림',
                    jikko_drone_keyboard_hold: '키보드 버튼 (문자, 특수키) %1 눌림 상태 유지하기',
                    jikko_drone_keyboard_release: '키보드 눌림 상태 해제하기',
                    jikko_drone_keyboard_ctrl: '%1',
                    jikko_drone_keyboard_function: '%1',
                    jikko_drone_keyboard_arrow: '%1',
                    jikko_drone_mouse_title: '마우스',
                    jikko_drone_mouse_start: '마우스 제어 시작하기',
                    jikko_drone_mouse_stop: '마우스 제어 종료하기',
                    jikko_drone_mouse_click: '마우스 %1 클릭하기',
                    jikko_drone_mouse_move: '마우스 커서 X축 %1 Y축 %2 만큼 이동하기',
                    jikko_drone_mouse_wheel: '마우스 Wheel %1 만큼 이동하기',
                    jikko_drone_mouse_hold: '마우스 %1 눌림 상태 유지하기',
                    jikko_drone_mouse_release: '마우스 눌림 상태 해제하기',
                    jikko_drone_flight_title: '드론',
                    jikko_drone_calibrate: '센서보정(캘리브레이션)',
                    jikko_drone_flight_arm: '시동 켬',
                    jikko_drone_flight_disarm: '시동 끔',
                    jikko_drone_takeoff: '이륙',
                    jikko_drone_landing: '착륙',
                    jikko_drone_move_front_time: '앞으로 속도 %1 으로 %2 (초)동안 이동',
                    jikko_drone_move_back_time: '뒤로 속도 %1 으로 %2 (초)동안 이동',
                    jikko_drone_move_left_time: '왼쪽으로 속도 %1 으로 %2 (초)동안 이동',
                    jikko_drone_move_right_time: '오른쪽으로 속도 %1 으로 %2 (초)동안 이동',
                    jikko_drone_move_ccw_time: '반시계 방향으로 속도 %1 으로 %2 (초)동안 이동',
                    jikko_drone_move_cw_time: '시계 방향으로 속도 %1 으로 %2 (초)동안 이동',
                    jikko_drone_move_up_time: '속도 %1 으로 %2 (초)동안 상승',
                    jikko_drone_move_down_time: '속도 %1 으로 %2 (초)동안 하강',
                    jikko_drone_move_front_distance: '앞으로 %1 cm 이동',
                    jikko_drone_move_back_distance: '뒤로 %1 cm 이동',
                    jikko_drone_move_left_distance: '왼쪽으로 %1 cm 이동',
                    jikko_drone_move_right_distance: '오른쪽으로 %1 cm 이동',
                    jikko_drone_rotate_ccw_angle: '반시계 방향으로 %1 ° 회전(0~255)',
                    jikko_drone_rotate_cw_angle: '시계 방향으로 %1 ° 회전(0~255)',
                    jikko_drone_move_up_distance: '%1 cm 상승',
                    jikko_drone_move_down_distance: '%1 cm 하강',
                },
            },
            en: {
                template: {
                    jikko_drone_comm_title: 'Communication test',
                    jikko_drone_master_slave_ping: 'Test master-slave communication',
                    jikko_drone_led_title: 'LED',
                    jikko_drone_led: 'LED pin %1 %2',
                    jikko_drone_led_brightness: 'LED pin %1 brightness %2 (0-255)',
                    jikko_drone_rgb_start: 'Initialize RGB LEDs',
                    jikko_drone_rgb_color: 'Set %1 RGB LED to %2',
                    jikko_drone_rgb_clear: 'Turn off all RGB LEDs',
                    jikko_drone_input_title: 'Input',
                    jikko_drone_switch_pull_down: 'Switch pin %1 pressed (pull-down)',
                    jikko_drone_switch_pull_up: 'Switch pin %1 pressed (pull-up)',
                    jikko_drone_variable_resistor: 'Variable resistor %1 value',
                    jikko_drone_gyro_acceleration: 'Gyroscope %1 %2-axis value',
                    jikko_drone_gyro_angle: 'Gyroscope angle %1-axis value',
                    jikko_drone_gyro_temperature: 'Gyroscope temperature',
                    jikko_drone_optical: 'Optical sensor %1-axis value',
                    jikko_drone_ir_distance: 'IR distance (mm)',
                    jikko_drone_motor_title: 'Motor',
                    jikko_drone_dc_motor_power: 'DC motor pin %1 power %2 (0-5)',
                    jikko_drone_dc_motor_switch: 'DC motor pin %1 %2',
                    jikko_drone_wifi_title: 'Wi-Fi',
                    jikko_drone_wifi_start: 'Initialize Wi-Fi module',
                    jikko_drone_wifi_check: 'Check Master-Slave Wi-Fi link',
                    jikko_drone_wifi_connected: 'Wi-Fi connected?',
                    jikko_drone_wifi_rtt: 'Wi-Fi response time (ms)',
                    jikko_drone_target: 'Set target drone to %1',
                    jikko_drone_arm: 'Arm drone',
                    jikko_drone_disarm: 'Disarm drone',
                    jikko_drone_emergency_stop: 'Emergency stop drone',
                    jikko_drone_control: 'Control drone roll %1 pitch %2 yaw %3 throttle %4',
                    jikko_drone_wifi_roll: 'Read Roll',
                    jikko_drone_wifi_pitch: 'Read Pitch',
                    jikko_drone_wifi_yaw: 'Read Yaw',
                    jikko_drone_wifi_throttle: 'Read Throttle',
                    jikko_drone_wifi_arming: 'Read arming value',
                    jikko_drone_wifi_rgb_pin: 'Read controller RGB pin',
                    jikko_drone_wifi_rgb_r: 'Read controller R',
                    jikko_drone_wifi_rgb_g: 'Read controller G',
                    jikko_drone_wifi_rgb_b: 'Read controller B',
                    jikko_drone_keyboard_title: 'Keyboard',
                    jikko_drone_keyboard_start: 'Start keyboard control',
                    jikko_drone_keyboard_stop: 'Stop keyboard control',
                    jikko_drone_keyboard_char: 'Type one keyboard character %1',
                    jikko_drone_keyboard_text: 'Type keyboard text %1',
                    jikko_drone_keyboard_special: 'Press special keyboard key %1',
                    jikko_drone_keyboard_pressed: 'Keyboard key %1 pressed',
                    jikko_drone_keyboard_hold: 'Hold keyboard key %1',
                    jikko_drone_keyboard_release: 'Release all keyboard keys',
                    jikko_drone_keyboard_ctrl: '%1',
                    jikko_drone_keyboard_function: '%1',
                    jikko_drone_keyboard_arrow: '%1',
                    jikko_drone_mouse_title: 'Mouse',
                    jikko_drone_mouse_start: 'Start mouse control',
                    jikko_drone_mouse_stop: 'Stop mouse control',
                    jikko_drone_mouse_click: 'Click %1 mouse button',
                    jikko_drone_mouse_move: 'Move mouse X %1 Y %2',
                    jikko_drone_mouse_wheel: 'Move mouse wheel by %1',
                    jikko_drone_mouse_hold: 'Hold %1 mouse button',
                    jikko_drone_mouse_release: 'Release all mouse buttons',
                    jikko_drone_flight_title: 'Drone',
                    jikko_drone_calibrate: 'Calibrate sensors',
                    jikko_drone_flight_arm: 'Arm',
                    jikko_drone_flight_disarm: 'Disarm',
                    jikko_drone_takeoff: 'Take off',
                    jikko_drone_landing: 'Land',
                    jikko_drone_move_front_time: 'Move forward at speed %1 for %2 seconds',
                    jikko_drone_move_back_time: 'Move backward at speed %1 for %2 seconds',
                    jikko_drone_move_left_time: 'Move left at speed %1 for %2 seconds',
                    jikko_drone_move_right_time: 'Move right at speed %1 for %2 seconds',
                    jikko_drone_move_ccw_time:
                        'Rotate counter-clockwise at speed %1 for %2 seconds',
                    jikko_drone_move_cw_time: 'Rotate clockwise at speed %1 for %2 seconds',
                    jikko_drone_move_up_time: 'Ascend at speed %1 for %2 seconds',
                    jikko_drone_move_down_time: 'Descend at speed %1 for %2 seconds',
                    jikko_drone_move_front_distance: 'Move forward %1 cm',
                    jikko_drone_move_back_distance: 'Move backward %1 cm',
                    jikko_drone_move_left_distance: 'Move left %1 cm',
                    jikko_drone_move_right_distance: 'Move right %1 cm',
                    jikko_drone_rotate_ccw_angle: 'Rotate counter-clockwise %1 degrees (0-255)',
                    jikko_drone_rotate_cw_angle: 'Rotate clockwise %1 degrees (0-255)',
                    jikko_drone_move_up_distance: 'Ascend %1 cm',
                    jikko_drone_move_down_distance: 'Descend %1 cm',
                },
            },
        };
    }

    // 각 드론 블록의 모양, 입력값과 실행 명령을 정의한다.
    getBlocks() {
        const title = (type) => ({
            skeleton: 'basic_text',
            color: EntryStatic.colorSet.common.TRANSPARENT,
            fontColor: '#333333',
            template: Lang.template[type],
            def: { type },
            class: 'jikko_drone',
            isNotFor: ['JIKKO_DRONE'],
            fontSize: 22,
        });
        const droneTheme = { color: '#FF5656', dark: '#F03D37' };
        const hidBase = (theme, skeleton, params, def, paramsKeyMap, func) => ({
            color: theme.color,
            outerLine: theme.dark,
            fontColor: '#FFFFFF',
            skeleton,
            statements: [],
            params,
            def,
            paramsKeyMap,
            class: 'jikko_drone',
            isNotFor: ['JIKKO_DRONE'],
            func,
        });
        const hidCommand = (theme, params, def, paramsKeyMap, func) =>
            hidBase(theme, 'basic', params, def, paramsKeyMap, func);
        const textInput = (value = '') => ({
            type: 'Block',
            accept: 'string',
            value,
        });
        const droneSimpleBlock = (type, droneCommand) =>
            hidCommand(droneTheme, [], { type }, {}, (sprite, script) => {
                Entry.JIKKO_DRONE.sendEntryHwDroneCommand(droneCommand);
                return script.callReturn();
            });
        const droneTimeBlock = (type, direction) =>
            hidCommand(
                droneTheme,
                [textInput('50'), textInput('1')],
                { params: ['50', '1'], type },
                { SPEED: 0, SECONDS: 1 },
                (sprite, script) => {
                    Entry.JIKKO_DRONE.sendDroneMoveTime(
                        direction,
                        script.getNumberValue('SPEED', script),
                        script.getNumberValue('SECONDS', script)
                    );
                    return script.callReturn();
                }
            );
        const droneDistanceBlock = (type, direction, defaultValue = '10') =>
            hidCommand(
                droneTheme,
                [textInput(defaultValue)],
                { params: [defaultValue], type },
                { VALUE: 0 },
                (sprite, script) => {
                    Entry.JIKKO_DRONE.sendDroneMoveDistance(
                        direction,
                        script.getNumberValue('VALUE', script)
                    );
                    return script.callReturn();
                }
            );
        return {
            // 드론 비행 블록 구분 제목
            jikko_drone_flight_title: title('jikko_drone_flight_title'),
            // 비행 전 센서의 기준값을 보정하는 블록
            jikko_drone_calibrate: droneSimpleBlock(
                'jikko_drone_calibrate',
                Entry.JIKKO_DRONE.protocol.droneCommand.CALIBRATE
            ),
            // 드론 모터 시동을 켜는 블록
            jikko_drone_flight_arm: droneSimpleBlock(
                'jikko_drone_flight_arm',
                Entry.JIKKO_DRONE.protocol.droneCommand.ARM
            ),
            // 드론 모터 시동을 끄는 블록
            jikko_drone_flight_disarm: droneSimpleBlock(
                'jikko_drone_flight_disarm',
                Entry.JIKKO_DRONE.protocol.droneCommand.DISARM
            ),
            // 드론을 자동으로 이륙시키는 블록
            jikko_drone_takeoff: droneSimpleBlock(
                'jikko_drone_takeoff',
                Entry.JIKKO_DRONE.protocol.droneCommand.TAKEOFF
            ),
            // 드론을 자동으로 착륙시키는 블록
            jikko_drone_landing: droneSimpleBlock(
                'jikko_drone_landing',
                Entry.JIKKO_DRONE.protocol.droneCommand.LANDING
            ),
            // 지정한 속도와 시간만큼 앞으로 이동하는 블록
            jikko_drone_move_front_time: droneTimeBlock(
                'jikko_drone_move_front_time',
                Entry.JIKKO_DRONE.protocol.droneDirection.FRONT
            ),
            // 지정한 속도와 시간만큼 뒤로 이동하는 블록
            jikko_drone_move_back_time: droneTimeBlock(
                'jikko_drone_move_back_time',
                Entry.JIKKO_DRONE.protocol.droneDirection.BACK
            ),
            // 지정한 속도와 시간만큼 왼쪽으로 이동하는 블록
            jikko_drone_move_left_time: droneTimeBlock(
                'jikko_drone_move_left_time',
                Entry.JIKKO_DRONE.protocol.droneDirection.LEFT
            ),
            // 지정한 속도와 시간만큼 오른쪽으로 이동하는 블록
            jikko_drone_move_right_time: droneTimeBlock(
                'jikko_drone_move_right_time',
                Entry.JIKKO_DRONE.protocol.droneDirection.RIGHT
            ),
            // 지정한 속도와 시간만큼 반시계 방향으로 회전하는 블록
            jikko_drone_move_ccw_time: droneTimeBlock(
                'jikko_drone_move_ccw_time',
                Entry.JIKKO_DRONE.protocol.droneDirection.COUNTER_CLOCKWISE
            ),
            // 지정한 속도와 시간만큼 시계 방향으로 회전하는 블록
            jikko_drone_move_cw_time: droneTimeBlock(
                'jikko_drone_move_cw_time',
                Entry.JIKKO_DRONE.protocol.droneDirection.CLOCKWISE
            ),
            // 지정한 속도와 시간만큼 상승하는 블록
            jikko_drone_move_up_time: droneTimeBlock(
                'jikko_drone_move_up_time',
                Entry.JIKKO_DRONE.protocol.droneDirection.UP
            ),
            // 지정한 속도와 시간만큼 하강하는 블록
            jikko_drone_move_down_time: droneTimeBlock(
                'jikko_drone_move_down_time',
                Entry.JIKKO_DRONE.protocol.droneDirection.DOWN
            ),
            // 지정한 거리만큼 앞으로 이동하는 블록
            jikko_drone_move_front_distance: droneDistanceBlock(
                'jikko_drone_move_front_distance',
                Entry.JIKKO_DRONE.protocol.droneDirection.FRONT
            ),
            // 지정한 거리만큼 뒤로 이동하는 블록
            jikko_drone_move_back_distance: droneDistanceBlock(
                'jikko_drone_move_back_distance',
                Entry.JIKKO_DRONE.protocol.droneDirection.BACK
            ),
            // 지정한 거리만큼 왼쪽으로 이동하는 블록
            jikko_drone_move_left_distance: droneDistanceBlock(
                'jikko_drone_move_left_distance',
                Entry.JIKKO_DRONE.protocol.droneDirection.LEFT
            ),
            // 지정한 거리만큼 오른쪽으로 이동하는 블록
            jikko_drone_move_right_distance: droneDistanceBlock(
                'jikko_drone_move_right_distance',
                Entry.JIKKO_DRONE.protocol.droneDirection.RIGHT
            ),
            // 지정한 각도만큼 반시계 방향으로 회전하는 블록
            jikko_drone_rotate_ccw_angle: droneDistanceBlock(
                'jikko_drone_rotate_ccw_angle',
                Entry.JIKKO_DRONE.protocol.droneDirection.COUNTER_CLOCKWISE
            ),
            // 지정한 각도만큼 시계 방향으로 회전하는 블록
            jikko_drone_rotate_cw_angle: droneDistanceBlock(
                'jikko_drone_rotate_cw_angle',
                Entry.JIKKO_DRONE.protocol.droneDirection.CLOCKWISE
            ),
            // 지정한 거리만큼 상승하는 블록
            jikko_drone_move_up_distance: droneDistanceBlock(
                'jikko_drone_move_up_distance',
                Entry.JIKKO_DRONE.protocol.droneDirection.UP
            ),
            // 지정한 거리만큼 하강하는 블록
            jikko_drone_move_down_distance: droneDistanceBlock(
                'jikko_drone_move_down_distance',
                Entry.JIKKO_DRONE.protocol.droneDirection.DOWN
            ),
        };
    }
})();

module.exports = Entry.JIKKO_DRONE;
