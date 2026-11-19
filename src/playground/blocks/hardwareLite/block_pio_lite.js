'use strict';

/*
 * 삐오 하드웨어Lite 모듈.
 *
 * 이식 출처:
 *   - entry-hw/app/modules/pio.js
 *   - entryjs .../hardware/block_robomation.js (PioRobot)
 *   - entryjs .../hardware/block_pio.js
 *   - entryjs .../hardwareLite/block_hamster_lite.js (핸드셰이크 계층)
 *
 * 설치형은 entry-hw 모듈과 entryjs 로봇 계층이 두 프로세스로 나뉘어 handler(IPC)로
 * motoring/sensory 를 주고받는다. lite 는 프로세스가 하나이므로 브리지 자체가 없다.
 * 필드복사 루프를 지우고, 그 뒤에 붙어 있던 id 엣지 래칭과 눈 RGB, 부저 매주기 대입을
 * __latchCommands() 로 살려 requestLocalData() 머리에서 부른다.
 */
(function () {
    // 연결 시 정체 라인(FF01) 대기 상한. 페어링된 동글은 ms 단위로 응답하므로 5초면 충분.
    const HANDSHAKE_TIMEOUT_MS = 5000;

    // pio.js 의 모듈 스코프 정적 상수. 이름을 Module 로 유지해 본문의
    // Module.<CONST> 참조를 무수정으로 남긴다.
    const Module = {
        CM_TO_PULSE: 968.0,
        DEG_TO_PULSE_SPIN: 15104 / 360.0, // 좌우 동일
        DEG_TO_PULSE_PIVOT_LEFT: 30375 / 360.0,
        DEG_TO_PULSE_PIVOT_RIGHT: 30336 / 360.0,
        DEFAULT_VELOCITY: 70,

        // 의미 소리 코드(entryjs가 보내는 Pio.SOUND_*) -> 장치 바이트
        SOUNDS: {
            0: 0x00,
            1: 0x01, // beep
            2: 0x05, // random beep
            10: 0x07, // noise
            3: 0x09, // siren
            4: 0x0b, // engine
            11: 0x12, // chop
            5: 0x15, // robot
            8: 0x27, // dibidibidip
            9: 0x28, // good job
            18: 0x14, // random melody
            20: 0x29, // poo(p)
            12: 0x21, // happy
            13: 0x22, // angry
            14: 0x23, // sad
            15: 0x24, // sleep
            6: 0x25, // march
            7: 0x26, // birthday
            21: 0x2a, // bath
        },
    };

    // 버튼 상태 머신. 클래스 밖, IIFE 안에 둔다. PioLite 인스턴스가 8개를 배열로 들고 있고
    // 원본에서도 별도 생성자였다. 본문은 원문 그대로다(껍데기만 class 로 통일).
    class PioButtonChecker {
        constructor() {
            this.reset();
        }

        reset() {
            this.__state = 0;
            this.__pressTime = 0;
            this.__clicked = false;
            this.__longPressed = false;
            this.__prevPressed = false;
            this.__pressedEvent = false;
            this.__releasedEvent = false;
            this.__clickedEvent = false;
            this.__longPressedEvent = false;
        }

        clearEvent() {
            this.__pressedEvent = false;
            this.__releasedEvent = false;
            this.__clickedEvent = false;
            this.__longPressedEvent = false;
        }

        check(pressed) {
            this.__clicked = false;
            this.__longPressed = false;
            switch (this.__state) {
                case 0: // ready state and wait for press
                    if (pressed) {
                        this.__pressTime = Date.now();
                        this.__state = 1;
                    }
                    break;
                case 1: // check how long button is pressed
                    if (pressed) {
                        if (Date.now() - this.__pressTime > 1500) {
                            this.__longPressed = true;
                            this.__state = 2;
                        }
                    } else {
                        if (Date.now() - this.__pressTime < 750) {
                            this.__clicked = true;
                        }
                        this.__state = 0;
                    }
                    break;
                case 2: // check release of long-click
                    if (!pressed) this.__state = 0;
                    break;
            }
            if (!this.__prevPressed && pressed) this.__pressedEvent = true;
            if (this.__prevPressed && !pressed) this.__releasedEvent = true;
            if (this.__clicked) this.__clickedEvent = true;
            if (this.__longPressed) this.__longPressedEvent = true;
            this.__prevPressed = pressed;
        }

        isPressed() {
            return this.__pressedEvent;
        }

        isReleased() {
            return this.__releasedEvent;
        }

        isClicked() {
            return this.__clickedEvent;
        }

        isLongPressed() {
            return this.__longPressedEvent;
        }
    }

    // 로봇 계층 상수 14종.
    // 원본은 `PioRobot.prototype.X = <값>` 이다. 축약 프로퍼티가 참조할 바인딩이 없으므로
    // 먼저 IIFE 스코프의 const 로 옮기고, 클래스 선언 뒤에 prototype 에 붙인다.
    // 값은 한 글자도 바꾸지 않는다.

    const __PORT_MAP = {
        group: 'pio',
        module: 'pio',
        leftWheel: 0,
        rightWheel: 0,
        leftEyeRed: 0,
        leftEyeGreen: 0,
        leftEyeBlue: 0,
        rightEyeRed: 0,
        rightEyeGreen: 0,
        rightEyeBlue: 0,
        buzzer: 0,
        turboId: 0,
        turbo: 0,
        pulseId: 0,
        pulse: 0,
        neckSpeedId: 0,
        neckSpeed: 4,
        neckAngleId: 0,
        neckAngle: 0,
        eyePatternId: 0,
        eyePattern: 0,
        noteId: 0,
        note: 0,
        soundId: 0,
        sound: 0,
        motionId: 0,
        motionType: 0,
        motionUnit: 0,
        motionSpeed: 0,
        motionValue: 0,
        motionRadius: 0,
    };

    // 벤더 규격이 정한 값 범위. 출처는 제조사 규격 문서다.
    // 바퀴 "0은 정지. 최대 100 %", 목 Mode 3 "Angle은 -90~+90도 범위",
    // 버저 "16bit 값으로 1부터 최대 65535 ... 최대값 65535은 6553.5Hz", 눈 RGB 0~255.
    const __LIMITS = {
        wheel: { min: -100, max: 100, unit: '' },
        // 이 ±90 은 Mode 3 상대 명령의 프로토콜 범위다. 물리 가동 범위는 ±45 이고 넘기면
        // 소리 없이 탈조한다. 상대 명령이라 ±45 클램프로도 막히지 않는다.
        // 안전한 상한이 확정되지 않았으므로 여기 숫자를 안전 범위로 읽지 말 것.
        neckAngle: { min: -90, max: 90, unit: '°' },
        eyeRgb: { min: 0, max: 255, unit: '' },
        buzzer: { min: 0, max: 6553.5, unit: 'Hz' },
    };

    // 이동/회전 거리는 프레임 계층이 펄스로 바꿔 16비트 필드에 싣는다. 배수는 위
    // Module.CM_TO_PULSE / DEG_TO_PULSE_* 와 같아야 한다. 넘치면 하위 16비트만 남아
    // 엉뚱한 거리를 간다.
    const __MAX_PULSE = 65535;
    const __PULSE_PER_UNIT = {
        1: 968,
        2: 968,
        3: 15104 / 360,
        4: 15104 / 360,
        5: 30375 / 360,
        6: 30375 / 360,
        7: 30336 / 360,
        8: 30336 / 360,
    };

    // setTimeout 의 지연은 32비트 부호 있는 정수(최대 2147483647ms, 약 24.8일)까지만 유효하다.
    // 넘는 값을 넘기면 엔진이 지연을 1ms 로 취급해 콜백을 즉시 실행한다. 길게 요청할수록 빨리
    // 끝나는 뒤집힌 동작이 된다. 박자와 초 단위 대기는 상한이 없어 이 한계를 넘길 수 있다.
    const __MAX_DELAY_MS = 2147483647;

    const __EYE_CHANNELS = [
        'leftEyeRed',
        'leftEyeGreen',
        'leftEyeBlue',
        'rightEyeRed',
        'rightEyeGreen',
        'rightEyeBlue',
    ];

    const __ID_PORTS = [
        'turboId',
        'pulseId',
        'neckSpeedId',
        'neckAngleId',
        'eyePatternId',
        'noteId',
        'soundId',
        'motionId',
    ];

    const __BUTTON_INDEX = {
        MOVE_FORWARD: 0,
        MOVE_BACKWARD: 1,
        MOVE_LEFT: 2,
        MOVE_RIGHT: 3,
        RUN: 4,
        BEHAVIOR: 5,
        REPEAT: 6,
        CLEAR: 7,
    };

    const __BUTTONS = [
        'forwardButton',
        'backwardButton',
        'leftButton',
        'rightButton',
        'runButton',
        'behaviorButton',
        'repeatButton',
        'clearButton',
    ];

    const __UNITS = {
        CM: 1,
        DEGREES: 1,
        SECONDS: 2,
        PULSES: 3,
    };

    const __RGBS = {
        RED: [255, 0, 0],
        ORANGE: [255, 63, 0],
        YELLOW: [255, 255, 0],
        GREEN: [0, 255, 0],
        SKY_BLUE: [0, 255, 255],
        BLUE: [0, 0, 255],
        VIOLET: [63, 0, 255],
        PURPLE: [255, 0, 255],
        WHITE: [255, 255, 255],
    };

    const __SOUNDS = {
        BEEP: 1,
        RANDOM_BEEP: 2,
        NOISE: 10,
        SIREN: 3,
        ENGINE: 4,
        CHOP: 11,
        ROBOT: 5,
        DIBIDIBIDIP: 8,
        GOOD_JOB: 9,
        RANDOM_MELODY: 18,
        POO: 20,
        HAPPY: 12,
        ANGRY: 13,
        SAD: 14,
        SLEEP: 15,
        MARCH: 6,
        BIRTHDAY: 7,
        BATH: 21,
    };

    const __NOTES = {
        C: 4,
        CS: 5,
        D: 6,
        DS: 7,
        E: 8,
        F: 9,
        FS: 10,
        G: 11,
        GS: 12,
        A: 13,
        AS: 14,
        B: 15,
    };

    const __BATTERY_STATES = {
        NORMAL: 3,
        MIDDLE: 2,
        LOW: 1,
        EMPTY: 0,
    };

    class PioLite {
        constructor() {
            this.id = '022001';
            this.name = 'PioLite';
            this.url = 'http://www.robomation.net';
            this.imageName = 'piolite.png';
            this.title = { ko: '삐오' };
            this.delimeter = '\r';
            this.duration = 0;
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
            this.blockMenuBlocks = [
                'piolite_board_move',
                'piolite_board_turn',
                'piolite_move_forward',
                'piolite_move_backward',
                'piolite_turn',
                'piolite_move_forward_unit',
                'piolite_move_backward_unit',
                'piolite_turn_unit_in_place',
                'piolite_pivot_unit',
                'piolite_change_wheels',
                'piolite_set_wheels',
                'piolite_change_wheel',
                'piolite_set_wheel',
                'piolite_stop',
                'piolite_turbo_mode',
                'piolite_is_wheel_moving',
                'piolite_rotate_neck',
                'piolite_set_neck_speed',
                'piolite_stop_neck',
                'piolite_is_neck_moving',
                'piolite_set_eye_color',
                'piolite_set_eye_color_picker',
                'piolite_change_eye_rgb',
                'piolite_set_eye_rgb',
                'piolite_clear_eye',
                'piolite_play_sound',
                'piolite_play_sound_times',
                'piolite_play_sound_until',
                'piolite_change_buzzer',
                'piolite_set_buzzer',
                'piolite_clear_sound',
                'piolite_play_note',
                'piolite_play_note_beat',
                'piolite_rest_beat',
                'piolite_change_tempo',
                'piolite_set_tempo',
                'piolite_is_sound_playing',
                'piolite_button',
                'piolite_signal_strength',
                'piolite_when_button_state',
                'piolite_button_state',
                'piolite_battery_state',
            ];

            // 거부 상태 머신. setZero 가 건드리지 않는다.
            this.foreignAttached = false;
            this.rejectedAddress = undefined;
            this.pendingIdentity = undefined;
            this.pendingIdentityTtl = 0;
            this.invalidFrameCount = 0;
            this.__stickyToast = undefined; // 거부가 풀릴 때까지 남기는 안내 (아래 참조)

            // sensory: 엔트리가 보는 객체 자체다. lite 에는 브리지가 없으므로
            // 원본의 requestRemoteData(handler.write 루프)가 폐기됐다.
            this.sensory = {
                company: 0x02,
                model: 0x20,
                index: 0,
                signalStrength: 0,
                forwardButton: 0,
                backwardButton: 0,
                leftButton: 0,
                rightButton: 0,
                runButton: 0,
                behaviorButton: 0,
                repeatButton: 0,
                clearButton: 0,
                pulseCount: 0,
                wheelStateId: 0,
                neckEncoder: 0,
                neckStateId: 0,
                soundStateId: 0,
                batteryState: 3,
                usbState: 0,
                chargeState: 0,
            };
            // motoring: 블록 메서드가 직접 쓴다 (설치형에서는 sendQueue 였다)
            this.motoring = {
                leftWheel: 0,
                rightWheel: 0,
                leftEyeRed: 0,
                leftEyeGreen: 0,
                leftEyeBlue: 0,
                rightEyeRed: 0,
                rightEyeGreen: 0,
                rightEyeBlue: 0,
                buzzer: 0,
                turbo: 0,
                turboId: 0,
                pulse: 0,
                pulseId: 0,
                neckSpeed: 4,
                neckSpeedId: 0,
                neckAngle: 0,
                neckAngleId: 0,
                eyePattern: 0,
                eyePatternId: 0,
                note: 0,
                noteId: 0,
                sound: 0,
                soundId: 0,
                motionType: 0,
                motionUnit: 0,
                motionSpeed: 0,
                motionValue: 0,
                motionRadius: 0,
                motionId: 0,
            };
            this.address = '';

            // 로봇 계층 상태.
            // 원본 PioRobot 생성자를 여기 합친다. sensory/motoring 은 재대입하지 않고
            // 필드만 더한다. 재대입하면 위에서 만든 프레임 계층 상태가 지워진다.
            // 원본 PioRobot.sensory 의 키는 위 sensory 키의 부분집합이라 더할 것이 없다.

            // `__PORT_MAP` 시드 책임이 `setMotoring` 에서 생성자로 옮겨왔다.
            // lite 에는 공유 sendQueue 가 없어 `setMotoring` 호출부가 0건이다.
            for (const port in this.__PORT_MAP) {
                if (this.motoring[port] === undefined) {
                    this.motoring[port] = this.__PORT_MAP[port];
                }
            }
            this.motoring.index = 0;

            // sensory.*StateId 는 0부터 증가하는 카운터이므로 0으로 초기화한다.
            // -1이면 첫 완료(0->1)가 감지되지 않아 블록 콜백이 실행되지 않는다.
            this.wheelStateId = 0;
            this.neckStateId = 0;
            this.soundStateId = 0;
            this.blockId = 0;
            this.wheelMoving = false;
            this.motionCallback = undefined;
            this.motioning = false;
            this.boardCommand = 0;
            this.boardState = 0;
            this.boardCallback = undefined;
            this.boarding = false;
            this.neckMotionCallback = undefined;
            this.neckMotioning = false;
            this.currentSound = 0;
            this.soundRepeat = 1;
            this.soundCallback = undefined;
            this.sounding = false;
            this.buzzing = false;
            this.noteId = 0;
            this.noteTimer1 = undefined;
            this.noteTimer2 = undefined;
            // lite 전용. 음표와 쉼표의 대기 해제를 setZero 가 부를 수 있게 보관한다.
            this.noteCallback = undefined;
            this.noting = false;
            this.resting = false;
            this.tempo = 60;
            this.timeouts = [];
            this.buttons = new Array(8);
            this.buttonCheckers = new Array(8);
            for (let i = 0; i < 8; ++i) {
                this.buttons[i] = 0;
                this.buttonCheckers[i] = new PioButtonChecker();
            }

            this.__initFrameState();
        }

        // 원본 Module.prototype._init. 본문 무수정.
        __initFrameState() {
            // 인코더가 읽는 장치 레벨 필드
            this._left_wheel = 0;
            this._right_wheel = 0;
            this._pulse = 0;
            this._pulse_written = false;
            this._left_red = 0;
            this._left_green = 0;
            this._left_blue = 0;
            this._right_red = 0;
            this._right_green = 0;
            this._right_blue = 0;
            this._buzzer = 0;
            this._turbo = 0;
            this._neck_speed = 4;
            this._neck_angle = 0;
            this._neck_angle_written = false;
            this._eye_pattern = 0;
            this._eye_pattern_written = false;
            this._note = 0;
            this._sound = 0;
            this._sound_written = false;

            // 인코더 상태머신
            this._wheel_id = 0;
            this._wheel_pulse_prev = -1;
            this._wheel_event = 0;
            this._neck_id = 0;
            this._neck_event = 0;
            this._eye_id = 0;
            this._eye_event = 0;
            this._sound_id = 0;
            this._sound_event = 0;
            this._sound_prev = 0;
            this._current_sound = 0;
            this._sound_repeat = 1;

            // 디코더 완료 추적 (장치 2비트 순환 id)
            this._wheel_state_id = -1;
            this._neck_state_id = -1;
            this._eye_state_id = -1;
            this._sound_state_id = -1;
            this._event_pulse_count = -1;
            this._event_neck_encoder = -46;
            this._event_key_state_id = -1;
            this._event_usb_state = -1;
            this._event_charge_state = -1;
            this._event_battery_state = -1;

            // entryjs로 노출되는 JSON 완료 카운터 (단조 증가 %255)
            this._wheelStateJson = 0;
            this._neckStateJson = 0;
            this._soundStateJson = 0;

            // entryjs *Id 필드 변경 감지
            this._prev_turboId = 0;
            this._prev_pulseId = 0;
            this._prev_neckSpeedId = 0;
            this._prev_neckAngleId = 0;
            this._prev_eyePatternId = 0;
            this._prev_noteId = 0;
            this._prev_soundId = 0;
            this._prev_motionId = 0;

            // SEC(시간) 모션: 벽시계 종료 시각과 대기 중 완료
            this._sec_motion_end = 0;
            this._sec_motion_active = false;
        }

        // 장치가 바뀌면 그쪽 2비트 순환 id 가 임의 값에서 다시 시작하므로,
        // 우리가 들고 있던 값과 비교하면 가짜 완료 또는 완료 누락이 난다.
        // 목록은 pio.js _init 의 음수 원점 필드 전수다.
        // 값도 _init 과 대조했다: 열 개가 -1, `_event_neck_encoder` 만 -46 이다.
        // `_prev_*Id` 와 `motoring.*Id` 는 건드리지 않는다. 0 으로 되돌리면
        // 다음 명령이 이전 실행과 같은 id 에 도달해 통째로 삼켜진다.
        __rearmDeviceSentinels() {
            this._wheel_state_id = -1;
            this._neck_state_id = -1;
            this._eye_state_id = -1;
            this._sound_state_id = -1;
            this._wheel_pulse_prev = -1;
            this._event_pulse_count = -1;
            this._event_key_state_id = -1;
            this._event_usb_state = -1;
            this._event_charge_state = -1;
            this._event_battery_state = -1;
            this._event_neck_encoder = -46;
        }

        // 새 세션이 시작될 때 이전 세션의 잔여 상태를 비운다.
        // 이 인스턴스는 모듈 스코프 싱글턴이고 코어의 해제 경로는 인스턴스를 정리하지
        // 않으므로(hw_lite 의 disconnect 는 setZero 를 부르지 않는다) 여기서 해야 한다.
        //
        // setZero() 를 재사용하지 않는다. 그쪽은 serial.update() 로 즉시 write 를 유발하고
        // 명령 id 를 올리는데, 연결 직후에는 둘 다 불필요하고 부작용만 있다.
        //
        // 구동 상태를 비우는 것이 핵심이다. 프레임 계층 값은 __latchCommands 가 motionId
        // 변화에서만 갱신하므로, 지우지 않으면 다음 실행이 엔진을 run 으로 만드는 순간
        // 이전 세션의 바퀴 명령이 그대로 나간다(실측: 이동 블록이 없는 프로그램에서 로봇이
        // 움직였고, 좌70 우70 펄스9680 프레임이 그때까지 계속 생성되고 있었다).
        __resetSessionState() {
            this._left_wheel = 0;
            this._right_wheel = 0;
            this._pulse = 0;
            this._note = 0;
            this._buzzer = 0;
            // 아래 넷은 위 다섯과 같은 부류다. `__initFrameState()` 는 생성자 전용이라
            // 재연결에서 돌지 않고, `__rearmDeviceSentinels()` 는 장치 순환 id 만 본다.
            // 그래서 안 지우면 다음 세션이 엔진을 run 으로 만드는 순간 이전 세션 값이 나간다.
            this._turbo = 0; // `__encodeFrame` 이 `_turbo == 1` 에 무조건 '11' 을 싣는다.
            // 터보 켠 채 끊으면 다음 세션이 터보 속도로 시작한다
            this._sound = 0; // `_sound_written` 이 false 면 else 분기가 매 프레임
            this._current_sound = 0; // 소리 명령을 싣는다. 낡은 바이트가 계속 나간다
            this._sound_repeat = 1;
            this._sound_event = 0;
            this._sound_prev = 0;
            this._wheel_event = 0;
            this._sec_motion_active = false; // 초 단위 이동 중 끊기면 다음 세션 첫 틱이
            this._sec_motion_end = 0; // 완료를 발화시켜 다음 대기 블록이 조기 완료된다

            // 눈은 id 게이트가 없다. `__latchCommands` 가 `motoring` 에서 매 주기 무조건
            // 복사하므로(`_left_red = _sat(m.leftEyeRed, ...)`), `_*` 그림자만 지우면
            // 다음 latch 가 곧바로 되살린다. 지울 곳은 `motoring` 쪽이다.
            const motoring = this.motoring;
            // 부저도 눈과 같다. __latchCommands 가 매 주기 motoring 에서 복사하므로
            // _buzzer 그림자만 지우면 다음 틱에 되살아난다. 무한 부저를 켠 채 끊으면
            // 다음 로봇이 새 블록 없이 소리를 낸다.
            motoring.buzzer = 0;
            motoring.leftEyeRed = 0;
            motoring.leftEyeGreen = 0;
            motoring.leftEyeBlue = 0;
            motoring.rightEyeRed = 0;
            motoring.rightEyeGreen = 0;
            motoring.rightEyeBlue = 0;

            // 거부 상태 머신의 보류 항. 초기화가 생성자에만 있었다. 이 인스턴스는 모듈
            // 스코프 싱글턴이라 세션이 끝나도 살아남고, 그러면 세션 B 의 첫 일치 라인이
            // 세션 A 의 2회차 확인으로 세어져 1회성 노이즈 방어가 재연결 경계에서만
            // 정확히 무력해진다. `foreignAttached` 와 `rejectedAddress` 는 바로 앞
            // `onAcceptedIdentity()` 가 이미 푼다.
            this.pendingIdentity = undefined;
            this.pendingIdentityTtl = 0;
            this.invalidFrameCount = 0;

            // 대기 콜백은 죽은 script 를 가리킨다. 해소하지 않고 지운다.
            // 여기서 부르면 이전 세션 블록이 새 세션에서 완료 처리된다.
            // 이 루프는 다섯 손잡이를 무조건 부른다. 그러므로 손잡이에는 최종 완료만 건다.
            // 중간 단계를 걸면 정지 경로에서 새 명령이 나간다. 라쿤이 실제로 그렇게 짰다가
            // 표 등가 검사에 잡혔다(`block_raccoon_lite.js` 의 `returnToBasicPose` 주석).
            [
                'motionCallback',
                'boardCallback',
                'neckMotionCallback',
                'soundCallback',
                'noteCallback',
            ].forEach((k) => {
                this[k] = undefined;
            });
            this.__removeAllTimeouts();

            // 진행 중 표시. 질의 블록 세 종이 이 값을 읽는다.
            this.motioning = false;
            this.boarding = false;
            this.wheelMoving = false;
            this.neckMotioning = false;
            this.sounding = false;
            this.buzzing = false;
            this.noting = false;
            this.resting = false;

            // 버튼 엣지. 이전 세션이 눌린 채 끝나면 새 세션 첫 프레임이 뗌 이벤트로 읽혀
            // 햇 블록이 발화한다.
            for (let i = 0; i < 8; ++i) {
                this.buttonCheckers[i].reset();
            }
            this.limitWarned = {};
        }

        toHex(number) {
            var value = parseInt(number);
            if (value < 0) value += 0x100;
            value = (value & 0xff).toString(16).toUpperCase();
            return value.length > 1 ? value : '0' + value;
        }

        toHex2(number) {
            var value = parseInt(number);
            if (value < 0) value += 0x10000;
            value = (value & 0xffff).toString(16).toUpperCase();
            var result = '';
            for (var i = value.length; i < 4; ++i) result += '0';
            return result + value;
        }

        _round(v) {
            // 반올림: 0에서 먼 쪽으로(half-away-from-zero)
            return v < 0 ? Math.ceil(v - 0.5) : Math.floor(v + 0.5);
        }

        // 장치로 나가는 값을 규격 범위로 포화시킨다. 펄스 배수(CM_TO_PULSE 등)와 프레임 필드
        // 폭이 이 계층에 있고 블록 계층 __PULSE_PER_UNIT은 같은 값을 복제해 둔 것이다.
        // 유한한데 범위를 넘은 값은 하위 비트만 남아 그럴듯한 다른 명령이 된다(100cm 요청이
        // 32.3cm 이동으로 나간다). 이 함수가 실제로 막는 것은 이 경우다.
        // toHex/toHex2는 건드리지 않는다. id와 이벤트 플래그 합성에도 쓰이므로 거기서 자르면
        // 프레임 자체가 깨진다.
        _sat(v, min, max) {
            var n = parseFloat(v);
            // NaN은 방향이 없어 포화시킬 곳이 없다. 중립값으로 둔다.
            if (isNaN(n)) return min <= 0 && max >= 0 ? 0 : min;
            if (n < min) return min;
            if (n > max) return max;
            return n;
        }

        // ---------------- 가드와 경고 (로봇 계층 인프라) ----------------

        // 유한한 수일 때만 값을 돌려준다. getNumberValue 는 NaN 을 내지 않지만 Infinity 는
        // 통과시키고, 누적하는 블록에서 Infinity 끼리 만나면 NaN 이 되어 버퍼에 영구히 남는다.
        __finite(value) {
            const n = parseFloat(value);
            return Number.isFinite(n) ? n : undefined;
        }

        __clamp(key, value, min, max, unit) {
            // NaN 과 undefined 는 포화시킬 방향이 없다. 중립값으로 둔다(프레임 계층 _sat 과 같은 정책).
            // (이 방어가 없으면 두 비교가 모두 거짓이 되어 max 로 떨어진다: 바퀴 100, 눈 255.)
            // 부호 있는 무한대는 여기서 걸러내지 않는다. 아래 비교가 각 끝값으로 보내고, 그것이
            // 기존 동작이자 _sat 의 동작이다(_sat 도 isNaN 만 본다).
            if (Number.isNaN(Number(value))) return min <= 0 && max >= 0 ? 0 : min;
            if (value >= min && value <= max) return value;
            const clamped = value < min ? min : max;
            this.__warnLimit(key, min, max, clamped, unit);
            return clamped;
        }

        // 실행당 항목별 1회만 알린다. setZero(엔진 정지)에서 초기화된다.
        __warnLimit(key, min, max, clamped, unit) {
            if (!this.limitWarned) this.limitWarned = {};
            if (this.limitWarned[key]) return;
            // 가드를 플래그보다 먼저 본다. 워크스페이스 초기화 전에는 Entry.toast 가 없는데, 먼저
            // 플래그를 세우면 실행당 1회 예산이 소진돼 그 뒤로 영구히 안내가 안 뜬다.
            // 값 제한 자체는 안내와 무관하게 적용된다.
            if (!Entry.toast) return;
            if (typeof Lang === 'undefined' || !Lang.Msgs || !Lang.Msgs.piolite_value_out_of_range)
                return;
            this.limitWarned[key] = true;
            // 도(°)는 숫자에 붙여 쓰고 cm 와 Hz 는 띄어 쓴다.
            const u = !unit ? '' : unit === '°' ? unit : ' ' + unit;
            Entry.toast.warning(
                Lang.Msgs.piolite_value_out_of_range_title,
                Lang.Msgs.piolite_value_out_of_range
                    .replace('%1', min + u + ' ~ ' + max + u)
                    .replace('%2', clamped + u)
            );
        }

        // 목 각도가 프로토콜 범위를 넘었을 때. 범위도 조정값도 말하지 않는다.
        __warnNeckRange() {
            if (!this.limitWarned) this.limitWarned = {};
            if (this.limitWarned.neck) return;
            if (!Entry.toast) return;
            if (
                typeof Lang === 'undefined' ||
                !Lang.Msgs ||
                !Lang.Msgs.piolite_neck_angle_too_large
            )
                return;
            this.limitWarned.neck = true;
            Entry.toast.warning(
                Lang.Msgs.piolite_neck_angle_too_large_title,
                Lang.Msgs.piolite_neck_angle_too_large
            );
        }

        // 대기 시간을 유효 범위로 제한한다. 조정되면 실행당 1회 알린다.
        __clampDelay(ms) {
            const n = parseFloat(ms);
            // NaN, 0, 음수는 전부 즉시 실행이다. 특히 NaN 은 "값이 없다"는 뜻이지 "너무 길다"가
            // 아니므로 상한으로 보내면 안 된다(__clamp 와 같은 정책). 알리지도 않는다.
            // 상한 초과와 무한대만 알린다.
            if (!(n > 0)) return 0;
            if (n <= this.__MAX_DELAY_MS) return n;
            this.__warnDelay();
            return this.__MAX_DELAY_MS;
        }

        __warnDelay() {
            if (!this.limitWarned) this.limitWarned = {};
            if (this.limitWarned.delay) return;
            // 가드를 플래그보다 먼저 본다(__warnLimit 주석 참고).
            if (!Entry.toast) return;
            if (typeof Lang === 'undefined' || !Lang.Msgs || !Lang.Msgs.piolite_delay_too_long)
                return;
            this.limitWarned.delay = true;
            Entry.toast.warning(
                Lang.Msgs.piolite_delay_too_long_title,
                Lang.Msgs.piolite_delay_too_long
            );
        }

        // ---------------- 연결 ----------------

        requestInitialData() {
            return 'FF\r';
        }

        // 정체 라인 형식: FF01,이름,모델,변형,주소
        // 이름은 임의의 다국어 문자열이고 콤마를 포함할 수 있으므로 뒤에서부터 센다.
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
            // 주소는 실측상 항상 16진수 12자리이며 뒤에 덧붙는 문자가 없다.
            if (!/^[0-9A-Fa-f]{2}$/.test(variant) || !/^[0-9A-Fa-f]{12}$/.test(address)) {
                return undefined;
            }
            // 기종 화이트리스트를 여기 두지 않는다. 어느 기종이 붙었는지 알아야
            // 거부 판정과 안내를 할 수 있다. 판정은 acceptsIdentity 가 한다.
            return { model, variant, address };
        }

        // 판정을 이 설정자의 재정의로 하면 안 된다. 세션 중 경로는 값을 갱신하지 않은 채
        // 다음 프레임에 같은 판정을 다시 하게 되어 수렴하지 않는다.
        setRobotIdentity(identity) {
            this.address = identity.address;
        }

        // 로케일 맵이 아니라 고른 평면 객체를 내야 한다. 맵을 그대로 주면 소비자의
        // t.rejectTitle 이 undefined 라 토스트가 전부 빈칸이 된다.
        // 로케일 선택은 코어가 한다. block_entry 의 Entry.reloadBlock() 이 기동 시 1회
        // HARDWARE_LITE_LIST 를 돌며 setLanguage() 결과를 Lang.type || Lang.fallbackType
        // 으로 골라 Lang.Msgs 에 병합한다(applySetLanguage).
        // 문구가 없으면 소비자가 토스트를 띄우지 않는다. 이 파일의 경고 토스트 3곳과
        // 같은 정책이다. 넘기면 undefined 가 그대로 렌더되고 자동 소멸도 하지 않는다.
        __messages() {
            const m = (typeof Lang !== 'undefined' && Lang && Lang.Msgs) || {};
            return {
                rejectTitle: m.piolite_reject_title,
                rejectDesc: m.piolite_reject,
                foreignTitle: m.piolite_foreign_robot_title,
                foreignDesc: m.piolite_foreign_robot,
            };
        }

        // 이 항목이 받아들이는 기종인지. 삐오는 모델 토큰 '20' 만 받는다.
        // 판정을 setRobotIdentity 재정의로 하면 안 된다. 세션 중 경로는 값을 갱신하지
        // 않은 채 다음 프레임에 같은 판정을 다시 하게 되어 수렴하지 않는다.
        acceptsIdentity(identity) {
            return !!identity && identity.model === '20';
        }

        // 세션 중 다른 기종이 붙었다. 거부한 주소를 기억해 같은 로봇에 대해 한 번만 반응한다.
        // 기억하지 않으면 setRobotIdentity 가 갱신되지 않으므로 프레임마다 재판정되고,
        // 매번 정지 패킷을 써서 초당 수십 번 쓰기가 발생한다(수렴하지 않는다).
        onForeignRobot(identity) {
            if (this.rejectedAddress === identity.address) {
                return;
            }
            this.rejectedAddress = identity.address; // 안내 중복 방지(주소별 1회)
            this.foreignAttached = true; // 프로브 억제 스위치. 정상 정체를 보면 풀린다
            this.setZero();
            const t = this.__messages();
            if (!t.foreignTitle) {
                return;
            }
            // 거부가 풀릴 때까지 남긴다. 종전에는 무조건 잔류(`true`)라 화면에 쌓였다.
            // 라쿤에서 자동 소멸로 바꿔 봤더니 이번에는 놓치면 다시 볼 길이 없었다.
            // 주소별 1회 가드 때문에 같은 로봇을 다시 붙여도 안 뜬다(실측).
            // 두 극단이 다 깨져서 상태에 묶는다: 거부 상태인 동안만 떠 있고 풀리면 내려간다.
            // 라쿤과 같은 동작이다. 같은 기능이 두 로봇에서 갈려 있으면 안 된다.
            this.__showStickyToast(t.foreignTitle, t.foreignDesc);
        }

        // 거부 안내를 띄우고 코어가 돌려주는 요소 자체를 손잡이로 잡는다.
        // `Entry.toast.alert()` 는 마지막 줄이 `return toast;` 다(`class/toast.js:136`).
        // 코어에 이미 정착한 계약이고(`playground/block_menu.ts:411` 와 `util/utils.js:2023` 이
        // 반환값을 받아 `isOpen(target)` 에 넘긴다) 우리가 새로 만들 것이 없다.
        // `warning()`/`success()` 는 반환이 없다. `alert()` 에만 해당한다.
        //
        // 종전 판은 "코어가 손잡이를 안 돌려준다" 고 단정하고 `body_.lastChild` 로
        // 추측해 잡았다. 그 단정이 거짓임을 코어 원문으로 확인했다.
        // 추측 취득과 표식 쓸어내기를 함께 걷어냈다.
        __showStickyToast(title, desc) {
            this.__dismissStickyToast();
            // 다른 lite 모듈이 남긴 거부 안내까지 걷어낸다.
            // 싱글턴은 모듈마다 하나다. 삐오와 라쿤은 서로 다른 객체이고 각자
            // `this.__stickyToast` 만 쥔다. 그래서 "삐오 항목에서 거부 -> 끊김 -> 라쿤 항목으로
            // 연결" 이면 라쿤의 핸드셰이크 해제가 삐오 손잡이를 모른다. 그 뒤 라쿤이 또 거부하면
            // 서로 모순되는 잔류 안내가 둘 뜬다(실측 재현). 코어 `disconnect()` 는 모듈에
            // 훅을 안 부르므로(`class/hw_lite.ts:207`) 이것을 해소해 주지 않는다.
            // 표식이 공용인 것이 바로 이 때문이다. 모듈 경계를 넘는 유일한 손잡이다.
            this.__sweepStickyToasts();
            const el = Entry.toast.alert(title, desc, true); // true = isNotAutoDispose
            // 객체인지 확인하고 잡는다. 코어는 요소를 돌려주지만(`class/toast.js:136`)
            // 그것이 계약으로 못박혀 있지는 않다. 숫자나 `undefined` 가 오면 `엄격 모드`에서
            // 프로퍼티 대입이 TypeError 로 터져 `onForeignRobot` 밖으로 튄다.
            // 열화는 안전한 쪽이어야 한다.
            this.__stickyToast = el && typeof el === 'object' ? el : undefined;
            if (this.__stickyToast) {
                // 표식. 정적상수로 올리면 클래스의 상수 목록이 바뀐다
                this.__stickyToast.__hwLiteRejectToast = true;
            }
        }

        // 표식이 붙은 거부 안내를 컨테이너에서 전부 지운다. 라이브 컬렉션일 수 있어 사본을 돈다.
        // 표식이 없는 것은 건드리지 않는다. 코어의 연결 성공, 해제, 실패 안내가 그것이다.
        __sweepStickyToasts() {
            try {
                const box = Entry.toast && Entry.toast.body_;
                const kids = box && box.children;
                if (!kids) {
                    return;
                }
                Array.prototype.slice.call(kids).forEach((el) => {
                    if (el && el.__hwLiteRejectToast && el.parentElement) {
                        if (el.style) {
                            el.style.display = 'none';
                        }
                        el.parentElement.removeChild(el);
                    }
                });
            } catch (error) {
                // 쓸어내기 실패는 무시한다. 남아도 클릭으로 닫힌다
            }
        }

        __dismissStickyToast() {
            const el = this.__stickyToast;
            this.__stickyToast = undefined;
            if (!el) {
                return;
            }
            try {
                // `parentElement` 검사보다 위다. 코어는 자동 소멸 경로에서 display 를 세운 뒤
                // 떼어 내지만(`class/toast.js:124`) `toasts_` 배열에서 빼지는 않는다. 그래서
                // `isOpen()` 이 죽은 항목을 활성으로 세지 않으려면 우리도 세워야 하는데,
                // 사용자가 토스트를 클릭하면 코어 핸들러(`toast.js:88`)가 떼어 내기만 하고
                // display 는 안 건드린다. 아래에 두면 그 경로에서 영영 안 세워진다.
                if (el.style) {
                    el.style.display = 'none';
                }
                if (!el.parentElement) {
                    return; // 이미 떨어져 나갔다(사용자가 눌렀거나 코어가 지웠다)
                }
                el.parentElement.removeChild(el);
            } catch (error) {
                // 제거 실패는 무시한다. 남아도 클릭으로 닫힌다
            }
        }

        // 정상 기종의 정체를 받으면 거부 상태를 푼다. 같은 로봇이 되돌아오는 경우까지
        // 덮으려면 변경 감지 분기가 아니라 이 훅에서 처리해야 한다.
        // setRobotIdentity 에 걸어두면 "바뀌지 않은 정체" 에서는 호출되지 않아 영구히 잠긴다.
        //
        // 다만 이 훅은 정체 라인이 와야 불린다. 타기종이 붙었다가 원래 로봇이 돌아오는
        // 경우 동글이 정체 라인을 보내지 않아 거부 상태가 자동으로 풀리지 않는다(실측).
        // 그때는 재연결이 필요하고, 안내 토스트가 그렇게 유도한다.
        onAcceptedIdentity(identity) {
            this.foreignAttached = false;
            this.rejectedAddress = undefined;
            this.__dismissStickyToast(); // 거부가 풀렸으니 안내도 내린다
        }

        // 기반에 기본값이 없다. 여기가 유일한 정의 자리다.
        // initialHandshake 의 거부 분기가 이것을 부른다(포트 정리 뒤).
        onRejectedAtConnect() {
            const t = this.__messages();
            if (!t.rejectTitle) {
                return;
            }
            // 이쪽은 자동 소멸이다. 연결 시도마다 불리므로 잔류시키면 시도 횟수만큼 쌓인다.
            // 화면에 쌓이던 실제 원인이 이 줄이었다. 이 시점에는 포트가 이미 닫혀 남길 상태가 없다.
            Entry.toast.alert(t.rejectTitle, t.rejectDesc);
        }

        // 받지 않는 기종이 붙어 있는 동안에는 센서 프레임을 해석하지 않는다.
        // 타기종 프레임도 53자라 헤더 관문을 통과한다. 해석하면 센서값이 어긋난다.
        shouldParseSensory() {
            return !this.foreignAttached;
        }

        // 검증 실패 프레임이 연속되면 로봇이나 모드 불일치 가능성이 높으므로 정체를 다시 묻는다.
        // 삐오 스트림 50~51fps 기준 약 0.6초 연속 불일치에서 1회 발화.
        reportInvalidFrame() {
            // 거부 상태에서는 FF 프로브를 보내지 않는다. 프로브가 정체 라인을 다시 끌어와
            // 같은 처리를 반복시키는 것을 막는다.
            // 억제 기준은 중복 방지 기억이 아니라 "지금 외부 로봇이 붙어 있는가" 다.
            // 기억을 기준으로 삼으면 원래 로봇이 되돌아와도 억제가 안 풀려 탐지가 영구히 죽는다.
            if (this.foreignAttached) {
                return;
            }
            // 아래는 기반 본문 인라인이다. 단일 클래스라 super 가 없다.
            this.invalidFrameCount = (this.invalidFrameCount || 0) + 1;
            if (this.invalidFrameCount >= 30) {
                this.invalidFrameCount = 0;
                try {
                    if (Entry.hwLite && Entry.hwLite.serial) {
                        Entry.hwLite.serial.sendAsciiAsBuffer(this.requestInitialData());
                    }
                } catch (error) {
                    // teardown 중 writer 가 이미 해제된 경우. 프로브는 실패해도 무시한다
                    console.error(error);
                }
            }
        }

        // 포트 정리는 실패해도 핸드셰이크의 반환 계약(불리언)을 깨지 않는다.
        // removeSerialPort 안의 port.close() 는 uncaught finally 라 reject 할 수 있다.
        async __closePort(serial) {
            try {
                await serial.removeSerialPort();
            } catch (error) {
                console.error(error);
            }
        }

        async initialHandshake() {
            // 지난 거부 안내를 여기서 내린다. 코어 `disconnect()` 는 lite 모듈에 아무 훅도
            // 부르지 않으므로(`class/hw_lite.ts:207`, `hwModule` 참조만 버린다) 거부 중에 끊기면
            // 안내가 그대로 남는다. 모듈은 싱글턴이라(파일 말미 `new` 1회) 재연결해도 같은
            // 객체가 손잡이를 쥐고 있고, 새 연결 시도야말로 지난 안내가 낡아지는 순간이다.
            // 끊은 뒤 다시 연결하지 않는 경우만 남는데, 그때는 코어의 "하드웨어 연결 해제"
            // 안내가 떠 있고 고아는 클릭으로 닫힌다(코어가 클릭 해제를 지원한다).
            this.__dismissStickyToast();
            // 다른 모듈이 남긴 것까지. 새 연결 시도는 모든 지난 거부 안내가 낡아지는 순간이다
            this.__sweepStickyToasts();
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
                    // 반복마다 진행 중인 read 는 항상 정확히 1개다. 타임아웃 패자로 남는
                    // pending read 는 removeSerialPort() 의 reader.cancel() 이 {done:true}
                    // 로 settle 하므로 누수/unhandled rejection 이 없다.
                    const result = await Promise.race([serial.reader.read(), timeoutPromise]);
                    if (result === 'timeout' || result.done) {
                        break;
                    }
                    identity = this.parseIdentityData(result.value);
                    if (identity) {
                        break;
                    }
                    if (typeof result.value !== 'string' || result.value.slice(0, 2) != 'FF') {
                        // FF 로 시작하는 라인에는 재요청하지 않는다(프로브 증폭 방지)
                        serial.sendAsciiAsBuffer(this.requestInitialData());
                    }
                }
            } catch (error) {
                // 스트림 에러(연결 중 동글 제거 등)로 read 가 reject 하거나 write 가 동기
                // throw 해도 아래 정리 경로로 합류시킨다. throw 로 빠지면 포트 정리가
                // 건너뛰어져 "실패 시 포트 방치" 결함이 이 창에서 재발한다.
                console.error(error);
                identity = undefined;
            }
            clearTimeout(timer);
            if (!identity) {
                // 실패 시 코어(hw_lite.connect catch)는 포트를 닫지 않는다. 열린 포트가
                // 방치되면 같은 동글은 port.open() InvalidStateError 로 새로고침 전까지
                // 재연결이 불가능하므로 모듈이 직접 정리한다.
                // 정리 실패는 삼킨다. 던지면 이 함수가 boolean 대신 예외를 내보내고,
                // 호출부가 핸드셰이크 실패가 아니라 포트 닫기 오류를 보게 된다.
                await this.__closePort(serial);
                return false;
            }
            if (!this.acceptsIdentity(identity)) {
                // 고른 항목이 받지 않는 기종이다. 위 실패 분기와 같은 정리를 반드시 거친다.
                // 정리를 먼저 한다. 토스트가 던지면 포트가 열린 채 남아 같은 동글이
                // 새로고침 전까지 재연결 불가가 된다.
                await this.__closePort(serial);
                this.onRejectedAtConnect();
                return false;
            }
            // 새 연결은 새 세션이다. 이 인스턴스는 모듈 스코프 싱글턴이라 지난 세션의
            // 거부 상태가 스스로 사라지지 않는다. 안 풀면 재연결이 성공했는데도
            // requestLocalData 가 계속 undefined 를 내고 센서가 얼어붙는다.
            this.onAcceptedIdentity(identity);
            this.setRobotIdentity(identity);
            // 위 주석의 "지난 세션" 은 거부 상태에만 걸리는 것이 아니다. 코어의 어느
            // 해제 경로도 이 인스턴스를 정리하지 않는다. `hw_lite.disconnect()` 는
            // `setZero()` 를 부르지 않고(호출부 0건), 연결 오류 경로는
            // `webSerialConnector.ts:251` 이 `'willDisconnect'` 를 `toggleStop()` 앞에
            // 세워 `engine.js:768` 의 `=== 'connected'` 가드를 일부러 빗나가게 한다.
            // 그래서 새 세션의 정리는 여기서 해야 한다.
            //
            // 재무장: 장치가 바뀌면 그쪽 2비트 순환 id 가 임의 값에서 다시
            // 시작하므로, 지난 세션 값과 비교하면 가짜 완료 또는 완료 누락이 난다.
            // `handleLocalData` 의 런타임 전환 분기에도 같은 호출이 있다. 두 경로 모두
            // 실제로 쓰인다. 연결 중 로봇을 바꾸면 정체 라인이 다시 오고(실측),
            // 재연결은 이 경로를 탄다. 첫 연결에서는 생성자가 이미 원점으로 두어 no-op 이다.
            this.__rearmDeviceSentinels();
            // 센티널 말고도 이전 세션의 구동 상태, 대기 콜백, 타이머, 버튼 엣지가 남는다.
            // 특히 구동 상태를 두면 다음 실행이 시작되는 순간 이전 명령이 발사된다.
            this.__resetSessionState();
            return true;
        }

        // ---------------- 디코드 (장치 -> sensory) ----------------

        handleLocalData(data) {
            // 호출부 1) 정체 수신 경로. 연결 유지 중 동글의 페어링 로봇이 바뀌면
            // 정체 라인이 다시 온다.
            const identity = this.parseIdentityData(data);
            if (identity) {
                // 거부 해제는 정체가 증명된 뒤에만 한다. 종전에는 이 자리에서 주소와
                // 무관하게 풀었고, 그러면 받는 기종의 정체 라인 한 줄로 foreignAttached 가
                // 즉시 풀려 2회 확인이 통째로 우회됐다. 삐오에는 주소 관문이 없으므로 그 순간
                // shouldParseSensory() 가 열려 남의 프레임이 이 기종 규격으로 디코드된다.
                // 해제 자리를 둘로 옮겼다. 주소가 현재와 같을 때(아래 else), 그리고
                // 새 주소가 2회 확인을 통과했을 때다.
                if (identity.address !== this.address) {
                    const pending = this.pendingIdentity;
                    if (pending && pending.address === identity.address) {
                        this.pendingIdentity = undefined;
                        if (!this.acceptsIdentity(identity)) {
                            // 이 항목이 받지 않는 기종이다. 코어 teardown 은 부르지 않는다:
                            // disconnect() 는 작품에 저장된 하드웨어 선택까지 비운다.
                            this.onForeignRobot(identity);
                            return;
                        }
                        // 2회 확인을 통과했다. 이제 해제해도 된다.
                        // initialHandshake 와 같은 순서다(해제 후 정체 확정).
                        this.onAcceptedIdentity(identity);
                        this.setRobotIdentity(identity);
                        // 세션 중 로봇이 바뀐 시점을 남긴다. 이 전환은 사용자에게
                        // "로봇이 갑자기 멈췄다" 로 보이므로 원인 추적에 필요하다.
                        console.info('PioLite: runtime robot identity switch', identity);
                        // setZero() 는 Entry.hwLite.serial.update() 를 통해 새 정체 기준의
                        // 정지 패킷을 즉시 1회 write 한다(의도된 동작).
                        this.setZero();
                        // 장치가 바뀌었으므로 그쪽 순환 id 를 비교하는 센티널을
                        // 원점으로 되돌린다. 같은 주소가 되돌아온 경우는 이 분기에
                        // 들어오지 않으므로 재무장하지 않는다(진행 중인 완료 대기 보호).
                        this.__rearmDeviceSentinels();
                    } else {
                        // 1회성 라인(노이즈)으로 주행 중 정지하지 않도록 동일 정체를
                        // 2회 확인한 뒤에만 전환한다. 확인용 두 번째가 이 프레임 수 안에
                        // 오지 않으면 보류를 폐기한다.
                        // 60프레임은 약 1.2초다. 삐오 스트림은 50~51fps 로 실측됐다.
                        // 햄스터 lite 의 "약 2초" 는 ~30fps 기준이라 그대로 쓰면 안 된다.
                        this.pendingIdentity = identity;
                        this.pendingIdentityTtl = 60;
                    }
                } else {
                    // 현재 주소로 증명된 정체다. 같은 로봇이 되돌아온 경우가 여기다.
                    if (this.acceptsIdentity(identity)) {
                        this.onAcceptedIdentity(identity);
                    }
                    this.pendingIdentity = undefined;
                }
                this.invalidFrameCount = 0;
                return;
            }
            // TTL 감쇠는 아래 관문보다 앞이다. 뒤에 두면 거부 상태에서 보류 정체가
            // 영영 만료되지 않는다.
            if (this.pendingIdentity && --this.pendingIdentityTtl <= 0) {
                this.pendingIdentity = undefined;
            }
            // 호출부 2) 파싱 관문. 받지 않는 기종이 붙어 있는 동안에는 센서 프레임을
            // 해석하지 않는다. 다른 기종의 프레임을 이 기종 규격으로 읽으면 센서값에
            // 쓰레기가 들어간다.
            if (!this.shouldParseSensory()) {
                return;
            }
            var packet = String(data);
            // 길이 실패는 조용하다. 잘린 라인은 기종 불일치의 증거가 아니다.
            if (packet.length != 53) return; // 잘리거나 손상된 프레임 폐기
            // 호출부 3) 헤더 검사. 원본은 여기서 조용히 return 하는데, 호출을 넣지 않으면
            // reportInvalidFrame 이 호출부 0건이 되어 30프레임 재프로브 복구가 사라진다.
            if (parseInt(packet.slice(0, 1), 16) != 1) {
                this.reportInvalidFrame();
                return;
            }
            this.invalidFrameCount = 0;
            var sensory = this.sensory;
            var value;

            sensory.pulseCount = parseInt(packet.slice(2, 6), 16);
            if (sensory.pulseCount != this._event_pulse_count)
                this._event_pulse_count = sensory.pulseCount;

            sensory.neckEncoder = parseInt(packet.slice(6, 8), 16);

            // 버튼 (packet[8:10])
            value = parseInt(packet.slice(8, 10), 16);
            sensory.runButton = value & 0x01;
            sensory.forwardButton = (value >> 1) & 0x01;
            sensory.backwardButton = (value >> 2) & 0x01;
            sensory.leftButton = (value >> 3) & 0x01;
            sensory.rightButton = (value >> 4) & 0x01;
            sensory.behaviorButton = (value >> 5) & 0x01;
            sensory.repeatButton = (value >> 6) & 0x01;
            sensory.clearButton = (value >> 7) & 0x01;

            // 완료 바이트 1 (packet[10:12]): 바퀴/목/눈 2비트 순환 id
            value = parseInt(packet.slice(10, 12), 16);
            var id = (value >> 6) & 0x03;
            if (this._wheel_event == 1) {
                if (id != this._wheel_state_id && this._wheel_state_id != -1) {
                    this._bumpWheelState();
                    this._wheel_event = 0;
                    // 장치는 펄스 목표 지점에서 완료 이벤트만 올리고 지정 속도로 계속 주행한다.
                    // 완료 후 바퀴를 0으로 세우는 것은 호스트의 몫이다.
                    this._left_wheel = 0;
                    this._right_wheel = 0;
                }
            }
            this._wheel_state_id = id;

            id = (value >> 4) & 0x03;
            if (this._neck_event == 1) {
                if (id != this._neck_state_id && this._neck_state_id != -1) {
                    this._bumpNeckState();
                    this._neck_event = 0;
                }
            }
            this._neck_state_id = id;

            id = (value >> 2) & 0x03;
            if (this._eye_event == 1) {
                if (id != this._eye_state_id && this._eye_state_id != -1) {
                    this._eye_event = 0;
                }
            }
            this._eye_state_id = id;

            // 완료 바이트 2 (packet[12:14]): 소리/키/usb/충전
            value = parseInt(packet.slice(12, 14), 16);
            id = (value >> 6) & 0x03;
            if (this._sound_event == 1) {
                if (id != this._sound_state_id && this._sound_state_id != -1) {
                    this._sound_event = 0;
                    if (this._current_sound > 0) {
                        if (this._sound_repeat < 0) {
                            this._runSound(this._current_sound, -1);
                        } else if (this._sound_repeat > 1) {
                            this._sound_repeat -= 1;
                            this._runSound(this._current_sound, this._sound_repeat);
                        } else {
                            this._current_sound = 0;
                            this._sound_repeat = 1;
                            this._bumpSoundState();
                        }
                    } else {
                        this._current_sound = 0;
                        this._sound_repeat = 1;
                    }
                }
            }
            this._sound_state_id = id;

            id = (value >> 4) & 0x03;
            this._event_key_state_id = id;

            var state = (value >> 1) & 0x01;
            sensory.usbState = state;
            this._event_usb_state = state;

            state = value & 0x01;
            state = 1 - state; // 충전 극성 반전
            sensory.chargeState = state;
            this._event_charge_state = state;

            // 배터리 (packet[36:38]) -> 전압 -> 상태
            value = parseInt(packet.slice(36, 38), 16);
            value = (value + 200) / 100.0;
            state = 3;
            if (value < 3.35) state = 0;
            else if (value < 3.4) state = 1;
            else if (value < 3.5) state = 2;
            sensory.batteryState = state;

            // 신호 세기 (packet[38:40])
            value = parseInt(packet.slice(38, 40), 16);
            value -= 0x100;
            sensory.signalStrength = value;

            // 말미. handleSensory() 가 머리에서 clearEvent() 를 돌리므로
            // hasButtonEvent() 는 반드시 그 뒤다. 앞에 두면 직전 프레임의 엣지를 읽는다.
            // 발화 이름은 블록 정의의 `event:` 필드와 같은 문자열이어야 한다.
            this.handleSensory();
            if (this.hasButtonEvent()) {
                Entry.engine.fireEvent('pioliteWhenButtonState');
            }
        }

        _bumpWheelState() {
            this._wheelStateJson = (this._wheelStateJson % 255) + 1;
            this.sensory.wheelStateId = this._wheelStateJson;
        }

        _bumpNeckState() {
            this._neckStateJson = (this._neckStateJson % 255) + 1;
            this.sensory.neckStateId = this._neckStateJson;
        }

        _bumpSoundState() {
            this._soundStateJson = (this._soundStateJson % 255) + 1;
            this.sensory.soundStateId = this._soundStateJson;
        }

        _runSound(sound, repeat) {
            if (typeof repeat != 'number') repeat = 1;
            if (repeat < 0) repeat = -1;
            if (repeat != 0) {
                this._current_sound = sound;
                this._sound_repeat = repeat;
                this._sound = sound;
                this._sound_written = true;
            }
        }

        // motionType -> (leftVel, rightVel) 부호. 속도 크기는 DEFAULT_VELOCITY
        _motionVelocity(type) {
            var v = Module.DEFAULT_VELOCITY;
            switch (type) {
                case 1:
                case 101:
                    return [v, v]; // forward
                case 2:
                case 102:
                    return [-v, -v]; // backward
                case 3:
                case 103:
                    return [-v, v]; // turn left
                case 4:
                case 104:
                    return [v, -v]; // turn right
                case 5:
                    return [0, v]; // pivot left, forward
                case 6:
                    return [0, -v]; // pivot left, backward
                case 7:
                    return [v, 0]; // pivot right, forward
                case 8:
                    return [-v, 0]; // pivot right, backward
            }
            return [0, 0];
        }

        // motionType + unit + value -> 펄스 목표 (시간/연속 모션은 0)
        _motionPulse(type, unit, value) {
            // unit: 1 = cm/deg, 2 = 초, 3 = 펄스
            if (unit == 2) return 0; // SEC은 타이머가 처리
            if (unit == 3) return this._round(value); // 펄스 직접 사용
            // unit == 1
            switch (type) {
                case 1:
                case 2:
                case 101:
                case 102:
                    return this._round(value * Module.CM_TO_PULSE);
                case 3:
                case 4:
                case 103:
                case 104:
                    return this._round(value * Module.DEG_TO_PULSE_SPIN);
                case 5:
                case 6:
                    return this._round(value * Module.DEG_TO_PULSE_PIVOT_LEFT);
                case 7:
                case 8:
                    return this._round(value * Module.DEG_TO_PULSE_PIVOT_RIGHT);
            }
            return 0;
        }

        // 원본 Module.prototype.handleRemoteData 에서 1)(필드복사 루프)만 뺀 것.
        // 인자가 없다. 브리지(handler)의 소비자가 lite 에서 둘 다 폐기됐다.
        // 남은 (2) id 엣지 래칭과 (3) 눈 RGB, 부저 매주기 대입은 원본 순서 그대로다.
        // (3)은 조건 없는 대입이라 눈에 잘 띄지 않는다. 빠뜨리면 눈과 부저가 동작하지 않는다.
        __latchCommands() {
            var m = this.motoring;

            // 터보 (id 변경 시)
            if (m.turboId != this._prev_turboId) {
                this._prev_turboId = m.turboId;
                this._turbo = m.turbo;
            }

            // 목 속도 (id 변경 시)
            // `neckSpeed` 클램프 의무가 블록 계층으로 넘어왔다. 여기서 `_sat` 를 거치지
            // 않고 `__encodeFrame` 의 `toHex` 가 `& 0xff` 로 마스킹하므로, 범위를 넘은
            // 유한값은 잘려서 다른 속도가 된다(계산상 1e9 이면 `00`). 원본과 같은
            // 동작이지만, 설치형에서는 IPC 앞의 `PioRobot` 이 먼저 클램프했다. lite 에는
            // 그 홉이 없으므로 블록 계층의 목속도 설정이 범위를 지켜야 한다.
            if (m.neckSpeedId != this._prev_neckSpeedId) {
                this._prev_neckSpeedId = m.neckSpeedId;
                this._neck_speed = m.neckSpeed;
            }
            // 목 각도 (id 변경 시에만 기록)
            if (m.neckAngleId != this._prev_neckAngleId) {
                this._prev_neckAngleId = m.neckAngleId;
                this._neck_angle = this._sat(m.neckAngle, -90, 90);
                this._neck_angle_written = true;
            }

            // 눈: 매 주기 RGB 직접 설정
            this._left_red = this._sat(m.leftEyeRed, 0, 255);
            this._left_green = this._sat(m.leftEyeGreen, 0, 255);
            this._left_blue = this._sat(m.leftEyeBlue, 0, 255);
            this._right_red = this._sat(m.rightEyeRed, 0, 255);
            this._right_green = this._sat(m.rightEyeGreen, 0, 255);
            this._right_blue = this._sat(m.rightEyeBlue, 0, 255);
            if (m.eyePatternId != this._prev_eyePatternId) {
                this._prev_eyePatternId = m.eyePatternId;
                this._eye_pattern = m.eyePattern;
                this._eye_pattern_written = true;
            }

            // 부저 직접 설정
            this._buzzer = this._sat(m.buzzer, 0, 6553.5);
            // 음 (id 변경 시)
            // `note` 는 블록 계층이 유한성을 보장해야 한다. 인코더에서 `_sat` 를 거치지
            // 않는 유일한 필드이고, `__encodeFrame` 의 `this._note > 0` 이 인코더에서 유일한
            // 무가공 참-검사다. `Infinity > 0` 이 참이라 버저 분기 대신 음 분기를 타서
            // 나가는 바이트의 의미가 달라진다(길이 54 는 불변이라 장치 동기는 안 깨진다).
            // 설치형에서는 IPC 의 JSON 왕복이 비유한 값을 `null` 로 만들어 걸렀지만
            // lite 에는 그 홉이 없다. `note` 는 드롭다운 두 개(음이름, 옥타브)로만 채워지고
            // 옥타브도 범위 검사를 거치므로 비유한값이 들어올 자리가 없다.
            // 그 전제가 깨지면 여기다.
            if (m.noteId != this._prev_noteId) {
                this._prev_noteId = m.noteId;
                this._note = m.note;
            }
            // 소리 (id 변경 시에만 기록)
            if (m.soundId != this._prev_soundId) {
                this._prev_soundId = m.soundId;
                this._runSound(Module.SOUNDS[m.sound] !== undefined ? m.sound : 0, 1);
            }

            // 모션 처리 (id 변경 시)
            if (m.motionId != this._prev_motionId) {
                this._prev_motionId = m.motionId;
                this._sec_motion_active = false;
                var type = m.motionType;
                if (type == 0) {
                    // 연속 바퀴 (setWheels/changeWheels/stop)
                    this._left_wheel = this._sat(m.leftWheel, -100, 100);
                    this._right_wheel = this._sat(m.rightWheel, -100, 100);
                    this._pulse = 0;
                    this._pulse_written = true;
                } else {
                    var unit = m.motionUnit || 1;
                    var value = m.motionValue;
                    // 기본 이동/회전(101-104)은 value가 0 -> 기본 거리/각도
                    if (type >= 101 && type <= 104 && (!value || value <= 0)) {
                        value = type <= 102 ? 10 : 90; // 10cm 이동 / 90deg 회전
                        unit = 1;
                    }
                    var vel = this._motionVelocity(type);
                    if (unit == 2) {
                        // SEC: 속도는 지금, 완료는 타이머
                        this._left_wheel = vel[0];
                        this._right_wheel = vel[1];
                        this._pulse = 0;
                        this._pulse_written = true;
                        this._sec_motion_active = true;
                        // 유한한 초만 타이머에 쓴다. "abc"처럼 숫자가 아닌 참 값은 end를 NaN으로
                        // 만들고, 그러면 Date.now() >= end 가 영원히 거짓이 된다. 이 타이머가
                        // wheelStateId 증가의 유일한 출처라서(__encodeFrame 주석 참고)
                        // 블록이 끝나지 않는다.
                        var sec = parseFloat(value);
                        if (!isFinite(sec) || sec < 0) sec = 0;
                        this._sec_motion_end = Date.now() + sec * 1000;
                    } else {
                        var pulse = this._sat(this._motionPulse(type, unit, value), 0, 65535);
                        if (pulse > 0) {
                            this._left_wheel = vel[0];
                            this._right_wheel = vel[1];
                            this._pulse = pulse;
                        } else {
                            this._left_wheel = 0;
                            this._right_wheel = 0;
                            this._pulse = 0;
                        }
                        this._pulse_written = true;
                    }
                }
            }
        }

        // ---------------- 인코드 (motoring -> 장치) ----------------

        // 원본 Module.prototype.requestLocalData. 본문 무수정.
        __encodeFrame() {
            // SEC(초) 모션 완료는 호스트가 매 틱 폴링하는 송신 루프에서 처리한다(새 motoring에서만
            // 불리는 __latchCommands가 아님). SEC 이동은 pulse=0이라 장치가 바퀴 완료를 보내지 않으므로,
            // 블록 계층이 기다리는 wheelStateId 증가는 이 타이머가 유일한 출처다.
            //
            // lite 전용 조건이다. 엔진 상태를 본다.
            // 코어는 `requestLocalData()` 를 매 틱 무조건 부르고 write 만
            // `Entry.engine.isState('run')` 으로 막는다(`webSerialConnector.ts:174-179`).
            // 그래서 엔진이 정지한 동안에도 이 함수가 계속 불리고, 조건이 없으면
            // 버려질 프레임이 SEC 완료를 발화시켜 다음 실행의 대기 블록이 조기 완료된다.
            // 설치형에는 이 경로가 없다. entry-hw 가 별 프로세스에서 자기 주기로 돈다.
            //
            // `isState` 가 없는 환경에서는 막지 않는다. 없다고 영영 완료를 못 하게 만드는
            // 쪽이 조기 완료보다 나쁘다(대기 블록이 무한 정지한다).
            const engineRunning =
                !Entry.engine || typeof Entry.engine.isState !== 'function'
                    ? true
                    : Entry.engine.isState('run');
            if (engineRunning && this._sec_motion_active && Date.now() >= this._sec_motion_end) {
                this._sec_motion_active = false;
                this._left_wheel = 0;
                this._right_wheel = 0;
                this._pulse = 0;
                this._pulse_written = true;
                this._bumpWheelState();
            }

            var result = '10';
            if (this._turbo == 1) result = '11';

            // 바퀴
            if (this._pulse_written) {
                if (this._pulse != 0 || this._wheel_pulse_prev != 0) {
                    this._wheel_id = (this._wheel_id % 15) + 1;
                }
                this._wheel_event = this._pulse > 0 ? 1 : 0;
                this._wheel_pulse_prev = this._pulse;
                this._pulse_written = false;
            }
            if (this._wheel_event == 0) result += this.toHex(this._wheel_id);
            else result += this.toHex(0x10 | this._wheel_id);
            result += this.toHex(this._left_wheel);
            result += this.toHex(this._right_wheel);
            result += this.toHex2(this._pulse);

            // 목
            if (this._neck_angle_written) {
                this._neck_id = (this._neck_id % 15) + 1;
                this._neck_event = 1;
                this._neck_angle_written = false;
            }
            if (this._neck_event == 0) result += this.toHex(this._neck_id);
            else result += this.toHex(0x30 | this._neck_id);
            result += this.toHex(this._neck_speed);
            result += this.toHex(this._neck_angle);

            // 눈
            if (this._eye_pattern_written) {
                this._eye_id = (this._eye_id % 3) + 1;
                this._eye_event = 1;
                this._eye_pattern_written = false;
            }
            if (this._eye_event == 0) {
                result += this.toHex((this._eye_id << 4) | this._eye_id);
                result += this.toHex(this._left_red);
                result += this.toHex(this._left_green);
                result += this.toHex(this._left_blue);
                result += this.toHex(this._right_red);
                result += this.toHex(this._right_green);
                result += this.toHex(this._right_blue);
            } else {
                result += this.toHex(0x80 | (this._eye_id << 4) | (this._eye_pattern & 0x0f));
                result += '000000000000';
            }
            result += '00';

            // 소리 / 음 / 부저 (끝단)
            var temp = Module.SOUNDS[this._sound] || 0;
            if (this._sound_written) {
                if (temp > 0) {
                    this._sound_id = (this._sound_id % 15) + 1;
                    this._sound_event = 1;
                } else {
                    this._sound_event = 0;
                }
            }
            if (temp > 0) {
                if (this._sound_written && this._sound_prev == temp) {
                    result += '000000';
                } else {
                    if (temp > 0x20) {
                        result += this.toHex(0x30 | this._sound_id);
                        result += this.toHex(temp - 0x20);
                    } else {
                        result += this.toHex(0x20 | this._sound_id);
                        result += this.toHex(temp);
                    }
                    result += this.toHex(0);
                }
                this._sound_prev = temp;
            } else if (this._note > 0) {
                result += this.toHex(0x10 | this._sound_id);
                result += this.toHex(this._note);
                result += this.toHex(0);
            } else {
                result += this.toHex(this._sound_id);
                result += this.toHex2(this._round(this._buzzer * 10));
            }
            this._sound_written = false;

            result += '-';
            result += this.address;
            result += '\r';
            return result;
        }

        // ---------------- 로봇 계층 상태 처리 ----------------

        // 버튼 체커의 동명 메서드와 다른 함수다. 이쪽은 8체커를 순회한다.
        clearEvent() {
            for (let i = 0; i < 8; ++i) {
                this.buttonCheckers[i].clearEvent();
            }
        }

        hasButtonEvent() {
            for (let i = 0; i < 8; ++i) {
                const checker = this.buttonCheckers[i];
                if (
                    checker.isPressed() ||
                    checker.isReleased() ||
                    checker.isClicked() ||
                    checker.isLongPressed()
                ) {
                    return true;
                }
            }
            return false;
        }

        __setModule() {
            this.motoring.group = 'pio';
            this.motoring.module = 'pio';
        }

        // 원문 그대로 두되 `__PORT_MAP` 시드 루프는 뺀다. 시드 책임이 생성자로 갔다.
        // 설치형 PioRobot 의 멤버 표면과 맞추기 위해 남긴다.
        // lite 에는 공유 sendQueue 가 없어 호출부가 0건이지만, 본문은 원본 그대로 둔다.
        // 빠진 필드를 채우는 루프가 없으면 이 메서드가 불릴 때 motoring 이 포트 키도
        // 프레임 계층 필드도 없는 객체로 바뀌어 `(motoring.xId % 255) + 1` 이 NaN 이 된다.
        setMotoring(motoring) {
            this.motoring = motoring;
            const portMap = this.__PORT_MAP;
            for (const port in portMap) {
                if (motoring[port] === undefined) {
                    motoring[port] = portMap[port];
                }
            }
        }

        // 여기서 부르는 __board, __cancel*, __check* 계열은 전부 콜백
        // (boardCallback, motionCallback, neckMotionCallback)이 살아 있을 때만 도달하고,
        // 그 콜백은 블록 메서드가 세운다.
        // 예외는 소리 분기다: `sensory.soundStateId` 가 바뀌면 콜백 없이도 들어간다.
        handleSensory() {
            const sensory = this.sensory;

            // 버튼 엣지 이벤트는 매 수신 패킷 시작 시(재감지 전) 지운다.
            // handleLocalData 말미가 직후 햇 블록 이벤트를 발생시키고 그 햇은 다음 엔진
            // 틱에서 실행되므로, 지우는 시점을 패킷 주기에 맞춰야 엣지 플래그가 패킷 사이
            // 구간 동안 살아 있어 햇이 엣지당 한 번씩 감지한다.
            this.clearEvent();
            for (let i = 0; i < 8; ++i) {
                this.buttons[i] = sensory[this.__BUTTONS[i]];
                this.buttonCheckers[i].check(this.buttons[i] == 1);
            }
            if (this.boardCallback && sensory.wheelStateId !== undefined) {
                const t = sensory.wheelStateId;
                if (t != this.wheelStateId) {
                    if (this.wheelStateId != -1) {
                        const motoring = this.motoring;
                        if (this.boardCommand == 1 || this.boardCommand == 2) {
                            motoring.leftWheel = 0;
                            motoring.rightWheel = 0;
                            this.__finishBoard();
                            this.boarding = false;
                            this.__checkWheelMoving();
                        } else if (this.boardCommand == 3) {
                            switch (this.boardState) {
                                case 1:
                                    this.__board(3, 2, 3, 90, this.boardCallback);
                                    break;
                                case 2:
                                    this.__board(3, 3, 1, 11.45, this.boardCallback);
                                    break;
                                case 3: {
                                    motoring.leftWheel = 0;
                                    motoring.rightWheel = 0;
                                    this.__finishBoard();
                                    this.boarding = false;
                                    this.__checkWheelMoving();
                                    break;
                                }
                            }
                        } else if (this.boardCommand == 4) {
                            switch (this.boardState) {
                                case 1:
                                    this.__board(4, 2, 4, 90, this.boardCallback);
                                    break;
                                case 2:
                                    this.__board(4, 3, 1, 11.45, this.boardCallback);
                                    break;
                                case 3: {
                                    motoring.leftWheel = 0;
                                    motoring.rightWheel = 0;
                                    this.__finishBoard();
                                    this.boarding = false;
                                    this.__checkWheelMoving();
                                    break;
                                }
                            }
                        } else if (this.boardCommand == 5) {
                            switch (this.boardState) {
                                case 1:
                                    this.__board(5, 2, 3, 90, this.boardCallback);
                                    break;
                                case 2:
                                    this.__board(5, 3, 1, 1.45, this.boardCallback);
                                    break;
                                case 3: {
                                    motoring.leftWheel = 0;
                                    motoring.rightWheel = 0;
                                    this.__finishBoard();
                                    this.boarding = false;
                                    this.__checkWheelMoving();
                                    break;
                                }
                            }
                        } else if (this.boardCommand == 6) {
                            switch (this.boardState) {
                                case 1:
                                    this.__board(6, 2, 4, 90, this.boardCallback);
                                    break;
                                case 2:
                                    this.__board(6, 3, 1, 1.45, this.boardCallback);
                                    break;
                                case 3: {
                                    motoring.leftWheel = 0;
                                    motoring.rightWheel = 0;
                                    this.__finishBoard();
                                    this.boarding = false;
                                    this.__checkWheelMoving();
                                    break;
                                }
                            }
                        }
                    }
                    this.wheelStateId = t;
                }
            }
            if (this.motionCallback && sensory.wheelStateId !== undefined) {
                const t = sensory.wheelStateId;
                if (t != this.wheelStateId) {
                    if (this.wheelStateId != -1) {
                        this.motoring.leftWheel = 0;
                        this.motoring.rightWheel = 0;
                        this.motioning = false;
                        this.__finishMotion();
                        this.__checkWheelMoving();
                    }
                    this.wheelStateId = t;
                }
            }
            if (this.neckMotionCallback && sensory.neckStateId !== undefined) {
                const t = sensory.neckStateId;
                if (t != this.neckStateId) {
                    if (this.neckStateId != -1) {
                        this.neckMotioning = false;
                        this.__finishNeckMotion();
                    }
                    this.neckStateId = t;
                }
            }
            if (sensory.soundStateId !== undefined) {
                const t = sensory.soundStateId;
                if (t != this.soundStateId) {
                    if (this.soundStateId != -1) {
                        if (this.currentSound > 0) {
                            if (this.soundRepeat < 0) {
                                this.__runSound(this.currentSound, -1);
                            } else if (this.soundRepeat > 1) {
                                this.soundRepeat--;
                                this.__runSound(this.currentSound, this.soundRepeat);
                            } else {
                                this.currentSound = 0;
                                this.soundRepeat = 1;
                                this.sounding = false;
                                this.__finishSound();
                                this.__checkSoundPlaying();
                            }
                        } else {
                            this.currentSound = 0;
                            this.soundRepeat = 1;
                            this.sounding = false;
                            this.__finishSound();
                            this.__checkSoundPlaying();
                        }
                    }
                    this.soundStateId = t;
                }
            }
        }

        // ---------------- 로봇 계층: 이동과 회전 (21개) ----------------
        // 원본 block_robomation.js 의 PioRobot.prototype 정의 순서를 그대로 유지한다.
        // 본문 무수정. 헤더만 `X = function(a){` 에서 `X(a) {` 로 바꾸고 8칸 들여썼다.

        __motionLimit(type, unit) {
            if (unit === 3) return { max: this.__MAX_PULSE, unit: '' };
            if (unit !== 1) return null;
            const per = this.__PULSE_PER_UNIT[type];
            if (!per) return null;
            // 안내 문구에 적히는 한계값과 실제로 전송되는 값이 같도록 소수 1자리에서 내린다.
            return {
                max: Math.floor((this.__MAX_PULSE / per) * 10) / 10,
                unit: type <= 2 ? 'cm' : '°',
            };
        }

        __clampWheels() {
            const motoring = this.motoring;
            const L = this.__LIMITS.wheel;
            motoring.leftWheel = this.__clamp('wheel', motoring.leftWheel, L.min, L.max, L.unit);
            motoring.rightWheel = this.__clamp('wheel', motoring.rightWheel, L.min, L.max, L.unit);
        }

        __setPulse(pulse) {
            this.motoring.pulse = pulse;
            this.motoring.pulseId = (this.motoring.pulseId % 255) + 1;
        }

        __setMotion(type, unit, speed, value, radius) {
            const motoring = this.motoring;
            motoring.motionType = type;
            motoring.motionUnit = unit;
            motoring.motionSpeed = speed;
            motoring.motionValue = value;
            motoring.motionRadius = radius;
            this.motoring.motionId = (this.motoring.motionId % 255) + 1;
            this.motioning = type != 0;
        }

        // ---------------- 취소와 완료의 계약 ----------------
        //
        // `__cancel*` 은 상태만 비운다. 알리지 않는다.
        // `__finish*` 은 손잡이를 먼저 꺼내고, `__cancel*` 로 상태를 정리한 뒤, 마지막에 알린다.
        // 정리가 끝난 뒤에 알려야 콜백이 새 명령을 내도 그 상태가 곧바로 지워지지 않는다.
        //
        // 손잡이는 인스턴스당 한 칸이고 소유자 표식이 없다. 그래서 호출부를 다음 둘로 가른다.
        //
        //   밀려나는 소유자가 생기는 자리 -> `__finish*`
        //     새 명령이 앞 명령을 대체하거나(바퀴 속도 정하기, 새 음 내기) 진짜로 멈춘다
        //     (정지, 목 정지). 어느 쪽이든 앞 대기는 실제로 끝났다. 로봇이 그 동작을
        //     더 하지 않으므로 완료 신호가 영영 오지 않는다. 안 깨우면 그 블록은 완료
        //     표시를 기다리며 영원히 폴링한다(화면에 오류가 없어 "블록이 안 넘어가요" 로만
        //     보고된다. 실제 사용자 보고가 있었다).
        //
        //   깨울 소유자가 없는 자리 -> `__cancel*`
        //     `__finish*` 자신의 내부 정리, 그리고 세션 초기화(`setZero` 는 다섯 손잡이를
        //     자기가 직접 해소한다).
        //
        // 한 방향으로 통일하면 반대편이 깨진다.
        // 전부 알리게 하면 `__finish*` 이 이중 호출되고, 전부 안 알리게 하면 정지가 hang 된다.
        // 가르는 축은 "덮어쓰기냐 취소냐" 가 아니라 "밀려나는 소유자가 있느냐" 다.
        // 그래서 `setWheel` 처럼 성격이 애매한 블록도 판정이 갈리지 않는다. 밀어내므로 깨운다.
        __cancelMotion() {
            this.motionCallback = undefined;
            this.motioning = false;
        }

        __cancelBoard() {
            this.boardCommand = 0;
            this.boardState = 0;
            this.boardCallback = undefined;
            this.boarding = false;
        }

        __checkWheelMoving() {
            const motoring = this.motoring;
            this.wheelMoving = motoring.leftWheel != 0 || motoring.rightWheel != 0;
        }

        __motion(type, callback) {
            const motoring = this.motoring;
            this.__finishBoard();
            // `__motionUnit` 과 맞춘다. 종전에는 이 호출이 없어 아래 `motionCallback` 대입이
            // 앞 소유자를 조용히 버렸고, 그 블록은 완료 신호가 영영 안 와서 영구 hang 됐다.
            //
            // 순서가 전제를 하나 깐다. 위 `__finishBoard()` 가 부른 보드 콜백이 이동 명령을
            // 내면 바로 아래 호출이 그것을 지운다. 지금은 보드 손잡이에 걸리는 콜백이
            // `boardMove` 와 `boardTurn` 의 종결 클로저 둘뿐이라 성립한다(`script.isMoving`
            // 만 내리고 명령을 내지 않는다). `__board()` 에 명령을 내는 콜백을 새로 넘기면
            // 이 전제가 깨지므로 그때는 순서를 다시 본다.
            this.__finishMotion();

            motoring.leftWheel = 0;
            motoring.rightWheel = 0;
            this.__setPulse(0);
            this.__setMotion(type, 1, 0, 0, 0); // type, unit, speed, value, radius
            this.motionCallback = callback;
            this.wheelStateId = this.sensory.wheelStateId; // 완료 기준선 캡처(재실행 desync 방지, __board 주석 참고)
            this.__checkWheelMoving();
        }

        __motionUnit(type, unit, value, callback) {
            const motoring = this.motoring;
            this.__finishBoard();
            this.__finishMotion();

            motoring.leftWheel = 0;
            motoring.rightWheel = 0;
            this.__setPulse(0);
            value = this.__finite(value);
            if (value && value > 0) {
                const limit = this.__motionLimit(type, unit);
                if (limit) {
                    value = this.__clamp(
                        'motion:' + limit.max + limit.unit,
                        value,
                        0,
                        limit.max,
                        limit.unit
                    );
                }
                this.__setMotion(type, unit, 0, value, 0); // type, unit, speed, value, radius
                this.motionCallback = callback;
                this.wheelStateId = this.sensory.wheelStateId; // 완료 기준선 캡처(재실행 desync 방지, __board 주석 참고)
                this.__checkWheelMoving();
            } else {
                this.__setMotion(0, 0, 0, 0, 0);
                this.__checkWheelMoving();
                callback();
            }
        }

        moveForward(script) {
            this.__setModule();
            if (!script.isStart) {
                script.isStart = true;
                script.isMoving = true;
                this.__motion(101, () => {
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

        moveBackward(script) {
            this.__setModule();
            if (!script.isStart) {
                script.isStart = true;
                script.isMoving = true;
                this.__motion(102, () => {
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

        turn(script) {
            this.__setModule();
            if (!script.isStart) {
                script.isStart = true;
                script.isMoving = true;
                const direction = script.getField('DIRECTION');
                const callback = () => {
                    script.isMoving = false;
                };
                if (direction == 'LEFT') {
                    this.__motion(103, callback);
                } else {
                    this.__motion(104, callback);
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

        moveForwardUnit(script) {
            this.__setModule();
            if (!script.isStart) {
                script.isStart = true;
                script.isMoving = true;
                const value = script.getNumberValue('VALUE');
                const unit = this.__UNITS[script.getField('UNIT')];
                const callback = () => {
                    script.isMoving = false;
                };
                if (value < 0) {
                    this.__motionUnit(2, unit, -value, callback);
                } else {
                    this.__motionUnit(1, unit, value, callback);
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
            this.__setModule();
            if (!script.isStart) {
                script.isStart = true;
                script.isMoving = true;
                const value = script.getNumberValue('VALUE');
                const unit = this.__UNITS[script.getField('UNIT')];
                const callback = () => {
                    script.isMoving = false;
                };
                if (value < 0) {
                    this.__motionUnit(1, unit, -value, callback);
                } else {
                    this.__motionUnit(2, unit, value, callback);
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
            this.__setModule();
            if (!script.isStart) {
                script.isStart = true;
                script.isMoving = true;
                const direction = script.getField('DIRECTION');
                const value = script.getNumberValue('VALUE');
                const unit = this.__UNITS[script.getField('UNIT')];
                const callback = () => {
                    script.isMoving = false;
                };
                if (direction == 'LEFT') {
                    if (value < 0) {
                        this.__motionUnit(4, unit, -value, callback);
                    } else {
                        this.__motionUnit(3, unit, value, callback);
                    }
                } else {
                    if (value < 0) {
                        this.__motionUnit(3, unit, -value, callback);
                    } else {
                        this.__motionUnit(4, unit, value, callback);
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

        pivotUnit(script) {
            this.__setModule();
            if (!script.isStart) {
                script.isStart = true;
                script.isMoving = true;
                const wheel = script.getField('WHEEL');
                const value = script.getNumberValue('VALUE');
                const unit = this.__UNITS[script.getField('UNIT')];
                const toward = script.getField('TOWARD');
                const callback = () => {
                    script.isMoving = false;
                };
                if (wheel == 'LEFT') {
                    if (toward == 'FORWARD') {
                        if (value < 0) this.__motionUnit(6, unit, -value, callback);
                        else this.__motionUnit(5, unit, value, callback);
                    } else {
                        if (value < 0) this.__motionUnit(5, unit, -value, callback);
                        else this.__motionUnit(6, unit, value, callback);
                    }
                } else {
                    if (toward == 'FORWARD') {
                        if (value < 0) this.__motionUnit(8, unit, -value, callback);
                        else this.__motionUnit(7, unit, value, callback);
                    } else {
                        if (value < 0) this.__motionUnit(7, unit, -value, callback);
                        else this.__motionUnit(8, unit, value, callback);
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

        changeWheels(script) {
            this.__setModule();
            const motoring = this.motoring;
            this.__finishBoard();
            this.__finishMotion();

            const leftVelocity = this.__finite(script.getNumberValue('LEFT'));
            const rightVelocity = this.__finite(script.getNumberValue('RIGHT'));
            if (leftVelocity !== undefined) motoring.leftWheel += leftVelocity;
            if (rightVelocity !== undefined) motoring.rightWheel += rightVelocity;
            this.__setPulse(0);
            this.__setMotion(0, 0, 0, 0, 0);
            this.__clampWheels();
            this.__checkWheelMoving();
            return script.callReturn();
        }

        setWheels(script) {
            this.__setModule();
            const motoring = this.motoring;
            this.__finishBoard();
            this.__finishMotion();

            const leftVelocity = this.__finite(script.getNumberValue('LEFT'));
            const rightVelocity = this.__finite(script.getNumberValue('RIGHT'));
            if (leftVelocity !== undefined) motoring.leftWheel = leftVelocity;
            if (rightVelocity !== undefined) motoring.rightWheel = rightVelocity;
            this.__setPulse(0);
            this.__setMotion(0, 0, 0, 0, 0);
            this.__clampWheels();
            this.__checkWheelMoving();
            return script.callReturn();
        }

        changeWheel(script) {
            this.__setModule();
            const motoring = this.motoring;
            this.__finishBoard();
            this.__finishMotion();

            const wheel = script.getField('WHEEL');
            const velocity = this.__finite(script.getNumberValue('VALUE'));
            if (velocity !== undefined) {
                if (wheel == 'LEFT') {
                    motoring.leftWheel += velocity;
                } else if (wheel == 'RIGHT') {
                    motoring.rightWheel += velocity;
                } else {
                    motoring.leftWheel += velocity;
                    motoring.rightWheel += velocity;
                }
            }
            this.__setPulse(0);
            this.__setMotion(0, 0, 0, 0, 0);
            this.__clampWheels();
            this.__checkWheelMoving();
            return script.callReturn();
        }

        setWheel(script) {
            this.__setModule();
            const motoring = this.motoring;
            this.__finishBoard();
            this.__finishMotion();

            const wheel = script.getField('WHEEL');
            const velocity = this.__finite(script.getNumberValue('VALUE'));
            if (velocity !== undefined) {
                if (wheel == 'LEFT') {
                    motoring.leftWheel = velocity;
                } else if (wheel == 'RIGHT') {
                    motoring.rightWheel = velocity;
                } else {
                    motoring.leftWheel = velocity;
                    motoring.rightWheel = velocity;
                }
            }
            this.__setPulse(0);
            this.__setMotion(0, 0, 0, 0, 0);
            this.__clampWheels();
            this.__checkWheelMoving();
            return script.callReturn();
        }

        stop(script) {
            this.__setModule();
            const motoring = this.motoring;
            this.__finishBoard();
            this.__finishMotion();

            motoring.leftWheel = 0;
            motoring.rightWheel = 0;
            this.__setPulse(0);
            this.__setMotion(0, 0, 0, 0, 0);
            this.__checkWheelMoving();
            return script.callReturn();
        }

        // ---------------- 로봇 계층: 목과 눈 (14개) ----------------
        // 원본 정의 순서 유지. 본문 무수정. 헤더만 클래스 메서드로 바꾸고 8칸 들여썼다.

        __clampEyes() {
            const motoring = this.motoring;
            const L = this.__LIMITS.eyeRgb;
            for (const key of this.__EYE_CHANNELS) {
                motoring[key] = this.__clamp('eye', motoring[key], L.min, L.max, L.unit);
            }
        }

        __setNeckSpeed(speed) {
            this.motoring.neckSpeed = speed;
            this.motoring.neckSpeedId = (this.motoring.neckSpeedId % 255) + 1;
        }

        __setNeckAngle(deg) {
            const L = this.__LIMITS.neckAngle;
            if (!Number.isFinite(deg)) deg = 0;
            else if (deg < L.min || deg > L.max) {
                deg = deg < L.min ? L.min : L.max;
                this.__warnNeckRange();
            }
            this.motoring.neckAngle = deg;
            this.motoring.neckAngleId = (this.motoring.neckAngleId % 255) + 1;
            this.neckMotioning = deg != 0;
        }

        __cancelNeckMotion() {
            this.neckMotionCallback = undefined;
            this.neckMotioning = false;
        }

        __setRgb(eye, red, green, blue) {
            const motoring = this.motoring;
            red = this.__finite(red);
            green = this.__finite(green);
            blue = this.__finite(blue);
            if (eye == 'LEFT') {
                if (red !== undefined) motoring.leftEyeRed = red;
                if (green !== undefined) motoring.leftEyeGreen = green;
                if (blue !== undefined) motoring.leftEyeBlue = blue;
            } else if (eye == 'RIGHT') {
                if (red !== undefined) motoring.rightEyeRed = red;
                if (green !== undefined) motoring.rightEyeGreen = green;
                if (blue !== undefined) motoring.rightEyeBlue = blue;
            } else {
                if (red !== undefined) {
                    motoring.leftEyeRed = red;
                    motoring.rightEyeRed = red;
                }
                if (green !== undefined) {
                    motoring.leftEyeGreen = green;
                    motoring.rightEyeGreen = green;
                }
                if (blue !== undefined) {
                    motoring.leftEyeBlue = blue;
                    motoring.rightEyeBlue = blue;
                }
            }
            this.__clampEyes();
        }

        __changeRgb(eye, red, green, blue) {
            const motoring = this.motoring;
            red = this.__finite(red);
            green = this.__finite(green);
            blue = this.__finite(blue);
            if (eye == 'LEFT') {
                if (red !== undefined) motoring.leftEyeRed += red;
                if (green !== undefined) motoring.leftEyeGreen += green;
                if (blue !== undefined) motoring.leftEyeBlue += blue;
            } else if (eye == 'RIGHT') {
                if (red !== undefined) motoring.rightEyeRed += red;
                if (green !== undefined) motoring.rightEyeGreen += green;
                if (blue !== undefined) motoring.rightEyeBlue += blue;
            } else {
                if (red !== undefined) {
                    motoring.leftEyeRed += red;
                    motoring.rightEyeRed += red;
                }
                if (green !== undefined) {
                    motoring.leftEyeGreen += green;
                    motoring.rightEyeGreen += green;
                }
                if (blue !== undefined) {
                    motoring.leftEyeBlue += blue;
                    motoring.rightEyeBlue += blue;
                }
            }
            this.__clampEyes();
        }

        setNeckSpeed(script) {
            this.__setModule();
            const speed = parseInt(script.getField('SPEED'));
            this.__setNeckSpeed(speed);
            return script.callReturn();
        }

        rotateNeck(script) {
            this.__setModule();
            if (!script.isStart) {
                script.isStart = true;
                script.isMoving = true;
                const direction = script.getField('DIRECTION');
                let deg = this.__finite(script.getNumberValue('VALUE'));
                if (deg !== undefined) {
                    // 유효할 때만 깨운다. 무효 입력은 새 명령을 내보내지 않으므로 앞 대기를
                    // 밀어내지 않는다. 밖에 두면 목이 계속 도는데 앞 블록만 완료로 표시된다.
                    this.__finishNeckMotion();
                    if (direction == 'LEFT') deg *= -1;
                    this.__setNeckAngle(deg);
                    this.neckStateId = this.sensory.neckStateId; // 완료 기준선 캡처(재실행 desync 방지, __board 주석 참고)
                    this.neckMotionCallback = () => {
                        script.isMoving = false;
                    };
                } else {
                    script.isMoving = false;
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

        stopNeck(script) {
            this.__setModule();
            this.__finishNeckMotion();
            this.__setNeckAngle(0);
            return script.callReturn();
        }

        setEyeColor(script) {
            this.__setModule();
            const eye = script.getField('EYE');
            const rgb = this.__RGBS[script.getField('COLOR')];
            if (rgb) {
                this.__setRgb(eye, rgb[0], rgb[1], rgb[2]);
            }
            return script.callReturn();
        }

        setEyeColorPicker(script) {
            this.__setModule();
            const eye = script.getField('EYE');
            const color = script.getField('COLOR');
            const red = parseInt(color.slice(1, 3), 16);
            const green = parseInt(color.slice(3, 5), 16);
            const blue = parseInt(color.slice(5, 7), 16);
            this.__setRgb(eye, red, green, blue);
            return script.callReturn();
        }

        changeEyeRgb(script) {
            this.__setModule();
            const eye = script.getField('EYE');
            const red = script.getNumberValue('RED');
            const green = script.getNumberValue('GREEN');
            const blue = script.getNumberValue('BLUE');
            this.__changeRgb(eye, red, green, blue);
            return script.callReturn();
        }

        setEyeRgb(script) {
            this.__setModule();
            const eye = script.getField('EYE');
            const red = script.getNumberValue('RED');
            const green = script.getNumberValue('GREEN');
            const blue = script.getNumberValue('BLUE');
            this.__setRgb(eye, red, green, blue);
            return script.callReturn();
        }

        clearEye(script) {
            this.__setModule();
            const eye = script.getField('EYE');
            this.__setRgb(eye, 0, 0, 0);
            return script.callReturn();
        }

        // ---------------- 로봇 계층: 소리, 말판, 질의 (34개) ----------------
        // 원본 정의 순서 유지. 본문 무수정. 헤더만 클래스 메서드로 바꾸고 8칸 들여썼다.

        __removeTimeout(id) {
            clearTimeout(id);
            const idx = this.timeouts.indexOf(id);
            if (idx >= 0) {
                this.timeouts.splice(idx, 1);
            }
        }

        __setTurbo(turbo) {
            this.motoring.turbo = turbo;
            this.motoring.turboId = (this.motoring.turboId % 255) + 1;
        }

        __setNote(note) {
            this.motoring.note = note;
            this.motoring.noteId = (this.motoring.noteId % 255) + 1;
        }

        __issueNoteId() {
            this.noteId = this.blockId = (this.blockId % 65535) + 1;
            return this.noteId;
        }

        __cancelNote() {
            this.noteId = 0;
            if (this.noteTimer1 !== undefined) {
                this.__removeTimeout(this.noteTimer1);
            }
            if (this.noteTimer2 !== undefined) {
                this.__removeTimeout(this.noteTimer2);
            }
            this.noteTimer1 = undefined;
            this.noteTimer2 = undefined;
            this.noteCallback = undefined;
        }

        __setSound(sound) {
            this.motoring.sound = sound;
            this.motoring.soundId = (this.motoring.soundId % 255) + 1;
        }

        __runSound(sound, count) {
            if (typeof count != 'number') count = 1;
            if (count < 0) count = -1;
            if (count) {
                this.currentSound = sound;
                this.soundRepeat = count;
                this.__setSound(sound);
            }
            this.sounding = sound != 0;
        }

        __cancelSound() {
            this.soundCallback = undefined;
        }

        // 완료 지점 전용. 원본과 같은 순서다. 손잡이를 먼저 꺼내고, 취소로 상태를
        // 정리한 뒤, 마지막에 알린다. 정리가 끝난 뒤에 알려야 콜백이 새 명령을 내도
        // 그 상태가 곧바로 지워지지 않는다.
        __finishMotion() {
            const cb = this.motionCallback;
            this.__cancelMotion();
            if (cb) cb();
        }

        __finishBoard() {
            const cb = this.boardCallback;
            this.__cancelBoard();
            if (cb) cb();
        }

        __finishNeckMotion() {
            const cb = this.neckMotionCallback;
            this.__cancelNeckMotion();
            if (cb) cb();
        }

        __finishSound() {
            const cb = this.soundCallback;
            this.__cancelSound();
            if (cb) cb();
        }

        __finishNote() {
            const cb = this.noteCallback;
            this.__cancelNote();
            if (cb) cb();
        }

        __checkSoundPlaying() {
            const motoring = this.motoring;
            this.buzzing = motoring.buzzer != 0;
            this.noting = motoring.note != 0;
            this.resting = false;
        }

        __board(command, state, type, value, callback) {
            const motoring = this.motoring;
            this.__finishMotion();

            motoring.leftWheel = 0;
            motoring.rightWheel = 0;
            this.boardCommand = command;
            this.boardState = state;
            this.boardCallback = callback;
            // 완료 기준선 캡처: entry-hw wheelStateId는 세션 내내 이어지는 카운터라(재실행에도
            // 리셋 안 됨) 절대값 비교가 재실행 때 어긋난다. 시작 시점의 현재값을 기준으로 잡고
            // 이후 카운터가 증가할 때만 완료로 판정한다(재실행 조기완료, 콜백유실 둘 다 방지).
            this.wheelStateId = this.sensory.wheelStateId;
            this.boarding = true;
            this.__setPulse(0);
            motoring.motionType = type;
            motoring.motionUnit = 1;
            motoring.motionSpeed = 0;
            motoring.motionValue = value;
            motoring.motionRadius = 0;
            this.motoring.motionId = (this.motoring.motionId % 255) + 1;
            this.__checkWheelMoving();
        }

        __playSound(soundField, count) {
            const motoring = this.motoring;
            this.__finishNote();
            this.__finishSound();

            const sound = this.__SOUNDS[soundField];
            count = parseInt(count);
            motoring.buzzer = 0;
            this.__setNote(0);
            if (sound && count) {
                this.__runSound(sound, count);
            } else {
                this.__runSound(0);
            }
            this.__checkSoundPlaying();
        }

        boardMove(script) {
            this.__setModule();
            if (!script.isStart) {
                script.isStart = true;
                script.isMoving = true;
                const direction = script.getField('DIRECTION');
                // 앞 말판 대기를 여기서 깨운다. `__board()` 안에 넣으면 안 된다.
                // 완료 판정(handleSensory)이 구간을 이어 달 때 `this.boardCallback` 을 그대로
                // 인자로 넘겨 `__board()` 를 다시 부르므로, 그 안에서 해소하면 곧 다시 설치할
                // 손잡이를 지운다. 로봇이 남은 구간을 달리는 중에 블록이 끝난다.
                this.__finishBoard();
                const callback = () => {
                    script.isMoving = false;
                };
                if (direction == 'FORWARD') {
                    this.__board(1, 1, 1, 10, callback);
                } else if (direction == 'BACKWARD') {
                    this.__board(2, 1, 2, 10, callback);
                } else if (direction == 'LEFT') {
                    this.__board(3, 1, 2, 1.45, callback);
                } else {
                    this.__board(4, 1, 2, 1.45, callback);
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

        boardTurn(script) {
            this.__setModule();
            if (!script.isStart) {
                script.isStart = true;
                script.isMoving = true;
                const direction = script.getField('DIRECTION');
                // 앞 말판 대기를 여기서 깨운다. `__board()` 안에 넣으면 안 된다.
                // 완료 판정(handleSensory)이 구간을 이어 달 때 `this.boardCallback` 을 그대로
                // 인자로 넘겨 `__board()` 를 다시 부르므로, 그 안에서 해소하면 곧 다시 설치할
                // 손잡이를 지운다. 로봇이 남은 구간을 달리는 중에 블록이 끝난다.
                this.__finishBoard();
                const callback = () => {
                    script.isMoving = false;
                };
                if (direction == 'LEFT') {
                    this.__board(5, 1, 2, 1.45, callback);
                } else {
                    this.__board(6, 1, 2, 1.45, callback);
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

        setTurboMode(script) {
            this.__setModule();
            const mode = script.getField('MODE');
            if (mode == 'ON') this.__setTurbo(1);
            else this.__setTurbo(0);
            return script.callReturn();
        }

        isWheelMoving(script) {
            return this.wheelMoving || this.motioning || this.boarding;
        }

        isNeckMoving(script) {
            return this.neckMotioning;
        }

        playSound(script) {
            this.__setModule();
            this.__playSound(script.getField('SOUND'), 1);
            return script.callReturn();
        }

        playSoundTimes(script) {
            this.__setModule();
            this.__playSound(script.getField('SOUND'), script.getNumberValue('REPEAT'));
            return script.callReturn();
        }

        playSoundUntil(script) {
            this.__setModule();
            if (!script.isStart) {
                script.isStart = true;
                script.isMoving = true;
                const motoring = this.motoring;
                this.__finishNote();
                this.__finishSound();
                const sound = this.__SOUNDS[script.getField('SOUND')];
                let count = parseInt(script.getNumberValue('REPEAT'));
                // 음수는 __runSound 의 "끝없이 반복" 센티널이라 완료 분기가 콜백 대신 재무장한다.
                // 기다리는 블록이므로 영영 끝나지 않는다. 0 은 이미 0 과 -0.5 가 그러하듯 재생하지
                // 않고 정상 종료하는 값이다. 기다리지 않는 playSoundTimes 는 정지하지 않으므로
                // 공용 __playSound 는 건드리지 않는다.
                if (count < 0) count = 0;
                motoring.buzzer = 0;
                this.__setNote(0);
                if (sound && count) {
                    this.__runSound(sound, count);
                    // soundStateId 완료 분기는 콜백 조건이 없어 idle 패킷마다 재동기화되므로
                    // 보통은 어긋나지 않지만, stop 직후 패킷 없이 곧바로 재실행 첫 블록으로 들어오는
                    // 극단 케이스를 닫기 위해 wheel/neck와 동일하게 시작 시점 기준선을 캡처한다.
                    this.soundStateId = this.sensory.soundStateId;
                    this.soundCallback = () => {
                        script.isMoving = false;
                    };
                    this.__checkSoundPlaying();
                } else {
                    this.__runSound(0);
                    this.__checkSoundPlaying();
                    script.isMoving = false;
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

        changeBuzzer(script) {
            this.__setModule();
            const motoring = this.motoring;
            this.__finishNote();
            this.__finishSound();

            const hz = this.__finite(script.getNumberValue('HZ'));
            if (hz !== undefined) {
                const L = this.__LIMITS.buzzer;
                motoring.buzzer += hz;
                // __checkSoundPlaying 이 buzzer != 0 으로 재생 여부를 판단하므로 그 앞에서 제한한다.
                motoring.buzzer = this.__clamp('buzzer', motoring.buzzer, L.min, L.max, L.unit);
            }
            this.__setNote(0);
            this.__runSound(0);
            this.__checkSoundPlaying();
            return script.callReturn();
        }

        setBuzzer(script) {
            this.__setModule();
            const motoring = this.motoring;
            this.__finishNote();
            this.__finishSound();

            const hz = this.__finite(script.getNumberValue('HZ'));
            if (hz !== undefined) {
                const L = this.__LIMITS.buzzer;
                motoring.buzzer = hz;
                // __checkSoundPlaying 이 buzzer != 0 으로 재생 여부를 판단하므로 그 앞에서 제한한다.
                motoring.buzzer = this.__clamp('buzzer', motoring.buzzer, L.min, L.max, L.unit);
            }
            this.__setNote(0);
            this.__runSound(0);
            this.__checkSoundPlaying();
            return script.callReturn();
        }

        clearSound(script) {
            this.__setModule();
            this.__finishNote();
            this.__finishSound();
            this.motoring.buzzer = 0;
            this.__setNote(0);
            this.__runSound(0);
            this.__checkSoundPlaying();
            return script.callReturn();
        }

        playNote(script) {
            this.__setModule();
            const motoring = this.motoring;
            this.__finishNote();
            this.__finishSound();

            let note = this.__NOTES[script.getField('NOTE')];
            const octave = parseInt(script.getField('OCTAVE'));
            motoring.buzzer = 0;
            if (note && octave && octave > 0 && octave < 8) {
                note += (octave - 1) * 12;
                this.__setNote(note);
            } else {
                this.__setNote(0);
            }
            this.__runSound(0);
            this.__checkSoundPlaying();
            return script.callReturn();
        }

        playNoteBeat(script) {
            this.__setModule();
            const self = this;
            if (!script.isStart) {
                script.isStart = true;
                script.isMoving = true;
                const motoring = self.motoring;
                self.__finishNote();
                self.__finishSound();

                let note = self.__NOTES[script.getField('NOTE')];
                const octave = parseInt(script.getField('OCTAVE'));
                const beat = parseFloat(script.getNumberValue('BEAT'));
                const callback = () => {
                    self.noteCallback = undefined;
                    script.isMoving = false;
                };
                self.noteCallback = callback;
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
                    const id = self.__issueNoteId();
                    note += (octave - 1) * 12;
                    self.__setNote(note);
                    const timeout = self.__clampDelay((beat * 60 * 1000) / self.tempo);
                    const tail = timeout > 100 ? 100 : 0;
                    if (tail > 0) {
                        self.noteTimer1 = setTimeout(() => {
                            if (self.noteId == id) {
                                self.__setNote(0);
                                if (self.noteTimer1 !== undefined)
                                    self.__removeTimeout(self.noteTimer1);
                                self.noteTimer1 = undefined;
                            }
                        }, timeout - tail);
                        self.timeouts.push(self.noteTimer1);
                    }
                    self.noteTimer2 = setTimeout(() => {
                        if (self.noteId == id) {
                            self.__setNote(0);
                            self.__finishNote();
                            self.__checkSoundPlaying();
                        }
                    }, timeout);
                    self.timeouts.push(self.noteTimer2);
                    self.__runSound(0);
                    self.__checkSoundPlaying();
                } else {
                    self.__setNote(0);
                    self.__runSound(0);
                    self.__checkSoundPlaying();
                    callback();
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

        restBeat(script) {
            this.__setModule();
            const self = this;
            if (!script.isStart) {
                script.isStart = true;
                script.isMoving = true;
                const motoring = self.motoring;
                self.__finishNote();
                self.__finishSound();

                const beat = parseFloat(script.getNumberValue('BEAT'));
                const callback = () => {
                    self.noteCallback = undefined;
                    script.isMoving = false;
                };
                self.noteCallback = callback;
                motoring.buzzer = 0;
                self.__setNote(0);
                self.__runSound(0);
                if (beat && beat > 0 && self.tempo > 0) {
                    const id = self.__issueNoteId();
                    self.noteTimer1 = setTimeout(
                        () => {
                            if (self.noteId == id) {
                                self.__finishNote();
                                self.__checkSoundPlaying();
                            }
                        },
                        self.__clampDelay((beat * 60 * 1000) / self.tempo)
                    );
                    self.timeouts.push(self.noteTimer1);
                    self.__checkSoundPlaying();
                    self.resting = true;
                } else {
                    self.__checkSoundPlaying();
                    callback();
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

        changeTempo(script) {
            this.__setModule();
            const bpm = parseFloat(script.getNumberValue('BPM'));
            if (typeof bpm == 'number') {
                this.tempo += bpm;
                if (this.tempo < 1) this.tempo = 1;
            }
            return script.callReturn();
        }

        setTempo(script) {
            this.__setModule();
            const bpm = parseFloat(script.getNumberValue('BPM'));
            if (typeof bpm == 'number') {
                this.tempo = bpm;
                if (this.tempo < 1) this.tempo = 1;
            }
            return script.callReturn();
        }

        isSoundPlaying(script) {
            return this.sounding || this.buzzing || this.noting || this.resting;
        }

        getButton(script) {
            const index = this.__BUTTON_INDEX[script.getField('BUTTON')];
            if (typeof index == 'number') {
                return this.buttons[index];
            }
            return 0;
        }

        getSignalStrength(script) {
            return this.sensory.signalStrength;
        }

        checkButtonState(script) {
            const index = this.__BUTTON_INDEX[script.getField('BUTTON')];
            const state = script.getField('STATE');
            if (typeof index == 'number') {
                switch (state) {
                    case 'PRESSED':
                        return this.buttonCheckers[index].isPressed();
                    case 'RELEASED':
                        return this.buttonCheckers[index].isReleased();
                    case 'LONG_PRESSED':
                        return this.buttonCheckers[index].isLongPressed();
                    case 'CLICKED':
                        return this.buttonCheckers[index].isClicked();
                }
            }
            return false;
        }

        isButtonState(script) {
            const index = this.__BUTTON_INDEX[script.getField('BUTTON')];
            const state = script.getField('STATE');
            if (typeof index == 'number') {
                switch (state) {
                    case 'PRESSED':
                        return this.buttons[index] == 1;
                    case 'RELEASED':
                        return this.buttons[index] == 0;
                    case 'LONG_PRESSED':
                        return this.buttonCheckers[index].isLongPressed();
                    case 'CLICKED':
                        return this.buttonCheckers[index].isClicked();
                }
            }
            return false;
        }

        checkBatteryState(script) {
            return this.sensory.batteryState == this.__BATTERY_STATES[script.getField('BATTERY')];
        }

        isCharging(script) {
            return this.sensory.chargeState == 1;
        }

        // ---------------- 정지 경로 ----------------
        // 원본 정의 순서 유지. 본문 무수정 + 두 변형만 넣었다:
        //   1) 본문 앞에 대기 콜백 해소  2) 말미에 시리얼 송신 1줄
        // 햄스터 lite 의 sensory/motoring 리터럴 재대입은 이식하지 않는다.
        // 두 객체는 생성자에서만 만들어지고, 재대입하면 프레임 계층 상태가 지워진다.

        setZero() {
            // 상태를 비우기 전에 대기 중인 블록에 완료를 알린다. 비운 뒤에 부르면 콜백을
            // 찾을 수 없어 블록이 영원히 멈춘다. setZero 는 엔진 정지뿐 아니라 세션 중
            // 정체 전환과 onForeignRobot 에서도 불린다.
            // `noteCallback` 은 lite 전용이다. 원본은 음표와 쉼표의 대기 해제를 지역 클로저로만
            // 들고 있어 여기서 부를 수 없었고, 바로 아래 `__removeAllTimeouts()` 가 타이머만
            // 지워 블록이 영원히 대기로 남았다. 이 주석이 경고한 형태다.
            [
                'motionCallback',
                'boardCallback',
                'neckMotionCallback',
                'soundCallback',
                'noteCallback',
            ].forEach((k) => {
                const cb = this[k];
                this[k] = undefined;
                if (cb) cb();
            });
            this.limitWarned = {}; // 실행마다 안내를 다시 낼 수 있게
            // *Id 카운터는 세션 내 단조 증가로 보존한다(0 재시드 금지). entry-hw 모듈의 _prev_*Id는
            // 워크스페이스 소켓이 살아있는 한 유지되는데, 카운터를 0으로 되돌리면 다음 실행이 만드는
            // id가 이전 실행과 같은 값에 도달해 명령이 통째로 삼켜진다(정지 후 재실행 시 터보 무반응,
            // 이어지는 이동 블록이 완료 신호를 못 받아 무한 대기). 옛 재시드가 겸하던 정지
            // 부수효과(터보 해제, 펄스/모션/음/소리 정지, 목 중립 복귀)는 아래에서 명시적 id 증가
            // 명령으로 재현한다.
            const portMap = this.__PORT_MAP;
            const motoring = this.motoring;
            const idPorts = this.__ID_PORTS;
            for (const port in portMap) {
                if (idPorts.indexOf(port) >= 0 && motoring[port] !== undefined) {
                    continue; // 카운터 보존 (undefined면 아래 시드로 0 초기화)
                }
                motoring[port] = portMap[port];
            }
            // 정지 부수효과 재현 (각 id 증가 포함, entry-hw가 실제로 반영)
            this.__setTurbo(0); // 터보 기본값(off): 이전 실행의 터보 모드가 새 실행으로 누수되지 않게
            this.__setPulse(0);
            this.__setMotion(0, 0, 0, 0, 0);
            this.__setNeckSpeed(4); // 목 속도 기본값
            // 목 중립 복귀. 알려진 좁은 한계: 이 복귀 명령의 완료 신호가, 목 회전 블록을 쓰는
            // 프로그램을 목이 아직 복귀 중일 때 초고속 재시작하면 그 블록의 완료 기준선 캡처 직후
            // 도착해 조기 완료될 수 있다(사람 조작 간격에선 복귀가 먼저 끝나 발생 안 함).
            this.__setNeckAngle(0);
            this.__setNote(0); // 음 정지
            this.__setSound(0); // 소리 정지
            // 센서 카운터 시작값(0)에 맞춘다(-1 아님). 생성자 주석 참고.
            this.wheelStateId = 0;
            this.neckStateId = 0;
            this.soundStateId = 0;
            this.blockId = 0;
            this.wheelMoving = false;
            this.motionCallback = undefined;
            this.motioning = false;
            this.boardCommand = 0;
            this.boardState = 0;
            this.boardCallback = undefined;
            this.boarding = false;
            this.neckMotionCallback = undefined;
            this.neckMotioning = false;
            this.currentSound = 0;
            this.soundRepeat = 1;
            this.soundCallback = undefined;
            this.sounding = false;
            this.buzzing = false;
            this.noteId = 0;
            this.noteTimer1 = undefined;
            this.noteTimer2 = undefined;
            this.noting = false;
            this.resting = false;
            this.tempo = 60;
            for (let i = 0; i < 8; ++i) {
                this.buttons[i] = 0;
                this.buttonCheckers[i].reset();
            }
            this.__removeAllTimeouts();
            // 정지 프레임을 실제로 내보낸다. lite 에는 설치형의 IPC 홉이 없어
            // 이 호출이 없으면 정지 명령이 다음 틱까지 장치에 닿지 않는다.
            if (Entry.hwLite && Entry.hwLite.serial) {
                Entry.hwLite.serial.update();
            }
        }

        __removeAllTimeouts() {
            const timeouts = this.timeouts;
            for (const i in timeouts) {
                clearTimeout(timeouts[i]);
            }
            this.timeouts = [];
        }

        // ---------------- 블록 계층 ----------------
        // block_pio.js 의 setLanguage / getBlocks 원문. 헤더만 메서드로 바꾸고
        // 블록 이름에 piolite_ 접두를 붙였다.

        setLanguage() {
            return {
                ko: {
                    template: {
                        piolite_board_move: '말판 %1 한 칸 이동하기 %2',
                        piolite_board_turn: '말판 %1 으로 한 번 돌기 %2',
                        piolite_move_forward: '앞으로 이동하기 %1',
                        piolite_move_backward: '뒤로 이동하기 %1',
                        piolite_turn: '%1 으로 돌기 %2',
                        piolite_move_forward_unit: '앞으로 %1 %2 이동하기 %3',
                        piolite_move_backward_unit: '뒤로 %1 %2 이동하기 %3',
                        piolite_turn_unit_in_place: '%1 으로 %2 %3 제자리 돌기 %4',
                        piolite_pivot_unit: '%1 바퀴 중심으로 %2 %3 %4 방향으로 돌기 %5',
                        piolite_change_wheels: '왼쪽 바퀴 %1 오른쪽 바퀴 %2 만큼 바꾸기 %3',
                        piolite_set_wheels: '왼쪽 바퀴 %1 오른쪽 바퀴 %2 (으)로 정하기 %3',
                        piolite_change_wheel: '%1 바퀴 %2 만큼 바꾸기 %3',
                        piolite_set_wheel: '%1 바퀴 %2 (으)로 정하기 %3',
                        piolite_stop: '정지하기 %1',
                        piolite_turbo_mode: '터보 모드 %1 %2',
                        piolite_is_wheel_moving: '바퀴 움직이는 중인가?',
                        piolite_rotate_neck: '목을 %1 으로 %2 도 회전하기 %3',
                        piolite_set_neck_speed: '목 속도를 %1 (으)로 정하기 %2',
                        piolite_stop_neck: '목 정지하기 %1',
                        piolite_is_neck_moving: '목 움직이는 중인가?',
                        piolite_set_eye_color: '%1 눈을 %2 으로 정하기 %3',
                        piolite_set_eye_color_picker: '%1 눈을 %2 로 정하기 %3',
                        piolite_change_eye_rgb: '%1 눈을 R: %2 G: %3 B: %4 만큼 바꾸기 %5',
                        piolite_set_eye_rgb: '%1 눈을 R: %2 G: %3 B: %4 (으)로 정하기 %5',
                        piolite_clear_eye: '%1 눈 끄기 %2',
                        piolite_play_sound: '%1 소리 재생하기 %2',
                        piolite_play_sound_times: '%1 소리 %2 번 재생하기 %3',
                        piolite_play_sound_until: '%1 소리 %2 번 재생하고 기다리기 %3',
                        piolite_change_buzzer: '버저 음을 %1 만큼 바꾸기 %2',
                        piolite_set_buzzer: '버저 음을 %1 (으)로 정하기 %2',
                        piolite_clear_sound: '소리 끄기 %1',
                        piolite_play_note: '%1 %2 음을 연주하기 %3',
                        piolite_play_note_beat: '%1 %2 음을 %3 박자 연주하기 %4',
                        piolite_rest_beat: '%1 박자 쉬기 %2',
                        piolite_change_tempo: '연주 속도를 %1 만큼 바꾸기 %2',
                        piolite_set_tempo: '연주 속도를 %1 BPM으로 정하기 %2',
                        piolite_is_sound_playing: '소리 내는 중인가?',
                        piolite_button: '%1 버튼',
                        piolite_signal_strength: '신호 세기',
                        piolite_when_button_state: '%1 %2 버튼을 %3 때',
                        piolite_button_state: '%1 버튼을 %2?',
                        piolite_battery_state: '배터리 %1?',
                    },
                    Blocks: {
                        piolite_forward: '앞으로',
                        piolite_backward: '뒤로',
                        piolite_leftward: '왼쪽으로',
                        piolite_rightward: '오른쪽으로',
                        piolite_left: '왼쪽',
                        piolite_right: '오른쪽',
                        piolite_both: '양쪽',
                        piolite_toward_forward: '앞쪽',
                        piolite_toward_backward: '뒤쪽',
                        piolite_on: '켜기',
                        piolite_off: '끄기',
                        piolite_unit_cm: 'cm',
                        piolite_unit_degrees: '도',
                        piolite_unit_seconds: '초',
                        piolite_unit_pulses: '펄스',
                        piolite_color_red: '빨간색',
                        piolite_color_orange: '주황색',
                        piolite_color_yellow: '노란색',
                        piolite_color_green: '초록색',
                        piolite_color_sky_blue: '하늘색',
                        piolite_color_blue: '파란색',
                        piolite_color_violet: '보라색',
                        piolite_color_purple: '자주색',
                        piolite_color_white: '하얀색',
                        piolite_sound_beep: '삐',
                        piolite_sound_random_beep: '무작위 삐',
                        piolite_sound_noise: '지지직',
                        piolite_sound_siren: '사이렌',
                        piolite_sound_engine: '엔진',
                        piolite_sound_chop: '쩝',
                        piolite_sound_robot: '로봇',
                        piolite_sound_dibidibidip: '디비디비딥',
                        piolite_sound_good_job: '잘 했어요',
                        piolite_sound_random_melody: '무작위 멜로디',
                        piolite_sound_poo: '응가',
                        piolite_sound_happy: '행복',
                        piolite_sound_angry: '화남',
                        piolite_sound_sad: '슬픔',
                        piolite_sound_sleep: '졸림',
                        piolite_sound_march: '행진',
                        piolite_sound_birthday: '생일',
                        piolite_sound_bath: '목욕',
                        piolite_note_c: '도',
                        piolite_note_cs: '도♯ (레♭)',
                        piolite_note_d: '레',
                        piolite_note_ds: '레♯ (미♭)',
                        piolite_note_e: '미',
                        piolite_note_f: '파',
                        piolite_note_fs: '파♯ (솔♭)',
                        piolite_note_g: '솔',
                        piolite_note_gs: '솔♯ (라♭)',
                        piolite_note_a: '라',
                        piolite_note_as: '라♯ (시♭)',
                        piolite_note_b: '시',
                        piolite_button_move_forward: '앞으로 가기',
                        piolite_button_move_backward: '뒤로 가기',
                        piolite_button_move_left: '왼쪽으로 가기',
                        piolite_button_move_right: '오른쪽으로 가기',
                        piolite_button_run: '실행하기',
                        piolite_button_behavior: '행동하기',
                        piolite_button_repeat: '반복하기',
                        piolite_button_clear: '삭제하기',
                        piolite_state_pressed: '눌렀을',
                        piolite_state_released: '떼었을',
                        piolite_state_clicked: '클릭했을',
                        piolite_state_long_pressed: '오래 눌렀을',
                        piolite_bstate_pressed: '눌렀는가',
                        piolite_bstate_released: '떼었는가',
                        piolite_bstate_clicked: '클릭했는가',
                        piolite_bstate_long_pressed: '오래 눌렀는가',
                        piolite_battery_normal: '정상',
                        piolite_battery_middle: '중간',
                        piolite_battery_low: '부족',
                        piolite_battery_empty: '없음',
                        piolite_sensor_signal_strength: '신호 세기',
                        piolite_sensor_battery: '배터리',
                    },
                    Helper: {
                        piolite_board_move: '말판 위에서 앞/뒤/왼쪽/오른쪽으로 한 칸 이동합니다.',
                        piolite_board_turn:
                            '말판 위에서 왼쪽/오른쪽 방향으로 제자리에서 90도 회전합니다.',
                        piolite_move_forward: '앞으로 10cm 이동합니다.',
                        piolite_move_backward: '뒤로 10cm 이동합니다.',
                        piolite_turn: '왼쪽/오른쪽 방향으로 제자리에서 90도 회전합니다.',
                        piolite_move_forward_unit:
                            '입력한 거리(cm)/시간(초)/펄스만큼 앞으로 이동합니다.',
                        piolite_move_backward_unit:
                            '입력한 거리(cm)/시간(초)/펄스만큼 뒤로 이동합니다.',
                        piolite_turn_unit_in_place:
                            '입력한 각도(도)/시간(초)/펄스만큼 왼쪽/오른쪽으로 제자리에서 회전합니다.',
                        piolite_pivot_unit:
                            '왼쪽/오른쪽 바퀴를 중심으로 입력한 각도(도)/시간(초)/펄스만큼 앞쪽/뒤쪽 방향으로 회전합니다.',
                        piolite_change_wheels:
                            '왼쪽/오른쪽 바퀴의 현재 속도 값에 입력한 값을 각각 더합니다.',
                        piolite_set_wheels:
                            '왼쪽/오른쪽 바퀴의 속도를 입력한 값으로 각각 정합니다.',
                        piolite_change_wheel:
                            '왼쪽/오른쪽/양쪽 바퀴의 현재 속도 값에 입력한 값을 더합니다.',
                        piolite_set_wheel: '왼쪽/오른쪽/양쪽 바퀴의 속도를 입력한 값으로 정합니다.',
                        piolite_stop: '양쪽 바퀴를 정지합니다.',
                        piolite_turbo_mode: '터보 모드를 켜거나 끕니다.',
                        piolite_is_wheel_moving: '바퀴가 움직이고 있으면 참으로 판단합니다.',
                        piolite_rotate_neck: '목을 왼쪽/오른쪽으로 입력한 각도만큼 회전합니다.',
                        piolite_set_neck_speed: '목 회전 속도를 입력한 단계로 정합니다.',
                        piolite_stop_neck: '목을 정지합니다.',
                        piolite_is_neck_moving: '목이 움직이고 있으면 참으로 판단합니다.',
                        piolite_set_eye_color: '왼쪽/오른쪽/양쪽 눈의 색을 선택한 색으로 정합니다.',
                        piolite_set_eye_color_picker:
                            '왼쪽/오른쪽/양쪽 눈의 색을 색상판에서 고른 색으로 정합니다.',
                        piolite_change_eye_rgb:
                            '왼쪽/오른쪽/양쪽 눈의 R/G/B 값에 입력한 값을 각각 더합니다.',
                        piolite_set_eye_rgb:
                            '왼쪽/오른쪽/양쪽 눈의 R/G/B 값을 입력한 값으로 정합니다.',
                        piolite_clear_eye: '왼쪽/오른쪽/양쪽 눈을 끕니다.',
                        piolite_play_sound: '선택한 소리를 재생합니다.',
                        piolite_play_sound_times: '선택한 소리를 입력한 횟수만큼 재생합니다.',
                        piolite_play_sound_until:
                            '선택한 소리를 입력한 횟수만큼 재생하고, 끝날 때까지 기다립니다.',
                        piolite_change_buzzer: '버저 음(Hz)에 입력한 값을 더합니다.',
                        piolite_set_buzzer: '버저 음(Hz)을 입력한 값으로 정합니다.',
                        piolite_clear_sound: '재생 중인 소리와 버저를 끕니다.',
                        piolite_play_note: '선택한 음과 옥타브의 음을 연주합니다.',
                        piolite_play_note_beat:
                            '선택한 음과 옥타브의 음을 입력한 박자만큼 연주합니다.',
                        piolite_rest_beat: '입력한 박자만큼 쉽니다.',
                        piolite_change_tempo: '연주 속도(BPM)에 입력한 값을 더합니다.',
                        piolite_set_tempo: '연주 속도(BPM)를 입력한 값으로 정합니다.',
                        piolite_is_sound_playing: '소리나 음을 내고 있으면 참으로 판단합니다.',
                        piolite_button: '선택한 버튼의 상태 값(0 또는 1)입니다.',
                        piolite_signal_strength: '블루투스 무선 통신의 신호 세기입니다.',
                        piolite_when_button_state:
                            '선택한 버튼을 누름/뗌/클릭/길게 누름 했을 때 아래에 연결된 블록들을 실행합니다.',
                        piolite_button_state:
                            '선택한 버튼이 눌림/뗌/클릭/길게 누름 상태이면 참으로 판단합니다.',
                        piolite_battery_state: '배터리 잔량이 선택한 상태이면 참으로 판단합니다.',
                    },
                    Msgs: {
                        piolite_value_out_of_range_title: '삐오: 값이 범위를 벗어났습니다',
                        piolite_value_out_of_range:
                            '입력한 값이 사용할 수 있는 범위(%1)를 벗어나 %2(으)로 조정되었습니다.',
                        piolite_neck_angle_too_large_title: '삐오: 목을 그만큼 돌릴 수 없습니다',
                        piolite_neck_angle_too_large:
                            '입력한 각도가 너무 큽니다. 값을 줄여 주세요.',
                        piolite_delay_too_long_title: '삐오: 기다리는 시간이 너무 깁니다',
                        piolite_delay_too_long:
                            '입력한 값만큼 기다릴 수 없어 최대 시간으로 조정되었습니다. 값을 줄여 주세요.',
                        piolite_reject_title: '삐오가 아닙니다',
                        piolite_reject:
                            '이 항목은 삐오 전용입니다. 다른 로봇은 목록에서 해당 항목을 선택해 주세요. 다시 연결할 때 포트를 한 번 더 선택해야 합니다.',
                        piolite_foreign_robot_title: '다른 로봇이 연결되었습니다',
                        piolite_foreign_robot:
                            '삐오가 아닌 로봇이 연결되었습니다. 이 항목에서는 이 로봇을 제어할 수 없습니다. 연결을 끊고 삐오를 연결해 주세요.',
                    },
                },
                en: {
                    template: {
                        piolite_board_move: 'move %1 once on board %2',
                        piolite_board_turn: 'turn %1 once on board %2',
                        piolite_move_forward: 'move forward %1',
                        piolite_move_backward: 'move backward %1',
                        piolite_turn: 'turn %1 %2',
                        piolite_move_forward_unit: 'move forward %1 %2 %3',
                        piolite_move_backward_unit: 'move backward %1 %2 %3',
                        piolite_turn_unit_in_place: 'turn %1 %2 %3 in place %4',
                        piolite_pivot_unit: 'pivot around %1 wheel %2 %3 in %4 direction %5',
                        piolite_change_wheels: 'change wheels by left: %1 right: %2 %3',
                        piolite_set_wheels: 'set wheels to left: %1 right: %2 %3',
                        piolite_change_wheel: 'change %1 wheel by %2 %3',
                        piolite_set_wheel: 'set %1 wheel to %2 %3',
                        piolite_stop: 'stop %1',
                        piolite_turbo_mode: 'turn %1 turbo mode %2',
                        piolite_is_wheel_moving: 'wheel moving?',
                        piolite_rotate_neck: 'rotate neck to %1 %2 degrees %3',
                        piolite_set_neck_speed: 'set neck speed to %1 %2',
                        piolite_stop_neck: 'stop neck %1',
                        piolite_is_neck_moving: 'neck moving?',
                        piolite_set_eye_color: 'set %1 eye to %2 %3',
                        piolite_set_eye_color_picker: 'set %1 eye to %2 %3',
                        piolite_change_eye_rgb: 'change %1 eye by r: %2 g: %3 b: %4 %5',
                        piolite_set_eye_rgb: 'set %1 eye to r: %2 g: %3 b: %4 %5',
                        piolite_clear_eye: 'clear %1 eye %2',
                        piolite_play_sound: 'play sound %1 %2',
                        piolite_play_sound_times: 'play sound %1 %2 times %3',
                        piolite_play_sound_until: 'play sound %1 %2 times until done %3',
                        piolite_change_buzzer: 'change buzzer by %1 %2',
                        piolite_set_buzzer: 'set buzzer to %1 %2',
                        piolite_clear_sound: 'clear sound %1',
                        piolite_play_note: 'play note %1 %2 %3',
                        piolite_play_note_beat: 'play note %1 %2 for %3 beats %4',
                        piolite_rest_beat: 'rest for %1 beats %2',
                        piolite_change_tempo: 'change tempo by %1 %2',
                        piolite_set_tempo: 'set tempo to %1 bpm %2',
                        piolite_is_sound_playing: 'sound playing?',
                        piolite_button: '%1 button',
                        piolite_signal_strength: 'signal strength',
                        piolite_when_button_state: '%1 when %2 button %3',
                        piolite_button_state: '%1 button %2?',
                        piolite_battery_state: 'battery %1?',
                    },
                    Blocks: {
                        piolite_forward: 'forward',
                        piolite_backward: 'backward',
                        piolite_leftward: 'left',
                        piolite_rightward: 'right',
                        piolite_left: 'left',
                        piolite_right: 'right',
                        piolite_both: 'both',
                        piolite_toward_forward: 'forward',
                        piolite_toward_backward: 'backward',
                        piolite_on: 'on',
                        piolite_off: 'off',
                        piolite_unit_cm: 'cm',
                        piolite_unit_degrees: 'degrees',
                        piolite_unit_seconds: 'seconds',
                        piolite_unit_pulses: 'pulses',
                        piolite_color_red: 'red',
                        piolite_color_orange: 'orange',
                        piolite_color_yellow: 'yellow',
                        piolite_color_green: 'green',
                        piolite_color_sky_blue: 'sky blue',
                        piolite_color_blue: 'blue',
                        piolite_color_violet: 'violet',
                        piolite_color_purple: 'purple',
                        piolite_color_white: 'white',
                        piolite_sound_beep: 'beep',
                        piolite_sound_random_beep: 'random beep',
                        piolite_sound_noise: 'noise',
                        piolite_sound_siren: 'siren',
                        piolite_sound_engine: 'engine',
                        piolite_sound_chop: 'chop',
                        piolite_sound_robot: 'robot',
                        piolite_sound_dibidibidip: 'dibidibidip',
                        piolite_sound_good_job: 'good job',
                        piolite_sound_random_melody: 'random melody',
                        piolite_sound_poo: 'poo',
                        piolite_sound_happy: 'happy',
                        piolite_sound_angry: 'angry',
                        piolite_sound_sad: 'sad',
                        piolite_sound_sleep: 'sleep',
                        piolite_sound_march: 'march',
                        piolite_sound_birthday: 'birthday',
                        piolite_sound_bath: 'bath',
                        piolite_note_c: 'C',
                        piolite_note_cs: 'C♯ (D♭)',
                        piolite_note_d: 'D',
                        piolite_note_ds: 'D♯ (E♭)',
                        piolite_note_e: 'E',
                        piolite_note_f: 'F',
                        piolite_note_fs: 'F♯ (G♭)',
                        piolite_note_g: 'G',
                        piolite_note_gs: 'G♯ (A♭)',
                        piolite_note_a: 'A',
                        piolite_note_as: 'A♯ (B♭)',
                        piolite_note_b: 'B',
                        piolite_button_move_forward: 'move forward',
                        piolite_button_move_backward: 'move backward',
                        piolite_button_move_left: 'move left',
                        piolite_button_move_right: 'move right',
                        piolite_button_run: 'run',
                        piolite_button_behavior: 'behavior',
                        piolite_button_repeat: 'repeat',
                        piolite_button_clear: 'clear',
                        piolite_state_pressed: 'pressed',
                        piolite_state_released: 'released',
                        piolite_state_clicked: 'clicked',
                        piolite_state_long_pressed: 'long-pressed',
                        piolite_bstate_pressed: 'pressed',
                        piolite_bstate_released: 'released',
                        piolite_bstate_clicked: 'clicked',
                        piolite_bstate_long_pressed: 'long-pressed',
                        piolite_battery_normal: 'normal',
                        piolite_battery_middle: 'middle',
                        piolite_battery_low: 'low',
                        piolite_battery_empty: 'empty',
                        piolite_sensor_signal_strength: 'signal strength',
                        piolite_sensor_battery: 'battery',
                    },
                    Helper: {
                        piolite_board_move:
                            'Moves one space forward/backward/left/right on the board.',
                        piolite_board_turn: 'Turns left/right 90 degrees in place on the board.',
                        piolite_move_forward: 'Moves forward 10 cm.',
                        piolite_move_backward: 'Moves backward 10 cm.',
                        piolite_turn: 'Turns left/right 90 degrees in place.',
                        piolite_move_forward_unit:
                            'Moves forward for the number of cm/seconds/pulses entered.',
                        piolite_move_backward_unit:
                            'Moves backward for the number of cm/seconds/pulses entered.',
                        piolite_turn_unit_in_place:
                            'Turns left/right in place for the number of degrees/seconds/pulses entered.',
                        piolite_pivot_unit:
                            'Pivots around the left/right wheel in the forward/backward direction for the number of degrees/seconds/pulses entered.',
                        piolite_change_wheels:
                            'Adds the entered values to the current speed values of the left and right wheels respectively.',
                        piolite_set_wheels:
                            'Sets the speed of the left and right wheels to the entered values respectively.',
                        piolite_change_wheel:
                            'Adds the entered value to the current speed value of the left/right/both wheels.',
                        piolite_set_wheel:
                            'Sets the speed of the left/right/both wheels to the entered value.',
                        piolite_stop: 'Stops both wheels.',
                        piolite_turbo_mode: 'Turns turbo mode on or off.',
                        piolite_is_wheel_moving: 'If the wheels are moving, true, otherwise false',
                        piolite_rotate_neck: 'Rotates the neck left/right by the entered angle.',
                        piolite_set_neck_speed:
                            'Sets the neck rotation speed to the entered level.',
                        piolite_stop_neck: 'Stops the neck.',
                        piolite_is_neck_moving: 'If the neck is moving, true, otherwise false',
                        piolite_set_eye_color:
                            'Turns the left/right/both eyes to the selected color.',
                        piolite_set_eye_color_picker:
                            'Turns the left/right/both eyes to the color chosen from the color palette.',
                        piolite_change_eye_rgb:
                            'Adds the entered values to the R/G/B values of the left/right/both eyes respectively.',
                        piolite_set_eye_rgb:
                            'Sets the R/G/B values of the left/right/both eyes to the entered values.',
                        piolite_clear_eye: 'Turns off the left/right/both eyes.',
                        piolite_play_sound: 'Plays the selected sound.',
                        piolite_play_sound_times:
                            'Plays the selected sound as many times as entered.',
                        piolite_play_sound_until:
                            'Plays the selected sound as many times as entered, and waits for completion.',
                        piolite_change_buzzer:
                            'Adds the entered value to the current pitch (Hz) of the buzzer sound.',
                        piolite_set_buzzer:
                            'Sets the pitch of the buzzer sound to the entered value (Hz).',
                        piolite_clear_sound: 'Turns off the playing sound and the buzzer.',
                        piolite_play_note: 'It sounds the selected tone and octave.',
                        piolite_play_note_beat:
                            'It sounds the selected tone and octave as much as the beat you entered.',
                        piolite_rest_beat: 'Rests as much as the beat you entered.',
                        piolite_change_tempo:
                            'Adds the entered value to the current BPM (beats per minute) of the playing speed.',
                        piolite_set_tempo:
                            'Sets the playing speed to the entered BPM (beats per minute).',
                        piolite_is_sound_playing:
                            'If a sound or note is playing, true, otherwise false',
                        piolite_button: 'The state value (0 or 1) of the selected button.',
                        piolite_signal_strength:
                            'The signal strength of the Bluetooth wireless communication.',
                        piolite_when_button_state:
                            'When the selected button is pressed/released/clicked/long-pressed, runs the blocks connected below.',
                        piolite_button_state:
                            'If the selected button is in the pressed/released/clicked/long-pressed state, true, otherwise false',
                        piolite_battery_state:
                            'If the battery level is in the selected state, true, otherwise false',
                    },
                    Msgs: {
                        piolite_value_out_of_range_title: 'Pio: value out of range',
                        piolite_value_out_of_range:
                            'The value you entered is outside the available range (%1), so it was adjusted to %2.',
                        piolite_neck_angle_too_large_title: 'Pio: the neck cannot turn that far',
                        piolite_neck_angle_too_large:
                            'The angle you entered is too large. Try a smaller value.',
                        piolite_delay_too_long_title: 'Pio: the wait is too long',
                        piolite_delay_too_long:
                            'The wait you asked for is longer than possible, so it was shortened. Try a smaller value.',
                        piolite_reject_title: 'Not a Pio',
                        piolite_reject:
                            'This entry is for Pio only. For other robots, choose the matching entry from the list. You will need to pick the port again when reconnecting.',
                        piolite_foreign_robot_title: 'A different robot is connected',
                        piolite_foreign_robot:
                            'A robot other than Pio is connected. This entry cannot control it. Disconnect and connect a Pio.',
                    },
                },
                jp: {
                    template: {
                        piolite_board_move: 'ボード板上で %1 移動する %2',
                        piolite_board_turn: 'ボード板上で %1 へ回る %2',
                        piolite_move_forward: '前へ移動する %1',
                        piolite_move_backward: '後ろへ移動する %1',
                        piolite_turn: '%1 へ回る %2',
                        piolite_move_forward_unit: '前へ %1 %2 移動する %3',
                        piolite_move_backward_unit: '後ろへ %1 %2 移動する %3',
                        piolite_turn_unit_in_place: '%1 へ %2 %3 その場所で回る %4',
                        piolite_pivot_unit: '%1 車輪を中心に %2 %3 %4 方向へ回る %5',
                        piolite_change_wheels: '左車輪を %1 右車輪を %2 ずつ変える %3',
                        piolite_set_wheels: '左車輪を %1 右車輪を %2 にする %3',
                        piolite_change_wheel: '%1 車輪を %2 ずつ変える %3',
                        piolite_set_wheel: '%1 車輪を %2 にする %3',
                        piolite_stop: '停止する %1',
                        piolite_turbo_mode: 'ターボモードを %1 %2',
                        piolite_is_wheel_moving: '車輪を動かしているか?',
                        piolite_rotate_neck: '首を %1 へ %2 度回る %3',
                        piolite_set_neck_speed: '首の速さを %1 にする %2',
                        piolite_stop_neck: '首を停止する %1',
                        piolite_is_neck_moving: '首を動かしているか?',
                        piolite_set_eye_color: '%1 眼を %2 にする %3',
                        piolite_set_eye_color_picker: '%1 眼を %2 にする %3',
                        piolite_change_eye_rgb: '%1 眼をR: %2 G: %3 B: %4 ずつ変える %5',
                        piolite_set_eye_rgb: '%1 眼をR: %2 G: %3 B: %4 にする %5',
                        piolite_clear_eye: '%1 眼をオフにする %2',
                        piolite_play_sound: '%1 音を再生する %2',
                        piolite_play_sound_times: '%1 音を %2 回再生する %3',
                        piolite_play_sound_until: '%1 音を %2 回再生して待つ %3',
                        piolite_change_buzzer: 'ブザー音を %1 ずつ変える %2',
                        piolite_set_buzzer: 'ブザー音を %1 にする %2',
                        piolite_clear_sound: '音をオフにする %1',
                        piolite_play_note: '%1 %2 音を奏でる %3',
                        piolite_play_note_beat: '%1 %2 音を %3 拍子奏でる %4',
                        piolite_rest_beat: '%1 拍子止める %2',
                        piolite_change_tempo: '演奏の速さを %1 ずつ変える %2',
                        piolite_set_tempo: '演奏の速さを %1 BPMにする %2',
                        piolite_is_sound_playing: '音を出しているか?',
                        piolite_button: '%1 ボタン',
                        piolite_signal_strength: '信号強度',
                        piolite_when_button_state: '%1 %2 ボタンを %3 とき',
                        piolite_button_state: '%1 ボタンを %2?',
                        piolite_battery_state: '電池充電が %1?',
                    },
                    Blocks: {
                        piolite_forward: '前へ',
                        piolite_backward: '後ろへ',
                        piolite_leftward: '左へ',
                        piolite_rightward: '右へ',
                        piolite_left: '左',
                        piolite_right: '右',
                        piolite_both: '両方',
                        piolite_toward_forward: '前',
                        piolite_toward_backward: '後',
                        piolite_on: 'オン',
                        piolite_off: 'オフ',
                        piolite_unit_cm: 'cm',
                        piolite_unit_degrees: '度',
                        piolite_unit_seconds: '秒',
                        piolite_unit_pulses: 'パルス',
                        piolite_color_red: '赤色',
                        piolite_color_orange: '橙色',
                        piolite_color_yellow: '黄色',
                        piolite_color_green: '緑色',
                        piolite_color_sky_blue: '水色',
                        piolite_color_blue: '青色',
                        piolite_color_violet: '青紫色',
                        piolite_color_purple: '紫色',
                        piolite_color_white: '白色',
                        piolite_sound_beep: 'ビープ',
                        piolite_sound_random_beep: 'ランダムビープ',
                        piolite_sound_noise: 'ノイズ',
                        piolite_sound_siren: 'サイレン',
                        piolite_sound_engine: 'エンジン',
                        piolite_sound_chop: 'チョップ',
                        piolite_sound_robot: 'ロボット',
                        piolite_sound_dibidibidip: 'ディバディバディップ',
                        piolite_sound_good_job: 'よくできました',
                        piolite_sound_random_melody: 'ランダムメロディ',
                        piolite_sound_poo: 'うんこ',
                        piolite_sound_happy: '幸せ',
                        piolite_sound_angry: '怒り',
                        piolite_sound_sad: '悲しみ',
                        piolite_sound_sleep: '眠い',
                        piolite_sound_march: '行進',
                        piolite_sound_birthday: '誕生日',
                        piolite_sound_bath: 'お風呂',
                        piolite_note_c: 'ド',
                        piolite_note_cs: 'ド♯ (レ♭)',
                        piolite_note_d: 'レ',
                        piolite_note_ds: 'レ♯ (ミ♭)',
                        piolite_note_e: 'ミ',
                        piolite_note_f: 'ファ',
                        piolite_note_fs: 'ファ♯ (ソ♭)',
                        piolite_note_g: 'ソ',
                        piolite_note_gs: 'ソ♯ (ラ♭)',
                        piolite_note_a: 'ラ',
                        piolite_note_as: 'ラ♯ (シ♭)',
                        piolite_note_b: 'シ',
                        piolite_button_move_forward: '前へ移動',
                        piolite_button_move_backward: '後ろへ移動',
                        piolite_button_move_left: '左へ移動',
                        piolite_button_move_right: '右へ移動',
                        piolite_button_run: '実行',
                        piolite_button_behavior: '行動',
                        piolite_button_repeat: '繰り返し',
                        piolite_button_clear: '削除',
                        piolite_state_pressed: '押した',
                        piolite_state_released: '離した',
                        piolite_state_clicked: 'クリックした',
                        piolite_state_long_pressed: '長く押した',
                        piolite_bstate_pressed: '押したか',
                        piolite_bstate_released: '離したか',
                        piolite_bstate_clicked: 'クリックしたか',
                        piolite_bstate_long_pressed: '長く押したか',
                        piolite_battery_normal: '正常か',
                        piolite_battery_middle: '中間か',
                        piolite_battery_low: '不足しているか',
                        piolite_battery_empty: 'なくなったか',
                        piolite_sensor_signal_strength: '信号強度',
                        piolite_sensor_battery: '電池',
                    },
                    Msgs: {
                        piolite_value_out_of_range_title: 'ピオ: 値が範囲外です',
                        piolite_value_out_of_range:
                            '入力した値が使える範囲(%1)外のため、%2 に調整されました。',
                        piolite_neck_angle_too_large_title: 'ピオ: 首はそこまで回せません',
                        piolite_neck_angle_too_large:
                            '入力した角度が大きすぎます。値を小さくしてください。',
                        piolite_delay_too_long_title: 'ピオ: 待ち時間が長すぎます',
                        piolite_delay_too_long:
                            '入力した分だけ待てないため、最大時間に調整されました。値を小さくしてください。',
                        piolite_reject_title: 'ピオではありません',
                        piolite_reject:
                            'この項目はピオ専用です。ほかのロボットは一覧から該当する項目を選んでください。再接続の際はポートをもう一度選択する必要があります。',
                        piolite_foreign_robot_title: '別のロボットが接続されました',
                        piolite_foreign_robot:
                            'ピオ以外のロボットが接続されています。この項目ではこのロボットを制御できません。接続を切ってピオを接続してください。',
                    },
                },
                vn: {
                    template: {
                        piolite_board_move: 'move %1 once on board %2',
                        piolite_board_turn: 'turn %1 once on board %2',
                        piolite_move_forward: 'move forward %1',
                        piolite_move_backward: 'move backward %1',
                        piolite_turn: 'turn %1 %2',
                        piolite_move_forward_unit: 'move forward %1 %2 %3',
                        piolite_move_backward_unit: 'move backward %1 %2 %3',
                        piolite_turn_unit_in_place: 'turn %1 %2 %3 in place %4',
                        piolite_pivot_unit: 'pivot around %1 wheel %2 %3 in %4 direction %5',
                        piolite_change_wheels: 'change wheels by left: %1 right: %2 %3',
                        piolite_set_wheels: 'set wheels to left: %1 right: %2 %3',
                        piolite_change_wheel: 'change %1 wheel by %2 %3',
                        piolite_set_wheel: 'set %1 wheel to %2 %3',
                        piolite_stop: 'stop %1',
                        piolite_turbo_mode: 'turn %1 turbo mode %2',
                        piolite_is_wheel_moving: 'wheel moving?',
                        piolite_rotate_neck: 'rotate neck to %1 %2 degrees %3',
                        piolite_set_neck_speed: 'set neck speed to %1 %2',
                        piolite_stop_neck: 'stop neck %1',
                        piolite_is_neck_moving: 'neck moving?',
                        piolite_set_eye_color: 'set %1 eye to %2 %3',
                        piolite_set_eye_color_picker: 'set %1 eye to %2 %3',
                        piolite_change_eye_rgb: 'change %1 eye by r: %2 g: %3 b: %4 %5',
                        piolite_set_eye_rgb: 'set %1 eye to r: %2 g: %3 b: %4 %5',
                        piolite_clear_eye: 'clear %1 eye %2',
                        piolite_play_sound: 'play sound %1 %2',
                        piolite_play_sound_times: 'play sound %1 %2 times %3',
                        piolite_play_sound_until: 'play sound %1 %2 times until done %3',
                        piolite_change_buzzer: 'change buzzer by %1 %2',
                        piolite_set_buzzer: 'set buzzer to %1 %2',
                        piolite_clear_sound: 'clear sound %1',
                        piolite_play_note: 'play note %1 %2 %3',
                        piolite_play_note_beat: 'play note %1 %2 for %3 beats %4',
                        piolite_rest_beat: 'rest for %1 beats %2',
                        piolite_change_tempo: 'change tempo by %1 %2',
                        piolite_set_tempo: 'set tempo to %1 bpm %2',
                        piolite_is_sound_playing: 'sound playing?',
                        piolite_button: '%1 button',
                        piolite_signal_strength: 'signal strength',
                        piolite_when_button_state: '%1 when %2 button %3',
                        piolite_button_state: '%1 button %2?',
                        piolite_battery_state: 'battery %1?',
                    },
                    Blocks: {
                        piolite_forward: 'forward',
                        piolite_backward: 'backward',
                        piolite_leftward: 'left',
                        piolite_rightward: 'right',
                        piolite_left: 'left',
                        piolite_right: 'right',
                        piolite_both: 'both',
                        piolite_toward_forward: 'forward',
                        piolite_toward_backward: 'backward',
                        piolite_on: 'on',
                        piolite_off: 'off',
                        piolite_unit_cm: 'cm',
                        piolite_unit_degrees: 'degrees',
                        piolite_unit_seconds: 'seconds',
                        piolite_unit_pulses: 'pulses',
                        piolite_color_red: 'red',
                        piolite_color_orange: 'orange',
                        piolite_color_yellow: 'yellow',
                        piolite_color_green: 'green',
                        piolite_color_sky_blue: 'sky blue',
                        piolite_color_blue: 'blue',
                        piolite_color_violet: 'violet',
                        piolite_color_purple: 'purple',
                        piolite_color_white: 'white',
                        piolite_sound_beep: 'beep',
                        piolite_sound_random_beep: 'random beep',
                        piolite_sound_noise: 'noise',
                        piolite_sound_siren: 'siren',
                        piolite_sound_engine: 'engine',
                        piolite_sound_chop: 'chop',
                        piolite_sound_robot: 'robot',
                        piolite_sound_dibidibidip: 'dibidibidip',
                        piolite_sound_good_job: 'good job',
                        piolite_sound_random_melody: 'random melody',
                        piolite_sound_poo: 'poo',
                        piolite_sound_happy: 'happy',
                        piolite_sound_angry: 'angry',
                        piolite_sound_sad: 'sad',
                        piolite_sound_sleep: 'sleep',
                        piolite_sound_march: 'march',
                        piolite_sound_birthday: 'birthday',
                        piolite_sound_bath: 'bath',
                        piolite_note_c: 'C',
                        piolite_note_cs: 'C♯ (D♭)',
                        piolite_note_d: 'D',
                        piolite_note_ds: 'D♯ (E♭)',
                        piolite_note_e: 'E',
                        piolite_note_f: 'F',
                        piolite_note_fs: 'F♯ (G♭)',
                        piolite_note_g: 'G',
                        piolite_note_gs: 'G♯ (A♭)',
                        piolite_note_a: 'A',
                        piolite_note_as: 'A♯ (B♭)',
                        piolite_note_b: 'B',
                        piolite_button_move_forward: 'move forward',
                        piolite_button_move_backward: 'move backward',
                        piolite_button_move_left: 'move left',
                        piolite_button_move_right: 'move right',
                        piolite_button_run: 'run',
                        piolite_button_behavior: 'behavior',
                        piolite_button_repeat: 'repeat',
                        piolite_button_clear: 'clear',
                        piolite_state_pressed: 'pressed',
                        piolite_state_released: 'released',
                        piolite_state_clicked: 'clicked',
                        piolite_state_long_pressed: 'long-pressed',
                        piolite_bstate_pressed: 'pressed',
                        piolite_bstate_released: 'released',
                        piolite_bstate_clicked: 'clicked',
                        piolite_bstate_long_pressed: 'long-pressed',
                        piolite_battery_normal: 'normal',
                        piolite_battery_middle: 'middle',
                        piolite_battery_low: 'low',
                        piolite_battery_empty: 'empty',
                        piolite_sensor_signal_strength: 'signal strength',
                        piolite_sensor_battery: 'battery',
                    },
                    Msgs: {
                        piolite_value_out_of_range_title: 'Pio: giá trị ngoài phạm vi',
                        piolite_value_out_of_range:
                            'Giá trị bạn nhập nằm ngoài phạm vi sử dụng được (%1) nên đã được điều chỉnh thành %2.',
                        piolite_neck_angle_too_large_title: 'Pio: cổ không thể quay xa như vậy',
                        piolite_neck_angle_too_large:
                            'Góc bạn nhập quá lớn. Hãy thử giá trị nhỏ hơn.',
                        piolite_delay_too_long_title: 'Pio: thời gian chờ quá dài',
                        piolite_delay_too_long:
                            'Không thể chờ lâu như vậy nên đã rút ngắn về mức tối đa. Hãy thử giá trị nhỏ hơn.',
                        piolite_reject_title: 'Đây không phải Pio',
                        piolite_reject:
                            'Mục này chỉ dành cho Pio. Với robot khác, hãy chọn mục tương ứng trong danh sách. Khi kết nối lại, bạn cần chọn cổng một lần nữa.',
                        piolite_foreign_robot_title: 'Đã kết nối một robot khác',
                        piolite_foreign_robot:
                            'Một robot không phải Pio đang được kết nối. Mục này không thể điều khiển nó. Hãy ngắt kết nối và kết nối Pio.',
                    },
                },
            };
        }

        getBlocks() {
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
                img: 'block_icon/hardwarelite_icon.svg',
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

            const OPT_FWD_BWD_L_R = [
                [Lang.Blocks.piolite_forward, 'FORWARD'],
                [Lang.Blocks.piolite_backward, 'BACKWARD'],
                [Lang.Blocks.piolite_leftward, 'LEFT'],
                [Lang.Blocks.piolite_rightward, 'RIGHT'],
            ];
            const OPT_LEFT_RIGHT = [
                [Lang.Blocks.piolite_left, 'LEFT'],
                [Lang.Blocks.piolite_right, 'RIGHT'],
            ];
            const OPT_LEFT_RIGHT_BOTH = [
                [Lang.Blocks.piolite_left, 'LEFT'],
                [Lang.Blocks.piolite_right, 'RIGHT'],
                [Lang.Blocks.piolite_both, 'BOTH'],
            ];
            const OPT_TOWARD = [
                [Lang.Blocks.piolite_toward_forward, 'FORWARD'],
                [Lang.Blocks.piolite_toward_backward, 'BACKWARD'],
            ];
            const OPT_ON_OFF = [
                [Lang.Blocks.piolite_on, 'ON'],
                [Lang.Blocks.piolite_off, 'OFF'],
            ];
            const OPT_MOVE_UNIT = [
                [Lang.Blocks.piolite_unit_cm, 'CM'],
                [Lang.Blocks.piolite_unit_seconds, 'SECONDS'],
                [Lang.Blocks.piolite_unit_pulses, 'PULSES'],
            ];
            const OPT_TURN_UNIT = [
                [Lang.Blocks.piolite_unit_degrees, 'DEGREES'],
                [Lang.Blocks.piolite_unit_seconds, 'SECONDS'],
                [Lang.Blocks.piolite_unit_pulses, 'PULSES'],
            ];
            const OPT_NECK_SPEED = [
                ['1', '1'],
                ['2', '2'],
                ['3', '3'],
                ['4', '4'],
                ['5', '5'],
                ['6', '6'],
            ];
            const OPT_COLOR = [
                [Lang.Blocks.piolite_color_red, 'RED'],
                [Lang.Blocks.piolite_color_orange, 'ORANGE'],
                [Lang.Blocks.piolite_color_yellow, 'YELLOW'],
                [Lang.Blocks.piolite_color_green, 'GREEN'],
                [Lang.Blocks.piolite_color_sky_blue, 'SKY_BLUE'],
                [Lang.Blocks.piolite_color_blue, 'BLUE'],
                [Lang.Blocks.piolite_color_violet, 'VIOLET'],
                [Lang.Blocks.piolite_color_purple, 'PURPLE'],
                [Lang.Blocks.piolite_color_white, 'WHITE'],
            ];
            const OPT_SOUND = [
                [Lang.Blocks.piolite_sound_beep, 'BEEP'],
                [Lang.Blocks.piolite_sound_random_beep, 'RANDOM_BEEP'],
                [Lang.Blocks.piolite_sound_noise, 'NOISE'],
                [Lang.Blocks.piolite_sound_siren, 'SIREN'],
                [Lang.Blocks.piolite_sound_engine, 'ENGINE'],
                [Lang.Blocks.piolite_sound_chop, 'CHOP'],
                [Lang.Blocks.piolite_sound_robot, 'ROBOT'],
                [Lang.Blocks.piolite_sound_dibidibidip, 'DIBIDIBIDIP'],
                [Lang.Blocks.piolite_sound_good_job, 'GOOD_JOB'],
                [Lang.Blocks.piolite_sound_random_melody, 'RANDOM_MELODY'],
                [Lang.Blocks.piolite_sound_poo, 'POO'],
                [Lang.Blocks.piolite_sound_happy, 'HAPPY'],
                [Lang.Blocks.piolite_sound_angry, 'ANGRY'],
                [Lang.Blocks.piolite_sound_sad, 'SAD'],
                [Lang.Blocks.piolite_sound_sleep, 'SLEEP'],
                [Lang.Blocks.piolite_sound_march, 'MARCH'],
                [Lang.Blocks.piolite_sound_birthday, 'BIRTHDAY'],
                [Lang.Blocks.piolite_sound_bath, 'BATH'],
            ];
            const OPT_NOTE = [
                [Lang.Blocks.piolite_note_c, 'C'],
                [Lang.Blocks.piolite_note_cs, 'CS'],
                [Lang.Blocks.piolite_note_d, 'D'],
                [Lang.Blocks.piolite_note_ds, 'DS'],
                [Lang.Blocks.piolite_note_e, 'E'],
                [Lang.Blocks.piolite_note_f, 'F'],
                [Lang.Blocks.piolite_note_fs, 'FS'],
                [Lang.Blocks.piolite_note_g, 'G'],
                [Lang.Blocks.piolite_note_gs, 'GS'],
                [Lang.Blocks.piolite_note_a, 'A'],
                [Lang.Blocks.piolite_note_as, 'AS'],
                [Lang.Blocks.piolite_note_b, 'B'],
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
                [Lang.Blocks.piolite_button_move_forward, 'MOVE_FORWARD'],
                [Lang.Blocks.piolite_button_move_backward, 'MOVE_BACKWARD'],
                [Lang.Blocks.piolite_button_move_left, 'MOVE_LEFT'],
                [Lang.Blocks.piolite_button_move_right, 'MOVE_RIGHT'],
                [Lang.Blocks.piolite_button_run, 'RUN'],
                [Lang.Blocks.piolite_button_behavior, 'BEHAVIOR'],
                [Lang.Blocks.piolite_button_repeat, 'REPEAT'],
                [Lang.Blocks.piolite_button_clear, 'CLEAR'],
            ];
            const OPT_WHEN_STATE = [
                [Lang.Blocks.piolite_state_pressed, 'PRESSED'],
                [Lang.Blocks.piolite_state_released, 'RELEASED'],
                [Lang.Blocks.piolite_state_clicked, 'CLICKED'],
                [Lang.Blocks.piolite_state_long_pressed, 'LONG_PRESSED'],
            ];
            const OPT_BUTTON_STATE = [
                [Lang.Blocks.piolite_bstate_pressed, 'PRESSED'],
                [Lang.Blocks.piolite_bstate_released, 'RELEASED'],
                [Lang.Blocks.piolite_bstate_clicked, 'CLICKED'],
                [Lang.Blocks.piolite_bstate_long_pressed, 'LONG_PRESSED'],
            ];
            const OPT_BATTERY = [
                [Lang.Blocks.piolite_battery_normal, 'NORMAL'],
                [Lang.Blocks.piolite_battery_middle, 'MIDDLE'],
                [Lang.Blocks.piolite_battery_low, 'LOW'],
                [Lang.Blocks.piolite_battery_empty, 'EMPTY'],
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
                isNotFor: ['PioLite'],
                func(sprite, script) {
                    return Entry.PioLite[method](script);
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
                isNotFor: ['PioLite'],
                func(sprite, script) {
                    return Entry.PioLite[method](script);
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
                isNotFor: ['PioLite'],
                func(sprite, script) {
                    return Entry.PioLite[method](script);
                },
            });

            return {
                // -------- motion --------
                piolite_board_move: command(
                    'piolite_board_move',
                    [dropdown(OPT_FWD_BWD_L_R, 'FORWARD'), indicator()],
                    [null, null],
                    { DIRECTION: 0 },
                    'piolite_board',
                    'boardMove'
                ),
                piolite_board_turn: command(
                    'piolite_board_turn',
                    [dropdown(OPT_LEFT_RIGHT, 'LEFT'), indicator()],
                    [null, null],
                    { DIRECTION: 0 },
                    'piolite_board',
                    'boardTurn'
                ),
                piolite_move_forward: command(
                    'piolite_move_forward',
                    [indicator()],
                    [null],
                    {},
                    'piolite_wheel',
                    'moveForward'
                ),
                piolite_move_backward: command(
                    'piolite_move_backward',
                    [indicator()],
                    [null],
                    {},
                    'piolite_wheel',
                    'moveBackward'
                ),
                piolite_turn: command(
                    'piolite_turn',
                    [dropdown(OPT_LEFT_RIGHT, 'LEFT'), indicator()],
                    [null, null],
                    { DIRECTION: 0 },
                    'piolite_wheel',
                    'turn'
                ),
                piolite_move_forward_unit: command(
                    'piolite_move_forward_unit',
                    [numberInput(), dropdown(OPT_MOVE_UNIT, 'CM'), indicator()],
                    [text('10'), null, null],
                    { VALUE: 0, UNIT: 1 },
                    'piolite_wheel',
                    'moveForwardUnit'
                ),
                piolite_move_backward_unit: command(
                    'piolite_move_backward_unit',
                    [numberInput(), dropdown(OPT_MOVE_UNIT, 'CM'), indicator()],
                    [text('10'), null, null],
                    { VALUE: 0, UNIT: 1 },
                    'piolite_wheel',
                    'moveBackwardUnit'
                ),
                piolite_turn_unit_in_place: command(
                    'piolite_turn_unit_in_place',
                    [
                        dropdown(OPT_LEFT_RIGHT, 'LEFT'),
                        numberInput(),
                        dropdown(OPT_TURN_UNIT, 'DEGREES'),
                        indicator(),
                    ],
                    [null, text('90'), null, null],
                    { DIRECTION: 0, VALUE: 1, UNIT: 2 },
                    'piolite_wheel',
                    'turnUnit'
                ),
                piolite_pivot_unit: command(
                    'piolite_pivot_unit',
                    [
                        dropdown(OPT_LEFT_RIGHT, 'LEFT'),
                        numberInput(),
                        dropdown(OPT_TURN_UNIT, 'DEGREES'),
                        dropdown(OPT_TOWARD, 'FORWARD'),
                        indicator(),
                    ],
                    [null, text('90'), null, null, null],
                    { WHEEL: 0, VALUE: 1, UNIT: 2, TOWARD: 3 },
                    'piolite_wheel',
                    'pivotUnit'
                ),
                piolite_change_wheels: command(
                    'piolite_change_wheels',
                    [numberInput(), numberInput(), indicator()],
                    [text('10'), text('10'), null],
                    { LEFT: 0, RIGHT: 1 },
                    'piolite_wheel',
                    'changeWheels'
                ),
                piolite_set_wheels: command(
                    'piolite_set_wheels',
                    [numberInput(), numberInput(), indicator()],
                    [text('70'), text('70'), null],
                    { LEFT: 0, RIGHT: 1 },
                    'piolite_wheel',
                    'setWheels'
                ),
                piolite_change_wheel: command(
                    'piolite_change_wheel',
                    [dropdown(OPT_LEFT_RIGHT_BOTH, 'LEFT'), numberInput(), indicator()],
                    [null, text('10'), null],
                    { WHEEL: 0, VALUE: 1 },
                    'piolite_wheel',
                    'changeWheel'
                ),
                piolite_set_wheel: command(
                    'piolite_set_wheel',
                    [dropdown(OPT_LEFT_RIGHT_BOTH, 'LEFT'), numberInput(), indicator()],
                    [null, text('70'), null],
                    { WHEEL: 0, VALUE: 1 },
                    'piolite_wheel',
                    'setWheel'
                ),
                piolite_stop: command(
                    'piolite_stop',
                    [indicator()],
                    [null],
                    {},
                    'piolite_wheel',
                    'stop'
                ),
                piolite_turbo_mode: command(
                    'piolite_turbo_mode',
                    [dropdown(OPT_ON_OFF, 'OFF'), indicator()],
                    [null, null],
                    { MODE: 0 },
                    'piolite_wheel',
                    'setTurboMode'
                ),
                piolite_is_wheel_moving: booleanField(
                    'piolite_is_wheel_moving',
                    [],
                    [],
                    {},
                    'piolite_wheel',
                    'isWheelMoving'
                ),
                piolite_rotate_neck: command(
                    'piolite_rotate_neck',
                    [dropdown(OPT_LEFT_RIGHT, 'LEFT'), numberInput(), indicator()],
                    [null, text('10'), null],
                    { DIRECTION: 0, VALUE: 1 },
                    'piolite_neck',
                    'rotateNeck'
                ),
                piolite_set_neck_speed: command(
                    'piolite_set_neck_speed',
                    [dropdown(OPT_NECK_SPEED, '4'), indicator()],
                    [null, null],
                    { SPEED: 0 },
                    'piolite_neck',
                    'setNeckSpeed'
                ),
                piolite_stop_neck: command(
                    'piolite_stop_neck',
                    [indicator()],
                    [null],
                    {},
                    'piolite_neck',
                    'stopNeck'
                ),
                piolite_is_neck_moving: booleanField(
                    'piolite_is_neck_moving',
                    [],
                    [],
                    {},
                    'piolite_neck',
                    'isNeckMoving'
                ),

                // -------- looks (eye) --------
                piolite_set_eye_color: command(
                    'piolite_set_eye_color',
                    [
                        dropdown(OPT_LEFT_RIGHT_BOTH, 'LEFT'),
                        dropdown(OPT_COLOR, 'RED'),
                        indicator(),
                    ],
                    [null, null, null],
                    { EYE: 0, COLOR: 1 },
                    'piolite_led',
                    'setEyeColor'
                ),
                piolite_set_eye_color_picker: command(
                    'piolite_set_eye_color_picker',
                    [dropdown(OPT_LEFT_RIGHT_BOTH, 'LEFT'), { type: 'Color' }, indicator()],
                    [null, null, null],
                    { EYE: 0, COLOR: 1 },
                    'piolite_led',
                    'setEyeColorPicker'
                ),
                piolite_change_eye_rgb: command(
                    'piolite_change_eye_rgb',
                    [
                        dropdown(OPT_LEFT_RIGHT_BOTH, 'LEFT'),
                        numberInput(),
                        numberInput(),
                        numberInput(),
                        indicator(),
                    ],
                    [null, text('10'), text('0'), text('0'), null],
                    { EYE: 0, RED: 1, GREEN: 2, BLUE: 3 },
                    'piolite_led',
                    'changeEyeRgb'
                ),
                piolite_set_eye_rgb: command(
                    'piolite_set_eye_rgb',
                    [
                        dropdown(OPT_LEFT_RIGHT_BOTH, 'LEFT'),
                        numberInput(),
                        numberInput(),
                        numberInput(),
                        indicator(),
                    ],
                    [null, text('255'), text('0'), text('0'), null],
                    { EYE: 0, RED: 1, GREEN: 2, BLUE: 3 },
                    'piolite_led',
                    'setEyeRgb'
                ),
                piolite_clear_eye: command(
                    'piolite_clear_eye',
                    [dropdown(OPT_LEFT_RIGHT_BOTH, 'LEFT'), indicator()],
                    [null, null],
                    { EYE: 0 },
                    'piolite_led',
                    'clearEye'
                ),

                // -------- sound --------
                piolite_play_sound: command(
                    'piolite_play_sound',
                    [dropdown(OPT_SOUND, 'BEEP'), indicator()],
                    [null, null],
                    { SOUND: 0 },
                    'piolite_sound',
                    'playSound'
                ),
                piolite_play_sound_times: command(
                    'piolite_play_sound_times',
                    [dropdown(OPT_SOUND, 'BEEP'), numberInput(), indicator()],
                    [null, text('1'), null],
                    { SOUND: 0, REPEAT: 1 },
                    'piolite_sound',
                    'playSoundTimes'
                ),
                piolite_play_sound_until: command(
                    'piolite_play_sound_until',
                    [dropdown(OPT_SOUND, 'BEEP'), numberInput(), indicator()],
                    [null, text('1'), null],
                    { SOUND: 0, REPEAT: 1 },
                    'piolite_sound',
                    'playSoundUntil'
                ),
                piolite_change_buzzer: command(
                    'piolite_change_buzzer',
                    [numberInput(), indicator()],
                    [text('10'), null],
                    { HZ: 0 },
                    'piolite_sound',
                    'changeBuzzer'
                ),
                piolite_set_buzzer: command(
                    'piolite_set_buzzer',
                    [numberInput(), indicator()],
                    [text('1000'), null],
                    { HZ: 0 },
                    'piolite_sound',
                    'setBuzzer'
                ),
                piolite_clear_sound: command(
                    'piolite_clear_sound',
                    [indicator()],
                    [null],
                    {},
                    'piolite_sound',
                    'clearSound'
                ),
                piolite_play_note: command(
                    'piolite_play_note',
                    [dropdown(OPT_NOTE, 'C'), dropdown(OPT_OCTAVE, '4'), indicator()],
                    [null, null, null],
                    { NOTE: 0, OCTAVE: 1 },
                    'piolite_sound',
                    'playNote'
                ),
                piolite_play_note_beat: command(
                    'piolite_play_note_beat',
                    [
                        dropdown(OPT_NOTE, 'C'),
                        dropdown(OPT_OCTAVE, '4'),
                        numberInput(),
                        indicator(),
                    ],
                    [null, null, text('0.5'), null],
                    { NOTE: 0, OCTAVE: 1, BEAT: 2 },
                    'piolite_sound',
                    'playNoteBeat'
                ),
                piolite_rest_beat: command(
                    'piolite_rest_beat',
                    [numberInput(), indicator()],
                    [text('0.25'), null],
                    { BEAT: 0 },
                    'piolite_sound',
                    'restBeat'
                ),
                piolite_change_tempo: command(
                    'piolite_change_tempo',
                    [numberInput(), indicator()],
                    [text('20'), null],
                    { BPM: 0 },
                    'piolite_sound',
                    'changeTempo'
                ),
                piolite_set_tempo: command(
                    'piolite_set_tempo',
                    [numberInput(), indicator()],
                    [text('60'), null],
                    { BPM: 0 },
                    'piolite_sound',
                    'setTempo'
                ),
                piolite_is_sound_playing: booleanField(
                    'piolite_is_sound_playing',
                    [],
                    [],
                    {},
                    'piolite_sound',
                    'isSoundPlaying'
                ),

                // -------- sensing --------
                piolite_button: stringField(
                    'piolite_button',
                    [dropdown(OPT_BUTTON, 'MOVE_FORWARD')],
                    [null],
                    { BUTTON: 0 },
                    'piolite_sensor',
                    'getButton'
                ),
                piolite_signal_strength: stringField(
                    'piolite_signal_strength',
                    [],
                    [],
                    {},
                    'piolite_sensor',
                    'getSignalStrength'
                ),
                piolite_when_button_state: {
                    color: HW,
                    outerLine: HW_LINE,
                    fontColor: '#fff',
                    skeleton: 'basic_event',
                    statements: [],
                    params: [
                        {
                            type: 'Indicator',
                            img: 'block_icon/start_icon_hardwarelite.svg',
                            size: 14,
                            position: { x: 0, y: -2 },
                        },
                        dropdown(OPT_BUTTON, 'MOVE_FORWARD'),
                        dropdown(OPT_WHEN_STATE, 'PRESSED'),
                    ],
                    events: {},
                    def: {
                        params: [null, null, null],
                        type: 'piolite_when_button_state',
                    },
                    paramsKeyMap: { DUMMY: 0, BUTTON: 1, STATE: 2 },
                    event: 'pioliteWhenButtonState',
                    class: 'piolite_sensor',
                    isNotFor: ['PioLite'],
                    func(sprite, script) {
                        if (Entry.PioLite.checkButtonState(script)) {
                            return script.callReturn();
                        }
                        return this.die();
                    },
                },
                piolite_button_state: booleanField(
                    'piolite_button_state',
                    [dropdown(OPT_BUTTON, 'MOVE_FORWARD'), dropdown(OPT_BUTTON_STATE, 'PRESSED')],
                    [null, null],
                    { BUTTON: 0, STATE: 1 },
                    'piolite_sensor',
                    'isButtonState'
                ),
                piolite_battery_state: booleanField(
                    'piolite_battery_state',
                    [dropdown(OPT_BATTERY, 'NORMAL')],
                    [null],
                    { BATTERY: 0 },
                    'piolite_sensor',
                    'checkBatteryState'
                ),
            };
        }

        // ---------------- 모니터 ----------------

        getMonitorPort() {
            return { ...this.sensory, ...this.motoring };
        }

        get monitorTemplate() {
            return {
                // getter 형태를 유지할 것: 코어가 이 객체에 쓰는 값이 버려지는 현재 동작이
                // 여기에 의존하고, Lang 병합 이후에 읽혀야 한다.
                imgPath: `hw_lite/${this.imageName}`,
                // 좌표는 256 좌표계의 절대 위치다. hardwareMonitor 가 사진을 256으로
                // 늘려 그리므로 실제 사진 크기와 무관하다.
                width: 256,
                height: 256,
                listPorts: {
                    signalStrength: {
                        name: Lang.Blocks.piolite_sensor_signal_strength,
                        type: 'input',
                        pos: { x: 0, y: 0 },
                    },
                    batteryState: {
                        name: Lang.Blocks.piolite_sensor_battery,
                        type: 'input',
                        pos: { x: 0, y: 0 },
                    },
                    leftWheel: {
                        name: Lang.Hw.leftWheel,
                        type: 'output',
                        pos: { x: 0, y: 0 },
                    },
                    rightWheel: {
                        name: Lang.Hw.rightWheel,
                        type: 'output',
                        pos: { x: 0, y: 0 },
                    },
                    buzzer: {
                        name: Lang.Hw.buzzer,
                        type: 'output',
                        pos: { x: 0, y: 0 },
                    },
                },
                ports: {},
                mode: 'both',
            };
        }

        // 코어(webSerialConnector)가 매 틱 부르는 송신 진입점.
        requestLocalData() {
            if (this.foreignAttached) {
                return undefined; // 거부 상태에서 한 바이트도 내보내지 않는다
            }
            this.__latchCommands();
            return this.__encodeFrame();
        }
    }

    // 로봇 계층 상수 14종을 prototype 에 붙인다. 인스턴스 필드로 내리지 않는다.
    // 인스턴스 필드로 내리면 필드 집합이 원본과 달라진다. 원본도 prototype 멤버다.
    // 열넷을 전부 이름으로 적는다. 줄이면 빠뜨린 것이 어느 스텝에도 배정되지 않는다.
    Object.assign(PioLite.prototype, {
        __PORT_MAP,
        __LIMITS,
        __ID_PORTS,
        __BUTTONS,
        __BUTTON_INDEX,
        __NOTES,
        __SOUNDS,
        __RGBS,
        __EYE_CHANNELS,
        __UNITS,
        __PULSE_PER_UNIT,
        __MAX_PULSE,
        __MAX_DELAY_MS,
        __BATTERY_STATES,
    });

    // 프레임 상수를 클래스 정적으로도 노출한다. 본문의 Module.<CONST> 참조는 그대로 두고
    // 같은 값을 클래스에 얹기만 한다. 내보내는 것은 인스턴스이고 클래스 바인딩은
    // IIFE 밖으로 나가지 않으므로, 밖에서 닿는 유일한 길은 Entry.PioLite.constructor 다.
    // 현재 소비자는 0곳이고 상수 확인 편의로만 남긴다.
    Object.assign(PioLite, Module);

    Entry.PioLite = new PioLite();
})();
module.exports = Entry.PioLite;
