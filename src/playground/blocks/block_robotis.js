"use strict";

Entry.Robotis_carCont = {
    INSTRUCTION : {
        NONE: 0,
        WRITE: 3,
        READ: 2
    },
    CONTROL_TABLE : {
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

        AUX_MOTOR_SPEED_LEFT: [152, 2],// car_cont
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
            [Entry.Robotis_carCont.INSTRUCTION.WRITE, 154, 2, 0]
        ]);
        
        this.update();
    },
    name: 'robotis_carCont',
    delay: 40,
    postCallReturn: function (script, data, ms) {
        if (ms <= 0) {
            this.setRobotisData(data);
            this.update();
            return script.callReturn();
        }

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
        while(end < start + ms) {//wait XX ms
            end = new Date().getTime();
        }
    },
    update: function() {
        Entry.hw.update();
        var ROBOTIS_DATA = Entry.hw.sendQueue['ROBOTIS_DATA'];
        if(ROBOTIS_DATA){
            ROBOTIS_DATA.forEach(function (data) {
                data['send'] = true;
            });
        }
        this.setRobotisData(null);
    },
    filterSendData: function () {
        var ROBOTIS_DATA = Entry.hw.sendQueue['ROBOTIS_DATA'];
        if(ROBOTIS_DATA) {
            return ROBOTIS_DATA.filter(function (data) {
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
            Entry.hw.sendQueue['ROBOTIS_DATA'] = (filterData) ? filterData.concat(data) : data;
        }
    }
};

Entry.Robotis_openCM70 = {
    INSTRUCTION : {
        NONE: 0,
        WRITE: 3,
        READ: 2
    },
    CONTROL_TABLE : {
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
    IRS_MODULEWRITE : {
        PORT3: false,
        PORT4: false,
        PORT5: false,
        PORT6: false
    },
    SERVO_MODULEWRITE : {
        PORT3: false,
        PORT4: false,
        PORT5: false,
        PORT6: false
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
    name: 'robotis_openCM70',
    delay: 15,
};