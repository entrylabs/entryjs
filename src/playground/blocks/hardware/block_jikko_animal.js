'use strict';

/**
 * 애니멀 키링 EntryJS 하드웨어 블록 모듈
 *
 * 명령 전송 흐름:
 * 엔트리 블록 -> sendProtocol() -> Entry.hw.sendQueue.SET
 * -> Entry Hardware -> 애니멀 키링 펌웨어
 *
 * 데이터 수신 흐름:
 * 애니멀 키링 펌웨어 -> Entry Hardware -> Entry.hw.portData
 * -> afterReceive() 및 입력값 블록
 */
Entry.ANIMALKEYRING = new (class ANIMALKEYRING {
    // 하드웨어 정보, 통신 규격, 고정 핀과 LED 상태를 준비한다.
    constructor() {
        this.id = '47.5';
        this.name = 'ANIMALKEYRING';
        this.url = 'https://www.makeitall.co.kr/';
        this.imageName = 'jikko_Animal.png';
        this.title = { ko: '애니멀 키링', en: 'ANIMAL KEYRING' };

        // 통신 프로토콜 V2.0.1 정리본을 기준으로 정의한다.
        this.protocol = {
            HEADER_1: 0xff,
            HEADER_2: 0xfd,
            instruction: { ETC: 0xff, READ_MASK: 0x40 },
            device: {
                DIGITAL: 0x01,
                ANALOG: 0x02,
                NEOPIXEL: 0x04,
                BUZZER: 0x06,
                DOT_MATRIX: 0x08,
            },
            action: {
                INIT: 0x01,
                CLEAR: 0x02,
                OUTPUT: 0x05,
                BITMAP: 0x0d,
                PLAY_MELODY: 0x0b,
                STOP: 0x0c,
            },
            melody: {
                THREE_BEARS: 0x00,
                ROUND_AND_ROUND: 0x01,
                MOUNTAIN_TIGER: 0x02,
                RUDOLPH: 0x03,
                TWINKLE_TWINKLE: 0x04,
                EXCITING: 0x05,
                CHEERFUL: 0x06,
                SOFT: 0x07,
                GRAND: 0x08,
                URGENT: 0x09,
            },
        };

        // 애니멀 보드의 고정 배선 정보이며 보드 버전이 바뀔 때만 수정한다.
        this.pins = {
            LED: 5,
            BUZZER: 6,
            NEOPIXEL: 10,
            DOT_MATRIX: { DIN: 12, CS: 11, CLK: 9 },
        };
        this.sensorSubscriptions = {};
        this.digitalPortData = { 2: 1, 3: 1 };
        this.neopixelCount = 12;
        this.neopixelOrder = [3, 4, 5, 9, 10, 11, 0, 1, 2, 6, 7, 8];
        this.neopixelDefaultLed = Array.from({ length: 6 }, () =>
            Array.from({ length: 2 }, () => 0)
        );
        this.dotMatrixDefaultLed = Array.from({ length: 8 }, () =>
            Array.from({ length: 8 }, () => 0)
        );
        this.blockMenuBlocks = [
            'makeitall_led_title',
            'makeitall_sensor_led',
            'makeitall_sensor_led_brightness',
            'makeitall_input_title',
            'makeitall_input',
            'makeitall_piezobuzzer_title',
            'makeitall_sensor_piezobuzzer',
            'makeitall_sensor_morsedot',
            'makeitall_sensor_morseline',
            'makeitall_sensor_playmelody',
            'makeitall_sensor_box',
            'makeitall_neo_title',
            'makeitall_neo_exression_rainbowcolor',
            'makeitall_neo_expression_color',
            'makeitall_neo_bitmap_rainbowcolor',
            'makeitall_neo_bitmap_color',
            'makeitall_neo_clear',
            'makeitall_dotmatrix_title',
            'makeitall_dotmatrix_bitmap',
            'makeitall_dotmatrix',
            'makeitall_dotmatrix_clear',
        ];
    }

    // FF FD 패킷을 만들고 CRC-16/MODBUS를 계산하는 공통 처리
    clampByte(value) {
        return Math.max(0, Math.min(255, Math.round(Number(value) || 0)));
    }

    // CRC-16/MODBUS를 계산하고 V2.0.1 규격에 따라 하위·상위 바이트 순서로 붙인다.
    calculateCrc(bytes) {
        let crc = 0xffff;
        bytes.forEach((byte) => {
            crc ^= byte;
            for (let bit = 0; bit < 8; bit++) {
                crc = crc & 1 ? (crc >>> 1) ^ 0xa001 : crc >>> 1;
            }
        });
        return crc & 0xffff;
    }

    buildPacket(instruction, parameters) {
        const params = (parameters || []).map((value) => this.clampByte(value));
        const normalizedInstruction = this.clampByte(instruction);
        const body = [params.length, normalizedInstruction].concat(params);
        const withoutCrc = [this.protocol.HEADER_1, this.protocol.HEADER_2].concat(body);
        const crc = this.calculateCrc([normalizedInstruction].concat(params));
        return withoutCrc.concat([crc & 0xff, (crc >>> 8) & 0xff]);
    }

    // EntryJS 블록 명령을 Entry Hardware 전송 큐에 기록한다.
    sendProtocol(instruction, parameters, options) {
        const packet = this.buildPacket(instruction, parameters);
        Entry.hw.sendQueue = Entry.hw.sendQueue || {};
        Entry.hw.sendQueue.SET = {
            protocol: '2.0.1',
            instruction: this.clampByte(instruction),
            parameters: parameters.map((value) => this.clampByte(value)),
            packet,
            time: options && options.time ? options.time : Date.now(),
        };
        Entry.hw.update();
        delete Entry.hw.sendQueue.SET;
    }

    // Entry Hardware가 해석한 보드 응답을 EntryJS 입력 상태에 반영한다.
    afterReceive(portData) {
        const mcuPackets = portData && portData.MCU_PACKETS;
        if (Array.isArray(mcuPackets)) {
            mcuPackets.forEach(({ instruction, params, parameters }) => {
                const receivedParameters = params || parameters;
                this.updateDigitalPortData(portData, instruction, receivedParameters);
            });
        }
        const blockPackets = portData && portData.BLOCK_PACKETS;
        if (Array.isArray(blockPackets)) {
            blockPackets.forEach(({ device, instruction, parameters }) => {
                const params = device === undefined
                    ? parameters
                    : [device].concat(parameters || []);
                this.updateDigitalPortData(portData, instruction, params);
            });
        }
        if (portData && portData.instruction !== undefined) {
            this.updateDigitalPortData(
                portData,
                portData.instruction,
                portData.params || portData.parameters
            );
        }
    }

    writePin(pin, device, value) {
        this.sendProtocol(pin, [device, value]);
    }

    updateDigitalPortData(portData, instruction, parameters) {
        if (!portData || !Array.isArray(parameters) || parameters.length < 2) return;
        if (Number(parameters[0]) !== this.protocol.device.DIGITAL) return;

        const rawInstruction = Number(instruction);
        if (!Number.isFinite(rawInstruction)) return;

        const pin = rawInstruction & 0x3f;
        const value = this.clampByte(parameters[parameters.length - 1]);
        if (value > 1) return;

        this.digitalPortData[pin] = value;
        portData[pin] = value;
        portData[`digital_${pin}`] = value;
    }

    getDigitalPortValue(pin) {
        const portData = Entry.hw.portData;
        const pinNumber = this.clampByte(pin);
        if (!portData) return this.digitalPortData[pinNumber];

        const keys = [pinNumber, `digital_${pinNumber}`];
        const key = keys.find((candidate) => portData[candidate] !== undefined);
        if (key !== undefined) {
            const value = this.clampByte(portData[key]);
            if (value <= 1) this.digitalPortData[pinNumber] = value;
        }
        return this.digitalPortData[pinNumber];
    }

    subscribeDigital(pin) {
        const key = `digital:${pin}`;
        const now = Date.now();
        const lastRequestedAt = this.sensorSubscriptions[key] || 0;
        if (now - lastRequestedAt < 50) return;
        this.sensorSubscriptions[key] = now;
        this.sendProtocol(
            this.protocol.instruction.READ_MASK + this.clampByte(pin),
            [this.protocol.device.DIGITAL]
        );
    }

    hexToRgb555(color) {
        const value = String(color || '#000000').replace('#', '');
        const r = parseInt(value.slice(0, 2), 16) || 0;
        const g = parseInt(value.slice(2, 4), 16) || 0;
        const b = parseInt(value.slice(4, 6), 16) || 0;
        return ((r >>> 3) << 10) | ((g >>> 3) << 5) | (b >>> 3);
    }

    scaleHexColor(color, brightness, maximum = 9) {
        const value = String(color || '#000000').replace('#', '');
        const ratio = Math.max(0, Math.min(1, (Number(brightness) || 0) / maximum));
        const scale = (offset) =>
            Math.round((parseInt(value.slice(offset, offset + 2), 16) || 0) * ratio);
        return `#${[scale(0), scale(2), scale(4)]
            .map((channel) => channel.toString(16).padStart(2, '0'))
            .join('')}`;
    }

    sendNeoPixelPattern(colors) {
        const frame = new Array(this.neopixelCount).fill(0);

        colors.slice(0, this.neopixelCount).forEach(({ index, color }) => {
            const normalizedIndex = this.clampByte(index);
            if (normalizedIndex < this.neopixelCount) {
                frame[normalizedIndex] = this.hexToRgb555(color);
            }
        });

        // 12개 LED 색상을 한 패킷으로 묶어 동시에 갱신한다.
        // RGB555는 기존 개별 LED 명령과 동일하게 상위 바이트부터 전송한다.
        const parameters = [
            this.protocol.device.NEOPIXEL,
            this.protocol.action.BITMAP,
            this.neopixelCount,
        ];
        frame.forEach((rgb555) => {
            parameters.push((rgb555 >>> 8) & 0xff, rgb555 & 0xff);
        });
        this.sendProtocol(this.pins.NEOPIXEL, parameters);

        return frame.length;
    }

    clearNeoPixel() {
        this.sendProtocol(this.pins.NEOPIXEL, [
            this.protocol.device.NEOPIXEL,
            this.protocol.action.CLEAR,
        ]);
    }

    ledFieldToRows(value, size) {
        const matrix = Array.isArray(value) ? value : [];
        return Array.from({ length: size }, (_, row) => {
            let result = 0;
            for (let col = 0; col < size; col++) {
                if (matrix[row] && Number(matrix[row][col])) result |= 1 << (size - col - 1);
            }
            return result;
        });
    }

    led2FieldToPixels(value) {
        const matrix = Array.isArray(value) ? value : [];
        return matrix
            .reduce(
                (pixels, cells) => pixels.concat(Array.isArray(cells) ? cells : []),
                []
            )
            .slice(0, this.neopixelCount)
            .map((brightness) => Math.max(0, Math.min(9, Number(brightness) || 0)));
    }

    patternStringToRows(value) {
        return String(value || '')
            .split(':')
            .slice(0, 8)
            .map((row) => parseInt(row, 2) || 0);
    }

    sendDotMatrixRows(rows) {
        const normalized = rows.slice(0, 8).map((value) => this.clampByte(value));
        while (normalized.length < 8) normalized.push(0);
        this.sendProtocol(this.protocol.instruction.ETC, [
            this.protocol.device.DOT_MATRIX,
            this.protocol.action.OUTPUT,
        ].concat(normalized));
    }

    frequencyToNote(frequency) {
        const hz = Math.max(1, Number(frequency) || 440);
        const midi = Math.max(0, Math.min(127, Math.round(69 + 12 * Math.log2(hz / 440))));
        const supportedNotes = [
            { semitone: 0, note: 1 },
            { semitone: 1, note: 8 },
            { semitone: 2, note: 2 },
            { semitone: 3, note: 9 },
            { semitone: 4, note: 3 },
            { semitone: 5, note: 4 },
            { semitone: 6, note: 10 },
            { semitone: 7, note: 5 },
            { semitone: 8, note: 11 },
            { semitone: 9, note: 6 },
            { semitone: 10, note: 12 },
            { semitone: 11, note: 7 },
        ];
        let closest = { distance: Infinity, octave: 4, note: 6 };
        for (let octave = 0; octave <= 8; octave++) {
            supportedNotes.forEach(({ semitone, note }) => {
                const noteMidi = (octave + 1) * 12 + semitone;
                const distance = Math.abs(noteMidi - midi);
                if (distance < closest.distance) {
                    closest = { distance, octave, note };
                }
            });
        }
        return (closest.octave << 4) | closest.note;
    }

    // 작품 정지 시 LED, 부저, 네오픽셀과 도트매트릭스를 안전하게 끈다.
    setZero() {
        this.sensorSubscriptions = {};
        this.digitalPortData = { 2: 1, 3: 1 };
        this.writePin(this.pins.LED, this.protocol.device.DIGITAL, 0);
        this.sendProtocol(this.pins.BUZZER, [
            this.protocol.device.BUZZER,
            this.protocol.action.STOP,
        ]);
        this.clearNeoPixel();
        this.sendDotMatrixRows(Array(8).fill(0));
    }

    // 블록 화면에 표시할 한국어와 영어 문구를 정의한다.
    setLanguage() {
        const dotTemplate = '8x8 도트매트릭스 LED 그리기 %1 %2';
        return {
            ko: {
                template: {
                    makeitall_led_title: 'LED',
                    makeitall_sensor_led: 'LED %1',
                    makeitall_sensor_led_brightness: 'LED 밝기 %1 출력 (0 ~ 255)',
                    makeitall_input_title: '입력',
                    makeitall_input: '%1 버튼 눌림 상태',
                    makeitall_piezobuzzer_title: '피에조 부저',
                    makeitall_sensor_piezobuzzer: '%1 음을 %2 박자 연주',
                    makeitall_sensor_morsedot: '모스부호 점 (.) 출력',
                    makeitall_sensor_morseline: '모스부호 선 (-) 출력',
                    makeitall_sensor_playmelody: '피에조부저 %1 (번째) 곡 %2초 (1~20) 연주',
                    makeitall_sensor_box: '%1',
                    makeitall_neo_title: '네오픽셀',
                    makeitall_neo_exression_rainbowcolor: '네오픽셀 LED 표정 %1을 %2로 출력',
                    makeitall_neo_expression_color: '네오픽셀 LED 표정 %1을 %2로 출력',
                    makeitall_neo_bitmap_rainbowcolor: '네오픽셀 LED 모양 %1을 %2로 출력',
                    makeitall_neo_bitmap_color: '네오픽셀 LED 모양 %1을 %2로 출력',
                    makeitall_neo_clear: '네오픽셀 LED 모두 끄기',
                    makeitall_dotmatrix_title: '도트매트릭스',
                    makeitall_dotmatrix_bitmap: dotTemplate,
                    makeitall_dotmatrix: '8x8 도트매트릭스 LED 그리기 %1',
                    makeitall_dotmatrix_clear: '8x8 도트매트릭스 지우기',
                },
            },
            en: {
                template: {
                    makeitall_led_title: 'LED',
                    makeitall_sensor_led: 'LED %1',
                    makeitall_sensor_led_brightness: 'LED brightness %1 (0-255)',
                    makeitall_input_title: 'Input',
                    makeitall_input: '%1 button pressed',
                    makeitall_piezobuzzer_title: 'Piezo buzzer',
                    makeitall_sensor_piezobuzzer: 'Play note %1 for %2 beats',
                    makeitall_sensor_morsedot: 'Play Morse dot (.)',
                    makeitall_sensor_morseline: 'Play Morse dash (-)',
                    makeitall_sensor_playmelody: 'Play buzzer song %1 for %2 seconds (1~20)',
                    makeitall_sensor_box: '%1',
                    makeitall_neo_title: 'NeoPixel',
                    makeitall_neo_exression_rainbowcolor: 'Show expression %1 in %2',
                    makeitall_neo_expression_color: 'Show expression %1 in %2',
                    makeitall_neo_bitmap_rainbowcolor: 'Show pattern %1 in %2',
                    makeitall_neo_bitmap_color: 'Show pattern %1 in %2',
                    makeitall_neo_clear: 'Clear all NeoPixel LEDs',
                    makeitall_dotmatrix_title: 'Dot matrix',
                    makeitall_dotmatrix_bitmap: 'Draw 8x8 dot matrix %1 %2',
                    makeitall_dotmatrix: 'Draw 8x8 dot matrix %1',
                    makeitall_dotmatrix_clear: 'Clear 8x8 dot matrix',
                },
            },
        };
    }

    ensureAnimalLedField() {
        if (Object.prototype.hasOwnProperty.call(Entry, 'FieldAnimalLed')) {
            return;
        }

        Object.defineProperty(Entry, 'FieldAnimalLed', {
            configurable: true,
            get() {
                const FieldAnimalLed = class FieldAnimalLed extends Entry.FieldLed2 {
                    constructor(content, blockView, index) {
                        super(content, blockView, index);

                        const { rows, columns } = content;
                        const currentValue = this.getValue();
                        const hasRequestedSize =
                            Array.isArray(currentValue) &&
                            currentValue.length === rows &&
                            currentValue.every(
                                (row) => Array.isArray(row) && row.length === columns
                            );

                        if (rows && columns && !hasRequestedSize) {
                            this.setValue(
                                Array.from({ length: rows }, () =>
                                    Array.from({ length: columns }, () => 0)
                                )
                            );
                            this.renderLed();
                        }
                    }

                    renderLed() {
                        const ledStatus = this.getValue();
                        const currentStatus = ledStatus.params || ledStatus;
                        const rowCount = currentStatus.length;
                        const columnCount = currentStatus.reduce(
                            (max, row) => Math.max(max, Array.isArray(row) ? row.length : 0),
                            0
                        );
                        const ledScale = 5 / Math.max(rowCount, columnCount, 5);
                        const ledDist = 3 * ledScale;
                        const ledOffset = 0.5 * ledScale;

                        (this._rect || []).forEach((row) =>
                            row.forEach((rect) => rect && rect.remove())
                        );
                        this._rect = Array.from({ length: rowCount }, () => []);

                        currentStatus.forEach((leds, row) => {
                            leds.forEach((led, column) => {
                                this._rect[row][column] = this.svgGroup.elem('rect', {
                                    x: column * ledDist + 4,
                                    y: row * ledDist - 8 + ledOffset,
                                    width: ledDist - ledOffset,
                                    height: ledDist - ledOffset,
                                    rx: 0.5,
                                    ry: 0.5,
                                    fill: led ? '#ffffff' : '#00b6b1',
                                });
                            });
                        });
                    }
                };

                Object.defineProperty(Entry, 'FieldAnimalLed', {
                    configurable: true,
                    writable: true,
                    value: FieldAnimalLed,
                });
                return FieldAnimalLed;
            },
        });
    }

    // 각 애니멀 키링 블록의 모양, 입력값과 실행 명령을 정의한다.
    getBlocks() {
        this.ensureAnimalLedField();
        const hardwareColor = EntryStatic.colorSet.block.default.HARDWARE;
        const hardwareDark = EntryStatic.colorSet.block.darken.HARDWARE;
        const indicator = { type: 'Indicator', img: 'block_icon/hardware_icon.svg', size: 12 };
        const dropdown = (options, value) => ({
            type: 'Dropdown', options, value, fontSize: 11, bgColor: hardwareDark,
            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
        });
        const basic = (className, params, def, paramsKeyMap, func) => ({
            color: hardwareColor,
            outerLine: hardwareDark,
            fontColor: '#ffffff',
            skeleton: 'basic',
            statements: [],
            params: params.concat(indicator),
            def,
            paramsKeyMap,
            isNotFor: ['ANIMALKEYRING'],
            class: className,
            func,
        });
        const title = (blockName, template, className) => ({
            skeleton: 'basic_text',
            color: EntryStatic.colorSet.common.TRANSPARENT,
            fontColor: '#333333',
            skeletonOptions: { contentPos: { x: 10, y: 10 } },
            params: [{ type: 'Text', text: template, color: '#333333', align: 'left' }],
            def: { type: blockName },
            isNotFor: ['ANIMALKEYRING'],
            class: className,
            fontSize: 22,
        });
        const colorOptions = [
            ['빨강', '#FF0000'], ['주황', '#FF7F00'], ['노랑', '#FFFF00'],
            ['초록', '#00C853'], ['파랑', '#0088FF'], ['보라', '#7E57C2'],
            ['검정', '#000000'], ['하양', '#FFFFFF'],
        ];
        const expressions = [
            ['기쁨', '1'],
            ['삐진', '2'],
            ['짜릿한', '3'],
            ['슬픈', '4'],
            ['놀란', '5'],
            ['졸린', '6'],
            ['웃는', '7'],
            ['멍한', '8'],
            ['속상한', '9'],
        ];
        const melodyIds = Entry.ANIMALKEYRING.protocol.melody;
        const melodyOptions = [
            ['곰 세 마리', melodyIds.THREE_BEARS],
            ['둥글게 둥글게', melodyIds.ROUND_AND_ROUND],
            ['산중호걸', melodyIds.MOUNTAIN_TIGER],
            ['루돌프 사슴코', melodyIds.RUDOLPH],
            ['작은 별', melodyIds.TWINKLE_TWINKLE],
            ['신나는', melodyIds.EXCITING],
            ['경쾌한', melodyIds.CHEERFUL],
            ['부드러운', melodyIds.SOFT],
            ['웅장한', melodyIds.GRAND],
            ['긴박한', melodyIds.URGENT],
        ];
        const buzzerSoundOptions = melodyOptions.map(([name, id]) => [
            `${id}.${name.replace(/ /g, '')}`,
            id,
        ]);
        const noteOptions = [
            ['도', '262'], ['도#', '277'], ['레', '294'], ['레#', '311'],
            ['미', '330'], ['파', '349'], ['파#', '370'], ['솔', '392'],
            ['솔#', '415'], ['라', '440'], ['라#', '466'], ['시', '494'],
        ];
        const dotIcons = [
            ['🖤', '01100110:11111111:11111111:11111111:11111111:01111110:00111100:00011000'],
            ['🤍', '01100110:10011001:10000001:10000001:01000010:00100100:00011000:00000000'],
            ['⭕', '00111100:01000010:10000001:10000001:10000001:10000001:01000010:00111100'],
            ['❌', '10000001:01000010:00100100:00011000:00011000:00100100:01000010:10000001'],
            ['👆', '00011000:00111100:01111110:11011011:00011000:00011000:00011000:00011000'],
            ['👇', '00011000:00011000:00011000:00011000:11011011:01111110:00111100:00011000'],
            ['👉', '00001000:00001100:11111110:11111111:11111111:11111110:00001100:00001000'],
            ['👈', '00010000:00110000:01111111:11111111:11111111:01111111:00110000:00010000'],
            ['😊', '00111100:01000010:10100101:10000001:10100101:10011001:01000010:00111100'],
            ['😢', '00111100:01000010:10100101:10000001:10011001:10100101:01000010:00111100'],
            ['😡', '00111100:01000010:10011001:10100101:10000001:10111101:01000010:00111100'],
            ['😆', '00111100:01000010:10100101:01011010:10000001:10100101:01011010:00111100'],
        ];
        const expressionRows = (expression) => {
            const patterns = [
                '101010101010', // 기쁨: 0, 2, 4, 6, 8, 10
                '111000111000', // 삐진: 0, 1, 2, 6, 7, 8
                '010101010101', // 짜릿한: 1, 3, 5, 7, 9, 11
                '010111010111', // 슬픈: 1, 3, 4, 5, 7, 9, 10, 11
                '111111111111', // 놀란: 0~11
                '111101111101', // 졸린: 0, 1, 2, 3, 5, 6, 7, 8, 9, 11
                '101111101111', // 웃는: 0, 2, 3, 4, 5, 6, 8, 9, 10, 11
                '110110011011', // 멍한: 0, 1, 3, 4, 7, 8, 10, 11
                '001110100011', // 속상한: 2, 3, 4, 6, 10, 11
            ];
            const index = Math.max(0, Math.min(patterns.length - 1, Number(expression) - 1));
            return [patterns[index]];
        };
        const paintNeoPattern = (rows, color) => {
            let ledIndex = 0;
            const colors = [];
            rows.forEach((row) => {
                String(row)
                    .split('')
                    .forEach((on) => {
                        if (ledIndex < Entry.ANIMALKEYRING.neopixelCount) {
                            colors.push({
                                index: ledIndex,
                                color: on === '1' ? color : '#000000',
                            });
                        }
                        ledIndex++;
                    });
            });
            Entry.ANIMALKEYRING.sendNeoPixelPattern(colors);
        };
        const paintNeoBitmap = (value, color) => {
            const colors = Entry.ANIMALKEYRING.led2FieldToPixels(value)
                .map((brightness, ledIndex) => ({
                    index: Entry.ANIMALKEYRING.neopixelOrder[ledIndex],
                    color: Entry.ANIMALKEYRING.scaleHexColor(color, brightness),
                }));
            Entry.ANIMALKEYRING.sendNeoPixelPattern(colors);
        };
        const playTone = (frequency, seconds) => {
            const duration = Math.max(
                0,
                Math.min(255, Math.round(Number(seconds) * 10) || 0)
            );
            Entry.ANIMALKEYRING.sendProtocol(Entry.ANIMALKEYRING.pins.BUZZER, [
                Entry.ANIMALKEYRING.protocol.device.BUZZER,
                duration ? Entry.ANIMALKEYRING.frequencyToNote(frequency) : 0,
                duration,
            ]);
        };

        return {
            // 일반 LED 블록 구분 제목
            makeitall_led_title: title('makeitall_led_title', Lang.template.makeitall_led_title, 'led'),
            // 일반 LED를 켜거나 끄는 블록
            makeitall_sensor_led: basic('led', [dropdown([['켜기', '1'], ['끄기', '0']], '0')],
                { params: ['1'], type: 'makeitall_sensor_led' }, { VALUE: 0 },
                (sprite, script) => {
                    Entry.ANIMALKEYRING.writePin(Entry.ANIMALKEYRING.pins.LED,
                        Entry.ANIMALKEYRING.protocol.device.DIGITAL, script.getField('VALUE', script));
                    return script.callReturn();
                }),
            // PWM 값으로 일반 LED 밝기를 조절하는 블록
            makeitall_sensor_led_brightness: basic('led', [{ type: 'Block', accept: 'string', value: '128' }],
                { params: ['128'], type: 'makeitall_sensor_led_brightness' }, { VALUE: 0 },
                (sprite, script) => {
                    Entry.ANIMALKEYRING.writePin(Entry.ANIMALKEYRING.pins.LED,
                        Entry.ANIMALKEYRING.protocol.device.ANALOG, script.getNumberValue('VALUE', script));
                    return script.callReturn();
                }),

            // 버튼 입력 블록 구분 제목
            makeitall_input_title: title('makeitall_input_title', Lang.template.makeitall_input_title, 'input'),
            // 왼쪽 또는 오른쪽 버튼의 눌림 상태를 읽는 블록
            makeitall_input: Object.assign(basic('input', [dropdown([['왼쪽', '3'], ['오른쪽', '2']], '3')],
                { params: ['3'], type: 'makeitall_input' }, { PIN: 0 },
                (sprite, script) => {
                    const pin = script.getField('PIN', script);
                    Entry.ANIMALKEYRING.subscribeDigital(pin);
                    const value = Entry.ANIMALKEYRING.getDigitalPortValue(pin);
                    if (value !== undefined) return value;
                    return 0;
                }), { skeleton: 'basic_string_field' }),

            // 피에조 부저 블록 구분 제목
            makeitall_piezobuzzer_title: title('makeitall_piezobuzzer_title', Lang.template.makeitall_piezobuzzer_title, 'buzzer'),
            // 지정한 음을 설정한 박자 동안 연주하는 블록
            makeitall_sensor_piezobuzzer: basic('buzzer', [
                dropdown(noteOptions, '262'),
                { type: 'Block', accept: 'string', value: '0.3' },
            ], { params: ['262', '0.3'], type: 'makeitall_sensor_piezobuzzer' }, { HZ: 0, BEATS: 1 },
            (sprite, script) => {
                playTone(script.getNumberValue('HZ', script), script.getNumberValue('BEATS', script));
                return script.callReturn();
            }),
            // 짧은 모스부호 점 소리를 출력하는 블록
            makeitall_sensor_morsedot: basic('buzzer', [], { type: 'makeitall_sensor_morsedot' }, {},
                (sprite, script) => { playTone(800, 0.1); return script.callReturn(); }),
            // 긴 모스부호 선 소리를 출력하는 블록
            makeitall_sensor_morseline: basic('buzzer', [], { type: 'makeitall_sensor_morseline' }, {},
                (sprite, script) => { playTone(800, 0.3); return script.callReturn(); }),
            // 내장 멜로디를 지정한 시간 동안 재생하는 블록
            makeitall_sensor_playmelody: basic('buzzer', [
                { type: 'Block', accept: 'string', value: String(melodyIds.THREE_BEARS) },
                { type: 'Block', accept: 'string', value: '1' }],
            { params: [melodyIds.THREE_BEARS, '1'], type: 'makeitall_sensor_playmelody' },
            { MELODY: 0, DURATION: 1 },
            (sprite, script) => {
                if (!script.isStart) {
                    const melody = Math.max(
                        melodyIds.THREE_BEARS,
                        Math.min(
                            melodyIds.URGENT,
                            Math.round(script.getNumberValue('MELODY', script)) ||
                                melodyIds.THREE_BEARS
                        )
                    );
                    const duration = Math.max(
                        1,
                        Math.min(20, Math.round(script.getNumberValue('DURATION', script)) || 1)
                    );
                    script.isStart = true;
                    script.startedAt = Date.now();
                    script.duration = duration * 1000;
                    Entry.ANIMALKEYRING.sendProtocol(Entry.ANIMALKEYRING.pins.BUZZER, [
                        Entry.ANIMALKEYRING.protocol.device.BUZZER,
                        Entry.ANIMALKEYRING.protocol.action.PLAY_MELODY,
                        melody,
                        duration,
                    ]);
                    return script;
                }
                if (Date.now() - script.startedAt < script.duration) {
                    return script;
                }
                Entry.ANIMALKEYRING.sendProtocol(Entry.ANIMALKEYRING.pins.BUZZER, [
                    Entry.ANIMALKEYRING.protocol.device.BUZZER,
                    Entry.ANIMALKEYRING.protocol.action.STOP,
                ]);
                Entry.ANIMALKEYRING.subscribeDigital(2);
                Entry.ANIMALKEYRING.subscribeDigital(3);
                delete script.isStart;
                delete script.startedAt;
                delete script.duration;
                return script.callReturn();
            }),
            // 선택한 내장 소리 번호를 값으로 돌려주는 블록
            makeitall_sensor_box: Object.assign(basic('buzzer', [
                dropdown(buzzerSoundOptions, melodyIds.THREE_BEARS),
            ],
                { params: [melodyIds.THREE_BEARS], type: 'makeitall_sensor_box' }, { VALUE: 0 },
                (sprite, script) => script.getField('VALUE', script)), { skeleton: 'basic_string_field' }),

            // 네오픽셀 블록 구분 제목
            makeitall_neo_title: title('makeitall_neo_title', Lang.template.makeitall_neo_title, 'neopixel'),
            // 표정 모양을 색상 선택기로 출력하는 블록
            makeitall_neo_exression_rainbowcolor: basic('neopixel', [dropdown(expressions, '1'), { type: 'Color' }],
                { params: ['1', null], type: 'makeitall_neo_exression_rainbowcolor' }, { EXPRESSION: 0, COLOR: 1 },
                (sprite, script) => {
                    paintNeoPattern(expressionRows(script.getField('EXPRESSION', script)), script.getStringField('COLOR', script));
                    return script.callReturn();
                }),
            // 표정 모양을 미리 정의된 색상으로 출력하는 블록
            makeitall_neo_expression_color: basic('neopixel', [dropdown(expressions, '1'), dropdown(colorOptions, '#FF0000')],
                { params: ['1', '#FF0000'], type: 'makeitall_neo_expression_color' }, { EXPRESSION: 0, COLOR: 1 },
                (sprite, script) => {
                    paintNeoPattern(expressionRows(script.getField('EXPRESSION', script)), script.getField('COLOR', script));
                    return script.callReturn();
                }),
            // 12개 LED의 개별 밝기 모양을 색상 선택기로 출력하는 블록
            makeitall_neo_bitmap_rainbowcolor: basic('neopixel', [
                { type: 'AnimalLed', rows: 6, columns: 2 },
                { type: 'Color' },
            ],
                { params: [Entry.ANIMALKEYRING.neopixelDefaultLed, null], type: 'makeitall_neo_bitmap_rainbowcolor' },
                { VALUE: 0, COLOR: 1 }, (sprite, script) => {
                    paintNeoBitmap(
                        script.getField('VALUE'),
                        script.getStringField('COLOR')
                    );
                    return script.callReturn();
                }),
            // 12개 LED의 개별 밝기 모양을 미리 정의된 색상으로 출력하는 블록
            makeitall_neo_bitmap_color: basic('neopixel', [
                { type: 'AnimalLed', rows: 6, columns: 2 },
                dropdown(colorOptions, '#FF0000'),
            ],
                { params: [Entry.ANIMALKEYRING.neopixelDefaultLed, '#FF0000'], type: 'makeitall_neo_bitmap_color' },
                { VALUE: 0, COLOR: 1 }, (sprite, script) => {
                    paintNeoBitmap(
                        script.getField('VALUE'),
                        script.getField('COLOR')
                    );
                    return script.callReturn();
                }),
            // 모든 네오픽셀 LED를 끄는 블록
            makeitall_neo_clear: basic('neopixel', [], { type: 'makeitall_neo_clear' }, {},
                (sprite, script) => { Entry.ANIMALKEYRING.clearNeoPixel(); return script.callReturn(); }),

            // 도트매트릭스 블록 구분 제목
            makeitall_dotmatrix_title: title('makeitall_dotmatrix_title', Lang.template.makeitall_dotmatrix_title, 'dotmatrix'),
            // 사용자가 그린 8x8 비트맵을 출력하는 블록
            makeitall_dotmatrix_bitmap: basic('dotmatrix', [
                { type: 'AnimalLed', rows: 8, columns: 8 },
                { type: 'Color' },
            ],
                { params: [Entry.ANIMALKEYRING.dotMatrixDefaultLed, null], type: 'makeitall_dotmatrix_bitmap' },
                { VALUE: 0, COLOR: 1 }, (sprite, script) => {
                    const bitmap = script.getField('VALUE');
                    Entry.ANIMALKEYRING.sendDotMatrixRows(
                        Entry.ANIMALKEYRING.ledFieldToRows(bitmap, 8)
                    );
                    return script.callReturn();
                }),
            // 미리 정의된 8x8 아이콘을 출력하는 블록
            makeitall_dotmatrix: basic('dotmatrix', [dropdown(dotIcons, dotIcons[0][1])],
                { params: [dotIcons[0][1]], type: 'makeitall_dotmatrix' }, { VALUE: 0 },
                (sprite, script) => {
                    Entry.ANIMALKEYRING.sendDotMatrixRows(Entry.ANIMALKEYRING.patternStringToRows(script.getField('VALUE', script)));
                    return script.callReturn();
                }),
            // 8x8 도트매트릭스 화면을 지우는 블록
            makeitall_dotmatrix_clear: basic('dotmatrix', [], { type: 'makeitall_dotmatrix_clear' }, {},
                (sprite, script) => {
                    Entry.ANIMALKEYRING.sendDotMatrixRows(Array(8).fill(0));
                    return script.callReturn();
                }),
        };
    }
})();

module.exports = Entry.ANIMALKEYRING;
