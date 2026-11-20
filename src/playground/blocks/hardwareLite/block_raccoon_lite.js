'use strict';

/*
 * 라쿤 하드웨어Lite 모듈.
 *
 * 이식 출처:
 *   - entry-hw/app/modules/raccoon.js
 *   - entryjs .../hardware/block_robomation.js (RaccoonRobot)
 *   - entryjs .../hardware/block_raccoon.js
 *   - entryjs .../hardwareLite/block_pio_lite.js (프레임과 핸드셰이크 계층 선례)
 *
 * 설치형은 entry-hw 모듈과 entryjs 로봇 계층이 두 프로세스로 나뉘어 handler(IPC)로
 * motoring/sensory 를 주고받는다. lite 는 프로세스가 하나이므로 브리지 자체가 없다.
 * 그래서 설치형의 두 클래스(Module 과 RaccoonRobot)를 RaccoonLite 하나로 합친다.
 */
(function () {
    // 연결 시 정체 라인(FF01) 대기 상한. 페어링된 동글은 ms 단위로 응답하므로 5초면 충분.
    const HANDSHAKE_TIMEOUT_MS = 5000;

    // raccoon.js 의 모듈 스코프 정적 상수. 이름을 Module 로 유지해 본문의
    // Module.<CONST> 참조를 무수정으로 남긴다.
    const Module = {
        STEP_TO_DEG: 360.0 / 4096.0,
        DEG_TO_STEP: 4096.0 / 360.0,

        // 의미 소리 코드(entryjs가 보내는 Raccoon.SOUND_*) -> 장치 바이트.
        // 삐오 표와 다름 (예: dibidibidip은 여기 0x21, 삐오는 0x27).
        SOUNDS: {
            0: 0x00,
            1: 0x01, // beep
            2: 0x05, // random beep
            3: 0x09, // siren
            4: 0x0b, // engine
            5: 0x15, // robot
            8: 0x21, // dibidibidip
            9: 0x22, // good job
            10: 0x07, // noise
            11: 0x12, // chop
            18: 0x14, // random melody
            22: 0x23, // wake up
            23: 0x24, // start
            24: 0x25, // bye
            127: 0x16, // error sound
        },

        // 관절 인덱스별 각도 한계 (deg)
        JOINT_LIMITS: [
            [-120, 120],
            [-90, 30],
            [-150, 0],
            [-105, 105],
        ],
    };

    // ---------------- 로봇 계층 상수 (목록 C2 26개) ----------------
    // block_robomation.js 의 RaccoonRobot.prototype 상수를 원문 그대로 옮긴다.
    // 인스턴스 필드로 내리지 않는다. 내리면 필드 집합이 원본과 달라진다.
    // 스물여섯을 전부 이름으로 적는다. 줄이면 빠뜨린 것이 어느 스텝에도 배정되지 않는다.
    const __TO_RADIAN = Math.PI / 180.0;
    const __TO_DEGREE = 180.0 / Math.PI;
    const __L1 = 8.25;
    const __L2 = 10;
    const __L3 = 10;
    const JOINT_MODE_VELOCITY = 0;
    const JOINT_MODE_ANGLE = 1;
    const JOINT_MODE_VELOCITY_HORZ = 2;
    const JOINT_MODE_VELOCITY_VERT = 3;
    const JOINT_MODE_ANGLE_HORZ = 4;
    const JOINT_MODE_ANGLE_VERT = 5;
    const REF_NONE = 0;
    const REF_WRIST = 1;
    const REF_GRIPPER = 2;
    const __INCH_TO_CM = 2.54;
    const __MM_TO_CM = 0.1;
    const __RESET_TIMEOUT_MS = 3000;
    const __SOUND_TIMEOUT_MS = 10000;
    const __PORT_MAP = {
        group: 'raccoon',
        module: 'raccoon',
        jointVelocity1: 0,
        jointVelocity2: 0,
        jointVelocity3: 0,
        jointVelocity4: 0,
        jointSpeed: 100,
        jointAngleId: 0,
        jointAngle1: 0,
        jointAngle2: -10,
        jointAngle3: -140,
        jointAngle4: 60,
        jointModeId: 0,
        jointMode: 0,
        noteId: 0,
        note: 0,
        soundId: 0,
        sound: 0,
        slotW1Id: 0,
        slotW1: [0x10, 0, 0, 0, 0, 0, 0, 0],
        slotW2Id: 0,
        slotW2: [0x20, 0, 0, 0, 0, 0, 0, 0],
        slotW3Id: 0,
        slotW3: [0x30, 0, 0, 0, 0, 0, 0, 0],
    };
    const __ID_PORTS = [
        'jointAngleId',
        'jointModeId',
        'noteId',
        'soundId',
        'slotW1Id',
        'slotW2Id',
        'slotW3Id',
    ];
    const __JOINTS = {
        JOINT1: 1,
        JOINT2: 2,
        JOINT3: 3,
        JOINT4: 4,
        ALL: -1,
    };
    const __AXES = {
        X: 1,
        Y: 2,
        Z: 0,
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
        WAKE_UP: 22,
        START: 23,
        BYE: 24,
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
        NORMAL: 2,
        LOW: 1,
        EMPTY: 0,
    };
    const __MAX_DELAY_MS = 2147483647;

    class RaccoonLite {
        constructor() {
            this.id = '023001';
            this.name = 'RaccoonLite';
            this.url = 'http://www.robomation.net';
            this.imageName = 'raccoonlite.png';
            this.title = { ko: '라쿤' };
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

            // ---------------- 프레임 계층 시드 ----------------
            // raccoon.js Module 생성자 그대로다. 아래 두 객체는 이후 어느 단계에서도
            // 재대입하지 않는다. 로봇 계층 생성자를 합칠 때는 필드만, 그 키가
            // undefined 일 때만 더한다. 재대입하면 motoring 의
            // 안전 자세 시드(jointAngle2 -10, jointAngle3 -140, jointAngle4 60)와
            // 슬롯 헤더가 통째로 사라진다.

            // sensory: 블록 계층으로 전달.
            // 라우팅: 핸드셰이크 토큰 model 0x30 이 이 로봇을 고른다.
            this.sensory = {
                company: 0x02,
                model: 0x30,
                index: 0,
                signalStrength: 0,
                encoder1: 0,
                encoder2: 0,
                encoder3: 0,
                encoder4: 0,
                teachButton: 0,
                playButton: 0,
                deleteButton: 0,
                teachClickedId: 0,
                playClickedId: 0,
                deleteClickedId: 0,
                teachLongPressedId: 0,
                playLongPressedId: 0,
                deleteLongPressedId: 0,
                warning: 0,
                moving: 0,
                collision1Id: 0,
                collision2Id: 0,
                collision3Id: 0,
                collision4Id: 0,
                jointStateId: 0,
                soundStateId: 0,
                batteryState: 2,
                chargeState: 0,
                slotR1Id: 0,
                slotR1: [0, 0, 0, 0, 0, 0, 0, 0],
                slotR2Id: 0,
                slotR2: [0, 0, 0, 0, 0, 0, 0, 0],
                slotR3Id: 0,
                slotR3: [0, 0, 0, 0, 0, 0, 0, 0],
            };
            // motoring: 블록 계층에서 수신.
            // jointAngle2/3/4 는 0 이 아니다. 의도적으로 기본 자세를 시드한다.
            // 모드/각도 순서 경합이 나더라도 전 관절이 크게 움직이는 대신 안전한
            // 정지 자세를 명령하도록. 정상 상태 바이트 결과는 불변이다.
            this.motoring = {
                jointVelocity1: 0,
                jointVelocity2: 0,
                jointVelocity3: 0,
                jointVelocity4: 0,
                jointSpeed: 100,
                jointAngleId: 0,
                jointAngle1: 0,
                jointAngle2: -10,
                jointAngle3: -140,
                jointAngle4: 60,
                jointModeId: 0,
                jointMode: 0,
                noteId: 0,
                note: 0,
                soundId: 0,
                sound: 0,
                slotW1Id: 0,
                slotW1: [0x10, 0, 0, 0, 0, 0, 0, 0],
                slotW2Id: 0,
                slotW2: [0x20, 0, 0, 0, 0, 0, 0, 0],
                slotW3Id: 0,
                slotW3: [0x30, 0, 0, 0, 0, 0, 0, 0],
            };
            this.address = '';

            // 거부 상태 머신 (lite 전용, 설치형 모듈에 대응 없음).
            this.foreignAttached = false; // 받지 않는 기종이 붙어 있는가
            this.rejectedAddress = undefined; // 안내 중복 방지(주소별 1회)
            this.invalidFrameCount = 0; // 연속 헤더 불일치. 30 에서 정체 재프로브
            this.foreignFrameCount = 0; // 연속 타주소 프레임. 30 에서 정체 재프로브
            this.tailSeen = false; // 이 스트림이 꼬리에 주소를 싣는지 배운 결과
            this.__stickyToast = undefined; // 거부가 풀릴 때까지 남기는 안내 (아래 참조)
            this.pendingIdentity = undefined; // 1회성 노이즈 방어. 2회 확인 후 전환
            this.pendingIdentityTtl = 0;

            this._init();

            this.blockMenuBlocks = [
                'raccoonlite_return_to_basic_pose',
                'raccoonlite_change_joint_angles_by',
                'raccoonlite_change_joint_angles_by_until',
                'raccoonlite_set_joint_angles_to',
                'raccoonlite_set_joint_angles_to_until',
                'raccoonlite_change_angle_by',
                'raccoonlite_change_angle_by_until',
                'raccoonlite_set_angle_to',
                'raccoonlite_set_angle_to_until',
                'raccoonlite_change_position_by_xyz',
                'raccoonlite_change_position_by_xyz_until',
                'raccoonlite_set_position_to_xyz',
                'raccoonlite_set_position_to_xyz_until',
                'raccoonlite_change_position_by',
                'raccoonlite_set_position_to',
                'raccoonlite_set_position_ref_to',
                'raccoonlite_change_position_ref_by_front_up',
                'raccoonlite_set_position_ref_to_front_up',
                'raccoonlite_change_joint_velocities_by',
                'raccoonlite_set_joint_velocities_to',
                'raccoonlite_change_velocity_by',
                'raccoonlite_set_velocity_to',
                'raccoonlite_stop',
                'raccoonlite_turn_off',
                'raccoonlite_turn_precision_mode',
                'raccoonlite_is_moving',
                'raccoonlite_with_gripper',
                'raccoonlite_lock_gripper',
                'raccoonlite_lock_gripper_until',
                'raccoonlite_unlock_gripper',
                'raccoonlite_gripper_state',
                'raccoonlite_play_sound',
                'raccoonlite_play_sound_times',
                'raccoonlite_play_sound_until',
                'raccoonlite_clear_sound',
                'raccoonlite_play_note',
                'raccoonlite_play_note_beat',
                'raccoonlite_rest_beat',
                'raccoonlite_change_tempo',
                'raccoonlite_set_tempo',
                'raccoonlite_is_sound_playing',
                'raccoonlite_encoder1',
                'raccoonlite_encoder2',
                'raccoonlite_encoder3',
                'raccoonlite_encoder4',
                'raccoonlite_position_x',
                'raccoonlite_position_y',
                'raccoonlite_position_z',
                'raccoonlite_position_x_inch',
                'raccoonlite_position_y_inch',
                'raccoonlite_position_z_inch',
                'raccoonlite_teach_button',
                'raccoonlite_play_button',
                'raccoonlite_delete_button',
                'raccoonlite_signal_strength',
                'raccoonlite_when_button_state',
                'raccoonlite_button_state',
                'raccoonlite_battery_state',
                'raccoonlite_charging',
                'raccoonlite_conveyor_move',
                'raccoonlite_conveyor_change_velocity',
                'raccoonlite_conveyor_set_velocity',
                'raccoonlite_conveyor_stop',
                'raccoonlite_conveyor_moving',
                'raccoonlite_conveyor_button',
                'raccoonlite_conveyor_when_button_state',
                'raccoonlite_conveyor_button_state',
            ];

            // ---------------- 로봇 계층 상태 ----------------
            // 원본 RaccoonRobot 생성자를 여기 합친다. sensory/motoring 은 재대입하지 않고
            // 필드만 더한다. 재대입하면 위에서 만든 프레임 계층 상태가 지워지고
            // motoring 의 안전 자세 시드와 슬롯 헤더가 사라진다.
            //
            // 원본 RaccoonRobot.sensory 30키는 위 프레임 sensory 33키의 완전한 부분집합이라
            // 더할 것이 없다. motoring 3키 중 group 과 module 은 병합 대상이 아니고
            // (읽는 곳 0곳, 넣으면 reset() 이 문자열을 0 으로 만든다), index 도 같은 근거로 뺀다.
            // 실측 독자 0곳이고, 프레임 계층이 이미 sensory.index 를 세우고 reset() 에서
            // 다시 시드한다. 삐오 lite 는 motoring.index 를 세운다. 여기서 갈린다.
            //
            // __PORT_MAP 의 undefined 가드 back-fill 도 두지 않는다. 실측 __PORT_MAP(24키) 에서
            // 프레임 motoring(22키) 를 빼면 정확히 group 과 module 둘이고 그 둘은 위 이유로
            // 제외 대상이다. 즉 이 로봇에서 그 루프는 무동작이다(삐오는 프레임 쪽에 빠진 키가
            // 있어 루프가 일을 했다).
            //
            // *StateId 를 -1 로 둔다. 삐오는 0 이어야 했지만 라쿤은 다르다.
            // handleSensory 가 `this.jointStateId != -1` 로 첫 샘플을 명시적으로 방어하므로
            // 0 으로 바꾸면 첫 프레임에서 완료 콜백이 잘못 발화한다.
            // 각도 명령은 프로토콜상 네 관절 값을 모두 싣는데, motoring.jointAngleN은 장치에서 읽은 값이
            // 아니라 "마지막으로 명령한 값"이다. 속도 블록이나 전원 끄기로 움직인 관절은 그 값이 실제와
            // 어긋나므로 다음 각도 명령 때 실측값(sensory.encoderN)으로 다시 채워야 한다. 관절별로 표시해
            // 두고, 지정하지 않은 관절의 진행 중 목표를 덮어쓰지 않는다.
            // 연결 직후에는 버퍼가 기본 자세를 주장하는데 팔은 이전 세션 자세에 있으므로 전부 true로 시작한다.
            this.jointAngleStale = [true, true, true, true];
            // 보낼 수 없는 자세라 명령을 건너뛴 것을 실행당 1회만 알린다.
            this.unreachablePoseWarned = false;
            this.delayWarned = false;
            this.jointVelocity1 = 0;
            this.jointVelocity2 = 0;
            this.jointVelocity3 = 0;
            this.jointVelocity4 = 0;
            this.teachClickedId = -1;
            this.playClickedId = -1;
            this.deleteClickedId = -1;
            this.teachLongPressedId = -1;
            this.playLongPressedId = -1;
            this.deleteLongPressedId = -1;
            this.collision1Id = -1;
            this.collision2Id = -1;
            this.collision3Id = -1;
            this.collision4Id = -1;
            this.jointStateId = -1;
            this.soundStateId = -1;
            this.slotR1Id = -1;
            this.slotR2Id = -1;
            this.slotR3Id = -1;
            this.blockId = 0;
            this.angleCallback = undefined;
            this.resetting = false;
            this.resetTimer = undefined;
            this.currentSound = 0;
            this.soundRepeat = 1;
            this.soundCallback = undefined;
            this.soundTimeoutTimer = undefined;
            this.sounding = false;
            this.noteId = 0;
            this.noteTimer1 = undefined;
            this.noteTimer2 = undefined;
            // angleDone 은 관절각의 최종 완료만 든다. angleCallback 과 갈라 두는 이유는
            // 정밀 모드에서 angleCallback 이 명령을 발행하는 이어달리기를 들기 때문이다.
            // 취소가 angleCallback 을 부르면 정지하려는 순간에 팔이 움직인다.
            this.angleDone = undefined;
            // noteCallback / ioCallback / conveyorMovingCallback 은 lite 전용이다.
            // 원본은 음표, 쉼표, 그리퍼, 초단위 컨베이어의 대기 해제를 지역 클로저로만 들고
            // 타이머에 넣어 둔다. setZero 는 __removeAllTimeouts() 로 타이머를 죽이기만
            // 하므로, 손잡이가 없으면 그 클로저를 부를 길이 없어 script.isMoving 이 true 로
            // 남고 블록이 영원히 끝나지 않는다. 설치형에서는 setZero 호출부가 엔진 정지
            // 하나뿐이라 매달릴 스레드가 없었는데, 연결과 거부 계층이 들어오면서 세션 중
            // 정체 전환과 onForeignRobot 이 엔진이 살아 있는 채로 setZero 를 부른다.
            // 삐오도 같은 이유로 noteCallback 을 두고 있다.
            this.noteCallback = undefined;
            this.noting = false;
            this.resting = false;
            this.ioId = 0;
            this.ioTimer = undefined;
            this.ioCallback = undefined;
            // 초 단위 컨베이어 이동의 대기 해제. conveyor 안이 아니라 최상위에 두는 이유는
            // 설치형과의 키 대조에서 lite 전용 제외가 최상위 키만 지우기 때문이다.
            // 거리 기반 완료는 장치 프레임에서 오므로 원문 그대로 conveyor.distanceCallback 이다.
            this.conveyorMovingCallback = undefined;
            this.teachButton = 0;
            this.playButton = 0;
            this.deleteButton = 0;
            this.teachPressed = false;
            this.playPressed = false;
            this.deletePressed = false;
            this.teachReleased = false;
            this.playReleased = false;
            this.deleteReleased = false;
            this.teachClicked = false;
            this.playClicked = false;
            this.deleteClicked = false;
            this.teachLongPressed = false;
            this.playLongPressed = false;
            this.deleteLongPressed = false;
            this.collided1 = false;
            this.collided2 = false;
            this.collided3 = false;
            this.collided4 = false;
            this.jointMode = this.JOINT_MODE_VELOCITY;
            this.precisionMode = 0;
            this.tempo = 60;
            this.posRef = { x: 0, y: 0, z: 0 };
            this.posRefAbs = { x: 0, y: 0, z: 0 };
            this.posRefRel = { x: 0, y: 0, z: 0 };
            this.posRefDev = this.REF_GRIPPER;
            this.pos = { x: 0, y: 0, z: 0 };
            this.joints = [0, 0, 0, 0];
            this.gripper = { type: -1, state: -1 };
            this.extType = 0;
            // 컨베이어 주변장치. 라쿤 SLOT1 채널을 사용한다.
            // 바이트 계층(slotW1/slotR1)은 entry-hw raccoon.js에 있다.
            this.conveyor = {
                motoring: { mode: 0, velocity: 0, distanceId: 0, distance: 0 },
                sensory: {
                    mode: 0,
                    velocity: 0,
                    distance: 0,
                    button: 0,
                    clickedId: 0,
                    longPressedId: 0,
                    stateId: 0,
                    moving: 0,
                },
                clickedId: -1,
                longPressedId: -1,
                stateId: -1,
                distanceCallback: undefined,
                movingId: 0,
                movingTimer: undefined,
                moving: false,
                button: 0,
                pressed: false,
                released: false,
                clicked: false,
                longPressed: false,
            };
            this.timeouts = [];
        }

        // ---------------- 프레임 계층 장치 상태 ----------------

        _init() {
            // 인코더가 읽는 장치 레벨 필드
            this._joint_velocity = [0, 0, 0, 0];
            this._joint_speed = 100;
            // 의도적으로 0 초기화 대신 기본 자세를 시드한다. 모드/각도 순서 경합(각도 쓰기 전
            // 각도모드 헤더)이 나더라도 전 관절이 크게 움직이는 대신 안전한 정지 자세를
            // 명령하도록. 정상 상태 바이트 결과는 불변이다.
            this._joint_angle = [0, -10, -140, 60];
            this._joint_angle_written = false;
            this._joint_mode = 0;
            this._note = 0;
            this._note_written = false;
            this._sound = 0;
            this._sound_written = false;
            this._slot_w1 = [0x10, 0, 0, 0, 0, 0, 0, 0];
            this._slot_w2 = [0x20, 0, 0, 0, 0, 0, 0, 0];
            this._slot_w3 = [0x30, 0, 0, 0, 0, 0, 0, 0];

            // 인코더 카운터 (풀바이트 %255, 삐오의 %15와 다름)
            this._joint_angle_id = 0;
            this._sound_id = 0;
            this._sound_event = 0;
            this._packet_sent = -1;

            // 장치 2비트 순환 id의 디코더 내부 캐시.
            // -1 = 첫 샘플 방어. 재연결/재부팅이 오래된 id의 잘못된 완료를 흘리지 못하게 한다.
            this._dev_ids = {
                jointState: -1,
                soundState: -1,
                collision1: -1,
                collision2: -1,
                collision3: -1,
                collision4: -1,
                teachClicked: -1,
                playClicked: -1,
                deleteClicked: -1,
                teachLongPressed: -1,
                playLongPressed: -1,
                deleteLongPressed: -1,
            };
            // 블록 계층으로 노출되는 단조 증가 JSON 카운터 (%255)
            this._json_counters = {};

            // *Id 필드 변경 감지.
            // _primed=true면 priming(기준선 채택) 없이 0 시드에서 바로 첫 명령을 발동한다.
            // 최초 연결에서는 idle 프레임이 선행하지 않으므로 첫 수신이 곧 첫 명령이다.
            // priming을 켜두면 그 첫 명령을 기준선으로 삼켜 관절 각도가 미기록되고
            // 첫 실행이 멈춘다. 재연결(reset() 경유)에서만 _primed=false로 둔다.
            this._primed = true;
            this._prev_jointAngleId = 0;
            this._prev_noteId = 0;
            this._prev_soundId = 0;
            this._prev_slotW1Id = 0;
            this._prev_slotW2Id = 0;
            this._prev_slotW3Id = 0;
        }

        // ---------------- 연결 ----------------

        requestInitialData() {
            return 'FF\r';
        }

        checkInitialData(data, config) {
            // 이름에 의존하지 않는 핸드세이크: 이름 필드는 임의/다국어이며 콤마를 포함할 수
            // 있으므로 끝의 CR/LF만 제거하고 콤마로 분리한 뒤, 뒤쪽 고정 필드(모델/변형/주소)를
            // 집는다. 라쿤 모델 토큰은 "30".
            if (typeof data !== 'string' || data.slice(0, 2) != 'FF') {
                return;
            }
            const info = data.replace(/[\r\n]+$/, '').split(',');
            if (info.length < 5) {
                return;
            }
            const model = info[info.length - 3];
            const variant = info[info.length - 2];
            const address = info[info.length - 1];
            if (!/^[0-9A-Fa-f]{2}$/.test(variant) || !/^[0-9A-Fa-f]{12}$/.test(address)) {
                return false;
            }
            if (model == '30') {
                config.id = `0230${variant}`;
                this.address = address;
                return true;
            }
            return false;
        }

        validateLocalData(data) {
            // 장치 패킷은 끝의 '\r' 포함 54바이트. 프레임워크가 '\r'를 제거하므로 데이터 줄은 53.
            return data.length == 53;
        }

        reset() {
            this._init();
            // reset()은 연결이 끊길 때만 호출된다. 즉 다음 수신은 '재연결'이다. 이때만 priming을
            // 켜(_primed=false) 유지된 stale id의 오발동을 막는다. 최초 연결에는 reset()이
            // 안 불리므로 _init의 _primed=true가 유지돼 첫 명령이 정상 발동된다.
            // (아래 줄은 반드시 this._init() 뒤에 와야 한다. _init이 _primed=true로 되돌린다.)
            this._primed = false;
            const s = this.sensory;
            for (const k in s) {
                if (s[k] instanceof Array) {
                    for (let i = 0; i < s[k].length; ++i) s[k][i] = 0;
                } else {
                    s[k] = 0;
                }
            }
            s.company = 0x02;
            s.model = 0x30;
            s.index = 0;
            s.batteryState = 2;
            const m = this.motoring;
            for (const mk in m) {
                if (m[mk] instanceof Array) continue;
                m[mk] = 0;
            }
            m.jointSpeed = 100;
            m.jointAngle2 = -10;
            m.jointAngle3 = -140;
            m.jointAngle4 = 60;
            m.slotW1 = [0x10, 0, 0, 0, 0, 0, 0, 0];
            m.slotW2 = [0x20, 0, 0, 0, 0, 0, 0, 0];
            m.slotW3 = [0x30, 0, 0, 0, 0, 0, 0, 0];
        }

        // ---------------- 변환 ----------------

        toHex(number) {
            let value = parseInt(number);
            if (value < 0) value += 0x100;
            value = (value & 0xff).toString(16).toUpperCase();
            return value.length > 1 ? value : `0${value}`;
        }

        toHex2(number) {
            let value = parseInt(number);
            if (value < 0) value += 0x10000;
            value = (value & 0xffff).toString(16).toUpperCase();
            let result = '';
            for (let i = value.length; i < 4; ++i) result += '0';
            return result + value;
        }

        // 반올림은 half-to-even(은행가 반올림). 삐오의 half-away-from-zero와 다름.
        _pyRound(v) {
            if (Math.abs(v % 1) === 0.5) {
                const f = Math.floor(v);
                return f % 2 === 0 ? f : f + 1;
            }
            return Math.round(v);
        }

        _signed16(hex) {
            let value = parseInt(hex, 16);
            if (value > 0x7fff) value -= 0x10000;
            return value;
        }

        // 속도 검증: 127 = 전원 차단 통과, 그 외 +/-100로 제한
        _verifyVelocity(vel) {
            if (vel == 127) return 127;
            if (vel < -100) return -100;
            if (vel > 100) return 100;
            return vel;
        }

        _verifySpeed(speed) {
            if (speed < 0) return 0;
            if (speed > 100) return 100;
            return speed;
        }

        // deg->step: 관절별 제한 -> half-to-even 반올림 -> step 제한
        _degToStep(index, deg) {
            const limit = Module.JOINT_LIMITS[index];
            if (deg < limit[0]) deg = limit[0];
            else if (deg > limit[1]) deg = limit[1];
            const step = this._pyRound(deg * Module.DEG_TO_STEP);
            if (step < -2048) return -2048;
            if (step > 2047) return 2047;
            return step;
        }

        // ---------------- 연결과 거부 계층 (lite 전용) ----------------
        //
        // 설치형 모듈에 대응이 없다. lite 코어(webSerialConnector)가 요구하는 계약이고
        // 삐오 lite 가 선례다. 설치형 API(requestInitialData/checkInitialData)는 코어가
        // 부르지 않는다. 그 둘만 옮기면 핸드셰이크가 통째로 안 돈다.

        // 장치 2비트 순환 id 를 비교하는 센티널을 원점으로 되돌린다.
        // 장치가 바뀌면 그쪽 id 가 임의 값에서 다시 시작하므로 지난 세션 값과 비교하면
        // 가짜 완료 또는 완료 누락이 난다.
        __rearmDeviceSentinels() {
            const d = this._dev_ids;
            for (const k in d) d[k] = -1;
            this.teachClickedId = -1;
            this.playClickedId = -1;
            this.deleteClickedId = -1;
            this.teachLongPressedId = -1;
            this.playLongPressedId = -1;
            this.deleteLongPressedId = -1;
            this.collision1Id = -1;
            this.collision2Id = -1;
            this.collision3Id = -1;
            this.collision4Id = -1;
            this.jointStateId = -1;
            this.soundStateId = -1;
            this.slotR1Id = -1;
            this.slotR2Id = -1;
            this.slotR3Id = -1;
            const c = this.conveyor;
            c.clickedId = -1;
            c.longPressedId = -1;
            c.stateId = -1;
        }

        // 새 세션이 시작될 때 이전 세션의 잔여 상태를 비운다.
        // 이 인스턴스는 모듈 스코프 싱글턴이고 코어의 어느 해제 경로도 인스턴스를
        // 정리하지 않는다. hw_lite 의 disconnect 는 reset() 도 setZero() 도 안 부르고,
        // 연결 오류 경로는 webSerialConnector 가 'willDisconnect' 를 toggleStop 앞에 세워
        // engine 의 setZero 호출을 일부러 빗나가게 한다. 그래서 여기서 해야 한다.
        //
        // setZero() 를 재사용하지 않는다. 그쪽은 serial.update() 로 즉시 write 를
        // 유발하고 명령 id 를 올리는데 연결 직후에는 둘 다 불필요하고 부작용만 있다.
        //
        // 안전 자세 시드를 건드리지 않는다. motoring 의 jointAngle2/3/4 와
        // _joint_angle 은 그대로 둔다.
        __resetSessionState() {
            this._joint_velocity[0] = 0;
            this._joint_velocity[1] = 0;
            this._joint_velocity[2] = 0;
            this._joint_velocity[3] = 0;
            this._joint_speed = 100;
            this._joint_mode = 0;
            // 그림자만 지우면 소용없다. __latchCommands 가 이 넷을 "연속 값" 으로
            // 매 주기 motoring 에서 무조건 복사하므로 다음 틱에 되살아난다.
            // 눈 RGB 와 같은 부류다. 값은 생성자 기본값과 같다.
            const motoring = this.motoring;
            motoring.jointVelocity1 = 0;
            motoring.jointVelocity2 = 0;
            motoring.jointVelocity3 = 0;
            motoring.jointVelocity4 = 0;
            motoring.jointSpeed = 100;
            motoring.jointMode = 0;
            // 슬롯 페이로드도 같은 부류다. 슬롯은 4프레임 순환에서 무조건 실려 나가고,
            // __rearmDeviceSentinels 가 _prev_slotW*Id 를 되돌리므로 다음 latch 가
            // motoring.slotW* 를 그림자로 복사한다. 컨베이어가 도는 중에 끊고 재연결하면
            // 새 로봇에 이전 세션 명령이 나간다.
            // 헤더(바이트 0)는 슬롯 종류를 가리키므로 남긴다. __resetGripper 가 쓰는
            // 중립 모양과 같다(헤더 유지 + 1~7 영점화).
            [motoring.slotW1, motoring.slotW2, motoring.slotW3].forEach((slot) => {
                for (let i = 1; i < 8; ++i) {
                    slot[i] = 0;
                }
            });
            this._note = 0;
            this._sound = 0;
            this._note_written = false;
            this._sound_written = false;
            this._joint_angle_written = false;

            // 엔코더를 영점으로 되돌린다. 여기가 안 지우면 이전 세션 값이 남는다.
            // 바로 아래에서 `jointAngleStale` 을 넷 다 `true` 로 세우므로, 그 상태에서
            // `__seedStaleJointAngles()` 가 낡은 엔코더를 목표각으로 심을 수 있다.
            // `__canTrustEncoders()` 의 "넷이 정확히 0이면 측정 전으로 본다" 센티넬도
            // 이 영점화가 있어야 성립한다. 그 주석은 `reset()` 이 되돌린다고 적었지만
            // `reset()` 은 호출부가 0곳이다.
            const sensory = this.sensory;
            sensory.encoder1 = 0;
            sensory.encoder2 = 0;
            sensory.encoder3 = 0;
            sensory.encoder4 = 0;

            // 그리퍼 부착물 종류를 미지로 되돌린다. 되돌리는 곳이 `reset()` 뿐이었고
            // 그것이 안 돌아서, 재연결하면 다른 라쿤이 이전 로봇의 공구 보정을
            // 물려받았다(`__getPosRef` 가 서보/DC 는 8cm, 진공은 7.5cm 를 더한다).
            // 미지(-1)면 보정 0 이고, 이후 SLOT2 프레임이 실제 종류를 알려 준다.
            const gripper = this.gripper;
            gripper.type = -1;
            gripper.state = -1;

            // 거부 상태 머신의 보류와 연속 카운터. 초기화가 생성자에만 있었다. 이
            // 인스턴스는 모듈 스코프 싱글턴이라 세션이 끝나도 살아남고, 그러면 세션 B 의
            // 첫 일치 라인이 세션 A 의 2회차 확인으로 세어져 1회성 노이즈 방어가
            // 재연결 경계에서만 정확히 무력해진다. `foreignAttached` 와 `rejectedAddress` 는
            // 바로 앞 `onAcceptedIdentity()` 가 이미 푼다. `address` 는 건드리지 않는다.
            // 주소 관문이 그 값으로 돌고, 비우면 첫 프레임부터 관문이 꺼진다.
            this.pendingIdentity = undefined;
            this.pendingIdentityTtl = 0;
            this.invalidFrameCount = 0;
            this.foreignFrameCount = 0;
            // 래치도 세션 경계에서 되돌린다. 남기면 꼬리를 싣던 이전 동글의 학습이
            // 꼬리를 안 싣는 새 연결에 적용돼 전 프레임이 버려진다.
            this.tailSeen = false;

            // 대기 콜백은 죽은 script 를 가리킨다. 해소하지 않고 지운다.
            // 여기서 부르면 이전 세션 블록이 새 세션에서 완료 처리된다.
            this.angleCallback = undefined;
            this.angleDone = undefined;
            this.soundCallback = undefined;
            // lite 전용 손잡이 둘도 같이 버린다. setZero 와 달리 여기서는 해소하지 않는다.
            // 이 콜백들은 죽은 script 를 가리키고, 부르면 이전 세션 블록이 새 세션에서
            // 완료 처리된다(바로 위 목록과 같은 정책이다).
            this.noteCallback = undefined;
            this.ioCallback = undefined;
            this.conveyor.distanceCallback = undefined;
            this.conveyorMovingCallback = undefined;
            this.__removeAllTimeouts();

            // 진행 중 표시. 질의 블록이 이 값을 읽는다.
            this.sounding = false;
            this.noting = false;
            this.resting = false;
            this.resetting = false;
            this.conveyor.moving = false;

            // 버튼 엣지. 이전 세션이 눌린 채 끝나면 새 세션 첫 프레임이 뗌 이벤트로 읽혀
            // 햇 블록이 발화한다.
            this.clearEvent();
            this.jointAngleStale = [true, true, true, true];
            this.unreachablePoseWarned = false;
            this.delayWarned = false;
        }

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
        // 로케일 선택은 코어가 한다(setLanguage 결과를 Lang.Msgs 에 병합).
        __messages() {
            const m = (typeof Lang !== 'undefined' && Lang && Lang.Msgs) || {};
            return {
                rejectTitle: m.raccoonlite_reject_title,
                rejectDesc: m.raccoonlite_reject,
                foreignTitle: m.raccoonlite_foreign_robot_title,
                foreignDesc: m.raccoonlite_foreign_robot,
            };
        }

        // 이 항목이 받아들이는 기종인지. 라쿤은 모델 토큰 '30' 만 받는다.
        acceptsIdentity(identity) {
            return !!identity && identity.model === '30';
        }

        // 세션 중 다른 기종이 붙었다. 거부한 주소를 기억해 같은 로봇에 대해 한 번만 반응한다.
        // 기억하지 않으면 프레임마다 재판정되어 초당 수십 번 쓰기가 발생한다(수렴하지 않는다).
        onForeignRobot(identity) {
            if (this.rejectedAddress === identity.address) {
                return;
            }
            this.rejectedAddress = identity.address;
            this.foreignAttached = true; // 프로브 억제 스위치. 정상 정체를 보면 풀린다
            this.setZero();
            const t = this.__messages();
            if (!t.foreignTitle) {
                return;
            }
            // 거부가 풀릴 때까지 남긴다. 두 극단이 다 실측에서 깨졌다.
            // 자동 소멸(5초)은 놓치면 다시 볼 길이 없고(주소별 1회 가드 때문에 같은 로봇을
            // 다시 붙여도 안 뜬다), 무조건 잔류는 화면에 쌓인다.
            // 그래서 상태에 묶는다: 거부 상태인 동안만 떠 있고 풀리면 내려간다.
            // 종전 주석의 "거부 사실은 하드웨어 패널이 계속 보여준다" 는 거짓이었다.
            // 패널은 `연결한 하드웨어: 라쿤` 만 표시한다(실측).
            this.__showStickyToast(t.foreignTitle, t.foreignDesc);
        }

        // 거부 안내를 띄우고 코어가 돌려주는 요소 자체를 손잡이로 잡는다.
        // `Entry.toast.alert()` 는 마지막 줄이 `return toast;` 다(`class/toast.js:136`).
        // 코어에 이미 정착한 계약이고(`playground/block_menu.ts:411` 와 `util/utils.js:2023` 이
        // 반환값을 받아 `isOpen(target)` 에 넘긴다) 우리가 새로 만들 것이 없다.
        // `warning()`/`success()` 는 반환이 없다. `alert()` 에만 해당한다.
        //
        // 종전 판은 "코어가 손잡이를 안 돌려준다" 고 단정하고 `body_.lastChild` 로
        // 추측해 잡았다. 그 단정이 거짓임을 코어 원문으로 확인했다. 추측 취득과 표식 쓸어내기를 함께 걷어냈다.
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

        // 정상 기종의 정체를 받으면 거부 상태를 푼다. 변경 감지 분기가 아니라 이 훅이어야
        // 같은 로봇이 되돌아오는 경우까지 덮인다.
        onAcceptedIdentity(identity) {
            this.foreignAttached = false;
            this.rejectedAddress = undefined;
            this.__dismissStickyToast(); // 거부가 풀렸으니 안내도 내린다
        }

        // initialHandshake 의 거부 분기가 이것을 부른다(포트 정리 뒤).
        // 이쪽은 자동 소멸이다. 연결 시도마다 불리므로 잔류시키면 시도 횟수만큼 쌓인다.
        // 삐오에서 실제로 그랬다. 그리고 이 시점에는 포트가 이미 닫혀 남길 상태가 없다.
        onRejectedAtConnect() {
            const t = this.__messages();
            if (!t.rejectTitle) {
                return;
            }
            Entry.toast.alert(t.rejectTitle, t.rejectDesc);
        }

        // 받지 않는 기종이 붙어 있는 동안에는 센서 프레임을 해석하지 않는다.
        // 타기종 프레임도 53자라 헤더 관문을 통과한다. 해석하면 센서값이 어긋난다.
        shouldParseSensory() {
            return !this.foreignAttached;
        }

        // 정체를 다시 묻는다. 두 재프로브 경로가 공유한다.
        __probeIdentity() {
            try {
                if (Entry.hwLite && Entry.hwLite.serial) {
                    Entry.hwLite.serial.sendAsciiAsBuffer(this.requestInitialData());
                }
            } catch (error) {
                // teardown 중 writer 가 이미 해제된 경우. 프로브는 실패해도 무시한다
                console.error(error);
            }
        }

        // 검증 실패 프레임이 연속되면 정체를 다시 묻는다.
        // 30프레임은 49.19fps 실측으로 0.61초다. 짧은 잡음은 애초에 불량
        // 프레임을 만들지 않고(실측: 무음이 된다) 0.6초 연속 불량은 실제 이상 신호다.
        reportInvalidFrame() {
            if (this.foreignAttached) {
                return; // 거부 상태에서는 프로브가 정체 라인을 다시 끌어와 반복된다
            }
            this.invalidFrameCount = (this.invalidFrameCount || 0) + 1;
            if (this.invalidFrameCount >= 30) {
                this.invalidFrameCount = 0;
                this.__probeIdentity();
            }
        }

        // 남의 주소가 찍힌 프레임이 연속되면 정체를 다시 묻는다.
        // 꼬리 주소는 기종을 알려주지 않는다. 다른 라쿤인지 타기종인지 구분이 안 되므로
        // 프로브로 정체 라인을 받아 기존 수용과 거부 경로(handleLocalData)에 태운다.
        // 임계가 재프로브와 같은 30(0.61초)인 것은 우연이 아니다. 보류 정체 TTL 이 60이라
        // 두 번째 프로브가 TTL 만료 전에 도착해 2회 확인 조건이 실제로 수렴한다.
        // 동글이 답하지 않으면 주소 관문만 남는다. 그래도 센서 오염은 계속 막힌다.
        reportForeignFrame() {
            this.foreignFrameCount = (this.foreignFrameCount || 0) + 1;
            if (this.foreignFrameCount >= 30) {
                this.foreignFrameCount = 0;
                this.__probeIdentity();
            }
        }

        // 포트 정리는 실패해도 핸드셰이크의 반환 계약(불리언)을 깨지 않는다.
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
                // 스트림 에러로 read 가 reject 해도 아래 정리 경로로 합류시킨다.
                // throw 로 빠지면 포트 정리가 건너뛰어져 "실패 시 포트 방치" 가 재발한다.
                console.error(error);
                identity = undefined;
            }
            clearTimeout(timer);
            if (!identity) {
                // 실패 시 코어는 포트를 닫지 않는다. 열린 포트가 방치되면 같은 동글은
                // port.open() InvalidStateError 로 새로고침 전까지 재연결이 불가능하다.
                await this.__closePort(serial);
                return false;
            }
            if (!this.acceptsIdentity(identity)) {
                // 정리를 먼저 한다. 토스트가 던지면 포트가 열린 채 남는다.
                await this.__closePort(serial);
                this.onRejectedAtConnect();
                return false;
            }
            this.onAcceptedIdentity(identity);
            this.setRobotIdentity(identity);
            this.__rearmDeviceSentinels();
            this.__resetSessionState();
            return true;
        }

        // ---------------- 디코드 ----------------

        _bumpId(jsonKey) {
            const next = ((this._json_counters[jsonKey] || 0) % 255) + 1;
            this._json_counters[jsonKey] = next;
            this.sensory[jsonKey] = next;
        }

        // 장치 2비트 순환 id 하나를 추적: 변경 시 JSON 카운터 증가.
        // (재)연결 후 첫 샘플은 방어(devKey를 -1로 시드).
        _trackId(devKey, jsonKey, id) {
            const prev = this._dev_ids[devKey];
            if (id != prev && prev != -1) {
                this._bumpId(jsonKey);
            }
            this._dev_ids[devKey] = id;
        }

        handleLocalData(data) {
            // 호출부 1) 정체 수신 경로.
            // 동글은 페어링 로봇이 바뀌어도 정체 라인을 다시 보내지 않는다.
            // 종전 이 주석은 재알림을 전제했으나 실측이 그렇지 않음을 보였다.
            // 타기종 프레임 6,150건이 들어오는 동안 정체 라인은 0건이었다. 전환 감지를
            // 이 경로에만 걸어 두면 놓친다. 실제 감지는 아래 주소 관문이 하고,
            // 이 경로는 그 관문이 띄운 프로브의 응답을 받는 자리다.
            const identity = this.parseIdentityData(data);
            if (identity) {
                // 거부 해제는 정체가 증명된 뒤에만 한다. 종전에는 이 자리에서 주소와
                // 무관하게 풀었고, 그러면 받는 기종의 정체 라인 한 줄로 foreignAttached 가
                // 즉시 풀려 2회 확인이 통째로 우회됐다. 라쿤은 주소 관문이 프레임마다 막아 주지만, 거부 상태가
                // 풀리면 프로브와 재확인 경로가 함께 열려 전환 판정이 흐트러진다.
                // 해제 자리를 둘로 옮겼다. 주소가 현재와 같을 때(아래 else), 그리고
                // 새 주소가 2회 확인을 통과했을 때다.
                if (identity.address !== this.address) {
                    const pending = this.pendingIdentity;
                    if (pending && pending.address === identity.address) {
                        this.pendingIdentity = undefined;
                        if (!this.acceptsIdentity(identity)) {
                            // 코어 teardown 은 부르지 않는다: disconnect() 는 작품에
                            // 저장된 하드웨어 선택까지 비운다.
                            this.onForeignRobot(identity);
                            return;
                        }
                        // 2회 확인을 통과했다. 이제 해제해도 된다.
                        // initialHandshake 와 같은 순서다(해제 후 정체 확정).
                        this.onAcceptedIdentity(identity);
                        this.setRobotIdentity(identity);
                        console.info('RaccoonLite: runtime robot identity switch', identity);
                        // setZero() 가 serial.update() 로 새 정체 기준의 정지 패킷을
                        // 즉시 1회 write 한다(의도된 동작).
                        this.setZero();
                        // 장치가 바뀌었으므로 순환 id 센티널을 원점으로 되돌린다.
                        // 같은 주소가 되돌아온 경우는 이 분기에 안 들어오므로
                        // 재무장하지 않는다(진행 중인 완료 대기 보호).
                        this.__rearmDeviceSentinels();
                    } else {
                        // 1회성 라인(노이즈)으로 주행 중 정지하지 않도록 동일 정체를
                        // 2회 확인한 뒤에만 전환한다.
                        // 60프레임은 49.19fps 실측으로 1.22초다.
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
                // 정체 라인을 받았으므로 주소 관문의 연속 카운트도 처음부터 다시 센다.
                // 2회 확인이 필요한 경우 다음 프로브는 30프레임 뒤이고 TTL 은 60이라
                // 만료 전에 두 번째 정체 라인이 도착한다. 전환이 수렴한다.
                this.foreignFrameCount = 0;
                return;
            }
            // TTL 감쇠는 아래 관문보다 앞이다. 뒤에 두면 거부 상태에서 보류 정체가
            // 영영 만료되지 않는다.
            if (this.pendingIdentity && --this.pendingIdentityTtl <= 0) {
                this.pendingIdentity = undefined;
            }
            // 호출부 2) 파싱 관문. 타기종 프레임도 53자라 헤더 관문을 통과한다.
            // 해석하면 센서값에 쓰레기가 들어간다.
            if (!this.shouldParseSensory()) {
                return;
            }
            const packet = String(data);
            // 길이 실패는 조용하다. 잘린 라인은 기종 불일치의 증거가 아니다.
            if (packet.length != 53) return; // 잘리거나 손상된 프레임 폐기
            // 손상 hex 프레임 방어: 손상된 바이트에서 parseInt는 NaN을 반환해 sensory.encoderN ->
            // 기구학을 조용히 오염시킨다. 이하 모든 parseInt가 숫자가 되도록, 파싱하는 40자
            // 데이터 구간을 검증한다.
            if (!/^[0-9A-Fa-f]{40}/.test(packet)) return;
            // 호출부 2)' 주소 관문. 프레임 꼬리에 보낸 로봇의 주소가 매 프레임 실려 온다
            // (`...ADCCBA-<장치주소>`, 실측 7,160프레임 전수). 위 2) 는 상태를
            // 보는 관문이라 정체 라인이 와서 깃발을 켜 줘야 돌지만, 이것은 프레임 자체를
            // 보므로 켜 줄 사람이 필요 없다. 동글이 재알림을 하지 않는다는 실측이 이 관문의
            // 존재 이유다. 남의 프레임을 라쿤 센서로 디코드하면 encoder4=1440° 같은
            // 한계 밖 값이 기구학과 위치 블록으로 흘러든다.
            if (this.address) {
                const tail = packet.slice(41);
                // 꼬리 상태에 따라 셋으로 갈린다.
                //   읽었고 내 주소   -> 통과. 연속 카운터를 되돌리고 꼬리 래치를 세운다
                //   읽었고 남의 주소 -> 남의 프레임. 카운터를 올리고 버린다
                //   못 읽음          -> 래치가 서 있을 때만 버린다
                //
                // 마지막 갈래가 미묘하다. 못 읽은 것을 남의 것으로 몰면 꼬리를 안 싣는
                // 스트림에서 정상 통신이 통째로 끊긴다. 그렇다고 디코드하면 주인을 확인하지
                // 못한 값이 기구학으로 들어간다. 종전에는 뒤쪽을 골라 디코드했는데, 그러면
                // 관문이 꼬리 형식 하나로 우회된다.
                //
                // 그래서 이 스트림이 꼬리를 싣는지를 먼저 배운다. 한 번이라도 제대로 읽으면
                // 래치가 서고, 그 뒤로 못 읽은 프레임은 이상 징후이므로 버린다. 래치가 서기
                // 전에는 종전대로 통과시킨다. 꼬리를 아예 안 쓰는 스트림은 래치가 서지 않아
                // 영향을 받지 않는다.
                if (packet[40] === '-' && /^[0-9A-Fa-f]{12}$/.test(tail)) {
                    if (tail.toUpperCase() !== this.address.toUpperCase()) {
                        this.reportForeignFrame();
                        return;
                    }
                    this.foreignFrameCount = 0;
                    this.tailSeen = true;
                } else if (this.tailSeen) {
                    return;
                }
            }
            // 호출부 3) 헤더 검사. 원본은 여기서 조용히 return 하는데, 호출을 넣지 않으면
            // reportInvalidFrame 이 호출부 0건이 되어 30프레임 재프로브 복구가 사라진다.
            if (parseInt(packet.slice(0, 1), 16) != 1) {
                this.reportInvalidFrame();
                return;
            }
            this.invalidFrameCount = 0;
            const sensory = this.sensory;
            let value;
            let id;

            // 인코더 (packet[2:18]): signed16 스텝 -> RAW 실수 degree. 범위 제한/정수 절삭 없음.
            sensory.encoder1 = this._signed16(packet.slice(2, 6)) * Module.STEP_TO_DEG;
            sensory.encoder2 = this._signed16(packet.slice(6, 10)) * Module.STEP_TO_DEG;
            sensory.encoder3 = this._signed16(packet.slice(10, 14)) * Module.STEP_TO_DEG;
            sensory.encoder4 = this._signed16(packet.slice(14, 18)) * Module.STEP_TO_DEG;

            // 상태 바이트 (packet[20:22])
            value = parseInt(packet.slice(20, 22), 16);
            sensory.warning = (value >> 7) & 0x01;
            sensory.moving = (value >> 6) & 0x01;
            this._trackId('jointState', 'jointStateId', (value >> 4) & 0x03);
            // soundState는 _sound_event로 추가 게이트: 이 모듈이 낸 소리의 완료만 노출한다.
            // 그렇지 않으면 두뇌의 반복 루프가 무관한 id 토글에 이중 발동한다.
            id = (value >> 2) & 0x03;
            if (this._sound_event == 1) {
                const prevSound = this._dev_ids.soundState;
                if (id != prevSound && prevSound != -1) {
                    this._sound_event = 0;
                    this._bumpId('soundStateId');
                }
            }
            this._dev_ids.soundState = id;
            sensory.chargeState = (value >> 1) & 0x01;

            // 충돌 바이트 (packet[22:24]): 2비트 순환 id, MSB부터 joint4..1
            value = parseInt(packet.slice(22, 24), 16);
            this._trackId('collision4', 'collision4Id', (value >> 6) & 0x03);
            this._trackId('collision3', 'collision3Id', (value >> 4) & 0x03);
            this._trackId('collision2', 'collision2Id', (value >> 2) & 0x03);
            this._trackId('collision1', 'collision1Id', value & 0x03);

            // 슬롯 디먹스 (packet[24:26] 상위 니블)
            value = parseInt(packet.slice(24, 26), 16);
            const slot = (value >> 4) & 0x0f;
            if (slot == 0) {
                // 버튼 (packet[26:28]): teach bit0, play bit1, delete bit3 (bit2 건너뜀)
                value = parseInt(packet.slice(26, 28), 16);
                sensory.teachButton = value & 0x01;
                sensory.playButton = (value >> 1) & 0x01;
                sensory.deleteButton = (value >> 3) & 0x01;
                // 클릭 (packet[28:30]): teach bits1-0, play bits3-2, delete bits7-6 (5-4 건너뜀)
                value = parseInt(packet.slice(28, 30), 16);
                this._trackId('teachClicked', 'teachClickedId', value & 0x03);
                this._trackId('playClicked', 'playClickedId', (value >> 2) & 0x03);
                this._trackId('deleteClicked', 'deleteClickedId', (value >> 6) & 0x03);
                // 롱프레스 (packet[30:32]): 클릭과 동일 레이아웃
                value = parseInt(packet.slice(30, 32), 16);
                this._trackId('teachLongPressed', 'teachLongPressedId', value & 0x03);
                this._trackId('playLongPressed', 'playLongPressedId', (value >> 2) & 0x03);
                this._trackId('deleteLongPressed', 'deleteLongPressedId', (value >> 6) & 0x03);
                // 신호 세기 (packet[36:38])
                value = parseInt(packet.slice(36, 38), 16);
                sensory.signalStrength = value - 0x100;
                // 배터리 (packet[38:40]) -> 전압 -> 3단계 상태 (삐오의 4단계와 다름)
                value = parseInt(packet.slice(38, 40), 16);
                value = (value + 200) / 100.0;
                let state = 2;
                if (value < 3.25) state = 0;
                else if (value < 3.45) state = 1;
                sensory.batteryState = state;
            } else if (slot == 1) {
                this._readSlot(packet, sensory.slotR1);
                this._bumpId('slotR1Id');
            } else if (slot == 2) {
                this._readSlot(packet, sensory.slotR2);
                this._bumpId('slotR2Id');
            } else if (slot == 3) {
                this._readSlot(packet, sensory.slotR3);
                this._bumpId('slotR3Id');
            }

            // 말미. 설치형에서는 afterReceive 가 sensory 를 받아 handleSensory 를 불렀다.
            // lite 에는 브리지가 없어 그 한 줄이 여기로 온다. 폐기가 그냥 삭제가 되지 않게
            // 하는 불변식 보전이다.
            //
            // 순서를 바꾸지 마라. handleSensory() 가 머리에서 clearEvent() 를 돌리므로
            // hasButtonEvent() 는 반드시 그 뒤다. 앞에 두면 직전 프레임의 엣지를 읽는다.
            // 발화 이름은 블록 정의의 `event:` 필드와 같은 문자열이어야 한다.
            // 햇이 둘이다. 본체 버튼과 컨베이어 버튼. 삐오는 하나였다.
            this.handleSensory();
            if (this.hasButtonEvent()) {
                Entry.engine.fireEvent('raccoonliteWhenButtonState');
            }
            if (this.hasConveyorButtonEvent()) {
                Entry.engine.fireEvent('raccoonliteConveyorWhenButtonState');
            }
        }

        // 슬롯 페이로드 (packet[24:40]): [0]의 슬롯 헤더 바이트 포함 8바이트
        _readSlot(packet, out) {
            for (let i = 0; i < 8; ++i) {
                out[i] = parseInt(packet.slice(2 * i + 24, 2 * i + 26), 16);
            }
        }

        // ---------------- 블록 계층 수신 ----------------

        _copySlot(src, dst) {
            if (!src || src.length === undefined) return;
            for (let i = 0; i < 8; ++i) {
                let v = parseInt(src[i]);
                if (isNaN(v)) v = 0;
                // 슬롯 선언 범위 -128..255: 범위 밖 슬롯 바이트는 &0xff 마스크가 아니라 CLAMP한다.
                // 300은 실제 장치처럼 0x2C가 아닌 0xFF로 나가야 한다.
                if (v < -128) v = -128;
                else if (v > 255) v = 255;
                dst[i] = v;
            }
        }

        // 원본 Module.prototype.handleRemoteData 에서 필드복사 루프만 뺀 것.
        // 인자가 없다. 설치형에서 그 루프는 IPC 로 건너온 sendQueue 를 this.motoring 으로
        // 옮기는 일이었는데 lite 는 프로세스가 하나여서 블록 계층이 this.motoring 에 직접 쓴다.
        // 원본의 requestRemoteData(handler.write 루프)도 같은 이유로 폐기했다. 코어가 부르는
        // 것은 requestLocalData 와 handleLocalData 뿐이고 handler 자체가 없다.
        // 남은 priming 패스와 연속값 복사, id 엣지 래칭은 원본 순서 그대로다.
        __latchCommands() {
            const m = this.motoring;

            // 재연결 전용 priming 패스: reset() 후 _primed=false일 때만 실행된다(최초 연결은
            // _init의 _primed=true라 여기 진입하지 않고 0 시드에서 첫 명령이 바로 발동).
            // 재연결 첫 프레임에서는 유지된 현재 id를 기준선으로 채택하고 아무것도 발동하지
            // 않아 stale id 오발동을 막는다. 진짜 새 명령(id 변경)이 오면 그때 발동한다.
            if (!this._primed) {
                this._primed = true;
                this._prev_jointAngleId = m.jointAngleId;
                this._prev_noteId = m.noteId;
                this._prev_soundId = m.soundId;
                this._prev_slotW1Id = m.slotW1Id;
                this._prev_slotW2Id = m.slotW2Id;
                this._prev_slotW3Id = m.slotW3Id;
            }

            // 연속 값: 매 주기 복사(이펙터 의미). 의도적 비대칭에 유의: jointMode는 매 주기 읽는
            // 실시간 필드이고, jointAngle은 아래 jointAngleId로 게이트되는 고정 명령이다.
            // 통합하지 말 것 - 두뇌가 항상 jointModeId와 jointAngleId를 한 배치로 함께 보낸다.
            this._joint_velocity[0] = m.jointVelocity1;
            this._joint_velocity[1] = m.jointVelocity2;
            this._joint_velocity[2] = m.jointVelocity3;
            this._joint_velocity[3] = m.jointVelocity4;
            this._joint_speed = m.jointSpeed;
            this._joint_mode = m.jointMode;

            // 관절 각도 (id 변경 시에만 기록). 송신 사이의 여러 id 증가는 한 번의 encoder id
            // 증가로 합쳐진다(송신당 한 번 인코드).
            if (m.jointAngleId != this._prev_jointAngleId) {
                this._prev_jointAngleId = m.jointAngleId;
                this._joint_angle[0] = m.jointAngle1;
                this._joint_angle[1] = m.jointAngle2;
                this._joint_angle[2] = m.jointAngle3;
                this._joint_angle[3] = m.jointAngle4;
                this._joint_angle_written = true;
            }

            // 음 / 소리 (id 변경 시에만 기록)
            if (m.noteId != this._prev_noteId) {
                this._prev_noteId = m.noteId;
                this._note = m.note;
                this._note_written = true;
            }
            if (m.soundId != this._prev_soundId) {
                this._prev_soundId = m.soundId;
                this._sound = Module.SOUNDS[m.sound] !== undefined ? m.sound : 0;
                this._sound_written = true;
            }

            // 슬롯 쓰기 (id 변경 시 배열 복사, 어느 경우든 4번째 패킷마다 전송)
            if (m.slotW1Id != this._prev_slotW1Id) {
                this._prev_slotW1Id = m.slotW1Id;
                this._copySlot(m.slotW1, this._slot_w1);
            }
            if (m.slotW2Id != this._prev_slotW2Id) {
                this._prev_slotW2Id = m.slotW2Id;
                this._copySlot(m.slotW2, this._slot_w2);
            }
            if (m.slotW3Id != this._prev_slotW3Id) {
                this._prev_slotW3Id = m.slotW3Id;
                this._copySlot(m.slotW3, this._slot_w3);
            }
        }

        // ---------------- 인코드 (motoring -> 장치) ----------------

        requestLocalData() {
            this.__latchCommands();
            let result;
            let i;
            const mode = this._joint_mode;

            if (mode == 1 || mode == 4 || mode == 5) {
                // 각도 모드: 헤더 + angleId + step16 4개 + speed + 00
                result = mode == 4 ? '1C' : mode == 5 ? '1D' : '11';
                if (this._joint_angle_written) {
                    this._joint_angle_id = (this._joint_angle_id % 255) + 1;
                }
                this._joint_angle_written = false;
                result += this.toHex(this._joint_angle_id);
                for (i = 0; i < 4; ++i) {
                    result += this.toHex2(this._degToStep(i, this._joint_angle[i]));
                }
                result += this.toHex(this._verifySpeed(this._joint_speed));
                result += '00';
            } else {
                // 속도 모드: 0/2/3과 알 수 없는 값은 모두 여기로
                result = mode == 2 ? '1A' : mode == 3 ? '1B' : '10';
                for (i = 0; i < 4; ++i) {
                    result += this.toHex(this._verifyVelocity(this._joint_velocity[i]));
                }
                result += '00000000000000';
            }

            // 슬롯 순환: -1 시드 -> 첫 패킷은 SLOT0
            this._packet_sent = (this._packet_sent + 1) % 4;
            if (this._packet_sent == 0) {
                result += '0000000000';
                const temp = Module.SOUNDS[this._sound] || 0;
                if (this._note_written || this._sound_written) {
                    this._sound_id = (this._sound_id % 255) + 1;
                }
                if (this._sound_written) {
                    // 소리가 들리는 경우에만 디코드 쪽 완료 게이트를 켠다
                    this._sound_event = temp > 0 ? 1 : 0;
                }
                result += this.toHex(this._sound_id);
                if (temp > 0) {
                    result += this.toHex(temp + 128);
                } else if (this._note > 0) {
                    result += this.toHex(this._note & 0x7f);
                } else {
                    result += '00';
                }
                this._note_written = false;
                this._sound_written = false;
                result += '00';
            } else if (this._packet_sent == 1) {
                for (i = 0; i < 8; ++i) result += this.toHex(this._slot_w1[i]);
            } else if (this._packet_sent == 2) {
                for (i = 0; i < 8; ++i) result += this.toHex(this._slot_w2[i]);
            } else {
                for (i = 0; i < 8; ++i) result += this.toHex(this._slot_w3[i]);
            }

            result += '-';
            result += this.address;
            result += '\r';
            return result;
        }

        // ---------------- 로봇 계층 내부 함수 (목록 C1) ----------------

        __cancelJointAngle() {
            // 중단이다. 완료가 아니다. 완료 경로(handleSensory)와 정밀 이어달리기는
            // 이 함수를 쓰지 않고 angleCallback 만 직접 비운다. 그쪽은 대기를 끝내면 안 된다.
            // angleCallback 은 이어달리기를 들 수 있으므로 절대 부르지 않는다.
            // 최종 완료는 angleDone 이 들고, 그것만 해소한다.
            this.angleCallback = undefined;
            this.__resolvePending('angleDone');
        }

        __checkJointMode(mode) {
            if (mode == this.JOINT_MODE_VELOCITY) {
                if (
                    this.jointMode == this.JOINT_MODE_VELOCITY_HORZ ||
                    this.jointMode == this.JOINT_MODE_ANGLE_HORZ
                ) {
                    this.jointMode = this.JOINT_MODE_VELOCITY_HORZ;
                } else if (
                    this.jointMode == this.JOINT_MODE_VELOCITY_VERT ||
                    this.jointMode == this.JOINT_MODE_ANGLE_VERT
                ) {
                    this.jointMode = this.JOINT_MODE_VELOCITY_VERT;
                } else {
                    this.jointMode = this.JOINT_MODE_VELOCITY;
                }
            } else if (mode == this.JOINT_MODE_ANGLE) {
                if (
                    this.jointMode == this.JOINT_MODE_ANGLE_HORZ ||
                    this.jointMode == this.JOINT_MODE_VELOCITY_HORZ
                ) {
                    this.jointMode = this.JOINT_MODE_ANGLE_HORZ;
                } else if (
                    this.jointMode == this.JOINT_MODE_ANGLE_VERT ||
                    this.jointMode == this.JOINT_MODE_VELOCITY_VERT
                ) {
                    this.jointMode = this.JOINT_MODE_ANGLE_VERT;
                } else {
                    this.jointMode = this.JOINT_MODE_ANGLE;
                }
            }
            return this.jointMode;
        }

        __removeTimeout(id) {
            clearTimeout(id);
            const idx = this.timeouts.indexOf(id);
            if (idx >= 0) {
                this.timeouts.splice(idx, 1);
            }
        }

        // 취소될 때 대기 블록에 완료를 알린다. 알리지 않으면 블록이 완료 표시를 기다리며
        // 영원히 폴링한다(화면에 오류가 없어 "블록이 안 넘어가요" 로만 보고된다).
        // 먼저 비우고 부른다. 콜백 안에서 다시 취소가 걸려도 두 번 불리지 않게.
        //
        // 최종 완료만 걸어야 한다. 손잡이가 이어달리기를 들고 있으면 이 호출이
        // 취소 중에 새 명령을 발행한다.
        __resolvePending(key) {
            const done = this[key];
            if (done) {
                this[key] = undefined;
                done();
            }
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

        // ---------------- 취소와 완료의 계약 ----------------
        //
        // `__cancel*` 은 상태만 비운다. 알리지 않는다.
        // `__finish*` 은 손잡이를 먼저 꺼내고, `__cancel*` 로 상태를 정리한 뒤, 마지막에 알린다.
        // 정리가 끝난 뒤에 알려야 콜백이 새 명령을 내도 그 상태가 곧바로 지워지지 않는다.
        //
        // 손잡이는 인스턴스당 한 칸이고 소유자 표식이 없다. 그래서 호출부를 다음 둘로 가른다.
        //
        //   밀려나는 소유자가 생기는 자리 -> `__finish*`
        //     새 명령이 앞 명령을 대체하거나(새 음 내기, 컨베이어 속도 정하기) 진짜로 멈춘다.
        //     어느 쪽이든 앞 대기는 실제로 끝났다. 로봇이 그 동작을 더 하지 않으므로
        //     완료 신호가 영영 오지 않는다. 안 깨우면 그 블록은 완료 표시를 기다리며 영원히
        //     폴링한다(화면에 오류가 없어 "블록이 안 넘어가요" 로만 보고된다).
        //
        //   깨울 소유자가 없는 자리 -> `__cancel*`
        //     `__finish*` 자신의 내부 정리, 그리고 세션 초기화(`setZero` 는 손잡이를 직접 해소한다).
        //
        // 한 방향으로 통일하면 반대편이 깨진다. 전부 알리게 하면 `__finish*` 이 이중 호출되고,
        // 전부 안 알리게 하면 정지가 hang 된다. 가르는 축은 "덮어쓰기냐 취소냐" 가 아니라
        // "밀려나는 소유자가 있느냐" 다.
        //
        // 관절각(`angleDone`)과 그리퍼(`ioCallback`)는 이름 규칙 밖이지 정책 밖이 아니다.
        // 둘은 `__finish*` 래퍼를 갖지 않는다. 그러나 밀려난 소유자를 깨우는 정책 자체는
        // 이미 지키고 있고, 그 일을 하는 것은 덮어쓰는 쪽의 `__resolvePending` 과
        // `setZero` 다. 관절각은 `__anglesCore` 가 손잡이를 걸기 직전에
        // `__cancelJointAngle()` 을 거쳐 해소하고(그 함수는 이름이 `__cancel*` 인데도
        // 알린다), 그리퍼는 `returnToBasicPose` 와 `withGripper` 가 진입부에서 직접 해소한다.
        //
        // 자기소유 가드(`if (this.angleDone === done)` 와 `if (this.ioCallback === done)`)를
        // 그 역할로 읽으면 안 된다. 그것은 반대 방향 장치다. 내 완료가 이미 남에게 넘어간
        // 손잡이를 지우지 못하게 막을 뿐이고, 아무도 깨우지 않는다.
        //
        // 그러므로 `__cancel` 로 grep 해서 "안 알리는 것" 을 고르면 `__cancelJointAngle` 을
        // 잘못 분류한다(`__cancelIo` 는 실제로 안 알리므로 바르게 분류된다).
        // 위 규칙은 이 파일의 소리, 음표, 컨베이어 넷에 대한 것이고, 관절각과 그리퍼는
        // 그 앞에 자리 잡은 다른 구현이다. 이름을 맞추려다 해소 위치를 옮기면
        // `angleCallback` 이 든 이어달리기가 취소 중에 팔 명령을 낸다. 그래서 그대로 둔다.
        //
        // `__cancelIo` 만 자기 손잡이를 안 지우는 것도 같은 이유다. `returnToBasicPose` 가
        // 거기에 이어달리기를 넘기므로 덮어쓰는 쪽에서 푼다. 새 `__withGripperInternal`
        // 호출부를 더할 때는 진입부에 `__resolvePending('ioCallback')` 을 반드시 같이 넣는다.
        //
        // 세션 초기화(`__resetSessionState`)는 이 계약 밖이다. 거기서는 손잡이가 죽은
        // script 를 가리키므로 `__cancel*` 도 거치지 않고 해소 없이 버린다.
        __finishNote() {
            const cb = this.noteCallback;
            this.__cancelNote();
            if (cb) cb();
        }

        __finishSound() {
            const cb = this.soundCallback;
            this.__cancelSound();
            if (cb) cb();
        }

        __conveyorFinishDistance() {
            const cb = this.conveyor.distanceCallback;
            this.__conveyorCancelDistance();
            if (cb) cb();
        }

        __conveyorFinishMoving() {
            const cb = this.conveyorMovingCallback;
            this.__conveyorCancelMoving();
            if (cb) cb();
        }

        __cancelSoundTimeout() {
            if (this.soundTimeoutTimer !== undefined) {
                this.__removeTimeout(this.soundTimeoutTimer);
                this.soundTimeoutTimer = undefined;
            }
        }

        __cancelSound() {
            this.soundCallback = undefined;
            this.__cancelSoundTimeout();
        }

        __checkSoundPlaying() {
            this.noting = this.motoring.note != 0;
            this.resting = false;
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

        __setNote(note) {
            this.motoring.note = note;
            this.motoring.noteId = (this.motoring.noteId % 255) + 1;
        }

        __errorSound() {
            this.__finishNote();
            this.__finishSound();
            this.__setNote(0);
            this.__runSound(127, 1);
            this.__checkSoundPlaying();
        }

        __canTrustEncoders() {
            const s = this.sensory;
            const e = [s.encoder1, s.encoder2, s.encoder3, s.encoder4];
            // 설치형은 afterReceive 가 sensory 를 통째로 교체해 생성자 기본값이 남지 않았다.
            // lite 는 그 교체가 없고 프레임 계층이 같은 객체에 제자리로 쓰므로 33키가 항상 있다.
            // 그래도 가드를 남긴다. 값이 비수치로 들어오면 _degToStep -> toHex2 가 NaN 을 0 으로
            // 접어 네 관절 모두 0도로 명령된다(3번 관절은 0도가 가동 끝이다).
            if (!e.every(Number.isFinite)) return false;
            // 유효 패킷을 아직 못 받았으면 entry-hw raccoon.js의 기본값 0이 그대로 온다(손상 프레임은
            // 조기 반환, 재연결 시 reset()이 0으로 되돌림). 네 값이 정확히 0이면 측정 전으로 본다.
            // 실제로 네 관절이 0인 경우를 걸러도 기존 동작으로 돌아갈 뿐이라 무해하다.
            if (e[0] === 0 && e[1] === 0 && e[2] === 0 && e[3] === 0) return false;
            return true;
        }

        __seedStaleJointAngles() {
            if (!this.__canTrustEncoders()) return;
            const sensory = this.sensory;
            const motoring = this.motoring;
            const stale = this.jointAngleStale;
            for (let i = 1; i <= 4; ++i) {
                if (!stale[i - 1]) continue;
                motoring['jointAngle' + i] = Math.round(sensory['encoder' + i] * 100) / 100;
                stale[i - 1] = false;
            }
        }

        __setJointMode(mode) {
            this.motoring.jointMode = mode;
            this.motoring.jointModeId = (this.motoring.jointModeId % 255) + 1;
        }

        __setJointVelocity(joint, vel) {
            // 전체 관절 기본 분기는 명시적 ALL(-1) 센티널 전용이다. 알 수 없는 드롭다운
            // 값(손상된 프로젝트나 OPT_JOINT 불일치)이 네 관절을 모두 움직여선 안 된다.
            if (joint === undefined) return;
            let motoringVel;
            if (vel == 127) {
                motoringVel = 127;
                vel = 0;
            } else {
                if (vel < -100) vel = -100;
                else if (vel > 100) vel = 100;
                motoringVel = vel;
            }
            const motoring = this.motoring;
            switch (joint) {
                case 1:
                    motoring.jointVelocity1 = motoringVel;
                    this.jointVelocity1 = vel;
                    break;
                case 2:
                    motoring.jointVelocity2 = motoringVel;
                    this.jointVelocity2 = vel;
                    break;
                case 3:
                    motoring.jointVelocity3 = motoringVel;
                    this.jointVelocity3 = vel;
                    break;
                case 4:
                    motoring.jointVelocity4 = motoringVel;
                    this.jointVelocity4 = vel;
                    break;
                default:
                    motoring.jointVelocity1 = motoringVel;
                    motoring.jointVelocity2 = motoringVel;
                    motoring.jointVelocity3 = motoringVel;
                    motoring.jointVelocity4 = motoringVel;
                    this.jointVelocity1 = vel;
                    this.jointVelocity2 = vel;
                    this.jointVelocity3 = vel;
                    this.jointVelocity4 = vel;
                    break;
            }
        }

        __warnUnreachablePose() {
            if (this.unreachablePoseWarned) return;
            // 가드를 플래그보다 먼저 본다(__warnLimit 주석 참고). 명령 건너뛰기 자체는 그래도 동작한다.
            if (!Entry.toast) return;
            if (
                typeof Lang === 'undefined' ||
                !Lang.Msgs ||
                !Lang.Msgs.raccoonlite_unreachable_pose
            )
                return;
            this.unreachablePoseWarned = true;
            Entry.toast.warning(
                Lang.Msgs.raccoonlite_unreachable_pose_title,
                Lang.Msgs.raccoonlite_unreachable_pose
            );
        }

        __anglesCore(wait, canFn, applyFn, callback) {
            // 진행 중 콜백 취소도 전송 경로 안에서 한다. 거부된 명령이 취소하면, 다른 스크립트가
            // 기다리던 각도 이동의 완료 콜백이 사라져 그 스크립트가 영원히 끝나지 않는다.
            // 완료 처리(handleSensory)가 angleCallback 존재를 게이트로 쓰므로 완료 정리도 함께
            // 건너뛰어, 로봇이 각도 모드에 갇힌다.
            // 모드 전환, 속도 초기화, 실측 채우기도 같은 이유로 canFn 통과 후에 한다.
            //
            // entry-hw는 jointMode를 id 게이트 없이 매 주기 읽는다(raccoon.js handleRemoteData의
            // 의도적 비대칭). 그래서 각도 모드로 바꾸는 순간, 아직 새 각도를 싣지 않았어도 다음
            // 프레임이 마지막으로 latch된 네 관절 값을 그대로 내보낸다. 장치는 그 값으로 서보하므로
            // 거부된 명령이 팔을 이전 자세로 튀게 만든다. 전원 끄기로 처진 팔이 직전
            // 각도로 돌아간다.
            //
            // 속도도 같이 미룬다. 각도 모드에서는 속도가 프레임에 실리지 않지만, 모드 전환을
            // 미루면 거부 경로가 속도 모드로 남으므로 여기서 0을 쓰면 전원 끄기(127)를 덮어
            // 팔에 다시 힘이 들어간다.
            // 최종 완료를 한 겹 싸서 angleDone 에 건다. 취소는 이것만 해소한다.
            const done = () => {
                // 자기 것일 때만 비운다. 무조건 비우면 거부 경로(canFn 실패)의 done() 이
                // 다른 스레드가 기다리는 angleDone 을 지워 그 블록이 영원히 멈춘다.
                // 도달 불가 좌표는 흔한 사용자 실수라 이 경로가 자주 밟힌다.
                if (this.angleDone === done) {
                    this.angleDone = undefined;
                }
                callback();
            };
            if (canFn()) {
                this.__cancelJointAngle();
                this.__setJointMode(this.__checkJointMode(this.JOINT_MODE_ANGLE));
                this.__setJointVelocity(-1, 0);
                // 채우기도 전송 경로 전용이다. entry-hw는 jointAngleId가 바뀔 때만 네 관절 값을
                // latch하고 id를 올리는 것은 applyFn뿐이라, 거부 경로에서 채우면 플래그만 소진돼
                // 다음 명령이 낡은 버퍼를 그대로 내보낸다.
                this.__seedStaleJointAngles();
                applyFn();
                if (wait) {
                    // 정밀 모드든 아니든 이 블록은 지금부터 기다린다. 취소가 깨울 수 있게 건다.
                    this.angleDone = done;
                }
                if (this.precisionMode == 1) {
                    this.angleCallback = () => {
                        // 자기 단계 정리다. __cancelJointAngle 을 쓰면 angleDone 이 해소돼
                        // 정밀 보정이 시작되기도 전에 블록이 끝난다.
                        this.angleCallback = undefined;
                        // 본 경로와 같은 이유로 전송 경로에서만 모드를 바꾼다. 이 콜백은 완료 처리부에서
                        // 불리는데 거기서 이미 속도 모드 + 속도 0으로 돌려놨다. 재확인이 실패하면
                        // 그 상태를 그대로 두는 것이 맞다.
                        if (canFn()) {
                            this.__setJointMode(this.__checkJointMode(this.JOINT_MODE_ANGLE));
                            this.__setJointVelocity(-1, 0);
                            applyFn();
                            if (wait) {
                                this.angleCallback = done;
                            }
                        } else if (wait) {
                            // 재확인이 실패하면 기다리는 블록을 끝낸다. 이 분기가 없으면
                            // angleCallback 이 이미 비워진 상태라 아무도 블록을 깨우지 못해
                            // 스크립트가 영구 정지한다.
                            // 경고음과 안내는 내지 않는다. 1차 통과로 팔은 이미 움직였고,
                            // "블록을 건너뛰었습니다" 는 사실이 아니다. 정밀 보정만 못 한 것이다.
                            done();
                        }
                    };
                    if (!wait) done();
                } else if (wait) {
                    this.angleCallback = done;
                } else {
                    done();
                }
            } else {
                this.__errorSound();
                this.__warnUnreachablePose();
                done();
            }
        }

        __armSoundTimeout() {
            // 타임아웃 가드: 장치 soundState가 이미 완료된 채로 시작되면 play-and-wait가
            // 멈출 수 있으므로 이 타임아웃으로 대기 시간을 제한한다.
            this.__cancelSoundTimeout();
            const timer = setTimeout(() => {
                this.soundTimeoutTimer = undefined;
                this.__removeTimeout(timer);
                const callback = this.soundCallback;
                this.currentSound = 0;
                this.soundRepeat = 1;
                this.sounding = false;
                this.soundCallback = undefined;
                this.__checkSoundPlaying();
                if (callback) callback();
            }, this.__SOUND_TIMEOUT_MS);
            this.soundTimeoutTimer = timer;
            this.timeouts.push(timer);
        }

        __buttonEventFlag(button, state) {
            switch (button) {
                case 'TEACH':
                    switch (state) {
                        case 'PRESSED':
                            return this.teachPressed;
                        case 'RELEASED':
                            return this.teachReleased;
                        case 'CLICKED':
                            return this.teachClicked;
                        case 'LONG_PRESSED':
                            return this.teachLongPressed;
                    }
                    break;
                case 'PLAY':
                    switch (state) {
                        case 'PRESSED':
                            return this.playPressed;
                        case 'RELEASED':
                            return this.playReleased;
                        case 'CLICKED':
                            return this.playClicked;
                        case 'LONG_PRESSED':
                            return this.playLongPressed;
                    }
                    break;
                case 'DELETE':
                    switch (state) {
                        case 'PRESSED':
                            return this.deletePressed;
                        case 'RELEASED':
                            return this.deleteReleased;
                        case 'CLICKED':
                            return this.deleteClicked;
                        case 'LONG_PRESSED':
                            return this.deleteLongPressed;
                    }
                    break;
            }
            return false;
        }

        __canChangeFourJointAnglesToTargets(deg1, deg2, deg3, deg4, t1, t2, t3, t4) {
            if (deg1 == 0 && deg2 == 0 && deg3 == 0 && deg4 == 0) return true;
            if (t1 < -120 || t1 > 120) return false;
            if (t2 < -90 || t2 > 30) return false;
            if (t3 < -150 || t3 > 0) return false;
            if (t4 < -105 || t4 > 105) return false;
            return true;
        }

        __canChangeJointAngleToTargets(joint, deg, t1, t2, t3, t4) {
            if (deg == 0) return true;
            switch (joint) {
                case 1:
                    if (t1 < -120 || t1 > 120) return false;
                    break;
                case 2:
                    if (t2 < -90 || t2 > 30) return false;
                    break;
                case 3:
                    if (t3 < -150 || t3 > 0) return false;
                    break;
                case 4:
                    if (t4 < -105 || t4 > 105) return false;
                    break;
                default:
                    return this.__canChangeFourJointAnglesToTargets(
                        deg,
                        deg,
                        deg,
                        deg,
                        t1,
                        t2,
                        t3,
                        t4
                    );
            }
            return true;
        }

        __canSetFourJointAngles(deg1, deg2, deg3, deg4) {
            if (deg1 < -120 || deg1 > 120) return false;
            if (deg2 < -90 || deg2 > 30) return false;
            if (deg3 < -150 || deg3 > 0) return false;
            if (deg4 < -105 || deg4 > 105) return false;
            return true;
        }

        __canSetJointAngle(joint, deg) {
            switch (joint) {
                case 1:
                    if (deg < -120 || deg > 120) return false;
                    break;
                case 2:
                    if (deg < -90 || deg > 30) return false;
                    break;
                case 3:
                    if (deg < -150 || deg > 0) return false;
                    break;
                case 4:
                    if (deg < -105 || deg > 105) return false;
                    break;
                default:
                    return this.__canSetFourJointAngles(deg, deg, deg, deg);
            }
            return true;
        }

        __cancelIo() {
            this.ioId = 0;
            if (this.ioTimer !== undefined) {
                this.__removeTimeout(this.ioTimer);
            }
            this.ioTimer = undefined;
        }

        __cancelResetTimeout() {
            if (this.resetTimer !== undefined) {
                this.__removeTimeout(this.resetTimer);
                this.resetTimer = undefined;
            }
        }

        __clearJointStale(joint) {
            // __markJointStale과 같은 계약. 지우기는 "버퍼가 권위 있다"는 주장이므로 알 수 없는
            // 값에 네 개를 지우면 안 된다(표시는 중복 재시드 1회로 끝나지만 지우기는 결함이 된다).
            if (joint === undefined) return;
            const stale = this.jointAngleStale;
            if (joint >= 1 && joint <= 4) stale[joint - 1] = false;
            else stale[0] = stale[1] = stale[2] = stale[3] = false;
        }

        __changeJointAngleToTargets(joint, t1, t2, t3, t4) {
            this.resetting = false;
            const motoring = this.motoring;
            switch (joint) {
                case 1:
                    motoring.jointAngle1 = t1;
                    break;
                case 2:
                    motoring.jointAngle2 = t2;
                    break;
                case 3:
                    motoring.jointAngle3 = t3;
                    break;
                case 4:
                    motoring.jointAngle4 = t4;
                    break;
                default:
                    motoring.jointAngle1 = t1;
                    motoring.jointAngle2 = t2;
                    motoring.jointAngle3 = t3;
                    motoring.jointAngle4 = t4;
                    break;
            }
            this.__clearJointStale(joint);
            motoring.jointAngleId = (motoring.jointAngleId % 255) + 1;
        }

        __changeAngleUntil(wait, joint, deg, callback) {
            deg = parseFloat(deg);
            if (isNaN(deg) || joint === undefined) {
                callback();
                return;
            }
            const s = this.sensory;
            const t1 = s.encoder1 + deg;
            const t2 = s.encoder2 + deg;
            const t3 = s.encoder3 + deg;
            const t4 = s.encoder4 + deg;
            this.__anglesCore(
                wait,
                () => this.__canChangeJointAngleToTargets(joint, deg, t1, t2, t3, t4),
                () => this.__changeJointAngleToTargets(joint, t1, t2, t3, t4),
                callback
            );
        }

        __changeFourJointAnglesToTargets(t1, t2, t3, t4) {
            this.resetting = false;
            const motoring = this.motoring;
            motoring.jointAngle1 = t1;
            motoring.jointAngle2 = t2;
            motoring.jointAngle3 = t3;
            motoring.jointAngle4 = t4;
            this.__clearJointStale(-1);
            motoring.jointAngleId = (motoring.jointAngleId % 255) + 1;
        }

        __changeAnglesUntil(wait, deg1, deg2, deg3, deg4, callback) {
            deg1 = parseFloat(deg1);
            deg2 = parseFloat(deg2);
            deg3 = parseFloat(deg3);
            deg4 = parseFloat(deg4);
            if (isNaN(deg1) || isNaN(deg2) || isNaN(deg3) || isNaN(deg4)) {
                callback();
                return;
            }
            const s = this.sensory;
            const t1 = s.encoder1 + deg1;
            const t2 = s.encoder2 + deg2;
            const t3 = s.encoder3 + deg3;
            const t4 = s.encoder4 + deg4;
            this.__anglesCore(
                wait,
                () =>
                    this.__canChangeFourJointAnglesToTargets(
                        deg1,
                        deg2,
                        deg3,
                        deg4,
                        t1,
                        t2,
                        t3,
                        t4
                    ),
                () => this.__changeFourJointAnglesToTargets(t1, t2, t3, t4),
                callback
            );
        }

        __setFourJointVelocities(vel1, vel2, vel3, vel4) {
            if (vel1 < -100) vel1 = -100;
            else if (vel1 > 100) vel1 = 100;
            if (vel2 < -100) vel2 = -100;
            else if (vel2 > 100) vel2 = 100;
            if (vel3 < -100) vel3 = -100;
            else if (vel3 > 100) vel3 = 100;
            if (vel4 < -100) vel4 = -100;
            else if (vel4 > 100) vel4 = 100;
            const motoring = this.motoring;
            motoring.jointVelocity1 = vel1;
            motoring.jointVelocity2 = vel2;
            motoring.jointVelocity3 = vel3;
            motoring.jointVelocity4 = vel4;
            this.jointVelocity1 = vel1;
            this.jointVelocity2 = vel2;
            this.jointVelocity3 = vel3;
            this.jointVelocity4 = vel4;
        }

        __changeFourJointVelocities(vel1, vel2, vel3, vel4) {
            this.__setFourJointVelocities(
                vel1 + this.jointVelocity1,
                vel2 + this.jointVelocity2,
                vel3 + this.jointVelocity3,
                vel4 + this.jointVelocity4
            );
        }

        __changeJointVelocity(joint, vel) {
            if (joint === undefined) return; // __setJointVelocity 참고
            if (joint >= 1 && joint <= 4) {
                const cache = [
                    'jointVelocity1',
                    'jointVelocity2',
                    'jointVelocity3',
                    'jointVelocity4',
                ][joint - 1];
                vel += this[cache];
                if (vel < -100) vel = -100;
                else if (vel > 100) vel = 100;
                this.motoring[cache] = vel;
                this[cache] = vel;
            } else {
                this.__changeFourJointVelocities(vel, vel, vel, vel);
            }
        }

        __warnDelay() {
            if (this.delayWarned) return;
            if (!Entry.toast) return;
            if (typeof Lang === 'undefined' || !Lang.Msgs || !Lang.Msgs.raccoonlite_delay_too_long)
                return;
            this.delayWarned = true;
            Entry.toast.warning(
                Lang.Msgs.raccoonlite_delay_too_long_title,
                Lang.Msgs.raccoonlite_delay_too_long
            );
        }

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

        __issueIoId() {
            this.ioId = this.blockId = (this.blockId % 65535) + 1;
            return this.ioId;
        }

        __issueNoteId() {
            this.noteId = this.blockId = (this.blockId % 65535) + 1;
            return this.noteId;
        }

        __issueSlotW1() {
            this.motoring.slotW1Id = (this.motoring.slotW1Id % 255) + 1;
        }

        __issueSlotW2() {
            this.motoring.slotW2Id = (this.motoring.slotW2Id % 255) + 1;
        }

        __issueSlotW3() {
            this.motoring.slotW3Id = (this.motoring.slotW3Id % 255) + 1;
        }

        __markJointStale(joint) {
            if (joint === undefined) return;
            const stale = this.jointAngleStale;
            if (joint >= 1 && joint <= 4) stale[joint - 1] = true;
            else stale[0] = stale[1] = stale[2] = stale[3] = true;
        }

        __noteValue(script) {
            const note = this.__NOTES[script.getField('NOTE')];
            let octave = parseInt(script.getField('OCTAVE'));
            if (note && octave && octave > 0 && octave < 8) {
                octave %= 7;
                if (octave == 0) octave = 7;
                return note + (octave - 1) * 12;
            }
            return 0;
        }

        __playSoundCore(sound, count, wait, callback) {
            this.__finishNote();
            this.__finishSound();
            this.__setNote(0);
            if (sound && count) {
                this.__runSound(sound, count);
                if (wait) {
                    this.soundCallback = callback;
                    // 타임아웃은 유한 반복에만 적용된다. 무한 반복(count<0)은 완료되지
                    // 않으며 영원히 도는 동작을 유지한다.
                    if (count > 0) this.__armSoundTimeout();
                    this.__checkSoundPlaying();
                } else {
                    this.__checkSoundPlaying();
                    callback();
                }
            } else {
                this.__runSound(0);
                this.__checkSoundPlaying();
                callback();
            }
        }

        __readRepeat(script) {
            // 각도/박자 경로와 마찬가지로, 비거나 숫자가 아닌 REPEAT는 무시(no-op)가
            // 아니라 한 번 재생한다.
            const count = parseInt(script.getNumberValue('REPEAT'), 10);
            return isNaN(count) ? 1 : count;
        }

        __removeAllTimeouts() {
            const timeouts = this.timeouts;
            for (const i in timeouts) {
                clearTimeout(timeouts[i]);
            }
            this.timeouts = [];
        }

        __reset() {
            // _reset(): motoring을 자세 복귀 후 기본값으로 되돌리고 jointState 첫 샘플
            // 캐시를 다시 준비한다. jointAngleId/jointModeId 카운터는 건드리지 않는다
            // (0 재시드 시 다음 실행의 id가 entry-hw _prev와 충돌해 명령이 삼켜짐. setZero 주석 참고).
            const motoring = this.motoring;
            motoring.jointSpeed = 100;
            motoring.jointAngle1 = 0;
            motoring.jointAngle2 = -10;
            motoring.jointAngle3 = -140;
            motoring.jointAngle4 = 60;
            motoring.jointMode = 0;
            this.jointStateId = -1;
        }

        __seedPort(motoring, port) {
            const def = this.__PORT_MAP[port];
            // sendQueue 객체는 공유/직렬화되므로 배열은 새 복사본이어야 한다.
            motoring[port] = Array.isArray(def) ? def.slice() : def;
        }

        __setJointAngle(joint, deg) {
            this.resetting = false;
            const motoring = this.motoring;
            switch (joint) {
                case 1:
                    motoring.jointAngle1 = deg;
                    break;
                case 2:
                    motoring.jointAngle2 = deg;
                    break;
                case 3:
                    motoring.jointAngle3 = deg;
                    break;
                case 4:
                    motoring.jointAngle4 = deg;
                    break;
                default:
                    motoring.jointAngle1 = deg;
                    motoring.jointAngle2 = deg;
                    motoring.jointAngle3 = deg;
                    motoring.jointAngle4 = deg;
                    break;
            }
            this.__clearJointStale(joint);
            motoring.jointAngleId = (motoring.jointAngleId % 255) + 1;
        }

        __setAngleUntil(wait, joint, deg, callback) {
            deg = parseFloat(deg);
            if (isNaN(deg) || joint === undefined) {
                callback();
                return;
            }
            this.__anglesCore(
                wait,
                () => this.__canSetJointAngle(joint, deg),
                () => this.__setJointAngle(joint, deg),
                callback
            );
        }

        __setFourJointAngles(deg1, deg2, deg3, deg4) {
            this.resetting = false;
            const motoring = this.motoring;
            motoring.jointAngle1 = deg1;
            motoring.jointAngle2 = deg2;
            motoring.jointAngle3 = deg3;
            motoring.jointAngle4 = deg4;
            this.__clearJointStale(-1);
            motoring.jointAngleId = (motoring.jointAngleId % 255) + 1;
        }

        __setAnglesUntil(wait, deg1, deg2, deg3, deg4, callback) {
            deg1 = parseFloat(deg1);
            deg2 = parseFloat(deg2);
            deg3 = parseFloat(deg3);
            deg4 = parseFloat(deg4);
            if (isNaN(deg1) || isNaN(deg2) || isNaN(deg3) || isNaN(deg4)) {
                callback();
                return;
            }
            this.__anglesCore(
                wait,
                () => this.__canSetFourJointAngles(deg1, deg2, deg3, deg4),
                () => this.__setFourJointAngles(deg1, deg2, deg3, deg4),
                callback
            );
        }

        __setModule() {
            this.motoring.group = 'raccoon';
            this.motoring.module = 'raccoon';
        }

        __unitFactor(unit) {
            return unit == 'INCHES' ? this.__INCH_TO_CM : 1;
        }

        __waitBlock(script, starter) {
            this.__setModule();
            if (!script.isStart) {
                script.isStart = true;
                script.isMoving = true;
                starter(() => {
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

        clearEvent() {
            this.teachPressed = false;
            this.playPressed = false;
            this.deletePressed = false;
            this.teachReleased = false;
            this.playReleased = false;
            this.deleteReleased = false;
            this.teachClicked = false;
            this.playClicked = false;
            this.deleteClicked = false;
            this.teachLongPressed = false;
            this.playLongPressed = false;
            this.deleteLongPressed = false;
            this.collided1 = false;
            this.collided2 = false;
            this.collided3 = false;
            this.collided4 = false;
            const conveyor = this.conveyor;
            conveyor.pressed = false;
            conveyor.released = false;
            conveyor.clicked = false;
            conveyor.longPressed = false;
        }

        __getPosRef() {
            if (this.posRefDev == this.REF_WRIST) {
                const posRef = this.posRef;
                const posRefRel = this.posRefRel;
                posRef.x = posRefRel.x;
                posRef.y = posRefRel.y;
                posRef.z = posRefRel.z;
            } else if (this.posRefDev == this.REF_GRIPPER) {
                const posRef = this.posRef;
                posRef.x = 0;
                posRef.y = 0;
                posRef.z = 0;
                const posRefRel = this.posRefRel;
                if (this.gripper.type == 3 || this.gripper.type == 4) {
                    // 서보/DC 그리퍼
                    posRef.x = 8;
                    posRef.y = -0.6;
                } else if (this.gripper.type == 2) {
                    // 진공
                    posRef.x = 7.5;
                }
                posRef.x += posRefRel.x;
                posRef.y += posRefRel.y;
                posRef.z += posRefRel.z;
            } else {
                const posRef = this.posRef;
                const posRefAbs = this.posRefAbs;
                const posRefRel = this.posRefRel;
                posRef.x = posRefAbs.x + posRefRel.x;
                posRef.y = posRefAbs.y + posRefRel.y;
                posRef.z = posRefAbs.z + posRefRel.z;
            }
            return this.posRef;
        }

        __calcInvKinematics(xx, yy, z) {
            let x = yy;
            let y = -xx;
            const sensory = this.sensory;
            const posRef = this.__getPosRef();
            let th2 = sensory.encoder2 * this.__TO_RADIAN;
            let th3 = sensory.encoder3 * this.__TO_RADIAN;
            const th4 = sensory.encoder4 * this.__TO_RADIAN;
            const alpha = th2 + th3 + th4 + 90 * this.__TO_RADIAN;
            const beta = Math.atan2(posRef.y, posRef.x);
            const L = Math.sqrt(posRef.x * posRef.x + posRef.y * posRef.y);
            const Lx = L * Math.cos(alpha + beta);
            const Ly = L * Math.sin(alpha + beta);
            const th1 = Math.atan2(y, x);
            x = x - Lx * Math.cos(th1);
            y = y - Lx * Math.sin(th1);
            z = z - Ly;
            const c1 = Math.cos(th1);
            const s1 = Math.sin(th1);
            const zL1 = z - this.__L1;
            const c3 =
                (x * x + y * y + zL1 * zL1 - this.__L2 * this.__L2 - this.__L3 * this.__L3) /
                (2 * this.__L2 * this.__L3);
            let c32 = c3 * c3;
            if (c32 > 1 + 1e-9) return null;
            if (c32 > 1) c32 = 1;
            const s3 = -Math.sqrt(1 - c32);
            th3 = Math.atan2(s3, c3);
            const M1 = c3 * this.__L3 + this.__L2;
            const M2 = z - this.__L1;
            const M3 = s3 * this.__L3;
            const M4 = c1 * x + s1 * y;
            const c2 = M1 * M2 - M3 * M4;
            const s2 = -M2 * M3 - M1 * M4;
            th2 = Math.atan2(s2, c2);
            const joints = this.joints;
            joints[0] = th1 * this.__TO_DEGREE;
            joints[1] = th2 * this.__TO_DEGREE;
            joints[2] = th3 * this.__TO_DEGREE;
            joints[3] = alpha * this.__TO_DEGREE - 90 - joints[1] - joints[2];
            // 비유한 입력은 위쪽 c32 가드를 그냥 통과한다. NaN 과의 비교는 전부 false다. 좌표 블록은
            // posRef 를 누적하므로 Infinity 를 양쪽으로 넣으면 NaN 이 만들어진다. 그대로 내보내면
            // 관절 범위 검사(역시 비교)도 통과하고 _degToStep -> toHex2 가 NaN 을 0 으로 접어
            // 네 관절이 모두 0도로 명령된다. 3번 관절은 0도가 가동 끝이다.
            // 호출부(__moveToXyzUntil)가 이미 null 을 거르므로 여기서 null 로 돌려보낸다.
            if (!joints.every(Number.isFinite)) return null;
            return joints;
        }

        __calcKinematics() {
            const sensory = this.sensory;
            const posRef = this.__getPosRef();
            const th1 = sensory.encoder1 * this.__TO_RADIAN;
            const th2 = sensory.encoder2 * this.__TO_RADIAN;
            const th3 = sensory.encoder3 * this.__TO_RADIAN;
            const th4 = sensory.encoder4 * this.__TO_RADIAN;
            const c1 = Math.cos(th1);
            const s1 = Math.sin(th1);
            const c4 = Math.cos(th4);
            const s4 = Math.sin(th4);
            const c23 = Math.cos(th2 + th3);
            const s23 = Math.sin(th2 + th3);
            const M1 = c4 * posRef.x - s4 * posRef.y + this.__L3;
            const M2 = s4 * posRef.x + c4 * posRef.y;
            const M = s23 * M1 + c23 * M2 + Math.sin(th2) * this.__L2;
            const x = -c1 * M + s1 * posRef.z;
            const y = -s1 * M - c1 * posRef.z;
            const z = c23 * M1 - s23 * M2 + Math.cos(th2) * this.__L2 + this.__L1;
            const pos = this.pos;
            pos.x = -y;
            pos.y = x;
            pos.z = z;
        }

        __conveyorButtonEventFlag(state) {
            const conveyor = this.conveyor;
            switch (state) {
                case 'PRESSED':
                    return conveyor.pressed;
                case 'RELEASED':
                    return conveyor.released;
                case 'CLICKED':
                    return conveyor.clicked;
                case 'LONG_PRESSED':
                    return conveyor.longPressed;
            }
            return false;
        }

        __conveyorCancelDistance() {
            this.conveyor.distanceCallback = undefined;
        }

        __conveyorCancelMoving() {
            const conveyor = this.conveyor;
            conveyor.movingId = 0;
            if (conveyor.movingTimer !== undefined) {
                this.__removeTimeout(conveyor.movingTimer);
            }
            conveyor.movingTimer = undefined;
            this.conveyorMovingCallback = undefined;
        }

        __conveyorCheckMoving() {
            this.conveyor.moving = this.conveyor.motoring.velocity != 0;
        }

        __conveyorHandleSensory(slotR1) {
            const conveyor = this.conveyor;
            const conveyorSensory = conveyor.sensory;
            conveyorSensory.mode = slotR1[1] & 0xff;
            conveyorSensory.distance = ((slotR1[2] & 0xff) << 8) | (slotR1[3] & 0xff);
            conveyorSensory.button = slotR1[4] & 0x01;
            conveyorSensory.clickedId = (slotR1[4] >> 1) & 0x03;
            conveyorSensory.longPressedId = (slotR1[4] >> 3) & 0x03;
            conveyorSensory.moving = slotR1[5] & 0x01;
            conveyorSensory.stateId = (slotR1[5] >> 1) & 0x03;
            conveyorSensory.velocity = slotR1[6];

            if (conveyorSensory.button != conveyor.button) {
                if (conveyor.button == 0 && conveyorSensory.button == 1) conveyor.pressed = true;
                else if (conveyor.button == 1 && conveyorSensory.button == 0)
                    conveyor.released = true;
                conveyor.button = conveyorSensory.button;
            }
            if (conveyorSensory.clickedId != conveyor.clickedId) {
                if (conveyor.clickedId != -1) conveyor.clicked = true;
                conveyor.clickedId = conveyorSensory.clickedId;
            }
            if (conveyorSensory.longPressedId != conveyor.longPressedId) {
                if (conveyor.longPressedId != -1) conveyor.longPressed = true;
                conveyor.longPressedId = conveyorSensory.longPressedId;
            }
            if (conveyorSensory.stateId !== undefined) {
                const t = conveyorSensory.stateId;
                if (t != conveyor.stateId) {
                    if (conveyor.stateId != -1 && conveyor.distanceCallback) {
                        this.__conveyorFinishDistance();
                        conveyor.motoring.mode = 0;
                        conveyor.motoring.velocity = 0;
                        this.__conveyorCheckMoving();
                    }
                    conveyor.stateId = t;
                }
            }
        }

        __conveyorIssueDistance() {
            this.conveyor.motoring.distanceId = (this.conveyor.motoring.distanceId % 255) + 1;
        }

        __conveyorIssueMoving() {
            this.conveyor.movingId = this.blockId = (this.blockId % 65535) + 1;
            return this.conveyor.movingId;
        }

        __conveyorUpdate() {
            const sw1 = this.motoring.slotW1;
            const conveyorMotoring = this.conveyor.motoring;
            sw1[0] = 0x11;
            sw1[1] = conveyorMotoring.mode;
            sw1[2] = conveyorMotoring.velocity;
            sw1[3] = conveyorMotoring.distanceId;
            sw1[4] = (conveyorMotoring.distance >> 8) & 0xff;
            sw1[5] = conveyorMotoring.distance & 0xff;
            for (let i = 6; i < 8; ++i) {
                sw1[i] = 0;
            }
            this.__issueSlotW1();
        }

        __conveyorMoveInternal(value, unit, speed, callback) {
            this.__conveyorFinishDistance();
            this.__conveyorFinishMoving();
            const conveyorMotoring = this.conveyor.motoring;
            value = parseFloat(value);
            speed = parseFloat(speed);
            if (!isNaN(value) && !isNaN(speed) && value != 0 && speed != 0) {
                if (speed < -100) speed = -100;
                else if (speed > 100) speed = 100;
                if (unit == 'SECONDS') {
                    const id = this.__conveyorIssueMoving();
                    conveyorMotoring.mode = 0;
                    conveyorMotoring.velocity = speed;
                    this.conveyorMovingCallback = callback;
                    const timer = setTimeout(
                        () => {
                            if (this.conveyor.movingId == id) {
                                conveyorMotoring.mode = 0;
                                conveyorMotoring.velocity = 0;
                                this.__conveyorUpdate();
                                this.__conveyorFinishMoving();
                                this.__conveyorCheckMoving();
                            }
                        },
                        this.__clampDelay(value * 1000)
                    );
                    this.conveyor.movingTimer = timer;
                    this.timeouts.push(timer);
                    this.__conveyorUpdate();
                    this.__conveyorCheckMoving();
                } else {
                    if (unit == 'MM') {
                        value *= this.__MM_TO_CM;
                    } else if (unit == 'INCHES') {
                        value *= this.__INCH_TO_CM;
                    }
                    if (value < 0) {
                        value = -value;
                        speed = -speed;
                    }
                    conveyorMotoring.mode = 1;
                    // 장치 WRITE_DISTANCE 범위 [0,65535]로 클램프 후 내림한다. entry-hw
                    // _copySlot은 바이트 단위로만 클램프하므로 오버플로를 여기서 막아야 한다.
                    // value는 위에서 이미 음수가 아니게 처리됐다.
                    let dist = Math.floor(value * 100);
                    if (dist < 0) dist = 0;
                    else if (dist > 65535) dist = 65535;
                    conveyorMotoring.distance = dist;
                    conveyorMotoring.velocity = speed;
                    this.conveyor.distanceCallback = callback;
                    this.__conveyorIssueDistance();
                    this.__conveyorUpdate();
                    this.__conveyorCheckMoving();
                }
            } else {
                conveyorMotoring.mode = 0;
                conveyorMotoring.velocity = 0;
                this.__conveyorUpdate();
                this.__conveyorCheckMoving();
                callback();
            }
        }

        __conveyorStopInternal() {
            this.__conveyorFinishDistance();
            this.__conveyorFinishMoving();
            const conveyorMotoring = this.conveyor.motoring;
            conveyorMotoring.mode = 0;
            conveyorMotoring.velocity = 0;
            this.__conveyorUpdate();
            this.__conveyorCheckMoving();
        }

        __lockGripperInternal(wait, direction, callback) {
            if (direction == 'HORIZONTAL') {
                if (
                    this.jointMode == this.JOINT_MODE_VELOCITY ||
                    this.jointMode == this.JOINT_MODE_VELOCITY_HORZ ||
                    this.jointMode == this.JOINT_MODE_VELOCITY_VERT
                ) {
                    this.jointMode = this.JOINT_MODE_VELOCITY_HORZ;
                } else {
                    this.jointMode = this.JOINT_MODE_ANGLE_HORZ;
                }
            } else {
                if (
                    this.jointMode == this.JOINT_MODE_VELOCITY ||
                    this.jointMode == this.JOINT_MODE_VELOCITY_HORZ ||
                    this.jointMode == this.JOINT_MODE_VELOCITY_VERT
                ) {
                    this.jointMode = this.JOINT_MODE_VELOCITY_VERT;
                } else {
                    this.jointMode = this.JOINT_MODE_ANGLE_VERT;
                }
            }
            this.__setJointMode(this.jointMode);
            this.__changeAngleUntil(wait, -1, 0, callback);
        }

        __moveToXyzUntil(wait, x, y, z, callback) {
            // 시도마다 역기구학을 다시 계산한다(정밀 모드 포함).
            const attempt = () => this.__calcInvKinematics(x, y, z);
            let th = null;
            this.__anglesCore(
                wait,
                () => {
                    th = attempt();
                    return th != null && this.__canSetFourJointAngles(th[0], th[1], th[2], th[3]);
                },
                () => this.__setFourJointAngles(th[0], th[1], th[2], th[3]),
                callback
            );
        }

        __readXyzParams(script) {
            const f = this.__unitFactor(script.getField('UNIT'));
            return {
                x: script.getNumberValue('X') * f,
                y: script.getNumberValue('Y') * f,
                z: script.getNumberValue('Z') * f,
            };
        }

        __resetConveyor() {
            this.__conveyorStopInternal();
            const conveyor = this.conveyor;
            const conveyorMotoring = conveyor.motoring;
            conveyorMotoring.mode = 0;
            conveyorMotoring.velocity = 0;
            conveyorMotoring.distance = 0;
            const conveyorSensory = conveyor.sensory;
            conveyorSensory.mode = 0;
            conveyorSensory.velocity = 0;
            conveyorSensory.distance = 0;
            conveyorSensory.button = 0;
            conveyorSensory.clickedId = 0;
            conveyorSensory.longPressedId = 0;
            conveyorSensory.stateId = 0;
            conveyorSensory.moving = 0;
            conveyor.clickedId = -1;
            conveyor.longPressedId = -1;
            conveyor.stateId = -1;
            conveyor.distanceCallback = undefined;
            conveyor.movingId = 0;
            conveyor.movingTimer = undefined;
            conveyor.moving = false;
            conveyor.button = 0;
            conveyor.pressed = false;
            conveyor.released = false;
            conveyor.clicked = false;
            conveyor.longPressed = false;
        }

        __resetGripper() {
            const sw2 = this.motoring.slotW2;
            sw2[0] = 0x21;
            for (let i = 1; i < 8; ++i) {
                sw2[i] = 0;
            }
            this.__issueSlotW2();
        }

        __resetPose() {
            this.__cancelJointAngle();
            this.__setJointMode(this.__checkJointMode(this.JOINT_MODE_ANGLE));
            this.__setJointVelocity(-1, 0);
            this.__setFourJointAngles(0, -10, -140, 60);
            this.resetting = true;
            // 타임아웃 가드: jointState 완료가 오지 않으면(복귀 중 연결 끊김, 장치 멈춤)
            // 로컬 리셋을 강제해 상태가 resetting/ANGLE 모드에 갇히지 않게 한다. 정상 완료
            // 경로가 취소할 수 있도록 핸들은 보관한다(__cancelSoundTimeout과 동일).
            this.__cancelResetTimeout();
            const timer = setTimeout(() => {
                this.resetTimer = undefined;
                this.__removeTimeout(timer);
                if (this.resetting) {
                    this.resetting = false;
                    this.__reset();
                    // __reset은 명령을 보내지 않고 버퍼만 기본 자세로 덮는다. 팔은 복귀 도중이거나
                    // 연결이 끊긴 자리에 있으므로 버퍼를 믿을 수 없다.
                    this.__markJointStale(-1);
                }
            }, this.__RESET_TIMEOUT_MS);
            this.resetTimer = timer;
            this.timeouts.push(timer);
        }

        __withGripperInternal(action, callback) {
            this.__cancelIo();
            const id = this.__issueIoId();
            const sw2 = this.motoring.slotW2;
            sw2[0] = 0x21;
            sw2[1] = 0x00;
            sw2[2] = action == 'PICK' ? 1 : 0;
            for (let i = 3; i < 8; ++i) {
                sw2[i] = 0;
            }
            this.__issueSlotW2();
            const timer = setTimeout(() => {
                if (this.ioId == id) {
                    this.__cancelIo();
                    callback();
                }
            }, 500);
            this.ioTimer = timer;
            this.timeouts.push(timer);
        }

        unlockGripperInternal() {
            if (
                this.jointMode == this.JOINT_MODE_VELOCITY ||
                this.jointMode == this.JOINT_MODE_VELOCITY_HORZ ||
                this.jointMode == this.JOINT_MODE_VELOCITY_VERT
            ) {
                this.jointMode = this.JOINT_MODE_VELOCITY;
            } else {
                this.jointMode = this.JOINT_MODE_ANGLE;
            }
            this.__setJointMode(this.jointMode);
        }

        handleSensory() {
            const sensory = this.sensory;
            // 패킷 주기에 맞춰 먼저 지우고 감지한다. 햇이 엣지당 한 번씩만 감지하도록.
            this.clearEvent();

            if (sensory.teachButton != this.teachButton) {
                if (this.teachButton == 0 && sensory.teachButton == 1) this.teachPressed = true;
                else if (this.teachButton == 1 && sensory.teachButton == 0)
                    this.teachReleased = true;
                this.teachButton = sensory.teachButton;
            }
            if (sensory.playButton != this.playButton) {
                if (this.playButton == 0 && sensory.playButton == 1) this.playPressed = true;
                else if (this.playButton == 1 && sensory.playButton == 0) this.playReleased = true;
                this.playButton = sensory.playButton;
            }
            if (sensory.deleteButton != this.deleteButton) {
                if (this.deleteButton == 0 && sensory.deleteButton == 1) this.deletePressed = true;
                else if (this.deleteButton == 1 && sensory.deleteButton == 0)
                    this.deleteReleased = true;
                this.deleteButton = sensory.deleteButton;
            }

            if (sensory.teachClickedId != this.teachClickedId) {
                if (this.teachClickedId != -1) this.teachClicked = true;
                this.teachClickedId = sensory.teachClickedId;
            }
            if (sensory.playClickedId != this.playClickedId) {
                if (this.playClickedId != -1) this.playClicked = true;
                this.playClickedId = sensory.playClickedId;
            }
            if (sensory.deleteClickedId != this.deleteClickedId) {
                if (this.deleteClickedId != -1) this.deleteClicked = true;
                this.deleteClickedId = sensory.deleteClickedId;
            }

            if (sensory.teachLongPressedId != this.teachLongPressedId) {
                if (this.teachLongPressedId != -1) this.teachLongPressed = true;
                this.teachLongPressedId = sensory.teachLongPressedId;
            }
            if (sensory.playLongPressedId != this.playLongPressedId) {
                if (this.playLongPressedId != -1) this.playLongPressed = true;
                this.playLongPressedId = sensory.playLongPressedId;
            }
            if (sensory.deleteLongPressedId != this.deleteLongPressedId) {
                if (this.deleteLongPressedId != -1) this.deleteLongPressed = true;
                this.deleteLongPressedId = sensory.deleteLongPressedId;
            }

            if (sensory.collision1Id != this.collision1Id) {
                if (this.collision1Id != -1) this.collided1 = true;
                this.collision1Id = sensory.collision1Id;
            }
            if (sensory.collision2Id != this.collision2Id) {
                if (this.collision2Id != -1) this.collided2 = true;
                this.collision2Id = sensory.collision2Id;
            }
            if (sensory.collision3Id != this.collision3Id) {
                if (this.collision3Id != -1) this.collided3 = true;
                this.collision3Id = sensory.collision3Id;
            }
            if (sensory.collision4Id != this.collision4Id) {
                if (this.collision4Id != -1) this.collided4 = true;
                this.collision4Id = sensory.collision4Id;
            }

            if (sensory.jointStateId !== undefined) {
                let t = sensory.jointStateId;
                if (t != this.jointStateId) {
                    if (this.jointStateId != -1 && (this.angleCallback || this.resetting)) {
                        const callback = this.angleCallback;
                        // 정상 완료다. __cancelJointAngle 을 쓰면 angleDone 이 먼저 해소돼
                        // 정밀 이어달리기가 돌기 전에 블록이 끝난다.
                        this.angleCallback = undefined;
                        this.__setJointMode(this.__checkJointMode(this.JOINT_MODE_VELOCITY));
                        // 완료 시 velocity(-1, 0) = 속도 0 유지(토크 ON, 자세 유지).
                        // 레퍼런스 raccoonRobot.js 완료 분기와 동일. 127(전원 차단)은 명시적
                        // turnOff 블록 전용이며, 완료 때 127을 쓰면 이동 완료 직후 팔 힘이 빠진다.
                        this.__setJointVelocity(-1, 0);
                        if (this.resetting) {
                            this.resetting = false;
                            this.__cancelResetTimeout();
                            this.__reset();
                            t = -1;
                        }
                        if (callback) callback();
                    }
                    this.jointStateId = t;
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
                                if (this.soundCallback) this.__armSoundTimeout();
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
            if (sensory.slotR1Id !== undefined) {
                const t = sensory.slotR1Id;
                if (t != this.slotR1Id) {
                    if (sensory.slotR1 !== undefined) {
                        const type = sensory.slotR1[0] & 0x0f;
                        this.extType = type;
                        if (type == 1) {
                            this.__conveyorHandleSensory(sensory.slotR1);
                        }
                    }
                    this.slotR1Id = t;
                }
            }
            if (sensory.slotR2Id !== undefined) {
                const t = sensory.slotR2Id;
                if (t != this.slotR2Id) {
                    if (sensory.slotR2 !== undefined) {
                        const slotR2 = sensory.slotR2;
                        this.gripper.type = slotR2[0] & 0x0f;
                        this.gripper.state = slotR2[2] & 0xff;
                    }
                    this.slotR2Id = t;
                }
            }
            if (sensory.slotR3Id !== undefined) {
                const t = sensory.slotR3Id;
                if (t != this.slotR3Id) {
                    this.slotR3Id = t;
                }
            }
            this.__calcKinematics();
        }

        // ---------------- 생명주기 ----------------

        setZero() {
            // 상태를 비우기 전에 대기 중인 블록에 완료를 알린다. 비운 뒤에 부르면
            // 콜백을 찾을 수 없어 블록이 영원히 멈춘다. 삐오가 실제로 그 형태로 당했고
            // 주석에 이력을 남겼다.
            //
            // 종전에는 이 호출이 없어도 무해했다. 라쿤의 setZero 호출부가 엔진 정지
            // 하나뿐이라 그 시점엔 매달릴 스레드가 없었다. 연결과 거부 계층이 들어오면서
            // 바뀌었다: 세션 중 정체 전환과 onForeignRobot 이 엔진이 살아 있는 채로
            // setZero 를 부른다. 그 경로에서는 대기 블록이 실재한다.
            // noteCallback 과 ioCallback 은 lite 전용 손잡이다. 종전에는 이 목록이 둘뿐이라
            // 음표, 쉼표(noteCallback), 그리퍼 I/O(ioCallback)의 대기 해제가 타이머 안
            // 클로저에만 있었고, 아래 __removeAllTimeouts() 가 그것을 해소 없이 죽여
            // script.isMoving 이 true 로 남았다. 초 단위 컨베이어도 같은 부류다.
            // angleCallback 이 아니라 angleDone 을 해소한다. angleCallback 은 정밀 모드에서
            // 명령을 발행하는 이어달리기를 들 수 있어, 정지 경로에서 부르면 팔이 움직인다.
            this.angleCallback = undefined;
            [
                'angleDone',
                'soundCallback',
                'noteCallback',
                'ioCallback',
                'conveyorMovingCallback',
            ].forEach((k) => {
                const cb = this[k];
                this[k] = undefined;
                if (cb) cb();
            });
            const convCb = this.conveyor.distanceCallback;
            this.conveyor.distanceCallback = undefined;
            if (convCb) convCb();

            this.unreachablePoseWarned = false; // 실행마다 안내를 다시 낼 수 있게
            this.delayWarned = false;
            // 프로그램 정지 시 reset(): 속도/사운드를 0으로, 그리퍼를 열고, 기본 자세를
            // 명령한다(resetting=true). 정지 시 팔이 원위치로 돌아가는 것이 장치 동작이다.
            // 수신 경로는 계속 돌지만 그것만으로는 완료 신호가 오지 않는다. 송신이 먼저
            // 죽기 때문이다. webSerialConnector 의 주기 write 는 `Entry.engine.isState('run')`
            // 뒤에 있고 toggleStop 은 상태를 'stopping' 으로 먼저 바꾼 뒤 이 함수를 부른다.
            // 그래서 말미에서 serial.update() 로 한 번 직접 내보낸다(그쪽에는 run 게이트가 없다).
            // 아래 3초 타임아웃은 그래도 신호가 안 오는 경우를 처리한다.
            //
            // *Id 카운터는 세션 내 단조 증가로 보존한다(0 재시드 금지). entry-hw 모듈의 _prev_*Id는
            // 워크스페이스 소켓이 살아있는 한 유지되는데, 카운터를 0으로 되돌리면 다음 실행이 만드는
            // id가 이전 실행과 같은 값에 도달해 명령이 통째로 삼켜진다(정지 후 재실행 무반응).
            // 옛 재시드가 겸하던 부수효과(soundId=0 전송=소리 정지, slotW3Id=0 전송=W3 중립 재전송)는
            // 아래에서 명시적 id 증가 명령으로 재현한다.
            const portMap = this.__PORT_MAP;
            const motoring = this.motoring;
            const idPorts = this.__ID_PORTS;
            for (const port in portMap) {
                if (idPorts.indexOf(port) >= 0 && motoring[port] !== undefined) {
                    continue; // 카운터 보존 (undefined면 아래 시드로 0 초기화)
                }
                this.__seedPort(motoring, port);
            }
            this.__setNote(0); // 음 정지 (noteId 증가 포함)
            this.__setSound(0); // 소리 정지 (soundId 증가 포함)
            this.__issueSlotW3(); // W3 중립 payload 재전송
            this.jointVelocity1 = 0;
            this.jointVelocity2 = 0;
            this.jointVelocity3 = 0;
            this.jointVelocity4 = 0;
            this.teachClickedId = -1;
            this.playClickedId = -1;
            this.deleteClickedId = -1;
            this.teachLongPressedId = -1;
            this.playLongPressedId = -1;
            this.deleteLongPressedId = -1;
            this.collision1Id = -1;
            this.collision2Id = -1;
            this.collision3Id = -1;
            this.collision4Id = -1;
            this.soundStateId = -1;
            this.blockId = 0;
            this.angleCallback = undefined;
            this.currentSound = 0;
            this.soundRepeat = 1;
            this.soundCallback = undefined;
            this.sounding = false;
            this.noteId = 0;
            this.noteTimer1 = undefined;
            this.noteTimer2 = undefined;
            this.soundTimeoutTimer = undefined;
            this.noting = false;
            this.resting = false;
            this.ioId = 0;
            this.ioTimer = undefined;
            this.resetTimer = undefined;
            this.teachButton = 0;
            this.playButton = 0;
            this.deleteButton = 0;
            this.clearEvent();
            this.jointMode = this.JOINT_MODE_VELOCITY;
            this.precisionMode = 0;
            this.tempo = 60;
            const posRefAbs = this.posRefAbs;
            posRefAbs.x = 0;
            posRefAbs.y = 0;
            posRefAbs.z = 0;
            const posRefRel = this.posRefRel;
            posRefRel.x = 0;
            posRefRel.y = 0;
            posRefRel.z = 0;
            this.posRefDev = this.REF_GRIPPER;
            const pos = this.pos;
            pos.x = 0;
            pos.y = 0;
            pos.z = 0;
            const gripper = this.gripper;
            gripper.type = -1;
            gripper.state = -1;
            this.extType = 0;
            this.__removeAllTimeouts();
            this.__resetGripper();
            this.__resetConveyor();
            this.__resetPose();
            // 정지 프레임을 실제로 내보낸다. lite 에는 설치형의 IPC 홉이 없고, 주기 송신은
            // 엔진이 run 일 때만 쓰므로 이 호출이 없으면 정지 명령이 장치에 영영 닿지 않는다.
            // __resetPose() 뒤여야 한다. 그것이 기본 자세를 motoring 에 싣는다.
            //
            // 네 번 부른다. 한 번으로는 부족하다. __encodeFrame 이 프레임마다 슬롯
            // 하나만 싣고 `_packet_sent` 를 `% 4` 로 돌린다. 헤더(관절 모드, 각도, 속도)는
            // 매 프레임 실리므로 속도 0 과 기본 자세는 한 번으로 닿지만,
            // 소리 정지(슬롯0), 컨베이어 정지(슬롯1), 그리퍼 복귀(슬롯2), W3 중립(슬롯3)은
            // 각자 자기 차례에만 실린다. 한 번만 부르면 그 순간 `_packet_sent` 가 가리키는
            // 하나만 나가고 나머지 셋은 `_slot_w*` 와 `_sound_written` 에 남아 다음 실행까지
            // 장치에 닿지 않는다. 정지를 눌러도 컨베이어가 계속 돌고 소리가 계속 난다.
            // 네 번이면 시작 위치와 무관하게 네 슬롯을 정확히 한 번씩 지난다.
            //
            // 설치형에는 이 경로가 없다. 슬롯 순환은 같지만 entry-hw 가 별 프로세스에서
            // 자기 주기로 돌아 엔진 상태와 무관하게 네 프레임 안에 다 흘린다. 두 계층을
            // 한 프로세스로 합치면서 그 주기가 `Entry.engine.isState('run')` 뒤로 들어갔다.
            // 삐오와 햄스터 lite 에는 슬롯 순환 자체가 없어 한 번으로 충분하다.
            if (Entry.hwLite && Entry.hwLite.serial) {
                for (let i = 0; i < 4; ++i) {
                    Entry.hwLite.serial.update();
                }
            }
        }

        hasButtonEvent() {
            return (
                this.teachPressed ||
                this.playPressed ||
                this.deletePressed ||
                this.teachReleased ||
                this.playReleased ||
                this.deleteReleased ||
                this.teachClicked ||
                this.playClicked ||
                this.deleteClicked ||
                this.teachLongPressed ||
                this.playLongPressed ||
                this.deleteLongPressed
            );
        }

        hasConveyorButtonEvent() {
            const conveyor = this.conveyor;
            return (
                conveyor.pressed || conveyor.released || conveyor.clicked || conveyor.longPressed
            );
        }

        // ---------------- 블록 진입점 (목록 A 67개) ----------------

        changeAngleBy(script) {
            this.__setModule();
            const joint = this.__JOINTS[script.getField('JOINT')];
            this.__changeAngleUntil(false, joint, script.getNumberValue('DEGREE'), () => {});
            return script.callReturn();
        }

        changeAngleByUntil(script) {
            return this.__waitBlock(script, (cb) => {
                const joint = this.__JOINTS[script.getField('JOINT')];
                this.__changeAngleUntil(true, joint, script.getNumberValue('DEGREE'), cb);
            });
        }

        changeJointAnglesBy(script) {
            this.__setModule();
            this.__changeAnglesUntil(
                false,
                script.getNumberValue('DEGREE1'),
                script.getNumberValue('DEGREE2'),
                script.getNumberValue('DEGREE3'),
                script.getNumberValue('DEGREE4'),
                () => {}
            );
            return script.callReturn();
        }

        changeJointAnglesByUntil(script) {
            return this.__waitBlock(script, (cb) => {
                this.__changeAnglesUntil(
                    true,
                    script.getNumberValue('DEGREE1'),
                    script.getNumberValue('DEGREE2'),
                    script.getNumberValue('DEGREE3'),
                    script.getNumberValue('DEGREE4'),
                    cb
                );
            });
        }

        changeJointVelocitiesBy(script) {
            this.__setModule();
            this.__cancelJointAngle();
            this.__setJointMode(this.__checkJointMode(this.JOINT_MODE_VELOCITY));
            this.__changeFourJointVelocities(
                script.getNumberValue('VELOCITY1'),
                script.getNumberValue('VELOCITY2'),
                script.getNumberValue('VELOCITY3'),
                script.getNumberValue('VELOCITY4')
            );
            this.__markJointStale(-1);
            return script.callReturn();
        }

        changePositionBy(script) {
            return this.__waitBlock(script, (cb) => {
                const axis = this.__AXES[script.getField('XYZ')];
                const value =
                    script.getNumberValue('VALUE') * this.__unitFactor(script.getField('UNIT'));
                const pos = this.pos;
                let x = pos.x;
                let y = pos.y;
                let z = pos.z;
                if (axis == 1) x += value;
                else if (axis == 2) y += value;
                else if (axis == 0) z += value;
                this.__moveToXyzUntil(true, x, y, z, cb);
            });
        }

        changePositionByXYZ(script) {
            this.__setModule();
            const p = this.__readXyzParams(script);
            const pos = this.pos;
            this.__moveToXyzUntil(false, pos.x + p.x, pos.y + p.y, pos.z + p.z, () => {});
            return script.callReturn();
        }

        changePositionByXYZUntil(script) {
            return this.__waitBlock(script, (cb) => {
                const p = this.__readXyzParams(script);
                const pos = this.pos;
                this.__moveToXyzUntil(true, pos.x + p.x, pos.y + p.y, pos.z + p.z, cb);
            });
        }

        changePositionRefByFrontUp(script) {
            this.__setModule();
            const f = this.__unitFactor(script.getField('UNIT'));
            const y = script.getNumberValue('Y') * f;
            const z = script.getNumberValue('Z') * f;
            const posRefRel = this.posRefRel;
            if (script.getField('FRONT_REAR') == 'FRONT') posRefRel.x += y;
            else posRefRel.x -= y;
            if (script.getField('UP_DOWN') == 'UP') posRefRel.y += z;
            else posRefRel.y -= z;
            return script.callReturn();
        }

        changeTempo(script) {
            this.__setModule();
            const bpm = parseFloat(script.getNumberValue('BPM'));
            if (!isNaN(bpm)) {
                this.tempo += bpm;
                if (this.tempo < 1) this.tempo = 1;
            }
            return script.callReturn();
        }

        changeVelocityBy(script) {
            this.__setModule();
            this.__cancelJointAngle();
            this.__setJointMode(this.__checkJointMode(this.JOINT_MODE_VELOCITY));
            const joint = this.__JOINTS[script.getField('JOINT')];
            this.__changeJointVelocity(joint, script.getNumberValue('VELOCITY'));
            this.__markJointStale(joint);
            return script.callReturn();
        }

        checkBatteryState(script) {
            return this.sensory.batteryState == this.__BATTERY_STATES[script.getField('BATTERY')];
        }

        checkButtonEvent(script) {
            return this.__buttonEventFlag(script.getField('BUTTON'), script.getField('STATE'));
        }

        checkConveyorButtonEvent(script) {
            return this.__conveyorButtonEventFlag(script.getField('STATE'));
        }

        clearSound(script) {
            this.__setModule();
            this.__finishNote();
            this.__finishSound();
            this.__setNote(0);
            this.__runSound(0);
            this.__checkSoundPlaying();
            return script.callReturn();
        }

        conveyorChangeVelocity(script) {
            this.__setModule();
            const conveyorMotoring = this.conveyor.motoring;
            conveyorMotoring.mode = 0;
            let velocity = parseFloat(script.getNumberValue('VELOCITY'));
            if (!isNaN(velocity)) {
                // 유효할 때만 깨운다. 무효 입력은 __conveyorUpdate() 에 닿지 않아 장치에
                // 아무것도 나가지 않으므로 앞 대기를 밀어내지 않는다. 밖에 두면 컨베이어가
                // 거리 명령을 그대로 수행하는데 대기 블록만 끝난다.
                this.__conveyorFinishDistance();
                this.__conveyorFinishMoving();
                velocity += conveyorMotoring.velocity;
                if (velocity < -100) velocity = -100;
                else if (velocity > 100) velocity = 100;
                conveyorMotoring.velocity = velocity;
                this.__conveyorUpdate();
            }
            this.__conveyorCheckMoving();
            return script.callReturn();
        }

        conveyorMove(script) {
            return this.__waitBlock(script, (cb) => {
                this.__conveyorMoveInternal(
                    script.getNumberValue('VALUE'),
                    script.getField('UNIT'),
                    script.getNumberValue('SPEED'),
                    cb
                );
            });
        }

        conveyorSetVelocity(script) {
            this.__setModule();
            const conveyorMotoring = this.conveyor.motoring;
            conveyorMotoring.mode = 0;
            let velocity = parseFloat(script.getNumberValue('VELOCITY'));
            if (!isNaN(velocity)) {
                // 유효할 때만 깨운다. 무효 입력은 __conveyorUpdate() 에 닿지 않아 장치에
                // 아무것도 나가지 않으므로 앞 대기를 밀어내지 않는다. 밖에 두면 컨베이어가
                // 거리 명령을 그대로 수행하는데 대기 블록만 끝난다.
                this.__conveyorFinishDistance();
                this.__conveyorFinishMoving();
                if (velocity < -100) velocity = -100;
                else if (velocity > 100) velocity = 100;
                conveyorMotoring.velocity = velocity;
                this.__conveyorUpdate();
            }
            this.__conveyorCheckMoving();
            return script.callReturn();
        }

        conveyorStop(script) {
            this.__setModule();
            this.__conveyorStopInternal();
            return script.callReturn();
        }

        getConveyorButton(script) {
            return this.conveyor.sensory.button;
        }

        getDeleteButton(script) {
            return this.sensory.deleteButton;
        }

        getEncoder1(script) {
            return this.sensory.encoder1;
        }

        getEncoder2(script) {
            return this.sensory.encoder2;
        }

        getEncoder3(script) {
            return this.sensory.encoder3;
        }

        getEncoder4(script) {
            return this.sensory.encoder4;
        }

        getGripperState(script) {
            return this.gripper.state;
        }

        getPlayButton(script) {
            return this.sensory.playButton;
        }

        getPositionX(script) {
            return this.pos.x;
        }

        getPositionXInch(script) {
            return this.pos.x / this.__INCH_TO_CM;
        }

        getPositionY(script) {
            return this.pos.y;
        }

        getPositionYInch(script) {
            return this.pos.y / this.__INCH_TO_CM;
        }

        getPositionZ(script) {
            return this.pos.z;
        }

        getPositionZInch(script) {
            return this.pos.z / this.__INCH_TO_CM;
        }

        getSignalStrength(script) {
            return this.sensory.signalStrength;
        }

        getTeachButton(script) {
            return this.sensory.teachButton;
        }

        isButtonState(script) {
            const button = script.getField('BUTTON');
            const state = script.getField('STATE');
            if (state == 'PRESSED' || state == 'RELEASED') {
                const level =
                    button == 'TEACH'
                        ? this.sensory.teachButton
                        : button == 'PLAY'
                          ? this.sensory.playButton
                          : this.sensory.deleteButton;
                return state == 'PRESSED' ? level == 1 : level == 0;
            }
            return this.__buttonEventFlag(button, state);
        }

        isCharging(script) {
            return this.sensory.chargeState == 1;
        }

        isConveyorButtonState(script) {
            const state = script.getField('STATE');
            if (state == 'PRESSED') return this.conveyor.sensory.button == 1;
            if (state == 'RELEASED') return this.conveyor.sensory.button == 0;
            return this.__conveyorButtonEventFlag(state);
        }

        isConveyorMoving(script) {
            return this.conveyor.sensory.moving == 1;
        }

        isMoving(script) {
            return this.sensory.moving == 1;
        }

        isSoundPlaying(script) {
            return this.sounding || this.noting || this.resting;
        }

        lockGripper(script) {
            this.__setModule();
            this.__lockGripperInternal(false, script.getField('DIRECTION'), () => {});
            return script.callReturn();
        }

        lockGripperUntil(script) {
            return this.__waitBlock(script, (cb) => {
                this.__lockGripperInternal(true, script.getField('DIRECTION'), cb);
            });
        }

        playNote(script) {
            this.__setModule();
            this.__finishNote();
            this.__finishSound();
            this.__setNote(this.__noteValue(script));
            this.__runSound(0);
            this.__checkSoundPlaying();
            return script.callReturn();
        }

        playNoteBeat(script) {
            return this.__waitBlock(script, (cb) => {
                this.__finishNote();
                this.__finishSound();
                const note = this.__noteValue(script);
                const beat = parseFloat(script.getNumberValue('BEAT'));
                if (note && beat && beat > 0 && this.tempo > 0) {
                    const id = this.__issueNoteId();
                    this.__setNote(note);
                    const timeout = this.__clampDelay((beat * 60 * 1000) / this.tempo);
                    const tail = timeout > 100 ? 100 : 0;
                    if (tail > 0) {
                        const t1 = setTimeout(() => {
                            if (this.noteId == id) {
                                this.__setNote(0);
                                if (this.noteTimer1 !== undefined)
                                    this.__removeTimeout(this.noteTimer1);
                                this.noteTimer1 = undefined;
                            }
                        }, timeout - tail);
                        this.noteTimer1 = t1;
                        this.timeouts.push(t1);
                    }
                    // 손잡이에 걸어 둔다. setZero 가 타이머를 죽여도 대기를 풀 수 있다.
                    this.noteCallback = cb;
                    const t2 = setTimeout(() => {
                        if (this.noteId == id) {
                            this.__setNote(0);
                            this.__finishNote();
                            this.__checkSoundPlaying();
                        }
                    }, timeout);
                    this.noteTimer2 = t2;
                    this.timeouts.push(t2);
                    this.__runSound(0);
                    this.__checkSoundPlaying();
                } else {
                    this.__setNote(0);
                    this.__runSound(0);
                    this.__checkSoundPlaying();
                    cb();
                }
            });
        }

        playSound(script) {
            this.__setModule();
            this.__playSoundCore(this.__SOUNDS[script.getField('SOUND')], 1, false, () => {});
            return script.callReturn();
        }

        playSoundTimes(script) {
            this.__setModule();
            this.__playSoundCore(
                this.__SOUNDS[script.getField('SOUND')],
                this.__readRepeat(script),
                false,
                () => {}
            );
            return script.callReturn();
        }

        playSoundTimesUntil(script) {
            return this.__waitBlock(script, (cb) => {
                // 삐오 playSoundUntil 과 같은 이유로 음수만 막는다. 기다리지 않는
                // playSoundTimes 는 정지하지 않으므로 __readRepeat 은 그대로 둔다.
                const count = this.__readRepeat(script);
                this.__playSoundCore(
                    this.__SOUNDS[script.getField('SOUND')],
                    count < 0 ? 0 : count,
                    true,
                    cb
                );
            });
        }

        restBeat(script) {
            return this.__waitBlock(script, (cb) => {
                this.__finishNote();
                this.__finishSound();
                const beat = parseFloat(script.getNumberValue('BEAT'));
                this.__setNote(0);
                this.__runSound(0);
                if (beat && beat > 0 && this.tempo > 0) {
                    const id = this.__issueNoteId();
                    this.noteCallback = cb;
                    const t1 = setTimeout(
                        () => {
                            if (this.noteId == id) {
                                this.__finishNote();
                                this.__checkSoundPlaying();
                            }
                        },
                        this.__clampDelay((beat * 60 * 1000) / this.tempo)
                    );
                    this.noteTimer1 = t1;
                    this.timeouts.push(t1);
                    this.__checkSoundPlaying();
                    this.resting = true;
                } else {
                    this.__checkSoundPlaying();
                    cb();
                }
            });
        }

        returnToBasicPose(script) {
            return this.__waitBlock(script, (cb) => {
                // 손잡이에는 최종 완료만 건다. 중간 단계(그리퍼 완료 -> 기본 자세 명령)를
                // setZero 가 부르면 정지 경로에서 새 명령이 나간다. 실제로 한 번 그렇게
                // 짰다가 표 등가 검사가 jointAngleId 와 jointModeId 드리프트로 잡았다.
                this.__resolvePending('ioCallback');
                // 이 블록은 두 단계다. 그리퍼를 놓은 뒤 관절을 기본 자세로 보낸다.
                // 손잡이에는 최종 완료만 건다. 중간 단계를 setZero 가 부르면 정지 경로에서
                // 새 관절 명령이 나간다.
                //
                // 그런데 그 구조 때문에 반대 구멍이 생겼다. 그리퍼 단계에 있는 동안 남이
                // 손잡이를 해소하면(다른 스크립트의 withGripper 가 진입부에서 그렇게 한다)
                // 관절 명령을 내지 않은 채 블록만 끝난다. 팔이 기본 자세로 안 갔는데
                // 성공으로 보인다.
                //
                // 관절 명령을 대신 내는 선택지는 쓰지 않는다. 해소하는 쪽이 정지인지
                // 남의 블록인지 이 자리에서 구별할 수 없고, setZero 는 정지뿐 아니라
                // 정체 전환과 거부에서도 불린다. 거기서 관절 명령이 나가면 위 문단이
                // 막으려던 결함이 그대로 되살아난다.
                //
                // 그래서 대기는 풀되 중간에 끊겼다는 사실을 남긴다. 사용자에게는
                // "블록이 그냥 지나갔다" 로 보이므로 원인 추적에 필요하다.
                let gripperStage = true;
                const done = () => {
                    if (this.ioCallback === done) {
                        this.ioCallback = undefined;
                    }
                    if (gripperStage) {
                        // 중간에 끊겼다. 관절 명령은 내지 않는다.
                        //
                        // 이어서 관절을 보내는 판을 만들어 봤는데 설치형과 대조하면 `with_gripper`
                        // 지점부터 갈렸다. 설치형은 이 자리에서 `ioId` 가드가 막아 이어달리기
                        // 자체가 불리지 않는다. 즉 관절 명령을 내면 원문과 관측 가능하게
                        // 달라진다. 이 항목은 본문 무수정을 증거로 삼으므로 내지 않는다.
                        //
                        // 설치형은 그 자리에서 대기가 영영 안 풀린다. lite 는 손잡이가 있어
                        // 풀 수 있고 그래서 푼다. 다만 팔은 기본 자세로 가지 않았는데 블록은
                        // 끝나므로, 사용자에게는 "블록이 그냥 지나갔다" 로 보인다.
                        // 원인 추적이 가능하도록 남긴다. 알려진 한계로 공개한다.
                        console.info(
                            'RaccoonLite: returnToBasicPose interrupted during gripper stage,' +
                                ' joints were not commanded'
                        );
                    }
                    cb();
                };
                this.ioCallback = done;
                this.unlockGripperInternal();
                this.__withGripperInternal('PLACE', () => {
                    // 그리퍼 단계가 끝났다. 이후 대기는 angleCallback 이 소유한다.
                    gripperStage = false;
                    this.ioCallback = undefined;
                    this.__setAnglesUntil(true, 0, -10, -140, 60, cb);
                });
            });
        }

        setAngleTo(script) {
            this.__setModule();
            const joint = this.__JOINTS[script.getField('JOINT')];
            this.__setAngleUntil(false, joint, script.getNumberValue('DEGREE'), () => {});
            return script.callReturn();
        }

        setAngleToUntil(script) {
            return this.__waitBlock(script, (cb) => {
                const joint = this.__JOINTS[script.getField('JOINT')];
                this.__setAngleUntil(true, joint, script.getNumberValue('DEGREE'), cb);
            });
        }

        setJointAnglesTo(script) {
            this.__setModule();
            this.__setAnglesUntil(
                false,
                script.getNumberValue('DEGREE1'),
                script.getNumberValue('DEGREE2'),
                script.getNumberValue('DEGREE3'),
                script.getNumberValue('DEGREE4'),
                () => {}
            );
            return script.callReturn();
        }

        setJointAnglesToUntil(script) {
            return this.__waitBlock(script, (cb) => {
                this.__setAnglesUntil(
                    true,
                    script.getNumberValue('DEGREE1'),
                    script.getNumberValue('DEGREE2'),
                    script.getNumberValue('DEGREE3'),
                    script.getNumberValue('DEGREE4'),
                    cb
                );
            });
        }

        setJointVelocitiesTo(script) {
            this.__setModule();
            this.__cancelJointAngle();
            this.__setJointMode(this.__checkJointMode(this.JOINT_MODE_VELOCITY));
            this.__setFourJointVelocities(
                script.getNumberValue('VELOCITY1'),
                script.getNumberValue('VELOCITY2'),
                script.getNumberValue('VELOCITY3'),
                script.getNumberValue('VELOCITY4')
            );
            this.__markJointStale(-1);
            return script.callReturn();
        }

        setPositionRefTo(script) {
            this.__setModule();
            this.posRefDev =
                script.getField('REF') == 'GRIPPER' ? this.REF_GRIPPER : this.REF_WRIST;
            return script.callReturn();
        }

        setPositionRefToFrontUp(script) {
            this.__setModule();
            const f = this.__unitFactor(script.getField('UNIT'));
            const y = script.getNumberValue('Y') * f;
            const z = script.getNumberValue('Z') * f;
            const posRefAbs = this.posRefAbs;
            posRefAbs.x = script.getField('FRONT_REAR') == 'FRONT' ? y : -y;
            posRefAbs.y = script.getField('UP_DOWN') == 'UP' ? z : -z;
            posRefAbs.z = 0;
            this.posRefDev = this.REF_NONE;
            return script.callReturn();
        }

        setPositionTo(script) {
            return this.__waitBlock(script, (cb) => {
                const axis = this.__AXES[script.getField('XYZ')];
                const value =
                    script.getNumberValue('VALUE') * this.__unitFactor(script.getField('UNIT'));
                const pos = this.pos;
                let x = pos.x;
                let y = pos.y;
                let z = pos.z;
                if (axis == 1) x = value;
                else if (axis == 2) y = value;
                else if (axis == 0) z = value;
                this.__moveToXyzUntil(true, x, y, z, cb);
            });
        }

        setPositionToXYZ(script) {
            this.__setModule();
            const p = this.__readXyzParams(script);
            this.__moveToXyzUntil(false, p.x, p.y, p.z, () => {});
            return script.callReturn();
        }

        setPositionToXYZUntil(script) {
            return this.__waitBlock(script, (cb) => {
                const p = this.__readXyzParams(script);
                this.__moveToXyzUntil(true, p.x, p.y, p.z, cb);
            });
        }

        setTempo(script) {
            this.__setModule();
            const bpm = parseFloat(script.getNumberValue('BPM'));
            if (!isNaN(bpm)) {
                this.tempo = bpm;
                if (this.tempo < 1) this.tempo = 1;
            }
            return script.callReturn();
        }

        setVelocityTo(script) {
            this.__setModule();
            this.__cancelJointAngle();
            this.__setJointMode(this.__checkJointMode(this.JOINT_MODE_VELOCITY));
            const joint = this.__JOINTS[script.getField('JOINT')];
            this.__setJointVelocity(joint, script.getNumberValue('VELOCITY'));
            this.__markJointStale(joint);
            return script.callReturn();
        }

        stop(script) {
            this.__setModule();
            this.__cancelJointAngle();
            this.__setJointMode(this.__checkJointMode(this.JOINT_MODE_VELOCITY));
            const joint = this.__JOINTS[script.getField('JOINT')];
            this.__setJointVelocity(joint, 0);
            this.__markJointStale(joint);
            return script.callReturn();
        }

        turnOff(script) {
            this.__setModule();
            this.__cancelJointAngle();
            this.__setJointMode(this.__checkJointMode(this.JOINT_MODE_VELOCITY));
            const joint = this.__JOINTS[script.getField('JOINT')];
            this.__setJointVelocity(joint, 127);
            this.__markJointStale(joint);
            return script.callReturn();
        }

        turnPrecisionMode(script) {
            this.__setModule();
            this.precisionMode = script.getField('ON_OFF') == 'ON' ? 1 : 0;
            return script.callReturn();
        }

        unlockGripper(script) {
            this.__setModule();
            this.unlockGripperInternal();
            return script.callReturn();
        }

        withGripper(script) {
            return this.__waitBlock(script, (cb) => {
                // 최종 완료를 손잡이에 건다. setZero 가 타이머를 죽여도 대기를 풀 수 있다.
                // 앞 그리퍼 대기가 있으면 먼저 끝낸다. 손잡이가 하나뿐이라 덮어쓰면 고아가 된다.
                // __cancelIo 에서 해소하면 안 된다. returnToBasicPose 가 거기에 이어달리기를
                // 넘기므로 블록이 끝난 뒤 팔 명령이 나간다. 덮어쓰는 쪽에서 푼다.
                this.__resolvePending('ioCallback');
                const done = () => {
                    if (this.ioCallback === done) {
                        this.ioCallback = undefined;
                    }
                    cb();
                };
                this.ioCallback = done;
                this.__withGripperInternal(script.getField('ACTION'), done);
            });
        }

        // ---------------- 블록 정의 계층 ----------------
        // block_raccoon.js 의 setLanguage / blockMenuBlocks / getBlocks 원문.
        // 헤더만 메서드로 바꾸고 이름공간을 lite 로 치환했다.

        setLanguage() {
            return {
                ko: {
                    template: {
                        raccoonlite_return_to_basic_pose: '기본 자세로 돌아가기 %1',
                        raccoonlite_change_joint_angles_by:
                            '관절 각도를 1: %1 2: %2 3: %3 4: %4 만큼 바꾸기 %5',
                        raccoonlite_change_joint_angles_by_until:
                            '관절 각도를 1: %1 2: %2 3: %3 4: %4 만큼 바꾸고 기다리기 %5',
                        raccoonlite_set_joint_angles_to:
                            '관절 각도를 1: %1 2: %2 3: %3 4: %4 도로 정하기 %5',
                        raccoonlite_set_joint_angles_to_until:
                            '관절 각도를 1: %1 2: %2 3: %3 4: %4 도로 정하고 기다리기 %5',
                        raccoonlite_change_angle_by: '%1 관절 각도를 %2 만큼 바꾸기 %3',
                        raccoonlite_change_angle_by_until:
                            '%1 관절 각도를 %2 만큼 바꾸고 기다리기 %3',
                        raccoonlite_set_angle_to: '%1 관절 각도를 %2 도로 정하기 %3',
                        raccoonlite_set_angle_to_until: '%1 관절 각도를 %2 도로 정하고 기다리기 %3',
                        raccoonlite_change_position_by_xyz:
                            '위치를 x: %1 y: %2 z: %3 %4 만큼 바꾸기 %5',
                        raccoonlite_change_position_by_xyz_until:
                            '위치를 x: %1 y: %2 z: %3 %4 만큼 바꾸고 기다리기 %5',
                        raccoonlite_set_position_to_xyz: '위치를 x: %1 y: %2 z: %3 %4 로 정하기 %5',
                        raccoonlite_set_position_to_xyz_until:
                            '위치를 x: %1 y: %2 z: %3 %4 로 정하고 기다리기 %5',
                        raccoonlite_change_position_by: '위치 %1 를 %2 %3 만큼 바꾸고 기다리기 %4',
                        raccoonlite_set_position_to: '위치 %1 를 %2 %3 로 정하고 기다리기 %4',
                        raccoonlite_set_position_ref_to: '위치 기준을 %1 (으)로 정하기 %2',
                        raccoonlite_change_position_ref_by_front_up:
                            '위치 기준을 %1 %2 %3 %4 %5 만큼 바꾸기 %6',
                        raccoonlite_set_position_ref_to_front_up:
                            '위치 기준을 %1 %2 %3 %4 %5 로 정하기 %6',
                        raccoonlite_change_joint_velocities_by:
                            '관절 속도를 1: %1 2: %2 3: %3 4: %4 만큼 바꾸기 %5',
                        raccoonlite_set_joint_velocities_to:
                            '관절 속도를 1: %1 2: %2 3: %3 4: %4 %로 정하기 %5',
                        raccoonlite_change_velocity_by: '%1 관절 속도를 %2 만큼 바꾸기 %3',
                        raccoonlite_set_velocity_to: '%1 관절 속도를 %2 %로 정하기 %3',
                        raccoonlite_stop: '%1 관절 정지하기 %2',
                        raccoonlite_turn_off: '%1 관절 전원 끄기 %2',
                        raccoonlite_turn_precision_mode: '정밀 모드 %1 %2',
                        raccoonlite_is_moving: '움직이는 중인가?',
                        raccoonlite_with_gripper: '그리퍼 %1 %2',
                        raccoonlite_lock_gripper: '그리퍼 %1 으로 고정하기 %2',
                        raccoonlite_lock_gripper_until: '그리퍼 %1 으로 고정하고 기다리기 %2',
                        raccoonlite_unlock_gripper: '그리퍼 고정 해제하기 %1',
                        raccoonlite_gripper_state: '그리퍼 상태',
                        raccoonlite_play_sound: '%1 소리 재생하기 %2',
                        raccoonlite_play_sound_times: '%1 소리 %2 번 재생하기 %3',
                        raccoonlite_play_sound_until: '%1 소리 %2 번 재생하고 기다리기 %3',
                        raccoonlite_clear_sound: '소리 끄기 %1',
                        raccoonlite_play_note: '%1 %2 음을 연주하기 %3',
                        raccoonlite_play_note_beat: '%1 %2 음을 %3 박자 연주하기 %4',
                        raccoonlite_rest_beat: '%1 박자 쉬기 %2',
                        raccoonlite_change_tempo: '연주 속도를 %1 만큼 바꾸기 %2',
                        raccoonlite_set_tempo: '연주 속도를 %1 BPM으로 정하기 %2',
                        raccoonlite_is_sound_playing: '소리 내는 중인가?',
                        raccoonlite_encoder1: '1번째 관절 각도',
                        raccoonlite_encoder2: '2번째 관절 각도',
                        raccoonlite_encoder3: '3번째 관절 각도',
                        raccoonlite_encoder4: '4번째 관절 각도',
                        raccoonlite_position_x: '위치 x (cm)',
                        raccoonlite_position_y: '위치 y (cm)',
                        raccoonlite_position_z: '위치 z (cm)',
                        raccoonlite_position_x_inch: '위치 x (인치)',
                        raccoonlite_position_y_inch: '위치 y (인치)',
                        raccoonlite_position_z_inch: '위치 z (인치)',
                        raccoonlite_teach_button: '티치 버튼',
                        raccoonlite_play_button: '재생 버튼',
                        raccoonlite_delete_button: '삭제 버튼',
                        raccoonlite_signal_strength: '신호 세기',
                        raccoonlite_when_button_state: '%1 %2 버튼을 %3 때',
                        raccoonlite_button_state: '%1 버튼을 %2?',
                        raccoonlite_battery_state: '배터리 %1?',
                        raccoonlite_charging: '충전 중?',
                        raccoonlite_conveyor_move: '컨베이어 %1 % 속도로 %2 %3 이동하기 %4',
                        raccoonlite_conveyor_change_velocity: '컨베이어 속도를 %1 만큼 바꾸기 %2',
                        raccoonlite_conveyor_set_velocity: '컨베이어 속도를 %1 %로 정하기 %2',
                        raccoonlite_conveyor_stop: '컨베이어 정지하기 %1',
                        raccoonlite_conveyor_moving: '컨베이어 움직이는 중인가?',
                        raccoonlite_conveyor_button: '컨베이어 버튼',
                        raccoonlite_conveyor_when_button_state: '%1 컨베이어 버튼을 %2 때',
                        raccoonlite_conveyor_button_state: '컨베이어 버튼을 %1?',
                    },
                    Blocks: {
                        raccoonlite_joint_1: '1번째',
                        raccoonlite_joint_2: '2번째',
                        raccoonlite_joint_3: '3번째',
                        raccoonlite_joint_4: '4번째',
                        raccoonlite_joint_all: '모든',
                        raccoonlite_unit_cm: 'cm',
                        raccoonlite_unit_inches: '인치',
                        raccoonlite_axis_x: 'x',
                        raccoonlite_axis_y: 'y',
                        raccoonlite_axis_z: 'z',
                        raccoonlite_ref_wrist: '손목',
                        raccoonlite_ref_gripper: '그리퍼',
                        raccoonlite_front: '앞쪽',
                        raccoonlite_rear: '뒤쪽',
                        raccoonlite_up: '위쪽',
                        raccoonlite_down: '아래쪽',
                        raccoonlite_on: '켜기',
                        raccoonlite_off: '끄기',
                        raccoonlite_gripper_place: '놓기 (열기)',
                        raccoonlite_gripper_pick: '집기 (닫기)',
                        raccoonlite_horizontal: '수평',
                        raccoonlite_vertical: '수직',
                        raccoonlite_sound_beep: '삐',
                        raccoonlite_sound_random_beep: '무작위 삐',
                        raccoonlite_sound_noise: '지지직',
                        raccoonlite_sound_siren: '사이렌',
                        raccoonlite_sound_engine: '엔진',
                        raccoonlite_sound_chop: '쩝',
                        raccoonlite_sound_robot: '로봇',
                        raccoonlite_sound_dibidibidip: '디비디비딥',
                        raccoonlite_sound_good_job: '잘 했어요',
                        raccoonlite_sound_random_melody: '무작위 멜로디',
                        raccoonlite_sound_wake_up: '일어나요',
                        raccoonlite_sound_start: '시작',
                        raccoonlite_sound_bye: '잘가요',
                        raccoonlite_note_c: '도',
                        raccoonlite_note_cs: '도♯ (레♭)',
                        raccoonlite_note_d: '레',
                        raccoonlite_note_ds: '레♯ (미♭)',
                        raccoonlite_note_e: '미',
                        raccoonlite_note_f: '파',
                        raccoonlite_note_fs: '파♯ (솔♭)',
                        raccoonlite_note_g: '솔',
                        raccoonlite_note_gs: '솔♯ (라♭)',
                        raccoonlite_note_a: '라',
                        raccoonlite_note_as: '라♯ (시♭)',
                        raccoonlite_note_b: '시',
                        raccoonlite_button_teach: '티치',
                        raccoonlite_button_play: '재생',
                        raccoonlite_button_delete: '삭제',
                        raccoonlite_state_pressed: '눌렀을',
                        raccoonlite_state_released: '떼었을',
                        raccoonlite_state_clicked: '클릭했을',
                        raccoonlite_state_long_pressed: '오래 눌렀을',
                        raccoonlite_bstate_pressed: '눌렀는가',
                        raccoonlite_bstate_released: '떼었는가',
                        raccoonlite_bstate_clicked: '클릭했는가',
                        raccoonlite_bstate_long_pressed: '오래 눌렀는가',
                        raccoonlite_battery_normal: '정상',
                        raccoonlite_battery_low: '부족',
                        raccoonlite_battery_empty: '없음',
                        raccoonlite_sensor_signal_strength: '신호 세기',
                        raccoonlite_sensor_battery: '배터리',
                        raccoonlite_sensor_encoder1: '1번째 관절 각도',
                        raccoonlite_sensor_encoder2: '2번째 관절 각도',
                        raccoonlite_sensor_encoder3: '3번째 관절 각도',
                        raccoonlite_sensor_encoder4: '4번째 관절 각도',
                        raccoonlite_conveyor_unit_cm: 'cm',
                        raccoonlite_conveyor_unit_mm: 'mm',
                        raccoonlite_conveyor_unit_inches: '인치',
                        raccoonlite_conveyor_unit_seconds: '초',
                    },
                    Msgs: {
                        raccoonlite_unreachable_pose_title: '라쿤: 팔이 갈 수 없는 자세입니다',
                        raccoonlite_unreachable_pose:
                            '팔이 그 자세에 도달할 수 없어서 이 블록을 건너뛰었습니다. 값을 줄여 다시 시도해 보세요.',
                        raccoonlite_delay_too_long_title: '라쿤: 기다리는 시간이 너무 깁니다',
                        raccoonlite_delay_too_long:
                            '입력한 값만큼 기다릴 수 없어 최대 시간으로 조정되었습니다. 값을 줄여 주세요.',
                        raccoonlite_reject_title: '라쿤이 아닙니다',
                        raccoonlite_reject:
                            '이 항목은 라쿤 전용입니다. 다른 로봇은 목록에서 해당 항목을 선택해 주세요. 다시 연결할 때 포트를 한 번 더 선택해야 합니다.',
                        raccoonlite_foreign_robot_title: '다른 로봇이 연결되었습니다',
                        raccoonlite_foreign_robot:
                            '라쿤이 아닌 로봇이 연결되었습니다. 이 항목에서는 이 로봇을 제어할 수 없습니다. 연결을 끊고 라쿤을 연결해 주세요.',
                    },
                },
                en: {
                    template: {
                        raccoonlite_return_to_basic_pose: 'return to basic pose %1',
                        raccoonlite_change_joint_angles_by:
                            'change joint angles by 1: %1 2: %2 3: %3 4: %4 %5',
                        raccoonlite_change_joint_angles_by_until:
                            'change and wait joint angles by 1: %1 2: %2 3: %3 4: %4 %5',
                        raccoonlite_set_joint_angles_to:
                            'set joint angles to 1: %1 2: %2 3: %3 4: %4 degrees %5',
                        raccoonlite_set_joint_angles_to_until:
                            'set and wait joint angles to 1: %1 2: %2 3: %3 4: %4 degrees %5',
                        raccoonlite_change_angle_by: 'change %1 angle by %2 %3',
                        raccoonlite_change_angle_by_until: 'change and wait %1 angle by %2 %3',
                        raccoonlite_set_angle_to: 'set %1 angle to %2 degrees %3',
                        raccoonlite_set_angle_to_until: 'set and wait %1 angle to %2 degrees %3',
                        raccoonlite_change_position_by_xyz:
                            'change position by x: %1 y: %2 z: %3 %4 %5',
                        raccoonlite_change_position_by_xyz_until:
                            'change and wait position by x: %1 y: %2 z: %3 %4 %5',
                        raccoonlite_set_position_to_xyz: 'set position to x: %1 y: %2 z: %3 %4 %5',
                        raccoonlite_set_position_to_xyz_until:
                            'set and wait position to x: %1 y: %2 z: %3 %4 %5',
                        raccoonlite_change_position_by: 'change and wait position %1 by %2 %3 %4',
                        raccoonlite_set_position_to: 'set and wait position %1 to %2 %3 %4',
                        raccoonlite_set_position_ref_to: 'set position reference to %1 %2',
                        raccoonlite_change_position_ref_by_front_up:
                            'change position reference by %1 %2 %3 %4 %5 %6',
                        raccoonlite_set_position_ref_to_front_up:
                            'set position reference to %1 %2 %3 %4 %5 %6',
                        raccoonlite_change_joint_velocities_by:
                            'change joint velocities by 1: %1 2: %2 3: %3 4: %4 %5',
                        raccoonlite_set_joint_velocities_to:
                            'set joint velocities to 1: %1 2: %2 3: %3 4: %4 % %5',
                        raccoonlite_change_velocity_by: 'change %1 velocity by %2 %3',
                        raccoonlite_set_velocity_to: 'set %1 velocity to %2 % %3',
                        raccoonlite_stop: 'stop %1 %2',
                        raccoonlite_turn_off: 'turn off %1 %2',
                        raccoonlite_turn_precision_mode: '%1 precision mode %2',
                        raccoonlite_is_moving: 'moving?',
                        raccoonlite_with_gripper: '%1 gripper %2',
                        raccoonlite_lock_gripper: 'lock gripper %1 %2',
                        raccoonlite_lock_gripper_until: 'lock and wait gripper %1 %2',
                        raccoonlite_unlock_gripper: 'unlock gripper %1',
                        raccoonlite_gripper_state: 'gripper state',
                        raccoonlite_play_sound: 'play sound %1 %2',
                        raccoonlite_play_sound_times: 'play sound %1 %2 times %3',
                        raccoonlite_play_sound_until: 'play and wait sound %1 %2 times %3',
                        raccoonlite_clear_sound: 'stop sound %1',
                        raccoonlite_play_note: 'play note %1 %2 %3',
                        raccoonlite_play_note_beat: 'play note %1 %2 for %3 beats %4',
                        raccoonlite_rest_beat: 'rest for %1 beats %2',
                        raccoonlite_change_tempo: 'change tempo by %1 %2',
                        raccoonlite_set_tempo: 'set tempo to %1 bpm %2',
                        raccoonlite_is_sound_playing: 'sound playing?',
                        raccoonlite_encoder1: 'joint 1 angle',
                        raccoonlite_encoder2: 'joint 2 angle',
                        raccoonlite_encoder3: 'joint 3 angle',
                        raccoonlite_encoder4: 'joint 4 angle',
                        raccoonlite_position_x: 'position x (cm)',
                        raccoonlite_position_y: 'position y (cm)',
                        raccoonlite_position_z: 'position z (cm)',
                        raccoonlite_position_x_inch: 'position x (inches)',
                        raccoonlite_position_y_inch: 'position y (inches)',
                        raccoonlite_position_z_inch: 'position z (inches)',
                        raccoonlite_teach_button: 'teach button',
                        raccoonlite_play_button: 'play button',
                        raccoonlite_delete_button: 'delete button',
                        raccoonlite_signal_strength: 'signal strength',
                        raccoonlite_when_button_state: '%1 when %2 button %3',
                        raccoonlite_button_state: '%1 button %2?',
                        raccoonlite_battery_state: 'battery %1?',
                        raccoonlite_charging: 'charging?',
                        raccoonlite_conveyor_move: 'move conveyor %2 %3 at %1 % speed %4',
                        raccoonlite_conveyor_change_velocity: 'change conveyor velocity by %1 %2',
                        raccoonlite_conveyor_set_velocity: 'set conveyor velocity to %1 % %2',
                        raccoonlite_conveyor_stop: 'stop conveyor %1',
                        raccoonlite_conveyor_moving: 'conveyor moving?',
                        raccoonlite_conveyor_button: 'conveyor button',
                        raccoonlite_conveyor_when_button_state: '%1 when conveyor button %2',
                        raccoonlite_conveyor_button_state: 'conveyor button %1?',
                    },
                    Blocks: {
                        raccoonlite_joint_1: 'joint 1',
                        raccoonlite_joint_2: 'joint 2',
                        raccoonlite_joint_3: 'joint 3',
                        raccoonlite_joint_4: 'joint 4',
                        raccoonlite_joint_all: 'all joint',
                        raccoonlite_unit_cm: 'cm',
                        raccoonlite_unit_inches: 'inches',
                        raccoonlite_axis_x: 'x',
                        raccoonlite_axis_y: 'y',
                        raccoonlite_axis_z: 'z',
                        raccoonlite_ref_wrist: 'wrist',
                        raccoonlite_ref_gripper: 'gripper',
                        raccoonlite_front: 'front',
                        raccoonlite_rear: 'rear',
                        raccoonlite_up: 'up',
                        raccoonlite_down: 'down',
                        raccoonlite_on: 'turn on',
                        raccoonlite_off: 'turn off',
                        raccoonlite_gripper_place: 'place (open)',
                        raccoonlite_gripper_pick: 'pick (close)',
                        raccoonlite_horizontal: 'horizontally',
                        raccoonlite_vertical: 'vertically',
                        raccoonlite_sound_beep: 'beep',
                        raccoonlite_sound_random_beep: 'random beep',
                        raccoonlite_sound_noise: 'noise',
                        raccoonlite_sound_siren: 'siren',
                        raccoonlite_sound_engine: 'engine',
                        raccoonlite_sound_chop: 'chop',
                        raccoonlite_sound_robot: 'robot',
                        raccoonlite_sound_dibidibidip: 'dibidibidip',
                        raccoonlite_sound_good_job: 'good job',
                        raccoonlite_sound_random_melody: 'random melody',
                        raccoonlite_sound_wake_up: 'wake up',
                        raccoonlite_sound_start: 'start',
                        raccoonlite_sound_bye: 'bye',
                        raccoonlite_note_c: 'C',
                        raccoonlite_note_cs: 'C♯ (D♭)',
                        raccoonlite_note_d: 'D',
                        raccoonlite_note_ds: 'D♯ (E♭)',
                        raccoonlite_note_e: 'E',
                        raccoonlite_note_f: 'F',
                        raccoonlite_note_fs: 'F♯ (G♭)',
                        raccoonlite_note_g: 'G',
                        raccoonlite_note_gs: 'G♯ (A♭)',
                        raccoonlite_note_a: 'A',
                        raccoonlite_note_as: 'A♯ (B♭)',
                        raccoonlite_note_b: 'B',
                        raccoonlite_button_teach: 'teach',
                        raccoonlite_button_play: 'play',
                        raccoonlite_button_delete: 'delete',
                        raccoonlite_state_pressed: 'pressed',
                        raccoonlite_state_released: 'released',
                        raccoonlite_state_clicked: 'clicked',
                        raccoonlite_state_long_pressed: 'long-pressed',
                        raccoonlite_bstate_pressed: 'pressed',
                        raccoonlite_bstate_released: 'released',
                        raccoonlite_bstate_clicked: 'clicked',
                        raccoonlite_bstate_long_pressed: 'long-pressed',
                        raccoonlite_battery_normal: 'normal',
                        raccoonlite_battery_low: 'low',
                        raccoonlite_battery_empty: 'empty',
                        raccoonlite_sensor_signal_strength: 'signal strength',
                        raccoonlite_sensor_battery: 'battery',
                        raccoonlite_sensor_encoder1: 'joint 1 angle',
                        raccoonlite_sensor_encoder2: 'joint 2 angle',
                        raccoonlite_sensor_encoder3: 'joint 3 angle',
                        raccoonlite_sensor_encoder4: 'joint 4 angle',
                        raccoonlite_conveyor_unit_cm: 'cm',
                        raccoonlite_conveyor_unit_mm: 'mm',
                        raccoonlite_conveyor_unit_inches: 'inches',
                        raccoonlite_conveyor_unit_seconds: 'seconds',
                    },
                    Msgs: {
                        raccoonlite_unreachable_pose_title:
                            'Raccoon: the arm cannot reach this pose',
                        raccoonlite_unreachable_pose:
                            'This block was skipped because the arm cannot reach that pose. Try a smaller value.',
                        raccoonlite_delay_too_long_title: 'Raccoon: the wait is too long',
                        raccoonlite_delay_too_long:
                            'The wait you asked for is longer than possible, so it was shortened. Try a smaller value.',
                        raccoonlite_reject_title: 'Raccoon is not connected',
                        raccoonlite_reject:
                            'This item is for Raccoon only. For another robot, pick the matching item from the list. You will need to choose the port again when you reconnect.',
                        raccoonlite_foreign_robot_title: 'A different robot is connected',
                        raccoonlite_foreign_robot:
                            'A robot other than Raccoon is connected. This item cannot control it. Disconnect and connect a Raccoon.',
                    },
                },
                jp: {
                    template: {
                        raccoonlite_return_to_basic_pose: '基本姿勢に戻る %1',
                        raccoonlite_change_joint_angles_by:
                            '関節の角度を 1:%1 2:%2 3:%3 4:%4 ずつ変える %5',
                        raccoonlite_change_joint_angles_by_until:
                            '関節の角度を 1:%1 2:%2 3:%3 4:%4 ずつ変えて待つ %5',
                        raccoonlite_set_joint_angles_to:
                            '関節の角度を 1:%1 2:%2 3:%3 4:%4 度にする %5',
                        raccoonlite_set_joint_angles_to_until:
                            '関節の角度を 1:%1 2:%2 3:%3 4:%4 度にして待つ %5',
                        raccoonlite_change_angle_by: '%1 関節の角度を %2 ずつ変える %3',
                        raccoonlite_change_angle_by_until: '%1 関節の角度を %2 ずつ変えて待つ %3',
                        raccoonlite_set_angle_to: '%1 関節の角度を %2 度にする %3',
                        raccoonlite_set_angle_to_until: '%1 関節の角度を %2 度にして待つ %3',
                        raccoonlite_change_position_by_xyz:
                            '位置を x:%1 y:%2 z:%3 %4 ずつ変える %5',
                        raccoonlite_change_position_by_xyz_until:
                            '位置を x:%1 y:%2 z:%3 %4 ずつ変えて待つ %5',
                        raccoonlite_set_position_to_xyz: '位置を x:%1 y:%2 z:%3 %4 にする %5',
                        raccoonlite_set_position_to_xyz_until:
                            '位置を x:%1 y:%2 z:%3 %4 にして待つ %5',
                        raccoonlite_change_position_by: '位置 %1 を %2 %3 ずつ変えて待つ %4',
                        raccoonlite_set_position_to: '位置 %1 を %2 %3 にして待つ %4',
                        raccoonlite_set_position_ref_to: '位置基準を %1 にする %2',
                        raccoonlite_change_position_ref_by_front_up:
                            '位置基準を %1 %2 %3 %4 %5 ずつ変える %6',
                        raccoonlite_set_position_ref_to_front_up:
                            '位置基準を %1 %2 %3 %4 %5 にする %6',
                        raccoonlite_change_joint_velocities_by:
                            '関節の速さを 1:%1 2:%2 3:%3 4:%4 ずつ変える %5',
                        raccoonlite_set_joint_velocities_to:
                            '関節の速さを 1:%1 2:%2 3:%3 4:%4 %にする %5',
                        raccoonlite_change_velocity_by: '%1 関節の速さを %2 ずつ変える %3',
                        raccoonlite_set_velocity_to: '%1 関節の速さを %2 %にする %3',
                        raccoonlite_stop: '%1 関節を停止する %2',
                        raccoonlite_turn_off: '%1 関節の電源をオフにする %2',
                        raccoonlite_turn_precision_mode: '精密モードを %1 %2',
                        raccoonlite_is_moving: '動かしているか?',
                        raccoonlite_with_gripper: 'グリッパー %1 %2',
                        raccoonlite_lock_gripper: 'グリッパーを %1 方向に固定する %2',
                        raccoonlite_lock_gripper_until: 'グリッパーを %1 方向に固定して待つ %2',
                        raccoonlite_unlock_gripper: 'グリッパーの固定を解除する %1',
                        raccoonlite_gripper_state: 'グリッパーの状態',
                        raccoonlite_play_sound: '%1 音を再生する %2',
                        raccoonlite_play_sound_times: '%1 音を %2 回再生する %3',
                        raccoonlite_play_sound_until: '%1 音を %2 回再生して待つ %3',
                        raccoonlite_clear_sound: '音をオフにする %1',
                        raccoonlite_play_note: '%1 %2 音を奏でる %3',
                        raccoonlite_play_note_beat: '%1 %2 音を %3 拍子奏でる %4',
                        raccoonlite_rest_beat: '%1 拍子止める %2',
                        raccoonlite_change_tempo: '演奏の速さを %1 ずつ変える %2',
                        raccoonlite_set_tempo: '演奏の速さを %1 BPMにする %2',
                        raccoonlite_is_sound_playing: '音を出しているか?',
                        raccoonlite_encoder1: '1番目の関節角度',
                        raccoonlite_encoder2: '2番目の関節角度',
                        raccoonlite_encoder3: '3番目の関節角度',
                        raccoonlite_encoder4: '4番目の関節角度',
                        raccoonlite_position_x: '位置x(cm)',
                        raccoonlite_position_y: '位置y(cm)',
                        raccoonlite_position_z: '位置z(cm)',
                        raccoonlite_position_x_inch: '位置x(インチ)',
                        raccoonlite_position_y_inch: '位置y(インチ)',
                        raccoonlite_position_z_inch: '位置z(インチ)',
                        raccoonlite_teach_button: 'ティーチボタン',
                        raccoonlite_play_button: '再生ボタン',
                        raccoonlite_delete_button: '削除ボタン',
                        raccoonlite_signal_strength: '信号強度',
                        raccoonlite_when_button_state: '%1 %2 ボタンを %3 とき',
                        raccoonlite_button_state: '%1 ボタンを %2?',
                        raccoonlite_battery_state: '電池充電が %1?',
                        raccoonlite_charging: '充電中?',
                        raccoonlite_conveyor_move: 'コンベヤーを %1 %速度に %2 %3 移動する %4',
                        raccoonlite_conveyor_change_velocity: 'コンベヤーの速さを %1 ずつ変える %2',
                        raccoonlite_conveyor_set_velocity: 'コンベヤーの速さを %1 %にする %2',
                        raccoonlite_conveyor_stop: 'コンベヤーを停止する %1',
                        raccoonlite_conveyor_moving: 'コンベヤーを動かしているか?',
                        raccoonlite_conveyor_button: 'コンベヤーボタン',
                        raccoonlite_conveyor_when_button_state: '%1 コンベヤーボタンを %2 とき',
                        raccoonlite_conveyor_button_state: 'コンベヤーボタンを %1?',
                    },
                    Blocks: {
                        raccoonlite_joint_1: '1番目',
                        raccoonlite_joint_2: '2番目',
                        raccoonlite_joint_3: '3番目',
                        raccoonlite_joint_4: '4番目',
                        raccoonlite_joint_all: 'すべて',
                        raccoonlite_unit_cm: 'cm',
                        raccoonlite_unit_inches: 'インチ',
                        raccoonlite_axis_x: 'x',
                        raccoonlite_axis_y: 'y',
                        raccoonlite_axis_z: 'z',
                        raccoonlite_ref_wrist: '手首',
                        raccoonlite_ref_gripper: 'グリッパー',
                        raccoonlite_front: '前',
                        raccoonlite_rear: '後',
                        raccoonlite_up: '上',
                        raccoonlite_down: '下',
                        raccoonlite_on: 'オンにする',
                        raccoonlite_off: 'オフにする',
                        raccoonlite_gripper_place: 'おく(開く)',
                        raccoonlite_gripper_pick: 'ひろう(閉める)',
                        raccoonlite_horizontal: '水平',
                        raccoonlite_vertical: '垂直',
                        raccoonlite_sound_beep: 'ビープ',
                        raccoonlite_sound_random_beep: 'ランダムビープ',
                        raccoonlite_sound_noise: 'ノイズ',
                        raccoonlite_sound_siren: 'サイレン',
                        raccoonlite_sound_engine: 'エンジン',
                        raccoonlite_sound_chop: 'チョップ',
                        raccoonlite_sound_robot: 'ロボット',
                        raccoonlite_sound_dibidibidip: 'ディバディバディップ',
                        raccoonlite_sound_good_job: 'よくできました',
                        raccoonlite_sound_random_melody: 'ランダムメロディ',
                        raccoonlite_sound_wake_up: '起きろ',
                        raccoonlite_sound_start: '再開',
                        raccoonlite_sound_bye: 'さよなら',
                        raccoonlite_note_c: 'ド',
                        raccoonlite_note_cs: 'ド♯ (レ♭)',
                        raccoonlite_note_d: 'レ',
                        raccoonlite_note_ds: 'レ♯ (ミ♭)',
                        raccoonlite_note_e: 'ミ',
                        raccoonlite_note_f: 'ファ',
                        raccoonlite_note_fs: 'ファ♯ (ソ♭)',
                        raccoonlite_note_g: 'ソ',
                        raccoonlite_note_gs: 'ソ♯ (ラ♭)',
                        raccoonlite_note_a: 'ラ',
                        raccoonlite_note_as: 'ラ♯ (シ♭)',
                        raccoonlite_note_b: 'シ',
                        raccoonlite_button_teach: 'ティーチ',
                        raccoonlite_button_play: '再生',
                        raccoonlite_button_delete: '削除',
                        raccoonlite_state_pressed: '押した',
                        raccoonlite_state_released: '離した',
                        raccoonlite_state_clicked: 'クリックした',
                        raccoonlite_state_long_pressed: '長く押した',
                        raccoonlite_bstate_pressed: '押したか',
                        raccoonlite_bstate_released: '離したか',
                        raccoonlite_bstate_clicked: 'クリックしたか',
                        raccoonlite_bstate_long_pressed: '長く押したか',
                        raccoonlite_battery_normal: '正常か',
                        raccoonlite_battery_low: '不足しているか',
                        raccoonlite_battery_empty: 'なくなったか',
                        raccoonlite_sensor_signal_strength: '信号強度',
                        raccoonlite_sensor_battery: '電池',
                        raccoonlite_sensor_encoder1: '1番目の関節角度',
                        raccoonlite_sensor_encoder2: '2番目の関節角度',
                        raccoonlite_sensor_encoder3: '3番目の関節角度',
                        raccoonlite_sensor_encoder4: '4番目の関節角度',
                        raccoonlite_conveyor_unit_cm: 'cm',
                        raccoonlite_conveyor_unit_mm: 'mm',
                        raccoonlite_conveyor_unit_inches: 'インチ',
                        raccoonlite_conveyor_unit_seconds: '秒',
                    },
                    Msgs: {
                        raccoonlite_unreachable_pose_title: 'ラクーン: アームが届かない姿勢です',
                        raccoonlite_unreachable_pose:
                            'アームがその姿勢に届かないため、このブロックをとばしました。値を小さくしてもう一度試してください。',
                        raccoonlite_delay_too_long_title: 'ラクーン: 待ち時間が長すぎます',
                        raccoonlite_delay_too_long:
                            '入力した分だけ待てないため、最大時間に調整されました。値を小さくしてください。',
                        raccoonlite_reject_title: 'ラクーンではありません',
                        raccoonlite_reject:
                            'この項目はラクーン専用です。ほかのロボットは一覧から該当する項目を選んでください。再接続のときはポートをもう一度選ぶ必要があります。',
                        raccoonlite_foreign_robot_title: 'ほかのロボットが接続されました',
                        raccoonlite_foreign_robot:
                            'ラクーン以外のロボットが接続されました。この項目ではこのロボットを制御できません。接続を切ってラクーンを接続してください。',
                    },
                },
                vn: {
                    template: {
                        raccoonlite_return_to_basic_pose: 'return to basic pose %1',
                        raccoonlite_change_joint_angles_by:
                            'change joint angles by 1: %1 2: %2 3: %3 4: %4 %5',
                        raccoonlite_change_joint_angles_by_until:
                            'change and wait joint angles by 1: %1 2: %2 3: %3 4: %4 %5',
                        raccoonlite_set_joint_angles_to:
                            'set joint angles to 1: %1 2: %2 3: %3 4: %4 degrees %5',
                        raccoonlite_set_joint_angles_to_until:
                            'set and wait joint angles to 1: %1 2: %2 3: %3 4: %4 degrees %5',
                        raccoonlite_change_angle_by: 'change %1 angle by %2 %3',
                        raccoonlite_change_angle_by_until: 'change and wait %1 angle by %2 %3',
                        raccoonlite_set_angle_to: 'set %1 angle to %2 degrees %3',
                        raccoonlite_set_angle_to_until: 'set and wait %1 angle to %2 degrees %3',
                        raccoonlite_change_position_by_xyz:
                            'change position by x: %1 y: %2 z: %3 %4 %5',
                        raccoonlite_change_position_by_xyz_until:
                            'change and wait position by x: %1 y: %2 z: %3 %4 %5',
                        raccoonlite_set_position_to_xyz: 'set position to x: %1 y: %2 z: %3 %4 %5',
                        raccoonlite_set_position_to_xyz_until:
                            'set and wait position to x: %1 y: %2 z: %3 %4 %5',
                        raccoonlite_change_position_by: 'change and wait position %1 by %2 %3 %4',
                        raccoonlite_set_position_to: 'set and wait position %1 to %2 %3 %4',
                        raccoonlite_set_position_ref_to: 'set position reference to %1 %2',
                        raccoonlite_change_position_ref_by_front_up:
                            'change position reference by %1 %2 %3 %4 %5 %6',
                        raccoonlite_set_position_ref_to_front_up:
                            'set position reference to %1 %2 %3 %4 %5 %6',
                        raccoonlite_change_joint_velocities_by:
                            'change joint velocities by 1: %1 2: %2 3: %3 4: %4 %5',
                        raccoonlite_set_joint_velocities_to:
                            'set joint velocities to 1: %1 2: %2 3: %3 4: %4 % %5',
                        raccoonlite_change_velocity_by: 'change %1 velocity by %2 %3',
                        raccoonlite_set_velocity_to: 'set %1 velocity to %2 % %3',
                        raccoonlite_stop: 'stop %1 %2',
                        raccoonlite_turn_off: 'turn off %1 %2',
                        raccoonlite_turn_precision_mode: '%1 precision mode %2',
                        raccoonlite_is_moving: 'moving?',
                        raccoonlite_with_gripper: '%1 gripper %2',
                        raccoonlite_lock_gripper: 'lock gripper %1 %2',
                        raccoonlite_lock_gripper_until: 'lock and wait gripper %1 %2',
                        raccoonlite_unlock_gripper: 'unlock gripper %1',
                        raccoonlite_gripper_state: 'gripper state',
                        raccoonlite_play_sound: 'play sound %1 %2',
                        raccoonlite_play_sound_times: 'play sound %1 %2 times %3',
                        raccoonlite_play_sound_until: 'play and wait sound %1 %2 times %3',
                        raccoonlite_clear_sound: 'stop sound %1',
                        raccoonlite_play_note: 'play note %1 %2 %3',
                        raccoonlite_play_note_beat: 'play note %1 %2 for %3 beats %4',
                        raccoonlite_rest_beat: 'rest for %1 beats %2',
                        raccoonlite_change_tempo: 'change tempo by %1 %2',
                        raccoonlite_set_tempo: 'set tempo to %1 bpm %2',
                        raccoonlite_is_sound_playing: 'sound playing?',
                        raccoonlite_encoder1: 'joint 1 angle',
                        raccoonlite_encoder2: 'joint 2 angle',
                        raccoonlite_encoder3: 'joint 3 angle',
                        raccoonlite_encoder4: 'joint 4 angle',
                        raccoonlite_position_x: 'position x (cm)',
                        raccoonlite_position_y: 'position y (cm)',
                        raccoonlite_position_z: 'position z (cm)',
                        raccoonlite_position_x_inch: 'position x (inches)',
                        raccoonlite_position_y_inch: 'position y (inches)',
                        raccoonlite_position_z_inch: 'position z (inches)',
                        raccoonlite_teach_button: 'teach button',
                        raccoonlite_play_button: 'play button',
                        raccoonlite_delete_button: 'delete button',
                        raccoonlite_signal_strength: 'signal strength',
                        raccoonlite_when_button_state: '%1 when %2 button %3',
                        raccoonlite_button_state: '%1 button %2?',
                        raccoonlite_battery_state: 'battery %1?',
                        raccoonlite_charging: 'charging?',
                        raccoonlite_conveyor_move: 'move conveyor %2 %3 at %1 % speed %4',
                        raccoonlite_conveyor_change_velocity: 'change conveyor velocity by %1 %2',
                        raccoonlite_conveyor_set_velocity: 'set conveyor velocity to %1 % %2',
                        raccoonlite_conveyor_stop: 'stop conveyor %1',
                        raccoonlite_conveyor_moving: 'conveyor moving?',
                        raccoonlite_conveyor_button: 'conveyor button',
                        raccoonlite_conveyor_when_button_state: '%1 when conveyor button %2',
                        raccoonlite_conveyor_button_state: 'conveyor button %1?',
                    },
                    Blocks: {
                        raccoonlite_joint_1: 'joint 1',
                        raccoonlite_joint_2: 'joint 2',
                        raccoonlite_joint_3: 'joint 3',
                        raccoonlite_joint_4: 'joint 4',
                        raccoonlite_joint_all: 'all joint',
                        raccoonlite_unit_cm: 'cm',
                        raccoonlite_unit_inches: 'inches',
                        raccoonlite_axis_x: 'x',
                        raccoonlite_axis_y: 'y',
                        raccoonlite_axis_z: 'z',
                        raccoonlite_ref_wrist: 'wrist',
                        raccoonlite_ref_gripper: 'gripper',
                        raccoonlite_front: 'front',
                        raccoonlite_rear: 'rear',
                        raccoonlite_up: 'up',
                        raccoonlite_down: 'down',
                        raccoonlite_on: 'turn on',
                        raccoonlite_off: 'turn off',
                        raccoonlite_gripper_place: 'place (open)',
                        raccoonlite_gripper_pick: 'pick (close)',
                        raccoonlite_horizontal: 'horizontally',
                        raccoonlite_vertical: 'vertically',
                        raccoonlite_sound_beep: 'beep',
                        raccoonlite_sound_random_beep: 'random beep',
                        raccoonlite_sound_noise: 'noise',
                        raccoonlite_sound_siren: 'siren',
                        raccoonlite_sound_engine: 'engine',
                        raccoonlite_sound_chop: 'chop',
                        raccoonlite_sound_robot: 'robot',
                        raccoonlite_sound_dibidibidip: 'dibidibidip',
                        raccoonlite_sound_good_job: 'good job',
                        raccoonlite_sound_random_melody: 'random melody',
                        raccoonlite_sound_wake_up: 'wake up',
                        raccoonlite_sound_start: 'start',
                        raccoonlite_sound_bye: 'bye',
                        raccoonlite_note_c: 'C',
                        raccoonlite_note_cs: 'C♯ (D♭)',
                        raccoonlite_note_d: 'D',
                        raccoonlite_note_ds: 'D♯ (E♭)',
                        raccoonlite_note_e: 'E',
                        raccoonlite_note_f: 'F',
                        raccoonlite_note_fs: 'F♯ (G♭)',
                        raccoonlite_note_g: 'G',
                        raccoonlite_note_gs: 'G♯ (A♭)',
                        raccoonlite_note_a: 'A',
                        raccoonlite_note_as: 'A♯ (B♭)',
                        raccoonlite_note_b: 'B',
                        raccoonlite_button_teach: 'teach',
                        raccoonlite_button_play: 'play',
                        raccoonlite_button_delete: 'delete',
                        raccoonlite_state_pressed: 'pressed',
                        raccoonlite_state_released: 'released',
                        raccoonlite_state_clicked: 'clicked',
                        raccoonlite_state_long_pressed: 'long-pressed',
                        raccoonlite_bstate_pressed: 'pressed',
                        raccoonlite_bstate_released: 'released',
                        raccoonlite_bstate_clicked: 'clicked',
                        raccoonlite_bstate_long_pressed: 'long-pressed',
                        raccoonlite_battery_normal: 'normal',
                        raccoonlite_battery_low: 'low',
                        raccoonlite_battery_empty: 'empty',
                        raccoonlite_sensor_signal_strength: 'signal strength',
                        raccoonlite_sensor_battery: 'battery',
                        raccoonlite_sensor_encoder1: 'joint 1 angle',
                        raccoonlite_sensor_encoder2: 'joint 2 angle',
                        raccoonlite_sensor_encoder3: 'joint 3 angle',
                        raccoonlite_sensor_encoder4: 'joint 4 angle',
                        raccoonlite_conveyor_unit_cm: 'cm',
                        raccoonlite_conveyor_unit_mm: 'mm',
                        raccoonlite_conveyor_unit_inches: 'inches',
                        raccoonlite_conveyor_unit_seconds: 'seconds',
                    },
                    Msgs: {
                        raccoonlite_unreachable_pose_title:
                            'Raccoon: cánh tay không thể đến tư thế này',
                        raccoonlite_unreachable_pose:
                            'Khối này đã bị bỏ qua vì cánh tay không thể đến tư thế đó. Hãy thử giá trị nhỏ hơn.',
                        raccoonlite_delay_too_long_title: 'Raccoon: thời gian chờ quá dài',
                        raccoonlite_delay_too_long:
                            'Không thể chờ lâu như vậy nên đã rút ngắn về mức tối đa. Hãy thử giá trị nhỏ hơn.',
                        raccoonlite_reject_title: 'Chưa kết nối Raccoon',
                        raccoonlite_reject:
                            'Mục này chỉ dành cho Raccoon. Với robot khác, hãy chọn mục tương ứng trong danh sách. Khi kết nối lại bạn cần chọn cổng một lần nữa.',
                        raccoonlite_foreign_robot_title: 'Một robot khác đã được kết nối',
                        raccoonlite_foreign_robot:
                            'Một robot không phải Raccoon đã được kết nối. Mục này không thể điều khiển robot đó. Hãy ngắt kết nối và kết nối Raccoon.',
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
                [Lang.Blocks.raccoonlite_joint_1, 'JOINT1'],
                [Lang.Blocks.raccoonlite_joint_2, 'JOINT2'],
                [Lang.Blocks.raccoonlite_joint_3, 'JOINT3'],
                [Lang.Blocks.raccoonlite_joint_4, 'JOINT4'],
                [Lang.Blocks.raccoonlite_joint_all, 'ALL'],
            ];
            const OPT_UNIT = [
                [Lang.Blocks.raccoonlite_unit_cm, 'CM'],
                [Lang.Blocks.raccoonlite_unit_inches, 'INCHES'],
            ];
            const OPT_XYZ = [
                [Lang.Blocks.raccoonlite_axis_x, 'X'],
                [Lang.Blocks.raccoonlite_axis_y, 'Y'],
                [Lang.Blocks.raccoonlite_axis_z, 'Z'],
            ];
            const OPT_REF = [
                [Lang.Blocks.raccoonlite_ref_wrist, 'WRIST'],
                [Lang.Blocks.raccoonlite_ref_gripper, 'GRIPPER'],
            ];
            const OPT_FRONT_REAR = [
                [Lang.Blocks.raccoonlite_front, 'FRONT'],
                [Lang.Blocks.raccoonlite_rear, 'REAR'],
            ];
            const OPT_UP_DOWN = [
                [Lang.Blocks.raccoonlite_up, 'UP'],
                [Lang.Blocks.raccoonlite_down, 'DOWN'],
            ];
            const OPT_ON_OFF = [
                [Lang.Blocks.raccoonlite_on, 'ON'],
                [Lang.Blocks.raccoonlite_off, 'OFF'],
            ];
            const OPT_PICK_PLACE = [
                [Lang.Blocks.raccoonlite_gripper_place, 'PLACE'],
                [Lang.Blocks.raccoonlite_gripper_pick, 'PICK'],
            ];
            const OPT_HORZ_VERT = [
                [Lang.Blocks.raccoonlite_horizontal, 'HORIZONTAL'],
                [Lang.Blocks.raccoonlite_vertical, 'VERTICAL'],
            ];
            const OPT_SOUND = [
                [Lang.Blocks.raccoonlite_sound_beep, 'BEEP'],
                [Lang.Blocks.raccoonlite_sound_random_beep, 'RANDOM_BEEP'],
                [Lang.Blocks.raccoonlite_sound_noise, 'NOISE'],
                [Lang.Blocks.raccoonlite_sound_siren, 'SIREN'],
                [Lang.Blocks.raccoonlite_sound_engine, 'ENGINE'],
                [Lang.Blocks.raccoonlite_sound_chop, 'CHOP'],
                [Lang.Blocks.raccoonlite_sound_robot, 'ROBOT'],
                [Lang.Blocks.raccoonlite_sound_dibidibidip, 'DIBIDIBIDIP'],
                [Lang.Blocks.raccoonlite_sound_good_job, 'GOOD_JOB'],
                [Lang.Blocks.raccoonlite_sound_random_melody, 'RANDOM_MELODY'],
                [Lang.Blocks.raccoonlite_sound_wake_up, 'WAKE_UP'],
                [Lang.Blocks.raccoonlite_sound_start, 'START'],
                [Lang.Blocks.raccoonlite_sound_bye, 'BYE'],
            ];
            const OPT_NOTE = [
                [Lang.Blocks.raccoonlite_note_c, 'C'],
                [Lang.Blocks.raccoonlite_note_cs, 'CS'],
                [Lang.Blocks.raccoonlite_note_d, 'D'],
                [Lang.Blocks.raccoonlite_note_ds, 'DS'],
                [Lang.Blocks.raccoonlite_note_e, 'E'],
                [Lang.Blocks.raccoonlite_note_f, 'F'],
                [Lang.Blocks.raccoonlite_note_fs, 'FS'],
                [Lang.Blocks.raccoonlite_note_g, 'G'],
                [Lang.Blocks.raccoonlite_note_gs, 'GS'],
                [Lang.Blocks.raccoonlite_note_a, 'A'],
                [Lang.Blocks.raccoonlite_note_as, 'AS'],
                [Lang.Blocks.raccoonlite_note_b, 'B'],
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
                [Lang.Blocks.raccoonlite_button_teach, 'TEACH'],
                [Lang.Blocks.raccoonlite_button_play, 'PLAY'],
                [Lang.Blocks.raccoonlite_button_delete, 'DELETE'],
            ];
            const OPT_WHEN_STATE = [
                [Lang.Blocks.raccoonlite_state_pressed, 'PRESSED'],
                [Lang.Blocks.raccoonlite_state_released, 'RELEASED'],
                [Lang.Blocks.raccoonlite_state_clicked, 'CLICKED'],
                [Lang.Blocks.raccoonlite_state_long_pressed, 'LONG_PRESSED'],
            ];
            const OPT_BUTTON_STATE = [
                [Lang.Blocks.raccoonlite_bstate_pressed, 'PRESSED'],
                [Lang.Blocks.raccoonlite_bstate_released, 'RELEASED'],
                [Lang.Blocks.raccoonlite_bstate_clicked, 'CLICKED'],
                [Lang.Blocks.raccoonlite_bstate_long_pressed, 'LONG_PRESSED'],
            ];
            const OPT_BATTERY = [
                [Lang.Blocks.raccoonlite_battery_normal, 'NORMAL'],
                [Lang.Blocks.raccoonlite_battery_low, 'LOW'],
                [Lang.Blocks.raccoonlite_battery_empty, 'EMPTY'],
            ];

            const OPT_CONVEYOR_UNIT = [
                [Lang.Blocks.raccoonlite_conveyor_unit_cm, 'CM'],
                [Lang.Blocks.raccoonlite_conveyor_unit_mm, 'MM'],
                [Lang.Blocks.raccoonlite_conveyor_unit_inches, 'INCHES'],
                [Lang.Blocks.raccoonlite_conveyor_unit_seconds, 'SECONDS'],
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
                isNotFor: ['RaccoonLite'],
                func(sprite, script) {
                    return Entry.RaccoonLite[method](script);
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
                isNotFor: ['RaccoonLite'],
                func(sprite, script) {
                    return Entry.RaccoonLite[method](script);
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
                isNotFor: ['RaccoonLite'],
                func(sprite, script) {
                    return Entry.RaccoonLite[method](script);
                },
            });

            const anglesParams = [
                numberInput(),
                numberInput(),
                numberInput(),
                numberInput(),
                indicator(),
            ];
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
                raccoonlite_return_to_basic_pose: command(
                    'raccoonlite_return_to_basic_pose',
                    [indicator()],
                    [null],
                    {},
                    'raccoonlite_joint',
                    'returnToBasicPose'
                ),
                raccoonlite_change_joint_angles_by: command(
                    'raccoonlite_change_joint_angles_by',
                    anglesParams,
                    anglesDef,
                    anglesKeyMap,
                    'raccoonlite_joint',
                    'changeJointAnglesBy'
                ),
                raccoonlite_change_joint_angles_by_until: command(
                    'raccoonlite_change_joint_angles_by_until',
                    anglesParams,
                    anglesDef,
                    anglesKeyMap,
                    'raccoonlite_joint',
                    'changeJointAnglesByUntil'
                ),
                raccoonlite_set_joint_angles_to: command(
                    'raccoonlite_set_joint_angles_to',
                    anglesParams,
                    anglesDef,
                    anglesKeyMap,
                    'raccoonlite_joint',
                    'setJointAnglesTo'
                ),
                raccoonlite_set_joint_angles_to_until: command(
                    'raccoonlite_set_joint_angles_to_until',
                    anglesParams,
                    anglesDef,
                    anglesKeyMap,
                    'raccoonlite_joint',
                    'setJointAnglesToUntil'
                ),
                raccoonlite_change_angle_by: command(
                    'raccoonlite_change_angle_by',
                    [dropdown(OPT_JOINT, 'JOINT1'), numberInput(), indicator()],
                    [null, text('10'), null],
                    { JOINT: 0, DEGREE: 1 },
                    'raccoonlite_joint',
                    'changeAngleBy'
                ),
                raccoonlite_change_angle_by_until: command(
                    'raccoonlite_change_angle_by_until',
                    [dropdown(OPT_JOINT, 'JOINT1'), numberInput(), indicator()],
                    [null, text('10'), null],
                    { JOINT: 0, DEGREE: 1 },
                    'raccoonlite_joint',
                    'changeAngleByUntil'
                ),
                raccoonlite_set_angle_to: command(
                    'raccoonlite_set_angle_to',
                    [dropdown(OPT_JOINT, 'JOINT1'), numberInput(), indicator()],
                    [null, text('0'), null],
                    { JOINT: 0, DEGREE: 1 },
                    'raccoonlite_joint',
                    'setAngleTo'
                ),
                raccoonlite_set_angle_to_until: command(
                    'raccoonlite_set_angle_to_until',
                    [dropdown(OPT_JOINT, 'JOINT1'), numberInput(), indicator()],
                    [null, text('0'), null],
                    { JOINT: 0, DEGREE: 1 },
                    'raccoonlite_joint',
                    'setAngleToUntil'
                ),
                raccoonlite_change_position_by_xyz: command(
                    'raccoonlite_change_position_by_xyz',
                    xyzParams,
                    xyzDef,
                    xyzKeyMap,
                    'raccoonlite_position',
                    'changePositionByXYZ'
                ),
                raccoonlite_change_position_by_xyz_until: command(
                    'raccoonlite_change_position_by_xyz_until',
                    xyzParams,
                    xyzDef,
                    xyzKeyMap,
                    'raccoonlite_position',
                    'changePositionByXYZUntil'
                ),
                raccoonlite_set_position_to_xyz: command(
                    'raccoonlite_set_position_to_xyz',
                    xyzParams,
                    xyzDef,
                    xyzKeyMap,
                    'raccoonlite_position',
                    'setPositionToXYZ'
                ),
                raccoonlite_set_position_to_xyz_until: command(
                    'raccoonlite_set_position_to_xyz_until',
                    xyzParams,
                    xyzDef,
                    xyzKeyMap,
                    'raccoonlite_position',
                    'setPositionToXYZUntil'
                ),
                raccoonlite_change_position_by: command(
                    'raccoonlite_change_position_by',
                    [dropdown(OPT_XYZ, 'X'), numberInput(), dropdown(OPT_UNIT, 'CM'), indicator()],
                    [null, text('10'), null, null],
                    { XYZ: 0, VALUE: 1, UNIT: 2 },
                    'raccoonlite_position',
                    'changePositionBy'
                ),
                raccoonlite_set_position_to: command(
                    'raccoonlite_set_position_to',
                    [dropdown(OPT_XYZ, 'X'), numberInput(), dropdown(OPT_UNIT, 'CM'), indicator()],
                    [null, text('0'), null, null],
                    { XYZ: 0, VALUE: 1, UNIT: 2 },
                    'raccoonlite_position',
                    'setPositionTo'
                ),
                raccoonlite_set_position_ref_to: command(
                    'raccoonlite_set_position_ref_to',
                    [dropdown(OPT_REF, 'GRIPPER'), indicator()],
                    [null, null],
                    { REF: 0 },
                    'raccoonlite_position',
                    'setPositionRefTo'
                ),
                raccoonlite_change_position_ref_by_front_up: command(
                    'raccoonlite_change_position_ref_by_front_up',
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
                    'raccoonlite_position',
                    'changePositionRefByFrontUp'
                ),
                raccoonlite_set_position_ref_to_front_up: command(
                    'raccoonlite_set_position_ref_to_front_up',
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
                    'raccoonlite_position',
                    'setPositionRefToFrontUp'
                ),
                raccoonlite_change_joint_velocities_by: command(
                    'raccoonlite_change_joint_velocities_by',
                    anglesParams,
                    anglesDef,
                    { VELOCITY1: 0, VELOCITY2: 1, VELOCITY3: 2, VELOCITY4: 3 },
                    'raccoonlite_joint',
                    'changeJointVelocitiesBy'
                ),
                raccoonlite_set_joint_velocities_to: command(
                    'raccoonlite_set_joint_velocities_to',
                    anglesParams,
                    anglesDef,
                    { VELOCITY1: 0, VELOCITY2: 1, VELOCITY3: 2, VELOCITY4: 3 },
                    'raccoonlite_joint',
                    'setJointVelocitiesTo'
                ),
                raccoonlite_change_velocity_by: command(
                    'raccoonlite_change_velocity_by',
                    [dropdown(OPT_JOINT, 'JOINT1'), numberInput(), indicator()],
                    [null, text('10'), null],
                    { JOINT: 0, VELOCITY: 1 },
                    'raccoonlite_joint',
                    'changeVelocityBy'
                ),
                raccoonlite_set_velocity_to: command(
                    'raccoonlite_set_velocity_to',
                    [dropdown(OPT_JOINT, 'JOINT1'), numberInput(), indicator()],
                    [null, text('0'), null],
                    { JOINT: 0, VELOCITY: 1 },
                    'raccoonlite_joint',
                    'setVelocityTo'
                ),
                raccoonlite_stop: command(
                    'raccoonlite_stop',
                    [dropdown(OPT_JOINT, 'ALL'), indicator()],
                    [null, null],
                    { JOINT: 0 },
                    'raccoonlite_joint',
                    'stop'
                ),
                raccoonlite_turn_off: command(
                    'raccoonlite_turn_off',
                    [dropdown(OPT_JOINT, 'ALL'), indicator()],
                    [null, null],
                    { JOINT: 0 },
                    'raccoonlite_joint',
                    'turnOff'
                ),
                raccoonlite_turn_precision_mode: command(
                    'raccoonlite_turn_precision_mode',
                    [dropdown(OPT_ON_OFF, 'OFF'), indicator()],
                    [null, null],
                    { ON_OFF: 0 },
                    'raccoonlite_joint',
                    'turnPrecisionMode'
                ),
                raccoonlite_is_moving: booleanField(
                    'raccoonlite_is_moving',
                    [],
                    [],
                    {},
                    'raccoonlite_joint',
                    'isMoving'
                ),
                // -------- gripper --------
                raccoonlite_with_gripper: command(
                    'raccoonlite_with_gripper',
                    [dropdown(OPT_PICK_PLACE, 'PLACE'), indicator()],
                    [null, null],
                    { ACTION: 0 },
                    'raccoonlite_gripper',
                    'withGripper'
                ),
                raccoonlite_lock_gripper: command(
                    'raccoonlite_lock_gripper',
                    [dropdown(OPT_HORZ_VERT, 'HORIZONTAL'), indicator()],
                    [null, null],
                    { DIRECTION: 0 },
                    'raccoonlite_gripper',
                    'lockGripper'
                ),
                raccoonlite_lock_gripper_until: command(
                    'raccoonlite_lock_gripper_until',
                    [dropdown(OPT_HORZ_VERT, 'HORIZONTAL'), indicator()],
                    [null, null],
                    { DIRECTION: 0 },
                    'raccoonlite_gripper',
                    'lockGripperUntil'
                ),
                raccoonlite_unlock_gripper: command(
                    'raccoonlite_unlock_gripper',
                    [indicator()],
                    [null],
                    {},
                    'raccoonlite_gripper',
                    'unlockGripper'
                ),
                raccoonlite_gripper_state: stringField(
                    'raccoonlite_gripper_state',
                    [],
                    [],
                    {},
                    'raccoonlite_gripper',
                    'getGripperState'
                ),
                // -------- sound --------
                raccoonlite_play_sound: command(
                    'raccoonlite_play_sound',
                    [dropdown(OPT_SOUND, 'BEEP'), indicator()],
                    [null, null],
                    { SOUND: 0 },
                    'raccoonlite_sound',
                    'playSound'
                ),
                raccoonlite_play_sound_times: command(
                    'raccoonlite_play_sound_times',
                    [dropdown(OPT_SOUND, 'BEEP'), numberInput(), indicator()],
                    [null, text('1'), null],
                    { SOUND: 0, REPEAT: 1 },
                    'raccoonlite_sound',
                    'playSoundTimes'
                ),
                raccoonlite_play_sound_until: command(
                    'raccoonlite_play_sound_until',
                    [dropdown(OPT_SOUND, 'BEEP'), numberInput(), indicator()],
                    [null, text('1'), null],
                    { SOUND: 0, REPEAT: 1 },
                    'raccoonlite_sound',
                    'playSoundTimesUntil'
                ),
                raccoonlite_clear_sound: command(
                    'raccoonlite_clear_sound',
                    [indicator()],
                    [null],
                    {},
                    'raccoonlite_sound',
                    'clearSound'
                ),
                raccoonlite_play_note: command(
                    'raccoonlite_play_note',
                    [dropdown(OPT_NOTE, 'C'), dropdown(OPT_OCTAVE, '4'), indicator()],
                    [null, null, null],
                    { NOTE: 0, OCTAVE: 1 },
                    'raccoonlite_sound',
                    'playNote'
                ),
                raccoonlite_play_note_beat: command(
                    'raccoonlite_play_note_beat',
                    [
                        dropdown(OPT_NOTE, 'C'),
                        dropdown(OPT_OCTAVE, '4'),
                        numberInput(),
                        indicator(),
                    ],
                    [null, null, text('0.5'), null],
                    { NOTE: 0, OCTAVE: 1, BEAT: 2 },
                    'raccoonlite_sound',
                    'playNoteBeat'
                ),
                raccoonlite_rest_beat: command(
                    'raccoonlite_rest_beat',
                    [numberInput(), indicator()],
                    [text('0.25'), null],
                    { BEAT: 0 },
                    'raccoonlite_sound',
                    'restBeat'
                ),
                raccoonlite_change_tempo: command(
                    'raccoonlite_change_tempo',
                    [numberInput(), indicator()],
                    [text('20'), null],
                    { BPM: 0 },
                    'raccoonlite_sound',
                    'changeTempo'
                ),
                raccoonlite_set_tempo: command(
                    'raccoonlite_set_tempo',
                    [numberInput(), indicator()],
                    [text('60'), null],
                    { BPM: 0 },
                    'raccoonlite_sound',
                    'setTempo'
                ),
                raccoonlite_is_sound_playing: booleanField(
                    'raccoonlite_is_sound_playing',
                    [],
                    [],
                    {},
                    'raccoonlite_sound',
                    'isSoundPlaying'
                ),
                // -------- sensing --------
                raccoonlite_encoder1: stringField(
                    'raccoonlite_encoder1',
                    [],
                    [],
                    {},
                    'raccoonlite_sensor',
                    'getEncoder1'
                ),
                raccoonlite_encoder2: stringField(
                    'raccoonlite_encoder2',
                    [],
                    [],
                    {},
                    'raccoonlite_sensor',
                    'getEncoder2'
                ),
                raccoonlite_encoder3: stringField(
                    'raccoonlite_encoder3',
                    [],
                    [],
                    {},
                    'raccoonlite_sensor',
                    'getEncoder3'
                ),
                raccoonlite_encoder4: stringField(
                    'raccoonlite_encoder4',
                    [],
                    [],
                    {},
                    'raccoonlite_sensor',
                    'getEncoder4'
                ),
                raccoonlite_position_x: stringField(
                    'raccoonlite_position_x',
                    [],
                    [],
                    {},
                    'raccoonlite_sensor',
                    'getPositionX'
                ),
                raccoonlite_position_y: stringField(
                    'raccoonlite_position_y',
                    [],
                    [],
                    {},
                    'raccoonlite_sensor',
                    'getPositionY'
                ),
                raccoonlite_position_z: stringField(
                    'raccoonlite_position_z',
                    [],
                    [],
                    {},
                    'raccoonlite_sensor',
                    'getPositionZ'
                ),
                raccoonlite_position_x_inch: stringField(
                    'raccoonlite_position_x_inch',
                    [],
                    [],
                    {},
                    'raccoonlite_sensor',
                    'getPositionXInch'
                ),
                raccoonlite_position_y_inch: stringField(
                    'raccoonlite_position_y_inch',
                    [],
                    [],
                    {},
                    'raccoonlite_sensor',
                    'getPositionYInch'
                ),
                raccoonlite_position_z_inch: stringField(
                    'raccoonlite_position_z_inch',
                    [],
                    [],
                    {},
                    'raccoonlite_sensor',
                    'getPositionZInch'
                ),
                raccoonlite_teach_button: stringField(
                    'raccoonlite_teach_button',
                    [],
                    [],
                    {},
                    'raccoonlite_sensor',
                    'getTeachButton'
                ),
                raccoonlite_play_button: stringField(
                    'raccoonlite_play_button',
                    [],
                    [],
                    {},
                    'raccoonlite_sensor',
                    'getPlayButton'
                ),
                raccoonlite_delete_button: stringField(
                    'raccoonlite_delete_button',
                    [],
                    [],
                    {},
                    'raccoonlite_sensor',
                    'getDeleteButton'
                ),
                raccoonlite_signal_strength: stringField(
                    'raccoonlite_signal_strength',
                    [],
                    [],
                    {},
                    'raccoonlite_sensor',
                    'getSignalStrength'
                ),
                raccoonlite_when_button_state: {
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
                        type: 'raccoonlite_when_button_state',
                    },
                    paramsKeyMap: { DUMMY: 0, BUTTON: 1, STATE: 2 },
                    event: 'raccoonliteWhenButtonState',
                    class: 'raccoonlite_sensor',
                    isNotFor: ['RaccoonLite'],
                    func(sprite, script) {
                        if (Entry.RaccoonLite.checkButtonEvent(script)) {
                            return script.callReturn();
                        }
                        return this.die();
                    },
                },
                raccoonlite_button_state: booleanField(
                    'raccoonlite_button_state',
                    [dropdown(OPT_BUTTON, 'TEACH'), dropdown(OPT_BUTTON_STATE, 'PRESSED')],
                    [null, null],
                    { BUTTON: 0, STATE: 1 },
                    'raccoonlite_sensor',
                    'isButtonState'
                ),
                raccoonlite_battery_state: booleanField(
                    'raccoonlite_battery_state',
                    [dropdown(OPT_BATTERY, 'NORMAL')],
                    [null],
                    { BATTERY: 0 },
                    'raccoonlite_sensor',
                    'checkBatteryState'
                ),
                raccoonlite_charging: booleanField(
                    'raccoonlite_charging',
                    [],
                    [],
                    {},
                    'raccoonlite_sensor',
                    'isCharging'
                ),
                // -------- conveyor (peripheral on the raccoon connection) --------
                raccoonlite_conveyor_move: command(
                    'raccoonlite_conveyor_move',
                    [numberInput(), numberInput(), dropdown(OPT_CONVEYOR_UNIT, 'CM'), indicator()],
                    [text('100'), text('10'), null, null],
                    { SPEED: 0, VALUE: 1, UNIT: 2 },
                    'raccoonlite_conveyor',
                    'conveyorMove'
                ),
                raccoonlite_conveyor_change_velocity: command(
                    'raccoonlite_conveyor_change_velocity',
                    [numberInput(), indicator()],
                    [text('10'), null],
                    { VELOCITY: 0 },
                    'raccoonlite_conveyor',
                    'conveyorChangeVelocity'
                ),
                raccoonlite_conveyor_set_velocity: command(
                    'raccoonlite_conveyor_set_velocity',
                    [numberInput(), indicator()],
                    [text('0'), null],
                    { VELOCITY: 0 },
                    'raccoonlite_conveyor',
                    'conveyorSetVelocity'
                ),
                raccoonlite_conveyor_stop: command(
                    'raccoonlite_conveyor_stop',
                    [indicator()],
                    [null],
                    {},
                    'raccoonlite_conveyor',
                    'conveyorStop'
                ),
                raccoonlite_conveyor_moving: booleanField(
                    'raccoonlite_conveyor_moving',
                    [],
                    [],
                    {},
                    'raccoonlite_conveyor',
                    'isConveyorMoving'
                ),
                raccoonlite_conveyor_button: stringField(
                    'raccoonlite_conveyor_button',
                    [],
                    [],
                    {},
                    'raccoonlite_conveyor',
                    'getConveyorButton'
                ),
                raccoonlite_conveyor_when_button_state: {
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
                        type: 'raccoonlite_conveyor_when_button_state',
                    },
                    paramsKeyMap: { DUMMY: 0, STATE: 1 },
                    event: 'raccoonliteConveyorWhenButtonState',
                    class: 'raccoonlite_conveyor',
                    isNotFor: ['RaccoonLite'],
                    func(sprite, script) {
                        if (Entry.RaccoonLite.checkConveyorButtonEvent(script)) {
                            return script.callReturn();
                        }
                        return this.die();
                    },
                },
                raccoonlite_conveyor_button_state: booleanField(
                    'raccoonlite_conveyor_button_state',
                    [dropdown(OPT_BUTTON_STATE, 'PRESSED')],
                    [null],
                    { STATE: 0 },
                    'raccoonlite_conveyor',
                    'isConveyorButtonState'
                ),
            };
        }

        // ---------------- 모니터 ----------------

        // 설치형 모듈에 대응이 없다. lite 전용 인터페이스이고 준거는 block_pio_lite.js 다.
        getMonitorPort() {
            return { ...this.sensory, ...this.motoring };
        }

        get monitorTemplate() {
            return {
                // getter 형태를 유지할 것: 코어가 이 객체에 쓰는 값이 버려지는 현재 동작이
                // 여기에 의존하고, Lang 병합 이후에 읽혀야 한다.
                imgPath: `hw_lite/${this.imageName}`,
                // 좌표는 256 좌표계의 절대 위치다. hardwareMonitor 가 사진을 256으로
                // 늘려 그리므로 실제 사진 크기와 무관하다. 설치형 값을 그대로 옮긴다.
                width: 256,
                height: 256,
                listPorts: {
                    signalStrength: {
                        name: Lang.Blocks.raccoonlite_sensor_signal_strength,
                        type: 'input',
                        pos: { x: 0, y: 0 },
                    },
                    batteryState: {
                        name: Lang.Blocks.raccoonlite_sensor_battery,
                        type: 'input',
                        pos: { x: 0, y: 0 },
                    },
                    encoder1: {
                        name: Lang.Blocks.raccoonlite_sensor_encoder1,
                        type: 'input',
                        pos: { x: 0, y: 0 },
                    },
                    encoder2: {
                        name: Lang.Blocks.raccoonlite_sensor_encoder2,
                        type: 'input',
                        pos: { x: 0, y: 0 },
                    },
                    encoder3: {
                        name: Lang.Blocks.raccoonlite_sensor_encoder3,
                        type: 'input',
                        pos: { x: 0, y: 0 },
                    },
                    encoder4: {
                        name: Lang.Blocks.raccoonlite_sensor_encoder4,
                        type: 'input',
                        pos: { x: 0, y: 0 },
                    },
                },
                ports: {},
                mode: 'both',
            };
        }
    }

    Object.assign(RaccoonLite.prototype, {
        __TO_RADIAN,
        __TO_DEGREE,
        __L1,
        __L2,
        __L3,
        JOINT_MODE_VELOCITY,
        JOINT_MODE_ANGLE,
        JOINT_MODE_VELOCITY_HORZ,
        JOINT_MODE_VELOCITY_VERT,
        JOINT_MODE_ANGLE_HORZ,
        JOINT_MODE_ANGLE_VERT,
        REF_NONE,
        REF_WRIST,
        REF_GRIPPER,
        __INCH_TO_CM,
        __MM_TO_CM,
        __RESET_TIMEOUT_MS,
        __SOUND_TIMEOUT_MS,
        __PORT_MAP,
        __ID_PORTS,
        __JOINTS,
        __AXES,
        __SOUNDS,
        __NOTES,
        __BATTERY_STATES,
        __MAX_DELAY_MS,
    });

    // 프레임 상수를 클래스 정적으로도 노출한다. 본문의 Module.<CONST> 참조는 그대로 두고
    // 같은 값을 클래스에 얹기만 한다. 내보내는 것은 인스턴스이고 클래스 바인딩은
    // IIFE 밖으로 나가지 않으므로, 밖에서 닿는 유일한 길은 Entry.RaccoonLite.constructor 다.
    // 현재 소비자는 0곳이고 상수 확인 편의로만 남긴다. block_pio_lite.js:4094 와 같은 줄이다.
    Object.assign(RaccoonLite, Module);

    Entry.RaccoonLite = new RaccoonLite();
})();
module.exports = Entry.RaccoonLite;
