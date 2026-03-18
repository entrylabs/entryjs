'use strict';

Entry.AIDrone = {
    Cmd: {
        CMD_LED: 1,
        CMD_TUNE: 2,
        CMD_TUNEDUR: 3,
        CMD_ROLL_LOW: 4,
        CMD_ROLL_HIGH: 5,
        CMD_PITCH_LOW: 6,
        CMD_PITCH_HIGH: 7,
        CMD_OPTION_LOW: 8,
        CMD_MOTOR0: 9,
        CMD_MOTOR1: 10,
        CMD_MOTOR2: 11,
        CMD_MOTOR3: 12,
        CMD_EXTPIN1: 13,
        CMD_EXTPIN2: 14,
        CMD_EXTPIN3: 15,
        CMD_PWM: 16,
        CMD_SERVOPORT: 17,
        CMD_SERVODGREE: 18,
        CMD_OPTION_HIGH: 19,
        CMD_YAW_LOW: 20,
        CMD_YAW_HIGH: 21,
        CMD_THROTTLE_LOW: 22,
        CMD_THROTTLE_HIGH: 23,
        CMD_POSVEL_LOW: 24,
        CMD_POSVEL_HIGH: 25,
        CMD_YAWVEL_LOW: 26,
        CMD_YAWVEL_HIGH: 27,
        CMD_ULTRASONIC: 28,
    },
    Sensor: {
        SENSOR_JOYSTICK_LLR: 1,
        SENSOR_JOYSTICK_LTB: 2,
        SENSOR_JOYSTICK_RLR: 3,
        SENSOR_JOYSTICK_RTB: 4,
        SENSOR_BUTTON: 5,
        SENSOR_DRONECONNECT: 6,
        SENSOR_DRONEALT: 7,
        SENSOR_GYRO_X: 8,
        SENSOR_GYRO_Y: 9,
        SENSOR_DRONEREADY: 10,
        SENSOR_EXTPIN1: 11,
        SENSOR_EXTPIN2: 12,
        SENSOR_ANALOG4: 13,
        SENSOR_ANALOG5: 14,
        SENSOR_JDKITMAX: 15,
        SENSOR_BATTERY: 15,
        SENSOR_POSX_L: 16,
        SENSOR_POSX_H: 17,
        SENSOR_POSY_L: 18,
        SENSOR_POSY_H: 19,
        SENSOR_ULTRASONIC: 20,
    },
    setZero: function() {
        Entry.hw.sendQueue.CMD = [
            0xf0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        ];
        Entry.hw.update();
    },
    id: '6B.1',
    name: 'AIDrone',
    url: 'http://www.aidrone.store',
    imageName: 'aidrone.png',
    title: {
        'en': 'AIDrone',
        'ko': 'AI드론',
    },
    monitorTemplate: {
        imgPath: 'hw/jdrc.png',
        width: 600,
        height: 355,
        listPorts: {
            'A6': {
                name: '드론연결상태',
                type: 'input',
                pos: {
                    x: 0,
                    y: 0,
                },
            },
            'A10': {
                name: '드론준비상태',
                type: 'input',
                pos: {
                    x: 0,
                    y: 0,
                },
            },
            'A15': {
                name: '배터리(%)',
                type: 'input',
                pos: {
                    x: 0,
                    y: 0,
                },
            },
            'A8': {
                name: '드론좌우기울기',
                type: 'input',
                pos: {
                    x: 0,
                    y: 0,
                },
            },
            'A9': {
                name: '드론앞뒤기울기',
                type: 'input',
                pos: {
                    x: 0,
                    y: 0,
                },
            },
            'A7': {
                name: '드론높이',
                type: 'input',
                pos: {
                    x: 0,
                    y: 0,
                },
            },
            'A16': {
                name: '드론좌우이동',
                type: 'input',
                pos: {
                    x: 0,
                    y: 0,
                },
            },
            'A18': {
                name: '드론앞뒤이동',
                type: 'input',
                pos: {
                    x: 0,
                    y: 0,
                },
            },
        },
        ports: {
            'A1': {
                name: '왼쪽 조이스틱 좌우',
                type: 'input',
                pos: {
                    x: 140,
                    y: 140,
                },
            },

            'A2': {
                name: '왼쪽 조이스틱 상하',
                type: 'input',
                pos: {
                    x: 140,
                    y: 140,
                },
            },
            'A3': {
                name: '오른쪽 조이스틱 좌우',
                type: 'input',
                pos: {
                    x: 450,
                    y: 140,
                },
            },

            'A4': {
                name: '오른쪽 조이스틱 상하',
                type: 'input',
                pos: {
                    x: 450,
                    y: 140,
                },
            },
            'A5': {
                name: '버튼',
                type: 'input',
                pos: {
                    x: 430,
                    y: 250,
                },
            },


        },
        mode: 'both',
    },
};


Entry.AIDrone.setLanguage = function() {
    return {
        ko: {
            template: {
                'aidrone_takeoff': '드론 이륙하기 %1',
                'aidrone_landing': '드론 착륙하기 %1',
                'aidrone_altitude': '%1cm 높이로 비행%2',
                'aidrone_throttle': '프로펠러를 %1 % 세기로 돌리기 %2',
                'aidrone_velocity': '%1(으)로 %2속도(cm/s)로 비행%3',
                'aidrone_distance': '%1(으)로 %2cm 거리를 %3속도(cm/s)로 비행%4',
                'aidrone_degree': '%1으로 %2도를 %3각속도(deg/s)로 회전 %4',
                'aidrone_motor': '%1 모터를 %2 세기로 돌리기 %3',
                'aidrone_emergency': '드론 즉시멈추기 %1',
                'aidrone_connect': '드론 연결상태',
                'aidrone_ready': '드론 준비상태',
                'aidrone_battery': '배터리(%)',
                'aidrone_dronealt': '드론 높이',
                'aidrone_gyrox': '드론 좌우 기울기',
                'aidrone_gyroy': '드론 앞뒤 기울기',
                'aidrone_posx': '드론 좌우 이동',
                'aidrone_posy': '드론 앞뒤 이동',
                'aidrone_led': '%1 LED %2 %3',
                'aidrone_tune': '%1 음을  %2 초동안 소리내기 %3',
                'aidrone_joystick': '조이스틱 %1 읽기',
                'aidrone_button': '%1번 버튼 값 읽어오기',
                'aidrone_dir_front': '앞',
                'aidrone_dir_back': '뒤',
                'aidrone_dir_right': '오른쪽',
                'aidrone_dir_left': '왼쪽',
                'aidrone_alt': '드론 높이',
                'aidrone_tiltx': '드론좌우기울기',
                'aidrone_tilty': '드론앞뒤기울기',
                'aidrone_battery': '배터리',
                'aidrone_detect_marker': '화면에서 마커 찾기 %1',
                'aidrone_get_marker_data': '인식된 마커의 %1 값',
                'aidrone_color_track_start': '%1 색상 추적 시작 %2',
                'aidrone_color_track_stop': '색상 추적 중지 %1',
                'aidrone_color_detected': '색상이 감지됨?',
                'aidrone_get_color_x': '감지된 색상 X좌표',
                'aidrone_get_color_y': '감지된 색상 Y좌표',
                'aidrone_get_color_size': '감지된 색상 크기',
                'aidrone_get_color_data': '색상 추적 %1',
                'aidrone_face_detect': '얼굴 인식하기 %1',
                'aidrone_face_detected': '얼굴이 감지됨?',
                'aidrone_get_face_x': '얼굴 X좌표',
                'aidrone_get_face_y': '얼굴 Y좌표',
                'aidrone_get_face_size': '얼굴 크기',
                'aidrone_get_face_data': '얼굴 %1',
                'aidrone_get_landmark': '얼굴 랜드마크 %1번 %2 좌표',
                'aidrone_marker_detected': '마커가 감지됨?',
            },
        },
        en: {
            template: {
                'aidrone_takeoff': '드론 이륙하기 %1',
                'aidrone_landing': '드론 착륙하기 %1',
                'aidrone_altitude': '%1cm 높이로 비행%2',
                'aidrone_throttle': '프로펠러를 %1 % 세기로 돌리기 %2',
                'aidrone_velocity': '%1(으)로 %2속도(cm/s)로 비행%3',
                'aidrone_distance': '%1(으)로 %2cm 거리를 %3속도(cm/s)로 비행%4',
                'aidrone_degree': '%1으로 %2도를 %3각속도(deg/s)로 회전 %4',
                'aidrone_motor': '%1 모터를 %2 세기로 돌리기 %3',
                'aidrone_emergency': '드론 즉시멈추기 %1',
                'aidrone_connect': '드론 연결상태',
                'aidrone_ready': '드론 준비상태',
                'aidrone_battery': '배터리(%)',
                'aidrone_dronealt': '드론 높이',
                'aidrone_gyrox': '드론 좌우 기울기',
                'aidrone_gyroy': '드론 앞뒤 기울기',
                'aidrone_posx': '드론 좌우 이동',
                'aidrone_posy': '드론 앞뒤 이동',
                'aidrone_led': '%1 LED %2 %3',
                'aidrone_tune': '%1 음을  %2 초동안 소리내기 %3',
                'aidrone_joystick': '조이스틱 %1 읽기',
                'aidrone_button': '%1번 버튼 값 읽어오기',
                'aidrone_dir_front': '앞',
                'aidrone_dir_back': '뒤',
                'aidrone_dir_right': '오른쪽',
                'aidrone_dir_left': '왼쪽',
                'aidrone_alt': '드론 높이',
                'aidrone_tiltx': '드론좌우기울기',
                'aidrone_tilty': '드론앞뒤기울기',
                'aidrone_battery': '배터리',
                'aidrone_detect_marker': '화면에서 마커 찾기 %1',
                'aidrone_get_marker_data': '인식된 마커의 %1 값',
                'aidrone_color_track_start': '%1 color track start %2',
                'aidrone_color_track_stop': 'color track stop %1',
                'aidrone_color_detected': 'color detected?',
                'aidrone_get_color_x': 'color X',
                'aidrone_get_color_y': 'color Y',
                'aidrone_get_color_size': 'color size',
                'aidrone_get_color_data': 'color track %1',
                'aidrone_face_detect': 'detect face %1',
                'aidrone_face_detected': 'face detected?',
                'aidrone_get_face_x': 'face X',
                'aidrone_get_face_y': 'face Y',
                'aidrone_get_face_size': 'face size',
                'aidrone_get_face_data': 'face %1',
                'aidrone_get_landmark': 'landmark %1 %2',
                'aidrone_marker_detected': 'marker detected?',
            },
        },
    };
};


Entry.AIDrone.blockMenuBlocks = [
    'aidrone_takeoff',
    'aidrone_landing',
    'aidrone_altitude',
    'aidrone_throttle',
    'aidrone_velocity',
    'aidrone_distance',
    'aidrone_degree',
    'aidrone_emergency',
    'aidrone_connect',
    'aidrone_ready',
    'aidrone_battery',
    'aidrone_dronealt',
    'aidrone_gyrox',
    'aidrone_gyroy',
    'aidrone_posx',
    'aidrone_posy',
    'aidrone_led',
    'aidrone_tune',
    'aidrone_motor',
    'aidrone_joystick',
    'aidrone_button',
    'aidrone_detect_marker',
    'aidrone_get_marker_data',
    // tracking.js 기반 비전 블록 ─ 색상 추적
    'aidrone_color_track_start',
    'aidrone_color_track_stop',
    'aidrone_color_detected',
    'aidrone_get_color_x',
    'aidrone_get_color_y',
    'aidrone_get_color_size',
    'aidrone_get_color_data',
    // tracking.js 기반 비전 블록 ─ 얼굴 인식
    'aidrone_face_detect',
    'aidrone_face_detected',
    'aidrone_get_face_x',
    'aidrone_get_face_y',
    'aidrone_get_face_size',
    'aidrone_get_face_data',
    // tracking.js 기반 비전 블록 ─ 랜드마크
    'aidrone_get_landmark',
    // AR 마커 조건 블록
    'aidrone_marker_detected',
];

// --- [여기부터] 1단계 코드: 마커 데이터 저장 변수 ---
Entry.AIDrone.visionData = {
    id: -1,      // 마커 ID (없으면 -1)
    x: 0,        // 화면 X좌표 (-240 ~ 240)
    y: 0,        // 화면 Y좌표 (-135 ~ 135)
    dist: 0,     // 거리 (cm 추정치)
    width: 0     // 마커의 크기(픽셀)
};
// --- [여기까지] 1단계 코드 ---

// -------------------------------------------------------
// tracking.js 전용 데이터 저장 변수
// -------------------------------------------------------

// 색상 추적 데이터
Entry.AIDrone.colorTrackData = {
    detected: false,  // 감지 여부
    x: 0,             // 감지된 색상 영역 중심 X (엔트리 좌표계)
    y: 0,             // 감지된 색상 영역 중심 Y (엔트리 좌표계)
    width: 0,         // 영역 가로 크기(pixel)
    height: 0         // 영역 세로 크기(pixel)
};
Entry.AIDrone._colorTrackerTask    = null;
Entry.AIDrone._colorTrackerRunning = false;
Entry.AIDrone._colorTrackerStop    = null;
Entry.AIDrone._arDetector          = null;  // AR.Detector 재사용

// ----------------------------------------------------------------
// _getVisionCanvas(): 비전 분석에 사용할 canvas 반환
//
// 동작 우선순위:
//   1순위: Entry.cam.canvas
//          → 엔트리 [비디오 화면 보이기] + [MJPEG Camera로 바꾸기] 블록
//            실행 후 생성되는 공식 비디오 캔버스
//            (매 프레임 Entry.cam.video → Entry.cam.canvas에 그려짐)
//
//   2순위: Entry.cam.video → 오프스크린 canvas
//          → Entry.cam.canvas가 없을 때 video를 직접 그려서 분석
//
//   3순위: document의 재생 중인 <video> 탐색 → 오프스크린 canvas
//          → Entry.cam 자체가 없을 때 (다른 방식으로 연결된 경우)
//
//   4순위: Entry.stage.canvas.canvas (최후 fallback)
// ----------------------------------------------------------------
Entry.AIDrone._offCanvas = null;
Entry.AIDrone._offCtx    = null;

Entry.AIDrone._getVisionCanvas = function() {
    // ── 1순위: Entry.cam.canvas (엔트리 공식 비디오 canvas) ──
    // 엔트리 비디오 블록이 활성화되면 Entry.cam.canvas에
    // 매 프레임 드론 카메라 영상이 그려진 상태
    if (typeof Entry !== 'undefined' &&
        Entry.cam &&
        Entry.cam.isVideo &&
        Entry.cam.canvas &&
        Entry.cam.canvas.width > 0) {
        return Entry.cam.canvas;
    }

    // ── 오프스크린 canvas 준비 (2순위, 3순위 공용) ──
    // OffscreenCanvas: DOM에 엘리먼트를 추가하지 않는 순수 메모리 캔버스.
    // 엔트리가 동작하는 Chrome 환경(69+)은 OffscreenCanvas를 지원하므로
    // document.createElement('canvas')를 사용하지 않습니다.
    if (!Entry.AIDrone._offCanvas) {
        Entry.AIDrone._offCanvas = new OffscreenCanvas(640, 480);
        Entry.AIDrone._offCtx    = Entry.AIDrone._offCanvas.getContext('2d');
    }
    var oc = Entry.AIDrone._offCanvas;
    var ox = Entry.AIDrone._offCtx;

    // ── 2순위: Entry.cam.video → 오프스크린 canvas ──
    if (typeof Entry !== 'undefined' &&
        Entry.cam &&
        Entry.cam.video &&
        Entry.cam.video.readyState >= 2 &&
        Entry.cam.video.videoWidth > 0) {
        var v = Entry.cam.video;
        if (oc.width !== v.videoWidth || oc.height !== v.videoHeight) {
            oc.width  = v.videoWidth;
            oc.height = v.videoHeight;
        }
        try {
            ox.drawImage(v, 0, 0, oc.width, oc.height);
            return oc;
        } catch(e) {}
    }

    // ── 3순위: DOM에서 재생 중인 <video> 탐색 ──
    var videos = document.querySelectorAll('video');
    for (var i = 0; i < videos.length; i++) {
        var vid = videos[i];
        if (!vid.paused && vid.readyState >= 2 && vid.videoWidth > 0) {
            if (oc.width !== vid.videoWidth || oc.height !== vid.videoHeight) {
                oc.width  = vid.videoWidth;
                oc.height = vid.videoHeight;
            }
            try {
                ox.drawImage(vid, 0, 0, oc.width, oc.height);
                return oc;
            } catch(e) {}
            break;
        }
    }

    // ── 4순위: Entry.stage.canvas (최후 fallback) ──
    try {
        if (Entry.stage && Entry.stage.canvas && Entry.stage.canvas.canvas) {
            return Entry.stage.canvas.canvas;
        }
    } catch(e) {}
    return null;
};

// 얼굴 인식 데이터
Entry.AIDrone.faceData = {
    detected: false,  // 감지 여부
    x: 0,             // 얼굴 중심 X (엔트리 좌표계)
    y: 0,             // 얼굴 중심 Y (엔트리 좌표계)
    width: 0,         // 얼굴 폭(pixel)
    height: 0         // 얼굴 높이(pixel)
};
Entry.AIDrone._faceTrackerTask = null;   // 실행 중인 얼굴 TrackerTask
Entry.AIDrone._faceTrackerVideo = null;  // 웹캠 video 엘리먼트

// 얼굴 랜드마크 데이터 (68점 배열)  landmarks[i] = {x, y}
Entry.AIDrone.landmarkData = [];


Entry.AIDrone.getBlocks = function() {
    return {
        //region AIDrone
        aidrone_takeoff: {
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
                type: 'aidrone_takeoff',
            },
            paramsKeyMap: {},
            class: 'AIDrone_Command',
            isNotFor: ['AIDrone'],

            func: function(sprite, script) {
                if (typeof Entry.hw.sendQueue.CMD == 'undefined') {
                    Entry.hw.sendQueue.CMD = [
                        0xf0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    ];
                }
                var cmd = Entry.hw.sendQueue.CMD;
                cmd[Entry.AIDrone.Cmd.CMD_THROTTLE_LOW] = 70;
                cmd[Entry.AIDrone.Cmd.CMD_ROLL_LOW] = 0;
                cmd[Entry.AIDrone.Cmd.CMD_PITCH_LOW] = 0;
                cmd[Entry.AIDrone.Cmd.CMD_OPTION_LOW] = 0x2F;
                cmd[Entry.AIDrone.Cmd.CMD_OPTION_HIGH] = 0;

                Entry.hw.sendQueue.rollCnt = 0;
                Entry.hw.sendQueue.pitchCnt = 0;
                Entry.hw.sendQueue.yawCnt = 0;

                Entry.hw.update();
                return script.callReturn();
            },
            syntax: { js: [], py: [] },
        },
        aidrone_landing: {
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
                type: 'aidrone_landing',
            },
            paramsKeyMap: {},
            class: 'AIDrone_Command',
            isNotFor: ['AIDrone'],

            func: function(sprite, script) {
                if (typeof Entry.hw.sendQueue.CMD == 'undefined')
                    Entry.hw.sendQueue.CMD = [
                        0xf0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    ];

                var cmd = Entry.hw.sendQueue.CMD;
                cmd[Entry.AIDrone.Cmd.CMD_THROTTLE_LOW] = 0;
                cmd[Entry.AIDrone.Cmd.CMD_ROLL_LOW] = 0;
                cmd[Entry.AIDrone.Cmd.CMD_PITCH_LOW] = 0;
                cmd[Entry.AIDrone.Cmd.CMD_OPTION_LOW] = 0x2F;
                cmd[Entry.AIDrone.Cmd.CMD_OPTION_HIGH] = 0;

                Entry.hw.update();
                return script.callReturn();
            },
            syntax: { js: [], py: [] },
        },
        aidrone_altitude: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                    value: '100',
                    fontSize: 11,
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'aidrone_altitude',
            },
            paramsKeyMap: {
                THROTTLE: 0,
            },
            class: 'AIDrone_Command',
            isNotFor: ['AIDrone'],

            func: function(sprite, script) {
                if (typeof Entry.hw.sendQueue.CMD == 'undefined')
                    Entry.hw.sendQueue.CMD = [
                        0xf0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    ];

                var cmd = Entry.hw.sendQueue.CMD;
                var throttle = script.getNumberValue('THROTTLE', script);
                cmd[Entry.AIDrone.Cmd.CMD_THROTTLE_LOW] = throttle & 0xFF;
                cmd[Entry.AIDrone.Cmd.CMD_THROTTLE_HIGH] = (throttle >> 8) & 0xFF;
                cmd[Entry.AIDrone.Cmd.CMD_OPTION_LOW] = 0x2F;
                Entry.hw.update();
                return script.callReturn();
            },
            syntax: { js: [], py: [] },
        },
        aidrone_throttle: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                    value: '0',
                    fontSize: 11,
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'aidrone_throttle',
            },
            paramsKeyMap: {
                THROTTLE: 0,
            },
            class: 'AIDrone_Command',
            isNotFor: ['AIDrone'],

            func: function(sprite, script) {
                if (typeof Entry.hw.sendQueue.CMD == 'undefined')
                    Entry.hw.sendQueue.CMD = [
                        0xf0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    ];

                var cmd = Entry.hw.sendQueue.CMD;
                var throttle = script.getNumberValue('THROTTLE', script);
                // 0~100 범위로 클리핑 후 ×10 하여 0~1000 스케일로 변환
                throttle = Math.round(Math.min(100, Math.max(0, throttle)) * 10);
                cmd[Entry.AIDrone.Cmd.CMD_THROTTLE_LOW] = throttle & 0xFF;
                cmd[Entry.AIDrone.Cmd.CMD_THROTTLE_HIGH] = (throttle >> 8) & 0xFF;
                cmd[Entry.AIDrone.Cmd.CMD_OPTION_LOW] = 0x09;
                Entry.hw.update();
                return script.callReturn();
            },
            syntax: { js: [], py: [] },
        },

        aidrone_velocity: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.template.aidrone_dir_front, 0],
                        [Lang.template.aidrone_dir_back, 1],
                        [Lang.template.aidrone_dir_right, 2],
                        [Lang.template.aidrone_dir_left, 3],
                    ],
                    value: 0,
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Block',
                    accept: 'string',
                    value: '70',
                    fontSize: 11,
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'aidrone_velocity',
            },
            paramsKeyMap: {
                DIRECTION: 0,
                VELOCITY: 1,
            },
            class: 'AIDrone_Command',
            isNotFor: ['AIDrone'],

            func: function(sprite, script) {
                if (typeof Entry.hw.sendQueue.CMD == 'undefined')
                    Entry.hw.sendQueue.CMD = [
                        0xf0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    ];

                var cmd = Entry.hw.sendQueue.CMD;
                var direction = script.getField('DIRECTION', script);
                var velocity = script.getNumberValue('VELOCITY', script);
                if ((direction == 1) || (direction == 3))
                    velocity = velocity * -1;
                if (direction < 2) {
                    cmd[Entry.AIDrone.Cmd.CMD_PITCH_LOW] = velocity & 0xFF;
                    cmd[Entry.AIDrone.Cmd.CMD_PITCH_HIGH] = (velocity >> 8) & 0xFF;
                } else {
                    cmd[Entry.AIDrone.Cmd.CMD_ROLL_LOW] = velocity & 0xFF;
                    cmd[Entry.AIDrone.Cmd.CMD_ROLL_HIGH] = (velocity >> 8) & 0xFF;
                }
                cmd[Entry.AIDrone.Cmd.CMD_OPTION_LOW] = cmd[Entry.AIDrone.Cmd.CMD_OPTION_LOW] & 0xDF;
                Entry.hw.update();
                return script.callReturn();
            },
            syntax: { js: [], py: [] },
        },
        aidrone_distance: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.template.aidrone_dir_front, 0],
                        [Lang.template.aidrone_dir_back, 1],
                        [Lang.template.aidrone_dir_right, 2],
                        [Lang.template.aidrone_dir_left, 3],
                    ],
                    value: 0,
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Block',
                    accept: 'string',
                    value: '100',
                    fontSize: 11,
                },
                {
                    type: 'Block',
                    accept: 'string',
                    value: '70',
                    fontSize: 11,
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'aidrone_distance',
            },
            paramsKeyMap: {
                DIRECTION: 0,
                DISTANCE: 1,
                VELOCITY: 2,
            },
            class: 'AIDrone_Command',
            isNotFor: ['AIDrone'],

            func: function(sprite, script) {
                if (typeof Entry.hw.sendQueue.CMD == 'undefined')
                    Entry.hw.sendQueue.CMD = [
                        0xf0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    ];

                var cmd = Entry.hw.sendQueue.CMD;
                var direction = script.getField('DIRECTION', script);
                var distance = script.getNumberValue('DISTANCE', script);
                var velocity = script.getNumberValue('VELOCITY', script);
                if ((direction == 1) || (direction == 3))
                    distance = distance * -1;
                if (direction < 2) {
                    cmd[Entry.AIDrone.Cmd.CMD_PITCH_LOW] = distance & 0xFF;
                    cmd[Entry.AIDrone.Cmd.CMD_PITCH_HIGH] = (distance >> 8) & 0xFF;
                    var pitchCnt = Entry.hw.sendQueue.pitchCnt;
                    Entry.hw.sendQueue.pitchCnt = typeof pitchCnt == 'undefined' ? 1 : pitchCnt + 1;

                } else {
                    cmd[Entry.AIDrone.Cmd.CMD_ROLL_LOW] = distance & 0xFF;
                    cmd[Entry.AIDrone.Cmd.CMD_ROLL_HIGH] = (distance >> 8) & 0xFF;
                    var rollCnt = Entry.hw.sendQueue.rollCnt;
                    Entry.hw.sendQueue.rollCnt = typeof rollCnt == 'undefined' ? 1 : rollCnt + 1;
                }
                cmd[Entry.AIDrone.Cmd.CMD_POSVEL_LOW] = velocity & 0xFF;
                cmd[Entry.AIDrone.Cmd.CMD_POSVEL_HIGH] = (velocity >> 8) & 0xFF;
                cmd[Entry.AIDrone.Cmd.CMD_OPTION_LOW] = 0x2F;
                Entry.hw.update();
                return script.callReturn();
            },
            syntax: { js: [], py: [] },
        },
        aidrone_degree: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['시계방향', 0],
                        ['반시계방향', 1],
                    ],
                    value: 0,
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Block',
                    accept: 'string',
                    value: '90',
                    fontSize: 11,
                },
                {
                    type: 'Block',
                    accept: 'string',
                    value: '70',
                    fontSize: 11,
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'aidrone_degree',
            },
            paramsKeyMap: {
                DIRECTION: 0,
                DEGREE: 1,
                VELOCITY: 2,
            },
            class: 'AIDrone_Command',
            isNotFor: ['AIDrone'],

            func: function(sprite, script) {
                if (typeof Entry.hw.sendQueue.CMD == 'undefined')
                    Entry.hw.sendQueue.CMD = [
                        0xf0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    ];

                var cmd = Entry.hw.sendQueue.CMD;
                var direction = script.getField('DIRECTION', script);
                var degree = script.getNumberValue('DEGREE', script);
                var velocity = script.getNumberValue('VELOCITY', script);
                if (direction == 1)
                    degree = degree * -1;
                cmd[Entry.AIDrone.Cmd.CMD_YAW_LOW] = degree & 0xFF;
                cmd[Entry.AIDrone.Cmd.CMD_YAW_HIGH] = (degree >> 8) & 0xFF;
                cmd[Entry.AIDrone.Cmd.CMD_YAWVEL_LOW] = velocity & 0xFF;
                cmd[Entry.AIDrone.Cmd.CMD_YAWVEL_HIGH] = (velocity >> 8) & 0xFF;
                var yawCnt = Entry.hw.sendQueue.yawCnt;
                Entry.hw.sendQueue.yawCnt = typeof yawCnt == 'undefined' ? 1 : yawCnt + 1;

                Entry.hw.update();
                return script.callReturn();
            },
            syntax: { js: [], py: [] },
        },
        aidrone_emergency: {
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
                type: 'aidrone_emergency',
            },
            paramsKeyMap: {},
            class: 'AIDrone_Command',
            isNotFor: ['AIDrone'],

            func: function(sprite, script) {
                if (typeof Entry.hw.sendQueue.CMD == 'undefined')
                    Entry.hw.sendQueue.CMD = [
                        0xf0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    ];
                var cmd = Entry.hw.sendQueue.CMD;
                cmd[Entry.AIDrone.Cmd.CMD_THROTTLE_LOW] = 0;
                cmd[Entry.AIDrone.Cmd.CMD_ROLL_LOW] = 0;
                cmd[Entry.AIDrone.Cmd.CMD_PITCH_LOW] = 0;
                cmd[Entry.AIDrone.Cmd.CMD_OPTION_LOW] = 0x00;
                cmd[Entry.AIDrone.Cmd.CMD_OPTION_HIGH] = 0;
                Entry.hw.update();
                return script.callReturn();
            },
            syntax: { js: [], py: [] },
        },
        aidrone_connect: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [],
            events: {},
            def: {
                params: [null],
                type: 'aidrone_connect',
            },
            class: 'AIDrone_Sensor',
            isNotFor: ['AIDrone'],
            func: function(sprite, script) {
                var sensorData = Entry.hw.portData.CMD;
                if (!sensorData) return 0;
                return sensorData[Entry.AIDrone.Sensor.SENSOR_DRONECONNECT];
            },
            syntax: { js: [], py: [] },
        },
        aidrone_ready: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
            statements: [],
            params: [],
            events: {},
            def: {
                params: [null],
                type: 'aidrone_ready',
            },
            class: 'AIDrone_Sensor',
            isNotFor: ['AIDrone'],
            func: function(sprite, script) {
                var sensorData = Entry.hw.portData.CMD;
                return sensorData ? sensorData[Entry.AIDrone.Sensor.SENSOR_DRONEREADY] : 0;
            },
            syntax: { js: [], py: [] },
        },
        aidrone_battery: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [],
            events: {},
            def: {
                params: [null],
                type: 'aidrone_battery',
            },
            class: 'AIDrone_Sensor',
            isNotFor: ['AIDrone'],
            func: function(sprite, script) {
                var sensorData = Entry.hw.portData.CMD;
                if (!sensorData) return 0;
                return sensorData[Entry.AIDrone.Sensor.SENSOR_BATTERY];
            },
            syntax: { js: [], py: [] },
        },
        aidrone_dronealt: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [],
            events: {},
            def: {
                params: [null],
                type: 'aidrone_dronealt',
            },
            class: 'AIDrone_Sensor',
            isNotFor: ['AIDrone'],
            func: function(sprite, script) {
                var sensorData = Entry.hw.portData.CMD;
                if (!sensorData) return 0;
                return sensorData[Entry.AIDrone.Sensor.SENSOR_DRONEALT];
            },
            syntax: { js: [], py: [] },
        },
        aidrone_gyrox: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [],
            events: {},
            def: {
                params: [null],
                type: 'aidrone_gyrox',
            },
            class: 'AIDrone_Sensor',
            isNotFor: ['AIDrone'],
            func: function(sprite, script) {
                var sensorData = Entry.hw.portData.CMD;
                if (!sensorData) return 0;
                var x = sensorData[Entry.AIDrone.Sensor.SENSOR_GYRO_X];
                if (x > 127)
                    x = -1 * (256 - x);
                return x;
            },
            syntax: { js: [], py: [] },
        },
        aidrone_gyroy: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [],
            events: {},
            def: {
                params: [null],
                type: 'aidrone_gyroy',
            },
            class: 'AIDrone_Sensor',
            isNotFor: ['AIDrone'],
            func: function(sprite, script) {
                var sensorData = Entry.hw.portData.CMD;
                if (!sensorData) return 0;
                var y = sensorData[Entry.AIDrone.Sensor.SENSOR_GYRO_Y];
                if (y > 127)
                    y = -1 * (256 - y);
                return y;
            },
            syntax: { js: [], py: [] },
        },
        aidrone_posx: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [],
            events: {},
            def: {
                params: [null],
                type: 'aidrone_posx',
            },
            class: 'AIDrone_Sensor',
            isNotFor: ['AIDrone'],
            func: function(sprite, script) {
                var sensorData = Entry.hw.portData.CMD;
                if (!sensorData) return 0;
                var posx = sensorData[Entry.AIDrone.Sensor.SENSOR_POSX_L] + sensorData[Entry.AIDrone.Sensor.SENSOR_POSX_H] * 256;
                if (posx > 32767)
                    posx = -1 * (65536 - posx);
                return posx;
            },
            syntax: { js: [], py: [] },
        },
        aidrone_posy: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [],
            events: {},
            def: {
                params: [null],
                type: 'aidrone_posy',
            },
            class: 'AIDrone_Sensor',
            isNotFor: ['AIDrone'],
            func: function(sprite, script) {
                var sensorData = Entry.hw.portData.CMD;
                if (!sensorData) return 0;
                var posy = sensorData[Entry.AIDrone.Sensor.SENSOR_POSY_L] + sensorData[Entry.AIDrone.Sensor.SENSOR_POSY_H] * 256;
                if (posy > 32767)
                    posy = -1 * (65536 - posy);
                return posy;

            },
            syntax: { js: [], py: [] },
        },

        aidrone_led: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['1', 1],
                        ['2', 2],
                        ['3', 3],
                    ],
                    value: 1,
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Block',
                    accept: 'string',
                    value: '1',
                    fontSize: 11,
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
                type: 'aidrone_led',
            },
            paramsKeyMap: {
                PORT: 0,
                VALUE: 1,
            },
            class: 'AIDrone_CodeRC',
            isNotFor: ['AIDrone'],
            func: function(sprite, script) {
                if (typeof Entry.hw.sendQueue.CMD == 'undefined')
                    Entry.hw.sendQueue.CMD = [
                        0xf0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    ];
                var cmd = Entry.hw.sendQueue.CMD;
                var value = script.getNumberValue('VALUE', script);
                cmd[Entry.AIDrone.Cmd.CMD_LED] = value > 255 ? 255 : value < 0 ? 0 : value;
                Entry.hw.update();
                return script.callReturn();
            },
            syntax: { js: [], py: [] },
        },
        aidrone_tune: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                    value: '4',
                    fontSize: 11,
                },
                {
                    type: 'Block',
                    accept: 'string',
                    value: '1',
                    fontSize: 11,
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
                type: 'aidrone_tune',
            },
            paramsKeyMap: {
                NOTE: 0,
                DURATION: 1,
            },
            class: 'AIDrone_CodeRC',
            isNotFor: ['AIDrone'],
            func: function(sprite, script) {
                if (typeof Entry.hw.sendQueue.CMD == 'undefined')
                    Entry.hw.sendQueue.CMD = [
                        0xf0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    ];
                var cmd = Entry.hw.sendQueue.CMD;
                var note = script.getNumberValue('NOTE', script);
                var duration = script.getNumberValue('DURATION', script);
                cmd[Entry.AIDrone.Cmd.CMD_TUNE] = note > 255 ? 255 : note < 0 ? 0 : note;
                cmd[Entry.AIDrone.Cmd.CMD_TUNEDUR] = duration > 255 ? 255 : duration < 0 ? 0 : duration;
                Entry.hw.update();
                return script.callReturn();
            },
            syntax: { js: [], py: [] },
        },
        aidrone_motor: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['모터 앞-왼쪽', 1],
                        ['모터 뒤-왼쪽', 2],
                        ['모터 앞-오른쪽', 0],
                        ['모터 뒤-오른쪽', 3],
                    ],
                    value: 1,
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Block',
                    accept: 'string',
                    value: '15',
                    fontSize: 11,
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
                type: 'aidrone_motor',
            },
            paramsKeyMap: {
                MOTOR: 0,
                POWER: 1,
            },
            class: 'AIDrone_CodeRC',
            isNotFor: ['AIDrone'],

            func: function(sprite, script) {
                if (typeof Entry.hw.sendQueue.CMD == 'undefined')
                    Entry.hw.sendQueue.CMD = [
                        0xf0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    ];
                var cmd = Entry.hw.sendQueue.CMD;
                var motor = script.getField('MOTOR', script);
                var power = script.getNumberValue('POWER', script);

                cmd[Entry.AIDrone.Cmd.CMD_MOTOR0 + motor] =
                    power > 100 ? 100 : power < 0 ? 0 : power;
                Entry.hw.update();
                return script.callReturn();
            },
            syntax: { js: [], py: [] },
        },

        aidrone_joystick: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['왼쪽 좌우', 1],
                        ['왼쪽 상하', 2],
                        ['오른쪽 좌우', 3],
                        ['오른쪽 상하', 4],
                    ],
                    value: 1,
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'aidrone_joystick',
            },
            paramsKeyMap: {
                CHANNEL: 0,
            },
            class: 'AIDrone_CodeRC',
            isNotFor: ['AIDrone'],
            func: function(sprite, script) {
                var sensorData = Entry.hw.portData.CMD;
                if (!sensorData) return 0;
                var channel = script.getField('CHANNEL', script);
                var sensorMap = {
                    1: Entry.AIDrone.Sensor.SENSOR_JOYSTICK_LLR,
                    2: Entry.AIDrone.Sensor.SENSOR_JOYSTICK_LTB,
                    3: Entry.AIDrone.Sensor.SENSOR_JOYSTICK_RLR,
                    4: Entry.AIDrone.Sensor.SENSOR_JOYSTICK_RTB,
                };
                return sensorData[sensorMap[channel]] || 0;
            },
            syntax: { js: [], py: [] },
        },
        aidrone_button: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                    value: '1',
                    fontSize: 11,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'aidrone_button',
            },
            paramsKeyMap: {
                BUTTON: 0,
            },
            class: 'AIDrone_CodeRC',
            isNotFor: ['AIDrone'],
            func: function(sprite, script) {
                var sensorData = Entry.hw.portData.CMD;
                if (!sensorData) return 0;
                return sensorData[Entry.AIDrone.Sensor.SENSOR_BUTTON] || 0;
            },
            syntax: { js: [], py: [] },
        },

        // 1. [기능 블록] 화면에서 마커 찾기
        aidrone_detect_marker: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                { type: 'Indicator', img: 'block_icon/hardware_icon.svg', size: 12 }
            ],
            events: {},
            def: { params: [null], type: 'aidrone_detect_marker' },
            class: 'AIDrone_Vision',
            isNotFor: ['AIDrone'],
            func: function(sprite, script) {
                // 1) 라이브러리 로딩 체크
                if (typeof AR === 'undefined' || typeof CV === 'undefined') {
                    // 라이브러리가 없으면 아무것도 안 함
                    return script.callReturn();
                }

                // 2) 비전 소스 canvas 획득 (video 스프라이트 우선)
                var canvas = Entry.AIDrone._getVisionCanvas();
                if (!canvas) return script.callReturn();

                try {
                    var ctx = canvas.getContext('2d');
                    var width = canvas.width;
                    var height = canvas.height;

                    // 3) 현재 프레임 캡처
                    var imageData = ctx.getImageData(0, 0, width, height);

                    // 4) AR.Detector 재사용 (매번 생성하면 메모리 낭비)
                    if (!Entry.AIDrone._arDetector) {
                        Entry.AIDrone._arDetector = new AR.Detector();
                    }
                    var detector = Entry.AIDrone._arDetector;
                    var markers = detector.detect(imageData);

                    // 5) 결과 저장
                    if (markers.length > 0) {
                        var m = markers[0]; // 가장 먼저 발견된 마커 1개만 사용
                        Entry.AIDrone.visionData.id = m.id;

                        // 중심점 계산 (4개 모서리의 평균)
                        var cx = (m.corners[0].x + m.corners[1].x + m.corners[2].x + m.corners[3].x) / 4;
                        var cy = (m.corners[0].y + m.corners[1].y + m.corners[2].y + m.corners[3].y) / 4;

                        // 엔트리 좌표계로 변환 (중앙이 0,0)
                        Entry.AIDrone.visionData.x = cx - (width / 2);
                        Entry.AIDrone.visionData.y = (height / 2) - cy;

                        // 거리 계산 (마커가 클수록 가까움)
                        // corners[0]~corners[2]는 대각선 방향 → 정확한 변 길이 계산으로 수정
                        var dx01 = m.corners[1].x - m.corners[0].x;
                        var dy01 = m.corners[1].y - m.corners[0].y;
                        var dx12 = m.corners[2].x - m.corners[1].x;
                        var dy12 = m.corners[2].y - m.corners[1].y;
                        var side1 = Math.sqrt(dx01*dx01 + dy01*dy01);
                        var side2 = Math.sqrt(dx12*dx12 + dy12*dy12);
                        var pixelWidth = Math.round((side1 + side2) / 2); // 평균 변 길이
                        Entry.AIDrone.visionData.width = pixelWidth;
                        Entry.AIDrone.visionData.dist = pixelWidth > 0 ? Math.round(3000 / pixelWidth) : 0;

                    } else {
                        // 마커가 없으면 ID를 -1로 초기화
                        Entry.AIDrone.visionData.id = -1;
                    }
                } catch (e) {
                    console.log("Marker detect error: ", e);
                }

                return script.callReturn();
            },
            syntax: { js: [], py: [] }
        },

        // 2. [값 블록] 인식된 마커 정보 가져오기
        aidrone_get_marker_data: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['마커ID', 'id'],
                        ['X좌표', 'x'],
                        ['Y좌표', 'y'],
                        ['거리(cm)', 'dist'],
                        ['크기(pixel)', 'width']
                    ],
                    value: 'id',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                }
            ],
            events: {},
            def: { params: [null], type: 'aidrone_get_marker_data' },
            paramsKeyMap: { DATA_TYPE: 0 },
            class: 'AIDrone_Vision',
            isNotFor: ['AIDrone'],
            func: function(sprite, script) {
                var key = script.getField('DATA_TYPE', script);
                return Entry.AIDrone.visionData[key];
            },
            syntax: { js: [], py: [] }
        },
        // --- [여기까지] 3단계 코드 끝 ---

        // ===================================================
        // tracking.js 기반 비전 블록 (4단계)
        // 의존 라이브러리: block_aidrone_tracking.js (window.tracking, window.AR, window.CV)
        // ===================================================

        // -----------------------------------------------
        // [블록 1] 색상 추적 시작
        //   - 드롭다운으로 색상 선택 (cyan / magenta / yellow)
        //   - 웹캠 영상에서 해당 색상 영역을 지속 감지
        //   - 결과는 Entry.AIDrone.colorTrackData 에 저장
        // -----------------------------------------------
        aidrone_color_track_start: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['청록색(cyan)', 'cyan'],
                        ['자홍색(magenta)', 'magenta'],
                        ['노란색(yellow)', 'yellow']
                    ],
                    value: 'cyan',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                { type: 'Indicator', img: 'block_icon/hardware_icon.svg', size: 12 }
            ],
            events: {},
            def: { params: [null, null], type: 'aidrone_color_track_start' },
            paramsKeyMap: { COLOR: 0 },
            class: 'AIDrone_Vision',
            isNotFor: ['AIDrone'],
            func: function(sprite, script) {
                if (typeof tracking === 'undefined') {
                    console.warn('tracking.js 라이브러리가 로드되지 않았습니다.');
                    return script.callReturn();
                }

                // 이미 실행 중이면 중지 후 재시작
                if (Entry.AIDrone._colorTrackerRunning) {
                    Entry.AIDrone._colorTrackerRunning = false;
                    if (Entry.AIDrone._colorTrackerStop) {
                        Entry.AIDrone._colorTrackerStop();
                        Entry.AIDrone._colorTrackerStop = null;
                    }
                }

                var colorName = script.getField('COLOR', script);

                var tracker = new tracking.ColorTracker([colorName]);
                tracker.setMinDimension(20);
                tracker.setMinGroupSize(30);

                tracker.on('track', function(event) {
                    // 매번 최신 canvas 크기 참조 (클로저 캡처 제거)
                    var src = Entry.AIDrone._getVisionCanvas();
                    var w = src ? src.width  : 480;
                    var h = src ? src.height : 270;
                    if (event.data.length > 0) {
                        var biggest = event.data.reduce(function(a, b) {
                            return (a.width * a.height >= b.width * b.height) ? a : b;
                        });
                        var cx = biggest.x + biggest.width  / 2;
                        var cy = biggest.y + biggest.height / 2;
                        Entry.AIDrone.colorTrackData.detected = true;
                        Entry.AIDrone.colorTrackData.x       = Math.round(cx - w / 2);
                        Entry.AIDrone.colorTrackData.y       = Math.round(h / 2 - cy);
                        Entry.AIDrone.colorTrackData.width   = Math.round(biggest.width);
                        Entry.AIDrone.colorTrackData.height  = Math.round(biggest.height);
                    } else {
                        Entry.AIDrone.colorTrackData.detected = false;
                    }
                });

                // requestAnimationFrame 루프로 매 프레임 분석
                var raf;
                function colorLoop() {
                    if (!Entry.AIDrone._colorTrackerRunning) return;
                    try {
                        var src = Entry.AIDrone._getVisionCanvas();
                        if (!src || !src.width || !src.height) {
                            raf = requestAnimationFrame(colorLoop);
                            return;
                        }
                        var w = src.width, h = src.height;
                        var imgData = src.getContext('2d').getImageData(0, 0, w, h);
                        tracker.track(imgData.data, w, h);
                    } catch(e) {}
                    raf = requestAnimationFrame(colorLoop);
                }
                Entry.AIDrone._colorTrackerRunning = true;
                Entry.AIDrone._colorTrackerStop = function() {
                    Entry.AIDrone._colorTrackerRunning = false;
                    if (raf) cancelAnimationFrame(raf);
                };
                colorLoop();
                return script.callReturn();
            },
            syntax: { js: [], py: [] }
        },

        // -----------------------------------------------
        // [블록 2] 색상 추적 중지
        // -----------------------------------------------
        aidrone_color_track_stop: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                { type: 'Indicator', img: 'block_icon/hardware_icon.svg', size: 12 }
            ],
            events: {},
            def: { params: [null], type: 'aidrone_color_track_stop' },
            class: 'AIDrone_Vision',
            isNotFor: ['AIDrone'],
            func: function(sprite, script) {
                // RAF 루프 중지
                if (Entry.AIDrone._colorTrackerStop) {
                    Entry.AIDrone._colorTrackerStop();
                    Entry.AIDrone._colorTrackerStop = null;
                } else {
                    Entry.AIDrone._colorTrackerRunning = false;
                }
                Entry.AIDrone.colorTrackData = { detected: false, x: 0, y: 0, width: 0, height: 0 };
                return script.callReturn();
            },
            syntax: { js: [], py: [] }
        },

        // -----------------------------------------------
        // [블록 3] 색상 추적 데이터 읽기 (값 블록)
        //   반환: detected(감지여부) / x / y / width / height
        // -----------------------------------------------
        aidrone_get_color_data: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['감지여부', 'detected'],
                        ['X좌표',   'x'],
                        ['Y좌표',   'y'],
                        ['가로크기', 'width'],
                        ['세로크기', 'height']
                    ],
                    value: 'detected',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                }
            ],
            events: {},
            def: { params: [null], type: 'aidrone_get_color_data' },
            paramsKeyMap: { DATA_TYPE: 0 },
            class: 'AIDrone_Vision',
            isNotFor: ['AIDrone'],
            func: function(sprite, script) {
                var key = script.getField('DATA_TYPE', script);
                var val = Entry.AIDrone.colorTrackData[key];
                // detected 는 boolean → 1/0 으로 변환해서 반환
                if (key === 'detected') return val ? 1 : 0;
                return val !== undefined ? val : 0;
            },
            syntax: { js: [], py: [] }
        },

        // -----------------------------------------------
        // [블록 4] 얼굴 인식 (1회 감지)
        //   - 엔트리 캔버스 현재 프레임에서 ViolaJones 얼굴 감지
        //   - 결과는 Entry.AIDrone.faceData 에 저장
        //   - 얼굴이 여러 개면 가장 큰 얼굴 하나만 저장
        // -----------------------------------------------
        aidrone_face_detect: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                { type: 'Indicator', img: 'block_icon/hardware_icon.svg', size: 12 }
            ],
            events: {},
            def: { params: [null], type: 'aidrone_face_detect' },
            class: 'AIDrone_Vision',
            isNotFor: ['AIDrone'],
            func: function(sprite, script) {
                if (typeof tracking === 'undefined') {
                    console.warn('tracking.js 라이브러리가 로드되지 않았습니다.');
                    return script.callReturn();
                }

                // 비전 소스 canvas 획득 (video 스프라이트 우선)
                var canvas = Entry.AIDrone._getVisionCanvas();
                if (!canvas) return script.callReturn();

                try {
                    var ctx     = canvas.getContext('2d');
                    var width   = canvas.width;
                    var height  = canvas.height;
                    var imgData = ctx.getImageData(0, 0, width, height);

                    // ViolaJones 분류기가 로드되어 있어야 함 (block_aidrone_tracking.js 내 포함)
                    var faces = tracking.ViolaJones.detect(
                        imgData.data, width, height,
                        1,    // initialScale
                        1.25, // scaleFactor
                        1.5,  // stepSize
                        0.1,  // edgesDensity
                        tracking.ViolaJones.classifiers.face
                    );

                    if (faces && faces.length > 0) {
                        // 가장 큰 얼굴 선택
                        var biggest = faces.reduce(function(a, b) {
                            return (a.width * a.height >= b.width * b.height) ? a : b;
                        });
                        var cx = biggest.x + biggest.width  / 2;
                        var cy = biggest.y + biggest.height / 2;
                        Entry.AIDrone.faceData.detected = true;
                        Entry.AIDrone.faceData.x        = cx - width  / 2;
                        Entry.AIDrone.faceData.y        = height / 2  - cy;
                        Entry.AIDrone.faceData.width    = biggest.width;
                        Entry.AIDrone.faceData.height   = biggest.height;

                        // 랜드마크도 함께 계산 (LBF 모델 활용)
                        if (tracking.LBF && tracking.LBF.align) {
                            var gray = tracking.Image.grayscale(imgData.data, width, height, false);
                            gray = tracking.Image.equalizeHist(gray, width, height);
                            var bbox = [{
                                x: biggest.x, y: biggest.y,
                                width: biggest.width, height: biggest.height
                            }];
                            // LBF.align은 그레이스케일 배열을 받아야 함
                            var landmarks = tracking.LBF.align(gray, width, height, bbox);
                            if (landmarks && landmarks[0]) {
                                Entry.AIDrone.landmarkData = landmarks[0].map(function(pt) {
                                    return {
                                        x: pt[0] - width  / 2,
                                        y: height / 2 - pt[1]
                                    };
                                });
                            }
                        }
                    } else {
                        Entry.AIDrone.faceData.detected = false;
                        Entry.AIDrone.landmarkData = [];
                    }
                } catch(e) {
                    console.log('Face detect error:', e);
                }

                return script.callReturn();
            },
            syntax: { js: [], py: [] }
        },

        // -----------------------------------------------
        // [블록 5] 얼굴 인식 데이터 읽기 (값 블록)
        //   반환: detected / x / y / width / height
        // -----------------------------------------------
        aidrone_get_face_data: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['감지여부', 'detected'],
                        ['X좌표',   'x'],
                        ['Y좌표',   'y'],
                        ['가로크기', 'width'],
                        ['세로크기', 'height']
                    ],
                    value: 'detected',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                }
            ],
            events: {},
            def: { params: [null], type: 'aidrone_get_face_data' },
            paramsKeyMap: { DATA_TYPE: 0 },
            class: 'AIDrone_Vision',
            isNotFor: ['AIDrone'],
            func: function(sprite, script) {
                var key = script.getField('DATA_TYPE', script);
                var val = Entry.AIDrone.faceData[key];
                if (key === 'detected') return val ? 1 : 0;
                return val !== undefined ? val : 0;
            },
            syntax: { js: [], py: [] }
        },

        // -----------------------------------------------
        // [블록 6] 얼굴 랜드마크 좌표 읽기 (값 블록)
        //   - 점 번호(0~67) 선택, X 또는 Y 좌표 반환
        //   - aidrone_face_detect 블록 실행 후 유효
        //   - 점 번호 의미: 0-16 턱선, 17-21 왼눈썹,
        //     22-26 오른눈썹, 27-30 코등, 31-35 콧구멍,
        //     36-41 왼눈, 42-47 오른눈, 48-67 입
        // -----------------------------------------------
        aidrone_get_landmark: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string'
                },
                {
                    type: 'Dropdown',
                    options: [
                        ['X좌표', 'x'],
                        ['Y좌표', 'y']
                    ],
                    value: 'x',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                }
            ],
            events: {},
            def: { params: [{ type: 'text', params: ['0'] }, null], type: 'aidrone_get_landmark' },
            paramsKeyMap: { INDEX: 0, AXIS: 1 },
            class: 'AIDrone_Vision',
            isNotFor: ['AIDrone'],
            func: function(sprite, script) {
                var idx  = parseInt(script.getStringValue('INDEX', script), 10);
                var axis = script.getField('AXIS', script);
                if (
                    isNaN(idx) || idx < 0 || idx > 67 ||
                    !Entry.AIDrone.landmarkData ||
                    Entry.AIDrone.landmarkData.length === 0
                ) {
                    return 0;
                }
                var pt = Entry.AIDrone.landmarkData[idx];
                return pt ? (pt[axis] !== undefined ? pt[axis] : 0) : 0;
            },
            syntax: { js: [], py: [] }
        },

        // ===================================================
        // ===================================================
        // 추가 편의 블록 (조건 블록 + 개별 값 블록)
        // ===================================================

        // -----------------------------------------------
        // [블록 A] 마커 감지됨? (조건 블록)
        // -----------------------------------------------
        aidrone_marker_detected: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_boolean_field',
            statements: [],
            params: [
                { type: 'Indicator', img: 'block_icon/hardware_icon.svg', size: 12 }
            ],
            events: {},
            def: { params: [null], type: 'aidrone_marker_detected' },
            class: 'AIDrone_Vision',
            isNotFor: ['AIDrone'],
            func: function(sprite, script) {
                return Entry.AIDrone.visionData.id !== -1;
            },
            syntax: { js: [], py: [] }
        },

        // -----------------------------------------------
        // [블록 B] 색상 감지됨? (조건 블록)
        // -----------------------------------------------
        aidrone_color_detected: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_boolean_field',
            statements: [],
            params: [
                { type: 'Indicator', img: 'block_icon/hardware_icon.svg', size: 12 }
            ],
            events: {},
            def: { params: [null], type: 'aidrone_color_detected' },
            class: 'AIDrone_Vision',
            isNotFor: ['AIDrone'],
            func: function(sprite, script) {
                return Entry.AIDrone.colorTrackData.detected === true;
            },
            syntax: { js: [], py: [] }
        },

        // -----------------------------------------------
        // [블록 C] 감지된 색상 X좌표 (값 블록)
        // -----------------------------------------------
        aidrone_get_color_x: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                { type: 'Indicator', img: 'block_icon/hardware_icon.svg', size: 12 }
            ],
            events: {},
            def: { params: [null], type: 'aidrone_get_color_x' },
            class: 'AIDrone_Vision',
            isNotFor: ['AIDrone'],
            func: function(sprite, script) {
                return Entry.AIDrone.colorTrackData.x || 0;
            },
            syntax: { js: [], py: [] }
        },

        // -----------------------------------------------
        // [블록 D] 감지된 색상 Y좌표 (값 블록)
        // -----------------------------------------------
        aidrone_get_color_y: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                { type: 'Indicator', img: 'block_icon/hardware_icon.svg', size: 12 }
            ],
            events: {},
            def: { params: [null], type: 'aidrone_get_color_y' },
            class: 'AIDrone_Vision',
            isNotFor: ['AIDrone'],
            func: function(sprite, script) {
                return Entry.AIDrone.colorTrackData.y || 0;
            },
            syntax: { js: [], py: [] }
        },

        // -----------------------------------------------
        // [블록 E] 감지된 색상 크기 (값 블록)
        // -----------------------------------------------
        aidrone_get_color_size: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                { type: 'Indicator', img: 'block_icon/hardware_icon.svg', size: 12 }
            ],
            events: {},
            def: { params: [null], type: 'aidrone_get_color_size' },
            class: 'AIDrone_Vision',
            isNotFor: ['AIDrone'],
            func: function(sprite, script) {
                var d = Entry.AIDrone.colorTrackData;
                return d.width && d.height ? Math.round((d.width + d.height) / 2) : 0;
            },
            syntax: { js: [], py: [] }
        },

        // -----------------------------------------------
        // [블록 F] 얼굴 감지됨? (조건 블록)
        // -----------------------------------------------
        aidrone_face_detected: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_boolean_field',
            statements: [],
            params: [
                { type: 'Indicator', img: 'block_icon/hardware_icon.svg', size: 12 }
            ],
            events: {},
            def: { params: [null], type: 'aidrone_face_detected' },
            class: 'AIDrone_Vision',
            isNotFor: ['AIDrone'],
            func: function(sprite, script) {
                return Entry.AIDrone.faceData.detected === true;
            },
            syntax: { js: [], py: [] }
        },

        // -----------------------------------------------
        // [블록 G] 얼굴 X좌표 (값 블록)
        // -----------------------------------------------
        aidrone_get_face_x: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                { type: 'Indicator', img: 'block_icon/hardware_icon.svg', size: 12 }
            ],
            events: {},
            def: { params: [null], type: 'aidrone_get_face_x' },
            class: 'AIDrone_Vision',
            isNotFor: ['AIDrone'],
            func: function(sprite, script) {
                return Entry.AIDrone.faceData.x || 0;
            },
            syntax: { js: [], py: [] }
        },

        // -----------------------------------------------
        // [블록 H] 얼굴 Y좌표 (값 블록)
        // -----------------------------------------------
        aidrone_get_face_y: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                { type: 'Indicator', img: 'block_icon/hardware_icon.svg', size: 12 }
            ],
            events: {},
            def: { params: [null], type: 'aidrone_get_face_y' },
            class: 'AIDrone_Vision',
            isNotFor: ['AIDrone'],
            func: function(sprite, script) {
                return Entry.AIDrone.faceData.y || 0;
            },
            syntax: { js: [], py: [] }
        },

        // -----------------------------------------------
        // [블록 I] 얼굴 크기 (값 블록)
        // -----------------------------------------------
        aidrone_get_face_size: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                { type: 'Indicator', img: 'block_icon/hardware_icon.svg', size: 12 }
            ],
            events: {},
            def: { params: [null], type: 'aidrone_get_face_size' },
            class: 'AIDrone_Vision',
            isNotFor: ['AIDrone'],
            func: function(sprite, script) {
                // 1. 객체가 존재하는지 먼저 확인
                if (Entry.AIDrone && Entry.AIDrone.faceData) {
                    return Entry.AIDrone.faceData.y || 0;
                }
                // 2. 객체가 없으면 안전하게 0을 반환하여 에러 방지
                return 0;
            },
            syntax: { js: [], py: [] }
        },

        // tracking.js 블록 끝
        // ===================================================

        //endregion AIDrone
    };
};

module.exports = Entry.AIDrone;
