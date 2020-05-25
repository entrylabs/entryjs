'use strict';

Entry.Robotis_DREAM = {
    MODULE_VALUE:{
        DEFAULT: 0,
        PASSIVE: 1,
        IR: 2,
        LED: 3,
        COLOR: 4,
        MOISTURE: 5,
        IRARRAY: 6,
        SERVO: 7,
    },
    INSTRUCTION: {
        NONE: 0,
        WRITE: 3,
        READ: 2,
    },
    CONTROL_TABLE: {
        // [default address, default length, address (when reads together), length (when reads together)]
        CM_LED: [212, 1, 213, 1],
        CM_SPRING_RIGHT: [69, 1, 69, 2],
        CM_SPRING_LEFT: [70, 1, 69, 2],
        CM_SWITCH: [71, 1],
        CM_SOUND_DETECTED: [86, 1],
        CM_SOUND_DETECTING: [87, 1],
        CM_IR_LEFT: [91, 2],
        CM_IR_RIGHT: [93, 2],
        CM_IR_CENTER: [95, 2],
        CM_IR_SENSOR: [172, 2, 174, 2],
        CM_TOUCH_SENSOR: [204, 1, 205, 1],
        CM_TEMPERATURE_SENSOR: [236, 1, 237, 1],
        CM_ULTRASONIC_SENSOR: [244, 1, 245, 1],
        CM_MAGNETIC_SENSOR: [252, 1, 253, 1],
        CM_MOTION_SENSOR: [260, 1, 261, 1],
        CM_COLOR_SENSOR: [268, 1, 269, 1],
        CM_HUMIDITY_SENSOR: [276, 1, 277, 1],
        CM_HTEMPERATURE_SENSOR: [284, 1, 285, 1],
        CM_BRIGHTNESS_SENSOR: [292, 2, 294, 2],
        CM_MODULE_CLASS: [104, 105],

        AUX_SERVO_MODE: [128, 1, 129, 1],
        AUX_SERVO_SPEED: [136, 2, 138, 2],
        AUX_SERVO_POSITION: [156, 2, 158, 2],
        AUX_MOTOR_SPEED: [152, 2, 154, 2],        
    },
    IRS_MODULEWRITE: {
        PORT3: false,
        PORT4: false,
    },
    SERVO_MODULEWRITE: {
        PORT3: false,
        PORT4: false,
    },
    SERVO_WHEELWRITE: {
        PORT3: false,
        PORT4: false,
    },
    SERVO_POSITIONWRITE: {
        PORT3: false,
        PORT4: false,
    },
    COLOR_MODULEWRITE: {
        PORT3: false,
        PORT4: false,
    },
    TEMPER_MOISTURE_MODULEWRITE: {
        PORT3: false,
        PORT4: false,
    },
    setZero: function () {
        // instruction / address / length / value / default length
        Entry.hw.sendQueue['setZero'] = [1];
        this.update();
        this.setRobotisData(null);
        Entry.hw.sendQueue['setZero'] = null;
        this.update();
        this.setRobotisData([
            [Entry.Robotis_DREAM.INSTRUCTION.WRITE, 86, 1, 0],
            [Entry.Robotis_DREAM.INSTRUCTION.WRITE, 136, 4, 0],
            [Entry.Robotis_DREAM.INSTRUCTION.WRITE, 152, 4, 0],
            [Entry.Robotis_DREAM.INSTRUCTION.WRITE, Entry.Robotis_DREAM.CONTROL_TABLE.CM_MODULE_CLASS[0], 2, 0],
            //[Entry.Robotis_DREAM.INSTRUCTION.WRITE, 154, 2, 0],
        ]);

        this.update();


        Entry.Robotis_DREAM.IRS_MODULEWRITE.PORT3 = false;
        Entry.Robotis_DREAM.IRS_MODULEWRITE.PORT4 = false;

        Entry.Robotis_DREAM.SERVO_MODULEWRITE.PORT3 = false;
        Entry.Robotis_DREAM.SERVO_MODULEWRITE.PORT4 = false;

        Entry.Robotis_DREAM.SERVO_WHEELWRITE.PORT3 = false;
        Entry.Robotis_DREAM.SERVO_WHEELWRITE.PORT4 = false;

        Entry.Robotis_DREAM.SERVO_POSITIONWRITE.PORT3 = false;
        Entry.Robotis_DREAM.SERVO_POSITIONWRITE.PORT4 = false;

        Entry.Robotis_DREAM.COLOR_MODULEWRITE.PORT3 = false;
        Entry.Robotis_DREAM.COLOR_MODULEWRITE.PORT4 = false;

        Entry.Robotis_DREAM.TEMPER_MOISTURE_MODULEWRITE.PORT3 = false;
        Entry.Robotis_DREAM.TEMPER_MOISTURE_MODULEWRITE.PORT4 = false;

    },
    id: '7.4',
    name: 'robotis_Dream',
    url: 'http://www.robotis.com/index/product.php?cate_code=111310',
    imageName: 'robotis_carCont.png',
    title: {
        "ko": "로보티즈 드림",
        "en": "Robotis Robot car"
    },
    delay: 15,
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
            setTimeout(function () {
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
    wait: function (sq, ms) {
        Entry.hw.socket.send(JSON.stringify(sq));

        var start = new Date().getTime();
        var end = start;
        while (end < start + ms) {
            //wait XX ms
            end = new Date().getTime();
        }
    },
    update: function () {
        Entry.hw.update();
        var ROBOTIS_DATA = Entry.hw.sendQueue['ROBOTIS_DATA'];
        if (ROBOTIS_DATA) {
            ROBOTIS_DATA.forEach(function (data) {
                data['send'] = true;
            });
        }
        this.setRobotisData(null);
    },
    filterSendData: function () {
        var ROBOTIS_DATA = Entry.hw.sendQueue['ROBOTIS_DATA'];
        if (ROBOTIS_DATA) {
            return ROBOTIS_DATA.filter(function (data) {
                return data.send !== true;
            });
        } else {
            return null;
        }
    },
    setRobotisData: function (data) {
        var filterData = this.filterSendData();
        if (data == null) {
            Entry.hw.sendQueue['ROBOTIS_DATA'] = filterData;
        } else {
            Entry.hw.sendQueue['ROBOTIS_DATA'] = filterData
                ? filterData.concat(data)
                : data;
        }
    },
};
module.exports = Entry.Robotis_DREAM;



