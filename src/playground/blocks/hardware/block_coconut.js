'use strict';

Entry.coconut = {
    PORT_MAP: {
        leftFloorValue: 0,
        rightFloorValue: 0,
        BothFloorDetection: 0,
        leftProximityValue: 0,
        rightProximityValue: 0,
        BothProximityDetection: 0,
        obstacleDetection: 0,
        light: 0,
        temp: 0,
        extA2: 0,
        extA3: 0,
    },
    setZero: function() {
        var sq = Entry.hw.sendQueue;
        sq.msgValue = [0xff, 0x55, 0x02, 0x00, 0x04];
        Entry.hw.update();
    },
    lineTracerModeId: 0,
    lineTracerStateId: -1,
    tempo: 60,
    timeouts: [],
    removeTimeout: function(a) {
        clearTimeout(a);
        var b = this.timeouts;
        a = b.indexOf(a);
        0 <= a && b.splice(a, 1);
    },
    removeAllTimeouts: function() {
        var a = this.timeouts,
            b;
        for (b in a) {
            clearTimeout(a[b]);
        }
        this.timeouts = [];
    },
    setLineTracerMode: function(a, b) {
        this.lineTracerModeId = (this.lineTracerModeId + 1) & 255;
        a.lineTracerMode = b;
        a.lineTracerModeId = this.lineTracerModeId;
    },
    //START : 2017.02.22 : LTW
    msgValue: 0,
    insertQueue: function(msg, sq) {
        sq.msgValue = msg;
    },
    clearQueue: function(sq) {
        sq.msgValue = '';
    },

    move: function(direction) {
        if (typeof direction == 'string') direction = this.directions[direction];
        // seq, direction, speed, degree, time
        return this.runPackage(this.devices['Motor'], 0, direction, this.speed);
    },
    /* Scratch coconut Extension import */
    speed: 60,
    directions: { Both: 0, Left: 1, Right: 2, Forward: 3, Backward: 4 },
    devices: {
        LightSensor: 14,
        Accelerometer: 18,
        Temperature: 21,
        Buzzer: 3,
        IRdistance: 5,
        Linetracer: 7,
        IR: 9,
        RGBled: 25,
        Motor: 26,
        LedMatrix: 27,
        Digital: 30,
        Analog: 31,
        PWM: 32,
        External: 40,
        Speaker: 41,
        ExtIR: 42,
        ServoMotor: 43,
        ExLed: 44,
        ExtCds: 45,
    },
    sharps: { '-': 0, '#': 1, b: 2 },
    beats: {
        Half: 500,
        Quater: 250,
        Eighth: 125,
        Sixteenth: 63,
        'Thirty-second': 32,
        Whole: 1000,
        'Dotted half': 750,
        'Dotted quarter': 375,
        'Dotted eighth': 188,
        'Dotted sixteenth': 95,
        'Dotted thirty-second': 48,
        Double: 2000,
        Zero: 0,
    },
    melodys: {
        'Twinkle Twinkle little star': 1,
        'Three bears': 2,
        "Mozart's Lullaby": 3,
        'Do-Re-Mi': 4,
        Butterfly: 5,
    },
    colors: {
        Black: 0,
        White: 1,
        Red: 2,
        Green: 3,
        Blue: 4,
        Yellow: 5,
        Cyan: 6,
        Magenta: 7,
    },
    // IR distance 감지조건
    detectConds: { Yes: 1, No: 0 },
    /// 도트매트릭스 문자
    // 소문자
    sLetters: {
        a: 0,
        b: 1,
        c: 2,
        d: 3,
        e: 4,
        f: 5,
        g: 6,
        h: 7,
        i: 8,
        j: 9,
        k: 10,
        l: 11,
        m: 12,
        n: 13,
        o: 14,
        p: 15,
        q: 16,
        r: 17,
        s: 18,
        t: 19,
        u: 20,
        v: 21,
        w: 22,
        x: 23,
        y: 24,
        z: 25,
    },
    // 대문자
    cLetters: {
        A: 0,
        B: 1,
        C: 2,
        D: 3,
        E: 4,
        F: 5,
        G: 6,
        H: 7,
        I: 8,
        J: 9,
        K: 10,
        L: 11,
        M: 12,
        N: 13,
        O: 14,
        P: 15,
        Q: 16,
        R: 17,
        S: 18,
        T: 19,
        U: 20,
        V: 21,
        W: 22,
        X: 23,
        Y: 24,
        Z: 25,
    },
    // 한글
    kLetters: {
        ga: 0,
        na: 1,
        da: 2,
        la: 3,
        ma: 4,
        ba: 5,
        sa: 6,
        aa: 7,
        ja: 8,
        cha: 9,
        ka: 10,
        ta: 11,
        pa: 12,
        ha: 13,
    },
    onOffs: { On: 1, Off: 0 },
    axiss: { 'X-Axis': 1, 'Y-Axis': 2, 'Z-Axis': 3 },
    // external
    pins: { D4: 4, D10: 10, D11: 11, D12: 12, A2: 16, A3: 17 },
    outputValues: { HIGH: 1, LOW: 0 },

    /**
     * @brief   모터 움직이기 - 전진/후진/좌회전/우회전
     * @details 기본 속도 적용, 시간제한 없음
     * @date    2016.04.27
     *
     * @param   direction     방향 (1: Left, 2: Right, 3: Forward, 4: Backward), default: Go
     */
    moveMotor: function(direction) {
        if (typeof direction == 'string') direction = this.directions[direction];
        // seq, direction, speed, degree, time
        return this.runPackage(this.devices['Motor'], 0, direction, this.speed);
    },

    moveMotorSpeed: function(direction, speed) {
        if (typeof direction == 'string') direction = this.directions[direction];
        // seq, direction, speed, degree, time
        return this.runPackage(this.devices['Motor'], 0, direction, this.speed);
    },

    /**
     * @brief   모터 움직이기 - 좌회전/우회전
     * @details 기본 속도 적용, 시간제한 없음
     *
     * @param   direction     방향 (1: Left, 2: Right, 3: Forward, 4: Backward), default: Go
     */
    turnMotor: function(direction) {
        if (typeof direction == 'string') direction = this.directions[direction];
        // seq, direction, speed, degree, time
        return this.runPackage(this.devices['Motor'], 0, direction, this.speed);
    },

    /**
     * @brief   모터 정지
     * @date    2016.06.23
     */
    stopMotor: function() {
        return this.runPackage(this.devices['Motor'], 1);
    },

    /**
     * @brief   좌측/우측으로 각도 만큼 돌기
     * @details 기본속도 적용, 정해진 각도만큼 회전후 정지
     * @todo    degree<0 반대방향 적용 여부 결정
     * @date    2016.04.27
     * @param   direction   방향 (1: Left, 2: Right), default: Left
     * @param   degree      회전각도 (0~360도), default: 90도
     */
    moveTurnAngle: function(direction, degree) {
        var sec = 0; // 제한없음

        if (typeof direction == 'string') direction = this.directions[direction];

        // 각도가 360 이상일 경우 360으로 고정
        if (degree > 360 || degree < -360) degree = 360;
        // seq, direction, speed, degree, time
        //motorControl(2, direction, speed, degree, sec);
    },

    /**
     * @brief 움직이기 - 전/후진, 좌/우회전 - 시간
     * @details 기본속도 적용
     * @date2016.04.27
     *
     * @param direction 방향 (1: Left, 2: Right, 3: Forward, 4: Backward), default: Go
     * @param sec 시간 (초), default: 1초
     */
    moveGoTime: function(direction, sec) {
        // 시간이 0보다 작으면 양수로 변환
        if (sec < 0) sec = -sec;
        sec = 1000 * sec; // ms 변환

        if (typeof direction == 'string') direction = this.directions[direction];

        // seq, direction, speed, degree, time
        return this.runPackage(
            this.devices['Motor'],
            3,
            direction,
            this.speed,
            this.short2array(sec)
        );
    },

    /**
     * @brief 좌/우회전 - 시간
     * @details 기본속도 적용
     *
     * @param direction 방향 (1: Left, 2: Right), default: Go
     * @param sec 시간 (초), default: 1초
     */
    turnMotorTime: function(direction, sec) {
        // 시간이 0보다 작으면 양수로 변환
        if (sec < 0) sec = -sec;
        sec = 1000 * sec; // ms 변환

        if (typeof direction == 'string') direction = this.directions[direction];

        return this.runPackage(
            this.devices['Motor'],
            3,
            direction,
            this.speed,
            this.short2array(sec)
        );
    },

    /**
     * @brief 좌/우측 무한 회전하는 동안 RGB LED 켜기
     *
     * @paramdirection 방향 (1: Left, 2: Right), default: Left
     * @paramcolor RGB LED 색상 (1: Red, 2: Green, 3: Blue), default: Red
     */
    moveMotorColor: function(direction, color) {
        var deviceID = this.devices['Motor'];

        if (typeof direction == 'string') direction = this.directions[direction];
        if (typeof color == 'string') color = this.colors[color];

        // deviceid, seq, direction, speed, color
        return this.runPackage(deviceID, 5, direction, this.speed, color);
    },

    /**
     * @brief 좌/우측 각도에 따라 회전하는 동안 RGB LED 켜기
     * @todo각도 설정 불가, 추후 삭제
     *
     * @param direction 방향 (1: Left, 2: Right), default: Left
     * @param angle 회전각도 (0~360도)
     * @param color RGB LED 색상 (1: Red, 2: Green, 3: Blue), default: Red
     */
    moveMotorAngleColor: function(direction, angle, color) {
        var deviceID = this.devices['Motor'];

        if (typeof direction == 'string') direction = this.directions[direction];
        if (typeof color == 'string') color = this.colors[color];
        if (typeof angle != 'number') angle = 90;

        // deviceid, seq, direction, speed, angle, time, color
        return this.runPackage(
            deviceID,
            6,
            direction,
            this.short2array(0),
            this.short2array(angle),
            this.short2array(0),
            color
        );
    },

    /**
     * @brief control external motor
     *
     * @param direction 방향 (1: Left, 2: Right, 3: Forward, 4: Backward), default: Go
     * @param speed 속도 (0-255)
     */
    moveExtMotor: function(direction, speed) {
        if (typeof direction == 'string') direction = this.directions[direction];

        // deviceid, seq, direction, speed
        return this.runPackage(this.devices['Motor'], 7, direction, speed);
    },

    /**
     * @brief RGB LED 켜기 - 방향, 색상 선택
     * @details 시간제한 없음, seq=0
     *
     * @date2016.04.28
     * @param direction 방향 (0: both, 1: Left, 2: Right), default: Left
     * @param color 색상 (1: Red, 2: Green, 3: Blue), default: Red
     */
    rgbOn: function(direction, color) {
        if (typeof direction == 'string') direction = this.directions[direction];
        if (typeof color == 'string') color = this.colors[color];

        return this.runPackage(this.devices['RGBled'], 0, direction, color);
    },

    /**
     * @brief RGB LED 끄기 - 방향
     * @details 시간제한 없음, seq=1
     *
     * @param direction방향 (0: all, 1: Left, 2: Right), default: Left
     */
    rgbOff: function(direction) {
        if (typeof direction == 'string') direction = this.directions[direction];

        return this.runPackage(this.devices['RGBled'], 1, direction, 0);
    },

    /**
     * @brief RGB LED 끄기 - 방향, 색상
     * @details seq=2
     * @date2016.05.30
     *
     * @param direction 방향 (0: all, 1: Left, 2: Right), default: Left
     * @param color 색상 (1: Red, 2: Green, 3: Blue), default: Red
     */
    rgbOffColor: function(direction, color) {
        if (typeof direction == 'string') direction = this.directions[direction];
        if (typeof color == 'string') color = this.colors[color];

        return this.runPackage(this.devices['RGBled'], 1, direction, color);
    },

    /**
     * @brief RGB LED 켜기 - 방향, 색상, 시간
     * @details seq=2
     * @date2016.04.28
     *
     * @param direction 방향 (0: all, 1: Left, 2: Right), default: Left
     * @param color 색상 (1: Red, 2: Green, 3: Blue), default: Red
     * @param sec 시간, 초
     */
    ledOnTime: function(direction, color, sec) {
        if (typeof direction == 'string') direction = this.directions[direction];
        if (typeof color == 'string') color = this.colors[color];

        // 시간이 정수가 아니거나 0보다 작을 경우 0으로 변경
        if (typeof sec != 'number') sec = 0;
        else if (sec < 0) sec = 0;
        else sec *= 1000; // ms 변환

        return this.runPackage(this.devices['RGBled'], 3, direction, color, this.short2array(sec));
    },

    /// buzzer
    /**
     * @brief 스피커 켜기
     * @details 버저음을 기본 주파수 c4 로 짧게 소리낸다.
     */
    beep: function() {
        return this.buzzerControl(0, 262, 50);
        //
    },

    /**
     * @brief 버저음을 seconds 동안 소리내기 (기본주파수)
     * @details 기본주파수 : c4 (도)
     * @date2015.04.26
     * @param sec 연주시간 (seconds, 초)
     */
    playBuzzerTime: function(sec) {
        // 시간이 숫자가 아니거나 0보다 작을 경우 0.5초로 고정
        if (typeof sec != 'number') sec = 0.5;
        if (sec < 0) sec = 0.5;

        sec = 1000 * sec; // milliseconds 변환

        return this.buzzerControl(0, 262, sec);
    },

    /**
     * @brief 버저음 freq hz를 seconds 초 동안 소리내기
     * @date2016.04.26
     * @param freq주파수 hz
     * @param sec 연주시간 (seconds, 초)
     */
    playBuzzerFreq: function(freq, sec) {
        // 시간이 숫자가 아니거나 0보다 작을 경우 0.5초로 고정
        if (typeof sec != 'number') sec = 0.5;
        if (sec < 0) sec = 0.5;

        sec = 1000 * sec; // milliseconds 변환

        // 주파수가 숫자가 아니거나 0보다 작을 경우 300hz로 고정
        if (typeof freq != 'number') freq = 300;
        if (freq < 0) freq = 300;

        return this.buzzerControl(0, freq, sec);
    },

    /**
     * @brief 버저 끄기
     * @details tone = 0 일 경우 버저 끄기 실행
     */
    buzzerOff: function() {
        // tone=0, beat=0
        return this.buzzerControl(0, 0, 0);
    },

    /**
     * @brief 버저 tone 음을 beat 박자로 실행
     * @param note음계
     * @param octave옥타브
     * @param beat박자
     */
    playBuzzerNote: function(note, octave, beat) {
        // note 에서 `NOTE_` 다음 문자열만 추출
        //var arrNote = note.split("NOTE_",2);
        note = this.getNote(note);

        if (typeof beat == 'string') beat = this.beats[beat];

        // note ascii 코드로 변환하여 전송
        return this.runPackage(
            this.devices['Buzzer'],
            2,
            note.charCodeAt(0),
            octave,
            this.short2array(beat)
        );
    },

    /**
     * @brief 버저 tone 음을 beat 박자로 실행
     * @param note음계
     * @param octave옥타브
     * @param sharp 올림표/내림표 (-:0, #:1, b:2)
     * @param beat박자
     */
    playNote: function(note, octave, sharp, beat) {
        // note 에서 `NOTE_` 다음 문자열만 추출
        note = this.getNote(note);
        if (typeof beat == 'string') beat = this.beats[beat];
        return this.runPackage(
            this.devices['Buzzer'],
            4,
            note.charCodeAt(0),
            octave,
            sharp.charCodeAt(0),
            this.short2array(beat)
        );
    },

    /**
     * @brief 음계 문자 추출
     * @param note음계 (eg. NOTE_C)
     */
    getNote: function(note) {
        // note 에서 `NOTE_` 다음 문자열만 추출
        var arrNote = note.split('_');

        return arrNote[1];
    },

    /**
     * @brief 박자 쉬기
     * @param beat박자
     */
    restBeat: function(beat) {
        if (typeof beat == 'string') {
            // Half_rest 에서 `_` 앞 문자열만 추출하여 박자 설정
            var arrBeat = beat.split('_', 1);
            beat = this.beats[arrBeat];
        }

        return this.buzzerControl(1, 0, beat);
    },

    /**
     * @brief 버저 tone+octave 음을 beat 박자로 실행시 LED 켜기
     * @paramnote
     * @paramoctave
     * @parambeat
     * @paramcolor 색상 (1: Red, 2: Green, 3: Blue), default: Red
     */
    playBuzzerColor: function(note, octave, beat, color) {
        // note 에서 `NOTE_` 다음 문자열만 추출
        //var arrNote = note.split("NOTE_",2);
        note = this.getNote(note);

        if (typeof beat == 'string') beat = this.beats[beat];
        if (typeof color == 'string') color = this.colors[color];

        return this.runPackage(
            this.devices['Buzzer'],
            3,
            note.charCodeAt(0),
            octave,
            this.short2array(beat),
            color
        );
    },
    /**
     * @brief 버저 tone+octave 음을 beat 박자로 실행시 LED 켜기
     * @param note
     * @param octave
     * @param sharp 올림표/내림표 (-:0, #:1, b:2)
     * @param beat
     * @param direction Left:1, Right:2, All: 0
     * @param color 1: Red, 2: Green, 3: Blue, default: Red
     */
    playNoteColor: function(note, octave, sharp, beat, direction, color) {
        // note 에서 `NOTE_` 다음 문자열만 추출
        note = this.getNote(note);

        if (typeof beat == 'string') beat = this.beats[beat];
        if (typeof direction == 'string') direction = this.directions[direction];
        if (typeof color == 'string') color = this.colors[color];

        return this.runPackage(
            this.devices['Buzzer'],
            5,
            note.charCodeAt(0),
            octave,
            sharp.charCodeAt(0),
            this.short2array(beat),
            direction,
            color
        );
    },

    /**
     * @brief 멜로디 연주하기
     * @param melody멜로디 (1:작은별, 2:곰세마리, 3:자장가, 4:도레미송, 5:나비야)
     */
    playMelody: function(melody) {
        if (typeof melody == 'string') melody = this.melodys[melody];
        return this.runPackage(this.devices['Buzzer'], 6, melody);
    },

    /**
     * @brief 버저 제어
     * @details
     * @param seq 순번 (0: 연주, 1: 박자쉬기, 2: 음표 연주)
     * @param tone주파수
     * @param beat박자
     * @param note음표
     */
    buzzerControl: function(seq, tone, beat) {
        var deviceID = this.devices['Buzzer'];

        if (typeof beat == 'string') beat = this.beats[beat];

        return this.runPackage(deviceID, seq, this.short2array(tone), this.short2array(beat));
    },

    // led blink
    runBlink: function() {
        var pin = 13;
        return this.runPackage(30, pin);
    },

    /**
     * @brief 선 따라가기, level=5 (default)
     */
    followLine: function() {
        return this.runPackage(this.devices['Linetracer'], 3, this.speed);
    },

    /**
     * @brief 선 따라가기, 속도 설정
     */
    followLineLevel: function(level, speed) {
        if (typeof speed != 'number') speed = 70;
        return this.runPackage(this.devices['Linetracer'], 3, level, speed);
    },

    /**
     * @brief 장애물 감지 기준 변경
     * @date2016.05.24
     *
     * @param direction 방향, default Left (1: Left, 2: Right)
     * @param standard감지 기준
     */
    setStandard: function(direction, standard) {
        if (typeof direction == 'string') direction = this.directions[direction];
        return this.runPackage(this.devices['IRdistance'], 0, direction, standard);
    },

    /**
     * @brief 어보이드 모드
     */
    avoidMode: function() {
        return this.runPackage(this.devices['IRdistance'], 3);
    },

    /// LED Matrix
    /**
     * @brief Led Matrix 행열 켜기
     *
     * @param row 행 번호, 0-8 (Both=0)
     * @param col 열 번호, 0-8 (Both=0)
     * @param onOff on=1, off=0
     */
    ledMatrixOn: function(onOff, row, col) {
        if (typeof onOff == 'string') onOff = this.onOffs[onOff];
        if (typeof row == 'string' && row == 'Both') row = 0;
        if (typeof col == 'string' && col == 'Both') col = 0;

        return this.runPackage(this.devices['LedMatrix'], 0, row, col, onOff);
    },

    /**
     * @brief Led Matrix 행열 끄기
     *
     * @param row 행 번호
     * @param col 열 번호
     */
    ledMatrixOff: function(row, col) {
        return this.runPackage(this.devices['LedMatrix'], 0, row, col, 0);
    },

    /**
     * @brief Led Matrix 모두 끄기
     */
    ledMatrixClear: function() {
        return this.runPackage(this.devices['LedMatrix'], 5); // seq=5
    },

    /**
     * @brief Led Matrix 모두 켜기
     */
    ledMatrixOnAll: function() {
        return this.runPackage(this.devices['LedMatrix'], 6); // seq=6
    },

    /**
     * @brief Led Matrix 숫자 표시
     *
     * @param code 숫자 (0-9)
     */
    showLedMatrix: function(code) {
        return this.runPackage(this.devices['LedMatrix'], 1, code);
    },

    /**
     * @brief Led Matrix 영문 소문자 표시
     *
     * @param code 소문자 (a-z)
     */
    showLedMatrixSmall: function(code) {
        if (typeof code == 'string') code = this.sLetters[code];
        return this.runPackage(this.devices['LedMatrix'], 2, code);
    },

    /**
     * @brief Led Matrix 영문 대문자 표시
     *
     * @param code 대문자(A-Z)
     */
    showLedMatrixLarge: function(code) {
        if (typeof code == 'string') code = this.cLetters[code];
        return this.runPackage(this.devices['LedMatrix'], 3, code);
    },

    /**
     * @brief Led Matrix 한글 표시
     *
     * @param code 한글 (가-하)
     */
    showLedMatrixKorean: function(code) {
        if (typeof code == 'string') code = this.kLetters[code];
        return this.runPackage(this.devices['LedMatrix'], 4, code);
    },

    /// IR
    /**
     * @brief IR 메시지 보내기
     *
     * @param message 전송할 문자열
     */
    // sendMessage: function(message) {
    //     return this.runPackage(this.devices['IR'], this.string2array(message));
    // },

    /**
     * @brief 외부 LED on/off
     *
     * @param pin 디지털 핀번호
     * @param sec 시간 (ms)
     */
    extLedOn: function(pin, sec) {
        if (typeof pin == 'string') pin = this.pins[pin];
        sec *= 1000;
        return this.runPackage(this.devices['ExLed'], pin, this.short2array(sec));
    },

    /**
     * @brief 외부 speaker 소리내기
     *
     * @param pin pwm 핀번호
     * @param freq주파수
     * @param duration시간 (ms)
     */
    playSpeaker: function(pin, freq, duration) {
        if (typeof pin == 'string') pin = this.pins[pin];
        duration *= 1000;
        return this.runPackage(
            this.devices['Speaker'],
            pin,
            this.short2array(freq),
            this.short2array(duration)
        );
    },

    /**
     * @brief 외부 speaker 끄기
     *
     * @param pin pwm 핀번호
     */
    stopSpeaker: function(pin) {
        if (typeof pin == 'string') pin = this.pins[pin];
        return this.runPackage(
            this.devices['Speaker'],
            pin,
            this.short2array(0),
            this.short2array(0)
        );
    },

    /**
     * @brief run servo motor
     *
     * @param pin pwm pins (D10, D11)
     * @param angle 0~180
     */
    runExtServo: function(pin, angle) {
        if (typeof pin == 'string') pin = this.pins[pin];
        return this.runPackage(this.devices['ServoMotor'], pin, angle);
    },

    /**
     * @brief 디지털 출력 설정
     * @date2016.05.19
     *
     * @param pin 디지털 핀번호
     * @param outputValue 출력값 (HIGH:1, LOW:0)
     */
    digitalWrite: function(pin, outputValue) {
        if (typeof outputValue == 'string') outputValue = this.outputValues[outputValue];
        return this.runPackage(this.devices['Digital'], pin, outputValue);
    },

    /**
     * @brief 아날로그 출력 설정
     * @date2016.05.19
     *
     * @param pin 아날로그 핀번호
     * @param duty듀티사이클 (0~255)
     */
    analogWrite: function(pin, duty) {
        if (typeof duty != 'number') {
            duty = 0;
        } else if (duty > 255) {
            // 듀티사이클이 255를 넘길경우 255로 설정 (100%)
            duty = 255;
        } //if

        return this.runPackage(this.devices['Analog'], pin, duty);
    },

    readFloat: function(arr, position) {
        var f = [arr[position], arr[position + 1], arr[position + 2], arr[position + 3]];
        return parseFloat(f);
    }, //function

    readShort: function(arr, position) {
        var s = [arr[position], arr[position + 1]];
        return parseFloat(s);
    }, //furnction

    readDouble: function(arr, position) {
        return this.readFloat(arr, position);
    }, //function

    readString: function(arr, position, len) {
        var value = '';
        for (var ii = 0; ii < len; ii++) {
            // value += String.fromCharCode(_rxBuf[ii + position]);
        } //for

        return value;
    }, //function

    short2array: function(value) {
        var tempBytes = {};
        for (var i = 0; i < 2; i++) {
            var tempByte = value & 0xff;
            tempBytes[i] = tempByte;
            value = (value - tempByte) / 256;
        }
        return [tempBytes[0], tempBytes[1]];
    },

    runPackage: function() {
        var bytes = [0xff, 0x55, 0, 0, 2];
        for (var i = 0; i < arguments.length; i++) {
            if (arguments[i].constructor == '[class Array]') {
                bytes = bytes.concat(arguments[i]);
            } else if (arguments[i].length == 2) {
                //coconut 용 수
                bytes = bytes.concat(arguments[i]);
            } else {
                bytes.push(arguments[i]);
            }
        } //for

        bytes[2] = bytes.length - 3; // data length

        // 장치에 ArrayBuffer data 전송
        //device.send(bytes);
        return bytes;
    },
    /* Scratch coconut Extension import */
    id : '15.1',
    name: 'coconut',
    url: 'http://coco-nut.kr',
    imageName: 'coconut.png',
    title: {
        ko: '코코넛',
        en: 'coconut',
    },
    monitorTemplate: {
        imgPath: 'hw/coconut.png',
        width: 256,
        height: 256,
        listPorts: {
            temperature: {
                name: Lang.Blocks.coconut_sensor_temperature,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            accelerationX: {
                name: Lang.Blocks.coconut_sensor_acceleration_x,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            accelerationY: {
                name: Lang.Blocks.coconut_sensor_acceleration_y,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            accelerationZ: {
                name: Lang.Blocks.coconut_sensor_acceleration_z,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
        },
        ports: {
            leftProximityValue: {
                name: Lang.Blocks.coconut_sensor_left_proximity,
                type: 'input',
                pos: { x: 122, y: 156 },
            },
            rightProximityValue: {
                name: Lang.Blocks.coconut_sensor_right_proximity,
                type: 'input',
                pos: { x: 10, y: 108 },
            },
            leftFloorValue: {
                name: Lang.Blocks.coconut_sensor_left_floor,
                type: 'input',
                pos: { x: 100, y: 234 },
            },
            rightFloorValue: {
                name: Lang.Blocks.coconut_sensor_right_floor,
                type: 'input',
                pos: { x: 13, y: 180 },
            },
            light: {
                name: Lang.Blocks.coconut_sensor_light,
                type: 'input',
                pos: { x: 56, y: 189 },
            },
        },
        mode: 'both',
    },
};
Entry.coconut.blockMenuBlocks = [
    'coconut_move_motor',
    'coconut_turn_motor',
    'coconut_stop_motor',
    'coconut_move_for_secs',
    'coconut_turn_for_secs',
    'coconut_turn_to_led',
    'coconut_move_outmotor',
    'coconut_set_led_to',
    'coconut_clear_led',
    'coconut_set_led_clear',
    'coconut_set_led_time',
    'coconut_beep',
    'coconut_buzzer_time',
    'coconut_buzzer_set_hz',
    'coconut_clear_buzzer',
    'coconut_play_buzzer',
    'coconut_rest_buzzer',
    'coconut_play_buzzer_led',
    'coconut_play_midi',
    'coconut_floor_sensor',
    'coconut_floor_sensing',
    'coconut_following_line',
    'coconut_front_sensor',
    'coconut_front_sensing',
    'coconut_obstruct_sensing',
    'coconut_avoid_mode',
    'coconut_dotmatrix_set',
    'coconut_dotmatrix_on',
    'coconut_dotmatrix_off',
    'coconut_dotmatrix_num',
    'coconut_dotmatrix_small_eng',
    'coconut_dotmatrix_big_eng',
    'coconut_dotmatrix_kor',
    'coconut_light_sensor',
    'coconut_light_tmp',
    'coconut_ac_sensor',
    'coconut_outled_sensor',
    'coconut_outspk_sensor',
    'coconut_outspk_sensor_off',
    'coconut_outinfrared_sensor',
    'coconut_outcds_sensor',
    'coconut_servomotor_angle',
];
Entry.coconut.getBlocks = function() {
    return {
        //region coconut 코코넛
        coconut_move_motor: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.coconut_move_forward, '3'],
                        [Lang.Blocks.coconut_move_backward, '4'],
                    ],
                    value: '3',
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
                params: [null],
                type: 'coconut_move_motor',
            },
            paramsKeyMap: {
                DIST: 0,
            },
            class: 'coconut_wheel',
            isNotFor: ['coconut'],

            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var pd = Entry.hw.portData;
                //앞으로 가기
                var dist = script.getField('DIST', script);
                var move = parseInt(dist);
                var arrMsg = Entry.coconut.moveMotor(move);
                //var arrMsg = ["0xff","0x55","0x05","0x00","0x01","0x07","0x00","0x01"];

                if (!script.isStart) {
                    script.isStart = true;
                    script.timeFlag = 1;
                    pd.msgStatus = 'start';
                    Entry.coconut.insertQueue(arrMsg, sq);
                    return script;
                } else if (script.timeFlag == 1) {
                    if (pd.msgStatus == 'end') {
                        console.log('rev = end');
                        script.timeFlag = 0;
                    } else if (pd.msgStatus == 'continue') {
                        console.log('rev = continue' + pd.msg);
                    } else {
                        console.log('rev = waiting');
                    }
                    Entry.coconut.clearQueue(sq);
                    return script;
                } else {
                    delete script.isStart;
                    delete script.timeFlag;
                    console.log('rev = ok');
                    return script.callReturn();
                }
            },
            syntax: { js: [], py: [] },
        },
        coconut_turn_motor: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.coconut_turn_left, '1'],
                        [Lang.Blocks.coconut_turn_right, '2'],
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
                params: [null],
                type: 'coconut_turn_motor',
            },
            paramsKeyMap: {
                DIST: 0,
            },
            class: 'coconut_wheel',
            isNotFor: ['coconut'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var pd = Entry.hw.portData;

                var dist = script.getField('DIST');
                var move = parseInt(dist);
                var arrMsg = Entry.coconut.turnMotor(move); //왼쪽, 오른쪽으로 가기
                //var arrMsg = ["0xff","0x55","0x06","0x00","0x02","0x1a","0x00","0x02","0x3c"];

                if (!script.isStart) {
                    script.isStart = true;
                    script.timeFlag = 1;
                    pd.msgStatus = 'start';
                    Entry.coconut.insertQueue(arrMsg, sq);
                    return script;
                } else if (script.timeFlag == 1) {
                    if (pd.msgStatus == 'end') {
                        console.log('rev = end');
                        script.timeFlag = 0;
                    } else if (pd.msgStatus == 'continue') {
                        console.log('rev = continue' + pd.msg);
                    } else {
                        console.log('rev = waiting');
                    }
                    Entry.coconut.clearQueue(sq);
                    return script;
                } else {
                    delete script.isStart;
                    delete script.timeFlag;
                    console.log('rev = ok');
                    return script.callReturn();
                }
            },
            syntax: { js: [], py: [] },
        },
        coconut_stop_motor: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
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
                params: [],
                type: 'coconut_stop_motor',
            },
            class: 'coconut_wheel',
            isNotFor: ['coconut'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var pd = Entry.hw.portData;

                var arrMsg = Entry.coconut.stopMotor(); //모터정지
                //var arrMsg = ["0xff","0x55","0x04","0x00","0x02","0x1a","0x01"];

                if (!script.isStart) {
                    script.isStart = true;
                    script.timeFlag = 1;
                    pd.msgStatus = 'start';
                    Entry.coconut.insertQueue(arrMsg, sq);
                    return script;
                } else if (script.timeFlag == 1) {
                    if (pd.msgStatus == 'end') {
                        console.log('rev = end');
                        script.timeFlag = 0;
                    } else if (pd.msgStatus == 'continue') {
                        console.log('rev = continue' + pd.msg);
                    } else {
                        console.log('rev = waiting');
                    }
                    Entry.coconut.clearQueue(sq);
                    return script;
                } else {
                    delete script.isStart;
                    delete script.timeFlag;
                    console.log('rev = ok');
                    return script.callReturn();
                }
            },
            syntax: { js: [], py: ['coconut.turn_for_secs(%1, %2)'] },
        },
        coconut_move_for_secs: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.coconut_move_forward, '3'],
                        [Lang.Blocks.coconut_move_backward, '4'],
                    ],
                    value: '3',
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
                ],
                type: 'coconut_move_for_secs',
            },
            paramsKeyMap: {
                DIST: 0,
                VALUE: 1,
            },
            class: 'coconut_wheel',
            isNotFor: ['coconut'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var pd = Entry.hw.portData;

                var dist = script.getField('DIST', script);
                var move = parseInt(dist);
                var time = script.getNumberValue('VALUE');
                var arrMsg = Entry.coconut.moveGoTime(move, time); //앞으로 1초동안 움직이기
                //var arrMsg = ["0xff","0x55","0x08","0x00","0x02","0x1a","0x03","0x03","0x3c","0xe8","0x03"];

                var now = Date();
                if (!script.isStart) {
                    script.isStart = true;
                    script.timeFlag = 1;
                    pd.msgStatus = 'start';
                    Entry.coconut.insertQueue(arrMsg, sq);
                    return script;
                } else if (script.timeFlag == 1) {
                    if (pd.msgStatus == 'end') {
                        console.log(now + ' : rev = end');
                        script.timeFlag = 0;
                    } else if (pd.msgStatus == 'continue') {
                        console.log(now + ' : rev = continue' + pd.msg);
                    } else {
                        console.log(now + ' : rev = waiting');
                    }
                    Entry.coconut.clearQueue(sq);
                    return script;
                } else {
                    delete script.isStart;
                    delete script.timeFlag;
                    console.log(now + ' : rev = ok');
                    return script.callReturn();
                }
            },
            syntax: { js: [], py: ['coconut.turn_for_secs(%1, %2)'] },
        },
        coconut_turn_for_secs: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.coconut_turn_left, '1'],
                        [Lang.Blocks.coconut_turn_right, '2'],
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
                ],
                type: 'coconut_turn_for_secs',
            },
            paramsKeyMap: {
                DIST: 0,
                VALUE: 1,
            },
            class: 'coconut_wheel',
            isNotFor: ['coconut'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var pd = Entry.hw.portData;

                var dist = script.getField('DIST', script);
                var move = parseInt(dist);
                var time = script.getNumberValue('VALUE');
                var arrMsg = Entry.coconut.moveGoTime(move, time); //왼쪽으로 1초동안 돌기
                //var arrMsg = ["0xff","0x55","0x08","0x00","0x02","0x1a","0x03","0x01","0x3c","0xe8","0x03"];

                if (!script.isStart) {
                    script.isStart = true;
                    script.timeFlag = 1;
                    pd.msgStatus = 'start';
                    Entry.coconut.insertQueue(arrMsg, sq);
                    return script;
                } else if (script.timeFlag == 1) {
                    if (pd.msgStatus == 'end') {
                        console.log('rev = end');
                        script.timeFlag = 0;
                    } else if (pd.msgStatus == 'continue') {
                        console.log('rev = continue' + pd.msg);
                    } else {
                        console.log('rev = waiting');
                    }
                    Entry.coconut.clearQueue(sq);
                    return script;
                } else {
                    delete script.isStart;
                    delete script.timeFlag;
                    console.log('rev = ok');
                    return script.callReturn();
                }
            },
            syntax: { js: [], py: [] },
        },
        coconut_turn_to_led: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.coconut_turn_left, '1'],
                        [Lang.Blocks.coconut_turn_right, '2'],
                    ],
                    value: '1',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.coconut_color_red, '2'],
                        [Lang.Blocks.coconut_color_yellow, '5'],
                        [Lang.Blocks.coconut_color_green, '3'],
                        [Lang.Blocks.coconut_color_cyan, '6'],
                        [Lang.Blocks.coconut_color_blue, '4'],
                        [Lang.Blocks.coconut_color_magenta, '7'],
                        [Lang.Blocks.coconut_color_white, '1'],
                    ],
                    value: '2',
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
                type: 'coconut_turn_to_led',
            },
            paramsKeyMap: {
                DIST: 0,
                COLOR: 1,
            },
            class: 'coconut_wheel',
            isNotFor: ['coconut'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var pd = Entry.hw.portData;

                var dist1 = script.getField('DIST', script);
                var dist2 = script.getField('COLOR', script);
                var move = parseInt(dist1);
                var color = parseInt(dist2);
                var arrMsg = Entry.coconut.moveMotorColor(move, color); //왼쪽으로 회전하는 동안 빨간색 LED켜기

                if (!script.isStart) {
                    script.isStart = true;
                    script.timeFlag = 1;
                    pd.msgStatus = 'start';
                    Entry.coconut.insertQueue(arrMsg, sq);
                    return script;
                } else if (script.timeFlag == 1) {
                    if (pd.msgStatus == 'end') {
                        console.log('rev = end');
                        script.timeFlag = 0;
                    } else if (pd.msgStatus == 'continue') {
                        console.log('rev = continue' + pd.msg);
                    } else {
                        console.log('rev = waiting');
                    }
                    Entry.coconut.clearQueue(sq);
                    return script;
                } else {
                    delete script.isStart;
                    delete script.timeFlag;
                    console.log('rev = ok');
                    return script.callReturn();
                }
            },
            syntax: { js: [], py: ['coconut.turn_for_secs(%1, %2)'] },
        },
        coconut_move_outmotor: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.coconut_move_forward, '3'],
                        [Lang.Blocks.coconut_move_backward, '4'],
                        [Lang.Blocks.coconut_turn_left, '1'],
                        [Lang.Blocks.coconut_turn_right, '2'],
                    ],
                    value: '3',
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
                        params: ['60'],
                    },
                ],
                type: 'coconut_move_outmotor',
            },
            paramsKeyMap: {
                DIST: 0,
                VALUE: 1,
            },
            class: 'coconut_wheel',
            isNotFor: ['coconut'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var pd = Entry.hw.portData;

                var dist1 = script.getField('DIST', script);
                var move = parseInt(dist1);
                var speed = script.getNumberValue('VALUE');
                var arrMsg = Entry.coconut.moveExtMotor(move, speed); //외부모터 앞으로 움직이기
                //var arrMsg = ["0xff","0x55","0x06","0x00","0x02","0x1a","0x07","0x03","0x3c"];

                if (!script.isStart) {
                    script.isStart = true;
                    script.timeFlag = 1;
                    pd.msgStatus = 'start';
                    Entry.coconut.insertQueue(arrMsg, sq);
                    return script;
                } else if (script.timeFlag == 1) {
                    if (pd.msgStatus == 'end') {
                        console.log('rev = end');
                        script.timeFlag = 0;
                    } else if (pd.msgStatus == 'continue') {
                        console.log('rev = continue' + pd.msg);
                    } else {
                        console.log('rev = waiting');
                    }
                    Entry.coconut.clearQueue(sq);
                    return script;
                } else {
                    delete script.isStart;
                    delete script.timeFlag;
                    console.log('rev = ok');
                    return script.callReturn();
                }
            },
            syntax: { js: [], py: ['coconut.turn_for_secs(%1, %2)'] },
        },
        coconut_set_led_to: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.coconut_left_led, '1'],
                        [Lang.Blocks.coconut_right_led, '2'],
                        [Lang.Blocks.coconut_both_leds, '0'],
                    ],
                    value: '1',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.coconut_color_red, '2'],
                        [Lang.Blocks.coconut_color_yellow, '5'],
                        [Lang.Blocks.coconut_color_green, '3'],
                        [Lang.Blocks.coconut_color_cyan, '6'],
                        [Lang.Blocks.coconut_color_blue, '4'],
                        [Lang.Blocks.coconut_color_magenta, '7'],
                        [Lang.Blocks.coconut_color_white, '1'],
                    ],
                    value: '2',
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
                type: 'coconut_set_led_to',
            },
            paramsKeyMap: {
                DIST: 0,
                COLOR: 1,
            },
            class: 'coconut_led',
            isNotFor: ['coconut'],

            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var pd = Entry.hw.portData;
                var now = new Date();
                var dist1 = script.getField('DIST', script);
                var dist2 = script.getField('COLOR', script);
                var dir = parseInt(dist1);
                var color = parseInt(dist2);
                var arrMsg = Entry.coconut.rgbOn(dir, color); //왼쪽 LED 빨간색으로 켜기
                //var arrMsg = ["0xff","0x55","0x06","0x00","0x02","0x19","0x00","0x01","0x02"];

                if (!script.isStart) {
                    script.isStart = true;
                    script.timeFlag = 1;
                    pd.msgStatus = 'start';
                    Entry.coconut.insertQueue(arrMsg, sq);
                    return script;
                } else if (script.timeFlag == 1) {
                    if (pd.msgStatus == 'end') {
                        console.log(now + ' : rev = end');
                        script.timeFlag = 0;
                    } else if (pd.msgStatus == 'continue') {
                        console.log(now + ' : rev = continue' + pd.msg);
                    } else {
                        console.log(now + ' : rev = waiting');
                    }
                    Entry.coconut.clearQueue(sq);
                    return script;
                } else {
                    delete script.isStart;
                    delete script.timeFlag;
                    console.log('rev = ok');
                    return script.callReturn();
                }
            },

            syntax: { js: [], py: ['coconut.turn_for_secs(%1, %2)'] },
        },
        coconut_clear_led: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.coconut_left_led, '1'],
                        [Lang.Blocks.coconut_right_led, '2'],
                        [Lang.Blocks.coconut_both_leds, '0'],
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
                params: [null],
                type: 'coconut_clear_led',
            },
            paramsKeyMap: {
                DIST: 0,
            },
            class: 'coconut_led',
            isNotFor: ['coconut'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var pd = Entry.hw.portData;

                var dist1 = script.getField('DIST', script);
                var dir = parseInt(dist1);
                var arrMsg = Entry.coconut.rgbOff(dir); //왼쪽LED 끄기
                //var arrMsg = ["0xff","0x55","0x06","0x00","0x02","0x19","0x01","0x01","0x00"];

                if (!script.isStart) {
                    script.isStart = true;
                    script.timeFlag = 1;
                    pd.msgStatus = 'start';
                    Entry.coconut.insertQueue(arrMsg, sq);
                    return script;
                } else if (script.timeFlag == 1) {
                    if (pd.msgStatus == 'end') {
                        console.log('rev = end');
                        script.timeFlag = 0;
                    } else if (pd.msgStatus == 'continue') {
                        console.log('rev = continue' + pd.msg);
                    } else {
                        console.log('rev = waiting');
                    }
                    Entry.coconut.clearQueue(sq);
                    return script;
                } else {
                    delete script.isStart;
                    delete script.timeFlag;
                    console.log('rev = ok');
                    return script.callReturn();
                }
            },
        },
        coconut_set_led_clear: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.coconut_left_led, '1'],
                        [Lang.Blocks.coconut_right_led, '2'],
                        [Lang.Blocks.coconut_both_leds, '0'],
                    ],
                    value: '1',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.coconut_color_red, '2'],
                        [Lang.Blocks.coconut_color_yellow, '5'],
                        [Lang.Blocks.coconut_color_green, '3'],
                        [Lang.Blocks.coconut_color_cyan, '6'],
                        [Lang.Blocks.coconut_color_blue, '4'],
                        [Lang.Blocks.coconut_color_magenta, '7'],
                        [Lang.Blocks.coconut_color_white, '1'],
                    ],
                    value: '2',
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
                type: 'coconut_set_led_clear',
            },
            paramsKeyMap: {
                DIST: 0,
                COLOR: 1,
            },
            class: 'coconut_led',
            isNotFor: ['coconut'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var pd = Entry.hw.portData;

                var dist1 = script.getField('DIST', script);
                var dist2 = script.getField('COLOR', script);
                var dir = parseInt(dist1);
                var color = parseInt(dist2);
                var arrMsg = Entry.coconut.rgbOffColor(dir, color); //왼쪽 LED 빨간색 끄기
                //var arrMsg = ["0xff","0x55","0x06","0x00","0x02","0x19","0x01","0x01","0x02"];

                if (!script.isStart) {
                    script.isStart = true;
                    script.timeFlag = 1;
                    pd.msgStatus = 'start';
                    Entry.coconut.insertQueue(arrMsg, sq);
                    return script;
                } else if (script.timeFlag == 1) {
                    if (pd.msgStatus == 'end') {
                        console.log('rev = end');
                        script.timeFlag = 0;
                    } else if (pd.msgStatus == 'continue') {
                        console.log('rev = continue' + pd.msg);
                    } else {
                        console.log('rev = waiting');
                    }
                    Entry.coconut.clearQueue(sq);
                    return script;
                } else {
                    delete script.isStart;
                    delete script.timeFlag;
                    console.log('rev = ok');
                    return script.callReturn();
                }
            },
            syntax: { js: [], py: ['coconut.turn_for_secs(%1, %2)'] },
        },
        coconut_set_led_time: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.coconut_left_led, 'Left'],
                        [Lang.Blocks.coconut_right_led, 'Right'],
                        [Lang.Blocks.coconut_both_leds, 'Both'],
                    ],
                    value: 'Left',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.coconut_color_red, '2'],
                        [Lang.Blocks.coconut_color_yellow, '5'],
                        [Lang.Blocks.coconut_color_green, '3'],
                        [Lang.Blocks.coconut_color_cyan, '6'],
                        [Lang.Blocks.coconut_color_blue, '4'],
                        [Lang.Blocks.coconut_color_magenta, '7'],
                        [Lang.Blocks.coconut_color_white, '1'],
                    ],
                    value: '2',
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
                    null,
                    {
                        type: 'text',
                        params: ['0.6'],
                    },
                ],
                type: 'coconut_set_led_time',
            },
            paramsKeyMap: {
                DIST: 0,
                COLOR: 1,
                VALUE: 2,
            },
            class: 'coconut_led',
            isNotFor: ['coconut'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var pd = Entry.hw.portData;

                var dist1 = script.getField('DIST', script);
                var dist2 = script.getField('COLOR', script);
                var time = script.getNumberValue('VALUE');
                var color = parseInt(dist2);
                var arrMsg = Entry.coconut.ledOnTime(dist1, color, time); //왼쪽 LED 빨간색으로 1초동안 켜기
                //var arrMsg = ["0xff","0x55","0x08","0x00","0x02","0x19","0x03","0x01","0x02","0xe8","0x03"];

                if (!script.isStart) {
                    script.isStart = true;
                    script.timeFlag = 1;
                    pd.msgStatus = 'start';
                    Entry.coconut.insertQueue(arrMsg, sq);
                    return script;
                } else if (script.timeFlag == 1) {
                    if (pd.msgStatus == 'end') {
                        console.log('rev = end');
                        script.timeFlag = 0;
                    } else if (pd.msgStatus == 'continue') {
                        console.log('rev = continue' + pd.msg);
                    } else {
                        console.log('rev = waiting');
                    }
                    Entry.coconut.clearQueue(sq);
                    return script;
                } else {
                    delete script.isStart;
                    delete script.timeFlag;
                    console.log('rev = ok');
                    return script.callReturn();
                }
            },
            syntax: { js: [], py: ['coconut.turn_for_secs(%1, %2)'] },
        },
        coconut_beep: {
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
                params: [],
                type: 'coconut_beep',
            },
            class: 'coconut_buzzer',
            isNotFor: ['coconut'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var pd = Entry.hw.portData;

                var arrMsg = Entry.coconut.beep(); //버저 켜기
                //var arrMsg = ["0xff","0x55","0x08","0x00","0x02","0x03","0x00","0x06","0x01","0xf4","0x01"];

                if (!script.isStart) {
                    script.isStart = true;
                    script.timeFlag = 1;
                    pd.msgStatus = 'start';
                    Entry.coconut.insertQueue(arrMsg, sq);
                    return script;
                } else if (script.timeFlag == 1) {
                    if (pd.msgStatus == 'end') {
                        console.log('rev = end');
                        script.timeFlag = 0;
                    } else if (pd.msgStatus == 'continue') {
                        console.log('rev = continue' + pd.msg);
                    } else {
                        console.log('rev = waiting');
                    }
                    Entry.coconut.clearQueue(sq);
                    return script;
                } else {
                    delete script.isStart;
                    delete script.timeFlag;
                    console.log('rev = ok');
                    return script.callReturn();
                }
            },
            syntax: { js: [], py: ['coconut.turn_for_secs(%1, %2)'] },
        },
        coconut_buzzer_time: {
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
                        params: ['0.6'],
                    },
                ],
                type: 'coconut_buzzer_time',
            },
            paramsKeyMap: {
                VALUE: 0,
            },
            class: 'coconut_buzzer',
            isNotFor: ['coconut'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var pd = Entry.hw.portData;

                var time = script.getNumberValue('VALUE');
                var arrMsg = Entry.coconut.playBuzzerTime(time); //버저음을 1초동안 소리내기
                //var arrMsg = ["0xff","0x55","0x08","0x00","0x02","0x03","0x00","0x06","0x01","0xe8","0x03"];

                if (!script.isStart) {
                    script.isStart = true;
                    script.timeFlag = 1;
                    pd.msgStatus = 'start';
                    Entry.coconut.insertQueue(arrMsg, sq);
                    return script;
                } else if (script.timeFlag == 1) {
                    if (pd.msgStatus == 'end') {
                        console.log('rev = end');
                        script.timeFlag = 0;
                    } else if (pd.msgStatus == 'continue') {
                        console.log('rev = continue' + pd.msg);
                    } else {
                        console.log('rev = waiting');
                    }
                    Entry.coconut.clearQueue(sq);
                    return script;
                } else {
                    delete script.isStart;
                    delete script.timeFlag;
                    console.log('rev = ok');
                    return script.callReturn();
                }
            },
            syntax: { js: [], py: ['coconut.turn_for_secs(%1, %2)'] },
        },
        coconut_buzzer_set_hz: {
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
                    acce기t: 'string',
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
                        params: ['300'],
                    },
                    {
                        type: 'text',
                        params: ['0.6'],
                    },
                ],
                type: 'coconut_buzzer_set_hz',
            },
            paramsKeyMap: {
                HZ: 0,
                TIME: 1,
            },
            class: 'coconut_buzzer',
            isNotFor: ['coconut'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var pd = Entry.hw.portData;

                var hz = script.getNumberValue('HZ');
                var time = script.getNumberValue('TIME');
                var arrMsg = Entry.coconut.playBuzzerFreq(hz, time); //버저음 1000hz를 1초동안 소리내기
                //var arrMsg = ["0xff","0x55","0x08","0x00","0x02","0x03","0x00","0x2c","0x01","0xe8","0x03"];

                if (!script.isStart) {
                    script.isStart = true;
                    script.timeFlag = 1;
                    pd.msgStatus = 'start';
                    Entry.coconut.insertQueue(arrMsg, sq);
                    return script;
                } else if (script.timeFlag == 1) {
                    if (pd.msgStatus == 'end') {
                        console.log('rev = end');
                        script.timeFlag = 0;
                    } else if (pd.msgStatus == 'continue') {
                        console.log('rev = continue' + pd.msg);
                    } else {
                        console.log('rev = waiting');
                    }
                    Entry.coconut.clearQueue(sq);
                    return script;
                } else {
                    delete script.isStart;
                    delete script.timeFlag;
                    console.log('rev = ok');
                    return script.callReturn();
                }
            },
            syntax: { js: [], py: ['coconut.turn_for_secs(%1, %2)'] },
        },
        coconut_clear_buzzer: {
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
                params: [],
                type: 'coconut_clear_buzzer',
            },
            class: 'coconut_buzzer',
            isNotFor: ['coconut'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var pd = Entry.hw.portData;

                var arrMsg = Entry.coconut.buzzerOff(); //버저 끄기
                //var arrMsg = ["0xff","0x55","0x08","0x00","0x02","0x03","0x00","0x00","0x00","0x00","0x00"];

                if (!script.isStart) {
                    script.isStart = true;
                    script.timeFlag = 1;
                    pd.msgStatus = 'start';
                    Entry.coconut.insertQueue(arrMsg, sq);
                    return script;
                } else if (script.timeFlag == 1) {
                    if (pd.msgStatus == 'end') {
                        console.log('rev = end');
                        script.timeFlag = 0;
                    } else if (pd.msgStatus == 'continue') {
                        console.log('rev = continue' + pd.msg);
                    } else {
                        console.log('rev = waiting');
                    }
                    Entry.coconut.clearQueue(sq);
                    return script;
                } else {
                    delete script.isStart;
                    delete script.timeFlag;
                    console.log('rev = ok');
                    return script.callReturn();
                }
            },
            syntax: { js: [], py: ['coconut.turn_for_secs(%1, %2)'] },
        },
        coconut_play_buzzer: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.coconut_note_c, 'NOTE_C'],
                        [Lang.Blocks.coconut_note_d, 'NOTE_D'],
                        [Lang.Blocks.coconut_note_e, 'NOTE_E'],
                        [Lang.Blocks.coconut_note_f, 'NOTE_F'],
                        [Lang.Blocks.coconut_note_g, 'NOTE_G'],
                        [Lang.Blocks.coconut_note_a, 'NOTE_A'],
                        [Lang.Blocks.coconut_note_b, 'NOTE_B'],
                    ],
                    value: 'NOTE_C',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [['3', '3'], ['4', '4'], ['5', '5'], ['6', '6']],
                    value: '4',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [['-', '-'], ['#', '#'], ['b', 'b']],
                    value: '0',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.coconut_play_buzzer_hn, '500'],
                        [Lang.Blocks.coconut_play_buzzer_qn, '250'],
                        [Lang.Blocks.coconut_play_buzzer_en, '125'],
                        [Lang.Blocks.coconut_play_buzzer_sn, '63'],
                        [Lang.Blocks.coconut_play_buzzer_tn, '32'],
                        [Lang.Blocks.coconut_play_buzzer_wn, '1000'],
                        [Lang.Blocks.coconut_play_buzzer_dhn, '750'],
                        [Lang.Blocks.coconut_play_buzzer_dqn, '375'],
                        [Lang.Blocks.coconut_play_buzzer_den, '188'],
                        [Lang.Blocks.coconut_play_buzzer_dsn, '95'],
                        [Lang.Blocks.coconut_play_buzzer_dtn, '48'],
                    ],
                    value: '500',
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
                params: [null, '4', '-', null],
                type: 'coconut_play_buzzer',
            },
            paramsKeyMap: {
                NOTE: 0,
                OCTAVE: 1,
                SEMI: 2,
                BEAT: 3,
            },
            class: 'coconut_buzzer',
            isNotFor: ['coconut'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var pd = Entry.hw.portData;

                var dist1 = script.getField('NOTE', script);
                var dist2 = script.getField('OCTAVE', script);
                var dist3 = script.getField('SEMI', script);
                var dist4 = script.getField('BEAT', script);
                var note = dist1;
                var octave = parseInt(dist2);
                var semi = dist3;
                var beat = parseInt(dist4);
                var arrMsg = Entry.coconut.playNote(note, octave, semi, beat); //(도)(3)(-)음을 2분음표 박자로 연주하기
                //var arrMsg = ["0xff","0x55","0x09","0x00","0x02","0x03","0x04","0x43","0x03","0x2d","0xf4","0x01"];

                if (!script.isStart) {
                    script.isStart = true;
                    script.timeFlag = 1;
                    pd.msgStatus = 'start';
                    Entry.coconut.insertQueue(arrMsg, sq);
                    return script;
                } else if (script.timeFlag == 1) {
                    if (pd.msgStatus == 'end') {
                        console.log('rev = end');
                        script.timeFlag = 0;
                    } else if (pd.msgStatus == 'continue') {
                        console.log('rev = continue' + pd.msg);
                    } else {
                        console.log('rev = waiting');
                    }
                    Entry.coconut.clearQueue(sq);
                    return script;
                } else {
                    delete script.isStart;
                    delete script.timeFlag;
                    console.log('rev = ok');
                    return script.callReturn();
                }
            },
            syntax: { js: [], py: ['coconut.turn_for_secs(%1, %2)'] },
        },
        coconut_rest_buzzer: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.coconut_rest_buzzer_hr, '500'],
                        [Lang.Blocks.coconut_rest_buzzer_qr, '250'],
                        [Lang.Blocks.coconut_rest_buzzer_er, '175'],
                        [Lang.Blocks.coconut_rest_buzzer_sr, '63'],
                        [Lang.Blocks.coconut_rest_buzzer_tr, '32'],
                        [Lang.Blocks.coconut_rest_buzzer_wr, '1000'],
                    ],
                    value: '500',
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
                params: [null],
                type: 'coconut_rest_buzzer',
            },
            paramsKeyMap: {
                BEAT: 0,
            },
            class: 'coconut_buzzer',
            isNotFor: ['coconut'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var pd = Entry.hw.portData;

                var dist = script.getField('BEAT', script);
                var beat = parseInt(dist);
                var arrMsg = Entry.coconut.restBeat(dist); //2분 쉼표 동안 쉬기
                //var arrMsg = ["0xff","0x55","0x08","0x00","0x02","0x03","0x01","0x00","0x00","0xf4","0x01"];

                if (!script.isStart) {
                    script.isStart = true;
                    script.timeFlag = 1;
                    pd.msgStatus = 'start';
                    Entry.coconut.insertQueue(arrMsg, sq);
                    return script;
                } else if (script.timeFlag == 1) {
                    if (pd.msgStatus == 'end') {
                        console.log('rev = end');
                        script.timeFlag = 0;
                    } else if (pd.msgStatus == 'continue') {
                        console.log('rev = continue' + pd.msg);
                    } else {
                        console.log('rev = waiting');
                    }
                    Entry.coconut.clearQueue(sq);
                    return script;
                } else {
                    delete script.isStart;
                    delete script.timeFlag;
                    console.log('rev = ok');
                    return script.callReturn();
                }
            },
            syntax: { js: [], py: ['coconut.turn_for_secs(%1, %2)'] },
        },
        coconut_play_buzzer_led: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.ALBERT_note_c, 'NOTE_C'],
                        [Lang.Blocks.ALBERT_note_d, 'NOTE_D'],
                        [Lang.Blocks.ALBERT_note_e, 'NOTE_E'],
                        [Lang.Blocks.ALBERT_note_f, 'NOTE_F'],
                        [Lang.Blocks.ALBERT_note_g, 'NOTE_G'],
                        [Lang.Blocks.ALBERT_note_a, 'NOTE_A'],
                        [Lang.Blocks.ALBERT_note_b, 'NOTE_B'],
                    ],
                    value: 'NOTE_C',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [['3', '3'], ['4', '4'], ['5', '5'], ['6', '6']],
                    value: '4',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [['-', '-'], ['#', '#'], ['b', 'b']],
                    value: '0',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.coconut_play_buzzer_hn, '500'],
                        [Lang.Blocks.coconut_play_buzzer_qn, '250'],
                        [Lang.Blocks.coconut_play_buzzer_en, '125'],
                        [Lang.Blocks.coconut_play_buzzer_sn, '63'],
                        [Lang.Blocks.coconut_play_buzzer_tn, '32'],
                        [Lang.Blocks.coconut_play_buzzer_wn, '1000'],
                        [Lang.Blocks.coconut_play_buzzer_dhn, '750'],
                        [Lang.Blocks.coconut_play_buzzer_dqn, '375'],
                        [Lang.Blocks.coconut_play_buzzer_den, '188'],
                        [Lang.Blocks.coconut_play_buzzer_dsn, '95'],
                        [Lang.Blocks.coconut_play_buzzer_dtn, '48'],
                    ],
                    value: '500',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.coconut_left_led, '1'],
                        [Lang.Blocks.coconut_right_led, '2'],
                        [Lang.Blocks.coconut_both_leds, '0'],
                    ],
                    value: '1',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.coconut_color_red, '2'],
                        [Lang.Blocks.coconut_color_yellow, '5'],
                        [Lang.Blocks.coconut_color_green, '3'],
                        [Lang.Blocks.coconut_color_cyan, '6'],
                        [Lang.Blocks.coconut_color_blue, '4'],
                        [Lang.Blocks.coconut_color_magenta, '7'],
                        [Lang.Blocks.coconut_color_white, '1'],
                    ],
                    value: '2',
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
                params: [null, '4', '-', null, null, null],
                type: 'coconut_play_buzzer_led',
            },
            paramsKeyMap: {
                NOTE: 0,
                OCTAVE: 1,
                SEMI: 2,
                BEAT: 3,
                DIR: 4,
                COLOR: 5,
            },
            class: 'coconut_buzzer',
            isNotFor: ['coconut'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var pd = Entry.hw.portData;

                var dist1 = script.getField('NOTE', script);
                var dist2 = script.getField('OCTAVE', script);
                var dist3 = script.getField('SEMI', script);
                var dist4 = script.getField('BEAT', script);
                var dist5 = script.getField('DIR', script);
                var dist6 = script.getField('COLOR', script);
                var note = dist1;
                var octave = parseInt(dist2);
                var semi = dist3;
                var beat = parseInt(dist4);
                var dir = parseInt(dist5);
                var color = parseInt(dist6);
                var arrMsg = Entry.coconut.playNoteColor(note, octave, semi, beat, dir, color);
                //도 4 - 음을 2분음표 박자로 연주하는 동안 왼쪽 LED 빨간색 켜기
                //var arrMsg = ["0xff","0x55","0x0b","0x00","0x02","0x03","0x05","0x43","0x04","0x2d","0xf4","0x01","0x01","0x02"];

                if (!script.isStart) {
                    script.isStart = true;
                    script.timeFlag = 1;
                    pd.msgStatus = 'start';
                    Entry.coconut.insertQueue(arrMsg, sq);
                    return script;
                } else if (script.timeFlag == 1) {
                    if (pd.msgStatus == 'end') {
                        console.log('rev = end');
                        script.timeFlag = 0;
                    } else if (pd.msgStatus == 'continue') {
                        console.log('rev = continue' + pd.msg);
                    } else {
                        console.log('rev = waiting');
                    }
                    Entry.coconut.clearQueue(sq);
                    return script;
                } else {
                    delete script.isStart;
                    delete script.timeFlag;
                    console.log('rev = ok');
                    return script.callReturn();
                }
            },
            syntax: { js: [], py: ['coconut.turn_for_secs(%1, %2)'] },
        },
        coconut_play_midi: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.coconut_play_midi_1, '1'],
                        [Lang.Blocks.coconut_play_midi_2, '2'],
                        [Lang.Blocks.coconut_play_midi_3, '3'],
                        [Lang.Blocks.coconut_play_midi_4, '4'],
                        [Lang.Blocks.coconut_play_midi_5, '5'],
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
                params: [null],
                type: 'coconut_play_midi',
            },
            paramsKeyMap: {
                VALUE: 0,
            },
            class: 'coconut_buzzer',
            isNotFor: ['coconut'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var pd = Entry.hw.portData;
                //반짝반짝 작은별 연주하기
                var value = script.getField('VALUE');
                var num = parseInt(value);
                var arrMsg = Entry.coconut.playMelody(num);
                //var arrMsg = ["0xff","0x55","0x05","0x00","0x01","0x07","0x00","0x01"];

                if (!script.isStart) {
                    script.isStart = true;
                    script.timeFlag = 1;
                    pd.msgStatus = 'start';
                    Entry.coconut.insertQueue(arrMsg, sq);
                    return script;
                } else if (script.timeFlag == 1) {
                    if (pd.msgStatus == 'end') {
                        console.log('rev = end');
                        script.timeFlag = 0;
                    } else if (pd.msgStatus == 'continue') {
                        console.log('rev = continue' + pd.msg);
                    } else {
                        console.log('rev = waiting');
                    }
                    Entry.coconut.clearQueue(sq);
                    return script;
                } else {
                    delete script.isStart;
                    delete script.timeFlag;
                    sq.msgValue = '';
                    console.log('rev = ok');
                    return script.callReturn();
                }
            },
            syntax: { js: [], py: ['coconut.turn_for_secs(%1, %2)'] },
        },
        coconut_floor_sensor: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.coconut_sensor_left_floor, '1'],
                        [Lang.Blocks.coconut_sensor_right_floor, '2'],
                    ],
                    value: '1',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'coconut_floor_sensor',
            },
            paramsKeyMap: {
                DIR: 0,
            },
            class: 'coconut_sensor',
            isNotFor: ['coconut'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var pd = Entry.hw.portData;
                var dir = script.getField('DIR');
                if (dir == '1') {
                    return pd.leftFloorValue;
                } else {
                    return pd.rightFloorValue;
                }
            },
            syntax: { js: [], py: ['coconut.turn_for_secs(%1, %2)'] },
        },
        coconut_floor_sensing: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.coconut_sensor_left_floor, '1'],
                        [Lang.Blocks.coconut_sensor_right_floor, '2'],
                        [Lang.Blocks.coconut_sensor_both_floor, '0'],
                    ],
                    value: '1',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.coconut_floor_sensing_on, '1'],
                        [Lang.Blocks.coconut_floor_sensing_off, '0'],
                    ],
                    value: '1',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [null, null],
                type: 'coconut_floor_sensing',
            },
            paramsKeyMap: {
                DIR: 0,
                DET: 1,
            },
            class: 'coconut_sensor',
            isNotFor: ['coconut'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var pd = Entry.hw.portData;
                var dir = script.getField('DIR');
                var det = script.getField('DET');
                if (dir == '0') {
                    if (det == '1') {
                        if (pd.BothFloorDetection == 3)
                            //모든 바닥센서가 감지됐나
                            return true;
                        else return false;
                    } else {
                        if (pd.BothFloorDetection == 0)
                            //모든 바닥센서가 미감지됐나
                            return true;
                        else return false;
                    }
                } else if (dir == '1') {
                    if (det == '1') {
                        if (pd.BothFloorDetection == 2)
                            // 왼쪽 바닥센서가 감지
                            return true;
                        else return false;
                    } else {
                        if (pd.BothFloorDetection == 0)
                            // 왼쪽 바닥센서가 감지
                            return true;
                        else return false;
                    }
                } else if (dir == '2') {
                    if (det == '1') {
                        if (pd.BothFloorDetection == 1)
                            // 오른쪽 바닥센서가 감지
                            return true;
                        else return false;
                    } else {
                        if (pd.BothFloorDetection == 0)
                            // 오른쪽 바닥센서가 감지
                            return true;
                        else return false;
                    }
                }
            },
            syntax: { js: [], py: ['coconut.turn_for_secs(%1, %2)'] },
        },
        coconut_following_line: {
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
                params: [],
                type: 'coconut_following_line',
            },
            paramsKeyMap: {},
            class: 'coconut_wheel',
            isNotFor: ['coconut'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var pd = Entry.hw.portData;
                //선 따라가기

                var arrMsg = Entry.coconut.followLine();
                //var arrMsg = ["0xff","0x55","0x05","0x00","0x02","0x07","0x03","0x3c"];

                if (!script.isStart) {
                    script.isStart = true;
                    script.timeFlag = 1;
                    pd.msgStatus = 'start';
                    Entry.coconut.insertQueue(arrMsg, sq);
                    return script;
                } else if (script.timeFlag == 1) {
                    if (pd.msgStatus == 'end') {
                        console.log('rev = end');
                        script.timeFlag = 0;
                    } else if (pd.msgStatus == 'continue') {
                        console.log('rev = continue' + pd.msg);
                    } else {
                        console.log('rev = waiting');
                    }
                    Entry.coconut.clearQueue(sq);
                    return script;
                } else {
                    delete script.isStart;
                    delete script.timeFlag;
                    console.log('rev = ok');
                    return script.callReturn();
                }
            },
            syntax: { js: [], py: ['coconut.turn_for_secs(%1, %2)'] },
        },
        coconut_front_sensor: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.coconut_sensor_left_proximity, '1'],
                        [Lang.Blocks.coconut_sensor_right_proximity, '2'],
                    ],
                    value: '1',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'coconut_front_sensor',
            },
            paramsKeyMap: {
                DIR: 0,
            },
            class: 'coconut_sensor',
            isNotFor: ['coconut'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var pd = Entry.hw.portData;
                var dir = script.getField('DIR');
                if (dir == '1') {
                    return pd.leftProximityValue;
                } else {
                    return pd.rightProximityValue;
                }
            },
            syntax: { js: [], py: ['coconut.turn_for_secs(%1, %2)'] },
        },
        coconut_front_sensing: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.coconut_sensor_left_proximity, '1'],
                        [Lang.Blocks.coconut_sensor_right_proximity, '2'],
                        [Lang.Blocks.coconut_sensor_both_proximity, '0'],
                    ],
                    value: '1',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.coconut_floor_sensing_on, '1'],
                        [Lang.Blocks.coconut_floor_sensing_off, '0'],
                    ],
                    value: '1',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [null, null],
                type: 'coconut_front_sensing',
            },
            paramsKeyMap: {
                DIR: 0,
                DET: 1,
            },
            class: 'coconut_sensor',
            isNotFor: ['coconut'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var pd = Entry.hw.portData;
                var dir = script.getField('DIR');
                var det = script.getField('DET');
                if (dir == '0') {
                    if (det == '1') {
                        if (pd.BothProximityDetection == 3)
                            //모든 바닥센서가 감지됐나
                            return true;
                        else return false;
                    } else {
                        if (pd.BothProximityDetection == 0)
                            //모든 바닥센서가 미감지됐나
                            return true;
                        else return false;
                    }
                } else if (dir == '1') {
                    if (det == '1') {
                        if (pd.BothProximityDetection == 2 || pd.BothProximityDetection == 3)
                            // 왼쪽 바닥센서가 감지
                            return true;
                        else return false;
                    } else {
                        if (pd.BothProximityDetection == 0 || pd.BothProximityDetection == 1)
                            // 왼쪽 바닥센서가 감지
                            return true;
                        else return false;
                    }
                } else if (dir == '2') {
                    if (det == '1') {
                        if (pd.BothProximityDetection == 1 || pd.BothProximityDetection == 3)
                            // 오른쪽 바닥센서가 감지
                            return true;
                        else return false;
                    } else {
                        if (pd.BothProximityDetection == 0 || pd.BothProximityDetection == 2)
                            // 오른쪽 바닥센서가 감지
                            return true;
                        else return false;
                    }
                }
            },
            syntax: { js: [], py: ['coconut.turn_for_secs(%1, %2)'] },
        },
        coconut_obstruct_sensing: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
            statements: [],
            params: [],
            events: {},
            def: {
                params: [],
                type: 'coconut_obstruct_sensing',
            },
            paramsKeyMap: {},
            class: 'coconut_sensor',
            isNotFor: ['coconut'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var pd = Entry.hw.portData;
                if (pd.BothProximityDetection > 0) {
                    return true;
                }
                return false;
            },
            syntax: { js: [], py: ['coconut.turn_for_secs(%1, %2)'] },
        },
        coconut_avoid_mode: {
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
                params: [],
                type: 'coconut_avoid_mode',
            },
            paramsKeyMap: {
                DEVICE: 0,
            },
            class: 'coconut_sensor',
            isNotFor: ['coconut'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var pd = Entry.hw.portData;

                var arrMsg = Entry.coconut.avoidMode(); //어보이드 모드
                //var arrMsg = ["0xff","0x55","0x04","0x00","0x02","0x05","0x03"];

                if (!script.isStart) {
                    script.isStart = true;
                    script.timeFlag = 1;
                    pd.msgStatus = 'start';
                    Entry.coconut.insertQueue(arrMsg, sq);
                    return script;
                } else if (script.timeFlag == 1) {
                    if (pd.msgStatus == 'end') {
                        console.log('rev = end');
                        script.timeFlag = 0;
                    } else if (pd.msgStatus == 'continue') {
                        console.log('rev = continue' + pd.msg);
                    } else {
                        console.log('rev = waiting');
                    }
                    Entry.coconut.clearQueue(sq);
                    return script;
                } else {
                    delete script.isStart;
                    delete script.timeFlag;
                    console.log('rev = ok');
                    return script.callReturn();
                }
            },
            syntax: { js: [], py: ['coconut.turn_for_secs(%1, %2)'] },
        },
        coconut_dotmatrix_set: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.coconut_dotmatrix_set_on, '1'],
                        [Lang.Blocks.coconut_dotmatrix_set_off, '0'],
                    ],
                    value: '1',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.coconut_dotmatrix_row_0, '0'],
                        [Lang.Blocks.coconut_dotmatrix_row_1, '1'],
                        [Lang.Blocks.coconut_dotmatrix_row_2, '2'],
                        [Lang.Blocks.coconut_dotmatrix_row_3, '3'],
                        [Lang.Blocks.coconut_dotmatrix_row_4, '4'],
                        [Lang.Blocks.coconut_dotmatrix_row_5, '5'],
                        [Lang.Blocks.coconut_dotmatrix_row_6, '6'],
                        [Lang.Blocks.coconut_dotmatrix_row_7, '7'],
                        [Lang.Blocks.coconut_dotmatrix_row_8, '8'],
                    ],
                    value: '1',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },

                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.coconut_dotmatrix_col_0, '0'],
                        [Lang.Blocks.coconut_dotmatrix_col_1, '1'],
                        [Lang.Blocks.coconut_dotmatrix_col_2, '2'],
                        [Lang.Blocks.coconut_dotmatrix_col_3, '3'],
                        [Lang.Blocks.coconut_dotmatrix_col_4, '4'],
                        [Lang.Blocks.coconut_dotmatrix_col_5, '5'],
                        [Lang.Blocks.coconut_dotmatrix_col_6, '6'],
                        [Lang.Blocks.coconut_dotmatrix_col_7, '7'],
                        [Lang.Blocks.coconut_dotmatrix_col_8, '8'],
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
                params: [null, null, null],
                type: 'coconut_dotmatrix_set',
            },
            paramsKeyMap: {
                BUTTON: 0,
                ROW: 1,
                COL: 2,
            },
            class: 'coconut_led',
            isNotFor: ['coconut'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var pd = Entry.hw.portData;

                var row = script.getField('ROW');
                var col = script.getField('COL');
                var button = script.getField('BUTTON');
                var row = parseInt(row);
                var col = parseInt(col);
                var button = parseInt(button);
                var arrMsg = Entry.coconut.ledMatrixOn(button, row, col); //도트매트릭스 켜짐 1줄 1칸
                //var arrMsg = ["0xff","0x55","0x07","0x00","0x02","0x1b","0x00","0x01","0x01","0x01"];

                if (!script.isStart) {
                    script.isStart = true;
                    script.timeFlag = 1;
                    pd.msgStatus = 'start';
                    Entry.coconut.insertQueue(arrMsg, sq);
                    return script;
                } else if (script.timeFlag == 1) {
                    if (pd.msgStatus == 'end') {
                        console.log('rev = end');
                        script.timeFlag = 0;
                    } else if (pd.msgStatus == 'continue') {
                        console.log('rev = continue' + pd.msg);
                    } else {
                        console.log('rev = waiting');
                    }
                    Entry.coconut.clearQueue(sq);
                    return script;
                } else {
                    delete script.isStart;
                    delete script.timeFlag;
                    console.log('rev = ok');
                    return script.callReturn();
                }
            },
            syntax: { js: [], py: ['coconut.turn_for_secs(%1, %2)'] },
        },
        coconut_dotmatrix_on: {
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
                params: [],
                type: 'coconut_dotmatrix_on',
            },
            paramsKeyMap: {},
            class: 'coconut_led',
            isNotFor: ['coconut'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var pd = Entry.hw.portData;

                var arrMsg = Entry.coconut.ledMatrixOnAll(); //도트매트릭스 모두 켜기
                //var arrMsg = ["0xff","0x55","0x05","0x00","0x01","0x07","0x00","0x01"];

                if (!script.isStart) {
                    script.isStart = true;
                    script.timeFlag = 1;
                    pd.msgStatus = 'start';
                    Entry.coconut.insertQueue(arrMsg, sq);
                    return script;
                } else if (script.timeFlag == 1) {
                    if (pd.msgStatus == 'end') {
                        console.log('rev = end');
                        script.timeFlag = 0;
                    } else if (pd.msgStatus == 'continue') {
                        console.log('rev = continue' + pd.msg);
                    } else {
                        console.log('rev = waiting');
                    }
                    Entry.coconut.clearQueue(sq);
                    return script;
                } else {
                    delete script.isStart;
                    delete script.timeFlag;
                    console.log('rev = ok');
                    return script.callReturn();
                }
            },
            syntax: { js: [], py: ['coconut.turn_for_secs(%1, %2)'] },
        },
        coconut_dotmatrix_off: {
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
                params: [],
                type: 'coconut_dotmatrix_off',
            },
            paramsKeyMap: {},
            class: 'coconut_led',
            isNotFor: ['coconut'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var pd = Entry.hw.portData;

                var arrMsg = Entry.coconut.ledMatrixClear(); //도트매트릭스 모두 끄기
                //var arrMsg = ["0xff","0x55","0x04","0x00","0x02","0x1b","0x05"];

                if (!script.isStart) {
                    script.isStart = true;
                    script.timeFlag = 1;
                    pd.msgStatus = 'start';
                    Entry.coconut.insertQueue(arrMsg, sq);
                    return script;
                } else if (script.timeFlag == 1) {
                    if (pd.msgStatus == 'end') {
                        console.log('rev = end');
                        script.timeFlag = 0;
                    } else if (pd.msgStatus == 'continue') {
                        console.log('rev = continue' + pd.msg);
                    } else {
                        console.log('rev = waiting');
                    }
                    Entry.coconut.clearQueue(sq);
                    return script;
                } else {
                    delete script.isStart;
                    delete script.timeFlag;
                    console.log('rev = ok');
                    return script.callReturn();
                }
            },
            syntax: { js: [], py: ['coconut.turn_for_secs(%1, %2)'] },
        },
        coconut_dotmatrix_num: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['0', '0'],
                        ['1', '1'],
                        ['2', '2'],
                        ['3', '3'],
                        ['4', '4'],
                        ['5', '5'],
                        ['6', '6'],
                        ['7', '7'],
                        ['8', '8'],
                        ['9', '9'],
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
                params: [
                    null,
                    {
                        type: 'text',
                        params: ['1'],
                    },
                ],
                type: 'coconut_dotmatrix_num',
            },
            paramsKeyMap: {
                VALUE: 0,
            },
            class: 'coconut_led',
            isNotFor: ['coconut'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var pd = Entry.hw.portData;

                var value = script.getField('VALUE');
                var num = parseInt(value);
                var arrMsg = Entry.coconut.showLedMatrix(num); //도트매트릭스 숫자 1표시
                //var arrMsg = ["0xff","0x55","0x05","0x00","0x02","0x1b","0x01","0x01"];

                if (!script.isStart) {
                    script.isStart = true;
                    script.timeFlag = 1;
                    pd.msgStatus = 'start';
                    Entry.coconut.insertQueue(arrMsg, sq);
                    return script;
                } else if (script.timeFlag == 1) {
                    if (pd.msgStatus == 'end') {
                        console.log('rev = end');
                        script.timeFlag = 0;
                    } else if (pd.msgStatus == 'continue') {
                        console.log('rev = continue' + pd.msg);
                    } else {
                        console.log('rev = waiting');
                    }
                    Entry.coconut.clearQueue(sq);
                    return script;
                } else {
                    delete script.isStart;
                    delete script.timeFlag;
                    console.log('rev = ok');
                    return script.callReturn();
                }
            },
            syntax: { js: [], py: ['coconut.turn_for_secs(%1, %2)'] },
        },
        coconut_dotmatrix_small_eng: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['a', '0'],
                        ['b', '1'],
                        ['c', '2'],
                        ['d', '3'],
                        ['e', '4'],
                        ['f', '5'],
                        ['g', '6'],
                        ['h', '7'],
                        ['i', '8'],
                        ['j', '9'],
                        ['k', '10'],
                        ['l', '11'],
                        ['m', '12'],
                        ['n', '13'],
                        ['o', '14'],
                        ['p', '15'],
                        ['q', '16'],
                        ['r', '17'],
                        ['s', '18'],
                        ['t', '19'],
                        ['u', '20'],
                        ['v', '21'],
                        ['w', '22'],
                        ['x', '23'],
                        ['y', '24'],
                        ['z', '25'],
                    ],
                    value: '0',
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
                params: [null],
                type: 'coconut_dotmatrix_small_eng',
            },
            paramsKeyMap: {
                VALUE: 0,
            },
            class: 'coconut_led',
            isNotFor: ['coconut'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var pd = Entry.hw.portData;

                var value = script.getField('VALUE');
                var num = parseInt(value);
                var arrMsg = Entry.coconut.showLedMatrixSmall(num); //도트매트릭스 소문자 a표시
                //var arrMsg = ["0xff","0x55","0x05","0x00","0x02","0x1b","0x02","0x00"];

                if (!script.isStart) {
                    script.isStart = true;
                    script.timeFlag = 1;
                    pd.msgStatus = 'start';
                    Entry.coconut.insertQueue(arrMsg, sq);
                    return script;
                } else if (script.timeFlag == 1) {
                    if (pd.msgStatus == 'end') {
                        console.log('rev = end');
                        script.timeFlag = 0;
                    } else if (pd.msgStatus == 'continue') {
                        console.log('rev = continue' + pd.msg);
                    } else {
                        console.log('rev = waiting');
                    }
                    Entry.coconut.clearQueue(sq);
                    return script;
                } else {
                    delete script.isStart;
                    delete script.timeFlag;
                    console.log('rev = ok');
                    return script.callReturn();
                }
            },
            syntax: { js: [], py: ['coconut.turn_for_secs(%1, %2)'] },
        },
        coconut_dotmatrix_big_eng: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['A', '0'],
                        ['B', '1'],
                        ['C', '2'],
                        ['D', '3'],
                        ['E', '4'],
                        ['F', '5'],
                        ['G', '6'],
                        ['H', '7'],
                        ['I', '8'],
                        ['J', '9'],
                        ['K', '10'],
                        ['L', '11'],
                        ['M', '12'],
                        ['N', '13'],
                        ['O', '14'],
                        ['P', '15'],
                        ['Q', '16'],
                        ['R', '17'],
                        ['S', '18'],
                        ['T', '19'],
                        ['U', '20'],
                        ['V', '21'],
                        ['W', '22'],
                        ['X', '23'],
                        ['Y', '24'],
                        ['Z', '25'],
                    ],
                    value: '0',
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
                params: [null],
                type: 'coconut_dotmatrix_big_eng',
            },
            paramsKeyMap: {
                VALUE: 0,
            },
            class: 'coconut_led',
            isNotFor: ['coconut'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var pd = Entry.hw.portData;

                var value = script.getField('VALUE');
                var num = parseInt(value);
                var arrMsg = Entry.coconut.showLedMatrixLarge(num); //도트매트릭스 대문자 A표시
                //var arrMsg = ["0xff","0x55","0x05","0x00","0x02","0x1b","0x03","0x00"];

                if (!script.isStart) {
                    script.isStart = true;
                    script.timeFlag = 1;
                    pd.msgStatus = 'start';
                    Entry.coconut.insertQueue(arrMsg, sq);
                    return script;
                } else if (script.timeFlag == 1) {
                    if (pd.msgStatus == 'end') {
                        console.log('rev = end');
                        script.timeFlag = 0;
                    } else if (pd.msgStatus == 'continue') {
                        console.log('rev = continue' + pd.msg);
                    } else {
                        console.log('rev = waiting');
                    }
                    Entry.coconut.clearQueue(sq);
                    return script;
                } else {
                    delete script.isStart;
                    delete script.timeFlag;
                    console.log('rev = ok');
                    return script.callReturn();
                }
            },
            syntax: { js: [], py: ['coconut.turn_for_secs(%1, %2)'] },
        },
        coconut_dotmatrix_kor: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['가', '0'],
                        ['나', '1'],
                        ['다', '2'],
                        ['라', '3'],
                        ['마', '4'],
                        ['바', '5'],
                        ['사', '6'],
                        ['아', '7'],
                        ['자', '8'],
                        ['차', '9'],
                        ['카', '10'],
                        ['타', '11'],
                        ['파', '12'],
                        ['하', '13'],
                    ],
                    value: '0',
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
                params: [null],
                type: 'coconut_dotmatrix_kor',
            },
            paramsKeyMap: {
                VALUE: 0,
            },
            class: 'coconut_led',
            isNotFor: ['coconut'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var pd = Entry.hw.portData;

                var value = script.getField('VALUE');
                var num = parseInt(value);
                var arrMsg = Entry.coconut.showLedMatrixKorean(num); //도트매트릭스 한글 가 표시
                //var arrMsg = ["0xff","0x55","0x05","0x00","0x02","0x1b","0x04","0x00"];

                if (!script.isStart) {
                    script.isStart = true;
                    script.timeFlag = 1;
                    pd.msgStatus = 'start';
                    Entry.coconut.insertQueue(arrMsg, sq);
                    return script;
                } else if (script.timeFlag == 1) {
                    if (pd.msgStatus == 'end') {
                        console.log('rev = end');
                        script.timeFlag = 0;
                    } else if (pd.msgStatus == 'continue') {
                        console.log('rev = continue' + pd.msg);
                    } else {
                        console.log('rev = waiting');
                    }
                    Entry.coconut.clearQueue(sq);
                    return script;
                } else {
                    delete script.isStart;
                    delete script.timeFlag;
                    console.log('rev = ok');
                    return script.callReturn();
                }
            },
            syntax: { js: [], py: ['coconut.turn_for_secs(%1, %2)'] },
        },
        coconut_light_sensor: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [],
            events: {},
            def: {
                params: [],
                type: 'coconut_light_sensor',
            },
            paramsKeyMap: {},
            class: 'coconut_sensor',
            isNotFor: ['coconut'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var pd = Entry.hw.portData;
                return pd.light;
            },
            syntax: { js: [], py: ['coconut.turn_for_secs(%1, %2)'] },
        },
        coconut_tmp_senser: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [],
            events: {},
            def: {
                params: [],
                type: 'coconut_light_tmp',
            },
            paramsKeyMap: {},
            class: 'coconut_led',
            isNotFor: ['coconut'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var pd = Entry.hw.portData;
                return pd.temp;
            },
            syntax: { js: [], py: ['coconut.turn_for_secs(%1, %2)'] },
        },
        coconut_ac_sensor: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.coconut_x_axis, '1'],
                        [Lang.Blocks.coconut_y_axis, '2'],
                        [Lang.Blocks.coconut_z_axis, '3'],
                    ],
                    value: '1',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'coconut_ac_sensor',
            },
            paramsKeyMap: {
                XYZ: 0,
            },
            class: 'coconut_led',
            isNotFor: ['coconut'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var pd = Entry.hw.portData;
                var xyz = script.getField('XYZ');

                if (xyz == '1') {
                    return pd.accelerationX;
                } else if (xyz == '2') {
                    return pd.accelerationY;
                } else {
                    return pd.accelerationZ;
                }
            },
            syntax: { js: [], py: ['coconut.turn_for_secs(%1, %2)'] },
        },
        coconut_outled_sensor: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['D4', 4],
                        ['D10', 10],
                        ['D11', 11],
                        ['D12', 12],
                        ['A2', 16],
                        ['A3', 17],
                    ],
                    value: '4',
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
                        type: 'number',
                        params: ['1'],
                    },
                ],
                type: 'coconut_outled_sensor',
            },
            paramsKeyMap: {
                PIN: 0,
                TIME: 1,
            },
            class: 'coconut_led',
            isNotFor: ['coconut'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var pd = Entry.hw.portData;

                var pin = script.getNumberField('PIN');
                var time = script.getNumberValue('TIME');
                var arrMsg = Entry.coconut.extLedOn(pin, time); //외부 LED 설정 D4 0.5초동안 켜기
                //var arrMsg = ["0xff","0x55","0x06","0x00","0x02","0x2c","0x04","0xf4","0x01"];

                if (!script.isStart) {
                    script.isStart = true;
                    script.timeFlag = 1;
                    pd.msgStatus = 'start';
                    Entry.coconut.insertQueue(arrMsg, sq);
                    return script;
                } else if (script.timeFlag == 1) {
                    if (pd.msgStatus == 'end') {
                        console.log('rev = end');
                        script.timeFlag = 0;
                    } else if (pd.msgStatus == 'continue') {
                        console.log('rev = continue' + pd.msg);
                    } else {
                        console.log('rev = waiting');
                    }
                    Entry.coconut.clearQueue(sq);
                    return script;
                } else {
                    delete script.isStart;
                    delete script.timeFlag;
                    console.log('rev = ok');
                    return script.callReturn();
                }
            },
            syntax: { js: [], py: ['coconut.turn_for_secs(%1, %2)'] },
        },
        coconut_outspk_sensor: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [['D10', '10'], ['D11', '11']],
                    value: '10',
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
                        type: 'number',
                        params: ['100'],
                    },
                    {
                        type: 'number',
                        params: ['0.5'],
                    },
                ],
                type: 'coconut_outspk_sensor',
            },
            paramsKeyMap: {
                PIN: 0,
                HZ: 1,
                TIME: 2,
            },
            class: 'coconut_led',
            isNotFor: ['coconut'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var pd = Entry.hw.portData;

                var pin = script.getNumberField('PIN');
                var hz = script.getNumberValue('HZ');
                var time = script.getNumberValue('TIME');
                var arrMsg = Entry.coconut.playSpeaker(pin, hz, time); //외부 스피커 설정 D10 100hz로 0.5초 동안 소리내기
                //var arrMsg = ["0xff","0x55","0x08","0x00","0x02","0x29","0x10","0x64","0x00","0xf4","0x01"];

                if (!script.isStart) {
                    script.isStart = true;
                    script.timeFlag = 1;
                    pd.msgStatus = 'start';
                    Entry.coconut.insertQueue(arrMsg, sq);
                    return script;
                } else if (script.timeFlag == 1) {
                    if (pd.msgStatus == 'end') {
                        console.log('rev = end');
                        script.timeFlag = 0;
                    } else if (pd.msgStatus == 'continue') {
                        console.log('rev = continue' + pd.msg);
                    } else {
                        console.log('rev = waiting');
                    }
                    Entry.coconut.clearQueue(sq);
                    return script;
                } else {
                    delete script.isStart;
                    delete script.timeFlag;
                    console.log('rev = ok');
                    return script.callReturn();
                }
            },
            syntax: { js: [], py: ['coconut.turn_for_secs(%1, %2)'] },
        },
        coconut_outspk_sensor_off: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [['D10', '10'], ['D11', '11']],
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
                params: [null],
                type: 'coconut_outspk_sensor_off',
            },
            paramsKeyMap: {
                PIN: 0,
            },
            class: 'coconut_led',
            isNotFor: ['coconut'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var pd = Entry.hw.portData;

                var pin = script.getNumberField('PIN');
                var arrMsg = Entry.coconut.stopSpeaker(pin); //외부스피커 D10 끄기
                //var arrMsg = ["0xff","0x55","0x08","0x00","0x02","0x29","0x10","0x00","0x00","0x00","0x00"];

                if (!script.isStart) {
                    script.isStart = true;
                    script.timeFlag = 1;
                    pd.msgStatus = 'start';
                    Entry.coconut.insertQueue(arrMsg, sq);
                    return script;
                } else if (script.timeFlag == 1) {
                    if (pd.msgStatus == 'end') {
                        console.log('rev = end');
                        script.timeFlag = 0;
                    } else if (pd.msgStatus == 'continue') {
                        console.log('rev = continue' + pd.msg);
                    } else {
                        console.log('rev = waiting');
                    }
                    Entry.coconut.clearQueue(sq);
                    return script;
                } else {
                    delete script.isStart;
                    delete script.timeFlag;
                    console.log('rev = ok');
                    return script.callReturn();
                }
            },
            syntax: { js: [], py: ['coconut.turn_for_secs(%1, %2)'] },
        },
        coconut_outinfrared_sensor: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [['A2', '16'], ['A3', '17']],
                    value: '16',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'coconut_outinfrared_sensor',
            },
            paramsKeyMap: {
                PIN: 0,
            },
            class: 'coconut_led',
            isNotFor: ['coconut'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var pd = Entry.hw.portData;
                var pin = script.getNumberField('PIN');

                if (pin == '16') {
                    return pd.extA2;
                } else {
                    return pd.extA3;
                }
            },
            syntax: { js: [], py: ['coconut.turn_for_secs(%1, %2)'] },
        },
        coconut_outcds_sensor: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [['A2', '16'], ['A3', '17']],
                    value: '16',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'coconut_outcds_sensor',
            },
            paramsKeyMap: {
                PIN: 0,
            },
            class: 'coconut_led',
            isNotFor: ['coconut'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var pd = Entry.hw.portData;

                var pin = script.getNumberField('PIN');
                if (pin == '16') {
                    return pd.extA2;
                } else {
                    return pd.extA3;
                }
            },
            syntax: { js: [], py: ['coconut.turn_for_secs(%1, %2)'] },
        },
        coconut_servomotor_angle: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['D4', '4'],
                        ['D10', '10'],
                        ['D11', '11'],
                        ['D12', '12'],
                        ['A2', '16'],
                        ['A3', '17'],
                    ],
                    value: '4',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Block',
                    accept: 'String',
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
                        params: ['0'],
                    },
                ],
                type: 'coconut_servomotor_angle',
            },
            paramsKeyMap: {
                PIN: 0,
                ANGLE: 1,
            },
            class: 'coconut_led',
            isNotFor: ['coconut'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var pd = Entry.hw.portData;

                var pin = script.getNumberField('PIN');
                var angle = script.getNumberValue('ANGLE');
                var arrMsg = Entry.coconut.runExtServo(pin, angle); //서보모터 연결 D4 각도 90
                //var arrMsg = ["0xff","0x55","0x05","0x00","0x02","0x43","0x04","0x5a"];

                if (!script.isStart) {
                    script.isStart = true;
                    script.timeFlag = 1;
                    pd.msgStatus = 'start';
                    Entry.coconut.insertQueue(arrMsg, sq);
                    return script;
                } else if (script.timeFlag == 1) {
                    if (pd.msgStatus == 'end') {
                        console.log('rev = end');
                        script.timeFlag = 0;
                    } else if (pd.msgStatus == 'continue') {
                        console.log('rev = continue' + pd.msg);
                    } else {
                        console.log('rev = waiting');
                    }
                    Entry.coconut.clearQueue(sq);
                    return script;
                } else {
                    delete script.isStart;
                    delete script.timeFlag;
                    console.log('rev = ok');
                    return script.callReturn();
                }
            },
            syntax: { js: [], py: ['coconut.turn_for_secs(%1, %2)'] },
        },
        //endregion coconut 코코넛
    };
};

module.exports = Entry.coconut;
