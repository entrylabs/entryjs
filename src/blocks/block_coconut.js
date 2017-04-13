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
        extA2 : 0,
        extA3 : 0,
    },
 setZero:function() {
  var sq = Entry.hw.sendQueue;
  sq.msgValue = [0xff, 0x55, 0x02, 0x00, 0x04];
  Entry.hw.update();
}, lineTracerModeId:0, lineTracerStateId:-1, tempo:60, timeouts:[], removeTimeout:function(a) {
  clearTimeout(a);
  var b = this.timeouts;
  a = b.indexOf(a);
  0 <= a && b.splice(a, 1);
}, removeAllTimeouts:function() {
  var a = this.timeouts, b;
  for (b in a) {
    clearTimeout(a[b]);
  }
  this.timeouts = [];
}, setLineTracerMode:function(a, b) {
  this.lineTracerModeId = this.lineTracerModeId + 1 & 255;
  a.lineTracerMode = b;
  a.lineTracerModeId = this.lineTracerModeId;
}, 
msgValue:0,
insertQueue:function(msg, sq){
    sq.msgValue = msg;
},
clearQueue:function(sq){
    sq.msgValue = "";
},

move:function(direction) {
if (typeof direction == "string") direction = directions[direction];
        // seq, direction, speed, degree, time
        return(runPackage(devices["Motor"], 0, direction, speed));
},
/* Scratch coconut Extension import */
speed: 60,
directions: {"Both": 0, "Left": 1, "Right": 2, "Forward": 3, "Backward": 4},
devices: {
    "LightSensor": 14,
    "Accelerometer": 18,
    "Temperature": 21,
    "Buzzer": 3,
    "IRdistance": 5,
    "Linetracer": 7,
    "IR": 9,
    "RGBled": 25,
    "Motor": 26,
    "LedMatrix": 27,
    "Digital": 30,
    "Analog": 31,
    "PWM": 32,
    "External": 40,
    "Speaker": 41,
    "ExtIR": 42,
    "ServoMotor": 43,
    "ExLed": 44,
    "ExtCds": 45
},
sharps: {"-": 0, "#": 1, "b": 2},
beats: { "Half": 500, "Quater": 250, "Eighth": 125, "Sixteenth": 63, "Thirty-second": 32, "Whole": 1000, "Dotted half": 750, "Dotted quarter": 375, "Dotted eighth": 188, "Dotted sixteenth": 95, "Dotted thirty-second": 48, "Double": 2000, "Zero": 0 },
melodys: {"Twinkle Twinkle little star": 1, "Three bears": 2, "Mozart's Lullaby": 3, "Do-Re-Mi": 4, "Butterfly": 5},
colors:{ "Black": 0, "White": 1, "Red": 2, "Green": 3, "Blue": 4, "Yellow": 5, "Cyan": 6, "Magenta": 7 },
// IR distance 감지조건
detectConds: {"Yes": 1, "No": 0},
/// 도트매트릭스 문자 
// 소문자
sLetters: {"a": 0, "b": 1, "c": 2, "d": 3, "e": 4, "f": 5, "g": 6, "h": 7, "i": 8, "j": 9, "k": 10, "l": 11, "m": 12, "n": 13, "o": 14, "p": 15, "q": 16, "r": 17, "s": 18, "t": 19, "u": 20, "v": 21, "w": 22, "x": 23, "y": 24, "z": 25},
// 대문자
cLetters: {"A": 0, "B": 1, "C": 2, "D": 3, "E": 4, "F": 5, "G": 6, "H": 7, "I": 8, "J": 9, "K": 10, "L": 11, "M": 12, "N": 13, "O": 14, "P": 15, "Q": 16, "R": 17, "S": 18, "T": 19, "U": 20, "V": 21, "W": 22, "X": 23, "Y": 24, "Z": 25},
// 한글
kLetters:{"ga": 0, "na": 1, "da": 2, "la": 3, "ma": 4, "ba": 5, "sa": 6, "aa": 7, "ja": 8, "cha": 9, "ka": 10, "ta": 11, "pa": 12, "ha": 13},
onOffs:{"On": 1, "Off": 0},
axiss:{ "X-Axis": 1, "Y-Axis": 2, "Z-Axis": 3 },
// external
pins:{"D4": 4, "D10": 10, "D11": 11, "D12": 12, "A2": 16, "A3": 17},
outputValues:{"HIGH": 1, "LOW": 0},

/**
 * @brief   모터 움직이기 - 전진/후진/좌회전/우회전
 * @details 기본 속도 적용, 시간제한 없음
 * @date    2016.04.27
 *
 * @param   direction     방향 (1: Left, 2: Right, 3: Forward, 4: Backward), default: Go
 */
moveMotor:function(direction) {
    if (typeof direction == "string") direction = this.directions[direction];
        // seq, direction, speed, degree, time
        return(this.runPackage(this.devices["Motor"], 0, direction, this.speed));
},

moveMotorSpeed:function(direction, speed) {
    if (typeof direction == "string") direction = this.directions[direction];
      // seq, direction, speed, degree, time
      return(this.runPackage(this.devices["Motor"], 0, direction, this.speed));
},

/**
 * @brief   모터 움직이기 - 좌회전/우회전
 * @details 기본 속도 적용, 시간제한 없음
 *
 * @param   direction     방향 (1: Left, 2: Right, 3: Forward, 4: Backward), default: Go
 */
turnMotor:function(direction) {
    if (typeof direction == "string") direction = this.directions[direction];
    // seq, direction, speed, degree, time
    return(this.runPackage(this.devices["Motor"], 0, direction, this.speed));
},

/**
 * @brief   모터 정지
 * @date    2016.06.23
 */
stopMotor:function() {
    return(this.runPackage(this.devices["Motor"], 1));
},

/**
 * @brief   좌측/우측으로 각도 만큼 돌기
 * @details 기본속도 적용, 정해진 각도만큼 회전후 정지
 * @todo    degree<0 반대방향 적용 여부 결정
 * @date    2016.04.27
 * @param   direction   방향 (1: Left, 2: Right), default: Left
 * @param   degree      회전각도 (0~360도), default: 90도
 */
moveTurnAngle:function(direction, degree) {
    var sec = 0;         // 제한없음

    if (typeof direction == "string") direction = this.directions[direction];
            
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
moveGoTime:function(direction, sec) {
    // 시간이 0보다 작으면 양수로 변환
    if (sec < 0) sec = -sec;
    sec = 1000 * sec; // ms 변환

    if (typeof direction == "string") direction = this.directions[direction];

    // seq, direction, speed, degree, time
    return(this.runPackage(this.devices["Motor"], 3, direction, this.speed, this.short2array(sec)));
},

/**
 * @brief 좌/우회전 - 시간
 * @details 기본속도 적용 
 *
 * @param direction 방향 (1: Left, 2: Right), default: Go
 * @param sec 시간 (초), default: 1초
 */
turnMotorTime:function(direction, sec) {
    // 시간이 0보다 작으면 양수로 변환
    if (sec < 0) sec = -sec;
    sec = 1000 * sec; // ms 변환

    if (typeof direction == "string") direction = this.directions[direction];

    return(this.runPackage(this.devices["Motor"], 3, direction, this.speed, this.short2array(sec)));
},

/**
 * @brief 좌/우측 무한 회전하는 동안 RGB LED 켜기
 *
 * @paramdirection 방향 (1: Left, 2: Right), default: Left
 * @paramcolor RGB LED 색상 (1: Red, 2: Green, 3: Blue), default: Red
 */
moveMotorColor:function(direction, color) {
    var deviceID = this.devices["Motor"];

    if (typeof direction == "string") direction = this.directions[direction];
    if (typeof color == "string") color = this.colors[color];

    // deviceid, seq, direction, speed, color
    return(this.runPackage(deviceID, 5, direction, this.speed, color));
},

/**
 * @brief 좌/우측 각도에 따라 회전하는 동안 RGB LED 켜기
 * @todo각도 설정 불가, 추후 삭제
 * 
 * @param direction 방향 (1: Left, 2: Right), default: Left
 * @param angle 회전각도 (0~360도)
 * @param color RGB LED 색상 (1: Red, 2: Green, 3: Blue), default: Red
 */
moveMotorAngleColor:function(direction, angle, color) {
    var deviceID = this.devices["Motor"];

    if (typeof direction == "string") direction = this.directions[direction];
    if (typeof color == "string") color = this.colors[color];
    if (typeof angle != "number") angle = 90;

    // deviceid, seq, direction, speed, angle, time, color
    return(this.runPackage(deviceID, 6, direction, this.short2array(0), this.short2array(angle), this.short2array(0), color));
},

/**
 * @brief control external motor
 * 
 * @param direction 방향 (1: Left, 2: Right, 3: Forward, 4: Backward), default: Go
 * @param speed 속도 (0-255)
 */
moveExtMotor:function (direction, speed) {
    if (typeof direction == "string") direction = this.directions[direction];

    // deviceid, seq, direction, speed
    return(this.runPackage(this.devices["Motor"], 7, direction, speed));
},

/**
 * @brief RGB LED 켜기 - 방향, 색상 선택
 * @details 시간제한 없음, seq=0
 *
 * @date2016.04.28
 * @param direction 방향 (0: both, 1: Left, 2: Right), default: Left
 * @param color 색상 (1: Red, 2: Green, 3: Blue), default: Red
 */
rgbOn:function(direction, color) {
    if (typeof direction == "string") direction = this.directions[direction];
    if (typeof color == "string") color = this.colors[color];

    return(this.runPackage(this.devices["RGBled"], 0, direction, color));
},

/**
 * @brief RGB LED 끄기 - 방향
 * @details 시간제한 없음, seq=1
 *
 * @param direction방향 (0: all, 1: Left, 2: Right), default: Left
 */
rgbOff:function(direction) {
    if (typeof direction == "string") direction = this.directions[direction];

    return(this.runPackage(this.devices["RGBled"], 1, direction, 0));
},

/**
 * @brief RGB LED 끄기 - 방향, 색상
 * @details seq=2
 * @date2016.05.30
 * 
 * @param direction 방향 (0: all, 1: Left, 2: Right), default: Left
 * @param color 색상 (1: Red, 2: Green, 3: Blue), default: Red
 */
rgbOffColor:function(direction, color) {
    if (typeof direction == "string") direction = this.directions[direction];
    if (typeof color == "string") color = this.colors[color];

    return(this.runPackage(this.devices["RGBled"], 1, direction, color));
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
ledOnTime:function(direction, color, sec) {
    if (typeof direction == "string") direction = this.directions[direction];
    if (typeof color == "string") color = this.colors[color];

// 시간이 정수가 아니거나 0보다 작을 경우 0으로 변경
    if (typeof sec != "number") sec = 0;
    else if (sec < 0) sec = 0;
    else sec *= 1000; // ms 변환

    return(this.runPackage(this.devices["RGBled"], 3, direction, color, this.short2array(sec)));
},

/// buzzer
/**
 * @brief 스피커 켜기
 * @details 버저음을 기본 주파수 c4 로 짧게 소리낸다. 
 */
beep:function() {
    return((this.buzzerControl(0, 262, 50)));
// 
},

/**
 * @brief 버저음을 seconds 동안 소리내기 (기본주파수)
 * @details 기본주파수 : c4 (도)
 * @date2015.04.26
 * @param sec 연주시간 (seconds, 초) 
 */
playBuzzerTime:function(sec) {
    // 시간이 숫자가 아니거나 0보다 작을 경우 0.5초로 고정
    if (typeof sec != "number") sec = 0.5;
    if (sec < 0) sec = 0.5;

    sec = 1000 * sec;// milliseconds 변환

    return(this.buzzerControl(0, 262, sec));
},

/**
 * @brief 버저음 freq hz를 seconds 초 동안 소리내기
 * @date2016.04.26
 * @param freq주파수 hz
 * @param sec 연주시간 (seconds, 초) 
 */
playBuzzerFreq:function(freq, sec) {
    // 시간이 숫자가 아니거나 0보다 작을 경우 0.5초로 고정
    if (typeof sec != "number") sec = 0.5;
    if (sec < 0) sec = 0.5;

    sec = 1000 * sec;// milliseconds 변환

    // 주파수가 숫자가 아니거나 0보다 작을 경우 300hz로 고정
    if (typeof freq != "number") freq = 300;
    if (freq < 0) freq = 300;

    return(this.buzzerControl(0, freq, sec));
},

/**
 * @brief 버저 끄기
 * @details tone = 0 일 경우 버저 끄기 실행
 */
buzzerOff:function() {
// tone=0, beat=0
    return((this.buzzerControl(0, 0, 0)));
},

/** 
 * @brief 버저 tone 음을 beat 박자로 실행
 * @param note음계
 * @param octave옥타브
 * @param beat박자
 */
playBuzzerNote:function(note, octave, beat) {

    // note 에서 `NOTE_` 다음 문자열만 추출
    //var arrNote = note.split("NOTE_",2);
    note = this.getNote(note);

    if (typeof beat == "string") beat = this.beats[beat];

    // note ascii 코드로 변환하여 전송
    return(this.runPackage(devices["Buzzer"], 2, note.charCodeAt(0), octave, this.short2array(beat)));
},

/**
 * @brief 버저 tone 음을 beat 박자로 실행
 * @param note음계
 * @param octave옥타브
 * @param sharp 올림표/내림표 (-:0, #:1, b:2)
 * @param beat박자
 */
playNote:function(note, octave, sharp, beat) {

    // note 에서 `NOTE_` 다음 문자열만 추출
    note = this.getNote(note);
    if (typeof beat == "string") beat = this.beats[beat];
    return(this.runPackage(this.devices["Buzzer"], 4, note.charCodeAt(0), octave, sharp.charCodeAt(0), this.short2array(beat)));
},

/**
 * @brief 음계 문자 추출
 * @param note음계 (eg. NOTE_C)
 */
getNote:function(note) {
    // note 에서 `NOTE_` 다음 문자열만 추출
    var arrNote = note.split("_");

    return arrNote[1];
},

/**
 * @brief 박자 쉬기
 * @param beat박자
 */
restBeat:function(beat) {
    if (typeof beat == "string") {
    // Half_rest 에서 `_` 앞 문자열만 추출하여 박자 설정
    var arrBeat = beat.split("_", 1);
    beat = this.beats[arrBeat]; 
    }

    return(this.buzzerControl(1, 0, beat));
},

/** 
 * @brief 버저 tone+octave 음을 beat 박자로 실행시 LED 켜기
 * @paramnote
 * @paramoctave
 * @parambeat
 * @paramcolor 색상 (1: Red, 2: Green, 3: Blue), default: Red
 */
playBuzzerColor:function(note, octave, beat, color) {
    // note 에서 `NOTE_` 다음 문자열만 추출
    //var arrNote = note.split("NOTE_",2);
    note = this.getNote(note);

    if (typeof beat == "string") beat = this.beats[beat];
    if (typeof color == "string") color = this.colors[color];

    return(this.runPackage(this.devices["Buzzer"], 3, note.charCodeAt(0), octave, this.short2array(beat), color));
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
playNoteColor:function(note, octave, sharp, beat, direction, color) {
    // note 에서 `NOTE_` 다음 문자열만 추출
    note = this.getNote(note);

    if (typeof beat == "string") beat = this.beats[beat];
    if (typeof direction == "string") direction = this.directions[direction];
    if (typeof color == "string") color = this.colors[color];

    return(this.runPackage(this.devices["Buzzer"], 5, note.charCodeAt(0), octave, sharp.charCodeAt(0), this.short2array(beat), direction, color));
},

/**
 * @brief 멜로디 연주하기
 * @param melody멜로디 (1:작은별, 2:곰세마리, 3:자장가, 4:도레미송, 5:나비야)
 */
playMelody:function(melody) {
    if (typeof melody == "string") melody = this.melodys[melody];
    return(this.runPackage(this.devices["Buzzer"], 6, melody));
},

/**
 * @brief 버저 제어
 * @details 
 * @param seq 순번 (0: 연주, 1: 박자쉬기, 2: 음표 연주)
 * @param tone주파수
 * @param beat박자
 * @param note음표
 */
buzzerControl:function(seq, tone, beat) {
    var deviceID = this.devices["Buzzer"];

    if (typeof beat == "string") beat = this.beats[beat];

    return(this.runPackage(deviceID, seq, this.short2array(tone), this.short2array(beat)));
},

// led blink
runBlink:function() {
    var pin = 13;
    return(this.runPackage(30, pin));
},

/**
 * @brief 선 따라가기, level=5 (default)
 */
followLine:function() {
    return(this.runPackage(this.devices["Linetracer"], 3, this.speed));
},

/**
 * @brief 선 따라가기, 속도 설정
 */
followLineLevel:function(level, speed) {
    if (typeof speed != "number") speed = 70;
    return(this.runPackage(this.devices["Linetracer"], 3, level, speed));
},

/**
 * @brief 장애물 감지 기준 변경
 * @date2016.05.24
 *
 * @param direction 방향, default Left (1: Left, 2: Right)
 * @param standard감지 기준
 */
setStandard:function(direction, standard) {
    if (typeof direction == "string") direction = this.directions[direction];
    return(this.runPackage(this.devices["IRdistance"], 0, direction, standard));
},

/**
 * @brief 어보이드 모드
 */
avoidMode:function() {
    return(this.runPackage(this.devices["IRdistance"], 3));
},

/// LED Matrix
/**
 * @brief Led Matrix 행열 켜기
 * 
 * @param row 행 번호, 0-8 (Both=0)
 * @param col 열 번호, 0-8 (Both=0)
 * @param onOff on=1, off=0
 */
ledMatrixOn:function(onOff, row, col) {
    if (typeof onOff == "string") onOff = this.onOffs[onOff];
    if ((typeof row=="string") && (row=="Both")) row = 0; 
    if ((typeof col=="string") && (col=="Both")) col = 0; 

    return(this.runPackage(this.devices["LedMatrix"], 0, row, col, onOff));
},

/**
 * @brief Led Matrix 행열 끄기
 * 
 * @param row 행 번호
 * @param col 열 번호
 */
ledMatrixOff:function (row, col) {
    return(this.runPackage(this.devices["LedMatrix"], 0, row, col, 0));
},

/**
 * @brief Led Matrix 모두 끄기
 */
ledMatrixClear:function() {
    return(this.runPackage(this.devices["LedMatrix"], 5));// seq=5
},

/**
 * @brief Led Matrix 모두 켜기
 */
ledMatrixOnAll:function() {
    return(this.runPackage(this.devices["LedMatrix"], 6));// seq=6
},

/**
 * @brief Led Matrix 숫자 표시
 * 
 * @param code 숫자 (0-9)
 */
showLedMatrix:function (code) {
    return(this.runPackage(this.devices["LedMatrix"], 1, code));
},

/**
 * @brief Led Matrix 영문 소문자 표시
 * 
 * @param code 소문자 (a-z)
 */
showLedMatrixSmall:function (code) {
    if (typeof code == "string") code = this.sLetters[code];
    return(this.runPackage(this.devices["LedMatrix"], 2, code));
},

/**
 * @brief Led Matrix 영문 대문자 표시
 * 
 * @param code 대문자(A-Z)
 */
showLedMatrixLarge:function (code) {
    if (typeof code == "string") code = this.cLetters[code];
    return(this.runPackage(this.devices["LedMatrix"], 3, code));
},

/**
 * @brief Led Matrix 한글 표시
 * 
 * @param code 한글 (가-하)
 */
showLedMatrixKorean:function (code) {
    if (typeof code == "string") code = this.kLetters[code];
    return(this.runPackage(this.devices["LedMatrix"], 4, code));
},

/// IR
/**
 * @brief IR 메시지 보내기
 *
 * @param message 전송할 문자열
 */
sendMessage:function(message) {
    return(this.runPackage(this.devices["IR"], this.string2array(message)));
},

/**
 * @brief 외부 LED on/off
 *
 * @param pin 디지털 핀번호
 * @param sec 시간 (ms)
 */
extLedOn:function(pin, sec) {
    if (typeof pin == "string") pin = this.pins[pin];
    sec *= 1000;
    return(this.runPackage(this.devices["ExLed"], pin, this.short2array(sec)));
},

/**
 * @brief 외부 speaker 소리내기
 *
 * @param pin pwm 핀번호
 * @param freq주파수
 * @param duration시간 (ms)
 */
playSpeaker:function(pin, freq, duration) {
    if (typeof pin == "string") pin = this.pins[pin];
    duration *= 1000;
    return(this.runPackage(this.devices["Speaker"], pin, this.short2array(freq), this.short2array(duration)));
},

/**
 * @brief 외부 speaker 끄기
 *
 * @param pin pwm 핀번호
 */
stopSpeaker:function(pin) {
    if (typeof pin == "string") pin = this.pins[pin];
    return(this.runPackage(this.devices["Speaker"], pin, this.short2array(0), this.short2array(0)));
}, 

/**
 * @brief run servo motor
 *
 * @param pin pwm pins (D10, D11)
 * @param angle 0~180
 */
runExtServo:function(pin, angle) {
    if (typeof pin == "string") pin = this.pins[pin];
    return(this.runPackage(this.devices["ServoMotor"], pin, angle));
},

/**
 * @brief 디지털 출력 설정
 * @date2016.05.19
 *
 * @param pin 디지털 핀번호
 * @param outputValue 출력값 (HIGH:1, LOW:0)
 */
digitalWrite:function (pin, outputValue) {
    if (typeof outputValue == "string") outputValue = this.outputValues[outputValue];
    return(this.runPackage(this.devices["Digital"], pin, outputValue));
},

/**
 * @brief 아날로그 출력 설정
 * @date2016.05.19
 * 
 * @param pin 아날로그 핀번호
 * @param duty듀티사이클 (0~255)
 */
analogWrite:function (pin, duty) {
    if (typeof duty != "number") {
        duty = 0;
    }
    // 듀티사이클이 255를 넘길경우 255로 설정 (100%)
    else if (duty > 255) { 
        duty = 255;
    }//if

    return(this.runPackage(this.devices["Analog"], pin, duty));
},

 readFloat:function(arr, position) {
    var f = [arr[position], arr[position+1], arr[position+2], arr[position+3]];
    return parseFloat(f);
},//function

readShort:function(arr, position) {
    var s = [arr[postion], arr[postion+1]];
    return parseShort(s);
},//furnction

readDouble:function(arr, position) {
    return readFloat(arr, position);
},//function

readString:function(arr, position, len) {
    var value = "";
    for (var ii=0; ii<len; ii++) {
        value += String.fromCharCode(_rxBuf[ii+position]);
    }//for

    return value;
},//function

short2array:function(value) {
    var tempBytes = {};
    for (var i =0; i<2; i++)
    {
        var tempByte = value & 0xff;
        tempBytes[i] = tempByte;
        value = (value - tempByte) / 256;
    }
    return [tempBytes[0], tempBytes[1]];
},

runPackage:function() {
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

    bytes[2] = bytes.length-3;// data length

    // 장치에 ArrayBuffer data 전송
    //device.send(bytes);
    return bytes;
},
/* Scratch coconut Extension import */

name:"coconut", 
monitorTemplate: {
        imgPath: "hw/coconut.png",
        width: 256,
        height: 256,
        listPorts:{
            "temperature":{name: Lang.Blocks.coconut_sensor_temperature, type: "input", pos: {x: 0, y: 0}},
            "accelerationX":{name: Lang.Blocks.coconut_sensor_acceleration_x, type: "input", pos: {x: 0, y: 0}},
            "accelerationY":{name: Lang.Blocks.coconut_sensor_acceleration_y, type: "input", pos: {x: 0, y: 0}},
            "accelerationZ":{name: Lang.Blocks.coconut_sensor_acceleration_z, type: "input", pos: {x: 0, y: 0}},
        },
        ports: {
            "leftProximityValue":{name: Lang.Blocks.coconut_sensor_left_proximity, type: "input", pos: {x: 122, y: 156}},
            "rightProximityValue":{name: Lang.Blocks.coconut_sensor_right_proximity, type: "input", pos: {x : 10, y: 108}},
            "leftFloorValue":{name: Lang.Blocks.coconut_sensor_left_floor, type: "input", pos: {x: 100, y: 234}},
            "rightFloorValue":{name: Lang.Blocks.coconut_sensor_right_floor, type: "input", pos: {x: 13, y: 180}},
            "light":{name: Lang.Blocks.coconut_sensor_light, type: "input", pos: {x: 56, y: 189}},
        },
      mode : 'both'
    }
};
