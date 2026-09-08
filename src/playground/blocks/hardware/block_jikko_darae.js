'use strict';

/**
 * 직코 다래 EntryJS 하드웨어 블록 모듈
 *
 * 명령 전송 흐름:
 * 엔트리 블록 -> sendProtocol() -> Entry.hw.sendQueue.SET
 * -> Entry Hardware -> 다래보드 펌웨어
 *
 * 데이터 수신 흐름:
 * 다래보드 펌웨어 -> Entry Hardware -> Entry.hw.portData
 * -> afterReceive() 및 값 읽기 블록
 */
Entry.JIKKO_DARAE = new (class JIKKO_DARAE {
    // 하드웨어 정보, 통신 규격, 핀 설정과 내부 상태를 준비한다.
    constructor() {
        this.id = '47.6';
        this.name = 'JIKKO_DARAE';
        this.url = 'https://www.makeitall.co.kr/';
        this.imageName = 'jikko.png';
        this.title = { ko: '직코 다래보드', en: 'JIKKO DARAE' };

        // 통신 프로토콜 V2.0.1 정의
        this.protocol = {
            version: '2.0.1',
            HEADER_1: 0xff,
            HEADER_2: 0xfd,
            instruction: {
                READ_MASK: 0x40,
                ETC: 0xff,
            },
            device: {
                DIGITAL: 0x01,
                ANALOG: 0x02,
                SUBSCRIBE: 0x03,
                NEOPIXEL: 0x04,
                GYRO: 0x0e,
                OPTICAL: 0x0f,
                IR_DISTANCE: 0x10,
            },
            action: {
                CLEAR: 0x02,
                OUTPUT: 0x05,
            },
        };

        // 보드별 고정 배선 정보를 통신 프로토콜과 분리해 관리한다.
        this.pins = {
            LED: 13,
            NEOPIXEL: 23,
            MOTOR: [5, 6, 9, 10],
        };
        this.sensorSubscriptions = {};
        this.sensorRequestTimes = {};
        this.sensorRequestIntervalMs = 100;
        this.protocolSendQueue = [];
        this.protocolSendTimer = null;
        this.protocolSendSequence = 0;
        this.protocolSendIntervalMs = 40;
        this.rgbUsed = false;
        this.zeroOutputSent = false;
        this.blockMenuBlocks = [
            'jikko_darae_led_title',
            'jikko_darae_led',
            'jikko_darae_led_brightness',
            'jikko_darae_rgb_color',
            'jikko_darae_rgb_clear',
            'jikko_darae_input_title',
            'jikko_darae_switch_pull_down',
            'jikko_darae_switch_pull_up',
            'jikko_darae_variable_resistor',
            'jikko_darae_gyro_acceleration',
            'jikko_darae_gyro_angle',
            'jikko_darae_gyro_temperature',
            'jikko_darae_optical',
            'jikko_darae_ir_distance',
            'jikko_darae_motor_title',
            'jikko_darae_dc_motor_power',
            'jikko_darae_dc_motor_switch',
            'jikko_darae_wifi_title',
            'jikko_darae_wifi_roll',
            'jikko_darae_wifi_pitch',
            'jikko_darae_wifi_yaw',
            'jikko_darae_wifi_throttle',
            'jikko_darae_wifi_arming',
            'jikko_darae_wifi_rgb_pin',
            'jikko_darae_wifi_rgb_r',
            'jikko_darae_wifi_rgb_g',
            'jikko_darae_wifi_rgb_b',
        ];
    }

    // -------------------------------------------------------------------------
    // FF FD 프로토콜 패킷 생성
    // 블록 값을 바이트로 정리하고 CRC-16/MODBUS를 붙인다.
    // -------------------------------------------------------------------------
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

    // -------------------------------------------------------------------------
    // EntryJS -> Entry Hardware 전송
    // 연속된 블록 명령이 덮어써지지 않도록 큐에서 순서대로 전달한다.
    // -------------------------------------------------------------------------
    flushProtocolQueue() {
        if (!this.protocolSendQueue.length) {
            this.protocolSendTimer = null;
            return;
        }
        const command = this.protocolSendQueue.shift();
        Entry.hw.sendQueue = Entry.hw.sendQueue || {};
        Entry.hw.sendQueue.SET = {
            protocol: this.protocol.version,
            instruction: command.instruction,
            parameters: command.parameters,
            packet: command.packet,
            time: command.time,
        };
        Entry.hw.update();

        this.protocolSendTimer = setTimeout(
            () => this.flushProtocolQueue(),
            this.protocolSendIntervalMs
        );
    }

    // 명령을 패킷으로 만든 뒤 Entry Hardware 전송 대기열에 추가한다.
    sendProtocol(instruction, parameters = [], options = {}) {
        this.zeroOutputSent = false;
        const normalizedInstruction = this.clampByte(instruction);
        const normalizedParameters = parameters.map((value) => this.clampByte(value));
        const packet = this.buildPacket(normalizedInstruction, normalizedParameters);
        this.protocolSendSequence += 1;
        this.protocolSendQueue.push({
            instruction: normalizedInstruction,
            parameters: normalizedParameters,
            packet,
            time: options.time || Date.now() * 1000 + (this.protocolSendSequence % 1000),
        });
        if (!this.protocolSendTimer) {
            this.flushProtocolQueue();
        }
        return packet;
    }

    writePin(pin, device, value) {
        return this.sendProtocol(pin, [device, value]);
    }

    readPin(pin, device, parameters = []) {
        return this.sendProtocol(
            this.protocol.instruction.READ_MASK + this.clampByte(pin),
            [device].concat(parameters)
        );
    }

    subscribe(pin, device, parameters = []) {
        const normalizedPin = this.clampByte(pin);
        const key = `${device}:${normalizedPin}:${parameters.join(',')}`;
        const now = Date.now();
        if (
            this.sensorRequestTimes[key] &&
            now - this.sensorRequestTimes[key] < this.sensorRequestIntervalMs
        ) {
            return;
        }
        this.sensorRequestTimes[key] = now;
        return this.readPin(normalizedPin, device, parameters);
    }

    subscribeDigital(pin, pullUp = false) {
        return this.subscribe(
            this.entryPinToFirmwarePin(pin),
            this.protocol.device.DIGITAL,
            [pullUp ? 1 : 0]
        );
    }

    subscribeExtended(device) {
        const key = `extended:${device}`;
        if (this.sensorSubscriptions[key]) {
            return;
        }
        this.sensorSubscriptions[key] = true;
        return this.sendProtocol(this.protocol.instruction.ETC, [
            device,
            this.protocol.device.SUBSCRIBE,
        ]);
    }

    unsubscribeExtendedSensors() {
        Object.keys(this.sensorSubscriptions).forEach((key) => {
            if (!key.startsWith('extended:')) {
                return;
            }

            const device = Number(key.substring('extended:'.length));
            if (!Number.isFinite(device)) {
                return;
            }

            this.sendProtocol(this.protocol.instruction.ETC, [
                device,
                this.protocol.action.CLEAR,
            ]);
        });
    }

    entryPinToFirmwarePin(pin) {
        const number = Number(pin);
        if (number === 32) {
            return 2;
        }
        if (number === 33) {
            return 3;
        }
        return this.clampByte(number);
    }

    // Entry Hardware가 전달한 portData에서 센서 및 Wi-Fi 값을 가져온다.
    getFirstPortValue(keys, fallback = 0) {
        const portData = Entry.hw.portData || {};
        for (let index = 0; index < keys.length; index++) {
            const key = keys[index];
            if (portData[key] !== undefined) {
                const value = portData[key];
                return value && value.value !== undefined ? value.value : value;
            }
        }
        return fallback;
    }

    hexToRgb555(color) {
        const value = String(color || '#000000').replace('#', '');
        const red = parseInt(value.slice(0, 2), 16) || 0;
        const green = parseInt(value.slice(2, 4), 16) || 0;
        const blue = parseInt(value.slice(4, 6), 16) || 0;
        return ((red >>> 3) << 10) | ((green >>> 3) << 5) | (blue >>> 3);
    }

    setRgbLed(position, color) {
        const rgb555 = this.hexToRgb555(color);
        const index = position === 'right' ? 0 : 1;
        this.rgbUsed = true;
        return this.sendProtocol(this.pins.NEOPIXEL, [
            this.protocol.device.NEOPIXEL,
            index,
            rgb555 & 0xff,
            (rgb555 >>> 8) & 0xff,
        ]);
    }

    // -------------------------------------------------------------------------
    // 작품 정지 및 하드웨어 초기화
    // 대기 명령과 센서 구독을 정리하고 모든 출력을 안전하게 끈다.
    // -------------------------------------------------------------------------
    setZero() {
        if (this.zeroOutputSent) {
            return;
        }

        // 정지 전에 쌓인 명령을 제거해 모터 명령이 뒤늦게 전송되지 않게 한다.
        if (this.protocolSendTimer) {
            clearTimeout(this.protocolSendTimer);
            this.protocolSendTimer = null;
        }
        this.protocolSendQueue = [];

        // 펌웨어의 연속 센서 전송을 중단한 뒤 로컬 구독 정보도 초기화한다.
        this.unsubscribeExtendedSensors();
        this.sensorSubscriptions = {};
        this.sensorRequestTimes = {};

        this.pins.MOTOR.forEach((pin) => {
            this.writePin(pin, this.protocol.device.ANALOG, 0);
        });
        this.writePin(this.pins.LED, this.protocol.device.DIGITAL, 0);
        if (this.rgbUsed) {
            this.sendProtocol(this.pins.NEOPIXEL, [
                this.protocol.device.NEOPIXEL,
                this.protocol.action.CLEAR,
            ]);
            this.rgbUsed = false;
        }
        this.zeroOutputSent = true;
    }

    // 블록 화면에 표시할 한국어와 영어 문구를 정의한다.
    setLanguage() {
        return {
            ko: {
                template: {
                    jikko_darae_led_title: 'LED',
                    jikko_darae_led: 'LED %1 핀 %2',
                    jikko_darae_led_brightness: 'LED ( %1 핀) 밝기 %2 출력 (0~255)',
                    jikko_darae_rgb_color: 'RGB LED %1 %2 색 출력',
                    jikko_darae_rgb_clear: 'RGB LED 모든 LED 끄기',
                    jikko_darae_input_title: '입력',
                    jikko_darae_switch_pull_down: '스위치 %1 핀 눌림 상태(풀다운)',
                    jikko_darae_switch_pull_up: '스위치 %1 핀 눌림 상태(풀업)',
                    jikko_darae_variable_resistor: '가변저항 %1 핀 값',
                    jikko_darae_gyro_acceleration: '자이로센서 %1 %2 축 값',
                    jikko_darae_gyro_angle: '자이로센서 각도 %1 축 값',
                    jikko_darae_gyro_temperature: '자이로센서 온도 값',
                    jikko_darae_optical: '옵티컬 센서 %1 축 감지값',
                    jikko_darae_ir_distance: 'IR 센서 거리(mm) 값',
                    jikko_darae_motor_title: '모터',
                    jikko_darae_dc_motor_power: 'DC 모터 ( %1 핀) 세기 %2 출력 (0~5)',
                    jikko_darae_dc_motor_switch: 'DC 모터 %1 핀 %2',
                    jikko_darae_wifi_title: '와이파이',
                    jikko_darae_wifi_roll: 'Roll(롤) 값 읽기',
                    jikko_darae_wifi_pitch: 'Pitch(피치) 값 읽기',
                    jikko_darae_wifi_yaw: 'Yaw(요) 값 읽기',
                    jikko_darae_wifi_throttle: 'Throttle(쓰로틀) 값 읽기',
                    jikko_darae_wifi_arming: '시동 값 읽기',
                    jikko_darae_wifi_rgb_pin: '조종기 RGB 핀 값 읽기',
                    jikko_darae_wifi_rgb_r: '조종기 R 값 읽기',
                    jikko_darae_wifi_rgb_g: '조종기 G 값 읽기',
                    jikko_darae_wifi_rgb_b: '조종기 B 값 읽기',
                },
            },
            en: {
                template: {
                    jikko_darae_led_title: 'LED',
                    jikko_darae_led: 'LED pin %1 %2',
                    jikko_darae_led_brightness: 'LED pin %1 brightness %2 (0-255)',
                    jikko_darae_rgb_color: 'Set %1 RGB LED to %2',
                    jikko_darae_rgb_clear: 'Turn off all RGB LEDs',
                    jikko_darae_input_title: 'Input',
                    jikko_darae_switch_pull_down: 'Switch pin %1 pressed (pull-down)',
                    jikko_darae_switch_pull_up: 'Switch pin %1 pressed (pull-up)',
                    jikko_darae_variable_resistor: 'Variable resistor %1 value',
                    jikko_darae_gyro_acceleration: 'Gyroscope %1 %2-axis value',
                    jikko_darae_gyro_angle: 'Gyroscope angle %1-axis value',
                    jikko_darae_gyro_temperature: 'Gyroscope temperature',
                    jikko_darae_optical: 'Optical sensor %1-axis value',
                    jikko_darae_ir_distance: 'IR distance (mm)',
                    jikko_darae_motor_title: 'Motor',
                    jikko_darae_dc_motor_power: 'DC motor pin %1 power %2 (0-5)',
                    jikko_darae_dc_motor_switch: 'DC motor pin %1 %2',
                    jikko_darae_wifi_title: 'Wi-Fi',
                    jikko_darae_wifi_roll: 'Read Roll',
                    jikko_darae_wifi_pitch: 'Read Pitch',
                    jikko_darae_wifi_yaw: 'Read Yaw',
                    jikko_darae_wifi_throttle: 'Read Throttle',
                    jikko_darae_wifi_arming: 'Read arming value',
                    jikko_darae_wifi_rgb_pin: 'Read controller RGB pin',
                    jikko_darae_wifi_rgb_r: 'Read controller R',
                    jikko_darae_wifi_rgb_g: 'Read controller G',
                    jikko_darae_wifi_rgb_b: 'Read controller B',
                },
            },
        };
    }

    // -------------------------------------------------------------------------
    // 엔트리 블록 정의
    // 각 블록의 모양, 입력값, 실행 함수와 하드웨어 명령을 연결한다.
    // -------------------------------------------------------------------------
    getBlocks() {
        const color = EntryStatic.colorSet.block.default.HARDWARE;
        const dark = EntryStatic.colorSet.block.darken.HARDWARE;
        const arrow = EntryStatic.colorSet.arrow.default.HARDWARE;
        const indicator = {
            type: 'Indicator',
            img: 'block_icon/hardware_icon.svg',
            size: 12,
        };
        const dropdown = (options, value) => ({
            type: 'Dropdown',
            options,
            value,
            fontSize: 11,
            bgColor: dark,
            arrowColor: arrow,
        });
        const pinOptions = Array.from({ length: 26 }, (_, index) => {
            const pin = index + 2;
            return [String(pin), String(pin)];
        });
        const digitalPinOptions = ['8', '11', '12', '13'].map((pin) => [pin, pin]);
        const motorPinOptions = ['5', '6', '9', '10'].map((pin) => [pin, pin]);
        const variableResistorPinOptions = [['A1', '1']];
        const axisOptions = [
            ['X', 'X'],
            ['Y', 'Y'],
            ['Z', 'Z'],
        ];
        const twoAxisOptions = axisOptions.slice(0, 2);
        const base = (skeleton, params, def, paramsKeyMap, func) => ({
            color,
            outerLine: dark,
            fontColor: '#ffffff',
            skeleton,
            statements: [],
            params: params.concat(indicator),
            def,
            paramsKeyMap,
            class: 'jikko_darae',
            isNotFor: ['JIKKO_DARAE'],
            func,
        });
        const command = (params, def, paramsKeyMap, func) =>
            base('basic', params, def, paramsKeyMap, func);
        const valueBlock = (params, def, paramsKeyMap, func) =>
            base(
                'basic_string_field',
                params,
                def,
                paramsKeyMap,
                func
            );
        const title = (type) => ({
            skeleton: 'basic_text',
            color: EntryStatic.colorSet.common.TRANSPARENT,
            fontColor: '#333333',
            skeletonOptions: { contentPos: { x: 10, y: 10 } },
            params: [
                {
                    type: 'Text',
                    text: Lang.template[type],
                    color: '#333333',
                    align: 'left',
                },
            ],
            def: { type },
            class: 'jikko_darae',
            isNotFor: ['JIKKO_DARAE'],
            fontSize: 22,
        });
        const readDigital = (script, pullUp) => {
            const pin = script.getNumberValue('PIN', script);
            Entry.JIKKO_DARAE.subscribeDigital(pin, pullUp);
            const raw = Entry.JIKKO_DARAE.getFirstPortValue(
                [pin, String(pin), `digital_${pin}`],
                pullUp ? 1 : 0
            );
            return pullUp ? Number(raw) === 0 : Number(raw) !== 0;
        };

        const blocks = {
            // LED 블록 구분 제목
            jikko_darae_led_title: title('jikko_darae_led_title'),
            // 디지털 LED를 켜거나 끄는 블록
            jikko_darae_led: command(
                [
                    dropdown(digitalPinOptions, '13'),
                    dropdown(
                        [
                            ['켜기', '1'],
                            ['끄기', '0'],
                        ],
                        '1'
                    ),
                ],
                {
                    params: ['13', '1'],
                    type: 'jikko_darae_led',
                },
                {
                    PIN: 0,
                    VALUE: 1,
                },
                (sprite, script) => {
                    Entry.JIKKO_DARAE.writePin(
                        script.getNumberValue('PIN', script),
                        Entry.JIKKO_DARAE.protocol.device.DIGITAL,
                        script.getNumberValue('VALUE', script)
                    );
                    return script.callReturn();
                }
            ),
            // PWM 값으로 일반 LED의 밝기를 조절하는 블록
            jikko_darae_led_brightness: command(
                [
                    dropdown(digitalPinOptions, '13'),
                    { type: 'Block', accept: 'string', value: '100' },
                ],
                {
                    params: ['13', '100'],
                    type: 'jikko_darae_led_brightness',
                },
                {
                    PIN: 0,
                    VALUE: 1,
                },
                (sprite, script) => {
                    Entry.JIKKO_DARAE.writePin(
                        script.getNumberValue('PIN', script),
                        Entry.JIKKO_DARAE.protocol.device.ANALOG,
                        Entry.JIKKO_DARAE.clampByte(script.getNumberValue('VALUE', script))
                    );
                    return script.callReturn();
                }
            ),
            // 왼쪽 또는 오른쪽 RGB LED의 색상을 지정하는 블록
            jikko_darae_rgb_color: command(
                [
                    dropdown(
                        [
                            ['왼쪽', 'left'],
                            ['오른쪽', 'right'],
                        ],
                        'left'
                    ),
                    { type: 'Color', value: '#44c767' },
                ],
                {
                    params: ['left', '#44c767'],
                    type: 'jikko_darae_rgb_color',
                },
                {
                    POSITION: 0,
                    COLOR: 1,
                },
                (sprite, script) => {
                    Entry.JIKKO_DARAE.setRgbLed(
                        script.getStringField('POSITION', script),
                        script.getStringField('COLOR', script)
                    );
                    return script.callReturn();
                }
            ),
            // 모든 RGB LED를 끄는 블록
            jikko_darae_rgb_clear: command(
                [],
                {
                    type: 'jikko_darae_rgb_clear',
                },
                {},
                (sprite, script) => {
                    Entry.JIKKO_DARAE.sendProtocol(Entry.JIKKO_DARAE.pins.NEOPIXEL, [
                        Entry.JIKKO_DARAE.protocol.device.NEOPIXEL,
                        Entry.JIKKO_DARAE.protocol.action.CLEAR,
                    ]);
                    Entry.JIKKO_DARAE.rgbUsed = false;
                    return script.callReturn();
                }
            ),

            // 입력 블록 구분 제목
            jikko_darae_input_title: title('jikko_darae_input_title'),
            // 풀다운 방식 스위치의 눌림 상태를 읽는 블록
            jikko_darae_switch_pull_down: valueBlock(
                [dropdown(digitalPinOptions, '12')],
                {
                    params: ['12'],
                    type: 'jikko_darae_switch_pull_down',
                },
                {
                    PIN: 0,
                },
                (sprite, script) => Number(readDigital(script, false))
            ),
            // 풀업 방식 스위치의 눌림 상태를 읽는 블록
            jikko_darae_switch_pull_up: valueBlock(
                [dropdown(digitalPinOptions, '12')],
                {
                    params: ['12'],
                    type: 'jikko_darae_switch_pull_up',
                },
                {
                    PIN: 0,
                },
                (sprite, script) => Number(readDigital(script, true))
            ),
            // 가변저항의 아날로그 값을 읽는 블록
            jikko_darae_variable_resistor: valueBlock(
                [dropdown(variableResistorPinOptions, '1')],
                {
                    params: ['1'],
                    type: 'jikko_darae_variable_resistor',
                },
                {
                    PIN: 0,
                },
                (sprite, script) => {
                    const pin = script.getNumberValue('PIN', script);
                    Entry.JIKKO_DARAE.subscribe(pin, Entry.JIKKO_DARAE.protocol.device.ANALOG);
                    return Entry.JIKKO_DARAE.getFirstPortValue(
                        [`analog_${pin}`, `A${pin}`, pin],
                        0
                    );
                }
            ),
            // 자이로 센서의 가속도 또는 각속도 X/Y/Z 값을 읽는 블록
            jikko_darae_gyro_acceleration: valueBlock(
                [
                    dropdown(
                        [
                            ['가속도', 'acceleration'],
                            ['자이로', 'angularVelocity'],
                        ],
                        'acceleration'
                    ),
                    dropdown(axisOptions, 'X'),
                ],
                {
                    params: ['acceleration', 'X'],
                    type: 'jikko_darae_gyro_acceleration',
                },
                {
                    TYPE: 0,
                    AXIS: 1,
                },
                (sprite, script) => {
                    Entry.JIKKO_DARAE.subscribeExtended(
                        Entry.JIKKO_DARAE.protocol.device.GYRO
                    );
                    const type = script.getStringField('TYPE', script);
                    const axis = script.getStringField('AXIS', script);
                    const sensorValue = Entry.JIKKO_DARAE.getFirstPortValue(
                        [`GYRO_${type}_${axis}`, `gyro_${type}_${axis.toLowerCase()}`],
                        0
                    );

                    // MPU6050의 ±2g 원시 가속도값(16384 LSB/g)을 m/s²로 변환한다.
                    // 각속도값은 펌웨어에서 받은 값을 기존과 동일하게 그대로 반환한다.
                    if (type === 'acceleration') {
                        const acceleration = (sensorValue / 16384) * 9.80665;
                        return Math.round(acceleration * 100) / 100;
                    }

                    return sensorValue;
                }
            ),
            // 자이로 센서로 계산한 X/Y 기울기 각도를 읽는 블록
            jikko_darae_gyro_angle: valueBlock(
                [dropdown(twoAxisOptions, 'X')],
                {
                    params: ['X'],
                    type: 'jikko_darae_gyro_angle',
                },
                {
                    AXIS: 0,
                },
                (sprite, script) => {
                    Entry.JIKKO_DARAE.subscribeExtended(
                        Entry.JIKKO_DARAE.protocol.device.GYRO
                    );
                    const axis = script.getStringField('AXIS', script);
                    return (
                        Entry.JIKKO_DARAE.getFirstPortValue(
                            [`GYRO_ANGLE_${axis}`, `gyro_angle_${axis.toLowerCase()}`],
                            0
                        ) / 100
                    );
                }
            ),
            // 자이로 센서 내부 온도를 읽는 블록
            jikko_darae_gyro_temperature: valueBlock(
                [],
                {
                    type: 'jikko_darae_gyro_temperature',
                },
                {},
                () => {
                    Entry.JIKKO_DARAE.subscribeExtended(
                        Entry.JIKKO_DARAE.protocol.device.GYRO
                    );
                    return (
                        Entry.JIKKO_DARAE.getFirstPortValue(
                            ['GYRO_TEMPERATURE', 'gyro_temperature'],
                            0
                        ) / 100
                    );
                }
            ),
            // 옵티컬 플로우 센서의 X/Y 이동값을 읽는 블록
            jikko_darae_optical: valueBlock(
                [dropdown(twoAxisOptions, 'X')],
                {
                    params: ['X'],
                    type: 'jikko_darae_optical',
                },
                {
                    AXIS: 0,
                },
                (sprite, script) => {
                    Entry.JIKKO_DARAE.subscribeExtended(
                        Entry.JIKKO_DARAE.protocol.device.OPTICAL
                    );
                    const axis = script.getStringField('AXIS', script);
                    return Entry.JIKKO_DARAE.getFirstPortValue(
                        [`OPTICAL_${axis}`, `optical_${axis.toLowerCase()}`],
                        0
                    );
                }
            ),
            // IR 거리 센서의 밀리미터 값을 읽는 블록
            jikko_darae_ir_distance: valueBlock(
                [],
                {
                    type: 'jikko_darae_ir_distance',
                },
                {},
                () => {
                    Entry.JIKKO_DARAE.subscribeExtended(
                        Entry.JIKKO_DARAE.protocol.device.IR_DISTANCE
                    );
                    return Entry.JIKKO_DARAE.getFirstPortValue(
                        ['IR_DISTANCE', 'ir_distance'],
                        0
                    );
                }
            ),

            // 모터 블록 구분 제목
            jikko_darae_motor_title: title('jikko_darae_motor_title'),
            // PWM 값으로 DC 모터 세기를 0~5 단계로 조절하는 블록
            jikko_darae_dc_motor_power: command(
                [dropdown(motorPinOptions, '5'), { type: 'Block', accept: 'string', value: '5' }],
                {
                    params: ['5', '5'],
                    type: 'jikko_darae_dc_motor_power',
                },
                {
                    PIN: 0,
                    POWER: 1,
                },
                (sprite, script) => {
                    const power = Math.max(0, Math.min(5, script.getNumberValue('POWER', script)));
                    Entry.JIKKO_DARAE.writePin(
                        script.getNumberValue('PIN', script),
                        Entry.JIKKO_DARAE.protocol.device.ANALOG,
                        Math.round(power * 51)
                    );
                    return script.callReturn();
                }
            ),
            // DC 모터 출력을 켜거나 끄는 블록
            jikko_darae_dc_motor_switch: command(
                [
                    dropdown(motorPinOptions, '5'),
                    dropdown(
                        [
                            ['켜기', '1'],
                            ['끄기', '0'],
                        ],
                        '1'
                    ),
                ],
                {
                    params: ['5', '1'],
                    type: 'jikko_darae_dc_motor_switch',
                },
                {
                    PIN: 0,
                    VALUE: 1,
                },
                (sprite, script) => {
                    Entry.JIKKO_DARAE.writePin(
                        script.getNumberValue('PIN', script),
                        Entry.JIKKO_DARAE.protocol.device.DIGITAL,
                        script.getNumberValue('VALUE', script)
                    );
                    return script.callReturn();
                }
            ),

            // Wi-Fi 조종값 블록 구분 제목
            jikko_darae_wifi_title: title('jikko_darae_wifi_title'),
            // 휴대폰 조종기의 Roll 값을 읽는 블록
            jikko_darae_wifi_roll: valueBlock([], { type: 'jikko_darae_wifi_roll' }, {}, () =>
                Entry.JIKKO_DARAE.getFirstPortValue(['WIFI_ROLL', 'wifi_roll', 'ROLL', 'roll'], 0)
            ),
            // 휴대폰 조종기의 Pitch 값을 읽는 블록
            jikko_darae_wifi_pitch: valueBlock([], { type: 'jikko_darae_wifi_pitch' }, {}, () =>
                Entry.JIKKO_DARAE.getFirstPortValue(
                    ['WIFI_PITCH', 'wifi_pitch', 'PITCH', 'pitch'],
                    0
                )
            ),
            // 휴대폰 조종기의 Yaw 값을 읽는 블록
            jikko_darae_wifi_yaw: valueBlock([], { type: 'jikko_darae_wifi_yaw' }, {}, () =>
                Entry.JIKKO_DARAE.getFirstPortValue(['WIFI_YAW', 'wifi_yaw', 'YAW', 'yaw'], 0)
            ),
            // 휴대폰 조종기의 Throttle 값을 읽는 블록
            jikko_darae_wifi_throttle: valueBlock(
                [],
                { type: 'jikko_darae_wifi_throttle' },
                {},
                () =>
                    Entry.JIKKO_DARAE.getFirstPortValue(
                        ['WIFI_THROTTLE', 'wifi_throttle', 'THROTTLE', 'throttle'],
                        0
                    )
            ),
            // 휴대폰 앱의 ARM/DISARM 상태를 1 또는 0으로 읽는 블록
            jikko_darae_wifi_arming: valueBlock([], { type: 'jikko_darae_wifi_arming' }, {}, () =>
                Entry.JIKKO_DARAE.getFirstPortValue(
                    ['WIFI_ARMING', 'wifi_arming', 'ARMING', 'arming'],
                    0
                )
            ),
            // 휴대폰 앱에서 선택한 RGB LED 번호를 읽는 블록
            jikko_darae_wifi_rgb_pin: valueBlock([], { type: 'jikko_darae_wifi_rgb_pin' }, {}, () =>
                Entry.JIKKO_DARAE.getFirstPortValue(
                    ['WIFI_RGB_PIN', 'wifi_rgb_pin', 'RGB_PIN', 'rgb_pin'],
                    0
                )
            ),
            // 휴대폰 앱의 RGB 빨간색 값을 읽는 블록
            jikko_darae_wifi_rgb_r: valueBlock([], { type: 'jikko_darae_wifi_rgb_r' }, {}, () =>
                Entry.JIKKO_DARAE.getFirstPortValue(
                    ['WIFI_RGB_R', 'wifi_rgb_r', 'RGB_R', 'rgb_r'],
                    0
                )
            ),
            // 휴대폰 앱의 RGB 초록색 값을 읽는 블록
            jikko_darae_wifi_rgb_g: valueBlock([], { type: 'jikko_darae_wifi_rgb_g' }, {}, () =>
                Entry.JIKKO_DARAE.getFirstPortValue(
                    ['WIFI_RGB_G', 'wifi_rgb_g', 'RGB_G', 'rgb_g'],
                    0
                )
            ),
            // 휴대폰 앱의 RGB 파란색 값을 읽는 블록
            jikko_darae_wifi_rgb_b: valueBlock([], { type: 'jikko_darae_wifi_rgb_b' }, {}, () =>
                Entry.JIKKO_DARAE.getFirstPortValue(
                    ['WIFI_RGB_B', 'wifi_rgb_b', 'RGB_B', 'rgb_b'],
                    0
                )
            ),

        };

        const categoryColors = {
            led: { color: '#DF3075', dark: '#B91F5B' },
            input: { color: '#6747F5', dark: '#4D31CC' },
            motor: { color: '#B544D4', dark: '#902EB0' },
            wifi: { color: '#4668EF', dark: '#2F4DC5' },
        };
        const categoryByType = {
            jikko_darae_led: 'led',
            jikko_darae_led_brightness: 'led',
            jikko_darae_rgb_color: 'led',
            jikko_darae_rgb_clear: 'led',
            jikko_darae_switch_pull_down: 'input',
            jikko_darae_switch_pull_up: 'input',
            jikko_darae_variable_resistor: 'input',
            jikko_darae_gyro_acceleration: 'input',
            jikko_darae_gyro_angle: 'input',
            jikko_darae_gyro_temperature: 'input',
            jikko_darae_optical: 'input',
            jikko_darae_ir_distance: 'input',
            jikko_darae_dc_motor_power: 'motor',
            jikko_darae_dc_motor_switch: 'motor',
            jikko_darae_wifi_roll: 'wifi',
            jikko_darae_wifi_pitch: 'wifi',
            jikko_darae_wifi_yaw: 'wifi',
            jikko_darae_wifi_throttle: 'wifi',
            jikko_darae_wifi_arming: 'wifi',
            jikko_darae_wifi_rgb_pin: 'wifi',
            jikko_darae_wifi_rgb_r: 'wifi',
            jikko_darae_wifi_rgb_g: 'wifi',
            jikko_darae_wifi_rgb_b: 'wifi',
        };

        Object.keys(categoryByType).forEach((type) => {
            const block = blocks[type];
            const colors = categoryColors[categoryByType[type]];
            if (!block) {
                return;
            }

            block.color = colors.color;
            block.outerLine = colors.dark;
            (block.params || []).forEach((param) => {
                if (param && param.type === 'Dropdown') {
                    param.bgColor = colors.dark;
                    param.arrowColor = '#FFFFFF';
                }
            });
        });

        return blocks;
    }
})();

module.exports = Entry.JIKKO_DARAE;
