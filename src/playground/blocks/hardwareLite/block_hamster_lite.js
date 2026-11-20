'use strict';

(function() {
    // 연결 시 정체 라인(FF01) 대기 상한. 페어링된 동글은 ms 단위로 응답하므로 5초면 충분.
    const HANDSHAKE_TIMEOUT_MS = 5000;

    // 사운드 번호(__SOUNDS 값) -> 로봇이 받는 사운드 ID 바이트.
    // 출처: entry-hw/app/modules/hamster_s.js 의 switch(motoring.sound). 연속 값이 아니라
    // 표로 옮긴다. 번호와 ID 사이에 규칙이 없으므로 계산으로 유도하면 틀린다.
    const SOUND_TO_ID = {
        1: 0x01, // BEEP
        2: 0x05, // RANDOM_BEEP
        3: 0x09, // SIREN
        4: 0x0b, // ENGINE
        5: 0x20, // ROBOT
        6: 0x34, // MARCH
        7: 0x35, // BIRTHDAY
        8: 0x21, // DIBIDIBIDIP
        9: 0x23, // GOOD_JOB
        10: 0x07, // NOISE
        11: 0x12, // CHOP
        12: 0x30, // HAPPY
        13: 0x31, // ANGRY
        14: 0x32, // SAD
        15: 0x33, // SLEEP
    };

    // 단위 이동 환산 상수. 출처: entry-hw/app/modules/hamster_s.js 의 HamsterS 상수.
    // 로봇 하드웨어에서 측정한 값이라 유도하지 말고 그대로 옮긴다.
    const CM_TO_PULSE = 138.2666;
    const DEG_TO_PULSE = 4.039;
    const DEG_TO_PULSE_PIVOT = 8.047;
    const DEFAULT_SPEED = 30;
    // 펜과 선회용. 바퀴 중심과 펜 위치까지의 거리(cm).
    const WHEEL_CENTER_DISTANCE = 1.636;
    const PEN_CENTER_DISTANCE = 2.462;

    // 시리얼 송수신 큐. 설치형 block_robomation.js 의 RoboidWriteQueue / RoboidReadQueue 를 그대로 옮겼다.
    // 글자를 UTF-8 바이트로 바꿔 18바이트씩 끊어 보내고, 받은 조각을 모아 구분자에서 글자로 되돌린다.
    // 크기는 2의 거듭제곱이어야 한다(mask 로 감는다). 가득 차면 가장 오래된 바이트를 버린다.
    class SerialWriteQueue {
        constructor(size) {
            this.buffer = new Array(size);
            this.mask = size - 1;
            this.provider = 0;
            this.consumer = 0;
            this.output = new Array(19);
        }

        reset() {
            this.provider = 0;
            this.consumer = 0;
        }

        // 출처: google closure-library goog/crypt/crypt.js 의 stringToUtf8ByteArray (설치형과 같은 구현)
        stringToUtf8ByteArray(str) {
            const out = [];
            let p = 0;
            let c;
            for (let i = 0; i < str.length; i++) {
                c = str.charCodeAt(i);
                if (c < 128) {
                    out[p++] = c;
                } else if (c < 2048) {
                    out[p++] = (c >> 6) | 192;
                    out[p++] = (c & 63) | 128;
                } else if (
                    (c & 0xfc00) == 0xd800 &&
                    i + 1 < str.length &&
                    (str.charCodeAt(i + 1) & 0xfc00) == 0xdc00
                ) {
                    c = 0x10000 + ((c & 0x03ff) << 10) + (str.charCodeAt(++i) & 0x03ff);
                    out[p++] = (c >> 18) | 240;
                    out[p++] = ((c >> 12) & 63) | 128;
                    out[p++] = ((c >> 6) & 63) | 128;
                    out[p++] = (c & 63) | 128;
                } else {
                    out[p++] = (c >> 12) | 224;
                    out[p++] = ((c >> 6) & 63) | 128;
                    out[p++] = (c & 63) | 128;
                }
            }
            return out;
        }

        push(str, line) {
            const buffer = this.buffer;
            const mask = this.mask;
            let provider = this.provider;
            let consumer = this.consumer;
            if (str.length > 0) {
                const out = this.stringToUtf8ByteArray(str);
                for (let i = 0; i < out.length; ++i) {
                    if (((provider - consumer) & mask) == mask) {
                        consumer = (consumer + 1) & mask;
                    }
                    buffer[provider] = out[i];
                    provider = (provider + 1) & mask;
                }
            }
            if (line) {
                if (((provider - consumer) & mask) == mask) {
                    consumer = (consumer + 1) & mask;
                }
                buffer[provider] = 0x0d;
                provider = (provider + 1) & mask;
            }
            this.provider = provider;
            this.consumer = consumer;
        }

        pop() {
            const provider = this.provider;
            let consumer = this.consumer;
            if (provider == consumer) {
                return undefined;
            }
            const buffer = this.buffer;
            const mask = this.mask;
            const output = this.output;
            let len = (provider - consumer) & mask;
            if (len > 18) {
                len = 18;
            }
            output[0] = len;
            let i = 1;
            for (; i <= len && consumer != provider; ++i) {
                output[i] = buffer[consumer];
                consumer = (consumer + 1) & mask;
            }
            for (; i <= 18; ++i) {
                output[i] = 0;
            }
            this.consumer = consumer;
            return output;
        }
    }

    class SerialReadQueue {
        constructor(size) {
            this.buffer = new Array(size);
            this.mask = size - 1;
            this.provider = 0;
            this.consumer = 0;
        }

        reset() {
            this.provider = 0;
            this.consumer = 0;
        }

        utf8ByteArrayToString(bytes, start, end) {
            let current = start;
            const mask = this.mask;
            const out = [];
            let c = 0;
            let c1;
            let c2;
            let c3;
            let c4;
            let u;
            while (current != end) {
                c1 = bytes[current];
                current = (current + 1) & mask;
                if (c1 < 128) {
                    out[c++] = String.fromCharCode(c1);
                } else if (c1 > 191 && c1 < 224) {
                    if (current == end) {
                        break;
                    }
                    c2 = bytes[current];
                    current = (current + 1) & mask;
                    out[c++] = String.fromCharCode(((c1 & 31) << 6) | (c2 & 63));
                } else if (c1 > 239 && c1 < 365) {
                    if (current == end) {
                        break;
                    }
                    c2 = bytes[current];
                    current = (current + 1) & mask;
                    if (current == end) {
                        break;
                    }
                    c3 = bytes[current];
                    current = (current + 1) & mask;
                    if (current == end) {
                        break;
                    }
                    c4 = bytes[current];
                    current = (current + 1) & mask;
                    u =
                        (((c1 & 7) << 18) | ((c2 & 63) << 12) | ((c3 & 63) << 6) | (c4 & 63)) -
                        0x10000;
                    out[c++] = String.fromCharCode(0xd800 + (u >> 10));
                    out[c++] = String.fromCharCode(0xdc00 + (u & 1023));
                } else {
                    if (current == end) {
                        break;
                    }
                    c2 = bytes[current];
                    current = (current + 1) & mask;
                    if (current == end) {
                        break;
                    }
                    c3 = bytes[current];
                    current = (current + 1) & mask;
                    out[c++] = String.fromCharCode(
                        ((c1 & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63)
                    );
                }
            }
            this.consumer = current;
            return out.join('');
        }

        push(packet, offset) {
            let len = packet[offset];
            if (len > 0) {
                if (len > 18) {
                    len = 18;
                }
                const buffer = this.buffer;
                const mask = this.mask;
                let provider = this.provider;
                let consumer = this.consumer;
                const end = len + offset;
                for (let i = 1 + offset; i <= end; ++i) {
                    if (((provider - consumer) & mask) == mask) {
                        consumer = (consumer + 1) & mask;
                    }
                    buffer[provider] = packet[i];
                    provider = (provider + 1) & mask;
                }
                this.provider = provider;
                this.consumer = consumer;
            }
        }

        pop(delimiter) {
            const provider = this.provider;
            let consumer = this.consumer;
            if (provider == consumer) {
                return undefined;
            }
            if (delimiter == 0) {
                return this.utf8ByteArrayToString(this.buffer, consumer, provider);
            }
            const buffer = this.buffer;
            const mask = this.mask;
            let found = -1;
            while (consumer != provider) {
                if (buffer[consumer] == delimiter) {
                    found = consumer;
                    break;
                }
                consumer = (consumer + 1) & mask;
            }
            if (found >= 0) {
                const str = this.utf8ByteArrayToString(buffer, this.consumer, found);
                this.consumer = (this.consumer + 1) & mask;
                return str;
            }
            return undefined;
        }
    }

    // 시리얼 블록의 선택지 -> 로봇 값.
    // 출처: block_robomation.js HamsterSRobot.__SERIAL_DELIMITERS / __SERIAL_BAUDS.
    const SERIAL_DELIMITERS = {
        ALL: 0,
        COMMA: 0x2c,
        COLON: 0x3a,
        DOLLAR: 0x24,
        SHARP: 0x23,
        NEW_LINE: 0x0d,
    };
    const SERIAL_BAUDS = {
        9600: 176,
        14400: 177,
        19200: 178,
        28800: 179,
        38400: 180,
        57600: 181,
        76800: 182,
        115200: 183,
    };

    // 선 따라가기 속도 -> 기본 방향 변화량. 출처: block_robomation.js HamsterSRobot.__GAINS.
    // 구형 speedToGain 과 1..8 에서 같은 값이다(9 와 10 은 햄스터S 블록이 만들지 않는다).
    const LINE_TRACER_GAINS = { 1: 6, 2: 6, 3: 5, 4: 5, 5: 4, 6: 4, 7: 3, 8: 3 };

    // entry-hw 가 받은 motoring 값을 자르는 범위. handleRemoteData 의 if(t < a) t = a; else if(t > b)
    // t = b; 를 그대로 옮겼다(NaN 은 두 비교를 모두 통과해 그대로 남는 것까지 같다).
    // 구형 항목 = hamster.js, 햄스터S 항목 = hamster_s.js. 두 모듈의 범위가 다르다(버저 등).
    const OLD_CLAMPS = {
        leftWheel: [-100, 100],
        rightWheel: [-100, 100],
        buzzer: [0, 167772.15],
        outputA: [0, 255],
        outputB: [0, 255],
        topology: [0, 15],
        leftLed: [0, 7],
        rightLed: [0, 7],
        note: [0, 88],
        lineTracerMode: [0, 15],
        lineTracerSpeed: [1, 8],
        ioModeA: [0, 15],
        ioModeB: [0, 15],
        configProximity: [1, 7],
        configGravity: [0, 3],
        configBandWidth: [1, 8],
    };
    const S_CLAMPS = {
        leftWheel: [-100, 100],
        rightWheel: [-100, 100],
        leftRed: [0, 255],
        leftGreen: [0, 255],
        leftBlue: [0, 255],
        rightRed: [0, 255],
        rightGreen: [0, 255],
        rightBlue: [0, 255],
        buzzer: [0, 6500.0],
        outputA: [0, 255],
        outputB: [0, 255],
        pulse: [0, 65535],
        note: [0, 88],
        lineTracerMode: [0, 15],
        lineTracerGain: [1, 10],
        lineTracerSpeed: [1, 10],
        ioModeA: [0, 255],
        ioModeB: [0, 255],
        motionUnit: [0, 3],
        motionSpeed: [0, 100],
        motionValue: [0, 2147483647],
        motionRadius: [0, 2147483647],
        motionType: [0, 24],
    };
    function clampFields(src, table) {
        const out = Object.assign({}, src);
        Object.keys(table).forEach((k) => {
            const [lo, hi] = table[k];
            const t = out[k];
            if (t < lo) {
                out[k] = lo;
            } else if (t > hi) {
                out[k] = hi;
            }
        });
        return out;
    }

    // 단위 드롭다운 값 -> 내부 단위 번호. CM 과 DEG 는 같은 1번(블록이 어느 쪽인지 안다).
    const MOTION_UNITS = { CM: 1, DEG: 1, SEC: 2, PULSE: 3 };

    const COLOR_TO_RGB = [
        [0, 0, 0],
        [0, 0, 255],
        [0, 255, 0],
        [0, 255, 255],
        [255, 0, 0],
        [255, 0, 255],
        [255, 255, 0],
        [255, 255, 255],
    ];

    // 블록 정의 표를 두 인스턴스가 공유하므로, 어느 인스턴스를 구동할지는
    // 등록 시점이 아니라 호출 시점에 정해야 한다.
    // 햄스터S 전용 문구. setLanguage()를 재정의하면 기존 항목이 실행하는 공유 메서드가
    // diff에 들어가고, 채우지 않은 로케일은 빈 토스트가 된다(로케일은 ko/en/jp/vn 넷).
    const S_MSGS = {
        ko: {
            rejectTitle: '햄스터S가 아닙니다',
            rejectDesc:
                '이 항목은 햄스터S 전용입니다. 구형 햄스터는 목록에서 "햄스터"를 선택해 주세요. 다시 연결할 때 포트를 한 번 더 선택해야 합니다.',
            foreignTitle: '다른 로봇이 연결되었습니다',
            foreignDesc:
                '햄스터S가 아닌 로봇이 연결되었습니다. 이 항목에서는 이 로봇을 제어할 수 없습니다. 연결을 끊고 햄스터S를 연결하거나, 목록에서 "햄스터"를 선택해 주세요.',
        },
        en: {
            rejectTitle: 'Not a Hamster S',
            rejectDesc:
                'This entry is for Hamster S only. For the older Hamster, choose "Hamster" from the list. You will need to pick the port again when reconnecting.',
            foreignTitle: 'A different robot is connected',
            foreignDesc:
                'A robot other than Hamster S is connected. This entry cannot control it. Disconnect and connect a Hamster S, or choose "Hamster" from the list.',
        },
        jp: {
            rejectTitle: 'ハムスターSではありません',
            rejectDesc:
                'この項目はハムスターS専用です。旧型ハムスターは一覧から「ハムスター」を選んでください。再接続の際はポートをもう一度選択する必要があります。',
            foreignTitle: '別のロボットが接続されました',
            foreignDesc:
                'ハムスターS以外のロボットが接続されています。この項目ではこのロボットを制御できません。接続を切ってハムスターSを接続するか、一覧から「ハムスター」を選んでください。',
        },
        vn: {
            rejectTitle: 'Đây không phải Hamster S',
            rejectDesc:
                'Mục này chỉ dành cho Hamster S. Với Hamster đời cũ, hãy chọn "Hamster" trong danh sách. Khi kết nối lại, bạn cần chọn cổng một lần nữa.',
            foreignTitle: 'Đã kết nối một robot khác',
            foreignDesc:
                'Một robot không phải Hamster S đang được kết nối. Mục này không thể điều khiển nó. Hãy ngắt kết nối và kết nối Hamster S, hoặc chọn "Hamster" trong danh sách.',
        },
    };

    // Entry.hwLite.hwModule은 연결 상태가 아니라 "현재 선택된 모듈"이다(모듈 추가 시점에
    // 설정되고 해제 시 null). 선택된 것이 없거나 타사 모듈이면 기존 인스턴스로 떨어뜨려
    // 블록이 예외 대신 0/false를 돌려주게 한다. 이 폴백이 헬퍼의 존재 이유다.
    // 알려진 제약: 실제 송수신과 완료 콜백은 커넥터가 생성 시점에 붙잡아 둔 모듈을 쓴다.
    // 연결 중 모듈을 다시 추가하면 이전 커넥터가 정리되지 않아 둘이 어긋날 수 있다(코어 결함).
    function activeHamster() {
        const m = Entry.hwLite && Entry.hwLite.hwModule;
        return m === Entry.HamsterLite || m === Entry.HamsterSLite ? m : Entry.HamsterLite;
    }

    class HamsterLite {
        constructor() {
            this.id = '020401';
            this.url = 'http://www.robomation.net';
            this.imageName = 'hamsterlite.png';
            this.name = 'HamsterLite';
            this.delimeter = '\r';
            this.blockMenuBlocks = [
                'hamsterlite_hand_found',
                'hamsterlite_boolean',
                'hamsterlite_value',
                'hamsterlite_move_forward_once',
                'hamsterlite_turn_once',
                'hamsterlite_move_forward_for_secs',
                'hamsterlite_move_backward_for_secs',
                'hamsterlite_turn_for_secs',
                'hamsterlite_change_both_wheels_by',
                'hamsterlite_set_both_wheels_to',
                'hamsterlite_change_wheel_by',
                'hamsterlite_set_wheel_to',
                'hamsterlite_follow_line_using',
                'hamsterlite_follow_line_until',
                'hamsterlite_set_following_speed_to',
                'hamsterlite_stop',
                'hamsterlite_set_led_to',
                'hamsterlite_clear_led',
                'hamsterlite_beep',
                'hamsterlite_change_buzzer_by',
                'hamsterlite_set_buzzer_to',
                'hamsterlite_clear_buzzer',
                'hamsterlite_play_note',
                'hamsterlite_play_note_for',
                'hamsterlite_rest_for',
                'hamsterlite_change_tempo_by',
                'hamsterlite_set_tempo_to',
                'hamsterlite_set_port_to',
                'hamsterlite_change_output_by',
                'hamsterlite_set_output_to',
                'hamsterlite_gripper',
                'hamsterlite_release_gripper',
            ];
            this.__SENSORS = {
                SIGNAL_STRENGTH: 'signalStrength',
                LEFT_PROXIMITY: 'leftProximity',
                RIGHT_PROXIMITY: 'rightProximity',
                LEFT_FLOOR: 'leftFloor',
                RIGHT_FLOOR: 'rightFloor',
                ACCELERATION_X: 'accelerationX',
                ACCELERATION_Y: 'accelerationY',
                ACCELERATION_Z: 'accelerationZ',
                LIGHT: 'light',
                TEMPERATURE: 'temperature',
                INPUT_A: 'inputA',
                INPUT_B: 'inputB',
            };
            this.__COLORS = {
                RED: 4,
                ORANGE: 4,
                YELLOW: 6,
                GREEN: 2,
                SKY_BLUE: 3,
                BLUE: 1,
                VIOLET: 5,
                PURPLE: 5,
                WHITE: 7,
                4: 4,
                6: 6,
                2: 2,
                3: 3,
                1: 1,
                5: 5,
                7: 7,
            };
            this.__RGB_COLORS = {
                RED: [255, 0, 0],
                ORANGE: [255, 63, 0],
                YELLOW: [255, 255, 0],
                GREEN: [0, 255, 0],
                SKY_BLUE: [0, 255, 255],
                BLUE: [0, 0, 255],
                VIOLET: [63, 0, 255],
                PURPLE: [255, 0, 255],
                WHITE: [255, 255, 255],
                4: [255, 0, 0],
                6: [255, 255, 0],
                2: [0, 255, 0],
                3: [0, 255, 255],
                1: [0, 0, 255],
                5: [255, 0, 255],
                7: [255, 255, 255],
            };
            this.__NOTES = {
                C: 4,
                'C#': 5,
                Db: 5,
                D: 6,
                'D#': 7,
                Eb: 7,
                E: 8,
                F: 9,
                'F#': 10,
                Gb: 10,
                G: 11,
                'G#': 12,
                Ab: 12,
                A: 13,
                'A#': 14,
                Bb: 14,
                B: 15,
                4: 4,
                5: 5,
                6: 6,
                7: 7,
                8: 8,
                9: 9,
                10: 10,
                11: 11,
                12: 12,
                13: 13,
                14: 14,
                15: 15,
            };
            this.__IO_MODES = {
                ANALOG_INPUT: 0,
                DIGITAL_INPUT: 1,
                DIGITAL_INPUT_PULL_UP: 2,
                DIGITAL_INPUT_PULL_DOWN: 3,
                VOLTAGE_INPUT: 5,
                SERVO_OUTPUT: 8,
                PWM_OUTPUT: 9,
                DIGITAL_OUTPUT: 10,
                0: 0,
                1: 1,
                2: 2,
                3: 3,
                5: 5,
                8: 8,
                9: 9,
                10: 10,
            };
            this.portData = {
                baudRate: 115200,
                dataBits: 8,
                parity: 'none',
                stopBits: 1,
                connectionType: 'bytestream',
                bufferSize: 65536,
                constantServing: true,
                writeAscii: false,
                readAscii: true,
                flowControl: 'hardware',
            };
            this.handshakeTimeoutMs = HANDSHAKE_TIMEOUT_MS;
            this.setZero();
        }

        get monitorTemplate() {
            return {
                // 인스턴스에서 파생한다. 게터 형태는 반드시 유지할 것:
                // 코어가 이 객체에 쓰는 값들이 버려지는 현재 동작이 여기에 의존한다.
                imgPath: `hw_lite/${this.imageName}`,
                // 센서 점 좌표는 이 게터에 하드코딩돼 있고, 오른쪽을 향한 구형 사진 기준이다.
                // 좌표는 256 좌표계의 절대 위치이며(hardwareMonitor가 사진을 256으로 늘려 그린다),
                // 사진 크기와 무관하다.
                // 햄스터S 사진은 좌우가 반대이므로(바퀴가 왼쪽) 이 좌표를 쓸 수 없다.
                // HamsterSLite가 이 게터를 물려받아 위치만 갈아끼운다.
                width: 256,
                height: 256,
                listPorts: {
                    temperature: {
                        name: Lang.Blocks.hamsterlite_sensor_temperature,
                        type: 'input',
                        pos: { x: 0, y: 0 },
                    },
                    inputA: {
                        name: Lang.Blocks.hamsterlite_sensor_input_a,
                        type: 'input',
                        pos: { x: 0, y: 0 },
                    },
                    inputB: {
                        name: Lang.Blocks.hamsterlite_sensor_input_b,
                        type: 'input',
                        pos: { x: 0, y: 0 },
                    },
                    accelerationX: {
                        name: Lang.Blocks.hamsterlite_sensor_acceleration_x,
                        type: 'input',
                        pos: { x: 0, y: 0 },
                    },
                    accelerationY: {
                        name: Lang.Blocks.hamsterlite_sensor_acceleration_y,
                        type: 'input',
                        pos: { x: 0, y: 0 },
                    },
                    accelerationZ: {
                        name: Lang.Blocks.hamsterlite_sensor_acceleration_z,
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
                        name: Lang.Blocks.hamsterlite_sensor_left_proximity,
                        type: 'input',
                        pos: { x: 122, y: 156 },
                    },
                    rightProximity: {
                        name: Lang.Blocks.hamsterlite_sensor_right_proximity,
                        type: 'input',
                        pos: { x: 10, y: 108 },
                    },
                    leftFloor: {
                        name: Lang.Blocks.hamsterlite_sensor_left_floor,
                        type: 'input',
                        pos: { x: 100, y: 234 },
                    },
                    rightFloor: {
                        name: Lang.Blocks.hamsterlite_sensor_right_floor,
                        type: 'input',
                        pos: { x: 13, y: 180 },
                    },
                    light: {
                        name: Lang.Blocks.hamsterlite_sensor_light,
                        type: 'input',
                        pos: { x: 56, y: 189 },
                    },
                    leftWheel: {
                        name: Lang.Hw.leftWheel,
                        type: 'output',
                        pos: { x: 209, y: 115 },
                    },
                    rightWheel: {
                        name: Lang.Hw.rightWheel,
                        type: 'output',
                        pos: { x: 98, y: 30 },
                    },
                    leftLed: {
                        name: `${Lang.Hw.left} ${Lang.Hw.led_en}`,
                        type: 'output',
                        pos: { x: 87, y: 210 },
                    },
                    rightLed: {
                        name: `${Lang.Hw.right} ${Lang.Hw.led_en}`,
                        type: 'output',
                        pos: { x: 24, y: 168 },
                    },
                },
                mode: 'both',
            };
        }

        // 정지: 상태를 되돌리고 정지 패킷을 곧바로 한 번 보낸다.
        setZero() {
            this.__resetState();
            if (Entry.hwLite && Entry.hwLite.serial) {
                Entry.hwLite.serial.update();
            }
        }

        // 보내지 않고 상태만 되돌린다. 연결 시작(initialHandshake)도 이것을 쓴다. 코어는 핸드셰이크
        // 전에 연결 상태를 켜므로, 거기서 setZero 를 부르면 핸드셰이크 도중에 모터 패킷이 나간다.
        __resetState() {
            // 아래에서 새로 만드는 프로토콜 상태 중 카운터만 끝에서 되살린다(생성자 첫 호출엔 없다).
            const prev = {
                wheel: this.wheel,
                sound: this.sound,
                lineTracer: this.lineTracer,
                tapEvent: this.tapEvent,
                battery: this.battery,
                batteryState: this.sensory && this.sensory.batteryState,
            };
            this.sensory = {
                signalStrength: 0,
                leftProximity: 0,
                rightProximity: 0,
                leftFloor: 0,
                rightFloor: 0,
                accelerationX: 0,
                accelerationY: 0,
                accelerationZ: 0,
                light: 0,
                temperature: 0,
                inputA: 0,
                inputB: 0,
                tilt: 0,
                batteryState: 2,
                lineTracerState: 0,
                lineTracerStateId: 0,
                batterytate: 2,
            };
            this.motoring = {
                leftWheel: 0,
                rightWheel: 0,
                buzzer: 0,
                outputA: 0,
                outputB: 0,
                topology: 0,
                leftLed: 0,
                rightLed: 0,
                // 햄스터S 전용. 구형은 팔레트 번호(leftLed/rightLed) 한 바이트를 쓰지만
                // 햄스터S 패킷은 RGB 여섯 바이트를 직접 싣는다. 설치형 HamsterSRobot 과 같은 모델.
                leftRed: 0,
                leftGreen: 0,
                leftBlue: 0,
                rightRed: 0,
                rightGreen: 0,
                rightBlue: 0,
                // 햄스터S 전용. 여기 선언해 두지 않으면 setZero 뒤 undefined 로 남아
                // "정지 직후 sound 는 0" 이라는 불변식이 깨진다(패킷은 우연히 맞지만 상태는 틀리다).
                sound: 0,
                soundRepeat: 1,
                // 단위 이동 명령. 블록이 여기에 쓰고 requestLocalData 가 펄스로 환산한다.
                motionType: 0,
                motionUnit: 0,
                motionSpeed: 0,
                motionValue: 0,
                motionRadius: 0,
                pulse: 0,
                note: 0,
                lineTracerMode: 0,
                lineTracerModeId: -1,
                lineTracerSpeed: 5,
                // 햄스터S 항목 전용(__lineTracerGain 재정의가 읽는다). 4 = 속도 5의 기본값.
                lineTracerGain: 4,
                ioModeA: 0,
                ioModeB: 0,
                configProximity: 2,
                configGravity: 0,
                configBandWidth: this.__defaultConfigBandWidth(),
            };
            this.lineTracer = {
                written: false,
                flag: 0,
                event: 0,
                state: 0,
                count: 0,
            };
            // 사운드 프로토콜 상태(햄스터S 전용). flag 는 "직전 재생과 달라졌는가"를 로봇에 알리는
            // 토글이라 정지를 넘어 보존돼야 한다. 이 함수 끝에서 되살린다.
            this.sound = {
                written: false,
                flag: 0,
                event: 0,
                state: 0,
                count: 0,
            };
            // 단위 이동(cm/도/펄스) 프로토콜 상태(햄스터S 전용). id 와 pulsePrev 는 사운드 flag 와 같이
            // 이 함수 끝에서 되살린다. id 는 "새 명령"을 로봇에 알리는 카운터이고, pulsePrev 는 id 를 올릴지 판단하는 데 쓴다.
            // 펄스 0 명령이 연달아 오면 id 를 올리지 않아야 로봇이 같은 정지를 두 번 실행하지 않는다.
            this.wheel = {
                written: false,
                id: 0,
                pulse: 0,
                // -1 = "직전 명령 없음". entry-hw 는 생성과 reset() 에서 -1 로 둔다. 0 으로 두면
                // 첫 명령이 펄스 0(시간 단위 이동, 걸지 않는 명령)일 때 id 가 안 올라 설치형과
                // 패킷이 한 바이트 달라진다.
                pulsePrev: -1,
                event: 0,
                state: 0,
                count: 0,
                move: false, // 주행 중 여부. 두드림 억제에서 쓴다
                moveCount: 0,
            };
            this.motion = {
                written: false,
                type: 0,
                speed: 0,
            };
            // 두드림과 자유낙하 엣지 감지(햄스터S 전용). 로봇은 "발생했다"가 아니라 2비트 카운터를
            // 올려 보내므로, 값이 바뀐 순간을 엣지로 잡는다. -1 은 "아직 기준값이 없다"는 뜻이고
            // 첫 프레임에서 기준만 잡고 발화하지 않는다(연결 직후 헛 발화 방지).
            this.tapEvent = { tapId: -1, freeFallId: -1 };
            // 블록이 읽는 한 프레임짜리 스냅샷. handleSensory 가 매 프레임 갱신한다.
            this.tap = false;
            this.freeFall = false;
            this.battery = {
                state: 2,
                data: new Array(10),
                sum: 0.0,
                index: 0,
                count: 0,
            };
            // 상태를 비우기 전에 대기 중인 블록들에 완료를 알린다.
            // 비운 뒤에 부르면 콜백을 찾을 수 없어 블록이 영원히 멈춘다.
            [
                'wheelDone',
                'noteDone',
                'ioDone',
                'lineTracerCallback',
                'boardCallback',
                'soundDone',
            ].forEach((key) => this.__resolvePending(key));
            this.lineTracerModeId = 0;
            this.lineTracerStateId = -1;
            this.blockId = 0;
            this.wheelBlockId = 0;
            this.wheelTimer = undefined;
            this.lineTracerCallback = undefined;
            this.boardCommand = 0;
            this.boardState = 0;
            this.boardCount = 0;
            this.boardCallback = undefined;
            this.noteBlockId = 0;
            this.noteTimer1 = undefined;
            this.noteTimer2 = undefined;
            this.ioBlockId = 0;
            this.ioTimer = undefined;
            this.tempo = 60;
            // this.timeouts는 여기서 비우지 않는다. 비우면 아래 __removeAllTimeouts()가
            // 빈 배열을 돌아 실제 타이머를 하나도 못 지운다. 살아남은 타이머는 핸들도 잊혀서
            // 이후 어떤 취소로도 닿을 수 없고, blockId까지 0으로 되돌아가 다음 블록의 id와
            // 충돌해 새 블록의 완료 신호를 지운다. (__removeAllTimeouts가 목록을 스스로 비운다)
            this.invalidFrameCount = 0;
            this.pendingIdentity = undefined;
            this.pendingIdentityTtl = 0;

            // 프로토콜 카운터는 정지에서 보존한다. 설치형의 정지는 블록 쪽 motoring 만
            // 되돌리고 entry-hw 모듈의 wheel.id / sound.flag / lineTracer 플래그는 그대로 둔다
            // (entry-hw 는 연결할 때만 reset() 하고, 그때도 이 셋은 남긴다). 0 으로 되돌리면 정지
            // 뒤 첫 명령이 로봇에게 "직전과 같은 명령"으로 보일 수 있다.
            if (prev.wheel) {
                this.wheel.id = prev.wheel.id;
                this.wheel.pulsePrev = prev.wheel.pulsePrev;
                // 설치형 정지는 pulse 0 을 새 명령으로 보낸다(pulseId 가 바뀐다). 명령이 한 번이라도
                // 있었으면 같게 한다. 직전 펄스가 0 이 아니었다면 여기서 id 가 한 번 오른다.
                if (this.wheel.pulsePrev !== -1) {
                    this.wheel.written = true;
                }
            }
            if (prev.sound) {
                this.sound.flag = prev.sound.flag;
            }
            if (prev.lineTracer) {
                this.lineTracer.flag = prev.lineTracer.flag;
                this.lineTracer.state = prev.lineTracer.state;
            }
            // 수신 쪽 상태도 정지에서 보존한다. entry-hw 모듈의 두드림과 자유낙하 기준, 주행 중 여부,
            // 배터리 평균창은 정지와 무관하게 이어진다. 지우면 정지 직후 첫 두드림을 놓치거나(기준을
            // 새로 잡느라) 주행 직후 헛 두드림이 뜬다(주행 중 여부가 바로 풀려서).
            if (prev.wheel) {
                this.wheel.move = prev.wheel.move;
                this.wheel.moveCount = prev.wheel.moveCount;
            }
            if (prev.tapEvent) {
                this.tapEvent = prev.tapEvent;
            }
            if (prev.battery) {
                this.battery = prev.battery;
                this.sensory.batteryState = prev.batteryState;
            }

            this.motionTimer = undefined; // 실제 타이머는 아래 __removeAllTimeouts 가 지운다
            this.__removeAllTimeouts();
        }

        getMonitorPort() {
            return { ...this.sensory, ...this.motoring, ...this.lineTracer };
        }

        setMotoring(motoring) {
            this.motoring = motoring;
        }

        __removeTimeout(id) {
            clearTimeout(id);
            const idx = this.timeouts.indexOf(id);
            if (idx >= 0) {
                this.timeouts.splice(idx, 1);
            }
        }

        __removeAllTimeouts() {
            const timeouts = this.timeouts;
            for (const i in timeouts) {
                clearTimeout(timeouts[i]);
            }
            this.timeouts = [];
        }

        __issueWheelBlockId() {
            this.wheelBlockId = this.blockId = (this.blockId % 65535) + 1;
            return this.wheelBlockId;
        }

        // 취소될 때 대기 블록에 완료를 알린다. 알리지 않으면 블록이 완료 표시를 기다리며
        // 영원히 폴링한다(화면에 오류가 없어 "블록이 안 넘어가요"로만 보고된다).
        // 먼저 비우고 부른다. 콜백 안에서 다시 취소가 걸려도 두 번 불리지 않게.
        __resolvePending(key) {
            const done = this[key];
            if (done) {
                this[key] = undefined;
                done();
            }
        }

        __cancelWheel() {
            this.wheelBlockId = 0;
            if (this.wheelTimer !== undefined) {
                this.__removeTimeout(this.wheelTimer);
            }
            this.wheelTimer = undefined;
            this.__resolvePending('wheelDone');
        }

        __setLineTracerMode(mode) {
            this.lineTracerModeId = (this.lineTracerModeId % 255) + 1;
            this.motoring.lineTracerMode = mode;
            this.motoring.lineTracerModeId = this.lineTracerModeId;
            // entry-hw 는 handleRemoteData 에서 lineTracerModeId 가 바뀌면 written 을 세운다
            // (hamster.js, hamster_s.js). lite 에는 그 단계가 없어 여기서 직접 세운다. 세우지 않으면
            // 선 따라가기 플래그(구형 0x80 토글, 햄스터S 4비트 id)가 바뀌지 않는다.
            // 이 함수는 매번 id 를 올리므로 "바뀌면 세운다"와 같다.
            this.lineTracer.written = true;
        }

        __cancelLineTracer() {
            this.__resolvePending('lineTracerCallback');
        }

        __cancelBoard() {
            this.boardCommand = 0;
            this.boardState = 0;
            this.boardCount = 0;
            this.__resolvePending('boardCallback');
        }

        __issueNoteBlockId() {
            this.noteBlockId = this.blockId = (this.blockId % 65535) + 1;
            return this.noteBlockId;
        }

        __cancelNote() {
            this.noteBlockId = 0;
            if (this.noteTimer1 !== undefined) {
                this.__removeTimeout(this.noteTimer1);
            }
            if (this.noteTimer2 !== undefined) {
                this.__removeTimeout(this.noteTimer2);
            }
            this.noteTimer1 = undefined;
            this.noteTimer2 = undefined;
            this.__resolvePending('noteDone');
        }

        __issueIoBlockId() {
            this.ioBlockId = this.blockId = (this.blockId % 65535) + 1;
            return this.ioBlockId;
        }

        __cancelIo() {
            this.ioBlockId = 0;
            if (this.ioTimer !== undefined) {
                this.__removeTimeout(this.ioTimer);
            }
            this.ioTimer = undefined;
            this.__resolvePending('ioDone');
        }

        handleSensory() {
            const self = this;
            const sensory = self.sensory;
            // 한 프레임짜리 신호를 블록이 읽을 수 있게 스냅샷하고 원본을 비운다.
            // 설치형은 entry-hw 의 requestRemoteData 가 매 주기 sensory.tap/freeFall 을 0으로
            // 되돌리는데, lite 에는 그 단계가 없어 여기가 대응점이다. 비우지 않으면 한 번 두드린
            // 뒤 블록이 영원히 참을 돌려준다.
            self.tap = sensory.tap == 1;
            self.freeFall = sensory.freeFall == 1;
            sensory.tap = 0;
            sensory.freeFall = 0;
            if (self.lineTracerCallback) {
                if (sensory.lineTracerStateId != self.lineTracerStateId) {
                    self.lineTracerStateId = sensory.lineTracerStateId;
                    if (sensory.lineTracerState == 0x40) {
                        self.__setLineTracerMode(0);
                        // 취소가 완료를 알린다(__resolvePending). 여기서 또 부르면 두 번 불린다.
                        self.__cancelLineTracer();
                    }
                }
            }
            if (self.boardCallback) {
                const motoring = self.motoring;
                if (self.boardCommand == 1) {
                    switch (self.boardState) {
                        case 1: {
                            if (self.boardCount < 2) {
                                if (sensory.leftFloor < 50 && sensory.rightFloor < 50) {
                                    self.boardCount++;
                                } else {
                                    self.boardCount = 0;
                                }
                                var diff = sensory.leftFloor - sensory.rightFloor;
                                motoring.leftWheel = 45 + diff * 0.25;
                                motoring.rightWheel = 45 - diff * 0.25;
                            } else {
                                self.boardCount = 0;
                                self.boardState = 2;
                            }
                            break;
                        }
                        case 2: {
                            var diff = sensory.leftFloor - sensory.rightFloor;
                            motoring.leftWheel = 45 + diff * 0.25;
                            motoring.rightWheel = 45 - diff * 0.25;
                            self.boardState = 3;
                            self.wheelTimer = setTimeout(() => {
                                motoring.leftWheel = 0;
                                motoring.rightWheel = 0;
                                self.boardState = 4;
                                if (self.wheelTimer !== undefined) {
                                    self.__removeTimeout(self.wheelTimer);
                                }
                                self.wheelTimer = undefined;
                            }, 250);
                            self.timeouts.push(self.wheelTimer);
                            break;
                        }
                        case 3: {
                            var diff = sensory.leftFloor - sensory.rightFloor;
                            motoring.leftWheel = 45 + diff * 0.25;
                            motoring.rightWheel = 45 - diff * 0.25;
                            break;
                        }
                        case 4: {
                            motoring.leftWheel = 0;
                            motoring.rightWheel = 0;
                            // 취소가 완료를 알린다(__resolvePending). 여기서 또 부르면 두 번 불린다.
                            self.__cancelBoard();
                            break;
                        }
                    }
                } else if (self.boardCommand == 2) {
                    switch (self.boardState) {
                        case 1: {
                            if (self.boardCount < 2) {
                                if (sensory.leftFloor > 50) {
                                    self.boardCount++;
                                }
                            } else {
                                self.boardCount = 0;
                                self.boardState = 2;
                            }
                            break;
                        }
                        case 2: {
                            if (sensory.leftFloor < 20) {
                                self.boardState = 3;
                            }
                            break;
                        }
                        case 3: {
                            if (self.boardCount < 2) {
                                if (sensory.leftFloor < 20) {
                                    self.boardCount++;
                                }
                            } else {
                                self.boardCount = 0;
                                self.boardState = 4;
                            }
                            break;
                        }
                        case 4: {
                            if (sensory.leftFloor > 50) {
                                self.boardState = 5;
                            }
                            break;
                        }
                        case 5: {
                            var diff = sensory.leftFloor - sensory.rightFloor;
                            if (diff > -15) {
                                motoring.leftWheel = 0;
                                motoring.rightWheel = 0;
                                // 취소가 완료를 알린다(__resolvePending). 여기서 또 부르면 두 번 불린다.
                                self.__cancelBoard();
                            } else {
                                motoring.leftWheel = diff * 0.5;
                                motoring.rightWheel = -diff * 0.5;
                            }
                            break;
                        }
                    }
                } else if (self.boardCommand == 3) {
                    switch (self.boardState) {
                        case 1: {
                            if (self.boardCount < 2) {
                                if (sensory.rightFloor > 50) {
                                    self.boardCount++;
                                }
                            } else {
                                self.boardCount = 0;
                                self.boardState = 2;
                            }
                            break;
                        }
                        case 2: {
                            if (sensory.rightFloor < 20) {
                                self.boardState = 3;
                            }
                            break;
                        }
                        case 3: {
                            if (self.boardCount < 2) {
                                if (sensory.rightFloor < 20) {
                                    self.boardCount++;
                                }
                            } else {
                                self.boardCount = 0;
                                self.boardState = 4;
                            }
                            break;
                        }
                        case 4: {
                            if (sensory.rightFloor > 50) {
                                self.boardState = 5;
                            }
                            break;
                        }
                        case 5: {
                            var diff = sensory.rightFloor - sensory.leftFloor;
                            if (diff > -15) {
                                motoring.leftWheel = 0;
                                motoring.rightWheel = 0;
                                // 취소가 완료를 알린다(__resolvePending). 여기서 또 부르면 두 번 불린다.
                                self.__cancelBoard();
                            } else {
                                motoring.leftWheel = -diff * 0.5;
                                motoring.rightWheel = diff * 0.5;
                            }
                            break;
                        }
                    }
                }
            }
        }

        getValue(script) {
            const dev = script.getField('DEVICE');

            const sensor = this.__SENSORS[dev] || dev;
            return this.sensory[sensor];
        }

        checkBoolean(script) {
            const sensory = this.sensory;
            let value = 0;
            const dev = script.getField('DEVICE');

            if (dev.startsWith('TILT')) {
                if (
                    sensory.accelerationZ < 8192 &&
                    sensory.accelerationX > 8192 &&
                    sensory.accelerationY > -4096 &&
                    sensory.accelerationY < 4096
                ) {
                    value = 1;
                } else if (
                    sensory.accelerationZ < 8192 &&
                    sensory.accelerationX < -8192 &&
                    sensory.accelerationY > -4096 &&
                    sensory.accelerationY < 4096
                ) {
                    value = -1;
                } else if (
                    sensory.accelerationZ < 8192 &&
                    sensory.accelerationY > 8192 &&
                    sensory.accelerationX > -4096 &&
                    sensory.accelerationX < 4096
                ) {
                    value = 2;
                } else if (
                    sensory.accelerationZ < 8192 &&
                    sensory.accelerationY < -8192 &&
                    sensory.accelerationX > -4096 &&
                    sensory.accelerationX < 4096
                ) {
                    value = -2;
                } else if (
                    sensory.accelerationZ > 12288 &&
                    sensory.accelerationX > -8192 &&
                    sensory.accelerationX < 8192 &&
                    sensory.accelerationY > -8192 &&
                    sensory.accelerationY < 8192
                ) {
                    value = 3;
                } else if (
                    sensory.accelerationZ < -12288 &&
                    sensory.accelerationX > -4096 &&
                    sensory.accelerationX < 4096 &&
                    sensory.accelerationY > -4096 &&
                    sensory.accelerationY < 4096
                ) {
                    value = -3;
                } else {
                    value = 0;
                }

                switch (dev) {
                    case 'TILT_FORWARD':
                        return value == 1;
                    case 'TILT_BACKWARD':
                        return value == -1;
                    case 'TILT_LEFT':
                        return value == 2;
                    case 'TILT_RIGHT':
                        return value == -2;
                    case 'TILT_FLIP':
                        return value == 3;
                    case 'TILT_NOT':
                        return value == -3;
                }
                return false;
            } else {
                switch (dev) {
                    case 'BATTERY_NORMAL':
                        return sensory.batteryState === 2;
                    case 'BATTERY_LOW':
                        return sensory.batteryState === 1;
                    case 'BATTERY_EMPTY':
                        return sensory.batteryState === 0;
                }
                return false;
            }
        }

        checkHandFound(script) {
            const sensory = this.sensory;
            return sensory.handFound === undefined
                ? sensory.leftProximity > 40 || sensory.rightProximity > 40
                : sensory.handFound;
        }

        __board(leftVelocity, rightVelocity, command, callback) {
            const motoring = this.motoring;
            // 같은 계열을 먼저 취소해야 앞 스레드의 완료 신호가 덮이지 않고 전달된다.
            // 아래에서 boardCallback을 덮어쓰므로, 취소하지 않으면 그 신호가 사라진다.
            this.__cancelBoard();
            this.__cancelWheel();
            this.__cancelLineTracer();

            motoring.leftWheel = leftVelocity;
            motoring.rightWheel = rightVelocity;
            motoring.motion = 0;
            this.boardCommand = command;
            this.boardCount = 0;
            this.boardState = 1;
            this.boardCallback = callback;
            this.__setLineTracerMode(0);
        }

        boardForward(script) {
            if (!script.isStart) {
                script.isStart = true;
                script.isMoving = true;
                this.__board(45, 45, 1, () => {
                    script.isMoving = false;
                });
                return script;
            } else if (script.isMoving) {
                return script;
            } else {
                delete script.isStart;
                delete script.isMoving;
                Entry.engine.isContinue = false;
                return script.callReturn();
            }
        }

        boardTurn(script) {
            if (!script.isStart) {
                script.isStart = true;
                script.isMoving = true;
                const direction = script.getField('DIRECTION');
                if (direction == 'LEFT') {
                    this.__board(-45, 45, 2, () => {
                        script.isMoving = false;
                    });
                } else {
                    this.__board(45, -45, 3, () => {
                        script.isMoving = false;
                    });
                }

                return script;
            } else if (script.isMoving) {
                return script;
            } else {
                delete script.isStart;
                delete script.isMoving;
                Entry.engine.isContinue = false;
                return script.callReturn();
            }
        }

        __motion(type, leftVelocity, rightVelocity, secs, callback) {
            const self = this;
            const motoring = self.motoring;
            self.__cancelBoard();
            self.__cancelWheel();
            self.__cancelLineTracer();

            secs = parseFloat(secs);
            if (secs && secs > 0) {
                const id = self.__issueWheelBlockId();
                motoring.leftWheel = leftVelocity;
                motoring.rightWheel = rightVelocity;
                motoring.motion = type;
                self.__setLineTracerMode(0);
                self.wheelDone = callback; // 취소되면 __cancelWheel이 대신 알린다
                self.wheelTimer = setTimeout(() => {
                    if (self.wheelBlockId == id) {
                        motoring.leftWheel = 0;
                        motoring.rightWheel = 0;
                        motoring.motion = 0;
                        self.wheelDone = undefined; // 정상 완료. 아래에서 직접 부르므로 중복 방지
                        self.__cancelWheel();
                        callback();
                    }
                }, secs * 1000);
                self.timeouts.push(self.wheelTimer);
            } else {
                motoring.leftWheel = 0;
                motoring.rightWheel = 0;
                motoring.motion = 0;
                self.__setLineTracerMode(0);
                callback();
            }
        }

        moveForwardSecs(script) {
            if (!script.isStart) {
                script.isStart = true;
                script.isMoving = true;
                const secs = script.getNumberValue('SECS');
                if (secs < 0) {
                    this.__motion(2, -30, -30, -secs, () => {
                        script.isMoving = false;
                    });
                } else {
                    this.__motion(1, 30, 30, secs, () => {
                        script.isMoving = false;
                    });
                }

                return script;
            } else if (script.isMoving) {
                return script;
            } else {
                delete script.isStart;
                delete script.isMoving;
                Entry.engine.isContinue = false;
                return script.callReturn();
            }
        }

        moveBackwardSecs(script) {
            if (!script.isStart) {
                script.isStart = true;
                script.isMoving = true;
                const secs = script.getNumberValue('SECS');
                if (secs < 0) {
                    this.__motion(1, 30, 30, -secs, () => {
                        script.isMoving = false;
                    });
                } else {
                    this.__motion(2, -30, -30, secs, () => {
                        script.isMoving = false;
                    });
                }

                return script;
            } else if (script.isMoving) {
                return script;
            } else {
                delete script.isStart;
                delete script.isMoving;
                Entry.engine.isContinue = false;
                return script.callReturn();
            }
        }

        turnSecs(script) {
            if (!script.isStart) {
                script.isStart = true;
                script.isMoving = true;
                const direction = script.getField('DIRECTION');
                const secs = script.getNumberValue('SECS');
                if (direction == 'LEFT') {
                    if (secs < 0) {
                        this.__motion(4, 30, -30, -secs, () => {
                            script.isMoving = false;
                        });
                    } else {
                        this.__motion(3, -30, 30, secs, () => {
                            script.isMoving = false;
                        });
                    }
                } else {
                    if (secs < 0) {
                        this.__motion(3, -30, 30, -secs, () => {
                            script.isMoving = false;
                        });
                    } else {
                        this.__motion(4, 30, -30, secs, () => {
                            script.isMoving = false;
                        });
                    }
                }

                return script;
            } else if (script.isMoving) {
                return script;
            } else {
                delete script.isStart;
                delete script.isMoving;
                Entry.engine.isContinue = false;
                return script.callReturn();
            }
        }

        __stopMotion() {
            const motoring = this.motoring;
            this.__cancelBoard();
            this.__cancelWheel();
            this.__cancelLineTracer();

            motoring.leftWheel = 0;
            motoring.rightWheel = 0;
            motoring.motion = 0;
            this.__setLineTracerMode(0);
        }

        moveForwardUnit(script) {
            if (!script.isStart) {
                script.isStart = true;
                script.isMoving = true;
                const value = script.getNumberValue('VALUE');
                const unit = script.getField('UNIT');
                if (unit == 'SEC') {
                    if (value < 0) {
                        this.__motion(2, -30, -30, -value, () => {
                            script.isMoving = false;
                        });
                    } else {
                        this.__motion(1, 30, 30, value, () => {
                            script.isMoving = false;
                        });
                    }
                } else {
                    this.__stopMotion();
                }

                return script;
            } else if (script.isMoving) {
                return script;
            } else {
                delete script.isStart;
                delete script.isMoving;
                Entry.engine.isContinue = false;
                return script.callReturn();
            }
        }

        moveBackwardUnit(script) {
            if (!script.isStart) {
                script.isStart = true;
                script.isMoving = true;
                const value = script.getNumberValue('VALUE');
                const unit = script.getField('UNIT');
                if (unit == 'SEC') {
                    if (value < 0) {
                        this.__motion(1, 30, 30, -value, () => {
                            script.isMoving = false;
                        });
                    } else {
                        this.__motion(2, -30, -30, value, () => {
                            script.isMoving = false;
                        });
                    }
                } else {
                    this.__stopMotion();
                }

                return script;
            } else if (script.isMoving) {
                return script;
            } else {
                delete script.isStart;
                delete script.isMoving;
                Entry.engine.isContinue = false;
                return script.callReturn();
            }
        }

        turnUnit(script) {
            if (!script.isStart) {
                script.isStart = true;
                script.isMoving = true;
                const direction = script.getField('DIRECTION');
                const value = script.getNumberValue('VALUE');
                const unit = script.getField('UNIT');
                if (unit == 'SEC') {
                    if (direction == 'LEFT') {
                        if (value < 0) {
                            this.__motion(4, 30, -30, -value, () => {
                                script.isMoving = false;
                            });
                        } else {
                            this.__motion(3, -30, 30, value, () => {
                                script.isMoving = false;
                            });
                        }
                    } else {
                        if (value < 0) {
                            this.__motion(3, -30, 30, -value, () => {
                                script.isMoving = false;
                            });
                        } else {
                            this.__motion(4, 30, -30, value, () => {
                                script.isMoving = false;
                            });
                        }
                    }
                } else {
                    this.__stopMotion();
                }

                return script;
            } else if (script.isMoving) {
                return script;
            } else {
                delete script.isStart;
                delete script.isMoving;
                Entry.engine.isContinue = false;
                return script.callReturn();
            }
        }

        pivotUnit(script) {
            if (!script.isStart) {
                script.isStart = true;
                script.isMoving = true;
                const part = script.getField('PART');
                const value = script.getNumberValue('VALUE');
                const unit = script.getField('UNIT');
                const toward = script.getField('TOWARD');
                if (unit == 'SEC') {
                    if (part == 'LEFT_PEN') {
                        if (toward == 'FORWARD') {
                            if (value < 0) {
                                this.__motion(14, 0, 0, -value, () => {
                                    script.isMoving = false;
                                });
                            } else {
                                this.__motion(13, 0, 0, value, () => {
                                    script.isMoving = false;
                                });
                            }
                        } else {
                            if (value < 0) {
                                this.__motion(13, 0, 0, -value, () => {
                                    script.isMoving = false;
                                });
                            } else {
                                this.__motion(14, 0, 0, value, () => {
                                    script.isMoving = false;
                                });
                            }
                        }
                    } else if (part == 'RIGHT_PEN') {
                        if (toward == 'FORWARD') {
                            if (value < 0) {
                                this.__motion(16, 0, 0, -value, () => {
                                    script.isMoving = false;
                                });
                            } else {
                                this.__motion(15, 0, 0, value, () => {
                                    script.isMoving = false;
                                });
                            }
                        } else {
                            if (value < 0) {
                                this.__motion(15, 0, 0, -value, () => {
                                    script.isMoving = false;
                                });
                            } else {
                                this.__motion(16, 0, 0, value, () => {
                                    script.isMoving = false;
                                });
                            }
                        }
                    } else if (part == 'LEFT_WHEEL') {
                        if (toward == 'FORWARD') {
                            if (value < 0) {
                                this.__motion(6, 0, -30, -value, () => {
                                    script.isMoving = false;
                                });
                            } else {
                                this.__motion(5, 0, 30, value, () => {
                                    script.isMoving = false;
                                });
                            }
                        } else {
                            if (value < 0) {
                                this.__motion(5, 0, 30, -value, () => {
                                    script.isMoving = false;
                                });
                            } else {
                                this.__motion(6, 0, -30, value, () => {
                                    script.isMoving = false;
                                });
                            }
                        }
                    } else {
                        if (toward == 'FORWARD') {
                            if (value < 0) {
                                this.__motion(8, -30, 0, -value, () => {
                                    script.isMoving = false;
                                });
                            } else {
                                this.__motion(7, 30, 0, value, () => {
                                    script.isMoving = false;
                                });
                            }
                        } else {
                            if (value < 0) {
                                this.__motion(7, 30, 0, -value, () => {
                                    script.isMoving = false;
                                });
                            } else {
                                this.__motion(8, -30, 0, value, () => {
                                    script.isMoving = false;
                                });
                            }
                        }
                    }
                } else {
                    this.__stopMotion();
                }

                return script;
            } else if (script.isMoving) {
                return script;
            } else {
                delete script.isStart;
                delete script.isMoving;
                Entry.engine.isContinue = false;
                return script.callReturn();
            }
        }

        swingUnit(script) {
            if (!script.isStart) {
                script.isStart = true;
                script.isMoving = true;
                const part = script.getField('PART');
                const direction = script.getField('DIRECTION');
                const value = script.getNumberValue('VALUE');
                const unit = script.getField('UNIT');
                let radius = script.getNumberValue('RADIUS');
                const toward = script.getField('TOWARD');
                if (unit == 'SEC') {
                    radius = parseFloat(radius);
                    if (typeof radius == 'number' && radius >= 0) {
                        this.motoring.radius = radius;
                        if (part == 'LEFT_PEN') {
                            if (direction == 'LEFT') {
                                if (toward == 'FORWARD') {
                                    if (value < 0) {
                                        this.__motion(18, 0, 0, -value, () => {
                                            script.isMoving = false;
                                        });
                                    } else {
                                        this.__motion(17, 0, 0, value, () => {
                                            script.isMoving = false;
                                        });
                                    }
                                } else {
                                    if (value < 0) {
                                        this.__motion(17, 0, 0, -value, () => {
                                            script.isMoving = false;
                                        });
                                    } else {
                                        this.__motion(18, 0, 0, value, () => {
                                            script.isMoving = false;
                                        });
                                    }
                                }
                            } else {
                                if (toward == 'FORWARD') {
                                    if (value < 0) {
                                        this.__motion(20, 0, 0, -value, () => {
                                            script.isMoving = false;
                                        });
                                    } else {
                                        this.__motion(19, 0, 0, value, () => {
                                            script.isMoving = false;
                                        });
                                    }
                                } else {
                                    if (value < 0) {
                                        this.__motion(19, 0, 0, -value, () => {
                                            script.isMoving = false;
                                        });
                                    } else {
                                        this.__motion(20, 0, 0, value, () => {
                                            script.isMoving = false;
                                        });
                                    }
                                }
                            }
                        } else if (part == 'RIGHT_PEN') {
                            if (direction == 'LEFT') {
                                if (toward == 'FORWARD') {
                                    if (value < 0) {
                                        this.__motion(22, 0, 0, -value, () => {
                                            script.isMoving = false;
                                        });
                                    } else {
                                        this.__motion(21, 0, 0, value, () => {
                                            script.isMoving = false;
                                        });
                                    }
                                } else {
                                    if (value < 0) {
                                        this.__motion(21, 0, 0, -value, () => {
                                            script.isMoving = false;
                                        });
                                    } else {
                                        this.__motion(22, 0, 0, value, () => {
                                            script.isMoving = false;
                                        });
                                    }
                                }
                            } else {
                                if (toward == 'FORWARD') {
                                    if (value < 0) {
                                        this.__motion(24, 0, 0, -value, () => {
                                            script.isMoving = false;
                                        });
                                    } else {
                                        this.__motion(23, 0, 0, value, () => {
                                            script.isMoving = false;
                                        });
                                    }
                                } else {
                                    if (value < 0) {
                                        this.__motion(23, 0, 0, -value, () => {
                                            script.isMoving = false;
                                        });
                                    } else {
                                        this.__motion(24, 0, 0, value, () => {
                                            script.isMoving = false;
                                        });
                                    }
                                }
                            }
                        } else {
                            if (direction == 'LEFT') {
                                if (toward == 'FORWARD') {
                                    if (value < 0) {
                                        this.__motion(10, 0, 0, -value, () => {
                                            script.isMoving = false;
                                        });
                                    } else {
                                        this.__motion(9, 0, 0, value, () => {
                                            script.isMoving = false;
                                        });
                                    }
                                } else {
                                    if (value < 0) {
                                        this.__motion(9, 0, 0, -value, () => {
                                            script.isMoving = false;
                                        });
                                    } else {
                                        this.__motion(10, 0, 0, value, () => {
                                            script.isMoving = false;
                                        });
                                    }
                                }
                            } else {
                                if (toward == 'FORWARD') {
                                    if (value < 0) {
                                        this.__motion(12, 0, 0, -value, () => {
                                            script.isMoving = false;
                                        });
                                    } else {
                                        this.__motion(11, 0, 0, value, () => {
                                            script.isMoving = false;
                                        });
                                    }
                                } else {
                                    if (value < 0) {
                                        this.__motion(11, 0, 0, -value, () => {
                                            script.isMoving = false;
                                        });
                                    } else {
                                        this.__motion(12, 0, 0, value, () => {
                                            script.isMoving = false;
                                        });
                                    }
                                }
                            }
                        }
                    } else {
                        this.__stopMotion();
                        script.isMoving = false;
                    }
                } else {
                    this.__stopMotion();
                }

                return script;
            } else if (script.isMoving) {
                return script;
            } else {
                delete script.isStart;
                delete script.isMoving;
                Entry.engine.isContinue = false;
                return script.callReturn();
            }
        }

        setWheels(script) {
            const motoring = this.motoring;

            this.__cancelBoard();
            this.__cancelWheel();
            this.__cancelLineTracer();

            let leftVelocity = script.getNumberValue('LEFT');
            let rightVelocity = script.getNumberValue('RIGHT');

            leftVelocity = parseFloat(leftVelocity);
            rightVelocity = parseFloat(rightVelocity);
            if (typeof leftVelocity == 'number') {
                motoring.leftWheel = leftVelocity;
            }
            if (typeof rightVelocity == 'number') {
                motoring.rightWheel = rightVelocity;
            }
            motoring.motion = 0;
            this.__setLineTracerMode(0);
            return script.callReturn();
        }

        changeWheels(script) {
            const motoring = this.motoring;

            this.__cancelBoard();
            this.__cancelWheel();
            this.__cancelLineTracer();

            let leftVelocity = script.getNumberValue('LEFT');
            let rightVelocity = script.getNumberValue('RIGHT');

            leftVelocity = parseFloat(leftVelocity);
            rightVelocity = parseFloat(rightVelocity);
            if (typeof leftVelocity == 'number') {
                motoring.leftWheel =
                    motoring.leftWheel !== undefined
                        ? motoring.leftWheel + leftVelocity
                        : leftVelocity;
            }
            if (typeof rightVelocity == 'number') {
                motoring.rightWheel =
                    motoring.rightWheel !== undefined
                        ? motoring.rightWheel + rightVelocity
                        : rightVelocity;
            }
            motoring.motion = 0;
            this.__setLineTracerMode(0);
            return script.callReturn();
        }

        setWheel(script) {
            const motoring = this.motoring;

            this.__cancelBoard();
            this.__cancelWheel();
            this.__cancelLineTracer();

            const wheel = script.getField('WHEEL');
            let velocity = script.getNumberValue('VELOCITY');

            velocity = parseFloat(velocity);
            if (typeof velocity == 'number') {
                if (wheel == 'LEFT') {
                    motoring.leftWheel = velocity;
                } else if (wheel == 'RIGHT') {
                    motoring.rightWheel = velocity;
                } else {
                    motoring.leftWheel = velocity;
                    motoring.rightWheel = velocity;
                }
            }
            motoring.motion = 0;
            this.__setLineTracerMode(0);
            return script.callReturn();
        }

        changeWheel(script) {
            const motoring = this.motoring;

            this.__cancelBoard();
            this.__cancelWheel();
            this.__cancelLineTracer();

            const wheel = script.getField('WHEEL');
            let velocity = script.getNumberValue('VELOCITY');

            velocity = parseFloat(velocity);
            if (typeof velocity == 'number') {
                if (wheel == 'LEFT') {
                    motoring.leftWheel =
                        motoring.leftWheel != undefined ? motoring.leftWheel + velocity : velocity;
                } else if (wheel == 'RIGHT') {
                    motoring.rightWheel =
                        motoring.rightWheel != undefined
                            ? motoring.rightWheel + velocity
                            : velocity;
                } else {
                    motoring.leftWheel =
                        motoring.leftWheel != undefined ? motoring.leftWheel + velocity : velocity;
                    motoring.rightWheel =
                        motoring.rightWheel != undefined
                            ? motoring.rightWheel + velocity
                            : velocity;
                }
            }
            motoring.motion = 0;
            this.__setLineTracerMode(0);
            return script.callReturn();
        }

        followLine(script) {
            this.__cancelBoard();
            this.__cancelWheel();
            this.__cancelLineTracer();

            const color = script.getField('COLOR');
            const sensor = script.getField('SENSOR');

            let mode = 1;
            if (sensor == 'RIGHT') {
                mode = 2;
            } else if (sensor == 'BOTH') {
                mode = 3;
            }
            if (color == 'WHITE') {
                mode += 7;
            }

            const motoring = this.motoring;
            motoring.leftWheel = 0;
            motoring.rightWheel = 0;
            motoring.motion = 0;
            this.__setLineTracerMode(mode);

            return script.callReturn();
        }

        followLineUntil(script) {
            if (!script.isStart) {
                script.isStart = true;
                script.isMoving = true;
                // 같은 계열을 먼저 취소해야 앞 스레드의 완료 신호가 덮이지 않는다.
                this.__cancelLineTracer();
                this.__cancelBoard();
                this.__cancelWheel();

                const color = script.getField('COLOR');
                const direction = script.getField('DIRECTION');

                let mode = 4;
                if (direction == 'RIGHT') {
                    mode = 5;
                } else if (direction == 'FRONT') {
                    mode = 6;
                } else if (direction == 'REAR') {
                    mode = 7;
                }
                if (color == 'WHITE') {
                    mode += 7;
                }

                const motoring = this.motoring;
                motoring.leftWheel = 0;
                motoring.rightWheel = 0;
                motoring.motion = 0;
                this.__setLineTracerMode(mode);
                this.lineTracerCallback = () => {
                    script.isMoving = false;
                };

                return script;
            } else if (script.isMoving) {
                return script;
            } else {
                delete script.isStart;
                delete script.isMoving;
                Entry.engine.isContinue = false;
                return script.callReturn();
            }
        }

        setLineTracerSpeed(script) {
            const speed = parseInt(script.getField('SPEED'));

            if (typeof speed == 'number') {
                this.motoring.lineTracerSpeed = speed;
            }
            return script.callReturn();
        }

        setLineTracerGain(script) {
            return script.callReturn();
        }

        stop(script) {
            this.__cancelBoard();
            this.__cancelWheel();
            this.__cancelLineTracer();

            const motoring = this.motoring;
            motoring.leftWheel = 0;
            motoring.rightWheel = 0;
            motoring.motion = 0;
            this.__setLineTracerMode(0);
            return script.callReturn();
        }
        setLed(script) {
            const led = script.getField('LED');
            let color = script.getField('COLOR');
            color = parseInt(this.__COLORS[color]);

            if (color && color > 0) {
                if (led == 'LEFT') {
                    this.motoring.leftLed = color;
                } else if (led == 'RIGHT') {
                    this.motoring.rightLed = color;
                } else {
                    this.motoring.leftLed = color;
                    this.motoring.rightLed = color;
                }
            }

            return script.callReturn();
        }

        pickLed(script) {
            return script.callReturn();
        }

        clearLed(script) {
            const led = script.getField('LED');

            if (led == 'LEFT') {
                this.motoring.leftLed = 0;
            } else if (led == 'RIGHT') {
                this.motoring.rightLed = 0;
            } else {
                this.motoring.leftLed = 0;
                this.motoring.rightLed = 0;
            }

            return script.callReturn();
        }

        setRgb(script) {
            return script.callReturn();
        }

        changeRgb(script) {
            return script.callReturn();
        }

        __runBeep(count, id, callback) {
            if (count) {
                const self = this;
                if (id && callback) {
                    self.noteDone = callback; // 취소되면 __cancelNote가 대신 알린다
                }
                // 440Hz 로 100ms 켜고 100ms 끈다(설치형 HamsterRobot.__runBeep 과 같다).
                const motoring = self.motoring;
                motoring.buzzer = 440;
                motoring.note = 0;
                self.noteTimer1 = setTimeout(() => {
                    if (!id || self.noteBlockId == id) {
                        motoring.buzzer = 0;
                        if (self.noteTimer1 !== undefined) {
                            self.__removeTimeout(self.noteTimer1);
                        }
                        self.noteTimer1 = undefined;
                    }
                }, 100);
                self.timeouts.push(self.noteTimer1);
                self.noteTimer2 = setTimeout(() => {
                    if (!id || self.noteBlockId == id) {
                        motoring.buzzer = 0;
                        if (self.noteTimer2 !== undefined) {
                            self.__removeTimeout(self.noteTimer2);
                        }
                        self.noteTimer2 = undefined;
                        if (count < 0) {
                            self.__runBeep(-1, id, callback);
                        } else if (count == 1) {
                            if (id && callback) {
                                // 정상 완료. 아래에서 직접 부르므로 중복 방지로 먼저 비운다.
                                // id가 없는 fire-and-forget 체인은 이 슬롯의 주인이 아니므로 건드리지 않는다.
                                self.noteDone = undefined;
                                self.__cancelNote();
                                callback();
                            } else {
                                self.__cancelNote();
                            }
                        } else {
                            self.__runBeep(count - 1, id, callback);
                        }
                    }
                }, 200);
                self.timeouts.push(self.noteTimer2);
            }
        }

        beep(script) {
            if (!script.isStart) {
                script.isStart = true;
                script.isPlaying = true;
                this.__cancelNote();
                const id = this.__issueNoteBlockId();
                this.__runBeep(1, id, () => {
                    script.isPlaying = false;
                });

                return script;
            } else if (script.isPlaying) {
                return script;
            } else {
                delete script.isStart;
                delete script.isPlaying;
                Entry.engine.isContinue = false;
                return script.callReturn();
            }
        }

        playSound(script) {
            this.__cancelNote();
            this.motoring.buzzer = 0;
            this.motoring.note = 0;

            const sound = script.getField('SOUND');
            let count = script.getNumberValue('COUNT');

            count = parseInt(count);
            if (sound == 'BEEP' && count) {
                this.__runBeep(count);
            }
            return script.callReturn();
        }

        playSoundUntil(script) {
            if (!script.isStart) {
                script.isStart = true;
                script.isPlaying = true;
                this.__cancelNote();
                this.motoring.buzzer = 0;
                this.motoring.note = 0;

                const sound = script.getField('SOUND');
                let count = script.getNumberValue('COUNT');

                count = parseInt(count);
                if (count) {
                    if (sound == 'BEEP') {
                        const id = this.__issueNoteBlockId();
                        this.__runBeep(count, id, () => {
                            script.isPlaying = false;
                        });
                    }
                } else {
                    script.isPlaying = false;
                }

                return script;
            } else if (script.isPlaying) {
                return script;
            } else {
                delete script.isStart;
                delete script.isPlaying;
                Entry.engine.isContinue = false;
                return script.callReturn();
            }
        }

        setBuzzer(script) {
            this.__cancelNote();
            let hz = script.getNumberValue('HZ');

            hz = parseFloat(hz);
            if (typeof hz == 'number') {
                this.motoring.buzzer = hz;
            }
            this.motoring.note = 0;
            return script.callReturn();
        }

        changeBuzzer(script) {
            this.__cancelNote();
            let hz = script.getNumberValue('HZ');

            const motoring = this.motoring;
            hz = parseFloat(hz);
            if (typeof hz == 'number') {
                motoring.buzzer = motoring.buzzer != undefined ? motoring.buzzer + hz : hz;
            }
            motoring.note = 0;
            return script.callReturn();
        }

        clearBuzzer(script) {
            this.__cancelNote();
            this.motoring.buzzer = 0;
            this.motoring.note = 0;
            return script.callReturn();
        }

        clearSound(script, motoring) {
            return this.clearBuzzer(script);
        }

        playNote(script) {
            this.__cancelNote();

            let note = script.getField('NOTE');
            let octave = script.getNumberField('OCTAVE');

            note = parseInt(this.__NOTES[note]);
            octave = parseInt(octave);
            const motoring = this.motoring;
            motoring.buzzer = 0;
            if (note && octave && octave > 0 && octave < 8) {
                motoring.note = note + (octave - 1) * 12;
            } else {
                motoring.note = 0;
            }

            return script.callReturn();
        }

        playNoteBeat(script) {
            const self = this;

            if (!script.isStart) {
                script.isStart = true;
                script.isPlaying = true;
                self.__cancelNote();

                const motoring = self.motoring;
                let note = script.getField('NOTE');
                let octave = script.getNumberField('OCTAVE');
                let beat = script.getNumberValue('BEAT');

                note = parseInt(self.__NOTES[note], 10);
                octave = parseInt(octave);
                beat = parseFloat(beat);
                motoring.buzzer = 0;
                if (
                    note &&
                    octave &&
                    octave > 0 &&
                    octave < 8 &&
                    beat &&
                    beat > 0 &&
                    self.tempo > 0
                ) {
                    const id = self.__issueNoteBlockId();
                    note += (octave - 1) * 12;
                    motoring.note = note;
                    const timeValue = (beat * 60 * 1000) / self.tempo;
                    if (timeValue > 100) {
                        self.noteTimer1 = setTimeout(() => {
                            if (self.noteBlockId == id) {
                                motoring.note = 0;
                                if (self.noteTimer1 !== undefined) {
                                    self.__removeTimeout(self.noteTimer1);
                                }
                                self.noteTimer1 = undefined;
                            }
                        }, timeValue - 100);
                        self.timeouts.push(self.noteTimer1);
                    }
                    self.noteDone = () => {
                        script.isPlaying = false;
                    };
                    self.noteTimer2 = setTimeout(() => {
                        if (self.noteBlockId == id) {
                            motoring.note = 0;
                            self.noteDone = undefined; // 정상 완료. 아래에서 직접 처리
                            self.__cancelNote();
                            script.isPlaying = false;
                        }
                    }, timeValue);
                    self.timeouts.push(self.noteTimer2);
                } else {
                    motoring.note = 0;
                    script.isPlaying = false;
                }
                return script;
            } else if (script.isPlaying) {
                return script;
            } else {
                delete script.isStart;
                delete script.isPlaying;
                Entry.engine.isContinue = false;
                self.motoring.note = 0;
                return script.callReturn();
            }
        }

        restBeat(script) {
            const self = this;

            if (!script.isStart) {
                script.isStart = true;
                script.isPlaying = true;
                self.__cancelNote();
                let beat = script.getNumberValue('BEAT');

                const motoring = self.motoring;
                beat = parseFloat(beat);
                motoring.buzzer = 0;
                motoring.note = 0;
                if (beat && beat > 0 && self.tempo > 0) {
                    const id = self.__issueNoteBlockId();
                    const timeValue = (beat * 60 * 1000) / self.tempo;
                    self.noteDone = () => {
                        script.isPlaying = false;
                    };
                    self.noteTimer1 = setTimeout(() => {
                        if (self.noteBlockId == id) {
                            self.noteDone = undefined; // 정상 완료. 아래에서 직접 처리
                            self.__cancelNote();
                            script.isPlaying = false;
                        }
                    }, timeValue);
                    self.timeouts.push(self.noteTimer1);
                } else {
                    script.isPlaying = false;
                }

                return script;
            } else if (script.isPlaying) {
                return script;
            } else {
                delete script.isStart;
                delete script.isPlaying;
                Entry.engine.isContinue = false;
                return script.callReturn();
            }
        }

        setTempo(script) {
            let bpm = script.getNumberValue('BPM');

            bpm = parseFloat(bpm);
            if (typeof bpm == 'number') {
                this.tempo = bpm < 1 ? 1 : bpm;
            }

            return script.callReturn();
        }

        changeTempo(script) {
            let bpm = script.getNumberValue('BPM');

            bpm = parseFloat(bpm);
            if (typeof bpm == 'number') {
                this.tempo += bpm;
                if (this.tempo < 1) {
                    this.tempo = 1;
                }
            }

            return script.callReturn();
        }

        setIoMode(script) {
            this.__cancelIo();

            const port = script.getField('PORT');
            const mode = parseInt(this.__IO_MODES[script.getField('MODE')]);

            const motoring = this.motoring;
            if (typeof mode == 'number') {
                if (port == 'A') {
                    motoring.ioModeA = mode;
                } else if (port == 'B') {
                    motoring.ioModeB = mode;
                } else {
                    motoring.ioModeA = mode;
                    motoring.ioModeB = mode;
                }
            }

            return script.callReturn();
        }

        setOutput(script) {
            this.__cancelIo();

            const motoring = this.motoring;
            const port = script.getField('PORT');
            let value = script.getNumberValue('VALUE');

            value = parseFloat(value);
            if (typeof value == 'number') {
                if (port == 'A') {
                    motoring.outputA = value;
                } else if (port == 'B') {
                    motoring.outputB = value;
                } else {
                    motoring.outputA = value;
                    motoring.outputB = value;
                }
            }

            return script.callReturn();
        }

        changeOutput(script) {
            this.__cancelIo();

            const motoring = this.motoring;
            const port = script.getField('PORT');
            let value = script.getNumberValue('VALUE');

            value = parseFloat(value);
            if (typeof value == 'number') {
                if (port == 'A') {
                    motoring.outputA =
                        motoring.outputA != undefined ? motoring.outputA + value : value;
                } else if (port == 'B') {
                    motoring.outputB =
                        motoring.outputB != undefined ? motoring.outputB + value : value;
                } else {
                    motoring.outputA =
                        motoring.outputA != undefined ? motoring.outputA + value : value;
                    motoring.outputB =
                        motoring.outputB != undefined ? motoring.outputB + value : value;
                }
            }

            return script.callReturn();
        }

        gripper(script) {
            const self = this;

            if (!script.isStart) {
                script.isStart = true;
                script.isPlaying = true;
                self.__cancelIo();

                const id = self.__issueIoBlockId();
                const action = script.getField('ACTION');

                const motoring = self.motoring;
                motoring.ioModeA = 10;
                motoring.ioModeB = 10;
                if (action == 'OPEN') {
                    motoring.outputA = 1;
                    motoring.outputB = 0;
                } else {
                    motoring.outputA = 0;
                    motoring.outputB = 1;
                }
                self.ioDone = () => {
                    script.isPlaying = false;
                };
                self.ioTimer = setTimeout(() => {
                    if (self.ioBlockId == id) {
                        self.ioDone = undefined; // 정상 완료. 아래에서 직접 처리
                        self.__cancelIo();
                        script.isPlaying = false;
                    }
                }, 500);
                self.timeouts.push(self.ioTimer);

                return script;
            } else if (script.isPlaying) {
                return script;
            } else {
                delete script.isStart;
                delete script.isPlaying;
                Entry.engine.isContinue = false;
                return script.callReturn();
            }
        }

        releaseGripper(script) {
            this.__cancelIo();
            const motoring = this.motoring;
            motoring.ioModeA = 10;
            motoring.ioModeB = 10;
            motoring.outputA = 0;
            motoring.outputB = 0;
            return script.callReturn();
        }

        setLanguage() {
            return {
                ko: {
                    template: {
                        hamsterlite_gripper: '집게 %1 %2',
                        hamsterlite_release_gripper: '집게 끄기 %1',
                        hamsterlite_boolean: '%1?',
                        hamsterlite_play_note: '%1 %2 음을 연주하기 %3',
                        hamsterlite_hand_found: '손 찾음?',
                        hamsterlite_value: '%1',
                        hamsterlite_move_forward_once: '말판 앞으로 한 칸 이동하기 %1',
                        hamsterlite_turn_once: '말판 %1 으로 한 번 돌기 %2',
                        hamsterlite_move_forward_for_secs: '앞으로 %1 초 이동하기 %2',
                        hamsterlite_move_backward_for_secs: '뒤로 %1 초 이동하기 %2',
                        hamsterlite_turn_for_secs: '%1 으로 %2 초 돌기 %3',
                        hamsterlite_change_both_wheels_by:
                            '왼쪽 바퀴 %1 오른쪽 바퀴 %2 만큼 바꾸기 %3',
                        hamsterlite_set_both_wheels_to:
                            '왼쪽 바퀴 %1 오른쪽 바퀴 %2 (으)로 정하기 %3',
                        hamsterlite_change_wheel_by: '%1 바퀴 %2 만큼 바꾸기 %3',
                        hamsterlite_set_wheel_to: '%1 바퀴 %2 (으)로 정하기 %3',
                        hamsterlite_follow_line_using: '%1 선을 %2 바닥 센서로 따라가기 %3',
                        hamsterlite_follow_line_until: '%1 선을 따라 %2 교차로까지 이동하기 %3',
                        hamsterlite_set_following_speed_to:
                            '선 따라가기 속도를 %1 (으)로 정하기 %2',
                        hamsterlite_stop: '정지하기 %1',
                        hamsterlite_set_led_to: '%1 LED를 %2 으로 정하기 %3',
                        hamsterlite_clear_led: '%1 LED 끄기 %2',
                        hamsterlite_beep: '삐 소리내기 %1',
                        hamsterlite_change_buzzer_by: '버저 음을 %1 만큼 바꾸기 %2',
                        hamsterlite_set_buzzer_to: '버저 음을 %1 (으)로 정하기 %2',
                        hamsterlite_clear_buzzer: '버저 끄기 %1',
                        hamsterlite_play_note_for: '%1 %2 음을 %3 박자 연주하기 %4',
                        hamsterlite_rest_for: '%1 박자 쉬기 %2',
                        hamsterlite_change_tempo_by: '연주 속도를 %1 만큼 바꾸기 %2',
                        hamsterlite_set_tempo_to: '연주 속도를 %1 BPM으로 정하기 %2',
                        hamsterlite_set_port_to: '포트 %1 를 %2 으로 정하기 %3',
                        hamsterlite_change_output_by: '출력 %1 를 %2 만큼 바꾸기 %3',
                        hamsterlite_set_output_to: '출력 %1 를 %2 (으)로 정하기 %3',
                    },
                    Helper: {
                        hamsterlite_gripper: '집게를 열거나 닫습니다.',
                        hamsterlite_release_gripper:
                            '집게의 전원을 끄고 자유롭게 움직일 수 있도록 합니다.',
                        hamsterlite_boolean:
                            "앞으로 기울임: 앞으로 기울이면 '참'으로 판단하고, 아니면 '거짓'으로 판단합니다.<br/>뒤로 기울임: 뒤로 기울이면 '참'으로 판단하고, 아니면 '거짓'으로 판단합니다.<br/>왼쪽으로 기울임: 왼쪽으로 기울이면 '참'으로 판단하고, 아니면 '거짓'으로 판단합니다.<br/>오른쪽으로 기울임: 오른쪽으로 기울이면 '참'으로 판단하고, 아니면 '거짓'으로 판단합니다.<br/>거꾸로 뒤집음: 거꾸로 뒤집으면 '참'으로 판단하고, 아니면 '거짓'으로 판단합니다.<br/>기울이지 않음: 기울이지 않으면 '참'으로 판단하고, 아니면 '거짓'으로 판단합니다.<br/>배터리 정상: 배터리 잔량이 충분하면 '참'으로 판단하고, 아니면 '거짓'으로 판단합니다.<br/>배터리 부족: 배터리 잔량이 부족하면 '참'으로 판단하고, 아니면 '거짓'으로 판단합니다.<br/>배터리 없음: 배터리 잔량이 없으면 '참'으로 판단하고, 아니면 '거짓'으로 판단합니다.",
                        hamsterlite_play_note: '선택한 계이름과 옥타브의 음을 소리 냅니다.',
                        hamsterlite_beep: '버저 소리를 짧게 냅니다.',
                        hamsterlite_change_both_wheels_by:
                            '왼쪽과 오른쪽 바퀴의 현재 속도 값(%)에 입력한 값을 각각 더합니다. 더한 결과가 양수 값이면 바퀴가 앞으로 회전하고, 음수 값이면 뒤로 회전합니다.',
                        hamsterlite_change_buzzer_by:
                            '버저 소리의 현재 음 높이(Hz)에 입력한 값을 더합니다. 소수점 둘째 자리까지 입력할 수 있습니다.',
                        hamsterlite_change_output_by:
                            '선택한 외부 확장 포트의 현재 출력 값에 입력한 값을 더합니다. 더한 결과는 외부 확장 포트의 모드에 따라 다음의 범위를 가집니다.<br/>서보 출력: 유효한 값의 범위는 1 ~ 180도, 0이면 PWM 펄스 없이 항상 0을 출력<br/>PWM 출력: 0 ~ 100%, PWM 파형에서 ON 상태의 듀티비(%)<br/>디지털 출력: 0이면 LOW, 0이 아니면 HIGH',
                        hamsterlite_change_tempo_by:
                            '연주하거나 쉬는 속도의 현재 BPM(분당 박자 수)에 입력한 값을 더합니다.',
                        hamsterlite_change_wheel_by:
                            '왼쪽/오른쪽/양쪽 바퀴의 현재 속도 값(%)에 입력한 값을 더합니다. 더한 결과가 양수 값이면 바퀴가 앞으로 회전하고, 음수 값이면 뒤로 회전합니다.',
                        hamsterlite_clear_buzzer: '버저 소리를 끕니다.',
                        hamsterlite_clear_led: '왼쪽/오른쪽/양쪽 LED를 끕니다.',
                        hamsterlite_follow_line_until:
                            '왼쪽/오른쪽/앞쪽/뒤쪽의 검은색/하얀색 선을 따라 이동하다가 교차로를 만나면 정지합니다.',
                        hamsterlite_follow_line_using:
                            '왼쪽/오른쪽/양쪽 바닥 센서를 사용하여 검은색/하얀색 선을 따라 이동합니다.',
                        hamsterlite_hand_found:
                            "근접 센서 앞에 손 또는 물체가 있으면 '참'으로 판단하고, 아니면 '거짓'으로 판단합니다.",
                        hamsterlite_move_backward_for_secs: '입력한 시간(초) 동안 뒤로 이동합니다.',
                        hamsterlite_move_forward_for_secs:
                            '입력한 시간(초) 동안 앞으로 이동합니다.',
                        hamsterlite_move_forward_once: '말판 위에서 한 칸 앞으로 이동합니다.',
                        hamsterlite_play_note_for:
                            '선택한 계이름과 옥타브의 음을 입력한 박자만큼 소리 냅니다.',
                        hamsterlite_rest_for: '입력한 박자만큼 쉽니다.',
                        hamsterlite_set_both_wheels_to:
                            '왼쪽과 오른쪽 바퀴의 속도를 입력한 값(-100 ~ 100%)으로 각각 설정합니다. 양수 값을 입력하면 바퀴가 앞으로 회전하고, 음수 값을 입력하면 뒤로 회전합니다. 숫자 0을 입력하면 정지합니다.',
                        hamsterlite_set_buzzer_to:
                            '버저 소리의 음 높이를 입력한 값(Hz)으로 설정합니다. 소수점 둘째 자리까지 입력할 수 있습니다. 숫자 0을 입력하면 버저 소리를 끕니다.',
                        hamsterlite_set_following_speed_to:
                            '선을 따라 이동하는 속도(1 ~ 8)를 설정합니다. 숫자가 클수록 이동하는 속도가 빠릅니다.',
                        hamsterlite_set_led_to: '왼쪽/오른쪽/양쪽 LED를 선택한 색깔로 켭니다.',
                        hamsterlite_set_output_to:
                            '선택한 외부 확장 포트의 출력 값을 입력한 값으로 설정합니다. 입력하는 값은 외부 확장 포트의 모드에 따라 다음의 범위를 가집니다.<br/>서보 출력: 유효한 값의 범위는 1 ~ 180도, 0이면 PWM 펄스 없이 항상 0을 출력<br/>PWM 출력: 0 ~ 100%, PWM 파형에서 ON 상태의 듀티비(%)<br/>디지털 출력: 0이면 LOW, 0이 아니면 HIGH',
                        hamsterlite_set_port_to:
                            '선택한 외부 확장 포트의 입출력 모드를 선택한 모드로 설정합니다.',
                        hamsterlite_set_tempo_to:
                            '연주하거나 쉬는 속도를 입력한 BPM(분당 박자 수)으로 설정합니다.',
                        hamsterlite_set_wheel_to:
                            '왼쪽/오른쪽/양쪽 바퀴의 속도를 입력한 값(-100 ~ 100%)으로 설정합니다. 양수 값을 입력하면 바퀴가 앞으로 회전하고, 음수 값을 입력하면 뒤로 회전합니다. 숫자 0을 입력하면 정지합니다.',
                        hamsterlite_stop: '양쪽 바퀴를 정지합니다.',
                        hamsterlite_turn_for_secs:
                            '입력한 시간(초) 동안 왼쪽/오른쪽 방향으로 제자리에서 회전합니다.',
                        hamsterlite_turn_once:
                            '말판 위에서 왼쪽/오른쪽 방향으로 제자리에서 90도 회전합니다.',
                        hamsterlite_value:
                            '왼쪽 근접 센서: 왼쪽 근접 센서의 값 (값의 범위: 0 ~ 255, 초기값: 0)<br/>오른쪽 근접 센서: 오른쪽 근접 센서의 값 (값의 범위: 0 ~ 255, 초기값: 0)<br/>왼쪽 바닥 센서: 왼쪽 바닥 센서의 값 (값의 범위: 0 ~ 100, 초기값: 0)<br/>오른쪽 바닥 센서: 오른쪽 바닥 센서의 값 (값의 범위: 0 ~ 100, 초기값: 0)<br/>x축 가속도: 가속도 센서의 X축 값 (값의 범위: -32768 ~ 32767, 초기값: 0) 로봇이 전진하는 방향이 X축의 양수 방향입니다.<br/>y축 가속도: 가속도 센서의 Y축 값 (값의 범위: -32768 ~ 32767, 초기값: 0) 로봇의 왼쪽 방향이 Y축의 양수 방향입니다.<br/>z축 가속도: 가속도 센서의 Z축 값 (값의 범위: -32768 ~ 32767, 초기값: 0) 로봇의 위쪽 방향이 Z축의 양수 방향입니다.<br/>밝기: 밝기 센서의 값 (값의 범위: 0 ~ 65535, 초기값: 0) 밝을 수록 값이 커집니다.<br/>온도: 로봇 내부의 온도 값 (값의 범위: 섭씨 -40 ~ 88도, 초기값: 0)<br/>신호 세기: 블루투스 무선 통신의 신호 세기 (값의 범위: -128 ~ 0 dBm, 초기값: 0) 신호의 세기가 셀수록 값이 커집니다.<br/>입력 A: 외부 확장 포트 A로 입력되는 신호의 값 (값의 범위: 아날로그 입력 0 ~ 255, 디지털 입력 0 또는 1, 초기값: 0)<br/>입력 B: 외부 확장 포트 B로 입력되는 신호의 값 (값의 범위: 아날로그 입력 0 ~ 255, 디지털 입력 0 또는 1, 초기값: 0)',
                    },
                    Blocks: {
                        hamsterlite_hand_found: '손 찾음?',
                        hamsterlite_sensor_left_proximity: '왼쪽 근접 센서',
                        hamsterlite_sensor_right_proximity: '오른쪽 근접 센서',
                        hamsterlite_sensor_left_floor: '왼쪽 바닥 센서',
                        hamsterlite_sensor_right_floor: '오른쪽 바닥 센서',
                        hamsterlite_sensor_acceleration_x: 'x축 가속도',
                        hamsterlite_sensor_acceleration_y: 'y축 가속도',
                        hamsterlite_sensor_acceleration_z: 'z축 가속도',
                        hamsterlite_sensor_light: '밝기',
                        hamsterlite_sensor_temperature: '온도',
                        hamsterlite_sensor_signal_strength: '신호 세기',
                        hamsterlite_sensor_input_a: '입력 A',
                        hamsterlite_sensor_input_b: '입력 B',
                        hamsterlite_move_forward_once: '말판 앞으로 한 칸 이동하기',
                        hamsterlite_turn_once_1: '말판',
                        hamsterlite_turn_once_2: '으로 한 번 돌기',
                        hamsterlite_turn_once_left: '왼쪽',
                        hamsterlite_turn_right: '오른쪽',
                        hamsterlite_move_forward: '앞으로 이동하기',
                        hamsterlite_move_backward: '뒤로 이동하기',
                        hamsterlite_turn_around_1: '',
                        hamsterlite_turn_around_2: '으로 돌기',
                        hamsterlite_move_forward_for_secs_1: '앞으로',
                        hamsterlite_move_forward_for_secs_2: '초 이동하기',
                        hamsterlite_move_backward_for_secs_1: '뒤로',
                        hamsterlite_move_backward_for_secs_2: '초 이동하기',
                        hamsterlite_turn_for_secs_1: '',
                        hamsterlite_turn_for_secs_2: '으로',
                        hamsterlite_turn_for_secs_3: '초 돌기',
                        hamsterlite_change_both_wheels_by_1: '왼쪽 바퀴',
                        hamsterlite_change_both_wheels_by_2: '오른쪽 바퀴',
                        hamsterlite_change_both_wheels_by_3: '만큼 바꾸기',
                        hamsterlite_set_both_wheels_to_1: '왼쪽 바퀴',
                        hamsterlite_set_both_wheels_to_2: '오른쪽 바퀴',
                        hamsterlite_set_both_wheels_to_3: '(으)로 정하기',
                        hamsterlite_change_wheel_by_1: '',
                        hamsterlite_change_wheel_by_2: '바퀴',
                        hamsterlite_change_wheel_by_3: '만큼 바꾸기',
                        hamsterlite_left_wheel: '왼쪽',
                        hamsterlite_right_wheel: '오른쪽',
                        hamsterlite_both_wheels: '양쪽',
                        hamsterlite_set_wheel_to_1: '',
                        hamsterlite_set_wheel_to_2: '바퀴',
                        hamsterlite_set_wheel_to_3: '(으)로 정하기',
                        hamsterlite_follow_line_using_1: '',
                        hamsterlite_follow_line_using_2: '선을',
                        hamsterlite_follow_line_using_3: '바닥 센서로 따라가기',
                        hamsterlite_left_floor_sensor: '왼쪽',
                        hamsterlite_right_floor_sensor: '오른쪽',
                        hamsterlite_both_floor_sensors: '양쪽',
                        hamsterlite_follow_line_until_1: '',
                        hamsterlite_follow_line_until_2: '선을 따라',
                        hamsterlite_follow_line_until_3: '교차로까지 이동하기',
                        hamsterlite_left_intersection: '왼쪽',
                        hamsterlite_right_intersection: '오른쪽',
                        hamsterlite_front_intersection: '앞쪽',
                        hamsterlite_rear_intersection: '뒤쪽',
                        hamsterlite_set_following_speed_to_1: '선 따라가기 속도를',
                        hamsterlite_set_following_speed_to_2: '(으)로 정하기',
                        hamsterlite_front: '앞쪽',
                        hamsterlite_rear: '뒤쪽',
                        hamsterlite_stop: '정지하기',
                        hamsterlite_set_led_to_1: '',
                        hamsterlite_set_led_to_2: 'LED를',
                        hamsterlite_set_led_to_3: '으로 정하기',
                        hamsterlite_left_led: '왼쪽',
                        hamsterlite_right_led: '오른쪽',
                        hamsterlite_both_leds: '양쪽',
                        hamsterlite_clear_led_1: '',
                        hamsterlite_clear_led_2: 'LED 끄기',
                        hamsterlite_color_cyan: '하늘색',
                        hamsterlite_color_magenta: '자주색',
                        hamsterlite_color_black: '검은색',
                        hamsterlite_color_white: '하얀색',
                        hamsterlite_color_red: '빨간색',
                        hamsterlite_color_yellow: '노란색',
                        hamsterlite_color_green: '초록색',
                        hamsterlite_color_blue: '파란색',
                        hamsterlite_beep: '삐 소리내기',
                        hamsterlite_change_buzzer_by_1: '버저 음을',
                        hamsterlite_change_buzzer_by_2: '만큼 바꾸기',
                        hamsterlite_set_buzzer_to_1: '버저 음을',
                        hamsterlite_set_buzzer_to_2: '(으)로 정하기',
                        hamsterlite_clear_buzzer: '버저 끄기',
                        hamsterlite_play_note_for_1: '',
                        hamsterlite_play_note_for_2: '',
                        hamsterlite_play_note_for_3: '음을',
                        hamsterlite_play_note_for_4: '박자 연주하기',
                        hamsterlite_rest_for_1: '',
                        hamsterlite_rest_for_2: '박자 쉬기',
                        hamsterlite_change_tempo_by_1: '연주 속도를',
                        hamsterlite_change_tempo_by_2: '만큼 바꾸기',
                        hamsterlite_set_tempo_to_1: '연주 속도를 분당',
                        hamsterlite_set_tempo_to_2: '박자로 정하기',
                        hamsterlite_set_port_to_1: '포트',
                        hamsterlite_set_port_to_2: '를',
                        hamsterlite_set_port_to_3: '으로 정하기',
                        hamsterlite_change_output_by_1: '출력',
                        hamsterlite_change_output_by_2: '를',
                        hamsterlite_change_output_by_3: '만큼 바꾸기',
                        hamsterlite_set_output_to_1: '출력',
                        hamsterlite_set_output_to_2: '를',
                        hamsterlite_set_output_to_3: '(으)로 정하기',
                        hamsterlite_port_a: 'A',
                        hamsterlite_port_b: 'B',
                        hamsterlite_port_ab: 'A와 B',
                        hamsterlite_analog_input: '아날로그 입력',
                        hamsterlite_digital_input: '디지털 입력',
                        hamsterlite_servo_output: '서보 출력',
                        hamsterlite_pwm_output: 'PWM 출력',
                        hamsterlite_digital_output: '디지털 출력',
                        hamsterlite_note_c: '도',
                        hamsterlite_note_c_sharp: '도♯(레♭)',
                        hamsterlite_note_d: '레',
                        hamsterlite_note_d_sharp: '레♯(미♭)',
                        hamsterlite_note_e: '미',
                        hamsterlite_note_f: '파',
                        hamsterlite_note_f_sharp: '파♯(솔♭)',
                        hamsterlite_note_g: '솔',
                        hamsterlite_note_g_sharp: '솔♯(라♭)',
                        hamsterlite_note_a: '라',
                        hamsterlite_note_a_sharp: '라♯(시♭)',
                        hamsterlite_note_b: '시',
                        hamsterlite_tilt_forward: '앞으로 기울임',
                        hamsterlite_tilt_backward: '뒤로 기울임',
                        hamsterlite_tilt_left: '왼쪽으로 기울임',
                        hamsterlite_tilt_right: '오른쪽으로 기울임',
                        hamsterlite_tilt_flip: '거꾸로 뒤집음',
                        hamsterlite_tilt_not: '기울이지 않음',
                        hamsterlite_battery_normal: '배터리 정상',
                        hamsterlite_battery_low: '배터리 부족',
                        hamsterlite_battery_empty: '배터리 없음',
                        hamsterlite_open_gripper: '열기',
                        hamsterlite_close_gripper: '닫기',
                    },
                },
                en: {
                    template: {
                        hamsterlite_gripper: '%1 gripper %2',
                        hamsterlite_release_gripper: 'release gripper %1',
                        hamsterlite_boolean: '%1?',
                        hamsterlite_play_note: 'play note %1 %2 %3',
                        hamsterlite_hand_found: 'hand found?',
                        hamsterlite_value: '%1',
                        hamsterlite_move_forward_once: 'move forward once on board %1',
                        hamsterlite_turn_once: 'turn %1 once on board %2',
                        hamsterlite_move_forward_for_secs: 'move forward for %1 secs %2',
                        hamsterlite_move_backward_for_secs: 'move backward for %1 secs %2',
                        hamsterlite_turn_for_secs: 'turn %1 for %2 secs %3',
                        hamsterlite_change_both_wheels_by: 'change wheels by left: %1 right: %2 %3',
                        hamsterlite_set_both_wheels_to: 'set wheels to left: %1 right: %2 %3',
                        hamsterlite_change_wheel_by: 'change %1 wheel by %2 %3',
                        hamsterlite_set_wheel_to: 'set %1 wheel to %2 %3',
                        hamsterlite_follow_line_using: 'follow %1 line using %2 floor sensor %3',
                        hamsterlite_follow_line_until: 'follow %1 line until %2 intersection %3',
                        hamsterlite_set_following_speed_to: 'set following speed to %1 %2',
                        hamsterlite_stop: 'stop %1',
                        hamsterlite_set_led_to: 'set %1 led to %2 %3',
                        hamsterlite_clear_led: 'clear %1 led %2',
                        hamsterlite_beep: 'beep %1',
                        hamsterlite_change_buzzer_by: 'change buzzer by %1 %2',
                        hamsterlite_set_buzzer_to: 'set buzzer to %1 %2',
                        hamsterlite_clear_buzzer: 'clear buzzer %1',
                        hamsterlite_play_note_for: 'play note %1 %2 for %3 beats %4',
                        hamsterlite_rest_for: 'rest for %1 beats %2',
                        hamsterlite_change_tempo_by: 'change tempo by %1 %2',
                        hamsterlite_set_tempo_to: 'set tempo to %1 bpm %2',
                        hamsterlite_set_port_to: 'set port %1 to %2 %3',
                        hamsterlite_change_output_by: 'change output %1 by %2 %3',
                        hamsterlite_set_output_to: 'set output %1 to %2 %3',
                    },
                    Helper: {
                        hamsterlite_gripper: 'Opens or closes the gripper.',
                        hamsterlite_release_gripper:
                            'Turns off the gripper so that it can be moved freely.',
                        hamsterlite_boolean:
                            'tilt forward: If tilted forward, true, otherwise false<br/>tilt backward: If tilted backward, true, otherwise false<br/>tilt left: If tilted to the left, true, otherwise false<br/>tilt right: If tilted to the right, true, otherwise false<br/>tilt flip: If upside-down, true, otherwise false<br/>not tilt: If not tilted, true, otherwise false<br/>battery normal: If the battery is enough, true, otherwise false<br/>battery low: If the battery is low, true, otherwise false<br/>battery empty: If the battery is empty, true, otherwise false',
                        hamsterlite_play_note: 'It sounds the selected tone and octave.',
                        hamsterlite_beep: 'Plays beep sound.',
                        hamsterlite_change_both_wheels_by:
                            'Adds the entered values to the current speed values (%) of the left and right wheels respectively. If the result is positive, the wheel rotates forward; if negative, the wheel rotates backward.',
                        hamsterlite_change_buzzer_by:
                            'Adds the entered value to the current pitch (Hz) of the buzzer sound. You can enter up to two decimal places.',
                        hamsterlite_change_output_by:
                            'Adds the entered value to the current output value of the selected external port. The result will be in the following range depending on the mode of the external port.<br/>Servo output: valid range from 1 to 180 degrees; if 0, output 0 without PWM pulse<br/>PWM output: 0 to 100%, duty ratio (%) of ON state in PWM waveform<br/>Digital output: LOW when 0, otherwise HIGH',
                        hamsterlite_change_tempo_by:
                            'Adds the entered value to the current BPM (beats per minute) of the playing or resting speed.',
                        hamsterlite_change_wheel_by:
                            'Adds the entered value to the current speed value (%) of the left/right/both wheels. If the result is positive, the wheel rotates forward; if negative, the wheel rotates backward.',
                        hamsterlite_clear_buzzer: 'Turns off buzzer sound.',
                        hamsterlite_clear_led: 'Turns off the left/right/both LEDs.',
                        hamsterlite_follow_line_until:
                            'Moves along the black/white line on the left/right/front/back, then stops when the robot meets the intersection.',
                        hamsterlite_follow_line_using:
                            'Moves along the black/white line by using the left/right/both floor sensors.',
                        hamsterlite_hand_found:
                            'If there is a hand or object in front of the proximity sensor, true, otherwise false',
                        hamsterlite_move_backward_for_secs:
                            'Moves backward for the number of seconds entered.',
                        hamsterlite_move_forward_for_secs:
                            'Moves forward for the number of seconds entered.',
                        hamsterlite_move_forward_once: 'Moves one space forward on the board.',
                        hamsterlite_play_note_for:
                            'It sounds the selected tone and octave as much as the beat you entered.',
                        hamsterlite_rest_for: 'Rests as much as the beat you entered.',
                        hamsterlite_set_both_wheels_to:
                            'Sets the speed of the left and right wheels to the entered values (-100 to 100%), respectively. If you enter a positive value, the wheel rotates forward. If you enter a negative value, the wheel rotates backward. Entering the number 0 stops it.',
                        hamsterlite_set_buzzer_to:
                            'Sets the pitch of the buzzer sound to the entered value (Hz). You can enter up to two decimal places. Entering the number 0 turns off the buzzer sound.',
                        hamsterlite_set_following_speed_to:
                            'Sets the speed (1 to 8) to move along the line. The larger the number, the faster the movement.',
                        hamsterlite_set_led_to: 'Turns left/right/both LEDs to the selected color.',
                        hamsterlite_set_output_to:
                            'Sets the output value of the selected external port to the entered value. The value has the following range according to the mode of external port.<br/>Servo output: valid range from 1 to 180 degrees; if 0, output 0 without PWM pulse<br/>PWM output: 0 to 100%, duty ratio (%) of ON state in PWM waveform<br/>Digital output: LOW when 0, otherwise HIGH',
                        hamsterlite_set_port_to:
                            'Sets the io mode of the selected external port to the selected mode.',
                        hamsterlite_set_tempo_to:
                            'Sets the playing or resting speed to the entered BPM (beats per minute).',
                        hamsterlite_set_wheel_to:
                            'Sets the speed of the left/right/both wheels to the entered value (-100 to 100%). If you enter a positive value, the wheel rotates forward. If you enter a negative value, the wheel rotates backward. Entering the number 0 stops it.',
                        hamsterlite_stop: 'Stops both wheels.',
                        hamsterlite_turn_for_secs:
                            'Turns left/right for the number of seconds entered.',
                        hamsterlite_turn_once: 'Turns left/right 90 degrees on the board.',
                        hamsterlite_value:
                            'left proximity: value of left proximity sensor (range: 0 to 255, initial value: 0)<br/>right proximity: value of right proximity sensor (range: 0 to 255, initial value: 0)<br/>left floor: value of left floor sensor (range: 0 to 100, initial value: 0)<br/>right floor: value of right floor sensor (range: 0 to 100, initial value: 0)<br/>x acceleration: x-axis value of acceleration sensor (range: -32768 to 32767, initial value: 0) The direction in which the robot moves forward is the positive direction of the x axis.<br/>y acceleration: y-axis value of acceleration sensor (range: -32768 to 32767, initial value: 0) The left direction of the robot is the positive direction of the y axis.<br/>z acceleration: z-axis value of acceleration sensor (range: -32768 to 32767, initial value: 0) The upward direction of the robot is the positive direction of the z axis.<br/>light: value of light sensor (range: 0 to 65535, initial value: 0) The brighter, the larger the value.<br/>temperature: temperature value inside the robot (range: -40 to 88 degrees Celsius, initial value: 0)<br/>signal strength: signal strength of Bluetooth communication (range: -128 to 0 dBm, initial value: 0) As the signal strength increases, the value increases.<br/>input A: value of signal input to external port A (range: analog input 0 to 255, digital input 0 or 1, initial value: 0)<br/>input B: value of signal input to external port B (range: analog input 0 to 255, digital input 0 or 1, initial value: 0)',
                    },
                    Blocks: {
                        hamsterlite_hand_found: 'hand found?',
                        hamsterlite_sensor_left_proximity: 'left proximity',
                        hamsterlite_sensor_right_proximity: 'right proximity',
                        hamsterlite_sensor_left_floor: 'left floor',
                        hamsterlite_sensor_right_floor: 'right floor',
                        hamsterlite_sensor_acceleration_x: 'x acceleration',
                        hamsterlite_sensor_acceleration_y: 'y acceleration',
                        hamsterlite_sensor_acceleration_z: 'z acceleration',
                        hamsterlite_sensor_light: 'light',
                        hamsterlite_sensor_temperature: 'temperature',
                        hamsterlite_sensor_signal_strength: 'signal strength',
                        hamsterlite_sensor_input_a: 'input A',
                        hamsterlite_sensor_input_b: 'input B',
                        hamsterlite_move_forward_once: 'move forward once on board',
                        hamsterlite_turn_once_1: 'turn',
                        hamsterlite_turn_once_2: 'once on board',
                        hamsterlite_turn_once_left: 'left',
                        hamsterlite_turn_right: 'right',
                        hamsterlite_move_forward: 'move forward',
                        hamsterlite_move_backward: 'move backward',
                        hamsterlite_turn_around_1: 'turn',
                        hamsterlite_turn_around_2: '',
                        hamsterlite_move_forward_for_secs_1: 'move forward for',
                        hamsterlite_move_forward_for_secs_2: 'secs',
                        hamsterlite_move_backward_for_secs_1: 'move backward',
                        hamsterlite_move_backward_for_secs_2: 'secs',
                        hamsterlite_turn_for_secs_1: 'turn',
                        hamsterlite_turn_for_secs_2: 'for',
                        hamsterlite_turn_for_secs_3: 'secs',
                        hamsterlite_change_both_wheels_by_1: 'change wheel by left:',
                        hamsterlite_change_both_wheels_by_2: 'right:',
                        hamsterlite_change_both_wheels_by_3: '',
                        hamsterlite_set_both_wheels_to_1: 'set wheel to left:',
                        hamsterlite_set_both_wheels_to_2: 'right:',
                        hamsterlite_set_both_wheels_to_3: '',
                        hamsterlite_change_wheel_by_1: 'change',
                        hamsterlite_change_wheel_by_2: 'wheel by',
                        hamsterlite_change_wheel_by_3: '',
                        hamsterlite_left_wheel: 'left',
                        hamsterlite_right_wheel: 'right',
                        hamsterlite_both_wheels: 'both',
                        hamsterlite_set_wheel_to_1: 'set',
                        hamsterlite_set_wheel_to_2: 'wheel to',
                        hamsterlite_set_wheel_to_3: '',
                        hamsterlite_follow_line_using_1: 'follow',
                        hamsterlite_follow_line_using_2: 'line using',
                        hamsterlite_follow_line_using_3: 'floor sensor',
                        hamsterlite_left_floor_sensor: 'left',
                        hamsterlite_right_floor_sensor: 'right',
                        hamsterlite_both_floor_sensors: 'both',
                        hamsterlite_follow_line_until_1: 'follow',
                        hamsterlite_follow_line_until_2: 'line until',
                        hamsterlite_follow_line_until_3: 'intersection',
                        hamsterlite_left_intersection: 'left',
                        hamsterlite_right_intersection: 'right',
                        hamsterlite_front_intersection: 'front',
                        hamsterlite_rear_intersection: 'rear',
                        hamsterlite_set_following_speed_to_1: 'set following speed to',
                        hamsterlite_set_following_speed_to_2: '',
                        hamsterlite_front: 'front',
                        hamsterlite_rear: 'rear',
                        hamsterlite_stop: 'stop',
                        hamsterlite_set_led_to_1: 'set',
                        hamsterlite_set_led_to_2: 'led to',
                        hamsterlite_set_led_to_3: '',
                        hamsterlite_left_led: 'left',
                        hamsterlite_right_led: 'right',
                        hamsterlite_both_leds: 'both',
                        hamsterlite_clear_led_1: 'clear',
                        hamsterlite_clear_led_2: 'led',
                        hamsterlite_color_cyan: 'sky blue',
                        hamsterlite_color_magenta: 'purple',
                        hamsterlite_color_black: 'black',
                        hamsterlite_color_white: 'white',
                        hamsterlite_color_red: 'red',
                        hamsterlite_color_yellow: 'yellow',
                        hamsterlite_color_green: 'green',
                        hamsterlite_color_blue: 'blue',
                        hamsterlite_beep: 'beep',
                        hamsterlite_change_buzzer_by_1: 'change buzzer by',
                        hamsterlite_change_buzzer_by_2: '',
                        hamsterlite_set_buzzer_to_1: 'set buzzer to',
                        hamsterlite_set_buzzer_to_2: '',
                        hamsterlite_clear_buzzer: 'clear buzzer',
                        hamsterlite_play_note_for_1: 'play note',
                        hamsterlite_play_note_for_2: '',
                        hamsterlite_play_note_for_3: 'for',
                        hamsterlite_play_note_for_4: 'beats',
                        hamsterlite_rest_for_1: 'rest for',
                        hamsterlite_rest_for_2: 'beats',
                        hamsterlite_change_tempo_by_1: 'change tempo by',
                        hamsterlite_change_tempo_by_2: '',
                        hamsterlite_set_tempo_to_1: 'set tempo to',
                        hamsterlite_set_tempo_to_2: 'bpm',
                        hamsterlite_set_port_to_1: 'set port',
                        hamsterlite_set_port_to_2: 'to',
                        hamsterlite_set_port_to_3: '',
                        hamsterlite_change_output_by_1: 'change output',
                        hamsterlite_change_output_by_2: 'by',
                        hamsterlite_change_output_by_3: '',
                        hamsterlite_set_output_to_1: 'set output',
                        hamsterlite_set_output_to_2: 'to',
                        hamsterlite_set_output_to_3: '',
                        hamsterlite_port_a: 'A',
                        hamsterlite_port_b: 'B',
                        hamsterlite_port_ab: 'A and B',
                        hamsterlite_analog_input: 'analog input',
                        hamsterlite_digital_input: 'digital input',
                        hamsterlite_servo_output: 'servo output',
                        hamsterlite_pwm_output: 'pwm output',
                        hamsterlite_digital_output: 'digital output',
                        hamsterlite_note_c: 'C',
                        hamsterlite_note_c_sharp: 'C♯(D♭)',
                        hamsterlite_note_d: 'D',
                        hamsterlite_note_d_sharp: 'D♯(E♭)',
                        hamsterlite_note_e: 'E',
                        hamsterlite_note_f: 'F',
                        hamsterlite_note_f_sharp: 'F♯(G♭)',
                        hamsterlite_note_g: 'G',
                        hamsterlite_note_g_sharp: 'G♯(A♭)',
                        hamsterlite_note_a: 'A',
                        hamsterlite_note_a_sharp: 'A♯(B♭)',
                        hamsterlite_note_b: 'B',
                        hamsterlite_tilt_forward: 'tilt forward',
                        hamsterlite_tilt_backward: 'tilt backward',
                        hamsterlite_tilt_left: 'tilt left',
                        hamsterlite_tilt_right: 'tilt right',
                        hamsterlite_tilt_flip: 'tilt flip',
                        hamsterlite_tilt_not: 'not tilt',
                        hamsterlite_battery_normal: 'battery normal',
                        hamsterlite_battery_low: 'battery low',
                        hamsterlite_battery_empty: 'battery empty',
                        hamsterlite_open_gripper: 'open',
                        hamsterlite_close_gripper: 'close',
                    },
                },
                jp: {
                    template: {
                        hamsterlite_gripper: 'グリッパを %1 %2',
                        hamsterlite_release_gripper: 'グリッパをオフ %1',
                        hamsterlite_boolean: '%1?',
                        hamsterlite_play_note: '%1 %2 を演奏する %3',
                    },
                    Helper: {
                        hamsterlite_gripper: 'Opens or closes the gripper.',
                        hamsterlite_release_gripper:
                            'Turns off the gripper so that it can be moved freely.',
                        hamsterlite_boolean:
                            'tilt forward: If tilted forward, true, otherwise false<br/>tilt backward: If tilted backward, true, otherwise false<br/>tilt left: If tilted to the left, true, otherwise false<br/>tilt right: If tilted to the right, true, otherwise false<br/>tilt flip: If upside-down, true, otherwise false<br/>not tilt: If not tilted, true, otherwise false<br/>battery normal: If the battery is enough, true, otherwise false<br/>battery low: If the battery is low, true, otherwise false<br/>battery empty: If the battery is empty, true, otherwise false',
                        hamsterlite_play_note: '選択された音階（音名、オクターブ）が鳴ります。',
                    },
                    Blocks: {
                        hamsterlite_note_c: 'ド',
                        hamsterlite_note_c_sharp: 'ド♯(レ♭)',
                        hamsterlite_note_d: 'レ',
                        hamsterlite_note_d_sharp: 'レ♯(ミ♭)',
                        hamsterlite_note_e: 'ミ',
                        hamsterlite_note_f: 'ファ',
                        hamsterlite_note_f_sharp: 'ファ♯(ソ♭)',
                        hamsterlite_note_g: 'ソ',
                        hamsterlite_note_g_sharp: 'ソ♯(ラ♭)',
                        hamsterlite_note_a: 'ラ',
                        hamsterlite_note_a_sharp: 'ラ♯(シ♭)',
                        hamsterlite_note_b: 'シ',
                        hamsterlite_tilt_forward: '前に傾けたか',
                        hamsterlite_tilt_backward: '後に傾けたか',
                        hamsterlite_tilt_left: '左に傾けたか',
                        hamsterlite_tilt_right: '右に傾けたか',
                        hamsterlite_tilt_flip: '上下裏返したか',
                        hamsterlite_tilt_not: '傾けなかったか',
                        hamsterlite_battery_normal: '電池が正常か',
                        hamsterlite_battery_low: '電池が足りないか',
                        hamsterlite_battery_empty: '電池がないか',
                        hamsterlite_open_gripper: '開く',
                        hamsterlite_close_gripper: '閉める',
                    },
                },
                vn: {
                    template: {
                        hamsterlite_gripper: '%1 gripper %2',
                        hamsterlite_release_gripper: 'release gripper %1',
                        hamsterlite_boolean: '%1?',
                        hamsterlite_play_note: 'play note %1 %2 %3',
                    },
                    Helper: {
                        hamsterlite_gripper: 'Opens or closes the gripper.',
                        hamsterlite_release_gripper:
                            'Turns off the gripper so that it can be moved freely.',
                        hamsterlite_boolean:
                            'tilt forward: If tilted forward, true, otherwise false<br/>tilt backward: If tilted backward, true, otherwise false<br/>tilt left: If tilted to the left, true, otherwise false<br/>tilt right: If tilted to the right, true, otherwise false<br/>tilt flip: If upside-down, true, otherwise false<br/>not tilt: If not tilted, true, otherwise false<br/>battery normal: If the battery is enough, true, otherwise false<br/>battery low: If the battery is low, true, otherwise false<br/>battery empty: If the battery is empty, true, otherwise false',
                        hamsterlite_play_note: 'It sounds the selected tone and octave.',
                    },
                    Blocks: {
                        hamsterlite_note_c: 'C',
                        hamsterlite_note_c_sharp: 'C♯(D♭)',
                        hamsterlite_note_d: 'D',
                        hamsterlite_note_d_sharp: 'D♯(E♭)',
                        hamsterlite_note_e: 'E',
                        hamsterlite_note_f: 'F',
                        hamsterlite_note_f_sharp: 'F♯(G♭)',
                        hamsterlite_note_g: 'G',
                        hamsterlite_note_g_sharp: 'G♯(A♭)',
                        hamsterlite_note_a: 'A',
                        hamsterlite_note_a_sharp: 'A♯(B♭)',
                        hamsterlite_note_b: 'B',
                        hamsterlite_tilt_forward: 'tilt forward',
                        hamsterlite_tilt_backward: 'tilt backward',
                        hamsterlite_tilt_left: 'tilt left',
                        hamsterlite_tilt_right: 'tilt right',
                        hamsterlite_tilt_flip: 'tilt flip',
                        hamsterlite_tilt_not: 'not tilt',
                        hamsterlite_battery_normal: 'battery normal',
                        hamsterlite_battery_low: 'battery low',
                        hamsterlite_battery_empty: 'battery empty',
                        hamsterlite_open_gripper: 'open',
                        hamsterlite_close_gripper: 'close',
                    },
                },
            };
        }
        // 구형 블록은 isNotFor: ['HamsterLite'], 즉 "햄스터 항목에서만 보임"이다. 햄스터S 항목은
        // 설치형과 같은 자기 블록(hamsterslite_*)을 쓴다. 정의는 계속 전역에 등록되므로 이 블록으로
        // 저장된 기존 햄스터S 작품도 열리고 실행된다. 팔레트에만 안 나온다.
        getBlocks() {
            return {
                hamsterlite_hand_found: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    fontColor: '#fff',
                    skeleton: 'basic_boolean_field',
                    statements: [],
                    params: [],
                    events: {},
                    def: {
                        params: [],
                        type: 'hamsterlite_hand_found',
                    },
                    class: 'hamsterlite_sensor',
                    isNotFor: ['HamsterLite'],
                    func(sprite, script) {
                        return activeHamster().checkHandFound(script) || false;
                    },
                    syntax: {
                        js: [],
                        py: [
                            {
                                syntax: 'Hamsterlite.hand_found()',
                                blockType: 'param',
                            },
                        ],
                    },
                },
                hamsterlite_boolean: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    fontColor: '#fff',
                    skeleton: 'basic_boolean_field',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.hamsterlite_tilt_forward, 'TILT_FORWARD'],
                                [Lang.Blocks.hamsterlite_tilt_backward, 'TILT_BACKWARD'],
                                [Lang.Blocks.hamsterlite_tilt_left, 'TILT_LEFT'],
                                [Lang.Blocks.hamsterlite_tilt_right, 'TILT_RIGHT'],
                                [Lang.Blocks.hamsterlite_tilt_flip, 'TILT_FLIP'],
                                [Lang.Blocks.hamsterlite_tilt_not, 'TILT_NOT'],
                                [Lang.Blocks.hamsterlite_battery_normal, 'BATTERY_NORMAL'],
                                [Lang.Blocks.hamsterlite_battery_low, 'BATTERY_LOW'],
                                [Lang.Blocks.hamsterlite_battery_empty, 'BATTERY_EMPTY'],
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
                        type: 'hamsterlite_boolean',
                    },
                    paramsKeyMap: {
                        DEVICE: 0,
                    },
                    class: 'hamsterlite_sensor',
                    isNotFor: ['HamsterLite'],
                    func(sprite, script) {
                        return activeHamster().checkBoolean(script) || false;
                    },
                    syntax: {
                        js: [],
                        py: [
                            {
                                syntax: 'Hamsterlite.boolean_value(%1)',
                                blockType: 'param',
                                textParams: [
                                    {
                                        type: 'Dropdown',
                                        options: [
                                            [Lang.Blocks.hamsterlite_tilt_forward, 'TILT_FORWARD'],
                                            [
                                                Lang.Blocks.hamsterlite_tilt_backward,
                                                'TILT_BACKWARD',
                                            ],
                                            [Lang.Blocks.hamsterlite_tilt_left, 'TILT_LEFT'],
                                            [Lang.Blocks.hamsterlite_tilt_right, 'TILT_RIGHT'],
                                            [Lang.Blocks.hamsterlite_tilt_flip, 'TILT_FLIP'],
                                            [Lang.Blocks.hamsterlite_tilt_not, 'TILT_NOT'],
                                            [
                                                Lang.Blocks.hamsterlite_battery_normal,
                                                'BATTERY_NORMAL',
                                            ],
                                            [Lang.Blocks.hamsterlite_battery_low, 'BATTERY_LOW'],
                                            [
                                                Lang.Blocks.hamsterlite_battery_empty,
                                                'BATTERY_EMPTY',
                                            ],
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
                hamsterlite_value: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    fontColor: '#fff',
                    skeleton: 'basic_string_field',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.hamsterlite_sensor_left_proximity, 'leftProximity'],
                                [Lang.Blocks.hamsterlite_sensor_right_proximity, 'rightProximity'],
                                [Lang.Blocks.hamsterlite_sensor_left_floor, 'leftFloor'],
                                [Lang.Blocks.hamsterlite_sensor_right_floor, 'rightFloor'],
                                [Lang.Blocks.hamsterlite_sensor_acceleration_x, 'accelerationX'],
                                [Lang.Blocks.hamsterlite_sensor_acceleration_y, 'accelerationY'],
                                [Lang.Blocks.hamsterlite_sensor_acceleration_z, 'accelerationZ'],
                                [Lang.Blocks.hamsterlite_sensor_light, 'light'],
                                [Lang.Blocks.hamsterlite_sensor_temperature, 'temperature'],
                                [Lang.Blocks.hamsterlite_sensor_signal_strength, 'signalStrength'],
                                [Lang.Blocks.hamsterlite_sensor_input_a, 'inputA'],
                                [Lang.Blocks.hamsterlite_sensor_input_b, 'inputB'],
                            ],
                            value: 'leftProximity',
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                    ],
                    events: {},
                    def: {
                        params: [null],
                        type: 'hamsterlite_value',
                    },
                    paramsKeyMap: {
                        DEVICE: 0,
                    },
                    class: 'hamsterlite_sensor',
                    isNotFor: ['HamsterLite'],
                    func(sprite, script) {
                        return activeHamster().getValue(script);
                    },
                    syntax: {
                        js: [],
                        py: [
                            {
                                syntax: 'Hamsterlite.sensor_value(%1)',
                                blockType: 'param',
                                textParams: [
                                    {
                                        type: 'Dropdown',
                                        options: [
                                            [
                                                Lang.Blocks.hamsterlite_sensor_left_proximity,
                                                'leftProximity',
                                            ],
                                            [
                                                Lang.Blocks.hamsterlite_sensor_right_proximity,
                                                'rightProximity',
                                            ],
                                            [
                                                Lang.Blocks.hamsterlite_sensor_left_floor,
                                                'leftFloor',
                                            ],
                                            [
                                                Lang.Blocks.hamsterlite_sensor_right_floor,
                                                'rightFloor',
                                            ],
                                            [
                                                Lang.Blocks.hamsterlite_sensor_acceleration_x,
                                                'accelerationX',
                                            ],
                                            [
                                                Lang.Blocks.hamsterlite_sensor_acceleration_y,
                                                'accelerationY',
                                            ],
                                            [
                                                Lang.Blocks.hamsterlite_sensor_acceleration_z,
                                                'accelerationZ',
                                            ],
                                            [Lang.Blocks.hamsterlite_sensor_light, 'light'],
                                            [
                                                Lang.Blocks.hamsterlite_sensor_temperature,
                                                'temperature',
                                            ],
                                            [
                                                Lang.Blocks.hamsterlite_sensor_signal_strength,
                                                'signalStrength',
                                            ],
                                            [Lang.Blocks.hamsterlite_sensor_input_a, 'inputA'],
                                            [Lang.Blocks.hamsterlite_sensor_input_b, 'inputB'],
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
                hamsterlite_move_forward_once: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
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
                        params: [null],
                        type: 'hamsterlite_move_forward_once',
                    },
                    class: 'hamsterlite_board',
                    isNotFor: ['HamsterLite'],
                    func(sprite, script) {
                        return activeHamster().boardForward(script);
                    },
                    syntax: {
                        js: [],
                        py: [
                            {
                                syntax: 'Hamsterlite.board_forward()',
                            },
                        ],
                    },
                },
                hamsterlite_turn_once: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.hamsterlite_turn_once_left, 'LEFT'],
                                [Lang.Blocks.hamsterlite_turn_right, 'RIGHT'],
                            ],
                            value: 'LEFT',
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                        {
                            type: 'Indicator',
                            img: 'block_icon/hardwarelite_icon.svg',
                            size: 12,
                        },
                    ],
                    events: {},
                    def: {
                        params: [null, null],
                        type: 'hamsterlite_turn_once',
                    },
                    paramsKeyMap: {
                        DIRECTION: 0,
                    },
                    class: 'hamsterlite_board',
                    isNotFor: ['HamsterLite'],
                    func(sprite, script) {
                        return activeHamster().boardTurn(script);
                    },
                    syntax: {
                        js: [],
                        py: [
                            {
                                syntax: 'Hamsterlite.board_turn(%1)',
                                textParams: [
                                    {
                                        type: 'Dropdown',
                                        options: [
                                            [Lang.Blocks.hamsterlite_turn_once_left, 'LEFT'],
                                            [Lang.Blocks.hamsterlite_turn_right, 'RIGHT'],
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
                hamsterlite_move_forward_for_secs: {
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
                            img: 'block_icon/hardwarelite_icon.svg',
                            size: 12,
                        },
                    ],
                    events: {},
                    def: {
                        params: [
                            {
                                type: 'text',
                                params: ['1'],
                            },
                            null,
                        ],
                        type: 'hamsterlite_move_forward_for_secs',
                    },
                    paramsKeyMap: {
                        SECS: 0,
                    },
                    class: 'hamsterlite_wheel',
                    isNotFor: ['HamsterLite'],
                    func(sprite, script) {
                        return activeHamster().moveForwardSecs(script);
                    },
                    syntax: {
                        js: [],
                        py: [
                            {
                                syntax: 'Hamsterlite.move_forward(%1)',
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
                hamsterlite_move_backward_for_secs: {
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
                            img: 'block_icon/hardwarelite_icon.svg',
                            size: 12,
                        },
                    ],
                    events: {},
                    def: {
                        params: [
                            {
                                type: 'text',
                                params: ['1'],
                            },
                            null,
                        ],
                        type: 'hamsterlite_move_backward_for_secs',
                    },
                    paramsKeyMap: {
                        SECS: 0,
                    },
                    class: 'hamsterlite_wheel',
                    isNotFor: ['HamsterLite'],
                    func(sprite, script) {
                        return activeHamster().moveBackwardSecs(script);
                    },
                    syntax: {
                        js: [],
                        py: [
                            {
                                syntax: 'Hamsterlite.move_backward(%1)',
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
                hamsterlite_turn_for_secs: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.hamsterlite_turn_once_left, 'LEFT'],
                                [Lang.Blocks.hamsterlite_turn_right, 'RIGHT'],
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
                            img: 'block_icon/hardwarelite_icon.svg',
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
                        type: 'hamsterlite_turn_for_secs',
                    },
                    paramsKeyMap: {
                        DIRECTION: 0,
                        SECS: 1,
                    },
                    class: 'hamsterlite_wheel',
                    isNotFor: ['HamsterLite'],
                    func(sprite, script) {
                        return activeHamster().turnSecs(script);
                    },
                    syntax: {
                        js: [],
                        py: [
                            {
                                syntax: 'Hamsterlite.turn(%1, %2)',
                                textParams: [
                                    {
                                        type: 'Dropdown',
                                        options: [
                                            [Lang.Blocks.hamsterlite_turn_once_left, 'LEFT'],
                                            [Lang.Blocks.hamsterlite_turn_right, 'RIGHT'],
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
                hamsterlite_change_both_wheels_by: {
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
                            img: 'block_icon/hardwarelite_icon.svg',
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
                        type: 'hamsterlite_change_both_wheels_by',
                    },
                    paramsKeyMap: {
                        LEFT: 0,
                        RIGHT: 1,
                    },
                    class: 'hamsterlite_wheel',
                    isNotFor: ['HamsterLite'],
                    func(sprite, script) {
                        return activeHamster().changeWheels(script);
                    },
                    syntax: {
                        js: [],
                        py: [
                            {
                                syntax: 'Hamsterlite.add_wheels(%1, %2)',
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
                hamsterlite_set_both_wheels_to: {
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
                            img: 'block_icon/hardwarelite_icon.svg',
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
                        type: 'hamsterlite_set_both_wheels_to',
                    },
                    paramsKeyMap: {
                        LEFT: 0,
                        RIGHT: 1,
                    },
                    class: 'hamsterlite_wheel',
                    isNotFor: ['HamsterLite'],
                    func(sprite, script) {
                        return activeHamster().setWheels(script);
                    },
                    syntax: {
                        js: [],
                        py: [
                            {
                                syntax: 'Hamsterlite.set_wheels(%1, %2)',
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
                hamsterlite_change_wheel_by: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.hamsterlite_left_wheel, 'LEFT'],
                                [Lang.Blocks.hamsterlite_right_wheel, 'RIGHT'],
                                [Lang.Blocks.hamsterlite_both_wheels, 'BOTH'],
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
                            img: 'block_icon/hardwarelite_icon.svg',
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
                        type: 'hamsterlite_change_wheel_by',
                    },
                    paramsKeyMap: {
                        WHEEL: 0,
                        VELOCITY: 1,
                    },
                    class: 'hamsterlite_wheel',
                    isNotFor: ['HamsterLite'],
                    func(sprite, script) {
                        return activeHamster().changeWheel(script);
                    },
                    syntax: {
                        js: [],
                        py: [
                            {
                                syntax: 'Hamsterlite.add_wheel(%1, %2)',
                                textParams: [
                                    {
                                        type: 'Dropdown',
                                        options: [
                                            [Lang.Blocks.hamsterlite_left_wheel, 'LEFT'],
                                            [Lang.Blocks.hamsterlite_right_wheel, 'RIGHT'],
                                            [Lang.Blocks.hamsterlite_both_wheels, 'BOTH'],
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
                hamsterlite_set_wheel_to: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.hamsterlite_left_wheel, 'LEFT'],
                                [Lang.Blocks.hamsterlite_right_wheel, 'RIGHT'],
                                [Lang.Blocks.hamsterlite_both_wheels, 'BOTH'],
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
                            img: 'block_icon/hardwarelite_icon.svg',
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
                        type: 'hamsterlite_set_wheel_to',
                    },
                    paramsKeyMap: {
                        WHEEL: 0,
                        VELOCITY: 1,
                    },
                    class: 'hamsterlite_wheel',
                    isNotFor: ['HamsterLite'],
                    func(sprite, script) {
                        return activeHamster().setWheel(script);
                    },
                    syntax: {
                        js: [],
                        py: [
                            {
                                syntax: 'Hamsterlite.set_wheel(%1, %2)',
                                textParams: [
                                    {
                                        type: 'Dropdown',
                                        options: [
                                            [Lang.Blocks.hamsterlite_left_wheel, 'LEFT'],
                                            [Lang.Blocks.hamsterlite_right_wheel, 'RIGHT'],
                                            [Lang.Blocks.hamsterlite_both_wheels, 'BOTH'],
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
                hamsterlite_follow_line_using: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.hamsterlite_color_black, 'BLACK'],
                                [Lang.Blocks.hamsterlite_color_white, 'WHITE'],
                            ],
                            value: 'BLACK',
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.hamsterlite_left_floor_sensor, 'LEFT'],
                                [Lang.Blocks.hamsterlite_right_floor_sensor, 'RIGHT'],
                                [Lang.Blocks.hamsterlite_both_floor_sensors, 'BOTH'],
                            ],
                            value: 'LEFT',
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                        {
                            type: 'Indicator',
                            img: 'block_icon/hardwarelite_icon.svg',
                            size: 12,
                        },
                    ],
                    events: {},
                    def: {
                        params: [null, null, null],
                        type: 'hamsterlite_follow_line_using',
                    },
                    paramsKeyMap: {
                        COLOR: 0,
                        SENSOR: 1,
                    },
                    class: 'hamsterlite_wheel',
                    isNotFor: ['HamsterLite'],
                    func(sprite, script) {
                        return activeHamster().followLine(script);
                    },
                    syntax: {
                        js: [],
                        py: [
                            {
                                syntax: 'Hamsterlite.follow_line(%1, %2)',
                                textParams: [
                                    {
                                        type: 'Dropdown',
                                        options: [
                                            [Lang.Blocks.hamsterlite_color_black, 'BLACK'],
                                            [Lang.Blocks.hamsterlite_color_white, 'WHITE'],
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
                                            [Lang.Blocks.hamsterlite_left_floor_sensor, 'LEFT'],
                                            [Lang.Blocks.hamsterlite_right_floor_sensor, 'RIGHT'],
                                            [Lang.Blocks.hamsterlite_both_floor_sensors, 'BOTH'],
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
                hamsterlite_follow_line_until: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.hamsterlite_color_black, 'BLACK'],
                                [Lang.Blocks.hamsterlite_color_white, 'WHITE'],
                            ],
                            value: 'BLACK',
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.hamsterlite_left_floor_sensor, 'LEFT'],
                                [Lang.Blocks.hamsterlite_right_floor_sensor, 'RIGHT'],
                                [Lang.Blocks.hamsterlite_front, 'FRONT'],
                                [Lang.Blocks.hamsterlite_rear, 'REAR'],
                            ],
                            value: 'FRONT',
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                        {
                            type: 'Indicator',
                            img: 'block_icon/hardwarelite_icon.svg',
                            size: 12,
                        },
                    ],
                    events: {},
                    def: {
                        params: [null, null, null],
                        type: 'hamsterlite_follow_line_until',
                    },
                    paramsKeyMap: {
                        COLOR: 0,
                        DIRECTION: 1,
                    },
                    class: 'hamsterlite_wheel',
                    isNotFor: ['HamsterLite'],
                    func(sprite, script) {
                        return activeHamster().followLineUntil(script);
                    },
                    syntax: {
                        js: [],
                        py: [
                            {
                                syntax: 'Hamsterlite.follow_line_until(%1, %2)',
                                textParams: [
                                    {
                                        type: 'Dropdown',
                                        options: [
                                            [Lang.Blocks.hamsterlite_color_black, 'BLACK'],
                                            [Lang.Blocks.hamsterlite_color_white, 'WHITE'],
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
                                            [Lang.Blocks.hamsterlite_left_floor_sensor, 'LEFT'],
                                            [Lang.Blocks.hamsterlite_right_floor_sensor, 'RIGHT'],
                                            [Lang.Blocks.hamsterlite_front, 'FRONT'],
                                            [Lang.Blocks.hamsterlite_rear, 'REAR'],
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
                hamsterlite_set_following_speed_to: {
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
                            img: 'block_icon/hardwarelite_icon.svg',
                            size: 12,
                        },
                    ],
                    events: {},
                    def: {
                        params: ['5', null],
                        type: 'hamsterlite_set_following_speed_to',
                    },
                    paramsKeyMap: {
                        SPEED: 0,
                    },
                    class: 'hamsterlite_wheel',
                    isNotFor: ['HamsterLite'],
                    func(sprite, script) {
                        return activeHamster().setLineTracerSpeed(script);
                    },
                    syntax: {
                        js: [],
                        py: [
                            {
                                syntax: 'Hamsterlite.set_line_speed(%1)',
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
                                        converter:
                                            Entry.block.converters.returnStringOrNumberByValue,
                                    },
                                ],
                            },
                        ],
                    },
                },
                hamsterlite_stop: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
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
                        params: [null],
                        type: 'hamsterlite_stop',
                    },
                    class: 'hamsterlite_wheel',
                    isNotFor: ['HamsterLite'],
                    func(sprite, script) {
                        return activeHamster().stop(script);
                    },
                    syntax: {
                        js: [],
                        py: [
                            {
                                syntax: 'Hamsterlite.stop()',
                            },
                        ],
                    },
                },
                hamsterlite_set_led_to: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.hamsterlite_left_led, 'LEFT'],
                                [Lang.Blocks.hamsterlite_right_led, 'RIGHT'],
                                [Lang.Blocks.hamsterlite_both_leds, 'BOTH'],
                            ],
                            value: 'LEFT',
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.hamsterlite_color_red, '4'],
                                [Lang.Blocks.hamsterlite_color_yellow, '6'],
                                [Lang.Blocks.hamsterlite_color_green, '2'],
                                [Lang.Blocks.hamsterlite_color_cyan, '3'],
                                [Lang.Blocks.hamsterlite_color_blue, '1'],
                                [Lang.Blocks.hamsterlite_color_magenta, '5'],
                                [Lang.Blocks.hamsterlite_color_white, '7'],
                            ],
                            value: '4',
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                        {
                            type: 'Indicator',
                            img: 'block_icon/hardwarelite_icon.svg',
                            size: 12,
                        },
                    ],
                    events: {},
                    def: {
                        params: [null, null, null],
                        type: 'hamsterlite_set_led_to',
                    },
                    paramsKeyMap: {
                        LED: 0,
                        COLOR: 1,
                    },
                    class: 'hamsterlite_led',
                    isNotFor: ['HamsterLite'],
                    func(sprite, script) {
                        return activeHamster().setLed(script);
                    },
                    syntax: {
                        js: [],
                        py: [
                            {
                                syntax: 'Hamsterlite.set_led_red(%1)',
                                textParams: [
                                    {
                                        type: 'Dropdown',
                                        options: [
                                            [Lang.Blocks.hamsterlite_left_led, 'LEFT'],
                                            [Lang.Blocks.hamsterlite_right_led, 'RIGHT'],
                                            [Lang.Blocks.hamsterlite_both_leds, 'BOTH'],
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
                                            [Lang.Blocks.hamsterlite_color_red, '4'],
                                            [Lang.Blocks.hamsterlite_color_yellow, '6'],
                                            [Lang.Blocks.hamsterlite_color_green, '2'],
                                            [Lang.Blocks.hamsterlite_color_cyan, '3'],
                                            [Lang.Blocks.hamsterlite_color_blue, '1'],
                                            [Lang.Blocks.hamsterlite_color_magenta, '5'],
                                            [Lang.Blocks.hamsterlite_color_white, '7'],
                                        ],
                                        value: '4',
                                        fontSize: 11,
                                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                        converter: Entry.block.converters.returnStringValue,
                                    },
                                ],
                                params: [null, '4'],
                            },
                            {
                                syntax: 'Hamsterlite.set_led_yellow(%1)',
                                textParams: [
                                    {
                                        type: 'Dropdown',
                                        options: [
                                            [Lang.Blocks.hamsterlite_left_led, 'LEFT'],
                                            [Lang.Blocks.hamsterlite_right_led, 'RIGHT'],
                                            [Lang.Blocks.hamsterlite_both_leds, 'BOTH'],
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
                                            [Lang.Blocks.hamsterlite_color_red, '4'],
                                            [Lang.Blocks.hamsterlite_color_yellow, '6'],
                                            [Lang.Blocks.hamsterlite_color_green, '2'],
                                            [Lang.Blocks.hamsterlite_color_cyan, '3'],
                                            [Lang.Blocks.hamsterlite_color_blue, '1'],
                                            [Lang.Blocks.hamsterlite_color_magenta, '5'],
                                            [Lang.Blocks.hamsterlite_color_white, '7'],
                                        ],
                                        value: '4',
                                        fontSize: 11,
                                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                        converter: Entry.block.converters.returnStringValue,
                                    },
                                ],
                                params: [null, '6'],
                            },
                            {
                                syntax: 'Hamsterlite.set_led_green(%1)',
                                textParams: [
                                    {
                                        type: 'Dropdown',
                                        options: [
                                            [Lang.Blocks.hamsterlite_left_led, 'LEFT'],
                                            [Lang.Blocks.hamsterlite_right_led, 'RIGHT'],
                                            [Lang.Blocks.hamsterlite_both_leds, 'BOTH'],
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
                                            [Lang.Blocks.hamsterlite_color_red, '4'],
                                            [Lang.Blocks.hamsterlite_color_yellow, '6'],
                                            [Lang.Blocks.hamsterlite_color_green, '2'],
                                            [Lang.Blocks.hamsterlite_color_cyan, '3'],
                                            [Lang.Blocks.hamsterlite_color_blue, '1'],
                                            [Lang.Blocks.hamsterlite_color_magenta, '5'],
                                            [Lang.Blocks.hamsterlite_color_white, '7'],
                                        ],
                                        value: '4',
                                        fontSize: 11,
                                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                        converter: Entry.block.converters.returnStringValue,
                                    },
                                ],
                                params: [null, '2'],
                            },
                            {
                                syntax: 'Hamsterlite.set_led_sky_blue(%1)',
                                textParams: [
                                    {
                                        type: 'Dropdown',
                                        options: [
                                            [Lang.Blocks.hamsterlite_left_led, 'LEFT'],
                                            [Lang.Blocks.hamsterlite_right_led, 'RIGHT'],
                                            [Lang.Blocks.hamsterlite_both_leds, 'BOTH'],
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
                                            [Lang.Blocks.hamsterlite_color_red, '4'],
                                            [Lang.Blocks.hamsterlite_color_yellow, '6'],
                                            [Lang.Blocks.hamsterlite_color_green, '2'],
                                            [Lang.Blocks.hamsterlite_color_cyan, '3'],
                                            [Lang.Blocks.hamsterlite_color_blue, '1'],
                                            [Lang.Blocks.hamsterlite_color_magenta, '5'],
                                            [Lang.Blocks.hamsterlite_color_white, '7'],
                                        ],
                                        value: '4',
                                        fontSize: 11,
                                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                        converter: Entry.block.converters.returnStringValue,
                                    },
                                ],
                                params: [null, '3'],
                            },
                            {
                                syntax: 'Hamsterlite.set_led_blue(%1)',
                                textParams: [
                                    {
                                        type: 'Dropdown',
                                        options: [
                                            [Lang.Blocks.hamsterlite_left_led, 'LEFT'],
                                            [Lang.Blocks.hamsterlite_right_led, 'RIGHT'],
                                            [Lang.Blocks.hamsterlite_both_leds, 'BOTH'],
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
                                            [Lang.Blocks.hamsterlite_color_red, '4'],
                                            [Lang.Blocks.hamsterlite_color_yellow, '6'],
                                            [Lang.Blocks.hamsterlite_color_green, '2'],
                                            [Lang.Blocks.hamsterlite_color_cyan, '3'],
                                            [Lang.Blocks.hamsterlite_color_blue, '1'],
                                            [Lang.Blocks.hamsterlite_color_magenta, '5'],
                                            [Lang.Blocks.hamsterlite_color_white, '7'],
                                        ],
                                        value: '4',
                                        fontSize: 11,
                                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                        converter: Entry.block.converters.returnStringValue,
                                    },
                                ],
                                params: [null, '1'],
                            },
                            {
                                syntax: 'Hamsterlite.set_led_purple(%1)',
                                textParams: [
                                    {
                                        type: 'Dropdown',
                                        options: [
                                            [Lang.Blocks.hamsterlite_left_led, 'LEFT'],
                                            [Lang.Blocks.hamsterlite_right_led, 'RIGHT'],
                                            [Lang.Blocks.hamsterlite_both_leds, 'BOTH'],
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
                                            [Lang.Blocks.hamsterlite_color_red, '4'],
                                            [Lang.Blocks.hamsterlite_color_yellow, '6'],
                                            [Lang.Blocks.hamsterlite_color_green, '2'],
                                            [Lang.Blocks.hamsterlite_color_cyan, '3'],
                                            [Lang.Blocks.hamsterlite_color_blue, '1'],
                                            [Lang.Blocks.hamsterlite_color_magenta, '5'],
                                            [Lang.Blocks.hamsterlite_color_white, '7'],
                                        ],
                                        value: '4',
                                        fontSize: 11,
                                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                        converter: Entry.block.converters.returnStringValue,
                                    },
                                ],
                                params: [null, '5'],
                            },
                            {
                                syntax: 'Hamsterlite.set_led_white(%1)',
                                textParams: [
                                    {
                                        type: 'Dropdown',
                                        options: [
                                            [Lang.Blocks.hamsterlite_left_led, 'LEFT'],
                                            [Lang.Blocks.hamsterlite_right_led, 'RIGHT'],
                                            [Lang.Blocks.hamsterlite_both_leds, 'BOTH'],
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
                                            [Lang.Blocks.hamsterlite_color_red, '4'],
                                            [Lang.Blocks.hamsterlite_color_yellow, '6'],
                                            [Lang.Blocks.hamsterlite_color_green, '2'],
                                            [Lang.Blocks.hamsterlite_color_cyan, '3'],
                                            [Lang.Blocks.hamsterlite_color_blue, '1'],
                                            [Lang.Blocks.hamsterlite_color_magenta, '5'],
                                            [Lang.Blocks.hamsterlite_color_white, '7'],
                                        ],
                                        value: '4',
                                        fontSize: 11,
                                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                        converter: Entry.block.converters.returnStringValue,
                                    },
                                ],
                                params: [null, '7'],
                            },
                        ],
                    },
                },
                hamsterlite_clear_led: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.hamsterlite_left_led, 'LEFT'],
                                [Lang.Blocks.hamsterlite_right_led, 'RIGHT'],
                                [Lang.Blocks.hamsterlite_both_leds, 'BOTH'],
                            ],
                            value: 'LEFT',
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                        {
                            type: 'Indicator',
                            img: 'block_icon/hardwarelite_icon.svg',
                            size: 12,
                        },
                    ],
                    events: {},
                    def: {
                        params: [null, null],
                        type: 'hamsterlite_clear_led',
                    },
                    paramsKeyMap: {
                        LED: 0,
                    },
                    class: 'hamsterlite_led',
                    isNotFor: ['HamsterLite'],
                    func(sprite, script) {
                        return activeHamster().clearLed(script);
                    },
                    syntax: {
                        js: [],
                        py: [
                            {
                                syntax: 'Hamsterlite.clear_led(%1)',
                                textParams: [
                                    {
                                        type: 'Dropdown',
                                        options: [
                                            [Lang.Blocks.hamsterlite_left_led, 'LEFT'],
                                            [Lang.Blocks.hamsterlite_right_led, 'RIGHT'],
                                            [Lang.Blocks.hamsterlite_both_leds, 'BOTH'],
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
                hamsterlite_beep: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
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
                        params: [null],
                        type: 'hamsterlite_beep',
                    },
                    class: 'hamsterlite_buzzer',
                    isNotFor: ['HamsterLite'],
                    func(sprite, script) {
                        return activeHamster().beep(script);
                    },
                    syntax: {
                        js: [],
                        py: [
                            {
                                syntax: 'Hamsterlite.beep()',
                            },
                        ],
                    },
                },
                hamsterlite_change_buzzer_by: {
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
                            img: 'block_icon/hardwarelite_icon.svg',
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
                        type: 'hamsterlite_change_buzzer_by',
                    },
                    paramsKeyMap: {
                        HZ: 0,
                    },
                    class: 'hamsterlite_buzzer',
                    isNotFor: ['HamsterLite'],
                    func(sprite, script) {
                        return activeHamster().changeBuzzer(script);
                    },
                    syntax: {
                        js: [],
                        py: [
                            {
                                syntax: 'Hamsterlite.add_buzzer(%1)',
                            },
                        ],
                    },
                },
                hamsterlite_set_buzzer_to: {
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
                            img: 'block_icon/hardwarelite_icon.svg',
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
                        type: 'hamsterlite_set_buzzer_to',
                    },
                    paramsKeyMap: {
                        HZ: 0,
                    },
                    class: 'hamsterlite_buzzer',
                    isNotFor: ['HamsterLite'],
                    func(sprite, script) {
                        return activeHamster().setBuzzer(script);
                    },
                    syntax: {
                        js: [],
                        py: [
                            {
                                syntax: 'Hamsterlite.set_buzzer(%1)',
                            },
                        ],
                    },
                },
                hamsterlite_clear_buzzer: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
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
                        params: [null],
                        type: 'hamsterlite_clear_buzzer',
                    },
                    class: 'hamsterlite_buzzer',
                    isNotFor: ['HamsterLite'],
                    func(sprite, script) {
                        return activeHamster().clearBuzzer(script);
                    },
                    syntax: {
                        js: [],
                        py: [
                            {
                                syntax: 'Hamsterlite.clear_buzzer()',
                            },
                        ],
                    },
                },
                hamsterlite_play_note: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.hamsterlite_note_c, '4'],
                                [Lang.Blocks.hamsterlite_note_c_sharp, '5'],
                                [Lang.Blocks.hamsterlite_note_d, '6'],
                                [Lang.Blocks.hamsterlite_note_d_sharp, '7'],
                                [Lang.Blocks.hamsterlite_note_e, '8'],
                                [Lang.Blocks.hamsterlite_note_f, '9'],
                                [Lang.Blocks.hamsterlite_note_f_sharp, '10'],
                                [Lang.Blocks.hamsterlite_note_g, '11'],
                                [Lang.Blocks.hamsterlite_note_g_sharp, '12'],
                                [Lang.Blocks.hamsterlite_note_a, '13'],
                                [Lang.Blocks.hamsterlite_note_a_sharp, '14'],
                                [Lang.Blocks.hamsterlite_note_b, '15'],
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
                            img: 'block_icon/hardwarelite_icon.svg',
                            size: 12,
                        },
                    ],
                    events: {},
                    def: {
                        params: [null, '4', null],
                        type: 'hamsterlite_play_note',
                    },
                    paramsKeyMap: {
                        NOTE: 0,
                        OCTAVE: 1,
                    },
                    class: 'hamsterlite_buzzer',
                    isNotFor: ['HamsterLite'],
                    func(sprite, script) {
                        return activeHamster().playNote(script);
                    },
                    syntax: {
                        js: [],
                        py: [
                            {
                                syntax: 'Hamsterlite.play_pitch_c(%2)',
                                textParams: [
                                    {
                                        type: 'Dropdown',
                                        options: [
                                            [Lang.Blocks.hamsterlite_note_c, '4'],
                                            [Lang.Blocks.hamsterlite_note_c_sharp, '5'],
                                            [Lang.Blocks.hamsterlite_note_d, '6'],
                                            [Lang.Blocks.hamsterlite_note_d_sharp, '7'],
                                            [Lang.Blocks.hamsterlite_note_e, '8'],
                                            [Lang.Blocks.hamsterlite_note_f, '9'],
                                            [Lang.Blocks.hamsterlite_note_f_sharp, '10'],
                                            [Lang.Blocks.hamsterlite_note_g, '11'],
                                            [Lang.Blocks.hamsterlite_note_g_sharp, '12'],
                                            [Lang.Blocks.hamsterlite_note_a, '13'],
                                            [Lang.Blocks.hamsterlite_note_a_sharp, '14'],
                                            [Lang.Blocks.hamsterlite_note_b, '15'],
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
                                        converter:
                                            Entry.block.converters.returnStringOrNumberByValue,
                                    },
                                ],
                                params: ['4'],
                            },
                            {
                                syntax: 'Hamsterlite.play_pitch_c_sharp(%2)',
                                textParams: [
                                    {
                                        type: 'Dropdown',
                                        options: [
                                            [Lang.Blocks.hamsterlite_note_c, '4'],
                                            [Lang.Blocks.hamsterlite_note_c_sharp, '5'],
                                            [Lang.Blocks.hamsterlite_note_d, '6'],
                                            [Lang.Blocks.hamsterlite_note_d_sharp, '7'],
                                            [Lang.Blocks.hamsterlite_note_e, '8'],
                                            [Lang.Blocks.hamsterlite_note_f, '9'],
                                            [Lang.Blocks.hamsterlite_note_f_sharp, '10'],
                                            [Lang.Blocks.hamsterlite_note_g, '11'],
                                            [Lang.Blocks.hamsterlite_note_g_sharp, '12'],
                                            [Lang.Blocks.hamsterlite_note_a, '13'],
                                            [Lang.Blocks.hamsterlite_note_a_sharp, '14'],
                                            [Lang.Blocks.hamsterlite_note_b, '15'],
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
                                        converter:
                                            Entry.block.converters.returnStringOrNumberByValue,
                                    },
                                ],
                                params: ['5'],
                            },
                            {
                                syntax: 'Hamsterlite.play_pitch_d(%2)',
                                textParams: [
                                    {
                                        type: 'Dropdown',
                                        options: [
                                            [Lang.Blocks.hamsterlite_note_c, '4'],
                                            [Lang.Blocks.hamsterlite_note_c_sharp, '5'],
                                            [Lang.Blocks.hamsterlite_note_d, '6'],
                                            [Lang.Blocks.hamsterlite_note_d_sharp, '7'],
                                            [Lang.Blocks.hamsterlite_note_e, '8'],
                                            [Lang.Blocks.hamsterlite_note_f, '9'],
                                            [Lang.Blocks.hamsterlite_note_f_sharp, '10'],
                                            [Lang.Blocks.hamsterlite_note_g, '11'],
                                            [Lang.Blocks.hamsterlite_note_g_sharp, '12'],
                                            [Lang.Blocks.hamsterlite_note_a, '13'],
                                            [Lang.Blocks.hamsterlite_note_a_sharp, '14'],
                                            [Lang.Blocks.hamsterlite_note_b, '15'],
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
                                        converter:
                                            Entry.block.converters.returnStringOrNumberByValue,
                                    },
                                ],
                                params: ['6'],
                            },
                            {
                                syntax: 'Hamsterlite.play_pitch_d_sharp(%2)',
                                textParams: [
                                    {
                                        type: 'Dropdown',
                                        options: [
                                            [Lang.Blocks.hamsterlite_note_c, '4'],
                                            [Lang.Blocks.hamsterlite_note_c_sharp, '5'],
                                            [Lang.Blocks.hamsterlite_note_d, '6'],
                                            [Lang.Blocks.hamsterlite_note_d_sharp, '7'],
                                            [Lang.Blocks.hamsterlite_note_e, '8'],
                                            [Lang.Blocks.hamsterlite_note_f, '9'],
                                            [Lang.Blocks.hamsterlite_note_f_sharp, '10'],
                                            [Lang.Blocks.hamsterlite_note_g, '11'],
                                            [Lang.Blocks.hamsterlite_note_g_sharp, '12'],
                                            [Lang.Blocks.hamsterlite_note_a, '13'],
                                            [Lang.Blocks.hamsterlite_note_a_sharp, '14'],
                                            [Lang.Blocks.hamsterlite_note_b, '15'],
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
                                        converter:
                                            Entry.block.converters.returnStringOrNumberByValue,
                                    },
                                ],
                                params: ['7'],
                            },
                            {
                                syntax: 'Hamsterlite.play_pitch_e(%2)',
                                textParams: [
                                    {
                                        type: 'Dropdown',
                                        options: [
                                            [Lang.Blocks.hamsterlite_note_c, '4'],
                                            [Lang.Blocks.hamsterlite_note_c_sharp, '5'],
                                            [Lang.Blocks.hamsterlite_note_d, '6'],
                                            [Lang.Blocks.hamsterlite_note_d_sharp, '7'],
                                            [Lang.Blocks.hamsterlite_note_e, '8'],
                                            [Lang.Blocks.hamsterlite_note_f, '9'],
                                            [Lang.Blocks.hamsterlite_note_f_sharp, '10'],
                                            [Lang.Blocks.hamsterlite_note_g, '11'],
                                            [Lang.Blocks.hamsterlite_note_g_sharp, '12'],
                                            [Lang.Blocks.hamsterlite_note_a, '13'],
                                            [Lang.Blocks.hamsterlite_note_a_sharp, '14'],
                                            [Lang.Blocks.hamsterlite_note_b, '15'],
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
                                        converter:
                                            Entry.block.converters.returnStringOrNumberByValue,
                                    },
                                ],
                                params: ['8'],
                            },
                            {
                                syntax: 'Hamsterlite.play_pitch_f(%2)',
                                textParams: [
                                    {
                                        type: 'Dropdown',
                                        options: [
                                            [Lang.Blocks.hamsterlite_note_c, '4'],
                                            [Lang.Blocks.hamsterlite_note_c_sharp, '5'],
                                            [Lang.Blocks.hamsterlite_note_d, '6'],
                                            [Lang.Blocks.hamsterlite_note_d_sharp, '7'],
                                            [Lang.Blocks.hamsterlite_note_e, '8'],
                                            [Lang.Blocks.hamsterlite_note_f, '9'],
                                            [Lang.Blocks.hamsterlite_note_f_sharp, '10'],
                                            [Lang.Blocks.hamsterlite_note_g, '11'],
                                            [Lang.Blocks.hamsterlite_note_g_sharp, '12'],
                                            [Lang.Blocks.hamsterlite_note_a, '13'],
                                            [Lang.Blocks.hamsterlite_note_a_sharp, '14'],
                                            [Lang.Blocks.hamsterlite_note_b, '15'],
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
                                        converter:
                                            Entry.block.converters.returnStringOrNumberByValue,
                                    },
                                ],
                                params: ['9'],
                            },
                            {
                                syntax: 'Hamsterlite.play_pitch_f_sharp(%2)',
                                textParams: [
                                    {
                                        type: 'Dropdown',
                                        options: [
                                            [Lang.Blocks.hamsterlite_note_c, '4'],
                                            [Lang.Blocks.hamsterlite_note_c_sharp, '5'],
                                            [Lang.Blocks.hamsterlite_note_d, '6'],
                                            [Lang.Blocks.hamsterlite_note_d_sharp, '7'],
                                            [Lang.Blocks.hamsterlite_note_e, '8'],
                                            [Lang.Blocks.hamsterlite_note_f, '9'],
                                            [Lang.Blocks.hamsterlite_note_f_sharp, '10'],
                                            [Lang.Blocks.hamsterlite_note_g, '11'],
                                            [Lang.Blocks.hamsterlite_note_g_sharp, '12'],
                                            [Lang.Blocks.hamsterlite_note_a, '13'],
                                            [Lang.Blocks.hamsterlite_note_a_sharp, '14'],
                                            [Lang.Blocks.hamsterlite_note_b, '15'],
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
                                        converter:
                                            Entry.block.converters.returnStringOrNumberByValue,
                                    },
                                ],
                                params: ['10'],
                            },
                            {
                                syntax: 'Hamsterlite.play_pitch_g(%2)',
                                textParams: [
                                    {
                                        type: 'Dropdown',
                                        options: [
                                            [Lang.Blocks.hamsterlite_note_c, '4'],
                                            [Lang.Blocks.hamsterlite_note_c_sharp, '5'],
                                            [Lang.Blocks.hamsterlite_note_d, '6'],
                                            [Lang.Blocks.hamsterlite_note_d_sharp, '7'],
                                            [Lang.Blocks.hamsterlite_note_e, '8'],
                                            [Lang.Blocks.hamsterlite_note_f, '9'],
                                            [Lang.Blocks.hamsterlite_note_f_sharp, '10'],
                                            [Lang.Blocks.hamsterlite_note_g, '11'],
                                            [Lang.Blocks.hamsterlite_note_g_sharp, '12'],
                                            [Lang.Blocks.hamsterlite_note_a, '13'],
                                            [Lang.Blocks.hamsterlite_note_a_sharp, '14'],
                                            [Lang.Blocks.hamsterlite_note_b, '15'],
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
                                        converter:
                                            Entry.block.converters.returnStringOrNumberByValue,
                                    },
                                ],
                                params: ['11'],
                            },
                            {
                                syntax: 'Hamsterlite.play_pitch_g_sharp(%2)',
                                textParams: [
                                    {
                                        type: 'Dropdown',
                                        options: [
                                            [Lang.Blocks.hamsterlite_note_c, '4'],
                                            [Lang.Blocks.hamsterlite_note_c_sharp, '5'],
                                            [Lang.Blocks.hamsterlite_note_d, '6'],
                                            [Lang.Blocks.hamsterlite_note_d_sharp, '7'],
                                            [Lang.Blocks.hamsterlite_note_e, '8'],
                                            [Lang.Blocks.hamsterlite_note_f, '9'],
                                            [Lang.Blocks.hamsterlite_note_f_sharp, '10'],
                                            [Lang.Blocks.hamsterlite_note_g, '11'],
                                            [Lang.Blocks.hamsterlite_note_g_sharp, '12'],
                                            [Lang.Blocks.hamsterlite_note_a, '13'],
                                            [Lang.Blocks.hamsterlite_note_a_sharp, '14'],
                                            [Lang.Blocks.hamsterlite_note_b, '15'],
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
                                        converter:
                                            Entry.block.converters.returnStringOrNumberByValue,
                                    },
                                ],
                                params: ['12'],
                            },
                            {
                                syntax: 'Hamsterlite.play_pitch_a(%2)',
                                textParams: [
                                    {
                                        type: 'Dropdown',
                                        options: [
                                            [Lang.Blocks.hamsterlite_note_c, '4'],
                                            [Lang.Blocks.hamsterlite_note_c_sharp, '5'],
                                            [Lang.Blocks.hamsterlite_note_d, '6'],
                                            [Lang.Blocks.hamsterlite_note_d_sharp, '7'],
                                            [Lang.Blocks.hamsterlite_note_e, '8'],
                                            [Lang.Blocks.hamsterlite_note_f, '9'],
                                            [Lang.Blocks.hamsterlite_note_f_sharp, '10'],
                                            [Lang.Blocks.hamsterlite_note_g, '11'],
                                            [Lang.Blocks.hamsterlite_note_g_sharp, '12'],
                                            [Lang.Blocks.hamsterlite_note_a, '13'],
                                            [Lang.Blocks.hamsterlite_note_a_sharp, '14'],
                                            [Lang.Blocks.hamsterlite_note_b, '15'],
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
                                        converter:
                                            Entry.block.converters.returnStringOrNumberByValue,
                                    },
                                ],
                                params: ['13'],
                            },
                            {
                                syntax: 'Hamsterlite.play_pitch_a_sharp(%2)',
                                textParams: [
                                    {
                                        type: 'Dropdown',
                                        options: [
                                            [Lang.Blocks.hamsterlite_note_c, '4'],
                                            [Lang.Blocks.hamsterlite_note_c_sharp, '5'],
                                            [Lang.Blocks.hamsterlite_note_d, '6'],
                                            [Lang.Blocks.hamsterlite_note_d_sharp, '7'],
                                            [Lang.Blocks.hamsterlite_note_e, '8'],
                                            [Lang.Blocks.hamsterlite_note_f, '9'],
                                            [Lang.Blocks.hamsterlite_note_f_sharp, '10'],
                                            [Lang.Blocks.hamsterlite_note_g, '11'],
                                            [Lang.Blocks.hamsterlite_note_g_sharp, '12'],
                                            [Lang.Blocks.hamsterlite_note_a, '13'],
                                            [Lang.Blocks.hamsterlite_note_a_sharp, '14'],
                                            [Lang.Blocks.hamsterlite_note_b, '15'],
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
                                        converter:
                                            Entry.block.converters.returnStringOrNumberByValue,
                                    },
                                ],
                                params: ['14'],
                            },
                            {
                                syntax: 'Hamsterlite.play_pitch_b(%2)',
                                textParams: [
                                    {
                                        type: 'Dropdown',
                                        options: [
                                            [Lang.Blocks.hamsterlite_note_c, '4'],
                                            [Lang.Blocks.hamsterlite_note_c_sharp, '5'],
                                            [Lang.Blocks.hamsterlite_note_d, '6'],
                                            [Lang.Blocks.hamsterlite_note_d_sharp, '7'],
                                            [Lang.Blocks.hamsterlite_note_e, '8'],
                                            [Lang.Blocks.hamsterlite_note_f, '9'],
                                            [Lang.Blocks.hamsterlite_note_f_sharp, '10'],
                                            [Lang.Blocks.hamsterlite_note_g, '11'],
                                            [Lang.Blocks.hamsterlite_note_g_sharp, '12'],
                                            [Lang.Blocks.hamsterlite_note_a, '13'],
                                            [Lang.Blocks.hamsterlite_note_a_sharp, '14'],
                                            [Lang.Blocks.hamsterlite_note_b, '15'],
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
                                        converter:
                                            Entry.block.converters.returnStringOrNumberByValue,
                                    },
                                ],
                                params: ['15'],
                            },
                        ],
                    },
                },
                hamsterlite_play_note_for: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.hamsterlite_note_c, '4'],
                                [Lang.Blocks.hamsterlite_note_c_sharp, '5'],
                                [Lang.Blocks.hamsterlite_note_d, '6'],
                                [Lang.Blocks.hamsterlite_note_d_sharp, '7'],
                                [Lang.Blocks.hamsterlite_note_e, '8'],
                                [Lang.Blocks.hamsterlite_note_f, '9'],
                                [Lang.Blocks.hamsterlite_note_f_sharp, '10'],
                                [Lang.Blocks.hamsterlite_note_g, '11'],
                                [Lang.Blocks.hamsterlite_note_g_sharp, '12'],
                                [Lang.Blocks.hamsterlite_note_a, '13'],
                                [Lang.Blocks.hamsterlite_note_a_sharp, '14'],
                                [Lang.Blocks.hamsterlite_note_b, '15'],
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
                            img: 'block_icon/hardwarelite_icon.svg',
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
                        type: 'hamsterlite_play_note_for',
                    },
                    paramsKeyMap: {
                        NOTE: 0,
                        OCTAVE: 1,
                        BEAT: 2,
                    },
                    class: 'hamsterlite_buzzer',
                    isNotFor: ['HamsterLite'],
                    func(sprite, script) {
                        return activeHamster().playNoteBeat(script);
                    },
                    syntax: {
                        js: [],
                        py: [
                            {
                                syntax: 'Hamsterlite.play_note_c(%2, %3)',
                                textParams: [
                                    {
                                        type: 'Dropdown',
                                        options: [
                                            [Lang.Blocks.hamsterlite_note_c, '4'],
                                            [Lang.Blocks.hamsterlite_note_c_sharp, '5'],
                                            [Lang.Blocks.hamsterlite_note_d, '6'],
                                            [Lang.Blocks.hamsterlite_note_d_sharp, '7'],
                                            [Lang.Blocks.hamsterlite_note_e, '8'],
                                            [Lang.Blocks.hamsterlite_note_f, '9'],
                                            [Lang.Blocks.hamsterlite_note_f_sharp, '10'],
                                            [Lang.Blocks.hamsterlite_note_g, '11'],
                                            [Lang.Blocks.hamsterlite_note_g_sharp, '12'],
                                            [Lang.Blocks.hamsterlite_note_a, '13'],
                                            [Lang.Blocks.hamsterlite_note_a_sharp, '14'],
                                            [Lang.Blocks.hamsterlite_note_b, '15'],
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
                                        converter:
                                            Entry.block.converters.returnStringOrNumberByValue,
                                    },
                                    { type: 'Block', accept: 'string' },
                                ],
                                params: ['4'],
                            },
                            {
                                syntax: 'Hamsterlite.play_note_c_sharp(%2, %3)',
                                textParams: [
                                    {
                                        type: 'Dropdown',
                                        options: [
                                            [Lang.Blocks.hamsterlite_note_c, '4'],
                                            [Lang.Blocks.hamsterlite_note_c_sharp, '5'],
                                            [Lang.Blocks.hamsterlite_note_d, '6'],
                                            [Lang.Blocks.hamsterlite_note_d_sharp, '7'],
                                            [Lang.Blocks.hamsterlite_note_e, '8'],
                                            [Lang.Blocks.hamsterlite_note_f, '9'],
                                            [Lang.Blocks.hamsterlite_note_f_sharp, '10'],
                                            [Lang.Blocks.hamsterlite_note_g, '11'],
                                            [Lang.Blocks.hamsterlite_note_g_sharp, '12'],
                                            [Lang.Blocks.hamsterlite_note_a, '13'],
                                            [Lang.Blocks.hamsterlite_note_a_sharp, '14'],
                                            [Lang.Blocks.hamsterlite_note_b, '15'],
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
                                        converter:
                                            Entry.block.converters.returnStringOrNumberByValue,
                                    },
                                    { type: 'Block', accept: 'string' },
                                ],
                                params: ['5'],
                            },
                            {
                                syntax: 'Hamsterlite.play_note_d(%2, %3)',
                                textParams: [
                                    {
                                        type: 'Dropdown',
                                        options: [
                                            [Lang.Blocks.hamsterlite_note_c, '4'],
                                            [Lang.Blocks.hamsterlite_note_c_sharp, '5'],
                                            [Lang.Blocks.hamsterlite_note_d, '6'],
                                            [Lang.Blocks.hamsterlite_note_d_sharp, '7'],
                                            [Lang.Blocks.hamsterlite_note_e, '8'],
                                            [Lang.Blocks.hamsterlite_note_f, '9'],
                                            [Lang.Blocks.hamsterlite_note_f_sharp, '10'],
                                            [Lang.Blocks.hamsterlite_note_g, '11'],
                                            [Lang.Blocks.hamsterlite_note_g_sharp, '12'],
                                            [Lang.Blocks.hamsterlite_note_a, '13'],
                                            [Lang.Blocks.hamsterlite_note_a_sharp, '14'],
                                            [Lang.Blocks.hamsterlite_note_b, '15'],
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
                                        converter:
                                            Entry.block.converters.returnStringOrNumberByValue,
                                    },
                                    { type: 'Block', accept: 'string' },
                                ],
                                params: ['6'],
                            },
                            {
                                syntax: 'Hamsterlite.play_note_d_sharp(%2, %3)',
                                textParams: [
                                    {
                                        type: 'Dropdown',
                                        options: [
                                            [Lang.Blocks.hamsterlite_note_c, '4'],
                                            [Lang.Blocks.hamsterlite_note_c_sharp, '5'],
                                            [Lang.Blocks.hamsterlite_note_d, '6'],
                                            [Lang.Blocks.hamsterlite_note_d_sharp, '7'],
                                            [Lang.Blocks.hamsterlite_note_e, '8'],
                                            [Lang.Blocks.hamsterlite_note_f, '9'],
                                            [Lang.Blocks.hamsterlite_note_f_sharp, '10'],
                                            [Lang.Blocks.hamsterlite_note_g, '11'],
                                            [Lang.Blocks.hamsterlite_note_g_sharp, '12'],
                                            [Lang.Blocks.hamsterlite_note_a, '13'],
                                            [Lang.Blocks.hamsterlite_note_a_sharp, '14'],
                                            [Lang.Blocks.hamsterlite_note_b, '15'],
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
                                        converter:
                                            Entry.block.converters.returnStringOrNumberByValue,
                                    },
                                    { type: 'Block', accept: 'string' },
                                ],
                                params: ['7'],
                            },
                            {
                                syntax: 'Hamsterlite.play_note_e(%2, %3)',
                                textParams: [
                                    {
                                        type: 'Dropdown',
                                        options: [
                                            [Lang.Blocks.hamsterlite_note_c, '4'],
                                            [Lang.Blocks.hamsterlite_note_c_sharp, '5'],
                                            [Lang.Blocks.hamsterlite_note_d, '6'],
                                            [Lang.Blocks.hamsterlite_note_d_sharp, '7'],
                                            [Lang.Blocks.hamsterlite_note_e, '8'],
                                            [Lang.Blocks.hamsterlite_note_f, '9'],
                                            [Lang.Blocks.hamsterlite_note_f_sharp, '10'],
                                            [Lang.Blocks.hamsterlite_note_g, '11'],
                                            [Lang.Blocks.hamsterlite_note_g_sharp, '12'],
                                            [Lang.Blocks.hamsterlite_note_a, '13'],
                                            [Lang.Blocks.hamsterlite_note_a_sharp, '14'],
                                            [Lang.Blocks.hamsterlite_note_b, '15'],
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
                                        converter:
                                            Entry.block.converters.returnStringOrNumberByValue,
                                    },
                                    { type: 'Block', accept: 'string' },
                                ],
                                params: ['8'],
                            },
                            {
                                syntax: 'Hamsterlite.play_note_f(%2, %3)',
                                textParams: [
                                    {
                                        type: 'Dropdown',
                                        options: [
                                            [Lang.Blocks.hamsterlite_note_c, '4'],
                                            [Lang.Blocks.hamsterlite_note_c_sharp, '5'],
                                            [Lang.Blocks.hamsterlite_note_d, '6'],
                                            [Lang.Blocks.hamsterlite_note_d_sharp, '7'],
                                            [Lang.Blocks.hamsterlite_note_e, '8'],
                                            [Lang.Blocks.hamsterlite_note_f, '9'],
                                            [Lang.Blocks.hamsterlite_note_f_sharp, '10'],
                                            [Lang.Blocks.hamsterlite_note_g, '11'],
                                            [Lang.Blocks.hamsterlite_note_g_sharp, '12'],
                                            [Lang.Blocks.hamsterlite_note_a, '13'],
                                            [Lang.Blocks.hamsterlite_note_a_sharp, '14'],
                                            [Lang.Blocks.hamsterlite_note_b, '15'],
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
                                        converter:
                                            Entry.block.converters.returnStringOrNumberByValue,
                                    },
                                    { type: 'Block', accept: 'string' },
                                ],
                                params: ['9'],
                            },
                            {
                                syntax: 'Hamsterlite.play_note_f_sharp(%2, %3)',
                                textParams: [
                                    {
                                        type: 'Dropdown',
                                        options: [
                                            [Lang.Blocks.hamsterlite_note_c, '4'],
                                            [Lang.Blocks.hamsterlite_note_c_sharp, '5'],
                                            [Lang.Blocks.hamsterlite_note_d, '6'],
                                            [Lang.Blocks.hamsterlite_note_d_sharp, '7'],
                                            [Lang.Blocks.hamsterlite_note_e, '8'],
                                            [Lang.Blocks.hamsterlite_note_f, '9'],
                                            [Lang.Blocks.hamsterlite_note_f_sharp, '10'],
                                            [Lang.Blocks.hamsterlite_note_g, '11'],
                                            [Lang.Blocks.hamsterlite_note_g_sharp, '12'],
                                            [Lang.Blocks.hamsterlite_note_a, '13'],
                                            [Lang.Blocks.hamsterlite_note_a_sharp, '14'],
                                            [Lang.Blocks.hamsterlite_note_b, '15'],
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
                                        converter:
                                            Entry.block.converters.returnStringOrNumberByValue,
                                    },
                                    { type: 'Block', accept: 'string' },
                                ],
                                params: ['10'],
                            },
                            {
                                syntax: 'Hamsterlite.play_note_g(%2, %3)',
                                textParams: [
                                    {
                                        type: 'Dropdown',
                                        options: [
                                            [Lang.Blocks.hamsterlite_note_c, '4'],
                                            [Lang.Blocks.hamsterlite_note_c_sharp, '5'],
                                            [Lang.Blocks.hamsterlite_note_d, '6'],
                                            [Lang.Blocks.hamsterlite_note_d_sharp, '7'],
                                            [Lang.Blocks.hamsterlite_note_e, '8'],
                                            [Lang.Blocks.hamsterlite_note_f, '9'],
                                            [Lang.Blocks.hamsterlite_note_f_sharp, '10'],
                                            [Lang.Blocks.hamsterlite_note_g, '11'],
                                            [Lang.Blocks.hamsterlite_note_g_sharp, '12'],
                                            [Lang.Blocks.hamsterlite_note_a, '13'],
                                            [Lang.Blocks.hamsterlite_note_a_sharp, '14'],
                                            [Lang.Blocks.hamsterlite_note_b, '15'],
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
                                        converter:
                                            Entry.block.converters.returnStringOrNumberByValue,
                                    },
                                    { type: 'Block', accept: 'string' },
                                ],
                                params: ['11'],
                            },
                            {
                                syntax: 'Hamsterlite.play_note_g_sharp(%2, %3)',
                                textParams: [
                                    {
                                        type: 'Dropdown',
                                        options: [
                                            [Lang.Blocks.hamsterlite_note_c, '4'],
                                            [Lang.Blocks.hamsterlite_note_c_sharp, '5'],
                                            [Lang.Blocks.hamsterlite_note_d, '6'],
                                            [Lang.Blocks.hamsterlite_note_d_sharp, '7'],
                                            [Lang.Blocks.hamsterlite_note_e, '8'],
                                            [Lang.Blocks.hamsterlite_note_f, '9'],
                                            [Lang.Blocks.hamsterlite_note_f_sharp, '10'],
                                            [Lang.Blocks.hamsterlite_note_g, '11'],
                                            [Lang.Blocks.hamsterlite_note_g_sharp, '12'],
                                            [Lang.Blocks.hamsterlite_note_a, '13'],
                                            [Lang.Blocks.hamsterlite_note_a_sharp, '14'],
                                            [Lang.Blocks.hamsterlite_note_b, '15'],
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
                                        converter:
                                            Entry.block.converters.returnStringOrNumberByValue,
                                    },
                                    { type: 'Block', accept: 'string' },
                                ],
                                params: ['12'],
                            },
                            {
                                syntax: 'Hamsterlite.play_note_a(%2, %3)',
                                textParams: [
                                    {
                                        type: 'Dropdown',
                                        options: [
                                            [Lang.Blocks.hamsterlite_note_c, '4'],
                                            [Lang.Blocks.hamsterlite_note_c_sharp, '5'],
                                            [Lang.Blocks.hamsterlite_note_d, '6'],
                                            [Lang.Blocks.hamsterlite_note_d_sharp, '7'],
                                            [Lang.Blocks.hamsterlite_note_e, '8'],
                                            [Lang.Blocks.hamsterlite_note_f, '9'],
                                            [Lang.Blocks.hamsterlite_note_f_sharp, '10'],
                                            [Lang.Blocks.hamsterlite_note_g, '11'],
                                            [Lang.Blocks.hamsterlite_note_g_sharp, '12'],
                                            [Lang.Blocks.hamsterlite_note_a, '13'],
                                            [Lang.Blocks.hamsterlite_note_a_sharp, '14'],
                                            [Lang.Blocks.hamsterlite_note_b, '15'],
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
                                        converter:
                                            Entry.block.converters.returnStringOrNumberByValue,
                                    },
                                    { type: 'Block', accept: 'string' },
                                ],
                                params: ['13'],
                            },
                            {
                                syntax: 'Hamsterlite.play_note_a_sharp(%2, %3)',
                                textParams: [
                                    {
                                        type: 'Dropdown',
                                        options: [
                                            [Lang.Blocks.hamsterlite_note_c, '4'],
                                            [Lang.Blocks.hamsterlite_note_c_sharp, '5'],
                                            [Lang.Blocks.hamsterlite_note_d, '6'],
                                            [Lang.Blocks.hamsterlite_note_d_sharp, '7'],
                                            [Lang.Blocks.hamsterlite_note_e, '8'],
                                            [Lang.Blocks.hamsterlite_note_f, '9'],
                                            [Lang.Blocks.hamsterlite_note_f_sharp, '10'],
                                            [Lang.Blocks.hamsterlite_note_g, '11'],
                                            [Lang.Blocks.hamsterlite_note_g_sharp, '12'],
                                            [Lang.Blocks.hamsterlite_note_a, '13'],
                                            [Lang.Blocks.hamsterlite_note_a_sharp, '14'],
                                            [Lang.Blocks.hamsterlite_note_b, '15'],
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
                                        converter:
                                            Entry.block.converters.returnStringOrNumberByValue,
                                    },
                                    { type: 'Block', accept: 'string' },
                                ],
                                params: ['14'],
                            },
                            {
                                syntax: 'Hamsterlite.play_note_b(%2, %3)',
                                textParams: [
                                    {
                                        type: 'Dropdown',
                                        options: [
                                            [Lang.Blocks.hamsterlite_note_c, '4'],
                                            [Lang.Blocks.hamsterlite_note_c_sharp, '5'],
                                            [Lang.Blocks.hamsterlite_note_d, '6'],
                                            [Lang.Blocks.hamsterlite_note_d_sharp, '7'],
                                            [Lang.Blocks.hamsterlite_note_e, '8'],
                                            [Lang.Blocks.hamsterlite_note_f, '9'],
                                            [Lang.Blocks.hamsterlite_note_f_sharp, '10'],
                                            [Lang.Blocks.hamsterlite_note_g, '11'],
                                            [Lang.Blocks.hamsterlite_note_g_sharp, '12'],
                                            [Lang.Blocks.hamsterlite_note_a, '13'],
                                            [Lang.Blocks.hamsterlite_note_a_sharp, '14'],
                                            [Lang.Blocks.hamsterlite_note_b, '15'],
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
                                        converter:
                                            Entry.block.converters.returnStringOrNumberByValue,
                                    },
                                    { type: 'Block', accept: 'string' },
                                ],
                                params: ['15'],
                            },
                        ],
                    },
                },
                hamsterlite_rest_for: {
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
                            img: 'block_icon/hardwarelite_icon.svg',
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
                        type: 'hamsterlite_rest_for',
                    },
                    paramsKeyMap: {
                        BEAT: 0,
                    },
                    class: 'hamsterlite_buzzer',
                    isNotFor: ['HamsterLite'],
                    func(sprite, script) {
                        return activeHamster().restBeat(script);
                    },
                    syntax: {
                        js: [],
                        py: [
                            {
                                syntax: 'Hamsterlite.rest(%1)',
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
                hamsterlite_change_tempo_by: {
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
                            img: 'block_icon/hardwarelite_icon.svg',
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
                        type: 'hamsterlite_change_tempo_by',
                    },
                    paramsKeyMap: {
                        BPM: 0,
                    },
                    class: 'hamsterlite_buzzer',
                    isNotFor: ['HamsterLite'],
                    func(sprite, script) {
                        return activeHamster().changeTempo(script);
                    },
                    syntax: {
                        js: [],
                        py: [
                            {
                                syntax: 'Hamsterlite.add_tempo(%1)',
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
                hamsterlite_set_tempo_to: {
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
                            img: 'block_icon/hardwarelite_icon.svg',
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
                        type: 'hamsterlite_set_tempo_to',
                    },
                    paramsKeyMap: {
                        BPM: 0,
                    },
                    class: 'hamsterlite_buzzer',
                    isNotFor: ['HamsterLite'],
                    func(sprite, script) {
                        return activeHamster().setTempo(script);
                    },
                    syntax: {
                        js: [],
                        py: [
                            {
                                syntax: 'Hamsterlite.set_tempo(%1)',
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
                hamsterlite_set_port_to: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.hamsterlite_port_a, 'A'],
                                [Lang.Blocks.hamsterlite_port_b, 'B'],
                                [Lang.Blocks.hamsterlite_port_ab, 'AB'],
                            ],
                            value: 'A',
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.hamsterlite_analog_input, '0'],
                                [Lang.Blocks.hamsterlite_digital_input, '1'],
                                [Lang.Blocks.hamsterlite_servo_output, '8'],
                                [Lang.Blocks.hamsterlite_pwm_output, '9'],
                                [Lang.Blocks.hamsterlite_digital_output, '10'],
                            ],
                            value: '0',
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                        {
                            type: 'Indicator',
                            img: 'block_icon/hardwarelite_icon.svg',
                            size: 12,
                        },
                    ],
                    events: {},
                    def: {
                        params: [null, null, null],
                        type: 'hamsterlite_set_port_to',
                    },
                    paramsKeyMap: {
                        PORT: 0,
                        MODE: 1,
                    },
                    class: 'hamsterlite_port',
                    isNotFor: ['HamsterLite'],
                    func(sprite, script) {
                        return activeHamster().setIoMode(script);
                    },
                    syntax: {
                        js: [],
                        py: [
                            {
                                syntax: 'Hamsterlite.set_io_mode_analog_input(%1)',
                                textParams: [
                                    {
                                        type: 'Dropdown',
                                        options: [
                                            [Lang.Blocks.hamsterlite_port_a, 'A'],
                                            [Lang.Blocks.hamsterlite_port_b, 'B'],
                                            [Lang.Blocks.hamsterlite_port_ab, 'AB'],
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
                                            [Lang.Blocks.hamsterlite_analog_input, '0'],
                                            [Lang.Blocks.hamsterlite_digital_input, '1'],
                                            [Lang.Blocks.hamsterlite_servo_output, '8'],
                                            [Lang.Blocks.hamsterlite_pwm_output, '9'],
                                            [Lang.Blocks.hamsterlite_digital_output, '10'],
                                        ],
                                        value: '0',
                                        fontSize: 11,
                                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                        converter: Entry.block.converters.returnStringValue,
                                    },
                                ],
                                params: [null, '0'],
                            },
                            {
                                syntax: 'Hamsterlite.set_io_mode_digital_input(%1)',
                                textParams: [
                                    {
                                        type: 'Dropdown',
                                        options: [
                                            [Lang.Blocks.hamsterlite_port_a, 'A'],
                                            [Lang.Blocks.hamsterlite_port_b, 'B'],
                                            [Lang.Blocks.hamsterlite_port_ab, 'AB'],
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
                                            [Lang.Blocks.hamsterlite_analog_input, '0'],
                                            [Lang.Blocks.hamsterlite_digital_input, '1'],
                                            [Lang.Blocks.hamsterlite_servo_output, '8'],
                                            [Lang.Blocks.hamsterlite_pwm_output, '9'],
                                            [Lang.Blocks.hamsterlite_digital_output, '10'],
                                        ],
                                        value: '0',
                                        fontSize: 11,
                                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                        converter: Entry.block.converters.returnStringValue,
                                    },
                                ],
                                params: [null, '1'],
                            },
                            {
                                syntax: 'Hamsterlite.set_io_mode_servo_output(%1)',
                                textParams: [
                                    {
                                        type: 'Dropdown',
                                        options: [
                                            [Lang.Blocks.hamsterlite_port_a, 'A'],
                                            [Lang.Blocks.hamsterlite_port_b, 'B'],
                                            [Lang.Blocks.hamsterlite_port_ab, 'AB'],
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
                                            [Lang.Blocks.hamsterlite_analog_input, '0'],
                                            [Lang.Blocks.hamsterlite_digital_input, '1'],
                                            [Lang.Blocks.hamsterlite_servo_output, '8'],
                                            [Lang.Blocks.hamsterlite_pwm_output, '9'],
                                            [Lang.Blocks.hamsterlite_digital_output, '10'],
                                        ],
                                        value: '0',
                                        fontSize: 11,
                                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                        converter: Entry.block.converters.returnStringValue,
                                    },
                                ],
                                params: [null, '8'],
                            },
                            {
                                syntax: 'Hamsterlite.set_io_mode_pwm_output(%1)',
                                textParams: [
                                    {
                                        type: 'Dropdown',
                                        options: [
                                            [Lang.Blocks.hamsterlite_port_a, 'A'],
                                            [Lang.Blocks.hamsterlite_port_b, 'B'],
                                            [Lang.Blocks.hamsterlite_port_ab, 'AB'],
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
                                            [Lang.Blocks.hamsterlite_analog_input, '0'],
                                            [Lang.Blocks.hamsterlite_digital_input, '1'],
                                            [Lang.Blocks.hamsterlite_servo_output, '8'],
                                            [Lang.Blocks.hamsterlite_pwm_output, '9'],
                                            [Lang.Blocks.hamsterlite_digital_output, '10'],
                                        ],
                                        value: '0',
                                        fontSize: 11,
                                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                        converter: Entry.block.converters.returnStringValue,
                                    },
                                ],
                                params: [null, '9'],
                            },
                            {
                                syntax: 'Hamsterlite.set_io_mode_digital_output(%1)',
                                textParams: [
                                    {
                                        type: 'Dropdown',
                                        options: [
                                            [Lang.Blocks.hamsterlite_port_a, 'A'],
                                            [Lang.Blocks.hamsterlite_port_b, 'B'],
                                            [Lang.Blocks.hamsterlite_port_ab, 'AB'],
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
                                            [Lang.Blocks.hamsterlite_analog_input, '0'],
                                            [Lang.Blocks.hamsterlite_digital_input, '1'],
                                            [Lang.Blocks.hamsterlite_servo_output, '8'],
                                            [Lang.Blocks.hamsterlite_pwm_output, '9'],
                                            [Lang.Blocks.hamsterlite_digital_output, '10'],
                                        ],
                                        value: '0',
                                        fontSize: 11,
                                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                        converter: Entry.block.converters.returnStringValue,
                                    },
                                ],
                                params: [null, '10'],
                            },
                        ],
                    },
                },
                hamsterlite_change_output_by: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.hamsterlite_port_a, 'A'],
                                [Lang.Blocks.hamsterlite_port_b, 'B'],
                                [Lang.Blocks.hamsterlite_port_ab, 'AB'],
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
                            img: 'block_icon/hardwarelite_icon.svg',
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
                        type: 'hamsterlite_change_output_by',
                    },
                    paramsKeyMap: {
                        PORT: 0,
                        VALUE: 1,
                    },
                    class: 'hamsterlite_port',
                    isNotFor: ['HamsterLite'],
                    func(sprite, script) {
                        return activeHamster().changeOutput(script);
                    },
                    syntax: {
                        js: [],
                        py: [
                            {
                                syntax: 'Hamsterlite.add_output(%1, %2)',
                                textParams: [
                                    {
                                        type: 'Dropdown',
                                        options: [
                                            [Lang.Blocks.hamsterlite_port_a, 'A'],
                                            [Lang.Blocks.hamsterlite_port_b, 'B'],
                                            [Lang.Blocks.hamsterlite_port_ab, 'AB'],
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
                hamsterlite_set_output_to: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.hamsterlite_port_a, 'A'],
                                [Lang.Blocks.hamsterlite_port_b, 'B'],
                                [Lang.Blocks.hamsterlite_port_ab, 'AB'],
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
                            img: 'block_icon/hardwarelite_icon.svg',
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
                        type: 'hamsterlite_set_output_to',
                    },
                    paramsKeyMap: {
                        PORT: 0,
                        VALUE: 1,
                    },
                    class: 'hamsterlite_port',
                    isNotFor: ['HamsterLite'],
                    func(sprite, script) {
                        return activeHamster().setOutput(script);
                    },
                    syntax: {
                        js: [],
                        py: [
                            {
                                syntax: 'Hamsterlite.set_output(%1, %2)',
                                textParams: [
                                    {
                                        type: 'Dropdown',
                                        options: [
                                            [Lang.Blocks.hamsterlite_port_a, 'A'],
                                            [Lang.Blocks.hamsterlite_port_b, 'B'],
                                            [Lang.Blocks.hamsterlite_port_ab, 'AB'],
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
                hamsterlite_gripper: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.hamsterlite_open_gripper, 'OPEN'],
                                [Lang.Blocks.hamsterlite_close_gripper, 'CLOSE'],
                            ],
                            value: 'OPEN',
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                        {
                            type: 'Indicator',
                            img: 'block_icon/hardwarelite_icon.svg',
                            size: 12,
                        },
                    ],
                    events: {},
                    def: {
                        params: [null, null],
                        type: 'hamsterlite_gripper',
                    },
                    paramsKeyMap: {
                        ACTION: 0,
                    },
                    class: 'hamsterlite_port',
                    isNotFor: ['HamsterLite'],
                    func(sprite, script) {
                        return activeHamster().gripper(script);
                    },
                    syntax: {
                        js: [],
                        py: [
                            {
                                syntax: 'Hamsterlite.set_gripper(%1)',
                                textParams: [
                                    {
                                        type: 'Dropdown',
                                        options: [
                                            [Lang.Blocks.hamsterlite_open_gripper, 'OPEN'],
                                            [Lang.Blocks.hamsterlite_close_gripper, 'CLOSE'],
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
                hamsterlite_release_gripper: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
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
                        params: [null],
                        type: 'hamsterlite_release_gripper',
                    },
                    class: 'hamsterlite_port',
                    isNotFor: ['HamsterLite'],
                    func(sprite, script) {
                        return activeHamster().releaseGripper(script);
                    },
                    syntax: {
                        js: [],
                        py: [
                            {
                                syntax: 'Hamsterlite.release_gripper()',
                            },
                        ],
                    },
                },
            };
        }

        toHex(number) {
            var value = parseInt(number);
            if (value < 0) value += 0x100;

            value = value.toString(16).toUpperCase();
            if (value.length > 1) return value;
            else return '0' + value;
        }

        toHex2(number) {
            var value = parseInt(number);
            if (value < 0) value += 0x10000;

            value = value.toString(16).toUpperCase();
            var result = '';
            for (var i = value.length; i < 4; ++i) {
                result += '0';
            }
            return result + value;
        }
        toHex3(number) {
            var value = parseInt(number);
            if (value < 0) value += 0x1000000;

            value = value.toString(16).toUpperCase();
            var result = '';
            for (var i = value.length; i < 6; ++i) {
                result += '0';
            }
            return result + value;
        }
        colorToRgb(color) {
            if (color > 7) color = 7;
            else if (color < 0) color = 0;
            return COLOR_TO_RGB[color];
        }
        // 새 단위 이동 명령을 펄스로 환산하고, 지금 걸어야 할 바퀴 속도를 돌려준다.
        // motoring 을 건드리지 않는다. 이동이 끝나면 사용자가 설정해 둔 속도로 돌아가야 한다.
        // 출처: entry-hw/app/modules/hamster_s.js 의 requestLocalData 앞부분.
        // 구형 햄스터는 motionType 을 세우지 않으므로 늘 motoring 값이 그대로 나간다.
        __applyMotion(motoring = this.motoring) {
            const motion = this.motion;
            const wheel = this.wheel;

            if (motion.written) {
                this.__removeMotionTimeout();
                motion.type = parseInt(motoring.motionType, 10) || 0;
                if (motion.type < 0 || motion.type > 30) {
                    motion.type = 0;
                }
                if (motion.type != 0) {
                    motion.speed = motoring.motionSpeed;
                    wheel.pulse = 0;
                    const unit = parseInt(motoring.motionUnit, 10);
                    const value = motoring.motionValue;
                    if (unit == MOTION_UNITS.SEC) {
                        // 시간 단위는 펄스를 쓰지 않는다. 타이머가 끝나면 event = -1 로 두고,
                        // 수신 상태머신의 -1 분기가 완료를 알린다. 즉 두 단위가 같은 곳에서 끝난다.
                        if (value == 0) {
                            this.__endMotionNow();
                        } else {
                            this.motionTimer = setTimeout(() => {
                                this.__endMotionNow();
                            }, value * 1000);
                            this.timeouts.push(this.motionTimer);
                        }
                    } else {
                        if (unit == MOTION_UNITS.PULSE) {
                            wheel.pulse = Math.round(value);
                        } else if (unit == MOTION_UNITS.CM) {
                            wheel.pulse = this.__motionPulse(
                                motion.type,
                                value,
                                motoring.motionRadius
                            );
                        }
                        // 펄스는 2바이트 자리다. 65535 를 넘으면 toHex2 가 다섯 자를 내보내
                        // 이후 필드가 전부 밀리고, 로봇이 그 패킷을 받아들이지 않으면 완료 신호가
                        // 오지 않아 블록이 영구 대기한다. 경계는 약 474cm(65535 / CM_TO_PULSE).
                        // 조용히 자르면 이동 거리가 달라지므로, 명령 자체를 받지 않고 즉시 끝낸다.
                        if (wheel.pulse > 0xffff) {
                            wheel.pulse = 0;
                        }
                        if (wheel.pulse == 0) {
                            this.__endMotionNow();
                        }
                    }
                }
            }
            if (motion.type == 0) {
                wheel.pulse = motoring.pulse;
            }

            let left = motoring.leftWheel;
            let right = motoring.rightWheel;
            const speed = motion.speed || DEFAULT_SPEED;
            const drive = this.__motionWheels(motion.type, speed, motoring.motionRadius);
            if (drive) {
                left = drive[0];
                right = drive[1];
            }
            // 주행 중 여부. 두드림 억제가 이 값을 본다.
            if (left == 0 && right == 0) {
                if (wheel.move && ++wheel.moveCount > 5) {
                    wheel.move = false;
                }
            } else {
                wheel.move = true;
                wheel.moveCount = 0;
            }
            return { left, right };
        }

        // 선회할 때 안쪽 바퀴 속도. 출처: entry-hw hamster_s.js calculateInnerSpeed.
        __innerSpeed(speed, radius) {
            return (
                (speed * (radius * 1.052 - WHEEL_CENTER_DISTANCE)) /
                (radius * 1.052 + WHEEL_CENTER_DISTANCE)
            );
        }

        // 선회 각도(도) -> 펄스. 출처: entry-hw hamster_s.js calculateSwingPulse.
        // entry-hw 는 타입별 환산 상수를 세 번째 인자로 받지만 쓰지 않고 이 실측식 하나를 쓴다.
        // 받지 않는 인자는 옮기지 않았다.
        __swingPulse(deg, radius) {
            return Math.round(deg * (2.3008 * radius + 4.234));
        }

        // cm 와 도 단위 값 -> 펄스. 모르는 타입이면 0 (즉시 끝난다).
        // 타입 번호와 식은 entry-hw hamster_s.js requestLocalData 의 표를 그대로 옮겼다.
        __motionPulse(type, value, radius) {
            switch (type) {
                case 1: // 앞으로
                case 2: // 뒤로
                    return Math.round(value * CM_TO_PULSE);
                case 3: // 제자리 왼쪽
                case 4: // 제자리 오른쪽
                    return Math.round(value * DEG_TO_PULSE);
                case 5: // 왼쪽 바퀴 중심 앞
                case 6: // 왼쪽 바퀴 중심 뒤
                case 7: // 오른쪽 바퀴 중심 앞
                case 8: // 오른쪽 바퀴 중심 뒤
                    return Math.round(value * DEG_TO_PULSE_PIVOT);
                case 9: // 로봇 중심 반지름 선회 (왼쪽 앞/뒤, 오른쪽 앞/뒤)
                case 10:
                case 11:
                case 12:
                    return this.__swingPulse(value, radius);
                case 13: // 왼쪽 펜 중심 앞
                case 14: // 왼쪽 펜 중심 뒤
                case 15: // 오른쪽 펜 중심 앞
                case 16: // 오른쪽 펜 중심 뒤
                    return this.__swingPulse(value, PEN_CENTER_DISTANCE);
                case 17: // 왼쪽 펜으로 왼쪽 선회, 오른쪽 펜으로 오른쪽 선회 (펜이 안쪽)
                case 18:
                case 23:
                case 24:
                    return this.__swingPulse(value, radius + PEN_CENTER_DISTANCE);
                case 19: // 왼쪽 펜으로 오른쪽 선회, 오른쪽 펜으로 왼쪽 선회 (펜이 바깥쪽)
                case 20:
                case 21:
                case 22:
                    return this.__swingPulse(value, Math.abs(radius - PEN_CENTER_DISTANCE));
                case 25: // 바퀴 회전 (블록에서 만들지 않지만 entry-hw 표에 있어 함께 둔다)
                case 26:
                case 27:
                case 28:
                case 29:
                case 30:
                    return Math.round(value * 2.46031746031746);
                default:
                    return 0;
            }
        }

        // 모션 타입 -> [왼쪽, 오른쪽] 바퀴 속도. 타입 0 이면 null(사용자 설정 속도를 쓴다).
        // 1..30 전부 속도를 가지므로, 펄스를 받고도 바퀴가 서 있어 완료 신호가 오지 않는
        // 타입은 없다.
        __motionWheels(type, speed, radius) {
            const inner = (r) => this.__innerSpeed(speed, r);
            const pen = PEN_CENTER_DISTANCE;
            // 19..22 는 반지름이 펜 거리보다 작으면 선회 방향이 뒤집힌다.
            const far = radius >= pen;
            switch (type) {
                case 1:
                    return [speed, speed];
                case 2:
                    return [-speed, -speed];
                case 3:
                    return [-speed, speed];
                case 4:
                    return [speed, -speed];
                case 5:
                    return [0, speed];
                case 6:
                    return [0, -speed];
                case 7:
                    return [speed, 0];
                case 8:
                    return [-speed, 0];
                case 9:
                    return [inner(radius), speed];
                case 10:
                    return [-inner(radius), -speed];
                case 11:
                    return [speed, inner(radius)];
                case 12:
                    return [-speed, -inner(radius)];
                case 13:
                    return [inner(pen), speed];
                case 14:
                    return [-inner(pen), -speed];
                case 15:
                    return [speed, inner(pen)];
                case 16:
                    return [-speed, -inner(pen)];
                case 17:
                    return [inner(radius + pen), speed];
                case 18:
                    return [-inner(radius + pen), -speed];
                case 19:
                    return far ? [speed, inner(radius - pen)] : [-inner(pen - radius), -speed];
                case 20:
                    return far ? [-speed, -inner(radius - pen)] : [inner(pen - radius), speed];
                case 21:
                    return far ? [inner(radius - pen), speed] : [-speed, -inner(pen - radius)];
                case 22:
                    return far ? [-inner(radius - pen), -speed] : [speed, inner(pen - radius)];
                case 23:
                    return [speed, inner(radius + pen)];
                case 24:
                    return [-speed, -inner(radius + pen)];
                case 25:
                    return [speed, 0];
                case 26:
                    return [-speed, 0];
                case 27:
                    return [0, speed];
                case 28:
                    return [0, -speed];
                case 29:
                    return [speed, speed];
                case 30:
                    return [-speed, -speed];
                default:
                    return null;
            }
        }

        // 시간 단위 이동이 끝났거나 펄스가 0이라 걸 것이 없을 때. 수신 상태머신이 완료를 알리도록
        // event = -1 을 남긴다. 여기서 바로 콜백을 부르지 않는 이유는 두 단위의 완료 경로를
        // 하나로 모으기 위해서다(그래야 취소와 선점 규칙이 한 벌로 끝난다).
        __endMotionNow() {
            this.__removeMotionTimeout();
            this.wheel.count = 0;
            this.wheel.event = -1;
            this.motion.type = 0;
        }

        __removeMotionTimeout() {
            if (this.motionTimer !== undefined) {
                this.__removeTimeout(this.motionTimer);
                this.motionTimer = undefined;
            }
        }

        // 두드림과 자유낙하. 로봇은 발생 여부가 아니라 2비트 카운터를 올려 보내므로 값이 바뀐
        // 순간을 엣지로 잡는다. 첫 프레임은 기준만 잡고 발화하지 않는다.
        // 출처: entry-hw/app/modules/hamster_s.js 의 "free fall" / "tap" 구간.
        __handleTapFreeFall(internalState, sensory) {
            const ev = this.tapEvent;

            const freeFallId = (internalState >> 6) & 0x03;
            if (ev.freeFallId < 0) {
                ev.freeFallId = freeFallId;
            } else if (freeFallId != ev.freeFallId) {
                ev.freeFallId = freeFallId;
                sensory.freeFall = 1;
            }

            const tapId = (internalState >> 4) & 0x03;
            if (ev.tapId < 0) {
                ev.tapId = tapId;
            } else if (tapId != ev.tapId && !this.wheel.move) {
                // 주행 중에는 발화하지 않는다. 바퀴 진동이 두드림으로 잡히기 때문이다.
                // 이 조건을 빠뜨리면 이동 블록을 쓸 때마다 헛 두드림이 뜬다.
                // 주행 중에는 기준도 옮기지 않는다(entry-hw 와 같다). 그래서 주행 중에 카운터가
                // 바뀌었으면 정지 직후 한 번 발화한다. 설치형도 그렇게 동작한다.
                ev.tapId = tapId;
                sensory.tap = 1;
            }
        }

        // 단위 이동 완료를 감지한다. 사운드(1비트)와 달리 2비트 4상태다.
        // state 2 = 멈춤, 3 = 목표 도달. 짧은 이동(pulse < 25)은 로봇이 3을 못 내기도 해서
        // "멈춘 상태가 8프레임 이어지면 완료"라는 별도 유예가 있다.
        // 출처: entry-hw/app/modules/hamster_s.js 의 "wheel state" 구간.
        __handleWheelState(state, sensory) {
            const wheel = this.wheel;
            if (wheel.event == 1) {
                if (state == 2) {
                    if (wheel.pulse > 0 && wheel.pulse < 25) {
                        if (++wheel.count > 8) {
                            wheel.event = 2;
                        }
                    }
                } else if (state == 3) {
                    wheel.event = 2;
                }
            }
            if (wheel.event == 2) {
                if (state != wheel.state || wheel.count > 8) {
                    wheel.state = state;
                    sensory.wheelState = state;
                    if (state == 2) {
                        wheel.event = 0;
                        wheel.count = 0;
                        this.motion.type = 0;
                        this.__resolvePending('wheelDone');
                    }
                }
            }
            if (wheel.event == -1) {
                // 시간 단위 완료. 다음 프레임에서 무조건 끝낸다.
                wheel.state = state;
                sensory.wheelState = 2;
                wheel.event = 0;
                wheel.count = 0;
                this.motion.type = 0;
                this.__resolvePending('wheelDone');
            }
        }

        // 사운드 재생 완료를 감지하고 반복을 이어 돌린다. 반복 횟수는 로봇이 세지 않는다.
        // 한 번 끝날 때마다 여기서 soundRepeat 를 깎고 같은 소리를 다시 건다.
        // 출처: entry-hw/app/modules/hamster_s.js 의 "sound state" 구간.
        // 구형 햄스터는 motoring.sound 를 세우지 않으므로 이 경로가 아무 일도 하지 않는다.
        __handleSoundState(state, sensory) {
            const sound = this.sound;
            const motoring = this.motoring;
            if (sound.event == 1) {
                // 재생 시작 직후 한동안은 상태가 아직 0이다. 그 구간을 완료로 오인하지 않도록
                // 5프레임 유예를 준 뒤에야 완료 판정을 켠다.
                if (state == 0) {
                    if (++sound.count > 5) {
                        sound.event = 2;
                    }
                } else {
                    sound.event = 2;
                }
            }
            if (sound.event != 2) {
                return;
            }
            if (state == sound.state && sound.count <= 5) {
                return;
            }
            sound.state = state;
            sensory.soundState = state;
            if (state != 0) {
                return;
            }
            sound.event = 0;
            sound.count = 0;
            if (motoring.sound > 0 && motoring.soundRepeat < 0) {
                this.__runSound(motoring.sound, -1); // 무한 반복
                return;
            }
            if (motoring.sound > 0 && motoring.soundRepeat > 1) {
                motoring.soundRepeat--;
                this.__runSound(motoring.sound, motoring.soundRepeat);
                return;
            }
            // 마지막 회차가 끝났다. 대기 중인 블록을 여기서 푼다.
            motoring.sound = 0;
            motoring.soundRepeat = 1;
            sensory.soundStateId = (sensory.soundStateId % 255) + 1;
            this.__resolvePending('soundDone');
        }

        // 구형 햄스터는 사운드 기능이 없다. 상위에 두는 이유는 패킷과 수신 경로를 두 기종이
        // 공유하기 때문이고, motoring.sound 가 늘 0이라 실제로는 호출돼도 무해하다.
        __runSound(sound, count) {
            let repeat = typeof count === 'number' ? count : 1;
            if (repeat < 0) {
                repeat = -1; // 음수는 전부 "무한 반복" 하나로 모은다
            }
            if (repeat) {
                this.motoring.sound = sound;
                this.motoring.soundRepeat = repeat;
                this.sound.written = true;
            }
        }

        // 취소는 콜백을 버리지 않고 반드시 완료로 알린다.
        // 설치형(block_robomation.js)은 `soundCallback = undefined` 로 버리는데, 그쪽은
        // Entry.hw 가 스크립트를 따로 정리해 줘서 성립한다. lite 의 playSoundUntil 은
        // isPlaying 이 false 가 될 때까지 스스로 폴링하고 그걸 풀어 주는 곳이 여기뿐이라,
        // 설치형 모양을 그대로 베끼면 블록이 오류 없이 영원히 멈춘다.
        __cancelSound() {
            this.sound.event = 0;
            this.sound.count = 0;
            this.motoring.sound = 0;
            this.motoring.soundRepeat = 1;
            this.__resolvePending('soundDone');
        }

        // 햄스터S 패킷에 실을 LED 여섯 바이트를 돌려준다.
        // 이 인스턴스(구형 항목)는 팔레트 번호 모델을 쓴다. setLed 가 leftLed/rightLed 에만
        // 쓰므로 여기서 RGB 로 바꿔 준다. 구형 항목으로 햄스터S 를 연결하는
        // 경로가 이 변환에 의존한다. RGB 필드만 읽으면 그 경로의 LED 가 꺼진다.
        // m 은 송신용으로 자른 복사본이다(__clampedMotoring). 원본을 읽으면 자르기를 우회한다.
        __ledRgb(m) {
            const l = this.colorToRgb(m.leftLed);
            const r = this.colorToRgb(m.rightLed);
            return [l[0], l[1], l[2], r[0], r[1], r[2]];
        }

        // ── 시리얼 훅 ── 구형 항목은 시리얼을 모른다(entry-hw hamster.js 도 첫 자리 2 프레임을 버린다).
        // HamsterSLite 가 재정의한다.
        __handleSerialFrame() {
            return false;
        }

        __handlePortAck() {}

        __serialPacket() {
            return null;
        }

        __onMotorPacketSent() {}

        // 근접 센서 대역폭 기본값. 구형 항목은 entry-hw hamster.js 의 3, 햄스터S 항목은 hamster_s.js 의
        // 0 이다(HamsterSLite 가 재정의). 이 값을 바꾸는 블록은 없다.
        __defaultConfigBandWidth() {
            return 3;
        }

        // 햄스터S 패킷의 바퀴 속도 배율. 이 인스턴스(구형 항목)는 설치형 "햄스터" 항목이
        // 햄스터S 로봇을 받을 때, 즉 entry-hw hamster.js 의 isHamsterS 분기와 같게 × 1.14 다.
        // 햄스터S 항목(hamster_s.js)은 배율이 없다. HamsterSLite 가 1 로 재정의한다.
        __wheelScale() {
            return 1.14;
        }

        clampByte(value) {
            value = parseInt(value, 10);
            if (isNaN(value)) return 0;
            if (value < 0) return 0;
            if (value > 255) return 255;
            return value;
        }
        speedToGain(speed) {
            if (speed > 10) speed = 10;
            else if (speed < 1) speed = 1;
            switch (speed) {
                case 1:
                case 2:
                    return 6;
                case 3:
                case 4:
                    return 5;
                case 5:
                case 6:
                    return 4;
                case 7:
                case 8:
                    return 3;
                case 9:
                case 10:
                    return 2;
            }
            return 2;
        }

        // 햄스터S 패킷의 선 따라가기 방향 변화량(gain) 4비트. 구형 항목은 gain 블록이 없어
        // 속도에서 유도한다. 햄스터S 항목은 블록이 정한 값을 쓴다(HamsterSLite 가 재정의).
        __lineTracerGain(m) {
            return this.speedToGain(m.lineTracerSpeed);
        }

        // entry-hw 가 handleRemoteData 에서 받은 값을 자르는 범위를 송신 직전 복사본에 적용한다.
        // lite 에는 그 단계가 없어 여기서 자른다. 자르지 않으면 바퀴 150 이 0x96(-106)으로 실려
        // 로봇이 뒤로 달린다. motoring 자체는 자르지 않는다: 설치형도 블록 쪽 값(바꾸기 누적)은
        // 그대로 두고 entry-hw 쪽 사본만 자른다. 범위는 entry-hw hamster.js 의 것(구형 항목).
        // HamsterSLite 는 hamster_s.js 의 범위로 재정의한다.
        __clampedMotoring() {
            return clampFields(this.motoring, OLD_CLAMPS);
        }

        requestLocalData() {
            var motoring = this.__clampedMotoring();
            var lineTracer = this.lineTracer;
            if (this.isHamsterS) {
                // 단위 이동이 걸려 있으면 바퀴 속도를 그쪽이 정한다. motoring 을 덮지 않고
                // 지역 값으로만 쓴다. 덮으면 이동이 끝난 뒤 사용자가 설정해 둔 속도가 사라진다.
                // 시리얼로 보낼 것이 있으면 이번 송신은 모터 패킷 대신 시리얼 패킷이다(entry-hw 와 같은 순서).
                const serialPacket = this.__serialPacket();
                if (serialPacket) {
                    return serialPacket;
                }
                const drive = this.__applyMotion(motoring);
                var str = '10';
                // 배율은 인스턴스마다 다르다(__wheelScale 참조). 햄스터S 항목은 entry-hw
                // hamster_s.js 처럼 그대로, 구형 항목은 hamster.js 처럼 × 1.14. 한 벌로 합치면
                // 둘 중 한 쪽이 설치형보다 14% 어긋난다(시간 단위 이동은 거리까지).
                const scale = this.__wheelScale();
                const left = drive.left * scale;
                const right = drive.right * scale;
                if (left < 0) str += this.toHex(left - 0.5);
                else str += this.toHex(left + 0.5);
                if (right < 0) str += this.toHex(right - 0.5);
                else str += this.toHex(right + 0.5);
                // LED 값의 출처는 인스턴스마다 다르다(__ledRgb 참조). 여기서는 받은 값을 싣기만 한다.
                // toHex 는 폭을 자르지 않아 255 를 넘기면 세 자리가 되어 이후 필드가 전부 밀리므로
                // 송신 직전에 0..255 로 자른다(entry-hw 는 수신 시 자른다. 자르는 시점만 다르고
                // 나가는 바이트는 같다).
                const led = this.__ledRgb(motoring);
                for (let i = 0; i < 6; i++) {
                    str += this.toHex(this.clampByte(led[i]));
                }
                const wheel = this.wheel;
                if (this.motion.written || wheel.written) {
                    this.motion.written = false;
                    wheel.written = false;
                    // 펄스가 0 -> 0 이면 id 를 올리지 않는다. 올리면 로봇이 같은 정지를 새 명령으로 본다.
                    if (wheel.pulse != 0 || wheel.pulsePrev != 0) {
                        wheel.id = (wheel.id % 255) + 1;
                    }
                    wheel.count = 0;
                    if (wheel.pulse > 0) {
                        wheel.event = 1;
                    } else if (wheel.event != -1) {
                        wheel.event = 0;
                    }
                    wheel.pulsePrev = wheel.pulse;
                }
                str += this.toHex(wheel.id);
                str += this.toHex2(wheel.pulse);
                var tmp = motoring.lineTracerMode & 0x0f;
                if (tmp > 7) tmp++;
                if (lineTracer.written) {
                    lineTracer.written = false;
                    lineTracer.count = 0;
                    if (tmp > 0) {
                        lineTracer.flag = (lineTracer.flag % 15) + 1;
                        lineTracer.event = 1;
                    } else {
                        lineTracer.event = 0;
                    }
                }
                tmp |= (lineTracer.flag & 0x0f) << 4;
                str += this.toHex(tmp);
                tmp = (motoring.lineTracerSpeed & 0x0f) << 4;
                tmp |= this.__lineTracerGain(motoring) & 0x0f;
                str += this.toHex(tmp);
                tmp = (motoring.configProximity & 0x07) << 5;
                tmp |= (motoring.configBandWidth & 0x07) << 2;
                tmp |= motoring.configGravity & 0x03;
                str += this.toHex(tmp);
                // 전압 입력(5)은 로봇에 아날로그 절대값 입력(4)으로 보낸다. 수신한 값을 전압으로
                // 바꾸는 일은 handleLocalData 가 한다. 출처: entry-hw hamster_s.js.
                // 구형 항목의 드롭다운에는 5가 없어 그쪽 패킷은 바뀌지 않는다.
                // 176 이상은 시리얼 통신 속도(9600~115200)라 바이트 하나를 통째로 쓴다(entry-hw 와 같다).
                // 구형 항목은 hamster.js 범위(0..15)로 잘려 이 분기에 오지 않는다.
                if (motoring.ioModeA >= 176) {
                    tmp = motoring.ioModeA;
                } else {
                    const ioA = motoring.ioModeA == 5 ? 4 : motoring.ioModeA;
                    const ioB = motoring.ioModeB == 5 ? 4 : motoring.ioModeB;
                    tmp = (ioA & 0x0f) << 4;
                    tmp |= ioB & 0x0f;
                }
                str += this.toHex(tmp);
                str += this.toHex(motoring.outputA);
                str += this.toHex(motoring.outputB);
                // 사운드 / 음 / 버저가 같은 2바이트 자리를 나눠 쓴다. 우선순위는 이 순서다.
                // 즉 motoring.sound 가 0이 아니면 note 와 buzzer 는 취소 호출 없이도 조용히 밀린다.
                // 버저나 음을 세우는 쪽에서 반드시 사운드를 먼저 꺼야 하는 이유다.
                const sound = this.sound;
                const sndid = SOUND_TO_ID[motoring.sound] || 0;
                if (sound.written) {
                    sound.written = false;
                    sound.count = 0;
                    if (sndid > 0) {
                        // 같은 소리를 연속 재생할 때 로봇이 "안 바뀌었다"로 보지 않도록 토글한다.
                        sound.flag ^= 0x80;
                        sound.event = 1;
                    } else {
                        sound.event = 0;
                    }
                }
                if (sndid > 0) {
                    str += '00';
                    str += this.toHex(sndid | sound.flag);
                } else if (motoring.note > 0) {
                    str += '01';
                    str += this.toHex(motoring.note);
                } else {
                    str += this.toHex2(motoring.buzzer * 10 + 512);
                }
                str += '-';
                str += this.address;
                str += '\r';
                this.__onMotorPacketSent();
                return str;
            } else {
                var str = this.toHex(motoring.topology & 0x0f);
                str += '0010';
                str += this.toHex(motoring.leftWheel);
                str += this.toHex(motoring.rightWheel);
                str += this.toHex(motoring.leftLed);
                str += this.toHex(motoring.rightLed);
                str += this.toHex3(motoring.buzzer * 100);
                str += this.toHex(motoring.note);
                if (lineTracer.written) {
                    lineTracer.written = false;
                    if (motoring.lineTracerMode > 0) {
                        lineTracer.flag ^= 0x80;
                        lineTracer.event = 1;
                    }
                }
                var tmp = (motoring.lineTracerMode & 0x0f) << 3;
                tmp |= (motoring.lineTracerSpeed - 1) & 0x07;
                tmp |= lineTracer.flag & 0x80;
                str += this.toHex(tmp);
                str += this.toHex(motoring.configProximity);
                tmp = (motoring.configGravity & 0x0f) << 4;
                tmp |= motoring.configBandWidth & 0x0f;
                str += this.toHex(tmp);
                tmp = (motoring.ioModeA & 0x0f) << 4;
                tmp |= motoring.ioModeB & 0x0f;
                str += this.toHex(tmp);
                str += this.toHex(motoring.outputA);
                str += this.toHex(motoring.outputB);
                str += '000000-';
                str += this.address;
                str += '\r';
                return str;
            }
        }

        handleLocalData(data) {
            // data: string
            const identity = this.parseIdentityData(data);
            if (identity) {
                // 받아들이는 기종의 정체를 본 시점. 같은 로봇이 되돌아오면 아래 변경 감지
                // 분기에 걸리지 않으므로, 거부 상태 해제는 반드시 여기서 처리해야 한다.
                if (this.acceptsIdentity(identity)) {
                    this.onAcceptedIdentity(identity);
                }
                // 연결 유지 중 동글의 페어링 로봇이 바뀌면 정체 라인이 다시 온다.
                // 1회성 라인(노이즈)으로 주행 중 정지하지 않도록 동일 정체 2회 확인 후 전환한다.
                if (identity.isHamsterS !== this.isHamsterS || identity.address !== this.address) {
                    const pending = this.pendingIdentity;
                    if (
                        pending &&
                        pending.isHamsterS === identity.isHamsterS &&
                        pending.address === identity.address
                    ) {
                        this.pendingIdentity = undefined;
                        if (!this.acceptsIdentity(identity)) {
                            // 이 항목이 받지 않는 기종이다. 코어 teardown은 부르지 않는다:
                            // disconnect()는 작품에 저장된 하드웨어 선택까지 비운다.
                            this.onForeignRobot(identity);
                            return;
                        }
                        this.setRobotIdentity(identity);
                        // 세션 중 로봇이 바뀐 시점을 남긴다. 이 전환은 사용자에게
                        // "로봇이 갑자기 멈췄다"로 보이므로 원인 추적에 필요하다.
                        console.info('HamsterLite: runtime robot identity switch', identity);
                        // 주의: setZero()는 Entry.hwLite.serial.update()를 통해
                        // 새 정체 기준의 정지 패킷을 즉시 1회 write한다(의도된 동작).
                        this.setZero();
                    } else {
                        this.pendingIdentity = identity;
                        // 확인용 두 번째 정체가 이 프레임 수 안에 오지 않으면 보류를 폐기한다.
                        // 한참 떨어져 들어온 외부 정체 2회로 잘못 전환되는 것을 막는다(약 2초).
                        this.pendingIdentityTtl = 60;
                    }
                } else {
                    this.pendingIdentity = undefined;
                }
                this.invalidFrameCount = 0;
                return;
            }
            if (this.pendingIdentity && --this.pendingIdentityTtl <= 0) {
                this.pendingIdentity = undefined;
            }
            // 받지 않는 기종이 붙어 있는 동안에는 센서 프레임을 해석하지 않는다.
            // 해석하면 다른 기종의 프레임을 이 기종 규격으로 읽어 센서값에 쓰레기가 들어간다.
            if (!this.shouldParseSensory()) {
                return;
            }
            if (data?.length != 53) {
                return;
            }

            if (this.isHamsterS) {
                var str = data.slice(0, 1);
                var value = parseInt(str, 16);
                // 첫 자리 2 는 시리얼 수신 프레임이다(햄스터S 항목만 받는다, __handleSerialFrame).
                if (value == 2 && this.__handleSerialFrame(data)) {
                    this.handleSensory();
                    return;
                }
                if (value != 1) {
                    this.reportInvalidFrame();
                    return;
                }
                this.invalidFrameCount = 0;

                var sensory = this.sensory;
                // left proximity
                str = data.slice(6, 8);
                value = parseInt(str, 16);
                sensory.leftProximity = value;
                // right proximity
                str = data.slice(8, 10);
                value = parseInt(str, 16);
                sensory.rightProximity = value;
                str = data.slice(38, 40);
                var value2 = parseInt(str, 16);
                if ((value2 & 0x01) == 0) {
                    // flag
                    // light
                    str = data.slice(10, 14);
                    value = parseInt(str, 16);
                    sensory.light = value;
                } else {
                    // temperature
                    str = data.slice(10, 12);
                    value = parseInt(str, 16);
                    if (value > 0x7f) value -= 0x100;
                    value = value / 2.0 + 23;
                    value = value.toFixed(1);
                    sensory.temperature = value;
                }
                // left floor
                str = data.slice(14, 16);
                value = parseInt(str, 16);
                sensory.leftFloor = value;
                // right floor
                str = data.slice(16, 18);
                value = parseInt(str, 16);
                sensory.rightFloor = value;
                // acceleration x
                str = data.slice(18, 22);
                value = parseInt(str, 16);
                if (value > 0x7fff) value -= 0x10000;
                sensory.accelerationX = value;
                // acceleration y
                str = data.slice(22, 26);
                value = parseInt(str, 16);
                if (value > 0x7fff) value -= 0x10000;
                sensory.accelerationY = value;
                // acceleration z
                str = data.slice(26, 30);
                value = parseInt(str, 16);
                if (value > 0x7fff) value -= 0x10000;
                sensory.accelerationZ = value;
                // input a / b. 전압 입력 모드면 0..255 를 0..3.6V 로 바꾼다(소수 둘째 자리 문자열,
                // entry-hw hamster_s.js 와 같은 모양).
                str = data.slice(30, 32);
                value = parseInt(str, 16);
                if (this.motoring.ioModeA == 5) {
                    value = ((value * 3.6) / 255).toFixed(2);
                }
                sensory.inputA = value;
                str = data.slice(32, 34);
                value = parseInt(str, 16);
                if (this.motoring.ioModeB == 5) {
                    value = ((value * 3.6) / 255).toFixed(2);
                }
                sensory.inputB = value;
                // 내부 상태 바이트.
                // 네 가지가 비트로 들어 있다:
                //   >>6 & 0x03  freeFall   (아래에서 사용)
                //   >>4 & 0x03  tap        (아래에서 사용)
                //   >>2 & 0x03  wheelState (아래에서 사용)
                //   >>1 & 0x01  soundState (아래에서 사용)
                str = data.slice(34, 36);
                const internalState = parseInt(str, 16);
                this.__handleTapFreeFall(internalState, sensory);
                this.__handleWheelState((internalState >> 2) & 0x03, sensory);
                this.__handleSoundState((internalState >> 1) & 0x01, sensory);
                // signal strength
                str = data.slice(36, 38);
                value = parseInt(str, 16);
                value -= 0x100;
                sensory.signalStrength = value;
                value = (value2 >> 6) & 0x03;
                if ((value & 0x02) != 0) {
                    var lineTracer = this.lineTracer;
                    if (lineTracer.event == 1) {
                        if (value == 0x02) {
                            if (++lineTracer.count > 5) lineTracer.event = 2;
                        } else {
                            lineTracer.event = 2;
                        }
                    }
                    if (lineTracer.event == 2) {
                        if (value != lineTracer.state || lineTracer.count > 5) {
                            lineTracer.state = value;
                            sensory.lineTracerState = value << 5;
                            sensory.lineTracerStateId = (sensory.lineTracerStateId % 255) + 1;
                            if (value == 0x02) {
                                lineTracer.event = 0;
                                lineTracer.count = 0;
                            }
                        }
                    }
                }
                // battery state
                value = (value2 >> 1) & 0x03;
                if (value == 0) value = 2;
                else if (value >= 2) value = 0;
                var batt = this.battery;
                if (value != batt.state) {
                    batt.state = value;
                    sensory.batteryState = value;
                }
                this.__handlePortAck(value2);
            } else {
                var str = data.slice(4, 5);
                var value = parseInt(str, 16);
                if (value != 1) {
                    this.reportInvalidFrame();
                    return;
                }
                this.invalidFrameCount = 0;

                var sensory = this.sensory;
                // signal strength
                str = data.slice(6, 8);
                value = parseInt(str, 16);
                value -= 0x100;
                sensory.signalStrength = value;
                // left proximity
                str = data.slice(8, 10);
                value = parseInt(str, 16);
                sensory.leftProximity = value;
                // right proximity
                str = data.slice(10, 12);
                value = parseInt(str, 16);
                sensory.rightProximity = value;
                // left floor
                str = data.slice(12, 14);
                value = parseInt(str, 16);
                sensory.leftFloor = value;
                // right floor
                str = data.slice(14, 16);
                value = parseInt(str, 16);
                sensory.rightFloor = value;
                // acceleration x
                str = data.slice(16, 20);
                value = parseInt(str, 16);
                if (value > 0x7fff) value -= 0x10000;
                sensory.accelerationX = value;
                // acceleration y
                str = data.slice(20, 24);
                value = parseInt(str, 16);
                if (value > 0x7fff) value -= 0x10000;
                sensory.accelerationY = value;
                // acceleration z
                str = data.slice(24, 28);
                value = parseInt(str, 16);
                if (value > 0x7fff) value -= 0x10000;
                sensory.accelerationZ = value;
                // flag
                str = data.slice(28, 30);
                var flag = parseInt(str, 16);
                if (flag == 0) {
                    // light
                    str = data.slice(30, 34);
                    value = parseInt(str, 16);
                    sensory.light = value;
                } else {
                    // temperature
                    str = data.slice(30, 32);
                    value = parseInt(str, 16);
                    if (value > 0x7f) value -= 0x100;
                    value = value / 2.0 + 24;
                    value = value.toFixed(1);
                    sensory.temperature = value;
                    // battery
                    str = data.slice(32, 34);
                    value = parseInt(str, 16);
                    value = value / 100.0 + 2;
                    var batt = this.battery;
                    if (batt.count < 10) {
                        ++batt.count;
                    } else {
                        batt.index %= 10;
                        batt.sum -= batt.data[batt.index];
                    }
                    batt.sum += value;
                    batt.data[batt.index] = value;
                    ++batt.index;
                    value = batt.sum / batt.count;
                    var state = 2;
                    if (value < 3.0) state = 0;
                    else if (value < 3.6) state = 1;
                    if (state != batt.state) {
                        batt.state = state;
                        sensory.batteryState = state;
                    }
                }
                // input a
                str = data.slice(34, 36);
                value = parseInt(str, 16);
                sensory.inputA = value;
                // input b
                str = data.slice(36, 38);
                value = parseInt(str, 16);
                sensory.inputB = value;
                // line tracer state
                str = data.slice(38, 40);
                value = parseInt(str, 16);
                if ((value & 0x40) != 0) {
                    var lineTracer = this.lineTracer;
                    if (lineTracer.event == 1) {
                        if (value != 0x40) {
                            lineTracer.event = 2;
                        }
                    }
                    if (lineTracer.event == 2) {
                        if (value != lineTracer.state) {
                            lineTracer.state = value;
                            sensory.lineTracerState = value;
                            sensory.lineTracerStateId = (sensory.lineTracerStateId % 255) + 1;
                            if (value == 0x40) {
                                lineTracer.event = 0;
                            }
                        }
                    }
                }
            }
            this.handleSensory();
        }

        requestInitialData() {
            return 'FF\r';
        }

        // 이름 필드는 사용자가 바꿀 수 있고 다국어라, 콤마가 섞이면 앞에서부터 센 위치가 밀린다.
        // 종단 CR/LF만 제거하고 콤마로 분리한 뒤 고정 구조(모델/변형/주소)를 뒤에서 집는다.
        // 실측 포맷: FF01,<이름>,<모델2hex>,<변형2hex>,<주소12hex>
        parseIdentityData(data) {
            if (typeof data !== 'string' || data.slice(0, 2) != 'FF') {
                return undefined;
            }
            const info = data.replace(/[\r\n]+$/, '').split(',');
            if (info.length < 5) {
                return undefined;
            }
            const model = info[info.length - 3];
            const variant = info[info.length - 2];
            const address = info[info.length - 1];
            // 주소는 실측상 항상 16진수 12자리이며 뒤에 덧붙는 문자가 없다. 레거시의
            // length>=12 + substring(0,12)로 느슨하게 받던 것보다 좁게 잡았다(entry-hw와 동일 정책).
            if (!/^[0-9A-Fa-f]{2}$/.test(variant) || !/^[0-9A-Fa-f]{12}$/.test(address)) {
                return undefined;
            }
            if (model == '04' || model == '0E') {
                return { isHamsterS: model == '0E', address };
            }
            return undefined;
        }

        setRobotIdentity(identity) {
            this.isHamsterS = identity.isHamsterS;
            this.address = identity.address;
        }

        // 이 항목이 받아들이는 기종인지. 기본 항목은 두 기종을 모두 받는다.
        // 판정을 setRobotIdentity 재정의로 하면 안 된다. 세션 중 경로는 값을 갱신하지 않은 채
        // 다음 프레임에 같은 판정을 다시 하게 되어 수렴하지 않는다.
        acceptsIdentity() {
            return true;
        }

        // 기본 항목은 거부하지 않으므로 이 경로에 오지 않는다. 방어용 no-op.
        onForeignRobot() {}

        // 받아들이는 기종의 정체를 봤을 때. 기본 항목은 할 일이 없다.
        onAcceptedIdentity() {}

        // 센서 프레임을 해석해도 되는 상태인지. 기본 항목은 항상 해석한다.
        shouldParseSensory() {
            return true;
        }

        // 검증 실패 프레임이 연속되면 로봇/모드 불일치 가능성이 높다 → 정체를 다시 묻는다.
        // 스트림 약 30fps 기준 1초 연속 불일치에서 1회 발화.
        // (다른 기종으로 바뀔 때 총 전환 지연은 정체 2회 확인 구조라 약 2~3초)
        reportInvalidFrame() {
            this.invalidFrameCount = (this.invalidFrameCount || 0) + 1;
            if (this.invalidFrameCount >= 30) {
                this.invalidFrameCount = 0;
                try {
                    if (Entry.hwLite && Entry.hwLite.serial) {
                        Entry.hwLite.serial.sendAsciiAsBuffer(this.requestInitialData());
                    }
                } catch (error) {
                    // teardown 중 writer가 이미 해제된 경우. 프로브는 실패해도 무시한다
                    console.error(error);
                }
            }
        }

        async initialHandshake() {
            // 연결할 때 블록 쪽 값을 기본값으로 되돌린다. 설치형은 정지할 때마다 무조건 되돌리는데
            // (hw.ts 의 stop 이벤트), lite 코어는 연결돼 있을 때만 되돌린다(engine.js). 실행 중 연결이
            // 끊겨 멈추면 값이 남아, 다시 연결해 실행하면 끊기기 전 바퀴와 LED 값이 먼저 나간다.
            this.__resetState();
            // entry-hw 는 연결할 때 reset() 에서 pulsePrev 만 -1("직전 명령 없음")로 두고 id 는 남긴다.
            // 보낼 것으로 표시된 명령도 지운다(reset() 과 같다).
            this.wheel.pulsePrev = -1;
            this.wheel.written = false;
            this.sound.written = false;
            this.lineTracer.written = false;
            // reset() 이 되돌리는 수신 상태도 같이 되돌린다(두드림 기준은 entry-hw 도 안 되돌린다).
            this.wheel.move = false;
            this.wheel.moveCount = 0;
            this.lineTracer.event = 0;
            this.lineTracer.state = 0;
            this.lineTracer.count = 0;
            this.battery = { state: 2, data: new Array(10), sum: 0.0, index: 0, count: 0 };
            this.sensory.batteryState = 2;
            const serial = Entry.hwLite.serial;
            let identity;
            let timedOut = false;
            let timer;
            const timeoutPromise = new Promise((resolve) => {
                timer = setTimeout(() => {
                    timedOut = true;
                    resolve('timeout');
                }, this.handshakeTimeoutMs);
            });
            try {
                // 동글이 자발 송출을 안 하는 상태(미페어링 등)에서도 응답을 유도한다.
                serial.sendAsciiAsBuffer(this.requestInitialData());
                while (!timedOut) {
                    // 반복마다 진행 중인 read는 항상 정확히 1개다.
                    // 타임아웃 패자로 남는 pending read는 removeSerialPort()의 reader.cancel()이
                    // {done:true}로 settle하므로 누수/unhandled rejection이 없다.
                    const result = await Promise.race([serial.reader.read(), timeoutPromise]);
                    if (result === 'timeout' || result.done) {
                        break;
                    }
                    identity = this.parseIdentityData(result.value);
                    if (identity) {
                        break;
                    }
                    if (typeof result.value !== 'string' || result.value.slice(0, 2) != 'FF') {
                        // 원본 동작 유지: FF로 시작하는 라인에는 재요청하지 않는다(프로브 증폭 방지)
                        serial.sendAsciiAsBuffer(this.requestInitialData());
                    }
                }
            } catch (error) {
                // 스트림 에러(연결 중 동글 제거 등)로 read가 reject하거나 write가 동기
                // throw해도 아래 정리 경로로 합류시킨다. throw로 빠지면 포트 정리가
                // 건너뛰어져 "실패 시 포트 방치" 결함이 이 창에서 재발한다.
                console.error(error);
                identity = undefined;
            }
            clearTimeout(timer);
            if (!identity) {
                // 실패 시 코어(hw_lite.connect catch)는 포트를 닫지 않는다. 열린 포트가 방치되면
                // 같은 동글은 port.open() InvalidStateError로 새로고침 전까지 재연결 불가 → 모듈이 직접 정리.
                await serial.removeSerialPort();
                return false;
            }
            if (!this.acceptsIdentity(identity)) {
                // 고른 항목이 받지 않는 기종이다. 위 실패 분기와 같은 정리를 반드시 거친다:
                // 건너뛰면 같은 동글이 새로고침 전까지 재연결 불가가 된다.
                // 정리를 먼저 한다. 토스트가 던지면 포트가 열린 채 남아,
                // 같은 동글이 새로고침 전까지 재연결 불가가 된다.
                await serial.removeSerialPort();
                this.onRejectedAtConnect();
                return false;
            }
            this.setRobotIdentity(identity);
            return true;
        }
    } // class HamsterLite 끝

    Entry.HamsterLite = new HamsterLite();

    class HamsterSLite extends HamsterLite {
        constructor() {
            super();
            this.id = '020E01'; // 햄스터S 모듈 번호
            this.name = 'HamsterSLite';
            this.imageName = 'hamsterslite.png';
            // 초기값. 공유 setRobotIdentity가 핸드셰이크와 세션 중 재식별에서 이 값에 대입하므로
            // 읽기 전용 접근자로 만들면 안 된다. 다른 기종을 거부하는 일은
            // acceptsIdentity()와 두 호출부가 담당한다(설정자를 재정의하지 않는다).
            this.isHamsterS = true;
            // metadata 주입이 실패하면 코어가 title.ko를 역참조해 작품 로딩이 중단된다. 기본값을 둔다.
            this.title = { ko: '햄스터S' };
            // 거부 상태. setZero()는 세션 상태를 대부분 초기화하지만 이 둘은 건드리면 안 된다:
            // 지우면 onForeignRobot 안에서 setZero를 부르는 순간 안내가 무한 반복된다.
            this.foreignAttached = false; // 지금 받지 않는 기종이 붙어 있는가 (쓰기, 프로브, 파싱 차단)
            this.rejectedAddress = undefined; // 안내 중복 방지용 주소 기억
            // 메뉴는 인스턴스별 배열이다(생성자에서 대입되므로 상위와 공유하지 않는다).
            // 상속받은 구형 목록을 쓰지 않고 설치형 햄스터S(block_hamster_s.js)의 목록으로 바꾼다.
            // 순서도 설치형 그대로다(42블록).
            // 팔레트는 모든 모듈 메뉴의 합집합을 isNotFor 로 걸러 만든다(blocks/index.js).
            // 이 목록만 바꿔서는 구형 블록이 숨지 않는다. 구형 정의의 isNotFor 가 그 일을 한다.
            this.blockMenuBlocks = [
                'hamsterslite_hand_found',
                'hamsterslite_boolean',
                'hamsterslite_value',
                'hamsterslite_move_forward_once',
                'hamsterslite_turn_once',
                'hamsterslite_move_forward_unit',
                'hamsterslite_move_backward_unit',
                'hamsterslite_turn_unit_in_place',
                'hamsterslite_pivot_around_unit_in_direction',
                'hamsterslite_turn_unit_with_radius_in_direction',
                'hamsterslite_change_both_wheels_by',
                'hamsterslite_set_both_wheels_to',
                'hamsterslite_change_wheel_by',
                'hamsterslite_set_wheel_to',
                'hamsterslite_follow_line_using',
                'hamsterslite_follow_line_until',
                'hamsterslite_set_following_speed_to',
                'hamsterslite_set_following_gain_to',
                'hamsterslite_stop',
                'hamsterslite_set_led_to',
                'hamsterslite_pick_led',
                'hamsterslite_change_led_by_rgb',
                'hamsterslite_set_led_to_rgb',
                'hamsterslite_clear_led',
                'hamsterslite_play_sound_times',
                'hamsterslite_play_sound_times_until_done',
                'hamsterslite_change_buzzer_by',
                'hamsterslite_set_buzzer_to',
                'hamsterslite_clear_sound',
                'hamsterslite_play_note',
                'hamsterslite_play_note_for',
                'hamsterslite_rest_for',
                'hamsterslite_change_tempo_by',
                'hamsterslite_set_tempo_to',
                'hamsterslite_set_port_to',
                'hamsterslite_change_output_by',
                'hamsterslite_set_output_to',
                'hamsterslite_gripper',
                'hamsterslite_release_gripper',
                'hamsterslite_write_serial',
                'hamsterslite_read_serial_until',
                'hamsterslite_set_serial_rate_to',
            ];
        }

        // 파일의 다른 코드와 같이 Lang을 전역으로 읽는다. 미지원 로케일은 en으로 떨어뜨린다.
        __messages() {
            const type = typeof Lang !== 'undefined' && Lang && Lang.type;
            return S_MSGS[type] || S_MSGS.en;
        }

        // 햄스터S 항목은 RGB 모델이다. 팔레트 8색으로는 주황(FF3F00)과 보라(3F00FF)를 표현할 수
        // 없어 RGB 필드를 그대로 싣는다. 범위 밖 값은 패킷 조립 때 자른다.
        __ledRgb(m) {
            return [m.leftRed, m.leftGreen, m.leftBlue, m.rightRed, m.rightGreen, m.rightBlue];
        }

        __applyRgb(led, r, g, b) {
            const m = this.motoring;
            if (led !== 'RIGHT') {
                m.leftRed = r;
                m.leftGreen = g;
                m.leftBlue = b;
            }
            if (led !== 'LEFT') {
                m.rightRed = r;
                m.rightGreen = g;
                m.rightBlue = b;
            }
        }

        // 햄스터S 전용 번역. 상위 결과에 얹는다.
        // 타입 이름을 바꾸면 블록 글자가 사라진다. 렌더러가 Lang.template[블록타입] 으로
        // 찾는데 새 이름에 해당하는 항목이 없기 때문이다(block_view.js).
        // 문구는 설치형 햄스터S(block_hamster_s.js)에서 그대로 옮긴다. 새로 쓰지 않는다.
        // 같은 로봇의 같은 블록이므로 설치형 문구와 같아야 한다. vn 이 영어인 것도 설치형 그대로다.
        setLanguage() {
            const base = super.setLanguage();
            const add = {
                ko: {
                    template: {
                        hamsterslite_hand_found: '손 찾음?',
                        hamsterslite_boolean: '%1?',
                        hamsterslite_value: '%1',
                        hamsterslite_move_forward_once: '말판 앞으로 한 칸 이동하기 %1',
                        hamsterslite_turn_once: '말판 %1 으로 한 번 돌기 %2',
                        hamsterslite_move_forward_unit: '앞으로 %1 %2 이동하기 %3',
                        hamsterslite_move_backward_unit: '뒤로 %1 %2 이동하기 %3',
                        hamsterslite_turn_unit_in_place: '%1 으로 %2 %3 제자리 돌기 %4',
                        hamsterslite_pivot_around_unit_in_direction:
                            '%1 중심으로 %2 %3 %4 방향으로 돌기 %5',
                        hamsterslite_turn_unit_with_radius_in_direction:
                            '%1 %2 으로 %3 %4 반지름 %5 cm를 %6 방향으로 돌기 %7',
                        hamsterslite_change_both_wheels_by:
                            '왼쪽 바퀴 %1 오른쪽 바퀴 %2 만큼 바꾸기 %3',
                        hamsterslite_set_both_wheels_to:
                            '왼쪽 바퀴 %1 오른쪽 바퀴 %2 (으)로 정하기 %3',
                        hamsterslite_change_wheel_by: '%1 바퀴 %2 만큼 바꾸기 %3',
                        hamsterslite_set_wheel_to: '%1 바퀴 %2 (으)로 정하기 %3',
                        hamsterslite_follow_line_using: '%1 선을 %2 바닥 센서로 따라가기 %3',
                        hamsterslite_follow_line_until: '%1 선을 따라 %2 교차로까지 이동하기 %3',
                        hamsterslite_set_following_speed_to:
                            '선 따라가기 속도를 %1 (으)로 정하기 %2',
                        hamsterslite_set_following_gain_to:
                            '선 따라가기 방향 변화량을 %1 (으)로 정하기 %2',
                        hamsterslite_stop: '정지하기 %1',
                        hamsterslite_set_led_to: '%1 LED를 %2 으로 정하기 %3',
                        hamsterslite_pick_led: '%1 LED를 %2로 정하기 %3',
                        hamsterslite_change_led_by_rgb: '%1 LED를 R: %2 G: %3 B: %4 만큼 바꾸기 %5',
                        hamsterslite_set_led_to_rgb: '%1 LED를 R: %2 G: %3 B: %4 (으)로 정하기 %5',
                        hamsterslite_clear_led: '%1 LED 끄기 %2',
                        hamsterslite_play_sound_times: '%1 소리 %2 번 재생하기 %3',
                        hamsterslite_play_sound_times_until_done:
                            '%1 소리 %2 번 재생하고 기다리기 %3',
                        hamsterslite_change_buzzer_by: '버저 음을 %1 만큼 바꾸기 %2',
                        hamsterslite_set_buzzer_to: '버저 음을 %1 (으)로 정하기 %2',
                        hamsterslite_clear_sound: '소리 끄기 %1',
                        hamsterslite_play_note: '%1 %2 음을 연주하기 %3',
                        hamsterslite_play_note_for: '%1 %2 음을 %3 박자 연주하기 %4',
                        hamsterslite_rest_for: '%1 박자 쉬기 %2',
                        hamsterslite_change_tempo_by: '연주 속도를 %1 만큼 바꾸기 %2',
                        hamsterslite_set_tempo_to: '연주 속도를 %1 BPM으로 정하기 %2',
                        hamsterslite_set_port_to: '포트 %1 를 %2 으로 정하기 %3',
                        hamsterslite_change_output_by: '출력 %1 를 %2 만큼 바꾸기 %3',
                        hamsterslite_set_output_to: '출력 %1 를 %2 (으)로 정하기 %3',
                        hamsterslite_gripper: '집게 %1 %2',
                        hamsterslite_release_gripper: '집게 끄기 %1',
                        hamsterslite_write_serial: '시리얼 %1 %2 쓰기 %3',
                        hamsterslite_read_serial_until: '시리얼 %1 읽기 %2',
                        hamsterslite_set_serial_rate_to: '시리얼 속도를 %1 Bd로 정하기 %2',
                    },
                    Blocks: {
                        hamsterslite_tilt_forward: '앞으로 기울임',
                        hamsterslite_tilt_backward: '뒤로 기울임',
                        hamsterslite_tilt_left: '왼쪽으로 기울임',
                        hamsterslite_tilt_right: '오른쪽으로 기울임',
                        hamsterslite_tilt_flip: '거꾸로 뒤집음',
                        hamsterslite_tilt_not: '기울이지 않음',
                        hamsterslite_tap: '두드림',
                        hamsterslite_free_fall: '자유 낙하',
                        hamsterslite_battery_normal: '배터리 정상',
                        hamsterslite_battery_low: '배터리 부족',
                        hamsterslite_battery_empty: '배터리 없음',
                        hamsterslite_sensor_left_proximity: '왼쪽 근접 센서',
                        hamsterslite_sensor_right_proximity: '오른쪽 근접 센서',
                        hamsterslite_sensor_left_floor: '왼쪽 바닥 센서',
                        hamsterslite_sensor_right_floor: '오른쪽 바닥 센서',
                        hamsterslite_sensor_acceleration_x: 'x축 가속도',
                        hamsterslite_sensor_acceleration_y: 'y축 가속도',
                        hamsterslite_sensor_acceleration_z: 'z축 가속도',
                        hamsterslite_sensor_light: '밝기',
                        hamsterslite_sensor_temperature: '온도',
                        hamsterslite_sensor_signal_strength: '신호 세기',
                        hamsterslite_sensor_input_a: '입력 A',
                        hamsterslite_sensor_input_b: '입력 B',
                        hamsterslite_serial_input: '시리얼 입력',
                        hamsterslite_left: '왼쪽',
                        hamsterslite_right: '오른쪽',
                        hamsterslite_unit_cm: 'cm',
                        hamsterslite_unit_sec: '초',
                        hamsterslite_unit_pulse: '펄스',
                        hamsterslite_unit_deg: '도',
                        hamsterslite_left_pen: '왼쪽 펜',
                        hamsterslite_right_pen: '오른쪽 펜',
                        hamsterslite_left_wheel: '왼쪽 바퀴',
                        hamsterslite_right_wheel: '오른쪽 바퀴',
                        hamsterslite_forward: '앞쪽',
                        hamsterslite_backward: '뒤쪽',
                        hamsterslite_robot: '로봇',
                        hamsterslite_both: '양쪽',
                        hamsterslite_color_black: '검은색',
                        hamsterslite_color_white: '하얀색',
                        hamsterslite_front: '앞쪽',
                        hamsterslite_rear: '뒤쪽',
                        hamsterslite_gain_default: '기본 값',
                        hamsterslite_color_red: '빨간색',
                        hamsterslite_color_orange: '주황색',
                        hamsterslite_color_yellow: '노란색',
                        hamsterslite_color_green: '초록색',
                        hamsterslite_color_sky_blue: '하늘색',
                        hamsterslite_color_blue: '파란색',
                        hamsterslite_color_violet: '보라색',
                        hamsterslite_color_purple: '자주색',
                        hamsterslite_sound_beep: '삐',
                        hamsterslite_sound_random_beep: '무작위 삐',
                        hamsterslite_sound_noise: '지지직',
                        hamsterslite_sound_siren: '사이렌',
                        hamsterslite_sound_engine: '엔진',
                        hamsterslite_sound_chop: '쩝',
                        hamsterslite_sound_robot: '로봇',
                        hamsterslite_sound_dibidibidip: '디비디비딥',
                        hamsterslite_sound_good_job: '잘 했어요',
                        hamsterslite_sound_happy: '행복',
                        hamsterslite_sound_angry: '화남',
                        hamsterslite_sound_sad: '슬픔',
                        hamsterslite_sound_sleep: '졸림',
                        hamsterslite_sound_march: '행진',
                        hamsterslite_sound_birthday: '생일',
                        hamsterslite_note_c: '도',
                        hamsterslite_note_c_sharp: '도♯(레♭)',
                        hamsterslite_note_d: '레',
                        hamsterslite_note_d_sharp: '레♯(미♭)',
                        hamsterslite_note_e: '미',
                        hamsterslite_note_f: '파',
                        hamsterslite_note_f_sharp: '파♯(솔♭)',
                        hamsterslite_note_g: '솔',
                        hamsterslite_note_g_sharp: '솔♯(라♭)',
                        hamsterslite_note_a: '라',
                        hamsterslite_note_a_sharp: '라♯(시♭)',
                        hamsterslite_note_b: '시',
                        hamsterslite_port_a: 'A',
                        hamsterslite_port_b: 'B',
                        hamsterslite_port_ab: 'A와 B',
                        hamsterslite_analog_input: '아날로그 입력',
                        hamsterslite_digital_input: '디지털 입력',
                        hamsterslite_digital_input_pull_up: '디지털 입력 (풀업)',
                        hamsterslite_digital_input_pull_down: '디지털 입력 (풀다운)',
                        hamsterslite_voltage_input: '전압 입력',
                        hamsterslite_servo_output: '서보 출력',
                        hamsterslite_pwm_output: 'PWM 출력',
                        hamsterslite_digital_output: '디지털 출력',
                        hamsterslite_open_gripper: '열기',
                        hamsterslite_close_gripper: '닫기',
                        hamsterslite_serial_string: '글자',
                        hamsterslite_serial_string_line: '글자 한 줄',
                        hamsterslite_serial_all: '모두',
                        hamsterslite_serial_until_comma: ',(쉼표)까지',
                        hamsterslite_serial_until_colon: ':(쌍점)까지',
                        hamsterslite_serial_until_dollar: '$까지',
                        hamsterslite_serial_until_sharp: '#까지',
                        hamsterslite_serial_until_new_line: '줄 바꿈까지',
                    },
                    Helper: {
                        hamsterslite_hand_found:
                            "근접 센서 앞에 손 또는 물체가 있으면 '참'으로 판단하고, 아니면 '거짓'으로 판단합니다.",
                        hamsterslite_boolean:
                            "앞으로 기울임: 앞으로 기울이면 '참'으로 판단하고, 아니면 '거짓'으로 판단합니다.<br/>뒤로 기울임: " +
                            "뒤로 기울이면 '참'으로 판단하고, 아니면 '거짓'으로 판단합니다.<br/>왼쪽으로 기울임: 왼쪽으로 " +
                            "기울이면 '참'으로 판단하고, 아니면 '거짓'으로 판단합니다.<br/>오른쪽으로 기울임: 오른쪽으로 기울이면 " +
                            "'참'으로 판단하고, 아니면 '거짓'으로 판단합니다.<br/>거꾸로 뒤집음: 거꾸로 뒤집으면 '참'으로 " +
                            "판단하고, 아니면 '거짓'으로 판단합니다.<br/>기울이지 않음: 기울이지 않으면 '참'으로 판단하고, " +
                            "아니면 '거짓'으로 판단합니다.<br/>배터리 정상: 배터리 잔량이 충분하면 '참'으로 판단하고, 아니면 " +
                            "'거짓'으로 판단합니다.<br/>배터리 부족: 배터리 잔량이 부족하면 '참'으로 판단하고, 아니면 " +
                            "'거짓'으로 판단합니다.<br/>배터리 없음: 배터리 잔량이 없으면 '참'으로 판단하고, 아니면 '거짓'으로 " +
                            '판단합니다.',
                        hamsterslite_value:
                            '왼쪽 근접 센서: 왼쪽 근접 센서의 값 (값의 범위: 0 ~ 255, 초기값: 0)<br/>오른쪽 근접 ' +
                            '센서: 오른쪽 근접 센서의 값 (값의 범위: 0 ~ 255, 초기값: 0)<br/>왼쪽 바닥 센서: 왼쪽 ' +
                            '바닥 센서의 값 (값의 범위: 0 ~ 100, 초기값: 0)<br/>오른쪽 바닥 센서: 오른쪽 바닥 센서의 ' +
                            '값 (값의 범위: 0 ~ 100, 초기값: 0)<br/>x축 가속도: 가속도 센서의 X축 값 (값의 범위: ' +
                            '-32768 ~ 32767, 초기값: 0) 로봇이 전진하는 방향이 X축의 양수 방향입니다.<br/>y축 ' +
                            '가속도: 가속도 센서의 Y축 값 (값의 범위: -32768 ~ 32767, 초기값: 0) 로봇의 왼쪽 방향이 ' +
                            'Y축의 양수 방향입니다.<br/>z축 가속도: 가속도 센서의 Z축 값 (값의 범위: -32768 ~ ' +
                            '32767, 초기값: 0) 로봇의 위쪽 방향이 Z축의 양수 방향입니다.<br/>밝기: 밝기 센서의 값 (값의 ' +
                            '범위: 0 ~ 65535, 초기값: 0) 밝을 수록 값이 커집니다.<br/>온도: 로봇 내부의 온도 값 ' +
                            '(값의 범위: 섭씨 -40 ~ 88도, 초기값: 0)<br/>신호 세기: 블루투스 무선 통신의 신호 세기 ' +
                            '(값의 범위: -128 ~ 0 dBm, 초기값: 0) 신호의 세기가 셀수록 값이 커집니다.<br/>입력 A: ' +
                            '외부 확장 포트 A로 입력되는 신호의 값 (값의 범위: 아날로그 입력 0 ~ 255, 디지털 입력 0 또는 ' +
                            '1, 초기값: 0)<br/>입력 B: 외부 확장 포트 B로 입력되는 신호의 값 (값의 범위: 아날로그 입력 ' +
                            '0 ~ 255, 디지털 입력 0 또는 1, 초기값: 0)',
                        hamsterslite_move_forward_once: '말판 위에서 한 칸 앞으로 이동합니다.',
                        hamsterslite_turn_once:
                            '말판 위에서 왼쪽/오른쪽 방향으로 제자리에서 90도 회전합니다.',
                        hamsterslite_move_forward_unit:
                            '입력한 거리(cm)/시간(초)/펄스만큼 앞으로 이동합니다.',
                        hamsterslite_move_backward_unit:
                            '입력한 거리(cm)/시간(초)/펄스만큼 뒤로 이동합니다.',
                        hamsterslite_turn_unit_in_place:
                            '입력한 각도(도)/시간(초)/펄스만큼 왼쪽/오른쪽 방향으로 제자리에서 회전합니다.',
                        hamsterslite_pivot_around_unit_in_direction:
                            '왼쪽/오른쪽 펜/바퀴 중심으로 입력한 각도(도)/시간(초)/펄스만큼 앞쪽/뒤쪽 방향으로 회전합니다.',
                        hamsterslite_turn_unit_with_radius_in_direction:
                            '왼쪽/오른쪽 펜이 입력한 반지름의 원을 왼쪽/오른쪽에 그리면서 입력한 각도(도)/시간(초)/펄스만큼 ' +
                            '앞쪽/뒤쪽 방향으로 회전합니다.',
                        hamsterslite_change_both_wheels_by:
                            '왼쪽과 오른쪽 바퀴의 현재 속도 값(%)에 입력한 값을 각각 더합니다. 더한 결과가 양수 값이면 바퀴가 ' +
                            '앞으로 회전하고, 음수 값이면 뒤로 회전합니다.',
                        hamsterslite_set_both_wheels_to:
                            '왼쪽과 오른쪽 바퀴의 속도를 입력한 값(-100 ~ 100%)으로 각각 설정합니다. 양수 값을 입력하면 ' +
                            '바퀴가 앞으로 회전하고, 음수 값을 입력하면 뒤로 회전합니다. 숫자 0을 입력하면 정지합니다.',
                        hamsterslite_change_wheel_by:
                            '왼쪽/오른쪽/양쪽 바퀴의 현재 속도 값(%)에 입력한 값을 더합니다. 더한 결과가 양수 값이면 바퀴가 앞으로 ' +
                            '회전하고, 음수 값이면 뒤로 회전합니다.',
                        hamsterslite_set_wheel_to:
                            '왼쪽/오른쪽/양쪽 바퀴의 속도를 입력한 값(-100 ~ 100%)으로 설정합니다. 양수 값을 입력하면 바퀴가 ' +
                            '앞으로 회전하고, 음수 값을 입력하면 뒤로 회전합니다. 숫자 0을 입력하면 정지합니다.',
                        hamsterslite_follow_line_using:
                            '왼쪽/오른쪽/양쪽 바닥 센서를 사용하여 검은색/하얀색 선을 따라 이동합니다.',
                        hamsterslite_follow_line_until:
                            '왼쪽/오른쪽/앞쪽/뒤쪽의 검은색/하얀색 선을 따라 이동하다가 교차로를 만나면 정지합니다.',
                        hamsterslite_set_following_speed_to:
                            '선을 따라 이동하는 속도(1 ~ 8)를 설정합니다. 숫자가 클수록 이동하는 속도가 빠릅니다.',
                        hamsterslite_set_following_gain_to:
                            '선을 따라 이동하는 방향 변화량(1 ~ 8)을 설정합니다. 숫자가 클수록 급커브를 잘 따라가지만 직선에서 ' +
                            '좌우로 더 흔들립니다.',
                        hamsterslite_stop: '양쪽 바퀴를 정지합니다.',
                        hamsterslite_set_led_to: '왼쪽/오른쪽/양쪽 LED를 선택한 색깔로 켭니다.',
                        hamsterslite_pick_led: '왼쪽/오른쪽/양쪽 LED를 선택한 색깔로 켭니다.',
                        hamsterslite_change_led_by_rgb:
                            '왼쪽/오른쪽/양쪽 LED의 현재 R, G, B 값에 입력한 값을 각각 더합니다.',
                        hamsterslite_set_led_to_rgb:
                            '왼쪽/오른쪽/양쪽 LED의 R, G, B 값을 입력한 값으로 각각 설정합니다.',
                        hamsterslite_clear_led: '왼쪽/오른쪽/양쪽 LED를 끕니다.',
                        hamsterslite_play_sound_times: '선택한 소리를 입력한 횟수만큼 재생합니다.',
                        hamsterslite_play_sound_times_until_done:
                            '선택한 소리를 입력한 횟수만큼 재생하고, 재생이 완료될 때까지 기다립니다.',
                        hamsterslite_change_buzzer_by:
                            '버저 소리의 현재 음 높이(Hz)에 입력한 값을 더합니다. 소수점 둘째 자리까지 입력할 수 있습니다.',
                        hamsterslite_set_buzzer_to:
                            '버저 소리의 음 높이를 입력한 값(Hz)으로 설정합니다. 소수점 둘째 자리까지 입력할 수 있습니다. 숫자 ' +
                            '0을 입력하면 버저 소리를 끕니다.',
                        hamsterslite_clear_sound: '소리를 끕니다.',
                        hamsterslite_play_note: '선택한 계이름과 옥타브의 음을 소리 냅니다.',
                        hamsterslite_play_note_for:
                            '선택한 계이름과 옥타브의 음을 입력한 박자만큼 소리 냅니다.',
                        hamsterslite_rest_for: '입력한 박자만큼 쉽니다.',
                        hamsterslite_change_tempo_by:
                            '연주하거나 쉬는 속도의 현재 BPM(분당 박자 수)에 입력한 값을 더합니다.',
                        hamsterslite_set_tempo_to:
                            '연주하거나 쉬는 속도를 입력한 BPM(분당 박자 수)으로 설정합니다.',
                        hamsterslite_set_port_to:
                            '선택한 외부 확장 포트의 입출력 모드를 선택한 모드로 설정합니다.',
                        hamsterslite_change_output_by:
                            '선택한 외부 확장 포트의 현재 출력 값에 입력한 값을 더합니다. 더한 결과는 외부 확장 포트의 모드에 따라 ' +
                            '다음의 범위를 가집니다.<br/>서보 출력: 유효한 값의 범위는 1 ~ 180도, 0이면 PWM 펄스 없이 ' +
                            '항상 0을 출력<br/>PWM 출력: 0 ~ 100%, PWM 파형에서 ON 상태의 ' +
                            '듀티비(%)<br/>디지털 출력: 0이면 LOW, 0이 아니면 HIGH',
                        hamsterslite_set_output_to:
                            '선택한 외부 확장 포트의 출력 값을 입력한 값으로 설정합니다. 입력하는 값은 외부 확장 포트의 모드에 따라 ' +
                            '다음의 범위를 가집니다.<br/>서보 출력: 유효한 값의 범위는 1 ~ 180도, 0이면 PWM 펄스 없이 ' +
                            '항상 0을 출력<br/>PWM 출력: 0 ~ 100%, PWM 파형에서 ON 상태의 ' +
                            '듀티비(%)<br/>디지털 출력: 0이면 LOW, 0이 아니면 HIGH',
                        hamsterslite_gripper: '집게를 열거나 닫습니다.',
                        hamsterslite_release_gripper:
                            '집게의 전원을 끄고 자유롭게 움직일 수 있도록 합니다.',
                        hamsterslite_write_serial: '시리얼 통신으로 글자를 전송합니다.',
                        hamsterslite_read_serial_until: '시리얼 통신으로 받은 글자를 읽습니다.',
                        hamsterslite_set_serial_rate_to: '시리얼 통신의 속도를 설정합니다.',
                    },
                },
                en: {
                    template: {
                        hamsterslite_hand_found: 'hand found?',
                        hamsterslite_boolean: '%1?',
                        hamsterslite_value: '%1',
                        hamsterslite_move_forward_once: 'move forward once on board %1',
                        hamsterslite_turn_once: 'turn %1 once on board %2',
                        hamsterslite_move_forward_unit: 'move forward %1 %2 %3',
                        hamsterslite_move_backward_unit: 'move backward %1 %2 %3',
                        hamsterslite_turn_unit_in_place: 'turn %1 %2 %3 in place %4',
                        hamsterslite_pivot_around_unit_in_direction:
                            'pivot around %1 %2 %3 in %4 direction %5',
                        hamsterslite_turn_unit_with_radius_in_direction:
                            '%1 turn %2 %3 %4 with radius %5 cm in %6 direction %7',
                        hamsterslite_change_both_wheels_by:
                            'change wheels by left: %1 right: %2 %3',
                        hamsterslite_set_both_wheels_to: 'set wheels to left: %1 right: %2 %3',
                        hamsterslite_change_wheel_by: 'change %1 wheel by %2 %3',
                        hamsterslite_set_wheel_to: 'set %1 wheel to %2 %3',
                        hamsterslite_follow_line_using: 'follow %1 line using %2 floor sensor %3',
                        hamsterslite_follow_line_until: 'follow %1 line until %2 intersection %3',
                        hamsterslite_set_following_speed_to: 'set following speed to %1 %2',
                        hamsterslite_set_following_gain_to:
                            'set following directional variation to %1 %2',
                        hamsterslite_stop: 'stop %1',
                        hamsterslite_set_led_to: 'set %1 led to %2 %3',
                        hamsterslite_pick_led: 'set %1 led to %2 %3',
                        hamsterslite_change_led_by_rgb: 'change %1 led by r: %2 g: %3 b: %4 %5',
                        hamsterslite_set_led_to_rgb: 'set %1 led to r: %2 g: %3 b: %4 %5',
                        hamsterslite_clear_led: 'clear %1 led %2',
                        hamsterslite_play_sound_times: 'play sound %1 %2 times %3',
                        hamsterslite_play_sound_times_until_done:
                            'play sound %1 %2 times until done %3',
                        hamsterslite_change_buzzer_by: 'change buzzer by %1 %2',
                        hamsterslite_set_buzzer_to: 'set buzzer to %1 %2',
                        hamsterslite_clear_sound: 'clear sound %1',
                        hamsterslite_play_note: 'play note %1 %2 %3',
                        hamsterslite_play_note_for: 'play note %1 %2 for %3 beats %4',
                        hamsterslite_rest_for: 'rest for %1 beats %2',
                        hamsterslite_change_tempo_by: 'change tempo by %1 %2',
                        hamsterslite_set_tempo_to: 'set tempo to %1 bpm %2',
                        hamsterslite_set_port_to: 'set port %1 to %2 %3',
                        hamsterslite_change_output_by: 'change output %1 by %2 %3',
                        hamsterslite_set_output_to: 'set output %1 to %2 %3',
                        hamsterslite_gripper: '%1 gripper %2',
                        hamsterslite_release_gripper: 'release gripper %1',
                        hamsterslite_write_serial: 'write %1 %2 to serial %3',
                        hamsterslite_read_serial_until: 'read serial %1 %2',
                        hamsterslite_set_serial_rate_to: 'set serial rate to %1 Bd %2',
                    },
                    Blocks: {
                        hamsterslite_tilt_forward: 'tilt forward',
                        hamsterslite_tilt_backward: 'tilt backward',
                        hamsterslite_tilt_left: 'tilt left',
                        hamsterslite_tilt_right: 'tilt right',
                        hamsterslite_tilt_flip: 'tilt flip',
                        hamsterslite_tilt_not: 'not tilt',
                        hamsterslite_tap: 'tap',
                        hamsterslite_free_fall: 'free fall',
                        hamsterslite_battery_normal: 'battery normal',
                        hamsterslite_battery_low: 'battery low',
                        hamsterslite_battery_empty: 'battery empty',
                        hamsterslite_sensor_left_proximity: 'left proximity',
                        hamsterslite_sensor_right_proximity: 'right proximity',
                        hamsterslite_sensor_left_floor: 'left floor',
                        hamsterslite_sensor_right_floor: 'right floor',
                        hamsterslite_sensor_acceleration_x: 'x acceleration',
                        hamsterslite_sensor_acceleration_y: 'y acceleration',
                        hamsterslite_sensor_acceleration_z: 'z acceleration',
                        hamsterslite_sensor_light: 'light',
                        hamsterslite_sensor_temperature: 'temperature',
                        hamsterslite_sensor_signal_strength: 'signal strength',
                        hamsterslite_sensor_input_a: 'input A',
                        hamsterslite_sensor_input_b: 'input B',
                        hamsterslite_serial_input: 'serial input',
                        hamsterslite_left: 'left',
                        hamsterslite_right: 'right',
                        hamsterslite_unit_cm: 'cm',
                        hamsterslite_unit_sec: 'seconds',
                        hamsterslite_unit_pulse: 'pulses',
                        hamsterslite_unit_deg: 'degrees',
                        hamsterslite_left_pen: 'left pen',
                        hamsterslite_right_pen: 'right pen',
                        hamsterslite_left_wheel: 'left wheel',
                        hamsterslite_right_wheel: 'right wheel',
                        hamsterslite_forward: 'forward',
                        hamsterslite_backward: 'backward',
                        hamsterslite_robot: 'robot',
                        hamsterslite_both: 'both',
                        hamsterslite_color_black: 'black',
                        hamsterslite_color_white: 'white',
                        hamsterslite_front: 'front',
                        hamsterslite_rear: 'rear',
                        hamsterslite_gain_default: 'default',
                        hamsterslite_color_red: 'red',
                        hamsterslite_color_orange: 'orange',
                        hamsterslite_color_yellow: 'yellow',
                        hamsterslite_color_green: 'green',
                        hamsterslite_color_sky_blue: 'sky blue',
                        hamsterslite_color_blue: 'blue',
                        hamsterslite_color_violet: 'violet',
                        hamsterslite_color_purple: 'purple',
                        hamsterslite_sound_beep: 'beep',
                        hamsterslite_sound_random_beep: 'random beep',
                        hamsterslite_sound_noise: 'noise',
                        hamsterslite_sound_siren: 'siren',
                        hamsterslite_sound_engine: 'engine',
                        hamsterslite_sound_chop: 'chop',
                        hamsterslite_sound_robot: 'robot',
                        hamsterslite_sound_dibidibidip: 'dibidibidip',
                        hamsterslite_sound_good_job: 'good job',
                        hamsterslite_sound_happy: 'happy',
                        hamsterslite_sound_angry: 'angry',
                        hamsterslite_sound_sad: 'sad',
                        hamsterslite_sound_sleep: 'sleep',
                        hamsterslite_sound_march: 'march',
                        hamsterslite_sound_birthday: 'birthday',
                        hamsterslite_note_c: 'C',
                        hamsterslite_note_c_sharp: 'C♯(D♭)',
                        hamsterslite_note_d: 'D',
                        hamsterslite_note_d_sharp: 'D♯(E♭)',
                        hamsterslite_note_e: 'E',
                        hamsterslite_note_f: 'F',
                        hamsterslite_note_f_sharp: 'F♯(G♭)',
                        hamsterslite_note_g: 'G',
                        hamsterslite_note_g_sharp: 'G♯(A♭)',
                        hamsterslite_note_a: 'A',
                        hamsterslite_note_a_sharp: 'A♯(B♭)',
                        hamsterslite_note_b: 'B',
                        hamsterslite_port_a: 'A',
                        hamsterslite_port_b: 'B',
                        hamsterslite_port_ab: 'A and B',
                        hamsterslite_analog_input: 'analog input',
                        hamsterslite_digital_input: 'digital input',
                        hamsterslite_digital_input_pull_up: 'digital input (pull up)',
                        hamsterslite_digital_input_pull_down: 'digital input (pull down)',
                        hamsterslite_voltage_input: 'voltage input',
                        hamsterslite_servo_output: 'servo output',
                        hamsterslite_pwm_output: 'pwm output',
                        hamsterslite_digital_output: 'digital output',
                        hamsterslite_open_gripper: 'open',
                        hamsterslite_close_gripper: 'close',
                        hamsterslite_serial_string: 'string',
                        hamsterslite_serial_string_line: 'string line',
                        hamsterslite_serial_all: 'all',
                        hamsterslite_serial_until_comma: 'until ,(comma)',
                        hamsterslite_serial_until_colon: 'until :(colon)',
                        hamsterslite_serial_until_dollar: 'until $',
                        hamsterslite_serial_until_sharp: 'until #',
                        hamsterslite_serial_until_new_line: 'until new line',
                    },
                    Helper: {
                        hamsterslite_hand_found:
                            'If there is a hand or object in front of the proximity ' +
                            'sensor, true, otherwise false',
                        hamsterslite_boolean:
                            'tilt forward: If tilted forward, true, otherwise ' +
                            'false<br/>tilt backward: If tilted backward, true, otherwise ' +
                            'false<br/>tilt left: If tilted to the left, true, otherwise ' +
                            'false<br/>tilt right: If tilted to the right, true, ' +
                            'otherwise false<br/>tilt flip: If upside-down, true, ' +
                            'otherwise false<br/>not tilt: If not tilted, true, otherwise ' +
                            'false<br/>battery normal: If the battery is enough, true, ' +
                            'otherwise false<br/>battery low: If the battery is low, ' +
                            'true, otherwise false<br/>battery empty: If the battery is ' +
                            'empty, true, otherwise false',
                        hamsterslite_value:
                            'left proximity: value of left proximity sensor (range: 0 to ' +
                            '255, initial value: 0)<br/>right proximity: value of right ' +
                            'proximity sensor (range: 0 to 255, initial value: ' +
                            '0)<br/>left floor: value of left floor sensor (range: 0 to ' +
                            '100, initial value: 0)<br/>right floor: value of right floor ' +
                            'sensor (range: 0 to 100, initial value: 0)<br/>x ' +
                            'acceleration: x-axis value of acceleration sensor (range: ' +
                            '-32768 to 32767, initial value: 0) The direction in which ' +
                            'the robot moves forward is the positive direction of the x ' +
                            'axis.<br/>y acceleration: y-axis value of acceleration ' +
                            'sensor (range: -32768 to 32767, initial value: 0) The left ' +
                            'direction of the robot is the positive direction of the y ' +
                            'axis.<br/>z acceleration: z-axis value of acceleration ' +
                            'sensor (range: -32768 to 32767, initial value: 0) The upward ' +
                            'direction of the robot is the positive direction of the z ' +
                            'axis.<br/>light: value of light sensor (range: 0 to 65535, ' +
                            'initial value: 0) The brighter, the larger the ' +
                            'value.<br/>temperature: temperature value inside the robot ' +
                            '(range: -40 to 88 degrees Celsius, initial value: ' +
                            '0)<br/>signal strength: signal strength of Bluetooth ' +
                            'communication (range: -128 to 0 dBm, initial value: 0) As ' +
                            'the signal strength increases, the value ' +
                            'increases.<br/>input A: value of signal input to external ' +
                            'port A (range: analog input 0 to 255, digital input 0 or 1, ' +
                            'initial value: 0)<br/>input B: value of signal input to ' +
                            'external port B (range: analog input 0 to 255, digital input ' +
                            '0 or 1, initial value: 0)',
                        hamsterslite_move_forward_once: 'Moves one space forward on the board.',
                        hamsterslite_turn_once: 'Turns left/right 90 degrees on the board.',
                        hamsterslite_move_forward_unit:
                            'Moves forward for the number of cm/seconds/pulses entered.',
                        hamsterslite_move_backward_unit:
                            'Moves backward for the number of cm/seconds/pulses entered.',
                        hamsterslite_turn_unit_in_place:
                            'Turns left/right in place for the number of ' +
                            'degrees/seconds/pulses entered.',
                        hamsterslite_pivot_around_unit_in_direction:
                            'Pivots around the left/right pen/wheel in the ' +
                            'forward/backward direction for the number of ' +
                            'degrees/seconds/pulses entered.',
                        hamsterslite_turn_unit_with_radius_in_direction:
                            'Turns left/right so that the left/right pen draws the circle ' +
                            'of the entered radius in the forward/backward direction for ' +
                            'the number of degrees/seconds/pulses entered.',
                        hamsterslite_change_both_wheels_by:
                            'Adds the entered values to the current speed values (%) of ' +
                            'the left and right wheels respectively. If the result is ' +
                            'positive, the wheel rotates forward; if negative, the wheel ' +
                            'rotates backward.',
                        hamsterslite_set_both_wheels_to:
                            'Sets the speed of the left and right wheels to the entered ' +
                            'values (-100 to 100%), respectively. If you enter a positive ' +
                            'value, the wheel rotates forward. If you enter a negative ' +
                            'value, the wheel rotates backward. Entering the number 0 ' +
                            'stops it.',
                        hamsterslite_change_wheel_by:
                            'Adds the entered value to the current speed value (%) of the ' +
                            'left/right/both wheels. If the result is positive, the wheel ' +
                            'rotates forward; if negative, the wheel rotates backward.',
                        hamsterslite_set_wheel_to:
                            'Sets the speed of the left/right/both wheels to the entered ' +
                            'value (-100 to 100%). If you enter a positive value, the ' +
                            'wheel rotates forward. If you enter a negative value, the ' +
                            'wheel rotates backward. Entering the number 0 stops it.',
                        hamsterslite_follow_line_using:
                            'Moves along the black/white line by using the ' +
                            'left/right/both floor sensors.',
                        hamsterslite_follow_line_until:
                            'Moves along the black/white line on the ' +
                            'left/right/front/back, then stops when the robot meets the ' +
                            'intersection.',
                        hamsterslite_set_following_speed_to:
                            'Sets the speed (1 to 8) to move along the line. The larger ' +
                            'the number, the faster the movement.',
                        hamsterslite_set_following_gain_to:
                            'Sets the directional variation (1 to 8) 선을 따라 이동하는 방향 변화량(1 ' +
                            '~ 8)을 설정합니다. 숫자가 클수록 급커브를 잘 따라가지만 직선에서 좌우로 더 흔들립니다.',
                        hamsterslite_stop: 'Stops both wheels.',
                        hamsterslite_set_led_to:
                            'Turns left/right/both LEDs to the selected color.',
                        hamsterslite_pick_led: 'Turns left/right/both LEDs to the selected color.',
                        hamsterslite_change_led_by_rgb:
                            'Adds the entered values to the current R, G, B values of ' +
                            'left/right/both LEDs, respectively.',
                        hamsterslite_set_led_to_rgb:
                            'Sets the R, G, B values of left/right/both LEDs to the ' +
                            'entered values.',
                        hamsterslite_clear_led: 'Turns off the left/right/both LEDs.',
                        hamsterslite_play_sound_times:
                            'Plays the selected sound as many times as entered.',
                        hamsterslite_play_sound_times_until_done:
                            'Plays the selected sound as many times as entered, and waits ' +
                            'for completion.',
                        hamsterslite_change_buzzer_by:
                            'Adds the entered value to the current pitch (Hz) of the ' +
                            'buzzer sound. You can enter up to two decimal places.',
                        hamsterslite_set_buzzer_to:
                            'Sets the pitch of the buzzer sound to the entered value ' +
                            '(Hz). You can enter up to two decimal places. Entering the ' +
                            'number 0 turns off the buzzer sound.',
                        hamsterslite_clear_sound: 'Turns off sound.',
                        hamsterslite_play_note: 'It sounds the selected tone and octave.',
                        hamsterslite_play_note_for:
                            'It sounds the selected tone and octave as much as the beat ' +
                            'you entered.',
                        hamsterslite_rest_for: 'Rests as much as the beat you entered.',
                        hamsterslite_change_tempo_by:
                            'Adds the entered value to the current BPM (beats per minute) ' +
                            'of the playing or resting speed.',
                        hamsterslite_set_tempo_to:
                            'Sets the playing or resting speed to the entered BPM (beats ' +
                            'per minute).',
                        hamsterslite_set_port_to:
                            'Sets the io mode of the selected external port to the selected mode.',
                        hamsterslite_change_output_by:
                            'Adds the entered value to the current output value of the ' +
                            'selected external port. The result will be in the following ' +
                            'range depending on the mode of the external port.<br/>Servo ' +
                            'output: valid range from 1 to 180 degrees; if 0, output 0 ' +
                            'without PWM pulse<br/>PWM output: 0 to 100%, duty ratio (%) ' +
                            'of ON state in PWM waveform<br/>Digital output: LOW when 0, ' +
                            'otherwise HIGH',
                        hamsterslite_set_output_to:
                            'Sets the output value of the selected external port to the ' +
                            'entered value. The value has the following range according ' +
                            'to the mode of external port.<br/>Servo output: valid range ' +
                            'from 1 to 180 degrees; if 0, output 0 without PWM ' +
                            'pulse<br/>PWM output: 0 to 100%, duty ratio (%) of ON state ' +
                            'in PWM waveform<br/>Digital output: LOW when 0, otherwise HIGH',
                        hamsterslite_gripper: 'Opens or closes the gripper.',
                        hamsterslite_release_gripper:
                            'Turns off the gripper so that it can be moved freely.',
                        hamsterslite_write_serial: 'Sends strings via serial communication.',
                        hamsterslite_read_serial_until:
                            'Read the strings received by serial communication.',
                        hamsterslite_set_serial_rate_to: 'Sets the speed of serial communication.',
                    },
                },
                jp: {
                    template: {
                        hamsterslite_hand_found: '手を見つけたか?',
                        hamsterslite_boolean: '%1?',
                        hamsterslite_value: '%1',
                        hamsterslite_move_forward_once: 'ボード板上で前へ動かす %1',
                        hamsterslite_turn_once: 'ボード板上で%1に回す %2',
                        hamsterslite_move_forward_unit: '前へ%1%2動かす %3',
                        hamsterslite_move_backward_unit: '後ろへ%1%2動かす %3',
                        hamsterslite_turn_unit_in_place: '所定位置で%1に%2%3回す %4',
                        hamsterslite_pivot_around_unit_in_direction:
                            '%1を中心に%2%3%4方向に回す %5',
                        hamsterslite_turn_unit_with_radius_in_direction:
                            '%1%2に%3%4半径%5cmを%6方向に回す %7',
                        hamsterslite_change_both_wheels_by: '左車輪を%1右車輪を%2ずつ変える %3',
                        hamsterslite_set_both_wheels_to: '左車輪を%1右車輪を%2にする %3',
                        hamsterslite_change_wheel_by: '%1車輪を%2ずつ変える %3',
                        hamsterslite_set_wheel_to: '%1車輪を%2にする %3',
                        hamsterslite_follow_line_using: '%1線を%2フロアセンサーで追従する %3',
                        hamsterslite_follow_line_until: '%1線を追従して%2交差点まで動かす %3',
                        hamsterslite_set_following_speed_to: '線を追従する速度を%1にする %2',
                        hamsterslite_set_following_gain_to: '線を追従する方向変化量を%1にする %2',
                        hamsterslite_stop: '停止する %1',
                        hamsterslite_set_led_to: '%1LEDを%2にする %3',
                        hamsterslite_pick_led: '%1LEDを%2にする %3',
                        hamsterslite_change_led_by_rgb: '%1LEDをR:%2G:%3B:%4ずつ変える %5',
                        hamsterslite_set_led_to_rgb: '%1LEDをR:%2G:%3B:%4にする %5',
                        hamsterslite_clear_led: '%1LEDをオフ %2',
                        hamsterslite_play_sound_times: '%1音を%2回鳴らす %3',
                        hamsterslite_play_sound_times_until_done: '終わるまで%1音を%2回鳴らす %3',
                        hamsterslite_change_buzzer_by: 'ブザー音を%1ずつ変える %2',
                        hamsterslite_set_buzzer_to: 'ブザー音を%1にする %2',
                        hamsterslite_clear_sound: '音を止める %1',
                        hamsterslite_play_note: '%1%2音を鳴らす %3',
                        hamsterslite_play_note_for: '%1%2音を%3拍鳴らす %4',
                        hamsterslite_rest_for: '%1拍休む %2',
                        hamsterslite_change_tempo_by: 'テンポを%1ずつ変える %2',
                        hamsterslite_set_tempo_to: 'テンポを%1BPMにする %2',
                        hamsterslite_set_port_to: 'ポート%1を%2にする %3',
                        hamsterslite_change_output_by: '出力%1を%2ずつ変える %3',
                        hamsterslite_set_output_to: '出力%1を%2にする %3',
                        hamsterslite_gripper: 'グリッパを%1 %2',
                        hamsterslite_release_gripper: 'グリッパをオフ %1',
                        hamsterslite_write_serial: 'シリアルに%1%2を書き出す %3',
                        hamsterslite_read_serial_until: 'シリアルを%1読み取る %2',
                        hamsterslite_set_serial_rate_to: 'シリアル速度を%1Bdにする %2',
                    },
                    Blocks: {
                        hamsterslite_tilt_forward: '前に傾けたか',
                        hamsterslite_tilt_backward: '後に傾けたか',
                        hamsterslite_tilt_left: '左に傾けたか',
                        hamsterslite_tilt_right: '右に傾けたか',
                        hamsterslite_tilt_flip: '上下裏返したか',
                        hamsterslite_tilt_not: '傾けなかったか',
                        hamsterslite_tap: '叩いたか',
                        hamsterslite_free_fall: '自由落下したか',
                        hamsterslite_battery_normal: '電池が正常か',
                        hamsterslite_battery_low: '電池が足りないか',
                        hamsterslite_battery_empty: '電池がないか',
                        hamsterslite_sensor_left_proximity: '左近接センサー',
                        hamsterslite_sensor_right_proximity: '右近接センサー',
                        hamsterslite_sensor_left_floor: '左床センサー',
                        hamsterslite_sensor_right_floor: '右床センサー',
                        hamsterslite_sensor_acceleration_x: '前後の速さ',
                        hamsterslite_sensor_acceleration_y: '左右の速さ',
                        hamsterslite_sensor_acceleration_z: '上下の速さ',
                        hamsterslite_sensor_light: '照度',
                        hamsterslite_sensor_temperature: '温度',
                        hamsterslite_sensor_signal_strength: '信号強度',
                        hamsterslite_sensor_input_a: '入力A',
                        hamsterslite_sensor_input_b: '入力B',
                        hamsterslite_serial_input: 'シリアル入力',
                        hamsterslite_left: '左',
                        hamsterslite_right: '右',
                        hamsterslite_unit_cm: 'cm',
                        hamsterslite_unit_sec: '秒',
                        hamsterslite_unit_pulse: 'パルス',
                        hamsterslite_unit_deg: '°',
                        hamsterslite_left_pen: '左ペン',
                        hamsterslite_right_pen: '右ペン',
                        hamsterslite_left_wheel: '左車輪',
                        hamsterslite_right_wheel: '右車輪',
                        hamsterslite_forward: '前',
                        hamsterslite_backward: '後',
                        hamsterslite_robot: 'ロボット',
                        hamsterslite_both: '両方',
                        hamsterslite_color_black: '黒',
                        hamsterslite_color_white: '白',
                        hamsterslite_front: '前',
                        hamsterslite_rear: '後',
                        hamsterslite_gain_default: '基本値',
                        hamsterslite_color_red: '赤',
                        hamsterslite_color_orange: 'オレンジ',
                        hamsterslite_color_yellow: '黄色',
                        hamsterslite_color_green: '緑',
                        hamsterslite_color_sky_blue: '水色',
                        hamsterslite_color_blue: '青',
                        hamsterslite_color_violet: '赤紫',
                        hamsterslite_color_purple: '紫',
                        hamsterslite_sound_beep: 'ビープ音',
                        hamsterslite_sound_random_beep: 'ビープ音のどれか',
                        hamsterslite_sound_noise: 'ノイズ',
                        hamsterslite_sound_siren: 'サイレン',
                        hamsterslite_sound_engine: 'エンジン',
                        hamsterslite_sound_chop: 'チョップ',
                        hamsterslite_sound_robot: 'ロボット',
                        hamsterslite_sound_dibidibidip: 'ディビディビディップ',
                        hamsterslite_sound_good_job: 'よくできました',
                        hamsterslite_sound_happy: '幸福',
                        hamsterslite_sound_angry: '怒った',
                        hamsterslite_sound_sad: '悲しみ',
                        hamsterslite_sound_sleep: '睡眠',
                        hamsterslite_sound_march: '行進',
                        hamsterslite_sound_birthday: '誕生日',
                        hamsterslite_note_c: 'ド',
                        hamsterslite_note_c_sharp: 'ド♯(レ♭)',
                        hamsterslite_note_d: 'レ',
                        hamsterslite_note_d_sharp: 'レ♯(ミ♭)',
                        hamsterslite_note_e: 'ミ',
                        hamsterslite_note_f: 'ファ',
                        hamsterslite_note_f_sharp: 'ファ♯(ソ♭)',
                        hamsterslite_note_g: 'ソ',
                        hamsterslite_note_g_sharp: 'ソ♯(ラ♭)',
                        hamsterslite_note_a: 'ラ',
                        hamsterslite_note_a_sharp: 'ラ♯(シ♭)',
                        hamsterslite_note_b: 'シ',
                        hamsterslite_port_a: 'A',
                        hamsterslite_port_b: 'B',
                        hamsterslite_port_ab: 'AとB',
                        hamsterslite_analog_input: 'アナログ入力',
                        hamsterslite_digital_input: 'デジタル入力',
                        hamsterslite_digital_input_pull_up: 'デジタル入力 (プルアップ)',
                        hamsterslite_digital_input_pull_down: 'デジタル入力 (プルダウン)',
                        hamsterslite_voltage_input: '電圧入力',
                        hamsterslite_servo_output: 'サーボ出力',
                        hamsterslite_pwm_output: 'PWM出力',
                        hamsterslite_digital_output: 'デジタル出力',
                        hamsterslite_open_gripper: '開く',
                        hamsterslite_close_gripper: '閉める',
                        hamsterslite_serial_string: '文字列',
                        hamsterslite_serial_string_line: '文字列1行',
                        hamsterslite_serial_all: '全部',
                        hamsterslite_serial_until_comma: '、(読点)まで',
                        hamsterslite_serial_until_colon: '：(コロン)まで',
                        hamsterslite_serial_until_dollar: '$まで',
                        hamsterslite_serial_until_sharp: '#まで',
                        hamsterslite_serial_until_new_line: '改行まで',
                    },
                    Helper: {
                        hamsterslite_hand_found:
                            'If there is a hand or object in front of the proximity ' +
                            'sensor, true, otherwise false',
                        hamsterslite_boolean:
                            'tilt forward: If tilted forward, true, otherwise ' +
                            'false<br/>tilt backward: If tilted backward, true, otherwise ' +
                            'false<br/>tilt left: If tilted to the left, true, otherwise ' +
                            'false<br/>tilt right: If tilted to the right, true, ' +
                            'otherwise false<br/>tilt flip: If upside-down, true, ' +
                            'otherwise false<br/>not tilt: If not tilted, true, otherwise ' +
                            'false<br/>battery normal: If the battery is enough, true, ' +
                            'otherwise false<br/>battery low: If the battery is low, ' +
                            'true, otherwise false<br/>battery empty: If the battery is ' +
                            'empty, true, otherwise false',
                        hamsterslite_value:
                            'left proximity: value of left proximity sensor (range: 0 to ' +
                            '255, initial value: 0)<br/>right proximity: value of right ' +
                            'proximity sensor (range: 0 to 255, initial value: ' +
                            '0)<br/>left floor: value of left floor sensor (range: 0 to ' +
                            '100, initial value: 0)<br/>right floor: value of right floor ' +
                            'sensor (range: 0 to 100, initial value: 0)<br/>x ' +
                            'acceleration: x-axis value of acceleration sensor (range: ' +
                            '-32768 to 32767, initial value: 0) The direction in which ' +
                            'the robot moves forward is the positive direction of the x ' +
                            'axis.<br/>y acceleration: y-axis value of acceleration ' +
                            'sensor (range: -32768 to 32767, initial value: 0) The left ' +
                            'direction of the robot is the positive direction of the y ' +
                            'axis.<br/>z acceleration: z-axis value of acceleration ' +
                            'sensor (range: -32768 to 32767, initial value: 0) The upward ' +
                            'direction of the robot is the positive direction of the z ' +
                            'axis.<br/>light: value of light sensor (range: 0 to 65535, ' +
                            'initial value: 0) The brighter, the larger the ' +
                            'value.<br/>temperature: temperature value inside the robot ' +
                            '(range: -40 to 88 degrees Celsius, initial value: ' +
                            '0)<br/>signal strength: signal strength of Bluetooth ' +
                            'communication (range: -128 to 0 dBm, initial value: 0) As ' +
                            'the signal strength increases, the value ' +
                            'increases.<br/>input A: value of signal input to external ' +
                            'port A (range: analog input 0 to 255, digital input 0 or 1, ' +
                            'initial value: 0)<br/>input B: value of signal input to ' +
                            'external port B (range: analog input 0 to 255, digital input ' +
                            '0 or 1, initial value: 0)',
                        hamsterslite_move_forward_once: 'Moves one space forward on the board.',
                        hamsterslite_turn_once: 'Turns left/right 90 degrees on the board.',
                        hamsterslite_move_forward_unit:
                            'Moves forward for the number of cm/seconds/pulses entered.',
                        hamsterslite_move_backward_unit:
                            'Moves backward for the number of cm/seconds/pulses entered.',
                        hamsterslite_turn_unit_in_place:
                            'Turns left/right in place for the number of ' +
                            'degrees/seconds/pulses entered.',
                        hamsterslite_pivot_around_unit_in_direction:
                            'Pivots around the left/right pen/wheel in the ' +
                            'forward/backward direction for the number of ' +
                            'degrees/seconds/pulses entered.',
                        hamsterslite_turn_unit_with_radius_in_direction:
                            'Turns left/right so that the left/right pen draws the circle ' +
                            'of the entered radius in the forward/backward direction for ' +
                            'the number of degrees/seconds/pulses entered.',
                        hamsterslite_change_both_wheels_by:
                            'Adds the entered values to the current speed values (%) of ' +
                            'the left and right wheels respectively. If the result is ' +
                            'positive, the wheel rotates forward; if negative, the wheel ' +
                            'rotates backward.',
                        hamsterslite_set_both_wheels_to:
                            'Sets the speed of the left and right wheels to the entered ' +
                            'values (-100 to 100%), respectively. If you enter a positive ' +
                            'value, the wheel rotates forward. If you enter a negative ' +
                            'value, the wheel rotates backward. Entering the number 0 ' +
                            'stops it.',
                        hamsterslite_change_wheel_by:
                            'Adds the entered value to the current speed value (%) of the ' +
                            'left/right/both wheels. If the result is positive, the wheel ' +
                            'rotates forward; if negative, the wheel rotates backward.',
                        hamsterslite_set_wheel_to:
                            'Sets the speed of the left/right/both wheels to the entered ' +
                            'value (-100 to 100%). If you enter a positive value, the ' +
                            'wheel rotates forward. If you enter a negative value, the ' +
                            'wheel rotates backward. Entering the number 0 stops it.',
                        hamsterslite_follow_line_using:
                            'Moves along the black/white line by using the ' +
                            'left/right/both floor sensors.',
                        hamsterslite_follow_line_until:
                            'Moves along the black/white line on the ' +
                            'left/right/front/back, then stops when the robot meets the ' +
                            'intersection.',
                        hamsterslite_set_following_speed_to:
                            'Sets the speed (1 to 8) to move along the line. The larger ' +
                            'the number, the faster the movement.',
                        hamsterslite_set_following_gain_to:
                            'Sets the directional variation (1 to 8) 선을 따라 이동하는 방향 변화량(1 ' +
                            '~ 8)을 설정합니다. 숫자가 클수록 급커브를 잘 따라가지만 직선에서 좌우로 더 흔들립니다.',
                        hamsterslite_stop: 'Stops both wheels.',
                        hamsterslite_set_led_to:
                            'Turns left/right/both LEDs to the selected color.',
                        hamsterslite_pick_led: 'Turns left/right/both LEDs to the selected color.',
                        hamsterslite_change_led_by_rgb:
                            'Adds the entered values to the current R, G, B values of ' +
                            'left/right/both LEDs, respectively.',
                        hamsterslite_set_led_to_rgb:
                            'Sets the R, G, B values of left/right/both LEDs to the ' +
                            'entered values.',
                        hamsterslite_clear_led: 'Turns off the left/right/both LEDs.',
                        hamsterslite_play_sound_times:
                            'Plays the selected sound as many times as entered.',
                        hamsterslite_play_sound_times_until_done:
                            'Plays the selected sound as many times as entered, and waits ' +
                            'for completion.',
                        hamsterslite_change_buzzer_by:
                            'Adds the entered value to the current pitch (Hz) of the ' +
                            'buzzer sound. You can enter up to two decimal places.',
                        hamsterslite_set_buzzer_to:
                            'Sets the pitch of the buzzer sound to the entered value ' +
                            '(Hz). You can enter up to two decimal places. Entering the ' +
                            'number 0 turns off the buzzer sound.',
                        hamsterslite_clear_sound: 'Turns off sound.',
                        hamsterslite_play_note: 'It sounds the selected tone and octave.',
                        hamsterslite_play_note_for:
                            'It sounds the selected tone and octave as much as the beat ' +
                            'you entered.',
                        hamsterslite_rest_for: 'Rests as much as the beat you entered.',
                        hamsterslite_change_tempo_by:
                            'Adds the entered value to the current BPM (beats per minute) ' +
                            'of the playing or resting speed.',
                        hamsterslite_set_tempo_to:
                            'Sets the playing or resting speed to the entered BPM (beats ' +
                            'per minute).',
                        hamsterslite_set_port_to:
                            'Sets the io mode of the selected external port to the selected mode.',
                        hamsterslite_change_output_by:
                            'Adds the entered value to the current output value of the ' +
                            'selected external port. The result will be in the following ' +
                            'range depending on the mode of the external port.<br/>Servo ' +
                            'output: valid range from 1 to 180 degrees; if 0, output 0 ' +
                            'without PWM pulse<br/>PWM output: 0 to 100%, duty ratio (%) ' +
                            'of ON state in PWM waveform<br/>Digital output: LOW when 0, ' +
                            'otherwise HIGH',
                        hamsterslite_set_output_to:
                            'Sets the output value of the selected external port to the ' +
                            'entered value. The value has the following range according ' +
                            'to the mode of external port.<br/>Servo output: valid range ' +
                            'from 1 to 180 degrees; if 0, output 0 without PWM ' +
                            'pulse<br/>PWM output: 0 to 100%, duty ratio (%) of ON state ' +
                            'in PWM waveform<br/>Digital output: LOW when 0, otherwise HIGH',
                        hamsterslite_gripper: 'Opens or closes the gripper.',
                        hamsterslite_release_gripper:
                            'Turns off the gripper so that it can be moved freely.',
                        hamsterslite_write_serial: 'Sends strings via serial communication.',
                        hamsterslite_read_serial_until:
                            'Read the strings received by serial communication.',
                        hamsterslite_set_serial_rate_to: 'Sets the speed of serial communication.',
                    },
                },
                vn: {
                    template: {
                        hamsterslite_hand_found: 'hand found?',
                        hamsterslite_boolean: '%1?',
                        hamsterslite_value: '%1',
                        hamsterslite_move_forward_once: 'move forward once on board %1',
                        hamsterslite_turn_once: 'turn %1 once on board %2',
                        hamsterslite_move_forward_unit: 'move forward %1 %2 %3',
                        hamsterslite_move_backward_unit: 'move backward %1 %2 %3',
                        hamsterslite_turn_unit_in_place: 'turn %1 %2 %3 in place %4',
                        hamsterslite_pivot_around_unit_in_direction:
                            'pivot around %1 %2 %3 in %4 direction %5',
                        hamsterslite_turn_unit_with_radius_in_direction:
                            '%1 turn %2 %3 %4 with radius %5 cm in %6 direction %7',
                        hamsterslite_change_both_wheels_by:
                            'change wheels by left: %1 right: %2 %3',
                        hamsterslite_set_both_wheels_to: 'set wheels to left: %1 right: %2 %3',
                        hamsterslite_change_wheel_by: 'change %1 wheel by %2 %3',
                        hamsterslite_set_wheel_to: 'set %1 wheel to %2 %3',
                        hamsterslite_follow_line_using: 'follow %1 line using %2 floor sensor %3',
                        hamsterslite_follow_line_until: 'follow %1 line until %2 intersection %3',
                        hamsterslite_set_following_speed_to: 'set following speed to %1 %2',
                        hamsterslite_set_following_gain_to:
                            'set following directional variation to %1 %2',
                        hamsterslite_stop: 'stop %1',
                        hamsterslite_set_led_to: 'set %1 led to %2 %3',
                        hamsterslite_pick_led: 'set %1 led to %2 %3',
                        hamsterslite_change_led_by_rgb: 'change %1 led by r: %2 g: %3 b: %4 %5',
                        hamsterslite_set_led_to_rgb: 'set %1 led to r: %2 g: %3 b: %4 %5',
                        hamsterslite_clear_led: 'clear %1 led %2',
                        hamsterslite_play_sound_times: 'play sound %1 %2 times %3',
                        hamsterslite_play_sound_times_until_done:
                            'play sound %1 %2 times until done %3',
                        hamsterslite_change_buzzer_by: 'change buzzer by %1 %2',
                        hamsterslite_set_buzzer_to: 'set buzzer to %1 %2',
                        hamsterslite_clear_sound: 'clear sound %1',
                        hamsterslite_play_note: 'play note %1 %2 %3',
                        hamsterslite_play_note_for: 'play note %1 %2 for %3 beats %4',
                        hamsterslite_rest_for: 'rest for %1 beats %2',
                        hamsterslite_change_tempo_by: 'change tempo by %1 %2',
                        hamsterslite_set_tempo_to: 'set tempo to %1 bpm %2',
                        hamsterslite_set_port_to: 'set port %1 to %2 %3',
                        hamsterslite_change_output_by: 'change output %1 by %2 %3',
                        hamsterslite_set_output_to: 'set output %1 to %2 %3',
                        hamsterslite_gripper: '%1 gripper %2',
                        hamsterslite_release_gripper: 'release gripper %1',
                        hamsterslite_write_serial: 'write %1 %2 to serial %3',
                        hamsterslite_read_serial_until: 'read serial %1 %2',
                        hamsterslite_set_serial_rate_to: 'set serial rate to %1 Bd %2',
                    },
                    Blocks: {
                        hamsterslite_tilt_forward: 'tilt forward',
                        hamsterslite_tilt_backward: 'tilt backward',
                        hamsterslite_tilt_left: 'tilt left',
                        hamsterslite_tilt_right: 'tilt right',
                        hamsterslite_tilt_flip: 'tilt flip',
                        hamsterslite_tilt_not: 'not tilt',
                        hamsterslite_tap: 'tap',
                        hamsterslite_free_fall: 'free fall',
                        hamsterslite_battery_normal: 'battery normal',
                        hamsterslite_battery_low: 'battery low',
                        hamsterslite_battery_empty: 'battery empty',
                        hamsterslite_sensor_left_proximity: 'left proximity',
                        hamsterslite_sensor_right_proximity: 'right proximity',
                        hamsterslite_sensor_left_floor: 'left floor',
                        hamsterslite_sensor_right_floor: 'right floor',
                        hamsterslite_sensor_acceleration_x: 'x acceleration',
                        hamsterslite_sensor_acceleration_y: 'y acceleration',
                        hamsterslite_sensor_acceleration_z: 'z acceleration',
                        hamsterslite_sensor_light: 'light',
                        hamsterslite_sensor_temperature: 'temperature',
                        hamsterslite_sensor_signal_strength: 'signal strength',
                        hamsterslite_sensor_input_a: 'input A',
                        hamsterslite_sensor_input_b: 'input B',
                        hamsterslite_serial_input: 'serial input',
                        hamsterslite_left: 'left',
                        hamsterslite_right: 'right',
                        hamsterslite_unit_cm: 'cm',
                        hamsterslite_unit_sec: 'seconds',
                        hamsterslite_unit_pulse: 'pulses',
                        hamsterslite_unit_deg: 'degrees',
                        hamsterslite_left_pen: 'left pen',
                        hamsterslite_right_pen: 'right pen',
                        hamsterslite_left_wheel: 'left wheel',
                        hamsterslite_right_wheel: 'right wheel',
                        hamsterslite_forward: 'forward',
                        hamsterslite_backward: 'backward',
                        hamsterslite_robot: 'robot',
                        hamsterslite_both: 'both',
                        hamsterslite_color_black: 'black',
                        hamsterslite_color_white: 'white',
                        hamsterslite_front: 'front',
                        hamsterslite_rear: 'rear',
                        hamsterslite_gain_default: 'default',
                        hamsterslite_color_red: 'red',
                        hamsterslite_color_orange: 'orange',
                        hamsterslite_color_yellow: 'yellow',
                        hamsterslite_color_green: 'green',
                        hamsterslite_color_sky_blue: 'sky blue',
                        hamsterslite_color_blue: 'blue',
                        hamsterslite_color_violet: 'violet',
                        hamsterslite_color_purple: 'purple',
                        hamsterslite_sound_beep: 'beep',
                        hamsterslite_sound_random_beep: 'random beep',
                        hamsterslite_sound_noise: 'noise',
                        hamsterslite_sound_siren: 'siren',
                        hamsterslite_sound_engine: 'engine',
                        hamsterslite_sound_chop: 'chop',
                        hamsterslite_sound_robot: 'robot',
                        hamsterslite_sound_dibidibidip: 'dibidibidip',
                        hamsterslite_sound_good_job: 'good job',
                        hamsterslite_sound_happy: 'happy',
                        hamsterslite_sound_angry: 'angry',
                        hamsterslite_sound_sad: 'sad',
                        hamsterslite_sound_sleep: 'sleep',
                        hamsterslite_sound_march: 'march',
                        hamsterslite_sound_birthday: 'birthday',
                        hamsterslite_note_c: 'C',
                        hamsterslite_note_c_sharp: 'C♯(D♭)',
                        hamsterslite_note_d: 'D',
                        hamsterslite_note_d_sharp: 'D♯(E♭)',
                        hamsterslite_note_e: 'E',
                        hamsterslite_note_f: 'F',
                        hamsterslite_note_f_sharp: 'F♯(G♭)',
                        hamsterslite_note_g: 'G',
                        hamsterslite_note_g_sharp: 'G♯(A♭)',
                        hamsterslite_note_a: 'A',
                        hamsterslite_note_a_sharp: 'A♯(B♭)',
                        hamsterslite_note_b: 'B',
                        hamsterslite_port_a: 'A',
                        hamsterslite_port_b: 'B',
                        hamsterslite_port_ab: 'A and B',
                        hamsterslite_analog_input: 'analog input',
                        hamsterslite_digital_input: 'digital input',
                        hamsterslite_digital_input_pull_up: 'digital input (pull up)',
                        hamsterslite_digital_input_pull_down: 'digital input (pull down)',
                        hamsterslite_voltage_input: 'voltage input',
                        hamsterslite_servo_output: 'servo output',
                        hamsterslite_pwm_output: 'pwm output',
                        hamsterslite_digital_output: 'digital output',
                        hamsterslite_open_gripper: 'open',
                        hamsterslite_close_gripper: 'close',
                        hamsterslite_serial_string: 'string',
                        hamsterslite_serial_string_line: 'string line',
                        hamsterslite_serial_all: 'all',
                        hamsterslite_serial_until_comma: 'until ,(comma)',
                        hamsterslite_serial_until_colon: 'until :(colon)',
                        hamsterslite_serial_until_dollar: 'until $',
                        hamsterslite_serial_until_sharp: 'until #',
                        hamsterslite_serial_until_new_line: 'until new line',
                    },
                    Helper: {
                        hamsterslite_hand_found:
                            'If there is a hand or object in front of the proximity ' +
                            'sensor, true, otherwise false',
                        hamsterslite_boolean:
                            'tilt forward: If tilted forward, true, otherwise ' +
                            'false<br/>tilt backward: If tilted backward, true, otherwise ' +
                            'false<br/>tilt left: If tilted to the left, true, otherwise ' +
                            'false<br/>tilt right: If tilted to the right, true, ' +
                            'otherwise false<br/>tilt flip: If upside-down, true, ' +
                            'otherwise false<br/>not tilt: If not tilted, true, otherwise ' +
                            'false<br/>battery normal: If the battery is enough, true, ' +
                            'otherwise false<br/>battery low: If the battery is low, ' +
                            'true, otherwise false<br/>battery empty: If the battery is ' +
                            'empty, true, otherwise false',
                        hamsterslite_value:
                            'left proximity: value of left proximity sensor (range: 0 to ' +
                            '255, initial value: 0)<br/>right proximity: value of right ' +
                            'proximity sensor (range: 0 to 255, initial value: ' +
                            '0)<br/>left floor: value of left floor sensor (range: 0 to ' +
                            '100, initial value: 0)<br/>right floor: value of right floor ' +
                            'sensor (range: 0 to 100, initial value: 0)<br/>x ' +
                            'acceleration: x-axis value of acceleration sensor (range: ' +
                            '-32768 to 32767, initial value: 0) The direction in which ' +
                            'the robot moves forward is the positive direction of the x ' +
                            'axis.<br/>y acceleration: y-axis value of acceleration ' +
                            'sensor (range: -32768 to 32767, initial value: 0) The left ' +
                            'direction of the robot is the positive direction of the y ' +
                            'axis.<br/>z acceleration: z-axis value of acceleration ' +
                            'sensor (range: -32768 to 32767, initial value: 0) The upward ' +
                            'direction of the robot is the positive direction of the z ' +
                            'axis.<br/>light: value of light sensor (range: 0 to 65535, ' +
                            'initial value: 0) The brighter, the larger the ' +
                            'value.<br/>temperature: temperature value inside the robot ' +
                            '(range: -40 to 88 degrees Celsius, initial value: ' +
                            '0)<br/>signal strength: signal strength of Bluetooth ' +
                            'communication (range: -128 to 0 dBm, initial value: 0) As ' +
                            'the signal strength increases, the value ' +
                            'increases.<br/>input A: value of signal input to external ' +
                            'port A (range: analog input 0 to 255, digital input 0 or 1, ' +
                            'initial value: 0)<br/>input B: value of signal input to ' +
                            'external port B (range: analog input 0 to 255, digital input ' +
                            '0 or 1, initial value: 0)',
                        hamsterslite_move_forward_once: 'Moves one space forward on the board.',
                        hamsterslite_turn_once: 'Turns left/right 90 degrees on the board.',
                        hamsterslite_move_forward_unit:
                            'Moves forward for the number of cm/seconds/pulses entered.',
                        hamsterslite_move_backward_unit:
                            'Moves backward for the number of cm/seconds/pulses entered.',
                        hamsterslite_turn_unit_in_place:
                            'Turns left/right in place for the number of ' +
                            'degrees/seconds/pulses entered.',
                        hamsterslite_pivot_around_unit_in_direction:
                            'Pivots around the left/right pen/wheel in the ' +
                            'forward/backward direction for the number of ' +
                            'degrees/seconds/pulses entered.',
                        hamsterslite_turn_unit_with_radius_in_direction:
                            'Turns left/right so that the left/right pen draws the circle ' +
                            'of the entered radius in the forward/backward direction for ' +
                            'the number of degrees/seconds/pulses entered.',
                        hamsterslite_change_both_wheels_by:
                            'Adds the entered values to the current speed values (%) of ' +
                            'the left and right wheels respectively. If the result is ' +
                            'positive, the wheel rotates forward; if negative, the wheel ' +
                            'rotates backward.',
                        hamsterslite_set_both_wheels_to:
                            'Sets the speed of the left and right wheels to the entered ' +
                            'values (-100 to 100%), respectively. If you enter a positive ' +
                            'value, the wheel rotates forward. If you enter a negative ' +
                            'value, the wheel rotates backward. Entering the number 0 ' +
                            'stops it.',
                        hamsterslite_change_wheel_by:
                            'Adds the entered value to the current speed value (%) of the ' +
                            'left/right/both wheels. If the result is positive, the wheel ' +
                            'rotates forward; if negative, the wheel rotates backward.',
                        hamsterslite_set_wheel_to:
                            'Sets the speed of the left/right/both wheels to the entered ' +
                            'value (-100 to 100%). If you enter a positive value, the ' +
                            'wheel rotates forward. If you enter a negative value, the ' +
                            'wheel rotates backward. Entering the number 0 stops it.',
                        hamsterslite_follow_line_using:
                            'Moves along the black/white line by using the ' +
                            'left/right/both floor sensors.',
                        hamsterslite_follow_line_until:
                            'Moves along the black/white line on the ' +
                            'left/right/front/back, then stops when the robot meets the ' +
                            'intersection.',
                        hamsterslite_set_following_speed_to:
                            'Sets the speed (1 to 8) to move along the line. The larger ' +
                            'the number, the faster the movement.',
                        hamsterslite_set_following_gain_to:
                            'Sets the directional variation (1 to 8) 선을 따라 이동하는 방향 변화량(1 ' +
                            '~ 8)을 설정합니다. 숫자가 클수록 급커브를 잘 따라가지만 직선에서 좌우로 더 흔들립니다.',
                        hamsterslite_stop: 'Stops both wheels.',
                        hamsterslite_set_led_to:
                            'Turns left/right/both LEDs to the selected color.',
                        hamsterslite_pick_led: 'Turns left/right/both LEDs to the selected color.',
                        hamsterslite_change_led_by_rgb:
                            'Adds the entered values to the current R, G, B values of ' +
                            'left/right/both LEDs, respectively.',
                        hamsterslite_set_led_to_rgb:
                            'Sets the R, G, B values of left/right/both LEDs to the ' +
                            'entered values.',
                        hamsterslite_clear_led: 'Turns off the left/right/both LEDs.',
                        hamsterslite_play_sound_times:
                            'Plays the selected sound as many times as entered.',
                        hamsterslite_play_sound_times_until_done:
                            'Plays the selected sound as many times as entered, and waits ' +
                            'for completion.',
                        hamsterslite_change_buzzer_by:
                            'Adds the entered value to the current pitch (Hz) of the ' +
                            'buzzer sound. You can enter up to two decimal places.',
                        hamsterslite_set_buzzer_to:
                            'Sets the pitch of the buzzer sound to the entered value ' +
                            '(Hz). You can enter up to two decimal places. Entering the ' +
                            'number 0 turns off the buzzer sound.',
                        hamsterslite_clear_sound: 'Turns off sound.',
                        hamsterslite_play_note: 'It sounds the selected tone and octave.',
                        hamsterslite_play_note_for:
                            'It sounds the selected tone and octave as much as the beat ' +
                            'you entered.',
                        hamsterslite_rest_for: 'Rests as much as the beat you entered.',
                        hamsterslite_change_tempo_by:
                            'Adds the entered value to the current BPM (beats per minute) ' +
                            'of the playing or resting speed.',
                        hamsterslite_set_tempo_to:
                            'Sets the playing or resting speed to the entered BPM (beats ' +
                            'per minute).',
                        hamsterslite_set_port_to:
                            'Sets the io mode of the selected external port to the selected mode.',
                        hamsterslite_change_output_by:
                            'Adds the entered value to the current output value of the ' +
                            'selected external port. The result will be in the following ' +
                            'range depending on the mode of the external port.<br/>Servo ' +
                            'output: valid range from 1 to 180 degrees; if 0, output 0 ' +
                            'without PWM pulse<br/>PWM output: 0 to 100%, duty ratio (%) ' +
                            'of ON state in PWM waveform<br/>Digital output: LOW when 0, ' +
                            'otherwise HIGH',
                        hamsterslite_set_output_to:
                            'Sets the output value of the selected external port to the ' +
                            'entered value. The value has the following range according ' +
                            'to the mode of external port.<br/>Servo output: valid range ' +
                            'from 1 to 180 degrees; if 0, output 0 without PWM ' +
                            'pulse<br/>PWM output: 0 to 100%, duty ratio (%) of ON state ' +
                            'in PWM waveform<br/>Digital output: LOW when 0, otherwise HIGH',
                        hamsterslite_gripper: 'Opens or closes the gripper.',
                        hamsterslite_release_gripper:
                            'Turns off the gripper so that it can be moved freely.',
                        hamsterslite_write_serial: 'Sends strings via serial communication.',
                        hamsterslite_read_serial_until:
                            'Read the strings received by serial communication.',
                        hamsterslite_set_serial_rate_to: 'Sets the speed of serial communication.',
                    },
                },
            };
            Object.keys(add).forEach((locale) => {
                if (!base[locale]) {
                    base[locale] = {};
                }
                Object.keys(add[locale]).forEach((section) => {
                    base[locale][section] = Object.assign(
                        {},
                        base[locale][section],
                        add[locale][section]
                    );
                });
            });
            return base;
        }

        // ── 블록 정의 (햄스터S 전용) ──
        // 상위 정의에 얹는다. 타입 이름이 hamsterslite_ 로 갈라지므로 전역 블록 표에서
        // 구형 것과 충돌하지 않는다.
        // 정의는 설치형 block_hamster_s.js 를 옮긴 것이다. 달라진 곳은 두 가지뿐이다:
        //   - func 는 activeHamster() 로 위임한다(설치형은 Entry.HamsterS.getRobot())
        //   - syntax 는 비운다. 설치형 py 문자열(HamsterS.*)을 복제하면 한 번들 안에서
        //     같은 문자열이 두 타입에 걸려 설치형의 python -> 블록 변환을 가로챌 수 있다
        getBlocks() {
            return Object.assign({}, super.getBlocks(), {
                hamsterslite_hand_found: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    fontColor: '#fff',
                    skeleton: 'basic_boolean_field',
                    statements: [],
                    params: [],
                    events: {},
                    def: {
                        params: [],
                        type: 'hamsterslite_hand_found',
                    },
                    class: 'hamsterslite_sensor',
                    isNotFor: ['HamsterSLite'],
                    func(sprite, script) {
                        return activeHamster().checkHandFound(script);
                    },
                    syntax: { js: [], py: [] },
                },
                hamsterslite_boolean: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    fontColor: '#fff',
                    skeleton: 'basic_boolean_field',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.hamsterslite_tilt_forward, 'TILT_FORWARD'],
                                [Lang.Blocks.hamsterslite_tilt_backward, 'TILT_BACKWARD'],
                                [Lang.Blocks.hamsterslite_tilt_left, 'TILT_LEFT'],
                                [Lang.Blocks.hamsterslite_tilt_right, 'TILT_RIGHT'],
                                [Lang.Blocks.hamsterslite_tilt_flip, 'TILT_FLIP'],
                                [Lang.Blocks.hamsterslite_tilt_not, 'TILT_NOT'],
                                [Lang.Blocks.hamsterslite_tap, 'TAP'],
                                [Lang.Blocks.hamsterslite_free_fall, 'FREE_FALL'],
                                [Lang.Blocks.hamsterslite_battery_normal, 'BATTERY_NORMAL'],
                                [Lang.Blocks.hamsterslite_battery_low, 'BATTERY_LOW'],
                                [Lang.Blocks.hamsterslite_battery_empty, 'BATTERY_EMPTY'],
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
                        type: 'hamsterslite_boolean',
                    },
                    paramsKeyMap: {
                        DEVICE: 0,
                    },
                    class: 'hamsterslite_sensor',
                    isNotFor: ['HamsterSLite'],
                    func(sprite, script) {
                        return activeHamster().checkBoolean(script);
                    },
                    syntax: { js: [], py: [] },
                },
                hamsterslite_value: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    fontColor: '#fff',
                    skeleton: 'basic_string_field',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.hamsterslite_sensor_left_proximity, 'LEFT_PROXIMITY'],
                                [
                                    Lang.Blocks.hamsterslite_sensor_right_proximity,
                                    'RIGHT_PROXIMITY',
                                ],
                                [Lang.Blocks.hamsterslite_sensor_left_floor, 'LEFT_FLOOR'],
                                [Lang.Blocks.hamsterslite_sensor_right_floor, 'RIGHT_FLOOR'],
                                [Lang.Blocks.hamsterslite_sensor_acceleration_x, 'ACCELERATION_X'],
                                [Lang.Blocks.hamsterslite_sensor_acceleration_y, 'ACCELERATION_Y'],
                                [Lang.Blocks.hamsterslite_sensor_acceleration_z, 'ACCELERATION_Z'],
                                [Lang.Blocks.hamsterslite_sensor_light, 'LIGHT'],
                                [Lang.Blocks.hamsterslite_sensor_temperature, 'TEMPERATURE'],
                                [
                                    Lang.Blocks.hamsterslite_sensor_signal_strength,
                                    'SIGNAL_STRENGTH',
                                ],
                                [Lang.Blocks.hamsterslite_sensor_input_a, 'INPUT_A'],
                                [Lang.Blocks.hamsterslite_sensor_input_b, 'INPUT_B'],
                                [Lang.Blocks.hamsterslite_serial_input, 'SERIAL_INPUT'],
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
                        type: 'hamsterslite_value',
                    },
                    paramsKeyMap: {
                        DEVICE: 0,
                    },
                    class: 'hamsterslite_sensor',
                    isNotFor: ['HamsterSLite'],
                    func(sprite, script) {
                        return activeHamster().getValue(script);
                    },
                    syntax: { js: [], py: [] },
                },
                hamsterslite_move_forward_once: {
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
                        type: 'hamsterslite_move_forward_once',
                    },
                    class: 'hamsterslite_board',
                    isNotFor: ['HamsterSLite'],
                    func(sprite, script) {
                        return activeHamster().boardForward(script);
                    },
                    syntax: { js: [], py: [] },
                },
                hamsterslite_turn_once: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.hamsterslite_left, 'LEFT'],
                                [Lang.Blocks.hamsterslite_right, 'RIGHT'],
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
                        type: 'hamsterslite_turn_once',
                    },
                    paramsKeyMap: {
                        DIRECTION: 0,
                    },
                    class: 'hamsterslite_board',
                    isNotFor: ['HamsterSLite'],
                    func(sprite, script) {
                        return activeHamster().boardTurn(script);
                    },
                    syntax: { js: [], py: [] },
                },
                hamsterslite_move_forward_unit: {
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
                                [Lang.Blocks.hamsterslite_unit_cm, 'CM'],
                                [Lang.Blocks.hamsterslite_unit_sec, 'SEC'],
                                [Lang.Blocks.hamsterslite_unit_pulse, 'PULSE'],
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
                        type: 'hamsterslite_move_forward_unit',
                    },
                    paramsKeyMap: {
                        VALUE: 0,
                        UNIT: 1,
                    },
                    class: 'hamsterslite_wheel',
                    isNotFor: ['HamsterSLite'],
                    func(sprite, script) {
                        return activeHamster().moveForwardUnit(script);
                    },
                    syntax: { js: [], py: [] },
                },
                hamsterslite_move_backward_unit: {
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
                                [Lang.Blocks.hamsterslite_unit_cm, 'CM'],
                                [Lang.Blocks.hamsterslite_unit_sec, 'SEC'],
                                [Lang.Blocks.hamsterslite_unit_pulse, 'PULSE'],
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
                        type: 'hamsterslite_move_backward_unit',
                    },
                    paramsKeyMap: {
                        VALUE: 0,
                        UNIT: 1,
                    },
                    class: 'hamsterslite_wheel',
                    isNotFor: ['HamsterSLite'],
                    func(sprite, script) {
                        return activeHamster().moveBackwardUnit(script);
                    },
                    syntax: { js: [], py: [] },
                },
                hamsterslite_turn_unit_in_place: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.hamsterslite_left, 'LEFT'],
                                [Lang.Blocks.hamsterslite_right, 'RIGHT'],
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
                                [Lang.Blocks.hamsterslite_unit_deg, 'DEG'],
                                [Lang.Blocks.hamsterslite_unit_sec, 'SEC'],
                                [Lang.Blocks.hamsterslite_unit_pulse, 'PULSE'],
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
                        type: 'hamsterslite_turn_unit_in_place',
                    },
                    paramsKeyMap: {
                        DIRECTION: 0,
                        VALUE: 1,
                        UNIT: 2,
                    },
                    class: 'hamsterslite_wheel',
                    isNotFor: ['HamsterSLite'],
                    func(sprite, script) {
                        return activeHamster().turnUnit(script);
                    },
                    syntax: { js: [], py: [] },
                },
                hamsterslite_pivot_around_unit_in_direction: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.hamsterslite_left_pen, 'LEFT_PEN'],
                                [Lang.Blocks.hamsterslite_right_pen, 'RIGHT_PEN'],
                                [Lang.Blocks.hamsterslite_left_wheel, 'LEFT_WHEEL'],
                                [Lang.Blocks.hamsterslite_right_wheel, 'RIGHT_WHEEL'],
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
                                [Lang.Blocks.hamsterslite_unit_deg, 'DEG'],
                                [Lang.Blocks.hamsterslite_unit_sec, 'SEC'],
                                [Lang.Blocks.hamsterslite_unit_pulse, 'PULSE'],
                            ],
                            value: 'DEG',
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.hamsterslite_forward, 'FORWARD'],
                                [Lang.Blocks.hamsterslite_backward, 'BACKWARD'],
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
                        type: 'hamsterslite_pivot_around_unit_in_direction',
                    },
                    paramsKeyMap: {
                        PART: 0,
                        VALUE: 1,
                        UNIT: 2,
                        TOWARD: 3,
                    },
                    class: 'hamsterslite_wheel',
                    isNotFor: ['HamsterSLite'],
                    func(sprite, script) {
                        return activeHamster().pivotUnit(script);
                    },
                    syntax: { js: [], py: [] },
                },
                hamsterslite_turn_unit_with_radius_in_direction: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.hamsterslite_left_pen, 'LEFT_PEN'],
                                [Lang.Blocks.hamsterslite_right_pen, 'RIGHT_PEN'],
                                [Lang.Blocks.hamsterslite_robot, 'ROBOT'],
                            ],
                            value: 'LEFT_PEN',
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.hamsterslite_left, 'LEFT'],
                                [Lang.Blocks.hamsterslite_right, 'RIGHT'],
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
                                [Lang.Blocks.hamsterslite_unit_deg, 'DEG'],
                                [Lang.Blocks.hamsterslite_unit_sec, 'SEC'],
                                [Lang.Blocks.hamsterslite_unit_pulse, 'PULSE'],
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
                                [Lang.Blocks.hamsterslite_forward, 'FORWARD'],
                                [Lang.Blocks.hamsterslite_backward, 'BACKWARD'],
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
                        type: 'hamsterslite_turn_unit_with_radius_in_direction',
                    },
                    paramsKeyMap: {
                        PART: 0,
                        DIRECTION: 1,
                        VALUE: 2,
                        UNIT: 3,
                        RADIUS: 4,
                        TOWARD: 5,
                    },
                    class: 'hamsterslite_wheel',
                    isNotFor: ['HamsterSLite'],
                    func(sprite, script) {
                        return activeHamster().swingUnit(script);
                    },
                    syntax: { js: [], py: [] },
                },
                hamsterslite_change_both_wheels_by: {
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
                        type: 'hamsterslite_change_both_wheels_by',
                    },
                    paramsKeyMap: {
                        LEFT: 0,
                        RIGHT: 1,
                    },
                    class: 'hamsterslite_wheel',
                    isNotFor: ['HamsterSLite'],
                    func(sprite, script) {
                        return activeHamster().changeWheels(script);
                    },
                    syntax: { js: [], py: [] },
                },
                hamsterslite_set_both_wheels_to: {
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
                        type: 'hamsterslite_set_both_wheels_to',
                    },
                    paramsKeyMap: {
                        LEFT: 0,
                        RIGHT: 1,
                    },
                    class: 'hamsterslite_wheel',
                    isNotFor: ['HamsterSLite'],
                    func(sprite, script) {
                        return activeHamster().setWheels(script);
                    },
                    syntax: { js: [], py: [] },
                },
                hamsterslite_change_wheel_by: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.hamsterslite_left, 'LEFT'],
                                [Lang.Blocks.hamsterslite_right, 'RIGHT'],
                                [Lang.Blocks.hamsterslite_both, 'BOTH'],
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
                        type: 'hamsterslite_change_wheel_by',
                    },
                    paramsKeyMap: {
                        WHEEL: 0,
                        VELOCITY: 1,
                    },
                    class: 'hamsterslite_wheel',
                    isNotFor: ['HamsterSLite'],
                    func(sprite, script) {
                        return activeHamster().changeWheel(script);
                    },
                    syntax: { js: [], py: [] },
                },
                hamsterslite_set_wheel_to: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.hamsterslite_left, 'LEFT'],
                                [Lang.Blocks.hamsterslite_right, 'RIGHT'],
                                [Lang.Blocks.hamsterslite_both, 'BOTH'],
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
                        type: 'hamsterslite_set_wheel_to',
                    },
                    paramsKeyMap: {
                        WHEEL: 0,
                        VELOCITY: 1,
                    },
                    class: 'hamsterslite_wheel',
                    isNotFor: ['HamsterSLite'],
                    func(sprite, script) {
                        return activeHamster().setWheel(script);
                    },
                    syntax: { js: [], py: [] },
                },
                hamsterslite_follow_line_using: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.hamsterslite_color_black, 'BLACK'],
                                [Lang.Blocks.hamsterslite_color_white, 'WHITE'],
                            ],
                            value: 'BLACK',
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.hamsterslite_left, 'LEFT'],
                                [Lang.Blocks.hamsterslite_right, 'RIGHT'],
                                [Lang.Blocks.hamsterslite_both, 'BOTH'],
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
                        type: 'hamsterslite_follow_line_using',
                    },
                    paramsKeyMap: {
                        COLOR: 0,
                        SENSOR: 1,
                    },
                    class: 'hamsterslite_wheel',
                    isNotFor: ['HamsterSLite'],
                    func(sprite, script) {
                        return activeHamster().followLine(script);
                    },
                    syntax: { js: [], py: [] },
                },
                hamsterslite_follow_line_until: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.hamsterslite_color_black, 'BLACK'],
                                [Lang.Blocks.hamsterslite_color_white, 'WHITE'],
                            ],
                            value: 'BLACK',
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.hamsterslite_left, 'LEFT'],
                                [Lang.Blocks.hamsterslite_right, 'RIGHT'],
                                [Lang.Blocks.hamsterslite_front, 'FRONT'],
                                [Lang.Blocks.hamsterslite_rear, 'REAR'],
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
                        type: 'hamsterslite_follow_line_until',
                    },
                    paramsKeyMap: {
                        COLOR: 0,
                        DIRECTION: 1,
                    },
                    class: 'hamsterslite_wheel',
                    isNotFor: ['HamsterSLite'],
                    func(sprite, script) {
                        return activeHamster().followLineUntil(script);
                    },
                    syntax: { js: [], py: [] },
                },
                hamsterslite_set_following_speed_to: {
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
                        type: 'hamsterslite_set_following_speed_to',
                    },
                    paramsKeyMap: {
                        SPEED: 0,
                    },
                    class: 'hamsterslite_wheel',
                    isNotFor: ['HamsterSLite'],
                    func(sprite, script) {
                        return activeHamster().setLineTracerSpeed(script);
                    },
                    syntax: { js: [], py: [] },
                },
                hamsterslite_set_following_gain_to: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.hamsterslite_gain_default, 'DEFAULT'],
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
                        type: 'hamsterslite_set_following_gain_to',
                    },
                    paramsKeyMap: {
                        GAIN: 0,
                    },
                    class: 'hamsterslite_wheel',
                    isNotFor: ['HamsterSLite'],
                    func(sprite, script) {
                        return activeHamster().setLineTracerGain(script);
                    },
                    syntax: { js: [], py: [] },
                },
                hamsterslite_stop: {
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
                        type: 'hamsterslite_stop',
                    },
                    class: 'hamsterslite_wheel',
                    isNotFor: ['HamsterSLite'],
                    func(sprite, script) {
                        return activeHamster().stop(script);
                    },
                    syntax: { js: [], py: [] },
                },
                hamsterslite_set_led_to: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.hamsterslite_left, 'LEFT'],
                                [Lang.Blocks.hamsterslite_right, 'RIGHT'],
                                [Lang.Blocks.hamsterslite_both, 'BOTH'],
                            ],
                            value: 'LEFT',
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.hamsterslite_color_red, 'RED'],
                                [Lang.Blocks.hamsterslite_color_orange, 'ORANGE'],
                                [Lang.Blocks.hamsterslite_color_yellow, 'YELLOW'],
                                [Lang.Blocks.hamsterslite_color_green, 'GREEN'],
                                [Lang.Blocks.hamsterslite_color_sky_blue, 'SKY_BLUE'],
                                [Lang.Blocks.hamsterslite_color_blue, 'BLUE'],
                                [Lang.Blocks.hamsterslite_color_violet, 'VIOLET'],
                                [Lang.Blocks.hamsterslite_color_purple, 'PURPLE'],
                                [Lang.Blocks.hamsterslite_color_white, 'WHITE'],
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
                        type: 'hamsterslite_set_led_to',
                    },
                    paramsKeyMap: {
                        LED: 0,
                        COLOR: 1,
                    },
                    class: 'hamsterslite_led',
                    isNotFor: ['HamsterSLite'],
                    func(sprite, script) {
                        return activeHamster().setLed(script);
                    },
                    syntax: { js: [], py: [] },
                },
                hamsterslite_pick_led: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.hamsterslite_left, 'LEFT'],
                                [Lang.Blocks.hamsterslite_right, 'RIGHT'],
                                [Lang.Blocks.hamsterslite_both, 'BOTH'],
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
                        type: 'hamsterslite_pick_led',
                    },
                    paramsKeyMap: {
                        LED: 0,
                        COLOR: 1,
                    },
                    class: 'hamsterslite_led',
                    isNotFor: ['HamsterSLite'],
                    func(sprite, script) {
                        return activeHamster().pickLed(script);
                    },
                    syntax: { js: [], py: [] },
                },
                hamsterslite_change_led_by_rgb: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.hamsterslite_left, 'LEFT'],
                                [Lang.Blocks.hamsterslite_right, 'RIGHT'],
                                [Lang.Blocks.hamsterslite_both, 'BOTH'],
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
                        type: 'hamsterslite_change_led_by_rgb',
                    },
                    paramsKeyMap: {
                        LED: 0,
                        RED: 1,
                        GREEN: 2,
                        BLUE: 3,
                    },
                    class: 'hamsterslite_led',
                    isNotFor: ['HamsterSLite'],
                    func(sprite, script) {
                        return activeHamster().changeRgb(script);
                    },
                    syntax: { js: [], py: [] },
                },
                hamsterslite_set_led_to_rgb: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.hamsterslite_left, 'LEFT'],
                                [Lang.Blocks.hamsterslite_right, 'RIGHT'],
                                [Lang.Blocks.hamsterslite_both, 'BOTH'],
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
                        type: 'hamsterslite_set_led_to_rgb',
                    },
                    paramsKeyMap: {
                        LED: 0,
                        RED: 1,
                        GREEN: 2,
                        BLUE: 3,
                    },
                    class: 'hamsterslite_led',
                    isNotFor: ['HamsterSLite'],
                    func(sprite, script) {
                        return activeHamster().setRgb(script);
                    },
                    syntax: { js: [], py: [] },
                },
                hamsterslite_clear_led: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.hamsterslite_left, 'LEFT'],
                                [Lang.Blocks.hamsterslite_right, 'RIGHT'],
                                [Lang.Blocks.hamsterslite_both, 'BOTH'],
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
                        type: 'hamsterslite_clear_led',
                    },
                    paramsKeyMap: {
                        LED: 0,
                    },
                    class: 'hamsterslite_led',
                    isNotFor: ['HamsterSLite'],
                    func(sprite, script) {
                        return activeHamster().clearLed(script);
                    },
                    syntax: { js: [], py: [] },
                },
                hamsterslite_play_sound_times: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.hamsterslite_sound_beep, 'BEEP'],
                                [Lang.Blocks.hamsterslite_sound_random_beep, 'RANDOM_BEEP'],
                                [Lang.Blocks.hamsterslite_sound_noise, 'NOISE'],
                                [Lang.Blocks.hamsterslite_sound_siren, 'SIREN'],
                                [Lang.Blocks.hamsterslite_sound_engine, 'ENGINE'],
                                [Lang.Blocks.hamsterslite_sound_chop, 'CHOP'],
                                [Lang.Blocks.hamsterslite_sound_robot, 'ROBOT'],
                                [Lang.Blocks.hamsterslite_sound_dibidibidip, 'DIBIDIBIDIP'],
                                [Lang.Blocks.hamsterslite_sound_good_job, 'GOOD_JOB'],
                                [Lang.Blocks.hamsterslite_sound_happy, 'HAPPY'],
                                [Lang.Blocks.hamsterslite_sound_angry, 'ANGRY'],
                                [Lang.Blocks.hamsterslite_sound_sad, 'SAD'],
                                [Lang.Blocks.hamsterslite_sound_sleep, 'SLEEP'],
                                [Lang.Blocks.hamsterslite_sound_march, 'MARCH'],
                                [Lang.Blocks.hamsterslite_sound_birthday, 'BIRTHDAY'],
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
                        type: 'hamsterslite_play_sound_times',
                    },
                    paramsKeyMap: {
                        SOUND: 0,
                        COUNT: 1,
                    },
                    class: 'hamsterslite_sound',
                    isNotFor: ['HamsterSLite'],
                    func(sprite, script) {
                        return activeHamster().playSound(script);
                    },
                    syntax: { js: [], py: [] },
                },
                hamsterslite_play_sound_times_until_done: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.hamsterslite_sound_beep, 'BEEP'],
                                [Lang.Blocks.hamsterslite_sound_random_beep, 'RANDOM_BEEP'],
                                [Lang.Blocks.hamsterslite_sound_noise, 'NOISE'],
                                [Lang.Blocks.hamsterslite_sound_siren, 'SIREN'],
                                [Lang.Blocks.hamsterslite_sound_engine, 'ENGINE'],
                                [Lang.Blocks.hamsterslite_sound_chop, 'CHOP'],
                                [Lang.Blocks.hamsterslite_sound_robot, 'ROBOT'],
                                [Lang.Blocks.hamsterslite_sound_dibidibidip, 'DIBIDIBIDIP'],
                                [Lang.Blocks.hamsterslite_sound_good_job, 'GOOD_JOB'],
                                [Lang.Blocks.hamsterslite_sound_happy, 'HAPPY'],
                                [Lang.Blocks.hamsterslite_sound_angry, 'ANGRY'],
                                [Lang.Blocks.hamsterslite_sound_sad, 'SAD'],
                                [Lang.Blocks.hamsterslite_sound_sleep, 'SLEEP'],
                                [Lang.Blocks.hamsterslite_sound_march, 'MARCH'],
                                [Lang.Blocks.hamsterslite_sound_birthday, 'BIRTHDAY'],
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
                        type: 'hamsterslite_play_sound_times_until_done',
                    },
                    paramsKeyMap: {
                        SOUND: 0,
                        COUNT: 1,
                    },
                    class: 'hamsterslite_sound',
                    isNotFor: ['HamsterSLite'],
                    func(sprite, script) {
                        return activeHamster().playSoundUntil(script);
                    },
                    syntax: { js: [], py: [] },
                },
                hamsterslite_change_buzzer_by: {
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
                        type: 'hamsterslite_change_buzzer_by',
                    },
                    paramsKeyMap: {
                        HZ: 0,
                    },
                    class: 'hamsterslite_sound',
                    isNotFor: ['HamsterSLite'],
                    func(sprite, script) {
                        return activeHamster().changeBuzzer(script);
                    },
                    syntax: { js: [], py: [] },
                },
                hamsterslite_set_buzzer_to: {
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
                        type: 'hamsterslite_set_buzzer_to',
                    },
                    paramsKeyMap: {
                        HZ: 0,
                    },
                    class: 'hamsterslite_sound',
                    isNotFor: ['HamsterSLite'],
                    func(sprite, script) {
                        return activeHamster().setBuzzer(script);
                    },
                    syntax: { js: [], py: [] },
                },
                hamsterslite_clear_sound: {
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
                        type: 'hamsterslite_clear_sound',
                    },
                    class: 'hamsterslite_sound',
                    isNotFor: ['HamsterSLite'],
                    func(sprite, script) {
                        return activeHamster().clearSound(script);
                    },
                    syntax: { js: [], py: [] },
                },
                hamsterslite_play_note: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.hamsterslite_note_c, 'C'],
                                [Lang.Blocks.hamsterslite_note_c_sharp, 'C#'],
                                [Lang.Blocks.hamsterslite_note_d, 'D'],
                                [Lang.Blocks.hamsterslite_note_d_sharp, 'D#'],
                                [Lang.Blocks.hamsterslite_note_e, 'E'],
                                [Lang.Blocks.hamsterslite_note_f, 'F'],
                                [Lang.Blocks.hamsterslite_note_f_sharp, 'F#'],
                                [Lang.Blocks.hamsterslite_note_g, 'G'],
                                [Lang.Blocks.hamsterslite_note_g_sharp, 'G#'],
                                [Lang.Blocks.hamsterslite_note_a, 'A'],
                                [Lang.Blocks.hamsterslite_note_a_sharp, 'A#'],
                                [Lang.Blocks.hamsterslite_note_b, 'B'],
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
                        type: 'hamsterslite_play_note',
                    },
                    paramsKeyMap: {
                        NOTE: 0,
                        OCTAVE: 1,
                    },
                    class: 'hamsterslite_sound',
                    isNotFor: ['HamsterSLite'],
                    func(sprite, script) {
                        return activeHamster().playNote(script);
                    },
                    syntax: { js: [], py: [] },
                },
                hamsterslite_play_note_for: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.hamsterslite_note_c, 'C'],
                                [Lang.Blocks.hamsterslite_note_c_sharp, 'C#'],
                                [Lang.Blocks.hamsterslite_note_d, 'D'],
                                [Lang.Blocks.hamsterslite_note_d_sharp, 'D#'],
                                [Lang.Blocks.hamsterslite_note_e, 'E'],
                                [Lang.Blocks.hamsterslite_note_f, 'F'],
                                [Lang.Blocks.hamsterslite_note_f_sharp, 'F#'],
                                [Lang.Blocks.hamsterslite_note_g, 'G'],
                                [Lang.Blocks.hamsterslite_note_g_sharp, 'G#'],
                                [Lang.Blocks.hamsterslite_note_a, 'A'],
                                [Lang.Blocks.hamsterslite_note_a_sharp, 'A#'],
                                [Lang.Blocks.hamsterslite_note_b, 'B'],
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
                        type: 'hamsterslite_play_note_for',
                    },
                    paramsKeyMap: {
                        NOTE: 0,
                        OCTAVE: 1,
                        BEAT: 2,
                    },
                    class: 'hamsterslite_sound',
                    isNotFor: ['HamsterSLite'],
                    func(sprite, script) {
                        return activeHamster().playNoteBeat(script);
                    },
                    syntax: { js: [], py: [] },
                },
                hamsterslite_rest_for: {
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
                        type: 'hamsterslite_rest_for',
                    },
                    paramsKeyMap: {
                        BEAT: 0,
                    },
                    class: 'hamsterslite_sound',
                    isNotFor: ['HamsterSLite'],
                    func(sprite, script) {
                        return activeHamster().restBeat(script);
                    },
                    syntax: { js: [], py: [] },
                },
                hamsterslite_change_tempo_by: {
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
                        type: 'hamsterslite_change_tempo_by',
                    },
                    paramsKeyMap: {
                        BPM: 0,
                    },
                    class: 'hamsterslite_sound',
                    isNotFor: ['HamsterSLite'],
                    func(sprite, script) {
                        return activeHamster().changeTempo(script);
                    },
                    syntax: { js: [], py: [] },
                },
                hamsterslite_set_tempo_to: {
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
                        type: 'hamsterslite_set_tempo_to',
                    },
                    paramsKeyMap: {
                        BPM: 0,
                    },
                    class: 'hamsterslite_sound',
                    isNotFor: ['HamsterSLite'],
                    func(sprite, script) {
                        return activeHamster().setTempo(script);
                    },
                    syntax: { js: [], py: [] },
                },
                hamsterslite_set_port_to: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.hamsterslite_port_a, 'A'],
                                [Lang.Blocks.hamsterslite_port_b, 'B'],
                                [Lang.Blocks.hamsterslite_port_ab, 'AB'],
                            ],
                            value: 'A',
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.hamsterslite_analog_input, 'ANALOG_INPUT'],
                                [Lang.Blocks.hamsterslite_digital_input, 'DIGITAL_INPUT'],
                                [
                                    Lang.Blocks.hamsterslite_digital_input_pull_up,
                                    'DIGITAL_INPUT_PULL_UP',
                                ],
                                [
                                    Lang.Blocks.hamsterslite_digital_input_pull_down,
                                    'DIGITAL_INPUT_PULL_DOWN',
                                ],
                                [Lang.Blocks.hamsterslite_voltage_input, 'VOLTAGE_INPUT'],
                                [Lang.Blocks.hamsterslite_servo_output, 'SERVO_OUTPUT'],
                                [Lang.Blocks.hamsterslite_pwm_output, 'PWM_OUTPUT'],
                                [Lang.Blocks.hamsterslite_digital_output, 'DIGITAL_OUTPUT'],
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
                        type: 'hamsterslite_set_port_to',
                    },
                    paramsKeyMap: {
                        PORT: 0,
                        MODE: 1,
                    },
                    class: 'hamsterslite_port',
                    isNotFor: ['HamsterSLite'],
                    func(sprite, script) {
                        return activeHamster().setIoMode(script);
                    },
                    syntax: { js: [], py: [] },
                },
                hamsterslite_change_output_by: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.hamsterslite_port_a, 'A'],
                                [Lang.Blocks.hamsterslite_port_b, 'B'],
                                [Lang.Blocks.hamsterslite_port_ab, 'AB'],
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
                        type: 'hamsterslite_change_output_by',
                    },
                    paramsKeyMap: {
                        PORT: 0,
                        VALUE: 1,
                    },
                    class: 'hamsterslite_port',
                    isNotFor: ['HamsterSLite'],
                    func(sprite, script) {
                        return activeHamster().changeOutput(script);
                    },
                    syntax: { js: [], py: [] },
                },
                hamsterslite_set_output_to: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.hamsterslite_port_a, 'A'],
                                [Lang.Blocks.hamsterslite_port_b, 'B'],
                                [Lang.Blocks.hamsterslite_port_ab, 'AB'],
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
                        type: 'hamsterslite_set_output_to',
                    },
                    paramsKeyMap: {
                        PORT: 0,
                        VALUE: 1,
                    },
                    class: 'hamsterslite_port',
                    isNotFor: ['HamsterSLite'],
                    func(sprite, script) {
                        return activeHamster().setOutput(script);
                    },
                    syntax: { js: [], py: [] },
                },
                hamsterslite_gripper: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.hamsterslite_open_gripper, 'OPEN'],
                                [Lang.Blocks.hamsterslite_close_gripper, 'CLOSE'],
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
                        type: 'hamsterslite_gripper',
                    },
                    paramsKeyMap: {
                        ACTION: 0,
                    },
                    class: 'hamsterslite_port',
                    isNotFor: ['HamsterSLite'],
                    func(sprite, script) {
                        return activeHamster().gripper(script);
                    },
                    syntax: { js: [], py: [] },
                },
                hamsterslite_release_gripper: {
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
                        type: 'hamsterslite_release_gripper',
                    },
                    class: 'hamsterslite_port',
                    isNotFor: ['HamsterSLite'],
                    func(sprite, script) {
                        return activeHamster().releaseGripper(script);
                    },
                    syntax: { js: [], py: [] },
                },
                hamsterslite_write_serial: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.hamsterslite_serial_string, 'STRING'],
                                [Lang.Blocks.hamsterslite_serial_string_line, 'STRING_LINE'],
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
                        type: 'hamsterslite_write_serial',
                    },
                    paramsKeyMap: {
                        MODE: 0,
                        STRING: 1,
                    },
                    class: 'hamsterslite_port',
                    isNotFor: ['HamsterSLite'],
                    func(sprite, script) {
                        return activeHamster().writeSerial(script);
                    },
                    syntax: { js: [], py: [] },
                },
                hamsterslite_read_serial_until: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.hamsterslite_serial_all, 'ALL'],
                                [Lang.Blocks.hamsterslite_serial_until_comma, 'COMMA'],
                                [Lang.Blocks.hamsterslite_serial_until_colon, 'COLON'],
                                [Lang.Blocks.hamsterslite_serial_until_dollar, 'DOLLAR'],
                                [Lang.Blocks.hamsterslite_serial_until_sharp, 'SHARP'],
                                [Lang.Blocks.hamsterslite_serial_until_new_line, 'NEW_LINE'],
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
                        type: 'hamsterslite_read_serial_until',
                    },
                    paramsKeyMap: {
                        DELIMITER: 0,
                    },
                    class: 'hamsterslite_port',
                    isNotFor: ['HamsterSLite'],
                    func(sprite, script) {
                        return activeHamster().readSerialUntil(script);
                    },
                    syntax: { js: [], py: [] },
                },
                hamsterslite_set_serial_rate_to: {
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
                        type: 'hamsterslite_set_serial_rate_to',
                    },
                    paramsKeyMap: {
                        BAUD: 0,
                    },
                    class: 'hamsterslite_port',
                    isNotFor: ['HamsterSLite'],
                    func(sprite, script) {
                        return activeHamster().setSerialRate(script);
                    },
                    syntax: { js: [], py: [] },
                },
            });
        }

        // ── 선 따라가기 속도와 방향 변화량 ──
        // 설치형 HamsterSRobot 의 setLineTracerSpeed / setLineTracerGain 을 옮겼다.
        // gain 을 "기본 값"으로 두면(-1) 속도가 바뀔 때마다 속도별 표에서 다시 고른다.
        // 숫자로 정하면 그 뒤로는 속도를 바꿔도 유지된다.
        __resetState() {
            // 시리얼 대기는 정지가 푼다(lite 에서는 취소와 정지가 대기를 푼다). 정지 패킷이 나가기
            // 전에 블록 쪽 상태를 비운다.
            this.__resetSerialBlocks();
            super.__resetState();
            this.lineTracerUserSpeed = 5;
            this.lineTracerUserGain = -1;
        }

        // ── 시리얼 (쓰기, 읽기, 통신 속도, 값 블록의 시리얼 입력) ──
        // 설치형은 상태가 두 곳에 있다. entry-hw hamster_s.js(프로토콜: 프레임 id, 포트 모드 확인, 송신 순서)와
        // 설치형 HamsterSRobot(블록: 큐, 콜백, 구분자, 받은 글자). 정지는 블록 쪽만, 연결은 프로토콜 쪽만
        // 초기화한다. 둘을 합치지 않고 그대로 나눠 둔다.
        __resetSerialProtocol() {
            this.serialHw = {
                eventSerialId: -1, // 받은 시리얼 프레임 id 기준. 연결 후 첫 프레임은 기준만 잡는다
                commandSerialId: 0, // 보낸 시리얼 프레임 id (4비트)
                serialWritten: false, // 보낼 조각이 있다
                writeSerial: undefined, // 보낼 조각 [길이, 바이트 x18]
                portAckId: -1, // 포트 모드 변경 확인 비트의 기준
                portSerial: false, // 로봇이 시리얼 모드로 바뀌었다고 확인했다
                sendId: 0,
                sendPrevId: 0,
                packetSent: 0, // 1 = 모터 패킷, 3 = 시리얼 패킷. 시리얼을 연달아 보내지 않는다
                readSerial: new Array(19), // 받은 조각 [길이, 바이트 x18]
                readSerialId: 0,
                serialState: 0, // 1 = 직전 시리얼 조각을 보냈다(다음 조각을 보내도 된다)
                serialStateId: 0,
            };
        }

        __resetSerialBlocks() {
            if (this.writeSerialCallbacks) {
                this.__fireSerialCallbacks('writeSerialCallbacks');
                this.__fireSerialCallbacks('readSerialCallbacks');
            }
            this.serialReadId = -1; // entry-hw 쪽 readSerialId 를 마지막으로 본 값
            this.serialStateSeenId = -1;
            this.serialDelimiter = 0;
            this.serialRate = 176; // 9600
            this.writeSerialCallbacks = [];
            this.readSerialCallbacks = [];
            this.serialInput = '';
            if (!this.writeQueue) {
                this.writeQueue = new SerialWriteQueue(64);
                this.readQueue = new SerialReadQueue(64);
            }
            this.writeQueue.reset();
            this.readQueue.reset();
            if (!this.serialHw) {
                this.__resetSerialProtocol();
            }
        }

        __fireSerialCallbacks(key) {
            const callbacks = this[key];
            this[key] = [];
            callbacks.forEach((cb) => cb());
        }

        async initialHandshake() {
            this.__resetSerialProtocol(); // entry-hw reset() 과 같다
            return super.initialHandshake();
        }

        // 조각 하나를 보낼 준비. 설치형은 writeSerialId 로 entry-hw 에 "새 조각"을 알리는데, 정지 뒤 id 가
        // 1 로 돌아가 직전 id 와 겹치면 entry-hw 가 새 조각으로 보지 않아 쓰기 블록이 영원히 기다린다.
        // lite 는 조각마다 바로 보낼 것으로 표시한다.
        __setSerial(arr) {
            this.serialHw.writeSerial = arr.slice(0, 19);
            this.serialHw.serialWritten = true;
        }

        // 받은 시리얼 프레임: [0] 2, [1] id, [2,4) 길이, 그 뒤 바이트. entry-hw hamster_s.js 와 같다.
        __handleSerialFrame(data) {
            const hw = this.serialHw;
            const id = parseInt(data.slice(1, 2), 16);
            if (id != hw.eventSerialId) {
                if (hw.eventSerialId != -1) {
                    let len = parseInt(data.slice(2, 4), 16);
                    if (len > 18) {
                        len = 18;
                    }
                    const readSerial = hw.readSerial;
                    readSerial[0] = len;
                    for (let i = 1, j = 4; i <= len; ++i, j += 2) {
                        readSerial[i] = parseInt(data.slice(j, j + 2), 16);
                    }
                    for (let i = len + 1; i <= 18; ++i) {
                        readSerial[i] = 0;
                    }
                    hw.readSerialId = (hw.readSerialId % 255) + 1;
                }
                hw.eventSerialId = id;
            }
            return true;
        }

        // 일반 프레임의 포트 모드 확인 비트(value2 >> 5). 바뀌면 로봇이 모드를 바꾼 것이다.
        __handlePortAck(value2) {
            const hw = this.serialHw;
            const id = (value2 >> 5) & 0x01;
            if (id != hw.portAckId) {
                if (hw.portAckId != -1) {
                    hw.portSerial = this.motoring.ioModeA > 10;
                }
                hw.portAckId = id;
            }
        }

        __serialPacket() {
            const hw = this.serialHw;
            if (!(hw.portSerial && hw.serialWritten && hw.packetSent != 3)) {
                return null;
            }
            hw.serialWritten = false;
            hw.packetSent = 3;
            hw.sendId = (hw.sendId % 255) + 1;
            const writeSerial = hw.writeSerial;
            if (writeSerial) {
                let len = writeSerial[0];
                if (len > 0) {
                    if (len > 18) {
                        len = 18;
                    }
                    hw.commandSerialId = (hw.commandSerialId % 15) + 1;
                    let str = this.toHex(0x20 | (hw.commandSerialId & 0x0f));
                    str += this.toHex(len);
                    for (let i = 1; i <= len; ++i) {
                        str += this.toHex(writeSerial[i]);
                    }
                    for (let i = len + 1; i <= 18; ++i) {
                        str += '00';
                    }
                    return `${str}-${this.address}\r`;
                }
            }
            // entry-hw 도 여기서 모터 패킷으로 넘어간다(보낼 바이트가 없는 조각)
            return null;
        }

        __onMotorPacketSent() {
            this.serialHw.packetSent = 1;
        }

        handleSensory() {
            super.handleSensory();
            const hw = this.serialHw;
            // entry-hw handleLocalData 끝: 직전 송신이 시리얼 조각이었으면 "보냈다"를 알린다
            if (hw.sendId != hw.sendPrevId) {
                hw.sendPrevId = hw.sendId;
                hw.serialState = 1;
                hw.serialStateId = (hw.serialStateId % 255) + 1;
            }
            // 설치형 HamsterSRobot.handleSensory 의 시리얼 부분
            if (hw.readSerialId != this.serialReadId) {
                if (this.serialReadId >= 0) {
                    this.readQueue.push(hw.readSerial, 0);
                }
                this.serialReadId = hw.readSerialId;
            }
            if (hw.serialStateId != this.serialStateSeenId) {
                this.serialStateSeenId = hw.serialStateId;
                if (hw.serialState == 1) {
                    const next = this.writeQueue.pop();
                    if (next) {
                        this.__setSerial(next);
                    } else {
                        this.__fireSerialCallbacks('writeSerialCallbacks');
                    }
                }
            }
            if (this.readSerialCallbacks.length > 0) {
                const text = this.readQueue.pop(this.serialDelimiter);
                if (text) {
                    this.serialInput = text;
                    this.__fireSerialCallbacks('readSerialCallbacks');
                }
            }
            hw.serialState = 0; // entry-hw requestRemoteData 가 보낸 뒤 되돌린다
        }

        writeSerial(script) {
            if (!script.isStart) {
                script.isStart = true;
                script.isWriting = true;
                this.__cancelIo();
                const mode = script.getField('MODE');
                const text = script.getValue('STRING');
                this.motoring.ioModeA = this.serialRate;
                this.motoring.ioModeB = this.serialRate;
                const queue = this.writeQueue;
                queue.push(text, mode != 'STRING');
                const data = queue.pop();
                if (data) {
                    this.writeSerialCallbacks.push(() => {
                        script.isWriting = false;
                    });
                    this.__setSerial(data);
                }
                return script;
            } else if (script.isWriting) {
                return script;
            }
            delete script.isStart;
            delete script.isWriting;
            Entry.engine.isContinue = false;
            return script.callReturn();
        }

        readSerialUntil(script) {
            if (!script.isStart) {
                script.isStart = true;
                script.isReading = true;
                this.__cancelIo();
                const delimiter = SERIAL_DELIMITERS[script.getField('DELIMITER')];
                this.motoring.ioModeA = this.serialRate;
                this.motoring.ioModeB = this.serialRate;
                if (typeof delimiter == 'number') {
                    this.serialDelimiter = delimiter;
                    this.readSerialCallbacks.push(() => {
                        script.isReading = false;
                    });
                }
                return script;
            } else if (script.isReading) {
                return script;
            }
            delete script.isStart;
            delete script.isReading;
            Entry.engine.isContinue = false;
            return script.callReturn();
        }

        setSerialRate(script) {
            this.__cancelIo();
            const baud = SERIAL_BAUDS[script.getField('BAUD')];
            if (baud && baud > 0) {
                this.serialRate = baud;
                this.motoring.ioModeA = baud;
                this.motoring.ioModeB = baud;
            }
            return script.callReturn();
        }

        getValue(script) {
            if (script.getField('DEVICE') == 'SERIAL_INPUT') {
                return this.serialInput;
            }
            return super.getValue(script);
        }

        __lineTracerGain(m) {
            return m.lineTracerGain;
        }

        __wheelScale() {
            return 1;
        }

        __defaultConfigBandWidth() {
            return 0;
        }

        __clampedMotoring() {
            return clampFields(this.motoring, S_CLAMPS);
        }

        // 손 찾음 판정 경계. 설치형 HamsterSRobot 은 50, 구형 HamsterRobot 은 40 이다.
        // 상위(구형 항목)는 햄스터S 로봇을 받아도 설치형 "햄스터" 항목과 같게 40 을 유지해야 한다.
        checkHandFound() {
            const sensory = this.sensory;
            return sensory.handFound === undefined
                ? sensory.leftProximity > 50 || sensory.rightProximity > 50
                : sensory.handFound;
        }

        setLineTracerSpeed(script) {
            const speed = parseInt(script.getField('SPEED'), 10);
            let gain = this.lineTracerUserGain;
            if (gain < 0) {
                gain = LINE_TRACER_GAINS[speed];
            }
            // 표에 없는 속도(1..8 밖)는 설치형처럼 받지 않는다.
            if (speed && gain && speed > 0 && gain > 0) {
                this.lineTracerUserSpeed = speed;
                this.motoring.lineTracerSpeed = speed;
                this.motoring.lineTracerGain = gain;
            }
            return script.callReturn();
        }

        setLineTracerGain(script) {
            const gain = parseInt(script.getField('GAIN'), 10);
            if (gain && gain > 0) {
                this.lineTracerUserGain = gain;
                this.motoring.lineTracerGain = gain;
            } else {
                // DEFAULT
                this.lineTracerUserGain = -1;
                const auto = LINE_TRACER_GAINS[this.lineTracerUserSpeed];
                if (auto && auto > 0) {
                    this.motoring.lineTracerGain = auto;
                }
            }
            return script.callReturn();
        }

        // 상위는 기울기와 배터리만 안다. 두드림과 자유낙하는 여기서 답한다.
        checkBoolean(script) {
            const dev = script.getField('DEVICE');
            if (dev === 'TAP') {
                return this.tap;
            }
            if (dev === 'FREE_FALL') {
                return this.freeFall;
            }
            return super.checkBoolean(script);
        }

        // ── 단위 이동 (cm / 도 / 초 / 펄스) ──
        // 완료 대기는 새 키를 만들지 않고 기존 wheelDone 을 그대로 쓴다. 바퀴를 건드리는
        // 메서드가 모두 이미 __cancelWheel() 을 부르므로 선점이 따로 배선 없이 처리된다.
        // 새 키를 만들면 그 메서드들을 전부 다시 배선해야 하고, 빠뜨린 한 곳이 영구 대기가 된다.
        __cancelWheel() {
            // 상위가 __resolvePending 을 부르기 전에 모션 상태를 먼저 비운다.
            // 순서를 뒤집으면 콜백 안에서 새 이동을 거는 경우 방금 비운 값이 다시 지워진다.
            this.__removeMotionTimeout();
            this.motion.type = 0;
            this.motion.written = false;
            this.wheel.event = 0;
            this.wheel.count = 0;
            this.motoring.motionType = 0;
            this.motoring.motionValue = 0;
            this.__setPulse(0);
            return super.__cancelWheel();
        }

        __setMotion(type, unit, speed, value, radius) {
            const m = this.motoring;
            m.motionType = type;
            m.motionUnit = unit;
            m.motionSpeed = speed;
            m.motionValue = value;
            m.motionRadius = radius;
            this.motion.written = true;
        }

        __setPulse(pulse) {
            this.motoring.pulse = pulse;
            this.wheel.written = true;
        }

        __motionUnit(type, unit, value, callback) {
            this.__cancelBoard();
            this.__cancelWheel();
            this.__cancelLineTracer();

            this.motoring.leftWheel = 0;
            this.motoring.rightWheel = 0;
            this.__setPulse(0);

            const v = parseFloat(value);
            if (v && v > 0) {
                this.__setMotion(type, unit, 0, v, 0);
                this.wheelDone = callback; // 취소되면 __cancelWheel 이 대신 알린다
                this.__setLineTracerMode(0);
            } else {
                this.__setMotion(0, 0, 0, 0, 0);
                this.__setLineTracerMode(0);
                callback();
            }
        }

        // 선회용. 반지름이 숫자가 아니거나 음수면 걸지 않고 바로 끝낸다(설치형 __motionUnitRadius).
        __motionUnitRadius(type, unit, value, radius, callback) {
            this.__cancelBoard();
            this.__cancelWheel();
            this.__cancelLineTracer();

            this.motoring.leftWheel = 0;
            this.motoring.rightWheel = 0;
            this.__setPulse(0);

            const v = parseFloat(value);
            const r = parseFloat(radius);
            if (v && v > 0 && typeof r == 'number' && r >= 0) {
                this.__setMotion(type, unit, 0, v, r);
                this.wheelDone = callback;
                this.__setLineTracerMode(0);
            } else {
                this.__setMotion(0, 0, 0, 0, 0);
                this.__setLineTracerMode(0);
                callback();
            }
        }

        // 다섯 블록이 같은 폴링 골격을 쓴다. 첫 호출에서 이동을 걸고, 끝날 때까지 script 를
        // 돌려주다가, 완료되면 다음 블록으로 넘긴다. withRadius 면 RADIUS 를 함께 넘긴다.
        __unitMoveBlock(script, pickType, withRadius) {
            if (!script.isStart) {
                script.isStart = true;
                script.isMoving = true;
                const value = script.getNumberValue('VALUE');
                const unit = MOTION_UNITS[script.getField('UNIT')];
                // 음수는 방향을 뒤집고 크기만 넘긴다.
                const type = pickType(script, value < 0);
                const size = value < 0 ? -value : value;
                const done = () => {
                    script.isMoving = false;
                };
                if (withRadius) {
                    const radius = script.getNumberValue('RADIUS');
                    this.__motionUnitRadius(type, unit, size, radius, done);
                } else {
                    this.__motionUnit(type, unit, size, done);
                }
                return script;
            } else if (script.isMoving) {
                return script;
            }
            delete script.isStart;
            delete script.isMoving;
            Entry.engine.isContinue = false;
            return script.callReturn();
        }

        moveForwardUnit(script) {
            return this.__unitMoveBlock(script, (_s, neg) => (neg ? 2 : 1));
        }

        moveBackwardUnit(script) {
            return this.__unitMoveBlock(script, (_s, neg) => (neg ? 1 : 2));
        }

        turnUnit(script) {
            return this.__unitMoveBlock(script, (s, neg) => {
                const left = s.getField('DIRECTION') == 'LEFT';
                // 왼쪽=3, 오른쪽=4. 음수면 반대로 돈다.
                return left === !neg ? 3 : 4;
            });
        }

        // 한 점을 중심으로 돌기. 타입 번호는 설치형 pivotUnit 과 같다.
        // 각 쌍의 앞 번호가 "앞쪽 방향", 뒤 번호가 "뒤쪽 방향"이고 음수면 서로 바뀐다.
        pivotUnit(script) {
            return this.__unitMoveBlock(script, (s, neg) => {
                const pair = { LEFT_PEN: 13, RIGHT_PEN: 15, LEFT_WHEEL: 5 }[s.getField('PART')];
                const base = pair || 7; // 그 밖(RIGHT_WHEEL)은 7
                const forward = s.getField('TOWARD') == 'FORWARD';
                return forward === !neg ? base : base + 1;
            });
        }

        // 반지름을 두고 돌기. 타입 번호는 설치형 swingUnit 과 같다.
        //   왼쪽 펜: 왼쪽 17, 오른쪽 19 / 오른쪽 펜: 왼쪽 21, 오른쪽 23 / 로봇: 왼쪽 9, 오른쪽 11
        swingUnit(script) {
            return this.__unitMoveBlock(
                script,
                (s, neg) => {
                    const left = s.getField('DIRECTION') == 'LEFT';
                    const part = s.getField('PART');
                    let base;
                    if (part == 'LEFT_PEN') {
                        base = left ? 17 : 19;
                    } else if (part == 'RIGHT_PEN') {
                        base = left ? 21 : 23;
                    } else {
                        base = left ? 9 : 11;
                    }
                    const forward = s.getField('TOWARD') == 'FORWARD';
                    return forward === !neg ? base : base + 1;
                },
                true
            );
        }

        // ── 사운드 ──
        // 이름 -> 사운드 번호. 설치형 HamsterSRobot.__SOUNDS 와 같은 표다.
        get __SOUNDS() {
            return {
                BEEP: 1,
                RANDOM_BEEP: 2,
                NOISE: 10,
                SIREN: 3,
                ENGINE: 4,
                CHOP: 11,
                ROBOT: 5,
                DIBIDIBIDIP: 8,
                GOOD_JOB: 9,
                HAPPY: 12,
                ANGRY: 13,
                SAD: 14,
                SLEEP: 15,
                MARCH: 6,
                BIRTHDAY: 7,
            };
        }

        // 버저와 음을 세우기 전에 사운드를 끈다. 패킷에서 사운드가 그 둘을 조용히 밀어내므로,
        // 끄지 않으면 사운드 재생 중에 건 버저와 음이 아무 소리도 내지 않는다(오류도 없다).
        __silenceSound() {
            this.__cancelSound();
            this.sound.written = true; // 정지(sndid 0)를 실제로 한 번 내보낸다
        }

        playSound(script) {
            this.__cancelNote();
            this.__cancelSound();
            const sound = this.__SOUNDS[script.getField('SOUND')];
            const count = parseInt(script.getNumberValue('COUNT'), 10);
            this.motoring.buzzer = 0;
            this.motoring.note = 0;
            if (sound && count) {
                this.__runSound(sound, count);
            } else {
                this.__runSound(0);
            }
            return script.callReturn();
        }

        playSoundUntil(script) {
            if (!script.isStart) {
                script.isStart = true;
                script.isPlaying = true;
                this.__cancelNote();
                this.__cancelSound();
                const sound = this.__SOUNDS[script.getField('SOUND')];
                const count = parseInt(script.getNumberValue('COUNT'), 10);
                this.motoring.buzzer = 0;
                this.motoring.note = 0;
                if (sound && count) {
                    this.__runSound(sound, count);
                    // 완료는 __handleSoundState 가, 취소는 __cancelSound 가 푼다. 정확히 한 번만.
                    this.soundDone = () => {
                        script.isPlaying = false;
                    };
                } else {
                    this.__runSound(0);
                    script.isPlaying = false;
                }
                return script;
            } else if (script.isPlaying) {
                return script;
            } else {
                delete script.isStart;
                delete script.isPlaying;
                Entry.engine.isContinue = false;
                return script.callReturn();
            }
        }

        // 상위는 버저만 끈다. 햄스터S 에서는 사운드와 버저가 다른 필드라 사운드도 여기서 끈다.
        clearSound(script) {
            this.__cancelNote();
            this.__cancelSound();
            this.motoring.buzzer = 0;
            this.motoring.note = 0;
            this.__runSound(0);
            return script.callReturn();
        }

        // ── 버저와 음 선점 ──
        // 아래 여섯은 상위 구현이 사운드를 모른다. 패킷 우선순위 때문에 사운드를 먼저 꺼야 한다.
        setBuzzer(script) {
            this.__silenceSound();
            return super.setBuzzer(script);
        }
        changeBuzzer(script) {
            this.__silenceSound();
            return super.changeBuzzer(script);
        }
        clearBuzzer(script) {
            this.__silenceSound();
            return super.clearBuzzer(script);
        }
        playNote(script) {
            this.__silenceSound();
            return super.playNote(script);
        }
        // 아래 둘은 완료까지 매 프레임 재호출되는 폴링 블록이다. 시작 분기에서만 꺼야 한다.
        // 매번 끄면 재진입 틱이 그 사이 시작된 남의 사운드를 끄고 그 대기까지 풀어 버린다
        // (다른 스크립트의 play_sound_times_until_done 이 쉼표 한 틱에 끊긴다).
        // 설치형도 !script.isStart 안에서만 취소한다(block_robomation.js 의 playNoteBeat, restBeat).
        playNoteBeat(script) {
            if (!script.isStart) {
                this.__silenceSound();
            }
            return super.playNoteBeat(script);
        }
        restBeat(script) {
            if (!script.isStart) {
                this.__silenceSound();
            }
            return super.restBeat(script);
        }
        // 햄스터S 항목의 삐 소리는 설치형 HamsterSRobot.beep 과 같이 버저가 아니라 사운드 1(BEEP)을
        // 한 번 재생한다. 햄스터S 팔레트에는 이 블록이 없고, 020E01 로 저장된 기존 작품의
        // hamsterlite_beep 만 여기로 온다. 취소는 시작 분기에서만 한다. 폴링 틱마다 끄면 그 사이
        // 다른 스크립트가 시작한 소리와 그 대기까지 끊는다.
        beep(script) {
            if (!script.isStart) {
                script.isStart = true;
                script.isPlaying = true;
                this.__cancelNote();
                this.__cancelSound();
                this.motoring.buzzer = 0;
                this.motoring.note = 0;
                this.__runSound(1, 1);
                this.soundDone = () => {
                    script.isPlaying = false;
                };
                return script;
            } else if (script.isPlaying) {
                return script;
            }
            delete script.isStart;
            delete script.isPlaying;
            Entry.engine.isContinue = false;
            return script.callReturn();
        }

        setLed(script) {
            const rgb = this.__RGB_COLORS[script.getField('COLOR')];
            if (rgb) {
                this.__applyRgb(script.getField('LED'), rgb[0], rgb[1], rgb[2]);
            }
            return script.callReturn();
        }

        clearLed(script) {
            this.__applyRgb(script.getField('LED'), 0, 0, 0);
            return script.callReturn();
        }

        pickLed(script) {
            const color = String(script.getField('COLOR'));
            const r = parseInt(color.slice(1, 3), 16);
            const g = parseInt(color.slice(3, 5), 16);
            const b = parseInt(color.slice(5, 7), 16);
            this.__applyRgb(script.getField('LED'), r, g, b);
            return script.callReturn();
        }

        setRgb(script) {
            this.__applyRgb(
                script.getField('LED'),
                parseInt(script.getNumberValue('RED'), 10),
                parseInt(script.getNumberValue('GREEN'), 10),
                parseInt(script.getNumberValue('BLUE'), 10)
            );
            return script.callReturn();
        }

        // 누적은 원값 위에 그대로 더한다. 자르는 일은 송신 때만 한다(설치형 block_robomation.js 의 changeRgb
        // 와 같은 모델). 더하기 전에 자르면 200 -> +100 -> -50 이 250 이 아니라 205 가 되어
        // 설치형과 어긋난다.
        changeRgb(script) {
            const led = script.getField('LED');
            const m = this.motoring;
            const dr = parseInt(script.getNumberValue('RED'), 10) || 0;
            const dg = parseInt(script.getNumberValue('GREEN'), 10) || 0;
            const db = parseInt(script.getNumberValue('BLUE'), 10) || 0;
            if (led !== 'RIGHT') {
                m.leftRed += dr;
                m.leftGreen += dg;
                m.leftBlue += db;
            }
            if (led !== 'LEFT') {
                m.rightRed += dr;
                m.rightGreen += dg;
                m.rightBlue += db;
            }
            return script.callReturn();
        }

        // 햄스터S 사진은 구형과 좌우가 반대다(바퀴가 왼쪽). 상위 좌표를 그대로 물려받으면
        // 점 9개가 전부 어긋나므로 위치만 항목별로 갈아끼운다. 이름과 종류는 상위 것을 그대로 쓴다.
        // 게터 형태를 유지해야 상위와 같은 신선도를 갖는다(코어가 이 객체에 쓰는 값은 버려진다).
        //
        // 출처: 아래 7개는 설치형 엔트리가 같은 사진(hw/hamster_s.png)에 이미 쓰고 있는 값을
        // 그대로 가져왔다(hardware/block_hamster_s.js). 설치형에 없는 두 개(leftLed, rightLed)는
        // 설치형이 그 7개에 적용한 것과 같은 규칙으로 옮겼다. x를 256에서 빼고 왼쪽과 오른쪽
        // 이름을 맞바꾼다(거울상이라 반대편 부품이 그 자리에 온다).
        get monitorTemplate() {
            const template = super.monitorTemplate;
            const positions = {
                leftProximity: { x: 246, y: 110 },
                rightProximity: { x: 128, y: 156 },
                leftFloor: { x: 243, y: 186 },
                rightFloor: { x: 150, y: 236 },
                light: { x: 195, y: 190 },
                leftWheel: { x: 190, y: 30 },
                rightWheel: { x: 40, y: 115 },
                leftLed: { x: 232, y: 168 },
                rightLed: { x: 169, y: 210 },
            };
            Object.keys(positions).forEach((key) => {
                if (template.ports[key]) {
                    template.ports[key].pos = positions[key];
                }
            });
            return template;
        }

        acceptsIdentity(identity) {
            return !!identity && identity.isHamsterS === true;
        }

        // 정상 기종의 정체를 보면 거부 상태를 푼다. 같은 로봇이 되돌아오는 경우까지
        // 덮으려면 변경 감지 분기가 아니라 이 훅에서 처리해야 한다:
        // setRobotIdentity에 걸어두면 "바뀌지 않은 정체"에서는 호출되지 않아 영구히 잠긴다.
        onAcceptedIdentity() {
            this.foreignAttached = false;
            this.rejectedAddress = undefined;
        }

        onRejectedAtConnect() {
            const t = this.__messages();
            Entry.toast.alert(t.rejectTitle, t.rejectDesc, true);
        }

        // 세션 중 다른 기종이 붙었다. 거부한 주소를 기억해 같은 로봇에 대해서는 한 번만 반응한다.
        // 기억하지 않으면 setRobotIdentity가 갱신되지 않으므로 프레임마다 재판정되고,
        // 매번 정지 패킷을 써서 초당 수십 번 쓰기가 발생한다(수렴하지 않는다).
        onForeignRobot(identity) {
            if (this.rejectedAddress === identity.address) {
                return;
            }
            this.rejectedAddress = identity.address; // 안내 중복 방지(주소별 1회)
            this.foreignAttached = true; // 프로브 억제 스위치. 정상 정체를 보면 풀린다
            this.setZero();
            const t = this.__messages();
            Entry.toast.alert(t.foreignTitle, t.foreignDesc, true);
        }

        // 거부 상태에서는 모터/센서 요청 패킷을 아예 만들지 않는다. 커넥터는 falsy면 쓰기를
        // 건너뛰므로(webSerialConnector의 두 쓰기 지점 모두 확인) 실제로 한 바이트도 나가지 않는다.
        // 이렇게 해야 "이 로봇을 제어할 수 없다"는 안내가 실제와 맞는다. 잠그지 않으면
        // 실행 중인 작품이 다음 프레임에 모터값을 다시 채워 계속 쓴다.
        requestLocalData() {
            if (this.foreignAttached) {
                return undefined;
            }
            return super.requestLocalData();
        }

        shouldParseSensory() {
            return !this.foreignAttached;
        }

        // 거부 상태에서는 FF 프로브를 보내지 않는다. 프로브가 정체 라인을 다시 끌어와
        // 같은 처리를 반복시키는 것을 막는다.
        reportInvalidFrame() {
            // 억제 기준은 중복 방지 기억이 아니라 "지금 외부 로봇이 붙어 있는가"다.
            // 기억을 기준으로 삼으면, 원래 로봇이 되돌아와도 억제가 풀리지 않아 탐지가 영구히 죽는다.
            if (this.foreignAttached) {
                return;
            }
            super.reportInvalidFrame();
        }
    }

    Entry.HamsterSLite = new HamsterSLite();
})();

// 배열 순서에 두 가지가 걸려 있다. 바꾸기 전에 둘 다 확인할 것.
//
// 1) 번호가 둘 저장된 작품을 열 때 어느 항목이 선택되는가.
//    utils.js는 저장된 번호를 모두 순회하며 모듈을 추가하고(break 없음) 마지막이 이긴다.
//    HARDWARE_LITE_LIST의 열거 순서는 숫자처럼 생긴 키가 먼저 오름차순으로 나오고
//    그 다음 문자열 키가 삽입 순서대로 나온다. '020401'과 '020E01'은 앞자리 0 때문에
//    둘 다 문자열 키라서 서로 간에는 삽입 순서가 유지된다. 따라서 햄스터S를 앞에 두면
//    기존 항목이 마지막에 들어가 이긴다. 두 기종을 다 받는 쪽이 이겨야 안전하다.
//
// 2) 블록 정의 병합에서 어느 쪽이 이기는가.
//    blocks/index.js가 모듈마다 getBlocks()를 Object.assign으로 합치므로 뒤쪽이 덮는다.
//    지금은 두 인스턴스의 정의가 같아서 무해하지만, 항목별로 다른 블록을 주는 날에는
//    이 순서가 어느 정의가 살아남는지를 결정한다.
module.exports = [Entry.HamsterSLite, Entry.HamsterLite];
