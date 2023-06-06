'use strict';

Entry.Robotis_carCont = {
    INSTRUCTION: {
        NONE: 0,
        WRITE: 3,
        READ: 2,
    },
    CONTROL_TABLE: {
        // [default address, default length, address (when reads together), length (when reads together)]
        CM_LED: [67, 1],
        CM_SPRING_RIGHT: [69, 1, 69, 2],
        CM_SPRING_LEFT: [70, 1, 69, 2],
        CM_SWITCH: [71, 1],
        CM_SOUND_DETECTED: [86, 1],
        CM_SOUND_DETECTING: [87, 1],
        CM_IR_LEFT: [91, 2, 91, 4],
        CM_IR_RIGHT: [93, 2, 91, 4],
        CM_CALIBRATION_LEFT: [95, 2],
        CM_CALIBRATION_RIGHT: [97, 2],

        AUX_MOTOR_SPEED_LEFT: [152, 2], // car_cont
        AUX_MOTOR_SPEED_RIGHT: [154, 2],
    },
    setZero: function() {
        // instruction / address / length / value / default length
        Entry.hw.sendQueue['setZero'] = [1];
        this.update();
        this.setRobotisData(null);
        Entry.hw.sendQueue['setZero'] = null;
        this.update();
        this.setRobotisData([
            [Entry.Robotis_carCont.INSTRUCTION.WRITE, 152, 2, 0],
            [Entry.Robotis_carCont.INSTRUCTION.WRITE, 154, 2, 0],
        ]);

        this.update();
    },
    id: '7.1',
    name: 'robotis_carCont',
    url: 'http://www.robotis.com/index/product.php?cate_code=111310',
    imageName: 'robotis_carCont.png',
    title: {
        ko: '로보티즈 로봇자동차',
        en: 'Robotis Robot car',
    },
    delay: 40,
    postCallReturn: function(script, data, ms) {
        if (ms <= 0) {
            this.setRobotisData(data);
            this.update();
            return script.callReturn();
        }

        Entry.hw.portData = {};
        setTimeout(function() {
            Entry.hw.sendQueue = {}
           // Entry.hw.portData = {};
        }, ms - 100);

        setTimeout(function() {
            Entry.hw.sendQueue = {}
            //Entry.hw.portData = {};
        }, ms);

        setTimeout(function() {
            Entry.hw.sendQueue = {}
            //Entry.hw.portData = {};
        }, ms + 100);

        setTimeout(function() {
            Entry.hw.sendQueue = {}
           // Entry.hw.portData = {};
        }, ms + 200);

        if (!script.isStart) {
            script.isStart = true;
            script.timeFlag = 1;
            //data setting
            this.setRobotisData(data);
            this.update();

            //delay xx ms
            setTimeout(function() {
                script.timeFlag = 0;
                
            }, ms);

            return script;
        } else if (script.timeFlag == 1) {
            this.setRobotisData(null);
            this.update();
            return script;
        } else {
            delete script.timeFlag;
            delete script.isStart;
            Entry.engine.isContinue = false;
            this.update();
            return script.callReturn();
        }
    },
    wait: function(sq, ms) {
        Entry.hw.socket.send(JSON.stringify(sq));

        var start = new Date().getTime();
        var end = start;
        while (end < start + ms) {
            //wait XX ms
            end = new Date().getTime();
        }
    },
    update: function() {
        Entry.hw.update();
        var ROBOTIS_DATA = Entry.hw.sendQueue['ROBOTIS_DATA'];
        if (ROBOTIS_DATA) {
            ROBOTIS_DATA.forEach(function(data) {
                data['send'] = true;
            });
        }
        this.setRobotisData(null);
    },
    filterSendData: function() {
        var ROBOTIS_DATA = Entry.hw.sendQueue['ROBOTIS_DATA'];
        if (ROBOTIS_DATA) {
            return ROBOTIS_DATA.filter(function(data) {
                return data.send !== true;
            });
        } else {
            return null;
        }
    },
    setRobotisData: function(data) {
        var filterData = this.filterSendData();
        if (data == null) {
            Entry.hw.sendQueue['ROBOTIS_DATA'] = filterData;
        } else {
            Entry.hw.sendQueue['ROBOTIS_DATA'] = filterData ? filterData.concat(data) : data;
        }
    },
};

Entry.Robotis_openCM70 = {
    hasPracticalCourse: true,
    INSTRUCTION: {
        NONE: 0,
        WRITE: 3,
        READ: 2,
    },
    CONTROL_TABLE: {
        // [default address, default length, address (when reads together), length (when reads together)]
        CM_LED_R: [79, 1],
        CM_LED_G: [80, 1],
        CM_LED_B: [81, 1],
        CM_BUZZER_INDEX: [84, 1],
        CM_BUZZER_TIME: [85, 1],
        CM_SOUND_DETECTED: [86, 1],
        CM_SOUND_DETECTING: [87, 1],
        CM_USER_BUTTON: [26, 1],
        CM_MOTION: [66, 1],
        CM_AUTODRIVE: [40, 1],
        CM_AUTODRIVE_LEFT_MOTOR_PORT: [42, 1],
        CM_AUTODRIVE_RIGHT_MOTOR_PORT: [43, 1],
        CM_AUTODRIVE_LEFT_IR_PORT: [44, 1],
        CM_AUTODRIVE_RIGHT_IR_PORT: [45, 1],
        CM_POWEROFF_TIMER: [76, 1],

        AUX_SERVO_POSITION: [152, 2],
        AUX_IR: [168, 2],
        AUX_TOUCH: [202, 1],
        AUX_TEMPERATURE: [234, 1],
        AUX_ULTRASONIC: [242, 1],
        AUX_MAGNETIC: [250, 1],
        AUX_MOTION_DETECTION: [258, 1],
        AUX_COLOR: [266, 1],
        AUX_CUSTOM: [216, 2],
        AUX_BRIGHTNESS: [288, 2],
        AUX_HYDRO_THEMO_HUMIDITY: [274, 1],
        AUX_HYDRO_THEMO_TEMPER: [282, 1],

        AUX_SERVO_MODE: [126, 1],
        AUX_SERVO_SPEED: [136, 2],
        AUX_MOTOR_SPEED: [136, 2],
        AUX_LED_MODULE: [210, 1],
    },
    IRS_MODULEWRITE: {
        PORT3: false,
        PORT4: false,
        PORT5: false,
        PORT6: false,
    },
    SERVO_MODULEWRITE: {
        PORT3: false,
        PORT4: false,
        PORT5: false,
        PORT6: false,
    },
    setZero: function() {
        // instruction / address / length / value / default length
        Entry.hw.sendQueue['setZero'] = [1];
        Entry.Robotis_carCont.update();
        Entry.Robotis_carCont.setRobotisData(null);
        Entry.hw.sendQueue['setZero'] = null;
        Entry.Robotis_carCont.update();
        Entry.Robotis_carCont.setRobotisData([
            /*[Entry.Robotis_openCM70.INSTRUCTION.WRITE, 136, 2, 0],
            [Entry.Robotis_openCM70.INSTRUCTION.WRITE, 138, 2, 0],
            [Entry.Robotis_openCM70.INSTRUCTION.WRITE, 140, 2, 0],
            [Entry.Robotis_openCM70.INSTRUCTION.WRITE, 142, 2, 0],
            [Entry.Robotis_openCM70.INSTRUCTION.WRITE, 144, 2, 0],
            [Entry.Robotis_openCM70.INSTRUCTION.WRITE, 146, 2, 0],*/
            [Entry.Robotis_openCM70.INSTRUCTION.WRITE, 136, 12, 0],
            [Entry.Robotis_openCM70.INSTRUCTION.WRITE, 79, 3, 0],
            /*[Entry.Robotis_openCM70.INSTRUCTION.WRITE, 79, 1, 0],
            [Entry.Robotis_openCM70.INSTRUCTION.WRITE, 80, 1, 0],
            [Entry.Robotis_openCM70.INSTRUCTION.WRITE, 81, 1, 0],*/
            [Entry.Robotis_openCM70.INSTRUCTION.WRITE, 86, 1, 0], // 최종 소리 // add by kjs start 170605
            [Entry.Robotis_openCM70.INSTRUCTION.WRITE, 108, 4, 0],
            /*[Entry.Robotis_openCM70.INSTRUCTION.WRITE, 108, 1, 0], // port 3
            [Entry.Robotis_openCM70.INSTRUCTION.WRITE, 109, 1, 0], // port 4
            [Entry.Robotis_openCM70.INSTRUCTION.WRITE, 110, 1, 0], // port 5
            [Entry.Robotis_openCM70.INSTRUCTION.WRITE, 111, 1, 0] // port 6 // add by kjs end 170605*/
        ]);

        Entry.Robotis_carCont.update();

        Entry.Robotis_openCM70.IRS_MODULEWRITE.PORT3 = false;
        Entry.Robotis_openCM70.IRS_MODULEWRITE.PORT4 = false;
        Entry.Robotis_openCM70.IRS_MODULEWRITE.PORT5 = false;
        Entry.Robotis_openCM70.IRS_MODULEWRITE.PORT6 = false;

        Entry.Robotis_openCM70.SERVO_MODULEWRITE.PORT3 = false;
        Entry.Robotis_openCM70.SERVO_MODULEWRITE.PORT4 = false;
        Entry.Robotis_openCM70.SERVO_MODULEWRITE.PORT5 = false;
        Entry.Robotis_openCM70.SERVO_MODULEWRITE.PORT6 = false;
        /*
        Entry.hw.sendQueue['temp'] = [0];
        Entry.Robotis_carCont.update();
        Entry.hw.sendQueue['temp'] = null;*/
        //Entry.Robotis_carCont.update();
    },
    id: '7.2',
    name: 'robotis_openCM70',
    url: 'http://www.robotis.com/index/product.php?cate_code=111310',
    imageName: 'robotis_openCM70.png',
    title: {
        ko: '로보티즈 IoT',
        en: 'Robotis Open CM70',
    },
    delay: 15,
    readDelay: 30
};

Entry.Robotis_openCM70EDU = {
    hasPracticalCourse: true,
    INSTRUCTION: {
        NONE: 0,
        WRITE: 3,
        READ: 2,
    },
    CONTROL_TABLE: {
        // [default address, default length, address (when reads together), length (when reads together)]
        CM_LED_R: [79, 1],
        CM_LED_G: [80, 1],
        CM_LED_B: [81, 1],
        CM_BUZZER_INDEX: [84, 1],
        CM_BUZZER_TIME: [85, 1],
        CM_SOUND_DETECTED: [86, 1],
        CM_SOUND_DETECTING: [87, 1],
        CM_USER_BUTTON: [26, 1],
        CM_MOTION: [66, 1],
        CM_AUTODRIVE: [40, 1],
        CM_AUTODRIVE_LEFT_MOTOR_PORT: [42, 1],
        CM_AUTODRIVE_RIGHT_MOTOR_PORT: [43, 1],
        CM_AUTODRIVE_LEFT_IR_PORT: [44, 1],
        CM_AUTODRIVE_RIGHT_IR_PORT: [45, 1],
        CM_POWEROFF_TIMER: [76, 1],

        AUX_SERVO_POSITION: [152, 2],
        AUX_IR: [168, 2],
        AUX_TOUCH: [202, 1],
        AUX_TEMPERATURE: [234, 1],
        AUX_ULTRASONIC: [242, 1],
        AUX_MAGNETIC: [250, 1],
        AUX_MOTION_DETECTION: [258, 1],
        AUX_COLOR: [266, 1],
        AUX_CUSTOM: [216, 2],
        AUX_BRIGHTNESS: [288, 2],
        AUX_HYDRO_THEMO_HUMIDITY: [274, 1],
        AUX_HYDRO_THEMO_TEMPER: [282, 1],

        AUX_SERVO_MODE: [126, 1],
        AUX_SERVO_SPEED: [136, 2],
        AUX_MOTOR_SPEED: [136, 2],
        AUX_LED_MODULE: [210, 1],
    },
    IRS_MODULEWRITE: {
        PORT3: false,
        PORT4: false,
        PORT5: false,
        PORT6: false,
    },
    SERVO_MODULEWRITE: {
        PORT3: false,
        PORT4: false,
        PORT5: false,
        PORT6: false,
    },
    setZero: function() {
        // instruction / address / length / value / default length
        Entry.hw.sendQueue['setZero'] = [1];
        Entry.Robotis_carCont.update();
        Entry.Robotis_carCont.setRobotisData(null);
        Entry.hw.sendQueue['setZero'] = null;
        Entry.Robotis_carCont.update();
        Entry.Robotis_carCont.setRobotisData([
            /*[Entry.Robotis_openCM70.INSTRUCTION.WRITE, 136, 2, 0],
            [Entry.Robotis_openCM70.INSTRUCTION.WRITE, 138, 2, 0],
            [Entry.Robotis_openCM70.INSTRUCTION.WRITE, 140, 2, 0],
            [Entry.Robotis_openCM70.INSTRUCTION.WRITE, 142, 2, 0],
            [Entry.Robotis_openCM70.INSTRUCTION.WRITE, 144, 2, 0],
            [Entry.Robotis_openCM70.INSTRUCTION.WRITE, 146, 2, 0],*/
            [Entry.Robotis_openCM70EDU.INSTRUCTION.WRITE, 136, 12, 0],
            [Entry.Robotis_openCM70EDU.INSTRUCTION.WRITE, 79, 3, 0],
            /*[Entry.Robotis_openCM70.INSTRUCTION.WRITE, 79, 1, 0],
            [Entry.Robotis_openCM70.INSTRUCTION.WRITE, 80, 1, 0],
            [Entry.Robotis_openCM70.INSTRUCTION.WRITE, 81, 1, 0],*/
            [Entry.Robotis_openCM70EDU.INSTRUCTION.WRITE, 86, 1, 0], // 최종 소리 // add by kjs start 170605
            [Entry.Robotis_openCM70EDU.INSTRUCTION.WRITE, 108, 4, 0],
            /*[Entry.Robotis_openCM70.INSTRUCTION.WRITE, 108, 1, 0], // port 3
            [Entry.Robotis_openCM70.INSTRUCTION.WRITE, 109, 1, 0], // port 4
            [Entry.Robotis_openCM70.INSTRUCTION.WRITE, 110, 1, 0], // port 5
            [Entry.Robotis_openCM70.INSTRUCTION.WRITE, 111, 1, 0] // port 6 // add by kjs end 170605*/
        ]);

        Entry.Robotis_carCont.update();

        Entry.Robotis_openCM70EDU.IRS_MODULEWRITE.PORT3 = false;
        Entry.Robotis_openCM70EDU.IRS_MODULEWRITE.PORT4 = false;
        Entry.Robotis_openCM70EDU.IRS_MODULEWRITE.PORT5 = false;
        Entry.Robotis_openCM70EDU.IRS_MODULEWRITE.PORT6 = false;

        Entry.Robotis_openCM70EDU.SERVO_MODULEWRITE.PORT3 = false;
        Entry.Robotis_openCM70EDU.SERVO_MODULEWRITE.PORT4 = false;
        Entry.Robotis_openCM70EDU.SERVO_MODULEWRITE.PORT5 = false;
        Entry.Robotis_openCM70EDU.SERVO_MODULEWRITE.PORT6 = false;

        Entry.Robotis_openCM70.IRS_MODULEWRITE.PORT3 = false;
        Entry.Robotis_openCM70.IRS_MODULEWRITE.PORT4 = false;
        Entry.Robotis_openCM70.IRS_MODULEWRITE.PORT5 = false;
        Entry.Robotis_openCM70.IRS_MODULEWRITE.PORT6 = false;

        Entry.Robotis_openCM70.SERVO_MODULEWRITE.PORT3 = false;
        Entry.Robotis_openCM70.SERVO_MODULEWRITE.PORT4 = false;
        Entry.Robotis_openCM70.SERVO_MODULEWRITE.PORT5 = false;
        Entry.Robotis_openCM70.SERVO_MODULEWRITE.PORT6 = false;
        /*
        Entry.hw.sendQueue['temp'] = [0];
        Entry.Robotis_carCont.update();
        Entry.hw.sendQueue['temp'] = null;*/
        //Entry.Robotis_carCont.update();
    },
    monitorTemplate: {
        imgPath: 'hw/robotis_opencm70.png',
        width: 800,
        height: 800,
        listPorts: {
            DETECTEDSOUNDE: { name: '최종소리', type: 'input', pos: { x: 0, y: 0 } },
            DETECTINGSOUNDE1: { name: '실시간소리', type: 'input', pos: { x: 0, y: 0 } },
            //SND: { name: Lang.Hw.buzzer, type: 'output', pos: { x: 0, y: 0 } },
            //FND: { name: '전원', type: 'output', pos: { x: 0, y: 0 } },
        },
        ports: {
            USERBUTTONSTATE: { name: 'USERBUTTON', type: 'input', pos: { x: 565, y: 335 } },
            //'LEDR': { name: 'R', type: 'input', pos: { x: 140, y: 300 } },
            //'LEDG': { name: 'G', type: 'input', pos: { x: 170, y: 300 } },
            //'LEDB': { name: 'B', type: 'input', pos: { x: 200, y: 300 } },
            //'GM1': { name: 'GEARD1', type: 'input', pos: { x: 450, y: 300 } },
            //'GM2': { name: 'GEARD2', type: 'input', pos: { x: 450, y: 480 } },
            MONITORPORT0: { name: 'PORT3', type: 'input', pos: { x: 320, y: 320 } },
            MONITORPORT1: { name: 'PORT4', type: 'input', pos: { x: 330, y: 330 } },
            MONITORPORT2: { name: 'PORT5', type: 'input', pos: { x: 320, y: 440 } },
            MONITORPORT3: { name: 'PORT6', type: 'input', pos: { x: 330, y: 460 } },
        },
        mode: 'both',
    },
    id: '7.3',
    name: 'robotis_openCM70EDU',
    url: 'http://www.robotis.com/index/product.php?cate_code=111310',
    imageName: 'robotis_openCM70EDU.png',
    title: {
        ko: '로보티즈 실과',
        en: 'ROBOTIS InfoRobot',
    },
    delay: 15,
};

Entry.Robotis_carCont.blockMenuBlocks = [
    'robotis_carCont_sensor_value',
    'robotis_carCont_cm_led',
    'robotis_carCont_cm_sound_detected_clear',
    'robotis_carCont_aux_motor_speed',
    'robotis_carCont_aux_motor_speed2',
    'robotis_carCont_cm_calibration',
];

Entry.Robotis_carCont.setLanguage = function() {
    return {
        ko: {
            template: {
                robotis_carCont_sensor_value: '%1   값',
                robotis_carCont_cm_led: '4번 LED %1 ,  1번 LED %2 %3',
                robotis_carCont_cm_sound_detected_clear: '최종소리감지횟수 초기화 %1',
                robotis_carCont_aux_motor_speed:
                    '%1 감속모터 속도를 %2 , 출력값을 %3 (으)로 정하기 %4',
                robotis_carCont_cm_calibration:
                    '%1 적외선 센서 캘리브레이션 값을 %2 (으)로 정하기 %3',
                robotis_openCM70_cm_custom_value: '직접입력 주소 ( %1 ) %2 값',
                robotis_openCM70_sensor_value: '제어기 %1 값',
                robotis_openCM70_aux_sensor_value: '%1   %2 값',
                robotis_openCM70_cm_buzzer_index: '제어기 음계값 %1 을(를) %2 초 동안 연주 %3',
                robotis_openCM70_cm_buzzer_melody: '제어기 멜로디 %1 번 연주 %2',
                robotis_openCM70_cm_sound_detected_clear: '최종소리감지횟수 초기화 %1',
                robotis_openCM70_cm_led: '제어기 %1 LED %2 %3',
                //robotis_openCM70_cm_motion: '모션 %1 번 실행 %2',
                robotis_openCM70_cm_autodrive_motor: '🚗 자율주행 자동차 %1 모터를 %2 에 연결 %3',
                robotis_openCM70_cm_autodrive_ir: '🚗 자율주행 자동차 %1 적외선센서를 %2 에 연결 %3',
                robotis_openCM70_cm_autodrive_speed: '🚗 차로를 따라 %1의 속도로 자율주행 %2',
                robotis_openCM70_aux_motor_speed:
                    '%1 감속모터 속도를 %2 , 출력값을 %3%로 정하기 %4',
                robotis_openCM70_aux_servo_mode: '%1 서보모터 모드를 %2 (으)로 정하기 %3',
                robotis_openCM70_aux_servo_speed:
                    '%1 서보모터 속도를 %2 , 출력값을 %3%로 정하기 %4',
                robotis_openCM70_aux_servo_position: '%1 서보모터 위치를 %2도로 정하기 %3',
                robotis_openCM70_aux_led_module: '%1 LED 모듈을 %2 (으)로 정하기 %3',
                robotis_openCM70_cm_poweroff_timer: '제어기 자동꺼짐 타이머 %1 %2',
                robotis_openCM70_aux_custom: '%1 사용자 장치를 %2 (으)로 정하기 %3',
                robotis_openCM70_cm_custom: '직접입력 주소 ( %1 ) (을)를 %2 (으)로 정하기 %3',
            },
            Helper: {
                robotis_carCont_sensor_value:
                    '왼쪽 접속 센서 : 접촉(1), 비접촉(0) 값 입니다.<br/>오른쪽 접촉 센서 : 접촉(1), 비접촉(0) 값 입니다.<br/>선택 버튼 상태 : 접촉(1), 비접촉(0) 값 입니다.<br/>최종 소리 감지 횟수 : 마지막 실시간 소리 감지 횟수 값 입니다.<br/>실시간 소리 감지 횟수 : 약 1초 안에 다음 소리가 감지되면 1씩 증가합니다.<br/>왼쪽 적외선 센서 : 물체와 가까울 수록 큰 값 입니다.<br/>오른쪽 적외선 센서 : 물체와 가까울 수록 큰 값 값 입니다.<br/>왼쪽 적외선 센서 캘리브레이션 값 : 적외선 센서의 캘리브레이션 값 입니다.<br/>오른쪽 적외선 센서 캘리브레이션 값 : 적외선 센서의 캘리브레이션 값 입니다.<br/>(*캘리브레이션 값 - 적외선센서 조정 값)',
                robotis_carCont_cm_led:
                    '4개의 LED 중 1번 또는 4번 LED 를 켜거나 끕니다.<br/>LED 2번과 3번은 동작 지원하지 않습니다.',
                robotis_carCont_cm_sound_detected_clear:
                    '최종 소리 감지횟 수를 0 으로 초기화 합니다.',
                robotis_carCont_aux_motor_speed: '감속모터 속도를 0 ~ 1023 의 값(으)로 정합니다.',
                robotis_carCont_cm_calibration:
                    '적외선센서 조정 값(http://support.robotis.com/ko/: 자동차로봇> 2. B. 적외선 값 조정)을 직접 정합니다.',
                robotis_openCM70_sensor_value:
                    '최종 소리 감지 횟수 : 마지막 실시간 소리 감지 횟수 값 입니다.<br/>실시간 소리 감지 횟수 : 약 1초 안에 다음 소리가 감지되면 1씩 증가합니다.<br/>사용자 버튼 상태 : 접촉(1), 비접촉(0) 값 입니다.최종 소리 감지 횟수 : 마지막 실시간 소리 감지 횟수 값 입니다.<br/>실시간 소리 감지 횟수 : 약 1초 안에 다음 소리가 감지되면 1씩 증가합니다.<br/>사용자 버튼 상태 : 접촉(1), 비접촉(0) 값 입니다.',
                robotis_openCM70_aux_sensor_value:
                    '서보모터 위치 : 0 ~ 1023, 중간 위치의 값은 512 입니다.<br/>적외선센서 :  물체와 가까울 수록 큰 값 입니다.<br/>접촉센서 : 접촉(1), 비접촉(0) 값 입니다.<br/>조도센서(CDS) : 0 ~ 1023, 밝을 수록 큰 값 입니다.<br/>온습도센서(습도) : 0 ~ 100, 습할 수록 큰 값 입니다.<br/>온습도센서(온도) : -20 ~ 100, 온도가 높을 수록 큰 값 입니다.<br/>온도센서 :  -20 ~ 100, 온도가 높을 수록 큰 값 입니다.<br/>초음파센서 : -<br/>자석센서 : 접촉(1), 비접촉(0) 값 입니다.<br/>동작감지센서 : 동작 감지(1), 동작 미감지(0) 값 입니다.<br/>컬러센서 : 알수없음(0), 흰색(1), 검은색(2), 빨간색(3), 녹색(4), 파란색(5), 노란색(6) 값 입니다.<br/>사용자 장치 : 사용자 센서 제작에 대한 설명은 ROBOTIS e-매뉴얼(http://support.robotis.com/ko/)을 참고하세요.',
                robotis_openCM70_cm_buzzer_index: '음계를 0.1 ~ 5 초 동안 연주 합니다.',
                robotis_openCM70_cm_buzzer_melody:
                    "멜로디를 연주 합니다.<br/>멜로디를 연속으로 재생하는 경우, 다음 소리가 재생되지 않으면 '흐름 > X 초 기다리기' 블록을 사용하여 기다린 후 실행합니다.",
                robotis_openCM70_cm_sound_detected_clear:
                    '최종 소리 감지횟 수를 0 으로 초기화 합니다.',
                robotis_openCM70_cm_led: '제어기의 빨간색, 녹색, 파란색 LED 를 켜거나 끕니다.',
                //robotis_openCM70_cm_motion: '제어기에 다운로드 되어있는 모션을 실행합니다.',
                robotis_openCM70_cm_autodrive_motor: '자율주행 자동차의 모터 포트를 지정합니다.',
                robotis_openCM70_cm_autodrive_ir: '자율주행 자동차의 적외선 센서 포트를 지정합니다.',
                robotis_openCM70_cm_autodrive_speed: '지정한 속도로 자율주행을 수행합니다.',
                robotis_openCM70_aux_motor_speed: '감속모터 속도를 0 ~ 100% 의 값으로 정합니다.',
                robotis_openCM70_aux_servo_mode:
                    '서보모터를 회전모드 또는 관절모드로 정합니다.<br/>한번 설정된 모드는 계속 적용됩니다.<br/>회전모드는 서보모터 속도를 지정하여 서보모터를 회전 시킵니다.<br/>관절모드는 지정한 서보모터 속도로 서보모터 위치를 이동 시킵니다.',
                robotis_openCM70_aux_servo_speed: '서보모터 속도를 0 ~ 100% 의 값으로 정합니다.',
                robotis_openCM70_aux_servo_position:
                    '서보모터 위치를 -150 ~ 150도 의 값(으)로 정합니다.<br/>서보모터 속도와 같이 사용해야 합니다.',
                robotis_openCM70_aux_led_module: 'LED 모듈의 LED 를 켜거나 끕니다.',
                robotis_openCM70_aux_custom:
                    '사용자 센서 제작에 대한 설명은 ROBOTIS e-매뉴얼(http://support.robotis.com/ko/)을 참고하세요.',
                robotis_openCM70_cm_poweroff_timer: 
                    '제어기의 자동꺼짐 타이머를 설정합니다.<br/>설정된 만큼의 시간동안 통신이 진행되지 않으면 제어기는 자동으로 꺼집니다.',
                robotis_openCM70_cm_custom_value:
                    '컨트롤 테이블 주소를 직접 입력하여 값을 확인 합니다.<br/>컨트롤 테이블 대한 설명은 ROBOTIS e-매뉴얼(http://support.robotis.com/ko/)을 참고하세요.',
                robotis_openCM70_cm_custom:
                    '컨트롤 테이블 주소를 직접 입력하여 값을 정합니다.<br/>컨트롤 테이블 대한 설명은 ROBOTIS e-매뉴얼(http://support.robotis.com/ko/)을 참고하세요.',
            },
            Blocks: {
                robotis_carCont_aux_motor_speed_1: '감속모터 속도를',
                robotis_carCont_aux_motor_speed_2: ', 출력값을',
                robotis_carCont_calibration_1: '적외선 센서 캘리브레이션 값을',
                robotis_common_case_01: '(을)를',
                robotis_common_set: '(으)로 정하기',
                robotis_common_value: '값',
                robotis_common_clockwhise: '시계방향',
                robotis_common_counter_clockwhise: '반시계방향',
                robotis_common_wheel_mode: '회전모드',
                robotis_common_joint_mode: '관절모드',
                robotis_common_red_color: '빨간색',
                robotis_common_green_color: '녹색',
                robotis_common_blue_color: '파란색',
                robotis_common_on: '켜기',
                robotis_common_off: '끄기',
                robotis_common_cm: '제어기',
                robotis_common_port_1: '포트 1',
                robotis_common_port_2: '포트 2',
                robotis_common_port_3: '포트 3',
                robotis_common_port_4: '포트 4',
                robotis_common_port_5: '포트 5',
                robotis_common_port_6: '포트 6',
                robotis_common_play_buzzer: '연주',
                robotis_common_play_motion: '실행',
                robotis_common_motion: '모션',
                robotis_common_index_number: '번',
                robotis_common_left: '왼쪽',
                robotis_common_right: '오른쪽',
                robotis_common_minute: '분',
                robotis_cm_custom: '직접입력 주소',
                robotis_cm_spring_left: '왼쪽 접촉 센서',
                robotis_cm_spring_right: '오른쪽 접촉 센서',
                robotis_cm_led_left: '왼쪽 LED',
                robotis_cm_led_right: '오른쪽 LED',
                robotis_cm_led_both: '양 쪽 LED',
                robotis_cm_switch: '선택 버튼 상태',
                robotis_cm_user_button: '사용자 버튼 상태',
                robotis_cm_sound_detected: '최종 소리 감지 횟수',
                robotis_cm_sound_detecting: '실시간 소리 감지 횟수',
                robotis_cm_ir_left: '왼쪽 적외선 센서',
                robotis_cm_ir_right: '오른쪽 적외선 센서',
                robotis_cm_calibration_left: '왼쪽 적외선 센서 캘리브레이션 값',
                robotis_cm_calibration_right: '오른쪽 적외선 센서 캘리브레이션 값',
                robotis_cm_clear_sound_detected: '최종소리감지횟수 초기화',
                robotis_cm_buzzer_index: '음계값',
                robotis_cm_buzzer_melody: '멜로디',
                robotis_cm_led_1: '1번 LED',
                robotis_cm_led_4: '4번 LED',
                robotis_aux_servo_position: '서보모터 위치',
                robotis_aux_ir: '적외선센서',
                robotis_aux_touch: '접촉센서',
                robotis_aux_brightness: '조도센서(CDS)',
                robotis_aux_hydro_themo_humidity: '온습도센서(습도)',
                robotis_aux_hydro_themo_temper: '온습도센서(온도)',
                robotis_aux_temperature: '온도센서',
                robotis_aux_ultrasonic: '초음파센서',
                robotis_aux_magnetic: '자석센서',
                robotis_aux_motion_detection: '동작감지센서',
                robotis_aux_color: '컬러센서',
                robotis_aux_custom: '사용자 장치',
            },
        },
        en: {
            template: {
                robotis_carCont_sensor_value: 'Value   %1',
                robotis_carCont_cm_led: '%1 LED 4,  %2 LED %3',
                robotis_carCont_cm_sound_detected_clear:
                    'Initialize the final number of sound detection  %1',
                robotis_carCont_aux_motor_speed:
                    'Set the speed of decelerating motor of %1 to %2, and the output value to %3  %4',
                robotis_carCont_cm_calibration:
                    'Set %1 value of infrared sensor calibration to %2  %3',
                robotis_openCM70_cm_custom_value: 'Custom address ( %1 ) value %2',
                robotis_openCM70_sensor_value: 'Controller value %1',
                robotis_openCM70_aux_sensor_value: 'Value %1   %2',
                robotis_openCM70_cm_buzzer_index:
                    'Play %1 controller scale value for %2 seconds %3 ',
                robotis_openCM70_cm_buzzer_melody: 'Play controller melody %1 times %2',
                robotis_openCM70_cm_sound_detected_clear:
                    'Initialize the final number of sound detection  %1',
                robotis_openCM70_cm_led: 'Controller %1 LED %2 %3',
                //robotis_openCM70_cm_motion: 'Play the motion %1 times',
                robotis_openCM70_cm_autodrive_motor: 'Autonomous driving car %1 motor uses %2 %3',
                robotis_openCM70_cm_autodrive_ir: 'Autonomous driving car %1 IR sensor uses %2 %3',
                robotis_openCM70_cm_autodrive_speed: 'Perform autonomous driving at the speed of %1 %2',
                robotis_openCM70_aux_motor_speed:
                    'Set the speed of decelerating motor of %1 to %2 , and the output value to %3%  %4',
                robotis_openCM70_aux_servo_mode: 'Set the mode of %1 servo motor to %2  %3',
                robotis_openCM70_aux_servo_speed:
                    'Set the speed of servo motor of %1 to %2 , and the output value to %3%  %4',
                robotis_openCM70_aux_servo_position: 'Set the position of %1 servo motor to %2 degree %3',
                robotis_openCM70_aux_led_module: 'Set the LED module of %1 as %2  %3',
                robotis_openCM70_aux_custom: 'Set the user device of %1 as %2  %3',
                robotis_openCM70_cm_poweroff_timer: 'Set auto-off timer as %1 %2',
                robotis_openCM70_cm_custom: 'Set the custom address ( %1 ) as %2  %3',
            },
            Helper: {
                robotis_openCM70_sensor_value:
                    'Final number of sound detection : the value of the final detected sound times.<br/>Number of live sound detection : increases by 1 when it detects the next sound within 1 second.<br/>Status of user button: the value of contact (1), non-contact (0).Final number of sound detection : the value of the number of last live sound detection.<br/>Number of live sound detection : increases by 1 when it detects the next sound within 1 second.<br/>Status of user button : the value of contact (1), non-contact (0).',
                robotis_openCM70_aux_sensor_value:
                    "Position of servo motor: 0-1023, the value of the middle is 512.<br/>Infrared sensor : the value is larger when it's close to an object.<br/>Contact sensor: the value of contact(1), non-contact(0).<br/>CDS: 0-1023, the value is larger when it's brighter.<br/>Temperature-humidity sensor (humidity) : 0-100, the value is larger when it's more humid.<br/>Temperature-humidity sensor (temperature) : -20 - 100, the value is larger when it's higher in temperature.<br/>Temperature sensor : -20 - 100, the value is larger when it's higher in temperature.<br/>Ultrasound sensor: -<br/>Magnetic sensor : the value of contact(1), non-contact(0).<br/>Motion detector: the value of detected motion(1), non-detected motion(0).<br/>Color sensor: the value of unknown(0), white(1), black(2), red(3), green(4), blue(5), yellow(6).<br/>User device: please refer to ROBOTIS e-manual (http://support.robotis.com/ko/) for the explanation on user sensor production.",
                robotis_openCM70_cm_buzzer_index: 'Plays the scale for 0.1 to 5 seconds.',
                robotis_openCM70_cm_buzzer_melody:
                    "Plays melody.<br/>If the following sound doesn't play when repeatedly playing melodies, use the block 'flow > wait for X seconds' and execute it again.",
                robotis_openCM70_cm_sound_detected_clear: 'Final number of sound detection ',
                robotis_openCM70_cm_led: 'Turns the red, green, blue LED of the device on or off.',
                //robotis_openCM70_cm_motion: 'Executes the motion downloaded on the device.',
                robotis_openCM70_cm_autodrive_motor: 'Specifies the motor port of the autonomous driving car.',
                robotis_openCM70_cm_autodrive_ir: 'Specifies the IR sensor port of the autonomous driving car.',
                robotis_openCM70_cm_autodrive_speed: 'Perform autonomous driving at the specified speed along the lane.',
                robotis_openCM70_aux_motor_speed:
                    'Sets the speed of decelerating motor to the value of 0 - 100%.',
                robotis_openCM70_aux_servo_mode:
                    "Sets the servo motor as wheel mode or joint mode.<br/>The same mode continues to apply once it's set.<br/>Wheel mode designates the servo motor's speed, and spins the servo motor.<br/>Joint mode moves the servo motor's position with the set servo motor speed.",
                robotis_openCM70_aux_servo_speed:
                    "Sets servo motor's speed to the value of 0 - 1023.",
                robotis_openCM70_aux_servo_position:
                    "Sets servo motor's position to the value of -150 ~ 150 degree.<br/>Use as servo motor speed",
                robotis_openCM70_aux_led_module: 'Turns the LED of LED module on or off.',
                robotis_openCM70_aux_custom:
                    'Please refer to the ROBOTIS e-manual (http://support.robotis.com/ko/) for the explanation of user sensor production.',
                robotis_openCM70_cm_poweroff_timer: "Set the controllers auto-off timer.<br/>If there is no communication for the set amount of time, the controller will automatically turn off.",
                robotis_openCM70_cm_custom_value:
                    'Checks the value by directly inputting the control table address.<br/>Please refer to the ROBOTIS e-manual (http://support.robotis.com/ko/) for the explanation about control table.',
                robotis_openCM70_cm_custom:
                    'Checks the value by directly inputting the control table address.<br/>Please refer to the ROBOTIS e-manual (http://support.robotis.com/ko/) for the explanation about control table.',
                robotis_carCont_sensor_value:
                    "Left connected sensor : the value of contact (1), non-contact (0).<br/>Right contact sensor: the value of contact (1), non-contact (0).<br/>Final number of sound detection : the value of the number of last live sound detection.<br/>Number of live sound detection : increases by 1 when it detects the next sound within 1 second.<br/>Right infrared sensor: the value is larger when it's closer to an object.<br/>Value of left infrared sensor calibration : the calibration value of the infrared sensor.<br/>Value of right infrared sensor calibration : the calibration value of the infrared sensor.<br/>(*Calibration value - control value of infrared sensor)",
                robotis_carCont_cm_led:
                    'Turns LED 1 or LED 4 among the 4 LEDs on or off. <br/>Not applicable to LED 2 and LED 3.',
                robotis_carCont_cm_sound_detected_clear:
                    'Initializes the final amount of detected sound to 0.',
                robotis_carCont_aux_motor_speed:
                    'Sets the speed of decelerating motor to the value of 0-1023.',
                robotis_carCont_cm_calibration:
                    'Sets the controlling value of infrared sensor (http://support.robotis.com/ko/: automobile robot> 2. B. control infrared value).',
            },
            Blocks: {
                robotis_carCont_aux_motor_speed_1: 'Speed of decelerating motor',
                robotis_carCont_aux_motor_speed_2: ', the output value',
                robotis_carCont_calibration_1: 'Value of the infrared sensor calibration ',
                robotis_common_case_01: '(을)를',
                robotis_common_set: 'the output value',
                robotis_common_value: 'Value',
                robotis_common_clockwhise: 'Clockwise',
                robotis_common_counter_clockwhise: 'Counterclockwise',
                robotis_common_wheel_mode: 'Wheel mode',
                robotis_common_joint_mode: 'Joint mode',
                robotis_common_red_color: 'Red',
                robotis_common_green_color: 'Green',
                robotis_common_blue_color: 'Blue',
                robotis_common_on: 'Turn on',
                robotis_common_off: 'Turn off',
                robotis_common_cm: 'Controller',
                robotis_common_port_1: 'Port 1',
                robotis_common_port_2: 'Port 2',
                robotis_common_port_3: 'Port 3',
                robotis_common_port_4: 'Port 4',
                robotis_common_port_5: 'Port 5',
                robotis_common_port_6: 'Port 6',
                robotis_common_play_buzzer: 'Play',
                robotis_common_play_motion: 'Play',
                robotis_common_motion: 'Motion',
                robotis_common_index_number: 'Number',
                robotis_common_left: 'Left',
                robotis_common_right: 'Right',
                robotis_common_minute: 'minute(s)',
                robotis_cm_custom: 'Custom address',
                robotis_cm_spring_left: 'Left contact sensor',
                robotis_cm_spring_right: 'Right contact sensor',
                robotis_cm_led_left: 'Left LED',
                robotis_cm_led_right: 'Right LED',
                robotis_cm_led_both: 'Both LED',
                robotis_cm_switch: 'Status of the switch',
                robotis_cm_user_button: 'Status of user button',
                robotis_cm_sound_detected: 'Final number of sound detection ',
                robotis_cm_sound_detecting: 'Number of live sound detection ',
                robotis_cm_ir_left: 'Left infrared sensor',
                robotis_cm_ir_right: 'Right infrared sensor',
                robotis_cm_calibration_left: 'Value of the left infrared sensor calibration ',
                robotis_cm_calibration_right: 'Value of the right infrared sensor calibration ',
                robotis_cm_clear_sound_detected: 'Initialize the final number of sound detection',
                robotis_cm_buzzer_index: 'Scale index',
                robotis_cm_buzzer_melody: 'Melody',
                robotis_cm_led_1: 'LED 1',
                robotis_cm_led_4: 'LED 4',
                robotis_aux_servo_position: 'Position of servo motor',
                robotis_aux_ir: 'Infrared sensor',
                robotis_aux_touch: 'Contact sensor',
                robotis_aux_brightness: 'CDS',
                robotis_aux_hydro_themo_humidity: 'Temperature-humidity sensor (humidity)',
                robotis_aux_hydro_themo_temper: 'Temperature-humidity sensor (temperature)',
                robotis_aux_temperature: 'Temperature sensor',
                robotis_aux_ultrasonic: 'Ultrasonic sensor',
                robotis_aux_magnetic: 'Magnetic sensor',
                robotis_aux_motion_detection: 'Motion detector',
                robotis_aux_color: 'Color sensor',
                robotis_aux_custom: 'User device',
            },
        },
    };
};

Entry.Robotis_carCont.getBlocks = function() {
    return {
        //region robotis 로보티즈 carCont
        robotis_carCont_sensor_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.robotis_cm_spring_left, 'CM_SPRING_LEFT'],
                        [Lang.Blocks.robotis_cm_spring_right, 'CM_SPRING_RIGHT'],
                        [Lang.Blocks.robotis_cm_switch, 'CM_SWITCH'],
                        [Lang.Blocks.robotis_cm_sound_detected, 'CM_SOUND_DETECTED'],
                        [Lang.Blocks.robotis_cm_sound_detecting, 'CM_SOUND_DETECTING'],
                        [Lang.Blocks.robotis_cm_ir_left, 'CM_IR_LEFT'],
                        [Lang.Blocks.robotis_cm_ir_right, 'CM_IR_RIGHT'],
                        [Lang.Blocks.robotis_cm_calibration_left, 'CM_CALIBRATION_LEFT'],
                        [Lang.Blocks.robotis_cm_calibration_right, 'CM_CALIBRATION_RIGHT'],
                    ],
                    value: 'CM_SPRING_LEFT',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'robotis_carCont_sensor_value',
            },
            paramsKeyMap: {
                SENSOR: 0,
            },
            class: 'robotis_carCont_cm',
            isNotFor: ['robotis_carCont'],
            func: function(sprite, script) {
                // instruction / address / length / value / default length
                var data_instruction = Entry.Robotis_carCont.INSTRUCTION.READ;
                var data_address = 0;
                var data_length = 0;
                var data_value = 0;

                var data_default_address = 0;
                var data_default_length = 0;

                var sensor = script.getStringField('SENSOR');

                if (sensor == 'CM_SPRING_LEFT') {
                    data_default_address = Entry.Robotis_carCont.CONTROL_TABLE.CM_SPRING_LEFT[0];
                    data_default_length = Entry.Robotis_carCont.CONTROL_TABLE.CM_SPRING_LEFT[1];
                    data_address = Entry.Robotis_carCont.CONTROL_TABLE.CM_SPRING_LEFT[2];
                    data_length = Entry.Robotis_carCont.CONTROL_TABLE.CM_SPRING_LEFT[3];
                } else if (sensor == 'CM_SPRING_RIGHT') {
                    data_default_address = Entry.Robotis_carCont.CONTROL_TABLE.CM_SPRING_RIGHT[0];
                    data_default_length = Entry.Robotis_carCont.CONTROL_TABLE.CM_SPRING_RIGHT[1];
                    data_address = Entry.Robotis_carCont.CONTROL_TABLE.CM_SPRING_RIGHT[2];
                    data_length = Entry.Robotis_carCont.CONTROL_TABLE.CM_SPRING_RIGHT[3];
                } else if (sensor == 'CM_SWITCH') {
                    data_default_address = Entry.Robotis_carCont.CONTROL_TABLE.CM_SWITCH[0];
                    data_default_length = Entry.Robotis_carCont.CONTROL_TABLE.CM_SWITCH[1];
                    data_address = Entry.Robotis_carCont.CONTROL_TABLE.CM_SWITCH[0];
                    data_length = Entry.Robotis_carCont.CONTROL_TABLE.CM_SWITCH[1];
                } else if (sensor == 'CM_SOUND_DETECTED') {
                    data_default_address = Entry.Robotis_carCont.CONTROL_TABLE.CM_SOUND_DETECTED[0];
                    data_default_length = Entry.Robotis_carCont.CONTROL_TABLE.CM_SOUND_DETECTED[1];
                    data_address = Entry.Robotis_carCont.CONTROL_TABLE.CM_SOUND_DETECTED[0];
                    data_length = Entry.Robotis_carCont.CONTROL_TABLE.CM_SOUND_DETECTED[1];
                } else if (sensor == 'CM_SOUND_DETECTING') {
                    data_default_address =
                        Entry.Robotis_carCont.CONTROL_TABLE.CM_SOUND_DETECTING[0];
                    data_default_length = Entry.Robotis_carCont.CONTROL_TABLE.CM_SOUND_DETECTING[1];
                    data_address = Entry.Robotis_carCont.CONTROL_TABLE.CM_SOUND_DETECTING[0];
                    data_length = Entry.Robotis_carCont.CONTROL_TABLE.CM_SOUND_DETECTING[1];
                } else if (sensor == 'CM_IR_LEFT') {
                    data_default_address = Entry.Robotis_carCont.CONTROL_TABLE.CM_IR_LEFT[0];
                    data_default_length = Entry.Robotis_carCont.CONTROL_TABLE.CM_IR_LEFT[1];
                    data_address = Entry.Robotis_carCont.CONTROL_TABLE.CM_IR_LEFT[2];
                    data_length = Entry.Robotis_carCont.CONTROL_TABLE.CM_IR_LEFT[3];
                } else if (sensor == 'CM_IR_RIGHT') {
                    data_default_address = Entry.Robotis_carCont.CONTROL_TABLE.CM_IR_RIGHT[0];
                    data_default_length = Entry.Robotis_carCont.CONTROL_TABLE.CM_IR_RIGHT[1];
                    data_address = Entry.Robotis_carCont.CONTROL_TABLE.CM_IR_RIGHT[2];
                    data_length = Entry.Robotis_carCont.CONTROL_TABLE.CM_IR_RIGHT[3];
                } else if (sensor == 'CM_CALIBRATION_LEFT') {
                    data_default_address =
                        Entry.Robotis_carCont.CONTROL_TABLE.CM_CALIBRATION_LEFT[0];
                    data_default_length =
                        Entry.Robotis_carCont.CONTROL_TABLE.CM_CALIBRATION_LEFT[1];
                    data_address = Entry.Robotis_carCont.CONTROL_TABLE.CM_CALIBRATION_LEFT[0];
                    data_length = Entry.Robotis_carCont.CONTROL_TABLE.CM_CALIBRATION_LEFT[1];
                } else if (sensor == 'CM_CALIBRATION_RIGHT') {
                    data_default_address =
                        Entry.Robotis_carCont.CONTROL_TABLE.CM_CALIBRATION_RIGHT[0];
                    data_default_length =
                        Entry.Robotis_carCont.CONTROL_TABLE.CM_CALIBRATION_RIGHT[1];
                    data_address = Entry.Robotis_carCont.CONTROL_TABLE.CM_CALIBRATION_RIGHT[0];
                    data_length = Entry.Robotis_carCont.CONTROL_TABLE.CM_CALIBRATION_RIGHT[1];
                } else if (sensor == 'CM_BUTTON_STATUS') {
                    data_default_address = Entry.Robotis_carCont.CONTROL_TABLE.CM_BUTTON_STATUS[0];
                    data_default_length = Entry.Robotis_carCont.CONTROL_TABLE.CM_BUTTON_STATUS[1];
                    data_address = Entry.Robotis_carCont.CONTROL_TABLE.CM_BUTTON_STATUS[0];
                    data_length = Entry.Robotis_carCont.CONTROL_TABLE.CM_BUTTON_STATUS[1];
                }

                //Entry.Robotis_carCont.setRobotisData([[data_instruction, data_address, data_length, data_value, data_default_length]]);
                //// Entry.hw.socket.send(JSON.stringify(Entry.hw.sendQueue));
                //Entry.Robotis_carCont.update();
                //
                //return Entry.hw.portData[data_default_address];

                if (
                    Entry.hw.sendQueue.prevAddress &&
                    Entry.hw.sendQueue.prevAddress == data_default_address
                ) {
                    if (
                        Entry.hw.sendQueue.prevTime &&
                        new Date() - Entry.hw.sendQueue.prevTime < 300
                    ) {
                        //throw new Entry.Utils.AsyncError();
                        return Entry.hw.sendQueue.prevResult;
                    }
                }

                Entry.Robotis_carCont.setRobotisData([
                    [data_instruction, data_address, data_length, data_value, data_default_length],
                ]);
                // Entry.hw.socket.send(JSON.stringify(Entry.hw.sendQueue));
                Entry.Robotis_carCont.update();

                var result = Entry.hw.portData[data_default_address];
                Entry.hw.sendQueue.prevAddress = data_default_address;
                Entry.hw.sendQueue.prevTime = new Date();
                Entry.hw.sendQueue.prevResult = result;

                return result;
            },
            syntax: { js: [], py: ['Robotis.carcont_sensor_value(%1)'] },
        },
        robotis_carCont_cm_led: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.robotis_common_on, '1'],
                        [Lang.Blocks.robotis_common_off, '0'],
                    ],
                    value: '1',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.robotis_common_on, '1'],
                        [Lang.Blocks.robotis_common_off, '0'],
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
                type: 'robotis_carCont_cm_led',
            },
            paramsKeyMap: {
                VALUE_LEFT: 0,
                VALUE_RIGHT: 1,
            },
            class: 'robotis_carCont_cm',
            isNotFor: ['robotis_carCont'],
            func: function(sprite, script) {
                // instruction / address / length / value / default length
                var value_left = script.getField('VALUE_LEFT', script);
                var value_right = script.getField('VALUE_RIGHT', script);

                var data_instruction = Entry.Robotis_carCont.INSTRUCTION.WRITE;
                var data_address = 0;
                var data_length = 0;
                var data_value = 0;

                data_address = Entry.Robotis_carCont.CONTROL_TABLE.CM_LED[0];
                data_length = Entry.Robotis_carCont.CONTROL_TABLE.CM_LED[1];

                if (value_left == 1 && value_right == 1) {
                    data_value = 9;
                } else if (value_left == 1 && value_right == 0) {
                    data_value = 8;
                }
                if (value_left == 0 && value_right == 1) {
                    data_value = 1;
                }

                var data_sendqueue = [[data_instruction, data_address, data_length, data_value]];
                return Entry.Robotis_carCont.postCallReturn(
                    script,
                    data_sendqueue,
                    Entry.Robotis_carCont.delay
                );
            },
            syntax: { js: [], py: ['Robotis.carcont_cm_led(%1, %2)'] },
        },
        robotis_carCont_cm_sound_detected_clear: {
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
                type: 'robotis_carCont_cm_sound_detected_clear',
            },
            class: 'robotis_carCont_cm',
            isNotFor: ['robotis_carCont'],
            func: function(sprite, script) {
                // instruction / address / length / value / default length

                var data_instruction = Entry.Robotis_carCont.INSTRUCTION.WRITE;
                var data_address = 0;
                var data_length = 0;
                var data_value = 0;

                data_address = Entry.Robotis_carCont.CONTROL_TABLE.CM_SOUND_DETECTED[0];
                data_length = Entry.Robotis_carCont.CONTROL_TABLE.CM_SOUND_DETECTED[1];
                data_value = 0;

                var data_sendqueue = [[data_instruction, data_address, data_length, data_value]];
                return Entry.Robotis_carCont.postCallReturn(
                    script,
                    data_sendqueue,
                    Entry.Robotis_carCont.delay
                );
            },
            syntax: { js: [], py: ['Robotis.carcont_cm_sound_clear()'] },
        },
        robotis_carCont_aux_motor_speed: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.General.left, 'LEFT'],
                        [Lang.General.right, 'RIGHT'],
                    ],
                    value: 'LEFT',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.robotis_common_clockwhise, 'CW'],
                        [Lang.Blocks.robotis_common_counter_clockwhise, 'CCW'],
                    ],
                    value: 'CW',
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
                        type: 'number',
                        params: ['500'],
                    },
                    null,
                ],
                type: 'robotis_carCont_aux_motor_speed',
            },
            paramsKeyMap: {
                DIRECTION: 0,
                DIRECTION_ANGLE: 1,
                VALUE: 2,
            },
            class: 'robotis_carCont_cm',
            isNotFor: ['robotis_carCont'],
            func: function(sprite, script) {
                // instruction / address / length / value / default length
                var direction = script.getField('DIRECTION', script);
                var directionAngle = script.getField('DIRECTION_ANGLE', script);
                var value = script.getNumberValue('VALUE');

                var data_instruction = Entry.Robotis_carCont.INSTRUCTION.WRITE;
                var data_address = 0;
                var data_length = 0;
                var data_value = 0;

                if (direction == 'LEFT') {
                    data_address = Entry.Robotis_carCont.CONTROL_TABLE.AUX_MOTOR_SPEED_LEFT[0];
                    data_length = Entry.Robotis_carCont.CONTROL_TABLE.AUX_MOTOR_SPEED_LEFT[1];
                } else {
                    data_address = Entry.Robotis_carCont.CONTROL_TABLE.AUX_MOTOR_SPEED_RIGHT[0];
                    data_length = Entry.Robotis_carCont.CONTROL_TABLE.AUX_MOTOR_SPEED_RIGHT[1];
                }

                if (directionAngle == 'CW') {
                    value = value + 1024;
                    if (value > 2047) {
                        value = 2047;
                    }
                } else {
                    if (value > 1023) {
                        value = 1023;
                    }
                }

                data_value = value;

                var data_sendqueue = [[data_instruction, data_address, data_length, data_value]];
                return Entry.Robotis_carCont.postCallReturn(
                    script,
                    data_sendqueue,
                    Entry.Robotis_carCont.delay
                );
            },
            syntax: {
                js: [],
                py: ['Robotis.carcont_aux_motor_speed(%1, %2, %3)'],
            },
        },
        robotis_carCont_aux_motor_speed2: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            template:
                '왼쪽 감속모터 속도를 %1, 출력값을 %2 (으)로 오른쪽 감속모터 속도를 %3, 출력값을 %4 (으)로 정하기 %5',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.robotis_common_clockwhise, 'CW'],
                        [Lang.Blocks.robotis_common_counter_clockwhise, 'CCW'],
                    ],
                    value: 'CW',
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
                        [Lang.Blocks.robotis_common_clockwhise, 'CW'],
                        [Lang.Blocks.robotis_common_counter_clockwhise, 'CCW'],
                    ],
                    value: 'CW',
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
                        params: ['500'],
                    },
                    null,
                    {
                        type: 'number',
                        params: ['500'],
                    },
                    null,
                ],
                type: 'robotis_carCont_aux_motor_speed2',
            },
            paramsKeyMap: {
                LEFT_ANGLE: 0,
                LEFT_VALUE: 1,
                RIGHT_ANGLE: 2,
                RIGHT_VALUE: 3,
            },
            class: 'robotis_carCont_cm',
            isNotFor: ['robotis_carCont'],
            func: function(sprite, script) {
                var data_instruction = Entry.Robotis_carCont.INSTRUCTION.WRITE,
                    address = Entry.Robotis_carCont.CONTROL_TABLE.AUX_MOTOR_SPEED_LEFT[0];

                var leftAngle = script.getField('LEFT_ANGLE', script);
                var leftValue = script.getNumberValue('LEFT_VALUE');
                var rightAngle = script.getField('RIGHT_ANGLE', script);
                var rightValue = script.getNumberValue('RIGHT_VALUE');

                leftValue = Math.min(leftValue, 1023);
                leftValue = Math.max(leftValue, 0);
                rightValue = Math.min(rightValue, 1023);
                rightValue = Math.max(rightValue, 0);

                if (leftAngle === 'CW') {
                    leftValue += 1024;
                }
                if (rightAngle === 'CW') {
                    rightValue += 1024;
                }

                var value = leftValue + (rightValue << 16);
                var data_sendqueue = [[data_instruction, address, 4, value]];
                return Entry.Robotis_carCont.postCallReturn(
                    script,
                    data_sendqueue,
                    Entry.Robotis_carCont.delay
                );
            },
        },
        robotis_carCont_cm_calibration: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.General.left, 'LEFT'],
                        [Lang.General.right, 'RIGHT'],
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
                        type: 'number',
                        params: ['0'],
                    },
                    null,
                ],
                type: 'robotis_carCont_cm_calibration',
            },
            paramsKeyMap: {
                DIRECTION: 0,
                VALUE: 1,
            },
            class: 'robotis_carCont_cm',
            isNotFor: ['robotis_carCont'],
            func: function(sprite, script) {
                // instruction / address / length / value / default length
                var direction = script.getField('DIRECTION', script);
                var value = script.getNumberValue('VALUE');

                var data_instruction = Entry.Robotis_carCont.INSTRUCTION.WRITE;
                var data_address = 0;
                var data_length = 0;
                var data_value = 0;

                if (direction == 'LEFT') {
                    data_address = Entry.Robotis_carCont.CONTROL_TABLE.CM_CALIBRATION_LEFT[0];
                    data_length = Entry.Robotis_carCont.CONTROL_TABLE.CM_CALIBRATION_LEFT[1];
                } else {
                    data_address = Entry.Robotis_carCont.CONTROL_TABLE.CM_CALIBRATION_RIGHT[0];
                    data_length = Entry.Robotis_carCont.CONTROL_TABLE.CM_CALIBRATION_RIGHT[1];
                }

                data_value = value;

                var data_sendqueue = [[data_instruction, data_address, data_length, data_value]];
                return Entry.Robotis_carCont.postCallReturn(
                    script,
                    data_sendqueue,
                    Entry.Robotis_carCont.delay
                );

                // Entry.hw.sendQueue['ROBOTIS_DATA'] = [[data_instruction, data_address, data_length, data_value]];
                // update();
                // return script.callReturn();
            },
            syntax: { js: [], py: ['Robotis.carcont_cm_calibration(%1, %2)'] },
        },
        //endregion robotis 로보티즈
    };
};

Entry.Robotis_openCM70.blockMenuBlocks = [
    //robotis_openCM70
    'robotis_openCM70_sensor_value',
    'robotis_openCM70_aux_sensor_value',
    'robotis_openCM70_cm_buzzer_index',
    'robotis_openCM70_cm_buzzer_melody',
    'robotis_openCM70_cm_sound_detected_clear',
    'robotis_openCM70_cm_led',
    //'robotis_openCM70_cm_motion',
    'robotis_openCM70_cm_autodrive_motor',
    'robotis_openCM70_cm_autodrive_ir',
    'robotis_openCM70_cm_autodrive_speed',
    'robotis_openCM70_aux_motor_speed',
    'robotis_openCM70_aux_servo_mode',
    'robotis_openCM70_aux_servo_speed',
    'robotis_openCM70_aux_servo_position',
    'robotis_openCM70_aux_led_module',
    'robotis_openCM70_aux_custom',
    'robotis_openCM70_cm_poweroff_timer',
    'robotis_openCM70_cm_custom_value',
    'robotis_openCM70_cm_custom',
];

let opencm70_last_valid_value = [];

Entry.Robotis_openCM70.getBlocks = function() {
    return {
        //region robotis 로보티즈 openCM70
        robotis_openCM70_cm_custom_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                },
                {
                    type: 'Dropdown',
                    options: [
                        ['BYTE', 'BYTE'],
                        ['WORD', 'WORD'],
                        ['DWORD', 'DWORD'],
                    ],
                    value: 'BYTE',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'number',
                        params: ['0'],
                    },
                    null,
                ],
                type: 'robotis_openCM70_cm_custom_value',
            },
            paramsKeyMap: {
                VALUE: 0,
                SIZE: 1,
            },
            class: 'robotis_openCM70_custom',
            isNotFor: ['robotis_openCM70', 'robotis_openCM70EDU'],
            func: function(sprite, script) {
                var scope = script.executor.scope;

                // instruction / address / length / value / default length
                var data_instruction = Entry.Robotis_openCM70.INSTRUCTION.READ;
                var data_address = 0;
                var data_length = 0;
                var data_value = 0;

                var data_default_address = 0;
                var data_default_length = 0;

                var size = script.getStringField('SIZE');

                if (size == 'BYTE') {
                    data_length = 1;
                } else if (size == 'WORD') {
                    data_length = 2;
                } else if (size == 'DWORD') {
                    data_length = 4;
                }

                data_address = script.getNumberValue('VALUE');

                data_default_address = data_address;
                data_default_length = data_length;

                if (
                    Entry.hw.sendQueue.prevAddress &&
                    Entry.hw.sendQueue.prevAddress == data_default_address
                ) {
                    if (
                        Entry.hw.sendQueue.prevTime &&
                        new Date() - Entry.hw.sendQueue.prevTime < 200
                    ) {
                        //throw new Entry.Utils.AsyncError();
                        return Entry.hw.sendQueue.prevResult;
                    }
                }

                Entry.Robotis_carCont.setRobotisData([
                    [data_instruction, data_address, data_length, data_value, data_default_length],
                ]);
                // Entry.hw.socket.send(JSON.stringify(Entry.hw.sendQueue));
                Entry.Robotis_carCont.update();

                var result = Entry.hw.portData[data_default_address];
                Entry.hw.sendQueue.prevAddress = data_default_address;
                Entry.hw.sendQueue.prevTime = new Date();
                Entry.hw.sendQueue.prevResult = result;

                return result;
            },
            syntax: {
                js: [],
                py: ['Robotis.opencm70_cm_custom_value(%1, %2)'],
            },
        },
        robotis_openCM70_sensor_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.robotis_cm_sound_detected, 'CM_SOUND_DETECTED'],
                        [Lang.Blocks.robotis_cm_sound_detecting, 'CM_SOUND_DETECTING'],
                        [Lang.Blocks.robotis_cm_user_button, 'CM_USER_BUTTON'],
                    ],
                    value: 'CM_SOUND_DETECTED',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'robotis_openCM70_sensor_value',
            },
            paramsKeyMap: {
                SENSOR: 0,
            },
            class: 'robotis_openCM70_cm',
            isNotFor: ['robotis_openCM70', 'robotis_openCM70EDU'],
            func: function(sprite, script) {
                var scope = script.executor.scope;

                scope.isStart = true;
                scope.count = 0;
                var data_instruction = Entry.Robotis_openCM70.INSTRUCTION.READ;
                var data_address = 0;
                var data_length = 0;
                var data_value = 0;

                var data_default_address = 0;
                var data_default_length = 0;

                var sensor = script.getStringField('SENSOR');

                var increase = 0;
                var sensor_name = '';

                if (sensor == 'CM_SOUND_DETECTED') {
                    data_default_address =
                        Entry.Robotis_openCM70.CONTROL_TABLE.CM_SOUND_DETECTED[0];
                    data_default_length = Entry.Robotis_openCM70.CONTROL_TABLE.CM_SOUND_DETECTED[1];
                    data_address = Entry.Robotis_openCM70.CONTROL_TABLE.CM_SOUND_DETECTED[0];
                    data_length = Entry.Robotis_openCM70.CONTROL_TABLE.CM_SOUND_DETECTED[1];
                    sensor_name = 'DETECTEDSOUNDE'; 
                } else if (sensor == 'CM_SOUND_DETECTING') {
                    data_default_address =
                        Entry.Robotis_openCM70.CONTROL_TABLE.CM_SOUND_DETECTING[0];
                    data_default_length =
                        Entry.Robotis_openCM70.CONTROL_TABLE.CM_SOUND_DETECTING[1];
                    data_address = Entry.Robotis_openCM70.CONTROL_TABLE.CM_SOUND_DETECTING[0];
                    data_length = Entry.Robotis_openCM70.CONTROL_TABLE.CM_SOUND_DETECTING[1];
                    sensor_name = 'DETECTINGSOUNDE1'; 
                } else if (sensor == 'CM_USER_BUTTON') {
                    data_default_address = Entry.Robotis_openCM70.CONTROL_TABLE.CM_USER_BUTTON[0];
                    data_default_length = Entry.Robotis_openCM70.CONTROL_TABLE.CM_USER_BUTTON[1];
                    data_address = Entry.Robotis_openCM70.CONTROL_TABLE.CM_USER_BUTTON[0];
                    data_length = Entry.Robotis_openCM70.CONTROL_TABLE.CM_USER_BUTTON[1];
                    sensor_name = 'USERBUTTONSTATE'; 
                }

                data_default_address = data_default_address + increase * data_default_length;

                if (
                    Entry.hw.sendQueue.prevAddress &&
                    Entry.hw.sendQueue.prevAddress == data_default_address
                ) {
                    if (
                        Entry.hw.sendQueue.prevTime &&
                        new Date() - Entry.hw.sendQueue.prevTime < 200
                    ) {
                        //throw new Entry.Utils.AsyncError();
                        return Entry.hw.sendQueue.prevResult;
                    }
                }

                Entry.Robotis_carCont.setRobotisData([
                    [data_instruction, data_address, data_length, data_value, data_default_length],
                ]);
                // Entry.hw.socket.send(JSON.stringify(Entry.hw.sendQueue));
                Entry.Robotis_carCont.update();

                var result = Entry.hw.portData[sensor_name];
                Entry.hw.sendQueue.prevAddress = data_default_address;
                Entry.hw.sendQueue.prevTime = new Date();
                Entry.hw.sendQueue.prevResult = result;

                return result;
            },
            syntax: { js: [], py: ['Robotis.opencm70_sensor_value(%1)'] },
        },
        robotis_openCM70_aux_sensor_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['3', 'PORT_3'],
                        ['4', 'PORT_4'],
                        ['5', 'PORT_5'],
                        ['6', 'PORT_6'],
                    ],
                    value: 'PORT_3',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.robotis_aux_servo_position, 'AUX_SERVO_POSITION'],
                        [Lang.Blocks.robotis_aux_ir, 'AUX_IR'],
                        [Lang.Blocks.robotis_aux_touch, 'AUX_TOUCH'],
                        [Lang.Blocks.robotis_aux_brightness, 'AUX_BRIGHTNESS'],
                        [Lang.Blocks.robotis_aux_hydro_themo_humidity, 'AUX_HYDRO_THEMO_HUMIDITY'],
                        [Lang.Blocks.robotis_aux_hydro_themo_temper, 'AUX_HYDRO_THEMO_TEMPER'],
                        [Lang.Blocks.robotis_aux_temperature, 'AUX_TEMPERATURE'],
                        [Lang.Blocks.robotis_aux_ultrasonic, 'AUX_ULTRASONIC'],
                        [Lang.Blocks.robotis_aux_magnetic, 'AUX_MAGNETIC'],
                        [Lang.Blocks.robotis_aux_motion_detection, 'AUX_MOTION_DETECTION'],
                        [Lang.Blocks.robotis_aux_color, 'AUX_COLOR'],
                        [Lang.Blocks.robotis_aux_custom, 'AUX_CUSTOM'],
                    ],
                    value: 'AUX_SERVO_POSITION',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [null, null],
                type: 'robotis_openCM70_aux_sensor_value',
            },
            paramsKeyMap: {
                PORT: 0,
                SENSOR: 1,
            },
            class: 'robotis_openCM70_cm',
            isNotFor: ['robotis_openCM70', 'robotis_openCM70EDU'],
            func: function(sprite, script) {
                var scope = script.executor.scope;

                // instruction / address / length / value / default length
                var data_instruction = Entry.Robotis_openCM70.INSTRUCTION.READ;
                var data_address = 0;
                var data_length = 0;
                var data_value = 0;

                var data_default_address = 0;
                var data_default_length = 0;

                var port = script.getStringField('PORT');
                var sensor = script.getStringField('SENSOR');

                var aux_name = '';

                var increase = 0;
                if (port == 'PORT_3') {
                    increase = 2;
                } else if (port == 'PORT_4') {
                    increase = 3;
                } else if (port == 'PORT_5') {
                    increase = 4;
                } else if (port == 'PORT_6') {
                    increase = 5;
                }

                if (sensor == 'AUX_SERVO_POSITION') {
                    data_default_address =
                        Entry.Robotis_openCM70.CONTROL_TABLE.AUX_SERVO_POSITION[0];
                    data_default_length =
                        Entry.Robotis_openCM70.CONTROL_TABLE.AUX_SERVO_POSITION[1];
                    data_address = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_SERVO_POSITION[0];
                    data_length = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_SERVO_POSITION[1];
                    aux_name = 'LIGHT' + (increase-2);
                } else if (sensor == 'AUX_IR') {
                    data_default_address = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_IR[0];
                    data_default_length = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_IR[1];
                    data_address = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_IR[0];
                    data_length = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_IR[1];
                    aux_name = 'IR' + (increase-2);
                } else if (sensor == 'AUX_TOUCH') {
                    data_default_address = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_TOUCH[0];
                    data_default_length = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_TOUCH[1];
                    data_address = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_TOUCH[0];
                    data_length = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_TOUCH[1];
                    aux_name = 'TOUCH' + (increase-2);
                } else if (sensor == 'AUX_TEMPERATURE') {
                    data_default_address = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_TEMPERATURE[0];
                    data_default_length = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_TEMPERATURE[1];
                    data_address = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_TEMPERATURE[0];
                    data_length = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_TEMPERATURE[1];
                    aux_name = 'TEMPERATURE' + (increase-2);
                } else if (sensor == 'AUX_BRIGHTNESS') {
                    data_default_address = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_BRIGHTNESS[0];
                    data_default_length = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_BRIGHTNESS[1];
                    data_address = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_BRIGHTNESS[0];
                    data_length = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_BRIGHTNESS[1];
                    aux_name = 'LIGHT' + (increase-2);
                } else if (sensor == 'AUX_HYDRO_THEMO_HUMIDITY') {
                    data_default_address =
                        Entry.Robotis_openCM70.CONTROL_TABLE.AUX_HYDRO_THEMO_HUMIDITY[0];
                    data_default_length =
                        Entry.Robotis_openCM70.CONTROL_TABLE.AUX_HYDRO_THEMO_HUMIDITY[1];
                    data_address = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_HYDRO_THEMO_HUMIDITY[0];
                    data_length = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_HYDRO_THEMO_HUMIDITY[1];
                    aux_name = 'HUMIDTY' + (increase-2);
                } else if (sensor == 'AUX_HYDRO_THEMO_TEMPER') {
                    data_default_address =
                        Entry.Robotis_openCM70.CONTROL_TABLE.AUX_HYDRO_THEMO_TEMPER[0];
                    data_default_length =
                        Entry.Robotis_openCM70.CONTROL_TABLE.AUX_HYDRO_THEMO_TEMPER[1];
                    data_address = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_HYDRO_THEMO_TEMPER[0];
                    data_length = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_HYDRO_THEMO_TEMPER[1];
                    aux_name = 'HT_TEMPERATURE' + (increase-2);
                } else if (sensor == 'AUX_ULTRASONIC') {
                    data_default_address = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_ULTRASONIC[0];
                    data_default_length = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_ULTRASONIC[1];
                    data_address = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_ULTRASONIC[0];
                    data_length = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_ULTRASONIC[1];
                    aux_name = 'ULTRASONIC' + (increase-2);
                } else if (sensor == 'AUX_MAGNETIC') {
                    data_default_address = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_MAGNETIC[0];
                    data_default_length = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_MAGNETIC[1];
                    data_address = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_MAGNETIC[0];
                    data_length = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_MAGNETIC[1];
                    aux_name = 'MAGNETIC' + (increase-2);
                } else if (sensor == 'AUX_MOTION_DETECTION') {
                    data_default_address =
                        Entry.Robotis_openCM70.CONTROL_TABLE.AUX_MOTION_DETECTION[0];
                    data_default_length =
                        Entry.Robotis_openCM70.CONTROL_TABLE.AUX_MOTION_DETECTION[1];
                    data_address = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_MOTION_DETECTION[0];
                    data_length = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_MOTION_DETECTION[1];
                    aux_name = 'MOTION' + (increase-2);
                } else if (sensor == 'AUX_COLOR') {
                    data_default_address = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_COLOR[0];
                    data_default_length = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_COLOR[1];
                    data_address = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_COLOR[0];
                    data_length = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_COLOR[1];
                    aux_name = 'COLOR' + (increase-2);
                } else if (sensor == 'AUX_CUSTOM') {
                    data_default_address = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_CUSTOM[0];
                    data_default_length = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_CUSTOM[1];
                    data_address = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_CUSTOM[0];
                    data_length = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_CUSTOM[1];
                    aux_name = 'LIGHT' + (increase-2);
                }

                data_default_address = data_default_address + increase * data_default_length;
                data_address = data_default_address;
                // if (increase != 0) {
                // data_length = 6 * data_default_length;
                // }

                if (
                    Entry.hw.sendQueue.prevAddress &&
                    Entry.hw.sendQueue.prevAddress == data_default_address
                ) {
                    if (
                        Entry.hw.sendQueue.prevTime &&
                        new Date() - Entry.hw.sendQueue.prevTime < 200
                    ) {
                        //throw new Entry.Utils.AsyncError();
                        return Entry.hw.sendQueue.prevResult;
                    }
                }

                Entry.Robotis_carCont.setRobotisData([
                    [data_instruction, data_address, data_length, data_value, data_default_length],
                ]);
                // Entry.hw.socket.send(JSON.stringify(Entry.hw.sendQueue));
                Entry.Robotis_carCont.update();

                var result = Entry.hw.portData[aux_name];
                if (result == undefined)
                {
                    result = opencm70_last_valid_value[data_default_address];
                }
                else
                {
                    if (sensor == 'AUX_SERVO_POSITION') {
                        if (result < 0) result = 0;
                        else if (result > 1023) result = 1023;

                        result = (512 - result) * 300 / 1023;

                        result = Math.floor(result * 9 / 8);

                        if (result > 150) result = 150;
                        else if (result < -150) result = -150;
                    }
                    opencm70_last_valid_value[data_default_address] = result;
                }
                Entry.hw.sendQueue.prevAddress = data_default_address;
                Entry.hw.sendQueue.prevTime = new Date();
                Entry.hw.sendQueue.prevResult = result;

                return result;
            },
            syntax: {
                js: [],
                py: ['Robotis.opencm70_aux_sensor_value(%1, %2)'],
            },
        },
        robotis_openCM70_cm_buzzer_index: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.General.note_a + '(0)', '0'],
                        [Lang.General.note_a + '#(1)', '1'],
                        [Lang.General.note_b + '(2)', '2'],
                        [Lang.General.note_c + '(3)', '3'],
                        [Lang.General.note_c + '#(4)', '4'],
                        [Lang.General.note_d + '(5)', '5'],
                        [Lang.General.note_d + '#(6)', '6'],
                        [Lang.General.note_e + '(7)', '7'],
                        [Lang.General.note_f + '(8)', '8'],
                        [Lang.General.note_f + '#(9)', '9'],
                        [Lang.General.note_g + '(10)', '10'],
                        [Lang.General.note_g + '#(11)', '11'],
                        [Lang.General.note_a + '(12)', '12'],
                        [Lang.General.note_a + '#(13)', '13'],
                        [Lang.General.note_b + '(14)', '14'],
                        [Lang.General.note_c + '(15)', '15'],
                        [Lang.General.note_c + '#(16)', '16'],
                        [Lang.General.note_d + '(17)', '17'],
                        [Lang.General.note_d + '#(18)', '18'],
                        [Lang.General.note_e + '(19)', '19'],
                        [Lang.General.note_f + '(20)', '20'],
                        [Lang.General.note_f + '#(21)', '21'],
                        [Lang.General.note_g + '(22)', '22'],
                        [Lang.General.note_g + '#(23)', '23'],
                        [Lang.General.note_a + '(24)', '24'],
                        [Lang.General.note_a + '#(25)', '25'],
                        [Lang.General.note_b + '(26)', '26'],
                        [Lang.General.note_c + '(27)', '27'],
                        [Lang.General.note_c + '#(28)', '28'],
                        [Lang.General.note_d + '(29)', '29'],
                        [Lang.General.note_d + '#(30)', '30'],
                        [Lang.General.note_e + '(31)', '31'],
                        [Lang.General.note_f + '(32)', '32'],
                        [Lang.General.note_f + '#(33)', '33'],
                        [Lang.General.note_g + '(34)', '34'],
                        [Lang.General.note_g + '#(35)', '35'],
                        [Lang.General.note_a + '(36)', '36'],
                        [Lang.General.note_a + '#(37)', '37'],
                        [Lang.General.note_b + '(38)', '38'],
                        [Lang.General.note_c + '(39)', '39'],
                        [Lang.General.note_c + '#(40)', '40'],
                        [Lang.General.note_d + '(41)', '41'],
                        [Lang.General.note_d + '#(42)', '42'],
                        [Lang.General.note_e + '(43)', '43'],
                        [Lang.General.note_f + '(44)', '44'],
                        [Lang.General.note_f + '#(45)', '45'],
                        [Lang.General.note_g + '(46)', '46'],
                        [Lang.General.note_g + '#(47)', '47'],
                        [Lang.General.note_a + '(48)', '48'],
                        [Lang.General.note_a + '#(49)', '49'],
                        [Lang.General.note_b + '(50)', '50'],
                        [Lang.General.note_c + '(51)', '51'],
                    ],
                    value: '0',
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
                    null,
                ],
                type: 'robotis_openCM70_cm_buzzer_index',
            },
            paramsKeyMap: {
                CM_BUZZER_INDEX: 0,
                CM_BUZZER_TIME: 1,
            },
            class: 'robotis_openCM70_cm',
            isNotFor: ['robotis_openCM70', 'robotis_openCM70EDU'],
            func: function(sprite, script) {
                // instruction / address / length / value / default length
                var cmBuzzerIndex = script.getField('CM_BUZZER_INDEX', script);
                var cmBuzzerTime = script.getNumberValue('CM_BUZZER_TIME', script);

                var data_instruction = Entry.Robotis_openCM70.INSTRUCTION.WRITE;
                var data_address_1 = 0;
                var data_length_1 = 0;
                var data_value_1 = 0;
                var data_address_2 = 0;
                var data_length_2 = 0;
                var data_value_2 = 0;
                var interval = 100;

                data_address_1 = Entry.Robotis_openCM70.CONTROL_TABLE.CM_BUZZER_TIME[0];
                data_length_1 = Entry.Robotis_openCM70.CONTROL_TABLE.CM_BUZZER_TIME[1];
                // data_value_1 = cmBuzzerTime * 10;
                // TODO 텍스트 입력으로 바꾸고 최대는 5초 : 0.5 초 하려면 5를 입력  - console.log(parseInt(0.59 * 10)); max 는 5초
                data_value_1 = parseInt(cmBuzzerTime * 10);
                if (data_value_1 > 50) {
                    data_value_1 = 50;
                }

                data_address_2 = Entry.Robotis_openCM70.CONTROL_TABLE.CM_BUZZER_INDEX[0];
                data_length_2 = Entry.Robotis_openCM70.CONTROL_TABLE.CM_BUZZER_INDEX[1];
                data_value_2 = cmBuzzerIndex;

                var data_sendqueue = [
                    [data_instruction, data_address_1, data_length_1, data_value_1],
                    [data_instruction, data_address_2, data_length_2, data_value_2],
                ];
                return Entry.Robotis_carCont.postCallReturn(
                    script,
                    data_sendqueue,
                    cmBuzzerTime * 1000 + interval
                );
            },
            syntax: {
                js: [],
                py: ['Robotis.opencm70_cm_buzzer_index(%1, %2)'],
            },
        },
        robotis_openCM70_cm_buzzer_melody: {
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
                        ['10', '10'],
                        ['11', '11'],
                        ['12', '12'],
                        ['13', '13'],
                        ['14', '14'],
                        ['15', '15'],
                        ['16', '16'],
                        ['17', '17'],
                        ['18', '18'],
                        ['19', '19'],
                        ['20', '20'],
                        ['21', '21'],
                        ['22', '22'],
                        ['23', '23'],
                        ['24', '24'],
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
                params: [null, null],
                type: 'robotis_openCM70_cm_buzzer_melody',
            },
            paramsKeyMap: {
                CM_BUZZER_MELODY: 0,
            },
            class: 'robotis_openCM70_cm',
            isNotFor: ['robotis_openCM70', 'robotis_openCM70EDU'],
            func: function(sprite, script) {
                // instruction / address / length / value / default length
                var cmBuzzerMelody = script.getField('CM_BUZZER_MELODY', script);

                var data_instruction = Entry.Robotis_openCM70.INSTRUCTION.WRITE;
                var data_address_1 = 0;
                var data_length_1 = 0;
                var data_value_1 = 0;
                var data_address_2 = 0;
                var data_length_2 = 0;
                var data_value_2 = 0;
                var interval = 100;

                data_address_1 = Entry.Robotis_openCM70.CONTROL_TABLE.CM_BUZZER_TIME[0];
                data_length_1 = Entry.Robotis_openCM70.CONTROL_TABLE.CM_BUZZER_TIME[1];
                data_value_1 = 255;

                data_address_2 = Entry.Robotis_openCM70.CONTROL_TABLE.CM_BUZZER_INDEX[0];
                data_length_2 = Entry.Robotis_openCM70.CONTROL_TABLE.CM_BUZZER_INDEX[1];
                data_value_2 = cmBuzzerMelody;

                var data_sendqueue = [
                    [data_instruction, data_address_1, data_length_1, data_value_1],
                    [data_instruction, data_address_2, data_length_2, data_value_2],
                ];
                return Entry.Robotis_carCont.postCallReturn(
                    script,
                    data_sendqueue,
                    1000 + interval
                );
            },
            syntax: { js: [], py: ['Robotis.opencm70_cm_buzzer_melody(%1)'] },
        },
        robotis_openCM70_cm_sound_detected_clear: {
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
                type: 'robotis_openCM70_cm_sound_detected_clear',
            },
            class: 'robotis_openCM70_cm',
            isNotFor: ['robotis_openCM70', 'robotis_openCM70EDU'],
            func: function(sprite, script) {
                // instruction / address / length / value / default length

                var data_instruction = Entry.Robotis_openCM70.INSTRUCTION.WRITE;
                var data_address = 0;
                var data_length = 0;
                var data_value = 0;

                data_address = Entry.Robotis_openCM70.CONTROL_TABLE.CM_SOUND_DETECTED[0];
                data_length = Entry.Robotis_openCM70.CONTROL_TABLE.CM_SOUND_DETECTED[1];
                data_value = 0;

                var data_sendqueue = [[data_instruction, data_address, data_length, data_value]];
                return Entry.Robotis_carCont.postCallReturn(
                    script,
                    data_sendqueue,
                    Entry.Robotis_openCM70.delay
                );
            },
            syntax: { js: [], py: ['Robotis.opencm70_cm_sound_clear()'] },
        },
        robotis_openCM70_cm_led: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.robotis_common_red_color, 'CM_LED_R'],
                        [Lang.Blocks.robotis_common_green_color, 'CM_LED_G'],
                        [Lang.Blocks.robotis_common_blue_color, 'CM_LED_B'],
                    ],
                    value: 'CM_LED_R',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.robotis_common_on, '1'],
                        [Lang.Blocks.robotis_common_off, '0'],
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
                type: 'robotis_openCM70_cm_led',
            },
            paramsKeyMap: {
                CM_LED: 0,
                VALUE: 1,
            },
            class: 'robotis_openCM70_cm',
            isNotFor: ['robotis_openCM70', 'robotis_openCM70EDU'],
            func: function(sprite, script) {
                // instruction / address / length / value / default length
                var cmLed = script.getField('CM_LED', script);
                var value = script.getField('VALUE', script);

                var data_instruction = Entry.Robotis_openCM70.INSTRUCTION.WRITE;
                var data_address = 0;
                var data_length = 0;
                var data_value = 0;

                if (cmLed == 'CM_LED_R') {
                    data_address = Entry.Robotis_openCM70.CONTROL_TABLE.CM_LED_R[0];
                    data_length = Entry.Robotis_openCM70.CONTROL_TABLE.CM_LED_R[1];
                } else if (cmLed == 'CM_LED_G') {
                    data_address = Entry.Robotis_openCM70.CONTROL_TABLE.CM_LED_G[0];
                    data_length = Entry.Robotis_openCM70.CONTROL_TABLE.CM_LED_G[1];
                } else if (cmLed == 'CM_LED_B') {
                    data_address = Entry.Robotis_openCM70.CONTROL_TABLE.CM_LED_B[0];
                    data_length = Entry.Robotis_openCM70.CONTROL_TABLE.CM_LED_B[1];
                }

                data_value = value;

                var data_sendqueue = [[data_instruction, data_address, data_length, data_value]];
                return Entry.Robotis_carCont.postCallReturn(
                    script,
                    data_sendqueue,
                    Entry.Robotis_openCM70.delay
                );
            },
            syntax: { js: [], py: ['Robotis.opencm70_cm_led(%1, %2)'] },
        },
        /*
        robotis_openCM70_cm_motion: {
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
                        type: 'number',
                        params: ['1'],
                    },
                    null,
                ],
                type: 'robotis_openCM70_cm_motion',
            },
            paramsKeyMap: {
                VALUE: 0,
            },
            class: 'robotis_openCM70_cm',
            isNotFor: ['robotis_openCM70', 'robotis_openCM70EDU'],
            func: function(sprite, script) {
                // instruction / address / length / value / default length
                var data_instruction = Entry.Robotis_openCM70.INSTRUCTION.WRITE;
                var data_address = 0;
                var data_length = 0;
                var data_value = 0;

                data_address = Entry.Robotis_openCM70.CONTROL_TABLE.CM_MOTION[0];
                data_length = Entry.Robotis_openCM70.CONTROL_TABLE.CM_MOTION[1];
                data_value = script.getNumberValue('VALUE', script);

                var data_sendqueue = [[data_instruction, data_address, data_length, data_value]];
                return Entry.Robotis_carCont.postCallReturn(
                    script,
                    data_sendqueue,
                    Entry.Robotis_openCM70.delay
                );
            },
            syntax: { js: [], py: ['Robotis.opencm70_cm_motion(%1)'] },
        },
        */
        robotis_openCM70_cm_autodrive_motor: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.robotis_common_left, 'CM_LEFT'],
                        [Lang.Blocks.robotis_common_right, 'CM_RIGHT'],
                    ],
                    value: 'CM_LEFT',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.robotis_common_port_1, '1'],
                        [Lang.Blocks.robotis_common_port_2, '2'],
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
                type: 'robotis_openCM70_cm_autodrive_motor',
            },
            paramsKeyMap: {
                CM_MOTOR_POSITION: 0,
                PORT_NUM: 1,
            },
            class: 'robotis_openCM70_cm',
            isNotFor: ['robotis_openCM70', 'robotis_openCM70EDU'],
            func: function(sprite, script) {
                // instruction / address / length / value / default length
                var motor_position = script.getField('CM_MOTOR_POSITION', script);
                var port_num = script.getField('PORT_NUM', script);

                var data_instruction = Entry.Robotis_openCM70.INSTRUCTION.WRITE;
                var data_address = 0;
                var data_length = 0;
                var data_value = 0;

                if (motor_position == 'CM_LEFT') {
                    data_address = Entry.Robotis_openCM70.CONTROL_TABLE.CM_AUTODRIVE_LEFT_MOTOR_PORT[0];
                    data_length = Entry.Robotis_openCM70.CONTROL_TABLE.CM_AUTODRIVE_LEFT_MOTOR_PORT[1];
                } else if (motor_position == 'CM_RIGHT') {
                    data_address = Entry.Robotis_openCM70.CONTROL_TABLE.CM_AUTODRIVE_RIGHT_MOTOR_PORT[0];
                    data_length = Entry.Robotis_openCM70.CONTROL_TABLE.CM_AUTODRIVE_RIGHT_MOTOR_PORT[1];
                }

                data_value = port_num;

                var data_sendqueue = [[data_instruction, data_address, data_length, data_value]];
                return Entry.Robotis_carCont.postCallReturn(
                    script,
                    data_sendqueue,
                    Entry.Robotis_openCM70.delay
                );
            },
            syntax: { js: [], py: ['Robotis.opencm70_cm_autodrive_motor_port(%1, %2)'] },
        },
        robotis_openCM70_cm_autodrive_ir: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.robotis_common_left, 'CM_LEFT'],
                        [Lang.Blocks.robotis_common_right, 'CM_RIGHT'],
                    ],
                    value: 'CM_LEFT',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.robotis_common_port_3, '3'],
                        [Lang.Blocks.robotis_common_port_4, '4'],
                        [Lang.Blocks.robotis_common_port_5, '5'],
                        [Lang.Blocks.robotis_common_port_6, '6'],
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
                params: [null, null, null],
                type: 'robotis_openCM70_cm_autodrive_ir',
            },
            paramsKeyMap: {
                CM_IR_POSITION: 0,
                PORT_NUM: 1,
            },
            class: 'robotis_openCM70_cm',
            isNotFor: ['robotis_openCM70', 'robotis_openCM70EDU'],
            func: function(sprite, script) {
                // instruction / address / length / value / default length
                var ir_position = script.getField('CM_IR_POSITION', script);
                var port_num = script.getField('PORT_NUM', script);

                var data_instruction = Entry.Robotis_openCM70.INSTRUCTION.WRITE;
                var data_address = 0;
                var data_length = 0;
                var data_value = 0;

                if (ir_position == 'CM_LEFT') {
                    data_address = Entry.Robotis_openCM70.CONTROL_TABLE.CM_AUTODRIVE_LEFT_IR_PORT[0];
                    data_length = Entry.Robotis_openCM70.CONTROL_TABLE.CM_AUTODRIVE_LEFT_IR_PORT[1];
                } else if (ir_position == 'CM_RIGHT') {
                    data_address = Entry.Robotis_openCM70.CONTROL_TABLE.CM_AUTODRIVE_RIGHT_IR_PORT[0];
                    data_length = Entry.Robotis_openCM70.CONTROL_TABLE.CM_AUTODRIVE_RIGHT_IR_PORT[1];
                }

                data_value = port_num;

                var data_sendqueue = [[data_instruction, data_address, data_length, data_value]];
                return Entry.Robotis_carCont.postCallReturn(
                    script,
                    data_sendqueue,
                    Entry.Robotis_openCM70.delay
                );
            },
            syntax: { js: [], py: ['Robotis.opencm70_cm_autodrive_ir_port(%1, %2)'] },
        },
        robotis_openCM70_cm_autodrive_speed: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['100%', '100'],
                        ['90%', '90'],
                        ['80%', '80'],
                        ['70%', '70'],
                        ['60%', '60'],
                        ['50%', '50'],
                        ['40%', '40'],
                        ['30%', '30'],
                        ['20%', '20'],
                        ['10%', '10'],
                        ['0%', '0'],
                    ],
                    value: '80',
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
                type: 'robotis_openCM70_cm_autodrive_speed',
            },
            paramsKeyMap: {
                CM_AUTODRIVE_SPEED: 0,
            },
            class: 'robotis_openCM70_cm',
            isNotFor: ['robotis_openCM70', 'robotis_openCM70EDU'],
            func: function(sprite, script) {
                // instruction / address / length / value / default length
                var autodrive_speed = script.getField('CM_AUTODRIVE_SPEED', script);

                var data_instruction = Entry.Robotis_openCM70.INSTRUCTION.WRITE;
                var data_address = 0;
                var data_length = 0;
                var data_value = 0;

                data_address = Entry.Robotis_openCM70.CONTROL_TABLE.CM_AUTODRIVE[0];
                data_length = Entry.Robotis_openCM70.CONTROL_TABLE.CM_AUTODRIVE[1];
                data_value = autodrive_speed;

                var data_sendqueue = [[data_instruction, data_address, data_length, data_value]];
                return Entry.Robotis_carCont.postCallReturn(
                    script,
                    data_sendqueue,
                    Entry.Robotis_openCM70.delay
                );
            },
            syntax: { js: [], py: ['Robotis.opencm70_cm_autodrive_speed(%1)'] },
        },
        robotis_openCM70_aux_motor_speed: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.robotis_common_port_1, '1'],
                        [Lang.Blocks.robotis_common_port_2, '2'],
                    ],
                    value: '1',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.robotis_common_clockwhise, 'CW'],
                        [Lang.Blocks.robotis_common_counter_clockwhise, 'CCW'],
                    ],
                    value: 'CW',
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
                        type: 'number',
                        params: ['50'],
                    },
                    null,
                ],
                type: 'robotis_openCM70_aux_motor_speed',
            },
            paramsKeyMap: {
                PORT: 0,
                DIRECTION_ANGLE: 1,
                VALUE: 2,
            },
            class: 'robotis_openCM70_cm',
            isNotFor: ['robotis_openCM70', 'robotis_openCM70EDU'],
            func: function(sprite, script) {
                // instruction / address / length / value / default length
                var port = script.getField('PORT', script);
                var directionAngle = script.getField('DIRECTION_ANGLE', script);
                var value = script.getNumberValue('VALUE');

                var data_instruction = Entry.Robotis_openCM70.INSTRUCTION.WRITE;
                var data_address = 0;
                var data_length = 0;
                var data_value = 0;

                data_address = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_MOTOR_SPEED[0];
                data_length = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_MOTOR_SPEED[1];

                data_address = data_address + (port - 1) * data_length;

                if (value < 0) value = 0;
                else if (value > 100) value = 100;

                value = Math.floor(value * 1023 / 100);

                if (directionAngle == 'CW') {
                    value = value + 1024;
                    if (value > 2047) {
                        value = 2047;
                    }
                } else {
                    if (value > 1023) {
                        value = 1023;
                    }
                }

                data_value = value;

                var data_sendqueue = [[data_instruction, data_address, data_length, data_value]];
                return Entry.Robotis_carCont.postCallReturn(
                    script,
                    data_sendqueue,
                    Entry.Robotis_openCM70.delay
                );
            },
            syntax: {
                js: [],
                py: ['Robotis.opencm70_aux_motor_speed(%1, %2, %3)'],
            },
        },
        robotis_openCM70_aux_servo_mode: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.robotis_common_port_3, '3'],
                        [Lang.Blocks.robotis_common_port_4, '4'],
                        [Lang.Blocks.robotis_common_port_5, '5'],
                        [Lang.Blocks.robotis_common_port_6, '6'],
                    ],
                    value: '3',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.robotis_common_wheel_mode, '0'],
                        [Lang.Blocks.robotis_common_joint_mode, '1'],
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
                params: [null, null, null],
                type: 'robotis_openCM70_aux_servo_mode',
            },
            paramsKeyMap: {
                PORT: 0,
                MODE: 1,
            },
            class: 'robotis_openCM70_cm',
            isNotFor: ['robotis_openCM70', 'robotis_openCM70EDU'],
            func: function(sprite, script) {
                // instruction / address / length / value / default length
                var port = script.getField('PORT', script);
                var mode = script.getField('MODE', script);

                var data_instruction = Entry.Robotis_openCM70.INSTRUCTION.WRITE;
                var data_address = 0;
                var data_length = 0;
                var data_value = 0;

                data_address = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_SERVO_MODE[0];
                data_length = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_SERVO_MODE[1];

                data_address = data_address + (port - 1) * data_length;
                data_value = mode;

                var data_sendqueue = [[data_instruction, data_address, data_length, data_value]];
                return Entry.Robotis_carCont.postCallReturn(
                    script,
                    data_sendqueue,
                    Entry.Robotis_openCM70.delay
                );
            },
            syntax: { js: [], py: ['Robotis.opencm70_aux_servo_mode(%1, %2)'] },
        },
        robotis_openCM70_aux_servo_speed: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.robotis_common_port_3, '3'],
                        [Lang.Blocks.robotis_common_port_4, '4'],
                        [Lang.Blocks.robotis_common_port_5, '5'],
                        [Lang.Blocks.robotis_common_port_6, '6'],
                    ],
                    value: '3',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.robotis_common_clockwhise, 'CW'],
                        [Lang.Blocks.robotis_common_counter_clockwhise, 'CCW'],
                    ],
                    value: 'CW',
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
                        type: 'number',
                        params: ['50'],
                    },
                    null,
                ],
                type: 'robotis_openCM70_aux_servo_speed',
            },
            paramsKeyMap: {
                PORT: 0,
                DIRECTION_ANGLE: 1,
                VALUE: 2,
            },
            class: 'robotis_openCM70_cm',
            isNotFor: ['robotis_openCM70', 'robotis_openCM70EDU'],
            func: function(sprite, script) {
                // instruction / address / length / value / default length
                var port = script.getField('PORT', script);
                var directionAngle = script.getField('DIRECTION_ANGLE', script);
                var value = script.getNumberValue('VALUE');

                var data_instruction = Entry.Robotis_openCM70.INSTRUCTION.WRITE;
                var data_address = 0;
                var data_length = 0;
                var data_value = 0;

                data_address = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_SERVO_SPEED[0];
                data_length = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_SERVO_SPEED[1];

                data_address = data_address + (port - 1) * data_length;

                if (value < 0) value = 0;
                else if (value > 100) value = 100;

                value = Math.floor(value * 1023 / 100);

                if (directionAngle == 'CW') {
                    value = value + 1024;
                    if (value > 2047) {
                        value = 2047;
                    }
                } else {
                    if (value > 1023) {
                        value = 1023;
                    }
                }

                data_value = value;

                var data_sendqueue = [[data_instruction, data_address, data_length, data_value]];
                return Entry.Robotis_carCont.postCallReturn(
                    script,
                    data_sendqueue,
                    Entry.Robotis_openCM70.delay
                );
            },
            syntax: {
                js: [],
                py: ['Robotis.opencm70_aux_servo_speed(%1, %2, %3)'],
            },
        },
        robotis_openCM70_aux_servo_position: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.robotis_common_port_3, '3'],
                        [Lang.Blocks.robotis_common_port_4, '4'],
                        [Lang.Blocks.robotis_common_port_5, '5'],
                        [Lang.Blocks.robotis_common_port_6, '6'],
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
                        type: 'number',
                        params: ['0'],
                    },
                    null,
                ],
                type: 'robotis_openCM70_aux_servo_position',
            },
            paramsKeyMap: {
                PORT: 0,
                VALUE: 1,
            },
            class: 'robotis_openCM70_cm',
            isNotFor: ['robotis_openCM70', 'robotis_openCM70EDU'],
            func: function(sprite, script) {
                // instruction / address / length / value / default length
                var port = script.getField('PORT', script);
                var value = script.getNumberValue('VALUE');

                var data_instruction = Entry.Robotis_openCM70.INSTRUCTION.WRITE;
                var data_address = 0;
                var data_length = 0;
                var data_value = 0;

                data_address = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_SERVO_POSITION[0];
                data_length = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_SERVO_POSITION[1];

                data_address = data_address + (port - 1) * data_length;

                if (value > 150) {
                    value = 150;
                } else if (value < -150) {
                    value = -150;
                }

                value = value * 8 / 9;

                data_value = 512 - Math.floor(value * 1023 / 300);

                if (data_value < 0) data_value = 0;
                else if (data_value > 1023) data_value = 1023;

                var data_sendqueue = [[data_instruction, data_address, data_length, data_value]];
                return Entry.Robotis_carCont.postCallReturn(
                    script,
                    data_sendqueue,
                    Entry.Robotis_openCM70.delay
                );
            },
            syntax: {
                js: [],
                py: ['Robotis.opencm70_aux_servo_position(%1, %2)'],
            },
        },
        robotis_openCM70_aux_led_module: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.robotis_common_port_3, '3'],
                        [Lang.Blocks.robotis_common_port_4, '4'],
                        [Lang.Blocks.robotis_common_port_5, '5'],
                        [Lang.Blocks.robotis_common_port_6, '6'],
                    ],
                    value: '3',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.robotis_cm_led_both + Lang.Blocks.robotis_common_off, '0'],
                        [Lang.Blocks.robotis_cm_led_right + Lang.Blocks.robotis_common_on, '1'],
                        [Lang.Blocks.robotis_cm_led_left + Lang.Blocks.robotis_common_on, '2'],
                        [Lang.Blocks.robotis_cm_led_both + Lang.Blocks.robotis_common_on, '3'],
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
                params: [null, null, null],
                type: 'robotis_openCM70_aux_led_module',
            },
            paramsKeyMap: {
                PORT: 0,
                LED_MODULE: 1,
            },
            class: 'robotis_openCM70_cm',
            isNotFor: ['robotis_openCM70', 'robotis_openCM70EDU'],
            func: function(sprite, script) {
                // instruction / address / length / value / default length
                var port = script.getField('PORT', script);
                var ledModule = script.getField('LED_MODULE', script);

                var data_instruction = Entry.Robotis_openCM70.INSTRUCTION.WRITE;
                var data_address = 0;
                var data_length = 0;
                var data_value = 0;

                data_address = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_LED_MODULE[0];
                data_length = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_LED_MODULE[1];

                data_address = data_address + (port - 1) * data_length;
                data_value = ledModule;

                var data_sendqueue = [[data_instruction, data_address, data_length, data_value]];
                return Entry.Robotis_carCont.postCallReturn(
                    script,
                    data_sendqueue,
                    Entry.Robotis_openCM70.delay
                );
            },
            syntax: { js: [], py: ['Robotis.opencm70_aux_led_module(%1, %2)'] },
        },
        robotis_openCM70_aux_custom: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.robotis_common_port_3, '3'],
                        [Lang.Blocks.robotis_common_port_4, '4'],
                        [Lang.Blocks.robotis_common_port_5, '5'],
                        [Lang.Blocks.robotis_common_port_6, '6'],
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
                        type: 'number',
                        params: ['0'],
                    },
                    null,
                ],
                type: 'robotis_openCM70_aux_custom',
            },
            paramsKeyMap: {
                PORT: 0,
                VALUE: 1,
            },
            class: 'robotis_openCM70_cm',
            isNotFor: ['robotis_openCM70', 'robotis_openCM70EDU'],
            func: function(sprite, script) {
                // instruction / address / length / value / default length
                var port = script.getField('PORT', script);
                var value = script.getNumberValue('VALUE');

                var data_instruction = Entry.Robotis_openCM70.INSTRUCTION.WRITE;
                var data_address = 0;
                var data_length = 0;
                var data_value = 0;

                data_address = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_CUSTOM[0];
                data_length = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_CUSTOM[1];

                data_address = data_address + (port - 1) * data_length;
                data_value = value;

                var data_sendqueue = [[data_instruction, data_address, data_length, data_value]];
                return Entry.Robotis_carCont.postCallReturn(
                    script,
                    data_sendqueue,
                    Entry.Robotis_openCM70.delay
                );
            },
            syntax: { js: [], py: ['Robotis.opencm70_aux_custom(%1, %2)'] },
        },
        robotis_openCM70_cm_poweroff_timer: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.robotis_common_off, '0'],
                        ['1' + Lang.Blocks.robotis_common_minute, '1'],
                        ['2' + Lang.Blocks.robotis_common_minute, '2'],
                        ['3' + Lang.Blocks.robotis_common_minute, '3'],
                        ['4' + Lang.Blocks.robotis_common_minute, '4'],
                        ['5' + Lang.Blocks.robotis_common_minute, '5'],
                        ['6' + Lang.Blocks.robotis_common_minute, '6'],
                        ['7' + Lang.Blocks.robotis_common_minute, '7'],
                        ['8' + Lang.Blocks.robotis_common_minute, '8'],
                        ['9' + Lang.Blocks.robotis_common_minute, '9'],
                        ['10' + Lang.Blocks.robotis_common_minute, '10'],
                        ['11' + Lang.Blocks.robotis_common_minute, '11'],
                        ['12' + Lang.Blocks.robotis_common_minute, '12'],
                        ['13' + Lang.Blocks.robotis_common_minute, '13'],
                        ['14' + Lang.Blocks.robotis_common_minute, '14'],
                        ['15' + Lang.Blocks.robotis_common_minute, '15'],
                        ['16' + Lang.Blocks.robotis_common_minute, '16'],
                        ['17' + Lang.Blocks.robotis_common_minute, '17'],
                        ['18' + Lang.Blocks.robotis_common_minute, '18'],
                        ['19' + Lang.Blocks.robotis_common_minute, '19'],
                        ['20' + Lang.Blocks.robotis_common_minute, '20'],
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
                params: [null, null],
                type: 'robotis_openCM70_cm_poweroff_timer',
            },
            paramsKeyMap: {
                CM_POWEROFF_TIMER: 0,
            },
            class: 'robotis_openCM70_cm',
            isNotFor: ['robotis_openCM70', 'robotis_openCM70EDU'],
            func: function(sprite, script) {
                // instruction / address / length / value / default length
                var cm_poweroff_timer = script.getField('CM_POWEROFF_TIMER', script);

                var data_instruction = Entry.Robotis_openCM70.INSTRUCTION.WRITE;
                var data_address = 0;
                var data_length = 0;
                var data_value = 0;

                data_address = Entry.Robotis_openCM70.CONTROL_TABLE.CM_POWEROFF_TIMER[0];
                data_length = Entry.Robotis_openCM70.CONTROL_TABLE.CM_POWEROFF_TIMER[1];
                data_value = cm_poweroff_timer;

                var data_sendqueue = [
                    [data_instruction, data_address, data_length, data_value],
                ];
                return Entry.Robotis_carCont.postCallReturn(
                    script,
                    data_sendqueue,
                    Entry.Robotis_openCM70.delay
                );
            },
            syntax: { js: [], py: ['Robotis.opencm70_cm_poweroff_timer(%1)'] },
        },
        robotis_openCM70_cm_custom: {
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
                        type: 'number',
                        params: ['0'],
                    },
                    {
                        type: 'number',
                        params: ['0'],
                    },
                    null,
                ],
                type: 'robotis_openCM70_cm_custom',
            },
            paramsKeyMap: {
                ADDRESS: 0,
                VALUE: 1,
            },
            class: 'robotis_openCM70_custom',
            isNotFor: ['robotis_openCM70', 'robotis_openCM70EDU'],
            func: function(sprite, script) {
                // instruction / address / length / value / default length
                var data_instruction = Entry.Robotis_openCM70.INSTRUCTION.WRITE;
                var data_address = 0;
                var data_length = 0;
                var data_value = 0;

                data_address = script.getNumberValue('ADDRESS');
                data_value = script.getNumberValue('VALUE');
                if (data_value > 65535) {
                    data_length = 4;
                } else if (data_value > 255) {
                    data_length = 2;
                } else {
                    data_length = 1;
                }

                var data_sendqueue = [[data_instruction, data_address, data_length, data_value]];
                return Entry.Robotis_carCont.postCallReturn(
                    script,
                    data_sendqueue,
                    Entry.Robotis_openCM70.delay
                );
            },
            syntax: { js: [], py: ['Robotis.opencm70_cm_custom(%1, %2)'] },
        },
        //endregion robotis 로보티즈
    };
};

Entry.Robotis_openCM70.practicalBlockMenuBlocks = {
    hw_motor: [
        'robotis_aux_move_for',
        'robotis_aux_stop_for',
        'robotis_set_servo_joint',
        'robotis_set_servo_wheel',
        'robotis_move_for_secs',
    ],
    hw_melody: [
        'robotis_melody_note_for',
    ],
    hw_sensor: [
        'robotis_touch_value',
        'robotis_touch_value_boolean',
        'robotis_irs_value',
        'robotis_irs_value_boolean',
        'robotis_light_value',
        'robotis_light_value_boolean',
        'robotis_detectedsound_value',
        'robotis_detectingsound_value',
        'robotis_detectedsound_value_boolean',
        'robotis_detectingsound_value_boolean',
        'robotis_detectedsound_value_init',
        'robotis_color_value',
        'robotis_color_value_boolean',
        'robotis_humidity_value',
        'robotis_humidity_value_boolean',
        'robotis_temperature_value',
        'robotis_temperature_value_boolean',
        'robotis_userbutton_value',
        'robotis_userbutton_value_boolean',
    ],
    hw_led: [
        'robotis_set_led',
    ],
}

Entry.Robotis_openCM70.getPracticalBlocks = function() {
    return{
        robotis_set_led: {
            color: '#2AB4D3',
            outerLine: '#0e93b1',
            skeleton: 'basic',
            fontColor: '#fff',
            statements: [],
            isNotFor: ['robotis_openCM70', 'robotis_openCM70EDU'],
            template: '%1번 포트 LED를 %2 %3',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['PORT 3', '3'],
                        ['PORT 4', '4'],
                        ['PORT 5', '5'],
                        ['PORT 6', '6'],
                    ],
                    value: '3',
                    fontSize: 11,
                    bgColor: '#0e93b1',
                    arrowColor: EntryStatic.colorSet.common.WHITE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        ['모두 끄기', '0'],
                        ['노랑색 켜기', '1'],
                        ['파랑색 켜기', '2'],
                        ['모두 켜기', '3'],
                    ],
                    value: '0',
                    fontSize: 11,
                    bgColor: '#0e93b1',
                    arrowColor: EntryStatic.colorSet.common.WHITE,
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/practical_course/light.png',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'robotis_set_led',
            },
            paramsKeyMap: {
                PORT: 0,
                COLOR: 1,
            },
            class: 'robotis_led',
            func(sprite, script) {
                Entry.hw.sendQueue.IS_EDU = true;
    
                const port = script.getStringField('PORT');
                const value = 0;
                const data_instruction = Entry.Robotis_openCM70.INSTRUCTION.WRITE;
                let data_address = 0;
                const data_length = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_LED_MODULE[1];
                const data_value = script.getNumberField('COLOR');
                switch (port) {
                    case '3':
                        data_address = 212;
                        break;
                    case '4':
                        data_address = 213;
                        break;
                    case '5':
                        data_address = 214;
                        break;
                    case '6':
                        data_address = 215;
                        break;
                }
                const data_sendqueue = [[data_instruction, data_address, data_length, data_value]];
                //Entry.Robotis_carCont.setRobotisData(data_sendqueue);
                //Entry.Robotis_carCont.update();
                return Entry.Robotis_carCont.postCallReturn(
                    script,
                    data_sendqueue,
                    Entry.Robotis_openCM70.delay
                );
            },
        },
        robotis_touch_value: {
            color: '#2AB4D3',
            outerLine: '#0e93b1',
            skeleton: 'basic_string_field',
            fontColor: '#fff',
            statements: [],
            isNotFor: ['robotis_openCM70', 'robotis_openCM70EDU'],
            template: '%1번 포트 접촉 센서 값',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['PORT 3', '3'],
                        ['PORT 4', '4'],
                        ['PORT 5', '5'],
                        ['PORT 6', '6'],
                    ],
                    value: '3',
                    fontSize: 11,
                    bgColor: '#0e93b1',
                    arrowColor: EntryStatic.colorSet.common.WHITE,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'robotis_touch_value',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'robotis_touch',
            func(sprite, script) {
                Entry.hw.sendQueue.IS_EDU = true;
                const port = script.getStringField('PORT');
                let value = 0;
    
                switch (port) {
                    case '3':
                        value = Entry.hw.portData.TOUCH0;
                        break;
                    case '4':
                        value = Entry.hw.portData.TOUCH1;
                        break;
                    case '5':
                        value = Entry.hw.portData.TOUCH2;
                        break;
                    case '6':
                        value = Entry.hw.portData.TOUCH3;
                        break;
                }
                return value;
            },
        },
        robotis_touch_value_boolean: {
            color: '#2AB4D3',
            outerLine: '#0e93b1',
            skeleton: 'basic_boolean_field',
            fontColor: '#fff',
            isNotFor: ['robotis_openCM70', 'robotis_openCM70EDU'],
            template: '%1번 포트 접촉 센서가 %2',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['PORT 3', '3'],
                        ['PORT 4', '4'],
                        ['PORT 5', '5'],
                        ['PORT 6', '6'],
                    ],
                    value: '3',
                    fontSize: 11,
                    bgColor: '#0e93b1',
                    arrowColor: EntryStatic.colorSet.common.WHITE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        ['접촉 되면', '1'],
                        ['접촉 안되면', '0'],
                    ],
                    value: '1',
                    fontSize: 11,
                    bgColor: '#0e93b1',
                    arrowColor: EntryStatic.colorSet.common.WHITE,
                },
            ],
            def: {
                params: [null, null, null],
                type: 'robotis_touch_value_boolean',
            },
            paramsKeyMap: {
                PORT: 0,
                TOUCH: 1,
            },
            class: 'robotis_touch',
            func(sprite, script) {
                Entry.hw.sendQueue.IS_EDU = true;
                const port = script.getStringField('PORT');
                const touch = script.getNumberField('TOUCH', script);
                let value = 0;
                switch (port) {
                    case '3':
                        value = Entry.hw.portData.TOUCH0;
                        break;
                    case '4':
                        value = Entry.hw.portData.TOUCH1;
                        break;
                    case '5':
                        value = Entry.hw.portData.TOUCH2;
                        break;
                    case '6':
                        value = Entry.hw.portData.TOUCH3;
                        break;
                }
                const isTouch = !((value == 1) ^ touch);
    
                return isTouch;
            },
        },
        robotis_irs_value: {
            color: '#C4065C',
            outerLine: '#9a0045',
            skeleton: 'basic_string_field',
            fontColor: '#fff',
            statements: [],
            isNotFor: ['robotis_openCM70', 'robotis_openCM70EDU'],
            template: '%1번 포트 적외선 센서 값',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['PORT 3', '3'],
                        ['PORT 4', '4'],
                        ['PORT 5', '5'],
                        ['PORT 6', '6'],
                    ],
                    value: '3',
                    fontSize: 11,
                    bgColor: '#9a0045',
                    arrowColor: EntryStatic.colorSet.common.WHITE,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'robotis_irs_value',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'robotis_irs',
            //'isNotFor': ['mini'],
            func(sprite, script) {
                Entry.hw.sendQueue.IS_EDU = true;
                const port = script.getStringField('PORT');
                let value = 0;
                let data_address = 0;
                switch (port) {
                    case '3':
                        value = Entry.hw.portData.IR0;
                        data_address = 108;
                        break;
                    case '4':
                        value = Entry.hw.portData.IR1;
                        data_address = 109;
                        break;
                    case '5':
                        value = Entry.hw.portData.IR2;
                        data_address = 110;
                        break;
                    case '6':
                        value = Entry.hw.portData.IR3;
                        data_address = 111;
                        break;
                }
                const data_instruction = Entry.Robotis_openCM70.INSTRUCTION.WRITE;
                const data_length = 1;
                const data_value = 2;
    
                const data_sendqueue = [[data_instruction, data_address, data_length, data_value]];
                //Entry.Robotis_carCont.setRobotisData(data_sendqueue);
                //Entry.Robotis_carCont.update();
                if (!Entry.Robotis_openCM70.IRS_MODULEWRITE.PORT3 && port == '3') {
                    Entry.Robotis_carCont.setRobotisData(data_sendqueue);
                    Entry.Robotis_carCont.update();
                    Entry.Robotis_openCM70.IRS_MODULEWRITE.PORT3 = true;
                }
                if (!Entry.Robotis_openCM70.IRS_MODULEWRITE.PORT4 && port == '4') {
                    Entry.Robotis_carCont.setRobotisData(data_sendqueue);
                    Entry.Robotis_carCont.update();
                    Entry.Robotis_openCM70.IRS_MODULEWRITE.PORT4 = true;
                }
                if (!Entry.Robotis_openCM70.IRS_MODULEWRITE.PORT5 && port == '5') {
                    Entry.Robotis_carCont.setRobotisData(data_sendqueue);
                    Entry.Robotis_carCont.update();
                    Entry.Robotis_openCM70.IRS_MODULEWRITE.PORT5 = true;
                }
                if (!Entry.Robotis_openCM70.IRS_MODULEWRITE.PORT6 && port == '6') {
                    Entry.Robotis_carCont.setRobotisData(data_sendqueue);
                    Entry.Robotis_carCont.update();
                    Entry.Robotis_openCM70.IRS_MODULEWRITE.PORT6 = true;
                }
                //var value = (Entry.hw.portData['IN' + port] > 125) ? 1 : 0;
                return value;
            },
        },
        robotis_irs_value_boolean: {
            color: '#C4065C',
            outerLine: '#9a0045',
            skeleton: 'basic_boolean_field',
            fontColor: '#fff',
            isNotFor: ['robotis_openCM70', 'robotis_openCM70EDU'],
            template: '%1번 포트 적외선 센서 값 %2 %3',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['PORT 3', '3'],
                        ['PORT 4', '4'],
                        ['PORT 5', '5'],
                        ['PORT 6', '6'],
                    ],
                    value: '3',
                    fontSize: 11,
                    bgColor: '#9a0045',
                    arrowColor: EntryStatic.colorSet.common.WHITE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        ['=', 'EQUAL'],
                        ['>', 'GREATER'],
                        ['<', 'LESS'],
                        ['≥', 'GREATER_OR_EQUAL'],
                        ['≤', 'LESS_OR_EQUAL'],
                    ],
                    value: 'LESS',
                    fontSize: 11,
                    bgColor: '#9a0045',
                    arrowColor: EntryStatic.colorSet.common.WHITE,
                    noaRrow: true,
                },
                {
                    type: 'Block',
                    accept: 'string',
                },
            ],
            def: {
                params: [
                    null,
                    null,
                    {
                        type: 'number',
                        params: ['100'],
                    },
                ],
                type: 'robotis_irs_value_boolean',
            },
            paramsKeyMap: {
                PORT: 0,
                OPERATOR: 1,
                RIGHTVALUE: 2,
            },
            class: 'robotis_irs',
            //'isNotFor': ['mini'],
            func(sprite, script) {
                Entry.hw.sendQueue.IS_EDU = true;
                const port = script.getStringField('PORT', script);
                const operator = script.getField('OPERATOR', script);
                const rightValue = script.getNumberValue('RIGHTVALUE', script);
                let leftValue = 0;
                let isCheck = false;
                let data_address = 0;
    
                switch (port) {
                    case '3':
                        leftValue = Entry.hw.portData.IR0;
                        data_address = 108;
                        break;
                    case '4':
                        leftValue = Entry.hw.portData.IR1;
                        data_address = 109;
                        break;
                    case '5':
                        leftValue = Entry.hw.portData.IR2;
                        data_address = 110;
                        break;
                    case '6':
                        leftValue = Entry.hw.portData.IR3;
                        data_address = 111;
                        break;
                }
                const data_instruction = Entry.Robotis_openCM70.INSTRUCTION.WRITE;
                const data_length = 1;
                const data_value = 2;
    
                const data_sendqueue = [[data_instruction, data_address, data_length, data_value]];
                //Entry.Robotis_carCont.setRobotisData(data_sendqueue);
                //Entry.Robotis_carCont.update();
                if (!Entry.Robotis_openCM70.IRS_MODULEWRITE.PORT3 && port == '3') {
                    Entry.Robotis_carCont.setRobotisData(data_sendqueue);
                    Entry.Robotis_carCont.update();
                    Entry.Robotis_openCM70.IRS_MODULEWRITE.PORT3 = true;
                }
                if (!Entry.Robotis_openCM70.IRS_MODULEWRITE.PORT4 && port == '4') {
                    Entry.Robotis_carCont.setRobotisData(data_sendqueue);
                    Entry.Robotis_carCont.update();
                    Entry.Robotis_openCM70.IRS_MODULEWRITE.PORT4 = true;
                }
                if (!Entry.Robotis_openCM70.IRS_MODULEWRITE.PORT5 && port == '5') {
                    Entry.Robotis_carCont.setRobotisData(data_sendqueue);
                    Entry.Robotis_carCont.update();
                    Entry.Robotis_openCM70.IRS_MODULEWRITE.PORT5 = true;
                }
                if (!Entry.Robotis_openCM70.IRS_MODULEWRITE.PORT6 && port == '6') {
                    Entry.Robotis_carCont.setRobotisData(data_sendqueue);
                    Entry.Robotis_carCont.update();
                    Entry.Robotis_openCM70.IRS_MODULEWRITE.PORT6 = true;
                }
    
                switch (operator) {
                    case 'EQUAL':
                        isCheck = leftValue == rightValue;
                        break;
                    case 'GREATER':
                        isCheck = Number(leftValue) > Number(rightValue);
                        break;
                    case 'LESS':
                        isCheck = Number(leftValue) < Number(rightValue);
                        break;
                    case 'GREATER_OR_EQUAL':
                        isCheck = Number(leftValue) >= Number(rightValue);
                        break;
                    case 'LESS_OR_EQUAL':
                        isCheck = Number(leftValue) <= Number(rightValue);
                        break;
                }
    
                return isCheck;
            },
        },
        robotis_light_value: {
            color: '#ff8d0f',
            outerLine: '#e37100',
            skeleton: 'basic_string_field',
            fontColor: '#fff',
            statements: [],
            isNotFor: ['robotis_openCM70', 'robotis_openCM70EDU'],
            template: '%1번 포트 빛 감지 센서 값',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['PORT 3', '0'],
                        ['PORT 4', '1'],
                        ['PORT 5', '2'],
                        ['PORT 6', '3'],
                    ],
                    value: '0',
                    outerLine: '#e37100',
                    fontSize: 11,
                    bgColor: '#e37100',
                    arrowColor: EntryStatic.colorSet.common.WHITE,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'robotis_light_value',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'robotis_light',
            func(sprite, script) {
                Entry.hw.sendQueue.IS_EDU = true;
                const port = script.getStringField('PORT');
                return Entry.hw.portData[`LIGHT${port}`];
            },
        },
        robotis_light_value_boolean: {
            color: '#ff8d0f',
            outerLine: '#e37100',
            skeleton: 'basic_boolean_field',
            fontColor: '#fff',
            isNotFor: ['robotis_openCM70', 'robotis_openCM70EDU'],
            template: '%1번 포트 빛 감지 센서 값 %2 %3',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['PORT 3', '0'],
                        ['PORT 4', '1'],
                        ['PORT 5', '2'],
                        ['PORT 6', '3'],
                    ],
                    value: '0',
                    fontSize: 11,
                    bgColor: '#e37100',
                    arrowColor: EntryStatic.colorSet.common.WHITE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        ['=', 'EQUAL'],
                        ['>', 'GREATER'],
                        ['<', 'LESS'],
                        ['≥', 'GREATER_OR_EQUAL'],
                        ['≤', 'LESS_OR_EQUAL'],
                    ],
                    value: 'LESS',
                    fontSize: 11,
                    bgColor: '#e37100',
                    arrowColor: EntryStatic.colorSet.common.WHITE,
                    noaRrow: true,
                },
                {
                    type: 'Block',
                    accept: 'string',
                },
            ],
            def: {
                params: [
                    null,
                    null,
                    {
                        type: 'number',
                        params: ['100'],
                    },
                ],
                type: 'robotis_light_value_boolean',
            },
            paramsKeyMap: {
                PORT: 0,
                OPERATOR: 1,
                RIGHTVALUE: 2,
            },
            class: 'robotis_light',
            func(sprite, script) {
                Entry.hw.sendQueue.IS_EDU = true;
                const port = script.getNumberField('PORT', script);
                const operator = script.getField('OPERATOR', script);
                const rightValue = script.getNumberValue('RIGHTVALUE', script);
                const leftValue = Entry.hw.portData[`LIGHT${port}`];
                let isCheck = false;
    
                switch (operator) {
                    case 'EQUAL':
                        isCheck = leftValue == rightValue;
                        break;
                    case 'GREATER':
                        isCheck = Number(leftValue) > Number(rightValue);
                        break;
                    case 'LESS':
                        isCheck = Number(leftValue) < Number(rightValue);
                        break;
                    case 'GREATER_OR_EQUAL':
                        isCheck = Number(leftValue) >= Number(rightValue);
                        break;
                    case 'LESS_OR_EQUAL':
                        isCheck = Number(leftValue) <= Number(rightValue);
                        break;
                }
    
                return isCheck;
            },
        },
        robotis_userbutton_value: {
            color: '#2AB4D3',
            outerLine: '#0e93b1',
            skeleton: 'basic_string_field',
            fontColor: '#fff',
            statements: [],
            isNotFor: ['robotis_openCM70', 'robotis_openCM70EDU'],
            template: '사용자 버튼',
            events: {},
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                },
            ],
            def: {
                params: [null],
                type: 'robotis_userbutton_value',
            },
            paramsKeyMap: {},
            class: 'robotis_userbutton',
            func(sprite, script) {
                Entry.hw.sendQueue.IS_EDU = true;
                return Entry.hw.portData.USERBUTTONSTATE;
            },
        },
        robotis_userbutton_value_boolean: {
            color: '#2AB4D3',
            skeleton: 'basic_boolean_field',
            fontColor: '#fff',
            isNotFor: ['robotis_openCM70', 'robotis_openCM70EDU'],
            template: '사용자 버튼이 %1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['접촉 되면', '1'],
                        ['접촉 안되면', '0'],
                    ],
                    value: '1',
                    fontsIze: 11,
                },
            ],
            def: {
                params: [null],
                type: 'robotis_userbutton_value_boolean',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'robotis_userbutton',
            func(sprite, script) {
                Entry.hw.sendQueue.IS_EDU = true;
                const port = script.getStringField('PORT');
                const value = Entry.hw.portData.USERBUTTONSTATE;
                var isTouch = false;
    
                var isTouch = port == value;
    
                return isTouch;
            },
        },
        robotis_detectedsound_value: {
            color: '#01d67f',
            outerLine: '#00b36a',
            skeleton: 'basic_string_field',
            fontColor: '#fff',
            statements: [],
            isNotFor: ['robotis_openCM70', 'robotis_openCM70EDU'],
            template: '소리 센서 최종 소리 횟수',
            events: {},
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                },
            ],
            def: {
                params: [null],
                type: 'robotis_detectedsound_value',
            },
            paramsKeyMap: {},
            class: 'robotis_sound',
            func(sprite, script) {
                Entry.hw.sendQueue.IS_EDU = true;
                return Entry.hw.portData.DETECTEDSOUNDE;
            },
        },
        robotis_detectedsound_value_boolean: {
            color: '#01d67f',
            outerLine: '#00b36a',
            skeleton: 'basic_boolean_field',
            fontColor: '#fff',
            isNotFor: ['robotis_openCM70', 'robotis_openCM70EDU'],
            template: '소리 센서 최종 소리 횟수 %1 %2',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['=', 'EQUAL'],
                        ['>', 'GREATER'],
                        ['<', 'LESS'],
                        ['≥', 'GREATER_OR_EQUAL'],
                        ['≤', 'LESS_OR_EQUAL'],
                    ],
                    value: 'LESS',
                    fontSize: 11,
                    bgColor: '#00b36a',
                    arrowColor: EntryStatic.colorSet.common.WHITE,
                    noaRrow: true,
                },
                {
                    type: 'Block',
                    accept: 'string',
                },
            ],
            def: {
                params: [
                    null,
                    {
                        type: 'number',
                        params: ['100'],
                    },
                ],
                type: 'robotis_detectedsound_value_boolean',
            },
            paramsKeyMap: {
                OPERATOR: 0,
                RIGHTVALUE: 1,
            },
            class: 'robotis_sound',
            func(sprite, script) {
                Entry.hw.sendQueue.IS_EDU = true;
                const operator = script.getField('OPERATOR', script);
                const rightValue = script.getNumberValue('RIGHTVALUE', script);
                const leftValue = Entry.hw.portData.DETECTEDSOUNDE;
                let isCheck = false;
    
                switch (operator) {
                    case 'EQUAL':
                        isCheck = leftValue == rightValue;
                        break;
                    case 'GREATER':
                        isCheck = Number(leftValue) > Number(rightValue);
                        break;
                    case 'LESS':
                        isCheck = Number(leftValue) < Number(rightValue);
                        break;
                    case 'GREATER_OR_EQUAL':
                        isCheck = Number(leftValue) >= Number(rightValue);
                        break;
                    case 'LESS_OR_EQUAL':
                        isCheck = Number(leftValue) <= Number(rightValue);
                        break;
                }
    
                return isCheck;
            },
        },
        robotis_detectedsound_value_init: {
            color: '#00D67F',
            outerLine: '#00b36a',
            skeleton: 'basic',
            fontColor: '#fff',
            statements: [],
            isNotFor: ['robotis_openCM70', 'robotis_openCM70EDU'],
            template: '소리 센서 최종 소리 횟수 초기화 %1',
            params: [
                {
                    type: 'Indicator',
                    img: 'block_icon/practical_course/sound.png',
                    size: 12,
                },
            ],
            def: {
                params: [null],
                type: 'robotis_detectedsound_value_init',
            },
            paramsKeyMap: {},
            class: 'robotis_sound',
            func(sprite, script) {
                Entry.hw.sendQueue.IS_EDU = true;
                const data_instruction = Entry.Robotis_openCM70.INSTRUCTION.WRITE;
                const data_address = Entry.Robotis_openCM70.CONTROL_TABLE.CM_SOUND_DETECTED[0];
                const data_length = Entry.Robotis_openCM70.CONTROL_TABLE.CM_SOUND_DETECTED[1];
                const data_value = 0;
    
                const data_sendqueue = [[data_instruction, data_address, data_length, data_value]];
                //Entry.Robotis_carCont.setRobotisData(data_sendqueue);
                //Entry.Robotis_carCont.update();
                return Entry.Robotis_carCont.postCallReturn(
                    script,
                    data_sendqueue,
                    Entry.Robotis_openCM70.delay
                );
            },
        },
        robotis_detectingsound_value: {
            color: '#01d67f',
            outerLine: '#00b36a',
            skeleton: 'basic_string_field',
            fontColor: '#fff',
            statements: [],
            isNotFor: ['robotis_openCM70', 'robotis_openCM70EDU'],
            template: '소리 센서 실시간 소리 횟수',
            events: {},
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                },
            ],
            def: {
                params: [null],
                type: 'robotis_detectingsound_value',
            },
            paramsKeyMap: {},
            class: 'robotis_sound',
            func(sprite, script) {
                Entry.hw.sendQueue.IS_EDU = true;
                return Entry.hw.portData.DETECTINGSOUNDE1;
            },
        },
        robotis_detectedsound_value_boolean: {
            color: '#01d67f',
            outerLine: '#00b36a',
            skeleton: 'basic_boolean_field',
            fontColor: '#fff',
            isNotFor: ['robotis_openCM70', 'robotis_openCM70EDU'],
            template: '소리 센서 최종 소리 횟수 %1 %2',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['=', 'EQUAL'],
                        ['>', 'GREATER'],
                        ['<', 'LESS'],
                        ['≥', 'GREATER_OR_EQUAL'],
                        ['≤', 'LESS_OR_EQUAL'],
                    ],
                    value: 'LESS',
                    fontSize: 11,
                    bgColor: '#00b36a',
                    arrowColor: EntryStatic.colorSet.common.WHITE,
                    noaRrow: true,
                },
                {
                    type: 'Block',
                    accept: 'string',
                },
            ],
            def: {
                params: [
                    null,
                    {
                        type: 'number',
                        params: ['100'],
                    },
                ],
                type: 'robotis_detectedsound_value_boolean',
            },
            paramsKeyMap: {
                OPERATOR: 0,
                RIGHTVALUE: 1,
            },
            class: 'robotis_sound',
            func(sprite, script) {
                Entry.hw.sendQueue.IS_EDU = true;
                const operator = script.getField('OPERATOR', script);
                const rightValue = script.getNumberValue('RIGHTVALUE', script);
                const leftValue = Entry.hw.portData.DETECTEDSOUNDE;
                let isCheck = false;
    
                switch (operator) {
                    case 'EQUAL':
                        isCheck = leftValue == rightValue;
                        break;
                    case 'GREATER':
                        isCheck = Number(leftValue) > Number(rightValue);
                        break;
                    case 'LESS':
                        isCheck = Number(leftValue) < Number(rightValue);
                        break;
                    case 'GREATER_OR_EQUAL':
                        isCheck = Number(leftValue) >= Number(rightValue);
                        break;
                    case 'LESS_OR_EQUAL':
                        isCheck = Number(leftValue) <= Number(rightValue);
                        break;
                }
    
                return isCheck;
            },
        },
        robotis_detectedsound_value_init: {
            color: '#00D67F',
            outerLine: '#00b36a',
            skeleton: 'basic',
            fontColor: '#fff',
            statements: [],
            isNotFor: ['robotis_openCM70', 'robotis_openCM70EDU'],
            template: '소리 센서 최종 소리 횟수 초기화 %1',
            params: [
                {
                    type: 'Indicator',
                    img: 'block_icon/practical_course/sound.png',
                    size: 12,
                },
            ],
            def: {
                params: [null],
                type: 'robotis_detectedsound_value_init',
            },
            paramsKeyMap: {},
            class: 'robotis_sound',
            func(sprite, script) {
                Entry.hw.sendQueue.IS_EDU = true;
                const data_instruction = Entry.Robotis_openCM70.INSTRUCTION.WRITE;
                const data_address = Entry.Robotis_openCM70.CONTROL_TABLE.CM_SOUND_DETECTED[0];
                const data_length = Entry.Robotis_openCM70.CONTROL_TABLE.CM_SOUND_DETECTED[1];
                const data_value = 0;
    
                const data_sendqueue = [[data_instruction, data_address, data_length, data_value]];
                //Entry.Robotis_carCont.setRobotisData(data_sendqueue);
                //Entry.Robotis_carCont.update();
                return Entry.Robotis_carCont.postCallReturn(
                    script,
                    data_sendqueue,
                    Entry.Robotis_openCM70.delay
                );
            },
        },
        robotis_detectingsound_value: {
            color: '#01d67f',
            outerLine: '#00b36a',
            skeleton: 'basic_string_field',
            fontColor: '#fff',
            statements: [],
            isNotFor: ['robotis_openCM70', 'robotis_openCM70EDU'],
            template: '소리 센서 실시간 소리 횟수',
            events: {},
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                },
            ],
            def: {
                params: [null],
                type: 'robotis_detectingsound_value',
            },
            paramsKeyMap: {},
            class: 'robotis_sound',
            func(sprite, script) {
                Entry.hw.sendQueue.IS_EDU = true;
                return Entry.hw.portData.DETECTINGSOUNDE1;
            },
        },
        robotis_detectingsound_value_boolean: {
            color: '#01d67f',
            outerLine: '#00b36a',
            skeleton: 'basic_boolean_field',
            fontColor: '#fff',
            isNotFor: ['robotis_openCM70', 'robotis_openCM70EDU'],
            template: '소리 센서 실시간 소리 횟수 %1 %2',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['=', 'EQUAL'],
                        ['>', 'GREATER'],
                        ['<', 'LESS'],
                        ['≥', 'GREATER_OR_EQUAL'],
                        ['≤', 'LESS_OR_EQUAL'],
                    ],
                    value: 'LESS',
                    fontSize: 11,
                    bgColor: '#00b36a',
                    arrowColor: EntryStatic.colorSet.common.WHITE,
                    noaRrow: true,
                },
                {
                    type: 'Block',
                    accept: 'string',
                },
            ],
            def: {
                params: [
                    null,
                    {
                        type: 'number',
                        params: ['100'],
                    },
                ],
                type: 'robotis_detectingsound_value_boolean',
            },
            paramsKeyMap: {
                OPERATOR: 0,
                RIGHTVALUE: 1,
            },
            class: 'robotis_sound',
            func(sprite, script) {
                Entry.hw.sendQueue.IS_EDU = true;
                const operator = script.getField('OPERATOR', script);
                const rightValue = script.getNumberValue('RIGHTVALUE', script);
                const leftValue = Entry.hw.portData.DETECTINGSOUNDE1;
                let isCheck = false;
    
                switch (operator) {
                    case 'EQUAL':
                        isCheck = leftValue == rightValue;
                        break;
                    case 'GREATER':
                        isCheck = Number(leftValue) > Number(rightValue);
                        break;
                    case 'LESS':
                        isCheck = Number(leftValue) < Number(rightValue);
                        break;
                    case 'GREATER_OR_EQUAL':
                        isCheck = Number(leftValue) >= Number(rightValue);
                        break;
                    case 'LESS_OR_EQUAL':
                        isCheck = Number(leftValue) <= Number(rightValue);
                        break;
                }
    
                return isCheck;
            },
        },
        robotis_color_value: {
            color: '#2AB4D3',
            outerLine: '#0e93b1',
            skeleton: 'basic_string_field',
            fontColor: '#fff',
            statements: [],
            isNotFor: ['robotis_openCM70', 'robotis_openCM70EDU'],
            template: '%1번 포트 컬러 센서 값',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['PORT 3', '3'],
                        ['PORT 4', '4'],
                        ['PORT 5', '5'],
                        ['PORT 6', '6'],
                    ],
                    value: '3',
                    fontSize: 11,
                    bgColor: '#0e93b1',
                    arrowColor: EntryStatic.colorSet.common.WHITE,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'robotis_color_value',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'robotis_color',
            func(sprite, script) {
                Entry.hw.sendQueue.IS_EDU = true;
                const port = script.getStringField('PORT');
                let value = 0;
                let data_address = 0;
                switch (port) {
                    case '3':
                        value = Entry.hw.portData.COLOR0;
                        data_address = 108;
                        break;
                    case '4':
                        value = Entry.hw.portData.COLOR1;
                        data_address = 109;
                        break;
                    case '5':
                        value = Entry.hw.portData.COLOR2;
                        data_address = 110;
                        break;
                    case '6':
                        value = Entry.hw.portData.COLOR3;
                        data_address = 111;
                        break;
                }
                const data_instruction = Entry.Robotis_openCM70.INSTRUCTION.WRITE;
                const data_length = 1;
                const data_value = 4;
    
                const data_sendqueue = [[data_instruction, data_address, data_length, data_value]];
                Entry.Robotis_carCont.setRobotisData(data_sendqueue);
                Entry.Robotis_carCont.update();
    
                switch (value) {
                    case 0:
                        value = '알 수 없음';
                        break;
                    case 1:
                        value = '흰색';
                        break;
                    case 2:
                        value = '검은색';
                        break;
                    case 3:
                        value = '빨강색';
                        break;
                    case 4:
                        value = '초록색';
                        break;
                    case 5:
                        value = '파랑색';
                        break;
                    case 6:
                        value = '노랑색';
                        break;
                }
    
                return value;
            },
        },
        robotis_color_value_boolean: {
            color: '#C4065C',
            outerLine: '#9a0045',
            skeleton: 'basic_boolean_field',
            fontColor: '#fff',
            isNotFor: ['robotis_openCM70', 'robotis_openCM70EDU'],
            template: '%1번 포트 컬러 센서 값 %2 %3',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['PORT 3', '3'],
                        ['PORT 4', '4'],
                        ['PORT 5', '5'],
                        ['PORT 6', '6'],
                    ],
                    value: '3',
                    fontSize: 11,
                    bgColor: '#9a0045',
                    arrowColor: EntryStatic.colorSet.common.WHITE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        ['=', 'EQUAL'],
                        ['>', 'GREATER'],
                        ['<', 'LESS'],
                        ['≥', 'GREATER_OR_EQUAL'],
                        ['≤', 'LESS_OR_EQUAL'],
                    ],
                    value: 'LESS',
                    fontSize: 11,
                    bgColor: '#9a0045',
                    arrowColor: EntryStatic.colorSet.common.WHITE,
                    noaRrow: true,
                },
                {
                    type: 'Dropdown',
                    options: [
                        ['알 수 없음 : 0', '0'],
                        ['흰색 : 1', '1'],
                        ['검은색 : 2', '2'],
                        ['빨강색 : 3', '3'],
                        ['초록색 : 4', '4'],
                        ['파랑색 : 5', '5'],
                        ['노랑색 : 6', '6'],
                    ],
                    value: '0',
                    fontSize: 11,
                    bgColor: '#9a0045',
                    arrowColor: EntryStatic.colorSet.common.WHITE,
                },
            ],
            def: {
                params: [null, null, null],
                type: 'robotis_color_value_boolean',
            },
            paramsKeyMap: {
                PORT: 0,
                OPERATOR: 1,
                RIGHTVALUE: 2,
            },
            class: 'robotis_color',
            func(sprite, script) {
                Entry.hw.sendQueue.IS_EDU = true;
                const port = script.getField('PORT', script);
                const operator = script.getField('OPERATOR', script);
                const rightValue = script.getNumberField('RIGHTVALUE', script);
                let leftValue = 0;
                let data_address = 0;
                let isCheck = false;
    
                switch (port) {
                    case '3':
                        leftValue = Entry.hw.portData.COLOR0;
                        data_address = 108;
                        break;
                    case '4':
                        leftValue = Entry.hw.portData.COLOR1;
                        data_address = 109;
                        break;
                    case '5':
                        leftValue = Entry.hw.portData.COLOR2;
                        data_address = 110;
                        break;
                    case '6':
                        leftValue = Entry.hw.portData.COLOR3;
                        data_address = 111;
                        break;
                }
    
                const data_instruction = Entry.Robotis_openCM70.INSTRUCTION.WRITE;
                const data_length = 1;
                const data_value = 4;
    
                const data_sendqueue = [[data_instruction, data_address, data_length, data_value]];
                Entry.Robotis_carCont.setRobotisData(data_sendqueue);
                Entry.Robotis_carCont.update();
    
                switch (operator) {
                    case 'EQUAL':
                        isCheck = leftValue == rightValue;
                        break;
                    case 'GREATER':
                        isCheck = Number(leftValue) > Number(rightValue);
                        break;
                    case 'LESS':
                        isCheck = Number(leftValue) < Number(rightValue);
                        break;
                    case 'GREATER_OR_EQUAL':
                        isCheck = Number(leftValue) >= Number(rightValue);
                        break;
                    case 'LESS_OR_EQUAL':
                        isCheck = Number(leftValue) <= Number(rightValue);
                        break;
                }
    
                return isCheck;
            },
        },
        robotis_humidity_value: {
            color: '#2AB4D3',
            outerLine: '#0e93b1',
            skeleton: 'basic_string_field',
            fontColor: '#fff',
            statements: [],
            isNotFor: ['robotis_openCM70', 'robotis_openCM70EDU'],
            template: '%1번 포트 습도 센서 값',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['PORT 3', '3'],
                        ['PORT 4', '4'],
                        ['PORT 5', '5'],
                        ['PORT 6', '6'],
                    ],
                    value: '3',
                    fontSize: 11,
                    bgColor: '#0e93b1',
                    arrowColor: EntryStatic.colorSet.common.WHITE,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'robotis_humidity_value',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'robotis_humidity',
            func(sprite, script) {
                Entry.hw.sendQueue.IS_EDU = true;
                const port = script.getStringField('PORT');
                let value = 0;
                let data_address = 0;
                switch (port) {
                    case '3':
                        value = Entry.hw.portData.HUMIDTY0;
                        data_address = 108;
                        break;
                    case '4':
                        value = Entry.hw.portData.HUMIDTY1;
                        data_address = 109;
                        break;
                    case '5':
                        value = Entry.hw.portData.HUMIDTY2;
                        data_address = 110;
                        break;
                    case '6':
                        value = Entry.hw.portData.HUMIDTY3;
                        data_address = 111;
                        break;
                }
                const data_instruction = Entry.Robotis_openCM70.INSTRUCTION.WRITE;
                const data_length = 1;
                const data_value = 5;
    
                const data_sendqueue = [[data_instruction, data_address, data_length, data_value]];
                Entry.Robotis_carCont.setRobotisData(data_sendqueue);
                Entry.Robotis_carCont.update();
    
                return value;
            },
        },
        robotis_humidity_value_boolean: {
            color: '#C4065C',
            outerLine: '#9a0045',
            skeleton: 'basic_boolean_field',
            fontColor: '#fff',
            isNotFor: ['robotis_openCM70', 'robotis_openCM70EDU'],
            template: '%1번 포트 습도 센서 값 %2 %3',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['PORT 3', '3'],
                        ['PORT 4', '4'],
                        ['PORT 5', '5'],
                        ['PORT 6', '6'],
                    ],
                    value: '3',
                    fontSize: 11,
                    bgColor: '#9a0045',
                    arrowColor: EntryStatic.colorSet.common.WHITE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        ['=', 'EQUAL'],
                        ['>', 'GREATER'],
                        ['<', 'LESS'],
                        ['≥', 'GREATER_OR_EQUAL'],
                        ['≤', 'LESS_OR_EQUAL'],
                    ],
                    value: 'LESS',
                    fontSize: 11,
                    bgColor: '#9a0045',
                    arrowColor: EntryStatic.colorSet.common.WHITE,
                    noaRrow: true,
                },
                {
                    type: 'Block',
                    accept: 'string',
                },
            ],
            def: {
                params: [
                    null,
                    null,
                    {
                        type: 'number',
                        params: ['50'],
                    },
                ],
                type: 'robotis_humidity_value_boolean',
            },
            paramsKeyMap: {
                PORT: 0,
                OPERATOR: 1,
                RIGHTVALUE: 2,
            },
            class: 'robotis_humidity',
            func(sprite, script) {
                Entry.hw.sendQueue.IS_EDU = true;
                const port = script.getNumberField('PORT', script);
                const operator = script.getField('OPERATOR', script);
                const rightValue = script.getNumberValue('RIGHTVALUE', script);
                let leftValue = 0;
                let data_address = 0;
                let isCheck = true;
    
                switch (port) {
                    case 3:
                        leftValue = Entry.hw.portData.HUMIDTY0;
                        data_address = 108;
                        break;
                    case 4:
                        leftValue = Entry.hw.portData.HUMIDTY1;
                        data_address = 109;
                        break;
                    case 5:
                        leftValue = Entry.hw.portData.HUMIDTY2;
                        data_address = 110;
                        break;
                    case 6:
                        leftValue = Entry.hw.portData.HUMIDTY3;
                        data_address = 111;
                        break;
                }
    
                const data_instruction = Entry.Robotis_openCM70.INSTRUCTION.WRITE;
                const data_length = 1;
                const data_value = 5;
    
                const data_sendqueue = [[data_instruction, data_address, data_length, data_value]];
                Entry.Robotis_carCont.setRobotisData(data_sendqueue);
                Entry.Robotis_carCont.update();
                switch (operator) {
                    case 'EQUAL':
                        isCheck = leftValue == rightValue;
                        break;
                    case 'GREATER':
                        isCheck = Number(leftValue) > Number(rightValue);
                        break;
                    case 'LESS':
                        isCheck = Number(leftValue) < Number(rightValue);
                        break;
                    case 'GREATER_OR_EQUAL':
                        isCheck = Number(leftValue) >= Number(rightValue);
                        break;
                    case 'LESS_OR_EQUAL':
                        isCheck = Number(leftValue) <= Number(rightValue);
                        break;
                }
                return isCheck;
            },
        },
        robotis_temperature_value: {
            color: '#2AB4D3',
            outerLine: '#0e93b1',
            skeleton: 'basic_string_field',
            fontColor: '#fff',
            statements: [],
            isNotFor: ['robotis_openCM70', 'robotis_openCM70EDU'],
            template: '%1번 포트 온도 센서 값',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['PORT 3', '3'],
                        ['PORT 4', '4'],
                        ['PORT 5', '5'],
                        ['PORT 6', '6'],
                    ],
                    value: '3',
                    fontSize: 11,
                    bgColor: '#0e93b1',
                    arrowColor: EntryStatic.colorSet.common.WHITE,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'robotis_temperature_value',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'robotis_temperature',
            func(sprite, script) {
                Entry.hw.sendQueue.IS_EDU = true;
                const port = script.getStringField('PORT');
                let value = 0;
                let data_address = 0;
                switch (port) {
                    case '3':
                        value = Entry.hw.portData.TEMPERATURE0;
                        data_address = 108;
                        break;
                    case '4':
                        value = Entry.hw.portData.TEMPERATURE1;
                        data_address = 109;
                        break;
                    case '5':
                        value = Entry.hw.portData.TEMPERATURE2;
                        data_address = 110;
                        break;
                    case '6':
                        value = Entry.hw.portData.TEMPERATURE3;
                        data_address = 111;
                        break;
                }
                const data_instruction = Entry.Robotis_openCM70.INSTRUCTION.WRITE;
                const data_length = 1;
                const data_value = 5;
    
                const data_sendqueue = [[data_instruction, data_address, data_length, data_value]];
                Entry.Robotis_carCont.setRobotisData(data_sendqueue);
                Entry.Robotis_carCont.update();
    
                return value;
            },
        },
        robotis_temperature_value_boolean: {
            color: '#C4065C',
            outerLine: '#9a0045',
            skeleton: 'basic_boolean_field',
            fontColor: '#fff',
            isNotFor: ['robotis_openCM70', 'robotis_openCM70EDU'],
            template: '%1번 포트 온도 센서 값 %2 %3',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['PORT 3', '3'],
                        ['PORT 4', '4'],
                        ['PORT 5', '5'],
                        ['PORT 6', '6'],
                    ],
                    value: '3',
                    fontSize: 11,
                    bgColor: '#9a0045',
                    arrowColor: EntryStatic.colorSet.common.WHITE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        ['=', 'EQUAL'],
                        ['>', 'GREATER'],
                        ['<', 'LESS'],
                        ['≥', 'GREATER_OR_EQUAL'],
                        ['≤', 'LESS_OR_EQUAL'],
                    ],
                    value: 'LESS',
                    fontSize: 11,
                    bgColor: '#9a0045',
                    arrowColor: EntryStatic.colorSet.common.WHITE,
                    noaRrow: true,
                },
                {
                    type: 'Block',
                    accept: 'string',
                },
            ],
            def: {
                params: [
                    null,
                    null,
                    {
                        type: 'number',
                        params: ['50'],
                    },
                ],
                type: 'robotis_temperature_value_boolean',
            },
            paramsKeyMap: {
                PORT: 0,
                OPERATOR: 1,
                RIGHTVALUE: 2,
            },
            class: 'robotis_temperature',
            func(sprite, script) {
                Entry.hw.sendQueue.IS_EDU = true;
                const port = script.getNumberField('PORT', script);
                const operator = script.getField('OPERATOR', script);
                const rightValue = script.getNumberValue('RIGHTVALUE', script);
                let leftValue = 0;
                let data_address = 0;
                let isCheck = true;
    
                switch (port) {
                    case 3:
                        leftValue = Entry.hw.portData.TEMPERATURE0;
                        data_address = 108;
                        break;
                    case 4:
                        leftValue = Entry.hw.portData.TEMPERATURE1;
                        data_address = 109;
                        break;
                    case 5:
                        leftValue = Entry.hw.portData.TEMPERATURE2;
                        data_address = 110;
                        break;
                    case 6:
                        leftValue = Entry.hw.portData.TEMPERATURE3;
                        data_address = 111;
                        break;
                }
    
                const data_instruction = Entry.Robotis_openCM70.INSTRUCTION.WRITE;
                const data_length = 1;
                const data_value = 5;
    
                const data_sendqueue = [[data_instruction, data_address, data_length, data_value]];
                Entry.Robotis_carCont.setRobotisData(data_sendqueue);
                Entry.Robotis_carCont.update();
                switch (operator) {
                    case 'EQUAL':
                        isCheck = leftValue == rightValue;
                        break;
                    case 'GREATER':
                        isCheck = Number(leftValue) > Number(rightValue);
                        break;
                    case 'LESS':
                        isCheck = Number(leftValue) < Number(rightValue);
                        break;
                    case 'GREATER_OR_EQUAL':
                        isCheck = Number(leftValue) >= Number(rightValue);
                        break;
                    case 'LESS_OR_EQUAL':
                        isCheck = Number(leftValue) <= Number(rightValue);
                        break;
                }
                return isCheck;
            },
        },
        robotis_move_for_secs: {
            color: '#00B200',
            outerLine: '#019101',
            skeleton: 'basic',
            fontColor: '#fff',
            statements: [],
            isNotFor: ['robotis_openCM70', 'robotis_openCM70EDU'],
            template: '%1모터를 %2 %3의 속도로 %4초 동안 회전 %5',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['왼쪽', '1'],
                        ['오른쪽', '2'],
                        ['양쪽', '3'],
                    ],
                    value: '1',
                    fontSize: 11,
                    bgColor: '#019101',
                    arrowColor: EntryStatic.colorSet.common.WHITE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        ['앞으로', 'CW'],
                        ['뒤로', 'CCW'],
                    ],
                    value: 'CW',
                    fontSize: 11,
                    bgColor: '#019101',
                    arrowColor: EntryStatic.colorSet.common.WHITE,
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
                    img: 'block_icon/practical_course/dcmotor.png',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [
                    null,
                    null,
                    {
                        type: 'practical_course_motor_speed',
                    },
                    {
                        type: 'number',
                        params: ['2'],
                    },
                    null,
                ],
                type: 'robotis_move_for_secs',
            },
            paramsKeyMap: {
                WHEEL: 0,
                DIRECTION: 1,
                SPEED: 2,
                DURATION: 3,
            },
            class: 'robotis_motor',
            func(sprite, script) {
                Entry.hw.sendQueue.IS_EDU = true;
                const duration = script.getNumberValue('DURATION');
                const wheel = script.getNumberField('WHEEL');
                let value = script.getNumberValue('SPEED');
                const direction = script.getStringField('DIRECTION');
    
                const data_instruction = Entry.Robotis_openCM70.INSTRUCTION.WRITE;
                let data_address = 0;
                let data_length = 0;
                let data_value = 0;
    
                data_address = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_MOTOR_SPEED[0];
    
                if (wheel == '3') {
                    data_length = 4;
                    data_address = 136;
                } else {
                    data_length = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_MOTOR_SPEED[1];
                    data_address = data_address + (wheel - 1) * data_length;
                }
    
                if (!script.isStart) {
                    value = value * 68;
                    if (wheel == '3' || wheel == '1') {
                        if (direction == 'CCW') {
                            value = value + 1024;
                            if (value > 2047) {
                                value = 2047;
                            }
                        } else {
                            if (value > 1023) {
                                value = 1023;
                            }
                        }
                    } else {
                        if (direction == 'CW') {
                            value = value + 1024;
                            if (value > 2047) {
                                value = 2047;
                            }
                        } else {
                            if (value > 1023) {
                                value = 1023;
                            }
                        }
                    }
    
                    data_value = value;
    
                    var data_sendqueue = [[data_instruction, data_address, data_length, data_value]];
    
                    script.wheelMode = wheel;
    
                    script.isStart = true;
                    script.timeFlag = 1;
                    setTimeout(() => {
                        script.timeFlag = 0;
                    }, duration * 1000);
    
                    Entry.Robotis_carCont.setRobotisData(data_sendqueue);
                    Entry.Robotis_carCont.update();
                    //return Entry.Robotis_carCont.postCallReturn(script, data_sendqueue, 2000);
                    return script;
                } else if (script.timeFlag == 1) {
                    //data_sendqueue = [[data_instruction, data_address, data_length, 0]];
                    //Entry.Robotis_carCont.setRobotisData(data_sendqueue);
                    return script;
                } else {
                    delete script.timeFlag;
                    delete script.isStart;
                    delete script.wheelMode;
                    Entry.engine.isContinue = false;
    
                    data_sendqueue = [[data_instruction, data_address, data_length, 0]];
                    Entry.Robotis_carCont.setRobotisData(data_sendqueue);
                    Entry.engine.isContinue = false;
                    Entry.Robotis_carCont.update();
                    return script.callReturn();
                }
                //return Entry.Robotis_carCont.postCallReturn(script, data_sendqueue, 2000);
            },
        },
        robotis_aux_move_for: {
            color: '#00B200',
            outerLine: '#019101',
            skeleton: 'basic',
            fontColor: '#fff',
            statements: [],
            isNotFor: ['robotis_openCM70', 'robotis_openCM70EDU'],
            template: '%1모터를 %2 %3의 속도로 계속 회전 %4',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['왼쪽', '1'],
                        ['오른쪽', '2'],
                        ['양쪽', '3'],
                    ],
                    value: '1',
                    fontSize: 11,
                    bgColor: '#019101',
                    arrowColor: EntryStatic.colorSet.common.WHITE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        ['앞으로', 'CW'],
                        ['뒤로', 'CCW'],
                    ],
                    value: 'CW',
                    fontSize: 11,
                    bgColor: '#019101',
                    arrowColor: EntryStatic.colorSet.common.WHITE,
                },
                {
                    type: 'Block',
                    accept: 'string',
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/practical_course/dcmotor.png',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [
                    null,
                    null,
                    {
                        type: 'practical_course_motor_speed',
                    },
                    null,
                ],
                type: 'robotis_aux_move_for',
            },
            paramsKeyMap: {
                WHEEL: 0,
                DIRECTION: 1,
                SPEED: 2,
            },
            class: 'robotis_motor',
            //'isNotFor': ['mini'],
            func(sprite, script) {
                Entry.hw.sendQueue.IS_EDU = true;
                const wheel = script.getNumberField('WHEEL');
                let value = script.getNumberValue('SPEED');
                const direction = script.getStringField('DIRECTION');
    
                const data_instruction = Entry.Robotis_openCM70.INSTRUCTION.WRITE;
                let data_address = 0;
                let data_length = 0;
                let data_value = 0;
                data_address = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_MOTOR_SPEED[0];
    
                if (wheel == '3') {
                    data_length = 4;
                    data_address = 136;
                } else {
                    data_length = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_MOTOR_SPEED[1];
                    data_address = data_address + (wheel - 1) * data_length;
                }
                value = value * 68;
    
                if (wheel == '3' || wheel == '1') {
                    if (direction == 'CCW') {
                        value = value + 1024;
                        if (value > 2047) {
                            value = 2047;
                        }
                    } else {
                        if (value > 1023) {
                            value = 1023;
                        }
                    }
                } else {
                    if (direction == 'CW') {
                        value = value + 1024;
                        if (value > 2047) {
                            value = 2047;
                        }
                    } else {
                        if (value > 1023) {
                            value = 1023;
                        }
                    }
                }
    
                data_value = value;
    
                const data_sendqueue = [[data_instruction, data_address, data_length, data_value]];
                return Entry.Robotis_carCont.postCallReturn(
                    script,
                    data_sendqueue,
                    Entry.Robotis_openCM70.delay
                );
            },
        },
        robotis_aux_stop_for: {
            color: '#00B200',
            outerLine: '#019101',
            skeleton: 'basic',
            fontColor: '#fff',
            statements: [],
            isNotFor: ['robotis_openCM70', 'robotis_openCM70EDU'],
            template: '%1모터를 정지 %2',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['왼쪽', '1'],
                        ['오른쪽', '2'],
                        ['양쪽', '3'],
                    ],
                    value: '1',
                    fontSize: 11,
                    bgColor: '#019101',
                    arrowColor: EntryStatic.colorSet.common.WHITE,
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/practical_course/dcmotor.png',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [null, null],
                type: 'robotis_aux_stop_for',
            },
            paramsKeyMap: {
                WHEEL: 0,
            },
            class: 'robotis_motor',
            func(sprite, script) {
                Entry.hw.sendQueue.IS_EDU = true;
                const wheel = script.getNumberField('WHEEL');
                const value = 0;
    
                const data_instruction = Entry.Robotis_openCM70.INSTRUCTION.WRITE;
                let data_address = 0;
                let data_length = 0;
                let data_value = 0;
    
                data_address = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_MOTOR_SPEED[0];
                if (wheel == '3') {
                    data_length = 4;
                    data_address = 136;
                } else {
                    data_length = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_MOTOR_SPEED[1];
                    data_address = data_address + (wheel - 1) * data_length;
                }
    
                data_value = value;
    
                const data_sendqueue = [[data_instruction, data_address, data_length, data_value]];
                return Entry.Robotis_carCont.postCallReturn(
                    script,
                    data_sendqueue,
                    Entry.Robotis_openCM70.delay
                );
            },
        },
        robotis_set_servo_wheel: {
            color: '#D128BD',
            outerLine: '#a2049e',
            skeleton: 'basic',
            statements: [],
            isNotFor: ['robotis_openCM70', 'robotis_openCM70EDU'],
            template: '%1 포트의 서보모터를 %2 %3속도로 회전 %4',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['PORT 3', '3'],
                        ['PORT 4', '4'],
                        ['PORT 5', '5'],
                        ['PORT 6', '6'],
                    ],
                    value: '3',
                    fontSize: 11,
                    bgColor: '#A2049E',
                    arrowColor: EntryStatic.colorSet.common.WHITE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        ['시계방향', 'CW'],
                        ['반시계방향', 'CCW'],
                    ],
                    value: 'CW',
                    fontSize: 11,
                    bgColor: '#A2049E',
                    arrowColor: EntryStatic.colorSet.common.WHITE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        ['1', 1],
                        ['2', 2],
                        ['3', 3],
                        ['4', 4],
                        ['5', 5],
                        ['6', 6],
                        ['7', 7],
                        ['8', 8],
                        ['9', 9],
                        ['10', 10],
                        ['11', 11],
                        ['12', 12],
                        ['13', 13],
                        ['14', 14],
                        ['15', 15],
                    ],
                    value: 7,
                    fontSize: 11,
                    bgColor: '#A2049E',
                    arrowColor: EntryStatic.colorSet.common.WHITE,
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/practical_course/servo.png',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [null, null, null, null],
                type: 'robotis_set_servo_wheel',
            },
            paramsKeyMap: {
                PORT: 0,
                DIRECTION: 1,
                SPEED: 2,
            },
            class: 'robotis_servo_motor',
            func(sprite, script) {
                Entry.hw.sendQueue.IS_EDU = true;
                // instruction / address / length / value / default length
                const port = script.getField('PORT', script);
                const direction = script.getStringField('DIRECTION');
                const speed = script.getNumberField('SPEED');
                const value = 0;
    
                let data_address3 = 0;
                let data_length3 = 0;
                let data_value3 = 0;
    
                let data_address2 = 0;
                const data_length2 = 1;
                const data_value2 = 7;
    
                const data_instruction = Entry.Robotis_openCM70.INSTRUCTION.WRITE;
                let data_address = 0;
                let data_length = 0;
                let data_value = 0;
    
                let data_address4 = 0; // servo speed
                let data_length4 = 2;
                let data_value4 = 0;
    
                data_value4 = speed * 68;
                if (data_value4 > 1023) {
                    data_value4 = 1023;
                }
                switch (port) {
                    case '3':
                        data_address2 = 108;
                        Entry.Robotis_openCM70.SERVO_MODULEWRITE.PORT3 = true;
                        break;
                    case '4':
                        data_address2 = 109;
                        Entry.Robotis_openCM70.SERVO_MODULEWRITE.PORT4 = true;
                        break;
                    case '5':
                        data_address2 = 110;
                        Entry.Robotis_openCM70.SERVO_MODULEWRITE.PORT5 = true;
                        break;
                    case '6':
                        data_address2 = 111;
                        Entry.Robotis_openCM70.SERVO_MODULEWRITE.PORT6 = true;
                        break;
                }
    
                data_address3 = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_SERVO_POSITION[0];
                data_length3 = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_SERVO_POSITION[1];
    
                data_address3 = data_address3 + (port - 1) * data_length3;
    
                data_address4 = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_SERVO_SPEED[0];
                data_length4 = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_SERVO_SPEED[1];
    
                data_address4 = data_address4 + (port - 1) * data_length4;
    
                data_address = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_SERVO_MODE[0];
                data_length = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_SERVO_MODE[1];
    
                data_address = data_address + (port - 1) * data_length;
                data_value = 0;
    
                if (direction == 'CW') {
                    data_value4 = data_value4 + 1024;
                    if (data_value4 > 2047) {
                        data_value4 = 2047;
                    }
                } else {
                    if (data_value4 > 1023) {
                        data_value4 = 1023;
                    }
                }
    
                data_value3 = direction;
    
                //var data_sendqueue = [[data_instruction, data_address2, data_length2, data_value2], [data_instruction, data_address, data_length, data_value], [data_instruction, data_address4, data_length4, data_value4]];
                //return Entry.Robotis_carCont.postCallReturn(script, data_sendqueue, Entry.Robotis_openCM70.delay);
                //
                if (!script.isStart) {
                    if (
                        (!Entry.Robotis_openCM70.SERVO_MODULEWRITE.PORT3 && port == '3') ||
                        (!Entry.Robotis_openCM70.SERVO_MODULEWRITE.PORT4 && port == '4') ||
                        (!Entry.Robotis_openCM70.SERVO_MODULEWRITE.PORT5 && port == '5') ||
                        (!Entry.Robotis_openCM70.SERVO_MODULEWRITE.PORT6 && port == '6')
                    ) {
                        var data_sendqueue = [
                            [data_instruction, data_address2, data_length2, data_value2],
                        ];
                        Entry.Robotis_carCont.setRobotisData(data_sendqueue);
                        Entry.Robotis_carCont.update();
                        script.isStart = true;
                        script.timeFlag = 1;
                        setTimeout(() => {
                            script.timeFlag = 0;
                        }, 1 * 650);
                    } else {
                        script.isStart = true;
                        script.timeFlag = 0;
                    }
    
                    /*
                        var data_sendqueue = [[data_instruction, data_address2, data_length2, data_value2]];
                        Entry.Robotis_carCont.setRobotisData(data_sendqueue);
                        Entry.Robotis_carCont.update();
                        script.isStart = true;
                        script.timeFlag = 1;
                        setTimeout(function () {
                            script.timeFlag = 0;
                        }, 1 * 650);
                        */
    
                    return script;
                } else if (script.timeFlag == 1) {
                    //data_sendqueue = [[data_instruction, data_address, data_length, 0]];
                    //Entry.Robotis_carCont.setRobotisData(data_sendqueue);
                    return script;
                } else {
                    delete script.timeFlag;
                    delete script.isStart;
                    delete script.wheelMode;
                    Entry.engine.isContinue = false;
    
                    data_sendqueue = [
                        [data_instruction, data_address, data_length, data_value],
                        [data_instruction, data_address4, data_length4, data_value4],
                    ];
                    Entry.Robotis_carCont.setRobotisData(data_sendqueue);
                    Entry.engine.isContinue = false;
                    Entry.Robotis_carCont.update();
                    return script.callReturn();
                }
                //
            },
        },
        robotis_set_servo_joint: {
            color: '#D128BD',
            outerLine: '#a2049e',
            skeleton: 'basic',
            statements: [],
            isNotFor: ['robotis_openCM70', 'robotis_openCM70EDU'],
            template: '%1 포트의 서보모터를 %2 도 %3속도로 이동 %4',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['PORT 3', '3'],
                        ['PORT 4', '4'],
                        ['PORT 5', '5'],
                        ['PORT 6', '6'],
                    ],
                    value: '3',
                    fontSize: 11,
                    bgColor: '#A2049E',
                    arrowColor: EntryStatic.colorSet.common.WHITE,
                },
                {
                    type: 'Block',
                    accept: 'string',
                },
                {
                    type: 'Dropdown',
                    options: [
                        ['1', 1],
                        ['2', 2],
                        ['3', 3],
                        ['4', 4],
                        ['5', 5],
                        ['6', 6],
                        ['7', 7],
                        ['8', 8],
                        ['9', 9],
                        ['10', 10],
                        ['11', 11],
                        ['12', 12],
                        ['13', 13],
                        ['14', 14],
                        ['15', 15],
                    ],
                    value: 7,
                    fontSize: 11,
                    bgColor: '#A2049E',
                    arrowColor: EntryStatic.colorSet.common.WHITE,
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/practical_course/servo.png',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [
                    null,
                    {
                        type: 'number',
                        params: ['512'],
                    },
                    null,
                    null,
                ],
                type: 'robotis_set_servo_joint',
            },
            paramsKeyMap: {
                PORT: 0,
                VALUE: 1,
                SPEED: 2,
            },
            class: 'robotis_servo_motor',
            func(sprite, script) {
                Entry.hw.sendQueue.IS_EDU = true;
                // instruction / address / length / value / default length
                const port = script.getField('PORT', script);
                let value = script.getNumberValue('VALUE');
                const speed = script.getNumberField('SPEED');
    
                var data_instruction = Entry.Robotis_openCM70.INSTRUCTION.WRITE;
                let data_address3 = 0;
                let data_length3 = 0;
                let data_value3 = 0;
    
                let data_address2 = 0;
                const data_length2 = 1;
                const data_value2 = 7;
    
                var data_instruction = Entry.Robotis_openCM70.INSTRUCTION.WRITE;
                let data_address = 0;
                let data_length = 0;
                let data_value = 0;
    
                let data_address4 = 0; // servo speed
                let data_length4 = 2;
                let data_value4 = 0;
    
                data_value4 = speed * 68;
                if (data_value4 > 1023) {
                    data_value4 = 1023;
                }
                switch (port) {
                    case '3':
                        data_address2 = 108;
                        break;
                    case '4':
                        data_address2 = 109;
                        break;
                    case '5':
                        data_address2 = 110;
                        break;
                    case '6':
                        data_address2 = 111;
                        break;
                }
    
                data_address3 = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_SERVO_POSITION[0];
                data_length3 = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_SERVO_POSITION[1];
    
                data_address3 = data_address3 + (port - 1) * data_length3;
    
                data_address4 = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_SERVO_SPEED[0];
                data_length4 = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_SERVO_SPEED[1];
    
                data_address4 = data_address4 + (port - 1) * data_length4;
    
                data_address = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_SERVO_MODE[0];
                data_length = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_SERVO_MODE[1];
    
                data_address = data_address + (port - 1) * data_length;
                data_value = 1;
    
                if (value > 1023) {
                    value = 1023;
                } else if (value < 0) {
                    value = 0;
                }
    
                data_value3 = value;
    
                if (!script.isStart) {
                    var data_sendqueue = [[data_instruction, data_address2, data_length2, data_value2]];
                    //Entry.Robotis_carCont.setRobotisData(data_sendqueue);
                    //Entry.Robotis_carCont.update();
                    if (
                        (!Entry.Robotis_openCM70.SERVO_MODULEWRITE.PORT3 && port == '3') ||
                        (!Entry.Robotis_openCM70.SERVO_MODULEWRITE.PORT4 && port == '4') ||
                        (!Entry.Robotis_openCM70.SERVO_MODULEWRITE.PORT5 && port == '5') ||
                        (!Entry.Robotis_openCM70.SERVO_MODULEWRITE.PORT6 && port == '6')
                    ) {
                        script.isStart = true;
                        script.timeFlag = 1;
                        setTimeout(() => {
                            script.timeFlag = 0;
                        }, 1 * 650);
                    } else {
                        script.isStart = true;
                        script.timeFlag = 0;
                    }
    
                    return script;
                } else if (script.timeFlag == 1) {
                    return script;
                } else {
                    delete script.timeFlag;
                    delete script.isStart;
                    delete script.wheelMode;
                    Entry.engine.isContinue = false;
    
                    setTimeout(() => {
                        script.timeFlag = 0;
                    }, 1 * 70);
    
                    data_sendqueue = [
                        [data_instruction, data_address, data_length, data_value],
                        [data_instruction, data_address4, data_length4, data_value4],
                        [data_instruction, data_address3, data_length3, data_value3],
                    ];
                    Entry.Robotis_carCont.setRobotisData(data_sendqueue);
                    Entry.engine.isContinue = false;
                    Entry.Robotis_carCont.update();
                    return script.callReturn();
                }
                //
            },
        },
        robotis_melody_note_for: {
            color: '#FC327F',
            skeleton: 'basic',
            statements: [],
            isNotFor: ['robotis_openCM70', 'robotis_openCM70EDU'],
            template: '멜로디 %1 을(를) %2 옥타브로 %3 만큼 소리내기 %4',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        //['무음', '12'],
                        ['도', '0'],
                        ['도#(레♭)', '1'],
                        ['레', '2'],
                        ['레#(미♭)', '3'],
                        ['미', '4'],
                        ['파', '5'],
                        ['파#(솔♭)', '6'],
                        ['솔', '7'],
                        ['솔#(라♭)', '8'],
                        ['라', '9'],
                        ['라#(시♭)', '10'],
                        ['시', '11'],
                    ],
                    value: '0',
                    fontSize: 11,
                    bgColor: '#ce105e',
                    arrowColor: EntryStatic.colorSet.common.WHITE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        ['1', '0'],
                        ['2', '1'],
                        ['3', '2'],
                        ['4', '3'],
                        ['5', '4'],
                        ['6', '5'],
                    ],
                    value: '2',
                    fontSize: 11,
                    bgColor: '#ce105e',
                    arrowColor: EntryStatic.colorSet.common.WHITE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        ['온음표', '4'],
                        ['2분음표', '2'],
                        ['4분음표', '1'],
                        ['8분음표', '0.5'],
                        ['16분음표', '0.25'],
                        /*['4분음표', '4'],
                        ['8분음표', '8'],
                        ['16분음표', '16'],*/
                    ],
                    value: '4',
                    fontSize: 11,
                    bgColor: '#ce105e',
                    arrowColor: EntryStatic.colorSet.common.WHITE,
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/practical_course/melody.png',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [null, null, null, null],
                type: 'robotis_melody_note_for',
            },
            paramsKeyMap: {
                NOTE: 0,
                OCTAVE: 1,
                DURATION: 2,
            },
            class: 'robotis_melody',
            //'isNotFor': ['mini'],
            func(sprite, script) {
                Entry.hw.sendQueue.IS_EDU = true;
                const note = script.getNumberField('NOTE', script);
                const octave = script.getNumberField('OCTAVE', script);
                const cmBuzzerTime = script.getNumberField('DURATION', script);
    
                let cmBuzzerIndex = note + octave * 12;
                if (cmBuzzerIndex > 51) {
                    cmBuzzerIndex = 51;
                }
                if (cmBuzzerIndex < 0) {
                    cmBuzzerIndex = 0;
                }
    
                const data_instruction = Entry.Robotis_openCM70.INSTRUCTION.WRITE;
                let data_address_1 = 0;
                let data_length_1 = 0;
                let data_value_1 = 0;
                let data_address_2 = 0;
                let data_length_2 = 0;
                let data_value_2 = 0;
    
                data_address_1 = Entry.Robotis_openCM70.CONTROL_TABLE.CM_BUZZER_TIME[0];
                data_length_1 = Entry.Robotis_openCM70.CONTROL_TABLE.CM_BUZZER_TIME[1];
    
                // TODO 텍스트 입력으로 바꾸고 최대는 5초 : 0.5 초 하려면 5를 입력  - console.log(parseInt(0.59 * 10)); max 는 5초
    
                data_value_1 = parseInt(cmBuzzerTime * 10);
                if (data_value_1 > 50) {
                    data_value_1 = 50;
                }
                //data_value_1
                data_address_2 = Entry.Robotis_openCM70.CONTROL_TABLE.CM_BUZZER_INDEX[0];
                data_length_2 = Entry.Robotis_openCM70.CONTROL_TABLE.CM_BUZZER_INDEX[1];
                data_value_2 = cmBuzzerIndex;
    
                const data_sendqueue = [
                    [data_instruction, data_address_1, data_length_1, data_value_1],
                    [data_instruction, data_address_2, data_length_2, data_value_2],
                ];
                return Entry.Robotis_carCont.postCallReturn(
                    script,
                    data_sendqueue,
                    cmBuzzerTime * 1000
                );
            },
        },
    }
}
/*Entry.Robotis_openCM70EDU.blockMenuBlocks = [
    //Robotis_openCM70EDU
    'robotis_openCM70_sensor_value',
    'robotis_openCM70_aux_sensor_value',
    'robotis_openCM70_cm_buzzer_index',
    'robotis_openCM70_cm_buzzer_melody',
    'robotis_openCM70_cm_sound_detected_clear',
    'robotis_openCM70_cm_led',
    'robotis_openCM70_cm_motion',
    'robotis_openCM70_aux_motor_speed',
    'robotis_openCM70_aux_servo_mode',
    'robotis_openCM70_aux_servo_speed',
    'robotis_openCM70_aux_servo_position',
    'robotis_openCM70_aux_led_module',
    'robotis_openCM70_aux_custom',
    'robotis_openCM70_cm_custom_value',
    'robotis_openCM70_cm_custom',
];
Entry.Robotis_openCM70EDU.getBlocks = function () {
    return {
        //region robotis 로보티즈 openCM70
        robotis_openCM70_cm_custom_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                },
                {
                    type: 'Dropdown',
                    options: [
                        ['BYTE', 'BYTE'],
                        ['WORD', 'WORD'],
                        ['DWORD', 'DWORD'],
                    ],
                    value: 'BYTE',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'number',
                        params: ['0'],
                    },
                    null,
                ],
                type: 'robotis_openCM70_cm_custom_value',
            },
            paramsKeyMap: {
                VALUE: 0,
                SIZE: 1,
            },
            class: 'robotis_openCM70_custom',
            isNotFor: ['Robotis_openCM70EDU'],
            func: function (sprite, script) {
                var scope = script.executor.scope;

                // instruction / address / length / value / default length
                var data_instruction = Entry.Robotis_openCM70.INSTRUCTION.READ;
                var data_address = 0;
                var data_length = 0;
                var data_value = 0;

                var data_default_address = 0;
                var data_default_length = 0;

                var size = script.getStringField('SIZE');

                if (size == 'BYTE') {
                    data_length = 1;
                } else if (size == 'WORD') {
                    data_length = 2;
                } else if (size == 'DWORD') {
                    data_length = 4;
                }

                data_address = script.getNumberValue('VALUE');

                data_default_address = data_address;
                data_default_length = data_length;

                if (
                    Entry.hw.sendQueue.prevAddress &&
                    Entry.hw.sendQueue.prevAddress == data_default_address
                ) {
                    if (
                        Entry.hw.sendQueue.prevTime &&
                        new Date() - Entry.hw.sendQueue.prevTime < 200
                    ) {
                        //throw new Entry.Utils.AsyncError();
                        return Entry.hw.sendQueue.prevResult;
                    }
                }

                Entry.Robotis_carCont.setRobotisData([
                    [
                        data_instruction,
                        data_address,
                        data_length,
                        data_value,
                        data_default_length,
                    ],
                ]);
                // Entry.hw.socket.send(JSON.stringify(Entry.hw.sendQueue));
                Entry.Robotis_carCont.update();

                var result = Entry.hw.portData[data_default_address];
                Entry.hw.sendQueue.prevAddress = data_default_address;
                Entry.hw.sendQueue.prevTime = new Date();
                Entry.hw.sendQueue.prevResult = result;

                return result;
            },
            syntax: {
                js: [],
                py: ['Robotis.opencm70_cm_custom_value(%1, %2)'],
            },
        },
        robotis_openCM70_sensor_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [
                            Lang.Blocks.robotis_cm_sound_detected,
                            'CM_SOUND_DETECTED',
                        ],
                        [
                            Lang.Blocks.robotis_cm_sound_detecting,
                            'CM_SOUND_DETECTING',
                        ],
                        [Lang.Blocks.robotis_cm_user_button, 'CM_USER_BUTTON'],
                    ],
                    value: 'CM_SOUND_DETECTED',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'robotis_openCM70_sensor_value',
            },
            paramsKeyMap: {
                SENSOR: 0,
            },
            class: 'robotis_openCM70_cm',
            isNotFor: ['Robotis_openCM70EDU'],
            func: function (sprite, script) {
                var scope = script.executor.scope;

                scope.isStart = true;
                scope.count = 0;
                var data_instruction = Entry.Robotis_openCM70.INSTRUCTION.READ;
                var data_address = 0;
                var data_length = 0;
                var data_value = 0;

                var data_default_address = 0;
                var data_default_length = 0;

                var sensor = script.getStringField('SENSOR');

                var increase = 0;

                if (sensor == 'CM_SOUND_DETECTED') {
                    data_default_address =
                        Entry.Robotis_openCM70.CONTROL_TABLE
                            .CM_SOUND_DETECTED[0];
                    data_default_length =
                        Entry.Robotis_openCM70.CONTROL_TABLE
                            .CM_SOUND_DETECTED[1];
                    data_address =
                        Entry.Robotis_openCM70.CONTROL_TABLE
                            .CM_SOUND_DETECTED[0];
                    data_length =
                        Entry.Robotis_openCM70.CONTROL_TABLE
                            .CM_SOUND_DETECTED[1];
                } else if (sensor == 'CM_SOUND_DETECTING') {
                    data_default_address =
                        Entry.Robotis_openCM70.CONTROL_TABLE
                            .CM_SOUND_DETECTING[0];
                    data_default_length =
                        Entry.Robotis_openCM70.CONTROL_TABLE
                            .CM_SOUND_DETECTING[1];
                    data_address =
                        Entry.Robotis_openCM70.CONTROL_TABLE
                            .CM_SOUND_DETECTING[0];
                    data_length =
                        Entry.Robotis_openCM70.CONTROL_TABLE
                            .CM_SOUND_DETECTING[1];
                } else if (sensor == 'CM_USER_BUTTON') {
                    data_default_address =
                        Entry.Robotis_openCM70.CONTROL_TABLE.CM_USER_BUTTON[0];
                    data_default_length =
                        Entry.Robotis_openCM70.CONTROL_TABLE.CM_USER_BUTTON[1];
                    data_address =
                        Entry.Robotis_openCM70.CONTROL_TABLE.CM_USER_BUTTON[0];
                    data_length =
                        Entry.Robotis_openCM70.CONTROL_TABLE.CM_USER_BUTTON[1];
                }

                data_default_address =
                    data_default_address + increase * data_default_length;

                if (
                    Entry.hw.sendQueue.prevAddress &&
                    Entry.hw.sendQueue.prevAddress == data_default_address
                ) {
                    if (
                        Entry.hw.sendQueue.prevTime &&
                        new Date() - Entry.hw.sendQueue.prevTime < 200
                    ) {
                        //throw new Entry.Utils.AsyncError();
                        return Entry.hw.sendQueue.prevResult;
                    }
                }

                Entry.Robotis_carCont.setRobotisData([
                    [
                        data_instruction,
                        data_address,
                        data_length,
                        data_value,
                        data_default_length,
                    ],
                ]);
                // Entry.hw.socket.send(JSON.stringify(Entry.hw.sendQueue));
                Entry.Robotis_carCont.update();

                var result = Entry.hw.portData[data_default_address];
                Entry.hw.sendQueue.prevAddress = data_default_address;
                Entry.hw.sendQueue.prevTime = new Date();
                Entry.hw.sendQueue.prevResult = result;

                return result;
            },
            syntax: { js: [], py: ['Robotis.opencm70_sensor_value(%1)'] },
        },
        robotis_openCM70_aux_sensor_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['3', 'PORT_3'],
                        ['4', 'PORT_4'],
                        ['5', 'PORT_5'],
                        ['6', 'PORT_6'],
                    ],
                    value: 'PORT_3',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [
                            Lang.Blocks.robotis_aux_servo_position,
                            'AUX_SERVO_POSITION',
                        ],
                        [Lang.Blocks.robotis_aux_ir, 'AUX_IR'],
                        [Lang.Blocks.robotis_aux_touch, 'AUX_TOUCH'],
                        [Lang.Blocks.robotis_aux_brightness, 'AUX_BRIGHTNESS'],
                        [
                            Lang.Blocks.robotis_aux_hydro_themo_humidity,
                            'AUX_HYDRO_THEMO_HUMIDITY',
                        ],
                        [
                            Lang.Blocks.robotis_aux_hydro_themo_temper,
                            'AUX_HYDRO_THEMO_TEMPER',
                        ],
                        [
                            Lang.Blocks.robotis_aux_temperature,
                            'AUX_TEMPERATURE',
                        ],
                        [Lang.Blocks.robotis_aux_ultrasonic, 'AUX_ULTRASONIC'],
                        [Lang.Blocks.robotis_aux_magnetic, 'AUX_MAGNETIC'],
                        [
                            Lang.Blocks.robotis_aux_motion_detection,
                            'AUX_MOTION_DETECTION',
                        ],
                        [Lang.Blocks.robotis_aux_color, 'AUX_COLOR'],
                        [Lang.Blocks.robotis_aux_custom, 'AUX_CUSTOM'],
                    ],
                    value: 'AUX_SERVO_POSITION',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [null, null],
                type: 'robotis_openCM70_aux_sensor_value',
            },
            paramsKeyMap: {
                PORT: 0,
                SENSOR: 1,
            },
            class: 'robotis_openCM70_cm',
            isNotFor: ['Robotis_openCM70EDU'],
            func: function (sprite, script) {
                var scope = script.executor.scope;

                // instruction / address / length / value / default length
                var data_instruction = Entry.Robotis_openCM70.INSTRUCTION.READ;
                var data_address = 0;
                var data_length = 0;
                var data_value = 0;

                var data_default_address = 0;
                var data_default_length = 0;

                var port = script.getStringField('PORT');
                var sensor = script.getStringField('SENSOR');

                var increase = 0;
                if (port == 'PORT_3') {
                    increase = 2;
                } else if (port == 'PORT_4') {
                    increase = 3;
                } else if (port == 'PORT_5') {
                    increase = 4;
                } else if (port == 'PORT_6') {
                    increase = 5;
                }

                if (sensor == 'AUX_SERVO_POSITION') {
                    data_default_address =
                        Entry.Robotis_openCM70.CONTROL_TABLE
                            .AUX_SERVO_POSITION[0];
                    data_default_length =
                        Entry.Robotis_openCM70.CONTROL_TABLE
                            .AUX_SERVO_POSITION[1];
                    data_address =
                        Entry.Robotis_openCM70.CONTROL_TABLE
                            .AUX_SERVO_POSITION[0];
                    data_length =
                        Entry.Robotis_openCM70.CONTROL_TABLE
                            .AUX_SERVO_POSITION[1];
                } else if (sensor == 'AUX_IR') {
                    data_default_address =
                        Entry.Robotis_openCM70.CONTROL_TABLE.AUX_IR[0];
                    data_default_length =
                        Entry.Robotis_openCM70.CONTROL_TABLE.AUX_IR[1];
                    data_address =
                        Entry.Robotis_openCM70.CONTROL_TABLE.AUX_IR[0];
                    data_length =
                        Entry.Robotis_openCM70.CONTROL_TABLE.AUX_IR[1];
                } else if (sensor == 'AUX_TOUCH') {
                    data_default_address =
                        Entry.Robotis_openCM70.CONTROL_TABLE.AUX_TOUCH[0];
                    data_default_length =
                        Entry.Robotis_openCM70.CONTROL_TABLE.AUX_TOUCH[1];
                    data_address =
                        Entry.Robotis_openCM70.CONTROL_TABLE.AUX_TOUCH[0];
                    data_length =
                        Entry.Robotis_openCM70.CONTROL_TABLE.AUX_TOUCH[1];
                } else if (sensor == 'AUX_TEMPERATURE') {
                    data_default_address =
                        Entry.Robotis_openCM70.CONTROL_TABLE.AUX_TEMPERATURE[0];
                    data_default_length =
                        Entry.Robotis_openCM70.CONTROL_TABLE.AUX_TEMPERATURE[1];
                    data_address =
                        Entry.Robotis_openCM70.CONTROL_TABLE.AUX_TEMPERATURE[0];
                    data_length =
                        Entry.Robotis_openCM70.CONTROL_TABLE.AUX_TEMPERATURE[1];
                } else if (sensor == 'AUX_BRIGHTNESS') {
                    data_default_address =
                        Entry.Robotis_openCM70.CONTROL_TABLE.AUX_BRIGHTNESS[0];
                    data_default_length =
                        Entry.Robotis_openCM70.CONTROL_TABLE.AUX_BRIGHTNESS[1];
                    data_address =
                        Entry.Robotis_openCM70.CONTROL_TABLE.AUX_BRIGHTNESS[0];
                    data_length =
                        Entry.Robotis_openCM70.CONTROL_TABLE.AUX_BRIGHTNESS[1];
                } else if (sensor == 'AUX_HYDRO_THEMO_HUMIDITY') {
                    data_default_address =
                        Entry.Robotis_openCM70.CONTROL_TABLE
                            .AUX_HYDRO_THEMO_HUMIDITY[0];
                    data_default_length =
                        Entry.Robotis_openCM70.CONTROL_TABLE
                            .AUX_HYDRO_THEMO_HUMIDITY[1];
                    data_address =
                        Entry.Robotis_openCM70.CONTROL_TABLE
                            .AUX_HYDRO_THEMO_HUMIDITY[0];
                    data_length =
                        Entry.Robotis_openCM70.CONTROL_TABLE
                            .AUX_HYDRO_THEMO_HUMIDITY[1];
                } else if (sensor == 'AUX_HYDRO_THEMO_TEMPER') {
                    data_default_address =
                        Entry.Robotis_openCM70.CONTROL_TABLE
                            .AUX_HYDRO_THEMO_TEMPER[0];
                    data_default_length =
                        Entry.Robotis_openCM70.CONTROL_TABLE
                            .AUX_HYDRO_THEMO_TEMPER[1];
                    data_address =
                        Entry.Robotis_openCM70.CONTROL_TABLE
                            .AUX_HYDRO_THEMO_TEMPER[0];
                    data_length =
                        Entry.Robotis_openCM70.CONTROL_TABLE
                            .AUX_HYDRO_THEMO_TEMPER[1];
                } else if (sensor == 'AUX_ULTRASONIC') {
                    data_default_address =
                        Entry.Robotis_openCM70.CONTROL_TABLE.AUX_ULTRASONIC[0];
                    data_default_length =
                        Entry.Robotis_openCM70.CONTROL_TABLE.AUX_ULTRASONIC[1];
                    data_address =
                        Entry.Robotis_openCM70.CONTROL_TABLE.AUX_ULTRASONIC[0];
                    data_length =
                        Entry.Robotis_openCM70.CONTROL_TABLE.AUX_ULTRASONIC[1];
                } else if (sensor == 'AUX_MAGNETIC') {
                    data_default_address =
                        Entry.Robotis_openCM70.CONTROL_TABLE.AUX_MAGNETIC[0];
                    data_default_length =
                        Entry.Robotis_openCM70.CONTROL_TABLE.AUX_MAGNETIC[1];
                    data_address =
                        Entry.Robotis_openCM70.CONTROL_TABLE.AUX_MAGNETIC[0];
                    data_length =
                        Entry.Robotis_openCM70.CONTROL_TABLE.AUX_MAGNETIC[1];
                } else if (sensor == 'AUX_MOTION_DETECTION') {
                    data_default_address =
                        Entry.Robotis_openCM70.CONTROL_TABLE
                            .AUX_MOTION_DETECTION[0];
                    data_default_length =
                        Entry.Robotis_openCM70.CONTROL_TABLE
                            .AUX_MOTION_DETECTION[1];
                    data_address =
                        Entry.Robotis_openCM70.CONTROL_TABLE
                            .AUX_MOTION_DETECTION[0];
                    data_length =
                        Entry.Robotis_openCM70.CONTROL_TABLE
                            .AUX_MOTION_DETECTION[1];
                } else if (sensor == 'AUX_COLOR') {
                    data_default_address =
                        Entry.Robotis_openCM70.CONTROL_TABLE.AUX_COLOR[0];
                    data_default_length =
                        Entry.Robotis_openCM70.CONTROL_TABLE.AUX_COLOR[1];
                    data_address =
                        Entry.Robotis_openCM70.CONTROL_TABLE.AUX_COLOR[0];
                    data_length =
                        Entry.Robotis_openCM70.CONTROL_TABLE.AUX_COLOR[1];
                } else if (sensor == 'AUX_CUSTOM') {
                    data_default_address =
                        Entry.Robotis_openCM70.CONTROL_TABLE.AUX_CUSTOM[0];
                    data_default_length =
                        Entry.Robotis_openCM70.CONTROL_TABLE.AUX_CUSTOM[1];
                    data_address =
                        Entry.Robotis_openCM70.CONTROL_TABLE.AUX_CUSTOM[0];
                    data_length =
                        Entry.Robotis_openCM70.CONTROL_TABLE.AUX_CUSTOM[1];
                }

                data_default_address =
                    data_default_address + increase * data_default_length;
                data_address = data_default_address;
                // if (increase != 0) {
                // data_length = 6 * data_default_length;
                // }

                if (
                    Entry.hw.sendQueue.prevAddress &&
                    Entry.hw.sendQueue.prevAddress == data_default_address
                ) {
                    if (
                        Entry.hw.sendQueue.prevTime &&
                        new Date() - Entry.hw.sendQueue.prevTime < 200
                    ) {
                        //throw new Entry.Utils.AsyncError();
                        return Entry.hw.sendQueue.prevResult;
                    }
                }

                Entry.Robotis_carCont.setRobotisData([
                    [
                        data_instruction,
                        data_address,
                        data_length,
                        data_value,
                        data_default_length,
                    ],
                ]);
                // Entry.hw.socket.send(JSON.stringify(Entry.hw.sendQueue));
                Entry.Robotis_carCont.update();

                var result = Entry.hw.portData[data_default_address];
                Entry.hw.sendQueue.prevAddress = data_default_address;
                Entry.hw.sendQueue.prevTime = new Date();
                Entry.hw.sendQueue.prevResult = result;

                return result;
            },
            syntax: {
                js: [],
                py: ['Robotis.opencm70_aux_sensor_value(%1, %2)'],
            },
        },
        robotis_openCM70_cm_buzzer_index: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.General.note_a + '(0)', '0'],
                        [Lang.General.note_a + '#(1)', '1'],
                        [Lang.General.note_b + '(2)', '2'],
                        [Lang.General.note_c + '(3)', '3'],
                        [Lang.General.note_c + '#(4)', '4'],
                        [Lang.General.note_d + '(5)', '5'],
                        [Lang.General.note_d + '#(6)', '6'],
                        [Lang.General.note_e + '(7)', '7'],
                        [Lang.General.note_f + '(8)', '8'],
                        [Lang.General.note_f + '#(9)', '9'],
                        [Lang.General.note_g + '(10)', '10'],
                        [Lang.General.note_g + '#(11)', '11'],
                        [Lang.General.note_a + '(12)', '12'],
                        [Lang.General.note_a + '#(13)', '13'],
                        [Lang.General.note_b + '(14)', '14'],
                        [Lang.General.note_c + '(15)', '15'],
                        [Lang.General.note_c + '#(16)', '16'],
                        [Lang.General.note_d + '(17)', '17'],
                        [Lang.General.note_d + '#(18)', '18'],
                        [Lang.General.note_e + '(19)', '19'],
                        [Lang.General.note_f + '(20)', '20'],
                        [Lang.General.note_f + '#(21)', '21'],
                        [Lang.General.note_g + '(22)', '22'],
                        [Lang.General.note_g + '#(23)', '23'],
                        [Lang.General.note_a + '(24)', '24'],
                        [Lang.General.note_a + '#(25)', '25'],
                        [Lang.General.note_b + '(26)', '26'],
                        [Lang.General.note_c + '(27)', '27'],
                        [Lang.General.note_c + '#(28)', '28'],
                        [Lang.General.note_d + '(29)', '29'],
                        [Lang.General.note_d + '#(30)', '30'],
                        [Lang.General.note_e + '(31)', '31'],
                        [Lang.General.note_f + '(32)', '32'],
                        [Lang.General.note_f + '#(33)', '33'],
                        [Lang.General.note_g + '(34)', '34'],
                        [Lang.General.note_g + '#(35)', '35'],
                        [Lang.General.note_a + '(36)', '36'],
                        [Lang.General.note_a + '#(37)', '37'],
                        [Lang.General.note_b + '(38)', '38'],
                        [Lang.General.note_c + '(39)', '39'],
                        [Lang.General.note_c + '#(40)', '40'],
                        [Lang.General.note_d + '(41)', '41'],
                        [Lang.General.note_d + '#(42)', '42'],
                        [Lang.General.note_e + '(43)', '43'],
                        [Lang.General.note_f + '(44)', '44'],
                        [Lang.General.note_f + '#(45)', '45'],
                        [Lang.General.note_g + '(46)', '46'],
                        [Lang.General.note_g + '#(47)', '47'],
                        [Lang.General.note_a + '(48)', '48'],
                        [Lang.General.note_a + '#(49)', '49'],
                        [Lang.General.note_b + '(50)', '50'],
                        [Lang.General.note_c + '(51)', '51'],
                    ],
                    value: '0',
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
                    null,
                ],
                type: 'robotis_openCM70_cm_buzzer_index',
            },
            paramsKeyMap: {
                CM_BUZZER_INDEX: 0,
                CM_BUZZER_TIME: 1,
            },
            class: 'robotis_openCM70_cm',
            isNotFor: ['Robotis_openCM70EDU'],
            func: function (sprite, script) {
                // instruction / address / length / value / default length
                var cmBuzzerIndex = script.getField('CM_BUZZER_INDEX', script);
                var cmBuzzerTime = script.getNumberValue(
                    'CM_BUZZER_TIME',
                    script
                );

                var data_instruction = Entry.Robotis_openCM70.INSTRUCTION.WRITE;
                var data_address_1 = 0;
                var data_length_1 = 0;
                var data_value_1 = 0;
                var data_address_2 = 0;
                var data_length_2 = 0;
                var data_value_2 = 0;
                var interval = 100;

                data_address_1 =
                    Entry.Robotis_openCM70.CONTROL_TABLE.CM_BUZZER_TIME[0];
                data_length_1 =
                    Entry.Robotis_openCM70.CONTROL_TABLE.CM_BUZZER_TIME[1];
                // data_value_1 = cmBuzzerTime * 10;
                // TODO 텍스트 입력으로 바꾸고 최대는 5초 : 0.5 초 하려면 5를 입력  - console.log(parseInt(0.59 * 10)); max 는 5초
                data_value_1 = parseInt(cmBuzzerTime * 10);
                if (data_value_1 > 50) {
                    data_value_1 = 50;
                }

                data_address_2 =
                    Entry.Robotis_openCM70.CONTROL_TABLE.CM_BUZZER_INDEX[0];
                data_length_2 =
                    Entry.Robotis_openCM70.CONTROL_TABLE.CM_BUZZER_INDEX[1];
                data_value_2 = cmBuzzerIndex;

                var data_sendqueue = [
                    [
                        data_instruction,
                        data_address_1,
                        data_length_1,
                        data_value_1,
                    ],
                    [
                        data_instruction,
                        data_address_2,
                        data_length_2,
                        data_value_2,
                    ],
                ];
                return Entry.Robotis_carCont.postCallReturn(
                    script,
                    data_sendqueue,
                    cmBuzzerTime * 1000 + interval
                );
            },
            syntax: {
                js: [],
                py: ['Robotis.opencm70_cm_buzzer_index(%1, %2)'],
            },
        },
        robotis_openCM70_cm_buzzer_melody: {
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
                        ['10', '10'],
                        ['11', '11'],
                        ['12', '12'],
                        ['13', '13'],
                        ['14', '14'],
                        ['15', '15'],
                        ['16', '16'],
                        ['17', '17'],
                        ['18', '18'],
                        ['19', '19'],
                        ['20', '20'],
                        ['21', '21'],
                        ['22', '22'],
                        ['23', '23'],
                        ['24', '24'],
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
                params: [null, null],
                type: 'robotis_openCM70_cm_buzzer_melody',
            },
            paramsKeyMap: {
                CM_BUZZER_MELODY: 0,
            },
            class: 'robotis_openCM70_cm',
            isNotFor: ['Robotis_openCM70EDU'],
            func: function (sprite, script) {
                // instruction / address / length / value / default length
                var cmBuzzerMelody = script.getField(
                    'CM_BUZZER_MELODY',
                    script
                );

                var data_instruction = Entry.Robotis_openCM70.INSTRUCTION.WRITE;
                var data_address_1 = 0;
                var data_length_1 = 0;
                var data_value_1 = 0;
                var data_address_2 = 0;
                var data_length_2 = 0;
                var data_value_2 = 0;
                var interval = 100;

                data_address_1 =
                    Entry.Robotis_openCM70.CONTROL_TABLE.CM_BUZZER_TIME[0];
                data_length_1 =
                    Entry.Robotis_openCM70.CONTROL_TABLE.CM_BUZZER_TIME[1];
                data_value_1 = 255;

                data_address_2 =
                    Entry.Robotis_openCM70.CONTROL_TABLE.CM_BUZZER_INDEX[0];
                data_length_2 =
                    Entry.Robotis_openCM70.CONTROL_TABLE.CM_BUZZER_INDEX[1];
                data_value_2 = cmBuzzerMelody;

                var data_sendqueue = [
                    [
                        data_instruction,
                        data_address_1,
                        data_length_1,
                        data_value_1,
                    ],
                    [
                        data_instruction,
                        data_address_2,
                        data_length_2,
                        data_value_2,
                    ],
                ];
                return Entry.Robotis_carCont.postCallReturn(
                    script,
                    data_sendqueue,
                    1000 + interval
                );
            },
            syntax: { js: [], py: ['Robotis.opencm70_cm_buzzer_melody(%1)'] },
        },
        robotis_openCM70_cm_sound_detected_clear: {
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
                type: 'robotis_openCM70_cm_sound_detected_clear',
            },
            class: 'robotis_openCM70_cm',
            isNotFor: ['Robotis_openCM70EDU'],
            func: function (sprite, script) {
                // instruction / address / length / value / default length

                var data_instruction = Entry.Robotis_openCM70.INSTRUCTION.WRITE;
                var data_address = 0;
                var data_length = 0;
                var data_value = 0;

                data_address =
                    Entry.Robotis_openCM70.CONTROL_TABLE.CM_SOUND_DETECTED[0];
                data_length =
                    Entry.Robotis_openCM70.CONTROL_TABLE.CM_SOUND_DETECTED[1];
                data_value = 0;

                var data_sendqueue = [
                    [data_instruction, data_address, data_length, data_value],
                ];
                return Entry.Robotis_carCont.postCallReturn(
                    script,
                    data_sendqueue,
                    Entry.Robotis_openCM70.delay
                );
            },
            syntax: { js: [], py: ['Robotis.opencm70_cm_sound_clear()'] },
        },
        robotis_openCM70_cm_led: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.robotis_common_red_color, 'CM_LED_R'],
                        [Lang.Blocks.robotis_common_green_color, 'CM_LED_G'],
                        [Lang.Blocks.robotis_common_blue_color, 'CM_LED_B'],
                    ],
                    value: 'CM_LED_R',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.robotis_common_on, '1'],
                        [Lang.Blocks.robotis_common_off, '0'],
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
                type: 'robotis_openCM70_cm_led',
            },
            paramsKeyMap: {
                CM_LED: 0,
                VALUE: 1,
            },
            class: 'robotis_openCM70_cm',
            isNotFor: ['Robotis_openCM70EDU'],
            func: function (sprite, script) {
                // instruction / address / length / value / default length
                var cmLed = script.getField('CM_LED', script);
                var value = script.getField('VALUE', script);

                var data_instruction = Entry.Robotis_openCM70.INSTRUCTION.WRITE;
                var data_address = 0;
                var data_length = 0;
                var data_value = 0;

                if (cmLed == 'CM_LED_R') {
                    data_address =
                        Entry.Robotis_openCM70.CONTROL_TABLE.CM_LED_R[0];
                    data_length =
                        Entry.Robotis_openCM70.CONTROL_TABLE.CM_LED_R[1];
                } else if (cmLed == 'CM_LED_G') {
                    data_address =
                        Entry.Robotis_openCM70.CONTROL_TABLE.CM_LED_G[0];
                    data_length =
                        Entry.Robotis_openCM70.CONTROL_TABLE.CM_LED_G[1];
                } else if (cmLed == 'CM_LED_B') {
                    data_address =
                        Entry.Robotis_openCM70.CONTROL_TABLE.CM_LED_B[0];
                    data_length =
                        Entry.Robotis_openCM70.CONTROL_TABLE.CM_LED_B[1];
                }

                data_value = value;

                var data_sendqueue = [
                    [data_instruction, data_address, data_length, data_value],
                ];
                return Entry.Robotis_carCont.postCallReturn(
                    script,
                    data_sendqueue,
                    Entry.Robotis_openCM70.delay
                );
            },
            syntax: { js: [], py: ['Robotis.opencm70_cm_led(%1, %2)'] },
        },
        robotis_openCM70_cm_motion: {
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
                        type: 'number',
                        params: ['1'],
                    },
                    null,
                ],
                type: 'robotis_openCM70_cm_motion',
            },
            paramsKeyMap: {
                VALUE: 0,
            },
            class: 'robotis_openCM70_cm',
            isNotFor: ['Robotis_openCM70EDU'],
            func: function (sprite, script) {
                // instruction / address / length / value / default length
                var data_instruction = Entry.Robotis_openCM70.INSTRUCTION.WRITE;
                var data_address = 0;
                var data_length = 0;
                var data_value = 0;

                data_address =
                    Entry.Robotis_openCM70.CONTROL_TABLE.CM_MOTION[0];
                data_length = Entry.Robotis_openCM70.CONTROL_TABLE.CM_MOTION[1];
                data_value = script.getNumberValue('VALUE', script);

                var data_sendqueue = [
                    [data_instruction, data_address, data_length, data_value],
                ];
                return Entry.Robotis_carCont.postCallReturn(
                    script,
                    data_sendqueue,
                    Entry.Robotis_openCM70.delay
                );
            },
            syntax: { js: [], py: ['Robotis.opencm70_cm_motion(%1)'] },
        },
        robotis_openCM70_aux_motor_speed: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.robotis_common_port_1, '1'],
                        [Lang.Blocks.robotis_common_port_2, '2'],
                    ],
                    value: '1',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.robotis_common_clockwhise, 'CW'],
                        [Lang.Blocks.robotis_common_counter_clockwhise, 'CCW'],
                    ],
                    value: 'CW',
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
                        type: 'number',
                        params: ['500'],
                    },
                    null,
                ],
                type: 'robotis_openCM70_aux_motor_speed',
            },
            paramsKeyMap: {
                PORT: 0,
                DIRECTION_ANGLE: 1,
                VALUE: 2,
            },
            class: 'robotis_openCM70_cm',
            isNotFor: ['Robotis_openCM70EDU'],
            func: function (sprite, script) {
                // instruction / address / length / value / default length
                var port = script.getField('PORT', script);
                var directionAngle = script.getField('DIRECTION_ANGLE', script);
                var value = script.getNumberValue('VALUE');

                var data_instruction = Entry.Robotis_openCM70.INSTRUCTION.WRITE;
                var data_address = 0;
                var data_length = 0;
                var data_value = 0;

                data_address =
                    Entry.Robotis_openCM70.CONTROL_TABLE.AUX_MOTOR_SPEED[0];
                data_length =
                    Entry.Robotis_openCM70.CONTROL_TABLE.AUX_MOTOR_SPEED[1];

                data_address = data_address + (port - 1) * data_length;

                if (directionAngle == 'CW') {
                    value = value + 1024;
                    if (value > 2047) {
                        value = 2047;
                    }
                } else {
                    if (value > 1023) {
                        value = 1023;
                    }
                }

                data_value = value;

                var data_sendqueue = [
                    [data_instruction, data_address, data_length, data_value],
                ];
                return Entry.Robotis_carCont.postCallReturn(
                    script,
                    data_sendqueue,
                    Entry.Robotis_openCM70.delay
                );
            },
            syntax: {
                js: [],
                py: ['Robotis.opencm70_aux_motor_speed(%1, %2, %3)'],
            },
        },
        robotis_openCM70_aux_servo_mode: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.robotis_common_port_3, '3'],
                        [Lang.Blocks.robotis_common_port_4, '4'],
                        [Lang.Blocks.robotis_common_port_5, '5'],
                        [Lang.Blocks.robotis_common_port_6, '6'],
                    ],
                    value: '3',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.robotis_common_wheel_mode, '0'],
                        [Lang.Blocks.robotis_common_joint_mode, '1'],
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
                params: [null, null, null],
                type: 'robotis_openCM70_aux_servo_mode',
            },
            paramsKeyMap: {
                PORT: 0,
                MODE: 1,
            },
            class: 'robotis_openCM70_cm',
            isNotFor: ['Robotis_openCM70EDU'],
            func: function (sprite, script) {
                // instruction / address / length / value / default length
                var port = script.getField('PORT', script);
                var mode = script.getField('MODE', script);

                var data_instruction = Entry.Robotis_openCM70.INSTRUCTION.WRITE;
                var data_address = 0;
                var data_length = 0;
                var data_value = 0;

                data_address =
                    Entry.Robotis_openCM70.CONTROL_TABLE.AUX_SERVO_MODE[0];
                data_length =
                    Entry.Robotis_openCM70.CONTROL_TABLE.AUX_SERVO_MODE[1];

                data_address = data_address + (port - 1) * data_length;
                data_value = mode;

                var data_sendqueue = [
                    [data_instruction, data_address, data_length, data_value],
                ];
                return Entry.Robotis_carCont.postCallReturn(
                    script,
                    data_sendqueue,
                    Entry.Robotis_openCM70.delay
                );
            },
            syntax: { js: [], py: ['Robotis.opencm70_aux_servo_mode(%1, %2)'] },
        },
        robotis_openCM70_aux_servo_speed: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.robotis_common_port_3, '3'],
                        [Lang.Blocks.robotis_common_port_4, '4'],
                        [Lang.Blocks.robotis_common_port_5, '5'],
                        [Lang.Blocks.robotis_common_port_6, '6'],
                    ],
                    value: '3',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.robotis_common_clockwhise, 'CW'],
                        [Lang.Blocks.robotis_common_counter_clockwhise, 'CCW'],
                    ],
                    value: 'CW',
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
                        type: 'number',
                        params: ['500'],
                    },
                    null,
                ],
                type: 'robotis_openCM70_aux_servo_speed',
            },
            paramsKeyMap: {
                PORT: 0,
                DIRECTION_ANGLE: 1,
                VALUE: 2,
            },
            class: 'robotis_openCM70_cm',
            isNotFor: ['Robotis_openCM70EDU'],
            func: function (sprite, script) {
                // instruction / address / length / value / default length
                var port = script.getField('PORT', script);
                var directionAngle = script.getField('DIRECTION_ANGLE', script);
                var value = script.getNumberValue('VALUE');

                var data_instruction = Entry.Robotis_openCM70.INSTRUCTION.WRITE;
                var data_address = 0;
                var data_length = 0;
                var data_value = 0;

                data_address =
                    Entry.Robotis_openCM70.CONTROL_TABLE.AUX_SERVO_SPEED[0];
                data_length =
                    Entry.Robotis_openCM70.CONTROL_TABLE.AUX_SERVO_SPEED[1];

                data_address = data_address + (port - 1) * data_length;

                if (directionAngle == 'CW') {
                    value = value + 1024;
                    if (value > 2047) {
                        value = 2047;
                    }
                } else {
                    if (value > 1023) {
                        value = 1023;
                    }
                }

                data_value = value;

                var data_sendqueue = [
                    [data_instruction, data_address, data_length, data_value],
                ];
                return Entry.Robotis_carCont.postCallReturn(
                    script,
                    data_sendqueue,
                    Entry.Robotis_openCM70.delay
                );
            },
            syntax: {
                js: [],
                py: ['Robotis.opencm70_aux_servo_speed(%1, %2, %3)'],
            },
        },
        robotis_openCM70_aux_servo_position: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.robotis_common_port_3, '3'],
                        [Lang.Blocks.robotis_common_port_4, '4'],
                        [Lang.Blocks.robotis_common_port_5, '5'],
                        [Lang.Blocks.robotis_common_port_6, '6'],
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
                        type: 'number',
                        params: ['512'],
                    },
                    null,
                ],
                type: 'robotis_openCM70_aux_servo_position',
            },
            paramsKeyMap: {
                PORT: 0,
                VALUE: 1,
            },
            class: 'robotis_openCM70_cm',
            isNotFor: ['Robotis_openCM70EDU'],
            func: function (sprite, script) {
                // instruction / address / length / value / default length
                var port = script.getField('PORT', script);
                var value = script.getNumberValue('VALUE');

                var data_instruction = Entry.Robotis_openCM70.INSTRUCTION.WRITE;
                var data_address = 0;
                var data_length = 0;
                var data_value = 0;

                data_address =
                    Entry.Robotis_openCM70.CONTROL_TABLE.AUX_SERVO_POSITION[0];
                data_length =
                    Entry.Robotis_openCM70.CONTROL_TABLE.AUX_SERVO_POSITION[1];

                data_address = data_address + (port - 1) * data_length;

                if (value > 1023) {
                    value = 1023;
                } else if (value < 0) {
                    value = 0;
                }

                data_value = value;

                var data_sendqueue = [
                    [data_instruction, data_address, data_length, data_value],
                ];
                return Entry.Robotis_carCont.postCallReturn(
                    script,
                    data_sendqueue,
                    Entry.Robotis_openCM70.delay
                );
            },
            syntax: {
                js: [],
                py: ['Robotis.opencm70_aux_servo_position(%1, %2)'],
            },
        },
        robotis_openCM70_aux_led_module: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.robotis_common_port_3, '3'],
                        [Lang.Blocks.robotis_common_port_4, '4'],
                        [Lang.Blocks.robotis_common_port_5, '5'],
                        [Lang.Blocks.robotis_common_port_6, '6'],
                    ],
                    value: '3',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [
                            Lang.Blocks.robotis_cm_led_both +
                                Lang.Blocks.robotis_common_off,
                            '0',
                        ],
                        [
                            Lang.Blocks.robotis_cm_led_right +
                                Lang.Blocks.robotis_common_on,
                            '1',
                        ],
                        [
                            Lang.Blocks.robotis_cm_led_left +
                                Lang.Blocks.robotis_common_on,
                            '2',
                        ],
                        [
                            Lang.Blocks.robotis_cm_led_both +
                                Lang.Blocks.robotis_common_on,
                            '3',
                        ],
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
                params: [null, null, null],
                type: 'robotis_openCM70_aux_led_module',
            },
            paramsKeyMap: {
                PORT: 0,
                LED_MODULE: 1,
            },
            class: 'robotis_openCM70_cm',
            isNotFor: ['Robotis_openCM70EDU'],
            func: function (sprite, script) {
                // instruction / address / length / value / default length
                var port = script.getField('PORT', script);
                var ledModule = script.getField('LED_MODULE', script);

                var data_instruction = Entry.Robotis_openCM70.INSTRUCTION.WRITE;
                var data_address = 0;
                var data_length = 0;
                var data_value = 0;

                data_address =
                    Entry.Robotis_openCM70.CONTROL_TABLE.AUX_LED_MODULE[0];
                data_length =
                    Entry.Robotis_openCM70.CONTROL_TABLE.AUX_LED_MODULE[1];

                data_address = data_address + (port - 1) * data_length;
                data_value = ledModule;

                var data_sendqueue = [
                    [data_instruction, data_address, data_length, data_value],
                ];
                return Entry.Robotis_carCont.postCallReturn(
                    script,
                    data_sendqueue,
                    Entry.Robotis_openCM70.delay
                );
            },
            syntax: { js: [], py: ['Robotis.opencm70_aux_led_module(%1, %2)'] },
        },
        robotis_openCM70_aux_custom: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.robotis_common_port_3, '3'],
                        [Lang.Blocks.robotis_common_port_4, '4'],
                        [Lang.Blocks.robotis_common_port_5, '5'],
                        [Lang.Blocks.robotis_common_port_6, '6'],
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
                        type: 'number',
                        params: ['0'],
                    },
                    null,
                ],
                type: 'robotis_openCM70_aux_custom',
            },
            paramsKeyMap: {
                PORT: 0,
                VALUE: 1,
            },
            class: 'robotis_openCM70_cm',
            isNotFor: ['Robotis_openCM70EDU'],
            func: function (sprite, script) {
                // instruction / address / length / value / default length
                var port = script.getField('PORT', script);
                var value = script.getNumberValue('VALUE');

                var data_instruction = Entry.Robotis_openCM70.INSTRUCTION.WRITE;
                var data_address = 0;
                var data_length = 0;
                var data_value = 0;

                data_address =
                    Entry.Robotis_openCM70.CONTROL_TABLE.AUX_CUSTOM[0];
                data_length =
                    Entry.Robotis_openCM70.CONTROL_TABLE.AUX_CUSTOM[1];

                data_address = data_address + (port - 1) * data_length;
                data_value = value;

                var data_sendqueue = [
                    [data_instruction, data_address, data_length, data_value],
                ];
                return Entry.Robotis_carCont.postCallReturn(
                    script,
                    data_sendqueue,
                    Entry.Robotis_openCM70.delay
                );
            },
            syntax: { js: [], py: ['Robotis.opencm70_aux_custom(%1, %2)'] },
        },
        robotis_openCM70_cm_custom: {
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
                        type: 'number',
                        params: ['0'],
                    },
                    {
                        type: 'number',
                        params: ['0'],
                    },
                    null,
                ],
                type: 'robotis_openCM70_cm_custom',
            },
            paramsKeyMap: {
                ADDRESS: 0,
                VALUE: 1,
            },
            class: 'robotis_openCM70_custom',
            isNotFor: ['Robotis_openCM70EDU'],
            func: function (sprite, script) {
                // instruction / address / length / value / default length
                var data_instruction = Entry.Robotis_openCM70.INSTRUCTION.WRITE;
                var data_address = 0;
                var data_length = 0;
                var data_value = 0;

                data_address = script.getNumberValue('ADDRESS');
                data_value = script.getNumberValue('VALUE');
                if (data_value > 65535) {
                    data_length = 4;
                } else if (data_value > 255) {
                    data_length = 2;
                } else {
                    data_length = 1;
                }

                var data_sendqueue = [
                    [data_instruction, data_address, data_length, data_value],
                ];
                return Entry.Robotis_carCont.postCallReturn(
                    script,
                    data_sendqueue,
                    Entry.Robotis_openCM70.delay
                );
            },
            syntax: { js: [], py: ['Robotis.opencm70_cm_custom(%1, %2)'] },
        },
        //endregion robotis 로보티즈
    };
};*/

module.exports = [Entry.Robotis_carCont, Entry.Robotis_openCM70, Entry.Robotis_openCM70EDU];
