'use strict';

(function () {
    const HANDSHAKE_TIMEOUT_MS = 5000; // FF, B0, 70 핸드셰이크 전체 상한
    const B0_RESEND_MS = 200; // 초기 핸드셰이크 B0 재송신 간격
    const REALIGN_TIMEOUT_MS = 5000; // 세션 중 재보정 상한
    const START_GRACE_MS = 1000; // 20펄스 이상 이동에서 busy 비트를 못 본 채 완료로 넘기기까지의 여유

    // 출처 entry-hw/app/modules/turtle.js. 측정값이라 유도하지 않는다.
    const WHEEL_SCALE = 10.68;
    const CM_TO_PULSE = 106.8;
    const DEG_BASE = 1570;
    const ALIGN_BASE_DISTANCE = 2.3125;
    const DEFAULT_SPEED = 50;
    // 출처 entry-hw turtle.js switch(motoring.sound)
    const SOUND_TO_CODE = {
        0: 0x00,
        1: 0x01,
        2: 0x05,
        3: 0x10,
        4: 0x20,
        5: 0x30,
        6: 0x40,
        7: 0x41,
        8: 0x42,
        9: 0x43,
    };
    // 출처 entry-hw turtle.js switch(motoring.lineTracerMode)
    const LINE_MODE_TO_CODE = {
        0: 0x00,
        10: 0x08,
        11: 0x09,
        13: 0x0b,
        15: 0x0d,
        17: 0x0f,
        20: 0x10,
        30: 0x18,
        40: 0x20,
        50: 0x28,
        61: 0x31,
        62: 0x32,
        63: 0x33,
        64: 0x34,
        65: 0x35,
        66: 0x36,
        67: 0x37,
        71: 0x39,
        73: 0x3b,
        75: 0x3d,
        77: 0x3f,
    };

    const MAX_TIMER_MS = 2147483647; // setTimeout 상한. 이를 넘거나 Infinity 인 지연은 상한으로 접는다.
    const UNITS = { CM: 1, DEG: 1, SEC: 2, PULSE: 3 }; // block_robomation.js TurtleRobot 의 __UNITS
    const RGB_COLORS = {
        RED: [255, 0, 0],
        ORANGE: [255, 63, 0],
        YELLOW: [255, 255, 0],
        GREEN: [0, 255, 0],
        CYAN: [0, 255, 255],
        BLUE: [0, 0, 255],
        VIOLET: [63, 0, 255],
        MAGENTA: [255, 0, 255],
        WHITE: [255, 255, 255],
    }; // block_robomation.js TurtleRobot 의 __RGB_COLORS

    class TurtleLite {
        constructor() {
            this.id = '020901';
            this.url = 'http://www.robomation.net';
            this.imageName = 'turtlelite.png';
            this.name = 'TurtleLite';
            this.title = { ko: '거북이', en: 'Turtle', jp: 'タートル', vn: 'Turtle' }; // metadata 주입 실패 시 코어가 title.ko 를 읽는다
            this.delimeter = '\r';
            this.handshakeTimeoutMs = HANDSHAKE_TIMEOUT_MS;
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
            this.state = 'idle';
            this.__forceFrame = false;
            this.address = undefined;
            this.alignment = {
                spinRight: 0,
                pivotRight: 0,
                spinLeft: 0,
                pivotLeft: 0,
                distance: ALIGN_BASE_DISTANCE,
                valid: false,
            };
            // 블록이 만지는 명령(설치형 sendQueue 역할). 설치형은 블록마다 setMotoring 으로 시드하지만 lite 는 아무도 안 부르므로 여기서.
            this.motoring = this.__defaultMotoring();
            // 장치로 나가는 클램프 사본(설치형 entry-hw 쪽 motoring 역할). 블록 누적은 motoring 에, 송신은 out 에서.
            this.out = this.__defaultMotoring();
            // 래칭 비교 기준(entry-hw handleRemoteData 가 비교하던 자기 motoring.*Id).
            this.shadow = { pulseId: 0, soundId: 0, lineTracerModeId: 0, motionId: 0 };
            // entry-hw turtle.js 프로토콜 상태
            this.wheel = {
                id: 0,
                pulse: 0,
                pulsePrev: -1,
                event: 0,
                state: 0,
                count: 0,
                written: false,
                startedAt: 0,
                expectedMs: 0,
            };
            this.sound = { flag: 0, event: 0, state: 0, count: 0, written: false };
            this.lineTracer = { flag: 0, event: 0, state: 0, count: 0, written: false };
            this.motion = { type: 0, unit: 0, speed: 0, value: 0, radius: 0, written: false };
            this.timerId = undefined; // entry-hw 쪽 초 단위 이동 타이머
            this.invalidFrameCount = 0;
            this.mismatchCount = 0;
            this.sensory = this.__defaultSensory(); // entry-hw 쪽 센서 객체(발행 대상)
            this.button = { clickId: -1, longPressId: -1 };
            this.event = { button: 0, colorNumber: -1, colorPattern: -1, pulseCount: 0 };
            this.acceleration = {
                x: new Array(10).fill(0),
                y: new Array(10).fill(0),
                z: new Array(10).fill(0),
                index: 0,
                count: 0,
                sumX: 0,
                sumY: 0,
                sumZ: 0,
            };
            // entryjs TurtleRobot 쪽 상태(래치 id, 이벤트 플래그, 카운터, 타이머)
            this.timeouts = [];
            this.robot = this.__defaultRobot();
            this.blockMenuBlocks = [
                'turtlelite_touching_color',
                'turtlelite_is_color_pattern',
                'turtlelite_button_state',
                'turtlelite_boolean',
                'turtlelite_value',
                'turtlelite_move_forward_unit',
                'turtlelite_move_backward_unit',
                'turtlelite_turn_unit_in_place',
                'turtlelite_pivot_around_wheel_unit_in_direction',
                'turtlelite_turn_unit_with_radius_in_direction',
                'turtlelite_change_wheels_by_left_right',
                'turtlelite_set_wheels_to_left_right',
                'turtlelite_change_wheel_by',
                'turtlelite_set_wheel_to',
                'turtlelite_follow_line',
                'turtlelite_follow_line_until',
                'turtlelite_follow_line_until_black',
                'turtlelite_cross_intersection',
                'turtlelite_turn_at_intersection',
                'turtlelite_set_following_speed_to',
                'turtlelite_stop',
                'turtlelite_set_head_led_to',
                'turtlelite_pick_head_led',
                'turtlelite_change_head_led_by_rgb',
                'turtlelite_set_head_led_to_rgb',
                'turtlelite_clear_head_led',
                'turtlelite_play_sound_times',
                'turtlelite_play_sound_times_until_done',
                'turtlelite_change_buzzer_by',
                'turtlelite_set_buzzer_to',
                'turtlelite_clear_sound',
                'turtlelite_play_note',
                'turtlelite_play_note_for_beats',
                'turtlelite_rest_for_beats',
                'turtlelite_change_tempo_by',
                'turtlelite_set_tempo_to',
            ];
        }
        __now() {
            return Date.now();
        }

        __defaultMotoring() {
            // 설치형 TurtleRobot 의 __PORT_MAP
            return {
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
            };
        }
        __defaultSensory() {
            // turtle.js Module().sensory 키 집합. tilt 없음.
            return {
                signalStrength: 0,
                colorRed: 0,
                colorGreen: 0,
                colorBlue: 0,
                colorClear: 0,
                colorNumber: -1,
                colorPattern: -1,
                floor: 0,
                button: 0,
                clicked: 0,
                doubleClicked: 0,
                longPressed: 0,
                colorPatternId: 0,
                clickedId: 0,
                doubleClickedId: 0,
                longPressedId: 0,
                pulseCount: 0,
                accelerationX: 0,
                accelerationY: 0,
                accelerationZ: 0,
                temperature: 0,
                batteryState: 2,
                wheelState: -1,
                wheelStateId: 0,
                soundState: -1,
                soundStateId: 0,
                lineTracerState: 0,
                lineTracerStateId: 0,
            };
        }
        __defaultRobot() {
            // 설치형 TurtleRobot 생성자 중 sensory 를 뺀 나머지
            return {
                pulseId: 0,
                soundId: 0,
                lineTracerModeId: 0,
                motionId: 0,
                wheelStateId: -1,
                soundStateId: -1,
                lineTracerStateId: -1,
                clickedId: -1,
                doubleClickedId: -1,
                longPressedId: -1,
                colorPatternId: -1,
                clicked: false,
                doubleClicked: false,
                longPressed: false,
                colorPattern: -1,
                motionDone: undefined,
                lineTracerDone: undefined,
                soundDone: undefined,
                noteTimer1: undefined,
                noteTimer2: undefined,
                noteDone: undefined,
                noteBlockId: 0,
                blockId: 0,
                tempo: 60,
            };
        }

        get monitorTemplate() {
            // 햄스터 lite 모듈과 같이 게터. hardwareMonitor 가 .mode/.ports 를 직접 읽는다.
            return {
                imgPath: 'hw_lite/turtlelite.png',
                width: 480,
                height: 354,
                listPorts: {
                    colorNumber: {
                        name: Lang.Blocks.turtlelite_color_number,
                        type: 'input',
                        pos: { x: 0, y: 0 },
                    },
                    accelerationX: {
                        name: Lang.Blocks.turtlelite_acceleration_x,
                        type: 'input',
                        pos: { x: 0, y: 0 },
                    },
                    accelerationY: {
                        name: Lang.Blocks.turtlelite_acceleration_y,
                        type: 'input',
                        pos: { x: 0, y: 0 },
                    },
                    accelerationZ: {
                        name: Lang.Blocks.turtlelite_acceleration_z,
                        type: 'input',
                        pos: { x: 0, y: 0 },
                    },
                    buzzer: {
                        name: Lang.Blocks.turtlelite_buzzer,
                        type: 'output',
                        pos: { x: 0, y: 0 },
                    },
                    note: {
                        name: Lang.Blocks.turtlelite_note,
                        type: 'output',
                        pos: { x: 0, y: 0 },
                    },
                },
                ports: {
                    floor: {
                        name: Lang.Blocks.turtlelite_floor,
                        type: 'input',
                        pos: { x: 193, y: 342 },
                    },
                    button: {
                        name: Lang.Blocks.turtlelite_button,
                        type: 'input',
                        pos: { x: 290, y: 30 },
                    },
                    ledRed: {
                        name: `${Lang.Blocks.turtlelite_head_color} R`,
                        type: 'output',
                        pos: { x: 140, y: 280 },
                    },
                    ledGreen: {
                        name: `${Lang.Blocks.turtlelite_head_color} G`,
                        type: 'output',
                        pos: { x: 140, y: 280 },
                    },
                    ledBlue: {
                        name: `${Lang.Blocks.turtlelite_head_color} B`,
                        type: 'output',
                        pos: { x: 140, y: 280 },
                    },
                    leftWheel: {
                        name: Lang.Blocks.turtlelite_left_wheel,
                        type: 'output',
                        pos: { x: 363, y: 319 },
                    },
                    rightWheel: {
                        name: Lang.Blocks.turtlelite_right_wheel,
                        type: 'output',
                        pos: { x: 120, y: 86 },
                    },
                },
                mode: 'both',
            };
        }
        getMonitorPort() {
            return { ...this.sensory, ...this.out };
        }

        // 4로케일 토스트 문구. extern/lang 을 고치지 않으므로 모듈 안에 둔다(햄스터 lite 모듈의 __messages 와 같은 방식).
        __messages() {
            const t = (Lang && typeof Lang.type === 'string' && Lang.type) || 'ko';
            const M = {
                ko: {
                    foreignRobot:
                        '거북이가 아닌 로봇이 연결되었습니다. 거북이를 켜고 다시 연결해 주세요.',
                },
                en: {
                    foreignRobot:
                        'A robot other than Turtle is connected. Turn on the Turtle and reconnect.',
                },
                jp: {
                    foreignRobot:
                        'タートル以外のロボットが接続されています。タートルの電源を入れて再接続してください。',
                },
                vn: {
                    foreignRobot:
                        'Một robot không phải Turtle đã được kết nối. Hãy bật Turtle và kết nối lại.',
                },
            };
            return M[t] || M.ko;
        }

        // ── 연결 ─────────────────────────────────────────────────────────────
        parseIdentityData(line) {
            // entry-hw turtle.js checkInitialData 와 같다. 이름은 사용자가 바꿀 수 있어 뒤에서 센다.
            if (typeof line !== 'string' || line.slice(0, 2) !== 'FF') return undefined;
            const info = line.replace(/[\r\n]+$/, '').split(',');
            if (info.length < 5) return undefined;
            const model = info[info.length - 3],
                variant = info[info.length - 2],
                address = info[info.length - 1].toUpperCase();
            if (!/^[0-9A-Fa-f]{2}$/.test(variant) || !/^[0-9A-F]{12}$/.test(address))
                return undefined;
            return model === '09'
                ? { model, address, variant }
                : { model, address, variant, foreign: true };
        }
        __alignPacket(prefix, addr = this.address) {
            return prefix + '0'.repeat(34) + '4400-' + addr + '\r';
        }
        // B0 응답 -> 보정값 6개(entry-hw turtle.js parseAlignment). 길이, 주소, 유한성 검사는 lite 에서 추가했다.
        parseAlignment(line, addr = this.address) {
            if (typeof line !== 'string' || line.slice(0, 2) !== 'B0' || line.length < 14)
                return false;
            const dash = line.indexOf('-');
            if (dash < 0 || line.slice(dash + 1, dash + 13).toUpperCase() !== addr) return false;
            if (!/^[0-9A-Fa-f]{12}$/.test(line.slice(2, 14))) return false;
            const int8 = (s) => {
                const v = parseInt(s, 16);
                return v > 0x7f ? v - 0x100 : v;
            };
            const vals = [2, 4, 6, 8, 10, 12].map((i) => int8(line.slice(i, i + 2)));
            if (vals.some((v) => !Number.isFinite(v))) return false;
            const [sr, pr, sl, pl, hi, lo] = vals;
            const offset = (hi + 1) * 256 + (lo + 1);
            let distance = ALIGN_BASE_DISTANCE + offset / 10000;
            if (distance <= 0) distance = ALIGN_BASE_DISTANCE;
            this.alignment = {
                spinRight: sr + 1,
                pivotRight: pr + 1,
                spinLeft: sl + 1,
                pivotLeft: pl + 1,
                distance,
                valid: true,
            };
            return true;
        }
        __resolvePending(key) {
            // 먼저 비우고 부른다. 정상 완료도 이 함수만 거친다.
            const done = this.robot[key];
            if (done) {
                this.robot[key] = undefined;
                done();
            }
        }
        __resolveAllPending() {
            ['motionDone', 'lineTracerDone', 'soundDone', 'noteDone'].forEach((k) =>
                this.__resolvePending(k)
            );
        }
        __removeAllTimeouts() {
            this.timeouts.forEach((t) => clearTimeout(t));
            this.timeouts = [];
            if (this.timerId !== undefined) {
                clearTimeout(this.timerId);
                this.timerId = undefined;
            }
            if (this.robot.noteTimer1) {
                clearTimeout(this.robot.noteTimer1);
                this.robot.noteTimer1 = undefined;
            }
            if (this.robot.noteTimer2) {
                clearTimeout(this.robot.noteTimer2);
                this.robot.noteTimer2 = undefined;
            }
        }
        // 연결 시 초기화. 핸드셰이크 머리와 재보정 완료에서 부른다.
        __clearRealign() {
            if (this.realign && this.realign.timer) clearTimeout(this.realign.timer);
            this.realign = undefined;
        }
        __resetSession() {
            this.__clearRealign();
            this.invalidFrameCount = 0;
            this.mismatchCount = 0;
            this.__resetState();
            this.shadow = { pulseId: 0, soundId: 0, lineTracerModeId: 0, motionId: 0 };
            this.wheel = {
                id: 0,
                pulse: 0,
                pulsePrev: -1,
                event: 0,
                state: 0,
                count: 0,
                written: false,
                startedAt: 0,
                expectedMs: 0,
            };
            this.sound = { flag: 0, event: 0, state: 0, count: 0, written: false };
            this.lineTracer = { flag: 0, event: 0, state: 0, count: 0, written: false };
            this.motion = { type: 0, unit: 0, speed: 0, value: 0, radius: 0, written: false };
            this.button = { clickId: -1, longPressId: -1 };
            this.event = { button: 0, colorNumber: -1, colorPattern: -1, pulseCount: 0 };
            this.acceleration = {
                x: new Array(10).fill(0),
                y: new Array(10).fill(0),
                z: new Array(10).fill(0),
                index: 0,
                count: 0,
                sumX: 0,
                sumY: 0,
                sumZ: 0,
            };
            this.sensory = this.__defaultSensory();
            this.alignment.valid = false;
        }
        async initialHandshake() {
            this.state = 'handshaking';
            this.address = undefined;
            this.__resetSession();
            const serial = Entry.hwLite.serial;
            let stage = 0,
                timedOut = false,
                timer,
                b0Timer,
                result = 'fail';
            const timeoutPromise = new Promise((resolve) => {
                timer = setTimeout(() => {
                    timedOut = true;
                    resolve('timeout');
                }, this.handshakeTimeoutMs);
            });
            try {
                serial.sendAsciiAsBuffer('FF\r');
                while (!timedOut) {
                    const r = await Promise.race([serial.reader.read(), timeoutPromise]); // 진행 중 read 는 항상 1개
                    if (r === 'timeout' || r.done) break;
                    const line = r.value;
                    if (stage === 0) {
                        const id = this.parseIdentityData(line);
                        if (!id) {
                            if (typeof line !== 'string' || line.slice(0, 2) !== 'FF')
                                serial.sendAsciiAsBuffer('FF\r');
                            continue;
                        }
                        if (id.foreign) {
                            result = 'foreign';
                            break;
                        }
                        this.address = id.address;
                        stage = 1;
                        serial.sendAsciiAsBuffer(this.__alignPacket('B0'));
                        b0Timer = setInterval(
                            () => serial.sendAsciiAsBuffer(this.__alignPacket('B0')),
                            B0_RESEND_MS
                        );
                    } else if (stage === 1) {
                        if (!this.parseAlignment(line)) continue;
                        clearInterval(b0Timer);
                        b0Timer = undefined;
                        stage = 2;
                        serial.sendAsciiAsBuffer(this.__alignPacket('70'));
                    } else {
                        if (typeof line === 'string' && line.slice(0, 2) === 'B0') {
                            if (this.parseAlignment(line))
                                serial.sendAsciiAsBuffer(this.__alignPacket('70'));
                            continue;
                        }
                        if (typeof line === 'string' && line.length === 53 && line[0] === '1') {
                            result = 'ok';
                            break;
                        }
                    }
                }
            } catch (error) {
                console.error(error);
                result = 'fail';
            }
            clearTimeout(timer);
            if (b0Timer) clearInterval(b0Timer);
            if (result !== 'ok') {
                this.state = 'idle';
                try {
                    await serial.removeSerialPort();
                } catch (error) {
                    console.error(error);
                } // 코어는 실패 시 포트를 닫지 않으므로 여기서 닫는다
                if (result === 'foreign') this.__toastForeign();
                return false;
            }
            this.state = 'ready';
            this.__resetState(); // 핸드셰이크 중 들어온 명령 폐기
            this.__pushNow(); // 안전 프레임(written 비어 있어 wheel.id 는 0 그대로)
            return true;
        }
        __toastForeign() {
            if (Entry.toast && Entry.toast.alert)
                Entry.toast.alert(
                    Lang.Msgs.hw_connection_failed_title,
                    this.__messages().foreignRobot,
                    false
                );
        }

        // ── 송신 ─────────────────────────────────────────────────────────────
        // hex 헬퍼: entry-hw turtle.js 의 toHex, toHex2, toHex3 그대로(이름, 자릿수, 절사). 반올림하지 않는다.
        toHex(number) {
            let value = parseInt(number, 10);
            if (value < 0) value += 0x100;
            value = value.toString(16).toUpperCase();
            return value.length > 1 ? value : '0' + value;
        }
        toHex2(number) {
            let value = parseInt(number, 10);
            if (value < 0) value += 0x10000;
            value = value.toString(16).toUpperCase();
            let result = '';
            for (let i = value.length; i < 4; ++i) result += '0';
            return result + value;
        }
        toHex3(number) {
            let value = parseInt(number, 10);
            if (value < 0) value += 0x1000000;
            value = value.toString(16).toUpperCase();
            let result = '';
            for (let i = value.length; i < 6; ++i) result += '0';
            return result + value;
        }
        __calculateSpeed(speed, radius) {
            return (
                (speed * (radius - this.alignment.distance)) / (radius + this.alignment.distance)
            );
        } // entry-hw turtle.js calculateSpeed
        __calculatePulse(deg, radius, offset) {
            return Math.round(
                (deg * (DEG_BASE + offset) * (radius + this.alignment.distance)) /
                    360.0 /
                    this.alignment.distance
            );
        } // entry-hw turtle.js calculatePulse
        __cancelTimeout() {
            if (this.timerId !== undefined) clearTimeout(this.timerId);
            this.timerId = undefined;
        } // entry-hw turtle.js cancelTimeout
        __clampMs(ms) {
            ms = Number(ms);
            if (!(ms > 0)) return 0;
            return Math.min(Math.floor(ms), MAX_TIMER_MS);
        } // 유한하지 않거나 상한을 넘으면 상한, 음수와 NaN 은 0

        __gateOpen() {
            return (
                Entry.hwLite &&
                Entry.hwLite.getStatus() === 'connected' &&
                (this.__forceFrame || Entry.engine.isState('run'))
            );
        }
        __pushNow() {
            if (!Entry.hwLite || !Entry.hwLite.serial || Entry.hwLite.getStatus() !== 'connected')
                return;
            if (Entry.hwLite.hwModule && Entry.hwLite.hwModule !== this) return;
            try {
                this.__forceFrame = true;
                Entry.hwLite.serial.update();
            } finally {
                this.__forceFrame = false;
            }
        }
        requestLocalData() {
            if (this.state === 'realigning')
                return this.__forceFrame ? this.__realignPacket() : undefined;
            if (this.state !== 'ready' || !this.address || !this.__gateOpen()) return undefined;
            this.__clampToOut();
            this.__latchCommands();
            return this.__buildFrame();
        }
        // 설치형 entry-hw handleRemoteData 의 "JSON 왕복 -> || 0 -> 클램프 복사" 를 motoring 에서 out 으로 재현한다(dataHandler.ts 의 read 가 || 0 을 적용). motoring 은 건드리지 않는다.
        __clampToOut() {
            const m = this.motoring,
                o = this.out;
            const rd = (v) => {
                const j = JSON.parse(JSON.stringify({ v })).v;
                return j || 0;
            }; // NaN 과 Infinity 는 null 을 거쳐 0, undefined 키는 0
            const cl = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
            o.leftWheel = cl(rd(m.leftWheel), -400, 400);
            o.rightWheel = cl(rd(m.rightWheel), -400, 400);
            o.ledRed = cl(rd(m.ledRed), 0, 255);
            o.ledGreen = cl(rd(m.ledGreen), 0, 255);
            o.ledBlue = cl(rd(m.ledBlue), 0, 255);
            o.buzzer = cl(rd(m.buzzer), 0, 167772.15);
            o.pulse = cl(rd(m.pulse), 0, 65535);
            o.note = cl(rd(m.note), 0, 88);
            if (m.soundId !== o.soundId) {
                o.sound = cl(rd(m.sound), 0, 127);
                o.soundRepeat = rd(m.soundRepeat);
            } // 엔진측 사본의 sound/soundRepeat 는 수신 경로가 도중에 바꾸므로 soundId 엣지에서만 복사(entry-hw handleRemoteData)
            o.lineTracerMode = cl(rd(m.lineTracerMode), 0, 127);
            o.lineTracerGain = cl(rd(m.lineTracerGain), 1, 8);
            o.lineTracerSpeed = cl(rd(m.lineTracerSpeed), 1, 8);
            o.motionType = cl(rd(m.motionType), 0, 12);
            o.motionUnit = cl(rd(m.motionUnit), 0, 3);
            o.motionSpeed = cl(rd(m.motionSpeed), 0, 400);
            o.motionValue = cl(rd(m.motionValue), 0, 2147483647);
            o.motionRadius = cl(rd(m.motionRadius), 0, 2147483647);
            for (const k of ['pulseId', 'soundId', 'lineTracerModeId', 'motionId']) o[k] = rd(m[k]);
        }
        // entry-hw handleRemoteData 의 id 엣지 래칭. out 과 shadow 를 비교한다.
        __latchCommands() {
            const o = this.out,
                s = this.shadow;
            if (o.pulseId !== s.pulseId) {
                s.pulseId = o.pulseId;
                this.wheel.pulse = o.pulse;
                this.wheel.written = true;
            }
            if (o.soundId !== s.soundId) {
                s.soundId = o.soundId;
                this.__latchSound(o.sound, o.soundRepeat);
            }
            if (o.lineTracerModeId !== s.lineTracerModeId) {
                s.lineTracerModeId = o.lineTracerModeId;
                this.lineTracer.written = true;
            }
            if (o.motionId !== s.motionId) {
                s.motionId = o.motionId;
                const mo = this.motion;
                mo.unit = o.motionUnit;
                mo.speed = o.motionSpeed;
                mo.value = o.motionValue;
                mo.radius = o.motionRadius;
                mo.type = o.motionType;
                mo.written = true;
            }
        }
        __latchSound(sound, count) {
            // entry-hw turtle.js runSound (블록 쪽 __playSoundCmd 와 이름을 나눴다)
            if (typeof count !== 'number') count = 1;
            if (count < 0) count = -1;
            if (count) {
                this.out.sound = sound;
                this.out.soundRepeat = count;
                this.sound.written = true;
            }
        }
        // entry-hw turtle.js requestLocalData 를 this.out 기준으로 옮긴 54자 프레임 조립.
        __buildFrame() {
            const motoring = this.out,
                motion = this.motion,
                wheel = this.wheel;
            let leftWheel = motoring.leftWheel,
                rightWheel = motoring.rightWheel;
            if (motion.written) {
                this.__cancelTimeout();
                motion.type = parseInt(motoring.motionType, 10);
                if (motion.type < 0 || motion.type > 12) motion.type = 0;
                if (motion.type !== 0) {
                    motion.speed = motoring.motionSpeed;
                    wheel.pulse = 0;
                    const unit = parseInt(motoring.motionUnit, 10);
                    const value = motoring.motionValue;
                    if (unit === 2) {
                        // UNIT_SEC
                        if (value === 0) {
                            leftWheel = 0;
                            rightWheel = 0;
                            wheel.count = 0;
                            wheel.event = -1;
                            motion.type = 0;
                        } else {
                            this.timerId = setTimeout(
                                () => {
                                    this.timerId = undefined;
                                    this.wheel.count = 0;
                                    this.wheel.event = -1;
                                    this.motion.type = 0;
                                    this.__pushNow();
                                },
                                this.__clampMs(this.motion.value * 1000)
                            );
                        }
                    } else {
                        if (unit === 3) {
                            // UNIT_PULSE
                            wheel.pulse = Math.round(value);
                        } else if (unit === 1) {
                            // UNIT_CM_DEG
                            const alignment = this.alignment;
                            switch (motion.type) {
                                case 1:
                                case 2:
                                    wheel.pulse = Math.round(value * CM_TO_PULSE);
                                    break;
                                case 3:
                                    wheel.pulse = Math.round(
                                        (value * (DEG_BASE + alignment.spinLeft)) / 360.0
                                    );
                                    break;
                                case 4:
                                    wheel.pulse = Math.round(
                                        (value * (DEG_BASE + alignment.spinRight)) / 360.0
                                    );
                                    break;
                                case 5:
                                case 6:
                                    wheel.pulse = Math.round(
                                        (value * (2 * DEG_BASE + alignment.pivotLeft)) / 360.0
                                    );
                                    break;
                                case 7:
                                case 8:
                                    wheel.pulse = Math.round(
                                        (value * (2 * DEG_BASE + alignment.pivotRight)) / 360.0
                                    );
                                    break;
                                case 9:
                                case 10:
                                    wheel.pulse = this.__calculatePulse(
                                        value,
                                        motoring.motionRadius,
                                        alignment.spinLeft
                                    );
                                    break;
                                case 11:
                                case 12:
                                    wheel.pulse = this.__calculatePulse(
                                        value,
                                        motoring.motionRadius,
                                        alignment.spinRight
                                    );
                                    break;
                                default:
                                    motion.type = 0;
                                    break;
                            }
                        }
                        if (wheel.pulse === 0) {
                            leftWheel = 0;
                            rightWheel = 0;
                            wheel.count = 0;
                            wheel.event = -1;
                            motion.type = 0;
                        }
                    }
                }
            }
            if (motion.type === 0) wheel.pulse = motoring.pulse;

            let speed = motion.speed;
            if (speed === 0) speed = DEFAULT_SPEED;
            switch (motion.type) {
                case 1:
                    leftWheel = speed;
                    rightWheel = speed;
                    break;
                case 2:
                    leftWheel = -speed;
                    rightWheel = -speed;
                    break;
                case 3:
                    leftWheel = -speed;
                    rightWheel = speed;
                    break;
                case 4:
                    leftWheel = speed;
                    rightWheel = -speed;
                    break;
                case 5:
                    leftWheel = 0;
                    rightWheel = speed;
                    break;
                case 6:
                    leftWheel = 0;
                    rightWheel = -speed;
                    break;
                case 7:
                    leftWheel = speed;
                    rightWheel = 0;
                    break;
                case 8:
                    leftWheel = -speed;
                    rightWheel = 0;
                    break;
                case 9:
                    leftWheel = this.__calculateSpeed(speed, motoring.motionRadius);
                    rightWheel = speed;
                    break;
                case 10:
                    leftWheel = -this.__calculateSpeed(speed, motoring.motionRadius);
                    rightWheel = -speed;
                    break;
                case 11:
                    leftWheel = speed;
                    rightWheel = this.__calculateSpeed(speed, motoring.motionRadius);
                    break;
                case 12:
                    leftWheel = -speed;
                    rightWheel = -this.__calculateSpeed(speed, motoring.motionRadius);
                    break;
                default:
                    break;
            }

            let str = '10';
            if (leftWheel < 0) str += this.toHex2(leftWheel * WHEEL_SCALE - 0.5);
            else str += this.toHex2(leftWheel * WHEEL_SCALE + 0.5);
            if (rightWheel < 0) str += this.toHex2(rightWheel * WHEEL_SCALE - 0.5);
            else str += this.toHex2(rightWheel * WHEEL_SCALE + 0.5);
            if (motion.written || wheel.written) {
                motion.written = false;
                wheel.written = false;
                if (wheel.pulse !== 0 || wheel.pulsePrev !== 0) wheel.id = (wheel.id % 255) + 1;
                wheel.count = 0;
                if (wheel.pulse > 0) wheel.event = 1;
                else if (wheel.event !== -1) wheel.event = 0;
                if (this.wheel.event === 1) {
                    this.wheel.startedAt = this.__now();
                    const sp = Math.max(
                        Math.abs(this.out.motionSpeed) || DEFAULT_SPEED,
                        DEFAULT_SPEED
                    );
                    this.wheel.expectedMs = (this.wheel.pulse / (sp * WHEEL_SCALE)) * 1000;
                }
                wheel.pulsePrev = wheel.pulse;
            }
            str += this.toHex(wheel.id);
            str += this.toHex2(wheel.pulse);

            const lineTracer = this.lineTracer;
            let tmp = LINE_MODE_TO_CODE[motoring.lineTracerMode] || 0;
            if (lineTracer.written) {
                lineTracer.written = false;
                lineTracer.count = 0;
                if (tmp > 0) {
                    lineTracer.flag ^= 0x80;
                    lineTracer.event = 1;
                } else {
                    lineTracer.event = 0;
                }
            }
            tmp |= lineTracer.flag;
            str += this.toHex(tmp);
            str += this.toHex(motoring.ledRed);
            str += this.toHex(motoring.ledGreen);
            str += this.toHex(motoring.ledBlue);
            tmp = (motoring.lock & 0x01) << 4;
            tmp |= (1 - motoring.lamp) & 0x01;
            str += this.toHex(tmp);
            str += this.toHex3(motoring.buzzer * 100);
            str += this.toHex(motoring.note);

            const sound = this.sound;
            tmp = SOUND_TO_CODE[motoring.sound] || 0;
            if (sound.written) {
                sound.written = false;
                sound.count = 0;
                if (tmp > 0) {
                    sound.flag ^= 0x80;
                    sound.event = 1;
                } else {
                    sound.event = 0;
                }
            }
            tmp |= sound.flag;
            str += this.toHex(tmp);
            tmp = ((motoring.lineTracerGain - 1) & 0x0f) << 4;
            tmp |= (motoring.lineTracerSpeed - 1) & 0x0f;
            str += this.toHex(tmp);
            str += '00-';
            str += this.address;
            str += '\r';
            return str;
        }
        __resetState() {
            this.motoring = this.__defaultMotoring();
            this.__resolveAllPending();
            this.__removeAllTimeouts();
            this.robot = this.__defaultRobot(); // 설치형 setZero 와 같이 id 4종 0, 래치 id 7종 -1, 이벤트 플래그, blockId, noteBlockId, tempo
            this.wheel.event = 0;
            this.wheel.count = 0;
            this.sound.event = 0;
            this.sound.count = 0;
            this.lineTracer.event = 0;
            this.lineTracer.count = 0;
            if (this.state !== 'ready')
                this.shadow = { pulseId: 0, soundId: 0, lineTracerModeId: 0, motionId: 0 };
        }
        setZero() {
            this.__resetState();
            if (this.state === 'ready') this.__pushNow(); // 조립되면 래칭이 비교 기준 id(shadow)를 0 으로 따라가며 설치형과 같은 정지 바이트
            this.shadow = { pulseId: 0, soundId: 0, lineTracerModeId: 0, motionId: 0 }; // 조립을 건너뛴 경우에도 불변식
        }

        // ── 블록 메서드(설치형 block_robomation.js TurtleRobot 이식) ─────────────────
        // 상태 분리: 블록은 this.motoring(설치형 sendQueue 역할)과 this.robot(entryjs 쪽 래치)을 만진다. 취소 함수는 콜백을 버리지 않고 해소한다.
        __addTimeout(fn, ms) {
            const t = setTimeout(() => {
                const i = this.timeouts.indexOf(t);
                if (i >= 0) this.timeouts.splice(i, 1);
                fn();
            }, this.__clampMs(ms));
            this.timeouts.push(t);
            return t;
        }
        __removeTimeout(id) {
            clearTimeout(id);
            const idx = this.timeouts.indexOf(id);
            if (idx >= 0) this.timeouts.splice(idx, 1);
        }
        __setPulse(pulse) {
            const r = this.robot;
            r.pulseId = (r.pulseId % 255) + 1;
            this.motoring.pulse = pulse;
            this.motoring.pulseId = r.pulseId;
        }
        __setLineTracerMode(mode) {
            const r = this.robot;
            r.lineTracerModeId = (r.lineTracerModeId % 255) + 1;
            this.motoring.lineTracerMode = mode;
            this.motoring.lineTracerModeId = r.lineTracerModeId;
        }
        __setMotion(type, unit, speed, value, radius) {
            const r = this.robot;
            r.motionId = (r.motionId % 255) + 1;
            const m = this.motoring;
            m.motionType = type;
            m.motionUnit = unit;
            m.motionSpeed = speed;
            m.motionValue = value;
            m.motionRadius = radius;
            m.motionId = r.motionId;
        }
        __playSoundCmd(sound, count) {
            // 설치형 TurtleRobot 의 __runSound
            if (typeof count !== 'number') count = 1;
            if (count < 0) count = -1;
            if (count) {
                const r = this.robot;
                r.soundId = (r.soundId % 255) + 1;
                this.motoring.sound = sound;
                this.motoring.soundRepeat = count;
                this.motoring.soundId = r.soundId;
            }
        }
        __cancelLineTracer() {
            this.__resolvePending('lineTracerDone');
        }
        __cancelMotion() {
            this.__resolvePending('motionDone');
        }
        __cancelSound() {
            this.__resolvePending('soundDone');
        }
        __issueNoteBlockId() {
            const r = this.robot;
            r.noteBlockId = r.blockId = (r.blockId % 65535) + 1;
            return r.noteBlockId;
        }
        __cancelNote() {
            const r = this.robot;
            r.noteBlockId = 0;
            if (r.noteTimer1 !== undefined) this.__removeTimeout(r.noteTimer1);
            if (r.noteTimer2 !== undefined) this.__removeTimeout(r.noteTimer2);
            r.noteTimer1 = undefined;
            r.noteTimer2 = undefined;
            this.__resolvePending('noteDone');
        }
        // 전송될 펄스를 entry-hw 의 환산식으로 미리 계산한다. unit 1 cm/deg, 2 sec(양수면 0 아님으로 간주), 3 pulse.
        __expectedPulse(type, unit, value, radius) {
            value = Math.min(value, 2147483647);
            radius = Math.min(radius, 2147483647);
            if (unit === 2) return value > 0 ? 1 : 0;
            if (unit === 3) return Math.round(value);
            if (unit !== 1) return 0;
            const a = this.alignment;
            switch (type) {
                case 1:
                case 2:
                    return Math.round(value * CM_TO_PULSE);
                case 3:
                    return Math.round((value * (DEG_BASE + a.spinLeft)) / 360.0);
                case 4:
                    return Math.round((value * (DEG_BASE + a.spinRight)) / 360.0);
                case 5:
                case 6:
                    return Math.round((value * (2 * DEG_BASE + a.pivotLeft)) / 360.0);
                case 7:
                case 8:
                    return Math.round((value * (2 * DEG_BASE + a.pivotRight)) / 360.0);
                case 9:
                case 10:
                    return this.__calculatePulse(value, radius, a.spinLeft);
                case 11:
                case 12:
                    return this.__calculatePulse(value, radius, a.spinRight);
                default:
                    return 0;
            }
        }
        __motionUnit(type, unit, value, callback) {
            this.__cancelLineTracer();
            this.__cancelMotion();
            this.motoring.leftWheel = 0;
            this.motoring.rightWheel = 0;
            this.__setPulse(0);
            value = parseFloat(value);
            const p = value && value > 0 ? this.__expectedPulse(type, unit, value, 0) : 0;
            if (value && value > 0 && p !== 0 && p <= 65535) {
                this.__setMotion(type, unit, 0, value, 0);
                this.robot.motionDone = callback;
                this.__setLineTracerMode(0);
            } else {
                this.__setMotion(0, 0, 0, 0, 0);
                this.__setLineTracerMode(0);
                callback();
            }
        }
        __motionUnitRadius(type, unit, value, radius, callback) {
            this.__cancelLineTracer();
            this.__cancelMotion();
            this.motoring.leftWheel = 0;
            this.motoring.rightWheel = 0;
            this.__setPulse(0);
            value = parseFloat(value);
            radius = parseFloat(radius);
            const valid = value && value > 0 && typeof radius === 'number' && radius >= 0;
            const p = valid ? this.__expectedPulse(type, unit, value, radius) : 0;
            if (valid && p !== 0 && p <= 65535) {
                this.__setMotion(type, unit, 0, value, radius);
                this.robot.motionDone = callback;
                this.__setLineTracerMode(0);
            } else {
                this.__setMotion(0, 0, 0, 0, 0);
                this.__setLineTracerMode(0);
                callback();
            }
        }

        // 이동과 회전: 같은 script 를 다시 부르며 isMoving 이 풀리길 기다린다.
        __moveBlock(script, start) {
            if (!script.isStart) {
                script.isStart = true;
                script.isMoving = true;
                start(() => {
                    script.isMoving = false;
                });
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
            return this.__moveBlock(script, (cb) => {
                const value = script.getNumberValue('VALUE');
                const unit = script.getField('UNIT');
                if (value < 0) this.__motionUnit(2, UNITS[unit], -value, cb);
                else this.__motionUnit(1, UNITS[unit], value, cb);
            });
        }
        moveBackwardUnit(script) {
            return this.__moveBlock(script, (cb) => {
                const value = script.getNumberValue('VALUE');
                const unit = script.getField('UNIT');
                if (value < 0) this.__motionUnit(1, UNITS[unit], -value, cb);
                else this.__motionUnit(2, UNITS[unit], value, cb);
            });
        }
        turnUnit(script) {
            return this.__moveBlock(script, (cb) => {
                const direction = script.getField('DIRECTION');
                const value = script.getNumberValue('VALUE');
                const unit = script.getField('UNIT');
                if (direction === 'LEFT') {
                    if (value < 0) this.__motionUnit(4, UNITS[unit], -value, cb);
                    else this.__motionUnit(3, UNITS[unit], value, cb);
                } else if (value < 0) this.__motionUnit(3, UNITS[unit], -value, cb);
                else this.__motionUnit(4, UNITS[unit], value, cb);
            });
        }
        pivotUnit(script) {
            return this.__moveBlock(script, (cb) => {
                const wheel = script.getField('WHEEL');
                const value = script.getNumberValue('VALUE');
                const unit = UNITS[script.getField('UNIT')];
                const toward = script.getField('TOWARD');
                if (wheel === 'LEFT') {
                    if (toward === 'HEAD') {
                        if (value < 0) this.__motionUnit(6, unit, -value, cb);
                        else this.__motionUnit(5, unit, value, cb);
                    } else if (value < 0) this.__motionUnit(5, unit, -value, cb);
                    else this.__motionUnit(6, unit, value, cb);
                } else if (toward === 'HEAD') {
                    if (value < 0) this.__motionUnit(8, unit, -value, cb);
                    else this.__motionUnit(7, unit, value, cb);
                } else if (value < 0) this.__motionUnit(7, unit, -value, cb);
                else this.__motionUnit(8, unit, value, cb);
            });
        }
        swingUnit(script) {
            return this.__moveBlock(script, (cb) => {
                const direction = script.getField('DIRECTION');
                const value = script.getNumberValue('VALUE');
                const unit = UNITS[script.getField('UNIT')];
                const radius = script.getNumberValue('RADIUS');
                const toward = script.getField('TOWARD');
                if (direction === 'LEFT') {
                    if (toward === 'HEAD') {
                        if (value < 0) this.__motionUnitRadius(10, unit, -value, radius, cb);
                        else this.__motionUnitRadius(9, unit, value, radius, cb);
                    } else if (value < 0) this.__motionUnitRadius(9, unit, -value, radius, cb);
                    else this.__motionUnitRadius(10, unit, value, radius, cb);
                } else if (toward === 'HEAD') {
                    if (value < 0) this.__motionUnitRadius(12, unit, -value, radius, cb);
                    else this.__motionUnitRadius(11, unit, value, radius, cb);
                } else if (value < 0) this.__motionUnitRadius(11, unit, -value, radius, cb);
                else this.__motionUnitRadius(12, unit, value, radius, cb);
            });
        }

        // 바퀴
        __wheelCommon() {
            this.__cancelLineTracer();
            this.__cancelMotion();
        }
        __wheelTail() {
            this.__setPulse(0);
            this.__setMotion(0, 0, 0, 0, 0);
            this.__setLineTracerMode(0);
        }
        setWheels(script) {
            const motoring = this.motoring;
            this.__wheelCommon();
            const leftVelocity = parseFloat(script.getNumberValue('LEFT'));
            const rightVelocity = parseFloat(script.getNumberValue('RIGHT'));
            if (typeof leftVelocity === 'number') motoring.leftWheel = leftVelocity;
            if (typeof rightVelocity === 'number') motoring.rightWheel = rightVelocity;
            this.__wheelTail();
            return script.callReturn();
        }
        changeWheels(script) {
            const motoring = this.motoring;
            this.__wheelCommon();
            const leftVelocity = parseFloat(script.getNumberValue('LEFT'));
            const rightVelocity = parseFloat(script.getNumberValue('RIGHT'));
            if (typeof leftVelocity === 'number')
                motoring.leftWheel =
                    motoring.leftWheel !== undefined
                        ? motoring.leftWheel + leftVelocity
                        : leftVelocity;
            if (typeof rightVelocity === 'number')
                motoring.rightWheel =
                    motoring.rightWheel !== undefined
                        ? motoring.rightWheel + rightVelocity
                        : rightVelocity;
            this.__wheelTail();
            return script.callReturn();
        }
        setWheel(script) {
            const motoring = this.motoring;
            this.__wheelCommon();
            const wheel = script.getField('WHEEL');
            const velocity = parseFloat(script.getNumberValue('VELOCITY'));
            if (typeof velocity === 'number') {
                if (wheel === 'LEFT') motoring.leftWheel = velocity;
                else if (wheel === 'RIGHT') motoring.rightWheel = velocity;
                else {
                    motoring.leftWheel = velocity;
                    motoring.rightWheel = velocity;
                }
            }
            this.__wheelTail();
            return script.callReturn();
        }
        changeWheel(script) {
            const motoring = this.motoring;
            this.__wheelCommon();
            const wheel = script.getField('WHEEL');
            const velocity = parseFloat(script.getNumberValue('VELOCITY'));
            if (typeof velocity === 'number') {
                if (wheel === 'LEFT') {
                    motoring.leftWheel =
                        motoring.leftWheel !== undefined ? motoring.leftWheel + velocity : velocity;
                } else if (wheel === 'RIGHT') {
                    motoring.rightWheel =
                        motoring.rightWheel !== undefined
                            ? motoring.rightWheel + velocity
                            : velocity;
                } else {
                    motoring.leftWheel =
                        motoring.leftWheel !== undefined ? motoring.leftWheel + velocity : velocity;
                    motoring.rightWheel =
                        motoring.rightWheel !== undefined
                            ? motoring.rightWheel + velocity
                            : velocity;
                }
            }
            this.__wheelTail();
            return script.callReturn();
        }

        // 라인트레이서
        followLine(script) {
            this.__cancelLineTracer();
            this.__cancelMotion();
            const mode = Number(script.getField('COLOR'));
            this.motoring.leftWheel = 0;
            this.motoring.rightWheel = 0;
            this.__setPulse(0);
            this.__setMotion(0, 0, 0, 0, 0);
            this.__setLineTracerMode(mode);
            return script.callReturn();
        }
        // 라인을 끝까지 따라가는 블록 공통부. 새 콜백을 걸기 전에 앞 손잡이를 해소한다.
        __lineUntil(script, getMode) {
            if (!script.isStart) {
                script.isStart = true;
                script.isMoving = true;
                this.__cancelMotion();
                const mode = getMode();
                this.motoring.leftWheel = 0;
                this.motoring.rightWheel = 0;
                this.__setPulse(0);
                this.__setMotion(0, 0, 0, 0, 0);
                this.__setLineTracerMode(mode);
                this.__resolvePending('lineTracerDone');
                this.robot.lineTracerDone = () => {
                    script.isMoving = false;
                };
                return script;
            } else if (script.isMoving) {
                return script;
            }
            delete script.isStart;
            delete script.isMoving;
            Entry.engine.isContinue = false;
            return script.callReturn();
        }
        followLineUntil(script) {
            return this.__lineUntil(script, () => Number(script.getField('COLOR')));
        }
        followLineUntilBlack(script) {
            return this.__lineUntil(script, () => Number(script.getField('COLOR')));
        }
        crossIntersection(script) {
            return this.__lineUntil(script, () => 40);
        }
        turnAtIntersection(script) {
            return this.__lineUntil(script, () => Number(script.getField('DIRECTION')));
        }
        setLineTracerSpeed(script) {
            const speed = parseInt(Number(script.getField('SPEED')), 10);
            if (typeof speed === 'number') {
                this.motoring.lineTracerSpeed = speed;
                this.motoring.lineTracerGain = speed;
            }
            return script.callReturn();
        }
        stop(script) {
            this.__cancelLineTracer();
            this.__cancelMotion();
            this.motoring.leftWheel = 0;
            this.motoring.rightWheel = 0;
            this.__wheelTail();
            return script.callReturn();
        }

        // 머리 LED
        setHeadColor(script) {
            const rgb = RGB_COLORS[script.getField('COLOR')];
            if (rgb) {
                const m = this.motoring;
                m.ledRed = rgb[0];
                m.ledGreen = rgb[1];
                m.ledBlue = rgb[2];
            }
            return script.callReturn();
        }
        pickHeadColor(script) {
            const color = script.getField('COLOR');
            const m = this.motoring;
            m.ledRed = parseInt(color.slice(1, 3), 16);
            m.ledGreen = parseInt(color.slice(3, 5), 16);
            m.ledBlue = parseInt(color.slice(5, 7), 16);
            return script.callReturn();
        }
        setHeadRgb(script) {
            const red = parseInt(script.getNumberValue('RED'), 10);
            const green = parseInt(script.getNumberValue('GREEN'), 10);
            const blue = parseInt(script.getNumberValue('BLUE'), 10);
            const m = this.motoring;
            if (typeof red === 'number') m.ledRed = red;
            if (typeof green === 'number') m.ledGreen = green;
            if (typeof blue === 'number') m.ledBlue = blue;
            return script.callReturn();
        }
        changeHeadRgb(script) {
            const red = parseInt(script.getNumberValue('RED'), 10);
            const green = parseInt(script.getNumberValue('GREEN'), 10);
            const blue = parseInt(script.getNumberValue('BLUE'), 10);
            const m = this.motoring;
            if (typeof red === 'number') m.ledRed = m.ledRed !== undefined ? m.ledRed + red : red;
            if (typeof green === 'number')
                m.ledGreen = m.ledGreen !== undefined ? m.ledGreen + green : green;
            if (typeof blue === 'number')
                m.ledBlue = m.ledBlue !== undefined ? m.ledBlue + blue : blue;
            return script.callReturn();
        }
        clearHead(script) {
            const m = this.motoring;
            m.ledRed = 0;
            m.ledGreen = 0;
            m.ledBlue = 0;
            return script.callReturn();
        }

        // 소리
        playSound(script) {
            this.__cancelNote();
            this.__cancelSound();
            const sound = Number(script.getField('SOUND'));
            const count = parseInt(script.getNumberValue('COUNT'), 10);
            this.motoring.buzzer = 0;
            this.motoring.note = 0;
            if (sound && count) this.__playSoundCmd(sound, count);
            else this.__playSoundCmd(0);
            return script.callReturn();
        }
        playSoundUntil(script) {
            if (!script.isStart) {
                script.isStart = true;
                script.isPlaying = true;
                this.__cancelNote();
                this.__cancelSound();
                const sound = Number(script.getField('SOUND'));
                const count = parseInt(script.getNumberValue('COUNT'), 10);
                this.motoring.buzzer = 0;
                this.motoring.note = 0;
                if (sound && count) {
                    this.__playSoundCmd(sound, count);
                    this.robot.soundDone = () => {
                        script.isPlaying = false;
                    };
                } else {
                    this.__playSoundCmd(0);
                    script.isPlaying = false;
                }
                return script;
            } else if (script.isPlaying) {
                return script;
            }
            delete script.isStart;
            delete script.isPlaying;
            Entry.engine.isContinue = false;
            return script.callReturn();
        }
        setBuzzer(script) {
            this.__cancelNote();
            this.__cancelSound();
            const hz = parseFloat(script.getNumberValue('HZ'));
            if (typeof hz === 'number') this.motoring.buzzer = hz;
            this.motoring.note = 0;
            this.__playSoundCmd(0);
            return script.callReturn();
        }
        changeBuzzer(script) {
            this.__cancelNote();
            this.__cancelSound();
            const motoring = this.motoring;
            const hz = parseFloat(script.getNumberValue('HZ'));
            if (typeof hz === 'number')
                motoring.buzzer = motoring.buzzer !== undefined ? motoring.buzzer + hz : hz;
            motoring.note = 0;
            this.__playSoundCmd(0);
            return script.callReturn();
        }
        clearSound(script) {
            this.__cancelNote();
            this.__cancelSound();
            this.motoring.buzzer = 0;
            this.motoring.note = 0;
            this.__playSoundCmd(0);
            return script.callReturn();
        }
        playNote(script) {
            this.__cancelNote();
            this.__cancelSound();
            const note = script.getNumberField('NOTE');
            const octave = parseInt(script.getNumberField('OCTAVE'), 10);
            const motoring = this.motoring;
            motoring.buzzer = 0;
            if (note && octave && octave > 0 && octave < 8)
                motoring.note = note + (octave - 1) * 12;
            else motoring.note = 0;
            this.__playSoundCmd(0);
            return script.callReturn();
        }
        playNoteBeat(script) {
            if (!script.isStart) {
                script.isStart = true;
                script.isPlaying = true;
                this.__cancelNote();
                this.__cancelSound();
                const motoring = this.motoring;
                const r = this.robot;
                let note = script.getNumberField('NOTE');
                const octave = parseInt(script.getNumberField('OCTAVE'), 10);
                const beat = parseFloat(script.getNumberValue('BEAT'));
                motoring.buzzer = 0;
                if (note && octave && octave > 0 && octave < 8 && beat && beat > 0 && r.tempo > 0) {
                    const id = this.__issueNoteBlockId();
                    note += (octave - 1) * 12;
                    motoring.note = note;
                    const timeValue = (beat * 60 * 1000) / r.tempo;
                    r.noteDone = () => {
                        script.isPlaying = false;
                    };
                    if (timeValue > 100) {
                        r.noteTimer1 = this.__addTimeout(() => {
                            if (this.robot.noteBlockId === id) {
                                motoring.note = 0;
                                if (this.robot.noteTimer1 !== undefined)
                                    this.__removeTimeout(this.robot.noteTimer1);
                                this.robot.noteTimer1 = undefined;
                            }
                        }, timeValue - 100);
                    }
                    r.noteTimer2 = this.__addTimeout(() => {
                        if (this.robot.noteBlockId === id) {
                            motoring.note = 0;
                            this.__cancelNote();
                            script.isPlaying = false;
                        }
                    }, timeValue);
                    this.__playSoundCmd(0);
                    return script;
                }
                motoring.note = 0;
                this.__playSoundCmd(0);
                script.isPlaying = false;
                return script;
            } else if (script.isPlaying) {
                return script;
            }
            delete script.isStart;
            delete script.isPlaying;
            Entry.engine.isContinue = false;
            this.motoring.note = 0;
            return script.callReturn();
        }
        restBeat(script) {
            if (!script.isStart) {
                script.isStart = true;
                script.isPlaying = true;
                this.__cancelNote();
                this.__cancelSound();
                const motoring = this.motoring;
                const r = this.robot;
                const beat = parseFloat(script.getNumberValue('BEAT'));
                motoring.buzzer = 0;
                motoring.note = 0;
                this.__playSoundCmd(0);
                if (beat && beat > 0 && r.tempo > 0) {
                    const id = this.__issueNoteBlockId();
                    const timeValue = (beat * 60 * 1000) / r.tempo;
                    r.noteDone = () => {
                        script.isPlaying = false;
                    };
                    r.noteTimer1 = this.__addTimeout(() => {
                        if (this.robot.noteBlockId === id) {
                            this.__cancelNote();
                            script.isPlaying = false;
                        }
                    }, timeValue);
                    return script;
                }
                script.isPlaying = false;
                return script;
            } else if (script.isPlaying) {
                return script;
            }
            delete script.isStart;
            delete script.isPlaying;
            Entry.engine.isContinue = false;
            return script.callReturn();
        }
        setTempo(script) {
            const bpm = parseFloat(script.getNumberValue('BPM'));
            if (typeof bpm === 'number') {
                this.robot.tempo = bpm;
                if (this.robot.tempo < 1) this.robot.tempo = 1;
            }
            return script.callReturn();
        }
        changeTempo(script) {
            const bpm = parseFloat(script.getNumberValue('BPM'));
            if (typeof bpm === 'number') {
                this.robot.tempo += bpm;
                if (this.robot.tempo < 1) this.robot.tempo = 1;
            }
            return script.callReturn();
        }

        // ── 수신 ─────────────────────────────────────────────────────────────
        handleLocalData(line) {
            if (typeof line !== 'string') return;
            if (this.state === 'realigning') {
                this.__realignStep(line);
                return;
            }
            if (this.state === 'idle') return;
            if (this.state !== 'ready') return;
            if (line.slice(0, 5) === 'FF01,') return;
            if (line.length !== 53 || line[0] !== '1') {
                this.__countInvalid();
                return;
            }
            this.invalidFrameCount = 0;
            if (line.slice(41, 53).toUpperCase() !== this.address) {
                this.__onAddressMismatch();
                return;
            }
            this.mismatchCount = 0;
            // 프레임 시작 시 지우기 = entry-hw requestRemoteData 가 발행 직후 지우던 7개 전부. 설치형과 같은 의미(다음 프레임이 이벤트를 덮는다).
            const s = this.sensory;
            s.clicked = 0;
            s.doubleClicked = 0;
            s.longPressed = 0;
            s.colorPattern = -1;
            s.wheelState = -1;
            s.soundState = -1;
            s.lineTracerState = 0;
            this.__parseFrame(line);
            this.handleSensory();
        }
        // 설치형 afterSend 는 엔진 틱 말미(Entry.hw.update 직후)에 블록 쪽 플래그를 지운다. 코어에 틱 훅은 없지만
        // Entry.engine.setTimeout(cb, 0) 이 매 틱 hw.update 직후 처리되므로(engine.js) 같은 자리다.
        __armEventClear() {
            if (Entry.engine.isState('run') && typeof Entry.engine.setTimeout === 'function')
                Entry.engine.setTimeout(() => this.__clearEvents(), 0);
        }
        __clearEvents() {
            const r = this.robot;
            r.clicked = false;
            r.doubleClicked = false;
            r.longPressed = false;
            r.colorPattern = -1;
        }
        // ── 세션 중 로봇 교체. idle 상태에서는 센서 프레임을 처리하지 않는다(송신 차단과 대칭).
        __onAddressMismatch() {
            this.mismatchCount = (this.mismatchCount || 0) + 1;
            if (this.mismatchCount >= 2) this.__startRealign();
        }
        __countInvalid() {
            this.invalidFrameCount = (this.invalidFrameCount || 0) + 1;
            if (this.invalidFrameCount >= 30 && this.state === 'ready') {
                this.invalidFrameCount = 0;
                this.__startRealign();
            }
        }
        __startRealign() {
            this.__clearRealign();
            this.mismatchCount = 0;
            this.state = 'realigning';
            this.__resolveAllPending();
            this.__removeAllTimeouts();
            this.realign = {
                pending: 'FF',
                newAddress: undefined,
                timer: setTimeout(() => {
                    const hw = Entry.hwLite;
                    if (
                        !hw ||
                        (typeof hw.getStatus === 'function' && hw.getStatus() !== 'connected') ||
                        (hw.hwModule && hw.hwModule !== this)
                    ) {
                        this.__clearRealign();
                        this.state = 'idle';
                        return;
                    }
                    this.__failRealign('timeout');
                }, REALIGN_TIMEOUT_MS),
            };
            this.__pushNow();
        }
        // 재보정 실패 출구 공통: 포트를 닫고 실패 메뉴와 토스트를 띄운다(코어는 세션 중 실패 시 포트를 닫지 않는다).
        __failRealign(reason) {
            this.state = 'idle';
            this.__clearRealign();
            this.__resolveAllPending();
            this.__removeAllTimeouts();
            // 코어 handleConnectErrorInEngineRun 과 같이 엔진을 멈춘다(실행 중이면 대기 블록이 영원히 남는다).
            if (
                Entry.engine &&
                typeof Entry.engine.isState === 'function' &&
                Entry.engine.isState('run') &&
                typeof Entry.engine.toggleStop === 'function'
            )
                Promise.resolve(Entry.engine.toggleStop()).catch(console.error);
            const hw = Entry.hwLite;
            if (hw && hw.serial && typeof hw.serial.removeSerialPort === 'function') {
                Promise.resolve(hw.serial.removeSerialPort()).catch(console.error);
            }
            if (hw && hw.getConnectFailedMenu) hw.getConnectFailedMenu();
            if (reason === 'foreign') this.__toastForeign();
            else if (Entry.toast && Entry.toast.alert)
                Entry.toast.alert(
                    Lang.Msgs.hw_connection_failed_title,
                    Lang.Msgs.hw_connection_failed_desc,
                    false
                );
        }
        __realignPacket() {
            const r = this.realign;
            if (!r) return undefined;
            if (r.pending === 'FF') return 'FF\r';
            return this.__alignPacket(r.pending === 'B0' ? 'B0' : '70', r.newAddress);
        }
        __realignStep(line) {
            const r = this.realign;
            if (!r) return;
            if (r.pending === 'FF') {
                const id = this.parseIdentityData(line);
                if (!id) {
                    if (line.slice(0, 2) !== 'FF') this.__pushNow();
                    return;
                }
                if (id.foreign) {
                    this.__failRealign('foreign');
                    return;
                }
                r.newAddress = id.address;
                r.pending = 'B0';
                this.__pushNow();
                return;
            }
            if (r.pending === 'B0') {
                if (!this.parseAlignment(line, r.newAddress)) {
                    if (line.slice(0, 2) !== 'B0') this.__pushNow();
                    return;
                }
                r.pending = '70';
                this.__pushNow();
                return;
            }
            if (line.slice(0, 2) === 'B0') {
                if (this.parseAlignment(line, r.newAddress)) this.__pushNow();
                return;
            }
            if (
                line.length === 53 &&
                line[0] === '1' &&
                line.slice(41, 53).toUpperCase() === r.newAddress
            ) {
                clearTimeout(r.timer);
                const al = this.alignment;
                this.address = r.newAddress;
                this.realign = undefined;
                this.state = 'ready';
                this.__resetSession();
                this.alignment = { ...al, valid: true };
                this.__pushNow();
            }
        }
        // 출처 entry-hw turtle.js handleLocalData 본문(길이와 선두 문자 검사 뒤). 바퀴 블록에 20펄스 이상 시간 fallback 한 줄만 추가했다.
        __parseFrame(line) {
            const data = line;
            let str;
            let value;
            var sensory = this.sensory;

            // r, g, b
            str = data.slice(2, 6);
            var red = parseInt(str, 16);
            str = data.slice(6, 10);
            var green = parseInt(str, 16);
            str = data.slice(10, 14);
            var blue = parseInt(str, 16);
            str = data.slice(14, 16);
            value = parseInt(str, 16);

            var r = parseInt((red * 255) / 1023);
            var g = parseInt((green * 255) / 1023);
            var b = parseInt((blue * 255) / 1023);
            if (r > 255) r = 255;
            else if (r < 0) r = 0;
            if (g > 255) g = 255;
            else if (g < 0) g = 0;
            if (b > 255) b = 255;
            else if (b < 0) b = 0;

            sensory.colorRed = r;
            sensory.colorGreen = g;
            sensory.colorBlue = b;
            sensory.colorClear = value;

            // color number
            var colorNumber = -1;
            if (value < 75) {
                if (red > 600 && green > 600 && blue > 600) {
                    colorNumber = 8;
                } else if (green < (red * 3) / 10 && blue < (red * 3) / 10 && red > 350) {
                    colorNumber = 1;
                } else if (
                    blue < (red * 5) / 10 &&
                    blue < (green * 6) / 10 &&
                    red > 300 &&
                    green > 250
                ) {
                    if (green < (red * 15) / 20) {
                        colorNumber = 2;
                    } else {
                        colorNumber = 3;
                    }
                } else if (red < (green * 6) / 10 && blue < (green * 6) / 10 && green > 300) {
                    colorNumber = 4;
                } else if (red < (blue * 6) / 10 && green < (blue * 7) / 10 && blue > 250) {
                    colorNumber = 6;
                } else if (
                    red < (green * 6) / 10 &&
                    red < (blue * 6) / 10 &&
                    blue > 250 &&
                    green > 250
                ) {
                    colorNumber = 5;
                } else if (green < (red * 7) / 10 && green < (blue * 7) / 10 && red > 250) {
                    colorNumber = 7;
                } else if (red < 300 && green < 300 && blue < 250) {
                    colorNumber = 0;
                }
            }
            var event = this.event;
            if (colorNumber != event.colorNumber) {
                event.colorNumber = colorNumber;
                sensory.colorNumber = colorNumber;
            }

            // clicked / double clicked / long pressed
            str = data.slice(16, 18);
            value = parseInt(str, 16);
            var clickId = (value >> 2) & 0x03;
            var longPressId = (value >> 4) & 0x03;
            var button = this.button;
            if (button.clickId < 0) {
                button.clickId = clickId;
            } else if (clickId != button.clickId) {
                button.clickId = clickId;
                value = value & 0x03;
                if (value == 1) {
                    sensory.clicked = 1;
                    sensory.clickedId = (sensory.clickedId % 255) + 1;
                } else if (value == 2) {
                    sensory.doubleClicked = 1;
                    sensory.doubleClickedId = (sensory.doubleClickedId % 255) + 1;
                }
            }
            if (button.longPressId < 0) {
                button.longPressId = longPressId;
            } else if (longPressId != button.longPressId) {
                button.longPressId = longPressId;
                sensory.longPressed = 1;
                sensory.longPressedId = (sensory.longPressedId % 255) + 1;
            }

            // floor
            str = data.slice(18, 20);
            value = parseInt(str, 16);
            sensory.floor = value;
            // color pattern / button
            str = data.slice(20, 22);
            value = parseInt(str, 16);
            var pattern = (value >> 1) & 0x7f;
            if (event.colorPattern < 0) {
                event.colorPattern = pattern;
            } else if (pattern != event.colorPattern) {
                event.colorPattern = pattern;
                var pattern1 = (pattern >> 3) & 0x07;
                if (pattern1 > 1) pattern1++;
                var pattern2 = pattern & 0x07;
                if (pattern2 > 1) pattern2++;
                sensory.colorPattern = pattern1 * 10 + pattern2;
                sensory.colorPatternId = (sensory.colorPatternId % 255) + 1;
            }
            value = value & 0x01;
            if (value != event.button) {
                event.button = value;
                sensory.button = value;
            }
            // pulse count
            str = data.slice(22, 26);
            value = parseInt(str, 16);
            if (value != event.pulseCount) {
                event.pulseCount = value;
                sensory.pulseCount = value;
            }

            var acc = this.acceleration;
            if (acc.count < 10) {
                ++acc.count;
            } else {
                acc.index %= 10;
                acc.sumX -= acc.x[acc.index];
                acc.sumY -= acc.y[acc.index];
                acc.sumZ -= acc.z[acc.index];
            }
            // acceleration x
            str = data.slice(26, 28);
            value = parseInt(str, 16);
            if (value > 0x7f) value -= 0x100;
            value *= 256;
            acc.sumX += value;
            acc.x[acc.index] = value;
            // acceleration y
            str = data.slice(28, 30);
            value = parseInt(str, 16);
            if (value > 0x7f) value -= 0x100;
            value *= 256;
            acc.sumY += value;
            acc.y[acc.index] = value;
            // acceleration z
            str = data.slice(30, 32);
            value = parseInt(str, 16);
            if (value > 0x7f) value -= 0x100;
            value *= 256;
            acc.sumZ += value;
            acc.z[acc.index] = value;
            ++acc.index;
            sensory.accelerationX = Math.round(acc.sumX / acc.count);
            sensory.accelerationY = Math.round(acc.sumY / acc.count);
            sensory.accelerationZ = Math.round(acc.sumZ / acc.count);

            // temperature
            str = data.slice(32, 34);
            value = parseInt(str, 16);
            if (value > 0x7f) value -= 0x100;
            value = value / 2.0 + 24;
            sensory.temperature = parseInt(value);
            // signal strength
            str = data.slice(34, 36);
            value = parseInt(str, 16);
            value -= 0x100;
            sensory.signalStrength = value;
            // battery
            str = data.slice(36, 38);
            value = parseInt(str, 16);
            value = (value + 200) / 100.0;
            // battery state
            var state = 2;
            if (value < 3.65) state = 0;
            else if (value < 3.75) state = 1;
            if (state != event.batteryState) {
                event.batteryState = state;
                sensory.batteryState = state;
            }
            // wheel state / sound state / linetracer state
            str = data.slice(38, 40);
            value = parseInt(str, 16);
            state = (value >> 4) & 0x01;
            var wheel = this.wheel;
            if (wheel.event == 1) {
                if (state == 0) {
                    if (wheel.pulse > 0 && wheel.pulse < 20) {
                        if (++wheel.count > 8) wheel.event = 2;
                    } else if (
                        this.wheel.pulse >= 20 &&
                        this.__now() - this.wheel.startedAt > this.wheel.expectedMs + START_GRACE_MS
                    ) {
                        if (++this.wheel.count > 8) this.wheel.event = 2;
                    }
                } else {
                    wheel.event = 2;
                }
            }
            if (wheel.event == 2) {
                if (state != wheel.state || wheel.count > 8) {
                    wheel.state = state;
                    sensory.wheelState = state;
                    sensory.wheelStateId = (sensory.wheelStateId % 255) + 1;
                    if (state == 0) {
                        wheel.event = 0;
                        wheel.count = 0;
                        this.motion.type = 0;
                    }
                }
            }
            if (wheel.event == -1) {
                wheel.state = state;
                sensory.wheelState = 0;
                sensory.wheelStateId = (sensory.wheelStateId % 255) + 1;
                wheel.event = 0;
                wheel.count = 0;
                this.motion.type = 0;
            }
            state = value & 0x03;
            if (state > 1) state = 1;
            var sound = this.sound;
            if (sound.event == 1) {
                if (state == 0) {
                    if (++sound.count > 5) sound.event = 2;
                } else {
                    sound.event = 2;
                }
            }
            if (sound.event == 2) {
                if (state != sound.state || sound.count > 5) {
                    sound.state = state;
                    sensory.soundState = state;
                    if (state == 0) {
                        sound.event = 0;
                        sound.count = 0;
                        var motoring = this.out;
                        if (motoring.sound > 0) {
                            if (motoring.soundRepeat < 0) {
                                this.__latchSound(motoring.sound, -1);
                            } else if (motoring.soundRepeat > 1) {
                                motoring.soundRepeat--;
                                this.__latchSound(motoring.sound, motoring.soundRepeat);
                            } else {
                                motoring.sound = 0;
                                motoring.soundRepeat = 1;
                                sensory.soundState = state;
                                sensory.soundStateId = (sensory.soundStateId % 255) + 1;
                            }
                        } else {
                            motoring.sound = 0;
                            motoring.soundRepeat = 1;
                            sensory.soundState = state;
                            sensory.soundStateId = (sensory.soundStateId % 255) + 1;
                        }
                    } else if (state != sensory.soundState) {
                        sensory.soundState = state;
                        sensory.soundStateId = (sensory.soundStateId % 255) + 1;
                    }
                }
            }
            state = (value >> 2) & 0x03;
            if ((state & 0x02) != 0) {
                var lineTracer = this.lineTracer;
                if (lineTracer.event == 1) {
                    if (state == 0x02) {
                        if (++lineTracer.count > 5) lineTracer.event = 2;
                    } else {
                        lineTracer.event = 2;
                    }
                }
                if (lineTracer.event == 2) {
                    if (state != lineTracer.state || lineTracer.count > 5) {
                        lineTracer.state = state;
                        sensory.lineTracerState = state;
                        sensory.lineTracerStateId = (sensory.lineTracerStateId % 255) + 1;
                        if (state == 0x02) {
                            lineTracer.event = 0;
                            lineTracer.count = 0;
                        }
                    }
                }
            }
        }
        // 설치형 TurtleRobot.prototype.handleSensory. 블록 쪽 상태는 this.robot, 완료는 __resolvePending 한 번.
        handleSensory() {
            const sensory = this.sensory;
            const r = this.robot;
            r.clicked = sensory.clicked == 1;
            r.doubleClicked = sensory.doubleClicked == 1;
            r.longPressed = sensory.longPressed == 1;
            r.colorPattern = sensory.colorPattern;
            if (r.clicked || r.doubleClicked || r.longPressed || r.colorPattern >= 0)
                this.__armEventClear();

            if (r.lineTracerDone) {
                if (sensory.lineTracerStateId != r.lineTracerStateId) {
                    r.lineTracerStateId = sensory.lineTracerStateId;
                    if (sensory.lineTracerState == 0x02) {
                        this.__setLineTracerMode(0);
                        this.__resolvePending('lineTracerDone');
                    }
                }
            }
            if (r.motionDone) {
                if (sensory.wheelStateId != r.wheelStateId) {
                    r.wheelStateId = sensory.wheelStateId;
                    if (sensory.wheelState == 0) {
                        this.motoring.leftWheel = 0;
                        this.motoring.rightWheel = 0;
                        this.__resolvePending('motionDone');
                    }
                }
            }
            if (r.soundDone) {
                if (sensory.soundStateId != r.soundStateId) {
                    r.soundStateId = sensory.soundStateId;
                    if (sensory.soundState == 0) this.__resolvePending('soundDone');
                }
            }
        }

        // 센서 읽기(설치형 TurtleRobot). this.sensory 는 entry-hw 쪽 발행 결과, 이벤트 플래그는 this.robot.
        getValue(script) {
            const dev = script.getField('DEVICE');
            return dev === 'colorPattern' ? this.robot.colorPattern : this.sensory[dev];
        }
        checkBoolean(script) {
            const sensory = this.sensory;
            const dev = script.getField('DEVICE');
            if (dev.startsWith('TILT')) {
                let value = 0;
                if (sensory.tilt === undefined) {
                    const x = sensory.accelerationX,
                        y = sensory.accelerationY,
                        z = sensory.accelerationZ;
                    if (z < 8192 && x > 8192 && y > -4096 && y < 4096) value = 1;
                    else if (z < 8192 && x < -8192 && y > -4096 && y < 4096) value = -1;
                    else if (z < 8192 && y > 8192 && x > -4096 && x < 4096) value = 2;
                    else if (z < 8192 && y < -8192 && x > -4096 && x < 4096) value = -2;
                    else if (z > 12288 && x > -8192 && x < 8192 && y > -8192 && y < 8192) value = 3;
                    else if (z < -12288 && x > -4096 && x < 4096 && y > -4096 && y < 4096)
                        value = -3;
                } else value = sensory.tilt;
                switch (dev) {
                    case 'TILT_FORWARD':
                        return value === 1;
                    case 'TILT_BACKWARD':
                        return value === -1;
                    case 'TILT_LEFT':
                        return value === 2;
                    case 'TILT_RIGHT':
                        return value === -2;
                    case 'TILT_FLIP':
                        return value === 3;
                    case 'TILT_NOT':
                        return value === -3;
                    default:
                        return false;
                }
            }
            switch (dev) {
                case 'BATTERY_NORMAL':
                    return sensory.batteryState === 2;
                case 'BATTERY_LOW':
                    return sensory.batteryState === 1;
                case 'BATTERY_EMPTY':
                    return sensory.batteryState === 0;
                default:
                    return false;
            }
        }
        checkTouchingColor(script) {
            return this.sensory.colorNumber === Number(script.getField('COLOR')) - 1;
        }
        checkColorPattern(script) {
            return (
                this.robot.colorPattern ===
                Number(script.getField('COLOR1')) * 10 + Number(script.getField('COLOR2'))
            );
        }
        checkButtonState(script) {
            switch (script.getField('STATE')) {
                case 'clicked':
                    return this.robot.clicked;
                case 'doubleClicked':
                    return this.robot.doubleClicked;
                case 'longPressed':
                    return this.robot.longPressed;
                default:
                    return false;
            }
        }

        getBlocks() {
            return {
                turtlelite_touching_color: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    fontColor: '#fff',
                    skeleton: 'basic_boolean_field',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.turtlelite_color_red, '2'],
                                [Lang.Blocks.turtlelite_color_orange, '3'],
                                [Lang.Blocks.turtlelite_color_yellow, '4'],
                                [Lang.Blocks.turtlelite_color_green, '5'],
                                [Lang.Blocks.turtlelite_color_sky_blue, '6'],
                                [Lang.Blocks.turtlelite_color_blue, '7'],
                                [Lang.Blocks.turtlelite_color_purple, '8'],
                                [Lang.Blocks.turtlelite_color_black, '1'],
                                [Lang.Blocks.turtlelite_color_white, '9'],
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
                        type: 'turtlelite_touching_color',
                    },
                    paramsKeyMap: {
                        COLOR: 0,
                    },
                    class: 'turtlelite_sensor',
                    isNotFor: ['TurtleLite'],
                    func(sprite, script) {
                        return Entry.TurtleLite.checkTouchingColor(script);
                    },
                    syntax: { js: [], py: [] },
                },
                turtlelite_is_color_pattern: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    fontColor: '#fff',
                    skeleton: 'basic_boolean_field',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.turtlelite_color_red, '1'],
                                [Lang.Blocks.turtlelite_color_yellow, '3'],
                                [Lang.Blocks.turtlelite_color_green, '4'],
                                [Lang.Blocks.turtlelite_color_sky_blue, '5'],
                                [Lang.Blocks.turtlelite_color_blue, '6'],
                                [Lang.Blocks.turtlelite_color_purple, '7'],
                            ],
                            value: '1',
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.turtlelite_color_red, '1'],
                                [Lang.Blocks.turtlelite_color_yellow, '3'],
                                [Lang.Blocks.turtlelite_color_green, '4'],
                                [Lang.Blocks.turtlelite_color_sky_blue, '5'],
                                [Lang.Blocks.turtlelite_color_blue, '6'],
                                [Lang.Blocks.turtlelite_color_purple, '7'],
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
                        type: 'turtlelite_is_color_pattern',
                    },
                    paramsKeyMap: {
                        COLOR1: 0,
                        COLOR2: 1,
                    },
                    class: 'turtlelite_sensor',
                    isNotFor: ['TurtleLite'],
                    func(sprite, script) {
                        return Entry.TurtleLite.checkColorPattern(script);
                    },
                    syntax: { js: [], py: [] },
                },
                turtlelite_button_state: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    fontColor: '#fff',
                    skeleton: 'basic_boolean_field',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.turtlelite_clicked, 'clicked'],
                                [Lang.Blocks.turtlelite_double_clicked, 'doubleClicked'],
                                [Lang.Blocks.turtlelite_long_pressed, 'longPressed'],
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
                        type: 'turtlelite_button_state',
                    },
                    paramsKeyMap: {
                        STATE: 0,
                    },
                    class: 'turtlelite_sensor',
                    isNotFor: ['TurtleLite'],
                    func(sprite, script) {
                        return Entry.TurtleLite.checkButtonState(script);
                    },
                    syntax: { js: [], py: [] },
                },
                turtlelite_boolean: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    fontColor: '#fff',
                    skeleton: 'basic_boolean_field',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.turtlelite_tilt_forward, 'TILT_FORWARD'],
                                [Lang.Blocks.turtlelite_tilt_backward, 'TILT_BACKWARD'],
                                [Lang.Blocks.turtlelite_tilt_left, 'TILT_LEFT'],
                                [Lang.Blocks.turtlelite_tilt_right, 'TILT_RIGHT'],
                                [Lang.Blocks.turtlelite_tilt_flip, 'TILT_FLIP'],
                                [Lang.Blocks.turtlelite_tilt_not, 'TILT_NOT'],
                                [Lang.Blocks.turtlelite_battery_normal, 'BATTERY_NORMAL'],
                                [Lang.Blocks.turtlelite_battery_low, 'BATTERY_LOW'],
                                [Lang.Blocks.turtlelite_battery_empty, 'BATTERY_EMPTY'],
                            ],
                            value: 'TILT_FORWARD',
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                    ],
                    events: {},
                    def: {
                        params: [],
                        type: 'turtlelite_boolean',
                    },
                    paramsKeyMap: {
                        DEVICE: 0,
                    },
                    class: 'turtlelite_sensor',
                    isNotFor: ['TurtleLite'],
                    func(sprite, script) {
                        return Entry.TurtleLite.checkBoolean(script);
                    },
                    syntax: { js: [], py: [] },
                },
                turtlelite_value: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    fontColor: '#fff',
                    skeleton: 'basic_string_field',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.turtlelite_color_number, 'colorNumber'],
                                [Lang.Blocks.turtlelite_color_pattern, 'colorPattern'],
                                [Lang.Blocks.turtlelite_floor, 'floor'],
                                [Lang.Blocks.turtlelite_button, 'button'],
                                [Lang.Blocks.turtlelite_acceleration_x, 'accelerationX'],
                                [Lang.Blocks.turtlelite_acceleration_y, 'accelerationY'],
                                [Lang.Blocks.turtlelite_acceleration_z, 'accelerationZ'],
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
                        type: 'turtlelite_value',
                    },
                    paramsKeyMap: {
                        DEVICE: 0,
                    },
                    class: 'turtlelite_sensor',
                    isNotFor: ['TurtleLite'],
                    func(sprite, script) {
                        return Entry.TurtleLite.getValue(script);
                    },
                    syntax: { js: [], py: [] },
                },
                turtlelite_move_forward_unit: {
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
                                [Lang.Blocks.turtlelite_unit_cm, 'CM'],
                                [Lang.Blocks.turtlelite_unit_sec, 'SEC'],
                                [Lang.Blocks.turtlelite_unit_pulse, 'PULSE'],
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
                        type: 'turtlelite_move_forward_unit',
                    },
                    paramsKeyMap: {
                        VALUE: 0,
                        UNIT: 1,
                    },
                    class: 'turtlelite_wheel',
                    isNotFor: ['TurtleLite'],
                    func(sprite, script) {
                        return Entry.TurtleLite.moveForwardUnit(script);
                    },
                    syntax: { js: [], py: [] },
                },
                turtlelite_move_backward_unit: {
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
                                [Lang.Blocks.turtlelite_unit_cm, 'CM'],
                                [Lang.Blocks.turtlelite_unit_sec, 'SEC'],
                                [Lang.Blocks.turtlelite_unit_pulse, 'PULSE'],
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
                        type: 'turtlelite_move_backward_unit',
                    },
                    paramsKeyMap: {
                        VALUE: 0,
                        UNIT: 1,
                    },
                    class: 'turtlelite_wheel',
                    isNotFor: ['TurtleLite'],
                    func(sprite, script) {
                        return Entry.TurtleLite.moveBackwardUnit(script);
                    },
                    syntax: { js: [], py: [] },
                },
                turtlelite_turn_unit_in_place: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.turtlelite_left, 'LEFT'],
                                [Lang.Blocks.turtlelite_right, 'RIGHT'],
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
                                [Lang.Blocks.turtlelite_unit_deg, 'DEG'],
                                [Lang.Blocks.turtlelite_unit_sec, 'SEC'],
                                [Lang.Blocks.turtlelite_unit_pulse, 'PULSE'],
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
                        type: 'turtlelite_turn_unit_in_place',
                    },
                    paramsKeyMap: {
                        DIRECTION: 0,
                        VALUE: 1,
                        UNIT: 2,
                    },
                    class: 'turtlelite_wheel',
                    isNotFor: ['TurtleLite'],
                    func(sprite, script) {
                        return Entry.TurtleLite.turnUnit(script);
                    },
                    syntax: { js: [], py: [] },
                },
                turtlelite_pivot_around_wheel_unit_in_direction: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.turtlelite_left, 'LEFT'],
                                [Lang.Blocks.turtlelite_right, 'RIGHT'],
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
                                [Lang.Blocks.turtlelite_unit_deg, 'DEG'],
                                [Lang.Blocks.turtlelite_unit_sec, 'SEC'],
                                [Lang.Blocks.turtlelite_unit_pulse, 'PULSE'],
                            ],
                            value: 'DEG',
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.turtlelite_head, 'HEAD'],
                                [Lang.Blocks.turtlelite_tail, 'TAIL'],
                            ],
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
                        type: 'turtlelite_pivot_around_wheel_unit_in_direction',
                    },
                    paramsKeyMap: {
                        WHEEL: 0,
                        VALUE: 1,
                        UNIT: 2,
                        TOWARD: 3,
                    },
                    class: 'turtlelite_wheel',
                    isNotFor: ['TurtleLite'],
                    func(sprite, script) {
                        return Entry.TurtleLite.pivotUnit(script);
                    },
                    syntax: { js: [], py: [] },
                },
                turtlelite_turn_unit_with_radius_in_direction: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.turtlelite_left, 'LEFT'],
                                [Lang.Blocks.turtlelite_right, 'RIGHT'],
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
                                [Lang.Blocks.turtlelite_unit_deg, 'DEG'],
                                [Lang.Blocks.turtlelite_unit_sec, 'SEC'],
                                [Lang.Blocks.turtlelite_unit_pulse, 'PULSE'],
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
                                [Lang.Blocks.turtlelite_head, 'HEAD'],
                                [Lang.Blocks.turtlelite_tail, 'TAIL'],
                            ],
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
                        type: 'turtlelite_turn_unit_with_radius_in_direction',
                    },
                    paramsKeyMap: {
                        DIRECTION: 0,
                        VALUE: 1,
                        UNIT: 2,
                        RADIUS: 3,
                        TOWARD: 4,
                    },
                    class: 'turtlelite_wheel',
                    isNotFor: ['TurtleLite'],
                    func(sprite, script) {
                        return Entry.TurtleLite.swingUnit(script);
                    },
                    syntax: { js: [], py: [] },
                },
                turtlelite_change_wheels_by_left_right: {
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
                        type: 'turtlelite_change_wheels_by_left_right',
                    },
                    paramsKeyMap: {
                        LEFT: 0,
                        RIGHT: 1,
                    },
                    class: 'turtlelite_wheel',
                    isNotFor: ['TurtleLite'],
                    func(sprite, script) {
                        return Entry.TurtleLite.changeWheels(script);
                    },
                    syntax: { js: [], py: [] },
                },
                turtlelite_set_wheels_to_left_right: {
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
                        type: 'turtlelite_set_wheels_to_left_right',
                    },
                    paramsKeyMap: {
                        LEFT: 0,
                        RIGHT: 1,
                    },
                    class: 'turtlelite_wheel',
                    isNotFor: ['TurtleLite'],
                    func(sprite, script) {
                        return Entry.TurtleLite.setWheels(script);
                    },
                    syntax: { js: [], py: [] },
                },
                turtlelite_change_wheel_by: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.turtlelite_left, 'LEFT'],
                                [Lang.Blocks.turtlelite_right, 'RIGHT'],
                                [Lang.Blocks.turtlelite_both, 'BOTH'],
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
                        type: 'turtlelite_change_wheel_by',
                    },
                    paramsKeyMap: {
                        WHEEL: 0,
                        VELOCITY: 1,
                    },
                    class: 'turtlelite_wheel',
                    isNotFor: ['TurtleLite'],
                    func(sprite, script) {
                        return Entry.TurtleLite.changeWheel(script);
                    },
                    syntax: { js: [], py: [] },
                },
                turtlelite_set_wheel_to: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.turtlelite_left, 'LEFT'],
                                [Lang.Blocks.turtlelite_right, 'RIGHT'],
                                [Lang.Blocks.turtlelite_both, 'BOTH'],
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
                        type: 'turtlelite_set_wheel_to',
                    },
                    paramsKeyMap: {
                        WHEEL: 0,
                        VELOCITY: 1,
                    },
                    class: 'turtlelite_wheel',
                    isNotFor: ['TurtleLite'],
                    func(sprite, script) {
                        return Entry.TurtleLite.setWheel(script);
                    },
                    syntax: { js: [], py: [] },
                },
                turtlelite_follow_line: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.turtlelite_color_black, '10'],
                                [Lang.Blocks.turtlelite_color_red, '11'],
                                [Lang.Blocks.turtlelite_color_green, '13'],
                                [Lang.Blocks.turtlelite_color_blue, '15'],
                                [Lang.Blocks.turtlelite_color_any, '17'],
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
                        type: 'turtlelite_follow_line',
                    },
                    paramsKeyMap: {
                        COLOR: 0,
                    },
                    class: 'turtlelite_wheel',
                    isNotFor: ['TurtleLite'],
                    func(sprite, script) {
                        return Entry.TurtleLite.followLine(script);
                    },
                    syntax: { js: [], py: [] },
                },
                turtlelite_follow_line_until: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.turtlelite_color_red, '61'],
                                [Lang.Blocks.turtlelite_color_yellow, '62'],
                                [Lang.Blocks.turtlelite_color_green, '63'],
                                [Lang.Blocks.turtlelite_color_sky_blue, '64'],
                                [Lang.Blocks.turtlelite_color_blue, '65'],
                                [Lang.Blocks.turtlelite_color_purple, '66'],
                                [Lang.Blocks.turtlelite_color_any, '67'],
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
                        type: 'turtlelite_follow_line_until',
                    },
                    paramsKeyMap: {
                        COLOR: 0,
                    },
                    class: 'turtlelite_wheel',
                    isNotFor: ['TurtleLite'],
                    func(sprite, script) {
                        return Entry.TurtleLite.followLineUntil(script);
                    },
                    syntax: { js: [], py: [] },
                },
                turtlelite_follow_line_until_black: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.turtlelite_color_red, '71'],
                                [Lang.Blocks.turtlelite_color_green, '73'],
                                [Lang.Blocks.turtlelite_color_blue, '75'],
                                [Lang.Blocks.turtlelite_color_any, '77'],
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
                        type: 'turtlelite_follow_line_until_black',
                    },
                    paramsKeyMap: {
                        COLOR: 0,
                    },
                    class: 'turtlelite_wheel',
                    isNotFor: ['TurtleLite'],
                    func(sprite, script) {
                        return Entry.TurtleLite.followLineUntilBlack(script);
                    },
                    syntax: { js: [], py: [] },
                },
                turtlelite_cross_intersection: {
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
                        type: 'turtlelite_cross_intersection',
                    },
                    class: 'turtlelite_wheel',
                    isNotFor: ['TurtleLite'],
                    func(sprite, script) {
                        return Entry.TurtleLite.crossIntersection(script);
                    },
                    syntax: { js: [], py: [] },
                },
                turtlelite_turn_at_intersection: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.turtlelite_left, '20'],
                                [Lang.Blocks.turtlelite_right, '30'],
                                [Lang.Blocks.turtlelite_back, '50'],
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
                        type: 'turtlelite_turn_at_intersection',
                    },
                    paramsKeyMap: {
                        DIRECTION: 0,
                    },
                    class: 'turtlelite_wheel',
                    isNotFor: ['TurtleLite'],
                    func(sprite, script) {
                        return Entry.TurtleLite.turnAtIntersection(script);
                    },
                    syntax: { js: [], py: [] },
                },
                turtlelite_set_following_speed_to: {
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
                        type: 'turtlelite_set_following_speed_to',
                    },
                    paramsKeyMap: {
                        SPEED: 0,
                    },
                    class: 'turtlelite_wheel',
                    isNotFor: ['TurtleLite'],
                    func(sprite, script) {
                        return Entry.TurtleLite.setLineTracerSpeed(script);
                    },
                    syntax: { js: [], py: [] },
                },
                turtlelite_stop: {
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
                        type: 'turtlelite_stop',
                    },
                    class: 'turtlelite_wheel',
                    isNotFor: ['TurtleLite'],
                    func(sprite, script) {
                        return Entry.TurtleLite.stop(script);
                    },
                    syntax: { js: [], py: [] },
                },
                turtlelite_set_head_led_to: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.turtlelite_color_red, 'RED'],
                                [Lang.Blocks.turtlelite_color_orange, 'ORANGE'],
                                [Lang.Blocks.turtlelite_color_yellow, 'YELLOW'],
                                [Lang.Blocks.turtlelite_color_green, 'GREEN'],
                                [Lang.Blocks.turtlelite_color_sky_blue, 'CYAN'],
                                [Lang.Blocks.turtlelite_color_blue, 'BLUE'],
                                [Lang.Blocks.turtlelite_color_violet, 'VIOLET'],
                                [Lang.Blocks.turtlelite_color_purple, 'MAGENTA'],
                                [Lang.Blocks.turtlelite_color_white, 'WHITE'],
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
                        type: 'turtlelite_set_head_led_to',
                    },
                    paramsKeyMap: {
                        COLOR: 0,
                    },
                    class: 'turtlelite_led',
                    isNotFor: ['TurtleLite'],
                    func(sprite, script) {
                        return Entry.TurtleLite.setHeadColor(script);
                    },
                    syntax: { js: [], py: [] },
                },
                turtlelite_pick_head_led: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    statements: [],
                    params: [
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
                        params: [null, null],
                        type: 'turtlelite_pick_head_led',
                    },
                    paramsKeyMap: {
                        COLOR: 0,
                    },
                    class: 'turtlelite_led',
                    isNotFor: ['TurtleLite'],
                    func(sprite, script) {
                        return Entry.TurtleLite.pickHeadColor(script);
                    },
                    syntax: { js: [], py: [] },
                },
                turtlelite_change_head_led_by_rgb: {
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
                        type: 'turtlelite_change_head_led_by_rgb',
                    },
                    paramsKeyMap: {
                        RED: 0,
                        GREEN: 1,
                        BLUE: 2,
                    },
                    class: 'turtlelite_led',
                    isNotFor: ['TurtleLite'],
                    func(sprite, script) {
                        return Entry.TurtleLite.changeHeadRgb(script);
                    },
                    syntax: { js: [], py: [] },
                },
                turtlelite_set_head_led_to_rgb: {
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
                        type: 'turtlelite_set_head_led_to_rgb',
                    },
                    paramsKeyMap: {
                        RED: 0,
                        GREEN: 1,
                        BLUE: 2,
                    },
                    class: 'turtlelite_led',
                    isNotFor: ['TurtleLite'],
                    func(sprite, script) {
                        return Entry.TurtleLite.setHeadRgb(script);
                    },
                    syntax: { js: [], py: [] },
                },
                turtlelite_clear_head_led: {
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
                        type: 'turtlelite_clear_head_led',
                    },
                    class: 'turtlelite_led',
                    isNotFor: ['TurtleLite'],
                    func(sprite, script) {
                        return Entry.TurtleLite.clearHead(script);
                    },
                    syntax: { js: [], py: [] },
                },
                turtlelite_play_sound_times: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.turtlelite_sound_beep, '1'],
                                [Lang.Blocks.turtlelite_sound_random_beep, '2'],
                                [Lang.Blocks.turtlelite_sound_siren, '3'],
                                [Lang.Blocks.turtlelite_sound_engine, '4'],
                                [Lang.Blocks.turtlelite_sound_robot, '5'],
                                [Lang.Blocks.turtlelite_sound_march, '6'],
                                [Lang.Blocks.turtlelite_sound_birthday, '7'],
                                [Lang.Blocks.turtlelite_sound_dibidibidip, '8'],
                                [Lang.Blocks.turtlelite_sound_good_job, '9'],
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
                        type: 'turtlelite_play_sound_times',
                    },
                    paramsKeyMap: {
                        SOUND: 0,
                        COUNT: 1,
                    },
                    class: 'turtlelite_sound',
                    isNotFor: ['TurtleLite'],
                    func(sprite, script) {
                        return Entry.TurtleLite.playSound(script);
                    },
                    syntax: { js: [], py: [] },
                },
                turtlelite_play_sound_times_until_done: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.turtlelite_sound_beep, '1'],
                                [Lang.Blocks.turtlelite_sound_random_beep, '2'],
                                [Lang.Blocks.turtlelite_sound_siren, '3'],
                                [Lang.Blocks.turtlelite_sound_engine, '4'],
                                [Lang.Blocks.turtlelite_sound_robot, '5'],
                                [Lang.Blocks.turtlelite_sound_march, '6'],
                                [Lang.Blocks.turtlelite_sound_birthday, '7'],
                                [Lang.Blocks.turtlelite_sound_dibidibidip, '8'],
                                [Lang.Blocks.turtlelite_sound_good_job, '9'],
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
                        type: 'turtlelite_play_sound_times_until_done',
                    },
                    paramsKeyMap: {
                        SOUND: 0,
                        COUNT: 1,
                    },
                    class: 'turtlelite_sound',
                    isNotFor: ['TurtleLite'],
                    func(sprite, script) {
                        return Entry.TurtleLite.playSoundUntil(script);
                    },
                    syntax: { js: [], py: [] },
                },
                turtlelite_change_buzzer_by: {
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
                        type: 'turtlelite_change_buzzer_by',
                    },
                    paramsKeyMap: {
                        HZ: 0,
                    },
                    class: 'turtlelite_sound',
                    isNotFor: ['TurtleLite'],
                    func(sprite, script) {
                        return Entry.TurtleLite.changeBuzzer(script);
                    },
                    syntax: { js: [], py: [] },
                },
                turtlelite_set_buzzer_to: {
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
                        type: 'turtlelite_set_buzzer_to',
                    },
                    paramsKeyMap: {
                        HZ: 0,
                    },
                    class: 'turtlelite_sound',
                    isNotFor: ['TurtleLite'],
                    func(sprite, script) {
                        return Entry.TurtleLite.setBuzzer(script);
                    },
                    syntax: { js: [], py: [] },
                },
                turtlelite_clear_sound: {
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
                        type: 'turtlelite_clear_sound',
                    },
                    class: 'turtlelite_sound',
                    isNotFor: ['TurtleLite'],
                    func(sprite, script) {
                        return Entry.TurtleLite.clearSound(script);
                    },
                    syntax: { js: [], py: [] },
                },
                turtlelite_play_note: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.turtlelite_note_c, '4'],
                                [Lang.Blocks.turtlelite_note_c_sharp, '5'],
                                [Lang.Blocks.turtlelite_note_d, '6'],
                                [Lang.Blocks.turtlelite_note_d_sharp, '7'],
                                [Lang.Blocks.turtlelite_note_e, '8'],
                                [Lang.Blocks.turtlelite_note_f, '9'],
                                [Lang.Blocks.turtlelite_note_f_sharp, '10'],
                                [Lang.Blocks.turtlelite_note_g, '11'],
                                [Lang.Blocks.turtlelite_note_g_sharp, '12'],
                                [Lang.Blocks.turtlelite_note_a, '13'],
                                [Lang.Blocks.turtlelite_note_a_sharp, '14'],
                                [Lang.Blocks.turtlelite_note_b, '15'],
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
                        type: 'turtlelite_play_note',
                    },
                    paramsKeyMap: {
                        NOTE: 0,
                        OCTAVE: 1,
                    },
                    class: 'turtlelite_sound',
                    isNotFor: ['TurtleLite'],
                    func(sprite, script) {
                        return Entry.TurtleLite.playNote(script);
                    },
                    syntax: { js: [], py: [] },
                },
                turtlelite_play_note_for_beats: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.turtlelite_note_c, '4'],
                                [Lang.Blocks.turtlelite_note_c_sharp, '5'],
                                [Lang.Blocks.turtlelite_note_d, '6'],
                                [Lang.Blocks.turtlelite_note_d_sharp, '7'],
                                [Lang.Blocks.turtlelite_note_e, '8'],
                                [Lang.Blocks.turtlelite_note_f, '9'],
                                [Lang.Blocks.turtlelite_note_f_sharp, '10'],
                                [Lang.Blocks.turtlelite_note_g, '11'],
                                [Lang.Blocks.turtlelite_note_g_sharp, '12'],
                                [Lang.Blocks.turtlelite_note_a, '13'],
                                [Lang.Blocks.turtlelite_note_a_sharp, '14'],
                                [Lang.Blocks.turtlelite_note_b, '15'],
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
                        type: 'turtlelite_play_note_for_beats',
                    },
                    paramsKeyMap: {
                        NOTE: 0,
                        OCTAVE: 1,
                        BEAT: 2,
                    },
                    class: 'turtlelite_sound',
                    isNotFor: ['TurtleLite'],
                    func(sprite, script) {
                        return Entry.TurtleLite.playNoteBeat(script);
                    },
                    syntax: { js: [], py: [] },
                },
                turtlelite_rest_for_beats: {
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
                        type: 'turtlelite_rest_for_beats',
                    },
                    paramsKeyMap: {
                        BEAT: 0,
                    },
                    class: 'turtlelite_sound',
                    isNotFor: ['TurtleLite'],
                    func(sprite, script) {
                        return Entry.TurtleLite.restBeat(script);
                    },
                    syntax: { js: [], py: [] },
                },
                turtlelite_change_tempo_by: {
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
                        type: 'turtlelite_change_tempo_by',
                    },
                    paramsKeyMap: {
                        BPM: 0,
                    },
                    class: 'turtlelite_sound',
                    isNotFor: ['TurtleLite'],
                    func(sprite, script) {
                        return Entry.TurtleLite.changeTempo(script);
                    },
                    syntax: { js: [], py: [] },
                },
                turtlelite_set_tempo_to: {
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
                        type: 'turtlelite_set_tempo_to',
                    },
                    paramsKeyMap: {
                        BPM: 0,
                    },
                    class: 'turtlelite_sound',
                    isNotFor: ['TurtleLite'],
                    func(sprite, script) {
                        return Entry.TurtleLite.setTempo(script);
                    },
                    syntax: { js: [], py: [] },
                },
            };
        }

        setLanguage() {
            return {
                ko: {
                    template: {
                        turtlelite_button_state: '버튼을 %1 ?',
                        turtlelite_change_buzzer_by: '버저 음을 %1 만큼 바꾸기 %2',
                        turtlelite_change_head_led_by_rgb:
                            '머리 LED를 R: %1 G: %2 B: %3 만큼 바꾸기 %4',
                        turtlelite_change_tempo_by: '연주 속도를 %1 만큼 바꾸기 %2',
                        turtlelite_change_wheel_by: '%1 바퀴 %2 만큼 바꾸기 %3',
                        turtlelite_change_wheels_by_left_right:
                            '왼쪽 바퀴 %1 오른쪽 바퀴 %2 만큼 바꾸기 %3',
                        turtlelite_clear_head_led: '머리 LED 끄기 %1',
                        turtlelite_clear_sound: '소리 끄기 %1',
                        turtlelite_cross_intersection: '검은색 교차로 건너가기 %1',
                        turtlelite_follow_line: '%1 선을 따라가기 %2',
                        turtlelite_follow_line_until: '검은색 선을 따라 %1 까지 이동하기 %2',
                        turtlelite_follow_line_until_black: '%1 선을 따라 검은색까지 이동하기 %2',
                        turtlelite_is_color_pattern: '색깔 패턴이 %1 %2 인가?',
                        turtlelite_move_backward_unit: '뒤로 %1 %2 이동하기 %3',
                        turtlelite_move_forward_unit: '앞으로 %1 %2 이동하기 %3',
                        turtlelite_pivot_around_wheel_unit_in_direction:
                            '%1 바퀴 중심으로 %2 %3 %4 방향으로 돌기 %5',
                        turtlelite_play_note: '%1 %2 음을 연주하기 %3',
                        turtlelite_play_note_for_beats: '%1 %2 음을 %3 박자 연주하기 %4',
                        turtlelite_play_sound_times: '%1 소리 %2 번 재생하기 %3',
                        turtlelite_play_sound_times_until_done:
                            '%1 소리 %2 번 재생하고 기다리기 %3',
                        turtlelite_rest_for_beats: '%1 박자 쉬기 %2',
                        turtlelite_set_buzzer_to: '버저 음을 %1 (으)로 정하기 %2',
                        turtlelite_set_following_speed_to: '선 따라가기 속도를 %1 (으)로 정하기 %2',
                        turtlelite_set_head_led_to: '머리 LED를 %1 으로 정하기 %2',
                        turtlelite_set_head_led_to_rgb:
                            '머리 LED를 R: %1 G: %2 B: %3 (으)로 정하기 %4',
                        turtlelite_set_tempo_to: '연주 속도를 %1 BPM으로 정하기 %2',
                        turtlelite_set_wheel_to: '%1 바퀴 %2 (으)로 정하기 %3',
                        turtlelite_set_wheels_to_left_right:
                            '왼쪽 바퀴 %1 오른쪽 바퀴 %2 (으)로 정하기 %3',
                        turtlelite_stop: '정지하기 %1',
                        turtlelite_touching_color: '%1 에 닿았는가?',
                        turtlelite_turn_at_intersection: '검은색 교차로에서 %1 으로 돌기 %2',
                        turtlelite_turn_unit_in_place: '%1 으로 %2 %3 제자리 돌기 %4',
                        turtlelite_turn_unit_with_radius_in_direction:
                            '%1 으로 %2 %3 반지름 %4 cm를 %5 방향으로 돌기 %6',
                        turtlelite_value: '%1',
                        turtlelite_boolean: '%1?',
                        turtlelite_pick_head_led: '머리 LED를 %1로 정하기 %2',
                    },
                    Helper: {
                        turtlelite_button_state:
                            "등 버튼을 클릭했으면/더블클릭했으면/길게 눌렀으면 '참'으로 판단하고, 아니면 '거짓'으로 판단합니다.",
                        turtlelite_change_buzzer_by:
                            '버저 소리의 현재 음 높이(Hz)에 입력한 값을 더합니다. 소수점 둘째 자리까지 입력할 수 있습니다.',
                        turtlelite_change_head_led_by_rgb:
                            '머리 LED의 현재 R, G, B 값에 입력한 값을 각각 더합니다.',
                        turtlelite_change_tempo_by:
                            '연주하거나 쉬는 속도의 현재 BPM(분당 박자 수)에 입력한 값을 더합니다.',
                        turtlelite_change_wheel_by:
                            '왼쪽/오른쪽/양쪽 바퀴의 현재 속도 값(%)에 입력한 값을 더합니다. 더한 결과가 양수 값이면 바퀴가 앞으로 회전하고, 음수 값이면 뒤로 회전합니다.',
                        turtlelite_change_wheels_by_left_right:
                            '왼쪽과 오른쪽 바퀴의 현재 속도 값(%)에 입력한 값을 각각 더합니다. 더한 결과가 양수 값이면 바퀴가 앞으로 회전하고, 음수 값이면 뒤로 회전합니다.',
                        turtlelite_clear_head_led: '머리 LED를 끕니다.',
                        turtlelite_clear_sound: '소리를 끕니다.',
                        turtlelite_cross_intersection:
                            '검은색 교차로에서 잠시 앞으로 이동한 후 검은색 선을 찾아 다시 이동합니다.',
                        turtlelite_follow_line:
                            '하얀색 바탕 위에서 선택한 색깔의 선을 따라 이동합니다.',
                        turtlelite_follow_line_until:
                            '하얀색 바탕 위에서 검은색 선을 따라 이동하다가 선택한 색깔을 컬러 센서가 감지하면 정지합니다.',
                        turtlelite_follow_line_until_black:
                            '하얀색 바탕 위에서 선택한 색깔의 선을 따라 이동하다가 컬러 센서가 검은색을 감지하면 정지합니다.',
                        turtlelite_is_color_pattern:
                            "선택한 색깔 패턴을 컬러 센서가 감지하였으면 '참'으로 판단하고, 아니면 '거짓'으로 판단합니다.",
                        turtlelite_move_backward_unit:
                            '입력한 거리(cm)/시간(초)/펄스만큼 뒤로 이동합니다.',
                        turtlelite_move_forward_unit:
                            '입력한 거리(cm)/시간(초)/펄스만큼 앞으로 이동합니다.',
                        turtlelite_pivot_around_wheel_unit_in_direction:
                            '왼쪽/오른쪽 바퀴 중심으로 입력한 각도(도)/시간(초)/펄스만큼 머리/꼬리 방향으로 회전합니다.',
                        turtlelite_play_note: '선택한 계이름과 옥타브의 음을 계속 소리 냅니다.',
                        turtlelite_play_note_for_beats:
                            '선택한 계이름과 옥타브의 음을 입력한 박자만큼 소리 냅니다.',
                        turtlelite_play_sound_times: '선택한 소리를 입력한 횟수만큼 재생합니다.',
                        turtlelite_play_sound_times_until_done:
                            '선택한 소리를 입력한 횟수만큼 재생하고, 재생이 완료될 때까지 기다립니다.',
                        turtlelite_rest_for_beats: '입력한 박자만큼 쉽니다.',
                        turtlelite_set_buzzer_to:
                            '버저 소리의 음 높이를 입력한 값(Hz)으로 설정합니다. 소수점 둘째 자리까지 입력할 수 있습니다. 숫자 0을 입력하면 소리를 끕니다.',
                        turtlelite_set_following_speed_to:
                            '선을 따라 이동하는 속도(1 ~ 8)를 설정합니다. 숫자가 클수록 이동하는 속도가 빠릅니다.',
                        turtlelite_set_head_led_to: '머리 LED를 선택한 색깔로 켭니다.',
                        turtlelite_set_head_led_to_rgb:
                            '머리 LED의 R, G, B 값을 입력한 값으로 각각 설정합니다.',
                        turtlelite_set_tempo_to:
                            '연주하거나 쉬는 속도를 입력한 BPM(분당 박자 수)으로 설정합니다.',
                        turtlelite_set_wheel_to:
                            '왼쪽/오른쪽/양쪽 바퀴의 속도를 입력한 값(-400 ~ 400%)으로 설정합니다. 양수 값을 입력하면 바퀴가 앞으로 회전하고, 음수 값을 입력하면 뒤로 회전합니다. 숫자 0을 입력하면 정지합니다.',
                        turtlelite_set_wheels_to_left_right:
                            '왼쪽과 오른쪽 바퀴의 속도를 입력한 값(-400 ~ 400%)으로 각각 설정합니다. 양수 값을 입력하면 바퀴가 앞으로 회전하고, 음수 값을 입력하면 뒤로 회전합니다. 숫자 0을 입력하면 정지합니다.',
                        turtlelite_stop: '양쪽 바퀴를 정지합니다.',
                        turtlelite_touching_color:
                            "선택한 색깔을 컬러 센서가 감지하였으면 '참'으로 판단하고, 아니면 '거짓'으로 판단합니다.",
                        turtlelite_turn_at_intersection:
                            '검은색 교차로에서 잠시 앞으로 이동한 후 제자리에서 왼쪽/오른쪽/뒤쪽으로 회전하고 검은색 선을 찾아 다시 이동합니다.',
                        turtlelite_turn_unit_in_place:
                            '입력한 각도(도)/시간(초)/펄스만큼 왼쪽/오른쪽 방향으로 제자리에서 회전합니다.',
                        turtlelite_turn_unit_with_radius_in_direction:
                            '입력한 반지름의 원을 그리면서 입력한 각도(도)/시간(초)/펄스만큼 왼쪽/오른쪽, 머리/꼬리 방향으로 회전합니다.',
                        turtlelite_value:
                            '색깔 번호: 컬러 센서가 감지한 색깔의 번호 (값의 범위: -1 ~ 8, 초기값: -1)<br/>색깔 패턴: 컬러 센서가 감지한 색깔 패턴의 값 (값의 범위: -1 ~ 88, 초기값: -1)<br/>바닥 센서: 바닥 센서의 값 (값의 범위: 0 ~ 100, 초기값: 0)<br/>버튼: 거북이 등 버튼의 상태 값 (누르면 1, 아니면 0, 초기값: 0)<br/>x축 가속도: 가속도 센서의 X축 값 (값의 범위: -32768 ~ 32767, 초기값: 0) 로봇이 전진하는 방향이 X축의 양수 방향입니다.<br/>y축 가속도: 가속도 센서의 Y축 값 (값의 범위: -32768 ~ 32767, 초기값: 0) 로봇의 왼쪽 방향이 Y축의 양수 방향입니다.<br/>z축 가속도: 가속도 센서의 Z축 값 (값의 범위: -32768 ~ 32767, 초기값: 0) 로봇의 위쪽 방향이 Z축의 양수 방향입니다.',
                        turtlelite_boolean:
                            "앞으로 기울임: 앞으로 기울이면 '참'으로 판단하고, 아니면 '거짓'으로 판단합니다.<br/>뒤로 기울임: 뒤로 기울이면 '참'으로 판단하고, 아니면 '거짓'으로 판단합니다.<br/>왼쪽으로 기울임: 왼쪽으로 기울이면 '참'으로 판단하고, 아니면 '거짓'으로 판단합니다.<br/>오른쪽으로 기울임: 오른쪽으로 기울이면 '참'으로 판단하고, 아니면 '거짓'으로 판단합니다.<br/>거꾸로 뒤집음: 거꾸로 뒤집으면 '참'으로 판단하고, 아니면 '거짓'으로 판단합니다.<br/>기울이지 않음: 기울이지 않으면 '참'으로 판단하고, 아니면 '거짓'으로 판단합니다.<br/>배터리 정상: 배터리 잔량이 충분하면 '참'으로 판단하고, 아니면 '거짓'으로 판단합니다.<br/>배터리 부족: 배터리 잔량이 부족하면 '참'으로 판단하고, 아니면 '거짓'으로 판단합니다.<br/>배터리 없음: 배터리 잔량이 없으면 '참'으로 판단하고, 아니면 '거짓'으로 판단합니다.",
                        turtlelite_pick_head_led: '머리 LED를 선택한 색깔로 켭니다.',
                    },
                    Blocks: {
                        turtlelite_acceleration_x: 'x축 가속도',
                        turtlelite_acceleration_y: 'y축 가속도',
                        turtlelite_acceleration_z: 'z축 가속도',
                        turtlelite_back: '뒤쪽',
                        turtlelite_both: '양쪽',
                        turtlelite_button: '버튼',
                        turtlelite_buzzer: '버저',
                        turtlelite_clicked: '클릭했는가',
                        turtlelite_color_any: '아무 색',
                        turtlelite_color_black: '검은색',
                        turtlelite_color_blue: '파란색',
                        turtlelite_color_green: '초록색',
                        turtlelite_color_number: '색깔 번호',
                        turtlelite_color_orange: '주황색',
                        turtlelite_color_pattern: '색깔 패턴',
                        turtlelite_color_purple: '자주색',
                        turtlelite_color_red: '빨간색',
                        turtlelite_color_sky_blue: '하늘색',
                        turtlelite_color_violet: '보라색',
                        turtlelite_color_white: '하얀색',
                        turtlelite_color_yellow: '노란색',
                        turtlelite_double_clicked: '더블클릭했는가',
                        turtlelite_floor: '바닥 센서',
                        turtlelite_head: '머리',
                        turtlelite_head_color: '머리 색깔',
                        turtlelite_left: '왼쪽',
                        turtlelite_left_wheel: '왼쪽 바퀴',
                        turtlelite_long_pressed: '길게~눌렀는가',
                        turtlelite_note: '음표',
                        turtlelite_right: '오른쪽',
                        turtlelite_right_wheel: '오른쪽 바퀴',
                        turtlelite_sound_beep: '삐',
                        turtlelite_sound_birthday: '생일',
                        turtlelite_sound_dibidibidip: '디비디비딥',
                        turtlelite_sound_engine: '엔진',
                        turtlelite_sound_good_job: '잘 했어요',
                        turtlelite_sound_march: '행진',
                        turtlelite_sound_random_beep: '무작위 삐',
                        turtlelite_sound_robot: '로봇',
                        turtlelite_sound_siren: '사이렌',
                        turtlelite_tail: '꼬리',
                        turtlelite_unit_cm: 'cm',
                        turtlelite_unit_deg: '도',
                        turtlelite_unit_pulse: '펄스',
                        turtlelite_unit_sec: '초',
                        turtlelite_note_c: '도',
                        turtlelite_note_c_sharp: '도♯(레♭)',
                        turtlelite_note_d: '레',
                        turtlelite_note_d_sharp: '레♯(미♭)',
                        turtlelite_note_e: '미',
                        turtlelite_note_f: '파',
                        turtlelite_note_f_sharp: '파♯(솔♭)',
                        turtlelite_note_g: '솔',
                        turtlelite_note_g_sharp: '솔♯(라♭)',
                        turtlelite_note_a: '라',
                        turtlelite_note_a_sharp: '라♯(시♭)',
                        turtlelite_note_b: '시',
                        turtlelite_tilt_forward: '앞으로 기울임',
                        turtlelite_tilt_backward: '뒤로 기울임',
                        turtlelite_tilt_left: '왼쪽으로 기울임',
                        turtlelite_tilt_right: '오른쪽으로 기울임',
                        turtlelite_tilt_flip: '거꾸로 뒤집음',
                        turtlelite_tilt_not: '기울이지 않음',
                        turtlelite_battery_normal: '배터리 정상',
                        turtlelite_battery_low: '배터리 부족',
                        turtlelite_battery_empty: '배터리 없음',
                    },
                },
                en: {
                    template: {
                        turtlelite_button_state: 'button %1 ?',
                        turtlelite_change_buzzer_by: 'change buzzer by %1 %2',
                        turtlelite_change_head_led_by_rgb:
                            'change head led by r: %1 g: %2 b: %3 %4',
                        turtlelite_change_tempo_by: 'change tempo by %1 %2',
                        turtlelite_change_wheel_by: 'change %1 wheel by %2 %3',
                        turtlelite_change_wheels_by_left_right:
                            'change wheels by left: %1 right: %2 %3',
                        turtlelite_clear_head_led: 'clear head led %1',
                        turtlelite_clear_sound: 'clear sound %1',
                        turtlelite_cross_intersection: 'cross black intersection %1',
                        turtlelite_follow_line: 'follow %1 line %2',
                        turtlelite_follow_line_until: 'follow black line until %1 %2',
                        turtlelite_follow_line_until_black: 'follow %1 line until black %2',
                        turtlelite_is_color_pattern: 'color pattern %1 %2 ?',
                        turtlelite_move_backward_unit: 'move backward %1 %2 %3',
                        turtlelite_move_forward_unit: 'move forward %1 %2 %3',
                        turtlelite_pivot_around_wheel_unit_in_direction:
                            'pivot around %1 wheel %2 %3 in %4 direction %5',
                        turtlelite_play_note: 'play note %1 %2 %3',
                        turtlelite_play_note_for_beats: 'play note %1 %2 for %3 beats %4',
                        turtlelite_play_sound_times: 'play sound %1 %2 times %3',
                        turtlelite_play_sound_times_until_done:
                            'play sound %1 %2 times until done %3',
                        turtlelite_rest_for_beats: 'rest for %1 beats %2',
                        turtlelite_set_buzzer_to: 'set buzzer to %1 %2',
                        turtlelite_set_following_speed_to: 'set following speed to %1 %2',
                        turtlelite_set_head_led_to: 'set head led to %1 %2',
                        turtlelite_set_head_led_to_rgb: 'set head led to r: %1 g: %2 b: %3 %4',
                        turtlelite_set_tempo_to: 'set tempo to %1 bpm %2',
                        turtlelite_set_wheel_to: 'set %1 wheel to %2 %3',
                        turtlelite_set_wheels_to_left_right: 'set wheels to left: %1 right: %2 %3',
                        turtlelite_stop: 'stop %1',
                        turtlelite_touching_color: 'touching %1 ?',
                        turtlelite_turn_at_intersection: 'turn %1 at black intersection %2',
                        turtlelite_turn_unit_in_place: 'turn %1 %2 %3 in place %4',
                        turtlelite_turn_unit_with_radius_in_direction:
                            'turn %1 %2 %3 with radius %4 cm in %5 direction %6',
                        turtlelite_value: '%1',
                        turtlelite_boolean: '%1?',
                        turtlelite_pick_head_led: 'set head led to %1 %2',
                    },
                    Helper: {
                        turtlelite_button_state:
                            'If the button clicked/double-clicked/long-pressed, true, otherwise false.',
                        turtlelite_change_buzzer_by:
                            'Adds the entered value to the current pitch (Hz) of the buzzer sound. You can enter up to two decimal places.',
                        turtlelite_change_head_led_by_rgb:
                            'Adds the entered values to the current R, G, B values of the head LED, respectively.',
                        turtlelite_change_tempo_by:
                            'Adds the entered value to the current BPM (beats per minute) of the playing or resting speed.',
                        turtlelite_change_wheel_by:
                            'Adds the entered value to the current speed value (%) of the left/right/both wheels. If the result is positive, the wheel rotates forward; if negative, the wheel rotates backward.',
                        turtlelite_change_wheels_by_left_right:
                            'Adds the entered values to the current speed values (%) of the left and right wheels respectively. If the result is positive, the wheel rotates forward; if negative, the wheel rotates backward.',
                        turtlelite_clear_head_led: 'Turns off the head LED.',
                        turtlelite_clear_sound: 'Turns off sound.',
                        turtlelite_cross_intersection:
                            'Moves forward for a moment at the black intersection, then finds the black line and moves again.',
                        turtlelite_follow_line:
                            'Moves along the selected color line on a white background.',
                        turtlelite_follow_line_until:
                            'Moves along the black line on a white background and stops when the color sensor detects the selected color.',
                        turtlelite_follow_line_until_black:
                            'Moves along the selected color line on a white background and stops when the color sensor detects black.',
                        turtlelite_is_color_pattern:
                            'If the color sensor detects the selected color pattern, true, otherwise false.',
                        turtlelite_move_backward_unit:
                            'Moves backward for the number of cm/seconds/pulses entered.',
                        turtlelite_move_forward_unit:
                            'Moves forward for the number of cm/seconds/pulses entered.',
                        turtlelite_pivot_around_wheel_unit_in_direction:
                            'Pivots around the left/right wheel in the head/tail direction for the number of degrees/seconds/pulses entered.',
                        turtlelite_play_note: 'It sounds the selected tone and octave.',
                        turtlelite_play_note_for_beats:
                            'It sounds the selected tone and octave as much as the beat you entered.',
                        turtlelite_play_sound_times:
                            'Plays the selected sound as many times as entered.',
                        turtlelite_play_sound_times_until_done:
                            'Plays the selected sound as many times as entered, and waits for completion.',
                        turtlelite_rest_for_beats: 'Rests as much as the beat you entered.',
                        turtlelite_set_buzzer_to:
                            'Sets the pitch of the buzzer sound to the entered value (Hz). You can enter up to two decimal places. Entering the number 0 turns off the buzzer sound.',
                        turtlelite_set_following_speed_to:
                            'Sets the speed (1 to 8) to move along the line. The larger the number, the faster the movement.',
                        turtlelite_set_head_led_to: 'Turns the head LED to the selected color.',
                        turtlelite_set_head_led_to_rgb:
                            'Sets the R, G, B values of the head LED to the entered values.',
                        turtlelite_set_tempo_to:
                            'Sets the playing or resting speed to the entered BPM (beats per minute).',
                        turtlelite_set_wheel_to:
                            'Sets the speed of the left/right/both wheels to the entered value (-400 to 400%). If you enter a positive value, the wheel rotates forward. If you enter a negative value, the wheel rotates backward. Entering the number 0 stops it.',
                        turtlelite_set_wheels_to_left_right:
                            'Sets the speed of the left and right wheels to the entered values (-400 to 400%), respectively. If you enter a positive value, the wheel rotates forward. If you enter a negative value, the wheel rotates backward. Entering the number 0 stops it.',
                        turtlelite_stop: 'Stops both wheels.',
                        turtlelite_touching_color:
                            'If the color sensor detects the selected color, true, otherwise false.',
                        turtlelite_turn_at_intersection:
                            'Moves forward for a moment at the black intersection, then turns left/right/back in place, finds the black line and moves again.',
                        turtlelite_turn_unit_in_place:
                            'Turns left/right in place for the number of degrees/seconds/pulses entered.',
                        turtlelite_turn_unit_with_radius_in_direction:
                            'Turns left/right drawing the circle of the entered radius in the head/tail direction for the number of degrees/seconds/pulses entered.',
                        turtlelite_value:
                            'color number: color number detected by the color sensor (range: -1 to 8, initial value: -1)<br/>color pattern: value of the color pattern detected by the color sensor (range: -1 ~ 88, initial value: -1) <br/>floor: value of floor sensor (range: 0 to 100, initial value: 0)<br/>button: status of the button (when pressed 1, otherwise 0, initial value: 0)<br/>x acceleration: x-axis value of acceleration sensor (range: -32768 to 32767, initial value: 0) The direction in which the robot moves forward is the positive direction of the x axis.<br/>y acceleration: y-axis value of acceleration sensor (range: -32768 to 32767, initial value: 0) The left direction of the robot is the positive direction of the y axis.<br/>z acceleration: z-axis value of acceleration sensor (range: -32768 to 32767, initial value: 0) The upward direction of the robot is the positive direction of the z axis.',
                        turtlelite_boolean:
                            'tilt forward: If tilted forward, true, otherwise false<br/>tilt backward: If tilted backward, true, otherwise false<br/>tilt left: If tilted to the left, true, otherwise false<br/>tilt right: If tilted to the right, true, otherwise false<br/>tilt flip: If upside-down, true, otherwise false<br/>not tilt: If not tilted, true, otherwise false<br/>battery normal: If the battery is enough, true, otherwise false<br/>battery low: If the battery is low, true, otherwise false<br/>battery empty: If the battery is empty, true, otherwise false',
                        turtlelite_pick_head_led: 'Turns the head LED to the selected color.',
                    },
                    Blocks: {
                        turtlelite_acceleration_x: 'x acceleration',
                        turtlelite_acceleration_y: 'y acceleration',
                        turtlelite_acceleration_z: 'z acceleration',
                        turtlelite_back: 'back',
                        turtlelite_both: 'both',
                        turtlelite_button: 'button',
                        turtlelite_buzzer: 'buzzer',
                        turtlelite_clicked: 'clicked',
                        turtlelite_color_any: 'any color',
                        turtlelite_color_black: 'black',
                        turtlelite_color_blue: 'blue',
                        turtlelite_color_green: 'green',
                        turtlelite_color_number: 'color number',
                        turtlelite_color_orange: 'orange',
                        turtlelite_color_pattern: 'color pattern',
                        turtlelite_color_purple: 'purple',
                        turtlelite_color_red: 'red',
                        turtlelite_color_sky_blue: 'sky blue',
                        turtlelite_color_violet: 'violet',
                        turtlelite_color_white: 'white',
                        turtlelite_color_yellow: 'yellow',
                        turtlelite_double_clicked: 'double-clicked',
                        turtlelite_floor: 'floor',
                        turtlelite_head: 'head',
                        turtlelite_head_color: 'head color',
                        turtlelite_left: 'left',
                        turtlelite_left_wheel: 'left wheel',
                        turtlelite_long_pressed: 'long-pressed',
                        turtlelite_note: 'note',
                        turtlelite_right: 'right',
                        turtlelite_right_wheel: 'right wheel',
                        turtlelite_sound_beep: 'beep',
                        turtlelite_sound_birthday: 'birthday',
                        turtlelite_sound_dibidibidip: 'dibidibidip',
                        turtlelite_sound_engine: 'engine',
                        turtlelite_sound_good_job: 'good job',
                        turtlelite_sound_march: 'march',
                        turtlelite_sound_random_beep: 'random beep',
                        turtlelite_sound_robot: 'robot',
                        turtlelite_sound_siren: 'siren',
                        turtlelite_tail: 'tail',
                        turtlelite_unit_cm: 'cm',
                        turtlelite_unit_deg: 'degrees',
                        turtlelite_unit_pulse: 'pulses',
                        turtlelite_unit_sec: 'seconds',
                        turtlelite_note_c: 'C',
                        turtlelite_note_c_sharp: 'C♯(D♭)',
                        turtlelite_note_d: 'D',
                        turtlelite_note_d_sharp: 'D♯(E♭)',
                        turtlelite_note_e: 'E',
                        turtlelite_note_f: 'F',
                        turtlelite_note_f_sharp: 'F♯(G♭)',
                        turtlelite_note_g: 'G',
                        turtlelite_note_g_sharp: 'G♯(A♭)',
                        turtlelite_note_a: 'A',
                        turtlelite_note_a_sharp: 'A♯(B♭)',
                        turtlelite_note_b: 'B',
                        turtlelite_tilt_forward: 'tilt forward',
                        turtlelite_tilt_backward: 'tilt backward',
                        turtlelite_tilt_left: 'tilt left',
                        turtlelite_tilt_right: 'tilt right',
                        turtlelite_tilt_flip: 'tilt flip',
                        turtlelite_tilt_not: 'not tilt',
                        turtlelite_battery_normal: 'battery normal',
                        turtlelite_battery_low: 'battery low',
                        turtlelite_battery_empty: 'battery empty',
                    },
                },
                jp: {
                    template: {
                        turtlelite_button_state: '背中を %1 した？',
                        turtlelite_change_buzzer_by: 'ブザー音の高さを %1 だけ変えて鳴らす %2',
                        turtlelite_change_head_led_by_rgb:
                            '頭のLEDの色をR（赤：あか） %1  G（緑：みどり） %2  B（青：あお） %3 だけ変える %4',
                        turtlelite_change_tempo_by: '演奏の速さを %1 だけ変える %2',
                        turtlelite_change_wheel_by:
                            '%1 の車輪（しゃりん）の速さを %2 だけ変える %3',
                        turtlelite_change_wheels_by_left_right:
                            '車輪（しゃりん）の速さを左 %1 右 %2 だけ変える %3',
                        turtlelite_clear_head_led: '頭のLEDを消す %1',
                        turtlelite_clear_sound: '音を消す %1',
                        turtlelite_cross_intersection: '黒の線が交わる点を渡る %1',
                        turtlelite_follow_line: '%1 の線にそって移動する %2',
                        turtlelite_follow_line_until: '黒の線にそって %1 まで移動する %2',
                        turtlelite_follow_line_until_black: '%1 の線にそって黒まで移動する %2',
                        turtlelite_is_color_pattern: '色の順番 %1 %2 を感知した?',
                        turtlelite_move_backward_unit: '後ろへ %1 %2 移動する %3',
                        turtlelite_move_forward_unit: '前へ %1 %2 移動する %3',
                        turtlelite_pivot_around_wheel_unit_in_direction:
                            '%1 の車輪を中心に %2 %3 %4 方向に回る %5',
                        turtlelite_play_note: '%1 %2 を演奏する %3',
                        turtlelite_play_note_for_beats: '%1 %2 を %3 拍演奏する %4',
                        turtlelite_play_sound_times: '音 %1 を %2 回鳴らす %3',
                        turtlelite_play_sound_times_until_done:
                            '音 %1 を %2 回鳴らして終わるまで待つ %3',
                        turtlelite_rest_for_beats: '%1 拍休む %2',
                        turtlelite_set_buzzer_to: 'ブザー音の高さを %1 にして鳴らす %2',
                        turtlelite_set_following_speed_to: '線にそって移動する速さを %1 にする %2',
                        turtlelite_set_head_led_to: '頭のLEDの色を %1 にする %2',
                        turtlelite_set_head_led_to_rgb:
                            '頭のLEDの色をR（赤：あか） %1  G（緑：みどり） %2  B（青：あお） %3 にする %4',
                        turtlelite_set_tempo_to: '演奏の速さを1分間に %1 拍にする %2',
                        turtlelite_set_wheel_to: '%1 の車輪（しゃりん）の速さを %2 にする %3',
                        turtlelite_set_wheels_to_left_right:
                            '車輪（しゃりん）の速さを左 %1 右 %2 にする %3',
                        turtlelite_stop: '移動を停止する %1',
                        turtlelite_touching_color: '%1 を感知した？',
                        turtlelite_turn_at_intersection: '黒の線が交わる点で %1 へ方向を変える %2',
                        turtlelite_turn_unit_in_place: '%1 へ %2 %3 その場で回る %4',
                        turtlelite_turn_unit_with_radius_in_direction:
                            '%1 へ %2 %3 半径 %4 cmで %5 方向に回る %6',
                        turtlelite_value: '%1',
                        turtlelite_boolean: '%1?',
                        turtlelite_pick_head_led: '頭のLEDの色を %1 にする %2',
                    },
                    Helper: {
                        turtlelite_button_state:
                            '背中（ボタン）が[クリック/ダブルクリック/長押し]された場合は｢正しい｣と判断します。それ以外の場合は｢正しくない｣と判断します。',
                        turtlelite_change_buzzer_by:
                            'ブザーの現在の音の高さ（ヘルツ）に入力された数値を足して鳴らします。小数点以下2桁まで入力できます。',
                        turtlelite_change_head_led_by_rgb:
                            '頭のLEDライトの色に、入力されたR（赤：あか）、G（緑：みどり）、B（青：あお）の数値（範囲:0～255）を足します。',
                        turtlelite_change_tempo_by:
                            '入力された数値を現在の演奏速度（１分あたりの拍数）に足します。',
                        turtlelite_change_wheel_by:
                            '[左/右]の車輪（しゃりん）の速さ（%）に入力された数値を足します。足した結果が、正の数の場合は前方向に、負の数の場合は後方向に、車輪が回転します。',
                        turtlelite_change_wheels_by_left_right:
                            '左右の車輪（しゃりん）の速さ（%）にそれぞれ入力された数値を足します。足した結果が、正の数の場合は前方向に、負の数の場合は後方向に、車輪が回転します。',
                        turtlelite_clear_head_led: '頭のLEDライトを消します。',
                        turtlelite_clear_sound: '音を消します。',
                        turtlelite_cross_intersection:
                            '黒の線が交わる点を越えて、前方の黒の線にそって移動します。',
                        turtlelite_follow_line: '白地の上の選択された色の線にそって移動します。',
                        turtlelite_follow_line_until:
                            '白地の上の黒の線にそって移動し、カラーセンサーが選択された色を感知したら停止します。',
                        turtlelite_follow_line_until_black:
                            '白地の上の選択された色の線にそって移動し、カラーセンサーが黒を感知したら停止します。',
                        turtlelite_is_color_pattern:
                            'カラーセンサーが選択された色の順番（パターン）を感知した場合は｢正しい｣と判断します。それ以外の場合は｢正しくない｣と判断します。',
                        turtlelite_move_backward_unit:
                            '入力された数値[cm/秒/パルス]だけ後方向に移動します。',
                        turtlelite_move_forward_unit:
                            '入力された数値[cm/秒/パルス]だけ前方向に移動します。',
                        turtlelite_pivot_around_wheel_unit_in_direction:
                            '[左/右]の車輪を中心に、入力された数値[角度/秒/パルス]だけ、[前/後]方向に回転します。',
                        turtlelite_play_note: '選択された音階（音名、オクターブ）が鳴ります。',
                        turtlelite_play_note_for_beats:
                            '選択された音階（音名、オクターブ）が、入力された拍数分鳴ります。',
                        turtlelite_play_sound_times: '選択された音を入力された回数だけ再生します。',
                        turtlelite_play_sound_times_until_done:
                            '選択された音を入力された回数だけ再生します。再生が終わってから次の命令を実行します。',
                        turtlelite_rest_for_beats: '入力された拍数分だけ音を鳴らすのを休みます。',
                        turtlelite_set_buzzer_to:
                            'ブザーの現在の音の高さ（ヘルツ）を入力された数値にして鳴らします。小数点以下2桁まで入力できます。',
                        turtlelite_set_following_speed_to:
                            '線にそって移動する速度（範囲：1〜8）を入力された数値にします。数字が大きいほど動きが速くなります。',
                        turtlelite_set_head_led_to: '頭のLEDライトを選択された色にします。',
                        turtlelite_set_head_led_to_rgb:
                            '頭のLEDライトを入力されたR（赤：あか）、G（緑：みどり）、B（青：あお）の数値（範囲:0～255）の色にします。',
                        turtlelite_set_tempo_to:
                            '入力された数値を現在の演奏速度（１分あたりの拍数）にします。',
                        turtlelite_set_wheel_to:
                            '[左/右]の車輪（しゃりん）の速さ（範囲：-400～400%）を入力された数値にします。正の数の場合は前方向に、負の数の場合は後方向に、車輪が回転します。0を入力すると車輪が停止します。',
                        turtlelite_set_wheels_to_left_right:
                            '左右の車輪（しゃりん）の速さ（範囲：-400～400%）をそれぞれ入力された数値にします。正の数の場合は前方向に、負の数の場合は後方向に、車輪が回転します。0を入力すると車輪が停止します。',
                        turtlelite_stop: '移動を停止します。',
                        turtlelite_touching_color:
                            'カラーセンサーが選択された色を感知した場合は｢正しい｣と判断します。それ以外の場合は｢正しくない｣と判断します。',
                        turtlelite_turn_at_intersection:
                            '黒の線が交わる点で[左/右/後]方向に回転して、黒い線にそって移動します。',
                        turtlelite_turn_unit_in_place:
                            '入力された数値[角度/秒/パルス]だけ、その場で[左/右]に回転します。',
                        turtlelite_turn_unit_with_radius_in_direction:
                            '入力された数値[角度/秒/パルス]だけ、入力された半径（cm）で、[前/後]方向に回転します。',
                        turtlelite_value:
                            '色番号：カラーセンサーが感知した色の番号（範囲：-1〜8、初期値：-1）<br/>色のパターン：カラーセンサーが感知した色のパターンの値（範囲：-1〜88、初期値：-1）<br/>床センサー：床センサーの値（範囲：0〜100、初期値：0）<br/>ボタン：ボタンの状態（クリックした時：1、それ以外：0、初期値：0）<br/>前後の速さ：加速度センサーの前後（x軸）の速さの値（範囲：-32768〜32767、初期値：0）タートルが前進する方向はx軸の正方向です。<br/>左右の速さ：加速度センサーの左右（y軸）の速さの値（範囲：-32768〜32767、初期値：0）タートルの左方向がy軸の正方向です。<br/>上下の速さ：加速度センサーの上下（z軸）の速さの値（範囲：-32768〜32767、初期値：0）タートルの上方向がz軸の正方向です。<br/>',
                        turtlelite_boolean:
                            'tilt forward: If tilted forward, true, otherwise false<br/>tilt backward: If tilted backward, true, otherwise false<br/>tilt left: If tilted to the left, true, otherwise false<br/>tilt right: If tilted to the right, true, otherwise false<br/>tilt flip: If upside-down, true, otherwise false<br/>not tilt: If not tilted, true, otherwise false<br/>battery normal: If the battery is enough, true, otherwise false<br/>battery low: If the battery is low, true, otherwise false<br/>battery empty: If the battery is empty, true, otherwise false',
                        turtlelite_pick_head_led: '頭のLEDライトを選択された色にします。',
                    },
                    Blocks: {
                        turtlelite_acceleration_x: '前後の速さ',
                        turtlelite_acceleration_y: '左右の速さ',
                        turtlelite_acceleration_z: '上下の速さ',
                        turtlelite_back: '後',
                        turtlelite_both: '両方',
                        turtlelite_button: 'ボタン',
                        turtlelite_buzzer: 'ブザー',
                        turtlelite_clicked: 'クリック',
                        turtlelite_color_any: 'すべての色',
                        turtlelite_color_black: '黒',
                        turtlelite_color_blue: '青',
                        turtlelite_color_green: '緑',
                        turtlelite_color_number: '色番号',
                        turtlelite_color_orange: 'オレンジ',
                        turtlelite_color_pattern: '色のパターン',
                        turtlelite_color_purple: '紫',
                        turtlelite_color_red: '赤',
                        turtlelite_color_sky_blue: '水色',
                        turtlelite_color_violet: '赤紫',
                        turtlelite_color_white: '白',
                        turtlelite_color_yellow: '黄色',
                        turtlelite_double_clicked: 'ダブルクリック',
                        turtlelite_floor: '床センサー',
                        turtlelite_head: '前',
                        turtlelite_head_color: '頭のLEDの色',
                        turtlelite_left: '左',
                        turtlelite_left_wheel: '左の車輪',
                        turtlelite_long_pressed: '長押し',
                        turtlelite_note: '音符',
                        turtlelite_right: '右',
                        turtlelite_right_wheel: '右の車輪',
                        turtlelite_sound_beep: 'ビープ音',
                        turtlelite_sound_birthday: '誕生日',
                        turtlelite_sound_dibidibidip: 'ディビディビディップ',
                        turtlelite_sound_engine: 'エンジン',
                        turtlelite_sound_good_job: 'よくできました',
                        turtlelite_sound_march: '行進',
                        turtlelite_sound_random_beep: 'ビープ音のどれか',
                        turtlelite_sound_robot: 'ロボット',
                        turtlelite_sound_siren: 'サイレン',
                        turtlelite_tail: '後',
                        turtlelite_unit_cm: 'cm',
                        turtlelite_unit_deg: '°',
                        turtlelite_unit_pulse: 'パルス',
                        turtlelite_unit_sec: '秒',
                        turtlelite_note_c: 'ド',
                        turtlelite_note_c_sharp: 'ド♯(レ♭)',
                        turtlelite_note_d: 'レ',
                        turtlelite_note_d_sharp: 'レ♯(ミ♭)',
                        turtlelite_note_e: 'ミ',
                        turtlelite_note_f: 'ファ',
                        turtlelite_note_f_sharp: 'ファ♯(ソ♭)',
                        turtlelite_note_g: 'ソ',
                        turtlelite_note_g_sharp: 'ソ♯(ラ♭)',
                        turtlelite_note_a: 'ラ',
                        turtlelite_note_a_sharp: 'ラ♯(シ♭)',
                        turtlelite_note_b: 'シ',
                        turtlelite_tilt_forward: '前に傾けたか',
                        turtlelite_tilt_backward: '後に傾けたか',
                        turtlelite_tilt_left: '左に傾けたか',
                        turtlelite_tilt_right: '右に傾けたか',
                        turtlelite_tilt_flip: '上下裏返したか',
                        turtlelite_tilt_not: '傾けなかったか',
                        turtlelite_battery_normal: '電池が正常か',
                        turtlelite_battery_low: '電池が足りないか',
                        turtlelite_battery_empty: '電池がないか',
                    },
                },
                vn: {
                    template: {
                        turtlelite_button_state: 'button %1 ?',
                        turtlelite_change_buzzer_by: 'change buzzer by %1 %2',
                        turtlelite_change_head_led_by_rgb:
                            'change head led by r: %1 g: %2 b: %3 %4',
                        turtlelite_change_tempo_by: 'change tempo by %1 %2',
                        turtlelite_change_wheel_by: 'change %1 wheel by %2 %3',
                        turtlelite_change_wheels_by_left_right:
                            'change wheels by left: %1 right: %2 %3',
                        turtlelite_clear_head_led: 'clear head led %1',
                        turtlelite_clear_sound: 'clear sound %1',
                        turtlelite_cross_intersection: 'cross black intersection %1',
                        turtlelite_follow_line: 'follow %1 line %2',
                        turtlelite_follow_line_until: 'follow black line until %1 %2',
                        turtlelite_follow_line_until_black: 'follow %1 line until black %2',
                        turtlelite_is_color_pattern: 'color pattern %1 %2 ?',
                        turtlelite_move_backward_unit: 'move backward %1 %2 %3',
                        turtlelite_move_forward_unit: 'move forward %1 %2 %3',
                        turtlelite_pivot_around_wheel_unit_in_direction:
                            'pivot around %1 wheel %2 %3 in %4 direction %5',
                        turtlelite_play_note: 'play note %1 %2 %3',
                        turtlelite_play_note_for_beats: 'play note %1 %2 for %3 beats %4',
                        turtlelite_play_sound_times: 'play sound %1 %2 times %3',
                        turtlelite_play_sound_times_until_done:
                            'play sound %1 %2 times until done %3',
                        turtlelite_rest_for_beats: 'rest for %1 beats %2',
                        turtlelite_set_buzzer_to: 'set buzzer to %1 %2',
                        turtlelite_set_following_speed_to: 'set following speed to %1 %2',
                        turtlelite_set_head_led_to: 'set head led to %1 %2',
                        turtlelite_set_head_led_to_rgb: 'set head led to r: %1 g: %2 b: %3 %4',
                        turtlelite_set_tempo_to: 'set tempo to %1 bpm %2',
                        turtlelite_set_wheel_to: 'set %1 wheel to %2 %3',
                        turtlelite_set_wheels_to_left_right: 'set wheels to left: %1 right: %2 %3',
                        turtlelite_stop: 'stop %1',
                        turtlelite_touching_color: 'touching %1 ?',
                        turtlelite_turn_at_intersection: 'turn %1 at black intersection %2',
                        turtlelite_turn_unit_in_place: 'turn %1 %2 %3 in place %4',
                        turtlelite_turn_unit_with_radius_in_direction:
                            'turn %1 %2 %3 with radius %4 cm in %5 direction %6',
                        turtlelite_value: '%1',
                        turtlelite_boolean: '%1?',
                        turtlelite_pick_head_led: 'set head led to %1 %2',
                    },
                    Helper: {
                        turtlelite_button_state:
                            'If the button clicked/double-clicked/long-pressed, true, otherwise false.',
                        turtlelite_change_buzzer_by:
                            'Adds the entered value to the current pitch (Hz) of the buzzer sound. You can enter up to two decimal places.',
                        turtlelite_change_head_led_by_rgb:
                            'Adds the entered values to the current R, G, B values of the head LED, respectively.',
                        turtlelite_change_tempo_by:
                            'Adds the entered value to the current BPM (beats per minute) of the playing or resting speed.',
                        turtlelite_change_wheel_by:
                            'Adds the entered value to the current speed value (%) of the left/right/both wheels. If the result is positive, the wheel rotates forward; if negative, the wheel rotates backward.',
                        turtlelite_change_wheels_by_left_right:
                            'Adds the entered values to the current speed values (%) of the left and right wheels respectively. If the result is positive, the wheel rotates forward; if negative, the wheel rotates backward.',
                        turtlelite_clear_head_led: 'Turns off the head LED.',
                        turtlelite_clear_sound: 'Turns off sound.',
                        turtlelite_cross_intersection:
                            'Moves forward for a moment at the black intersection, then finds the black line and moves again.',
                        turtlelite_follow_line:
                            'Moves along the selected color line on a white background.',
                        turtlelite_follow_line_until:
                            'Moves along the black line on a white background and stops when the color sensor detects the selected color.',
                        turtlelite_follow_line_until_black:
                            'Moves along the selected color line on a white background and stops when the color sensor detects black.',
                        turtlelite_is_color_pattern:
                            'If the color sensor detects the selected color pattern, true, otherwise false.',
                        turtlelite_move_backward_unit:
                            'Moves backward for the number of cm/seconds/pulses entered.',
                        turtlelite_move_forward_unit:
                            'Moves forward for the number of cm/seconds/pulses entered.',
                        turtlelite_pivot_around_wheel_unit_in_direction:
                            'Pivots around the left/right wheel in the head/tail direction for the number of degrees/seconds/pulses entered.',
                        turtlelite_play_note: 'It sounds the selected tone and octave.',
                        turtlelite_play_note_for_beats:
                            'It sounds the selected tone and octave as much as the beat you entered.',
                        turtlelite_play_sound_times:
                            'Plays the selected sound as many times as entered.',
                        turtlelite_play_sound_times_until_done:
                            'Plays the selected sound as many times as entered, and waits for completion.',
                        turtlelite_rest_for_beats: 'Rests as much as the beat you entered.',
                        turtlelite_set_buzzer_to:
                            'Sets the pitch of the buzzer sound to the entered value (Hz). You can enter up to two decimal places. Entering the number 0 turns off the buzzer sound.',
                        turtlelite_set_following_speed_to:
                            'Sets the speed (1 to 8) to move along the line. The larger the number, the faster the movement.',
                        turtlelite_set_head_led_to: 'Turns the head LED to the selected color.',
                        turtlelite_set_head_led_to_rgb:
                            'Sets the R, G, B values of the head LED to the entered values.',
                        turtlelite_set_tempo_to:
                            'Sets the playing or resting speed to the entered BPM (beats per minute).',
                        turtlelite_set_wheel_to:
                            'Sets the speed of the left/right/both wheels to the entered value (-400 to 400%). If you enter a positive value, the wheel rotates forward. If you enter a negative value, the wheel rotates backward. Entering the number 0 stops it.',
                        turtlelite_set_wheels_to_left_right:
                            'Sets the speed of the left and right wheels to the entered values (-400 to 400%), respectively. If you enter a positive value, the wheel rotates forward. If you enter a negative value, the wheel rotates backward. Entering the number 0 stops it.',
                        turtlelite_stop: 'Stops both wheels.',
                        turtlelite_touching_color:
                            'If the color sensor detects the selected color, true, otherwise false.',
                        turtlelite_turn_at_intersection:
                            'Moves forward for a moment at the black intersection, then turns left/right/back in place, finds the black line and moves again.',
                        turtlelite_turn_unit_in_place:
                            'Turns left/right in place for the number of degrees/seconds/pulses entered.',
                        turtlelite_turn_unit_with_radius_in_direction:
                            'Turns left/right drawing the circle of the entered radius in the head/tail direction for the number of degrees/seconds/pulses entered.',
                        turtlelite_value:
                            'color number: color number detected by the color sensor (range: -1 to 8, initial value: -1)<br/>color pattern: value of the color pattern detected by the color sensor (range: -1 ~ 88, initial value: -1) <br/>floor: value of floor sensor (range: 0 to 100, initial value: 0)<br/>button: status of the button (when pressed 1, otherwise 0, initial value: 0)<br/>x acceleration: x-axis value of acceleration sensor (range: -32768 to 32767, initial value: 0) The direction in which the robot moves forward is the positive direction of the x axis.<br/>y acceleration: y-axis value of acceleration sensor (range: -32768 to 32767, initial value: 0) The left direction of the robot is the positive direction of the y axis.<br/>z acceleration: z-axis value of acceleration sensor (range: -32768 to 32767, initial value: 0) The upward direction of the robot is the positive direction of the z axis.',
                        turtlelite_boolean:
                            'tilt forward: If tilted forward, true, otherwise false<br/>tilt backward: If tilted backward, true, otherwise false<br/>tilt left: If tilted to the left, true, otherwise false<br/>tilt right: If tilted to the right, true, otherwise false<br/>tilt flip: If upside-down, true, otherwise false<br/>not tilt: If not tilted, true, otherwise false<br/>battery normal: If the battery is enough, true, otherwise false<br/>battery low: If the battery is low, true, otherwise false<br/>battery empty: If the battery is empty, true, otherwise false',
                        turtlelite_pick_head_led: 'Turns the head LED to the selected color.',
                    },
                    Blocks: {
                        turtlelite_acceleration_x: 'x acceleration',
                        turtlelite_acceleration_y: 'y acceleration',
                        turtlelite_acceleration_z: 'z acceleration',
                        turtlelite_back: 'back',
                        turtlelite_both: 'both',
                        turtlelite_button: 'button',
                        turtlelite_buzzer: 'buzzer',
                        turtlelite_clicked: 'clicked',
                        turtlelite_color_any: 'any color',
                        turtlelite_color_black: 'black',
                        turtlelite_color_blue: 'blue',
                        turtlelite_color_green: 'green',
                        turtlelite_color_number: 'color number',
                        turtlelite_color_orange: 'orange',
                        turtlelite_color_pattern: 'color pattern',
                        turtlelite_color_purple: 'purple',
                        turtlelite_color_red: 'red',
                        turtlelite_color_sky_blue: 'sky blue',
                        turtlelite_color_violet: 'violet',
                        turtlelite_color_white: 'white',
                        turtlelite_color_yellow: 'yellow',
                        turtlelite_double_clicked: 'double-clicked',
                        turtlelite_floor: 'floor',
                        turtlelite_head: 'head',
                        turtlelite_head_color: 'head color',
                        turtlelite_left: 'left',
                        turtlelite_left_wheel: 'left wheel',
                        turtlelite_long_pressed: 'long-pressed',
                        turtlelite_note: 'note',
                        turtlelite_right: 'right',
                        turtlelite_right_wheel: 'right wheel',
                        turtlelite_sound_beep: 'beep',
                        turtlelite_sound_birthday: 'birthday',
                        turtlelite_sound_dibidibidip: 'dibidibidip',
                        turtlelite_sound_engine: 'engine',
                        turtlelite_sound_good_job: 'good job',
                        turtlelite_sound_march: 'march',
                        turtlelite_sound_random_beep: 'random beep',
                        turtlelite_sound_robot: 'robot',
                        turtlelite_sound_siren: 'siren',
                        turtlelite_tail: 'tail',
                        turtlelite_unit_cm: 'cm',
                        turtlelite_unit_deg: 'degrees',
                        turtlelite_unit_pulse: 'pulses',
                        turtlelite_unit_sec: 'seconds',
                        turtlelite_note_c: 'C',
                        turtlelite_note_c_sharp: 'C♯(D♭)',
                        turtlelite_note_d: 'D',
                        turtlelite_note_d_sharp: 'D♯(E♭)',
                        turtlelite_note_e: 'E',
                        turtlelite_note_f: 'F',
                        turtlelite_note_f_sharp: 'F♯(G♭)',
                        turtlelite_note_g: 'G',
                        turtlelite_note_g_sharp: 'G♯(A♭)',
                        turtlelite_note_a: 'A',
                        turtlelite_note_a_sharp: 'A♯(B♭)',
                        turtlelite_note_b: 'B',
                        turtlelite_tilt_forward: 'tilt forward',
                        turtlelite_tilt_backward: 'tilt backward',
                        turtlelite_tilt_left: 'tilt left',
                        turtlelite_tilt_right: 'tilt right',
                        turtlelite_tilt_flip: 'tilt flip',
                        turtlelite_tilt_not: 'not tilt',
                        turtlelite_battery_normal: 'battery normal',
                        turtlelite_battery_low: 'battery low',
                        turtlelite_battery_empty: 'battery empty',
                    },
                },
            };
        }
    }

    Entry.TurtleLite = new TurtleLite();
})();

module.exports = Entry.TurtleLite;
