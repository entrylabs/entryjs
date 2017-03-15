/**
 * @file    :   coconutExtension.js
 * @author  :   keunja kim 
 * @version :   0.11.0
 * @date    :   2017.01.23
 * @details :   2016.10.06 reset 추가\n
 *          :   2017.03.06 코코넛용으로 변경
 */
var Exten = (function(ext) {
	var root = ext;
	var Module;

	if(typeof exports !== 'undefined') {
        Module = exports;
    } else {
        Module = root.Module = {};
    }

    var device = null;
    var _rxBuf = [];

    // device id
    var devices = {
        "LightSensor": 14,
        "Accelerometer": 18,
        "Temperature": 21,
        "Buzzer": 3,
        "IRdistance": 5,
        "Linetracer": 7,
        "IR": 9,
        "RGBled": 25,
        "Motor": 26,
        "LedMatrix": 27,    //1b
        "Digital": 30,
        "Analog": 31,
        "PWM": 32,
        "External": 40,
        "Speaker": 41,
        "ExtIR": 42,
        "ServoMotor": 43,
        "ExLed": 44,
        "ExtCds": 45
    };

    // buzzer variables
    // 음계
    /*var tones = { "C4": 262, "CS4": 277, "D4": 294, "DS4": 311, 
                 "E4": 330, "F4": 349,  "FS4": 370, "G4": 392, "GS4": 415, 
                 "A4": 440, "AS4": 466, "B4":  494, "C5": 523, "CS5": 554, 
                 "D5": 587, "DS5": 622, "E5": 659, "F5": 698, "FS5": 740, 
                 "G5": 784, "GS5": 831, "A5": 880, "AS5": 932, "B5": 988 };*/
    // 올림, 내림
    var sharps = {"-": 0, "#": 1, "b": 2};
    
    // 박자: 음표, 쉼표 동일 
    var beats = { "Half": 500, "Quater": 250, "Eighth": 125, "Sixteenth": 63, "Thirty-second": 32, "Whole": 1000, "Dotted half": 750, "Dotted quarter": 375, "Dotted eighth": 188, "Dotted sixteenth": 95, "Dotted thirty-second": 48, "Double": 2000, "Zero": 0 };
    //var noteDefault = '0';  // 멜로디 기본값

    var melodys = {"Twinkle Twinkle little star": 1, "Three bears": 2, "Mozart's Lullaby": 3, "Do-Re-Mi": 4, "Butterfly": 5};

    var directions = {"Both": 0, "Left": 1, "Right": 2, "Forward": 3, "Backward": 4}; 
    
    var colors = { "Black": 0, "White": 1, "Red": 2, "Green": 3, "Blue": 4, "Yellow": 5, "Cyan": 6, "Magenta": 7 }; 
    
    // IR distance 감지조건
    var detectConds = {"Yes": 1, "No": 0};
    
    /// 도트매트릭스 문자 
    // 소문자
    var sLetters = {"a": 0, "b": 1, "c": 2, "d": 3, "e": 4, "f": 5, "g": 6, "h": 7, "i": 8, "j": 9, "k": 10, "l": 11, "m": 12, "n": 13, "o": 14, "p": 15, "q": 16, "r": 17, "s": 18, "t": 19, "u": 20, "v": 21, "w": 22, "x": 23, "y": 24, "z": 25};
    // 대문자
    var cLetters = {"A": 0, "B": 1, "C": 2, "D": 3, "E": 4, "F": 5, "G": 6, "H": 7, "I": 8, "J": 9, "K": 10, "L": 11, "M": 12, "N": 13, "O": 14, "P": 15, "Q": 16, "R": 17, "S": 18, "T": 19, "U": 20, "V": 21, "W": 22, "X": 23, "Y": 24, "Z": 25};
    // 한글
    var kLetters = {"ga": 0, "na": 1, "da": 2, "la": 3, "ma": 4, "ba": 5, "sa": 6, "aa": 7, "ja": 8, "cha": 9, "ka": 10, "ta": 11, "pa": 12, "ha": 13};
    var onOffs = {"On": 1, "Off": 0};
    
    var axiss = { "X-Axis": 1, "Y-Axis": 2, "Z-Axis": 3 };
    
    // motor
    var speed = 60;    // 모터 기본속도
    
    // external
    var pins = {"D4": 4, "D10": 10, "D11": 11, "D12": 12, "A2": 16, "A3": 17};
    
    var outputValues = {"HIGH": 1, "LOW": 0};
    
    var values = {};

    ext.resetAll = function() {
        device.send([0xff, 0x55, 2, 0, 4]);
		var bytes_1 = [0xff, 0x55, 0, 0, 2];
		return bytes_1;
    };

    //Coconut용 변수 선언
    var tempBytes = {};

    // coconut Program
    ext.runArduino = function() {};

    // motor
    /**
     * @brief   모터 움직이기 - 전진/후진/좌회전/우회전
     * @details 기본 속도 적용, 시간제한 없음
     * @date    2016.04.27
     *
     * @param   direction     방향 (1: Left, 2: Right, 3: Forward, 4: Backward), default: Go
     */
    ext.moveMotor = function(direction) {
        if (typeof direction == "string") direction = directions[direction];
        
        // seq, direction, speed, degree, time
        return(runPackage(devices["Motor"], 0, direction, speed));
    };
    
    ext.moveMotorSpeed = function(direction, speed) {
         if (typeof direction == "string") direction = directions[direction];
        
        // seq, direction, speed, degree, time
        return(runPackage(devices["Motor"], 0, direction, speed));
    };
    
    /**
     * @brief   모터 움직이기 - 좌회전/우회전
     * @details 기본 속도 적용, 시간제한 없음
     *
     * @param   direction     방향 (1: Left, 2: Right, 3: Forward, 4: Backward), default: Go
     */
    ext.turnMotor = function(direction) {
        if (typeof direction == "string") direction = directions[direction];
        
        // seq, direction, speed, degree, time
        return(runPackage(devices["Motor"], 0, direction, speed));
    };
    
    /**
     * @brief   모터 정지
     * @date    2016.06.23
     */
    ext.stopMotor = function() {
        return(runPackage(devices["Motor"], 1));
    };
    
    /**
     * @brief   좌측/우측으로 각도 만큼 돌기
     * @details 기본속도 적용, 정해진 각도만큼 회전후 정지
     * @todo    degree<0 반대방향 적용 여부 결정
     * @date    2016.04.27
     * @param   direction   방향 (1: Left, 2: Right), default: Left
     * @param   degree      회전각도 (0~360도), default: 90도
     */
    ext.moveTurnAngle = function(direction, degree) {
        var sec = 0;     // 제한없음
        
        if (typeof direction == "string") direction = directions[direction];
        
        // 각도가 360 이상일 경우 360으로 고정
        if (degree > 360 || degree < -360) degree = 360;
        
        // seq, direction, speed, degree, time
        //motorControl(2, direction, speed, degree, sec);
    };
    
    /**
     * @brief   움직이기 - 전/후진, 좌/우회전 - 시간
     * @details 기본속도 적용 
     * @date    2016.04.27
     *
     * @param   direction     방향 (1: Left, 2: Right, 3: Forward, 4: Backward), default: Go
     * @param   sec         시간 (초), default: 1초
     */
     ext.moveGoTime = function(direction, sec) {
        // 시간이 0보다 작으면 양수로 변환
        if (sec < 0) sec = -sec;
        sec = 1000 * sec; // ms 변환
        
        if (typeof direction == "string") direction = directions[direction];
        
        // seq, direction, speed, degree, time
        return(runPackage(devices["Motor"], 3, direction, speed, short2array(sec)));
    };
    
    /**
     * @brief   좌/우회전 - 시간
     * @details 기본속도 적용 
     *
     * @param   direction     방향 (1: Left, 2: Right), default: Go
     * @param   sec         시간 (초), default: 1초
     */
     ext.turnMotorTime = function(direction, sec) {
        // 시간이 0보다 작으면 양수로 변환
        if (sec < 0) sec = -sec;
        sec = 1000 * sec; // ms 변환
        
        if (typeof direction == "string") direction = directions[direction];
        
        return(runPackage(devices["Motor"], 3, direction, speed, short2array(sec)));
    };
    
    /**
     * @brief   좌/우측 무한 회전하는 동안 RGB LED 켜기
     *
     * @param  direction   방향 (1: Left, 2: Right), default: Left
     * @param  color       RGB LED 색상 (1: Red, 2: Green, 3: Blue), default: Red
     */
    ext.moveMotorColor = function(direction, color) {
        var deviceID = devices["Motor"];
        
        if (typeof direction == "string") direction = directions[direction];
        if (typeof color == "string") color = colors[color];
        
        // deviceid, seq, direction, speed, color
        return(runPackage(deviceID, 5, direction, speed, color));
    };
    
    /**
     * @brief   좌/우측 각도에 따라 회전하는 동안 RGB LED 켜기
     * @todo    각도 설정 불가, 추후 삭제
     * 
     * @param   direction   방향 (1: Left, 2: Right), default: Left
     * @param   angle       회전각도 (0~360도)
     * @param   color       RGB LED 색상 (1: Red, 2: Green, 3: Blue), default: Red
     */
    ext.moveMotorAngleColor = function(direction, angle, color) {
        var deviceID = devices["Motor"];
        
        if (typeof direction == "string") direction = directions[direction];
        if (typeof color == "string") color = colors[color];
        if (typeof angle != "number") angle = 90;
        
        // deviceid, seq, direction, speed, angle, time, color
        return(runPackage(deviceID, 6, direction, short2array(0), short2array(angle), short2array(0), color));
    };
    
    /**
     * @brief   control external motor
     * 
     * @param   direction   방향 (1: Left, 2: Right, 3: Forward, 4: Backward), default: Go
     * @param   speed       속도 (0-255)
     */
    ext.moveExtMotor = function (direction, speed) {
        if (typeof direction == "string") direction = directions[direction];
        
        // deviceid, seq, direction, speed
        return(runPackage(devices["Motor"], 7, direction, speed));
    };
    
    /**
     * @brief   RGB LED 켜기 - 방향, 색상 선택
     * @details 시간제한 없음, seq=0
     *
     * @date    2016.04.28
     * @param   direction   방향 (0: both, 1: Left, 2: Right), default: Left
     * @param   color       색상 (1: Red, 2: Green, 3: Blue), default: Red
     */
    ext.rgbOn = function(direction, color) {
        if (typeof direction == "string") direction = directions[direction];
        if (typeof color == "string") color = colors[color];
        
        return(runPackage(devices["RGBled"], 0, direction, color));
    };

    /**
     * @brief   RGB LED 끄기 - 방향
     * @details 시간제한 없음, seq=1
     *
     * @param   direction    방향 (0: all, 1: Left, 2: Right), default: Left
     */
    ext.rgbOff = function(direction) {
        if (typeof direction == "string") direction = directions[direction];
        
        return(runPackage(devices["RGBled"], 1, direction, 0));
    };
    
    /**
     * @brief   RGB LED 끄기 - 방향, 색상
     * @details seq=2
     * @date    2016.05.30
     * 
     * @param   direction   방향 (0: all, 1: Left, 2: Right), default: Left
     * @param   color       색상 (1: Red, 2: Green, 3: Blue), default: Red
     */
    ext.rgbOffColor = function(direction, color) {
        if (typeof direction == "string") direction = directions[direction];
        if (typeof color == "string") color = colors[color];
        
        return(runPackage(devices["RGBled"], 1, direction, color));
    };
    
    /**
     * @brief   RGB LED 켜기 - 방향, 색상, 시간
     * @details seq=2
     * @date    2016.04.28
     * 
     * @param   direction   방향 (0: all, 1: Left, 2: Right), default: Left
     * @param   color       색상 (1: Red, 2: Green, 3: Blue), default: Red
     * @param   sec         시간, 초
     */
    ext.ledOnTime = function(direction, color, sec) {
        if (typeof direction == "string") direction = directions[direction];
        if (typeof color == "string") color = colors[color];
        
        // 시간이 정수가 아니거나 0보다 작을 경우 0으로 변경
        if (typeof sec != "number") sec = 0;
        else if (sec < 0) sec = 0;  
        else sec *= 1000;   // ms 변환
                
        return(runPackage(devices["RGBled"], 3, direction, color, short2array(sec)));
    };
    
    /// buzzer
    /**
     * @brief   스피커 켜기
     * @details 버저음을 기본 주파수 c4 로 짧게 소리낸다. 
     */
    ext.beep = function() {
        // c4(262), duration : 50
        //buzzerControl(0, tones["C4"], 50);
        return((buzzerControl(0, 262, 50)));
		// 
    };
    
    /**
     * @brief   버저음을 seconds 동안 소리내기 (기본주파수)
     * @details 기본주파수 : c4 (도)
     * @date    2015.04.26
     * @param   sec 연주시간 (seconds, 초) 
     */
    ext.playBuzzerTime = function(sec) {
        // 시간이 숫자가 아니거나 0보다 작을 경우 0.5초로 고정
        if (typeof sec != "number") sec = 0.5;
        if (sec < 0) sec = 0.5;
        
        sec = 1000 * sec;  // milliseconds 변환
        
        //buzzerControl(0, tones["C4"], sec);    
        return(buzzerControl(0, 262, sec));    
    };
    
    /**
     * @brief   버저음 freq hz를 seconds 초 동안 소리내기
     * @date    2016.04.26
     * @param   freq    주파수 hz
     * @param   sec     연주시간 (seconds, 초) 
     */
    ext.playBuzzerFreq = function(freq, sec) {
        // 시간이 숫자가 아니거나 0보다 작을 경우 0.5초로 고정
        if (typeof sec != "number") sec = 0.5;
        if (sec < 0) sec = 0.5;
        
        sec = 1000 * sec;  // milliseconds 변환

        // 주파수가 숫자가 아니거나 0보다 작을 경우 300hz로 고정
        if (typeof freq != "number") freq = 300;
        if (freq < 0) freq = 300;
        
        return(buzzerControl(0, freq, sec));
    };

    /**
     * @brief   버저 끄기
     * @details tone = 0 일 경우 버저 끄기 실행
     */
    ext.buzzerOff = function() {
        // tone=0, beat=0
        return((buzzerControl(0, 0, 0)));
    };

    /**
     * @brief   버저 tone 음을 beat 박자로 실행
     * @param   note    음계
     * @param   octave  옥타브
     * @param   beat    박자
     */
    ext.playBuzzerNote = function(note, octave, beat) {
        
        // note 에서 `NOTE_` 다음 문자열만 추출
        //var arrNote = note.split("NOTE_",2);
        note = getNote(note);
        
        // 계이름 + 옥타브
       // var tone = note.concat(octave);

        //if (typeof note == "string") tone = tones[tone];
        if (typeof beat == "string") beat = beats[beat];

        // note ascii 코드로 변환하여 전송
        return(runPackage(devices["Buzzer"], 2, note.charCodeAt(0), octave, short2array(beat)));
    };
    
    /**
     * @brief   버저 tone 음을 beat 박자로 실행
     * @param   note    음계
     * @param   octave  옥타브
     * @param   sharp   올림표/내림표 (-:0, #:1, b:2)
     * @param   beat    박자
     */
    ext.playNote = function(note, octave, sharp, beat) {
        
        // note 에서 `NOTE_` 다음 문자열만 추출
        note = getNote(note);
        
        // 계이름 + 옥타브
       // var tone = note.concat(octave);

        //if (typeof note == "string") tone = tones[tone];
        if (typeof beat == "string") beat = beats[beat];

        // note ascii 코드로 변환하여 전송
        return(runPackage(devices["Buzzer"], 4, note.charCodeAt(0), octave, sharp.charCodeAt(0), short2array(beat)));
    };
    
    /**
     * @brief   음계 문자 추출
     * @param   note    음계 (eg. NOTE_C)
     */
    function getNote(note) {
        // note 에서 `NOTE_` 다음 문자열만 추출
        var arrNote = note.split("_");
        
        return arrNote[1];
    }
    
    /**
     * @brief   박자 쉬기
     * @param   beat    박자
     */
    ext.restBeat = function(beat) {
        if (typeof beat == "string") {
            // Half_rest 에서 `_` 앞 문자열만 추출하여 박자 설정
            var arrBeat = beat.split("_", 1);
            beat = beats[arrBeat];   
         }  
         
        return(buzzerControl(1, 0, beat));
    };

    /** 
     * @brief   버저 tone+octave 음을 beat 박자로 실행시 LED 켜기
     * @param  note
     * @param  octave
     * @param  beat
     * @param  color   색상 (1: Red, 2: Green, 3: Blue), default: Red
     */
    ext.playBuzzerColor = function(note, octave, beat, color) {
        // note 에서 `NOTE_` 다음 문자열만 추출
        //var arrNote = note.split("NOTE_",2);
        note = getNote(note);
        
        // 계이름+옥타브
        //var tone = note.concat(octave);
        
        //if (typeof note == "string") tone = tones[tone];
        if (typeof beat == "string") beat = beats[beat];
        if (typeof color == "string") color = colors[color];
        
        return(runPackage(devices["Buzzer"], 3, note.charCodeAt(0), octave, short2array(beat), color));
    };
    
    /** 
     * @brief   버저 tone+octave 음을 beat 박자로 실행시 LED 켜기
     * @param   note
     * @param   octave
     * @param   sharp       올림표/내림표 (-:0, #:1, b:2)
     * @param   beat
     * @param   direction   Left:1, Right:2, All: 0
     * @param   color       1: Red, 2: Green, 3: Blue, default: Red
     */
    ext.playNoteColor = function(note, octave, sharp, beat, direction, color) {
        // note 에서 `NOTE_` 다음 문자열만 추출
        note = getNote(note);
        
        if (typeof beat == "string") beat = beats[beat];
        if (typeof direction == "string") direction = directions[direction];
        if (typeof color == "string") color = colors[color];
        
        return(runPackage(devices["Buzzer"], 5, note.charCodeAt(0), octave, sharp.charCodeAt(0), short2array(beat), direction, color));
    };
    
    /**
     * @brief   멜로디 연주하기
     * @param   melody  멜로디 (1:작은별, 2:곰세마리, 3:자장가, 4:도레미송, 5:나비야)
     */
    ext.playMelody = function(melody) {
        if (typeof melody == "string") melody = melodys[melody];

        return(runPackage(devices["Buzzer"], 6, melody));
    };

    /**
     * @brief   버저 제어
     * @details 
     * @param   seq     순번 (0: 연주, 1: 박자쉬기, 2: 음표 연주)
     * @param   tone    주파수
     * @param   beat    박자
     * @param   note    음표
     */
    function buzzerControl(seq, tone, beat) {
        var deviceID = devices["Buzzer"];

        //if (typeof tone == "string") tone = tones[tone];
        if (typeof beat == "string") beat = beats[beat];

        return(runPackage(deviceID, seq, short2array(tone), short2array(beat)));
    }

    // led blink
    ext.runBlink = function() {
        var pin = 13;
        return(runPackage(30, pin));
    };

    /**
     * @brief   빛센서 값 읽기
     * 
     */
    ext.getLightSensor = function(nextID) {
        getPackage(0, devices["LightSensor"], 0);
    };

    /**
     * @brief   3축 가속도센서 값 읽기
     * 
     * @param   axis    축 (X, Y, Z)
     */
    ext.getAccelerometer = function(nextID, axis) {
        if (typeof axis == "string") axis = axiss[axis];
        
        getPackage(nextID, devices["Accelerometer"], 0, axis);
    };

    /// line tracer
    /**
     * @brief   바닥 적외선센서 값 읽기
     *
     * @param   direction   방향, default Left (1: Left, 2: Right)
     */
    ext.getLineTracer = function(nextID, direction) {
        if (typeof direction == "string") direction = directions[direction];
        
        getPackage(nextID, devices["Linetracer"], 0, direction);
    };
    
     /**
     * @brief   바닥 적외선센서 감지여부
     * 
     * @param   direction   방향, default Left (1: Left, 2: Right)
     * @param   detectCond  감지 조건 (1: 감지, 0: 미감지)
     */
    ext.isLineDetected = function(nextID, direction, detectCond) {
        if (typeof direction == "string") direction = directions[direction];
        if (typeof detectCond == "string") detectCond = detectConds[detectCond];
        
        getPackage(nextID, devices["Linetracer"], 1, direction, detectCond);
    };
    
    /**
     * @brief   바닥 적외선센서 색상 감지 여부
     * @todo    색상감지 사용 안할 경우 삭제
     */
    ext.isLineDetect = function(nextID, direction, color) {
        if (typeof direction == "string") direction = directions[direction];
        if (typeof color == "string") color = colors[color];
        
        getPackage(nextID, devices["Linetracer"], 2, direction, color);
    };
    
    /**
     * @brief   선 따라가기, level=5 (default)
     */
    ext.followLine = function() {
        return(runPackage(devices["Linetracer"], 3, speed));
    };
    
    /**
     * @brief   선 따라가기, 속도 설정
     */
    ext.followLineLevel = function(level, speed) {
        if (typeof speed != "number") speed = 70;
        return(runPackage(devices["Linetracer"], 3, level, speed));
    };
    
    /// IR distance
    /**
     * @brief   좌/우측 전방센서값 읽기
     *
     * @param   direction   방향, default Left (1: Left, 2: Right)
     */
    ext.getDistance = function(nextID, direction) {
        if (typeof direction == "string") direction = directions[direction];

        getPackage(nextID, devices["IRdistance"], 0, direction);
    };
    
    /**
     * @brief   장애물 감지 기준 변경
     * @date    2016.05.24
     *
     * @param   direction   방향, default Left (1: Left, 2: Right)
     * @param   standard    감지 기준
     */
    ext.setStandard = function(direction, standard) {
        if (typeof direction == "string") direction = directions[direction];
        
        return(runPackage(devices["IRdistance"], 0, direction, standard));
    };
    
    /**
     * @brief   좌/우측 장애물 감지 여부
     * @date    2016.05.23
     * 
     * @param   direction   default Left (1: Left, 2: Right, 0: All)
     * @param   detectCond  감지 조건 (1: 감지, 0: 미감지)
     */
    ext.isDetectObstacle = function(nextID, direction, detectCond) {
        if (typeof direction == "string") direction = directions[direction];
        if (typeof detectCond == "string") detectCond = detectConds[detectCond];

        getPackage(nextID, devices["IRdistance"], 1, direction, detectCond);
    };

    /**
     * @brief   장애물 감지 (좌/우측 통합)
     * @details 감지결과  (0: 감지안됨, 1: 오른쪽 감지, 2: 왼쪽 감지, 3: 둘다 감지)
     * 
     */
    ext.isDetectObstacles = function(nextID) {
        var deviceID = devices["IRdistance"];

        getPackage(nextID, deviceID, 2);
    };
    
    /**
     * @brief   어보이드 모드
     */
    ext.avoidMode = function() {
        return(runPackage(devices["IRdistance"], 3));
    };
    
    /// LED Matrix
    /**
     * @brief   Led Matrix 행열 켜기
     * 
     * @param   row     행 번호, 0-8 (Both=0)
     * @param   col     열 번호, 0-8 (Both=0)
     * @param   onOff   on=1, off=0
     */
    ext.ledMatrixOn = function(onOff, row, col) {
        if (typeof onOff == "string") onOff = onOffs[onOff];
        if ((typeof row=="string") && (row=="Both")) row = 0; 
        if ((typeof col=="string") && (col=="Both")) col = 0; 
        
        return(runPackage(devices["LedMatrix"], 0, row, col, onOff));
    };
    
    /**
     * @brief   Led Matrix 행열 끄기
     * 
     * @param   row 행 번호
     * @param   col 열 번호
     */
    ext.ledMatrixOff = function (row, col) {
        return(runPackage(devices["LedMatrix"], 0, row, col, 0));
    };
    
    /**
     * @brief   Led Matrix 모두 끄기
     */
    ext.ledMatrixClear = function() {
        return(runPackage(devices["LedMatrix"], 5));    // seq=5
    };
    
    /**
     * @brief   Led Matrix 모두 켜기
     */
    ext.ledMatrixOnAll = function() {
        return(runPackage(devices["LedMatrix"], 6));    // seq=6
    };
    
    /**
     * @brief   Led Matrix 숫자 표시
     * 
     * @param   code 숫자 (0-9)
     */
    ext.showLedMatrix = function (code) {
        return(runPackage(devices["LedMatrix"], 1, code));
    };
    
    /**
     * @brief   Led Matrix 영문 소문자 표시
     * 
     * @param   code 소문자 (a-z)
     */
    ext.showLedMatrixSmall = function (code) {
        if (typeof code == "string") code = sLetters[code];
        return(runPackage(devices["LedMatrix"], 2, code));
    };
    
    /**
     * @brief   Led Matrix 영문 대문자 표시
     * 
     * @param   code 대문자(A-Z)
     */
    ext.showLedMatrixLarge = function (code) {
        if (typeof code == "string") code = cLetters[code];
        return(runPackage(devices["LedMatrix"], 3, code));
    };
    
    /**
     * @brief   Led Matrix 한글 표시
     * 
     * @param   code 한글 (가-하)
     */
    ext.showLedMatrixKorean = function (code) {
        if (typeof code == "string") code = kLetters[code];
        return(runPackage(devices["LedMatrix"], 4, code));
    }
    
    /// IR
    /**
     * @brief   IR 메시지 보내기
     *
     * @param   message 전송할 문자열
     */
    ext.sendMessage = function(message) {
        return(runPackage(devices["IR"], string2array(message)));
    };

    /**
     * @brief   IR 메시지 받기
     *
     */
    ext.getMessage = function(nextID) {
        getPackage(nextID, devices["IR"]);
    };

    /**
     * @brief   온도 측정
     */
    ext.getTemperature = function(nextID) {
        getPackage(nextID, devices["Temperature"], 0);
    };
    
    /// external input/output
    /**
     * @brief   외부 LED on/off
     *
     * @param   pin     디지털 핀번호
     * @param   sec     시간 (ms)
     */
    ext.extLedOn = function(pin, sec) {
        if (typeof pin == "string") pin = pins[pin];
        sec *= 1000;
        
        return(runPackage(devices["ExLed"], pin, short2array(sec)));
    };
    
    /**
     * @brief   외부 speaker 소리내기
     *
     * @param   pin         pwm 핀번호
     * @param   freq        주파수
     * @param   duration    시간 (ms)
     */
    ext.playSpeaker = function(pin, freq, duration) {
        if (typeof pin == "string") pin = pins[pin];
        duration *= 1000;
        
        return(runPackage(devices["Speaker"], pin, short2array(freq), short2array(duration)));
    };
    
    /**
     * @brief   외부 speaker 끄기
     *
     * @param   pin pwm 핀번호
     */
    ext.stopSpeaker = function(pin) {
        if (typeof pin == "string") pin = pins[pin];
        
        return(runPackage(devices["Speaker"], pin, short2array(0), short2array(0)));
    };
    
    /**
     * @brief   read external IR
     *
     * @param   pin analog pin (A2, A3)
     */
    ext.getExtIR = function(nextID, pin) {
        if (typeof pin == "string") pin = pins[pin];
        getPackage(nextID, devices["ExtIR"], pin);
    };
    
    /**
     * @brief   read external Cds
     *
     * @param   pin analog pin (A2, A3)
     */
    ext.getExtCds = function(nextID, pin) {
        if (typeof pin == "string") pin = pins[pin];
        getPackage(nextID, devices["ExtCds"], pin);
    };
    
    /**
     * @brief   run servo motor
     *
     * @param   pin     pwm pins (D10, D11)
     * @param   angle   0~180
     */
    ext.runExtServo = function(pin, angle) {
        if (typeof pin == "string") pin = pins[pin];
        
        return(runPackage(devices["ServoMotor"], pin, angle));
    };
    
    /**
     * @brief   디지털값 읽기
     * @date    2016.05.19
     *
     * @param   pin 디지털 핀번호
     */
    ext.readDigital = function(nextID, pin) {
        getPackage(nextID, devices["Digital"], pin);
    };
    
    /**
     * @brief   아날로그값 읽기
     * @date    2016.05.19
     *
     * @param   pin 아날로그 핀번호
     */
    ext.readAnalog = function(nextID, pin) {
        getPackage(nextID, devices["Analog"], pin);
    }
    
    /**
     * @brief   디지털 출력 설정
     * @date    2016.05.19
     *
     * @param   pin         디지털 핀번호
     * @param   outputValue 출력값 (HIGH:1, LOW:0)
     */
    ext.digitalWrite = function (pin, outputValue) {
        if (typeof outputValue == "string") outputValue = outputValues[outputValue];
        return(runPackage(devices["Digital"], pin, outputValue));
    };
    
    /**
     * @brief   아날로그 출력 설정
     * @date    2016.05.19
     * 
     * @param   pin     아날로그 핀번호
     * @param   duty    듀티사이클 (0~255)
     */
    ext.analogWrite = function (pin, duty) {
        if (typeof duty != "number") {
            duty = 0;
        }    
        // 듀티사이클이 255를 넘길경우 255로 설정 (100%)
        else if (duty > 255) { 
            duty = 255;
        }//if
        
        return(runPackage(devices["Analog"], pin, duty));
    };

    // common function
    /**
     * @brief 모듈 실행
     */
    function runPackage() {
        var bytes = [0xff, 0x55, 0, 0, 2];

        for (var i=0; i<arguments.length; i++) {
            if (arguments[i].constructor == "[class Array]") {
                bytes = bytes.concat(arguments[i]);
            } 
			//coconut 용 수
			else if(arguments[i].length == 2) {
				bytes = bytes.concat(arguments[i]);
			}
            else {
                bytes.push(arguments[i]);
            }
        }//for

        bytes[2] = bytes.length-3;  // data length
        
        // 장치에 ArrayBuffer data 전송
        //device.send(bytes);
	return bytes;

    }//function
    
    /**
     * @brief   센서값 읽기
     * 
     */
    function getPackage() {
        var nextID = arguments[0];
        var len = arguments.length;
        
        var bytes = [0xff, 0x55];
        bytes.push(len+1);
        bytes.push(0);
        bytes.push(1);

        for (var i=1; i<len; i++) {
            bytes.push(arguments[i]);
        }//for

        device.send(bytes);
    }//function getPackage

    // 수신 데이터 처리
    var _isParseStart = false;
    var _isParseStartIndex = 0;

    function processData(bytes) {
        var len=bytes.length;   // ArrayBuffer 데이터수
        if(_rxBuf.length > 30) _rxBuf=[];

        for (var index=0; index<len; index++) {
            var c= bytes[index];
            _rxBuf.push(c);

            if (_rxBuf.length >= 2) {
                if (_rxBuf[_rxBuf.length-1]==0x55 && _rxBuf[_rxBuf.length-2]==0xff) {
                    _isParseStart = true;
                    _isParseStartIndex = _rxBuf.length-2;
                }//if

                if (_rxBuf[_rxBuf.length-1]==0xa && _rxBuf[_rxBuf.length-2]==0xd && _isParseStart) {
                    _isParseStart = false;

                    var position = _isParseStartIndex+2;
                    var extId = _rxBuf[position];
                    position++;
                    var type = _rxBuf[position];
                    position++;

                    //1 byte, 2 float, 3 short, 4 len+string, 5 double
                    var value;
                    switch (type) {
                        case 1:
                            value = _rxBuf[position];
                            position++;
                            break;
                        case 2:
                            value = readFloat(_rxBuf, position);
                            position += 4;
                            if (value<-255 || value>1023) value=0;
                            break;
                        case 3:
                            value = readShort(_rxBuf, position);
                            position+=2;
                            break;
                        case 4:
                            var l = _rxBuf[position];
                            position++;
                            value = readString(_rxBuf, position, l);
                            break;
                        case 5:
                            value = readDouble(_rxBuf, position);
                            position +=4;
                            break;
                    }//switch

                    if (type <= 5) {
                        if (values[extId] != undefined) {
                            responseValue(extId, values[extId](value, extId));
                        } 
                        else {
                            responseValue(extId, value);
                        }

                        values[extId] = null;
                    }//if

                    _rxBuf=[];
                }//if
            }//if
        }//for
    }//function

    function readFloat(arr, position) {
        var f = [arr[position], arr[position+1], arr[position+2], arr[position+3]];
        return parseFloat(f);
    }//function

    function readShort(arr, position) {
        var s = [arr[postion], arr[postion+1]];
        return parseShort(s);
    }//furnction

    function readDouble(arr, position) {
        return readFloat(arr, position);
    }//function

    function readString(arr, position, len) {
        var value = "";
        for (var ii=0; ii<len; ii++) {
            value += String.fromCharCode(_rxBuf[ii+position]);
        }//for

        return value;
    }//function

    // Extension API interactions
    var potentialDevices = [];

    function tryNextDevice() {
        device = potentialDevices.shift();
        if (device) {
            // device.open()
            // options
            //- stopBits : The number of stop bits per character, default:1 (0: 1bit, 1:1.5bit, 2:2bit) 
            //- bitRate : Up to The bit (or baud) rate at which to communicate. default: 9600
            //- ctsFlowControl: The type of flow control to use. default:1 (0:none, 1:software, 2:hardware) 
            //- bufferSize: The maximum amount of data that can be received at a time. default: 4096 (~8192)
            //- dataBits: The number of data bits per character. default: 8 (5,6,7,8)
            //- parityBit: Whether and how to use the parity bit in each character. default:0 (0:none, 1:odd, 2:even)
            device.open({stopBits: 0, bitRate: 115200, ctsFlowControl: 0}, deviceOpened);
        }//if
    }//function

    var watchdog = null;
    function deviceOpened(dev) {
        if (!dev) {
            //opening the port failed
            tryNextDevice();
            return;
        }//if

        // 수신된 데이터를 처리하는 함수 등록
        device.set_receive_handler('coconut', processData); 
    }//function

    // 장치 연결 - serial
    ext._deviceConnected = function(dev) {
        potentialDevices.push(dev);

        if(!device) tryNextDevice();
    }//function

    // device connection stop
    ext._deviceRemoved = function(dev) {
        if(device != dev) return;
        device = null;
    }

    // extension 종료
    ext._shutdown = function() {
        if(device) device.close();
        device = null;
    }//function

    // 하드웨어 장치와 통신이 되었는지 여부
    ext._getStatus = function() {
        // status :  0 (red, error), 1 (yellow, not ready), 2 (green, ready)
        if(!device) return {status: 1, msg: 'coconut not connected'};
        if(watchdog) return {status: 1, msg: 'Probing for coconut'};

        return {status: 2, msg: 'coconut connected'};
    }
	
    //cooonut 용 short2array 생성
    function short2array(value) {
	for (var i =0; i<2; i++)
	{
	  var tempByte = value & 0xff;
	  tempBytes[i] = tempByte;
	  value = (value - tempByte) / 256;				
	}
	return [tempBytes[0], tempBytes[1]];
    }
    // Register the Extension 
    var descriptor = {};

    // ScrachExtension.register()
    // @param Example Name
    // @param descriptor_object
    // @param ext_instance
    // @param hardware_info or serial_info (optional)
    // 
    // hardware_info = {type: 'hid', vendor: 0x0694, product: 0x0003}
    // - vendor : 16진수 (0x0000)
    // - product : 16진수 (0x0000 , 제품ID
    // serial_info = {type: 'serial'}

    //coconut 용으로 변경을 위한 주석 처리 후 리턴값 삽입
    //ScratchExtensions.register("coconut", descriptor, ext, {type: 'serial'});
    return ext;

//coconut 용으로 변경을 위한 주석 처리
//})({}); 
})(this);